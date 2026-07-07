import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  LayoutGrid, 
  TrendingUp, 
  Calculator, 
  Grid, 
  Cpu, 
  Search, 
  Layers, 
  Award,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SKILLS } from '../data/portfolioData';
import { SkillItem, SkillCategory } from '../types';
import { isSupabaseConfigured } from '../lib/supabaseClient';

// Safe component mapper for Lucide icons
const IconMapper = ({ iconName, className }: { iconName: string, className?: string }) => {
  switch (iconName) {
    case 'Database':
      return <Database className={className} />;
    case 'Terminal':
      return <Terminal className={className} />;
    case 'LayoutGrid':
      return <LayoutGrid className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Grid':
      return <Grid className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    default:
      return <Database className={className} />;
  }
};

export default function SkillsArsenal({ 
  skills = [], 
  theme = 'light',
  customCategories = []
}: { 
  skills?: SkillItem[], 
  theme?: 'light' | 'dark',
  customCategories?: SkillCategory[]
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  const skillsList = (skills && skills.length > 0 ? skills : (isSupabaseConfigured ? SKILLS : [])).filter(s => s.showOnWeb !== false);

  // Dynamic filter lists
  const filteredSkills = skillsList.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Normalize older categories dynamically for filtering compatibility
    let normalizedCategory = skill.category;
    if (normalizedCategory === 'core') {
      normalizedCategory = (skill.icon === 'Database' || skill.name.toLowerCase().includes('sql')) ? 'dbms' : 'scientific';
    }

    const matchesCategory = selectedCategory === 'all' || normalizedCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Fields' },
    ...(customCategories || []).map(c => ({ id: c.id, label: c.label }))
  ];

  // Map skill ID to business implementations to demonstrate synergy
  const getSkillSynergies = (skillId: string) => {
    switch (skillId) {
      case 'sql':
        return {
          roles: ['Senior Analyst @ Global Tech Corp'],
          cases: ['Customer Segmentation Analysis', 'Sales Forecasting Model', 'Supply Chain Optimization'],
          projectsCount: 'All Cases'
        };
      case 'python':
        return {
          roles: ['Senior Analyst @ Global Tech Corp', 'Data Scientist @ Insight Solutions'],
          cases: ['Customer Segmentation Analysis', 'Sales Forecasting Model'],
          projectsCount: 'Core Pipelines'
        };
      case 'power-query':
        return {
          roles: ['Senior Analyst @ Global Tech Corp', 'Data Scientist @ Insight Solutions'],
          cases: ['Customer Segmentation Analysis', 'Supply Chain Optimization'],
          projectsCount: 'ETL Pipelines'
        };
      case 'powerbi':
        return {
          roles: ['Senior Analyst @ Global Tech Corp', 'Data Scientist @ Insight Solutions'],
          cases: ['Supply Chain Optimization', 'Sales Forecasting Model'],
          projectsCount: 'LPs & Dashboards'
        };
      case 'excel':
        return {
          roles: ['Data Scientist @ Insight Solutions', 'Senior Analyst @ Global Tech Corp'],
          cases: ['Supply Chain Optimization', 'Sales Forecasting Model'],
          projectsCount: 'Financial Models'
        };
      default:
        return {
          roles: [],
          cases: [],
          projectsCount: 'Ad-hoc tasks'
        };
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="w-full">
      {/* Category Toggles and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
        <div className={`flex items-center gap-1.5 w-full md:w-80 px-3 py-2 rounded-lg shadow-sm border transition-colors ${
          isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search queries, languages, models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none border-none p-0 inline-block focus:ring-0 ${
              isDark ? 'text-slate-150 placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
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

        {/* Categories Tab Pill Controls */}
        <div className={`flex flex-wrap gap-1 p-1.5 rounded-lg border w-full md:w-auto transition-colors ${
          isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200'
        }`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold cursor-pointer transition-all relative ${
                selectedCategory === cat.id
                  ? (isDark ? 'text-white z-10 font-bold' : 'text-slate-900 z-10 font-bold')
                  : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              {selectedCategory === cat.id && (
                <motion.span
                  layoutId="activeCategoryBg"
                  className={`absolute inset-0 rounded-md shadow-sm z-[-1] ${
                    isDark ? 'bg-slate-800' : 'bg-white'
                  }`}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of badges and side linkages display */}
      {skillsList.length === 0 ? (
        <div className={`p-8 rounded-xl border text-center transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
        }`}>
          <Database className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-pulse shrink-0" />
          <h3 className="font-sans font-bold text-base mb-2">
            {!isSupabaseConfigured ? "Supabase Belum Terhubung" : "Belum ada Keahlian"}
          </h3>
          <p className="text-sm max-w-lg mx-auto leading-relaxed text-slate-400">
            {!isSupabaseConfigured 
              ? "Hubungkan database Supabase Anda di Google AI Studio secrets untuk menampilkan keahlian teknis Anda." 
              : "Koneksi berhasil! Silakan isi keahlian Anda melalui Admin Panel di pojok kanan atas."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Dynamic Skill Badges Grid */}
        <motion.div 
          layout
          className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const isActive = activeSkill?.id === skill.id;
              return (
                <motion.button
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Toggle active skill card for showing detailed linkage
                    setActiveSkill(isActive ? null : skill);
                  }}
                  className={`bento-card text-left p-4 rounded-xl flex flex-col justify-between h-[155px] cursor-pointer transition-all border ${
                    isActive 
                      ? 'ring-2 ring-emerald-500 border-transparent shadow-md bg-emerald-500/5' 
                      : (isDark ? 'border-slate-850 bg-slate-900/60 hover:bg-slate-900/80' : 'border-slate-200 bg-white hover:border-slate-350')
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? (isDark ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-100 text-emerald-800') 
                        : (isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-700')
                    }`}>
                      <IconMapper iconName={skill.icon} className="w-5 h-5 shrink-0" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                      {skill.category === 'dbms' || (skill.category === 'core' && (skill.icon === 'Database' || skill.name.toLowerCase().includes('sql'))) ? 'Database & Query' :
                       skill.category === 'scientific' || (skill.category === 'core') ? 'Languages & Script' :
                       skill.category === 'visualization' ? 'Business Intelligence' :
                       skill.category === 'analytical' ? 'Analytics & Stats' : skill.category}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className={`font-display font-bold text-sm transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {skill.name}
                    </h4>
                    <p className={`text-xs line-clamp-2 mt-1 leading-snug transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {skill.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {filteredSkills.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`col-span-full py-12 text-center rounded-xl border border-dashed flex flex-col items-center justify-center w-full transition-colors ${
                isDark ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-400 bg-white border-slate-200'
              }`}
            >
              <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
              <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No tools matching query</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} 
                className="mt-3 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Skill Synergy Details Sidebar Panel */}
        <div className={`rounded-xl border p-6 flex flex-col justify-between min-h-[360px] overflow-hidden relative lg:col-span-4 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-850' : 'bg-slate-50 border-slate-200'
        }`}>
          <AnimatePresence mode="wait">
            {activeSkill ? (
              <motion.div 
                key={activeSkill.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] tracking-widest font-mono text-emerald-700 font-bold uppercase bg-emerald-100 px-2 py-0.5 rounded">
                    Active Synergy Guide
                  </span>
                  <h4 className={`font-display font-extrabold text-lg mt-3 flex items-center gap-2 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <IconMapper iconName={activeSkill.icon} className="w-5 h-5 text-emerald-600" />
                    {activeSkill.name} Stack Integration
                  </h4>
                  <p className={`text-xs mt-2 leading-relaxed pb-4 border-b animate-pulse-once transition-colors ${
                    isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-200'
                  }`}>
                    {activeSkill.description}
                  </p>

                  {/* Integrations checklist */}
                  <div className="space-y-4 mt-4">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                        Business Timeline Integration
                      </span>
                      <ul className="mt-2 space-y-1">
                        {getSkillSynergies(activeSkill.id).roles.map((r, i) => (
                          <li key={i} className={`text-xs flex items-center gap-1.5 transition-colors ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                        Case Study Proof Points
                      </span>
                      <ul className="mt-2 space-y-1">
                        {getSkillSynergies(activeSkill.id).cases.map((c, i) => (
                          <li key={i} className={`text-xs flex items-center gap-1.5 transition-colors ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span className="italic">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={`border p-3.5 rounded-lg mt-6 shadow-sm transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/60'
                }`}>
                  <div className="flex gap-2">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className={`text-xs font-bold block transition-colors ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>Deploy Velocity Index</span>
                      <span className="text-[10px] font-mono text-slate-500 mt-0.5 block leading-tight">
                        Standard level: Production Lead Strategist • Classifiers built for {getSkillSynergies(activeSkill.id).projectsCount}.
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center h-full py-12 my-auto"
              >
                <Layers className="w-10 h-10 text-slate-300 animate-pulse mb-3" />
                <p className={`font-semibold text-sm transition-colors ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}>Select any Stack badge</p>
                <p className="text-slate-400 text-xs max-w-[200px] mt-1.5 leading-relaxed">
                  Click on any of the technology tools in the grid to view their dynamic career linkage mapping and proof points.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    )}
    </div>
  );
}
