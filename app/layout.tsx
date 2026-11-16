import type { Metadata } from "next"; import "./globals.css"; import Pwa from "@/components/Pwa";
export const metadata: Metadata = { title: "Calling CRM", description: "Telecalling CRM", manifest: "/manifest.json" };
export const viewport = { viewportFit: "cover", themeColor: "#4A3222" } as const;
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Pwa />{children}</body></html>; }
