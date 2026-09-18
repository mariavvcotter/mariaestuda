/* ============================================================
   mariaestuda — Explicações: painel do encarregado e do aluno
   ------------------------------------------------------------
   Este ficheiro só lê vistas (v_*). Não sabe que as tabelas em
   bruto existem, e não lhe serviria de nada saber: o schema não
   lhas deixa ler. Quando há mais do que um educando, cada um
   aparece em separado (§54).
   ============================================================ */
window.FAMILIA = (function () {
  'use strict';

  var U = window.UI, db = window.API.db;
  var perfil = null;
  var alunoAtual = null;

  var d = { alunos: [], conta: [], sumarios: [], materiais: [], tpcs: [], notas: [] };

  function carrega() {
    var pedidos = [db.ler('v_meus_alunos?select=*&order=nome.asc')];
    pedidos.push(perfil.ve_conta_corrente
      ? db.ler('v_conta_corrente?select=*&order=data.desc') : Promise.resolve([]));
    pedidos.push(perfil.ve_materiais
      ? db.ler('v_sumarios?select=*&order=data.desc') : Promise.resolve([]));
    pedidos.push(perfil.ve_materiais
      ? db.ler('v_materiais?select=*&order=titulo.asc') : Promise.resolve([]));
    pedidos.push(perfil.ve_materiais
      ? db.ler('v_tpcs?select=*&order=criado_em.desc') : Promise.resolve([]));
    pedidos.push(perfil.ve_materiais
      ? db.ler('v_nota_proxima?select=*') : Promise.resolve([]));

    return Promise.all(pedidos).then(function (r) {
      d.alunos = r[0] || []; d.conta = r[1] || []; d.sumarios = r[2] || [];
      d.materiais = r[3] || []; d.tpcs = r[4] || []; d.notas = r[5] || [];
      if (!alunoAtual || !d.alunos.some(function (a) { return a.id === alunoAtual; }))
        alunoAtual = d.alunos.length ? d.alunos[0].id : null;
    });
  }

  function so(lista, alunoId) {
    return lista.filter(function (x) { return x.aluno_id === alunoId; });
  }

  function saldo(alunoId) {
    var t = 0;
    so(d.conta, alunoId).forEach(function (m) {
      t += (Number(m.credito) || 0) - (Number(m.debito) || 0);
    });
    return Math.round(t * 100) / 100;
  }

  /* ============================================================
     Desenho
     ============================================================ */
  function pinta() {
    var caixa = U.limpa(U.$('v-familia'));

    if (!d.alunos.length) {
      caixa.appendChild(U.vazio('A tua conta ainda não está ligada a nenhum aluno. Fala com a Maria.'));
      return;
    }

    // Vários educandos: um separador por cada, em vez de tudo misturado.
    if (d.alunos.length > 1) {
      var tabs = U.el('div', 'escolher');
      d.alunos.forEach(function (a) {
        var b = U.el('button', 'chip' + (a.id === alunoAtual ? ' on' : ''), a.nome);
        b.type = 'button';
        b.addEventListener('click', function () { alunoAtual = a.id; pinta(); });
        tabs.appendChild(b);
      });
      caixa.appendChild(tabs);
    }

    var a = null;
    for (var i = 0; i < d.alunos.length; i++) if (d.alunos[i].id === alunoAtual) a = d.alunos[i];
    if (!a) return;

    caixa.appendChild(U.el('h2', 'view-title', a.nome));
    if (a.ano || a.disciplinas)
      caixa.appendChild(U.el('p', 'dica', [a.ano, a.disciplinas].filter(Boolean).join(' · ')));

    if (perfil.ve_materiais) {
      pintaNota(caixa, a.id);
      pintaTpcs(caixa, a.id);
      pintaMateriais(caixa, a.id);
      pintaSumarios(caixa, a.id);
    }
    if (perfil.ve_conta_corrente) pintaConta(caixa, a.id);
  }

  /* --- importante para a próxima explicação --- */
  function pintaNota(caixa, alunoId) {
    var nota = so(d.notas, alunoId)[0];
    if (!nota) return;
    var c = U.el('div', 'destaque');
    c.appendChild(U.el('div', 'destaque-t', 'Para a próxima explicação'));
    c.appendChild(U.el('p', '', nota.texto));
    caixa.appendChild(c);
  }

  /* --- TPCs --- */
  function pintaTpcs(caixa, alunoId) {
    var lista = so(d.tpcs, alunoId);
    var c = U.cartao('Trabalhos de casa');
    if (!lista.length) { c.appendChild(U.vazio('Nada marcado.')); caixa.appendChild(c); return; }

    var ul = U.el('ul', 'hist');
    lista.forEach(function (t) {
      var li = U.el('li');
      var esq = U.el('div');
      esq.appendChild(U.el('div', 'when', t.descricao));
      var det = U.el('div', 'what');
      if (t.entrega) det.appendChild(document.createTextNode('entrega ' + U.dataCurta(t.entrega) + ' '));
      if (t.estado === 'por_fazer')   det.appendChild(U.etiqueta('por fazer'));
      if (t.estado === 'feito_aluno') det.appendChild(U.etiqueta('marcado como feito', 'warn'));
      if (t.estado === 'confirmado')  det.appendChild(U.etiqueta('confirmado · ' + t.nota + '/5', 'ok'));
      esq.appendChild(det);

      (t.materiais || []).forEach(function (m) {
        var b = U.botao('Abrir ' + m.titulo, 'btn pequeno ghost', function () {
          abreFicheiro(m.storage_path, b);
        });
        b.style.marginTop = '8px';
        esq.appendChild(b);
      });
      li.appendChild(esq);

      if (t.estado !== 'confirmado') {
        var feito = t.estado === 'feito_aluno';
        var b2 = U.botao(feito ? 'Afinal não' : 'Já fiz', 'btn pequeno' + (feito ? ' ghost' : ''),
          function () {
            b2.disabled = true;
            db.funcao('marcar_tpc_feito', { p_tpc: t.id, p_feito: !feito })
              .then(carrega).then(pinta)
              .catch(function (e) { b2.disabled = false; U.falhou(e); });
          });
        li.appendChild(b2);
      }
      ul.appendChild(li);
    });
    c.appendChild(ul);
    caixa.appendChild(c);
  }

  /* --- materiais --- */
  function pintaMateriais(caixa, alunoId) {
    var lista = so(d.materiais, alunoId);
    var c = U.cartao('Materiais');
    if (!lista.length) { c.appendChild(U.vazio('Ainda não há materiais.')); caixa.appendChild(c); return; }

    var ul = U.el('ul', 'hist');
    lista.forEach(function (m) {
      var li = U.el('li');
      var esq = U.el('div');
      esq.appendChild(U.el('div', 'when', m.titulo));
      esq.appendChild(U.el('div', 'what',
        [m.disciplina, m.ano ? m.ano + '.º ano' : null, U.tamanho(m.tamanho_bytes)]
          .filter(Boolean).join(' · ')));
      li.appendChild(esq);
      var b = U.botao('Descarregar', 'btn pequeno ghost', function () {
        abreFicheiro(m.storage_path, b);
      });
      li.appendChild(b);
      ul.appendChild(li);
    });
    c.appendChild(ul);
    caixa.appendChild(c);
  }

  // O URL é pedido no momento e vale poucos minutos: um link copiado
  // para outro sítio deixa de funcionar sozinho.
  function abreFicheiro(caminho, botao) {
    var texto = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'A abrir...';
    window.API.ficheiros.urlAssinado(caminho).then(function (url) {
      window.open(url, '_blank', 'noopener');
    }).catch(U.falhou).then(function () {
      botao.disabled = false;
      botao.textContent = texto;
    });
  }

  /* --- sumários (sem valores) --- */
  function pintaSumarios(caixa, alunoId) {
    var lista = so(d.sumarios, alunoId);
    if (!lista.length) return;
    var c = U.cartao('Explicações');
    var ul = U.el('ul', 'hist');
    lista.slice(0, 30).forEach(function (s) {
      var li = U.el('li');
      var esq = U.el('div');
      esq.appendChild(U.el('div', 'when', U.dataLonga(s.data)));
      esq.appendChild(U.el('div', 'what', s.sumario || 'Sem sumário.'));
      li.appendChild(esq);
      li.appendChild(U.el('div', 'amt minus', U.horas(s.duracao_min)));
      ul.appendChild(li);
    });
    c.appendChild(ul);
    caixa.appendChild(c);
  }

  /* --- conta corrente --- */
  function pintaConta(caixa, alunoId) {
    var movs = so(d.conta, alunoId);
    var s = saldo(alunoId);

    var d1 = U.el('div', 'destaque ' + (s < 0 ? 'mau' : 'bom'));
    d1.appendChild(U.el('div', 'destaque-t', 'Saldo'));
    d1.appendChild(U.el('div', 'destaque-n', U.eur(Math.abs(s))));
    d1.appendChild(U.el('p', '', s < 0
      ? 'Por pagar.'
      : (s > 0 ? 'A favor: já pago, por dar.' : 'Contas certas.')));
    caixa.appendChild(d1);

    var c = U.cartao('Movimentos');
    if (!movs.length) { c.appendChild(U.vazio('Sem movimentos.')); caixa.appendChild(c); return; }

    var ul = U.el('ul', 'hist');
    movs.forEach(function (m) {
      var li = U.el('li');
      var esq = U.el('div');
      esq.appendChild(U.el('div', 'when', U.dataLonga(m.data) + ' · ' +
        (m.tipo === 'explicacao' ? 'explicação' : 'pagamento')));
      var det = [];
      if (m.duracao_min) det.push(U.horas(m.duracao_min));
      if (m.descricao) det.push(m.descricao);
      esq.appendChild(U.el('div', 'what', det.join(' · ') || '—'));
      li.appendChild(esq);
      var credito = Number(m.credito) || 0;
      var dir = U.el('div', 'amt ' + (credito ? 'plus' : 'minus'));
      dir.textContent = (credito ? '+' : '−') + U.eur(credito || m.debito);
      li.appendChild(dir);
      ul.appendChild(li);
    });
    c.appendChild(ul);
    caixa.appendChild(c);
  }

  /* ============================================================
     Arranque
     ============================================================ */
  function iniciar(p) {
    perfil = p;
    U.$('top-title').textContent = 'Explicações';
    U.$('tabs').classList.add('hidden');
    document.body.classList.add('sem-tabs');

    var acao = U.$('top-extra');
    U.limpa(acao);
    acao.appendChild(U.botao('Palavra-passe', '', function () {
      U.abreSheet('Mudar a palavra-passe', function (corpo) {
        var f = U.el('form');
        var pw = U.campo(f, 'Nova palavra-passe', U.entrada('f-pw', 'password', ''));
        pw.setAttribute('autocomplete', 'new-password');
        var erro = U.el('div', 'err'); f.appendChild(erro);
        var b = U.el('button', 'btn', 'Mudar'); b.type = 'submit'; f.appendChild(b);
        f.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (pw.value.length < 10) { erro.textContent = 'Precisa de 10 caracteres ou mais.'; return; }
          b.disabled = true;
          window.API.trocarPassword(pw.value).then(function () {
            U.fechaSheet(); U.aviso('Palavra-passe mudada.');
          }).catch(function (e) { b.disabled = false; erro.textContent = e.message; });
        });
        corpo.appendChild(f);
      });
    }));

    return carrega().then(pinta);
  }

  return { iniciar: iniciar };
})();
