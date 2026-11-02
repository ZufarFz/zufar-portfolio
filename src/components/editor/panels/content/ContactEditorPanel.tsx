import React from 'react';
import { Mail } from 'lucide-react';
import { ContentPanelBaseProps } from '../../types';

export const ContactEditorPanel: React.FC<ContentPanelBaseProps> = ({
  editLang,
  getWebText,
  handleWebTextChange,
  renderAiButton,
  renderColorControls,
  inputClass,
  textareaClass,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Section ({editLang.toUpperCase()})</span>
        </h4>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Judul Section Contact ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Judul Section Contact',
            getWebText('contact_title', editLang),
            (val) => handleWebTextChange('contact_title', val, editLang),
            'Judul ajakan untuk berkolaborasi atau menghubungi Anda'
          )}
        </div>
        <input
          type="text"
          value={getWebText('contact_title', editLang)}
          onChange={(e) => handleWebTextChange('contact_title', e.target.value, editLang)}
          className={inputClass}
        />
        {renderColorControls('contact_title_color', 'contact_title_color_dark', 'Judul Contact')}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Subtitle Section Contact ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Subtitle Section Contact',
            getWebText('contact_subtitle', editLang),
            (val) => handleWebTextChange('contact_subtitle', val, editLang),
            'Kalimat undangan ramah dan terbuka untuk diskusi peluang kerja atau proyek'
          )}
        </div>
        <textarea
          rows={3}
          value={getWebText('contact_subtitle', editLang)}
          onChange={(e) => handleWebTextChange('contact_subtitle', e.target.value, editLang)}
          className={textareaClass}
        />
        {renderColorControls('contact_subtitle_color', 'contact_subtitle_color_dark', 'Subtitle Contact', '#475569', '#94a3b8')}
      </div>
    </div>
  );
};

