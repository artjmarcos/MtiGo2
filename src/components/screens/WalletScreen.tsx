import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Clock,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  Receipt,
  Sparkles
} from 'lucide-react';
import { UserProfile, WalletTransaction } from '../../types';
import { PrimaryButton } from '../common/Buttons';

interface WalletScreenProps {
  user: UserProfile;
  transactions: WalletTransaction[];
  onNavigateToRecharge: () => void;
  onSelectTransaction?: (tx: WalletTransaction) => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  user,
  transactions,
  onNavigateToRecharge
}) => {
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');

  const filteredTx = transactions.filter((tx) => {
    if (filter === 'in') return tx.amount > 0;
    if (filter === 'out') return tx.amount < 0;
    return true;
  });

  const getTxIcon = (type: string, amount: number) => {
    if (type === 'recharge') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D40] flex items-center justify-center">
          <Building2 className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'reward_earned') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#4A9E5C] flex items-center justify-center">
          <ArrowDownLeft className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'refund') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-[#FFF8E1] text-[#E65100] flex items-center justify-center">
          <RefreshCw className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-[#FFEBEE] text-[#C62828] flex items-center justify-center">
        <ArrowUpRight className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-5 select-none">
      {/* 1. Featured Balance Card with Green Gradient */}
      <div className="relative rounded-[24px] bg-gradient-to-br from-[#4A9E5C] via-[#65B776] to-[#7BC47F] p-6 text-white shadow-[0_12px_28px_rgba(74,158,92,0.3)] overflow-hidden space-y-4">
        {/* Subtle geometric circles decoration */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-10 w-36 h-36 rounded-full bg-black/10 pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-white/90">
            <Wallet className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-bold">Saldo Disponible MtiGo</span>
          </div>
          <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-bold">
            Chile (CLP)
          </span>
        </div>

        {/* Big Amount */}
        <div className="relative z-10">
          <div className="font-['Fredoka',sans-serif] font-black text-[42px] leading-none tracking-tight">
            ${user.balance.toLocaleString('es-CL')}
          </div>
          <p className="text-xs text-white/80 mt-1 font-medium">
            Fondos seguros para solicitar o retirar tus recompensas
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="pt-2 relative z-10">
          <button
            onClick={onNavigateToRecharge}
            className="w-full h-14 bg-white hover:bg-[#F4FAF5] active:scale-95 text-[#2E7D40] font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Recargar saldo vía Transferencia</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#E0E8E1] rounded-2xl p-3.5 shadow-sm">
          <span className="text-[11px] text-[#5A7D60] font-semibold block">Respuestas Pagadas</span>
          <span className="font-bold text-base text-[#1B3A1F]">34 realizadas</span>
        </div>
        <div className="bg-white border border-[#E0E8E1] rounded-2xl p-3.5 shadow-sm">
          <span className="text-[11px] text-[#5A7D60] font-semibold block">Solicitudes Hechas</span>
          <span className="font-bold text-base text-[#1B3A1F]">12 publicadas</span>
        </div>
      </div>

      {/* 2. Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-[#1B3A1F]">
            Movimientos recientes
          </h2>
          <div className="flex bg-[#F4FAF5] p-0.5 rounded-xl border border-[#E0E8E1] text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-[#1B3A1F] shadow-sm' : 'text-[#5A7D60]'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('in')}
              className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'in' ? 'bg-white text-[#2E7D40] shadow-sm' : 'text-[#5A7D60]'}`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilter('out')}
              className={`px-2.5 py-1 rounded-lg transition-all ${filter === 'out' ? 'bg-white text-[#C62828] shadow-sm' : 'text-[#5A7D60]'}`}
            >
              Egresos
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-2.5">
          {filteredTx.length === 0 ? (
            <div className="bg-white border border-[#E0E8E1] rounded-2xl p-6 text-center text-xs text-[#5A7D60]">
              No hay movimientos en este filtro.
            </div>
          ) : (
            filteredTx.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="bg-white border border-[#E0E8E1] hover:border-[#B8E0BA] rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getTxIcon(tx.type, tx.amount)}
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-[#1B3A1F] truncate">
                        {tx.title}
                      </h4>
                      <p className="text-[11px] text-[#5A7D60] truncate">{tx.description}</p>
                      <span className="text-[10px] text-[#5A7D60]/80">{tx.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div
                      className={`font-['Fredoka',sans-serif] font-bold text-base ${
                        isPositive ? 'text-[#2E7D40]' : 'text-[#C62828]'
                      }`}
                    >
                      {isPositive ? `+$${tx.amount.toLocaleString('es-CL')}` : `-$${Math.abs(tx.amount).toLocaleString('es-CL')}`}
                    </div>
                    <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D40] px-2 py-0.5 rounded-full font-bold">
                      {tx.status === 'completed' ? 'Completado' : tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 3. Full History Button */}
        <button
          onClick={() => setFilter('all')}
          className="w-full py-3 text-center text-xs font-bold text-[#4A9E5C] hover:underline cursor-pointer"
        >
          Ver historial completo de transacciones
        </button>
      </div>

      {/* Security Info Card */}
      <div className="bg-[#F4FAF5] border border-[#E0E8E1] rounded-2xl p-3.5 flex items-center gap-3 text-xs text-[#5A7D60]">
        <ShieldCheck className="w-5 h-5 text-[#4A9E5C] flex-shrink-0" />
        <span>
          Todos los micropagos de MtiGo están protegidos con retención de custodia hasta validar la respuesta.
        </span>
      </div>
    </div>
  );
};
