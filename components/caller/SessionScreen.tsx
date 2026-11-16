"use client"; import type { Lead } from "@/lib/types"; import { campaignColor } from "@/lib/campaign"; import { leadStats } from "@/lib/leadStats"; import type { CallLog } from "@/lib/types";
export default function SessionScreen({ lead, upNext, done, total, paused, countdown, nativeApp, logs, stats, onCallNow, onPause, onResume, onStop, onSkip }: { lead: Lead; upNext: Lead[]; done: number; total: number; paused: boolean; countdown: number; nativeApp: boolean; logs: CallLog[]; stats: { calls: number; talked: number }; onCallNow: () => void; onPause: () => void; onResume: () => void; onStop: () => void; onSkip: () => void }) {
  const st = leadStats(lead.id, logs); const ini = lead.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return <div style={{ display: "grid", gap: 12 }}>
    <div className="card" style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)" }}><span>📊 Session Progress</span><span>Ho gayi {done} • Bachi {total - done} • Total {total}</span></div>
      <div style={{ height: 10, background: "var(--border)", borderRadius: 99 }}><div style={{ height: "100%", width: `${total ? (done / total) * 100 : 0}%`, background: "var(--grad)", borderRadius: 99, transition: "width .4s" }} /></div>
      <div style={{ display: "flex", gap: 14, fontSize: 13 }}><span>📞 Calls: <strong>{stats.calls}</strong></span><span>✅ Baat hui: <strong>{stats.talked}</strong></span><span>🎯 Baat-hui %: <strong>{stats.calls ? Math.round((stats.talked / stats.calls) * 100) : 0}%</strong></span>{paused && <span style={{ color: "var(--amber)", fontWeight: 700 }}>⏸ PAUSED</span>}</div>
    </div>
    <div className="card" style={{ textAlign: "center", display: "grid", gap: 8, padding: 24 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: campaignColor(lead.campaign), color: "#fff", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800, margin: "0 auto" }}>{ini}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{lead.name}</div>
      <div style={{ fontSize: 17, color: "var(--muted)" }}>{lead.phone}</div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{lead.campaign} • {st.attempts} baar pehle call hua{st.lastDisposition ? ` • Last: ${st.lastDisposition}` : " • 🆕 New lead"}</div>
      {countdown > 0 ? <div style={{ fontSize: 16, fontWeight: 700 }}>⏳ {nativeApp ? `Agli call ${countdown}s me auto lagegi...` : `Agli lead ${countdown}s me ready hogi...`}</div>
      : nativeApp ? <div style={{ fontSize: 15, color: "var(--muted)" }}>Call lag rahi hai / ready hai...</div>
      : <><button className="pulse" onClick={onCallNow} style={{ padding: "18px", fontSize: 19, borderRadius: 14 }}>📞 Call — {lead.name}</button><div style={{ fontSize: 12, color: "var(--muted)" }}>Web par har call ke liye ek tap lagega — Android app me ye call apne aap lag jati hai.</div></>}
    </div>
    <div style={{ display: "flex", gap: 8 }}>{paused ? <button onClick={onResume} style={{ flex: 1, padding: 13 }}>▶ Resume</button> : <button className="ghost" onClick={onPause} style={{ flex: 1, padding: 13 }}>⏸ Pause</button>}<button className="ghost" onClick={onSkip} style={{ flex: 1, padding: 13 }}>⏭ Skip Lead</button><button onClick={onStop} style={{ flex: 1, padding: 13, background: "var(--red)" }}>⏹ Stop</button></div>
    {upNext.length > 0 && <div className="card" style={{ display: "grid", gap: 6 }}><strong style={{ fontSize: 14 }}>Up Next</strong>{upNext.map((l, i) => <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>{i + 1}. {l.name}</span><span style={{ color: "var(--muted)" }}>{l.campaign}</span></div>)}</div>}
  </div>;
}
