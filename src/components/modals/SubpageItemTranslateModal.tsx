import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Check,
  AlertCircle,
  Loader2,
  Languages,
  RotateCcw
} from 'lucide-react';
import {
  TranslatedSubpageItemData,
  SubpageItemTranslateModalProps,
  getItemTypeConfig
} from './subpageItemTranslateTypes';
import { SubpageTranslateComparison } from './SubpageTranslateComparison';

export const SubpageItemTranslateModal: React.FC<SubpageItemTranslateModalProps> = ({
  isOpen,
  onClose,
  baseId,
  sourceLang,
  itemType,
  sourceData,
  labels,
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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [translatedData, setTranslatedData] = useState<TranslatedSubpageItemData>({
    title: '',
    description: '',
  });

  const [customPromptNote, setCustomPromptNote] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  const currentConfig = getItemTypeConfig(itemType, labels);

  useEffect(() => {
    if (isOpen && baseId) {
      handleTranslate();
    } else {
      setError(null);
      setCustomPromptNote('');
      setShowNoteInput(false);
      setActiveTab('edit');
    }
  }, [isOpen, baseId, sourceLang]);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-translate-subpage-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLang,
          targetLang,
          itemType,
          title: sourceData.title,
          description: sourceData.description,
          note: customPromptNote,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menerjemahkan konten via AI.');
      }

      setTranslatedData({
        title: data.title || sourceData.title,
        description: data.description || sourceData.description,
      });
    } catch (err: any) {
      console.error('Error translating subpage item:', err);
      setError(err.message || 'Terjadi kesalahan saat menghubungi layanan AI.');
    } finally {
      setIsLoading(false);
    }
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
              ? `bg-slate-900 border-slate-700/80 text-slate-100 ${currentConfig.shadowColor}`
              : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/40'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40 bg-gradient-to-r from-slate-950/60 via-slate-900/40 to-transparent">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentConfig.gradient} flex items-center justify-center text-white shadow-md`}>
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    Transfer Bahasa {currentConfig.name} via AI
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentConfig.badgeColor}`}>
                    {sourceFlag} {sourceLang.toUpperCase()} ➔ {targetFlag} {targetLang.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Periksa hasil terjemahan kontekstual AI sebelum disuntikkan ke versi {targetLangName}.
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

          <div className="px-5 py-2 bg-emerald-950/20 border-b border-emerald-500/20 flex items-start gap-2.5 text-[11px] text-emerald-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Markdown & Struktur Terjaga:</strong> Seluruh format Markdown akan dipertahankan dengan adaptasi kosa kata profesional.
            </span>
          </div>

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
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-200">
                  AI sedang menganalisis & menerjemahkan {currentConfig.name} ke {targetLangName}...
                </p>
              </div>
            ) : (
              <SubpageTranslateComparison
                isDark={isDark}
                sourceFlag={sourceFlag}
                sourceLangName={sourceLangName}
                targetFlag={targetFlag}
                targetLangName={targetLangName}
                targetLang={targetLang}
                currentConfig={currentConfig}
                sourceData={sourceData}
                translatedData={translatedData}
                setTranslatedData={setTranslatedData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {!isLoading && (
              <div className="pt-2">
                {!showNoteInput ? (
                  <button
                    type="button"
                    onClick={() => setShowNoteInput(true)}
                    className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ingin memberikan instruksi atau nada bicara khusus ke AI sebelum menerjemahkan ulang?</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-955/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
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
                        placeholder="Contoh: gunakan istilah teknis formal, tekankan nilai kolaborasi..."
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleTranslate}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
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

          {/* Footer */}
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
                disabled={isLoading || !translatedData.title}
                className={`px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r ${currentConfig.gradient} text-white flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer`}
              >
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Terapkan ke Versi {targetLangName} ({targetLang.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubpageItemTranslateModal;

