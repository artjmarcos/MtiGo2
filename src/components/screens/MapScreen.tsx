import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Camera,
  Mic,
  MessageSquare,
  Smile,
  Plus,
  Crosshair,
  Sparkles,
  Flame,
  Layers,
  ChevronRight,
  Clock,
  Filter,
  Navigation,
  Compass,
  Globe,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Check,
  Eye,
  Info,
  Map as MapIcon,
  Sun,
  Building,
  HeartHandshake,
  Store,
  UserCheck
} from 'lucide-react';
import { GeoRequest, LocationPoint, UserProfile, RequestCategory } from '../../types';
import { PrimaryButton } from '../common/Buttons';

interface MapScreenProps {
  requests: GeoRequest[];
  user: UserProfile;
  onSelectRequest: (request: GeoRequest) => void;
  onCreateRequest: () => void;
  onNavigateToWallet: () => void;
  onNavigateToProfile: () => void;
  onNavigateToNotifications?: () => void;
}

type MapLayerType = 'satellite_hd' | 'satellite_hybrid' | 'streets' | 'terrain';

interface PresetLocation {
  name: string;
  label: string;
  icon: string;
  lat: number;
  lng: number;
  zoom: number;
}

const PRESET_LOCATIONS: PresetLocation[] = [
  { name: 'Pucon', label: 'Pucón (Fachadas & Letreros)', icon: '🏬', lat: -39.2772, lng: -71.9748, zoom: 16 },
  { name: 'Villarrica', label: 'Villarrica Centro (Rampas & Salud)', icon: '⛵', lat: -39.2825, lng: -72.2260, zoom: 15 },
  { name: 'Playa Grande', label: 'Playa Grande Villarrica', icon: '🏖️', lat: -39.2785, lng: -72.2274, zoom: 17 },
  { name: 'Volcan', label: 'Volcán Villarrica (Rutas)', icon: '🌋', lat: -39.4203, lng: -71.9396, zoom: 13 },
  { name: 'Santiago', label: 'Santiago Centro (Estudios)', icon: '🏢', lat: -33.4489, lng: -70.6693, zoom: 13 },
  { name: 'Chile', label: 'Chile Completo', icon: '🇨🇱', lat: -35.6751, lng: -71.5430, zoom: 5 },
  { name: 'Mundo', label: 'Mapamundi Global', icon: '🌍', lat: 20, lng: 0, zoom: 2 }
];

export const MapScreen: React.FC<MapScreenProps> = ({
  requests,
  user,
  onSelectRequest,
  onCreateRequest,
  onNavigateToWallet,
  onNavigateToProfile
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayLayerRef = useRef<L.TileLayer | null>(null);

  const [currentLayer, setCurrentLayer] = useState<MapLayerType>('satellite_hd');
  const [filterType, setFilterType] = useState<
    'all' | 'accesibilidad_social' | 'profesionales' | 'comercio_fachadas' | 'playa' | 'urgent' | 'high_reward'
  >('all');
  const [selectedBubble, setSelectedBubble] = useState<GeoRequest | null>(requests[0] || null);
  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [showLocationPresets, setShowLocationPresets] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([-39.2801, -72.2231]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Pucón & Villarrica');

  // Filter requests based on active chip
  const filteredRequests = requests.filter((req) => {
    if (filterType === 'all') return true;
    if (filterType === 'urgent') return req.urgency === 'urgent';
    if (filterType === 'high_reward') return req.reward >= 2000;
    if (filterType === 'accesibilidad_social') return req.category === 'accesibilidad_social';
    if (filterType === 'profesionales') return req.category === 'profesionales';
    if (filterType === 'comercio_fachadas') return req.category === 'comercio_fachadas';
    if (filterType === 'playa') return req.category === 'playa';
    return true;
  });

  // Layer Tile Configurations
  const getTileConfig = (layerType: MapLayerType) => {
    switch (layerType) {
      case 'satellite_hd':
        return {
          base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          overlay: null,
          attribution: '&copy; Esri World Imagery, Maxar, Earthstar Geographics'
        };
      case 'satellite_hybrid':
        return {
          base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          overlay: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri World Imagery & Labels'
        };
      case 'streets':
        return {
          base: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          overlay: null,
          attribution: '&copy; OpenStreetMap contributors'
        };
      case 'terrain':
        return {
          base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          overlay: null,
          attribution: '&copy; Esri Topo Map'
        };
      default:
        return {
          base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          overlay: null,
          attribution: '&copy; Esri'
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: Pucon / Villarrica region
    const map = L.map(mapContainerRef.current, {
      center: [-39.2772, -71.9748],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Base Tile Layer
    const tileConfig = getTileConfig(currentLayer);
    const tileLayer = L.tileLayer(tileConfig.base, {
      maxZoom: 19,
      attribution: tileConfig.attribution
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    if (tileConfig.overlay) {
      const overlayLayer = L.tileLayer(tileConfig.overlay, {
        maxZoom: 19
      }).addTo(map);
      overlayLayerRef.current = overlayLayer;
    }

    // Layer group for all custom markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    // Map Zoom & Move listeners
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when currentLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    if (overlayLayerRef.current) {
      map.removeLayer(overlayLayerRef.current);
      overlayLayerRef.current = null;
    }

    const config = getTileConfig(currentLayer);
    const newTile = L.tileLayer(config.base, {
      maxZoom: 19,
      attribution: config.attribution
    }).addTo(map);
    tileLayerRef.current = newTile;

    if (config.overlay) {
      const newOverlay = L.tileLayer(config.overlay, {
        maxZoom: 19
      }).addTo(map);
      overlayLayerRef.current = newOverlay;
    }
  }, [currentLayer]);

  // Update Markers when filteredRequests or selectedBubble changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Render User GPS Marker
    const userHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="w-14 h-14 rounded-full bg-[#4A9E5C]/30 animate-ping absolute"></div>
        <div class="w-7 h-7 rounded-full bg-white border-3 border-[#4A9E5C] shadow-xl relative flex items-center justify-center">
          <div class="w-3.5 h-3.5 rounded-full bg-[#4A9E5C]"></div>
        </div>
        <div class="absolute -bottom-5 bg-[#1B3A1F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/40">
          Tú estás aquí
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: userHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const userMarker = L.marker(userLocation, { icon: userIcon, zIndexOffset: 500 }).addTo(markersGroup);
    userMarkerRef.current = userMarker;

    // 2. Render Request Markers with Category-Specific Styling
    filteredRequests.forEach((req) => {
      const isSelected = selectedBubble?.id === req.id;
      const isUrgent = req.urgency === 'urgent';
      const isAccessibility = req.category === 'accesibilidad_social';
      const isProfessional = req.category === 'profesionales';

      let borderColor = '#7BC47F';
      let ringClass = 'ring-3 ring-[#7BC47F]/40';
      let badgeLabel = `$${req.reward}`;
      let categoryGlyph = '📍';
      let headerBg = 'bg-[#1B3A1F]';

      if (isAccessibility) {
        borderColor = '#00B4D8';
        ringClass = 'ring-4 ring-[#00B4D8]/50';
        categoryGlyph = '♿';
        headerBg = 'bg-[#0077B6]';
      } else if (isProfessional) {
        borderColor = '#7209B7';
        ringClass = 'ring-4 ring-[#7209B7]/50';
        categoryGlyph = '📐';
        headerBg = 'bg-[#480CA8]';
      } else if (req.responseType === 'foto') {
        categoryGlyph = '📷';
      } else if (req.responseType === 'audio') {
        categoryGlyph = '🎙️';
      }

      if (isUrgent) {
        borderColor = '#E57373';
        ringClass = 'animate-urgent-pulse ring-4 ring-[#E57373]/60';
      }

      const markerHtml = `
        <div class="relative cursor-pointer transition-transform duration-200 hover:scale-115 -translate-x-1/2 -translate-y-1/2">
          <div class="w-[72px] h-[72px] rounded-full bg-white/95 backdrop-blur-md shadow-[0_10px_28px_rgba(0,0,0,0.45)] flex flex-col items-center justify-center border-3 ${ringClass} ${
            isSelected ? 'scale-115 !border-white ring-4 ring-[#FFD166]' : ''
          }" style="border-color: ${isSelected ? '#FFD166' : borderColor}">
            
            <!-- Category & Type Icon Tag -->
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${headerBg} mb-0.5 shadow-sm">
              ${categoryGlyph}
            </div>

            <!-- Reward Display -->
            <span class="font-['Fredoka',sans-serif] font-black text-[12px] text-[#1B3A1F] leading-none">
              ${badgeLabel}
            </span>

            <!-- Urgent / Remote Badge -->
            ${
              isUrgent
                ? `<span class="absolute -top-1.5 -right-1 bg-[#E57373] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow border border-white flex items-center gap-0.5">
                    🔥 Urgente
                  </span>`
                : isProfessional
                ? `<span class="absolute -top-1.5 -right-1 bg-[#7209B7] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow border border-white">
                    PRO
                  </span>`
                : isAccessibility
                ? `<span class="absolute -top-1.5 -right-1 bg-[#0077B6] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow border border-white">
                    ♿ Social
                  </span>`
                : ''
            }
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [72, 72],
        iconAnchor: [36, 36]
      });

      const marker = L.marker([req.location.lat, req.location.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100
      }).addTo(markersGroup);

      marker.on('click', () => {
        setSelectedBubble(req);
        map.flyTo([req.location.lat, req.location.lng], Math.max(map.getZoom(), 16), {
          duration: 0.8
        });
      });
    });
  }, [filteredRequests, selectedBubble, userLocation]);

  // Zoom In/Out
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn(1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut(1);
    }
  };

  // Fly to Preset Location
  const handleFlyToPreset = (preset: PresetLocation) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], preset.zoom, {
        duration: 1.2
      });
      setLocationStatus(preset.label);
      setShowLocationPresets(false);
    }
  };

  // Locate User (GPS)
  const handleLocateUser = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation([lat, lng]);
          setIsLocating(false);
          setLocationStatus('Mi Ubicación GPS');
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1 });
          }
        },
        (err) => {
          console.warn('Geolocation fallback:', err);
          const fallback: [number, number] = [-39.2772, -71.9748];
          setUserLocation(fallback);
          setIsLocating(false);
          setLocationStatus('Pucón & Villarrica');
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(fallback, 15, { duration: 1 });
          }
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(userLocation, 15, { duration: 1 });
      }
    }
  };

  // Open Geolocation & Address Search Submit
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setIsSearchingGeocode(true);
    const query = searchQuery.toLowerCase().trim();

    // Check presets first
    const matchedPreset = PRESET_LOCATIONS.find((p) =>
      p.label.toLowerCase().includes(query) || p.name.toLowerCase().includes(query)
    );

    if (matchedPreset) {
      handleFlyToPreset(matchedPreset);
      setShowSearchBar(false);
      setIsSearchingGeocode(false);
      return;
    }

    // Check in requests
    const matchedReq = requests.find(
      (r) =>
        r.location.name.toLowerCase().includes(query) ||
        r.location.city.toLowerCase().includes(query) ||
        r.question.toLowerCase().includes(query) ||
        (r.requesterRole && r.requesterRole.toLowerCase().includes(query))
    );

    if (matchedReq) {
      setSelectedBubble(matchedReq);
      mapInstanceRef.current.flyTo([matchedReq.location.lat, matchedReq.location.lng], 16, {
        duration: 1.2
      });
      setLocationStatus(matchedReq.location.name);
      setShowSearchBar(false);
      setIsSearchingGeocode(false);
      return;
    }

    // Check Coordinates format
    const coordMatch = query.match(/^([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
      setLocationStatus(`GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setShowSearchBar(false);
      setIsSearchingGeocode(false);
      return;
    }

    // Live Geocoding via OpenStreetMap Nominatim
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + (query.includes('chile') || query.includes('barcelona') || query.includes('pucon') || query.includes('villarrica') ? '' : ', Chile')
        )}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        mapInstanceRef.current.flyTo([lat, lon], 16, { duration: 1.2 });
        setLocationStatus(data[0].display_name.split(',')[0]);
      } else {
        // Default to Pucón / Villarrica
        mapInstanceRef.current.flyTo([-39.2772, -71.9748], 15, { duration: 1.2 });
        setLocationStatus(`Búsqueda: ${searchQuery}`);
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
      mapInstanceRef.current.flyTo([-39.2772, -71.9748], 15, { duration: 1.2 });
    } finally {
      setIsSearchingGeocode(false);
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[580px] overflow-hidden bg-[#0A180E] select-none flex flex-col justify-between">
      {/* ─────────────────────────────────────────────────────────────
          LEAFLET HIGH-RES SATELLITE MAP CONTAINER (Full Zoom Range)
      ─────────────────────────────────────────────────────────────── */}
      <div
        id="mtigo-leaflet-map"
        ref={mapContainerRef}
        className="absolute inset-0 z-0 w-full h-full"
      />

      {/* ─────────────────────────────────────────────────────────────
          TOP BAR OVERLAY: Filter Chips & Search Toggle
      ─────────────────────────────────────────────────────────────── */}
      <div className="relative z-20 p-3.5 space-y-2">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Quick Location & Zoom Level Pill */}
          <button
            onClick={() => setShowLocationPresets(!showLocationPresets)}
            className="bg-black/75 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg hover:bg-black transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#7BC47F]" />
            <span className="truncate max-w-[130px]">{locationStatus}</span>
            <span className="bg-[#7BC47F] text-[#1B3A1F] text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {currentZoom}x
            </span>
          </button>

          {/* Search Button & Layer Switcher Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg hover:bg-black transition-all cursor-pointer"
              title="Buscar lugar o dirección abierta"
            >
              <Search className="w-4 h-4 text-[#7BC47F]" />
            </button>

            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className={`h-8 px-2.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                showLayerMenu
                  ? 'bg-[#7BC47F] text-[#1B3A1F] border-white ring-2 ring-[#7BC47F]'
                  : 'bg-black/75 backdrop-blur-md border-white/20 text-white hover:bg-black'
              }`}
              title="Cambiar capa de mapa"
            >
              <Layers className="w-3.5 h-3.5 text-[#7BC47F]" />
              <span className="hidden xs:inline text-[11px]">
                {currentLayer === 'satellite_hd'
                  ? 'Satélite HD'
                  : currentLayer === 'satellite_hybrid'
                  ? 'Híbrido'
                  : currentLayer === 'streets'
                  ? 'Calles'
                  : 'Relieve'}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Open Search Bar */}
        {showSearchBar && (
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-2 border border-[#7BC47F] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <Search className="w-4 h-4 text-[#5A7D60] ml-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar dirección, local, Pucón, Villarrica, Barcelona..."
              className="w-full bg-transparent text-xs font-semibold text-[#1B3A1F] focus:outline-none placeholder:text-[#5A7D60]/60"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSearchingGeocode}
              className="bg-[#1B3A1F] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#2E7D40] transition-colors cursor-pointer flex items-center gap-1"
            >
              {isSearchingGeocode ? '...' : 'Buscar'}
            </button>
          </form>
        )}

        {/* Location Presets Drawer */}
        {showLocationPresets && (
          <div className="bg-black/85 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl text-white space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#B8E0BA] px-1">
              <span>EXPLORAR ESCALA & POLOS DE ACTIVIDAD</span>
              <button
                onClick={() => setShowLocationPresets(false)}
                className="text-white/60 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_LOCATIONS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleFlyToPreset(preset)}
                  className="bg-white/10 hover:bg-[#7BC47F] hover:text-[#1B3A1F] text-white p-2 rounded-xl text-left text-xs font-bold transition-all flex flex-col items-start gap-0.5 cursor-pointer border border-white/10"
                >
                  <span className="text-base">{preset.icon}</span>
                  <span className="truncate w-full text-[11px]">{preset.label}</span>
                  <span className="text-[9px] opacity-70">Zoom {preset.zoom}x</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Layer Switcher Dropdown */}
        {showLayerMenu && (
          <div className="bg-black/85 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 shadow-2xl text-white space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 max-w-xs ml-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#B8E0BA] px-1">
              Capa Satelital / Cartográfica
            </div>
            {[
              {
                id: 'satellite_hd',
                label: '🛰️ Satélite HD (Esri)',
                desc: 'Fotografía satelital nítida de alta resolución'
              },
              {
                id: 'satellite_hybrid',
                label: '🗺️ Satélite Híbrido',
                desc: 'Imágenes satelitales con calles y rótulos'
              },
              {
                id: 'streets',
                label: '🚗 Calles & Ciudad',
                desc: 'Mapa OpenStreetMap estándar'
              },
              {
                id: 'terrain',
                label: '🏔️ Terreno & Topografía',
                desc: 'Relieve de volcanes, cerros y lagos'
              }
            ].map((layer) => {
              const isSelected = currentLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setCurrentLayer(layer.id as MapLayerType);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#7BC47F] text-[#1B3A1F]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div>
                    <div className="text-xs">{layer.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-[#1B3A1F]/80' : 'text-white/60'}`}>
                      {layer.desc}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 flex-shrink-0 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Specialized Category & Social / Professional Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Todas', count: requests.length },
            {
              id: 'profesionales',
              label: '🏢 Profesionales ($5k)',
              count: requests.filter((r) => r.category === 'profesionales').length
            },
            {
              id: 'accesibilidad_social',
              label: '♿ Accesibilidad & Social',
              count: requests.filter((r) => r.category === 'accesibilidad_social').length
            },
            {
              id: 'comercio_fachadas',
              label: '🏬 Fachadas & Locales',
              count: requests.filter((r) => r.category === 'comercio_fachadas').length
            },
            {
              id: 'playa',
              label: '🏖️ Playa & Vecinos',
              count: requests.filter((r) => r.category === 'playa').length
            },
            {
              id: 'urgent',
              label: '🔥 Urgentes',
              count: requests.filter((r) => r.urgency === 'urgent').length
            }
          ].map((chip) => {
            const isActive = filterType === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id as any)}
                className={`
                  h-8 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md flex items-center gap-1.5 cursor-pointer
                  ${isActive
                    ? 'bg-[#7BC47F] text-[#1B3A1F] ring-2 ring-white font-black'
                    : 'bg-black/75 backdrop-blur-md text-white border border-white/20 hover:bg-black'
                  }
                `}
              >
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#1B3A1F] text-white' : 'bg-white/20 text-white'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT FLOATING ACTION BUTTONS (Smooth Zoom & GPS Controls)
      ─────────────────────────────────────────────────────────────── */}
      <div className="absolute right-3.5 top-28 z-20 flex flex-col gap-2">
        {/* Zoom In (+) */}
        <button
          onClick={handleZoomIn}
          title="Acercar mapa (Zoom In)"
          aria-label="Acercar mapa"
          className="w-11 h-11 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black active:scale-95 shadow-xl flex items-center justify-center transition-all cursor-pointer group"
        >
          <ZoomIn className="w-5 h-5 text-[#7BC47F] group-hover:scale-110 transition-transform" />
        </button>

        {/* Zoom Out (-) */}
        <button
          onClick={handleZoomOut}
          title="Alejar mapa hasta Mapamundi (Zoom Out)"
          aria-label="Alejar mapa"
          className="w-11 h-11 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black active:scale-95 shadow-xl flex items-center justify-center transition-all cursor-pointer group"
        >
          <ZoomOut className="w-5 h-5 text-[#7BC47F] group-hover:scale-110 transition-transform" />
        </button>

        {/* Recenter GPS */}
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          title="Centrar en mi ubicación GPS"
          aria-label="Centrar en mi ubicación"
          className="w-11 h-11 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black active:scale-95 shadow-xl flex items-center justify-center transition-all cursor-pointer group"
        >
          <Crosshair
            className={`w-5 h-5 text-[#7BC47F] ${
              isLocating ? 'animate-spin text-[#FFD166]' : 'group-hover:scale-110 transition-transform'
            }`}
          />
        </button>

        {/* Quick Mapamundi Reset */}
        <button
          onClick={() => handleFlyToPreset(PRESET_LOCATIONS[6])} // Mapamundi
          title="Ver Mapamundi completo"
          aria-label="Ver Mapamundi completo"
          className="w-11 h-11 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black active:scale-95 shadow-xl flex items-center justify-center transition-all cursor-pointer font-bold text-xs"
        >
          🌍
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM SHEET / ACTIVE REQUEST CARD PEEK & CREATE BUTTON
      ─────────────────────────────────────────────────────────────── */}
      <div className="relative z-20 p-3.5 space-y-2.5 max-w-md mx-auto w-full">
        {selectedBubble && (
          <div
            onClick={() => onSelectRequest(selectedBubble)}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#B8E0BA] shadow-[0_12px_36px_rgba(0,0,0,0.35)] cursor-pointer hover:border-[#4A9E5C] transition-all group"
          >
            {/* Header: Role / Origin & Badges */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 overflow-hidden">
                {selectedBubble.category === 'profesionales' ? (
                  <span className="bg-[#480CA8] text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                    🏢 Profesional
                  </span>
                ) : selectedBubble.category === 'accesibilidad_social' ? (
                  <span className="bg-[#0077B6] text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                    ♿ Inclusión Social
                  </span>
                ) : (
                  <span className="bg-[#E8F5E9] text-[#2E7D40] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                    📍 {selectedBubble.location.city}
                  </span>
                )}

                {selectedBubble.requesterRole && (
                  <span className="text-[11px] text-[#5A7D60] font-bold truncate">
                    {selectedBubble.requesterRole}
                  </span>
                )}
              </div>

              <span className="text-[10px] text-[#FFA726] font-bold flex items-center gap-0.5 flex-shrink-0">
                <Clock className="w-3 h-3" /> {selectedBubble.expiresInMinutes}m
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[#5A7D60] font-semibold flex items-center gap-1 mb-0.5 truncate">
                  <MapPin className="w-3 h-3 text-[#4A9E5C] flex-shrink-0" />
                  <span className="truncate">{selectedBubble.location.name}</span>
                </div>
                <h3 className="font-bold text-sm text-[#1B3A1F] line-clamp-2 group-hover:text-[#4A9E5C] transition-colors leading-snug">
                  "{selectedBubble.question}"
                </h3>
              </div>

              {/* Reward Badge */}
              <div className="bg-gradient-to-br from-[#7BC47F] to-[#4A9E5C] text-white px-3 py-2 rounded-xl text-center shadow-md flex-shrink-0 min-w-[70px]">
                <div className="text-[9px] uppercase font-black tracking-wider opacity-90">Gana</div>
                <div className="font-['Fredoka',sans-serif] font-black text-lg leading-tight">
                  ${selectedBubble.reward.toLocaleString('es-CL')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E0E8E1] text-xs font-bold text-[#4A9E5C]">
              <span className="flex items-center gap-1 text-[#5A7D60] text-[11px]">
                Formato: <strong className="text-[#1B3A1F] uppercase">{selectedBubble.responseType}</strong>
              </span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform font-bold text-xs text-[#2E7D40]">
                Ver detalle y responder <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* Primary Action: Crear Solicitud */}
        <PrimaryButton
          onClick={onCreateRequest}
          leftIcon={<Plus className="w-6 h-6 stroke-[3]" />}
        >
          Crear solicitud (Profesional / Social)
        </PrimaryButton>
      </div>
    </div>
  );
};
