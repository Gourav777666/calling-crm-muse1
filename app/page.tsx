"use client";
import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Stats from "@/components/Stats";
import LeadForm from "@/components/LeadForm";
import LeadList from "@/components/LeadList";
import type { Lead } from "@/lib/types";
export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const load = useCallback(async () => { const r = await fetch("/api/leads"); setLeads(await r.json()); }, []);
  useEffect(() => { load(); }, [load]);
  return <main style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}><Header /><Stats leads={leads} /><LeadForm onAdd={load} /><div style={{ height: 16 }} /><LeadList leads={leads} onChange={load} /></main>;
}
