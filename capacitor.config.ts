import type { CapacitorConfig } from "@capacitor/cli";
// App live Vercel URL load karti hai - web update = app update, alag se APK baar-baar nahi banana padta
const config: CapacitorConfig = { appId: "com.callingcrm.app", appName: "Calling CRM", webDir: "public", server: { url: "https://calling-crm-muse1-nine.vercel.app", cleartext: false } };
export default config;
