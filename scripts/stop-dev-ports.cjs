const { execSync } = require("node:child_process");

const ports = process.argv.slice(2).map(Number).filter(Boolean);
const targetPorts = ports.length ? ports : [3000, 8787];

function run(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
}

function stopWindows() {
  const output = run("netstat -ano");
  const pids = new Set();

  for (const line of output.split(/\r?\n/)) {
    if (!line.includes("LISTENING")) continue;
    for (const port of targetPorts) {
      if (line.match(new RegExp(`:${port}\\s`))) {
        const match = line.trim().match(/(\d+)$/);
        if (match) pids.add(match[1]);
      }
    }
  }

  for (const pid of pids) {
    run(`powershell -NoProfile -Command "Stop-Process -Id ${pid} -Force"`);
    console.log(`stopped process on dev port: ${pid}`);
  }
}

function stopUnix() {
  for (const port of targetPorts) {
    const output = run(`lsof -ti tcp:${port}`);
    for (const pid of output.split(/\s+/).filter(Boolean)) {
      run(`kill -9 ${pid}`);
      console.log(`stopped process on dev port ${port}: ${pid}`);
    }
  }
}

if (process.platform === "win32") {
  stopWindows();
} else {
  stopUnix();
}
