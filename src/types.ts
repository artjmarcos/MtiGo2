export type ScreenType =
  | 'login'
  | 'otp'
  | 'map'
  | 'create_request'
  | 'request_detail'
  | 'respond_request'
  | 'wallet'
  | 'recharge'
  | 'profile'
  | 'rating'
  | 'notifications'
  | 'admin'
  | 'settings'
  | 'design_system';

export type ResponseType = 'foto' | 'audio' | 'texto' | 'emoji';

export type RequestUrgency = 'normal' | 'medium' | 'urgent';

export type RequestCategory =
  | 'accesibilidad_social'
  | 'profesionales'
  | 'comercio_fachadas'
  | 'turismo'
  | 'playa'
  | 'servicios'
  | 'naturaleza';

export interface LocationPoint {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  mapX?: number; // percentage on stylized map (0-100)
  mapY?: number; // percentage on stylized map (0-100)
  category: RequestCategory;
  country?: string;
}

export interface RequestResponse {
  id: string;
  requestId: string;
  authorName: string;
  authorPhone: string;
  authorAvatar: string;
  authorRating: number;
  type: ResponseType;
  content: string;
  photoUrl?: string;
  audioDuration?: number;
  audioWaveform?: number[];
  timestamp: string;
  isAccepted?: boolean;
}

export interface GeoRequest {
  id: string;
  question: string;
  location: LocationPoint;
  category?: RequestCategory;
  reward: number; // CLP (e.g. 500, 1000, 5000)
  commission: number; // 10%
  totalCost: number; // reward + commission
  responseType: ResponseType;
  expiresInMinutes: number;
  expiresAt: number; // timestamp in ms
  urgency: RequestUrgency;
  requesterName: string;
  requesterRole?: string; // e.g. "Publicista (Barcelona, España)", "Persona con Movilidad Reducida", "Arquitecta (Santiago)"
  requesterOriginCity?: string; // e.g. "Barcelona, España"
  requesterPhone: string;
  requesterAvatar: string;
  requesterRating: number;
  createdAt: string;
  status: 'active' | 'answered' | 'expired';
  responses: RequestResponse[];
  instructions?: string; // specific guidelines for the photo/audit (e.g. "Sacar foto frontal completa del letrero y ancho de la vereda")
}

export interface WalletTransaction {
  id: string;
  type: 'recharge' | 'request_payment' | 'reward_earned' | 'refund';
  amount: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'rejected';
  referenceNumber?: string;
  relatedRequestId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  dateGroup: 'Hoy' | 'Ayer' | 'Esta semana';
  unread: boolean;
  type: 'request_nearby' | 'response_received' | 'payment_received' | 'recharge_approved' | 'system';
  targetScreen?: ScreenType;
  targetId?: string;
}

export interface AdminRecharge {
  id: string;
  userName: string;
  userPhone: string;
  userRut: string;
  bankName: string;
  amount: number;
  operationNumber: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  voucherNote: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  rut: string;
  avatar: string;
  rating: number;
  completedTasks: number;
  requestedTasks: number;
  balance: number;
  level: string;
  isAdmin: boolean;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  soundFx: boolean;
  darkMode: boolean;
  largeText: boolean;
  highContrast: boolean;
  talkBackSimulator: boolean;
  language: 'es' | 'en' | 'arn'; // Spanish, English, Mapudungun
}
