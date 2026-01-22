// Dapetin token bot kalian di @BotFather
global.token = "";
// nama mu bebas
global.ownername = "Feri Pratama";
// ini bisa diisi pas bot nya udah start, pake command /getmyid
global.ownerid = "";
// ini sama
global.premid = "";
// bebas
global.botname = "";
global.prefix = ["/", ".", "#", "!"];
// ini Zona Waktu default Utc +7
global.wib = 7;
// bebas
global.wait = "Tunggu Sedang Diproses...";
global.wm = "© VerBotX - Tele";
// Message
global.message = {
  rowner: "Oopss... Perintah ini Hanya Bisa Digunakan Oleh Ownerr!!",
  owner: "Oopss... Perintah ini Hanya Bisa Digunakan Oleh Ownerr!!!",
  premium: "Oopss... Perintah ini Hanya Bisa Digunakan Oleh Pengguna Premium!",
  group: "Oopss... Perintah Ini Hanya Bisa Digunakan di Group!",
  private: "Oopss... Perintah Ini Hanya Bisa Digunakan di Private Chat!",
  admin: "Oopss... Perintah ini Hanya Bisa Digunakan Oleh Admin",
  error: "An error occurred, please try again later.",
};

// Port configuration
global.ports = [4000, 3000, 5000, 8000];

// Limit per user per hari
global.limit = 100;
// Batas maksimum yang dapat dimiliki pengguna (max). Reset harian tidak akan melebihi batas ini.
global.limitMax = 200;

// INI JANGAN DIGANTI
global.APIs = {
  ferdev: "https://api.ferdev.my.id",
};

/*
* WAJIB BIAR FITUR BOT BISA NORMAL!
* registrasi di https://api.ferdev.my.id/register
* lalu pergi ke https://api.ferdev.my.id/profile
* Salin Apikey Kalian lalu Tempel dibawah
*/
global.ferr = "TEMPEL_DISINI";

import fs from "fs";
import chalk from "chalk";

const file = new URL(import.meta.url);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update 'config.js'`));
});
