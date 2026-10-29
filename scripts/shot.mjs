import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const url = process.argv[2] ?? 'http://localhost:4001/zhulong';
const out = process.argv[3] ?? '/tmp/shot.png';
const waitMs = Number(process.argv[4] ?? 2500);
const keys = (process.argv[5] ?? '').split(',').filter(Boolean);

const exe = await chromium.executablePath();
console.log('chromium:', exe);
const browser = await puppeteer.launch({
  args: [...chromium.args, '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
  executablePath: exe,
  headless: 'shell',
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, waitMs));
for (const k of keys) {
  await page.keyboard.press(k);
  await new Promise((r) => setTimeout(r, 450));
}
await page.screenshot({ path: out });
console.log('saved', out);
if (logs.length) console.log('--- console ---\n' + logs.slice(0, 40).join('\n'));
await browser.close();
