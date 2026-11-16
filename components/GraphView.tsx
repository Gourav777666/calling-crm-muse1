"use client"; import { useState } from "react";
// Callyzer-style hourly Graph View: colour-coded categories + Calls/Duration toggle + tap tooltip
const SERIES = [{ k: "connected", label: "Baat Hui (Connected)", color: "var(--green)" }, { k: "notConnected", label: "Not Connected / RNR", color: "var(--amber)" }, { k: "missed", label: "Missed / Wrong Number", color: "var(--red)" }] as const;
export default function GraphView({ hourly }: { hourly: any[] }) {
  const [mode, setMode] = useState<"count" | "duration">("count"); const [sel, setSel] = useState<number | null>(null);
  const val = (b: any, k: string) => mode === "count" ? b[k] : b["dur" + k[0].toUpperCase() + k.slice(1)];
  const tot = (b: any) => mode === "count" ? b.total : b.durTotal;
  const max = Math.max(1, ...hourly.map(tot)); const hours = hourly.filter(b => tot(b) > 0 || (b.hour >= 8 && b.hour <= 21));
  return <div style={{ display: "grid", gap: 8 }}>
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}><strong style={{ flex: 1, fontSize: 14 }}>📊 Graph View — ghante ke hisab se</strong>
    <button className={mode === "count" ? "" : "ghost"} onClick={() => setMode("count")} style={{ padding: "7px 12px" }}>📞 Phone Calls</button>
    <button className={mode === "duration" ? "" : "ghost"} onClick={() => setMode("duration")} style={{ padding: "7px 12px" }}>⏱ Duration</button></div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>{SERIES.map(s => <span key={s.k}><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: s.color, marginRight: 5 }} />{s.label}</span>)}<span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--accent2)", marginRight: 5 }} />Total Outgoing</span></div>
    {sel !== null && hourly[sel] && <div style={{ fontSize: 13, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px" }}><strong>{sel}:00 – {sel + 1}:00</strong> • Total: {tot(hourly[sel])}{mode === "duration" ? "s" : ""} • Baat Hui: {val(hourly[sel], "connected")}{mode === "duration" ? "s" : ""} • Not Connected: {val(hourly[sel], "notConnected")}{mode === "duration" ? "s" : ""} • Missed: {val(hourly[sel], "missed")}{mode === "duration" ? "s" : ""}</div>}
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 130, overflowX: "auto", paddingTop: 6 }}>{hours.map(b => <div key={b.hour} onClick={() => setSel(b.hour)} style={{ flex: "1 0 22px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", cursor: "pointer", opacity: sel === null || sel === b.hour ? 1 : .45 }} title={`${b.hour}:00`}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: `${Math.max(3, tot(b) / max * 100)}%` }}>{[...SERIES].reverse().map(s => val(b, s.k) > 0 && <div key={s.k} style={{ height: `${val(b, s.k) / Math.max(1, tot(b)) * 100}%`, background: s.color, borderRadius: s.k === "missed" ? "4px 4px 0 0" : 0 }} />)}</div>
      <div style={{ fontSize: 9, textAlign: "center", color: "var(--muted)" }}>{b.hour}</div></div>)}</div>
    {!hourly.some(b => b.total > 0) && <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center" }}>Is range me koi call nahi hai.</p>}
  </div>;
}
