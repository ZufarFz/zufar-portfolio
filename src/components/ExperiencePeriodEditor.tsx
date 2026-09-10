import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { MONTHS_DATA, YEAR_OPTIONS, formatExperiencePeriod, parseExperiencePeriod, ParsedDateState } from '../lib/experienceDateHelpers';
import { Experience } from '../types';

interface ExperiencePeriodEditorProps {
  item: Experience | undefined;
  pairBaseId: string;
  editLang: 'id' | 'en';
  onDateChange: (
    baseId: string,
    startMonth: string,
    startYear: string,
    endMonth: string,
    endYear: string,
    isCurrent: boolean
  ) => void;
  onManualTextChange?: (baseId: string, lang: 'id' | 'en', text: string) => void;
  inputClass?: string;
}

export const ExperiencePeriodEditor: React.FC<ExperiencePeriodEditorProps> = ({
  item,
  pairBaseId,
  editLang,
  onDateChange,
  onManualTextChange,
  inputClass = 'w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors'
}) => {
  const [isManualMode, setIsManualMode] = useState<boolean>(item?.periodMode === 'custom');
  const [dateState, setDateState] = useState<ParsedDateState>(() => parseExperiencePeriod(item?.period, item));

  // Sync state if item changes externally
  useEffect(() => {
    const parsed = parseExperiencePeriod(item?.period, item);
    setDateState(parsed);
    if (item?.periodMode === 'custom') {
      setIsManualMode(true);
    }
  }, [item?.period, item?.startDate, item?.endDate, item?.isCurrent, item?.periodMode]);

  const handleFieldChange = (
    field: 'startMonth' | 'startYear' | 'endMonth' | 'endYear' | 'isCurrent',
    val: any
  ) => {
    const nextState = {
      ...dateState,
      [field]: val
    };

    if (field === 'isCurrent' && val === true) {
      nextState.endMonth = '';
      nextState.endYear = '';
    }

    setDateState(nextState);

    onDateChange(
      pairBaseId,
      nextState.startMonth,
      nextState.startYear,
      nextState.isCurrent ? '' : nextState.endMonth,
      nextState.isCurrent ? '' : nextState.endYear,
      nextState.isCurrent
    );
  };

  const previewId = formatExperiencePeriod(
    dateState.startMonth,
    dateState.startYear,
    dateState.endMonth,
    dateState.endYear,
    dateState.isCurrent,
    'id'
  ) || (item?.period || 'Belum diatur');

  const previewEn = formatExperiencePeriod(
    dateState.startMonth,
    dateState.startYear,
    dateState.endMonth,
    dateState.endYear,
    dateState.isCurrent,
    'en'
  ) || (item?.period || 'Not set');

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-700/50">
      {/* Header & Mode Switch */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pengaturan Periode Waktu</span>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextMode = !isManualMode;
            setIsManualMode(nextMode);
            if (!nextMode) {
              // Re-trigger date formatting
              onDateChange(
                pairBaseId,
                dateState.startMonth,
                dateState.startYear,
                dateState.isCurrent ? '' : dateState.endMonth,
                dateState.isCurrent ? '' : dateState.endYear,
                dateState.isCurrent
              );
            }
          }}
          className="text-[10px] text-slate-400 hover:text-emerald-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
        >
          {isManualMode ? (
            <>
              <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gunakan Mode Tanggal Otomatis</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Ketik Teks Bebas</span>
            </>
          )}
        </button>
      </div>

      {isManualMode ? (
        /* Manual Input Mode */
        <div className="space-y-1.5">
          <input
            type="text"
            value={item?.period || ''}
            onChange={(e) => onManualTextChange?.(pairBaseId, editLang, e.target.value)}
            placeholder="Contoh: Jan 2022 — Present atau 2022 - Sekarang"
            className={inputClass}
          />
          <p className="text-[10px] text-slate-500 italic">
            * Mode teks bebas memungkinkan Anda mengetik format tanggal secara kustom.
          </p>
        </div>
      ) : (
        /* Structured Date Picker Mode */
        <div className="space-y-2.5">
          {/* Mulai & Selesai Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Mulai Dari */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Mulai Bekerja
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={dateState.startMonth}
                  onChange={(e) => handleFieldChange('startMonth', e.target.value)}
                  className={`${inputClass} cursor-pointer text-xs`}
                >
                  <option value="">Bulan...</option>
                  {MONTHS_DATA.map((m) => (
                    <option key={m.value} value={m.value}>
                      {editLang === 'id' ? `${m.idShort} (${m.idFull})` : `${m.enShort} (${m.enFull})`}
                    </option>
                  ))}
                </select>

                <select
                  value={dateState.startYear}
                  onChange={(e) => handleFieldChange('startYear', e.target.value)}
                  className={`${inputClass} cursor-pointer text-xs`}
                >
                  <option value="">Tahun...</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sampai Dengan / Tanggal Selesai */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Selesai Bekerja
                </label>
                {dateState.isCurrent && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-semibold animate-pulse">
                    Aktif
                  </span>
                )}
              </div>

              {dateState.isCurrent ? (
                <div className="h-[34px] px-2.5 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {editLang === 'id' ? 'Sampai Sekarang (Masih di sini)' : 'Present (Still working here)'}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={dateState.endMonth}
                    onChange={(e) => handleFieldChange('endMonth', e.target.value)}
                    className={`${inputClass} cursor-pointer text-xs`}
                  >
                    <option value="">Bulan...</option>
                    {MONTHS_DATA.map((m) => (
                      <option key={m.value} value={m.value}>
                        {editLang === 'id' ? `${m.idShort} (${m.idFull})` : `${m.enShort} (${m.enFull})`}
                      </option>
                    ))}
                  </select>

                  <select
                    value={dateState.endYear}
                    onChange={(e) => handleFieldChange('endYear', e.target.value)}
                    className={`${inputClass} cursor-pointer text-xs`}
                  >
                    <option value="">Tahun...</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Opsi "Masih Bekerja di Sini / Sampai Sekarang" */}
          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/40 transition-colors cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={dateState.isCurrent}
                onChange={(e) => handleFieldChange('isCurrent', e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                  Masih Bekerja di Sini (Sampai Sekarang / Present)
                </span>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  Centang opsi ini jika Anda masih aktif menjabat di posisi ini hingga saat ini.
                </p>
              </div>
            </label>
          </div>

          {/* Hasil Sinkronisasi Dwi-Bahasa Otomatis */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Otomatis Terhubung ke 2 Bahasa:
              </span>
              <span className="text-slate-500 text-[9px] flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                Auto-Synced
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 block">🇮🇩 Bahasa Indonesia:</span>
                <span className="font-semibold text-slate-200">{previewId}</span>
              </div>
              <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 block">🇬🇧 English:</span>
                <span className="font-semibold text-slate-200">{previewEn}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
