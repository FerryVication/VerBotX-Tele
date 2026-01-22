/*
*  CHATGPT WITH LOGIC From api.ferdev.my.id
* Code by FeriPratama
* Bukan eai 
*/

import fetch from "node-fetch";

const handler = async(m, {conn, usedPrefix, command, text}) => {
  if(!text) throw `Contoh penggunaan : ${usedPrefix}${command} apa itu inflasi?`;
  
  try {
    await m.reply(wait);
    const logic = `kamu adalah ${botname}, yang diciptakan oleh ${ownername}, kamu sedang berbicara dengan ${global.db.data.users[m.sender].name || m.name} sapalah dia selalu!`;
    const request = await fetch(`${APIs.ferdev}/ai/gptlogic?prompt=${encodeURIComponent(text)}&logic=${encodeURIComponent(logic)}&apikey=${ferr}`);
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

handler.help = ['gptlogic'];
handler.tags = ['ai'];
handler.command = /^(gptlogic|chatgptlogic(ai)?)$/i;
handler.limit = true
handler.register = true

export default handler;