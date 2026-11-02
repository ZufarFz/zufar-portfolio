import React, { useEffect } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Heart, 
  Briefcase, 
  Sparkles 
} from 'lucide-react';
import { CVData } from '../types';
import { CustomSubPage, ProjectsGallerySubPage, IconMap } from './subpages';

interface AboutMeSubPagesProps {
  subPage: string;
  cvData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  onBackToStory: () => void;
}

export default function AboutMeSubPages({ 
  subPage, 
  cvData, 
  theme, 
  lang,
}: AboutMeSubPagesProps) {
  // Scroll to top on mount so entry transition starts cleanly from top of viewport
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  if (subPage === 'education') {
    return (
      <CustomSubPage
        pageKey="education"
        defaultTitle="Educational Background & Story"
        defaultIntro="Explore my academic achievements, scientific training foundations, and formal credential roadmaps."
        defaultBgUrl="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<GraduationCap className="w-8 h-8" />}
        categoryLabel="Pendidikan"
        cvData={cvData}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (subPage === 'personality') {
    return (
      <CustomSubPage
        pageKey="personality"
        defaultTitle="Personality & Values"
        defaultIntro="My operating principles, character ethics, and core professional values that guide my collaborative work style."
        defaultBgUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Cpu className="w-8 h-8" />}
        categoryLabel="Personality & Values"
        cvData={cvData}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (subPage === 'hobbies') {
    return (
      <CustomSubPage
        pageKey="hobbies"
        defaultTitle="Hobbies & Interests"
        defaultIntro="What keeps me inspired and energizes my creative problem-solving outside of regular business hours."
        defaultBgUrl="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Heart className="w-8 h-8" />}
        categoryLabel="Hobbies & Interests"
        cvData={cvData}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (subPage === 'career-journey') {
    return (
      <CustomSubPage
        pageKey="career-journey"
        defaultTitle="Career Journey & Milestones"
        defaultIntro="My timeline of professional experiences, highlighting analytical leadership, data strategy, and metric modernization."
        defaultBgUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Briefcase className="w-8 h-8" />}
        categoryLabel="Experience"
        cvData={cvData}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (subPage === 'skills') {
    return (
      <CustomSubPage
        pageKey="skills"
        defaultTitle="Skills & Technical Arsenal"
        defaultIntro="My categorized skill arsenal spanning across data pipelines, DBMS, engineering stacks, and visual communication."
        defaultBgUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Cpu className="w-8 h-8" />}
        categoryLabel="Skills & Expertise"
        cvData={cvData}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (subPage === 'projects' || subPage === 'career-goals') {
    return (
      <ProjectsGallerySubPage
        cvData={cvData}
        theme={theme}
        lang={lang}
        subPage={subPage}
      />
    );
  }

  // DYNAMIC CUSTOM SUBPAGE FALLBACK
  const customPageData = (cvData.customSubPages || []).find(p => p.id === subPage);
  const customTitle = customPageData 
    ? (lang === 'id' ? (customPageData.title || customPageData.titleEn) : (customPageData.titleEn || customPageData.title))
    : (cvData.webTexts?.[`${subPage}_title`] || subPage.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  const customSubtitle = customPageData
    ? (lang === 'id' ? (customPageData.subtitle || customPageData.subtitleEn) : (customPageData.subtitleEn || customPageData.subtitle))
    : (cvData.webTexts?.[`${subPage}_intro`] || cvData.webTexts?.[`${subPage}_subtitle`] || 'Explore detailed stories, achievements, and insights in this section.');
  const customBg = customPageData?.headerBg || cvData.webTexts?.[`${subPage}_header_bg`] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop';
  const IconComp = (customPageData?.iconName && IconMap[customPageData.iconName]) ? IconMap[customPageData.iconName] : Sparkles;

  return (
    <CustomSubPage
      pageKey={subPage}
      defaultTitle={customTitle}
      defaultIntro={customSubtitle}
      defaultBgUrl={customBg}
      defaultIcon={<IconComp className="w-8 h-8" />}
      categoryLabel={customTitle}
      cvData={cvData}
      theme={theme}
      lang={lang}
    />
  );
}
