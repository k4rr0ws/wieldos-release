#!/usr/bin/env bash
# WieldOS verify v0.0.1
# Recomputes the build/ hash and checks it against manifests/release.json.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f manifests/release.json ]; then
  echo "[verify] manifests/release.json not found — run from the release root."
  exit 1
fi

if [ ! -d dashboard/build ]; then
  echo "[verify] dashboard/build/ not found."
  exit 1
fi

expected="$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('manifests/release.json','utf8')).build_hash)")"

actual="$(node -e "
const { createHash } = require('crypto');
const { readdirSync, statSync, readFileSync } = require('fs');
const { join, relative } = require('path');
function hashDir(dir) {
  const h = createHash('sha256');
  function walk(d) {
    readdirSync(d).sort().forEach(name => {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else { h.update(relative(dir, full)); h.update(readFileSync(full)); }
    });
  }
  walk(dir);
  return h.digest('hex');
}
process.stdout.write(hashDir('dashboard/build'));
")"

echo "[verify] expected: ${expected}"
echo "[verify] actual:   ${actual}"

if [ "$expected" = "$actual" ]; then
  echo "[verify] OK — build matches release manifest."
  exit 0
else
  echo "[verify] MISMATCH — dashboard/build/ has been modified since this release was packaged."
  exit 1
fi
