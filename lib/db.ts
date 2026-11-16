import { prisma } from "./prisma";
import { hash } from "./auth";
import type { User, Lead, CallLog, Assignment } from "./types";
// Prisma/Postgres data layer — saari queries yahin se. Dates DB me DateTime, app me epoch ms.
export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const publicUser = (u: User) => ({ id: u.id, loginId: u.loginId, name: u.name, role: u.role, status: u.status, quota: u.quota, presence: u.presence, loginAt: u.loginAt, lastSeen: u.lastSeen });
const ms = (d?: Date | null) => d ? d.getTime() : undefined;
const dt = (n?: number) => n ? new Date(n) : null;
const toUser = (r: any): User => ({ id: r.id, loginId: r.loginId, passwordHash: r.passwordHash, name: r.name, role: r.role, status: r.status, quota: r.quota, presence: r.presence, loginAt: ms(r.loginAt), logoutAt: ms(r.logoutAt), lastSeen: ms(r.lastSeen), createdAt: r.createdAt.getTime() });
const toLead = (r: any): Lead => ({ id: r.id, name: r.name, phone: r.phone, campaign: r.campaign, status: r.status, assignedTo: r.assignedTo || undefined, callbackAt: ms(r.callbackAt), source: r.source, uploadedBy: r.uploadedById || undefined, uploadedByName: r.uploadedByName || undefined, deletedByCallerAt: ms(r.deletedByCallerAt), attempts: r.attempts, lastCallAt: ms(r.lastCallAt), lastDisposition: r.lastDisposition || undefined, talked: r.talked, history: (r.history || []) as Assignment[], createdAt: r.createdAt.getTime() });
const toLog = (r: any): CallLog => ({ id: r.id, leadId: r.leadId, callerId: r.callerId, disposition: r.disposition, remarks: r.remarks, durationSec: r.durationSec, recordingName: r.recordingName || undefined, recordingUrl: r.recordingUrl || undefined, callbackAt: ms(r.callbackAt), createdAt: r.createdAt.getTime() });
const userData = (u: Partial<User>) => ({ ...(u.loginId !== undefined && { loginId: u.loginId }), ...(u.passwordHash !== undefined && { passwordHash: u.passwordHash }), ...(u.name !== undefined && { name: u.name }), ...(u.role !== undefined && { role: u.role }), ...(u.status !== undefined && { status: u.status }), ...(u.quota !== undefined && { quota: u.quota }), ...(u.presence !== undefined && { presence: u.presence }), ...(u.loginAt !== undefined && { loginAt: dt(u.loginAt) }), ...(u.logoutAt !== undefined && { logoutAt: dt(u.logoutAt) }), ...(u.lastSeen !== undefined && { lastSeen: dt(u.lastSeen) }) });
const leadData = (l: Partial<Lead>) => ({ ...(l.name !== undefined && { name: l.name }), ...(l.phone !== undefined && { phone: l.phone }), ...(l.campaign !== undefined && { campaign: l.campaign }), ...(l.status !== undefined && { status: l.status }), ...("assignedTo" in l && { assignedTo: l.assignedTo || null }), ...("callbackAt" in l && { callbackAt: dt(l.callbackAt) }), ...(l.source !== undefined && { source: l.source }), ...(l.uploadedBy !== undefined && { uploadedById: l.uploadedBy || null }), ...(l.uploadedByName !== undefined && { uploadedByName: l.uploadedByName || null }), ...("deletedByCallerAt" in l && { deletedByCallerAt: dt(l.deletedByCallerAt) }), ...(l.attempts !== undefined && { attempts: l.attempts }), ...("lastCallAt" in l && { lastCallAt: dt(l.lastCallAt) }), ...(l.lastDisposition !== undefined && { lastDisposition: l.lastDisposition || null }), ...(l.talked !== undefined && { talked: l.talked }), ...(l.history !== undefined && { history: l.history as any }) });
// Seed: pehli baar khali DB me demo accounts + sample leads (ek hi baar, count check se)
let seeded = false;
export async function ensureSeed() { if (seeded) return; seeded = true; try { if (await prisma.user.count() > 0) return; const now = new Date();
  await prisma.user.createMany({ data: [
    { id: "u-admin", loginId: "admin", passwordHash: hash("admin123"), name: "Super Admin", role: "admin", quota: 0, createdAt: now },
    { id: "u-caller1", loginId: "caller1", passwordHash: hash("caller123"), name: "Caller One", role: "caller", createdAt: now },
    { id: "u-caller2", loginId: "caller2", passwordHash: hash("caller123"), name: "Caller Two", role: "caller", createdAt: now } ] });
  const h = (to: string, toName: string) => [{ at: Date.now(), to, toName, by: "Super Admin", action: "assigned" }];
  await prisma.lead.createMany({ data: [
    { id: "l1", name: "Rahul Sharma", phone: "9876543210", campaign: "Diwali Offer", assignedTo: "u-caller1", history: h("u-caller1", "Caller One") as any, createdAt: now },
    { id: "l2", name: "Priya Singh", phone: "9812345678", campaign: "Diwali Offer", assignedTo: "u-caller1", history: h("u-caller1", "Caller One") as any, createdAt: now },
    { id: "l3", name: "Amit Verma", phone: "9998887776", campaign: "New Launch", history: [{ at: Date.now(), by: "Super Admin", action: "created" }] as any, createdAt: now },
    { id: "l4", name: "Sneha Patil", phone: "9822011223", campaign: "New Launch", history: [{ at: Date.now(), by: "Super Admin", action: "created" }] as any, createdAt: now },
    { id: "l5", name: "Vikram Rao", phone: "9810098100", campaign: "Diwali Offer", history: [{ at: Date.now(), by: "Super Admin", action: "created" }] as any, createdAt: now } ] });
 } catch { /* DB abhi ready nahi — agli request par phir koshish */ seeded = false; } }
// Users
export const listUsers = async () => (await prisma.user.findMany({ orderBy: { createdAt: "asc" } })).map(toUser);
export const findUserById = async (id?: string | null) => { if (!id) return null; const r = await prisma.user.findUnique({ where: { id } }); return r ? toUser(r) : null; };
export const findUserByLogin = async (loginId: string) => { const r = await prisma.user.findUnique({ where: { loginId } }); return r ? toUser(r) : null; };
export const createUser = async (u: User) => toUser(await prisma.user.create({ data: { id: u.id, loginId: u.loginId, passwordHash: u.passwordHash, name: u.name, role: u.role, status: u.status, quota: u.quota, presence: u.presence, createdAt: new Date(u.createdAt) } }));
export const updateUser = async (id: string, patch: Partial<User>) => { await prisma.user.update({ where: { id }, data: userData(patch) }); };
export const deleteUser = async (id: string) => { await prisma.user.delete({ where: { id } }); };
// Leads
export const listLeads = async () => (await prisma.lead.findMany({ orderBy: { createdAt: "desc" } })).map(toLead);
export const findLead = async (id: string) => { const r = await prisma.lead.findUnique({ where: { id } }); return r ? toLead(r) : null; };
export const findLeadByPhone = async (phone: string) => { const r = await prisma.lead.findUnique({ where: { phone } }); return r ? toLead(r) : null; };
export const leadPhoneExists = async (phone: string) => (await prisma.lead.count({ where: { phone } })) > 0;
export const createLead = async (l: Lead) => toLead(await prisma.lead.create({ data: { id: l.id, name: l.name, phone: l.phone, campaign: l.campaign, status: l.status, assignedTo: l.assignedTo || null, callbackAt: dt(l.callbackAt), source: l.source || "Admin", uploadedById: l.uploadedBy || null, uploadedByName: l.uploadedByName || null, attempts: l.attempts || 0, talked: !!l.talked, history: (l.history || []) as any, createdAt: new Date(l.createdAt) } }));
export const updateLead = async (id: string, patch: Partial<Lead>) => { await prisma.lead.update({ where: { id }, data: leadData(patch) }); };
export const deleteLead = async (id: string) => { await prisma.lead.delete({ where: { id } }); };
export const countLeadsByCaller = async () => { const rows = await prisma.lead.groupBy({ by: ["assignedTo"], _count: true }); const out: Record<string, number> = {}; for (const r of rows) if (r.assignedTo) out[r.assignedTo] = r._count; return out; };
// Logs
export const listLogs = async () => (await prisma.callLog.findMany({ orderBy: { createdAt: "desc" } })).map(toLog);
export const createLog = async (l: CallLog) => toLog(await prisma.callLog.create({ data: { id: l.id, leadId: l.leadId, callerId: l.callerId, disposition: l.disposition, remarks: l.remarks, durationSec: l.durationSec, recordingName: l.recordingName || null, recordingUrl: l.recordingUrl || null, callbackAt: dt(l.callbackAt), createdAt: new Date(l.createdAt) } }));
// Assignment helpers (pure): history patch banata hai, save route karega
export const assignPatch = (lead: Lead, to: string | undefined, by: string, action: Assignment["action"], users: User[]): Partial<Lead> => ({ assignedTo: to, history: [...(lead.history || []), { at: Date.now(), to, toName: users.find(u => u.id === to)?.name, by, action }] });
export const pickCaller = (callers: User[], counts: Record<string, number>) => { let best = callers[0], min = Infinity; for (const c of callers) { const n = counts[c.id] || 0; if (n < min) { min = n; best = c; } } if (best) counts[best.id] = (counts[best.id] || 0) + 1; return best?.id; };
