-- ============================================================
-- mariaestuda.eu/eco — o que a Economia precisa além da conta
-- ------------------------------------------------------------
-- As contas dos alunos são as do resto do site (/account/,
-- tabela edc_users, Nome + PIN). O progresso da Economia vive
-- na fatia "eco" dessa tabela, como o do /edc vive na "edc".
--
-- Isto acrescenta só a parte da professora: que resumos estão
-- abertos e a leitura do progresso de todos na Gestão.
--
-- Correr no painel do Supabase → SQL Editor. Pode ser corrido
-- mais do que uma vez. Depois, UMA vez, definir a palavra-passe
-- da gestão (a chave pública não a consegue chamar):
--
--     select eco_definir_senha('uma frase comprida que só tu sabes');
--
-- A configuração só se altera por eco_admin, que verifica a
-- palavra-passe aqui dentro (bcrypt), não no navegador.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.eco_config (
  id            int primary key default 1 check (id = 1),
  desbloqueadas text[] not null default '{}',
  senha_hash    text
);
insert into public.eco_config (id) values (1) on conflict (id) do nothing;

alter table public.eco_config enable row level security;
revoke all on public.eco_config from anon, authenticated;

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

-- ---------- professora ----------
-- p_acao: 'verificar' | 'listar' | 'desbloquear'
create or replace function public.eco_admin(p_senha text, p_acao text, p_dados jsonb default '{}'::jsonb)
returns json language plpgsql security definer
set search_path = public, extensions as $$
begin
  if not eco_admin_ok(p_senha) then
    perform pg_sleep(1);              -- trava tentativas em série
    raise exception 'Palavra-passe errada.' using errcode = '28P01';
  end if;

  if p_acao = 'verificar' then
    return json_build_object('ok', true);

  elsif p_acao = 'listar' then
    -- quem já estudou Economia com conta iniciada (sem PIN)
    return coalesce((
      select json_agg(json_build_object(
               'nome', name, 'eco', progress->'eco', 'atualizado_em', updated_at)
             order by lower(name))
        from edc_users
       where progress ? 'eco'), '[]'::json);

  elsif p_acao = 'desbloquear' then
    update eco_config
       set desbloqueadas = array(select jsonb_array_elements_text(coalesce(p_dados->'unidades', '[]'::jsonb)))
     where id = 1;
    return json_build_object('ok', true);
  end if;

  raise exception 'Ação desconhecida: %', p_acao;
end $$;

revoke execute on function public.eco_desbloqueadas(), public.eco_admin(text, text, jsonb) from public;
grant execute on function public.eco_desbloqueadas(), public.eco_admin(text, text, jsonb) to anon, authenticated;
