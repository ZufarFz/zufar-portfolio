import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pencil,
  X,
  GripHorizontal,
  Dock,
  PictureInPicture2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Minimize2,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { resetCVDataToDefault } from '../../../lib/storage';
import { CVData } from '../../../types';

interface DrawerHeaderProps {
  isFloating: boolean;
  isMinimizedFloating: boolean;
  isExpanded: boolean;
  isDark: boolean;
  editLang: 'id' | 'en';
  resetNotice: string | null;
  showResetConfirm: boolean;
  setShowResetConfirm: (show: boolean) => void;
  setResetNotice: (notice: string | null) => void;
  setIsFloating: (floating: boolean) => void;
  setIsMinimizedFloating: (minimized: boolean) => void;
  setIsExpanded: (expanded: boolean) => void;
  setFloatingPos: (pos: { x: number; y: number }) => void;
  handleHeaderMouseDown: (e: React.MouseEvent) => void;
  onClose: () => void;
  setLocalData: (data: CVData) => void;
  onUpdateCV: (data: CVData) => void;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  isFloating,
  isMinimizedFloating,
  isExpanded,
  isDark,
  editLang,
  resetNotice,
  showResetConfirm,
  setShowResetConfirm,
  setResetNotice,
  setIsFloating,
  setIsMinimizedFloating,
  setIsExpanded,
  setFloatingPos,
  handleHeaderMouseDown,
  onClose,
  setLocalData,
  onUpdateCV,
}) => {
  return (
    <>
      <div
        onMouseDown={handleHeaderMouseDown}
        className={`p-3.5 border-b flex items-center justify-between gap-2.5 transition-colors select-none ${
          isFloating
            ? 'cursor-grab active:cursor-grabbing bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-purple-950/40 border-emerald-500/30'
            : ''
        } ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {isFloating ? (
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 cursor-grab">
              <GripHorizontal className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold shrink-0">
              <Pencil className="w-4 h-4" />
            </div>
          )}
          <div className="truncate">
            <h3 className="font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
              <span className="truncate">{isFloating ? 'Quick Editor (Floating)' : 'Visual Quick Editor'}</span>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                {isFloating ? 'Pop-out' : 'Live Sync'}
              </span>
            </h3>
            <p className="text-[10.5px] text-slate-400 truncate hidden xs:block">
              {isFloating ? 'Geser header untuk memindahkan window' : 'Edit tulisan & lembar halaman aktif'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* BUTTON: DOCK TO SIDEBAR vs POP-OUT FLOATING */}
          {isFloating ? (
            <button
              type="button"
              onClick={() => {
                setIsFloating(false);
                setIsMinimizedFloating(false);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              title="Gabung kembali ke Sidebar Kanan (Dock)"
            >
              <Dock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gabung Sidebar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsFloating(true);
                setFloatingPos({
                  x: Math.max(20, window.innerWidth - 560),
                  y: 40,
                });
              }}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                isDark
                  ? 'border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300'
                  : 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700'
              }`}
              title="Pisahkan Editor menjadi Pop-out Floating Window di atas halaman"
            >
              <PictureInPicture2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Pisahkan Window</span>
            </button>
          )}

          {/* MINIMIZE FLOATING BUTTON */}
          {isFloating && (
            <button
              type="button"
              onClick={() => setIsMinimizedFloating(!isMinimizedFloating)}
              className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
              title={isMinimizedFloating ? 'Restore Window Editor' : 'Minimize Window Editor'}
            >
              {isMinimizedFloating ? (
                <ChevronUp className="w-4 h-4 text-emerald-400 animate-bounce" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Reset to Default TS Data button */}
          {!isMinimizedFloating && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className={`px-2 py-1.5 rounded-lg border text-amber-400 hover:text-amber-300 hover:border-amber-500/50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                isDark
                  ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                  : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800'
              }`}
              title="Reset seluruh editan ke data asli template (portfolioData.ts)"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Asli</span>
            </button>
          )}

          {/* EXPAND DRAWER BUTTON */}
          {!isMinimizedFloating && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`hidden sm:flex p-1.5 rounded-lg border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
              title={isExpanded ? 'Perkecil Editor' : 'Perlebar Editor'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
              isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
            }`}
            title="Tutup Quick Editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Overlay Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-md w-full p-5 rounded-2xl border shadow-2xl ${
                isDark ? 'bg-slate-900 border-amber-500/40 text-slate-100' : 'bg-white border-amber-300 text-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-400">
                    {editLang === 'id'
                      ? 'Reset ke Data Asli (portfolioData.ts)?'
                      : 'Reset to Original Data (portfolioData.ts)?'}
                  </h4>
                  <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed">
                    {editLang === 'id'
                      ? 'Perhatian: Seluruh editan draft lokal yang tersimpan di browser ini akan dihapus dan dikembalikan persis sesuai data bawaan asli di portfolioData.ts.'
                      : 'Warning: All local drafts stored in this browser will be cleared and reset to match the pristine template in portfolioData.ts.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {editLang === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const freshData = resetCVDataToDefault();
                    setLocalData(freshData);
                    onUpdateCV(freshData);
                    setShowResetConfirm(false);
                    setResetNotice(
                      editLang === 'id'
                        ? 'Data berhasil di-reset ke versi asli portfolioData.ts!'
                        : 'Data successfully reset to original template data!'
                    );
                    setTimeout(() => setResetNotice(null), 4000);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{editLang === 'id' ? 'Ya, Reset Data' : 'Yes, Reset Data'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Notice Toast */}
      <AnimatePresence>
        {resetNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resetNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

