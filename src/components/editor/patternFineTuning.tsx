import React from 'react';
import { Check } from 'lucide-react';

interface PatternFineTuningProps {
  isDark: boolean;
  numOpacity: number;
  onOpacityChange?: (newOpacity: number) => void;
  numScale: number;
  onScaleChange?: (newScale: number) => void;
  strokeColor: string;
  onColorChange?: (newColor: string) => void;
  presetColors: Array<{ label: string; color: string }>;
  isCustomSvg: boolean;
  customSvgValue?: string;
  onCustomSvgChange?: (newSvg: string) => void;
  isCustomUpload: boolean;
  customUrlValue?: string;
  onCustomUrlChange?: (newUrl: string) => void;
}

export const PatternFineTuning: React.FC<PatternFineTuningProps> = ({
  isDark,
  numOpacity,
  onOpacityChange,
  numScale,
  onScaleChange,
  strokeColor,
  onColorChange,
  presetColors,
  isCustomSvg,
  customSvgValue,
  onCustomSvgChange,
  isCustomUpload,
  customUrlValue,
  onCustomUrlChange,
}) => {
  return (
    <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {onOpacityChange && (
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span className="text-slate-400 font-medium">Transparansi Pola:</span>
              <span className="text-emerald-400 font-bold">{Math.round(numOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.85"
              step="0.02"
              value={numOpacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        )}

        {onScaleChange && (
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span className="text-slate-400 font-medium">Skala Kerapatan:</span>
              <span className="text-teal-400 font-bold">{numScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.05"
              value={numScale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>
        )}
      </div>

      {onColorChange && (
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400 font-medium">Warna Garis Motif:</span>
            {strokeColor && (
              <button
                type="button"
                onClick={() => onColorChange('')}
                className="text-[9px] text-amber-400 hover:underline cursor-pointer"
              >
                Reset ke Default
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {presetColors.map((pc) => {
              const isSel = strokeColor.toLowerCase() === pc.color.toLowerCase();
              return (
                <button
                  key={pc.label}
                  type="button"
                  onClick={() => onColorChange(pc.color)}
                  className={`w-5 h-5 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
                    isSel ? 'ring-2 ring-emerald-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: pc.color }}
                  title={`${pc.label} (${pc.color})`}
                >
                  {isSel && <Check className="w-3 h-3 text-white drop-shadow-sm" />}
                </button>
              );
            })}
            <input
              type="color"
              value={strokeColor || (isDark ? '#94a3b8' : '#475569')}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-5 h-5 rounded-md border border-slate-600 bg-transparent cursor-pointer p-0"
              title="Pilih warna kustom bebas"
            />
          </div>
        </div>
      )}

      {isCustomSvg && onCustomSvgChange && (
        <div className="space-y-1">
          <label className="block text-[10px] font-mono text-slate-400">Tempel Kode SVG Markup:</label>
          <textarea
            rows={3}
            value={customSvgValue || ''}
            onChange={(e) => onCustomSvgChange(e.target.value)}
            placeholder="<svg ...><defs><pattern ...></defs></svg>"
            className={`w-full p-2 font-mono text-[10px] rounded-lg border ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}
          />
        </div>
      )}

      {isCustomUpload && onCustomUrlChange && (
        <div className="space-y-1">
          <label className="block text-[10px] font-mono text-slate-400">URL Gambar Watermark Latar Belakang:</label>
          <input
            type="url"
            value={customUrlValue || ''}
            onChange={(e) => onCustomUrlChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={`w-full p-2 font-mono text-xs rounded-lg border ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}
          />
        </div>
      )}
    </div>
  );
};
