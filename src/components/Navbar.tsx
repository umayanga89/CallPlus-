import React from 'react';
import {
  PhoneCall,
  Download,
  Languages,
  Smartphone,
  Calendar,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../utils/i18n';
import { downloadCallPulseApkBlob } from '../utils/apkDownloader';

interface NavbarProps {
  lang: Language;
  theme: Theme;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  activePeriod: 'today' | 'yesterday' | 'week' | 'all';
  onSelectPeriod: (p: 'today' | 'yesterday' | 'week' | 'all') => void;
  onOpenApkModal: () => void;
  onOpenExportModal: () => void;
  onResetData: () => void;
  isInstallable: boolean;
  onInstallPwa: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  activePeriod,
  onSelectPeriod,
  onOpenApkModal,
  onOpenExportModal,
  onResetData,
  isInstallable,
  onInstallPwa,
  isPhoneFrame,
  onTogglePhoneFrame,
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
      isDark ? 'bg-slate-950/85 border-slate-800' : 'bg-white/85 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-bold text-lg tracking-tight flex items-center gap-1.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  CallPulse
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isDark ? 'bg-cyan-950 border-cyan-800/60 text-cyan-400' : 'bg-cyan-100 border-cyan-300 text-cyan-800'
                  }`}>
                    APK
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </h1>
              </div>
              <p className={`text-[11px] hidden sm:block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Period selector */}
          <div className={`hidden md:flex items-center border rounded-xl p-1 text-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => onSelectPeriod('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activePeriod === 'today'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.today}
            </button>
            <button
              onClick={() => onSelectPeriod('yesterday')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activePeriod === 'yesterday'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.yesterday}
            </button>
            <button
              onClick={() => onSelectPeriod('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activePeriod === 'week'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.last7Days}
            </button>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition text-xs font-semibold ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title={isDark ? t.lightMode : t.darkMode}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xs:inline">{lang === 'si' ? 'දීප්තිමත්' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden xs:inline">{lang === 'si' ? 'අඳුරු' : 'Dark'}</span>
                </>
              )}
            </button>

            {/* Phone view simulator toggle */}
            <button
              onClick={onTogglePhoneFrame}
              title={isPhoneFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Phone Preview'}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                isPhoneFrame
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isPhoneFrame ? 'Full' : 'Phone'}</span>
            </button>

            {/* Language Switcher (Sinhala / English) */}
            <button
              onClick={onToggleLang}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Toggle Sinhala / English"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-500" />
              <span>{lang === 'si' ? 'සිංහල' : 'ENG'}</span>
            </button>

            {/* In-app PWA install button (if installable) */}
            {isInstallable && (
              <button
                onClick={onInstallPwa}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition animate-pulse"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'si' ? 'Install' : 'Install'}</span>
              </button>
            )}

            {/* Direct Download CallPulse.apk button (High Visibility) */}
            <button
              onClick={() => downloadCallPulseApkBlob()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
              title={lang === 'si' ? 'CallPulse.apk සෘජුවම බාගන්න (Direct Download APK)' : 'Direct Download CallPulse.apk (4.3 KB)'}
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden md:inline">Direct Download CallPulse.apk</span>
              <span className="md:hidden">Direct APK</span>
            </button>

            {/* APK Setup Guide Modal button */}
            <button
              onClick={onOpenApkModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.downloadApkGuide}</span>
              <span className="xs:hidden">Guide</span>
            </button>

            {/* Reset data */}
            <button
              onClick={onResetData}
              title={lang === 'si' ? 'දත්ත මුල සිට සකසන්න' : 'Reset Sample Data'}
              className={`p-2 rounded-xl border transition ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
