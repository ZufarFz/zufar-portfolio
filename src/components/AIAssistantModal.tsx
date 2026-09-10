import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Check,
  Copy,
  RotateCcw,
  SlidersHorizontal,
  AlertCircle,
  Key,
  ArrowRight,
  Zap,
  Briefcase,
  HelpCircle
} from 'lucide-react';

export interface AIRecommendation {
  title: string;
  text: string;
  description?: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldLabel: string;
  currentValue: string;
  targetLang: 'id' | 'en';
  onApply: (enhancedText: string) => void;
  contextHint?: string;
}

type ToneOption = 'impact' | 'executive' | 'concise' | 'creative';

const TONES: { id: ToneOption; labelId: string; labelEn: string; icon: string; desc: string }[] = [
  {
    id: 'impact',
    labelId: 'Impact & Data',
    labelEn: 'Impact & Metrics',
    icon: '⚡',
    desc: 'Menonjolkan hasil kerja terukur, efisiensi, dan metrik data'
  },
  {
    id: 'executive',
    labelId: 'Eksekutif & Formal',
    labelEn: 'Executive & Formal',
    icon: '👔',
    desc: 'Bahasa profesional standar industri tingkat senior'
  },
  {
    id: 'concise',
    labelId: 'Singkat & Padat',
    labelEn: 'Concise & Direct',
    icon: '🎯',
    desc: 'To-the-point, hilangkan kata mubazir, mudah dipindai recruiter'
  },
  {
    id: 'creative',
    labelId: 'Naratif & Menarik',
    labelEn: 'Engaging Story',
    icon: '✨',
    desc: 'Alur penjelasan yang mengalir dan berkarakter'
  }
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  fieldLabel,
  currentValue,
  targetLang,
  onApply,
  contextHint
}) => {
  const [rawInput, setRawInput] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneOption>('impact');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedLang, setSelectedLang] = useState<'id' | 'en'>(targetLang || 'id');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [missingApiKey, setMissingApiKey] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editableTexts, setEditableTexts] = useState<Record<number, string>>({});

  // Reset or prefill when modal opens
  useEffect(() => {
    if (isOpen) {
      setRawInput(currentValue || '');
      setSelectedLang(targetLang || 'id');
      setErrorMsg(null);
      setMissingApiKey(false);
      setRecommendations([]);
      setEditableTexts({});
      setCopiedIndex(null);
    }
  }, [isOpen, currentValue, targetLang]);

  const handleGenerate = async () => {
    if (!rawInput.trim()) {
      setErrorMsg(
        selectedLang === 'id'
          ? 'Silakan masukkan kata-kata mentah atau draft terlebih dahulu.'
          : 'Please enter your draft or raw thoughts first.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setMissingApiKey(false);

    try {
      const response = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rawText: rawInput,
          currentText: currentValue,
          fieldLabel,
          tone: selectedTone,
          language: selectedLang,
          customInstruction: customPrompt,
          contextHint
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.missingKey) {
          setMissingApiKey(true);
          setErrorMsg(data.error || 'GEMINI_API_KEY belum dikonfigurasi di server.');
        } else {
          setErrorMsg(data.error || 'Gagal memproses rekomendasi AI. Coba lagi.');
        }
        return;
      }

      if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        const textMap: Record<number, string> = {};
        data.recommendations.forEach((item: AIRecommendation, i: number) => {
          textMap[i] = item.text;
        });
        setEditableTexts(textMap);
      } else {
        setErrorMsg('AI tidak mengembalikan format rekomendasi yang valid. Silakan coba lagi.');
      }
    } catch (err: any) {
      console.error('AI Enhance fetch error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan koneksi ke server AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (text: string) => {
    onApply(text);
    onClose();
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/40 text-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      AI Writing Assistant
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Gemini 3.8 Flash
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Meningkatkan isian: <strong className="text-purple-300 font-semibold">{fieldLabel}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Field Hint */}
              {contextHint && (
                <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200 flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{contextHint}</span>
                </div>
              )}

              {/* Raw Input Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span>Kata-Kata Mentah / Draft Anda</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      (Bisa berupa catatan acak, poin kasar, atau kalimat santai)
                    </span>
                  </label>

                  {currentValue && currentValue !== rawInput && (
                    <button
                      type="button"
                      onClick={() => setRawInput(currentValue)}
                      className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Gunakan Isi Kolom Saat Ini</span>
                    </button>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="Contoh: saya dulu bikin pipeline etl pakai python postgresql otomatis buat kirim laporan tiap jam 8 pagi, tim hemat 10 jam seminggu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-500 outline-none text-xs leading-relaxed transition-all resize-y"
                />
              </div>

              {/* Tone Selection & Target Language */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Pilih Gaya Bahasa / Tone:</span>
                  
                  {/* Language switch */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSelectedLang('id')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        selectedLang === 'id'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🇮🇩 Indonesia
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLang('en')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        selectedLang === 'en'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTone(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTone === t.id
                          ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/50 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1">
                        <span>{t.icon}</span>
                        <span>{selectedLang === 'id' ? t.labelId : t.labelEn}</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 line-clamp-2 leading-tight">
                        {t.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Extra Instruction */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">
                  Instruksi Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Misal: 'fokuskan ke skill Tableau', 'buat 2 kalimat saja', dsb."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-700/80 focus:border-purple-500 text-slate-200 placeholder-slate-500 outline-none text-xs"
                />
              </div>

              {/* Action Button: Generate */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 transition-all cursor-pointer select-none active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Gemini AI Sedang Meracik Rekomendasi...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                      <span>Dapatkan 3 Variasi Rekomendasi AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs">{errorMsg}</p>
                    {missingApiKey && (
                      <p className="text-[10.5px] text-rose-300/80 leading-relaxed">
                        Tambahkan environment variable <code className="px-1 py-0.5 bg-rose-900/50 rounded font-mono text-white">GEMINI_API_KEY</code> di pengaturan AI Studio atau file <code className="font-mono">.env</code>.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              {recommendations.length > 0 && (
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

                          {/* Editable recommendation textarea */}
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

                          {/* Action footer for this card */}
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleCopy(currentEditText, idx)}
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
                              onClick={() => handleApply(currentEditText)}
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
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span>⚡ Teks akan langsung dimasukkan ke kolom editor.</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
