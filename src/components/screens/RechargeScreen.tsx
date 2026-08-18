import React, { useState } from 'react';
import {
  Building2,
  Copy,
  Check,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Upload,
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { AdminRecharge } from '../../types';

interface RechargeScreenProps {
  onRechargeSubmitted: (recharge: AdminRecharge) => void;
  onBack: () => void;
}

export const RechargeScreen: React.FC<RechargeScreenProps> = ({
  onRechargeSubmitted,
  onBack
}) => {
  const [amount, setAmount] = useState<number>(5000);
  const [operationNumber, setOperationNumber] = useState<string>('TRF-889102');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSent, setSuccessSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bankData = [
    { label: 'Banco', value: 'Banco Santander Chile', key: 'bank' },
    { label: 'Tipo de cuenta', value: 'Cuenta Corriente', key: 'type' },
    { label: 'Número de cuenta', value: '00-7749201-9', key: 'account' },
    { label: 'RUT', value: '76.890.123-4', key: 'rut' },
    { label: 'Destinatario', value: 'MtiGo SpA', key: 'name' },
    { label: 'Email comprobante', value: 'pagos@mtigo.app', key: 'email' }
  ];

  const quickAmounts = [1000, 2000, 5000, 10000, 20000];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 500) {
      setError('El monto mínimo de recarga es de $500.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      const newAdminRecharge: AdminRecharge = {
        id: `rec_${Date.now()}`,
        userName: 'Nicolás Valenzuela',
        userPhone: '+56 9 8765 4321',
        userRut: '18.452.981-K',
        bankName: 'Banco Santander',
        amount: Number(amount),
        operationNumber: operationNumber || `OP-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: 'Ahora mismo',
        status: 'pending',
        voucherNote: 'Transferencia informada desde app móvil'
      };

      setIsSubmitting(false);
      setSuccessSent(true);
      setTimeout(() => {
        onRechargeSubmitted(newAdminRecharge);
      }, 1200);
    }, 700);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-5 select-none">
      {/* Top Bar */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#5A7D60] hover:text-[#1B3A1F] flex items-center gap-1 cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Billetera
        </button>
        <h1 className="text-xl font-extrabold text-[#1B3A1F]">
          Recargar Saldo
        </h1>
        <p className="text-xs text-[#5A7D60]">
          Transfiere a nuestra cuenta bancaria y reporta el comprobante
        </p>
      </div>

      {successSent ? (
        <div className="bg-white border-2 border-[#7BC47F] rounded-[24px] p-6 text-center space-y-3 shadow-lg animate-soft-pulse">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#4A9E5C] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-lg text-[#1B3A1F]">¡Recarga Notificada!</h3>
          <p className="text-xs text-[#5A7D60] leading-relaxed">
            Hemos recibido el aviso de tu transferencia por <strong>${amount.toLocaleString('es-CL')}</strong>. El equipo administrador validará los fondos en unos minutos.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Bank Information Card with 1-Click Copy */}
          <div className="bg-white border border-[#B8E0BA] rounded-[22px] p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D40] uppercase tracking-wider pb-2 border-b border-[#E0E8E1]">
              <Building2 className="w-4 h-4 text-[#4A9E5C]" />
              <span>Datos Bancarios para Transferencia</span>
            </div>

            <div className="space-y-2">
              {bankData.map((item) => {
                const isCopied = copiedField === item.key;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#F4FAF5] hover:bg-[#E8F5E9] transition-colors"
                  >
                    <div>
                      <span className="text-[10px] text-[#5A7D60] font-semibold block">{item.label}</span>
                      <span className="text-xs font-bold text-[#1B3A1F]">{item.value}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.key, item.value)}
                      className={`
                        px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer
                        ${isCopied ? 'bg-[#4A9E5C] text-white' : 'bg-white border border-[#E0E8E1] text-[#4A9E5C] hover:border-[#7BC47F]'}
                      `}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Amount Transferred Input */}
          <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-3">
            <label htmlFor="recharge-amount" className="font-bold text-sm text-[#1B3A1F] block">
              Monto transferido (CLP)
            </label>

            <div className="flex items-center bg-[#F4FAF5] border border-[#E0E8E1] focus-within:border-[#4A9E5C] focus-within:bg-white rounded-2xl px-4 py-2.5">
              <span className="text-lg font-bold text-[#1B3A1F] mr-2">$</span>
              <input
                id="recharge-amount"
                type="number"
                min={500}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1 text-xl font-bold text-[#1B3A1F] outline-none bg-transparent"
                placeholder="5000"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`
                    py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center
                    ${amount === amt
                      ? 'bg-[#1B3A1F] text-white shadow-sm ring-1 ring-[#7BC47F]'
                      : 'bg-[#F4FAF5] hover:bg-[#E8F5E9] text-[#1B3A1F] border border-[#E0E8E1]'
                    }
                  `}
                >
                  ${amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Operation / Voucher Reference Number */}
          <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-2">
            <label htmlFor="operation-num" className="font-bold text-sm text-[#1B3A1F] block">
              N° de Operación / Transferencia (Opcional)
            </label>
            <input
              id="operation-num"
              type="text"
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              placeholder="Ej: 9834012 o comprobante Santander"
              className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:bg-white focus:border-[#4A9E5C] rounded-xl px-3.5 py-2.5 text-xs text-[#1B3A1F] outline-none"
            />
          </div>

          {/* 5. Verification Notice */}
          <div className="bg-[#E8F5E9] border border-[#B8E0BA] rounded-2xl p-3.5 flex items-start gap-3 text-xs text-[#2E7D40]">
            <Clock className="w-5 h-5 text-[#4A9E5C] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Verificación rápida</strong>
              Un administrador validará la cartola y activará tu saldo en menos de 5 minutos.
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-[#E57373] bg-[#FFEBEE] p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}

          {/* 4. Primary Button Confirm */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E0E8E1] z-40 max-w-md mx-auto">
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              rightIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              Confirmar recarga (${amount.toLocaleString('es-CL')})
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  );
};
