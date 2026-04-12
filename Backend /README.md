# FivaliaJobs — Backend

REST API for the FivaliaJobs MVP. Built with NestJS, Bun, PostgreSQL, and Prisma.

## Stack

- **Runtime**: Bun
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (passport-jwt)

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
```

The defaults in `.env.example` match the Docker Compose credentials, so no changes needed for local development.

### 3. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port `5432`. Data is persisted in a named Docker volume.

### 4. Run database migrations

```bash
bunx prisma migrate dev --name init
```

### 5. Start dev server

```bash
bun run start:dev
```

The API will be available at `http://localhost:3000`.

### Stop the database

```bash
docker compose down
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
