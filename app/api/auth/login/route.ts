import { NextResponse } from "next/server";
import { ensureSeed, findUserByLogin, updateUser } from "@/lib/db"; import { hash, encodeSession } from "@/lib/auth";
export async function POST(req: Request) {
  await ensureSeed();
  const { loginId, password } = await req.json();
  const u = await findUserByLogin(loginId);
  if (!u || u.passwordHash !== hash(password || "")) return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  if (u.status === "suspended") return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  await updateUser(u.id, { loginAt: Date.now(), lastSeen: Date.now(), presence: "Online" });
  const res = NextResponse.json({ role: u.role, name: u.name });
  res.cookies.set("session", encodeSession({ userId: u.id, role: u.role, loginId: u.loginId, name: u.name }), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 });
  return res;
}
