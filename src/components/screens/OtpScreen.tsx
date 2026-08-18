import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';

interface OtpScreenProps {
  phoneNumber: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  phoneNumber,
  onVerifySuccess,
  onBack
}) => {
  const [digits, setDigits] = useState<string[]>(['8', '3', '9', '2', '0', '1']);
  const [timer, setTimer] = useState<number>(54);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);
    if (error) setError(null);

    // Auto move to next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setError('Por favor ingresa los 6 dígitos del código.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onVerifySuccess();
    }, 600);
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setError(null);
    setDigits(['8', '3', '9', '2', '0', '1']);
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 max-w-md mx-auto select-none">
      {/* Top Header */}
      <div>
        <button
          onClick={onBack}
          aria-label="Cambiar número de teléfono"
          className="w-11 h-11 rounded-2xl bg-white border border-[#E0E8E1] hover:bg-[#F4FAF5] active:scale-95 flex items-center justify-center text-[#1B3A1F] transition-all cursor-pointer mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#4A9E5C] mx-auto flex items-center justify-center shadow-inner border border-[#B8E0BA]">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#1B3A1F] pt-2">
            Ingresa el código
          </h1>
          <p className="text-sm text-[#5A7D60] max-w-xs mx-auto">
            Hemos enviado un código SMS de 6 dígitos al número{' '}
            <span className="font-bold text-[#1B3A1F]">{phoneNumber}</span>
          </p>
        </div>
      </div>

      {/* OTP Boxes Section */}
      <div className="my-8 space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-12 h-14 sm:w-13 sm:h-16 text-center text-2xl font-extrabold rounded-[16px] border-2 bg-white
                transition-all outline-none shadow-sm
                ${digit ? 'border-[#4A9E5C] text-[#1B3A1F] bg-[#F4FAF5]' : 'border-[#E0E8E1] text-[#1B3A1F]'}
                focus:border-[#7BC47F] focus:ring-4 focus:ring-[#7BC47F]/30
              `}
              aria-label={`Dígito ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs font-semibold text-[#E57373] text-center flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}

        {/* Resend Timer Pill */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-sm font-bold text-[#4A9E5C] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Reenviar código SMS
            </button>
          ) : (
            <p className="text-xs text-[#5A7D60] font-medium bg-[#E8F5E9] border border-[#B8E0BA] inline-block px-3.5 py-1.5 rounded-full">
              Reenviar código en <span className="font-bold text-[#1B3A1F]">{timer}s</span>
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <PrimaryButton
          onClick={handleVerify}
          isLoading={isLoading}
          rightIcon={<CheckCircle2 className="w-5 h-5" />}
        >
          Verificar
        </PrimaryButton>

        <SecondaryButton
          onClick={handleResend}
          disabled={!canResend}
        >
          Reenviar código
        </SecondaryButton>
      </div>
    </div>
  );
};
