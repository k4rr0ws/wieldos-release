#!/usr/bin/env bash
# WieldOS install v0.0.1
# Run once from the release root after extracting the archive.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p data backups plugins

if [ ! -f .env ]; then
  cat > .env <<'EOF'
# WieldOS environment
# ORIGIN is required in production — set it to your public-facing URL.
ORIGIN=http://localhost:3000

# Uncomment to change the host port Docker binds to (default 3000).
# HOST_PORT=3000
EOF
  echo "[install] created .env — update ORIGIN before exposing to the internet."
fi

dc() {
  if docker compose version >/dev/null 2>&1; then docker compose "$@";
  elif command -v docker-compose >/dev/null 2>&1; then docker-compose "$@";
  else echo "[install] docker compose not found. Install Docker Desktop or the compose plugin."; exit 1; fi
}

echo "[install] building image…"
dc -f compose/docker-compose.yml build

echo "[install] starting…"
dc -f compose/docker-compose.yml up -d

echo "[install] done. WieldOS is running on http://localhost:3000"
echo "[install] logs: docker compose -f compose/docker-compose.yml logs -f"