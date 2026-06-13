# Architecture — Hortensia Client Portal

## A1 — Server vs Client Components

| Component | Type | Reason |
|---|---|---|
| `app/layout.tsx` | Server | Renders HTML shell, fonts, and `<ThemeProvider>` wrapper. No interactivity. |
| `app/(public)/page.tsx` | Server | Static marketing content. No state, effects, or browser APIs. |
| `app/auth/login/page.tsx` | Server | Reads session server-side to redirect if already logged in. Passes no props that need client hooks. |
| `app/auth/signup/page.tsx` | Server | Same pattern as login. |
| `app/dashboard/page.tsx` | Server | Fetches user's requests from Prisma, serializes dates, passes to client component. |
| `app/dashboard/layout.tsx` | Server | Checks session, redirects if unauthenticated. Wraps children in layout shell. |
| `app/dashboard/insights/page.tsx` | Server | Auth gate + Suspense wrapper. |
| `app/dashboard/insights/insights-content.tsx` | Server | Runs raw SQL aggregations in the database. No browser APIs needed. |
| `components/theme-provider.tsx` | Client | Uses `useState`, `useEffect`, `createContext` — browser-only state. |
| `components/theme-toggle.tsx` | Client | Reads `useTheme()` context, handles click events. |
| `components/dashboard-requests.tsx` | Client | All interactivity: form state, optimistic updates, fetch calls. |
| `components/insights-charts.tsx` | Client | Recharts requires the DOM for SVG rendering. Reads CSS vars via `getComputedStyle`. |
| `components/login-form.tsx` | Client | Form state, `useRouter`, `useSearchParams`, `signIn` call. |
| `components/signup-form.tsx` | Client | Form state, fetch call, error display. |

**Rule:** Data fetching happens in server components. Client components receive data as props or call API routes to mutate.

---

## A2 — Rendering: Public Landing Page

The landing page (`/`) uses **static generation (SSG)** — the default in Next.js App Router when no dynamic functions (`cookies()`, `headers()`, `searchParams`) or `revalidate`/`dynamic` exports are used.

**Why SSG:**
- Marketing pages don't need per-request freshness. Content changes are deploy-bound.
- One build-time render serves all users — fastest TTFB, lowest server cost.
- ISR could be added later with `revalidate` if content needs periodic updates without a full deploy.

---

## A3 — Where Data Fetching Happens

| Data | Where | Method |
|---|---|---|
| User's requests (dashboard) | `app/dashboard/page.tsx` (Server) | `db.request.findMany()` |
| Insights aggregations | `app/dashboard/insights/insights-content.tsx` (Server) | Raw SQL via `db.$queryRaw` — group-by and median computed in PostgreSQL |
| Services (landing page) | To be added — server component query | `db.service.findMany()` |
| Create/update/delete (CRUD) | API route handlers (`/api/requests*`) | Prisma mutations authenticated via `auth()` |
| Auth check | `lib/auth.ts` via NextAuth | JWT session stored server-side, validated each request |

**Data flow:** Server components fetch during render (no waterfalls). Client components call API routes for mutations only. This means the initial page load includes all data in the HTML — no client-side loading spinners for primary content.

---

## A4 — Scaling: 50,000 Clients

### What breaks first

1. **Request list query** — `findMany()` with no pagination fetches all rows. At 50K clients with 20 requests each = 1M rows. The page payload balloons and the DB does a full sequential scan.
2. **Insights raw SQL** — `PERCENTILE_CONT` on the full request table without a covering index does a sort on every call. At scale this becomes a multi-second query.
3. **No connection pooling limits** — the `PrismaPg` adapter opens direct connections. Under traffic spikes, PostgreSQL's `max_connections` (default 100) gets exhausted.

### Specific fixes

| Bottleneck | Fix | File |
|---|---|---|
| No pagination on requests | Add cursor-based pagination: `take: 20, cursor, skip` | `app/dashboard/page.tsx` |
| `PERCENTILE_CONT` sorts full table | Add composite index on `(userId, status, createdAt)` | Prisma schema `@@index([userId, status, createdAt])` |
| Connection pool exhaustion | Use PgBouncer in transaction mode between the app and PostgreSQL, or increase `max_connections` | `docker-compose.yml` + connection string |
| Static landing page unaffected | SSG means zero DB load for the public site | — |
| No caching layer | Add a Redis cache (Upstash or Valkey) for insights aggregations with a 5-minute TTL | New module `lib/cache.ts` |

---

## A5 — Security

All defenses are server-side. Client-side checks alone do not count.

| Attack | Defense | Location |
|---|---|---|
| Unauthenticated access to dashboard | `auth()` call at top of every protected page/route; redirect to login | `app/dashboard/layout.tsx:14`, `app/dashboard/insights/page.tsx:8` |
| Unauthenticated API access | `auth()` check returns 401 if no session | `app/api/requests/route.ts:6`, `app/api/requests/[id]/route.ts:9` |
| Cross-user data access (read another user's requests by changing URL id) | Ownership check: `request.userId !== session.user.id` returns 403 | `app/api/requests/[id]/route.ts:22` |
| Cross-user data modification | Same ownership check on PATCH and DELETE | `app/api/requests/[id]/route.ts:46`, `app/api/requests/[id]/route.ts:91` |
| SQL injection | Parameterized queries via Prisma ORM and `$queryRaw` with template literal parameters | All `db.*` calls |
| Password brute force | bcryptjs with cost factor 12 | `app/api/auth/signup/route.ts:34` |
| Session hijacking | JWT signed server-side (NextAuth default); no session data in client JS | `lib/auth.ts` |
| XSS | React's default escaping; `dangerouslySetInnerHTML` not used anywhere | — |
| Secrets in client bundle | No `NEXT_PUBLIC_*` env vars containing secrets; all sensitive logic runs server-side | — |
| Unvalidated input on writes | Zod schemas validate shape + types on every write endpoint | `app/api/requests/route.ts`, `app/api/requests/[id]/route.ts` |

---

## A6 — Deployment

### Build

```dockerfile
# Multi-stage Dockerfile
# 1. Install deps + build
# 2. Run with next start on port 3000
```

`docker build .` produces a standalone Next.js image. No build-time secrets.

### Environment variables

| Variable | Local | Production |
|---|---|---|
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/hortensia` | Managed Postgres (Neon / Supabase / RDS) |
| `AUTH_SECRET` | Random dev secret | Strong random secret via deployment secrets manager |
| `AUTH_URL` | `http://localhost:3000` | Production URL |

`.env` is gitignored. `.env.example` documents all required vars.

### Local vs Production differences

| Concern | Local | Production |
|---|---|---|
| Database | Docker Compose PostgreSQL | Managed PostgreSQL with SSL |
| Connection pooling | Direct connection | PgBouncer or connection pooler |
| Build | `next dev` (dev server) | `next build && next start` |
| Secrets | `.env` file | Deployment env vars (Vercel / Docker secrets) |
| Caching | None | Redis for insights (future) |
| HTTPS | Localhost | TLS termination at reverse proxy |

### Pre-flight checklist

1. `docker build .` passes
2. `docker compose up -d` starts PostgreSQL
3. Fresh clone → `pnpm install && pnpm dev` works in under 5 minutes
4. Seed script creates demo user + sample data
5. Logged-out user cannot reach `/dashboard` or any API route
6. User A cannot read User B's requests
7. Dark mode toggle works with no flash of wrong theme
