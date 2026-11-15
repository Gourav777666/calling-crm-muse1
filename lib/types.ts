export type Status = "New" | "Called" | "Interested" | "Follow-up" | "Not Interested";
export type Lead = { id: string; name: string; phone: string; status: Status; note: string; createdAt: number };
export const STATUSES: Status[] = ["New", "Called", "Interested", "Follow-up", "Not Interested"];
