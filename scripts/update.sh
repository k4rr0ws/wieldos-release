#!/usr/bin/env bash
# WieldOS update v0.0.1
# Checks GitHub for a newer release. If found: backs up data/, applies the new
# release (preserving data/, backups/, plugins/, .env), rebuilds, and restarts.
#
#   WIELDOS_REPO   GitHub "owner/name"       (default: k4rr0ws/wieldos-release)
#   WIELDOS_ASSET  release asset filename    (default: wieldos-release.tar.gz)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${WIELDOS_REPO:-k4rr0ws/wieldos-release}"
ASSET="${WIELDOS_ASSET:-wieldos-release.tar.gz}"
API="https://api.github.com/repos/${REPO}/releases/latest"

current="$(cat dashboard/VERSION 2>/dev/null | tr -d '[:space:]' || echo 0.0.0)"
echo "[update] installed: ${current}"
echo "[update] checking ${REPO}…"

meta="$(curl -fsSL "$API" 2>/dev/null || true)"
if [ -z "$meta" ]; then
  echo "[update] could not reach GitHub — nothing to do."
  exit 0
fi

latest="$(printf '%s' "$meta" | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name"[[:space:]]*:[[:space:]]*"v?([^"]+)".*/\1/')"
url="$(printf '%s' "$meta" | grep -m1 "browser_download_url.*${ASSET}" | sed -E 's/.*"browser_download_url"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')"

if [ -z "$latest" ]; then
  echo "[update] could not parse latest version — nothing to do."
  exit 0
fi
echo "[update] latest:    ${latest}"

newest="$(printf '%s\n%s\n' "$current" "$latest" | sort -V | tail -n1)"
if [ "$latest" = "$current" ] || [ "$newest" = "$current" ]; then
  echo "[update] already up to date."
  exit 0
fi
if [ -z "$url" ]; then
  echo "[update] release ${latest} exists but has no '${ASSET}' asset — cannot auto-apply."
  exit 1
fi

ts="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups
if [ -d data ]; then
  echo "[update] backing up data/ → backups/pre-update-${ts}.tar.gz"
  tar -czf "backups/pre-update-${ts}.tar.gz" data
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
echo "[update] downloading v${latest}…"
curl -fsSL "$url" -o "$tmp/release.tar.gz"
tar -xzf "$tmp/release.tar.gz" -C "$tmp"

src="$tmp"
if [ ! -f "$tmp/dashboard/VERSION" ]; then
  src="$(dirname "$(find "$tmp" -maxdepth 3 -name VERSION -path '*/dashboard/VERSION' | head -n1)")"
  src="$(dirname "$src")"
fi

echo "[update] applying (preserving data/, backups/, plugins/, .env)…"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --exclude=data --exclude=backups --exclude=plugins --exclude=.env \
    "$src/" ./
else
  for d in dashboard compose manifests scripts; do
    [ -d "$src/$d" ] && cp -a "$src/$d" ./ || true
  done
fi
chmod +x ./scripts/install.sh ./scripts/update.sh ./scripts/verify.sh 2>/dev/null || true

dc() {
  if docker compose version >/dev/null 2>&1; then docker compose "$@";
  elif command -v docker-compose >/dev/null 2>&1; then docker-compose "$@";
  else echo "[update] docker compose not found."; exit 1; fi
}

echo "[update] verifying build integrity…"
./scripts/verify.sh

echo "[update] rebuilding image…"
dc -f compose/docker-compose.yml build

echo "[update] restarting…"
dc -f compose/docker-compose.yml up -d

echo "[update] updated to v${latest}."
