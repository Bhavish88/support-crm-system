/**
 * Support CRM API Client
 * Clean REST communication with FastAPI backend.
 */
// In unified deployment (FastAPI serving dist), API_BASE is empty (uses relative paths).
// If deployed separately (e.g. Vercel frontend + Render backend), set VITE_API_URL in environment.
// Automatically falls back to the production Render backend when running on Vercel if VITE_API_URL is omitted.
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return "https://support-crm-system-68t9.onrender.com";
  }
  return "";
};

export const API_BASE = getApiBase();

export const api = {
  // 1. List Tickets (with optional status & search query)
  async getTickets(status = null, search = null) {
    const params = new URLSearchParams();
    if (status && status !== "All") params.append("status", status);
    if (search && search.trim()) params.append("search", search.trim());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${API_BASE}/api/tickets${queryString}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.statusText}`);
    }
    return response.json();
  },

  // 2. Get Single Ticket Details (including notes history)
  async getTicket(ticketId) {
    const response = await fetch(`${API_BASE}/api/tickets/${ticketId}`);
    if (!response.ok) {
      throw new Error(`Ticket '${ticketId}' not found`);
    }
    return response.json();
  },

  // 3. Create New Ticket
  async createTicket(ticketData) {
    const response = await fetch(`${API_BASE}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.[0]?.msg || errorData.detail || "Failed to create ticket");
    }
    return response.json();
  },

  // 4. Update Ticket (status and/or append note)
  async updateTicket(ticketId, updateData) {
    const response = await fetch(`${API_BASE}/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to update ticket");
    }
    return response.json();
  },

  // 5. Add Note to Ticket
  async addNote(ticketId, noteText) {
    const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note_text: noteText }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to add note");
    }
    return response.json();
  },

  // 6. Get Dashboard KPI Stats
  async getStats() {
    const response = await fetch(`${API_BASE}/api/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch CRM statistics");
    }
    return response.json();
  },

  // 7. Seed / Reset Demo Data
  async seedDemoData(reset = false) {
    const response = await fetch(`${API_BASE}/api/seed?reset=${reset}`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to seed demo data");
    }
    return response.json();
  }
};
