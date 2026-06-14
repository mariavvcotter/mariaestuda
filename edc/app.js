/* ============================================================
   EDC — Ética e Deontologia da Comunicação
   app.js — lógica, navegação e gamificação
   ============================================================ */

// ---- atribuir id estável a cada pergunta ----
QUIZ.forEach((q, i) => { q.id = i; });

const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ============================================================
   ESTADO / PERSISTÊNCIA
   ============================================================ */
const STORE_KEY = 'edc_progress_v1';
const THEME_KEY = 'edc_theme';
const BLOCK = 8 * 3600 * 1000; // ofensiva de 8 em 8 horas

/* ============================================================
   CONTAS / SINCRONIZAÇÃO
   A autenticação (Nome + PIN) e a sincronização com o Supabase
   são tratadas pelo módulo partilhado /account/account.js.
   Aqui o progresso é apenas guardado em localStorage sob a chave
   STORE_KEY; o módulo deteta as gravações e sincroniza-as.
   ============================================================ */

const defaultState = () => ({
  xp: 0,
  answered: 0,
  correct: 0,
  themeStats: {},          // {tema:{c,t}}
  wrong: [],               // ids de perguntas por acertar
  flashKnown: [],          // índices de flashcards "sabia"
  flashWrong: [],          // índices de flashcards "não sabia"
  tfCorrect: 0,
  examBest: 0,
  visited: [],
  perfectQuiz: false,
  achievements: [],
  streak: 0,
  bestStreak: 0,
  lastStudy: null,
});

/* ---- recuperação de progresso de versões anteriores ----
   Versões antigas guardavam o progresso por-utilizador
   (edc_progress_v1__<nome>) ou como convidado (edc_progress_v1__guest).
   Se a chave atual estiver vazia, adota a mais "rica" deste browser. */
(function recoverLegacyProgress() {
  function richness(s) {
    try { var o = JSON.parse(s); return (o.xp || 0) + (o.answered || 0) + ((o.visited || []).length) + ((o.achievements || []).length); }
    catch (e) { return -1; }
  }
  if (richness(localStorage.getItem(STORE_KEY)) > 0) return; // já há dados na chave atual
  var best = null, bestScore = 0;
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.indexOf(STORE_KEY + '__') === 0) {
      var sc = richness(localStorage.getItem(k));
      if (sc > bestScore) { bestScore = sc; best = localStorage.getItem(k); }
    }
  }
  if (best && bestScore > 0) { try { localStorage.setItem(STORE_KEY, best); } catch (e) {} }
})();

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { return defaultState(); }
}
function save() {
  // O módulo /account/ deteta esta gravação e sincroniza para o Supabase.
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}

/* ---- ofensiva (streak) de 8h ---- */
function registerStudy() {
  const now = Date.now();
  if (state.lastStudy) {
    const lastBlock = Math.floor(state.lastStudy / BLOCK);
    const curBlock = Math.floor(now / BLOCK);
    if (curBlock === lastBlock) { /* mesmo bloco — sem alteração */ }
    else if (curBlock === lastBlock + 1) { state.streak++; }
    else { state.streak = 1; }
  } else {
    state.streak = 1;
  }
  state.lastStudy = now;
  if (state.streak > state.bestStreak) state.bestStreak = state.streak;
}
function effectiveStreak() {
  if (!state.lastStudy) return 0;
  const gap = Math.floor(Date.now() / BLOCK) - Math.floor(state.lastStudy / BLOCK);
  return gap <= 1 ? state.streak : 0;
}
function streakDeadlineText() {
  if (!state.lastStudy || effectiveStreak() === 0) return 'Estuda agora para começar uma ofensiva';
  const lastBlock = Math.floor(state.lastStudy / BLOCK);
  const deadline = (lastBlock + 2) * BLOCK; // fim do bloco seguinte
  const ms = deadline - Date.now();
  if (ms <= 0) return 'Ofensiva a terminar — estuda já!';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `Volta dentro de ${h}h${String(m).padStart(2,'0')} para manter a ofensiva`;
}

/* ---- XP / níveis ---- */
const levelFromXP = xp => Math.floor(xp / 100) + 1;
function addXP(n) {
  const before = levelFromXP(state.xp);
  state.xp += n;
  const after = levelFromXP(state.xp);
  if (after > before) {
    showToast('🚀', 'Subiste de nível!', `Nível ${after}`);
    burstConfetti();
  }
}

/* ---- registar resposta de pergunta ---- */
function registerAnswer(tema, isCorrect, qid) {
  state.answered++;
  if (isCorrect) { state.correct++; addXP(10); }
  const ts = state.themeStats[tema] || (state.themeStats[tema] = { c: 0, t: 0 });
  ts.t++; if (isCorrect) ts.c++;
  if (qid != null) {
    if (isCorrect) state.wrong = state.wrong.filter(x => x !== qid);
    else if (!state.wrong.includes(qid)) state.wrong.push(qid);
  }
  registerStudy();
  checkAchievements();
  save();
  updateHeroStats();
}

/* ============================================================
   CONQUISTAS
   ============================================================ */
function bestThemeDomain() {
  let best = 0;
  Object.values(state.themeStats).forEach(t => {
    if (t.t >= 8) best = Math.max(best, t.c / t.t);
  });
  return best;
}
function checkAchievements() {
  const cond = {
    first_step: state.answered >= 1,
    ten_correct: state.correct >= 10,
    fifty_correct: state.correct >= 50,
    hundred_correct: state.correct >= 100,
    perfect_quiz: state.perfectQuiz,
    exam_pass: state.examBest >= 50,
    exam_ace: state.examBest >= 90,
    streak_3: state.bestStreak >= 3,
    streak_7: state.bestStreak >= 7,
    level_5: levelFromXP(state.xp) >= 5,
    level_10: levelFromXP(state.xp) >= 10,
    flash_master: state.flashKnown.length >= 30,
    theme_master: bestThemeDomain() >= 0.8,
    all_themes: Object.keys(THEMES).every(t => state.themeStats[t] && state.themeStats[t].t > 0),
    truefalse_10: state.tfCorrect >= 10,
    explorer: ['inicio','painel','resumos','mapas','historia','casos','quiz','exame','exercicios','flashcards','glossario'].every(s => state.visited.includes(s)),
  };
  ACHIEVEMENTS.forEach(a => {
    if (cond[a.id] && !state.achievements.includes(a.id)) {
      state.achievements.push(a.id);
      showToast(a.icon, 'Conquista desbloqueada', a.name);
      burstConfetti();
    }
  });
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */
function showSection(id) {
  $$('.section').forEach(s => s.classList.remove('active'));
  $$('.nav-link').forEach(l => l.classList.remove('active'));
  const sec = document.getElementById(id);
  if (!sec) return;
  sec.classList.add('active');
  $(`.nav-link[data-section="${id}"]`)?.classList.add('active');
  window.scrollTo(0, 0);
  if (!state.visited.includes(id)) { state.visited.push(id); checkAchievements(); save(); }
  if (id === 'painel') renderPanel();
  if (id === 'inicio') updateHeroStats();
}

$$('.nav-link').forEach(l => l.addEventListener('click', e => { e.preventDefault(); showSection(l.dataset.section); }));
$$('.mobile-menu a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); closeMenu(); showSection(a.dataset.section); }));
$$('.hero-card').forEach(c => c.addEventListener('click', () => showSection(c.dataset.go)));

/* ---- menu mobile ---- */
function closeMenu() {
  $('#hamburger').classList.remove('open');
  $('#mobile-menu').classList.remove('open');
  document.body.style.overflow = '';
}
$('#hamburger').addEventListener('click', () => {
  const open = $('#mobile-menu').classList.toggle('open');
  $('#hamburger').classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

/* ============================================================
   MODO ESCURO
   ============================================================ */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  $('#theme-btn').textContent = t === 'dark' ? '☀' : '☾';
}
applyTheme(localStorage.getItem(THEME_KEY) || 'light');
$('#theme-btn').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, cur);
  applyTheme(cur);
});

/* ============================================================
   ABAS (história / exercícios)
   ============================================================ */
$$('.story-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.story-tab').forEach(t => t.classList.remove('active'));
  $$('.story-content').forEach(c => c.classList.remove('active'));
  tab.classList.add('active');
  $('#tab-' + tab.dataset.tab).classList.add('active');
}));
$$('.blog-post-chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.blog-post-chip').forEach(c => c.classList.remove('active'));
  $$('.blog-post').forEach(p => p.classList.remove('active'));
  chip.classList.add('active');
  $('#post-' + chip.dataset.post).classList.add('active');
}));
$$('.inner-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.inner-tab').forEach(t => t.classList.remove('active'));
  $$('.inner-tab-content').forEach(c => c.style.display = 'none');
  tab.classList.add('active');
  $('#inner-' + tab.dataset.innerTab).style.display = 'block';
}));

/* ---- casos (acordeão) ---- */
$$('.case-header').forEach(h => h.addEventListener('click', () => {
  const body = h.nextElementSibling;
  body.classList.toggle('open');
  h.querySelector('.case-toggle').textContent = body.classList.contains('open') ? '−' : '+';
}));

/* ============================================================
   QUIZ
   ============================================================ */
let quizMode = 'normal';   // normal | errors
let quizFilter = 'all';
let quizList = [];
let qIndex = 0, qCorrect = 0, qWrong = 0, qAnswered = false;

function buildQuizFilters() {
  const wrap = $('#quiz-filters');
  let html = `<div class="quiz-filter active" data-filter="all">Todos</div>`;
  Object.entries(THEMES).forEach(([k, v]) => {
    html += `<div class="quiz-filter" data-filter="${k}">${v.label}</div>`;
  });
  wrap.innerHTML = html;
  $$('#quiz-filters .quiz-filter').forEach(f => f.addEventListener('click', () => {
    $$('#quiz-filters .quiz-filter').forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    quizFilter = f.dataset.filter;
    startQuiz();
  }));
}

$$('#quiz-mode-bar .quiz-filter').forEach(m => m.addEventListener('click', () => {
  $$('#quiz-mode-bar .quiz-filter').forEach(x => x.classList.remove('active'));
  m.classList.add('active');
  quizMode = m.dataset.mode;
  $('#quiz-filters').style.display = quizMode === 'errors' ? 'none' : 'flex';
  startQuiz();
}));

function startQuiz() {
  if (quizMode === 'errors') {
    quizList = shuffle(state.wrong.map(id => QUIZ[id]).filter(Boolean));
  } else {
    quizList = quizFilter === 'all' ? [...QUIZ] : QUIZ.filter(q => q.tema === quizFilter);
    quizList = shuffle(quizList);
  }
  qIndex = 0; qCorrect = 0; qWrong = 0;
  $('#quiz-score').style.display = 'none';
  $('#quiz-main').style.display = 'block';
  if (quizList.length === 0) {
    $('#quiz-counter').textContent = '';
    $('#quiz-streak').textContent = '';
    $('#quiz-progress-bar').style.width = '0%';
    $('#quiz-question').textContent = quizMode === 'errors'
      ? 'Ainda não tens perguntas por acertar — bom trabalho! 🎉'
      : 'Sem perguntas neste filtro.';
    $('#quiz-options').innerHTML = '';
    $('#quiz-explanation').classList.remove('show');
    $('#quiz-next').style.display = 'none';
    return;
  }
  renderQuestion();
}

function renderQuestion() {
  if (qIndex >= quizList.length) return endQuiz();
  qAnswered = false;
  const q = quizList[qIndex];
  const total = quizList.length;
  $('#quiz-counter').textContent = `Pergunta ${qIndex + 1} de ${total} · ${THEMES[q.tema].label}`;
  $('#quiz-streak').textContent = `🔥 ${effectiveStreak()}`;
  $('#quiz-progress-bar').style.width = ((qIndex / total) * 100) + '%';
  $('#quiz-question').textContent = q.q;
  $('#quiz-explanation').classList.remove('show');
  $('#quiz-next').style.display = 'none';
  const optsEl = $('#quiz-options');
  const letters = ['A', 'B', 'C', 'D'];
  optsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${esc(opt)}</span>`;
    btn.onclick = () => selectAnswer(i);
    optsEl.appendChild(btn);
  });
}

function selectAnswer(sel) {
  if (qAnswered) return;
  qAnswered = true;
  const q = quizList[qIndex];
  $$('#quiz-options .quiz-option').forEach((btn, i) => {
    btn.classList.add('locked');
    if (i === q.correct) btn.classList.add('correct');
    else if (i === sel) btn.classList.add('wrong');
  });
  const isCorrect = sel === q.correct;
  if (isCorrect) qCorrect++; else qWrong++;
  registerAnswer(q.tema, isCorrect, q.id);
  $('#quiz-streak').textContent = `🔥 ${effectiveStreak()}`;
  $('#quiz-explanation').textContent = q.exp;
  $('#quiz-explanation').classList.add('show');
  $('#quiz-next').style.display = 'inline-block';
}

function endQuiz() {
  const total = qCorrect + qWrong;
  const pct = total ? Math.round((qCorrect / total) * 100) : 0;
  if (total >= 5 && pct === 100) { state.perfectQuiz = true; checkAchievements(); save(); burstConfetti(); }
  $('#quiz-main').style.display = 'none';
  $('#quiz-score').style.display = 'block';
  $('#score-display').textContent = pct + '%';
  $('#score-label').textContent = pct === 100 ? 'Perfeito!' : pct >= 50 ? 'Bom trabalho!' : 'Continua a treinar';
  $('#score-correct').textContent = qCorrect;
  $('#score-wrong').textContent = qWrong;
  $('#score-total').textContent = total;
}

$('#quiz-next').addEventListener('click', () => { qIndex++; renderQuestion(); });
$('#quiz-end').addEventListener('click', endQuiz);
$('#quiz-restart').addEventListener('click', startQuiz);

/* ============================================================
   SIMULADOR DE EXAME
   ============================================================ */
let examOpts = { n: 10, t: 600, themes: ['all'] };
let examList = [], examIdx = 0, examSel = [], examTimer = null, examEndAt = 0, examStartAt = 0;

function buildExamThemeChips() {
  const wrap = $('#exam-themes');
  let html = `<div class="chip sel" data-th="all">Todos</div>`;
  Object.entries(THEMES).forEach(([k, v]) => html += `<div class="chip" data-th="${k}">${v.label}</div>`);
  wrap.innerHTML = html;
  $$('#exam-themes .chip').forEach(c => c.addEventListener('click', () => {
    const th = c.dataset.th;
    if (th === 'all') {
      $$('#exam-themes .chip').forEach(x => x.classList.remove('sel'));
      c.classList.add('sel'); examOpts.themes = ['all'];
    } else {
      $('#exam-themes .chip[data-th="all"]').classList.remove('sel');
      c.classList.toggle('sel');
      let sel = $$('#exam-themes .chip.sel').map(x => x.dataset.th);
      if (sel.length === 0) { $('#exam-themes .chip[data-th="all"]').classList.add('sel'); sel = ['all']; }
      examOpts.themes = sel;
    }
  }));
}
$$('#exam-count .chip').forEach(c => c.addEventListener('click', () => {
  $$('#exam-count .chip').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); examOpts.n = +c.dataset.n;
}));
$$('#exam-time .chip').forEach(c => c.addEventListener('click', () => {
  $$('#exam-time .chip').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); examOpts.t = +c.dataset.t;
}));

$('#exam-start').addEventListener('click', () => {
  let pool = examOpts.themes.includes('all') ? [...QUIZ] : QUIZ.filter(q => examOpts.themes.includes(q.tema));
  examList = shuffle(pool).slice(0, Math.min(examOpts.n, pool.length));
  examSel = new Array(examList.length).fill(null);
  examIdx = 0;
  $('#exam-setup').style.display = 'none';
  $('#exam-score').style.display = 'none';
  $('#exam-running').style.display = 'block';
  examStartAt = Date.now();
  if (examOpts.t > 0) { examEndAt = Date.now() + examOpts.t * 1000; startExamTimer(); }
  else { $('#exam-timer').textContent = '∞'; }
  renderExamQ();
});

function startExamTimer() {
  clearInterval(examTimer);
  const tick = () => {
    const ms = examEndAt - Date.now();
    if (ms <= 0) { $('#exam-timer').textContent = '00:00'; clearInterval(examTimer); finishExam(); return; }
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
    const el = $('#exam-timer');
    el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    el.classList.toggle('low', ms < 60000);
  };
  tick(); examTimer = setInterval(tick, 1000);
}

function renderExamQ() {
  const q = examList[examIdx];
  $('#exam-counter').textContent = `Pergunta ${examIdx + 1} de ${examList.length}`;
  $('#exam-progress-bar').style.width = ((examIdx / examList.length) * 100) + '%';
  $('#exam-question').textContent = q.q;
  $('#exam-next').textContent = examIdx === examList.length - 1 ? 'Terminar →' : 'Seguinte →';
  const letters = ['A', 'B', 'C', 'D'];
  const optsEl = $('#exam-options');
  optsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option' + (examSel[examIdx] === i ? ' correct' : '');
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${esc(opt)}</span>`;
    btn.onclick = () => {
      examSel[examIdx] = i;
      $$('#exam-options .quiz-option').forEach((b, j) => b.classList.toggle('correct', j === i));
    };
    optsEl.appendChild(btn);
  });
}
$('#exam-next').addEventListener('click', () => {
  if (examIdx < examList.length - 1) { examIdx++; renderExamQ(); }
  else finishExam();
});
$('#exam-finish').addEventListener('click', finishExam);
$('#exam-again').addEventListener('click', () => {
  $('#exam-running').style.display = 'none';
  $('#exam-score').style.display = 'none';
  $('#exam-setup').style.display = 'block';
});

function finishExam() {
  clearInterval(examTimer);
  let correct = 0;
  examList.forEach((q, i) => {
    const isC = examSel[i] === q.correct;
    if (isC) correct++;
    registerAnswer(q.tema, isC, q.id); // conta para domínio/XP/ofensiva
  });
  const total = examList.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  if (pct > state.examBest) state.examBest = pct;
  checkAchievements(); save();
  const used = Math.round((Date.now() - examStartAt) / 1000);
  $('#exam-running').style.display = 'none';
  $('#exam-score').style.display = 'block';
  $('#exam-score-display').textContent = pct + '%';
  $('#exam-score-label').textContent = pct >= 90 ? 'Distinção! 👑' : pct >= 50 ? 'Aprovado 🎓' : 'Reprovado — tenta de novo';
  $('#exam-correct').textContent = correct;
  $('#exam-wrong').textContent = total - correct;
  $('#exam-time-used').textContent = `${Math.floor(used/60)}m${String(used%60).padStart(2,'0')}`;
  if (pct >= 50) burstConfetti();
  // review
  $('#exam-review').innerHTML = '';
  $('#exam-review-btn').onclick = () => {
    const box = $('#exam-review');
    if (box.innerHTML) { box.innerHTML = ''; return; }
    let html = '';
    examList.forEach((q, i) => {
      const sel = examSel[i];
      const ok = sel === q.correct;
      html += `<div class="qa-card"><div style="font-family:'DM Mono',monospace;font-size:0.65rem;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem">${ok ? '✓ Certa' : '✗ Errada'} · ${THEMES[q.tema].label}</div>
        <div style="font-size:0.95rem;margin-bottom:0.5rem">${esc(q.q)}</div>
        <div style="font-size:0.85rem;color:var(--muted)">A tua resposta: ${sel != null ? esc(q.opts[sel]) : '(em branco)'}</div>
        <div style="font-size:0.85rem;margin-top:0.2rem"><strong>Correcta:</strong> ${esc(q.opts[q.correct])}</div>
        <div style="font-size:0.82rem;margin-top:0.5rem;color:var(--accent)">${esc(q.exp)}</div></div>`;
    });
    box.innerHTML = html;
  };
}

/* ============================================================
   FLASHCARDS (com repetição espaçada simples)
   ============================================================ */
let fcMode = 'all';
let fcOrder = FLASHCARDS.map((_, i) => i);

function renderFlashcards() {
  const grid = $('#flashcard-grid');
  let list = fcOrder.slice();
  if (fcMode === 'review') list = list.filter(i => state.flashWrong.includes(i));
  $('#fc-empty').style.display = (fcMode === 'review' && list.length === 0) ? 'block' : 'none';
  grid.innerHTML = '';
  list.forEach(i => {
    const c = FLASHCARDS[i];
    const known = state.flashKnown.includes(i);
    const el = document.createElement('div');
    el.className = 'flashcard';
    el.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <span class="card-tag">${esc(c.tag)}${known ? ' · ✓ sabia' : ''}</span>
          <div class="card-question">${esc(c.q)}</div>
          <span class="card-hint">Clica para revelar →</span>
        </div>
        <div class="flashcard-back">
          <span class="card-tag">${esc(c.tag)}</span>
          <div class="card-answer">${esc(c.a)}</div>
          <div class="card-srs">
            <button class="srs-btn" data-known="1">✓ Sabia</button>
            <button class="srs-btn" data-known="0">✗ Não sabia</button>
          </div>
        </div>
      </div>`;
    el.addEventListener('click', e => { if (!e.target.closest('.srs-btn')) el.classList.toggle('flipped'); });
    el.querySelectorAll('.srs-btn').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      const k = b.dataset.known === '1';
      if (k) {
        if (!state.flashKnown.includes(i)) state.flashKnown.push(i);
        state.flashWrong = state.flashWrong.filter(x => x !== i);
        addXP(2);
      } else {
        if (!state.flashWrong.includes(i)) state.flashWrong.push(i);
        state.flashKnown = state.flashKnown.filter(x => x !== i);
      }
      registerStudy(); checkAchievements(); save(); updateHeroStats();
      el.classList.remove('flipped');
      setTimeout(renderFlashcards, 250);
    }));
    grid.appendChild(el);
  });
}
$('#fc-all').addEventListener('click', () => { fcMode = 'all'; $('#fc-all').classList.add('active'); $('#fc-review').classList.remove('active'); renderFlashcards(); });
$('#fc-review').addEventListener('click', () => { fcMode = 'review'; $('#fc-review').classList.add('active'); $('#fc-all').classList.remove('active'); renderFlashcards(); });
$('#fc-shuffle').addEventListener('click', () => { fcOrder = shuffle(fcOrder); renderFlashcards(); });

/* ============================================================
   PAINEL
   ============================================================ */
function renderPanel() {
  const lvl = levelFromXP(state.xp);
  const inLvl = state.xp % 100;
  $('#xp-level').textContent = `Nível ${lvl}`;
  $('#xp-text').textContent = `${inLvl} / 100 XP · ${state.xp} XP total`;
  $('#xp-fill').style.width = inLvl + '%';

  const acc = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  $('#panel-top').innerHTML = `
    <div class="panel-stat"><div class="ps-num">🔥 ${effectiveStreak()}</div><div class="ps-lbl">Ofensiva (8h)</div><div class="ps-sub">${streakDeadlineText()}</div></div>
    <div class="panel-stat"><div class="ps-num">${state.correct}</div><div class="ps-lbl">Respostas certas</div><div class="ps-sub">${acc}% de acerto</div></div>
    <div class="panel-stat"><div class="ps-num">${state.answered}</div><div class="ps-lbl">Total respondidas</div></div>
    <div class="panel-stat"><div class="ps-num">${state.examBest}%</div><div class="ps-lbl">Melhor exame</div></div>
    <div class="panel-stat"><div class="ps-num">${state.flashKnown.length}</div><div class="ps-lbl">Flashcards dominados</div></div>
    <div class="panel-stat"><div class="ps-num">⭐ ${state.bestStreak}</div><div class="ps-lbl">Melhor ofensiva</div></div>`;

  let td = '';
  Object.entries(THEMES).forEach(([k, v]) => {
    const t = state.themeStats[k] || { c: 0, t: 0 };
    const pct = t.t ? Math.round((t.c / t.t) * 100) : 0;
    td += `<div class="td-row"><div class="td-top"><span>${v.icon} ${v.label}</span><span class="td-pct">${pct}% · ${t.c}/${t.t}</span></div>
      <div class="td-track"><div class="td-fill" style="width:${pct}%"></div></div></div>`;
  });
  $('#theme-domain').innerHTML = td;

  $('#ach-count').textContent = `(${state.achievements.length}/${ACHIEVEMENTS.length})`;
  $('#ach-grid').innerHTML = ACHIEVEMENTS.map(a => {
    const on = state.achievements.includes(a.id);
    return `<div class="ach ${on ? 'unlocked' : ''}"><div class="ach-icon">${a.icon}</div><div class="ach-name">${a.name}</div><div class="ach-desc">${on ? a.desc : '🔒 ' + a.desc}</div></div>`;
  }).join('');
}

$('#reset-btn').addEventListener('click', () => {
  if (confirm('Apagar todo o progresso (XP, ofensiva, conquistas)? Esta acção não pode ser desfeita.')) {
    state = defaultState(); save(); renderPanel(); updateHeroStats(); renderFlashcards();
  }
});

/* ---- estatísticas no início ---- */
function updateHeroStats() {
  const el = $('#hero-stats');
  if (!el) return;
  const lvl = levelFromXP(state.xp);
  el.innerHTML = `
    <div class="hero-stat"><div class="hs-num">${lvl}</div><div class="hs-lbl">Nível</div></div>
    <div class="hero-stat"><div class="hs-num">🔥 ${effectiveStreak()}</div><div class="hs-lbl">Ofensiva</div></div>
    <div class="hero-stat"><div class="hs-num">${state.correct}</div><div class="hs-lbl">Acertos</div></div>
    <div class="hero-stat"><div class="hs-num">${state.achievements.length}/${ACHIEVEMENTS.length}</div><div class="hs-lbl">Conquistas</div></div>`;
  const qc = $('#hero-quiz-count');
  if (qc) qc.textContent = `${QUIZ.length} perguntas por tema`;
}

/* ============================================================
   MAPAS MENTAIS / TIMELINE / TABELAS
   ============================================================ */
function renderMindmaps() {
  $('#mindmaps').innerHTML = MINDMAPS.map(m => {
    const t = THEMES[m.theme];
    const branches = m.branches.map(b => `
      <div class="mm-branch"><h4>${esc(b.label)}</h4><ul>${b.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>`).join('');
    return `<div class="mindmap">
      <div class="mindmap-head"><span class="mm-icon">${t.icon}</span> ${esc(m.central)} <span class="mm-toggle">+</span></div>
      <div class="mindmap-body"><div class="mm-branches">${branches}</div></div>
    </div>`;
  }).join('');
  $$('#mindmaps .mindmap-head').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('open')));
}
function renderTimeline() {
  $('#timeline').innerHTML = TIMELINE.map(t => `
    <div class="tl-item"><div class="tl-year">${esc(t.year)}</div><div class="tl-title">${esc(t.title)}</div><div class="tl-desc">${esc(t.desc)}</div></div>`).join('');
}
function renderComparisons() {
  $('#comparisons').innerHTML = COMPARISONS.map(c => `
    <div class="cmp-title">${esc(c.title)}</div>
    <div class="cmp-table-wrap"><table class="cmp">
      <thead><tr>${c.headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${c.rows.map(r => `<tr>${r.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`).join('');
}

/* ============================================================
   GLOSSÁRIO
   ============================================================ */
function renderGlossary(filter = '') {
  const f = filter.trim().toLowerCase();
  const list = GLOSSARY.filter(g => !f || g.term.toLowerCase().includes(f) || g.def.toLowerCase().includes(f))
    .sort((a, b) => a.term.localeCompare(b.term, 'pt'));
  $('#glossary-list').innerHTML = list.length ? list.map(g => `
    <div class="resumo-block" style="margin-bottom:1.4rem"><h3>${esc(g.term)}</h3><p>${esc(g.def)}</p></div>`).join('')
    : `<div class="empty-note">Sem resultados para "${esc(filter)}".</div>`;
}
$('#gloss-search').addEventListener('input', e => renderGlossary(e.target.value));

/* ============================================================
   EXERCÍCIOS — ORDENAÇÃO
   ============================================================ */
let draggingEl = null;
function renderOrderings() {
  const wrap = $('#inner-ordenacao');
  wrap.innerHTML = ORDERINGS.map((o, oi) => {
    const idxs = shuffle(o.items.map((_, i) => i));
    const items = idxs.map(i => `<li class="ordering-item" draggable="true" data-index="${i}"><span class="drag-handle">⠿</span><span class="item-text">${esc(o.items[i])}</span></li>`).join('');
    return `<div class="ordering-container">
      <div class="ordering-title">${oi + 1}. ${esc(o.title)}</div>
      <ul class="ordering-list" id="order-${oi}">${items}</ul>
      <button class="btn btn-outline check-btn" data-order="${oi}">Verificar Ordem</button>
      <div class="order-result" id="order-result-${oi}"></div>
    </div>`;
  }).join('');
  $$('#inner-ordenacao .ordering-list').forEach(list => {
    list.addEventListener('dragstart', e => { draggingEl = e.target.closest('.ordering-item'); setTimeout(() => draggingEl.classList.add('dragging'), 0); });
    list.addEventListener('dragend', () => { if (draggingEl) draggingEl.classList.remove('dragging'); draggingEl = null; });
    list.addEventListener('dragover', e => {
      e.preventDefault();
      const after = dragAfter(list, e.clientY);
      if (!draggingEl) return;
      if (after == null) list.appendChild(draggingEl); else list.insertBefore(draggingEl, after);
    });
  });
  $$('#inner-ordenacao .check-btn').forEach(b => b.addEventListener('click', () => checkOrder(+b.dataset.order)));
}
function dragAfter(container, y) {
  const els = [...container.querySelectorAll('.ordering-item:not(.dragging)')];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: -Infinity }).element;
}
function checkOrder(oi) {
  const list = $('#order-' + oi);
  const cur = $$('.ordering-item', list).map(it => +it.dataset.index);
  const correct = cur.length === ORDERINGS[oi].items.length && cur.every((v, i) => v === i);
  const r = $('#order-result-' + oi);
  r.className = 'order-result show ' + (correct ? 'correct-order' : 'wrong-order');
  r.textContent = correct ? '✓ Correcto! A ordem está certa.' : '✗ Ainda não. Reordena e verifica novamente.';
  if (correct) { addXP(5); registerStudy(); checkAchievements(); save(); updateHeroStats(); }
}

/* ============================================================
   EXERCÍCIOS — ASSOCIAÇÃO (matching)
   ============================================================ */
let selLeft = null, matched = new Set();
function renderMatching() {
  matched = new Set(); selLeft = null;
  const right = shuffle(MATCHING.map(p => p[1]));
  $('#matching-game').innerHTML = `<div class="match-grid"><div id="match-left"></div><div id="match-right"></div></div>`;
  const L = $('#match-left'), R = $('#match-right');
  MATCHING.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'quiz-option'; b.style.marginBottom = '0.4rem'; b.textContent = p[0]; b.dataset.left = i;
    b.onclick = () => { $$('#match-left .quiz-option').forEach(x => x.style.borderColor = ''); selLeft = { b, i }; b.style.borderColor = 'var(--black)'; };
    L.appendChild(b);
  });
  right.forEach(def => {
    const b = document.createElement('button');
    b.className = 'quiz-option'; b.style.marginBottom = '0.4rem'; b.textContent = def;
    b.onclick = () => {
      if (!selLeft) return;
      if (def === MATCHING[selLeft.i][1]) {
        [selLeft.b, b].forEach(x => { x.classList.add('correct'); x.classList.add('locked'); x.disabled = true; });
        matched.add(selLeft.i); selLeft = null;
      } else {
        const a = selLeft.b;
        a.style.background = 'var(--warm)'; b.style.background = 'var(--warm)';
        setTimeout(() => { a.style.background = ''; b.style.background = ''; a.style.borderColor = ''; }, 700);
        selLeft = null;
      }
    };
    R.appendChild(b);
  });
  $('#matching-result').classList.remove('show');
}
$('#matching-check').addEventListener('click', () => {
  const r = $('#matching-result');
  const all = matched.size === MATCHING.length;
  r.className = 'order-result show ' + (all ? 'correct-order' : 'wrong-order');
  r.textContent = all ? `✓ Perfeito! Associaste todos os ${MATCHING.length} pares.` : `${matched.size} de ${MATCHING.length} pares correctos. Continua!`;
  if (all) { addXP(8); registerStudy(); checkAchievements(); save(); updateHeroStats(); }
});
$('#matching-reset').addEventListener('click', renderMatching);

/* ============================================================
   EXERCÍCIOS — COMPLETAR
   ============================================================ */
function renderFill() {
  $('#inner-completar').innerHTML = FILL_BLANKS.map((item, fi) => {
    const parts = item.text.split('_____');
    let body = '';
    parts.forEach((part, pi) => {
      body += esc(part);
      if (pi < item.blanks.length) body += `<input type="text" class="fb-input" id="fb-${fi}-${pi}" placeholder="...">`;
    });
    return `<div class="fb-block">
      <div class="fb-label">Exercício ${fi + 1} — preenche os espaços</div>
      <p class="fb-text">${body}</p>
      <div class="fb-hint">💡 ${esc(item.hint)}</div>
      <button class="btn btn-outline" data-fill="${fi}">Verificar</button>
      <div class="fb-result" id="fb-result-${fi}"></div>
    </div>`;
  }).join('');
  $$('#inner-completar [data-fill]').forEach(b => b.addEventListener('click', () => checkFill(+b.dataset.fill)));
}
function checkFill(fi) {
  const item = FILL_BLANKS[fi];
  let allOk = true;
  item.blanks.forEach((ans, pi) => {
    const input = $(`#fb-${fi}-${pi}`);
    const val = input.value.trim().toLowerCase();
    const correct = ans.toLowerCase();
    const ok = val && (val === correct || (correct.includes(val) && val.length > 3) || (val.includes(correct) && correct.length > 3));
    input.style.borderColor = ok ? 'var(--good)' : 'var(--bad)';
    input.style.color = ok ? 'var(--good)' : 'var(--bad)';
    if (!ok) allOk = false;
  });
  const r = $(`#fb-result-${fi}`);
  r.style.display = 'block';
  r.style.color = allOk ? 'var(--black)' : 'var(--muted)';
  r.textContent = allOk ? '✓ Correcto!' : `Resposta: ${item.blanks.join(' / ')}`;
  if (allOk) { addXP(5); registerStudy(); checkAchievements(); save(); updateHeroStats(); }
}

/* ============================================================
   EXERCÍCIOS — QUEM DISSE?
   ============================================================ */
function renderWhoSaid() {
  const authors = WHO_SAID.map(w => w.author);
  $('#inner-quemdisse').innerHTML = WHO_SAID.map((w, i) => {
    const distract = shuffle(authors.filter(a => a !== w.author)).slice(0, 3);
    const opts = shuffle([w.author, ...distract]);
    return `<div class="qa-card" data-ws="${i}">
      <div style="font-family:'DM Mono',monospace;font-size:0.62rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:0.6rem">Quem é a fonte desta contribuição?</div>
      <div class="qa-q">"${esc(w.claim)}"</div>
      <div class="quiz-options ws-opts">${opts.map(o => `<button class="quiz-option" data-author="${esc(o)}">${esc(o)}</button>`).join('')}</div>
    </div>`;
  }).join('');
  $$('#inner-quemdisse .qa-card').forEach(card => {
    const i = +card.dataset.ws;
    card.querySelectorAll('.ws-opts .quiz-option').forEach(btn => btn.addEventListener('click', () => {
      if (card.dataset.done) return;
      card.dataset.done = '1';
      const correct = WHO_SAID[i].author;
      card.querySelectorAll('.ws-opts .quiz-option').forEach(b => {
        b.classList.add('locked');
        if (b.dataset.author === correct) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
      });
      if (btn.dataset.author === correct) { addXP(5); }
      registerStudy(); checkAchievements(); save(); updateHeroStats();
    }));
  });
}

/* ============================================================
   EXERCÍCIOS — VERDADEIRO / FALSO
   ============================================================ */
function renderTF() {
  $('#inner-vf').innerHTML = TRUE_FALSE.map((t, i) => `
    <div class="qa-card" data-tf="${i}">
      <div class="qa-q">${esc(t.stmt)}</div>
      <div class="tf-row">
        <button class="btn btn-outline" data-val="true" style="flex:1">Verdadeiro</button>
        <button class="btn btn-outline" data-val="false" style="flex:1">Falso</button>
      </div>
      <div class="tf-feedback" id="tf-fb-${i}"></div>
    </div>`).join('');
  $$('#inner-vf .qa-card').forEach(card => {
    const i = +card.dataset.tf;
    card.querySelectorAll('[data-val]').forEach(btn => btn.addEventListener('click', () => {
      if (card.dataset.done) return;
      card.dataset.done = '1';
      const ans = btn.dataset.val === 'true';
      const ok = ans === TRUE_FALSE[i].answer;
      const fb = $('#tf-fb-' + i);
      fb.classList.add('show');
      fb.textContent = (ok ? '✓ Certo. ' : '✗ Errado. ') + TRUE_FALSE[i].exp;
      btn.style.background = ok ? 'var(--good)' : 'var(--warm)';
      if (ok) { btn.style.color = '#fff'; state.tfCorrect++; addXP(4); }
      registerStudy(); checkAchievements(); save(); updateHeroStats();
    }));
  });
}

/* ============================================================
   PESQUISA GLOBAL
   ============================================================ */
const SEARCH_INDEX = [
  ...QUIZ.map(q => ({ kind: 'Quiz', title: q.q, snippet: q.exp, section: 'quiz' })),
  ...FLASHCARDS.map(c => ({ kind: 'Flashcard', title: c.q, snippet: c.a, section: 'flashcards' })),
  ...GLOSSARY.map(g => ({ kind: 'Glossário', title: g.term, snippet: g.def, section: 'glossario' })),
  ...WHO_SAID.map(w => ({ kind: 'Quem disse', title: w.author, snippet: w.claim, section: 'exercicios' })),
  ...TIMELINE.map(t => ({ kind: 'Timeline', title: `${t.year} — ${t.title}`, snippet: t.desc, section: 'mapas' })),
];
function openSearch() { $('#search-overlay').classList.add('open'); $('#search-input').value = ''; $('#search-results').innerHTML = ''; setTimeout(() => $('#search-input').focus(), 50); }
function closeSearch() { $('#search-overlay').classList.remove('open'); }
function runSearch(q) {
  const f = q.trim().toLowerCase();
  if (!f) { $('#search-results').innerHTML = ''; return; }
  const hits = SEARCH_INDEX.filter(x => (x.title + ' ' + x.snippet).toLowerCase().includes(f)).slice(0, 12);
  const hl = txt => esc(txt).replace(new RegExp('(' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
  $('#search-results').innerHTML = hits.length ? hits.map(h => `
    <div class="search-result" data-section="${h.section}"><div class="sr-kind">${h.kind}</div><div class="sr-title">${hl(h.title)}</div><div class="sr-snippet">${hl(h.snippet.slice(0, 120))}…</div></div>`).join('')
    : `<div class="search-hint">Sem resultados.</div>`;
  $$('#search-results .search-result').forEach(r => r.addEventListener('click', () => { closeSearch(); showSection(r.dataset.section); }));
}
$('#search-btn').addEventListener('click', openSearch);
$('#search-input').addEventListener('input', e => runSearch(e.target.value));
$('#search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') { const first = $('#search-results .search-result'); if (first) first.click(); }
});
$('#search-overlay').addEventListener('click', e => { if (e.target.id === 'search-overlay') closeSearch(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
});

/* ============================================================
   TOAST + CONFETTI
   ============================================================ */
function showToast(icon, title, name) {
  const wrap = $('#toast-wrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<div class="t-icon">${icon}</div><div><div class="t-title">${esc(title)}</div><div class="t-name">${esc(name)}</div></div>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .4s, transform .4s'; t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; setTimeout(() => t.remove(), 400); }, 3200);
}
function burstConfetti() {
  const cv = $('#confetti-canvas');
  cv.style.display = 'block';
  const ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ['#b8860b', '#1a1a1a', '#e3b341', '#6bbf7b', '#c0392b'];
  const parts = Array.from({ length: 120 }, () => ({
    x: innerWidth / 2, y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 12, vy: Math.random() * -14 - 4,
    s: Math.random() * 6 + 3, c: colors[Math.floor(Math.random() * colors.length)], a: 1, rot: Math.random() * 6,
  }));
  let frame = 0;
  (function anim() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.a -= 0.012; p.rot += 0.2;
      ctx.globalAlpha = Math.max(0, p.a);
      ctx.fillStyle = p.c;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
    });
    frame++;
    if (frame < 110) requestAnimationFrame(anim);
    else { ctx.clearRect(0, 0, cv.width, cv.height); cv.style.display = 'none'; }
  })();
}

/* ============================================================
   AUTENTICAÇÃO
   Tratada pelo módulo partilhado /account/account.js, inicializado
   no index.html. O login é OPCIONAL: a app funciona como convidado
   e, ao entrar, o progresso é restaurado do servidor (a página
   recarrega para aplicar os dados sincronizados).
   ============================================================ */

/* ============================================================
   INIT
   ============================================================ */
buildQuizFilters();
startQuiz();
buildExamThemeChips();
renderFlashcards();
renderMindmaps();
renderTimeline();
renderComparisons();
renderGlossary();
renderOrderings();
renderMatching();
renderFill();
renderWhoSaid();
renderTF();

/* ---- conta partilhada (login opcional) ---- */
if (window.Account) {
  Account.init({
    section: 'edc',
    keys: [STORE_KEY, 'edc_highlights'],
    mount: '#user-slot',
    label: 'EDC · Módulo II',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#4A9B8E',
    // migração: contas edc antigas guardavam o estado "achatado" em progress
    migrate: function (p) {
      if (p && p.edc === undefined && (p.xp !== undefined || p.answered !== undefined)) {
        return { 'edc_progress_v1': JSON.stringify(p) };
      }
      return null;
    },
    // uma fatia edc só conta como "com dados" se houver progresso real
    isEmpty: function (slice) {
      try {
        var raw = slice && slice['edc_progress_v1'];
        if (!raw) return true;
        var o = JSON.parse(raw);
        return !((o.xp || 0) || (o.answered || 0) || (o.examBest || 0) ||
                 (o.achievements && o.achievements.length) || (o.visited && o.visited.length));
      } catch (e) { return true; }
    },
  });
}
