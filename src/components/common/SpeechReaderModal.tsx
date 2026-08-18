import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, X, Play, Pause } from 'lucide-react';

interface SpeechReaderModalProps {
  currentScreenName: string;
  screenTextSummary: string;
  onClose: () => void;
}

export const SpeechReaderModal: React.FC<SpeechReaderModalProps> = ({
  currentScreenName,
  screenTextSummary,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(screenTextSummary);
      utterance.lang = 'es-CL'; // Chilean Spanish voice
      utterance.rate = 0.95; // Clear pace for accessibility

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 bg-[#1B3A1F] text-white p-4 rounded-2xl shadow-2xl border-2 border-[#7BC47F] animate-soft-pulse select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#4A9E5C]/50">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#7BC47F]" />
          <span className="font-bold text-xs text-[#7BC47F] uppercase tracking-wider">
            Lector de Accesibilidad (TalkBack / VoiceOver)
          </span>
        </div>
        <button
          onClick={() => {
            if ('speechSynthesis' in window) speechSynthesis.cancel();
            onClose();
          }}
          className="text-white/70 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-2.5">
        <span className="text-[11px] text-[#B8E0BA] block font-semibold">Pantalla actual: {currentScreenName}</span>
        <p className="text-xs text-white/90 line-clamp-3 mt-1 leading-relaxed">
          "{screenTextSummary}"
        </p>
      </div>

      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={handleSpeak}
          className="flex-1 py-2.5 bg-[#7BC47F] hover:bg-[#6EB372] text-[#1B3A1F] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" /> Pausar lectura
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Escuchar en voz alta
            </>
          )}
        </button>
      </div>
    </div>
  );
};
