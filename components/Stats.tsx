import type { Lead } from "@/lib/types";
export default function Stats({ leads }: { leads: Lead[] }) {
  const items = [["Total", leads.length], ["Interested", leads.filter(l => l.status === "Interested").length], ["Follow-up", leads.filter(l => l.status === "Follow-up").length], ["Called", leads.filter(l => l.status === "Called").length]] as const;
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>{items.map(([label, value]) => <div key={label} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 12, textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div><div style={{ color: "#666", fontSize: 13 }}>{label}</div></div>)}</div>;
}
