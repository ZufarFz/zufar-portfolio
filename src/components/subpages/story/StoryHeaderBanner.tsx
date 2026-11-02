import React from 'react';
import { motion } from 'motion/react';
import MarkdownText from '../../MarkdownText';
import { createFadeGradientStyle } from '../subpageUtils';

interface StoryHeaderBannerProps {
  titleText: string;
  introText: string;
  theme: 'light' | 'dark';
  isDark: boolean;
  activeBgColor: string;
  backgroundImageUrl?: string;
  bgScale: number;
  bgX: number;
  bgY: number;
  bgOpacity?: string;
  titleColor?: string;
  introColor?: string;
}

export const StoryHeaderBanner: React.FC<StoryHeaderBannerProps> = ({
  titleText,
  introText,
  theme,
  isDark,
  activeBgColor,
  backgroundImageUrl,
  bgScale,
  bgX,
  bgY,
  bgOpacity,
  titleColor,
  introColor,
}) => {
  return (
    <>
      {/* Absolute Header Background Image Band */}
      {backgroundImageUrl && (
        <div className="absolute top-0 left-0 right-0 h-[480px] pointer-events-none overflow-hidden z-0">
          <img 
            src={backgroundImageUrl} 
            alt="About Background" 
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover select-none pointer-events-none ${
              isDark ? 'opacity-30' : 'opacity-40'
            }`}
            style={{ 
              transform: `scale(${bgScale}) translate(${bgX / 5}%, ${bgY / 5}%)`,
              transformOrigin: 'center center',
              opacity: bgOpacity ? parseFloat(bgOpacity) : undefined
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={createFadeGradientStyle(activeBgColor)} 
          />
        </div>
      )}

      {/* Symmetrical Header - Topmost layer */}
      <div className="text-center pt-8 pb-3 sm:pb-12 max-w-3xl mx-auto relative z-50 px-6 pointer-events-auto">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className={`font-sans font-black text-4xl sm:text-5xl mt-3 mb-4 select-none transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
          style={{ color: titleColor }}
        >
          {titleText}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className={`font-sans text-[13px] sm:text-base leading-relaxed transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
          style={{ color: introColor }}
        >
          <MarkdownText content={introText} theme={theme} />
        </motion.div>
      </div>
    </>
  );
};

export default StoryHeaderBanner;
