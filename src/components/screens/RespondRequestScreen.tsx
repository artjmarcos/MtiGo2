import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Mic,
  MessageSquare,
  Smile,
  Coins,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  MapPin
} from 'lucide-react';
import { GeoRequest, RequestResponse, UserProfile } from '../../types';
import { PrimaryButton } from '../common/Buttons';
import { CameraSimulator, AudioSimulator, EmojiPicker } from '../common/MediaSimulators';

interface RespondRequestScreenProps {
  request: GeoRequest;
  user: UserProfile;
  onResponseSent: (response: RequestResponse, earnedReward: number) => void;
  onBack: () => void;
}

export const RespondRequestScreen: React.FC<RespondRequestScreenProps> = ({
  request,
  user,
  onResponseSent,
  onBack
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [textContent, setTextContent] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('☀️');
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation per type
    if (request.responseType === 'foto' && !photoUrl) {
      setError('Por favor captura o sube una foto del lugar.');
      return;
    }
    if (request.responseType === 'audio' && audioDuration === 0) {
      setError('Por favor graba un mensaje de voz con la información.');
      return;
    }
    if (request.responseType === 'texto' && !textContent.trim()) {
      setError('Por favor escribe la respuesta con los detalles solicitados.');
      return;
    }
    if (request.responseType === 'emoji' && !selectedEmoji) {
      setError('Por favor selecciona un emoji representativo.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Trigger celebratory haptics / confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7BC47F', '#4A9E5C', '#FFD166', '#B8E0BA']
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }

    setTimeout(() => {
      let finalContent = '';
      if (request.responseType === 'foto') {
        finalContent = commentText || 'Foto capturada en tiempo real en el lugar.';
      } else if (request.responseType === 'audio') {
        finalContent = `Nota de voz (${audioDuration}s): "${commentText || 'Audio descriptivo del lugar'}"`;
      } else if (request.responseType === 'texto') {
        finalContent = textContent;
      } else {
        finalContent = `Estado rápido: ${selectedEmoji} ${commentText ? ` - ${commentText}` : ''}`;
      }

      const newResponse: RequestResponse = {
        id: `resp_${Date.now()}`,
        requestId: request.id,
        authorName: user.name,
        authorPhone: user.phone,
        authorAvatar: user.avatar,
        authorRating: user.rating,
        type: request.responseType,
        content: finalContent,
        photoUrl: photoUrl || undefined,
        audioDuration: audioDuration || undefined,
        timestamp: 'Ahora mismo',
        isAccepted: true
      };

      setIsSubmitting(false);
      onResponseSent(newResponse, request.reward);
    }, 700);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 select-none">
      {/* Top Bar */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#5A7D60] hover:text-[#1B3A1F] flex items-center gap-1 cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Cancelar
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-[#1B3A1F]">
            Responder Solicitud
          </h1>
          <div className="bg-[#E8F5E9] text-[#2E7D40] font-bold text-xs px-2.5 py-1 rounded-full border border-[#B8E0BA] flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-[#4A9E5C]" />
            Gana ${request.reward.toLocaleString('es-CL')}
          </div>
        </div>
      </div>

      {/* 1. Original Question Card */}
      <div className="bg-[#F4FAF5] border border-[#B8E0BA] rounded-[20px] p-4 shadow-sm space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-[#5A7D60] font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#4A9E5C]" />
          <span>{request.location.name}</span>
        </div>
        <p className="font-bold text-sm text-[#1B3A1F] leading-snug">
          "{request.question}"
        </p>
      </div>

      {/* 2. Dynamic Input Area based on Type */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {request.responseType === 'foto' && (
          <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-3">
            <label className="font-bold text-sm text-[#1B3A1F] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#4A9E5C]" />
              <span>Tomar o subir foto requerida</span>
            </label>
            <CameraSimulator onPhotoSelected={(url) => setPhotoUrl(url)} initialPhotoUrl={photoUrl} />

            <div className="pt-2">
              <label htmlFor="photo-comment" className="text-xs font-semibold text-[#5A7D60] mb-1 block">
                Comentario adicional (opcional):
              </label>
              <input
                id="photo-comment"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ej: Está súper tranquilo hoy y poco viento..."
                className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:bg-white focus:border-[#4A9E5C] rounded-xl px-3.5 py-2.5 text-xs text-[#1B3A1F] outline-none"
              />
            </div>
          </div>
        )}

        {request.responseType === 'audio' && (
          <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-3">
            <label className="font-bold text-sm text-[#1B3A1F] flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#E65100]" />
              <span>Grabar nota de voz</span>
            </label>
            <AudioSimulator onAudioRecorded={(sec) => setAudioDuration(sec)} />

            <div className="pt-2">
              <label htmlFor="audio-comment" className="text-xs font-semibold text-[#5A7D60] mb-1 block">
                Resumen en texto (opcional):
              </label>
              <input
                id="audio-comment"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ej: Acabo de pasar y no hay fila en la entrada..."
                className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:bg-white focus:border-[#4A9E5C] rounded-xl px-3.5 py-2.5 text-xs text-[#1B3A1F] outline-none"
              />
            </div>
          </div>
        )}

        {request.responseType === 'texto' && (
          <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-2">
            <label htmlFor="text-response" className="font-bold text-sm text-[#1B3A1F] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0D47A1]" />
              <span>Escribe tu respuesta detallada (5 líneas)</span>
            </label>
            <textarea
              id="text-response"
              rows={5}
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Explica claramente lo que estás viendo en este momento en el lugar..."
              className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:bg-white focus:border-[#4A9E5C] rounded-xl p-3.5 text-sm text-[#1B3A1F] outline-none resize-none leading-relaxed font-medium"
            />
          </div>
        )}

        {request.responseType === 'emoji' && (
          <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-3">
            <label className="font-bold text-sm text-[#1B3A1F] flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#7B1FA2]" />
              <span>Selecciona el estado con un emoji rápido</span>
            </label>
            <EmojiPicker
              selectedEmoji={selectedEmoji}
              onSelect={(emoji) => setSelectedEmoji(emoji)}
            />

            <div className="pt-2">
              <label htmlFor="emoji-comment" className="text-xs font-semibold text-[#5A7D60] mb-1 block">
                Breve nota complementaria (opcional):
              </label>
              <input
                id="emoji-comment"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ej: Mucho sol y viento calmo..."
                className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:bg-white focus:border-[#4A9E5C] rounded-xl px-3.5 py-2.5 text-xs text-[#1B3A1F] outline-none"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs font-bold text-[#E57373] bg-[#FFEBEE] p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {/* Micro-reward callout */}
        <div className="bg-[#E8F5E9] border border-[#B8E0BA] rounded-2xl p-3 flex items-center gap-2.5 text-xs text-[#2E7D40]">
          <Sparkles className="w-4 h-4 text-[#4A9E5C] flex-shrink-0" />
          <span>
            Al validar tu respuesta se acreditarán <strong>${request.reward.toLocaleString('es-CL')}</strong> en tu billetera de inmediato.
          </span>
        </div>

        {/* Sticky Send Response Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E0E8E1] z-40 max-w-md mx-auto">
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<CheckCircle2 className="w-5 h-5" />}
          >
            Enviar respuesta y cobrar ${request.reward}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
