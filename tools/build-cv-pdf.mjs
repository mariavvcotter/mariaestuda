/* Gera o CV em PDF a partir de tools/cv-en.html.
   Uso: node tools/build-cv-pdf.mjs [ficheiro-de-saida.pdf]
   Precisa de: npm i playwright  (e de um Chromium disponível) */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = 'file://' + path.join(here, 'cv-en.html');
const out = process.argv[2] || path.join(here, '..', 'maria-cotter-cv.pdf');

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const page = await browser.newPage();
await page.goto(src, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('escrito:', out);
