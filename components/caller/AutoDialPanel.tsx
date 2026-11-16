"use client";
// Unlimited auto-dial session: koi call cap nahi, quota sirf target hai limit nahi
export default function AutoDialPanel({ state, done, remaining, gap, setGap, onStart, onPause, onResume, onStop }: { state: "idle" | "running" | "paused"; done: number; remaining: number; gap: number; setGap: (n: number) => void; onStart: () => void; onPause: () => void; onResume: () => void; onStop: () => void }) {
  const total = done + remaining; const pct = total ? Math.round(done / total * 100) : 0;
  return <div className="card" style={{ display: "grid", gap: 8 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>🚀 Auto-Dial Session</strong><span style={{ fontSize: 12, color: "var(--muted)" }}>No call limit</span></div>
  <div style={{ height: 8, background: "var(--border)", borderRadius: 99 }}><div style={{ height: 8, width: `${pct}%`, background: "var(--accent)", borderRadius: 99 }} /></div>
  <div style={{ fontSize: 13, color: "var(--muted)" }}>Done: {done} • Remaining: {remaining} • Total queue: {total}</div>
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
    {state === "idle" && <button onClick={onStart} style={{ fontSize: 16, padding: "12px 20px" }}>▶ Start Auto-Dial</button>}
    {state === "running" && <button className="ghost" onClick={onPause}>⏸ Pause</button>}
    {state === "paused" && <button onClick={onResume}>▶ Resume</button>}
    {state !== "idle" && <button className="ghost" onClick={onStop}>⏹ Stop</button>}
    <label style={{ fontSize: 13 }}>Next gap <select value={gap} onChange={e => setGap(Number(e.target.value))}><option value={0}>0s</option><option value={3}>3s</option><option value={5}>5s</option><option value={10}>10s</option><option value={20}>20s</option></select></label>
  </div></div>;
}
