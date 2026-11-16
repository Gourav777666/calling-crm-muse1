const COLORS = ["#6F4E37", "#A9744F", "#C08552", "#8A5A3B", "#B97A1F", "#7D5A3C", "#96684A"];
export const campaignColor = (name: string) => COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
export const initials = (name: string) => name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
