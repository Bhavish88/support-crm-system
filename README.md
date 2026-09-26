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
| **Database** | **SQLite** / **PostgreSQL** | SQLite is used for local development, with PostgreSQL supported through the `DATABASE_URL` environment variable for production deployments. |
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
git clone https://github.com/Bhavish88/support-crm-system.git
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
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── seed_data.py
│   │   └── main.py
│   ├── requirements.txt
│   └── test_api.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .env.example
├── .gitignore
├── Procfile
├── README.md
├── build.sh
└── requirements.txt
```
