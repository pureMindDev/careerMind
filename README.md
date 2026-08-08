# CareerMind AI — MERN Stack

Full-stack AI career platform. **M**ongoDB + **E**xpress + **R**eact + **N**ode.

```
careermind-mern/
  client/           React 19 + Vite + Tailwind + react-router-dom + Context API
  server/           Express + Mongoose + JWT + Multer + Zod (layered: controllers/services/routes/...)
  docker-compose.yml  local full-stack (mongo + api + client) in containers
```

## Quick start (without Docker)

```bash
# 1. backend
cd server
cp .env.example .env        # set MONGODB_URI + JWT_SECRET (AI_API_KEY, BREVO_API_KEY optional)
npm install
npm run seed                # seeds jobs + demo@careermind.ai / demopassword123
npm run dev                 # http://localhost:5000

# 2. frontend (new terminal)
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

## Quick start (Docker)

```bash
cp server/.env.example .env   # only used for local overrides referenced in docker-compose.yml
docker compose up --build
# client:  http://localhost:8080
# server:  http://localhost:5000
```

MongoDB runs in its own container with a persistent volume — no local Mongo install needed.

## API

| Method | Route | Notes |
| --- | --- | --- |
| POST | /api/auth/signup, /login | JWT issued; signup also sends a verification email |
| POST | /api/auth/forgot-password, /reset-password | password reset via emailed token |
| POST | /api/auth/verify-email, /resend-verification | email verification via emailed token |
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
| GET  | /api/health | liveness check for load balancers / container platforms |

## AI

Any OpenAI-compatible endpoint (OpenAI, OpenRouter, Groq, Together). Set `AI_BASE_URL`,
`AI_API_KEY`, `AI_MODEL`. Without a key every feature falls back to deterministic local
scoring, so the app is fully usable offline.

## Email (Brevo)

Password-reset and email-verification links are sent via [Brevo](https://www.brevo.com)'s
transactional email API (`@getbrevo/brevo`). Set `BREVO_API_KEY` (and optionally
`BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME`). Without an API key, emails are logged to the
console instead — local dev needs no Brevo account.

To go live: create a free Brevo account → Settings → API Keys → generate a key → verify
your sender email/domain in Brevo (required before it will deliver) → set `BREVO_API_KEY`
and `BREVO_SENDER_EMAIL` in the server's environment.

## Security

bcrypt password hashing, JWT auth middleware, role guard for admin routes, helmet,
CORS allow-list, tiered rate limiting (120/min globally, 20/15min on auth endpoints), Zod
validation, Multer mime/size limits, hashed single-use password-reset and email-verification
tokens, no account enumeration on reset/resend, friendly handling of duplicate-key errors.

## Deployment

The app is two independently deployable pieces: a stateless Express API and a static React
build. Either deploy them as containers (Dockerfiles are included for both) or use each
platform's native Node/static-site support — nothing here is Docker-only.

### 1. Database

Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier is enough to start). Create a
cluster, a database user, and allow-list your server's egress IP (or `0.0.0.0/0` if your
platform uses dynamic IPs). Copy the connection string into `MONGODB_URI`.

### 2. Server

Any platform that runs a long-lived Node process or a Docker image works: Render, Railway,
Fly.io, a VPS, etc.

- **Build/start:** `npm install` (or `npm ci`) then `npm start` — or build `server/Dockerfile`.
- **Required env vars:** `MONGODB_URI`, `JWT_SECRET` (long random string — the process refuses
  to boot without these; see `config/env.js`).
- **Recommended:** `NODE_ENV=production` (enables `trust proxy`, so rate limiting sees the
  real client IP behind the platform's load balancer), `CLIENT_ORIGIN` set to your deployed
  frontend's exact origin (comma-separate multiple origins if needed), `BREVO_API_KEY` +
  `BREVO_SENDER_EMAIL` so reset/verification emails actually send, `AI_API_KEY` if you want
  live AI scoring instead of the offline fallback.
- **Health check:** point your platform's health check at `GET /api/health`.
- The server already handles `SIGTERM` gracefully (finishes in-flight requests before exiting),
  which matters for zero-downtime deploys on most container platforms.
- After first deploy, run `npm run seed` once (via the platform's shell/one-off job feature)
  if you want the demo jobs + demo account.

### 3. Client

Static build — deploy it anywhere that serves static files.

- **Vercel / Netlify (recommended, no Docker needed):** two ways to point the project at the
  client — either works:
  - Set the project's **Root Directory** to `client/` (build command `npm run build`, output
    directory `dist` — Vercel/Netlify usually auto-detect these for Vite projects), **or**
  - Leave the Root Directory as the repo root and let the root `vercel.json` handle it (build
    command `npm run build`, output directory `client/dist`) — this is what `vercel.json` is
    for. Don't mix the two: if Root Directory is set to `client/`, Vercel won't see the root
    `vercel.json` at all, since it only looks inside the configured root.
  - Either way, set the env var `VITE_API_URL` to your deployed server's URL.
- **Docker/nginx:** build `client/Dockerfile` with
  `docker build --build-arg VITE_API_URL=https://your-api.example.com -t careermind-client .`
  — Vite inlines `VITE_*` vars at build time, so this must be a **build** arg, not a runtime
  env var. The image serves the build via nginx with SPA fallback routing (`nginx.conf`).

### 4. CORS

The server only accepts requests from the origin(s) in `CLIENT_ORIGIN`. Update it to your
real frontend URL before going live, or auth cookies/requests from the browser will be
blocked.

### Post-deploy checklist

- [ ] `MONGODB_URI` points at Atlas (or your production Mongo), not localhost
- [ ] `JWT_SECRET` is a long random value, different from any value used in dev
- [ ] `CLIENT_ORIGIN` matches the deployed frontend's exact origin
- [ ] `BREVO_API_KEY` + a verified sender are set, so signup/reset emails deliver
- [ ] `VITE_API_URL` (client build) points at the deployed server, not localhost
- [ ] `NODE_ENV=production` is set on the server
