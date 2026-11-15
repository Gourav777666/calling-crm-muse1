"use client";
import { useState } from "react";
export default function LeadForm({ onAdd }: { onAdd: () => void }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [note, setNote] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim() || !phone.trim()) return;
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, note }) });
    setName(""); setPhone(""); setNote(""); onAdd();
  };
  const input = { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", flex: 1 } as const;
  return <form onSubmit={submit} style={{ display: "grid", gap: 8 }}><div style={{ display: "flex", gap: 8 }}><input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={input} /><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" style={input} /></div><div style={{ display: "flex", gap: 8 }}><input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" style={input} /><button style={{ padding: "10px 16px", borderRadius: 8, border: 0, background: "#000", color: "#fff", cursor: "pointer" }}>Add Lead</button></div></form>;
}
