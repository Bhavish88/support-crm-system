from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


def utc_now():
    """Returns current UTC timestamp."""
    return datetime.now(timezone.utc)


class Ticket(Base):
    """
    Tickets Table as specified in Datastraw assessment:
    - id (pk)
    - ticket_id (unique, e.g., TKT-001)
    - customer_name (text)
    - customer_email (text)
    - subject (text)
    - description (text)
    - status (Open / In Progress / Closed)
    - created_at (timestamp)
    - updated_at (timestamp)
    """
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(String(20), unique=True, index=True, nullable=False)
    customer_name = Column(String(150), nullable=False, index=True)
    customer_email = Column(String(150), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="Open", nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    # Relationship to notes
    notes = relationship(
        "Note",
        back_populates="ticket",
        cascade="all, delete-orphan",
        order_by="desc(Note.created_at)"
    )


class Note(Base):
    """
    Notes Table as specified in Datastraw assessment:
    - id (pk)
    - ticket_id (fk to tickets.ticket_id)
    - note_text (text)
    - created_at (timestamp)
    """
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(String(20), ForeignKey("tickets.ticket_id", ondelete="CASCADE"), nullable=False, index=True)
    note_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    # Relationship back to ticket
    ticket = relationship("Ticket", back_populates="notes")
