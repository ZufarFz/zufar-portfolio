import { CVData, FloatingAsset } from '../../../types';
import { LayoutTemplate } from '../../../data/layoutTemplates';

export function createDrawerAssetHandlers(
  localData: CVData,
  handleUpdate: (updater: (prev: CVData) => CVData) => void,
  activeBgSection: string,
  editLang: 'id' | 'en',
  setAppliedAllNotice: (notice: boolean) => void
) {
  const handleApplyBgPatternToAll = () => {
    const texts = localData.webTexts || {};
    const srcKey = activeBgSection;
    const subKey = srcKey.replace('about_subpage_', '');

    const styleVal =
      texts[`${srcKey}_bg_style`] ||
      texts[`${srcKey}_bg_style_${editLang}`] ||
      texts[`${subKey}_bg_style`] ||
      texts[`${subKey}_bg_style_${editLang}`] ||
      'none';
    const opVal =
      texts[`${srcKey}_bg_pattern_opacity`] ||
      texts[`${srcKey}_bg_pattern_opacity_${editLang}`] ||
      texts[`${subKey}_bg_pattern_opacity`] ||
      texts[`${subKey}_bg_pattern_opacity_${editLang}`] ||
      '0.20';
    const scVal =
      texts[`${srcKey}_bg_pattern_scale`] ||
      texts[`${srcKey}_bg_pattern_scale_${editLang}`] ||
      texts[`${subKey}_bg_pattern_scale`] ||
      texts[`${subKey}_bg_pattern_scale_${editLang}`] ||
      '1';
    const colVal =
      texts[`${srcKey}_bg_pattern_color`] ||
      texts[`${srcKey}_bg_pattern_color_${editLang}`] ||
      texts[`${subKey}_bg_pattern_color`] ||
      texts[`${subKey}_bg_pattern_color_${editLang}`] ||
      '';
    const svgVal =
      texts[`${srcKey}_custom_svg`] ||
      texts[`${srcKey}_bg_custom_svg`] ||
      texts[`${subKey}_custom_svg`] ||
      texts[`${subKey}_bg_custom_svg`] ||
      '';
    const urlVal =
      texts[`${srcKey}_custom_url`] ||
      texts[`${srcKey}_bg_custom_url`] ||
      texts[`${subKey}_custom_url`] ||
      texts[`${subKey}_bg_custom_url`] ||
      '';

    const targetSections = [
      'home',
      'projects',
      'skills',
      'experience',
      'contact',
      'about_story',
      'about_subpage_education',
      'about_subpage_personality',
      'about_subpage_hobbies',
      'about_subpage_career_goals',
    ];

    handleUpdate((prev) => {
      const nextTexts = { ...(prev.webTexts || {}) };
      targetSections.forEach((sec) => {
        nextTexts[`${sec}_bg_style`] = styleVal;
        nextTexts[`${sec}_bg_pattern_opacity`] = opVal;
        nextTexts[`${sec}_bg_pattern_scale`] = scVal;
        nextTexts[`${sec}_bg_pattern_color`] = colVal;
        nextTexts[`${sec}_custom_svg`] = svgVal;
        nextTexts[`${sec}_bg_custom_svg`] = svgVal;
        nextTexts[`${sec}_custom_url`] = urlVal;
        nextTexts[`${sec}_bg_custom_url`] = urlVal;
      });
      return { ...prev, webTexts: nextTexts };
    });

    setAppliedAllNotice(true);
    setTimeout(() => setAppliedAllNotice(false), 3000);
  };

  const handleApplyThemeTemplate = (patch: Record<string, string>, themeAccent?: string) => {
    handleUpdate((prev) => {
      const nextTexts = { ...(prev.webTexts || {}), ...patch };
      let nextLayout = prev.layoutSettings;
      if (themeAccent) {
        nextLayout = {
          ...(nextLayout || {
            fontSize: 'standard',
            spacing: 'standard',
            layoutStyle: 'left-sidebar',
            fontFamily: 'sans',
            sectionOrder: [],
          }),
          themeColor: themeAccent as any,
        };
      }
      return {
        ...prev,
        webTexts: nextTexts,
        layoutSettings: nextLayout,
      };
    });
  };

  const handleApplyLayoutTemplate = (layout: LayoutTemplate) => {
    handleUpdate((prev) => {
      const nextTexts = { ...(prev.webTexts || {}), ...layout.webTextsPatch };
      const nonSecAssets = (prev.floatingAssets || []).filter((a) => a.section !== layout.targetSection);
      const updatedAssets = [...nonSecAssets, ...layout.floatingAssets];
      return {
        ...prev,
        webTexts: nextTexts,
        floatingAssets: updatedAssets,
      };
    });
  };

  const handleApplyFullZenPreset = () => {
    const zenAssets: FloatingAsset[] = [
      {
        id: `fa-bird-left-${Date.now()}`,
        name: '🕊️ Burung Bangau Kiri',
        type: 'svg',
        content:
          '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z" fill="currentColor"/></svg>',
        color: '#dc2626',
        section: 'home',
        width: 85,
        x: 10,
        y: 20,
        opacity: 0.85,
        animation: 'float',
        zIndex: 2,
      },
      {
        id: `fa-bird-right-${Date.now() + 1}`,
        name: '🕊️ Burung Bangau Kanan',
        type: 'svg',
        content:
          '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z" fill="currentColor"/></svg>',
        color: '#dc2626',
        section: 'home',
        width: 65,
        x: 88,
        y: 28,
        opacity: 0.75,
        animation: 'drift',
        zIndex: 2,
      },
    ];

    handleUpdate((prev) => {
      const nextTexts = { ...(prev.webTexts || {}) };
      nextTexts.home_bg_style = 'japanese_asanoha';
      nextTexts.home_bg_pattern_opacity = '0.18';
      nextTexts.home_bg_pattern_scale = '1.2';
      nextTexts.home_bg_pattern_color = '#dc2626';
      const nonHome = (prev.floatingAssets || []).filter((a) => a.section !== 'home');
      return {
        ...prev,
        webTexts: nextTexts,
        floatingAssets: [...nonHome, ...zenAssets],
      };
    });
  };

  const handleAddSingleAsset = (asset: Partial<FloatingAsset>) => {
    const newAsset: FloatingAsset = {
      id: `fa-${Date.now()}`,
      name: asset.name || 'Ornamen Visual',
      type: asset.type || 'svg',
      content: asset.content || '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>',
      section: asset.section || activeBgSection,
      color: asset.color || '#3b82f6',
      width: asset.width || 80,
      x: asset.x !== undefined ? asset.x : 50,
      y: asset.y !== undefined ? asset.y : 30,
      opacity: asset.opacity !== undefined ? asset.opacity : 0.8,
      rotation: asset.rotation || 0,
      flipX: asset.flipX || false,
      animation: asset.animation || 'float',
      entryAnimation: asset.entryAnimation || 'none',
      entryDelay: asset.entryDelay || 0,
      entryDuration: asset.entryDuration || 1500,
      zIndex: asset.zIndex || 2,
      layer: asset.layer || 'bg',
    };

    handleUpdate((prev) => ({
      ...prev,
      floatingAssets: [...(prev.floatingAssets || []), newAsset],
    }));
  };

  const handleAddFloatingAsset = (preset?: Partial<FloatingAsset>) => {
    const newAsset: FloatingAsset = {
      id: `fa-${Date.now()}`,
      name: preset?.name || 'Aset Melayang Baru',
      type: preset?.type || 'svg',
      content:
        preset?.content ||
        '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>',
      section: preset?.section || 'home',
      color: preset?.color || '#3b82f6',
      width: preset?.width || 80,
      x: preset?.x !== undefined ? preset.x : 50,
      y: preset?.y !== undefined ? preset.y : 20,
      opacity: preset?.opacity !== undefined ? preset.opacity : 0.8,
      rotation: preset?.rotation || 0,
      flipX: preset?.flipX || false,
      animation: preset?.animation || 'float',
      entryAnimation: preset?.entryAnimation || 'none',
      entryDelay: preset?.entryDelay || 0,
      entryDuration: preset?.entryDuration || 1500,
      zIndex: preset?.zIndex || 2,
      layer: preset?.layer || 'bg',
    };

    handleUpdate((prev) => ({
      ...prev,
      floatingAssets: [...(prev.floatingAssets || []), newAsset],
    }));
  };

  const handleUpdateFloatingAsset = (id: string, field: keyof FloatingAsset, value: any) => {
    handleUpdate((prev) => ({
      ...prev,
      floatingAssets: (prev.floatingAssets || []).map((asset) =>
        asset.id === id ? { ...asset, [field]: value } : asset
      ),
    }));
  };

  const handleCopyFromDesktop = (id: string) => {
    handleUpdate((prev) => ({
      ...prev,
      floatingAssets: (prev.floatingAssets || []).map((asset) => {
        if (asset.id === id) {
          return {
            ...asset,
            mobileX: asset.x,
            mobileY: asset.y,
            mobileWidth: asset.width || 80,
            mobileOpacity: asset.opacity ?? 0.8,
            mobileRotation: asset.rotation || 0,
            mobileFlipX: asset.flipX || false,
          };
        }
        return asset;
      }),
    }));
  };

  const handleRemoveFloatingAsset = (id: string) => {
    handleUpdate((prev) => ({
      ...prev,
      floatingAssets: (prev.floatingAssets || []).filter((asset) => asset.id !== id),
    }));
  };

  return {
    handleApplyBgPatternToAll,
    handleApplyThemeTemplate,
    handleApplyLayoutTemplate,
    handleApplyFullZenPreset,
    handleAddSingleAsset,
    handleAddFloatingAsset,
    handleUpdateFloatingAsset,
    handleCopyFromDesktop,
    handleRemoveFloatingAsset,
  };
}

