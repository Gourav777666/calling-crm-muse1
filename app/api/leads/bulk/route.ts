import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db, newId } from "@/lib/db";
// Bulk upload + duplicate detection + round-robin / manual distribution
export async function POST(req: Request) {
  const s = await getSession(); if (s?.role !== "admin") return NextResponse.json({}, { status: 403 });
  const { leads, mode, assignedTo } = await req.json() as { leads: { name: string; phone: string; campaign?: string }[]; mode: "round-robin" | "manual" | "none"; assignedTo?: string };
  const callers = db.users.filter(u => u.role === "caller" && u.status === "active"); let added = 0, dup = 0, i = 0;
  for (const r of leads || []) { const phone = r.phone.replace(/\D/g, ""); if (!phone || db.leads.some(l => l.phone === phone)) { dup++; continue; } const to = mode === "round-robin" && callers.length ? callers[i++ % callers.length].id : mode === "manual" ? assignedTo : undefined; db.leads.unshift({ id: newId(), name: r.name, phone, campaign: r.campaign || "General", status: "New", assignedTo: to, createdAt: Date.now() }); added++; }
  return NextResponse.json({ added, duplicates: dup });
}
