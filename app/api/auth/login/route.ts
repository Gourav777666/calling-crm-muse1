import { NextResponse } from "next/server";
import { db } from "@/lib/db"; import { hash, encodeSession } from "@/lib/auth";
export async function POST(req: Request) {
  const { loginId, password } = await req.json();
  const u = db.users.find(x => x.loginId === loginId && x.passwordHash === hash(password || ""));
  if (!u) return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  if (u.status === "suspended") return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  u.loginAt = Date.now(); u.lastSeen = Date.now(); u.presence = "Online";
  const res = NextResponse.json({ role: u.role, name: u.name });
  res.cookies.set("session", encodeSession({ userId: u.id, role: u.role, loginId: u.loginId, name: u.name }), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 });
  return res;
}
