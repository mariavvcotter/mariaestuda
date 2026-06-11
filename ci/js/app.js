// ============================================================
// APP — Plataforma de Estudo v2 · Comunicação Interpessoal
// XP, níveis, streak, conquistas, quiz, flashcards (repetição
// espaçada), preenchimento, cenários, associação, história,
// fofoca e glossário. Tudo guardado em localStorage.
// ============================================================

// ===================== ESTADO =====================
const LS_KEY = 'ciStudyV2';

function freshState() {
  return {
    xp: 0,
    streak: 0,
    lastDay: null,
    ach: [],
    qOk: Array(quizData.length).fill(false),     // perguntas dominadas
    wrongQ: [],                                   // índices das erradas por repetir
    topicStats: {},                               // {tópico:{r,t}}
    fcBox: Array(flashData.length).fill(0),       // caixas de repetição espaçada (0-2)
    fitbDone: Array(fitbData.length).fill(false), // preenchimento certo (sessão atual)
    fitbXp: Array(fitbData.length).fill(false),   // XP já atribuído (para sempre)
    cenOk: Array(scenarioData.length).fill(false),
    chRead: Array(storyChapters.length).fill(false),
    gossipRead: false,
    matchBest: null,
    theme: 'light'
  };
}

let S = freshState();
try {
  const saved = JSON.parse(localStorage.getItem(LS_KEY));
  if (saved) S = Object.assign(freshState(), saved);
} catch (e) { /* estado corrompido → recomeça */ }

function save() { localStorage.setItem(LS_KEY, JSON.stringify(S)); }

// ===================== HELPERS =====================
const $ = id => document.getElementById(id);

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[-–—.,;:!?'"«»()]/g, ' ').replace(/\s+/g, ' ').trim();
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function dstr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function todayStr() { return dstr(new Date()); }

// ===================== NÍVEIS & XP =====================
const LEVELS = [
  { xp: 0,    name: 'Ruído Branco' },
  { xp: 100,  name: 'Emissora Tímida' },
  { xp: 250,  name: 'Recetora Atenta' },
  { xp: 450,  name: 'Escuta Ativa' },
  { xp: 700,  name: 'Voz Assertiva' },
  { xp: 1000, name: 'Empatia Nível Pro' },
  { xp: 1400, name: 'Mestre do Ethos' },
  { xp: 1900, name: 'Lenda da Retórica' },
  { xp: 2500, name: 'Watzlawick Jr.' },
  { xp: 3200, name: 'Oráculo Interpessoal' }
];
function levelIndex(xp) {
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k].xp) i = k;
  return i;
}

function addXP(n) {
  if (n <= 0) return;
  const before = levelIndex(S.xp);
  S.xp += n;
  touchStreak();
  const after = levelIndex(S.xp);
  save();
  renderStats();
  if (after > before) {
    toast('🎉', 'Subiste de nível!', 'Agora és «' + LEVELS[after].name + '»');
    confetti(70);
  }
  if (S.xp >= 500) unlock('xp500');
  if (S.xp >= 1500) unlock('xp1500');
}

function touchStreak() {
  const today = todayStr();
  if (S.lastDay === today) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  S.streak = (S.lastDay === dstr(y)) ? S.streak + 1 : 1;
  S.lastDay = today;
  if (S.streak >= 3) unlock('streak3');
  if (S.streak >= 7) unlock('streak7');
}

// streak quebrada? (carregamento)
(function checkStreakBroken() {
  if (!S.lastDay) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  if (S.lastDay !== todayStr() && S.lastDay !== dstr(y)) { S.streak = 0; save(); }
})();

// ===================== CONQUISTAS =====================
const ACHS = [
  { id: 'first',    icon: '🎯', name: 'Primeiro Passo',        desc: 'Completa a primeira ronda de quiz' },
  { id: 'perfect10',icon: '💯', name: 'Ronda Perfeita',        desc: '10+ certas seguidas numa ronda' },
  { id: 'exam75',   icon: '🎓', name: 'Pronta para o Exame',   desc: '75% ou mais num simulado' },
  { id: 'streak3',  icon: '🔥', name: 'Em Chamas',             desc: 'Estuda 3 dias seguidos' },
  { id: 'streak7',  icon: '⚡', name: 'Imparável',             desc: 'Estuda 7 dias seguidos' },
  { id: 'xp500',    icon: '⭐', name: 'Meio Milhar',           desc: 'Acumula 500 XP' },
  { id: 'xp1500',   icon: '🌟', name: 'Galáctica',             desc: 'Acumula 1500 XP' },
  { id: 'fc25',     icon: '🃏', name: 'Mestre dos Cartões',    desc: 'Domina 25 flashcards' },
  { id: 'story7',   icon: '📖', name: 'Conta-me Histórias',    desc: 'Lê os 7 capítulos do Modo História' },
  { id: 'gossip',   icon: '🫦', name: 'Fofoqueira Académica',  desc: 'Acompanha o drama todo no Modo Fofoca' },
  { id: 'match45',  icon: '🧩', name: 'Velocista',             desc: 'Associação em menos de 45s sem erros' },
  { id: 'cen16',    icon: '🎭', name: 'Aplicação Total',       desc: 'Acerta os 16 cenários de exame' }
];

function unlock(id) {
  if (S.ach.includes(id)) return;
  const a = ACHS.find(x => x.id === id);
  if (!a) return;
  S.ach.push(id);
  save();
  toast('🏆', 'Conquista desbloqueada!', a.icon + ' ' + a.name);
  confetti(40);
  renderStats();
  renderAchGrid();
}

// ===================== TOASTS & CONFETTI =====================
function toast(icon, title, sub) {
  const zone = $('toast-zone');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<div class="toast-icon">' + icon + '</div><div><div class="toast-title">' + esc(title) + '</div><div class="toast-sub">' + esc(sub) + '</div></div>';
  zone.appendChild(t);
  setTimeout(() => { t.classList.add('fade'); setTimeout(() => t.remove(), 450); }, 3200);
}

function confetti(n) {
  const colors = ['#7c6fcd', '#9c8fe8', '#d4a017', '#2d9e75', '#e05c7e', '#e07c3c'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    p.style.animationDelay = (Math.random() * 0.4) + 's';
    p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3800);
  }
}

// ===================== TEMA =====================
function applyTheme() {
  document.documentElement.setAttribute('data-theme', S.theme);
  $('theme-btn').textContent = S.theme === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() {
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  save();
  applyTheme();
}

// ===================== NAVEGAÇÃO =====================
const TAB_OF = {
  home: 'home', quiz: 'quiz', flash: 'flash',
  jogos: 'jogos', fitb: 'jogos', cenarios: 'jogos', match: 'jogos',
  ler: 'ler', story: 'ler', gossip: 'ler', glossario: 'ler'
};

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = $('page-' + id);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === TAB_OF[id]));
  window.scrollTo({ top: 0 });

  if (id === 'home') renderHome();
  if (id === 'jogos' || id === 'ler') renderHubStats();
  if (id === 'quiz') updateErradasChip();
  if (id === 'flash') renderFc();
  if (id === 'fitb') renderFitb();
  if (id === 'story') initStory();
  if (id === 'glossario') renderGloss($('gloss-search').value);
  if (id === 'gossip') {
    renderGossip();
    if (!S.gossipRead) {
      S.gossipRead = true;
      save();
      addXP(20);
      unlock('gossip');
    }
  }
}

// ===================== STATS BAR + DASHBOARD =====================
function renderStats() {
  const li = levelIndex(S.xp);
  $('stat-xp').textContent = S.xp;
  $('stat-level').textContent = 'Nível ' + (li + 1);
  $('stat-streak').textContent = S.streak;
  $('stat-ach').textContent = S.ach.length;

  $('dash-level-name').textContent = LEVELS[li].name;
  $('dash-xp-now').textContent = S.xp + ' XP';
  if (li < LEVELS.length - 1) {
    const next = LEVELS[li + 1];
    $('dash-xp-next').textContent = 'próximo nível: ' + next.xp + ' XP';
    const span = next.xp - LEVELS[li].xp;
    $('dash-xp-bar').style.width = Math.min(100, Math.round((S.xp - LEVELS[li].xp) / span * 100)) + '%';
  } else {
    $('dash-xp-next').textContent = 'nível máximo!';
    $('dash-xp-bar').style.width = '100%';
  }
  $('dash-streak').textContent = S.streak;
  $('dash-flame').textContent = S.streak >= 7 ? '🔥🔥' : '🔥';
  $('dash-flame').style.opacity = S.streak === 0 ? 0.35 : 1;
}

function greeting() {
  const h = new Date().getHours();
  const when = h < 6 ? 'Boa madrugada' : h < 13 ? 'Bom dia' : h < 20 ? 'Boa tarde' : 'Boa noite';
  const lines = [
    when + ', Maria! Pronta para estudar?',
    when + ', Maria! O exame não se passa sozinho 👀',
    when + ', Maria! Hoje é dia de subir de nível.',
    when + ', Maria! A Ana Catarina e o Tiago esperam por ti 🫦'
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

function renderHome() {
  $('dash-greeting').textContent = greeting();
  renderStats();

  // grelha de modos
  const fcMastered = S.fcBox.filter(b => b === 2).length;
  const modes = [
    { icon: '🧠', title: 'Quiz', desc: 'Escolha múltipla com treino, exame e repetição de erradas', page: 'quiz',
      stat: S.qOk.filter(Boolean).length + '/' + quizData.length + ' dominadas', pct: S.qOk.filter(Boolean).length / quizData.length },
    { icon: '🃏', title: 'Flashcards', desc: 'Repetição espaçada de 50 conceitos', page: 'flash',
      stat: fcMastered + '/' + flashData.length + ' dominados', pct: fcMastered / flashData.length },
    { icon: '🎭', title: 'Cenários de Exame', desc: 'Aplica a teoria — o formato da prova escrita', page: 'cenarios',
      stat: S.cenOk.filter(Boolean).length + '/' + scenarioData.length + ' certos', pct: S.cenOk.filter(Boolean).length / scenarioData.length },
    { icon: '✍️', title: 'Preencher Espaços', desc: 'Escreve o termo certo em 25 frases', page: 'fitb',
      stat: S.fitbXp.filter(Boolean).length + '/' + fitbData.length + ' resolvidas', pct: S.fitbXp.filter(Boolean).length / fitbData.length },
    { icon: '🧩', title: 'Associação', desc: 'Liga conceitos a definições contra o relógio', page: 'match',
      stat: S.matchBest ? 'melhor tempo: ' + S.matchBest + 's' : 'ainda não jogado', pct: S.matchBest ? 1 : 0 },
    { icon: '📖', title: 'Modo História', desc: 'A matéria como narrativa em 7 capítulos', page: 'story',
      stat: S.chRead.filter(Boolean).length + '/' + storyChapters.length + ' capítulos', pct: S.chRead.filter(Boolean).length / storyChapters.length },
    { icon: '🫦', title: 'Modo Fofoca', desc: 'O drama da Ana Catarina, com teoria pelo meio', page: 'gossip',
      stat: S.gossipRead ? 'lida ✓' : 'drama por ler', pct: S.gossipRead ? 1 : 0 },
    { icon: '🔎', title: 'Glossário', desc: 'Todos os conceitos, pesquisáveis em segundos', page: 'glossario',
      stat: flashData.length + ' conceitos', pct: 0 }
  ];
  $('home-modes').innerHTML = modes.map(m =>
    '<div class="mode-card" onclick="showPage(\'' + m.page + '\')">' +
    '<div class="mode-icon">' + m.icon + '</div>' +
    '<div class="mode-title">' + m.title + '</div>' +
    '<div class="mode-desc">' + m.desc + '</div>' +
    '<div class="mode-progress"><div class="mode-progress-fill" style="width:' + Math.round(m.pct * 100) + '%"></div></div>' +
    '<div class="mode-stat">' + m.stat + '</div></div>'
  ).join('');

  renderWeakList();
  renderAchGrid();
}

function renderWeakList() {
  const rows = Object.entries(S.topicStats)
    .filter(([, st]) => st.t >= 3)
    .map(([topic, st]) => ({ topic, pct: Math.round(st.r / st.t * 100), t: st.t }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5);
  if (!rows.length) {
    $('weak-list').innerHTML = '<div class="empty-note">Responde a algumas perguntas do quiz e eu descubro os teus pontos fracos 👀</div>';
    return;
  }
  $('weak-list').innerHTML = rows.map(r => {
    const cls = r.pct < 50 ? 'bad' : r.pct < 75 ? 'mid' : 'good';
    return '<div class="weak-row"><span class="weak-topic">' + esc(r.topic) + '</span>' +
      '<span class="weak-pct ' + cls + '">' + r.pct + '% certas</span>' +
      '<button class="weak-btn" onclick="startQuiz(\'treino\',\'' + esc(r.topic) + '\')">Praticar</button></div>';
  }).join('');
}

function renderAchGrid() {
  const grid = $('ach-grid');
  if (!grid) return;
  grid.innerHTML = ACHS.map(a => {
    const got = S.ach.includes(a.id);
    return '<div class="ach-card ' + (got ? 'unlocked' : 'locked') + '">' +
      '<div class="ach-icon">' + a.icon + '</div>' +
      '<div class="ach-name">' + a.name + '</div>' +
      '<div class="ach-desc">' + a.desc + '</div></div>';
  }).join('');
}

function renderHubStats() {
  $('hub-fitb-stat').textContent = S.fitbXp.filter(Boolean).length + '/' + fitbData.length + ' resolvidas';
  $('hub-cen-stat').textContent = S.cenOk.filter(Boolean).length + '/' + scenarioData.length + ' certos';
  $('hub-match-stat').textContent = S.matchBest ? 'melhor tempo: ' + S.matchBest + 's' : 'ainda não jogado';
  $('hub-story-stat').textContent = S.chRead.filter(Boolean).length + '/' + storyChapters.length + ' capítulos lidos';
}

// ===================== TÓPICOS DO QUIZ =====================
const TOPICS = ['Estilos & Assertividade', 'Retórica & Persuasão', 'Escuta & Barreiras',
  'Inteligência Emocional', 'TGIM & Objetivos', 'Troca Social & Símbolos',
  'Não-Verbal & Perceções', 'Contemporâneo & Cultura', 'Fundamentos'];

function topicOf(q) {
  const t = (q.q + ' ' + q.e).toLowerCase();
  if (/assertiv|passiv|agressiv|modelo desc|modelo xyz|estilo de comunica|estilos de comunica/.test(t)) return 'Estilos & Assertividade';
  if (/ethos|logos|pathos|ret[óo]ric|persua|burke|manipula/.test(t)) return 'Retórica & Persuasão';
  if (/escuta|escutar|ouvir|barreira|feedback|ru[íi]do|sil[êe]ncio/.test(t)) return 'Escuta & Barreiras';
  if (/intelig[êe]ncia emocional|goleman|autoconsci|autorregula|empatia|compet[êe]ncias sociais|atribui[çc]|troca afetiva|\bie\b/.test(t)) return 'Inteligência Emocional';
  if (/tgim|objetivos m[úu]ltiplos|incerteza|gest[ãa]o da informa[çc]/.test(t)) return 'TGIM & Objetivos';
  if (/troca social|troca econ[óo]mica|interacionismo|simb[óo]lic|thomas|reciprocidade|equidade|interdepend|interesse pr[óo]prio|maximizar/.test(t)) return 'Troca Social & Símbolos';
  if (/n[ãa]o-verbal|prox[ée]mica|cin[ée]sica|paralinguagem|microexpress|toque|cron[ée]mica|dist[âa]ncia [íi]ntima|perce[çc]|perfil|impress[õo]|johari|disson[âa]ncia/.test(t)) return 'Não-Verbal & Perceções';
  if (/digital|autenticidade|cultura|contexto|contempor[âa]n|tecnol[óo]gic/.test(t)) return 'Contemporâneo & Cultura';
  return 'Fundamentos';
}
const QUIZ_TOPIC = quizData.map(topicOf);

// ===================== QUIZ =====================
let Q = null; // sessão atual

let selMode = 'treino';
let selTopic = 'Todos';

function initQuizSetup() {
  // chips de modo
  $('quiz-mode-row').querySelectorAll('.choice-chip').forEach(ch => {
    ch.addEventListener('click', () => {
      if (ch.disabled) return;
      selMode = ch.dataset.mode;
      $('quiz-mode-row').querySelectorAll('.choice-chip').forEach(c => c.classList.toggle('sel', c === ch));
    });
  });
  // chips de tópico
  const row = $('quiz-topic-row');
  row.innerHTML = '';
  ['Todos'].concat(TOPICS).forEach(tp => {
    const b = document.createElement('button');
    b.className = 'choice-chip' + (tp === 'Todos' ? ' sel' : '');
    b.textContent = tp;
    b.addEventListener('click', () => {
      selTopic = tp;
      row.querySelectorAll('.choice-chip').forEach(c => c.classList.toggle('sel', c === b));
    });
    row.appendChild(b);
  });
  updateErradasChip();
}

function updateErradasChip() {
  const ch = $('chip-erradas');
  ch.textContent = '🔁 Repetir erradas (' + S.wrongQ.length + ')';
  ch.disabled = S.wrongQ.length === 0;
  if (ch.disabled && selMode === 'erradas') {
    selMode = 'treino';
    $('quiz-mode-row').querySelectorAll('.choice-chip').forEach(c => c.classList.toggle('sel', c.dataset.mode === 'treino'));
  }
}

function startQuizFromSetup() { startQuiz(selMode, selTopic); }
function startQuickStudy() { startQuiz('treino', 'Todos', 10); }

function startQuiz(mode, topic, count) {
  showPage('quiz');
  let pool = [];
  if (mode === 'erradas') {
    pool = shuffle(S.wrongQ.slice());
    if (!pool.length) { toast('🎉', 'Sem erradas!', 'Não tens perguntas erradas por repetir.'); return; }
  } else {
    let idxs = quizData.map((_, i) => i);
    if (topic && topic !== 'Todos') idxs = idxs.filter(i => QUIZ_TOPIC[i] === topic);
    if (mode === 'exame') {
      pool = shuffle(idxs).slice(0, 20);
    } else {
      // treino: prioriza erradas e nunca dominadas
      const wrong = shuffle(idxs.filter(i => S.wrongQ.includes(i)));
      const fresh = shuffle(idxs.filter(i => !S.wrongQ.includes(i) && !S.qOk[i]));
      const done = shuffle(idxs.filter(i => !S.wrongQ.includes(i) && S.qOk[i]));
      pool = wrong.concat(fresh, done).slice(0, count || 15);
    }
  }
  Q = {
    mode, topic: topic || 'Todos',
    items: pool.map(qi => ({ qi, perm: shuffle([0, 1, 2, 3]), chosen: null, done: false })),
    pos: 0, right: 0, xp: 0, streak: 0, bestStreak: 0,
    timerInt: null, endTime: null
  };
  $('quiz-setup').style.display = 'none';
  $('quiz-play').style.display = 'block';
  if (mode === 'exame') {
    Q.endTime = Date.now() + 20 * 60 * 1000;
    Q.timerInt = setInterval(tickExam, 500);
  }
  renderQuestion();
}

function tickExam() {
  if (!Q || !Q.endTime) return;
  const left = Math.max(0, Q.endTime - Date.now());
  const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
  $('q-right').innerHTML = '⏱️ <span class="exam-timer' + (left < 60000 ? ' low' : '') + '">' +
    String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '</span>';
  if (left <= 0) { clearInterval(Q.timerInt); endQuiz(true); }
}

function cur() { return Q.items[Q.pos]; }

function renderQuestion() {
  const it = cur();
  const q = quizData[it.qi];
  $('q-label').textContent = 'Pergunta ' + (Q.pos + 1) + ' de ' + Q.items.length;
  if (Q.mode !== 'exame') $('q-right').textContent = '✅ ' + Q.right + ' certas';
  $('q-progress').style.width = Math.round(Q.pos / Q.items.length * 100) + '%';
  $('q-number').textContent = (Q.mode === 'exame' ? 'Exame' : Q.mode === 'erradas' ? 'Repetição' : 'Treino');
  $('q-topic').textContent = QUIZ_TOPIC[it.qi];
  $('q-text').textContent = q.q;
  const opts = $('q-options');
  opts.innerHTML = '';
  it.perm.forEach((origIdx, dispIdx) => {
    const b = document.createElement('button');
    b.className = 'option-btn';
    b.innerHTML = '<span class="option-letter">' + 'ABCD'[dispIdx] + '</span><span>' + esc(q.o[origIdx]) + '</span>';
    b.addEventListener('click', () => pickOption(dispIdx));
    opts.appendChild(b);
  });
  $('q-explanation').className = 'explanation';
  $('q-explanation').textContent = '';
  $('q-next-btn').style.display = 'none';
  $('q-skip-btn').style.display = '';
  $('q-session-streak').textContent = Q.streak >= 2 ? '🔥 ' + Q.streak + ' seguidas' : '';
}

function pickOption(dispIdx) {
  const it = cur();
  if (it.done) return;
  it.done = true;
  it.chosen = it.perm[dispIdx];
  const q = quizData[it.qi];
  const right = it.chosen === q.a;
  const btns = $('q-options').querySelectorAll('.option-btn');
  btns.forEach(b => b.disabled = true);

  if (Q.mode === 'exame') {
    btns[dispIdx].classList.add('picked');
    recordAnswer(it, right, true);
    setTimeout(nextQuestion, 280);
    return;
  }
  // treino / erradas: feedback imediato
  const correctDisp = it.perm.indexOf(q.a);
  btns[correctDisp].classList.add('correct');
  if (!right) btns[dispIdx].classList.add('wrong');
  $('q-explanation').textContent = q.e;
  $('q-explanation').className = 'explanation show';
  recordAnswer(it, right, false);
  $('q-skip-btn').style.display = 'none';
  $('q-next-btn').style.display = '';
  $('q-next-btn').textContent = Q.pos === Q.items.length - 1 ? 'Ver resultado →' : 'Próxima →';
  $('q-session-streak').textContent = Q.streak >= 2 ? '🔥 ' + Q.streak + ' seguidas' : '';
}

function recordAnswer(it, right, isExam) {
  const tp = QUIZ_TOPIC[it.qi];
  if (!S.topicStats[tp]) S.topicStats[tp] = { r: 0, t: 0 };
  S.topicStats[tp].t++;
  if (right) {
    S.topicStats[tp].r++;
    Q.right++;
    Q.streak++;
    Q.bestStreak = Math.max(Q.bestStreak, Q.streak);
    S.qOk[it.qi] = true;
    S.wrongQ = S.wrongQ.filter(i => i !== it.qi);
    const gain = isExam ? 12 : 10;
    Q.xp += gain;
    addXP(gain);
  } else {
    Q.streak = 0;
    if (!S.wrongQ.includes(it.qi)) S.wrongQ.push(it.qi);
    save();
    renderStats();
  }
}

function skipQuestion() {
  if (!Q || cur().done) return;
  // manda a pergunta para o fim da fila
  const it = Q.items.splice(Q.pos, 1)[0];
  Q.items.push(it);
  renderQuestion();
}

function nextQuestion() {
  if (!Q) return;
  if (Q.pos >= Q.items.length - 1) { endQuiz(false); return; }
  Q.pos++;
  renderQuestion();
}

function quitQuiz() {
  if (Q && Q.timerInt) clearInterval(Q.timerInt);
  Q = null;
  $('quiz-play').style.display = 'none';
  $('quiz-setup').style.display = 'block';
  updateErradasChip();
  save();
}

function endQuiz(timeUp) {
  if (Q.timerInt) clearInterval(Q.timerInt);
  // por responder (tempo esgotado) contam como erradas
  Q.items.forEach(it => {
    if (!it.done) {
      it.done = true;
      if (!S.wrongQ.includes(it.qi)) S.wrongQ.push(it.qi);
    }
  });
  save();
  const total = Q.items.length;
  const pct = total ? Q.right / total : 0;
  unlock('first');
  if (Q.bestStreak >= 10) unlock('perfect10');
  if (Q.mode === 'exame' && pct >= 0.75) unlock('exam75');

  const wrongItems = Q.items.filter(it => quizData[it.qi].a !== it.chosen);
  const review = wrongItems.map(it => {
    const q = quizData[it.qi];
    return { q: q.q, chosen: it.chosen === null ? null : q.o[it.chosen], correct: q.o[q.a], e: q.e };
  });
  const emoji = pct >= 0.9 ? '🏆' : pct >= 0.75 ? '🎉' : pct >= 0.5 ? '💪' : '📚';
  const label = Q.mode === 'exame'
    ? (timeUp ? 'Tempo esgotado! ' : '') + 'Simulado de exame'
    : Q.topic !== 'Todos' ? 'Treino · ' + Q.topic : 'Ronda de treino';
  const subs = pct >= 0.9 ? 'Brutal. Estás mais do que pronta para este tópico.'
    : pct >= 0.75 ? 'Muito bom! Repete as erradas e fica perfeito.'
    : pct >= 0.5 ? 'No bom caminho — as erradas já estão guardadas para repetires.'
    : 'Sem stress: vê as explicações em baixo e tenta outra vez.';

  const mode = Q.mode, topic = Q.topic;
  showResults({
    emoji,
    score: Q.right + '/' + total,
    label, xp: Q.xp, sub: subs, review,
    actions: [
      { label: '↺ Outra ronda', primary: true, fn: () => { closeResults(); startQuiz(mode, topic); } },
      review.length ? { label: '🔁 Repetir erradas', fn: () => { closeResults(); startQuiz('erradas', 'Todos'); } } : null,
      { label: 'Fechar', fn: () => { closeResults(); quitQuiz(); } }
    ].filter(Boolean)
  });
  if (pct >= 0.8) confetti(80);
  Q = null;
  $('quiz-play').style.display = 'none';
  $('quiz-setup').style.display = 'block';
  updateErradasChip();
}

// ===================== MODAL DE RESULTADOS =====================
function showResults(o) {
  $('res-emoji').textContent = o.emoji;
  $('res-score').textContent = o.score;
  $('res-label').textContent = o.label;
  $('res-xp').textContent = '+' + o.xp + ' XP';
  $('res-sub').textContent = o.sub;
  const rv = $('res-review');
  rv.innerHTML = '';
  if (o.review && o.review.length) {
    rv.innerHTML = '<div style="font-size:12px;font-weight:700;color:var(--ink-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">Para rever</div>' +
      o.review.map(r =>
        '<div class="review-item"><div class="rq">' + esc(r.q) + '</div>' +
        '<div class="ra-wrong">✗ ' + (r.chosen ? 'Respondeste: ' + esc(r.chosen) : 'Não respondeste') + '</div>' +
        '<div class="ra-right">✓ Correta: ' + esc(r.correct) + '</div>' +
        '<div class="re">' + esc(r.e) + '</div></div>'
      ).join('');
  }
  const acts = $('res-actions');
  acts.innerHTML = '';
  o.actions.forEach(a => {
    const b = document.createElement('button');
    b.className = a.primary ? 'btn' : 'btn-ghost';
    b.textContent = a.label;
    b.addEventListener('click', a.fn);
    acts.appendChild(b);
  });
  $('results-overlay').classList.add('show');
}
function closeResults() { $('results-overlay').classList.remove('show'); }

// ===================== FLASHCARDS =====================
let fcList = flashData.map((_, i) => i);
let fcPos = 0;
let fcFilter = 'todas';
const BOX_LABEL = ['a aprender', 'quase lá', 'dominado'];

function buildFcList() {
  fcList = flashData.map((_, i) => i).filter(i => fcFilter === 'todas' || S.fcBox[i] < 2);
  if (fcFilter === 'dificeis') fcList = flashData.map((_, i) => i).filter(i => S.fcBox[i] === 0);
  fcPos = 0;
}

function setFcFilter(f) {
  fcFilter = f;
  document.querySelectorAll('[data-fcfilter]').forEach(c => c.classList.toggle('sel', c.dataset.fcfilter === f));
  buildFcList();
  renderFc();
}

function shuffleFc() {
  fcList = shuffle(fcList);
  fcPos = 0;
  renderFc();
}

function renderFc() {
  const inner = $('fc-inner');
  inner.classList.remove('flipped');
  if (!fcList.length) {
    $('fc-term').textContent = 'Nada por aqui 🎉';
    $('fc-def').textContent = 'Dominaste todos os cartões deste filtro!';
    $('fc-box-tag').textContent = '';
    $('fc-label').textContent = '';
    $('fc-counter').textContent = '0/0';
    $('fc-progress').style.width = '0%';
    $('fc-score').textContent = '';
    return;
  }
  const i = fcList[fcPos];
  const card = flashData[i];
  $('fc-term').textContent = card.t;
  $('fc-def').textContent = card.d;
  const tag = $('fc-box-tag');
  tag.textContent = BOX_LABEL[S.fcBox[i]];
  tag.className = 'box-tag box-' + S.fcBox[i];
  $('fc-label').textContent = 'Cartão ' + (fcPos + 1) + ' de ' + fcList.length;
  $('fc-score').textContent = '🟢 ' + S.fcBox.filter(b => b === 2).length + ' dominados';
  $('fc-progress').style.width = Math.round((fcPos + 1) / fcList.length * 100) + '%';
  $('fc-counter').textContent = (fcPos + 1) + '/' + fcList.length;
}

function flipCard() {
  if (!fcList.length) return;
  $('fc-inner').classList.toggle('flipped');
}

function fcNav(dir) {
  if (!fcList.length) return;
  fcPos = (fcPos + dir + fcList.length) % fcList.length;
  renderFc();
}

function fcVote(knew) {
  if (!fcList.length) return;
  const i = fcList[fcPos];
  if (knew) {
    if (S.fcBox[i] < 2) {
      S.fcBox[i]++;
      addXP(5);
    }
  } else {
    S.fcBox[i] = 0;
  }
  save();
  if (S.fcBox.filter(b => b === 2).length >= 25) unlock('fc25');
  // no filtro "difíceis", remover da lista quando sai da caixa 0
  if (fcFilter === 'dificeis' && S.fcBox[i] > 0) {
    fcList.splice(fcPos, 1);
    if (fcPos >= fcList.length) fcPos = 0;
    renderFc();
    return;
  }
  fcNav(1);
}

// ===================== PREENCHER ESPAÇOS =====================
let fitbBuilt = false;

function renderFitb() {
  if (fitbBuilt) return;
  fitbBuilt = true;
  const box = $('fitb-container');
  box.innerHTML = fitbData.map((f, i) => {
    const parts = f.s.split(/___(?: ___)?/);
    const sentence = esc(parts[0]) +
      '<input class="blank-input" id="fitb-in-' + i + '" data-i="' + i + '" autocomplete="off" spellcheck="false">' +
      esc(parts.slice(1).join(''));
    return '<div class="fitb-card"><div class="fitb-sentence"><strong>' + (i + 1) + '.</strong> ' + sentence + '</div>' +
      '<div class="fitb-feedback" id="fitb-fb-' + i + '"></div></div>';
  }).join('');
  box.querySelectorAll('.blank-input').forEach(inp => {
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkFitb(+inp.dataset.i); });
    inp.addEventListener('input', () => {
      inp.classList.remove('wrong-answer');
      $('fitb-fb-' + inp.dataset.i).className = 'fitb-feedback';
    });
  });
  // pré-preenche as já resolvidas nesta sessão guardada
  fitbData.forEach((f, i) => { if (S.fitbDone[i]) markFitbCorrect(i, true); });
}

function markFitbCorrect(i, silent) {
  const inp = $('fitb-in-' + i);
  inp.value = fitbData[i].a;
  inp.disabled = true;
  inp.classList.remove('wrong-answer');
  inp.classList.add('correct-answer');
  const fb = $('fitb-fb-' + i);
  fb.textContent = '✓ Correto! «' + fitbData[i].a + '»';
  fb.className = 'fitb-feedback show ok';
  if (!silent) {
    S.fitbDone[i] = true;
    if (!S.fitbXp[i]) { S.fitbXp[i] = true; addXP(8); }
    save();
  }
}

function checkFitb(i) {
  const inp = $('fitb-in-' + i);
  if (inp.disabled) return true;
  const val = norm(inp.value);
  if (!val) return null;
  const f = fitbData[i];
  const ok = [f.a].concat(f.alt || []).some(a => norm(a) === val);
  if (ok) {
    markFitbCorrect(i, false);
    return true;
  }
  inp.classList.add('wrong-answer');
  const fb = $('fitb-fb-' + i);
  fb.textContent = '✗ Ainda não. A resposta certa é «' + f.a + '» — tenta fixá-la e continua.';
  fb.className = 'fitb-feedback show err';
  return false;
}

function checkAllFitb() {
  let right = 0, answered = 0;
  fitbData.forEach((_, i) => {
    const r = checkFitb(i);
    if (r !== null) { answered++; if (r) right++; }
  });
  if (!answered) { toast('✍️', 'Nada para corrigir', 'Preenche pelo menos uma frase primeiro.'); return; }
  toast(right === answered ? '🎉' : '📚', right + ' de ' + answered + ' certas', right === answered ? 'Perfeito!' : 'As erradas mostram a resposta certa.');
  renderHubStats();
}

function resetFitb() {
  S.fitbDone = Array(fitbData.length).fill(false);
  save();
  fitbBuilt = false;
  renderFitb();
}

// ===================== CENÁRIOS =====================
let C = null;

function startCen() {
  C = { order: shuffle(scenarioData.map((_, i) => i)), pos: 0, right: 0, xp: 0 };
  $('cen-setup').style.display = 'none';
  $('cen-play').style.display = 'block';
  renderCen();
}

function renderCen() {
  const ci = C.order[C.pos];
  const sc = scenarioData[ci];
  $('cen-label').textContent = 'Cenário ' + (C.pos + 1) + ' de ' + C.order.length;
  $('cen-right').textContent = '✅ ' + C.right + ' certos';
  $('cen-progress').style.width = Math.round(C.pos / C.order.length * 100) + '%';
  $('cen-number').textContent = 'Aplicação de conceitos';
  $('cen-sc').textContent = sc.sc;
  $('cen-q').textContent = sc.q;
  const perm = shuffle([0, 1, 2, 3]);
  C.perm = perm;
  const opts = $('cen-options');
  opts.innerHTML = '';
  perm.forEach((origIdx, dispIdx) => {
    const b = document.createElement('button');
    b.className = 'option-btn';
    b.innerHTML = '<span class="option-letter">' + 'ABCD'[dispIdx] + '</span><span>' + esc(sc.o[origIdx]) + '</span>';
    b.addEventListener('click', () => pickCen(dispIdx));
    opts.appendChild(b);
  });
  $('cen-explanation').className = 'explanation';
  $('cen-next-btn').style.display = 'none';
}

function pickCen(dispIdx) {
  const ci = C.order[C.pos];
  const sc = scenarioData[ci];
  const btns = $('cen-options').querySelectorAll('.option-btn');
  if (btns[0].disabled) return;
  btns.forEach(b => b.disabled = true);
  const chosen = C.perm[dispIdx];
  const right = chosen === sc.a;
  btns[C.perm.indexOf(sc.a)].classList.add('correct');
  if (!right) btns[dispIdx].classList.add('wrong');
  $('cen-explanation').textContent = sc.e;
  $('cen-explanation').className = 'explanation show';
  if (right) {
    C.right++;
    const gain = S.cenOk[ci] ? 5 : 15;
    S.cenOk[ci] = true;
    C.xp += gain;
    addXP(gain);
    if (S.cenOk.every(Boolean)) unlock('cen16');
  }
  save();
  $('cen-right').textContent = '✅ ' + C.right + ' certos';
  $('cen-next-btn').style.display = '';
  $('cen-next-btn').textContent = C.pos === C.order.length - 1 ? 'Ver resultado →' : 'Próximo →';
}

function nextCen() {
  if (C.pos >= C.order.length - 1) { endCen(); return; }
  C.pos++;
  renderCen();
}

function quitCen() {
  C = null;
  $('cen-play').style.display = 'none';
  $('cen-setup').style.display = 'block';
}

function endCen() {
  const total = C.order.length;
  const pct = C.right / total;
  const emoji = pct >= 0.9 ? '🏆' : pct >= 0.75 ? '🎭' : '📚';
  showResults({
    emoji,
    score: C.right + '/' + total,
    label: 'Cenários de exame',
    xp: C.xp,
    sub: pct >= 0.75 ? 'É exatamente este o formato da prova escrita — e tu já o dominas.' : 'Este é o formato da prova escrita: vale a pena repetir até sair natural.',
    review: [],
    actions: [
      { label: '↺ Outra ronda', primary: true, fn: () => { closeResults(); startCen(); } },
      { label: 'Fechar', fn: () => { closeResults(); quitCen(); } }
    ]
  });
  if (pct >= 0.8) confetti(80);
  C = null;
  $('cen-play').style.display = 'none';
  $('cen-setup').style.display = 'block';
}

// ===================== JOGO DE ASSOCIAÇÃO =====================
let M = null;

function startMatch() {
  const picks = shuffle(flashData.map((_, i) => i)).slice(0, 6);
  M = { pairs: picks, found: 0, errors: 0, sel: null, t0: Date.now(), int: null };
  $('match-setup').style.display = 'none';
  $('match-done').style.display = 'none';
  $('match-play').style.display = 'block';
  $('match-found').textContent = '0';
  $('match-errors').textContent = '0';
  $('match-time').textContent = '0s';
  M.int = setInterval(() => {
    $('match-time').textContent = Math.floor((Date.now() - M.t0) / 1000) + 's';
  }, 500);

  const terms = $('match-terms');
  const defs = $('match-defs');
  terms.innerHTML = '';
  defs.innerHTML = '';
  shuffle(picks).forEach(i => {
    const b = document.createElement('button');
    b.className = 'match-item';
    b.dataset.pair = i;
    b.innerHTML = '<span class="term">' + esc(flashData[i].t) + '</span>';
    b.addEventListener('click', () => pickTerm(b));
    terms.appendChild(b);
  });
  shuffle(picks).forEach(i => {
    const d = flashData[i].d;
    const b = document.createElement('button');
    b.className = 'match-item';
    b.dataset.pair = i;
    b.textContent = d.length > 140 ? d.slice(0, 137) + '…' : d;
    b.addEventListener('click', () => pickDef(b));
    defs.appendChild(b);
  });
}

function pickTerm(b) {
  if (b.classList.contains('ok')) return;
  $('match-terms').querySelectorAll('.match-item').forEach(x => x.classList.remove('sel'));
  b.classList.add('sel');
  M.sel = b;
}

function pickDef(b) {
  if (!M || !M.sel || b.classList.contains('ok')) return;
  if (b.dataset.pair === M.sel.dataset.pair) {
    b.classList.add('ok');
    M.sel.classList.add('ok');
    M.sel.classList.remove('sel');
    M.sel = null;
    M.found++;
    $('match-found').textContent = M.found;
    if (M.found === 6) endMatch();
  } else {
    M.errors++;
    $('match-errors').textContent = M.errors;
    b.classList.add('bad');
    setTimeout(() => b.classList.remove('bad'), 380);
  }
}

function endMatch() {
  clearInterval(M.int);
  const secs = Math.round((Date.now() - M.t0) / 1000);
  const noErrors = M.errors === 0;
  const xp = 30 + (noErrors ? 15 : 0);
  addXP(xp);
  if (noErrors && secs < 45) unlock('match45');
  const isBest = !S.matchBest || secs < S.matchBest;
  if (isBest) { S.matchBest = secs; save(); }
  $('match-play').style.display = 'none';
  const done = $('match-done');
  done.style.display = 'block';
  done.innerHTML =
    '<div class="big">' + (noErrors ? '🏆' : '🧩') + '</div>' +
    '<div style="font-family:\'Playfair Display\',serif;font-size:26px;margin-bottom:8px">' + secs + ' segundos</div>' +
    '<div style="font-size:13px;color:var(--ink-muted);margin-bottom:6px">' + M.errors + ' erros' + (noErrors ? ' — ronda perfeita!' : '') + (isBest ? ' · 🥇 novo recorde!' : S.matchBest ? ' · recorde: ' + S.matchBest + 's' : '') + '</div>' +
    '<div class="results-xp">+' + xp + ' XP</div>' +
    '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap">' +
    '<button class="btn" onclick="startMatch()">↺ Jogar outra vez</button>' +
    '<button class="btn-ghost" onclick="showPage(\'jogos\')">Voltar aos jogos</button></div>';
  if (noErrors) confetti(60);
  M = null;
}

// ===================== MODO HISTÓRIA =====================
let storyBuilt = false;

function initStory() {
  if (!storyBuilt) {
    storyBuilt = true;
    const nav = $('ch-nav');
    nav.innerHTML = '';
    storyChapters.forEach((ch, i) => {
      const b = document.createElement('button');
      b.className = 'ch-btn';
      b.id = 'ch-btn-' + i;
      b.textContent = ch.num.replace('Capítulo ', '');
      b.addEventListener('click', () => openChapter(i));
      nav.appendChild(b);
    });
    const first = S.chRead.findIndex(r => !r);
    openChapter(first === -1 ? 0 : first);
  }
}

function openChapter(i) {
  storyChapters.forEach((_, k) => {
    const b = $('ch-btn-' + k);
    b.classList.toggle('active', k === i);
    b.classList.toggle('read', S.chRead[k]);
  });
  const ch = storyChapters[i];
  const last = i === storyChapters.length - 1;
  $('story-content').innerHTML =
    '<div class="story-chapter active"><div class="chapter-header">' +
    '<div class="ch-number">' + esc(ch.num) + '</div>' +
    '<div class="ch-title">' + esc(ch.title) + '</div></div>' +
    '<div class="story-body">' + ch.body + '</div>' +
    '<div class="story-next">' +
    (last ? '<button class="btn" onclick="showPage(\'ler\')">Terminar ✓</button>'
          : '<button class="btn" onclick="openChapter(' + (i + 1) + ')">' + storyChapters[i + 1].num + ' →</button>') +
    '</div></div>';
  window.scrollTo({ top: 0 });
  if (!S.chRead[i]) {
    S.chRead[i] = true;
    save();
    addXP(20);
    $('ch-btn-' + i).classList.add('read');
    if (S.chRead.every(Boolean)) unlock('story7');
  }
}

// ===================== MODO FOFOCA =====================
let gossipBuilt = false;
const GOSSIP_NAMES = { rita: 'Rita', mariana: 'Mariana', beatriz: 'Beatriz', sofia: 'Sofia', prof_skip: 'Prof. Manuel' };

function renderGossip() {
  if (gossipBuilt) return;
  gossipBuilt = true;
  let body = '';
  let prevWho = null;
  gossipNarrative.forEach(m => {
    if (m.type === 'date') {
      body += '<div class="chat-date-divider">' + esc(m.text) + '</div>';
      prevWho = null;
      return;
    }
    if (m.type === 'prof') {
      body += '<div class="chat-msg-row"><div class="chat-av av-prof">PM</div><div class="chat-bubble-col">' +
        (prevWho !== 'prof' ? '<div class="chat-name">Prof. Manuel 📋</div>' : '') +
        '<div class="bubble bubble-prof">' + m.text + '<span class="ts">' + esc(m.ts) + '</span></div></div></div>';
      prevWho = 'prof';
      return;
    }
    const who = m.who;
    const isProf = who === 'prof_skip';
    const avCls = isProf ? 'av-prof' : 'av-' + who;
    const avTxt = isProf ? 'PM' : GOSSIP_NAMES[who][0];
    body += '<div class="chat-msg-row"><div class="chat-av ' + avCls + '">' + avTxt + '</div><div class="chat-bubble-col">' +
      (prevWho !== who ? '<div class="chat-name ' + (isProf ? '' : who) + '">' + GOSSIP_NAMES[who] + (isProf ? ' 📋' : '') + '</div>' : '') +
      '<div class="bubble bubble-girl">' + esc(m.text) + '<span class="ts delivered">' + esc(m.ts) + '</span></div></div></div>';
    prevWho = who;
  });
  $('gossip-container').innerHTML =
    '<div class="chat-window">' +
    '<div class="chat-header"><div class="chat-header-avatar">🔥</div>' +
    '<div class="chat-header-info"><div class="chat-header-name">Top Gossip Gang 🔥</div>' +
    '<div class="chat-header-members">Rita, Mariana, Beatriz, Sofia, Prof. Manuel</div></div>' +
    '<div class="chat-header-dots">⋯</div></div>' +
    '<div class="chat-body">' + body + '</div>' +
    '<div class="chat-input-bar"><div class="chat-input-fake">Mensagem</div><div class="chat-mic">🎤</div></div>' +
    '</div>';
}

// ===================== GLOSSÁRIO =====================
function renderGloss(query) {
  const q = norm(query);
  const list = $('gloss-list');
  const items = flashData
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => !q || norm(f.t).includes(q) || norm(f.d).includes(q))
    .sort((a, b) => a.f.t.localeCompare(b.f.t, 'pt'));
  $('gloss-count').textContent = items.length + ' de ' + flashData.length + ' conceitos';
  function hl(text) {
    if (!q) return esc(text);
    // realça a parte que corresponde (sem acentos)
    const plain = norm(text);
    const idx = plain.indexOf(q);
    if (idx === -1) return esc(text);
    // mapeia índice normalizado de volta ao texto original (aproximação por palavras)
    const re = new RegExp('(' + query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i');
    if (re.test(text)) return esc(text).replace(new RegExp('(' + esc(query.trim()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i'), '<mark>$1</mark>');
    return esc(text);
  }
  list.innerHTML = items.map(({ f }) =>
    '<div class="gloss-item"><div class="gloss-term">' + hl(f.t) + '</div><div class="gloss-def">' + hl(f.d) + '</div></div>'
  ).join('') || '<div class="empty-note">Nenhum conceito encontrado para «' + esc(query) + '». Tenta outro termo.</div>';
}

// ===================== ATALHOS DE TECLADO =====================
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea')) return;
  if (!$('page-flash').classList.contains('active')) return;
  if (e.key === ' ') { e.preventDefault(); flipCard(); }
  else if (e.key === 'ArrowLeft') fcNav(-1);
  else if (e.key === 'ArrowRight') fcNav(1);
  else if (e.key === '1') fcVote(false);
  else if (e.key === '2') fcVote(true);
});

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  initQuizSetup();
  buildFcList();
  renderStats();
  renderHome();
  $('gloss-search').addEventListener('input', e => renderGloss(e.target.value));
});
