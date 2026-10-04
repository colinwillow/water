// npm run check -- the module script in index.html must parse. A file that will not parse is a blank page.
import fs from 'fs'; import os from 'os'; import path from 'path'; import { execFileSync } from 'child_process';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const m = html.match(/<script type="module">([\s\S]*?)<\/script>/); if (!m) { console.error('no module script'); process.exit(1); }
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'wchk-')), 'main.mjs');
fs.writeFileSync(tmp, m[1]);
try { execFileSync(process.execPath, ['--check', tmp], { stdio: 'inherit' }); console.log('syntax ok'); }
catch { process.exit(1); }
