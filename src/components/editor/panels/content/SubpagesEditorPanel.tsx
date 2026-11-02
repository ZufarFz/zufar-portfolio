import React from 'react';
import { 
  GraduationCap, 
  Smile, 
  Heart, 
  Briefcase, 
  Target, 
  Sparkles, 
  Plus, 
  Trash2, 
  FileText, 
  Languages 
} from 'lucide-react';
import { ContentPanelBaseProps } from '../../types';
import { CustomSubPage } from '../../../../types';

interface SubpagesEditorPanelProps extends ContentPanelBaseProps {
  currentCategory: string;
  getSubpageSections: (pageKey: string) => any[];
  handleAddSubpageSection: (pageKey: string) => void;
  handleRemoveSubpageSection: (baseId: string) => void;
  bilingualEducation: any[];
  bilingualPersonality: any[];
  bilingualHobbies: any[];
  bilingualCareerGoals: any[];
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: any,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void;
  handleAddEducation: () => void;
  handleRemoveEducation: (baseId: string) => void;
  handleAddPersonality: () => void;
  handleRemovePersonality: (baseId: string) => void;
  handleAddHobby: () => void;
  handleRemoveHobby: (baseId: string) => void;
  handleAddCareerGoal: () => void;
  handleRemoveCareerGoal: (baseId: string) => void;
  handleRemoveCustomSubPage: (id: string) => void;
  setSubpageTranslateModalState: (state: any) => void;
}

export const SubpagesEditorPanel: React.FC<SubpagesEditorPanelProps> = ({
  currentCategory,
  localData,
  handleUpdate,
  editLang,
  getWebText,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  inputClass,
  textareaClass,
  cardBg,
  getSubpageSections,
  handleAddSubpageSection,
  handleRemoveSubpageSection,
  bilingualEducation,
  bilingualPersonality,
  bilingualHobbies,
  bilingualCareerGoals,
  updateBilingualItem,
  handleAddEducation,
  handleRemoveEducation,
  handleAddPersonality,
  handleRemovePersonality,
  handleAddHobby,
  handleRemoveHobby,
  handleAddCareerGoal,
  handleRemoveCareerGoal,
  handleRemoveCustomSubPage,
  setSubpageTranslateModalState,
}) => {
  // 1. SUBPAGE: EDUCATION
  if (currentCategory === 'subpage_education') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Halaman Pendidikan ({editLang.toUpperCase()})</span>
          </h4>
          <span className="text-[10px] text-slate-400">Pages Tab Admin</span>
        </div>

        {/* Header & Cover */}
        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            <span>Cover Header Halaman</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400">
                Judul Halaman ({editLang.toUpperCase()})
              </label>
              {renderAiButton(
                'Judul Pendidikan',
                getWebText('education_title', editLang),
                (val) => handleWebTextChange('education_title', val, editLang),
                'Judul seksi riwayat akademik/pendidikan'
              )}
            </div>
            <input
              type="text"
              value={getWebText('education_title', editLang)}
              onChange={(e) => handleWebTextChange('education_title', e.target.value, editLang)}
              placeholder="My Academic & Scientific Foundations"
              className={inputClass}
            />
            {renderColorControls('education_title_color', 'education_title_color_dark', 'Judul Pendidikan')}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400">
                Intro / Pengantar ({editLang.toUpperCase()})
              </label>
              {renderAiButton(
                'Intro Pendidikan',
                getWebText('education_intro', editLang),
                (val) => handleWebTextChange('education_intro', val, editLang),
                'Paragraf pengantar tentang latar belakang akademik dan pondasi keilmuan'
              )}
            </div>
            <textarea
              rows={3}
              value={getWebText('education_intro', editLang)}
              onChange={(e) => handleWebTextChange('education_intro', e.target.value, editLang)}
              placeholder="Tuliskan pengantar pendidikan..."
              className={textareaClass}
            />
            {renderColorControls('education_intro_color', 'education_intro_color_dark', 'Intro Pendidikan', '#475569', '#94a3b8')}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
            <input
              type="text"
              value={localData.webTexts?.education_header_bg || ''}
              onChange={(e) => handleWebTextChange('education_header_bg', e.target.value, 'en')}
              placeholder="https://images.unsplash.com/... atau /banner.jpg"
              className={inputClass}
            />
          </div>
        </div>

        {/* Education Credentials List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Riwayat Gelar &amp; Institusi ({bilingualEducation.length})
            </h5>
            <button
              type="button"
              onClick={handleAddEducation}
              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Gelar</span>
            </button>
          </div>

          {bilingualEducation.map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-400 font-mono">#{idx + 1} Riwayat Gelar</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSubpageTranslateModalState({
                          isOpen: true,
                          pageCategory: 'education',
                          itemBaseId: pair.baseId,
                          sourceLang: editLang,
                          sourceData: {
                            degree: item?.degree || '',
                            institution: item?.institution || '',
                            period: item?.period || '',
                            description: item?.description || '',
                          },
                        });
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Languages className="w-3 h-3" />
                      <span>AI Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(pair.baseId)}
                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Nama Gelar / Jurusan ({editLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={item?.degree || ''}
                    onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'degree', e.target.value)}
                    placeholder="Contoh: B.S. Applied Statistics & Computer Science"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Institusi ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={item?.institution || ''}
                      onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'institution', e.target.value)}
                      placeholder="Universitas"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Tahun / Periode</label>
                    <input
                      type="text"
                      value={item?.period || ''}
                      onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'period', e.target.value)}
                      placeholder="2020 - 2024"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Deskripsi / Keterangan Gelar ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={item?.description || ''}
                    onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'description', e.target.value)}
                    placeholder="Fokus studi, pencapaian akademik, dll..."
                    className={textareaClass}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Education Story Slides */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Lembar Cerita / Slide Sesi ({getSubpageSections('education').length})
            </h5>
            <button
              type="button"
              onClick={() => handleAddSubpageSection('education')}
              className="px-2.5 py-1 rounded bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Slide</span>
            </button>
          </div>

          {getSubpageSections('education').map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-400 font-mono">#{idx + 1} Slide Cerita</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubpageSection(pair.baseId)}
                    className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer"
                    title="Hapus Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Judul Slide ({editLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={item?.title || ''}
                    onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                    placeholder="Judul Slide Cerita"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Konten Narasi ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={3}
                    value={item?.content || ''}
                    onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                    placeholder="Deskripsi cerita mendalam..."
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">URL Gambar Ilustrasi Slide</label>
                  <input
                    type="text"
                    value={item?.imageUrl || ''}
                    onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'imageUrl', e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. SUBPAGE: PERSONALITY
  if (currentCategory === 'subpage_personality') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5" />
            <span>Halaman Kepribadian &amp; Karakter ({editLang.toUpperCase()})</span>
          </h4>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400">Judul Halaman ({editLang.toUpperCase()})</label>
              {renderAiButton(
                'Judul Kepribadian',
                getWebText('personality_title', editLang),
                (val) => handleWebTextChange('personality_title', val, editLang),
                'Judul header untuk halaman kepribadian, nilai kerja, dan pilar karakter profesional.'
              )}
            </div>
            <input
              type="text"
              value={getWebText('personality_title', editLang)}
              onChange={(e) => handleWebTextChange('personality_title', e.target.value, editLang)}
              placeholder="My Core Personality & Work Ethics"
              className={inputClass}
            />
            {renderColorControls('personality_title_color', 'personality_title_color_dark', 'Judul Kepribadian')}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400">Intro / Pengantar ({editLang.toUpperCase()})</label>
              {renderAiButton(
                'Intro Kepribadian',
                getWebText('personality_intro', editLang),
                (val) => handleWebTextChange('personality_intro', val, editLang),
                'Deskripsi pembuka tentang karakter profesional, filosofi kerja, dan prinsip kerja sama tim.'
              )}
            </div>
            <textarea
              rows={3}
              value={getWebText('personality_intro', editLang)}
              onChange={(e) => handleWebTextChange('personality_intro', e.target.value, editLang)}
              placeholder="Tuliskan filosofi personal atau intro karakter..."
              className={textareaClass}
            />
            {renderColorControls('personality_intro_color', 'personality_intro_color_dark', 'Intro Kepribadian', '#475569', '#94a3b8')}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
            <input
              type="text"
              value={localData.webTexts?.personality_header_bg || ''}
              onChange={(e) => handleWebTextChange('personality_header_bg', e.target.value, 'en')}
              className={inputClass}
            />
          </div>
        </div>

        {/* Traits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Pilar Karakter &amp; Nilai ({bilingualPersonality.length})
            </h5>
            <button
              type="button"
              onClick={handleAddPersonality}
              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Karakter</span>
            </button>
          </div>

          {bilingualPersonality.map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-3`}>
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/40">
                  <span className="font-bold text-emerald-400 font-mono text-[11px]">#{idx + 1} Nilai</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePersonality(pair.baseId)}
                    className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Karakter ({editLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={item?.title || ''}
                    onChange={(e) => updateBilingualItem('personality', pair.baseId, editLang, 'title', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Uraian Karakter ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={item?.description || ''}
                    onChange={(e) => updateBilingualItem('personality', pair.baseId, editLang, 'description', e.target.value)}
                    className={textareaClass}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. SUBPAGE: HOBBIES
  if (currentCategory === 'subpage_hobbies') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>Halaman Hobi &amp; Minat ({editLang.toUpperCase()})</span>
          </h4>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400">Judul Halaman ({editLang.toUpperCase()})</label>
              {renderAiButton(
                'Judul Hobi',
                getWebText('hobbies_title', editLang),
                (val) => handleWebTextChange('hobbies_title', val, editLang),
                'Judul header untuk halaman hobi, minat kreatif, dan aktivitas di luar pekerjaan.'
              )}
            </div>
            <input
              type="text"
              value={getWebText('hobbies_title', editLang)}
              onChange={(e) => handleWebTextChange('hobbies_title', e.target.value, editLang)}
              className={inputClass}
            />
            {renderColorControls('hobbies_title_color', 'hobbies_title_color_dark', 'Judul Hobi')}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400">Intro ({editLang.toUpperCase()})</label>
              {renderAiButton(
                'Intro Hobi',
                getWebText('hobbies_intro', editLang),
                (val) => handleWebTextChange('hobbies_intro', val, editLang),
                'Deskripsi pembuka tentang hobi, minat pribadi, dan bagaimana hal tersebut menginspirasi kreativitas.'
              )}
            </div>
            <textarea
              rows={3}
              value={getWebText('hobbies_intro', editLang)}
              onChange={(e) => handleWebTextChange('hobbies_intro', e.target.value, editLang)}
              placeholder="Tuliskan intro seksi hobi..."
              className={textareaClass}
            />
            {renderColorControls('hobbies_intro_color', 'hobbies_intro_color_dark', 'Intro Hobi', '#475569', '#94a3b8')}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
            <input
              type="text"
              value={localData.webTexts?.hobbies_header_bg || ''}
              onChange={(e) => handleWebTextChange('hobbies_header_bg', e.target.value, 'en')}
              className={inputClass}
            />
          </div>
        </div>

        {/* Hobbies Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Daftar Hobi &amp; Minat ({bilingualHobbies.length})
            </h5>
            <button
              type="button"
              onClick={handleAddHobby}
              className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Hobi</span>
            </button>
          </div>

          {bilingualHobbies.map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-400">#{idx + 1} Hobi</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHobby(pair.baseId)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item?.title || ''}
                  onChange={(e) => updateBilingualItem('hobbies', pair.baseId, editLang, 'title', e.target.value)}
                  placeholder="Nama Hobi"
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={item?.description || ''}
                  onChange={(e) => updateBilingualItem('hobbies', pair.baseId, editLang, 'description', e.target.value)}
                  placeholder="Uraian hobi..."
                  className={textareaClass}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. SUBPAGE: CAREER JOURNEY
  if (currentCategory === 'subpage_career_journey') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Halaman Perjalanan Karir ({editLang.toUpperCase()})</span>
          </h4>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Halaman ({editLang.toUpperCase()})</label>
            <input
              type="text"
              value={getWebText('career_journey_title', editLang)}
              onChange={(e) => handleWebTextChange('career_journey_title', e.target.value, editLang)}
              className={inputClass}
            />
            {renderColorControls('career_journey_title_color', 'career_journey_title_color_dark', 'Judul Karir')}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Intro ({editLang.toUpperCase()})</label>
            <textarea
              rows={3}
              value={getWebText('career_journey_intro', editLang)}
              onChange={(e) => handleWebTextChange('career_journey_intro', e.target.value, editLang)}
              className={textareaClass}
            />
            {renderColorControls('career_journey_intro_color', 'career_journey_intro_color_dark', 'Intro Karir', '#475569', '#94a3b8')}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
            <input
              type="text"
              value={localData.webTexts?.career_journey_header_bg || ''}
              onChange={(e) => handleWebTextChange('career_journey_header_bg', e.target.value, 'en')}
              className={inputClass}
            />
          </div>
        </div>

        {/* Story Slides */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Slide Perjalanan Karir ({getSubpageSections('career_journey').length})
            </h5>
            <button
              type="button"
              onClick={() => handleAddSubpageSection('career_journey')}
              className="px-2.5 py-1 rounded bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Slide</span>
            </button>
          </div>

          {getSubpageSections('career_journey').map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-400">#{idx + 1} Slide</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubpageSection(pair.baseId)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item?.title || ''}
                  onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                  placeholder="Judul Slide Karir"
                  className={inputClass}
                />
                <textarea
                  rows={3}
                  value={item?.content || ''}
                  onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                  placeholder="Uraian cerita karir..."
                  className={textareaClass}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. SUBPAGE: CAREER GOALS
  if (currentCategory === 'subpage_career_goals') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Halaman Target &amp; Sasaran Karir ({editLang.toUpperCase()})</span>
          </h4>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Halaman ({editLang.toUpperCase()})</label>
            <input
              type="text"
              value={getWebText('career_goals_title', editLang)}
              onChange={(e) => handleWebTextChange('career_goals_title', e.target.value, editLang)}
              className={inputClass}
            />
            {renderColorControls('career_goals_title_color', 'career_goals_title_color_dark', 'Judul Target Karir')}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Intro ({editLang.toUpperCase()})</label>
            <textarea
              rows={3}
              value={getWebText('career_goals_intro', editLang)}
              onChange={(e) => handleWebTextChange('career_goals_intro', e.target.value, editLang)}
              className={textareaClass}
            />
            {renderColorControls('career_goals_intro_color', 'career_goals_intro_color_dark', 'Intro Target Karir', '#475569', '#94a3b8')}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
            <input
              type="text"
              value={localData.webTexts?.career_goals_header_bg || ''}
              onChange={(e) => handleWebTextChange('career_goals_header_bg', e.target.value, 'en')}
              className={inputClass}
            />
          </div>
        </div>

        {/* Career Goals List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Target Karir ({bilingualCareerGoals.length})
            </h5>
            <button
              type="button"
              onClick={handleAddCareerGoal}
              className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Sasaran</span>
            </button>
          </div>

          {bilingualCareerGoals.map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400">#{idx + 1} Sasaran Karir</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCareerGoal(pair.baseId)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item?.title || ''}
                  onChange={(e) => updateBilingualItem('careerGoals', pair.baseId, editLang, 'title', e.target.value)}
                  placeholder="Sasaran Karir"
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={item?.description || ''}
                  onChange={(e) => updateBilingualItem('careerGoals', pair.baseId, editLang, 'description', e.target.value)}
                  placeholder="Uraian sasaran..."
                  className={textareaClass}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 6. CUSTOM SUBPAGE HANDLER
  if (currentCategory.startsWith('subpage_')) {
    const customPageId = currentCategory.replace('subpage_', '');
    const customPage = (localData.customSubPages || []).find(p => p.id === customPageId) || {
      id: customPageId,
      title: 'Halaman Kustom',
      titleEn: 'Custom Page',
      subtitle: '',
      subtitleEn: '',
      headerBg: '',
      iconName: 'Sparkles',
      showOnStoryPage: true
    };

    const updateCustomPageField = (field: keyof CustomSubPage, val: any) => {
      handleUpdate(prev => {
        const pages = [...(prev.customSubPages || [])];
        const idx = pages.findIndex(p => p.id === customPageId);
        if (idx !== -1) {
          pages[idx] = { ...pages[idx], [field]: val };
        } else {
          pages.push({ ...customPage, [field]: val });
        }
        return { ...prev, customSubPages: pages };
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Halaman Sub-Page: {(editLang === 'id' ? customPage.title : customPage.titleEn) || customPage.title || customPage.id}</span>
          </h4>
          <button
            type="button"
            onClick={() => handleRemoveCustomSubPage(customPageId)}
            className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Hapus Halaman Sub-Page Ini"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus Halaman</span>
          </button>
        </div>

        {/* Header & Settings */}
        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
          <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            <span>Konfigurasi Header &amp; Identitas Halaman</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Judul Halaman ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={editLang === 'id' ? (customPage.title || '') : (customPage.titleEn || customPage.title || '')}
                onChange={(e) => updateCustomPageField(editLang === 'id' ? 'title' : 'titleEn', e.target.value)}
                placeholder="Contoh: Sertifikasi & Lisensi"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Pilih Ikon Halaman
              </label>
              <select
                value={customPage.iconName || 'Sparkles'}
                onChange={(e) => updateCustomPageField('iconName', e.target.value)}
                className={inputClass}
              >
                <option value="Sparkles">✨ Sparkles</option>
                <option value="Award">🏆 Award / Penghargaan</option>
                <option value="BookOpen">📖 BookOpen / Publikasi</option>
                <option value="GraduationCap">🎓 GraduationCap / Pendidikan</option>
                <option value="Briefcase">💼 Briefcase / Karir</option>
                <option value="Heart">❤️ Heart / Minat</option>
                <option value="Cpu">⚡ Cpu / Teknologi</option>
                <option value="Target">🎯 Target / Fokus</option>
                <option value="Smile">😊 Smile / Personal</option>
                <option value="Compass">🧭 Compass / Filosofi</option>
                <option value="LayoutGrid">📂 LayoutGrid / Showcase</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Intro / Deskripsi Pengantar ({editLang.toUpperCase()})
            </label>
            <textarea
              rows={2}
              value={editLang === 'id' ? (customPage.subtitle || '') : (customPage.subtitleEn || customPage.subtitle || '')}
              onChange={(e) => updateCustomPageField(editLang === 'id' ? 'subtitle' : 'subtitleEn', e.target.value)}
              placeholder="Ringkasan penjelasan mengenai isi sub-halaman ini..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              URL Background Banner Cover
            </label>
            <input
              type="text"
              value={customPage.headerBg || ''}
              onChange={(e) => updateCustomPageField('headerBg', e.target.value)}
              placeholder="https://images.unsplash.com/... atau /banner.jpg"
              className={inputClass}
            />
          </div>

          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={customPage.showOnStoryPage !== false}
                onChange={(e) => updateCustomPageField('showOnStoryPage', e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium">Tampilkan di Menu Navigasi &amp; Hub Kisah (About Me)</span>
            </label>
          </div>
        </div>

        {/* Story Slides */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Lembar Cerita / Slide ({getSubpageSections(customPageId).length})
            </h5>
            <button
              type="button"
              onClick={() => handleAddSubpageSection(customPageId)}
              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Slide Cerita</span>
            </button>
          </div>

          {getSubpageSections(customPageId).map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-400">#{idx + 1} Slide Cerita</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubpageSection(pair.baseId)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item?.title || ''}
                  onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                  placeholder="Judul Slide"
                  className={inputClass}
                />
                <textarea
                  rows={3}
                  value={item?.content || ''}
                  onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                  placeholder="Konten narasi cerita..."
                  className={textareaClass}
                />
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">URL Gambar Slide (Opsional)</label>
                  <input
                    type="text"
                    value={item?.imageUrl || ''}
                    onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'imageUrl', e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
