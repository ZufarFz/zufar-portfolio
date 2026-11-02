import React from 'react';
import { FolderGit2 } from 'lucide-react';
import { ContentPanelBaseProps } from '../../types';

interface ProjectsEditorPanelProps extends ContentPanelBaseProps {
  bilingualProjects: any[];
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: any,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void;
}

export const ProjectsEditorPanel: React.FC<ProjectsEditorPanelProps> = ({
  localData,
  editLang,
  getWebText,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  inputClass,
  textareaClass,
  cardBg,
  bilingualProjects,
  updateBilingualItem,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Case Studies &amp; Projects ({editLang.toUpperCase()})</span>
        </h4>
      </div>

      <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-bold text-slate-400">Judul Section Projects / Halaman Proyek ({editLang.toUpperCase()})</label>
            {renderAiButton(
              'Judul Section Projects',
              getWebText('projects_title', editLang),
              (val) => handleWebTextChange('projects_title', val, editLang),
              'Judul seksi portofolio proyek dan studi kasus pilihan'
            )}
          </div>
          <input
            type="text"
            value={getWebText('projects_title', editLang)}
            onChange={(e) => handleWebTextChange('projects_title', e.target.value, editLang)}
            className={inputClass}
          />
          {renderColorControls('projects_title_color', 'projects_title_color_dark', 'Judul Projects')}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-bold text-slate-400">Subtitle / Deskripsi Section Projects ({editLang.toUpperCase()})</label>
            {renderAiButton(
              'Subtitle Section Projects',
              getWebText('projects_subtitle', editLang),
              (val) => handleWebTextChange('projects_subtitle', val, editLang),
              'Deskripsi pengantar portofolio proyek dan solusi yang telah dibangun'
            )}
          </div>
          <textarea
            rows={2}
            value={getWebText('projects_subtitle', editLang)}
            onChange={(e) => handleWebTextChange('projects_subtitle', e.target.value, editLang)}
            className={textareaClass}
          />
          {renderColorControls('projects_subtitle_color', 'projects_subtitle_color_dark', 'Subtitle Projects', '#475569', '#94a3b8')}
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
          <input
            type="text"
            value={localData.webTexts?.projects_header_bg || ''}
            onChange={(e) => handleWebTextChange('projects_header_bg', e.target.value, 'en')}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 mb-1">📐 Template Layout Kontainer Proyek</label>
          <select
            value={localData.webTexts?.projects_layout_type || 'card_full'}
            onChange={(e) => handleWebTextChange('projects_layout_type', e.target.value, 'en')}
            className={inputClass}
          >
            <option value="card_full">Template 1: Classic Card (Gambar, Judul &amp; Deskripsi)</option>
            <option value="minimal_popup">Template 2: Minimal Card (Gambar &amp; Judul) + Pop-Up Detail</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Template 1 menampilkan deskripsi pada kartu. Template 2 hanya menampilkan Gambar &amp; Judul lalu membuka Pop-Up besar saat diklik.
          </p>
        </div>
      </div>

      {/* Case Studies List */}
      <div className="space-y-4">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
          Daftar Proyek / Studi Kasus ({bilingualProjects.length})
        </h5>
        {bilingualProjects.map((pair, idx) => {
          const item = pair[editLang] || pair.en;
          return (
            <div key={pair.baseId} className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400 font-mono">
                  #{idx + 1} {item?.title || 'Studi Kasus'}
                </span>
              </div>

              {/* Project Images (Up to 3 images) */}
              <div className="space-y-2 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <label className="block text-[11px] font-bold text-slate-300">
                  Foto / Gambar Proyek (Hingga 3 Gambar)
                </label>

                {/* Image 1: Main Banner */}
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-0.5">
                    Gambar 1 — Banner Utama &amp; Kartu Home
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item?.image || ''}
                      placeholder="https://images.unsplash.com/... (Banner Utama)"
                      onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'image', e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    {item?.image && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 shrink-0 bg-slate-950">
                        <img
                          src={item.image}
                          alt="Preview 1"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Image 2: Pop-Up Thumbnail 2 */}
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-0.5">
                    Gambar 2 — Thumbnail Tambahan Mode Pop-Up
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item?.image2 || ''}
                      placeholder="https://images.unsplash.com/... (Gambar 2)"
                      onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'image2', e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    {item?.image2 && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 shrink-0 bg-slate-950">
                        <img
                          src={item.image2}
                          alt="Preview 2"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Image 3: Pop-Up Thumbnail 3 */}
                <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-0.5">
                    Gambar 3 — Thumbnail Tambahan Mode Pop-Up
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item?.image3 || ''}
                      placeholder="https://images.unsplash.com/... (Gambar 3)"
                      onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'image3', e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    {item?.image3 && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 shrink-0 bg-slate-950">
                        <img
                          src={item.image3}
                          alt="Preview 3"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[10px] font-bold text-slate-400">Judul Proyek ({editLang.toUpperCase()})</label>
                  {renderAiButton(
                    'Judul Proyek',
                    item?.title || '',
                    (val) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'title', val),
                    'Judul studi kasus atau proyek portfolio yang menarik perhatian recruiter'
                  )}
                </div>
                <input
                  type="text"
                  value={item?.title || ''}
                  onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'title', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[10px] font-bold text-slate-400">
                    Deskripsi Singkat (Tampil di Home Card) ({editLang.toUpperCase()})
                  </label>
                  {renderAiButton(
                    'Deskripsi Singkat Proyek',
                    item?.shortDescription || '',
                    (val) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'shortDescription', val),
                    `Ringkasan proyek "${item?.title || ''}" dalam 1-2 kalimat padat untuk kartu preview.`
                  )}
                </div>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 1-2 baris untuk kartu halaman utama..."
                  value={item?.shortDescription || ''}
                  onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'shortDescription', e.target.value)}
                  className={textareaClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[10px] font-bold text-slate-400">
                    Deskripsi Lengkap (Tampil di Pop-Up &amp; All Projects) ({editLang.toUpperCase()})
                  </label>
                  {renderAiButton(
                    'Deskripsi Lengkap Proyek',
                    item?.description || '',
                    (val) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'description', val),
                    `Narasi lengkap studi kasus "${item?.title || ''}". Uraikan problem yang diselesaikan, pendekatan analitik/teknis, dan impact bisnis yang dihasilkan.`
                  )}
                </div>
                <textarea
                  rows={4}
                  placeholder="Narasi studi kasus lengkap..."
                  value={item?.description || ''}
                  onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'description', e.target.value)}
                  className={textareaClass}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
