@echo off
cd /d "%~dp0"

echo Verificando Docker Desktop...

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker nao esta rodando. Iniciando Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

    echo Aguardando Docker iniciar (pode levar ate 30s)...
    :waitloop
    timeout /t 5 /nobreak >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 goto waitloop
    echo Docker pronto!
    echo.
)

echo Iniciando PDAGE - Frontend + Backend...
echo.

docker compose up --build -d frontend backend postgres

echo.
echo Status dos containers:
docker compose ps frontend backend postgres
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001/api/health
