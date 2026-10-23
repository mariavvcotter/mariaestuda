"use strict";
/* Inglês · Plataforma de estudo (mariaestuda.eu/ing)
   Site estático. Dados em data/<ano>.json gerados por tools/build_site.py (pasta dos Geradores de Inglês). */

// ---------- Estado / persistência ----------
const KEY = "ing-v1";
const YEARS = [5, 6, 7, 8, 9, 10, 11, 12];
const YC = { 5: "var(--c1)", 6: "var(--c6)", 7: "var(--c3)", 8: "var(--c4)", 9: "var(--c7)", 10: "var(--c2)", 11: "var(--c5)", 12: "var(--c8)" };
const SECTIONS = ["Áreas Temáticas", "Competência Intercultural", "Gramática"];
const SEC_COLOR = { "Áreas Temáticas": "var(--c3)", "Competência Intercultural": "var(--c2)", "Gramática": "var(--c1)" };
const KIND_PT = { fill: "Completar", choice: "Escolher", match: "Associar", truefalse: "Verdadeiro ou falso", rewrite: "Reescrever", order: "Ordenar", open: "Resposta livre" };

const blank = () => ({ year: null, theme: null, decks: {}, ex: {}, items: {}, chapters: {}, fichas: {}, vocab: {}, sessions: [], days: {}, last: null, bigFont: false });
let S;
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = blank(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function today() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function markDay() { S.days[today()] = (S.days[today()] || 0) + 1; }
function applyTheme() { if (S.theme === "dark") document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme; }
applyTheme();

// ---------- Utilitários ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function md(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong class="hl">$1</strong>').replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');
}
function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200); }
function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
function ord(y) { return y + ".º ano"; }
const ICO = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  story: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  ficha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
  gram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
  vocab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
};

// ---------- Dados ----------
let INDEX = null;
const YD = {};
async function loadIndex() { if (!INDEX) INDEX = await (await fetch("data/index.json")).json(); return INDEX; }
async function loadYear(y) { if (!YD[y]) YD[y] = await (await fetch("data/" + y + ".json")).json(); return YD[y]; }
function deckExercises(d) { return d.slides.filter(s => s.type === "exercise"); }
function fichaExercises(f) { return (f.comprehension || []).concat(f.grammar || []); }

// ---------- Correção de respostas ----------
function norm(s) {
  return String(s || "").toLowerCase()
    .replace(/[’‘`´]/g, "'").replace(/[“”]/g, '"')
    .replace(/\s+/g, " ").trim()
    .replace(/\s+([.,!?;:])/g, "$1").replace(/\s*'\s*/g, "'")
    .replace(/[.!?]+$/g, "").replace(/^["']+|["']+$/g, "").trim();
}
function expand(s) {
  return s.replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not").replace(/\bwon't\b/g, "will not").replace(/\bshan't\b/g, "shall not")
    .replace(/n't\b/g, " not").replace(/\bi'm\b/g, "i am").replace(/'re\b/g, " are").replace(/'ve\b/g, " have").replace(/'ll\b/g, " will")
    .replace(/\s+/g, " ").trim();
}
function akey(s) { return expand(norm(s)); }
function candidates(a) {
  const out = new Set(); const add = s => { const k = akey(s); if (k) out.add(k); };
  add(a);
  if (/\//.test(a)) {
    a.split(/\s*\/\s*/).forEach(add);
    const toks = a.split(" ");
    if (toks.filter(x => x === "/").length <= 2) {
      const rec = t => {
        const i = t.indexOf("/");
        if (i < 0) { add(t.join(" ")); return; }
        for (let k = 1; k <= 4; k++) for (let m = 1; m <= 4; m++) {
          if (i - k < 0 || i + m >= t.length) continue;
          rec(t.slice(0, i).concat(t.slice(i + 1 + m)));
          rec(t.slice(0, i - k).concat(t.slice(i + 1)));
        }
      };
      rec(toks);
    }
  }
  return out;
}
function isRight(student, answer) { return candidates(answer).has(akey(student)); }
function firstAlt(a) { return a; }

// ---------- Registo de resultados ----------
function recordItem(id, ok) {
  const r = S.items[id] || { h: [] };
  r.h.push(ok ? 1 : 0); if (r.h.length > 5) r.h = r.h.slice(-5); r.t = Date.now();
  S.items[id] = r;
}
function itemAcc(id) { const r = S.items[id]; if (!r || !r.h.length) return null; return r.h.reduce((a, b) => a + b, 0) / r.h.length; }
function recordEx(id, score, total) {
  const prev = S.ex[id];
  const frac = total ? score / total : 0;
  S.ex[id] = { best: Math.max(prev ? prev.best : 0, frac), last: frac, n: (prev ? prev.n : 0) + 1, t: Date.now() };
  markDay(); save();
}

// ---------- Componente: exercício ----------
function buildExercise(ex, opts = {}) {
  const root = el(`<section class="ex-box ${opts.inSlide ? "in-slide" : ""}"></section>`);
  const kindLabel = KIND_PT[ex.kind] || ex.kind;
  root.innerHTML = `
    <div class="ex-head">${opts.title ? `<h2>${md(opts.title)}</h2>` : (ex.title ? `<h3>${md(ex.title)}</h3>` : "<span></span>")}<span class="ex-kind">${kindLabel}</span></div>
    <p class="ex-instr">${md(ex.instruction || "")}</p>
    ${ex.wordbank && ex.wordbank.length ? `<div class="wordbank">${ex.wordbank.map(w => `<button type="button" data-w="${esc(w)}">${esc(w)}</button>`).join("")}</div>` : ""}
    <div class="items"></div>
    <div class="ex-actions"><button class="btn primary check">Verificar</button><span class="ex-score"></span></div>`;
  const itemsEl = $(".items", root);
  const state = ex.items.map(() => ({ v: null }));
  const matchOptions = ex.kind === "match" ? shuffle(ex.items.map(it => it.a)) : null;
  let lastFocused = null;

  ex.items.forEach((it, i) => {
    const node = el(`<div class="item"><div class="n">${i + 1}</div><div class="q"></div></div>`);
    const q = $(".q", node);
    if (ex.kind === "fill") {
      const parts = esc(it.q).split("___");
      const nGaps = Math.max(1, parts.length - 1);
      const longest = Math.max(...String(it.a).split("|").map(x => x.length));
      let html = "";
      parts.forEach((p, k) => { html += p.replace(/\*\*(.+?)\*\*/g, '<strong class="hl">$1</strong>'); if (k < parts.length - 1) html += `<input class="gap ${longest > 14 ? "wide" : ""}" data-g="${k}" autocomplete="off" autocapitalize="off" spellcheck="false">`; });
      if (parts.length === 1) html += `<input class="gap wide" data-g="0" autocomplete="off" autocapitalize="off" spellcheck="false">`;
      q.innerHTML = html;
      state[i].v = new Array(nGaps).fill("");
      $$("input.gap", q).forEach(inp => { inp.addEventListener("input", () => { state[i].v[+inp.dataset.g] = inp.value; }); inp.addEventListener("focus", () => { lastFocused = inp; }); });
    } else if (ex.kind === "choice") {
      q.innerHTML = `<div>${md(it.q)}</div><div class="opts">${it.options.map(o => `<button type="button" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>`;
      $$(".opts button", q).forEach(b => b.onclick = () => { if (node.dataset.done) return; $$(".opts button", q).forEach(x => x.classList.remove("sel")); b.classList.add("sel"); state[i].v = b.dataset.o; });
    } else if (ex.kind === "truefalse") {
      q.innerHTML = `<div>${md(it.q)}</div><div class="opts"><button type="button" data-o="T">True</button><button type="button" data-o="F">False</button></div>`;
      $$(".opts button", q).forEach(b => b.onclick = () => { if (node.dataset.done) return; $$(".opts button", q).forEach(x => x.classList.remove("sel")); b.classList.add("sel"); state[i].v = b.dataset.o; });
    } else if (ex.kind === "match") {
      q.innerHTML = `<div>${md(it.q)}</div><select><option value="">Escolhe…</option>${matchOptions.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>`;
      $("select", q).onchange = e => { state[i].v = e.target.value; };
    } else if (ex.kind === "rewrite") {
      q.innerHTML = `<div>${md(it.q)}</div><input class="line" autocomplete="off" autocapitalize="off" spellcheck="false">`;
      $("input", q).addEventListener("input", e => { state[i].v = e.target.value; });
    } else if (ex.kind === "order") {
      const words = it.q.split(" / ").map(w => w.trim()).filter(Boolean);
      const sw = shuffle(words.map((w, k) => ({ w, k })));
      q.innerHTML = `<div class="order-out"><span class="out"></span><button type="button" class="clr">apagar</button></div><div class="order-words">${sw.map(o => `<button type="button" data-k="${o.k}">${esc(o.w)}</button>`).join("")}</div>`;
      state[i].v = [];
      const out = $(".out", q);
      const refresh = () => { out.textContent = state[i].v.map(k => words[k]).join(" "); $$(".order-words button", q).forEach(b => b.classList.toggle("used", state[i].v.includes(+b.dataset.k))); };
      $$(".order-words button", q).forEach(b => b.onclick = () => { if (node.dataset.done) return; const k = +b.dataset.k; if (!state[i].v.includes(k)) state[i].v.push(k); refresh(); });
      $(".clr", q).onclick = () => { if (node.dataset.done) return; state[i].v = []; refresh(); };
      state[i].words = words;
    } else { // open
      q.innerHTML = `<div>${md(it.q)}</div><textarea rows="${it.lines ? Math.min(6, Math.max(2, Math.ceil(it.lines / 2))) : 2}"></textarea>`;
      $("textarea", q).addEventListener("input", e => { state[i].v = e.target.value; });
    }
    itemsEl.appendChild(node);
    state[i].node = node;
  });

  // banco de palavras: clicar preenche o último campo focado (ou o próximo vazio)
  $$(".wordbank button", root).forEach(b => b.onclick = () => {
    let inp = lastFocused && root.contains(lastFocused) ? lastFocused : $$("input.gap", root).find(x => !x.value);
    if (!inp) return; inp.value = b.dataset.w; inp.dispatchEvent(new Event("input")); inp.focus();
  });

  const btn = $(".check", root), scoreEl = $(".ex-score", root);
  let checked = false;
  function finish(score, total) {
    scoreEl.textContent = `${score} / ${total} certas`;
    recordEx(ex.id, score, total);
    if (opts.onResult) opts.onResult(score, total);
  }
  btn.onclick = () => {
    if (checked) { // tentar outra vez: repõe os itens errados
      state.forEach((st, i) => { if (st.ok) return; const node = st.node; node.classList.remove("ok", "bad"); delete node.dataset.done; $(".feedback", node)?.remove(); $(".model", node)?.remove(); $(".selfcheck", node)?.remove();
        if (ex.kind === "fill") { $$("input.gap", node).forEach(x => { x.value = ""; x.disabled = false; }); st.v = st.v.map(() => ""); }
        else if (ex.kind === "choice" || ex.kind === "truefalse") { $$(".opts button", node).forEach(x => x.classList.remove("sel", "right", "wrong")); st.v = null; }
        else if (ex.kind === "match") { const s = $("select", node); s.value = ""; s.disabled = false; st.v = ""; }
        else if (ex.kind === "rewrite") { const s = $("input.line", node); s.value = ""; s.disabled = false; st.v = ""; }
        else if (ex.kind === "order") { st.v = []; $(".out", node).textContent = ""; $$(".order-words button", node).forEach(x => x.classList.remove("used")); }
        else { $("textarea", node).disabled = false; }
      });
      checked = false; btn.textContent = "Verificar"; scoreEl.textContent = ""; return;
    }
    let score = 0, total = 0, pending = 0;
    ex.items.forEach((it, i) => {
      const st = state[i]; if (st.ok) { score++; total++; return; }
      const node = st.node; const id = ex.id + "." + i;
      let ok = null, shown = "";
      if (ex.kind === "fill") {
        const ans = String(it.a).split("|");
        ok = ans.every((a, k) => isRight(st.v[k] || "", a));
        shown = ans.join(", "); $$("input.gap", node).forEach(x => x.disabled = true);
      } else if (ex.kind === "choice") {
        if (st.v == null) { pending++; return; }
        ok = st.v === it.a; shown = it.a;
        $$(".opts button", node).forEach(b => { if (b.dataset.o === it.a) b.classList.add("right"); else if (b.classList.contains("sel")) b.classList.add("wrong"); });
      } else if (ex.kind === "truefalse") {
        if (st.v == null) { pending++; return; }
        const a = String(it.a).trim().toUpperCase().startsWith("T") ? "T" : "F";
        ok = st.v === a; shown = (a === "T" ? "True" : "False") + (it.fix ? ". " + it.fix : "");
        $$(".opts button", node).forEach(b => { if (b.dataset.o === a) b.classList.add("right"); else if (b.classList.contains("sel")) b.classList.add("wrong"); });
      } else if (ex.kind === "match") {
        if (!st.v) { pending++; return; }
        ok = st.v === it.a; shown = it.a; $("select", node).disabled = true;
      } else if (ex.kind === "rewrite") {
        ok = isRight(st.v || "", it.a); shown = it.a; $("input.line", node).disabled = true;
      } else if (ex.kind === "order") {
        const sentence = st.v.map(k => st.words[k]).join(" ");
        ok = isRight(sentence, it.a); shown = it.a;
      } else { // open: autoavaliação
        $("textarea", node).disabled = true;
        node.dataset.done = "1";
        node.insertAdjacentHTML("beforeend", `<div class="model"><b>Resposta modelo:</b> ${md(it.a)}</div><div class="selfcheck"><button class="btn sm ok">Acertei</button><button class="btn sm bad">Preciso de rever</button></div>`);
        pending++;
        $$(".selfcheck button", node).forEach((b, k) => b.onclick = () => {
          const good = k === 0; node.classList.add(good ? "ok" : "bad"); $(".selfcheck", node).remove(); st.ok = good; recordItem(id, good);
          pending--; if (good) score++; if (pending === 0) finish(score, total);
          else scoreEl.textContent = `${score} certas até agora`;
        });
        total++; return;
      }
      total++; node.dataset.done = "1"; st.ok = ok; recordItem(id, ok);
      node.classList.add(ok ? "ok" : "bad");
      if (ok) { score++; node.insertAdjacentHTML("beforeend", `<div class="feedback ok">Certo</div>`); }
      else {
        node.insertAdjacentHTML("beforeend", `<div class="feedback bad">Resposta: <span class="ans">${md(shown)}</span>${(ex.kind === "fill" || ex.kind === "rewrite" || ex.kind === "order") ? ` <button type="button" class="override">afinal estava certo</button>` : ""}</div>`);
        const ov = $(".override", node);
        if (ov) ov.onclick = () => { node.classList.remove("bad"); node.classList.add("ok"); ov.remove(); st.ok = true; recordItem(id, true); score++; scoreEl.textContent = `${score} / ${total} certas`; recordEx(ex.id, score, total); if (opts.onResult) opts.onResult(score, total); };
      }
    });
    if (total === 0 && pending) { toast("Responde primeiro a pelo menos um item."); return; }
    checked = true; btn.textContent = "Tentar outra vez";
    if (ex.kind === "open") { if (pending === 0) finish(score, total); }
    else { finish(score, total); if (pending) toast(`${pending} item(ns) sem resposta ficaram por verificar.`); }
  };
  return root;
}

// ---------- Componente: slide de lição ----------
function renderSlide(s) {
  const t = s.type;
  const title = `<h2>${md(s.title || "")}</h2>`;
  if (t === "objectives") return `<section class="slide">${title}<ul>${s.items.map(x => `<li>${md(x)}</li>`).join("")}</ul></section>`;
  if (t === "cards") return `<section class="slide">${title}<div class="cards">${s.cards.map(c => `<div class="c"><b>${md(c.heading)}</b>${md(c.text)}${c.example ? `<span class="ex">${md(c.example)}</span>` : ""}</div>`).join("")}</div></section>`;
  if (t === "vocab") return `<section class="slide">${title}<div class="vocab">${s.items.map(v => `<div class="v"><b>${esc(v.word)}</b><span>${esc(v.pt)}</span></div>`).join("")}</div></section>`;
  if (t === "table") return `<section class="slide">${title}<div class="tbwrap"><table class="tb ${s.boldFirstCol ? "bold1" : ""}"><thead><tr>${s.header.map(h => `<th>${md(h)}</th>`).join("")}</tr></thead><tbody>${s.rows.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${s.note ? `<p class="note">${md(s.note)}</p>` : ""}</section>`;
  if (t === "tip") return `<section class="slide tip"><h2>${md(s.title || "Watch out!")}</h2><p>${md(s.text)}</p>${s.examples ? `<ul>${s.examples.map(x => `<li>${md(x)}</li>`).join("")}</ul>` : ""}</section>`;
  if (t === "examples") return `<section class="slide examples">${title}${s.items.map(x => `<div class="e"><div>${md(x.en)}</div>${x.pt ? `<div class="pt">${md(x.pt)}</div>` : ""}</div>`).join("")}</section>`;
  if (t === "reading") return `<section class="slide">${title}<div class="reading-text">${s.text.map(p => `<p>${md(p)}</p>`).join("")}</div>${s.glossary && s.glossary.length ? `<div class="glossary">${s.glossary.map(g => `<span><b>${esc(g.word)}</b> · ${esc(g.pt)}</span>`).join("")}</div>` : ""}</section>`;
  if (t === "compare") return `<section class="slide">${title}<div class="compare">${[s.left, s.right].map(side => `<div class="side"><b>${md(side.heading)}</b><ul>${side.points.map(p => `<li>${md(p)}</li>`).join("")}</ul></div>`).join("")}</div></section>`;
  if (t === "discuss") return `<section class="slide discuss"><h2>${md(s.title || "Let's talk")}<span class="tag">Para falar</span></h2><ul>${s.questions.map(q => `<li>${md(q)}</li>`).join("")}</ul></section>`;
  if (t === "summary") return `<section class="slide summary"><h2>${md(s.title || "Remember")}</h2><ul>${s.points.map(p => `<li>${md(p)}</li>`).join("")}</ul></section>`;
  return "";
}

// ---------- Navegação ----------
function route() {
  const h = location.hash.replace(/^#\/?/, "");
  const p = h.split("/").filter(Boolean);
  if (!p.length) return { view: "home" };
  const y = +p[0];
  if (!YEARS.includes(y)) return { view: "home" };
  return { view: p[1] || "year", year: y, a: p[2], b: p[3] };
}
function go(h) { location.hash = h; }
function navLink(href, label, icon, active) { return `<a href="${href}" class="${active ? "active" : ""}">${ICO[icon] || ""}<span>${label}</span></a>`; }
function renderNav(r) {
  const nav = $("#nav");
  let html = navLink("#/", "Escolher ano", "grid", r.view === "home");
  if (S.year) {
    const y = S.year;
    html += `<div class="nav-sep">${ord(y)}</div>`;
    html += navLink(`#/${y}`, "Início", "home", r.view === "year");
    html += navLink(`#/${y}/licoes`, "Lições", "book", r.view === "licoes" || r.view === "licao");
    html += navLink(`#/${y}/historia`, "História", "story", r.view === "historia" || r.view === "capitulo");
    html += navLink(`#/${y}/fichas`, "Fichas", "ficha", r.view === "fichas" || r.view === "ficha");
    html += navLink(`#/${y}/gramatica`, "Gramática", "gram", r.view === "gramatica");
    html += navLink(`#/${y}/vocab`, "Vocabulário", "vocab", r.view === "vocab");
    html += navLink(`#/${y}/praticar`, "Praticar", "play", r.view === "praticar");
    html += navLink(`#/${y}/progresso`, "Progresso", "chart", r.view === "progresso");
  }
  nav.innerHTML = html;
  $$("a", nav).forEach(a => a.addEventListener("click", closeMenu));
  const tb = $("#themeBtn"); tb.innerHTML = (S.theme === "dark" ? ICO.sun + " Modo claro" : ICO.moon + " Modo escuro");
  tb.onclick = () => { S.theme = S.theme === "dark" ? null : "dark"; applyTheme(); save(); renderNav(r); };
}
function openMenu() { $("#side").classList.add("open"); $("#scrim").classList.add("show"); }
function closeMenu() { $("#side").classList.remove("open"); $("#scrim").classList.remove("show"); }
$("#menuBtn").innerHTML = ICO.menu; $("#menuBtn").onclick = openMenu; $("#scrim").onclick = closeMenu;

async function render() {
  const r = route();
  const main = $("#main");
  closeMenu();
  if (r.year) { if (S.year !== r.year) { S.year = r.year; save(); } }
  renderNav(r);
  window.scrollTo(0, 0);
  try {
    await loadIndex();
    if (r.view === "home") return viewHome(main);
    main.innerHTML = '<div class="loading">A carregar…</div>';
    const D = await loadYear(r.year);
    const fn = VIEWS[r.view] || VIEWS.year;
    $("#topbarTitle").textContent = `Inglês · ${ord(r.year)}`;
    if (r.view !== "year") { S.last = { hash: location.hash, label: null }; }
    fn(main, D, r);
    if (r.view !== "year" && S.last) { const h1 = $("h1", main); S.last.label = h1 ? h1.textContent : r.view; save(); }
  } catch (e) {
    console.error(e);
    main.innerHTML = `<div class="empty">Não foi possível carregar os conteúdos. Verifica a ligação à internet e volta a tentar.<br><span class="small">${esc(e.message)}</span></div>`;
  }
}

// ---------- Vistas ----------
function viewHome(main) {
  $("#topbarTitle").textContent = "Inglês";
  const yrs = INDEX.years;
  main.innerHTML = `
    <h1>Inglês</h1>
    <p class="lead">Lições com exercícios, uma história de leitura por ano, fichas de trabalho, a sebenta de gramática e flashcards de vocabulário. Escolhe o teu ano para começar.</p>
    <div class="years">${yrs.map(y => `<a class="year-card" href="#/${y.year}" style="--yc:${YC[y.year]}"><b>${y.year}.º</b><span class="lv">${esc(y.ciclo)} · ${esc(y.level)}</span><span class="lv">${y.decks} lições · ${y.exercises} exercícios</span>${S.year === y.year ? `<span class="badge acc cur">o teu ano</span>` : ""}</a>`).join("")}</div>
    <h2>Como funciona</h2>
    <div class="grid">
      <div class="card"><div class="kicker">Lições</div><div class="sub">Cada lição explica a matéria e tem exercícios com correção imediata. Podes repetir as vezes que quiseres.</div></div>
      <div class="card"><div class="kicker">História e fichas</div><div class="sub">Uma história em 9 capítulos, 3 por período, e uma ficha por capítulo com compreensão, gramática e escrita.</div></div>
      <div class="card"><div class="kicker">Praticar</div><div class="sub">Sessões rápidas com exercícios escolhidos ao acaso, dando prioridade ao que ainda não fizeste ou erraste.</div></div>
      <div class="card"><div class="kicker">Progresso</div><div class="sub">Fica guardado neste navegador. Se entrares com a tua conta (nome e PIN, no canto inferior esquerdo), fica guardado em qualquer dispositivo.</div></div>
    </div>`;
}

const VIEWS = {};

VIEWS.year = (main, D) => {
  const y = D.year;
  const decksDone = D.decks.filter(d => S.decks[d.id]).length;
  const exTotal = D.decks.reduce((n, d) => n + deckExercises(d).length, 0);
  const exDone = D.decks.reduce((n, d) => n + deckExercises(d).filter(e => S.ex[e.id]).length, 0);
  const chRead = D.story ? D.story.chapters.filter((c, i) => S.chapters[`${y}-${i + 1}`]).length : 0;
  const fDone = D.fichas.filter(f => S.fichas[`${y}-${f.num}`]).length;
  const nVocab = vocabList(D).length;
  const nVocabKnown = vocabList(D).filter(v => (S.vocab[vkey(y, v.word)] || {}).b >= 2).length;
  main.innerHTML = `
    <div class="breadcrumb"><a href="#/">Anos</a> › ${ord(y)}</div>
    <h1>${ord(y)} <span class="badge acc">${esc(D.level)}</span></h1>
    <p class="lead">${esc(D.ciclo)}. ${D.decks.length} lições, ${exTotal} exercícios, a história <em>${esc(D.story ? D.story.title : "")}</em> em ${D.story ? D.story.chapters.length : 0} capítulos, ${D.fichas.length} fichas e a sebenta de gramática.</p>
    ${S.last && S.last.hash && S.last.hash.startsWith(`#/${y}/`) && S.last.label ? `<a class="card accent" href="${S.last.hash}" style="margin-bottom:16px"><div class="kicker">Continuar onde ficaste</div><h3>${esc(S.last.label)}</h3></a>` : ""}
    <div class="grid wide">
      <a class="card" href="#/${y}/licoes"><div class="kicker">Lições</div><h3>${D.decks.length} lições em 3 áreas</h3><div class="sub">Áreas temáticas, competência intercultural e gramática.</div><div class="foot"><span>${decksDone} concluídas · ${exDone}/${exTotal} exercícios</span></div><div class="bar"><i style="width:${pct(exDone, exTotal)}%"></i></div></a>
      <a class="card" href="#/${y}/historia"><div class="kicker">História de leitura</div><h3>${esc(D.story ? D.story.title : "")}</h3><div class="sub">${esc(D.story ? D.story.subtitle : "")}</div><div class="foot"><span>${chRead} de ${D.story ? D.story.chapters.length : 0} capítulos lidos</span></div><div class="bar"><i style="width:${pct(chRead, 9)}%"></i></div></a>
      <a class="card" href="#/${y}/fichas"><div class="kicker">Fichas de trabalho</div><h3>${D.fichas.length} fichas</h3><div class="sub">Uma por capítulo: compreensão, gramática e escrita.</div><div class="foot"><span>${fDone} concluídas</span></div><div class="bar"><i style="width:${pct(fDone, D.fichas.length)}%"></i></div></a>
      <a class="card" href="#/${y}/gramatica"><div class="kicker">Sebenta de gramática</div><h3>${D.sebenta.length} capítulos</h3><div class="sub">Regras, tabelas e exemplos para consultar quando precisares.</div></a>
      <a class="card" href="#/${y}/vocab"><div class="kicker">Vocabulário</div><h3>${nVocab} palavras</h3><div class="sub">Flashcards com repetição: as palavras que erras voltam mais vezes.</div><div class="foot"><span>${nVocabKnown} já sabes bem</span></div><div class="bar"><i style="width:${pct(nVocabKnown, nVocab)}%"></i></div></a>
      <a class="card" href="#/${y}/praticar"><div class="kicker">Praticar</div><h3>Sessão rápida</h3><div class="sub">Exercícios ao acaso de todas as lições e fichas, com prioridade ao que ainda não dominas.</div></a>
    </div>`;
};

VIEWS.licoes = (main, D) => {
  const y = D.year;
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › Lições</div><h1>Lições</h1><p class="lead">Lê a explicação, faz os exercícios e marca a lição como concluída no fim.</p>` +
    SECTIONS.map(sec => {
      const ds = D.decks.filter(d => d.section === sec);
      if (!ds.length) return "";
      return `<h2>${esc(sec)}</h2><div class="grid">${ds.map(d => {
        const exs = deckExercises(d); const done = exs.filter(e => S.ex[e.id]).length;
        return `<a class="card" href="#/${y}/licao/${d.n}"><div class="row between"><span class="num" style="background:${SEC_COLOR[sec]}">${d.n}</span>${S.decks[d.id] ? `<span class="badge ok">${ICO.check} concluída</span>` : (done ? `<span class="badge warn">em curso</span>` : "")}</div><div class="kicker">${esc(d.kicker || "")}</div><h3>${esc(d.title)}</h3><div class="sub">${esc(d.subtitle || "")}</div><div class="foot"><span>${exs.length} exercícios</span><span>${done}/${exs.length}</span></div><div class="bar"><i style="width:${pct(done, exs.length)}%"></i></div></a>`;
      }).join("")}</div>`;
    }).join("");
};

VIEWS.licao = (main, D, r) => {
  const y = D.year; const n = +r.a;
  const idx = D.decks.findIndex(d => d.n === n);
  const d = D.decks[idx];
  if (!d) return VIEWS.licoes(main, D);
  const next = D.decks[idx + 1], prev = D.decks[idx - 1];
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › <a href="#/${y}/licoes">Lições</a> › ${esc(d.section)}</div>
    <div class="lesson-head"><div class="kicker">Lição ${d.n} · ${esc(d.kicker || d.section)}</div><h1>${esc(d.title)}</h1><p class="lead">${esc(d.subtitle || "")}</p></div>
    <div id="slides"></div>
    <div class="ex-actions" style="margin-top:24px"><button class="btn primary" id="doneBtn">${S.decks[d.id] ? ICO.check + " Lição concluída" : "Concluir lição"}</button>${prev ? `<a class="btn ghost" href="#/${y}/licao/${prev.n}">← Anterior</a>` : ""}${next ? `<a class="btn" href="#/${y}/licao/${next.n}">Próxima lição: ${esc(next.title)} →</a>` : ""}</div>`;
  const box = $("#slides");
  d.slides.forEach(s => {
    if (s.type === "exercise") { const wrap = el('<section class="slide"></section>'); wrap.appendChild(buildExercise(s, { inSlide: true, title: s.title })); box.appendChild(wrap); }
    else box.insertAdjacentHTML("beforeend", renderSlide(s));
  });
  $("#doneBtn").onclick = () => { S.decks[d.id] = Date.now(); markDay(); save(); $("#doneBtn").innerHTML = ICO.check + " Lição concluída"; toast("Lição concluída. Bom trabalho!"); };
};

VIEWS.historia = (main, D) => {
  const y = D.year, st = D.story;
  if (!st) { main.innerHTML = `<div class="empty">Ainda não há história para este ano.</div>`; return; }
  const terms = { 1: "1.º período", 2: "2.º período", 3: "3.º período" };
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › História</div>
    <h1>${esc(st.title)}</h1><p class="lead">${esc(st.subtitle || "")}</p>
    <div class="slide"><p style="font-size:16.5px;margin:0">${esc(st.blurb || "")}</p></div>
    <h2>Characters</h2><div class="chars">${(st.characters || []).map(c => `<div class="ch"><b>${esc(c.name)}</b> ${esc(c.desc)}</div>`).join("")}</div>
    ${[1, 2, 3].map(t => `<h2>${terms[t]}</h2><div class="chapter-list">${st.chapters.map((c, i) => ({ c, i })).filter(x => x.c.term === t).map(({ c, i }) => `<a href="#/${y}/capitulo/${i + 1}"><span class="num" style="background:${YC[y]}">${i + 1}</span><span class="t">${esc(c.title)}<small>${c.paragraphs.length} parágrafos · ${c.paragraphs.join(" ").split(/\s+/).length} palavras</small></span>${S.chapters[`${y}-${i + 1}`] ? `<span class="badge ok">${ICO.check} lido</span>` : ""}</a>`).join("")}</div>`).join("")}`;
};

VIEWS.capitulo = (main, D, r) => {
  const y = D.year, st = D.story, i = +r.a - 1;
  const c = st && st.chapters[i];
  if (!c) return VIEWS.historia(main, D);
  const key = `${y}-${i + 1}`;
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › <a href="#/${y}/historia">${esc(st.title)}</a> › Capítulo ${i + 1}</div>
    <div class="chapter ${S.bigFont ? "big" : ""}" id="chapter">
      <div class="row between"><div class="kicker muted small">Chapter ${i + 1} · ${c.term}.º período</div><button class="btn sm ghost" id="fontBtn">Aa</button></div>
      <h1>${esc(c.title)}</h1>
      <div class="reading-text">${c.paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      ${c.glossary && c.glossary.length ? `<h3>Glossary</h3><div class="glossary">${c.glossary.map(g => `<span><b>${esc(g.word)}</b> · ${esc(g.pt)}</span>`).join("")}</div>` : ""}
      <div class="ex-actions" style="margin-top:24px"><button class="btn primary" id="readBtn">${S.chapters[key] ? ICO.check + " Capítulo lido" : "Li este capítulo"}</button><a class="btn" href="#/${y}/ficha/${i + 1}">Fazer a ficha ${i + 1} →</a></div>
      <div class="chapter-nav">${i > 0 ? `<a class="btn ghost" href="#/${y}/capitulo/${i}">← Capítulo ${i}</a>` : "<span></span>"}${i + 1 < st.chapters.length ? `<a class="btn ghost" href="#/${y}/capitulo/${i + 2}">Capítulo ${i + 2} →</a>` : ""}</div>
    </div>`;
  $("#readBtn").onclick = () => { S.chapters[key] = Date.now(); markDay(); save(); $("#readBtn").innerHTML = ICO.check + " Capítulo lido"; toast("Capítulo marcado como lido."); };
  $("#fontBtn").onclick = () => { S.bigFont = !S.bigFont; save(); $("#chapter").classList.toggle("big", S.bigFont); };
};

VIEWS.fichas = (main, D) => {
  const y = D.year;
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › Fichas</div><h1>Fichas de trabalho</h1><p class="lead">Uma ficha por capítulo da história: leitura, compreensão, gramática e um exercício de escrita.</p>
    <div class="grid">${D.fichas.map(f => { const exs = fichaExercises(f); const done = exs.filter(e => S.ex[e.id]).length; return `<a class="card" href="#/${y}/ficha/${f.num}"><div class="row between"><span class="num" style="background:${YC[y]}">${f.num}</span>${S.fichas[`${y}-${f.num}`] ? `<span class="badge ok">${ICO.check} concluída</span>` : (done ? `<span class="badge warn">em curso</span>` : "")}</div><h3>${esc(f.title)}</h3><div class="sub">${esc(f.focus || "")}</div><div class="foot"><span>${exs.length} exercícios</span><span>${done}/${exs.length}</span></div><div class="bar"><i style="width:${pct(done, exs.length)}%"></i></div></a>`; }).join("")}</div>`;
};

VIEWS.ficha = (main, D, r) => {
  const y = D.year, n = +r.a;
  const f = D.fichas.find(x => x.num === n);
  if (!f) return VIEWS.fichas(main, D);
  const key = `${y}-${n}`;
  const rd = f.reading || {};
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › <a href="#/${y}/fichas">Fichas</a> › Ficha ${n}</div>
    <div class="lesson-head"><div class="kicker">Ficha ${n}</div><h1>${esc(f.title)}</h1><p class="lead">${esc(f.focus || "")}</p></div>
    <section class="slide"><h2>${md(rd.title || "Reading")}</h2><div class="reading-text">${(rd.text || []).map(p => `<p>${md(p)}</p>`).join("")}</div>${rd.source ? `<p class="note">${esc(rd.source)}</p>` : ""}${rd.glossary && rd.glossary.length ? `<div class="glossary">${rd.glossary.map(g => `<span><b>${esc(g.word)}</b> · ${esc(g.pt)}</span>`).join("")}</div>` : ""}</section>
    <h2>Reading comprehension</h2><div id="comp"></div>
    <h2>Grammar</h2><div id="gram"></div>
    <h2>Writing</h2>
    <section class="slide"><p>${md(f.writing ? f.writing.task : "")}</p><textarea id="wr" rows="${f.writing && f.writing.lines ? Math.max(4, f.writing.lines) : 6}" style="width:100%;border:1px solid var(--line);border-radius:9px;background:var(--surface-2);padding:10px;color:inherit"></textarea>
      <div class="ex-actions"><button class="btn" id="modelBtn">Ver resposta modelo</button><span class="muted small" id="wc"></span></div><div id="model"></div></section>
    <div class="ex-actions" style="margin-top:24px"><button class="btn primary" id="doneBtn">${S.fichas[key] ? ICO.check + " Ficha concluída" : "Concluir ficha"}</button><a class="btn ghost" href="#/${y}/capitulo/${n}">Ler o capítulo ${n}</a>${n < D.fichas.length ? `<a class="btn ghost" href="#/${y}/ficha/${n + 1}">Ficha ${n + 1} →</a>` : ""}</div>`;
  (f.comprehension || []).forEach(e => $("#comp").appendChild(buildExercise(e)));
  (f.grammar || []).forEach(e => $("#gram").appendChild(buildExercise(e)));
  const wr = $("#wr"); wr.oninput = () => { const w = wr.value.trim().split(/\s+/).filter(Boolean).length; $("#wc").textContent = w ? w + " palavras" : ""; };
  $("#modelBtn").onclick = () => { $("#model").innerHTML = `<div class="model"><b>Resposta modelo:</b> ${md(f.writing ? f.writing.model : "")}</div>`; };
  $("#doneBtn").onclick = () => { S.fichas[key] = Date.now(); markDay(); save(); $("#doneBtn").innerHTML = ICO.check + " Ficha concluída"; toast("Ficha concluída."); };
};

VIEWS.gramatica = (main, D, r) => {
  const y = D.year;
  if (!D.sebenta.length) { main.innerHTML = `<div class="empty">Sem sebenta para este ano.</div>`; return; }
  if (r.a == null) {
    main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › Gramática</div><h1>Sebenta de gramática</h1><p class="lead">A mesma sebenta que tens em papel, para consultar no telemóvel ou no computador.</p>
      <div class="seb-toc">${D.sebenta.map((c, i) => `<a href="#/${y}/gramatica/${i + 1}"><span class="num" style="background:${c.n === "+" || c.n === "R" ? "var(--c5)" : "var(--c1)"}">${c.n === "+" ? "★" : c.n === "R" ? "✎" : esc(c.n)}</span><span>${esc(c.title)}</span></a>`).join("")}</div>`;
    return;
  }
  const i = +r.a - 1, c = D.sebenta[i];
  if (!c) return VIEWS.gramatica(main, D, { a: null });
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › <a href="#/${y}/gramatica">Gramática</a> › ${esc(c.title)}</div>
    <h1>${c.n !== "+" && c.n !== "R" ? esc(c.n) + ". " : ""}${esc(c.title)}</h1>
    <div class="seb" id="seb"></div>
    <div class="chapter-nav">${i > 0 ? `<a class="btn ghost" href="#/${y}/gramatica/${i}">← ${esc(D.sebenta[i - 1].title)}</a>` : "<span></span>"}${i + 1 < D.sebenta.length ? `<a class="btn ghost" href="#/${y}/gramatica/${i + 2}">${esc(D.sebenta[i + 1].title)} →</a>` : ""}</div>`;
  const seb = $("#seb"); seb.innerHTML = c.html;
  $$("table", seb).forEach(t => { const w = document.createElement("div"); w.className = "tbwrap"; t.parentNode.insertBefore(w, t); w.appendChild(t); $$("[style]", t).forEach(x => x.removeAttribute("style")); });
};

// ---------- Vocabulário (flashcards) ----------
function vkey(y, w) { return y + ":" + w.toLowerCase(); }
function vocabList(D) {
  const out = [];
  D.decks.forEach(d => d.slides.filter(s => s.type === "vocab").forEach(s => s.items.forEach(v => out.push({ word: v.word, pt: v.pt, group: `Lição ${d.n}: ${d.title}`, gid: "d" + d.n }))));
  if (D.story) D.story.chapters.forEach((c, i) => (c.glossary || []).forEach(g => out.push({ word: g.word, pt: g.pt, group: `História, capítulo ${i + 1}`, gid: "c" + (i + 1) })));
  const seen = new Set();
  return out.filter(v => { const k = v.word.toLowerCase() + "|" + v.gid; if (seen.has(k)) return false; seen.add(k); return true; });
}
VIEWS.vocab = (main, D) => {
  const y = D.year; const all = vocabList(D);
  const groups = []; all.forEach(v => { if (!groups.find(g => g.gid === v.gid)) groups.push({ gid: v.gid, name: v.group }); });
  let sel = new Set(groups.map(g => g.gid)); let dir = "en";
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › Vocabulário</div><h1>Vocabulário</h1><p class="lead">${all.length} palavras das lições e dos glossários da história. Vira o cartão e diz se sabias. As palavras que não sabes voltam mais cedo.</p>
    <div class="slide"><h2>Escolhe o que praticar</h2><div class="row" id="groups">${groups.map(g => `<button class="chip on" data-g="${g.gid}">${esc(g.name)}</button>`).join("")}</div>
      <div class="row" style="margin-top:12px"><button class="btn sm ghost" id="allBtn">Todas</button><button class="btn sm ghost" id="noneBtn">Nenhuma</button><span class="muted small" style="margin-left:auto">Mostrar primeiro:</span><button class="chip on" id="dirEn">Inglês</button><button class="chip" id="dirPt">Português</button></div>
      <div class="ex-actions"><button class="btn primary" id="startBtn">Começar (20 cartões)</button><button class="btn" id="listBtn">Ver lista</button></div></div>
    <div id="area"></div>`;
  const gb = $("#groups");
  gb.onclick = e => { const b = e.target.closest("button"); if (!b) return; b.classList.toggle("on"); if (b.classList.contains("on")) sel.add(b.dataset.g); else sel.delete(b.dataset.g); };
  $("#allBtn").onclick = () => { sel = new Set(groups.map(g => g.gid)); $$("button", gb).forEach(b => b.classList.add("on")); };
  $("#noneBtn").onclick = () => { sel = new Set(); $$("button", gb).forEach(b => b.classList.remove("on")); };
  $("#dirEn").onclick = () => { dir = "en"; $("#dirEn").classList.add("on"); $("#dirPt").classList.remove("on"); };
  $("#dirPt").onclick = () => { dir = "pt"; $("#dirPt").classList.add("on"); $("#dirEn").classList.remove("on"); };
  $("#listBtn").onclick = () => {
    const words = all.filter(v => sel.has(v.gid));
    $("#area").innerHTML = `<h2>Lista</h2>` + groups.filter(g => sel.has(g.gid)).map(g => `<h3>${esc(g.name)}</h3><div class="vocab">${words.filter(v => v.gid === g.gid).map(v => { const st = S.vocab[vkey(y, v.word)]; return `<div class="v" style="border-left:4px solid ${st ? (st.b >= 2 ? "var(--ok)" : st.b === 1 ? "var(--warn)" : "var(--bad)") : "var(--line)"}"><b>${esc(v.word)}</b><span>${esc(v.pt)}</span></div>`; }).join("")}</div>`).join("");
  };
  $("#startBtn").onclick = () => {
    const pool = all.filter(v => sel.has(v.gid));
    if (!pool.length) { toast("Escolhe pelo menos um grupo."); return; }
    // prioridade: nunca vistas e caixas baixas; dentro de cada caixa, as mais antigas
    const scored = pool.map(v => { const st = S.vocab[vkey(y, v.word)] || { b: -1, t: 0 }; return { v, s: st.b * 1e13 + st.t + Math.random() * 1e9 }; });
    scored.sort((a, b) => a.s - b.s);
    const cards = shuffle(scored.slice(0, 20).map(x => x.v));
    let i = 0, known = 0;
    const area = $("#area");
    const show = () => {
      if (i >= cards.length) { area.innerHTML = `<div class="slide result-big"><b>${known}/${cards.length}</b><p>palavras que sabias. ${known === cards.length ? "Perfeito!" : "As que falharam vão aparecer outra vez em breve."}</p><div class="flash-actions"><button class="btn primary" id="again">Outra ronda</button></div></div>`; $("#again").onclick = () => $("#startBtn").click(); markDay(); save(); return; }
      const v = cards[i]; const front = dir === "en" ? v.word : v.pt, back = dir === "en" ? v.pt : v.word;
      area.innerHTML = `<div class="flash"><div class="fc" id="fc"><div class="face"><div><small>${dir === "en" ? "English" : "Português"}</small>${esc(front)}</div></div><div class="face back"><div><small>${dir === "en" ? "Português" : "English"}</small>${esc(back)}</div></div></div>
        <div class="flash-actions" id="fa"><button class="btn" id="flipBtn">Virar o cartão</button></div><div class="flash-meta">${i + 1} de ${cards.length} · ${esc(v.group)}</div></div>`;
      const fc = $("#fc"); let flipped = false;
      const flip = () => { if (flipped) return; flipped = true; fc.classList.add("flip"); $("#fa").innerHTML = `<button class="btn bad" id="noBtn">Não sabia</button><button class="btn ok" id="yesBtn">Sabia</button>`;
        $("#yesBtn").onclick = () => grade(true); $("#noBtn").onclick = () => grade(false); };
      fc.onclick = flip; $("#flipBtn").onclick = flip;
      const grade = ok => { const k = vkey(y, v.word); const st = S.vocab[k] || { b: 0, t: 0 }; st.b = ok ? Math.min(3, (st.b || 0) + 1) : 0; st.t = Date.now(); S.vocab[k] = st; if (ok) known++; i++; save(); show(); };
    };
    show();
  };
};

// ---------- Praticar ----------
VIEWS.praticar = (main, D) => {
  const y = D.year;
  const sources = [
    { id: "at", name: "Lições: áreas temáticas", get: () => D.decks.filter(d => d.section === "Áreas Temáticas").flatMap(d => deckExercises(d).map(e => ({ e, from: `Lição ${d.n}: ${d.title}` }))) },
    { id: "ci", name: "Lições: intercultural", get: () => D.decks.filter(d => d.section === "Competência Intercultural").flatMap(d => deckExercises(d).map(e => ({ e, from: `Lição ${d.n}: ${d.title}` }))) },
    { id: "gr", name: "Lições: gramática", get: () => D.decks.filter(d => d.section === "Gramática").flatMap(d => deckExercises(d).map(e => ({ e, from: `Lição ${d.n}: ${d.title}` }))) },
    { id: "fc", name: "Fichas: compreensão", get: () => D.fichas.flatMap(f => (f.comprehension || []).map(e => ({ e, from: `Ficha ${f.num}: ${f.title}` }))) },
    { id: "fg", name: "Fichas: gramática", get: () => D.fichas.flatMap(f => (f.grammar || []).map(e => ({ e, from: `Ficha ${f.num}: ${f.title}` }))) },
  ];
  let sel = new Set(["at", "ci", "gr", "fg"]); let count = 5; let noOpen = true;
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › Praticar</div><h1>Praticar</h1><p class="lead">Uma sessão com exercícios escolhidos ao acaso. Os que nunca fizeste ou erraste aparecem primeiro.</p>
    <div class="slide" id="setup"><h2>Sessão</h2>
      <div class="row" id="src">${sources.map(s => `<button class="chip ${sel.has(s.id) ? "on" : ""}" data-s="${s.id}">${esc(s.name)}</button>`).join("")}</div>
      <div class="row" style="margin-top:14px"><span class="muted small">Número de exercícios:</span>${[5, 10, 15].map(n => `<button class="chip ${n === count ? "on" : ""}" data-n="${n}">${n}</button>`).join("")}</div>
      <div class="row" style="margin-top:10px"><button class="chip on" id="noOpen">Só exercícios com correção automática</button></div>
      <div class="ex-actions"><button class="btn primary" id="startBtn">Começar</button></div></div>
    <div id="area"></div>`;
  $("#src").onclick = e => { const b = e.target.closest("button"); if (!b) return; b.classList.toggle("on"); if (b.classList.contains("on")) sel.add(b.dataset.s); else sel.delete(b.dataset.s); };
  $$("[data-n]", main).forEach(b => b.onclick = () => { count = +b.dataset.n; $$("[data-n]", main).forEach(x => x.classList.toggle("on", x === b)); });
  $("#noOpen").onclick = () => { noOpen = !noOpen; $("#noOpen").classList.toggle("on", noOpen); };
  $("#startBtn").onclick = () => {
    let pool = sources.filter(s => sel.has(s.id)).flatMap(s => s.get());
    if (noOpen) pool = pool.filter(x => x.e.kind !== "open");
    if (!pool.length) { toast("Escolhe pelo menos uma fonte."); return; }
    const scored = pool.map(x => { const st = S.ex[x.e.id]; const pr = st ? st.best * 2 + st.last + st.n * 0.05 : -1; return { x, s: pr + Math.random() * 0.8 }; });
    scored.sort((a, b) => a.s - b.s);
    const list = scored.slice(0, count).map(z => z.x);
    let i = 0, score = 0, total = 0;
    $("#setup").style.display = "none";
    const area = $("#area");
    const step = () => {
      if (i >= list.length) {
        S.sessions.unshift({ d: today(), y, s: score, t: total }); if (S.sessions.length > 30) S.sessions.length = 30; markDay(); save();
        const p = pct(score, total);
        area.innerHTML = `<div class="slide result-big"><b>${p}%</b><p>${score} de ${total} respostas certas. ${p >= 85 ? "Fantástico!" : p >= 70 ? "Bem!" : p >= 50 ? "Mais ou menos. Repete as lições onde erraste." : "Vale a pena rever a matéria e voltar a tentar."}</p><div class="flash-actions"><button class="btn primary" id="again">Nova sessão</button><a class="btn" href="#/${y}/progresso">Ver progresso</a></div></div>`;
        $("#again").onclick = () => { $("#setup").style.display = ""; area.innerHTML = ""; };
        return;
      }
      const { e, from } = list[i];
      area.innerHTML = `<div class="practice-progress"><span>${i + 1} / ${list.length}</span><div class="bar acc"><i style="width:${pct(i, list.length)}%"></i></div><span>${esc(from)}</span></div><div id="exh"></div><div class="ex-actions"><button class="btn primary" id="nextBtn" disabled>Seguinte →</button></div>`;
      let got = false;
      $("#exh").appendChild(buildExercise(e, { title: e.title || "", onResult: (s, t) => { if (!got) { got = true; score += s; total += t; $("#nextBtn").disabled = false; } else { /* override ajusta a contagem */ score += 1; } } }));
      $("#nextBtn").onclick = () => { i++; step(); };
    };
    step();
  };
};

// ---------- Progresso ----------
VIEWS.progresso = (main, D) => {
  const y = D.year;
  const exAll = D.decks.flatMap(d => deckExercises(d)).concat(D.fichas.flatMap(f => fichaExercises(f)));
  const itemIds = Object.keys(S.items).filter(k => k.startsWith("d" + y + "-") || k.startsWith("f" + y + "-"));
  const answered = itemIds.length;
  const accs = itemIds.map(itemAcc).filter(x => x != null);
  const acc = accs.length ? Math.round(100 * accs.reduce((a, b) => a + b, 0) / accs.length) : 0;
  const days = Object.keys(S.days).sort();
  let streak = 0; { const d = new Date(); for (;;) { const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); if (S.days[k]) { streak++; d.setDate(d.getDate() - 1); } else break; } }
  const chRead = D.story ? D.story.chapters.filter((c, i) => S.chapters[`${y}-${i + 1}`]).length : 0;
  function grade(p) { return p >= 85 ? ["Fantástico", "ok"] : p >= 70 ? ["Bem", "ok"] : p >= 50 ? ["Mais ou menos", "warn"] : ["Rever", "bad"]; }
  const rows = D.decks.map(d => { const exs = deckExercises(d); const done = exs.filter(e => S.ex[e.id]); const avg = done.length ? Math.round(100 * done.reduce((a, e) => a + S.ex[e.id].best, 0) / done.length) : null; return { label: `${d.n}. ${d.title}`, sub: d.section, done: done.length, total: exs.length, avg, href: `#/${y}/licao/${d.n}` }; })
    .concat(D.fichas.map(f => { const exs = fichaExercises(f); const done = exs.filter(e => S.ex[e.id]); const avg = done.length ? Math.round(100 * done.reduce((a, e) => a + S.ex[e.id].best, 0) / done.length) : null; return { label: `Ficha ${f.num}. ${f.title}`, sub: "Ficha", done: done.length, total: exs.length, avg, href: `#/${y}/ficha/${f.num}` }; }));
  main.innerHTML = `<div class="breadcrumb"><a href="#/${y}">${ord(y)}</a> › Progresso</div><h1>Progresso</h1>
    <div class="stats">
      <div class="stat"><b>${D.decks.filter(d => S.decks[d.id]).length}/${D.decks.length}</b><span>lições concluídas</span></div>
      <div class="stat"><b>${exAll.filter(e => S.ex[e.id]).length}/${exAll.length}</b><span>exercícios feitos</span></div>
      <div class="stat"><b>${acc}%</b><span>respostas certas (${answered} itens)</span></div>
      <div class="stat"><b>${chRead}/9</b><span>capítulos lidos</span></div>
      <div class="stat"><b>${D.fichas.filter(f => S.fichas[`${y}-${f.num}`]).length}/${D.fichas.length}</b><span>fichas concluídas</span></div>
      <div class="stat"><b>${streak}</b><span>dias seguidos a estudar (${days.length} no total)</span></div>
    </div>
    <h2>Por lição e ficha</h2><div class="slide">${rows.map(r => { const g = r.avg == null ? null : grade(r.avg); return `<div class="prog-row"><a href="${r.href}" style="color:inherit;text-decoration:none">${esc(r.label)}<br><span class="muted small">${esc(r.sub)} · ${r.done}/${r.total} exercícios</span></a><div class="bar"><i style="width:${pct(r.done, r.total)}%"></i></div><span>${g ? `<span class="badge ${g[1]}">${r.avg}%</span>` : ""}</span></div>`; }).join("")}</div>
    <h2>Últimas sessões de prática</h2>${S.sessions.filter(s => s.y === y).length ? `<ul class="sessions">${S.sessions.filter(s => s.y === y).slice(0, 10).map(s => `<li>${esc(s.d)} · ${s.s}/${s.t} certas (${pct(s.s, s.t)}%)</li>`).join("")}</ul>` : `<p class="muted">Ainda não fizeste nenhuma sessão em <a href="#/${y}/praticar">Praticar</a>.</p>`}
    <h2>Dados</h2><p class="muted small">O progresso fica guardado neste navegador. Para o teres em qualquer dispositivo, entra com a tua conta no menu lateral.</p>
    <button class="btn bad sm" id="reset">Apagar o progresso deste ano</button>`;
  $("#reset").onclick = () => {
    if (!confirm(`Apagar todo o progresso do ${ord(y)}? Isto não pode ser desfeito.`)) return;
    const pre = ["d" + y + "-", "f" + y + "-"];
    Object.keys(S.items).forEach(k => { if (pre.some(p => k.startsWith(p))) delete S.items[k]; });
    Object.keys(S.ex).forEach(k => { if (pre.some(p => k.startsWith(p))) delete S.ex[k]; });
    Object.keys(S.decks).forEach(k => { if (k.startsWith(y + "-")) delete S.decks[k]; });
    Object.keys(S.chapters).forEach(k => { if (k.startsWith(y + "-")) delete S.chapters[k]; });
    Object.keys(S.fichas).forEach(k => { if (k.startsWith(y + "-")) delete S.fichas[k]; });
    Object.keys(S.vocab).forEach(k => { if (k.startsWith(y + ":")) delete S.vocab[k]; });
    S.sessions = S.sessions.filter(s => s.y !== y);
    save(); toast("Progresso apagado."); render();
  };
};

// ---------- Arranque ----------
window.addEventListener("hashchange", render);
if (!location.hash && S.year) location.hash = "#/" + S.year;
render();

if (window.Account && Account.init) {
  Account.init({
    section: "ing",
    keys: [KEY],
    mount: "#user-slot",
    label: "Inglês",
    accent: "#1f6b52",
    isEmpty: function (slice) {
      try {
        const st = JSON.parse(slice[KEY] || "{}");
        const has = o => o && Object.keys(o).length > 0;
        return !(has(st.ex) || has(st.items) || has(st.decks) || has(st.chapters) || has(st.fichas) || has(st.vocab) || (st.sessions && st.sessions.length));
      } catch (e) { return true; }
    }
  });
}
