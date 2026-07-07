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
  Target
} from 'lucide-react';
import { CVData } from '../lib/supabaseClient';
import InteractiveIDCard from './InteractiveIDCard';

interface AboutMeStoryPageProps {
  key?: React.Key;
  cvData: CVData;
  theme: 'light' | 'dark';
  onBackToMain: () => void;
  onGoToProjects: () => void;
}

export default function AboutMeStoryPage({ 
  cvData, 
  theme, 
  onBackToMain, 
  onGoToProjects 
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
  const right3Title = texts.about_story_right_3_title || 'Career Goals';
  const right3Desc = texts.about_story_right_3_desc || 'My tactical career development roadmap, detailing target professional milestones and aspirational horizons.';

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
  } else {
    aboutStoryImgObj = {
      backgroundImageUrl: '',
      lanyardLightUrl: rawAboutStoryImg,
      lanyardDarkUrl: rawAboutStoryImg
    };
  }

  // Determine central lanyard portrait picture URL based on current theme light/dark
  const portraitUrl = (isDark ? aboutStoryImgObj.lanyardDarkUrl : aboutStoryImgObj.lanyardLightUrl) ||
                     aboutStoryImgObj.lanyardLightUrl ||
                     (isDark && cvData.homeImageUrlDark ? cvData.homeImageUrlDark : cvData.homeImageUrl) || 
                     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';

  const backgroundImageUrl = aboutStoryImgObj.backgroundImageUrl || '';

  // Scroll to top on mount so entry transition starts cleanly from top of viewport
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Navigation handler
  const handlePointClick = (hashPath: string) => {
    window.location.hash = hashPath;
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
    >
      {/* Absolute Header Background Image Band */}
      {backgroundImageUrl && (
        <div className="absolute top-0 left-0 right-0 h-[450px] pointer-events-none overflow-hidden z-15">
          <img 
            src={backgroundImageUrl} 
            alt="About Background" 
            className={`w-full h-full object-cover select-none pointer-events-none ${
              isDark ? 'opacity-25' : 'opacity-[0.38]'
            }`}
            style={{ referrerPolicy: "no-referrer" }}
          />
          {/* Subtle fade-out to page background at the bottom edge */}
          <div className={`absolute inset-0 bg-gradient-to-b ${
            isDark 
              ? 'from-transparent via-slate-900/80 to-slate-900' 
              : 'from-transparent via-[#FAF9F5]/80 to-[#FAF9F5]'
          }`} />
        </div>
      )}

      {/* Absolute Decorative Tech/Grid Overlay for Designer feel */}
      <div className={`absolute inset-0 opacity-[0.03] select-none pointer-events-none z-10 ${
        isDark ? 'bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]'
      }`} style={{ backgroundSize: '24px 24px' }} />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto relative z-20">
        
        {/* Symmetrical Header without background container for a clean, integrated look */}
        <div className="text-center pt-8 pb-12 max-w-3xl mx-auto relative z-30 px-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`font-mono text-xs font-bold uppercase tracking-widest ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}
          >
            {badgeText}
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className={`font-sans font-black text-4xl sm:text-5xl mt-3 mb-4 select-none ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {titleText}
          </motion.h1>

          {/* Minimalist Golden/Emerald Underline */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`h-0.5 mx-auto rounded mb-6 ${
              isDark ? 'bg-emerald-400' : 'bg-amber-500'
            }`} 
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className={`font-sans text-sm sm:text-base leading-relaxed whitespace-pre-line ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {introText}
          </motion.p>
        </div>

        {/* Core Symmetrical 3-Column Bento/Architectural Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 2xl:gap-18 items-stretch mt-4">
          
          {/* LEFT SIDE: Text Right Aligned on Desktop */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-8 order-2 lg:order-1 text-left lg:text-right relative z-0">
            
            {/* Left Feature 1: Education Background */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => handlePointClick('#/educational')}
              className={`group p-6 rounded-2xl border transition-colors duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs' 
                  : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs'
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
            </motion.div>            {/* Left Feature 2: Personality & Values */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => handlePointClick('#/personality')}
              className={`group p-6 rounded-2xl border transition-colors duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs' 
                  : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs'
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

            {/* Left Feature 3: Hobbies & Interests */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => handlePointClick('#/hobbies')}
              className={`group p-6 rounded-2xl border transition-colors duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs' 
                  : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs'
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

          {/* MIDDLE COLUMN: Portrait holding frames and CTA */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 relative z-20">
            
            {/* Interactive Physics-driven Lanyard ID Card */}
            <div className="w-full overflow-visible flex justify-center">
              <InteractiveIDCard 
                portraitUrl={portraitUrl}
                name={cvData.name || 'Professional User'}
                title={cvData.title || 'BI & Analytics Consultant'}
                theme={theme}
                nickname={cvData.nickname}
                useNicknameOnCard={cvData.useNicknameOnCard}
                cardSocials={cvData.cardSocials}
                idCardGroup={cvData.idCardGroup}
                idCardSubText={cvData.idCardSubText}
                customSocials={cvData.customSocials}
                imageScale={cvData.aboutStoryImageScale}
                imageX={cvData.aboutStoryImageX}
                imageY={cvData.aboutStoryImageY}
                idCardText3={cvData.idCardText3}
                idCardBgTextSize={cvData.idCardBgTextSize}
                idCardSvgLight={cvData.idCardSvgLight}
                idCardSvgDark={cvData.idCardSvgDark}
                idCardSvgScale={cvData.idCardSvgScale}
                idCardSvgX={cvData.idCardSvgX}
                idCardSvgY={cvData.idCardSvgY}
                idCardTextX={cvData.idCardTextX}
                idCardTextY={cvData.idCardTextY}
                idCardBadgeX={cvData.idCardBadgeX}
                idCardBadgeY={cvData.idCardBadgeY}
                idCardSvgs={cvData.idCardSvgs}
                idCardPortraitFadeEnabled={cvData.idCardPortraitFadeEnabled}
                idCardPortraitFadeStart={cvData.idCardPortraitFadeStart}
                idCardPortraitFadeEnd={cvData.idCardPortraitFadeEnd}
              />
            </div>

          </div>

          {/* RIGHT SIDE: Text Left Aligned */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-8 order-3 lg:order-3 text-left relative z-0">
            
            {/* Right Feature 1: Career Journey */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => handlePointClick('#/career-journey')}
              className={`group p-6 rounded-2xl border transition-colors duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs' 
                  : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs'
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

            {/* Right Feature 2: Skills & Expertise */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => handlePointClick('#/skills')}
              className={`group p-6 rounded-2xl border transition-colors duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs' 
                  : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs'
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

            {/* Right Feature 3: Career Goals */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => handlePointClick('#/career-goals')}
              className={`group p-6 rounded-2xl border transition-colors duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/25 shadow-xs' 
                  : 'bg-white/40 border-black/[0.03] hover:bg-white/85 hover:border-emerald-500/20 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 ${
                  isDark ? 'bg-slate-800 text-orange-400 group-hover:text-orange-350' : 'bg-white border border-slate-200 text-orange-655 shadow-sm group-hover:bg-orange-50'
                }`}>
                  <Target className="w-5 h-5" />
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
    </motion.div>
  );
}
