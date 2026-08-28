# PF Saathi — Check before you claim

PF Saathi is an independent, browser-based PF claim readiness prototype for Indian citizens. It helps people spot common preparation issues before filing, explains what to review, and offers a re-check journey. It is **not** an EPFO or Government of India service.

## What it does

- A seven-step, mobile-first readiness check with no login
- Deterministic, explainable checks for name consistency, KYC, bank KYC, Date of Exit, and multiple-UAN awareness
- A transparent 0–100 readiness score based only on user-provided answers
- Fictional demo flow: Rahul K Kumar starts at 70/100, fixes a name difference and Date of Exit, then reaches 100/100
- Fix guides, employer message generator, English/Hindi/Telugu UI architecture, and a cautious assistant

## Privacy and limitations

Never enter Aadhaar or PAN numbers, UAN, OTPs, passwords, account numbers, or government credentials. The frontend retains answers only in browser session storage; the API does not persist them. The prototype uses synthetic data and does not access EPFO systems, government databases, or citizen accounts. It cannot guarantee claim approval.

## Architecture

`Next.js frontend → FastAPI REST API → deterministic rules + structured guidance → optional OpenAI explanations`

The rules engine alone decides checks and scores. OpenAI is only used to make cautious plain-language explanations and communication help; without a key, a safe local fallback responds instead.

## Run locally

Frontend (from this directory):

```bash
npm install
npm run dev
```

Backend (in a second terminal):

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://localhost:3000`; API documentation is available at `http://localhost:8000/docs`.

## Environment

Copy `.env.example` values into the frontend deployment environment and the backend service environment as appropriate:

- `NEXT_PUBLIC_API_URL` — public FastAPI API URL, e.g. `https://api.example.com`
- `FRONTEND_ORIGIN` — allowed frontend origin for API CORS
- `OPENAI_API_KEY` — optional; enables OpenAI responses
- `OPENAI_MODEL` — optional model override (defaults to `gpt-4o-mini`)

## Deployment

Deploy the Next.js project to Vercel and set `NEXT_PUBLIC_API_URL` to the deployed FastAPI origin. Deploy `backend/` to Render, Railway, or another FastAPI host using `uvicorn main:app --host 0.0.0.0 --port $PORT`; set `FRONTEND_ORIGIN` to the Vercel URL. Do not put `OPENAI_API_KEY` in frontend environment variables.

## Safe future scale

This MVP intentionally uses user-provided answers, deterministic rules, and synthetic records. A production public-service implementation would require government-approved, consent-based integrations, secure identity verification, data minimization, audit logs, clear retention controls, and independent security review. None of those integrations are implemented here.
# PF-Saathi-prototype
# PF-Saathi-prototype
# PF-Saathi-prototype
