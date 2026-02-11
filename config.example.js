// Ganti nama file ini menjadi config.js

global.token = "";
global.ownername = "";
global.ownerid = "";
global.premid = "";
global.botname = "";
global.prefix = ["/", ".", "#", "!"];
global.wib = 7;
global.wait = "Tunggu Sedang Diproses...";
global.wm = "© VerBotX - Tele";
// Message
global.message = {
  rowner: "This command can only be used by the _*OWNER!*_",
  owner: "This command can only be used by the _*Bot Owner*_!",
  premium: "This command is only for _*Premium*_ members!",
  group: "This command can only be used in groups!",
  private: "This command can only be used in Private Chat!",
  admin: "This command can only be used by group admins!",
  error: "An error occurred, please try again later.",
};

// Port configuration
global.ports = [4000, 3000, 5000, 8000];

// Database configuration
global.limit = 100;
// Maximum limit a user can have (cap). Daily reset will not exceed this.
global.limitMax = 200;

global.APIs = {
  //lann: 'https://api.betabotz.eu.org',
  ferdev: "https://api.ferdev.my.id", // daftar disini
};
global.ferr = ""; // Taro Apikey Kalian disini, wajibbb

import fs from "fs";
import chalk from "chalk";

const file = new URL(import.meta.url);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update 'config.js'`));
});
