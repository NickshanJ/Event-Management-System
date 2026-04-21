import React, { useState } from "react";
import BG from "../assets/BG.jpg";
import { Link, useNavigate } from "react-router-dom";

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#f97316" />
      <path d="M10 14h14M10 20h10M10 26h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="14" r="4" fill="white" />
      <path d="M30 10v4l2.5 2" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const FIELDS = [
  { name: "username", label: "Username",    type: "text",  placeholder: "Choose a unique username" },
  { name: "fullName", label: "Full Name",   type: "text",  placeholder: "Your full name"           },
  { name: "email",    label: "Email",       type: "email", placeholder: "you@example.com"          },
  { name: "phone",    label: "Phone",       type: "tel",   placeholder: "+91 XXXXX XXXXX"          },
  { name: "password", label: "Password",   type: "password", placeholder: "Create a strong password" },
];

export default function Register() {
  const [form, setForm]     = useState({ username: "", fullName: "", email: "", phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        "https://event-management-system-0w2o.onrender.com/eventRoute/create-user",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
      );
      const data = await res.json();
      if (res.ok) navigate("/");
      else setError(data.error);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,15,0.9)", zIndex: 1 }} />

      <div
        className="anim-fade-up"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "460px",
          background: "#0b0b16",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <Logo />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>
            Event<span style={{ color: "#f97316" }}>ify</span>
          </span>
        </div>

        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
          Create account
        </h2>
        <p style={{ color: "#555", fontSize: "14px", margin: "0 0 28px" }}>Join Eventify and start exploring</p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "12px 14px", marginBottom: "20px", fontSize: "13px", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {FIELDS.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "7px" }}>
                {label}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={name === "password" ? (showPw ? "text" : "password") : type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  style={name === "password" ? { paddingRight: "44px" } : {}}
                />
                {name === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer" }}
                  >
                    {showPw
                      ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                )}
              </div>
            </div>
          ))}

          <button className="btn-orange" type="submit" disabled={loading} style={{ width: "100%", height: "48px", marginTop: "8px" }}>
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#555", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#f97316", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}