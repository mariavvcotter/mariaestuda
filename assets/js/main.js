/* Revelação ao scroll, barra de topo, flashcards e quiz em slides. Sem dependências. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Revelação ao entrar no ecrã ---------- */
  var targets = document.querySelectorAll(".reveal, .tags");
  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        // as setas das palavras-chave entram uma a uma
        if (e.target.classList.contains("tags")) {
          Array.prototype.forEach.call(e.target.children, function (li, i) {
            li.style.transitionDelay = (i * 0.09) + "s";
            var paths = li.querySelectorAll("path");
            Array.prototype.forEach.call(paths, function (pth, j) {
              pth.style.animationDelay = (i * 0.09 + j * 0.12) + "s";
            });
          });
        }
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

  /* ---------- Flashcards: viram só ao clique ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
    var toggle = card.querySelector(".card-toggle");
    var close = card.querySelector(".card-close");
    // tudo o que é focável no verso, ligações incluídas
    var backFocusable = card.querySelectorAll(".card-back a, .card-back button");

    function setFlipped(on) {
      card.classList.toggle("flipped", on);
      toggle.setAttribute("aria-expanded", on ? "true" : "false");
      // a face escondida não deve apanhar o foco por tabulação
      toggle.tabIndex = on ? -1 : 0;
      Array.prototype.forEach.call(backFocusable, function (el) { el.tabIndex = on ? 0 : -1; });
    }

    setFlipped(false);
    toggle.addEventListener("click", function () { setFlipped(true); close.focus(); });
    if (close) close.addEventListener("click", function () { setFlipped(false); toggle.focus(); });
    card.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && card.classList.contains("flipped")) {
        setFlipped(false); toggle.focus();
      }
    });
  });

  /* ---------- Quiz em slides ---------- */
  var quiz = document.getElementById("quiz");
  if (!quiz) return;

  var slides = Array.prototype.slice.call(quiz.querySelectorAll(".slide"));
  var bar = document.getElementById("quizBar");
  var count = document.getElementById("quizCount");
  var prev = document.getElementById("quizPrev");
  var result = document.getElementById("result");
  var verdict = document.getElementById("resultVerdict");
  var body = document.getElementById("resultBody");
  var notes = document.getElementById("resultNotes");
  var reset = document.getElementById("quizReset");

  var TOTAL = slides.length;
  var at = 0;

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

  var track = document.getElementById("slides");

  // a caixa acompanha a altura do slide visível, em vez de ficar pela mais alta
  function fitHeight() {
    var active = slides[at];
    if (active) track.style.height = active.getBoundingClientRect().height + "px";
  }
  window.addEventListener("resize", fitHeight);

  function show(i, back) {
    slides.forEach(function (s, k) {
      s.classList.toggle("is-active", k === i);
      s.classList.toggle("leaving-left", k < i && !back);
      // só o slide visível é alcançável por tabulação
      Array.prototype.forEach.call(s.querySelectorAll("input"), function (inp) {
        inp.tabIndex = k === i ? 0 : -1;
      });
    });
    at = i;
    fitHeight();
    count.textContent = "Pergunta " + (i + 1) + " de " + TOTAL;
    bar.style.width = ((i + 1) / TOTAL * 100) + "%";
    prev.hidden = i === 0;
  }

  function finish() {
    var score = 0, strong = [], weak = [];
    slides.forEach(function (s) {
      var picked = s.querySelector("input:checked");
      if (!picked) return;
      var v = parseInt(picked.value, 10);
      var name = picked.name;
      score += v;
      if (v === 2 && STRENGTHS[name]) strong.push(STRENGTHS[name]);
      if (v === 0 && CAVEATS[name]) weak.push(CAVEATS[name]);
    });

    var max = TOTAL * 2;
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

    quiz.hidden = true;
    result.hidden = false;
    result.focus();
  }

  quiz.addEventListener("change", function (ev) {
    if (ev.target.type !== "radio") return;
    // deixa ver a escolha marcada antes de avançar
    var wait = reduced ? 0 : 320;
    setTimeout(function () {
      if (at < TOTAL - 1) show(at + 1);
      else finish();
    }, wait);
  });

  quiz.addEventListener("submit", function (ev) { ev.preventDefault(); });
  prev.addEventListener("click", function () { if (at > 0) show(at - 1, true); });

  reset.addEventListener("click", function () {
    quiz.reset();
    result.hidden = true;
    quiz.hidden = false;
    show(0);
    quiz.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  });

  show(0);
})();
