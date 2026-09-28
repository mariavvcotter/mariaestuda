#!/usr/bin/env bash
# Testa o eco/schema.sql contra um PostgreSQL local descartável, a fazer
# de chave anon: o que um aluno com a consola do navegador consegue fazer.
#   ./eco/testes/schema.sh      (precisa de PostgreSQL 16+ a correr em /tmp:5433)
set -euo pipefail
cd "$(dirname "$0")"
PORT="${PGPORT:-5433}"; DB=eco_teste
P=(psql -h /tmp -p "$PORT" -d "$DB" -qAtX -v ON_ERROR_STOP=1)
dropdb -h /tmp -p "$PORT" --if-exists "$DB"; createdb -h /tmp -p "$PORT" "$DB"

# o mínimo do ambiente Supabase
"${P[@]}" -c "create schema extensions;
  do \$\$ begin create role anon nologin; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated nologin; exception when duplicate_object then null; end \$\$;
  grant usage on schema public, extensions to anon, authenticated;"
"${P[@]}" -c "create table edc_users (username_key text primary key, name text not null,
  pin text not null, progress jsonb not null default '{}', updated_at timestamptz not null default now());
  insert into edc_users values ('joana','Joana','1234','{\"eco\":{\"eco_prog\":\"{}\"}}'),
                               ('rui','Rui','1234','{\"edc\":{}}');"
"${P[@]}" -f ../schema.sql >/dev/null
"${P[@]}" -f ../schema.sql >/dev/null      # corre duas vezes sem estragar
"${P[@]}" -c "select eco_definir_senha('senha-de-teste-123')" >/dev/null

ok=0; falha=0
check() { # descrição, esperado, sql (corrido como anon)
  local got; got=$("${P[@]}" -c "set role anon; $3" 2>&1 | tr "\n" " ") || true
  if [[ "$got" == *"$2"* ]]; then ok=$((ok+1)); echo "OK    $1"; else falha=$((falha+1)); echo "FALHA $1 — esperava «$2», veio «$got»"; fi
}
S="'senha-de-teste-123'"
check "anon não lê a configuração (hash)"     "permission denied" "select senha_hash from eco_config"
check "anon não escreve na configuração"      "permission denied" "update eco_config set desbloqueadas='{u1}'"
check "anon não define a palavra-passe"       "permission denied" "select eco_definir_senha('outra-senha-qualquer')"
check "anon não chama a verificação direta"   "permission denied" "select eco_admin_ok($S)"
check "senha errada é recusada"               "Palavra-passe errada" "select eco_admin('errada','listar')"
check "senha certa verifica"                  '{"ok" : true}' "select eco_admin($S,'verificar')"
check "desbloquear precisa de senha"          "Palavra-passe errada" "select eco_admin('x','desbloquear','{\"unidades\":[\"u1\"]}')"
check "desbloqueia com senha"                 '{"ok" : true}' "select eco_admin($S,'desbloquear','{\"unidades\":[\"u1\",\"u2\"]}')"
check "todos veem as desbloqueadas"           "{u1,u2}" "select eco_desbloqueadas()"
check "listar mostra quem estudou Economia"   "Joana" "select eco_admin($S,'listar')"
check "listar não mostra quem só usou o edc"  "VAZIO" "select case when eco_admin($S,'listar')::text like '%Rui%' then 'ESTA' else 'VAZIO' end"
check "listar nunca devolve o PIN"            "VAZIO" "select case when eco_admin($S,'listar')::text like '%1234%' then 'ESTA' else 'VAZIO' end"

dropdb -h /tmp -p "$PORT" --if-exists "$DB"
echo; echo "$ok passam · $falha falham"; [ "$falha" -eq 0 ]
