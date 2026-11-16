import type { User, Lead, CallLog } from "./types";
import { hash } from "./auth";
// In-memory demo store (Vercel). Production: prisma/schema.prisma + Postgres - same shapes.
const uid = () => Math.random().toString(36).slice(2, 10);
const now = Date.now();
export const db: { users: User[]; leads: Lead[]; logs: CallLog[] } = {
  users: [
    { id: "u-admin", loginId: "admin", passwordHash: hash("admin123"), name: "Super Admin", role: "admin", status: "active", quota: 0, createdAt: now, presence: "Offline" },
    { id: "u-caller1", loginId: "caller1", passwordHash: hash("caller123"), name: "Caller One", role: "caller", status: "active", quota: 50, createdAt: now, presence: "Offline" },
    { id: "u-caller2", loginId: "caller2", passwordHash: hash("caller123"), name: "Caller Two", role: "caller", status: "active", quota: 50, createdAt: now, presence: "Offline" },
  ],
  leads: [
    { id: "l1", name: "Rahul Sharma", phone: "9876543210", campaign: "Diwali Offer", status: "New", assignedTo: "u-caller1", createdAt: now, history: [{ at: now, to: "u-caller1", toName: "Caller One", by: "Super Admin", action: "assigned" }] },
    { id: "l2", name: "Priya Singh", phone: "9812345678", campaign: "Diwali Offer", status: "New", assignedTo: "u-caller1", createdAt: now, history: [{ at: now, to: "u-caller1", toName: "Caller One", by: "Super Admin", action: "assigned" }] },
    { id: "l3", name: "Amit Verma", phone: "9998887776", campaign: "New Launch", status: "New", createdAt: now, history: [{ at: now, by: "Super Admin", action: "created" }] },
    { id: "l4", name: "Sneha Patil", phone: "9822011223", campaign: "New Launch", status: "New", createdAt: now, history: [{ at: now, by: "Super Admin", action: "created" }] },
    { id: "l5", name: "Vikram Rao", phone: "9810098100", campaign: "Diwali Offer", status: "New", createdAt: now, history: [{ at: now, by: "Super Admin", action: "created" }] },
  ],
  logs: [],
};
export const newId = uid;
export const publicUser = (u: User) => ({ id: u.id, loginId: u.loginId, name: u.name, role: u.role, status: u.status, quota: u.quota, presence: u.presence, loginAt: u.loginAt, lastSeen: u.lastSeen });
export const assignLead = (lead: Lead, to: string | undefined, by: string, action: "assigned" | "reassigned" | "round-robin" | "unassigned") => { lead.assignedTo = to || undefined; const t = db.users.find(u => u.id === to); lead.history = [...(lead.history || []), { at: Date.now(), to, toName: t?.name, by, action }]; };
// Load-balanced round-robin: hamesha sabse kam leads wale active caller ko do, taaki barabar bante
export const nextCallerId = (callers: User[]) => { let best = callers[0], min = Infinity; for (const c of callers) { const n = db.leads.filter(l => l.assignedTo === c.id).length; if (n < min) { min = n; best = c; } } return best?.id; };
