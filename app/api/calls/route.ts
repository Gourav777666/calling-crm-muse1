import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db, newId } from "@/lib/db";
export async function GET(req: Request) { const s = await getSession(); if (!s) return NextResponse.json([], { status: 401 }); const q = new URL(req.url).searchParams; let logs = s.role === "admin" ? db.logs : db.logs.filter(l => l.callerId === s.userId); if (q.get("caller")) logs = logs.filter(l => l.callerId === q.get("caller")); if (q.get("from")) logs = logs.filter(l => l.createdAt >= Number(q.get("from"))); if (q.get("to")) logs = logs.filter(l => l.createdAt <= Number(q.get("to"))); return NextResponse.json(logs.map(l => ({ ...l, lead: db.leads.find(x => x.id === l.leadId), caller: db.users.find(x => x.id === l.callerId)?.name }))); }
export async function POST(req: Request) {
  const s = await getSession(); if (!s) return NextResponse.json({}, { status: 401 });
  const { leadId, disposition, remarks, durationSec, recordingName, recordingUrl, callbackAt } = await req.json();
  const log = { id: newId(), leadId, callerId: s.userId, disposition, remarks: remarks || "", durationSec: durationSec || 0, recordingName, recordingUrl, callbackAt: callbackAt || undefined, createdAt: Date.now() };
  db.logs.unshift(log); const lead = db.leads.find(l => l.id === leadId); if (lead) { lead.status = disposition; lead.callbackAt = callbackAt || undefined; lead.attempts = (lead.attempts || 0) + 1; lead.lastCallAt = log.createdAt; lead.lastDisposition = disposition; lead.talked = ["Interested", "Not Interested", "Call Back Later", "Deal Closed"].includes(disposition); }
  return NextResponse.json(log, { status: 201 });
}
