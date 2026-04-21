import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "./Layout";
import Toast from "./Toast";

const API = "https://event-management-system-0w2o.onrender.com/eventRoute";
const CATS = ["All", "Tech", "Sports", "Music", "Cultural", "General"];

const CAT_ACCENT = {
  Tech:     "#3b82f6",
  Sports:   "#22c55e",
  Music:    "#a855f7",
  Cultural: "#ec4899",
  General:  "#f97316",
};

// ── THE FIX: normalize category so null/undefined/empty → "General" ──
const getCategory = (ev) => {
  const c = (ev.category || "General").trim();
  return CATS.includes(c) ? c : "General";
};

function Skeleton() {
  return (
    <div style={{ borderRadius: "16px", overflow: "hidden" }}>
      <div className="skeleton" style={{ height: "4px" }} />
      <div className="skeleton" style={{ height: "200px", borderRadius: "0 0 16px 16px" }} />
    </div>
  );
}

export default function EventPage() {
  const [events, setEvents]       = useState([]);
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [selected, setSelected]   = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [cancelId, setCancelId]   = useState(null);
  const [showAdd, setShowAdd]     = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newEvent, setNewEvent]   = useState({
    name: "", date: "", startTime: "", endTime: "",
    place: "", club: "", description: "", slots: "",
    category: "General", imageUrl: "",
  });

  const toast$ = (msg, type = "success") => setToast({ message: msg, type });

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const [pRes, eRes] = await Promise.all([
        axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/event-list`),
      ]);
      setUser(pRes.data);
      setEvents(eRes.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const isBooked = (id) =>
    user?.bookedEvents?.some(e => (typeof e === "object" ? e._id : e) === id);

  const handleBook = async (id) => {
    setBookingId(id);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/book-event/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast$("Booked! Check your email for confirmation.", "success");
      setSelected(null);
      fetchAll();
    } catch (err) {
      toast$(err.response?.data?.error || "Booking failed.", "error");
    } finally {
      setBookingId(null);
    }
  };

  const handleCancel = async (id) => {
    setCancelId(id);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/cancel-booking/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast$("Booking cancelled.", "info");
      setSelected(null);
      fetchAll();
    } catch (err) {
      toast$(err.response?.data?.error || "Cancel failed.", "error");
    } finally {
      setCancelId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/delete-event/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast$("Event deleted.", "info");
      setSelected(null);
      fetchAll();
    } catch { toast$("Delete failed.", "error"); }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/create-event`, newEvent, { headers: { Authorization: `Bearer ${token}` } });
      toast$("Event created!", "success");
      setShowAdd(false);
      setNewEvent({ name: "", date: "", startTime: "", endTime: "", place: "", club: "", description: "", slots: "", category: "General", imageUrl: "" });
      fetchAll();
    } catch (err) {
      toast$(err.response?.data?.error || "Failed to create event.", "error");
    } finally {
      setAddLoading(false);
    }
  };

  // ── FILTERING ──────────────────────────────────────────────────────────
  const filtered = events.filter(ev => {
    const q   = search.toLowerCase();
    const cat = getCategory(ev);
    const matchSearch = !q ||
      ev.name.toLowerCase().includes(q) ||
      (ev.place || "").toLowerCase().includes(q) ||
      (ev.club  || "").toLowerCase().includes(q);
    const matchCat = activeCat === "All" || cat === activeCat;
    return matchSearch && matchCat;
  });

  // Category counts (for badge numbers on filter buttons)
  const catCount = (cat) => {
    if (cat === "All") return events.length;
    return events.filter(ev => getCategory(ev) === cat).length;
  };

  return (
    <Layout user={user}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ padding: "36px 48px", flex: 1 }} className="anim-fade-in">

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
              All Events
            </h1>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
              {loading ? "Loading..." : `${filtered.length} event${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {user?.role === "admin" && (
            <button
              className="btn-orange"
              onClick={() => setShowAdd(true)}
              style={{ flexShrink: 0 }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </button>
          )}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#666" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input-field"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by event name, venue or club…"
            style={{ paddingLeft: "40px" }}
          />
        </div>

        {/* ── CATEGORY FILTERS ── */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {CATS.map(cat => {
            const count  = catCount(cat);
            const accent = CAT_ACCENT[cat] || CAT_ACCENT.General;
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "99px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: active ? `1.5px solid ${accent}` : "1px solid rgba(255,255,255,0.1)",
                  background: active ? `${accent}18` : "rgba(255,255,255,0.04)",
                  color: active ? accent : "#888",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {cat}
                <span style={{
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "99px",
                  background: active ? `${accent}30` : "rgba(255,255,255,0.08)",
                  color: active ? accent : "#555",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── EVENTS GRID ── */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }}>
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>
            <button className="btn-ghost" onClick={fetchAll} style={{ marginTop: "12px" }}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px" }}>
            <p style={{ fontSize: "40px", margin: "0 0 12px" }}>🔍</p>
            <p style={{ color: "#aaa", fontWeight: 600, margin: "0 0 6px" }}>No events match your search</p>
            <p style={{ color: "#555", fontSize: "13px", margin: "0 0 16px" }}>Try a different name or category</p>
            <button className="btn-ghost" onClick={() => { setSearch(""); setActiveCat("All"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }} className="stagger">
            {filtered.map(ev => {
              const cat    = getCategory(ev);
              const accent = CAT_ACCENT[cat] || CAT_ACCENT.General;
              const booked = isBooked(ev._id);
              const full   = ev.slots === 0;
              const low    = ev.slots > 0 && ev.slots <= 5;

              return (
                <div
                  key={ev._id}
                  onClick={() => setSelected(ev)}
                  className="card"
                  style={{ cursor: "pointer", overflow: "hidden", position: "relative" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${accent}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Accent top strip */}
                  <div style={{ height: "3px", background: accent }} />

                  <div style={{ padding: "18px 20px" }}>
                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
                        {cat}
                      </span>
                      {booked && (
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "99px", border: "1px solid rgba(34,197,94,0.2)" }}>
                          ✓ Booked
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "18px", fontWeight: 800, color: "#fff", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ev.name}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: "13px", color: "#888", margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.55 }}>
                      {ev.description}
                    </p>

                    {/* Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#777", marginBottom: "14px" }}>
                      <span>📅 {new Date(ev.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {ev.startTime}–{ev.endTime}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {ev.place} · 🏛️ {ev.club}</span>
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: full ? "#ef4444" : low ? "#f59e0b" : "#aaa" }}>
                          {full ? "🔴 Full" : low ? `🔥 ${ev.slots} left` : `${ev.slots} seats`}
                        </span>
                      </div>
                      <span style={{ fontSize: "12px", color: accent, fontWeight: 600 }}>Details →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ EVENT DETAIL MODAL ══ */}
      {selected && (() => {
        const cat    = getCategory(selected);
        const accent = CAT_ACCENT[cat] || CAT_ACCENT.General;
        const booked = isBooked(selected._id);
        const full   = selected.slots === 0;

        return (
          <div
            className="anim-fade-in"
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <div
              className="anim-slide-right"
              style={{ width: "100%", maxWidth: "520px", background: "#0f0f1c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.8)", maxHeight: "90vh", overflowY: "auto" }}
            >
              {/* Accent bar */}
              <div style={{ height: "4px", background: accent }} />

              <div style={{ padding: "28px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <span style={{ padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
                      {cat}
                    </span>
                    <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "26px", fontWeight: 900, color: "#fff", margin: "10px 0 0" }}>
                      {selected.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#888", cursor: "pointer", padding: "8px", lineHeight: 1 }}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Description */}
                <p style={{ fontSize: "14px", color: "#999", lineHeight: 1.7, marginBottom: "20px" }}>
                  {selected.description}
                </p>

                {/* Detail grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                  {[
                    { icon: "📅", label: "Date",  value: new Date(selected.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                    { icon: "⏰", label: "Time",  value: `${selected.startTime} – ${selected.endTime}` },
                    { icon: "📍", label: "Venue", value: selected.place },
                    { icon: "🏛️", label: "Club",  value: selected.club },
                    { icon: "🎟️", label: "Seats", value: selected.slots === 0 ? "No seats left" : `${selected.slots} available` },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "12px 14px" }}>
                      <p style={{ fontSize: "11px", color: "#555", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{icon} {label}</p>
                      <p style={{ fontSize: "14px", color: "#ddd", fontWeight: 600, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {booked ? (
                    <button
                      className="btn-ghost"
                      onClick={() => handleCancel(selected._id)}
                      disabled={cancelId === selected._id}
                      style={{ flex: 1, color: "#f87171", borderColor: "rgba(239,68,68,0.25)" }}
                    >
                      {cancelId === selected._id ? "Cancelling…" : "Cancel Booking"}
                    </button>
                  ) : (
                    <button
                      className="btn-orange"
                      onClick={() => handleBook(selected._id)}
                      disabled={full || bookingId === selected._id}
                      style={{ flex: 1 }}
                    >
                      {bookingId === selected._id ? "Booking…" : full ? "Event Full" : "Book Now →"}
                    </button>
                  )}

                  <button className="btn-ghost" onClick={() => setSelected(null)} style={{ padding: "12px 20px" }}>
                    Close
                  </button>

                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(selected._id)}
                      style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer" }}
                      title="Delete event"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ ADD EVENT MODAL (ADMIN) ══ */}
      {showAdd && (
        <div
          className="anim-fade-in"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        >
          <div
            className="anim-slide-right"
            style={{ width: "100%", maxWidth: "520px", background: "#0f0f1c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.8)", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ height: "4px", background: "#f97316" }} />
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>
                  Create New Event
                </h2>
                <button
                  onClick={() => setShowAdd(false)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#888", cursor: "pointer", padding: "8px" }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { name: "name",      label: "Event Name",      type: "text",   placeholder: "e.g. National Tech Fest 2025" },
                  { name: "date",      label: "Date",            type: "date",   placeholder: "" },
                  { name: "startTime", label: "Start Time",      type: "time",   placeholder: "" },
                  { name: "endTime",   label: "End Time",        type: "time",   placeholder: "" },
                  { name: "place",     label: "Venue",           type: "text",   placeholder: "e.g. Main Auditorium, Block A" },
                  { name: "club",      label: "Organised By",    type: "text",   placeholder: "e.g. IEEE Student Chapter" },
                  { name: "slots",     label: "Total Slots",     type: "number", placeholder: "50" },
                  { name: "imageUrl",  label: "Image URL (optional)", type: "url", placeholder: "https://..." },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "7px" }}>
                      {label}
                    </label>
                    <input
                      className="input-field"
                      type={type}
                      name={name}
                      value={newEvent[name]}
                      onChange={e => setNewEvent({ ...newEvent, [e.target.name]: e.target.value })}
                      placeholder={placeholder}
                      required={name !== "imageUrl"}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "7px" }}>
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                    style={{ background: "#12121f" }}
                  >
                    {["Tech", "Sports", "Music", "Cultural", "General"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "7px" }}>
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Describe the event, what attendees can expect..."
                    required
                    rows={3}
                    style={{ resize: "none" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", paddingTop: "8px" }}>
                  <button className="btn-orange" type="submit" disabled={addLoading} style={{ flex: 1, height: "48px" }}>
                    {addLoading ? "Creating…" : "Create Event →"}
                  </button>
                  <button className="btn-ghost" type="button" onClick={() => setShowAdd(false)} style={{ padding: "12px 20px" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width:768px) {
          div[style*="padding: 36px 48px"] { padding: 24px 18px !important; }
        }
      `}</style>
    </Layout>
  );
}