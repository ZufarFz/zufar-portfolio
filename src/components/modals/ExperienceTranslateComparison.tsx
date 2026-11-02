import React from 'react';
import { Briefcase, Building2, Calendar, ListChecks, Edit3, X } from 'lucide-react';
import { TranslatedExperienceData } from './experienceTranslateTypes';

interface ExperienceTranslateComparisonProps {
  isDark: boolean;
  sourceFlag: string;
  sourceLangName: string;
  targetFlag: string;
  targetLangName: string;
  targetLang: 'id' | 'en';
  sourceData: {
    role: string;
    company: string;
    period: string;
    bulletPoints: string[];
  };
  translatedData: TranslatedExperienceData;
  setTranslatedData: React.Dispatch<React.SetStateAction<TranslatedExperienceData>>;
  handleBulletChange: (index: number, value: string) => void;
}

export const ExperienceTranslateComparison: React.FC<ExperienceTranslateComparisonProps> = ({
  isDark,
  sourceFlag,
  sourceLangName,
  targetFlag,
  targetLangName,
  targetLang,
  sourceData,
  translatedData,
  setTranslatedData,
  handleBulletChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* KOLOM KIRI: SUMBER ASLI */}
      <div className={`p-4 rounded-xl border flex flex-col ${
        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-700/30">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>{sourceFlag}</span>
            <span>Versi Asli ({sourceLangName})</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Sumber Saat Ini
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Briefcase className="w-3 h-3 text-purple-400" /> Posisi / Job Role
            </label>
            <div className="text-xs font-bold text-slate-200 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              {sourceData.role || <span className="text-slate-500 italic">(Belum diisi)</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Building2 className="w-3 h-3 text-emerald-400" /> Perusahaan
              </label>
              <div className="text-xs text-slate-300 p-2 rounded-lg bg-slate-900/80 border border-slate-800 truncate">
                {sourceData.company || <span className="text-slate-500 italic">-</span>}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Periode
              </label>
              <div className="text-xs text-slate-300 p-2 rounded-lg bg-slate-900/80 border border-slate-800 truncate font-mono">
                {sourceData.period || <span className="text-slate-500 italic">-</span>}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <ListChecks className="w-3 h-3 text-blue-400" /> Poin-Poin Pencapaian ({sourceData.bulletPoints.length})
            </label>
            {sourceData.bulletPoints.length === 0 ? (
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-[11px] text-slate-500 italic">
                Tidak ada poin rincian pekerjaan.
              </div>
            ) : (
              <div className="space-y-2">
                {sourceData.bulletPoints.map((bp, idx) => (
                  <div
                    key={idx}
                    className="text-[11px] text-slate-300 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-purple-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KOLOM KANAN: HASIL TERJEMAHAN AI */}
      <div className={`p-4 rounded-xl border flex flex-col ${
        isDark ? 'bg-purple-950/20 border-purple-500/30' : 'bg-purple-50/50 border-purple-200'
      }`}>
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-purple-500/20">
          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <span>{targetFlag}</span>
            <span>Hasil Terjemahan AI ({targetLangName})</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Edit3 className="w-2.5 h-2.5" /> Dapat Diedit
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Briefcase className="w-3 h-3 text-purple-400" /> Posisi / Job Role ({targetLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={translatedData.role}
              onChange={(e) => setTranslatedData((prev) => ({ ...prev, role: e.target.value }))}
              className={`w-full text-xs font-bold px-2.5 py-2 rounded-lg border outline-none transition-colors ${
                isDark
                  ? 'bg-slate-900 border-purple-500/40 focus:border-purple-400 text-white'
                  : 'bg-white border-purple-300 focus:border-purple-500 text-slate-800'
              }`}
              placeholder="Job Role..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Building2 className="w-3 h-3 text-emerald-400" /> Perusahaan ({targetLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={translatedData.company}
                onChange={(e) => setTranslatedData((prev) => ({ ...prev, company: e.target.value }))}
                className={`w-full text-xs px-2.5 py-2 rounded-lg border outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-purple-500/40 focus:border-purple-400 text-slate-200'
                    : 'bg-white border-purple-300 focus:border-purple-500 text-slate-800'
                }`}
                placeholder="Company..."
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Periode ({targetLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={translatedData.period}
                onChange={(e) => setTranslatedData((prev) => ({ ...prev, period: e.target.value }))}
                className={`w-full text-xs px-2.5 py-2 rounded-lg border outline-none font-mono transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-purple-500/40 focus:border-purple-400 text-slate-200'
                    : 'bg-white border-purple-300 focus:border-purple-500 text-slate-800'
                }`}
                placeholder="Period..."
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1">
                <ListChecks className="w-3 h-3 text-blue-400" /> Rincian Poin ({translatedData.bulletPoints.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  setTranslatedData((prev) => ({
                    ...prev,
                    bulletPoints: [...prev.bulletPoints, 'New achievement point...'],
                  }))
                }
                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
              >
                + Tambah Poin
              </button>
            </label>

            {translatedData.bulletPoints.length === 0 ? (
              <div className="p-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-[11px] text-slate-400 italic">
                Tidak ada poin rincian.
              </div>
            ) : (
              <div className="space-y-2">
                {translatedData.bulletPoints.map((bp, idx) => (
                  <div key={idx} className="relative group">
                    <textarea
                      rows={2}
                      value={bp}
                      onChange={(e) => handleBulletChange(idx, e.target.value)}
                      className={`w-full text-[11px] leading-relaxed p-2.5 rounded-lg border outline-none transition-colors ${
                        isDark
                          ? 'bg-slate-900 border-purple-500/40 focus:border-purple-400 text-slate-200'
                          : 'bg-white border-purple-300 focus:border-purple-500 text-slate-800'
                      }`}
                      placeholder={`Poin #${idx + 1}...`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setTranslatedData((prev) => ({
                          ...prev,
                          bulletPoints: prev.bulletPoints.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 rounded bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Hapus poin ini"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
