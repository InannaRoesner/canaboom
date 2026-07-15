# Render Blueprint Deploy (benötigt RENDER_API_KEY)
# API-Key: https://dashboard.render.com/u/settings#api-keys

param(
    [string]$ApiKey = $env:RENDER_API_KEY,
    [string]$Repo = "https://github.com/InannaRoesner/canaboom",
    [string]$Branch = "main"
)

if (-not $ApiKey) {
    Write-Host "RENDER_API_KEY fehlt." -ForegroundColor Red
    Write-Host "1. https://dashboard.render.com/u/settings#api-keys"
    Write-Host "2. `$env:RENDER_API_KEY='rnd_...'"
    Write-Host "3. Oder manuell: https://render.com/deploy?repo=$Repo"
    exit 1
}

$body = @{
    repo   = $Repo
    branch = $Branch
    name   = "canaboom"
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "https://api.render.com/v1/blueprints" `
        -Method Post `
        -Headers @{ Authorization = "Bearer $ApiKey"; "Content-Type" = "application/json" } `
        -Body $body
    Write-Host "Blueprint erstellt:" $resp.id -ForegroundColor Green
    Write-Host "Dashboard: https://dashboard.render.com"
} catch {
    Write-Host "API-Fehler — nutze manuellen Deploy:" -ForegroundColor Yellow
    Write-Host "https://render.com/deploy?repo=$Repo"
    Write-Host $_.Exception.Message
}
