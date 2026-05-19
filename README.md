# AdPulse — Real-time E-commerce Intelligence Platform

![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

> A production-grade SaaS platform for Amazon and Shopify sellers to monitor competitor
> pricing in real time, fire intelligent alerts when conditions are met, and track ad
> performance across their entire catalog — all from a single dashboard.

---

## What is AdPulse?

AdPulse mirrors the core product of funded startups like Atom11, Perpetua, and Sellics.
Sellers connect their store and the platform automatically monitors competitor pricing,
tracks inventory signals, analyzes ad spend patterns, and fires intelligent alerts with
recommended actions in real time.

This is not a tutorial project. It is built with the same architectural decisions and
production patterns used in real B2B SaaS products.

---

## Live Demo

> Deployment in progress 

---

## Architecture
<img width="1408" height="768" alt="Gemini_Generated_Image_9op1j39op1j39op1" src="https://github.com/user-attachments/assets/9f22e833-cc34-4b0b-81bd-2f55c00b8907" />


## Build Progress

 Task | Status |
|------|--------|
 Monorepo setup, TypeScript config, Express server, Next.js scaffold | ✓ Done |
 Docker Compose — PostgreSQL 16 + pgvector, Redis 7, Nginx | ✓ Done |
 Prisma setup, full DB schema, first migration | ✓ Done |
 Express config, Redis client, Winston structured logging, error handler | ✓ Done |
 JWT auth system — register, login, /me endpoint, bcrypt hashing | ✓ Done |
 RBAC middleware — ADMIN, ANALYST, VIEWER role hierarchy | ✓ Done |
 API key system with SHA256 hashing, Redis rate limiting | ✓ Done |
 Tenant isolation middleware — all queries scoped to tenantId | ✓ Done |
 Products service — create, list, get by ID, price history | In progress |
 PricePoint service — time series data, competitor tracking | Upcoming |
 BullMQ setup — price scraping job queue, hourly scheduler | Upcoming |
 Mock price scraper worker | Upcoming |
 Competitor price tracking service | Upcoming |
 Integration tests — Jest + Supertest | Upcoming |
 Alerts rules engine, Socket.io real time events | Upcoming |
 Dashboard APIs, reporting, CSV export, Swagger docs | Upcoming |
 Next.js frontend — dashboard, products, alerts, settings | Upcoming |
 AWS EC2 deployment, Nginx SSL, GitHub Actions CI/CD | Upcoming |
 Polish, tests, README, demo video | Upcoming |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 20 + TypeScript 5 | Core backend runtime |
| Framework | Express.js | REST API server |
| Database | PostgreSQL 16 + pgvector | Primary data store + vector search |
| ORM | Prisma 5 | Type-safe DB queries |
| Cache | Redis 7 | Caching, pub/sub, rate limiting |
| Queue | BullMQ | Background job processing |
| WebSockets | Socket.io | Real time dashboard updates |
| Auth | JWT + bcrypt | Authentication |
| Access Control | RBAC middleware | Role-based route protection |
| API Keys | SHA256 hashed keys | Programmatic API access |
| Rate Limiting | Redis sliding window | Per API key request throttling |
| Logging | Winston | Structured JSON logging |
| Docs | Swagger / OpenAPI 3 | Auto-generated API docs |
| Container | Docker + Docker Compose | Full stack containerization |
| Cloud | AWS EC2 + S3 + SQS | Production deployment |
| CI/CD | GitHub Actions | Auto deploy on push to main |
| Proxy | Nginx | Reverse proxy + SSL termination |
| Frontend | Next.js 14 + TypeScript | Full stack React framework |
| UI | Tailwind CSS + shadcn/ui | Component styling |
| Charts | Recharts + Tremor | Data visualizations |
| State | Zustand | Client state management |
| HTTP Client | Axios + React Query | API calls + server state |
| Testing | Jest + Supertest | Unit and integration tests |

---

## Core Features

**Multi-tenant architecture**
Every user belongs to a Tenant (company). All data is scoped to the tenant at the
middleware level. No developer can accidentally leak one customer's data to another.

**JWT Authentication**
Register creates a Tenant and Admin user in a single atomic Prisma transaction.
Passwords hashed with bcrypt at cost factor 12. JWT tokens valid for 7 days.

**Role Based Access Control**
Three roles — ADMIN, ANALYST, VIEWER — with a hierarchy. ADMIN has full access.
ANALYST can create alerts and export reports. VIEWER is read-only. Every route is
protected by role at the middleware level.

**API Key System**
Users can generate programmatic API keys. Raw key shown once at generation and never
stored. Only the SHA256 hash is persisted in the database — the same pattern Stripe uses.

**Redis Rate Limiting**
Every API key request is counted in a Redis sliding window. Configurable per route.
Returns X-RateLimit-Limit and X-RateLimit-Remaining headers on every response.

**Structured Logging**
Winston logger outputs JSON in production and colorized readable logs in development.
Every HTTP request is logged with method, path, status code, response time, and IP.

**Real time Alerts** *(coming Day 15)*
Custom rule builder — define conditions like "price drops below threshold". BullMQ
worker evaluates rules every 15 minutes. Alerts fire via Socket.io WebSocket events,
email, webhook, or Slack.

**Background Jobs** *(coming Day 11)*
BullMQ with Redis persistence. Jobs survive server restarts. Dead letter queue,
retry logic, concurrency control, and job progress tracking built in.

--- 

## Database Schema
Tenant          — company account, root of all data
User            — belongs to Tenant, has Role (ADMIN/ANALYST/VIEWER)
Product         — tracked ASIN, belongs to Tenant
PricePoint      — price snapshot, source (own/competitor), timestamp
Alert           — rule definition (condition JSON), belongs to Tenant + Product
Notification    — fired alert record, read/unread status
ApiKey          — SHA256 hashed key, belongs to User

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create account + tenant | Public |
| POST | /api/auth/login | Get JWT token | Public |
| GET | /api/auth/me | Current user info | JWT |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/products | List products (tenant scoped) | JWT |
| POST | /api/products | Track new product | JWT + ADMIN |
| GET | /api/products/:id | Product detail | JWT |
| GET | /api/products/:id/prices | Price history | JWT |
| GET | /api/products/:id/competitors | Competitor prices | JWT |

### Alerts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/alerts | List alert rules | JWT |
| POST | /api/alerts | Create alert rule | JWT + ANALYST |
| DELETE | /api/alerts/:id | Delete alert | JWT + ADMIN |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/dashboard/summary | KPI cards data | JWT |
| GET | /api/dashboard/timeseries | Chart data | JWT |

### API Keys

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/apikeys | Generate API key | JWT + ADMIN |
| GET | /api/apikeys | List API keys | JWT + ADMIN |
| DELETE | /api/apikeys/:id | Revoke API key | JWT + ADMIN |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git

### Run locally

```bash
git clone https://github.com/VaibhavXBhardwaj/adpulse.git
cd adpulse

cp .env.example .env
# Fill in your values in .env

docker compose up --build
```

Backend: `http://localhost:4000/health`

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | Database name |
| `DATABASE_URL` | Full Prisma connection string |
| `REDIS_URL` | Redis connection URL |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `PORT` | Backend server port |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL |

---

## API Documentation

Swagger UI available after Day 27 at:
http://localhost:4000/api-docs

---

## Common Questions

**Why multi-tenant and not per-user isolation?**
Multi-tenancy is how real B2B SaaS products work. A tenant is a company. Multiple users
belong to one tenant. All data is isolated at the tenantId level enforced by middleware,
not by application code. This means no developer can write a query that accidentally
leaks data across tenants.

**How does the rules engine work?**
Alert conditions are stored as JSON in PostgreSQL. A BullMQ worker runs every 15 minutes,
fetches all active alerts, queries the latest price for each product, and evaluates the
condition. If true, it fires the alert, creates a notification record, and emits a
WebSocket event to the tenant's Socket.io room.

**Why BullMQ over setInterval?**
BullMQ persists jobs in Redis so they survive server restarts. It supports retry logic,
dead letter queues, concurrency control, and job progress tracking. setInterval is
not reliable in production.

**Why pgvector?**
Added to support future semantic search on product titles and descriptions. Shows
the product roadmap was considered from day one, not just the current features.

**How are API keys stored?**
Raw keys are shown once at generation and immediately discarded. Only the SHA256 hash
is persisted in the database. On every request the incoming key is hashed and compared
to stored hashes. This is the same pattern Stripe uses.

(Currently in Production)

## License

MIT © Vaibhav Bhardwaj
