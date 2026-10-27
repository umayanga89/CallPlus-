import React, { useState } from 'react';
import {
  Mail,
  Send,
  Inbox,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  FileText,
  Building2,
  Tag
} from 'lucide-react';
import { GmailRecord, Language, Theme } from '../types';
import { translations } from '../utils/i18n';

interface GmailMonitorViewProps {
  records: GmailRecord[];
  onAddEmail: (email: GmailRecord) => void;
  onDeleteRecord: (id: string) => void;
  lang: Language;
  theme: Theme;
}

export const GmailMonitorView: React.FC<GmailMonitorViewProps> = ({
  records,
  onAddEmail,
  onDeleteRecord,
  lang,
  theme,
}) => {
  const t = translations[lang];
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'important' | 'invoices'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [preview, setPreview] = useState('');
  const [category, setCategory] = useState<GmailRecord['category']>('Client');
  const [isImportant, setIsImportant] = useState(false);

  const isDark = theme === 'dark';

  const totalReceived = records.filter((r) => r.type === 'incoming').length;
  const unreadCount = records.filter((r) => r.status === 'unread').length;
  const sentCount = records.filter((r) => r.type === 'outgoing').length;
  const invoiceCount = records.filter((r) => r.category === 'Invoice').length;

  const filteredRecords = records.filter((r) => {
    if (filterMode === 'unread' && r.status !== 'unread') return false;
    if (filterMode === 'important' && !r.isImportant) return false;
    if (filterMode === 'invoices' && r.category !== 'Invoice') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSub = r.subject.toLowerCase().includes(q);
      const matchSender = r.senderName.toLowerCase().includes(q) || r.senderEmail.toLowerCase().includes(q);
      const matchPrev = r.preview.toLowerCase().includes(q);
      return matchSub || matchSender || matchPrev;
    }
    return true;
  });

  const handleCreateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !subject) return;

    const newRecord: GmailRecord = {
      id: `mail-${Date.now()}`,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim() || 'client@business.lk',
      subject: subject.trim(),
      preview: preview.trim() || 'New client inquiry received in Gmail inbox.',
      timestamp: new Date().toISOString(),
      category,
      status: 'unread',
      isImportant,
      type: 'incoming',
    };

    onAddEmail(newRecord);
    setSenderName('');
    setSenderEmail('');
    setSubject('');
    setPreview('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className={`p-6 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark
          ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-800/40'
          : 'bg-gradient-to-r from-rose-50 via-white to-slate-50 border-rose-200'
      }`}>
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.gmailSection.title}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                Gmail API Sync
              </span>
            </div>
            <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.gmailSection.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.gmailSection.logEmailBtn}</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.gmailSection.receivedToday}</span>
            <Inbox className="w-4 h-4 text-rose-400" />
          </div>
          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalReceived}</span>
          <p className="text-[10px] text-slate-500 mt-1">Inward communications</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.gmailSection.unreadCount}</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold text-amber-400">{unreadCount}</span>
          <p className="text-[10px] text-slate-500 mt-1">Requires user attention</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.gmailSection.sentResponses}</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sentCount}</span>
          <p className="text-[10px] text-emerald-400 mt-1">Replies dispatched</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.gmailSection.filterInvoices}</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{invoiceCount}</span>
          <p className="text-[10px] text-slate-500 mt-1">Payment & Bank alerts</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.gmailSection.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500 ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterMode === 'all'
                ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.gmailSection.filterAll} ({records.length})
          </button>
          <button
            onClick={() => setFilterMode('unread')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterMode === 'unread'
                ? 'bg-amber-600 border-amber-500 text-white shadow-sm'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400'
                : 'bg-white border-slate-200 text-slate-600 hover:text-amber-600'
            }`}
          >
            {t.gmailSection.filterUnread} ({unreadCount})
          </button>
          <button
            onClick={() => setFilterMode('important')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterMode === 'important'
                ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400'
                : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
            }`}
          >
            {t.gmailSection.filterImportant}
          </button>
          <button
            onClick={() => setFilterMode('invoices')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              filterMode === 'invoices'
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400'
                : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600'
            }`}
          >
            {t.gmailSection.filterInvoices} ({invoiceCount})
          </button>
        </div>

      </div>

      {/* Email Records List */}
      <div className="space-y-2.5">
        {filteredRecords.map((r) => {
          const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isUnread = r.status === 'unread';

          return (
            <div
              key={r.id}
              className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark
                  ? `bg-slate-900 border-slate-800 hover:border-rose-500/30 ${isUnread ? 'ring-1 ring-amber-500/30 bg-slate-850' : ''}`
                  : `bg-white border-slate-200 hover:border-rose-300 shadow-sm ${isUnread ? 'ring-1 ring-amber-400 bg-amber-50/20' : ''}`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  r.type === 'outgoing'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : isUnread
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {r.type === 'outgoing' ? <Send className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {r.senderName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      &lt;{r.senderEmail}&gt;
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {r.category}
                    </span>
                    {r.isImportant && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        Important
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {r.subject}
                  </h4>

                  <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {r.preview}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeStr}
                    </span>
                    <span className={`font-medium ${
                      isUnread ? 'text-amber-400' : r.status === 'replied' ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      Status: {r.status.toUpperCase()}
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

      {/* Add Email Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className={`relative w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden my-auto ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
          }`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              isDark ? 'border-slate-800 bg-rose-950/20' : 'border-slate-200 bg-rose-50'
            }`}>
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'si' ? 'නව Gmail ඊමේල් සටහනක්' : 'Log Gmail Email Record'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmail} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Sender Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Enterprises / Client"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Sender Email</label>
                <input
                  type="email"
                  placeholder="client@company.lk"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quotation Request for 100 units"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Client">Client</option>
                    <option value="Invoice">Invoice / Bank</option>
                    <option value="Internal">Internal</option>
                    <option value="Support">Support</option>
                    <option value="Promotional">Promotional</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isImp"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="isImp" className="text-xs font-medium text-slate-400">
                    Mark as Important
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Message Preview</label>
                <textarea
                  rows={2}
                  placeholder="Summary of email content..."
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 resize-none ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg transition"
                >
                  Save Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
