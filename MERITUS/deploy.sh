#!/bin/bash
set -e
cd /var/www/PDAGE
git fetch origin
git reset --hard origin/main
docker compose up --build -d
