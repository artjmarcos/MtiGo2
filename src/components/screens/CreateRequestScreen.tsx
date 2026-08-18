import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Camera,
  Mic,
  MessageSquare,
  Smile,
  Clock,
  Coins,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Search,
  Building,
  HeartHandshake,
  Compass,
  Store,
  Layers,
  Crosshair,
  UserCheck,
  FileText,
  HelpCircle,
  Check,
  ArrowRight
} from 'lucide-react';
import { GeoRequest, LocationPoint, ResponseType, RequestCategory, UserProfile } from '../../types';
import { INITIAL_LOCATIONS } from '../../data/mockData';
import { PrimaryButton } from '../common/Buttons';

interface CreateRequestScreenProps {
  user: UserProfile;
  onCreateSuccess: (newReq: GeoRequest) => void;
  onCancel: () => void;
  onRechargeNeeded?: () => void;
}

interface UseCaseTemplate {
  title: string;
  category: RequestCategory;
  role: string;
  roleOrigin: string;
  locationName: string;
  locationAddress: string;
  city: string;
  lat: number;
  lng: number;
  question: string;
  instructions: string;
  reward: number;
  responseType: ResponseType;
  icon: string;
  badge: string;
}

const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  {
    title: 'Publicista / Diseñador (Cotización de Letrero)',
    category: 'profesionales',
    role: 'Publicista en Barcelona (España)',
    roleOrigin: 'Barcelona, España',
    locationName: 'Local Comercial Cafetería La Suiza & Boulevard',
    locationAddress: 'Av. Bernardo O’Higgins #580',
    city: 'Pucón',
    lat: -39.2772,
    lng: -71.9748,
    question: 'Necesito foto nítida y frontal de la fachada de este local comercial en Pucón para enviar cotización urgente de letrero luminoso.',
    instructions: 'Tomar foto frontal completa del letrero actual, altura aproximada de la entrada y ancho de la fachada.',
    reward: 5000,
    responseType: 'foto',
    icon: '🎨',
    badge: 'Profesionales Remotos'
  },
  {
    title: 'Movilidad Reducida / Rampa & Accesibilidad',
    category: 'accesibilidad_social',
    role: 'Persona con Movilidad Reducida',
    roleOrigin: 'Villarrica, Chile',
    locationName: 'Farmacia & Centro Médico (Acceso y Vereda)',
    locationAddress: 'Calle Camilo Henríquez #390',
    city: 'Villarrica',
    lat: -39.2835,
    lng: -72.2270,
    question: '¿La rampa de acceso a la farmacia y la vereda están despejadas sin autos bloqueando o escombros? Me desplazo en silla de ruedas.',
    instructions: 'Foto de la rampa o audio confirmando si hay escalón o vehículo obstruyendo antes de realizar mi traslado.',
    reward: 1500,
    responseType: 'foto',
    icon: '♿',
    badge: 'Ayuda Social & Inclusión'
  },
  {
    title: 'Arquitectura & Inspección de Obra',
    category: 'profesionales',
    role: 'Arquitecta (Estudio en Santiago)',
    roleOrigin: 'Santiago, Chile',
    locationName: 'Obra & Terreno en Construcción Edificio Nahuel',
    locationAddress: 'Calle Colo Colo con Saturnino Epulef',
    city: 'Villarrica',
    lat: -39.2818,
    lng: -72.2215,
    question: 'Arquitecta desde Santiago: Necesito verificar estado del cerramiento perimetral y vereda de la obra antes de mi reunión técnica.',
    instructions: 'Foto panorámica del frente de la obra mostrando la línea de edificación y acceso de camiones.',
    reward: 3500,
    responseType: 'foto',
    icon: '📐',
    badge: 'Inspección Técnica'
  },
  {
    title: 'Adulto Mayor / Ascensor & Apoyo',
    category: 'accesibilidad_social',
    role: 'Adulto Mayor & Cuidador',
    roleOrigin: 'Villarrica, Chile',
    locationName: 'Centro Cultural Municipal y Acceso Adulto Mayor',
    locationAddress: 'Calle Arturo Prat #880',
    city: 'Villarrica',
    lat: -39.2848,
    lng: -72.2241,
    question: '¿Está funcionando el ascensor o rampa para adultos mayores en el Centro Cultural hoy?',
    instructions: 'Confirmar si el ascensor está operativo o si hay personal de apoyo en el acceso.',
    reward: 2000,
    responseType: 'audio',
    icon: '🤝',
    badge: 'Acceso Universal'
  },
  {
    title: 'Turismo & Familia en Playa',
    category: 'playa',
    role: 'Turista Familiar',
    roleOrigin: 'Temuco, Chile',
    locationName: 'Playa Grande Villarrica',
    locationAddress: 'Costanera Pedro de Valdivia s/n',
    city: 'Villarrica',
    lat: -39.2785,
    lng: -72.2274,
    question: '¿Cómo está la playa hoy? ¿Hay mucho viento o gente para ir con niños pequeños?',
    instructions: 'Foto rápida hacia el lago y la arena para ver condiciones climáticas actuales.',
    reward: 500,
    responseType: 'foto',
    icon: '🏖️',
    badge: 'Turismo & Clima'
  }
];

export const CreateRequestScreen: React.FC<CreateRequestScreenProps> = ({
  user,
  onCreateSuccess,
  onCancel,
  onRechargeNeeded
}) => {
  // Location States
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint>(INITIAL_LOCATIONS[0]);
  const [category, setCategory] = useState<RequestCategory>('profesionales');
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  // Form Fields
  const [question, setQuestion] = useState(USE_CASE_TEMPLATES[0].question);
  const [instructions, setInstructions] = useState(USE_CASE_TEMPLATES[0].instructions);
  const [requesterRole, setRequesterRole] = useState(USE_CASE_TEMPLATES[0].role);
  const [requesterOriginCity, setRequesterOriginCity] = useState(USE_CASE_TEMPLATES[0].roleOrigin);
  const [responseType, setResponseType] = useState<ResponseType>('foto');
  const [reward, setReward] = useState<number>(5000);
  const [timeMinutes, setTimeMinutes] = useState<number>(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map Picker Ref
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<L.Map | null>(null);
  const miniMapMarkerRef = useRef<L.Marker | null>(null);

  const commission = Math.round(reward * 0.1);
  const totalCost = reward + commission;
  const hasEnoughBalance = user.balance >= totalCost;

  const rewardPresets = [500, 1000, 2000, 3500, 5000, 10000];

  // Initialize or update mini map when map picker is toggled
  useEffect(() => {
    if (!showMapPicker || !miniMapContainerRef.current) return;

    if (miniMapInstanceRef.current) {
      miniMapInstanceRef.current.remove();
      miniMapInstanceRef.current = null;
    }

    const map = L.map(miniMapContainerRef.current, {
      center: [selectedLocation.lat, selectedLocation.lng],
      zoom: 15,
      zoomControl: true
    });
    miniMapInstanceRef.current = map;

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '&copy; Esri'
      }
    ).addTo(map);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    ).addTo(map);

    const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
      draggable: true
    }).addTo(map);
    miniMapMarkerRef.current = marker;

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      updateCoordinates(pos.lat, pos.lng, 'Punto fijado en mapa satelital');
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      updateCoordinates(e.latlng.lat, e.latlng.lng, 'Punto fijado en mapa satelital');
    });

    return () => {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
  }, [showMapPicker]);

  const updateCoordinates = (lat: number, lng: number, customName?: string) => {
    const updated: LocationPoint = {
      id: `loc_custom_${Date.now()}`,
      name: customName || selectedLocation.name || `Punto GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: selectedLocation.city || 'Chile',
      address: searchAddress || selectedLocation.address || 'Ubicación seleccionada en mapa',
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      category: category
    };
    setSelectedLocation(updated);
  };

  // Open Geolocation search
  const handleOpenSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress.trim()) return;

    setIsSearchingGeocode(true);
    setError(null);

    const query = searchAddress.trim().toLowerCase();

    // Check if user typed coordinates like "-39.277, -71.974"
    const coordMatch = query.match(/^([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      updateCoordinates(lat, lng, `Coordenadas: ${lat}, ${lng}`);
      setIsSearchingGeocode(false);
      if (miniMapInstanceRef.current && miniMapMarkerRef.current) {
        miniMapInstanceRef.current.setView([lat, lng], 16);
        miniMapMarkerRef.current.setLatLng([lat, lng]);
      }
      return;
    }

    try {
      // Live Nominatim OpenStreetMap Geocoding
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress + (query.includes('chile') || query.includes('pucon') || query.includes('villarrica') || query.includes('santiago') || query.includes('barcelona') ? '' : ', Chile')
        )}&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        const locName = place.display_name.split(',')[0];
        const cityPart = place.display_name.split(',')[1] || 'Chile';

        const newLoc: LocationPoint = {
          id: `loc_geo_${Date.now()}`,
          name: locName || searchAddress,
          city: cityPart.trim(),
          address: place.display_name,
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6)),
          category: category
        };

        setSelectedLocation(newLoc);

        if (miniMapInstanceRef.current && miniMapMarkerRef.current) {
          miniMapInstanceRef.current.setView([lat, lng], 16);
          miniMapMarkerRef.current.setLatLng([lat, lng]);
        }
      } else {
        // Fallback to presets or approximate
        const matched = INITIAL_LOCATIONS.find((l) =>
          l.name.toLowerCase().includes(query) || l.address.toLowerCase().includes(query)
        );
        if (matched) {
          setSelectedLocation(matched);
        } else {
          setError('No encontramos la dirección exacta. Puedes fijar el marcador en el mapa satelital.');
          setShowMapPicker(true);
        }
      }
    } catch (err) {
      console.warn('Geocoding fallback:', err);
      setError('Búsqueda rápida aplicada. Puedes ajustar la posición arrastrando el mapa.');
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const applyTemplate = (template: UseCaseTemplate) => {
    setCategory(template.category);
    setQuestion(template.question);
    setInstructions(template.instructions);
    setRequesterRole(template.role);
    setRequesterOriginCity(template.roleOrigin);
    setReward(template.reward);
    setResponseType(template.responseType);

    const newLoc: LocationPoint = {
      id: `loc_tpl_${Date.now()}`,
      name: template.locationName,
      address: template.locationAddress,
      city: template.city,
      lat: template.lat,
      lng: template.lng,
      category: template.category,
      country: 'Chile'
    };
    setSelectedLocation(newLoc);
    setSearchAddress(`${template.locationName}, ${template.city}`);

    if (miniMapInstanceRef.current && miniMapMarkerRef.current) {
      miniMapInstanceRef.current.setView([template.lat, template.lng], 16);
      miniMapMarkerRef.current.setLatLng([template.lat, template.lng]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Por favor escribe tu pregunta.');
      return;
    }
    if (question.length < 8) {
      setError('La pregunta debe tener al menos 8 caracteres.');
      return;
    }
    if (!hasEnoughBalance) {
      setError('No tienes saldo suficiente en tu billetera. Recarga saldo para publicar.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRequest: GeoRequest = {
        id: `req_${Date.now()}`,
        question: question.trim(),
        instructions: instructions.trim(),
        location: selectedLocation,
        category: category,
        reward,
        commission,
        totalCost,
        responseType,
        expiresInMinutes: timeMinutes,
        expiresAt: Date.now() + timeMinutes * 60 * 1000,
        urgency: timeMinutes <= 4 ? 'urgent' : timeMinutes <= 8 ? 'medium' : 'normal',
        requesterName: user.name,
        requesterRole: requesterRole.trim() || 'Usuario MtiGo',
        requesterOriginCity: requesterOriginCity.trim() || 'Remoto / Chile',
        requesterPhone: user.phone,
        requesterAvatar: user.avatar,
        requesterRating: user.rating,
        createdAt: 'Ahora mismo',
        status: 'active',
        responses: []
      };

      setIsSubmitting(false);
      onCreateSuccess(newRequest);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. USE CASE TEMPLATES (Publicistas, Accesibilidad, Arquitectos)
      ─────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#1B3A1F] to-[#2E7D40] text-white p-4 rounded-3xl shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFD166]" />
            <span className="font-bold text-sm tracking-wide">Casos de Uso & Plantillas Rápidas</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
            1-Click
          </span>
        </div>
        <p className="text-xs text-[#B8E0BA] leading-relaxed">
          Selecciona un caso de uso para rellenar automáticamente la ubicación, rol, pregunta y recompensa:
        </p>

        {/* Scrollable Templates */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {USE_CASE_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/15 rounded-2xl p-2.5 text-left transition-all flex items-start gap-2.5 cursor-pointer group"
            >
              <span className="text-2xl p-1 bg-white/15 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {tpl.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#FFD166] truncate">{tpl.badge}</span>
                  <span className="text-xs font-extrabold text-white bg-[#4A9E5C] px-1.5 py-0.2 rounded-md">
                    ${tpl.reward.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="font-bold text-xs text-white truncate">{tpl.title}</div>
                <div className="text-[11px] text-[#B8E0BA] truncate mt-0.5 opacity-90">
                  {tpl.role} &bull; {tpl.city}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ─────────────────────────────────────────────────────────────
            2. OPEN GEOLOCATION SEARCH & MAP PICKER
        ─────────────────────────────────────────────────────────────── */}
        <div className="bg-white border-2 border-[#B8E0BA] rounded-[24px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-extrabold text-sm text-[#1B3A1F] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#4A9E5C]" />
              <span>Punto de Interés (Geolocalización Abierta)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowMapPicker(!showMapPicker)}
              className="text-xs font-bold text-[#4A9E5C] hover:text-[#2E7D40] underline flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              {showMapPicker ? 'Ocultar mapa' : 'Fijar en mapa'}
            </button>
          </div>

          {/* Open Search Field */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Ej: Av. Bernardo O'Higgins 580 Pucón, o coordenadas..."
                className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:border-[#4A9E5C] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1B3A1F] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleOpenSearchSubmit}
              disabled={isSearchingGeocode}
              className="bg-[#1B3A1F] hover:bg-[#2E7D40] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isSearchingGeocode ? (
                <span className="animate-spin text-xs">⏳</span>
              ) : (
                <Search className="w-3.5 h-3.5 text-[#7BC47F]" />
              )}
              <span>Buscar</span>
            </button>
          </div>

          {/* Mini Interactive Map for dropping pins */}
          {showMapPicker && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div
                ref={miniMapContainerRef}
                className="w-full h-44 rounded-2xl overflow-hidden border border-[#7BC47F] shadow-inner"
              />
              <p className="text-[10px] text-[#5A7D60] text-center font-medium">
                💡 Haz clic o arrastra el marcador para fijar cualquier punto exacto en el mundo.
              </p>
            </div>
          )}

          {/* Active Selected Location Banner */}
          <div className="bg-[#E8F5E9] border border-[#B8E0BA] rounded-2xl p-3 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4A9E5C] text-white flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
              📍
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-[#1B3A1F] truncate">{selectedLocation.name}</div>
              <div className="text-[11px] text-[#5A7D60] truncate">{selectedLocation.address}</div>
              <div className="text-[10px] text-[#2E7D40] font-mono mt-0.5">
                Lat: {selectedLocation.lat} &bull; Lng: {selectedLocation.lng} ({selectedLocation.city})
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. CATEGORY & ROLE CONTEXT
        ─────────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E0E8E1] rounded-[24px] p-4 shadow-sm space-y-3">
          <label className="font-bold text-sm text-[#1B3A1F] block">
            Categoría & Contexto de tu Solicitud
          </label>

          {/* Category Selector */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: 'profesionales',
                label: '🏢 Profesionales & Publicidad',
                desc: 'Publicistas, arquitectos, letreros, obras'
              },
              {
                id: 'accesibilidad_social',
                label: '♿ Ayuda Social & Movilidad',
                desc: 'Rampas, veredas, sillas de ruedas'
              },
              {
                id: 'comercio_fachadas',
                label: '🏬 Fachadas & Locales',
                desc: 'Vitrinas, filas, negocios'
              },
              {
                id: 'playa',
                label: '🏖️ Turismo, Playas & Vecinos',
                desc: 'Clima, viento, afluencia'
              }
            ].map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as RequestCategory)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F5E9] border-[#4A9E5C] text-[#1B3A1F] ring-2 ring-[#7BC47F]'
                      : 'bg-[#F4FAF5] border-[#E0E8E1] text-[#5A7D60] hover:bg-[#E8F5E9]/50'
                  }`}
                >
                  <div className="font-bold text-xs text-[#1B3A1F]">{cat.label}</div>
                  <div className="text-[10px] text-[#5A7D60] mt-0.5">{cat.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Requester Identity / Remote Location Context */}
          <div className="pt-2 border-t border-[#E0E8E1] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B3A1F]">¿Quién solicita? (Rol o Ubicación remota)</span>
              <span className="text-[10px] text-[#5A7D60]">Visible para quien responda</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={requesterRole}
                onChange={(e) => setRequesterRole(e.target.value)}
                placeholder="Ej: Publicista en Barcelona, Arquitecta, etc."
                className="bg-[#F4FAF5] border border-[#E0E8E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#1B3A1F] outline-none"
              />
              <input
                type="text"
                value={requesterOriginCity}
                onChange={(e) => setRequesterOriginCity(e.target.value)}
                placeholder="Ej: Barcelona (España), Santiago"
                className="bg-[#F4FAF5] border border-[#E0E8E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#1B3A1F] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. QUESTION & SPECIFIC INSTRUCTIONS
        ─────────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E0E8E1] rounded-[24px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="question-input" className="font-bold text-sm text-[#1B3A1F]">
              ¿Qué necesitas saber o verificar? <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs font-mono ${question.length > 130 ? 'text-red-500' : 'text-[#5A7D60]'}`}>
              {question.length}/140
            </span>
          </div>

          <textarea
            id="question-input"
            rows={3}
            maxLength={140}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ej: Necesito foto nítida de la fachada para cotizar letrero comercial..."
            className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:border-[#4A9E5C] focus:bg-white rounded-2xl p-3 text-xs text-[#1B3A1F] outline-none resize-none font-medium leading-relaxed"
          />

          {/* Instructions Field */}
          <div>
            <label className="font-bold text-xs text-[#5A7D60] block mb-1">
              Instrucciones específicas para la foto / respuesta (Opcional):
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ej: Foto frontal que muestre ancho del letrero y altura de la puerta..."
              className="w-full bg-[#F4FAF5] border border-[#E0E8E1] rounded-xl px-3 py-2 text-xs text-[#1B3A1F] outline-none"
            />
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. RESPONSE TYPE SELECTOR
        ─────────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E0E8E1] rounded-[24px] p-4 shadow-sm space-y-2">
          <label className="font-bold text-sm text-[#1B3A1F] block">
            Formato de Respuesta Requerido
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'foto', label: 'Foto en vivo', icon: <Camera className="w-4 h-4" />, desc: 'Imagen actual' },
              { id: 'audio', label: 'Audio / Voz', icon: <Mic className="w-4 h-4" />, desc: 'Explicación hablada' },
              { id: 'texto', label: 'Texto', icon: <MessageSquare className="w-4 h-4" />, desc: 'Mensaje escrito' },
              { id: 'emoji', label: 'Estado 1-Click', icon: <Smile className="w-4 h-4" />, desc: 'Rápido & simple' }
            ].map((item) => {
              const isSelected = responseType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setResponseType(item.id as ResponseType)}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#1B3A1F] text-white border-[#1B3A1F] shadow-md'
                      : 'bg-[#F4FAF5] border-[#E0E8E1] text-[#1B3A1F] hover:bg-[#E8F5E9]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#7BC47F] text-[#1B3A1F]' : 'bg-white text-[#4A9E5C]'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#5A7D60]'}`}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            6. REWARD AMOUNT ($500 to $10.000)
        ─────────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E0E8E1] rounded-[24px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="reward-slider" className="font-bold text-sm text-[#1B3A1F] block">
                Recompensa para quien responda
              </label>
              <span className="text-xs text-[#5A7D60]">Pago instantáneo al validar la respuesta</span>
            </div>
            <div className="bg-[#E8F5E9] border border-[#B8E0BA] text-[#2E7D40] font-['Fredoka',sans-serif] font-black text-2xl px-3.5 py-1 rounded-xl">
              ${reward.toLocaleString('es-CL')}
            </div>
          </div>

          <input
            id="reward-slider"
            type="range"
            min={500}
            max={10000}
            step={500}
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            className="w-full h-3 bg-[#E8F5E9] rounded-lg appearance-none cursor-pointer accent-[#4A9E5C]"
          />

          {/* Quick Presets */}
          <div className="grid grid-cols-6 gap-1.5">
            {rewardPresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setReward(val)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  reward === val
                    ? 'bg-[#1B3A1F] text-white shadow-sm ring-2 ring-[#7BC47F]'
                    : 'bg-[#F4FAF5] hover:bg-[#E8F5E9] text-[#1B3A1F] border border-[#E0E8E1]'
                }`}
              >
                ${val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            7. EXPIRATION TIME LIMIT (2 to 30 mins)
        ─────────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E0E8E1] rounded-[24px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="time-slider" className="font-bold text-sm text-[#1B3A1F] block">
                Tiempo límite de espera
              </label>
              <span className="text-xs text-[#5A7D60]">Si no se responde a tiempo, tu saldo se reembolsa</span>
            </div>
            <span className="bg-[#F4FAF5] border border-[#E0E8E1] font-bold text-base text-[#1B3A1F] px-2.5 py-0.5 rounded-xl">
              {timeMinutes} min
            </span>
          </div>

          <input
            id="time-slider"
            type="range"
            min={2}
            max={30}
            step={1}
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(Number(e.target.value))}
            className="w-full h-3 bg-[#E8F5E9] rounded-lg appearance-none cursor-pointer accent-[#4A9E5C]"
          />
          <div className="flex justify-between text-[11px] text-[#5A7D60] font-semibold">
            <span>⚡ 2m (Urgente)</span>
            <span>⏱️ 15m (Estándar)</span>
            <span>⏳ 30m (Flexible)</span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            8. SUMMARY & TOTAL CALCULATION
        ─────────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#F4FAF5] to-[#E8F5E9] border-2 border-[#B8E0BA] rounded-[24px] p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5A7D60]">
            <span>Recompensa al usuario que responde</span>
            <span className="font-bold text-[#1B3A1F]">${reward.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#5A7D60]">
            <span>Comisión de servicio MtiGo (10%)</span>
            <span className="font-bold text-[#1B3A1F]">${commission.toLocaleString('es-CL')}</span>
          </div>
          <div className="pt-2 border-t border-[#B8E0BA] flex items-center justify-between">
            <div>
              <span className="font-black text-sm text-[#1B3A1F] block">Total a transferir:</span>
              <span className="text-[10px] text-[#4A9E5C] font-semibold">Retenido con garantía MtiGo</span>
            </div>
            <div className="text-right">
              <span className="font-['Fredoka',sans-serif] font-black text-2xl text-[#2E7D40]">
                ${totalCost.toLocaleString('es-CL')}
              </span>
              <div className="text-[10px] text-[#5A7D60]">
                Tu saldo actual: ${user.balance.toLocaleString('es-CL')}
              </div>
            </div>
          </div>

          {!hasEnoughBalance && (
            <div className="mt-2 bg-[#FFEBEE] border border-[#FFCDD2] rounded-xl p-2.5 text-xs text-[#C62828] flex items-center justify-between">
              <span>Saldo insuficiente (${user.balance})</span>
              {onRechargeNeeded && (
                <button
                  type="button"
                  onClick={onRechargeNeeded}
                  className="font-bold underline text-[#B71C1C] cursor-pointer"
                >
                  Recargar saldo &rarr;
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs font-bold text-[#E57373] bg-[#FFEBEE] p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {/* ─────────────────────────────────────────────────────────────
            9. STICKY BOTTOM BUTTON
        ─────────────────────────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E0E8E1] z-40 max-w-md mx-auto">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-20 h-[58px] rounded-[16px] border-2 border-[#E0E8E1] text-[#5A7D60] font-bold text-sm hover:bg-[#F4FAF5] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <div className="flex-1">
              <PrimaryButton
                type="submit"
                isLoading={isSubmitting}
                disabled={!hasEnoughBalance}
                rightIcon={<CheckCircle2 className="w-5 h-5" />}
              >
                Publicar solicitud (${totalCost.toLocaleString('es-CL')})
              </PrimaryButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
