import React from 'react';
import { 
  Briefcase, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Languages, 
  Copy, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import { ContentPanelBaseProps } from '../../types';
import { ExperiencePeriodEditor } from '../../../ExperiencePeriodEditor';

interface ExperienceEditorPanelProps extends ContentPanelBaseProps {
  bilingualExperiences: any[];
  handleAddExperience: () => void;
  handleMoveExperience: (baseId: string, direction: 'up' | 'down') => void;
  handleDuplicateExperience: (baseId: string) => void;
  handleRemoveExperience: (baseId: string) => void;
  handleUpdateExperienceDates: (baseId: string, updates: any) => void;
  handleManualExperiencePeriodChange: (baseId: string, text: string) => void;
  handleAddBulletPoint: (baseId: string, lang: 'id' | 'en') => void;
  handleRemoveBulletPoint: (baseId: string, lang: 'id' | 'en', index: number) => void;
  handleUpdateBulletPoint: (baseId: string, lang: 'id' | 'en', index: number, text: string) => void;
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: any,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void;
  setExpTranslateModalState: (state: any) => void;
  setJobAiModalState: (state: any) => void;
}

export const ExperienceEditorPanel: React.FC<ExperienceEditorPanelProps> = ({
  editLang,
  isDark,
  getWebText,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  inputClass,
  textareaClass,
  cardBg,
  bilingualExperiences,
  handleAddExperience,
  handleMoveExperience,
  handleDuplicateExperience,
  handleRemoveExperience,
  handleUpdateExperienceDates,
  handleManualExperiencePeriodChange,
  handleAddBulletPoint,
  handleRemoveBulletPoint,
  handleUpdateBulletPoint,
  updateBilingualItem,
  setExpTranslateModalState,
  setJobAiModalState,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experiences Section ({editLang.toUpperCase()})</span>
        </h4>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Judul Section Experience ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Judul Section Experience',
            getWebText('experience_title', editLang),
            (val) => handleWebTextChange('experience_title', val, editLang),
            'Judul seksi pengalaman kerja profesional dan rekam jejak industri'
          )}
        </div>
        <input
          type="text"
          value={getWebText('experience_title', editLang)}
          onChange={(e) => handleWebTextChange('experience_title', e.target.value, editLang)}
          className={inputClass}
        />
        {renderColorControls('experience_title_color', 'experience_title_color_dark', 'Judul Experience')}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Subtitle Section Experience ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Subtitle Section Experience',
            getWebText('experience_subtitle', editLang),
            (val) => handleWebTextChange('experience_subtitle', val, editLang),
            'Deskripsi singkat pengantar rekam jejak karir dan pencapaian profesional'
          )}
        </div>
        <textarea
          rows={2}
          value={getWebText('experience_subtitle', editLang)}
          onChange={(e) => handleWebTextChange('experience_subtitle', e.target.value, editLang)}
          className={textareaClass}
        />
        {renderColorControls('experience_subtitle_color', 'experience_subtitle_color_dark', 'Subtitle Experience', '#475569', '#94a3b8')}
      </div>

      {/* Daftar Pengalaman Kerja & Poin-poin */}
      <div className="pt-2 border-t border-slate-700/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Daftar Pengalaman Kerja ({bilingualExperiences.length})</span>
            </h5>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Kelola posisi, perusahaan, periode, tools, dan rincian poin-poin pencapaian kerja.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddExperience}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pengalaman</span>
          </button>
        </div>

        {bilingualExperiences.length === 0 ? (
          <div className={`p-6 rounded-xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Briefcase className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-300">Belum Ada Riwayat Pengalaman Kerja</p>
            <p className="text-[11px] text-slate-500 mt-1 mb-3">Klik tombol di bawah untuk menambahkan pengalaman kerja pertama Anda.</p>
            <button
              type="button"
              onClick={handleAddExperience}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengalaman Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bilingualExperiences.map((pair, idx) => {
              const item = pair[editLang] || pair.en;
              const bullets: string[] = item?.bulletPoints || [];
              const tools: string[] = item?.tools || [];

              return (
                <div
                  key={pair.baseId}
                  className={`p-4 rounded-xl border ${cardBg} space-y-3.5 transition-all shadow-sm`}
                >
                  {/* Header Item */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-slate-200">
                          {item?.role || 'Posisi Pekerjaan'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {item?.company || 'Perusahaan'} • {item?.period || 'Periode'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveExperience(pair.baseId, 'up')}
                        title={idx === 0 ? 'Sudah berada di posisi paling atas' : 'Pindah ke Atas (Urutkan Lebih Awal)'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          idx === 0
                            ? 'opacity-25 cursor-not-allowed text-slate-500'
                            : 'hover:bg-slate-700/50 text-slate-400 hover:text-emerald-400'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === bilingualExperiences.length - 1}
                        onClick={() => handleMoveExperience(pair.baseId, 'down')}
                        title={idx === bilingualExperiences.length - 1 ? 'Sudah berada di posisi paling bawah' : 'Pindah ke Bawah (Urutkan Lebih Akhir)'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          idx === bilingualExperiences.length - 1
                            ? 'opacity-25 cursor-not-allowed text-slate-500'
                            : 'hover:bg-slate-700/50 text-slate-400 hover:text-emerald-400'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExpTranslateModalState({
                            isOpen: true,
                            experienceBaseId: pair.baseId,
                            sourceLang: editLang,
                            sourceData: {
                              role: item?.role || '',
                              company: item?.company || '',
                              period: item?.period || '',
                              bulletPoints: bullets,
                            },
                          });
                        }}
                        title={`Transfer & terjemahkan item pekerjaan ini ke bahasa ${editLang === 'id' ? 'Inggris (EN)' : 'Indonesia (ID)'} via AI`}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 hover:text-white border border-purple-500/30 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Languages className="w-3.5 h-3.5 text-purple-400" />
                        <span>Transfer ke {editLang === 'id' ? 'EN' : 'ID'} (AI)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateExperience(pair.baseId)}
                        title="Duplikat Pengalaman"
                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(pair.baseId)}
                        title="Hapus Pengalaman"
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Visibilitas Penampilan */}
                  <div className="flex flex-wrap items-center gap-4 p-2.5 rounded-lg bg-slate-900/40 border border-slate-700/30">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visibilitas:</span>
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item?.showOnHome !== false && item?.showOnWeb !== false}
                        onChange={(e) => {
                          updateBilingualItem('experiences', pair.baseId, editLang, 'showOnHome', e.target.checked);
                          updateBilingualItem('experiences', pair.baseId, editLang, 'showOnWeb', e.target.checked);
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span>Tampilkan di Home / Web</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item?.showOnCV !== false}
                        onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'showOnCV', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span>Tampilkan di CV</span>
                    </label>
                  </div>

                  {/* Form Input Utama */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Posisi / Job Role ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={item?.role || ''}
                        onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'role', e.target.value)}
                        placeholder="Contoh: Senior Data Engineer"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Nama Perusahaan
                      </label>
                      <input
                        type="text"
                        value={item?.company || ''}
                        onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'company', e.target.value)}
                        placeholder="Contoh: PT Teknologi Bangsa"
                        className={inputClass}
                      />
                    </div>

                    {/* Pengaturan Tanggal & Periode Waktu */}
                    <ExperiencePeriodEditor
                      item={item}
                      pairBaseId={pair.baseId}
                      editLang={editLang}
                      onDateChange={handleUpdateExperienceDates}
                      onManualTextChange={handleManualExperiencePeriodChange}
                      inputClass={inputClass}
                    />

                    {/* Tools / Tags */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Tools / Tech Stack (Dipisahkan Koma)
                      </label>
                      <input
                        type="text"
                        value={tools.join(', ')}
                        onChange={(e) => {
                          const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateBilingualItem('experiences', pair.baseId, editLang, 'tools', parsed);
                        }}
                        placeholder="Python, SQL, Apache Kafka, BigQuery"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* POIN-POIN PENGALAMAN (BULLET POINTS) */}
                  <div className="pt-2 border-t border-slate-700/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <span>Poin-Poin Pencapaian &amp; Tanggung Jawab ({bullets.length})</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 uppercase">
                          {editLang.toUpperCase()}
                        </span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setJobAiModalState({
                              isOpen: true,
                              experienceBaseId: pair.baseId,
                              role: item?.role || '',
                              company: item?.company || '',
                              existingBullets: bullets,
                            })
                          }
                          className="text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 flex items-center gap-1.5 py-1 px-2.5 rounded-lg shadow-sm border border-purple-400/30 transition-all cursor-pointer"
                          title="Jelaskan pekerjaan Anda dan AI akan merumuskan poin-poin pencapaian dengan variasi rekomendasi"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>✨ AI Rumuskan Poin Pekerjaan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddBulletPoint(pair.baseId, editLang)}
                          className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 py-1 px-2 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Manual</span>
                        </button>
                      </div>
                    </div>

                    {bullets.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic py-1">
                        Belum ada rincian poin. Klik "✨ AI Rumuskan Poin Pekerjaan" untuk menceritakan tugas Anda, atau klik "+ Tambah Manual".
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {bullets.map((point, pIdx) => (
                          <div key={pIdx} className="p-2.5 rounded-lg border border-slate-700/40 bg-slate-900/30 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                                <span className="text-emerald-400">•</span> Poin #{pIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBulletPoint(pair.baseId, editLang, pIdx)}
                                title="Hapus Poin Ini"
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={point}
                              onChange={(e) => handleUpdateBulletPoint(pair.baseId, editLang, pIdx, e.target.value)}
                              placeholder={`Poin pencapaian #${pIdx + 1}...`}
                              className={`${textareaClass} text-[11px] leading-relaxed w-full`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
