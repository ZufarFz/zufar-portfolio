import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  FolderPlus, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  Search, 
  Copy 
} from 'lucide-react';
import { motion } from 'motion/react';
import { ContentPanelBaseProps } from '../../types';
import { SkillItem, SkillCategory } from '../../../../types';
import TechLogo from '../../../common/TechLogo';
import { DEFAULT_SKILL_CATEGORIES, getBilingualPairs } from '../../editorUtils';

interface SkillsEditorPanelProps extends ContentPanelBaseProps {
  updateBilingualItem: <T extends { id?: string | number }>(
    listKey: any,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => void;
  updateBilingualSkillSvg: (baseId: string, customSvg: string, svgUrl: string) => void;
}

export const SkillsEditorPanel: React.FC<SkillsEditorPanelProps> = ({
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
  updateBilingualItem,
  updateBilingualSkillSvg,
}) => {
  const [isManagingSkillCats, setIsManagingSkillCats] = useState<boolean>(false);
  const [newCatIdInput, setNewCatIdInput] = useState<string>('');
  const [newCatLabelInput, setNewCatLabelInput] = useState<string>('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatLabel, setEditingCatLabel] = useState<string>('');
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>('');

  const bilingualSkills = useMemo(() => {
    return getBilingualPairs<SkillItem>(
      localData.skills,
      (baseId) => ({ id: `${baseId}-en`, name: 'Skill Name', category: 'tools', icon: 'Terminal', description: '', showOnWeb: true, showOnCV: true }),
      (baseId) => ({ id: `${baseId}-id`, name: 'Nama Keahlian', category: 'tools', icon: 'Terminal', description: '', showOnWeb: true, showOnCV: true })
    );
  }, [localData.skills]);

  const allSkillCategories = useMemo(() => {
    const customList = localData.skillCategories || [];
    const list = DEFAULT_SKILL_CATEGORIES.map(def => {
      const customOverride = customList.find(c => c.id.toLowerCase() === def.id.toLowerCase());
      if (customOverride) {
        return {
          id: def.id,
          label: (editLang === 'id' ? customOverride.labelId : customOverride.labelEn) || customOverride.label || (editLang === 'id' ? def.labelId : def.labelEn),
          isDefault: true,
          isCustom: false
        };
      }
      return {
        id: def.id,
        label: editLang === 'id' ? def.labelId : def.labelEn,
        isDefault: true,
        isCustom: false
      };
    });

    customList.forEach(custom => {
      if (!list.some(item => item.id.toLowerCase() === custom.id.toLowerCase())) {
        list.push({
          id: custom.id,
          label: (editLang === 'id' ? custom.labelId : custom.labelEn) || custom.label || custom.id,
          isDefault: false,
          isCustom: true
        });
      }
    });

    return list;
  }, [localData.skillCategories, editLang]);

  const handleAddSkillCategory = () => {
    if (!newCatLabelInput.trim()) return;
    const autoId = (newCatIdInput.trim() || newCatLabelInput.trim()).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const existing = localData.skillCategories || [];
    if (existing.some(c => c.id.toLowerCase() === autoId) || DEFAULT_SKILL_CATEGORIES.some(c => c.id.toLowerCase() === autoId)) {
      alert(editLang === 'id' ? 'ID Kategori sudah ada. Silakan gunakan ID lain.' : 'Category ID already exists. Please choose a different ID.');
      return;
    }

    const newCat: SkillCategory = {
      id: autoId,
      label: newCatLabelInput.trim(),
      labelId: newCatLabelInput.trim(),
      labelEn: newCatLabelInput.trim()
    };

    handleUpdate(prev => ({
      ...prev,
      skillCategories: [...(prev.skillCategories || []), newCat]
    }));

    setNewCatIdInput('');
    setNewCatLabelInput('');
  };

  const handleSaveEditSkillCategory = () => {
    if (!editingCatId || !editingCatLabel.trim()) return;

    handleUpdate(prev => {
      const existing = prev.skillCategories || [];
      const isDefault = DEFAULT_SKILL_CATEGORIES.some(d => d.id.toLowerCase() === editingCatId.toLowerCase());

      if (isDefault) {
        const foundIdx = existing.findIndex(c => c.id.toLowerCase() === editingCatId.toLowerCase());
        if (foundIdx >= 0) {
          const updated = [...existing];
          updated[foundIdx] = {
            ...updated[foundIdx],
            label: editingCatLabel.trim(),
            labelId: editLang === 'id' ? editingCatLabel.trim() : updated[foundIdx].labelId,
            labelEn: editLang === 'en' ? editingCatLabel.trim() : updated[foundIdx].labelEn
          };
          return { ...prev, skillCategories: updated };
        } else {
          const newOverride: SkillCategory = {
            id: editingCatId,
            label: editingCatLabel.trim(),
            labelId: editLang === 'id' ? editingCatLabel.trim() : editingCatLabel.trim(),
            labelEn: editLang === 'en' ? editingCatLabel.trim() : editingCatLabel.trim()
          };
          return { ...prev, skillCategories: [...existing, newOverride] };
        }
      } else {
        const updated = existing.map(c => {
          if (c.id.toLowerCase() === editingCatId.toLowerCase()) {
            return {
              ...c,
              label: editingCatLabel.trim(),
              labelId: editLang === 'id' ? editingCatLabel.trim() : c.labelId,
              labelEn: editLang === 'en' ? editingCatLabel.trim() : c.labelEn
            };
          }
          return c;
        });
        return { ...prev, skillCategories: updated };
      }
    });

    setEditingCatId(null);
    setEditingCatLabel('');
  };

  const handleDeleteSkillCategory = (catId: string) => {
    if (confirm(editLang === 'id' ? 'Hapus kategori skill ini?' : 'Delete this skill category?')) {
      handleUpdate(prev => ({
        ...prev,
        skillCategories: (prev.skillCategories || []).filter(c => c.id.toLowerCase() !== catId.toLowerCase())
      }));
    }
  };

  const handleAddSkill = () => {
    const baseId = `skill-${Date.now()}`;
    const enItem: SkillItem = {
      id: `${baseId}-en`,
      name: 'New Skill',
      category: 'tools',
      icon: 'Terminal',
      description: 'Skill description for About Me page...',
      showOnWeb: true,
      showOnCV: true
    };
    const idItem: SkillItem = {
      id: `${baseId}-id`,
      name: 'Keahlian Baru',
      category: 'tools',
      icon: 'Terminal',
      description: 'Deskripsi keahlian untuk halaman About Me...',
      showOnWeb: true,
      showOnCV: true
    };
    handleUpdate(prev => ({
      ...prev,
      skills: [...(prev.skills || []), enItem, idItem]
    }));
  };

  const handleRemoveSkill = (baseId: string) => {
    handleUpdate(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => 
        s.id !== `${baseId}-en` && s.id !== `${baseId}-id` && s.id !== baseId
      )
    }));
  };

  const handleDuplicateSkill = (baseId: string) => {
    const pair = bilingualSkills.find(p => p.baseId === baseId);
    if (!pair) return;
    const newBaseId = `skill-${Date.now()}`;
    const enItem: SkillItem = {
      ...(pair.en || { id: `${baseId}-en`, name: 'Skill', category: 'tools', icon: 'Terminal', description: '' }),
      id: `${newBaseId}-en`,
      name: `${pair.en?.name || 'Skill'} (Copy)`
    };
    const idItem: SkillItem = {
      ...(pair.id || { id: `${baseId}-id`, name: 'Keahlian', category: 'tools', icon: 'Terminal', description: '' }),
      id: `${newBaseId}-id`,
      name: `${pair.id?.name || 'Keahlian'} (Salinan)`
    };

    handleUpdate(prev => ({
      ...prev,
      skills: [...(prev.skills || []), enItem, idItem]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>Technical Arsenal ({editLang.toUpperCase()})</span>
        </h4>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Judul Section Skills ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Judul Section Skills',
            getWebText('skills_title', editLang),
            (val) => handleWebTextChange('skills_title', val, editLang),
            'Judul seksi keahlian teknis, stack teknologi, dan competencies'
          )}
        </div>
        <input
          type="text"
          value={getWebText('skills_title', editLang)}
          onChange={(e) => handleWebTextChange('skills_title', e.target.value, editLang)}
          className={inputClass}
        />
        {renderColorControls('skills_title_color', 'skills_title_color_dark', 'Judul Skills')}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Subtitle Section Skills ({editLang.toUpperCase()})</label>
          {renderAiButton(
            'Subtitle Section Skills',
            getWebText('skills_subtitle', editLang),
            (val) => handleWebTextChange('skills_subtitle', val, editLang),
            'Deskripsi singkat penguasaan tools, bahasa pemrograman, dan metodologi kerja'
          )}
        </div>
        <textarea
          rows={2}
          value={getWebText('skills_subtitle', editLang)}
          onChange={(e) => handleWebTextChange('skills_subtitle', e.target.value, editLang)}
          className={textareaClass}
        />
        {renderColorControls('skills_subtitle_color', 'skills_subtitle_color_dark', 'Subtitle Skills', '#475569', '#94a3b8')}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-400">Deskripsi Ringkasan Kategori (Di bawah Emblem Lingkaran Home)</label>
          {renderAiButton(
            'Deskripsi Ringkasan Kategori Skills',
            getWebText('skills_home_group_desc', editLang),
            (val) => handleWebTextChange('skills_home_group_desc', val, editLang),
            'Penjelasan singkat pengelompokan skill di halaman beranda'
          )}
        </div>
        <textarea
          rows={2}
          value={getWebText('skills_home_group_desc', editLang)}
          onChange={(e) => handleWebTextChange('skills_home_group_desc', e.target.value, editLang)}
          placeholder="Dikelompokkan jadi beberapa kategori: yang mengolah data, menjalankan otomasi, dan visualisasi..."
          className={textareaClass}
        />
        {renderColorControls('skills_home_group_desc_color', 'skills_home_group_desc_color_dark', 'Deskripsi Ringkasan Kategori', '#475569', '#94a3b8')}
      </div>

      {/* SKILL CATEGORY MANAGER */}
      <div className={`p-3.5 rounded-xl border ${cardBg} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FolderPlus className="w-3.5 h-3.5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-200">
                Kelola Kategori Keahlian ({allSkillCategories.length})
              </h5>
              <p className="text-[10px] text-slate-400">
                Tambah kategori baru atau ubah nama kategori yang ada
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsManagingSkillCats(!isManagingSkillCats)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{isManagingSkillCats ? 'Tutup Pengaturan' : 'Atur Kategori'}</span>
            {isManagingSkillCats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {isManagingSkillCats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 pt-2 border-t border-slate-800"
          >
            {/* Add Category Form */}
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10.5px] font-bold text-emerald-400 flex items-center gap-1">
                <Plus className="w-3 h-3" />
                <span>Tambah Kategori Baru</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newCatLabelInput}
                  onChange={(e) => setNewCatLabelInput(e.target.value)}
                  placeholder="Nama Kategori (mis: Cloud & DevOps)"
                  className={inputClass}
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newCatIdInput}
                    onChange={(e) => setNewCatIdInput(e.target.value)}
                    placeholder="ID Kategori (opsional/otomatis)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkillCategory}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer shrink-0 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Existing Categories List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Daftar Kategori Aktif
              </span>
              {allSkillCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  {editingCatId === cat.id ? (
                    <div className="flex-1 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingCatLabel}
                        onChange={(e) => setEditingCatLabel(e.target.value)}
                        className={inputClass}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleSaveEditSkillCategory}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                        title="Simpan Nama Kategori"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                        title="Batal"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-slate-200 truncate">{cat.label}</span>
                        <span className="text-[9.5px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                          {cat.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatLabel(cat.label);
                          }}
                          className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded cursor-pointer"
                          title="Ubah Nama Kategori"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {cat.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSkillCategory(cat.id)}
                            className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer"
                            title="Hapus Kategori Kustom"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Skills Management List */}
      <div className="space-y-3 pt-3 border-t border-slate-700/50">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Daftar Keahlian ({bilingualSkills.length})
          </h5>
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah Skill Baru</span>
          </button>
        </div>

        {bilingualSkills.length > 5 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              placeholder="Cari keahlian berdasarkan nama..."
              className={`${inputClass} pl-8`}
            />
          </div>
        )}

        {bilingualSkills
          .filter(pair => {
            if (!skillSearchQuery.trim()) return true;
            const q = skillSearchQuery.toLowerCase();
            return (
              pair.en?.name?.toLowerCase().includes(q) ||
              pair.id?.name?.toLowerCase().includes(q) ||
              pair.en?.category?.toLowerCase().includes(q)
            );
          })
          .map((pair, idx) => {
            const item = pair[editLang] || pair.en;
            return (
              <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5 relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-emerald-400 font-mono">
                    #{idx + 1} {item?.name || 'Untitled Skill'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicateSkill(pair.baseId)}
                      className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded cursor-pointer transition-colors"
                      title="Duplikat Skill Ini"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(pair.baseId)}
                      className="text-rose-400 hover:text-rose-300 p-1 text-xs cursor-pointer hover:bg-rose-950/30 rounded transition-colors"
                      title="Hapus Skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Nama Keahlian ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={item?.name || ''}
                      onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'name', e.target.value)}
                      placeholder="e.g. SQL, Python, React..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Kategori</label>
                    <select
                      value={item?.category || 'tools'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__add_new__') {
                          setIsManagingSkillCats(true);
                        } else {
                          updateBilingualItem('skills', pair.baseId, editLang, 'category', val);
                        }
                      }}
                      className={inputClass}
                    >
                      {allSkillCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label} ({cat.id})
                        </option>
                      ))}
                      <option value="__add_new__">➕ Tambah Kategori Baru...</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-slate-400">
                      Custom SVG String / URL Logo (Opsional)
                    </label>
                    {(item?.customSvg || item?.svgUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          updateBilingualSkillSvg(pair.baseId, '', '');
                        }}
                        className="text-[9.5px] text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        Hapus Kustom
                      </button>
                    )}
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                      <TechLogo
                        name={item?.name || ''}
                        iconName={item?.icon}
                        customSvg={item?.customSvg}
                        svgUrl={item?.svgUrl}
                        size={24}
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={item?.customSvg || item?.svgUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.trim().startsWith('<svg') || val.trim().startsWith('<?xml') || val.trim().includes('<svg')) {
                          updateBilingualSkillSvg(pair.baseId, val, '');
                        } else {
                          updateBilingualSkillSvg(pair.baseId, '', val);
                        }
                      }}
                      placeholder="Paste kode <svg>...</svg> lengkap, atau URL gambar .svg/.png. Kosongkan untuk logo otomatis..."
                      className={`${textareaClass} font-mono text-[10.5px] leading-tight`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Penjelasan / Deskripsi ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={item?.description || ''}
                    onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'description', e.target.value)}
                    placeholder="Deskripsi keahlian, teknologi terkait, pemakaian..."
                    className={textareaClass}
                  />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item?.showOnWeb !== false}
                      onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'showOnWeb', e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span>Tampilkan di Web</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item?.showOnCV !== false}
                      onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'showOnCV', e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span>Tampilkan di CV</span>
                  </label>
                </div>
              </div>
            );
          })}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleAddSkill}
            className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Skill Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
