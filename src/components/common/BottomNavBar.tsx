import React from 'react';
import { MapPin, Wallet, User, Bell } from 'lucide-react';
import { ScreenType } from '../../types';

interface BottomNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  unreadNotifsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  unreadNotifsCount = 0
}) => {
  const isMap = currentScreen === 'map';
  const isWallet = currentScreen === 'wallet' || currentScreen === 'recharge';
  const isProfile = currentScreen === 'profile' || currentScreen === 'settings' || currentScreen === 'notifications' || currentScreen === 'admin';

  return (
    <nav
      aria-label="Navegación principal inferior"
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E0E8E1] px-4 h-[76px] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] select-none max-w-md mx-auto w-full"
    >
      {/* Item 1: Mapa */}
      <button
        onClick={() => onNavigate('map')}
        aria-label="Ir al Mapa interactivo"
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer ${
          isMap ? 'text-[#4A9E5C]' : 'text-[#5A7D60] hover:text-[#1B3A1F]'
        }`}
      >
        <div
          className={`relative w-12 h-9 rounded-2xl flex items-center justify-center transition-all ${
            isMap ? 'bg-[#E8F5E9] scale-110 shadow-sm' : 'group-hover:bg-[#F4FAF5]'
          }`}
        >
          <MapPin
            className={`w-6 h-6 transition-transform ${
              isMap ? 'stroke-[#4A9E5C] stroke-[2.5]' : 'stroke-current stroke-[1.8]'
            }`}
          />
          {isMap && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#4A9E5C]" />
          )}
        </div>
        <span className={`text-xs font-semibold ${isMap ? 'text-[#4A9E5C]' : 'text-[#5A7D60]'}`}>
          Mapa
        </span>
      </button>

      {/* Item 2: Billetera */}
      <button
        onClick={() => onNavigate('wallet')}
        aria-label="Ir a mi Billetera y Saldo"
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer ${
          isWallet ? 'text-[#4A9E5C]' : 'text-[#5A7D60] hover:text-[#1B3A1F]'
        }`}
      >
        <div
          className={`relative w-12 h-9 rounded-2xl flex items-center justify-center transition-all ${
            isWallet ? 'bg-[#E8F5E9] scale-110 shadow-sm' : 'group-hover:bg-[#F4FAF5]'
          }`}
        >
          <Wallet
            className={`w-6 h-6 transition-transform ${
              isWallet ? 'stroke-[#4A9E5C] stroke-[2.5]' : 'stroke-current stroke-[1.8]'
            }`}
          />
          {isWallet && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#4A9E5C]" />
          )}
        </div>
        <span className={`text-xs font-semibold ${isWallet ? 'text-[#4A9E5C]' : 'text-[#5A7D60]'}`}>
          Billetera
        </span>
      </button>

      {/* Item 3: Perfil */}
      <button
        onClick={() => onNavigate('profile')}
        aria-label="Ir a mi Perfil y Configuración"
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer ${
          isProfile ? 'text-[#4A9E5C]' : 'text-[#5A7D60] hover:text-[#1B3A1F]'
        }`}
      >
        <div
          className={`relative w-12 h-9 rounded-2xl flex items-center justify-center transition-all ${
            isProfile ? 'bg-[#E8F5E9] scale-110 shadow-sm' : 'group-hover:bg-[#F4FAF5]'
          }`}
        >
          <User
            className={`w-6 h-6 transition-transform ${
              isProfile ? 'stroke-[#4A9E5C] stroke-[2.5]' : 'stroke-current stroke-[1.8]'
            }`}
          />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-[#E57373] ring-2 ring-white" />
          )}
          {isProfile && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#4A9E5C]" />
          )}
        </div>
        <span className={`text-xs font-semibold ${isProfile ? 'text-[#4A9E5C]' : 'text-[#5A7D60]'}`}>
          Perfil
        </span>
      </button>
    </nav>
  );
};
