# PROJECT_MAP.md — Hortensia Client Portal
> Generated: 2026-06-12 | Engineer: Becher Mejri | Assessment: Hortensia Agency

---

## [TECH_STACK]

| Layer | Choice | Version | Rationale |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 | Required by brief. App Router = server-first, no Pages Router. |
| Language | TypeScript (strict) | 6.0.3 | Required. `strict: true` in tsconfig. |
| Styling | Tailwind CSS | 4.3.1 | Required. No custom CSS classes except design tokens. |
| UI Primitives | shadcn/ui | 4.11.0 | Required. No hand-rolled inputs, dialogs, or buttons. |
| ORM | Prisma | 7.8.0 | Chosen over Drizzle. Schema-first, cleaner migration story, easier to document for ARCHITECTURE.md A1–A5. Tradeoff: heavier client than Drizzle, but safer for a first Next.js project under deadline. |
| Database | PostgreSQL | via Docker | Required. docker-compose.yml starts local PG. |
| Auth | NextAuth v5 (Auth.js) | 4.24.14 | Chosen over hand-rolled. Handles session tokens, CSRF, cookie rotation. v5 API: use `auth()` from lib/auth.ts everywhere — NOT the v4 `getServerSession()`. |
| Validation | Zod | 4.4.3 | Required. Every write validated before hitting the DB. |
| Charts (stretch) | Recharts | 3.8.1 | Pairs with shadcn, respects CSS vars for dark mode. |
| Package Manager | pnpm | latest stable | Required by brief (`pnpm install && pnpm dev`). |
| Containerization | Docker (multi-stage) | — | Required. compose for dev PG + prod Dockerfile with standalone output. |
| Password hashing | bcryptjs | 3.0.3 | Pure JS, no native bindings — works inside Docker without extra build deps. |
| Logging | Pino | 10.3.1 | Async, non-blocking, JSON structured logs. |

### Explicitly rejected
- Pages Router → forbidden by brief
- Hand-rolled inputs/dialogs → forbidden by brief
- Drizzle → valid alternative, chose Prisma for schema-first clarity
- Redis/caching → out of scope (note in ARCHITECTURE.md A4 as future work)
- Email / file upload / payments / roles → hard out of scope per brief

---

## [SYSTEM_FLOW]

```
Browser
  │
  ├── GET /                          → Public landing (ISR, revalidate 86400s)
  │     └── DB: SELECT services (at build / revalidate)
  │
  ├── GET /auth/login                → Login page (Server Component, no session check)
  ├── POST /api/auth/callback/credentials → NextAuth v5 credentials callback
  │     ├── Zod validate email + password
  │     ├── DB: SELECT user WHERE email
  │     ├── bcrypt.compare(password, hash)
  │     └── Set encrypted session cookie (httpOnly, SameSite=Lax)
  │
  ├── GET /dashboard                 → Protected layout
  │     ├── middleware.ts: auth() check → redirect /auth/login if no session
  │     └── DB: SELECT requests WHERE userId = session.user.id
  │
  ├── GET /dashboard/requests/new   → Create form (Server Component shell)
  │
  ├── Server Action: createRequest
  │     ├── auth() → throw if no session        ← NextAuth v5 call
  │     ├── Zod validate input
  │     ├── DB: INSERT request { userId: session.user.id, ...fields }
  │     └── revalidatePath('/dashboard')
  │
  ├── GET /dashboard/requests/[id]/edit → Edit form (Server Component)
  │     ├── auth() → throw if no session
  │     └── DB: SELECT request WHERE id AND userId = session.user.id  ← ownership
  │
  ├── Server Action: updateRequest
  │     ├── auth() → throw if no session
  │     ├── DB: SELECT WHERE id AND userId = session.user.id          ← ownership BEFORE write
  │     ├── Zod validate
  │     └── DB: UPDATE request
  │
  └── Server Action: deleteRequest
        ├── auth() → throw if no session
        ├── DB: SELECT WHERE id AND userId = session.user.id          ← ownership BEFORE delete
        └── DB: DELETE request

[Stretch] GET /dashboard/insights → Analytics page (Server Component)
      └── DB: GROUP BY aggregation queries — never fetch all rows then reduce in JS
```

---

## [ARCHITECTURE]

### File Structure (Feature-Based / Domain-Driven)

```
hortensia-portal/
├── app/
│   ├── (public)/
│   │   └── page.tsx                  ← Landing page (Server Component, ISR)
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx              ← Login page (Server Component shell)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          ← NextAuth v5 catch-all route handler (single location)
│   ├── dashboard/
│   │   ├── layout.tsx                ← Protected layout (auth() session guard)
│   │   ├── page.tsx                  ← Request list (Server Component)
│   │   ├── requests/
│   │   │   ├── new/
│   │   │   │   └── page.tsx          ← Create form page
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx      ← Edit form page (ownership-checked fetch)
│   │   └── insights/                 ← [STRETCH] Analytics page
│   │       └── page.tsx
│   ├── layout.tsx                    ← Root layout (ThemeProvider, fonts)
│   └── globals.css
│
├── components/
│   ├── ui/                           ← shadcn/ui primitives (auto-generated, never edit manually)
│   ├── login-form.tsx                ← 'use client' — form with client-side validation
│   ├── request-form.tsx              ← 'use client' — create/edit form
│   ├── request-list.tsx              ← 'use client' — list with delete + optimistic update
│   ├── request-status-badge.tsx      ← Server-safe — pure display, no interactivity
│   ├── skeleton-request-list.tsx     ← Loading skeleton matching final layout exactly
│   └── insights-charts.tsx           ← [STRETCH] 'use client' — Recharts wrapper
│
├── lib/
│   ├── db.ts                         ← Prisma client singleton (prevents hot-reload conn leak)
│   ├── auth.ts                       ← NextAuth v5 config — exports `auth`, `handlers`, `signIn`, `signOut`
│   ├── validations/
│   │   └── request.ts                ← Zod: CreateRequestSchema, UpdateRequestSchema
│   └── logger.ts                     ← Pino async logger
│
├── actions/
│   └── request.ts                    ← Server Actions: createRequest, updateRequest, deleteRequest
│
├── prisma/
│   ├── schema.prisma                 ← Data models (User, Request, Service, RequestStatus)
│   └── seed.ts                       ← 2 demo users + 5 requests each
│
├── middleware.ts                     ← Auth guard: all /dashboard/* → redirect if no session
├── docker-compose.yml                ← Dev: PostgreSQL container only
├── Dockerfile                        ← Prod: multi-stage, Next.js standalone output
├── .env.example                      ← DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
├── README.md
└── ARCHITECTURE.md                   ← Answers A1–A6
```

### Security Boundary (all enforced server-side)

| Threat | Defense | File |
|---|---|---|
| Unauthenticated /dashboard access | middleware.ts calls auth() → redirect if no session | `middleware.ts` |
| IDOR: user A reads/writes user B's data | Every action checks `WHERE id = ? AND userId = session.user.id` before any read or write | `actions/request.ts`, `app/dashboard/requests/[id]/edit/page.tsx` |
| Malformed input / mass assignment | Zod parse before every DB write — bad input returns typed error, never crashes | `lib/validations/request.ts` |
| Secrets in client bundle | Only `NEXT_PUBLIC_*` vars reach the browser. `DATABASE_URL`, `NEXTAUTH_SECRET` are server-only | `.env` (never committed) |
| CSRF | NextAuth v5 signs session tokens + SameSite=Lax cookie policy | `lib/auth.ts` |
| Plaintext passwords | bcryptjs cost=12 on signup; compare-only on login; hash never returned to client | `lib/auth.ts` |

### Data Model (Prisma)

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String?
  requests  Request[]
  createdAt DateTime  @default(now())
}

model Request {
  id          String        @id @default(cuid())
  title       String
  description String?
  budget      Float?
  status      RequestStatus @default(PENDING)
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Service {
  id          String  @id @default(cuid())
  name        String
  description String
  order       Int     @default(0)
}

enum RequestStatus {
  PENDING
  IN_PROGRESS
  DONE
}
```

### Server vs Client Component Split (ARCHITECTURE.md A1)

| Component | Type | Reason |
|---|---|---|
| `app/(public)/page.tsx` | Server | Fetches services from DB at build/revalidate; no interactivity |
| `app/auth/login/page.tsx` | Server | Renders shell; login-form.tsx inside is Client |
| `app/dashboard/layout.tsx` | Server | Calls auth() for session guard |
| `app/dashboard/page.tsx` | Server | Fetches user's requests; passes data down to Client list |
| `app/dashboard/requests/[id]/edit/page.tsx` | Server | Ownership-checked DB fetch before rendering |
| `components/login-form.tsx` | Client | Needs useState, form submission handling |
| `components/request-form.tsx` | Client | Needs useState, useForm, optimistic feedback |
| `components/request-list.tsx` | Client | Delete button needs client event handler |
| `components/insights-charts.tsx` | Client | Recharts requires browser DOM |

### Rendering Strategy (ARCHITECTURE.md A2)

- Public landing: ISR `revalidate: 86400` — services change rarely; static speed + live updates without rebuild.
- Dashboard pages: dynamic, no cache — per-user data cannot be shared across sessions.
- Edit page: dynamic + server-side ownership check on every render.
