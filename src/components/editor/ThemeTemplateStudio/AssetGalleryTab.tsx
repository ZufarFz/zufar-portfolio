import React from 'react';
import { Component, Plus, Download, Edit, Trash2 } from 'lucide-react';
import { FloatingAsset } from '../../../types';
import { ThemeSvgAsset } from '../../../data/themeAssets';

interface AssetGalleryTabProps {
  assetsList: ThemeSvgAsset[];
  cardBg: string;
  onOpenAddModal: () => void;
  onDownloadThemeAssets: () => void;
  onOpenEditModal: (asset: ThemeSvgAsset) => void;
  onDeleteAsset: (id: string, name: string) => void;
  onAddSingleAsset: (asset: Partial<FloatingAsset>) => void;
  showFeedback: (msg: string) => void;
}

export const AssetGalleryTab: React.FC<AssetGalleryTabProps> = ({
  assetsList,
  cardBg,
  onOpenAddModal,
  onDownloadThemeAssets,
  onOpenEditModal,
  onDeleteAsset,
  onAddSingleAsset,
  showFeedback
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <Component className="w-4 h-4 text-emerald-400" />
            <span>Katalog Ornamen &amp; Aset SVG Mandiri (termasuk Lingkaran Hero)</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Semua aset disimpan di <code className="text-emerald-400 font-mono">themeAssets.ts</code>. Anda bisa
            menambah, mengedit SVG, atau mengunduh file TypeScript terbaru.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Aset SVG Baru</span>
          </button>

          <button
            type="button"
            onClick={onDownloadThemeAssets}
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
                  onClick={() => onOpenEditModal(item)}
                  className="flex-1 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3 h-3 text-amber-400" />
                  <span>Edit Aset</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteAsset(item.id, item.name)}
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
  );
};
