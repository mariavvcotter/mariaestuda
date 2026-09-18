/* ============================================================
   mariaestuda — Explicações: painel do administrador
   ============================================================ */
window.ADMIN = (function () {
  'use strict';

  var U = window.UI, db = window.API.db;
  var perfil = null;
  var vista = 'hoje';

  // Tudo em memória: são ~10 alunos, não vale a pena paginar nada.
  var d = {
    perfis: [], alunos: [], explicacoes: [], pagamentos: [],
    materiais: [], atribuicoes: [], tpcs: [], tpcMateriais: [],
    notas: [], horario: [], excecoes: [], extras: []
  };

  /* ============================================================
     Carregar
     ============================================================ */
  function carrega() {
    return Promise.all([
      db.ler('perfis?select=*&order=nome.asc'),
      db.ler('alunos?select=*&order=nome.asc'),
      db.ler('explicacoes?select=*,explicacao_alunos(aluno_id,valor_eur)&order=data.desc,criado_em.desc'),
      db.ler('pagamentos?select=*&order=data.desc,criado_em.desc'),
      db.ler('materiais?select=*&order=criado_em.desc'),
      db.ler('material_alunos?select=*'),
      db.ler('tpcs?select=*&order=criado_em.desc'),
      db.ler('tpc_materiais?select=*'),
      db.ler('notas_proxima?select=*&order=criado_em.desc'),
      db.ler('horario?select=*'),
      db.ler('horario_excecoes?select=*'),
      db.ler('horario_extras?select=*')
    ]).then(function (r) {
      d.perfis = r[0] || [];  d.alunos = r[1] || [];  d.explicacoes = r[2] || [];
      d.pagamentos = r[3] || []; d.materiais = r[4] || []; d.atribuicoes = r[5] || [];
      d.tpcs = r[6] || []; d.tpcMateriais = r[7] || []; d.notas = r[8] || [];
      d.horario = r[9] || []; d.excecoes = r[10] || []; d.extras = r[11] || [];
    });
  }

  function recarrega() {
    return carrega().then(function () {
      pinta();
      if (U.sheetAberto()) U.refrescaSheet();
    });
  }

  /* ============================================================
     Contas
     ============================================================ */
  function aluno(id) {
    for (var i = 0; i < d.alunos.length; i++) if (d.alunos[i].id === id) return d.alunos[i];
    return null;
  }
  function nomeAluno(id) { var a = aluno(id); return a ? a.nome : '(apagado)'; }
  function perfilDe(id) {
    for (var i = 0; i < d.perfis.length; i++) if (d.perfis[i].id === id) return d.perfis[i];
    return null;
  }
  function ativos() { return d.alunos.filter(function (a) { return !a.arquivado; }); }

  // Movimentos de um aluno: débitos (explicações) e créditos (pagamentos).
  function movimentos(alunoId) {
    var lista = [];
    d.explicacoes.forEach(function (e) {
      (e.explicacao_alunos || []).forEach(function (ea) {
        if (ea.aluno_id !== alunoId) return;
        lista.push({
          tipo: 'explicacao', id: e.id, data: e.data, duracao_min: e.duracao_min,
          descricao: e.sumario, debito: Number(ea.valor_eur) || 0, credito: 0
        });
      });
    });
    d.pagamentos.forEach(function (p) {
      if (p.aluno_id !== alunoId) return;
      lista.push({
        tipo: 'pagamento', id: p.id, data: p.data, descricao: p.nota,
        debito: 0, credito: Number(p.valor_eur) || 0
      });
    });
    return lista.sort(function (x, y) { return y.data.localeCompare(x.data); });
  }

  // Positivo = tem crédito. Negativo = deve.
  function saldo(alunoId) {
    var t = 0;
    movimentos(alunoId).forEach(function (m) { t += m.credito - m.debito; });
    return Math.round(t * 100) / 100;
  }

  function notaEmVigor(alunoId) {
    for (var i = 0; i < d.notas.length; i++) {
      var n = d.notas[i];
      if (n.aluno_id === alunoId && !n.consumida_em) return n;
    }
    return null;
  }

  function tpcsDe(alunoId) {
    return d.tpcs.filter(function (t) { return t.aluno_id === alunoId; });
  }

  function materiaisDe(alunoId) {
    var ids = d.atribuicoes.filter(function (x) { return x.aluno_id === alunoId; });
    return ids.map(function (x) {
      var m = null;
      for (var i = 0; i < d.materiais.length; i++) if (d.materiais[i].id === x.material_id) m = d.materiais[i];
      return m ? Object.assign({}, m, { publicar_em: x.publicar_em }) : null;
    }).filter(Boolean);
  }

  /* Explicações que o horário prevê para uma data. Decorativo: nunca
     cria registos, só diz o que era suposto acontecer (§76-77). */
  function previstasPara(iso) {
    var dow = U.diaSemana(iso);
    var lista = d.horario.filter(function (h) {
      if (!h.ativo || h.dia_semana !== dow) return false;
      var a = aluno(h.aluno_id);
      if (!a || a.arquivado) return false;
      return !d.excecoes.some(function (x) { return x.horario_id === h.id && x.data === iso; });
    }).map(function (h) {
      return { horario_id: h.id, aluno_id: h.aluno_id, hora: h.hora_inicio, duracao_min: h.duracao_min };
    });
    d.extras.forEach(function (x) {
      if (x.data === iso) lista.push({
        extra_id: x.id, aluno_id: x.aluno_id, hora: x.hora_inicio,
        duracao_min: x.duracao_min, nota: x.nota
      });
    });
    return lista.sort(function (a, b) { return String(a.hora).localeCompare(String(b.hora)); });
  }

  // Já foi registada uma explicação para este aluno nesta data?
  function jaRegistada(alunoId, iso) {
    return d.explicacoes.some(function (e) {
      return e.data === iso && (e.explicacao_alunos || []).some(function (ea) {
        return ea.aluno_id === alunoId;
      });
    });
  }

  /* ============================================================
     Vista: Hoje
     ============================================================ */
  function pintaHoje() {
    var caixa = U.limpa(U.$('v-hoje'));
    var iso = U.hoje();

    /* --- números do mês --- */
    var ym = iso.slice(0, 7), horasMes = 0, recebidoMes = 0, divida = 0;
    d.explicacoes.forEach(function (e) {
      if (e.data.slice(0, 7) === ym) horasMes += (Number(e.duracao_min) || 0) / 60;
    });
    d.pagamentos.forEach(function (p) {
      if (p.data.slice(0, 7) === ym) recebidoMes += Number(p.valor_eur) || 0;
    });
    ativos().forEach(function (a) { var s = saldo(a.id); if (s < 0) divida += -s; });

    var stats = U.el('div', 'stats');
    stats.appendChild(mini(String(ativos().length), 'alunos ativos'));
    stats.appendChild(mini(U.horas(horasMes * 60), 'horas dadas este mês'));
    stats.appendChild(mini(U.eur(recebidoMes), 'recebido este mês'));
    stats.appendChild(mini(U.eur(divida), 'por cobrar', divida > 0 ? 'debt' : ''));
    caixa.appendChild(stats);

    /* --- explicações previstas para hoje --- */
    var c1 = U.cartao('Hoje, ' + U.nomeDia(U.diaSemana(iso)) + ' · ' + U.dataLonga(iso));
    var previstas = previstasPara(iso);
    if (!previstas.length) {
      c1.appendChild(U.vazio('O horário não prevê explicações para hoje.'));
    } else {
      previstas.forEach(function (p) {
        var registada = jaRegistada(p.aluno_id, iso);
        var linha = U.el('div', 'prev' + (registada ? ' feita' : ''));
        var esq = U.el('div');
        esq.appendChild(U.el('div', 'prev-hora', U.horaCurta(p.hora)));
        esq.appendChild(U.el('div', 'prev-dur', U.horas(p.duracao_min)));
        linha.appendChild(esq);

        var meio = U.el('div', 'prev-main');
        meio.appendChild(U.el('div', 'name', nomeAluno(p.aluno_id)));
        var sub = U.el('div', 'meta');
        if (p.extra_id) sub.appendChild(U.etiqueta('extra', 'warn'));
        sub.appendChild(document.createTextNode(registada ? ' já registada' : ' por registar'));
        meio.appendChild(sub);
        linha.appendChild(meio);

        linha.appendChild(U.botao(registada ? 'Ver' : 'Registar', 'btn pequeno', function () {
          if (registada) fichaAluno(p.aluno_id);
          else formExplicacao({ alunos: [p.aluno_id], data: iso, duracao_min: p.duracao_min });
        }));
        c1.appendChild(linha);
      });
    }
    // O horário nunca regista nada sozinho, e convém que isso se leia.
    c1.appendChild(U.el('p', 'dica', 'O horário é só uma vista. Uma explicação só existe depois de a registares.'));
    caixa.appendChild(c1);

    /* --- saldos negativos --- */
    var c2 = U.cartao('Quem está a dever');
    var devedores = ativos().map(function (a) { return { a: a, s: saldo(a.id) }; })
      .filter(function (x) { return x.s < 0; })
      .sort(function (p, q) { return p.s - q.s; });
    if (!devedores.length) c2.appendChild(U.vazio('Ninguém com saldo negativo. 🎉'));
    else devedores.forEach(function (x) {
      c2.appendChild(linhaAluno(x.a, function () { fichaAluno(x.a.id); }));
    });
    caixa.appendChild(c2);

    /* --- TPCs marcados pelo aluno, à espera de confirmação --- */
    var c3 = U.cartao('TPCs por confirmar');
    var porConfirmar = d.tpcs.filter(function (t) { return t.estado === 'feito_aluno'; });
    if (!porConfirmar.length) c3.appendChild(U.vazio('Nada à espera de confirmação.'));
    else {
      var ul = U.el('ul', 'hist');
      porConfirmar.forEach(function (t) {
        var li = U.el('li');
        var esq = U.el('div');
        esq.appendChild(U.el('div', 'when', nomeAluno(t.aluno_id)));
        esq.appendChild(U.el('div', 'what', t.descricao));
        li.appendChild(esq);
        li.appendChild(U.botao('Confirmar', 'btn pequeno', function () { formConfirmarTpc(t); }));
        ul.appendChild(li);
      });
      c3.appendChild(ul);
    }
    caixa.appendChild(c3);
  }

  function mini(n, l, estado) {
    var c = U.el('div', 'stat');
    c.appendChild(U.el('div', 'n' + (estado ? ' ' + estado : ''), n));
    c.appendChild(U.el('div', 'l', l));
    return c;
  }

  function linhaAluno(a, aoClicar) {
    var s = saldo(a.id);
    var estado = s < 0 ? 'debt' : '';
    var b = U.el('button', 'row' + (a.arquivado ? ' inativo' : ''));
    b.type = 'button';
    b.appendChild(U.el('div', 'avatar' + (estado ? ' ' + estado : ''), U.inicial(a.nome)));

    var main = U.el('div', 'main');
    main.appendChild(U.el('div', 'name', a.nome));
    var meta = [];
    if (a.ano) meta.push(a.ano);
    if (a.disciplinas) meta.push(a.disciplinas);
    meta.push(U.eur(a.preco_hora) + '/h');
    if (a.arquivado) meta.push('arquivado');
    main.appendChild(U.el('div', 'meta', meta.join(' · ')));
    b.appendChild(main);

    var lado = U.el('div', 'side');
    lado.appendChild(U.el('div', 'saldo' + (estado ? ' ' + estado : ''), U.eur(s)));
    lado.appendChild(U.el('div', 'saldo-l', s < 0 ? 'em dívida' : 'a favor'));
    b.appendChild(lado);

    b.addEventListener('click', aoClicar);
    return b;
  }

  /* ============================================================
     Vista: Alunos
     ============================================================ */
  function pintaAlunos() {
    var caixa = U.limpa(U.$('v-alunos'));

    var acao = U.el('div', 'btn-row');
    acao.style.marginBottom = '16px';
    acao.appendChild(U.botao('+ Novo aluno', 'btn', function () { formAluno(null); }));
    caixa.appendChild(acao);

    var vivos = ativos(), arquivados = d.alunos.filter(function (a) { return a.arquivado; });

    if (!vivos.length) caixa.appendChild(U.vazio('Ainda não há alunos.'));
    vivos.slice().sort(function (p, q) { return saldo(p.id) - saldo(q.id); })
      .forEach(function (a) {
        caixa.appendChild(linhaAluno(a, function () { fichaAluno(a.id); }));
      });

    if (arquivados.length) {
      caixa.appendChild(U.el('h3', 'sec', 'Arquivo'));
      caixa.appendChild(U.el('p', 'dica',
        'Sem acesso à aplicação. O histórico e o saldo final ficam guardados.'));
      arquivados.forEach(function (a) {
        caixa.appendChild(linhaAluno(a, function () { fichaAluno(a.id); }));
      });
    }
  }

  /* ============================================================
     Ficha do aluno — tudo o que há sobre uma pessoa, num sítio
     ============================================================ */
  function fichaAluno(id) {
    U.abreSheet(nomeAluno(id), function (corpo) {
      var a = aluno(id);
      if (!a) { corpo.appendChild(U.vazio('Este aluno já não existe.')); return; }

      var s = saldo(a.id);
      var movs = movimentos(a.id);
      var dadas = movs.filter(function (m) { return m.tipo === 'explicacao'; });

      /* --- números --- */
      var stats = U.el('div', 'stats');
      stats.appendChild(mini(U.eur(s), s < 0 ? 'em dívida' : 'saldo a favor', s < 0 ? 'debt' : ''));
      stats.appendChild(mini(String(dadas.length), 'explicações dadas'));
      stats.appendChild(mini(U.eur(a.preco_hora) + '/h', 'preço de tabela'));
      // Com o desconto aplicado à mão em cada linha, o €/h que sai na
      // prática pode afastar-se do de tabela sem ninguém dar por isso.
      var minutos = 0, cobrado = 0;
      d.explicacoes.forEach(function (e) {
        (e.explicacao_alunos || []).forEach(function (ea) {
          if (ea.aluno_id !== a.id) return;
          minutos += Number(e.duracao_min) || 0;
          cobrado += Number(ea.valor_eur) || 0;
        });
      });
      var efetivo = minutos ? cobrado / (minutos / 60) : null;
      stats.appendChild(mini(
        efetivo == null ? '—' : U.eur(efetivo) + '/h', 'preço efetivo até hoje',
        efetivo != null && Math.abs(efetivo - Number(a.preco_hora)) > 0.005 ? 'warn' : ''));
      corpo.appendChild(stats);

      if (a.arquivado) {
        var av = U.el('div', 'banner');
        av.textContent = 'Arquivado em ' + U.dataLonga(a.arquivado_em) +
          (a.saldo_final != null ? ' · saldo final ' + U.eur(a.saldo_final) : '');
        corpo.appendChild(av);
      }

      /* --- ações rápidas --- */
      if (!a.arquivado) {
        var acoes = U.el('div', 'btn-row');
        acoes.appendChild(U.botao('Registar explicação', 'btn', function () {
          formExplicacao({ alunos: [a.id] });
        }));
        acoes.appendChild(U.botao('Pagamento', 'btn amber', function () { formPagamento(a.id); }));
        corpo.appendChild(acoes);
      }

      /* --- importante para a próxima explicação --- */
      var nota = notaEmVigor(a.id);
      var cNota = U.cartao('Importante para a próxima explicação');
      if (nota) {
        var p = U.el('p', 'nota-viva', nota.texto);
        cNota.appendChild(p);
        cNota.appendChild(U.el('p', 'dica',
          'Escrita a ' + U.dataLonga(nota.criado_em) + '. Desaparece quando registares a próxima explicação.'));
      } else {
        cNota.appendChild(U.vazio('Sem nota em vigor.'));
      }
      var bn = U.el('div', 'btn-row');
      bn.appendChild(U.botao(nota ? 'Escrever outra' : 'Escrever', 'btn ghost', function () {
        formNota(a.id);
      }));
      var antigas = d.notas.filter(function (n) { return n.aluno_id === a.id && n.consumida_em; });
      if (antigas.length) bn.appendChild(U.botao('Histórico (' + antigas.length + ')', 'btn ghost', function () {
        U.abreSheet('Notas anteriores · ' + a.nome, function (c2) {
          var ul = U.el('ul', 'hist');
          antigas.forEach(function (n) {
            var li = U.el('li');
            var esq = U.el('div');
            esq.appendChild(U.el('div', 'when', U.dataLonga(n.criado_em)));
            esq.appendChild(U.el('div', 'what', n.texto));
            li.appendChild(esq);
            ul.appendChild(li);
          });
          c2.appendChild(ul);
        });
      }));
      cNota.appendChild(bn);
      corpo.appendChild(cNota);

      /* --- conta corrente --- */
      var cConta = U.cartao('Conta corrente');
      if (!movs.length) cConta.appendChild(U.vazio('Sem movimentos.'));
      else {
        var ul = U.el('ul', 'hist');
        var acumulado = s;
        movs.forEach(function (m) {
          var li = U.el('li');
          var esq = U.el('div');
          esq.appendChild(U.el('div', 'when', U.dataCurta(m.data) + ' · ' +
            (m.tipo === 'explicacao' ? 'explicação' : 'pagamento')));
          var det = [];
          if (m.duracao_min) det.push(U.horas(m.duracao_min));
          if (m.descricao) det.push(m.descricao);
          esq.appendChild(U.el('div', 'what', det.join(' · ') || '—'));
          li.appendChild(esq);

          var dir = U.el('div', 'amt ' + (m.credito ? 'plus' : 'minus'));
          dir.textContent = (m.credito ? '+' : '−') + U.eur(m.credito || m.debito);
          li.appendChild(dir);

          if (m.tipo === 'pagamento') dir.appendChild(apagador(function () {
            return db.apagar('pagamentos', 'id=eq.' + m.id);
          }, 'Apagar este pagamento?'));
          ul.appendChild(li);
        });
        cConta.appendChild(ul);
      }
      corpo.appendChild(cConta);

      /* --- TPCs --- */
      var cTpc = U.cartao('TPCs');
      var lista = tpcsDe(a.id);
      if (!lista.length) cTpc.appendChild(U.vazio('Sem TPCs.'));
      else {
        var ut = U.el('ul', 'hist');
        lista.forEach(function (t) { ut.appendChild(linhaTpc(t)); });
        cTpc.appendChild(ut);
      }
      if (!a.arquivado) {
        var bt = U.el('div', 'btn-row');
        bt.appendChild(U.botao('+ Novo TPC', 'btn ghost', function () { formTpc(a.id, null); }));
        cTpc.appendChild(bt);
      }
      corpo.appendChild(cTpc);

      /* --- materiais --- */
      var cMat = U.cartao('Materiais atribuídos');
      var mats = materiaisDe(a.id);
      if (!mats.length) cMat.appendChild(U.vazio('Nenhum material atribuído.'));
      else {
        var um = U.el('ul', 'hist');
        mats.forEach(function (m) {
          var li = U.el('li');
          var esq = U.el('div');
          esq.appendChild(U.el('div', 'when', m.titulo));
          var det = [m.disciplina, m.ano, U.tamanho(m.tamanho_bytes)].filter(Boolean);
          var linhaDet = U.el('div', 'what', det.join(' · '));
          if (m.publicar_em && m.publicar_em > U.hoje())
            linhaDet.appendChild(U.etiqueta('só a ' + U.dataCurta(m.publicar_em), 'warn'));
          esq.appendChild(linhaDet);
          li.appendChild(esq);
          var dir = U.el('div', 'amt');
          dir.appendChild(apagador(function () {
            return db.apagar('material_alunos',
              'material_id=eq.' + m.id + '&aluno_id=eq.' + a.id);
          }, 'Retirar este material a ' + a.nome + '? O ficheiro fica na biblioteca.'));
          li.appendChild(dir);
          um.appendChild(li);
        });
        cMat.appendChild(um);
      }
      if (!a.arquivado) {
        var bm = U.el('div', 'btn-row');
        bm.appendChild(U.botao('Atribuir materiais', 'btn ghost', function () {
          formAtribuirAAluno(a.id);
        }));
        cMat.appendChild(bm);
      }
      corpo.appendChild(cMat);

      /* --- horário --- */
      var cHor = U.cartao('Horário semanal');
      var linhas = d.horario.filter(function (h) { return h.aluno_id === a.id; });
      if (!linhas.length) cHor.appendChild(U.vazio('Sem horário fixo.'));
      else {
        var uh = U.el('ul', 'hist');
        linhas.sort(function (x, y) { return x.dia_semana - y.dia_semana; }).forEach(function (h) {
          var li = U.el('li');
          var esq = U.el('div');
          esq.appendChild(U.el('div', 'when', U.nomeDia(h.dia_semana) + ' às ' + U.horaCurta(h.hora_inicio)));
          esq.appendChild(U.el('div', 'what', U.horas(h.duracao_min) + (h.ativo ? '' : ' · desligado')));
          li.appendChild(esq);
          var dir = U.el('div', 'amt');
          dir.appendChild(apagador(function () {
            return db.apagar('horario', 'id=eq.' + h.id);
          }, 'Apagar esta linha do horário?'));
          li.appendChild(dir);
          uh.appendChild(li);
        });
        cHor.appendChild(uh);
      }
      if (!a.arquivado) {
        var bh = U.el('div', 'btn-row');
        bh.appendChild(U.botao('+ Linha de horário', 'btn ghost', function () { formHorario(a.id); }));
        cHor.appendChild(bh);
      }
      corpo.appendChild(cHor);

      /* --- ficha e contas ligadas --- */
      var cInfo = U.cartao('Ficha');
      info(cInfo, 'Ano', a.ano);
      info(cInfo, 'Disciplinas', a.disciplinas);
      info(cInfo, 'Encarregado', nomeDePerfil(a.encarregado_id));
      info(cInfo, 'Conta do aluno', nomeDePerfil(a.aluno_perfil_id));
      info(cInfo, 'Notas', a.notas);
      corpo.appendChild(cInfo);

      var fim = U.el('div', 'btn-row');
      fim.appendChild(U.botao('Editar', 'btn ghost', function () { formAluno(a); }));
      if (!a.arquivado) fim.appendChild(U.botao('Arquivar', 'btn danger', function () { formArquivar(a); }));
      corpo.appendChild(fim);
    });
  }

  function nomeDePerfil(id) {
    if (!id) return null;
    var p = perfilDe(id);
    return p ? p.nome : '(conta apagada)';
  }

  function info(pai, etiqueta, valor) {
    if (!valor) return;
    var p = U.el('p', 'info');
    var b = U.el('strong', '', etiqueta + ': ');
    p.appendChild(b);
    p.appendChild(document.createTextNode(valor));
    pai.appendChild(p);
  }

  function apagador(accao, pergunta) {
    var b = U.el('button', 'del', '✕');
    b.type = 'button';
    b.title = 'Apagar';
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (!confirm(pergunta)) return;
      accao().then(recarrega).catch(U.falhou);
    });
    return b;
  }

  function linhaTpc(t) {
    var li = U.el('li');
    var esq = U.el('div');
    esq.appendChild(U.el('div', 'when', t.descricao));
    var det = U.el('div', 'what');
    if (t.entrega) det.appendChild(document.createTextNode('entrega ' + U.dataCurta(t.entrega) + ' '));
    if (t.estado === 'por_fazer')    det.appendChild(U.etiqueta('por fazer'));
    if (t.estado === 'feito_aluno')  det.appendChild(U.etiqueta('diz que fez', 'warn'));
    if (t.estado === 'confirmado')   det.appendChild(U.etiqueta('confirmado · ' + t.nota + '/5', 'ok'));
    esq.appendChild(det);
    li.appendChild(esq);

    var dir = U.el('div', 'amt');
    if (t.estado !== 'confirmado')
      dir.appendChild(U.botao('Confirmar', 'btn pequeno', function () { formConfirmarTpc(t); }));
    dir.appendChild(apagador(function () {
      return db.apagar('tpcs', 'id=eq.' + t.id);
    }, 'Apagar este TPC?'));
    li.appendChild(dir);
    return li;
  }

  /* ============================================================
     Formulários — aluno, explicação, pagamento, nota, TPC, horário
     ============================================================ */
  function grava(botao, erro, promessa, aoAcabar) {
    botao.disabled = true;
    erro.textContent = '';
    return promessa.then(function () {
      return carrega();
    }).then(function () {
      pinta();
      if (aoAcabar) aoAcabar(); else U.fechaSheet();
    }).catch(function (e) {
      botao.disabled = false;
      erro.textContent = e.message;
    });
  }

  function opcoesPerfis(filtro) {
    var lista = d.perfis.filter(filtro).map(function (p) {
      return { v: p.id, t: p.nome + (p.ativo ? '' : ' (desativada)') };
    });
    lista.unshift({ v: '', t: '— sem conta ligada —' });
    return lista;
  }

  function formAluno(existente) {
    var a = existente || {};
    U.abreSheet(existente ? 'Editar ' + a.nome : 'Novo aluno', function (corpo) {
      var f = U.el('form');
      U.campo(f, 'Nome', U.entrada('f-nome', 'text', a.nome || ''));

      var dois = U.el('div', 'fields-2'); f.appendChild(dois);
      U.campo(dois, 'Ano', U.entrada('f-ano', 'text', a.ano || ''));
      var preco = U.campo(dois, 'Preço por hora (€)',
        U.entrada('f-preco', 'number', a.preco_hora != null ? a.preco_hora : 10));
      preco.step = '0.5'; preco.min = '0';

      U.campo(f, 'Disciplinas', U.entrada('f-disc', 'text', a.disciplinas || ''));

      U.campo(f, 'Conta do encarregado de educação',
        U.escolha('f-enc', opcoesPerfis(function (p) { return p.ve_conta_corrente && !p.is_admin; }),
                  a.encarregado_id || ''),
        'Só aparecem contas com permissão de ver a conta corrente.');

      U.campo(f, 'Conta do aluno',
        U.escolha('f-alu', opcoesPerfis(function (p) { return p.ve_materiais && !p.is_admin; }),
                  a.aluno_perfil_id || ''),
        'No perfil misto é a mesma conta das duas vezes.');

      U.campo(f, 'Notas', U.area('f-notas', a.notas || ''));

      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Gravar'); b.type = 'submit'; f.appendChild(b);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var nome = U.$('f-nome').value.trim();
        if (!nome) { erro.textContent = 'O nome é obrigatório.'; return; }
        var dados = {
          nome: nome,
          ano: U.$('f-ano').value.trim() || null,
          disciplinas: U.$('f-disc').value.trim() || null,
          preco_hora: Number(U.$('f-preco').value) || 0,
          encarregado_id: U.$('f-enc').value || null,
          aluno_perfil_id: U.$('f-alu').value || null,
          notas: U.$('f-notas').value.trim() || null
        };
        grava(b, erro, existente
          ? db.mudar('alunos', 'id=eq.' + a.id, dados)
          : db.criar('alunos', dados));
      });
      corpo.appendChild(f);
    });
  }

  /* --- registar explicação: vários alunos, valor por aluno (§91, §98) --- */
  function formExplicacao(pre) {
    pre = pre || {};
    var escolhidos = (pre.alunos || []).slice();

    U.abreSheet('Registar explicação', function (corpo) {
      var f = U.el('form');

      var dois = U.el('div', 'fields-2'); f.appendChild(dois);
      var data = U.campo(dois, 'Data', U.entrada('f-data', 'date', pre.data || U.hoje()));
      var dur = U.campo(dois, 'Duração', U.escolha('f-dur', [
        { v: 30, t: '30 min' }, { v: 45, t: '45 min' }, { v: 60, t: '1 hora' },
        { v: 90, t: '1h30' }, { v: 120, t: '2 horas' }
      ], pre.duracao_min || 60));

      f.appendChild(U.el('label', '', 'Alunos'));
      var lista = U.el('div', 'escolher');
      f.appendChild(lista);

      var valores = U.el('div', 'valores');
      f.appendChild(valores);

      // O valor sai do preço de tabela do aluno mas fica sempre editável,
      // e é o que ficar escrito aqui que é gravado — para sempre (§93, §101).
      function sugestao(a) {
        return Math.round(Number(a.preco_hora) * (Number(dur.value) / 60) * 100) / 100;
      }

      function desenhaValores() {
        U.limpa(valores);
        if (!escolhidos.length) return;
        valores.appendChild(U.el('label', '', 'Valor a debitar, por aluno'));
        escolhidos.forEach(function (id) {
          var a = aluno(id);
          var linha = U.el('div', 'valor-linha');
          linha.appendChild(U.el('span', 'valor-nome', a.nome));
          var i = U.entrada('v-' + id, 'number', sugestao(a));
          i.step = '0.5'; i.min = '0'; i.className = 'valor-input';
          linha.appendChild(i);
          linha.appendChild(U.el('span', 'valor-unid', '€'));
          valores.appendChild(linha);
        });
        valores.appendChild(U.el('p', 'dica',
          'Pré-preenchido pelo preço de tabela. Muda à vontade: é este número que fica gravado.'));
      }

      ativos().forEach(function (a) {
        var b = U.el('button', 'chip' + (escolhidos.indexOf(a.id) >= 0 ? ' on' : ''), a.nome);
        b.type = 'button';
        b.addEventListener('click', function () {
          var i = escolhidos.indexOf(a.id);
          if (i >= 0) escolhidos.splice(i, 1); else escolhidos.push(a.id);
          b.classList.toggle('on');
          desenhaValores();
        });
        lista.appendChild(b);
      });
      dur.addEventListener('change', desenhaValores);
      desenhaValores();

      U.campo(f, 'Sumário', U.area('f-sum', '', 'O que foi dado. O aluno e o encarregado leem isto.'));

      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Registar'); b.type = 'submit'; f.appendChild(b);
      f.appendChild(U.el('p', 'dica',
        'Registar é o mesmo que dizer que a explicação aconteceu: não há segundo passo.'));

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!escolhidos.length) { erro.textContent = 'Escolhe pelo menos um aluno.'; return; }
        var payload = escolhidos.map(function (id) {
          return { aluno_id: id, valor_eur: Number(U.$('v-' + id).value) || 0 };
        });
        grava(b, erro, db.funcao('registar_explicacao', {
          p_data: data.value || U.hoje(),
          p_duracao_min: Number(dur.value),
          p_sumario: U.$('f-sum').value,
          p_alunos: payload
        }), function () {
          U.fechaSheet();
          U.aviso('Explicação registada.');
        });
      });
      corpo.appendChild(f);
    });
  }

  function formPagamento(alunoId) {
    U.abreSheet('Registar pagamento', function (corpo) {
      var a = aluno(alunoId);
      var f = U.el('form');
      f.appendChild(U.el('p', 'dica', 'Um pagamento é só um crédito na conta de ' + a.nome +
        '. Não se liga a explicações nenhumas — o saldo resolve-se sozinho.'));

      var dois = U.el('div', 'fields-2'); f.appendChild(dois);
      U.campo(dois, 'Data', U.entrada('f-data', 'date', U.hoje()));
      var valor = U.campo(dois, 'Valor (€)', U.entrada('f-valor', 'number', ''));
      valor.step = '0.5'; valor.min = '0';

      var s = saldo(alunoId);
      if (s < 0) {
        var atalho = U.el('div', 'btn-row');
        atalho.style.marginBottom = '14px';
        atalho.appendChild(U.botao('Liquidar tudo (' + U.eur(-s) + ')', 'btn ghost', function () {
          valor.value = (-s).toFixed(2);
        }));
        f.appendChild(atalho);
      }

      U.campo(f, 'Nota', U.entrada('f-nota', 'text', ''), 'Ex.: MB Way, dinheiro, transferência.');

      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn amber', 'Gravar'); b.type = 'submit'; f.appendChild(b);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (valor.value === '') { erro.textContent = 'Falta o valor.'; return; }
        grava(b, erro, db.criar('pagamentos', {
          aluno_id: alunoId,
          data: U.$('f-data').value || U.hoje(),
          valor_eur: Number(valor.value) || 0,
          nota: U.$('f-nota').value.trim() || null
        }));
      });
      corpo.appendChild(f);
    });
  }

  function formNota(alunoId) {
    U.abreSheet('Importante para a próxima', function (corpo) {
      var f = U.el('form');
      f.appendChild(U.el('p', 'dica',
        'Fica visível no painel do aluno até registares a próxima explicação dele.'));
      var t = U.campo(f, null, U.area('f-texto', '', 'Ex.: trazer o caderno de Estudo do Meio.'));
      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Gravar'); b.type = 'submit'; f.appendChild(b);
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var texto = t.value.trim();
        if (!texto) { erro.textContent = 'Escreve alguma coisa.'; return; }
        grava(b, erro, db.criar('notas_proxima', { aluno_id: alunoId, texto: texto }));
      });
      corpo.appendChild(f);
    });
  }

  function formTpc(alunoId, existente) {
    var t = existente || {};
    U.abreSheet(existente ? 'Editar TPC' : 'Novo TPC', function (corpo) {
      var f = U.el('form');
      U.campo(f, 'Descrição', U.area('f-desc', t.descricao || '',
        'Ex.: exercícios 3 a 7 da página 42.'));
      U.campo(f, 'Data de entrega', U.entrada('f-entrega', 'date', t.entrega || ''),
        'Opcional.');

      f.appendChild(U.el('label', '', 'Materiais a associar'));
      f.appendChild(U.el('p', 'dica',
        'Só materiais já atribuídos a este aluno. O botão para os abrir aparece no painel dele.'));
      var escolhidos = [];
      var mats = materiaisDe(alunoId);
      var lista = U.el('div', 'escolher');
      if (!mats.length) lista.appendChild(U.el('p', 'dica', 'Ainda não há materiais atribuídos.'));
      mats.forEach(function (m) {
        var b = U.el('button', 'chip', m.titulo);
        b.type = 'button';
        b.addEventListener('click', function () {
          var i = escolhidos.indexOf(m.id);
          if (i >= 0) escolhidos.splice(i, 1); else escolhidos.push(m.id);
          b.classList.toggle('on');
        });
        lista.appendChild(b);
      });
      f.appendChild(lista);

      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Gravar'); b.type = 'submit'; f.appendChild(b);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var desc = U.$('f-desc').value.trim();
        if (!desc) { erro.textContent = 'Falta a descrição.'; return; }
        grava(b, erro, db.criar('tpcs', {
          aluno_id: alunoId,
          descricao: desc,
          entrega: U.$('f-entrega').value || null
        }).then(function (linhas) {
          var novo = linhas && linhas[0];
          if (!novo || !escolhidos.length) return;
          return db.criar('tpc_materiais', escolhidos.map(function (mid) {
            return { tpc_id: novo.id, material_id: mid };
          }));
        }));
      });
      corpo.appendChild(f);
    });
  }

  function formConfirmarTpc(t) {
    U.abreSheet('Confirmar TPC', function (corpo) {
      var f = U.el('form');
      f.appendChild(U.el('p', 'info', nomeAluno(t.aluno_id)));
      f.appendChild(U.el('p', 'nota-viva', t.descricao));
      U.campo(f, 'Nota de 0 a 5', U.escolha('f-nota',
        [0, 1, 2, 3, 4, 5].map(function (n) { return { v: n, t: String(n) }; }), 3));
      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Confirmar'); b.type = 'submit'; f.appendChild(b);
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        grava(b, erro, db.mudar('tpcs', 'id=eq.' + t.id, {
          estado: 'confirmado',
          nota: Number(U.$('f-nota').value),
          confirmado_em: new Date().toISOString()
        }));
      });
      corpo.appendChild(f);
    });
  }

  function formHorario(alunoId) {
    U.abreSheet('Linha de horário', function (corpo) {
      var f = U.el('form');
      f.appendChild(U.el('p', 'dica',
        'Serve para veres o dia e pré-preencher o registo. Nunca cria explicações sozinho.'));
      var dois = U.el('div', 'fields-2'); f.appendChild(dois);
      U.campo(dois, 'Dia', U.escolha('f-dia', [1, 2, 3, 4, 5, 6, 0].map(function (n) {
        return { v: n, t: U.nomeDia(n) };
      }), 1));
      U.campo(dois, 'Hora', U.entrada('f-hora', 'time', '17:00'));
      U.campo(f, 'Duração', U.escolha('f-dur', [
        { v: 30, t: '30 min' }, { v: 45, t: '45 min' }, { v: 60, t: '1 hora' },
        { v: 90, t: '1h30' }, { v: 120, t: '2 horas' }
      ], 60));
      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Gravar'); b.type = 'submit'; f.appendChild(b);
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        grava(b, erro, db.criar('horario', {
          aluno_id: alunoId,
          dia_semana: Number(U.$('f-dia').value),
          hora_inicio: U.$('f-hora').value,
          duracao_min: Number(U.$('f-dur').value)
        }));
      });
      corpo.appendChild(f);
    });
  }

  /* ============================================================
     Arquivar (§10)
     Não há eliminação. Apaga-se apenas o que é exclusivo deste
     aluno, com a lista à frente antes de confirmar (§191).
     ============================================================ */
  function formArquivar(a) {
    U.abreSheet('Arquivar ' + a.nome, function (corpo) {
      corpo.appendChild(U.el('p', 'dica',
        'O histórico de explicações, os sumários e o saldo final continuam consultáveis. ' +
        'O acesso à aplicação é cortado.'));

      var caixa = U.cartao('Ficheiros que vão ser apagados');
      caixa.appendChild(U.el('p', 'dica', 'A carregar...'));
      corpo.appendChild(caixa);

      var erro = U.el('div', 'err'); corpo.appendChild(erro);

      db.funcao('materiais_exclusivos', { p_aluno: a.id }).then(function (mats) {
        mats = mats || [];
        U.limpa(caixa);
        caixa.appendChild(U.el('h3', '', 'Ficheiros que vão ser apagados'));

        if (!mats.length) {
          caixa.appendChild(U.vazio('Nenhum. Todos os materiais deste aluno são partilhados com outros.'));
        } else {
          var bytes = 0;
          var ul = U.el('ul', 'hist');
          mats.forEach(function (m) {
            bytes += Number(m.tamanho_bytes) || 0;
            var li = U.el('li');
            var esq = U.el('div');
            esq.appendChild(U.el('div', 'when', m.titulo));
            esq.appendChild(U.el('div', 'what', U.tamanho(m.tamanho_bytes)));
            li.appendChild(esq);
            ul.appendChild(li);
          });
          caixa.appendChild(ul);
          caixa.appendChild(U.el('p', 'aviso-linha',
            mats.length + (mats.length === 1 ? ' ficheiro' : ' ficheiros') +
            ' · ' + U.tamanho(bytes) + ' · não há como voltar atrás'));
        }

        var b = U.botao('Arquivar' + (mats.length ? ' e apagar ' + mats.length : ''), 'btn danger',
          function () {
            var pergunta = mats.length
              ? 'Arquivar ' + a.nome + ' e apagar ' + mats.length + ' ficheiro(s)? Não dá para voltar atrás.'
              : 'Arquivar ' + a.nome + '?';
            if (!confirm(pergunta)) return;
            b.disabled = true;
            arquivar(a, mats).then(function () {
              U.fechaTudo();
              pinta();
              U.aviso(a.nome + ' arquivado.');
            }).catch(function (e) { b.disabled = false; erro.textContent = e.message; });
          });
        var linha = U.el('div', 'btn-row');
        linha.appendChild(b);
        corpo.appendChild(linha);
      }).catch(function (e) { erro.textContent = e.message; });
    });
  }

  function arquivar(a, mats) {
    var caminhos = mats.map(function (m) { return m.storage_path; });
    var passo = caminhos.length
      ? window.API.ficheiros.apagar(caminhos).then(function () {
          return db.apagar('materiais', 'id=in.(' + mats.map(function (m) { return m.id; }).join(',') + ')');
        })
      : Promise.resolve();

    return passo.then(function () {
      return db.mudar('alunos', 'id=eq.' + a.id, {
        arquivado: true,
        arquivado_em: new Date().toISOString(),
        saldo_final: saldo(a.id)
      });
    }).then(function () {
      // Cortar acessos: a conta do aluno sempre; a do encarregado só se
      // não lhe restar mais nenhum educando por arquivar (§187).
      var desligar = [];
      if (a.aluno_perfil_id && !outroAlunoVivo(a.aluno_perfil_id, a.id)) desligar.push(a.aluno_perfil_id);
      if (a.encarregado_id && a.encarregado_id !== a.aluno_perfil_id &&
          !outroAlunoVivo(a.encarregado_id, a.id)) desligar.push(a.encarregado_id);
      if (!desligar.length) return;
      return db.mudar('perfis', 'id=in.(' + desligar.join(',') + ')', { ativo: false });
    }).then(carrega);
  }

  function outroAlunoVivo(perfilId, excepto) {
    return d.alunos.some(function (x) {
      return x.id !== excepto && !x.arquivado &&
        (x.encarregado_id === perfilId || x.aluno_perfil_id === perfilId);
    });
  }

  /* ============================================================
     Vista: Registos (explicações e pagamentos)
     ============================================================ */
  function pintaRegistos() {
    var caixa = U.limpa(U.$('v-registos'));

    var acoes = U.el('div', 'btn-row');
    acoes.style.marginBottom = '16px';
    acoes.appendChild(U.botao('+ Explicação', 'btn', function () { formExplicacao({}); }));
    caixa.appendChild(acoes);

    /* --- resumo por mês --- */
    var porMes = {};
    d.explicacoes.forEach(function (e) {
      var k = e.data.slice(0, 7);
      porMes[k] = porMes[k] || { min: 0, debito: 0, credito: 0 };
      porMes[k].min += Number(e.duracao_min) || 0;
      (e.explicacao_alunos || []).forEach(function (ea) {
        porMes[k].debito += Number(ea.valor_eur) || 0;
      });
    });
    d.pagamentos.forEach(function (p) {
      var k = p.data.slice(0, 7);
      porMes[k] = porMes[k] || { min: 0, debito: 0, credito: 0 };
      porMes[k].credito += Number(p.valor_eur) || 0;
    });

    var cMes = U.cartao('Por mês');
    var chaves = Object.keys(porMes).sort().reverse().slice(0, 12);
    if (!chaves.length) cMes.appendChild(U.vazio('Ainda sem movimentos.'));
    else {
      var um = U.el('ul', 'hist');
      chaves.forEach(function (ym) {
        var m = porMes[ym];
        var li = U.el('li');
        var esq = U.el('div');
        esq.appendChild(U.el('div', 'when', U.mesLongo(ym)));
        esq.appendChild(U.el('div', 'what',
          U.horas(m.min) + ' dadas · ' + U.eur(m.debito) + ' debitados'));
        li.appendChild(esq);
        li.appendChild(U.el('div', 'amt plus', U.eur(m.credito)));
        um.appendChild(li);
      });
      cMes.appendChild(um);
      cMes.appendChild(U.el('p', 'dica', 'À direita, o dinheiro que entrou nesse mês.'));
    }
    caixa.appendChild(cMes);

    /* --- explicações --- */
    var cExp = U.cartao('Explicações');
    if (!d.explicacoes.length) cExp.appendChild(U.vazio('Ainda sem explicações.'));
    else {
      var ue = U.el('ul', 'hist');
      d.explicacoes.slice(0, 60).forEach(function (e) {
        var li = U.el('li');
        var esq = U.el('div');
        var quem = (e.explicacao_alunos || []).map(function (ea) { return nomeAluno(ea.aluno_id); });
        esq.appendChild(U.el('div', 'when', U.dataCurta(e.data) + ' · ' + quem.join(', ')));
        var det = [U.horas(e.duracao_min)];
        if (quem.length > 1) det.push('grupo de ' + quem.length);
        if (e.sumario) det.push(e.sumario);
        esq.appendChild(U.el('div', 'what', det.join(' · ')));
        li.appendChild(esq);
        var total = (e.explicacao_alunos || []).reduce(function (s, ea) {
          return s + (Number(ea.valor_eur) || 0);
        }, 0);
        var dir = U.el('div', 'amt minus', U.eur(total));
        dir.appendChild(apagador(function () {
          return db.apagar('explicacoes', 'id=eq.' + e.id);
        }, 'Apagar esta explicação? O débito desaparece da conta corrente de quem esteve presente.'));
        li.appendChild(dir);
        ue.appendChild(li);
      });
      cExp.appendChild(ue);
    }
    caixa.appendChild(cExp);

    /* --- pagamentos --- */
    var cPag = U.cartao('Pagamentos');
    if (!d.pagamentos.length) cPag.appendChild(U.vazio('Ainda sem pagamentos.'));
    else {
      var up = U.el('ul', 'hist');
      d.pagamentos.slice(0, 60).forEach(function (p) {
        var li = U.el('li');
        var esq = U.el('div');
        esq.appendChild(U.el('div', 'when', U.dataCurta(p.data) + ' · ' + nomeAluno(p.aluno_id)));
        esq.appendChild(U.el('div', 'what', p.nota || 'pagamento'));
        li.appendChild(esq);
        var dir = U.el('div', 'amt plus', U.eur(p.valor_eur));
        dir.appendChild(apagador(function () {
          return db.apagar('pagamentos', 'id=eq.' + p.id);
        }, 'Apagar este pagamento?'));
        li.appendChild(dir);
        up.appendChild(li);
      });
      cPag.appendChild(up);
    }
    caixa.appendChild(cPag);
  }

  /* ============================================================
     Vista: Materiais
     Biblioteca única, organizada por disciplina e ano (§130).
     ============================================================ */
  function quemTem(materialId) {
    return d.atribuicoes.filter(function (x) { return x.material_id === materialId; });
  }

  function pintaMateriais() {
    var caixa = U.limpa(U.$('v-materiais'));

    var acoes = U.el('div', 'btn-row');
    acoes.style.marginBottom = '16px';
    acoes.appendChild(U.botao('+ Carregar material', 'btn', formCarregar));
    caixa.appendChild(acoes);

    var bytes = d.materiais.reduce(function (s, m) { return s + (Number(m.tamanho_bytes) || 0); }, 0);
    var stats = U.el('div', 'stats');
    stats.appendChild(mini(String(d.materiais.length), 'ficheiros'));
    stats.appendChild(mini(U.tamanho(bytes), 'ocupado'));
    // O plano gratuito dá 1 GB; convém ver o fundo do poço antes de lá chegar.
    stats.appendChild(mini(Math.round(bytes / 10737418.24) / 100 + '%', 'de 1 GB',
      bytes > 805306368 ? 'debt' : (bytes > 536870912 ? 'warn' : '')));
    stats.appendChild(mini(String(d.atribuicoes.length), 'atribuições'));
    caixa.appendChild(stats);

    if (!d.materiais.length) {
      caixa.appendChild(U.vazio('Biblioteca vazia.'));
      return;
    }

    // Agrupar por disciplina e, dentro dela, por ano.
    var grupos = {};
    d.materiais.forEach(function (m) {
      var k = m.disciplina || 'Sem disciplina';
      (grupos[k] = grupos[k] || []).push(m);
    });

    Object.keys(grupos).sort().forEach(function (disc) {
      var c = U.cartao(disc);
      grupos[disc].sort(function (x, y) {
        return String(x.ano || '').localeCompare(String(y.ano || '')) ||
               x.titulo.localeCompare(y.titulo);
      }).forEach(function (m) {
        var quantos = quemTem(m.id).length;
        var b = U.el('button', 'row');
        b.type = 'button';
        b.appendChild(U.el('div', 'avatar ficheiro', '📄'));
        var main = U.el('div', 'main');
        main.appendChild(U.el('div', 'name', m.titulo));
        main.appendChild(U.el('div', 'meta',
          [m.ano ? m.ano + '.º ano' : null, U.tamanho(m.tamanho_bytes),
           quantos ? quantos + (quantos === 1 ? ' aluno' : ' alunos') : 'sem ninguém'
          ].filter(Boolean).join(' · ')));
        b.appendChild(main);
        b.addEventListener('click', function () { fichaMaterial(m.id); });
        c.appendChild(b);
      });
      caixa.appendChild(c);
    });
  }

  function material(id) {
    for (var i = 0; i < d.materiais.length; i++) if (d.materiais[i].id === id) return d.materiais[i];
    return null;
  }

  function fichaMaterial(id) {
    U.abreSheet(material(id) ? material(id).titulo : 'Material', function (corpo) {
      var m = material(id);
      if (!m) { corpo.appendChild(U.vazio('Já não existe.')); return; }

      var c = U.cartao('Ficha');
      info(c, 'Disciplina', m.disciplina);
      info(c, 'Ano', m.ano);
      info(c, 'Tamanho', U.tamanho(m.tamanho_bytes));
      info(c, 'Carregado', U.dataLonga(m.criado_em));
      corpo.appendChild(c);

      var acoes = U.el('div', 'btn-row');
      acoes.appendChild(U.botao('Abrir', 'btn ghost', function () {
        window.API.ficheiros.urlAssinado(m.storage_path).then(function (url) {
          window.open(url, '_blank', 'noopener');
        }).catch(U.falhou);
      }));
      acoes.appendChild(U.botao('Atribuir a alunos', 'btn', function () { formAtribuirAMaterial(m.id); }));
      corpo.appendChild(acoes);

      var cq = U.cartao('Quem o tem');
      var atrib = quemTem(m.id);
      if (!atrib.length) cq.appendChild(U.vazio('Ainda não foi atribuído a ninguém.'));
      else {
        var ul = U.el('ul', 'hist');
        atrib.forEach(function (x) {
          var li = U.el('li');
          var esq = U.el('div');
          esq.appendChild(U.el('div', 'when', nomeAluno(x.aluno_id)));
          var det = U.el('div', 'what');
          if (x.publicar_em && x.publicar_em > U.hoje())
            det.appendChild(U.etiqueta('aparece a ' + U.dataCurta(x.publicar_em), 'warn'));
          else det.appendChild(U.etiqueta('visível', 'ok'));
          esq.appendChild(det);
          li.appendChild(esq);
          var dir = U.el('div', 'amt');
          dir.appendChild(apagador(function () {
            return db.apagar('material_alunos',
              'material_id=eq.' + m.id + '&aluno_id=eq.' + x.aluno_id);
          }, 'Retirar este material a ' + nomeAluno(x.aluno_id) + '?'));
          li.appendChild(dir);
          ul.appendChild(li);
        });
        cq.appendChild(ul);
      }
      corpo.appendChild(cq);

      var fim = U.el('div', 'btn-row');
      fim.appendChild(U.botao('Apagar da biblioteca', 'btn danger', function () {
        if (!confirm('Apagar "' + m.titulo + '" e retirá-lo a ' + atrib.length +
                     ' aluno(s)? Não dá para voltar atrás.')) return;
        window.API.ficheiros.apagar([m.storage_path])
          .then(function () { return db.apagar('materiais', 'id=eq.' + m.id); })
          .then(carrega).then(function () { U.fechaTudo(); pinta(); U.aviso('Material apagado.'); })
          .catch(U.falhou);
      }));
      corpo.appendChild(fim);
    });
  }

  function formCarregar() {
    U.abreSheet('Carregar material', function (corpo) {
      var f = U.el('form');
      var fich = U.campo(f, 'Ficheiro', U.entrada('f-fich', 'file'),
        'PDF, PowerPoint, imagem, HTML — o que for. O aluno descarrega-o.');
      var titulo = U.campo(f, 'Título', U.entrada('f-titulo', 'text', ''));
      var dois = U.el('div', 'fields-2'); f.appendChild(dois);
      U.campo(dois, 'Disciplina', U.entrada('f-disc', 'text', ''));
      U.campo(dois, 'Ano', U.entrada('f-ano', 'text', ''));

      // O título vem do nome do ficheiro, para não haver dois passos.
      fich.addEventListener('change', function () {
        if (!titulo.value && fich.files[0])
          titulo.value = fich.files[0].name.replace(/\.[^.]+$/, '');
      });

      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Carregar'); b.type = 'submit'; f.appendChild(b);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var ficheiro = fich.files && fich.files[0];
        if (!ficheiro) { erro.textContent = 'Escolhe um ficheiro.'; return; }
        if (!titulo.value.trim()) { erro.textContent = 'Falta o título.'; return; }
        var caminho = window.API.ficheiros.caminhoPara(ficheiro.name);
        b.disabled = true;
        b.textContent = 'A carregar...';
        window.API.ficheiros.enviar(caminho, ficheiro).then(function () {
          return db.criar('materiais', {
            titulo: titulo.value.trim(),
            disciplina: U.$('f-disc').value.trim() || null,
            ano: U.$('f-ano').value.trim() || null,
            storage_path: caminho,
            tamanho_bytes: ficheiro.size
          });
        }).then(carrega).then(function () {
          pinta(); U.fechaSheet(); U.aviso('Material carregado.');
        }).catch(function (e) {
          b.disabled = false; b.textContent = 'Carregar'; erro.textContent = e.message;
        });
      });
      corpo.appendChild(f);
    });
  }

  /* --- atribuição nos dois sentidos (§136-139) --- */

  function formAtribuirAMaterial(materialId) {
    var jaTem = quemTem(materialId).map(function (x) { return x.aluno_id; });
    formAtribuir('Atribuir · ' + material(materialId).titulo,
      ativos().filter(function (a) { return jaTem.indexOf(a.id) < 0; })
              .map(function (a) { return { v: a.id, t: a.nome }; }),
      'Ainda não há alunos sem este material.',
      function (escolhidos, publicar) {
        return db.criar('material_alunos', escolhidos.map(function (id) {
          return { material_id: materialId, aluno_id: id, publicar_em: publicar };
        }));
      });
  }

  function formAtribuirAAluno(alunoId) {
    var jaTem = materiaisDe(alunoId).map(function (m) { return m.id; });
    formAtribuir('Atribuir materiais · ' + nomeAluno(alunoId),
      d.materiais.filter(function (m) { return jaTem.indexOf(m.id) < 0; })
                 .map(function (m) {
                   return { v: m.id, t: m.titulo + (m.disciplina ? ' · ' + m.disciplina : '') };
                 }),
      'Este aluno já tem tudo o que há na biblioteca.',
      function (escolhidos, publicar) {
        return db.criar('material_alunos', escolhidos.map(function (id) {
          return { material_id: id, aluno_id: alunoId, publicar_em: publicar };
        }));
      });
  }

  function formAtribuir(titulo, opcoes, vazio, gravar) {
    U.abreSheet(titulo, function (corpo) {
      if (!opcoes.length) { corpo.appendChild(U.vazio(vazio)); return; }
      var f = U.el('form');
      var escolhidos = [];
      var lista = U.el('div', 'escolher');
      opcoes.forEach(function (o) {
        var b = U.el('button', 'chip', o.t);
        b.type = 'button';
        b.addEventListener('click', function () {
          var i = escolhidos.indexOf(o.v);
          if (i >= 0) escolhidos.splice(i, 1); else escolhidos.push(o.v);
          b.classList.toggle('on');
        });
        lista.appendChild(b);
      });
      f.appendChild(lista);

      U.campo(f, 'Data de publicação', U.entrada('f-pub', 'date', ''),
        'Em branco, aparece já. Com data, só nesse dia e daí em diante.');

      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Atribuir'); b.type = 'submit'; f.appendChild(b);
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!escolhidos.length) { erro.textContent = 'Escolhe pelo menos um.'; return; }
        grava(b, erro, gravar(escolhidos, U.$('f-pub').value || null));
      });
      corpo.appendChild(f);
    });
  }

  /* ============================================================
     Vista: Contas
     Todas criadas por aqui; não há inscrição nem recuperação por
     email (§56-62). O Supabase guarda as passwords cifradas: nem
     tu as lês, só as substituis.
     ============================================================ */
  function pintaContas() {
    var caixa = U.limpa(U.$('v-contas'));

    var acoes = U.el('div', 'btn-row');
    acoes.style.marginBottom = '16px';
    acoes.appendChild(U.botao('+ Nova conta', 'btn', function () { formConta(null); }));
    acoes.appendChild(U.botao('A minha password', 'btn ghost', formMinhaPassword));
    caixa.appendChild(acoes);

    caixa.appendChild(U.el('p', 'dica',
      'Uma conta nova não vê nada até lhe dares permissões e a ligares a um aluno. ' +
      'Usa palavras-passe geradas para aqui, não as que o aluno já usa noutros sítios.'));

    var ordem = d.perfis.slice().sort(function (p, q) {
      return (q.is_admin ? 1 : 0) - (p.is_admin ? 1 : 0) || p.nome.localeCompare(q.nome);
    });

    ordem.forEach(function (p) {
      var b = U.el('button', 'row' + (p.ativo ? '' : ' inativo'));
      b.type = 'button';
      b.appendChild(U.el('div', 'avatar' + (p.is_admin ? ' admin' : ''), U.inicial(p.nome)));

      var main = U.el('div', 'main');
      main.appendChild(U.el('div', 'name', p.nome));
      var meta = U.el('div', 'meta');
      if (p.is_admin) meta.appendChild(U.etiqueta('administradora', 'ok'));
      if (p.ve_conta_corrente) meta.appendChild(U.etiqueta('conta corrente'));
      if (p.ve_materiais) meta.appendChild(U.etiqueta('materiais'));
      if (!p.is_admin && !p.ve_conta_corrente && !p.ve_materiais)
        meta.appendChild(U.etiqueta('sem permissões', 'bad'));
      if (!p.ativo) meta.appendChild(U.etiqueta('desativada', 'bad'));
      main.appendChild(meta);
      b.appendChild(main);

      var ligados = d.alunos.filter(function (a) {
        return a.encarregado_id === p.id || a.aluno_perfil_id === p.id;
      });
      var lado = U.el('div', 'side');
      lado.appendChild(U.el('div', 'saldo-l',
        ligados.length ? ligados.map(function (a) { return a.nome; }).join(', ') : 'sem aluno'));
      b.appendChild(lado);

      b.addEventListener('click', function () { formConta(p); });
      caixa.appendChild(b);
    });
  }

  function formConta(existente) {
    var p = existente || {};
    U.abreSheet(existente ? p.nome : 'Nova conta', function (corpo) {
      var f = U.el('form');

      U.campo(f, 'Nome', U.entrada('f-nome', 'text', p.nome || ''));

      if (!existente) {
        U.campo(f, 'Email', U.entrada('f-email', 'email', ''),
          'Serve só para entrar. Não é enviado nenhum email.');
        var pw = U.campo(f, 'Palavra-passe inicial', U.entrada('f-pw', 'text', geraPassword()),
          'Comunica-a tu. Não há recuperação por email: quem a perder fala contigo.');
        pw.setAttribute('autocomplete', 'off');
      }

      var perm = U.el('div', 'field');
      perm.appendChild(U.el('label', '', 'O que esta conta vê'));
      var cc = U.caixa('f-cc', 'Conta corrente do educando', !!p.ve_conta_corrente);
      var mm = U.caixa('f-mm', 'Materiais, TPCs e sumários', !!p.ve_materiais);
      perm.appendChild(cc);
      perm.appendChild(mm);
      perm.appendChild(U.el('p', 'dica',
        'Encarregado: só a primeira. Aluno: só a segunda. Perfil misto: as duas.'));
      f.appendChild(perm);

      if (existente && !p.is_admin) {
        var at = U.caixa('f-ativo', 'Conta ativa', p.ativo);
        f.appendChild(at);
      }

      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Gravar'); b.type = 'submit'; f.appendChild(b);

      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var nome = U.$('f-nome').value.trim();
        if (!nome) { erro.textContent = 'Falta o nome.'; return; }
        var permissoes = {
          nome: nome,
          ve_conta_corrente: cc.entrada.checked,
          ve_materiais: mm.entrada.checked
        };

        if (existente) {
          if (!p.is_admin) permissoes.ativo = U.$('f-ativo').checked;
          grava(b, erro, db.mudar('perfis', 'id=eq.' + p.id, permissoes));
          return;
        }

        var email = U.$('f-email').value.trim();
        var password = U.$('f-pw').value;
        if (!email) { erro.textContent = 'Falta o email.'; return; }
        if (password.length < 10) { erro.textContent = 'A palavra-passe precisa de 10 caracteres ou mais.'; return; }

        grava(b, erro, window.API.contas.criar(email, password, nome).then(function (r) {
          return db.mudar('perfis', 'id=eq.' + r.id, permissoes);
        }), function () {
          U.fechaSheet();
          // Depois de gravada não há forma de a voltar a ler: mostra-se agora.
          U.abreSheet('Conta criada', function (c2) {
            c2.appendChild(U.el('p', 'info', nome));
            var cx = U.cartao('Para dar a quem vai usar');
            cx.appendChild(U.el('p', 'credencial', email));
            cx.appendChild(U.el('p', 'credencial', password));
            cx.appendChild(U.el('p', 'dica',
              'Aponta isto agora. A palavra-passe fica cifrada no Supabase e ' +
              'não volta a aparecer — se se perder, defines outra.'));
            c2.appendChild(cx);
            var lig = U.el('div', 'btn-row');
            lig.appendChild(U.botao('Ligar a um aluno', 'btn', function () {
              U.fechaTudo(); mostra('alunos');
              U.aviso('Abre o aluno e escolhe a conta na ficha dele.');
            }));
            c2.appendChild(lig);
          });
        });
      });
      corpo.appendChild(f);

      if (existente) {
        var outra = U.el('div', 'btn-row');
        outra.style.marginTop = '18px';
        outra.appendChild(U.botao('Definir nova palavra-passe', 'btn ghost', function () {
          formNovaPassword(p);
        }));
        corpo.appendChild(outra);
      }
    });
  }

  function formNovaPassword(p) {
    U.abreSheet('Nova palavra-passe · ' + p.nome, function (corpo) {
      var f = U.el('form');
      f.appendChild(U.el('p', 'dica',
        'O Supabase guarda as palavras-passe cifradas — nem tu as consegues ler. ' +
        'O que se pode fazer é substituir.'));
      var pw = U.campo(f, 'Nova palavra-passe', U.entrada('f-pw', 'text', geraPassword()));
      var erro = U.el('div', 'err'); f.appendChild(erro);
      var b = U.el('button', 'btn', 'Definir'); b.type = 'submit'; f.appendChild(b);
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (pw.value.length < 10) { erro.textContent = 'Precisa de 10 caracteres ou mais.'; return; }
        b.disabled = true;
        window.API.contas.password(p.id, pw.value).then(function () {
          U.fechaSheet();
          U.aviso('Palavra-passe definida. Comunica-a a ' + p.nome + '.');
        }).catch(function (e) { b.disabled = false; erro.textContent = e.message; });
      });
      corpo.appendChild(f);
    });
  }

  function formMinhaPassword() {
    U.abreSheet('A minha palavra-passe', function (corpo) {
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
  }

  // Palavras-passe geradas aqui, para não haver a tentação de reaproveitar
  // uma que o aluno já use noutro serviço (§62).
  function geraPassword() {
    var letras = 'abcdefghijkmnopqrstuvwxyz';
    var palavras = ['lua', 'sol', 'rio', 'mar', 'pico', 'vento', 'norte', 'pedra', 'folha', 'ponte'];
    var bytes = new Uint32Array(4);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    var p1 = palavras[bytes[0] % palavras.length];
    var p2 = palavras[bytes[1] % palavras.length];
    var n = 100 + (bytes[2] % 900);
    var l = letras[bytes[3] % letras.length];
    return p1 + '-' + p2 + '-' + n + l;
  }

  /* ============================================================
     Navegação
     ============================================================ */
  var VISTAS = ['hoje', 'alunos', 'registos', 'materiais', 'contas'];
  var TITULOS = {
    hoje: 'Hoje', alunos: 'Alunos', registos: 'Registos',
    materiais: 'Materiais', contas: 'Contas'
  };

  function mostra(nome) {
    vista = nome;
    VISTAS.forEach(function (v) {
      U.$('v-' + v).classList.toggle('hidden', v !== nome);
    });
    Array.prototype.forEach.call(document.querySelectorAll('nav.tabs button'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-tab') === nome);
    });
    U.$('top-title').textContent = TITULOS[nome];
    window.scrollTo(0, 0);
    pinta();
  }

  function pinta() {
    if (vista === 'hoje') pintaHoje();
    else if (vista === 'alunos') pintaAlunos();
    else if (vista === 'registos') pintaRegistos();
    else if (vista === 'materiais') pintaMateriais();
    else if (vista === 'contas') pintaContas();
  }

  function iniciar(p) {
    perfil = p;
    var nav = U.$('tabs');
    U.limpa(nav);
    [['hoje', '🏠', 'Hoje'], ['alunos', '🧒', 'Alunos'], ['registos', '📚', 'Registos'],
     ['materiais', '📄', 'Materiais'], ['contas', '🔑', 'Contas']].forEach(function (t) {
      var b = U.el('button');
      b.type = 'button';
      b.setAttribute('data-tab', t[0]);
      b.appendChild(U.el('span', 'ico', t[1]));
      b.appendChild(document.createTextNode(t[2]));
      b.addEventListener('click', function () { mostra(t[0]); });
      nav.appendChild(b);
    });
    nav.classList.remove('hidden');

    return carrega().then(function () { mostra('hoje'); });
  }

  return { iniciar: iniciar };
})();
