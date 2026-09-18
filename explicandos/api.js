/* ============================================================
   mariaestuda — Explicações: conversa com o Supabase
   ------------------------------------------------------------
   Sem SDK e sem passo de compilação: GoTrue para a sessão,
   PostgREST para os dados, Storage para os ficheiros. Tudo o
   que este ficheiro faz passa pelas políticas do schema.sql —
   se uma consulta devolver menos do que esperavas, a resposta
   está lá, não aqui.
   ============================================================ */
window.API = (function () {
  'use strict';

  var CFG = window.EXPLICANDOS_CONFIG || {};
  var REST    = CFG.SUPABASE_URL + '/rest/v1/';
  var AUTH    = CFG.SUPABASE_URL + '/auth/v1/';
  var STORAGE = CFG.SUPABASE_URL + '/storage/v1/';
  var BUCKET  = 'materiais';
  var CHAVE_SESSAO = 'explicandos.sessao';

  var sessao = null;

  /* ---------------- sessão ---------------- */

  function guarda(s) {
    sessao = {
      access_token: s.access_token,
      refresh_token: s.refresh_token,
      // 60 s de margem, para não usar um token que expira a meio do pedido
      expira_em: Date.now() + (s.expires_in || 3600) * 1000 - 60000
    };
    try { localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao)); } catch (e) {}
  }

  function lida() {
    try { return JSON.parse(localStorage.getItem(CHAVE_SESSAO) || 'null'); } catch (e) { return null; }
  }

  function esquece() {
    sessao = null;
    try { localStorage.removeItem(CHAVE_SESSAO); } catch (e) {}
  }

  function respostaAuth(r) {
    return r.json().then(function (j) {
      if (!r.ok) {
        var m = j.error_description || j.msg || j.message || 'Não foi possível entrar.';
        if (/invalid login/i.test(m)) m = 'Email ou palavra-passe errados.';
        throw new Error(m);
      }
      guarda(j);
      return j;
    });
  }

  function entrar(email, password) {
    return fetch(AUTH + 'token?grant_type=password', {
      method: 'POST',
      headers: { apikey: CFG.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }).then(respostaAuth);
  }

  function renova() {
    var s = sessao || lida();
    if (!s || !s.refresh_token) return Promise.reject(new Error('sem sessão'));
    return fetch(AUTH + 'token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: CFG.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    }).then(function (r) {
      if (!r.ok) { esquece(); throw new Error('A sessão expirou.'); }
      return r.json();
    }).then(function (j) { guarda(j); return j; });
  }

  // Devolve sempre um token válido, renovando se for preciso.
  function token() {
    if (!sessao) sessao = lida();
    if (sessao && sessao.expira_em > Date.now()) return Promise.resolve(sessao.access_token);
    return renova().then(function () { return sessao.access_token; });
  }

  function trocarPassword(nova) {
    return token().then(function (t) {
      return fetch(AUTH + 'user', {
        method: 'PUT',
        headers: {
          apikey: CFG.SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + t,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: nova })
      });
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (j) {
        throw new Error(j.msg || j.message || 'Não foi possível mudar a palavra-passe.');
      });
    });
  }

  /* ---------------- dados ---------------- */

  function erroDe(r, corpo) {
    var j = null;
    try { j = corpo ? JSON.parse(corpo) : null; } catch (e) {}
    if (r.status === 401) return 'A sessão expirou. Entra outra vez.';
    if (r.status === 403) return 'Sem permissão para isto.';
    if (j && j.code === '23505') return 'Já existe um registo igual.';
    return (j && (j.message || j.hint)) || ('Erro ' + r.status);
  }

  function pedido(url, opcoes) {
    opcoes = opcoes || {};
    return token().then(function (t) {
      var h = {
        apikey: CFG.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + t
      };
      if (opcoes.corpo !== undefined) h['Content-Type'] = 'application/json';
      if (opcoes.metodo === 'POST' || opcoes.metodo === 'PATCH') h.Prefer = 'return=representation';
      if (opcoes.cabecalhos) Object.keys(opcoes.cabecalhos).forEach(function (k) {
        h[k] = opcoes.cabecalhos[k];
      });
      return fetch(url, {
        method: opcoes.metodo || 'GET',
        headers: h,
        body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : opcoes.cru
      });
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.text().then(function (txt) {
        if (!r.ok) throw new Error(erroDe(r, txt));
        try { return txt ? JSON.parse(txt) : null; } catch (e) { return txt; }
      });
    });
  }

  var db = {
    ler:      function (caminho) { return pedido(REST + caminho); },
    criar:    function (tabela, corpo) {
                return pedido(REST + tabela, { metodo: 'POST', corpo: corpo });
              },
    mudar:    function (tabela, filtro, corpo) {
                return pedido(REST + tabela + '?' + filtro, { metodo: 'PATCH', corpo: corpo });
              },
    apagar:   function (tabela, filtro) {
                return pedido(REST + tabela + '?' + filtro, { metodo: 'DELETE' });
              },
    funcao:   function (nome, args) {
                return pedido(REST + 'rpc/' + nome, { metodo: 'POST', corpo: args || {} });
              }
  };

  /* ---------------- ficheiros ---------------- */

  var ficheiros = {
    // O caminho leva um prefixo aleatório para dois ficheiros com o mesmo
    // nome não se atropelarem, e para o nome no bucket não ser adivinhável.
    caminhoPara: function (nome) {
      var limpo = String(nome).normalize('NFD').replace(/[̀-ͯ]/g, '')
                    .replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
      var r = Math.random().toString(36).slice(2, 10);
      return r + '/' + (limpo || 'ficheiro');
    },

    enviar: function (caminho, ficheiro) {
      return token().then(function (t) {
        return fetch(STORAGE + 'object/' + BUCKET + '/' + caminho, {
          method: 'POST',
          headers: {
            apikey: CFG.SUPABASE_ANON_KEY,
            Authorization: 'Bearer ' + t,
            'Content-Type': ficheiro.type || 'application/octet-stream',
            'x-upsert': 'false'
          },
          body: ficheiro
        });
      }).then(function (r) {
        if (!r.ok) return r.text().then(function (txt) { throw new Error(erroDe(r, txt)); });
        return caminho;
      });
    },

    // URL assinado, válido poucos minutos. O Supabase só o emite se as
    // políticas de storage.objects deixarem esta conta ler o ficheiro —
    // não é a interface que decide.
    urlAssinado: function (caminho, segundos) {
      return pedido(STORAGE + 'object/sign/' + BUCKET + '/' + caminho, {
        metodo: 'POST', corpo: { expiresIn: segundos || 300 }
      }).then(function (j) {
        if (!j || !j.signedURL) throw new Error('Não foi possível abrir o ficheiro.');
        return CFG.SUPABASE_URL + '/storage/v1' + j.signedURL;
      });
    },

    apagar: function (caminhos) {
      return pedido(STORAGE + 'object/' + BUCKET, {
        metodo: 'DELETE', corpo: { prefixes: caminhos }
      });
    }
  };

  /* ---------------- contas (Edge Function) ---------------- */
  /* A Admin API do Supabase precisa da service_role key, que não pode
     viver num site estático. A função `admin-contas` corre no servidor,
     confirma que quem chama é administrador e só depois mexe em contas.
     Enquanto não estiver publicada, isto falha com uma mensagem clara e
     o caminho é o painel do Supabase. */
  var contas = {
    chamar: function (accao, dados) {
      return token().then(function (t) {
        return fetch(CFG.SUPABASE_URL + '/functions/v1/admin-contas', {
          method: 'POST',
          headers: {
            apikey: CFG.SUPABASE_ANON_KEY,
            Authorization: 'Bearer ' + t,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.assign({ accao: accao }, dados))
        });
      }).then(function (r) {
        return r.text().then(function (txt) {
          var j = null;
          try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
          if (r.status === 404) throw new Error(
            'A função admin-contas ainda não foi publicada. Cria a conta no ' +
            'painel do Supabase (Authentication → Users) e volta aqui para lhe ' +
            'dar permissões.');
          if (!r.ok) throw new Error((j && j.erro) || ('Erro ' + r.status));
          return j;
        });
      });
    },
    criar:   function (email, password, nome) {
      return contas.chamar('criar', { email: email, password: password, nome: nome });
    },
    password: function (perfil_id, password) {
      return contas.chamar('password', { perfil_id: perfil_id, password: password });
    }
  };

  return {
    entrar: entrar,
    sair: esquece,
    temSessao: function () { return !!(sessao || lida()); },
    token: token,
    trocarPassword: trocarPassword,
    db: db,
    ficheiros: ficheiros,
    contas: contas
  };
})();

/* Quem está autenticado. Usado só no arranque, para saber que painel abrir. */
window.API.utilizador = function () {
  return window.API.token().then(function (t) {
    return fetch(window.EXPLICANDOS_CONFIG.SUPABASE_URL + '/auth/v1/user', {
      headers: {
        apikey: window.EXPLICANDOS_CONFIG.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + t
      }
    });
  }).then(function (r) {
    if (!r.ok) throw new Error('A sessão expirou.');
    return r.json();
  });
};
