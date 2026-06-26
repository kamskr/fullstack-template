# Backend & Infrastructure Stack

## Overview

We are building a native iOS application in Swift, with Android support planned in the future. The backend architecture should prioritize:

- Long-term maintainability
- Strong type safety
- Minimal vendor lock-in
- Easy onboarding of future developers
- Scalability from MVP to production
- Shared API contract across iOS, Android, and any future web clients
- Local-first backend development

Cloud providers are deployment targets, not development requirements. The backend must remain runnable locally with only Node.js and Docker.

---

# Local Development Infrastructure

Local backend development must not require Render, Cloudflare, Upstash, Sentry, or any other production cloud service.

## Local Runtime Model

```text
Swift iOS App / API Client
        ↓
Local NestJS API on host machine
        ↓
Dockerized PostgreSQL
```

## Local Development Requirements

- NestJS runs directly on the developer machine.
- Backend dependencies run in Docker Compose.
- PostgreSQL runs locally in Docker.
- Drizzle migrations run against local PostgreSQL.
- Better Auth uses the same local PostgreSQL database.
- OpenAPI / Swagger is generated locally from the running NestJS app.
- The iOS app can point to a local backend URL during development.

## Local Parity Requirement

Every backend infrastructure dependency must have one of:

1. A local Docker-based equivalent.
2. A documented local emulator or mock.
3. An adapter boundary that allows the backend to run without the cloud service.

Production infrastructure must not be required for normal feature development, testing, or API contract generation.

## Local vs Production Responsibility

```text
Local development:
- Node.js on host machine
- PostgreSQL in Docker
- Optional future services in Docker

Production / staging:
- Render for NestJS hosting
- Render PostgreSQL for managed PostgreSQL
- Cloudflare R2 for storage if needed
- Sentry for monitoring
```

---

# Technology Stack

## Mobile Applications

### iOS

- Native Swift
- SwiftUI

### Android (Future)

- Native Kotlin

Both clients will communicate with the backend through a shared OpenAPI specification.

---

# Backend

## NestJS

NestJS will be used as the primary backend framework.

### Why?

- Structured and scalable architecture
- Dependency Injection
- Validation and guards
- Excellent testing support
- Large ecosystem and community
- Great OpenAPI integration
- Familiar architecture for future backend hires

---

# API Contract

## OpenAPI (Swagger)

NestJS will generate an OpenAPI specification automatically.

### Why?

- Single source of truth for the API
- Automatically generated documentation
- Strongly typed client generation
- Reduces frontend/backend integration errors
- Enables future Android and web clients with minimal additional work

### Usage

Generated OpenAPI clients will be used by:

- Swift iOS app
- Kotlin Android app (future)
- Any future web clients

---

# Authentication

## Better Auth

Authentication will be handled by Better Auth running inside the NestJS backend.

### Why?

- Modern authentication solution
- Works well with PostgreSQL and Drizzle
- Supports:
  - Email/password
  - Sign in with Apple
  - OAuth providers
  - Sessions

- No vendor lock-in
- Full ownership of user data and authentication flows

### Local Development

Better Auth must work against local Dockerized PostgreSQL.

Email/password authentication should be available locally for development and testing. Sign in with Apple can be configured for real device testing later, but it must not block local backend development.

### Planned Flow

```text
Swift App
    ↓
Sign in with Apple
    ↓
NestJS + Better Auth
    ↓
PostgreSQL
```

---

# Database

## PostgreSQL

Primary relational database.

Local development uses PostgreSQL running in Docker. Staging and production use managed PostgreSQL.

### Why?

- Industry standard
- Reliable and battle-tested
- Excellent ecosystem
- Strong support from Drizzle
- Easy portability between providers

---

# Database Hosting

## Render PostgreSQL

Render PostgreSQL is the managed PostgreSQL provider for staging and production.

Render PostgreSQL is not required for normal local development. Local development uses Dockerized PostgreSQL with the same Drizzle schema and migrations.

### Why?

- Fully managed PostgreSQL
- Automatic backups on paid plans
- Same platform as the backend web service
- Private/internal connection strings from Render services
- Fewer production vendors for the MVP
- Connection pooling
- No infrastructure maintenance
- Remains standard PostgreSQL

### Benefits

If we ever want to migrate away from Render PostgreSQL:

- AWS RDS
- Supabase
- Railway
- Neon
- Self-hosted PostgreSQL

can all be used without changing application code.

---

# ORM

## Drizzle ORM

### Why?

- Type-safe
- SQL-first approach
- Lightweight
- Excellent PostgreSQL support
- Great TypeScript experience
- Easy migrations
- Less abstraction than Prisma

### Responsibilities

- Database schema definitions
- Queries
- Migrations
- Type generation

---

# Backend Hosting

## Render

NestJS will be hosted on Render for staging and production.

Render is a deployment target only. The backend must also run locally as a long-running Node.js service on the developer machine.

### Why?

Render runs the backend as a traditional long-running Node.js service.

Advantages:

- Simple deployment model
- Docker support
- Background workers
- Cron jobs
- Queue support
- No serverless limitations
- Ideal for NestJS applications

### Why not Vercel?

Vercel excels at:

- Next.js
- Frontend applications
- Serverless functions

Our architecture is:

```text
Native Mobile App
        ↓
    NestJS API
        ↓
   PostgreSQL
```

This fits Render's hosting model better than a serverless platform.

---

# Storage (Future)

## Cloudflare R2

Will be used if the application requires:

- User uploads
- Images
- Documents
- Media assets

### Why?

- S3-compatible
- Low cost
- Easy integration
- No egress fees

### Local Development

If object storage is added, local development should use MinIO or another S3-compatible local service. The backend should depend on an object storage adapter rather than Cloudflare-specific APIs.

---

# Monitoring

## Sentry

Used for:

### Mobile

- Crash reporting
- Error tracking
- Performance monitoring

### Backend

- Exception tracking
- Performance monitoring
- Release monitoring

### Local Development

Sentry must be optional locally. Local development should use console logging or a no-op monitoring adapter unless a developer explicitly configures Sentry credentials.

---

# Initial Production Architecture

```text
┌─────────────────┐
│  Swift iOS App  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OpenAPI Client  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     NestJS      │
│   Better Auth   │
│     Swagger     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Drizzle     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Render PostgreSQL│
└─────────────────┘
```

---

# Future Additions

Potential additions as the product grows:

- Cloudflare R2 (file storage)
- Redis / Upstash (caching and queues)
- BullMQ (background jobs)
- Analytics platform
- Feature flags
- Event processing pipeline

These can be added incrementally without major architectural changes.

Any future infrastructure addition must preserve the local parity requirement:

- Redis / Upstash -> local Redis container
- BullMQ -> local Redis-backed workers
- Cloudflare R2 -> MinIO or S3-compatible local storage
- Analytics -> optional or no-op local adapter
- Feature flags -> local config-backed provider

---

# Final Stack

```text
Frontend:
- SwiftUI (iOS)
- Kotlin (future Android)

Backend:
- NestJS
- Better Auth
- OpenAPI / Swagger

Database:
- PostgreSQL
- Render PostgreSQL

ORM:
- Drizzle

Hosting:
- Render

Monitoring:
- Sentry

Storage (future):
- Cloudflare R2
```
