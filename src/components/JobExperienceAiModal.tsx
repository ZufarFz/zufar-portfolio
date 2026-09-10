import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Briefcase,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
  Wand2,
  Check,
  PlusCircle,
  RotateCcw
} from 'lucide-react';

export interface JobBulletOption {
  label: string;
  text: string;
}

export interface JobGeneratedPoint {
  id: string;
  theme: string;
  options: JobBulletOption[];
  selectedOptionIndex: number;
  isSelected: boolean;
  customText?: string;
}

interface JobExperienceAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  company: string;
  existingBullets: string[];
  onApply: (newBullets: string[]) => void;
  lang: 'id' | 'en';
  isDark?: boolean;
}

export function JobExperienceAiModal({
  isOpen,
  onClose,
  role,
  company,
  existingBullets,
  onApply,
  lang,
  isDark = true
}: JobExperienceAiModalProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [targetLang, setTargetLang] = useState<'id' | 'en'>(lang);
  const [tone, setTone] = useState<'impact' | 'executive' | 'technical' | 'concise'>('impact');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedPoints, setGeneratedPoints] = useState<JobGeneratedPoint[]>([]);
  const [applyMode, setApplyMode] = useState<'replace' | 'append'>('replace');

  // Quick prompt suggestions if input is blank
  const quickIdeas = [
    'Membuat pipeline ETL otomatis dengan Python & Airflow, optimasi query SQL, dan dashboard analitik tim.',
    'Menganalisis data transaksi pelanggan, A/B testing kampanye marketing, dan reporting mingguan ke manajemen.',
    'Mengembangkan fitur aplikasi web, memimpin integrasi REST API, dan code review anggota tim junior.'
  ];

  const handleGenerate = async () => {
    if (!explanation.trim()) {
      setErrorMessage(
        targetLang === 'id'
          ? 'Mohon tuliskan cerita singkat atau tugas pekerjaan Anda terlebih dahulu.'
          : 'Please describe your job tasks or responsibilities first.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai-job-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          company,
          explanation: explanation.trim(),
          language: targetLang,
          tone
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Gagal memproses rekomendasi AI.');
      }

      if (Array.isArray(data.points) && data.points.length > 0) {
        const formatted: JobGeneratedPoint[] = data.points.map((pt: any, idx: number) => ({
          id: pt.id || `point_${idx + 1}`,
          theme: pt.theme || `Poin #${idx + 1}`,
          options: Array.isArray(pt.options) && pt.options.length > 0
            ? pt.options
            : [{ label: 'Rekomendasi', text: pt.text || '' }],
          selectedOptionIndex: 0,
          isSelected: true,
          customText: pt.options?.[0]?.text || pt.text || ''
        }));
        setGeneratedPoints(formatted);
      } else {
        throw new Error('Tidak ada poin pencapaian yang dapat dirumuskan.');
      }
    } catch (err: any) {
      console.error('Job AI Error:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat menghubungi layanan AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePointSelection = (id: string) => {
    setGeneratedPoints((prev) =>
      prev.map((pt) => (pt.id === id ? { ...pt, isSelected: !pt.isSelected } : pt))
    );
  };

  const selectOptionForPoint = (pointId: string, optIdx: number) => {
    setGeneratedPoints((prev) =>
      prev.map((pt) => {
        if (pt.id !== pointId) return pt;
        const optText = pt.options[optIdx]?.text || '';
        return {
          ...pt,
          selectedOptionIndex: optIdx,
          customText: optText
        };
      })
    );
  };

  const updatePointText = (pointId: string, newText: string) => {
    setGeneratedPoints((prev) =>
      prev.map((pt) => (pt.id === pointId ? { ...pt, customText: newText } : pt))
    );
  };

  const handleApplySelected = () => {
    const selectedTexts = generatedPoints
      .filter((pt) => pt.isSelected)
      .map((pt) => pt.customText?.trim() || pt.options[pt.selectedOptionIndex]?.text?.trim())
      .filter(Boolean) as string[];

    if (selectedTexts.length === 0) {
      setErrorMessage(
        targetLang === 'id'
          ? 'Pilih minimal satu poin untuk diterapkan ke pekerjaan ini.'
          : 'Please select at least one point to apply.'
      );
      return;
    }

    if (applyMode === 'append') {
      onApply([...existingBullets, ...selectedTexts]);
    } else {
      onApply(selectedTexts);
    }

    onClose();
  };

  const selectedCount = generatedPoints.filter((pt) => pt.isSelected).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Top Header */}
          <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 truncate">
                  <span>AI Asisten Poin Pekerjaan</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                    Formula XYZ
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {role || 'Posisi'} {company ? `• ${company}` : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content - Scrollable */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Context Badge */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] leading-snug">
                <p className="font-bold text-slate-200">{role || 'Posisi Belum Diberi Nama'}</p>
                <p className="text-slate-400 text-[10.5px]">
                  Perusahaan: <span className="font-medium text-slate-300">{company || '-'}</span>
                </p>
              </div>
            </div>

            {/* Language & Tone Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Bahasa Output Poin
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTargetLang('id')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      targetLang === 'id'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>🇮🇩</span>
                    <span>Indonesia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetLang('en')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      targetLang === 'en'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Gaya Penulisan
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className={`w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-medium outline-none cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="impact">🎯 Dampak &amp; Metrik (Google XYZ Formula)</option>
                  <option value="technical">⚙️ Kedalaman Teknis &amp; Tools</option>
                  <option value="executive">💼 Executive &amp; Leadership</option>
                  <option value="concise">⚡ Ringkas, Padat, &amp; Tajam</option>
                </select>
              </div>
            </div>

            {/* Input Story / Explanation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-300">
                  Jelaskan Pekerjaan &amp; Tanggung Jawab Anda
                </label>
                <span className="text-[10px] text-slate-500">
                  Bahasa bebas (santai, poin mentah, dll)
                </span>
              </div>
              <textarea
                rows={4}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Contoh: Saya membuat pipeline otomatis dengan Python dan Airflow untuk menarik data transaksi harian. Mengoptimasi query SQL di PostgreSQL biar report jalan 50% lebih cepat. Bikin dashboard Metabase untuk tim Marketing dan melatih 2 orang junior analyst..."
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed outline-none focus:ring-1 focus:ring-purple-500 transition-all ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-700 text-slate-200 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400'
                }`}
              />

              {/* Quick Prompt Starters */}
              {!explanation && (
                <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-500">Ide cepat:</span>
                  {quickIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setExplanation(idea)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 truncate max-w-[280px] cursor-pointer transition-colors"
                      title={idea}
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit / Generate Button */}
            <div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI sedang merumuskan poin-poin pencapaian...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>
                      {generatedPoints.length > 0 ? 'Rumuskan Ulang dengan AI' : 'Rumuskan Poin Pencapaian dengan AI'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Perhatian</p>
                  <p className="opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* RESULTS: Generated Points Breakdown */}
            {generatedPoints.length > 0 && (
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

                  <div className="flex items-center gap-1.5">
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
                      {/* Top Bar of Point Card */}
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

                      {/* Variation Tabs for This Point */}
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

                      {/* Text Input / Editable Preview */}
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

                {/* Apply Options (Replace or Append) */}
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
            )}
          </div>

          {/* Footer Actions */}
          <div className={`px-5 py-3.5 border-t flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>

            {generatedPoints.length > 0 && (
              <button
                type="button"
                onClick={handleApplySelected}
                disabled={selectedCount === 0}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan {selectedCount} Poin ke Pekerjaan</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
