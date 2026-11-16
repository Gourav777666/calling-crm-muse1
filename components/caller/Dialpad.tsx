"use client"; import { useState } from "react"; import { dialNative } from "@/lib/native"; import DispositionModal from "./DispositionModal"; import type { Lead } from "@/lib/types";
// Floating dialpad: koi bhi number dial karo — call ke baad disposition, log admin ko sync (ad-hoc lead ban jata hai)
export default function Dialpad({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false); const [num, setNum] = useState(""); const [name, setName] = useState(""); const [called, setCalled] = useState(false); const [dispOpen, setDispOpen] = useState(false);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  const call = () => { if (num.replace(/\D/g, "").length < 10) return; dialNative(num); setCalled(true); };
  const fakeLead: Lead = { id: "", name: name || num, phone: num.replace(/\D/g, "").slice(-10), campaign: "Dialpad", status: "New", createdAt: Date.now(), history: [] };
  return <>
  <button onClick={() => setOpen(true)} aria-label="Dialpad" style={{ position: "fixed", right: 16, bottom: "calc(92px + env(safe-area-inset-bottom))", zIndex: 60, width: 58, height: 58, borderRadius: "50%", fontSize: 24, display: "grid", placeItems: "center", boxShadow: "var(--shadow-lg)" }}>⌨️</button>
  {open && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 75, display: "grid", placeItems: "end center" }} onClick={() => setOpen(false)}>
    <div className="card" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 380, borderRadius: "20px 20px 0 0", padding: 18, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>⌨️ Dialpad</strong><button className="ghost" onClick={() => setOpen(false)} style={{ padding: "6px 11px" }}>✕</button></div>
      <input value={num} onChange={e => setNum(e.target.value)} placeholder="Number type ya paste karo" inputMode="tel" style={{ fontSize: 20, textAlign: "center", letterSpacing: 1 }} />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Naam (optional — lead ban jayega)" style={{ fontSize: 14 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>{keys.map(k => <button key={k} className="ghost" onClick={() => setNum(n => n + k)} style={{ padding: "13px 0", fontSize: 18 }}>{k}</button>)}
      <span /><button className="ghost" onClick={() => setNum(n => n.slice(0, -1))} style={{ padding: "13px 0", fontSize: 16 }}>⌫</button><span /></div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={call} style={{ flex: 1, padding: 14, fontSize: 16 }}>📞 Call</button>
        <button className="ghost" onClick={() => num && window.open(`https://wa.me/91${num.replace(/\D/g, "").slice(-10)}`, "_blank")} style={{ padding: "14px 16px" }}>💬 WhatsApp</button>
      </div>
      {called && <button onClick={() => setDispOpen(true)} style={{ padding: 13, background: "var(--amber)" }}>📝 Call ho gayi — Disposition bharo</button>}
      <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Disposition save hote hi ye call admin ke logs me bhi dikhegi.</div>
    </div></div>}
  {dispOpen && <DispositionModal lead={fakeLead} adhoc onClose={() => setDispOpen(false)} onDone={() => { setDispOpen(false); setOpen(false); setCalled(false); setNum(""); setName(""); onDone(); }} />}
  </>;
}
