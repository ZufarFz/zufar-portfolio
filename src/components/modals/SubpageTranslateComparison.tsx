import React from 'react';
import { Edit3 } from 'lucide-react';
import MarkdownText from '../common/MarkdownText';
import { TranslatedSubpageItemData } from './subpageItemTranslateTypes';

interface SubpageTranslateComparisonProps {
  isDark: boolean;
  sourceFlag: string;
  sourceLangName: string;
  targetFlag: string;
  targetLangName: string;
  targetLang: 'id' | 'en';
  currentConfig: any;
  sourceData: {
    title: string;
    description: string;
  };
  translatedData: TranslatedSubpageItemData;
  setTranslatedData: React.Dispatch<React.SetStateAction<TranslatedSubpageItemData>>;
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
}

export const SubpageTranslateComparison: React.FC<SubpageTranslateComparisonProps> = ({
  isDark,
  sourceFlag,
  sourceLangName,
  targetFlag,
  targetLangName,
  targetLang,
  currentConfig,
  sourceData,
  translatedData,
  setTranslatedData,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* KOLOM KIRI: SUMBER ASLI */}
      <div className={`p-4 rounded-xl border flex flex-col ${
        isDark ? 'bg-slate-955/70 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-700/30">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>{sourceFlag}</span>
            <span>Versi Asli ({sourceLangName})</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Sumber Aktif
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              {currentConfig.titleLabel}
            </label>
            <div className="text-xs font-bold text-slate-200 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              {sourceData.title || <span className="text-slate-500 italic">(Belum diisi)</span>}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
              {currentConfig.descLabel}
            </label>
            <div className="text-xs text-slate-300 p-3 rounded-lg bg-slate-900/80 border border-slate-800 leading-relaxed overflow-y-auto max-h-[320px] whitespace-pre-wrap font-sans">
              {sourceData.description ? (
                <MarkdownText content={sourceData.description} theme={isDark ? 'dark' : 'light'} />
              ) : (
                <span className="text-slate-500 italic">(Belum ada deskripsi)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KOLOM KANAN: HASIL TERJEMAHAN AI */}
      <div className={`p-4 rounded-xl border flex flex-col ${
        isDark
          ? 'bg-slate-900/90 border-emerald-500/30'
          : 'bg-emerald-50/40 border-emerald-200'
      }`}>
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-emerald-500/20">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span>{targetFlag}</span>
            <span>Hasil Terjemahan AI ({targetLangName})</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeTab === 'edit'
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-2.5 h-2.5 inline mr-1" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeTab === 'preview'
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="space-y-3 flex-1 flex flex-col">
          <div>
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              {currentConfig.titleLabel} ({targetLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={translatedData.title}
              onChange={(e) => setTranslatedData((prev) => ({ ...prev, title: e.target.value }))}
              className={`w-full text-xs font-bold px-2.5 py-2 rounded-lg border outline-none transition-colors ${
                isDark
                  ? 'bg-slate-955/80 border-emerald-500/40 focus:border-emerald-400 text-white'
                  : 'bg-white border-emerald-300 focus:border-emerald-500 text-slate-800'
              }`}
              placeholder="Judul hasil terjemahan..."
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between mb-1.5">
              <span>{currentConfig.descLabel} ({targetLang.toUpperCase()})</span>
              <span className="text-[9px] text-slate-400 lowercase font-normal">Mendukung syntax Markdown</span>
            </label>

            {activeTab === 'edit' ? (
              <textarea
                rows={10}
                value={translatedData.description}
                onChange={(e) => setTranslatedData((prev) => ({ ...prev, description: e.target.value }))}
                className={`w-full flex-1 text-xs leading-relaxed p-3 rounded-lg border outline-none font-mono transition-colors resize-y min-h-[220px] ${
                  isDark
                    ? 'bg-slate-955/80 border-emerald-500/40 focus:border-emerald-400 text-slate-200'
                    : 'bg-white border-emerald-300 focus:border-emerald-500 text-slate-800'
                }`}
                placeholder="Deskripsi hasil terjemahan..."
              />
            ) : (
              <div className={`p-3 rounded-lg border flex-1 min-h-[220px] max-h-[320px] overflow-y-auto text-xs leading-relaxed ${
                isDark ? 'bg-slate-955 border-emerald-500/30' : 'bg-white border-emerald-200'
              }`}>
                <MarkdownText content={translatedData.description || '*(Pratinjau kosong)*'} theme={isDark ? 'dark' : 'light'} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

