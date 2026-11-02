import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Languages, 
  Globe, 
  ArrowRightLeft, 
  Eye, 
  Sliders, 
  RotateCcw, 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { CVData } from '../../../../types';
import { ID_TRANSLATIONS } from '../../../../data/portfolioData';
import MarkdownText from '../../../MarkdownText';

interface CvMethodologyPanelProps {
  localData: CVData;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  editLang: 'id' | 'en';
  setEditLang: (lang: 'id' | 'en') => void;
  cardBg: string;
  inputClass: string;
  renderAiButton: (
    fieldLabel: string,
    currentValue: string,
    onApply: (text: string) => void,
    contextHint?: string
  ) => React.ReactNode;
  setMethodologyTranslateModalOpen: (val: boolean) => void;
}

export const CvMethodologyPanel: React.FC<CvMethodologyPanelProps> = ({
  localData,
  handleUpdate,
  editLang,
  setEditLang,
  cardBg,
  inputClass,
  renderAiButton,
  setMethodologyTranslateModalOpen,
}) => {
  const currentMethodologyTitle = editLang === 'id'
    ? (localData.webTexts?.[`methodologyTitle_id`] || (localData.webTexts?.methodologyTitle && editLang === 'id' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || (ID_TRANSLATIONS as any).methodologyTitle || 'Metodologi Utama')
    : (localData.webTexts?.[`methodologyTitle_en`] || (localData.webTexts?.methodologyTitle && editLang === 'en' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || 'Core Methodology');

  const currentMethodologyText = editLang === 'id'
    ? (localData.webTexts?.[`methodologyText_id`] || (localData.webTexts?.methodologyText && editLang === 'id' ? localData.webTexts.methodologyText : '') || localData.methodologyText || (ID_TRANSLATIONS as any).methodologyText || '')
    : (localData.webTexts?.[`methodologyText_en`] || (localData.webTexts?.methodologyText && editLang === 'en' ? localData.webTexts.methodologyText : '') || localData.methodologyText || '');

  const currentOrder = (localData.layoutSettings?.sectionOrder && localData.layoutSettings.sectionOrder.length > 0)
    ? localData.layoutSettings.sectionOrder
    : ['arsenal', 'education', 'experience', 'methodology'];

  const sectionLabels: Record<string, { name: string; icon: any; color: string }> = {
    arsenal: { name: 'Technical Arsenal (Keahlian Teknis)', icon: Cpu, color: 'text-sky-400' },
    education: { name: 'Pendidikan & Riwayat Akademis', icon: GraduationCap, color: 'text-amber-400' },
    experience: { name: 'Pengalaman Kerja & Karir', icon: Briefcase, color: 'text-indigo-400' },
    methodology: { name: 'Core Methodology (Filosofi Kerja)', icon: Sparkles, color: 'text-emerald-400' },
  };

  return (
    <div className="space-y-6">
      {/* 2.1 Header Banner */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3 relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pengaturan CV &amp; Core Methodology</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Atur judul &amp; deskripsi filosofi analitis (&ldquo;Core Methodology&rdquo;) yang tampil di CV interaktif &amp; cetak.
              </p>
            </div>
          </div>

          {/* Language Switch */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setEditLang('id')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                editLang === 'id'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇮🇩</span> ID
            </button>
            <button
              type="button"
              onClick={() => setEditLang('en')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                editLang === 'en'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇬🇧</span> EN
            </button>
          </div>
        </div>
      </div>

      {/* 2.2 CARD 1: PENGATURAN TULISAN "CORE METHODOLOGY" */}
      <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                Tulisan &amp; Filosofi &ldquo;Core Methodology&rdquo;
              </h5>
              <span className="text-[10px] text-slate-400 block">
                Bahasa Aktif: <strong className="text-emerald-300">{editLang === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English'}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMethodologyTranslateModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-400/40"
            title="Transfer Bahasa Otomatis (ID <-> EN) menggunakan AI Gemini"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Transfer Bahasa (AI)</span>
          </button>
        </div>

        {/* Quick AI Translate Helper Bar */}
        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Dukungan Dual-Bahasa: Tulis dalam satu bahasa, lalu gunakan <strong>Transfer Bahasa (AI)</strong> untuk menerjemahkan ke versi counterpart secara otomatis.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMethodologyTranslateModalOpen(true)}
            className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/30 cursor-pointer flex items-center gap-1 shrink-0 transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-3 h-3 text-emerald-300" />
            <span>AI Transfer ({editLang === 'id' ? 'ID ➜ EN' : 'EN ➜ ID'})</span>
          </button>
        </div>

        {/* Judul Core Methodology */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10.5px] font-bold text-slate-300">
                1. Judul Seksi Metodologi ({editLang.toUpperCase()}):
              </label>
              {renderAiButton(
                `Judul Core Methodology (${editLang.toUpperCase()})`,
                currentMethodologyTitle,
                (val) => {
                  handleUpdate(prev => {
                    const nextTexts = { ...(prev.webTexts || {}) };
                    nextTexts[`methodologyTitle_${editLang}`] = val;
                    nextTexts.methodologyTitle = val;
                    return {
                      ...prev,
                      methodologyTitle: val,
                      webTexts: nextTexts
                    };
                  });
                },
                "Judul seksi metodologi kerja analitis pada dokumen resume CV"
              )}
            </div>
            <input
              type="text"
              value={currentMethodologyTitle}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate(prev => {
                  const nextTexts = { ...(prev.webTexts || {}) };
                  nextTexts[`methodologyTitle_${editLang}`] = val;
                  nextTexts.methodologyTitle = val;
                  return {
                    ...prev,
                    methodologyTitle: val,
                    webTexts: nextTexts
                  };
                });
              }}
              placeholder={editLang === 'id' ? 'mis. Metodologi Utama / Filosofi Kerja' : 'e.g. Core Methodology'}
              className={inputClass}
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Tampil sebagai judul seksi beraksen bintang di dokumen Resume/CV interaktif dan ekspor Word.
            </p>
          </div>

          {/* Textarea Deskripsi Metodologi */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10.5px] font-bold text-slate-300">
                2. Deskripsi &amp; Filosofi Analitis ({editLang.toUpperCase()}):
              </label>
              {renderAiButton(
                `Deskripsi Core Methodology (${editLang.toUpperCase()})`,
                currentMethodologyText,
                (val) => {
                  handleUpdate(prev => {
                    const nextTexts = { ...(prev.webTexts || {}) };
                    nextTexts[`methodologyText_${editLang}`] = val;
                    nextTexts.methodologyText = val;
                    return {
                      ...prev,
                      methodologyText: val,
                      webTexts: nextTexts
                    };
                  });
                },
                "Deskripsi filosofi analitis data pipeline, transparansi metrik, dan validasi statistik untuk resume CV"
              )}
            </div>
            <textarea
              rows={5}
              value={currentMethodologyText}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate(prev => {
                  const nextTexts = { ...(prev.webTexts || {}) };
                  nextTexts[`methodologyText_${editLang}`] = val;
                  nextTexts.methodologyText = val;
                  return {
                    ...prev,
                    methodologyText: val,
                    webTexts: nextTexts
                  };
                });
              }}
              placeholder={
                editLang === 'id'
                  ? 'Tuliskan pendekatan, prinsip analitis, dan metodologi kerja Anda...'
                  : 'Write your analytical philosophy, data pipeline principles, and methodology...'
              }
              className={`${inputClass} font-sans leading-relaxed resize-y`}
            />
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
              <span>Mendukung format Markdown: <code>**tebal**</code>, <code>*miring*</code>, <code>_garis bawah_</code></span>
              <span>{(currentMethodologyText || '').length} Karakter</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.3 CARD 2: LIVE PRATINJAU KOTAK "CORE METHODOLOGY" DI RESUME */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Tampilan &ldquo;Core Methodology&rdquo; di Resume CV</span>
          </h5>
          <span className="text-[10px] text-slate-500">Live Preview</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 shadow-md">
          <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <h6 className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
              {currentMethodologyTitle}
            </h6>
          </div>
          <div className="text-[11px] leading-relaxed text-slate-300 italic">
            {currentMethodologyText ? (
              <MarkdownText content={currentMethodologyText} theme="dark" />
            ) : (
              <span className="text-slate-500 italic">(Belum ada deskripsi metodologi)</span>
            )}
          </div>
        </div>
      </div>

      {/* 2.4 CARD 3: PENATAAN SEKSI RESUME CV (SECTION ORDER) */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Urutan &amp; Penataan Seksi Dokumen CV</span>
          </h5>
          <button
            type="button"
            onClick={() => {
              handleUpdate(prev => ({
                ...prev,
                layoutSettings: {
                  fontSize: 'standard',
                  spacing: 'standard',
                  layoutStyle: 'left-sidebar',
                  fontFamily: 'sans',
                  themeColor: 'blue',
                  ...(prev.layoutSettings || {}),
                  sectionOrder: ['arsenal', 'education', 'experience', 'methodology']
                }
              }));
            }}
            className="text-[10.5px] font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
            title="Kembalikan ke Urutan Standar"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Urutan</span>
          </button>
        </div>

        <div className="space-y-2">
          {currentOrder.map((secId, index) => {
            const secInfo = sectionLabels[secId] || { name: secId, icon: FileText, color: 'text-slate-400' };
            const SecIcon = secInfo.icon;
            const isFirst = index === 0;
            const isLast = index === currentOrder.length - 1;

            return (
              <div
                key={secId}
                className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                  secId === 'methodology'
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <SecIcon className={`w-4 h-4 ${secInfo.color} shrink-0`} />
                  <span className={`text-xs font-semibold truncate ${secId === 'methodology' ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                    {secInfo.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => {
                      if (isFirst) return;
                      const newOrder = [...currentOrder];
                      const temp = newOrder[index];
                      newOrder[index] = newOrder[index - 1];
                      newOrder[index - 1] = temp;
                      handleUpdate(prev => ({
                        ...prev,
                        layoutSettings: {
                          fontSize: 'standard',
                          spacing: 'standard',
                          layoutStyle: 'left-sidebar',
                          fontFamily: 'sans',
                          themeColor: 'blue',
                          ...(prev.layoutSettings || {}),
                          sectionOrder: newOrder
                        }
                      }));
                    }}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Pindah ke Atas"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => {
                      if (isLast) return;
                      const newOrder = [...currentOrder];
                      const temp = newOrder[index];
                      newOrder[index] = newOrder[index + 1];
                      newOrder[index + 1] = temp;
                      handleUpdate(prev => ({
                        ...prev,
                        layoutSettings: {
                          fontSize: 'standard',
                          spacing: 'standard',
                          layoutStyle: 'left-sidebar',
                          fontFamily: 'sans',
                          themeColor: 'blue',
                          ...(prev.layoutSettings || {}),
                          sectionOrder: newOrder
                        }
                      }));
                    }}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Pindah ke Bawah"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
