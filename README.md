# AdPulse — Real-time E-commerce Intelligence Platform

![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

> Monitor competitor prices, fire intelligent alerts, and track ad performance in real time.
> Built with Node.js, PostgreSQL, Redis, BullMQ, Socket.io, and Next.js 14.

---

## What is AdPulse?

AdPulse is a full stack SaaS platform where Amazon and Shopify sellers connect their store and the platform automatically monitors competitor pricing, tracks inventory signals, analyzes ad spend patterns, and fires intelligent alerts with recommended actions — all in real time.

It mirrors exactly what funded startups like Atom11, Perpetua, and Sellics build in production.

---

## Build Status

| Day | Task | Status |
|-----|------|--------|
| Day 1 | Monorepo setup, TypeScript config, Express server, Next.js scaffold | Done |
| Day 2 | Docker Compose — PostgreSQL 16 + pgvector, Redis 7, Nginx, Backend Dockerfile | Done |
| Day 3 | Prisma setup + full DB schema | In progress |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 20 + TypeScript 5 | Core backend runtime |
| Framework | Express.js | REST API server |
| Database | PostgreSQL 16 + pgvector | Primary data store + vector search |
| ORM | Prisma | Type-safe DB queries |
| Cache | Redis 7 | Caching, pub/sub, rate limiting |
| Queue | BullMQ | Background job processing |
| WebSockets | Socket.io | Real time dashboard updates |
| Auth | JWT + bcrypt | Authentication |
| Access Control | RBAC middleware | Role-based route protection |
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

## Architecture
<img width="1408" height="768" alt="Gemini_Generated_Image_9op1j39op1j39op1" src="https://github.com/user-attachments/assets/664c315b-a82a-48d1-9610-f34569b8744a" />




## Project Structure
adpulse/
├── backend/
│   ├── src/
│   │   ├── config/          # env, db, redis, logger
│   │   ├── controllers/     # route handlers
│   │   ├── middleware/      # auth, rbac, rate limiting
│   │   ├── routes/          # express routers
│   │   ├── services/        # business logic
│   │   ├── jobs/            # BullMQ job processors
│   │   ├── workers/         # background workers
│   │   ├── websocket/       # socket.io handlers
│   │   ├── utils/           # helpers, validators
│   │   └── index.ts         # entry point
│   ├── prisma/
│   │   └── schema.prisma
│   └── Dockerfile
├── frontend/
│   ├── app/                 # Next.js 14 app router
│   ├── components/          # reusable UI components
│   ├── hooks/               # custom React hooks
│   ├── lib/                 # api client, utils
│   └── store/               # Zustand state stores
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md

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

Backend health check:
http://localhost:4000/health

### Run frontend separately

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `adpulse` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `your_secret` |
| `POSTGRES_DB` | Database name | `adpulse_db` |
| `DATABASE_URL` | Full Prisma connection string | `postgresql://...` |
| `REDIS_URL` | Redis connection URL | `redis://redis:6379` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your_jwt_secret` |
| `PORT` | Backend server port | `4000` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `http://localhost:4000` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `ws://localhost:4000` |

---

## API Documentation

Once the backend is running:
http://localhost:4000/api-docs

Swagger UI will be available after Day 27.

## Roadmap

- [x] Monorepo setup + TypeScript config
- [x] Docker Compose — PostgreSQL, Redis, Nginx
- [ ] Prisma schema + migrations
- [ ] Auth system — JWT + bcrypt + RBAC
- [ ] Products + price tracking service
- [ ] BullMQ background jobs
- [ ] Alert rules engine
- [ ] Socket.io real time events
- [ ] Next.js dashboard UI
- [ ] AWS EC2 deployment + GitHub Actions CI/CD

---

## License

MIT © Vaibhav Bhardwaj
