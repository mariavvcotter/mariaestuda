-- ============================================================
-- mariaestuda — tabela de registo de utilização (para /admin)
-- Correr UMA vez no painel Supabase → SQL Editor.
-- ============================================================

create table if not exists public.usage_events (
  id         bigint generated always as identity primary key,
  section    text not null,
  user_name  text,
  created_at timestamptz not null default now()
);

alter table public.usage_events enable row level security;

-- Qualquer visitante (anon) pode REGISTAR uma visita.
drop policy if exists "anon insert events" on public.usage_events;
create policy "anon insert events" on public.usage_events
  for insert to anon with check (true);

-- Leitura das estatísticas: o /admin lê com a chave anon
-- (protegido por palavra-passe no cliente).
drop policy if exists "anon read events" on public.usage_events;
create policy "anon read events" on public.usage_events
  for select to anon using (true);

grant select, insert on public.usage_events to anon;

create index if not exists usage_events_created_idx on public.usage_events (created_at desc);
create index if not exists usage_events_section_idx on public.usage_events (section);
