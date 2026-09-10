import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { CaseStudy, CVData } from '../types';
import MarkdownText from './MarkdownText';

interface ProjectDetailModalProps {
  project: CaseStudy | null;
  onClose: () => void;
  theme: 'light' | 'dark';
  onDiscussProject?: () => void;
  lang?: 'id' | 'en';
  activeCVData?: CVData;
}

// Convert Hex color to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  if (c.length !== 6) {
    return { h: 160, s: 80, l: 50 }; // fallback emerald
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Dynamically generate harmonized luminous gradient, glow, thumbnail borders & button colors based on current background & theme
function getHarmonizedLineStyles(
  bgColor: string,
  isDark: boolean,
  themeColorSetting?: string,
  accentColorHex?: string
) {
  let targetHue = 160;
  let sat = 82;

  if (accentColorHex && accentColorHex.startsWith('#')) {
    const hsl = hexToHsl(accentColorHex);
    targetHue = hsl.h;
    sat = Math.max(hsl.s, 75);
  } else {
    let hex = bgColor ? bgColor.trim() : '';
    if (!hex.startsWith('#')) {
      hex = isDark ? '#181A1B' : '#F3F0E6';
    }
    const hsl = hexToHsl(hex);
    targetHue = hsl.h;

    // If background is nearly grayscale (saturation < 12%), use theme accent hue
    if (hsl.s < 12) {
      switch (themeColorSetting) {
        case 'rose': targetHue = 350; break;
        case 'amber': targetHue = 38; break;
        case 'emerald': targetHue = 160; break;
        case 'blue': targetHue = 215; break;
        case 'indigo': targetHue = 240; break;
        case 'slate': targetHue = 210; break;
        default: targetHue = isDark ? 160 : 38;
      }
      sat = 85;
    } else {
      sat = Math.max(hsl.s, 78);
    }
  }

  const primaryLightness = isDark ? 54 : 46;
  const highlightLightness = isDark ? 82 : 74;

  const accentColor = `hsl(${targetHue}, ${sat}%, ${isDark ? 62 : 42}%)`;
  const accentHoverColor = `hsl(${targetHue}, ${sat}%, ${isDark ? 78 : 32}%)`;
  const skillBadgeColor = `hsl(${targetHue}, ${sat}%, ${isDark ? 68 : 55}%)`;

  return {
    hue: targetHue,
    background: `linear-gradient(90deg, hsl(${targetHue}, ${sat}%, ${primaryLightness}%), hsl(${targetHue}, 95%, ${highlightLightness}%), hsl(${targetHue}, ${sat}%, ${primaryLightness}%))`,
    boxShadow: `0 2px 14px rgba(0, 0, 0, 0.8), 0 0 28px hsl(${targetHue} 90% ${primaryLightness}% / 0.95), 0 0 10px hsl(${targetHue} 95% ${highlightLightness}% / 1)`,
    sparkColor: `hsl(${targetHue}, 95%, 96%)`,
    sparkShadow: `0 0 12px #ffffff, 0 0 20px hsl(${targetHue} 95% ${highlightLightness}% / 1)`,
    accentColor,
    accentHoverColor,
    skillBadgeColor,
    activeThumbnailBorder: `hsl(${targetHue}, ${sat}%, ${isDark ? 65 : 55}%)`,
    activeThumbnailRing: `0 0 0 2px hsl(${targetHue} ${sat}% 60% / 0.85), 0 4px 12px hsl(${targetHue} ${sat}% 50% / 0.45)`,
    activeThumbnailBadgeBg: `hsla(${targetHue}, ${sat}%, 10%, 0.88)`,
    activeThumbnailBadgeText: `hsl(${targetHue}, ${sat}%, 75%)`
  };
}

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

  // Extract active background color to harmonize the line & elements color
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

  // Gather all available project images (up to 3)
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
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ 
            opacity: 0, 
            transition: { 
              duration: 0.65, 
              delay: 0.38, // Synchronized with line shrink
              ease: "easeInOut" 
            } 
          }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[250] flex items-center justify-center p-3 sm:p-5 md:p-8"
          onClick={onClose}
        >
          <div 
            className="relative w-full max-w-2xl lg:max-w-3xl flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STEP 1 (Open: Expand from center | Close: STEP 2 Shrinks to center simultaneously as background clears, retaining full opacity and crisp glow independently) */}
            <motion.div
              key={`modal-line-${project.id}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: 1, 
                opacity: 1,
                transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } 
              }}
              exit={{ 
                scaleX: 0, 
                opacity: 0, 
                transition: { 
                  scaleX: { 
                    duration: 0.65, 
                    delay: 0.38, 
                    ease: [0.22, 1, 0.36, 1] 
                  },
                  // Retains 100% opacity throughout the shrink motion, only vanishing when scale reaches zero
                  opacity: { 
                    duration: 0.08, 
                    delay: 0.98,
                    ease: "easeOut" 
                  }
                } 
              }}
              style={{ 
                transformOrigin: 'center center',
                background: lineStyles.background,
                boxShadow: lineStyles.boxShadow
              }}
              className="relative h-2.5 sm:h-3 w-full rounded-t-xl z-30 shrink-0 border-t border-white/20"
            >
              {/* Luminous center spark glow with ultra-high contrast */}
              <span 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 rounded-full blur-[1px] opacity-100 pointer-events-none"
                style={{ 
                  backgroundColor: lineStyles.sparkColor,
                  boxShadow: lineStyles.sparkShadow
                }}
              />
            </motion.div>

            {/* STEP 2 (Open: Unhide downwards | Close: STEP 1 Fold up into the line) */}
            <motion.div
              key={`modal-body-${project.id}`}
              initial={{ 
                opacity: 0, 
                scaleY: 0, 
                clipPath: 'inset(0% 0% 100% 0%)' 
              }}
              animate={{ 
                opacity: 1, 
                scaleY: 1, 
                clipPath: 'inset(0% 0% 0% 0%)',
                transition: { 
                  duration: 0.52, 
                  delay: 0.45, // Delay on open so line finishes expanding first
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.35, delay: 0.45 }
                }
              }}
              exit={{ 
                opacity: 0, 
                scaleY: 0, 
                clipPath: 'inset(0% 0% 100% 0%)',
                transition: { 
                  duration: 0.36, 
                  delay: 0, // STEP 1 on close: Immediately folds up into line without shifting the line
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.22 }
                }
              }}
              style={{ transformOrigin: 'top center' }}
              className={`relative w-full flex-1 flex flex-col rounded-b-2xl overflow-hidden shadow-2xl border border-t-0 transition-colors ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
              }`}
            >
              {/* Top Hero Image Header with Title & Skills over Rich Bottom-to-Top Gradient Shadow */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] min-h-[230px] sm:min-h-[270px] md:min-h-[300px] max-h-[360px] w-full shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end">
                <img 
                  key={currentBannerImage}
                  src={currentBannerImage} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover select-none transition-all duration-300"
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

                {/* Title & Skill Badges + 3 Image Thumbnails in Pop-up Mode */}
                <div className="relative z-20 p-4 sm:p-6 space-y-2.5">
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-sans font-extrabold tracking-tight leading-snug text-white drop-shadow-md">
                    {project.title}
                  </h3>

                  {/* Skills / Badges along with 3 Small Image Thumbnails in Pop-Up Mode */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
                    {/* Skills / Tags */}
                    {((project.tools && project.tools.length > 0) ? project.tools : (project.tags || [])).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {((project.tools && project.tools.length > 0) ? project.tools : (project.tags || [])).map((tag, idx) => (
                          <span 
                            key={idx}
                            style={{ color: lineStyles.skillBadgeColor }}
                            className="font-mono text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/25 shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 3 Image Thumbnails (In Pop-Up Mode beside Skills) */}
                    {uniqueImages.length > 0 && (
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-slate-950/80 p-1 sm:p-1.5 rounded-lg backdrop-blur-md border border-white/20 shadow-md">
                        {uniqueImages.slice(0, 3).map((imgUrl, i) => {
                          const isActive = activeImageIndex === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex(i);
                              }}
                              title={`${lang === 'id' ? 'Gambar' : 'Image'} ${i + 1}`}
                              style={
                                isActive
                                  ? {
                                      borderColor: lineStyles.activeThumbnailBorder,
                                      boxShadow: lineStyles.activeThumbnailRing
                                    }
                                  : undefined
                              }
                              className={`relative w-9 h-6 sm:w-11 sm:h-7 md:w-13 md:h-8 rounded overflow-hidden border transition-all cursor-pointer ${
                                isActive
                                  ? 'scale-105 opacity-100'
                                  : 'border-white/30 opacity-70 hover:opacity-100 hover:border-white'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Thumbnail ${i + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <span 
                                className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-mono font-bold leading-none backdrop-blur-sm"
                                style={{
                                  backgroundColor: isActive ? lineStyles.activeThumbnailBadgeBg : 'rgba(0,0,0,0.8)',
                                  color: isActive ? lineStyles.activeThumbnailBadgeText : 'rgba(255,255,255,0.85)'
                                }}
                              >
                                {i + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Body - Dedicated to Project Description with Clean Text Link at Bottom Right */}
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

                {/* Text-only Open Project Action in the Bottom-Right Corner (Harmonized with Theme & Background) */}
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
