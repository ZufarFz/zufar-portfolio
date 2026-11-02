import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CVData, CaseStudy } from '../../../types';
import { ProjectsGalleryActiveCard } from './ProjectsGalleryActiveCard';
import { ProjectsGalleryThumbnails, DisplayProjectItem } from './ProjectsGalleryThumbnails';

export interface ProjectsGallerySubPageProps {
  cvData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  subPage: string;
}

export const ProjectsGallerySubPage: React.FC<ProjectsGallerySubPageProps> = ({
  cvData,
  theme,
}) => {
  const isDark = theme === 'dark';
  const list = cvData.caseStudies || [];

  const [virtualActiveIdx, setVirtualActiveIdx] = useState(0);
  const prevVirtualActiveIdxRef = useRef(virtualActiveIdx);
  const [thumbWidth, setThumbWidth] = useState(112);
  const [viewWidth, setViewWidth] = useState(484);

  useEffect(() => {
    prevVirtualActiveIdxRef.current = virtualActiveIdx;
  }, [virtualActiveIdx]);

  useEffect(() => {
    const handleResize = () => {
      let w = 484;
      if (window.innerWidth < 640) {
        setThumbWidth(80);
        w = Math.max(160, window.innerWidth - 136);
      } else if (window.innerWidth < 768) {
        setThumbWidth(80);
        w = Math.max(240, window.innerWidth - 152);
      } else if (window.innerWidth < 1024) {
        setThumbWidth(90);
        w = 296;
      } else if (window.innerWidth < 1440) {
        setThumbWidth(96);
        w = 314;
      } else {
        setThumbWidth(112);
        w = 484;
      }
      setViewWidth(w);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const N = list.length;
  let displayList: DisplayProjectItem[] = [];
  if (N > 0) {
    if (N === 1) {
      displayList = Array(6).fill(list[0]).map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: 0 }));
    } else if (N === 2) {
      displayList = [list[0], list[1], list[0], list[1], list[0], list[1]].map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else if (N === 3) {
      displayList = [list[0], list[1], list[2], list[0], list[1], list[2]].map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else if (N === 4) {
      displayList = [list[0], list[1], list[2], list[3], list[0], list[1], list[2], list[3]].map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else if (N === 5) {
      displayList = [list[0], list[1], list[2], list[3], list[4], list[0], list[1], list[2], list[3], list[4]].map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else {
      displayList = list.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx }));
    }
  }

  const M = displayList.length;
  const activeMIdx = M > 0 ? ((virtualActiveIdx % M) + M) % M : 0;
  const prevActiveMIdx = M > 0 ? ((prevVirtualActiveIdxRef.current % M) + M) % M : 0;
  const safeActiveIdx = displayList[activeMIdx] ? displayList[activeMIdx].originalIdx : 0;
  const activeProject = list[safeActiveIdx];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`min-h-screen pb-12 font-sans relative overflow-hidden flex flex-col justify-between ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f7f9fb] text-slate-900'
      }`}
    >
      {/* Immersive Full Screen Background Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeProject?.id || 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img 
              src={(activeProject?.image) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'} 
              alt={activeProject?.title || 'Project Background'} 
              className="w-full h-full object-cover select-none pointer-events-none blur-md scale-105"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Showcase Slider Section */}
      {list.length > 0 && activeProject && (
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pt-12 md:pt-16 lg:pt-24 pb-12 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-auto md:h-[600px] lg:h-[650px] xl:h-[700px] flex flex-col justify-end py-4 md:py-8"
          >
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6 md:gap-6 lg:gap-8 xl:gap-12 my-auto">
              <ProjectsGalleryActiveCard activeProject={activeProject} isDark={isDark} />
              
              <div className="w-full md:w-auto flex flex-col justify-end items-stretch md:items-end gap-3 z-30 md:self-end shrink-0 pt-4 md:pt-0">
                {N > 1 && (
                  <ProjectsGalleryThumbnails
                    displayList={displayList}
                    activeMIdx={activeMIdx}
                    prevActiveMIdx={prevActiveMIdx}
                    thumbWidth={thumbWidth}
                    viewWidth={viewWidth}
                    isDark={isDark}
                    onSelectRelative={(dist) => setVirtualActiveIdx(prev => prev + dist)}
                    onPrev={() => setVirtualActiveIdx(prev => prev - 1)}
                    onNext={() => setVirtualActiveIdx(prev => prev + 1)}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsGallerySubPage;

