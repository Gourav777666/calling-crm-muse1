"use client"; import { useState } from "react"; import { parseCsvDetailed, type ParsedCsv } from "@/lib/csv";
// Caller self-upload: CSV ya Excel -> preview -> Add to My Queue (source = Self Upload)
export default function UploadData({ onDone }: { onDone: () => void }) {
  const [parsed, setParsed] = useState<ParsedCsv | null>(null); const [fname, setFname] = useState(""); const [busy, setBusy] = useState(false); const [result, setResult] = useState<any>(null); const [err, setErr] = useState("");
  const onFile = async (f: File) => { setErr(""); setResult(null); setFname(f.name); try { let text = ""; if (/\.csv$/i.test(f.name)) text = await f.text(); else { const XLSX = await import("xlsx"); const wb = XLSX.read(await f.arrayBuffer()); const ws = wb.Sheets[wb.SheetNames[0]]; text = XLSX.utils.sheet_to_csv(ws); } setParsed(parseCsvDetailed(text)); } catch { setErr("File padh nahi paya — CSV ya Excel (.xlsx) file lagao."); } };
  const submit = async () => { if (!parsed) return; setBusy(true); const r = await fetch("/api/leads/self-upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leads: parsed.rows }) }); setResult(await r.json()); setBusy(false); setParsed(null); onDone(); };
  return <div className="card" style={{ display: "grid", gap: 10, marginTop: 12 }}>
    <strong style={{ fontSize: 16 }}>📤 Upload Data — apni leads add karo</strong>
    <div style={{ fontSize: 13, color: "var(--muted)" }}>CSV ya Excel (.xlsx/.xls) file lagao. Headers: Name, Mobile/Phone/Number chalega, +91 apne aap saaf ho jayega. Ye leads <strong>sirf tumhari queue</strong> me jayengi (Self Upload tag ke saath) aur admin ko bhi dikhengi.</div>
    <input type="file" accept=".csv,.xlsx,.xls" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
    {err && <div style={{ color: "var(--red)", fontSize: 13 }}>{err}</div>}
    {parsed && <><div style={{ fontSize: 14 }}><strong>{fname}</strong> — Total: {parsed.total} • ✅ Valid: {parsed.rows.length} • ❌ Galat/Duplicate: {parsed.errors.length}</div>
    {!parsed.headerDetected && <div style={{ fontSize: 12, color: "var(--amber)" }}>⚠️ Header nahi mila — pehli row ko bhi data mana gaya hai.</div>}
    {parsed.errors.slice(0, 5).map((e, i) => <div key={i} style={{ fontSize: 12, color: "var(--red)" }}>Line {e.line}: {e.reason}</div>)}
    <div style={{ display: "grid", gap: 3 }}>{parsed.rows.slice(0, 5).map((r, i) => <div key={i} style={{ fontSize: 13, borderTop: "1px dashed var(--border)", paddingTop: 4 }}>{r.name} • {r.phone} • {r.campaign || "General"}</div>)}{parsed.rows.length > 5 && <div style={{ fontSize: 12, color: "var(--muted)" }}>...aur {parsed.rows.length - 5} rows</div>}</div>
    <button onClick={submit} disabled={busy || !parsed.rows.length} style={{ padding: "14px", fontSize: 16 }}>{busy ? "Add ho raha hai..." : `➕ Add to My Queue (${parsed.rows.length} leads)`}</button></>}
    {result && <div style={{ fontSize: 14, background: "color-mix(in srgb, var(--green) 12%, transparent)", padding: "10px 12px", borderRadius: 10 }}>✅ <strong>{result.added} leads</strong> tumhari queue me add ho gayi • Duplicates skipped: {result.duplicates}</div>}
  </div>;
}
