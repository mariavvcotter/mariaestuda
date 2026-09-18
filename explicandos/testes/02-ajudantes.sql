\set QUIET on
\pset tuples_only on
\pset format unaligned
\set ON_ERROR_STOP off

create or replace function espera(rotulo text, obtido text, esperado text)
returns void language plpgsql as $$
begin
  raise notice '%  %: %  %', case when obtido is not distinct from esperado then '  OK  ' else ' FALHA' end,
    rotulo, obtido, case when obtido is not distinct from esperado then '' else '(esperado ' || esperado || ')' end;
end $$;

create or replace function como(quem uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', quem)::text, false);
end $$;

-- Conta quantas linhas uma consulta devolve, engolindo o erro se a
-- política negar o acesso por completo.
create or replace function conta(sql text) returns text language plpgsql as $$
declare n integer;
begin
  execute 'select count(*) from (' || sql || ') t' into n;
  return n::text;
exception when others then return 'NEGADO';
end $$;

\pset tuples_only off

-- `conta()` não serve para escritas: um CTE que modifica dados não pode ir
-- dentro de um sub-SELECT. Esta executa a instrução e diz quantas linhas mexeu.
create or replace function tenta(sql text) returns text language plpgsql as $$
declare n integer;
begin
  execute sql;
  get diagnostics n = row_count;
  return n::text;
exception when others then return 'NEGADO';
end $$;
