import React from 'react';
import { SmoothImage, renderIcon } from '../subpageUtils';

interface SectionMediaCardProps {
  section: any;
  displayTitle: string;
  isDark: boolean;
  iLayout: 'left' | 'center' | 'right';
  imgAspectClass: string;
  sizeClass: string;
  finalOpacity: number;
  imageStyle: React.CSSProperties;
  iconName: string;
}

export const SectionMediaCard: React.FC<SectionMediaCardProps> = ({
  section,
  displayTitle,
  isDark,
  iLayout,
  imgAspectClass,
  sizeClass,
  finalOpacity,
  imageStyle,
  iconName
}) => {
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
  }

  return (
    <div className={`w-full flex ${wrapperAlignClass}`}>
      <div 
        className={`rounded-2xl border aspect-video flex flex-col items-center justify-center p-6 ${
          isDark ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'
        } ${sizeClass}`} 
        style={imageStyle}
      >
        <div className={`p-4 rounded-full mb-3 ${isDark ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-emerald-700'}`}>
          {renderIcon(iconName || 'Award', 'w-6 h-6')}
        </div>
        <span className="text-slate-400 font-bold text-xs font-mono">Visual Node</span>
      </div>
    </div>
  );
};

interface SectionBgOverlayProps {
  section: any;
  imgModel: string;
  iLayout: 'left' | 'center' | 'right';
  imgMaskStyle: React.CSSProperties;
  finalOpacity: number;
}

export const SectionBgOverlay: React.FC<SectionBgOverlayProps> = ({
  section,
  imgModel,
  iLayout,
  imgMaskStyle,
  finalOpacity
}) => {
  let objectPositionClass = 'object-cover';

  if (imgModel === 'bg_smooth') {
    if (iLayout === 'left') {
      objectPositionClass = 'object-cover object-left';
    } else if (iLayout === 'right') {
      objectPositionClass = 'object-cover object-right';
    }
  }

  return (
    <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
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
};

export default SectionMediaCard;
