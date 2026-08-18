import React, { useState } from 'react';
import { Star, CheckCircle2, ArrowLeft, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { PrimaryButton } from '../common/Buttons';

interface RatingScreenProps {
  requesterOrAuthorName?: string;
  onRatingSubmitted: (stars: number, comment: string) => void;
  onBack: () => void;
}

export const RatingScreen: React.FC<RatingScreenProps> = ({
  requesterOrAuthorName = 'Camila Rojas',
  onRatingSubmitted,
  onBack
}) => {
  const [stars, setStars] = useState<number>(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('¡Excelente foto y rápida respuesta sobre el estado de la playa!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const starLabels = [
    'Mala experiencia 🙁',
    'Regular 😐',
    'Buena 🙂',
    'Muy buena 😀',
    '¡Excelente y al instante! 🤩'
  ];

  const currentStarIndex = (hoveredStar || stars) - 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onRatingSubmitted(stars, comment);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-full flex flex-col justify-between select-none">
      {/* Top Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#5A7D60] hover:text-[#1B3A1F] flex items-center gap-1 cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF8E1] border border-[#FFE082] text-[#FFA726] mx-auto flex items-center justify-center shadow-inner">
            <Star className="w-9 h-9 fill-[#FFD166] text-[#FFD166]" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#1B3A1F]">
            ¿Cómo fue tu experiencia?
          </h1>
          <p className="text-sm text-[#5A7D60] max-w-xs mx-auto">
            Califica la respuesta de <strong className="text-[#1B3A1F]">{requesterOrAuthorName}</strong> para mantener la confianza en la comunidad MtiGo.
          </p>
        </div>
      </div>

      {/* Star Selector & Mood Box */}
      <form onSubmit={handleSubmit} className="my-8 space-y-6">
        {/* 5 Big Stars (48px) */}
        <div className="bg-white border border-[#E0E8E1] rounded-[24px] p-6 text-center space-y-4 shadow-sm">
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((starNum) => {
              const active = starNum <= (hoveredStar || stars);
              return (
                <button
                  key={starNum}
                  type="button"
                  onClick={() => setStars(starNum)}
                  onMouseEnter={() => setHoveredStar(starNum)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="p-1 rounded-2xl transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                  aria-label={`${starNum} estrellas`}
                >
                  <Star
                    className={`w-11 h-11 sm:w-12 sm:h-12 transition-colors ${
                      active
                        ? 'fill-[#FFD166] text-[#FFD166] drop-shadow-md'
                        : 'text-[#E0E8E1] hover:text-[#FFE082]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="text-sm font-bold text-[#2E7D40] bg-[#E8F5E9] py-1.5 px-4 rounded-full inline-block border border-[#B8E0BA]">
            {starLabels[currentStarIndex] || 'Selecciona una calificación'}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="bg-white border border-[#E0E8E1] rounded-[20px] p-4 shadow-sm space-y-2">
          <label htmlFor="rating-comment" className="font-bold text-sm text-[#1B3A1F] flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#4A9E5C]" />
            <span>Deja un comentario (opcional)</span>
          </label>

          <textarea
            id="rating-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe qué te pareció la rapidez o claridad..."
            className="w-full bg-[#F4FAF5] border border-[#E0E8E1] focus:bg-white focus:border-[#4A9E5C] rounded-xl p-3 text-xs text-[#1B3A1F] outline-none resize-none leading-relaxed font-medium"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<CheckCircle2 className="w-5 h-5" />}
          >
            Enviar calificación
          </PrimaryButton>
        </div>
      </form>

      {/* Community Trust Notice */}
      <div className="text-center text-xs text-[#5A7D60] flex items-center justify-center gap-1.5">
        <Heart className="w-4 h-4 text-[#E57373] fill-[#E57373]" />
        <span>Tus comentarios ayudan a los turistas y vecinos de Villarrica</span>
      </div>
    </div>
  );
};
