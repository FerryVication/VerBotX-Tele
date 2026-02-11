/*
* SCREENSHOT WEB From api.ferdev.my.id
* Code by FeriPratama
*/

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!args[0]) {
    return m.reply(`Contoh Penggunaan ${usedPrefix}${command} https://api.ferdev.my.id`);
  }

  if (/xnxx\.com|hamster\.com|xvideos\.com|nekopoi\.care/i.test(args[0])) {
    return conn.reply(m.chat, "Link tersebut dilarang!", m);
  }

  const url = args[0].startsWith("http") ? args[0] : "https://" + args[0];

  try {
    m.reply(wait);

    const request = await fetch(
      `${APIs.ferdev}/tools/ssweb?url=${encodeURIComponent(url)}&apikey=${ferr}`
    );

    if (!request.ok) throw "Gagal mengambil gambar!";

    const tmpDir = path.join(__dirname, "../tmp");
    fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `${Date.now()}.jpeg`);
    const fileStream = fs.createWriteStream(filePath);

    request.body.pipe(fileStream);

    fileStream.on("finish", async () => {
      await conn.sendFile(
        m.chat,
        filePath,
        "screenshot.jpeg",
        "Nih gambarnya.",
        m
      );
    });

  } catch (e) {
    //console.log(e);
    m.reply("Terjadi kesalahan saat mengambil screenshot");
  }
};

handler.help = ['ssweb', 'ss'];
handler.tags = ['tools'];
handler.command = /^(screenshot|ss|ss(web)?)$/i;
handler.limit = true
handler.register = true

export default handler;