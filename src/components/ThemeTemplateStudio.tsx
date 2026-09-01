import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  LayoutGrid, 
  Check, 
  Layers, 
  Sun, 
  Moon, 
  Plus, 
  Info, 
  Flame, 
  Bookmark, 
  CheckCircle2, 
  Paintbrush, 
  Component,
  Download,
  Edit,
  Trash2,
  Upload,
  Code,
  X,
  FileCode
} from 'lucide-react';
import { CVData, FloatingAsset } from '../types';
import { HERO_THEME_TEMPLATES, ThemeTemplate } from '../data/themeTemplates';
import { HERO_LAYOUT_TEMPLATES, PROJECTS_LAYOUT_TEMPLATES, LayoutTemplate } from '../data/layoutTemplates';
import { 
  INITIAL_THEME_SVG_ASSETS, 
  ThemeSvgAsset, 
  generateThemeAssetsTsCode 
} from '../data/themeAssets';

interface ThemeTemplateStudioProps {
  cvData: CVData;
  activeSection: string;
  isDark: boolean;
  onApplyTheme: (patch: Record<string, string>, themeAccent?: string) => void;
  onApplyLayout: (layout: LayoutTemplate) => void;
  onApplyFullZenPreset: () => void;
  onAddSingleAsset: (asset: Partial<FloatingAsset>) => void;
}

export const ThemeTemplateStudio: React.FC<ThemeTemplateStudioProps> = ({
  cvData,
  activeSection,
  isDark,
  onApplyTheme,
  onApplyLayout,
  onApplyFullZenPreset,
  onAddSingleAsset
}) => {
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<'themes' | 'layouts' | 'assets_gallery'>('themes');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Gallery Assets State
  const [assetsList, setAssetsList] = useState<ThemeSvgAsset[]>(INITIAL_THEME_SVG_ASSETS);
  
  // Modal State untuk Tambah & Edit Aset SVG
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  
  // Form State untuk Aset SVG
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ThemeSvgAsset['category']>('custom');
  const [formDescription, setFormDescription] = useState('');
  const [formSvgCode, setFormSvgCode] = useState('');
  const [formDefaultWidth, setFormDefaultWidth] = useState<number>(300);
  const [formDefaultLayer, setFormDefaultLayer] = useState<'bg' | 'above_image'>('bg');
  const [uploadFileName, setUploadFileName] = useState<string>('');

  const showFeedback = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
  const isHeroSection = activeSection === 'home' || activeSection === 'hero';

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingAssetId(null);
    setFormName('');
    setFormCategory('circle');
    setFormDescription('');
    setFormSvgCode('');
    setFormDefaultWidth(350);
    setFormDefaultLayer('bg');
    setUploadFileName('');
    setInputMode('upload');
    setIsAssetModalOpen(true);
  };

  const handleOpenEditModal = (asset: ThemeSvgAsset) => {
    setEditingAssetId(asset.id);
    setFormName(asset.name);
    setFormCategory(asset.category);
    setFormDescription(asset.description);
    setFormSvgCode(asset.svg);
    setFormDefaultWidth(asset.defaultWidth || 300);
    setFormDefaultLayer(asset.defaultLayer || 'bg');
    setUploadFileName('');
    setInputMode('paste');
    setIsAssetModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    if (!formName) {
      const cleanName = file.name.replace(/\.svg$/i, '').replace(/[-_]/g, ' ');
      setFormName(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setFormSvgCode(content.trim());
      }
    };
    reader.readAsText(file);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSvgCode.trim()) {
      alert('Mohon isi nama aset dan pastikan kode SVG tidak kosong!');
      return;
    }

    if (editingAssetId) {
      // Update existing asset
      setAssetsList(prev => prev.map(item => {
        if (item.id === editingAssetId) {
          return {
            ...item,
            name: formName.trim(),
            category: formCategory,
            description: formDescription.trim(),
            svg: formSvgCode.trim(),
            defaultWidth: Number(formDefaultWidth) || 300,
            defaultLayer: formDefaultLayer
          };
        }
        return item;
      }));
      showFeedback(`Aset SVG "${formName}" berhasil diperbarui!`);
    } else {
      // Add new asset
      const newAsset: ThemeSvgAsset = {
        id: `custom_svg_${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim(),
        svg: formSvgCode.trim(),
        defaultWidth: Number(formDefaultWidth) || 300,
        defaultLayer: formDefaultLayer
      };
      setAssetsList(prev => [newAsset, ...prev]);
      showFeedback(`Aset SVG baru "${formName}" berhasil ditambahkan ke katalog!`);
    }

    setIsAssetModalOpen(false);
  };

  const handleDeleteAsset = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aset "${name}" dari katalog?`)) {
      setAssetsList(prev => prev.filter(a => a.id !== id));
      showFeedback(`Aset "${name}" telah dihapus.`);
    }
  };

  // Download themeAssets.ts file
  const handleDownloadThemeAssets = () => {
    const fileContent = generateThemeAssetsTsCode(assetsList);
    const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'themeAssets.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback('File themeAssets.ts berhasil diunduh ke komputer!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Section Indicator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/60 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎴</span>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <span>Studio Template &amp; Preset Desain</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Tahap 1: Khusus Profil / Hero
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-300">
            Pilih template tema warna, layout, atau kelola katalog Aset SVG &amp; Lingkaran Hero secara mandiri.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-700/80 text-[11px] font-mono">
          <span className="text-slate-400">Target:</span>
          <span className="font-bold text-amber-400">
            {isHeroSection ? '🏠 Halaman Profil / Hero' : `📄 ${activeSection.toUpperCase()}`}
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">Tersimpan ke State Aktif</span>
        </div>
      )}

      {/* Sub Category Selector: Themes | Layouts | SVG Assets Gallery */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTemplateCategory('themes')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTemplateCategory === 'themes'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>🎨 Template Tema Warna</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTemplateCategory('layouts')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTemplateCategory === 'layouts'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>📐 Template Layout</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTemplateCategory('assets_gallery')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTemplateCategory === 'assets_gallery'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Component className="w-3.5 h-3.5" />
          <span>🏯 Galeri Aset SVG</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 1. TEMPLATE TEMA WARNA (COLOR PALETTES & MOTIF) */}
      {/* =================================================================== */}
      {activeTemplateCategory === 'themes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilihan Palet Tema Warna untuk Halaman Profil:</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              {HERO_THEME_TEMPLATES.length} Template Siap Pakai
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {HERO_THEME_TEMPLATES.map((tmpl) => {
              const isAsahi = tmpl.id === 'hero-asahi-tsukimi';
              const currentBg = cvData.webTexts?.home_bg_color || cvData.webTexts?.hero_bg_color;
              const isCurrentActive = currentBg === tmpl.palette.light.background;

              return (
                <div
                  key={tmpl.id}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${cardBg} ${
                    isCurrentActive ? 'ring-2 ring-purple-500/80 border-purple-500/50' : 'hover:border-slate-700'
                  }`}
                >
                  {isCurrentActive && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold font-mono flex items-center gap-1">
                      <Check className="w-3 h-3 text-purple-400" />
                      <span>Sedang Aktif</span>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                        {tmpl.previewIcon || '🎨'}
                      </span>
                      <div>
                        <h5 className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span>{tmpl.name}</span>
                          {isAsahi && (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                              ⭐ BARU / JAPANESE ZEN
                            </span>
                          )}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{tmpl.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          <Sun className="w-3 h-3" /> Mode Terang
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.light.background }} title="Background" />
                          <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.light.textPrimary }} title="Text" />
                          <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.light.accent }} title="Accent" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                          <Moon className="w-3 h-3" /> Mode Gelap
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.dark.background }} title="Background" />
                          <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.dark.textPrimary }} title="Text" />
                          <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: tmpl.palette.dark.accent }} title="Accent" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyTheme(tmpl.webTextsPatch, tmpl.themeAccent);
                        showFeedback(`Template Tema "${tmpl.name}" berhasil diterapkan!`);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                    >
                      <Paintbrush className="w-4 h-4" />
                      <span>Gunakan Tema Warna Ini</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. TEMPLATE LAYOUT (TATA LETAK) */}
      {/* =================================================================== */}
      {/* 2. TEMPLATE LAYOUT (TATA LETAK HERO & PROJECTS) */}
      {/* =================================================================== */}
      {activeTemplateCategory === 'layouts' && (
        <div className="space-y-6">
          {/* Section 1: Projects Layout Templates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
                <span>Blueprint Layout Seksi Projects / Case Studies:</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">
                {PROJECTS_LAYOUT_TEMPLATES.length} Blueprint Layout
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {PROJECTS_LAYOUT_TEMPLATES.map((layout) => {
                const isCurrentActive = cvData.webTexts?.projects_layout_type === layout.webTextsConfig?.projects_layout_type || (layout.id === 'projects-classic-card' && (!cvData.webTexts?.projects_layout_type || cvData.webTexts?.projects_layout_type === 'card_full'));
                return (
                  <div
                    key={layout.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3.5 ${cardBg} ${isCurrentActive ? 'border-emerald-500/80 ring-1 ring-emerald-500/30' : 'hover:border-emerald-500/50'}`}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                          {layout.previewIcon || '🖼️'}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-sm text-white flex items-center gap-2">
                            <span>{layout.name}</span>
                            {isCurrentActive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                                Aktif
                              </span>
                            )}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">{layout.description}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyLayout(layout);
                        showFeedback(`Template Layout "${layout.name}" diterapkan ke Seksi Projects!`);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 ${
                        isCurrentActive 
                          ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isCurrentActive ? 'Terpasang di Projects' : 'Gunakan Layout Ini'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Hero Layout Templates */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
                <span>Blueprint Layout Halaman Profil / Hero:</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">
                {HERO_LAYOUT_TEMPLATES.length} Blueprint Layanan
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {HERO_LAYOUT_TEMPLATES.map((layout) => (
                <div
                  key={layout.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3.5 ${cardBg} hover:border-blue-500/50`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                      {layout.previewIcon || '📐'}
                    </span>
                    <div>
                      <h5 className="font-extrabold text-sm text-white">{layout.name}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{layout.description}</p>
                    </div>
                  </div>

                  {layout.floatingAssets.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        Aset Melayang Terpasang ({layout.floatingAssets.length} Item):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {layout.floatingAssets.map((ast) => (
                          <span key={ast.id} className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                            {ast.name} ({ast.layer === 'bg' ? 'Layer Belakang' : 'Layer Depan'})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onApplyLayout(layout);
                      showFeedback(`Template Layout "${layout.name}" berhasil diterapkan ke profil!`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                  >
                    <Check className="w-4 h-4" />
                    <span>Gunakan Layout Ini</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. GALERI ASET SVG MANDIRI & KATALOG CIRCLE (THEMEASSETS.TS) */}
      {/* =================================================================== */}
      {activeTemplateCategory === 'assets_gallery' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Component className="w-4 h-4 text-emerald-400" />
                <span>Katalog Ornamen &amp; Aset SVG Mandiri (termasuk Lingkaran Hero)</span>
              </h4>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Semua aset disimpan di <code className="text-emerald-400 font-mono">themeAssets.ts</code>. Anda bisa menambah, mengedit SVG, atau mengunduh file TypeScript terbaru.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Aset SVG Baru</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadThemeAssets}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                title="Download file themeAssets.ts terbaru yang berisi semua aset SVG pengguna"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download themeAssets.ts</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {assetsList.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-3 ${cardBg} hover:border-emerald-500/50 transition-all group`}
              >
                <div className="space-y-2">
                  {/* SVG Live Preview Box */}
                  <div className="w-full h-28 rounded-xl bg-slate-950/90 border border-slate-800 p-2 flex items-center justify-center overflow-hidden relative group-hover:border-slate-700 transition-colors">
                    <div
                      className="w-full h-full flex items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:object-contain"
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-[9px] font-mono text-slate-300">
                      {item.category.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h6 className="font-bold text-xs text-white flex items-center justify-between gap-1">
                      <span className="truncate">{item.name}</span>
                    </h6>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      onAddSingleAsset({
                        id: `asset_${item.id}_${Date.now()}`,
                        name: item.name,
                        section: 'home',
                        type: 'svg',
                        content: item.svg,
                        width: item.defaultWidth || 350,
                        x: 50,
                        y: 50,
                        layer: item.defaultLayer || 'bg',
                        opacity: 0.95,
                        animation: 'float'
                      });
                      showFeedback(`Aset "${item.name}" berhasil ditambahkan ke seksi profil!`);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Profil</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="flex-1 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-amber-400" />
                      <span>Edit Aset</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAsset(item.id, item.name)}
                      className="py-1 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[10px] font-bold border border-rose-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Hapus Aset dari Katalog"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL FORM TAMBAH / EDIT ASET SVG */}
      {/* =================================================================== */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {editingAssetId ? 'Edit Aset SVG' : 'Tambah Aset SVG Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAssetModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4">
              {/* Option Mode Input SVG */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300">
                  Cara Memasukkan Kode SVG:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      inputMode === 'upload'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File .SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputMode('paste')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      inputMode === 'paste'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Paste Kode SVG Manual</span>
                  </button>
                </div>
              </div>

              {/* Upload Input */}
              {inputMode === 'upload' && (
                <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-2">
                  <Upload className="w-7 h-7 text-emerald-400 mx-auto" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Pilih File SVG dari Komputer</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Mendukung format gambar vector .svg</span>
                  </div>
                  <input
                    type="file"
                    accept=".svg"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                  />
                  {uploadFileName && (
                    <p className="text-[10px] text-emerald-400 font-mono">File terpilih: {uploadFileName}</p>
                  )}
                </div>
              )}

              {/* Paste Textarea */}
              {(inputMode === 'paste' || formSvgCode) && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Kode String SVG (&lt;svg...&gt;):
                  </label>
                  <textarea
                    rows={5}
                    value={formSvgCode}
                    onChange={(e) => setFormSvgCode(e.target.value)}
                    placeholder="<svg viewBox='0 0 500 500'...></svg>"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 font-mono text-[11px] text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Live Preview Box */}
              {formSvgCode && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Live Preview Aset:
                  </label>
                  <div className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center overflow-hidden">
                    <div
                      className="w-full h-full flex items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:object-contain"
                      dangerouslySetInnerHTML={{ __html: formSvgCode }}
                    />
                  </div>
                </div>
              )}

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Aset:</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="contoh: Lingkaran Neon Blue"
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Kategori Aset:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
                  >
                    <option value="circle">⭕ Circle / Lingkaran Hero</option>
                    <option value="japanese">🎴 Japanese / Zen</option>
                    <option value="geometric">🔷 Geometric / Abstract</option>
                    <option value="minimal">✨ Minimalist</option>
                    <option value="custom">⚙️ Custom Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Ukuran Default (Width px):</label>
                  <input
                    type="number"
                    value={formDefaultWidth}
                    onChange={(e) => setFormDefaultWidth(parseInt(e.target.value) || 300)}
                    placeholder="350"
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Posisi Layer Default:</label>
                  <select
                    value={formDefaultLayer}
                    onChange={(e) => setFormDefaultLayer(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
                  >
                    <option value="bg">🖼️ Layer Belakang (Background)</option>
                    <option value="above_image">✨ Layer Depan (Above Image)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Deskripsi Singkat:</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Keterangan singkat tentang ornamen aset ini..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  {editingAssetId ? 'Simpan Perubahan' : 'Tambahkan Aset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeTemplateStudio;
