import { GeoRequest, LocationPoint, UserProfile, WalletTransaction, AppNotification, AdminRecharge, UserSettings } from '../types';

export const INITIAL_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc_pucon_comercio',
    name: 'Local Comercial Cafetería La Suiza & Boulevard',
    city: 'Pucón',
    address: 'Av. Bernardo O’Higgins #580',
    lat: -39.2772,
    lng: -71.9748,
    mapX: 88,
    mapY: 78,
    category: 'profesionales',
    country: 'Chile'
  },
  {
    id: 'loc_farmacia_rampa',
    name: 'Farmacia & Centro Médico Villarrica (Acceso y Vereda)',
    city: 'Villarrica',
    address: 'Calle Camilo Henríquez #390',
    lat: -39.2835,
    lng: -72.2270,
    mapX: 45,
    mapY: 55,
    category: 'accesibilidad_social',
    country: 'Chile'
  },
  {
    id: 'loc_obra_arquitectura',
    name: 'Obra & Terreno en Construcción Edificio Nahuel',
    city: 'Villarrica',
    address: 'Calle Colo Colo con Saturnino Epulef',
    lat: -39.2818,
    lng: -72.2215,
    mapX: 60,
    mapY: 48,
    category: 'profesionales',
    country: 'Chile'
  },
  {
    id: 'loc_playa_grande',
    name: 'Playa Grande Villarrica',
    city: 'Villarrica',
    address: 'Costanera Pedro de Valdivia s/n',
    lat: -39.2785,
    lng: -72.2274,
    mapX: 28,
    mapY: 34,
    category: 'playa',
    country: 'Chile'
  },
  {
    id: 'loc_costanera',
    name: 'Muelle Histórico y Paseo Peatonal Inclusivo',
    city: 'Villarrica',
    address: 'Av. Costanera con Arturo Prat',
    lat: -39.2801,
    lng: -72.2231,
    mapX: 52,
    mapY: 28,
    category: 'turismo',
    country: 'Chile'
  },
  {
    id: 'loc_centro_cultural_ascensor',
    name: 'Centro Cultural Municipal y Acceso Adulto Mayor',
    city: 'Villarrica',
    address: 'Calle Arturo Prat #880',
    lat: -39.2848,
    lng: -72.2241,
    mapX: 58,
    mapY: 65,
    category: 'accesibilidad_social',
    country: 'Chile'
  },
  {
    id: 'loc_feria_artesanal',
    name: 'Feria Artesanal Mapuche',
    city: 'Villarrica',
    address: 'Av. Pedro de Valdivia #1050',
    lat: -39.2842,
    lng: -72.2289,
    mapX: 42,
    mapY: 62,
    category: 'comercio_fachadas',
    country: 'Chile'
  },
  {
    id: 'loc_notaria',
    name: 'Centro Comercial & Notaría San Martín',
    city: 'Villarrica',
    address: 'Calle San Martín #450',
    lat: -39.2858,
    lng: -72.2255,
    mapX: 68,
    mapY: 72,
    category: 'servicios',
    country: 'Chile'
  }
];

export const INITIAL_REQUESTS: GeoRequest[] = [
  {
    id: 'req_pro_publicista',
    question: 'Necesito foto nítida y frontal de la fachada de este local comercial en Pucón para enviar cotización urgente de letrero luminoso.',
    instructions: 'Por favor tomar foto desde el frente donde se aprecie el ancho del letrero actual, altura aproximada y la entrada del local.',
    location: INITIAL_LOCATIONS[0], // Pucón Comercio
    category: 'profesionales',
    reward: 5000,
    commission: 500,
    totalCost: 5500,
    responseType: 'foto',
    expiresInMinutes: 15,
    expiresAt: Date.now() + 15 * 60 * 1000,
    urgency: 'urgent',
    requesterName: 'Javier Morales (Publicista & Diseñador)',
    requesterRole: 'Publicista en Barcelona (España)',
    requesterOriginCity: 'Barcelona, España',
    requesterPhone: '+34 612 345 678',
    requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    requesterRating: 5.0,
    createdAt: 'Hace 3 min',
    status: 'active',
    responses: []
  },
  {
    id: 'req_accesibilidad_silla',
    question: '¿La rampa de acceso a la farmacia y la vereda están despejadas sin autos bloqueando o escombros? Me desplazo en silla de ruedas.',
    instructions: 'Una foto de la rampa y vereda o audio corto confirmando si hay escalón insalvable para llegar antes de ir en mi traslado.',
    location: INITIAL_LOCATIONS[1], // Farmacia Rampa
    category: 'accesibilidad_social',
    reward: 1500,
    commission: 150,
    totalCost: 1650,
    responseType: 'foto',
    expiresInMinutes: 10,
    expiresAt: Date.now() + 10 * 60 * 1000,
    urgency: 'urgent',
    requesterName: 'Paulina Gómez (Movilidad Reducida)',
    requesterRole: 'Vecina con Movilidad Reducida',
    requesterOriginCity: 'Villarrica, Chile',
    requesterPhone: '+56 9 9876 5432',
    requesterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    requesterRating: 4.9,
    createdAt: 'Hace 5 min',
    status: 'active',
    responses: [
      {
        id: 'resp_acc_1',
        requestId: 'req_accesibilidad_silla',
        authorName: 'Camila Rojas',
        authorPhone: '+56 9 9123 4567',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        authorRating: 5.0,
        type: 'foto',
        content: '¡Hola Paulina! La rampa está 100% despejada, no hay vehículos bloqueando y la puerta automática funciona perfecto. Adjunto foto.',
        photoUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80',
        timestamp: 'Hace 1 min',
        isAccepted: true
      }
    ]
  },
  {
    id: 'req_pro_arquitectura',
    question: 'Arquitecta desde Santiago: Necesito verificar estado del cerramiento perimetral y vereda de la obra antes de mi reunión técnica.',
    instructions: 'Foto panorámica del frente de la obra mostrando la línea de edificación.',
    location: INITIAL_LOCATIONS[2], // Obra Arquitectura
    category: 'profesionales',
    reward: 3500,
    commission: 350,
    totalCost: 3850,
    responseType: 'foto',
    expiresInMinutes: 20,
    expiresAt: Date.now() + 20 * 60 * 1000,
    urgency: 'medium',
    requesterName: 'Arq. Constanza Bravo',
    requesterRole: 'Estudio de Arquitectura (Santiago)',
    requesterOriginCity: 'Santiago, Chile',
    requesterPhone: '+56 9 5566 7788',
    requesterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    requesterRating: 5.0,
    createdAt: 'Hace 8 min',
    status: 'active',
    responses: []
  },
  {
    id: 'req_1',
    question: '¿Cómo está la playa hoy? ¿Hay mucho viento o gente para ir con niños?',
    location: INITIAL_LOCATIONS[3], // Playa Grande
    category: 'playa',
    reward: 500,
    commission: 50,
    totalCost: 550,
    responseType: 'foto',
    expiresInMinutes: 8,
    expiresAt: Date.now() + 8 * 60 * 1000,
    urgency: 'normal',
    requesterName: 'Matías Silva (Turista)',
    requesterRole: 'Turista Familiar',
    requesterOriginCity: 'Temuco, Chile',
    requesterPhone: '+56 9 7845 1290',
    requesterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    requesterRating: 4.9,
    createdAt: 'Hace 12 min',
    status: 'active',
    responses: []
  },
  {
    id: 'req_acc_adulto_mayor',
    question: '¿Está funcionando el ascensor o rampa para adultos mayores en el Centro Cultural hoy?',
    instructions: 'Confirmar si hay personal de apoyo en acceso o ascensor operativo.',
    location: INITIAL_LOCATIONS[5], // Centro Cultural
    category: 'accesibilidad_social',
    reward: 2000,
    commission: 200,
    totalCost: 2200,
    responseType: 'audio',
    expiresInMinutes: 12,
    expiresAt: Date.now() + 12 * 60 * 1000,
    urgency: 'medium',
    requesterName: 'Don Héctor Navarrete (78 años)',
    requesterRole: 'Adulto Mayor & Cuidadora',
    requesterOriginCity: 'Villarrica, Chile',
    requesterPhone: '+56 9 4433 2211',
    requesterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    requesterRating: 4.8,
    createdAt: 'Hace 6 min',
    status: 'active',
    responses: []
  },
  {
    id: 'req_2',
    question: '¿Está abierta la feria artesanal de madera y lana frente al lago ahora?',
    location: INITIAL_LOCATIONS[6], // Feria Artesanal
    category: 'comercio_fachadas',
    reward: 1000,
    commission: 100,
    totalCost: 1100,
    responseType: 'texto',
    expiresInMinutes: 14,
    expiresAt: Date.now() + 14 * 60 * 1000,
    urgency: 'normal',
    requesterName: 'Elena Carrasco',
    requesterRole: 'Compradora local',
    requesterOriginCity: 'Valdivia, Chile',
    requesterPhone: '+56 9 6534 8912',
    requesterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    requesterRating: 4.8,
    createdAt: 'Hace 10 min',
    status: 'active',
    responses: []
  },
  {
    id: 'req_4',
    question: '¿Hay mucha fila afuera de la Notaría en calle San Martín en este momento?',
    location: INITIAL_LOCATIONS[7], // Notaria
    category: 'servicios',
    reward: 2000,
    commission: 200,
    totalCost: 2200,
    responseType: 'audio',
    expiresInMinutes: 6,
    expiresAt: Date.now() + 6 * 60 * 1000,
    urgency: 'urgent',
    requesterName: 'Javiera Paz',
    requesterRole: 'Trámites Express',
    requesterOriginCity: 'Villarrica, Chile',
    requesterPhone: '+56 9 4455 6677',
    requesterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    requesterRating: 4.7,
    createdAt: 'Hace 7 min',
    status: 'active',
    responses: []
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Nicolás Valenzuela',
  phone: '+56 9 8765 4321',
  rut: '18.452.981-K',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  rating: 4.9,
  completedTasks: 34,
  requestedTasks: 12,
  balance: 4500,
  level: 'Local Experto Nivel 3',
  isAdmin: true
};

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_1',
    type: 'reward_earned',
    amount: 500,
    title: 'Respuesta completada',
    description: 'Foto de estado del lago en Playa Grande',
    timestamp: 'Hoy, 12:45',
    status: 'completed',
    relatedRequestId: 'req_1'
  },
  {
    id: 'tx_2',
    type: 'recharge',
    amount: 5000,
    title: 'Recarga por Transferencia',
    description: 'Aprobada por Administrador (Santander)',
    timestamp: 'Ayer, 18:20',
    status: 'completed',
    referenceNumber: 'OP-983412'
  },
  {
    id: 'tx_3',
    type: 'request_payment',
    amount: -1100,
    title: 'Publicación de solicitud',
    description: 'Consulta Feria Artesanal ($1.000 + $100 comisión)',
    timestamp: '15 Ago, 10:15',
    status: 'completed',
    relatedRequestId: 'req_2'
  },
  {
    id: 'tx_4',
    type: 'refund',
    amount: 550,
    title: 'Reembolso por expiración',
    description: 'Solicitud no respondida en tiempo límite',
    timestamp: '12 Ago, 16:30',
    status: 'completed'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: '¡Nueva solicitud cerca de ti! 📍',
    body: 'Matías pregunta por la Playa Grande. Gana $500 enviando una foto.',
    timestamp: 'Hace 4 min',
    dateGroup: 'Hoy',
    unread: true,
    type: 'request_nearby',
    targetScreen: 'request_detail',
    targetId: 'req_1'
  },
  {
    id: 'notif_2',
    title: '¡Pago recibido! 💰',
    body: 'Se abonaron $500 a tu saldo por tu respuesta sobre la Costanera.',
    timestamp: 'Hace 2 horas',
    dateGroup: 'Hoy',
    unread: true,
    type: 'payment_received',
    targetScreen: 'wallet'
  },
  {
    id: 'notif_3',
    title: 'Recarga confirmada ✅',
    body: 'Tu transferencia de $5.000 fue verificada con éxito por el equipo MtiGo.',
    timestamp: 'Ayer, 18:21',
    dateGroup: 'Ayer',
    unread: false,
    type: 'recharge_approved',
    targetScreen: 'wallet'
  },
  {
    id: 'notif_4',
    title: 'Bienvenido a MtiGo Villarrica 🏔️',
    body: 'Conéctate con tu comunidad y gana dinero compartiendo lo que ves.',
    timestamp: '14 Ago',
    dateGroup: 'Esta semana',
    unread: false,
    type: 'system',
    targetScreen: 'map'
  }
];

export const INITIAL_ADMIN_RECHARGES: AdminRecharge[] = [
  {
    id: 'rec_101',
    userName: 'Gonzalo Miranda',
    userPhone: '+56 9 6543 2190',
    userRut: '17.892.341-2',
    bankName: 'Banco Estado (CuentaRUT)',
    amount: 3000,
    operationNumber: 'TRF-774921',
    timestamp: 'Hace 12 min',
    status: 'pending',
    voucherNote: 'Comprobante verificado en cuenta'
  },
  {
    id: 'rec_102',
    userName: 'Sofía Valenzuela',
    userPhone: '+56 9 8812 3344',
    userRut: '19.123.456-7',
    bankName: 'Banco Santander',
    amount: 5000,
    operationNumber: 'OP-449102',
    timestamp: 'Hace 35 min',
    status: 'pending',
    voucherNote: 'Monto coincide con cartola'
  },
  {
    id: 'rec_103',
    userName: 'Patricio Alarcón',
    userPhone: '+56 9 7722 8899',
    userRut: '16.554.321-9',
    bankName: 'Banco de Chile',
    amount: 10000,
    operationNumber: 'CHL-998822',
    timestamp: 'Hace 2 horas',
    status: 'approved',
    voucherNote: 'Aprobado por Admin'
  }
];

export const INITIAL_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  soundFx: true,
  darkMode: false,
  largeText: false,
  highContrast: false,
  talkBackSimulator: false,
  language: 'es'
};
