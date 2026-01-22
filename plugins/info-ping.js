import { totalmem, freemem } from "os";
import os from "os";
import osu from "node-os-utils";
import { performance } from "perf_hooks";
import { sizeFormatter } from "human-readable";

const format = sizeFormatter({
  std: "JEDEC",
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

const handler = async (m, { conn }) => {
  const used = process.memoryUsage();
  const cpus = os.cpus().map((cpu) => {
    cpu.total = Object.values(cpu.times).reduce((acc, t) => acc + t, 0);
    return cpu;
  });

  const cpu = cpus.reduce(
    (acc, cpu, _, { length }) => {
      acc.total += cpu.total;
      acc.speed += cpu.speed / length;
      Object.keys(cpu.times).forEach(
        (type) => (acc.times[type] += cpu.times[type]),
      );
      return acc;
    },
    {
      speed: 0,
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0,
      },
    },
  );

  let _muptime;
  if (process.send) {
    process.send("uptime");
    _muptime = await new Promise((resolve) => {
      process.once("message", resolve);
      setTimeout(() => resolve(null), 1000);
    });
  }
  const muptime = clockString(_muptime);

  // Real ping measurement
  const startPing = Date.now();
  await m.reply("_Pinging..._");
  const ping = Date.now() - startPing;

  // Speed test (internal execution time)
  const startPerf = performance.now();
  const endPerf = performance.now();
  const speed = endPerf - startPerf;

  const cpux = osu.cpu;
  const OS = osu.os.platform();

  const times = new Date(Date.now()).toLocaleTimeString("en", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const txt = `
PING
${ping} ms (round trip)
${speed.toFixed(2)} ms (execution)

UPTIME
${muptime}

SERVER INFO
RAM Used: ${format(totalmem() - freemem())} / ${format(totalmem())}
Free RAM: ${format(freemem())}
Memory Usage: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(totalmem() / 1024 / 1024)} MB
Platform: ${os.platform()}
Hostname: ${os.hostname()}
OS: ${OS}
Server Time: ${times}

NodeJS Memory Usage
\`\`\`
${Object.keys(used)
  .map((key) => `${key.padEnd(15)}: ${format(used[key])}`)
  .join("\n")}
\`\`\`

${
  cpus[0]
    ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed.toFixed(2)} MHz)
${Object.keys(cpu.times)
  .map(
    (type) =>
      `- ${type.padEnd(6)}: ${((100 * cpu.times[type]) / cpu.total).toFixed(2)}%`,
  )
  .join("\n")}

_CPU Core(s) Usage (${cpus.length} Cores)_
${cpus
  .map(
    (cpu, i) =>
      `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHz)
${Object.keys(cpu.times)
  .map(
    (type) =>
      `- ${type.padEnd(6)}: ${((100 * cpu.times[type]) / cpu.total).toFixed(2)}%`,
  )
  .join("\n")}`,
  )
  .join("\n\n")}
`
    : ""
}
  `.trim();

  m.reply(txt);
};

handler.help = ["ping", "speed"];
handler.tags = ["info"];
handler.command = /^(ping|speed|pong|info)$/i;
export default handler;

function clockString(ms) {
  const d = isNaN(ms) ? "--" : Math.floor(ms / 86400000);
  const h = isNaN(ms) ? "--" : Math.floor(ms / 3600000) % 24;
  const m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [d, "D ", h, "H ", m, "M ", s, "S "]
    .map((v) => v.toString().padStart(2, 0))
    .join("");
}
