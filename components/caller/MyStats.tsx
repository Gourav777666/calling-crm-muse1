"use client"; import { useEffect, useState } from "react"; import GraphView from "@/components/GraphView"; import { RANGES, rangeToQuery, type RangeKey } from "@/lib/daterange";
// Drawer > My Stats: caller ka sirf apna analytics (date range + graph)
export default function MyStats() { const [range, setRange] = useState<RangeKey>("today"); const [custom, setCustom] = useState({ from: "", to: "" }); const [d, setD] = useState<any>(null);
  const load = async (r: RangeKey = range, c = custom) => setD(await (await fetch(`/api/analytics?${rangeToQuery(r, c)}`)).json());
  useEffect(() => { load("today"); }, []);
  return <div className="card" style={{ display: "grid", gap: 12, marginTop: 12 }}><strong>📊 My Stats — sirf tumhari calls</strong>
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><select value={range} onChange={e => { const r = e.target.value as RangeKey; setRange(r); load(r); }}>{RANGES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
  {range === "custom" && <><input type="date" value={custom.from} onChange={e => setCustom({ ...custom, from: e.target.value })} /><input type="date" value={custom.to} onChange={e => setCustom({ ...custom, to: e.target.value })} /><button onClick={() => load()}>Apply</button></>}</div>
  {d && <><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, textAlign: "center" }}>{[["Total", d.total], ["Connected", d.connected], ["Unanswered", d.unanswered], ["ACD", `${d.acd}s`]].map(([k, v]) => <div key={k as string} className="card"><div style={{ fontSize: 18, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{k}</div></div>)}</div><GraphView hourly={d.hourly || []} /></>}
  </div>; }
