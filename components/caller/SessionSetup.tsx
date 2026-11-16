"use client"; import { useState } from "react";
export type SessFilter = "all" | "new" | "callbacks" | string;
export default function SessionSetup({ camps, counts, onStart }: { camps: string[]; counts: Record<string, number>; onStart: (f: SessFilter, gap: number) => void }) {
  const [f, setF] = useState<SessFilter>("all"); const [gap, setGap] = useState(5);
  const total = counts[f] || 0;
  return <div className="card" style={{ display: "grid", gap: 12 }}>
    <strong style={{ fontSize: 16 }}>🚀 Auto-Dial Session</strong>
    <label style={{ display: "grid", gap: 4, fontSize: 13, color: "var(--muted)" }}>Kis queue par session chalega?
      <select value={f} onChange={e => setF(e.target.value)}><option value="all">Saari pending leads ({counts.all || 0})</option><option value="new">Sirf New leads ({counts.new || 0})</option><option value="callbacks">Callbacks due ({counts.callbacks || 0})</option>{camps.map(c => <option key={c} value={`camp:${c}`}>Campaign: {c} ({counts[`camp:${c}`] || 0})</option>)}</select></label>
    <label style={{ display: "grid", gap: 4, fontSize: 13, color: "var(--muted)" }}>Ek call ke baad agli call tak gap
      <select value={gap} onChange={e => setGap(+e.target.value)}>{[0, 3, 5, 10, 20].map(g => <option key={g} value={g}>{g === 0 ? "Turant (0s)" : `${g} seconds`}</option>)}</select></label>
    <button onClick={() => onStart(f, gap)} disabled={!total} style={{ padding: "15px", fontSize: 17 }}>▶ Start Auto-Dial ({total} leads)</button>
    {!total && <div style={{ fontSize: 13, color: "var(--muted)" }}>Is queue me pending lead nahi hai.</div>}
    <div style={{ fontSize: 12, color: "var(--muted)" }}>Note: Android app me calls apne aap lagti jayengi. Web browser me har agli call ke liye ek bada Call button milega — ek tap lagega (browser ki limit hai).</div>
  </div>;
}
