import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import Toast from "./Toast";

const API = "https://event-management-system-0w2o.onrender.com/eventRoute";

const CAT_ACCENT = {
  Tech: "#3b82f6", Sports: "#22c55e", Music: "#a855f7",
  Cultural: "#ec4899", General: "#f97316",
};

const getCategory = (ev) => {
  const c = (ev?.category || "General").trim();
  return ["Tech","Sports","Music","Cultural","General"].includes(c) ? c : "General";
};

export default function MyProfile() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [toast, setToast]     = useState(null);
  const [tab, setTab]         = useState("bookings");
  const [cancelId, setCancelId] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleCancel = async (id) => {
    setCancelId(id);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/cancel-booking/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setToast({ message: "Booking cancelled successfully.", type: "info" });
      fetchProfile();
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Could not cancel.", type: "error" });
    } finally {
      setCancelId(null);
    }
  };

  const initial = user?.username?.charAt(0).toUpperCase();
  const totalBooked = user?.bookedEvents?.length || 0;
  const upcoming = user?.bookedEvents?.filter(e => new Date(e.date) >= new Date()).length || 0;

  return (
    <Layout user={user}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ padding: "36px 48px", flex: 1, maxWidth: "900px" }} className="anim-fade-up">
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="skeleton" style={{ height: "120px", borderRadius: "20px" }} />
            <div className="skeleton" style={{ height: "400px", borderRadius: "20px" }} />
          </div>
        ) : error ? (
          <p style={{ color: "#f87171" }}>{error}</p>
        ) : user ? (
          <>
            {/* ── PROFILE HEADER ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px", padding: "28px", background: "#0f0f1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{
                width: "76px",
                height: "76px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Outfit',sans-serif",
                fontSize: "32px",
                fontWeight: 900,
                color: "#fff",
                flexShrink: 0,
                boxShadow: "0 8px 30px rgba(249,115,22,0.3)",
              }}>
                {initial}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "26px", fontWeight: 900, color: "#fff", margin: 0 }}>
                    {user.fullName || user.username}
                  </h1>
                  {user.role === "admin" && (
                    <span style={{ padding: "3px 10px", borderRadius: "99px", background: "rgba(249,115,22,0.15)", color: "#f97316", fontSize: "12px", fontWeight: 700, border: "1px solid rgba(249,115,22,0.25)" }}>
                      Admin
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "14px", color: "#666", margin: "4px 0 12px" }}>@{user.username}</p>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", color: "#777" }}>✉️ {user.email || "—"}</span>
                  <span style={{ fontSize: "13px", color: "#777" }}>📞 {user.phone || "—"}</span>
                </div>
              </div>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: "16px", flexShrink: 0 }}>
                {[
                  { value: totalBooked, label: "Booked" },
                  { value: upcoming,    label: "Upcoming" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 900, color: "#f97316", margin: 0, lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: "11px", color: "#555", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── TABS ── */}
            <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "4px", marginBottom: "20px", width: "fit-content", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[{ id: "bookings", label: "My Bookings" }, { id: "info", label: "Account Info" }].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: "9px 22px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    transition: "all 0.2s",
                    background: tab === t.id ? "#f97316" : "transparent",
                    color: tab === t.id ? "#fff" : "#666",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── BOOKINGS TAB ── */}
            {tab === "bookings" && (
              <div>
                {totalBooked === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "20px" }}>
                    <p style={{ fontSize: "40px", margin: "0 0 12px" }}>🎟️</p>
                    <p style={{ color: "#aaa", fontWeight: 600, marginBottom: "6px" }}>No bookings yet</p>
                    <p style={{ color: "#555", fontSize: "13px" }}>Go to Events and book something exciting!</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {user.bookedEvents.map((item, i) => {
                      const cat    = getCategory(item);
                      const accent = CAT_ACCENT[cat] || CAT_ACCENT.General;
                      const isPast = new Date(item.date) < new Date();

                      return (
                        <div
                          key={i}
                          style={{ display: "flex", gap: "0", background: "#0f0f1c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", transition: "border-color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}40`}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
                        >
                          {/* Color bar */}
                          <div style={{ width: "4px", background: accent, flexShrink: 0 }} />

                          <div style={{ flex: 1, padding: "18px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                              <div>
                                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "17px", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>
                                  {item.name}
                                </h3>
                                <span style={{ padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 600, background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                                  {cat}
                                </span>
                              </div>
                              <span style={{
                                padding: "4px 10px",
                                borderRadius: "99px",
                                fontSize: "11px",
                                fontWeight: 700,
                                background: isPast ? "rgba(255,255,255,0.05)" : "rgba(34,197,94,0.1)",
                                color: isPast ? "#555" : "#22c55e",
                                border: isPast ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(34,197,94,0.2)",
                              }}>
                                {isPast ? "Completed" : "✓ Confirmed"}
                              </span>
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
                              <span style={{ fontSize: "12px", color: "#777" }}>📅 {new Date(item.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                              <span style={{ fontSize: "12px", color: "#777" }}>⏰ {item.startTime} – {item.endTime}</span>
                              <span style={{ fontSize: "12px", color: "#777" }}>📍 {item.place}</span>
                              <span style={{ fontSize: "12px", color: "#777" }}>🏛️ {item.club}</span>
                            </div>

                            {!isPast && (
                              <button
                                onClick={() => handleCancel(item._id)}
                                disabled={cancelId === item._id}
                                style={{ marginTop: "12px", padding: "7px 14px", borderRadius: "9px", background: "transparent", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                {cancelId === item._id ? "Cancelling…" : "Cancel Booking"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── INFO TAB ── */}
            {tab === "info" && (
              <div style={{ background: "#0f0f1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
                <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "18px", fontWeight: 800, color: "#fff", margin: "0 0 20px" }}>
                  Account Details
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                  {[
                    { label: "Username",      value: user.username        || "—" },
                    { label: "Full Name",     value: user.fullName        || "—" },
                    { label: "Email",         value: user.email           || "—" },
                    { label: "Phone",         value: user.phone           || "—" },
                    { label: "Role",          value: user.role            || "user" },
                    { label: "Events Booked", value: totalBooked },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 16px" }}>
                      <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>{label}</p>
                      <p style={{ fontSize: "15px", color: "#ddd", fontWeight: 600, margin: 0, wordBreak: "break-all" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <style>{`
        @media (max-width:768px) {
          div[style*="padding: 36px 48px"] { padding: 20px 16px !important; }
        }
      `}</style>
    </Layout>
  );
}