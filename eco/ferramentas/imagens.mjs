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

// Valor de um atributo, com ou sem aspas.
function attr(tag, nome) {
  const m = tag.match(new RegExp('\\b' + nome + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i'));
  return m ? (m[1] ?? m[2] ?? m[3]) : null;
}

function ogImage(html, base) {
  const limpa = (v) => new URL(v.replace(/&amp;/g, '&').replace(/\\\//g, '/'), base).href;
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  for (const nome of ['og:image:secure_url', 'og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']) {
    for (const m of metas) {
      const chave = attr(m, 'property') || attr(m, 'name') || attr(m, 'itemprop');
      if (!chave || chave.toLowerCase() !== nome) continue;
      const valor = attr(m, 'content');
      if (valor) return limpa(valor);
    }
  }
  const link = (html.match(/<link\b[^>]*rel\s*=\s*["']?image_src[^>]*>/i) || [])[0];
  if (link && attr(link, 'href')) return limpa(attr(link, 'href'));
  // JSON-LD e dados embebidos: "image":"…", "image":{"url":"…"}, "image":["…"], "thumbnailUrl":"…"
  const j = html.match(/"(?:image|thumbnailUrl)"\s*:\s*(?:\{[^{}]*?"url"\s*:\s*|\[\s*)?"(https?:[^"]+?\.(?:jpe?g|png|webp)[^"]*)"/i);
  if (j) return limpa(j[1]);
  return null;
}

const CABECALHOS = {
  // Com um identificador de robô o Público responde com a página vazia.
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-PT,pt;q=0.9',
};

async function imagemDaPagina(url) {
  const r = await fetch(url, { headers: CABECALHOS, redirect: 'follow', signal: AbortSignal.timeout(20000) });
  if (!r.ok) { console.log(`  ${r.status}  ${url}`); return null; }
  const html = await r.text();
  const img = ogImage(html, r.url);
  if (!img) {
    const titulo = (html.match(/<title[^>]*>([^<]*)/i) || [])[1] || '';
    console.log(`  sem imagem na página (${html.length} bytes, título «${titulo.trim().slice(0, 60)}», ${r.url})`);
  }
  return img;
}

// Plano B para o Público: a API que o próprio site usa, pelo número no fim do endereço.
async function imagemDaApiPublico(id) {
  for (const url of [`https://www.publico.pt/api/content/news/${id}`, `https://www.publico.pt/api/content/${id}`]) {
    try {
      const r = await fetch(url, { headers: { ...CABECALHOS, Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
      const t = await r.text();
      const m = t.match(/https?:\\?\/\\?\/[^"\s]+?\.(?:jpe?g|png|webp)[^"\s]*/i);
      console.log(`  api ${r.status} ${t.length} bytes ${m ? 'com imagem' : 'sem imagem'}  ${url}`);
      if (m) return m[0].replace(/\\\//g, '/');
    } catch (e) { console.log(`  api erro ${url} (${e.message})`); }
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
      img = await imagemDaPagina(n.url);
      const id = (n.url.match(/publico\.pt\/.*-(\d{6,})\/?$/) || [])[1];
      if (!img && id) img = await imagemDaApiPublico(id);
    } catch (e) {
      console.log(`  erro  ${n.url}  (${e.message})`);
    }
    if (img && img.startsWith('http://')) img = 'https://' + img.slice(7);   // o site é https
    if (!img || !/^https:\/\//.test(img)) { if (img) console.log(`  imagem recusada ${img}`); falhou++; continue; }

    // Escreve só dentro do objeto desta notícia: do seu url até ao url seguinte.
    const i = texto.indexOf(n.url);
    const fim = texto.indexOf('url:', i + n.url.length);
    const j = texto.indexOf('imagem: null', i);
    if (i < 0 || j < 0 || (fim >= 0 && j > fim)) { console.log(`  não achei onde escrever ${n.url}`); falhou++; continue; }
    texto = texto.slice(0, j) + 'imagem: ' + JSON.stringify(img).replace(/'/g, "\\'") + texto.slice(j + 'imagem: null'.length);
    mudou++;
    console.log(`  ok    ${n.url}`);
  }
  fs.writeFileSync(caminho, texto);
}
console.log(`\n${mudou} imagens encontradas · ${falhou} sem imagem`);
