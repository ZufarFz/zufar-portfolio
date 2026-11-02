import { CVData } from '../types';
import { DEFAULT_WEB_TEXTS, ID_TRANSLATIONS } from '../data/portfolioData';

export { ID_TRANSLATIONS };

export function getLocalizedCVData(cvData: CVData, lang: 'id' | 'en'): CVData {
  const filterList = <T extends { id: string }>(items: T[] | undefined): T[] | undefined => {
    if (!items) return undefined;
    const hasLangSuffix = items.some(item => item.id && (item.id.endsWith('-id') || item.id.endsWith('-en')));
    if (!hasLangSuffix) {
      if (lang === 'id') {
        return items.map(item => {
          // Translate default items to ID if applicable
          if (item.id === 'sql' && ID_TRANSLATIONS.skills?.['sql']) {
            return { ...item, ...ID_TRANSLATIONS.skills['sql'] };
          }
          if (item.id === 'python' && ID_TRANSLATIONS.skills?.['python']) {
            return { ...item, ...ID_TRANSLATIONS.skills['python'] };
          }
          if (item.id === 'power-query' && ID_TRANSLATIONS.skills?.['power-query']) {
            return { ...item, ...ID_TRANSLATIONS.skills['power-query'] };
          }
          if (item.id === 'powerbi' && ID_TRANSLATIONS.skills?.['powerbi']) {
            return { ...item, ...ID_TRANSLATIONS.skills['powerbi'] };
          }
          if (item.id === 'excel' && ID_TRANSLATIONS.skills?.['excel']) {
            return { ...item, ...ID_TRANSLATIONS.skills['excel'] };
          }
          if (item.id === 'customer-segmentation' && ID_TRANSLATIONS.caseStudies?.['customer-segmentation']) {
            return { ...item, ...ID_TRANSLATIONS.caseStudies['customer-segmentation'] };
          }
          if (item.id === 'sales-forecasting' && ID_TRANSLATIONS.caseStudies?.['sales-forecasting']) {
            return { ...item, ...ID_TRANSLATIONS.caseStudies['sales-forecasting'] };
          }
          if (item.id === 'supply-chain' && ID_TRANSLATIONS.caseStudies?.['supply-chain']) {
            return { ...item, ...ID_TRANSLATIONS.caseStudies['supply-chain'] };
          }
          if (item.id === 'exp-1' && ID_TRANSLATIONS.experiences?.['exp-1']) {
            return { ...item, ...ID_TRANSLATIONS.experiences['exp-1'] };
          }
          if (item.id === 'exp-2' && ID_TRANSLATIONS.experiences?.['exp-2']) {
            return { ...item, ...ID_TRANSLATIONS.experiences['exp-2'] };
          }
          if (item.id === 'edu-sec-1' && ID_TRANSLATIONS.educationSections?.['edu-sec-1']) {
            return { ...item, ...ID_TRANSLATIONS.educationSections['edu-sec-1'] };
          }
          if (item.id === 'edu-sec-2' && ID_TRANSLATIONS.educationSections?.['edu-sec-2']) {
            return { ...item, ...ID_TRANSLATIONS.educationSections['edu-sec-2'] };
          }
          return item;
        });
      }
      return items;
    }

    const result: T[] = [];
    const mappedBases = new Set<string>();

    items.forEach(item => {
      if (item.id && item.id.endsWith(`-${lang}`)) {
        const baseId = item.id.slice(0, -(lang.length + 1));
        result.push({
          ...item,
          id: baseId
        });
        mappedBases.add(baseId);
      }
    });

    items.forEach(item => {
      if (item.id && !item.id.endsWith('-id') && !item.id.endsWith('-en')) {
        if (!mappedBases.has(item.id)) {
          result.push(item);
        }
      }
    });

    return result;
  };

  const filterEduList = (items: any[] | undefined) => {
    if (!items) return [];
    const hasLangSuffix = items.some(item => item.id && (item.id.endsWith('-id') || item.id.endsWith('-en')));
    if (!hasLangSuffix) {
      if (lang === 'id') {
        return items.map(item => {
          if (item.degree === "B.S. Applied Statistics & Computer Science" && ID_TRANSLATIONS.education?.[0]) {
            return {
              ...item,
              degree: ID_TRANSLATIONS.education[0].degree,
              institution: ID_TRANSLATIONS.education[0].institution
            };
          }
          return item;
        });
      }
      return items;
    }

    const result: any[] = [];
    const mappedBases = new Set<string>();

    items.forEach(item => {
      if (item.id && item.id.endsWith(`-${lang}`)) {
        const baseId = item.id.slice(0, -(lang.length + 1));
        result.push({
          ...item,
          id: baseId
        });
        mappedBases.add(baseId);
      }
    });

    items.forEach(item => {
      if (!item.id || (!item.id.endsWith('-id') && !item.id.endsWith('-en'))) {
        if (!item.id || !mappedBases.has(item.id)) {
          result.push(item);
        }
      }
    });

    return result;
  };

  const localizedWebTexts: Record<string, string> = {};
  if (cvData.webTexts) {
    Object.entries(cvData.webTexts).forEach(([key, val]) => {
      if (!key.endsWith('_id') && !key.endsWith('_en') && !key.endsWith('-id') && !key.endsWith('-en')) {
        // Fallback to default Indonesian if language is ID and value is default English or not overridden
        const isDefaultVal = val === undefined || val === null || val === "" || val === (DEFAULT_WEB_TEXTS as any)[key];
        if (lang === 'id' && (ID_TRANSLATIONS.webTexts as any)?.[key] !== undefined && isDefaultVal) {
          localizedWebTexts[key] = (ID_TRANSLATIONS.webTexts as any)[key];
        } else {
          localizedWebTexts[key] = val;
        }
      }
    });

    Object.entries(cvData.webTexts).forEach(([key, val]) => {
      if (key.endsWith(`_${lang}`) || key.endsWith(`-${lang}`)) {
        const baseKey = key.slice(0, -(lang.length + 1));
        const isStylingKey = baseKey.startsWith('navbar_') || baseKey.startsWith('hero_') || baseKey.startsWith('home_') || baseKey.startsWith('font_') || baseKey.startsWith('footer_');
        if (isStylingKey) {
          if (cvData.webTexts[baseKey] !== undefined && cvData.webTexts[baseKey] !== "") {
            localizedWebTexts[baseKey] = cvData.webTexts[baseKey];
            return;
          }
        }
        localizedWebTexts[baseKey] = val;
      }
    });

    // Ensure all Gooey Cursor settings are 100% universal and identical across languages
    const gooeyUniversalKeys = [
      'enable_gooey_cursor',
      'gooey_head_style',
      'gooey_hide_default_cursor',
      'gooey_cursor_splash',
      'gooey_cursor_hover_scale',
      'gooey_cursor_hover_reaction',
      'gooey_cursor_size',
      'gooey_cursor_opacity',
      'gooey_cursor_color',
      'gooey_cursor_color_dark',
      'gooey_cursor_color_light',
      'gooey_cursor_dot_dark',
      'gooey_cursor_dot_light',
    ];
    gooeyUniversalKeys.forEach((gKey) => {
      const val =
        cvData.webTexts?.[gKey] ??
        cvData.webTexts?.[`${gKey}_id`] ??
        cvData.webTexts?.[`${gKey}_en`] ??
        (DEFAULT_WEB_TEXTS as any)[gKey];
      if (val !== undefined && val !== null && val !== '') {
        localizedWebTexts[gKey] = val;
      }
    });
  }

  const getField = (fieldName: keyof CVData, defaultValue: any) => {
    if (localizedWebTexts[fieldName as string] !== undefined) {
      return localizedWebTexts[fieldName as string];
    }
    const val = cvData[fieldName] !== undefined ? cvData[fieldName] : defaultValue;
    if (lang === 'id' && (ID_TRANSLATIONS as any)[fieldName as string] !== undefined) {
      // Apply default translations for standard profile fields
      if (val === defaultValue || val === cvData[fieldName]) {
        return (ID_TRANSLATIONS as any)[fieldName as string];
      }
    }
    return val;
  };

  return {
    ...cvData,
    name: getField('name', cvData.name),
    title: getField('title', cvData.title),
    location: getField('location', cvData.location),
    aboutMe: getField('aboutMe', cvData.aboutMe),
    nickname: getField('nickname', cvData.nickname),
    idCardSubText: getField('idCardSubText', cvData.idCardSubText),
    methodologyTitle: getField('methodologyTitle', cvData.methodologyTitle),
    methodologyText: getField('methodologyText', cvData.methodologyText),
    
    skills: filterList(cvData.skills),
    skillCategories: filterList(cvData.skillCategories),
    caseStudies: filterList(cvData.caseStudies),
    experiences: filterList(cvData.experiences),
    education: filterEduList(cvData.education),
    personality: filterList(cvData.personality),
    hobbies: filterList(cvData.hobbies),
    careerGoals: filterList(cvData.careerGoals),
    educationSections: filterList(cvData.educationSections),
    webTexts: localizedWebTexts
  };
}
