import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Layout from "./Layout";

const API = "https://event-management-system-0w2o.onrender.com/eventRoute";

const CAT_ACCENT = {
  Tech:     "#3b82f6",
  Sports:   "#22c55e",
  Music:    "#a855f7",
  Cultural: "#ec4899",
  General:  "#f97316",
};

function StatCard({ value, label, icon }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "26px", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="skeleton" style={{ height: "160px", borderRadius: "16px" }} />;
}

export default function Home() {
  const [user, setUser]     = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    Promise.all([
      axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/event-list`),
    ])
      .then(([pRes, eRes]) => {
        setUser(pRes.data);
        setEvents(eRes.data);
      })
      .catch((err) => {
        if ([401, 403].includes(err.response?.status)) { localStorage.removeItem("token"); navigate("/"); }
        else setError("Failed to load data. Please refresh.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const upcoming = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const getCategory = (ev) => ev.category || "General";

  return (
    <Layout user={user}>
      <div style={{ padding: "40px 48px", flex: 1 }} className="anim-fade-up">

        {/* ── HERO ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "24px" }}>
          <div>
            {loading ? (
              <div className="skeleton" style={{ height: "14px", width: "200px", marginBottom: "16px" }} />
            ) : (
              <p style={{ fontSize: "13px", color: "#f97316", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                👋 Hello, {user?.fullName?.split(" ")[0] || user?.username}
              </p>
            )}
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.05 }}>
              Discover &amp; Book<br />
              <span style={{ color: "#f97316" }}>Amazing Events</span>
            </h1>
            <p style={{ color: "#8888aa", fontSize: "15px", lineHeight: 1.7, maxWidth: "480px", margin: 0 }}>
              Workshops, hackathons, sports, music nights — find what's happening on campus and secure your spot instantly.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
              <Link to="/events" className="btn-orange" style={{ textDecoration: "none" }}>
                Browse Events →
              </Link>
              <Link to="/profile" className="btn-ghost" style={{ textDecoration: "none" }}>
                My Bookings
              </Link>
            </div>
          </div>

          {/* Mini ticket graphic */}
          <div style={{ flexShrink: 0 }} className="hidden-mobile-2">
            <div style={{ width: "180px", height: "100px", background: "linear-gradient(135deg,#1a0a00,#2a1000)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "16px", padding: "16px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(249,115,22,0.1)" }} />
              <p style={{ fontSize: "10px", color: "#f97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Eventify</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "18px", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>{events.length} Events</p>
              <p style={{ fontSize: "11px", color: "#666", margin: 0 }}>available now</p>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        {!loading && user && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px", marginBottom: "40px" }} className="stagger">
            <StatCard value={events.length}                  label="Total Events"   icon="🗓️" />
            <StatCard value={user.bookedEvents?.length || 0} label="Your Bookings"  icon="🎟️" />
            <StatCard value={upcoming.length}                label="Coming Up"      icon="⏰" />
            <StatCard value={user.role === "admin" ? "Admin" : "Member"} label="Your Role" icon="🏷️" />
          </div>
        )}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "40px" }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: "80px" }} />)}
          </div>
        )}

        {/* ── UPCOMING EVENTS ── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "22px", fontWeight: 800, color: "#fff", margin: 0 }}>
              Upcoming Events
            </h2>
            <Link to="/events" style={{ fontSize: "13px", color: "#f97316", fontWeight: 600, textDecoration: "none" }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px" }}>
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <p style={{ color: "#f87171" }}>{error}</p>
          ) : upcoming.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
              <p style={{ fontSize: "36px", margin: "0 0 12px" }}>📅</p>
              <p style={{ color: "#666", margin: 0 }}>No upcoming events. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px" }} className="stagger">
              {upcoming.map(ev => {
                const cat   = getCategory(ev);
                const accent = CAT_ACCENT[cat] || CAT_ACCENT.General;
                return (
                  <div
                    key={ev._id}
                    onClick={() => navigate("/events")}
                    style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}
                    className="card"
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{ height: "3px", background: accent }} />
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 600, background: `${accent}20`, color: accent, border: `1px solid ${accent}33` }}>
                          {cat}
                        </span>
                        <span style={{ fontSize: "12px", color: "#666" }}>{new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      </div>
                      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ev.name}
                      </h3>
                      <p style={{ fontSize: "13px", color: "#888", margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
                        {ev.description}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#666" }}>
                        <span>📍 {ev.place}</span>
                        <span style={{ color: ev.slots === 0 ? "#ef4444" : ev.slots <= 5 ? "#f59e0b" : "#888" }}>
                          {ev.slots === 0 ? "Full" : `${ev.slots} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── MY BOOKINGS STRIP ── */}
        {user && user.bookedEvents?.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>
              My Bookings
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {user.bookedEvents.slice(0, 4).map((item, i) => {
                const cat    = item.category || "General";
                const accent = CAT_ACCENT[cat] || CAT_ACCENT.General;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ width: "4px", height: "40px", borderRadius: "99px", background: accent, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                      <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{item.place} · {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", flexShrink: 0 }}>
                      Booked ✓
                    </span>
                  </div>
                );
              })}
              {user.bookedEvents.length > 4 && (
                <Link to="/profile" style={{ textAlign: "center", fontSize: "13px", color: "#f97316", padding: "12px", borderRadius: "12px", border: "1px dashed rgba(249,115,22,0.2)", textDecoration: "none" }}>
                  +{user.bookedEvents.length - 4} more — View all in Profile →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width:768px) {
          .hidden-mobile-2 { display:none !important; }
          div[style*="padding: 40px 48px"] { padding: 24px 20px !important; }
        }
      `}</style>
    </Layout>
  );
}