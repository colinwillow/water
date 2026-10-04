// node tools/shot.mjs [out.png] [query] -- boots the page in headless Chromium (swiftshader WebGL),
// reports console errors and shader compile failures, and saves a picture. Dev tool, not a gate.
import { createRequire } from 'module';
import http from 'http'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
const srv = http.createServer((q, r) => {
	const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html'));
	fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(b); } });
}).listen(0);
const port = srv.address().port, out = process.argv[2] || 'shot.png', query = process.argv[3] || '';
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: Number(process.env.W || 900), height: Number(process.env.H || 1300) } });
let bad = 0;
pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') { bad++; console.log('[' + m.type() + ']', m.text().slice(0, 1500)); } });
pg.on('pageerror', e => { bad++; console.log('[pageerror]', e.message); });
await pg.goto(`http://127.0.0.1:${port}/${query}`);
await pg.waitForTimeout(Number(process.env.WAIT || 6000));
if (process.env.EVAL) console.log(await pg.evaluate(process.env.EVAL));
const crash = await pg.evaluate(() => document.getElementById('crash')?.textContent || '');
if (crash) { bad++; console.log('[crash]', crash); }
await pg.screenshot({ path: out });
console.log(bad ? `${bad} problem(s)` : 'clean', '->', out);
await br.close(); srv.close();
process.exit(bad ? 1 : 0);
