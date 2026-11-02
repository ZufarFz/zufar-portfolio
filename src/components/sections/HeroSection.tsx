import React from 'react';
import { motion } from 'motion/react';
import { User, Download } from 'lucide-react';
import { CVData } from '../../types';
import MarkdownText from '../common/MarkdownText';
import { BackgroundTextures, FloatingAssetsOverlay, SectionGradientShadow } from '../effects';


import TypewriterText from '../common/TypewriterText';
import { getThemeColorPalette } from '../../lib/themeUtils';

interface HeroSectionProps {
  activeCVData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  isEffectiveMobile?: boolean;
  isMobile?: boolean;
  scrollToSection: (section: string) => void;
  setCvModalDirectDownload: (direct: boolean) => void;
  setCvModalOpen: (open: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCVData,
  theme,
  lang,
  isEffectiveMobile = false,
  isMobile = false,
  scrollToSection,
  setCvModalDirectDownload,
  setCvModalOpen,
}) => {
  const currentProfileImageUrl = theme === 'dark' && activeCVData.homeImageUrlDark 
    ? activeCVData.homeImageUrlDark 
    : (activeCVData.homeImageUrl || activeCVData.avatarUrl);

  const isPng = currentProfileImageUrl ? (
    currentProfileImageUrl.toLowerCase().includes('.png') || 
    currentProfileImageUrl.toLowerCase().includes('data:image/png') ||
    currentProfileImageUrl.toLowerCase().includes('blob:')
  ) : false;

  const displayName = (activeCVData.webTexts?.hero_name_source === 'fullname') 
    ? (activeCVData.name || activeCVData.nickname || "ZUFA") 
    : (activeCVData.nickname || activeCVData.name || "ZUFA");

  const heroTitle = activeCVData.webTexts?.hero_title || "Transforming Raw Data\ninto Business Decisions";
  const heroSubtitle = activeCVData.webTexts?.hero_subtitle || "Specialized in high-impact insights through custom SQL engines, Python workflows, and advanced Business Intelligence.";

  const isGangOfThree = activeCVData.webTexts?.hero_title_font === 'GangOfThree' || activeCVData.webTexts?.hero_font === 'GangOfThree';

  const imageMask = (() => {
    const maskStyle = activeCVData.webTexts?.home_image_mask_style || 'normal';
    const fadeDepth = activeCVData.webTexts?.home_image_fade_depth || '66';
    const fadeWidth = activeCVData.webTexts?.home_image_fade_width || '84';
    if (maskStyle === 'fade_bottom') {
      return `linear-gradient(to bottom, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
    } else if (maskStyle === 'fade_circle') {
      return `radial-gradient(circle, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
    } else if (maskStyle === 'fade_edge') {
      return `radial-gradient(ellipse, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
    }
    return 'none';
  })();

  const handleDownloadClick = () => {
    const isMobileViewport = isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);
    setCvModalDirectDownload(isMobileViewport);
    setCvModalOpen(true);
  };

  return (
    <section 
      id="home" 
      className={`relative min-h-[90vh] flex items-center overflow-hidden border-b transition-colors duration-250 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
      style={
        theme === 'dark'
          ? { backgroundColor: activeCVData.webTexts?.home_bg_color_dark || activeCVData.webTexts?.hero_bg_color_dark || activeCVData.webTexts?.theme_bg_color_dark }
          : { backgroundColor: activeCVData.webTexts?.home_bg_color || activeCVData.webTexts?.hero_bg_color || activeCVData.webTexts?.theme_bg_color_light }
      }
    >
      {/* SECTION GRADIENT SHADOW OVERLAY */}
      <SectionGradientShadow 
        sectionKey="home" 
        webTexts={activeCVData.webTexts} 
        theme={theme} 
        accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
        currentBgColor={
          theme === 'dark'
            ? (activeCVData.webTexts?.home_bg_color_dark || activeCVData.webTexts?.hero_bg_color_dark || '#181A1B')
            : (activeCVData.webTexts?.home_bg_color || activeCVData.webTexts?.hero_bg_color || '#F3F0E6')
        }
      />

      {/* BACKGROUND CUSTOMIZER OVERLAYS */}
      <BackgroundTextures 
        type={activeCVData.webTexts?.home_bg_style || 'dots'} 
        theme={theme} 
        opacity={activeCVData.webTexts?.home_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.home_bg_pattern_opacity) : (activeCVData.webTexts?.home_bg_custom_opacity ? parseFloat(activeCVData.webTexts.home_bg_custom_opacity) : undefined)}
        scale={activeCVData.webTexts?.home_bg_pattern_scale ? parseFloat(activeCVData.webTexts.home_bg_pattern_scale) : undefined}
        color={activeCVData.webTexts?.home_bg_pattern_color || undefined}
        customSvg={activeCVData.webTexts?.home_bg_custom_svg || activeCVData.webTexts?.home_custom_svg || activeCVData.webTexts?.hero_bg_custom_svg || undefined}
        customBgUrl={activeCVData.webTexts?.home_bg_custom_url || activeCVData.webTexts?.home_custom_url || undefined}
      />

      {/* FLOATING DECORATIVE ASSETS OVERLAY */}
      <FloatingAssetsOverlay 
        sectionId="home" 
        assets={activeCVData.floatingAssets} 
        theme={theme}
        isMobilePreview={isEffectiveMobile}
        bgColor={
          theme === 'dark'
            ? (activeCVData.webTexts?.home_bg_color_dark || activeCVData.webTexts?.hero_bg_color_dark || activeCVData.webTexts?.theme_bg_color_dark || '#181A1B')
            : (activeCVData.webTexts?.home_bg_color || activeCVData.webTexts?.hero_bg_color || activeCVData.webTexts?.theme_bg_color_light || '#F9F3E8')
        }
      />
      
      <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:py-8 lg:py-10 relative w-full min-h-[calc(100vh-4rem)] flex-1 flex flex-col justify-center">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEW (MD:HIDDEN): Strict sequential flow requested by user:        */}
        {/* 1. Hello I'm Nama -> 2. Gambar Profile -> 3. Title -> 4. Deskripsi -> 5. 2 Tombol */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center md:hidden w-full relative z-20">
          
          {/* 1. HELLO, I'M [NAMA] Text */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className={`font-bold text-[clamp(1.2rem,5vw,2rem)] tracking-widest uppercase mb-1.5 transition-colors duration-200 whitespace-nowrap z-20 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}
            style={{ 
              fontFamily: isGangOfThree ? "'GangOfThree', sans-serif" : "'VT323', monospace",
              color: theme === 'dark' 
                ? (activeCVData.webTexts?.hero_greeting_color_dark || activeCVData.webTexts?.hero_title_color_dark || undefined) 
                : (activeCVData.webTexts?.hero_greeting_color || activeCVData.webTexts?.hero_title_color || undefined)
            }}
          >
            <TypewriterText name={displayName} lang={lang} />
          </motion.div>

          {/* 2. Gambar Profile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
            className="relative z-10 pointer-events-auto flex items-center justify-center w-full h-[225px] sm:h-[260px] my-1 overflow-visible group"
          >
            {currentProfileImageUrl && (
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105 select-none">
                <img 
                  className={`absolute left-1/2 top-1/2 select-none w-[220px] h-[220px] sm:w-[255px] sm:h-[255px] max-w-none transition-all duration-700 ease-out cursor-default ${
                    isPng ? 'object-contain' : 'object-cover'
                  }`}
                  referrerPolicy="no-referrer"
                  alt="Professional Portfolio Visual" 
                  src={currentProfileImageUrl}
                  style={{
                    transform: `translate(-50%, -48%) scale(${Math.min(1.2, activeCVData.homeImageScale || 1)}) translate(${((activeCVData.homeImageX || 0) * 1.8)}px, ${((activeCVData.homeImageY || 0) * 1.5)}px)`,
                    transformOrigin: 'center center',
                    opacity: 1 - ((activeCVData as any).homeImageFade ?? 0),
                    maskImage: imageMask,
                    WebkitMaskImage: imageMask,
                  }}
                />
              </div>
            )}
          </motion.div>

          {/* 3. Title / Judul Utama */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
            className={`font-sans font-black text-xl sm:text-2xl leading-snug mt-1 mb-2 transition-colors duration-200 max-w-md mx-auto ${
              isGangOfThree ? 'tracking-wider' : 'tracking-tight'
            } ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              fontFamily: isGangOfThree ? "'GangOfThree', sans-serif" : undefined,
              letterSpacing: isGangOfThree ? '0.05em' : undefined,
              color: theme === 'dark' 
                ? (activeCVData.webTexts?.hero_title_color_dark || undefined) 
                : (activeCVData.webTexts?.hero_title_color || undefined)
            }}
          >
            {heroTitle.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </motion.h1>

          {/* 4. Deskripsi / Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28, ease: "easeOut" }}
            className={`font-sans font-normal text-xs sm:text-sm mb-4 leading-relaxed text-center max-w-sm sm:max-w-md mx-auto transition-colors duration-200 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
            style={{
              color: theme === 'dark' 
                ? (activeCVData.webTexts?.hero_subtitle_color_dark || '#CBD5E1') 
                : (activeCVData.webTexts?.hero_subtitle_color || '#475569')
            }}
          >
            <MarkdownText content={heroSubtitle} theme={theme} />
          </motion.div>

          {/* 5. 2 Tombol Action CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
            className="flex flex-wrap gap-1.5 sm:gap-2 items-center justify-center pb-2"
          >
            {/* About Me */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => scrollToSection('profil')}
              className={`font-sans font-bold text-[10px] sm:text-xs px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer select-none shadow-xs transform-gpu will-change-transform ${
                !activeCVData.webTexts?.hero_cta_primary_bg && (theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20')
              }`}
              style={{
                backgroundColor: theme === 'dark'
                  ? (activeCVData.webTexts?.hero_cta_primary_bg_dark || undefined)
                  : (activeCVData.webTexts?.hero_cta_primary_bg || undefined),
                color: theme === 'dark'
                  ? (activeCVData.webTexts?.hero_cta_primary_text_dark || undefined)
                  : (activeCVData.webTexts?.hero_cta_primary_text || undefined),
              }}
            >
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transform-none" />
              <span>About Me</span>
            </motion.button>
            
            {/* Download Resume */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={handleDownloadClick}
              className={`font-sans font-bold text-[10px] sm:text-xs px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer select-none shadow-xs transform-gpu will-change-transform ${
                !activeCVData.webTexts?.hero_cta_secondary_bg && (theme === 'dark' 
                  ? 'bg-white hover:bg-slate-100 text-slate-900 shadow-slate-100/20' 
                  : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-slate-200/40')
              }`}
              style={{
                backgroundColor: theme === 'dark'
                  ? (activeCVData.webTexts?.hero_cta_secondary_bg_dark || undefined)
                  : (activeCVData.webTexts?.hero_cta_secondary_bg || undefined),
                color: theme === 'dark'
                  ? (activeCVData.webTexts?.hero_cta_secondary_text_dark || undefined)
                  : (activeCVData.webTexts?.hero_cta_secondary_text || undefined),
              }}
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transform-none" />
              <span>Download Resume</span>
            </motion.button>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW (HIDDEN MD:GRID): Standard 3-column Hero Layout              */}
        {/* ========================================================================= */}
        <div 
          className="hidden md:grid md:grid-cols-12 gap-x-4 lg:gap-x-6 xl:gap-x-8 items-center text-left relative w-full"
          style={{
            gridTemplateAreas: `"title title title title title image image image image badge badge badge"`,
            gridTemplateRows: "1fr",
          }}
        >
          {/* 1. Greeting, Title/Judul, Description & CTA Buttons */}
          <div style={{ gridArea: 'title' }} className="text-left flex flex-col justify-center max-w-none relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className={`font-bold text-[clamp(1.25rem,2.5vw,3rem)] tracking-widest uppercase mb-1 sm:mb-2 transition-colors duration-200 whitespace-nowrap ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}
              style={{ 
                fontFamily: isGangOfThree ? "'GangOfThree', sans-serif" : "'VT323', monospace",
                color: theme === 'dark' 
                  ? (activeCVData.webTexts?.hero_greeting_color_dark || activeCVData.webTexts?.hero_title_color_dark || undefined) 
                  : (activeCVData.webTexts?.hero_greeting_color || activeCVData.webTexts?.hero_title_color || undefined)
              }}
            >
              <TypewriterText name={displayName} lang={lang} />
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className={`font-sans font-black text-[clamp(1.75rem,4.2vw,4.75rem)] leading-[1.08] mb-2 sm:mb-3 md:mb-4 transition-colors duration-200 max-w-none ${
                isGangOfThree ? 'tracking-wider' : 'tracking-tight'
              } ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                fontFamily: isGangOfThree ? "'GangOfThree', sans-serif" : undefined,
                letterSpacing: isGangOfThree ? '0.05em' : undefined,
                color: theme === 'dark' 
                  ? (activeCVData.webTexts?.hero_title_color_dark || undefined) 
                  : (activeCVData.webTexts?.hero_title_color || undefined)
              }}
            >
              {heroTitle.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.h1>

            {/* Description/Deskripsi */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className={`font-sans font-normal text-[clamp(0.8125rem,0.95vw,1.025rem)] mb-5 md:mb-7 leading-relaxed text-left transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
              style={{
                color: theme === 'dark' 
                  ? (activeCVData.webTexts?.hero_subtitle_color_dark || '#CBD5E1') 
                  : (activeCVData.webTexts?.hero_subtitle_color || '#475569')
              }}
            >
              <MarkdownText content={heroSubtitle} theme={theme} />
            </motion.div>

            {/* Tombol Action CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-[clamp(0.4rem,0.6vw,0.75rem)] items-center justify-start"
            >
              {/* About Me */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => scrollToSection('profil')}
                className={`font-sans font-bold text-[clamp(0.68rem,0.78vw,0.875rem)] px-[clamp(0.75rem,0.95vw,1.25rem)] py-[clamp(0.35rem,0.45vw,0.6rem)] rounded-full flex items-center gap-[clamp(0.3rem,0.4vw,0.5rem)] whitespace-nowrap cursor-pointer select-none shadow-sm transform-gpu will-change-transform ${
                  !activeCVData.webTexts?.hero_cta_primary_bg && (theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20')
                }`}
                style={{
                  backgroundColor: theme === 'dark'
                    ? (activeCVData.webTexts?.hero_cta_primary_bg_dark || undefined)
                    : (activeCVData.webTexts?.hero_cta_primary_bg || undefined),
                  color: theme === 'dark'
                    ? (activeCVData.webTexts?.hero_cta_primary_text_dark || undefined)
                    : (activeCVData.webTexts?.hero_cta_primary_text || undefined),
                }}
              >
                <User className="w-[clamp(0.75rem,0.88vw,1rem)] h-[clamp(0.75rem,0.88vw,1rem)] shrink-0 transform-none" />
                <span>About Me</span>
              </motion.button>
              
              {/* Download Resume */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleDownloadClick}
                className={`font-sans font-bold text-[clamp(0.68rem,0.78vw,0.875rem)] px-[clamp(0.75rem,0.95vw,1.25rem)] py-[clamp(0.35rem,0.45vw,0.6rem)] rounded-full flex items-center gap-[clamp(0.3rem,0.4vw,0.5rem)] whitespace-nowrap cursor-pointer select-none shadow-sm transform-gpu will-change-transform ${
                  !activeCVData.webTexts?.hero_cta_secondary_bg && (theme === 'dark' 
                    ? 'bg-white hover:bg-slate-100 text-slate-900 shadow-slate-100/20' 
                    : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-slate-200/40')
                }`}
                style={{
                  backgroundColor: theme === 'dark'
                    ? (activeCVData.webTexts?.hero_cta_secondary_bg_dark || undefined)
                    : (activeCVData.webTexts?.hero_cta_secondary_bg || undefined),
                  color: theme === 'dark'
                    ? (activeCVData.webTexts?.hero_cta_secondary_text_dark || undefined)
                    : (activeCVData.webTexts?.hero_cta_secondary_text || undefined),
                }}
              >
                <Download className="w-[clamp(0.75rem,0.88vw,1rem)] h-[clamp(0.75rem,0.88vw,1rem)] shrink-0 transform-none" />
                <span>Download Resume</span>
              </motion.button>
            </motion.div>
          </div>

          {/* 2. Image/Gambar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            style={{ gridArea: 'image' }}
            className="relative z-5 pointer-events-auto flex items-center justify-center w-full min-h-[390px] lg:min-h-[470px] xl:min-h-[570px] 2xl:min-h-[670px] group"
          >
            {currentProfileImageUrl && (
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105 select-none">
                <img 
                  className={`absolute left-1/2 top-1/2 select-none md:w-[360px] md:h-[360px] lg:w-[440px] lg:h-[440px] xl:w-[540px] xl:h-[540px] 2xl:w-[650px] 2xl:h-[650px] max-w-none transition-all duration-700 ease-out cursor-default ${
                    isPng ? 'object-contain' : 'object-cover'
                  }`}
                  referrerPolicy="no-referrer"
                  alt="Professional Portfolio Visual" 
                  src={currentProfileImageUrl}
                  style={{
                    transform: `translate(-50%, -50%) scale(${activeCVData.homeImageScale || 1}) translate(${(activeCVData.homeImageX || 0) * 3.75}px, ${(activeCVData.homeImageY || 0) * 3.75}px)`,
                    transformOrigin: 'center center',
                    opacity: 1 - ((activeCVData as any).homeImageFade ?? 0),
                    maskImage: imageMask,
                    WebkitMaskImage: imageMask,
                  }}
                />
              </div>
            )}
          </motion.div>

          {/* 3. Badge Informasi di Sebelah Kanan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            style={{ gridArea: 'badge' }}
            className="flex flex-col gap-0 items-start text-left justify-start self-start pt-6 md:pt-8 lg:pt-10 xl:pt-12 relative z-30"
          >
            {/* OPEN TO WORK */}
            <div className="flex items-center">
              <span 
                className={`font-sans text-[clamp(0.75rem,1.1vw,1.15rem)] font-black uppercase tracking-[0.14em] italic leading-tight transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
                style={{
                  color: theme === 'dark' 
                    ? (activeCVData.webTexts?.hero_badge_color_dark || undefined) 
                    : (activeCVData.webTexts?.hero_badge_color || undefined)
                }}
              >
                {activeCVData.webTexts?.hero_badge || "OPEN TO WORK"}
              </span>
            </div>
            
            {/* Tahun */}
            <span 
              className={`font-black text-[clamp(2.75rem,4.75vw,5.25rem)] leading-[0.88] my-0.5 tracking-tight transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
              style={{ 
                fontFamily: "'Black Ops One', cursive",
                color: theme === 'dark' 
                  ? (activeCVData.webTexts?.hero_year_color_dark || undefined) 
                  : (activeCVData.webTexts?.hero_year_color || undefined)
              }}
            >
              {activeCVData.webTexts?.hero_year || "2026"}
            </span>
            
            {/* Lokasi */}
            <span 
              className={`font-sans font-black text-[clamp(0.8125rem,1.15vw,1.3rem)] italic uppercase tracking-wider leading-tight transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
              style={{
                color: theme === 'dark' 
                  ? (activeCVData.webTexts?.hero_location_color_dark || undefined) 
                  : (activeCVData.webTexts?.hero_location_color || undefined)
              }}
            >
              {activeCVData.webTexts?.hero_location || "Klaten, Jawa Tengah"}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
