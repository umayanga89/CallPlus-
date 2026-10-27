import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Video,
  Send,
  Building2,
  CheckCheck,
  Clock,
  Edit2,
  Check,
  Plus,
  Trash2,
  PhoneCall,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { WhatsAppRecord, Language } from '../types';
import { translations, formatDuration } from '../utils/i18n';

interface WhatsAppMonitorViewProps {
  records: WhatsAppRecord[];
  officeNumber: string;
  onUpdateOfficeNumber: (num: string) => void;
  onAddWhatsApp: () => void;
  onDeleteRecord: (id: string) => void;
  lang: Language;
}

export const WhatsAppMonitorView: React.FC<WhatsAppMonitorViewProps> = ({
  records,
  officeNumber,
  onUpdateOfficeNumber,
  onAddWhatsApp,
  onDeleteRecord,
  lang,
}) => {
  const t = translations[lang];
  const [isEditingNum, setIsEditingNum] = useState(false);
  const [numInput, setNumInput] = useState(officeNumber);
  const [filterMode, setFilterMode] = useState<'all' | 'messages' | 'calls'>('all');

  const handleSaveNum = () => {
    if (numInput.trim()) {
      onUpdateOfficeNumber(numInput.trim());
      setIsEditingNum(false);
    }
  };

  const incomingMsgs = records.filter((r) => r.type === 'message_incoming').length;
  const outgoingMsgs = records.filter((r) => r.type === 'message_outgoing').length;
  const voiceCalls = records.filter((r) => r.type === 'call_voice').length;
  const videoCalls = records.filter((r) => r.type === 'call_video').length;
  const totalCalls = voiceCalls + videoCalls;

  const filteredRecords = records.filter((r) => {
    if (filterMode === 'messages') {
      return r.type === 'message_incoming' || r.type === 'message_outgoing';
    }
    if (filterMode === 'calls') {
      return r.type === 'call_voice' || r.type === 'call_video';
    }
    return true;
  });

  // Category counts
  const categoryCounts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Office Phone Config */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {t.whatsappSection.title}
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Official Sync
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.whatsappSection.officeNumberLabel}</span>
              {isEditingNum ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={numInput}
                    onChange={(e) => setNumInput(e.target.value)}
                    className="bg-slate-950 border border-emerald-500 rounded-lg px-2 py-0.5 text-xs text-emerald-300 font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleSaveNum}
                    className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 transition"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-emerald-400 font-bold">{officeNumber}</span>
                  <button
                    onClick={() => {
                      setNumInput(officeNumber);
                      setIsEditingNum(true);
                    }}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition"
                    title="Change Office Number"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onAddWhatsApp}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.whatsappSection.logActivityBtn}</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.whatsappSection.incomingMsgs}</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-white">{incomingMsgs}</span>
          <p className="text-[10px] text-slate-500 mt-1">From active clients</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.whatsappSection.voiceCalls}</span>
            <Phone className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-2xl font-bold text-white">{totalCalls}</span>
          <p className="text-[10px] text-slate-500 mt-1">{voiceCalls} voice, {videoCalls} video</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.whatsappSection.avgResponseTime}</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-bold text-white">4.2 mins</span>
          <p className="text-[10px] text-emerald-400 mt-1">94% response rate</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Top Request Type</span>
            <Tag className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xl font-bold text-amber-400 truncate block">Quotation & Inquiry</span>
          <p className="text-[10px] text-slate-500 mt-1">68% business leads</p>
        </div>
      </div>

      {/* Inquiry Categories breakdown */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          {lang === 'si' ? 'කාර්යාලයට ලැබුණු විමසුම් වර්ගීකරණය' : 'Inquiry Category Distribution'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <div
              key={cat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
            >
              <span className="text-slate-300 font-medium">{cat}:</span>
              <span className="font-bold text-emerald-400">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
            filterMode === 'all'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {lang === 'si' ? 'සියල්ල' : 'All Activity'} ({records.length})
        </button>
        <button
          onClick={() => setFilterMode('messages')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
            filterMode === 'messages'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3 h-3" />
          {lang === 'si' ? 'පණිවිඩ' : 'Messages'} ({incomingMsgs + outgoingMsgs})
        </button>
        <button
          onClick={() => setFilterMode('calls')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
            filterMode === 'calls'
              ? 'bg-teal-950/60 border-teal-500 text-teal-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Phone className="w-3 h-3" />
          {lang === 'si' ? 'WhatsApp ඇමතුම්' : 'Voice/Video Calls'} ({totalCalls})
        </button>
      </div>

      {/* Record list */}
      <div className="space-y-2.5">
        {filteredRecords.map((r) => {
          const isCall = r.type === 'call_voice' || r.type === 'call_video';
          const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    r.type === 'message_incoming'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : r.type === 'call_voice'
                      ? 'bg-teal-500/15 text-teal-400'
                      : 'bg-cyan-500/15 text-cyan-400'
                  }`}
                >
                  {r.type === 'message_incoming' && <MessageSquare className="w-4 h-4" />}
                  {r.type === 'message_outgoing' && <Send className="w-4 h-4" />}
                  {r.type === 'call_voice' && <Phone className="w-4 h-4" />}
                  {r.type === 'call_video' && <Video className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{r.customerName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{r.customerPhone}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {r.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">
                    {r.previewText}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span>{timeStr}</span>
                    {r.durationSeconds ? (
                      <span className="text-emerald-400 font-medium">
                        Duration: {formatDuration(r.durationSeconds, lang)}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1 text-slate-400">
                      <CheckCheck className="w-3 h-3 text-cyan-400" />
                      {r.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => onDeleteRecord(r.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
