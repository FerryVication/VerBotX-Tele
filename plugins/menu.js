import { Markup } from "telegraf";
import moment from "moment-timezone";

const categoryIcons = {
  main: "🏠",
  downloader: "⬇️",
  download: "⬇️",
  tools: "🛠️",
  internet: "🌐",
  info: "ℹ️",
  advanced: "🌟",
  stalk: "📰",
  group: "👥",
  admin: "👑",
  owner: "🧑‍💻",
  ai: "🤖",
  fun: "🎮",
  search: "🔍",
  sticker: "🖼️",
};

export default {
  help: ["menu"],
  tags: ["main"],
  command: /^(menu|help|menu:.*)$/i,

  async handler(m, { conn }) {
    // ===== CALLBACK MENU =====
    if (m.text.startsWith("menu:")) {
      const category = m.text.split(":")[1];

      const cmds = [];
      for (const plugin of Object.values(global.plugins)) {
        if (!plugin?.tags || !plugin?.help) continue;
        if (plugin.tags.includes(category)) {
          cmds.push(...plugin.help);
        }
      }

      if (!cmds.length) {
        return m.reply(`❌ Kategori *${category}* kosong`);
      }

      return m.reply(
        `📂 *${category.toUpperCase()}*\n\n` +
          cmds.map((c) => `• /${c}`).join("\n"),
      );
    }

    // ===== MENU UTAMA =====
    const menuImage = "https://CDN.ferdev.my.id/assets/elfar/IMG_5017.jpeg";
    const categories = new Set();
    for (const plugin of Object.values(global.plugins)) {
      if (plugin?.tags) plugin.tags.forEach((t) => categories.add(t));
    }

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const mnt = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const ucpn = ucapan();
    const user = m.name || "kakak";
    const dataUser = global.db.data.users[m.sender];
    const caption = `*✧────···[ ᴍᴀɪɴ ᴍᴇɴᴜ ]···────✧*
  \tʜᴀʟʟᴏ, ${ucpn} ${dataUser.registered ? dataUser.name : user}
  ├────···[ ᴘᴇɴɢɢᴜɴᴀ ]···────✧
  │⬡ *ɴᴀᴍᴀ : ${dataUser.registered ? dataUser.name : user}*
  │⬡ *ʟᴇᴠᴇʟ : ${dataUser.level}*
  │⬡ *ᴘʟᴀɴ* : ${dataUser.isPrems ? "ᴘʀᴇᴍɪᴜᴍ ᴜꜱᴇʀ👑" : "ꜰʀᴇᴇ ᴜꜱᴇʀ😜"}
  │⬡ *ʟɪᴍɪᴛ* : ${dataUser.isPrems ? "ᴜɴʟɪᴍɪᴛᴇᴅ" : dataUser.limit}
  ├────···[ *ᴠ1.0.0* ]···────✧
  │⬡ *ᴠᴇʀʙᴏᴛx ᴛᴇʟᴀʜ ᴀᴋᴛɪꜰ ꜱᴇʟᴀᴍᴀ* :
  │⬡ ${h}h ${mnt}m ${s}s
  │⬡ *${Object.keys(global.db.data.users).length}* ᴘᴇɴɢɢᴜɴᴀ ᴠᴇʀʙᴏᴛx
  ├━━━━━━━━━━━━━━━━┈─⋆
  │ ▸ *ᴀᴜᴛʜᴏʀ :* ꜰᴇʀɪ ᴘʀᴀᴛᴀᴍᴀ
  ┴ ▸ *ᴏᴡɴᴇʀ :* ꜰᴇʀʀʏ
  │
  ├────···[ *𝚂𝚄𝙱 𝙼𝙴𝙽𝚄* ]···────✧`;

    const hcaption = `📜 *MENU UTAMA*

🤖 *${global.botname}*
👑 Owner: ${global.ownername}

📊 *Statistik*
👥 Users: ${Object.keys(global.db.data.users || {}).length}
💬 Chats: ${Object.keys(global.db.data.chats || {}).length}
⏱️ Uptime: ${h}h ${mnt}m ${s}s

👇 Pilih kategori di bawah`;

    const buttons = [...categories].map((cat) => {
      const icon = categoryIcons[cat] || "📂";
      return Markup.button.callback(
        `${icon} ${cat.toUpperCase()}`,
        `menu:${cat}`,
      );
    });

    return conn.telegram.sendPhoto(m.chat, menuImage, {
      caption,
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard(chunk(buttons, 2)),
    });
  },
};

function chunk(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

function ucapan() {
  const time = moment.tz("Asia/Jakarta").format("HH");
  var res = "ᴊᴀɴɢᴀɴ ʟᴜᴘᴀ ᴛɪᴅᴜʀ ᴋᴀᴋ💗";
  if (time >= 4) {
    res = "ꜱᴇʟᴀᴍᴀᴛ ᴘᴀɢɪ ᴋᴀᴋ";
  }
  if (time > 10) {
    res = "ꜱᴇʟᴀᴍᴀᴛ ꜱɪᴀɴɢ ᴋᴀᴋ";
  }
  if (time >= 15) {
    res = "ꜱᴇʟᴀᴍᴀᴛ ꜱᴏʀᴇ ᴋᴀᴋ";
  }
  if (time >= 18) {
    res = "ꜱᴇʟᴀᴍᴀᴛ ᴍᴀʟᴀᴍ ᴋᴀᴋ";
  }
  return res;
}
