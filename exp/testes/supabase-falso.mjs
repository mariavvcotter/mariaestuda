/* ============================================================
   Supabase falso, em memória, para os testes de navegador.
   ------------------------------------------------------------
   Percebe o suficiente de PostgREST, GoTrue e Storage para a
   aplicação correr sem rede. As VISTAS são recalculadas aqui a
   partir das mesmas regras do schema.sql — mas quem prova que o
   schema as impõe de verdade é o teste de SQL (testes/correr.sh),
   não este. Aqui testa-se a interface.
   ============================================================ */

export function criaBackend(dados) {
  const t = {
    perfis: [], alunos: [], explicacoes: [], explicacao_alunos: [],
    pagamentos: [], materiais: [], material_alunos: [], tpcs: [],
    tpc_materiais: [], notas_proxima: [], horario: [],
    horario_excecoes: [], horario_extras: [],
    ...dados,
  };
  const objetos = new Set((t.materiais || []).map((m) => m.storage_path));
  let n = 0;
  const uid = () => 'id-' + ++n + '-' + Math.random().toString(36).slice(2, 6);
  const hoje = () => new Date().toISOString().slice(0, 10);

  // Quem está autenticado: o token é o próprio id, para simplificar.
  let quem = null;
  const perfil = () => t.perfis.find((p) => p.id === quem) || null;

  const meusAlunos = () => {
    const p = perfil();
    if (!p) return [];
    return t.alunos.filter((a) => !a.arquivado &&
      (a.encarregado_id === p.id || a.aluno_perfil_id === p.id)).map((a) => a.id);
  };
  const publicado = (ma) => !ma.publicar_em || ma.publicar_em <= hoje();

  /* ---------- vistas, com as mesmas condições do schema ---------- */
  const vistas = {
    v_meus_alunos: () => t.alunos.filter((a) => meusAlunos().includes(a.id))
      .map(({ id, nome, ano, disciplinas }) => ({ id, nome, ano, disciplinas })),

    v_conta_corrente: () => {
      if (!perfil()?.ve_conta_corrente) return [];
      const meus = meusAlunos();
      const linhas = [];
      t.explicacao_alunos.filter((ea) => meus.includes(ea.aluno_id)).forEach((ea) => {
        const e = t.explicacoes.find((x) => x.id === ea.explicacao_id);
        if (e) linhas.push({
          aluno_id: ea.aluno_id, movimento_id: e.id, tipo: 'explicacao', data: e.data,
          descricao: e.sumario, duracao_min: e.duracao_min, debito: ea.valor_eur, credito: 0,
        });
      });
      t.pagamentos.filter((p) => meus.includes(p.aluno_id)).forEach((p) => linhas.push({
        aluno_id: p.aluno_id, movimento_id: p.id, tipo: 'pagamento', data: p.data,
        descricao: p.nota, duracao_min: null, debito: 0, credito: p.valor_eur,
      }));
      return linhas;
    },

    v_sumarios: () => {
      if (!perfil()?.ve_materiais) return [];
      const meus = meusAlunos();
      return t.explicacao_alunos.filter((ea) => meus.includes(ea.aluno_id)).map((ea) => {
        const e = t.explicacoes.find((x) => x.id === ea.explicacao_id);
        // Sem valor nenhum: é isto que separa o que o aluno vê do que o
        // encarregado vê.
        return e && { aluno_id: ea.aluno_id, id: e.id, data: e.data,
                      duracao_min: e.duracao_min, sumario: e.sumario };
      }).filter(Boolean);
    },

    v_materiais: () => {
      if (!perfil()?.ve_materiais) return [];
      const meus = meusAlunos();
      return t.material_alunos.filter((ma) => meus.includes(ma.aluno_id) && publicado(ma))
        .map((ma) => {
          const m = t.materiais.find((x) => x.id === ma.material_id);
          return m && { aluno_id: ma.aluno_id, ...m, publicar_em: ma.publicar_em };
        }).filter(Boolean);
    },

    v_tpcs: () => {
      if (!perfil()?.ve_materiais) return [];
      const meus = meusAlunos();
      return t.tpcs.filter((x) => meus.includes(x.aluno_id)).map((x) => ({
        ...x,
        materiais: t.tpc_materiais.filter((tm) => tm.tpc_id === x.id).map((tm) => {
          const m = t.materiais.find((y) => y.id === tm.material_id);
          const ma = t.material_alunos.find(
            (y) => y.material_id === tm.material_id && y.aluno_id === x.aluno_id);
          return m && ma && publicado(ma)
            ? { id: m.id, titulo: m.titulo, storage_path: m.storage_path } : null;
        }).filter(Boolean),
      }));
    },

    v_nota_proxima: () => {
      if (!perfil()?.ve_materiais) return [];
      const meus = meusAlunos();
      const porAluno = {};
      t.notas_proxima.filter((x) => meus.includes(x.aluno_id) && !x.consumida_em)
        .forEach((x) => {
          if (!porAluno[x.aluno_id] || porAluno[x.aluno_id].criado_em < x.criado_em)
            porAluno[x.aluno_id] = x;
        });
      return Object.values(porAluno);
    },
  };

  /* ---------- filtros do PostgREST ---------- */
  function filtra(linhas, params) {
    let saida = linhas;
    for (const [chave, valor] of params) {
      if (['select', 'order', 'limit', 'offset'].includes(chave)) continue;
      if (valor.startsWith('eq.')) {
        const v = valor.slice(3);
        saida = saida.filter((r) => String(r[chave]) === v);
      } else if (valor.startsWith('in.')) {
        const vs = valor.slice(4, -1).split(',');
        saida = saida.filter((r) => vs.includes(String(r[chave])));
      }
    }
    return saida;
  }

  function ordena(linhas, order) {
    if (!order) return linhas;
    const chaves = order.split(',').map((p) => {
      const [campo, dir] = p.split('.');
      return { campo, desc: dir === 'desc' };
    });
    return linhas.slice().sort((a, b) => {
      for (const k of chaves) {
        const x = a[k.campo] ?? '', y = b[k.campo] ?? '';
        if (x === y) continue;
        return (x < y ? -1 : 1) * (k.desc ? -1 : 1);
      }
      return 0;
    });
  }

  // `explicacoes?select=*,explicacao_alunos(aluno_id,valor_eur)`
  function embute(tabela, linhas, select) {
    const m = /,\s*(\w+)\s*\(/.exec(select || '');
    if (!m) return linhas;
    const filha = m[1];
    const chave = tabela === 'explicacoes' ? 'explicacao_id' : tabela.replace(/s$/, '') + '_id';
    return linhas.map((r) => ({
      ...r, [filha]: (t[filha] || []).filter((c) => c[chave] === r.id),
    }));
  }

  /* ---------- funções ---------- */
  const funcoes = {
    registar_explicacao: (a) => {
      const id = uid();
      t.explicacoes.push({ id, data: a.p_data, duracao_min: a.p_duracao_min,
        sumario: (a.p_sumario || '').trim() || null, criado_em: new Date().toISOString() });
      a.p_alunos.forEach((x) => {
        t.explicacao_alunos.push({ explicacao_id: id, aluno_id: x.aluno_id, valor_eur: x.valor_eur });
        t.notas_proxima.forEach((nn) => {
          if (nn.aluno_id === x.aluno_id && !nn.consumida_em)
            nn.consumida_em = new Date().toISOString();
        });
      });
      return id;
    },
    materiais_exclusivos: (a) => t.materiais.filter((m) => {
      const atrib = t.material_alunos.filter((x) => x.material_id === m.id);
      return atrib.some((x) => x.aluno_id === a.p_aluno) &&
             !atrib.some((x) => x.aluno_id !== a.p_aluno);
    }).map(({ id, titulo, storage_path, tamanho_bytes }) =>
      ({ id, titulo, storage_path, tamanho_bytes })),
    marcar_tpc_feito: (a) => {
      const x = t.tpcs.find((y) => y.id === a.p_tpc);
      const feito = a.p_feito !== false;
      if (!x || !meusAlunos().includes(x.aluno_id) || x.estado === 'confirmado')
        throw new Error('TPC não encontrado ou já confirmado');
      x.estado = feito ? 'feito_aluno' : 'por_fazer';
      return null;
    },
  };

  /* ---------- encaminhador ---------- */
  return {
    tabelas: t,
    responde(req) {
      const url = new URL(req.url());
      const metodo = req.method();
      const corpo = metodo === 'GET' ? null : seguroJSON(req);
      const json = (b, status = 200) => ({ status, contentType: 'application/json',
                                           body: JSON.stringify(b ?? null) });

      // --- GoTrue ---
      if (url.pathname.startsWith('/auth/v1/token')) {
        const p = t.perfis.find((x) => x.email === corpo.email);
        if (!p || corpo.password !== 'segredo123!') return json({ error_description: 'Invalid login credentials' }, 400);
        quem = p.id;
        return json({ access_token: p.id, refresh_token: p.id, expires_in: 3600 });
      }
      if (url.pathname === '/auth/v1/user') {
        const t2 = (req.headers().authorization || '').replace('Bearer ', '');
        quem = t2;
        return quem ? json({ id: quem }) : json({ msg: 'sem sessão' }, 401);
      }

      // Todos os pedidos seguintes correm como quem o cabeçalho diz.
      const bearer = (req.headers().authorization || '').replace('Bearer ', '');
      if (bearer) quem = bearer;

      // --- Storage ---
      if (url.pathname.startsWith('/storage/v1/object/sign/')) {
        const caminho = url.pathname.split('/storage/v1/object/sign/materiais/')[1];
        return json({ signedURL: '/object/assinado/' + caminho + '?token=x' });
      }
      if (url.pathname.startsWith('/storage/v1/object/materiais/')) {
        if (metodo === 'POST') {
          objetos.add(url.pathname.split('/storage/v1/object/materiais/')[1]);
          return json({ Key: 'ok' });
        }
      }
      if (url.pathname === '/storage/v1/object/materiais' && metodo === 'DELETE') {
        (corpo.prefixes || []).forEach((p) => objetos.delete(p));
        return json({ ok: true });
      }

      // --- Edge Function ---
      if (url.pathname.endsWith('/functions/v1/admin-contas')) {
        if (!perfil()?.is_admin) return json({ erro: 'Só a administradora.' }, 403);
        if (corpo.accao === 'criar') {
          const id = uid();
          t.perfis.push({ id, email: corpo.email, nome: corpo.nome, ativo: true,
            is_admin: false, ve_conta_corrente: false, ve_materiais: false });
          return json({ id });
        }
        return json({ ok: true });
      }

      // --- PostgREST ---
      const alvo = url.pathname.replace('/rest/v1/', '');

      if (alvo.startsWith('rpc/')) {
        const nome = alvo.slice(4);
        try { return json(funcoes[nome](corpo || {})); }
        catch (e) { return json({ message: e.message }, 400); }
      }

      if (vistas[alvo]) {
        return json(ordena(filtra(vistas[alvo](), url.searchParams),
                           url.searchParams.get('order')));
      }

      const tabela = alvo;
      if (!t[tabela]) return json({ message: 'tabela desconhecida: ' + tabela }, 404);

      if (metodo === 'GET') {
        let linhas = filtra(t[tabela], url.searchParams);
        linhas = ordena(linhas, url.searchParams.get('order'));
        return json(embute(tabela, linhas, url.searchParams.get('select')));
      }
      if (metodo === 'POST') {
        const novas = (Array.isArray(corpo) ? corpo : [corpo]).map((r) => ({
          id: r.id || uid(), criado_em: new Date().toISOString(), ...r,
        }));
        t[tabela].push(...novas);
        return json(novas);
      }
      if (metodo === 'PATCH') {
        const alvos = filtra(t[tabela], url.searchParams);
        alvos.forEach((r) => Object.assign(r, corpo));
        return json(alvos);
      }
      if (metodo === 'DELETE') {
        const fora = new Set(filtra(t[tabela], url.searchParams));
        t[tabela] = t[tabela].filter((r) => !fora.has(r));
        // Cascatas que o PostgreSQL faria sozinho.
        if (tabela === 'explicacoes') {
          const vivos = new Set(t.explicacoes.map((e) => e.id));
          t.explicacao_alunos = t.explicacao_alunos.filter((x) => vivos.has(x.explicacao_id));
        }
        if (tabela === 'materiais') {
          const vivos = new Set(t.materiais.map((m) => m.id));
          t.material_alunos = t.material_alunos.filter((x) => vivos.has(x.material_id));
        }
        return { status: 204, body: '' };
      }
      return json({ message: 'método não suportado' }, 405);
    },
    ficheirosNoBucket: () => [...objetos],
  };
}

function seguroJSON(req) {
  try { return req.postDataJSON(); } catch { return {}; }
}
