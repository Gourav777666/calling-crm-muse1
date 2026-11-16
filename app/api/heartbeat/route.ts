import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { findUserById, updateUser } from "@/lib/db";
export async function POST(req: Request) { const s = await getSession(); if (!s) return NextResponse.json({}, { status: 401 }); const { presence } = await req.json().catch(() => ({})); const u = await findUserById(s.userId); if (u) await updateUser(u.id, { lastSeen: Date.now(), presence: presence || (u.presence === "Offline" ? "Online" : u.presence) }); return NextResponse.json({ ok: true }); }
