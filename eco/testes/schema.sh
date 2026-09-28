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
"${P[@]}" -f ../schema.sql >/dev/null
"${P[@]}" -f ../schema.sql >/dev/null      # corre duas vezes sem estragar
"${P[@]}" -c "select eco_definir_senha('senha-de-teste-123')" >/dev/null

ok=0; falha=0
check() { # descrição, esperado, sql (corrido como anon)
  local got; got=$("${P[@]}" -c "set role anon; $3" 2>&1 | tr "\n" " ") || true
  if [[ "$got" == *"$2"* ]]; then ok=$((ok+1)); echo "OK    $1"; else falha=$((falha+1)); echo "FALHA $1 — esperava «$2», veio «$got»"; fi
}
S="'senha-de-teste-123'"
check "anon não lê a tabela de alunos"        "permission denied" "select * from eco_alunos"
check "anon não lê a configuração (hash)"     "permission denied" "select senha_hash from eco_config"
check "anon não escreve na configuração"      "permission denied" "update eco_config set desbloqueadas='{u1}'"
check "anon não define a palavra-passe"       "permission denied" "select eco_definir_senha('outra-senha-qualquer')"
check "anon não chama a verificação direta"   "permission denied" "select eco_admin_ok($S)"
check "senha errada é recusada"               "Palavra-passe errada" "select eco_admin('errada','listar')"
check "senha certa verifica"                  '{"ok" : true}' "select eco_admin($S,'verificar')"
check "cria aluno"                            '"username" : "joana.m7"' "select eco_admin($S,'criar','{\"username\":\" Joana.M7 \",\"nome\":\"Joana\"}')"
check "recusa aluno repetido"                 "Já existe" "select eco_admin($S,'criar','{\"username\":\"joana.m7\"}')"
check "recusa nome inválido"                  "inválido" "select eco_admin($S,'criar','{\"username\":\"joão\"}')"
check "aluno entra só com o nome (maiúsculas)" '"nome" : "Joana"' "select eco_entrar('JOANA.M7')"
check "nome inexistente devolve vazio"        "VAZIO" "select coalesce(eco_entrar('ninguem')::text,'VAZIO')"
check "aluno guarda progresso"                "t" "select eco_guardar('joana.m7','{\"r\":{\"u1-01\":[1,1,1,0]}}')"
check "progresso guardado volta"              "u1-01" "select eco_entrar('joana.m7')->>'progresso'"
check "não guarda progresso que não é objeto" "f" "select eco_guardar('joana.m7','[1,2]')"
check "não guarda para quem não existe"       "f" "select eco_guardar('ninguem','{}')"
check "desbloquear precisa de senha"          "Palavra-passe errada" "select eco_admin('x','desbloquear','{\"unidades\":[\"u1\"]}')"
check "desbloqueia com senha"                 '{"ok" : true}' "select eco_admin($S,'desbloquear','{\"unidades\":[\"u1\",\"u2\"]}')"
check "todos veem as desbloqueadas"           "{u1,u2}" "select eco_desbloqueadas()"
check "listar devolve os alunos"              "joana.m7" "select eco_admin($S,'listar')"
check "repor apaga o progresso"               "{}" "select eco_admin($S,'repor','{\"username\":\"joana.m7\"}'); select eco_entrar('joana.m7')->>'progresso'"
check "apagar remove o aluno"                 "VAZIO" "select eco_admin($S,'apagar','{\"username\":\"joana.m7\"}'); select coalesce(eco_entrar('joana.m7')::text,'VAZIO')"

dropdb -h /tmp -p "$PORT" --if-exists "$DB"
echo; echo "$ok passam · $falha falham"; [ "$falha" -eq 0 ]
