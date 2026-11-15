// Offline sync queue: dispositions cached in localStorage, auto-synced on reconnect
const KEY = "crm-offline-queue";
export type Queued = { body: Record<string, unknown>; at: number };
export const queueOffline = (body: Record<string, unknown>) => { const q: Queued[] = JSON.parse(localStorage.getItem(KEY) || "[]"); q.push({ body, at: Date.now() }); localStorage.setItem(KEY, JSON.stringify(q)); };
export const syncOffline = async () => { const q: Queued[] = JSON.parse(localStorage.getItem(KEY) || "[]"); const left: Queued[] = []; for (const item of q) { try { const r = await fetch("/api/calls", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item.body) }); if (!r.ok) left.push(item); } catch { left.push(item); } } localStorage.setItem(KEY, JSON.stringify(left)); return q.length - left.length; };
