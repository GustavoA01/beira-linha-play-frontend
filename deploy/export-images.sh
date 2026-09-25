#!/usr/bin/env bash
# Gera as imagens de producao e exporta .tar.gz para a VPS.
# Execute na pasta pai (beira-linha-play):
#   ./scripts/export-images.sh
#   ./scripts/export-images.sh --include-postgres
#
# Requer os clones lado a lado: beira-linha-play-frontend e beira-linha-play-backend.

set -euo pipefail

INCLUDE_POSTGRES=0
if [[ "${1:-}" == "--include-postgres" ]]; then
  INCLUDE_POSTGRES=1
fi

find_compose_root() {
  local dir
  dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  while [[ -n "$dir" && "$dir" != "/" ]]; do
    if [[ -f "$dir/docker-compose.build.yml" && -d "$dir/beira-linha-play-backend" ]]; then
      printf '%s\n' "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  if [[ -f "$PWD/docker-compose.build.yml" && -d "$PWD/beira-linha-play-backend" ]]; then
    printf '%s\n' "$PWD"
    return 0
  fi
  echo "Rode este script na pasta pai (onde estao docker-compose.build.yml e beira-linha-play-backend)." >&2
  return 1
}

save_gzip_image() {
  local image="$1"
  local out_file="$2"
  echo "Exportando $image -> $out_file"
  docker save "$image" | gzip -c > "$out_file"
}

ROOT="$(find_compose_root)"
cd "$ROOT"

OUT_DIR="$ROOT/deploy-out"
mkdir -p "$OUT_DIR"

echo "Construindo imagens..."
docker compose -f docker-compose.build.yml build

save_gzip_image "beira-linha-play-api:latest" "$OUT_DIR/beira-linha-play-api.tar.gz"
save_gzip_image "beira-linha-play-frontend:latest" "$OUT_DIR/beira-linha-play-frontend.tar.gz"

if [[ "$INCLUDE_POSTGRES" -eq 1 ]]; then
  docker pull postgres:16-alpine
  save_gzip_image "postgres:16-alpine" "$OUT_DIR/postgres-16-alpine.tar.gz"
fi

cp "$ROOT/docker-compose.prod.yml" "$OUT_DIR/docker-compose.prod.yml"
cp "$ROOT/docker-compose.https.yml" "$OUT_DIR/docker-compose.https.yml"
cp "$ROOT/Caddyfile" "$OUT_DIR/Caddyfile"
cp "$ROOT/DEPLOY.md" "$OUT_DIR/DEPLOY.md"
cp "$ROOT/deploy.env.example" "$OUT_DIR/.env.example"

echo
echo "Pacote em $OUT_DIR"
echo "Zippe essa pasta (sem o .env preenchido) e envie para a VPS."
echo "Na VPS: docker load + docker compose -f docker-compose.prod.yml up -d"
