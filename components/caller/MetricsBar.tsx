import type { CallLog } from "@/lib/types";
export default function MetricsBar({ logs, loginAt }: { logs: CallLog[]; loginAt?: number }) {
  const today = logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString());
  const connected = today.filter(l => !["RNR", "Switched Off", "Wrong Number"].includes(l.disposition));
  const talk = today.reduce((a, l) => a + l.durationSec, 0);
  const shift = loginAt ? ((Date.now() - loginAt) / 3600000).toFixed(1) : "0";
  const items = [["Today Calls", today.length], ["Connected", connected.length], ["Talk Time", `${Math.floor(talk / 60)}m`], ["Shift Hours", shift]];
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>{items.map(([k, v]) => <div key={k} className="card" style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 700 }}>{v}</div><div style={{ color: "var(--muted)", fontSize: 12 }}>{k}</div></div>)}</div>;
}
