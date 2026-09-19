#!/usr/bin/env bash
# ============================================================
# mariaestuda — Supabase self-hosted numa VPS
# ------------------------------------------------------------
# Corre isto UMA vez, como root, numa VPS Ubuntu 22.04 ou 24.04
# acabada de criar:
#
#   curl -fsSL https://mariaestuda.eu/exp/vps/instalar.sh -o instalar.sh
#   bash instalar.sh api.maisinfo.site
#
# Antes de correr, o subdomínio tem de já apontar para o IP
# desta máquina — o certificado é emitido pelo Let's Encrypt,
# que verifica o DNS. Se ainda não propagou, o script pára e
# diz-to em vez de deixar o Caddy a falhar em silêncio.
# ============================================================
set -euo pipefail

DOMINIO="${1:-api.maisinfo.site}"
DIR=/opt/supabase
EMAIL_TLS="${EMAIL_TLS:-maria.leonor.cotter@gmail.com}"

erro() { echo "ERRO: $*" >&2; exit 1; }
passo() { echo; echo "── $* ──"; }

[ "$(id -u)" = 0 ] || erro "corre isto como root (sudo bash instalar.sh ...)"
# Onde a aplicação é servida. Se um dia a mudares para o maisinfo.site,
# é esta variável que muda — o GoTrue recusa redirecionar para origens
# que não estejam aqui.
URL_APP="${URL_APP:-https://mariaestuda.eu/exp/}"
[ -n "$DOMINIO" ] || erro "falta o domínio: bash instalar.sh api.maisinfo.site"

passo "1/7 · confirmar que o DNS já aponta para cá"
IP_MAQUINA=$(curl -fsS --max-time 10 https://api.ipify.org || echo "")
IP_DNS=$(getent hosts "$DOMINIO" | awk '{print $1}' | head -1 || echo "")
if [ -z "$IP_DNS" ]; then
  erro "$DOMINIO não resolve. Cria o registo A no DNS do maisinfo.site a apontar para $IP_MAQUINA e espera uns minutos."
elif [ -n "$IP_MAQUINA" ] && [ "$IP_DNS" != "$IP_MAQUINA" ]; then
  erro "$DOMINIO aponta para $IP_DNS, mas esta máquina é $IP_MAQUINA. Corrige o registo A."
fi
echo "   $DOMINIO → $IP_DNS ✓"

passo "2/7 · Docker"
if ! command -v docker >/dev/null; then
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl git
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
docker --version

passo "3/7 · trazer o Supabase"
# A stack oficial, não uma minha: é a que é mantida e corrigida.
if [ ! -d "$DIR/docker" ]; then
  mkdir -p "$DIR"
  git clone --depth 1 --filter=blob:none --sparse https://github.com/supabase/supabase "$DIR/repo"
  git -C "$DIR/repo" sparse-checkout set docker
  cp -r "$DIR/repo/docker" "$DIR/docker"
  cp "$DIR/docker/.env.example" "$DIR/docker/.env"
fi

passo "4/7 · segredos"
if ! grep -q "^JWT_SECRET=.\{32,\}" "$DIR/docker/.env" 2>/dev/null || [ ! -f "$DIR/chaves.env" ]; then
  curl -fsSL "https://mariaestuda.eu/exp/vps/gerar-chaves.sh" -o "$DIR/gerar-chaves.sh" 2>/dev/null \
    || cp "$(dirname "$0")/gerar-chaves.sh" "$DIR/gerar-chaves.sh"
  bash "$DIR/gerar-chaves.sh" > "$DIR/chaves.env"
  chmod 600 "$DIR/chaves.env"
fi

# Escreve cada chave por cima da linha correspondente do .env.
poe() {
  local chave="$1" valor="$2" f="$DIR/docker/.env"
  if grep -q "^${chave}=" "$f"; then
    # O valor pode ter barras e &; o sed tem de as engolir.
    python3 - "$f" "$chave" "$valor" <<'PY'
import sys, pathlib
f, chave, valor = sys.argv[1], sys.argv[2], sys.argv[3]
p = pathlib.Path(f)
linhas = [f'{chave}={valor}' if l.startswith(chave + '=') else l.rstrip('\n')
          for l in p.read_text().splitlines()]
p.write_text('\n'.join(linhas) + '\n')
PY
  else
    echo "${chave}=${valor}" >> "$f"
  fi
}

while IFS='=' read -r k v; do [ -n "$k" ] && poe "$k" "$v"; done < "$DIR/chaves.env"

poe API_EXTERNAL_URL    "https://$DOMINIO"
poe SUPABASE_PUBLIC_URL "https://$DOMINIO"
poe SITE_URL            "$URL_APP"
poe ADDITIONAL_REDIRECT_URLS "$URL_APP"
# §59 do caderno: não há auto-inscrição. Aqui é configuração, não um botão
# que alguém se possa esquecer de desligar.
poe DISABLE_SIGNUP      "true"
poe ENABLE_EMAIL_SIGNUP "false"
poe ENABLE_ANONYMOUS_USERS "false"
poe ENABLE_EMAIL_AUTOCONFIRM "true"
poe STUDIO_DEFAULT_PROJECT "explicacoes"

passo "5/7 · HTTPS com o Caddy"
cat > "$DIR/docker/docker-compose.override.yml" <<FIM
# O Caddy trata dos certificados sozinho, renovação incluída. Sem isto, a
# app deixava de falar com a base de dados ao fim de 90 dias, sem aviso.
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on: [kong]

volumes:
  caddy_data:
  caddy_config:
FIM

cat > "$DIR/docker/Caddyfile" <<FIM
$DOMINIO {
	encode gzip
	reverse_proxy kong:8000
}
FIM

passo "6/7 · fechar a porta do PostgreSQL ao mundo"
# A stack oficial expõe o 5432. Numa VPS pública isso é uma porta de
# entrada para ataques de dicionário à base de dados inteira.
python3 - "$DIR/docker/docker-compose.yml" <<'PY'
import re, sys, pathlib
p = pathlib.Path(sys.argv[1])
s = p.read_text()
s = re.sub(r'(\n\s*- )\$\{POSTGRES_PORT\}:\$\{POSTGRES_PORT\}',
           r'\g<1>127.0.0.1:${POSTGRES_PORT}:${POSTGRES_PORT}', s)
p.write_text(s)
PY
if command -v ufw >/dev/null; then
  ufw --force reset >/dev/null 2>&1 || true
  ufw default deny incoming >/dev/null
  ufw default allow outgoing >/dev/null
  ufw allow OpenSSH >/dev/null
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
  ufw --force enable >/dev/null
fi

passo "7/7 · arrancar"
cd "$DIR/docker"
docker compose pull -q
docker compose up -d
sleep 20
docker compose ps

echo
echo "════════════════════════════════════════════════════════"
echo " Pronto. A API responde em https://$DOMINIO"
echo
echo " A chave para o config.js da app (ANON_KEY):"
grep '^ANON_KEY=' "$DIR/chaves.env" | cut -d= -f2-
echo
echo " O painel (Studio) está em https://$DOMINIO"
echo " utilizador e palavra-passe em $DIR/chaves.env"
echo
echo " GUARDA $DIR/chaves.env NUM SÍTIO SEGURO."
echo " Sem o JWT_SECRET, as contas existentes deixam de entrar."
echo
echo " Falta ainda:"
echo "   1. correr o schema.sql (Studio → SQL Editor)"
echo "   2. instalar as cópias de segurança: bash copia-seguranca.sh --instalar"
echo "   3. apontar o config.js da app para https://$DOMINIO"
echo "════════════════════════════════════════════════════════"
