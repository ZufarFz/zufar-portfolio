import React from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Eye, 
  Columns, 
  Check, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  User, 
  UserCheck, 
  ArrowUp, 
  EyeOff, 
  Mail, 
  Palette 
} from 'lucide-react';
import { CVData } from '../../../../types';

interface CvLayoutEditorPanelProps {
  localData: CVData;
  handleUpdate: (updater: (prev: CVData) => CVData) => void;
  cardBg: string;
}

export const CvLayoutEditorPanel: React.FC<CvLayoutEditorPanelProps> = ({
  localData,
  handleUpdate,
  cardBg,
}) => {
  const curLayout = localData.layoutSettings?.layoutStyle || 'left-sidebar';
  const curAlign = localData.layoutSettings?.headerAlignment || 'left';
  const curPhotoPos = localData.layoutSettings?.headerPhotoPosition || 'left';
  const curTheme = localData.layoutSettings?.themeColor || 'blue';

  const themeAccentMap: Record<string, { bar: string; badge: string; text: string }> = {
    emerald: { bar: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-400', text: 'Emerald Green' },
    blue: { bar: 'bg-blue-600', badge: 'bg-blue-500/20 text-blue-400', text: 'Royal Blue' },
    slate: { bar: 'bg-slate-600', badge: 'bg-slate-500/20 text-slate-300', text: 'Slate Classic' },
    indigo: { bar: 'bg-indigo-600', badge: 'bg-indigo-500/20 text-indigo-400', text: 'Deep Indigo' },
    rose: { bar: 'bg-rose-600', badge: 'bg-rose-500/20 text-rose-400', text: 'Rose Crimson' },
    amber: { bar: 'bg-amber-600', badge: 'bg-amber-500/20 text-amber-400', text: 'Warm Amber' },
  };
  const activeTheme = themeAccentMap[curTheme] || themeAccentMap.blue;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Studio Layout &amp; Desain Resume CV</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  Real-time
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Atur posisi kolom keahlian (kiri/kanan), perataan header, posisi foto profil, dan urutan seksi CV.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              handleUpdate((prev) => ({
                ...prev,
                layoutSettings: {
                  layoutStyle: 'left-sidebar',
                  headerAlignment: 'left',
                  headerPhotoPosition: 'left',
                  contactPosition: 'bottom',
                  fontSize: 'standard',
                  spacing: 'standard',
                  fontFamily: 'sans',
                  themeColor: 'blue',
                  sectionOrder: ['arsenal', 'education', 'experience', 'methodology']
                }
              }));
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-all"
            title="Kembalikan semua pengaturan layout ke nilai bawaan pabrik"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Layout Standar</span>
          </button>
        </div>
      </div>

      {/* MINI LIVE VISUALIZER */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
        <div className="flex items-center justify-between pb-1 border-b border-indigo-500/20">
          <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Simulasi Miniatur Tata Letak Resume CV</span>
          </h5>
          <span className="text-[10px] text-slate-400 font-mono">
            {curLayout} &bull; {curAlign} &bull; foto {curPhotoPos}
          </span>
        </div>

        {/* Mini Paper Sheet Visualizer */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex flex-col items-center">
          <div className="w-full max-w-sm bg-white rounded-md p-3.5 text-slate-900 shadow-md flex flex-col gap-2.5 transition-all">
            <div className={`w-full h-1 rounded-full ${activeTheme.bar}`} />

            {/* Header Simulation */}
            <div className={`w-full pb-2 border-b border-slate-300 flex flex-col ${
              curAlign === 'center' ? 'items-center text-center' :
              curAlign === 'right' ? 'items-end text-right' :
              curAlign === 'justify' ? 'items-stretch' : 'items-start text-left'
            }`}>
              <div className={`flex w-full items-center gap-2 ${
                curPhotoPos === 'top'
                  ? (curAlign === 'center' ? 'flex-col items-center' : curAlign === 'right' ? 'flex-col items-end' : 'flex-col items-start')
                  : curPhotoPos === 'right'
                    ? 'flex-row-reverse justify-between'
                    : curAlign === 'center'
                      ? 'flex-col items-center justify-center'
                      : curAlign === 'justify'
                        ? 'flex-row items-center justify-between'
                        : 'flex-row items-center justify-between'
              }`}>
                {curPhotoPos !== 'none' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                    {localData.avatarUrl ? (
                      <img src={localData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                )}

                <div className={`flex flex-col ${
                  curAlign === 'center' ? 'items-center text-center' :
                  curAlign === 'right' ? 'items-end text-right' : 'items-start text-left'
                }`}>
                  <span className="text-[11px] font-black tracking-tight text-slate-900 leading-tight">
                    {localData.name || 'NAMA LENGKAP'}
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                    {localData.title || 'PROFESSIONAL TITLE'}
                  </span>
                </div>

                {curAlign === 'justify' && (
                  <div className="text-[7.5px] text-slate-500 font-mono text-right shrink-0">
                    {localData.email ? localData.email : 'contact@domain.com'}
                  </div>
                )}
              </div>

              {curAlign !== 'justify' && (
                <div className={`text-[7.5px] text-slate-500 font-mono mt-1 flex flex-wrap gap-1 ${
                  curAlign === 'center' ? 'justify-center' : curAlign === 'right' ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{localData.location || 'Indonesia'}</span>
                  <span>&bull;</span>
                  <span>{localData.email || 'email@example.com'}</span>
                </div>
              )}
            </div>

            {/* Columns Simulation */}
            <div className="w-full pt-1 flex gap-2 text-[8px]">
              {curLayout === 'left-sidebar' && (
                <>
                  <div className="w-1/3 bg-slate-100 rounded p-1.5 flex flex-col gap-1 border border-slate-200">
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Skills</span>
                    </div>
                    <div className="space-y-0.5 text-[7px] text-slate-600">
                      <div className="h-1 bg-slate-300 rounded w-4/5" />
                      <div className="h-1 bg-slate-300 rounded w-3/5" />
                      <div className="h-1 bg-slate-300 rounded w-4/5" />
                    </div>
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-1 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Pendidikan</span>
                    </div>
                    <div className="h-1 bg-slate-300 rounded w-full" />
                  </div>

                  <div className="w-2/3 bg-slate-50 rounded p-1.5 flex flex-col gap-1.5 border border-slate-200">
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Pengalaman</span>
                    </div>
                    <div className="space-y-1 text-[7px] text-slate-600">
                      <div className="h-1.5 bg-slate-300 rounded w-full" />
                      <div className="h-1 bg-slate-200 rounded w-5/6" />
                      <div className="h-1 bg-slate-200 rounded w-4/6" />
                    </div>
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-0.5 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Methodology</span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded w-full" />
                  </div>
                </>
              )}

              {curLayout === 'right-sidebar' && (
                <>
                  <div className="w-2/3 bg-slate-50 rounded p-1.5 flex flex-col gap-1.5 border border-slate-200">
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Pengalaman</span>
                    </div>
                    <div className="space-y-1 text-[7px] text-slate-600">
                      <div className="h-1.5 bg-slate-300 rounded w-full" />
                      <div className="h-1 bg-slate-200 rounded w-5/6" />
                      <div className="h-1 bg-slate-200 rounded w-4/6" />
                    </div>
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-0.5 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Methodology</span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded w-full" />
                  </div>

                  <div className="w-1/3 bg-slate-100 rounded p-1.5 flex flex-col gap-1 border border-slate-200">
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Skills</span>
                    </div>
                    <div className="space-y-0.5 text-[7px] text-slate-600">
                      <div className="h-1 bg-slate-300 rounded w-4/5" />
                      <div className="h-1 bg-slate-300 rounded w-3/5" />
                      <div className="h-1 bg-slate-300 rounded w-4/5" />
                    </div>
                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-1 flex items-center gap-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                      <span>Pendidikan</span>
                    </div>
                    <div className="h-1 bg-slate-300 rounded w-full" />
                  </div>
                </>
              )}

              {curLayout === 'single-column' && (
                <div className="w-full bg-slate-50 rounded p-1.5 flex flex-col gap-1.5 border border-slate-200">
                  <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                    <span>Pengalaman Kerja (Penuh)</span>
                  </div>
                  <div className="h-1 bg-slate-300 rounded w-full" />
                  <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-1 flex items-center gap-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                    <span>Technical Arsenal &amp; Skills</span>
                  </div>
                  <div className="h-1 bg-slate-300 rounded w-4/5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CARD 1: POSISI SKILL & TATA LETAK KOLOM */}
      <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
          <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <Columns className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
              1. Tata Letak Kolom &amp; Posisi Keahlian (Skills)
            </h5>
            <span className="text-[10px] text-slate-400">
              Tentukan letak kolom Technical Arsenal &amp; Pendidikan terhadap riwayat pengalaman kerja
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Skill di Kiri */}
          {(() => {
            const isSelected = curLayout === 'left-sidebar';
            return (
              <button
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    layoutSettings: {
                      fontSize: 'standard',
                      spacing: 'standard',
                      fontFamily: 'sans',
                      themeColor: 'blue',
                      ...(prev.layoutSettings || {}),
                      layoutStyle: 'left-sidebar'
                    }
                  }));
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>Skill di Sisi Kiri</span>
                  </span>
                  {isSelected && (
                    <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="w-full h-12 bg-slate-950 rounded border border-slate-800 p-1 flex gap-1 items-stretch">
                  <div className="w-1/3 bg-indigo-900/80 rounded border border-indigo-500/60 flex flex-col items-center justify-center p-0.5">
                    <span className="text-[7px] font-black text-indigo-200">SKILLS</span>
                    <span className="text-[6px] text-indigo-300">&amp; EDU</span>
                  </div>
                  <div className="w-2/3 bg-slate-800/80 rounded border border-slate-700 flex flex-col justify-center px-1 gap-0.5">
                    <span className="text-[7px] font-black text-slate-300">PENGALAMAN</span>
                    <div className="h-1 bg-slate-600 rounded w-4/5" />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  Kolom kiri memuat Technical Arsenal &amp; Pendidikan. Kolom kanan memuat Pengalaman Kerja &amp; Core Methodology.
                </p>
              </button>
            );
          })()}

          {/* Option 2: Skill di Kanan */}
          {(() => {
            const isSelected = curLayout === 'right-sidebar';
            return (
              <button
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    layoutSettings: {
                      fontSize: 'standard',
                      spacing: 'standard',
                      fontFamily: 'sans',
                      themeColor: 'blue',
                      ...(prev.layoutSettings || {}),
                      layoutStyle: 'right-sidebar'
                    }
                  }));
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>Skill di Sisi Kanan</span>
                  </span>
                  {isSelected && (
                    <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="w-full h-12 bg-slate-950 rounded border border-slate-800 p-1 flex gap-1 items-stretch">
                  <div className="w-2/3 bg-slate-800/80 rounded border border-slate-700 flex flex-col justify-center px-1 gap-0.5">
                    <span className="text-[7px] font-black text-slate-300">PENGALAMAN</span>
                    <div className="h-1 bg-slate-600 rounded w-4/5" />
                  </div>
                  <div className="w-1/3 bg-indigo-900/80 rounded border border-indigo-500/60 flex flex-col items-center justify-center p-0.5">
                    <span className="text-[7px] font-black text-indigo-200">SKILLS</span>
                    <span className="text-[6px] text-indigo-300">&amp; EDU</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  Kolom kiri memuat Pengalaman Kerja &amp; Core Methodology. Kolom kanan memuat Technical Arsenal &amp; Pendidikan.
                </p>
              </button>
            );
          })()}

          {/* Option 3: 1 Kolom Penuh */}
          {(() => {
            const isSelected = curLayout === 'single-column';
            return (
              <button
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    layoutSettings: {
                      fontSize: 'standard',
                      spacing: 'standard',
                      fontFamily: 'sans',
                      themeColor: 'blue',
                      ...(prev.layoutSettings || {}),
                      layoutStyle: 'single-column'
                    }
                  }));
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>1 Kolom Penuh (Linear)</span>
                  </span>
                  {isSelected && (
                    <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="w-full h-12 bg-slate-950 rounded border border-slate-800 p-1 flex flex-col gap-1 items-stretch justify-center">
                  <div className="w-full bg-slate-800/80 rounded border border-slate-700 py-0.5 px-1">
                    <span className="text-[7px] font-black text-slate-300">PENGALAMAN KERJA</span>
                  </div>
                  <div className="w-full bg-indigo-900/70 rounded border border-indigo-500/50 py-0.5 px-1">
                    <span className="text-[7px] font-black text-indigo-200">SKILLS &amp; PENDIDIKAN</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  Seluruh seksi tersusun vertikal penuh memanjang dari atas ke bawah tanpa pembagian dua kolom.
                </p>
              </button>
            );
          })()}
        </div>
      </div>

      {/* CARD 2: PERATAAN HEADER & TEKS */}
      <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
          <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
              2. Perataan Header &amp; Teks Nama (Alignment)
            </h5>
            <span className="text-[10px] text-slate-400">
              Pilih orientasi posisi nama, profesi, dan kontak pada header dokumen CV
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'left', label: 'Rata Kiri', sublabel: 'Formal & Standar ATS', icon: AlignLeft },
            { id: 'center', label: 'Rata Tengah', sublabel: 'Simetris & Elegan', icon: AlignCenter },
            { id: 'right', label: 'Rata Kanan', sublabel: 'Modern & Asimetris', icon: AlignRight },
            { id: 'justify', label: 'Rata Kanan-Kiri', sublabel: 'Nama di Kiri, Kontak di Kanan', icon: AlignJustify },
          ].map(({ id, label, sublabel, icon: IconComponent }) => {
            const isSelected = curAlign === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    layoutSettings: {
                      fontSize: 'standard',
                      spacing: 'standard',
                      layoutStyle: 'left-sidebar',
                      fontFamily: 'sans',
                      themeColor: 'blue',
                      ...(prev.layoutSettings || {}),
                      headerAlignment: id as any
                    }
                  }));
                }}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">{label}</span>
                <span className="text-[9.5px] text-slate-400 leading-tight">{sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CARD 3: POSISI FOTO PROFIL */}
      <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
          <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
              3. Posisi Foto Profil (Profile Picture Position)
            </h5>
            <span className="text-[10px] text-slate-400">
              Pilih penempatan foto profil di dokumen CV atau sembunyikan foto untuk format ATS-friendly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'left', label: 'Di Sisi Kiri', sublabel: 'Di sebelah kiri nama', icon: User },
            { id: 'right', label: 'Di Sisi Kanan', sublabel: 'Di sebelah kanan nama', icon: UserCheck },
            { id: 'top', label: 'Di Atas Teks', sublabel: 'Di atas nama (elegan terpusat)', icon: ArrowUp },
            { id: 'none', label: 'Tanpa Foto', sublabel: 'Sembunyikan (Format ATS)', icon: EyeOff },
          ].map(({ id, label, sublabel, icon: IconComponent }) => {
            const isSelected = curPhotoPos === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    layoutSettings: {
                      fontSize: 'standard',
                      spacing: 'standard',
                      layoutStyle: 'left-sidebar',
                      fontFamily: 'sans',
                      themeColor: 'blue',
                      ...(prev.layoutSettings || {}),
                      headerPhotoPosition: id as any
                    }
                  }));
                }}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">{label}</span>
                <span className="text-[9.5px] text-slate-400 leading-tight">{sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CARD 4: POSISI KONTAK HEADER */}
      <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
          <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
              4. Posisi Detail Kontak di Header
            </h5>
            <span className="text-[10px] text-slate-400">
              Atur posisi informasi kontak (lokasi, email, medsos) pada header CV
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'bottom',
              label: 'Di Bawah Nama & Jabatan',
              desc: 'Berbaris horizontal dipisahkan garis vertikal ( | ). Terlihat rapi dan terpusat.',
            },
            {
              id: 'right',
              label: 'Di Sisi Kanan (Stacked Vertikal)',
              desc: 'Kolom vertikal rapat di sisi kanan header (khusus tata letak rata kiri/justify).',
            },
          ].map(({ id, label, desc }) => {
            const isSelected = (localData.layoutSettings?.contactPosition || 'bottom') === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    layoutSettings: {
                      fontSize: 'standard',
                      spacing: 'standard',
                      layoutStyle: 'left-sidebar',
                      fontFamily: 'sans',
                      themeColor: 'blue',
                      ...(prev.layoutSettings || {}),
                      contactPosition: id as any
                    }
                  }));
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{label}</span>
                  {isSelected && (
                    <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-400 leading-snug">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CARD 5: WARNA AKSEN & TIPOGRAFI CV */}
      <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
          <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
              5. Tema Warna Aksen &amp; Tipografi Dokumen CV
            </h5>
            <span className="text-[10px] text-slate-400">
              Kustomisasi warna garis aksen, skala font, dan kerapatan spasi halaman CV
            </span>
          </div>
        </div>

        {/* Warna Aksen */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-2">
            Warna Garis Aksen &amp; Heading:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'blue', name: 'Royal Blue', color: 'bg-blue-600' },
              { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
              { id: 'slate', name: 'Slate Gray', color: 'bg-slate-600' },
              { id: 'indigo', name: 'Deep Indigo', color: 'bg-indigo-600' },
              { id: 'rose', name: 'Rose Red', color: 'bg-rose-600' },
              { id: 'amber', name: 'Warm Amber', color: 'bg-amber-600' },
            ].map(({ id, name, color }) => {
              const isSelected = curTheme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    handleUpdate((prev) => ({
                      ...prev,
                      layoutSettings: {
                        fontSize: 'standard',
                        spacing: 'standard',
                        layoutStyle: 'left-sidebar',
                        fontFamily: 'sans',
                        ...(prev.layoutSettings || {}),
                        themeColor: id as any
                      }
                    }));
                  }}
                  className={`p-2 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-400 ring-1 ring-indigo-400 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${color} shrink-0`} />
                  <span className="text-[11px] font-medium truncate">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skala Font & Kerapatan Spasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Skala Font:
            </label>
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-700">
              {[
                { id: 'compact', label: 'Compact' },
                { id: 'standard', label: 'Standard' },
                { id: 'comfortable', label: 'Comfortable' },
              ].map(({ id, label }) => {
                const isSelected = (localData.layoutSettings?.fontSize || 'standard') === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      handleUpdate((prev) => ({
                        ...prev,
                        layoutSettings: {
                          spacing: 'standard',
                          layoutStyle: 'left-sidebar',
                          fontFamily: 'sans',
                          themeColor: 'blue',
                          ...(prev.layoutSettings || {}),
                          fontSize: id as any
                        }
                      }));
                    }}
                    className={`flex-1 py-1 text-center rounded text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Kerapatan Spasi Antar Seksi:
            </label>
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-700">
              {[
                { id: 'tight', label: 'Padat (1 Hal)' },
                { id: 'standard', label: 'Standard' },
                { id: 'spacious', label: 'Renggang' },
              ].map(({ id, label }) => {
                const isSelected = (localData.layoutSettings?.spacing || 'standard') === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      handleUpdate((prev) => ({
                        ...prev,
                        layoutSettings: {
                          fontSize: 'standard',
                          layoutStyle: 'left-sidebar',
                          fontFamily: 'sans',
                          themeColor: 'blue',
                          ...(prev.layoutSettings || {}),
                          spacing: id as any
                        }
                      }));
                    }}
                    className={`flex-1 py-1 text-center rounded text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
