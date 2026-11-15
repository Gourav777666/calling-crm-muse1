"use client";
import type { Lead } from "@/lib/types";
import { STATUSES } from "@/lib/types";
export default function LeadItem({ lead, onChange }: { lead: Lead; onChange: () => void }) {
  const patch = async (status: string) => { await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status }) }); onChange(); };
  const del = async () => { await fetch("/api/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id }) }); onChange(); };
  return <li style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "#fff", border: "1px solid #eee", borderRadius: 8 }}><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{lead.name}</div><div style={{ color: "#666", fontSize: 13 }}>{lead.phone}{lead.note ? ` • ${lead.note}` : ""}</div></div><a href={`tel:${lead.phone}`} style={{ textDecoration: "none" }}>📞</a><select value={lead.status} onChange={e => patch(e.target.value)} style={{ padding: "6px", borderRadius: 6, border: "1px solid #ddd" }}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select><button onClick={del} style={{ border: 0, background: "transparent", cursor: "pointer", color: "#e11d48" }}>Delete</button></li>;
}
