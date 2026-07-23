# Progress Log

## Current Architecture

The portfolio is now a Turborepo with two deployable Next.js apps:

- `apps/portfolio` - public portfolio on port `3000`
- `apps/admin` - CMS/admin app on port `3001`

Shared server behavior lives in `packages/cms`, backed by:

- `packages/database` for Prisma/Postgres
- `packages/cache` for Redis-backed cache helpers
- `packages/validators` for Zod validation

## Implemented

- Split public portfolio and admin into separate apps.
- Removed runtime dependence on `public/data/portfolio.json`.
- Added database-backed portfolio read/update services.
- Added DB-backed admin password storage and signed session cookies.
- Added contact form API persistence through Prisma.
- Added Blob-backed resume upload/delete flow.
- Updated workspace scripts for per-app dev/build commands.

## Verification

- `pnpm type-check`
- `pnpm lint`
- `pnpm build`
