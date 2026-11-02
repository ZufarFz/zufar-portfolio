import React, { useMemo } from 'react';
import { Layers, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { SkillItem } from '../../types';
import { SkillsArsenalProps, CATEGORY_MAP, SkillCategoryGroup } from './skills/constants';
import SkillCardItem from './skills/SkillCardItem';
import SkillDetailedView from './skills/SkillDetailedView';

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
    const groups: SkillCategoryGroup[] = [];
    const customList = customCategories || [];
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

      const label = customLabel || (mapping ? (lang === 'id' ? mapping.labelId : mapping.labelEn) : catKey.toUpperCase());
      const jpTag = mapping?.jp || (catKey === 'tools' ? 'ツール' : '技術');

      groups.push({
        id: catKey,
        label,
        jpTag,
        items
      });
    });

    return groups;
  }, [visibleSkills, customCategories, lang]);

  // Detailed view mode (e.g. for About Me sub-page)
  if (viewMode === 'detailed') {
    return (
      <SkillDetailedView
        visibleSkills={visibleSkills}
        groupedCategories={groupedCategories}
        isDark={isDark}
        lang={lang}
      />
    );
  }

  // Home Mode
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-6 xl:gap-10 2xl:gap-12 items-center">
          {/* LEFT COLUMN: Modern Tech Counter Emblem */}
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex lg:col-span-4 xl:col-span-3.5 2xl:col-span-3 flex-col items-center justify-center text-center my-auto py-2"
          >
            <div className="relative group mb-4 sm:mb-5 flex items-center justify-center">
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-700 pointer-events-none" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 rounded-full bg-gradient-to-b from-sky-100 via-sky-300 to-sky-500 p-1 shadow-xl flex items-center justify-center border-2 border-sky-100/90 overflow-hidden shrink-0">
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.35) 1px, transparent 1px)`,
                    backgroundSize: '10px 10px'
                  }}
                />
                <div className="flex flex-col items-center justify-center text-center relative z-10 px-2 select-none">
                  <span className="font-mono text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight drop-shadow-xs leading-none">
                    {totalCount}
                  </span>
                  <span className="font-sans font-black text-[8.5px] sm:text-[9.5px] lg:text-[8px] xl:text-[9px] 2xl:text-[10px] tracking-[0.14em] uppercase text-slate-900 mt-1 sm:mt-1.5 leading-tight">
                    {lang === 'id' ? 'SKILL UTAMA' : 'CORE SKILLS'}
                  </span>
                  {onNavigateToAboutMe ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToAboutMe();
                      }}
                      className="mt-1 sm:mt-1.5 inline-flex items-center gap-1 text-[7.5px] sm:text-[8px] font-extrabold tracking-widest uppercase text-sky-950 hover:text-blue-900 transition-colors duration-150 cursor-pointer bg-transparent border-0 p-0 shadow-none focus:outline-none"
                      title={lang === 'id' ? 'Lihat rincian keahlian lengkap' : 'See full skills details'}
                    >
                      <span>{lang === 'id' ? 'Lihat Detail' : 'See Detail'}</span>
                      <ExternalLink className="w-2 h-2 opacity-80 group-hover:opacity-100" />
                    </button>
                  ) : (
                    <span className="mt-1 sm:mt-1.5 text-[7.5px] sm:text-[8px] font-extrabold tracking-widest uppercase text-sky-950">
                      {lang === 'id' ? 'Lihat Detail' : 'See Detail'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className={`font-sans text-xs sm:text-sm lg:text-[11px] xl:text-xs 2xl:text-sm leading-relaxed max-w-sm lg:max-w-[220px] xl:max-w-sm text-center transition-colors ${
              isDark ? 'text-slate-300/90' : 'text-slate-600'
            }`}>
              {displayGroupDesc}
            </p>
          </motion.div>
            
          {/* RIGHT COLUMN: Categorized Sections with Clean SVG Logo + Name */}
          <div className="w-full lg:col-span-8 xl:col-span-8.5 2xl:col-span-9 space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-4">
            {groupedCategories.map((group, groupIdx) => {
              const formattedNumber = String(groupIdx + 1).padStart(2, '0');

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{ duration: 1.15, delay: groupIdx * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-1 sm:space-y-1.5"
                >
                  <div className="flex items-center pb-1 sm:pb-1.5 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-mono text-[10px] sm:text-[11px] lg:text-[10px] xl:text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400">
                        {formattedNumber}
                      </span>
                      <h3 className={`font-sans font-extrabold text-[10px] sm:text-[11px] lg:text-[10.5px] xl:text-xs tracking-wider uppercase ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {group.label}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 2xl:grid-cols-11 gap-1 sm:gap-1.5">
                    {group.items.map((skill) => (
                      <SkillCardItem key={skill.id || skill.name} skill={skill} isDark={isDark} />
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
