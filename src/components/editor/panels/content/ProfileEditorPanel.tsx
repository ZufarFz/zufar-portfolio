import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { ContentPanelBaseProps } from '../../types';
import { ID_TRANSLATIONS } from '../../../../data/portfolioData';

interface ProfileEditorPanelProps extends ContentPanelBaseProps {
  category: 'hero' | 'general_identity';
}

export const ProfileEditorPanel: React.FC<ProfileEditorPanelProps> = ({
  category,
  localData,
  handleUpdate,
  editLang,
  getWebText,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  inputClass,
  textareaClass,
}) => {
  if (category === 'hero') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hero / Home ({editLang.toUpperCase()})</span>
          </h4>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">
            Sumber Nama Hero
          </label>
          <select
            value={localData.webTexts?.hero_name_source || 'nickname'}
            onChange={(e) => handleWebTextChange('hero_name_source', e.target.value, editLang)}
            className={inputClass}
          >
            <option value="nickname">Nama Panggilan (Nickname)</option>
            <option value="fullname">Nama Lengkap (Full Name)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-400">
              Hero Badge ({editLang.toUpperCase()})
            </label>
            {renderAiButton(
              'Hero Badge',
              getWebText('hero_badge', editLang),
              (val) => handleWebTextChange('hero_badge', val, editLang),
              'Label kredensial singkat, misalnya: SENIOR DATA ANALYST | DECISION SCIENTIST'
            )}
          </div>
          <input
            type="text"
            value={getWebText('hero_badge', editLang)}
            onChange={(e) => handleWebTextChange('hero_badge', e.target.value, editLang)}
            className={inputClass}
          />
          {renderColorControls('hero_badge_color', 'hero_badge_color_dark', 'Hero Badge', '#059669', '#34d399')}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">
            Tahun ({editLang.toUpperCase()})
          </label>
          <input
            type="text"
            value={getWebText('hero_year', editLang)}
            onChange={(e) => handleWebTextChange('hero_year', e.target.value, editLang)}
            className={inputClass}
          />
          {renderColorControls('hero_year_color', 'hero_year_color_dark', 'Tahun', '#64748b', '#94a3b8')}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-400">
              Wilayah / Lokasi ({editLang.toUpperCase()})
            </label>
            {renderAiButton(
              'Wilayah / Lokasi Hero',
              getWebText('hero_location', editLang),
              (val) => handleWebTextChange('hero_location', val, editLang),
              'Lokasi profesional atau status kerja, contoh: Jakarta, Indonesia atau Remote / Hybrid'
            )}
          </div>
          <input
            type="text"
            value={getWebText('hero_location', editLang)}
            onChange={(e) => handleWebTextChange('hero_location', e.target.value, editLang)}
            className={inputClass}
          />
          {renderColorControls('hero_location_color', 'hero_location_color_dark', 'Wilayah', '#64748b', '#94a3b8')}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-400">
              Judul Halaman / Judul Utama Home ({editLang.toUpperCase()})
            </label>
            {renderAiButton(
              'Judul Halaman / Hero',
              getWebText('hero_title', editLang),
              (val) => handleWebTextChange('hero_title', val, editLang),
              'Headline hero yang kuat dan memikat recruiter dalam 3-6 kata (bisa multi-baris)'
            )}
          </div>
          <textarea
            rows={2}
            value={getWebText('hero_title', editLang)}
            onChange={(e) => handleWebTextChange('hero_title', e.target.value, editLang)}
            placeholder="Contoh: Turning Raw Data\ninto Enterprise Decisions"
            className={textareaClass}
          />
          {renderColorControls('hero_title_color', 'hero_title_color_dark', 'Judul Utama Hero', '#0f172a', '#ffffff')}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-400">
              Deskripsi Halaman / Subtitle Home ({editLang.toUpperCase()})
            </label>
            {renderAiButton(
              'Deskripsi Halaman / Subtitle Hero',
              getWebText('hero_subtitle', editLang),
              (val) => handleWebTextChange('hero_subtitle', val, editLang),
              'Paragraf hook pengantar yang menjelaskan value proposition, stack utama, dan keunggulan kompetitif'
            )}
          </div>
          <textarea
            rows={4}
            value={getWebText('hero_subtitle', editLang)}
            onChange={(e) => handleWebTextChange('hero_subtitle', e.target.value, editLang)}
            placeholder="Deskripsi singkat spesialisasi Anda..."
            className={textareaClass}
          />
          {renderColorControls('hero_subtitle_color', 'hero_subtitle_color_dark', 'Deskripsi Hero', '#475569', '#94a3b8')}
        </div>
      </div>
    );
  }

  // category === 'general_identity'
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>Identitas Profil Utama ({editLang.toUpperCase()})</span>
        </h4>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-400 mb-1">Nama Lengkap</label>
        <input
          type="text"
          value={localData.name || ''}
          onChange={(e) => {
            const val = e.target.value;
            handleUpdate(prev => ({ ...prev, name: val }));
          }}
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Job Title / Posisi ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Job Title / Posisi',
            getWebText('title', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).title : localData.title),
            (val) => handleWebTextChange('title', val, editLang),
            'Fokuskan pada spesialisasi data analytics, AI, atau software engineering'
          )}
        </div>
        <input
          type="text"
          value={getWebText('title', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).title : localData.title)}
          onChange={(e) => handleWebTextChange('title', e.target.value, editLang)}
          className={inputClass}
        />
        {renderColorControls('title_color', 'title_color_dark', 'Warna Posisi/Job Title', '#059669', '#34d399')}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Ringkasan Professional / About Me ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Ringkasan Professional / About Me',
            getWebText('aboutMe', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).aboutMe : localData.aboutMe || ''),
            (val) => handleWebTextChange('aboutMe', val, editLang),
            'Ringkasan eksekutif 2-3 kalimat yang menonjolkan keahlian data, pemecahan masalah bisnis, dan nilai tambah'
          )}
        </div>
        <textarea
          rows={5}
          value={getWebText('aboutMe', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).aboutMe : localData.aboutMe || '')}
          onChange={(e) => handleWebTextChange('aboutMe', e.target.value, editLang)}
          className={textareaClass}
        />
        {renderColorControls('aboutMe_color', 'aboutMe_color_dark', 'Warna Ringkasan/About Me', '#475569', '#94a3b8')}
      </div>
    </div>
  );
};
