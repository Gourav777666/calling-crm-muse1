"use client";
export const FILTERS = ["All", "New", "Baat Hui", "Baat Nahi Hui", "Callback Due", "Interested", "Deal Closed"] as const;
export default function FilterBar({ q, setQ, f, setF, camp, setCamp, camps, att, setAtt, count }: { q: string; setQ: (v: string) => void; f: string; setF: (v: string) => void; camp: string; setCamp: (v: string) => void; camps: string[]; att: number; setAtt: (n: number) => void; count: number }) {
  return <div style={{ display: "grid", gap: 6, marginTop: 8 }}><input placeholder="🔍 Naam ya number se search karo" value={q} onChange={e => setQ(e.target.value)} style={{ padding: "9px" }} />
  <div style={{ display: "flex", gap: 6, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 2 }}>{FILTERS.map(x => <button key={x} className={f === x ? "" : "ghost"} onClick={() => setF(x)} style={{ fontSize: 12, padding: "6px 10px", whiteSpace: "nowrap" }}>{x}</button>)}</div>
  <div style={{ display: "flex", gap: 6 }}><select value={camp} onChange={e => setCamp(e.target.value)} style={{ flex: 1 }}><option value="">All Campaigns</option>{camps.map(c => <option key={c}>{c}</option>)}</select><select value={att} onChange={e => setAtt(Number(e.target.value))} style={{ flex: 1 }}><option value={0}>Attempts: All</option><option value={1}>1+ baar try hue</option><option value={3}>3+ baar try hue</option></select></div>
  <div style={{ fontSize: 12, color: "var(--muted)" }}>{count} leads mili</div></div>;
}
