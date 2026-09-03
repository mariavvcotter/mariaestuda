/* Gera o currículo em PDF a partir de tools/cv-pt.html e tools/cv-en.html.
   Sem argumentos, gera os dois.

     node tools/build-cv-pdf.mjs              -> os dois PDF na raiz
     node tools/build-cv-pdf.mjs pt           -> só o português
     node tools/build-cv-pdf.mjs en saida.pdf -> o inglês, com nome escolhido

   Precisa de: npm i playwright  (e de um Chromium disponível).
   CHROMIUM_PATH aponta para um binário próprio, se for preciso. */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

const LANGS = ['pt', 'en'];
const [wanted, outArg] = process.argv.slice(2);

if (wanted && !LANGS.includes(wanted)) {
  console.error(`idioma desconhecido: ${wanted}. Use ${LANGS.join(' ou ')}.`);
  process.exit(1);
}

const targets = (wanted ? [wanted] : LANGS).map((lang) => ({
  lang,
  src: 'file://' + path.join(here, `cv-${lang}.html`),
  out: wanted && outArg ? outArg : path.join(root, `maria-cotter-cv-${lang}.pdf`),
}));

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);

for (const { lang, src, out } of targets) {
  const page = await browser.newPage();
  await page.goto(src, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await page.close();
  console.log(`${lang}: ${out}`);
}

await browser.close();
