// Theme registry: teeno themes ek jagah - naam, dataset value, theme-color, preview dots
export const THEMES = [
  { id: "light", name: "Brown Cream", color: "#4A3222", dots: ["#FAF5EC", "#6F4E37", "#C08552"] },
  { id: "dark", name: "Espresso Brown", color: "#1E150F", dots: ["#1E150F", "#A9744F", "#C08552"] },
  { id: "navy", name: "Navy Charcoal", color: "#12263F", dots: ["#0E1116", "#2E5FA3", "#4A7FC1"] },
  { id: "standard", name: "Standard Light", color: "#FFFFFF", dots: ["#FFFFFF", "#2563EB", "#7C3AED"] },
] as const;
export type ThemeId = typeof THEMES[number]["id"];
export const applyTheme = (id: string) => { const t = THEMES.find(x => x.id === id) || THEMES[0]; document.documentElement.dataset.theme = t.id; localStorage.setItem("theme", t.id); const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t.color); };
