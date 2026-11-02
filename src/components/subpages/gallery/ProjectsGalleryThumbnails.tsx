import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CaseStudy } from '../../../types';

export interface DisplayProjectItem extends CaseStudy {
  displayKey: string;
  originalIdx: number;
}

interface ProjectsGalleryThumbnailsProps {
  displayList: DisplayProjectItem[];
  activeMIdx: number;
  prevActiveMIdx: number;
  thumbWidth: number;
  viewWidth: number;
  isDark: boolean;
  onSelectRelative: (dist: number, dir: 'next' | 'prev') => void;
  onPrev: () => void;
  onNext: () => void;
}

export function getRelIdx(idx: number, currentActiveMIdx: number, totalM: number): number {
  let relIdx = idx - currentActiveMIdx;
  while (relIdx < -1) {
    relIdx += totalM;
  }
  while (relIdx > 4) {
    relIdx -= totalM;
  }
  return relIdx;
}

export const ProjectsGalleryThumbnails: React.FC<ProjectsGalleryThumbnailsProps> = ({
  displayList,
  activeMIdx,
  prevActiveMIdx,
  thumbWidth,
  viewWidth,
  isDark,
  onSelectRelative,
  onPrev,
  onNext,
}) => {
  const M = displayList.length;

  return (
    <div className="flex items-center justify-between md:justify-end gap-2 w-full md:items-end">
      {/* Left Arrow Button */}
      <button
        onClick={onPrev}
        className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center hover:-translate-x-0.5 active:scale-95 shrink-0 ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700/80 shadow-md shadow-slate-955/20' 
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-md shadow-slate-200/20'
        }`}
        title="Projek Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </button>

      {/* Thumbnails Container */}
      <div style={{ width: viewWidth }} className="overflow-hidden h-[104px] sm:h-[120px] md:h-[136px] relative shrink-0">
        <div className="absolute inset-0 flex items-center">
          {displayList.map((p, idx) => {
            const isActive = idx === activeMIdx;
            const relIdx = getRelIdx(idx, activeMIdx, M);
            const prevRelIdx = getRelIdx(idx, prevActiveMIdx, M);
            const hasWrapped = Math.abs(relIdx - prevRelIdx) > 1.5;

            const distance = relIdx;
            let cardScale = 1;
            let cardOpacity = 0;
            const isClickable = distance >= 0 && distance <= 3;

            if (distance === 0) {
              cardScale = 1;
              cardOpacity = 1;
            } else if (distance === 1) {
              cardScale = 0.85;
              cardOpacity = 0.8;
            } else if (distance === 2) {
              cardScale = 0.72;
              cardOpacity = 0.55;
            } else if (distance === 3) {
              cardScale = 0.60;
              cardOpacity = 0.35;
            } else if (distance === -1 || distance === 4) {
              cardScale = 0.50;
              cardOpacity = 0;
            } else {
              cardScale = 0.4;
              cardOpacity = 0;
            }

            const thumbGap = thumbWidth >= 112 ? 12 : 10;
            const targetX = 6 + relIdx * (thumbWidth + thumbGap);

            return (
              <motion.div
                key={p.displayKey}
                style={{ 
                  pointerEvents: isClickable ? 'auto' : 'none',
                  width: thumbWidth,
                  height: thumbWidth
                }}
                onClick={() => {
                  if (idx === activeMIdx) return;
                  const dist = getRelIdx(idx, activeMIdx, M);
                  onSelectRelative(dist, idx > activeMIdx ? 'next' : 'prev');
                }}
                animate={{ 
                  scale: cardScale,
                  opacity: cardOpacity,
                  x: targetX
                }}
                transition={hasWrapped ? {
                  type: 'tween',
                  duration: 0
                } : {
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                  mass: 0.8
                }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 shrink-0 rounded-xl overflow-hidden border transition-colors duration-300 cursor-pointer group ${
                  isActive 
                    ? (isDark ? 'border-emerald-500/80 z-10' : 'border-emerald-600/80 z-10')
                    : (isDark 
                        ? 'border-white/10 hover:border-white/20' 
                        : 'border-slate-200 hover:border-slate-300')
                }`}
                title={`Tampilkan: ${p.title}`}
              >
                <img 
                  src={p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'} 
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-955/45 group-hover:bg-transparent transition-colors duration-300 flex items-end p-2.5 sm:p-3">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold font-mono text-white/90 truncate w-full drop-shadow-md">
                    {p.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={onNext}
        className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center hover:translate-x-0.5 active:scale-95 shrink-0 ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700/80 shadow-md shadow-slate-955/20' 
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-md shadow-slate-200/20'
        }`}
        title="Projek Berikutnya"
      >
        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </button>
    </div>
  );
};

export default ProjectsGalleryThumbnails;

