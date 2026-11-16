package com.callingcrm.app;
import android.Manifest;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.content.Context;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import android.database.Cursor;
import android.provider.CallLog;
import android.provider.ContactsContract;
import com.getcapacitor.JSArray;
import java.io.File;

// Calling CRM native bridge:
// - directCall: CALL_PHONE permission ke saath ACTION_CALL - dialpad khule bina seedha call
// - callEnded event: call khatam hote hi web ko signal (app foreground me wapas, disposition khulta hai)
// - fetchLatest: common call-recording folders se latest recording file (jahan OEM/Android block na kare)
@CapacitorPlugin(name = "CallPlugin", permissions = {
  @Permission(alias = "call", strings = { Manifest.permission.CALL_PHONE, Manifest.permission.READ_PHONE_STATE }),
  @Permission(alias = "audio", strings = { Manifest.permission.READ_MEDIA_AUDIO, Manifest.permission.READ_EXTERNAL_STORAGE }),
  @Permission(alias = "sync", strings = { Manifest.permission.READ_CALL_LOG, Manifest.permission.READ_CONTACTS })
})
public class CallPlugin extends Plugin {
  private PluginCall pendingCall; private String pendingPhone; private boolean wasOffhook = false;

  @PluginMethod public void directCall(PluginCall call) {
    if (getPermissionState("call") != PermissionState.GRANTED) { pendingCall = call; pendingPhone = call.getString("phone"); requestPermissionForAlias("call", call, "callPermCallback"); return; }
    placeCall(call, call.getString("phone"));
  }
  @PermissionCallback private void callPermCallback(PluginCall call) {
    if (getPermissionState("call") == PermissionState.GRANTED) placeCall(call, pendingPhone);
    else { call.reject("CALL_PHONE permission denied - Settings me allow karo"); if (pendingCall != null && pendingCall != call) pendingCall.reject("CALL_PHONE permission denied"); }
    pendingCall = null;
  }
  private void placeCall(PluginCall call, String phone) {
    if (phone == null) { call.reject("phone required"); return; }
    listenCallEnd();
    Intent i = new Intent(Intent.ACTION_CALL, Uri.parse("tel:" + phone.replaceAll("\\s", "")));
    getActivity().startActivity(i); call.resolve();
  }
  private void listenCallEnd() {
    TelephonyManager tm = (TelephonyManager) getContext().getSystemService(Context.TELEPHONY_SERVICE);
    tm.listen(new PhoneStateListener() { @Override public void onCallStateChanged(int state, String n) {
      if (state == TelephonyManager.CALL_STATE_OFFHOOK) wasOffhook = true;
      if (state == TelephonyManager.CALL_STATE_IDLE && wasOffhook) { wasOffhook = false; JSObject d = new JSObject(); notifyListeners("callEnded", d); }
    } }, PhoneStateListener.LISTEN_CALL_STATE);
  }
  // Phone Sync: device call log + contacts padh kar web ko deta hai (permission pehle maangta hai)
  @PluginMethod public void syncPhoneData(PluginCall call) {
    if (getPermissionState("sync") != PermissionState.GRANTED) { requestPermissionForAlias("sync", call, "syncPermCallback"); return; }
    readSync(call);
  }
  @PermissionCallback private void syncPermCallback(PluginCall call) {
    if (getPermissionState("sync") == PermissionState.GRANTED) readSync(call);
    else call.reject("Call log / Contacts permission denied - stats sync ke liye allow karo");
  }
  private void readSync(PluginCall call) {
    long since = call.getLong("since", 0L);
    JSObject out = new JSObject(); JSArray calls = new JSArray(); JSArray contacts = new JSArray();
    try { Cursor c = getContext().getContentResolver().query(CallLog.Calls.CONTENT_URI, new String[]{ CallLog.Calls.NUMBER, CallLog.Calls.DATE, CallLog.Calls.DURATION, CallLog.Calls.TYPE, CallLog.Calls.CACHED_NAME }, CallLog.Calls.DATE + " > ?", new String[]{ String.valueOf(since) }, CallLog.Calls.DATE + " ASC");
      if (c != null) { while (c.moveToNext()) { JSObject r = new JSObject(); r.put("phone", c.getString(0)); r.put("at", c.getLong(1)); r.put("durationSec", c.getLong(2)); r.put("type", c.getInt(3)); r.put("name", c.getString(4)); calls.put(r); if (calls.length() >= 500) break; } c.close(); } } catch (Exception e) { }
    try { Cursor c = getContext().getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, new String[]{ ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME, ContactsContract.CommonDataKinds.Phone.NUMBER }, null, null, null);
      if (c != null) { while (c.moveToNext()) { JSObject r = new JSObject(); r.put("name", c.getString(0)); r.put("phone", c.getString(1)); contacts.put(r); if (contacts.length() >= 1000) break; } c.close(); } } catch (Exception e) { }
    out.put("calls", calls); out.put("contacts", contacts); call.resolve(out);
  }
  @PluginMethod public void start(PluginCall call) { call.resolve(); } // Recording stock dialer/OEM recorder karta hai; fetchLatest usi file ko attach karta hai
  @PluginMethod public void fetchLatest(PluginCall call) {
    if (getPermissionState("audio") != PermissionState.GRANTED) { requestPermissionForAlias("audio", call, "audioPermCallback"); return; }
    scan(call);
  }
  @PermissionCallback private void audioPermCallback(PluginCall call) { scan(call); }
  private void scan(PluginCall call) {
    String[] dirs = { "Recordings/Call recordings", "Recordings/Call", "CallRecordings", "MIUI/sound_recorder/call_rec", "Recordings", "Music/Recordings", "Call" };
    File best = null; long cutoff = System.currentTimeMillis() - 15 * 60 * 1000;
    for (String d : dirs) { File dir = new File(Environment.getExternalStorageDirectory(), d); File[] fs = dir.listFiles(); if (fs == null) continue;
      for (File f : fs) { String n = f.getName().toLowerCase(); if ((n.endsWith(".mp3") || n.endsWith(".m4a") || n.endsWith(".amr") || n.endsWith(".wav")) && f.lastModified() > cutoff && (best == null || f.lastModified() > best.lastModified())) best = f; } }
    if (best == null) { call.resolve(null); return; } // Recording nahi mili (OEM/OS block ya recorder off) - web graceful note dikhayega
    JSObject r = new JSObject(); r.put("name", best.getName()); r.put("url", "file://" + best.getAbsolutePath()); call.resolve(r);
  }
}
