import React, { useState } from 'react';
import { Palette, LayoutGrid, Component, CheckCircle2 } from 'lucide-react';
import { ThemeTemplateStudioProps } from './types';
import { ThemeTemplatesTab } from './ThemeTemplatesTab';
import { LayoutTemplatesTab } from './LayoutTemplatesTab';
import { AssetGalleryTab } from './AssetGalleryTab';
import { SvgAssetModal } from './SvgAssetModal';
import { 
  INITIAL_THEME_SVG_ASSETS, 
  ThemeSvgAsset, 
  generateThemeAssetsTsCode 
} from '../../../data/themeAssets';

export const ThemeTemplateStudio: React.FC<ThemeTemplateStudioProps> = ({
  cvData,
  activeSection,
  isDark,
  onApplyTheme,
  onApplyLayout,
  onAddSingleAsset
}) => {
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<'themes' | 'layouts' | 'assets_gallery'>('themes');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Gallery Assets State
  const [assetsList, setAssetsList] = useState<ThemeSvgAsset[]>(INITIAL_THEME_SVG_ASSETS);
  
  // Modal State untuk Tambah & Edit Aset SVG
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
  const isHeroSection = activeSection === 'home' || activeSection === 'hero';

  const handleOpenAddModal = () => {
    setEditingAssetId(null);
    setIsAssetModalOpen(true);
  };

  const handleOpenEditModal = (asset: ThemeSvgAsset) => {
    setEditingAssetId(asset.id);
    setIsAssetModalOpen(true);
  };

  const handleSaveAsset = (data: {
    name: string;
    category: ThemeSvgAsset['category'];
    description: string;
    svg: string;
    defaultWidth: number;
    defaultLayer: 'bg' | 'above_image';
  }) => {
    if (editingAssetId) {
      setAssetsList(prev => prev.map(item => {
        if (item.id === editingAssetId) {
          return {
            ...item,
            ...data
          };
        }
        return item;
      }));
      showFeedback(`Aset SVG "${data.name}" berhasil diperbarui!`);
    } else {
      const newAsset: ThemeSvgAsset = {
        id: `custom_svg_${Date.now()}`,
        ...data
      };
      setAssetsList(prev => [newAsset, ...prev]);
      showFeedback(`Aset SVG baru "${data.name}" berhasil ditambahkan ke katalog!`);
    }
    setIsAssetModalOpen(false);
  };

  const handleDeleteAsset = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aset "${name}" dari katalog?`)) {
      setAssetsList(prev => prev.filter(a => a.id !== id));
      showFeedback(`Aset "${name}" telah dihapus.`);
    }
  };

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

  const editingAsset = editingAssetId ? assetsList.find(a => a.id === editingAssetId) || null : null;

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

      {/* 1. Theme Templates Tab */}
      {activeTemplateCategory === 'themes' && (
        <ThemeTemplatesTab
          cvData={cvData}
          cardBg={cardBg}
          onApplyTheme={onApplyTheme}
          showFeedback={showFeedback}
        />
      )}

      {/* 2. Layout Templates Tab */}
      {activeTemplateCategory === 'layouts' && (
        <LayoutTemplatesTab
          cvData={cvData}
          cardBg={cardBg}
          onApplyLayout={onApplyLayout}
          showFeedback={showFeedback}
        />
      )}

      {/* 3. Assets Gallery Tab */}
      {activeTemplateCategory === 'assets_gallery' && (
        <AssetGalleryTab
          assetsList={assetsList}
          cardBg={cardBg}
          onOpenAddModal={handleOpenAddModal}
          onDownloadThemeAssets={handleDownloadThemeAssets}
          onOpenEditModal={handleOpenEditModal}
          onDeleteAsset={handleDeleteAsset}
          onAddSingleAsset={onAddSingleAsset}
          showFeedback={showFeedback}
        />
      )}

      {/* SVG Modal */}
      <SvgAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        editingAsset={editingAsset}
        onSave={handleSaveAsset}
      />
    </div>
  );
};

export default ThemeTemplateStudio;

