import type { Metadata } from "next"; import "./globals.css"; import Pwa from "@/components/Pwa";
export const metadata: Metadata = { title: "Calling CRM", description: "Telecalling CRM", manifest: "/manifest.json" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Pwa />{children}</body></html>; }
