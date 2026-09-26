# 📬 Datastraw Assessment Submission Email Template

Copy and fill in this template when sending your submission email.

---

### Email Details:
- **To:** `ozair.shaikh@datastraw.in`, `aryan.jaiswal@datastraw.in`
- **CC:** `talent@datastraw.in`
- **Subject:** `Datastraw Hiring Assignment Submission: Support CRM System — [Your Full Name]`

---

### Email Body:

Dear Datastraw Hiring Team,

I have completed the Support CRM System hiring assignment according to your specifications. Below are the project links, architectural breakdown, and submission details.

### 🔗 Project Links:
- **Live Deployed Application:** `https://your-deployed-app.up.railway.app`
- **GitHub Repository:** `https://github.com/your-username/Support_CRM_system`
- **Demo Video (3–5 mins):** `https://youtu.be/your-video-link` *(or Loom link)*
- **LinkedIn Profile:** `https://www.linkedin.com/in/your-profile`

---

### 1. Technical Approach & Architectural Decisions:
- **Backend (Python + FastAPI):** Built a high-performance REST API with asynchronous request handling, Pydantic v2 data validation, and automatic OpenAPI / Swagger documentation.
- **Database (SQLite + SQLAlchemy 2.0):** Implemented the exact 2-table schema (`tickets` and `notes`) with cascading relationships and indexes on frequently queried fields (`customer_name`, `customer_email`, `status`, `ticket_id`). Configured dynamic environment switching to PostgreSQL for cloud deployment.
- **Frontend (React 18):** Developed a responsive, modern Single Page Application featuring real-time debounced multi-field search, status filtering, interactive KPI counters, and modal-driven workflows for creating and inspecting tickets.
- **Unified Deployment Architecture:** Served the React frontend directly from FastAPI, allowing the complete full-stack application to run from a single command without multi-container complexity.

### 2. Key Features & Aspects I Am Most Proud Of:
- **Instant Debounced Search:** Users can search seamlessly across customer names, emails, ticket IDs, subjects, and descriptions in real time with client-side debouncing to optimize backend traffic.
- **Interactive Ticket Activity Notes:** Full chronological timeline for collaboration notes on every ticket with instant status updates.
- **Live KPI Dashboard Cards:** Visual metrics displaying counts of Total, Open, In Progress, and Closed tickets that double as quick filters.
- **1-Click Evaluator Seed Data:** A dedicated button to reload 5 realistic support scenarios (billing issues, login errors, webhook mismatches) with pre-populated note histories for instant testing.
- **Comprehensive Automated Testing:** 100% test pass rate with `pytest` covering all 4 core endpoints, filtering, search, and error edge cases.

### 3. Challenges Faced & How I Overcame Them:
- **Challenge:** Managing multi-field search queries across different database dialects (SQLite vs. PostgreSQL).
  - **Solution:** Standardized queries using SQLAlchemy's case-insensitive `ILIKE` pattern with `or_()` clauses, ensuring consistent, fast query behavior across both SQLite and PostgreSQL.
- **Challenge:** Avoiding complex frontend build pipelines and fragile dependency chains during deployment.
  - **Solution:** Built a clean, standard React 18 component structure served directly through FastAPI's static engine, eliminating external build dependencies while maintaining modern React state and JSX development patterns.

### 4. Improvements with Additional Time:
- Implement role-based access control (Admin, Support Agent, Viewer) with JWT authentication.
- Add email notifications (via SendGrid or Resend) when tickets are assigned or updated.
- Introduce file attachments (screenshots / logs) for tickets.
- Add analytics charts for average resolution time and ticket volume trends.

Thank you for reviewing my submission. I look forward to the opportunity to discuss my work and contribute to the team at Datastraw.

Best regards,  
**[Your Full Name]**  
[Your Phone Number]  
[Your Email Address]  
[Your LinkedIn URL]
