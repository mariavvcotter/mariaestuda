#!/usr/bin/env bash
# ============================================================
# Gera os segredos de um Supabase self-hosted.
#
# As chaves `anon` e `service_role` não são aleatórias: são JWT
# assinados com o JWT_SECRET deste servidor. Se não baterem
# certo, o PostgREST devolve 401 a tudo e não há mensagem que o
# explique. É por isso que isto é um script e não um parágrafo.
#
#   ./gerar-chaves.sh > .env.gerado
# ============================================================
set -euo pipefail

# Base64 "URL-safe", sem o preenchimento, como o JWT exige.
b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }

# JWT HS256 com o papel pedido, válido dez anos.
jwt() {
  local papel="$1" segredo="$2"
  local agora expira cabecalho corpo assinatura
  agora=$(date +%s)
  expira=$(( agora + 10 * 365 * 24 * 3600 ))
  cabecalho=$(printf '{"alg":"HS256","typ":"JWT"}' | b64url)
  corpo=$(printf '{"role":"%s","iss":"supabase","iat":%s,"exp":%s}' "$papel" "$agora" "$expira" | b64url)
  assinatura=$(printf '%s.%s' "$cabecalho" "$corpo" \
    | openssl dgst -binary -sha256 -hmac "$segredo" | b64url)
  printf '%s.%s.%s' "$cabecalho" "$corpo" "$assinatura"
}

aleatorio() { openssl rand -hex "${1:-32}"; }

JWT_SECRET=$(aleatorio 32)          # 64 caracteres: o mínimo é 32
POSTGRES_PASSWORD=$(aleatorio 24)
DASHBOARD_PASSWORD=$(aleatorio 16)
SECRET_KEY_BASE=$(aleatorio 32)
VAULT_ENC_KEY=$(aleatorio 16)

cat <<FIM
JWT_SECRET=$JWT_SECRET
ANON_KEY=$(jwt anon "$JWT_SECRET")
SERVICE_ROLE_KEY=$(jwt service_role "$JWT_SECRET")
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DASHBOARD_USERNAME=maria
DASHBOARD_PASSWORD=$DASHBOARD_PASSWORD
SECRET_KEY_BASE=$SECRET_KEY_BASE
VAULT_ENC_KEY=$VAULT_ENC_KEY
FIM
