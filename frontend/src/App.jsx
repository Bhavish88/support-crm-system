import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from './api';

/**
 * Utility: Format ISO timestamp into clean readable date/time
 */
function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/**
 * Utility: Generate consistent color for avatar initials
 */
function getAvatarColor(name = "") {
  const colors = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase().replace(" ", "-");
  return (
    <span className={`badge-status ${normalized}`}>
      {status}
    </span>
  );
}

/**
 * Top Navigation Component
 */
function Navbar({ onNewTicket, onResetData, isResetting }) {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div>
            <div className="brand-title">
              SupportCRM
              <span className="brand-badge">Datastraw</span>
            </div>
          </div>
        </div>

        <div className="nav-actions">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={onResetData}
            disabled={isResetting}
            title="Reset database to realistic sample tickets for testing"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            {isResetting ? "Resetting..." : "Demo Data"}
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onNewTicket}
            id="btn-create-ticket"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Ticket
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * KPI Metric Stats Overview Cards
 */
function StatsOverview({ stats, currentStatus, onSelectStatus }) {
  const cards = [
    { label: "All Tickets", value: stats.total, status: "All", iconClass: "stat-icon-total", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    )},
    { label: "Open", value: stats.open, status: "Open", iconClass: "stat-icon-open", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )},
    { label: "In Progress", value: stats.in_progress, status: "In Progress", iconClass: "stat-icon-progress", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
    )},
    { label: "Closed", value: stats.closed, status: "Closed", iconClass: "stat-icon-closed", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )}
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div 
          key={c.status}
          className={`stat-card ${currentStatus === c.status ? "active" : ""}`}
          onClick={() => onSelectStatus(c.status)}
        >
          <div className="stat-info">
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
          <div className={`stat-icon-wrap ${c.iconClass}`}>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Search Bar & Status Filter Bar
 */
function SearchFilterBar({ searchQuery, onSearchChange, statusFilter, onStatusChange, onClearSearch }) {
  const statuses = ["All", "Open", "In Progress", "Closed"];

  return (
    <div className="toolbar-card">
      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search by ID, customer name, email, subject..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-input"
        />
        {searchQuery && (
          <button className="search-clear" onClick={onClearSearch} title="Clear search">
            ✕
          </button>
        )}
      </div>

      <div className="filter-tabs">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            className={`filter-tab ${statusFilter === s ? "active" : ""}`}
            onClick={() => onStatusChange(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Ticket Card Component
 */
function TicketCard({ ticket, onClick }) {
  const initials = (ticket.customer_name || "?")
    .split(" ")
    .map(p => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ticket-card" onClick={() => onClick(ticket.ticket_id)}>
      <div className="ticket-card-header">
        <span className="ticket-id-tag">{ticket.ticket_id}</span>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="ticket-subject">{ticket.subject}</div>

      <div className="ticket-card-footer">
        <div className="customer-info-inline">
          <div 
            className="avatar-mini" 
            style={{ backgroundColor: getAvatarColor(ticket.customer_name) }}
          >
            {initials}
          </div>
          <div>
            <strong>{ticket.customer_name}</strong>
            <span style={{ color: "var(--text-subtle)", marginLeft: "6px" }}>
              ({ticket.customer_email})
            </span>
          </div>
        </div>

        <div className="ticket-time">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {formatDate(ticket.created_at)}
        </div>
      </div>
    </div>
  );
}

/**
 * Ticket List & Empty State Container
 */
function TicketList({ tickets, isLoading, onTicketClick, onResetSearch }) {
  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <svg className="spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
        <div className="empty-title">Loading tickets...</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div className="empty-title">No matching tickets found</div>
        <div className="empty-subtitle">
          Try adjusting your search query or status filter to find what you are looking for.
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onResetSearch}>
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="ticket-list-header">
        <div className="ticket-count-text">
          Showing <strong>{tickets.length}</strong> {tickets.length === 1 ? "ticket" : "tickets"}
        </div>
      </div>

      <div className="ticket-grid">
        {tickets.map((t) => (
          <TicketCard key={t.ticket_id} ticket={t} onClick={onTicketClick} />
        ))}
      </div>
    </div>
  );
}

/**
 * Create Ticket Modal Component
 */
function CreateTicketModal({ isOpen, onClose, onSuccess, showToast }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name.trim() || !formData.customer_email.trim() || !formData.subject.trim() || !formData.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await api.createTicket(formData);
      showToast(`Ticket ${data.ticket_id} created successfully!`, "success");
      onSuccess();
      onClose();
      setFormData({ customer_name: "", customer_email: "", subject: "", description: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Support Ticket</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: "0.75rem", background: "#fef2f2", color: "#b91c1c", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                name="customer_name"
                className="form-input"
                placeholder="e.g. Jane Doe"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer Email *</label>
              <input
                type="email"
                name="customer_email"
                className="form-input"
                placeholder="e.g. jane.doe@example.com"
                value={formData.customer_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Issue Summary *</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="e.g. Cannot access billing statements"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Problem Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                rows="4"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Ticket Detail & Collaboration Notes Modal
 */
function TicketDetailModal({ ticketId, onClose, onTicketUpdated, showToast }) {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusVal, setStatusVal] = useState("Open");
  const [noteText, setNoteText] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Load ticket details
  const fetchDetail = useCallback(async () => {
    if (!ticketId) return;
    try {
      setIsLoading(true);
      const data = await api.getTicket(ticketId);
      setTicket(data);
      setStatusVal(data.status);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, showToast]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (!ticketId) return null;

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      await api.updateTicket(ticketId, { status: newStatus });
      setStatusVal(newStatus);
      showToast(`Status updated to ${newStatus}`, "success");
      fetchDetail();
      onTicketUpdated();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle appending note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      setIsAddingNote(true);
      await api.addNote(ticketId, noteText.trim());
      setNoteText("");
      showToast("Note added to ticket", "success");
      fetchDetail();
      onTicketUpdated();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {isLoading || !ticket ? (
          <div className="modal-body" style={{ textAlign: "center", padding: "3rem" }}>
            <div className="empty-title">Loading Ticket Details...</div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="ticket-id-tag">{ticket.ticket_id}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <button className="btn-close" onClick={onClose}>✕</button>
            </div>

            <div className="modal-body">
              {/* Customer Details Box */}
              <div className="detail-meta-box">
                <div>
                  <div className="meta-item-label">Customer</div>
                  <div className="meta-item-value">{ticket.customer_name}</div>
                </div>
                <div>
                  <div className="meta-item-label">Email</div>
                  <div className="meta-item-value">{ticket.customer_email}</div>
                </div>
                <div>
                  <div className="meta-item-label">Created</div>
                  <div className="meta-item-value">{formatDate(ticket.created_at)}</div>
                </div>
                <div>
                  <div className="meta-item-label">Last Updated</div>
                  <div className="meta-item-value">{formatDate(ticket.updated_at)}</div>
                </div>
              </div>

              {/* Status Update Control */}
              <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Change Ticket Status:</div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["Open", "In Progress", "Closed"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`btn btn-sm ${statusVal === s ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => handleStatusChange(s)}
                      disabled={isUpdatingStatus}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket Subject & Description */}
              <div style={{ marginBottom: "1.75rem" }}>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{ticket.subject}</h4>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#334155", background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)", whiteSpace: "pre-wrap" }}>
                  {ticket.description}
                </div>
              </div>

              {/* Notes & Activity Log */}
              <div>
                <div className="detail-section-title">
                  <span>Activity & Internal Notes ({ticket.notes?.length || 0})</span>
                </div>

                <div className="notes-timeline">
                  {(!ticket.notes || ticket.notes.length === 0) ? (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic", padding: "0.5rem 0" }}>
                      No internal notes recorded yet.
                    </div>
                  ) : (
                    ticket.notes.map((n) => (
                      <div key={n.id} className="note-item">
                        <div className="note-header">
                          <span className="note-author">Support Agent Note</span>
                          <span>{formatDate(n.created_at)}</span>
                        </div>
                        <div className="note-body">{n.note_text}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Input */}
                <form onSubmit={handleAddNote} style={{ marginTop: "1rem" }}>
                  <label className="form-label">Add Note / Comment</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type an update or resolution note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" disabled={isAddingNote || !noteText.trim()}>
                      {isAddingNote ? "Adding..." : "Add Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Toast Notification Banner
 */
function ToastNotification({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast-container">
      <div className={`toast ${toast.type}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

/**
 * Main Application Root
 */
export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Real-time debounced search input (250ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Tickets
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getTickets(statusFilter, debouncedSearch);
      setTickets(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, debouncedSearch, showToast]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error("Stats load failed", err);
    }
  }, []);

  // Initial Load and Updates
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Seed sample data refresh
  const handleResetData = async () => {
    if (!confirm("Load default demo dataset into CRM?")) return;
    try {
      setIsResetting(true);
      await api.seedDemoData(true);
      showToast("Demo tickets loaded successfully!", "success");
      fetchTickets();
      fetchStats();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        onNewTicket={() => setIsCreateOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      <main className="main-content">
        <StatsOverview 
          stats={stats}
          currentStatus={statusFilter}
          onSelectStatus={(status) => setStatusFilter(status)}
        />

        <SearchFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onClearSearch={() => setSearchQuery("")}
        />

        <TicketList 
          tickets={tickets}
          isLoading={isLoading}
          onTicketClick={(id) => setSelectedTicketId(id)}
          onResetSearch={() => {
            setSearchQuery("");
            setStatusFilter("All");
          }}
        />
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          fetchTickets();
          fetchStats();
        }}
        showToast={showToast}
      />

      {/* Ticket Details & Notes Modal */}
      <TicketDetailModal 
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onTicketUpdated={() => {
          fetchTickets();
          fetchStats();
        }}
        showToast={showToast}
      />

      <ToastNotification toast={toast} />
    </div>
  );
}
