import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BG from "../assets/BG.jpg";

// Inline SVG logo — no image dependency
function EventifyLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#f97316" />
      <path d="M10 14h14M10 20h10M10 26h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="14" r="4" fill="white" />
      <path d="M30 10v4l2.5 2" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { path: "/home",    label: "Home"    },
  { path: "/events",  label: "Events"  },
  { path: "/contact", label: "Contact" },
];

export default function Layout({ children, user }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [drop, setDrop]     = useState(false);
  const [mobile, setMobile] = useState(false);

  const active = (p) => location.pathname === p;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,15,0.82)", zIndex: 0, pointerEvents: "none" }} />

      {/* ── NAVBAR ── */}
      <header style={{
        position: "relative",
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "64px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        background: "rgba(8,8,15,0.7)",
      }}>
        {/* Brand */}
        <Link to="/home" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <EventifyLogo size={34} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff", letterSpacing: "-0.5px" }}>
            Event<span style={{ color: "#f97316" }}>ify</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: "4px" }} className="hidden-mobile">
          {NAV.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              className={active(path) ? "nav-active" : ""}
              onMouseEnter={e => { if (!active(path)) { e.target.style.background = "rgba(255,255,255,0.07)"; e.target.style.color = "#fff"; }}}
              onMouseLeave={e => { if (!active(path)) { e.target.style.background = "transparent"; e.target.style.color = "#888"; }}}
              onLoad={e => { e.target.style.color = active(path) ? "#fb923c" : "#888"; }}
              ref={el => { if (el) el.style.color = active(path) ? "#fb923c" : "#8888aa"; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: user + mobile toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobile(!mobile)}
            style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: "6px", display: "none" }}
            className="show-mobile"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobile ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* User pill */}
          <button
            onClick={() => setDrop(!drop)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "99px",
              padding: "5px 14px 5px 6px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "13px",
              color: "#fff",
              fontFamily: "'Outfit',sans-serif",
            }}>
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <span style={{ fontSize: "13px", color: "#ddd", fontWeight: 500 }}>
              {user?.username || "Guest"}
            </span>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#666" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {drop && (
            <div
              className="anim-fade-in"
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                width: "200px",
                background: "#0f0f1c",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                zIndex: 999,
              }}
            >
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: "11px", color: "#666", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Signed in as</p>
                <p style={{ fontSize: "13px", color: "#eee", fontWeight: 600, margin: 0 }}>{user?.username}</p>
                {user?.role === "admin" && (
                  <span style={{ display: "inline-block", marginTop: "4px", padding: "2px 8px", background: "rgba(249,115,22,0.15)", color: "#f97316", fontSize: "11px", borderRadius: "99px", fontWeight: 600 }}>
                    Admin
                  </span>
                )}
              </div>
              <Link
                to="/profile"
                onClick={() => setDrop(false)}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 16px", color: "#bbb", fontSize: "13px", textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                My Profile
              </Link>
              <button
                onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
                style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "11px 16px", color: "#f87171", fontSize: "13px", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile nav */}
      {mobile && (
        <div style={{ position: "relative", zIndex: 20, background: "rgba(8,8,15,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 24px" }}>
          {NAV.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobile(false)}
              style={{ display: "block", padding: "12px 16px", borderRadius: "10px", color: active(path) ? "#f97316" : "#aaa", fontSize: "15px", fontWeight: 500, textDecoration: "none", marginBottom: "4px" }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Page content */}
      <main style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(8px)", background: "rgba(8,8,15,0.5)" }}>
        <span style={{ fontSize: "13px", color: "#444" }}>© {new Date().getFullYear()} Eventify</span>
        <span style={{ fontSize: "13px", color: "#444" }}>Simplify your events</span>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
          header { padding: 0 20px !important; }
          footer { padding: 16px 20px !important; }
        }
      `}</style>
    </div>
  );
}