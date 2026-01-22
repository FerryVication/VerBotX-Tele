/*
 * Capcut Downloader From api.ferdev.my.id
 * Code by FeriPratama
 * Bukan eai
 */

import fetch from "node-fetch";

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // ini misal user cuma ngirim command nya doang ngga menyertakan link nya
  if (!args[0]) {
    throw `Penggunaan : ${usedPrefix}${command} < Tiktok Video URL > \n\n Contoh ${usedPrefix}${command} https://www.capcut.com/template-detail/7299286607478181121?template_id=7299286607478181121&share_token=80302b19-8026-4101-81df-2fd9a9cecb9c&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1`;
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
        🔁 Author  : ${data.author.name.toLocaleString()}`;
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
