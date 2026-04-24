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

echo "Waiting for PostgreSQL to become ready..."

until docker exec devops_postgres_prod pg_isready -U devops_user -d devops_app >/dev/null 2>&1; do
  echo "PostgreSQL is not ready yet..."
  sleep 2
done

echo "PostgreSQL is ready."

./db-migrate.sh

echo "Deployment completed."
docker compose -f "${COMPOSE_FILE}" ps
