/* ============================================================
   mariaestuda — Explicações: peças de interface partilhadas
   Nada aqui sabe o que é um aluno ou uma explicação.
   ============================================================ */
window.UI = (function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function limpa(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }

  function botao(txt, cls, fn) {
    var b = el('button', cls || 'btn', txt);
    b.type = 'button';
    if (fn) b.addEventListener('click', fn);
    return b;
  }

  /* ---------------- datas, sempre em hora local ---------------- */

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function hoje() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  var MESES = ['janeiro','fevereiro','março','abril','maio','junho',
               'julho','agosto','setembro','outubro','novembro','dezembro'];
  var DIAS = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];

  function dataCurta(iso) {
    if (!iso) return '';
    var p = String(iso).slice(0, 10).split('-');
    return Number(p[2]) + ' ' + MESES[Number(p[1]) - 1].slice(0, 3);
  }

  function dataLonga(iso) {
    var p = String(iso).slice(0, 10).split('-');
    return Number(p[2]) + ' de ' + MESES[Number(p[1]) - 1] + ' de ' + p[0];
  }

  function mesLongo(ym) {
    var p = ym.split('-');
    return MESES[Number(p[1]) - 1] + ' de ' + p[0];
  }

  // Dia da semana de uma data ISO, sem passar por UTC.
  function diaSemana(iso) {
    var p = String(iso).slice(0, 10).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])).getDay();
  }

  function nomeDia(n) { return DIAS[n]; }

  function horaCurta(hhmmss) { return String(hhmmss || '').slice(0, 5); }

  /* ---------------- números ---------------- */

  function eur(v) {
    var n = Number(v) || 0;
    return n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function horas(min) {
    var h = (Number(min) || 0) / 60;
    var r = Math.round(h * 100) / 100;
    return (r % 1 === 0 ? String(r) : r.toLocaleString('pt-PT', { maximumFractionDigits: 2 })) + 'h';
  }

  function tamanho(bytes) {
    var b = Number(bytes) || 0;
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return Math.round(b / 1024) + ' KB';
    return (b / 1048576).toFixed(1).replace('.', ',') + ' MB';
  }

  /* ---------------- formulários ---------------- */

  function campo(pai, etiqueta, entrada, dica) {
    var d = el('div', 'field');
    if (etiqueta) {
      var l = el('label', '', etiqueta);
      if (entrada.id) l.htmlFor = entrada.id;
      d.appendChild(l);
    }
    d.appendChild(entrada);
    if (dica) d.appendChild(el('p', 'dica', dica));
    pai.appendChild(d);
    return entrada;
  }

  function entrada(id, tipo, valor) {
    var i = el('input');
    i.id = id;
    i.type = tipo || 'text';
    if (valor != null) i.value = valor;
    return i;
  }

  function area(id, valor, marcador) {
    var t = el('textarea');
    t.id = id;
    if (valor != null) t.value = valor;
    if (marcador) t.placeholder = marcador;
    return t;
  }

  function escolha(id, opcoes, valor) {
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

  function caixa(id, etiqueta, marcada) {
    var l = el('label', 'check');
    var c = el('input');
    c.type = 'checkbox';
    c.id = id;
    c.checked = !!marcada;
    l.appendChild(c);
    l.appendChild(document.createTextNode(etiqueta));
    l.entrada = c;
    return l;
  }

  /* ---------------- ecrã de formulário ---------------- */

  var pilha = [];

  function abreSheet(titulo, constroi) {
    var s = $('sheet');
    limpa(s);

    var topo = el('div', 'sheet-top');
    topo.appendChild(el('h2', '', titulo));
    topo.appendChild(botao(pilha.length ? 'Voltar' : 'Fechar', '', fechaSheet));
    s.appendChild(topo);

    var corpo = el('div', 'sheet-body');
    s.appendChild(corpo);

    pilha.push({ titulo: titulo, constroi: constroi });
    constroi(corpo);

    s.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    s.scrollTop = 0;
  }

  // Fechar volta ao ecrã anterior, quando houve um — abrir a ficha de
  // um aluno a partir do painel e fechar o formulário de pagamento não
  // pode atirar a pessoa de volta ao princípio.
  function fechaSheet() {
    pilha.pop();
    var anterior = pilha.pop();
    if (anterior) { abreSheet(anterior.titulo, anterior.constroi); return; }
    var s = $('sheet');
    s.classList.add('hidden');
    limpa(s);
    document.body.style.overflow = '';
  }

  function fechaTudo() {
    pilha = [];
    var s = $('sheet');
    s.classList.add('hidden');
    limpa(s);
    document.body.style.overflow = '';
  }

  // Volta a desenhar o ecrã que está aberto, depois de uma gravação.
  function refrescaSheet() {
    var actual = pilha.pop();
    if (!actual) return;
    abreSheet(actual.titulo, actual.constroi);
  }

  function sheetAberto() { return !$('sheet').classList.contains('hidden'); }

  /* ---------------- avisos ---------------- */

  function aviso(texto, tipo) {
    var n = $('aviso');
    n.textContent = texto;
    n.className = 'aviso ' + (tipo || 'ok');
    n.classList.remove('hidden');
    clearTimeout(aviso._t);
    aviso._t = setTimeout(function () { n.classList.add('hidden'); }, 4000);
  }

  function falhou(e) { aviso(e && e.message ? e.message : 'Correu mal.', 'mau'); }

  function vazio(texto) { return el('div', 'empty', texto); }

  function cartao(titulo) {
    var c = el('div', 'card');
    if (titulo) c.appendChild(el('h3', '', titulo));
    return c;
  }

  function etiqueta(texto, tipo) { return el('span', 'tag' + (tipo ? ' ' + tipo : ''), texto); }

  function inicial(nome) { return (nome || '?').trim().charAt(0).toUpperCase(); }

  return {
    $: $, el: el, limpa: limpa, botao: botao,
    hoje: hoje, dataCurta: dataCurta, dataLonga: dataLonga, mesLongo: mesLongo,
    diaSemana: diaSemana, nomeDia: nomeDia, horaCurta: horaCurta,
    eur: eur, horas: horas, tamanho: tamanho,
    campo: campo, entrada: entrada, area: area, escolha: escolha, caixa: caixa,
    abreSheet: abreSheet, fechaSheet: fechaSheet, fechaTudo: fechaTudo,
    refrescaSheet: refrescaSheet, sheetAberto: sheetAberto,
    aviso: aviso, falhou: falhou, vazio: vazio, cartao: cartao,
    etiqueta: etiqueta, inicial: inicial
  };
})();
