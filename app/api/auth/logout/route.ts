import { NextResponse } from "next/server";
import { db } from "@/lib/db"; import { getSession } from "@/lib/auth";
const clear = async (r: NextResponse) => { const s = await getSession(); const u = db.users.find(x => x.id === s?.userId); if (u) { u.logoutAt = Date.now(); u.presence = "Offline"; } r.cookies.set("session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) }); return r; };
export async function POST() { return clear(NextResponse.json({ ok: true })); }
// GET: seedha link se logout + /login redirect - JS/hydration fail ho tab bhi kaam karega (bulletproof)
export async function GET(req: Request) { return clear(NextResponse.redirect(new URL("/login", req.url))); }
