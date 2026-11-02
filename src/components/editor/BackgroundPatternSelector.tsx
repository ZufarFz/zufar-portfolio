import React, { useState } from 'react';
import { Palette, Sparkles, Check, ChevronDown } from 'lucide-react';
import { BackgroundTextures } from '../effects';
import { BG_PATTERN_GROUPS, BgPatternOption } from '../../data/patterns';
import { PatternFineTuning } from './patternFineTuning';

export interface BackgroundPatternSelectorProps {
  value?: string;
  onChange: (newStyle: string) => void;
  opacityValue?: string | number;
  onOpacityChange?: (newOpacity: number) => void;
  scaleValue?: string | number;
  onScaleChange?: (newScale: number) => void;
  colorValue?: string;
  onColorChange?: (newColor: string) => void;
  customSvgValue?: string;
  onCustomSvgChange?: (newSvg: string) => void;
  customUrlValue?: string;
  onCustomUrlChange?: (newUrl: string) => void;
  theme: 'light' | 'dark';
  label?: string;
  showPreview?: boolean;
  compact?: boolean;
  onApplyToAll?: () => void;
  sectionName?: string;
}

export default function BackgroundPatternSelector({
  value = 'none',
  onChange,
  opacityValue,
  onOpacityChange,
  scaleValue,
  onScaleChange,
  colorValue,
  onColorChange,
  customSvgValue,
  onCustomSvgChange,
  customUrlValue,
  onCustomUrlChange,
  theme,
  label = 'Pola Latar Belakang (SVG & Tekstur):',
  showPreview = true,
  compact = false,
  onApplyToAll,
}: BackgroundPatternSelectorProps) {
  const isDark = theme === 'dark';
  const currentStyle = value || 'none';

  let activeOption: BgPatternOption | undefined;
  for (const group of BG_PATTERN_GROUPS) {
    const found = group.options.find(o => o.id === currentStyle);
    if (found) {
      activeOption = found;
      break;
    }
  }

  const isPattern = currentStyle.startsWith('pattern_') || currentStyle.startsWith('watercolor_') || currentStyle === 'custom_svg_pattern';
  const isCustomSvg = currentStyle === 'custom_svg_pattern';
  const isCustomUpload = currentStyle === 'custom_upload';

  const numOpacity = opacityValue !== undefined ? parseFloat(String(opacityValue)) : (isDark ? 0.22 : 0.18);
  const numScale = scaleValue !== undefined ? parseFloat(String(scaleValue)) : 1;
  const strokeColor = colorValue || '';

  const [appliedNotification, setAppliedNotification] = useState(false);

  const handleApplyAllClick = () => {
    if (onApplyToAll) {
      onApplyToAll();
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 2500);
    }
  };

  const presetColors = [
    { label: 'Slate', color: isDark ? '#94a3b8' : '#475569' },
    { label: 'Emerald', color: '#10b981' },
    { label: 'Teal', color: '#14b8a6' },
    { label: 'Cyan', color: '#06b6d4' },
    { label: 'Blue', color: '#3b82f6' },
    { label: 'Indigo', color: '#6366f1' },
    { label: 'Amber', color: '#f59e0b' },
    { label: 'Rose', color: '#f43f5e' },
    { label: 'White/Black', color: isDark ? '#ffffff' : '#0f172a' }
  ];

  return (
    <div className={`space-y-3 ${compact ? 'text-xs' : ''}`}>
      {/* Label and Section Title */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Palette className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <label className={`font-mono text-[10.5px] font-bold uppercase tracking-wider truncate ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {label}
          </label>
        </div>

        {onApplyToAll && (
          <button
            type="button"
            onClick={handleApplyAllClick}
            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              appliedNotification
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                : isDark
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Terapkan pola SVG dan pengaturan warna ini ke seluruh halaman/seksi"
          >
            {appliedNotification ? (
              <>
                <Check className="w-2.5 h-2.5" />
                <span>Diterapkan ke Semua!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>Terapkan ke Semua</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* DROPDOWN SELECTOR */}
      <div className="relative">
        <select
          value={currentStyle}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-xs font-medium py-2.5 px-3 rounded-xl border appearance-none cursor-pointer transition-all pr-8 ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
              : 'bg-white border-slate-300 text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
          }`}
        >
          {BG_PATTERN_GROUPS.map((group) => (
            <optgroup key={group.name} label={`${group.icon} ${group.name} (${group.options.length})`}>
              {group.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* SELECTED PATTERN SUMMARY & MINI PREVIEW */}
      {showPreview && currentStyle !== 'none' && currentStyle !== 'solid' && (
        <div className={`p-3 rounded-xl border transition-all ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`relative w-20 h-14 rounded-lg overflow-hidden border shrink-0 ${
              isDark ? 'bg-slate-900 border-slate-700 shadow-inner' : 'bg-white border-slate-300 shadow-xs'
            }`}>
              <BackgroundTextures
                type={currentStyle}
                theme={theme}
                opacity={numOpacity}
                scale={numScale}
                color={strokeColor || undefined}
                customSvg={customSvgValue}
                customBgUrl={customUrlValue}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-mono text-[8px] font-bold px-1 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs">
                  Preview
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-emerald-500 truncate">
                  {activeOption?.label || currentStyle}
                </span>
                {activeOption?.badge && (
                  <span className="text-[7.5px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500 font-bold border border-amber-500/30 shrink-0">
                    {activeOption.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {activeOption?.desc || 'Motif background aktif'}
              </p>
            </div>
          </div>

          {(isPattern || currentStyle === 'dots' || currentStyle === 'grid' || currentStyle === 'abstract') && (
            <PatternFineTuning
              isDark={isDark}
              numOpacity={numOpacity}
              onOpacityChange={onOpacityChange}
              numScale={numScale}
              onScaleChange={onScaleChange}
              strokeColor={strokeColor}
              onColorChange={onColorChange}
              presetColors={presetColors}
              isCustomSvg={isCustomSvg}
              customSvgValue={customSvgValue}
              onCustomSvgChange={onCustomSvgChange}
              isCustomUpload={isCustomUpload}
              customUrlValue={customUrlValue}
              onCustomUrlChange={onCustomUrlChange}
            />
          )}
        </div>
      )}
    </div>
  );
}

