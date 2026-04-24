#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="docker-compose.service-stack.prod.yml"

if [[ $# -ne 1 ]]; then
  echo "Usage: ./rollback.sh <image-tag>"
  echo "Example: ./rollback.sh ghcr.io/m-ksa0/devops-portfolio-lab/devops-service-stack:<commit-sha>"
  exit 1
fi

ROLLBACK_IMAGE="$1"

if [[ ! -f ".env.prod" ]]; then
  echo "Missing .env.prod file."
  exit 1
fi

cp .env.prod .env.prod.backup
sed -i "s|^APP_IMAGE=.*|APP_IMAGE=${ROLLBACK_IMAGE}|" .env.prod

echo "Rolling back to image: ${ROLLBACK_IMAGE}"
docker compose -f "${COMPOSE_FILE}" pull app
docker compose -f "${COMPOSE_FILE}" up -d app

echo "Rollback completed."
docker compose -f "${COMPOSE_FILE}" ps
