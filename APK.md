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
