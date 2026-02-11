const handler = async (m, { args, usedPrefix, command, conn }) => {
  try {
    const base = m.fakeObj?.message;

    // Resolve target user ID: order = reply -> text_mention -> @username -> numeric id
    let targetId = base?.reply_to_message?.from?.id;
    let usernameFromEntity = null;
    const text = base?.text || m.text || "";
    const entities = base?.entities || [];

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

    if (!targetId) {
      if (args[0] && args[0].startsWith("@")) {
        usernameFromEntity = args[0].slice(1);
      } else if (args[0] && /^\d{5,}$/.test(args[0])) {
        targetId = args[0];
      }
    }

    if (!targetId && usernameFromEntity) {
      try {
        const chatInfo = await conn.telegram.getChat("@" + usernameFromEntity);
        if (chatInfo?.id) targetId = chatInfo.id;
      } catch {}
    }

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

    if (!targetId && usernameFromEntity && global.usernameCache) {
      const hit = global.usernameCache[usernameFromEntity.toLowerCase()];
      if (hit) targetId = hit;
    }

    if (!targetId) {
      return m.reply(
        `Format salah. Gunakan salah satu:\n• Balas pesan target: ${usedPrefix + command}\n• Tag username (pilih dari daftar, bukan ketik manual): ${usedPrefix + command} @username\n• Atau: ${usedPrefix + command} <user_id>\n\nContoh:\n• ${usedPrefix + command}\n• ${usedPrefix + command} @namauser\n• ${usedPrefix + command} 1252446200`,
      );
    }

    const users = global.db.data.users || (global.db.data.users = {});
    if (!users[targetId]) users[targetId] = {};
    const user = users[targetId];

    user.premium = false;
    user.premiumTime = 0;

    await conn.sendMessage(
      m.chat,
      { text: `✅ Premium dihapus dari user: ${targetId}` },
      { quoted: m },
    );
  } catch (e) {
    console.error("owner-premium-del error:", e);
    return m.reply("Terjadi kesalahan saat menghapus premium.");
  }
};

handler.help = ["delprem", "delpremium"];
handler.tags = ["owner"];
handler.command = /^(delprem(ium)?|premdel|unprem)$/i;
handler.owner = true;

export default handler;
