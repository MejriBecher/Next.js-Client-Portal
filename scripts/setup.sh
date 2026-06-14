#!/usr/bin/env bash
set -euo pipefail

echo "Running database migrations..."
pnpm prisma migrate deploy

echo "Seeding demo data..."
pnpm prisma db seed

echo "Done. Run 'pnpm dev' to start."
