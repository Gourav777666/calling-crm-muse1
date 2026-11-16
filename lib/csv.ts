// Flexible CSV: headers case-insensitive + synonyms, +91 cleanup, galat rows ki wajah ke saath report
const norm = (h: string) => h.toLowerCase().replace(/[\s_\.]+/g, "");
const NAME = ["name", "fullname", "contactname", "customername", "leadname", "naam", "customer"];
const PHONE = ["phone", "mobile", "mobileno", "mobilenumber", "number", "phonenumber", "contact", "contactno", "contactnumber", "whatsapp", "whatsappno", "whatsappnumber", "phoneno"];
const CAMP = ["campaign", "source", "list", "category", "campaignname"];
export const cleanPhone = (raw: string) => { let d = String(raw || "").replace(/\D/g, ""); if (d.length === 12 && d.startsWith("91")) d = d.slice(2); if (d.length === 11 && d.startsWith("0")) d = d.slice(1); return d.length === 10 ? d : ""; };
const splitLine = (l: string) => { const out: string[] = []; let cur = "", q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; } else if (c === '"') q = true; else if (c === ",") { out.push(cur.trim()); cur = ""; } else cur += c; } out.push(cur.trim()); return out; };
export type ParsedCsv = { rows: { name: string; phone: string; campaign?: string }[]; errors: { line: number; reason: string }[]; total: number; headerDetected: boolean };
export const parseCsvDetailed = (text: string): ParsedCsv => {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(l => l.trim()); const errors: ParsedCsv["errors"] = []; const rows: ParsedCsv["rows"] = [];
  if (!lines.length) return { rows, errors: [{ line: 0, reason: "File khaali hai" }], total: 0, headerDetected: false };
  const head = splitLine(lines[0]).map(norm); const ni = head.findIndex(h => NAME.includes(h)); const pi = head.findIndex(h => PHONE.includes(h)); const ci = head.findIndex(h => CAMP.includes(h));
  const headerDetected = pi >= 0; const start = headerDetected ? 1 : 0; const nameI = ni >= 0 ? ni : 0, phoneI = headerDetected ? pi : 1, campI = ci >= 0 ? ci : 2;
  if (!headerDetected) errors.push({ line: 1, reason: "Header row nahi mili (name/phone column) — pehli row ko data maan ke liya hai, order: Name, Phone, Campaign rakho" });
  for (let i = start; i < lines.length; i++) { const c = splitLine(lines[i]); const phone = cleanPhone(c[phoneI] || ""); const name = (c[nameI] || "").trim();
    if (!name && !phone) continue; if (!phone) { errors.push({ line: i + 1, reason: `Phone galat hai: "${c[phoneI] || ""}" (10-digit Indian number chahiye)` }); continue; }
    if (!name) { errors.push({ line: i + 1, reason: "Name khaali hai" }); continue; }
    rows.push({ name, phone, campaign: (c[campI] || "").trim() || undefined }); }
  return { rows, errors, total: lines.length - start, headerDetected };
};
export const parseCsv = (text: string) => parseCsvDetailed(text).rows;
export const toCsv = (rows: Record<string, unknown>[]) => { if (!rows.length) return ""; const keys = Object.keys(rows[0]); return [keys.join(","), ...rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n"); };
export const downloadCsv = (name: string, text: string) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" })); a.download = name; a.click(); };
