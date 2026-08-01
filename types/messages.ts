export interface ChatAttachment {
  name: string;
  size: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  sender: "patient" | "doctor" | "system";
  text: string;
  timestamp: string;
  attachments?: ChatAttachment[];
}

export type MessageCategory =
  | "Appointment Inquiry"
  | "Prescription Renewal"
  | "Lab Result"
  | "General Query"
  | "Telehealth";

export interface MessageThread {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  category: MessageCategory;
  isUrgent: boolean;
  messages: ChatMessage[];
}

export interface ContactMessageRecord {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status?: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
