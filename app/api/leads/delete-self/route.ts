import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { findLead, updateLead } from "@/lib/db";
// SOFT delete sirf: lead caller ke view se hategi, admin ke paas lead + history hamesha rahegi. Hard delete ka koi rasta nahi hai.
export async function POST(req: Request) { const s = await getSession(); if (!s || s.role !== "caller") return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const { leadId } = await req.json(); const l = await findLead(leadId); if (!l || l.assignedTo !== s.userId) return NextResponse.json({ error: "Not found" }, { status: 404 }); await updateLead(l.id, { deletedByCallerAt: Date.now() }); return NextResponse.json({ ok: true }); }
