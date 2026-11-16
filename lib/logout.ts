export const doLogout = async () => { try { await fetch("/api/auth/logout", { method: "POST" }); } catch {} location.replace("/login"); };
