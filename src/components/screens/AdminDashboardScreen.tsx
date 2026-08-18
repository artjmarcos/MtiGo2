import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  CreditCard,
  Users,
  MessageSquare,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AdminRecharge, GeoRequest, UserProfile } from '../../types';

interface AdminDashboardScreenProps {
  recharges: AdminRecharge[];
  requests: GeoRequest[];
  onApproveRecharge: (rechargeId: string) => void;
  onRejectRecharge: (rechargeId: string) => void;
  onBackToApp: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  recharges,
  requests,
  onApproveRecharge,
  onRejectRecharge,
  onBackToApp
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recharges' | 'requests' | 'users'>('recharges');
  const [filterBank, setFilterBank] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pendingRecharges = recharges.filter((r) => r.status === 'pending');
  const totalVolumeToday = 148500;

  const filteredRecharges = recharges.filter((r) => {
    const matchesSearch = r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.operationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userRut.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBank = filterBank === 'all' || r.bankName.includes(filterBank);
    return matchesSearch && matchesBank;
  });

  return (
    <div className="min-h-screen bg-[#F4FAF5] text-[#1B3A1F] flex flex-col select-none">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-[#E0E8E1] px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-[#F4FAF5] hover:bg-[#E8F5E9] text-[#1B3A1F] border border-[#E0E8E1] flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a MtiGo Móvil
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFD166] text-[#1B3A1F] flex items-center justify-center font-black text-sm shadow-xs">
                ★
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base text-[#1B3A1F] flex items-center gap-1.5">
                  Panel de Administración MtiGo
                  <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D40] px-2 py-0.2 rounded-full font-bold">
                    Villarrica Control
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-[#5A7D60] font-semibold">
              Admin: Nicolás Valenzuela
            </span>
            <div className="w-8 h-8 rounded-full bg-[#4A9E5C] text-white flex items-center justify-center text-xs font-bold">
              NV
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        {/* 1. Sidebar Navigation */}
        <aside className="md:col-span-3 space-y-2">
          <div className="bg-white border border-[#E0E8E1] rounded-2xl p-3 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#1B3A1F] text-white'
                  : 'text-[#5A7D60] hover:bg-[#F4FAF5] hover:text-[#1B3A1F]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard General</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('recharges')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'recharges'
                  ? 'bg-[#1B3A1F] text-white'
                  : 'text-[#5A7D60] hover:bg-[#F4FAF5] hover:text-[#1B3A1F]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>Recargas Bancarias</span>
              </div>
              {pendingRecharges.length > 0 && (
                <span className="bg-[#E57373] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingRecharges.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-[#1B3A1F] text-white'
                  : 'text-[#5A7D60] hover:bg-[#F4FAF5] hover:text-[#1B3A1F]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Solicitudes en Vivo</span>
              </div>
              <span className="bg-[#E8F5E9] text-[#2E7D40] text-[10px] px-2 py-0.5 rounded-full font-bold">
                {requests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#1B3A1F] text-white'
                  : 'text-[#5A7D60] hover:bg-[#F4FAF5] hover:text-[#1B3A1F]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Usuarios & Reputación</span>
              </div>
            </button>
          </div>

          <div className="bg-[#E8F5E9] border border-[#B8E0BA] rounded-2xl p-4 text-xs text-[#2E7D40] space-y-1">
            <span className="font-bold block">🚀 Sistema en Tiempo Real</span>
            <p className="text-[11px] leading-relaxed">
              Las recargas aprobadas aquí se abonan de forma instantánea al saldo del usuario.
            </p>
          </div>
        </aside>

        {/* 2. Main Content Area */}
        <main className="md:col-span-9 space-y-6">
          {/* Metrics Row (4 Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white border border-[#E0E8E1] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5A7D60] mb-1">
                <span>Usuarios Totales</span>
                <Users className="w-4 h-4 text-[#4A9E5C]" />
              </div>
              <div className="font-['Fredoka',sans-serif] font-bold text-2xl text-[#1B3A1F]">
                1.420
              </div>
              <span className="text-[10px] text-[#2E7D40] font-semibold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> +18% esta semana
              </span>
            </div>

            <div className="bg-white border border-[#E0E8E1] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5A7D60] mb-1">
                <span>Solicitudes Activas</span>
                <MessageSquare className="w-4 h-4 text-[#4A9E5C]" />
              </div>
              <div className="font-['Fredoka',sans-serif] font-bold text-2xl text-[#1B3A1F]">
                {requests.length + 23}
              </div>
              <span className="text-[10px] text-[#5A7D60] font-semibold block mt-1">
                Villarrica & Pucón
              </span>
            </div>

            <div className="bg-white border border-[#B8E0BA] rounded-2xl p-4 shadow-xs bg-gradient-to-br from-white to-[#F4FAF5]">
              <div className="flex items-center justify-between text-xs text-[#5A7D60] mb-1">
                <span>Recargas Pendientes</span>
                <CreditCard className="w-4 h-4 text-[#E65100]" />
              </div>
              <div className="font-['Fredoka',sans-serif] font-bold text-2xl text-[#E65100]">
                {pendingRecharges.length}
              </div>
              <span className="text-[10px] text-[#E65100] font-semibold block mt-1">
                Por validar cartola
              </span>
            </div>

            <div className="bg-white border border-[#E0E8E1] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5A7D60] mb-1">
                <span>Transacciones Hoy</span>
                <DollarSign className="w-4 h-4 text-[#4A9E5C]" />
              </div>
              <div className="font-['Fredoka',sans-serif] font-bold text-2xl text-[#2E7D40]">
                ${totalVolumeToday.toLocaleString('es-CL')}
              </div>
              <span className="text-[10px] text-[#5A7D60] font-semibold block mt-1">
                Comisión 10%: $14.850
              </span>
            </div>
          </div>

          {/* 3. Recharges Management Table */}
          <div className="bg-white border border-[#E0E8E1] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E0E8E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base text-[#1B3A1F]">
                  Gestión de Recargas de Saldo
                </h2>
                <p className="text-xs text-[#5A7D60]">
                  Aprueba o rechaza transferencias informadas por usuarios
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#F4FAF5] border border-[#E0E8E1] rounded-xl px-2.5 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-[#5A7D60] mr-1.5" />
                  <input
                    type="text"
                    placeholder="Buscar usuario o RUT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-xs text-[#1B3A1F] w-32 sm:w-40"
                  />
                </div>

                <select
                  value={filterBank}
                  onChange={(e) => setFilterBank(e.target.value)}
                  className="bg-[#F4FAF5] border border-[#E0E8E1] text-xs font-semibold text-[#1B3A1F] rounded-xl px-2.5 py-1.5 outline-none"
                >
                  <option value="all">Todos los bancos</option>
                  <option value="Santander">Santander</option>
                  <option value="Estado">Banco Estado</option>
                  <option value="Chile">Banco de Chile</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4FAF5] text-[#5A7D60] uppercase tracking-wider font-bold border-b border-[#E0E8E1]">
                  <tr>
                    <th className="p-3.5">Usuario & RUT</th>
                    <th className="p-3.5">Banco / N° Operación</th>
                    <th className="p-3.5">Monto</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E8E1]">
                  {filteredRecharges.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#F4FAF5]/50 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-[#1B3A1F] block">{rec.userName}</span>
                        <span className="text-[11px] text-[#5A7D60]">{rec.userRut} &bull; {rec.userPhone}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-[#1B3A1F] block">{rec.bankName}</span>
                        <span className="text-[11px] font-mono text-[#5A7D60]">{rec.operationNumber}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-['Fredoka',sans-serif] font-bold text-base text-[#2E7D40]">
                          ${rec.amount.toLocaleString('es-CL')}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#5A7D60]">
                        {rec.timestamp}
                      </td>
                      <td className="p-3.5">
                        {rec.status === 'pending' && (
                          <span className="bg-[#FFF8E1] text-[#E65100] border border-[#FFE082] px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pendiente
                          </span>
                        )}
                        {rec.status === 'approved' && (
                          <span className="bg-[#E8F5E9] text-[#2E7D40] border border-[#B8E0BA] px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Aprobada
                          </span>
                        )}
                        {rec.status === 'rejected' && (
                          <span className="bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Rechazada
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {rec.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onApproveRecharge(rec.id)}
                              className="px-3 py-1.5 bg-[#4A9E5C] hover:bg-[#2E7D40] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar
                            </button>
                            <button
                              onClick={() => onRejectRecharge(rec.id)}
                              className="px-2.5 py-1.5 bg-white border border-[#E57373] text-[#C62828] hover:bg-red-50 active:scale-95 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#5A7D60] italic">
                            Verificado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Live Requests Monitor Section */}
          <div className="bg-white border border-[#E0E8E1] rounded-2xl p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#1B3A1F]">
              Actividad Reciente en Villarrica & Lago
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requests.slice(0, 4).map((req) => (
                <div key={req.id} className="p-3 rounded-xl bg-[#F4FAF5] border border-[#E0E8E1] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4A9E5C]">{req.location.name}</span>
                    <span className="font-['Fredoka',sans-serif] font-bold text-[#1B3A1F]">${req.reward}</span>
                  </div>
                  <p className="text-xs text-[#1B3A1F] font-medium line-clamp-1">"{req.question}"</p>
                  <span className="text-[10px] text-[#5A7D60]">Por {req.requesterName} &bull; {req.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
