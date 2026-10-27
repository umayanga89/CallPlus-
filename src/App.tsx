/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Smartphone,
  MapPin,
  BarChart3,
  LayoutDashboard,
  Plus,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Mail,
  Calendar,
  Globe
} from 'lucide-react';
import { CallRecord, WhatsAppRecord, AppUsageRecord, GmailRecord, Language, Theme } from './types';
import { translations } from './utils/i18n';
import {
  getStoredTheme,
  saveStoredTheme,
  getStoredCalls,
  saveStoredCalls,
  getStoredWhatsApp,
  saveStoredWhatsApp,
  getStoredGmail,
  saveStoredGmail,
  getStoredAppUsage,
  saveStoredAppUsage,
  getStoredOfficeNumber,
  saveStoredOfficeNumber,
  getStoredPickups,
  saveStoredPickups,
  resetAllDataToDefault
} from './utils/storage';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Navbar } from './components/Navbar';
import { KPICards } from './components/KPICards';
import { DayTimelineView } from './components/DayTimelineView';
import { CallLogsView } from './components/CallLogsView';
import { WhatsAppMonitorView } from './components/WhatsAppMonitorView';
import { GmailMonitorView } from './components/GmailMonitorView';
import { ScreenTimeView } from './components/ScreenTimeView';
import { LocationMapView } from './components/LocationMapView';
import { AnalyticsView } from './components/AnalyticsView';
import { WebAPKView } from './components/WebAPKView';
import { APKModal } from './components/APKModal';
import { AddCallModal } from './components/AddCallModal';
import { AddWhatsAppModal } from './components/AddWhatsAppModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [lang, setLang] = useState<Language>('si'); // Default to Sinhala
  const [theme, setTheme] = useState<Theme>('dark'); // Dark mode default, toggleable to light mode
  const [activeTab, setActiveTab] = useState<
    'overview' | 'dayTimeline' | 'calls' | 'whatsapp' | 'gmail' | 'screenTime' | 'locations' | 'analytics' | 'webApk'
  >('overview');
  const [activePeriod, setActivePeriod] = useState<'today' | 'yesterday' | 'week' | 'all'>('today');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Data states
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [whatsapp, setWhatsapp] = useState<WhatsAppRecord[]>([]);
  const [gmail, setGmail] = useState<GmailRecord[]>([]);
  const [apps, setApps] = useState<AppUsageRecord[]>([]);
  const [officeNumber, setOfficeNumber] = useState<string>('+94 11 250 8899');
  const [pickups, setPickups] = useState<number>(58);

  // Modals
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isAddCallModalOpen, setIsAddCallModalOpen] = useState(false);
  const [isAddWhatsAppModalOpen, setIsAddWhatsAppModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // PWA install hook
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Load stored data & theme on mount
  useEffect(() => {
    setTheme(getStoredTheme());
    setCalls(getStoredCalls());
    setWhatsapp(getStoredWhatsApp());
    setGmail(getStoredGmail());
    setApps(getStoredAppUsage());
    setOfficeNumber(getStoredOfficeNumber());
    setPickups(getStoredPickups());
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'si' ? 'en' : 'si'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      saveStoredTheme(next);
      return next;
    });
  };

  const handleSaveCall = (newCall: CallRecord) => {
    const updated = [newCall, ...calls];
    setCalls(updated);
    saveStoredCalls(updated);
  };

  const handleDeleteCall = (id: string) => {
    const updated = calls.filter((c) => c.id !== id);
    setCalls(updated);
    saveStoredCalls(updated);
  };

  const handleSaveWhatsApp = (newWa: WhatsAppRecord) => {
    const updated = [newWa, ...whatsapp];
    setWhatsapp(updated);
    saveStoredWhatsApp(updated);
  };

  const handleDeleteWhatsApp = (id: string) => {
    const updated = whatsapp.filter((w) => w.id !== id);
    setWhatsapp(updated);
    saveStoredWhatsApp(updated);
  };

  const handleSaveGmail = (newEmail: GmailRecord) => {
    const updated = [newEmail, ...gmail];
    setGmail(updated);
    saveStoredGmail(updated);
  };

  const handleDeleteGmail = (id: string) => {
    const updated = gmail.filter((g) => g.id !== id);
    setGmail(updated);
    saveStoredGmail(updated);
  };

  const handleUpdateOfficeNumber = (num: string) => {
    setOfficeNumber(num);
    saveStoredOfficeNumber(num);
  };

  const handleUpdateAppTime = (appId: string, minutes: number) => {
    const updated = apps.map((a) => (a.id === appId ? { ...a, minutesUsedToday: minutes } : a));
    setApps(updated);
    saveStoredAppUsage(updated);
  };

  const handleAddCustomApp = (newApp: AppUsageRecord) => {
    const updated = [...apps, newApp];
    setApps(updated);
    saveStoredAppUsage(updated);
  };

  const handleUpdatePickups = (count: number) => {
    setPickups(count);
    saveStoredPickups(count);
  };

  const handleResetData = () => {
    if (window.confirm(lang === 'si' ? 'සියලු දත්ත නැවත ප්‍රකෘතිමත් කරන්නද?' : 'Reset all data back to original defaults?')) {
      const def = resetAllDataToDefault();
      setCalls(def.calls);
      setWhatsapp(def.wa);
      setGmail(def.gmail);
      setApps(def.apps);
      setOfficeNumber('+94 11 250 8899');
      setPickups(58);
    }
  };

  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark
        ? 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white'
        : 'bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white'
    }`}>
      
      {/* Top Navigation with Dark/Light Mode button */}
      <Navbar
        lang={lang}
        theme={theme}
        onToggleLang={handleToggleLang}
        onToggleTheme={handleToggleTheme}
        activePeriod={activePeriod}
        onSelectPeriod={setActivePeriod}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetData={handleResetData}
        isInstallable={isInstallable}
        onInstallPwa={install}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
      />

      {/* Main Body with Phone Frame Simulator Toggle */}
      <div className={`flex-1 w-full mx-auto transition-all duration-300 ${
        isPhoneFrame
          ? `max-w-md my-6 p-4 rounded-3xl border-4 shadow-2xl overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
            }`
          : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
      }`}>
        
        {/* Prominent Direct APK Download Callout Banner */}
        <div className={`mb-5 p-4 sm:p-5 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
          isDark
            ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/60 border-emerald-500/40 text-emerald-100 shadow-emerald-950/30'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-300 text-emerald-950 shadow-emerald-100'
        }`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`font-black text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  CallPulse.apk — Android Direct Download
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  4.2 KB • Ready
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-slate-950/60 text-emerald-300 border-emerald-500/30' : 'bg-white text-emerald-800 border-emerald-300'
                }`}>
                  No Password / No Login
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {lang === 'si'
                  ? 'කිසිදු password එකක් හෝ external login එකක් අවශ්‍ය නොවේ. 1-Click මගින් CallPulse.apk ඔබගේ phone එකට බාගන්න.'
                  : 'Zero external login or password required. 1-Click direct download and install on any Android phone.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* DIRECT DOWNLOAD CALLPULSE.APK BUTTON */}
            <a
              href="/CallPulse.apk"
              download="CallPulse.apk"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400/50 hover:scale-105 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'si' ? 'CallPulse.apk සෘජුවම බාගන්න' : 'Direct Download CallPulse.apk'}</span>
            </a>

            <button
              onClick={() => setIsApkModalOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition ${
                isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'si' ? 'ස්ථාපන උපදෙස්' : 'Install Guide'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className={`flex items-center gap-1.5 p-1.5 mb-6 rounded-2xl border overflow-x-auto ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t.tabs.overview}</span>
          </button>

          {/* Dedicated Tab: Day Activity Timeline Chart */}
          <button
            onClick={() => setActiveTab('dayTimeline')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'dayTimeline'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.tabs.dayTimeline}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              isDark ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'
            }`}>
              24h
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'calls'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.tabs.calls}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              isDark ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-cyan-600'
            }`}>
              {calls.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'whatsapp'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.tabs.whatsapp}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              isDark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-600'
            }`}>
              {whatsapp.length}
            </span>
          </button>

          {/* Dedicated Tab: Gmail Activity */}
          <button
            onClick={() => setActiveTab('gmail')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'gmail'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t.tabs.gmail}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              isDark ? 'bg-slate-800 text-rose-400' : 'bg-slate-100 text-rose-600'
            }`}>
              {gmail.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('screenTime')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'screenTime'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.tabs.screenTime}</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'locations'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.tabs.locations}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.tabs.analytics}</span>
          </button>

          {/* Dedicated Tab: Web APK Builder & Compiler */}
          <button
            onClick={() => setActiveTab('webApk')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'webApk'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/30'
                : isDark ? 'text-emerald-400 hover:text-white hover:bg-slate-800/60' : 'text-emerald-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.tabs.webApk}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              APK
            </span>
          </button>
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Quick Hero Banner with APK install nudge & Live status */}
            <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark
                ? 'bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border-cyan-800/40'
                : 'bg-gradient-to-r from-cyan-50 via-blue-50 to-slate-50 border-cyan-200'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-500 border border-cyan-500/30">
                    {lang === 'si' ? '● සජීවී නිරීක්ෂණ පද්ධතිය' : '● Live Mobile Intelligence'}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lang === 'si' ? 'අද දවසේ සාරාංශය' : "Today's Activity Sync"}
                  </span>
                </div>
                <h2 className={`text-xl sm:text-2xl font-extrabold mt-1.5 tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {lang === 'si'
                    ? 'ඇමතුම්, WhatsApp, Gmail සහ මොබයිල් භාවිත විශ්ලේෂණය'
                    : 'Call Logs, WhatsApp, Gmail & Screen Activity'}
                </h2>
                <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {lang === 'si'
                    ? 'ඔබට ආපු/ගත්ත ඇමතුම්, Google GPS ස්ථාන, කාර්යාල WhatsApp, ලැබුණු Gmail ඊමේල් සහ මොබයිල් භාවිත කාලය මෙතැනින් එකවර බලන්න.'
                    : 'Real-time overview of incoming & outgoing calls, talk time duration, Google GPS locations, office WhatsApp communications, and daily Gmail inbox count.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href="/CallPulse.apk"
                  download="CallPulse.apk"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40 hover:scale-105 active:scale-95 transition"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>{lang === 'si' ? 'CallPulse.apk බාගන්න' : 'Direct Download CallPulse.apk'}</span>
                </a>
                <button
                  onClick={() => setIsAddCallModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'si' ? 'ඇමතුමක්' : 'Log Call'}</span>
                </button>
                <button
                  onClick={() => setIsAddWhatsAppModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setActiveTab('dayTimeline')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'si' ? 'දවසේ සටහන' : 'Day Chart'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('webApk')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{lang === 'si' ? 'Web APK හදන්න' : 'Web APK Studio'}</span>
                </button>
              </div>
            </div>

            {/* KPI Cards (Calls, Talk Time, WhatsApp, Gmail, Screen Time) */}
            <KPICards
              calls={calls}
              whatsapp={whatsapp}
              gmail={gmail}
              apps={apps}
              pickups={pickups}
              lang={lang}
              theme={theme}
              onSelectTab={(tab) => setActiveTab(tab as any)}
            />

            {/* Three-Column Split: Recent Calls with GPS, WhatsApp Snapshot, & Gmail Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* 1: Recent Calls with Google GPS Location */}
              <div className={`p-4 rounded-2xl border shadow-xl space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'si' ? 'මෑත ඇමතුම් & GPS' : 'Recent Calls & GPS'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('calls')}
                    className="text-[11px] text-cyan-500 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{lang === 'si' ? 'සියල්ල' : 'View All'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {calls.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          c.type === 'incoming' ? 'bg-emerald-400' : c.type === 'outgoing' ? 'bg-blue-400' : 'bg-rose-400'
                        }`} />
                        <div>
                          <p className={`font-bold text-xs truncate max-w-[130px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {c.contactName}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-cyan-500 truncate max-w-[140px]">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{c.location.address.split(',')[0]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {c.durationSeconds === 0 ? 'Missed' : `${Math.floor(c.durationSeconds / 60)}m ${c.durationSeconds % 60}s`}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2: Office WhatsApp Summary */}
              <div className={`p-4 rounded-2xl border shadow-xl space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      {lang === 'si' ? 'කාර්යාල WhatsApp' : 'Office WhatsApp'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className="text-[11px] text-emerald-500 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{lang === 'si' ? 'සියල්ල' : 'View All'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {whatsapp.slice(0, 3).map((w) => (
                    <div
                      key={w.id}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1">
                          <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{w.customerName}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'}`}>
                            {w.category}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate max-w-[150px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {w.previewText}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-800 text-emerald-400">
                          {w.type.includes('call') ? 'Call' : 'Msg'}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3: Gmail Activity Summary */}
              <div className={`p-4 rounded-2xl border shadow-xl space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Mail className="w-3.5 h-3.5 text-rose-400" />
                    {lang === 'si' ? 'Gmail ඊමේල් සාරාංශය' : 'Gmail Inbox Activity'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('gmail')}
                    className="text-[11px] text-rose-500 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{lang === 'si' ? 'සියල්ල' : 'View All'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {gmail.slice(0, 3).map((g) => (
                    <div
                      key={g.id}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {g.senderName.split(' ')[0]}
                          </span>
                          <span className={`text-[9px] px-1 py-0.2 rounded ${
                            g.status === 'unread' ? 'bg-amber-500/20 text-amber-500 font-bold' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {g.status}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate max-w-[150px] mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {g.subject}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] text-slate-400 block">
                          {new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Link to 24h Activity Timeline Chart */}
            <div
              onClick={() => setActiveTab('dayTimeline')}
              className={`cursor-pointer p-4 rounded-2xl border transition flex items-center justify-between shadow-lg ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-800/40 hover:border-indigo-600'
                  : 'bg-gradient-to-r from-indigo-50 via-white to-slate-50 border-indigo-200 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {lang === 'si' ? 'දවස පුරා සියලු ක්‍රියාකාරකම් සටහන (Day Activity Timeline Chart)' : 'View Full 24-Hour Day Activity Timeline Chart'}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lang === 'si'
                      ? 'ඇමතුම්, WhatsApp, Gmail සහ මොබයිල් ඇප් පැයෙන් පැයට විවෘත කළ කාලරේඛාව බලන්න'
                      : 'Interactive chronological stream mapping every call, message, email, and app session hour-by-hour.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                <span>{lang === 'si' ? 'විවෘත කරන්න' : 'Open Timeline'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Dedicated Full Day Activity Timeline Chart */}
        {activeTab === 'dayTimeline' && (
          <div className="animate-in fade-in duration-200">
            <DayTimelineView
              calls={calls}
              whatsapp={whatsapp}
              gmail={gmail}
              apps={apps}
              lang={lang}
              theme={theme}
            />
          </div>
        )}

        {/* Tab 3: Call Logs & GPS */}
        {activeTab === 'calls' && (
          <div className="animate-in fade-in duration-200">
            <CallLogsView
              calls={calls}
              onAddCall={() => setIsAddCallModalOpen(true)}
              onDeleteCall={handleDeleteCall}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 4: Office WhatsApp */}
        {activeTab === 'whatsapp' && (
          <div className="animate-in fade-in duration-200">
            <WhatsAppMonitorView
              records={whatsapp}
              officeNumber={officeNumber}
              onUpdateOfficeNumber={handleUpdateOfficeNumber}
              onAddWhatsApp={() => setIsAddWhatsAppModalOpen(true)}
              onDeleteRecord={handleDeleteWhatsApp}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 5: Gmail Activity Monitor */}
        {activeTab === 'gmail' && (
          <div className="animate-in fade-in duration-200">
            <GmailMonitorView
              records={gmail}
              onAddEmail={handleSaveGmail}
              onDeleteRecord={handleDeleteGmail}
              lang={lang}
              theme={theme}
            />
          </div>
        )}

        {/* Tab 6: Screen Time & Apps */}
        {activeTab === 'screenTime' && (
          <div className="animate-in fade-in duration-200">
            <ScreenTimeView
              apps={apps}
              pickups={pickups}
              onUpdateAppTime={handleUpdateAppTime}
              onAddCustomApp={handleAddCustomApp}
              onUpdatePickups={handleUpdatePickups}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 7: Location Maps */}
        {activeTab === 'locations' && (
          <div className="animate-in fade-in duration-200">
            <LocationMapView
              calls={calls}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 8: Data Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in duration-200">
            <AnalyticsView
              calls={calls}
              whatsapp={whatsapp}
              apps={apps}
              pickups={pickups}
              onOpenExport={() => setIsExportModalOpen(true)}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 9: Web APK Builder Studio */}
        {activeTab === 'webApk' && (
          <div className="animate-in fade-in duration-200">
            <WebAPKView
              lang={lang}
              theme={theme}
              onInstallPwa={install}
              isInstallable={isInstallable}
            />
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className={`mt-auto border-t py-5 text-center text-xs transition-colors ${
        isDark ? 'border-slate-900 bg-slate-950/90 text-slate-500' : 'border-slate-200 bg-white/90 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 CallPulse • Mobile Calls, WhatsApp, Gmail & Screen Tracker</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsApkModalOpen(true)} className="hover:text-cyan-500 transition">
              {lang === 'si' ? 'Android APK මාර්ගෝපදේශය' : 'Android APK Guide'}
            </button>
            <span>•</span>
            <button onClick={() => setIsExportModalOpen(true)} className="hover:text-cyan-500 transition">
              {lang === 'si' ? 'දත්ත වාර්තා (Export)' : 'Export CSV / JSON'}
            </button>
          </div>
        </div>
      </footer>

      {/* Floating APK Download & Setup Bar */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <a
          href="/CallPulse.apk"
          download="CallPulse.apk"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
          title="Directly download CallPulse.apk file"
        >
          <Download className="w-4 h-4 text-white" />
          <span>CallPulse.apk බාගන්න</span>
        </a>

        <button
          onClick={() => setIsApkModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
          title="Open PWABuilder & WebAPK Generator"
        >
          <Globe className="w-4 h-4 text-white" />
          <span>PWABuilder WebAPK</span>
        </button>
      </div>

      {/* Modals */}
      <APKModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        lang={lang}
        theme={theme}
        onInstallPwa={install}
        isInstallable={isInstallable}
      />

      <AddCallModal
        isOpen={isAddCallModalOpen}
        onClose={() => setIsAddCallModalOpen(false)}
        onSave={handleSaveCall}
        lang={lang}
      />

      <AddWhatsAppModal
        isOpen={isAddWhatsAppModalOpen}
        onClose={() => setIsAddWhatsAppModalOpen(false)}
        onSave={handleSaveWhatsApp}
        officeNumber={officeNumber}
        lang={lang}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        calls={calls}
        whatsapp={whatsapp}
        apps={apps}
        gmail={gmail}
        lang={lang}
      />

    </div>
  );
}
