import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Phone,
  Video,
  Send,
  Building2
} from 'lucide-react';
import { WhatsAppRecord, Language } from '../types';

interface AddWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: WhatsAppRecord) => void;
  officeNumber: string;
  lang: Language;
}

export const AddWhatsAppModal: React.FC<AddWhatsAppModalProps> = ({
  isOpen,
  onClose,
  onSave,
  officeNumber,
  lang,
}) => {
  const [type, setType] = useState<WhatsAppRecord['type']>('message_incoming');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [category, setCategory] = useState<WhatsAppRecord['category']>('Inquiry');
  const [previewText, setPreviewText] = useState('');
  const [durationMins, setDurationMins] = useState('4');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone && !customerName) return;

    const isCall = type === 'call_voice' || type === 'call_video';
    const durationSec = isCall ? (parseInt(durationMins || '1', 10) * 60) : undefined;

    const newRecord: WhatsAppRecord = {
      id: `wa-${Date.now()}`,
      type,
      customerName: customerName.trim() || 'New Customer',
      customerPhone: customerPhone.trim() || '+94 7X XXX XXXX',
      officeNumber,
      category,
      timestamp: new Date().toISOString(),
      durationSeconds: durationSec,
      previewText: previewText.trim() || (isCall ? `WhatsApp Call (${durationMins} mins)` : 'WhatsApp inquiry received'),
      status: 'pending',
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-emerald-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'si' ? 'කාර්යාල WhatsApp සටහනක්' : 'Log Office WhatsApp Event'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'si' ? `අංකය: ${officeNumber}` : `Office Number: ${officeNumber}`}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Action type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'si' ? 'ක්‍රියාකාරකම් වර්ගය (Event Type)' : 'Event Type'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('message_incoming')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold border transition gap-1 ${
                  type === 'message_incoming'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === 'si' ? 'පණිවිඩයක්' : 'Message'}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('call_voice')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold border transition gap-1 ${
                  type === 'call_voice'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{lang === 'si' ? 'Voice Call' : 'Voice Call'}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('call_video')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold border transition gap-1 ${
                  type === 'call_video'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{lang === 'si' ? 'Video Call' : 'Video Call'}</span>
              </button>
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              {lang === 'si' ? 'පාරිභෝගිකයාගේ නම' : 'Customer / Client Name'}
            </label>
            <input
              type="text"
              placeholder="e.g. Ruwan Silva / Lanka Traders"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                {lang === 'si' ? 'WhatsApp අංකය' : 'Customer Phone'}
              </label>
              <input
                type="text"
                placeholder="+94 77 999 8888"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                {lang === 'si' ? 'විමසුම් වර්ගය' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Inquiry">{lang === 'si' ? 'විමසීම් (Inquiry)' : 'General Inquiry'}</option>
                <option value="Quotation">{lang === 'si' ? 'මිල ගණන් (Quotation)' : 'Quotation Request'}</option>
                <option value="Support">{lang === 'si' ? 'තාක්ෂණික සහය (Support)' : 'Support'}</option>
                <option value="Payment">{lang === 'si' ? 'ගෙවීම් (Payment)' : 'Payment Confirmation'}</option>
                <option value="General">{lang === 'si' ? 'වෙනත් (General)' : 'Other'}</option>
              </select>
            </div>
          </div>

          {(type === 'call_voice' || type === 'call_video') && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                {lang === 'si' ? 'ඇමතුම් කාලය (විනාඩි)' : 'Call Duration (Minutes)'}
              </label>
              <input
                type="number"
                min="1"
                value={durationMins}
                onChange={(e) => setDurationMins(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              {lang === 'si' ? 'පණිවිඩය / විස්තරය' : 'Message Preview / Note'}
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Inquired about bulk stock discounts..."
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition"
            >
              {lang === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition"
            >
              {lang === 'si' ? 'සුරකින්න' : 'Log WhatsApp Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
