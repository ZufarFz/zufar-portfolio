import React from 'react';
import { Sparkles } from 'lucide-react';
import { AssetTab } from '../types';

interface DrawerAssetTabBarProps {
  assetTab: AssetTab;
  setAssetTab: (tab: AssetTab) => void;
  isDark: boolean;
}

export const DrawerAssetTabBar: React.FC<DrawerAssetTabBarProps> = ({
  assetTab,
  setAssetTab,
  isDark,
}) => {
  return (
    <div
      className={`px-4 py-2 border-b flex items-center justify-between gap-2 text-xs ${
        isDark ? 'border-purple-500/20 bg-purple-950/20' : 'border-purple-200 bg-purple-50/60'
      }`}
    >
      <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Kategori Aset:</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setAssetTab('templates')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'templates'
              ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-sm ring-1 ring-rose-400/50'
              : 'text-rose-400 hover:text-rose-200 bg-rose-950/30'
          }`}
        >
          <span>🎴 Template &amp; Preset</span>
        </button>
        <button
          type="button"
          onClick={() => setAssetTab('bg_patterns')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'bg_patterns'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🌊 Pola Background</span>
        </button>
        <button
          type="button"
          onClick={() => setAssetTab('floating_assets')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'floating_assets'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-400/50'
              : 'text-emerald-400 hover:text-emerald-200 bg-emerald-950/30'
          }`}
        >
          <span>🕊️ Aset Melayang (SVG/Ornamen)</span>
        </button>
        <button
          type="button"
          onClick={() => setAssetTab('bg_shadows')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'bg_shadows'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🌓 Bayangan Gradasi</span>
        </button>
        <button
          type="button"
          onClick={() => setAssetTab('images')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'images'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🖼️ Gambar &amp; Banner</span>
        </button>
        <button
          type="button"
          onClick={() => setAssetTab('bg_colors')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'bg_colors'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🎨 Warna Tema</span>
        </button>
        <button
          type="button"
          onClick={() => setAssetTab('idcard')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'idcard'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🪪 ID Card</span>
        </button>
        <button
          type="button"
          onClick={() => setAssetTab('gooey_cursor')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            assetTab === 'gooey_cursor'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-400/50'
              : 'text-emerald-400 hover:text-emerald-200 bg-emerald-950/30'
          }`}
        >
          <span>✨ Gooey Cursor</span>
        </button>
      </div>
    </div>
  );
};
