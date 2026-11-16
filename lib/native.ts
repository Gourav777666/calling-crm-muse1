// Native bridge: APK (Capacitor/WebView) me direct SIM call dialpad khole bina; web/PWA me tel: fallback.
// Sach: browser se direct SIM call possible nahi hai - direct call sirf APK native bridge se hoga.
declare global { interface Window { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: Record<string, any> }; AndroidBridge?: { directCall?: (phone: string) => void; dial?: (phone: string) => void; startRecording?: () => void; fetchLatestRecording?: () => Promise<{ name: string; url: string } | null> } } }
export const isNative = () => typeof window !== "undefined" && (!!window.AndroidBridge || !!window.Capacitor?.isNativePlatform?.());
export const dialNative = (phone: string): "native" | "tel" => {
  const clean = phone.replace(/\s/g, "");
  if (window.AndroidBridge?.directCall) { window.AndroidBridge.directCall(clean); return "native"; } // ACTION_CALL, no dialpad
  if (window.Capacitor?.Plugins?.CallPlugin) { window.Capacitor.Plugins.CallPlugin.directCall({ phone: clean }); return "native"; }
  window.location.href = `tel:${clean}`; return "tel"; // web fallback
};
export const NATIVE_PERMISSIONS = ["CALL_PHONE", "READ_PHONE_STATE", "READ_MEDIA_AUDIO", "RECORD_AUDIO"] as const;
// Auto-recording: native side har call par recording on rakhta hai jahan OS support kare; yaha latest file fetch hoti hai.
// OS block kare to null milega - UI graceful note dikhayegi, web par manual upload rahega.
export const startAutoRecording = () => { try { window.AndroidBridge?.startRecording?.(); window.Capacitor?.Plugins?.CallRecorder?.start?.(); } catch {} };
export const fetchLatestRecording = async (): Promise<{ name: string; url: string } | null> => { try { return await window.AndroidBridge?.fetchLatestRecording?.() || await window.Capacitor?.Plugins?.CallRecorder?.fetchLatest?.() || null; } catch { return null; } };
