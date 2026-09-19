#!/usr/bin/env bash
# ============================================================
# mariaestuda — passar do Supabase alojado para a VPS
# ------------------------------------------------------------
# Só é preciso se já tiveres dados no Supabase alojado. Numa
# instalação de raiz, salta isto e corre só o schema.sql.
#
# Corre na TUA máquina, não na VPS:
#   bash migrar.sh "postgresql://...supabase.co:5432/postgres" maisinfo.store
#
# A cadeia de ligação está no painel do Supabase alojado, em
# Project Settings → Database → Connection string → URI.
#
# AS CONTAS NÃO PASSAM. As palavras-passe estão cifradas com o
# JWT_SECRET do projeto antigo e não servem no novo. Depois da
# migração, cria as contas outra vez e comunica as novas
# palavras-passe. Os alunos, explicações, pagamentos, materiais
# e TPCs passam todos.
# ============================================================
set -euo pipefail

ORIGEM="${1:?falta a cadeia de ligação de origem}"
DOMINIO="${2:?falta o domínio da VPS, ex.: maisinfo.store}"
FICHEIRO="explicacoes-$(date +%Y-%m-%d).sql"

command -v pg_dump >/dev/null || { echo "instala o postgresql-client" >&2; exit 1; }

echo "── a exportar o schema public do projeto alojado ──"
# Só o `public`: os schemas `auth` e `storage` são geridos pelo Supabase e
# levá-los de uma instalação para outra parte as duas.
pg_dump "$ORIGEM" \
  --schema=public \
  --no-owner --no-privileges \
  --exclude-table-data='public.perfis' \
  -f "$FICHEIRO"

echo "── $FICHEIRO escrito ($(du -h "$FICHEIRO" | cut -f1)) ──"
cat <<FIM

A seguir, na VPS:

  1. Corre primeiro o exp/schema.sql no Studio (https://$DOMINIO),
     para criar as tabelas, as políticas e as funções de raiz.

  2. Cria as contas todas outra vez (Authentication → Users), e
     anota que id ficou cada uma.

  3. Carrega os dados:
       scp $FICHEIRO root@$DOMINIO:/tmp/
       ssh root@$DOMINIO 'docker compose -f /opt/explicacoes/supabase/docker/docker-compose.yml \\
         exec -T db psql -U postgres -d postgres < /tmp/$FICHEIRO'

  4. Liga as contas novas aos alunos, na ficha de cada um.

  5. No config.js da app, troca SUPABASE_URL e SUPABASE_ANON_KEY
     pelos da VPS, e publica.

FIM
