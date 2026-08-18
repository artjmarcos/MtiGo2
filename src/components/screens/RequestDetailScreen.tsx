import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Camera,
  Mic,
  MessageSquare,
  Smile,
  ShieldCheck,
  Star,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Play,
  Volume2,
  AlertCircle,
  Building,
  HeartHandshake,
  FileText,
  UserCheck,
  Globe
} from 'lucide-react';
import { GeoRequest, RequestResponse } from '../../types';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';

interface RequestDetailScreenProps {
  request: GeoRequest;
  onRespond: (request: GeoRequest) => void;
  onViewOnMap: (request: GeoRequest) => void;
  onBack: () => void;
}

export const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({
  request,
  onRespond,
  onViewOnMap,
  onBack
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    Math.max(0, Math.floor((request.expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((request.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [request.expiresAt]);

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'foto':
        return { label: 'Requiere Foto en Vivo', icon: <Camera className="w-4 h-4" />, bg: 'bg-[#E8F5E9] text-[#2E7D40]' };
      case 'audio':
        return { label: 'Requiere Nota de Voz', icon: <Mic className="w-4 h-4" />, bg: 'bg-[#FFF8E1] text-[#E65100]' };
      case 'texto':
        return { label: 'Requiere Mensaje de Texto', icon: <MessageSquare className="w-4 h-4" />, bg: 'bg-[#E3F2FD] text-[#0D47A1]' };
      default:
        return { label: 'Requiere Emoji / Estado', icon: <Smile className="w-4 h-4" />, bg: 'bg-[#F3E5F5] text-[#7B1FA2]' };
    }
  };

  const getCategoryInfo = () => {
    if (request.category === 'profesionales') {
      return {
        label: 'Profesionales & Publicidad',
        desc: 'Cotización / Inspección técnica remota',
        badgeBg: 'bg-[#480CA8] text-white',
        icon: '📐'
      };
    }
    if (request.category === 'accesibilidad_social') {
      return {
        label: 'Ayuda Social & Accesibilidad',
        desc: 'Inclusión / Movilidad reducida',
        badgeBg: 'bg-[#0077B6] text-white',
        icon: '♿'
      };
    }
    if (request.category === 'comercio_fachadas') {
      return {
        label: 'Comercio & Fachadas',
        desc: 'Locales comerciales y letreros',
        badgeBg: 'bg-[#E65100] text-white',
        icon: '🏬'
      };
    }
    return {
      label: 'Turismo, Playas & Vecinos',
      desc: 'Clima, viento y entorno',
      badgeBg: 'bg-[#2E7D40] text-white',
      icon: '🏖️'
    };
  };

  const typeInfo = getTypeBadge(request.responseType);
  const catInfo = getCategoryInfo();

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 select-none">
      {/* Top Navigation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="text-xs font-bold text-[#5A7D60] hover:text-[#1B3A1F] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al mapa
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${catInfo.badgeBg} flex items-center gap-1 shadow-sm`}>
              <span>{catInfo.icon}</span> {catInfo.label}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-extrabold text-[#1B3A1F] leading-snug">
          "{request.question}"
        </h2>
      </div>

      {/* Main Info Card */}
      <div className="bg-white border-2 border-[#B8E0BA] rounded-[24px] p-5 shadow-sm space-y-4">
        {/* Reward & Timer Row */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#F4FAF5] to-[#E8F5E9] p-4 rounded-2xl border border-[#E0E8E1]">
          <div>
            <span className="text-xs font-bold text-[#5A7D60] uppercase tracking-wider block">
              Recompensa
            </span>
            <div className="font-['Fredoka',sans-serif] font-black text-3xl text-[#2E7D40]">
              ${request.reward.toLocaleString('es-CL')}
            </div>
            <span className="text-[11px] text-[#4A9E5C] font-bold">Pago garantizado MtiGo</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-[#5A7D60] uppercase tracking-wider block">
              Expira en
            </span>
            <div className="font-mono font-extrabold text-2xl text-[#E57373] flex items-center justify-end gap-1">
              <Clock className="w-5 h-5 animate-pulse" />
              {formatMinutes(secondsRemaining)}
            </div>
            <span className="text-[10px] text-[#5A7D60]">Tiempo límite</span>
          </div>
        </div>

        {/* Specific Instructions Callout (if available) */}
        {request.instructions && (
          <div className="bg-[#FFF9E6] border border-[#FFE082] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E65100]">
              <FileText className="w-4 h-4" />
              <span>Instrucciones específicas del solicitante:</span>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed font-medium">
              {request.instructions}
            </p>
          </div>
        )}

        {/* Badges Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${typeInfo.bg}`}>
            {typeInfo.icon}
            <span>{typeInfo.label}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl font-bold text-xs bg-[#F4FAF5] border border-[#E0E8E1] text-[#1B3A1F] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4A9E5C]" />
            <span>Fondos retenidos en garantía</span>
          </div>
        </div>

        {/* Requester Profile & Context */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#E0E8E1]">
          <img
            src={request.requesterAvatar}
            alt={request.requesterName}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-[#7BC47F] shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-sm text-[#1B3A1F] truncate">{request.requesterName}</h4>
              {request.requesterRole && (
                <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D40] font-black px-1.5 py-0.2 rounded-md truncate">
                  {request.requesterRole}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#5A7D60] mt-0.5">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#FFD166] text-[#FFD166]" />
                <span className="font-bold text-[#1B3A1F]">{request.requesterRating}</span>
              </div>
              {request.requesterOriginCity && (
                <div className="flex items-center gap-1 text-[11px] text-[#5A7D60]">
                  <Globe className="w-3 h-3 text-[#4A9E5C]" />
                  <span>Desde {request.requesterOriginCity}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Map & Address Card */}
      <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B3A1F]">
            <MapPin className="w-4 h-4 text-[#4A9E5C]" />
            <span>{request.location.name}</span>
          </div>
          <span className="text-[11px] text-[#5A7D60] font-medium">{request.location.city}</span>
        </div>

        <div className="relative h-28 w-full rounded-xl overflow-hidden border border-[#B8E0BA] bg-[#E2F0E5] flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#7BC47F_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#E57373] text-white flex items-center justify-center shadow-lg animate-bounce">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[11px] font-bold text-[#1B3A1F] bg-white px-2 py-0.5 rounded-full shadow-sm mt-1">
              {request.location.address}
            </span>
          </div>
        </div>
      </div>

      {/* Received Responses Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#1B3A1F]">
            Respuestas recibidas ({request.responses.length})
          </h3>
          {request.responses.length > 0 && (
            <span className="text-xs text-[#4A9E5C] font-semibold">1 verificada</span>
          )}
        </div>

        {request.responses.length === 0 ? (
          <div className="bg-[#F4FAF5] border border-dashed border-[#B8E0BA] rounded-2xl p-5 text-center space-y-1">
            <p className="font-bold text-sm text-[#1B3A1F]">Sé el primero en responder en el lugar</p>
            <p className="text-xs text-[#5A7D60]">
              Si estás en {request.location.name}, envía tu respuesta y gana ${request.reward.toLocaleString('es-CL')} al instante.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {request.responses.map((resp) => (
              <div
                key={resp.id}
                className="bg-white border border-[#E0E8E1] rounded-2xl p-3.5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={resp.authorAvatar}
                      alt={resp.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-[#7BC47F]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#1B3A1F]">{resp.authorName}</span>
                      <span className="text-[10px] text-[#5A7D60] block">{resp.timestamp}</span>
                    </div>
                  </div>
                  {resp.isAccepted && (
                    <span className="bg-[#E8F5E9] text-[#2E7D40] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aceptada & Pagada
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#1B3A1F] leading-relaxed">{resp.content}</p>

                {resp.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-[#E0E8E1]">
                    <img
                      src={resp.photoUrl}
                      alt="Foto de respuesta"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E0E8E1] z-40 max-w-md mx-auto space-y-2">
        <PrimaryButton
          onClick={() => onRespond(request)}
          leftIcon={typeInfo.icon}
        >
          Responder y ganar ${request.reward.toLocaleString('es-CL')}
        </PrimaryButton>

        <SecondaryButton
          onClick={() => onViewOnMap(request)}
          leftIcon={<MapPin className="w-5 h-5" />}
        >
          Ver en el mapa satelital
        </SecondaryButton>
      </div>
    </div>
  );
};
