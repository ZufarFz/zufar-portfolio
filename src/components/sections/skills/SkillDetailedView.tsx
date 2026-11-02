import React, { useState, useMemo } from 'react';
import { Search, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SkillItem } from '../../../types';
import TechLogo from '../../common/TechLogo';
import { SkillCategoryGroup } from './constants';

interface SkillDetailedViewProps {
  visibleSkills: SkillItem[];
  groupedCategories: SkillCategoryGroup[];
  isDark: boolean;
  lang: 'id' | 'en';
}

export const SkillDetailedView: React.FC<SkillDetailedViewProps> = ({
  visibleSkills,
  groupedCategories,
  isDark,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(visibleSkills[0] || null);

  const filteredSkills = useMemo(() => {
    return visibleSkills.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'all' || s.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [visibleSkills, searchTerm, selectedCategory]);

  return (
    <div className="w-full space-y-8">
      {/* Search and Category Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center w-full">
        <div className={`flex items-center gap-2 w-full md:w-80 px-3.5 py-2.5 rounded-xl transition-colors ${
          isDark ? 'bg-slate-800/90 border border-slate-700' : 'bg-white border border-slate-200 shadow-xs'
        }`}>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={lang === 'id' ? 'Cari teknologi, kueri, script...' : 'Search tools, queries, scripts...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none border-none p-0 inline-block focus:ring-0 ${
              isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-xs text-slate-400 hover:text-slate-600 font-medium px-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className={`flex overflow-x-auto no-scrollbar snap-x gap-1.5 p-1.5 rounded-xl w-full md:w-auto transition-colors ${
          isDark ? 'bg-slate-800/80 border border-slate-700/60' : 'bg-slate-100 border border-slate-200'
        }`}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'all'
                ? (isDark ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs')
                : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            {lang === 'id' ? 'Semua Bidang' : 'All Fields'}
          </button>
          {groupedCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? (isDark ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs')
                  : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Grid + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSkills.map(skill => {
            const isSelected = activeSkill?.id === skill.id;
            return (
              <motion.div
                key={skill.id}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSkill(skill)}
                className={`p-5 rounded-2xl border cursor-pointer transition-colors duration-250 flex flex-col justify-between transform-gpu ${
                  isSelected
                    ? (isDark ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md' : 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md')
                    : (isDark ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-750' : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md')
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 shrink-0">
                      <TechLogo name={skill.name} iconName={skill.icon} customSvg={skill.customSvg} svgUrl={skill.svgUrl} size={28} />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                      {skill.category}
                    </span>
                  </div>
                  <h4 className="font-sans font-black text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Active Detail Showcase Panel */}
        <div className="lg:col-span-5 sticky top-24">
          <AnimatePresence mode="wait">
            {activeSkill ? (
              <motion.div
                key={activeSkill.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 rounded-3xl border ${
                  isDark ? 'bg-slate-800/90 border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-lg'
                }`}
              >
                <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-700">
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 shadow-xs shrink-0">
                    <TechLogo name={activeSkill.name} iconName={activeSkill.icon} customSvg={activeSkill.customSvg} svgUrl={activeSkill.svgUrl} size={40} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {activeSkill.category}
                    </span>
                    <h3 className="font-sans font-black text-xl text-slate-900 dark:text-white leading-tight">
                      {activeSkill.name}
                    </h3>
                  </div>
                </div>

                <div className="py-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
                      {lang === 'id' ? 'Deskripsi Lengkap' : 'Full Architecture & Usage'}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeSkill.description}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-900/80' : 'bg-slate-50'}`}>
                    <div className="flex items-start gap-2.5">
                      <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          {lang === 'id' ? 'Penerapan Praktis' : 'Practical Proof of Work'}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {lang === 'id' 
                            ? 'Diaplikasikan langsung pada pemodelan kueri, otomatisasi skrip, dan dashboard analitika produksi.'
                            : 'Deployed across production pipelines, automated batching, and executive KPI dashboards.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailedView;
