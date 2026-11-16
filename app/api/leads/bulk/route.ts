import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db, newId, nextCallerId, assignLead } from "@/lib/db";
// Bulk upload + duplicate detection + load-balanced round-robin (sirf active callers, barabar) / manual / pool
export async function POST(req: Request) {
  const s = await getSession(); if (s?.role !== "admin") return NextResponse.json({}, { status: 403 });
  const { leads, mode, assignedTo } = await req.json() as { leads: { name: string; phone: string; campaign?: string }[]; mode: "round-robin" | "manual" | "none"; assignedTo?: string };
  const callers = db.users.filter(u => u.role === "caller" && u.status === "active"); let added = 0, dup = 0;
  for (const r of leads || []) { const phone = r.phone.replace(/\D/g, ""); if (!phone || db.leads.some(l => l.phone === phone)) { dup++; continue; } const lead = { id: newId(), name: r.name, phone, campaign: r.campaign || "General", status: "New" as const, assignedTo: undefined as string | undefined, createdAt: Date.now(), history: [] as any[] }; db.leads.unshift(lead); if (mode === "round-robin" && callers.length) assignLead(lead, nextCallerId(callers), s.name, "round-robin"); else if (mode === "manual" && assignedTo) assignLead(lead, assignedTo, s.name, "assigned"); else lead.history = [{ at: Date.now(), by: s.name, action: "created" }]; added++; }
  return NextResponse.json({ added, duplicates: dup });
}
