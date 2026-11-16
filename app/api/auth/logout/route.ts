import { NextResponse } from "next/server";
import { db } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function POST() { const s = await getSession(); const u = db.users.find(x => x.id === s?.userId); if (u) { u.logoutAt = Date.now(); u.presence = "Offline"; } const r = NextResponse.json({ ok: true }); r.cookies.set("session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) }); return r; }
