"use client"; import { useEffect } from "react";
export default function Pwa() { useEffect(() => { document.documentElement.dataset.theme = localStorage.getItem("theme") || "light"; if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {}); }, []); return null; }
