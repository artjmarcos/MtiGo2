import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  Sparkles,
  Layers,
  ChevronDown,
  RotateCcw,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { ScreenType } from '../../types';

interface AppNavigatorToolbarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onResetDemoData: () => void;
  onTriggerSpeechReader: () => void;
}

export const AppNavigatorToolbar: React.FC<AppNavigatorToolbarProps> = ({
  currentScreen,
  onSelectScreen,
  isDeviceFrame,
  onToggleDeviceFrame,
  onResetDemoData,
  onTriggerSpeechReader
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenType; name: string; number: string; category: string }[] = [
    { id: 'login', number: '1', name: 'Login (SMS Phone)', category: 'Acceso' },
    { id: 'otp', number: '2', name: 'Verificación OTP', category: 'Acceso' },
    { id: 'map', number: '3', name: 'Mapa Home (Burbujas)', category: 'Principal' },
    { id: 'create_request', number: '4', name: 'Crear Solicitud (Sliders)', category: 'Solicitudes' },
    { id: 'request_detail', number: '5', name: 'Detalle de Solicitud', category: 'Solicitudes' },
    { id: 'respond_request', number: '6', name: 'Responder (Foto/Audio/Emoji)', category: 'Solicitudes' },
    { id: 'wallet', number: '7', name: 'Billetera & Saldo', category: 'Finanzas' },
    { id: 'recharge', number: '8', name: 'Recargar Saldo (Transferencia)', category: 'Finanzas' },
    { id: 'profile', number: '9', name: 'Perfil de Usuario', category: 'Usuario' },
    { id: 'rating', number: '10', name: 'Calificación (5 Estrellas)', category: 'Usuario' },
    { id: 'notifications', number: '11', name: 'Notificaciones', category: 'Usuario' },
    { id: 'admin', number: '12', name: 'Admin Dashboard (Web)', category: 'Administración' },
    { id: 'settings', number: '13', name: 'Configuración & Accesibilidad', category: 'Sistema' },
    { id: 'design_system', number: '★', name: 'Design System & UI Tokens', category: 'Design System' }
  ];

  const activeScreenObj = screens.find((s) => s.id === currentScreen);

  return (
    <div className="bg-[#1B3A1F] text-white border-b border-[#2E7D40] px-3 py-2 select-none z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Screen Selector Dropdown */}
        <div className="flex items-center gap-2 relative">
          <div className="flex items-center gap-1.5 bg-[#4A9E5C]/30 border border-[#7BC47F]/40 px-2.5 py-1 rounded-xl">
            <span className="font-['Fredoka',sans-serif] font-bold text-sm text-[#7BC47F]">MtiGo</span>
            <span className="text-[10px] text-white/70 font-mono">v2.4</span>
          </div>

          {/* Selector Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-[#7BC47F] text-[#1B3A1F] flex items-center justify-center text-[10px] font-black">
              {activeScreenObj?.number}
            </span>
            <span className="max-w-[140px] sm:max-w-[220px] truncate">{activeScreenObj?.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          </button>

          {/* Screen Dropdown Menu */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white text-[#1B3A1F] rounded-2xl shadow-2xl border border-[#E0E8E1] p-2 z-50 max-h-[75vh] overflow-y-auto">
                <div className="px-3 py-2 border-b border-[#E0E8E1] text-[11px] font-bold text-[#5A7D60] uppercase tracking-wider">
                  Navegador Rápido de Pantallas (13 Pantallas)
                </div>
                <div className="space-y-1 pt-1">
                  {screens.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectScreen(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer
                        ${currentScreen === item.id
                          ? 'bg-[#E8F5E9] text-[#2E7D40] font-bold'
                          : 'hover:bg-[#F4FAF5] text-[#1B3A1F]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                          currentScreen === item.id ? 'bg-[#4A9E5C] text-white' : 'bg-[#E0E8E1] text-[#1B3A1F]'
                        }`}>
                          {item.number}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-[#5A7D60] bg-[#F4FAF5] px-1.5 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* TalkBack Speech Simulator */}
          <button
            onClick={onTriggerSpeechReader}
            title="Lector de Accesibilidad (Voz)"
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#7BC47F]" />
            <span className="hidden sm:inline">Lector Voz</span>
          </button>

          {/* Design System Quick Access */}
          <button
            onClick={() => onSelectScreen('design_system')}
            title="Ver Design System & Tokens"
            className="flex items-center gap-1 bg-[#4A9E5C] hover:bg-[#3D834D] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD166]" />
            <span className="hidden sm:inline">Design System</span>
          </button>

          {/* Device Frame Toggle (Mobile Frame vs Full Responsive) */}
          <button
            onClick={onToggleDeviceFrame}
            title={isDeviceFrame ? 'Modo Pantalla Completa' : 'Modo Marco Móvil (iOS/Android)'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isDeviceFrame
                ? 'bg-[#7BC47F] text-[#1B3A1F] border-[#7BC47F] font-bold'
                : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
            }`}
          >
            {isDeviceFrame ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isDeviceFrame ? 'Marco Móvil' : 'Pantalla Completa'}</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetDemoData}
            title="Reiniciar datos de prueba"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
