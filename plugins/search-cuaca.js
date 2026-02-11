/*
* Search Cuaca From api.ferdev.my.id
* Code by FeriPratama
*/

import fetch from "node-fetch";

const handler = async(m, { conn, command, args, usedPrefix }) => {
  if(!args[0]) throw `Contoh Penggunaan : ${usedPrefix}${command} Jakarta`;
  try {
    await m.reply(wait);
    const req = await fetch(`${APIs.ferdev}/search/cuaca?kota=${encodeURIComponent(args[0])}&apikey=${ferr}`);
    const res = await req.json();
    if(res.success) {
      const caption = `
🌆 *Cuaca di ${res.data.kota}*

🌡️ Suhu           : ${res.data.suhu}  
🌤️ Kondisi        : ${res.data.kondisi}  
💧 Kelembapan     : ${res.data.kelembapan}  
💨 Angin          : ${res.data.angin}  
🌧️ Curah Hujan    : ${res.data.curah_hujan}  
☁️ Tutupan Awan    : ${res.data.tutupan_awan}  
👀 Visibilitas    : ${res.data.visibilitas}  

🌅 ${res.data.terbit}  
🌇 ${res.data.terbenam}  

📍 Koordinat      : ${res.data.latitude}, ${res.data.longitude}
`.trim();
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
    } else {
      throw "Lokasi Tidak Ditemukan!";
    }
  } catch(anomali) {
    m.reply(global.message.error)
  }
}

handler.help = ['cuaca'];
handler.tags = ['search'];
handler.command = /^cuaca$/i;
handler.limit = true
handler.register = true

export default handler;