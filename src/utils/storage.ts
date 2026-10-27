import { CallRecord, WhatsAppRecord, AppUsageRecord, GmailRecord, Theme } from '../types';
import { INITIAL_CALL_RECORDS, INITIAL_WHATSAPP_RECORDS, INITIAL_APP_USAGES, INITIAL_GMAIL_RECORDS } from '../data/mockData';

const CALLS_KEY = 'callpulse_calls_v1';
const WA_KEY = 'callpulse_whatsapp_v1';
const APPS_KEY = 'callpulse_apps_v1';
const GMAIL_KEY = 'callpulse_gmail_v1';
const OFFICE_NUM_KEY = 'callpulse_office_number_v1';
const PICKUPS_KEY = 'callpulse_pickups_v1';
const THEME_KEY = 'callpulse_theme_v1';

export function getStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function saveStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

export function getStoredCalls(): CallRecord[] {
  try {
    const raw = localStorage.getItem(CALLS_KEY);
    if (!raw) return INITIAL_CALL_RECORDS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_CALL_RECORDS;
  }
}

export function saveStoredCalls(calls: CallRecord[]) {
  try {
    localStorage.setItem(CALLS_KEY, JSON.stringify(calls));
  } catch (e) {
    console.error('Failed to save calls to localStorage', e);
  }
}

export function getStoredWhatsApp(): WhatsAppRecord[] {
  try {
    const raw = localStorage.getItem(WA_KEY);
    if (!raw) return INITIAL_WHATSAPP_RECORDS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_WHATSAPP_RECORDS;
  }
}

export function saveStoredWhatsApp(records: WhatsAppRecord[]) {
  try {
    localStorage.setItem(WA_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save whatsapp records', e);
  }
}

export function getStoredGmail(): GmailRecord[] {
  try {
    const raw = localStorage.getItem(GMAIL_KEY);
    if (!raw) return INITIAL_GMAIL_RECORDS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_GMAIL_RECORDS;
  }
}

export function saveStoredGmail(records: GmailRecord[]) {
  try {
    localStorage.setItem(GMAIL_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save gmail records', e);
  }
}

export function getStoredAppUsage(): AppUsageRecord[] {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    if (!raw) return INITIAL_APP_USAGES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_APP_USAGES;
  }
}

export function saveStoredAppUsage(apps: AppUsageRecord[]) {
  try {
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save app usage', e);
  }
}

export function getStoredOfficeNumber(): string {
  try {
    return localStorage.getItem(OFFICE_NUM_KEY) || '+94 11 250 8899';
  } catch {
    return '+94 11 250 8899';
  }
}

export function saveStoredOfficeNumber(num: string) {
  try {
    localStorage.setItem(OFFICE_NUM_KEY, num);
  } catch (e) {
    console.error('Failed to save office number', e);
  }
}

export function getStoredPickups(): number {
  try {
    const raw = localStorage.getItem(PICKUPS_KEY);
    return raw ? parseInt(raw, 10) : 58;
  } catch {
    return 58;
  }
}

export function saveStoredPickups(num: number) {
  try {
    localStorage.setItem(PICKUPS_KEY, num.toString());
  } catch (e) {
    console.error('Failed to save pickups', e);
  }
}

export function resetAllDataToDefault(): {
  calls: CallRecord[];
  wa: WhatsAppRecord[];
  apps: AppUsageRecord[];
  gmail: GmailRecord[];
} {
  localStorage.removeItem(CALLS_KEY);
  localStorage.removeItem(WA_KEY);
  localStorage.removeItem(APPS_KEY);
  localStorage.removeItem(GMAIL_KEY);
  localStorage.removeItem(PICKUPS_KEY);
  return {
    calls: INITIAL_CALL_RECORDS,
    wa: INITIAL_WHATSAPP_RECORDS,
    apps: INITIAL_APP_USAGES,
    gmail: INITIAL_GMAIL_RECORDS,
  };
}
