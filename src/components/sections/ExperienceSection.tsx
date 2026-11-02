import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, ChevronDown } from 'lucide-react';
import { CVData } from '../../types';
import MarkdownText from '../MarkdownText';
import BackgroundTextures from '../BackgroundTextures';
import FloatingAssetsOverlay from '../FloatingAssetsOverlay';
import SectionGradientShadow from '../SectionGradientShadow';
import { getThemeColorPalette } from '../../lib/themeUtils';

interface ExperienceSectionProps {
  activeCVData: CVData;
  theme: 'light' | 'dark';
  isEffectiveMobile?: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  activeCVData,
  theme,
  isEffectiveMobile = false,
}) => {
  const [expandedExpMap, setExpandedExpMap] = useState<Record<string, boolean>>({});

  const visibleExperiences = (activeCVData.experiences || []).filter(
    exp => exp.showOnHome !== false && exp.showOnWeb !== false
  );

  return (
    <section 
      id="experience" 
      className={`py-12 sm:py-20 border-b transition-colors duration-250 relative overflow-hidden ${
        theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}
      style={
        theme === 'dark'
          ? { backgroundColor: activeCVData.webTexts?.experience_bg_color_dark }
          : { backgroundColor: activeCVData.webTexts?.experience_bg_color }
      }
    >
      {/* SECTION GRADIENT SHADOW OVERLAY */}
      <SectionGradientShadow 
        sectionKey="experience" 
        webTexts={activeCVData.webTexts} 
        theme={theme} 
        accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
      />

      {/* SECTION BACKGROUND OVERLAY */}
      {activeCVData.webTexts?.experience_bg_style && activeCVData.webTexts.experience_bg_style !== 'none' && (
        <BackgroundTextures 
          type={activeCVData.webTexts.experience_bg_style} 
          theme={theme} 
          opacity={activeCVData.webTexts.experience_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.experience_bg_pattern_opacity) : undefined}
          scale={activeCVData.webTexts.experience_bg_pattern_scale ? parseFloat(activeCVData.webTexts.experience_bg_pattern_scale) : undefined}
          color={activeCVData.webTexts.experience_bg_pattern_color || undefined}
          customSvg={activeCVData.webTexts.experience_bg_custom_svg || activeCVData.webTexts.experience_custom_svg || undefined}
          customBgUrl={activeCVData.webTexts.experience_bg_custom_url || activeCVData.webTexts.experience_custom_url || undefined}
        />
      )}

      {/* FLOATING DECORATIVE ASSETS OVERLAY */}
      <FloatingAssetsOverlay 
        sectionId="experience" 
        assets={activeCVData.floatingAssets} 
        theme={theme}
        isMobilePreview={isEffectiveMobile}
        bgColor={
          theme === 'dark'
            ? (activeCVData.webTexts?.experience_bg_color_dark || '#111827')
            : (activeCVData.webTexts?.experience_bg_color || '#F8FAFC')
        }
      />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-6 sm:mb-12"
        >
          <h2 
            className={`font-sans font-extrabold text-xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              color: theme === 'dark' 
                ? (activeCVData.webTexts?.experience_title_color_dark || undefined) 
                : (activeCVData.webTexts?.experience_title_color || undefined)
            }}
          >
            {activeCVData.webTexts?.experience_title || "Professional Journey"}
          </h2>
          <p 
            className={`font-sans text-xs sm:text-base mt-2 transition-colors duration-200 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
            style={{
              color: theme === 'dark' 
                ? (activeCVData.webTexts?.experience_subtitle_color_dark || undefined) 
                : (activeCVData.webTexts?.experience_subtitle_color || undefined)
            }}
          >
            {activeCVData.webTexts?.experience_subtitle || "Proven experience designing databases, reporting frameworks, and pipelines inside rapid consumer spaces. Click to toggle bullet point summaries."}
          </p>
        </motion.div>

        {/* Timeline Cards */}
        <div className="space-y-3 sm:space-y-6 max-w-4xl xl:max-w-5xl">
          {visibleExperiences.length === 0 ? (
            <div 
              className={`p-8 rounded-xl border text-center transition-all ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}
              style={
                theme === 'dark'
                  ? (activeCVData.webTexts?.experience_card_bg_color_dark ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color_dark } : undefined)
                  : (activeCVData.webTexts?.experience_card_bg_color ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color } : undefined)
              }
            >
              <Database className="w-10 h-10 text-emerald-500 mx-auto mb-4 shrink-0" />
              <h3 className="font-sans font-bold text-base mb-2">Belum ada Pengalaman Kerja</h3>
              <p className="text-sm max-w-md mx-auto leading-relaxed text-slate-400">
                Tambahkan riwayat pengalaman kerja baru Anda melalui Admin Panel di pojok kanan atas.
              </p>
            </div>
          ) : (
            visibleExperiences.map((exp, expIdx) => {
              const isExpanded = expandedExpMap[exp.id] !== undefined ? expandedExpMap[exp.id] : (expIdx === 0);
              return (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{ duration: 1.2, delay: expIdx * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.25, ease: "easeOut" } }}
                  onClick={() => setExpandedExpMap(prev => ({ ...prev, [exp.id]: !isExpanded }))}
                  className={`bento-card p-3.5 sm:p-6 rounded-xl border cursor-pointer select-none transition-[border-color,background-color,box-shadow] duration-250 ${
                    isExpanded 
                      ? 'border-emerald-500/45 shadow-sm bg-emerald-500/5' 
                      : (theme === 'dark' ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300')
                  }`}
                  style={
                    theme === 'dark'
                      ? (activeCVData.webTexts?.experience_card_bg_color_dark && !isExpanded ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color_dark } : undefined)
                      : (activeCVData.webTexts?.experience_card_bg_color && !isExpanded ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color } : undefined)
                  }
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                    <div className="flex gap-3 sm:gap-4 items-center">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold block">
                          {exp.period}
                        </span>
                        <h4 className={`font-sans font-bold text-sm sm:text-lg transition-colors leading-tight ${
                          theme === 'dark' ? 'text-white' : 'text-slate-950'
                        }`}>
                          {exp.role} <span className="text-emerald-500 font-extrabold">@ {exp.company}</span>
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1 sm:pt-0">
                      {/* Render list of tags on role */}
                      <div className="hidden sm:flex flex-wrap gap-1">
                        {exp.tools?.map((tool, idx) => (
                          <span key={idx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border transition-colors ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {tool}
                          </span>
                        ))}
                      </div>

                      {/* Smooth animated toggle indicator */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden sm:block text-slate-400 shrink-0"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Butter-smooth Collapsible bullet list */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div 
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          height: { duration: 0.38, ease: [0.33, 1, 0.68, 1] },
                          opacity: { duration: 0.22, ease: "easeInOut" }
                        }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-3 sm:mt-5 pt-3 sm:pt-4 border-t text-xs sm:text-sm transition-colors ${
                          theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                        }`}>
                          <ul className="space-y-1 sm:space-y-2">
                            {exp.bulletPoints.map((bullet, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.25 }}
                                className="flex items-start gap-2.5"
                              >
                                <span className="w-2 h-2 rounded bg-emerald-500 shrink-0 mt-1.5" />
                                <span className="leading-relaxed text-justify w-full">
                                  <MarkdownText content={bullet} theme={theme} inline />
                                </span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* Mobile stack indicators */}
                          <div className={`flex sm:hidden flex-wrap gap-1 mt-3 pt-3 sm:mt-4 sm:pt-4 border-t ${
                            theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                          }`}>
                            {exp.tools?.map((tool, idx) => (
                              <span key={idx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border transition-colors ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}>
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
