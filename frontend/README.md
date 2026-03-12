# DailyMind Frontend

Next.js 14 frontend for the DailyMind social learning app.

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment

`frontend/.env` is the shared/default API target and can point to your deployed backend.

`frontend/.env.local` is used for local development and overrides `.env` automatically when you run `npm run dev`.

Current local development value:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Included routes

- `/login`
- `/register`
- `/feed`
- `/create`
- `/profile`
