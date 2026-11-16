import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db } from "@/lib/db";
// Caller/admin: bina call kiye quick callback set karo
export async function POST(req: Request) { const s = await getSession(); if (!s) return NextResponse.json({}, { status: 401 }); const { leadId, callbackAt } = await req.json(); const lead = db.leads.find(l => l.id === leadId); if (!lead || (s.role !== "admin" && lead.assignedTo !== s.userId)) return NextResponse.json({}, { status: 404 }); lead.callbackAt = callbackAt; return NextResponse.json({ ok: true }); }
