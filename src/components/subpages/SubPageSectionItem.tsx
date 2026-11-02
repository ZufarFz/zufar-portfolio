import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { CVData } from '../../types';
import MarkdownText from '../MarkdownText';
import { SmoothImage, renderIcon } from './subpageUtils';

interface SubPageSectionItemProps {
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
  let sectionBgClass = '';
  let textColor = '';
  let titleColor = '';
  let accentBadge = '';

  if (isDark) {
    if (bgOpt === 'emerald') {
      sectionBgClass = 'bg-gradient-to-br from-emerald-955/40 via-emerald-900/10 to-slate-955/30';
      textColor = 'text-emerald-200/90';
      titleColor = 'text-emerald-50 font-black';
      accentBadge = 'bg-emerald-955/80 border-emerald-500/30 text-emerald-400';
    } else if (bgOpt === 'indigo') {
      sectionBgClass = 'bg-gradient-to-br from-indigo-955/40 via-indigo-900/10 to-slate-955/30';
      textColor = 'text-indigo-200/90';
      titleColor = 'text-indigo-50 font-black';
      accentBadge = 'bg-indigo-955/80 border-indigo-500/30 text-indigo-400';
    } else if (bgOpt === 'amber') {
      sectionBgClass = 'bg-gradient-to-br from-amber-955/30 via-amber-900/10 to-slate-955/30';
      textColor = 'text-amber-200/90';
      titleColor = 'text-amber-50 font-black';
      accentBadge = 'bg-amber-955/80 border-amber-500/30 text-amber-400';
    } else if (bgOpt === 'rose') {
      sectionBgClass = 'bg-gradient-to-br from-rose-955/30 via-rose-900/10 to-slate-955/30';
      textColor = 'text-rose-200/90';
      titleColor = 'text-rose-50 font-black';
      accentBadge = 'bg-rose-955/80 border-rose-500/30 text-rose-400';
    } else if (bgOpt === 'dark') {
      sectionBgClass = 'bg-slate-955';
      textColor = 'text-slate-400';
      titleColor = 'text-slate-100 font-black';
      accentBadge = 'bg-slate-900 border-slate-800 text-slate-300';
    } else if (bgOpt === 'light') {
      sectionBgClass = 'bg-white/[0.03]';
      textColor = 'text-slate-400';
      titleColor = 'text-slate-100 font-black';
      accentBadge = 'bg-white/[0.05] border-white/[0.10] text-slate-300';
    } else {
      sectionBgClass = 'bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-955/30';
      textColor = 'text-slate-300/95';
      titleColor = 'text-white font-black';
      accentBadge = 'bg-slate-900 border-slate-800 text-slate-300';
    }
  } else {
    if (bgOpt === 'emerald') {
      sectionBgClass = 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/20 shadow-xs';
      textColor = 'text-emerald-900/80';
      titleColor = 'text-emerald-955 font-black';
      accentBadge = 'bg-emerald-100/70 border-emerald-200 text-emerald-800';
    } else if (bgOpt === 'indigo') {
      sectionBgClass = 'bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/20 shadow-xs';
      textColor = 'text-indigo-900/80';
      titleColor = 'text-indigo-955 font-black';
      accentBadge = 'bg-indigo-100/70 border-indigo-200 text-indigo-850';
    } else if (bgOpt === 'amber') {
      sectionBgClass = 'bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 shadow-xs';
      textColor = 'text-amber-900/80';
      titleColor = 'text-amber-955 font-black';
      accentBadge = 'bg-amber-100/70 border-amber-200 text-amber-850';
    } else if (bgOpt === 'rose') {
      sectionBgClass = 'bg-gradient-to-br from-rose-50/60 via-white to-rose-50/20 shadow-xs';
      textColor = 'text-rose-900/80';
      titleColor = 'text-rose-955 font-black';
      accentBadge = 'bg-rose-100/70 border-rose-200 text-rose-850';
    } else if (bgOpt === 'dark') {
      sectionBgClass = 'bg-slate-900 text-white shadow-md';
      textColor = 'text-slate-300';
      titleColor = 'text-white font-black';
      accentBadge = 'bg-slate-800 border-slate-700 text-slate-200';
    } else if (bgOpt === 'light') {
      sectionBgClass = 'bg-white shadow-2xs';
      textColor = 'text-slate-650';
      titleColor = 'text-slate-900 font-black';
      accentBadge = 'bg-slate-50 border-slate-200 text-slate-700';
    } else {
      sectionBgClass = 'bg-gradient-to-b from-slate-100/50 via-white to-slate-50/30 shadow-2xs';
      textColor = 'text-slate-650';
      titleColor = 'text-slate-900 font-black';
      accentBadge = 'bg-slate-150 border-slate-250 text-slate-700';
    }
  }

  let displayTitle = section.title;
  let displayBadge = categoryLabel;
  let displayContent = section.content;
  let iconName = "";
  let linkedDetailsNode = null;

  if (section.linkedEducationDegree) {
    if (section.linkedEducationDegree.startsWith("item:personality:")) {
      const itemId = section.linkedEducationDegree.replace("item:personality:", "");
      const item = cvData.personality?.find(p => p.id === itemId);
      if (item) {
        displayTitle = item.title;
        displayBadge = "Personality & Values";
        displayContent = item.description;
        iconName = item.icon;
      }
    } else if (section.linkedEducationDegree.startsWith("item:hobbies:")) {
      const itemId = section.linkedEducationDegree.replace("item:hobbies:", "");
      const item = cvData.hobbies?.find(h => h.id === itemId);
      if (item) {
        displayTitle = item.title;
        displayBadge = "Hobbies & Interests";
        displayContent = item.description;
        iconName = item.icon;
      }
    } else if (section.linkedEducationDegree.startsWith("item:career-goals:")) {
      const itemId = section.linkedEducationDegree.replace("item:career-goals:", "");
      const item = cvData.careerGoals?.find(cg => cg.id === itemId);
      if (item) {
        displayTitle = item.title;
        displayBadge = `Target Year: ${item.target_year}`;
        displayContent = item.description;
        iconName = item.icon;
      }
    } else if (section.linkedEducationDegree.startsWith("item:skills:")) {
      const itemId = section.linkedEducationDegree.replace("item:skills:", "");
      const item = cvData.skills?.find(s => s.id === itemId);
      if (item) {
        displayTitle = item.name;
        displayBadge = `Skill — ${item.category}`;
        displayContent = item.description;
        iconName = item.icon;
      }
    } else if (section.linkedEducationDegree.startsWith("item:career-journey:")) {
      const itemId = section.linkedEducationDegree.replace("item:career-journey:", "");
      const item = cvData.experiences?.find(exp => exp.id === itemId);
      if (item) {
        displayTitle = `${item.role} @ ${item.company}`;
        displayBadge = item.period;
        displayContent = item.bulletPoints.join("\n• ");
        iconName = "Briefcase";
        
        if (item.tools && item.tools.length > 0) {
          linkedDetailsNode = (
            <div className="flex flex-wrap gap-1 mt-4">
              {item.tools.map((tool: string, tIdx: number) => (
                <span key={tIdx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}>
                  {tool}
                </span>
              ))}
            </div>
          );
        }
      }
    } else {
      const linkedEdu = cvData.education?.find(e => {
        const compositeKey = `${e.degree}|||${e.institution}`;
        return e.id === section.linkedEducationDegree || e.degree === section.linkedEducationDegree || compositeKey === section.linkedEducationDegree;
      });
      if (linkedEdu) {
        displayTitle = `${linkedEdu.institution} — ${linkedEdu.degree}`;
        displayBadge = linkedEdu.degree;
        const eduDesc = linkedEdu.description || '';
        const sectionContent = section.content || '';
        if (eduDesc.trim()) {
          const cleanedSec = sectionContent.trim();
          const isDefaultTemplate = cleanedSec === 'Keterangan atau narasi untuk lembar ini. Jelaskan secara detail mata kuliah, aktivitas, atau kisah perjuangan Anda di institusi terkait.';
          if (cleanedSec && !isDefaultTemplate) {
            displayContent = `${eduDesc}\n\n${sectionContent}`;
          } else {
            displayContent = eduDesc;
          }
        }
        iconName = "GraduationCap";
      }
    }
  }

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
  let imgAspectClass = orient === 'portrait' ? 'aspect-[3/4]' : orient === 'square' ? 'aspect-square' : 'aspect-[16/10]';

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
    if (orient === 'portrait') {
      sizeClass = 'w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto';
    } else {
      sizeClass = 'w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto';
    }
  } else {
    if (isNumeric) {
      const numericVal = parseInt(String(size), 10);
      if (!isNaN(numericVal)) {
        const percent = Math.max(10, Math.min(100, numericVal));
        imageStyle = { maxWidth: `${percent}%` };
        sizeClass = 'w-full mx-auto';
      }
    } else {
      if (orient === 'portrait') {
        if (size === 'small') sizeClass = 'max-w-[200px] sm:max-w-[240px]';
        else if (size === 'large') sizeClass = 'max-w-[360px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[560px] 2xl:max-w-[620px]';
        else sizeClass = 'max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] 2xl:max-w-[480px]';
      } else {
        if (size === 'small') sizeClass = 'max-w-xs md:max-w-sm';
        else if (size === 'large') sizeClass = 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl';
        else sizeClass = 'max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl';
      }
    }
  }

  const renderLinkedEduCard = () => {
    if (!section.linkedEducationDegree) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mt-4 px-4 py-2 rounded-full border text-left flex items-center justify-between gap-3 transition-colors w-fit ${
          isDark 
            ? 'bg-slate-955/60 border-emerald-500/20 hover:border-emerald-500/40' 
            : 'bg-emerald-50/50 border-emerald-100 shadow-xs hover:border-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2 text-emerald-500 font-mono text-[9px] font-extrabold uppercase tracking-widest">
          <Check className="w-3.5 h-3.5 animate-pulse" />
          <span>Verifikasi Kredensial Resmi • {displayBadge}</span>
        </div>
      </motion.div>
    );
  };

  const sectionMarginClass = idx === 0 ? '-mt-10 sm:-mt-14' : '-mt-15 sm:-mt-20';
  const maskStyle: React.CSSProperties = {
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
  };

  const renderParagraphBlock = () => {
    const pAlignClass = pLayout === 'center' ? 'text-center' : pLayout === 'right' ? 'text-right' : 'text-left';

    return (
      <div className="space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className={`font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight ${titleColor} ${pAlignClass}`}
        >
          {displayTitle}
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className={`font-sans text-xs sm:text-sm leading-relaxed ${alignClass} ${textColor}`}
        >
          <MarkdownText content={displayContent} theme={theme} />
        </motion.div>
        {linkedDetailsNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          >
            {linkedDetailsNode}
          </motion.div>
        )}
      </div>
    );
  };

  const renderImageBlock = () => {
    if (isBgMode) return null;
    const wrapperAlignClass = iLayout === 'center' ? 'justify-center' : iLayout === 'right' ? 'justify-end' : 'justify-start';

    if (section.imageUrl) {
      return (
        <div className={`w-full flex ${wrapperAlignClass} overflow-hidden rounded-2xl`}>
          <SmoothImage 
            src={section.imageUrl} 
            alt={displayTitle} 
            className={`rounded-2xl shadow-lg border object-cover transition-all duration-500 hover:scale-[1.01] ${imgAspectClass} ${sizeClass}`}
            targetOpacity={finalOpacity}
            style={{ 
              ...imageStyle,
              transform: `scale(${section.imageScale || 1}) translate(${section.imageX || 0}px, ${section.imageY || 0}px)`,
              borderColor: isDark ? '#1e293b' : '#e2e8f0' 
            }}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    } else {
      return (
        <div className={`w-full flex ${wrapperAlignClass}`}>
          <div className={`rounded-2xl border aspect-video flex flex-col items-center justify-center p-6 ${
            isDark ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'
          } ${sizeClass}`} style={imageStyle}>
            <div className={`p-4 rounded-full mb-3 ${isDark ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-emerald-700'}`}>
              {renderIcon(iconName || 'Award', "w-6 h-6")}
            </div>
            <span className="text-slate-400 font-bold text-xs font-mono">Visual Node</span>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.section 
      key={section.id || idx}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden transition-colors duration-300 ${sectionBgClass} ${
        isBgMode 
          ? 'min-h-[80vh] pt-32 pb-24 sm:pt-40 sm:pb-40 flex items-center' 
          : 'pt-28 pb-24 sm:pt-40 sm:pb-38'
      } ${sectionMarginClass}`}
      style={maskStyle}
    >
      {isDark && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      )}

      {/* Absolute full background image overlay if background mode is active */}
      {isBgMode && section.imageUrl && (
        (() => {
          const containerClass = "absolute inset-0 z-0 select-none pointer-events-none overflow-hidden";
          let objectPositionClass = "object-cover";

          if (imgModel === 'bg_smooth') {
            if (iLayout === 'left') {
              objectPositionClass = "object-cover object-left";
            } else if (iLayout === 'right') {
              objectPositionClass = "object-cover object-right";
            }
          }

          return (
            <div className={containerClass}>
              <div 
                className="w-full h-full origin-center"
                style={{
                  transform: `scale(${section.imageScale || 1}) translate(${section.imageX || 0}px, ${section.imageY || 0}px)`,
                  ...imgMaskStyle,
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat'
                }}
              >
                <SmoothImage 
                  src={section.imageUrl} 
                  alt="Slide Background Visual" 
                  className={`w-full h-full ${objectPositionClass}`}
                  targetOpacity={finalOpacity}
                  referrerPolicy="no-referrer"
                  showSkeleton={false}
                />
              </div>
            </div>
          );
        })()
      )}

      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1560px] mx-auto w-full relative z-10">
        {isSideBySide ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 xl:gap-16 2xl:gap-24 items-center">
            <div className={`${pLayout === 'left' ? 'md:order-1' : 'md:order-2'} w-full`}>
              {renderParagraphBlock()}
            </div>
            <div className={`${pLayout === 'left' ? 'md:order-2' : 'md:order-1'} w-full`}>
              {renderImageBlock()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full">
            <div className={
              pLayout === 'center' 
                ? 'mx-auto text-center max-w-4xl xl:max-w-5xl 2xl:max-w-6xl' 
                : pLayout === 'right' 
                  ? 'ml-auto text-right w-full md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] 2xl:max-w-[50%]' 
                  : 'mr-auto text-left w-full md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] 2xl:max-w-[50%]'
            }>
              {renderParagraphBlock()}
            </div>
            {!isBgMode && (
              <div className="w-full">
                {renderImageBlock()}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default SubPageSectionItem;
