/*
 * Search Pinterest From api.ferdev.my.id
 * Code by FeriPratama
 */

import fetch from "node-fetch";

const handler = async (m, { conn, command, args, usedPrefix }) => {
  if (!args[0])
    throw `Contoh Penggunaan : ${usedPrefix}${command} freya jayawardana`;
  try {
    await m.reply(wait);
    const req = await fetch(
      `${APIs.ferdev}/Search/pinterest?query=${encodeURIComponent(args[0])}&apikey=${ferr}`,
    );
    const res = await req.json();
    if (res.succes) {
      const MAX_SIZE = 10 * 1024 * 1024;
      const images = [];
      for (const url of res.result) {
        if (images.length >= 10) break;
        try {
          const head = await fetch(url, { method: "HEAD", timeout: 5000 });
          const size = Number(head.headers.get("content-length"));
          if (!size || size > MAX_SIZE) continue;
          images.push(url);
        } catch {
          continue;
        }
      }
      if (!images.length) {
        return m.reply("❌ Ukuran Gambar Terlalu Besar!");
      }
      const mediaGroup = images.map((url, i) => ({
        type: "photo",
        media: url,
        ...(i === 0
          ? {
              caption: "🖼️ *Nih Kak*",
              parse_mode: "Markdown",
            }
          : {}),
      }));

      await conn.telegram.sendMediaGroup(m.chat, mediaGroup);
    } else {
      throw "Media Tidak Ditemukan!";
    }
  } catch (anomali) {
    throw anomali;
  }
};

handler.help = ["pinterest", "pin"];
handler.tags = ["search"];
handler.command = /^(pinterest|pin(dl)?)$/i;
handler.limit = true;
handler.register = true;

export default handler;
