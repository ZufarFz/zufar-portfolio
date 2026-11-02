import React from 'react';
import { CVData } from '../../../../types';
import { Sparkles } from 'lucide-react';

interface GooeyCursorPanelProps {
  localData: CVData;
  handleWebTextChange: (key: string, val: string, lang?: 'id' | 'en') => void;
  editLang: 'id' | 'en';
  cardBg: string;
  renderColorControls: (
    lightKey: string,
    darkKey: string,
    label?: string,
    defaultLightHex?: string,
    defaultDarkHex?: string
  ) => React.ReactNode;
}

export const GooeyCursorPanel: React.FC<GooeyCursorPanelProps> = ({
  localData,
  handleWebTextChange,
  editLang,
  cardBg,
  renderColorControls,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gooey Liquid Metaball Cursor</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 mt-0.5">
            Efek cairan metaballs SVG yang interaktif &amp; reaktif mengikuti gerakan mouse (Lightswind Style)
          </p>
        </div>
      </div>

      {/* Toggle Aktif / Nonaktif */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-200">Status Efek Kursor</p>
            <p className="text-[10px] text-slate-400">Aktifkan efek kursor cairan metaball di seluruh website</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = localData.webTexts?.enable_gooey_cursor !== 'false';
              handleWebTextChange('enable_gooey_cursor', current ? 'false' : 'true', editLang);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
              localData.webTexts?.enable_gooey_cursor !== 'false'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                localData.webTexts?.enable_gooey_cursor !== 'false'
                  ? 'bg-emerald-300 animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span>{localData.webTexts?.enable_gooey_cursor !== 'false' ? 'Aktif' : 'Nonaktif'}</span>
          </button>
        </div>

        {/* Tampilan Kepala Kursor (Mata Ulat / Polos / Titik) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-200">Tampilan Kepala Kursor</p>
              <p className="text-[10px] text-slate-400">Pilih gaya indikator di ujung kepala cairan</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'eyes', label: '🐛 Mata Ulat', desc: 'Mata adaptif gerak' },
              { id: 'none', label: '💧 Polos', desc: 'Tanpa titik/mata' },
              { id: 'dot', label: '🎯 Titik Pusat', desc: 'Titik tengah klasik' },
            ].map((styleOption) => {
              const activeStyle = (localData.webTexts?.gooey_head_style || 'eyes') === styleOption.id;
              return (
                <button
                  key={styleOption.id}
                  type="button"
                  onClick={() => {
                    handleWebTextChange('gooey_head_style', styleOption.id, editLang);
                  }}
                  className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                    activeStyle
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[11px] font-bold leading-tight">{styleOption.label}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{styleOption.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sembunyikan Kursor Bawaan Sistem */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <p className="text-xs font-bold text-slate-200">Sembunyikan Kursor Bawaan</p>
            <p className="text-[10px] text-slate-400">
              Sembunyikan panah kursor bawaan OS dan hanya tampilkan bola cairan
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = localData.webTexts?.gooey_hide_default_cursor === 'true';
              handleWebTextChange('gooey_hide_default_cursor', current ? 'false' : 'true', editLang);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
              localData.webTexts?.gooey_hide_default_cursor === 'true'
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
          >
            <span>
              {localData.webTexts?.gooey_hide_default_cursor === 'true' ? 'Disembunyikan' : 'Tampilkan Asli'}
            </span>
          </button>
        </div>

        {/* Efek Splash Klik */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <p className="text-xs font-bold text-slate-200">Efek Splash Cairan Saat Klik</p>
            <p className="text-[10px] text-slate-400">
              Percikan droplet cairan metaball yang memancar keluar saat mouse ditekan/klik
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = localData.webTexts?.gooey_cursor_splash !== 'false';
              handleWebTextChange('gooey_cursor_splash', current ? 'false' : 'true', editLang);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
              localData.webTexts?.gooey_cursor_splash !== 'false'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{localData.webTexts?.gooey_cursor_splash !== 'false' ? 'Splash Aktif' : 'Splash Nonaktif'}</span>
          </button>
        </div>

        {/* Membesar Saat Hover Objek */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <p className="text-xs font-bold text-slate-200">Membesar Saat Menyorot Objek</p>
            <p className="text-[10px] text-slate-400">
              Perbesar ukuran badan lingkaran ulat saat kursor berada di atas tombol atau tautan
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = localData.webTexts?.gooey_cursor_hover_scale === 'true';
              handleWebTextChange('gooey_cursor_hover_scale', current ? 'false' : 'true', editLang);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
              localData.webTexts?.gooey_cursor_hover_scale === 'true'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
          >
            <span>
              {localData.webTexts?.gooey_cursor_hover_scale === 'true'
                ? 'Membesar (Aktif)'
                : 'Ukuran Tetap (Nonaktif)'}
            </span>
          </button>
        </div>

        {/* Emot / Ikon Reaksi Saat Menyorot Elemen */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80">
          <div>
            <p className="text-xs font-bold text-slate-200">Emot / Balon Reaksi Saat Menyorot Objek</p>
            <p className="text-[10px] text-slate-400">
              Pilih emot / balon reaksi yang muncul di atas kepala ulat saat menyorot elemen interaktif:
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {[
              { id: 'question', label: '❓ Tanda Tanya', desc: 'Balon pop-up tanda tanya (?)' },
              { id: 'exclamation', label: '❗ Tanda Seru', desc: 'Balon pop-up tanda seru (!)' },
              { id: 'heart', label: '❤️ Love / Hati', desc: 'Balon pop-up emot cinta' },
              { id: 'sparkle', label: '✨ Bintang Kilau', desc: 'Balon pop-up kilau berkilau' },
              { id: 'wide_eyes', label: '👀 Mata Melotot', desc: 'Pupil mata terbuka lebar' },
              { id: 'none', label: '🚫 Tanpa Emot', desc: 'Tidak menampilkan balon reaksi' },
            ].map((rx) => {
              const currentReaction = localData.webTexts?.gooey_cursor_hover_reaction || 'question';
              const isSelected = currentReaction === rx.id;
              return (
                <button
                  key={rx.id}
                  type="button"
                  onClick={() => {
                    handleWebTextChange('gooey_cursor_hover_reaction', rx.id, editLang);
                  }}
                  className={`p-2 rounded-lg text-left transition-all border cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-bold block">{rx.label}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">{rx.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider Besaran / Tebal Kursor */}
        <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Besaran / Tebal Lingkaran Kursor</span>
            <span className="font-mono text-emerald-400 font-bold">
              {localData.webTexts?.gooey_cursor_size || '18'}px
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            step="1"
            value={parseInt(localData.webTexts?.gooey_cursor_size || '18', 10)}
            onChange={(e) => {
              handleWebTextChange('gooey_cursor_size', e.target.value, editLang);
            }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>10px (Kecil/Halus)</span>
            <span>18px (Default)</span>
            <span>45px (Tebal/Ekstra Besar)</span>
          </div>
        </div>

        {/* Slider Transparansi / Opacity */}
        <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Transparansi / Opacity Kursor</span>
            <span className="font-mono text-emerald-400 font-bold">
              {Math.round(parseFloat(localData.webTexts?.gooey_cursor_opacity || '0.8') * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={parseFloat(localData.webTexts?.gooey_cursor_opacity || '0.8')}
            onChange={(e) => {
              handleWebTextChange('gooey_cursor_opacity', e.target.value, editLang);
            }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>20% (Sangat Transparan)</span>
            <span>80% (Default)</span>
            <span>100% (Solid Pekat)</span>
          </div>
        </div>

        {/* Info box */}
        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 space-y-1.5">
          <p className="font-semibold text-emerald-400 flex items-center gap-1">
            <span>💡 Keunggulan Efek Gooey Cursor:</span>
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[10.5px]">
            <li>
              Metaballs dinamis dengan SVG <code className="text-emerald-300">feGaussianBlur</code> &amp;{' '}
              <code className="text-emerald-300">feColorMatrix</code>.
            </li>
            <li>Membesar otomatis saat hover di atas tombol, tautan, dan kartu portofolio.</li>
            <li>Otomatis dinonaktifkan pada perangkat layar sentuh/HP agar navigasi tetap nyaman.</li>
          </ul>
        </div>

        {/* Color controls */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <label className="block text-[11px] font-bold text-slate-300">
            Warna Kursor (Light &amp; Dark Mode)
          </label>
          {renderColorControls(
            'gooey_cursor_color',
            'gooey_cursor_color_dark',
            'Warna Cairan Kursor',
            '#059669',
            '#10b981'
          )}

          <div className="pt-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Preset Warna Cepat:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Emerald', light: '#059669', dark: '#10b981' },
                { label: 'Cyan', light: '#0891b2', dark: '#06b6d4' },
                { label: 'Rose', light: '#e11d48', dark: '#f43f5e' },
                { label: 'Amber', light: '#d97706', dark: '#f59e0b' },
                { label: 'Violet', light: '#7c3aed', dark: '#8b5cf6' },
                { label: 'Sapphire', light: '#2563eb', dark: '#3b82f6' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    handleWebTextChange('gooey_cursor_color', preset.light, editLang);
                    handleWebTextChange('gooey_cursor_color_dark', preset.dark, editLang);
                  }}
                  className="px-2 py-1 rounded-md text-[10px] font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.dark }} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
