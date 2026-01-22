/*
* FELO AI From api.ferdev.my.id
* Code by FeriPratama
* Bukan eai 
*/

import fetch from "node-fetch";

const handler = async(m, {conn, usedPrefix, command, text}) => {
  if(!text) throw `Contoh penggunaan : ${usedPrefix}${command} apa itu inflasi?`;
  
  try {
    await m.reply(wait);
    const request = await fetch(`${APIs.ferdev}/ai/felo?prompt=${encodeURIComponent(text)}&apikey=${ferr}`);
    const response = await request.json();
    if(response.success) {
      await conn.sendMessage(m.chat, { text: response.message }, { quoted: m });
    } else {
      throw "Gagal Mendapatkan Jawaban!";
    }
  } catch(anomali) {
    throw "Gagal Melakukan Permintaan API";
  }
}

handler.help = ['felo'];
handler.tags = ['ai'];
handler.command = /^(felo(ai)?)$/i;
handler.limit = true
handler.register = true

export default handler;