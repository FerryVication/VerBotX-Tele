/*
* Informasi Gempa From api.ferdev.my.id
* Code by FeriPratama
* Bukan eai 
*/

import fetch from "node-fetch";
const handler = async (m, { conn }) => {
  try {
    const request = await fetch(`${APIs.ferdev}/search/gempa?apikey=${ferr}`);
    const response = await request.json();
    if(response.success) {
      const { title, waktu, lintang, bujur, magnitudo, kedalaman, wilayah, map } = response.data;
     const caption = `
🌍 *INFORMASI GEMPA*
      
⏰ Waktu        : ${waktu}
📍 Lintang     : ${lintang}
📐 Bujur       : ${bujur}
💥 Magnitudo   : ${magnitudo}
🕳️ Kedalaman   : ${kedalaman}
🗺️ Wilayah     : ${wilayah}
      `.trim();
    conn.sendFile(m.chat, map, "map.png", caption, m);
    } else {
      throw "Tidak Ada data gempa"
    }
  } catch (e) {
    console.log(e);
    conn.reply(m.chat, "Terjadi kesalahan saat mengambil data gempa", m);
  }
};
handler.command = handler.help = ["infogempa", "gempa"];
handler.tags = ["info"];
handler.premium = false;
handler.limit = true;
export default handler;
