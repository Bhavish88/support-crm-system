from typing import List, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from . import models, schemas, crud, seed_data

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan handler: Ensures tables exist and seeds sample data on first launch if database is empty."""
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        seed_data.seed_database(db, force=False)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Customer Support Ticketing CRM API",
    description="Datastraw Assessment Test - REST API for Support Ticketing CRM",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration to allow local and deployed React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.get("/", tags=["Frontend"])
def serve_frontend():
    if os.path.exists(DIST_DIR):
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return {
        "service": "Customer Support Ticketing CRM API",
        "status": "operational",
        "docs_url": "/docs",
        "frontend_dev": "Run 'npm run dev' in frontend directory (http://localhost:5173)"
    }


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


# -------------------------------------------------------------
# 1. CREATE TICKET
# POST /api/tickets — Body: { customer_name, customer_email, subject, description }
# Returns: { ticket_id, created_at }
# -------------------------------------------------------------
@app.post(
    "/api/tickets",
    response_model=schemas.TicketCreateResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Tickets"]
)
def create_ticket(
    ticket_in: schemas.TicketCreate,
    db: Session = Depends(get_db)
):
    """
    Creates a new support ticket with customer details, issue subject, and description.
    Auto-generates sequential ticket ID (e.g. TKT-001) and timestamp.
    """
    ticket = crud.create_ticket(db, ticket_in)
    return {
        "ticket_id": ticket.ticket_id,
        "created_at": ticket.created_at
    }


# -------------------------------------------------------------
# 2. LIST ALL TICKETS (WITH SEARCH & FILTER)
# GET /api/tickets — Query params: ?status=Open&search=customer_name (Optional)
# Returns: [{ ticket_id, customer_name, subject, status, created_at }]
# -------------------------------------------------------------
@app.get(
    "/api/tickets",
    response_model=List[schemas.TicketListItem],
    tags=["Tickets"]
)
def list_tickets(
    status: Optional[str] = Query(None, description="Filter by: Open, In Progress, Closed, or All"),
    search: Optional[str] = Query(None, description="Search across ticket ID, name, email, subject, description"),
    db: Session = Depends(get_db)
):
    """
    Lists support tickets with optional status filtering and real-time multi-field search.
    """
    return crud.list_tickets(db, status=status, search=search)


# -------------------------------------------------------------
# 3. VIEW TICKET DETAILS
# GET /api/tickets/{ticket_id}
# Returns: { ticket_id, customer_name, customer_email, subject, description, status, notes }
# -------------------------------------------------------------
@app.get(
    "/api/tickets/{ticket_id}",
    response_model=schemas.TicketDetailResponse,
    tags=["Tickets"]
)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieves full details of a specific ticket including its note history.
    """
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found"
        )
    return ticket


# -------------------------------------------------------------
# 4. UPDATE TICKET (STATUS & ADD NOTES)
# PUT /api/tickets/{ticket_id} — Body: { status, notes }
# Returns: { success: true, updated_at }
# -------------------------------------------------------------
@app.put(
    "/api/tickets/{ticket_id}",
    response_model=schemas.TicketUpdateResponse,
    tags=["Tickets"]
)
def update_ticket(
    ticket_id: str,
    update_in: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):
    """
    Updates ticket status (Open / In Progress / Closed) and optionally appends an internal note.
    """
    updated_ticket = crud.update_ticket(db, ticket_id, update_in)
    if not updated_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found"
        )
    return {
        "success": True,
        "ticket_id": updated_ticket.ticket_id,
        "status": updated_ticket.status,
        "updated_at": updated_ticket.updated_at,
        "message": "Ticket updated successfully"
    }


# -------------------------------------------------------------
# 5. ADD NOTE TO TICKET
# POST /api/tickets/{ticket_id}/notes — Body: { note_text }
# -------------------------------------------------------------
@app.post(
    "/api/tickets/{ticket_id}/notes",
    response_model=schemas.NoteResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Notes"]
)
def add_note(
    ticket_id: str,
    note_in: schemas.NoteCreate,
    db: Session = Depends(get_db)
):
    """
    Adds a new collaboration note / comment to a ticket.
    """
    note = crud.add_note_to_ticket(db, ticket_id, note_in.note_text)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket '{ticket_id}' not found"
        )
    return note


# -------------------------------------------------------------
# 6. DASHBOARD STATS
# GET /api/stats
# -------------------------------------------------------------
@app.get(
    "/api/stats",
    response_model=schemas.StatsResponse,
    tags=["Metrics"]
)
def get_stats(db: Session = Depends(get_db)):
    """
    Returns summary counts (Total, Open, In Progress, Closed).
    """
    return crud.get_stats(db)


# -------------------------------------------------------------
# 7. SEED DATA REFRESH (FOR DEMO/TESTING)
# POST /api/seed
# -------------------------------------------------------------
@app.post("/api/seed", tags=["Utility"])
def seed_demo_data(
    reset: bool = Query(False, description="Set True to reset database to default demo dataset"),
    db: Session = Depends(get_db)
):
    """
    Seeds initial realistic tickets for reviewers and testing.
    """
    count = seed_data.seed_database(db, force=reset)
    return {"message": f"Successfully seeded {count} tickets into database"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
