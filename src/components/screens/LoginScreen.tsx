import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, Sparkles, MapPin, MessageSquareText, AlertCircle } from 'lucide-react';
import { PrimaryButton, TextButton } from '../common/Buttons';
import { StatusCard } from '../common/Cards';

interface LoginScreenProps {
  onLoginSuccess: (phoneNumber: string) => void;
  onGoToAdminDemo?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoToAdminDemo }) => {
  const [phone, setPhone] = useState('987654321');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      setError('Por favor ingresa un número de teléfono válido de 9 dígitos.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(`+56 ${phone}`);
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 max-w-md mx-auto select-none">
      {/* Top Section / Branding */}
      <div className="pt-6 text-center space-y-6">
        {/* Game-styled App Logo: Location Pin + Speech Bubble */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-tr from-[#4A9E5C] via-[#7BC47F] to-[#B8E0BA] p-1 shadow-[0_10px_25px_rgba(74,158,92,0.3)] animate-map-float">
            <div className="w-full h-full bg-[#1B3A1F] rounded-[24px] flex items-center justify-center relative overflow-hidden">
              {/* Background subtle radar rings */}
              <div className="absolute inset-0 border border-[#7BC47F]/30 rounded-full scale-125" />
              <div className="absolute inset-0 border border-[#7BC47F]/20 rounded-full scale-150" />
              
              {/* Pin + Message Icon Fusion */}
              <div className="relative flex items-center justify-center">
                <MapPin className="w-11 h-11 text-[#7BC47F] fill-[#7BC47F]/20" />
                <MessageSquareText className="w-6 h-6 text-white absolute -top-1 -right-1 bg-[#4A9E5C] p-0.5 rounded-full ring-2 ring-[#1B3A1F]" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#FFD166] text-[#1B3A1F] font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md border-2 border-white">
            CHILE
          </div>
        </div>

        <div>
          <h1 className="font-['Fredoka',sans-serif] text-3xl font-extrabold text-[#1B3A1F] tracking-tight">
            Mti<span className="text-[#4A9E5C]">Go</span>
          </h1>
          <p className="mt-2 text-base text-[#5A7D60] font-medium max-w-[280px] mx-auto leading-snug">
            Información en tiempo real, de personas que están ahí.
          </p>
        </div>

        {/* Example pill badge */}
        <div className="inline-flex items-center gap-2 bg-[#E8F5E9] border border-[#B8E0BA] px-3.5 py-1.5 rounded-full text-xs text-[#2E7D40] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#4A9E5C]" />
          <span>Villarrica &bull; Pucón &bull; Todo Chile</span>
        </div>
      </div>

      {/* Form Section */}
      <div className="my-8 space-y-4">
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label
              htmlFor="phone-input"
              className="block text-sm font-bold text-[#1B3A1F] mb-1.5"
            >
              Número de Teléfono
            </label>

            <div
              className={`
                flex items-center bg-white border-2 rounded-[16px] overflow-hidden transition-all h-[60px] shadow-sm
                ${error ? 'border-[#E57373] ring-2 ring-red-100' : 'border-[#E0E8E1] focus-within:border-[#4A9E5C] focus-within:ring-4 focus-within:ring-[#7BC47F]/20'}
              `}
            >
              <div className="px-4 py-3 bg-[#F4FAF5] border-r border-[#E0E8E1] flex items-center gap-2 text-sm font-bold text-[#1B3A1F] select-none">
                <span className="text-base">🇨🇱</span>
                <span>+56</span>
              </div>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  if (error) setError(null);
                }}
                placeholder="9 8765 4321"
                maxLength={9}
                className="flex-1 px-4 py-3 text-lg font-semibold text-[#1B3A1F] outline-none placeholder:text-[#5A7D60]/50 bg-transparent"
                aria-describedby={error ? 'phone-error' : undefined}
                autoFocus
              />
              <div className="pr-4 text-[#5A7D60]">
                <Phone className="w-5 h-5" />
              </div>
            </div>

            {error && (
              <p id="phone-error" className="mt-2 text-xs font-semibold text-[#E57373] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Enviar código
          </PrimaryButton>
        </form>

        <div className="text-center pt-2">
          <TextButton
            type="button"
            onClick={() => onLoginSuccess('+56 987654321')}
            className="w-full text-xs text-[#5A7D60]"
          >
            ¿No recibiste el código? Reenviar
          </TextButton>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center pt-4 border-t border-[#E0E8E1]/60">
        <div className="flex items-center justify-center gap-2 text-xs text-[#5A7D60]">
          <ShieldCheck className="w-4 h-4 text-[#4A9E5C]" />
          <span>Acceso seguro sin contraseñas con SMS OTP</span>
        </div>
        <p className="text-[11px] text-[#5A7D60]/80 mt-1">
          Al continuar aceptas los Términos de Servicio y Privacidad de MtiGo.
        </p>
      </div>
    </div>
  );
};
