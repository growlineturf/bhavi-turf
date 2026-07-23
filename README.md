# My Portfolio Monorepo

Two deployable Next.js apps share one database-backed CMS layer.

## Apps

- `apps/portfolio` - public portfolio, runs on `http://localhost:3000`
- `apps/admin` - admin CMS, runs on `http://localhost:3001`

## Shared Packages

- `packages/cms` - server-side portfolio/admin data, auth, resume, and contact services
- `packages/database` - Prisma schema, client, and seed
- `packages/validators` - Zod schemas for contact and portfolio data
- `packages/cache` - Upstash Redis helpers with no-op local fallback

## Development

```bash
pnpm install
pnpm db:generate
pnpm dev
```

Run one app at a time:

```bash
pnpm dev:portfolio
pnpm dev:admin
```

## Verification

```bash
pnpm type-check
pnpm lint
pnpm build
```

## Required Environment

Copy `.env.local.example` to `.env.local` and configure:

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_PORTFOLIO_URL`
- `NEXT_PUBLIC_ADMIN_URL`

`BLOB_READ_WRITE_TOKEN` is required for production resume uploads.
