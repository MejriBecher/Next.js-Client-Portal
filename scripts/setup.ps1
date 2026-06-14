Write-Host "Running database migrations..."
pnpm prisma migrate deploy

Write-Host "Seeding demo data..."
pnpm prisma db seed

Write-Host "Done. Run 'pnpm dev' to start."
