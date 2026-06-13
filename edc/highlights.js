/* ============================================================
   EDC — Highlights nos Resumos + notas (desenho SVG / texto)
   ------------------------------------------------------------
   • Modo marcador: selecionar texto cria um highlight; enquanto
     o modo estiver ligado, qualquer seleção fica marcada.
   • Cada highlight abre uma caixa para escrever à mão (Apple
     Pencil / rato / dedo) — guardada em SVG — ou escrever texto.
   • Clicar num highlight mostra a nota + apagar nota / apagar tudo.
   • Persistido em localStorage 'edc_highlights' (sincronizado
     pela conta partilhada — ver edc/app.js Account.init).
   ============================================================ */
(function () {
  'use strict';

  var ROOT_SEL = '#resumos';
  var STORAGE_KEY = 'edc_highlights';
  var COLORS = ['#ffe98a', '#a5d8ff', '#b2f2bb', '#ffc9c9', '#e5c8ff'];
  var PEN_COLORS = ['#1a1a1a', '#2563eb', '#dc2626', '#16a34a'];

  var markerMode = false;
  var currentColor = COLORS[0];
  var highlights = loadStore();

  /* ---------------- estilos ---------------- */
  var CSS = `
  mark.edchl-mark{background:var(--edchl-c,#ffe98a);color:#1a1a1a;border-radius:3px;padding:0 1px;cursor:pointer;position:relative;-webkit-box-decoration-break:clone;box-decoration-break:clone}
  mark.edchl-mark.edchl-has-note{box-shadow:inset 0 -2px 0 rgba(0,0,0,.45)}
  mark.edchl-mark.edchl-has-note::after{content:"✎";font-size:.7em;vertical-align:super;margin-left:1px;opacity:.6}
  .edchl-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:0 0 22px;padding:12px 16px;background:var(--card-bg,#fff);border:1.5px solid rgba(0,0,0,.08);border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);font-size:.9rem}
  .edchl-toggle{display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer;font:inherit;font-weight:800;padding:9px 16px;border-radius:999px;background:#e9e9e9;color:#555;transition:.15s}
  .edchl-toggle.on{background:#f5a623;color:#fff;box-shadow:0 4px 14px rgba(245,166,35,.4)}
  .edchl-swatches{display:flex;gap:6px;align-items:center}
  .edchl-swatch{width:22px;height:22px;border-radius:50%;border:2px solid rgba(0,0,0,.15);cursor:pointer}
  .edchl-swatch.sel{border-color:#333;transform:scale(1.15)}
  .edchl-hint{color:#999;font-weight:600;font-size:.8rem}
  .edchl-floatbtn{position:absolute;z-index:9000;transform:translate(-50%,-100%);border:none;cursor:pointer;background:#f5a623;color:#fff;font-weight:800;font-size:.85rem;padding:7px 14px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.25);font-family:inherit}
  .edchl-floatbtn::after{content:"";position:absolute;left:50%;top:100%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#f5a623}
  .edchl-overlay{position:fixed;inset:0;z-index:99990;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(20,22,28,.55);backdrop-filter:blur(3px)}
  .edchl-overlay.open{display:flex}
  .edchl-modal{width:100%;max-width:560px;background:#fff;color:#222;border-radius:20px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
  .edchl-modal h3{font-size:1.15rem;margin:0 0 14px;color:#333}
  .edchl-tabs{display:flex;gap:8px;margin-bottom:12px}
  .edchl-tab{flex:1;border:1.5px solid #e3e3e3;background:#faf9f7;border-radius:10px;padding:9px;font:inherit;font-weight:700;cursor:pointer;color:#666}
  .edchl-tab.sel{background:#4a9b8e;color:#fff;border-color:#4a9b8e}
  .edchl-pane{display:none}
  .edchl-pane.sel{display:block}
  .edchl-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
  .edchl-pen{width:26px;height:26px;border-radius:50%;border:2px solid rgba(0,0,0,.15);cursor:pointer}
  .edchl-pen.sel{border-color:#333;transform:scale(1.12)}
  .edchl-tbtn{border:1.5px solid #ddd;background:#fff;border-radius:9px;padding:7px 12px;cursor:pointer;font:inherit;font-weight:700;color:#555}
  .edchl-tbtn:hover{background:#f3f3f3}
  .edchl-canvaswrap{border:1.5px dashed #cdcdcd;border-radius:12px;background:#fffef9;overflow:hidden}
  .edchl-canvas{display:block;width:100%;height:48vh;max-height:420px;touch-action:none;cursor:crosshair}
  .edchl-ta{width:100%;min-height:160px;border:1.5px solid #e3e3e3;border-radius:12px;padding:12px;font:inherit;font-size:1rem;resize:vertical}
  .edchl-foot{display:flex;justify-content:flex-end;gap:10px;margin-top:14px}
  .edchl-btn{border:none;cursor:pointer;font:inherit;font-weight:800;padding:11px 18px;border-radius:11px}
  .edchl-btn.primary{background:#4a9b8e;color:#fff}
  .edchl-btn.ghost{background:#eee;color:#555}
  .edchl-btn.danger{background:#fdeaea;color:#c0392b}
  .edchl-pop{position:absolute;z-index:9500;width:260px;background:#fff;color:#222;border-radius:14px;box-shadow:0 16px 44px rgba(0,0,0,.28);padding:14px;font-size:.9rem}
  .edchl-pop .note-view{border:1px solid #eee;border-radius:10px;padding:8px;margin-bottom:12px;max-height:220px;overflow:auto;background:#fffef9}
  .edchl-pop .note-view svg{max-width:100%;height:auto;display:block}
  .edchl-pop .note-view .txt{white-space:pre-wrap;line-height:1.5}
  .edchl-pop .empty{color:#999;font-weight:600;text-align:center;padding:10px}
  .edchl-pop .acts{display:flex;flex-direction:column;gap:7px}
  .edchl-pop .acts button{width:100%;border:none;cursor:pointer;font:inherit;font-weight:700;padding:9px;border-radius:9px}
  `;

  /* ---------------- arranque ---------------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  var root, floatBtn, overlay, pop;

  function init() {
    root = document.querySelector(ROOT_SEL);
    if (!root) return;
    injectCSS(CSS);
    buildToolbar();
    buildFloatBtn();
    applyAll();

    // seleção de texto
    document.addEventListener('mouseup', onSelectEnd);
    document.addEventListener('touchend', onSelectEnd);
    document.addEventListener('selectionchange', function () {
      var s = window.getSelection();
      if (!s || s.isCollapsed) hideFloatBtn();
    });
    // clique num highlight
    root.addEventListener('click', function (e) {
      var m = e.target.closest && e.target.closest('mark.edchl-mark');
      if (m) { e.preventDefault(); openPopover(m.dataset.hlId, m); }
    });
    document.addEventListener('click', function (e) {
      if (pop && pop.style.display === 'block' && !pop.contains(e.target) && !(e.target.closest && e.target.closest('mark.edchl-mark'))) hidePopover();
    });
    window.addEventListener('scroll', hidePopover, true);
  }

  /* ---------------- armazenamento ---------------- */
  function loadStore() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
  function saveStore() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights)); } catch (e) {} }
  function genId() { return 'h_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* ---------------- blocos / offsets ---------------- */
  function blocks() { return Array.prototype.slice.call(root.querySelectorAll('.resumo-block')); }
  function closestBlock(node) {
    var el = (node.nodeType === 1) ? node : node.parentElement;
    return el ? el.closest('.resumo-block') : null;
  }
  function textOffset(block, container, offset) {
    var total = 0, walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null), n;
    while ((n = walker.nextNode())) {
      if (n === container) return total + offset;
      total += n.nodeValue.length;
    }
    // container é um elemento: soma até ele
    return total;
  }

  /* ---------------- aplicar highlights ao DOM ---------------- */
  function applyAll() {
    var bl = blocks();
    highlights.slice().sort(function (a, b) { return a.block - b.block || a.start - b.start; })
      .forEach(function (h) { if (bl[h.block]) wrap(bl[h.block], h); });
  }
  function wrap(block, h) {
    var segs = [], total = 0;
    var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null), n;
    while ((n = walker.nextNode())) {
      var len = n.nodeValue.length, ns = total, ne = total + len;
      total = ne;
      var from = Math.max(h.start, ns), to = Math.min(h.end, ne);
      if (to > from) segs.push({ node: n, from: from - ns, to: to - ns });
    }
    segs.forEach(function (s) { wrapPortion(s.node, s.from, s.to, h); });
  }
  function wrapPortion(textNode, from, to, h) {
    var v = textNode.nodeValue;
    var before = v.slice(0, from), mid = v.slice(from, to), after = v.slice(to);
    var mark = document.createElement('mark');
    mark.className = 'edchl-mark' + (h.note ? ' edchl-has-note' : '');
    mark.dataset.hlId = h.id;
    mark.style.setProperty('--edchl-c', h.color || COLORS[0]);
    mark.textContent = mid;
    var frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));
    frag.appendChild(mark);
    if (after) frag.appendChild(document.createTextNode(after));
    textNode.parentNode.replaceChild(frag, textNode);
  }
  function unwrap(id) {
    root.querySelectorAll('mark.edchl-mark[data-hl-id="' + id + '"]').forEach(function (m) {
      var t = document.createTextNode(m.textContent);
      var p = m.parentNode; p.replaceChild(t, m); p.normalize();
    });
  }
  function refreshNoteFlag(id) {
    var h = byId(id), has = !!(h && h.note);
    root.querySelectorAll('mark.edchl-mark[data-hl-id="' + id + '"]').forEach(function (m) {
      m.classList.toggle('edchl-has-note', has);
    });
  }
  function byId(id) { for (var i = 0; i < highlights.length; i++) if (highlights[i].id === id) return highlights[i]; return null; }

  /* ---------------- seleção → highlight ---------------- */
  function onSelectEnd() {
    setTimeout(function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) { hideFloatBtn(); return; }
      var range = sel.getRangeAt(0);
      var block = closestBlock(range.commonAncestorContainer);
      if (!block || !root.contains(block)) { hideFloatBtn(); return; }
      if (markerMode) { createHighlight(sel, range, block); }
      else { showFloatBtn(range); }
    }, 10);
  }
  function createHighlight(sel, range, block) {
    var bl = blocks(), idx = bl.indexOf(block);
    var start = textOffset(block, range.startContainer, range.startOffset);
    var end = textOffset(block, range.endContainer, range.endOffset);
    if (end <= start) { sel.removeAllRanges(); return; }
    var h = { id: genId(), block: idx, start: start, end: end, color: currentColor, note: null };
    highlights.push(h); saveStore();
    wrap(block, h);
    sel.removeAllRanges();
    hideFloatBtn();
    openEditor(h.id);
  }

  /* ---------------- botão flutuante ---------------- */
  function buildFloatBtn() {
    floatBtn = document.createElement('button');
    floatBtn.className = 'edchl-floatbtn';
    floatBtn.textContent = '✏️ Marcar';
    floatBtn.style.display = 'none';
    floatBtn.addEventListener('click', function () {
      markerMode = true; updateToggleUI();
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      var range = sel.getRangeAt(0), block = closestBlock(range.commonAncestorContainer);
      if (block) createHighlight(sel, range, block);
    });
    document.body.appendChild(floatBtn);
  }
  function showFloatBtn(range) {
    var r = range.getBoundingClientRect();
    floatBtn.style.display = 'block';
    floatBtn.style.left = (window.scrollX + r.left + r.width / 2) + 'px';
    floatBtn.style.top = (window.scrollY + r.top - 8) + 'px';
  }
  function hideFloatBtn() { if (floatBtn) floatBtn.style.display = 'none'; }

  /* ---------------- toolbar ---------------- */
  function buildToolbar() {
    var wrapEl = root.querySelector('.content-wrap') || root;
    var bar = document.createElement('div');
    bar.className = 'edchl-toolbar';
    var sw = COLORS.map(function (c, i) {
      return '<span class="edchl-swatch' + (i === 0 ? ' sel' : '') + '" data-c="' + c + '" style="background:' + c + '"></span>';
    }).join('');
    bar.innerHTML =
      '<button class="edchl-toggle" type="button">✏️ Modo marcador: <span class="edchl-state">desligado</span></button>' +
      '<span class="edchl-swatches">' + sw + '</span>' +
      '<span class="edchl-hint">Seleciona texto para marcar. Cada marca abre uma nota (caneta ou texto).</span>';
    var firstTitle = wrapEl.querySelector('.section-subtitle') || wrapEl.querySelector('.section-title');
    if (firstTitle && firstTitle.nextSibling) wrapEl.insertBefore(bar, firstTitle.nextSibling);
    else wrapEl.insertBefore(bar, wrapEl.firstChild);

    bar.querySelector('.edchl-toggle').addEventListener('click', function () {
      markerMode = !markerMode; updateToggleUI();
    });
    bar.querySelectorAll('.edchl-swatch').forEach(function (s) {
      s.addEventListener('click', function () {
        currentColor = s.dataset.c;
        bar.querySelectorAll('.edchl-swatch').forEach(function (x) { x.classList.remove('sel'); });
        s.classList.add('sel');
      });
    });
    toolbarEl = bar;
  }
  var toolbarEl;
  function updateToggleUI() {
    if (!toolbarEl) return;
    var t = toolbarEl.querySelector('.edchl-toggle');
    t.classList.toggle('on', markerMode);
    toolbarEl.querySelector('.edchl-state').textContent = markerMode ? 'LIGADO' : 'desligado';
  }

  /* ---------------- editor de nota (desenho / texto) ---------------- */
  var drawPad = null;
  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'edchl-overlay';
    overlay.innerHTML =
      '<div class="edchl-modal">' +
        '<h3>Nota do highlight</h3>' +
        '<div class="edchl-tabs">' +
          '<button class="edchl-tab sel" data-pane="draw" type="button">✏️ Desenho</button>' +
          '<button class="edchl-tab" data-pane="text" type="button">📝 Texto</button>' +
        '</div>' +
        '<div class="edchl-pane sel" data-pane="draw">' +
          '<div class="edchl-tools">' +
            PEN_COLORS.map(function (c, i) { return '<span class="edchl-pen' + (i === 0 ? ' sel' : '') + '" data-c="' + c + '" style="background:' + c + '"></span>'; }).join('') +
            '<button class="edchl-tbtn" data-act="thin" type="button">• fino</button>' +
            '<button class="edchl-tbtn" data-act="thick" type="button">⬤ grosso</button>' +
            '<button class="edchl-tbtn" data-act="undo" type="button">↶ anular</button>' +
            '<button class="edchl-tbtn" data-act="clear" type="button">🗑 limpar</button>' +
          '</div>' +
          '<div class="edchl-canvaswrap"><svg class="edchl-canvas"></svg></div>' +
        '</div>' +
        '<div class="edchl-pane" data-pane="text">' +
          '<textarea class="edchl-ta" placeholder="Escreve a tua nota…"></textarea>' +
        '</div>' +
        '<div class="edchl-foot">' +
          '<button class="edchl-btn ghost" data-act="cancel" type="button">Cancelar</button>' +
          '<button class="edchl-btn primary" data-act="save" type="button">Guardar nota</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeEditor(); });
    overlay.querySelectorAll('.edchl-tab').forEach(function (tb) {
      tb.addEventListener('click', function () { selectPane(tb.dataset.pane); });
    });
    overlay.querySelector('[data-act="cancel"]').addEventListener('click', closeEditor);
  }
  function selectPane(name) {
    overlay.querySelectorAll('.edchl-tab').forEach(function (t) { t.classList.toggle('sel', t.dataset.pane === name); });
    overlay.querySelectorAll('.edchl-pane').forEach(function (p) { p.classList.toggle('sel', p.dataset.pane === name); });
  }

  function openEditor(id) {
    ensureOverlay();
    var h = byId(id);
    var ta = overlay.querySelector('.edchl-ta');
    ta.value = (h && h.note && h.note.type === 'text') ? h.note.text : '';
    selectPane(h && h.note && h.note.type === 'text' ? 'text' : 'draw');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var svg = overlay.querySelector('.edchl-canvas');
    drawPad = makeDrawPad(svg, h && h.note && h.note.type === 'draw' ? h.note.svg : null);
    setupTools();
    var saveBtn = overlay.querySelector('[data-act="save"]');
    saveBtn.onclick = function () { saveNote(id); };
  }
  function setupTools() {
    overlay.querySelectorAll('.edchl-pen').forEach(function (p) {
      p.onclick = function () {
        overlay.querySelectorAll('.edchl-pen').forEach(function (x) { x.classList.remove('sel'); });
        p.classList.add('sel'); drawPad.setColor(p.dataset.c);
      };
    });
    overlay.querySelector('[data-act="thin"]').onclick = function () { drawPad.setWidth(2); };
    overlay.querySelector('[data-act="thick"]').onclick = function () { drawPad.setWidth(6); };
    overlay.querySelector('[data-act="undo"]').onclick = function () { drawPad.undo(); };
    overlay.querySelector('[data-act="clear"]').onclick = function () { drawPad.clear(); };
  }
  function saveNote(id) {
    var h = byId(id); if (!h) { closeEditor(); return; }
    var activePane = overlay.querySelector('.edchl-tab.sel').dataset.pane;
    if (activePane === 'text') {
      var txt = overlay.querySelector('.edchl-ta').value.trim();
      h.note = txt ? { type: 'text', text: txt } : null;
    } else {
      var svgStr = drawPad.isEmpty() ? null : drawPad.getSVG();
      h.note = svgStr ? { type: 'draw', svg: svgStr } : null;
    }
    saveStore(); refreshNoteFlag(id); closeEditor();
  }
  function closeEditor() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (drawPad) { drawPad.destroy(); drawPad = null; }
  }

  /* ---------------- popover (ver / apagar) ---------------- */
  function openPopover(id, markEl) {
    hideFloatBtn();
    var h = byId(id); if (!h) return;
    if (!pop) {
      pop = document.createElement('div');
      pop.className = 'edchl-pop';
      document.body.appendChild(pop);
    }
    var view;
    if (h.note && h.note.type === 'draw') view = '<div class="note-view">' + h.note.svg + '</div>';
    else if (h.note && h.note.type === 'text') view = '<div class="note-view"><div class="txt">' + esc(h.note.text) + '</div></div>';
    else view = '<div class="empty">Sem nota ainda.</div>';
    pop.innerHTML = view +
      '<div class="acts">' +
        '<button class="edchl-btn primary" data-a="edit">' + (h.note ? '✏️ Editar nota' : '➕ Adicionar nota') + '</button>' +
        (h.note ? '<button class="edchl-btn ghost" data-a="delnote">🗑 Apagar nota</button>' : '') +
        '<button class="edchl-btn danger" data-a="delhl">❌ Apagar highlight</button>' +
      '</div>';
    var r = markEl.getBoundingClientRect();
    pop.style.display = 'block';
    var left = window.scrollX + r.left;
    var maxLeft = window.scrollX + document.documentElement.clientWidth - 272;
    pop.style.left = Math.max(8, Math.min(left, maxLeft)) + 'px';
    pop.style.top = (window.scrollY + r.bottom + 8) + 'px';
    pop.querySelector('[data-a="edit"]').onclick = function () { hidePopover(); openEditor(id); };
    var dn = pop.querySelector('[data-a="delnote"]');
    if (dn) dn.onclick = function () { h.note = null; saveStore(); refreshNoteFlag(id); hidePopover(); };
    pop.querySelector('[data-a="delhl"]').onclick = function () {
      unwrap(id);
      highlights = highlights.filter(function (x) { return x.id !== id; });
      saveStore(); hidePopover();
    };
  }
  function hidePopover() { if (pop) pop.style.display = 'none'; }

  /* ---------------- bloco de desenho (SVG) ---------------- */
  function makeDrawPad(svg, existingSvg) {
    var NS = 'http://www.w3.org/2000/svg';
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var w = svg.clientWidth || 500, hgt = svg.clientHeight || 360;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + hgt);
    var stack = [];
    if (existingSvg) {
      var tmp = document.createElement('div'); tmp.innerHTML = existingSvg;
      var old = tmp.querySelector('svg');
      if (old) Array.prototype.slice.call(old.querySelectorAll('path')).forEach(function (p) {
        var np = document.createElementNS(NS, 'path');
        np.setAttribute('d', p.getAttribute('d') || '');
        np.setAttribute('stroke', p.getAttribute('stroke') || '#1a1a1a');
        np.setAttribute('stroke-width', p.getAttribute('stroke-width') || '3');
        np.setAttribute('fill', 'none'); np.setAttribute('stroke-linecap', 'round'); np.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(np); stack.push(np);
      });
    }
    var color = '#1a1a1a', width = 3, drawing = false, pts = [], cur = null;
    function pt(e) {
      var rect = svg.getBoundingClientRect();
      return [Math.round((e.clientX - rect.left) * 10) / 10, Math.round((e.clientY - rect.top) * 10) / 10];
    }
    function down(e) {
      e.preventDefault(); drawing = true; pts = [pt(e)];
      var wv = width * (e.pressure && e.pointerType === 'pen' ? (0.6 + e.pressure) : 1);
      cur = document.createElementNS(NS, 'path');
      cur.setAttribute('stroke', color); cur.setAttribute('stroke-width', (Math.round(wv * 10) / 10));
      cur.setAttribute('fill', 'none'); cur.setAttribute('stroke-linecap', 'round'); cur.setAttribute('stroke-linejoin', 'round');
      cur.setAttribute('d', 'M' + pts[0][0] + ' ' + pts[0][1]);
      svg.appendChild(cur); stack.push(cur);
    }
    function move(e) {
      if (!drawing) return; e.preventDefault();
      var p = pt(e); pts.push(p);
      cur.setAttribute('d', cur.getAttribute('d') + ' L' + p[0] + ' ' + p[1]);
    }
    function up(e) { if (drawing) { e.preventDefault(); drawing = false; cur = null; } }
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return {
      setColor: function (c) { color = c; },
      setWidth: function (x) { width = x; },
      undo: function () { var p = stack.pop(); if (p && p.parentNode) p.parentNode.removeChild(p); },
      clear: function () { stack.forEach(function (p) { if (p.parentNode) p.parentNode.removeChild(p); }); stack = []; },
      isEmpty: function () { return svg.querySelectorAll('path').length === 0; },
      getSVG: function () {
        var paths = Array.prototype.map.call(svg.querySelectorAll('path'), function (p) { return p.outerHTML; }).join('');
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + hgt + '" width="' + w + '" height="' + hgt + '">' + paths + '</svg>';
      },
      destroy: function () { svg.removeEventListener('pointerdown', down); svg.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); }
    };
  }

  /* ---------------- util ---------------- */
  function injectCSS(css) { var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

})();
