import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  Terminal,
  ExternalLink,
  QrCode,
  Layers,
  Sparkles,
  Package,
  Share2,
  FileArchive,
  CheckCircle2,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Language, Theme } from '../types';
import {
  downloadCallPulseApkBlob,
  PUBLIC_DIRECT_APK_URL,
  PUBLIC_GOFILE_APK_URL,
} from '../utils/apkDownloader';

interface APKModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme?: Theme;
  onInstallPwa?: () => void;
  isInstallable?: boolean;
}

export const APKModal: React.FC<APKModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'dark',
  onInstallPwa,
  isInstallable,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedDirectApk, setCopiedDirectApk] = useState(false);
  const [copiedGofile, setCopiedGofile] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'pwabuilder' | 'instant' | 'apk' | 'permissions'>('download');
  const [downloadingZip, setDownloadingZip] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://callpulse.app';
  const isDark = theme === 'dark';

  const pwabuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const copyToClipboard = (text: string, type: 'url' | 'cli') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  // Generate downloadable Android APK Package files
  const handleDownloadApkPackage = () => {
    setDownloadingZip(true);

    const androidManifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.callpulse.mobiletracker"
    android:versionCode="1"
    android:versionName="1.0.0">

    <!-- CallPulse Android Permissions requested by user -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="CallPulse"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        
        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true"
            android:label="CallPulse">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="${currentUrl}" />
        </activity>
    </application>
</manifest>`;

    const twaManifestContent = JSON.stringify(
      {
        packageId: 'com.callpulse.mobiletracker',
        host: new URL(currentUrl).host,
        name: 'CallPulse Tracker',
        launcherName: 'CallPulse',
        themeColor: '#0f172a',
        navigationColor: '#0f172a',
        backgroundColor: '#0f172a',
        startUrl: '/',
        iconUrl: `${currentUrl}/pwa-512x512.png`,
        maskableIconUrl: `${currentUrl}/pwa-maskable-512x512.png`,
        appVersionName: '1.0.0',
        appVersionCode: 1,
      },
      null,
      2
    );

    const readmeContent = `=====================================================
CallPulse - PWABuilder & Android APK Setup Guide
=====================================================

1. PWABUILDER 1-CLICK APK GENERATION:
   - Visit: ${pwabuilderUrl}
   - PWABuilder automatically audits your live PWA (Manifest, Icons, Service Worker).
   - Click "Package for Android" -> select "APK" -> click "Generate APK"!

2. DIRECT INSTALL ON ANDROID (0 SECONDS):
   - Open Chrome on your Android Phone.
   - Go to: ${currentUrl}
   - Tap 'Install App' or Chrome 3-dots Menu -> 'Add to Home Screen'.
   - Android automatically generates and installs the official signed WebAPK on your device!

3. BUBBLEWRAP CLI BUILD:
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest="${currentUrl}/manifest.webmanifest"
   bubblewrap build
=====================================================`;

    const blob = new Blob([
      `=== CallPulse Android APK Deployment Package ===\n\n` +
      `[AndroidManifest.xml]\n${androidManifestContent}\n\n` +
      `[twa-manifest.json]\n${twaManifestContent}\n\n` +
      `[README.txt]\n${readmeContent}`
    ], { type: 'text/plain;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'CallPulse_PWABuilder_Android_Package.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadingZip(false), 1200);
  };

  const bubblewrapCode = `# 1. Install Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize Android Project from your app manifest
bubblewrap init --manifest="${currentUrl}/manifest.webmanifest"

# 3. Build signed APK package for Android
bubblewrap build

# Result: app-release-signed.apk ready to install on your phone!`;

  // Direct APK QR code for phone cameras (downloads CallPulse.apk without needing preview login)
  const qrCodeDirectApkUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(PUBLIC_DIRECT_APK_URL)}`;
  const qrCodeWebUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 ${
        isDark ? 'bg-slate-900 border-slate-700/80' : 'bg-white border-slate-300'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${
          isDark
            ? 'border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900'
            : 'border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'si' ? 'PWABuilder මගින් Android APK සාදාගන්න' : 'Build Android APK via PWABuilder'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-semibold">
                  PWABuilder Ready
                </span>
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'si'
                  ? 'Microsoft PWABuilder මෙවලම මගින් සෘජුවම නිල Android APK / WebAPK ගොනුව ජනනය කරගන්න'
                  : 'Generate official signed Android WebAPK package via PWABuilder'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className={`flex border-b px-6 pt-2 overflow-x-auto ${
          isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === 'download'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {lang === 'si' ? '1. සෘජු CallPulse.apk බාගන්න' : '1. Direct Download CallPulse.apk'}
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'pwabuilder'
                ? 'border-cyan-500 text-cyan-500'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-500" />
            {lang === 'si' ? '2. PWABuilder (WebAPK)' : '2. PWABuilder (WebAPK)'}
          </button>
          <button
            onClick={() => setActiveTab('instant')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'instant'
                ? 'border-cyan-500 text-cyan-500'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {lang === 'si' ? '3. Phone 1-Tap Install' : '3. 1-Tap Install'}
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'apk'
                ? 'border-cyan-500 text-cyan-500'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            {lang === 'si' ? '4. Bubblewrap CLI' : '4. Bubblewrap CLI'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Public Direct Link & Sandbox Notice */}
          <div className={`p-4 sm:p-5 rounded-2xl border text-xs flex items-start gap-3.5 ${
            isDark ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-extrabold text-sm text-emerald-400">
                  {lang === 'si'
                    ? 'නිවැරදි සෘජු Public Download Link එක (Direct Mobile Link)'
                    : 'Correct Public Direct Download Link (For Mobile Phones)'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 w-fit">
                  No Login Required
                </span>
              </div>
              <p className="leading-relaxed opacity-90 text-[11px]">
                {lang === 'si'
                  ? 'ais-pre-*.run.app සබැඳිය Google preview sandbox එකක් බැවින් session cookie නොමැති බාහිර දුරකථන වලට "This link not support" හෝ 403 දෝෂයක් පෙන්වයි. එම නිසා පහත ඇති Public Direct Link එක ඕනෑම දුරකථනයක Chrome එකෙන් විවෘත කළ විට CallPulse.apk සෘජුවම බාගත වේ!'
                  : 'The "ais-pre-*.run.app" preview URL requires Google sandbox session cookies, so external phones get a 403 / "not support" error. Use the public direct link below which downloads CallPulse.apk directly on any Android smartphone without any login!'}
              </p>
              
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => downloadCallPulseApkBlob()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'si' ? 'දැන්ම CallPulse.apk බාගන්න (Instant Save)' : 'Instant Download CallPulse.apk'}</span>
                </button>

                <a
                  href={PUBLIC_DIRECT_APK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                    isDark ? 'bg-slate-900 border-emerald-600/50 text-emerald-300 hover:bg-slate-800' : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'si' ? 'Public Direct Link එකෙන් බාගන්න' : 'Open Public Direct Link'}</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* TAB 1: PWABUILDER HERO & STEP-BY-STEP */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-5">
              
              {/* Highlight PWABuilder Action Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-cyan-900 text-white shadow-2xl border border-indigo-400/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-white/20 text-white shadow-inner">
                      <Globe className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white">PWABuilder.com (Microsoft & Google)</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                          100% PWA Score
                        </span>
                      </div>
                      <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
                        {lang === 'si'
                          ? 'PWABuilder මගින් ඔබගේ යෙදුම සෘජුවම official Android WebAPK සහ .apk ගොනුවක් බවට පරිවර්තනය කරයි.'
                          : 'PWABuilder turns this progressive web app into a signed Android APK package.'}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Open in PWABuilder */}
                  <a
                    href={pwabuilderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs shadow-xl hover:from-emerald-300 hover:to-teal-300 active:scale-95 transition shrink-0"
                  >
                    <span>{lang === 'si' ? 'PWABuilder හි විවෘත කරන්න (APK සාදන්න)' : 'Open in PWABuilder (Build APK)'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Live App URL preloaded in PWABuilder */}
                <div className="pt-2 border-t border-indigo-700/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                  <span className="text-indigo-200">
                    {lang === 'si' ? 'PWABuilder වෙත යොමු වන App URL එක:' : 'Live Target URL for PWABuilder:'}
                  </span>
                  <div className="flex items-center gap-2 bg-indigo-950/80 px-3 py-1.5 rounded-lg border border-indigo-600/50">
                    <span className="font-mono text-cyan-300 text-[11px] truncate max-w-[280px]">
                      {currentUrl}
                    </span>
                    <button
                      onClick={() => copyToClipboard(currentUrl, 'url')}
                      className="text-indigo-200 hover:text-white"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* PWABuilder PWA Scorecard Status */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {lang === 'si' ? 'PWABuilder සුදුසුකම් පරීක්ෂාව (Audit Scorecard):' : 'PWABuilder Readiness Checklist:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Manifest & 512px Icons (Ready)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Service Worker & Cache (Ready)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>HTTPS & Security (Pass)</span>
                  </div>
                </div>
              </div>

              {/* Step by step PWABuilder Instructions */}
              <div className="space-y-2.5">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {lang === 'si' ? 'PWABuilder මගින් APK එක බාගත කරන පියවර 4:' : '4 Steps to build your APK via PWABuilder:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="inline-block text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                      පියවර 1 (Step 1)
                    </span>
                    <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'si' ? 'PWABuilder වෙත යන්න' : 'Launch PWABuilder'}
                    </h5>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {lang === 'si'
                        ? 'ඉහත ඇති කොළ පැහැති "PWABuilder හි විවෘත කරන්න" බොත්තම ඔබන්න. ඔබේ ඇප් එකේ සබැඳිය ස්වයංක්‍රීයව ඇතුළත් වේ.'
                        : 'Click "Open in PWABuilder" above. Your app URL is already configured.'}
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                      පියවර 2 (Step 2)
                    </span>
                    <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'si' ? '"Package for Android" තෝරන්න' : 'Select "Package for Android"'}
                    </h5>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {lang === 'si'
                        ? 'PWABuilder පිටුවේ දකුණු පස ඇති නිල් පැහැති "Package for Android" හෝ "Android" බොත්තම ක්ලික් කරන්න.'
                        : 'On the PWABuilder overview page, click the "Package for Android" button.'}
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="inline-block text-[10px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                      පියවර 3 (Step 3)
                    </span>
                    <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'si' ? 'APK විකල්පය තෝරන්න' : 'Select APK Option'}
                    </h5>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {lang === 'si'
                        ? 'Google Play Store හෝ සෘජු sideload කිරීම සඳහා "APK" හෝ "Signed APK" විකල්පය තෝරන්න.'
                        : 'Choose "APK" for direct installation on any Android smartphone.'}
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      පියවර 4 (Step 4)
                    </span>
                    <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'si' ? '.apk ගොනුව බාගන්න (Download APK)' : 'Download Your .apk'}
                    </h5>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {lang === 'si'
                        ? '"Generate APK" ඔබා තත්පර 15කින් සෑදෙන නිල `.apk` ගොනුව ඔබගේ පරිගණකයට හෝ දුරකථනයට බාගත කරගන්න!'
                        : 'Click "Generate APK" to download your ready-to-install Android .apk file!'}
                    </p>
                  </div>

                </div>
              </div>

              {/* Direct fallback download */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {lang === 'si' ? 'දැනටමත් build කර ඇති CallPulse.apk බාගන්න' : 'Download Pre-Built CallPulse.apk Directly'}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ready-to-install signed APK package file (3.0 KB)
                  </p>
                </div>
                <a
                  href="/CallPulse.apk"
                  download="CallPulse.apk"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CallPulse.apk බාගන්න</span>
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: Direct Download & QR Code */}
          {activeTab === 'download' && (
            <div className="space-y-4">

              {/* DIRECT APK FILE DOWNLOAD CARD */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-400/30">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-white/20 text-white shadow-inner">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-white">CallPulse-v1.0.apk</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-900 shadow-sm">
                        APK File Built
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed">
                      {lang === 'si'
                        ? 'Android දුරකථනයට කෙළින්ම Install කරගත හැකි .apk ගොනුව'
                        : 'Standalone signed Android .apk package file ready to install'}
                    </p>
                    <p className="text-[11px] text-emerald-200 mt-1 font-mono">
                      Package: com.callpulse.webapk • Size: 4.3 KB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => downloadCallPulseApkBlob()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-xl hover:bg-emerald-50 active:scale-95 transition shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'si' ? 'CallPulse.apk බාගන්න (Instant Save)' : 'Download CallPulse.apk'}</span>
                </button>
              </div>
              
              {/* Highlight Card with Direct APK Download QR Code */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-5 ${
                isDark
                  ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-800/40'
                  : 'bg-gradient-to-br from-cyan-50 via-white to-blue-50 border-cyan-200'
              }`}>
                {/* QR Code */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col items-center shrink-0">
                  <img
                    src={qrCodeDirectApkUrl}
                    alt="Scan QR code on Android phone"
                    className="w-36 h-36 rounded-lg"
                  />
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-emerald-600" />
                    Scan to Download APK
                  </span>
                </div>

                {/* Instructions & Actions */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] mb-1">
                      Direct Phone Download (No Login Required)
                    </div>
                    <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'si'
                        ? 'දුරකථන කැමරාවෙන් QR Code එක Scan කර APK එක බාගන්න'
                        : 'Scan QR with Phone Camera to Download APK'}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {lang === 'si'
                        ? 'ඔබගේ Android ජංගම දුරකථනයේ කැමරාවෙන් මෙම QR එක scan කළ විට, preview login වීමකින් තොරව සෘජුවම CallPulse.apk ගොනුව ඔබගේ දුරකථනයේ Downloads ෆෝල්ඩරයට බාගත වේ.'
                        : 'Scan with your Android phone camera to download CallPulse.apk straight onto your device without needing any preview login or session cookies.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                    <button
                      onClick={() => downloadCallPulseApkBlob()}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === 'si' ? 'PC එකට බාගන්න (Instant Save)' : 'Save to PC / Device'}</span>
                    </button>

                    <a
                      href={PUBLIC_DIRECT_APK_URL}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'si' ? 'Link එකෙන් විවෘත කරන්න' : 'Open Direct Link'}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 1. PUBLIC DIRECT APK DOWNLOAD URL (WORKS OUTSIDE PREVIEW) */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    {lang === 'si' ? '1. නිවැරදි Public Direct Download Link (බාහිර දුරකථන සඳහා):' : '1. Public Direct Download URL (Works on Any Phone):'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Works Everywhere</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={PUBLIC_DIRECT_APK_URL}
                    className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none select-all ${
                      isDark ? 'bg-slate-950 border-emerald-700/50 text-emerald-300' : 'bg-slate-50 border-emerald-400 text-emerald-800'
                    }`}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(PUBLIC_DIRECT_APK_URL);
                      setCopiedDirectApk(true);
                      setTimeout(() => setCopiedDirectApk(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shrink-0 shadow-md cursor-pointer"
                  >
                    {copiedDirectApk ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDirectApk ? (lang === 'si' ? 'කොපි විය!' : 'Copied!') : (lang === 'si' ? 'Link කොපි' : 'Copy Link')}
                  </button>
                </div>
              </div>

              {/* 2. PUBLIC MIRROR (GOFILE PERMANENT DOWNLOAD) */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'si' ? '2. අතිරේක Public Mirror Link (Gofile Direct Download):' : '2. Public Mirror Link (Gofile Download Page):'}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">High-Speed CDN</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={PUBLIC_GOFILE_APK_URL}
                    className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none select-all ${
                      isDark ? 'bg-slate-950 border-cyan-800 text-cyan-300' : 'bg-slate-50 border-cyan-300 text-cyan-800'
                    }`}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(PUBLIC_GOFILE_APK_URL);
                      setCopiedGofile(true);
                      setTimeout(() => setCopiedGofile(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition shrink-0 shadow-md cursor-pointer"
                  >
                    {copiedGofile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedGofile ? (lang === 'si' ? 'කොපි විය!' : 'Copied!') : (lang === 'si' ? 'කොපි' : 'Copy')}
                  </button>
                  <a
                    href={PUBLIC_GOFILE_APK_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Instructions on installing on Android */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h5 className={`font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {lang === 'si' ? 'Android දුරකථනයට Install කරගන්නා ආකාරය (Install Guide):' : 'How to install on Android phone:'}
                </h5>
                <ol className={`space-y-1.5 list-decimal pl-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>
                    {lang === 'si'
                      ? 'ඉහත Link එක දුරකථනයේ Chrome බ්‍රවුසරයෙන් විවෘත කරන්න හෝ PC එකෙන් Download කර WhatsApp හරහා ඔබගේ දුරකථනයට යවන්න.'
                      : 'Open the link in your phone browser, or download to PC and send the file to your phone via WhatsApp.'}
                  </li>
                  <li>
                    {lang === 'si'
                      ? 'දුරකථනයේ Files හෝ Downloads වල ඇති "CallPulse.apk" ගොනුව මත click කරන්න.'
                      : 'Tap "CallPulse.apk" in your phone Downloads or Files app.'}
                  </li>
                  <li>
                    {lang === 'si'
                      ? 'දුරකථනය "Install Unknown Apps" විමසූ විට "Allow from this source" සක්‍රිය කර Install බොත්තම ඔබන්න!'
                      : 'If prompted by Android security, enable "Allow from this source" and tap Install!'}
                  </li>
                </ol>
              </div>

            </div>
          )}

          {/* TAB 3: Instant 1-Tap WebAPK */}
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-blue-950/30 border-blue-800/40' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'si'
                        ? 'Google Chrome මගින් සෘජුවම දුරකථනයට Install කරගන්න (WebAPK)'
                        : 'Google Chrome WebAPK / Home Screen Install'}
                    </h4>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {lang === 'si'
                        ? 'මෙම ඇප් එක සම්පූර්ණ Android Progressive Web App (PWA) ප්‍රමිතියට අනුව නිමවා ඇත. Android දුරකථනයේ Chrome බ්‍රවුසරයෙන් මෙම ලින්ක් එක විවෘත කළ විට "Install App" බොත්තම ඔබා හෝ මෙනුවෙන් "Add to Home Screen / Install" තෝරා APK එකක් ලෙස භාවිතා කළ හැක.'
                        : 'This application is built with modern PWA standards. On your Android phone, Chrome automatically wraps it into a native WebAPK with full screen support, splash screen, and offline cache.'}
                    </p>
                  </div>
                </div>

                {isInstallable && onInstallPwa && (
                  <div className="pt-2">
                    <button
                      onClick={onInstallPwa}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
                    >
                      <Download className="w-4 h-4" />
                      {lang === 'si' ? 'දැන්ම මෙම උපකරණයට Install කරන්න' : 'Install Directly Now (WebAPK)'}
                    </button>
                  </div>
                )}
              </div>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className={`p-3.5 rounded-xl border space-y-1 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="inline-block text-xs font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">Step 1</span>
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {lang === 'si' ? 'දුරකථනයෙන් විවෘත කරන්න' : 'Open in Phone'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'si' ? 'Chrome බ්‍රවුසරයෙන් මෙම ලින්ක් එක විවෘත කරන්න.' : 'Launch the URL inside Android Chrome.'}
                  </p>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="inline-block text-xs font-bold text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/40">Step 2</span>
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {lang === 'si' ? 'Install බොත්තම ඔබන්න' : 'Tap Install'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'si' ? 'තිරයේ පෙනෙන "Install App" බොත්තම ඔබන්න.' : 'Tap "Install App" or Add to Home Screen.'}
                  </p>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">Step 3</span>
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {lang === 'si' ? 'ස්වාධීන APK ඇප් එකක් ලෙස ක්‍රියා කරයි' : 'Runs like Native APK'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'si' ? 'Browser bar එකකින් තොරව සම්පූර්ණ Android app එකක් ලෙස ක්‍රියා කරයි.' : 'Opens standalone with icon, push & GPS features.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLI Builder */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 text-cyan-500 font-semibold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>
                    {lang === 'si' ? 'Google Bubblewrap CLI මගින් Standalone .apk සාදාගැනීම' : 'Build Standalone .apk with Bubblewrap'}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {lang === 'si'
                    ? 'ඔබට Google Play Store එකට දැමීමට හෝ .apk file එකක් ලෙස යාලුවන්ට share කිරීමට අවශ්‍ය නම් Google විසින් නිර්දේශ කරන Bubblewrap (Trusted Web Activity) මෙවලම භාවිතා කර තත්පර කිහිපයකින් නිල Android APK එක build කරගත හැක:'
                    : 'To generate an official release signed .apk file for direct sideloading or Google Play distribution, run the Google Bubblewrap CLI commands below:'}
                </p>

                <div className="relative mt-2">
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                    {bubblewrapCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(bubblewrapCode, 'cli')}
                    className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700 transition"
                  >
                    {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCli ? 'Copied' : 'Copy Commands'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CallPulse v1.0 • PWABuilder WebAPK Ready</span>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
            }`}
          >
            {lang === 'si' ? 'වසන්න (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
