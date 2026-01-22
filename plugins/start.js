export default {
  help: ["start"],
  tags: ["main"],
  command: /^start$/i,

  async handler(m, { conn }) {
    const user = m.name || "kak";
    const botname = global.botname || "Bot";

    const text = `👋 Halo ${user}
Saya *${botname}* 🤖

Saya siap bantuin berbagai kebutuhan lu:
download, tools, AI, dan lainnya.

👉 Untuk melihat semua menu,
silakan ketik:
/menu`;

    return conn.sendMessage(m.chat, {
      text,
      parse_mode: "Markdown",
    });
  },
};
