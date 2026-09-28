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
  // edc_users: a tabela da conta partilhada (/account/), aberta à chave anon como no Supabase real
  const db = { users: {}, abertas: ['u1'] };
  const res = (route, status, body) => route.fulfill({ status, contentType: 'application/json', body: body === undefined ? '' : JSON.stringify(body) });
  return {
    db,
    async tabela(route) {
      const req = route.request(), url = new URL(req.url());
      const k = decodeURIComponent((url.searchParams.get('username_key') || '').replace(/^eq\./, ''));
      if (req.method() === 'GET') { const u = db.users[k]; return res(route, 200, u ? [{ name: u.name, pin: u.pin, progress: u.progress }] : []); }
      if (req.method() === 'POST') {
        const b = req.postDataJSON();
        if (db.users[b.username_key]) return res(route, 409, { message: 'duplicate' });
        db.users[b.username_key] = { name: b.name, pin: b.pin, progress: b.progress || {}, updated_at: new Date().toISOString() };
        return res(route, 201);
      }
      if (req.method() === 'PATCH') { const b = req.postDataJSON(); if (db.users[k]) Object.assign(db.users[k], b); return res(route, 204); }
      return res(route, 405);
    },
    async rpc(route) {
      const req = route.request();
      const fn = req.url().split('/rpc/')[1];
      const a = req.postDataJSON() || {};
      if (fn === 'eco_desbloqueadas') return res(route, 200, db.abertas);
      if (fn === 'eco_admin') {
        if (a.p_senha !== SENHA) return res(route, 400, { message: 'Palavra-passe errada.' });
        const d = a.p_dados || {};
        if (a.p_acao === 'verificar') return res(route, 200, { ok: true });
        if (a.p_acao === 'listar') return res(route, 200, Object.values(db.users).filter((u) => u.progress && u.progress.eco)
          .map((u) => ({ nome: u.name, eco: u.progress.eco, atualizado_em: u.updated_at })));
        if (a.p_acao === 'desbloquear') { db.abertas = d.unidades; return res(route, 200, { ok: true }); }
      }
      return res(route, 404, { message: 'função desconhecida' });
    },
  };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const erros = [];

  /* ---------- com base de dados ---------- */
  const be = backendFalso();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.route('**/rest/v1/rpc/**', (r) => be.rpc(r));
  await ctx.route('**/rest/v1/edc_users**', (r) => be.tabela(r));
  await ctx.route('**/rest/v1/usage_events**', (r) => r.fulfill({ status: 201, body: '' }));
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.abort());
  const page = await ctx.newPage();
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erros.push(m.text()); });

  await page.goto(BASE + '/eco/');
  await page.waitForSelector('h1:has-text("Olá")');
  ok('abre direto no painel, como convidado', await page.isVisible('text=Estás como convidado'));
  ok('o botão Entrar da conta partilhada está no topo', await page.isVisible('#user-slot .acc-login'));

  // resumos como convidado
  await page.click('#nav a[data-sec=resumos]');
  await page.waitForSelector('h1:has-text("Resumos")');
  ok('só a unidade aberta pela professora está disponível (11 fechadas)', (await page.$$('.uni.fechada')).length === 11);

  // criar conta com Nome + PIN (a mesma do /edc)
  await page.click('#user-slot .acc-login');
  await page.click('.acc-switch-btn');
  await page.fill('.acc-user-in', 'Joana');
  await page.fill('.acc-pin-in', '1234');
  await Promise.all([page.waitForNavigation(), page.click('.acc-submit')]);
  await page.waitForSelector('#user-slot .acc-user');
  ok('cria conta com Nome + PIN e fica com sessão', (await page.textContent('#user-slot')).includes('Joana'));
  ok('a conta ficou na tabela partilhada edc_users', !!be.db.users['joana']);
  await page.goto(BASE + '/eco/#inicio');
  await page.waitForSelector('h1:has-text("Olá, Joana")');
  ok('o painel cumprimenta pelo nome da conta', true);
  ok('painel mostra as 12 unidades', (await page.$$('.uni')).length === 12);

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
  let certas = 0, soU1 = true, comExp = true;
  for (let i = 0; i < 10; i++) {
    await page.waitForSelector('.opcao:not([disabled])');
    if (!/Unidade 1 /.test(await page.textContent('.q-uni'))) soU1 = false;
    await page.click('.opcao >> nth=0');
    await page.waitForSelector('.feedback');
    if (await page.$('.feedback.ok')) certas++;
    if ((await page.textContent('.feedback p')).length < 20) comExp = false;
    await page.click('#seguinte');
  }
  ok('só aparecem perguntas da unidade escolhida', soU1);
  ok('cada resposta traz explicação', comExp);
  await page.waitForSelector('.resultado');
  const nota = await page.textContent('.nota');
  ok('resultado final bate com as respostas', nota.trim() === certas + ' / 10', nota + ' vs ' + certas);
  await page.waitForTimeout(2200);
  const remoto = be.db.users['joana'].progress.eco;
  const nRemoto = remoto && remoto.eco_prog ? Object.keys(JSON.parse(remoto.eco_prog).r).length : 0;
  ok('o progresso chega à conta (fatia "eco" da edc_users)', nRemoto === 10, JSON.stringify(remoto).slice(0, 80));
  ok('não mexe na fatia de outras secções', Object.keys(be.db.users['joana'].progress).every((k) => k === 'eco'));

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

  await page.goto(BASE + '/eco/#inicio');
  await page.waitForSelector('.uni');
  ok('a unidade 1 passa a ter nível', !/Por avaliar/.test(await page.textContent('.uni >> nth=0 >> .nivel')));
  ok('o painel diz em quantas unidades está bem', /\d+\/12/.test(await page.textContent('.anel')));

  // sair e voltar a entrar noutro "aparelho": o progresso volta
  await Promise.all([page.waitForNavigation(), page.click('#user-slot .acc-logout')]);
  await page.waitForSelector('text=Estás como convidado');
  ok('ao sair, o aparelho fica limpo', (await page.textContent('.uni >> nth=0 >> .uni-info')).startsWith('0/'));
  await page.click('#user-slot .acc-login');
  await page.fill('.acc-user-in', 'joana');
  await page.fill('.acc-pin-in', '9999');
  await page.click('.acc-submit');
  await page.waitForSelector('.acc-error:has-text("PIN incorreto")');
  ok('PIN errado é recusado', true);
  await page.fill('.acc-pin-in', '1234');
  await Promise.all([page.waitForNavigation(), page.click('.acc-submit')]);
  await page.waitForSelector('.uni');
  ok('ao voltar a entrar, o progresso regressa', (await page.textContent('.uni >> nth=0 >> .uni-info')).startsWith('10/'),
    await page.textContent('.uni >> nth=0 >> .uni-info'));

  // professora
  await page.goto(BASE + '/eco/#admin');
  await page.waitForSelector('text=Área da professora');
  await page.fill('#c', 'errada');
  await page.click('#f button[type=submit]');
  await page.waitForSelector('#err:has-text("Palavra-passe errada")');
  ok('a gestão recusa a senha errada', true);
  await page.fill('#c', SENHA);
  await page.click('#f button[type=submit]');
  await page.waitForSelector('h1:has-text("Gestão")');
  ok('a gestão abre com a senha certa', true);
  await page.waitForSelector('.aluno:has-text("Joana")');
  ok('a gestão mostra o progresso da Joana', (await page.textContent('.aluno')).includes('10 perguntas feitas'));
  await page.check('#abertas input[value=u3]');
  await page.click('#guardar-abertas');
  await page.waitForFunction(() => document.getElementById('toast').textContent.includes('Guardado'));
  ok('abre a unidade 3 aos alunos', be.db.abertas.includes('u3') && be.db.abertas.includes('u1'), be.db.abertas);
  await page.click('#nav a[data-sec=resumos]');
  await page.waitForSelector('h1:has-text("Resumos")');
  ok('a professora vê todas as unidades', (await page.$$('.uni.fechada')).length === 0);
  await page.goto(BASE + '/eco/#admin');
  await page.click('#sair-admin');
  await page.goto(BASE + '/eco/#resumos');
  await page.waitForSelector('.uni');
  ok('depois de sair da gestão, o aluno vê as unidades 1 e 3 abertas', (await page.$$('.uni.fechada')).length === 10);
  await page.goto(BASE + '/eco/#resumo/u3');
  await page.waitForSelector('article.texto');
  ok('resumo aberto tem conteúdo', (await page.textContent('article.texto')).length > 500);
  await page.goto(BASE + '/eco/#resumo/u2');
  await page.waitForSelector('text=ainda não está disponível');
  ok('resumo fechado mostra o cadeado', true);

  // notícias
  await page.click('#nav a[data-sec=noticias]');
  await page.waitForSelector('h1:has-text("Notícias")');
  ok('há notícias', (await page.$$('.noticia')).length >= 24);
  await page.click('.filtro [data-f=u5]');
  await page.waitForSelector('text=Unidade 5 · Preços');
  ok('o filtro por unidade funciona', await page.$$eval('.noticia .noticia-meta', (e) => e.every((x) => x.textContent.includes('Unidade 5'))));
  const links = await page.$$eval('.noticia a.ler', (e) => e.map((a) => a.href));
  ok('cada notícia tem link para o Público ou o Observador', links.length && links.every((h) => /^https:\/\/(www\.)?(publico|observador)\.pt\//.test(h)), links[0]);

  for (const h of ['#inicio', '#resumos', '#resumo/u1', '#treino', '#noticias', '#admin']) {
    await page.goto(BASE + '/eco/' + h);
    await page.waitForTimeout(250);
    const larg = await page.evaluate(() => document.documentElement.scrollWidth);
    if (larg > 390) ok('sem scroll horizontal em ' + h, false, larg);
  }
  ok('nenhum ecrã tem scroll horizontal a 390 px', true);
  if (process.env.CAPTURAS) {
    await page.goto(BASE + '/eco/#inicio'); await page.waitForSelector('.uni');
    await page.screenshot({ path: process.env.CAPTURAS + '/inicio.png' });
  }
  await ctx.close();

  /* ---------- sem base de dados (modo local) ---------- */
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx2.route('**/rest/v1/**', (r) => r.abort());
  const p2 = await ctx2.newPage();
  p2.on('pageerror', (e) => erros.push(e.message));
  await p2.goto(BASE + '/eco/');
  await p2.waitForSelector('h1:has-text("Olá")');
  ok('sem base de dados a plataforma abre na mesma', true);
  await p2.goto(BASE + '/eco/#resumos');
  await p2.waitForSelector('.uni');
  ok('sem base de dados abre os resumos do config.js', (await p2.$$('.uni.fechada')).length === 11);
  await ctx2.close();

  await browser.close();
  ok('sem erros de JavaScript', erros.length === 0, erros.join(' | '));
  console.log('\n' + passam + ' passam · ' + falham + ' falham');
  process.exit(falham ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
