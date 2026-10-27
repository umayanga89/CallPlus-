import React, { useState } from 'react';
import {
  Smartphone,
  Clock,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Compass,
  PlayCircle,
  MessageSquare,
  Mail,
  MapPin,
  Share2,
  Wallet,
  PhoneCall,
  Sliders
} from 'lucide-react';
import { AppUsageRecord, Language } from '../types';
import { translations, formatMinutesToHours } from '../utils/i18n';

interface ScreenTimeViewProps {
  apps: AppUsageRecord[];
  pickups: number;
  onUpdateAppTime: (appId: string, newMinutes: number) => void;
  onAddCustomApp: (newApp: AppUsageRecord) => void;
  onUpdatePickups: (count: number) => void;
  lang: Language;
}

export const ScreenTimeView: React.FC<ScreenTimeViewProps> = ({
  apps,
  pickups,
  onUpdateAppTime,
  onAddCustomApp,
  onUpdatePickups,
  lang,
}) => {
  const t = translations[lang];
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState('');
  const [showAddApp, setShowAddApp] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<AppUsageRecord['category']>('Productivity');
  const [newAppMinutes, setNewAppMinutes] = useState('20');

  const totalMinutesToday = apps.reduce((acc, a) => acc + a.minutesUsedToday, 0);
  const totalMinutesYesterday = apps.reduce((acc, a) => acc + a.minutesUsedYesterday, 0);
  const diffPercent = Math.round(((totalMinutesToday - totalMinutesYesterday) / (totalMinutesYesterday || 1)) * 100);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  apps.forEach((a) => {
    categoryTotals[a.category] = (categoryTotals[a.category] || 0) + a.minutesUsedToday;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Communication': return 'bg-emerald-500 text-emerald-400';
      case 'Productivity': return 'bg-blue-500 text-blue-400';
      case 'Entertainment': return 'bg-rose-500 text-rose-400';
      case 'Social': return 'bg-purple-500 text-purple-400';
      case 'Finance': return 'bg-amber-500 text-amber-400';
      default: return 'bg-cyan-500 text-cyan-400';
    }
  };

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-blue-400" />;
      case 'PlayCircle': return <PlayCircle className="w-5 h-5 text-rose-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-orange-400" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-teal-400" />;
      case 'Share2': return <Share2 className="w-5 h-5 text-purple-400" />;
      case 'Wallet': return <Wallet className="w-5 h-5 text-amber-400" />;
      default: return <PhoneCall className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleSaveAppEdit = (id: string) => {
    const mins = parseInt(editMinutes, 10);
    if (!isNaN(mins) && mins >= 0) {
      onUpdateAppTime(id, mins);
    }
    setEditingAppId(null);
  };

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const newApp: AppUsageRecord = {
      id: `app-${Date.now()}`,
      appName: newAppName.trim(),
      packageName: `com.${newAppName.toLowerCase().replace(/\s+/g, '')}.app`,
      category: newAppCategory,
      icon: 'Sliders',
      minutesUsedToday: parseInt(newAppMinutes || '10', 10),
      minutesUsedYesterday: 15,
      launchCount: 12,
      color: '#38bdf8',
    };

    onAddCustomApp(newApp);
    setNewAppName('');
    setShowAddApp(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Screen Time Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {t.screenSection.title}
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {t.screenSection.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddApp(!showAddApp)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'si' ? 'යෙදුමක් එක් කරන්න' : 'Add App Entry'}</span>
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Screen Time */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t.screenSection.totalUsage}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {formatMinutesToHours(totalMinutesToday, lang)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {diffPercent >= 0 ? (
              <span className="flex items-center text-amber-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{diffPercent}%
              </span>
            ) : (
              <span className="flex items-center text-emerald-400 font-medium">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {diffPercent}%
              </span>
            )}
            <span className="text-slate-500">
              {t.screenSection.vsYesterday} ({formatMinutesToHours(totalMinutesYesterday, lang)})
            </span>
          </div>
        </div>

        {/* Device Pickups */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t.screenSection.pickups}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-400">
              {pickups}
            </span>
            <span className="text-xs text-slate-400">
              {lang === 'si' ? 'වාරයක් අතට ගෙන ඇත' : 'unlocks today'}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onUpdatePickups(pickups + 1)}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              +1 Pickup
            </button>
            <button
              onClick={() => onUpdatePickups(Math.max(0, pickups - 1))}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              -1
            </button>
            <span className="text-[11px] text-slate-500">Avg 4.8 mins / session</span>
          </div>
        </div>

        {/* Health status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {lang === 'si' ? 'ඩිජිටල් සෞඛ්‍ය තත්වය' : 'Digital Wellbeing Status'}
          </span>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{lang === 'si' ? 'සමබර භාවිතයකි (Balanced)' : 'Well Balanced Usage'}</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {lang === 'si'
              ? 'මුළු තිර කාලයෙන් 68% ක් කාර්යාල WhatsApp සහ Productivity සඳහා වැයවී ඇත.'
              : '68% of screen on-time was focused on business communications & work productivity.'}
          </p>
        </div>

      </div>

      {/* Add Custom App Modal form */}
      {showAddApp && (
        <form onSubmit={handleCreateApp} className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 space-y-3">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            {lang === 'si' ? 'නව ඇප් එකක තොරතුරු සටහන් කරන්න' : 'Record New App Usage'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="App Name (e.g. Zoom, Telegram, Excel)"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <select
              value={newAppCategory}
              onChange={(e) => setNewAppCategory(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Productivity">Productivity (කාර්යාලීය)</option>
              <option value="Communication">Communication (සන්නිවේදන)</option>
              <option value="Social">Social Media (සමාජ මාධ්‍ය)</option>
              <option value="Entertainment">Entertainment (විනෝදාස්වාද)</option>
              <option value="Finance">Finance (මූල්‍ය)</option>
              <option value="System">System (පද්ධති)</option>
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Minutes today"
                value={newAppMinutes}
                onChange={(e) => setNewAppMinutes(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="flex-1 py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
              >
                {lang === 'si' ? 'එක් කරන්න' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Category Breakdown Progress Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {t.screenSection.categoryBreakdown}
        </h3>

        {/* Stacked multi-color progress bar */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
          {Object.entries(categoryTotals).map(([cat, mins]) => {
            const pct = Math.max(3, Math.round((mins / (totalMinutesToday || 1)) * 100));
            const colorClass = cat === 'Communication'
              ? 'bg-emerald-500'
              : cat === 'Productivity'
              ? 'bg-blue-500'
              : cat === 'Entertainment'
              ? 'bg-rose-500'
              : cat === 'Social'
              ? 'bg-purple-500'
              : cat === 'Finance'
              ? 'bg-amber-500'
              : 'bg-cyan-500';

            return (
              <div
                key={cat}
                style={{ width: `${pct}%` }}
                className={`${colorClass} h-full transition-all`}
                title={`${cat}: ${formatMinutesToHours(mins, lang)} (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-3 pt-1">
          {Object.entries(categoryTotals).map(([cat, mins]) => {
            const pct = Math.round((mins / (totalMinutesToday || 1)) * 100);
            return (
              <div key={cat} className="flex items-center gap-1.5 text-xs">
                <span className={`w-2 h-2 rounded-full ${
                  cat === 'Communication' ? 'bg-emerald-500' :
                  cat === 'Productivity' ? 'bg-blue-500' :
                  cat === 'Entertainment' ? 'bg-rose-500' :
                  cat === 'Social' ? 'bg-purple-500' :
                  cat === 'Finance' ? 'bg-amber-500' : 'bg-cyan-500'
                }`} />
                <span className="text-slate-300 font-medium">{cat}</span>
                <span className="text-slate-500">({formatMinutesToHours(mins, lang)} • {pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Applications List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            {t.screenSection.allApps}
          </h3>
          <span className="text-xs text-slate-400">
            {apps.length} {lang === 'si' ? 'ක්‍රියාකාරී යෙදුම්' : 'monitored apps'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {apps.map((app) => {
            const pct = Math.round((app.minutesUsedToday / (totalMinutesToday || 1)) * 100);
            const isEditing = editingAppId === app.id;

            return (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left: App icon & info */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {getAppIcon(app.icon)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">{app.appName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${getCategoryColor(app.category)} bg-opacity-20`}>
                        {app.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-mono text-[11px]">{app.packageName}</span>
                      <span>•</span>
                      <span>{app.launchCount} {t.screenSection.launchCount}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Progress bar & duration display/edit */}
                <div className="flex items-center gap-4 sm:min-w-[240px] justify-between sm:justify-end">
                  <div className="flex-1 max-w-[140px] hidden sm:block">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>{pct}% of today</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%`, backgroundColor: app.color }}
                        className="h-full rounded-full transition-all"
                      />
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(e.target.value)}
                        className="w-16 bg-slate-950 border border-cyan-500 rounded-lg px-2 py-1 text-xs text-white text-right"
                      />
                      <span className="text-xs text-slate-400">m</span>
                      <button
                        onClick={() => handleSaveAppEdit(app.id)}
                        className="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white min-w-[70px] text-right">
                        {formatMinutesToHours(app.minutesUsedToday, lang)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingAppId(app.id);
                          setEditMinutes(app.minutesUsedToday.toString());
                        }}
                        className="text-[11px] text-slate-500 hover:text-cyan-400 transition"
                        title="Edit recorded minutes"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
