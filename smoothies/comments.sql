-- ============================================================
-- mariaestuda — comentários dos smoothies
-- Correr UMA vez no painel Supabase → SQL Editor.
-- Mesmo padrão de segurança que usage_events: o cliente usa a
-- chave anon, a tabela tem RLS. Sem segurança real — o nome vem
-- da conta (Nome + PIN) do módulo Account, só para separar perfis.
-- ============================================================

create table if not exists public.smoothie_comments (
  id         bigint generated always as identity primary key,
  smoothie   text not null default 'geral',  -- qual smoothie (ou 'geral')
  user_name  text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

alter table public.smoothie_comments enable row level security;

-- Qualquer visitante (anon) pode LER os comentários.
drop policy if exists "anon read comments" on public.smoothie_comments;
create policy "anon read comments" on public.smoothie_comments
  for select to anon using (true);

-- Qualquer visitante (anon) pode PUBLICAR um comentário.
-- Restrições básicas de tamanho no servidor.
drop policy if exists "anon insert comments" on public.smoothie_comments;
create policy "anon insert comments" on public.smoothie_comments
  for insert to anon
  with check (
    char_length(body) between 1 and 2000
    and char_length(user_name) between 1 and 40
  );

-- Qualquer visitante (anon) pode APAGAR um comentário.
-- O login (Nome + PIN) não é auth real, por isso o controlo de "dono"
-- é feito no cliente (o botão apagar só aparece nos comentários do
-- próprio). Ao nível da BD, a política permite delete a anon — mesmo
-- modelo "sem segurança real" do resto do site.
drop policy if exists "anon delete comments" on public.smoothie_comments;
create policy "anon delete comments" on public.smoothie_comments
  for delete to anon using (true);

grant select, insert, delete on public.smoothie_comments to anon;

create index if not exists smoothie_comments_created_idx
  on public.smoothie_comments (created_at desc);
