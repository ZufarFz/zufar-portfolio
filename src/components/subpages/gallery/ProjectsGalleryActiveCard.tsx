import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { CaseStudy } from '../../../types';

interface ProjectsGalleryActiveCardProps {
  activeProject: CaseStudy;
  isDark: boolean;
}

export const ProjectsGalleryActiveCard: React.FC<ProjectsGalleryActiveCardProps> = ({
  activeProject,
  isDark
}) => {
  const projectTools = activeProject.tools && activeProject.tools.length > 0
    ? activeProject.tools
    : (activeProject.tags || []);

  return (
    <div className="w-full md:flex-1 md:min-w-0 flex flex-col justify-end items-start text-left gap-4 md:self-end">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`space-y-5 p-5 sm:p-8 md:p-10 rounded-3xl backdrop-blur-lg border w-full h-[480px] sm:h-[520px] md:h-[540px] lg:h-[590px] xl:h-[640px] flex flex-col justify-between overflow-y-auto scrollbar-none shadow-2xl ${
            isDark 
              ? 'bg-slate-955/40 border-white/10 shadow-slate-955/60' 
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

          {projectTools.length > 0 && (
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
          )}

          <div className="pt-4">
            <button
              onClick={() => {
                const url = activeProject.projectUrl || 'https://github.com';
                window.open(url, '_blank');
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer select-none active:scale-97 hover:-translate-y-0.5 ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 shadow-lg shadow-slate-955/30' 
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
  );
};

export default ProjectsGalleryActiveCard;
