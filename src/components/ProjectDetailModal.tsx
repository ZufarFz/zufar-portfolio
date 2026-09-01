import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, MessageCircle } from 'lucide-react';
import { CaseStudy } from '../types';

interface ProjectDetailModalProps {
  project: CaseStudy | null;
  onClose: () => void;
  theme: 'light' | 'dark';
  onDiscussProject?: () => void;
  lang?: 'id' | 'en';
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  theme,
  onDiscussProject,
  lang = 'id'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const projectTools = project.tools && project.tools.length > 0
    ? project.tools
    : (project.tags || []);

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[250] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl lg:max-w-3xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border transition-colors my-auto ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80' 
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
          }`}
        >
          {/* Top Hero Image Header with Title & Skills over Rich Bottom-to-Top Gradient Shadow */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] min-h-[220px] sm:min-h-[260px] md:min-h-[290px] max-h-[360px] w-full shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end">
            <img 
              src={project.image} 
              alt={project.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
            {/* Rich multi-stop gradient shadow from bottom to top for maximum legibility on both bright & dark images */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 via-45% to-transparent pointer-events-none" />

            {/* Floating Close Button */}
            <button
              onClick={onClose}
              title={lang === 'id' ? 'Tutup' : 'Close'}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg active:scale-90"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Title & Skill Badges Placed directly on the Image */}
            <div className="relative z-20 p-4 sm:p-6 space-y-2.5">
              <h3 className="text-lg sm:text-2xl md:text-3xl font-sans font-extrabold tracking-tight leading-snug text-white drop-shadow-md">
                {project.title}
              </h3>

              {projectTools.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {projectTools.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="font-mono text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/25 text-emerald-400 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Body - Dedicated Purely to Project Description */}
          <div className="p-4 sm:p-6 md:p-7 overflow-y-auto flex-1 space-y-2">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              {lang === 'id' ? 'Deskripsi Lengkap Projek:' : 'Full Project Description:'}
            </span>
            <p className={`text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {project.description}
            </p>
          </div>

          {/* Action Buttons Footer - Sticky at bottom */}
          <div className={`p-3.5 sm:p-5 border-t shrink-0 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 ${
            isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200/80 bg-slate-50/90'
          }`}>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
              {/* Primary CTA: Open Project Link */}
              <button
                onClick={() => {
                  const url = project.projectUrl || 'https://github.com';
                  window.open(url, '_blank');
                }}
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-sans font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{lang === 'id' ? 'Buka Link Proyek' : 'Open Project Link'}</span>
              </button>

              {/* Secondary CTA: Discuss Project */}
              {onDiscussProject && (
                <button
                  onClick={() => {
                    onClose();
                    onDiscussProject();
                  }}
                  className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border cursor-pointer active:scale-95 whitespace-nowrap ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                  <span>{lang === 'id' ? 'Diskusi Proyek' : 'Discuss Project'}</span>
                </button>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                isDark 
                  ? 'text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800' 
                  : 'text-slate-500 hover:text-slate-900 border-slate-200 hover:bg-slate-200/70'
              }`}
            >
              {lang === 'id' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
