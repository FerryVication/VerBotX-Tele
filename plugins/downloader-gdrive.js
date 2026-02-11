/*
* Google Drive Downloader From api.ferdev.my.id
* Code by FeriPratama
* Bukan eai 
*/

import fetch from "node-fetch";

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Penggunaan : ${usedPrefix}${command} <URL>\n\nContoh:\n${usedPrefix}${command} https://drive.google.com/file/d/1thDYWcS5p5FFhzTpTev7RUv0VFnNQyZ4/view?usp=drivesdk`;
  }

  try {
    await m.reply(wait);

    const req = await fetch(`${APIs.ferdev}/downloader/gdrive?link=${encodeURIComponent(args[0])}&apikey=${ferr}`);
    const res = await req.json();

    if (!res.success || !res?.data?.download) {
      throw "File Tidak Ditemukan";
    }

    const {
      download,
      fileName,
      fileSize,
      mimetype,
      extension,
      modified,
    } = res.data;

    let caption = `
📄 *File Ditemukan*

📌 Nama     : ${fileName}
🗂️ Tipe     : ${extension}
📦 Ukuran   : ${fileSize}
🕒 Update   : ${modified}
`.trim();

    await conn.sendMessage(
      m.chat,
      {
        document: { url: download },
        fileName,
        mimetype: mimetype || "application/octet-stream",
        caption,
      },
      { quoted: m },
    );
  } catch (err) {
    console.error(err);
    m.reply("Gagal ambil file.silahkan lapor owner");
  }
};

handler.help = ["gdrive"];
handler.tags = ["downloader"];
handler.command = /^gdrive(dl)?$/i;
handler.limit = true;
handler.register = true;

export default handler;