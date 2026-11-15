"use client";
export default function ThemeToggle() { const flip = () => { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; localStorage.setItem("theme", next); }; return <button className="ghost" onClick={flip}>Theme</button>; }
