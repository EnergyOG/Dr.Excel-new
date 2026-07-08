<p align="center">
  <img src="Project_1/frontend/dr-excel/public/logo.png" alt="Dr.Excel logo" width="120" />
</p>

<h1 align="center">Dr.Excel</h1>

<p align="center">
  A full-stack web platform for a spreadsheet consultancy — custom Excel dashboards, automation,<br/>
  and business templates — with client accounts, an admin back office, and a service request pipeline.
</p>

---

## Table of Contents

- [About](#about)
- [Services Showcased](#services-showcased)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Option A: Run with Docker Compose](#option-a-run-with-docker-compose-recommended)
  - [Option B: Run Manually](#option-b-run-manually)
  - [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Overview](#api-overview)
- [Caching Strategy](#caching-strategy)
- [Security](#security)
- [License](#license)

---

## About

**Dr.Excel** is the marketing site and client portal for an Excel/spreadsheet consultancy. Visitors can browse the
services on offer, submit a request for a custom build, and — once signed in — track their requests through an
account dashboard. Staff have a separate admin dashboard for managing users and incoming requests.

The repository is a monorepo containing a React single-page frontend and an Express/MongoDB/Redis backend, both
under [`Project_1`](Project_1).

## Services Showcased

The homepage highlights the consultancy's core offerings:

- Custom spreadsheet development
- Automated calculations
- Interactive dashboards & reports (financial dashboards, sales analytics)
- Data cleaning
- Process automation
- Business templates (invoices, budgets, cost estimates, timesheets)
- Excel training & support

## Architecture

```
┌──────────────────┐        HTTPS        ┌───────────────────┐
│   React (Vite)    │ ───────────────────▶ │   Express API      │
│   frontend        │ ◀─────────────────── │   backend          │
└──────────────────┘        JSON          └─────────┬──────────┘
        │                                            │
        │ Clerk (OAuth / hosted auth)                │
        ▼                                            ▼
┌──────────────────┐                        ┌───────────────────┐
│      Clerk        │                        │      MongoDB       │
└──────────────────┘                        └───────────────────┘
                                                       │
                                                       ▼
                                              ┌───────────────────┐
                                              │       Redis         │
                                              │ (cache + rate-limit) │
                                              └───────────────────┘
```

The app supports **two parallel auth paths** into the same user model: Clerk-hosted sign-in (Google/social, email)
and a local email/password flow with JWT access + refresh tokens. See [Authentication](#authentication).

## Tech Stack

| Layer                | Technology |
| --------------------- | ---------- |
| Frontend framework    | React 19 + Vite |
| Routing               | React Router 7 |
| Styling               | Tailwind CSS 4 |
| Frontend auth         | Clerk (`@clerk/clerk-react`) |
| Backend runtime       | Node.js (ESM) |
| Backend framework     | Express 4 |
| Database              | MongoDB (Mongoose) |
| Cache / rate-limit store | Redis |
| Backend auth          | Clerk (`@clerk/express`) + custom JWT (access/refresh tokens), bcrypt password hashing |
| Validation             | express-validator |
| Security middleware    | Helmet, CORS, express-rate-limit + rate-limit-redis |
| Email                  | Nodemailer |
| Logging                | Winston |
| Containerization        | Docker & Docker Compose |

## Project Structure

```
Dr.Excel-new/
└── Project_1/
    ├── docker-compose.yaml       # Orchestrates backend, frontend, MongoDB, Redis
    ├── backend/
    │   ├── server.js             # App entry point
    │   ├── Dockerfile
    │   └── src/
    │       ├── config/           # database.js, redis.js, jwt.js, clerk.js
    │       ├── controllers/      # auth, user, admin, request, webhook
    │       ├── middleware/       # auth, adminGuard, rateLimiter, validator, errorHandler
    │       ├── model/            # Mongoose schemas: user, request
    │       ├── routes/           # /api/auth, /api/users, /api/admin, /api/requests, /api/webhooks
    │       ├── services/         # cache, email, Clerk user-sync
    │       └── utils/            # logger
    └── frontend/
        └── dr-excel/
            ├── src/
            │   ├── homepage/          # Public marketing site
            │   ├── login-page/        # Local + Clerk sign-in
            │   ├── signup-page/       # Local + Clerk sign-up
            │   ├── account-settings/  # Authenticated user settings
            │   ├── admin/             # Admin dashboard + admin login
            │   └── components/        # Shared UI (e.g. loading skeletons)
            ├── public/                # Static assets & service preview images
            └── Dockerfile
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) & Docker Compose (recommended path)
- A [Clerk](https://clerk.com/) application (publishable + secret key) for authentication
- SMTP credentials (e.g. a Gmail app password) if you want outgoing email (verification, password reset) to work

### Option A: Run with Docker Compose (recommended)

From `Project_1`, spin up the backend, frontend, MongoDB, and Redis together:

```bash
cd Project_1
docker compose up --build
```

| Service   | URL                          |
| --------- | ----------------------------- |
| Frontend  | http://localhost:5173         |
| Backend   | http://localhost:3000          |
| MongoDB   | mongodb://localhost:27017      |
| Redis     | redis://localhost:6379          |

> You'll still need to provide the environment variables described below — either via a `.env` file referenced by
> `docker-compose.yaml`, or by exporting them in your shell before running `docker compose up`.

### Option B: Run Manually

**Backend**

```bash
cd Project_1/backend
npm install
npm run dev     # nodemon, auto-restarts on changes
# or
npm start       # production
```

**Frontend** (in a separate terminal)

```bash
cd Project_1/frontend/dr-excel
npm install
npm run dev
```

The frontend dev server runs on Vite's default port (`5173`) and expects the API at `VITE_API_URL`
(defaults to `http://localhost:5000/api` if unset).

### Environment Variables

**Backend** (`Project_1/backend/.env`)

| Variable | Description |
| -------- | ------------ |
| `PORT` | Port the API listens on |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `REDIS_PASSWORD` | Redis password (if required) |
| `CLIENT_URL` / `FRONTEND_URL` | Frontend origin, used for CORS and email links |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `JWT_ACCESS_SECRET` / `JWT_ACCESS_EXPIRY` | Signing secret & TTL for local JWT access tokens |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRY` | Signing secret & TTL for local JWT refresh tokens |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials used by Nodemailer for verification/reset emails |
| `SUPER_ADMIN_EMAIL` | Email granted admin privileges on first sync |

**Frontend** (`Project_1/frontend/dr-excel/.env`)

| Variable | Description |
| -------- | ------------ |
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (same value as the backend's) |

## Authentication

Dr.Excel supports two ways to sign in, unified against a single `User` model:

1. **Clerk** — hosted sign-in/sign-up (including social providers). A webhook
   (`POST /api/webhooks/clerk`) keeps the local `User` collection in sync with Clerk, verified via Svix
   signatures.
2. **Local email/password** — registration, login, email verification, password reset, and short-lived
   JWT access tokens with refresh tokens, all rate-limited and validated server-side.

An `/admin` route and dedicated `/admin/login` page are gated behind a role check (`requireAdmin`) that accepts
either a Clerk session or a local JWT, so staff can manage users and requests from one dashboard regardless of how
they signed in.

## API Overview

Base path: `/api`

| Route prefix | Purpose |
| -------------- | ------- |
| `/api/auth` | Register, login, refresh, logout, profile, password reset, email verification |
| `/api/users` | Clerk-authenticated user profile (`me`) — get, update, delete |
| `/api/requests` | Submit a service request (public); list/view/update/delete (staff-only) |
| `/api/admin` | Dashboard stats, user management (roles, status, force-logout, soft delete), request management |
| `/api/webhooks/clerk` | Clerk webhook receiver (Svix-signature verified) |

See [`Project_1/README.md`](Project_1/README.md) for the full request/response reference for the `/api/requests`
endpoints, including example payloads.

## Caching Strategy

- `GET` requests are served from Redis when available, falling back to MongoDB on a cache miss.
- Cached entries expire after 1 hour by default.
- Any write (create, update, delete) invalidates the relevant cache keys so stale data is never served.
- Redis also backs `express-rate-limit` (via `rate-limit-redis`) so rate limits hold across multiple backend
  instances.

## Security

- Passwords hashed with `bcrypt`; auth tokens are short-lived JWTs with a separate refresh-token flow.
- `helmet` for secure HTTP headers and `cors` scoped to the configured frontend origin.
- `express-validator` on all auth and request-mutation routes.
- Staff-only routes (`/api/requests` listing/mutation, all of `/api/admin`) require authentication **and** an
  admin role — previously-open endpoints were locked down (see inline comments in `request.route.js`).
- Clerk webhook payloads are verified against their Svix signature before being trusted.

## License

ISC (see [`Project_1/backend/package.json`](Project_1/backend/package.json)). Update this section if the project
should carry a different license for the repository as a whole.
