# Portfolio App

Public portfolio app for the My Portfolio monorepo.

## Development

```bash
pnpm dev:portfolio
```

Open [http://localhost:3000](http://localhost:3000).

## Data

The app reads portfolio content through `@portfolio/cms`, backed by Prisma/Postgres.
Admin edits from `apps/admin` invalidate shared cache and update this app's live content.

## Routes

- `/` - public portfolio
- `/api/contact` - validated contact submissions

## Checks

```bash
pnpm build:portfolio
```
