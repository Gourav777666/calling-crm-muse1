"use client"; import { useState } from "react"; import type { Lead, CallLog } from "@/lib/types"; import { waLink, smsLink, shareText } from "@/lib/templates"; import { campaignColor, initials } from "@/lib/campaign"; import { leadStats, relTime } from "@/lib/leadStats"; import Badge from "@/components/ui/Badge";
// Compact card: front par sirf Call + ⋮ More; baaki actions menu me - ek screen par 4-5 leads
export default function LeadCard({ lead, logs, onCall, onHistory, onCallback, onSkip }: { lead: Lead; logs: CallLog[]; onCall: (l: Lead) => void; onHistory: (l: Lead) => void; onCallback: (l: Lead) => void; onSkip: (l: Lead) => void }) {
  const [menu, setMenu] = useState(false); const st = leadStats(lead.id, logs); const badge = st.talked === null ? "🆕 New" : st.talked ? "✅ Baat Hui" : "❌ Baat Nahi";
  const item = { display: "block", width: "100%", textAlign: "left", padding: "11px 12px", background: "none", color: "var(--text)", boxShadow: "none", fontWeight: 500, fontSize: 14 } as const;
  return <div className="card" style={{ padding: "10px 12px", display: "grid", gap: 7 }}>
  <div style={{ display: "flex", gap: 9, alignItems: "center" }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: campaignColor(lead.campaign), color: "#fff", fontWeight: 700, fontSize: 13, display: "grid", placeItems: "center", flexShrink: 0 }}>{initials(lead.name)}</div>
  <div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", gap: 6, alignItems: "center" }}><strong style={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.name}</strong><Badge kind={st.talked === null ? "new" : st.talked ? "talked" : "not"}>{badge}</Badge>{lead.source === "Self Upload" && <span style={{ fontSize: 10, background: "var(--accent2)", color: "#fff", padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>📤 Self</span>}{st.lastDisposition && <span style={{ fontSize: 11, color: "var(--muted)" }}>{st.lastDisposition}</span>}</div>
  <div style={{ color: "var(--muted)", fontSize: 12 }}>{lead.phone} • {lead.campaign} • {`Total Calls: ${st.attempts}`}{st.lastCallAt ? ` • ${relTime(st.lastCallAt)}` : ""}{lead.callbackAt ? ` • ⏰ ${new Date(lead.callbackAt).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : ""}</div></div></div>
  <div style={{ display: "flex", gap: 6, position: "relative" }}><button onClick={() => onCall(lead)} style={{ flex: 1, padding: "10px", fontSize: 15 }}>📞 Call</button><button className="ghost" onClick={() => setMenu(m => !m)} style={{ padding: "10px 14px", fontSize: 16 }} aria-label="More actions">⋮</button>
  {menu && <div style={{ position: "absolute", right: 0, top: 46, zIndex: 30, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-lg)", width: 190, overflow: "hidden" }}>
    <a href={waLink(lead.phone, lead.name)} target="_blank" style={{ ...item, textDecoration: "none" }}>💬 WhatsApp</a>
    <a href={smsLink(lead.phone, lead.name)} style={{ ...item, textDecoration: "none" }}>✉️ SMS bhejo</a>
    <button style={item} onClick={() => { setMenu(false); onHistory(lead); }}>🕘 History dekho</button>
    <button style={item} onClick={() => { setMenu(false); onCallback(lead); }}>⏰ Callback Set</button>
    <button style={item} onClick={() => { setMenu(false); onSkip(lead); }}>⏭ Skip / Next</button>
    <a href={`https://wa.me/?text=${encodeURIComponent(shareText(lead))}`} target="_blank" style={{ ...item, textDecoration: "none" }}>🔗 Share Lead</a>
  </div>}</div></div>;
}
