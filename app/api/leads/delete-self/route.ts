import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db } from "@/lib/db";
// SOFT delete sirf: lead caller ke view se hategi, admin ke paas lead + history hamesha rahegi. Hard delete ka koi rasta nahi hai.
export async function POST(req: Request) { const s = await getSession(); if (!s || s.role !== "caller") return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const { leadId } = await req.json(); const l = db.leads.find(x => x.id === leadId && x.assignedTo === s.userId); if (!l) return NextResponse.json({ error: "Not found" }, { status: 404 }); l.deletedByCallerAt = Date.now(); return NextResponse.json({ ok: true }); }
