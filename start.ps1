Set-Location $PSScriptRoot

Write-Host "Verificando Docker Desktop..."

$dockerRunning = $false
try {
    docker info 2>$null | Out-Null
    $dockerRunning = ($LASTEXITCODE -eq 0)
} catch {}

if (-not $dockerRunning) {
    Write-Host "Docker nao esta rodando. Iniciando Docker Desktop..."
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

    Write-Host "Aguardando Docker iniciar (pode levar ate 30s)..."
    do {
        Start-Sleep -Seconds 5
        try {
            docker info 2>$null | Out-Null
            $dockerRunning = ($LASTEXITCODE -eq 0)
        } catch {}
        Write-Host "  Ainda aguardando..."
    } while (-not $dockerRunning)

    Write-Host "Docker pronto!"
}

Write-Host ""
Write-Host "Iniciando PDAGE - Frontend + Backend..."
Write-Host ""

docker compose up --build -d frontend backend postgres

Write-Host ""
Write-Host "Status dos containers:"
docker compose ps frontend backend postgres
Write-Host ""
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend:  http://localhost:3001/api/health"
