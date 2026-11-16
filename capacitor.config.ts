import type { CapacitorConfig } from "@capacitor/cli";
// App live Vercel URL load karti hai - web update = app update, alag se APK baar-baar nahi banana padta
const config = { appId: "com.callingcrm.app", appName: "Calling CRM", webDir: "public", server: { url: "https://calling-crm-muse1-nine.vercel.app", cleartext: false }, android: { adjustMarginsForEdgeToEdge: "force" } } as CapacitorConfig; // force: Capacitor khud WebView ko system bars ke andar margins deta hai — upar/neeche overlap ka pakka ilaaj
export default config;
