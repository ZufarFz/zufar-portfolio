import React, { useEffect } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Heart, 
  Briefcase, 
  Sparkles 
} from 'lucide-react';
import { CVData } from '../../types';
import { CustomSubPage, ProjectsGallerySubPage, IconMap } from './index';

export interface AboutMeSubPagesProps {
  subPage: string;
  cvData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  onBackToStory: () => void;
}

export const AboutMeSubPages: React.FC<AboutMeSubPagesProps> = ({ 
  subPage, 
  cvData, 
  theme, 
  lang,
}) => {
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
        defaultTitle="Personality & Core Values"
        defaultIntro="Discover my professional identity, core operating principles, teamwork synergy, and behavioral metrics."
        defaultBgUrl="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Cpu className="w-8 h-8" />}
        categoryLabel="Kepribadian"
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
        defaultTitle="Hobbies & Creative Pursuits"
        defaultIntro="Delve into my passions, creative engineering endeavors, sports, and balanced lifestyle disciplines."
        defaultBgUrl="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Heart className="w-8 h-8" />}
        categoryLabel="Hobi & Minat"
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
        defaultTitle="Career Journey & Professional Milestones"
        defaultIntro="Explore my historical work experience, impact metrics, engineering leadership roles, and company milestones."
        defaultBgUrl="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Briefcase className="w-8 h-8" />}
        categoryLabel="Perjalanan Karir"
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
        defaultIntro="Browse my full technological ecosystem, core competencies, tools, languages, and strategic data frameworks."
        defaultBgUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
        defaultIcon={<Sparkles className="w-8 h-8" />}
        categoryLabel="Keahlian & Arsenal"
        cvData={cvData}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (subPage === 'projects') {
    return (
      <ProjectsGallerySubPage
        cvData={cvData}
        theme={theme}
        lang={lang}
        subPage={subPage}
      />
    );
  }

  // Dynamic Custom Subpages added by user
  const foundCustom = (cvData.customSubPages || []).find(p => p.id === subPage);
  if (foundCustom) {
    const IconComp = IconMap[foundCustom.iconName] || Sparkles;
    const isIndo = lang === 'id';
    const title = isIndo ? (foundCustom.title || foundCustom.titleEn || foundCustom.id) : (foundCustom.titleEn || foundCustom.title || foundCustom.id);
    const intro = isIndo ? (foundCustom.subtitle || foundCustom.subtitleEn || '') : (foundCustom.subtitleEn || foundCustom.subtitle || '');

    return (
      <CustomSubPage
        pageKey={foundCustom.id}
        defaultTitle={title}
        defaultIntro={intro}
        defaultBgUrl={foundCustom.headerBgUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"}
        defaultIcon={<IconComp className="w-8 h-8" />}
        categoryLabel={title}
        cvData={cvData}
        theme={theme}
        lang={lang}
      />
    );
  }

  return (
    <div className={`min-h-screen py-32 px-4 text-center font-sans ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-[#FAF9F5] text-slate-800'}`}>
      <h1 className="text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
      <p className="text-sm opacity-70 mb-8">Sub-halaman dengan kunci "{subPage}" belum dikonfigurasi.</p>
    </div>
  );
};

export default AboutMeSubPages;
