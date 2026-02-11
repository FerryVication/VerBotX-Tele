const handler = async (m, { args, usedPrefix, command, conn }) => {
  try {
    const base = m.fakeObj?.message;

    // Resolve target user ID: order = reply -> text_mention -> @username -> numeric id
    let targetId = base?.reply_to_message?.from?.id;
    let usernameFromEntity = null;
    const text = base?.text || m.text || "";
    const entities = base?.entities || [];

    // Entities handling
    for (const ent of entities) {
      if (ent?.type === "text_mention" && ent.user?.id) {
        targetId = ent.user.id;
        break;
      }
      if (
        ent?.type === "mention" &&
        typeof ent.offset === "number" &&
        typeof ent.length === "number"
      ) {
        const mention = text.substring(ent.offset, ent.offset + ent.length);
        if (mention?.startsWith("@")) usernameFromEntity = mention.slice(1);
      }
    }

    let daysArg;

    // If not resolved yet, read args
    if (!targetId) {
      if (args[0] && args[0].startsWith("@")) {
        usernameFromEntity = args[0].slice(1);
        daysArg = args[1];
      } else if (args[0] && /^\d{5,}$/.test(args[0])) {
        targetId = args[0];
        daysArg = args[1];
      } else {
        // If replying, first arg is days
        daysArg = args[0];
      }
    } else {
      daysArg = args[0];
    }

    // If we have a @username, try to resolve to user id
    if (!targetId && usernameFromEntity) {
      try {
        // Try using Telegram API to resolve username to chat (user) id
        const chatInfo = await conn.telegram.getChat("@" + usernameFromEntity);
        if (chatInfo?.id) targetId = chatInfo.id;
      } catch {}
    }

    // Fallback: search among group admins by username
    if (!targetId && usernameFromEntity && m.isGroup) {
      try {
        const admins = await conn.telegram.getChatAdministrators(m.chat);
        const found = admins?.find(
          (a) =>
            a?.user?.username &&
            a.user.username.toLowerCase() === usernameFromEntity.toLowerCase(),
        );
        if (found?.user?.id) targetId = found.user.id;
      } catch {}
    }

    // Final fallback: use cache if available
    if (!targetId && usernameFromEntity && global.usernameCache) {
      const hit = global.usernameCache[usernameFromEntity.toLowerCase()];
      if (hit) targetId = hit;
    }

    // Parse duration (days); default 30
    let days = 30;
    if (typeof daysArg === "string" && daysArg.trim()) {
      const d = parseInt(daysArg.trim(), 10);
      if (!Number.isNaN(d) && d >= 0) days = d;
    }

    if (!targetId) {
      return m.reply(
        `Format salah. Gunakan salah satu:\n• Balas pesan target: ${usedPrefix + command} [jumlah_hari]\n• Tag username (pilih dari daftar, bukan ketik manual): ${usedPrefix + command} @username [jumlah_hari]\n• Atau: ${usedPrefix + command} <user_id> [jumlah_hari]\n\nContoh:\n• ${usedPrefix + command} 7\n• ${usedPrefix + command} @namauser 30\n• ${usedPrefix + command} 1252446200 30`,
      );
    }

    // Ensure user record exists
    const users = global.db.data.users || (global.db.data.users = {});
    if (typeof users[targetId] !== "object") users[targetId] = {};
    const user = users[targetId];

    // Initialize minimal defaults if missing
    if (typeof user.saldo !== "number") user.saldo = 0;
    if (typeof user.exp !== "number") user.exp = 0;
    if (typeof user.level !== "number") user.level = 0;
    if (typeof user.limit !== "number") user.limit = global.limit || 30;
    if (!("registered" in user)) user.registered = false;
    if (!("banned" in user)) user.banned = false;
    if (typeof user.premiumTime !== "number") user.premiumTime = 0;
    if (typeof user.command !== "number") user.command = 0;
    if (typeof user.commandTotal !== "number") user.commandTotal = 0;
    if (typeof user.lastCmd !== "number") user.lastCmd = 0;
    if (typeof user.chat !== "number") user.chat = 0;
    if (typeof user.chatTotal !== "number") user.chatTotal = 0;
    if (typeof user.lastseen !== "number") user.lastseen = 0;

    // Apply premium:
    // - days > 0: timed premium via premiumTime only (do NOT set boolean)
    // - days = 0: permanent premium via boolean flag, premiumTime = 0
    if (days > 0) {
      user.premium = false;
      user.premiumTime = Date.now() + days * 24 * 60 * 60 * 1000;
    } else {
      user.premium = true;
      user.premiumTime = 0;
    }

    // Build response text
    let info = `✅ Premium ditambahkan untuk user: ${targetId}`;
    if (days > 0) {
      const until = new Date(user.premiumTime);
      info += `\n⏳ Durasi: ${days} hari\n📅 Berlaku sampai: ${until.toLocaleString("id-ID")}`;
    } else {
      info += `\n♾️ Durasi: Permanent`;
    }

    await conn.sendMessage(m.chat, { text: info }, { quoted: m });
  } catch (e) {
    console.error("owner-premium-add error:", e);
    return m.reply("Terjadi kesalahan saat menambahkan premium.");
  }
};

handler.help = ["addprem [hari]", "addpremium [hari]"];
handler.tags = ["owner"];
handler.command = /^(addprem(ium)?|premadd)$/i;
handler.owner = true;

export default handler;
