import { CVData } from '../../types';

export const DEFAULT_SKILL_CATEGORIES = [
  { id: 'frontend', labelId: 'Frontend', labelEn: 'Frontend' },
  { id: 'backend', labelId: 'Backend & Database', labelEn: 'Backend & Database' },
  { id: 'dbms', labelId: 'DBMS & Query', labelEn: 'DBMS & Query' },
  { id: 'scientific', labelId: 'Programming & Script', labelEn: 'Programming & Script' },
  { id: 'visualization', labelId: 'BI & Visualization', labelEn: 'BI & Visualization' },
  { id: 'analytical', labelId: 'Analytics & Stats', labelEn: 'Analytics & Stats' },
  { id: 'tools', labelId: 'Tools & Infra', labelEn: 'Tools & Infra' },
  { id: 'core', labelId: 'Core Technologies', labelEn: 'Core Technologies' },
];

export const getBaseId = (idStr?: string | number): string => {
  const str = String(idStr || '');
  if (str.endsWith('-en') || str.endsWith('-id')) {
    return str.slice(0, -3);
  }
  return str;
};

// Generic bilingual pair extractor
export const getBilingualPairs = <T extends { id?: string | number }>(
  rawList: T[] | undefined,
  defaultFallbackEn?: (baseId: string) => Partial<T>,
  defaultFallbackId?: (baseId: string) => Partial<T>
) => {
  const list = rawList || [];
  const baseIds = Array.from(new Set(list.map(item => getBaseId(item.id)))).filter(Boolean);

  return baseIds.map(baseId => {
    let enItem = list.find(e => String(e.id) === `${baseId}-en`) || list.find(e => String(e.id) === baseId);
    let idItem = list.find(e => String(e.id) === `${baseId}-id`);

    if (!enItem && defaultFallbackEn) {
      enItem = { ...defaultFallbackEn(baseId), id: `${baseId}-en` } as T;
    }
    if (!idItem && defaultFallbackId) {
      idItem = { ...defaultFallbackId(baseId), id: `${baseId}-id` } as T;
    }
    if (enItem && !idItem) {
      idItem = { ...enItem, id: `${baseId}-id` } as T;
    }
    if (!enItem && idItem) {
      enItem = { ...idItem, id: `${baseId}-en` } as T;
    }

    // Automatically ensure shared SVG configuration is always identical between EN and ID
    if (enItem && idItem && ('customSvg' in (enItem as any) || 'svgUrl' in (enItem as any) || 'customSvg' in (idItem as any) || 'svgUrl' in (idItem as any))) {
      const unifiedCustomSvg = (enItem as any).customSvg ?? (idItem as any).customSvg;
      const unifiedSvgUrl = (enItem as any).svgUrl ?? (idItem as any).svgUrl;
      if (unifiedCustomSvg !== undefined) {
        (enItem as any).customSvg = unifiedCustomSvg;
        (idItem as any).customSvg = unifiedCustomSvg;
      }
      if (unifiedSvgUrl !== undefined) {
        (enItem as any).svgUrl = unifiedSvgUrl;
        (idItem as any).svgUrl = unifiedSvgUrl;
      }
    }

    return {
      baseId,
      en: enItem as T,
      id: idItem as T
    };
  });
};

