import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check():
    """Verify health endpoint responds."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_ticket():
    """Verify POST /api/tickets creates a ticket and returns ticket_id and created_at."""
    payload = {
        "customer_name": "Jordan Lee",
        "customer_email": "jordan.lee@example.com",
        "subject": "Cannot download quarterly invoice",
        "description": "Clicking download PDF gives an empty document error."
    }
    response = client.post("/api/tickets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert set(data.keys()) == {"ticket_id", "created_at"}
    assert data["ticket_id"].startswith("TKT-")


def test_list_tickets():
    """Verify GET /api/tickets returns list of tickets."""
    response = client.get("/api/tickets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Check fields in list item
    first = data[0]
    for field in ["ticket_id", "customer_name", "subject", "status", "created_at"]:
        assert field in first


def test_filter_by_status():
    """Verify GET /api/tickets?status=Open filters correctly."""
    response = client.get("/api/tickets?status=Open")
    assert response.status_code == 200
    data = response.json()
    for item in data:
        assert item["status"] == "Open"


def test_search_functionality():
    """Verify quick search across names, IDs, emails, descriptions."""
    # Search for known seeded customer
    response = client.get("/api/tickets?search=Connor")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any("Sarah Connor" in t["customer_name"] for t in data)


def test_get_ticket_detail():
    """Verify GET /api/tickets/{ticket_id} returns detailed view with notes."""
    # First get list
    list_res = client.get("/api/tickets")
    first_id = list_res.json()[0]["ticket_id"]

    response = client.get(f"/api/tickets/{first_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["ticket_id"] == first_id
    assert "notes" in data
    assert isinstance(data["notes"], list)


def test_update_ticket_status_and_note():
    """Verify PUT /api/tickets/{ticket_id} updates status and appends note."""
    # Create ticket first
    create_res = client.post("/api/tickets", json={
        "customer_name": "Taylor Swift",
        "customer_email": "taylor@swift.org",
        "subject": "Concert portal login issue",
        "description": "Password reset token expired too quickly."
    })
    ticket_id = create_res.json()["ticket_id"]

    # Update ticket status to In Progress and add note
    update_res = client.put(f"/api/tickets/{ticket_id}", json={
        "status": "In Progress",
        "notes": "Sent fresh password reset link via secure SMS."
    })
    assert update_res.status_code == 200
    assert update_res.json()["success"] is True
    assert update_res.json()["status"] == "In Progress"

    # Verify detail shows updated status and newly appended note
    detail_res = client.get(f"/api/tickets/{ticket_id}")
    detail = detail_res.json()
    assert detail["status"] == "In Progress"
    assert len(detail["notes"]) >= 1
    assert any("Sent fresh password reset" in n["note_text"] for n in detail["notes"])


def test_not_found_handling():
    """Verify 404 for invalid ticket ID."""
    response = client.get("/api/tickets/TKT-999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
