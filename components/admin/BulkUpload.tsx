"use client"; import { useState } from "react"; import { parseCsvDetailed, type ParsedCsv } from "@/lib/csv";
// Upload flow: File chuno -> Preview -> Distribution chuno -> "Upload & Distribute" Submit -> Summary
export default function BulkUpload({ users, onDone }: { users: any[]; onDone: () => void }) {
  const [parsed, setParsed] = useState<ParsedCsv | null>(null); const [fileName, setFileName] = useState(""); const [mode, setMode] = useState("round-robin"); const [to, setTo] = useState(""); const [defCamp, setDefCamp] = useState(""); const [busy, setBusy] = useState(false); const [result, setResult] = useState<any>(null);
  const pick = async (f: File) => { setResult(null); setFileName(f.name); setParsed(parseCsvDetailed(await f.text())); };
  const submit = async () => { if (!parsed) return; setBusy(true); const r = await fetch("/api/leads/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leads: parsed.rows, mode, assignedTo: to, defaultCampaign: defCamp }) }); setResult(await r.json()); setBusy(false); setParsed(null); onDone(); };
  return <div className="card" style={{ display: "grid", gap: 10 }}><strong>📤 Bulk Lead Upload (Sirf CSV file)</strong>
  <div style={{ fontSize: 13, color: "var(--muted)" }}>Step 1: CSV file chuno (columns: Name, Phone/Mobile, Campaign — order kuch bhi ho, +91 chalega) → Step 2: Preview check karo → Step 3: Leads kisko jayengi chuno → Step 4: Submit dabao.</div>
  <input type="file" accept=".csv,text/csv" onChange={e => e.target.files?.[0] && pick(e.target.files[0])} />
  {parsed && <div style={{ display: "grid", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
    <div style={{ fontSize: 14 }}><strong>{fileName}</strong> — Total rows: {parsed.total} • ✅ Valid: {parsed.rows.length} • ❌ Galat: {parsed.errors.length}</div>
    {parsed.errors.slice(0, 4).map((e, i) => <div key={i} style={{ fontSize: 12, color: "#DC2626" }}>Line {e.line}: {e.reason}</div>)}
    {parsed.rows.slice(0, 5).map((r, i) => <div key={i} style={{ fontSize: 13, borderTop: "1px dashed var(--border)", paddingTop: 4 }}>{r.name} • {r.phone} • {r.campaign || defCamp || "General"}</div>)}
    {parsed.rows.length > 5 && <div style={{ fontSize: 12, color: "var(--muted)" }}>...aur {parsed.rows.length - 5} rows</div>}
    <div style={{ display: "grid", gap: 6, fontSize: 14 }}><strong>Leads kisko jayengi?</strong>
      <label><input type="radio" checked={mode === "round-robin"} onChange={() => setMode("round-robin")} /> Round-Robin — sab active callers me barabar</label>
      <label><input type="radio" checked={mode === "manual"} onChange={() => setMode("manual")} /> Ek specific caller ko sab</label>
      {mode === "manual" && <select value={to} onChange={e => setTo(e.target.value)}><option value="">Caller chuno</option>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select>}
      <label><input type="radio" checked={mode === "none"} onChange={() => setMode("none")} /> Unassigned Pool me rakho (baad me assign karenge)</label>
      <input placeholder="Default campaign (CSV me campaign na ho to)" value={defCamp} onChange={e => setDefCamp(e.target.value)} /></div>
    <button onClick={submit} disabled={busy || !parsed.rows.length || (mode === "manual" && !to)} style={{ fontSize: 16, padding: "13px" }}>{busy ? "Upload ho raha hai..." : `🚀 Upload & Distribute (${parsed.rows.length} leads)`}</button>
    {!parsed.rows.length && <div style={{ fontSize: 13, color: "#DC2626" }}>Ek bhi valid lead nahi mili — upar galti ki wajah dekho, file theek karke dobara chuno.</div>}
  </div>}
  {result && <div style={{ display: "grid", gap: 5, borderTop: "1px solid var(--border)", paddingTop: 8, fontSize: 14 }}><strong>✅ Result: Added {result.added} leads, Duplicates skipped {result.duplicates}</strong>
    {result.breakdown?.map((b: any) => <div key={b.caller}>👤 {b.caller}: {b.count} leads gayi</div>)}
    {result.unassigned > 0 && <div>📥 Unassigned Pool: {result.unassigned} leads</div>}
    {result.added === 0 && <div style={{ color: "#DC2626" }}>Koi lead add nahi hui — saari rows duplicate thi ya galat. Preview me wajah dikhti hai.</div>}
    <a href="#distribution">👉 Caller queues / Distribution section me dekho — neeche hi hai, wahan se manual assign bhi hota hai</a></div>}
  </div>;
}
