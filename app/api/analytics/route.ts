import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { ensureSeed, listLogs, listLeads } from "@/lib/db";
// Admin = poori team, Caller = sirf apna data. Hourly graph: total/connected/notConnected/missed + durations
export async function GET(req: Request) {
  await ensureSeed(); const s = await getSession(); if (!s) return NextResponse.json({}, { status: 401 });
  const q = new URL(req.url).searchParams; let logs = await listLogs();
  if (s.role === "caller") logs = logs.filter(l => l.callerId === s.userId);
  if (q.get("caller")) logs = logs.filter(l => l.callerId === q.get("caller")); if (q.get("from")) logs = logs.filter(l => l.createdAt >= Number(q.get("from"))); if (q.get("to")) logs = logs.filter(l => l.createdAt <= Number(q.get("to")));
  if (q.get("campaign")) { const leads = await listLeads(); logs = logs.filter(l => leads.find(x => x.id === l.leadId)?.campaign === q.get("campaign")); }
  const connected = logs.filter(l => !["RNR", "Switched Off", "Wrong Number"].includes(l.disposition));
  const talk = logs.reduce((a, l) => a + l.durationSec, 0);
  const cat = (d: string) => d === "Wrong Number" ? "missed" : ["RNR", "Switched Off"].includes(d) ? "notConnected" : "connected";
  const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, total: 0, connected: 0, notConnected: 0, missed: 0, durTotal: 0, durConnected: 0, durNotConnected: 0, durMissed: 0 }));
  for (const l of logs) { const b = hourly[new Date(l.createdAt).getHours()]; b.total++; b.durTotal += l.durationSec; const c = cat(l.disposition); b[c]++; b[c === "connected" ? "durConnected" : c === "notConnected" ? "durNotConnected" : "durMissed"] += l.durationSec; }
  return NextResponse.json({ total: logs.length, connected: connected.length, unanswered: logs.length - connected.length, talkTime: talk, acd: connected.length ? Math.round(talk / connected.length) : 0, hourly, funnel: { interested: logs.filter(l => l.disposition === "Interested").length, callback: logs.filter(l => l.disposition === "Call Back Later").length, closed: logs.filter(l => l.disposition === "Deal Closed").length, notInterested: logs.filter(l => l.disposition === "Not Interested").length } });
}
