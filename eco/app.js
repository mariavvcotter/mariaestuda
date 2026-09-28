/* ============================================================
   mariaestuda.eu/eco — aplicação
   ------------------------------------------------------------
   Sem dependências nem compilação. Rotas pelo #:
     #inicio  #resumos  #resumo/u3  #treino  #quiz  #noticias  #admin
   A conta é a partilhada do site (/account/, Nome + PIN, opcional):
   o progresso vive em localStorage['eco_prog'] e o account.js
   sincroniza-o. O Supabase só é chamado aqui para os resumos abertos
   e para a Gestão (ver schema.sql).
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.ECO_CONFIG || {};
  var CONTA = window.MARIAESTUDA_CONFIG || {};
  CFG.url = CFG.url || CONTA.SUPABASE_URL;
  CFG.chave = CFG.chave || CONTA.SUPABASE_ANON_KEY;
  var UNIDADES = window.ECO_UNIDADES || [];
  var RESUMOS = window.ECO_RESUMOS || {};
  var PERGUNTAS = window.ECO_PERGUNTAS || [];
  var NOTICIAS = window.ECO_NOTICIAS || [];

  var UNI = {};
  UNIDADES.forEach(function (u) { UNI[u.id] = u; });
  var PERG_POR_UNI = {};
  PERGUNTAS.forEach(function (q) { (PERG_POR_UNI[q.u] = PERG_POR_UNI[q.u] || []).push(q); });

  var app = document.getElementById('app');

  /* ---------- estado ---------- */
  var S = {
    remoto: true,          // a base de dados responde?
    admin: null,           // palavra-passe da administradora (só em memória/sessão)
    prog: { r: {} },       // progresso do aluno
    abertas: [],           // unidades com resumo aberto
    quiz: null,
    treino: { unidades: [], n: 10, soErradas: false },
    filtroNoticias: 'todas',
  };

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function baralhar(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function ls(k, v) {
    try {
      if (arguments.length === 1) return JSON.parse(localStorage.getItem(k));
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function ss(k, v) {
    try {
      if (arguments.length === 1) return sessionStorage.getItem(k);
      if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('mostra');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('mostra'); }, 2600);
  }
  function dataPT(iso) {
    if (!iso) return '';
    var d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function ir(h) { if (location.hash === '#' + h) render(); else location.hash = h; }

  /* ---------- base de dados (RPC) ---------- */
  function rpc(fn, args) {
    if (!CFG.url || !CFG.chave) return Promise.reject({ rede: true });
    return fetch(CFG.url.replace(/\/+$/, '') + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { apikey: CFG.chave, Authorization: 'Bearer ' + CFG.chave, 'Content-Type': 'application/json' },
      body: JSON.stringify(args || {}),
    }).then(function (r) {
      return r.text().then(function (txt) {
        var body = null;
        try { body = txt ? JSON.parse(txt) : null; } catch (e) { body = txt; }
        if (!r.ok) throw { status: r.status, msg: (body && body.message) || 'Erro ' + r.status };
        return body;
      });
    }, function () { throw { rede: true }; });
  }

  /* ---------- progresso e níveis ----------
     prog.r[idPergunta] = [últimaCerta (0/1), tentativas, certas, timestamp] */
  function statsUnidade(uid, prog) {
    var qs = PERG_POR_UNI[uid] || [];
    var r = (prog && prog.r) || {};
    var resp = 0, certas = 0;
    qs.forEach(function (q) { var x = r[q.id]; if (x) { resp++; if (x[0]) certas++; } });
    return { total: qs.length, resp: resp, certas: certas };
  }
  /* A nota de uma unidade olha para a ÚLTIMA resposta a cada pergunta, para
     quem erra e depois aprende subir de nível. «Fantástico» exige também ter
     passado pela maior parte das perguntas: acertar 5 em 5 não é dominar. */
  function nivel(st) {
    var minimo = Math.min(5, st.total || 5);
    if (!st.total || st.resp < minimo) return { k: 'zero', t: 'Por avaliar', e: '⚪', ord: 0 };
    var acc = st.certas / st.resp, cob = st.resp / st.total;
    if (acc < 0.5) return { k: 'mal', t: 'Mal', e: '🔴', ord: 1, acc: acc, cob: cob };
    if (acc < 0.7) return { k: 'meh', t: 'Mais ou menos', e: '🟠', ord: 2, acc: acc, cob: cob };
    if (acc < 0.9 || cob < 0.8) return { k: 'bem', t: 'Bem', e: '🟢', ord: 3, acc: acc, cob: cob };
    return { k: 'top', t: 'Fantástico', e: '🌟', ord: 4, acc: acc, cob: cob };
  }
  function nivelHTML(n) { return '<span class="nivel ' + n.k + '">' + n.e + ' ' + n.t + '</span>'; }

  var CHAVE_PROG = 'eco_prog';   // a chave que o account.js sincroniza
  function lerProgresso() {
    var p = ls(CHAVE_PROG);
    return p && typeof p === 'object' && p.r ? p : { r: {} };
  }
  function gravar() {
    // setItem direto: o account.js interceta-o e envia para a conta
    try { localStorage.setItem(CHAVE_PROG, JSON.stringify(S.prog)); } catch (e) {}
  }
  function nomeConta() { return window.Account && Account.user ? Account.user() : null; }

  /* ---------- resumos abertos ---------- */
  function carregarAbertas() {
    return rpc('eco_desbloqueadas').then(function (a) {
      S.remoto = true; S.abertas = a || [];
    }, function () {
      S.remoto = false; S.abertas = CFG.desbloqueadasSemBD || [];
    });
  }

  /* ============================================================
     ECRÃS
     ============================================================ */
  function marcarNav(sec) {
    [].forEach.call(document.querySelectorAll('#nav a'), function (a) {
      a.classList.toggle('ativo', a.getAttribute('data-sec') === sec);
      if (a.getAttribute('data-sec') === sec) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.getElementById('nav-admin').hidden = !S.admin;
  }

  /* ---------- entrada da professora ---------- */
  function vEntrarAdmin() {
    app.innerHTML =
      '<div class="entrada-caixa" style="margin:24px auto">' +
      '<img class="entrada-logo" src="icone.svg" alt="">' +
      '<h1 style="text-align:center">Área da professora</h1>' +
      '<p class="sub" style="text-align:center">Abrir resumos e acompanhar o progresso dos alunos.</p>' +
      (S.remoto ? '' : '<p class="aviso">Sem ligação à base de dados. Vê o eco/README.md.</p>') +
      '<form id="f"><label class="rotulo" for="c">Palavra-passe</label>' +
      '<input id="c" type="password" autocomplete="current-password" required>' +
      '<p class="erro" id="err"></p><button class="btn largo" type="submit">Entrar na gestão</button></form></div>';
    var f = document.getElementById('f'), c = document.getElementById('c'), err = document.getElementById('err');
    c.focus();
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var btn = f.querySelector('button'); btn.disabled = true; err.textContent = '';
      var v = c.value;
      rpc('eco_admin', { p_senha: v, p_acao: 'verificar' }).then(function () {
        S.admin = v; ss('eco_admin', v); render();
      }, function (e) {
        err.textContent = e && e.rede ? 'Sem ligação. Tenta outra vez daqui a pouco.' : (e && e.msg) || 'Não foi possível entrar.';
      }).then(function () { btn.disabled = false; });
    };
  }

  /* ---------- início (painel de progresso) ---------- */
  function vInicio() {
    var niveis = UNIDADES.map(function (u) { return nivel(statsUnidade(u.id, S.prog)); });
    var bons = niveis.filter(function (n) { return n.ord >= 3; }).length;
    var cont = { top: 0, bem: 0, meh: 0, mal: 0, zero: 0 };
    niveis.forEach(function (n) { cont[n.k]++; });
    var pct = Math.round(100 * bons / (UNIDADES.length || 1));
    var totalResp = Object.keys(S.prog.r || {}).length;
    var frase = bons === UNIDADES.length ? 'Todas as unidades em Bem ou Fantástico. Impecável!'
      : totalResp === 0 ? 'Ainda não respondeste a nenhuma pergunta. Começa por uma unidade que já deste nas aulas.'
      : 'Estás Bem ou Fantástico em ' + bons + ' de ' + UNIDADES.length + ' unidades.';
    var fracas = UNIDADES.filter(function (u, i) { return niveis[i].ord === 1 || niveis[i].ord === 2; }).map(function (u) { return u.id; });

    var nome = nomeConta();
    var h = '<h1>Olá' + (nome ? ', ' + esc(nome.split(' ')[0]) : '') + ' 👋</h1>' +
      '<p class="sub">O teu progresso em Economia A.</p>' +
      (nome ? '' : '<p class="aviso">Estás como convidado: o progresso fica só neste aparelho. ' +
        '<button class="link-inline" id="entrar-conta">Entra ou cria conta</button> para o guardares em qualquer lado.</p>') +
      '<div class="cartao resumo-geral">' +
      '<div class="anel" style="--p:' + pct + '"><div><div><strong>' + bons + '/' + UNIDADES.length + '</strong><small>unidades</small></div></div></div>' +
      '<div><p class="frase-geral">' + frase + '</p><div class="contagem">' +
      (cont.top ? nivelHTML({ k: 'top', e: '🌟', t: cont.top + ' Fantástico' }) : '') +
      (cont.bem ? nivelHTML({ k: 'bem', e: '🟢', t: cont.bem + ' Bem' }) : '') +
      (cont.meh ? nivelHTML({ k: 'meh', e: '🟠', t: cont.meh + ' Mais ou menos' }) : '') +
      (cont.mal ? nivelHTML({ k: 'mal', e: '🔴', t: cont.mal + ' Mal' }) : '') +
      '</div></div></div>' +
      '<div class="linha-btns" style="margin-top:14px">' +
      (fracas.length ? '<button class="btn" id="treinar-fracas">Treinar as mais fracas</button>' : '') +
      '<a class="btn ' + (fracas.length ? 'sec' : '') + '" href="#treino">Escolher o que treinar</a></div>';

    [10, 11].forEach(function (ano) {
      h += '<p class="ano-titulo">' + ano + '.º ano</p><div class="unidades">';
      UNIDADES.forEach(function (u, i) {
        if (u.ano !== ano) return;
        var st = statsUnidade(u.id, S.prog), n = niveis[i];
        var pc = st.total ? Math.round(100 * st.resp / st.total) : 0;
        h += '<button class="uni" style="--c:' + u.cor + '" data-treinar="' + u.id + '">' +
          '<span class="uni-icone">' + u.icone + '</span><span>' +
          '<span class="uni-num">Unidade ' + u.num + '</span>' +
          '<span class="uni-titulo" style="display:block">' + esc(u.titulo) + '</span>' +
          '<span class="uni-meta">' + nivelHTML(n) +
          '<span class="barra" title="Perguntas feitas"><i style="width:' + pc + '%"></i></span>' +
          '<span class="uni-info">' + st.resp + '/' + st.total + (st.resp ? ' · ' + Math.round(100 * st.certas / st.resp) + '% certas' : '') + '</span>' +
          '</span></span></button>';
      });
      h += '</div>';
    });
    h += '<p class="sub" style="margin-top:18px;font-size:13.5px">Como se calcula: conta a tua última resposta a cada pergunta. ' +
      '🔴 Mal: menos de 50% certas · 🟠 Mais ou menos: 50–69% · 🟢 Bem: 70% ou mais · 🌟 Fantástico: 90% ou mais e já passaste por pelo menos 80% das perguntas da unidade. ' +
      'Precisas de responder a 5 perguntas de uma unidade para ela ser avaliada.</p>';
    h += '<p style="text-align:center;margin-top:28px"><a class="link-discreto" href="#admin">Área da professora</a></p>';
    app.innerHTML = h;
    var ec = document.getElementById('entrar-conta');
    if (ec) ec.onclick = function () { if (window.Account) Account.open(); };
    var tf = document.getElementById('treinar-fracas');
    if (tf) tf.onclick = function () { comecarQuiz(fracas, 10, false); };
    [].forEach.call(app.querySelectorAll('[data-treinar]'), function (b) {
      b.onclick = function () { S.treino.unidades = [b.getAttribute('data-treinar')]; ir('treino'); };
    });
  }

  /* ---------- resumos ---------- */
  function aberta(uid) { return !!S.admin || S.abertas.indexOf(uid) >= 0; }
  function vResumos() {
    var h = '<h1>Resumos</h1><p class="sub">' + (S.admin
      ? 'Vês todas as unidades. Os alunos só veem as que abriste na Gestão.'
      : 'A professora vai abrindo as unidades à medida que forem dadas nas aulas.') + '</p>';
    [10, 11].forEach(function (ano) {
      h += '<p class="ano-titulo">' + ano + '.º ano</p><div class="unidades">';
      UNIDADES.forEach(function (u) {
        if (u.ano !== ano) return;
        var ok = aberta(u.id);
        h += '<a class="uni' + (ok ? '' : ' fechada') + '" style="--c:' + u.cor + '" href="#resumo/' + u.id + '">' +
          '<span class="uni-icone">' + (ok ? u.icone : '🔒') + '</span><span>' +
          '<span class="uni-num">Unidade ' + u.num + (S.admin && S.abertas.indexOf(u.id) < 0 ? ' · fechada aos alunos' : '') + '</span>' +
          '<span class="uni-titulo" style="display:block">' + esc(u.titulo) + '</span>' +
          (ok ? '' : '<span class="uni-info">Ainda não disponível</span>') +
          '</span></a>';
      });
      h += '</div>';
    });
    app.innerHTML = h;
  }
  function vResumo(uid) {
    var u = UNI[uid];
    if (!u) return ir('resumos');
    var h = '<a class="voltar" href="#resumos">← Resumos</a>' +
      '<div class="cabeca-uni" style="--c:' + u.cor + '"><span class="uni-num">' + u.icone + ' Unidade ' + u.num + ' · ' + u.ano + '.º ano</span>' +
      '<h1>' + esc(u.titulo) + (S.admin && S.abertas.indexOf(uid) < 0 ? '<span class="tag-admin">Fechada aos alunos</span>' : '') + '</h1></div>';
    if (!aberta(uid)) {
      h += '<div class="cartao fechado-msg"><div class="grande">🔒</div><p><strong>Este resumo ainda não está disponível.</strong></p>' +
        '<p class="sub">Entretanto, podes treinar os exercícios desta unidade.</p>' +
        '<button class="btn" id="treinar-uni">Treinar a unidade ' + u.num + '</button></div>';
    } else {
      h += '<article class="cartao texto">' + (RESUMOS[uid] || '<p class="vazio">Resumo em preparação.</p>') + '</article>' +
        '<div class="linha-btns" style="margin-top:16px"><button class="btn" id="treinar-uni">Treinar esta unidade</button>' +
        '<a class="btn sec" href="#noticias/' + uid + '">Notícias desta unidade</a></div>';
    }
    app.innerHTML = h;
    document.getElementById('treinar-uni').onclick = function () { comecarQuiz([uid], 10, false); };
    window.scrollTo(0, 0);
  }

  /* ---------- escolher treino ---------- */
  function vTreino() {
    var T = S.treino;
    if (!T.unidades.length) T.unidades = UNIDADES.map(function (u) { return u.id; });
    var todas = T.unidades.length === UNIDADES.length;
    var h = '<h1>Treinar</h1><p class="sub">Escolhe as unidades. As perguntas e as opções aparecem sempre por ordem diferente.</p>' +
      '<div class="chips" style="margin-bottom:12px">' +
      '<button class="chip" id="sel-todas" aria-pressed="' + todas + '">Todas</button>' +
      '<button class="chip" id="sel-10">Só 10.º ano</button><button class="chip" id="sel-11">Só 11.º ano</button>' +
      '<button class="chip" id="sel-nada">Limpar</button></div>' +
      '<div class="escolha-uni">';
    UNIDADES.forEach(function (u) {
      var n = nivel(statsUnidade(u.id, S.prog));
      h += '<label><input type="checkbox" value="' + u.id + '"' + (T.unidades.indexOf(u.id) >= 0 ? ' checked' : '') + '>' +
        '<span class="t">' + u.icone + ' ' + esc(u.titulo) + '<small>Unidade ' + u.num + ' · ' + (PERG_POR_UNI[u.id] || []).length + ' perguntas</small></span>' +
        nivelHTML(n) + '</label>';
    });
    h += '</div><h2>Quantas perguntas?</h2><div class="opcoes-linha">';
    [10, 20, 40, 0].forEach(function (n) {
      h += '<button class="chip" data-n="' + n + '" aria-pressed="' + (T.n === n) + '">' + (n || 'Todas') + '</button>';
    });
    h += '</div><label class="interruptor"><input type="checkbox" id="so-erradas"' + (T.soErradas ? ' checked' : '') + '> Só as que errei da última vez</label>' +
      '<div class="fixo-baixo"><button class="btn largo" id="comecar">Começar</button></div><p class="erro" id="err"></p>';
    app.innerHTML = h;

    function ler() {
      T.unidades = [].map.call(app.querySelectorAll('.escolha-uni input:checked'), function (i) { return i.value; });
      document.getElementById('sel-todas').setAttribute('aria-pressed', T.unidades.length === UNIDADES.length);
      document.getElementById('comecar').disabled = !T.unidades.length;
    }
    function marcar(fn) {
      [].forEach.call(app.querySelectorAll('.escolha-uni input'), function (i) { i.checked = fn(UNI[i.value]); });
      ler();
    }
    [].forEach.call(app.querySelectorAll('.escolha-uni input'), function (i) { i.onchange = ler; });
    document.getElementById('sel-todas').onclick = function () { marcar(function () { return true; }); };
    document.getElementById('sel-10').onclick = function () { marcar(function (u) { return u.ano === 10; }); };
    document.getElementById('sel-11').onclick = function () { marcar(function (u) { return u.ano === 11; }); };
    document.getElementById('sel-nada').onclick = function () { marcar(function () { return false; }); };
    [].forEach.call(app.querySelectorAll('[data-n]'), function (b) {
      b.onclick = function () {
        T.n = +b.getAttribute('data-n');
        [].forEach.call(app.querySelectorAll('[data-n]'), function (x) { x.setAttribute('aria-pressed', x === b); });
      };
    });
    document.getElementById('so-erradas').onchange = function () { T.soErradas = this.checked; };
    document.getElementById('comecar').onclick = function () {
      if (!comecarQuiz(T.unidades, T.n, T.soErradas))
        document.getElementById('err').textContent = T.soErradas
          ? 'Não há perguntas erradas nestas unidades. Desliga «Só as que errei» ou escolhe outras.'
          : 'Ainda não há perguntas para estas unidades.';
    };
    ler();
  }

  /* ---------- quiz ---------- */
  function comecarQuiz(unidades, n, soErradas) {
    var pool = PERGUNTAS.filter(function (q) {
      if (unidades.indexOf(q.u) < 0) return false;
      if (soErradas) { var x = S.prog.r[q.id]; return x && !x[0]; }
      return true;
    });
    if (!pool.length) return false;
    // Primeiro as que nunca fez, depois as restantes; cada grupo baralhado.
    var novas = baralhar(pool.filter(function (q) { return !S.prog.r[q.id]; }));
    var feitas = baralhar(pool.filter(function (q) { return S.prog.r[q.id]; }));
    var lista = n ? baralhar(novas.concat(feitas).slice(0, n)) : baralhar(pool);
    S.quiz = {
      itens: lista.map(function (q) {
        var ordem = baralhar(q.o.map(function (_, i) { return i; }));
        return { q: q, ordem: ordem, escolha: null };
      }),
      i: 0,
    };
    ir('quiz');
    return true;
  }
  function vQuiz() {
    var Q = S.quiz;
    if (!Q) return ir('treino');
    if (Q.i >= Q.itens.length) return vResultado();
    var it = Q.itens[Q.i], q = it.q, u = UNI[q.u], respondida = it.escolha !== null;
    var letras = 'ABCD';
    var h = '<div class="quiz-topo"><button class="sair-quiz" id="sair" aria-label="Terminar">✕</button>' +
      '<span class="barra"><i style="width:' + Math.round(100 * Q.i / Q.itens.length) + '%"></i></span>' +
      '<span class="contador">' + (Q.i + 1) + ' / ' + Q.itens.length + '</span></div>' +
      '<div class="cartao"><div class="q-uni" style="--c:' + u.cor + '">' + u.icone + ' Unidade ' + u.num + ' · ' + esc(u.titulo) + '</div>' +
      '<p class="q-enunciado">' + esc(q.p) + '</p><div class="opcoes">';
    it.ordem.forEach(function (orig, pos) {
      var cls = '';
      if (respondida) {
        if (orig === q.c) cls = ' certa';
        else if (orig === it.escolha) cls = ' errada';
        else cls = ' apagada';
      }
      h += '<button class="opcao' + cls + '" data-o="' + orig + '"' + (respondida ? ' disabled' : '') + '>' +
        '<span class="letra">' + letras[pos] + '</span><span>' + esc(q.o[orig]) + '</span></button>';
    });
    h += '</div>';
    if (respondida) {
      var ok = it.escolha === q.c;
      h += '<div class="feedback ' + (ok ? 'ok' : 'ko') + '" role="status"><strong>' + (ok ? '✅ Certo!' : '❌ Não é esta.') + '</strong>' +
        '<p>' + esc(q.e) + '</p></div>' +
        '<button class="btn largo" id="seguinte" style="margin-top:14px">' + (Q.i + 1 < Q.itens.length ? 'Seguinte →' : 'Ver resultado') + '</button>';
    }
    h += '</div>';
    app.innerHTML = h;
    document.getElementById('sair').onclick = function () {
      var feitas = Q.itens.filter(function (x) { return x.escolha !== null; }).length;
      if (!feitas || confirm('Terminar agora? As respostas que já deste ficam guardadas.')) {
        Q.itens = Q.itens.filter(function (x) { return x.escolha !== null; });
        Q.i = Q.itens.length;
        if (Q.itens.length) vResultado(); else { S.quiz = null; ir('treino'); }
      }
    };
    if (respondida) {
      var seg = document.getElementById('seguinte');
      seg.onclick = function () { Q.i++; vQuiz(); window.scrollTo(0, 0); };
      seg.focus({ preventScroll: true });
      document.querySelector('.feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      [].forEach.call(app.querySelectorAll('.opcao'), function (b) {
        b.onclick = function () {
          it.escolha = +b.getAttribute('data-o');
          var certa = it.escolha === q.c ? 1 : 0;
          var ant = S.prog.r[q.id] || [0, 0, 0, 0];
          S.prog.r[q.id] = [certa, ant[1] + 1, ant[2] + certa, Date.now()];
          gravar();
          vQuiz();
        };
      });
    }
  }
  function vResultado() {
    var Q = S.quiz, certas = 0, porUni = {};
    Q.itens.forEach(function (it) {
      var ok = it.escolha === it.q.c; if (ok) certas++;
      var p = porUni[it.q.u] = porUni[it.q.u] || { c: 0, t: 0 }; p.t++; if (ok) p.c++;
    });
    var pct = Math.round(100 * certas / Q.itens.length);
    var emoji = pct >= 90 ? '🌟' : pct >= 70 ? '🎉' : pct >= 50 ? '💪' : '📚';
    var msg = pct >= 90 ? 'Fantástico!' : pct >= 70 ? 'Muito bem!' : pct >= 50 ? 'Vais no bom caminho.' : 'Revê o resumo e tenta outra vez.';
    var h = '<div class="cartao resultado"><div class="grande">' + emoji + '</div><div class="nota">' + certas + ' / ' + Q.itens.length + '</div>' +
      '<p><strong>' + msg + '</strong> (' + pct + '% certas)</p><table class="tabela-res">';
    Object.keys(porUni).sort(function (a, b) { return UNI[a].num - UNI[b].num; }).forEach(function (uid) {
      var u = UNI[uid], p = porUni[uid];
      h += '<tr><td>' + u.icone + ' ' + esc(u.titulo) + '</td><td>' + p.c + '/' + p.t + '</td><td>' + nivelHTML(nivel(statsUnidade(uid, S.prog))) + '</td></tr>';
    });
    h += '</table></div>';
    var erradas = Q.itens.filter(function (it) { return it.escolha !== it.q.c; });
    if (erradas.length) {
      h += '<h2>Rever as que erraste</h2><div class="revisao">';
      erradas.forEach(function (it) {
        h += '<details><summary>' + esc(it.q.p) + '</summary><p>✅ <strong>' + esc(it.q.o[it.q.c]) + '</strong></p>' +
          '<p>❌ Respondeste: ' + esc(it.q.o[it.escolha]) + '</p><p>' + esc(it.q.e) + '</p></details>';
      });
      h += '</div>';
    }
    h += '<div class="linha-btns" style="margin-top:18px">' +
      (erradas.length ? '<button class="btn" id="refazer">Refazer as erradas</button>' : '') +
      '<a class="btn sec" href="#treino">Novo treino</a><a class="btn fraco" href="#inicio">Ver progresso</a></div>';
    app.innerHTML = h;
    var r = document.getElementById('refazer');
    if (r) r.onclick = function () {
      S.quiz = { itens: baralhar(erradas).map(function (it) { return { q: it.q, ordem: baralhar(it.ordem), escolha: null }; }), i: 0 };
      vQuiz(); window.scrollTo(0, 0);
    };
    window.scrollTo(0, 0);
  }

  /* ---------- notícias ---------- */
  function vNoticias(filtro) {
    if (filtro) S.filtroNoticias = filtro;
    var f = S.filtroNoticias;
    var lista = NOTICIAS.filter(function (n) { return f === 'todas' || n.u === f; })
      .sort(function (a, b) { return (b.data || '').localeCompare(a.data || ''); });
    var h = '<h1>Notícias</h1><p class="sub">Notícias do Público e do Observador, com um resumo e uma proposta de análise à luz de cada unidade.</p>' +
      '<div class="filtro"><button class="chip" data-f="todas" aria-pressed="' + (f === 'todas') + '">Todas</button>';
    UNIDADES.forEach(function (u) {
      var n = NOTICIAS.filter(function (x) { return x.u === u.id; }).length;
      if (n) h += '<button class="chip" data-f="' + u.id + '" aria-pressed="' + (f === u.id) + '">' + u.icone + ' U' + u.num + '</button>';
    });
    h += '</div>';
    if (f !== 'todas' && UNI[f]) h += '<p style="margin:0 0 12px;font-weight:600">Unidade ' + UNI[f].num + ' · ' + esc(UNI[f].titulo) + '</p>';
    h += '<div class="noticias">';
    if (!lista.length) h += '<p class="vazio">Ainda não há notícias para esta unidade.</p>';
    lista.forEach(function (n) {
      var u = UNI[n.u] || UNIDADES[0];
      h += '<article class="noticia"><div class="noticia-img" style="--c:' + u.cor + '">' +
        (n.imagem
          ? '<img src="' + esc(n.imagem) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">'
          : '') +
        '<div class="ilustra-fundo"></div><span class="ilustra" aria-hidden="true">' + u.icone + '</span>' +
        '<span class="noticia-fonte">' + esc(n.fonte) + '</span></div>' +
        '<div class="noticia-corpo"><div class="noticia-meta"><span>' + esc(dataPT(n.data)) + '</span>' +
        '<span>· Unidade ' + u.num + '</span></div>' +
        '<h3>' + esc(n.titulo) + '</h3><p>' + esc(n.resumo) + '</p>' +
        '<div class="analise"><b>Como analisar à luz da unidade ' + u.num + '</b><p>' + esc(n.analise) + '</p></div>' +
        (n.conceitos && n.conceitos.length ? '<div class="conceitos">' + n.conceitos.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>' : '') +
        '<a class="ler" href="' + esc(n.url) + '" target="_blank" rel="noopener">Ler a notícia no ' + esc(n.fonte) + ' ↗</a>' +
        '</div></article>';
    });
    h += '</div>';
    app.innerHTML = h;
    // Uma foto que carregue tapa a ilustração; se falhar, a ilustração fica.
    [].forEach.call(app.querySelectorAll('.noticia-img img'), function (img) {
      img.addEventListener('load', function () {
        img.style.position = 'absolute'; img.style.inset = '0'; img.style.zIndex = '1';
      });
    });
    [].forEach.call(app.querySelectorAll('[data-f]'), function (b) {
      b.onclick = function () { var v = b.getAttribute('data-f'); ir(v === 'todas' ? 'noticias' : 'noticias/' + v); };
    });
  }

  /* ---------- gestão (administradora) ---------- */
  function admin(acao, dados) { return rpc('eco_admin', { p_senha: S.admin, p_acao: acao, p_dados: dados || {} }); }
  function vAdmin() {
    if (!S.admin) return vEntrarAdmin();
    var h = '<h1>Gestão</h1><p class="sub">Abre os resumos, cria os perfis e acompanha o progresso de cada aluno.</p>' +
      '<h2>Resumos abertos aos alunos</h2><div class="escolha-uni" id="abertas">';
    UNIDADES.forEach(function (u) {
      h += '<label><input type="checkbox" value="' + u.id + '"' + (S.abertas.indexOf(u.id) >= 0 ? ' checked' : '') + '>' +
        '<span class="t">' + u.icone + ' ' + esc(u.titulo) + '<small>Unidade ' + u.num + ' · ' + u.ano + '.º ano</small></span><span></span></label>';
    });
    h += '</div><button class="btn largo" id="guardar-abertas" style="margin-top:12px">Guardar</button>' +
      '<h2>Alunos</h2><p class="sub" style="font-size:13.5px">Aparece quem já estudou Economia com conta iniciada (a conta do site, Nome + PIN).</p>' +
      '<div id="alunos"><p class="vazio">A carregar…</p></div>' +
      '<button class="btn fraco largo" id="sair-admin" style="margin-top:22px">Sair da área da professora</button>';
    app.innerHTML = h;

    document.getElementById('sair-admin').onclick = function () {
      S.admin = null; ss('eco_admin', null); ir('inicio');
    };
    document.getElementById('guardar-abertas').onclick = function () {
      var sel = [].map.call(app.querySelectorAll('#abertas input:checked'), function (i) { return i.value; });
      admin('desbloquear', { unidades: sel }).then(function () { S.abertas = sel; toast('Guardado. Os alunos já veem estes resumos.'); },
        function (e) { toast(e.msg || 'Não foi possível guardar.'); });
    };
    carregarAlunos();
  }
  function carregarAlunos() {
    admin('listar').then(function (lista) {
      lista = lista || [];
      var el = document.getElementById('alunos');
      if (!el) return;
      if (!lista.length) { el.innerHTML = '<p class="vazio">Ainda nenhum aluno estudou Economia com conta iniciada.</p>'; return; }
      var h = '';
      lista.forEach(function (a) {
        var prog = { r: {} };
        try { var raw = a.eco && a.eco[CHAVE_PROG]; var p = typeof raw === 'string' ? JSON.parse(raw) : raw; if (p && p.r) prog = p; } catch (e) {}
        var ns = UNIDADES.map(function (u) { return { u: u, n: nivel(statsUnidade(u.id, prog)) }; });
        var bons = ns.filter(function (x) { return x.n.ord >= 3; }).length;
        var resp = Object.keys(prog.r).length;
        h += '<div class="aluno"><div class="aluno-cabeca"><strong>' + esc(a.nome) + '</strong>' +
          (a.atualizado_em ? '<small>última atividade ' + new Date(a.atualizado_em).toLocaleDateString('pt-PT') + '</small>' : '') + '</div>' +
          '<div class="uni-info">' + bons + '/' + UNIDADES.length + ' unidades em Bem ou Fantástico · ' + resp + ' perguntas feitas</div>' +
          '<div class="aluno-niveis">' + ns.map(function (x) {
            return '<span class="nivel ' + x.n.k + '" title="' + esc(x.u.titulo) + ': ' + x.n.t + '">U' + x.u.num + ' ' + x.n.e + '</span>';
          }).join('') + '</div></div>';
      });
      el.innerHTML = h;
    }, function (e) {
      var el = document.getElementById('alunos');
      if (el) el.innerHTML = '<p class="aviso">' + esc(e.rede ? 'Sem ligação à base de dados.' : e.msg) + '</p>';
    });
  }

  /* ============================================================
     ROTAS
     ============================================================ */
  function render() {
    var h = (location.hash || '').replace(/^#/, '');
    var partes = h.split('/'), sec = partes[0] || 'inicio';
    if (sec !== 'quiz' && S.quiz && S.quiz.i >= S.quiz.itens.length) S.quiz = null;
    marcarNav(sec === 'resumo' ? 'resumos' : sec === 'quiz' ? 'treino' : sec);
    switch (sec) {
      case 'inicio': vInicio(); break;
      case 'resumos': vResumos(); break;
      case 'resumo': vResumo(partes[1]); break;
      case 'treino': vTreino(); break;
      case 'quiz': vQuiz(); break;
      case 'noticias': vNoticias(partes[1] || 'todas'); break;
      case 'admin': if (S.admin) vAdmin(); else vEntrarAdmin(); break;
      default: return ir('inicio');
    }
    if (sec !== 'quiz') window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  // arranque: a conta partilhada, os resumos abertos, a sessão da professora
  S.prog = lerProgresso();
  if (window.Account) {
    Account.init({ section: 'eco', keys: [CHAVE_PROG], mount: '#user-slot', label: 'Economia A', accent: '#F2B544', accentInk: '#14505C' });
  }
  app.innerHTML = '<p class="vazio">A carregar…</p>';
  carregarAbertas().then(function () {
    var senha = ss('eco_admin');
    if (senha && S.remoto) {
      return rpc('eco_admin', { p_senha: senha, p_acao: 'verificar' })
        .then(function () { S.admin = senha; }, function () { ss('eco_admin', null); });
    }
  }).then(render);
})();
