import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  BarChart2, 
  Award, 
  CheckCircle,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CaseStudy, CaseStudySlide } from '../types';

interface CaseStudyPresentationPageProps {
  project: CaseStudy;
  onClose: () => void;
  theme: 'light' | 'dark';
  authorName?: string;
  authorTitle?: string;
}

export default function CaseStudyPresentationPage({ project, onClose, theme, authorName, authorTitle }: CaseStudyPresentationPageProps) {
  const slides = project.slides && project.slides.length > 0 ? project.slides : [
    {
      id: "default-1",
      title: "Context & Overview",
      content: project.description,
      visualType: "image" as const,
      image: project.image,
    },
    {
      id: "default-2",
      title: "Executive Business Impact",
      content: `This solution delivered immediate strategic impact to operations, tracked directly through key executive metrics.`,
      visualType: "metric" as const,
      metricLabel: "Key Performance Metric achieved",
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
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length]);

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

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

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
          
          <div className="h-4 w-px bg-slate-700/30"></div>
          
          <div>
            <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 tracking-wider">
              CASE TRIAL: {project.category}
            </span>
            <h1 className="text-sm font-extrabold tracking-tight leading-none mt-0.5">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Autoplay controller */}
          <button
            onClick={togglePlay}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
              isPlaying 
                ? 'bg-emerald-605/15 border-emerald-500/30 text-emerald-400' 
                : theme === 'dark' 
                  ? 'border-slate-800 hover:bg-slate-850 text-slate-400' 
                  : 'border-slate-250 hover:bg-slate-100 text-slate-605'
            }`}
            title={isPlaying ? "Jeda slideshow otomatis" : "Putar slideshow otomatis (5 detik / salindia)"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "PLAYING" : "AUTO PLAY"}
          </button>

          {/* Progress Indicator */}
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
            {/* Slide Index Counter Badge */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-emerald-401 bg-emerald-500/10 px-2 py-0.5 rounded">
                SLIDE #{currentSlideIndex + 1} OF {slides.length}
              </span>
              <span className="text-xs text-slate-410 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> 5s pacing
              </span>
            </div>

            {/* Slide Title */}
            <AnimatePresence mode="wait">
              <motion.h2 
                key={currentSlide.id + "-title"}
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

            {/* Slide Description Narratives */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + "-content"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className={`text-sm sm:text-base leading-relaxed tracking-normal font-sans font-medium space-y-4 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-650'
                }`}
              >
                <p className="whitespace-pre-line">{currentSlide.content}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Inline presentation footer stats */}
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

        {/* Right Side: Visual Showcase Deck (PPT style) */}
        <section className={`lg:w-1/2 p-8 md:p-12 xl:p-16 flex items-center justify-center min-h-[45vh] lg:min-h-0 ${
          theme === 'dark' ? 'bg-slate-950/40' : 'bg-slate-100/50'
        }`}>
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + "-visual"}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {/* Visual Type 1: High-Impact Metric */}
                {currentSlide.visualType === 'metric' && (
                  <div className={`p-8 rounded-2xl border text-center relative overflow-hidden shadow-2xl ${
                    theme === 'dark' 
                      ? 'bg-slate-900/80 border-emerald-500/20 shadow-emerald-950/20' 
                      : 'bg-white border-emerald-200/50 shadow-emerald-100/20'
                  }`}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 text-xl font-bold">
                      <Award className="w-6 h-6" />
                    </div>
                    
                    <span className="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                      {currentSlide.metricLabel || "Business Performance Growth"}
                    </span>
                    
                    <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-emerald-400 font-mono mt-1 drop-shadow-sm">
                      {currentSlide.metricValue || "+0.0%"}
                    </h3>
                    
                    <div className="flex justify-center gap-1.5 mt-5">
                      <div className="w-2 h-2 rounded bg-emerald-400/40 animate-pulse"></div>
                      <div className="w-8 h-2 rounded bg-emerald-405/20"></div>
                      <div className="w-2 h-2 rounded bg-emerald-502/30"></div>
                    </div>
                  </div>
                )}

                {/* Visual Type 2: Bullet Points list review */}
                {currentSlide.visualType === 'bullet_points' && (
                  <div className={`p-8 rounded-2xl border shadow-xl ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
                  }`}>
                    <h4 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 border-b border-slate-700/20 pb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-400" /> IMPLEMENTATION DEPLOYMENT BULLETS
                    </h4>
                    <ul className="space-y-4">
                      {(currentSlide.bulletsList || ['Point 1', 'Point 2', 'Point 3']).map((bullet, bidx) => (
                        <motion.li 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: bidx * 0.12 }}
                          key={bidx} 
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className={`text-xs sm:text-sm font-sans font-medium ${
                            theme === 'dark' ? 'text-slate-350' : 'text-slate-700'
                          }`}>
                            {bullet}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Visual Type 3: Simple Illustration Image */}
                {currentSlide.visualType === 'image' && (
                  <div className={`p-2 rounded-2xl border shadow-2xl relative group overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                  }`}>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img 
                        src={currentSlide.image || project.image} 
                        alt="Project Illustration" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}

                {/* Visual Type 4: Chart Statistics visualization */}
                {currentSlide.visualType === 'chart' && (
                  <div className={`p-8 rounded-2xl border shadow-xl ${
                    theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80'
                  }`}>
                    <h4 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700/20 pb-2 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-emerald-400" /> MODEL PERFORMANCE CURVE
                    </h4>
                    {/* Render visual bar chart blocks */}
                    <div className="space-y-4">
                      {[
                        { name: "Original Latency", value: 85, color: "bg-slate-705 text-slate-300 border border-slate-600" },
                        { name: "Optimized Process", value: 38, color: "bg-emerald-500 text-white shadow-lg shadow-emerald-550/15" },
                        { name: "Target Milestone", value: 25, color: "bg-slate-500 text-slate-100" }
                      ].map((item, iidx) => (
                        <div key={iidx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-400 font-semibold">{item.name}</span>
                            <span className="text-emerald-400 font-bold">{item.value}% index</span>
                          </div>
                          <div className="h-6 w-full bg-slate-950/40 rounded border border-slate-800/30 dark:border-slate-800 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 0.8, delay: iidx * 0.15 }}
                              className={`h-full ${item.color} flex items-center justify-end px-2 text-[8px] font-bold font-mono`}
                            >
                              {item.value}%
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Type 5: Elegant Typography Text Box */}
                {currentSlide.visualType === 'text' && (
                  <div className={`p-8 rounded-2xl border text-left shadow-xl ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
                  }`}>
                    <p className={`font-serif italic text-base sm:text-lg leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-800 font-medium'
                    }`}>
                      "Operational modeling must prioritize rigorous mathematical alignments. The key is turning complex metadata patterns into quick real-world dashboards that senior VPs can act on instantly."
                    </p>
                    <div className="mt-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center font-mono text-emerald-400 text-xs font-bold uppercase">
                        {authorName ? authorName.substring(0, 2) : "JV"}
                      </div>
                      <div>
                        <span className="block text-xs font-bold font-sans">{authorName || "Jonathan Vance"}</span>
                        <span className="block text-[9px] font-mono text-slate-500 uppercase">{authorTitle || "Director of analytics"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Presentation Controller Footer */}
      <footer className={`px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'
      }`}>
        {/* Slide navigation preview thumbnails */}
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

        {/* Action Arrows */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer text-xs font-mono font-bold tracking-wider flex items-center gap-1 leading-none ${
              theme === 'dark'
                ? 'border-slate-804 bg-slate-851 hover:bg-slate-800 hover:text-white text-slate-400'
                : 'border-slate-250 hover:bg-slate-100 hover:text-slate-900 text-slate-600 font-semibold'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> PREVIOUS
          </button>
          
          <button
            onClick={handleNext}
            className={`px-4 py-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider leading-none shadow-sm cursor-pointer select-none ${
              theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-emerald-950/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-850'
            }`}
          >
            NEXT {currentSlideIndex === slides.length - 1 ? "PART" : "SLIDE"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
