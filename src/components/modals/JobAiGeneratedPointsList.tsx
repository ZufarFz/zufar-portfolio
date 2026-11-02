import React from 'react';
import { CheckCircle2, Check } from 'lucide-react';
import { JobGeneratedPoint } from './jobExperienceAiTypes';

interface JobAiGeneratedPointsListProps {
  generatedPoints: JobGeneratedPoint[];
  setGeneratedPoints: React.Dispatch<React.SetStateAction<JobGeneratedPoint[]>>;
  selectedCount: number;
  isDark: boolean;
  existingBullets: string[];
  applyMode: 'replace' | 'append';
  setApplyMode: (mode: 'replace' | 'append') => void;
  togglePointSelection: (id: string) => void;
  selectOptionForPoint: (pointId: string, optIdx: number) => void;
  updatePointText: (pointId: string, newText: string) => void;
}

export const JobAiGeneratedPointsList: React.FC<JobAiGeneratedPointsListProps> = ({
  generatedPoints,
  setGeneratedPoints,
  selectedCount,
  isDark,
  existingBullets,
  applyMode,
  setApplyMode,
  togglePointSelection,
  selectOptionForPoint,
  updatePointText
}) => {
  if (generatedPoints.length === 0) return null;

  return (
    <div className="pt-3 border-t border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hasil Rekomendasi Poin ({generatedPoints.length} Poin Ditemukan)</span>
          </h4>
          <p className="text-[10.5px] text-slate-400">
            Centang poin yang ingin dimasukkan, dan pilih variasi gaya yang paling Anda sukai.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setGeneratedPoints((prev) =>
              prev.map((pt) => ({ ...pt, isSelected: selectedCount !== prev.length }))
            )
          }
          className="text-[10px] font-bold text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          {selectedCount === generatedPoints.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
        </button>
      </div>

      <div className="space-y-3">
        {generatedPoints.map((pt, pIdx) => (
          <div
            key={pt.id}
            className={`p-3.5 rounded-xl border transition-all ${
              pt.isSelected
                ? isDark
                  ? 'bg-slate-950/60 border-purple-500/40 ring-1 ring-purple-500/20'
                  : 'bg-purple-50/50 border-purple-300 ring-1 ring-purple-200'
                : isDark
                ? 'bg-slate-900/30 border-slate-800 opacity-60'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pt.isSelected}
                  onChange={() => togglePointSelection(pt.id)}
                  className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
                />
                <span className="font-bold text-xs text-purple-300">
                  Poin #{pIdx + 1}: <span className="text-slate-200">{pt.theme}</span>
                </span>
              </label>

              {pt.isSelected && (
                <span className="text-[9.5px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Dipilih</span>
                </span>
              )}
            </div>

            {pt.options.length > 1 && (
              <div className="mb-2 flex flex-wrap gap-1 bg-slate-900/80 dark:bg-slate-950/80 p-1 rounded-lg border border-slate-800">
                {pt.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => selectOptionForPoint(pt.id, optIdx)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      pt.selectedOptionIndex === optIdx
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {opt.label || `Variasi ${optIdx + 1}`}
                  </button>
                ))}
              </div>
            )}

            <textarea
              rows={2}
              value={pt.customText || ''}
              onChange={(e) => updatePointText(pt.id, e.target.value)}
              className={`w-full p-2.5 rounded-lg border text-[11px] leading-relaxed outline-none focus:ring-1 focus:ring-purple-500 transition-all ${
                isDark
                  ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-800'
              }`}
              placeholder="Isi teks poin pencapaian..."
            />
          </div>
        ))}
      </div>

      <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-[11px] ${
        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <span className="font-bold text-slate-300">Metode Penerapan:</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="applyMode"
              value="replace"
              checked={applyMode === 'replace'}
              onChange={() => setApplyMode('replace')}
              className="text-purple-600 focus:ring-0"
            />
            <span>Ganti poin lama ({existingBullets.length})</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="applyMode"
              value="append"
              checked={applyMode === 'append'}
              onChange={() => setApplyMode('append')}
              className="text-purple-600 focus:ring-0"
            />
            <span>Tambahkan ke daftar</span>
          </label>
        </div>
      </div>
    </div>
  );
};

