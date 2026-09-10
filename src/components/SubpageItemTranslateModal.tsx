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
  Heart,
  Cpu,
  Bookmark,
  Layers,
  GraduationCap,
  FileText
} from 'lucide-react';
import { MarkdownText } from './MarkdownText';

export interface TranslatedSubpageItemData {
  title: string;
  description: string;
}

export interface SubpageItemTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseId: string;
  sourceLang: 'id' | 'en';
  itemType: 'personality' | 'hobby' | 'career_goal' | 'education' | 'story_slide' | 'methodology' | 'generic';
  sourceData: {
    title: string;
    description: string;
  };
  labels?: {
    itemTypeName?: string;
    titleLabel?: string;
    descriptionLabel?: string;
  };
  isDark?: boolean;
  onApply: (translatedData: TranslatedSubpageItemData, targetLang: 'id' | 'en') => void;
}

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

  // Derive item type icons and default labels
  const itemTypeConfig = {
    personality: {
      name: labels?.itemTypeName || 'Pilar Kepribadian',
      titleLabel: labels?.titleLabel || 'Nama Karakter / Prinsip',
      descLabel: labels?.descriptionLabel || 'Deskripsi / Refleksi Kerja',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-600 to-teal-500',
      shadowColor: 'shadow-emerald-950/30'
    },
    hobby: {
      name: labels?.itemTypeName || 'Hobi & Minat',
      titleLabel: labels?.titleLabel || 'Nama Hobi / Aktivitas',
      descLabel: labels?.descriptionLabel || 'Deskripsi Inspirasi & Minat',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      gradient: 'from-rose-600 to-pink-500',
      shadowColor: 'shadow-rose-950/30'
    },
    story_slide: {
      name: labels?.itemTypeName || 'Slide Cerita Sub-Halaman',
      titleLabel: labels?.titleLabel || 'Judul Lembar Cerita',
      descLabel: labels?.descriptionLabel || 'Konten Narasi & Analisis',
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      gradient: 'from-teal-600 to-emerald-500',
      shadowColor: 'shadow-teal-950/30'
    },
    career_goal: {
      name: labels?.itemTypeName || 'Target Karir',
      titleLabel: labels?.titleLabel || 'Judul Sasaran',
      descLabel: labels?.descriptionLabel || 'Rincian Target & Milestone',
      icon: <Bookmark className="w-5 h-5 text-amber-400" />,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      gradient: 'from-amber-600 to-orange-500',
      shadowColor: 'shadow-amber-950/30'
    },
    education: {
      name: labels?.itemTypeName || 'Riwayat Pendidikan',
      titleLabel: labels?.titleLabel || 'Gelar / Jurusan',
      descLabel: labels?.descriptionLabel || 'Fokus Keilmuan & Prestasi',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      gradient: 'from-indigo-600 to-blue-500',
      shadowColor: 'shadow-indigo-950/30'
    },
    methodology: {
      name: labels?.itemTypeName || 'Core Methodology (Filosofi Kerja CV)',
      titleLabel: labels?.titleLabel || 'Judul Metodologi',
      descLabel: labels?.descriptionLabel || 'Deskripsi Filosofi & Metodologi Kerja',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-600 to-teal-500',
      shadowColor: 'shadow-emerald-950/30'
    },
    generic: {
      name: labels?.itemTypeName || 'Konten Halaman',
      titleLabel: labels?.titleLabel || 'Judul',
      descLabel: labels?.descriptionLabel || 'Deskripsi',
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      gradient: 'from-purple-600 to-indigo-500',
      shadowColor: 'shadow-purple-950/30'
    }
  };

  const currentConfig = itemTypeConfig[itemType] || itemTypeConfig.generic;

  // Auto trigger translation when modal opens
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
          {/* MODAL HEADER */}
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

          {/* BANNER INFO KECERDASAN AI */}
          <div className="px-5 py-2 bg-emerald-950/20 border-b border-emerald-500/20 flex items-start gap-2.5 text-[11px] text-emerald-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Markdown & Struktur Terjaga:</strong> Seluruh format Markdown (seperti heading <code>## Judul</code>, <code>**tebal**</code>, poin <code>-</code>, baris baru) akan dipertahankan dengan adaptasi kosa kata profesional.
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
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-200">
                  AI sedang menganalisis & menerjemahkan {currentConfig.name} ke {targetLangName}...
                </p>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Menjaga format Markdown, struktur hierarki teks, dan nuansa profesional.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KOLOM KIRI: SUMBER ASLI */}
                <div
                  className={`p-4 rounded-xl border flex flex-col ${
                    isDark ? 'bg-slate-955/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
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
                    {/* Title */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        {currentConfig.titleLabel}
                      </label>
                      <div className="text-xs font-bold text-slate-200 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        {sourceData.title || <span className="text-slate-500 italic">(Belum diisi)</span>}
                      </div>
                    </div>

                    {/* Description */}
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

                {/* KOLOM KANAN: HASIL TERJEMAHAN AI (EDITABLE / PREVIEW) */}
                <div
                  className={`p-4 rounded-xl border flex flex-col ${
                    isDark
                      ? 'bg-slate-900/90 border-emerald-500/30'
                      : 'bg-emerald-50/40 border-emerald-200'
                  }`}
                >
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
                    {/* Title Output */}
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
                            ? 'bg-slate-950/80 border-emerald-500/40 focus:border-emerald-400 text-white'
                            : 'bg-white border-emerald-300 focus:border-emerald-500 text-slate-800'
                        }`}
                        placeholder="Judul hasil terjemahan..."
                      />
                    </div>

                    {/* Description Output */}
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
            )}

            {/* OPSI INSTRUKSI TAMBAHAN */}
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
                        placeholder="Contoh: gunakan istilah teknis formal, tekankan nilai kolaborasi dan integritas..."
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
