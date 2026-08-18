import React from 'react';
import {
  Bell,
  MapPin,
  Coins,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowLeft,
  CheckCheck
} from 'lucide-react';
import { AppNotification, ScreenType } from '../../types';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
  onBack
}) => {
  const groups: ('Hoy' | 'Ayer' | 'Esta semana')[] = ['Hoy', 'Ayer', 'Esta semana'];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'request_nearby':
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D40] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        );
      case 'payment_received':
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#FFF8E1] text-[#E65100] flex items-center justify-center flex-shrink-0">
            <Coins className="w-5 h-5" />
          </div>
        );
      case 'recharge_approved':
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#4A9E5C] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] text-[#0D47A1] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-[#5A7D60] hover:text-[#1B3A1F] flex items-center gap-1 cursor-pointer mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h1 className="text-xl font-extrabold text-[#1B3A1F]">
            Notificaciones
          </h1>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-bold text-[#4A9E5C] hover:underline flex items-center gap-1 cursor-pointer bg-white border border-[#E0E8E1] px-3 py-1.5 rounded-xl shadow-xs"
        >
          <CheckCheck className="w-4 h-4" /> Marcar leídas
        </button>
      </div>

      {/* Notification Groups */}
      <div className="space-y-5">
        {groups.map((group) => {
          const notifsInGroup = notifications.filter((n) => n.dateGroup === group);
          if (notifsInGroup.length === 0) return null;

          return (
            <div key={group} className="space-y-2">
              <h2 className="text-xs font-bold text-[#5A7D60] uppercase tracking-wider pl-1">
                {group}
              </h2>

              <div className="space-y-2">
                {notifsInGroup.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onSelectNotification(notif)}
                    className={`
                      p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3
                      ${notif.unread
                        ? 'bg-[#E8F5E9]/60 border-[#B8E0BA] shadow-sm hover:bg-[#E8F5E9]'
                        : 'bg-white border-[#E0E8E1] hover:bg-[#F4FAF5]'
                      }
                    `}
                  >
                    {getNotifIcon(notif.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-xs text-[#1B3A1F] truncate">
                          {notif.title}
                        </h3>
                        <span className="text-[10px] text-[#5A7D60] whitespace-nowrap">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A7D60] mt-0.5 leading-relaxed">
                        {notif.body}
                      </p>
                    </div>

                    {notif.unread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4A9E5C] mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
