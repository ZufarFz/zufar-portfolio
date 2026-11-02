import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  Sparkles, 
  Heart, 
  LayoutGrid,
  Award,
  BookOpen,
  Target,
  Terminal,
  Flame,
  Compass,
  Smile
} from 'lucide-react';

export function getStoryCustomIcon(iconName?: string) {
  switch (iconName) {
    case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5" />;
    case 'Cpu': return <Cpu className="w-5 h-5" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5" />;
    case 'Heart': return <Heart className="w-5 h-5" />;
    case 'LayoutGrid': return <LayoutGrid className="w-5 h-5" />;
    case 'Award': return <Award className="w-5 h-5" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5" />;
    case 'Target': return <Target className="w-5 h-5" />;
    case 'Terminal': return <Terminal className="w-5 h-5" />;
    case 'Flame': return <Flame className="w-5 h-5" />;
    case 'Compass': return <Compass className="w-5 h-5" />;
    case 'Smile': return <Smile className="w-5 h-5" />;
    default: return <Sparkles className="w-5 h-5" />;
  }
}

interface StoryMobileQuickGridProps {
  isDark: boolean;
  isIndo: boolean;
  leftPoints: Array<{ title: string; desc: string; path: string }>;
  rightPoints: Array<{ title: string; desc: string; path: string }>;
  customSubPages: any[];
  onPointClick: (hashPath: string) => void;
}

export const StoryMobileQuickGrid: React.FC<StoryMobileQuickGridProps> = ({
  isDark,
  isIndo,
  leftPoints,
  rightPoints,
  customSubPages,
  onPointClick,
}) => {
  const [left1, left2, left3] = leftPoints;
  const [right1, right2, right3] = rightPoints;

  const mobileItems = [
    { title: left1.title, icon: <GraduationCap className="w-4 h-4" />, path: left1.path, colorClass: isDark ? 'text-amber-400' : 'text-amber-600', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
    { title: right1.title, icon: <Briefcase className="w-4 h-4" />, path: right1.path, colorClass: isDark ? 'text-sky-400' : 'text-sky-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
    { title: left2.title, icon: <Cpu className="w-4 h-4" />, path: left2.path, colorClass: isDark ? 'text-emerald-400' : 'text-emerald-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
    { title: right2.title, icon: <Sparkles className="w-4 h-4" />, path: right2.path, colorClass: isDark ? 'text-pink-400' : 'text-pink-600', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
    { title: left3.title, icon: <Heart className="w-4 h-4" />, path: left3.path, colorClass: isDark ? 'text-rose-400' : 'text-rose-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
    { title: right3.title, icon: <LayoutGrid className="w-4 h-4" />, path: right3.path, colorClass: isDark ? 'text-orange-400' : 'text-orange-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
    ...customSubPages.map(page => ({
      title: isIndo ? (page.title || page.titleEn || page.id) : (page.titleEn || page.title || page.id),
      icon: getStoryCustomIcon(page.iconName),
      path: `#/${page.id}`,
      colorClass: isDark ? 'text-teal-400' : 'text-teal-600',
      bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100'
    }))
  ];

  return (
    <div className="lg:hidden grid grid-cols-2 gap-3 mt-auto mb-2 w-full max-w-[340px] px-2 pointer-events-auto z-40">
      {mobileItems.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          onClick={() => onPointClick(item.path)}
          className={`flex items-center gap-2 p-2.5 rounded-xl border-t border-r border-l cursor-pointer active:translate-y-[2.5px] transition-all duration-150 ${
            isDark
              ? 'bg-slate-900 border-white/[0.08] border-b-[3.5px] border-b-slate-950 active:border-b active:border-b-slate-900 shadow-[0_6px_16px_rgba(0,0,0,0.45)] hover:border-emerald-500/25'
              : 'bg-white border-slate-200 border-b-[3.5px] border-b-slate-300 active:border-b active:border-b-slate-200 shadow-[0_6px_14px_rgba(15,23,42,0.06)] hover:border-emerald-500/20'
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${item.colorClass} ${item.bgClass}`}>
            {item.icon}
          </div>
          <span className={`font-sans font-bold text-[11px] leading-tight tracking-tight line-clamp-2 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {item.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default StoryMobileQuickGrid;
