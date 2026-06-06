# Rise & Structure Platform

A full-stack automated guidance system for mid-life growth.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express + SQLite (better-sqlite3)
- **Database**: SQLite (local dev.db)
- **Icons**: Lucide React

## Project Structure
```
platform/
├── backend/            # Express API
│   ├── database/       # SQLite schema and data
│   ├── src/            # API source code
│   └── .env            # Environment variables
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Route pages
    │   └── assets/     # Static assets
    └── tailwind.config.js
```

## Getting Started

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features Implemented
- [x] Project scaffolding (monorepo-style split)
- [x] Database schema (Users, Daily Content, Courses, Progress)
- [x] Basic Auth placeholder (JWT ready)
- [x] Responsive Dashboard layout based on brand guidelines
- [x] Daily Task progress visualization
- [x] Theme configuration (colors, typography)
