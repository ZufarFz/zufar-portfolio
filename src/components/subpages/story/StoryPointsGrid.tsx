import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  Sparkles, 
  Heart, 
  LayoutGrid 
} from 'lucide-react';
import MarkdownText from '../../common/MarkdownText';
import { StoryMobileQuickGrid, getStoryCustomIcon } from './StoryMobileQuickGrid';

interface StoryPointsGridProps {
  theme: 'light' | 'dark';
  isDark: boolean;
  isIndo: boolean;
  leftPoints: Array<{ title: string; desc: string; path: string }>;
  rightPoints: Array<{ title: string; desc: string; path: string }>;
  customSubPages: any[];
  onPointClick: (hashPath: string) => void;
}

export const StoryPointsGrid: React.FC<StoryPointsGridProps> = ({
  theme,
  isDark,
  isIndo,
  leftPoints,
  rightPoints,
  customSubPages,
  onPointClick,
}) => {
  const cardBgClass = isDark 
    ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
    : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs hover:shadow-md';

  const [left1, left2, left3] = leftPoints;
  const [right1, right2, right3] = rightPoints;

  return (
    <>
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 2xl:gap-18 items-stretch w-full relative z-0 pointer-events-none">
          
          {/* LEFT SIDE: Text Right Aligned on Desktop */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-between gap-8 order-2 lg:order-1 text-left lg:text-right relative z-0 pointer-events-auto">
            {/* Left 1: Education */}
            <div className="w-full lg:translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                onClick={() => onPointClick(left1.path)}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] ${cardBgClass}`}
              >
                <div className="flex items-center lg:justify-end gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-amber-400 group-hover:text-amber-300' : 'bg-white border border-slate-200 text-amber-600 shadow-sm group-hover:bg-amber-50'
                  }`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {left1.title}
                  </h3>
                </div>
                <div className={`font-sans text-xs leading-relaxed max-w-sm lg:ml-auto ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  <MarkdownText content={left1.desc} theme={theme} />
                </div>
              </motion.div>
            </div>

            {/* Left 2: Personality */}
            <div className="w-full lg:-translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onClick={() => onPointClick(left2.path)}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] ${cardBgClass}`}
              >
                <div className="flex items-center lg:justify-end gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-emerald-400 group-hover:text-emerald-300' : 'bg-white border border-slate-200 text-emerald-655 shadow-sm group-hover:bg-emerald-50'
                  }`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {left2.title}
                  </h3>
                </div>
                <div className={`font-sans text-xs leading-relaxed max-w-sm lg:ml-auto ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  <MarkdownText content={left2.desc} theme={theme} />
                </div>
              </motion.div>
            </div>

            {/* Left 3: Hobbies */}
            <div className="w-full lg:translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={() => onPointClick(left3.path)}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] ${cardBgClass}`}
              >
                <div className="flex items-center lg:justify-end gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-rose-400 group-hover:text-rose-300' : 'bg-white border border-slate-200 text-rose-655 shadow-sm group-hover:bg-rose-50'
                  }`}>
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {left3.title}
                  </h3>
                </div>
                <div className={`font-sans text-xs leading-relaxed max-w-sm lg:ml-auto ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  <MarkdownText content={left3.desc} theme={theme} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Spacer for desktop, mobile points grid for small screens */}
          <div className="lg:col-span-4 flex flex-col items-center justify-between order-1 lg:order-2 relative z-10 min-h-[460px] sm:min-h-[520px] lg:min-h-0 pointer-events-none">
            <StoryMobileQuickGrid 
              isDark={isDark}
              isIndo={isIndo}
              leftPoints={leftPoints}
              rightPoints={rightPoints}
              customSubPages={customSubPages}
              onPointClick={onPointClick}
            />
          </div>

          {/* RIGHT SIDE: Text Left Aligned */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-between gap-8 order-3 lg:order-3 text-left relative z-0 pointer-events-auto">
            {/* Right 1: Career Journey */}
            <div className="w-full lg:-translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                onClick={() => onPointClick(right1.path)}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] ${cardBgClass}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-sky-400 group-hover:text-sky-300' : 'bg-white border border-slate-200 text-sky-655 shadow-sm group-hover:bg-sky-50'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {right1.title}
                  </h3>
                </div>
                <div className={`font-sans text-xs leading-relaxed max-w-sm ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  <MarkdownText content={right1.desc} theme={theme} />
                </div>
              </motion.div>
            </div>

            {/* Right 2: Skills */}
            <div className="w-full lg:translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                onClick={() => onPointClick(right2.path)}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] ${cardBgClass}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-pink-400 group-hover:text-pink-300' : 'bg-white border border-slate-200 text-pink-600 shadow-sm group-hover:bg-pink-50'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {right2.title}
                  </h3>
                </div>
                <div className={`font-sans text-xs leading-relaxed max-w-sm ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  <MarkdownText content={right2.desc} theme={theme} />
                </div>
              </motion.div>
            </div>

            {/* Right 3: Projects */}
            <div className="w-full lg:-translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                onClick={() => onPointClick(right3.path)}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] ${cardBgClass}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-orange-400 group-hover:text-orange-350' : 'bg-white border border-slate-200 text-orange-655 shadow-sm group-hover:bg-orange-50'
                  }`}>
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {right3.title}
                  </h3>
                </div>
                <div className={`font-sans text-xs leading-relaxed max-w-sm ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  <MarkdownText content={right3.desc} theme={theme} />
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Custom Sub-Pages & Extra Chapters */}
      {customSubPages.length > 0 && (
        <div className="hidden lg:block mt-16 pt-8 border-t border-slate-700/30 max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 font-bold">
              {isIndo ? '✦ HALAMAN & BAB TAMBAHAN' : '✦ ADDITIONAL CHAPTERS'}
            </span>
            <h3 className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isIndo ? 'Eksplorasi Halaman Lainnya' : 'Explore More Sub-Pages'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customSubPages.map((page, idx) => (
              <motion.div
                key={page.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                onClick={() => onPointClick(`#/${page.id}`)}
                className={`group p-5 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] active:scale-[0.98] ${cardBgClass}`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-teal-400 group-hover:text-teal-300' : 'bg-white border border-slate-200 text-teal-600 shadow-sm group-hover:bg-teal-50'
                  }`}>
                    {getStoryCustomIcon(page.iconName)}
                  </div>
                  <h4 className={`font-sans font-extrabold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isIndo ? (page.title || page.titleEn || page.id) : (page.titleEn || page.title || page.id)}
                  </h4>
                </div>
                <p className={`font-sans text-xs leading-relaxed line-clamp-2 ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  {isIndo ? (page.subtitle || page.subtitleEn || '') : (page.subtitleEn || page.subtitle || '')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StoryPointsGrid;
