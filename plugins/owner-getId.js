const handler = async (m, { conn }) => {
  const user = m.sender || m.from;
  const chat = m.chat;

  const text = `
🆔 *YOUR TELEGRAM INFO*

👤 *User ID*
${user}

💬 *Chat ID*
${chat}

🤖 *Bot ID*
${conn.user?.id || "-"}

📝 *Username*
@${m.username || "unknown"}

💡 *Tips*
Simpan *User ID* buat ownerid / admin bot
`.trim();

  return conn.sendMessage(
    m.chat,
    {
      text,
      parse_mode: "Markdown",
    },
    { quoted: m },
  );
};

// ⬇️ INI WAJIB NEMPEL KE HANDLER
handler.help = ["getmyid"];
handler.tags = ["tools"];
handler.command = /^getmyid$/i;
handler.owner = false; // set ke true aja kalo kalian udah dapet id kalian

export default handler;
