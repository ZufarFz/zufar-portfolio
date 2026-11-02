import React from 'react';
import { CVData, FloatingAsset } from '../../../../types';
import {
  Sparkles,
  Plus,
  Smartphone,
  Monitor,
  Smile,
  Trash2,
  Upload,
  Brush,
  Copy,
  Layers,
  Play,
  Clock,
} from 'lucide-react';

interface FloatingAssetsPanelProps {
  localData: CVData;
  activeDeviceMode: 'desktop' | 'mobile';
  handleSetDeviceMode: (mode: 'desktop' | 'mobile') => void;
  handleAddFloatingAsset: (preset?: Partial<FloatingAsset>) => void;
  handleUpdateFloatingAsset: (id: string, field: string, value: any) => void;
  handleRemoveFloatingAsset: (id: string) => void;
  handleCopyFromDesktop: (id: string) => void;
  uploadFileToStorage: (file: File) => Promise<string>;
  cardBg: string;
  inputClass: string;
}

export const FloatingAssetsPanel: React.FC<FloatingAssetsPanelProps> = ({
  localData,
  activeDeviceMode,
  handleSetDeviceMode,
  handleAddFloatingAsset,
  handleUpdateFloatingAsset,
  handleRemoveFloatingAsset,
  handleCopyFromDesktop,
  uploadFileToStorage,
  cardBg,
  inputClass,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kelola Aset Melayang (SVG, Burung, Ornamen, Stiker)</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Tambahkan ornamen visual melayang (burung SVG, bintang, logo, dll) di seksi tertentu atau seluruh halaman.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddFloatingAsset()}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Aset</span>
        </button>
      </div>

      {/* DEDICATED PREVIEW VIEWPORT TOGGLE: DESKTOP vs MOBILE */}
      <div
        className={`p-3.5 rounded-xl border transition-all ${
          activeDeviceMode === 'mobile'
            ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
            : 'bg-blue-500/10 border-blue-500/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {activeDeviceMode === 'mobile' ? (
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Monitor className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span className="text-xs font-bold text-slate-100">
                Mode Posisi &amp; Ukuran:{' '}
                <span className={activeDeviceMode === 'mobile' ? 'text-amber-300 font-extrabold' : 'text-blue-300 font-extrabold'}>
                  {activeDeviceMode === 'mobile' ? '📱 Khusus Mobile (HP)' : '💻 Desktop (Komputer)'}
                </span>
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 leading-snug">
              {activeDeviceMode === 'mobile'
                ? 'Layar dialihkan ke Simulator Smartphone Asli (iPhone 15 Pro, Galaxy S24). Media query CSS, susunan kartu, dan koordinat mobile aktif 100% persis seperti di HP fisik.'
                : 'Layar preview dalam ukuran penuh desktop. Nilai koordinat & ukuran di bawah ini berlaku untuk pengunjung di layar laptop / komputer.'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => handleSetDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeDeviceMode === 'desktop'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeDeviceMode === 'mobile'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (HP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fast Presets Box */}
      <div className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5`}>
        <span className="text-[11px] font-bold text-slate-300 block">
          🚀 Templat Cepat Aset Melayang:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() =>
              handleAddFloatingAsset({
                name: '🕊️ Burung Terbang',
                type: 'svg',
                content:
                  '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z" fill="currentColor"/></svg>',
                color: '#3b82f6',
                width: 90,
                animation: 'float',
                x: 82,
                y: 18,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            🕊️ + Burung Terbang
          </button>
          <button
            type="button"
            onClick={() =>
              handleAddFloatingAsset({
                name: '⭐ Bintang Sparkle',
                type: 'svg',
                content:
                  '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L61 38 L100 50 L61 62 L50 100 L39 62 L0 50 L39 38 Z" fill="currentColor"/></svg>',
                color: '#eab308',
                width: 60,
                animation: 'pulse',
                x: 12,
                y: 15,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            ⭐ + Bintang Sparkle
          </button>
          <button
            type="button"
            onClick={() =>
              handleAddFloatingAsset({
                name: '🚀 Roket Melayang',
                type: 'svg',
                content:
                  '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 5 C30 25 25 60 25 80 L50 70 L75 80 C75 60 70 25 50 5 Z" fill="currentColor"/><circle cx="50" cy="40" r="10" fill="#ffffff" opacity="0.8"/></svg>',
                color: '#ef4444',
                width: 80,
                animation: 'bounce',
                x: 88,
                y: 70,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            🚀 + Roket Melayang
          </button>
          <button
            type="button"
            onClick={() =>
              handleAddFloatingAsset({
                name: '🌸 Bunga Origami',
                type: 'svg',
                content:
                  '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="15" fill="currentColor"/><circle cx="50" cy="20" r="18" fill="currentColor" opacity="0.8"/><circle cx="80" cy="50" r="18" fill="currentColor" opacity="0.8"/><circle cx="50" cy="80" r="18" fill="currentColor" opacity="0.8"/><circle cx="20" cy="50" r="18" fill="currentColor" opacity="0.8"/></svg>',
                color: '#ec4899',
                width: 70,
                animation: 'spin',
                x: 10,
                y: 80,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            🌸 + Bunga Sakura
          </button>
          <button
            type="button"
            onClick={() =>
              handleAddFloatingAsset({
                name: '⚡ Sirkuit Tech (Link File)',
                type: 'url',
                content: '/svg/accessories/circuit-tech.svg',
                width: 120,
                animation: 'none',
                x: 85,
                y: 85,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            ⚡ + Sirkuit Tech (URL)
          </button>
        </div>
      </div>

      {/* Active Floating Assets List */}
      {!localData.floatingAssets || localData.floatingAssets.length === 0 ? (
        <div className={`p-8 rounded-xl border text-center ${cardBg} space-y-2`}>
          <Smile className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
          <p className="text-xs text-slate-300 font-bold">Belum Ada Aset Melayang</p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Klik button <strong>"Tambah Aset"</strong> atau pilih salah satu templat cepat di atas untuk langsung menambahkan ornamen burung SVG / stiker melayang di halaman web Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {localData.floatingAssets.map((asset, index) => {
            const isRawSvg = asset.type === 'svg' || (asset.content && asset.content.trim().startsWith('<svg'));
            return (
              <div
                key={asset.id}
                className={`p-4 rounded-xl border ${cardBg} space-y-4 relative group border-emerald-500/30 hover:border-emerald-500/60 transition-all`}
              >
                {/* Asset Card Header */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={asset.name}
                      onChange={(e) => handleUpdateFloatingAsset(asset.id, 'name', e.target.value)}
                      className="bg-transparent font-bold text-xs text-slate-200 border-b border-transparent hover:border-slate-700 focus:border-emerald-500 outline-none px-1 py-0.5 transition-all w-full max-w-[200px]"
                      placeholder="Nama Aset..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isRawSvg
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {isRawSvg ? '🎨 Raw SVG (Bisa Edit Warna)' : '🔗 Link URL (Fitur Warna Mati)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFloatingAsset(asset.id)}
                      className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-all cursor-pointer"
                      title="Hapus Aset ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form Input Row 1: Target Halaman & Tipe Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                      Target Halaman / Seksi:
                    </label>
                    <select
                      value={asset.section}
                      onChange={(e) => handleUpdateFloatingAsset(asset.id, 'section', e.target.value)}
                      className={inputClass}
                    >
                      <option value="home">Hero / Home (Seksi Depan)</option>
                      <option value="projects">Case Studies (Proyek)</option>
                      <option value="skills">Technical Arsenal (Skills)</option>
                      <option value="experience">Professional Journey (Pengalaman)</option>
                      <option value="contact">Contact Matrix (Kontak)</option>
                      <option value="about_story">Kisah Saya (About Story)</option>
                      <option value="about_subpage_education">Subpage: Education Degree</option>
                      <option value="about_subpage_personality">Subpage: Personality</option>
                      <option value="about_subpage_hobbies">Subpage: Hobbies</option>
                      <option value="about_subpage_career_goals">Subpage: Career Goals</option>
                      {(localData.customSubPages || []).map((p) => (
                        <option key={p.id} value={`about_subpage_${p.id}`}>
                          Subpage: {p.title}
                        </option>
                      ))}
                      <option value="all">🌐 Tampilkan di Semua Halaman</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                      Tipe Sumber Aset:
                    </label>
                    <select
                      value={isRawSvg ? 'svg' : 'url'}
                      onChange={(e) => {
                        const newType = e.target.value as 'svg' | 'url';
                        handleUpdateFloatingAsset(asset.id, 'type', newType);
                        if (newType === 'svg' && (!asset.content || !asset.content.trim().startsWith('<svg'))) {
                          handleUpdateFloatingAsset(
                            asset.id,
                            'content',
                            '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z" fill="currentColor"/></svg>'
                          );
                        }
                      }}
                      className={inputClass}
                    >
                      <option value="svg">Raw Kode &lt;svg&gt; (Fitur Edit Warna Aktif)</option>
                      <option value="url">Link URL Gambar / SVG (Edit Warna Mati Otomatis)</option>
                    </select>
                  </div>
                </div>

                {/* Form Input Row 2: Content (Raw SVG String or URL Link) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10.5px] font-bold text-slate-300">
                      {isRawSvg ? 'Kode <svg> Aset (Burung, Stiker, Logo):' : 'Link URL File Aset / Gambar:'}
                    </label>
                    <label className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-700">
                      <Upload className="w-3 h-3 text-emerald-400" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*,.svg"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.name.endsWith('.svg')) {
                            const text = await file.text();
                            if (text.includes('<svg')) {
                              handleUpdateFloatingAsset(asset.id, 'type', 'svg');
                              handleUpdateFloatingAsset(asset.id, 'content', text);
                              return;
                            }
                          }
                          const uploadedUrl = await uploadFileToStorage(file);
                          if (uploadedUrl) {
                            handleUpdateFloatingAsset(asset.id, 'type', 'url');
                            handleUpdateFloatingAsset(asset.id, 'content', uploadedUrl);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {isRawSvg ? (
                    <textarea
                      value={asset.content}
                      onChange={(e) => handleUpdateFloatingAsset(asset.id, 'content', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-emerald-300 focus:outline-none focus:border-emerald-500 transition-all resize-y"
                      placeholder='<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>'
                    />
                  ) : (
                    <input
                      type="text"
                      value={asset.content}
                      onChange={(e) => handleUpdateFloatingAsset(asset.id, 'content', e.target.value)}
                      className={inputClass}
                      placeholder="https://... atau /svg/accessories/bird.svg"
                    />
                  )}
                </div>

                {/* Form Input Row 3: WARNA ASET (Smart Status: Disabled for URL) */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    isRawSvg
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                        <Brush className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Warna Aset (SVG Fill Color)</span>
                      </label>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {isRawSvg
                          ? 'Pilih warna kustom untuk disuntikkan ke dalam atribut fill kode SVG.'
                          : '🔒 Fitur edit warna otomatis mati karena aset menggunakan link URL / file eksternal.'}
                      </p>
                    </div>

                    {isRawSvg && (
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="color"
                          value={asset.color || '#3b82f6'}
                          onChange={(e) => handleUpdateFloatingAsset(asset.id, 'color', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={asset.color || '#3b82f6'}
                          onChange={(e) => handleUpdateFloatingAsset(asset.id, 'color', e.target.value)}
                          className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-[11px] text-slate-200 text-center"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Input Row 4: Sliders Posisi X & Y, Ukuran, Opasitas (Responsive Desktop vs Mobile) */}
                {(() => {
                  const isMobileMode = activeDeviceMode === 'mobile';
                  const curX = isMobileMode ? (asset.mobileX !== undefined ? asset.mobileX : asset.x) : asset.x;
                  const curY = isMobileMode ? (asset.mobileY !== undefined ? asset.mobileY : asset.y) : asset.y;
                  const curWidth = isMobileMode
                    ? asset.mobileWidth !== undefined
                      ? asset.mobileWidth
                      : asset.width || 80
                    : asset.width || 80;
                  const curOpacity = isMobileMode
                    ? asset.mobileOpacity !== undefined
                      ? asset.mobileOpacity
                      : asset.opacity ?? 0.8
                    : asset.opacity ?? 0.8;
                  const curRotation = isMobileMode
                    ? asset.mobileRotation !== undefined
                      ? asset.mobileRotation
                      : asset.rotation || 0
                    : asset.rotation || 0;
                  const curFlipX = isMobileMode
                    ? asset.mobileFlipX !== undefined
                      ? asset.mobileFlipX
                      : asset.flipX || false
                    : asset.flipX || false;
                  const accentColor = isMobileMode ? 'accent-amber-500' : 'accent-emerald-500';
                  const valColor = isMobileMode ? 'text-amber-400' : 'text-emerald-400';

                  return (
                    <div className="space-y-3 pt-1">
                      {/* Mobile/Desktop Contextual Badge & Actions */}
                      <div
                        className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-2 ${
                          isMobileMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isMobileMode ? (
                            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <div>
                            <p className={`text-[11px] font-bold ${isMobileMode ? 'text-amber-300' : 'text-slate-200'}`}>
                              {isMobileMode ? 'Pengaturan Posisi Khusus Mobile (HP)' : 'Pengaturan Posisi Mode Desktop'}
                            </p>
                            <p className="text-[9.5px] text-slate-400">
                              {isMobileMode
                                ? 'Koordinat X, Y, & ukuran ini hanya aktif di layar smartphone.'
                                : 'Koordinat X, Y, & ukuran ini aktif di layar laptop / komputer.'}
                            </p>
                          </div>
                        </div>

                        {isMobileMode && (
                          <button
                            type="button"
                            onClick={() => handleCopyFromDesktop(asset.id)}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                            title="Salin koordinat posisi dan ukuran saat ini dari mode desktop"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin dari Desktop</span>
                          </button>
                        )}
                      </div>

                      {/* Hide on Mobile / Desktop Toggles */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[10.5px]">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white">
                          <input
                            type="checkbox"
                            checked={asset.hideOnMobile || false}
                            onChange={(e) => handleUpdateFloatingAsset(asset.id, 'hideOnMobile', e.target.checked)}
                            className="accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer"
                          />
                          <span>🚫 Sembunyikan di HP (Mobile)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white">
                          <input
                            type="checkbox"
                            checked={asset.hideOnDesktop || false}
                            onChange={(e) => handleUpdateFloatingAsset(asset.id, 'hideOnDesktop', e.target.checked)}
                            className="accent-blue-500 w-3.5 h-3.5 rounded cursor-pointer"
                          />
                          <span>🚫 Sembunyikan di Desktop</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Posisi Horizontal X (%) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                            <span>Posisi X (Horizontal):</span>
                            <span className={`font-mono ${valColor}`}>{curX}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={curX}
                            onChange={(e) =>
                              handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', parseInt(e.target.value, 10))
                            }
                            className={`w-full ${accentColor} cursor-pointer`}
                          />
                          <div className="flex justify-between text-[9px] text-slate-500">
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', 10)}
                              className="hover:text-amber-400"
                            >
                              Kiri (10%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', 50)}
                              className="hover:text-amber-400"
                            >
                              Tengah (50%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', 85)}
                              className="hover:text-amber-400"
                            >
                              Kanan (85%)
                            </button>
                          </div>
                        </div>

                        {/* Posisi Vertikal Y (%) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                            <span>Posisi Y (Vertikal):</span>
                            <span className={`font-mono ${valColor}`}>{curY}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={curY}
                            onChange={(e) =>
                              handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', parseInt(e.target.value, 10))
                            }
                            className={`w-full ${accentColor} cursor-pointer`}
                          />
                          <div className="flex justify-between text-[9px] text-slate-500">
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', 15)}
                              className="hover:text-amber-400"
                            >
                              Atas (15%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', 50)}
                              className="hover:text-amber-400"
                            >
                              Tengah (50%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', 85)}
                              className="hover:text-amber-400"
                            >
                              Bawah (85%)
                            </button>
                          </div>
                        </div>

                        {/* Ukuran Lebar (Width in px) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <span>Ukuran Lebar:</span>
                              {isMobileMode ? (
                                <span className="text-[9px] text-amber-400 font-normal bg-amber-950/40 px-1 rounded border border-amber-500/20">
                                  📱 Mobile Pixel
                                </span>
                              ) : (
                                <span className="text-[9px] text-emerald-400 font-normal bg-emerald-950/40 px-1 rounded border border-emerald-500/20">
                                  ⚡ Responsif Layar
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={10}
                                max={2000}
                                value={curWidth}
                                onChange={(e) =>
                                  handleUpdateFloatingAsset(
                                    asset.id,
                                    isMobileMode ? 'mobileWidth' : 'width',
                                    parseInt(e.target.value, 10) || 80
                                  )
                                }
                                className={`w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] ${valColor} text-right focus:outline-none`}
                              />
                              <span className="text-[10px] text-slate-400 font-mono">px</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={15}
                            max={isMobileMode ? 600 : 1200}
                            step={5}
                            value={curWidth}
                            onChange={(e) =>
                              handleUpdateFloatingAsset(
                                asset.id,
                                isMobileMode ? 'mobileWidth' : 'width',
                                parseInt(e.target.value, 10)
                              )
                            }
                            className={`w-full ${accentColor} cursor-pointer`}
                          />
                          {/* Quick Size Presets */}
                          <div className="flex flex-wrap gap-1 text-[9.5px]">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateFloatingAsset(
                                  asset.id,
                                  isMobileMode ? 'mobileWidth' : 'width',
                                  isMobileMode ? 40 : 60
                                )
                              }
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                            >
                              Kecil ({isMobileMode ? '40px' : '60px'})
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateFloatingAsset(
                                  asset.id,
                                  isMobileMode ? 'mobileWidth' : 'width',
                                  isMobileMode ? 80 : 150
                                )
                              }
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                            >
                              Sedang ({isMobileMode ? '80px' : '150px'})
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateFloatingAsset(
                                  asset.id,
                                  isMobileMode ? 'mobileWidth' : 'width',
                                  isMobileMode ? 140 : 350
                                )
                              }
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                            >
                              Besar ({isMobileMode ? '140px' : '350px'})
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateFloatingAsset(
                                  asset.id,
                                  isMobileMode ? 'mobileWidth' : 'width',
                                  isMobileMode ? 220 : 650
                                )
                              }
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                            >
                              Ekstra ({isMobileMode ? '220px' : '650px'})
                            </button>
                          </div>
                        </div>

                        {/* Opasitas (Transparency) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                            <span>Opasitas Transparansi:</span>
                            <span className={`font-mono ${valColor}`}>{Math.round(curOpacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min={0.1}
                            max={1}
                            step={0.05}
                            value={curOpacity}
                            onChange={(e) =>
                              handleUpdateFloatingAsset(
                                asset.id,
                                isMobileMode ? 'mobileOpacity' : 'opacity',
                                parseFloat(e.target.value)
                              )
                            }
                            className={`w-full ${accentColor} cursor-pointer`}
                          />
                        </div>
                      </div>

                      {/* Form Input Row 4.5: POSISI LAPISAN (LAYER DEPTH / STACK ORDER) */}
                      <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 space-y-2">
                        <label className="text-[10.5px] font-bold text-slate-200 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Posisi Lapisan (Layer Stacking Order):</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {asset.layer === 'bg'
                              ? 'Layer #1 (Background)'
                              : asset.layer === 'above_all'
                              ? 'Layer #3 (Top Foreground)'
                              : 'Layer #2 (Di Atas Gambar)'}
                          </span>
                        </label>
                        <select
                          value={asset.layer || (asset.zIndex === 2 ? 'bg' : asset.zIndex === 30 ? 'above_all' : 'above_image')}
                          onChange={(e) => {
                            const newLayer = e.target.value as 'bg' | 'above_image' | 'above_all';
                            handleUpdateFloatingAsset(asset.id, 'layer', newLayer);
                            if (newLayer === 'bg') handleUpdateFloatingAsset(asset.id, 'zIndex', 2);
                            else if (newLayer === 'above_image') handleUpdateFloatingAsset(asset.id, 'zIndex', 8);
                            else if (newLayer === 'above_all') handleUpdateFloatingAsset(asset.id, 'zIndex', 30);
                          }}
                          className={inputClass}
                        >
                          <option value="bg">🥉 Setara Background (Di atas Pattern, Di bawah Gambar/Avatar &amp; Tulisan)</option>
                          <option value="above_image">🥈 Di atas Gambar &amp; Lingkaran Avatar (Di bawah Tulisan / Text)</option>
                          <option value="above_all">🥇 Di atas Semua Konten (Di atas Gambar &amp; Di atas Tulisan / Judul)</option>
                        </select>
                        <p className="text-[10px] text-slate-400">
                          {asset.layer === 'bg' &&
                            '✨ Aset berada pas di atas pattern background, di bawah semua gambar profil dan tulisan.'}
                          {(asset.layer === 'above_image' || (!asset.layer && asset.zIndex !== 2 && asset.zIndex !== 30)) &&
                            '✨ Aset berada di atas lingkaran/foto avatar, namun teks dan judul utama tetap berada di atasnya agar terbaca sempurna.'}
                          {asset.layer === 'above_all' &&
                            '✨ Aset berada di paling depan melayang melintasi tulisan dan gambar.'}
                        </p>
                      </div>

                      {/* Form Input Row 5: PENGATURAN ANIMASI LENGKAP */}
                      <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 space-y-3 pt-3">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Pengaturan Animasi &amp; Gerakan (Motion Settings):</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const curDur = asset.entryDuration || 1500;
                                handleUpdateFloatingAsset(asset.id, 'entryDuration', curDur === 1500 ? 1501 : 1500);
                              }}
                              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
                              title="Klik untuk memutar ulang animasi masuk pada preview langsung"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Uji Animasi</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* 1. Animasi Masuk */}
                          <div>
                            <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                              ✨ Animasi Masuk (Entry Animation):
                            </label>
                            <select
                              value={asset.entryAnimation || 'none'}
                              onChange={(e) => handleUpdateFloatingAsset(asset.id, 'entryAnimation', e.target.value)}
                              className={inputClass}
                            >
                              <option value="none">🛑 Langsung Tampil (Tanpa Animasi Masuk)</option>
                              <option value="fade">🌫️ Fade In (Muncul Perlahan)</option>
                              <option value="slide_up">⬆️ Slide Up (Naik dari Bawah)</option>
                              <option value="slide_down">⬇️ Slide Down (Turun dari Atas)</option>
                              <option value="slide_left">⬅️ Slide Left (Masuk dari Kiri)</option>
                              <option value="slide_right">➡️ Slide Right (Masuk dari Kanan)</option>
                              <option value="zoom_in">🔍 Zoom In (Pop Membesar)</option>
                              <option value="zoom_out">🔎 Zoom Out (Mengecil dari Luar)</option>
                              <option value="rotate_in">🔄 Rotate In (Putar &amp; Masuk)</option>
                              <option value="bounce_in">🤾 Bounce In (Membumbung Kenyal)</option>
                            </select>
                          </div>

                          {/* 2. Animasi Dijalankan Terus (Loop) */}
                          <div>
                            <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                              🔄 Animasi Dijalankan Terus (Looping):
                            </label>
                            <select
                              value={asset.animation || 'float'}
                              onChange={(e) => handleUpdateFloatingAsset(asset.id, 'animation', e.target.value)}
                              className={inputClass}
                            >
                              <option value="float">🕊️ Float (Melayang Bergelombang)</option>
                              <option value="pulse">⭐ Pulse (Denyut Skala)</option>
                              <option value="bounce">🚀 Bounce (Membumbung Atas-Bawah)</option>
                              <option value="spin">🌸 Spin (Berputar Lambat 360°)</option>
                              <option value="drift">⛵ Drift (Melayang Diagonal Santai)</option>
                              <option value="sway">🌿 Sway (Goyang Kiri-Kanan)</option>
                              <option value="none">🛑 Diam (Tanpa Animasi Loop)</option>
                            </select>
                          </div>
                        </div>

                        {/* Durasi / Kecepatan Animasi Masuk (ms) */}
                        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              <span>Durasi / Kecepatan Animasi Masuk (Milidetik):</span>
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={100}
                                max={8000}
                                step={100}
                                value={asset.entryDuration ?? 1500}
                                onChange={(e) =>
                                  handleUpdateFloatingAsset(
                                    asset.id,
                                    'entryDuration',
                                    Math.max(100, parseInt(e.target.value, 10) || 1500)
                                  )
                                }
                                className="w-20 px-2 py-0.5 text-[11px] font-mono text-center font-bold bg-slate-900 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-400"
                                placeholder="1500"
                              />
                              <span className="text-[10px] font-bold text-slate-400 font-mono">ms</span>
                            </div>
                          </div>

                          {/* Quick Presets for Duration */}
                          <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-800/60 text-[9.5px]">
                            <span className="text-slate-500 font-medium mr-1">Preset Durasi:</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 800)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDuration ?? 1500) === 800
                                  ? 'bg-cyan-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              800 ms (Cepat)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 1200)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDuration ?? 1500) === 1200
                                  ? 'bg-cyan-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              1200 ms (Medium)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 1500)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDuration ?? 1500) === 1500
                                  ? 'bg-cyan-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              1500 ms (Slow Smooth)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 2000)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDuration ?? 1500) === 2000
                                  ? 'bg-cyan-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              2000 ms (Super Slow)
                            </button>
                          </div>
                        </div>

                        {/* Delay Animasi Masuk (ms) */}
                        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Jeda / Delay Animasi Masuk (Milidetik):</span>
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={10000}
                                step={50}
                                value={asset.entryDelay ?? 0}
                                onChange={(e) =>
                                  handleUpdateFloatingAsset(
                                    asset.id,
                                    'entryDelay',
                                    Math.max(0, parseInt(e.target.value, 10) || 0)
                                  )
                                }
                                className="w-20 px-2 py-0.5 text-[11px] font-mono text-center font-bold bg-slate-900 border border-slate-700 rounded text-amber-300 focus:outline-none focus:border-amber-400"
                                placeholder="0"
                              />
                              <span className="text-[10px] font-bold text-slate-400 font-mono">ms</span>
                            </div>
                          </div>

                          {/* Quick Presets for Delay */}
                          <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-800/60 text-[9.5px]">
                            <span className="text-slate-500 font-medium mr-1">Preset Cepat:</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 0)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDelay ?? 0) === 0
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              0 ms (Instan)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 200)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDelay ?? 0) === 200
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              200 ms
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 400)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDelay ?? 0) === 400
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              400 ms
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 600)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDelay ?? 0) === 600
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              600 ms
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 1000)}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                                (asset.entryDelay ?? 0) === 1000
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              1000 ms (1s)
                            </button>
                          </div>
                          <p className="text-[9.5px] text-slate-400 italic">
                            💡 Setiap perubahan opsi di atas otomatis langsung memutar ulang animasi masuk pada preview tanpa perlu refresh halaman!
                          </p>
                        </div>

                        {/* Rotasi & Mirroring */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                              Rotasi Kemiringan (°):
                            </label>
                            <input
                              type="number"
                              min={-180}
                              max={180}
                              value={curRotation}
                              onChange={(e) =>
                                handleUpdateFloatingAsset(
                                  asset.id,
                                  isMobileMode ? 'mobileRotation' : 'rotation',
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className={inputClass}
                              placeholder="0°"
                            />
                          </div>

                          <div className="flex flex-col justify-end">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                              <input
                                type="checkbox"
                                checked={curFlipX}
                                onChange={(e) =>
                                  handleUpdateFloatingAsset(
                                    asset.id,
                                    isMobileMode ? 'mobileFlipX' : 'flipX',
                                    e.target.checked
                                  )
                                }
                                className={`${accentColor} w-4 h-4 rounded cursor-pointer`}
                              />
                              <span className="text-[11px] font-bold text-slate-300">
                                Flip Horizontal (Cermin X)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
