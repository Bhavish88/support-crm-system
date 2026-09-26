from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from . import models, schemas


def generate_ticket_id(db: Session) -> str:
    """
    Generates a clean auto-incrementing ticket ID like TKT-001, TKT-002, etc.
    Finds the highest current ticket ID number and increments it.
    """
    last_ticket = db.query(models.Ticket).order_by(desc(models.Ticket.id)).first()
    next_number = (last_ticket.id + 1) if last_ticket else 1
    return f"TKT-{next_number:03d}"


def create_ticket(db: Session, ticket_in: schemas.TicketCreate) -> models.Ticket:
    """Creates a new ticket with auto-generated ID, default 'Open' status, and timestamps."""
    ticket_id = generate_ticket_id(db)
    now = datetime.now(timezone.utc)
    
    db_ticket = models.Ticket(
        ticket_id=ticket_id,
        customer_name=ticket_in.customer_name.strip(),
        customer_email=ticket_in.customer_email.strip().lower(),
        subject=ticket_in.subject.strip(),
        description=ticket_in.description.strip(),
        status="Open",
        created_at=now,
        updated_at=now
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_ticket_by_id(db: Session, ticket_id: str) -> Optional[models.Ticket]:
    """Retrieves a ticket by its unique ticket_id (e.g. TKT-001)."""
    return db.query(models.Ticket).filter(models.Ticket.ticket_id == ticket_id.upper()).first()


def list_tickets(
    db: Session,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[models.Ticket]:
    """
    Retrieves tickets with optional status filtering and multi-field search.
    Search covers: customer_name, customer_email, ticket_id, subject, and description.
    """
    query = db.query(models.Ticket)

    # Filter by Status (Open, In Progress, Closed)
    if status and status.lower() != "all":
        query = query.filter(models.Ticket.status.ilike(status.strip()))

    # Search across names, IDs, emails, subject, descriptions
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.Ticket.ticket_id.ilike(term),
                models.Ticket.customer_name.ilike(term),
                models.Ticket.customer_email.ilike(term),
                models.Ticket.subject.ilike(term),
                models.Ticket.description.ilike(term)
            )
        )

    # Order by newest first
    return query.order_by(desc(models.Ticket.created_at)).all()


def update_ticket(
    db: Session,
    ticket_id: str,
    update_in: schemas.TicketUpdate
) -> Optional[models.Ticket]:
    """
    Updates a ticket's status and optionally appends a note to the notes table.
    """
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None

    now = datetime.now(timezone.utc)

    # Validate and update status if provided
    valid_statuses = ["Open", "In Progress", "Closed"]
    if update_in.status:
        # Match case-insensitively to standard capitalized format
        matched = next((s for s in valid_statuses if s.lower() == update_in.status.strip().lower()), None)
        if matched:
            ticket.status = matched
        else:
            ticket.status = update_in.status.strip()

    # Append note if provided
    if update_in.notes and update_in.notes.strip():
        new_note = models.Note(
            ticket_id=ticket.ticket_id,
            note_text=update_in.notes.strip(),
            created_at=now
        )
        db.add(new_note)

    ticket.updated_at = now
    db.commit()
    db.refresh(ticket)
    return ticket


def add_note_to_ticket(db: Session, ticket_id: str, note_text: str) -> Optional[models.Note]:
    """Appends an individual note to a ticket."""
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None

    now = datetime.now(timezone.utc)
    note = models.Note(
        ticket_id=ticket.ticket_id,
        note_text=note_text.strip(),
        created_at=now
    )
    db.add(note)
    ticket.updated_at = now
    db.commit()
    db.refresh(note)
    return note


def get_stats(db: Session) -> dict:
    """Calculates counts for total, open, in progress, and closed tickets."""
    total = db.query(models.Ticket).count()
    open_count = db.query(models.Ticket).filter(models.Ticket.status == "Open").count()
    in_progress_count = db.query(models.Ticket).filter(models.Ticket.status == "In Progress").count()
    closed_count = db.query(models.Ticket).filter(models.Ticket.status == "Closed").count()

    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress_count,
        "closed": closed_count
    }
