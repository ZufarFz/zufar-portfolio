import React from 'react';
import { Zap, Check, Copy } from 'lucide-react';
import { AIRecommendation } from './aiAssistantTypes';

interface AiRecommendationListProps {
  recommendations: AIRecommendation[];
  editableTexts: Record<number, string>;
  setEditableTexts: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
  onApply: (text: string) => void;
}

export const AiRecommendationList: React.FC<AiRecommendationListProps> = ({
  recommendations,
  editableTexts,
  setEditableTexts,
  copiedIndex,
  onCopy,
  onApply
}) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="pt-3 border-t border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Pilih Rekomendasi Terbaik:</span>
        </h4>
        <span className="text-[10px] text-slate-400">
          Anda dapat menyunting teks langsung sebelum diterapkan
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => {
          const currentEditText = editableTexts[idx] ?? rec.text;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-2 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-xs text-white">
                    {rec.title}
                  </span>
                </div>

                {rec.description && (
                  <span className="text-[10px] text-slate-400 italic">
                    {rec.description}
                  </span>
                )}
              </div>

              <textarea
                rows={3}
                value={currentEditText}
                onChange={(e) =>
                  setEditableTexts((prev) => ({
                    ...prev,
                    [idx]: e.target.value
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 focus:border-purple-500 text-slate-200 outline-none text-xs leading-relaxed transition-all resize-y"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onCopy(currentEditText, idx)}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onApply(currentEditText)}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Gunakan Teks Ini</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

