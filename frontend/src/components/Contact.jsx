import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import Toast from "./Toast";

const API = "https://event-management-system-0w2o.onrender.com/eventRoute";

export default function ContactPage() {
  const [form, setForm]       = useState({ fullName: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [user, setUser]       = useState(null);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => {});
    }
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/send-mail`, form);
      setToast({ message: "Message sent! We will get back to you soon.", type: "success" });
      setForm({ fullName: "", email: "", message: "" });
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Failed to send. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ padding: "40px 48px", flex: 1 }} className="anim-fade-up">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.05 }}>
              Get in <span style={{ color: "#f97316" }}>Touch</span>
            </h1>
            <p style={{ color: "#8888aa", fontSize: "15px", lineHeight: 1.7, maxWidth: "420px", margin: 0 }}>
              Questions, suggestions, or just want to say hi? We read every message.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "24px", alignItems: "start" }} className="contact-grid">
            {/* Left: info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "📧", label: "Email",    value: "eventify@example.com" },
                { icon: "📞", label: "Phone",    value: "+91 98765 43210"       },
                { icon: "📍", label: "Location", value: "Chennai, Tamil Nadu"   },
                { icon: "🕐", label: "Response", value: "Within 24–48 hours"    },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", background: "#0f0f1c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#555", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                    <p style={{ fontSize: "14px", color: "#ddd", fontWeight: 600, margin: 0 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: form */}
            <div style={{ background: "#0f0f1c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "28px" }}>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 22px" }}>
                Send a message
              </h2>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { name: "fullName", label: "Your Name",    type: "text",  placeholder: "John Doe"         },
                  { name: "email",    label: "Email",        type: "email", placeholder: "john@example.com" },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "7px" }}>
                      {label}
                    </label>
                    <input
                      className="input-field"
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "7px" }}>
                    Message
                  </label>
                  <textarea
                    className="input-field"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    required
                    rows={5}
                    style={{ resize: "none" }}
                  />
                </div>

                <button className="btn-orange" type="submit" disabled={loading} style={{ width: "100%", height: "48px", marginTop: "6px" }}>
                  {loading ? (
                    <><svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" /><path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" /></svg> Sending...</>
                  ) : (
                    <>Send Message <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          div[style*="padding: 40px 48px"] { padding: 24px 18px !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </Layout>
  );
}