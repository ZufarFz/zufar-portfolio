import React from 'react';
import { motion } from 'motion/react';
import { CVData } from '../../types';
import BackgroundTextures from '../BackgroundTextures';
import FloatingAssetsOverlay from '../FloatingAssetsOverlay';
import SectionGradientShadow from '../SectionGradientShadow';
import SkillsArsenal from '../SkillsArsenal';
import { getThemeColorPalette } from '../../lib/themeUtils';

interface SkillsSectionProps {
  activeCVData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  isEffectiveMobile?: boolean;
  onNavigateToSkills: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  activeCVData,
  theme,
  lang,
  isEffectiveMobile = false,
  onNavigateToSkills,
}) => {
  return (
    <section 
      id="skills" 
      className={`py-20 border-b transition-colors duration-250 relative overflow-hidden ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
      style={
        theme === 'dark'
          ? { backgroundColor: activeCVData.webTexts?.skills_bg_color_dark }
          : { backgroundColor: activeCVData.webTexts?.skills_bg_color }
      }
    >
      {/* SECTION GRADIENT SHADOW OVERLAY */}
      <SectionGradientShadow 
        sectionKey="skills" 
        webTexts={activeCVData.webTexts} 
        theme={theme} 
        accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
      />

      {/* SECTION BACKGROUND OVERLAY */}
      {activeCVData.webTexts?.skills_bg_style && activeCVData.webTexts.skills_bg_style !== 'none' && (
        <BackgroundTextures 
          type={activeCVData.webTexts.skills_bg_style} 
          theme={theme} 
          opacity={activeCVData.webTexts.skills_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.skills_bg_pattern_opacity) : undefined}
          scale={activeCVData.webTexts.skills_bg_pattern_scale ? parseFloat(activeCVData.webTexts.skills_bg_pattern_scale) : undefined}
          color={activeCVData.webTexts.skills_bg_pattern_color || undefined}
          customSvg={activeCVData.webTexts.skills_bg_custom_svg || activeCVData.webTexts.skills_custom_svg || undefined}
          customBgUrl={activeCVData.webTexts.skills_bg_custom_url || activeCVData.webTexts.skills_custom_url || undefined}
        />
      )}

      {/* FLOATING DECORATIVE ASSETS OVERLAY */}
      <FloatingAssetsOverlay 
        sectionId="skills" 
        assets={activeCVData.floatingAssets} 
        theme={theme}
        isMobilePreview={isEffectiveMobile}
        bgColor={
          theme === 'dark'
            ? (activeCVData.webTexts?.skills_bg_color_dark || '#0F172A')
            : (activeCVData.webTexts?.skills_bg_color || '#F8FAFC')
        }
      />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 
            className={`font-sans font-extrabold text-xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              color: theme === 'dark' 
                ? (activeCVData.webTexts?.skills_title_color_dark || undefined) 
                : (activeCVData.webTexts?.skills_title_color || undefined)
            }}
          >
            {activeCVData.webTexts?.skills_title || "Technical Arsenal"}
          </h2>
          <p 
            className={`font-sans text-xs sm:text-base mt-2 transition-colors duration-200 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
            style={{
              color: theme === 'dark' 
                ? (activeCVData.webTexts?.skills_subtitle_color_dark || undefined) 
                : (activeCVData.webTexts?.skills_subtitle_color || undefined)
            }}
          >
            {activeCVData.webTexts?.skills_subtitle || "Expertise and architectural know-how across relational SQL databases, mathematical script engines, and custom telemetry filters."}
          </p>
        </motion.div>

        <SkillsArsenal 
          skills={activeCVData.skills} 
          theme={theme} 
          customCategories={activeCVData.skillCategories}
          lang={lang}
          badgeText={activeCVData.webTexts?.skills_badge}
          groupDesc={activeCVData.webTexts?.skills_home_group_desc}
          onNavigateToAboutMe={onNavigateToSkills}
        />
      </div>
    </section>
  );
};

export default SkillsSection;
