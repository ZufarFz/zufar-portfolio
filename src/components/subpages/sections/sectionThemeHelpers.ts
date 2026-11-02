import { CVData } from '../../../types';

export interface SectionThemeColors {
  sectionBgClass: string;
  textColor: string;
  titleColor: string;
  accentBadge: string;
}

export function getSectionThemeColors(bgOpt: string, isDark: boolean): SectionThemeColors {
  if (isDark) {
    if (bgOpt === 'emerald') {
      return {
        sectionBgClass: 'bg-gradient-to-br from-emerald-955/40 via-emerald-900/10 to-slate-955/30',
        textColor: 'text-emerald-200/90',
        titleColor: 'text-emerald-50 font-black',
        accentBadge: 'bg-emerald-955/80 border-emerald-500/30 text-emerald-400'
      };
    }
    if (bgOpt === 'indigo') {
      return {
        sectionBgClass: 'bg-gradient-to-br from-indigo-955/40 via-indigo-900/10 to-slate-955/30',
        textColor: 'text-indigo-200/90',
        titleColor: 'text-indigo-50 font-black',
        accentBadge: 'bg-indigo-955/80 border-indigo-500/30 text-indigo-400'
      };
    }
    if (bgOpt === 'amber') {
      return {
        sectionBgClass: 'bg-gradient-to-br from-amber-955/30 via-amber-900/10 to-slate-955/30',
        textColor: 'text-amber-200/90',
        titleColor: 'text-amber-50 font-black',
        accentBadge: 'bg-amber-955/80 border-amber-500/30 text-amber-400'
      };
    }
    if (bgOpt === 'rose') {
      return {
        sectionBgClass: 'bg-gradient-to-br from-rose-955/30 via-rose-900/10 to-slate-955/30',
        textColor: 'text-rose-200/90',
        titleColor: 'text-rose-50 font-black',
        accentBadge: 'bg-rose-955/80 border-rose-500/30 text-rose-400'
      };
    }
    if (bgOpt === 'dark') {
      return {
        sectionBgClass: 'bg-slate-955',
        textColor: 'text-slate-400',
        titleColor: 'text-slate-100 font-black',
        accentBadge: 'bg-slate-900 border-slate-800 text-slate-300'
      };
    }
    if (bgOpt === 'light') {
      return {
        sectionBgClass: 'bg-white/[0.03]',
        textColor: 'text-slate-400',
        titleColor: 'text-slate-100 font-black',
        accentBadge: 'bg-white/[0.05] border-white/[0.10] text-slate-300'
      };
    }
    return {
      sectionBgClass: 'bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-955/30',
      textColor: 'text-slate-300/95',
      titleColor: 'text-white font-black',
      accentBadge: 'bg-slate-900 border-slate-800 text-slate-300'
    };
  }

  // Light theme
  if (bgOpt === 'emerald') {
    return {
      sectionBgClass: 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/20 shadow-xs',
      textColor: 'text-emerald-900/80',
      titleColor: 'text-emerald-955 font-black',
      accentBadge: 'bg-emerald-100/70 border-emerald-200 text-emerald-800'
    };
  }
  if (bgOpt === 'indigo') {
    return {
      sectionBgClass: 'bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/20 shadow-xs',
      textColor: 'text-indigo-900/80',
      titleColor: 'text-indigo-955 font-black',
      accentBadge: 'bg-indigo-100/70 border-indigo-200 text-indigo-850'
    };
  }
  if (bgOpt === 'amber') {
    return {
      sectionBgClass: 'bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 shadow-xs',
      textColor: 'text-amber-900/80',
      titleColor: 'text-amber-955 font-black',
      accentBadge: 'bg-amber-100/70 border-amber-200 text-amber-850'
    };
  }
  if (bgOpt === 'rose') {
    return {
      sectionBgClass: 'bg-gradient-to-br from-rose-50/60 via-white to-rose-50/20 shadow-xs',
      textColor: 'text-rose-900/80',
      titleColor: 'text-rose-955 font-black',
      accentBadge: 'bg-rose-100/70 border-rose-200 text-rose-850'
    };
  }
  if (bgOpt === 'dark') {
    return {
      sectionBgClass: 'bg-slate-900 text-white shadow-md',
      textColor: 'text-slate-300',
      titleColor: 'text-white font-black',
      accentBadge: 'bg-slate-800 border-slate-700 text-slate-200'
    };
  }
  if (bgOpt === 'light') {
    return {
      sectionBgClass: 'bg-white shadow-2xs',
      textColor: 'text-slate-650',
      titleColor: 'text-slate-900 font-black',
      accentBadge: 'bg-slate-50 border-slate-200 text-slate-700'
    };
  }
  return {
    sectionBgClass: 'bg-gradient-to-b from-slate-100/50 via-white to-slate-50/30 shadow-2xs',
    textColor: 'text-slate-650',
    titleColor: 'text-slate-900 font-black',
    accentBadge: 'bg-slate-150 border-slate-250 text-slate-700'
  };
}

export interface ResolvedSectionDetails {
  displayTitle: string;
  displayBadge: string;
  displayContent: string;
  iconName: string;
  tools?: string[];
}

export function resolveSectionDetails(
  section: any,
  cvData: CVData,
  categoryLabel: string
): ResolvedSectionDetails {
  let displayTitle = section.title;
  let displayBadge = categoryLabel;
  let displayContent = section.content;
  let iconName = '';
  let tools: string[] | undefined;

  const linked = section.linkedEducationDegree;
  if (!linked) {
    return { displayTitle, displayBadge, displayContent, iconName };
  }

  if (linked.startsWith('item:personality:')) {
    const itemId = linked.replace('item:personality:', '');
    const item = cvData.personality?.find(p => p.id === itemId);
    if (item) {
      displayTitle = item.title;
      displayBadge = 'Personality & Values';
      displayContent = item.description;
      iconName = item.icon;
    }
  } else if (linked.startsWith('item:hobbies:')) {
    const itemId = linked.replace('item:hobbies:', '');
    const item = cvData.hobbies?.find(h => h.id === itemId);
    if (item) {
      displayTitle = item.title;
      displayBadge = 'Hobbies & Interests';
      displayContent = item.description;
      iconName = item.icon;
    }
  } else if (linked.startsWith('item:career-goals:')) {
    const itemId = linked.replace('item:career-goals:', '');
    const item = cvData.careerGoals?.find(cg => cg.id === itemId);
    if (item) {
      displayTitle = item.title;
      displayBadge = `Target Year: ${item.target_year}`;
      displayContent = item.description;
      iconName = item.icon;
    }
  } else if (linked.startsWith('item:skills:')) {
    const itemId = linked.replace('item:skills:', '');
    const item = cvData.skills?.find(s => s.id === itemId);
    if (item) {
      displayTitle = item.name;
      displayBadge = `Skill — ${item.category}`;
      displayContent = item.description;
      iconName = item.icon;
    }
  } else if (linked.startsWith('item:career-journey:')) {
    const itemId = linked.replace('item:career-journey:', '');
    const item = cvData.experiences?.find(exp => exp.id === itemId);
    if (item) {
      displayTitle = `${item.role} @ ${item.company}`;
      displayBadge = item.period;
      displayContent = item.bulletPoints.join('\n• ');
      iconName = 'Briefcase';
      tools = item.tools;
    }
  } else {
    const linkedEdu = cvData.education?.find(e => {
      const compositeKey = `${e.degree}|||${e.institution}`;
      return e.id === linked || e.degree === linked || compositeKey === linked;
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
      iconName = 'GraduationCap';
    }
  }

  return { displayTitle, displayBadge, displayContent, iconName, tools };
}

