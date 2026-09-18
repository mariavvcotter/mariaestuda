-- ============================================================
-- mariaestuda — Explicandos (gestão de alunos, aulas e packs)
-- Correr UMA vez no painel Supabase → SQL Editor.
--
-- DIFERENÇA IMPORTANTE para o resto do site: aqui há dados
-- pessoais de menores e registos de pagamento. Por isso NADA
-- fica acessível à chave `anon`. Só um utilizador autenticado
-- (Supabase Auth, email + password) lê ou escreve.
-- ============================================================

-- ---------- alunos ----------
create table if not exists public.exp_alunos (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  encarregado  text,
  contacto     text,
  ano          text,
  disciplinas  text,
  modalidade   text not null default 'online'
                 check (modalidade in ('online','presencial')),
  preco_hora   numeric(6,2) not null default 10 check (preco_hora >= 0),
  notas        text,
  ativo        boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ---------- aulas dadas ----------
-- `debita` = esta aula consome horas do saldo.
--   dada       → true
--   faltou     → true por omissão (falta sem aviso desconta)
--   desmarcada → false
create table if not exists public.exp_aulas (
  id           uuid primary key default gen_random_uuid(),
  aluno_id     uuid not null references public.exp_alunos(id) on delete cascade,
  data         date not null default current_date,
  duracao_min  integer not null default 60 check (duracao_min between 15 and 480),
  modalidade   text not null default 'online'
                 check (modalidade in ('online','presencial')),
  estado       text not null default 'dada'
                 check (estado in ('dada','faltou','desmarcada')),
  debita       boolean not null default true,
  sumario      text,
  created_at   timestamptz not null default now()
);

-- ---------- pagamentos ----------
-- `horas_credito` = horas compradas (um pack de 10h → 10).
-- `valor_eur`     = o que entrou de facto na carteira.
-- As duas colunas são independentes de propósito: um pack de
-- 10h a 90€ são 10 horas por 90€; uma aula avulsa paga na hora
-- são 1 hora por 10€. A mesma conta serve os dois casos.
create table if not exists public.exp_pagamentos (
  id             uuid primary key default gen_random_uuid(),
  aluno_id       uuid not null references public.exp_alunos(id) on delete cascade,
  data           date not null default current_date,
  valor_eur      numeric(8,2) not null check (valor_eur >= 0),
  horas_credito  numeric(5,2) not null default 0 check (horas_credito >= 0),
  metodo         text,
  nota           text,
  created_at     timestamptz not null default now()
);

create index if not exists exp_aulas_aluno_idx on public.exp_aulas (aluno_id, data desc);
create index if not exists exp_aulas_data_idx  on public.exp_aulas (data desc);
create index if not exists exp_pag_aluno_idx   on public.exp_pagamentos (aluno_id, data desc);
create index if not exists exp_pag_data_idx    on public.exp_pagamentos (data desc);

-- ============================================================
-- Segurança: RLS ligada, só `authenticated` passa.
-- ============================================================
alter table public.exp_alunos     enable row level security;
alter table public.exp_aulas      enable row level security;
alter table public.exp_pagamentos enable row level security;

drop policy if exists "auth alunos"     on public.exp_alunos;
drop policy if exists "auth aulas"      on public.exp_aulas;
drop policy if exists "auth pagamentos" on public.exp_pagamentos;

create policy "auth alunos" on public.exp_alunos
  for all to authenticated using (true) with check (true);
create policy "auth aulas" on public.exp_aulas
  for all to authenticated using (true) with check (true);
create policy "auth pagamentos" on public.exp_pagamentos
  for all to authenticated using (true) with check (true);

grant select, insert, update, delete
  on public.exp_alunos, public.exp_aulas, public.exp_pagamentos
  to authenticated;

-- A chave anon (a que está em claro no repositório) não toca nisto.
revoke all on public.exp_alunos     from anon;
revoke all on public.exp_aulas      from anon;
revoke all on public.exp_pagamentos from anon;
