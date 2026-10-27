import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  MapPin,
  Compass,
  Check,
  AlertCircle,
  Loader2,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed
} from 'lucide-react';
import { CallRecord, CallType, Language } from '../types';
import { getCurrentDeviceLocation, SRI_LANKA_PRESET_LOCATIONS } from '../utils/geolocation';

interface AddCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: CallRecord) => void;
  lang: Language;
}

export const AddCallModal: React.FC<AddCallModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  const [type, setType] = useState<CallType>('incoming');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [minutes, setMinutes] = useState('3');
  const [seconds, setSeconds] = useState('45');
  const [simSlot, setSimSlot] = useState<1 | 2>(1);
  const [address, setAddress] = useState('World Trade Center, Colombo 01');
  const [latitude, setLatitude] = useState(6.9338);
  const [longitude, setLongitude] = useState(79.8437);
  const [notes, setNotes] = useState('');
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchGps = async () => {
    setIsFetchingGps(true);
    setGpsMessage(null);
    try {
      const loc = await getCurrentDeviceLocation();
      setLatitude(loc.latitude);
      setLongitude(loc.longitude);
      setAddress(loc.address);
      setGpsMessage(
        lang === 'si'
          ? `GPS තහවුරු විය: (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)})`
          : `GPS Locked: (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)})`
      );
    } catch (err) {
      setGpsMessage(
        lang === 'si'
          ? 'GPS ලබාගැනීම අසාර්ථක විය. ස්ථානයක් තෝරන්න.'
          : 'Could not access GPS. Please pick a preset location.'
      );
    } finally {
      setIsFetchingGps(false);
    }
  };

  const handlePresetSelect = (preset: { name: string; lat: number; lng: number }) => {
    setAddress(preset.name);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    const totalSeconds = type === 'missed' ? 0 : (parseInt(minutes || '0', 10) * 60) + parseInt(seconds || '0', 10);

    const newRecord: CallRecord = {
      id: `call-${Date.now()}`,
      type,
      phoneNumber: phoneNumber.trim(),
      contactName: contactName.trim() || (lang === 'si' ? 'නොදන්නා අංකය' : 'Unknown Contact'),
      durationSeconds: Math.max(0, totalSeconds),
      timestamp: new Date().toISOString(),
      simSlot,
      location: {
        latitude,
        longitude,
        address: address.trim() || 'Unknown GPS Location',
        accuracyMeters: 10,
      },
      notes: notes.trim(),
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'si' ? 'නව ඇමතුමක් සටහන් කරන්න (Log Call)' : 'Log New Call & GPS'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'si' ? 'ආපු / ගත්ත ඇමතුම් සහ ලැබුණු ස්ථානය ඇතුළත් කරන්න' : 'Record incoming, outgoing, talk time, and GPS coordinate'}
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
          
          {/* Call Type selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'si' ? 'ඇමතුම් වර්ගය (Call Type)' : 'Call Type'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('incoming')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  type === 'incoming'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <PhoneIncoming className="w-3.5 h-3.5" />
                {lang === 'si' ? 'ආපු (Incoming)' : 'Incoming'}
              </button>
              <button
                type="button"
                onClick={() => setType('outgoing')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  type === 'outgoing'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <PhoneOutgoing className="w-3.5 h-3.5" />
                {lang === 'si' ? 'ගත්ත (Outgoing)' : 'Outgoing'}
              </button>
              <button
                type="button"
                onClick={() => setType('missed')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  type === 'missed'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <PhoneMissed className="w-3.5 h-3.5" />
                {lang === 'si' ? 'මගහැරුණු' : 'Missed'}
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                {lang === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number *'}
              </label>
              <input
                type="text"
                required
                placeholder="+94 77 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                {lang === 'si' ? 'සම්බන්ධතාවයේ නම (Contact Name)' : 'Contact Name'}
              </label>
              <input
                type="text"
                placeholder="Kasun / Office Client"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Duration & SIM */}
          <div className="grid grid-cols-2 gap-3">
            {type !== 'missed' ? (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  {lang === 'si' ? 'කතා කළ කාලය (Duration)' : 'Call Duration'}
                </label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 flex items-center bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5">
                    <input
                      type="number"
                      min="0"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none text-right pr-1"
                    />
                    <span className="text-[11px] text-slate-400">m</span>
                  </div>
                  <div className="flex-1 flex items-center bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none text-right pr-1"
                    />
                    <span className="text-[11px] text-slate-400">s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Duration</label>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-400">
                  0 seconds (Missed call)
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                {lang === 'si' ? 'SIM කාඩ්පත' : 'SIM Slot'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSimSlot(1)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition ${
                    simSlot === 1
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  SIM 1
                </button>
                <button
                  type="button"
                  onClick={() => setSimSlot(2)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition ${
                    simSlot === 2
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  SIM 2
                </button>
              </div>
            </div>
          </div>

          {/* Location and Google GPS section */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'si' ? 'Google GPS පිහිටීම (Call Location)' : 'Google GPS Location'}
              </label>
              <button
                type="button"
                onClick={handleFetchGps}
                disabled={isFetchingGps}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 border border-cyan-500/30 text-[11px] font-medium transition disabled:opacity-50"
              >
                {isFetchingGps ? <Loader2 className="w-3 h-3 animate-spin" /> : <Compass className="w-3 h-3" />}
                {lang === 'si' ? 'මගේ GPS ගන්න' : 'Detect Device GPS'}
              </button>
            </div>

            {gpsMessage && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {gpsMessage}
              </p>
            )}

            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. World Trade Center, Colombo"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />

            {/* Quick Sri Lanka Presets */}
            <div className="pt-1">
              <p className="text-[10px] text-slate-400 mb-1">
                {lang === 'si' ? 'නිතර භාවිත ස්ථාන (Presets):' : 'Quick City Presets:'}
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {SRI_LANKA_PRESET_LOCATIONS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-750 transition"
                  >
                    {p.name.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              {lang === 'si' ? 'සටහන් (Notes)' : 'Call Notes (Optional)'}
            </label>
            <input
              type="text"
              placeholder="Brief details about the call..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Submit */}
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
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
            >
              {lang === 'si' ? 'සුරකින්න (Save Call)' : 'Save Call Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
