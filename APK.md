# Android APK with Capacitor — Step by Step
1. npm install && npm run build
2. npm i @capacitor/core @capacitor/cli @capacitor/android
3. npx cap init "Calling CRM" com.callingcrm.app --web-dir=out  (capacitor.config.ts already included; set server.url to your Vercel URL for live API mode, or use `next export` for static)
   For live CRM (recommended): in capacitor.config.ts keep server.url = "https://your-vercel-url.vercel.app" so WebView loads the hosted app.
4. npx cap add android
5. In android/app/src/main/AndroidManifest.xml add permissions:
   CALL_PHONE, READ_PHONE_STATE, READ_MEDIA_AUDIO, RECORD_AUDIO, INTERNET
6. Native bridge: implement a Capacitor plugin / WebView AndroidBridge with:
   - dial(phone): Intent.ACTION_CALL with tel: URI via SIM
   - getLatestRecording(): scan /storage/emulated/0/CallRecordings (or OEM dir) for latest .mp3/.m4a/.amr, return/upload it to the lead log via /api/calls recordingUrl flow
   The web side hooks are already in lib/native.ts (dialNative, fetchLatestRecording, NATIVE_PERMISSIONS).
7. npx cap sync android
8. Open Android Studio: npx cap open android -> Build > Build APK(s), test on device with SIM.

## v3: Direct Call Bridge (dialpad khole bina) + Auto Recording
Web code (lib/native.ts) pehle native bridge dhoondhta hai, phir tel: fallback leta hai.
Android native side par ye bridge banao (MainActivity / Capacitor plugin):

```java
// AndroidBridge.directCall - ACTION_CALL se seedha call, dialpad UI nahi khulta
// Permission: CALL_PHONE (runtime permission pehle maango)
@JavascriptInterface public void directCall(String phone) {
  Intent i = new Intent(Intent.ACTION_CALL, Uri.parse("tel:" + phone));
  startActivity(i);
}
// startRecording: har call par device ka call-recording folder scan / recorder start
// (OnePlus/Samsung stock recorder support par auto file milti hai; kuch OEM/OS block karte hain)
// fetchLatestRecording: /storage/emulated/0/Recordings/Call recordings ki latest .mp3/.m4a/.amr file ka naam + file URL return karo
```
WebView me: webView.addJavascriptInterface(bridge, "AndroidBridge")
Capacitor me: isi logic ko "CallPlugin.directCall" + "CallRecorder.start/fetchLatest" plugin methods me rakho.
Sach: browser/PWA se direct SIM call aur auto-recording possible nahi hai — ye sirf APK native bridge se hoga, web par tel: + manual recording upload fallback hai.

## v3.1: Asli Android Project (Capacitor 7) — is repo me ready hai
- `android/` folder me pura native project hai. App live URL load karti hai (capacitor.config.ts > server.url), isliye web update = app update.
- Native plugin: `android/app/src/main/java/com/callingcrm/app/CallPlugin.java`
  - `directCall`: runtime CALL_PHONE permission → ACTION_CALL, dialpad khule bina seedha call. Web ka auto-dial session isi ko use karta hai.
  - `callEnded` event: call khatam hote hi web ko signal; app foreground me wapas aati hai aur disposition modal khulta hai.
  - `fetchLatest`: Samsung/MIUI/Realme aadi ke common call-recording folders scan karke latest .mp3/.m4a/.amr file call log ke saath attach karta hai. Jahan Android/OEM recording block kare (kuch Android 10+ devices, kuch OEM), wahan file nahi milegi — app graceful note dikhata hai, recording ka fake daava nahi hai. Phone ke stock recorder me call recording ON rakhna zaroori hai jahan available ho.
- Permissions (AndroidManifest + runtime): CALL_PHONE, READ_PHONE_STATE, READ_MEDIA_AUDIO, READ_EXTERNAL_STORAGE (purane Android ke liye), RECORD_AUDIO.
- Debug APK build: JDK 21 + Android SDK (platform 35, build-tools 35/34) ke saath `cd android && ./gradlew assembleDebug` → `android/app/build/outputs/apk/debug/app-debug.apk`
- Install: APK file phone me bhejo → tap karo → "Install unknown apps" allow karo → Install. Pehli call par CALL_PHONE + audio permissions allow karna.
