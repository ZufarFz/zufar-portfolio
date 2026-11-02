import React from 'react';
import { Palette, Share2, FileText, Sliders } from 'lucide-react';
import { CVData } from '../../../types';
import { EditorMode, SocialCvSubTab } from '../types';

interface DrawerTabBarProps {
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  editLang: 'id' | 'en';
  setEditLang: (lang: 'id' | 'en') => void;
  socialCvSubTab: SocialCvSubTab;
  setSocialCvSubTab: (subTab: SocialCvSubTab) => void;
  activeBgSection: string;
  setActiveBgSection: (sec: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  detectedCategory: string;
  getBgSectionForCategory: (cat: string) => string;
  localData: CVData;
  isDark: boolean;
}

export const DrawerTabBar: React.FC<DrawerTabBarProps> = ({
  editorMode,
  setEditorMode,
  editLang,
  setEditLang,
  socialCvSubTab,
  setSocialCvSubTab,
  activeBgSection,
  setActiveBgSection,
  activeTab,
  setActiveTab,
  detectedCategory,
  getBgSectionForCategory,
  localData,
  isDark,
}) => {
  return (
    <div
      className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70'
      }`}
    >
      {/* 4-Way Mode Selector: ID | EN | Aset & Desain | Media Sosial */}
      <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-inner overflow-x-auto max-w-full">
        <button
          type="button"
          onClick={() => {
            setEditLang('id');
            setEditorMode('id');
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            editorMode === 'id'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Edit Tulisan & Konten Bahasa Indonesia"
        >
          <span>🇮🇩</span>
          <span className="hidden sm:inline">Bahasa</span> ID
        </button>
        <button
          type="button"
          onClick={() => {
            setEditLang('en');
            setEditorMode('en');
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            editorMode === 'en'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Edit Texts & Content in English"
        >
          <span>🇬🇧</span>
          <span className="hidden sm:inline">English</span> EN
        </button>
        <button
          type="button"
          onClick={() => setEditorMode('assets')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            editorMode === 'assets'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
          }`}
          title="Atur Gambar, Background SVG, Warna & Visual Aset"
        >
          <Palette className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Aset &amp; Desain</span>
        </button>
        <button
          type="button"
          onClick={() => setEditorMode('social')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            editorMode === 'social'
              ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-sky-400/50'
              : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300'
          }`}
          title="Atur Medsos, Kontak Utama, dan Pengaturan CV (Core Methodology)"
        >
          <Share2 className="w-3.5 h-3.5 text-sky-300" />
          <span>Medsos &amp; CV</span>
        </button>
      </div>

      {/* Context / Sub-Tab Selector based on active Mode */}
      {editorMode === 'social' ? (
        <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-inner">
          <button
            type="button"
            onClick={() => setSocialCvSubTab('socials')}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              socialCvSubTab === 'socials'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Kelola Akun Media Sosial & Kontak"
          >
            <Share2 className="w-3 h-3" />
            <span>Medsos</span>
          </button>
          <button
            type="button"
            onClick={() => setSocialCvSubTab('methodology_cv')}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              socialCvSubTab === 'methodology_cv'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Pengaturan Tulisan Core Methodology & AI Transfer Bahasa"
          >
            <FileText className="w-3 h-3" />
            <span>Methodology</span>
          </button>
          <button
            type="button"
            onClick={() => setSocialCvSubTab('cv_layout')}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              socialCvSubTab === 'cv_layout'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Pengaturan Tata Letak Kolom Skill, Header, & Foto Profil CV"
          >
            <Sliders className="w-3 h-3" />
            <span>Layout CV</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold">
            {editorMode === 'assets' ? 'Aset Halaman:' : 'Bagian:'}
          </span>
          <select
            value={editorMode === 'assets' ? activeBgSection : activeTab}
            onChange={(e) => {
              if (editorMode === 'assets') {
                setActiveBgSection(e.target.value);
              } else {
                setActiveTab(e.target.value);
              }
            }}
            className={`text-[11px] font-bold rounded-md px-2 py-1 border outline-none cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            {editorMode === 'assets' ? (
              <>
                <option value={getBgSectionForCategory(detectedCategory)}>
                  ✨ Otomatis ({detectedCategory.replace('subpage_', 'Page ').replace('_', ' ').toUpperCase()})
                </option>
                <optgroup label="── Aset Halaman Sub-Pages ──">
                  <option value="about_subpage_education">🎓 Pendidikan (Education)</option>
                  <option value="about_subpage_personality">💎 Kepribadian (Personality)</option>
                  <option value="about_subpage_hobbies">🎨 Hobi &amp; Minat (Hobbies)</option>
                  <option value="about_subpage_career_goals">🚀 Target Karir (Career Goals)</option>
                  <option value="experience">💼 Perjalanan Karir (Journey)</option>
                  <option value="projects">📂 Projek &amp; Studi Kasus</option>
                </optgroup>
                <optgroup label="── Aset Bagian Web Utama ──">
                  <option value="home">🏠 Hero / Home / Beranda</option>
                  <option value="about_story">📖 Kisah Saya (About Story)</option>
                  <option value="skills">⚡ Skills &amp; Arsenal</option>
                  <option value="contact">✉️ Kontak &amp; Footer</option>
                </optgroup>
              </>
            ) : (
              <>
                <option value="auto">✨ Otomatis ({detectedCategory})</option>
                <optgroup label="── Halaman Sub-Pages (Pages) ──">
                  <option value="subpage_education">🎓 Halaman: Pendidikan (Education)</option>
                  <option value="subpage_personality">💎 Halaman: Kepribadian (Personality)</option>
                  <option value="subpage_hobbies">🎨 Halaman: Hobi &amp; Minat (Hobbies)</option>
                  <option value="subpage_career_goals">🚀 Halaman: Target Karir (Career Goals)</option>
                  <option value="subpage_career_journey">💼 Halaman: Perjalanan Karir (Journey)</option>
                  <option value="subpage_projects">📂 Halaman: Projek &amp; Studi Kasus</option>
                  {(localData.customSubPages || []).map((page) => (
                    <option key={page.id} value={`subpage_${page.id}`}>
                      ✨ Halaman: {(editLang === 'id' ? page.title : page.titleEn) || page.title || page.id}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="── Bagian Web Utama ──">
                  <option value="hero">🏠 Section: Hero / Home</option>
                  <option value="about_story">📖 Section: Story / About Me</option>
                  <option value="skills">⚡ Section: Technical Arsenal</option>
                  <option value="projects">📂 Section: Case Studies</option>
                  <option value="experiences">💼 Section: Experiences</option>
                  <option value="contact">✉️ Section: Contact</option>
                  <option value="general_identity">👤 Profil / Identitas</option>
                </optgroup>
              </>
            )}
          </select>
        </div>
      )}
    </div>
  );
};

