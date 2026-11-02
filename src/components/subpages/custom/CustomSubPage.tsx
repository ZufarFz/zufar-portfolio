import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CVData } from '../../../types';
import MarkdownText from '../../MarkdownText';
import BackgroundTextures from '../../BackgroundTextures';
import FloatingAssetsOverlay from '../../FloatingAssetsOverlay';
import SectionGradientShadow from '../../SectionGradientShadow';
import SkillsArsenal from '../../SkillsArsenal';
import { getThemeColorPalette } from '../../../lib/themeUtils';
import { createFadeGradientStyle } from '../subpageUtils';
import { SubPageSectionItem } from '../sections/SubPageSectionItem';
import { getDisplaySections, getSubpageBgSettings } from './customSubpageHelpers';

export interface CustomSubPageProps {
  pageKey: string;
  defaultTitle: string;
  defaultIntro: string;
  defaultBgUrl: string;
  defaultIcon?: React.ReactNode;
  categoryLabel: string;
  cvData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
}

export const CustomSubPage: React.FC<CustomSubPageProps> = ({
  pageKey,
  defaultTitle,
  defaultIntro,
  defaultBgUrl,
  categoryLabel,
  cvData,
  theme,
  lang,
}) => {
  const isDark = theme === 'dark';
  const prefix = pageKey.replace('-', '_');

  const title = cvData.webTexts?.[`${prefix}_title`] || defaultTitle;
  const intro = cvData.webTexts?.[`${prefix}_intro`] || defaultIntro;
  const bgUrl = cvData.webTexts?.[`${prefix}_header_bg`] || defaultBgUrl;

  const displaySections = getDisplaySections(pageKey, cvData.educationSections || [], cvData);

  const bgScale = parseFloat(cvData.webTexts?.[`${prefix}_header_bg_scale`] || '1');
  const bgX = parseInt(cvData.webTexts?.[`${prefix}_header_bg_x`] || '0', 10);
  const bgY = parseInt(cvData.webTexts?.[`${prefix}_header_bg_y`] || '0', 10);

  const {
    subpageBgStyle,
    subpageBgOpacity,
    subpageBgScale,
    subpageBgColor,
    subpageCustomSvg,
    subpageCustomUrl,
    subpageBgColorVal,
  } = getSubpageBgSettings(prefix, cvData, isDark);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="min-h-screen pb-16 font-sans relative overflow-hidden"
      style={{ backgroundColor: subpageBgColorVal }}
    >
      <SectionGradientShadow 
        sectionKey={prefix} 
        webTexts={cvData.webTexts} 
        theme={theme} 
        accentHex={getThemeColorPalette(cvData.layoutSettings?.themeColor || 'blue').primary}
      />

      {subpageBgStyle && subpageBgStyle !== 'none' && (
        <BackgroundTextures
          type={subpageBgStyle}
          theme={theme}
          opacity={subpageBgOpacity ? parseFloat(subpageBgOpacity) : undefined}
          scale={subpageBgScale ? parseFloat(subpageBgScale) : undefined}
          color={subpageBgColor || undefined}
          customSvg={subpageCustomSvg || undefined}
          customBgUrl={subpageCustomUrl || undefined}
        />
      )}

      <FloatingAssetsOverlay 
        sectionId={prefix} 
        assets={cvData.floatingAssets} 
        theme={theme}
        bgColor={subpageBgColorVal}
      />

      <div className="absolute top-0 left-0 right-0 h-[540px] pointer-events-none overflow-hidden z-0">
        <img 
          src={bgUrl} 
          alt={`${title} Banner`} 
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover select-none pointer-events-none ${
            isDark ? 'opacity-25' : 'opacity-[0.35]'
          }`}
          style={{ 
            transform: `scale(${bgScale}) translate(${bgX / 5}%, ${bgY / 5}%)`,
            transformOrigin: 'center center'
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={createFadeGradientStyle(subpageBgColorVal)} 
        />
      </div>

      <div className="py-24 px-4 text-center relative overflow-hidden transition-colors duration-300 z-10">
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            className={`font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              color: isDark 
                ? (cvData.webTexts?.[`${prefix}_title_color_dark`] || undefined) 
                : (cvData.webTexts?.[`${prefix}_title_color`] || undefined)
            }}
          >
            {title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className={`font-sans text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-650'
            }`}
            style={{
              color: isDark 
                ? (cvData.webTexts?.[`${prefix}_intro_color_dark`] || cvData.webTexts?.[`${prefix}_subtitle_color_dark`] || undefined) 
                : (cvData.webTexts?.[`${prefix}_intro_color`] || cvData.webTexts?.[`${prefix}_subtitle_color`] || undefined)
            }}
          >
            <MarkdownText content={intro} theme={theme} />
          </motion.div>
        </div>
      </div>

      {displaySections.length === 0 ? (
        pageKey === 'skills' ? (
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
            <SkillsArsenal 
              skills={cvData.skills} 
              theme={theme} 
              customCategories={cvData.skillCategories} 
              lang={lang} 
              viewMode="detailed" 
            />
          </div>
        ) : (
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto py-16 px-4">
            <div className={`p-12 rounded-2xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-400 text-sm font-bold">No custom slides/sheets created yet.</p>
              <p className="text-slate-550 text-xs mt-1">Configure sections/slides for this page in the Admin Panel.</p>
            </div>
          </div>
        )
      ) : (
        <div className="relative z-10 flex flex-col">
          {displaySections.map((section, idx) => (
            <SubPageSectionItem 
              key={section.id || idx}
              section={section}
              idx={idx}
              isDark={isDark}
              theme={theme}
              cvData={cvData}
              categoryLabel={categoryLabel}
              nextSection={displaySections[idx + 1]}
            />
          ))}
        </div>
      )}

      <div className={`h-24 w-full pointer-events-none -mt-24 relative z-20 ${
        isDark 
          ? 'bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent' 
          : 'bg-gradient-to-t from-[#f7f9fb] via-[#f7f9fb]/90 to-transparent'
      }`} />
    </motion.div>
  );
};

export default CustomSubPage;
