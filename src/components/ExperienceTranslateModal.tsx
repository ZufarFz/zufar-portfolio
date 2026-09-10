import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRightLeft,
  X,
  Check,
  AlertCircle,
  Loader2,
  Languages,
  Edit3,
  RotateCcw,
  Briefcase,
  Building2,
  Calendar,
  ListChecks,
} from 'lucide-react';

interface TranslatedExperienceData {
  role: string;
  company: string;
  period: string;
  bulletPoints: string[];
}

interface ExperienceTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceBaseId: string;
  sourceLang: 'id' | 'en';
  sourceData: {
    role: string;
    company: string;
    period: string;
    bulletPoints: string[];
  };
  isDark?: boolean;
  onApply: (translatedData: TranslatedExperienceData, targetLang: 'id' | 'en') => void;
}

export const ExperienceTranslateModal: React.FC<ExperienceTranslateModalProps> = ({
  isOpen,
  onClose,
  experienceBaseId,
  sourceLang,
  sourceData,
  isDark = true,
  onApply,
}) => {
  const targetLang = sourceLang === 'id' ? 'en' : 'id';
  const sourceLangName = sourceLang === 'id' ? 'Bahasa Indonesia' : 'English';
  const targetLangName = targetLang === 'id' ? 'Bahasa Indonesia' : 'English';
  const sourceFlag = sourceLang === 'id' ? '🇮🇩' : '🇬🇧';
  const targetFlag = targetLang === 'id' ? '🇮🇩' : '🇬🇧';

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedData, setTranslatedData] = useState<TranslatedExperienceData>({
    role: '',
    company: '',
    period: '',
    bulletPoints: [],
  });

  const [customPromptNote, setCustomPromptNote] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  // Auto trigger translation when modal opens
  useEffect(() => {
    if (isOpen && experienceBaseId) {
      handleTranslate();
    } else {
      setError(null);
      setCustomPromptNote('');
      setShowNoteInput(false);
    }
  }, [isOpen, experienceBaseId, sourceLang]);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-translate-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLang,
          targetLang,
          role: sourceData.role,
          company: sourceData.company,
          period: sourceData.period,
          bulletPoints: sourceData.bulletPoints,
          note: customPromptNote,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menerjemahkan pengalaman kerja.');
      }

      setTranslatedData({
        role: data.role || sourceData.role,
        company: data.company || sourceData.company,
        period: data.period || sourceData.period,
        bulletPoints: Array.isArray(data.bulletPoints) ? data.bulletPoints : [],
      });
    } catch (err: any) {
      console.error('Error translating experience:', err);
      setError(err.message || 'Terjadi kesalahan saat menghubungi layanan AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulletChange = (index: number, value: string) => {
    setTranslatedData((prev) => {
      const updated = [...prev.bulletPoints];
      updated[index] = value;
      return { ...prev, bulletPoints: updated };
    });
  };

  const handleApply = () => {
    onApply(translatedData, targetLang);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) onClose();
        }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
            isDark
              ? 'bg-slate-900 border-slate-700/80 text-slate-100 shadow-purple-950/30'
              : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/40'
          }`}
        >
          {/* MODAL HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    Transfer Bahasa Pekerjaan via AI
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {sourceFlag} {sourceLang.toUpperCase()} ➔ {targetFlag} {targetLang.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Konfirmasi perbandingan data sebelum terjemahan diterapkan ke versi {targetLangName}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* BANNER INFO KECERDASAN AI */}
          <div className="px-5 py-2.5 bg-indigo-950/20 border-b border-indigo-500/20 flex items-start gap-2.5 text-[11px] text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Terjemahan Kontekstual Karir:</strong> AI menyelaraskan terminologi pendidikan & pekerjaan (seperti SMK menjadi <em>Vocational High School</em>, S1 menjadi <em>Bachelor's Degree</em>, periode kerja, dan kata kerja aktif standar CV internasional).
            </span>
          </div>

          {/* MODAL BODY (SIDE-BY-SIDE COMPARISON) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Gagal Menerjemahkan</p>
                  <p className="mt-0.5 text-rose-300/90">{error}</p>
                  <button
                    type="button"
                    onClick={handleTranslate}
                    className="mt-2 text-[11px] font-bold text-white px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Coba Lagi
                  </button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-200">
                  AI sedang menganalisis & menerjemahkan ke {targetLangName}...
                </p>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Menyesuaikan struktur kalimat resume profesional, terminologi institusi, dan poin-poin pencapaian.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KOLOM KIRI: SUMBER ASLI */}
                <div
                  className={`p-4 rounded-xl border flex flex-col ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
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
                    {/* Role */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Briefcase className="w-3 h-3 text-purple-400" /> Posisi / Job Role
                      </label>
                      <div className="text-xs font-bold text-slate-200 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        {sourceData.role || <span className="text-slate-500 italic">(Belum diisi)</span>}
                      </div>
                    </div>

                    {/* Company & Period */}
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

                    {/* Bullet Points */}
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

                {/* KOLOM KANAN: HASIL TERJEMAHAN AI (EDITABLE) */}
                <div
                  className={`p-4 rounded-xl border flex flex-col ${
                    isDark
                      ? 'bg-purple-950/20 border-purple-500/30'
                      : 'bg-purple-50/50 border-purple-200'
                  }`}
                >
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
                    {/* Role Output */}
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

                    {/* Company & Period Output */}
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
                          placeholder="Period (e.g. 2022 - PRESENT)..."
                        />
                      </div>
                    </div>

                    {/* Bullet Points Output */}
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
            )}

            {/* OPSI INTRUKSI TAMBAHAN */}
            {!isLoading && (
              <div className="pt-2">
                {!showNoteInput ? (
                  <button
                    type="button"
                    onClick={() => setShowNoteInput(true)}
                    className="text-[11px] text-slate-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ingin memberikan instruksi khusus ke AI sebelum menerjemahkan ulang?</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        Instruksi Khusus untuk AI:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNoteInput(false)}
                        className="text-[10px] text-slate-500 hover:text-slate-300"
                      >
                        Batal
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customPromptNote}
                        onChange={(e) => setCustomPromptNote(e.target.value)}
                        placeholder="Contoh: gunakan nada eksekutif senior, tekankan kata kerja kepemimpinan..."
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleTranslate}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Terjemahkan Ulang</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="px-5 py-3.5 border-t border-slate-700/40 bg-slate-950/40 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTranslate}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl font-bold text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate AI</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl font-bold text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={isLoading || !translatedData.role}
                className="px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Terapkan ke Versi {targetLangName} ({targetLang.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
