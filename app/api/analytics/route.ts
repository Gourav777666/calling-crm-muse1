import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth"; import { db } from "@/lib/db";
export async function GET(req: Request) {
  if (!await requireRole("admin")) return NextResponse.json({}, { status: 403 });
  const q = new URL(req.url).searchParams; let logs = db.logs;
  if (q.get("caller")) logs = logs.filter(l => l.callerId === q.get("caller")); if (q.get("from")) logs = logs.filter(l => l.createdAt >= Number(q.get("from"))); if (q.get("to")) logs = logs.filter(l => l.createdAt <= Number(q.get("to")));
  if (q.get("campaign")) logs = logs.filter(l => db.leads.find(x => x.id === l.leadId)?.campaign === q.get("campaign"));
  const connected = logs.filter(l => !["RNR", "Switched Off", "Wrong Number"].includes(l.disposition));
  const talk = logs.reduce((a, l) => a + l.durationSec, 0);
  return NextResponse.json({ total: logs.length, connected: connected.length, unanswered: logs.length - connected.length, talkTime: talk, acd: connected.length ? Math.round(talk / connected.length) : 0, funnel: { interested: logs.filter(l => l.disposition === "Interested").length, callback: logs.filter(l => l.disposition === "Call Back Later").length, closed: logs.filter(l => l.disposition === "Deal Closed").length, notInterested: logs.filter(l => l.disposition === "Not Interested").length } });
}
