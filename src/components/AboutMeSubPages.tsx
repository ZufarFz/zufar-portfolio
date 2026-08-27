import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Flame, Smile, GraduationCap, Briefcase, Award, Heart, 
  BookOpen, Compass, ArrowLeft, Search, Calendar, MapPin, Mail, 
  ExternalLink, ChevronLeft, ChevronRight, Sparkles, Target, PenTool, Bookmark, Share2,
  Database, Shield, Terminal, ArrowRight, BookMarked, Check, LayoutGrid
} from 'lucide-react';
import { CVData } from '../types';
import BackgroundTextures from './BackgroundTextures';
import FloatingAssetsOverlay from './FloatingAssetsOverlay';
import SkillsArsenal from './SkillsArsenal';
import SectionGradientShadow from './SectionGradientShadow';
import { getThemeColorPalette } from '../lib/themeUtils';

const IconMap: Record<string, any> = {
  Cpu, Flame, Smile, GraduationCap, Briefcase, Award, Heart, 
  BookOpen, Compass, ArrowLeft, Search, Calendar, MapPin, Mail, 
  ExternalLink, ChevronRight, Sparkles, Target, PenTool, Bookmark, Share2,
  Database, Shield, Terminal, ArrowRight, BookMarked, Check, LayoutGrid
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
  lang?: 'id' | 'en';
  onBackToStory: () => void;
}

export default function AboutMeSubPages({ 
  subPage, 
  cvData, 
  theme, 
  lang = 'id',
  onBackToStory 
}: AboutMeSubPagesProps) {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [virtualActiveIdx, setVirtualActiveIdx] = useState(12000);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [thumbWidth, setThumbWidth] = useState(112);
  const [viewWidth, setViewWidth] = useState(484);

  const prevActiveProjectIdxRef = React.useRef(activeProjectIdx);
  const prevVirtualActiveIdxRef = React.useRef(virtualActiveIdx);

  React.useEffect(() => {
    prevActiveProjectIdxRef.current = activeProjectIdx;
  }, [activeProjectIdx]);

  React.useEffect(() => {
    prevVirtualActiveIdxRef.current = virtualActiveIdx;
  }, [virtualActiveIdx]);

  const preloadedCacheRef = React.useRef<HTMLImageElement[]>([]);

  // Pre-decode and cache images for smooth, instant rendering (60 FPS) without delay or flicker
  React.useEffect(() => {
    if (cvData.caseStudies && cvData.caseStudies.length > 0) {
      const cache: HTMLImageElement[] = [];
      const imageUrlsToPreload = new Set<string>();

      // Collect all case study images and fallback images
      cvData.caseStudies.forEach(p => {
        if (p.image) imageUrlsToPreload.add(p.image);
      });
      
      // Also add fallback images
      imageUrlsToPreload.add('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop');
      imageUrlsToPreload.add('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop');

      imageUrlsToPreload.forEach(url => {
        const img = new Image();
        img.src = url;
        if (img.decode) {
          img.decode()
            .then(() => {
              cache.push(img);
            })
            .catch((err) => {
              console.debug("Failed to decode preloaded image", url, err);
            });
        } else {
          img.onload = () => {
            cache.push(img);
          };
        }
      });

      preloadedCacheRef.current = cache;
    }
  }, [cvData.caseStudies]);

  React.useEffect(() => {
    const handleResize = () => {
      let w = 484;
      if (window.innerWidth < 640) {
        setThumbWidth(80);
        w = Math.max(160, window.innerWidth - 136);
      } else if (window.innerWidth < 768) {
        setThumbWidth(80);
        w = Math.max(240, window.innerWidth - 152);
      } else if (window.innerWidth < 1024) {
        setThumbWidth(90);
        w = 296;
      } else if (window.innerWidth < 1440) {
        setThumbWidth(96);
        w = 314;
      } else {
        setThumbWidth(112);
        w = 484;
      }
      setViewWidth(w);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top on mount so entry transition starts cleanly from top of viewport
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Safe navigation back helper
  const handleBack = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const currentLang = (parts[0] === 'id' || parts[0] === 'en') ? parts[0] : 'en';
    window.history.pushState(null, '', `/${currentLang}/about-me`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    onBackToStory();
  };

  // Helper to render dynamic icon
  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComponent = IconMap[iconName] || Compass;
    return <IconComponent className={className} />;
  };

  // A clean, generalized renderer for ANY of the 6 subpages or custom subpages
  const renderCustomPage = (
    pageKey: string,
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

    const subpageBgStyle = cvData.webTexts?.[`${prefix}_bg_style`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_style`] || cvData.webTexts?.about_subpages_bg_style || 'none';
    const subpageBgOpacity = cvData.webTexts?.[`${prefix}_bg_pattern_opacity`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_pattern_opacity`] || cvData.webTexts?.about_subpages_bg_pattern_opacity;
    const subpageBgScale = cvData.webTexts?.[`${prefix}_bg_pattern_scale`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_pattern_scale`] || cvData.webTexts?.about_subpages_bg_pattern_scale;
    const subpageBgColor = cvData.webTexts?.[`${prefix}_bg_pattern_color`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_pattern_color`] || cvData.webTexts?.about_subpages_bg_pattern_color;
    const subpageCustomSvg = cvData.webTexts?.[`${prefix}_bg_custom_svg`] || cvData.webTexts?.[`${prefix}_custom_svg`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_custom_svg`] || cvData.webTexts?.[`about_subpage_${prefix}_custom_svg`] || cvData.webTexts?.about_subpages_custom_svg;
    const subpageCustomUrl = cvData.webTexts?.[`${prefix}_bg_custom_url`] || cvData.webTexts?.[`${prefix}_custom_url`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_custom_url`] || cvData.webTexts?.[`about_subpage_${prefix}_custom_url`] || cvData.webTexts?.about_subpages_custom_url;

    const subpageBgColorVal = isDark
      ? (cvData.webTexts?.[`${prefix}_bg_color_dark`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_color_dark`] || cvData.webTexts?.about_subpages_bg_color_dark)
      : (cvData.webTexts?.[`${prefix}_bg_color`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_color`] || cvData.webTexts?.about_subpages_bg_color);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="min-h-screen pb-16 font-sans relative overflow-hidden"
        style={subpageBgColorVal ? { backgroundColor: subpageBgColorVal } : undefined}
      >
        {/* SECTION GRADIENT SHADOW OVERLAY */}
        <SectionGradientShadow 
          sectionKey={prefix} 
          webTexts={cvData.webTexts} 
          theme={theme} 
          accentHex={getThemeColorPalette(cvData.layoutSettings?.themeColor || 'blue').primary}
        />
        {/* Background Texture Overlay */}
        {subpageBgStyle && subpageBgStyle !== 'none' && (
          <BackgroundTextures
            type={subpageBgStyle}
            theme={theme}
            opacity={subpageBgOpacity ? parseFloat(subpageBgOpacity) : undefined}
            scale={subpageBgScale ? parseFloat(subpageBgScale) : undefined}
            color={subpageBgColor || undefined}
            customSvg={subpageCustomSvg || undefined}
            customBgUrl={subpageCustomUrl || undefined}
          />
        )}
        {/* Floating Decorative Assets Overlay */}
        <FloatingAssetsOverlay sectionId={prefix} assets={cvData.floatingAssets} />
        {/* Absolute Header Background Image Band */}
        <div className="absolute top-0 left-0 right-0 h-[540px] pointer-events-none overflow-hidden z-0">
          <img 
            src={bgUrl} 
            alt={`${title} Banner`} 
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover select-none pointer-events-none ${
              isDark ? 'opacity-25' : 'opacity-[0.35]'
            }`}
            style={{ 
              transform: `scale(${bgScale}) translate(${bgX / 5}%, ${bgY / 5}%)`,
              transformOrigin: 'center center'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${
            isDark 
              ? 'from-transparent via-[#0f172a]/75 via-60% to-[#0f172a]' 
              : 'from-transparent via-[#f7f9fb]/75 via-60% to-[#f7f9fb]'
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
          pageKey === 'skills' ? (
            <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
              <SkillsArsenal 
                skills={cvData.skills} 
                theme={theme} 
                customCategories={cvData.skillCategories} 
                lang={lang} 
                viewMode="detailed" 
              />
            </div>
          ) : (
            <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto py-16 px-4">
              <div className={`p-12 rounded-2xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-400 text-sm font-bold">No custom slides/sheets created yet.</p>
                <p className="text-slate-550 text-xs mt-1">Configure sections/slides for this page in the Admin Panel.</p>
              </div>
            </div>
          )
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
                    return e.id === section.linkedEducationDegree || e.degree === section.linkedEducationDegree || compositeKey === section.linkedEducationDegree;
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
                (pLayout === 'right' && iLayout === 'left') ||
                (pLayout === 'left' || pLayout === 'right')
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
                const fadeDir = section.imageFadeDirection || (pLayout === 'left' ? 'left' : pLayout === 'right' ? 'right' : 'center');
                
                if (fadeDir === 'right') {
                  const maskImg = `linear-gradient(to right, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.85) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'left') {
                  const maskImg = `linear-gradient(to left, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.85) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'top') {
                  const maskImg = `linear-gradient(to top, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.85) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'bottom') {
                  const maskImg = `linear-gradient(to bottom, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.85) ${Math.max(0, maskWidthVal - 25)}%, 
                    rgba(0,0,0,0.2) ${Math.max(0, maskWidthVal - 5)}%, 
                    rgba(0,0,0,0) ${maskWidthVal}%, 
                    rgba(0,0,0,0) 100%
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                } else if (fadeDir === 'oval') {
                  const ovalCenter = pLayout === 'left' ? '70%' : pLayout === 'right' ? '30%' : '50%';
                  const ovalW = section.ovalWidth !== undefined ? section.ovalWidth : 75;
                  const ovalH = section.ovalHeight !== undefined ? section.ovalHeight : 40;
                  const ovalP = (section.ovalPointiness !== undefined ? section.ovalPointiness : 50) / 100;
                  const stop1 = Math.round(Math.max(0, maskWidthVal - (5 + (ovalP * 40))));
                  const stop2 = Math.round(Math.max(stop1 + 2, maskWidthVal - (1 + (ovalP * 8))));
                  const maskImg = `radial-gradient(ellipse ${ovalW}% ${ovalH}% at ${ovalCenter} 50%, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0.85) ${stop1}%, 
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
                  )`;
                  imgMaskStyle = {
                    maskImage: maskImg,
                    WebkitMaskImage: maskImg
                  };
                }
              } else if (imgModel === 'bg_full') {
                if (section.imageFadeDirection === 'oval') {
                  const ovalCenter = pLayout === 'left' ? '70%' : pLayout === 'right' ? '30%' : '50%';
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

              const sectionMarginClass = idx === 0 ? '-mt-10 sm:-mt-14' : '-mt-15 sm:-mt-20';

              const maskStyle: React.CSSProperties = {
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 110px, black calc(100% - 110px), transparent 100%)',
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
                          <div 
                            className="w-full h-full origin-center"
                            style={{
                              transform: `scale(${section.imageScale || 1}) translate(${section.imageX || 0}px, ${section.imageY || 0}px)`,
                              ...imgMaskStyle,
                              WebkitMaskSize: '100% 100%',
                              maskSize: '100% 100%',
                              WebkitMaskRepeat: 'no-repeat',
                              maskRepeat: 'no-repeat'
                            }}
                          >
                            <SmoothImage 
                               src={section.imageUrl} 
                               alt="Slide Background Visual" 
                               className={`w-full h-full ${objectPositionClass}`}
                               targetOpacity={finalOpacity}
                               referrerPolicy="no-referrer"
                               showSkeleton={false}
                            />
                          </div>
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
  
  if (subPage === 'projects' || subPage === 'career-goals') {
    const list = cvData.caseStudies || [];
    const prefix = 'projects';
    const title = cvData.webTexts?.projects_title || 'Projek & Studi Kasus';
    const intro = cvData.webTexts?.projects_intro || cvData.webTexts?.projects_subtitle || 'Kumpulan lengkap studi kasus, analisis mendalam, dan demonstrasi solusi analitik ujung-ke-ujung.';
    const bgUrl = cvData.webTexts?.projects_header_bg || 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop';
    
    // Filter by search query for the BOTTOM grid
    const filteredList = list.filter(p => {
      const q = searchQuery.toLowerCase();
      const projectTools = p.tools && p.tools.length > 0 ? p.tools : (p.tags || []);
      return (
        p.title.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        (projectTools && projectTools.some(t => t.toLowerCase().includes(q)))
      );
    });

    const N = list.length;

    // We want displayList to be repeated if N is small, so M is at least 6.
    let displayList: Array<any & { displayKey: string; originalIdx: number }> = [];
    if (N > 0) {
      if (N === 1) {
        displayList = Array(6).fill(list[0]).map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: 0 }));
      } else if (N === 2) {
        const arr = [list[0], list[1], list[0], list[1], list[0], list[1]];
        displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
      } else if (N === 3) {
        const arr = [list[0], list[1], list[2], list[0], list[1], list[2]];
        displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
      } else if (N === 4) {
        const arr = [list[0], list[1], list[2], list[3], list[0], list[1], list[2], list[3]];
        displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
      } else if (N === 5) {
        const arr = [list[0], list[1], list[2], list[3], list[4], list[0], list[1], list[2], list[3], list[4]];
        displayList = arr.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx % N }));
      } else {
        displayList = list.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIdx: idx }));
      }
    }

    const M = displayList.length;
    const activeMIdx = M > 0 ? ((virtualActiveIdx % M) + M) % M : 0;
    const prevActiveMIdx = M > 0 ? ((prevVirtualActiveIdxRef.current % M) + M) % M : 0;

    const safeActiveIdx = displayList[activeMIdx] ? displayList[activeMIdx].originalIdx : 0;
    const activeProject = list[safeActiveIdx];

    // Keep activeProjectIdx state in sync with safeActiveIdx for external components reading it
    React.useEffect(() => {
      if (N > 0) {
        setActiveProjectIdx(safeActiveIdx);
      }
    }, [safeActiveIdx, N]);

    const getRelIdx = (idx: number, currentActiveMIdx: number, totalM: number) => {
      let relIdx = idx - currentActiveMIdx;
      while (relIdx < -1) {
        relIdx += totalM;
      }
      while (relIdx > 4) {
        relIdx -= totalM;
      }
      return relIdx;
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`min-h-screen pb-12 font-sans relative overflow-hidden flex flex-col justify-between ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f7f9fb] text-slate-900'
        }`}
      >
        {/* Immersive Background - Full Screen Image with absolutely no bottom gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeProject?.id || 'default'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={(activeProject?.image) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'} 
                alt={activeProject?.title || "Project Background"} 
                className="w-full h-full object-cover select-none pointer-events-none blur-md scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Showcase Slider Section */}
        {list.length > 0 && activeProject && (
          <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pt-12 md:pt-16 lg:pt-24 pb-12 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-auto md:h-[600px] lg:h-[650px] xl:h-[700px] flex flex-col justify-end py-4 md:py-8"
            >
              {/* Foreground content wrapper */}
              <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6 md:gap-6 lg:gap-8 xl:gap-12 my-auto">
                {/* Left Side: Selected Project Details */}
                <div className="w-full md:flex-1 md:min-w-0 flex flex-col justify-end items-start text-left gap-4 md:self-end">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProject.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`space-y-5 p-5 sm:p-8 md:p-10 rounded-3xl backdrop-blur-lg border w-full h-[480px] sm:h-[520px] md:h-[540px] lg:h-[590px] xl:h-[640px] flex flex-col justify-between overflow-y-auto scrollbar-none shadow-2xl ${
                        isDark 
                          ? 'bg-slate-950/40 border-white/10 shadow-slate-950/60' 
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

                      {(() => {
                        const projectTools = activeProject.tools && activeProject.tools.length > 0
                          ? activeProject.tools
                          : (activeProject.tags || []);
                        if (projectTools.length === 0) return null;
                        return (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {projectTools.map((tool, tIdx) => (
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
                        );
                      })()}

                      <div className="pt-4">
                        <button
                          onClick={() => {
                            const url = activeProject.projectUrl || 'https://github.com';
                            window.open(url, '_blank');
                          }}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer select-none active:scale-97 hover:-translate-y-0.5 ${
                            isDark 
                              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 shadow-lg shadow-slate-950/30' 
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

                {/* Right Side: Thumbnail Slider Gallery ("kotak2 kecil gambar project") */}
                <div className="w-full md:w-auto flex flex-col justify-end items-stretch md:items-end gap-3 z-30 md:self-end shrink-0 pt-4 md:pt-0">
                  {N > 1 && (
                    <>
                      <div className="flex items-center justify-between md:justify-end gap-2 w-full md:items-end">
                        {/* Left Arrow Button (Sebelumnya) */}
                        <button
                          onClick={() => {
                            setSlideDirection('prev');
                            setVirtualActiveIdx((prev) => prev - 1);
                          }}
                          className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center hover:-translate-x-0.5 active:scale-95 shrink-0 ${
                            isDark 
                              ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700/80 shadow-md shadow-slate-950/20' 
                              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-md shadow-slate-200/20'
                          }`}
                          title="Projek Sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>

                        {/* Thumbnails Container */}
                        <div style={{ width: viewWidth }} className="overflow-hidden h-[104px] sm:h-[120px] md:h-[136px] relative shrink-0">
                          <div className="absolute inset-0 flex items-center">
                            {displayList.map((p, idx) => {
                              const isActive = idx === activeMIdx;
                              
                              // Calculate wrapped relative index for circular placement
                              const relIdx = getRelIdx(idx, activeMIdx, M);
                              const prevRelIdx = getRelIdx(idx, prevActiveMIdx, M);
                              
                              // If wrapping, transition instantly to avoid slide-across artifact
                              const hasWrapped = Math.abs(relIdx - prevRelIdx) > 1.5;
  
                              // Scale and opacity depending on distance (active on the left, next 3 visible on the right)
                              const distance = relIdx;
                              let cardScale = 1;
                              let cardOpacity = 0;
                              const isClickable = distance >= 0 && distance <= 3;
  
                              if (distance === 0) {
                                cardScale = 1;
                                cardOpacity = 1;
                              } else if (distance === 1) {
                                cardScale = 0.85;
                                cardOpacity = 0.8;
                              } else if (distance === 2) {
                                cardScale = 0.72;
                                cardOpacity = 0.55;
                              } else if (distance === 3) {
                                cardScale = 0.60;
                                cardOpacity = 0.35;
                              } else if (distance === -1) {
                                cardScale = 0.50;
                                cardOpacity = 0; // hidden leftmost edge (slides in beautifully on Prev)
                              } else if (distance === 4) {
                                cardScale = 0.50;
                                cardOpacity = 0; // hidden rightmost edge (slides in beautifully on Next)
                              } else {
                                cardScale = 0.4;
                                cardOpacity = 0;
                              }

                              const thumbGap = thumbWidth >= 112 ? 12 : 10;
                              const targetX = 6 + relIdx * (thumbWidth + thumbGap);
   
                              return (
                                <motion.div
                                  key={p.displayKey}
                                  style={{ 
                                    pointerEvents: isClickable ? 'auto' : 'none',
                                    width: thumbWidth,
                                    height: thumbWidth
                                  }}
                                  onClick={() => {
                                    if (idx === activeMIdx) return;
                                    
                                    if (idx > activeMIdx) {
                                      setSlideDirection('next');
                                    } else {
                                      setSlideDirection('prev');
                                    }
                                    
                                    setVirtualActiveIdx(prev => {
                                      const dist = getRelIdx(idx, activeMIdx, M);
                                      return prev + dist;
                                    });
                                  }}
                                  animate={{ 
                                    scale: cardScale,
                                    opacity: cardOpacity,
                                    x: targetX
                                  }}
                                  transition={hasWrapped ? {
                                    type: "tween",
                                    duration: 0
                                  } : {
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 20,
                                    mass: 0.8
                                  }}
                                  className={`absolute left-0 top-1/2 -translate-y-1/2 shrink-0 rounded-xl overflow-hidden border transition-colors duration-300 cursor-pointer group ${
                                    isActive 
                                      ? (isDark ? 'border-emerald-500/80 z-10' : 'border-emerald-600/80 z-10')
                                      : (isDark 
                                          ? 'border-white/10 hover:border-white/20' 
                                          : 'border-slate-200 hover:border-slate-300')
                                  }`}
                                  title={`Tampilkan: ${p.title}`}
                                >
                                  <img 
                                    src={p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'} 
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-transparent transition-colors duration-300 flex items-end p-2.5 sm:p-3">
                                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold font-mono text-white/90 truncate w-full drop-shadow-md">
                                      {p.title}
                                    </span>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Arrow Button (Berikutnya) */}
                        <button
                          onClick={() => {
                            setSlideDirection('next');
                            setVirtualActiveIdx((prev) => prev + 1);
                          }}
                          className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center hover:translate-x-0.5 active:scale-95 shrink-0 ${
                            isDark 
                              ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700/80 shadow-md shadow-slate-950/20' 
                              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-md shadow-slate-200/20'
                          }`}
                          title="Projek Berikutnya"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  }

  // DYNAMIC CUSTOM SUBPAGE FALLBACK
  const customPageData = (cvData.customSubPages || []).find(p => p.id === subPage);
  if (customPageData || subPage) {
    const customTitle = customPageData 
      ? (lang === 'id' ? (customPageData.title || customPageData.titleEn) : (customPageData.titleEn || customPageData.title))
      : (cvData.webTexts?.[`${subPage}_title`] || subPage.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    const customSubtitle = customPageData
      ? (lang === 'id' ? (customPageData.subtitle || customPageData.subtitleEn) : (customPageData.subtitleEn || customPageData.subtitle))
      : (cvData.webTexts?.[`${subPage}_intro`] || cvData.webTexts?.[`${subPage}_subtitle`] || 'Explore detailed stories, achievements, and insights in this section.');
    const customBg = customPageData?.headerBg || cvData.webTexts?.[`${subPage}_header_bg`] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop';
    const IconComp = (customPageData?.iconName && IconMap[customPageData.iconName]) ? IconMap[customPageData.iconName] : Sparkles;

    return renderCustomPage(
      subPage,
      customTitle,
      customSubtitle,
      customBg,
      <IconComp className="w-8 h-8" />,
      customTitle
    );
  }

  return null;
}
