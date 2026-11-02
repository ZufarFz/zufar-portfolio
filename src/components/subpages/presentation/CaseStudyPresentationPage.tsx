import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CaseStudy, CaseStudySlide } from '../../../types';
import MarkdownText from '../../MarkdownText';
import { SlideVisualShowcase } from './SlideVisualShowcase';

export interface CaseStudyPresentationPageProps {
  project: CaseStudy;
  onClose: () => void;
  theme: 'light' | 'dark';
  authorName?: string;
  authorTitle?: string;
}

export const CaseStudyPresentationPage: React.FC<CaseStudyPresentationPageProps> = ({ 
  project, 
  onClose, 
  theme, 
  authorName, 
  authorTitle 
}) => {
  const slides = project.slides && project.slides.length > 0 ? project.slides : [
    {
      id: 'default-1',
      title: 'Context & Overview',
      content: project.description,
      visualType: 'image' as const,
      image: project.image,
    },
    {
      id: 'default-2',
      title: 'Executive Business Impact',
      content: 'This solution delivered immediate strategic impact to operations, tracked directly through key executive metrics.',
      visualType: 'metric' as const,
      metricLabel: 'Key Performance Metric achieved',
      metricValue: project.impactMetric,
    }
  ] as CaseStudySlide[];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSlide = slides[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  // Slideshow Auto-play
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, slides.length]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header Bar */}
      <header className={`px-6 py-4 flex justify-between items-center border-b transition-colors ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
      } backdrop-blur-md sticky top-0 z-50`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider ${
              theme === 'dark' 
                ? 'border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white' 
                : 'border-slate-200 bg-slate-100 hover:bg-slate-250 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> RE-ENGAGE MAIN WEB
          </button>
          
          <div className="h-4 w-px bg-slate-700/30" />
          
          <div>
            {project.category && (
              <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 tracking-wider block">
                CASE TRIAL: {project.category}
              </span>
            )}
            <h1 className="text-sm font-extrabold tracking-tight leading-none mt-0.5">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
              isPlaying 
                ? 'bg-emerald-605/15 border-emerald-500/30 text-emerald-400' 
                : theme === 'dark' 
                  ? 'border-slate-800 hover:bg-slate-850 text-slate-400' 
                  : 'border-slate-250 hover:bg-slate-100 text-slate-605'
            }`}
            title={isPlaying ? 'Jeda slideshow otomatis' : 'Putar slideshow otomatis (5 detik / salindia)'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'PLAYING' : 'AUTO PLAY'}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <span className="font-bold text-emerald-400">{currentSlideIndex + 1}</span>
            <span>/</span>
            <span>{slides.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-grow flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-800/10 dark:divide-slate-800/50">
        {/* Left Side: Slide Narrative */}
        <section className="flex-grow lg:w-1/2 p-8 md:p-12 xl:p-16 flex flex-col justify-between min-h-[40vh] lg:min-h-0">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-emerald-401 bg-emerald-500/10 px-2 py-0.5 rounded">
                SLIDE #{currentSlideIndex + 1} OF {slides.length}
              </span>
              <span className="text-xs text-slate-410 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> 5s pacing
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.h2 
                key={currentSlide.id + '-title'}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`font-sans font-extrabold text-2xl md:text-3xl tracking-tight leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {currentSlide.title}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + '-content'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className={`text-sm sm:text-base leading-relaxed tracking-normal font-sans font-medium space-y-4 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-650'
                }`}
              >
                <div className="leading-relaxed">
                  <MarkdownText content={currentSlide.content} theme={theme} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-500/10 dark:border-slate-800/30">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-510 dark:text-slate-400 block tracking-wider mb-2">
              Technology Stack Used
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.map((t, idx) => (
                <span 
                  key={idx} 
                  className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-350' : 'bg-slate-100 border-slate-201 text-slate-600'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Visual Showcase Deck */}
        <SlideVisualShowcase 
          currentSlide={currentSlide}
          project={project}
          theme={theme}
          authorName={authorName}
          authorTitle={authorTitle}
        />
      </main>

      {/* Presentation Controller Footer */}
      <footer className={`px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'
      }`}>
        <div className="flex gap-2 mb-4 sm:mb-0 overflow-x-auto w-full sm:w-auto p-1 scrollbar-none justify-center sm:justify-start">
          {slides.map((slide, sidx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(sidx)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold tracking-normal transition-all cursor-pointer border ${
                sidx === currentSlideIndex
                  ? 'bg-emerald-600 border-emerald-500 text-white scale-105 shadow-sm shadow-emerald-500/30'
                  : theme === 'dark'
                    ? 'bg-slate-850 hover:bg-slate-800 text-slate-400 border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-150 text-slate-600 border-slate-250'
              }`}
              title={`Skip to Slide ${sidx + 1}: ${slide.title}`}
            >
              {sidx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer text-xs font-mono font-bold tracking-wider flex items-center gap-1 leading-none ${
              theme === 'dark'
                ? 'border-slate-804 bg-slate-851 hover:bg-slate-800 hover:text-white text-slate-400'
                : 'border-slate-250 hover:bg-slate-100 hover:text-slate-900 text-slate-600 font-semibold'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> PREVIOUS
          </button>
          
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            className={`px-4 py-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider leading-none shadow-sm cursor-pointer select-none ${
              theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-emerald-950/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-850'
            }`}
          >
            NEXT {currentSlideIndex === slides.length - 1 ? 'PART' : 'SLIDE'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudyPresentationPage;
