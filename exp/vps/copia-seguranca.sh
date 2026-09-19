#!/usr/bin/env bash
# ============================================================
# mariaestuda — cópias de segurança da base de dados
# ------------------------------------------------------------
# A partir do momento em que o PostgreSQL é teu, isto é a única
# coisa entre um disco que falhe e perderes o histórico de
# pagamentos de todas as famílias. O Supabase alojado fazia-o
# sozinho; aqui não faz ninguém.
#
#   bash copia-seguranca.sh --instalar   # põe no cron, diário às 4h
#   bash copia-seguranca.sh              # corre já, uma vez
#   bash copia-seguranca.sh --restaurar FICHEIRO.sql.gz
#
# As cópias ficam em /var/backups/explicacoes e guardam-se 30
# dias. Uma cópia que viva só nesta máquina não é uma cópia de
# segurança: define DESTINO_REMOTO para as mandar para fora.
# ============================================================
set -euo pipefail

DIR=/opt/supabase/docker
DESTINO=/var/backups/explicacoes
DIAS=30
# Ex.: DESTINO_REMOTO="gdrive:copias-explicacoes" (rclone), ou
#      DESTINO_REMOTO="maria@outra-maquina:/copias" (scp)
DESTINO_REMOTO="${DESTINO_REMOTO:-}"

instalar() {
  mkdir -p "$DESTINO"
  local caminho; caminho=$(readlink -f "$0")
  local linha="0 4 * * * /usr/bin/env bash $caminho >> /var/log/copia-explicacoes.log 2>&1"
  # Sem duplicar a entrada se isto correr duas vezes.
  ( crontab -l 2>/dev/null | grep -vF "$caminho" || true; echo "$linha" ) | crontab -
  echo "Instalado. Corre todos os dias às 4h da manhã."
  crontab -l | grep -F "$caminho"
  [ -z "$DESTINO_REMOTO" ] && cat <<'FIM'

AVISO: as cópias ficam só nesta máquina. Se o disco morrer, morrem com ele.
Define DESTINO_REMOTO no topo deste ficheiro para as mandar para fora.
FIM
}

restaurar() {
  local ficheiro="$1"
  [ -f "$ficheiro" ] || { echo "não encontro $ficheiro" >&2; exit 1; }
  echo "Isto APAGA a base de dados atual e põe a de $ficheiro no lugar."
  read -r -p "Escreve RESTAURAR para confirmar: " resposta
  [ "$resposta" = "RESTAURAR" ] || { echo "Cancelado."; exit 1; }
  gunzip -c "$ficheiro" | docker compose -f "$DIR/docker-compose.yml" exec -T db \
    psql -U postgres -d postgres
  echo "Restaurado."
}

copiar() {
  mkdir -p "$DESTINO"
  local nome="$DESTINO/explicacoes-$(date +%Y-%m-%d-%H%M).sql.gz"

  # --clean --if-exists deixa o ficheiro pronto a ser restaurado por cima
  # de uma base de dados que já exista.
  docker compose -f "$DIR/docker-compose.yml" exec -T db \
    pg_dumpall -U postgres --clean --if-exists | gzip > "$nome.parcial"

  # Só passa a contar como cópia depois de estar inteira: um dump cortado a
  # meio com o nome certo é pior do que não haver cópia nenhuma.
  if [ ! -s "$nome.parcial" ] || [ "$(stat -c%s "$nome.parcial")" -lt 1024 ]; then
    rm -f "$nome.parcial"
    echo "$(date -Is)  FALHOU: o dump saiu vazio" >&2
    exit 1
  fi
  mv "$nome.parcial" "$nome"
  echo "$(date -Is)  $nome ($(du -h "$nome" | cut -f1))"

  if [ -n "$DESTINO_REMOTO" ]; then
    if command -v rclone >/dev/null && [[ "$DESTINO_REMOTO" != *:/* ]]; then
      rclone copy "$nome" "$DESTINO_REMOTO" && echo "  enviada para $DESTINO_REMOTO"
    else
      scp -q "$nome" "$DESTINO_REMOTO" && echo "  enviada para $DESTINO_REMOTO"
    fi
  fi

  find "$DESTINO" -name 'explicacoes-*.sql.gz' -mtime "+$DIAS" -delete
}

case "${1:-}" in
  --instalar)  instalar ;;
  --restaurar) restaurar "${2:?falta o ficheiro}" ;;
  *)           copiar ;;
esac
