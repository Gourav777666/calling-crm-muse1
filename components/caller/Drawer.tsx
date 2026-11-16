"use client"; import ThemeToggle from "@/components/ThemeToggle"; import LogoutButton from "@/components/ui/LogoutButton"; import { initials } from "@/lib/campaign"; import type { CallLog } from "@/lib/types";
// ☰ Slide-in drawer: saare extra features ek jagah, front screen saaf
export default function Drawer({ open, onClose, me, logs, leads, go, onExport }: { open: boolean; onClose: () => void; me: any; logs: CallLog[]; leads: any[]; go: (v: string) => void; onExport: () => void }) {
  const due = (leads || []).filter((l: any) => l.callbackAt && l.callbackAt <= Date.now() + 3600000).length;
  const today = logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()); const talked = today.filter(l => !["RNR", "Switched Off", "Wrong Number"].includes(l.disposition)).length;
  const item = { display: "flex", gap: 10, alignItems: "center", width: "100%", textAlign: "left", padding: "13px 12px", background: "none", color: "var(--text)", boxShadow: "none", fontWeight: 500, fontSize: 15, borderRadius: 10 } as const;
  const nav = (v: string) => { go(v); onClose(); };
  return <>{open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 90 }} />}
  <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 280, maxWidth: "85vw", background: "var(--card)", zIndex: 95, transform: open ? "translateX(0)" : "translateX(-105%)", transition: "transform .28s ease", boxShadow: "var(--shadow-lg)", padding: 16, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="brand">📞 Calling CRM</span><button className="ghost" onClick={onClose} style={{ padding: "6px 11px" }}>✕</button></div>
    <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 4px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--grad)", color: "#fff", fontWeight: 800, display: "grid", placeItems: "center" }}>{initials(me.name || "?")}</div><div><strong>{me.name}</strong><div style={{ fontSize: 12, color: "var(--muted)" }}>Aaj: {today.length} calls • {talked} baat hui</div></div></div>
    <button style={item} onClick={() => nav("queue")}>📋 Lead Queue</button>
    <button style={item} onClick={() => nav("history")}>🕘 My Call History</button>
    <button style={item} onClick={() => nav("callbacks")}>⏰ Reminders (Callbacks){due > 0 && <span style={{ marginLeft: "auto", background: "var(--red)", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 99, padding: "2px 8px" }}>{due}</span>}</button>
    <button style={item} onClick={() => nav("stats")}>📊 My Stats</button>
    <button style={item} onClick={() => nav("upload")}>📤 Upload Data</button>
    <button style={item} onClick={() => nav("myuploads")}>🗂 My Uploads</button>
    <button style={item} onClick={() => nav("profile")}>👤 Profile</button>
    <button style={item} onClick={() => { onExport(); onClose(); }}>📥 Export My Report</button>
    <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6 }}><button style={item} onClick={() => nav("settings")}>⚙️ Settings</button><button style={item} onClick={() => nav("help")}>❓ Help & Support</button><button style={item} onClick={() => nav("about")}>ℹ️ About App</button></div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", fontSize: 14, color: "var(--muted)" }}><span>🎨 Theme</span><ThemeToggle /></div>
    <div style={{ marginTop: "auto" }}><LogoutButton full /></div>
  </aside></>;
}
