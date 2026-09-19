#!/usr/bin/env bash
# ============================================================
# mariaestuda — publicar a app na VPS
# ------------------------------------------------------------
# Traz a versão mais recente do repositório e põe-na a servir.
# Corre isto sempre que houver código novo:
#
#   bash /opt/explicacoes/app/exp/vps/publicar.sh maisinfo.store
#
# Copia só o que o browser precisa. O schema, os testes, a Edge
# Function e estes próprios scripts ficam de fora: não são
# segredo — o repositório é público — mas não há razão para os
# servir, e um ficheiro que não é servido não pode ser servido
# por engano.
# ============================================================
set -euo pipefail

DOMINIO="${1:-maisinfo.store}"
BASE=/opt/explicacoes
APP="$BASE/app"
SITE="$BASE/site"

[ -d "$APP/.git" ] || { echo "não encontro o repositório em $APP" >&2; exit 1; }

echo "   a trazer o código mais recente"
git -C "$APP" fetch --quiet origin main
git -C "$APP" reset --hard --quiet origin/main
echo "   $(git -C "$APP" log --oneline -1)"

# Sem rsync: pode não existir numa VPS mínima, e o que isto faz é simples
# de mais para justificar uma dependência.
NOVO="$SITE.novo"
rm -rf "$NOVO"; mkdir -p "$NOVO"
for f in "$APP"/exp/*; do
  nome=$(basename "$f")
  case "$nome" in
    schema.sql|testes|edge|vps|README.md) continue ;;
  esac
  cp -r "$f" "$NOVO/"
done

# A app e a API partilham a origem, por isso o endereço é o próprio domínio.
CHAVE=$(grep '^ANON_KEY=' "$BASE/chaves.env" | cut -d= -f2-)
[ -n "$CHAVE" ] || { echo "não encontro a ANON_KEY em $BASE/chaves.env" >&2; exit 1; }

cat > "$NOVO/config.js" <<FIM
/* ============================================================
   mariaestuda — Explicações: configuração
   ------------------------------------------------------------
   Escrito pelo publicar.sh. Não editar à mão: a próxima
   publicação escreve por cima.

   A app e a API estão na mesma origem, por isso não há CORS
   nenhum e o endereço é o próprio domínio.
   ============================================================ */
window.EXPLICANDOS_CONFIG = {
  SUPABASE_URL: 'https://$DOMINIO',
  SUPABASE_ANON_KEY: '$CHAVE',
};
FIM

# A troca é um mv, não uma cópia ficheiro a ficheiro: ninguém apanha o site
# a meio de uma publicação.
rm -rf "$SITE.velho"
[ -d "$SITE" ] && mv "$SITE" "$SITE.velho"
mv "$NOVO" "$SITE"
rm -rf "$SITE.velho"

echo "   $(find "$SITE" -type f | wc -l) ficheiros em $SITE"
echo "   config.js a apontar para https://$DOMINIO"
