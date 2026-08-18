import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  Moon,
  Type,
  Eye,
  Languages,
  FileText,
  Shield,
  ArrowLeft,
  Check,
  Smartphone,
  Sparkles,
  Info
} from 'lucide-react';
import { UserSettings } from '../../types';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-5 select-none">
      {/* Top Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#5A7D60] hover:text-[#1B3A1F] flex items-center gap-1 cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Perfil
        </button>
        <h1 className="text-xl font-extrabold text-[#1B3A1F]">
          Configuración & Accesibilidad
        </h1>
        <p className="text-xs text-[#5A7D60]">
          Personaliza tu experiencia de uso y opciones de lectura
        </p>
      </div>

      {/* 1. Accessibility Section (CRÍTICO) */}
      <div className="bg-white border-2 border-[#B8E0BA] rounded-[22px] p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E0E8E1]">
          <Eye className="w-5 h-5 text-[#4A9E5C]" />
          <div>
            <h3 className="font-bold text-sm text-[#1B3A1F]">Accesibilidad Universal</h3>
            <span className="text-[11px] text-[#5A7D60]">Diseñado para personas mayores y baja visión</span>
          </div>
        </div>

        {/* Toggle: Large Text */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-[#5A7D60]" />
            <div>
              <span className="font-bold text-xs text-[#1B3A1F] block">Texto Grande (+15%)</span>
              <span className="text-[11px] text-[#5A7D60]">Aumenta el tamaño de fuente en toda la app</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.largeText}
            onClick={() => onUpdateSettings({ largeText: !settings.largeText })}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              settings.largeText ? 'bg-[#4A9E5C]' : 'bg-[#E0E8E1]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                settings.largeText ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle: High Contrast */}
        <div className="flex items-center justify-between py-1 border-t border-[#E0E8E1]/60">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-[#5A7D60]" />
            <div>
              <span className="font-bold text-xs text-[#1B3A1F] block">Alto Contraste (WCAG AAA)</span>
              <span className="text-[11px] text-[#5A7D60]">Oscurece textos y resalta bordes</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.highContrast}
            onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              settings.highContrast ? 'bg-[#4A9E5C]' : 'bg-[#E0E8E1]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                settings.highContrast ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle: VoiceOver / TalkBack Speech Assistant */}
        <div className="flex items-center justify-between py-1 border-t border-[#E0E8E1]/60">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[#5A7D60]" />
            <div>
              <span className="font-bold text-xs text-[#1B3A1F] block">Asistente de Voz / Lector</span>
              <span className="text-[11px] text-[#5A7D60]">Lectura audible de preguntas y solicitudes</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.talkBackSimulator}
            onClick={() => onUpdateSettings({ talkBackSimulator: !settings.talkBackSimulator })}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              settings.talkBackSimulator ? 'bg-[#4A9E5C]' : 'bg-[#E0E8E1]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                settings.talkBackSimulator ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Preferences & General */}
      <div className="bg-white border border-[#E0E8E1] rounded-[22px] p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-[#5A7D60] uppercase tracking-wider">
          Preferencias de Aplicación
        </h3>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#5A7D60]" />
            <div>
              <span className="font-bold text-xs text-[#1B3A1F] block">Notificaciones Push</span>
              <span className="text-[11px] text-[#5A7D60]">Avisos de solicitudes cercanas en tiempo real</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.notificationsEnabled}
            onClick={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              settings.notificationsEnabled ? 'bg-[#4A9E5C]' : 'bg-[#E0E8E1]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-[#E0E8E1]/60">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#5A7D60]" />
            <div>
              <span className="font-bold text-xs text-[#1B3A1F] block">Efectos de Sonido</span>
              <span className="text-[11px] text-[#5A7D60]">Sonidos tipo videojuego al enviar y cobrar</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.soundFx}
            onClick={() => onUpdateSettings({ soundFx: !settings.soundFx })}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              settings.soundFx ? 'bg-[#4A9E5C]' : 'bg-[#E0E8E1]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                settings.soundFx ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-between py-1 border-t border-[#E0E8E1]/60">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-[#5A7D60]" />
            <div>
              <span className="font-bold text-xs text-[#1B3A1F] block">Idioma / Dungun</span>
              <span className="text-[11px] text-[#5A7D60]">Selecciona tu lengua de preferencia</span>
            </div>
          </div>

          <select
            value={settings.language}
            onChange={(e) => onUpdateSettings({ language: e.target.value as any })}
            className="bg-[#F4FAF5] border border-[#E0E8E1] text-xs font-bold text-[#1B3A1F] rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="es">Español (Chile)</option>
            <option value="en">English (US)</option>
            <option value="arn">Mapudungun</option>
          </select>
        </div>
      </div>

      {/* 3. Legal & App Version */}
      <div className="bg-white border border-[#E0E8E1] rounded-[22px] overflow-hidden shadow-sm divide-y divide-[#E0E8E1]">
        <button
          onClick={() => setShowTermsModal(true)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#F4FAF5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#5A7D60]" />
            <span className="font-bold text-xs text-[#1B3A1F]">Términos y Condiciones</span>
          </div>
          <span className="text-xs text-[#4A9E5C] font-semibold">Ver</span>
        </button>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#F4FAF5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-[#5A7D60]" />
            <span className="font-bold text-xs text-[#1B3A1F]">Política de Privacidad</span>
          </div>
          <span className="text-xs text-[#4A9E5C] font-semibold">Ver</span>
        </button>

        <div className="p-3.5 flex items-center justify-between bg-[#F4FAF5]/50">
          <span className="text-xs text-[#5A7D60]">Versión de la aplicación</span>
          <span className="text-xs font-mono font-bold text-[#1B3A1F]">MtiGo v2.4.0 (Build 2026)</span>
        </div>
      </div>

      {/* Modal: Términos y Condiciones */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-[#1B3A1F]">Términos y Condiciones MtiGo</h3>
            <p className="text-xs text-[#5A7D60] leading-relaxed">
              MtiGo conecta solicitantes y respondedores locales para la entrega de información verificable en tiempo real. Los micropagos son custodiados hasta la validación de la respuesta conforme a las políticas de la comunidad.
            </p>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-3 bg-[#7BC47F] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Entendido y Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Privacidad */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-[#1B3A1F]">Política de Privacidad</h3>
            <p className="text-xs text-[#5A7D60] leading-relaxed">
              Tu ubicación GPS solo se utiliza para triangular solicitudes en tu cercanía física y no se comparte con terceros sin tu consentimiento.
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-3 bg-[#7BC47F] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
