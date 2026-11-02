import React from 'react';
import { motion } from 'motion/react';
import { CVData } from '../../../types';
import MarkdownText from '../../common/MarkdownText';
import { getSectionThemeColors, resolveSectionDetails } from './sectionThemeHelpers';
import { SectionCredentialBadge } from './SectionCredentialBadge';
import { SectionMediaCard, SectionBgOverlay } from './SectionMediaCard';

export interface SubPageSectionItemProps {
  section: any;
  idx: number;
  isDark: boolean;
  theme: 'light' | 'dark';
  cvData: CVData;
  categoryLabel: string;
  nextSection?: any;
}

export const SubPageSectionItem: React.FC<SubPageSectionItemProps> = ({
  section,
  idx,
  isDark,
  theme,
  cvData,
  categoryLabel,
}) => {
  const bgOpt = section.bgColor || 'slate';
  const { sectionBgClass, textColor, titleColor } = getSectionThemeColors(bgOpt, isDark);
  const { displayTitle, displayBadge, displayContent, iconName, tools } = resolveSectionDetails(section, cvData, categoryLabel);

  // Layout calculations
  const rawLayout = section.layoutType || 'image_right';
  let pLayout: 'left' | 'center' | 'right' = 'left';
  let iLayout: 'left' | 'center' | 'right' = 'right';

  if (rawLayout === 'image_left') {
    pLayout = 'right';
    iLayout = 'left';
  } else if (rawLayout === 'image_right') {
    pLayout = 'left';
    iLayout = 'right';
  } else if (rawLayout === 'centered_hero') {
    pLayout = 'center';
    iLayout = 'center';
  } else if (rawLayout.includes(':')) {
    const parts = rawLayout.split(':');
    pLayout = (parts[0] as any) || 'left';
    iLayout = (parts[1] as any) || 'right';
  }

  const isSideBySide = (pLayout === 'left' && iLayout === 'right') || (pLayout === 'right' && iLayout === 'left');
  const alignClass = pLayout === 'center' ? 'text-center mx-auto' : pLayout === 'right' ? 'text-right ml-auto' : 'text-left mr-auto';

  const orient = section.imageOrientation || 'landscape';
  const imgAspectClass = orient === 'portrait' ? 'aspect-[3/4]' : orient === 'square' ? 'aspect-square' : 'aspect-[16/10]';

  const imgModel = section.imageModel || (
    (orient === 'background_full' || orient === 'background_edge') 
      ? (orient === 'background_edge' ? 'bg_smooth' : 'bg_full') 
      : 'normal'
  );
  const isBgMode = imgModel === 'bg_full' || imgModel === 'bg_smooth';

  let finalOpacity = 1;
  if (section.imageOpacity !== undefined && section.imageOpacity !== null && section.imageOpacity !== '') {
    const parsed = parseFloat(String(section.imageOpacity));
    if (!isNaN(parsed)) finalOpacity = parsed;
  } else if (isBgMode) {
    finalOpacity = isDark ? 0.35 : 0.45;
  }

  const imgMaskStyle: React.CSSProperties = {};
  if (imgModel === 'bg_smooth') {
    const fadeDepth = section.imageFadeDepth !== undefined && section.imageFadeDepth !== null ? section.imageFadeDepth : 66;
    const fadeWidth = section.imageFadeWidth !== undefined && section.imageFadeWidth !== null ? section.imageFadeWidth : 88;
    if (iLayout === 'left') {
      imgMaskStyle.maskImage = `linear-gradient(to right, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
      imgMaskStyle.WebkitMaskImage = `linear-gradient(to right, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
    } else if (iLayout === 'right') {
      imgMaskStyle.maskImage = `linear-gradient(to left, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
      imgMaskStyle.WebkitMaskImage = `linear-gradient(to left, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
    } else {
      imgMaskStyle.maskImage = `radial-gradient(ellipse at center, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
      imgMaskStyle.WebkitMaskImage = `radial-gradient(ellipse at center, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
    }
  }

  const size = section.imageSize || 'medium';
  const isNumeric = typeof size === 'number' || (typeof size === 'string' && !isNaN(parseInt(size, 10)) && !['small', 'medium', 'large'].includes(size));
  let sizeClass = 'w-full';
  let imageStyle: React.CSSProperties = {};

  if (rawLayout === 'centered_hero') {
    sizeClass = orient === 'portrait' ? 'w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto' : 'w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto';
  } else if (isNumeric) {
    const numericVal = parseInt(String(size), 10);
    if (!isNaN(numericVal)) {
      imageStyle = { maxWidth: `${Math.max(10, Math.min(100, numericVal))}%` };
      sizeClass = 'w-full mx-auto';
    }
  } else if (orient === 'portrait') {
    if (size === 'small') sizeClass = 'max-w-[200px] sm:max-w-[240px]';
    else if (size === 'large') sizeClass = 'max-w-[360px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[560px] 2xl:max-w-[620px]';
    else sizeClass = 'max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] 2xl:max-w-[480px]';
  } else {
    if (size === 'small') sizeClass = 'max-w-xs md:max-w-sm';
    else if (size === 'large') sizeClass = 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl';
    else sizeClass = 'max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl';
  }

  const sectionMarginClass = idx === 0 ? '-mt-10 sm:-mt-14' : '-mt-15 sm:-mt-20';
  const maskStyle: React.CSSProperties = {
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
  };

  const pAlignClass = pLayout === 'center' ? 'text-center' : pLayout === 'right' ? 'text-right' : 'text-left';

  return (
    <motion.section 
      key={section.id || idx}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden transition-colors duration-300 ${sectionBgClass} ${
        isBgMode ? 'min-h-[80vh] pt-32 pb-24 sm:pt-40 sm:pb-40 flex items-center' : 'pt-28 pb-24 sm:pt-40 sm:pb-38'
      } ${sectionMarginClass}`}
      style={maskStyle}
    >
      {isDark && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      )}

      {isBgMode && section.imageUrl && (
        <SectionBgOverlay
          section={section}
          imgModel={imgModel}
          iLayout={iLayout}
          imgMaskStyle={imgMaskStyle}
          finalOpacity={finalOpacity}
        />
      )}

      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1560px] mx-auto w-full relative z-10">
        {isSideBySide ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 xl:gap-16 2xl:gap-24 items-center">
            <div className={`${pLayout === 'left' ? 'md:order-1' : 'md:order-2'} w-full space-y-4`}>
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className={`font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight ${titleColor} ${pAlignClass}`}
              >
                {displayTitle}
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className={`font-sans text-xs sm:text-sm leading-relaxed ${alignClass} ${textColor}`}
              >
                <MarkdownText content={displayContent} theme={theme} />
              </motion.div>
              {section.linkedEducationDegree && (
                <SectionCredentialBadge displayBadge={displayBadge} isDark={isDark} />
              )}
              {tools && tools.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {tools.map((tool: string, tIdx: number) => (
                    <span key={tIdx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${
                      isDark ? 'bg-slate-955 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className={`${pLayout === 'left' ? 'md:order-2' : 'md:order-1'} w-full`}>
              <SectionMediaCard
                section={section}
                displayTitle={displayTitle}
                isDark={isDark}
                iLayout={iLayout}
                imgAspectClass={imgAspectClass}
                sizeClass={sizeClass}
                finalOpacity={finalOpacity}
                imageStyle={imageStyle}
                iconName={iconName}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full">
            <div className={
              pLayout === 'center' 
                ? 'mx-auto text-center max-w-4xl xl:max-w-5xl 2xl:max-w-6xl space-y-4' 
                : pLayout === 'right' 
                  ? 'ml-auto text-right w-full md:max-w-[50%] space-y-4' 
                  : 'mr-auto text-left w-full md:max-w-[50%] space-y-4'
            }>
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className={`font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight ${titleColor} ${pAlignClass}`}
              >
                {displayTitle}
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className={`font-sans text-xs sm:text-sm leading-relaxed ${alignClass} ${textColor}`}
              >
                <MarkdownText content={displayContent} theme={theme} />
              </motion.div>
              {section.linkedEducationDegree && (
                <SectionCredentialBadge displayBadge={displayBadge} isDark={isDark} />
              )}
            </div>
            {!isBgMode && (
              <div className="w-full">
                <SectionMediaCard
                  section={section}
                  displayTitle={displayTitle}
                  isDark={isDark}
                  iLayout={iLayout}
                  imgAspectClass={imgAspectClass}
                  sizeClass={sizeClass}
                  finalOpacity={finalOpacity}
                  imageStyle={imageStyle}
                  iconName={iconName}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default SubPageSectionItem;

