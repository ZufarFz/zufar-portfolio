import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Flame, Smile, GraduationCap, Briefcase, Award, Heart, 
  BookOpen, Compass, ArrowLeft, Search, Calendar, MapPin, Mail, 
  ExternalLink, ChevronRight, Sparkles, Target, PenTool, Bookmark, Share2,
  Database, Shield, Terminal, ArrowRight, BookMarked, Check
} from 'lucide-react';
import { CVData } from '../lib/supabaseClient';

const IconMap: Record<string, any> = {
  Cpu, Flame, Smile, GraduationCap, Briefcase, Award, Heart, 
  BookOpen, Compass, ArrowLeft, Search, Calendar, MapPin, Mail, 
  ExternalLink, ChevronRight, Sparkles, Target, PenTool, Bookmark, Share2,
  Database, Shield, Terminal, ArrowRight, BookMarked, Check
};

interface SmoothImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  targetOpacity?: number;
  showSkeleton?: boolean;
}

function SmoothImage({
  src,
  alt,
  className = "",
  style = {},
  targetOpacity = 1,
  showSkeleton = true,
  ...props
}: SmoothImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const isPreloaded = () => {
    if (typeof window !== 'undefined') {
      const cache = (window as any).__LOADED_IMAGES_CACHE;
      return !!(cache && cache.has(src));
    }
    return false;
  };

  const [loaded, setLoaded] = useState(isPreloaded);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (isPreloaded()) {
      setLoaded(true);
    } else {
      setLoaded(false);
      if (imgRef.current && imgRef.current.complete) {
        if (typeof window !== 'undefined') {
          (window as any).__LOADED_IMAGES_CACHE = (window as any).__LOADED_IMAGES_CACHE || new Set<string>();
          (window as any).__LOADED_IMAGES_CACHE.add(src);
        }
        setLoaded(true);
      }
    }
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 bg-slate-500/10 dark:bg-slate-400/5 animate-pulse rounded-2xl" />
      )}
      <img
        ref={imgRef as any}
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-1000 ease-out`}
        style={{
          ...style,
          opacity: loaded ? targetOpacity : 0
        }}
        onLoad={() => {
          if (typeof window !== 'undefined') {
            (window as any).__LOADED_IMAGES_CACHE = (window as any).__LOADED_IMAGES_CACHE || new Set<string>();
            (window as any).__LOADED_IMAGES_CACHE.add(src);
          }
          setLoaded(true);
        }}
        {...props}
      />
    </div>
  );
}

interface AboutMeSubPagesProps {
  key?: React.Key;
  subPage: string;
  cvData: CVData;
  theme: 'light' | 'dark';
  onBackToStory: () => void;
}

export default function AboutMeSubPages({ 
  subPage, 
  cvData, 
  theme, 
  onBackToStory 
}: AboutMeSubPagesProps) {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top on mount so entry transition starts cleanly from top of viewport
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Safe navigation back helper
  const handleBack = () => {
    window.location.hash = '#/about-me';
    onBackToStory();
  };

  // Helper to render dynamic icon
  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComponent = IconMap[iconName] || Compass;
    return <IconComponent className={className} />;
  };

  // A clean, generalized renderer for ANY of the 6 subpages
  const renderCustomPage = (
    pageKey: 'education' | 'personality' | 'hobbies' | 'career-journey' | 'skills' | 'career-goals',
    defaultTitle: string,
    defaultIntro: string,
    defaultBgUrl: string,
    defaultIcon: React.ReactNode,
    categoryLabel: string
  ) => {
    // 1. Get header texts
    const title = cvData.webTexts?.[`${pageKey.replace('-', '_')}_title`] || defaultTitle;
    const intro = cvData.webTexts?.[`${pageKey.replace('-', '_')}_intro`] || defaultIntro;
    const bgUrl = cvData.webTexts?.[`${pageKey.replace('-', '_')}_header_bg`] || defaultBgUrl;

    // 2. Load custom sections or fallback to default sections
    let rawSections = cvData.educationSections || [];
    
    // Filter sections for this page.
    let filteredSections = [];
    if (pageKey === 'education') {
      filteredSections = rawSections.filter(es => !es.linkedEducationDegree?.startsWith("page:") && !es.linkedEducationDegree?.startsWith("item:"));
    } else {
      filteredSections = rawSections.filter(es => 
        es.linkedEducationDegree === `page:${pageKey}` || 
        es.linkedEducationDegree?.startsWith(`item:${pageKey}:`)
      );
    }

    // Sort by sortOrder
    const sortedSections = [...filteredSections].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // If no sections exist for this page, let's auto-generate fallback sections from the structured list of items!
    let displaySections = [...sortedSections];
    if (displaySections.length === 0) {
      if (pageKey === 'education') {
        // Default empty, as requested by user
        displaySections = [];
      } else if (pageKey === 'personality') {
        const list = cvData.personality || [];
        list.forEach((p, idx) => {
          displaySections.push({
            id: `fallback-pers-${p.id}`,
            title: p.title,
            content: p.description,
            imageUrl: "",
            layoutType: idx % 2 === 0 ? "image_left" as const : "image_right" as const,
            bgColor: idx % 2 === 0 ? "slate" as const : "indigo" as const,
            linkedEducationDegree: `item:personality:${p.id}`,
            sortOrder: idx
          });
        });
      } else if (pageKey === 'hobbies') {
        const list = cvData.hobbies || [];
        list.forEach((h, idx) => {
          displaySections.push({
            id: `fallback-hobby-${h.id}`,
            title: h.title,
            content: h.description,
            imageUrl: "",
            layoutType: idx % 2 === 0 ? "image_left" as const : "image_right" as const,
            bgColor: idx % 2 === 0 ? "slate" as const : "rose" as const,
            linkedEducationDegree: `item:hobbies:${h.id}`,
            sortOrder: idx
          });
        });
      } else if (pageKey === 'career-goals') {
        const list = cvData.careerGoals || [];
        list.forEach((cg, idx) => {
          displaySections.push({
            id: `fallback-goal-${cg.id}`,
            title: cg.title,
            content: cg.description,
            imageUrl: "",
            layoutType: "centered_hero" as const,
            bgColor: "slate" as const,
            linkedEducationDegree: `item:career-goals:${cg.id}`,
            sortOrder: idx
          });
        });
      } else if (pageKey === 'skills') {
        const list = cvData.skills || [];
        list.forEach((s, idx) => {
          displaySections.push({
            id: `fallback-skill-${s.id}`,
            title: s.name,
            content: s.description,
            imageUrl: "",
            layoutType: "image_left" as const,
            bgColor: "slate" as const,
            linkedEducationDegree: `item:skills:${s.id}`,
            sortOrder: idx
          });
        });
      } else if (pageKey === 'career-journey') {
        const list = cvData.experiences || [];
        list.forEach((exp, idx) => {
          displaySections.push({
            id: `fallback-exp-${exp.id}`,
            title: `${exp.role} @ ${exp.company}`,
            content: exp.bulletPoints.join("\n• "),
            imageUrl: "",
            layoutType: "image_right" as const,
            bgColor: "slate" as const,
            linkedEducationDegree: `item:career-journey:${exp.id}`,
            sortOrder: idx
          });
        });
      }
    }

    const prefix = pageKey.replace('-', '_');
    const bgScale = parseFloat(cvData.webTexts?.[`${prefix}_header_bg_scale`] || '1');
    const bgX = parseInt(cvData.webTexts?.[`${prefix}_header_bg_x`] || '0', 10);
    const bgY = parseInt(cvData.webTexts?.[`${prefix}_header_bg_y`] || '0', 10);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="min-h-screen pb-16 font-sans relative overflow-hidden"
      >
        {/* Absolute Header Background Image Band */}
        <div className="absolute top-0 left-0 right-0 h-[480px] pointer-events-none overflow-hidden z-0">
          <img 
            src={bgUrl} 
            alt={`${title} Banner`} 
            className={`w-full h-full object-cover select-none pointer-events-none ${
              isDark ? 'opacity-20' : 'opacity-[0.32]'
            }`}
            style={{ 
              referrerPolicy: "no-referrer",
              transform: `scale(${bgScale}) translate(${bgX / 5}%, ${bgY / 5}%)`,
              transformOrigin: 'center center'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${
            isDark 
              ? 'from-transparent via-[#0f172a]/85 to-[#0f172a]' 
              : 'from-transparent via-[#f7f9fb]/85 to-[#f7f9fb]'
          }`} />
        </div>

        {/* Intro Hero Section */}
        <div className="py-24 px-4 text-center relative overflow-hidden transition-colors duration-300 z-10">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className={`font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className={`font-sans text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-650'
              }`}
            >
              {intro}
            </motion.p>
          </div>
        </div>

        {/* Main Sections Stack */}
        {displaySections.length === 0 ? (
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto py-16 px-4">
            <div className={`p-12 rounded-2xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-400 text-sm font-bold">No custom slides/sheets created yet.</p>
              <p className="text-slate-550 text-xs mt-1">Configure sections/slides for this page in the Admin Panel.</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col">
            {displaySections.map((section, idx) => {
              const bgOpt = section.bgColor || 'slate';
              let sectionBgClass = '';
              let textColor = '';
              let titleColor = '';
              let accentBadge = '';
                           if (isDark) {
                if (bgOpt === 'emerald') {
                  sectionBgClass = 'bg-gradient-to-br from-emerald-955/40 via-emerald-900/10 to-slate-955/30';
                  textColor = 'text-emerald-200/90';
                  titleColor = 'text-emerald-50 font-black';
                  accentBadge = 'bg-emerald-955/80 border-emerald-500/30 text-emerald-400';
                } else if (bgOpt === 'indigo') {
                  sectionBgClass = 'bg-gradient-to-br from-indigo-955/40 via-indigo-900/10 to-slate-955/30';
                  textColor = 'text-indigo-200/90';
                  titleColor = 'text-indigo-50 font-black';
                  accentBadge = 'bg-indigo-955/80 border-indigo-500/30 text-indigo-400';
                } else if (bgOpt === 'amber') {
                  sectionBgClass = 'bg-gradient-to-br from-amber-955/30 via-amber-900/10 to-slate-955/30';
                  textColor = 'text-amber-200/90';
                  titleColor = 'text-amber-50 font-black';
                  accentBadge = 'bg-amber-955/80 border-amber-500/30 text-amber-400';
                } else if (bgOpt === 'rose') {
                  sectionBgClass = 'bg-gradient-to-br from-rose-955/30 via-rose-900/10 to-slate-955/30';
                  textColor = 'text-rose-200/90';
                  titleColor = 'text-rose-50 font-black';
                  accentBadge = 'bg-rose-955/80 border-rose-500/30 text-rose-400';
                } else if (bgOpt === 'dark') {
                  sectionBgClass = 'bg-slate-955';
                  textColor = 'text-slate-400';
                  titleColor = 'text-slate-100 font-black';
                  accentBadge = 'bg-slate-900 border-slate-800 text-slate-300';
                } else if (bgOpt === 'light') {
                  sectionBgClass = 'bg-white/[0.03]';
                  textColor = 'text-slate-400';
                  titleColor = 'text-slate-100 font-black';
                  accentBadge = 'bg-white/[0.05] border-white/[0.10] text-slate-300';
                } else {
                  sectionBgClass = 'bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-955/30';
                  textColor = 'text-slate-300/95';
                  titleColor = 'text-white font-black';
                  accentBadge = 'bg-slate-900 border-slate-800 text-slate-300';
                }
              } else {
                if (bgOpt === 'emerald') {
                  sectionBgClass = 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/20 shadow-xs';
                  textColor = 'text-emerald-900/80';
                  titleColor = 'text-emerald-955 font-black';
                  accentBadge = 'bg-emerald-100/70 border-emerald-200 text-emerald-800';
                } else if (bgOpt === 'indigo') {
                  sectionBgClass = 'bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/20 shadow-xs';
                  textColor = 'text-indigo-900/80';
                  titleColor = 'text-indigo-955 font-black';
                  accentBadge = 'bg-indigo-100/70 border-indigo-200 text-indigo-850';
                } else if (bgOpt === 'amber') {
                  sectionBgClass = 'bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 shadow-xs';
                  textColor = 'text-amber-900/80';
                  titleColor = 'text-amber-955 font-black';
                  accentBadge = 'bg-amber-100/70 border-amber-200 text-amber-850';
                } else if (bgOpt === 'rose') {
                  sectionBgClass = 'bg-gradient-to-br from-rose-50/60 via-white to-rose-50/20 shadow-xs';
                  textColor = 'text-rose-900/80';
                  titleColor = 'text-rose-955 font-black';
                  accentBadge = 'bg-rose-100/70 border-rose-200 text-rose-850';
                } else if (bgOpt === 'dark') {
                  sectionBgClass = 'bg-slate-900 text-white shadow-md';
                  textColor = 'text-slate-300';
                  titleColor = 'text-white font-black';
                  accentBadge = 'bg-slate-800 border-slate-700 text-slate-200';
                } else if (bgOpt === 'light') {
                  sectionBgClass = 'bg-white shadow-2xs';
                  textColor = 'text-slate-650';
                  titleColor = 'text-slate-900 font-black';
                  accentBadge = 'bg-slate-50 border-slate-200 text-slate-700';
                } else {
                  sectionBgClass = 'bg-gradient-to-b from-slate-100/50 via-white to-slate-50/30 shadow-2xs';
                  textColor = 'text-slate-650';
                  titleColor = 'text-slate-900 font-black';
                  accentBadge = 'bg-slate-150 border-slate-250 text-slate-700';
                }
              }

              let displayTitle = section.title;
              let displayBadge = categoryLabel;
              let displayContent = section.content;
              let iconName = "";
              let linkedDetailsNode = null;

              if (section.linkedEducationDegree) {
                if (section.linkedEducationDegree.startsWith("item:personality:")) {
                  const itemId = section.linkedEducationDegree.replace("item:personality:", "");
                  const item = cvData.personality?.find(p => p.id === itemId);
                  if (item) {
                    displayTitle = item.title;
                    displayBadge = "Personality & Values";
                    displayContent = item.description;
                    iconName = item.icon;
                  }
                } else if (section.linkedEducationDegree.startsWith("item:hobbies:")) {
                  const itemId = section.linkedEducationDegree.replace("item:hobbies:", "");
                  const item = cvData.hobbies?.find(h => h.id === itemId);
                  if (item) {
                    displayTitle = item.title;
                    displayBadge = "Hobbies & Interests";
                    displayContent = item.description;
                    iconName = item.icon;
                  }
                } else if (section.linkedEducationDegree.startsWith("item:career-goals:")) {
                  const itemId = section.linkedEducationDegree.replace("item:career-goals:", "");
                  const item = cvData.careerGoals?.find(cg => cg.id === itemId);
                  if (item) {
                    displayTitle = item.title;
                    displayBadge = `Target Year: ${item.target_year}`;
                    displayContent = item.description;
                    iconName = item.icon;
                  }
                } else if (section.linkedEducationDegree.startsWith("item:skills:")) {
                  const itemId = section.linkedEducationDegree.replace("item:skills:", "");
                  const item = cvData.skills?.find(s => s.id === itemId);
                  if (item) {
                    displayTitle = item.name;
                    displayBadge = `Skill — ${item.category}`;
                    displayContent = item.description;
                    iconName = item.icon;
                  }
                } else if (section.linkedEducationDegree.startsWith("item:career-journey:")) {
                  const itemId = section.linkedEducationDegree.replace("item:career-journey:", "");
                  const item = cvData.experiences?.find(exp => exp.id === itemId);
                  if (item) {
                    displayTitle = `${item.role} @ ${item.company}`;
                    displayBadge = item.period;
                    displayContent = item.bulletPoints.join("\n• ");
                    iconName = "Briefcase";
                    
                    if (item.tools && item.tools.length > 0) {
                      linkedDetailsNode = (
                        <div className="flex flex-wrap gap-1 mt-4">
                          {item.tools.map((tool, tIdx) => (
                            <span key={tIdx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${
                              isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}>
                              {tool}
                            </span>
                          ))}
                        </div>
                      );
                    }
                  }
                } else {
                  const linkedEdu = cvData.education?.find(e => {
                    const compositeKey = `${e.degree}|||${e.institution}`;
                    return e.degree === section.linkedEducationDegree || compositeKey === section.linkedEducationDegree;
                  });
                  if (linkedEdu) {
                    displayTitle = `${linkedEdu.institution} — ${linkedEdu.degree}`;
                    displayBadge = linkedEdu.degree;
                    const eduDesc = linkedEdu.description || '';
                    const sectionContent = section.content || '';
                    if (eduDesc.trim()) {
                      const cleanedSec = sectionContent.trim();
                      const isDefaultTemplate = cleanedSec === 'Keterangan atau narasi untuk lembar ini. Jelaskan secara detail mata kuliah, aktivitas, atau kisah perjuangan Anda di institusi terkait.';
                      if (cleanedSec && !isDefaultTemplate) {
                        displayContent = `${eduDesc}\n\n${sectionContent}`;
                      } else {
                        displayContent = eduDesc;
                      }
                    }
                    iconName = "GraduationCap";
                  }
                }
              }

              const pLayout = section.paragraphLayout || (
                section.layoutType === 'image_left' ? 'right' :
                section.layoutType === 'image_right' ? 'left' :
                section.layoutType === 'centered_hero' ? 'center' :
                section.layoutType === 'split_grid' ? 'left' : 'left'
              );

              const iLayout = section.imageLayout || (
                pLayout === 'left' ? 'right' :
                pLayout === 'right' ? 'left' : 'center'
              );

              const orient = section.imageOrientation || 'landscape';
              const imgModel = section.imageModel || (
                (orient === 'background_full' || orient === 'background_edge')
                  ? (orient === 'background_edge' ? 'bg_smooth' : 'bg_full')
                  : 'normal'
              );

              const isBgMode = imgModel === 'bg_full' || imgModel === 'bg_smooth';
              const isSideBySide = !isBgMode && (
                (pLayout === 'left' && iLayout === 'right') ||
                (pLayout === 'right' && iLayout === 'left')
              );
              const imgAspectClass = orient === 'portrait' ? 'aspect-[3/4]' : 'aspect-video';

              // Calculate matching RGB color code for overlays based on selected background theme
              let overlayBgColor = '';
              if (isDark) {
                if (bgOpt === 'emerald') overlayBgColor = '6, 78, 59'; // rgb of emerald-900
                else if (bgOpt === 'indigo') overlayBgColor = '49, 46, 129'; // rgb of indigo-900
                else if (bgOpt === 'amber') overlayBgColor = '120, 53, 4'; // rgb of amber-900
                else if (bgOpt === 'rose') overlayBgColor = '136, 19, 55'; // rgb of rose-900
                else if (bgOpt === 'dark') overlayBgColor = '2, 6, 23'; // rgb of slate-950
                else overlayBgColor = '15, 23, 42'; // rgb of slate-900 (default/light)
              } else {
                if (bgOpt === 'emerald') overlayBgColor = '240, 253, 244'; // rgb of emerald-50
                else if (bgOpt === 'indigo') overlayBgColor = '238, 242, 255'; // rgb of indigo-50
                else if (bgOpt === 'amber') overlayBgColor = '254, 243, 199'; // rgb of amber-50
                else if (bgOpt === 'rose') overlayBgColor = '255, 241, 242'; // rgb of rose-50
                else if (bgOpt === 'dark') overlayBgColor = '15, 23, 42'; // rgb of slate-900
                else if (bgOpt === 'light') overlayBgColor = '255, 255, 255'; // rgb of white
                else overlayBgColor = '241, 245, 249'; // rgb of slate-100 (default)
              }

              const maskWidthVal = section.maskWidth !== undefined ? section.maskWidth : 50;
              const finalOpacity = section.imageOpacity !== undefined
                ? section.imageOpacity
                : (isBgMode
                  ? (imgModel === 'bg_smooth'
                    ? (isDark ? 0.48 : 0.58)
                    : (isDark ? 0.38 : 0.46))
                  : 1.0);

              let imgMaskStyle: React.CSSProperties = {};
              if (imgModel === 'bg_smooth') {
                const fadeDir = section.imageFadeDirection || (iLayout === 'left' ? 'right' : iLayout === 'right' ? 'left' : 'center');
                
                if (fadeDir === 'right') {
                  const maskImg = `linear-gradient(to right, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.8) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  ), linear-gradient(to bottom,
                    rgba(0,0,0,0.85) 0%,
                    rgba(0,0,0,0.98) 15%,
                    rgba(0,0,0,0.98) 85%,
                    rgba(0,0,0,0.85) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'left') {
                  const maskImg = `linear-gradient(to left, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.8) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  ), linear-gradient(to bottom,
                    rgba(0,0,0,0.85) 0%,
                    rgba(0,0,0,0.98) 15%,
                    rgba(0,0,0,0.98) 85%,
                    rgba(0,0,0,0.85) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'top') {
                  const maskImg = `linear-gradient(to top, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.8) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  ), linear-gradient(to right,
                    rgba(0,0,0,0.85) 0%,
                    rgba(0,0,0,0.98) 15%,
                    rgba(0,0,0,0.98) 85%,
                    rgba(0,0,0,0.85) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'bottom') {
                  const maskImg = `linear-gradient(to bottom, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.8) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  ), linear-gradient(to right,
                    rgba(0,0,0,0.85) 0%,
                    rgba(0,0,0,0.98) 15%,
                    rgba(0,0,0,0.98) 85%,
                    rgba(0,0,0,0.85) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'oval') {
                  const ovalCenter = iLayout === 'left' ? '30%' : iLayout === 'right' ? '70%' : '50%';
                  const ovalW = section.ovalWidth !== undefined ? section.ovalWidth : 75;
                  const ovalH = section.ovalHeight !== undefined ? section.ovalHeight : 40;
                  const ovalP = (section.ovalPointiness !== undefined ? section.ovalPointiness : 50) / 100;
                  const stop1 = Math.round(Math.max(0, maskWidthVal - (5 + (ovalP * 40))));
                  const stop2 = Math.round(Math.max(stop1 + 2, maskWidthVal - (1 + (ovalP * 8))));
                  const maskImg = `radial-gradient(ellipse ${ovalW}% ${ovalH}% at ${ovalCenter} 50%, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.8) ${stop1}%, 
                    rgba(0,0,0,0.2) ${stop2}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else {
                  const maskImg = `linear-gradient(to right, 
                    rgba(0,0,0,0) 0%, 
                    rgba(0,0,0,0.9) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0.2) ${Math.min(100, 100 - maskWidthVal + 5)}%, 
                    rgba(0,0,0,0.9) ${Math.min(100, 100 - maskWidthVal + 25)}%, 
                    rgba(0,0,0,0) 100%
                  ), linear-gradient(to bottom,
                    rgba(0,0,0,0.85) 0%,
                    rgba(0,0,0,0.98) 15%,
                    rgba(0,0,0,0.98) 85%,
                    rgba(0,0,0,0.85) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                }
              } else {
                if (section.imageFadeDirection === 'oval') {
                  const ovalCenter = iLayout === 'left' ? '30%' : iLayout === 'right' ? '70%' : '50%';
                  const ovalW = section.ovalWidth !== undefined ? section.ovalWidth : 75;
                  const ovalH = section.ovalHeight !== undefined ? section.ovalHeight : 40;
                  const ovalP = (section.ovalPointiness !== undefined ? section.ovalPointiness : 50) / 100;
                  const stop1 = Math.round(Math.max(0, maskWidthVal - (5 + (ovalP * 40))));
                  const stop2 = Math.round(Math.max(stop1 + 2, maskWidthVal - (1 + (ovalP * 8))));
                  const maskImg = `radial-gradient(ellipse ${ovalW}% ${ovalH}% at ${ovalCenter} 50%, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.85) ${stop1}%, 
                    rgba(0,0,0,0.4) ${stop2}%, 
                    rgba(0,0,0,0.15) ${maskWidthVal}%, 
                    rgba(0,0,0,0.15) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (section.imageFadeDirection === 'left') {
                  const maskImg = `linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) ${maskWidthVal}%)`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (section.imageFadeDirection === 'right') {
                  const maskImg = `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) ${maskWidthVal}%)`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (section.imageFadeDirection === 'top') {
                  const maskImg = `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) ${maskWidthVal}%)`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (section.imageFadeDirection === 'bottom') {
                  const maskImg = `linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) ${maskWidthVal}%)`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else {
                  const maskImg = `linear-gradient(to bottom, 
                    rgba(0,0,0,0.8) 0%, 
                    rgba(0,0,0,0.95) 15%, 
                    rgba(0,0,0,0.95) 85%, 
                    rgba(0,0,0,0.8) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                }
              }

              const align = section.textAlign || 'left';
              const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : align === 'justify' ? 'text-justify' : 'text-left';

              const size = section.imageSize || 'medium';
              let sizeClass = '';
              let imageStyle: React.CSSProperties = {};
              
              const isNumeric = !isNaN(Number(size)) || (typeof size === 'string' && (size.includes('%') || /^\d+$/.test(size)));

              if (isSideBySide) {
                // For left/right side-by-side images, use a highly consistent and uniform container sizing
                if (orient === 'portrait') {
                  sizeClass = 'w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto';
                } else {
                  sizeClass = 'w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto';
                }
              } else {
                if (isNumeric) {
                  const numericVal = parseInt(String(size), 10);
                  if (!isNaN(numericVal)) {
                    const percent = Math.max(10, Math.min(100, numericVal));
                    imageStyle = { maxWidth: `${percent}%` };
                    sizeClass = 'w-full mx-auto';
                  }
                } else {
                  if (orient === 'portrait') {
                    if (size === 'small') sizeClass = 'max-w-[200px] sm:max-w-[240px]';
                    else if (size === 'large') sizeClass = 'max-w-[360px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[560px] 2xl:max-w-[620px]';
                    else sizeClass = 'max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] 2xl:max-w-[480px]';
                  } else {
                    if (size === 'small') sizeClass = 'max-w-xs md:max-w-sm';
                    else if (size === 'large') sizeClass = 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl';
                    else sizeClass = 'max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl';
                  }
                }
              }

              const renderLinkedEduCard = () => {
                if (!section.linkedEducationDegree) return null;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`mt-4 px-4 py-2 rounded-full border text-left flex items-center justify-between gap-3 transition-colors w-fit ${
                      isDark 
                        ? 'bg-slate-955/60 border-emerald-500/20 hover:border-emerald-500/40' 
                        : 'bg-emerald-50/50 border-emerald-100 shadow-xs hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-emerald-500 font-mono text-[9px] font-extrabold uppercase tracking-widest">
                      <Check className="w-3.5 h-3.5 animate-pulse" />
                      <span>Verifikasi Kredensial Resmi • {displayBadge}</span>
                    </div>
                  </motion.div>
                );
              };

              const nextSection = displaySections[idx + 1];
              const isCurrentBg = isBgMode;

              const nextOrient = nextSection?.imageOrientation || 'landscape';
              const nextImgModel = nextSection?.imageModel || (
                (nextOrient === 'background_full' || nextOrient === 'background_edge')
                  ? (nextOrient === 'background_edge' ? 'bg_smooth' : 'bg_full')
                  : 'normal'
              );
              const isNextBg = nextSection && (nextImgModel === 'bg_full' || nextImgModel === 'bg_smooth');

              const sectionMarginClass = idx > 0 ? '-mt-15 sm:-mt-20' : '';

              const maskStyle: React.CSSProperties = displaySections.length <= 1 ? {} : {
                maskImage: idx === 0 
                  ? 'linear-gradient(to bottom, black 0%, black calc(100% - 110px), transparent 100%)'
                  : idx === displaySections.length - 1
                    ? 'linear-gradient(to bottom, transparent 0%, black 110px, black 100%)'
                    : 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
                WebkitMaskImage: idx === 0 
                  ? 'linear-gradient(to bottom, black 0%, black calc(100% - 110px), transparent 100%)'
                  : idx === displaySections.length - 1
                    ? 'linear-gradient(to bottom, transparent 0%, black 110px, black 100%)'
                    : 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
              };

               return (
                <motion.section 
                  key={section.id || idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden transition-colors duration-300 ${sectionBgClass} ${
                    isBgMode 
                      ? 'min-h-[80vh] pt-32 pb-24 sm:pt-40 sm:pb-40 flex items-center' 
                      : 'pt-28 pb-24 sm:pt-40 sm:pb-38'
                  } ${sectionMarginClass}`}
                  style={maskStyle}
                >
                  {isDark && (
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                  )}

                  {/* Absolute full background image overlay if background mode is active */}
                  {isBgMode && section.imageUrl && (
                    (() => {
                      const containerClass = "absolute inset-0 z-0 select-none pointer-events-none overflow-hidden";
                      let objectPositionClass = "object-cover";

                      if (imgModel === 'bg_smooth') {
                        if (iLayout === 'left') {
                          objectPositionClass = "object-cover object-left";
                        } else if (iLayout === 'right') {
                          objectPositionClass = "object-cover object-right";
                        }
                      }

                      return (
                        <div className={containerClass}>
                          <SmoothImage 
                             src={section.imageUrl} 
                             alt="Slide Background Visual" 
                             className={`w-full h-full ${objectPositionClass}`}
                             targetOpacity={finalOpacity}
                             style={{ 
                               transform: `scale(${section.imageScale || 1}) translate(${section.imageX || 0}px, ${section.imageY || 0}px)`,
                               ...imgMaskStyle
                             }}
                             referrerPolicy="no-referrer"
                             showSkeleton={false}
                          />
                        </div>
                      );
                    })()
                  )}

                  <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1560px] mx-auto w-full relative z-10">
                    {(() => {
                      // Helper to render narrative / paragraph block
                      const renderParagraphBlock = () => {
                        const pAlignClass = pLayout === 'center' ? 'text-center' : pLayout === 'right' ? 'text-right' : 'text-left';
                        const badgeAlignClass = pLayout === 'center' ? 'mx-auto' : pLayout === 'right' ? 'ml-auto' : 'mr-auto';

                        const innerContent = (
                          <div className="space-y-4">
                            <motion.h2 
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                              className={`font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight ${titleColor} ${pAlignClass}`}
                            >
                              {displayTitle}
                            </motion.h2>
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                              className={`font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line ${alignClass} ${textColor}`}
                            >
                              {displayContent}
                            </motion.div>
                            {linkedDetailsNode && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                              >
                                {linkedDetailsNode}
                              </motion.div>
                            )}
                          </div>
                        );

                        if (isBgMode) {
                          return (
                            <div className="bg-transparent p-0">
                              {innerContent}
                            </div>
                          );
                        }

                        return innerContent;
                      };

                      // Helper to render image block (normal mode)
                      const renderImageBlock = () => {
                        if (isBgMode) return null;
                        const wrapperAlignClass = iLayout === 'center' ? 'justify-center' : iLayout === 'right' ? 'justify-end' : 'justify-start';

                        if (section.imageUrl) {
                          return (
                            <div className={`w-full flex ${wrapperAlignClass} overflow-hidden rounded-2xl`}>
                              <SmoothImage 
                                src={section.imageUrl} 
                                alt={displayTitle} 
                                className={`rounded-2xl shadow-lg border object-cover transition-all duration-500 hover:scale-[1.01] ${imgAspectClass} ${sizeClass}`}
                                targetOpacity={finalOpacity}
                                style={{ 
                                  ...imageStyle,
                                  transform: `scale(${section.imageScale || 1}) translate(${section.imageX || 0}px, ${section.imageY || 0}px)`,
                                  borderColor: isDark ? '#1e293b' : '#e2e8f0' 
                                }}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div className={`w-full flex ${wrapperAlignClass}`}>
                              <div className={`rounded-2xl border aspect-video flex flex-col items-center justify-center p-6 ${
                                isDark ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'
                              } ${sizeClass}`} style={imageStyle}>
                                <div className={`p-4 rounded-full mb-3 ${isDark ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-emerald-700'}`}>
                                  {renderIcon(iconName || 'Award', "w-6 h-6")}
                                </div>
                                <span className="text-slate-400 font-bold text-xs font-mono">Visual Node</span>
                              </div>
                            </div>
                          );
                        }
                      };

                      if (isSideBySide) {
                        const isParagraphLeft = pLayout === 'left';
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 xl:gap-16 2xl:gap-24 items-center">
                            <div className={`${isParagraphLeft ? 'md:order-1' : 'md:order-2'} w-full`}>
                              {renderParagraphBlock()}
                            </div>
                            <div className={`${isParagraphLeft ? 'md:order-2' : 'md:order-1'} w-full`}>
                              {renderImageBlock()}
                            </div>
                          </div>
                        );
                      } else {
                        // Stacked layout (both centered, or same side, or background mode)
                        const pWrapperClass = pLayout === 'center' 
                          ? 'mx-auto text-center max-w-4xl xl:max-w-5xl 2xl:max-w-6xl' 
                          : pLayout === 'right' 
                            ? 'ml-auto text-right w-full md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] 2xl:max-w-[50%]' 
                            : 'mr-auto text-left w-full md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] 2xl:max-w-[50%]';
                        return (
                          <div className="flex flex-col gap-8 w-full">
                            <div className={pWrapperClass}>
                              {renderParagraphBlock()}
                            </div>
                            {!isBgMode && (
                              <div className="w-full">
                                {renderImageBlock()}
                              </div>
                            )}
                          </div>
                        );
                      }
                    })()}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        {/* Fading bottom overlay */}
        <div className={`h-24 w-full pointer-events-none -mt-24 relative z-20 ${
          isDark 
            ? 'bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent' 
            : 'bg-gradient-to-t from-[#f7f9fb] via-[#f7f9fb]/90 to-transparent'
        }`} />
      </motion.div>
    );
  };

  if (subPage === 'education') {
    return renderCustomPage('education', 'Educational Background & Story', 'Explore my academic achievements, scientific training foundations, and formal credential roadmaps.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop', <GraduationCap className="w-8 h-8" />, 'Pendidikan');
  }
  if (subPage === 'personality') {
    return renderCustomPage('personality', 'Personality & Values', 'My operating principles, character ethics, and core professional values that guide my collaborative work style.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop', <Cpu className="w-8 h-8" />, 'Personality & Values');
  }
  if (subPage === 'hobbies') {
    return renderCustomPage('hobbies', 'Hobbies & Interests', 'What keeps me inspired and energizes my creative problem-solving outside of regular business hours.', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop', <Heart className="w-8 h-8" />, 'Hobbies & Interests');
  }
  if (subPage === 'career-journey') {
    return renderCustomPage('career-journey', 'Career Journey & Milestones', 'My timeline of professional experiences, highlighting analytical leadership, data strategy, and metric modernization.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop', <Briefcase className="w-8 h-8" />, 'Experience');
  }
  if (subPage === 'skills') {
    return renderCustomPage('skills', 'Skills & Technical Arsenal', 'My categorized skill arsenal spanning across data pipelines, DBMS, engineering stacks, and visual communication.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop', <Cpu className="w-8 h-8" />, 'Skills & Expertise');
  }
  if (subPage === 'career-goals') {
    return renderCustomPage('career-goals', 'Career Goals & Aspirations', 'My tactical career development roadmap, detailing target professional milestones and aspirational horizons.', 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1200&auto=format&fit=crop', <Target className="w-8 h-8" />, 'Career Goals');
  }

  return null;
}
