import React from 'react';
import { CVData } from '../../../../types';
import {
  Image,
  GraduationCap,
  Upload,
  Smile,
  Heart,
  Target,
  BookOpen,
  Cpu,
  Sliders,
  Brush,
  Briefcase,
  FolderGit2,
  Mail,
  User,
  RotateCcw,
  ZoomIn,
  Move,
  Eye,
  ImageOff,
} from 'lucide-react';

interface ImagesBannersPanelProps {
  localData: CVData;
  activeBgSection: string;
  setActiveBgSection: (sec: string) => void;
  handleUpdate: React.Dispatch<React.SetStateAction<CVData>>;
  handleWebTextChange: (key: string, val: string, lang?: 'id' | 'en') => void;
  handleWebTextImageUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  handleImageFileUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  uploadFileToStorage: (file: File) => Promise<string>;
  setEditorMode: (mode: any) => void;
  setActiveTab: (tab: any) => void;
  setAssetTab: (tab: any) => void;
  editLang: 'id' | 'en';
  isDark: boolean;
  cardBg: string;
  inputClass: string;
}

export const ImagesBannersPanel: React.FC<ImagesBannersPanelProps> = ({
  localData,
  activeBgSection,
  setActiveBgSection,
  handleUpdate,
  handleWebTextChange,
  handleWebTextImageUpload,
  handleImageFileUpload,
  uploadFileToStorage,
  setEditorMode,
  setActiveTab,
  setAssetTab,
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
            <Image className="w-3.5 h-3.5" />
            <span>
              {activeBgSection === 'about_subpage_education'
                ? '🎓 Aset Gambar: Halaman Pendidikan'
                : activeBgSection === 'about_subpage_personality'
                ? '💎 Aset Gambar: Halaman Kepribadian'
                : activeBgSection === 'about_subpage_hobbies'
                ? '🎨 Aset Gambar: Halaman Hobi & Minat'
                : activeBgSection === 'about_subpage_career_goals'
                ? '🚀 Aset Gambar: Halaman Target Karir'
                : activeBgSection === 'about_story'
                ? '📖 Aset Gambar: Halaman Kisah Saya'
                : activeBgSection === 'experience'
                ? '💼 Aset Gambar: Perjalanan Karir'
                : activeBgSection === 'projects'
                ? '📂 Aset Gambar: Studi Kasus'
                : activeBgSection === 'skills'
                ? '⚡ Aset Gambar: Keahlian (Skills)'
                : activeBgSection === 'contact'
                ? '✉️ Aset Gambar: Kontak & Footer'
                : '🏠 Aset Foto & Banner Beranda'}
            </span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Pilih konteks halaman untuk mengelola aset gambar banner atau foto yang sesuai
          </p>
        </div>
      </div>

      {/* Quick Section Switcher Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-medium scrollbar-thin">
        {[
          { id: 'home', label: '🏠 Beranda / Avatar' },
          { id: 'skills', label: '⚡ Skills' },
          { id: 'about_story', label: '📖 Kisah Saya' },
          { id: 'about_subpage_education', label: '🎓 Pendidikan' },
          { id: 'about_subpage_personality', label: '💎 Kepribadian' },
          { id: 'about_subpage_hobbies', label: '🎨 Hobi' },
          { id: 'about_subpage_career_goals', label: '🚀 Target Karir' },
          ...(localData.customSubPages || []).map((p) => ({
            id: `subpage_${p.id}`,
            label: `📄 ${editLang === 'id' ? p.titleId : p.titleEn}`,
          })),
          { id: 'experience', label: '💼 Pengalaman' },
          { id: 'projects', label: '📂 Proyek' },
          { id: 'contact', label: '✉️ Kontak' },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveBgSection(sec.id)}
            className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap border cursor-pointer ${
              activeBgSection === sec.id
                ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-xs'
                : isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* CONTEXT 1: EDUCATION PAGE ASSETS */}
      {activeBgSection === 'about_subpage_education' && (
        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Banner Header Halaman Pendidikan</span>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400">URL Gambar Banner Header</label>
            <input
              type="text"
              value={localData.webTexts?.education_header_bg_url || ''}
              onChange={(e) => handleWebTextChange('education_header_bg_url', e.target.value, editLang)}
              placeholder="https://... atau unggah gambar banner"
              className={inputClass}
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Banner Pendidikan</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleWebTextImageUpload(e, 'education_header_bg_url')}
              />
            </label>
          </div>
          {/* Scale & Position Sliders */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Zoom Scale:</span>
                <span className="font-mono text-emerald-400">
                  {parseFloat(localData.webTexts?.education_header_bg_scale || '1').toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={parseFloat(localData.webTexts?.education_header_bg_scale || '1')}
                onChange={(e) => handleWebTextChange('education_header_bg_scale', e.target.value, editLang)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser X:</span>
                <span className="font-mono text-emerald-400">
                  {localData.webTexts?.education_header_bg_x || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.education_header_bg_x || '0', 10)}
                onChange={(e) => handleWebTextChange('education_header_bg_x', e.target.value, editLang)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser Y:</span>
                <span className="font-mono text-emerald-400">
                  {localData.webTexts?.education_header_bg_y || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.education_header_bg_y || '0', 10)}
                onChange={(e) => handleWebTextChange('education_header_bg_y', e.target.value, editLang)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT 2: PERSONALITY PAGE ASSETS */}
      {activeBgSection === 'about_subpage_personality' && (
        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5" />
            <span>Banner Header Halaman Kepribadian</span>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400">URL Gambar Banner Header</label>
            <input
              type="text"
              value={localData.webTexts?.personality_header_bg_url || ''}
              onChange={(e) => handleWebTextChange('personality_header_bg_url', e.target.value, editLang)}
              placeholder="https://... atau unggah gambar banner"
              className={inputClass}
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Banner Kepribadian</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleWebTextImageUpload(e, 'personality_header_bg_url')}
              />
            </label>
          </div>
          {/* Scale & Position Sliders */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Zoom Scale:</span>
                <span className="font-mono text-purple-400">
                  {parseFloat(localData.webTexts?.personality_header_bg_scale || '1').toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={parseFloat(localData.webTexts?.personality_header_bg_scale || '1')}
                onChange={(e) => handleWebTextChange('personality_header_bg_scale', e.target.value, editLang)}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser X:</span>
                <span className="font-mono text-purple-400">
                  {localData.webTexts?.personality_header_bg_x || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.personality_header_bg_x || '0', 10)}
                onChange={(e) => handleWebTextChange('personality_header_bg_x', e.target.value, editLang)}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser Y:</span>
                <span className="font-mono text-purple-400">
                  {localData.webTexts?.personality_header_bg_y || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.personality_header_bg_y || '0', 10)}
                onChange={(e) => handleWebTextChange('personality_header_bg_y', e.target.value, editLang)}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT 3: HOBBIES PAGE ASSETS */}
      {activeBgSection === 'about_subpage_hobbies' && (
        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>Banner Header Halaman Hobi &amp; Minat</span>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400">URL Gambar Banner Header</label>
            <input
              type="text"
              value={localData.webTexts?.hobbies_header_bg_url || ''}
              onChange={(e) => handleWebTextChange('hobbies_header_bg_url', e.target.value, editLang)}
              placeholder="https://... atau unggah gambar banner"
              className={inputClass}
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Banner Hobi</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleWebTextImageUpload(e, 'hobbies_header_bg_url')}
              />
            </label>
          </div>
          {/* Scale & Position Sliders */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Zoom Scale:</span>
                <span className="font-mono text-amber-400">
                  {parseFloat(localData.webTexts?.hobbies_header_bg_scale || '1').toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={parseFloat(localData.webTexts?.hobbies_header_bg_scale || '1')}
                onChange={(e) => handleWebTextChange('hobbies_header_bg_scale', e.target.value, editLang)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser X:</span>
                <span className="font-mono text-amber-400">
                  {localData.webTexts?.hobbies_header_bg_x || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.hobbies_header_bg_x || '0', 10)}
                onChange={(e) => handleWebTextChange('hobbies_header_bg_x', e.target.value, editLang)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser Y:</span>
                <span className="font-mono text-amber-400">
                  {localData.webTexts?.hobbies_header_bg_y || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.hobbies_header_bg_y || '0', 10)}
                onChange={(e) => handleWebTextChange('hobbies_header_bg_y', e.target.value, editLang)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT 4: CAREER GOALS PAGE ASSETS */}
      {activeBgSection === 'about_subpage_career_goals' && (
        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Banner Header Halaman Target Karir</span>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400">URL Gambar Banner Header</label>
            <input
              type="text"
              value={localData.webTexts?.career_goals_header_bg_url || ''}
              onChange={(e) => handleWebTextChange('career_goals_header_bg_url', e.target.value, editLang)}
              placeholder="https://... atau unggah gambar banner"
              className={inputClass}
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Banner Target Karir</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleWebTextImageUpload(e, 'career_goals_header_bg_url')}
              />
            </label>
          </div>
          {/* Scale & Position Sliders */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Zoom Scale:</span>
                <span className="font-mono text-blue-400">
                  {parseFloat(localData.webTexts?.career_goals_header_bg_scale || '1').toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={parseFloat(localData.webTexts?.career_goals_header_bg_scale || '1')}
                onChange={(e) => handleWebTextChange('career_goals_header_bg_scale', e.target.value, editLang)}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser X:</span>
                <span className="font-mono text-blue-400">
                  {localData.webTexts?.career_goals_header_bg_x || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.career_goals_header_bg_x || '0', 10)}
                onChange={(e) => handleWebTextChange('career_goals_header_bg_x', e.target.value, editLang)}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Geser Y:</span>
                <span className="font-mono text-blue-400">
                  {localData.webTexts?.career_goals_header_bg_y || '0'}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={parseInt(localData.webTexts?.career_goals_header_bg_y || '0', 10)}
                onChange={(e) => handleWebTextChange('career_goals_header_bg_y', e.target.value, editLang)}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT 5: ABOUT STORY PAGE ASSETS */}
      {activeBgSection === 'about_story' && (
        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
          <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Foto &amp; Banner Halaman Kisah Saya (About Story)</span>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400">URL Gambar / Foto Kisah Saya</label>
            <input
              type="text"
              value={localData.webTexts?.about_story_image_url || ''}
              onChange={(e) => handleWebTextChange('about_story_image_url', e.target.value, editLang)}
              placeholder="https://... atau unggah foto"
              className={inputClass}
            />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Foto Kisah Saya</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleWebTextImageUpload(e, 'about_story_image_url')}
              />
            </label>
          </div>
        </div>
      )}

      {/* CONTEXT 5B: CUSTOM ABOUT ME SUBPAGES ASSETS */}
      {activeBgSection.startsWith('subpage_') &&
        !['subpage_education', 'subpage_personality', 'subpage_hobbies', 'subpage_career_goals'].includes(
          activeBgSection
        ) &&
        (() => {
          const customId = activeBgSection.replace('subpage_', '');
          const customPage = (localData.customSubPages || []).find((p) => p.id === customId);
          return (
            <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                <span>
                  Banner Header:{' '}
                  {customPage ? (editLang === 'id' ? customPage.titleId : customPage.titleEn) : 'Halaman Kustom'}
                </span>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400">URL Gambar Banner Header</label>
                <input
                  type="text"
                  value={
                    localData.webTexts?.[`${customId}_header_bg_url`] || (customPage as any)?.coverImageUrl || ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    handleWebTextChange(`${customId}_header_bg_url`, val, editLang);
                    if (customPage) {
                      handleUpdate((prev) => ({
                        ...prev,
                        customSubPages: (prev.customSubPages || []).map((p) =>
                          p.id === customPage.id ? { ...p, coverImageUrl: val } : p
                        ),
                      }));
                    }
                  }}
                  placeholder="https://... atau unggah gambar banner"
                  className={inputClass}
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Banner Halaman</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const base64 = await uploadFileToStorage(file);
                        handleWebTextChange(`${customId}_header_bg_url`, base64, editLang);
                        if (customPage) {
                          handleUpdate((prev) => ({
                            ...prev,
                            customSubPages: (prev.customSubPages || []).map((p) =>
                              p.id === customPage.id ? { ...p, coverImageUrl: base64 } : p
                            ),
                          }));
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })()}

      {/* CONTEXT 6: SKILLS PAGE */}
      {activeBgSection === 'skills' && (
        <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-sm text-amber-300">
              ⚡ Halaman Keahlian (Skills) Menggunakan Vektor SVG
            </h5>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Halaman Skills tidak menggunakan gambar banner atau foto profil karena dirancang bersih dengan{' '}
              <strong>logo SVG vektor murni</strong> agar tajam dan berbobot ringan.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditorMode(editLang);
                setActiveTab('skills');
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Buka Pengaturan Skill &amp; SVG (Seksi 9)</span>
            </button>
            <button
              type="button"
              onClick={() => setAssetTab('bg_patterns')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Brush className="w-3.5 h-3.5 text-purple-400" />
              <span>Atur Pola SVG Background</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTEXT 7: EXPERIENCE PAGE */}
      {activeBgSection === 'experience' && (
        <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-sm text-blue-300">💼 Tidak Ada Banner Gambar di Halaman Pengalaman</h5>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Halaman Pengalaman disajikan dalam format linimasa karir terstruktur. Pengaturan teks dan logo institusi
              dikelola langsung pada tab Bahasa (Seksi 6 &amp; 7).
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditorMode(editLang);
                setActiveTab('experiences');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Buka Seksi Linimasa Karir</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTEXT 8: PROJECTS PAGE */}
      {activeBgSection === 'projects' && (
        <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-sm text-indigo-300">📂 Gambar Mockup Dikelola Per Item Projek</h5>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Gambar thumbnail dan mockup studi kasus diatur secara spesifik pada masing-masing item projek di tab
              Bahasa (Seksi 8).
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditorMode(editLang);
                setActiveTab('projects');
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Buka Seksi Projek &amp; Studi Kasus</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTEXT 9: CONTACT PAGE */}
      {activeBgSection === 'contact' && (
        <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-sm text-emerald-300">
              ✉️ Tidak Ada Aset Gambar di Halaman Kontak &amp; Footer
            </h5>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Seksi Kontak dirancang bersih dan minimalis dengan fokus pada formulir pesan, kartu sosial media, dan
              informasi narahubung.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditorMode(editLang);
                setActiveTab('contact');
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Buka Seksi Kontak &amp; Sosial Media</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTEXT 10: HOME / HERO SECTION ASSETS (PROFILE & HERO CARD) */}
      {(activeBgSection === 'home' || activeBgSection === '' || activeBgSection === 'hero') && (
        <>
          <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Foto Profil / Avatar Utama</span>
              </div>
              {localData.avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate((prev) => ({ ...prev, avatarScale: 1, avatarX: 0, avatarY: 0 }));
                  }}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Posisi</span>
                </button>
              )}
            </div>

            <div className="flex items-start gap-4">
              {/* Live Avatar Preview */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-800 shrink-0 relative flex items-center justify-center">
                {localData.avatarUrl ? (
                  <img
                    src={localData.avatarUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover transition-transform duration-75"
                    style={{
                      transform: `scale(${localData.avatarScale || 1}) translate(${localData.avatarX || 0}px, ${
                        localData.avatarY || 0
                      }px)`,
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-500" />
                )}
              </div>

              {/* Input & Upload Controls */}
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Gambar Avatar</label>
                  <input
                    type="text"
                    value={localData.avatarUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdate((prev) => ({ ...prev, avatarUrl: val }));
                    }}
                    placeholder="https://... atau unggah file"
                    className={inputClass}
                  />
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow transition-all active:scale-95">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Foto dari Perangkat</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, 'avatarUrl')}
                  />
                </label>
              </div>
            </div>

            {/* Sliders for Avatar Scale, X, Y */}
            {localData.avatarUrl && (
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" /> Zoom:
                    </span>
                    <span className="font-mono text-emerald-400">{(localData.avatarScale || 1).toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={localData.avatarScale || 1}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      handleUpdate((prev) => ({ ...prev, avatarScale: val }));
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Move className="w-3 h-3" /> Geser X:
                    </span>
                    <span className="font-mono text-emerald-400">{localData.avatarX || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={localData.avatarX || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleUpdate((prev) => ({ ...prev, avatarX: val }));
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Move className="w-3 h-3" /> Geser Y:
                    </span>
                    <span className="font-mono text-emerald-400">{localData.avatarY || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={localData.avatarY || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleUpdate((prev) => ({ ...prev, avatarY: val }));
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Foto Hero Beranda */}
          <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5" />
              <span>Foto Hero / Kartu Beranda (Home Image)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400">Foto Hero (Mode Terang)</label>
                <input
                  type="text"
                  value={localData.homeImageUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleUpdate((prev) => ({ ...prev, homeImageUrl: val }));
                  }}
                  placeholder="URL foto mode terang"
                  className={inputClass}
                />
                <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition-all">
                  <Upload className="w-3 h-3 text-purple-400" />
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, 'homeImageUrl')}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400">Foto Hero (Mode Gelap)</label>
                <input
                  type="text"
                  value={localData.homeImageUrlDark || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleUpdate((prev) => ({ ...prev, homeImageUrlDark: val }));
                  }}
                  placeholder="URL foto mode gelap"
                  className={inputClass}
                />
                <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition-all">
                  <Upload className="w-3 h-3 text-purple-400" />
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, 'homeImageUrlDark')}
                  />
                </label>
              </div>
            </div>

            {/* Scale & Position Sliders for Home Image */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Zoom Scale:</span>
                  <span className="font-mono text-purple-400">{(localData.homeImageScale || 1).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={localData.homeImageScale || 1}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    handleUpdate((prev) => ({ ...prev, homeImageScale: val }));
                  }}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Geser X:</span>
                  <span className="font-mono text-purple-400">{localData.homeImageX || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="1"
                  value={localData.homeImageX || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    handleUpdate((prev) => ({ ...prev, homeImageX: val }));
                  }}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Geser Y:</span>
                  <span className="font-mono text-purple-400">{localData.homeImageY || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="1"
                  value={localData.homeImageY || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    handleUpdate((prev) => ({ ...prev, homeImageY: val }));
                  }}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Fade, Circle Size & Position Controls */}
            <div className="pt-2 border-t border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Fade Gambar:
                    </span>
                    <span className="font-mono text-purple-400">
                      {((localData as any).homeImageFade ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={(localData as any).homeImageFade ?? 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      handleUpdate((prev) => ({ ...prev, homeImageFade: val } as any));
                    }}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" /> Lingkaran SVG Scale:
                    </span>
                    <span className="font-mono text-purple-400">
                      {((localData as any).homeImageCircleScale ?? 1).toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={(localData as any).homeImageCircleScale ?? 1}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      handleUpdate((prev) => ({ ...prev, homeImageCircleScale: val } as any));
                    }}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Move className="w-3 h-3" /> Lingkaran Geser X:
                    </span>
                    <span className="font-mono text-purple-400">
                      {(localData as any).homeImageCircleX ?? 0}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="1"
                    value={(localData as any).homeImageCircleX ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleUpdate((prev) => ({ ...prev, homeImageCircleX: val } as any));
                    }}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Move className="w-3 h-3" /> Lingkaran Geser Y:
                    </span>
                    <span className="font-mono text-purple-400">
                      {(localData as any).homeImageCircleY ?? 0}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="1"
                    value={(localData as any).homeImageCircleY ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleUpdate((prev) => ({ ...prev, homeImageCircleY: val } as any));
                    }}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Mask Style Controls */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Gaya Fade Gambar:</span>
                  <span className="font-mono text-purple-400">
                    {(localData.webTexts?.home_image_mask_style || 'normal').replace('_', ' ')}
                  </span>
                </div>
                <select
                  value={localData.webTexts?.home_image_mask_style || 'normal'}
                  onChange={(e) => {
                    handleWebTextChange('home_image_mask_style', e.target.value, editLang);
                  }}
                  className="w-full px-3 py-2 rounded border bg-slate-800/20 text-slate-200 focus:border-emerald-500"
                >
                  <option value="normal">Normal</option>
                  <option value="fade_bottom">Fade Bawah</option>
                  <option value="fade_circle">Fade Lingkaran</option>
                  <option value="fade_edge">Fade Tepi</option>
                  <option value="fade_glow_aura">Fade Aura Glow</option>
                </select>
              </div>

              {/* Fade Depth Control */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Kedalaman Fade:</span>
                  <span className="font-mono text-purple-400">
                    {localData.webTexts?.home_image_fade_depth || '66'}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={parseInt(localData.webTexts?.home_image_fade_depth || '66')}
                  onChange={(e) => {
                    handleWebTextChange('home_image_fade_depth', e.target.value, editLang);
                  }}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Fade Width Control */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Lebar Fade:</span>
                  <span className="font-mono text-purple-400">
                    {localData.webTexts?.home_image_fade_width || '84'}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={parseInt(localData.webTexts?.home_image_fade_width || '84')}
                  onChange={(e) => {
                    handleWebTextChange('home_image_fade_width', e.target.value, editLang);
                  }}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* FALLBACK FOR UNRECOGNIZED SECTIONS */}
      {![
        'about_subpage_education',
        'about_subpage_personality',
        'about_subpage_hobbies',
        'about_subpage_career_goals',
        'about_story',
        'skills',
        'experience',
        'projects',
        'contact',
        'home',
        '',
        'hero',
      ].includes(activeBgSection) &&
        !activeBgSection.startsWith('subpage_') && (
          <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3`}>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400">
              <ImageOff className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-slate-300">Tidak Ada Aset Khusus Untuk Halaman Ini</h5>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Halaman ini tidak memerlukan konfigurasi gambar atau banner khusus. Anda dapat mengatur Pola Background
                SVG atau Warna Tema pada tab di atas.
              </p>
            </div>
          </div>
        )}
    </div>
  );
};
