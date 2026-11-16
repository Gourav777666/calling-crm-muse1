import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { ensureSeed, findUserById, publicUser } from "@/lib/db";
export async function GET() { await ensureSeed(); const s = await getSession(); if (!s) return NextResponse.json(null, { status: 401 }); const u = await findUserById(s.userId); return NextResponse.json(u ? publicUser(u) : null); }
