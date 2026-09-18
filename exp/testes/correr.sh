#!/usr/bin/env bash
# ============================================================
# Testa as permissões do schema contra um PostgreSQL a sério.
#
# O que está a ser testado é a afirmação central do projeto: que
# uma família autenticada não alcança os dados de outra, mesmo
# falando com a base de dados diretamente, sem passar pela
# interface. Não dá para verificar isso a olho.
#
#   ./exp/testes/correr.sh
#
# Precisa de um PostgreSQL local (16 ou mais recente). Não toca
# no Supabase: cria uma base de dados descartável e reproduz o
# mínimo do ambiente (auth.uid(), storage.objects, os papéis).
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PGPORT:-5433}"
DB="explicacoes_teste"
PSQL=(psql -h /tmp -p "$PORT" -d "$DB" -q)

dropdb -h /tmp -p "$PORT" --if-exists "$DB"
createdb -h /tmp -p "$PORT" "$DB"

for f in 00-supabase-falso.sql ../schema.sql 01-dados.sql 02-ajudantes.sql; do
  if ! "${PSQL[@]}" -v ON_ERROR_STOP=1 -f "$f" > /tmp/saida-$$.txt 2>&1; then
    echo "Falhou a aplicar $f:"; grep -i error /tmp/saida-$$.txt; exit 1
  fi
done

saida=$("${PSQL[@]}" -f 03-permissoes.sql 2>&1 | sed 's/^psql:[^ ]*NOTICE:  //')
echo "$saida" | grep -E 'OK |FALHA|ERROR' || true

falhas=$(echo "$saida" | grep -cE 'FALHA|ERROR' || true)
passam=$(echo "$saida" | grep -c 'OK ' || true)
echo
echo "$passam passam · $falhas falham"
dropdb -h /tmp -p "$PORT" --if-exists "$DB"
[ "$falhas" -eq 0 ]
