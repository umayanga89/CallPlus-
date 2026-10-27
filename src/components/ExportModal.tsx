import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  FileText,
  Download,
  Check,
  Printer
} from 'lucide-react';
import { CallRecord, WhatsAppRecord, AppUsageRecord, GmailRecord, Language } from '../types';
import { formatDuration } from '../utils/i18n';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  calls: CallRecord[];
  whatsapp: WhatsAppRecord[];
  apps: AppUsageRecord[];
  gmail?: GmailRecord[];
  lang: Language;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  calls,
  whatsapp,
  apps,
  gmail = [],
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadCSV = () => {
    // Generate Calls CSV
    const headers = ['Call ID', 'Type', 'Contact Name', 'Phone Number', 'Duration (Seconds)', 'Formatted Duration', 'Timestamp', 'SIM', 'Location Address', 'Latitude', 'Longitude', 'Notes'];
    const rows = calls.map((c) => [
      c.id,
      c.type,
      `"${c.contactName.replace(/"/g, '""')}"`,
      `"${c.phoneNumber}"`,
      c.durationSeconds,
      `"${formatDuration(c.durationSeconds, 'en')}"`,
      `"${c.timestamp}"`,
      c.simSlot,
      `"${c.location.address.replace(/"/g, '""')}"`,
      c.location.latitude,
      c.location.longitude,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CallPulse_Daily_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      summary: {
        totalCalls: calls.length,
        incoming: calls.filter((c) => c.type === 'incoming').length,
        outgoing: calls.filter((c) => c.type === 'outgoing').length,
        missed: calls.filter((c) => c.type === 'missed').length,
        totalDurationSeconds: calls.reduce((acc, c) => acc + c.durationSeconds, 0),
        whatsappInquiries: whatsapp.length,
        gmailEmails: gmail.length,
        totalScreenTimeMinutes: apps.reduce((acc, a) => acc + a.minutesUsedToday, 0),
      },
      calls,
      whatsappRecords: whatsapp,
      gmailRecords: gmail,
      appUsage: apps,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CallPulse_Analytics_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'si' ? 'දත්ත වාර්තාව බාගත කරන්න (Export)' : 'Export Analytics Report'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'si' ? 'Excel, CSV හෝ සම්පූර්ණ JSON ආකෘතියෙන් බාගන්න' : 'Export calls, WhatsApp logs, and screen time to CSV/JSON'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={downloadCSV}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition flex flex-col items-start gap-2 group text-left"
            >
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition">
                  {lang === 'si' ? 'CSV (Excel) වාර්තාව' : 'CSV Spreadsheet'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'si' ? 'ඇමතුම් ලැයිස්තුව, GPS ස්ථාන, කාලය සහිතව' : 'All call records, GPS addresses & talk time.'}
                </p>
              </div>
            </button>

            <button
              onClick={downloadJSON}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition flex flex-col items-start gap-2 group text-left"
            >
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                  {lang === 'si' ? 'JSON සම්පූර්ණ දත්ත' : 'Full JSON Backup'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'si' ? 'WhatsApp, Apps, Calls සියලු තොරතුරු' : 'Complete raw database export for backup.'}
                </p>
              </div>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              {lang === 'si' ? 'මුද්‍රණය කරන්න හෝ PDF ලෙස සුරකින්න (Print/PDF)' : 'Print or Save as PDF Summary'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            {lang === 'si' ? 'වසන්න' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
