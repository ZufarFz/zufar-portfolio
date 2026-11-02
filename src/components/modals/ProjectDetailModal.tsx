import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import MarkdownText from '../common/MarkdownText';
import { ProjectDetailModalProps, getHarmonizedLineStyles } from './projectDetailHelpers';
import { ProjectDetailGallery } from './ProjectDetailGallery';

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  theme,
  lang = 'id',
  activeCVData
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const isDark = theme === 'dark';

  const activeBgColor = isDark
    ? (activeCVData?.webTexts?.projects_bg_color_dark || activeCVData?.webTexts?.home_bg_color_dark || activeCVData?.webTexts?.theme_bg_color_dark || '#181A1B')
    : (activeCVData?.webTexts?.projects_bg_color || activeCVData?.webTexts?.home_bg_color || activeCVData?.webTexts?.theme_bg_color_light || '#F3F0E6');

  const customAccent = isDark
    ? activeCVData?.webTexts?.theme_accent_color_dark
    : (activeCVData?.webTexts?.theme_accent_color || activeCVData?.webTexts?.hero_accent_color);

  const lineStyles = useMemo(() => {
    return getHarmonizedLineStyles(
      activeBgColor,
      isDark,
      activeCVData?.layoutSettings?.themeColor,
      customAccent
    );
  }, [activeBgColor, isDark, activeCVData?.layoutSettings?.themeColor, customAccent]);

  const projectImages: string[] = project ? [
    project.image,
    project.image2,
    project.image3,
    ...(project.images || [])
  ].filter((img): img is string => Boolean(img && img.trim().length > 0)) : [];

  const uniqueImages = Array.from(new Set(projectImages));
  const currentBannerImage = uniqueImages[activeImageIndex] || project?.image || '';

  return (
    <AnimatePresence 
      mode="wait"
      onExitComplete={() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }}
    >
      {project && (
        <motion.div 
          key={`project-modal-backdrop-${project.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35, ease: "easeOut" } }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.45, delay: 0.22, ease: "easeInOut" } 
          }}
          className="fixed inset-0 bg-slate-950/90 sm:backdrop-blur-sm z-[250] flex items-center justify-center p-3 sm:p-5 md:p-8"
          onClick={onClose}
        >
          <div 
            className="relative w-full max-w-2xl lg:max-w-3xl flex flex-col pointer-events-auto rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Line */}
            <motion.div
              key={`modal-line-${project.id}`}
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
                  scaleX: { duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.12, delay: 0.58, ease: "easeOut" }
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

            {/* Modal Body */}
            <motion.div
              key={`modal-body-${project.id}`}
              initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
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
              className={`relative w-full flex-1 flex flex-col rounded-b-2xl overflow-hidden border border-t-0 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-100' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <ProjectDetailGallery
                project={project}
                currentBannerImage={currentBannerImage}
                uniqueImages={uniqueImages}
                activeImageIndex={activeImageIndex}
                setActiveImageIndex={setActiveImageIndex}
                lineStyles={lineStyles}
                onClose={onClose}
                lang={lang}
              />

              <div className="p-4 sm:p-6 md:p-7 overflow-y-auto flex-1 flex flex-col justify-between space-y-4 max-h-[45vh] sm:max-h-[50vh]">
                <div className="space-y-2">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    {lang === 'id' ? 'Deskripsi Lengkap Projek:' : 'Full Project Description:'}
                  </span>
                  <div className={`text-xs sm:text-sm md:text-base leading-relaxed ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    <MarkdownText content={project.description} theme={theme} />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      const url = project.projectUrl || 'https://github.com';
                      window.open(url, '_blank');
                    }}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    style={{
                      color: isButtonHovered ? lineStyles.accentHoverColor : lineStyles.accentColor
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all duration-200 group cursor-pointer active:scale-95"
                  >
                    <span>{lang === 'id' ? 'Buka Proyek' : 'Open Project'}</span>
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
