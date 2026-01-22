import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

const handler = async (m, { conn, isOwner, command, text }) => {
  await m.reply("Executing...");

  let o;
  try {
    o = await exec(command.trimStart() + " " + text.trimEnd());
  } catch (e) {
    o = e;
  } finally {
    const { stdout = "", stderr = "" } = o || {};

    if (stdout.trim()) await m.reply(stdout);
    if (stderr.trim()) await m.reply(stderr);
  }
};

handler.help = ["$"];
handler.tags = ["advanced"];
handler.customPrefix = /^[$] /;
handler.command = new RegExp();
handler.owner = true;

export default handler;
