import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CVData } from '../../types';
import SocialIcon, { getAbsoluteSocialUrl } from '../common/SocialIcon';

interface SocialFooterButtonProps {
  s: any;
  theme: 'light' | 'dark';
}

function SocialFooterButton({ s, theme }: SocialFooterButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ y: 25, scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
            exit={{
              scaleX: 0,
              y: [0, 0, 25],
              scaleY: [1, 1, 0],
              opacity: [1, 1, 0],
              transition: {
                scaleX: { duration: 0.15, ease: "easeIn" },
                y: { duration: 0.2, times: [0, 0.4, 1], delay: 0.1 },
                scaleY: { duration: 0.2, times: [0, 0.4, 1], delay: 0.1 },
                opacity: { duration: 0.2, times: [0, 0.4, 1], delay: 0.1 }
              }
            }}
            transition={{
              y: { duration: 0.2, ease: "easeOut" },
              scaleY: { duration: 0.2, ease: "easeOut" },
              opacity: { duration: 0.2, ease: "easeOut" },
              scaleX: { duration: 0.25, delay: 0.1, ease: "easeOut" }
            }}
            style={{ originX: 0.5, originY: 1 }}
            className={`absolute bottom-full mb-3 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold whitespace-nowrap shadow-lg z-50 ${
              theme === 'dark'
                ? 'bg-slate-950 text-emerald-400 border-slate-800 shadow-black/50'
                : 'bg-white text-emerald-600 border-slate-200 shadow-slate-200/50'
            }`}
          >
            {s.value || s.name}
            {/* Elegant tiny bottom anchor triangle / arrow pointing down */}
            <div className={`absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rotate-45 border-r border-b -mt-1 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          const target = s.usernameOrUrl || s.value || '';
          const url = getAbsoluteSocialUrl(target, s.name || 'custom');
          window.open(url, '_blank', 'noreferrer');
        }}
        className={`h-8 w-8 sm:h-9 sm:w-9 rounded-md sm:rounded-lg transition-all duration-300 border cursor-pointer flex items-center justify-center group ${
          theme === 'dark' 
            ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white hover:border-slate-600' 
            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
        }`}
        title={`Open ${s.name}: ${s.value || s.usernameOrUrl}`}
      >
        <SocialIcon platform={s.name} size={16} className="w-4 h-4 transition-transform group-hover:scale-110" useBrandColor={true} />
      </button>
    </div>
  );
}

interface FooterProps {
  activeCVData: CVData;
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ activeCVData, theme }) => {
  const socials = (activeCVData.customSocials || [])
    .filter(s => (s.value || s.usernameOrUrl) && s.showOnWeb !== false);

  return (
    <footer 
      className={`transition-colors duration-250 py-6 sm:py-10 border-t ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 text-slate-400' 
          : 'bg-white border-slate-200 text-slate-500'
      }`}
      style={
        theme === 'dark'
          ? (activeCVData.webTexts?.footer_bg_color_dark ? { backgroundColor: activeCVData.webTexts.footer_bg_color_dark } : undefined)
          : (activeCVData.webTexts?.footer_bg_color ? { backgroundColor: activeCVData.webTexts.footer_bg_color } : undefined)
      }
    >
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center sm:justify-start">
          <p className="font-mono text-[9px] sm:text-[10px] text-slate-500 text-center sm:text-left select-none">
            © 2026 {activeCVData.name || 'Portfolio'}. Released under MIT License.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {socials.map((s) => (
            <SocialFooterButton key={s.id} s={s} theme={theme} />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
