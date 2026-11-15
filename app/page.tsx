"use client"; import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header"; import MetricsBar from "@/components/caller/MetricsBar"; import LeadCard from "@/components/caller/LeadCard"; import DispositionModal from "@/components/caller/DispositionModal"; import LeadTimeline from "@/components/caller/LeadTimeline";
import type { Lead, CallLog } from "@/lib/types"; import { syncOffline } from "@/lib/offline"; import { dialNative } from "@/lib/native";
export default function Home() {
  const [me, setMe] = useState<any>(null); const [leads, setLeads] = useState<Lead[]>([]); const [logs, setLogs] = useState<CallLog[]>([]);
  const [modal, setModal] = useState<Lead | null>(null); const [history, setHistory] = useState<Lead | null>(null);
  const [autoDial, setAutoDial] = useState(false); const [delay, setDelay] = useState(5); const [countdown, setCountdown] = useState(0); const idx = useRef(0);
  const load = useCallback(async () => { const [a, b] = await Promise.all([fetch("/api/leads"), fetch("/api/calls")]); if (a.ok) setLeads(await a.json()); if (b.ok) setLogs(await b.json()); }, []);
  useEffect(() => { fetch("/api/auth/me").then(r => r.ok ? r.json() : location.href = "/login").then(u => { if (u?.role === "admin") location.href = "/admin"; setMe(u); }); load(); syncOffline(); const hb = setInterval(() => fetch("/api/heartbeat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ presence: "Online" }) }), 30000); const on = () => syncOffline().then(load); window.addEventListener("online", on); return () => { clearInterval(hb); window.removeEventListener("online", on); }; }, [load]);
  // Auto-dial countdown: after disposition saved, wait delay then dial next
  useEffect(() => { if (!autoDial || countdown <= 0) return; const t = setTimeout(() => setCountdown(c => c - 1), 1000); if (countdown === 1) { const next = leads.filter(l => l.status === "New")[idx.current]; if (next) { dialNative(next.phone); setModal(next); } } return () => clearTimeout(t); }, [countdown, autoDial, leads]);
  const due = leads.filter(l => l.callbackAt && l.callbackAt - Date.now() < 5 * 60000 && l.callbackAt > Date.now() - 60000);
  if (!me) return <p style={{ padding: 20 }}>Loading...</p>;
  return <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 32px" }}><Header name={me.name} role={me.role} /><MetricsBar logs={logs} loginAt={me.loginAt} />
  {due.length > 0 && <div className="card" style={{ marginTop: 12, borderColor: "orange" }}>⏰ Callback in 5 min: {due.map(l => l.name).join(", ")}</div>}
  <div className="card" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><label><input type="checkbox" checked={autoDial} onChange={e => setAutoDial(e.target.checked)} /> Auto-Dial Mode</label><select value={delay} onChange={e => setDelay(Number(e.target.value))}><option value={5}>Next in 5s</option><option value={10}>Next in 10s</option></select>{countdown > 0 && <span>Next call in {countdown}s</span>}<button className="ghost" onClick={load}>Refresh Queue</button></div>
  <div style={{ display: "grid", gap: 8, marginTop: 12 }}>{leads.map(l => <LeadCard key={l.id} lead={l} logs={logs} onCall={setModal} onHistory={setHistory} />)}{!leads.length && <p style={{ color: "var(--muted)", textAlign: "center" }}>No leads assigned.</p>}</div>
  {modal && <DispositionModal lead={modal} onClose={() => setModal(null)} onDone={() => { load(); if (autoDial) { idx.current++; setCountdown(delay); } }} />}
  {history && <LeadTimeline lead={history} logs={logs} onClose={() => setHistory(null)} />}
  </main>;
}
