import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { CVData } from '../../types';

interface ProjectsGallerySubPageProps {
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
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
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

  // We want displayList to be repeated if N is small, so M is at least 6.
  let displayList: Array<any & { displayKey: string; originalIdx: number }> = [];
  if (N > 0) {
    if (N === 1) {
      displayList = Array(6).fill(list[0]).map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: 0 }));
    } else if (N === 2) {
      const arr = [list[0], list[1], list[0], list[1], list[0], list[1]];
      displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else if (N === 3) {
      const arr = [list[0], list[1], list[2], list[0], list[1], list[2]];
      displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else if (N === 4) {
      const arr = [list[0], list[1], list[2], list[3], list[0], list[1], list[2], list[3]];
      displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else if (N === 5) {
      const arr = [list[0], list[1], list[2], list[3], list[4], list[0], list[1], list[2], list[3], list[4]];
      displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
    } else {
      displayList = list.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx }));
    }
  }

  const M = displayList.length;
  const activeMIdx = M > 0 ? ((virtualActiveIdx % M) + M) % M : 0;
  const prevActiveMIdx = M > 0 ? ((prevVirtualActiveIdxRef.current % M) + M) % M : 0;

  const safeActiveIdx = displayList[activeMIdx] ? displayList[activeMIdx].originalIdx : 0;
  const activeProject = list[safeActiveIdx];

  const getRelIdx = (idx: number, currentActiveMIdx: number, totalM: number) => {
    let relIdx = idx - currentActiveMIdx;
    while (relIdx < -1) {
      relIdx += totalM;
    }
    while (relIdx > 4) {
      relIdx -= totalM;
    }
    return relIdx;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`min-h-screen pb-12 font-sans relative overflow-hidden flex flex-col justify-between ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f7f9fb] text-slate-900'
      }`}
    >
      {/* Immersive Background - Full Screen Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeProject?.id || 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={(activeProject?.image) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'} 
              alt={activeProject?.title || "Project Background"} 
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
            {/* Foreground content wrapper */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6 md:gap-6 lg:gap-8 xl:gap-12 my-auto">
              {/* Left Side: Selected Project Details */}
              <div className="w-full md:flex-1 md:min-w-0 flex flex-col justify-end items-start text-left gap-4 md:self-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`space-y-5 p-5 sm:p-8 md:p-10 rounded-3xl backdrop-blur-lg border w-full h-[480px] sm:h-[520px] md:h-[540px] lg:h-[590px] xl:h-[640px] flex flex-col justify-between overflow-y-auto scrollbar-none shadow-2xl ${
                      isDark 
                        ? 'bg-slate-950/40 border-white/10 shadow-slate-950/60' 
                        : 'bg-white/45 border-slate-200/60 shadow-slate-200/40'
                    }`}
                  >
                    <div className="space-y-4">
                      <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-sans font-black tracking-tight leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {activeProject.title}
                      </h2>
                      
                      <p className={`text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg leading-relaxed lg:leading-relaxed max-w-none w-full ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {activeProject.description}
                      </p>
                    </div>

                    {(() => {
                      const projectTools = activeProject.tools && activeProject.tools.length > 0
                        ? activeProject.tools
                        : (activeProject.tags || []);
                      if (projectTools.length === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {projectTools.map((tool: string, tIdx: number) => (
                            <span 
                              key={tIdx} 
                              className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${
                                isDark 
                                  ? 'bg-slate-800/80 border-slate-700/60 text-slate-300' 
                                  : 'bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      );
                    })()}

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          const url = activeProject.projectUrl || 'https://github.com';
                          window.open(url, '_blank');
                        }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer select-none active:scale-97 hover:-translate-y-0.5 ${
                          isDark 
                            ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 shadow-lg shadow-slate-950/30' 
                            : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 shadow-lg shadow-slate-200/20'
                        }`}
                      >
                        <ExternalLink className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                        <span className={isDark ? 'text-white' : 'text-slate-800'}>Visit Project Link</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Side: Thumbnail Slider Gallery */}
              <div className="w-full md:w-auto flex flex-col justify-end items-stretch md:items-end gap-3 z-30 md:self-end shrink-0 pt-4 md:pt-0">
                {N > 1 && (
                  <>
                    <div className="flex items-center justify-between md:justify-end gap-2 w-full md:items-end">
                      {/* Left Arrow Button */}
                      <button
                        onClick={() => {
                          setSlideDirection('prev');
                          setVirtualActiveIdx((prev) => prev - 1);
                        }}
                        className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center hover:-translate-x-0.5 active:scale-95 shrink-0 ${
                          isDark 
                            ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700/80 shadow-md shadow-slate-950/20' 
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
                            } else if (distance === -1) {
                              cardScale = 0.50;
                              cardOpacity = 0;
                            } else if (distance === 4) {
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
                                  
                                  if (idx > activeMIdx) {
                                    setSlideDirection('next');
                                  } else {
                                    setSlideDirection('prev');
                                  }
                                  
                                  setVirtualActiveIdx(prev => {
                                    const dist = getRelIdx(idx, activeMIdx, M);
                                    return prev + dist;
                                  });
                                }}
                                animate={{ 
                                  scale: cardScale,
                                  opacity: cardOpacity,
                                  x: targetX
                                }}
                                transition={hasWrapped ? {
                                  type: "tween",
                                  duration: 0
                                } : {
                                  type: "spring",
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
                                <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-transparent transition-colors duration-300 flex items-end p-2.5 sm:p-3">
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
                        onClick={() => {
                          setSlideDirection('next');
                          setVirtualActiveIdx((prev) => prev + 1);
                        }}
                        className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center hover:translate-x-0.5 active:scale-95 shrink-0 ${
                          isDark 
                            ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700/80 shadow-md shadow-slate-950/20' 
                            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-md shadow-slate-200/20'
                        }`}
                        title="Projek Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>
                  </>
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
