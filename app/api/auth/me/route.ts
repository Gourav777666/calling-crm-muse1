import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; import { db, publicUser } from "@/lib/db";
export async function GET() { const s = await getSession(); if (!s) return NextResponse.json(null, { status: 401 }); const u = db.users.find(x => x.id === s.userId); return NextResponse.json(u ? publicUser(u) : null); }
