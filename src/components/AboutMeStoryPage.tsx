import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Smile, 
  Terminal, 
  Award, 
  Compass, 
  Cpu, 
  Flame, 
  ArrowLeft,
  PenTool,
  Bookmark,
  Share2,
  GitBranch,
  Atom,
  Heart,
  GraduationCap,
  Briefcase,
  Target,
  LayoutGrid,
  BookOpen
} from 'lucide-react';
import { CVData } from '../types';
import Lanyard from './Lanyard';
import BackgroundTextures from './BackgroundTextures';
import FloatingAssetsOverlay from './FloatingAssetsOverlay';
import SectionGradientShadow from './SectionGradientShadow';
import { getThemeColorPalette } from '../lib/themeUtils';

interface AboutMeStoryPageProps {
  key?: React.Key;
  cvData: CVData;
  theme: 'light' | 'dark';
  onBackToMain: () => void;
  onGoToProjects: () => void;
  onNavigateSubpage?: (sub: string) => void;
}

export default function AboutMeStoryPage({ 
  cvData, 
  theme, 
  onBackToMain, 
  onGoToProjects,
  onNavigateSubpage
}: AboutMeStoryPageProps) {
  const isDark = theme === 'dark';
  const texts = cvData.webTexts || {};

  // Standard safe fields with default fallback matching DEFAULT_WEB_TEXTS
  const badgeText = texts.about_story_badge || '✦ DISCOVER OUR STORY';
  const titleText = texts.about_story_title || 'About Me';
  const introText = texts.about_story_intro || 'I am a highly driven Professional holding extensive analytics experience across data strategy, business intelligence, and metric modernization frameworks.';
  
  // Left points as requested: Education Background, Personality & Values, Hobbies & Interests
  const left1Title = texts.about_story_left_1_title || 'Education Background';
  const left1Desc = texts.about_story_left_1_desc || 'My academic timeline and formal training in computer science, statistics, analytics, and metrics modernization.';
  const left2Title = texts.about_story_left_2_title || 'Personality & Values';
  const left2Desc = texts.about_story_left_2_desc || 'My operating principles, character ethics, and core professional values that guide my collaborative work style.';
  const left3Title = texts.about_story_left_3_title || 'Hobbies & Interests';
  const left3Desc = texts.about_story_left_3_desc || 'What keeps me inspired and energizes my creative problem-solving outside of regular business hours.';

  // Right points as requested: Career Journey, Skills & Expertise, and Career Goals
  const right1Title = texts.about_story_right_1_title || 'Career Journey';
  const right1Desc = texts.about_story_right_1_desc || 'My timeline of professional experiences, highlighting analytical leadership, data strategy, and metric modernization.';
  const right2Title = texts.about_story_right_2_title || 'Skills & Expertise';
  const right2Desc = texts.about_story_right_2_desc || 'My categorized skill arsenal spanning across data pipelines, DBMS, engineering stacks, and visual communication.';
  const right3Title = texts.about_story_right_3_title || 'Projects & Case Studies';
  const right3Desc = texts.about_story_right_3_desc || 'Explore my portfolio of data analysis, visual reports, and data engineering case studies.';

  // Custom added sub-pages
  const customSubPages = (cvData.customSubPages || []).filter(p => p.showOnStoryPage !== false);
  const isIndo = (texts.about_story_title || '').includes('Tentang') || (!texts.about_story_title && window.location.pathname.startsWith('/id'));

  const getCustomIcon = (iconName?: string) => {
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
  };

  // Parse about_story_image_url as JSON or fallback to legacy plain URL
  const rawAboutStoryImg = texts.about_story_image_url || '';
  let aboutStoryImgObj = {
    backgroundImageUrl: '',
    lanyardLightUrl: '',
    lanyardDarkUrl: ''
  };
  if (rawAboutStoryImg.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawAboutStoryImg);
      aboutStoryImgObj = {
        backgroundImageUrl: parsed.backgroundImageUrl || '',
        lanyardLightUrl: parsed.lanyardLightUrl || '',
        lanyardDarkUrl: parsed.lanyardDarkUrl || ''
      };
    } catch (e) {
      console.warn("Error parsing about_story_image_url as JSON in AboutMeStoryPage", e);
    }
  } else if (rawAboutStoryImg) {
    aboutStoryImgObj = {
      backgroundImageUrl: rawAboutStoryImg,
      lanyardLightUrl: rawAboutStoryImg,
      lanyardDarkUrl: rawAboutStoryImg
    };
  }

  // Determine central lanyard portrait picture URL based on current theme light/dark
  const portraitUrl = (isDark ? (cvData.idCardSvgDark || aboutStoryImgObj.lanyardDarkUrl) : (cvData.idCardSvgLight || aboutStoryImgObj.lanyardLightUrl)) ||
                     (isDark ? aboutStoryImgObj.lanyardDarkUrl : aboutStoryImgObj.lanyardLightUrl) ||
                     (isDark && cvData.homeImageUrlDark ? cvData.homeImageUrlDark : cvData.homeImageUrl) || 
                     '/id_card.webp';

  const backgroundImageUrl = 
    texts.about_story_header_bg || 
    texts.about_header_bg || 
    texts.aboutme_header_bg || 
    aboutStoryImgObj.backgroundImageUrl || 
    '/aboutme_header.webp';

  const bgScale = parseFloat(texts.about_story_header_bg_scale || texts.about_header_bg_scale || '1');
  const bgX = parseInt(texts.about_story_header_bg_x || texts.about_header_bg_x || '0', 10);
  const bgY = parseInt(texts.about_story_header_bg_y || texts.about_header_bg_y || '0', 10);
  const bgOpacity = texts.about_story_header_bg_opacity || texts.about_header_bg_opacity;

  // Scroll to top on mount so entry transition starts cleanly from top of viewport
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Navigation handler
  const handlePointClick = (hashPath: string) => {
    const cleanSub = hashPath.replace(/^#\/?/, '');
    if (onNavigateSubpage) {
      onNavigateSubpage(cleanSub);
    } else {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const currentLang = (parts[0] === 'id' || parts[0] === 'en') ? parts[0] : 'en';
      window.history.pushState(null, '', `/${currentLang}/${cleanSub}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`min-h-screen pt-2 pb-24 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-200 select-none relative overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-[#FAF9F5] border-slate-200 text-slate-800'
      }`}
      style={
        isDark
          ? { backgroundColor: texts.about_story_bg_color_dark || texts.aboutme_bg_color_dark || texts.about_bg_color_dark }
          : { backgroundColor: texts.about_story_bg_color || texts.aboutme_bg_color || texts.about_bg_color }
      }
    >
      {/* SECTION GRADIENT SHADOW OVERLAY */}
      <SectionGradientShadow 
        sectionKey="about_story" 
        webTexts={cvData.webTexts} 
        theme={theme} 
        accentHex={getThemeColorPalette(cvData.layoutSettings?.themeColor || 'blue').primary}
      />
      {/* Absolute Header Background Image Band */}
      {backgroundImageUrl && (
        <div className="absolute top-0 left-0 right-0 h-[480px] pointer-events-none overflow-hidden z-0">
          <img 
            src={backgroundImageUrl} 
            alt="About Background" 
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover select-none pointer-events-none ${
              isDark ? 'opacity-30' : 'opacity-40'
            }`}
            style={{ 
              transform: `scale(${bgScale}) translate(${bgX / 5}%, ${bgY / 5}%)`,
              transformOrigin: 'center center',
              opacity: bgOpacity ? parseFloat(bgOpacity) : undefined
            }}
          />
          {/* Subtle fade-out to page background at the bottom edge */}
          <div className={`absolute inset-0 bg-gradient-to-b ${
            isDark 
              ? 'from-transparent via-slate-900/80 to-slate-900' 
              : 'from-transparent via-[#FAF9F5]/80 to-[#FAF9F5]'
          }`} />
        </div>
      )}

      {/* Absolute Decorative SVG / Texture Background Overlay */}
      {texts.about_story_bg_style && texts.about_story_bg_style !== 'none' ? (
        <BackgroundTextures
          type={texts.about_story_bg_style}
          theme={theme}
          opacity={texts.about_story_bg_pattern_opacity ? parseFloat(texts.about_story_bg_pattern_opacity) : undefined}
          scale={texts.about_story_bg_pattern_scale ? parseFloat(texts.about_story_bg_pattern_scale) : undefined}
          color={texts.about_story_bg_pattern_color || undefined}
          customSvg={texts.about_story_bg_custom_svg || texts.about_story_custom_svg || undefined}
          customBgUrl={texts.about_story_bg_custom_url || texts.about_story_custom_url || undefined}
        />
      ) : (
        <div className={`absolute inset-0 opacity-[0.03] select-none pointer-events-none z-10 ${
          isDark ? 'bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]'
        }`} style={{ backgroundSize: '24px 24px' }} />
      )}

      {/* FLOATING DECORATIVE ASSETS OVERLAY */}
      <FloatingAssetsOverlay sectionId="about_story" assets={cvData.floatingAssets} />

      {/* FULL-PAGE 3D PHYSICS LANYARD CANVAS (Layered ABOVE feature points, but BELOW header/title) */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-auto overflow-hidden">
        <Lanyard 
          position={[0, 0, 19]} 
          gravity={[0, -40, 0]} 
          fov={20}
          cardScale={1.85}
          lanyardWidth={0.38}
          lanyardText={(() => {
            if (cvData.nickname && cvData.nickname.trim()) return `Portfolio ${cvData.nickname.trim()}`;
            if (!cvData.name || !cvData.name.trim()) return 'Portfolio Zufar';
            const parts = cvData.name.trim().split(/\s+/);
            const shortName = parts.length > 1 && parts[0].replace('.', '').length <= 2 ? parts[1] : parts[0];
            return `Portfolio ${shortName}`;
          })()}
          frontImage={portraitUrl}
          backImage={portraitUrl}
          imageFit="cover"
          className="w-full h-full"
        />
      </div>

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto relative z-30 pointer-events-none">
        
        {/* Symmetrical Header without background container for a clean, integrated look - Topmost layer (z-50) */}
        <div className="text-center pt-8 pb-3 sm:pb-12 max-w-3xl mx-auto relative z-50 px-6 pointer-events-auto">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className={`font-sans font-black text-4xl sm:text-5xl mt-3 mb-4 select-none transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              color: isDark 
                ? (texts.about_story_title_color_dark || undefined) 
                : (texts.about_story_title_color || undefined)
            }}
          >
            {titleText}
          </motion.h1>

          {/* Minimalist Golden/Emerald Underline Removed as requested */}

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className={`font-sans text-[13px] sm:text-base leading-relaxed whitespace-pre-line transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
            style={{
              color: isDark 
                ? (texts.about_story_intro_color_dark || undefined) 
                : (texts.about_story_intro_color || undefined)
            }}
          >
            {introText}
          </motion.p>
        </div>

        {/* Core Symmetrical 3-Column Bento/Architectural Grid with Center Spacer - Layered under Lanyard (z-10) */}
        <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center mt-4">

          {/* 3-Column Grid overlay with left & right feature cards and center spacer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 2xl:gap-18 items-stretch w-full relative z-0 pointer-events-none">
            
            {/* LEFT SIDE: Text Right Aligned on Desktop */}
            <div className="hidden lg:flex lg:col-span-4 flex-col justify-between gap-8 order-2 lg:order-1 text-left lg:text-right relative z-0 pointer-events-auto">
              
              {/* Left Feature 1: Education Background */}
              <div className="w-full lg:translate-x-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  onClick={() => handlePointClick('#/educational')}
                  className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] will-change-transform ${
                    isDark 
                      ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
                      : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center lg:justify-end gap-3 mb-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                      isDark ? 'bg-slate-800 text-amber-400 group-hover:text-amber-300' : 'bg-white border border-slate-200 text-amber-600 shadow-sm group-hover:bg-amber-50'
                    }`}>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {left1Title}
                    </h3>
                  </div>
                  <p className={`font-sans text-xs leading-relaxed max-w-sm lg:ml-auto ${
                    isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                  }`}>
                    {left1Desc}
                  </p>
                </motion.div>
              </div>

              {/* Left Feature 2: Personality & Values */}
              <div className="w-full lg:-translate-x-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  onClick={() => handlePointClick('#/personality')}
                  className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] will-change-transform ${
                    isDark 
                      ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
                      : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center lg:justify-end gap-3 mb-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                      isDark ? 'bg-slate-800 text-emerald-400 group-hover:text-emerald-300' : 'bg-white border border-slate-200 text-emerald-655 shadow-sm group-hover:bg-emerald-50'
                    }`}>
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {left2Title}
                    </h3>
                  </div>
                  <p className={`font-sans text-xs leading-relaxed max-w-sm lg:ml-auto ${
                    isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                  }`}>
                    {left2Desc}
                  </p>
                </motion.div>
              </div>

              {/* Left Feature 3: Hobbies & Interests */}
              <div className="w-full lg:translate-x-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  onClick={() => handlePointClick('#/hobbies')}
                  className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] will-change-transform ${
                    isDark 
                      ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
                      : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center lg:justify-end gap-3 mb-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                      isDark ? 'bg-slate-800 text-rose-400 group-hover:text-rose-300' : 'bg-white border border-slate-200 text-rose-655 shadow-sm group-hover:bg-rose-50'
                    }`}>
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {left3Title}
                    </h3>
                  </div>
                  <p className={`font-sans text-xs leading-relaxed max-w-sm lg:ml-auto ${
                    isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                  }`}>
                    {left3Desc}
                  </p>
                </motion.div>
              </div>

            </div>

            {/* MIDDLE COLUMN: Spacer for desktop, mobile points grid for small screens */}
            <div className="lg:col-span-4 flex flex-col items-center justify-between order-1 lg:order-2 relative z-10 min-h-[460px] sm:min-h-[520px] lg:min-h-0 pointer-events-none">
              
              {/* Mobile Only Points Grid: 2 columns, 3 rows, only title & icon, no description */}
              <div className="lg:hidden grid grid-cols-2 gap-3 mt-auto mb-2 w-full max-w-[340px] px-2 pointer-events-auto z-40">
                {[
                  { title: left1Title, icon: <GraduationCap className="w-4 h-4" />, path: '#/educational', colorClass: isDark ? 'text-amber-400' : 'text-amber-600', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  { title: right1Title, icon: <Briefcase className="w-4 h-4" />, path: '#/career-journey', colorClass: isDark ? 'text-sky-400' : 'text-sky-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  { title: left2Title, icon: <Cpu className="w-4 h-4" />, path: '#/personality', colorClass: isDark ? 'text-emerald-400' : 'text-emerald-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  { title: right2Title, icon: <Sparkles className="w-4 h-4" />, path: '#/skills', colorClass: isDark ? 'text-pink-400' : 'text-pink-600', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  { title: left3Title, icon: <Heart className="w-4 h-4" />, path: '#/hobbies', colorClass: isDark ? 'text-rose-400' : 'text-rose-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  { title: right3Title, icon: <LayoutGrid className="w-4 h-4" />, path: '#/projects', colorClass: isDark ? 'text-orange-400' : 'text-orange-655', bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  ...customSubPages.map(page => ({
                    title: isIndo ? (page.title || page.titleEn || page.id) : (page.titleEn || page.title || page.id),
                    icon: getCustomIcon(page.iconName),
                    path: `#/${page.id}`,
                    colorClass: isDark ? 'text-teal-400' : 'text-teal-600',
                    bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }))
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    onClick={() => handlePointClick(item.path)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-t border-r border-l cursor-pointer active:translate-y-[2.5px] transition-all duration-150 ${
                      isDark
                        ? 'bg-slate-900 border-white/[0.08] border-b-[3.5px] border-b-slate-950 active:border-b active:border-b-slate-900 shadow-[0_6px_16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-emerald-500/25'
                        : 'bg-white border-slate-200 border-b-[3.5px] border-b-slate-300 active:border-b active:border-b-slate-200 shadow-[0_6px_14px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-emerald-500/20'
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
            </div>

            {/* RIGHT SIDE: Text Left Aligned */}
            <div className="hidden lg:flex lg:col-span-4 flex-col justify-between gap-8 order-3 lg:order-3 text-left relative z-0 pointer-events-auto">
            
            {/* Right Feature 1: Career Journey */}
            <div className="w-full lg:-translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                onClick={() => handlePointClick('#/career-journey')}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] will-change-transform ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
                    : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-sky-400 group-hover:text-sky-300' : 'bg-white border border-slate-200 text-sky-655 shadow-sm group-hover:bg-sky-50'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {right1Title}
                  </h3>
                </div>
                <p className={`font-sans text-xs leading-relaxed max-w-sm ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  {right1Desc}
                </p>
              </motion.div>
            </div>

            {/* Right Feature 2: Skills & Expertise */}
            <div className="w-full lg:translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                onClick={() => handlePointClick('#/skills')}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] will-change-transform ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
                    : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-pink-400 group-hover:text-pink-300' : 'bg-white border border-slate-200 text-pink-600 shadow-sm group-hover:bg-pink-50'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {right2Title}
                  </h3>
                </div>
                <p className={`font-sans text-xs leading-relaxed max-w-sm ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  {right2Desc}
                </p>
              </motion.div>
            </div>

            {/* Right Feature 3: Projects & Case Studies */}
            <div className="w-full lg:-translate-x-8">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                onClick={() => handlePointClick('#/projects')}
                className={`group p-6 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] will-change-transform ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
                    : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isDark ? 'bg-slate-800 text-orange-400 group-hover:text-orange-350' : 'bg-white border border-slate-200 text-orange-655 shadow-sm group-hover:bg-orange-50'
                  }`}>
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sans font-extrabold text-sm uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {right3Title}
                  </h3>
                </div>
                <p className={`font-sans text-xs leading-relaxed max-w-sm ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                }`}>
                  {right3Desc}
                </p>
              </motion.div>
            </div>

          </div>

        </div>

        {/* Dynamic Custom Sub-Pages & Extra Chapters */}
        {customSubPages.length > 0 && (
          <div className="hidden lg:block mt-16 pt-8 border-t border-slate-700/30 max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 font-bold">
                {isIndo ? '✦ HALAMAN & BAB TAMBAHAN' : '✦ ADDITIONAL CHAPTERS'}
              </span>
              <h3 className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isIndo ? 'Eksplorasi Halaman Lainnya' : 'Explore More Sub-Pages'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customSubPages.map((page, idx) => (
                <motion.div
                  key={page.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  onClick={() => handlePointClick(`#/${page.id}`)}
                  className={`group p-5 rounded-2xl border cursor-pointer transform transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] active:scale-[0.98] ${
                    isDark 
                      ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5' 
                      : 'bg-white/60 border-black/[0.04] hover:bg-white hover:border-emerald-500/20 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                      isDark ? 'bg-slate-800 text-teal-400 group-hover:text-teal-300' : 'bg-white border border-slate-200 text-teal-600 shadow-sm group-hover:bg-teal-50'
                    }`}>
                      {getCustomIcon(page.iconName)}
                    </div>
                    <h4 className={`font-sans font-extrabold text-sm tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {isIndo ? (page.title || page.titleEn || page.id) : (page.titleEn || page.title || page.id)}
                    </h4>
                  </div>
                  <p className={`font-sans text-xs leading-relaxed line-clamp-2 ${
                    isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-550 group-hover:text-slate-700'
                  }`}>
                    {isIndo ? (page.subtitle || page.subtitleEn || '') : (page.subtitleEn || page.subtitle || '')}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  </motion.div>
  );
}
