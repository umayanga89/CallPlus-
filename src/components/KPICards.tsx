import React from 'react';
import {
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  MessageSquare,
  Smartphone,
  PhoneCall,
  Mail,
  Inbox
} from 'lucide-react';
import { CallRecord, WhatsAppRecord, AppUsageRecord, GmailRecord, Language, Theme } from '../types';
import { translations, formatDuration, formatMinutesToHours } from '../utils/i18n';

interface KPICardsProps {
  calls: CallRecord[];
  whatsapp: WhatsAppRecord[];
  gmail: GmailRecord[];
  apps: AppUsageRecord[];
  pickups: number;
  lang: Language;
  theme: Theme;
  onSelectTab: (tab: 'calls' | 'whatsapp' | 'gmail' | 'screenTime' | 'locations' | 'analytics' | 'dayTimeline') => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  calls,
  whatsapp,
  gmail,
  apps,
  pickups,
  lang,
  theme,
  onSelectTab,
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  const incomingCalls = calls.filter((c) => c.type === 'incoming');
  const outgoingCalls = calls.filter((c) => c.type === 'outgoing');
  const missedCalls = calls.filter((c) => c.type === 'missed');
  const totalCalls = calls.length;

  const totalDurationSeconds = calls.reduce((acc, c) => acc + c.durationSeconds, 0);
  const incomingDuration = incomingCalls.reduce((acc, c) => acc + c.durationSeconds, 0);
  const outgoingDuration = outgoingCalls.reduce((acc, c) => acc + c.durationSeconds, 0);

  const waMessages = whatsapp.filter((w) => w.type === 'message_incoming' || w.type === 'message_outgoing').length;
  const waCalls = whatsapp.filter((w) => w.type === 'call_voice' || w.type === 'call_video').length;

  const gmailReceived = gmail.filter((g) => g.type === 'incoming').length;
  const gmailUnread = gmail.filter((g) => g.status === 'unread').length;

  const totalScreenMinutes = apps.reduce((acc, a) => acc + a.minutesUsedToday, 0);
  const topApp = [...apps].sort((a, b) => b.minutesUsedToday - a.minutesUsedToday)[0];

  const cardBg = isDark
    ? 'bg-slate-900/90 border-slate-800'
    : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      
      {/* 1. Calls Received & Made Card */}
      <div
        onClick={() => onSelectTab('calls')}
        className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-4 hover:border-cyan-500/50 transition-all duration-300 shadow-lg ${cardBg}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.kpis.totalCalls}
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {totalCalls}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            {lang === 'si' ? 'ඇමතුම්' : 'calls'}
          </span>
        </div>

        {/* Breakdown pills */}
        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800/40">
          <div className="text-center p-1 rounded-md bg-emerald-950/30 border border-emerald-900/40">
            <div className="flex items-center justify-center gap-0.5 text-[10px] text-emerald-400 font-bold">
              <PhoneIncoming className="w-2.5 h-2.5" />
              <span>{incomingCalls.length}</span>
            </div>
            <p className="text-[8px] text-slate-400">{lang === 'si' ? 'ආපු' : 'In'}</p>
          </div>

          <div className="text-center p-1 rounded-md bg-blue-950/30 border border-blue-900/40">
            <div className="flex items-center justify-center gap-0.5 text-[10px] text-blue-400 font-bold">
              <PhoneOutgoing className="w-2.5 h-2.5" />
              <span>{outgoingCalls.length}</span>
            </div>
            <p className="text-[8px] text-slate-400">{lang === 'si' ? 'ගත්ත' : 'Out'}</p>
          </div>

          <div className="text-center p-1 rounded-md bg-rose-950/30 border border-rose-900/40">
            <div className="flex items-center justify-center gap-0.5 text-[10px] text-rose-400 font-bold">
              <PhoneMissed className="w-2.5 h-2.5" />
              <span>{missedCalls.length}</span>
            </div>
            <p className="text-[8px] text-slate-400">{lang === 'si' ? 'මිස්' : 'Miss'}</p>
          </div>
        </div>
      </div>

      {/* 2. Total Talk Time Card */}
      <div
        onClick={() => onSelectTab('calls')}
        className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-4 hover:border-blue-500/50 transition-all duration-300 shadow-lg ${cardBg}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.kpis.talkTime}
          </span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatDuration(totalDurationSeconds, lang)}
          </span>
        </div>

        <div className="space-y-1 pt-2 border-t border-slate-800/40 text-[10px]">
          <div className="flex justify-between text-slate-400">
            <span>{lang === 'si' ? 'ආපු ඇමතුම්:' : 'In talk:'}</span>
            <span className="text-emerald-400 font-semibold">{formatDuration(incomingDuration, lang)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{lang === 'si' ? 'ගත්ත ඇමතුම්:' : 'Out talk:'}</span>
            <span className="text-blue-400 font-semibold">{formatDuration(outgoingDuration, lang)}</span>
          </div>
        </div>
      </div>

      {/* 3. Office WhatsApp Card */}
      <div
        onClick={() => onSelectTab('whatsapp')}
        className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-4 hover:border-emerald-500/50 transition-all duration-300 shadow-lg ${cardBg}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.kpis.whatsappOffice}
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {waMessages + waCalls}
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">
            {lang === 'si' ? 'ක්‍රියාකාරකම්' : 'activity'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/40 text-[10px]">
          <div className={`p-1 rounded text-center border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <span className="text-slate-400 block">{lang === 'si' ? 'පණිවිඩ' : 'Msgs'}</span>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{waMessages}</span>
          </div>
          <div className={`p-1 rounded text-center border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <span className="text-slate-400 block">{lang === 'si' ? 'ඇමතුම්' : 'Calls'}</span>
            <span className="font-bold text-emerald-400">{waCalls}</span>
          </div>
        </div>
      </div>

      {/* 4. NEW: Gmail Activity Card */}
      <div
        onClick={() => onSelectTab('gmail')}
        className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-4 hover:border-rose-500/50 transition-all duration-300 shadow-lg ${cardBg}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.kpis.gmailTotal}
          </span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition">
            <Mail className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {gmailReceived}
          </span>
          <span className="text-[11px] font-semibold text-rose-400">
            {lang === 'si' ? 'ඊමේල් ආවා' : 'inbox'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/40 text-[10px]">
          <div className={`p-1 rounded text-center border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <span className="text-slate-400 block">{lang === 'si' ? 'නොකියවූ' : 'Unread'}</span>
            <span className="font-bold text-amber-400">{gmailUnread}</span>
          </div>
          <div className={`p-1 rounded text-center border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <span className="text-slate-400 block">{lang === 'si' ? 'යැවූ' : 'Sent'}</span>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{gmail.filter(g => g.type === 'outgoing').length}</span>
          </div>
        </div>
      </div>

      {/* 5. Screen Time & App Usage Card */}
      <div
        onClick={() => onSelectTab('screenTime')}
        className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-4 hover:border-purple-500/50 transition-all duration-300 shadow-lg ${cardBg}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.kpis.screenTime}
          </span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
            <Smartphone className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatMinutesToHours(totalScreenMinutes, lang)}
          </span>
        </div>

        <div className="space-y-1 pt-2 border-t border-slate-800/40 text-[10px]">
          <div className="flex justify-between">
            <span className="text-slate-400">{lang === 'si' ? 'Top App:' : 'Top app:'}</span>
            <span className="text-cyan-400 font-semibold truncate max-w-[95px]">
              {topApp ? topApp.appName.split(' ')[0] : 'WhatsApp'} ({topApp?.minutesUsedToday}m)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{lang === 'si' ? 'Pickups:' : 'Pickups:'}</span>
            <span className="text-purple-400 font-bold">{pickups} {lang === 'si' ? 'වාර' : 'times'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
