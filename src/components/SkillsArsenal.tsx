import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<number>(1); // 1 = right/forward, -1 = left/backward
  const activeSkillRef = useRef<SkillItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth height transition references
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const element = sidebarContentRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSidebarHeight((entry.target as HTMLElement).offsetHeight);
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

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

  // Helper to change active skill with directional tracking
  const changeActiveSkill = useCallback((newSkill: SkillItem | null) => {
    if (newSkill && activeSkillRef.current && newSkill.id !== activeSkillRef.current.id) {
      const prevIdx = filteredSkills.findIndex(s => s.id === activeSkillRef.current?.id);
      const newIdx = filteredSkills.findIndex(s => s.id === newSkill.id);
      if (prevIdx !== -1 && newIdx !== -1) {
        if (newIdx > prevIdx) {
          setDirection(1); // moving right to higher index
        } else if (newIdx < prevIdx) {
          setDirection(-1); // moving left to lower index
        }
      }
    }
    activeSkillRef.current = newSkill;
    setActiveSkill(newSkill);
  }, [filteredSkills]);

  // Track if scroll is caused by clicking a card to avoid intermediate state flickering
  const isClickScrollingRef = useRef<boolean>(false);
  const clickScrollTimeoutRef = useRef<number | null>(null);

  // Throttled scroll handler using requestAnimationFrame
  const scrollRafRef = useRef<number | null>(null);

  // Smoothly update scale, opacity, and zIndex for each card based on distance to center
  const updateCardScales = useCallback(() => {
    if (!isMobile || !scrollContainerRef.current) return null;
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const radius = 160; // px distance for full scale/opacity drop-off

    const children = Array.from(container.children) as HTMLElement[];
    let closestSkill: SkillItem | null = null;
    let minDistance = Infinity;

    children.forEach((child) => {
      const skillId = child.getAttribute('data-skill-id');
      if (!skillId) return;

      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);

      // normDist: 0 at exact center, 1 at >= 160px away
      const normDist = Math.min(distance / radius, 1);

      // Continuous scale: 1.08 at center -> 0.88 at edge
      const scale = 1.08 - (normDist * 0.20);
      // Continuous opacity: 1.0 at center -> 0.45 at edge
      const opacity = 1.0 - (normDist * 0.55);

      child.style.transform = `scale(${scale.toFixed(3)})`;
      child.style.opacity = opacity.toFixed(3);
      child.style.zIndex = distance < 60 ? '10' : '1';

      if (distance < minDistance) {
        minDistance = distance;
        const found = filteredSkills.find(s => s.id === skillId);
        if (found) closestSkill = found;
      }
    });

    return closestSkill;
  }, [isMobile, filteredSkills]);

  const handleScroll = () => {
    if (!isMobile || !scrollContainerRef.current) return;
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      
      // Continuously update card scale & opacity on every scroll frame
      const closestSkill = updateCardScales();

      if (!isClickScrollingRef.current && closestSkill && activeSkillRef.current?.id !== closestSkill.id) {
        changeActiveSkill(closestSkill);
      }
    });
  };

  useEffect(() => {
    if (isMobile) {
      const raf = requestAnimationFrame(() => {
        updateCardScales();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isMobile, filteredSkills, activeSkill, updateCardScales]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      if (clickScrollTimeoutRef.current !== null) {
        clearTimeout(clickScrollTimeoutRef.current);
      }
    };
  }, []);

  // Auto-select first skill of the tab on mobile so explanation is directly visible below
  useEffect(() => {
    if (isMobile && filteredSkills.length > 0) {
      if (!activeSkill || !filteredSkills.some(s => s.id === activeSkill.id)) {
        changeActiveSkill(filteredSkills[0]);
      }
    }
  }, [isMobile, selectedCategory, filteredSkills, activeSkill, changeActiveSkill]);

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
      <div className="hidden md:flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8 w-full">
        <div className={`flex items-center gap-1.5 w-full md:w-80 px-3 py-2 rounded-lg shadow-sm transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-white border border-slate-200'
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
              className="text-xs text-slate-400 hover:text-slate-600 font-medium px-1 cursor-pointer animate-fade-in"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Tab Pill Controls with elegant mobile swipe */}
        <div className={`flex overflow-x-auto no-scrollbar snap-x snap-proximity gap-1 p-1 sm:p-1.5 rounded-lg w-full md:w-auto transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-slate-100 border border-slate-200'
        }`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
              }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-sans text-[10px] sm:text-xs font-semibold cursor-pointer transition-all relative shrink-0 snap-center ${
                selectedCategory === cat.id
                  ? (isDark ? 'text-white z-10 font-bold' : 'text-slate-900 z-10 font-bold')
                  : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              {selectedCategory === cat.id && (
                <motion.span
                  layoutId="activeCategoryBg"
                  className={`absolute inset-0 rounded-md shadow-sm z-[-1] ${
                    isDark ? 'bg-slate-700' : 'bg-white'
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
        <div className={`p-8 rounded-xl text-center transition-all ${
          isDark ? 'bg-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Dynamic Skill Badges Grid */}
        <motion.div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={() => {
            isClickScrollingRef.current = false;
          }}
          layout={!isMobile}
          className={
            isMobile 
              ? "flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 w-full pt-3 pb-3 px-[calc(50vw-72.5px)] items-center" 
              : "lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          }
        >
          <AnimatePresence mode={isMobile ? "sync" : "popLayout"}>
            {filteredSkills.map((skill) => {
               const isActive = activeSkill?.id === skill.id;
               return (
                <motion.button
                  key={skill.id}
                  layout={!isMobile}
                  data-skill-id={skill.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={isMobile ? undefined : { scale: 1.03, y: -2 }}
                  whileTap={isMobile ? undefined : { scale: 0.96 }}
                  onClick={() => {
                    // Set active skill card with directional tracking
                    changeActiveSkill(skill);
                    if (isMobile && scrollContainerRef.current) {
                      const container = scrollContainerRef.current;
                      const child = container.querySelector(`[data-skill-id="${skill.id}"]`) as HTMLElement;
                      if (child) {
                        isClickScrollingRef.current = true;
                        if (clickScrollTimeoutRef.current !== null) {
                          clearTimeout(clickScrollTimeoutRef.current);
                        }
                        const targetScrollLeft = child.offsetLeft - (container.clientWidth / 2) + (child.clientWidth / 2);
                        container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });

                        clickScrollTimeoutRef.current = window.setTimeout(() => {
                          isClickScrollingRef.current = false;
                        }, 350);
                      }
                    }
                  }}
                  className={`bento-card text-left rounded-xl flex flex-col justify-center cursor-pointer transition-colors duration-200 ease-out shrink-0 snap-center shadow-none [box-shadow:none] ${
                    isMobile 
                      ? `w-[145px] h-[48px] px-3 py-2 ${
                          isActive 
                            ? 'ring-2 ring-emerald-500 border-transparent ' + 
                              (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900') 
                            : 'border-transparent ' + 
                              (isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100/80 text-slate-500')
                        }`
                      : `p-4 h-[110px] sm:h-[155px] justify-between ${
                          isActive ? 'ring-2 ring-emerald-500 border-none shadow-md bg-emerald-500/5' : ''
                        } ${
                          isDark ? 'border-none bg-slate-800 hover:bg-slate-700/80 text-white' : 'border border-slate-200 bg-white hover:border-slate-350'
                        }`
                  }`}
                >
                  {isMobile ? (
                    <div className="flex items-center gap-2.5 w-full h-full min-w-0">
                      <div className={`rounded-lg shrink-0 transition-colors duration-200 p-1.5 ${
                        isActive 
                          ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700') 
                          : (isDark ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-200/70 text-slate-600')
                      }`}>
                        <IconMapper iconName={skill.icon} className="w-4 h-4 shrink-0" />
                      </div>
                      <h4 className={`font-display font-bold text-xs truncate leading-none transition-colors duration-200 ${
                        isActive 
                          ? (isDark ? 'text-white font-extrabold' : 'text-slate-900 font-extrabold') 
                          : (isDark ? 'text-slate-400' : 'text-slate-600')
                      }`}>
                        {skill.name}
                      </h4>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center w-full">
                        <div className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                          isActive 
                            ? (isDark ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-100 text-emerald-800') 
                            : (isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-700')
                        }`}>
                          <IconMapper iconName={skill.icon} className="w-4 h-4 sm:w-5 h-5 shrink-0" />
                        </div>
                        <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                          {skill.category === 'dbms' || (skill.category === 'core' && (skill.icon === 'Database' || skill.name.toLowerCase().includes('sql'))) ? 'Database & Query' :
                           skill.category === 'scientific' || (skill.category === 'core') ? 'Languages & Script' :
                           skill.category === 'visualization' ? 'Business Intelligence' :
                           skill.category === 'analytical' ? 'Analytics & Stats' : skill.category}
                        </span>
                      </div>

                      <div className="mt-2 sm:mt-4">
                        <h4 className={`font-display font-bold text-xs sm:text-sm transition-colors leading-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {skill.name}
                        </h4>
                        <p className={`text-[10px] sm:text-xs line-clamp-2 mt-0.5 sm:mt-1 leading-snug transition-colors ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {skill.description}
                        </p>
                      </div>
                    </>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>

          {filteredSkills.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`col-span-full py-12 text-center rounded-xl flex flex-col items-center justify-center w-full transition-colors ${
                isDark ? 'text-slate-400 bg-slate-800 border-none' : 'text-slate-400 bg-white border border-dashed border-slate-200'
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
        <motion.div 
          animate={isMobile ? { height: sidebarHeight } : { height: 'auto' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`rounded-xl overflow-hidden no-scrollbar relative lg:col-span-4 transition-colors w-full ${
            isDark ? 'bg-slate-800 border-none' : 'bg-slate-50 border border-slate-200'
          }`}
        >
          <div ref={sidebarContentRef} className="p-5 sm:p-6 flex flex-col justify-between">
              <AnimatePresence mode="wait" custom={direction}>
                {activeSkill ? (
                  <motion.div 
                    key={activeSkill.id}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        opacity: 0,
                        x: dir > 0 ? 30 : -30,
                      }),
                      center: {
                        opacity: 1,
                        x: 0,
                      },
                      exit: (dir: number) => ({
                        opacity: 0,
                        x: dir > 0 ? -30 : 30,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] tracking-widest font-mono text-emerald-700 font-bold uppercase bg-emerald-100 px-2 py-0.5 rounded">
                        Active Synergy Guide
                      </span>
                      <h4 className={`font-display font-extrabold text-base sm:text-lg mt-3 flex items-center gap-2 transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        <IconMapper iconName={activeSkill.icon} className="w-5 h-5 text-emerald-600" />
                        {activeSkill.name} Stack Integration
                      </h4>
                      <p className={`text-xs mt-2 leading-relaxed pb-4 border-b animate-pulse-once transition-colors ${
                        isDark ? 'text-slate-400 border-slate-750' : 'text-slate-600 border-slate-200'
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

                    <div className={`p-3 rounded-lg mt-5 shadow-sm transition-colors ${
                      isDark ? 'bg-slate-900 border-none' : 'border border-slate-200/60 bg-white'
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
                    className="flex flex-col items-center justify-center text-center min-h-[260px] sm:min-h-[312px] py-12 w-full"
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
          </motion.div>

      </div>
    )}
    </div>
  );
}
