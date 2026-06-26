/* uPlayback — shared site behaviour */
(function(){
  /* NAV light-on-scroll: light once past any .hero / .page-hero */
  var nav = document.getElementById('nav');
  var darkTop = document.querySelector('.hero, .page-hero');
  function onScroll(){
    if(!nav) return;
    var threshold = darkTop ? darkTop.offsetHeight - 80 : 40;
    nav.classList.toggle('light', window.scrollY > threshold);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* MOBILE MENU */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ links.classList.remove('open'); }); });
  }

  /* REVEAL */
  var ro = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); } });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){ ro.observe(el); });

  /* COUNTERS */
  function animateCount(el){
    var target = parseFloat(el.dataset.target), suffix = el.dataset.suffix || '';
    var dur = 1500, start = performance.now();
    (function step(now){
      var p = Math.min((now - start)/dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * target) + suffix;
      if(p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var numObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); numObs.unobserve(e.target); } });
  }, {threshold:0.5});
  document.querySelectorAll('[data-target]').forEach(function(el){ numObs.observe(el); });

  /* FAQ / BENTO toggle */
  window.toggleBento = function(el){
    var isOpen = el.classList.contains('open');
    document.querySelectorAll('.bento-item.open').forEach(function(b){ b.classList.remove('open'); });
    if(!isOpen) el.classList.add('open');
  };

  /* COOKIE CONSENT */
  function getConsent(){ try{ return localStorage.getItem('up_consent'); }catch(e){ return 'na'; } }
  function setConsent(v){ try{ localStorage.setItem('up_consent', v); }catch(e){} }
  if(getConsent() === null){
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role','dialog');
    banner.setAttribute('aria-label','Aviso de cookies');
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<div class="cookie-text"><strong>Este site usa armazenamento mínimo.</strong> ' +
        'Utilizamos apenas o necessário ao funcionamento do site e não fazemos rastreio publicitário. ' +
        'Saiba mais na <a href="/uplayback/privacidade/#cookies">Política de Privacidade</a>.</div>' +
        '<div class="cookie-actions">' +
          '<button type="button" class="btn btn-cookie-ghost" data-c="ess">Só essenciais</button>' +
          '<button type="button" class="btn btn-primary" data-c="all">Aceitar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function(){ banner.classList.add('show'); });
    function close(v){ setConsent(v); banner.classList.remove('show'); setTimeout(function(){ if(banner.parentNode) banner.parentNode.removeChild(banner); }, 400); }
    banner.querySelector('[data-c="all"]').addEventListener('click', function(){ close('all'); });
    banner.querySelector('[data-c="ess"]').addEventListener('click', function(){ close('essential'); });
  }
})();
