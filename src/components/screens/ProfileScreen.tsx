import React from 'react';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Star,
  Award,
  ChevronRight,
  Sparkles,
  Phone,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ScreenType, UserProfile } from '../../types';
import { DangerButton } from '../common/Buttons';

interface ProfileScreenProps {
  user: UserProfile;
  unreadNotifsCount?: number;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  unreadNotifsCount = 0,
  onNavigate,
  onLogout
}) => {
  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-5 select-none">
      {/* 1. Header Profile Card */}
      <div className="bg-white border border-[#B8E0BA] rounded-[24px] p-6 text-center space-y-3 shadow-sm relative overflow-hidden">
        {/* Top subtle background ribbon */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#E8F5E9] via-[#DEF0E2] to-[#B8E0BA]" />

        <div className="relative z-10">
          {/* Avatar grande (100px) */}
          <div className="relative inline-block mx-auto mt-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-[28px] object-cover border-4 border-white shadow-md mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#4A9E5C] text-white p-1.5 rounded-xl border-2 border-white shadow">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <h1 className="font-extrabold text-xl text-[#1B3A1F] mt-2">
            {user.name}
          </h1>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#5A7D60] font-semibold">
            <Phone className="w-3.5 h-3.5" />
            <span>{user.phone}</span>
            <span>&bull; RUT {user.rut}</span>
          </div>

          {/* Rating with Stars */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFF8E1] border border-[#FFE082] px-3 py-1 rounded-full text-xs font-bold text-[#E65100] mt-2 shadow-xs">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-[#FFD166] text-[#FFD166]" />
              ))}
            </div>
            <span>{user.rating} (34 calificaciones)</span>
          </div>

          {/* Level Badge */}
          <div className="mt-2 text-xs font-bold text-[#2E7D40] bg-[#E8F5E9] border border-[#B8E0BA] py-1 px-3 rounded-xl inline-block">
            🏅 {user.level}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E0E8E1] text-left">
          <div className="bg-[#F4FAF5] p-2.5 rounded-xl">
            <span className="text-[11px] text-[#5A7D60] font-semibold block">Respuestas dadas</span>
            <span className="font-bold text-sm text-[#1B3A1F]">34 con éxito (100%)</span>
          </div>
          <div className="bg-[#F4FAF5] p-2.5 rounded-xl">
            <span className="text-[11px] text-[#5A7D60] font-semibold block">Solicitudes creadas</span>
            <span className="font-bold text-sm text-[#1B3A1F]">12 publicadas</span>
          </div>
        </div>
      </div>

      {/* 2. Options Menu */}
      <div className="bg-white border border-[#E0E8E1] rounded-[22px] overflow-hidden shadow-sm divide-y divide-[#E0E8E1]">
        {/* Notificaciones */}
        <button
          onClick={() => onNavigate('notifications')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F4FAF5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#4A9E5C] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#1B3A1F] block">Notificaciones</span>
              <span className="text-xs text-[#5A7D60]">Avisos de solicitudes y pagos</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadNotifsCount > 0 && (
              <span className="bg-[#E57373] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadNotifsCount} nuevas
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-[#5A7D60]" />
          </div>
        </button>

        {/* Configuración */}
        <button
          onClick={() => onNavigate('settings')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F4FAF5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#4A9E5C] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#1B3A1F] block">Configuración & Accesibilidad</span>
              <span className="text-xs text-[#5A7D60]">Texto grande, contrastes, idiomas</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#5A7D60]" />
        </button>

        {/* Panel Admin (Si es Admin) */}
        {user.isAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            className="w-full p-4 flex items-center justify-between bg-[#FFFDE7]/50 hover:bg-[#FFF9C4] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD166] text-[#1B3A1F] flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#1B3A1F]">Panel Administrador</span>
                  <span className="bg-[#1B3A1F] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                    ADMIN
                  </span>
                </div>
                <span className="text-xs text-[#5A7D60]">Validar recargas y monitorear</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#5A7D60]" />
          </button>
        )}

        {/* Ayuda & Preguntas Frecuentes */}
        <button
          onClick={() => onNavigate('settings')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F4FAF5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#4A9E5C] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#1B3A1F] block">Ayuda & Soporte</span>
              <span className="text-xs text-[#5A7D60]">Cómo funciona MtiGo Villarrica</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#5A7D60]" />
        </button>
      </div>

      {/* 3. Botón "Cerrar sesión" (Rojo) */}
      <div className="pt-2">
        <DangerButton
          onClick={onLogout}
          leftIcon={<LogOut className="w-5 h-5" />}
        >
          Cerrar sesión
        </DangerButton>
      </div>
    </div>
  );
};
