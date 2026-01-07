#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT_DIR/School-management-backend" && npm run dev > /tmp/backend.log 2>&1 &

sleep 3

cd "$ROOT_DIR/School-management-frontend" && pnpm run dev
