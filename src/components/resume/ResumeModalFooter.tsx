import React from 'react';
import { Printer, CheckCircle } from 'lucide-react';

interface ResumeModalFooterProps {
  theme: 'light' | 'dark';
  activeAccentBgClass: string;
  isDownloadingPdf: boolean;
  onDownloadPDF: () => void;
}

export const ResumeModalFooter: React.FC<ResumeModalFooterProps> = ({
  theme,
  activeAccentBgClass,
  isDownloadingPdf,
  onDownloadPDF,
}) => {
  return (
    <div className={`border-t px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shrink-0 text-xs no-print transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-slate-900 border-slate-800 text-slate-400' 
        : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className="flex items-center gap-1.5 text-slate-500 font-sans">
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Format dokumen dioptimalkan secara standar sistem A4 untuk menjamin kompatibilitas dan kelulusan integrasi sistem seleksi ATS.</span>
      </div>
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <button
          onClick={onDownloadPDF}
          disabled={isDownloadingPdf}
          className={`text-white font-bold flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 cursor-pointer shadow-sm active:scale-97 transition-all text-xs w-full md:w-auto border border-transparent ${activeAccentBgClass} ${
            isDownloadingPdf ? 'opacity-65 cursor-not-allowed font-medium' : ''
          }`}
          title="Download dan simpan berkas asli PDF langsung berformat A4"
        >
          {isDownloadingPdf ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Memproses PDF...</span>
            </>
          ) : (
            <>
              <Printer className="w-4 h-4 text-white" />
              <span>Unduh PDF (Format A4)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
