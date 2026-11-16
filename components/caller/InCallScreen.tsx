"use client"; import { useEffect, useState } from "react"; import type { Lead } from "@/lib/types"; import { campaignColor, initials } from "@/lib/campaign"; import { waLink } from "@/lib/templates";
// In-app calling screen: lead details + timer + controls yahi se, disposition End par
export default function InCallScreen({ lead, mode, onEnd }: { lead: Lead; mode: "native" | "tel"; onEnd: (sec: number) => void }) {
  const [sec, setSec] = useState(0); useEffect(() => { const t = setInterval(() => setSec(s => s + 1), 1000); return () => clearInterval(t); }, []);
  const mm = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  return <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 60, display: "grid", placeItems: "center", padding: 16 }}><div style={{ textAlign: "center", width: "100%", maxWidth: 420, display: "grid", gap: 12 }}>
    <div style={{ width: 84, height: 84, borderRadius: "50%", background: campaignColor(lead.campaign), color: "#fff", fontSize: 30, fontWeight: 700, display: "grid", placeItems: "center", margin: "0 auto" }}>{initials(lead.name)}</div>
    <div><div style={{ fontSize: 22, fontWeight: 700 }}>{lead.name}</div><div style={{ color: "var(--muted)" }}>{lead.phone}</div></div>
    <div><span style={{ background: campaignColor(lead.campaign), color: "#fff", padding: "3px 10px", borderRadius: 99, fontSize: 12 }}>{lead.campaign}</span></div>
    <div style={{ fontSize: 28, fontVariantNumeric: "tabular-nums" }}>{mm}</div>
    <div style={{ fontSize: 13, color: "var(--muted)" }}>{mode === "native" ? "📞 SIM call lagi (APK direct call) • 🔴 Auto-recording ON jahan OS support kare" : "Web version: call lagane ke liye neeche Dialer button dabao, baat khatam ho to End Call dabao. (App me call apne aap lagti hai.)"}</div>
    {mode === "tel" && <a href={`tel:${lead.phone.replace(/\s/g, "")}`} style={{ display: "block", background: "var(--green)", color: "#fff", fontWeight: 700, padding: "14px", borderRadius: "var(--r-sm)", textDecoration: "none", fontSize: 16 }}>📞 Dialer kholo — {lead.phone}</a>}
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}><button className="ghost">🔇 Mute</button><button className="ghost">🔊 Speaker</button><a href={waLink(lead.phone, lead.name)} target="_blank"><button className="ghost">WhatsApp</button></a></div>
    <button onClick={() => onEnd(sec)} style={{ background: "#DC2626", fontSize: 17, padding: "14px" }}>⏹ End Call & Disposition</button>
  </div></div>;
}
