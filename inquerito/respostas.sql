-- ============================================================
-- mariaestuda — respostas do inquérito (/inquerito)
-- Correr UMA vez no painel Supabase → SQL Editor.
--
-- Ao contrário de usage_events, aqui o público só pode ESCREVER.
-- Ninguém com a chave anon consegue ler as respostas: vêem-se
-- no painel Supabase (Table Editor) ou exportam-se para CSV de lá.
-- ============================================================

create table if not exists public.inquerito_respostas (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  respostas  jsonb not null,
  -- trava contra lixo: um envio legítimo tem pouco mais de 2 KB
  constraint inquerito_respostas_tamanho check (octet_length(respostas::text) < 8000)
);

alter table public.inquerito_respostas enable row level security;

drop policy if exists "anon insert respostas" on public.inquerito_respostas;
create policy "anon insert respostas" on public.inquerito_respostas
  for insert to anon with check (true);

-- Só INSERT. Sem SELECT, UPDATE nem DELETE para anon.
revoke all on public.inquerito_respostas from anon;
grant insert on public.inquerito_respostas to anon;

-- Vista em colunas, para ler e exportar no painel (não exposta ao anon).
create or replace view public.inquerito_respostas_tabela
with (security_invoker = true) as
select
  id,
  created_at,
  respostas->>'consentimento'         as consentimento,
  respostas->>'idade'                 as idade,
  respostas->>'escolaridade'          as escolaridade,
  respostas->>'residencia'            as residencia,
  respostas->>'companhia'             as companhia,
  respostas->>'frequencia_anual'      as frequencia_anual,
  respostas->>'ja_visitou'            as ja_visitou,
  (select string_agg(v, '; ') from jsonb_array_elements_text(respostas->'como_soube') v)    as como_soube,
  respostas->>'motivo'                as motivo,
  (select string_agg(v, '; ') from jsonb_array_elements_text(respostas->'canais_usados') v) as canais_usados,
  respostas->>'aval_textos'           as aval_textos,
  respostas->>'aval_orientacao'       as aval_orientacao,
  respostas->>'aval_audioguia'        as aval_audioguia,
  respostas->>'aval_visita_guiada'    as aval_visita_guiada,
  respostas->>'aval_pessoal'          as aval_pessoal,
  respostas->>'aval_loja'             as aval_loja,
  respostas->>'mais_gostou'           as mais_gostou,
  respostas->>'aprendeu_1a5'          as aprendeu_1a5,
  respostas->>'percecao_artista_1a5'  as percecao_artista_1a5,
  respostas->>'recomenda_0a10'        as recomenda_0a10,
  respostas->>'publico_ou_utilizador' as publico_ou_utilizador,
  respostas->>'o_que_mudaria'         as o_que_mudaria
from public.inquerito_respostas;

revoke all on public.inquerito_respostas_tabela from anon, authenticated;
