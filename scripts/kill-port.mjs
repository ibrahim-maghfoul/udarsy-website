// Kill whatever process tree is holding a TCP port, cross-platform.
// Why this exists: on Windows, Ctrl+C / closing the terminal does NOT propagate
// the kill down the npm -> next -> turbopack process tree, so the heavy Turbopack
// dev server is orphaned and keeps holding port 3000. The next `npm run dev` then
// finds 3000 busy and silently jumps to 3001, 3002... stacking multiple full dev
// servers. Running this before `dev` (see the `predev` npm script) guarantees a
// single clean server on a known port.
//
// Usage: node scripts/kill-port.mjs [port]   (default 3000)

import { execSync } from 'node:child_process';

const port = process.argv[2] || '3000';
const isWin = process.platform === 'win32';

function killWindows() {
  let out = '';
  try {
    out = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
  } catch {
    console.log(`kill-port: could not read netstat; assuming port ${port} is free`);
    return;
  }
  const pids = new Set();
  // \b after the digits so :3000 does not also match :30000
  const portRe = new RegExp(`:${port}\\b`);
  for (const line of out.split('\n')) {
    if (portRe.test(line) && /LISTENING/i.test(line)) {
      const pid = line.trim().split(/\s+/).pop();
      if (pid && pid !== '0') pids.add(pid);
    }
  }
  if (!pids.size) {
    console.log(`kill-port: port ${port} is free`);
    return;
  }
  for (const pid of pids) {
    try {
      // /T kills the whole child tree (next + turbopack workers), /F forces it.
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
      console.log(`kill-port: killed process tree on port ${port} (PID ${pid})`);
    } catch {
      console.log(`kill-port: PID ${pid} already gone`);
    }
  }
}

function killUnix() {
  let pids = [];
  try {
    pids = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    console.log(`kill-port: port ${port} is free`);
    return;
  }
  for (const pid of pids) {
    try {
      execSync(`kill -9 ${pid}`);
      console.log(`kill-port: killed PID ${pid} on port ${port}`);
    } catch {
      console.log(`kill-port: PID ${pid} already gone`);
    }
  }
}

if (isWin) killWindows();
else killUnix();
