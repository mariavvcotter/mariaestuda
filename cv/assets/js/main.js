/* Revelação ao scroll + barra de topo. Sem dependências. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Revelação de elementos ao entrar no ecrã --- */
  var targets = document.querySelectorAll(".reveal, .xp, .edu");

  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* --- Barra de topo: aparece depois do hero --- */
  var topbar = document.getElementById("topbar");
  var hero = document.getElementById("top");
  if (!topbar || !hero) return;

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
})();
