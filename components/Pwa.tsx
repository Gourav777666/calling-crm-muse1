"use client"; import { useEffect } from "react"; import { applyTheme } from "@/lib/theme";
export default function Pwa() { useEffect(() => { applyTheme(localStorage.getItem("theme") || "light"); if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {}); }, []); return null; }
