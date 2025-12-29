#!/usr/bin/env bash
set -euo pipefail

# This script is executed inside the Postgres container during first init.
# Environment variables available here are those defined in docker-compose.yml/.env

# Required env vars (already provided via .env)
: "${API_DB_USER:?Missing API_DB_USER}"
: "${API_DB_PASSWORD:?Missing API_DB_PASSWORD}"
: "${API_DB_NAME:?Missing API_DB_NAME}"

# psql runs as the bootstrap superuser
export PGPASSWORD="${POSTGRES_PASSWORD}"

echo "Creating application database and users..."

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<SQL
-- Create the application database if different from POSTGRES_DB
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '${API_DB_NAME}') THEN
    PERFORM dblink_connect('host=localhost user=${POSTGRES_USER} dbname=${POSTGRES_DB}');
    CREATE DATABASE "${API_DB_NAME}";
  END IF;
END
\$\$;

-- Create/alter the api user
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${API_DB_USER}') THEN
    CREATE USER "${API_DB_USER}" WITH ENCRYPTED PASSWORD '${API_DB_PASSWORD}';
  ELSE
    ALTER USER "${APP_DI_USER}" WITH ENCRYPTED PASSWORD '${API_DB_PASSWORD}';
  END IF;
END
\$\$;
SQL

# Grant privileges within the target DB
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${API_DB_NAME}" <<SQL
GRANT ALL PRIVILEGES ON DATABASE "${API_DB_NAME}" TO "${API_DB_USER}";
-- Ensure default privileges on future schema objects (optional; adjust as needed)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${API_DB_USER}";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "${API_DB_USER}";
SQL

echo "Database initialization complete."
