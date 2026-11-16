package com.callingcrm.app;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle savedInstanceState) {
    registerPlugin(CallPlugin.class);
    super.onCreate(savedInstanceState);
    // Upar/neeche overlap fix capacitor.config ke adjustMarginsForEdgeToEdge="force" se hota hai (Capacitor WebView ko bars ke andar margins deta hai).
    // Yaha sirf bars ke rang app theme se match karte hain taaki upar brown strip aur neeche dark strip saaf dikhe.
    getWindow().setStatusBarColor(0xFF4A3222);
    getWindow().setNavigationBarColor(0xFF1E150F);
  }
}
