import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, ArrowRight, ExternalLink } from 'lucide-react';
import { CVData } from '../../types';
import MarkdownText from '../MarkdownText';
import BackgroundTextures from '../BackgroundTextures';
import FloatingAssetsOverlay from '../FloatingAssetsOverlay';
import SectionGradientShadow from '../SectionGradientShadow';
import { getThemeColorPalette } from '../../lib/themeUtils';

interface ProjectsSectionProps {
  activeCVData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  isEffectiveMobile?: boolean;
  isMobile?: boolean;
  setSelectedProjectModal: (project: any) => void;
  navigateToPath: (path: string) => void;
  scrollToSection: (section: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  activeCVData,
  theme,
  lang,
  isEffectiveMobile = false,
  isMobile = false,
  setSelectedProjectModal,
  navigateToPath,
  scrollToSection,
}) => {
  const [isAllProjectsHovered, setIsAllProjectsHovered] = useState(false);
  const isMinimalPopupLayout = (activeCVData.webTexts?.projects_layout_type === 'minimal_popup');
  const allProjs = activeCVData.caseStudies || [];

  const homeFeaturedProjects = (() => {
    try {
      const val = activeCVData.webTexts?.featured_project_ids;
      if (val) {
        const ids = JSON.parse(val);
        if (Array.isArray(ids) && ids.length > 0) {
          return ids.map(id => allProjs.find(p => p.id === id)).filter(Boolean) as typeof allProjs;
        }
      }
    } catch (e) {}
    return allProjs.slice(0, 3);
  })();

  const mappedCards = homeFeaturedProjects.map((study, idx) => {
    if (isMinimalPopupLayout) {
      const projectSkills = (study.tags && study.tags.length > 0)
        ? study.tags
        : (study.tools && study.tools.length > 0)
          ? study.tools
          : [];

      return (
        <motion.div 
          key={study.id} 
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={isMobile ? undefined : { once: true, amount: 0.08 }}
          transition={isMobile ? { duration: 0 } : { duration: 1.2, delay: idx * 0.14, ease: [0.22, 1, 0.36, 1] }}
          whileHover={isMobile ? undefined : { 
            y: -10, 
            scale: 1.03, 
            zIndex: 100,
            transition: { type: "spring", stiffness: 320, damping: 22, mass: 0.5 } 
          }}
          onClick={() => setSelectedProjectModal(study)}
          className="group relative h-[400px] sm:h-[430px] md:h-[450px] lg:h-[460px] xl:h-[480px] 2xl:h-[500px] w-[84vw] sm:w-[340px] md:w-full overflow-hidden rounded-2xl border border-slate-700/60 shadow-md hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer shrink-0 snap-center md:snap-align-none z-10 hover:z-50 bg-slate-950 flex flex-col justify-end"
          title={lang === 'id' ? 'Klik untuk melihat detail proyek (Pop-Up)' : 'Click to view project details (Pop-Up)'}
        >
          {/* Background Image with Smooth Zoom Effect on Hover */}
          <img
            src={study.image}
            alt={study.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 select-none"
          />

          {/* Gradient Overlay for Text Readability & High Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 via-40% to-slate-950/20 group-hover:from-slate-950 group-hover:via-slate-950/80 transition-all duration-500 pointer-events-none" />

          {/* Content Container (Bottom Info with Slide & Hover Reveal) */}
          <div className="relative z-20 p-5 sm:p-6 text-white pointer-events-none flex flex-col justify-end">
            {/* Title & Short Description */}
            <div className="space-y-1.5 transition-transform duration-500 ease-out sm:group-hover:-translate-y-24">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                {study.title}
              </h3>
              {(study.shortDescription || study.description) && (
                <p className="text-xs sm:text-sm text-slate-300/90 line-clamp-2 leading-relaxed drop-shadow-sm font-sans font-normal">
                  {study.shortDescription || study.description}
                </p>
              )}
            </div>

            {/* Hover Section: Skills & Right-Aligned "Click for details" */}
            <div className="pt-3 sm:pt-0 sm:absolute sm:bottom-5 sm:left-6 sm:right-6 border-t sm:border-t-0 border-white/15 opacity-100 sm:opacity-0 sm:translate-y-6 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500 ease-out flex flex-col gap-2.5">
              {projectSkills.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
                    {lang === 'id' ? 'SKILL & TOOLS:' : 'SKILLS & TOOLS:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {projectSkills.slice(0, 4).map((tg, i) => (
                      <span 
                        key={i} 
                        className="font-mono text-[9.5px] sm:text-[10.5px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md bg-slate-900/90 border border-emerald-500/40 text-emerald-300 backdrop-blur-md shadow-sm"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Right-aligned Click for details CTA */}
              <div className="flex items-center justify-end text-xs font-medium pt-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform drop-shadow-sm">
                  <span>{lang === 'id' ? 'Klik untuk detail' : 'Click for details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        key={study.id} 
        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={isMobile ? undefined : { once: true, amount: 0.08 }}
        transition={isMobile ? { duration: 0 } : { duration: 1.2, delay: idx * 0.14, ease: [0.22, 1, 0.36, 1] }}
        whileHover={isMobile ? undefined : { y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
        onClick={() => {
          const url = study.projectUrl || 'https://github.com';
          window.open(url, '_blank');
        }}
        className={`bento-card rounded-xl overflow-hidden p-5 flex flex-col justify-between group transition-all cursor-pointer relative shrink-0 w-[82vw] sm:w-[380px] md:w-auto snap-center md:snap-align-none ${
          theme === 'dark' ? 'bg-slate-800 border-none hover:border-emerald-500/40' : 'bg-white border border-slate-200/80 hover:border-emerald-500/30 hover:shadow-lg'
        }`}
        style={
          theme === 'dark'
            ? (activeCVData.webTexts?.projects_card_bg_color_dark ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color_dark } : undefined)
            : (activeCVData.webTexts?.projects_card_bg_color ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color } : undefined)
        }
        title="Click to open project link"
      >
        <div className={`absolute top-2.5 right-2.5 z-40 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-lg leading-none flex items-center gap-1 border shadow-xs backdrop-blur-xs transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-slate-800/90 text-slate-200 border-slate-700/50 hover:bg-slate-700'
            : 'bg-slate-50/90 text-slate-700 border-slate-200/50 hover:bg-slate-100'
        }`}>
          <ExternalLink className="w-3 h-3" />
          <span>OPEN</span>
        </div>

        <div>
          <div className={`aspect-[16/10] mb-4 overflow-hidden rounded border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <img 
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out grayscale-[10%]" 
              referrerPolicy="no-referrer"
              alt={study.title} 
              src={study.image}
            />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {study.tags.slice(0, 2).map((tg, i) => (
              <span key={i} className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border transition-colors duration-200 ${
                theme === 'dark' ? 'bg-slate-850 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {tg}
              </span>
            ))}
          </div>

          <h3 className={`font-sans font-extrabold text-sm sm:text-lg tracking-tight mb-2 leading-tight transition-colors duration-200 ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            {study.title}
          </h3>
          
          <div className={`text-[11px] sm:text-sm leading-relaxed mb-6 transition-colors duration-200 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <MarkdownText content={study.description} theme={theme} />
          </div>
        </div>

        <div className={`pt-4 border-t flex justify-end items-center transition-colors duration-200 ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection('contact');
            }}
            className={`text-xs font-bold inline-flex items-center gap-1 cursor-pointer hover:underline transition-colors select-none ${
              theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-slate-950'
            }`}
          >
            Discuss Project
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    );
  });

  return (
    <section 
      id="projects" 
      className={`py-20 border-b transition-colors duration-250 relative overflow-hidden ${
        theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}
      style={
        theme === 'dark'
          ? { backgroundColor: activeCVData.webTexts?.projects_bg_color_dark }
          : { backgroundColor: activeCVData.webTexts?.projects_bg_color }
      }
    >
      {/* SECTION GRADIENT SHADOW OVERLAY */}
      <SectionGradientShadow 
        sectionKey="projects" 
        webTexts={activeCVData.webTexts} 
        theme={theme} 
        accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
      />

      {/* SECTION BACKGROUND OVERLAY */}
      {activeCVData.webTexts?.projects_bg_style && activeCVData.webTexts.projects_bg_style !== 'none' && (
        <BackgroundTextures 
          type={activeCVData.webTexts.projects_bg_style} 
          theme={theme} 
          opacity={activeCVData.webTexts.projects_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.projects_bg_pattern_opacity) : undefined}
          scale={activeCVData.webTexts.projects_bg_pattern_scale ? parseFloat(activeCVData.webTexts.projects_bg_pattern_scale) : undefined}
          color={activeCVData.webTexts.projects_bg_pattern_color || undefined}
          customSvg={activeCVData.webTexts.projects_bg_custom_svg || undefined}
          customBgUrl={activeCVData.webTexts.projects_bg_custom_url || undefined}
        />
      )}

      {/* FLOATING DECORATIVE ASSETS OVERLAY */}
      <FloatingAssetsOverlay 
        sectionId="projects" 
        assets={activeCVData.floatingAssets} 
        theme={theme}
        isMobilePreview={isEffectiveMobile}
        bgColor={
          theme === 'dark'
            ? (activeCVData.webTexts?.projects_bg_color_dark || '#0B1120')
            : (activeCVData.webTexts?.projects_bg_color || '#F8FAFC')
        }
      />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 sm:mb-12 relative z-0">
          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h2 
              className={`font-sans font-extrabold text-xl md:text-4xl tracking-tight transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                color: theme === 'dark' 
                  ? (activeCVData.webTexts?.projects_title_color_dark || undefined) 
                  : (activeCVData.webTexts?.projects_title_color || undefined)
              }}
            >
              {activeCVData.webTexts?.projects_title || "Selected Case Studies"}
            </h2>
            <p 
              className={`font-sans text-xs sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
              style={{
                color: theme === 'dark' 
                  ? (activeCVData.webTexts?.projects_subtitle_color_dark || undefined) 
                  : (activeCVData.webTexts?.projects_subtitle_color || undefined)
              }}
            >
              {activeCVData.webTexts?.projects_subtitle || "A structured demonstration of technical proficiency across the entire data deployment stack, highlighting real performance audits."}
            </p>
          </motion.div>
        </div>

        {/* Case Studies Container and Buttons Layout based on Template */}
        {allProjs.length === 0 ? (
          <div className="w-full">
            <div 
              className={`p-8 rounded-xl text-center transition-all ${
                theme === 'dark' ? 'bg-slate-800 border-none text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
              }`}
              style={
                theme === 'dark'
                  ? (activeCVData.webTexts?.projects_card_bg_color_dark ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color_dark } : undefined)
                  : (activeCVData.webTexts?.projects_card_bg_color ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color } : undefined)
              }
            >
              <Database className="w-10 h-10 text-emerald-500 mx-auto mb-4 shrink-0" />
              <h3 className="font-sans font-bold text-lg mb-2">Belum ada Proyek</h3>
              <p className="text-sm max-w-md mx-auto leading-relaxed mb-4">
                Belum ada proyek/case studies yang tersimpan. Klik ikon database hijau (Admin Panel) di pojok kanan atas untuk login dan membuat proyek pertama Anda!
              </p>
            </div>
          </div>
        ) : isMinimalPopupLayout ? (
          // TEMPLATE 2 LAYOUT: Grid kartu rapat + Tombol landscape tanpa logo di bagian bawah
          <div className="w-full relative z-20">
            <div className="flex overflow-x-auto md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-3 snap-x snap-proximity no-scrollbar pt-4 sm:pt-6 pb-6 md:pb-4 px-2 sm:px-3 -mx-2 sm:-mx-3 gap-4 sm:gap-5 relative">
              {mappedCards}
            </div>

            {/* Tombol Landscape Tanpa Logo Khusus Template 2 */}
            <div className="mt-7 sm:mt-8 flex justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.04, y: -1.5 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 24, mass: 0.7 }}
                onClick={() => {
                  navigateToPath('projects');
                }}
                title={lang === 'id' ? 'Lihat Semua Projek' : 'View All Projects'}
                className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border font-sans font-bold text-[11px] sm:text-xs flex items-center gap-2 transition-colors cursor-pointer select-none shadow-xs hover:shadow-md ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700 hover:border-emerald-500/40 shadow-slate-950/30'
                    : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 border-slate-200/90 hover:border-emerald-500/40 shadow-slate-200/40'
                }`}
              >
                <span className="tracking-wide whitespace-nowrap">
                  {lang === 'id' 
                    ? `Lihat Semua Proyek (${allProjs.length})` 
                    : `View All Projects (${allProjs.length})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
              </motion.button>
            </div>
          </div>
        ) : (
          // TEMPLATE 1 (DEFAULT) LAYOUT: Kartu Bento + Tombol Samping (Side Button) Original
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 snap-x snap-proximity no-scrollbar pb-4 md:pb-0 gap-6 sm:gap-8">
                {mappedCards}
                
                {/* Mobile slide-end button for Template 1 */}
                <div className="md:hidden flex items-center justify-center shrink-0 pr-4 snap-center pl-2">
                  <button
                    onClick={() => {
                      navigateToPath('projects');
                    }}
                    title={lang === 'id' ? 'Lihat Semua Projek' : 'View All Projects'}
                    className={`flex flex-col items-center justify-center gap-2 w-[54px] h-[180px] rounded-xl border cursor-pointer select-none shrink-0 ${
                      theme === 'dark'
                        ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                    <span 
                      className="font-mono text-[9px] font-bold tracking-widest uppercase text-center leading-none"
                      style={{ writingMode: 'vertical-lr' }}
                    >
                      {lang === 'id' ? 'SEMUA PROYEK' : 'ALL PROJECTS'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Side Button for Template 1 */}
            <div className="hidden md:flex justify-center items-center shrink-0 w-full lg:w-auto">
              <motion.button
                onMouseEnter={() => setIsAllProjectsHovered(true)}
                onMouseLeave={() => setIsAllProjectsHovered(false)}
                onClick={() => {
                  navigateToPath('projects');
                }}
                title={lang === 'id' ? 'Lihat Semua Projek' : 'View All Projects'}
                animate={{
                  height: isAllProjectsHovered ? 256 : 64,
                  width: isAllProjectsHovered ? (window.innerWidth >= 1024 ? 64 : 180) : 64,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border cursor-pointer select-none shrink-0 overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
                }`}
              >
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 shrink-0 ${isAllProjectsHovered ? 'rotate-90' : ''}`} />
                
                <AnimatePresence>
                  {isAllProjectsHovered && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="font-mono text-[9px] font-bold tracking-widest uppercase text-center select-none shrink-0 leading-none block whitespace-nowrap"
                      style={{ writingMode: window.innerWidth >= 1024 ? 'vertical-lr' : 'horizontal-tb' }}
                    >
                      {lang === 'id' ? 'SEMUA PROYEK' : 'ALL PROJECTS'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
