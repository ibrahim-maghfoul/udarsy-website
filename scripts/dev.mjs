// Runs the Next dev server as a managed child so Ctrl+C actually kills the whole
// tree. THE ROOT CAUSE of "many node.exe": on Windows, pressing Ctrl+C (or closing
// the terminal) signals only the foreground process — the `next` CLI — while the
// heavy Turbopack worker it spawned is left orphaned, still holding port 3000 and
// RAM. The next `npm run dev` then can't bind 3000, jumps to 3001/3002…, and you
// end up with a pile of zombie servers.
//
// This wrapper spawns `next dev` and, on SIGINT/SIGTERM, force-kills the entire
// child process tree before exiting — so shutdown is clean and nothing accumulates.
//
// Usage: node scripts/dev.mjs   (invoked via the `dev` npm script, after `predev`)

import { spawn, execSync } from 'node:child_process';

const isWin = process.platform === 'win32';
const PORT = '3000';

// shell:true on Windows so `next` resolves to next.cmd; detached on Unix so the
// child gets its own process group we can signal as a whole. On Windows we pass the
// whole command as one string (not args + shell:true) to avoid the DEP0190 warning.
const cmd = isWin ? `next dev -p ${PORT}` : 'next';
const args = isWin ? [] : ['dev', '-p', PORT];
const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: isWin,
  detached: !isWin,
});

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  try {
    if (isWin) {
      // /T = whole child tree (next + turbopack workers), /F = force
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: 'ignore' });
    } else {
      // negative pid signals the entire process group
      process.kill(-child.pid, 'SIGTERM');
    }
  } catch {
    /* already gone */
  }
  process.exit(0);
}

// Catch every stop path that delivers a signal: SIGINT = Ctrl+C, SIGBREAK = Ctrl+Break,
// SIGHUP = terminal/console window closed (Windows raises this), SIGTERM = kill / some
// IDE stop buttons. A hard force-kill (taskkill /F, "kill all servers.cmd", VS Code's
// force-stop) delivers NO catchable signal, so this handler can't run then — that case
// is mopped up on the next `npm run dev` by predev's orphaned-process sweep.
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
  process.on(sig, shutdown);
}
child.on('exit', (code) => process.exit(code ?? 0));
