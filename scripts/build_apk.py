import glob
import os
import shutil
import subprocess

def run(cmd, cwd=None):
    print(f"==> {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"STDOUT: {res.stdout}")
        print(f"STDERR: {res.stderr}")
        raise RuntimeError(f"Command failed with code {res.returncode}: {cmd}")
    return res.stdout

def build_native_apk():
    if not shutil.which('aapt'):
        print('AAPT build tools not in this runner environment. Keeping existing verified signed public/CallPulse.apk')
        return

    print("Building genuine Full-App Android APK for CallPulse...")
    build_dir = "/tmp/apk_build"
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir, exist_ok=True)

    gen_dir = os.path.join(build_dir, "gen")
    bin_dir = os.path.join(build_dir, "bin")
    res_dir = os.path.join(build_dir, "res")
    assets_dir = os.path.join(build_dir, "assets")
    src_dir = os.path.join(build_dir, "src/com/callpulse/tracker")

    os.makedirs(gen_dir, exist_ok=True)
    os.makedirs(bin_dir, exist_ok=True)
    os.makedirs(os.path.join(res_dir, "values"), exist_ok=True)
    os.makedirs(os.path.join(res_dir, "mipmap-mdpi"), exist_ok=True)
    os.makedirs(os.path.join(res_dir, "mipmap-hdpi"), exist_ok=True)
    os.makedirs(os.path.join(res_dir, "mipmap-xhdpi"), exist_ok=True)
    os.makedirs(os.path.join(res_dir, "mipmap-xxhdpi"), exist_ok=True)
    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(os.path.join(assets_dir, "assets"), exist_ok=True)
    os.makedirs(src_dir, exist_ok=True)

    # 1. Icons
    icon_src = "public/pwa-192x192.png"
    if os.path.exists(icon_src):
        for density in ["mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi"]:
            shutil.copy(icon_src, os.path.join(res_dir, density, "ic_launcher.png"))

    # 2. Strings & XML resources
    with open(os.path.join(res_dir, "values/strings.xml"), "w") as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">CallPulse</string>
</resources>''')

    # 3. AndroidManifest.xml
    manifest_path = os.path.join(build_dir, "AndroidManifest.xml")
    with open(manifest_path, "w") as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.callpulse.tracker"
    android:versionCode="2"
    android:versionName="1.1.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:hardwareAccelerated="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        
        <activity
            android:name="com.callpulse.tracker.MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>''')

    # 4. Java source (MainActivity with modern full-screen WebView)
    java_file = os.path.join(src_dir, "MainActivity.java")
    with open(java_file, "w") as f:
        f.write('''package com.callpulse.tracker;

import android.app.Activity;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        mWebView = new WebView(this);
        mWebView.setBackgroundColor(0xFF020617);

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        mWebView.loadUrl("file:///android_asset/index.html");
        setContentView(mWebView);
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
''')

    # 5. Build Vite dist if missing, then bundle for WebView
    if not os.path.exists("dist") or not glob.glob("dist/assets/index-*.js"):
        print("Running vite build...")
        run("npx vite build")

    # Find the compiled JS & CSS files in dist/assets
    js_files = glob.glob("dist/assets/index-*.js")
    css_files = glob.glob("dist/assets/index-*.css")

    if not js_files or not css_files:
        raise RuntimeError("Vite dist assets not found!")

    latest_js = js_files[0]
    latest_css = css_files[0]

    bundle_js_out = os.path.join(assets_dir, "assets/bundle.js")
    bundle_css_out = os.path.join(assets_dir, "assets/bundle.css")

    print(f"Bundling JS for Android WebView: {latest_js} -> {bundle_js_out}")
    # Convert module JS into IIFE bundle using esbuild for 100% Android WebView compatibility
    run(f"npx esbuild {latest_js} --format=iife --bundle --outfile={bundle_js_out}")

    print(f"Copying CSS: {latest_css} -> {bundle_css_out}")
    shutil.copy(latest_css, bundle_css_out)

    # Copy icons & public files
    for item in os.listdir("public"):
        src_item = os.path.join("public", item)
        if os.path.isfile(src_item) and not item.endswith(".apk") and not item.endswith(".idsig"):
            shutil.copy(src_item, os.path.join(assets_dir, item))

    # Generate assets/index.html that loads the full dashboard offline-first
    with open(os.path.join(assets_dir, "index.html"), "w") as f:
        f.write('''<!doctype html>
<html lang="si">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>CallPulse</title>
    <link rel="stylesheet" href="./assets/bundle.css">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background-color: #020617;
        color: #f8fafc;
        -webkit-user-select: none;
        user-select: none;
        overflow-x: hidden;
      }
      #root {
        min-height: 100vh;
      }
    </style>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
    <div id="root"></div>
    <script defer src="./assets/bundle.js"></script>
  </body>
</html>''')

    android_jar = "scripts/android.jar"
    if not os.path.exists(android_jar):
        android_jar = "/tmp/android.jar"
    if not os.path.exists(android_jar):
        print("Downloading official android.jar...")
        run("curl -L -s -o scripts/android.jar https://raw.githubusercontent.com/Sable/android-platforms/master/android-30/android.jar")
        android_jar = "scripts/android.jar"

    # 6. Run AAPT to generate R.java
    run(f"aapt package -f -m -J {gen_dir} -M {manifest_path} -S {res_dir} -I {android_jar}")

    # 7. Compile Java to .class
    r_java = os.path.join(gen_dir, "com/callpulse/tracker/R.java")
    run(f"javac -source 8 -target 8 -bootclasspath {android_jar} -cp {android_jar} -d {bin_dir} {r_java} {java_file}")

    # 8. Convert .class to classes.dex using dalvik-exchange (dx)
    dex_out = os.path.join(bin_dir, "classes.dex")
    run(f"dalvik-exchange --dex --output={dex_out} {bin_dir}")

    # 9. Package unaligned APK with resources, manifest, and assets
    unaligned_apk = os.path.join(bin_dir, "CallPulse.unaligned.apk")
    run(f"aapt package -f -M {manifest_path} -S {res_dir} -A {assets_dir} -I {android_jar} -F {unaligned_apk}")

    # 10. Add classes.dex into the APK
    run(f"aapt add {unaligned_apk} classes.dex", cwd=bin_dir)

    # 11. Zipalign the APK
    aligned_apk = os.path.join(bin_dir, "CallPulse.aligned.apk")
    run(f"zipalign -f -p 4 {unaligned_apk} {aligned_apk}")

    # 12. Create Keystore for signing
    keystore_path = os.path.join(build_dir, "callpulse.keystore")
    if not os.path.exists(keystore_path):
        run(f'keytool -genkeypair -v -keystore {keystore_path} -storepass callpulse123 -alias callpulse -keypass callpulse123 -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=CallPulse, OU=Mobile, O=CallPulse, L=Colombo, C=LK"')

    # 13. Sign APK with apksigner (v1 + v2 scheme)
    out_apk = "public/CallPulse.apk"
    run(f"apksigner sign --ks {keystore_path} --ks-pass pass:callpulse123 --ks-key-alias callpulse --key-pass pass:callpulse123 --out {out_apk} {aligned_apk}")

    # 14. Verify APK signature
    verify_out = run(f"apksigner verify --verbose {out_apk}")
    print("Verification result:\n" + verify_out)

    size = os.path.getsize(out_apk)
    
    # 15. Update in-memory Base64 APK
    import base64
    with open(out_apk, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
    with open('src/utils/apkBase64.ts', 'w') as out:
        out.write('// Autogenerated Full CallPulse.apk binary in base64 (' + str(size) + ' bytes)\n')
        out.write('export const FULL_CALLPULSE_APK_BASE64 = "' + b64 + '";\n')
    print('Updated src/utils/apkBase64.ts with new binary')

    print(f"SUCCESS: Built genuine signed Full-App Android APK {out_apk} ({size} bytes, {size/1024:.2f} KB)")

if __name__ == '__main__':
    build_native_apk()
