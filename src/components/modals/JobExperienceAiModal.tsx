import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Briefcase, Loader2, AlertCircle, Wand2, Check } from 'lucide-react';
import { JobExperienceAiModalProps, JobGeneratedPoint } from './jobExperienceAiTypes';
import { JobAiGeneratedPointsList } from './JobAiGeneratedPointsList';

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
          {/* Header */}
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

          {/* Body */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
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
                placeholder="Contoh: Saya membuat pipeline otomatis dengan Python dan Airflow untuk menarik data transaksi harian..."
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed outline-none focus:ring-1 focus:ring-purple-500 transition-all ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-700 text-slate-200 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400'
                }`}
              />

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

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Perhatian</p>
                  <p className="opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}

            <JobAiGeneratedPointsList
              generatedPoints={generatedPoints}
              setGeneratedPoints={setGeneratedPoints}
              selectedCount={selectedCount}
              isDark={isDark}
              existingBullets={existingBullets}
              applyMode={applyMode}
              setApplyMode={setApplyMode}
              togglePointSelection={togglePointSelection}
              selectOptionForPoint={selectOptionForPoint}
              updatePointText={updatePointText}
            />
          </div>

          {/* Footer */}
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

export default JobExperienceAiModal;

