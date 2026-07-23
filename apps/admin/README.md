# Admin App

Database-backed CMS for the public portfolio.

## Development

```bash
pnpm dev:admin
```

Open [http://localhost:3001](http://localhost:3001).

## Routes

- `/login`
- `/`
- `/profile`
- `/projects`
- `/skills`
- `/experience`
- `/certifications`
- `/settings`

## API

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `PUT /api/password`
- `GET /api/portfolio`
- `PUT /api/portfolio`
- `GET /api/portfolio/[section]`
- `PUT /api/portfolio/[section]`
- `GET /api/resume`
- `POST /api/resume`
- `DELETE /api/resume`
