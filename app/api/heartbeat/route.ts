import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db } from "@/lib/db";
export async function POST(req: Request) { const s = await getSession(); if (!s) return NextResponse.json({}, { status: 401 }); const { presence } = await req.json().catch(() => ({})); const u = db.users.find(x => x.id === s.userId); if (u) { u.lastSeen = Date.now(); if (presence) u.presence = presence; else if (u.presence === "Offline") u.presence = "Online"; } return NextResponse.json({ ok: true }); }
