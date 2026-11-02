import React from 'react';
import { Save, Check } from 'lucide-react';

interface DrawerFooterProps {
  onClose: () => void;
  handleSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  isDark: boolean;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
  onClose,
  handleSave,
  saveStatus,
  isDark,
}) => {
  return (
    <div
      className={`p-4 border-t flex items-center justify-between gap-3 ${
        isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-100 bg-slate-50/90'
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        className={`px-4 py-2 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
          isDark
            ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
            : 'border-slate-300 text-slate-600 hover:bg-slate-100'
        }`}
      >
        Tutup
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={saveStatus === 'saving'}
        className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer select-none active:scale-97 disabled:opacity-50"
      >
        {saveStatus === 'saving' ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Menyimpan...</span>
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>Draft Tersimpan!</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Simpan Draft</span>
          </>
        )}
      </button>
    </div>
  );
};
