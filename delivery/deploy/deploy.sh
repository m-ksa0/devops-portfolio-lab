#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="docker-compose.service-stack.prod.yml"

if [[ ! -f ".env.prod" ]]; then
  echo "Missing .env.prod file."
  echo "Copy .env.prod.example to .env.prod and configure it."
  exit 1
fi

set -a
source .env.prod
set +a

if [[ -z "${APP_IMAGE:-}" ]]; then
  echo "APP_IMAGE is not set in .env.prod"
  exit 1
fi

echo "Deploying image: ${APP_IMAGE}"
docker compose -f "${COMPOSE_FILE}" pull app
docker compose -f "${COMPOSE_FILE}" up -d

echo "Deployment completed."
docker compose -f "${COMPOSE_FILE}" ps
