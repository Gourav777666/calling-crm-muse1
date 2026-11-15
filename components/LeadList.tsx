"use client";
import type { Lead } from "@/lib/types";
import LeadItem from "./LeadItem";
export default function LeadList({ leads, onChange }: { leads: Lead[]; onChange: () => void }) {
  if (!leads.length) return <p style={{ color: "#888", textAlign: "center", padding: 24 }}>Abhi koi lead nahi hai. Upar se add karo.</p>;
  return <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>{leads.map(l => <LeadItem key={l.id} lead={l} onChange={onChange} />)}</ul>;
}
