#!/usr/bin/env bash
# ============================================================
# mariaestuda — as explicações inteiras numa VPS
# ------------------------------------------------------------
# O site E a base de dados na mesma máquina, no mesmo domínio.
# Por estarem na mesma origem, não há CORS nenhum para
# configurar — e é uma classe inteira de problemas que deixa
# de existir.
#
# Corre UMA vez, como root, numa VPS Ubuntu 22.04 ou 24.04
# acabada de criar:
#
#   curl -fsSL https://mariaestuda.eu/exp/vps/instalar.sh -o instalar.sh
#   bash instalar.sh maisinfo.site o-teu@email
#
# No fim está tudo a funcionar: tabelas criadas, a tua conta
# feita, a app a servir. O script escreve-te a palavra-passe.
#
# Antes de correr, o registo A tem de já apontar para cá:
#   maisinfo.site   A   <IP desta máquina>
#
# O painel de administração (Studio) NÃO fica exposto. Chega-se lá por
# um túnel SSH, quando for preciso:
#   ssh -L 8000:localhost:8000 root@<IP>   e abrir http://localhost:8000
# ============================================================
set -euo pipefail

DOMINIO="${1:-maisinfo.site}"
EMAIL_ADMIN="${2:-maria.leonor.cotter@gmail.com}"
NOME_ADMIN="${NOME_ADMIN:-Maria}"
REPO="${REPO:-https://github.com/mariavvcotter/mariaestuda}"

BASE=/opt/explicacoes
SUPA="$BASE/supabase/docker"
SITE="$BASE/site"

erro() { echo; echo "ERRO: $*" >&2; exit 1; }
passo() { echo; echo "── $* ──"; }

[ "$(id -u)" = 0 ] || erro "corre isto como root"

passo "1/9 · confirmar o DNS"
IP_MAQUINA=$(curl -fsS --max-time 10 https://api.ipify.org || echo "")
for h in "$DOMINIO"; do
  ip=$(getent hosts "$h" | awk '{print $1}' | head -1 || echo "")
  [ -n "$ip" ] || erro "$h não resolve. Cria o registo A a apontar para ${IP_MAQUINA:-o IP desta máquina} e espera uns minutos."
  if [ -n "$IP_MAQUINA" ] && [ "$ip" != "$IP_MAQUINA" ]; then
    erro "$h aponta para $ip, mas esta máquina é $IP_MAQUINA."
  fi
  echo "   $h → $ip ✓"
done

passo "2/9 · Docker"
if ! command -v docker >/dev/null; then
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl git jq

  # O repositório oficial da Docker só tem as versões do Ubuntu que já
  # suporta. Numa versão acabada de sair, o ficheiro de pacotes ainda não
  # existe e o `apt update` estoira. Confirma-se antes de o acrescentar.
  CODINOME=$(. /etc/os-release && echo "$VERSION_CODENAME")
  ARQ=$(dpkg --print-architecture)
  if curl -fsI --max-time 15 \
      "https://download.docker.com/linux/ubuntu/dists/$CODINOME/Release" >/dev/null 2>&1; then
    echo "   repositório oficial da Docker para $CODINOME"
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    echo "deb [arch=$ARQ signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $CODINOME stable" > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io \
      docker-buildx-plugin docker-compose-plugin
  else
    # O Ubuntu traz os seus próprios pacotes. São mais antigos, mas fazem
    # o mesmo, e é melhor do que não haver Docker nenhum.
    echo "   a Docker ainda não publicou para $CODINOME; a usar os pacotes do Ubuntu"
    rm -f /etc/apt/sources.list.d/docker.list
    apt-get install -y -qq docker.io docker-compose-v2 || \
      apt-get install -y -qq docker.io docker-compose
  fi
fi

docker compose version >/dev/null 2>&1 || erro \
  "o docker compose não ficou instalado. Vê: apt-cache policy docker-compose-v2"
docker --version

passo "3/9 · trazer o código"
mkdir -p "$BASE"
if [ ! -d "$BASE/app/.git" ]; then
  git clone --depth 1 "$REPO" "$BASE/app"
else
  git -C "$BASE/app" pull --ff-only
fi
# A stack oficial do Supabase, não uma minha: é a que é mantida.
if [ ! -d "$SUPA" ]; then
  git clone --depth 1 --filter=blob:none --sparse https://github.com/supabase/supabase "$BASE/supabase-repo"
  git -C "$BASE/supabase-repo" sparse-checkout set docker
  mkdir -p "$BASE/supabase"
  cp -r "$BASE/supabase-repo/docker" "$SUPA"
  cp "$SUPA/.env.example" "$SUPA/.env"
fi

passo "4/9 · segredos"
if [ ! -f "$BASE/chaves.env" ]; then
  bash "$BASE/app/exp/vps/gerar-chaves.sh" > "$BASE/chaves.env"
  chmod 600 "$BASE/chaves.env"
fi
# shellcheck disable=SC1090
set -a; . "$BASE/chaves.env"; set +a

poe() {
  python3 - "$SUPA/.env" "$1" "$2" <<'PY'
import sys, pathlib
f, chave, valor = sys.argv[1:4]
p = pathlib.Path(f)
linhas, visto = [], False
for l in p.read_text().splitlines():
    if l.startswith(chave + '='):
        linhas.append(f'{chave}={valor}'); visto = True
    else:
        linhas.append(l)
if not visto:
    linhas.append(f'{chave}={valor}')
p.write_text('\n'.join(linhas) + '\n')
PY
}
while IFS='=' read -r k v; do [ -n "$k" ] && poe "$k" "$v"; done < "$BASE/chaves.env"

poe API_EXTERNAL_URL    "https://$DOMINIO"
poe SUPABASE_PUBLIC_URL "https://$DOMINIO"
poe SITE_URL            "https://$DOMINIO"
poe ADDITIONAL_REDIRECT_URLS "https://$DOMINIO"
# §59: não há auto-inscrição. Aqui é configuração, não um botão que
# alguém se possa esquecer de desligar.
poe DISABLE_SIGNUP         "true"
poe ENABLE_EMAIL_SIGNUP    "false"
poe ENABLE_ANONYMOUS_USERS "false"
poe ENABLE_EMAIL_AUTOCONFIRM "true"
poe STUDIO_DEFAULT_PROJECT "explicacoes"

passo "5/9 · Caddy: o site e a API na mesma origem"
cat > "$SUPA/docker-compose.override.yml" <<FIM
# O Caddy serve os ficheiros da app e encaminha os caminhos da API para o
# Kong. Mesma origem, logo sem CORS. Os certificados renovam-se sozinhos.
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - $SITE:/srv:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on: [api-gw]

volumes:
  caddy_data:
  caddy_config:
FIM

cat > "$SUPA/Caddyfile" <<FIM
$DOMINIO {
	encode gzip

	# Tudo o que é API vai para o Kong; o resto são ficheiros da app.
	@api path /rest/* /auth/* /storage/* /realtime/* /functions/*
	reverse_proxy @api api-gw:8000

	root * /srv
	file_server

	header {
		Referrer-Policy strict-origin-when-cross-origin
		X-Content-Type-Options nosniff
		-Server
	}
	# Dados de menores não têm nada que aparecer em motores de busca.
	header /* X-Robots-Tag "noindex, nofollow"
}
FIM

passo "6/9 · fechar as portas ao mundo"
# A stack oficial publica o PostgreSQL, o pooler e o gateway da API. Numa
# VPS pública isso são portas abertas para quem lá bater. Ficam presas ao
# localhost: continuam acessíveis por túnel SSH, mas não da internet.
python3 "$BASE/app/exp/vps/fechar-portas.py" "$SUPA/docker-compose.yml"

if command -v ufw >/dev/null; then
  # Acrescentar, não repor. Um `ufw --force reset` apagaria regras que já
  # lá estivessem — e a primeira coisa que se abre numa máquina é o SSH.
  ufw allow OpenSSH >/dev/null 2>&1 || ufw allow 22/tcp >/dev/null
  ufw allow 80/tcp  >/dev/null
  ufw allow 443/tcp >/dev/null
  ufw default deny incoming >/dev/null
  ufw default allow outgoing >/dev/null
  ufw --force enable >/dev/null
  echo "   firewall: 22, 80 e 443 abertas; o resto fechado"
fi

passo "7/9 · publicar a app"
bash "$BASE/app/exp/vps/publicar.sh" "$DOMINIO"

passo "8/9 · instalar a função das contas e arrancar"
# É ela que deixa criar contas e definir palavras-passe de dentro da app.
mkdir -p "$SUPA/volumes/functions/admin-contas"
cp "$BASE/app/exp/edge/admin-contas/index.ts" "$SUPA/volumes/functions/admin-contas/index.ts"

cd "$SUPA"
docker compose pull -q
docker compose up -d

echo -n "   à espera da base de dados"
for i in $(seq 1 60); do
  if docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then echo " ✓"; break; fi
  echo -n "."; sleep 2
  [ "$i" = 60 ] && erro "a base de dados não arrancou. Vê: docker compose logs db"
done

echo -n "   à espera da API"
for i in $(seq 1 60); do
  if curl -fsS --max-time 5 "http://127.0.0.1:8000/auth/v1/health" >/dev/null 2>&1; then echo " ✓"; break; fi
  echo -n "."; sleep 2
  [ "$i" = 60 ] && erro "a API não respondeu. Vê: docker compose logs api-gw auth"
done

passo "9/9 · criar as tabelas e a tua conta"
docker compose exec -T db psql -U postgres -d postgres -q < "$BASE/app/exp/schema.sql" 2>&1 \
  | grep -iE "^(ERROR|NOTICE:  (Administradora|Ainda|Já|Há))" || true

# A conta cria-se pela API de administração, com a service_role — a mesma
# coisa que o botão "Add user" faz no painel.
SENHA="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)"
RESPOSTA=$(curl -fsS -X POST "http://127.0.0.1:8000/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL_ADMIN\",\"password\":\"$SENHA\",\"email_confirm\":true,\"user_metadata\":{\"nome\":\"$NOME_ADMIN\"}}" \
  2>/dev/null || echo '{}')
ID_ADMIN=$(echo "$RESPOSTA" | jq -r '.id // empty')

if [ -n "$ID_ADMIN" ]; then
  docker compose exec -T db psql -U postgres -d postgres -q -c \
    "insert into public.perfis (id, nome) values ('$ID_ADMIN', '$NOME_ADMIN') on conflict (id) do nothing;
     update public.perfis set is_admin = true, ve_conta_corrente = true, ve_materiais = true
      where id = '$ID_ADMIN';"
  CRIADA="sim"
else
  # Já existia, ou a API recusou. Promove quem lá estiver, se for uma só.
  docker compose exec -T db psql -U postgres -d postgres -q -c \
    "update public.perfis set is_admin = true, ve_conta_corrente = true, ve_materiais = true
      where id = (select id from public.perfis) and (select count(*) from public.perfis) = 1;" || true
  CRIADA="não"
fi

echo
echo "════════════════════════════════════════════════════════"
echo "  https://$DOMINIO"
echo
if [ "$CRIADA" = "sim" ]; then
  echo "  email:          $EMAIL_ADMIN"
  echo "  palavra-passe:  $SENHA"
  echo
  echo "  APONTA ISTO AGORA. Fica cifrada e não volta a aparecer."
  echo "  Muda-a assim que entrares, no separador Contas."
else
  echo "  A conta $EMAIL_ADMIN já existia — a palavra-passe é a de antes."
  echo "  Se a perdeste: docker compose exec db psql -U postgres -c \\"
  echo "    \"select id, email from auth.users;\"  e define outra pelo Studio."
fi
echo
echo "  Painel de administração: não está exposto, de propósito."
echo "  Quando precisares dele:"
echo "    ssh -L 8000:localhost:8000 root@$IP_MAQUINA"
echo "    e abres http://localhost:8000 no teu browser"
echo
echo "  GUARDA $BASE/chaves.env FORA DESTA MÁQUINA."
echo "  Sem o JWT_SECRET, nenhuma conta volta a entrar."
echo
echo "  Falta só: bash $BASE/app/exp/vps/copia-seguranca.sh --instalar"
echo "════════════════════════════════════════════════════════"
