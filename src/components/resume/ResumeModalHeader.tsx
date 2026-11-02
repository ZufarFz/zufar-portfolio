import React from 'react';
import { X, FileText } from 'lucide-react';

interface ResumeModalHeaderProps {
  onClose: () => void;
}

export const ResumeModalHeader: React.FC<ResumeModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 select-none no-print border-b border-slate-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            Dokumen CV Resume Standard A4 
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              ATS Ready
            </span>
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">Format formal versi cetak teroptimalisasi</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

