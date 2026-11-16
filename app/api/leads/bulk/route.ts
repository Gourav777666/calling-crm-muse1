import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db, newId, nextCallerId, assignLead } from "@/lib/db"; import { cleanPhone } from "@/lib/csv";
// Bulk upload + duplicate detection + load-balanced round-robin / ek caller / pool + caller-wise breakdown
export async function POST(req: Request) {
  const s = await getSession(); if (s?.role !== "admin") return NextResponse.json({}, { status: 403 });
  const { leads, mode, assignedTo, defaultCampaign } = await req.json() as { leads: { name: string; phone: string; campaign?: string }[]; mode: "round-robin" | "manual" | "none"; assignedTo?: string; defaultCampaign?: string };
  const callers = db.users.filter(u => u.role === "caller" && u.status === "active"); let added = 0, dup = 0; const per: Record<string, number> = {}; let unassigned = 0;
  for (const r of leads || []) { const phone = cleanPhone(r.phone) || r.phone.replace(/\D/g, ""); if (!phone || db.leads.some(l => l.phone === phone)) { dup++; continue; } const lead = { id: newId(), name: r.name, phone, campaign: r.campaign || defaultCampaign || "General", status: "New" as const, assignedTo: undefined as string | undefined, createdAt: Date.now(), history: [] as any[] }; db.leads.unshift(lead);
    if (mode === "round-robin" && callers.length) { const id = nextCallerId(callers)!; assignLead(lead, id, s.name, "round-robin"); per[id] = (per[id] || 0) + 1; }
    else if (mode === "manual" && assignedTo) { assignLead(lead, assignedTo, s.name, "assigned"); per[assignedTo] = (per[assignedTo] || 0) + 1; }
    else { lead.history = [{ at: Date.now(), by: s.name, action: "created" }]; unassigned++; }
    added++; }
  const breakdown = Object.entries(per).map(([id, count]) => ({ caller: db.users.find(u => u.id === id)?.name || id, count }));
  return NextResponse.json({ added, duplicates: dup, breakdown, unassigned });
}
