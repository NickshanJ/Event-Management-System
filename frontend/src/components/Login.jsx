import React, { useState } from "react";
import BG from "../assets/BG.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#f97316" />
      <path d="M10 14h14M10 20h10M10 26h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="14" r="4" fill="white" />
      <path d="M30 10v4l2.5 2" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        "https://event-management-system-0w2o.onrender.com/eventRoute/login-user",
        { username, password }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative" }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,15,0.88)", zIndex: 1 }} />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          margin: "auto",
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
        }}
      >
        {/* Left — brand panel */}
        <div style={{
          flex: 1,
          background: "linear-gradient(135deg, #0f0f1c 0%, #1a0a00 100%)",
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
          className="login-left"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Logo />
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff" }}>
              Event<span style={{ color: "#f97316" }}>ify</span>
            </span>
          </div>

          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "13px", color: "#f97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>
              College Event Platform
            </p>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "52px", fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: "0 0 20px" }}>
              Your events,<br />
              <span style={{ color: "#f97316" }}>simplified.</span>
            </h1>
            <p style={{ color: "#8888aa", fontSize: "15px", lineHeight: 1.7, maxWidth: "320px" }}>
              Book workshops, fests, sports events and more — all from one place. No more missing out.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Workshops", "Hackathons", "Sports", "Cultural Fests", "Music Nights"].map(tag => (
              <span
                key={tag}
                style={{ padding: "5px 12px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.12)", fontSize: "12px", color: "#666" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{
          width: "420px",
          flexShrink: 0,
          background: "#0b0b16",
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
          className="login-right"
        >
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "30px", color: "#fff", margin: "0 0 6px" }}>
            Welcome back
          </h2>
          <p style={{ color: "#666", fontSize: "14px", margin: "0 0 32px" }}>Sign in to continue to Eventify</p>

          {error && (
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "12px 14px", marginBottom: "20px" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ef4444" style={{ flexShrink: 0, marginTop: "1px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: "13px", color: "#fca5a5" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                Username
              </label>
              <input
                className="input-field"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }}
                >
                  {showPw
                    ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button className="btn-orange" type="submit" disabled={loading} style={{ width: "100%", marginTop: "8px", height: "48px" }}>
              {loading
                ? <><svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="anim-spin" style={{ animation: "spin 0.8s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" /></svg> Signing in...</>
                : "Sign in →"
              }
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#555", marginTop: "24px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#f97316", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left  { display: none !important; }
          .login-right { width: 100% !important; padding: 40px 28px !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}