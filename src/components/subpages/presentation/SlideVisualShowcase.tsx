import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Layers, CheckCircle, BarChart2 } from 'lucide-react';
import { CaseStudy, CaseStudySlide } from '../../../types';

interface SlideVisualShowcaseProps {
  currentSlide: CaseStudySlide;
  project: CaseStudy;
  theme: 'light' | 'dark';
  authorName?: string;
  authorTitle?: string;
}

export const SlideVisualShowcase: React.FC<SlideVisualShowcaseProps> = ({
  currentSlide,
  project,
  theme,
  authorName,
  authorTitle
}) => {
  return (
    <section className={`lg:w-1/2 p-8 md:p-12 xl:p-16 flex items-center justify-center min-h-[45vh] lg:min-h-0 ${
      theme === 'dark' ? 'bg-slate-950/40' : 'bg-slate-100/50'
    }`}>
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id + '-visual'}
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
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 text-xl font-bold">
                  <Award className="w-6 h-6" />
                </div>
                
                <span className="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                  {currentSlide.metricLabel || 'Business Performance Growth'}
                </span>
                
                <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-emerald-400 font-mono mt-1 drop-shadow-sm">
                  {currentSlide.metricValue || '+0.0%'}
                </h3>
                
                <div className="flex justify-center gap-1.5 mt-5">
                  <div className="w-2 h-2 rounded bg-emerald-400/40 animate-pulse" />
                  <div className="w-8 h-2 rounded bg-emerald-405/20" />
                  <div className="w-2 h-2 rounded bg-emerald-502/30" />
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
                <div className="space-y-4">
                  {[
                    { name: 'Original Latency', value: 85, color: 'bg-slate-705 text-slate-300 border border-slate-600' },
                    { name: 'Optimized Process', value: 38, color: 'bg-emerald-500 text-white shadow-lg shadow-emerald-550/15' },
                    { name: 'Target Milestone', value: 25, color: 'bg-slate-500 text-slate-100' }
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
                    {authorName ? authorName.substring(0, 2).toUpperCase() : ''}
                  </div>
                  <div>
                    <span className="block text-xs font-bold font-sans">{authorName || ''}</span>
                    <span className="block text-[9px] font-mono text-slate-500 uppercase">{authorTitle || ''}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SlideVisualShowcase;

