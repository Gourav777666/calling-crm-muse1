import type { User, Lead, CallLog } from "./types";
import { hash } from "./auth";
// In-memory store for demo/Vercel without DB. Production: use prisma/schema.prisma with Postgres - same shapes.
const uid = () => Math.random().toString(36).slice(2, 10);
export const db: { users: User[]; leads: Lead[]; logs: CallLog[] } = {
  users: [
    { id: "u-admin", loginId: "admin", passwordHash: hash("admin123"), name: "Super Admin", role: "admin", status: "active", quota: 0, createdAt: Date.now(), presence: "Offline" },
    { id: "u-caller1", loginId: "caller1", passwordHash: hash("caller123"), name: "Caller One", role: "caller", status: "active", quota: 50, createdAt: Date.now(), presence: "Offline" },
  ],
  leads: [
    { id: "l1", name: "Rahul Sharma", phone: "9876543210", campaign: "Diwali Offer", status: "New", assignedTo: "u-caller1", createdAt: Date.now() },
    { id: "l2", name: "Priya Singh", phone: "9812345678", campaign: "Diwali Offer", status: "New", assignedTo: "u-caller1", createdAt: Date.now() },
    { id: "l3", name: "Amit Verma", phone: "9998887776", campaign: "New Launch", status: "New", createdAt: Date.now() },
  ],
  logs: [],
};
export const newId = uid;
export const publicUser = (u: User) => ({ id: u.id, loginId: u.loginId, name: u.name, role: u.role, status: u.status, quota: u.quota, presence: u.presence, loginAt: u.loginAt, lastSeen: u.lastSeen });
