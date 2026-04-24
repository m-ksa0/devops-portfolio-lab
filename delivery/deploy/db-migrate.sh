#!/usr/bin/env bash
set -euo pipefail

SQL_FILE="../../projects/devops-service-stack/docker/postgres/init.sql"
DB_CONTAINER="devops_postgres_prod"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "SQL file not found: $SQL_FILE"
  exit 1
fi

echo "Applying database schema from: $SQL_FILE"

docker exec -i "$DB_CONTAINER" \
  psql -U devops_user -d devops_app \
  < "$SQL_FILE"

echo "Database migration completed."
