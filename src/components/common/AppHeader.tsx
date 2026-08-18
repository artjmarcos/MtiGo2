import React from 'react';
import { ArrowLeft, Wallet, Plus, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { ScreenType, UserProfile } from '../../types';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  user: UserProfile;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onReadScreenText?: () => void;
  unreadCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  user,
  onNavigate,
  onReadScreenText,
  unreadCount = 0
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0E8E1] px-4 py-2.5 shadow-sm select-none">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left Side: Back button or Logo */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Volver atrás"
              className="w-11 h-11 rounded-2xl bg-[#F4FAF5] hover:bg-[#E8F5E9] active:scale-95 border border-[#E0E8E1] flex items-center justify-center text-[#1B3A1F] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#1B3A1F]" />
            </button>
          ) : (
            <div
              onClick={() => onNavigate('map')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4A9E5C] to-[#7BC47F] p-0.5 shadow-[0_2px_8px_rgba(74,158,92,0.3)] flex items-center justify-center">
                <div className="w-full h-full bg-[#1B3A1F] rounded-[14px] flex items-center justify-center text-white font-bold text-lg tracking-tight">
                  <span className="text-[#7BC47F]">M</span>ti
                </div>
              </div>
              <div>
                <span className="font-['Fredoka',sans-serif] font-bold text-xl tracking-tight text-[#1B3A1F] flex items-center gap-1">
                  Mti<span className="text-[#4A9E5C]">Go</span>
                  <span className="w-2 h-2 rounded-full bg-[#7BC47F] animate-ping" />
                </span>
                <span className="block text-[10px] text-[#5A7D60] font-medium leading-none">
                  Villarrica Live
                </span>
              </div>
            </div>
          )}

          {title && (
            <div className="ml-1 truncate">
              <h1 className="font-bold text-lg text-[#1B3A1F] truncate leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-[#5A7D60] truncate">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Right Side: Accessibility Reader + Wallet Chip + Avatar */}
        <div className="flex items-center gap-2">
          {/* Read aloud screen for accessibility */}
          {onReadScreenText && (
            <button
              onClick={onReadScreenText}
              aria-label="Leer pantalla en voz alta (Accesibilidad)"
              title="Leer pantalla en voz alta"
              className="w-10 h-10 rounded-2xl bg-[#E8F5E9] hover:bg-[#B8E0BA] active:scale-95 text-[#2E7D40] flex items-center justify-center transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {/* Wallet Balance Pill */}
          <div
            onClick={() => onNavigate('wallet')}
            className="flex items-center gap-1.5 bg-[#E8F5E9] hover:bg-[#D7EED9] border border-[#B8E0BA] px-2.5 py-1.5 rounded-full cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#4A9E5C] text-white flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs text-[#1B3A1F]">
              ${user.balance.toLocaleString('es-CL')}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('recharge');
              }}
              title="Recargar saldo"
              className="w-5 h-5 rounded-full bg-[#7BC47F] hover:bg-[#4A9E5C] text-white flex items-center justify-center text-xs ml-0.5 transition-colors"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          {/* User Avatar */}
          <button
            onClick={() => onNavigate('profile')}
            aria-label="Ver mi perfil"
            className="relative w-10 h-10 rounded-full border-2 border-[#7BC47F] p-0.5 overflow-hidden active:scale-95 transition-transform cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
            {user.isAdmin && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#FFD166] border border-white flex items-center justify-center text-[8px] font-bold text-[#1B3A1F]">
                ★
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
