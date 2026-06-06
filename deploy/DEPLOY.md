# Rise & Structure — Deployment Guide

This document provides instructions for deploying the Rise & Structure platform to production environments like Render, Railway, or using Docker.

## Prerequisites

- Node.js 20+
- Stripe Account (for payments)
- A Turso or SQLite database (the app uses SQLite by default)

## Environment Variables

The following environment variables are required:

### Backend (`/backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | The port the server listens on (default: 5000) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `STRIPE_SECRET_KEY` | Your Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Secret for verifying Stripe webhooks |
| `DATABASE_URL` | (Optional) Path to your SQLite DB or Turso URL |

### Frontend (`/frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | The full URL of your deployed backend API (e.g., `https://api.yourdomain.com/api`) |

---

## Deployment Options

### 1. Docker (Recommended)

The project includes Dockerfiles for both frontend and backend in the `deploy/` directory.

**Local Testing:**
From the root directory:
```bash
docker-compose -f deploy/docker-compose.yml up --build
```

**Production:**
Build and push images to a registry (like Docker Hub or GitHub Container Registry), then deploy to any cloud provider that supports Docker.

### 2. Render

**Backend (Web Service):**
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Add all backend env variables.
- **Disk:** Attach a persistent disk to `/app/database` to persist the SQLite file.

**Frontend (Static Site):**
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment:** Set `VITE_API_URL`.

### 3. Railway

Railway can automatically detect the `docker-compose.yml` or the individual Dockerfiles.

- Connect your GitHub repo.
- Railway will create two services: `backend` and `frontend`.
- Add environment variables in the Railway dashboard for each service.
- Ensure the backend service has a Volume attached for `/app/database`.

---

## Post-Deployment Steps

1. **Stripe Webhooks:**
   - Configure your Stripe webhook URL to point to `https://your-backend.com/api/payments/webhook`.
   - Ensure the `STRIPE_WEBHOOK_SECRET` matches the one provided by Stripe.

2. **Content Ingestion:**
   - Once deployed, you may need to run the ingestion script if your database is empty.
   - Run: `node scripts/ingest-content.js` from the backend directory.
