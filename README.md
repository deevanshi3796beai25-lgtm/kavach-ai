# KAVACH AI

Call / Link / QR / Photo-Video daalo, verdict milta hai: SAFE, SUSPICIOUS ya FAKE, wajah ke saath.

## Chalane ke steps

**Backend** (terminal 1)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```
Docs: http://localhost:8000/api/docs

**Frontend** (terminal 2)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open: http://localhost:5173

**Tests:** `cd backend && python -m pytest -q`

## Pages
Home -> Scan (4 types) -> Result -> History

## API
- `POST /api/v1/scan` (form: `type`, `payload`, optional `file`; header `X-Client-Id`)
- `GET /api/v1/scans`, `GET /api/v1/scans/{id}`, `DELETE /api/v1/scans`

## Detection kya hai
- Link, QR/UPI, call transcript/number: **rule-based** (real checks).
- Audio / photo / video: **DEMO heuristic**, asli AI model nahi. Result me "DEMO mode" likha aata hai.

## Database
Abhi local SQLite (`backend/kavach_dev.db`). Supabase ke liye `supabase/schema.sql` run karein (3 tables + RLS).
