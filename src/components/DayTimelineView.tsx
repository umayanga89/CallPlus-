import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  MessageSquare,
  Mail,
  Smartphone,
  MapPin,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { CallRecord, WhatsAppRecord, GmailRecord, AppUsageRecord, Language, Theme, ActivityTimelineItem } from '../types';
import { translations, formatDuration } from '../utils/i18n';
import { getGoogleMapsUrl } from '../utils/geolocation';

interface DayTimelineViewProps {
  calls: CallRecord[];
  whatsapp: WhatsAppRecord[];
  gmail: GmailRecord[];
  apps: AppUsageRecord[];
  lang: Language;
  theme: Theme;
}

export const DayTimelineView: React.FC<DayTimelineViewProps> = ({
  calls,
  whatsapp,
  gmail,
  apps,
  lang,
  theme,
}) => {
  const t = translations[lang];
  const [filterType, setFilterType] = useState<'all' | 'call' | 'whatsapp' | 'gmail' | 'app'>('all');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // Generate unified chronological activity items
  const allActivities: ActivityTimelineItem[] = useMemo(() => {
    const list: ActivityTimelineItem[] = [];

    // 1. Calls
    calls.forEach((c) => {
      list.push({
        id: `timeline-call-${c.id}`,
        eventType: 'call',
        timestamp: c.timestamp,
        title: `${c.contactName} (${c.phoneNumber})`,
        subtitle: c.type === 'incoming'
          ? (lang === 'si' ? 'ලැබුණු ඇමතුම (Incoming)' : 'Incoming Call')
          : c.type === 'outgoing'
          ? (lang === 'si' ? 'ගනු ලැබූ ඇමතුම (Outgoing)' : 'Outgoing Call')
          : (lang === 'si' ? 'මගහැරුණු ඇමතුම (Missed)' : 'Missed Call'),
        detail: c.notes ? `"${c.notes}"` : undefined,
        location: c.location.address,
        duration: formatDuration(c.durationSeconds, lang),
        badge: `SIM ${c.simSlot}`,
        iconType: c.type === 'incoming' ? 'PhoneIncoming' : c.type === 'outgoing' ? 'PhoneOutgoing' : 'PhoneMissed',
        color: c.type === 'incoming' ? '#10b981' : c.type === 'outgoing' ? '#3b82f6' : '#ef4444',
      });
    });

    // 2. WhatsApp
    whatsapp.forEach((w) => {
      const isCall = w.type === 'call_voice' || w.type === 'call_video';
      list.push({
        id: `timeline-wa-${w.id}`,
        eventType: 'whatsapp',
        timestamp: w.timestamp,
        title: `${w.customerName} - ${w.category}`,
        subtitle: isCall ? 'WhatsApp Voice/Video Call' : 'WhatsApp Client Message',
        detail: w.previewText,
        duration: w.durationSeconds ? formatDuration(w.durationSeconds, lang) : undefined,
        badge: w.category,
        iconType: isCall ? 'Phone' : 'MessageSquare',
        color: '#22c55e',
      });
    });

    // 3. Gmail
    gmail.forEach((g) => {
      list.push({
        id: `timeline-gmail-${g.id}`,
        eventType: 'gmail',
        timestamp: g.timestamp,
        title: g.senderName,
        subtitle: g.subject,
        detail: g.preview,
        badge: g.category,
        iconType: 'Mail',
        color: '#ea4335',
      });
    });

    // 4. Synthesize realistic mobile app usage sessions based on launch counts
    apps.forEach((a, idx) => {
      // Pick simulated time offsets for app launches today
      const baseHour = 8 + (idx * 2) % 12;
      const d = new Date();
      d.setHours(baseHour, (idx * 17) % 60, 0, 0);

      list.push({
        id: `timeline-app-${a.id}`,
        eventType: 'app',
        timestamp: d.toISOString(),
        title: a.appName,
        subtitle: lang === 'si' ? `යෙදුම විවෘත කිරීම (${a.category})` : `App Launch Session (${a.category})`,
        detail: lang === 'si' ? `අද මුළු භාවිතය: විනාඩි ${a.minutesUsedToday}` : `Used for ~${a.minutesUsedToday} mins total today`,
        duration: `${Math.round(a.minutesUsedToday / (a.launchCount || 1))} mins session`,
        badge: a.category,
        iconType: 'Smartphone',
        color: a.color,
      });
    });

    // Sort descending by timestamp
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [calls, whatsapp, gmail, apps, lang]);

  // Hourly density counts (08:00 to 22:00)
  const hourlyDensity = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let h = 7; h <= 22; h++) counts[h] = 0;

    allActivities.forEach((act) => {
      const hr = new Date(act.timestamp).getHours();
      if (counts[hr] !== undefined) {
        counts[hr] += 1;
      }
    });
    return counts;
  }, [allActivities]);

  const peakHour = useMemo(() => {
    let bestH = 10;
    let maxC = 0;
    Object.entries(hourlyDensity).forEach(([h, count]) => {
      if (count > maxC) {
        maxC = count;
        bestH = parseInt(h, 10);
      }
    });
    return bestH;
  }, [hourlyDensity]);

  const filteredActivities = useMemo(() => {
    return allActivities.filter((act) => {
      if (filterType !== 'all' && act.eventType !== filterType) return false;
      if (selectedHour !== null) {
        const h = new Date(act.timestamp).getHours();
        if (h !== selectedHour) return false;
      }
      return true;
    });
  }, [allActivities, filterType, selectedHour]);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className={`p-6 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark
          ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-800/40'
          : 'bg-gradient-to-r from-indigo-50 via-white to-slate-50 border-indigo-200'
      }`}>
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.timelineSection.title}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold">
                24-Hour Stream
              </span>
            </div>
            <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.timelineSection.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className={`p-3 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <span className={`text-[10px] block uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.timelineSection.totalEvents}
            </span>
            <span className="text-xl font-extrabold text-indigo-400">
              {allActivities.length}
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <span className={`text-[10px] block uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.timelineSection.peakHour}
            </span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">
              {peakHour > 12 ? `${peakHour - 12}:00 PM` : `${peakHour}:00 AM`}
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Density Interactive Chart */}
      <div className={`p-5 rounded-2xl border shadow-lg space-y-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            {t.timelineSection.densityChart}
          </h3>
          {selectedHour !== null && (
            <button
              onClick={() => setSelectedHour(null)}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              {lang === 'si' ? 'සියලු පැය පෙන්වන්න (Clear Filter)' : 'Show All Hours'}
            </button>
          )}
        </div>

        {/* Visual Bar Graph */}
        <div className="h-28 flex items-end justify-between gap-1.5 pt-4 pb-1 px-1 border-b border-slate-800/40">
          {Object.entries(hourlyDensity).map(([hStr, count]) => {
            const h = parseInt(hStr, 10);
            const isSelected = selectedHour === h;
            const isPeak = h === peakHour;
            const maxVal = 5;
            const heightPct = Math.max(14, Math.min(100, Math.round((count / maxVal) * 100)));

            return (
              <button
                key={h}
                onClick={() => setSelectedHour(selectedHour === h ? null : h)}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group transition"
                title={`${h}:00 - ${count} events logged`}
              >
                <span className={`text-[9px] font-bold transition ${
                  isSelected ? 'text-cyan-400 font-extrabold' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {count}
                </span>

                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-md transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-400 ring-2 ring-cyan-400/50'
                      : isPeak
                      ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-md shadow-cyan-500/20'
                      : count > 0
                      ? isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'
                      : isDark ? 'bg-slate-850' : 'bg-slate-100'
                  }`}
                />

                <span className={`text-[9px] font-mono ${
                  isSelected ? 'text-cyan-400 font-bold' : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {h > 12 ? `${h - 12}p` : `${h}a`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.timelineSection.filterAll} ({allActivities.length})
          </button>

          <button
            onClick={() => setFilterType('call')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              filterType === 'call'
                ? 'bg-cyan-600 text-white border-cyan-500'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400'
                : 'bg-white border-slate-200 text-slate-600 hover:text-cyan-600'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.timelineSection.filterCalls} ({calls.length})</span>
          </button>

          <button
            onClick={() => setFilterType('whatsapp')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              filterType === 'whatsapp'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400'
                : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.timelineSection.filterWhatsApp} ({whatsapp.length})</span>
          </button>

          <button
            onClick={() => setFilterType('gmail')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              filterType === 'gmail'
                ? 'bg-rose-600 text-white border-rose-500'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400'
                : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t.timelineSection.filterGmail} ({gmail.length})</span>
          </button>

          <button
            onClick={() => setFilterType('app')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              filterType === 'app'
                ? 'bg-purple-600 text-white border-purple-500'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-purple-400'
                : 'bg-white border-slate-200 text-slate-600 hover:text-purple-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.timelineSection.filterApps} ({apps.length})</span>
          </button>
        </div>
      </div>

      {/* The Master Chronological Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {filteredActivities.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
          }`}>
            {lang === 'si' ? 'මෙම පෙරහනට අදාළ සිදුවීම් කිසිවක් හමු නොවීය.' : 'No activity records match your selection.'}
          </div>
        ) : (
          filteredActivities.map((act) => {
            const timeObj = new Date(act.timestamp);
            const timeStr = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={act.id} className="relative group">
                
                {/* Timeline node icon on the vertical line */}
                <div
                  style={{ backgroundColor: act.color }}
                  className="absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full border-4 border-slate-950 flex items-center justify-center text-white shadow-md z-10 transition-transform group-hover:scale-125"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                {/* Event Card */}
                <div className={`p-4 rounded-2xl border transition-all duration-200 shadow-md ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isDark ? 'bg-slate-950 text-cyan-400 border border-slate-800' : 'bg-slate-100 text-cyan-700 border border-slate-200'
                      }`}>
                        {timeStr}
                      </span>

                      <span
                        style={{ color: act.color, borderColor: act.color }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-opacity-10"
                      >
                        {act.eventType.toUpperCase()}
                      </span>

                      {act.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {act.badge}
                        </span>
                      )}

                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {act.title}
                      </h4>
                    </div>

                    {act.duration && (
                      <span className="text-xs font-semibold text-emerald-400 shrink-0">
                        {act.duration}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {act.subtitle}
                  </p>

                  {act.detail && (
                    <p className={`text-[11px] mt-1.5 italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {act.detail}
                    </p>
                  )}

                  {/* If Call with Location */}
                  {act.location && (
                    <div className={`mt-2.5 p-2 rounded-xl flex items-center justify-between gap-2 text-[11px] ${
                      isDark ? 'bg-slate-950/70 border border-slate-800 text-cyan-300' : 'bg-slate-50 border border-slate-200 text-cyan-800'
                    }`}>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{act.location}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
