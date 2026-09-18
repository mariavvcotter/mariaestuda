/* ============================================================
   Testes de navegador: a interface, ponta a ponta.
   As permissões são testadas contra PostgreSQL em correr.sh —
   aqui prova-se que os ecrãs fazem o que dizem.

     node explicandos/testes/navegador.mjs
   ============================================================ */
import { chromium } from 'playwright';
import { criaBackend } from './supabase-falso.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:8765';
const CHROME = process.env.CHROME || undefined;
const hoje = new Date().toISOString().slice(0, 10);
const diasAtras = (k) => {
  const d = new Date(); d.setDate(d.getDate() - k); return d.toISOString().slice(0, 10);
};
const daquiA = (k) => {
  const d = new Date(); d.setDate(d.getDate() + k); return d.toISOString().slice(0, 10);
};

const verificacoes = [];
const erros = [];
function ok(rotulo, obtido, esperado) {
  const passa = String(obtido) === String(esperado);
  verificacoes.push({ passa, texto: `${passa ? '  OK  ' : ' FALHA'}  ${rotulo}: ${obtido}` +
    (passa ? '' : `  (esperado ${esperado})`) });
}

/* ---------------- dados de partida ---------------- */
function sementes() {
  const P = {
    maria: 'p-maria', maeRita: 'p-mae-rita', rita: 'p-rita',
    paiTomas: 'p-pai-tomas', tomas: 'p-tomas', beatriz: 'p-beatriz',
  };
  const A = { rita: 'a-rita', tomas: 'a-tomas', beatriz: 'a-beatriz' };
  return {
    perfis: [
      { id: P.maria, email: 'maria@exemplo.pt', nome: 'Maria', ativo: true, is_admin: true, ve_conta_corrente: true, ve_materiais: true },
      { id: P.maeRita, email: 'mae.rita@exemplo.pt', nome: 'Mãe da Rita', ativo: true, is_admin: false, ve_conta_corrente: true, ve_materiais: false },
      { id: P.rita, email: 'rita@exemplo.pt', nome: 'Rita', ativo: true, is_admin: false, ve_conta_corrente: false, ve_materiais: true },
      { id: P.paiTomas, email: 'pai.tomas@exemplo.pt', nome: 'Pai do Tomás', ativo: true, is_admin: false, ve_conta_corrente: true, ve_materiais: false },
      { id: P.tomas, email: 'tomas@exemplo.pt', nome: 'Tomás', ativo: true, is_admin: false, ve_conta_corrente: false, ve_materiais: true },
      { id: P.beatriz, email: 'beatriz@exemplo.pt', nome: 'Beatriz', ativo: true, is_admin: false, ve_conta_corrente: true, ve_materiais: true },
    ],
    alunos: [
      { id: A.rita, nome: 'Rita Silva', ano: '5.º', disciplinas: 'Matemática', preco_hora: 10, encarregado_id: P.maeRita, aluno_perfil_id: P.rita, arquivado: false },
      { id: A.tomas, nome: 'Tomás Faria', ano: '3.º', disciplinas: 'Todas', preco_hora: 8, encarregado_id: P.paiTomas, aluno_perfil_id: P.tomas, arquivado: false },
      { id: A.beatriz, nome: 'Beatriz Nunes', ano: '11.º', disciplinas: 'Economia', preco_hora: 15, encarregado_id: P.beatriz, aluno_perfil_id: P.beatriz, arquivado: false },
    ],
    explicacoes: [
      { id: 'e1', data: diasAtras(3), duracao_min: 60, sumario: 'Frações equivalentes', criado_em: diasAtras(3) },
    ],
    // Explicação de grupo: cada aluno gera o seu próprio débito.
    explicacao_alunos: [
      { explicacao_id: 'e1', aluno_id: A.rita, valor_eur: 8 },
      { explicacao_id: 'e1', aluno_id: A.tomas, valor_eur: 8 },
    ],
    pagamentos: [{ id: 'g1', aluno_id: A.rita, data: diasAtras(1), valor_eur: 20, nota: 'MB Way' }],
    materiais: [
      { id: 'm1', titulo: 'Fichas de frações', disciplina: 'Matemática', ano: '5', storage_path: 'x1/fracoes.pdf', tamanho_bytes: 120000, criado_em: diasAtras(10) },
      { id: 'm2', titulo: 'Teste modelo', disciplina: 'Matemática', ano: '5', storage_path: 'x2/teste.pdf', tamanho_bytes: 90000, criado_em: diasAtras(9) },
      { id: 'm3', titulo: 'Tabuada', disciplina: 'Matemática', ano: '3', storage_path: 'x3/tabuada.pdf', tamanho_bytes: 40000, criado_em: diasAtras(8) },
    ],
    material_alunos: [
      { material_id: 'm1', aluno_id: A.rita, publicar_em: null },
      { material_id: 'm2', aluno_id: A.rita, publicar_em: daquiA(7) },   // ainda não
      { material_id: 'm3', aluno_id: A.rita, publicar_em: null },
      { material_id: 'm3', aluno_id: A.tomas, publicar_em: null },
    ],
    tpcs: [
      { id: 't1', aluno_id: A.tomas, descricao: 'Exercícios 3 a 7 da página 42', entrega: daquiA(2), estado: 'por_fazer', nota: null, criado_em: diasAtras(1) },
      { id: 't2', aluno_id: A.tomas, descricao: 'Tabuada do 7', entrega: null, estado: 'confirmado', nota: 4, criado_em: diasAtras(9) },
    ],
    tpc_materiais: [{ tpc_id: 't1', material_id: 'm3' }],
    notas_proxima: [
      { id: 'n1', aluno_id: A.tomas, texto: 'Trazer o caderno de Estudo do Meio', criado_em: diasAtras(1), consumida_em: null },
    ],
    horario: [
      { id: 'h1', aluno_id: A.rita, dia_semana: new Date().getDay(), hora_inicio: '17:00:00', duracao_min: 60, ativo: true },
    ],
    horario_excecoes: [], horario_extras: [],
  };
}

/* ---------------- ligação ---------------- */
const backend = criaBackend(sementes());

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const page = await browser.newPage({ viewport: { width: 430, height: 950 } });
page.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
page.on('console', (m) => {
  const txt = m.text();
  // O sandbox bloqueia o Google Fonts; isso não é um erro da aplicação.
  if (m.type() === 'error' && !/ERR_CERT|fonts\.googleapis/.test(txt)) erros.push('console: ' + txt);
});

await page.route('**/auth/v1/**', (r) => r.fulfill(backend.responde(r.request())));
await page.route('**/rest/v1/**', (r) => r.fulfill(backend.responde(r.request())));
await page.route('**/storage/v1/**', (r) => r.fulfill(backend.responde(r.request())));
await page.route('**/functions/v1/**', (r) => r.fulfill(backend.responde(r.request())));

async function entra(email) {
  await page.goto(BASE + '/explicandos/');
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE + '/explicandos/');
  await page.fill('#gate-email', email);
  await page.fill('#gate-pw', 'segredo123!');
  await page.click('#gate-btn');
  await page.waitForSelector('#app:not(.hidden)', { timeout: 8000 });
}
const gravar = () => page.click('.sheet button[type="submit"]');
const fechou = () => page.waitForSelector('.sheet.hidden', { state: 'attached' });
// Dentro de uma ficha, gravar devolve à ficha em vez de fechar.
const voltou = (titulo) => page.waitForFunction(
  (t) => document.querySelector('.sheet .sheet-top h2')?.textContent === t, titulo);
const fecha = () => page.click('.sheet .sheet-top button');
const aba = (n) => page.click(`nav.tabs button[data-tab="${n}"]`);

/* ============================================================
   A administradora
   ============================================================ */
await entra('maria@exemplo.pt');
ok('painel da administradora abre', await page.textContent('#top-title'), 'Hoje');
ok('a barra tem os 5 separadores', await page.locator('nav.tabs button').count(), 5);
ok('3 alunos ativos', await page.textContent('#s-alunos, .stat .n >> nth=0'), '3');

// O horário de hoje prevê a explicação da Rita, e diz que falta registá-la.
ok('o horário prevê 1 explicação para hoje', await page.locator('#v-hoje .prev').count(), 1);
ok('e marca-a por registar', (await page.textContent('#v-hoje .prev-main .meta')).trim(), 'por registar');

// Tomás deve 8 €: teve explicação e não pagou. A Rita teve a mesma
// explicação mas pagou 20 €, por isso está a favor e não aparece.
ok('só o Tomás está a dever', await page.locator('#v-hoje .row').count(), 1);
ok('e é mesmo ele', await page.textContent('#v-hoje .row .name'), 'Tomás Faria');
ok('com os 8 € do débito dele', await page.textContent('#v-hoje .row .saldo'), '-8,00 €');

/* --- registar explicação de grupo com valores diferentes --- */
await aba('registos');
await page.click('#v-registos .btn-row button');
await page.click('.sheet .escolher .chip:has-text("Rita Silva")');
await page.click('.sheet .escolher .chip:has-text("Beatriz Nunes")');
await page.selectOption('#f-dur', '90');
ok('o valor da Rita sai do preço de tabela × duração',
  await page.inputValue('.sheet .valor-linha:has-text("Rita Silva") input'), '15');
ok('o da Beatriz também, com o preço dela',
  await page.inputValue('.sheet .valor-linha:has-text("Beatriz Nunes") input'), '22.5');
// O caderno diz que o valor é sempre editável: escrever por cima tem de pegar.
await page.fill('.sheet .valor-linha:has-text("Beatriz Nunes") input', '20');
await page.fill('#f-sum', 'Elasticidade da procura');
await gravar();
await fechou();

const beatriz = backend.tabelas.explicacao_alunos.find(
  (x) => x.aluno_id === 'a-beatriz');
ok('grava o valor escrito à mão, não o sugerido', beatriz.valor_eur, 20);
ok('a nota da próxima explicação do Tomás continua de pé',
  backend.tabelas.notas_proxima.filter((n) => !n.consumida_em).length, 1);

/* --- mudar o preço-hora não recalcula o passado (§101) --- */
await aba('alunos');
await page.click('#v-alunos .row:has-text("Beatriz")');
await page.click('.sheet .btn-row button:has-text("Editar")');
await page.fill('#f-preco', '25');
await gravar();
await voltou('Beatriz Nunes');
ok('gravar dentro da ficha volta à ficha, não ao princípio',
  await page.textContent('.sheet .sheet-top h2'), 'Beatriz Nunes');
await fecha();
ok('mudar o preço-hora não mexe no que já foi registado',
  backend.tabelas.explicacao_alunos.find((x) => x.aluno_id === 'a-beatriz').valor_eur, 20);

/* --- pagamento liquida a dívida --- */
await aba('alunos');
await page.click('#v-alunos .row:has-text("Tomás")');
await page.click('.sheet .btn-row button:has-text("Pagamento")');
ok('o atalho oferece liquidar a dívida certa',
  (await page.textContent('.sheet .btn-row button:has-text("Liquidar")')).includes('8,00'), 'true');
await page.click('.sheet .btn-row button:has-text("Liquidar")');
ok('e preenche o valor', await page.inputValue('#f-valor'), '8.00');
await gravar();
await voltou('Tomás Faria');
ok('o saldo na ficha atualiza-se logo',
  await page.textContent('.sheet .stat .n'), '0,00 €');
await fecha();
await aba('hoje');
ok('o Tomás sai da lista de devedores',
  await page.locator('#v-hoje .row:has-text("Tomás")').count(), 0);
// Entretanto a explicação de grupo pôs a Rita e a Beatriz a descoberto.
ok('ficam as duas que a explicação nova deixou a descoberto',
  await page.locator('#v-hoje .row').count(), 2);

/* --- nota para a próxima explicação --- */
await aba('alunos');
await page.click('#v-alunos .row:has-text("Rita")');
await page.click('.sheet .btn-row button:has-text("Escrever")');
await page.fill('#f-texto', 'Rever as frações impróprias');
await gravar();
await voltou('Rita Silva');
ok('a nota fica em vigor na ficha',
  await page.textContent('.sheet .nota-viva'), 'Rever as frações impróprias');
await fecha();

/* --- arquivar mostra a lista de ficheiros antes de apagar (§191) --- */
await aba('alunos');
await page.click('#v-alunos .row:has-text("Rita")');
await page.click('.sheet .btn-row button:has-text("Arquivar")');
await page.waitForSelector('.sheet .hist li');
ok('avisa que vai apagar 2 ficheiros exclusivos da Rita',
  await page.locator('.sheet .hist li').count(), 2);
ok('e a tabuada, partilhada com o Tomás, não está na lista',
  await page.locator('.sheet .hist li:has-text("Tabuada")').count(), 0);
page.once('dialog', (d) => d.accept());
await page.click('.sheet button:has-text("Arquivar e apagar")');
await page.waitForTimeout(600);
ok('os ficheiros exclusivos saíram do bucket',
  backend.ficheirosNoBucket().sort().join(','), 'x3/tabuada.pdf');
ok('a conta da Rita foi desativada',
  backend.tabelas.perfis.find((p) => p.id === 'p-rita').ativo, 'false');
ok('a da mãe também, por não lhe restar outro educando',
  backend.tabelas.perfis.find((p) => p.id === 'p-mae-rita').ativo, 'false');

/* --- criar conta pela Edge Function --- */
await aba('contas');
await page.click('#v-contas .btn-row button:has-text("Nova conta")');
await page.fill('#f-nome', 'Avó do Tomás');
await page.fill('#f-email', 'avo@exemplo.pt');
const pwGerada = await page.inputValue('#f-pw');
ok('sugere uma palavra-passe com 10+ caracteres', pwGerada.length >= 10, 'true');
await page.click('#f-cc');
await gravar();
await page.waitForSelector('.sheet .credencial');
ok('mostra as credenciais uma vez, para apontar',
  await page.locator('.sheet .credencial').count(), 2);
const nova = backend.tabelas.perfis.find((p) => p.nome === 'Avó do Tomás');
ok('a conta nova só vê a conta corrente', `${nova.ve_conta_corrente}/${nova.ve_materiais}`, 'true/false');

/* ============================================================
   O aluno
   ============================================================ */
await entra('tomas@exemplo.pt');
ok('o aluno não tem barra de separadores',
  await page.locator('nav.tabs').isHidden(), 'true');
ok('vê a nota para a próxima explicação',
  await page.textContent('#v-familia .destaque p'), 'Trazer o caderno de Estudo do Meio');
ok('não vê saldo nenhum', await page.locator('#v-familia .destaque-n').count(), 0);
ok('vê os 2 TPCs', await page.locator('#v-familia .card:has-text("Trabalhos de casa") .hist li').count(), 2);
ok('o TPC confirmado mostra a nota',
  await page.locator('#v-familia .tag:has-text("4/5")').count(), 1);
ok('vê só o material partilhado',
  await page.locator('#v-familia .card:has-text("Materiais") .hist li').count(), 1);
ok('vê o sumário da explicação',
  await page.locator('#v-familia .card:has-text("Explicações") .hist li').count(), 1);
ok('e o sumário não traz valor nenhum',
  (await page.textContent('#v-familia .card:has-text("Explicações") .hist .amt')).includes('€'), 'false');

await page.click('#v-familia button:has-text("Já fiz")');
await page.waitForTimeout(400);
ok('marcar como feito pega', backend.tabelas.tpcs.find((t) => t.id === 't1').estado, 'feito_aluno');
ok('e o TPC confirmado não tem botão nenhum',
  await page.locator('#v-familia .hist li:has-text("Tabuada do 7") button').count(), 0);

/* ============================================================
   O encarregado
   ============================================================ */
await entra('pai.tomas@exemplo.pt');
ok('vê o saldo em destaque', await page.locator('#v-familia .destaque-n').count(), 1);
ok('e está a zero depois do pagamento',
  await page.textContent('#v-familia .destaque-n'), '0,00 €');
ok('vê os 2 movimentos', await page.locator('#v-familia .card:has-text("Movimentos") .hist li').count(), 2);
ok('não vê TPCs', await page.locator('#v-familia .card:has-text("Trabalhos de casa")').count(), 0);
ok('não vê materiais', await page.locator('#v-familia .card:has-text("Materiais")').count(), 0);

/* ============================================================
   A administradora volta: o TPC está à espera de confirmação
   ============================================================ */
await entra('maria@exemplo.pt');
ok('o TPC do Tomás aparece por confirmar',
  await page.locator('#v-hoje .card:has-text("TPCs por confirmar") .hist li').count(), 1);
await page.click('#v-hoje button:has-text("Confirmar")');
await page.selectOption('#f-nota', '5');
await gravar();
await fechou();
ok('fica confirmado com a nota', backend.tabelas.tpcs.find((t) => t.id === 't1').nota, 5);
ok('e sai da lista de espera',
  await page.locator('#v-hoje .card:has-text("TPCs por confirmar") .hist li').count(), 0);

/* ---------------- resultado ---------------- */
console.log(verificacoes.map((v) => v.texto).join('\n'));
const falhas = verificacoes.filter((v) => !v.passa).length;
console.log(`\n${verificacoes.length - falhas} passam · ${falhas} falham`);
if (erros.length) console.log('\nErros de JavaScript:\n' + erros.join('\n'));
await browser.close();
process.exit(falhas || erros.length ? 1 : 0);
