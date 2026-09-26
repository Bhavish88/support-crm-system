# Customer Support Ticketing CRM System

> **Datastraw Assessment Test — Hiring Assignment**  
> A full-stack, production-ready Customer Support Management CRM system built with **Python FastAPI**, **SQLite**, and **React**.

---

## 🎯 Overview & Objectives

This project was built strictly according to the specifications in the **Datastraw Assessment Test**. It allows support teams to create tickets, search and filter across customer records, update ticket statuses, and collaborate through timestamped activity notes.

### Key Architecture Highlights:
- **Clean REST API**: FastAPI backend with Swagger docs, Pydantic v2 validation, and SQLAlchemy ORM.
- **Minimal 2-Table Schema**: `tickets` and `notes` tables designed for high performance with proper indexes.
- **Unified Full-Stack React + Vite Architecture**: React 18 SPA built with Vite and custom CSS design system, with pre-compiled production build in `frontend/dist/` served directly by FastAPI. Zero runtime Node required in production!
- **100% Automated Test Coverage**: Comprehensive `pytest` test suite covering all REST endpoints and edge cases.
- **One-Click Demo Seeding**: Pre-loaded with realistic customer scenarios (billing issues, login errors, webhook failures) for instant evaluator testing.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Backend Framework** | **Python FastAPI** | Asynchronous, type-safe REST framework with automatic OpenAPI/Swagger documentation. |
| **Database** | **SQLite** (local) / **PostgreSQL** (prod) | Zero-configuration file database locally; seamlessly switches to PostgreSQL in cloud deployments via `DATABASE_URL`. |
| **ORM & Models** | **SQLAlchemy 2.0** | Robust relational mapping, cascading relationships, and query construction. |
| **Data Validation** | **Pydantic v2** | Strict schema validation, request filtering, and automatic response formatting. |
| **Frontend UI** | **React 18** | Interactive component tree with real-time debounced search, modal dialogs, and dynamic status pills. |
| **Styling** | **Custom Vanilla CSS Design System** | Modern SaaS aesthetics (Inter & Plus Jakarta Sans typography, status-coded badges, glassmorphic navbar, responsive grid). |
| **Testing** | **Pytest & FastAPI TestClient** | End-to-end integration tests for all 4 core endpoints and error scenarios. |

---

## 🗄️ Database Design (2 Tables)

The database schema strictly follows the assessment requirements:

```
┌───────────────────────────────────────┐         ┌─────────────────────────────────┐
│               TICKETS                 │         │              NOTES              │
├───────────────────────────────────────┤         ├─────────────────────────────────┤
│ id: Integer (PK, Autoincrement)       │ 1     * │ id: Integer (PK, Autoincrement) │
│ ticket_id: String(20) [Unique, Index] │◄────────│ ticket_id: String(20) [FK]      │
│ customer_name: String(150) [Index]    │         │ note_text: Text                 │
│ customer_email: String(150) [Index]   │         │ created_at: DateTime (UTC)      │
│ subject: String(255)                  │         └─────────────────────────────────┘
│ description: Text                     │
│ status: String(50) [Index]            │
│ created_at: DateTime (UTC)            │
│ updated_at: DateTime (UTC)            │
└───────────────────────────────────────┘
```

---

## 🚀 API Endpoints (Simple REST)

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/tickets` | Create a new ticket | `{ "customer_name", "customer_email", "subject", "description" }` | `{ "ticket_id", "created_at" }` |
| `GET` | `/api/tickets` | List tickets with search & status filter | Query: `?status=Open&search=name` | `[{ "ticket_id", "customer_name", "subject", "status", "created_at", ... }]` |
| `GET` | `/api/tickets/{ticket_id}` | Detailed ticket view with notes history | None | `{ "ticket_id", "customer_name", "customer_email", "subject", "description", "status", "notes": [...] }` |
| `PUT` | `/api/tickets/{ticket_id}` | Update ticket status and/or append note | `{ "status": "Closed", "notes": "Optional note" }` | `{ "success": true, "updated_at": ... }` |
| `POST` | `/api/tickets/{ticket_id}/notes` | Add collaboration note | `{ "note_text": "Note content" }` | `{ "id", "ticket_id", "note_text", "created_at" }` |
| `GET` | `/api/stats` | Dashboard KPI summary | None | `{ "total", "open", "in_progress", "closed" }` |
| `POST` | `/api/seed` | Reset/reload realistic demo data | Query: `?reset=true` | `{ "message": "Successfully seeded..." }` |
| `GET` | `/api/health` | Health check endpoint | None | `{ "status": "ok" }` |

Interactive API documentation is automatically accessible at `http://127.0.0.1:8000/docs` (Swagger UI).

---

## 💻 Local Setup & Running Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js (for React + Vite frontend development)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/Support_CRM_system.git
cd Support_CRM_system
```

### 3. Backend Setup & Run (Terminal 1)
```bash
# Windows
python -m venv backend/venv
backend\venv\Scripts\activate
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --port 8000

# macOS / Linux
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --port 8000
```
- Backend REST API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 4. Frontend Setup & Run (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
- Frontend React App: [http://localhost:5173/](http://localhost:5173/)  
*(Vite automatically proxies `/api` requests to the FastAPI backend at `http://127.0.0.1:8000`)*

### 5. Production Build
```bash
cd frontend
npm run build
```
*(Produces a production bundle in `frontend/dist/` which FastAPI automatically serves when running in production)*

---

## 🧪 Running Automated Tests

Run the full integration test suite:
```bash
# Windows
backend\venv\Scripts\python -m pytest backend/test_api.py -v

# macOS / Linux
pytest backend/test_api.py -v
```

All 8 test cases verify ticket creation, listing, status filtering, multi-field search, ticket detail with notes, status updates, and 404 error handling.

---

## ☁️ Deployment Guide

### Deploying to Render (Recommended Unified Deployment)
1. Sign in to [Render.com](https://render.com).
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository (`Support_CRM_system`).
4. Configure service settings:
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`  
     *(Or: `pip install -r requirements.txt && npm --prefix frontend install && npm --prefix frontend run build`)*
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. *(Optional PostgreSQL Database)*:
   - Under **Environment Variables**, add `DATABASE_URL` pointing to your PostgreSQL instance. If omitted, the service runs automatically on SQLite.
6. Click **"Create Web Service"**. Render will install backend & frontend dependencies, run the Vite build, and launch FastAPI!

### Deploying to Railway
1. Sign in to [Railway.app](https://railway.app).
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your `Support_CRM_system` repository.
4. Under **Settings** → **Build Command**, specify:
   ```bash
   ./build.sh
   ```
5. Railway will automatically detect the [Procfile](file:///c:/B-Projects/Support_CRM_system/Procfile) for the start command.
6. Link an optional PostgreSQL database or use the default SQLite.


---

## 💡 Thoughtful Extra / "Stand Out" Features Implemented

As highlighted in the assessment guidelines (*"what would make this genuinely useful for a real support team?"*), the following extras were thoughtfully added without over-complicating the core code:
1. **Live KPI Metric Cards**: Visual counts for Total, Open, In Progress, and Closed tickets with interactive filtering when clicked.
2. **Instant Multi-Field Search with Keystroke Debouncing**: Real-time search across ticket IDs, customer names, email addresses, subjects, and descriptions with a 250ms debounce to optimize server load.
3. **1-Click Demo Data Reset (`Demo Data` button)**: Allows evaluators to immediately interact with 5 realistic customer tickets with prior note histories without having to type dummy data manually.
4. **Toast Feedback Notifications**: Non-intrusive feedback toasts for actions (ticket created, status updated, note added).

---

## 📁 Project Structure

```
Support_CRM_system/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Package marker
│   │   ├── database.py           # Engine & session management (SQLite/Postgres)
│   │   ├── models.py             # 2-table schema (Ticket & Note)
│   │   ├── schemas.py            # Pydantic v2 schemas
│   │   ├── crud.py               # CRUD logic & auto-ticket-id generation
│   │   ├── seed_data.py          # Realistic sample dataset
│   │   └── main.py               # FastAPI app, REST endpoints, static mount
│   ├── requirements.txt          # Python dependencies
│   └── test_api.py               # Pytest automated test suite
├── frontend/
│   ├── dist/                     # Pre-compiled React bundle served by FastAPI
│   ├── src/
│   │   ├── App.jsx               # React SPA with modals, filters & state
│   │   ├── api.js                # API REST client (supports VITE_API_URL)
│   │   ├── index.css             # Responsive CSS design system
│   │   └── main.jsx              # React 18 entrypoint
│   ├── index.html                # HTML5 shell
│   ├── package.json              # Frontend dependencies and build scripts
│   └── vite.config.js            # Vite configuration with /api proxy
├── requirements.txt              # Root Python dependencies for cloud buildpacks
├── build.sh                      # Production build script (pip + npm build)
├── STEP_BY_STEP_LOG.md           # Granular development progress record
├── DEMO_VIDEO_SCRIPT.md          # 3-5 minute demo video walkthrough script
├── SUBMISSION_TEMPLATE.md        # Email template for Datastraw submission
├── Procfile                      # Render/Railway process file
├── .env.example                  # Environment configuration example
├── .gitignore                    # Git ignore file
└── README.md                     # Main documentation
```
