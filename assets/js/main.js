/* Revelação ao scroll, barra de topo, flashcards e quiz. Sem dependências. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Revelação ao entrar no ecrã ---------- */
  var targets = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---------- Barra de topo ---------- */
  var topbar = document.getElementById("topbar");
  var hero = document.getElementById("top");
  if (topbar && hero) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        topbar.classList.toggle("show", !entries[0].isIntersecting);
      }, { rootMargin: "-70% 0px 0px 0px" }).observe(hero);
    } else {
      var onScroll = function () {
        topbar.classList.toggle("show", window.scrollY > window.innerHeight * 0.5);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---------- Flashcards ----------
     O hover trata do rato via CSS. Aqui só o toque e o teclado, que precisam
     de um estado explícito para o cartão ficar virado. */
  Array.prototype.forEach.call(document.querySelectorAll(".card-btn"), function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  /* ---------- Quiz ---------- */
  var quiz = document.getElementById("quiz");
  if (!quiz) return;

  var status = document.getElementById("quizStatus");
  var submit = document.getElementById("quizSubmit");
  var result = document.getElementById("result");
  var verdict = document.getElementById("resultVerdict");
  var body = document.getElementById("resultBody");
  var notes = document.getElementById("resultNotes");
  var reset = document.getElementById("quizReset");

  var QUESTIONS = ["q1", "q2", "q3", "q4", "q5"];

  /* Cada resposta vale 0, 1 ou 2. As ressalvas existem para o resultado ser
     útil em vez de bajulador: um desencontro real é dito, não escondido. */
  var CAVEATS = {
    q1: "A vaga é presencial todos os dias. Procuro remoto, com deslocações pontuais ou regulares mas reduzidas.",
    q3: "A vaga pede execução sem margem de proposta. Rendo mais quando posso sugerir, mas cumpro um processo fixo se for isso que precisa.",
    q4: "A vaga prefere evitar IA. Trabalho na mesma sem ela, embora seja aí que consigo a diferença de velocidade.",
    q5: "A vaga pede mais de cinco anos de experiência formal. Este seria o meu primeiro vínculo, ainda que o trabalho já venha de trás."
  };
  var STRENGTHS = {
    q1: "Trabalho remoto é exatamente o que procuro.",
    q2: "Conteúdo e marketing são o centro daquilo que faço.",
    q3: "Autonomia é onde rendo mais: proponho em vez de esperar.",
    q4: "Uso IA a um nível que transforma semanas de trabalho em horas.",
    q5: "Sem exigência de anos formais, o que conta é o trabalho, e esse mostro-o."
  };

  function answered() {
    return QUESTIONS.filter(function (n) {
      return quiz.querySelector('input[name="' + n + '"]:checked');
    });
  }

  function refresh() {
    var n = QUESTIONS.length - answered().length;
    submit.disabled = n > 0;
    status.textContent = n === 0
      ? "Prontas as 5 respostas."
      : "Falta" + (n === 1 ? " 1 resposta." : "m " + n + " respostas.");
  }

  quiz.addEventListener("change", refresh);
  refresh();

  quiz.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (answered().length < QUESTIONS.length) return;

    var score = 0, strong = [], weak = [];
    QUESTIONS.forEach(function (name) {
      var v = parseInt(quiz.querySelector('input[name="' + name + '"]:checked').value, 10);
      score += v;
      if (v === 2 && STRENGTHS[name]) strong.push(STRENGTHS[name]);
      if (v === 0 && CAVEATS[name]) weak.push(CAVEATS[name]);
    });

    var max = QUESTIONS.length * 2;
    if (weak.length >= 2) {
      verdict.textContent = "Provavelmente não sou a pessoa certa.";
      body.textContent = "Há mais do que um ponto de fundo que não bate certo. Prefiro dizê-lo agora a fazer-lhe perder tempo numa entrevista.";
    } else if (weak.length === 1) {
      verdict.textContent = "Encaixo, com uma ressalva.";
      body.textContent = "A maior parte do que procura é aquilo que faço. Fica um ponto por resolver, e vale a pena falarmos sobre ele antes de mais.";
    } else if (score >= max - 2) {
      verdict.textContent = "Encaixo bem.";
      body.textContent = "Aquilo que descreve é a função que procuro, nas condições em que trabalho melhor. Faz sentido conversarmos.";
    } else {
      verdict.textContent = "Encaixo na maior parte.";
      body.textContent = "Nada do que respondeu é impeditivo. Alguns pontos ficam a meio caminho, e resolvem-se numa conversa.";
    }

    notes.innerHTML = "";
    var keep = weak.length >= 2 ? 2 : 3;
    weak.concat(strong.slice(0, keep)).forEach(function (text, i) {
      var li = document.createElement("li");
      if (i < weak.length) li.className = "warn";
      li.textContent = text;
      notes.appendChild(li);
    });

    result.hidden = false;
    result.focus();
  });

  reset.addEventListener("click", function () {
    quiz.reset();
    result.hidden = true;
    refresh();
    quiz.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  });
})();
