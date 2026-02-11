/*
* Optical Character Recognition From api.ferdev.my.id
* Code by FeriPratama
*/

import uploadImage from "../lib/uploadImage.js";

const handler = async(m, { conn, usedPrefix, text, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = q.mimetype || "";
    if (!mime) {
      m.reply(`Kirim/Reply gambar dengan caption atau command ${usedPrefix}${command}`);
      return;
    }
    
    if(!/image\/(jpe?g|png)/.test(mime)) {
      throw `Jenis ${mime} tidak didukung! Hanya JPEG/PNG.`;
    }
    m.reply(wait);
    const image = await q.download();
    const URL = await uploadImage(image);
    const request = await fetch(`${APIs.ferdev}/tools/ocr?link=${URL}&apikey=${ferr}`);
    const response = await request.json();
    if(response.success) {
      m.reply(response.text);
    } else {
      m.reply("Gagal mengenali teks dalam gambar!");
    }
  } catch(anomali) {
    m.reply(`Terjadi kesalahan`);
  }
}

handler.help = ['ocr'];
handler.tags = ['tools'];
handler.command = /^ocr$/i;

export default handler;