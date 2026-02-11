/*
* REMOVE BACKGROUND From api.ferdev.my.id
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
    const request = await fetch(`${APIs.ferdev}/tools/removebg?link=${URL}&apikey=${ferr}`);
    const response = await request.json();
    if(response.success) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: response.data },
          caption: "Nih Kak"
        },
        { quoted: m }
      );
    } else {
      m.reply("Gagal Mengedit gambar!");
    }
  } catch(anomali) {
    m.reply(`Terjadi kesalahan`);
  }
}

handler.help = ['removebg', 'nobg'];
handler.tags = ['tools'];
handler.command = /^(removebg|nobg|remove(bg)?)$/i;
handler.limit = true
handler.register = true

export default handler;