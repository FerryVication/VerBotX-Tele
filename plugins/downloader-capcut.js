/*
 * Capcut Downloader From api.ferdev.my.id
 * Code by FeriPratama
 * Bukan eai
 */

import fetch from "node-fetch";

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // ini misal user cuma ngirim command nya doang ngga menyertakan link nya
  if (!args[0]) {
    throw `Penggunaan : ${usedPrefix}${command} < Tiktok Video URL > \n\n Contoh ${usedPrefix}${command} Link Video`;
  }
  try {
    await m.reply(wait);
    const request = await fetch(
      `${APIs.ferdev}/downloader/capcut?link=${encodeURIComponent(args[0])}&apikey=${ferr}`,
    );
    const response = await request.json();
    // validasi response
    if (response.success) {
      const { title, date, likes, videoUrl } = response.data;
      let caption = `
        🎧 ${title}
        👀 Likes  : ${likes.toLocaleString()}
        🔁 Author  : ${response.data.author.name.toLocaleString()}`;
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          fileName: title,
          caption,
        },
        { quoted: m },
      );
    } else {
      // kalo gagal dapet file
      throw "Eumm... Ada yang salah nih";
    }
  } catch (anomali) {
    m.reply("Ada sesuatu yang salah, segera lapor owner!");
  }
};

handler.help = ["capcut", "cc"];
handler.tags = ["downloader"];
handler.command = /^(capcut|cc(dl)?)$/i;
handler.limit = true;
handler.register = true;

export default handler;
