# CareerMind API — server

Express + Mongoose + JWT + Multer + Zod, in a layered structure:

```
server/
├── config/         # env loading, DB connection, AI provider config
├── controllers/    # thin request handlers — no business logic
├── models/         # Mongoose schemas
├── routes/         # route wiring: path -> middleware -> controller
├── middleware/      # auth, validation, error handling, file upload
├── services/       # business logic (AI calls, offline fallbacks, email)
├── utils/          # small stateless helpers (JWT, logging, responses)
├── validators/     # Zod schemas, one file per resource
├── uploads/cvs/    # reserved for future disk-backed CV storage (unused today)
├── app.js          # Express app: middleware + routes (no listen/DB)
├── server.js        # boots the app: validates env, connects DB, listens
└── Dockerfile        # production image (see repo root README for deploy instructions)
```

Request flow: `routes/*.routes.js` → `middleware/validate.js` (Zod) → `controllers/*.controller.js`
→ `services/*.service.js` → `models/*.js`. Controllers stay thin; all business logic lives in services.

## Quick start

```bash
cp .env.example .env    # set MONGODB_URI + JWT_SECRET (AI_API_KEY and BREVO_API_KEY are optional)
npm install
npm run seed             # seeds jobs + demo@careermind.ai / demopassword123
npm run dev               # http://localhost:5000
```

## API

Unchanged from before the restructure — all routes and payloads are identical, so the client needs no changes for this refactor alone.

| Method | Route | Notes |
| --- | --- | --- |
| POST | /api/auth/signup, /login, /forgot-password, /reset-password | JWT issued on signup/login |
| GET  | /api/auth/me | Bearer token |
| PUT  | /api/auth/profile, /api/auth/settings | profile + notification prefs |
| POST | /api/cv/analyze | analyze pasted CV text |
| POST | /api/cv/upload | Multer upload (PDF/DOCX/TXT, 5 MB), server-side text extraction |
| GET  | /api/cv/latest, /api/cv/history | saved analyses |
| GET  | /api/jobs | job list |
| POST | /api/jobs/matches | AI match scores + reasons + gaps |
| POST | /api/interview/evaluate | STAR scoring + feedback |
| GET  | /api/interview/history | past practice sessions |
| POST | /api/roadmap, PATCH /api/roadmap/progress | 16-week plan + skill gaps |
| POST | /api/dashboard/stats | charts, insights, notifications |

## AI

Any OpenAI-compatible endpoint (OpenAI, OpenRouter, Groq, Together). Set `AI_BASE_URL`,
`AI_API_KEY`, `AI_MODEL`. Without a key every feature falls back to deterministic local
scoring (`services/fallbacks.js`), so the app is fully usable offline.

## Email

Password-reset and email-verification links are sent via `services/email.service.js` using
[Brevo](https://www.brevo.com)'s transactional email API (`@getbrevo/brevo`). Set
`BREVO_API_KEY` (and optionally `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME`). Without an API
key, the email is logged to the console instead so local development doesn't need a real
provider — see the repo root `README.md` for going live with a verified sender.

## Security

bcrypt password hashing, JWT auth middleware, role guard for admin routes, helmet,
CORS allow-list, tiered rate limiting (120/min globally, 20/15min on auth endpoints),
Zod validation on every mutating route, Multer mime/size limits, hashed single-use
password-reset tokens, no account enumeration on reset, friendly handling of duplicate-key
and cast errors.

## What changed in this restructure

- Flattened `src/` away; `app.js` (Express config) is now separate from `server.js` (bootstrap).
- Business logic moved out of routes into `services/`; routes are now just wiring.
- Zod schemas moved out of routes into `validators/`, applied via `middleware/validate.js`.
- `CvAnalysis` → `CV`, `InterviewPractice` → `Interview` (collection names changed accordingly —
  re-run `npm run seed` / re-create data if you had a local database from before).
- Email is now actually sent (via Brevo), or logged if `BREVO_API_KEY` isn't configured,
  instead of console-only.
- Signup now also issues an email-verification token and sends a verification email;
  `/api/auth/verify-email` and `/api/auth/resend-verification` were added.
- Login/signup/reset/verification endpoints now have their own stricter rate limit.
- Email addresses are normalized (trimmed + lowercased) before every lookup, fixing a case-sensitivity
  gap in duplicate-account checks.
- Duplicate-key Mongo errors now return a clean 409 instead of a raw 500.
