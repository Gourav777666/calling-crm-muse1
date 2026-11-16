import type { CallLog } from "./types";
export const TALKED = ["Interested", "Not Interested", "Call Back Later", "Deal Closed"];
export const NOT_TALKED = ["RNR", "Switched Off", "Wrong Number", "Busy"];
export type LeadStats = { attempts: number; lastCallAt?: number; lastDisposition?: string; talked: boolean | null }; // talked: true=baat hui, false=nahi hui, null=kabhi call nahi
export const leadStats = (leadId: string, logs: CallLog[]): LeadStats => { const ls = logs.filter(l => l.leadId === leadId).sort((a, b) => b.createdAt - a.createdAt); const last = ls[0]; if (!last) return { attempts: 0, talked: null }; return { attempts: ls.length, lastCallAt: last.createdAt, lastDisposition: last.disposition, talked: TALKED.includes(last.disposition) }; };
export const relTime = (t?: number) => { if (!t) return ""; const d = new Date(t); const today = new Date().toDateString() === d.toDateString(); const yest = new Date(Date.now() - 86400000).toDateString() === d.toDateString(); const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); return today ? `aaj ${time}` : yest ? `kal ${time}` : `${d.toLocaleDateString()} ${time}`; };
