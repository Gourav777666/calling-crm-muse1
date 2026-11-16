import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { ensureSeed, findLeadByPhone, createLead, createLog, listLogs, updateLead, newId } from "@/lib/db";
// Phone Sync: caller ke phone ki asal calls CRM me — lead match (ya contact naam se nayi lead), CallLog entry, stats update. Duplicate sync par duplicate entry nahi (±2 min window).
const norm = (p: string) => String(p || "").replace(/\D/g, "").slice(-10);
export async function POST(req: Request) { await ensureSeed(); const s = await getSession(); if (!s || s.role !== "caller") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { calls, contacts } = await req.json() as { calls: { phone: string; at: number; durationSec: number; type: number; name?: string }[]; contacts: { name: string; phone: string }[] };
  const cmap = new Map<string, string>(); for (const c of contacts || []) { const p = norm(c.phone); if (p && c.name) cmap.set(p, c.name); }
  const logs = await listLogs(); let synced = 0, skipped = 0, newLeads = 0;
  for (const c of [...(calls || [])].sort((a, b) => a.at - b.at)) { const phone = norm(c.phone); if (!phone) { skipped++; continue; }
    let lead = await findLeadByPhone(phone);
    if (!lead) { lead = await createLead({ id: newId(), name: c.name || cmap.get(phone) || phone, phone, campaign: "Phone Sync", status: "New", source: "Phone Sync", assignedTo: s.userId, createdAt: Date.now(), history: [{ at: Date.now(), to: s.userId, toName: s.name, by: s.name, action: "created" }] }); newLeads++; }
    if (logs.some(l => l.leadId === lead!.id && l.callerId === s.userId && Math.abs(l.createdAt - c.at) < 120000)) { skipped++; continue; }
    const answered = (c.durationSec || 0) > 0; const disposition = (answered ? "Phone Call" : "RNR") as any;
    const log = await createLog({ id: newId(), leadId: lead.id, callerId: s.userId, disposition, remarks: `Phone sync • ${c.type === 1 ? "Incoming" : c.type === 3 ? "Missed" : "Outgoing"} • ${c.durationSec || 0}s`, durationSec: c.durationSec || 0, createdAt: c.at });
    logs.unshift(log); synced++;
    await updateLead(lead.id, { attempts: (lead.attempts || 0) + 1, lastCallAt: c.at, lastDisposition: disposition, talked: answered ? true : lead.talked, status: lead.status === "New" && answered ? "Phone Call" as any : lead.status });
  }
  return NextResponse.json({ synced, skipped, newLeads }); }
