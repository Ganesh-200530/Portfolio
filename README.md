# Portfolio (HTML/CSS/JS + Python + SQLite)

## Stack
- Frontend: vanilla HTML/CSS/JS (coffee-dark aesthetic)
- Backend: Flask + SQLite; SMTP email hook

## Quick start
1) Backend
   - `cd backend`
   - Create venv (optional): `python -m venv .venv && .venv\\Scripts\\activate`
   - Install deps: `pip install -r requirements.txt`
   - Copy env template: `copy .env.example .env` (fill values)
   - Run: `python app.py`

2) Frontend
   - `cd frontend`
   - Serve locally so fetch works (one option): `python -m http.server 5500`
   - Open `http://127.0.0.1:5500` in browser (contact form posts to `http://127.0.0.1:8000/api/contact`)

## Config
- `.env` (backend) fields:
  - `DB_PATH` path to SQLite file (defaults to `contact.db` in backend)
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_TO`, `EMAIL_USE_TLS`
  - If email values are missing, messages are saved to DB and email sending is skipped.

## Personalize content
- Update text/links in `frontend/index.html` (name, role, education, projects, socials, phone).
- Adjust colors/spacing in `frontend/style.css` if you want a different vibe.
- Set `API_BASE` in `frontend/script.js` if you host backend elsewhere.

## Notes
- Messages are stored in SQLite table `messages` (auto-created on start).
- `/health` returns JSON for uptime checks.
