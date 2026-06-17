Set-Location $PSScriptRoot

# ── Docker ─────────────────────────────────────────────────────────────────────
Write-Host "Verificando Docker Desktop..."
$dockerRunning = $false
try { docker info 2>$null | Out-Null; $dockerRunning = ($LASTEXITCODE -eq 0) } catch {}

if (-not $dockerRunning) {
    Write-Host "Docker nao esta rodando. Iniciando Docker Desktop..."
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    $elapsed = 0
    do {
        Start-Sleep -Seconds 5; $elapsed += 5
        try { docker info 2>$null | Out-Null; $dockerRunning = ($LASTEXITCODE -eq 0) } catch {}
        if (-not $dockerRunning) { Write-Host "  Aguardando Docker... ($elapsed s)" }
    } while (-not $dockerRunning -and $elapsed -lt 90)
    if (-not $dockerRunning) { Write-Host "ERRO: Docker nao iniciou." -ForegroundColor Red; exit 1 }
    Write-Host "Docker pronto!"
}

# ── PostgreSQL ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Iniciando PostgreSQL..."
docker compose up -d postgres
if ($LASTEXITCODE -ne 0) { Write-Host "ERRO ao subir postgres." -ForegroundColor Red; exit 1 }

Write-Host "Aguardando banco ficar pronto..."
$tries = 0
do {
    Start-Sleep -Seconds 3; $tries++
    docker compose exec postgres pg_isready -U pdage_user -d pdage_db 2>$null | Out-Null
    $pgReady = ($LASTEXITCODE -eq 0)
    if (-not $pgReady) { Write-Host "  Tentativa $tries..." }
} while (-not $pgReady -and $tries -lt 15)
if (-not $pgReady) { Write-Host "ERRO: PostgreSQL nao ficou pronto." -ForegroundColor Red; exit 1 }
Write-Host "PostgreSQL pronto!"

# ── Dependencias ───────────────────────────────────────────────────────────────
if (-not (Test-Path "$PSScriptRoot\node_modules")) {
    Write-Host ""
    Write-Host "Instalando dependencias (npm install)..."
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Host "ERRO no npm install." -ForegroundColor Red; exit 1 }
}

# ── Prisma ─────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Gerando Prisma Client..."
Set-Location "$PSScriptRoot\apps\backend"
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Host "ERRO no prisma generate." -ForegroundColor Red; Set-Location $PSScriptRoot; exit 1 }

Write-Host "Sincronizando schema com o banco (db push)..."
npx prisma db push --accept-data-loss
if ($LASTEXITCODE -ne 0) { Write-Host "ERRO no prisma db push." -ForegroundColor Red; Set-Location $PSScriptRoot; exit 1 }
Write-Host "Schema aplicado!"
Set-Location $PSScriptRoot

# ── Para containers Docker do frontend/backend (libera portas 3000/3001) ───────
Write-Host ""
Write-Host "Parando containers Docker do frontend/backend (modo dev usa servidores locais)..."
docker compose stop frontend backend 2>$null | Out-Null

# ── Dev servers ────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Iniciando Backend (watch mode)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\apps\backend'; npm run start:dev"

Write-Host "Iniciando Frontend (Next.js dev)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\apps\frontend'; npm run dev -- -p 3002"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  PDAGE rodando em modo desenvolvimento" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend : http://localhost:3002"
Write-Host "  API      : http://localhost:3001/api/health"
Write-Host "  DB shell : docker compose exec postgres psql -U pdage_user -d pdage_db"
Write-Host ""
Write-Host "Feche as janelas do backend/frontend para parar." -ForegroundColor DarkGray
