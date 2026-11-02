import React from 'react';
import { CVData } from '../../../../types';
import {
  Sliders,
  Sparkles,
  Check,
  Layers,
  Eye,
  Move,
  ZoomIn,
  Palette,
} from 'lucide-react';

interface ThemeShadowsPanelProps {
  localData: CVData;
  activeBgSection: string;
  setActiveBgSection: (sec: string) => void;
  handleUpdate: React.Dispatch<React.SetStateAction<CVData>>;
  handleWebTextChange: (key: string, val: string, lang?: 'id' | 'en') => void;
  appliedAllNotice: boolean;
  setAppliedAllNotice: (notice: boolean) => void;
  editLang: 'id' | 'en';
  cardBg: string;
  inputClass: string;
}

export const ThemeShadowsPanel: React.FC<ThemeShadowsPanelProps> = ({
  localData,
  activeBgSection,
  setActiveBgSection,
  handleUpdate,
  handleWebTextChange,
  appliedAllNotice,
  setAppliedAllNotice,
  editLang,
  cardBg,
  inputClass,
}) => {
  const dirKey = `${activeBgSection}_shadow_direction`;
  const depthKey = `${activeBgSection}_shadow_depth`;
  const opacityKey = `${activeBgSection}_shadow_opacity`;
  const colorModeKey = `${activeBgSection}_shadow_color_mode`;
  const customColorKey = `${activeBgSection}_shadow_custom_color`;

  const currentDir =
    localData.webTexts?.[dirKey] ||
    (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_direction : undefined) ||
    'bottom';
  const currentDepth = parseFloat(
    localData.webTexts?.[depthKey] ||
      (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_depth : undefined) ||
      '40'
  );
  const currentOpacity = parseFloat(
    localData.webTexts?.[opacityKey] ||
      (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_opacity : undefined) ||
      '0.85'
  );
  const currentColorMode =
    localData.webTexts?.[colorModeKey] ||
      (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_color_mode : undefined) ||
      'auto';
  const currentCustomColor = localData.webTexts?.[customColorKey] || '#000000';
  const enabledKey = `${activeBgSection}_shadow_enabled`;
  const isEnabled =
    localData.webTexts?.[enabledKey] === 'true' ||
    (activeBgSection === 'home' && localData.webTexts?.hero_shadow_enabled === 'true');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Pengaturan Bayangan Gradasi Sisi (Edge Shadows)</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Aktifkan efek gradasi bayangan dari bawah/atas/sisi halaman dengan ketebalan dan intensitas fleksibel
          </p>
        </div>
      </div>

      {/* Section Selector Pills for Shadow tab */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Pilih Halaman Target Bayangan:</span>
          </label>
          <button
            type="button"
            onClick={() => {
              const enabled = localData.webTexts?.[`${activeBgSection}_shadow_enabled`] || 'false';
              const dir = localData.webTexts?.[`${activeBgSection}_shadow_direction`] || 'bottom';
              const depth = localData.webTexts?.[`${activeBgSection}_shadow_depth`] || '40';
              const opacity = localData.webTexts?.[`${activeBgSection}_shadow_opacity`] || '0.85';
              const colorMode = localData.webTexts?.[`${activeBgSection}_shadow_color_mode`] || 'auto';
              const customColor = localData.webTexts?.[`${activeBgSection}_shadow_custom_color`] || '';

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
                  newTexts[`${sec}_shadow_enabled`] = enabled;
                  newTexts[`${sec}_shadow_direction`] = dir;
                  newTexts[`${sec}_shadow_depth`] = depth;
                  newTexts[`${sec}_shadow_opacity`] = opacity;
                  newTexts[`${sec}_shadow_color_mode`] = colorMode;
                  newTexts[`${sec}_shadow_custom_color`] = customColor;
                });
                if (activeBgSection === 'home') {
                  newTexts['hero_shadow_enabled'] = enabled;
                  newTexts['hero_shadow_direction'] = dir;
                  newTexts['hero_shadow_depth'] = depth;
                  newTexts['hero_shadow_opacity'] = opacity;
                  newTexts['hero_shadow_color_mode'] = colorMode;
                  newTexts['hero_shadow_custom_color'] = customColor;
                }
                return { ...prev, webTexts: newTexts };
              });
              setAppliedAllNotice(true);
              setTimeout(() => setAppliedAllNotice(false), 3000);
            }}
            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Terapkan ke Semua Halaman</span>
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
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {appliedAllNotice && (
        <div className="px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pengaturan bayangan gradasi berhasil diterapkan ke semua halaman!</span>
        </div>
      )}

      {/* Master Switch: Enable / Disable */}
      <div className={`p-4 rounded-xl border ${cardBg} flex items-center justify-between gap-4`}>
        <div>
          <span className="font-bold text-xs text-slate-200 block">
            Aktifkan Bayangan Gradasi Halaman ({activeBgSection.toUpperCase()})
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            Menampilkan gradasi bayangan halus di sisi tepi halaman ini
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextVal = isEnabled ? 'false' : 'true';
            handleWebTextChange(enabledKey, nextVal, editLang);
            if (activeBgSection === 'home') {
              handleWebTextChange('hero_shadow_enabled', nextVal, editLang);
            }
          }}
          className={`w-12 h-6 rounded-full transition-colors cursor-pointer p-0.5 flex items-center ${
            isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
        </button>
      </div>

      {/* Shadow Detailed Controls */}
      <div className="space-y-4">
        {/* Live Simulation Preview */}
        <div className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Simulasi Tampilan Bayangan:</span>
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                isEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isEnabled ? '🟢 AKTIF' : '⚪ NON-AKTIF'}
            </span>
          </div>
          <div className="relative w-full h-20 rounded-lg bg-slate-900 border border-slate-700/80 overflow-hidden flex items-center justify-center">
            <div className="text-[10px] text-slate-500 font-mono select-none z-10">
              {activeBgSection.toUpperCase()} PREVIEW CANVAS
            </div>
            {isEnabled && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-200"
                style={{
                  background:
                    currentDir === 'bottom'
                      ? `linear-gradient(to top, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                      : currentDir === 'top'
                      ? `linear-gradient(to bottom, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                      : currentDir === 'top_bottom'
                      ? `linear-gradient(to top, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%), linear-gradient(to bottom, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                      : currentDir === 'left'
                      ? `linear-gradient(to right, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                      : currentDir === 'right'
                      ? `linear-gradient(to left, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                      : `radial-gradient(ellipse at center, transparent ${Math.max(
                          0,
                          100 - currentDepth
                        )}%, rgba(0,0,0,${currentOpacity}) 100%)`,
                }}
              />
            )}
          </div>
        </div>

        {/* Direction Selector */}
        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-purple-400" />
            <span>Pilih Arah / Posisi Bayangan:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'bottom', label: '⬇️ Bawah (Bottom)', desc: 'Gradasi dari bawah' },
              { id: 'top', label: '⬆️ Atas (Top)', desc: 'Gradasi dari atas' },
              { id: 'top_bottom', label: '↕️ Atas & Bawah', desc: 'Dua sisi vertikal' },
              { id: 'left', label: '⬅️ Kiri (Left)', desc: 'Gradasi dari kiri' },
              { id: 'right', label: '➡️ Kanan (Right)', desc: 'Gradasi dari kanan' },
              { id: 'all', label: '🔲 Sekeliling (Vignette)', desc: '4 sudut melingkar' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  handleWebTextChange(dirKey, item.id, editLang);
                  if (activeBgSection === 'home') {
                    handleWebTextChange('hero_shadow_direction', item.id, editLang);
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  currentDir === item.id
                    ? 'border-purple-500 ring-2 ring-purple-500/40 bg-purple-500/15 text-white'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block">{item.label}</span>
                <span className="text-[9.5px] opacity-75 block mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Depth / Thickness Slider */}
        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
              <span>Ketebalan / Jangkauan Bayangan:</span>
            </label>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
              {currentDepth}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            step="5"
            value={currentDepth}
            onChange={(e) => {
              handleWebTextChange(depthKey, e.target.value, editLang);
              if (activeBgSection === 'home') {
                handleWebTextChange('hero_shadow_depth', e.target.value, editLang);
              }
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10% (Tipis di pinggir)</span>
            <span>50% (Sedang)</span>
            <span>95% (Hampir Penuh)</span>
          </div>
        </div>

        {/* Opacity / Intensity Slider */}
        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Kepekatan / Intensitas Bayangan:</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {Math.round(currentOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={currentOpacity}
            onChange={(e) => {
              handleWebTextChange(opacityKey, e.target.value, editLang);
              if (activeBgSection === 'home') {
                handleWebTextChange('hero_shadow_opacity', e.target.value, editLang);
              }
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10% (Sangat Halus)</span>
            <span>50% (Natural)</span>
            <span>100% (Sangat Pekat)</span>
          </div>
        </div>

        {/* Shadow Color Mode */}
        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-teal-400" />
            <span>Warna Bayangan Gradasi:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'auto', label: '🎨 Otomatis', desc: 'Kontras Alami' },
              { id: 'black', label: '⚫ Hitam', desc: 'Bayangan Gelap' },
              { id: 'white', label: '⚪ Putih', desc: 'Gradasi Terang' },
              { id: 'accent', label: '💎 Aksen', desc: 'Sesuai Aksen' },
              { id: 'custom', label: '🖌️ Custom', desc: 'Pilih Warna' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  handleWebTextChange(colorModeKey, item.id, editLang);
                  if (activeBgSection === 'home') {
                    handleWebTextChange('hero_shadow_color_mode', item.id, editLang);
                  }
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  currentColorMode === item.id
                    ? 'border-teal-500 ring-2 ring-teal-500/40 bg-teal-500/15 text-white'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block">{item.label}</span>
                <span className="text-[9px] opacity-75 block">{item.desc}</span>
              </button>
            ))}
          </div>

          {/* Custom Color Input if 'custom' is selected */}
          {currentColorMode === 'custom' && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="color"
                value={currentCustomColor.startsWith('#') ? currentCustomColor : '#000000'}
                onChange={(e) => {
                  handleWebTextChange(customColorKey, e.target.value, editLang);
                  if (activeBgSection === 'home') {
                    handleWebTextChange('hero_shadow_custom_color', e.target.value, editLang);
                  }
                }}
                className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer p-0.5 bg-transparent"
              />
              <input
                type="text"
                value={currentCustomColor}
                onChange={(e) => {
                  handleWebTextChange(customColorKey, e.target.value, editLang);
                  if (activeBgSection === 'home') {
                    handleWebTextChange('hero_shadow_custom_color', e.target.value, editLang);
                  }
                }}
                placeholder="#000000"
                className={inputClass}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
