/*
* Search Lirik From api.ferdev.my.id
* Code by FeriPratama
*/

import fetch from "node-fetch";

const handler = async(m, { conn, command, usedPrefix, args }) => {
  if(!args[0]) throw `Contoh Penggunaan : ${usedPrefix}${command} somewhere only we know`;
  try {
    await m.reply(wait);
    const req = await fetch(`${APIs.ferdev}/search/lirik?judul=${encodeURIComponent(args[0])}&apikey=${ferr}`);
    const res = await req.json();
    if(res.success) {
      const caption = `
      Judul : ${res.data.judul}
      Artis : ${res.data.artis}
      
      ${res.data.lirik}
      `.trim();
    
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
    } else {
      throw "Lirik Tidak Ditemukan!";
    }
  } catch(anomali) {
    throw global.message.error;
  }
}

handler.help = ['lirik'];
handler.tags = ['search'];
handler.command = /^lirik$/i;
handler.limit = true
handler.register = true

export default handler;