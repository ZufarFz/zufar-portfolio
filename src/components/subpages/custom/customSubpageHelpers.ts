import { CVData } from '../../../types';

export function getDisplaySections(pageKey: string, rawSections: any[], cvData: CVData) {
  let filteredSections = [];
  if (pageKey === 'education') {
    filteredSections = rawSections.filter(es => !es.linkedEducationDegree?.startsWith('page:') && !es.linkedEducationDegree?.startsWith('item:'));
  } else {
    filteredSections = rawSections.filter(es => 
      es.linkedEducationDegree === `page:${pageKey}` || 
      es.linkedEducationDegree?.startsWith(`item:${pageKey}:`)
    );
  }

  const sortedSections = [...filteredSections].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  let displaySections = [...sortedSections];
  if (displaySections.length === 0) {
    if (pageKey === 'education') {
      displaySections = [];
    } else if (pageKey === 'personality') {
      (cvData.personality || []).forEach((p, idx) => {
        displaySections.push({
          id: `fallback-pers-${p.id}`,
          title: p.title,
          content: p.description,
          imageUrl: '',
          layoutType: idx % 2 === 0 ? 'image_left' as const : 'image_right' as const,
          bgColor: idx % 2 === 0 ? 'slate' as const : 'indigo' as const,
          linkedEducationDegree: `item:personality:${p.id}`,
          sortOrder: idx
        });
      });
    } else if (pageKey === 'hobbies') {
      (cvData.hobbies || []).forEach((h, idx) => {
        displaySections.push({
          id: `fallback-hobby-${h.id}`,
          title: h.title,
          content: h.description,
          imageUrl: '',
          layoutType: idx % 2 === 0 ? 'image_left' as const : 'image_right' as const,
          bgColor: idx % 2 === 0 ? 'slate' as const : 'rose' as const,
          linkedEducationDegree: `item:hobbies:${h.id}`,
          sortOrder: idx
        });
      });
    } else if (pageKey === 'career-goals') {
      (cvData.careerGoals || []).forEach((cg, idx) => {
        displaySections.push({
          id: `fallback-goal-${cg.id}`,
          title: cg.title,
          content: cg.description,
          imageUrl: '',
          layoutType: 'centered_hero' as const,
          bgColor: 'slate' as const,
          linkedEducationDegree: `item:career-goals:${cg.id}`,
          sortOrder: idx
        });
      });
    } else if (pageKey === 'skills') {
      (cvData.skills || []).forEach((s, idx) => {
        displaySections.push({
          id: `fallback-skill-${s.id}`,
          title: s.name,
          content: s.description,
          imageUrl: '',
          layoutType: 'image_left' as const,
          bgColor: 'slate' as const,
          linkedEducationDegree: `item:skills:${s.id}`,
          sortOrder: idx
        });
      });
    } else if (pageKey === 'career-journey') {
      const list = (cvData.experiences || []).filter(exp => exp.showOnWeb !== false && exp.showOnHome !== false);
      list.forEach((exp, idx) => {
        displaySections.push({
          id: `fallback-exp-${exp.id}`,
          title: `${exp.role} @ ${exp.company}`,
          content: exp.bulletPoints.join('\n• '),
          imageUrl: '',
          layoutType: 'image_right' as const,
          bgColor: 'slate' as const,
          linkedEducationDegree: `item:career-journey:${exp.id}`,
          sortOrder: idx
        });
      });
    }
  }

  return displaySections;
}

export function getSubpageBgSettings(prefix: string, cvData: CVData, isDark: boolean) {
  const subpageBgStyle = cvData.webTexts?.[`${prefix}_bg_style`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_style`] || cvData.webTexts?.about_subpages_bg_style || 'none';
  const subpageBgOpacity = cvData.webTexts?.[`${prefix}_bg_pattern_opacity`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_pattern_opacity`] || cvData.webTexts?.about_subpages_bg_pattern_opacity;
  const subpageBgScale = cvData.webTexts?.[`${prefix}_bg_pattern_scale`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_pattern_scale`] || cvData.webTexts?.about_subpages_bg_pattern_scale;
  const subpageBgColor = cvData.webTexts?.[`${prefix}_bg_pattern_color`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_pattern_color`] || cvData.webTexts?.about_subpages_bg_pattern_color;
  const subpageCustomSvg = cvData.webTexts?.[`${prefix}_bg_custom_svg`] || cvData.webTexts?.[`${prefix}_custom_svg`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_custom_svg`] || cvData.webTexts?.[`about_subpage_${prefix}_custom_svg`] || cvData.webTexts?.about_subpages_custom_svg;
  const subpageCustomUrl = cvData.webTexts?.[`${prefix}_bg_custom_url`] || cvData.webTexts?.[`${prefix}_custom_url`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_custom_url`] || cvData.webTexts?.[`about_subpage_${prefix}_custom_url`] || cvData.webTexts?.about_subpages_custom_url;

  const subpageBgColorVal = isDark
    ? (cvData.webTexts?.[`${prefix}_bg_color_dark`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_color_dark`] || cvData.webTexts?.about_subpages_bg_color_dark || '#0f172a')
    : (cvData.webTexts?.[`${prefix}_bg_color`] || cvData.webTexts?.[`about_subpage_${prefix}_bg_color`] || cvData.webTexts?.about_subpages_bg_color || '#f7f9fb');

  return {
    subpageBgStyle,
    subpageBgOpacity,
    subpageBgScale,
    subpageBgColor,
    subpageCustomSvg,
    subpageCustomUrl,
    subpageBgColorVal,
  };
}

