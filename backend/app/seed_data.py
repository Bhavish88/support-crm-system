from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from . import models


SAMPLE_TICKETS = [
    {
        "ticket_id": "TKT-001",
        "customer_name": "Sarah Connor",
        "customer_email": "sarah.connor@cyberdyne.io",
        "subject": "Unable to access enterprise analytics dashboard",
        "description": "After the latest platform maintenance, our team encounters a 403 Forbidden error whenever navigating to /analytics/revenue. Need urgent resolution for monthly reporting.",
        "status": "In Progress",
        "hours_ago": 26,
        "notes": [
            "Customer reached out via live chat priority queue.",
            "Escalated to backend DevOps: verifying RBAC permissions on the analytics gateway."
        ]
    },
    {
        "ticket_id": "TKT-002",
        "customer_name": "Marcus Vance",
        "customer_email": "marcus.v@acmecorp.com",
        "subject": "Billing discrepancy on invoice #INV-2026-08",
        "description": "We were charged for 50 active seats instead of our contracted tier of 35 seats. Please review the attached audit log and issue an adjusted invoice.",
        "status": "Open",
        "hours_ago": 14,
        "notes": [
            "Forwarded billing details to finance team for contract reconciliation."
        ]
    },
    {
        "ticket_id": "TKT-003",
        "customer_name": "Elena Rostova",
        "customer_email": "elena.rostova@fintechglobal.org",
        "subject": "Webhook integration failing for payment events",
        "description": "Our listener endpoint receives signature mismatch errors on checkout.session.completed webhooks. Checked HMAC secret key, but signature verification still fails.",
        "status": "Open",
        "hours_ago": 6,
        "notes": []
    },
    {
        "ticket_id": "TKT-004",
        "customer_name": "David Kim",
        "customer_email": "david.kim@hypergrowth.ai",
        "subject": "Request for SSO (SAML 2.0 / Okta) configuration guide",
        "description": "Our IT security compliance requires migrating from Google OAuth to Okta SAML 2.0 by end of quarter. Requesting the XML metadata file and setup documentation.",
        "status": "Closed",
        "hours_ago": 52,
        "notes": [
            "Provided custom metadata XML file and scheduled onboarding call with IT lead.",
            "Confirmed successful SSO test sign-in with customer. Ticket resolved."
        ]
    },
    {
        "ticket_id": "TKT-005",
        "customer_name": "Priya Sharma",
        "customer_email": "priya.sharma@cloudstack.net",
        "subject": "Rate limiting threshold exceeded during scheduled backup",
        "description": "Our nightly backup job is receiving 429 Too Many Requests errors at 03:00 UTC. Can we get a temporary burst limit increase for off-peak hours?",
        "status": "In Progress",
        "hours_ago": 3,
        "notes": [
            "Checked API metrics: traffic peaked at 240 req/sec between 03:00 - 03:15 UTC.",
            "Configured custom off-peak bucket rate limit policy for client ID."
        ]
    }
]


def seed_database(db: Session, force: bool = False):
    """
    Seeds initial realistic tickets and notes if the database is empty or force=True.
    Returns the count of seeded tickets.
    """
    existing_count = db.query(models.Ticket).count()
    if existing_count > 0 and not force:
        return 0

    if force:
        db.query(models.Note).delete()
        db.query(models.Ticket).delete()
        db.commit()

    now = datetime.now(timezone.utc)
    created_count = 0

    for item in SAMPLE_TICKETS:
        created_time = now - timedelta(hours=item["hours_ago"])
        updated_time = created_time + timedelta(hours=1)

        ticket = models.Ticket(
            ticket_id=item["ticket_id"],
            customer_name=item["customer_name"],
            customer_email=item["customer_email"],
            subject=item["subject"],
            description=item["description"],
            status=item["status"],
            created_at=created_time,
            updated_at=updated_time
        )
        db.add(ticket)
        db.flush()

        for idx, note_text in enumerate(item["notes"]):
            note_time = created_time + timedelta(hours=idx + 1)
            note = models.Note(
                ticket_id=ticket.ticket_id,
                note_text=note_text,
                created_at=note_time
            )
            db.add(note)

        created_count += 1

    db.commit()
    return created_count
