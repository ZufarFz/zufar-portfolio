import React from 'react';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface DrawerMarkdownGuideProps {
  showMarkdownGuide: boolean;
  setShowMarkdownGuide: (show: boolean) => void;
  editLang: 'id' | 'en';
  isDark: boolean;
}

export const DrawerMarkdownGuide: React.FC<DrawerMarkdownGuideProps> = ({
  showMarkdownGuide,
  setShowMarkdownGuide,
  editLang,
  isDark,
}) => {
  return (
    <div
      className={`mb-4 rounded-xl border transition-all ${
        isDark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
      }`}
    >
      <button
        type="button"
        onClick={() => setShowMarkdownGuide(!showMarkdownGuide)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-bold cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className={isDark ? 'text-indigo-300' : 'text-indigo-900'}>
            {editLang === 'id'
              ? '📝 Format Markdown Didukung (Bold, Link, Heading, List, dll)'
              : '📝 Supported Markdown Syntax (Bold, Links, Headings, Lists, etc.)'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <span>
            {showMarkdownGuide
              ? editLang === 'id'
                ? 'Tutup'
                : 'Hide'
              : editLang === 'id'
              ? 'Lihat Contoh'
              : 'Show Guide'}
          </span>
          {showMarkdownGuide ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {showMarkdownGuide && (
        <div
          className={`px-3.5 pb-3.5 pt-1 text-[11px] space-y-2 border-t ${
            isDark ? 'border-indigo-500/20 text-slate-300' : 'border-indigo-100 text-slate-700'
          }`}
        >
          <p className="text-[10px] text-slate-400 leading-tight">
            {editLang === 'id'
              ? 'Anda dapat menulis teks bergaya kaya pada deskripsi Home, Poin Pengalaman Kerja, Detail Proyek, dan CV menggunakan sintaks berikut:'
              : 'You can write rich styled text across Home descriptions, Experience bullets, Project details, and CV using these syntax markers:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10.5px]">
            <div
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-emerald-400 font-bold block mb-0.5">**Teks Tebal (Bold)**</span>
              <span className="text-slate-400">**Kata Kunci** → </span>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Kata Kunci</strong>
            </div>
            <div
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-teal-400 font-bold block mb-0.5">*Teks Miring (Italic)*</span>
              <span className="text-slate-400">*Catatan Penting* → </span>
              <em className={isDark ? 'text-white' : 'text-slate-900'}>Catatan Penting</em>
            </div>
            <div
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-blue-400 font-bold block mb-0.5">[Teks Link](https://...)</span>
              <span className="text-slate-400">[Lihat Demo](https://...) → </span>
              <span className="text-blue-500 underline font-sans">Lihat Demo ↗</span>
            </div>
            <div
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-amber-400 font-bold block mb-0.5">`Kode Singkat`</span>
              <span className="text-slate-400">`npm install` → </span>
              <code className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">
                npm install
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
