import puppeteer from 'puppeteer';
import { resolve } from 'path';

const filePath = resolve('./index.html');
const url = `file://${filePath}?print-pdf`;
console.log(`Loading ${url}`);

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--allow-file-access-from-files',
    '--disable-web-security',
  ],
});

const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for Reveal.js to fully render
await page.waitForFunction(() => window.Reveal && window.Reveal.isReady(), { timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));

await page.pdf({
  path: 'p.pdf',
  width: '1280px',
  height: '720px',
  printBackground: true,
  preferCSSPageSize: true,
});

console.log('PDF saved to p.pdf');
await browser.close();
