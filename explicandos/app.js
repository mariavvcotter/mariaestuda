/* ============================================================
   mariaestuda — Explicandos
   ------------------------------------------------------------
   Sem passo de compilação e sem dependências: fala diretamente
   com o Supabase por HTTP (GoTrue para o login, PostgREST para
   os dados), como o resto do site já faz.

   A ideia central: o saldo de cada aluno é medido em HORAS.
   Um pagamento acrescenta as horas que comprou; cada aula dada
   gasta as horas que durou. Um pack de 10h e uma aula avulsa
   paga na hora entram na mesma conta, sem casos especiais.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.EXPLICANDOS_CONFIG || {};
  var REST = CFG.SUPABASE_URL + '/rest/v1/';
  var AUTH = CFG.SUPABASE_URL + '/auth/v1/';
  var SESSION_KEY = 'explicandos.session';

  /* ---------- estado ---------- */
  var session = null;                       // { access_token, refresh_token, expires_at }
  var db = { alunos: [], aulas: [], pagamentos: [] };
  var tab = 'painel';

  /* ---------- atalhos ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function esc(s) { return (s == null ? '' : String(s)); }

  /* ---------- datas (sempre em hora local, nunca UTC) ---------- */
  function hoje() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function mesDe(iso) { return String(iso).slice(0, 7); }
  function mesAtual() { return hoje().slice(0, 7); }
  var MESES = ['janeiro','fevereiro','março','abril','maio','junho',
               'julho','agosto','setembro','outubro','novembro','dezembro'];
  function dataCurta(iso) {
    var p = String(iso).split('-');
    return p[2] + ' ' + MESES[Number(p[1]) - 1].slice(0, 3);
  }
  function mesLongo(ym) {
    var p = ym.split('-');
    return MESES[Number(p[1]) - 1] + ' de ' + p[0];
  }

  /* ---------- números ---------- */
  function eur(v) {
    return (Math.round(v * 100) / 100).toLocaleString('pt-PT', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    }) + ' €';
  }
  function horas(v) {
    var r = Math.round(v * 100) / 100;
    var sinal = r < 0 ? '\u2212' : '';           // menos tipográfico, não hífen
    var a = Math.abs(r);
    return sinal + (a % 1 === 0 ? String(a) : a.toLocaleString('pt-PT', { maximumFractionDigits: 2 })) + 'h';
  }

  /* ============================================================
     Sessão
     ============================================================ */
  function guardaSessao(s) {
    session = {
      access_token: s.access_token,
      refresh_token: s.refresh_token,
      // 60 s de margem, para não usar um token que expira a meio do pedido
      expires_at: Date.now() + (s.expires_in || 3600) * 1000 - 60000
    };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
  }
  function leSessao() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function limpaSessao() {
    session = null;
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function entrar(email, password) {
    return fetch(AUTH + 'token?grant_type=password', {
      method: 'POST',
      headers: { apikey: CFG.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error_description || j.msg || j.message || 'Não deu para entrar.');
        guardaSessao(j);
        return j;
      });
    });
  }

  function renova() {
    var s = session || leSessao();
    if (!s || !s.refresh_token) return Promise.reject(new Error('sem sessão'));
    return fetch(AUTH + 'token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: CFG.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    }).then(function (r) {
      if (!r.ok) throw new Error('sessão expirada');
      return r.json();
    }).then(function (j) { guardaSessao(j); return j; });
  }

  // Garante um token válido antes de cada pedido aos dados.
  function token() {
    if (session && session.expires_at > Date.now()) return Promise.resolve(session.access_token);
    return renova().then(function () { return session.access_token; });
  }

  /* ============================================================
     Dados (PostgREST)
     ============================================================ */
  function api(path, opts) {
    opts = opts || {};
    return token().then(function (t) {
      var headers = {
        apikey: CFG.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + t,
        'Content-Type': 'application/json'
      };
      if (opts.method === 'POST' || opts.method === 'PATCH') headers.Prefer = 'return=representation';
      return fetch(REST + path, {
        method: opts.method || 'GET',
        headers: headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined
      });
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.text().then(function (txt) {
        var j = null;
        try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
        if (!r.ok) {
          var msg = (j && (j.message || j.hint)) || ('Erro ' + r.status);
          if (r.status === 401 || r.status === 403) msg = 'Sem permissão — confirma o schema.sql e a sessão.';
          throw new Error(msg);
        }
        return j;
      });
    });
  }

  function carrega() {
    return Promise.all([
      api('exp_alunos?select=*&order=nome.asc'),
      api('exp_aulas?select=*&order=data.desc,created_at.desc'),
      api('exp_pagamentos?select=*&order=data.desc,created_at.desc')
    ]).then(function (r) {
      db.alunos = r[0] || [];
      db.aulas = r[1] || [];
      db.pagamentos = r[2] || [];
    });
  }

  /* ============================================================
     Contas
     ============================================================ */
  function aluno(id) {
    for (var i = 0; i < db.alunos.length; i++) if (db.alunos[i].id === id) return db.alunos[i];
    return null;
  }
  function nomeAluno(id) { var a = aluno(id); return a ? a.nome : '(aluno apagado)'; }

  // Saldo em horas: horas compradas menos horas consumidas.
  function saldoHoras(alunoId) {
    var compradas = 0, gastas = 0, i;
    for (i = 0; i < db.pagamentos.length; i++)
      if (db.pagamentos[i].aluno_id === alunoId) compradas += Number(db.pagamentos[i].horas_credito) || 0;
    for (i = 0; i < db.aulas.length; i++)
      if (db.aulas[i].aluno_id === alunoId && db.aulas[i].debita)
        gastas += (Number(db.aulas[i].duracao_min) || 0) / 60;
    return Math.round((compradas - gastas) * 100) / 100;
  }

  // O que está por cobrar: só as horas já dadas e ainda não pagas.
  function dividaEur(a) {
    var s = saldoHoras(a.id);
    return s < 0 ? -s * (Number(a.preco_hora) || 0) : 0;
  }

  function recebidoDe(alunoId) {
    var t = 0;
    for (var i = 0; i < db.pagamentos.length; i++)
      if (db.pagamentos[i].aluno_id === alunoId) t += Number(db.pagamentos[i].valor_eur) || 0;
    return t;
  }

  function aulasDe(alunoId) {
    return db.aulas.filter(function (x) { return x.aluno_id === alunoId; });
  }
  function pagamentosDe(alunoId) {
    return db.pagamentos.filter(function (x) { return x.aluno_id === alunoId; });
  }

  /* ============================================================
     Painel
     ============================================================ */
  function pintaPainel() {
    var ym = mesAtual(), i;

    var ativos = db.alunos.filter(function (a) { return a.ativo; });

    var hMes = 0;
    for (i = 0; i < db.aulas.length; i++) {
      var au = db.aulas[i];
      if (au.estado === 'dada' && mesDe(au.data) === ym) hMes += (Number(au.duracao_min) || 0) / 60;
    }

    var recMes = 0;
    for (i = 0; i < db.pagamentos.length; i++)
      if (mesDe(db.pagamentos[i].data) === ym) recMes += Number(db.pagamentos[i].valor_eur) || 0;

    var divida = 0;
    for (i = 0; i < db.alunos.length; i++) divida += dividaEur(db.alunos[i]);

    $('s-alunos').textContent = ativos.length;
    $('s-horas').textContent = horas(hMes);
    $('s-receita').textContent = eur(recMes);
    $('s-divida').textContent = eur(divida);

    /* --- quem precisa de atenção: a dever, ou com o pack quase no fim --- */
    var box = $('atencao');
    box.textContent = '';
    var aviso = ativos.map(function (a) {
      return { a: a, s: saldoHoras(a.id) };
    }).filter(function (x) {
      return x.s <= 1;
    }).sort(function (p, q) { return p.s - q.s; });

    if (!aviso.length) {
      box.appendChild(el('div', 'empty', ativos.length
        ? 'Nada a cobrar e nenhum pack a acabar. 🎉'
        : 'Ainda não há alunos. Começa pelo separador Alunos.'));
      return;
    }
    aviso.forEach(function (x) {
      box.appendChild(linhaAluno(x.a, x.s, function () { abreAluno(x.a.id); }));
    });

    /* --- últimas aulas --- */
    var ul = $('ultimas-aulas');
    ul.textContent = '';
    var ultimas = db.aulas.slice(0, 6);
    if (!ultimas.length) { ul.appendChild(el('li', '', 'Ainda não registaste nenhuma aula.')); return; }
    ultimas.forEach(function (au) { ul.appendChild(linhaAula(au, false)); });
  }

  /* ---------- linha de aluno reutilizada em vários sítios ---------- */
  function linhaAluno(a, s, onClick) {
    var estado = s < 0 ? 'debt' : (s <= 1 ? 'warn' : '');
    var b = el('button', 'row' + (a.ativo ? '' : ' inativo'));
    b.type = 'button';

    var av = el('div', 'avatar' + (estado ? ' ' + estado : ''), (a.nome || '?').trim().charAt(0).toUpperCase());
    b.appendChild(av);

    var main = el('div', 'main');
    main.appendChild(el('div', 'name', a.nome));
    var meta = [];
    if (a.ano) meta.push(a.ano);
    if (a.disciplinas) meta.push(a.disciplinas);
    meta.push(eur(a.preco_hora) + '/h');
    if (!a.ativo) meta.push('inativo');
    main.appendChild(el('div', 'meta', meta.join(' · ')));
    b.appendChild(main);

    var side = el('div', 'side');
    side.appendChild(el('div', 'saldo' + (estado ? ' ' + estado : ''), horas(s)));
    side.appendChild(el('div', 'saldo-l', s < 0 ? 'deve ' + eur(dividaEur(a)) : 'no pack'));
    b.appendChild(side);

    b.addEventListener('click', onClick);
    return b;
  }

  /* ============================================================
     Alunos
     ============================================================ */
  function pintaAlunos() {
    var box = $('lista-alunos');
    box.textContent = '';
    if (!db.alunos.length) {
      box.appendChild(el('div', 'empty', 'Sem alunos. Carrega em “Novo aluno”.'));
      return;
    }
    // Ativos primeiro; dentro de cada grupo, quem deve mais aparece em cima.
    db.alunos.slice().sort(function (p, q) {
      if (p.ativo !== q.ativo) return p.ativo ? -1 : 1;
      return saldoHoras(p.id) - saldoHoras(q.id);
    }).forEach(function (a) {
      box.appendChild(linhaAluno(a, saldoHoras(a.id), function () { abreAluno(a.id); }));
    });
  }

  /* ============================================================
     Aulas e pagamentos — listas
     ============================================================ */
  function linhaAula(au, comApagar, semNome) {
    var li = el('li');
    var left = el('div');
    left.appendChild(el('div', 'when', dataCurta(au.data) + (semNome ? '' : ' · ' + nomeAluno(au.aluno_id))));
    var det = [];
    det.push(horas((Number(au.duracao_min) || 0) / 60));
    det.push(au.modalidade);
    if (au.estado !== 'dada') det.push(au.estado + (au.debita ? ' (desconta)' : ' (não desconta)'));
    if (au.sumario) det.push(au.sumario);
    left.appendChild(el('div', 'what', det.join(' · ')));
    li.appendChild(left);

    var right = el('div', 'amt minus');
    right.textContent = au.debita ? '−' + horas((Number(au.duracao_min) || 0) / 60) : '—';
    li.appendChild(right);

    if (comApagar) right.appendChild(botaoApagar('exp_aulas', au.id, 'Apagar esta aula?'));
    return li;
  }

  function linhaPagamento(p, comApagar, semNome) {
    var li = el('li');
    var left = el('div');
    left.appendChild(el('div', 'when', dataCurta(p.data) + (semNome ? '' : ' · ' + nomeAluno(p.aluno_id))));
    var det = [];
    if (Number(p.horas_credito)) det.push('+' + horas(Number(p.horas_credito)));
    if (p.metodo) det.push(p.metodo);
    if (p.nota) det.push(p.nota);
    left.appendChild(el('div', 'what', det.join(' · ') || 'pagamento'));
    li.appendChild(left);

    var right = el('div', 'amt plus');
    right.textContent = eur(Number(p.valor_eur) || 0);
    li.appendChild(right);

    if (comApagar) right.appendChild(botaoApagar('exp_pagamentos', p.id, 'Apagar este pagamento?'));
    return li;
  }

  function botaoApagar(tabela, id, pergunta) {
    var b = el('button', 'del', '✕');
    b.type = 'button';
    b.title = 'Apagar';
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (!confirm(pergunta)) return;
      api(tabela + '?id=eq.' + encodeURIComponent(id), { method: 'DELETE' })
        .then(recarrega)
        .catch(falhou);
    });
    return b;
  }

  function pintaAulas() {
    var ul = $('lista-aulas');
    ul.textContent = '';
    if (!db.aulas.length) { ul.appendChild(el('li', '', 'Ainda sem aulas registadas.')); return; }
    db.aulas.slice(0, 60).forEach(function (au) { ul.appendChild(linhaAula(au, true)); });
  }

  function pintaDinheiro() {
    /* --- resumo por mês: o que entrou e quantas horas foram dadas --- */
    var porMes = {}, i, k;
    for (i = 0; i < db.pagamentos.length; i++) {
      k = mesDe(db.pagamentos[i].data);
      porMes[k] = porMes[k] || { eur: 0, h: 0 };
      porMes[k].eur += Number(db.pagamentos[i].valor_eur) || 0;
    }
    for (i = 0; i < db.aulas.length; i++) {
      if (db.aulas[i].estado !== 'dada') continue;
      k = mesDe(db.aulas[i].data);
      porMes[k] = porMes[k] || { eur: 0, h: 0 };
      porMes[k].h += (Number(db.aulas[i].duracao_min) || 0) / 60;
    }
    var ulM = $('meses');
    ulM.textContent = '';
    var chaves = Object.keys(porMes).sort().reverse().slice(0, 12);
    if (!chaves.length) ulM.appendChild(el('li', '', 'Ainda sem movimentos.'));
    chaves.forEach(function (ym) {
      var li = el('li');
      var left = el('div');
      left.appendChild(el('div', 'when', mesLongo(ym)));
      left.appendChild(el('div', 'what', horas(porMes[ym].h) + ' dadas'));
      li.appendChild(left);
      li.appendChild(el('div', 'amt plus', eur(porMes[ym].eur)));
      ulM.appendChild(li);
    });

    var ulP = $('lista-pagamentos');
    ulP.textContent = '';
    if (!db.pagamentos.length) { ulP.appendChild(el('li', '', 'Ainda sem pagamentos.')); return; }
    db.pagamentos.slice(0, 60).forEach(function (p) { ulP.appendChild(linhaPagamento(p, true)); });
  }

  /* ============================================================
     Ecrã de formulário
     ============================================================ */
  function abreSheet(titulo, construir) {
    var s = $('sheet');
    s.textContent = '';
    var top = el('div', 'sheet-top');
    var h = el('h2', '', titulo);
    var fechar = el('button', '', 'Fechar');
    fechar.type = 'button';
    fechar.addEventListener('click', fechaSheet);
    top.appendChild(h);
    top.appendChild(fechar);
    s.appendChild(top);

    var body = el('div', 'sheet-body');
    s.appendChild(body);
    construir(body);

    s.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function fechaSheet() {
    $('sheet').classList.add('hidden');
    $('sheet').textContent = '';
    document.body.style.overflow = '';
  }

  function campo(pai, etiqueta, input) {
    var d = el('div', 'field');
    if (etiqueta) {
      var l = el('label', '', etiqueta);
      if (input.id) l.htmlFor = input.id;
      d.appendChild(l);
    }
    d.appendChild(input);
    pai.appendChild(d);
    return input;
  }
  function inp(id, type, valor) {
    var i = el('input');
    i.id = id; i.type = type || 'text';
    if (valor != null) i.value = valor;
    return i;
  }
  function sel(id, opcoes, valor) {
    var s = el('select');
    s.id = id;
    opcoes.forEach(function (o) {
      var op = el('option', '', o.t);
      op.value = o.v;
      if (String(o.v) === String(valor)) op.selected = true;
      s.appendChild(op);
    });
    return s;
  }
  function opcoesAlunos(preSelecionado) {
    var lista = db.alunos.map(function (a) {
      return { v: a.id, t: a.nome + (a.ativo ? '' : ' (inativo)') };
    });
    // Sem aluno escolhido à partida, o browser escolheria o primeiro da lista
    // e a aula ia parar ao aluno errado. O marcador vazio obriga a escolher.
    if (!preSelecionado) lista.unshift({ v: '', t: '— escolhe o aluno —' });
    return lista;
  }

  /* ---------- ficha do aluno ---------- */
  function abreAluno(id) {
    var a = aluno(id);
    if (!a) return;
    abreSheet(a.nome, function (body) {
      var s = saldoHoras(a.id);

      var topo = el('div', 'card');
      var st = el('div', 'stats');
      st.style.marginBottom = '0';
      st.appendChild(mini(horas(s), s < 0 ? 'horas em dívida' : 'horas no pack', s < 0 ? 'debt' : (s <= 1 ? 'warn' : '')));
      st.appendChild(mini(eur(dividaEur(a)), 'por cobrar', dividaEur(a) > 0 ? 'debt' : ''));
      st.appendChild(mini(eur(recebidoDe(a.id)), 'recebido ao todo'));
      st.appendChild(mini(String(aulasDe(a.id).filter(function (x) { return x.estado === 'dada'; }).length), 'aulas dadas'));
      topo.appendChild(st);
      body.appendChild(topo);

      var info = el('div', 'card');
      info.appendChild(el('h3', '', 'Ficha'));
      linhaInfo(info, 'Ano', a.ano);
      linhaInfo(info, 'Disciplinas', a.disciplinas);
      linhaInfo(info, 'Modalidade', a.modalidade);
      linhaInfo(info, 'Preço', eur(a.preco_hora) + '/h · pack 10h ≈ ' + eur(a.preco_hora * 10));
      linhaInfo(info, 'Encarregado', a.encarregado);
      linhaInfo(info, 'Contacto', a.contacto);
      linhaInfo(info, 'Notas', a.notas);
      body.appendChild(info);

      var acoes = el('div', 'btn-row');
      acoes.style.marginBottom = '16px';
      acoes.appendChild(botao('Registar aula', 'btn', function () { formAula(a.id); }));
      acoes.appendChild(botao('Pagamento', 'btn amber', function () { formPagamento(a.id); }));
      body.appendChild(acoes);

      var hAulas = el('div', 'card');
      hAulas.appendChild(el('h3', '', 'Aulas'));
      var ua = el('ul', 'hist');
      var la = aulasDe(a.id);
      if (!la.length) ua.appendChild(el('li', '', 'Ainda sem aulas.'));
      la.slice(0, 40).forEach(function (au) { ua.appendChild(linhaAula(au, true, true)); });
      hAulas.appendChild(ua);
      body.appendChild(hAulas);

      var hPag = el('div', 'card');
      hPag.appendChild(el('h3', '', 'Pagamentos'));
      var up = el('ul', 'hist');
      var lp = pagamentosDe(a.id);
      if (!lp.length) up.appendChild(el('li', '', 'Ainda sem pagamentos.'));
      lp.slice(0, 40).forEach(function (p) { up.appendChild(linhaPagamento(p, true, true)); });
      hPag.appendChild(up);
      body.appendChild(hPag);

      var fim = el('div', 'btn-row');
      fim.appendChild(botao('Editar', 'btn ghost', function () { formAluno(a); }));
      fim.appendChild(botao(a.ativo ? 'Arquivar' : 'Reativar', 'btn ghost', function () {
        api('exp_alunos?id=eq.' + a.id, { method: 'PATCH', body: { ativo: !a.ativo } })
          .then(recarrega).then(fechaSheet).catch(falhou);
      }));
      body.appendChild(fim);

      var apagar = el('div', 'btn-row');
      apagar.style.marginTop = '10px';
      apagar.appendChild(botao('Apagar aluno e histórico', 'btn danger', function () {
        if (!confirm('Apagar ' + a.nome + ' e TODAS as aulas e pagamentos dele? Não dá para voltar atrás.')) return;
        api('exp_alunos?id=eq.' + a.id, { method: 'DELETE' })
          .then(recarrega).then(fechaSheet).catch(falhou);
      }));
      body.appendChild(apagar);
    });
  }

  function mini(n, l, estado) {
    var d = el('div', 'stat');
    d.appendChild(el('div', 'n' + (estado ? ' ' + estado : ''), n));
    d.appendChild(el('div', 'l', l));
    return d;
  }
  function linhaInfo(pai, etiqueta, valor) {
    if (!valor) return;
    var p = el('p');
    p.style.margin = '0 0 8px';
    p.style.fontSize = '.92rem';
    var b = el('strong', '', etiqueta + ': ');
    b.style.color = 'var(--text-light)';
    p.appendChild(b);
    p.appendChild(document.createTextNode(esc(valor)));
    pai.appendChild(p);
  }
  function botao(txt, cls, fn) {
    var b = el('button', cls, txt);
    b.type = 'button';
    b.addEventListener('click', fn);
    return b;
  }

  /* ---------- formulário de aluno ---------- */
  function formAluno(existente) {
    var a = existente || {};
    abreSheet(existente ? 'Editar ' + a.nome : 'Novo aluno', function (body) {
      var f = el('form');
      campo(f, 'Nome', inp('f-nome', 'text', a.nome || ''));
      campo(f, 'Ano de escolaridade', inp('f-ano', 'text', a.ano || ''));
      campo(f, 'Disciplinas', inp('f-disc', 'text', a.disciplinas || ''));

      var dois = el('div', 'fields-2');
      f.appendChild(dois);
      campo(dois, 'Modalidade', sel('f-mod', [
        { v: 'online', t: 'Online' }, { v: 'presencial', t: 'Presencial' }
      ], a.modalidade || 'online'));
      var preco = campo(dois, 'Preço por hora (€)', inp('f-preco', 'number', a.preco_hora != null ? a.preco_hora : 10));
      preco.step = '0.5'; preco.min = '0';

      campo(f, 'Encarregado de educação', inp('f-enc', 'text', a.encarregado || ''));
      campo(f, 'Contacto', inp('f-cont', 'text', a.contacto || ''));

      var notas = el('textarea');
      notas.id = 'f-notas';
      notas.value = a.notas || '';
      campo(f, 'Notas', notas);

      var erro = el('div', 'err');
      f.appendChild(erro);
      var gravar = el('button', 'btn', 'Gravar');
      gravar.type = 'submit';
      f.appendChild(gravar);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var nome = $('f-nome').value.trim();
        if (!nome) { erro.textContent = 'O nome é obrigatório.'; return; }
        var dados = {
          nome: nome,
          ano: $('f-ano').value.trim() || null,
          disciplinas: $('f-disc').value.trim() || null,
          modalidade: $('f-mod').value,
          preco_hora: Number($('f-preco').value) || 0,
          encarregado: $('f-enc').value.trim() || null,
          contacto: $('f-cont').value.trim() || null,
          notas: notas.value.trim() || null
        };
        gravar.disabled = true;
        var p = existente
          ? api('exp_alunos?id=eq.' + a.id, { method: 'PATCH', body: dados })
          : api('exp_alunos', { method: 'POST', body: dados });
        p.then(recarrega).then(fechaSheet).catch(function (e) {
          gravar.disabled = false;
          erro.textContent = e.message;
        });
      });
      body.appendChild(f);
    });
  }

  /* ---------- formulário de aula ---------- */
  function formAula(alunoId) {
    if (!db.alunos.length) { alert('Cria primeiro um aluno.'); return; }
    abreSheet('Registar aula', function (body) {
      var f = el('form');
      var selAluno = campo(f, 'Aluno', sel('f-aluno', opcoesAlunos(alunoId), alunoId || ''));

      var dois = el('div', 'fields-2');
      f.appendChild(dois);
      campo(dois, 'Data', inp('f-data', 'date', hoje()));
      campo(dois, 'Duração', sel('f-dur', [
        { v: 30, t: '30 min' }, { v: 45, t: '45 min' }, { v: 60, t: '1 hora' },
        { v: 90, t: '1h30' }, { v: 120, t: '2 horas' }
      ], 60));

      var dois2 = el('div', 'fields-2');
      f.appendChild(dois2);
      var mod = campo(dois2, 'Modalidade', sel('f-mod', [
        { v: 'online', t: 'Online' }, { v: 'presencial', t: 'Presencial' }
      ], 'online'));
      var estado = campo(dois2, 'Estado', sel('f-estado', [
        { v: 'dada', t: 'Dada' }, { v: 'faltou', t: 'Faltou' }, { v: 'desmarcada', t: 'Desmarcada a tempo' }
      ], 'dada'));

      // A modalidade acompanha a do aluno escolhido, mas pode ser mudada.
      function segueAluno() {
        var a = aluno(selAluno.value);
        if (a) mod.value = a.modalidade;
      }
      selAluno.addEventListener('change', segueAluno);
      segueAluno();

      var sum = el('textarea');
      sum.id = 'f-sum';
      sum.placeholder = 'O que foi dado, o que ficou para trabalho de casa...';
      campo(f, 'Sumário', sum);

      var linhaCheck = el('div', 'field');
      var lab = el('label', 'check');
      var chk = el('input');
      chk.type = 'checkbox'; chk.id = 'f-debita'; chk.checked = true;
      lab.appendChild(chk);
      lab.appendChild(document.createTextNode('Desconta horas do saldo'));
      linhaCheck.appendChild(lab);
      f.appendChild(linhaCheck);

      // Uma aula desmarcada a tempo não se cobra; uma falta sem aviso cobra-se.
      estado.addEventListener('change', function () {
        chk.checked = estado.value !== 'desmarcada';
      });

      var erro = el('div', 'err');
      f.appendChild(erro);
      var gravar = el('button', 'btn', 'Gravar aula');
      gravar.type = 'submit';
      f.appendChild(gravar);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!selAluno.value) { erro.textContent = 'Escolhe o aluno.'; return; }
        gravar.disabled = true;
        api('exp_aulas', { method: 'POST', body: {
          aluno_id: selAluno.value,
          data: $('f-data').value || hoje(),
          duracao_min: Number($('f-dur').value),
          modalidade: mod.value,
          estado: estado.value,
          debita: chk.checked,
          sumario: sum.value.trim() || null
        } }).then(recarrega).then(fechaSheet).catch(function (e) {
          gravar.disabled = false;
          erro.textContent = e.message;
        });
      });
      body.appendChild(f);
    });
  }

  /* ---------- formulário de pagamento ---------- */
  function formPagamento(alunoId) {
    if (!db.alunos.length) { alert('Cria primeiro um aluno.'); return; }
    abreSheet('Registar pagamento', function (body) {
      var f = el('form');
      var selAluno = campo(f, 'Aluno', sel('f-aluno', opcoesAlunos(alunoId), alunoId || ''));

      var dois = el('div', 'fields-2');
      f.appendChild(dois);
      campo(dois, 'Data', inp('f-data', 'date', hoje()));
      var valor = campo(dois, 'Valor (€)', inp('f-valor', 'number', ''));
      valor.step = '0.5'; valor.min = '0';

      var hrs = campo(f, 'Horas compradas', inp('f-horas', 'number', ''));
      hrs.step = '0.5'; hrs.min = '0';

      // Atalhos, porque na prática só há dois casos: uma hora, ou um pack de 10.
      var atalhos = el('div', 'btn-row');
      atalhos.style.marginBottom = '14px';
      atalhos.appendChild(botao('1 hora', 'btn ghost', function () {
        var a = aluno(selAluno.value);
        hrs.value = 1;
        if (a) valor.value = Number(a.preco_hora);
      }));
      atalhos.appendChild(botao('Pack 10h', 'btn ghost', function () {
        var a = aluno(selAluno.value);
        hrs.value = 10;
        if (a) valor.value = Number(a.preco_hora) * 10;
      }));
      f.appendChild(atalhos);
      var dica = el('p', 'muted', 'Os atalhos usam o preço de tabela do aluno — o desconto do pack escreve-se por cima, no valor.');
      dica.style.marginBottom = '14px';
      f.appendChild(dica);

      campo(f, 'Método', sel('f-metodo', [
        { v: '', t: '—' }, { v: 'MB Way', t: 'MB Way' }, { v: 'transferência', t: 'Transferência' },
        { v: 'dinheiro', t: 'Dinheiro' }
      ], ''));
      campo(f, 'Nota', inp('f-nota', 'text', ''));

      var erro = el('div', 'err');
      f.appendChild(erro);
      var gravar = el('button', 'btn amber', 'Gravar pagamento');
      gravar.type = 'submit';
      f.appendChild(gravar);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!selAluno.value) { erro.textContent = 'Escolhe o aluno.'; return; }
        if (valor.value === '') { erro.textContent = 'Falta o valor.'; return; }
        gravar.disabled = true;
        api('exp_pagamentos', { method: 'POST', body: {
          aluno_id: selAluno.value,
          data: $('f-data').value || hoje(),
          valor_eur: Number(valor.value) || 0,
          horas_credito: Number(hrs.value) || 0,
          metodo: $('f-metodo').value || null,
          nota: $('f-nota').value.trim() || null
        } }).then(recarrega).then(fechaSheet).catch(function (e) {
          gravar.disabled = false;
          erro.textContent = e.message;
        });
      });
      body.appendChild(f);
    });
  }

  /* ============================================================
     Navegação e arranque
     ============================================================ */
  var TITULOS = { painel: 'Painel', alunos: 'Alunos', aulas: 'Aulas', dinheiro: 'Dinheiro' };

  function mostra(nome) {
    tab = nome;
    ['painel', 'alunos', 'aulas', 'dinheiro'].forEach(function (t) {
      $('view-' + t).classList.toggle('hidden', t !== nome);
    });
    Array.prototype.forEach.call(document.querySelectorAll('nav.tabs button'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-tab') === nome);
    });
    $('top-title').textContent = TITULOS[nome];
    window.scrollTo(0, 0);
    pinta();
  }

  function pinta() {
    if (tab === 'painel') pintaPainel();
    else if (tab === 'alunos') pintaAlunos();
    else if (tab === 'aulas') pintaAulas();
    else if (tab === 'dinheiro') pintaDinheiro();

    var ativos = db.alunos.filter(function (a) { return a.ativo; }).length;
    $('top-sub').textContent = ativos + (ativos === 1 ? ' aluno ativo' : ' alunos ativos');
  }

  function recarrega() { return carrega().then(pinta); }

  function falhou(e) { alert(e.message || 'Alguma coisa correu mal.'); }

  function abreApp() {
    $('gate').classList.add('hidden');
    $('app').classList.remove('hidden');
    return carrega().then(function () { mostra('painel'); });
  }

  function ligaEventos() {
    Array.prototype.forEach.call(document.querySelectorAll('nav.tabs button'), function (b) {
      b.addEventListener('click', function () { mostra(b.getAttribute('data-tab')); });
    });
    $('novo-aluno').addEventListener('click', function () { formAluno(null); });
    $('nova-aula').addEventListener('click', function () { formAula(null); });
    $('novo-pagamento').addEventListener('click', function () { formPagamento(null); });
    $('logout').addEventListener('click', function () {
      limpaSessao();
      location.reload();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !$('sheet').classList.contains('hidden')) fechaSheet();
    });

    $('gate-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = $('gate-btn'), erro = $('gate-err');
      erro.textContent = '';
      btn.disabled = true;
      entrar($('gate-email').value.trim(), $('gate-pw').value)
        .then(abreApp)
        .catch(function (e) {
          btn.disabled = false;
          erro.textContent = e.message;
        });
    });
  }

  function arranca() {
    ligaEventos();
    var s = leSessao();
    if (!s) return;
    session = s;
    // Sessão guardada: confirma que ainda serve antes de mostrar a app.
    token().then(abreApp).catch(function () { limpaSessao(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca);
  else arranca();
})();
