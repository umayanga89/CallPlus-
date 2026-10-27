import React, { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Layers,
  Sparkles
} from 'lucide-react';
import { CallRecord, Language } from '../types';
import { translations, formatDuration } from '../utils/i18n';
import { getGoogleMapsUrl } from '../utils/geolocation';

interface LocationMapViewProps {
  calls: CallRecord[];
  lang: Language;
}

export const LocationMapView: React.FC<LocationMapViewProps> = ({ calls, lang }) => {
  const t = translations[lang];
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(calls[0] || null);

  // Group calls by unique locations
  const locationGroups = calls.reduce<Record<string, CallRecord[]>>((acc, call) => {
    const key = `${call.location.latitude.toFixed(3)},${call.location.longitude.toFixed(3)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(call);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'si' ? 'ඇමතුම් ලැබුණු Google GPS සිතියම' : 'Call GPS Location Tracker'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {lang === 'si'
                ? 'ඔබට ආපු සහ ගත්ත සෑම ඇමතුමක්ම සිදු වූ ස්ථාන Google සිතියම මගින් නිරීක්ෂණය කරන්න'
                : 'Interactive map visualization of all incoming and outgoing call locations with GPS coordinates'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
          <MapPin className="w-4 h-4" />
          <span>{Object.keys(locationGroups).length} {lang === 'si' ? 'විශේෂිත ස්ථාන' : 'Unique GPS Locations'}</span>
        </div>
      </div>

      {/* Main Map Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Map Canvas View */}
        <div className="lg:col-span-2 relative min-h-[420px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
          
          {/* Subtle Grid Matrix Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0284c7 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Map Header Status */}
          <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{lang === 'si' ? 'සජීවී GPS ස්ථානගත කිරීම' : 'Live Geolocation Mesh Active'}</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">
              Sri Lanka & Regional Coords
            </span>
          </div>

          {/* Interactive Pins Simulation Area */}
          <div className="relative my-6 flex-1 flex items-center justify-center min-h-[260px]">
            {/* Outline of Sri Lanka map visualization */}
            <div className="relative w-full max-w-md h-64 border border-dashed border-cyan-800/40 rounded-3xl bg-cyan-950/10 p-4 flex flex-wrap items-center justify-around gap-4">
              
              {calls.slice(0, 7).map((call, idx) => {
                const isSelected = selectedCall?.id === call.id;
                const isIncoming = call.type === 'incoming';

                return (
                  <button
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`relative p-2 rounded-2xl transition-all duration-300 transform group ${
                      isSelected
                        ? 'scale-125 z-20 ring-4 ring-cyan-500/30 bg-slate-900 border-2 border-cyan-400 shadow-xl'
                        : 'hover:scale-110 bg-slate-900/80 border border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isIncoming ? 'bg-emerald-400' : call.type === 'outgoing' ? 'bg-blue-400' : 'bg-rose-400'
                        } ${isSelected ? 'animate-pulse' : ''}`}
                      />
                      <span className="text-[11px] font-bold text-white max-w-[80px] truncate">
                        {call.location.address.split(',')[0]}
                      </span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 border border-cyan-500/50 text-[10px] text-white px-2 py-1 rounded-md whitespace-nowrap z-30 shadow-lg">
                      {call.contactName} ({formatDuration(call.durationSeconds, lang)})
                    </div>
                  </button>
                );
              })}

            </div>
          </div>

          {/* Map Footer Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                {lang === 'si' ? 'ආපු ඇමතුම් (In)' : 'Incoming'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                {lang === 'si' ? 'ගත්ත ඇමතුම් (Out)' : 'Outgoing'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                {lang === 'si' ? 'මගහැරුණු' : 'Missed'}
              </span>
            </div>

            {selectedCall && (
              <a
                href={getGoogleMapsUrl(selectedCall.location.latitude, selectedCall.location.longitude)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{lang === 'si' ? 'Google Maps හි බලන්න' : 'Open in Google Maps'}</span>
              </a>
            )}
          </div>

        </div>

        {/* Right Col: Selected Location Details Card */}
        <div className="space-y-4">
          {selectedCall ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'si' ? 'තෝරාගත් ස්ථානයේ තොරතුරු' : 'Selected Location Details'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  GPS Active
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">
                  {selectedCall.location.address}
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-1">
                  Latitude: {selectedCall.location.latitude.toFixed(6)}
                  <br />
                  Longitude: {selectedCall.location.longitude.toFixed(6)}
                </p>
                <p className="text-[11px] text-emerald-400 mt-1">
                  GPS Accuracy: ±{selectedCall.location.accuracyMeters || 8} meters
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'si' ? 'සම්බන්ධතාව:' : 'Contact:'}</span>
                  <span className="font-bold text-white">{selectedCall.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'si' ? 'දුරකථන අංකය:' : 'Number:'}</span>
                  <span className="font-mono text-slate-300">{selectedCall.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'si' ? 'කතා කළ කාලය:' : 'Duration:'}</span>
                  <span className="font-bold text-emerald-400">{formatDuration(selectedCall.durationSeconds, lang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'si' ? 'වේලාව:' : 'Timestamp:'}</span>
                  <span className="text-slate-300">
                    {new Date(selectedCall.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <a
                href={getGoogleMapsUrl(selectedCall.location.latitude, selectedCall.location.longitude)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <ExternalLink className="w-4 h-4" />
                {lang === 'si' ? 'සැබෑ Google Maps ලින්ක් එක විවෘත කරන්න' : 'View Real Location on Google Maps'}
              </a>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              {lang === 'si' ? 'විස්තර බැලීමට සිතියමේ ස්ථානයක් තෝරන්න' : 'Select a map pin to view details'}
            </div>
          )}

          {/* Quick List of Visited Call Locations */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'si' ? 'අද දවසේ ගමන් කළ / ඇමතුම් ආ ස්ථාන' : 'Locations Recorded Today'}
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {calls.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCall(c)}
                  className={`cursor-pointer p-2 rounded-xl text-xs flex items-center justify-between transition border ${
                    selectedCall?.id === c.id
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate pr-2">{c.location.address}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
