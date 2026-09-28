/* ============================================================
   Testes de navegador da plataforma de Economia (eco/).
   O Supabase é imitado aqui dentro (page.route), com as mesmas
   regras do schema.sql; as permissões a sério testam-se em
   schema.sh contra PostgreSQL.

     python3 -m http.server 8766 &      (na raiz do repositório)
     NODE_PATH=$(npm root -g) node eco/testes/navegador.cjs
   ============================================================ */
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://127.0.0.1:8766';
const SENHA = 'senha-de-teste-123';
let passam = 0, falham = 0;
function ok(rotulo, cond, extra) {
  if (cond) { passam++; console.log('  OK   ' + rotulo); }
  else { falham++; console.log(' FALHA ' + rotulo + (extra !== undefined ? '  → ' + extra : '')); }
}

function backendFalso() {
  const db = { alunos: {}, abertas: ['u1'] };
  return {
    db,
    async handler(route) {
      const req = route.request();
      const fn = req.url().split('/rpc/')[1];
      const a = req.postDataJSON() || {};
      const res = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      const chave = (s) => String(s || '').trim().toLowerCase();
      if (fn === 'eco_desbloqueadas') return res(200, db.abertas);
      if (fn === 'eco_entrar') { const u = db.alunos[chave(a.p_username)]; return res(200, u ? { username: u.username, nome: u.nome, progresso: u.progresso } : null); }
      if (fn === 'eco_guardar') { const u = db.alunos[chave(a.p_username)]; if (u) u.progresso = a.p_progresso; return res(200, !!u); }
      if (fn === 'eco_admin') {
        if (a.p_senha !== SENHA) return res(400, { message: 'Palavra-passe errada.' });
        const d = a.p_dados || {};
        switch (a.p_acao) {
          case 'verificar': return res(200, { ok: true });
          case 'listar': return res(200, Object.values(db.alunos));
          case 'criar': {
            const u = chave(d.username);
            if (db.alunos[u]) return res(400, { message: 'Já existe um aluno com o nome de utilizador «' + u + '».' });
            db.alunos[u] = { username: u, nome: d.nome || u, progresso: {}, atualizado_em: new Date().toISOString() };
            return res(200, { ok: true, username: u });
          }
          case 'apagar': delete db.alunos[chave(d.username)]; return res(200, { ok: true });
          case 'repor': db.alunos[chave(d.username)].progresso = {}; return res(200, { ok: true });
          case 'desbloquear': db.abertas = d.unidades; return res(200, { ok: true });
        }
      }
      return res(404, { message: 'função desconhecida' });
    },
  };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const erros = [];

  /* ---------- com base de dados ---------- */
  const be = backendFalso();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.route('**/rest/v1/rpc/**', (r) => be.handler(r));
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.abort());
  const page = await ctx.newPage();
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erros.push(m.text()); });

  await page.goto(BASE + '/eco/');
  await page.waitForSelector('#f');
  ok('abre no ecrã de entrada', await page.isVisible('text=O teu nome de utilizador'));

  // professora
  await page.click('text=Sou a professora');
  await page.fill('#c', 'errada');
  await page.click('button[type=submit]');
  await page.waitForSelector('#err:has-text("Palavra-passe errada")');
  ok('recusa a senha errada', true);
  await page.fill('#c', SENHA);
  await page.click('button[type=submit]');
  await page.waitForSelector('h1:has-text("Gestão")');
  ok('entra na gestão com a senha certa', true);

  await page.fill('#n-nome', 'Joana Martins');
  const sugerido = await page.inputValue('#n-user');
  ok('sugere um nome de utilizador', /^joana\.m\d\d$/.test(sugerido), sugerido);
  await page.fill('#n-user', 'joana.m7');
  await page.click('#novo button[type=submit]');
  await page.waitForSelector('.aluno:has-text("joana.m7")');
  ok('cria o aluno e mostra-o na lista', true);

  await page.check('#abertas input[value=u3]');
  await page.click('#guardar-abertas');
  await page.waitForFunction(() => document.getElementById('toast').textContent.includes('Guardado'));
  ok('abre a unidade 3 aos alunos', be.db.abertas.includes('u3') && be.db.abertas.includes('u1'), be.db.abertas);

  await page.click('#nav a[data-sec=resumos]');
  await page.waitForSelector('h1:has-text("Resumos")');
  ok('a professora vê todas as unidades abertas', (await page.$$('.uni.fechada')).length === 0);

  page.once('dialog', (d) => d.accept());
  await page.click('#quem');
  await page.waitForSelector('#f');

  // aluno
  await page.fill('#c', 'ninguem');
  await page.click('button[type=submit]');
  await page.waitForSelector('#err:has-text("Não encontrei")');
  ok('recusa um nome que não existe', true);
  await page.fill('#c', '  JOANA.M7 ');
  await page.click('button[type=submit]');
  await page.waitForSelector('h1:has-text("Olá, Joana")');
  ok('o aluno entra só com o nome (maiúsculas e espaços não contam)', true);
  ok('painel mostra as 11 unidades', (await page.$$('.uni')).length === 11);

  await page.click('#nav a[data-sec=resumos]');
  await page.waitForSelector('h1:has-text("Resumos")');
  const fechadas = await page.$$eval('.uni.fechada', (els) => els.length);
  ok('o aluno só vê abertos os resumos desbloqueados (9 fechados)', fechadas === 9, fechadas);
  await page.click('a[href="#resumo/u2"]');
  await page.waitForSelector('text=ainda não está disponível');
  ok('resumo fechado mostra o cadeado', true);
  await page.goto(BASE + '/eco/#resumo/u1');
  await page.waitForSelector('article.texto');
  ok('resumo aberto tem conteúdo', (await page.textContent('article.texto')).length > 500);

  // treino
  await page.click('#nav a[data-sec=treino]');
  await page.waitForSelector('#comecar');
  await page.click('#sel-nada');
  ok('sem unidades, não deixa começar', await page.isDisabled('#comecar'));
  await page.check('.escolha-uni input[value=u1]');
  await page.click('[data-n="10"]');
  await page.click('#comecar');
  await page.waitForSelector('.q-enunciado');
  const primeira = await page.textContent('.q-enunciado');
  let certas = 0;
  for (let i = 0; i < 10; i++) {
    await page.waitForSelector('.opcao:not([disabled])');
    const uni = await page.textContent('.q-uni');
    if (!/Unidade 1 /.test(uni)) ok('só aparecem perguntas da unidade escolhida', false, uni);
    await page.click('.opcao >> nth=0');
    await page.waitForSelector('.feedback');
    if (await page.$('.feedback.ok')) certas++;
    const exp = await page.textContent('.feedback p');
    if (!exp || exp.length < 20) ok('cada resposta traz explicação', false, exp);
    await page.click('#seguinte');
  }
  await page.waitForSelector('.resultado');
  const nota = await page.textContent('.nota');
  ok('resultado final bate com as respostas', nota.trim() === certas + ' / 10', nota + ' vs ' + certas);
  await page.waitForTimeout(1200);
  const guardado = Object.keys((be.db.alunos['joana.m7'].progresso || {}).r || {}).length;
  ok('o progresso chega à base de dados', guardado === 10, guardado);

  // ordem aleatória: dois treinos seguidos não começam igual (probabilístico, 5 tentativas)
  let diferente = false;
  for (let t = 0; t < 5 && !diferente; t++) {
    await page.goto(BASE + '/eco/#treino');
    await page.waitForSelector('#comecar');
    await page.click('#sel-todas');
    await page.click('#comecar');
    await page.waitForSelector('.q-enunciado');
    diferente = (await page.textContent('.q-enunciado')) !== primeira;
    page.once('dialog', (d) => d.accept());
    await page.click('#sair');
  }
  ok('as perguntas aparecem por ordem aleatória', diferente);

  await page.click('#nav a[data-sec=inicio]');
  await page.waitForSelector('.uni');
  const nivelU1 = await page.textContent('.uni >> nth=0 >> .nivel');
  ok('a unidade 1 passa a ter nível', !/Por avaliar/.test(nivelU1), nivelU1);
  ok('o painel diz em quantas unidades está bem', /\d+\/11/.test(await page.textContent('.anel')));

  // notícias
  await page.click('#nav a[data-sec=noticias]');
  await page.waitForSelector('h1:has-text("Notícias")');
  const nNot = await page.$$eval('.noticia', (e) => e.length);
  ok('há notícias', nNot >= 22, nNot);
  await page.click('.filtro [data-f=u5]');
  await page.waitForSelector('text=Unidade 5 · Preços');
  const soU5 = await page.$$eval('.noticia .noticia-meta', (e) => e.every((x) => x.textContent.includes('Unidade 5')));
  ok('o filtro por unidade funciona', soU5);
  const links = await page.$$eval('.noticia a.ler', (e) => e.map((a) => a.href));
  ok('cada notícia tem link para o Público ou o Observador', links.length && links.every((h) => /^https:\/\/(www\.)?(publico|observador)\.pt\//.test(h)), links[0]);

  // sessão sobrevive a recarregar
  await page.reload();
  await page.waitForSelector('h1:has-text("Notícias")');
  ok('a sessão sobrevive a recarregar a página', true);

  // sem scroll horizontal no telemóvel, em todos os ecrãs
  for (const h of ['#inicio', '#resumos', '#resumo/u1', '#treino', '#noticias']) {
    await page.goto(BASE + '/eco/' + h);
    await page.waitForTimeout(250);
    const larg = await page.evaluate(() => document.documentElement.scrollWidth);
    if (larg > 390) ok('sem scroll horizontal em ' + h, false, larg);
  }
  ok('nenhum ecrã tem scroll horizontal a 390 px', true);
  await page.goto(BASE + '/eco/#inicio');
  await page.waitForSelector('.uni');
  await page.screenshot({ path: process.env.CAPTURAS ? process.env.CAPTURAS + '/inicio.png' : '/dev/null', fullPage: false });
  await ctx.close();

  /* ---------- sem base de dados (modo local) ---------- */
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx2.route('**/rest/v1/**', (r) => r.abort());
  const p2 = await ctx2.newPage();
  p2.on('pageerror', (e) => erros.push(e.message));
  await p2.goto(BASE + '/eco/');
  await p2.waitForSelector('text=Sem ligação à base de dados');
  ok('sem base de dados avisa que é modo local', true);
  await p2.fill('#c', 'teste');
  await p2.click('button[type=submit]');
  await p2.waitForSelector('text=Modo local');
  ok('sem base de dados entra na mesma e guarda no aparelho', true);
  await ctx2.close();

  await browser.close();
  ok('sem erros de JavaScript', erros.length === 0, erros.join(' | '));
  console.log('\n' + passam + ' passam · ' + falham + ' falham');
  process.exit(falham ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
