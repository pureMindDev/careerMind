# CareerMind AI — MERN Stack

Full-stack AI career platform. **M**ongoDB + **E**xpress + **R**eact + **N**ode.

```
careermind-mern/
  client/   React 19 + Vite + Tailwind + react-router-dom + Context API
  server/   Express + Mongoose + JWT + Multer + Zod
```

## Quick start

```bash
# 1. backend
cd server
cp .env.example .env        # set MONGODB_URI + JWT_SECRET (AI_API_KEY optional)
npm install
npm run seed                # seeds jobs + demo@careermind.ai / demopassword123
npm run dev                 # http://localhost:5000

# 2. frontend (new terminal)
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

## API

| Method | Route | Notes |
| --- | --- | --- |
| POST | /api/auth/signup, /login, /forgot-password, /reset-password | JWT issued on signup/login |
| GET  | /api/auth/me | Bearer token |
| PUT  | /api/auth/profile, /api/auth/settings | profile + notification prefs |
| POST | /api/cv/analyze | analyze pasted CV text |
| POST | /api/cv/upload | **Multer** upload (PDF/DOCX/TXT, 5 MB), server-side text extraction |
| GET  | /api/cv/latest, /api/cv/history | saved analyses |
| GET  | /api/jobs | job list |
| POST | /api/jobs/matches | AI match scores + reasons + gaps |
| POST | /api/interview/evaluate | STAR scoring + feedback |
| POST | /api/roadmap, PATCH /api/roadmap/progress | 16-week plan + skill gaps |
| POST | /api/dashboard/stats | charts, insights, notifications |

## AI

Any OpenAI-compatible endpoint (OpenAI, OpenRouter, Groq, Together). Set `AI_BASE_URL`,
`AI_API_KEY`, `AI_MODEL`. Without a key every feature falls back to deterministic local
scoring, so the app is fully usable offline.

## Security

bcrypt password hashing, JWT auth middleware, role guard for admin routes, helmet,
CORS allow-list, rate limiting, Zod validation, Multer mime/size limits, hashed
single-use password-reset tokens, no account enumeration on reset.
