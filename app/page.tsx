"use client"; import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header"; import MetricsBar from "@/components/caller/MetricsBar"; import LeadCard from "@/components/caller/LeadCard"; import DispositionModal from "@/components/caller/DispositionModal"; import LeadTimeline from "@/components/caller/LeadTimeline"; import InCallScreen from "@/components/caller/InCallScreen"; import AutoDialPanel from "@/components/caller/AutoDialPanel"; import CallHistory from "@/components/caller/CallHistory";
import type { Lead, CallLog } from "@/lib/types"; import { syncOffline } from "@/lib/offline"; import { dialNative, startAutoRecording } from "@/lib/native";
type Incall = { lead: Lead; mode: "native" | "tel" };
export default function Home() {
  const [me, setMe] = useState<any>(null); const [leads, setLeads] = useState<Lead[]>([]); const [logs, setLogs] = useState<CallLog[]>([]); const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [tab, setTab] = useState<"queue" | "history">("queue");
  const [incall, setIncall] = useState<Incall | null>(null); const [callSec, setCallSec] = useState(0); const [modal, setModal] = useState<Lead | null>(null); const [historyLead, setHistoryLead] = useState<Lead | null>(null);
  const [session, setSession] = useState<"idle" | "running" | "paused">("idle"); const [gap, setGap] = useState(5); const [countdown, setCountdown] = useState(0); const [doneCount, setDoneCount] = useState(0); const queueRef = useRef<Lead[]>([]); const sessionRef = useRef(session); sessionRef.current = session;
  const load = useCallback(async () => { const [a, b] = await Promise.all([fetch("/api/leads"), fetch("/api/calls")]); if (a.ok) { const d = await a.json(); setLeads(d); setAllLeads(d); } if (b.ok) setLogs(await b.json()); }, []);
  useEffect(() => { fetch("/api/auth/me").then(r => r.ok ? r.json() : location.href = "/login").then(u => { if (u?.role === "admin") location.href = "/admin"; setMe(u); }); load(); syncOffline(); const hb = setInterval(() => fetch("/api/heartbeat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ presence: "Online" }) }), 30000); const on = () => syncOffline().then(load); window.addEventListener("online", on); return () => { clearInterval(hb); window.removeEventListener("online", on); }; }, [load]);
  const startCall = useCallback((lead: Lead) => { startAutoRecording(); const mode = dialNative(lead.phone); setIncall({ lead, mode }); }, []);
  const nextFromQueue = useCallback(() => { const next = queueRef.current.shift(); if (!next) { setSession("idle"); return; } startCall(next); }, [startCall]);
  // countdown -> next call (session running + koi modal/incall nahi)
  useEffect(() => { if (session !== "running" || countdown <= 0 || incall || modal) return; const t = setTimeout(() => { if (countdown === 1) nextFromQueue(); else setCountdown(c => c - 1); }, 1000); return () => clearTimeout(t); }, [countdown, session, incall, modal, nextFromQueue]);
  const startSession = () => { queueRef.current = leads.filter(l => l.status === "New" || l.status === "Call Back Later"); setDoneCount(0); if (!queueRef.current.length) return alert("Queue me pending leads nahi hain."); setSession("running"); nextFromQueue(); };
  const due = leads.filter(l => l.callbackAt && l.callbackAt - Date.now() < 5 * 60000 && l.callbackAt > Date.now() - 60000);
  if (!me) return <p style={{ padding: 20 }}>Loading...</p>;
  const remaining = queueRef.current.length + (session !== "idle" && incall ? 1 : 0);
  return <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 32px" }}><Header name={me.name} role={me.role} /><MetricsBar logs={logs} loginAt={me.loginAt} />
  {due.length > 0 && <div className="card" style={{ marginTop: 12, borderColor: "orange" }}>⏰ Callback in 5 min: {due.map(l => l.name).join(", ")}</div>}
  <div style={{ display: "flex", gap: 8, marginTop: 12 }}><button className={tab === "queue" ? "" : "ghost"} onClick={() => setTab("queue")} style={{ flex: 1 }}>📋 Lead Queue</button><button className={tab === "history" ? "" : "ghost"} onClick={() => setTab("history")} style={{ flex: 1 }}>🕘 My Call History</button></div>
  {tab === "queue" ? <><div style={{ marginTop: 12 }}><AutoDialPanel state={session} done={doneCount} remaining={session === "idle" ? leads.filter(l => l.status === "New").length : remaining} gap={gap} setGap={setGap} onStart={startSession} onPause={() => setSession("paused")} onResume={() => { setSession("running"); if (!incall && !modal) setCountdown(1); }} onStop={() => { setSession("idle"); queueRef.current = []; setCountdown(0); }} /></div>
  <div style={{ display: "grid", gap: 8, marginTop: 12 }}>{leads.map(l => <LeadCard key={l.id} lead={l} logs={logs} onCall={startCall} onHistory={setHistoryLead} />)}{!leads.length && <div className="card" style={{ textAlign: "center", padding: 28 }}><div style={{ fontSize: 28 }}>🎉</div><p style={{ color: "var(--muted)" }}>Queue khaali hai — koi lead assigned nahi hai. Admin se leads maango.</p></div>}</div></>
  : <div style={{ marginTop: 12 }}><CallHistory logs={logs} leads={allLeads} /></div>}
  {countdown > 0 && session === "running" && !incall && !modal && <div className="card" style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 65 }}>⏳ Next call in {countdown}s</div>}
  {incall && <InCallScreen lead={incall.lead} mode={incall.mode} onEnd={sec => { setCallSec(sec); setModal(incall.lead); setIncall(null); }} />}
  {modal && <DispositionModal lead={modal} durationSec={callSec} onClose={() => { setModal(null); if (sessionRef.current === "running") setCountdown(gap || 1); }} onDone={() => { load(); setDoneCount(c => c + 1); }} />}
  {historyLead && <LeadTimeline lead={historyLead} logs={logs} onClose={() => setHistoryLead(null)} />}
  </main>;
}
