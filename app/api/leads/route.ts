import { NextResponse } from "next/server";
import { getLeads, addLead, updateStatus, deleteLead } from "@/lib/store";
export async function GET() { return NextResponse.json(getLeads()); }
export async function POST(req: Request) {
  const { name, phone, note } = await req.json();
  if (!name?.trim() || !phone?.trim()) return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
  return NextResponse.json(addLead(name.trim(), phone.trim(), note?.trim() || ""), { status: 201 });
}
export async function PATCH(req: Request) {
  const { id, status } = await req.json(); updateStatus(id, status); return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  const { id } = await req.json(); deleteLead(id); return NextResponse.json({ ok: true });
}
