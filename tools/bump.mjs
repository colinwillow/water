// npm run bump -- raises BUILD in index.html and rewrites version.json. Run before every push:
// Pages caches index.html, so a build that does not announce itself looks like the one before it.
import fs from 'fs';
const f = new URL('../index.html', import.meta.url);
let s = fs.readFileSync(f, 'utf8');
const m = s.match(/const BUILD = (\d+);/); if (!m) { console.error('BUILD not found'); process.exit(1); }
const n = Number(m[1]) + 1;
s = s.replace(m[0], `const BUILD = ${n};`).replace(/<b id="bn">w\d+<\/b>/, `<b id="bn">w${n}</b>`);
fs.writeFileSync(f, s);
fs.writeFileSync(new URL('../version.json', import.meta.url), JSON.stringify({ build: n }) + '\n');
console.log('build w' + n);
