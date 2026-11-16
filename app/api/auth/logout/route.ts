import { NextResponse } from "next/server";
import { findUserById, updateUser } from "@/lib/db"; import { getSession } from "@/lib/auth";
const clear = async (r: NextResponse) => { const s = await getSession(); const u = await findUserById(s?.userId); if (u) await updateUser(u.id, { logoutAt: Date.now(), presence: "Offline" }); r.cookies.set("session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) }); return r; };
export async function POST() { return clear(NextResponse.json({ ok: true })); }
export async function GET(req: Request) { return clear(NextResponse.redirect(new URL("/login", req.url))); }
