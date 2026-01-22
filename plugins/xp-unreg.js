import crypto from "crypto";

const handler = async (m, { conn, text }) => {
  const user = global.db.data.users[m.sender];

  if (!user.registered)
    return m.reply(
      `You're not registered yet! (´・ω・)\nType */register name.age* to sign up`,
    );

  if (!text)
    return m.reply(
      `Serial number not provided! (｡•́︿•̀｡)\n\nUsage:\n*/unreg <SERIAL NUMBER>*`,
    );

  const sn = crypto.createHash("md5").update(m.sender.toString()).digest("hex");

  if (text !== sn)
    return m.reply(
      `Wrong serial number! (＞﹏＜)\n\nYour serial number: ${sn}`,
    );

  user.registered = false;
  user.name = "";
  user.age = 0;
  delete user.regTime;

  conn.reply(
    m.chat,
    `✅ Unregistered successfully! (≧▽≦)\n\nYou can register again with */register name.age*`,
    { message_id: m.id },
  );
};

handler.help = ["unreg"];
handler.tags = ["main"];
handler.command = /^(unreg|unregister)$/i;
handler.register = true;

export default handler;
