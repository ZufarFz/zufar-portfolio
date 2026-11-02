import React from 'react';
import { CVData } from '../../../../types';
import { Sparkles, Layers, RotateCcw, CheckCircle2 } from 'lucide-react';
import BackgroundPatternSelector from '../../BackgroundPatternSelector';

interface BackgroundPatternPanelProps {
  localData: CVData;
  activeBgSection: string;
  setActiveBgSection: (sec: string) => void;
  handleApplyBgPatternToAll: () => void;
  appliedAllNotice: boolean;
  handleWebTextChange: (key: string, val: string, lang?: 'id' | 'en') => void;
  editLang: 'id' | 'en';
  isDark: boolean;
  cardBg: string;
  theme: 'light' | 'dark';
}

export const BackgroundPatternPanel: React.FC<BackgroundPatternPanelProps> = ({
  localData,
  activeBgSection,
  setActiveBgSection,
  handleApplyBgPatternToAll,
  appliedAllNotice,
  handleWebTextChange,
  editLang,
  isDark,
  cardBg,
  theme,
}) => {
  const secKey = activeBgSection;
  const secLabel = {
    home: 'Hero / Home (Seksi Utama)',
    projects: 'Seksi Studi Kasus / Proyek',
    skills: 'Seksi Keahlian (Skills Arsenal)',
    experience: 'Seksi Pengalaman Kerja (Career Journey)',
    contact: 'Seksi Formulir Kontak & Footer',
    about_story: 'Halaman Kisah Saya (About Story Page)',
    about_subpage_education: 'Halaman Sub-Page: Pendidikan (Education)',
    about_subpage_personality: 'Halaman Sub-Page: Kepribadian (Personality)',
    about_subpage_hobbies: 'Halaman Sub-Page: Hobi & Minat (Hobbies)',
    about_subpage_career_goals: 'Halaman Sub-Page: Target Karir (Career Goals)',
  }[secKey] || secKey;

  const subKey = secKey.replace('about_subpage_', '');
  const texts = localData.webTexts || {};

  const val =
    texts[`${secKey}_bg_style`] ||
    texts[`${secKey}_bg_style_${editLang}`] ||
    texts[`${subKey}_bg_style`] ||
    texts[`${subKey}_bg_style_${editLang}`] ||
    (secKey === 'home' ? 'dots' : 'none');

  const opStr =
    texts[`${secKey}_bg_pattern_opacity`] ||
    texts[`${secKey}_bg_pattern_opacity_${editLang}`] ||
    texts[`${subKey}_bg_pattern_opacity`] ||
    texts[`${subKey}_bg_pattern_opacity_${editLang}`] ||
    (secKey === 'home' ? texts.home_bg_custom_opacity : undefined);
  const op = opStr ? parseFloat(opStr) : 0.2;

  const scStr =
    texts[`${secKey}_bg_pattern_scale`] ||
    texts[`${secKey}_bg_pattern_scale_${editLang}`] ||
    texts[`${subKey}_bg_pattern_scale`] ||
    texts[`${subKey}_bg_pattern_scale_${editLang}`];
  const sc = scStr ? parseFloat(scStr) : 1;

  const col =
    texts[`${secKey}_bg_pattern_color`] ||
    texts[`${secKey}_bg_pattern_color_${editLang}`] ||
    texts[`${subKey}_bg_pattern_color`] ||
    texts[`${subKey}_bg_pattern_color_${editLang}`] ||
    '';

  const svg =
    texts[`${secKey}_bg_custom_svg`] ||
    texts[`${secKey}_custom_svg`] ||
    texts[`${secKey}_bg_custom_svg_${editLang}`] ||
    texts[`${secKey}_custom_svg_${editLang}`] ||
    texts[`${subKey}_bg_custom_svg`] ||
    texts[`${subKey}_custom_svg`] ||
    '';

  const url =
    texts[`${secKey}_bg_custom_url`] ||
    texts[`${secKey}_custom_url`] ||
    texts[`${secKey}_bg_custom_url_${editLang}`] ||
    texts[`${secKey}_custom_url_${editLang}`] ||
    texts[`${subKey}_bg_custom_url`] ||
    texts[`${subKey}_custom_url`] ||
    (secKey === 'home' ? texts.home_bg_custom_url : '') ||
    '';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pola Latar Belakang & Motif SVG</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Pilih motif Jepang Wagara, Geometris modern, Watercolor, atau SVG kustom
          </p>
        </div>
      </div>

      {/* Section Switcher Tabs for Background */}
      <div className={`p-3 rounded-xl border ${cardBg} space-y-3`}>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Pilih Seksi / Halaman:</span>
          </label>
          <button
            type="button"
            onClick={handleApplyBgPatternToAll}
            className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            title="Terapkan motif & pengaturan seksi ini ke semua seksi dan halaman lainnya"
          >
            {appliedAllNotice ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Berhasil Diterapkan ke Semua!</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3 h-3" />
                <span>Terapkan ke Semua Halaman</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {[
            { id: 'home', label: '🏠 Hero / Home' },
            { id: 'projects', label: '📂 Proyek' },
            { id: 'skills', label: '⚡ Skills' },
            { id: 'experience', label: '💼 Pengalaman' },
            { id: 'contact', label: '✉️ Kontak' },
            { id: 'about_story', label: '📖 Kisah Saya' },
            { id: 'about_subpage_education', label: '🎓 Pendidikan' },
            { id: 'about_subpage_personality', label: '💎 Kepribadian' },
            { id: 'about_subpage_hobbies', label: '🎨 Hobi' },
            { id: 'about_subpage_career_goals', label: '🚀 Target Karir' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveBgSection(sec.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all border cursor-pointer truncate ${
                activeBgSection === sec.id
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                  : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Integrated Background Pattern Selector Component */}
      <div className={`p-4 rounded-xl border ${cardBg}`}>
        <BackgroundPatternSelector
          label={`Pola Background: ${secLabel}`}
          sectionName={secLabel}
          value={val}
          opacityValue={op}
          scaleValue={sc}
          colorValue={col}
          customSvgValue={svg}
          customUrlValue={url}
          theme={theme}
          onApplyToAll={handleApplyBgPatternToAll}
          onChange={(newVal) => {
            handleWebTextChange(`${secKey}_bg_style`, newVal, editLang);
          }}
          onOpacityChange={(newOp) => {
            handleWebTextChange(`${secKey}_bg_pattern_opacity`, newOp.toString(), editLang);
          }}
          onScaleChange={(newSc) => {
            handleWebTextChange(`${secKey}_bg_pattern_scale`, newSc.toString(), editLang);
          }}
          onColorChange={(newCol) => {
            handleWebTextChange(`${secKey}_bg_pattern_color`, newCol, editLang);
          }}
          onCustomSvgChange={(newSvg) => {
            handleWebTextChange(`${secKey}_custom_svg`, newSvg, editLang);
          }}
          onCustomUrlChange={(newUrl) => {
            handleWebTextChange(`${secKey}_custom_url`, newUrl, editLang);
          }}
        />
      </div>
    </div>
  );
};
