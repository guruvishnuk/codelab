# CodeLab: simple coding platform plan

Learn topic by topic: read notes, then solve exercises that run against test cases.

## Stack
| Part | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind | Server-rendered pages, simple routing |
| Backend | FastAPI (Python) | Fast to write, auto docs at /docs |
| Database | SQLite now, PostgreSQL later | Zero setup in dev; one env var to switch |
| ORM | SQLAlchemy 2 + Alembic | Works with both databases; migrations |
| Code runner | Python subprocess (dev only) | Replace with Docker/Judge0 before going public |

## Data model
- **Topic**: slug, title, summary, notes (Markdown), position
- **Exercise**: topic, title, prompt (Markdown), starter code, difficulty, test cases
- **Submission**: exercise, code, passed, created_at (add user_id once login exists)

## Pages
- `/` topic list
- `/topics/[slug]` notes + exercise list
- `/exercises/[id]` prompt, editor, test results

## API
- `GET /api/topics`
- `GET /api/topics/{slug}`
- `GET /api/exercises/{id}`
- `POST /api/exercises/{id}/run` with `{ "code": "..." }`

## Run it
Backend:
```
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
Frontend (new terminal):
```
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Open http://localhost:3000. API docs: http://localhost:8000/docs

## Roadmap
1. **Phase 1 (this repo)**: topics, notes, exercises, run against tests
2. **Phase 2**: Monaco editor, hints, "next exercise" button, more topics
3. **Phase 3**: Auth (accounts), saved progress, submission history
4. **Phase 4**: Safe sandbox (Docker or Judge0), support JavaScript and other languages
5. **Phase 5**: Admin page to add topics/exercises, search, deployment (Vercel + Render/Fly + Postgres)

## Known limits of v1
- Code runs on the API server with only a timeout. Do not expose publicly until Phase 4.
- No login, so no per-user progress yet.
