package com.callingcrm.app;
import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;
import com.getcapacitor.BridgeActivity;
public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle savedInstanceState) {
    registerPlugin(CallPlugin.class);
    super.onCreate(savedInstanceState);
    // Status bar / system nav se overlap fix: WebView ko system bars ke insets jitna padding do
    getWindow().setStatusBarColor(0xFF4A3222);
    getWindow().setNavigationBarColor(0xFF1E150F);
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    View webView = getBridge().getWebView();
    ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
      Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
      v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
      return WindowInsetsCompat.CONSUMED;
    });
  }
}
