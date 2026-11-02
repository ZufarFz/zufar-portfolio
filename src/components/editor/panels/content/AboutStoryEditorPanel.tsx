import React from 'react';
import { BookOpen, Sparkles, Plus, ChevronRight, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ContentPanelBaseProps } from '../../types';

interface AboutStoryEditorPanelProps extends ContentPanelBaseProps {
  showMarkdownGuide: boolean;
  setShowMarkdownGuide: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddCustomSubPage: () => void;
  handleRemoveCustomSubPage: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const AboutStoryEditorPanel: React.FC<AboutStoryEditorPanelProps> = ({
  localData,
  editLang,
  getWebText,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  inputClass,
  textareaClass,
  cardBg,
  showMarkdownGuide,
  setShowMarkdownGuide,
  handleAddCustomSubPage,
  handleRemoveCustomSubPage,
  setActiveTab,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Story / About Me ({editLang.toUpperCase()})</span>
        </h4>
        <button
          type="button"
          onClick={() => setShowMarkdownGuide(!showMarkdownGuide)}
          className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>{showMarkdownGuide ? 'Tutup Format MD' : 'Panduan Format MD'}</span>
        </button>
      </div>

      {/* Markdown Syntax Guide Box */}
      {showMarkdownGuide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5 text-xs text-slate-300 shadow-inner"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
              <span>📝 Format Teks Markdown Aktif</span>
            </span>
            <span className="text-[10px] text-slate-400">Dukungan penuh di Pengantar &amp; 6 Pilar</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
            <div className="space-y-1">
              <p><strong className="text-white">Tebal (Bold):</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">**teks tebal**</code></p>
              <p><strong className="text-white">Miring (Italic):</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">*teks miring*</code></p>
              <p><strong className="text-white">Tautan / Link:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">[Teks](https://...)</code></p>
            </div>
            <div className="space-y-1">
              <p><strong className="text-white">Sub Judul:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">### Judul Bagian</code></p>
              <p><strong className="text-white">Poin List:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">- Poin pertama</code></p>
              <p><strong className="text-white">Kode / Tag:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">`highlight`</code></p>
            </div>
          </div>
          <p className="text-[9.5px] text-slate-400 italic pt-1 border-t border-slate-800/80">
            💡 Tautan yang Anda buat akan otomatis membuka tab baru dengan aman dan tidak akan bentrok dengan kartu navigasi.
          </p>
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Judul Halaman Kisah ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Judul Halaman Kisah',
            getWebText('about_story_title', editLang),
            (val) => handleWebTextChange('about_story_title', val, editLang),
            'Judul halaman narasi perjalanan pribadi dan profesional'
          )}
        </div>
        <input
          type="text"
          value={getWebText('about_story_title', editLang)}
          onChange={(e) => handleWebTextChange('about_story_title', e.target.value, editLang)}
          className={inputClass}
        />
        {renderColorControls('about_story_title_color', 'about_story_title_color_dark', 'Judul Kisah')}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Paragraf Pengantar Utama ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Pengantar Kisah Story',
            getWebText('about_story_intro', editLang),
            (val) => handleWebTextChange('about_story_intro', val, editLang),
            'Narasi storytelling tentang filosofi kerja, motivasi di dunia data/teknologi, dan prinsip integritas'
          )}
        </div>
        <textarea
          rows={4}
          value={getWebText('about_story_intro', editLang)}
          onChange={(e) => handleWebTextChange('about_story_intro', e.target.value, editLang)}
          className={textareaClass}
        />
        {renderColorControls('about_story_intro_color', 'about_story_intro_color_dark', 'Pengantar Kisah', '#475569', '#94a3b8')}
      </div>

      <div className="pt-2">
        <h5 className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
          6 Pilar Nilai (Kiri &amp; Kanan) ({editLang.toUpperCase()})
        </h5>
        <div className="space-y-3">
          {[
            { num: 1, label: editLang === 'id' ? 'Pilar Kiri #1: Pendidikan' : 'Left Pillar #1: Educational Background', sub: '#/educational' },
            { num: 2, label: editLang === 'id' ? 'Pilar Kiri #2: Kepribadian & Nilai' : 'Left Pillar #2: Personality & Values', sub: '#/personality' },
            { num: 3, label: editLang === 'id' ? 'Pilar Kiri #3: Hobi & Minat' : 'Left Pillar #3: Hobbies & Interests', sub: '#/hobbies' },
          ].map(({ num, label, sub }) => (
            <div key={num} className={`p-3 rounded-lg border ${cardBg} space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-emerald-500">{label}</div>
                <span className="text-[9px] text-slate-400 font-mono">{sub}</span>
              </div>
              <input
                type="text"
                value={getWebText(`about_story_left_${num}_title`, editLang)}
                onChange={(e) => handleWebTextChange(`about_story_left_${num}_title`, e.target.value, editLang)}
                placeholder={`Judul Pilar ${num}`}
                className={inputClass}
              />
              <textarea
                rows={2}
                value={getWebText(`about_story_left_${num}_desc`, editLang)}
                onChange={(e) => handleWebTextChange(`about_story_left_${num}_desc`, e.target.value, editLang)}
                placeholder={`Deskripsi Pilar ${num}`}
                className={textareaClass}
              />
            </div>
          ))}
          {[
            { num: 1, label: editLang === 'id' ? 'Pilar Kanan #1: Perjalanan Karir' : 'Right Pillar #1: Career Journey', sub: '#/career-journey' },
            { num: 2, label: editLang === 'id' ? 'Pilar Kanan #2: Keahlian & Arsenal' : 'Right Pillar #2: Skills & Technical Arsenal', sub: '#/skills' },
            { num: 3, label: editLang === 'id' ? 'Pilar Kanan #3: Studi Kasus & Proyek' : 'Right Pillar #3: Projects & Case Studies', sub: '#/projects' },
          ].map(({ num, label, sub }) => (
            <div key={num} className={`p-3 rounded-lg border ${cardBg} space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-indigo-400">{label}</div>
                <span className="text-[9px] text-slate-400 font-mono">{sub}</span>
              </div>
              <input
                type="text"
                value={getWebText(`about_story_right_${num}_title`, editLang)}
                onChange={(e) => handleWebTextChange(`about_story_right_${num}_title`, e.target.value, editLang)}
                placeholder={`Judul Pilar Kanan ${num}`}
                className={inputClass}
              />
              <textarea
                rows={2}
                value={getWebText(`about_story_right_${num}_desc`, editLang)}
                onChange={(e) => handleWebTextChange(`about_story_right_${num}_desc`, e.target.value, editLang)}
                placeholder={`Deskripsi Pilar Kanan ${num}`}
                className={textareaClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Pages & Extra Chapters Management */}
      <div className="pt-4 border-t border-slate-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Halaman Sub-Pages Tambahan (Custom)</span>
            </h5>
            <p className="text-[10px] text-slate-400">
              Buat sub-halaman baru dengan slide narasi khusus (contoh: Sertifikasi, Riset, Publikasi, Organisasi)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSubPage}
            className="px-2.5 py-1 rounded bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah Halaman</span>
          </button>
        </div>

        {(localData.customSubPages || []).length === 0 ? (
          <div className={`p-4 rounded-xl border ${cardBg} text-center text-xs text-slate-400 space-y-2`}>
            <p>Belum ada sub-halaman tambahan khusus.</p>
            <button
              type="button"
              onClick={handleAddCustomSubPage}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Sub-Halaman Pertama</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {(localData.customSubPages || []).map((page, idx) => (
              <div key={page.id} className={`p-3 rounded-xl border ${cardBg} flex items-center justify-between gap-3`}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 text-xs font-bold font-mono">
                    #{idx + 1}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {(editLang === 'id' ? page.title : page.titleEn) || page.title || page.id}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Slug ID: {page.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab(`subpage_${page.id}`)}
                    className="px-2.5 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Edit Halaman</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomSubPage(page.id)}
                    className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer transition-colors"
                    title="Hapus Halaman"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
