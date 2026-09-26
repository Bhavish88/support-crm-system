from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Note Schemas
class NoteCreate(BaseModel):
    note_text: str = Field(..., min_length=1, description="Content of the note")


class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: str
    note_text: str
    created_at: datetime


# Ticket Creation Request
class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=150, description="Customer full name")
    customer_email: EmailStr = Field(..., description="Customer email address")
    subject: str = Field(..., min_length=1, max_length=255, description="Ticket subject / issue summary")
    description: str = Field(..., min_length=1, description="Detailed problem description")


# Ticket Creation Response (as specified in PDF: { ticket_id, created_at })
class TicketCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticket_id: str
    created_at: datetime


# Ticket List Item (as specified in PDF: { ticket_id, customer_name, subject, status, created_at })
class TicketListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    status: str
    created_at: datetime
    updated_at: datetime


# Ticket Detailed View (as specified in PDF: includes all fields + notes list)
class TicketDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteResponse] = []


# Ticket Update Request (as specified in PDF: { status, notes })
class TicketUpdate(BaseModel):
    status: Optional[str] = Field(None, description="Open, In Progress, or Closed")
    notes: Optional[str] = Field(None, description="Optional note text to append to ticket")


# Ticket Update Response (as specified in PDF: { success: true, updated_at })
class TicketUpdateResponse(BaseModel):
    success: bool = True
    ticket_id: str
    status: str
    updated_at: datetime
    message: str = "Ticket updated successfully"


# Dashboard KPI Stats
class StatsResponse(BaseModel):
    total: int
    open: int
    in_progress: int
    closed: int
