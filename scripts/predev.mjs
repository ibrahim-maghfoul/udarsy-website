// Runs automatically before `next dev` (npm `predev` hook). Three jobs:
//
//  1. Free port 3000 — kill any orphaned dev-server tree (see kill-port.mjs for why
//     Windows leaves these behind).
//
//  2. Reap stray Turbopack processes left by a previous *ungraceful* exit. This is the
//     real fix for "many node.exe, not serving, eating RAM". On Windows, closing the
//     terminal / the IDE "stop" button / a force-kill does NOT run dev.mjs's shutdown
//     handler, so the whole Next dev tree orphans. kill-port (step 1) only reaps the
//     process *listening* on 3000 plus its children — but the dev server's listener is
//     a leaf, so its parent `next` CLI and any detached / re-parented Turbopack workers
//     (postcss.js & friends, ~100 MB–1 GB each) survive a port-listener kill and pile
//     up across restarts. They serve nothing; they just hold RAM and starve the next
//     compile. We match strictly by this project's path + Next runtime markers, so the
//     editor's node, the backend, and unrelated processes are never touched.
//
//  3. Self-heal a build-polluted cache. If `next build` was run in this folder, it
//     leaves production artifacts in `.next` (BUILD_ID, standalone/, prerender
//     manifests). When `next dev` then starts against that same `.next`, Turbopack
//     hangs forever on "Compiling /" and fork-bombs worker processes — the machine
//     fills with idle node.exe and the site never serves. We detect that state by
//     the production-only marker `.next/standalone` (dev never creates it) and wipe
//     `.next` so dev starts from a clean cache.
//
// Usage: node scripts/predev.mjs   (invoked via the `predev` npm script)

import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const isWin = process.platform === 'win32';

// 1. free the port (reuse the dedicated script so the logic lives in one place)
execSync(`node "${path.join(here, 'kill-port.mjs')}" 3000`, { stdio: 'inherit' });

// 2. reap orphaned Next/Turbopack processes from previous runs (Windows only — on
//    Unix the process group is signalled as a whole, so nothing leaks). At this point
//    `next dev` has NOT started yet (predev runs before dev.mjs), so anything matching
//    the Next runtime markers below is necessarily a leftover from an earlier run and
//    is safe to kill. `.Replace([char]92,[char]47)` just turns \ into / so the path
//    markers match regardless of slash direction.
if (isWin) {
  const projFwd = path.resolve(here, '..').replace(/\\/g, '/').toLowerCase();
  const ps =
    `$ErrorActionPreference='SilentlyContinue';` +
    `$proj='${projFwd}';` +
    `Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine } | ForEach-Object {` +
    `  $cl=$_.CommandLine.Replace([char]92,[char]47).ToLower();` +
    `  if (($cl -like ('*'+$proj+'*')) -and (($cl -like '*/next/dist/*') -or ($cl -like '*/.next/dev/*'))) {` +
    `    taskkill /F /T /PID $_.ProcessId 2>$null | Out-Null; Write-Output $_.ProcessId } }`;
  let reaped = 0;
  try {
    const out = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${ps}"`, {
      encoding: 'utf8',
    });
    reaped = out.split('\n').map((s) => s.trim()).filter(Boolean).length;
  } catch {
    /* nothing to reap, or PowerShell unavailable — never block dev over this */
  }
  if (reaped) {
    console.log(`predev: reaped ${reaped} orphaned Turbopack process(es) from a previous run`);
  }
}

// 3. wipe a production build that would hang dev
const buildMarkers = ['.next/standalone', '.next/BUILD_ID'];
const polluted = buildMarkers.some((m) => existsSync(m));
if (polluted) {
  rmSync('.next', { recursive: true, force: true });
  console.log('predev: cleared a production build from .next (would hang `next dev`)');
}
