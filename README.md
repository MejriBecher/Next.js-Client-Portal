# Hortensia — Premium Client Portal

Modern client portal built with Next.js 16, featuring a dynamic request dashboard with real-time CRUD, actionable business insights with data visualisation, and a polished dark-mode-first UI.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth v5 (Credentials provider, JWT) |
| Validation | Zod v4 |
| Charts | Recharts |
| UI | Base UI, shadcn/ui, Lucide icons |

## Prerequisites

- **Node.js** 20+
- **pnpm** 9+ — `npm i -g pnpm`
- **Docker Desktop** (for local PostgreSQL) or a remote Postgres instance

## Quick Start (under 5 minutes)

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env

# 4. Generate Prisma client + run migrations
pnpm db:migrate

# 5. Seed demo data
pnpm db:seed

# 6. Start dev server
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001).

## Environment Variables

| Variable | Required | Default |
|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/hortensia` |
| `NEXTAUTH_SECRET` | Yes | `generate-a-random-secret-here` (change for production) |
| `NEXTAUTH_URL` | Yes | `http://localhost:3001` |

## Available Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server (port 3001) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed demo user + sample data |
| `pnpm db:studio` | Open Prisma Studio (GUI data browser) |
| `pnpm db:reset` | Drop DB, re-run migrations, re-seed |

## Project Structure

```
src/
├── app/
│   ├── (public)/page.tsx      # Landing page (SSG)
│   ├── api/
│   │   ├── auth/signup        # User registration endpoint
│   │   ├── insights           # Dashboard aggregation endpoint
│   │   ├── requests           # Request CRUD endpoint
│   │   └── requests/[id]      # Single-request endpoint
│   ├── auth/login             # Sign-in page
│   ├── auth/signup            # Registration page
│   ├── dashboard              # Request list (authenticated)
│   └── dashboard/insights     # Charts & stats (authenticated)
├── components/                # Client and shared components
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── db.ts                  # Prisma client singleton
│   ├── schemas.ts             # Zod validation schemas
│   └── generated/prisma/      # Generated Prisma client
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts                # Database seed script
```

## Architecture

Data fetching lives in **server components**. Client components only call API routes for mutations. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for:

- **A1** — Server vs client component breakdown
- **A2** — Static generation on the landing page
- **A3** — Data fetching strategy
- **A4** — Scaling to 50,000 clients
- **A5** — Security defenses (all server-side)
- **A6** — Docker deployment & pre-flight checklist

## Docker (Production Build)

The project ships with a production `Dockerfile`:

```bash
docker build . -t hortensia-portal
docker run -p 3000:3000 --env-file .env hortensia-portal
```

The image uses Next.js standalone output for minimal size.

## Feature Roadmap

- [x] Dark mode with no flash
- [x] Request CRUD dashboard
- [x] Insights with charts (Recharts)
- [x] Zod validation on all API writes
- [ ] Dynamic services from the database
- [ ] shadcn/ui form components
- [ ] Theme toggle on auth pages
- [ ] E2E tests (Playwright)
