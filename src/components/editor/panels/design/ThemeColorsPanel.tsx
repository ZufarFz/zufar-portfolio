import React from 'react';
import { CVData } from '../../../../types';
import { Paintbrush, Sparkles, Check, Layers, Sun, Moon, Layout } from 'lucide-react';

interface ThemeColorsPanelProps {
  localData: CVData;
  activeBgSection: string;
  setActiveBgSection: (sec: string) => void;
  handleUpdate: React.Dispatch<React.SetStateAction<CVData>>;
  handleWebTextChange: (key: string, val: string, lang?: 'id' | 'en') => void;
  appliedAllNotice: boolean;
  setAppliedAllNotice: (notice: boolean) => void;
  editLang: 'id' | 'en';
  isDark: boolean;
  cardBg: string;
  inputClass: string;
}

export const ThemeColorsPanel: React.FC<ThemeColorsPanelProps> = ({
  localData,
  activeBgSection,
  setActiveBgSection,
  handleUpdate,
  handleWebTextChange,
  appliedAllNotice,
  setAppliedAllNotice,
  editLang,
  isDark,
  cardBg,
  inputClass,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Palet Warna Background &amp; Tema Web</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Atur warna background per halaman/bagian, tema aksen, dan navbar
          </p>
        </div>
      </div>

      {/* Section indicator */}
      <div className="px-3.5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-purple-300">
            Halaman Aktif:
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono font-bold text-[11px]">
            {activeBgSection === 'home'
              ? '🏠 Beranda / Home'
              : activeBgSection === 'projects'
              ? '📂 Projek & Studi Kasus'
              : activeBgSection === 'skills'
              ? '⚡ Skills & Arsenal'
              : activeBgSection === 'experience'
              ? '💼 Pengalaman / Journey'
              : activeBgSection === 'contact'
              ? '✉️ Kontak & Footer'
              : activeBgSection === 'about_story'
              ? '📖 Kisah Saya (Story)'
              : `📄 ${activeBgSection.replace('about_subpage_', '').toUpperCase()}`}
          </span>
        </div>

        {/* Apply to All Sections Button */}
        <button
          type="button"
          onClick={() => {
            const lightVal =
              localData.webTexts?.[`${activeBgSection}_bg_color`] ||
              localData.webTexts?.home_bg_color ||
              '#f7f9fb';
            const darkVal =
              localData.webTexts?.[`${activeBgSection}_bg_color_dark`] ||
              localData.webTexts?.home_bg_color_dark ||
              '#0f172a';
            const sections = [
              'home',
              'hero',
              'projects',
              'skills',
              'experience',
              'contact',
              'about_story',
              'about_subpage_education',
              'about_subpage_personality',
              'about_subpage_hobbies',
              'about_subpage_career_goals',
            ];
            handleUpdate((prev) => {
              const newTexts = { ...(prev.webTexts || {}) };
              sections.forEach((sec) => {
                newTexts[`${sec}_bg_color`] = lightVal;
                newTexts[`${sec}_bg_color_id`] = lightVal;
                newTexts[`${sec}_bg_color_en`] = lightVal;
                newTexts[`${sec}_bg_color_dark`] = darkVal;
                newTexts[`${sec}_bg_color_dark_id`] = darkVal;
                newTexts[`${sec}_bg_color_dark_en`] = darkVal;
              });
              return { ...prev, webTexts: newTexts };
            });
            setAppliedAllNotice(true);
            setTimeout(() => setAppliedAllNotice(false), 3000);
          }}
          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10.5px] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          title="Terapkan warna background bagian ini ke semua halaman web"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Terapkan ke Semua Halaman</span>
        </button>
      </div>

      {appliedAllNotice && (
        <div className="px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Warna background berhasil diterapkan ke seluruh halaman portofolio!</span>
        </div>
      )}

      {/* Theme Accent Color Picker */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
        <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Warna Aksen Utama Portofolio (Theme Accent):</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { id: 'emerald', label: 'Emerald', hex: '#10b981' },
            { id: 'blue', label: 'Blue', hex: '#3b82f6' },
            { id: 'indigo', label: 'Indigo', hex: '#6366f1' },
            { id: 'rose', label: 'Rose', hex: '#f43f5e' },
            { id: 'amber', label: 'Amber', hex: '#f59e0b' },
            { id: 'slate', label: 'Slate', hex: '#64748b' },
          ].map((c) => {
            const active = (localData.layoutSettings?.themeColor || 'blue') === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    layoutSettings: {
                      ...(prev.layoutSettings || {
                        fontSize: 'standard',
                        spacing: 'standard',
                        layoutStyle: 'left-sidebar',
                        fontFamily: 'sans',
                        sectionOrder: [],
                      }),
                      themeColor: c.id as any,
                    },
                  }));
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? 'border-white ring-2 ring-purple-500 bg-purple-500/10'
                    : isDark
                    ? 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full shadow-inner border border-white/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[10px] font-bold text-slate-300">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Selector Pills for Background Colors */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Pilih Halaman yang Diatur:</span>
          </label>
          <button
            type="button"
            onClick={() => {
              const lightBg =
                localData.webTexts?.[activeBgSection === 'home' ? 'home_bg_color' : `${activeBgSection}_bg_color`] ||
                '#f7f9fb';
              const darkBg =
                localData.webTexts?.[
                  activeBgSection === 'home' ? 'home_bg_color_dark' : `${activeBgSection}_bg_color_dark`
                ] || '#0f172a';
              const sections = [
                'home',
                'projects',
                'skills',
                'experience',
                'contact',
                'about_story',
                'about_subpage_education',
                'about_subpage_personality',
                'about_subpage_hobbies',
                'about_subpage_career_goals',
              ];
              handleUpdate((prev) => {
                const newTexts = { ...(prev.webTexts || {}) };
                sections.forEach((sec) => {
                  newTexts[`${sec}_bg_color`] = lightBg;
                  newTexts[`${sec}_bg_color_dark`] = darkBg;
                });
                newTexts['hero_bg_color'] = lightBg;
                newTexts['hero_bg_color_dark'] = darkBg;
                return { ...prev, webTexts: newTexts };
              });
              setAppliedAllNotice(true);
              setTimeout(() => setAppliedAllNotice(false), 3000);
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Terapkan BG ke Semua Halaman</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'home', label: '🏠 Beranda' },
            { id: 'projects', label: '📂 Projek' },
            { id: 'skills', label: '⚡ Skills' },
            { id: 'experience', label: '💼 Pengalaman' },
            { id: 'contact', label: '✉️ Kontak' },
            { id: 'about_story', label: '📖 Kisah Saya' },
            { id: 'about_subpage_education', label: '🎓 Pendidikan' },
            { id: 'about_subpage_personality', label: '🧠 Kepribadian' },
            { id: 'about_subpage_hobbies', label: '🎨 Hobi' },
            { id: 'about_subpage_career_goals', label: '🎯 Target Karir' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveBgSection(sec.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeBgSection === sec.id
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section-Specific Background Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Light Mode BG for Active Section */}
        {(() => {
          const lightBgKey = activeBgSection === 'home' ? 'home_bg_color' : `${activeBgSection}_bg_color`;
          const currentVal = localData.webTexts?.[lightBgKey] || localData.webTexts?.home_bg_color || '#f7f9fb';
          return (
            <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                  <Sun className="w-4 h-4" />
                  <span>Warna Background (Mode Terang)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{lightBgKey}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentVal.startsWith('#') ? currentVal : '#f7f9fb'}
                  onChange={(e) => {
                    handleWebTextChange(lightBgKey, e.target.value, editLang);
                    if (activeBgSection === 'home') {
                      handleWebTextChange('hero_bg_color', e.target.value, editLang);
                    }
                  }}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={currentVal}
                  onChange={(e) => {
                    handleWebTextChange(lightBgKey, e.target.value, editLang);
                    if (activeBgSection === 'home') {
                      handleWebTextChange('hero_bg_color', e.target.value, editLang);
                    }
                  }}
                  placeholder="#f7f9fb"
                  className={inputClass}
                />
              </div>
              {/* Quick Presets for Light */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { hex: '#ccd6e1', name: 'Design Gray' },
                  { hex: '#ffffff', name: 'Putih' },
                  { hex: '#f7f9fb', name: 'Default' },
                  { hex: '#f1f5f9', name: 'Slate Light' },
                  { hex: '#e2e8f0', name: 'Slate Gray' },
                  { hex: '#fdfbf7', name: 'Cream' },
                  { hex: '#f0fdf4', name: 'Mint' },
                  { hex: '#f0f9ff', name: 'Sky' },
                ].map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => {
                      handleWebTextChange(lightBgKey, p.hex, editLang);
                      if (activeBgSection === 'home') {
                        handleWebTextChange('hero_bg_color', p.hex, editLang);
                      }
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Dark Mode BG for Active Section */}
        {(() => {
          const darkBgKey = activeBgSection === 'home' ? 'home_bg_color_dark' : `${activeBgSection}_bg_color_dark`;
          const currentVal = localData.webTexts?.[darkBgKey] || localData.webTexts?.home_bg_color_dark || '#0f172a';
          return (
            <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                  <Moon className="w-4 h-4" />
                  <span>Warna Background (Mode Gelap)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{darkBgKey}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentVal.startsWith('#') ? currentVal : '#0f172a'}
                  onChange={(e) => {
                    handleWebTextChange(darkBgKey, e.target.value, editLang);
                    if (activeBgSection === 'home') {
                      handleWebTextChange('hero_bg_color_dark', e.target.value, editLang);
                    }
                  }}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={currentVal}
                  onChange={(e) => {
                    handleWebTextChange(darkBgKey, e.target.value, editLang);
                    if (activeBgSection === 'home') {
                      handleWebTextChange('hero_bg_color_dark', e.target.value, editLang);
                    }
                  }}
                  placeholder="#0f172a"
                  className={inputClass}
                />
              </div>
              {/* Quick Presets for Dark */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { hex: '#0f172a', name: 'Midnight' },
                  { hex: '#0b1120', name: 'Deep Navy' },
                  { hex: '#020617', name: 'Pitch Dark' },
                  { hex: '#1e293b', name: 'Slate Dark' },
                  { hex: '#111827', name: 'Charcoal' },
                ].map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => {
                      handleWebTextChange(darkBgKey, p.hex, editLang);
                      if (activeBgSection === 'home') {
                        handleWebTextChange('hero_bg_color_dark', p.hex, editLang);
                      }
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Navbar Colors */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
        <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5" />
          <span>Warna Navbar Navigasi Atas</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Navbar (Mode Terang)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  localData.webTexts?.navbar_bg_color?.startsWith('#')
                    ? localData.webTexts.navbar_bg_color
                    : '#ffffff'
                }
                onChange={(e) => handleWebTextChange('navbar_bg_color', e.target.value, editLang)}
                className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
              />
              <input
                type="text"
                value={localData.webTexts?.navbar_bg_color || ''}
                onChange={(e) => handleWebTextChange('navbar_bg_color', e.target.value, editLang)}
                placeholder="rgba(255,255,255,0.85)"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Navbar (Mode Gelap)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  localData.webTexts?.navbar_bg_color_dark?.startsWith('#')
                    ? localData.webTexts.navbar_bg_color_dark
                    : '#1e293b'
                }
                onChange={(e) => handleWebTextChange('navbar_bg_color_dark', e.target.value, editLang)}
                className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
              />
              <input
                type="text"
                value={localData.webTexts?.navbar_bg_color_dark || ''}
                onChange={(e) => handleWebTextChange('navbar_bg_color_dark', e.target.value, editLang)}
                placeholder="rgba(30,41,59,0.85)"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Active Tab Highlight Colors */}
        <div className="pt-3 border-t border-slate-700/50 space-y-3">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Warna &amp; Kontainer Sorotan Tab Aktif</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Warna Teks Tab Aktif (Terang)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    localData.webTexts?.navbar_active_color?.startsWith('#')
                      ? localData.webTexts.navbar_active_color
                      : '#047857'
                  }
                  onChange={(e) => handleWebTextChange('navbar_active_color', e.target.value, editLang)}
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={localData.webTexts?.navbar_active_color || ''}
                  onChange={(e) => handleWebTextChange('navbar_active_color', e.target.value, editLang)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Warna Teks Tab Aktif (Gelap)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    localData.webTexts?.navbar_active_color_dark?.startsWith('#')
                      ? localData.webTexts.navbar_active_color_dark
                      : '#34d399'
                  }
                  onChange={(e) => handleWebTextChange('navbar_active_color_dark', e.target.value, editLang)}
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={localData.webTexts?.navbar_active_color_dark || ''}
                  onChange={(e) => handleWebTextChange('navbar_active_color_dark', e.target.value, editLang)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Warna Kontainer Tab (Terang)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    localData.webTexts?.navbar_active_bg_color?.startsWith('#')
                      ? localData.webTexts.navbar_active_bg_color
                      : '#d1fae5'
                  }
                  onChange={(e) => handleWebTextChange('navbar_active_bg_color', e.target.value, editLang)}
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={localData.webTexts?.navbar_active_bg_color || ''}
                  onChange={(e) => handleWebTextChange('navbar_active_bg_color', e.target.value, editLang)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Warna Kontainer Tab (Gelap)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    localData.webTexts?.navbar_active_bg_color_dark?.startsWith('#')
                      ? localData.webTexts.navbar_active_bg_color_dark
                      : '#064e3b'
                  }
                  onChange={(e) => handleWebTextChange('navbar_active_bg_color_dark', e.target.value, editLang)}
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={localData.webTexts?.navbar_active_bg_color_dark || ''}
                  onChange={(e) => handleWebTextChange('navbar_active_bg_color_dark', e.target.value, editLang)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
              <span>Transparansi Kontainer Sorotan Tab:</span>
              <span className="font-mono text-emerald-400">
                {Math.round(parseFloat(localData.webTexts?.navbar_active_bg_opacity || '0.6') * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={parseFloat(localData.webTexts?.navbar_active_bg_opacity || '0.6')}
              onChange={(e) => handleWebTextChange('navbar_active_bg_opacity', e.target.value, editLang)}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
