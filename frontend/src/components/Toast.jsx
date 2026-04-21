import React, { useEffect } from "react";

const ICONS = {
  success: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const STYLES = {
  success: { bar: "#22c55e", icon: "#22c55e" },
  error:   { bar: "#ef4444", icon: "#ef4444" },
  info:    { bar: "#3b82f6", icon: "#3b82f6" },
};

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const s = STYLES[type] || STYLES.success;

  return (
    <div
      className="anim-toast"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "400px",
        background: "#12121f",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        padding: "0",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Left color bar */}
      <div style={{ width: "4px", background: s.bar, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", flex: 1 }}>
        <span style={{ color: s.icon, flexShrink: 0 }}>{ICONS[type]}</span>
        <span style={{ fontSize: "14px", color: "#e5e5e5", lineHeight: 1.4 }}>{message}</span>
        <button
          onClick={onClose}
          style={{ marginLeft: "auto", color: "#666", background: "none", border: "none", cursor: "pointer", fontSize: "18px", lineHeight: 1, flexShrink: 0 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}