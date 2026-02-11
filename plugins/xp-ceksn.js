import crypto from "crypto";

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];

  if (!user.registered) {
    return m.reply(
      `You are not registered yet! (｡•́︿•̀｡)\nType */register name.age* to sign up`,
    );
  }

  const sn = crypto.createHash("md5").update(m.sender.toString()).digest("hex");

  const caption = [
    "┌─〔 🔍 SERIAL NUMBER INFO 〕",
    `├ Name: ${user.name}`,
    `├ Age: ${user.age} years old`,
    `├ SN: ${sn}`,
    "└────",
    "",
    "Keep your Serial Number safe! (≧▽≦)",
    "Use it to unregister: */unreg <SERIAL NUMBER>*",
  ].join("\n");

  try {
    await conn.reply(m.chat, caption, m);
  } catch {
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
  }
};

handler.help = ["ceksn"];
handler.tags = ["main"];
handler.command = /^ceksn$/i;

handler.register = true;

export default handler;
