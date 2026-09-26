# 🎥 Demo Video Guide & Script (3–5 Minutes)

> **Submission Requirement**: A 3–5 minute video showing the application working, a brief code walkthrough, tech choices explanation, and challenges solved. Record via Loom, OBS, or Zoom and upload to YouTube (unlisted) or Loom.

---

## ⏱️ Video Timeline Breakdown

| Segment | Duration | Focus Area |
|---|---|---|
| **1. Introduction & Overview** | ~30 sec | Intro, problem statement, and live app overview. |
| **2. Live Application Demo** | ~1 min 45 sec | Core features: List, Search, Filter, Detail, Update Status, Add Notes, Create Ticket. |
| **3. Architecture & Code Walkthrough** | ~1 min 15 sec | Backend models, CRUD, REST endpoints, and React frontend structure. |
| **4. Tech Choices, Standout Features & Challenges Solved** | ~45 sec | Why FastAPI + SQLite + React, and how we solved search & state sync. |
| **5. Conclusion** | ~15 sec | Closing statement. |

---

## 🎙️ Step-by-Step Script & Actions

### 1. Introduction (0:00 - 0:30)
- **What to show on screen:** Browser tab with the live Support CRM dashboard at `http://127.0.0.1:8000/`.
- **What to say:**
  > *"Hi everyone, my name is [Your Name], and this is my submission for the Datastraw Support CRM System hiring assignment.  
  > The goal was to build a full-stack customer support management tool that enables support teams to create tickets, search and filter records, inspect ticket details, update resolution statuses, and collaborate through internal activity notes.  
  > I built this with Python FastAPI on the backend, SQLite for the database, and an interactive React frontend served in a clean, unified architecture without unnecessary bloat."*

---

### 2. Live Application Demo (0:30 - 2:15)
- **Action 1: Dashboard & KPI Cards**
  - Point out the 4 KPI cards at the top: *All Tickets*, *Open*, *In Progress*, and *Closed*.
  - Show how clicking any card (e.g. *Closed*) instantly filters the tickets below.
  - *Say:* *"At the top, we have live KPI metric cards. They give support leads an instant pulse on team workload and double as quick filters."*

- **Action 2: Real-time Multi-field Search**
  - Type `"analytics"` or `"Connor"` into the search box.
  - Show how it filters down in real-time as you type, matching customer names, emails, IDs, and descriptions.
  - Clear the search using the `✕` button.
  - *Say:* *"The search bar is debounced and searches across customer names, emails, ticket IDs, and issue descriptions with instant feedback."*

- **Action 3: Status Filtering**
  - Click through the filter pills: *All*, *Open*, *In Progress*, *Closed*.
  - *Say:* *"Support agents can switch between status tabs to triage active tickets quickly."*

- **Action 4: Inspect Ticket Details & Activity Notes**
  - Click on any ticket card to open the **Ticket Detail Modal**.
  - Show the customer info panel (name, email, created/updated timestamps).
  - Show the problem description.
  - Point to the **Activity & Internal Notes** timeline.
  - *Say:* *"Clicking a ticket opens the full detail view with metadata and the chronological timeline of internal agent notes."*

- **Action 5: Change Status & Add a Note**
  - Click **In Progress** or **Closed** to change the status. Point out how the status badge updates immediately.
  - In the **Add Note / Comment** field, type:  
    `"Investigated customer issue. Re-sent access link."`  
    Click **Add Note**.
  - Show the new note appearing at the bottom of the timeline with its timestamp.
  - Close the modal and show that the card in the list and the KPI stats updated.
  - *Say:* *"Agents can update ticket statuses with one click and append collaboration notes directly to keep the whole team in sync."*

- **Action 6: Create a New Ticket**
  - Click the **+ New Ticket** button.
  - Fill out the form:
    - Customer Name: `Alice Walker`
    - Customer Email: `alice@techcorp.io`
    - Subject: `API rate limiting question`
    - Description: `Customer requests a 2x rate limit burst for a product launch.`
  - Click **Submit Ticket**.
  - Show the success toast and the new ticket auto-assigned the next sequential ID (`TKT-00X`) at the top of the list.
  - *Say:* *"New tickets are created with client-side and server-side validation and automatically assigned sequential, unique ticket IDs."*

---

### 3. Architecture & Code Walkthrough (2:15 - 3:30)
- **What to show on screen:** Switch to VS Code / IDE.
- **Backend Schema & Models (`backend/app/models.py`)**:
  - Show `Ticket` and `Note` models.
  - *Say:* *"Here in `models.py`, we adhered strictly to the 2-table schema specified in the assessment. `tickets` stores core issue and customer fields, and `notes` stores timestamped collaboration updates linked by foreign key."*
- **CRUD Operations (`backend/app/crud.py`)**:
  - Show `generate_ticket_id` and `list_tickets` with `or_()` multi-field search and status filter.
  - *Say:* *"In `crud.py`, search handles case-insensitive queries across all relevant fields, compatible with both SQLite locally and PostgreSQL in production."*
- **REST Endpoints (`backend/app/main.py`)**:
  - Show the 4 required endpoints (`POST /api/tickets`, `GET /api/tickets`, `GET /api/tickets/{ticket_id}`, `PUT /api/tickets/{ticket_id}`).
  - Show Swagger docs at `http://127.0.0.1:8000/docs`.
  - *Say:* *"All 4 required REST endpoints are implemented with strict Pydantic v2 schemas and automatic OpenAPI documentation."*
- **Frontend Architecture (`frontend/index.html` & `frontend/js/app.jsx`)**:
  - Show `frontend/index.html` and `frontend/js/app.jsx`.
  - *Say:* *"For the frontend, we built a responsive React 18 Single Page Application. It uses clean React hooks for state management and is served directly by FastAPI. This delivers full React power in a clean, unified architecture."*
- **Automated Tests (`backend/test_api.py`)**:
  - Open terminal and run: `python -m pytest backend/test_api.py -v`.
  - Show all 8 tests passing.
  - *Say:* *"We also have a full Pytest suite covering all 4 endpoints, filters, searches, and error handling."*

---

### 4. Tech Choices & Challenges Solved (3:30 - 4:30)
- **Why this stack?**
  > *"I chose FastAPI and SQLite because they provide high performance, minimal setup, and bulletproof reliability for this CRM scope. For the frontend, React was the ideal choice for dynamic UI state updates like instant search and modal interactions."*
- **Challenges Faced & How They Were Solved:**
  > *"1. Real-time Search Performance: Searching across multiple columns on every keystroke can generate excessive requests. I resolved this by introducing a 250ms debouncing hook in React, ensuring queries only trigger when the user pauses typing.*  
  > *2. Zero-Bloat Deployment: By serving the React frontend directly from FastAPI, the entire full-stack application runs from a single standard Python process, making deployment to Railway or Render effortless without multi-service orchestration."*

---

### 5. Conclusion (4:30 - 5:00)
- **What to say:**
  > *"The application is production-ready, fully tested, and ready for deployment. Thank you for your time, and I look forward to discussing this project with the Datastraw team!"*
