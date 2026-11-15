// Capacitor / WebView bridge placeholders - real native plugin replaces these in APK
declare global { interface Window { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: Record<string, any> }; AndroidBridge?: { dial?: (phone: string) => void; getLatestRecording?: () => Promise<string> } } }
export const isNative = () => typeof window !== "undefined" && !!window.Capacitor?.isNativePlatform?.();
export const dialNative = (phone: string) => {
  if (window.AndroidBridge?.dial) return window.AndroidBridge.dial(phone); // APK WebView bridge: SIM call
  if (window.Capacitor?.Plugins?.CallPlugin) return window.Capacitor.Plugins.CallPlugin.dial({ phone }); // Capacitor plugin
  window.location.href = `tel:${phone}`; // Web fallback: native tel: intent
};
export const NATIVE_PERMISSIONS = ["CALL_PHONE", "READ_PHONE_STATE", "READ_MEDIA_AUDIO", "RECORD_AUDIO"] as const;
// Recording sync hook: APK bridge returns latest file from call-recording dir; web fallback = file picker in UI
export const fetchLatestRecording = async (): Promise<File | null> => { try { return (await window.AndroidBridge?.getLatestRecording?.()) as unknown as File || null; } catch { return null; } };
