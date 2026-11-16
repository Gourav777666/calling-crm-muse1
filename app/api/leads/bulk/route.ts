import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { ensureSeed, listUsers, createLead, updateLead, leadPhoneExists, assignPatch, pickCaller, countLeadsByCaller, newId } from "@/lib/db"; import { cleanPhone } from "@/lib/csv";
// Bulk upload + duplicate detection + load-balanced round-robin / ek caller / pool + caller-wise breakdown
export async function POST(req: Request) {
  await ensureSeed(); const s = await getSession(); if (s?.role !== "admin") return NextResponse.json({}, { status: 403 });
  const { leads, mode, assignedTo, defaultCampaign } = await req.json() as { leads: { name: string; phone: string; campaign?: string }[]; mode: "round-robin" | "manual" | "none"; assignedTo?: string; defaultCampaign?: string };
  const users = await listUsers(); const callers = users.filter(u => u.role === "caller" && u.status === "active"); const counts = await countLeadsByCaller(); let added = 0, dup = 0; const per: Record<string, number> = {}; let unassigned = 0; const seen = new Set<string>();
  for (const r of leads || []) { const phone = cleanPhone(r.phone) || r.phone.replace(/\D/g, ""); if (!phone || seen.has(phone) || await leadPhoneExists(phone)) { dup++; continue; } seen.add(phone);
    const lead = await createLead({ id: newId(), name: r.name, phone, campaign: r.campaign || defaultCampaign || "General", status: "New", source: "Admin", createdAt: Date.now(), history: [{ at: Date.now(), by: s.name, action: "created" }] });
    if (mode === "round-robin" && callers.length) { const id = pickCaller(callers, counts)!; await updateLead(lead.id, assignPatch(lead, id, s.name, "round-robin", users)); per[id] = (per[id] || 0) + 1; }
    else if (mode === "manual" && assignedTo) { await updateLead(lead.id, assignPatch(lead, assignedTo, s.name, "assigned", users)); per[assignedTo] = (per[assignedTo] || 0) + 1; }
    else unassigned++;
    added++; }
  const breakdown = Object.entries(per).map(([id, count]) => ({ caller: users.find(u => u.id === id)?.name || id, count }));
  return NextResponse.json({ added, duplicates: dup, breakdown, unassigned });
}
