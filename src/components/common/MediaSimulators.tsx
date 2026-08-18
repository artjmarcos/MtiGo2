import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Check, Upload, Play, Pause, Mic, Square, Sparkles, Smile } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   1. CAMERA & PHOTO SIMULATOR
─────────────────────────────────────────────────────────────── */
interface CameraSimulatorProps {
  onPhotoSelected: (url: string) => void;
  initialPhotoUrl?: string;
}

export const CameraSimulator: React.FC<CameraSimulatorProps> = ({
  onPhotoSelected,
  initialPhotoUrl
}) => {
  const [photo, setPhoto] = useState<string | null>(initialPhotoUrl || null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated authentic Villarrica locations photos for quick preview testing
  const presetPhotos = [
    {
      label: 'Playa Grande Hoy',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'Volcán Despejado',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'Costanera y Lago',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'Feria Artesanal',
      url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const handleSimulateCapture = (url: string) => {
    setIsCapturing(true);
    setTimeout(() => {
      setPhoto(url);
      onPhotoSelected(url);
      setIsCapturing(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhoto(result);
        onPhotoSelected(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      {photo ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#7BC47F] shadow-md group">
          <img src={photo} alt="Foto capturada" className="w-full h-56 object-cover" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setPhoto(null);
                onPhotoSelected('');
              }}
              className="bg-white text-[#1B3A1F] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" /> Tomar otra
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-[#1B3A1F]/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#7BC47F]" /> Foto lista para enviar
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#B8E0BA] rounded-2xl p-4 bg-[#F4FAF5] text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F5E9] text-[#4A9E5C] flex items-center justify-center shadow-inner">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-[#1B3A1F] text-base">Captura o selecciona foto del lugar</h4>
            <p className="text-xs text-[#5A7D60]">Toma una foto en vivo para mostrar la situación actual</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSimulateCapture(presetPhotos[0].url)}
              disabled={isCapturing}
              className="h-12 bg-[#7BC47F] hover:bg-[#6EB372] active:scale-95 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              {isCapturing ? 'Capturando...' : 'Tomar Foto'}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 bg-white hover:bg-[#F4FAF5] border border-[#7BC47F] text-[#4A9E5C] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Subir archivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Quick Preset Photos in Villarrica */}
          <div className="pt-2 border-t border-[#E0E8E1]">
            <p className="text-[11px] text-[#5A7D60] font-medium mb-1.5 text-left">
              O elige una escena de prueba en Villarrica:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {presetPhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSimulateCapture(preset.url)}
                  className="text-left text-xs bg-white hover:bg-[#E8F5E9] border border-[#E0E8E1] p-1.5 rounded-lg truncate flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#7BC47F]" />
                  <span className="truncate text-[#1B3A1F] font-medium">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   2. AUDIO RECORDER & WAVEFORM SIMULATOR
─────────────────────────────────────────────────────────────── */
interface AudioSimulatorProps {
  onAudioRecorded: (durationSec: number) => void;
}

export const AudioSimulator: React.FC<AudioSimulatorProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSeconds(0);
      setRecordedDuration(null);
    } else {
      setIsRecording(false);
      const finalSec = Math.max(seconds, 3);
      setRecordedDuration(finalSec);
      onAudioRecorded(finalSec);
    }
  };

  return (
    <div className="rounded-2xl border border-[#B8E0BA] bg-[#F4FAF5] p-4 text-center space-y-4">
      {recordedDuration ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white border border-[#E0E8E1] rounded-2xl p-3.5 shadow-sm">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-[#7BC47F] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Simulated Animated Waveform */}
            <div className="flex-1 mx-4 flex items-center gap-1 h-10 overflow-hidden">
              {[40, 65, 85, 30, 95, 70, 50, 90, 60, 40, 75, 85, 55, 35, 90, 70, 45, 60, 80].map((height, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    isPlaying ? 'bg-[#4A9E5C] animate-pulse' : 'bg-[#B8E0BA]'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.min(100, Math.max(20, height + (i % 3) * 15))}%` : `${height * 0.6}%`
                  }}
                />
              ))}
            </div>

            <span className="font-mono text-xs font-bold text-[#4A9E5C]">
              00:{recordedDuration < 10 ? `0${recordedDuration}` : recordedDuration}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setRecordedDuration(null);
              setSeconds(0);
              onAudioRecorded(0);
            }}
            className="text-xs text-[#E57373] hover:text-red-700 font-semibold underline cursor-pointer"
          >
            Grabar nuevamente
          </button>
        </div>
      ) : (
        <div className="py-2 space-y-3">
          <div className="relative inline-block">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
            )}
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
                isRecording
                  ? 'bg-[#E57373] text-white ring-4 ring-red-200'
                  : 'bg-[#7BC47F] text-white hover:bg-[#6EB372] ring-4 ring-[#B8E0BA]/50'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-9 h-9" />}
            </button>
          </div>

          <div>
            <h4 className="font-bold text-[#1B3A1F] text-base">
              {isRecording ? `Grabando mensaje de voz... (00:${seconds < 10 ? `0${seconds}` : seconds})` : 'Presiona para grabar audio'}
            </h4>
            <p className="text-xs text-[#5A7D60]">
              {isRecording ? 'Presiona el botón rojo cuando termines' : 'Describe con tu voz la situación del lugar (máx 30s)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   3. EMOJI QUICK REACTION PICKER
─────────────────────────────────────────────────────────────── */
interface EmojiPickerProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ selectedEmoji, onSelect }) => {
  const emojiPresets = [
    { emoji: '☀️', label: 'Soleado / Lindo' },
    { emoji: '🌧️', label: 'Lloviendo' },
    { emoji: '💨', label: 'Mucho Viento' },
    { emoji: '👥', label: 'Muy Lleno' },
    { emoji: '🏖️', label: 'Playa Tranquila' },
    { emoji: '☕', label: 'Café Abierto' },
    { emoji: '🔒', label: 'Cerrado' },
    { emoji: '⏳', label: 'Fila Larga' },
    { emoji: '⚡', label: 'Rápido / Expedito' },
    { emoji: '🏔️', label: 'Volcán Visible' },
    { emoji: '🌊', label: 'Oleaje Suave' },
    { emoji: '✅', label: 'Todo Ok / Recomendado' }
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {emojiPresets.map((item) => {
        const isSelected = selectedEmoji === item.emoji;
        return (
          <button
            key={item.emoji}
            type="button"
            onClick={() => onSelect(item.emoji)}
            className={`
              p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer
              ${isSelected
                ? 'bg-[#E8F5E9] border-[#4A9E5C] ring-2 ring-[#7BC47F] shadow-sm'
                : 'bg-white border-[#E0E8E1] hover:bg-[#F4FAF5]'
              }
            `}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className={`text-[11px] font-semibold truncate max-w-full ${isSelected ? 'text-[#2E7D40]' : 'text-[#5A7D60]'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
