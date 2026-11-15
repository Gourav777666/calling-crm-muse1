import { createHash } from "crypto";
import { cookies } from "next/headers";
import type { Session } from "./types";
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const secret = process.env.AUTH_SECRET || "calling-crm-dev-secret";
const sign = (p: string) => createHash("sha256").update(p + secret).digest("hex").slice(0, 16);
export const encodeSession = (s: Session) => { const p = Buffer.from(JSON.stringify(s)).toString("base64url"); return `${p}.${sign(p)}`; };
export const decodeSession = (v?: string): Session | null => {
  if (!v) return null; const [p, sig] = v.split("."); if (!p || sig !== sign(p)) return null;
  try { return JSON.parse(Buffer.from(p, "base64url").toString()); } catch { return null; }
};
export async function getSession(): Promise<Session | null> { const c = await cookies(); return decodeSession(c.get("session")?.value); }
export async function requireRole(role?: "admin") { const s = await getSession(); if (!s || (role && s.role !== role)) return null; return s; }
