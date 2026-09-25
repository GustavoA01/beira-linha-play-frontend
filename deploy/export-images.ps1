# Gera as imagens de producao e exporta .tar.gz para a VPS.
# Execute na pasta pai (beira-linha-play), com Docker Desktop ligado:
#   .\scripts\export-images.ps1
#   .\scripts\export-images.ps1 -IncludePostgres
#
# Requer os clones lado a lado: beira-linha-play-frontend e beira-linha-play-backend.

[CmdletBinding()]
param(
  [switch]$IncludePostgres
)

$ErrorActionPreference = "Stop"

function Find-ComposeRoot {
  $dir = $PSScriptRoot
  while ($dir) {
    $hasCompose = Test-Path (Join-Path $dir "docker-compose.build.yml")
    $hasBackend = Test-Path (Join-Path $dir "beira-linha-play-backend")
    if ($hasCompose -and $hasBackend) {
      return $dir
    }
    $parent = Split-Path $dir
    if ($parent -eq $dir) {
      break
    }
    $dir = $parent
  }
  $cwd = (Get-Location).Path
  $hasCompose = Test-Path (Join-Path $cwd "docker-compose.build.yml")
  $hasBackend = Test-Path (Join-Path $cwd "beira-linha-play-backend")
  if ($hasCompose -and $hasBackend) {
    return $cwd
  }
  throw "Rode este script na pasta pai (onde estao docker-compose.build.yml e beira-linha-play-backend)."
}

function Save-GzipImage {
  param(
    [Parameter(Mandatory = $true)][string]$Image,
    [Parameter(Mandatory = $true)][string]$OutFile
  )

  $tar = [System.IO.Path]::ChangeExtension($OutFile, ".tar")
  Write-Host "Exportando $Image -> $OutFile"
  docker save $Image -o $tar
  if ($LASTEXITCODE -ne 0) {
    throw "docker save falhou para $Image."
  }

  $inStream = [System.IO.File]::OpenRead($tar)
  $outStream = [System.IO.File]::Create($OutFile)
  $gzip = New-Object System.IO.Compression.GZipStream(
    $outStream,
    [System.IO.Compression.CompressionLevel]::Optimal
  )
  try {
    $inStream.CopyTo($gzip)
  }
  finally {
    $gzip.Dispose()
    $outStream.Dispose()
    $inStream.Dispose()
  }
  Remove-Item $tar -Force
}

$Root = Find-ComposeRoot
Set-Location $Root

$OutDir = Join-Path $Root "deploy-out"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Write-Host "Construindo imagens..."
docker compose -f docker-compose.build.yml build
if ($LASTEXITCODE -ne 0) {
  throw "docker compose build falhou."
}

Save-GzipImage -Image "beira-linha-play-api:latest" -OutFile (Join-Path $OutDir "beira-linha-play-api.tar.gz")
Save-GzipImage -Image "beira-linha-play-frontend:latest" -OutFile (Join-Path $OutDir "beira-linha-play-frontend.tar.gz")

if ($IncludePostgres) {
  docker pull postgres:16-alpine
  if ($LASTEXITCODE -ne 0) {
    throw "docker pull postgres:16-alpine falhou."
  }
  Save-GzipImage -Image "postgres:16-alpine" -OutFile (Join-Path $OutDir "postgres-16-alpine.tar.gz")
}

Copy-Item (Join-Path $Root "docker-compose.prod.yml") (Join-Path $OutDir "docker-compose.prod.yml") -Force
Copy-Item (Join-Path $Root "docker-compose.https.yml") (Join-Path $OutDir "docker-compose.https.yml") -Force
Copy-Item (Join-Path $Root "Caddyfile") (Join-Path $OutDir "Caddyfile") -Force
Copy-Item (Join-Path $Root "DEPLOY.md") (Join-Path $OutDir "DEPLOY.md") -Force
Copy-Item (Join-Path $Root "deploy.env.example") (Join-Path $OutDir ".env.example") -Force

Write-Host ""
Write-Host "Pacote em $OutDir"
Write-Host "Zippe essa pasta (sem o .env preenchido) e envie para a VPS."
Write-Host "Na VPS: docker load + docker compose -f docker-compose.prod.yml up -d"
