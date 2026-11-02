import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { CVData, SkillItem } from '../../../types';
import { ID_TRANSLATIONS } from '../../../data/portfolioData';
import { getBilingualPairs } from '../editorUtils';

export function createDrawerWebTextHelpers(
  localData: CVData,
  handleUpdate: (updater: (prev: CVData) => CVData) => void,
  editLang: 'id' | 'en'
) {
  const getWebText = (key: string, targetLang: 'id' | 'en'): string => {
    const texts = localData.webTexts || {};
    if (targetLang === 'id') {
      return (
        texts[`${key}_id`] ??
        texts[key] ??
        (ID_TRANSLATIONS as any)[key] ??
        (ID_TRANSLATIONS as any)[key.replace('about_subpage_', '')] ??
        ''
      );
    }
    return texts[`${key}_en`] ?? texts[key] ?? '';
  };

  const handleWebTextChange = (key: string, value: string, targetLang: 'id' | 'en' = editLang) => {
    handleUpdate((prev) => {
      const nextTexts = { ...(prev.webTexts || {}) };
      const isUniversalKey =
        key.endsWith('_bg_style') ||
        key.endsWith('_bg_pattern_opacity') ||
        key.endsWith('_bg_pattern_scale') ||
        key.endsWith('_bg_pattern_color') ||
        key.endsWith('_custom_svg') ||
        key.endsWith('_bg_custom_svg') ||
        key.endsWith('_custom_url') ||
        key.endsWith('_bg_custom_url') ||
        key.endsWith('_bg_color') ||
        key.endsWith('_bg_color_dark') ||
        key.endsWith('_shadow_enabled') ||
        key.endsWith('_shadow_direction') ||
        key.endsWith('_shadow_depth') ||
        key.endsWith('_shadow_opacity') ||
        key.endsWith('_shadow_color_mode') ||
        key.endsWith('_shadow_custom_color') ||
        key.endsWith('_header_bg_url') ||
        key.endsWith('_header_bg_scale') ||
        key.endsWith('_header_bg_x') ||
        key.endsWith('_header_bg_y') ||
        key.startsWith('navbar_') ||
        key.startsWith('enable_') ||
        key.startsWith('gooey_') ||
        key.startsWith('home_image_') ||
        key.endsWith('_color') ||
        key.endsWith('_color_dark');

      if (isUniversalKey) {
        let baseKey = key;
        if (baseKey.endsWith('_id') || baseKey.endsWith('_en')) {
          baseKey = baseKey.slice(0, -3);
        }

        nextTexts[baseKey] = value;
        nextTexts[`${baseKey}_id`] = value;
        nextTexts[`${baseKey}_en`] = value;

        if (baseKey.endsWith('_custom_svg')) {
          const bgKey = baseKey.replace('_custom_svg', '_bg_custom_svg');
          nextTexts[bgKey] = value;
          nextTexts[`${bgKey}_id`] = value;
          nextTexts[`${bgKey}_en`] = value;
        } else if (baseKey.endsWith('_bg_custom_svg')) {
          const bKey = baseKey.replace('_bg_custom_svg', '_custom_svg');
          nextTexts[bKey] = value;
          nextTexts[`${bKey}_id`] = value;
          nextTexts[`${bKey}_en`] = value;
        }

        if (baseKey.endsWith('_custom_url')) {
          const bgKey = baseKey.replace('_custom_url', '_bg_custom_url');
          nextTexts[bgKey] = value;
          nextTexts[`${bgKey}_id`] = value;
          nextTexts[`${bgKey}_en`] = value;
        } else if (baseKey.endsWith('_bg_custom_url')) {
          const bKey = baseKey.replace('_bg_custom_url', '_custom_url');
          nextTexts[bKey] = value;
          nextTexts[`${bKey}_id`] = value;
          nextTexts[`${bKey}_en`] = value;
        }

        if (key.startsWith('about_subpage_')) {
          const shortenedKey = key.replace('about_subpage_', '');
          nextTexts[shortenedKey] = value;
          nextTexts[`${shortenedKey}_id`] = value;
          nextTexts[`${shortenedKey}_en`] = value;
        } else {
          const subpageKeys = ['education', 'personality', 'hobbies', 'career_goals'];
          for (const sub of subpageKeys) {
            if (key.startsWith(`${sub}_`)) {
              const extendedKey = `about_subpage_${key}`;
              nextTexts[extendedKey] = value;
              nextTexts[`${extendedKey}_id`] = value;
              nextTexts[`${extendedKey}_en`] = value;
              break;
            }
          }
        }
      } else {
        if (targetLang === 'id') {
          nextTexts[`${key}_id`] = value;
        } else {
          nextTexts[`${key}_en`] = value;
          nextTexts[key] = value;
        }
      }
      return {
        ...prev,
        webTexts: nextTexts,
      };
    });
  };

  const renderColorControls = (
    lightKey: string,
    darkKey: string,
    label: string = 'Warna Teks',
    defaultLightHex: string = '#0f172a',
    defaultDarkHex: string = '#ffffff'
  ) => {
    const rawLight = getWebText(lightKey, editLang);
    const rawDark = getWebText(darkKey, editLang);
    const currentLight = rawLight && rawLight.trim() !== '' ? rawLight : defaultLightHex;
    const currentDark = rawDark && rawDark.trim() !== '' ? rawDark : defaultDarkHex;

    return (
      <div className="flex flex-wrap items-center gap-2.5 pt-1 pb-1">
        <div className="flex items-center gap-1.5 bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 rounded-lg px-2 py-1 shadow-xs">
          <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">Terang:</span>
          <input
            type="color"
            value={currentLight.startsWith('#') ? currentLight : defaultLightHex}
            onChange={(e) => handleWebTextChange(lightKey, e.target.value, editLang)}
            className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
            title={`Pilih warna ${label} (Mode Terang)`}
          />
          <input
            type="text"
            value={currentLight}
            onChange={(e) => handleWebTextChange(lightKey, e.target.value, editLang)}
            className="w-18 text-[10px] font-mono bg-slate-950/70 border border-slate-700/50 rounded px-1.5 py-0.5 text-slate-200 focus:outline-hidden"
            placeholder={defaultLightHex}
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 rounded-lg px-2 py-1 shadow-xs">
          <Moon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">Gelap:</span>
          <input
            type="color"
            value={currentDark.startsWith('#') ? currentDark : defaultDarkHex}
            onChange={(e) => handleWebTextChange(darkKey, e.target.value, editLang)}
            className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
            title={`Pilih warna ${label} (Mode Gelap)`}
          />
          <input
            type="text"
            value={currentDark}
            onChange={(e) => handleWebTextChange(darkKey, e.target.value, editLang)}
            className="w-18 text-[10px] font-mono bg-slate-950/70 border border-slate-700/50 rounded px-1.5 py-0.5 text-slate-200 focus:outline-hidden"
            placeholder={defaultDarkHex}
          />
        </div>
      </div>
    );
  };

  const updateBilingualSkillSvg = (baseId: string, customSvg: string, svgUrl: string) => {
    handleUpdate((prev) => {
      const currentList = prev.skills || [];
      const pairs = getBilingualPairs<SkillItem>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          return {
            ...pair,
            en: { ...pair.en, customSvg, svgUrl },
            id: { ...pair.id, customSvg, svgUrl },
          };
        }
        return pair;
      });

      const flatList: SkillItem[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        skills: flatList,
      };
    });
  };

  const updateBilingualItem = <T extends { id?: string | number }>(
    listKey: keyof CVData,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => {
    handleUpdate((prev) => {
      const currentList = (prev[listKey] as unknown as T[]) || [];
      const pairs = getBilingualPairs<T>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const targetObj = pair[targetLang] as any;
          return {
            ...pair,
            [targetLang]: {
              ...targetObj,
              [field]: value,
            },
          };
        }
        return pair;
      });

      const flatList: T[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...(p.en as any), id: `${p.baseId}-en` });
        flatList.push({ ...(p.id as any), id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        [listKey]: flatList,
      };
    });
  };

  return {
    getWebText,
    handleWebTextChange,
    renderColorControls,
    updateBilingualSkillSvg,
    updateBilingualItem,
  };
}
