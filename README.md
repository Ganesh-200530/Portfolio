# Portfolio (React + Tailwind + Flask + PostgreSQL)

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Flask + PostgreSQL; SMTP email hook

## Quick start
1) Backend
   - `cd backend`
   - Create venv (optional): `python -m venv .venv && .venv\\Scripts\\activate`
   - Install deps: `pip install -r requirements.txt`
   - Copy env template: `copy .env.example .env` (fill values)
   - Run: `python app.py`

2) Frontend
   - `cd frontend`
   - Install deps: `npm install`
   - Run: `npm run dev`
   - Open `http://localhost:5173` in browser

## Config
- `.env` (backend) fields:
  - `DATABASE_URL` connection string for PostgreSQL
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_TO`, `EMAIL_USE_TLS`
  - If email values are missing, messages are saved to DB and email sending is skipped.

## Personalize content
- Update content in `frontend/src/components` (Education, Projects, etc.).
- Adjust colors in `frontend/src/index.css` (CSS variables).

## Notes
- Messages are stored in PostgreSQL table `messages` (auto-created on start).
- `/health` returns JSON for uptime checks.
