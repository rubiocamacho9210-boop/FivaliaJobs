# FivaliaJobs — Backend

REST API for the FivaliaJobs MVP. Built with NestJS, PostgreSQL, and Prisma.

## Stack

- **Runtime**: Node.js
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (passport-jwt)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

The defaults in `.env.example` match the Docker Compose credentials, so no changes needed for local development.

### 3. One-command local setup (recommended)

```bash
npm run setup:local
```

This command:
- Creates `.env` from `.env.example` if needed
- Starts PostgreSQL with Docker Compose
- Generates Prisma client
- Applies migrations
- Seeds demo data

### 4. Start dev server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Optional DB commands

```bash
npm run db:up
npm run db:down
npm run db:migrate:deploy
npm run db:seed
```

### Health checks

```bash
GET /health
GET /health/db
```

---

## Endpoints

### Auth (public)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |

### Profile

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/profile/me` | JWT | Get my profile |
| PATCH | `/profile` | JWT | Create or update my profile |
| GET | `/profile/:userId` | Public | Get any user's profile |

### Posts

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/posts` | JWT | Create a post |
| GET | `/posts` | Public | List all posts |
| GET | `/posts/:id` | Public | Get post by id |
| GET | `/posts/user/:userId` | Public | Get posts by user |
| PATCH | `/posts/:id/status` | JWT + owner | Update post status |

### Interests

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/interests` | JWT | Express interest in a post |
| GET | `/interests/me` | JWT | Get my sent interests |
| GET | `/interests/post/:postId` | JWT + owner | Get interests on your post |

---

## Request examples

### Register
```json
POST /auth/register
{
  "name": "Ana García",
  "email": "ana@example.com",
  "password": "securepass123",
  "role": "WORKER"
}
```

### Demo users created by seed

- `cliente.demo@fivalia.com` / `Password123!`
- `trabajador.demo@fivalia.com` / `Password123!`

### Login
```json
POST /auth/login
{
  "email": "ana@example.com",
  "password": "securepass123"
}
```

### Create post
```json
POST /posts
Authorization: Bearer <token>
{
  "type": "OFFER",
  "title": "Plomería profesional",
  "description": "Ofrezco servicio de plomería con 10 años de experiencia.",
  "category": "Plomería"
}
```

### Express interest
```json
POST /interests
Authorization: Bearer <token>
{
  "postId": "clxxxxxxxxxxxxxx"
}
```
