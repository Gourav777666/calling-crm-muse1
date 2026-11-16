"use client"; import type { Lead } from "@/lib/types";
// My Uploads: caller ki khud upload ki leads + soft delete (admin ke paas record hamesha rahega)
export default function MyUploads({ leads, onDone }: { leads: Lead[]; onDone: () => void }) {
  const mine = leads.filter(l => l.source === "Self Upload");
  const del = async (id: string) => { if (!confirm("Ye lead tumhare view se hat jayegi. Admin ke paas iska record aur call history hamesha rahegi. Pakka?")) return; await fetch("/api/leads/delete-self", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: id }) }); onDone(); };
  return <div style={{ display: "grid", gap: 8, marginTop: 12 }}><div style={{ fontSize: 13, color: "var(--muted)" }}>Tumhari upload ki hui leads ({mine.length}). Delete karne par lead sirf tumhare view se hategi — admin ke paas lead + poori history save rahegi.</div>
  {mine.map(l => <div key={l.id} className="card" style={{ padding: "10px 12px", display: "flex", gap: 8, alignItems: "center" }}><div style={{ flex: 1 }}><strong style={{ fontSize: 14 }}>{l.name}</strong><div style={{ fontSize: 12, color: "var(--muted)" }}>{l.phone} • {l.campaign} • {l.status} • {l.attempts || 0} baar call</div></div><span className="pill" style={{ background: "var(--accent2)" }}>📤 Self Upload</span><button className="ghost" onClick={() => del(l.id)} style={{ color: "var(--red)" }}>🗑 Delete</button></div>)}
  {!mine.length && <div className="card" style={{ textAlign: "center", padding: 26 }}><div style={{ fontSize: 26 }}>🗂</div><p style={{ color: "var(--muted)" }}>Abhi tak tumne koi lead upload nahi ki. Drawer se "Upload Data" kholo.</p></div>}</div>;
}
