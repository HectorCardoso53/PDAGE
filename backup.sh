#!/bin/bash
# Backup automático PDAGE — uploads + banco de dados
set -e

BACKUP_DIR="/var/backups/pdage"
DATE=$(date +%Y%m%d_%H%M%S)
DEST="$BACKUP_DIR/$DATE"

mkdir -p "$DEST/uploads"
mkdir -p "$DEST/db"

# Backup dos PDFs (volume Docker)
VOLUME_PATH=$(docker volume inspect pdage-uploads-data --format '{{ .Mountpoint }}' 2>/dev/null)
if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
  COUNT=$(ls "$VOLUME_PATH" 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    cp "$VOLUME_PATH"/* "$DEST/uploads/" 2>/dev/null
    echo "[$(date)] Uploads: $COUNT arquivos copiados para $DEST/uploads/"
  else
    echo "[$(date)] Uploads: volume vazio — nenhum arquivo para backup"
  fi
else
  echo "[$(date)] AVISO: volume pdage-uploads-data não encontrado"
fi

# Backup do banco PostgreSQL
docker exec pdage-postgres pg_dump -U pdage_user pdage_db > "$DEST/db/pdage_db_$DATE.sql" 2>/dev/null
DB_SIZE=$(du -sh "$DEST/db/pdage_db_$DATE.sql" | cut -f1)
echo "[$(date)] Banco: dump salvo ($DB_SIZE) em $DEST/db/"

# Manter apenas os últimos 14 backups (7 dias × 2 por dia)
ls -dt "$BACKUP_DIR"/[0-9]*/ 2>/dev/null | tail -n +15 | xargs rm -rf 2>/dev/null || true

echo "[$(date)] Backup concluído: $DEST"
