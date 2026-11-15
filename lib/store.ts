import type { Lead, Status } from "./types";
let leads: Lead[] = [];
export const getLeads = () => leads;
export const addLead = (name: string, phone: string, note = ""): Lead => {
  const lead: Lead = { id: crypto.randomUUID(), name, phone, status: "New", note, createdAt: Date.now() };
  leads = [lead, ...leads]; return lead;
};
export const updateStatus = (id: string, status: Status) => { leads = leads.map(l => l.id === id ? { ...l, status } : l); };
export const deleteLead = (id: string) => { leads = leads.filter(l => l.id !== id); };
