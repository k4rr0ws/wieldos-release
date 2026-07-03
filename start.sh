#!/usr/bin/env bash
# WieldOS release — bare-metal startup. Installs production dependencies on the
# first run, then launches the prebuilt server. Configure via .env first:
#   cp .env.example .env   # then set ANTHROPIC_API_KEY (or set it in Settings later)
set -euo pipefail
cd "$(dirname "$0")"

export NODE_ENV=production
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-3000}"

if [ ! -d node_modules ]; then
  echo "[wieldos] installing production dependencies…"
  npm ci --omit=dev
fi

mkdir -p data plugins backups
exec node build
