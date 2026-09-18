/* ============================================================
   mariaestuda — Explicações: arranque
   Entra, lê o perfil e decide que painel abrir. Quem manda é a
   linha em `perfis`, não o que o browser guardou.
   ============================================================ */
(function () {
  'use strict';

  var U = window.UI;

  function mostraLogin(mensagem) {
    U.$('gate').classList.remove('hidden');
    U.$('app').classList.add('hidden');
    U.fechaTudo();
    if (mensagem) U.$('gate-err').textContent = mensagem;
    U.$('gate-btn').disabled = false;
  }

  function abre(perfil) {
    U.$('gate').classList.add('hidden');
    U.$('app').classList.remove('hidden');
    U.$('top-nome').textContent = perfil.nome || '';

    if (perfil.is_admin) return window.ADMIN.iniciar(perfil);
    if (perfil.ve_conta_corrente || perfil.ve_materiais) return window.FAMILIA.iniciar(perfil);

    // Conta criada mas ainda sem permissões: é um estado normal, não um erro.
    U.$('app').classList.add('hidden');
    U.$('gate').classList.remove('hidden');
    U.$('gate-err').textContent =
      'A tua conta ainda não tem acesso a nada. Fala com a Maria.';
    window.API.sair();
    return Promise.resolve();
  }

  function carregaPerfil() {
    return window.API.utilizador().then(function (u) {
      return window.API.db.ler('perfis?select=*&id=eq.' + encodeURIComponent(u.id));
    }).then(function (linhas) {
      var perfil = linhas && linhas[0];
      if (!perfil) throw new Error('A tua conta ainda não está configurada. Fala com a Maria.');
      if (!perfil.ativo) throw new Error('Esta conta está desativada.');
      return perfil;
    });
  }

  function ligaEventos() {
    U.$('gate-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = U.$('gate-btn');
      U.$('gate-err').textContent = '';
      btn.disabled = true;
      window.API.entrar(U.$('gate-email').value.trim(), U.$('gate-pw').value)
        .then(carregaPerfil)
        .then(abre)
        .catch(function (e) {
          window.API.sair();
          mostraLogin(e.message);
        });
    });

    U.$('logout').addEventListener('click', function () {
      window.API.sair();
      location.reload();
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && U.sheetAberto()) U.fechaSheet();
    });
  }

  function arranca() {
    ligaEventos();
    if (!window.API.temSessao()) return;
    // Há sessão guardada: confirma que ainda serve antes de mostrar seja o que for.
    carregaPerfil()
      .then(abre)
      .catch(function () { window.API.sair(); mostraLogin(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca);
  else arranca();
})();
