import fs from "fs";
import path from "path";

const handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) {
    return m.reply(
      `❌ Nama file tidak ditemukan!\n\n📝 Penggunaan:\n${usedPrefix + command} <nama_file>\n\n📋 Contoh:\n${usedPrefix + command} plugins/menu.js\n\n💡 Reply file/dokumen yang ingin disimpan!`,
    );
  }

  if (!m.quoted) {
    return m.reply(
      `❌ Reply file atau dokumen yang ingin disimpan!\n\n📎 Format yang didukung:\n• .js, .json, .txt`,
    );
  }

  if (typeof m.quoted.download !== "function") {
    return m.reply(
      `❌ Pesan yang direply tidak mengandung file!\n\n💡 Tips:\n• Reply file/dokumen yang sudah diupload\n• Pastikan file memiliki ekstensi (.js, .txt, .json)\n• Jangan reply pesan teks biasa`,
    );
  }

  try {
    const filePath = text.trim();

    if (path.isAbsolute(filePath)) {
      return m.reply(
        `❌ Path absolut tidak diizinkan!\n\n✅ Contoh benar:\n• plugins/menu.js`,
      );
    }

    const media = await m.quoted.download();
    if (!media || media.length === 0) {
      return m.reply(`❌ File kosong atau gagal didownload!`);
    }

    const dir = path.dirname(filePath);
    if (dir !== "." && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, media);

    const { size } = fs.statSync(filePath);
    const extension = path.extname(filePath).toLowerCase();

    const textExtensions = [".js", ".json", ".txt"];
    if (textExtensions.includes(extension)) {
      try {
        fs.readFileSync(filePath, "utf8");
      } catch (e) {
        console.log("Could not read file as text:", e.message);
      }
    }

    return m.reply(`✅ File berhasil disimpan!\n📦 Size: ${size} bytes`);
  } catch (error) {
    console.error("Error saving file:", error);
    return m.reply(`❌ Gagal menyimpan file!\n\nError: ${error.message}`);
  }
};

handler.help = ["sf", "savefile"].map((v) => v + " <nama_file>");
handler.tags = ["owner"];
handler.command = /^(sf|savefile)$/i;
handler.owner = true;

export default handler;
