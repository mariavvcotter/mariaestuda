/* ============================================================
   Preenche as fotografias das notícias.
   Para cada notícia com `imagem: null`, abre o artigo no Público
   ou no Observador, lê a imagem de partilha (og:image) e escreve
   o endereço no ficheiro de dados. As notícias com imagem ficam
   como estão.

     node eco/ferramentas/imagens.mjs

   Corre sozinho no GitHub (.github/workflows/eco-imagens.yml)
   sempre que um ficheiro de notícias muda: o ambiente onde o
   Claude trabalha não chega a estes sites.
   ============================================================ */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'dados');
const ficheiros = fs.readdirSync(DIR).filter((f) => /^noticias.*\.js$/.test(f));

function lerNoticias(texto) {
  const ctx = { window: {} };
  vm.runInNewContext(texto, ctx);
  return ctx.window.ECO_NOTICIAS || [];
}

function ogImage(html, base) {
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  for (const nome of ['og:image:secure_url', 'og:image', 'twitter:image']) {
    for (const m of metas) {
      const chave = (m.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i) || [])[1];
      if (!chave || chave.toLowerCase() !== nome) continue;
      const valor = (m.match(/\bcontent\s*=\s*["']([^"']+)["']/i) || [])[1];
      if (valor) return new URL(valor.replace(/&amp;/g, '&'), base).href;
    }
  }
  return null;
}

let mudou = 0, falhou = 0;
for (const f of ficheiros) {
  const caminho = path.join(DIR, f);
  let texto = fs.readFileSync(caminho, 'utf8');
  for (const n of lerNoticias(texto)) {
    if (n.imagem) continue;
    let img = null;
    try {
      const r = await fetch(n.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mariaestuda-eco/1.0)', 'Accept-Language': 'pt-PT' },
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
      });
      if (r.ok) img = ogImage(await r.text(), r.url);
      else console.log(`  ${r.status}  ${n.url}`);
    } catch (e) {
      console.log(`  erro  ${n.url}  (${e.message})`);
    }
    if (!img || !/^https:\/\//.test(img)) { falhou++; continue; }

    // Escreve só dentro do objeto desta notícia: do seu url até ao url seguinte.
    const i = texto.indexOf(n.url);
    const fim = texto.indexOf('url:', i + n.url.length);
    const j = texto.indexOf('imagem: null', i);
    if (i < 0 || j < 0 || (fim >= 0 && j > fim)) { falhou++; continue; }
    texto = texto.slice(0, j) + 'imagem: ' + JSON.stringify(img).replace(/'/g, "\\'") + texto.slice(j + 'imagem: null'.length);
    mudou++;
    console.log(`  ok    ${n.url}`);
  }
  fs.writeFileSync(caminho, texto);
}
console.log(`\n${mudou} imagens encontradas · ${falhou} sem imagem`);
