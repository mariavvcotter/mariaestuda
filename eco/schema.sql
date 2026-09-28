-- ============================================================
-- mariaestuda.eu/eco — base de dados da plataforma de Economia
-- ------------------------------------------------------------
-- Correr no painel do Supabase → SQL Editor. Pode ser corrido
-- mais do que uma vez: não apaga nada do que já lá está.
--
-- Depois, UMA vez, definir a palavra-passe da administradora
-- (só funciona no SQL Editor, a chave pública não a consegue
-- chamar):
--
--     select eco_definir_senha('uma frase comprida que só tu sabes');
--
-- Como está protegido:
--   • As tabelas têm RLS ligado e NENHUMA política. A chave anon,
--     que está no JavaScript, não consegue ler nem escrever nelas.
--   • Tudo passa por funções. Um aluno só chega ao perfil cujo
--     nome escreve por inteiro; não há forma de listar alunos.
--   • Tudo o que é da administradora exige a palavra-passe, que
--     é verificada aqui dentro (bcrypt), não no navegador.
--
-- O que NÃO está protegido, por escolha: quem souber o nome de
-- utilizador de um aluno entra no perfil dele. É o preço de
-- entrar só com o nome. Usar nomes pouco óbvios (ex.: joana.m7).
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.eco_alunos (
  username      text primary key check (username ~ '^[a-z0-9._-]{2,30}$'),
  nome          text not null,
  progresso     jsonb not null default '{}'::jsonb,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.eco_config (
  id            int primary key default 1 check (id = 1),
  desbloqueadas text[] not null default '{}',
  senha_hash    text
);
insert into public.eco_config (id) values (1) on conflict (id) do nothing;

alter table public.eco_alunos enable row level security;
alter table public.eco_config enable row level security;
revoke all on public.eco_alunos, public.eco_config from anon, authenticated;

-- ---------- ajudantes ----------
create or replace function public.eco_chave(p text)
returns text language sql immutable as $$
  select lower(btrim(coalesce(p, '')))
$$;

create or replace function public.eco_admin_ok(p_senha text)
returns boolean language sql stable security definer
set search_path = public, extensions as $$
  select coalesce(
    (select senha_hash is not null and senha_hash = crypt(coalesce(p_senha, ''), senha_hash)
       from eco_config where id = 1),
    false)
$$;
revoke execute on function public.eco_admin_ok(text) from public, anon, authenticated;

-- ---------- só no SQL Editor ----------
create or replace function public.eco_definir_senha(p_senha text)
returns text language plpgsql security definer
set search_path = public, extensions as $$
begin
  if length(coalesce(p_senha, '')) < 10 then
    raise exception 'A palavra-passe tem de ter pelo menos 10 caracteres.';
  end if;
  update eco_config set senha_hash = crypt(p_senha, gen_salt('bf', 10)) where id = 1;
  return 'Palavra-passe definida.';
end $$;
revoke execute on function public.eco_definir_senha(text) from public, anon, authenticated;

-- ---------- público ----------
-- Unidades cujos resumos estão abertos aos alunos.
create or replace function public.eco_desbloqueadas()
returns text[] language sql stable security definer
set search_path = public as $$
  select desbloqueadas from eco_config where id = 1
$$;

-- Entrar com o nome de utilizador. Devolve null se não existir.
create or replace function public.eco_entrar(p_username text)
returns json language sql stable security definer
set search_path = public as $$
  select json_build_object('username', username, 'nome', nome, 'progresso', progresso)
    from eco_alunos where username = eco_chave(p_username)
$$;

-- Guardar o progresso do próprio aluno.
create or replace function public.eco_guardar(p_username text, p_progresso jsonb)
returns boolean language plpgsql security definer
set search_path = public as $$
begin
  if jsonb_typeof(p_progresso) is distinct from 'object'
     or length(p_progresso::text) > 200000 then
    return false;
  end if;
  update eco_alunos set progresso = p_progresso, atualizado_em = now()
   where username = eco_chave(p_username);
  return found;
end $$;

-- ---------- administradora ----------
-- p_acao: 'verificar' | 'listar' | 'criar' | 'apagar' | 'repor' | 'desbloquear'
create or replace function public.eco_admin(p_senha text, p_acao text, p_dados jsonb default '{}'::jsonb)
returns json language plpgsql security definer
set search_path = public, extensions as $$
declare
  v_user text;
begin
  if not eco_admin_ok(p_senha) then
    perform pg_sleep(1);              -- trava tentativas em série
    raise exception 'Palavra-passe errada.' using errcode = '28P01';
  end if;

  if p_acao = 'verificar' then
    return json_build_object('ok', true);

  elsif p_acao = 'listar' then
    return coalesce((
      select json_agg(json_build_object(
               'username', username, 'nome', nome, 'progresso', progresso,
               'criado_em', criado_em, 'atualizado_em', atualizado_em)
             order by nome)
        from eco_alunos), '[]'::json);

  elsif p_acao = 'criar' then
    v_user := eco_chave(p_dados->>'username');
    if v_user !~ '^[a-z0-9._-]{2,30}$' then
      raise exception 'Nome de utilizador inválido: usa 2 a 30 letras sem acentos, números, ponto, hífen ou _.';
    end if;
    begin
      insert into eco_alunos (username, nome)
      values (v_user, coalesce(nullif(btrim(p_dados->>'nome'), ''), v_user));
    exception when unique_violation then
      raise exception 'Já existe um aluno com o nome de utilizador «%».', v_user;
    end;
    return json_build_object('ok', true, 'username', v_user);

  elsif p_acao = 'apagar' then
    delete from eco_alunos where username = eco_chave(p_dados->>'username');
    return json_build_object('ok', found);

  elsif p_acao = 'repor' then
    update eco_alunos set progresso = '{}'::jsonb, atualizado_em = now()
     where username = eco_chave(p_dados->>'username');
    return json_build_object('ok', found);

  elsif p_acao = 'desbloquear' then
    update eco_config
       set desbloqueadas = array(select jsonb_array_elements_text(coalesce(p_dados->'unidades', '[]'::jsonb)))
     where id = 1;
    return json_build_object('ok', true);
  end if;

  raise exception 'Ação desconhecida: %', p_acao;
end $$;

revoke execute on function public.eco_desbloqueadas(), public.eco_entrar(text),
  public.eco_guardar(text, jsonb), public.eco_admin(text, text, jsonb) from public;
grant execute on function public.eco_desbloqueadas(), public.eco_entrar(text),
  public.eco_guardar(text, jsonb), public.eco_admin(text, text, jsonb) to anon, authenticated;
