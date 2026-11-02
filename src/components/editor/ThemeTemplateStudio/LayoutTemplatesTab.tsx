import React from 'react';
import { LayoutGrid, Check } from 'lucide-react';
import { CVData } from '../../../types';
import { HERO_LAYOUT_TEMPLATES, PROJECTS_LAYOUT_TEMPLATES, LayoutTemplate } from '../../../data/layoutTemplates';

interface LayoutTemplatesTabProps {
  cvData: CVData;
  cardBg: string;
  onApplyLayout: (layout: LayoutTemplate) => void;
  showFeedback: (msg: string) => void;
}

export const LayoutTemplatesTab: React.FC<LayoutTemplatesTabProps> = ({
  cvData,
  cardBg,
  onApplyLayout,
  showFeedback
}) => {
  return (
    <div className="space-y-6">
      {/* Section 1: Projects Layout Templates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span>Blueprint Layout Seksi Projects / Case Studies:</span>
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">
            {PROJECTS_LAYOUT_TEMPLATES.length} Blueprint Layout
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PROJECTS_LAYOUT_TEMPLATES.map((layout) => {
            const isCurrentActive =
              cvData.webTexts?.projects_layout_type === layout.webTextsConfig?.projects_layout_type ||
              (layout.id === 'projects-classic-card' &&
                (!cvData.webTexts?.projects_layout_type || cvData.webTexts?.projects_layout_type === 'card_full'));
            return (
              <div
                key={layout.id}
                className={`p-5 rounded-2xl border transition-all space-y-3.5 ${cardBg} ${
                  isCurrentActive ? 'border-emerald-500/80 ring-1 ring-emerald-500/30' : 'hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                      {layout.previewIcon || '🖼️'}
                    </span>
                    <div>
                      <h5 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>{layout.name}</span>
                        {isCurrentActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                            Aktif
                          </span>
                        )}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{layout.description}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onApplyLayout(layout);
                    showFeedback(`Template Layout "${layout.name}" diterapkan ke Seksi Projects!`);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 ${
                    isCurrentActive
                      ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCurrentActive ? 'Terpasang di Projects' : 'Gunakan Layout Ini'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Hero Layout Templates */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span>Blueprint Layout Halaman Profil / Hero:</span>
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">
            {HERO_LAYOUT_TEMPLATES.length} Blueprint Layanan
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {HERO_LAYOUT_TEMPLATES.map((layout) => (
            <div
              key={layout.id}
              className={`p-5 rounded-2xl border transition-all space-y-3.5 ${cardBg} hover:border-blue-500/50`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                  {layout.previewIcon || '📐'}
                </span>
                <div>
                  <h5 className="font-extrabold text-sm text-white">{layout.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{layout.description}</p>
                </div>
              </div>

              {layout.floatingAssets.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                    Aset Melayang Terpasang ({layout.floatingAssets.length} Item):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {layout.floatingAssets.map((ast) => (
                      <span
                        key={ast.id}
                        className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono"
                      >
                        {ast.name} ({ast.layer === 'bg' ? 'Layer Belakang' : 'Layer Depan'})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  onApplyLayout(layout);
                  showFeedback(`Template Layout "${layout.name}" berhasil diterapkan ke profil!`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan Layout Ini</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

