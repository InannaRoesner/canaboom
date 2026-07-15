# Start Expo on first free port (8081–8090) — PowerShell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
$ports = 8081..8090
$freePort = $null
foreach ($p in $ports) {
  $inUse = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
  if (-not $inUse) { $freePort = $p; break }
}
if (-not $freePort) { $freePort = 8081; Write-Warning "All ports busy, trying 8081 anyway." }

Set-Location $PSScriptRoot
Write-Host "Starting CanaBoom Expo on port $freePort …" -ForegroundColor Cyan
npx expo start --port $freePort
