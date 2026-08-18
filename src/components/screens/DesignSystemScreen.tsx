import React from 'react';
import {
  Palette,
  Type,
  Layers,
  Sparkles,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
  Sliders,
  Component,
  Copy
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, TextButton, DangerButton } from '../common/Buttons';
import { StandardCard, ElevatedCard, StatusCard } from '../common/Cards';

interface DesignSystemScreenProps {
  onBack: () => void;
}

export const DesignSystemScreen: React.FC<DesignSystemScreenProps> = ({ onBack }) => {
  const colorTokens = [
    { name: 'Primario (Verde menta)', hex: '#7BC47F', class: 'bg-[#7BC47F] text-white', role: 'Botones principales, acentos de marca' },
    { name: 'Primario Oscuro (Verde profundo)', hex: '#4A9E5C', class: 'bg-[#4A9E5C] text-white', role: 'Bordes activos, estados pressed, textos destacados' },
    { name: 'Primario Claro (Verde pastel)', hex: '#B8E0BA', class: 'bg-[#B8E0BA] text-[#1B3A1F]', role: 'Bordes secundarios, chips, sliders inactivos' },
    { name: 'Fondo Principal', hex: '#F4FAF5', class: 'bg-[#F4FAF5] text-[#1B3A1F] border border-[#E0E8E1]', role: 'Canvas general de la app' },
    { name: 'Superficie / Cards', hex: '#FFFFFF', class: 'bg-white text-[#1B3A1F] border border-[#E0E8E1]', role: 'Tarjetas, modales y hojas inferiores' },
    { name: 'Superficie Secundaria', hex: '#E8F5E9', class: 'bg-[#E8F5E9] text-[#1B3A1F]', role: 'Chips seleccionados, banners de estado' },
    { name: 'Acento (Amarillo suave)', hex: '#FFD166', class: 'bg-[#FFD166] text-[#1B3A1F]', role: 'Estrellas, calificaciones y medallas' },
    { name: 'Éxito (Verde)', hex: '#4CAF50', class: 'bg-[#4CAF50] text-white', role: 'Confirmaciones y pagos aprobados' },
    { name: 'Advertencia (Naranja)', hex: '#FFA726', class: 'bg-[#FFA726] text-white', role: 'Urgencia media, tiempo expirando' },
    { name: 'Error (Rojo suave)', hex: '#E57373', class: 'bg-[#E57373] text-white', role: 'Urgencia crítica, validaciones' },
    { name: 'Información (Azul claro)', hex: '#64B5F6', class: 'bg-[#64B5F6] text-white', role: 'Notificaciones informativas' },
    { name: 'Texto Principal', hex: '#1B3A1F', class: 'bg-[#1B3A1F] text-white', role: 'Encabezados y textos prioritarios' },
    { name: 'Texto Secundario', hex: '#5A7D60', class: 'bg-[#5A7D60] text-white', role: 'Descripciones y metadatos' },
    { name: 'Bordes & Divisores', hex: '#E0E8E1', class: 'bg-[#E0E8E1] text-[#1B3A1F]', role: 'Separadores y líneas de contorno' }
  ];

  const typographyScales = [
    { label: 'H1 Display', size: '32px', weight: 'Bold (800)', example: 'MtiGo Villarrica', sampleClass: 'text-[32px] font-bold leading-tight' },
    { label: 'H2 Sección', size: '26px', weight: 'Bold (700)', example: '¿Cómo está la playa hoy?', sampleClass: 'text-[26px] font-bold leading-tight' },
    { label: 'H3 Card Title', size: '22px', weight: 'Semibold (600)', example: 'Playa Grande Villarrica', sampleClass: 'text-[22px] font-semibold leading-tight' },
    { label: 'H4 Subtítulo', size: '18px', weight: 'Semibold (600)', example: 'Recompensa garantizada $500', sampleClass: 'text-[18px] font-semibold' },
    { label: 'Body Large', size: '18px', weight: 'Regular (400)', example: 'Información en tiempo real de personas ahí.', sampleClass: 'text-[18px] font-normal' },
    { label: 'Body Medium (Base)', size: '16px', weight: 'Regular (400)', example: 'El agua está calmada y hay poca gente hoy en la mañana.', sampleClass: 'text-[16px] font-normal' },
    { label: 'Body Small', size: '14px', weight: 'Regular (400)', example: 'Publicado hace 4 minutos por Matías Silva.', sampleClass: 'text-[14px] font-normal text-[#5A7D60]' },
    { label: 'Caption & Labels', size: '13px', weight: 'Regular (400)', example: 'Lat: -39.2785, Lng: -72.2274', sampleClass: 'text-[13px] font-mono text-[#5A7D60]' },
    { label: 'Botones / Acciones', size: '16-18px', weight: 'Semibold (600)', example: 'Publicar solicitud', sampleClass: 'text-[16px] font-semibold text-[#4A9E5C]' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-28 space-y-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E0E8E1]">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-[#5A7D60] hover:text-[#1B3A1F] flex items-center gap-1 cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a la App
          </button>
          <h1 className="text-2xl font-extrabold text-[#1B3A1F]">
            Design System & Guía UI MtiGo
          </h1>
          <p className="text-xs text-[#5A7D60]">
            Especificaciones de identidad visual, componentes interactivos y accesibilidad WCAG.
          </p>
        </div>

        <div className="bg-[#E8F5E9] border border-[#B8E0BA] text-[#2E7D40] font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#4A9E5C]" />
          <span>Flutter / Web Token Ready</span>
        </div>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#4A9E5C]" />
          <h2 className="text-lg font-bold text-[#1B3A1F]">1. Paleta de Colores & Tokens</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {colorTokens.map((token) => (
            <div
              key={token.hex}
              className="bg-white border border-[#E0E8E1] rounded-2xl p-3 flex items-start gap-3 shadow-xs"
            >
              <div
                className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-mono text-[10px] font-bold shadow-xs ${token.class}`}
              >
                {token.hex.slice(1, 4)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-[#1B3A1F] block truncate">{token.name}</span>
                <span className="font-mono text-[11px] text-[#4A9E5C] font-semibold block">{token.hex}</span>
                <span className="text-[10px] text-[#5A7D60] leading-tight block mt-0.5">{token.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Hierarchy Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-[#4A9E5C]" />
          <h2 className="text-lg font-bold text-[#1B3A1F]">2. Jerarquía Tipográfica (Inter & Fredoka)</h2>
        </div>

        <div className="bg-white border border-[#E0E8E1] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4FAF5] text-[#5A7D60] uppercase tracking-wider font-bold border-b border-[#E0E8E1]">
                <tr>
                  <th className="p-3.5">Nivel</th>
                  <th className="p-3.5">Tamaño & Peso</th>
                  <th className="p-3.5">Muestra visual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E8E1]">
                {typographyScales.map((item) => (
                  <tr key={item.label} className="hover:bg-[#F4FAF5]/40 transition-colors">
                    <td className="p-3.5 font-bold text-[#1B3A1F] whitespace-nowrap">{item.label}</td>
                    <td className="p-3.5 text-[#5A7D60] whitespace-nowrap">
                      <span className="font-mono font-bold text-[#4A9E5C]">{item.size}</span> &bull; {item.weight}
                    </td>
                    <td className="p-3.5">
                      <span className={`${item.sampleClass} text-[#1B3A1F]`}>{item.example}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Interactive Component Showcase */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Component className="w-5 h-5 text-[#4A9E5C]" />
          <h2 className="text-lg font-bold text-[#1B3A1F]">3. Componentes Interactivos (Design System)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons Showcase */}
          <div className="bg-white border border-[#E0E8E1] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#1B3A1F]">Botones (60px Altura & 16px Radius)</h3>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-[#5A7D60] font-semibold mb-1 block">Primary Button (#7BC47F)</span>
                <PrimaryButton>Publicar solicitud</PrimaryButton>
              </div>

              <div>
                <span className="text-[11px] text-[#5A7D60] font-semibold mb-1 block">Secondary Button (Borde 2px #4A9E5C)</span>
                <SecondaryButton>Ver en el mapa</SecondaryButton>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <TextButton fullWidth>Cancelar / Volver</TextButton>
                </div>
                <div className="flex-1">
                  <DangerButton>Cerrar sesión</DangerButton>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Showcase */}
          <div className="bg-white border border-[#E0E8E1] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#1B3A1F]">Variantes de Tarjetas (Cards)</h3>

            <div className="space-y-3">
              <StandardCard>
                <div className="font-bold text-xs text-[#1B3A1F]">Standard Card (20px Radius)</div>
                <p className="text-[11px] text-[#5A7D60]">Borde 1px #E0E8E1, sombra 0 4px 12px.</p>
              </StandardCard>

              <ElevatedCard>
                <div className="font-bold text-xs text-[#2E7D40]">Elevated Card (Destacada)</div>
                <p className="text-[11px] text-[#5A7D60]">Sombra suave verde y borde con tintado.</p>
              </ElevatedCard>

              <StatusCard status="success" icon={<CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />}>
                <span className="font-bold text-xs">Status Card (Éxito)</span>
                <p className="text-[11px]">Respuesta validada y saldo acreditado con éxito.</p>
              </StatusCard>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Accessibility Specification */}
      <section className="bg-[#E8F5E9] border border-[#B8E0BA] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#4A9E5C]" />
          <h2 className="text-base font-bold text-[#1B3A1F]">4. Principios de Accesibilidad Universal</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1B3A1F]">
          <div className="bg-white p-3 rounded-xl border border-[#B8E0BA] space-y-1">
            <strong className="block text-[#2E7D40]">✓ Touch Targets &gt; 60x60dp</strong>
            <p className="text-[#5A7D60] text-[11px]">
              Supera la recomendación estándar de 48dp para facilitar el tap a adultos mayores.
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#B8E0BA] space-y-1">
            <strong className="block text-[#2E7D40]">✓ Contraste WCAG AA / AAA</strong>
            <p className="text-[#5A7D60] text-[11px]">
              Contraste 4.5:1 en textos principales (#1B3A1F sobre #FFFFFF o #F4FAF5).
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#B8E0BA] space-y-1">
            <strong className="block text-[#2E7D40]">✓ Etiquetas Semánticas ARIA</strong>
            <p className="text-[#5A7D60] text-[11px]">
              Compatibilidad con TalkBack en Android y VoiceOver en iOS con feedback sonoro.
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#B8E0BA] space-y-1">
            <strong className="block text-[#2E7D40]">✓ Tipografía Legible & Mínimo 16px</strong>
            <p className="text-[#5A7D60] text-[11px]">
              Sin textos pequeños ilegibles; opción de aumento de fuente en tiempo real en Settings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
