import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CVData } from '../../../types';
import { Lanyard, BackgroundTextures, FloatingAssetsOverlay, SectionGradientShadow } from '../../effects';



import { getThemeColorPalette } from '../../../lib/themeUtils';
import { StoryHeaderBanner } from './StoryHeaderBanner';
import { StoryPointsGrid } from './StoryPointsGrid';

export interface AboutMeStoryPageProps {
  key?: React.Key;
  cvData: CVData;
  theme: 'light' | 'dark';
  onBackToMain?: () => void;
  onGoToProjects?: () => void;
  onNavigateSubpage?: (sub: string) => void;
}

export const AboutMeStoryPage: React.FC<AboutMeStoryPageProps> = ({ 
  cvData, 
  theme, 
  onNavigateSubpage
}) => {
  const isDark = theme === 'dark';
  const texts = cvData.webTexts || {};

  const activeBgColor = isDark
    ? (texts.about_story_bg_color_dark || texts.aboutme_bg_color_dark || texts.about_bg_color_dark || '#0f172a')
    : (texts.about_story_bg_color || texts.aboutme_bg_color || texts.about_bg_color || '#FAF9F5');

  const titleText = texts.about_story_title || 'About Me';
  const introText = texts.about_story_intro || 'I am a highly driven Professional holding extensive analytics experience across data strategy, business intelligence, and metric modernization frameworks.';
  
  const customSubPages = (cvData.customSubPages || []).filter(p => p.showOnStoryPage !== false);
  const isIndo = (texts.about_story_title || '').includes('Tentang') || (typeof window !== 'undefined' && (window.location.pathname.startsWith('/id') || window.location.hash.includes('lang=id')));

  // 6 Core Points
  const left1Title = (!texts.about_story_left_1_title || texts.about_story_left_1_title.includes('Interior'))
    ? (isIndo ? 'Latar Belakang Pendidikan' : 'Educational Background')
    : texts.about_story_left_1_title;
  const left1Desc = (!texts.about_story_left_1_desc || texts.about_story_left_1_desc.includes('pipeline yang bersih') || texts.about_story_left_1_desc.includes('Structuring clean, robust'))
    ? (isIndo ? 'Linimasa pencapaian akademis dan fondasi pelatihan formal dalam ilmu komputer, statistika, analitik data, serta rekayasa perangkat lunak.' : 'My academic timeline and formal foundation in computer science, statistics, analytics, and software engineering.')
    : texts.about_story_left_1_desc;

  const left2Title = (!texts.about_story_left_2_title || texts.about_story_left_2_title.includes('Exterior') || texts.about_story_left_2_title.includes('Eksterior'))
    ? (isIndo ? 'Kepribadian & Nilai Utama' : 'Personality & Values')
    : texts.about_story_left_2_title;
  const left2Desc = (!texts.about_story_left_2_desc || texts.about_story_left_2_desc.includes('visual insights') || texts.about_story_left_2_desc.includes('intuitif yang memberikan'))
    ? (isIndo ? 'Prinsip kerja, integritas etika, dan nilai-nilai profesional utama yang memandu dedikasi serta gaya kerja kolaboratif saya.' : 'My operating principles, ethical integrity, and core professional values that guide my collaborative work style.')
    : texts.about_story_left_2_desc;

  const left3Title = (!texts.about_story_left_3_title || texts.about_story_left_3_title.includes('Design /') || texts.about_story_left_3_title.includes('Desain /'))
    ? (isIndo ? 'Hobi & Minat' : 'Hobbies & Interests')
    : texts.about_story_left_3_title;
  const left3Desc = (!texts.about_story_left_3_desc || texts.about_story_left_3_desc.includes('user interface') || texts.about_story_left_3_desc.includes('antarmuka pengguna'))
    ? (isIndo ? 'Aktivitas kreatif dan eksplorasi yang menjaga inspirasi, keseimbangan hidup, serta energi pemecahan masalah di luar jam kerja.' : 'Creative pursuits and personal interests that keep me inspired and energize my problem-solving outside of regular business hours.')
    : texts.about_story_left_3_desc;

  const right1Title = (!texts.about_story_right_1_title || texts.about_story_right_1_title.includes('Decoration') || texts.about_story_right_1_title.includes('Dekorasi'))
    ? (isIndo ? 'Perjalanan Karir' : 'Career Journey')
    : texts.about_story_right_1_title;
  const right1Desc = (!texts.about_story_right_1_desc || texts.about_story_right_1_desc.includes('verifiable KPIs') || texts.about_story_right_1_desc.includes('dapat diverifikasi'))
    ? (isIndo ? 'Linimasa pengalaman profesional dan tonggak pencapaian dalam kepemimpinan analitis, strategi bisnis, dan modernisasi sistem data.' : 'My professional experience timeline and key milestones, highlighting analytical leadership, data strategy, and metric modernization.')
    : texts.about_story_right_1_desc;

  const right2Title = (!texts.about_story_right_2_title || texts.about_story_right_2_title.includes('Planning /') || texts.about_story_right_2_title.includes('Perencanaan /'))
    ? (isIndo ? 'Keahlian & Arsenal Teknis' : 'Skills & Technical Arsenal')
    : texts.about_story_right_2_title;
  const right2Desc = (!texts.about_story_right_2_desc || texts.about_story_right_2_desc.includes('Iterating carefully') || texts.about_story_right_2_desc.includes('Melakukan iterasi'))
    ? (isIndo ? 'Penguasaan mendalam atas kueri SQL tingkat lanjut, alur kerja Python, pemodelan BI, optimasi database, dan komunikasi visual.' : 'In-depth mastery across advanced SQL queries, Python automation workflows, Business Intelligence modeling, and visual communication.')
    : texts.about_story_right_2_desc;

  const right3Title = (!texts.about_story_right_3_title || texts.about_story_right_3_title.includes('Execution /') || texts.about_story_right_3_title.includes('Eksekusi /'))
    ? (isIndo ? 'Studi Kasus & Proyek' : 'Projects & Case Studies')
    : texts.about_story_right_3_title;
  const right3Desc = (!texts.about_story_right_3_desc || texts.about_story_right_3_desc.includes('Bringing data projects') || texts.about_story_right_3_desc.includes('Menghidupkan proyek data'))
    ? (isIndo ? 'Portofolio terstruktur analisis data nyata, otomatisasi alur kerja, laporan visual interaktif, dan audit kinerja berdaya dampak tinggi.' : 'A structured portfolio of real-world data analytics, workflow automation, interactive dashboards, and high-impact business audits.')
    : texts.about_story_right_3_desc;

  // Image parsing
  const rawAboutStoryImg = texts.about_story_image_url || '';
  let aboutStoryImgObj = { backgroundImageUrl: '', lanyardLightUrl: '', lanyardDarkUrl: '' };
  if (rawAboutStoryImg.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawAboutStoryImg);
      aboutStoryImgObj = {
        backgroundImageUrl: parsed.backgroundImageUrl || '',
        lanyardLightUrl: parsed.lanyardLightUrl || '',
        lanyardDarkUrl: parsed.lanyardDarkUrl || ''
      };
    } catch (e) {
      console.warn('Error parsing about_story_image_url as JSON in AboutMeStoryPage', e);
    }
  } else if (rawAboutStoryImg) {
    aboutStoryImgObj = { backgroundImageUrl: rawAboutStoryImg, lanyardLightUrl: rawAboutStoryImg, lanyardDarkUrl: rawAboutStoryImg };
  }

  const portraitUrl = (isDark ? (cvData.idCardSvgDark || aboutStoryImgObj.lanyardDarkUrl) : (cvData.idCardSvgLight || aboutStoryImgObj.lanyardLightUrl)) ||
                     (isDark ? aboutStoryImgObj.lanyardDarkUrl : aboutStoryImgObj.lanyardLightUrl) ||
                     (isDark && cvData.homeImageUrlDark ? cvData.homeImageUrlDark : cvData.homeImageUrl) || 
                     '/id_card.webp';

  const backgroundImageUrl = texts.about_story_header_bg || texts.about_header_bg || texts.aboutme_header_bg || aboutStoryImgObj.backgroundImageUrl || '/aboutme_header.webp';
  const bgScale = parseFloat(texts.about_story_header_bg_scale || texts.about_header_bg_scale || '1');
  const bgX = parseInt(texts.about_story_header_bg_x || texts.about_header_bg_x || '0', 10);
  const bgY = parseInt(texts.about_story_header_bg_y || texts.about_header_bg_y || '0', 10);
  const bgOpacity = texts.about_story_header_bg_opacity || texts.about_header_bg_opacity;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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

  const lanyardText = (() => {
    if (cvData.nickname && cvData.nickname.trim()) return `Portfolio ${cvData.nickname.trim()}`;
    if (!cvData.name || !cvData.name.trim()) return 'Portfolio Zufar';
    const parts = cvData.name.trim().split(/\s+/);
    const shortName = parts.length > 1 && parts[0].replace('.', '').length <= 2 ? parts[1] : parts[0];
    return `Portfolio ${shortName}`;
  })();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`min-h-screen pt-2 pb-24 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-200 select-none relative overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-[#FAF9F5] border-slate-200 text-slate-800'
      }`}
      style={{ backgroundColor: activeBgColor }}
    >
      <SectionGradientShadow 
        sectionKey="about_story" 
        webTexts={cvData.webTexts} 
        theme={theme} 
        accentHex={getThemeColorPalette(cvData.layoutSettings?.themeColor || 'blue').primary}
      />

      <StoryHeaderBanner 
        titleText={titleText}
        introText={introText}
        theme={theme}
        isDark={isDark}
        activeBgColor={activeBgColor}
        backgroundImageUrl={backgroundImageUrl}
        bgScale={bgScale}
        bgX={bgX}
        bgY={bgY}
        bgOpacity={bgOpacity}
        titleColor={isDark ? texts.about_story_title_color_dark : texts.about_story_title_color}
        introColor={isDark ? texts.about_story_intro_color_dark : texts.about_story_intro_color}
      />

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

      <FloatingAssetsOverlay 
        sectionId="about_story" 
        assets={cvData.floatingAssets} 
        theme={isDark ? 'dark' : 'light'}
        bgColor={isDark ? '#111827' : '#F9F3E8'}
      />

      {/* FULL-PAGE 3D PHYSICS LANYARD CANVAS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full z-20 pointer-events-auto overflow-hidden touch-none"
      >
        <Lanyard 
          position={[0, 0, 19]} 
          gravity={[0, -25, 0]} 
          fov={20}
          cardScale={1.55}
          mobileCardScale={1.10}
          anchorY={5.0}
          targetCenterY={-0.25}
          startY={3.8}
          mobileAnchorY={4.2}
          mobileTargetCenterY={-0.15}
          mobileStartY={3.2}
          lanyardWidth={0.46}
          mobileLanyardWidth={0.28}
          lanyardText={lanyardText}
          frontImage={portraitUrl}
          backImage={portraitUrl}
          imageFit="cover"
          className="w-full h-full"
        />
      </motion.div>

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto relative z-30 pointer-events-none">
        <StoryPointsGrid 
          theme={theme}
          isDark={isDark}
          isIndo={isIndo}
          leftPoints={[
            { title: left1Title, desc: left1Desc, path: '#/educational' },
            { title: left2Title, desc: left2Desc, path: '#/personality' },
            { title: left3Title, desc: left3Desc, path: '#/hobbies' },
          ]}
          rightPoints={[
            { title: right1Title, desc: right1Desc, path: '#/career-journey' },
            { title: right2Title, desc: right2Desc, path: '#/skills' },
            { title: right3Title, desc: right3Desc, path: '#/projects' },
          ]}
          customSubPages={customSubPages}
          onPointClick={handlePointClick}
        />
      </div>
    </motion.div>
  );
};

export default AboutMeStoryPage;

