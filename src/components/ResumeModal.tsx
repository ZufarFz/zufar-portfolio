import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  CheckCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { CVData } from '../types';
import { 
  LayoutSettings, 
  DEFAULT_SETTINGS, 
  ResumeModalProps, 
  getLayoutStyles, 
  themeBgMap, 
  getHarmonizedLineStyles, 
  CvDocument 
} from './resume';

export default function ResumeModal({ 
  onClose, 
  cvData, 
  theme = 'light', 
  inlinePreview = false, 
  directDownload = false 
}: ResumeModalProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Auto trigger download for direct mobile resume download
  useEffect(() => {
    if (directDownload) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [directDownload]);

  const getValidSectionOrder = (sOrder: any) => {
    const defaults = ['arsenal', 'education', 'experience', 'methodology'];
    if (!Array.isArray(sOrder) || sOrder.length === 0) return defaults;
    const result = [...sOrder];
    defaults.forEach(sec => {
      if (!result.includes(sec)) result.push(sec);
    });
    return result;
  };

  // Settings initialized with fallback to defaults
  const [settings, setSettings] = useState<LayoutSettings>(() => {
    const s = (cvData as any).layoutSettings;
    if (s && s.themeColor) {
      return {
        ...DEFAULT_SETTINGS,
        ...s,
        sectionOrder: getValidSectionOrder(s.sectionOrder)
      };
    }
    return { ...DEFAULT_SETTINGS, sectionOrder: getValidSectionOrder(s?.sectionOrder) };
  });

  // Keep settings automatically synchronized with parent data
  useEffect(() => {
    const s = (cvData as any).layoutSettings;
    if (s && s.themeColor) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...s,
        sectionOrder: getValidSectionOrder(s.sectionOrder)
      });
    } else {
      setSettings({ ...DEFAULT_SETTINGS, sectionOrder: getValidSectionOrder(s?.sectionOrder) });
    }
  }, [cvData]);

  // Lock body scroll when modal opens
  useEffect(() => {
    if (inlinePreview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, inlinePreview, directDownload]);

  // Offline Direct Download of PDF format (High quality, real selectable text copyable vector)
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsDownloadingPdf(true);
    
    const element = resumeRef.current;
    const originalTitle = document.title;
    
    try {
      const rawName = cvData.name || 'NAMA LENGKAP';
      document.title = `CV-${rawName.toUpperCase()}`;

      const printContainer = document.createElement('div');
      printContainer.className = 'print-only-container';
      
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      clonedElement.style.width = '100%';
      clonedElement.style.maxWidth = '100%';
      clonedElement.style.minWidth = '0';
      clonedElement.style.margin = '0';
      clonedElement.style.padding = '0';
      clonedElement.style.border = 'none';
      clonedElement.style.boxShadow = 'none';
      clonedElement.style.borderRadius = '0';
      
      printContainer.appendChild(clonedElement);
      document.body.appendChild(printContainer);
      document.body.classList.add('is-printing');
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      window.print();
      
      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        document.body.classList.remove('is-printing');
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
        document.title = originalTitle;
        window.removeEventListener('afterprint', cleanup);
        setIsDownloadingPdf(false);
        if (directDownload) {
          onClose();
        }
      };

      window.addEventListener('afterprint', cleanup);
      setTimeout(cleanup, 10000);
      
    } catch (err) {
      console.error("Gagal melakukan penyiapan cetak PDF vektor:", err);
      window.print();
      document.title = originalTitle;
      setIsDownloadingPdf(false);
      if (directDownload) {
        onClose();
      }
    }
  };

  const skills = cvData.skills || [];
  const getSkillsByCategory = (cat: string, fallback?: string) => {
    let filterFn = (s: any) => s.showOnCV !== false && s.category === cat;
    if (cat === 'dbms') {
      filterFn = (s: any) => s.showOnCV !== false && (s.category === 'dbms' || (s.category === 'core' && (s.icon === 'Database' || s.name.toLowerCase().includes('sql'))));
    } else if (cat === 'scientific') {
      filterFn = (s: any) => s.showOnCV !== false && (s.category === 'scientific' || (s.category === 'core' && !(s.icon === 'Database' || s.name.toLowerCase().includes('sql'))));
    }
    const names = skills.filter(filterFn).map(s => s.name).join(', ');
    return names || fallback || '';
  };

  const dynamicDBMS = getSkillsByCategory('dbms', cvData.technicalArsenal?.dbms);
  const dynamicScientific = getSkillsByCategory('scientific', cvData.technicalArsenal?.scientificLanguages);
  const dynamicPresentation = getSkillsByCategory('visualization', cvData.technicalArsenal?.dataPresentation);
  const dynamicAnalytical = getSkillsByCategory('analytical', cvData.technicalArsenal?.analyticsSpecialties);

  const activeStyles = getLayoutStyles(settings);
  const activeAccentBgClass = themeBgMap[settings.themeColor || 'emerald'];

  const isDark = theme === 'dark';
  const activeBgColor = isDark
    ? cvData.floatingAssets?.backdropColorDark || '#0f172a'
    : cvData.floatingAssets?.backdropColorLight || '#ffffff';
  const lineStyles = getHarmonizedLineStyles(
    settings.themeColor || 'emerald',
    activeBgColor,
    isDark
  );

  if (inlinePreview) {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-full flex justify-end gap-2 no-print p-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-slate-700 active:scale-97 disabled:opacity-50 select-none"
          >
            {isDownloadingPdf ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Unduh PDF CV (Format A4)</span>
              </>
            )}
          </button>
        </div>

        <div className="w-full overflow-x-auto p-1 sm:p-4 flex justify-center bg-slate-950/25 rounded-xl border border-slate-800/40">
          <CvDocument
            cvData={cvData}
            settings={settings}
            activeStyles={activeStyles}
            dynamicDBMS={dynamicDBMS}
            dynamicScientific={dynamicScientific}
            dynamicPresentation={dynamicPresentation}
            dynamicAnalytical={dynamicAnalytical}
            inlinePreview={true}
            resumeRef={resumeRef}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {directDownload && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-2xl flex items-center gap-3 max-w-sm w-full mx-auto">
            <svg className="animate-spin h-5 w-5 text-emerald-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Menyiapkan berkas PDF...</span>
          </div>
        </div>
      )}

      <motion.div 
        key="resume-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.35, ease: "easeOut" } }}
        exit={{ 
          opacity: 0, 
          transition: { 
            duration: 0.45, 
            delay: 0.22,
            ease: "easeInOut" 
          } 
        }}
        onClick={onClose}
        className={directDownload 
          ? "fixed -top-[9999px] -left-[9999px] opacity-0 pointer-events-none w-[800px] overflow-hidden"
          : "fixed inset-0 bg-slate-950/90 sm:backdrop-blur-sm z-[250] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
        }
      >
        <div 
          className="relative w-full max-w-4xl lg:max-w-5xl flex flex-col pointer-events-auto my-auto rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* STEP 1: Elegant line animation */}
          <motion.div
            key="resume-modal-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: 1, 
              opacity: 1,
              transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] } 
            }}
            exit={{ 
              scaleX: 0, 
              opacity: 0, 
              transition: { 
                scaleX: { 
                  duration: 0.45, 
                  delay: 0.22, 
                  ease: [0.22, 1, 0.36, 1] 
                },
                opacity: { 
                  duration: 0.12, 
                  delay: 0.58,
                  ease: "easeOut" 
                }
              } 
            }}
            style={{ 
              transformOrigin: 'center center',
              background: lineStyles.background,
              boxShadow: lineStyles.boxShadow,
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
            className="relative h-2.5 sm:h-3 w-full rounded-t-xl z-30 shrink-0 border-t border-white/20"
          >
            <span 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 rounded-full blur-[1px] opacity-100 pointer-events-none"
              style={{ 
                backgroundColor: lineStyles.sparkColor,
                boxShadow: lineStyles.sparkShadow
              }}
            />
          </motion.div>

          {/* STEP 2: Downward unhide modal body */}
          <motion.div
            key="resume-modal-body"
            initial={{ 
              opacity: 0, 
              clipPath: 'inset(0% 0% 100% 0%)' 
            }}
            animate={{ 
              opacity: 1, 
              clipPath: 'inset(0% 0% 0% 0%)',
              transition: { 
                duration: 0.62, 
                delay: 0.26,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.45, delay: 0.26, ease: "easeOut" }
              }
            }}
            exit={{ 
              opacity: 0, 
              clipPath: 'inset(0% 0% 100% 0%)',
              transition: { 
                duration: 0.42, 
                delay: 0,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.32, ease: "easeIn" }
              }
            }}
            style={{ 
              transformOrigin: 'top center',
              willChange: 'clip-path, opacity',
              transform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
            className={`relative rounded-b-2xl border border-t-0 w-full overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[92vh] ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Topbar Actions */}
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

            {/* A4 Canvas Container */}
            <div className={`flex-grow flex flex-col md:flex-row overflow-hidden ${
              theme === 'dark' ? 'bg-[#0b101c]' : 'bg-slate-100'
            }`}>
              <div className="flex-grow overflow-y-auto p-4 sm:p-8 flex items-start justify-center">
                <CvDocument
                  cvData={cvData}
                  settings={settings}
                  activeStyles={activeStyles}
                  dynamicDBMS={dynamicDBMS}
                  dynamicScientific={dynamicScientific}
                  dynamicPresentation={dynamicPresentation}
                  dynamicAnalytical={dynamicAnalytical}
                  inlinePreview={false}
                  resumeRef={resumeRef}
                />
              </div>
            </div>

            {/* Bottom Tip Info Bar */}
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
                  onClick={handleDownloadPDF}
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
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
