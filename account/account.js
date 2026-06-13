/* ============================================================
   mariaestuda — conta partilhada (login OPCIONAL, Nome + PIN)
   ------------------------------------------------------------
   Uma única conta serve todas as secções (mesma origem →
   sessão partilhada). Cada secção sincroniza as SUAS chaves
   de localStorage para a coluna `progress` (JSON) da tabela,
   numa fatia com o nome da secção:
       progress = { "edc": {chaveLS: valor, ...}, "eco": {...} }

   Uso numa secção:
     <link rel="stylesheet" href="/account/account.css">
     <script src="/account/config.js"></script>
     <script src="/account/account.js"></script>
     <script>
       Account.init({
         section: 'eco',
         keys: ['eco_progress', 'eco_xp'],   // chaves localStorage a sincronizar
         mount: '#user-slot',                 // onde inserir o chip (opcional)
         accent: '#4A9B8E',                   // cor (opcional)
       });
     </script>

   Login é sempre OPCIONAL: a app funciona como convidado.
   Ao entrar, o progresso remoto é aplicado e a página recarrega.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.MARIAESTUDA_CONFIG || window.EDC_CONFIG || {};
  var URL = (CFG.SUPABASE_URL || '').replace(/\/+$/, '');
  var KEY = CFG.SUPABASE_ANON_KEY || '';
  var TABLE = CFG.TABLE || 'edc_users';
  var REMOTE = !!(URL && KEY && !/COLA_AQUI/.test(URL) && !/COLA_AQUI/.test(KEY));
  var ENDPOINT = REMOTE ? URL + '/rest/v1/' + TABLE : '';
  var HEADERS = REMOTE ? {
    'apikey': KEY,
    'Authorization': 'Bearer ' + KEY,
    'Content-Type': 'application/json',
  } : {};

  /* chaves de sessão partilhadas (não prefixadas por secção) */
  var SESSION_KEY = 'mariaestuda_user';
  var ACCOUNTS_KEY = 'mariaestuda_accounts'; // só usado em modo local (sem Supabase)

  /* preservar o setItem original para gravações internas não dispararem sync */
  var rawSetItem = Storage.prototype.setItem.bind(localStorage);

  /* ---------- estado do módulo ---------- */
  var opts = null;          // opções da secção atual
  var fullProgress = {};    // cópia em memória do progress remoto (todas as secções)
  var syncTimer = null;
  var listeners = { login: [], logout: [] };

  /* ---------- helpers de sessão ---------- */
  function currentUser() {
    return localStorage.getItem(SESSION_KEY) ||
           localStorage.getItem('edc_current_user') || null; // adota sessão antiga do edc
  }
  function setSession(name) { rawSetItem(SESSION_KEY, name); }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    try { localStorage.removeItem('edc_current_user'); } catch (e) {}
  }

  /* ---------- modo local (sem Supabase) ---------- */
  function loadAccounts() {
    try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveAccounts(a) { try { rawSetItem(ACCOUNTS_KEY, JSON.stringify(a)); } catch (e) {} }

  /* ---------- Supabase REST ---------- */
  function sbGetUser(key) {
    var url = ENDPOINT + '?username_key=eq.' + encodeURIComponent(key) + '&select=name,pin,progress';
    return fetch(url, { headers: HEADERS }).then(function (r) {
      if (!r.ok) throw new Error('rede');
      return r.json();
    }).then(function (rows) { return rows[0] || null; });
  }
  function sbCreateUser(key, name, pin, progress) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: Object.assign({ 'Prefer': 'return=minimal' }, HEADERS),
      body: JSON.stringify({ username_key: key, name: name, pin: pin, progress: progress }),
    }).then(function (r) {
      if (r.status === 409) return 'exists';
      if (!r.ok) throw new Error('rede');
      return 'ok';
    });
  }
  function sbPatchProgress(key, progress, keepalive) {
    return fetch(ENDPOINT + '?username_key=eq.' + encodeURIComponent(key), {
      method: 'PATCH',
      headers: Object.assign({ 'Prefer': 'return=minimal' }, HEADERS),
      body: JSON.stringify({ progress: progress, updated_at: new Date().toISOString() }),
      keepalive: !!keepalive,
    });
  }

  /* ---- registo de utilização (visitas por secção) ---- */
  var EVENTS_ENDPOINT = REMOTE ? URL + '/rest/v1/usage_events' : '';
  function logVisit() {
    if (!REMOTE) return;
    try {
      fetch(EVENTS_ENDPOINT, {
        method: 'POST',
        headers: Object.assign({ 'Prefer': 'return=minimal' }, HEADERS),
        body: JSON.stringify({ section: opts.section, user_name: currentUser() }),
        keepalive: true,
      }).catch(function () {});
    } catch (e) {}
  }

  /* ---------- fatia (slice) de localStorage da secção ---------- */
  // Lê as chaves configuradas do localStorage para um objeto { chave: valorString }.
  function readLocalSlice() {
    var slice = {};
    (opts.keys || []).forEach(function (k) {
      var v = localStorage.getItem(k);
      if (v !== null) slice[k] = v;
    });
    return slice;
  }
  // Escreve uma slice no localStorage (sem disparar sync).
  function writeLocalSlice(slice) {
    (opts.keys || []).forEach(function (k) {
      if (slice && Object.prototype.hasOwnProperty.call(slice, k) && slice[k] != null) {
        rawSetItem(k, slice[k]);
      } else {
        try { localStorage.removeItem(k); } catch (e) {}
      }
    });
  }
  function clearLocalKeys() {
    (opts.keys || []).forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
  }

  /* ---------- sincronização (push) ---------- */
  function scheduleSync() {
    if (!REMOTE || !currentUser()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { flushSync(false); }, 1500);
  }
  function flushSync(keepalive) {
    clearTimeout(syncTimer); syncTimer = null;
    if (!REMOTE || !currentUser()) return;
    fullProgress[opts.section] = readLocalSlice();
    sbPatchProgress(currentUser().toLowerCase(), fullProgress, keepalive).catch(function () {});
  }

  /* intercetar gravações nas chaves seguidas → agenda push */
  function installStorageHook() {
    var tracked = {};
    (opts.keys || []).forEach(function (k) { tracked[k] = true; });
    var proto = Storage.prototype;
    if (proto.__accPatched) return;
    var original = proto.setItem;
    proto.setItem = function (k, v) {
      original.call(this, k, v);
      if (this === localStorage && tracked[k]) scheduleSync();
    };
    proto.__accPatched = true;
  }

  /* ---------- aplicar progresso remoto à secção atual ---------- */
  function applyRemoteToLocal(remoteProgress) {
    fullProgress = (remoteProgress && typeof remoteProgress === 'object') ? remoteProgress : {};
    var slice = fullProgress[opts.section];
    if (slice == null && typeof opts.migrate === 'function') {
      slice = opts.migrate(fullProgress);     // adaptador de dados antigos (ex.: edc)
      if (slice) fullProgress = {};            // descarta formato legado; passa a namespaced
    }
    if (slice && typeof slice === 'object') writeLocalSlice(slice);
  }

  /* ============================================================
     UI — chip no cabeçalho + overlay de login/registo
     ============================================================ */
  var authMode = 'login';
  var els = {};

  function buildOverlay() {
    if (els.overlay) return;
    var ov = document.createElement('div');
    ov.className = 'acc-overlay';
    ov.innerHTML =
      '<div class="acc-card" role="dialog" aria-modal="true">' +
        '<button class="acc-close" type="button" aria-label="Fechar">×</button>' +
        '<div class="acc-logo">' + esc(opts.label || 'mariaestuda') + '</div>' +
        '<h2 class="acc-title"></h2>' +
        '<p class="acc-sub"></p>' +
        '<form autocomplete="off" novalidate>' +
          '<label class="acc-label">Nome de utilizador</label>' +
          '<input class="acc-input acc-user-in" type="text" maxlength="20" placeholder="o teu nome" autocapitalize="off" spellcheck="false">' +
          '<label class="acc-label">PIN</label>' +
          '<input class="acc-input acc-pin-in" type="password" inputmode="numeric" maxlength="8" placeholder="4 a 8 dígitos">' +
          '<div class="acc-error"></div>' +
          '<button class="acc-submit" type="submit"></button>' +
        '</form>' +
        '<div class="acc-switch"><span class="acc-switch-text"></span> <a class="acc-switch-btn"></a></div>' +
        '<p class="acc-note">⚠ Sem segurança real — o PIN serve apenas para separar perfis de estudo e sincronizar entre dispositivos.</p>' +
      '</div>';
    document.body.appendChild(ov);
    els.overlay = ov;
    els.card = ov.querySelector('.acc-card');
    els.title = ov.querySelector('.acc-title');
    els.sub = ov.querySelector('.acc-sub');
    els.form = ov.querySelector('form');
    els.userIn = ov.querySelector('.acc-user-in');
    els.pinIn = ov.querySelector('.acc-pin-in');
    els.error = ov.querySelector('.acc-error');
    els.submit = ov.querySelector('.acc-submit');
    els.switchText = ov.querySelector('.acc-switch-text');
    els.switchBtn = ov.querySelector('.acc-switch-btn');

    ov.querySelector('.acc-close').addEventListener('click', closeOverlay);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeOverlay(); });
    els.switchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setAuthMode(authMode === 'login' ? 'signup' : 'login');
    });
    els.form.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ov.classList.contains('open')) closeOverlay();
    });
  }

  function setAuthMode(mode) {
    authMode = mode;
    els.error.textContent = '';
    var t = mode === 'signup';
    els.title.textContent = t ? 'Criar conta' : 'Entrar';
    els.sub.textContent = t ? 'Escolhe um nome e um PIN para guardar o teu progresso' : 'Inicia sessão para recuperar o teu progresso';
    els.submit.textContent = t ? 'Criar conta' : 'Entrar';
    els.switchText.textContent = t ? 'Já tens conta?' : 'Ainda não tens conta?';
    els.switchBtn.textContent = t ? 'Entrar' : 'Criar conta';
  }
  function openOverlay() {
    buildOverlay();
    setAuthMode('login');
    els.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { els.userIn.focus(); }, 60);
  }
  function closeOverlay() {
    if (!els.overlay) return;
    els.overlay.classList.remove('open');
    document.body.style.overflow = '';
    els.error.textContent = '';
  }

  function onSubmit(e) {
    e.preventDefault();
    var name = els.userIn.value.trim();
    var pin = els.pinIn.value.trim();
    els.error.textContent = '';
    if (name.length < 2) { els.error.textContent = 'O nome precisa de pelo menos 2 caracteres.'; return; }
    if (!/^\d{4,8}$/.test(pin)) { els.error.textContent = 'O PIN tem de ter 4 a 8 dígitos.'; return; }
    var key = name.toLowerCase();

    if (!REMOTE) { return submitLocal(key, name, pin); }

    els.submit.disabled = true;
    var label = els.submit.textContent;
    els.submit.textContent = '…';
    var done = function () { els.submit.disabled = false; els.submit.textContent = label; };

    if (authMode === 'signup') {
      // mantém o progresso atual (convidado) como progresso inicial da conta
      var initial = {}; initial[opts.section] = readLocalSlice();
      sbCreateUser(key, name, pin, initial).then(function (res) {
        if (res === 'exists') { els.error.textContent = 'Esse nome já existe — escolhe outro ou inicia sessão.'; done(); return; }
        finishLogin(name, null, /*keepLocal*/ true);
      }).catch(function () { els.error.textContent = 'Sem ligação ao servidor. Tenta de novo.'; done(); });
    } else {
      sbGetUser(key).then(function (user) {
        if (!user) { els.error.textContent = 'Utilizador não encontrado. Cria uma conta primeiro.'; done(); return; }
        if (String(user.pin) !== pin) { els.error.textContent = 'PIN incorreto.'; done(); return; }
        finishLogin(user.name, user.progress, /*keepLocal*/ false);
      }).catch(function () { els.error.textContent = 'Sem ligação ao servidor. Tenta de novo.'; done(); });
    }
  }

  function submitLocal(key, name, pin) {
    var accounts = loadAccounts();
    if (authMode === 'signup') {
      if (accounts[key]) { els.error.textContent = 'Esse nome já existe — escolhe outro ou inicia sessão.'; return; }
      accounts[key] = { name: name, pin: pin }; saveAccounts(accounts);
      finishLogin(name, null, true);
    } else {
      if (!accounts[key]) { els.error.textContent = 'Utilizador não encontrado. Cria uma conta primeiro.'; return; }
      if (accounts[key].pin !== pin) { els.error.textContent = 'PIN incorreto.'; return; }
      finishLogin(accounts[key].name, null, true);
    }
  }

  // keepLocal=true → conserva o localStorage atual (signup do convidado);
  // keepLocal=false → aplica a slice remota por cima do local (login existente).
  function finishLogin(name, remoteProgress, keepLocal) {
    setSession(name);
    if (!keepLocal && remoteProgress !== null) applyRemoteToLocal(remoteProgress);
    location.reload();
  }

  function logout() {
    if (REMOTE && syncTimer) flushSync(true);
    clearSession();
    clearLocalKeys();          // convidado recomeça limpo
    location.reload();
  }

  /* ---------- chip ---------- */
  function renderChip() {
    var host = null;
    if (opts.mount) host = (typeof opts.mount === 'string') ? document.querySelector(opts.mount) : opts.mount;
    var chip = els.chip;
    if (!chip) {
      chip = document.createElement('span');
      chip.className = 'acc-chip';
      if (host) host.appendChild(chip);
      else {
        chip.style.position = 'fixed';
        chip.style.top = '12px';
        chip.style.right = '12px';
        chip.style.zIndex = '9998';
        document.body.appendChild(chip);
      }
      els.chip = chip;
    }
    var u = currentUser();
    if (u) {
      chip.innerHTML =
        '<span class="acc-user"><span class="acc-user-avatar">' + esc(u[0].toUpperCase()) + '</span>' + esc(u) + '</span>' +
        '<button class="acc-btn acc-btn-ghost acc-logout" type="button" title="Terminar sessão">Sair</button>';
      chip.querySelector('.acc-logout').addEventListener('click', logout);
    } else {
      chip.innerHTML = '<button class="acc-btn acc-login" type="button">Entrar</button>';
      chip.querySelector('.acc-login').addEventListener('click', openOverlay);
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ============================================================
     API pública
     ============================================================ */
  var Account = {
    init: function (options) {
      opts = Object.assign({ section: 'default', keys: [], label: 'mariaestuda' }, options || {});
      if (opts.accent) document.documentElement.style.setProperty('--acc-accent', opts.accent);
      if (opts.accentInk) document.documentElement.style.setProperty('--acc-accent-ink', opts.accentInk);
      // migra sessão antiga do edc para a chave partilhada
      var legacy = localStorage.getItem('edc_current_user');
      if (legacy && !localStorage.getItem(SESSION_KEY)) setSession(legacy);

      installStorageHook();
      logVisit();

      var start = function () { renderChip(); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
      else start();

      window.addEventListener('beforeunload', function () { if (syncTimer) flushSync(true); });
      return Account;
    },
    open: openOverlay,
    logout: logout,
    isRemote: function () { return REMOTE; },
    user: function () { return currentUser(); },
    on: function (ev, cb) { if (listeners[ev]) listeners[ev].push(cb); return Account; },
  };

  window.Account = Account;
})();
