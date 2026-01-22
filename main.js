import "./config.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Telegraf, Markup } from "telegraf";
import { fileURLToPath, pathToFileURL } from "url";

// Database (lowdb lite bundled in lib/lowdb)
import { Low, JSONFile } from "./lib/lowdb/index.js";

// Core handler and helpers
import * as Core from "./handler.js";
import attachSimpleHelpers from "./lib/simple.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Basic guards
if (!global.token || String(global.token).trim().length === 0) {
  console.error("\u274c Missing bot token. Set global.token in config.js");
  process.exit(1);
}

// Normalize ownerid/premid to arrays of strings
const normalizeIds = (v) =>
  Array.isArray(v)
    ? v.map((x) => String(x))
    : String(v || "")
        .split(/[\s,]+/)
        .map((x) => x.trim())
        .filter(Boolean);
global.ownerid = normalizeIds(global.ownerid);
global.premid = normalizeIds(global.premid);
global.prefix = Array.isArray(global.prefix)
  ? global.prefix
  : ["/", ".", "#", "!"];
global.opts = global.opts || {};

// ---- Database setup
const dbFile = path.join(__dirname, "database.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);
global.db = db;

const defaultDB = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
};

let dbLoadedOnce = false;
let dbSaving = false;
let dbDirty = false;

async function loadDatabase() {
  await db.read();
  if (!db.data) db.data = JSON.parse(JSON.stringify(defaultDB));
  // Fill defaults (non-destructive)
  for (const k of Object.keys(defaultDB))
    db.data[k] = db.data[k] || JSON.parse(JSON.stringify(defaultDB[k]));
  dbLoadedOnce = true;
}

async function saveDatabase() {
  if (!dbLoadedOnce) return;
  if (dbSaving) {
    dbDirty = true;
    return;
  }
  dbSaving = true;
  try {
    await db.write();
  } finally {
    dbSaving = false;
    if (dbDirty) {
      dbDirty = false;
      setImmediate(saveDatabase);
    }
  }
}

global.loadDatabase = loadDatabase;

// Periodic autosave
setInterval(() => saveDatabase().catch(() => {}), 15_000);

// ---- Plugins loader
const pluginsDir = path.join(__dirname, "plugins");
global.plugins = {};
// ---- Bot setup
const bot = new Telegraf(global.token);
// Use bot instance as conn so .on() is available for simple.js middleware
const conn = bot;
conn.botInfo = null;

// Attach friendly helpers to conn (adds sendMessage/sendFile/reply/etc and a message middleware)
attachSimpleHelpers(conn);

async function safeAnswerCb(ctx) {
  if (!ctx?.callbackQuery) return;
  if (ctx._answeredCb) return;
  ctx._answeredCb = true;
  try {
    await ctx.answerCbQuery();
  } catch {}
}
// getName helper cache enhancer (will fallback to simple.js default until cache fills)
const nameCache = new Map();

async function refreshBotInfo() {
  try {
    conn.botInfo = await bot.telegram.getMe();
    // Enhance getName with async lookup once (cache lazily)
    conn.getName = (id) => {
      const key = String(id);
      if (nameCache.has(key)) return nameCache.get(key);
      (async () => {
        try {
          // getChat works for users/groups
          const chat = await bot.telegram.getChat(id);
          const name =
            chat.first_name || chat.title || chat.username || String(id);
          nameCache.set(key, name);
        } catch {
          nameCache.set(key, String(id));
        }
      })();
      return key;
    };
  } catch (e) {
    console.error("Failed to fetch bot info:", e.message);
  }
}

// Build message object compatible with handler.js and plugins
async function buildMessage(ctx) {
  const msg =
    ctx.message ||
    ctx.editedMessage ||
    ctx.channelPost ||
    ctx.editedChannelPost ||
    {};
  const chat = ctx.chat || msg.chat || {};
  const from = ctx.from || msg.from || {};
  // Support callback query data as synthetic text so plugins can parse it like a normal command
  const cbData = ctx.callbackQuery?.data;
  const text = msg.text || msg.caption || cbData || "";
  const isGroup = chat.type === "group" || chat.type === "supergroup";
  // IDs
  const chatId = chat.id;
  const senderId = from.id;

  // Permissions (best-effort, safe-defaults)
  let isBotAdmin = false;
  let isAdmin = false;
  if (isGroup && chatId && conn.botInfo?.id) {
    try {
      const botMember = await bot.telegram.getChatMember(
        chatId,
        conn.botInfo.id,
      );
      isBotAdmin = ["administrator", "creator"].includes(botMember.status);
    } catch {}
    try {
      const userMember = await bot.telegram.getChatMember(chatId, senderId);
      isAdmin = ["administrator", "creator"].includes(userMember.status);
    } catch {}
  }

  const m = {
    id: msg.message_id,
    chat: chatId,
    sender: senderId,
    name: from.first_name || from.username || "Unknown",
    text,
    isCallback: Boolean(ctx.callbackQuery),
    callbackData: cbData,
    isGroup,
    isAdmin,
    isBotAdmin,
    fromMe: false,
    isSimulated: false,
    callbackQuery: ctx.callbackQuery || null,
    participants: [],
    quoted: null,
    fakeObj: ctx.update, // For print logger
    reply: (txt, quoted) =>
      conn.sendMessage(
        chatId,
        { text: txt },
        { quoted: quoted || { message_id: msg.message_id } },
      ),
  };

  // participants (admins list as best-effort)
  if (isGroup) {
    try {
      const admins = await bot.telegram.getChatAdministrators(chatId);
      m.participants = admins.map((a) => a.user.id);
    } catch {}
  }

  return m;
}

// Participant updates (join/leave, bot status)
bot.on("my_chat_member", async (ctx) => {
  try {
    await Core.participantsUpdate.call(conn, ctx);
  } catch (e) {
    console.error(e);
  }
});
bot.on("chat_member", async (ctx) => {
  try {
    await Core.participantsUpdate.call(conn, ctx);
  } catch (e) {
    console.error(e);
  }
});

// ================= LOAD PLUGINS =================
async function loadPlugins() {
  const list = fs.readdirSync(pluginsDir).filter((f) => f.endsWith(".js"));
  const newMap = {};

  for (const file of list) {
    try {
      const full = path.join(pluginsDir, file);
      const fileUrl = pathToFileURL(full).href + `?v=${Date.now()}`;
      const mod = await import(fileUrl);
      newMap[file] = mod.default || mod;
    } catch (e) {
      console.error(`Failed loading plugin ${file}:`, e.message);
    }
  }

  global.plugins = newMap;
  console.log(
    chalk.green(`✅ Loaded ${Object.keys(global.plugins).length} plugins`),
  );
}

// ================= BUILD MENU MAP =================
function buildMenuMap() {
  const map = {};

  for (const plugin of Object.values(global.plugins || {})) {
    if (!plugin.tags || !plugin.help) continue;

    plugin.tags.forEach((tag) => {
      if (!map[tag]) map[tag] = [];
      plugin.help.forEach((cmd) => {
        if (!map[tag].includes(cmd)) {
          map[tag].push(cmd);
        }
      });
    });
  }

  return map;
}

// CALLBACK MENU CATEGORY
bot.action(/menu:(.+)/, async (ctx) => {
  const key = ctx.match[1];
  const menuMap = buildMenuMap();

  // BACK
  if (key === "back") {
    return ctx.editMessageCaption(`		📜 *SUB MENU*`, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard(
        chunk(
          Object.keys(menuMap).map((cat) =>
            Markup.button.callback(`📂 ${cat.toUpperCase()}`, `menu:${cat}`),
          ),
          2,
        ),
      ),
    });
  }

  const list = menuMap[key];
  if (!list) {
    return ctx.answerCbQuery("Menu tidak ditemukan");
  }

  let text = `╭─『 *MENU ${key.toUpperCase()}* 』\n`;

  list.forEach((cmd) => {
    text += `│ • /${cmd}\n`;
  });

  text += `╰──────────────࿐`;
  await ctx.answerCbQuery();

  return ctx.editMessageCaption(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅ Back", "menu:back")],
    ]),
  });
});
// ================= MESSAGE FALLBACK =================
bot.on("message", async (ctx) => {
  try {
    await loadDatabase();
    const m = await buildMessage(ctx);
    await Core.handler.call(conn, m);
    saveDatabase().catch(() => {});
  } catch (e) {
    console.error("Message error:", e);
  }
});

// ================= CALLBACK FALLBACK =================
bot.on("callback_query", async (ctx, next) => {
  const data = ctx.callbackQuery?.data;

  // BIAR MENU DITANGANI bot.action
  if (data && data.startsWith("menu:")) {
    return next();
  }

  try {
    await safeAnswerCb(ctx);

    await loadDatabase();
    const m = await buildMessage(ctx);
    await Core.handler.call(conn, m);
    saveDatabase().catch(() => {});
  } catch (e) {
    console.error("Callback error:", e);
  }
});

// ================= BOOT =================
(async () => {
  try {
    await loadPlugins();

    // hot reload
    fs.watch(pluginsDir, { persistent: false }, async (_, file) => {
      if (file?.endsWith(".js")) {
        try {
          await loadPlugins();
        } catch {}
      }
    });

    await bot.launch();
    console.log(chalk.cyan("🤖 Bot is running"));
  } catch (e) {
    console.error("❌ Failed to launch bot:", e);
    process.exit(1);
  }
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// ================= UTIL =================
function chunk(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}
// Hot-reload support
fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename);
  console.log(chalk.redBright("Update main.js"));
});

// Parent IPC helpers
process.on("message", (msg) => {
  if (msg === "uptime") {
    try {
      process.send && process.send(process.uptime());
    } catch {}
  }
});
