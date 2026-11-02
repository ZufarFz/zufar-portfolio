import React from 'react';
import { Sparkles, Sun, Moon, Check, Paintbrush } from 'lucide-react';
import { CVData } from '../../../types';
import { HERO_THEME_TEMPLATES } from '../../../data/themeTemplates';

interface ThemeTemplatesTabProps {
  cvData: CVData;
  cardBg: string;
  onApplyTheme: (patch: Record<string, string>, themeAccent?: string) => void;
  showFeedback: (msg: string) => void;
}

export const ThemeTemplatesTab: React.FC<ThemeTemplatesTabProps> = ({
  cvData,
  cardBg,
  onApplyTheme,
  showFeedback
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Pilihan Palet Tema Warna untuk Halaman Profil:</span>
        </h4>
        <span className="text-[10px] text-slate-500 font-mono">
          {HERO_THEME_TEMPLATES.length} Template Siap Pakai
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {HERO_THEME_TEMPLATES.map((tmpl) => {
          const isAsahi = tmpl.id === 'hero-asahi-tsukimi';
          const currentBg = cvData.webTexts?.home_bg_color || cvData.webTexts?.hero_bg_color;
          const isCurrentActive = currentBg === tmpl.palette.light.background;

          return (
            <div
              key={tmpl.id}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${cardBg} ${
                isCurrentActive ? 'ring-2 ring-purple-500/80 border-purple-500/50' : 'hover:border-slate-700'
              }`}
            >
              {isCurrentActive && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold font-mono flex items-center gap-1">
                  <Check className="w-3 h-3 text-purple-400" />
                  <span>Sedang Aktif</span>
                </div>
              )}

              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    {tmpl.previewIcon || '🎨'}
                  </span>
                  <div>
                    <h5 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <span>{tmpl.name}</span>
                      {isAsahi && (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                          ⭐ BARU / JAPANESE ZEN
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tmpl.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Mode Terang
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.light.background }} title="Background" />
                      <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.light.textPrimary }} title="Text" />
                      <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.light.accent }} title="Accent" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Mode Gelap
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.dark.background }} title="Background" />
                      <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.dark.textPrimary }} title="Text" />
                      <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.dark.accent }} title="Accent" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onApplyTheme(tmpl.webTextsPatch, tmpl.themeAccent);
                    showFeedback(`Template Tema "${tmpl.name}" berhasil diterapkan!`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                >
                  <Paintbrush className="w-4 h-4" />
                  <span>Gunakan Tema Warna Ini</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

