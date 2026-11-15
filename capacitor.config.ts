import type { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = { appId: "com.callingcrm.app", appName: "Calling CRM", webDir: "out", server: { url: process.env.CAP_URL, cleartext: false } };
export default config;
