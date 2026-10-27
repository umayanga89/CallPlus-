import React, { useState } from 'react';
import {
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Trash2,
  Navigation,
  Compass,
  CheckCircle2,
  Info
} from 'lucide-react';
import { CallRecord, CallType, Language } from '../types';
import { translations, formatDuration } from '../utils/i18n';
import { getGoogleMapsUrl } from '../utils/geolocation';

interface CallLogsViewProps {
  calls: CallRecord[];
  onAddCall: () => void;
  onDeleteCall: (id: string) => void;
  lang: Language;
}

export const CallLogsView: React.FC<CallLogsViewProps> = ({
  calls,
  onAddCall,
  onDeleteCall,
  lang,
}) => {
  const t = translations[lang];
  const [filterType, setFilterType] = useState<'all' | CallType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapCall, setSelectedMapCall] = useState<CallRecord | null>(null);

  const filteredCalls = calls.filter((call) => {
    if (filterType !== 'all' && call.type !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = call.contactName.toLowerCase().includes(q);
      const matchNum = call.phoneNumber.toLowerCase().includes(q);
      const matchLoc = call.location.address.toLowerCase().includes(q);
      return matchName || matchNum || matchLoc;
    }
    return true;
  });

  const incomingTotal = calls.filter((c) => c.type === 'incoming').length;
  const outgoingTotal = calls.filter((c) => c.type === 'outgoing').length;
  const missedTotal = calls.filter((c) => c.type === 'missed').length;

  return (
    <div className="space-y-6">
      
      {/* Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <PhoneIncoming className="w-5 h-5" />
            </span>
            {t.callsSection.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.callsSection.description}
          </p>
        </div>

        <button
          onClick={onAddCall}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.callsSection.logCallBtn}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.callsSection.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterType === 'all'
                ? 'bg-slate-800 border-slate-600 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.callsSection.filterAll} ({calls.length})
          </button>
          <button
            onClick={() => setFilterType('incoming')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterType === 'incoming'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-emerald-400'
            }`}
          >
            <PhoneIncoming className="w-3.5 h-3.5" />
            {t.callsSection.filterIncoming} ({incomingTotal})
          </button>
          <button
            onClick={() => setFilterType('outgoing')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterType === 'outgoing'
                ? 'bg-blue-950/60 border-blue-500 text-blue-400 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-blue-400'
            }`}
          >
            <PhoneOutgoing className="w-3.5 h-3.5" />
            {t.callsSection.filterOutgoing} ({outgoingTotal})
          </button>
          <button
            onClick={() => setFilterType('missed')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterType === 'missed'
                ? 'bg-rose-950/60 border-rose-500 text-rose-400 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-rose-400'
            }`}
          >
            <PhoneMissed className="w-3.5 h-3.5" />
            {t.callsSection.filterMissed} ({missedTotal})
          </button>
        </div>

      </div>

      {/* Call Records List */}
      {filteredCalls.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Info className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">
            {t.callsSection.noCalls}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'si' ? 'නව ඇමතුමක් ඇතුළත් කිරීමට ඉහළ ඇති බොත්තම ඔබන්න.' : 'Click "+ Log / Simulate Call" above to record a new call.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredCalls.map((call) => {
            const isIncoming = call.type === 'incoming';
            const isOutgoing = call.type === 'outgoing';
            const isMissed = call.type === 'missed';
            const dateObj = new Date(call.timestamp);
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={call.id}
                className="group relative p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all duration-200 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Type Icon + Caller details */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      isIncoming
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : isOutgoing
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isIncoming && <PhoneIncoming className="w-5 h-5" />}
                    {isOutgoing && <PhoneOutgoing className="w-5 h-5" />}
                    {isMissed && <PhoneMissed className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                        {call.contactName}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        SIM {call.simSlot}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          isIncoming
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                            : isOutgoing
                            ? 'bg-blue-950/40 border-blue-800 text-blue-400'
                            : 'bg-rose-950/40 border-rose-800 text-rose-400'
                        }`}
                      >
                        {isIncoming
                          ? lang === 'si'
                            ? 'ලැබුණු ඇමතුම (Incoming)'
                            : 'Incoming'
                          : isOutgoing
                          ? lang === 'si'
                            ? 'ගනු ලැබූ ඇමතුම (Outgoing)'
                            : 'Outgoing'
                          : lang === 'si'
                          ? 'මගහැරුණු ඇමතුම (Missed)'
                          : 'Missed Call'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                      <span className="font-mono text-slate-300">{call.phoneNumber}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {timeStr}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-white">
                        {formatDuration(call.durationSeconds, lang)}
                      </span>
                    </div>

                    {call.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        "{call.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: GPS Location & Google Map Pin Action */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  
                  {/* Location badge */}
                  <div
                    onClick={() => setSelectedMapCall(call)}
                    className="cursor-pointer max-w-xs p-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition group/loc text-left"
                    title="Click to view location popup"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 group-hover/loc:text-cyan-200">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{call.location.address}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono pl-5">
                      GPS: {call.location.latitude.toFixed(4)}, {call.location.longitude.toFixed(4)}
                    </div>
                  </div>

                  {/* Direct Google Maps External Link */}
                  <a
                    href={getGoogleMapsUrl(call.location.latitude, call.location.longitude)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600/20 text-slate-300 hover:text-cyan-400 border border-slate-700 transition"
                    title={t.callsSection.viewGoogleMap}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Delete record */}
                  <button
                    onClick={() => onDeleteCall(call.id)}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mini Interactive Map Pin Modal */}
      {selectedMapCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {lang === 'si' ? 'ඇමතුම ලැබුණු Google ස්ථානය' : 'Call GPS Location Details'}
                  </h4>
                  <p className="text-xs text-slate-400">{selectedMapCall.contactName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMapCall(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Simulated Satellite/Street Map Preview */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
              {/* Radial grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              
              <div className="relative text-center p-4 z-10">
                <div className="inline-flex p-3 rounded-full bg-cyan-500/20 text-cyan-400 ring-8 ring-cyan-500/10 animate-bounce mb-2">
                  <MapPin className="w-7 h-7" />
                </div>
                <p className="font-bold text-xs text-white">
                  {selectedMapCall.location.address}
                </p>
                <p className="text-[11px] font-mono text-cyan-300 mt-1">
                  Latitude: {selectedMapCall.location.latitude.toFixed(6)} | Longitude: {selectedMapCall.location.longitude.toFixed(6)}
                </p>
                <p className="text-[10px] text-emerald-400 mt-0.5">
                  Accuracy: ±{selectedMapCall.location.accuracyMeters || 8} meters
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={getGoogleMapsUrl(selectedMapCall.location.latitude, selectedMapCall.location.longitude)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {lang === 'si' ? 'Google Maps හි විවෘත කරන්න' : 'Open in Google Maps'}
              </a>
              <button
                onClick={() => setSelectedMapCall(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                {lang === 'si' ? 'වසන්න' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
