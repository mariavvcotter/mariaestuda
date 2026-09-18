// ============================================================
// mariaestuda — Explicações: contas
// ------------------------------------------------------------
// O caderno pede que as contas sejam criadas e as palavras-passe
// redefinidas a partir do painel (§58, §60). Isso precisa da
// Admin API do Supabase, que exige a `service_role key` — e essa
// chave não pode viver no GitHub Pages: quem a apanhasse lia e
// escrevia a base de dados toda, por cima de todas as políticas.
//
// Esta função é o pedaço de servidor que falta. A chave fica nas
// variáveis de ambiente da função, nunca chega ao browser, e a
// função só faz alguma coisa depois de confirmar, contra a base
// de dados, que quem chamou é administrador.
//
// Publicar:
//   supabase functions deploy admin-contas
//
// As variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já
// existem no ambiente das Edge Functions; não é preciso defini-las.
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const URL_SUPABASE = Deno.env.get('SUPABASE_URL')!;
const CHAVE_SERVICO = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CHAVE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

const CABECALHOS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

function resposta(corpo: unknown, estado = 200) {
  return new Response(JSON.stringify(corpo), { status: estado, headers: CABECALHOS });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CABECALHOS });
  if (req.method !== 'POST') return resposta({ erro: 'Método não suportado.' }, 405);

  const autorizacao = req.headers.get('Authorization') ?? '';
  if (!autorizacao.startsWith('Bearer ')) {
    return resposta({ erro: 'Sem sessão.' }, 401);
  }

  // Quem chama, visto com os direitos de quem chama. Se o token não
  // prestar, fica por aqui.
  const comoUtilizador = createClient(URL_SUPABASE, CHAVE_ANON, {
    global: { headers: { Authorization: autorizacao } },
  });

  const { data: sessao, error: erroSessao } = await comoUtilizador.auth.getUser();
  if (erroSessao || !sessao?.user) return resposta({ erro: 'Sessão inválida.' }, 401);

  // A permissão vem da base de dados, não do que o cliente diz ser.
  const { data: perfil } = await comoUtilizador
    .from('perfis')
    .select('is_admin, ativo')
    .eq('id', sessao.user.id)
    .single();

  if (!perfil?.is_admin || !perfil?.ativo) {
    return resposta({ erro: 'Só a administradora pode mexer em contas.' }, 403);
  }

  const admin = createClient(URL_SUPABASE, CHAVE_SERVICO, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let corpo: Record<string, string>;
  try {
    corpo = await req.json();
  } catch {
    return resposta({ erro: 'Pedido mal formado.' }, 400);
  }

  // Uma palavra-passe curta aqui é uma porta aberta: é a única coisa
  // entre uma conta e os dados de uma família.
  const validaPassword = (p?: string) =>
    typeof p === 'string' && p.length >= 10 ? null : 'A palavra-passe precisa de 10 caracteres ou mais.';

  if (corpo.accao === 'criar') {
    const { email, password, nome } = corpo;
    if (!email) return resposta({ erro: 'Falta o email.' }, 400);
    const mau = validaPassword(password);
    if (mau) return resposta({ erro: mau }, 400);

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,          // não há email de confirmação a enviar
      user_metadata: { nome: nome ?? email.split('@')[0] },
    });
    if (error) return resposta({ erro: error.message }, 400);
    return resposta({ id: data.user.id });
  }

  if (corpo.accao === 'password') {
    const { perfil_id, password } = corpo;
    if (!perfil_id) return resposta({ erro: 'Falta a conta.' }, 400);
    const mau = validaPassword(password);
    if (mau) return resposta({ erro: mau }, 400);

    const { error } = await admin.auth.admin.updateUserById(perfil_id, { password });
    if (error) return resposta({ erro: error.message }, 400);
    return resposta({ ok: true });
  }

  return resposta({ erro: 'Ação desconhecida.' }, 400);
});
