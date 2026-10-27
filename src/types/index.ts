export type CallType = 'incoming' | 'outgoing' | 'missed' | 'rejected';

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  accuracyMeters?: number;
}

export interface CallRecord {
  id: string;
  type: CallType;
  phoneNumber: string;
  contactName: string;
  durationSeconds: number; // 0 for missed
  timestamp: string; // ISO string
  simSlot: 1 | 2;
  location: LocationInfo;
  notes?: string;
}

export interface WhatsAppRecord {
  id: string;
  type: 'message_incoming' | 'message_outgoing' | 'call_voice' | 'call_video';
  customerName: string;
  customerPhone: string;
  officeNumber: string;
  category: 'Inquiry' | 'Support' | 'Quotation' | 'Payment' | 'General';
  timestamp: string;
  durationSeconds?: number;
  previewText?: string;
  status: 'read' | 'replied' | 'pending';
}

export interface GmailRecord {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  timestamp: string;
  category: 'Client' | 'Invoice' | 'Support' | 'Internal' | 'Promotional';
  status: 'unread' | 'read' | 'replied';
  isImportant: boolean;
  type: 'incoming' | 'outgoing';
}

export interface AppUsageRecord {
  id: string;
  appName: string;
  packageName: string;
  category: 'Social' | 'Communication' | 'Productivity' | 'Entertainment' | 'System' | 'Finance';
  icon: string; // lucide icon identifier or emoji
  minutesUsedToday: number;
  minutesUsedYesterday: number;
  launchCount: number;
  color: string;
}

export interface DayAnalytics {
  date: string;
  totalCalls: number;
  incomingCalls: number;
  outgoingCalls: number;
  missedCalls: number;
  totalDurationSeconds: number;
  incomingDurationSeconds: number;
  outgoingDurationSeconds: number;
  whatsappMessages: number;
  whatsappCalls: number;
  gmailReceived: number;
  totalScreenTimeMinutes: number;
  screenPickups: number;
}

export type Language = 'si' | 'en';
export type Theme = 'dark' | 'light';

export interface ActivityTimelineItem {
  id: string;
  eventType: 'call' | 'whatsapp' | 'gmail' | 'app';
  timestamp: string;
  title: string;
  subtitle: string;
  detail?: string;
  location?: string;
  duration?: string;
  badge?: string;
  iconType: string;
  color: string;
}
