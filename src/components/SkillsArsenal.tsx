import React, { useMemo } from 'react';
import { 
  Layers, 
  ExternalLink,
  Search,
  BookOpen,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SkillItem, SkillCategory } from '../types';
import TechLogo from './TechLogo';
import BorderGlow from './BorderGlow';

interface SkillsArsenalProps {
  skills?: SkillItem[];
  theme?: 'light' | 'dark';
  customCategories?: SkillCategory[];
  lang?: 'id' | 'en';
  badgeText?: string;
  groupDesc?: string;
  viewMode?: 'home' | 'detailed';
  onNavigateToAboutMe?: () => void;
}

// Map known category IDs or slugs to standard display labels and Japanese sub-tags
const CATEGORY_MAP: Record<string, { labelId: string; labelEn: string; jp: string }> = {
  frontend: {
    labelId: 'FRONTEND',
    labelEn: 'FRONTEND',
    jp: 'フロントエンド'
  },
  backend: {
    labelId: 'BACKEND & DATABASE',
    labelEn: 'BACKEND & DATABASE',
    jp: 'バックエンド'
  },
  dbms: {
    labelId: 'DBMS & QUERY',
    labelEn: 'DBMS & QUERY',
    jp: 'データベース'
  },
  scientific: {
    labelId: 'PROGRAMMING & SCRIPT',
    labelEn: 'PROGRAMMING & SCRIPT',
    jp: 'プログラミング'
  },
  visualization: {
    labelId: 'BUSINESS INTELLIGENCE & VISUALIZATION',
    labelEn: 'BUSINESS INTELLIGENCE & VISUALIZATION',
    jp: '視覚化 & BI'
  },
  analytical: {
    labelId: 'ANALYTICS & STATS',
    labelEn: 'ANALYTICS & STATS',
    jp: '分析ツール'
  },
  tools: {
    labelId: 'DEV TOOLS & INFRA',
    labelEn: 'DEV TOOLS & INFRA',
    jp: 'ツール'
  },
  core: {
    labelId: 'CORE TECHNOLOGIES',
    labelEn: 'CORE TECHNOLOGIES',
    jp: '基幹技術'
  }
};

export default function SkillsArsenal({
  skills = [],
  theme = 'light',
  customCategories = [],
  lang = 'id',
  badgeText,
  groupDesc,
  viewMode = 'home',
  onNavigateToAboutMe,
}: SkillsArsenalProps) {
  const isDark = theme === 'dark';

  // Filter skills to only visible ones
  const visibleSkills = useMemo(() => {
    return skills.filter(s => s.showOnWeb !== false);
  }, [skills]);

  // Group skills by category
  const groupedCategories = useMemo(() => {
    const groups: Array<{
      id: string;
      label: string;
      jpTag: string;
      items: SkillItem[];
    }> = [];

    // Map custom categories if defined
    const customList = customCategories || [];

    // Group skills
    const categoryBucket = new Map<string, SkillItem[]>();

    visibleSkills.forEach(skill => {
      const catKey = (skill.category || 'tools').toLowerCase().trim();
      if (!categoryBucket.has(catKey)) {
        categoryBucket.set(catKey, []);
      }
      categoryBucket.get(catKey)!.push(skill);
    });

    // Desired category ordering
    const preferredOrder = ['frontend', 'backend', 'dbms', 'scientific', 'visualization', 'analytical', 'tools', 'core'];

    // Sort category keys: preferred order first, then others
    const sortedKeys = Array.from(categoryBucket.keys()).sort((a, b) => {
      const idxA = preferredOrder.indexOf(a);
      const idxB = preferredOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    sortedKeys.forEach(catKey => {
      const items = categoryBucket.get(catKey) || [];
      if (items.length === 0) return;

      const mapping = CATEGORY_MAP[catKey];
      const customCatObj = customList.find(c => c.id.toLowerCase() === catKey);
      const customLabel = customCatObj ? ((lang === 'id' ? customCatObj.labelId : customCatObj.labelEn) || customCatObj.label) : undefined;

      let label = customLabel || (mapping ? (lang === 'id' ? mapping.labelId : mapping.labelEn) : catKey.toUpperCase());
      let jpTag = mapping?.jp || (catKey === 'tools' ? 'ツール' : '技術');

      groups.push({
        id: catKey,
        label,
        jpTag,
        items
      });
    });

    return groups;
  }, [visibleSkills, customCategories, lang]);

  // Detailed mode states (for About Me deep dive)
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [activeSkill, setActiveSkill] = React.useState<SkillItem | null>(visibleSkills[0] || null);

  const filteredSkillsForDetailed = useMemo(() => {
    return visibleSkills.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'all' || s.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [visibleSkills, searchTerm, selectedCategory]);

  // If detailed view mode requested (e.g. for About Me sub-page)
  if (viewMode === 'detailed') {
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
            {filteredSkillsForDetailed.map(skill => {
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
                              ? `Diaplikasikan langsung pada pemodelan kueri, otomatisasi skrip, dan dashboard analitika produksi.`
                              : `Deployed across production pipelines, automated batching, and executive KPI dashboards.`}
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
  }

  // =========================================================================
  // HOME MODE: Clean Layout (Counter Emblem on Left + Category Groups with SVG + Name on Right)
  // =========================================================================

  const defaultGroupDesc = lang === 'id'
    ? 'Dikelompokkan ke dalam beberapa bidang utama: pengelolaan basis data & kueri, pemrograman skrip & otomatisasi, hingga pemodelan visual analitika bisnis.'
    : 'Organized into core disciplines: database architecture & querying, algorithmic scripting & automation, and business intelligence modeling.';

  const displayGroupDesc = groupDesc || defaultGroupDesc;
  const totalCount = visibleSkills.length;

  return (
    <div className="w-full">
      {visibleSkills.length === 0 ? (
        <div className={`p-8 rounded-2xl text-center transition-all ${
          isDark ? 'bg-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-xs'
        }`}>
          <Layers className="w-10 h-10 text-emerald-500 mx-auto mb-3 animate-pulse" />
          <h3 className="font-sans font-bold text-base mb-1">
            {lang === 'id' ? 'Belum Ada Keahlian' : 'No Skills Registered'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {lang === 'id' ? 'Daftar keahlian dapat dikonfigurasi melalui panel editor.' : 'Skills list can be managed through the admin panel.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================================================================ */}
          {/* LEFT COLUMN: Modern Tech Counter Emblem + Summary Narrative */}
          {/* ================================================================ */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 xl:col-span-3.5 flex flex-col items-center justify-center text-center my-auto py-2"
          >
            {/* Circular Medallion Emblem */}
            <div className="relative group mb-5 flex items-center justify-center">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition duration-700 pointer-events-none" />
              
              {/* Circle Body with Radial Texture */}
              <div className="relative w-36 h-36 sm:w-42 sm:h-42 rounded-full bg-gradient-to-b from-[#1e40af] via-[#1e3a8a] to-[#0f172a] p-1.5 shadow-2xl flex items-center justify-center border border-blue-400/40 overflow-hidden shrink-0">
                {/* Japanese Wave Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                    backgroundSize: '12px 12px'
                  }}
                />

                {/* Inner Content Stack */}
                <div className="flex flex-col items-center justify-center text-center relative z-10 px-3 select-none">
                  <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md leading-none">
                    {totalCount}
                  </span>
                  
                  <span className="font-sans font-black text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-white/95 mt-1.5 leading-tight">
                    {lang === 'id' ? 'SKILL UTAMA' : 'CORE SKILLS'}
                  </span>

                  <span className="font-sans text-[9px] text-blue-200/90 tracking-wide font-medium mt-0.5">
                    {lang === 'id' ? 'Keahlian Andalan' : 'Mastered Stack'}
                  </span>

                  {/* Clean transparent "See Detail" link without box container */}
                  {onNavigateToAboutMe ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToAboutMe();
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-bold tracking-widest uppercase text-blue-200/90 hover:text-emerald-300 transition-colors duration-150 cursor-pointer bg-transparent border-0 p-0 shadow-none focus:outline-none"
                      title={lang === 'id' ? 'Lihat rincian keahlian lengkap' : 'See full skills details'}
                    >
                      <span>{lang === 'id' ? 'Lihat Detail' : 'See Detail'}</span>
                      <ExternalLink className="w-2 h-2 opacity-75 group-hover:opacity-100" />
                    </button>
                  ) : (
                    <span className="mt-1.5 text-[8px] font-bold tracking-widest uppercase text-blue-200/80">
                      {lang === 'id' ? 'Lihat Detail' : 'See Detail'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Narrative description */}
            <p className={`font-sans text-xs sm:text-sm leading-relaxed max-w-sm text-center transition-colors ${
              isDark ? 'text-slate-300/90' : 'text-slate-600'
            }`}>
              {displayGroupDesc}
            </p>
          </motion.div>
            
          {/* RIGHT COLUMN: Categorized Sections with Clean SVG Logo + Name */}
          {/* ================================================================ */}
          <div className="lg:col-span-8 xl:col-span-8.5 space-y-4 sm:space-y-5.5 w-full">
            {groupedCategories.map((group, groupIdx) => {
              const formattedNumber = String(groupIdx + 1).padStart(2, '0');

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: groupIdx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-1.5 sm:space-y-2"
                >
                  {/* Category Header Bar (Clean, without See Detail) */}
                  <div className="flex items-center pb-1 sm:pb-1.5 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] sm:text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400">
                        {formattedNumber}
                      </span>
                      <h3 className={`font-sans font-extrabold text-[11px] sm:text-xs tracking-wider uppercase ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {group.label}
                      </h3>
                    </div>
                  </div>

                  {/* Technology Grid Cards - Compact Square Layout with Crisp SVG */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 sm:gap-2.5">
                    {group.items.map((skill) => (
                        <motion.div
                          key={skill.id || skill.name}
                          whileHover="hover"
                          initial="rest"
                          variants={{
                            rest: { y: 0, scale: 1 },
                            hover: { 
                              y: -4,
                              scale: 1.05,
                              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } 
                            }
                          }}
                          className="group h-full w-full relative transform-gpu"
                          title={skill.name}
                        >
                          <BorderGlow
                            edgeSensitivity={20}
                            glowColor={isDark ? "160 100 50" : "160 80 60"}
                            backgroundColor={isDark ? "#1e293b" : "#ffffff"}
                            borderRadius={10}
                            glowRadius={40}
                            glowIntensity={1.1}
                            coneSpread={25}
                            animated={false}
                            colors={isDark ? ['#10b981', '#06b6d4', '#8b5cf6'] : ['#10b981', '#3b82f6', '#a855f7']}
                            fillOpacity={0.4}
                            className="h-full w-full"
                          >
                            <div className="h-full w-full p-1.5 sm:p-2 flex flex-col items-center justify-center gap-1 cursor-default">
                              {/* Authentic Vector Logo with Crisp Zoom - SVG stays HD */}
                              <motion.div 
                                variants={{
                                  rest: { scale: 1, transformOrigin: 'center center' },
                                  hover: { 
                                    scale: 1.12,
                                    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                                    transformBox: 'fill-box'
                                  }
                                }}
                                className="flex items-center justify-center will-change-transform transform-gpu"
                              >
                                <TechLogo
                                  name={skill.name}
                                  iconName={skill.icon}
                                  customSvg={skill.customSvg}
                                  svgUrl={skill.svgUrl}
                                  size={30}
                                  className="w-7 h-7 sm:w-8 sm:h-8"
                                />
                              </motion.div>

                              {/* Skill Name */}
                              <span className={`font-sans font-bold text-[11px] sm:text-[12.5px] tracking-tight text-center leading-tight truncate w-full transition-colors duration-150 ${
                                isDark ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'
                              }`}>
                                {skill.name}
                              </span>
                            </div>
                          </BorderGlow>
                        </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      )}
  </div>
  );
}
