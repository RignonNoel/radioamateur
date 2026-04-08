#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

COMPOSE_PATH="$SCRIPT_DIR/../docker-compose.yml"
E2E_COMPOSE_PATH="$SCRIPT_DIR/../docker-compose.override-e2e.yml"

cleanup() {
  docker compose -f $COMPOSE_PATH -f $E2E_COMPOSE_PATH down -v || true
}

trap cleanup EXIT

docker compose -f $COMPOSE_PATH -f $E2E_COMPOSE_PATH up -d api website
docker compose -f $COMPOSE_PATH -f $E2E_COMPOSE_PATH up --abort-on-container-exit --exit-code-from cypress cypress