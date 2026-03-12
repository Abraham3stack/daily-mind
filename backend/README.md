# DailyMind Backend

Express and MongoDB API for DailyMind.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `MONGO_URI` and `JWT_SECRET`, then run:

```bash
npm run dev
```

Default backend port: `5001`

For AI fact generation, also set:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /facts`
- `POST /facts`
- `GET /facts/:id`
- `DELETE /facts/:id`
- `POST /facts/:id/like`
- `POST /facts/:id/comment`
- `GET /facts/:id/comments`
- `GET /ai/facts`
