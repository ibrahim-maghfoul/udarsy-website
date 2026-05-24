// Remove the Turbopack/Next build cache. A corrupted .next/dev cache is a common
// cause of "the dev server won't serve / recompiles forever". Cross-platform so it
// works on Windows dev machines and the Linux deploy host alike.
//
// Usage: node scripts/clean.mjs

import { rmSync } from 'node:fs';

for (const dir of ['.next', '.turbo']) {
  rmSync(dir, { recursive: true, force: true });
  console.log(`clean: removed ${dir}`);
}
