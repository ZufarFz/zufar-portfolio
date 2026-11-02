import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pencil,
  X,
  Save,
  Check,
  Sparkles,
  GripHorizontal,
  Dock,
  PictureInPicture2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Share2,
  Palette,
  FileText,
  Sliders,
  Sun,
  Moon,
  Info,
} from 'lucide-react';
import {
  CVData,
  EducationItem,
  Experience,
  CaseStudy,
  PersonalityItem,
  HobbyItem,
  CareerGoalItem,
  SkillItem,
  CustomSubPage,
  FloatingAsset,
} from '../types';
import { saveCVData, uploadFileToStorage, resetCVDataToDefault } from '../lib/storage';
import { ID_TRANSLATIONS } from '../data/portfolioData';
import ThemeTemplateStudio from './ThemeTemplateStudio';
import { LayoutTemplate } from '../data/layoutTemplates';
import { AIAssistantModal } from './AIAssistantModal';
import { JobExperienceAiModal } from './JobExperienceAiModal';
import { ExperienceTranslateModal } from './ExperienceTranslateModal';
import { SubpageItemTranslateModal } from './SubpageItemTranslateModal';
import { getBilingualPairs } from './editor/editorUtils';
import {
  ProfileEditorPanel,
  AboutStoryEditorPanel,
  ProjectsEditorPanel,
  SkillsEditorPanel,
  ExperienceEditorPanel,
  ContactEditorPanel,
  SubpagesEditorPanel,
} from './editor/panels/content';
import {
  SocialLinksPanel,
  CvMethodologyPanel,
  CvLayoutEditorPanel,
} from './editor/panels/social';
import {
  BackgroundPatternPanel,
  FloatingAssetsPanel,
  ThemeColorsPanel,
  ThemeShadowsPanel,
  ImagesBannersPanel,
  IdCardPhysicsPanel,
  GooeyCursorPanel,
} from './editor/panels/design';

interface QuickEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdateCV: (updated: CVData) => void;
  currentLang: 'id' | 'en';
  activeSection: string;
  aboutSubPage?: string;
  isStoryView?: boolean;
  activeProjectPresentationId?: string | null;
  theme: 'light' | 'dark';
  previewDevice?: 'desktop' | 'mobile';
  onTogglePreviewDevice?: (device: 'desktop' | 'mobile') => void;
}

export const QuickEditorDrawer: React.FC<QuickEditorDrawerProps> = ({
  isOpen,
  onClose,
  cvData,
  onUpdateCV,
  currentLang,
  activeSection,
  aboutSubPage,
  isStoryView,
  activeProjectPresentationId,
  theme,
  previewDevice = 'desktop',
  onTogglePreviewDevice,
}) => {
  const isDark = theme === 'dark';
  const [localData, setLocalData] = useState<CVData>(cvData);
  const [editLang, setEditLang] = useState<'id' | 'en'>(currentLang);
  const [editorMode, setEditorMode] = useState<'id' | 'en' | 'assets' | 'social'>('id');
  const [assetTab, setAssetTab] = useState<
    'templates' | 'bg_patterns' | 'floating_assets' | 'bg_shadows' | 'bg_colors' | 'images' | 'idcard' | 'gooey_cursor'
  >('templates');
  const [activeBgSection, setActiveBgSection] = useState<string>('home');
  const [activeDeviceMode, setActiveDeviceMode] = useState<'desktop' | 'mobile'>(() => {
    if (previewDevice === 'mobile') return 'mobile';
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 'mobile';
    return 'desktop';
  });
  const [appliedAllNotice, setAppliedAllNotice] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (previewDevice && previewDevice !== activeDeviceMode) {
      setActiveDeviceMode(previewDevice);
    }
  }, [previewDevice]);

  const handleSetDeviceMode = (device: 'desktop' | 'mobile') => {
    setActiveDeviceMode(device);
    if (onTogglePreviewDevice) {
      onTogglePreviewDevice(device);
    }
  };

  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeTab, setActiveTab] = useState<string>('auto');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showMarkdownGuide, setShowMarkdownGuide] = useState<boolean>(false);

  // Social Media & CV Studio State
  const [socialCvSubTab, setSocialCvSubTab] = useState<'socials' | 'methodology_cv' | 'cv_layout'>('socials');
  const [methodologyTranslateModalOpen, setMethodologyTranslateModalOpen] = useState<boolean>(false);

  // AI Assistant Modal State
  const [aiModalState, setAiModalState] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    currentValue: string;
    targetLang: 'id' | 'en';
    onApply: (text: string) => void;
    contextHint?: string;
  }>({
    isOpen: false,
    fieldLabel: '',
    currentValue: '',
    targetLang: 'id',
    onApply: () => {},
  });

  // Dedicated Per-Job AI Assistant Modal State
  const [jobAiModalState, setJobAiModalState] = useState<{
    isOpen: boolean;
    experienceBaseId: string;
    role: string;
    company: string;
    existingBullets: string[];
  }>({
    isOpen: false,
    experienceBaseId: '',
    role: '',
    company: '',
    existingBullets: [],
  });

  // Dedicated Per-Job AI Language Transfer Modal State
  const [expTranslateModalState, setExpTranslateModalState] = useState<{
    isOpen: boolean;
    experienceBaseId: string;
    sourceLang: 'id' | 'en';
    sourceData: {
      role: string;
      company: string;
      period: string;
      bulletPoints: string[];
    };
  }>({
    isOpen: false,
    experienceBaseId: '',
    sourceLang: 'id',
    sourceData: {
      role: '',
      company: '',
      period: '',
      bulletPoints: [],
    },
  });

  const handleApplyExperienceTranslation = (
    translatedData: { role: string; company: string; period: string; bulletPoints: string[] },
    targetLang: 'id' | 'en'
  ) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === expTranslateModalState.experienceBaseId) {
          return {
            ...pair,
            [targetLang]: {
              ...(pair[targetLang] as Experience),
              role: translatedData.role,
              company: translatedData.company,
              period: translatedData.period,
              bulletPoints: translatedData.bulletPoints,
            },
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList,
      };
    });
  };

  // Subpage Items AI Translation Modal State
  const [subpageTranslateModalState, setSubpageTranslateModalState] = useState<{
    isOpen: boolean;
    baseId: string;
    listKey: keyof CVData;
    sourceLang: 'id' | 'en';
    itemType: 'personality' | 'hobby' | 'career_goal' | 'education' | 'story_slide' | 'generic';
    sourceData: {
      title: string;
      description: string;
    };
    labels?: {
      itemTypeName?: string;
      titleLabel?: string;
      descriptionLabel?: string;
    };
  }>({
    isOpen: false,
    baseId: '',
    listKey: 'personality',
    sourceLang: 'id',
    itemType: 'personality',
    sourceData: {
      title: '',
      description: '',
    },
  });

  const handleApplySubpageTranslation = (
    translatedData: { title: string; description: string },
    targetLang: 'id' | 'en'
  ) => {
    const { listKey, baseId } = subpageTranslateModalState;
    if (listKey === 'educationSections') {
      updateBilingualItem('educationSections', baseId, targetLang, 'title', translatedData.title);
      updateBilingualItem('educationSections', baseId, targetLang, 'content', translatedData.description);
    } else {
      updateBilingualItem(listKey, baseId, targetLang, 'title', translatedData.title);
      updateBilingualItem(listKey, baseId, targetLang, 'description', translatedData.description);
    }
  };

  const handleApplyMethodologyTranslation = (
    translatedData: { title: string; description: string },
    targetLang: 'id' | 'en'
  ) => {
    handleUpdate((prev) => {
      const nextTexts = { ...(prev.webTexts || {}) };
      nextTexts[`methodologyTitle_${targetLang}`] = translatedData.title;
      nextTexts[`methodologyText_${targetLang}`] = translatedData.description;
      if (editLang === targetLang) {
        nextTexts.methodologyTitle = translatedData.title;
        nextTexts.methodologyText = translatedData.description;
      }
      return {
        ...prev,
        methodologyTitle:
          editLang === targetLang ? translatedData.title : prev.methodologyTitle || translatedData.title,
        methodologyText:
          editLang === targetLang ? translatedData.description : prev.methodologyText || translatedData.description,
        webTexts: nextTexts,
      };
    });
  };

  const openAiAssistant = (
    fieldLabel: string,
    currentValue: string,
    onApply: (text: string) => void,
    targetLang: 'id' | 'en' = editLang,
    contextHint?: string
  ) => {
    setAiModalState({
      isOpen: true,
      fieldLabel,
      currentValue,
      targetLang,
      onApply,
      contextHint,
    });
  };

  const renderAiButton = (
    fieldLabel: string,
    currentValue: string,
    onApply: (text: string) => void,
    contextHint?: string
  ) => (
    <button
      type="button"
      onClick={() => openAiAssistant(fieldLabel, currentValue, onApply, editLang, contextHint)}
      title={`AI Writing Assistant: Tingkatkan ${fieldLabel}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-purple-600/25 via-indigo-600/25 to-violet-600/25 hover:from-purple-600/40 hover:to-indigo-600/40 text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-400/60 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
      <span>✨ AI Enhance</span>
    </button>
  );

  // Floating Pop-out Window States & Dragging Handler
  const [isFloating, setIsFloating] = useState<boolean>(false);
  const [isMinimizedFloating, setIsMinimizedFloating] = useState<boolean>(false);
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({
    x: 0,
    y: 0,
    posX: 40,
    posY: 30,
  });

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!isFloating) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea')
    ) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: floatingPos.x,
      posY: floatingPos.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setFloatingPos({
        x: Math.max(10, Math.min(window.innerWidth - 280, dragStartRef.current.posX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 60, dragStartRef.current.posY + dy)),
      });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const localDataRef = useRef<CVData>(cvData);
  useEffect(() => {
    localDataRef.current = cvData;
    setLocalData(cvData);
  }, [cvData]);

  useEffect(() => {
    if (isOpen) {
      setEditLang(currentLang);
      if (editorMode !== 'assets') {
        setEditorMode(currentLang);
      }
    }
  }, [isOpen, currentLang]);

  // Context detection based on current route/page
  const getDetectedCategory = (): string => {
    if (activeProjectPresentationId) return 'projects';
    if (aboutSubPage) {
      if (aboutSubPage === 'education') return 'subpage_education';
      if (aboutSubPage === 'projects') return 'subpage_projects';
      if (aboutSubPage === 'experiences' || aboutSubPage === 'career-journey') return 'subpage_career_journey';
      if (aboutSubPage === 'personality') return 'subpage_personality';
      if (aboutSubPage === 'hobbies') return 'subpage_hobbies';
      if (aboutSubPage === 'career-goals') return 'subpage_career_goals';
      if (aboutSubPage === 'skills') return 'skills';
      return `subpage_${aboutSubPage}`;
    }
    if (isStoryView) return 'about_story';
    if (activeSection === 'projects') return 'projects';
    if (activeSection === 'skills') return 'skills';
    if (activeSection === 'experience') return 'experiences';
    if (activeSection === 'contact') return 'contact';
    return 'hero';
  };

  const detectedCategory = getDetectedCategory();
  const currentCategory = activeTab === 'auto' ? detectedCategory : activeTab;

  const getBgSectionForCategory = (cat: string): string => {
    if (cat.startsWith('subpage_')) {
      if (['subpage_education', 'subpage_personality', 'subpage_hobbies', 'subpage_career_goals'].includes(cat)) {
        return cat.replace('subpage_', 'about_subpage_');
      }
      return cat;
    }
    switch (cat) {
      case 'subpage_career_journey':
      case 'experiences':
        return 'experience';
      case 'subpage_projects':
      case 'projects':
        return 'projects';
      case 'about_story':
        return 'about_story';
      case 'skills':
        return 'skills';
      case 'contact':
        return 'contact';
      case 'hero':
      default:
        return 'home';
    }
  };

  useEffect(() => {
    const targetCat = activeTab === 'auto' ? detectedCategory : activeTab;
    setActiveBgSection(getBgSectionForCategory(targetCat));
  }, [detectedCategory, activeTab, isOpen]);

  const handleUpdate = (updater: (prev: CVData) => CVData) => {
    const updated = updater(localDataRef.current);
    localDataRef.current = updated;
    setLocalData(updated);
    onUpdateCV(updated);
  };

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: keyof CVData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await uploadFileToStorage(file);
      handleUpdate((prev) => ({ ...prev, [targetField]: base64 }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleWebTextImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await uploadFileToStorage(file);
      handleWebTextChange(targetKey, base64, editLang);
    } catch (err) {
      console.error(err);
    }
  };

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

  const getSubpageSections = (pageKey: string) => {
    const rawList = localData.educationSections || [];
    const prefix = `${pageKey}-`;
    const filtered = rawList.filter((item) => {
      const strId = String(item.id || '');
      return strId.startsWith(prefix) || item.pageId === pageKey;
    });

    return getBilingualPairs(filtered);
  };

  const handleAddSubpageSection = (pageKey: string) => {
    const newBaseId = `${pageKey}-sec-${Date.now()}`;
    const newEnItem = {
      id: `${newBaseId}-en`,
      pageId: pageKey,
      title: 'New Section Block',
      content: 'Write detailed content for this section...',
      order: 99,
    };
    const newIdItem = {
      id: `${newBaseId}-id`,
      pageId: pageKey,
      title: 'Blok Seksi Baru',
      content: 'Tuliskan rincian konten untuk seksi ini...',
      order: 99,
    };

    handleUpdate((prev) => ({
      ...prev,
      educationSections: [...(prev.educationSections || []), newEnItem, newIdItem],
    }));
  };

  const handleRemoveSubpageSection = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.educationSections || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return {
        ...prev,
        educationSections: filtered,
      };
    });
  };

  const bilingualEducation = getBilingualPairs<EducationItem>(localData.education);
  const bilingualProjects = getBilingualPairs<CaseStudy>(localData.caseStudies);
  const bilingualExperiences = getBilingualPairs<Experience>(localData.experiences);
  const bilingualPersonality = getBilingualPairs<PersonalityItem>(localData.personality);
  const bilingualHobbies = getBilingualPairs<HobbyItem>(localData.hobbies);
  const bilingualCareerGoals = getBilingualPairs<CareerGoalItem>(localData.careerGoals);

  const handleAddEdu = () => {
    const newBaseId = `edu-${Date.now()}`;
    const newEn: EducationItem = {
      id: `${newBaseId}-en`,
      degree: 'Bachelor of Science',
      institution: 'University Name',
      period: '2020 - 2024',
      description: 'Major and achievements description...',
    };
    const newId: EducationItem = {
      id: `${newBaseId}-id`,
      degree: 'Sarjana Sains',
      institution: 'Nama Universitas',
      period: '2020 - 2024',
      description: 'Deskripsi jurusan dan capaian akademik...',
    };

    handleUpdate((prev) => ({
      ...prev,
      education: [...(prev.education || []), newEn, newId],
    }));
  };

  const handleRemoveEdu = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.education || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return {
        ...prev,
        education: filtered,
      };
    });
  };

  const handleAddExperience = () => {
    const newBaseId = `exp-${Date.now()}`;
    const newEn: Experience = {
      id: `${newBaseId}-en`,
      role: 'Job Role / Title',
      company: 'Company / Organization',
      period: 'Jan 2023 - Present',
      bulletPoints: ['Spearheaded strategic data initiatives.', 'Optimized workflow performance by 35%.'],
    };
    const newId: Experience = {
      id: `${newBaseId}-id`,
      role: 'Posisi / Jabatan',
      company: 'Nama Perusahaan / Organisasi',
      period: 'Jan 2023 - Sekarang',
      bulletPoints: ['Memimpin inisiatif data strategis.', 'Mengoptimalkan performa alur kerja hingga 35%.'],
    };

    handleUpdate((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newEn, newId],
    }));
  };

  const handleUpdateExperienceDates = (baseId: string, updates: any) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const updatedEn = { ...pair.en, ...updates };
          const updatedId = { ...pair.id, ...updates };
          return { ...pair, en: updatedEn, id: updatedId };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleManualExperiencePeriodChange = (baseId: string, text: string) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          return {
            ...pair,
            [editLang]: {
              ...pair[editLang],
              period: text,
            },
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleMoveExperience = (baseId: string, direction: 'up' | 'down') => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const idx = pairs.findIndex((p) => p.baseId === baseId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === pairs.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const updatedPairs = [...pairs];
      const temp = updatedPairs[idx];
      updatedPairs[idx] = updatedPairs[targetIdx];
      updatedPairs[targetIdx] = temp;

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleRemoveExperience = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.experiences || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, experiences: filtered };
    });
  };

  const handleDuplicateExperience = (baseId: string) => {
    const pair = bilingualExperiences.find((p) => p.baseId === baseId);
    if (!pair) return;
    const newBaseId = `exp-${Date.now()}`;
    const dupEn: Experience = {
      ...pair.en,
      id: `${newBaseId}-en`,
      role: `${pair.en.role} (Copy)`,
    };
    const dupId: Experience = {
      ...pair.id,
      id: `${newBaseId}-id`,
      role: `${pair.id.role} (Salinan)`,
    };

    handleUpdate((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), dupEn, dupId],
    }));
  };

  const handleAddBulletPoint = (baseId: string, targetLang: 'id' | 'en') => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const currentBullets = pair[targetLang].bulletPoints || [];
          return {
            ...pair,
            [targetLang]: {
              ...pair[targetLang],
              bulletPoints: [...currentBullets, 'Poin pencapaian baru...'],
            },
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleUpdateBulletPoint = (
    baseId: string,
    targetLang: 'id' | 'en',
    bulletIndex: number,
    text: string
  ) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const currentBullets = [...(pair[targetLang].bulletPoints || [])];
          currentBullets[bulletIndex] = text;
          return {
            ...pair,
            [targetLang]: {
              ...pair[targetLang],
              bulletPoints: currentBullets,
            },
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleRemoveBulletPoint = (
    baseId: string,
    targetLang: 'id' | 'en',
    bulletIndex: number
  ) => {
    handleUpdate((prev) => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs<Experience>(currentList);
      const updatedPairs = pairs.map((pair) => {
        if (pair.baseId === baseId) {
          const currentBullets = (pair[targetLang].bulletPoints || []).filter((_, i) => i !== bulletIndex);
          return {
            ...pair,
            [targetLang]: {
              ...pair[targetLang],
              bulletPoints: currentBullets,
            },
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach((p) => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return { ...prev, experiences: flatList };
    });
  };

  const handleAddPersonality = () => {
    const newBaseId = `pers-${Date.now()}`;
    const newEn: PersonalityItem = {
      id: `${newBaseId}-en`,
      title: 'Analytical Thinker',
      description: 'Strong foundation in critical analysis.',
      icon: '🧠',
    };
    const newId: PersonalityItem = {
      id: `${newBaseId}-id`,
      title: 'Pemikir Analitis',
      description: 'Pondasi kuat dalam analisa kritis.',
      icon: '🧠',
    };

    handleUpdate((prev) => ({
      ...prev,
      personality: [...(prev.personality || []), newEn, newId],
    }));
  };

  const handleRemovePersonality = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.personality || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, personality: filtered };
    });
  };

  const handleAddHobby = () => {
    const newBaseId = `hobby-${Date.now()}`;
    const newEn: HobbyItem = {
      id: `${newBaseId}-en`,
      title: 'Photography & Exploration',
      description: 'Capturing moments and exploring landscapes.',
      icon: '📷',
    };
    const newId: HobbyItem = {
      id: `${newBaseId}-id`,
      title: 'Fotografi & Eksplorasi',
      description: 'Mengabadikan momen dan menjelajah alam.',
      icon: '📷',
    };

    handleUpdate((prev) => ({
      ...prev,
      hobbies: [...(prev.hobbies || []), newEn, newId],
    }));
  };

  const handleRemoveHobby = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.hobbies || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, hobbies: filtered };
    });
  };

  const handleAddCareerGoal = () => {
    const newBaseId = `goal-${Date.now()}`;
    const newEn: CareerGoalItem = {
      id: `${newBaseId}-en`,
      title: 'Strategic Leadership Target',
      description: 'Directing impactful technological solutions.',
    };
    const newId: CareerGoalItem = {
      id: `${newBaseId}-id`,
      title: 'Target Kepemimpinan Strategis',
      description: 'Mengarahkan solusi teknologi berbobot tinggi.',
    };

    handleUpdate((prev) => ({
      ...prev,
      careerGoals: [...(prev.careerGoals || []), newEn, newId],
    }));
  };

  const handleRemoveCareerGoal = (baseId: string) => {
    handleUpdate((prev) => {
      const filtered = (prev.careerGoals || []).filter((item) => {
        const strId = String(item.id || '');
        return strId !== baseId && strId !== `${baseId}-en` && strId !== `${baseId}-id`;
      });
      return { ...prev, careerGoals: filtered };
    });
  };

  const handleAddCustomSubPage = () => {
    const id = `page-${Date.now()}`;
    const newPage: CustomSubPage = {
      id,
      title: 'Halaman Kustom Baru',
      titleId: 'Halaman Kustom Baru',
      titleEn: 'New Custom Page',
      descriptionId: 'Tuliskan deskripsi subhalaman kustom Anda di sini.',
      descriptionEn: 'Write your custom subpage description here.',
      icon: 'Sparkles',
      order: (localData.customSubPages || []).length + 1,
      sections: [],
    };
    handleUpdate((prev) => ({
      ...prev,
      customSubPages: [...(prev.customSubPages || []), newPage],
    }));
  };

  const handleRemoveCustomSubPage = (pageId: string) => {
    handleUpdate((prev) => ({
      ...prev,
      customSubPages: (prev.customSubPages || []).filter((p) => p.id !== pageId),
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

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      saveCVData(localData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus('idle');
    }
  };

  const inputClass = `w-full text-xs font-medium px-3 py-2 rounded-lg border outline-none transition-all ${
    isDark
      ? 'bg-slate-800/90 border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-800 placeholder-slate-400'
  }`;

  const textareaClass = `w-full text-xs font-medium px-3 py-2 rounded-lg border outline-none transition-all resize-y leading-relaxed ${
    isDark
      ? 'bg-slate-800/90 border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-800 placeholder-slate-400'
  }`;

  const cardBg = isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={isFloating ? { opacity: 0, scale: 0.95 } : { opacity: 0, x: 420 }}
          animate={isFloating ? { opacity: 1, scale: 1 } : { opacity: 1, x: 0 }}
          exit={isFloating ? { opacity: 0, scale: 0.95 } : { opacity: 0, x: 440 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={
            isFloating
              ? {
                  position: 'fixed',
                  top: `${floatingPos.y}px`,
                  left: `${floatingPos.x}px`,
                  width: isMinimizedFloating ? '340px' : isExpanded ? '720px' : '520px',
                  maxHeight: isMinimizedFloating ? '56px' : '88vh',
                  height: isMinimizedFloating ? '56px' : '720px',
                  zIndex: 100,
                }
              : undefined
          }
          className={`${
            isFloating
              ? 'fixed z-[100] shadow-2xl rounded-2xl border flex flex-col backdrop-blur-2xl transition-all duration-200 overflow-hidden ring-2 ring-emerald-500/40 shadow-emerald-950/60'
              : `fixed top-0 right-0 h-full z-[100] shadow-2xl flex flex-col border-l backdrop-blur-xl transition-all duration-200 ${
                  isExpanded ? 'w-full md:w-[720px]' : 'w-full sm:w-[480px]'
                }`
          } ${isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'}`}
        >
          {/* 1. TOP DRAWER / FLOATING HEADER */}
          <div
            onMouseDown={handleHeaderMouseDown}
            className={`p-3.5 border-b flex items-center justify-between gap-2.5 transition-colors select-none ${
              isFloating
                ? 'cursor-grab active:cursor-grabbing bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-purple-950/40 border-emerald-500/30'
                : ''
            } ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {isFloating ? (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 cursor-grab">
                  <GripHorizontal className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold shrink-0">
                  <Pencil className="w-4 h-4" />
                </div>
              )}
              <div className="truncate">
                <h3 className="font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                  <span className="truncate">{isFloating ? 'Quick Editor (Floating)' : 'Visual Quick Editor'}</span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                    {isFloating ? 'Pop-out' : 'Live Sync'}
                  </span>
                </h3>
                <p className="text-[10.5px] text-slate-400 truncate hidden xs:block">
                  {isFloating ? 'Geser header untuk memindahkan window' : 'Edit tulisan & lembar halaman aktif'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* BUTTON: DOCK TO SIDEBAR vs POP-OUT FLOATING */}
              {isFloating ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsFloating(false);
                    setIsMinimizedFloating(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  title="Gabung kembali ke Sidebar Kanan (Dock)"
                >
                  <Dock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Gabung Sidebar</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsFloating(true);
                    setFloatingPos({
                      x: Math.max(20, window.innerWidth - 560),
                      y: 40,
                    });
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                    isDark
                      ? 'border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300'
                      : 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                  title="Pisahkan Editor menjadi Pop-out Floating Window di atas halaman"
                >
                  <PictureInPicture2 className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Pisahkan Window</span>
                </button>
              )}

              {/* MINIMIZE FLOATING BUTTON */}
              {isFloating && (
                <button
                  type="button"
                  onClick={() => setIsMinimizedFloating(!isMinimizedFloating)}
                  className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                    isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                  }`}
                  title={isMinimizedFloating ? 'Restore Window Editor' : 'Minimize Window Editor'}
                >
                  {isMinimizedFloating ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 animate-bounce" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Reset to Default TS Data button */}
              {!isMinimizedFloating && (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className={`px-2 py-1.5 rounded-lg border text-amber-400 hover:text-amber-300 hover:border-amber-500/50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                    isDark
                      ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                      : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800'
                  }`}
                  title="Reset seluruh editan ke data asli template (portfolioData.ts)"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden md:inline">Reset Asli</span>
                </button>
              )}

              {/* EXPAND DRAWER BUTTON */}
              {!isMinimizedFloating && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`hidden sm:flex p-1.5 rounded-lg border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                    isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                  }`}
                  title={isExpanded ? 'Perkecil Editor' : 'Perlebar Editor'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                  isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                }`}
                title="Tutup Quick Editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reset Confirmation Overlay Modal */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className={`max-w-md w-full p-5 rounded-2xl border shadow-2xl ${
                    isDark ? 'bg-slate-900 border-amber-500/40 text-slate-100' : 'bg-white border-amber-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                      <RotateCcw className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-amber-400">
                        {editLang === 'id'
                          ? 'Reset ke Data Asli (portfolioData.ts)?'
                          : 'Reset to Original Data (portfolioData.ts)?'}
                      </h4>
                      <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed">
                        {editLang === 'id'
                          ? 'Perhatian: Seluruh editan draft lokal yang tersimpan di browser ini akan dihapus dan dikembalikan persis sesuai data bawaan asli di portfolioData.ts.'
                          : 'Warning: All local drafts stored in this browser will be cleared and reset to match the pristine template in portfolioData.ts.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-5">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {editLang === 'id' ? 'Batal' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const freshData = resetCVDataToDefault();
                        setLocalData(freshData);
                        onUpdateCV(freshData);
                        setShowResetConfirm(false);
                        setResetNotice(
                          editLang === 'id'
                            ? 'Data berhasil di-reset ke versi asli portfolioData.ts!'
                            : 'Data successfully reset to original template data!'
                        );
                        setTimeout(() => setResetNotice(null), 4000);
                      }}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{editLang === 'id' ? 'Ya, Reset Data' : 'Yes, Reset Data'}</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset Notice Toast */}
          <AnimatePresence>
            {resetNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-4 mt-2 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resetNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. BILINGUAL LANGUAGE SWITCHER & ASSETS STUDIO TOGGLE */}
          {!isMinimizedFloating && (
            <>
              <div
                className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
                  isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70'
                }`}
              >
                {/* 4-Way Mode Selector: ID | EN | Aset & Desain | Media Sosial */}
                <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-inner overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setEditLang('id');
                      setEditorMode('id');
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      editorMode === 'id'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Edit Tulisan & Konten Bahasa Indonesia"
                  >
                    <span>🇮🇩</span>
                    <span className="hidden sm:inline">Bahasa</span> ID
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditLang('en');
                      setEditorMode('en');
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      editorMode === 'en'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Edit Texts & Content in English"
                  >
                    <span>🇬🇧</span>
                    <span className="hidden sm:inline">English</span> EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('assets')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      editorMode === 'assets'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
                    }`}
                    title="Atur Gambar, Background SVG, Warna & Visual Aset"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>Aset &amp; Desain</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('social')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      editorMode === 'social'
                        ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-sky-400/50'
                        : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300'
                    }`}
                    title="Atur Medsos, Kontak Utama, dan Pengaturan CV (Core Methodology)"
                  >
                    <Share2 className="w-3.5 h-3.5 text-sky-300" />
                    <span>Medsos &amp; CV</span>
                  </button>
                </div>

                {/* Context / Sub-Tab Selector based on active Mode */}
                {editorMode === 'social' ? (
                  <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setSocialCvSubTab('socials')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        socialCvSubTab === 'socials'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Kelola Akun Media Sosial & Kontak"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Medsos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialCvSubTab('methodology_cv')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        socialCvSubTab === 'methodology_cv'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Pengaturan Tulisan Core Methodology & AI Transfer Bahasa"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Methodology</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialCvSubTab('cv_layout')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        socialCvSubTab === 'cv_layout'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Pengaturan Tata Letak Kolom Skill, Header, & Foto Profil CV"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Layout CV</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {editorMode === 'assets' ? 'Aset Halaman:' : 'Bagian:'}
                    </span>
                    <select
                      value={editorMode === 'assets' ? activeBgSection : activeTab}
                      onChange={(e) => {
                        if (editorMode === 'assets') {
                          setActiveBgSection(e.target.value);
                        } else {
                          setActiveTab(e.target.value);
                        }
                      }}
                      className={`text-[11px] font-bold rounded-md px-2 py-1 border outline-none cursor-pointer ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-200'
                          : 'bg-white border-slate-300 text-slate-700'
                      }`}
                    >
                      {editorMode === 'assets' ? (
                        <>
                          <option value={getBgSectionForCategory(detectedCategory)}>
                            ✨ Otomatis ({detectedCategory.replace('subpage_', 'Page ').replace('_', ' ').toUpperCase()})
                          </option>
                          <optgroup label="── Aset Halaman Sub-Pages ──">
                            <option value="about_subpage_education">🎓 Pendidikan (Education)</option>
                            <option value="about_subpage_personality">💎 Kepribadian (Personality)</option>
                            <option value="about_subpage_hobbies">🎨 Hobi &amp; Minat (Hobbies)</option>
                            <option value="about_subpage_career_goals">🚀 Target Karir (Career Goals)</option>
                            <option value="experience">💼 Perjalanan Karir (Journey)</option>
                            <option value="projects">📂 Projek &amp; Studi Kasus</option>
                          </optgroup>
                          <optgroup label="── Aset Bagian Web Utama ──">
                            <option value="home">🏠 Hero / Home / Beranda</option>
                            <option value="about_story">📖 Kisah Saya (About Story)</option>
                            <option value="skills">⚡ Skills &amp; Arsenal</option>
                            <option value="contact">✉️ Kontak &amp; Footer</option>
                          </optgroup>
                        </>
                      ) : (
                        <>
                          <option value="auto">✨ Otomatis ({detectedCategory})</option>
                          <optgroup label="── Halaman Sub-Pages (Pages) ──">
                            <option value="subpage_education">🎓 Halaman: Pendidikan (Education)</option>
                            <option value="subpage_personality">💎 Halaman: Kepribadian (Personality)</option>
                            <option value="subpage_hobbies">🎨 Halaman: Hobi &amp; Minat (Hobbies)</option>
                            <option value="subpage_career_goals">🚀 Halaman: Target Karir (Career Goals)</option>
                            <option value="subpage_career_journey">💼 Halaman: Perjalanan Karir (Journey)</option>
                            <option value="subpage_projects">📂 Halaman: Projek &amp; Studi Kasus</option>
                            {(localData.customSubPages || []).map((page) => (
                              <option key={page.id} value={`subpage_${page.id}`}>
                                ✨ Halaman: {(editLang === 'id' ? page.title : page.titleEn) || page.title || page.id}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="── Bagian Web Utama ──">
                            <option value="hero">🏠 Section: Hero / Home</option>
                            <option value="about_story">📖 Section: Story / About Me</option>
                            <option value="skills">⚡ Section: Technical Arsenal</option>
                            <option value="projects">📂 Section: Case Studies</option>
                            <option value="experiences">💼 Section: Experiences</option>
                            <option value="contact">✉️ Section: Contact</option>
                            <option value="general_identity">👤 Profil / Identitas</option>
                          </optgroup>
                        </>
                      )}
                    </select>
                  </div>
                )}
              </div>

              {/* 2.5 SUB-ASSET CATEGORY BAR WHEN IN ASSETS MODE */}
              {editorMode === 'assets' && (
                <div
                  className={`px-4 py-2 border-b flex items-center justify-between gap-2 text-xs ${
                    isDark ? 'border-purple-500/20 bg-purple-950/20' : 'border-purple-200 bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kategori Aset:</span>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setAssetTab('templates')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'templates'
                          ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-sm ring-1 ring-rose-400/50'
                          : 'text-rose-400 hover:text-rose-200 bg-rose-950/30'
                      }`}
                    >
                      <span>🎴 Template &amp; Preset</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTab('bg_patterns')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'bg_patterns'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🌊 Pola Background</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTab('floating_assets')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'floating_assets'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                          : 'text-emerald-400 hover:text-emerald-200 bg-emerald-950/30'
                      }`}
                    >
                      <span>🕊️ Aset Melayang (SVG/Ornamen)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTab('bg_shadows')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'bg_shadows'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🌓 Bayangan Gradasi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTab('images')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'images'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🖼️ Gambar &amp; Banner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTab('bg_colors')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'bg_colors'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🎨 Warna Tema</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTab('idcard')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'idcard'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🪪 ID Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTab('gooey_cursor')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        assetTab === 'gooey_cursor'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                          : 'text-emerald-400 hover:text-emerald-200 bg-emerald-950/30'
                      }`}
                    >
                      <span>✨ Gooey Cursor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. MAIN EDITING FORM BODY */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                {/* ASSETS & DESIGN MODE */}
                {editorMode === 'assets' && (
                  <div className="space-y-6">
                    {assetTab === 'templates' && (
                      <ThemeTemplateStudio
                        cvData={localData}
                        activeSection={activeBgSection}
                        isDark={isDark}
                        onApplyTheme={handleApplyThemeTemplate}
                        onApplyLayout={handleApplyLayoutTemplate}
                        onApplyFullZenPreset={handleApplyFullZenPreset}
                        onAddSingleAsset={handleAddSingleAsset}
                      />
                    )}
                    {assetTab === 'bg_patterns' && (
                      <BackgroundPatternPanel
                        localData={localData}
                        activeBgSection={activeBgSection}
                        setActiveBgSection={setActiveBgSection}
                        handleApplyBgPatternToAll={handleApplyBgPatternToAll}
                        appliedAllNotice={appliedAllNotice}
                        handleWebTextChange={handleWebTextChange}
                        editLang={editLang}
                        isDark={isDark}
                        cardBg={cardBg}
                        theme={theme}
                      />
                    )}
                    {assetTab === 'floating_assets' && (
                      <FloatingAssetsPanel
                        localData={localData}
                        activeDeviceMode={activeDeviceMode}
                        handleSetDeviceMode={handleSetDeviceMode}
                        handleAddFloatingAsset={handleAddFloatingAsset}
                        handleUpdateFloatingAsset={handleUpdateFloatingAsset}
                        handleRemoveFloatingAsset={handleRemoveFloatingAsset}
                        handleCopyFromDesktop={handleCopyFromDesktop}
                        uploadFileToStorage={uploadFileToStorage}
                        cardBg={cardBg}
                        inputClass={inputClass}
                      />
                    )}
                    {assetTab === 'bg_colors' && (
                      <ThemeColorsPanel
                        localData={localData}
                        activeBgSection={activeBgSection}
                        setActiveBgSection={setActiveBgSection}
                        handleUpdate={handleUpdate}
                        handleWebTextChange={handleWebTextChange}
                        appliedAllNotice={appliedAllNotice}
                        setAppliedAllNotice={setAppliedAllNotice}
                        editLang={editLang}
                        isDark={isDark}
                        cardBg={cardBg}
                        inputClass={inputClass}
                      />
                    )}
                    {assetTab === 'bg_shadows' && (
                      <ThemeShadowsPanel
                        localData={localData}
                        activeBgSection={activeBgSection}
                        setActiveBgSection={setActiveBgSection}
                        handleUpdate={handleUpdate}
                        handleWebTextChange={handleWebTextChange}
                        appliedAllNotice={appliedAllNotice}
                        setAppliedAllNotice={setAppliedAllNotice}
                        editLang={editLang}
                        cardBg={cardBg}
                        inputClass={inputClass}
                      />
                    )}
                    {assetTab === 'images' && (
                      <ImagesBannersPanel
                        localData={localData}
                        activeBgSection={activeBgSection}
                        setActiveBgSection={setActiveBgSection}
                        handleUpdate={handleUpdate}
                        handleWebTextChange={handleWebTextChange}
                        handleWebTextImageUpload={handleWebTextImageUpload}
                        handleImageFileUpload={handleImageFileUpload}
                        uploadFileToStorage={uploadFileToStorage}
                        setEditorMode={setEditorMode}
                        setActiveTab={setActiveTab}
                        setAssetTab={setAssetTab}
                        editLang={editLang}
                        isDark={isDark}
                        cardBg={cardBg}
                        inputClass={inputClass}
                      />
                    )}
                    {assetTab === 'idcard' && (
                      <IdCardPhysicsPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        cardBg={cardBg}
                        inputClass={inputClass}
                      />
                    )}
                    {assetTab === 'gooey_cursor' && (
                      <GooeyCursorPanel
                        localData={localData}
                        handleWebTextChange={handleWebTextChange}
                        editLang={editLang}
                        cardBg={cardBg}
                        renderColorControls={renderColorControls}
                      />
                    )}
                  </div>
                )}

                {/* MEDSOS & CV STUDIO */}
                {editorMode === 'social' && (
                  <div className="space-y-6">
                    {socialCvSubTab === 'socials' && (
                      <SocialLinksPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        cardBg={cardBg}
                        inputClass={inputClass}
                        isDark={isDark}
                      />
                    )}
                    {socialCvSubTab === 'methodology_cv' && (
                      <CvMethodologyPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        editLang={editLang}
                        cardBg={cardBg}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        setMethodologyTranslateModalOpen={setMethodologyTranslateModalOpen}
                      />
                    )}
                    {socialCvSubTab === 'cv_layout' && (
                      <CvLayoutEditorPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        cardBg={cardBg}
                        isDark={isDark}
                      />
                    )}
                  </div>
                )}

                {/* TEXT EDITING MODE (INDONESIAN OR ENGLISH) */}
                {(editorMode === 'id' || editorMode === 'en') && (
                  <>
                    {/* Collapsible Markdown Syntax Helper */}
                    <div
                      className={`mb-4 rounded-xl border transition-all ${
                        isDark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setShowMarkdownGuide(!showMarkdownGuide)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-bold cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                          <span className={isDark ? 'text-indigo-300' : 'text-indigo-900'}>
                            {editLang === 'id'
                              ? '📝 Format Markdown Didukung (Bold, Link, Heading, List, dll)'
                              : '📝 Supported Markdown Syntax (Bold, Links, Headings, Lists, etc.)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <span>
                            {showMarkdownGuide
                              ? editLang === 'id'
                                ? 'Tutup'
                                : 'Hide'
                              : editLang === 'id'
                              ? 'Lihat Contoh'
                              : 'Show Guide'}
                          </span>
                          {showMarkdownGuide ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </button>

                      {showMarkdownGuide && (
                        <div
                          className={`px-3.5 pb-3.5 pt-1 text-[11px] space-y-2 border-t ${
                            isDark ? 'border-indigo-500/20 text-slate-300' : 'border-indigo-100 text-slate-700'
                          }`}
                        >
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {editLang === 'id'
                              ? 'Anda dapat menulis teks bergaya kaya pada deskripsi Home, Poin Pengalaman Kerja, Detail Proyek, dan CV menggunakan sintaks berikut:'
                              : 'You can write rich styled text across Home descriptions, Experience bullets, Project details, and CV using these syntax markers:'}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10.5px]">
                            <div
                              className={`p-2 rounded-lg border ${
                                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className="text-emerald-400 font-bold block mb-0.5">**Teks Tebal (Bold)**</span>
                              <span className="text-slate-400">**Kata Kunci** → </span>
                              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Kata Kunci</strong>
                            </div>
                            <div
                              className={`p-2 rounded-lg border ${
                                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className="text-teal-400 font-bold block mb-0.5">*Teks Miring (Italic)*</span>
                              <span className="text-slate-400">*Catatan Penting* → </span>
                              <em className={isDark ? 'text-white' : 'text-slate-900'}>Catatan Penting</em>
                            </div>
                            <div
                              className={`p-2 rounded-lg border ${
                                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className="text-blue-400 font-bold block mb-0.5">[Teks Link](https://...)</span>
                              <span className="text-slate-400">[Lihat Demo](https://...) → </span>
                              <span className="text-blue-500 underline font-sans">Lihat Demo ↗</span>
                            </div>
                            <div
                              className={`p-2 rounded-lg border ${
                                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className="text-amber-400 font-bold block mb-0.5">`Kode Singkat`</span>
                              <span className="text-slate-400">`npm install` → </span>
                              <code className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">
                                npm install
                              </code>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Routing to Domain Content Panels */}
                    {currentCategory.startsWith('subpage_') && (
                      <SubpagesEditorPanel
                        currentCategory={currentCategory}
                        localData={localData}
                        handleUpdate={handleUpdate}
                        editLang={editLang}
                        getWebText={getWebText}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        cardBg={cardBg}
                        isDark={isDark}
                        theme={theme}
                        getSubpageSections={getSubpageSections}
                        handleAddSubpageSection={handleAddSubpageSection}
                        handleRemoveSubpageSection={handleRemoveSubpageSection}
                        bilingualEducation={bilingualEducation}
                        bilingualPersonality={bilingualPersonality}
                        bilingualHobbies={bilingualHobbies}
                        bilingualCareerGoals={bilingualCareerGoals}
                        updateBilingualItem={updateBilingualItem}
                        handleAddEducation={handleAddEdu}
                        handleRemoveEducation={handleRemoveEdu}
                        handleAddPersonality={handleAddPersonality}
                        handleRemovePersonality={handleRemovePersonality}
                        handleAddHobby={handleAddHobby}
                        handleRemoveHobby={handleRemoveHobby}
                        handleAddCareerGoal={handleAddCareerGoal}
                        handleRemoveCareerGoal={handleRemoveCareerGoal}
                        handleRemoveCustomSubPage={handleRemoveCustomSubPage}
                        setSubpageTranslateModalState={setSubpageTranslateModalState}
                      />
                    )}

                    {currentCategory === 'about_story' && (
                      <AboutStoryEditorPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        editLang={editLang}
                        getWebText={getWebText}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        cardBg={cardBg}
                        isDark={isDark}
                        theme={theme}
                        showMarkdownGuide={showMarkdownGuide}
                        setShowMarkdownGuide={setShowMarkdownGuide}
                        handleAddCustomSubPage={handleAddCustomSubPage}
                        handleRemoveCustomSubPage={handleRemoveCustomSubPage}
                        setActiveTab={setActiveTab}
                      />
                    )}

                    {currentCategory === 'projects' && (
                      <ProjectsEditorPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        editLang={editLang}
                        getWebText={getWebText}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        cardBg={cardBg}
                        isDark={isDark}
                        theme={theme}
                        bilingualProjects={bilingualProjects}
                        updateBilingualItem={updateBilingualItem}
                      />
                    )}

                    {currentCategory === 'skills' && (
                      <SkillsEditorPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        editLang={editLang}
                        getWebText={getWebText}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        cardBg={cardBg}
                        isDark={isDark}
                        theme={theme}
                        updateBilingualItem={updateBilingualItem}
                        updateBilingualSkillSvg={updateBilingualSkillSvg}
                      />
                    )}

                    {currentCategory === 'experiences' && (
                      <ExperienceEditorPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        editLang={editLang}
                        getWebText={getWebText}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        cardBg={cardBg}
                        isDark={isDark}
                        theme={theme}
                        bilingualExperiences={bilingualExperiences}
                        handleAddExperience={handleAddExperience}
                        handleMoveExperience={handleMoveExperience}
                        handleDuplicateExperience={handleDuplicateExperience}
                        handleRemoveExperience={handleRemoveExperience}
                        handleUpdateExperienceDates={handleUpdateExperienceDates}
                        handleManualExperiencePeriodChange={handleManualExperiencePeriodChange}
                        handleAddBulletPoint={handleAddBulletPoint}
                        handleRemoveBulletPoint={handleRemoveBulletPoint}
                        handleUpdateBulletPoint={handleUpdateBulletPoint}
                        updateBilingualItem={updateBilingualItem}
                        setExpTranslateModalState={setExpTranslateModalState}
                        setJobAiModalState={setJobAiModalState}
                      />
                    )}

                    {currentCategory === 'contact' && (
                      <ContactEditorPanel
                        localData={localData}
                        handleUpdate={handleUpdate}
                        editLang={editLang}
                        getWebText={getWebText}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        cardBg={cardBg}
                        isDark={isDark}
                        theme={theme}
                      />
                    )}

                    {(currentCategory === 'hero' || currentCategory === 'general_identity') && (
                      <ProfileEditorPanel
                        category={currentCategory as 'hero' | 'general_identity'}
                        localData={localData}
                        handleUpdate={handleUpdate}
                        editLang={editLang}
                        getWebText={getWebText}
                        handleWebTextChange={handleWebTextChange}
                        renderAiButton={renderAiButton}
                        renderColorControls={renderColorControls}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        cardBg={cardBg}
                        isDark={isDark}
                        theme={theme}
                      />
                    )}
                  </>
                )}

                {/* Live Context Tip */}
                <div
                  className={`p-3 rounded-lg border flex items-start gap-2.5 text-[11px] ${
                    isDark
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    {editorMode === 'assets' ? (
                      <span>
                        Perubahan pola background, warna tema, foto avatar, dan aset visual akan langsung ter-render secara real-time di layar. Klik <strong>"Simpan Draft"</strong> untuk menyimpan permanen.
                      </span>
                    ) : editorMode === 'social' ? (
                      <span>
                        Kelola tautan sosial media, narahubung utama, dan visibilitas di Web serta Header/Footer CV. Klik <strong>"Simpan Draft"</strong> untuk menyimpan permanen.
                      </span>
                    ) : (
                      <span>
                        Teks tersinkronisasi otomatis secara bilingual ({editLang.toUpperCase()}) dengan struktur database Admin Panel. Klik <strong>"Simpan Draft"</strong> untuk menyimpan permanen ke browser.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. DRAWER BOTTOM ACTION BAR */}
              <div
                className={`p-4 border-t flex items-center justify-between gap-3 ${
                  isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-100 bg-slate-50/90'
                }`}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                    isDark
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer select-none active:scale-97 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Draft Tersimpan!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Draft</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* AI Assistant Dialog Modal */}
      <AIAssistantModal
        isOpen={aiModalState.isOpen}
        onClose={() => setAiModalState((prev) => ({ ...prev, isOpen: false }))}
        fieldLabel={aiModalState.fieldLabel}
        currentValue={aiModalState.currentValue}
        targetLang={aiModalState.targetLang}
        onApply={aiModalState.onApply}
        contextHint={aiModalState.contextHint}
      />

      {/* Dedicated Per-Job AI Assistant Modal */}
      <JobExperienceAiModal
        isOpen={jobAiModalState.isOpen}
        onClose={() => setJobAiModalState((prev) => ({ ...prev, isOpen: false }))}
        role={jobAiModalState.role}
        company={jobAiModalState.company}
        existingBullets={jobAiModalState.existingBullets}
        lang={editLang}
        isDark={theme === 'dark'}
        onApply={(newBullets) => {
          updateBilingualItem('experiences', jobAiModalState.experienceBaseId, editLang, 'bulletPoints', newBullets);
        }}
      />

      {/* Dedicated Per-Job AI Language Transfer Modal */}
      <ExperienceTranslateModal
        isOpen={expTranslateModalState.isOpen}
        onClose={() => setExpTranslateModalState((prev) => ({ ...prev, isOpen: false }))}
        experienceBaseId={expTranslateModalState.experienceBaseId}
        sourceLang={expTranslateModalState.sourceLang}
        sourceData={expTranslateModalState.sourceData}
        isDark={theme === 'dark'}
        onApply={handleApplyExperienceTranslation}
      />

      {/* Generic Subpage Item AI Language Transfer Modal */}
      <SubpageItemTranslateModal
        isOpen={subpageTranslateModalState.isOpen}
        onClose={() => setSubpageTranslateModalState((prev) => ({ ...prev, isOpen: false }))}
        baseId={subpageTranslateModalState.baseId}
        itemType={subpageTranslateModalState.itemType}
        sourceLang={subpageTranslateModalState.sourceLang}
        sourceData={subpageTranslateModalState.sourceData}
        isDark={theme === 'dark'}
        labels={subpageTranslateModalState.labels}
        onApply={handleApplySubpageTranslation}
      />

      {/* Dedicated Methodology AI Language Transfer Modal */}
      {methodologyTranslateModalOpen && (
        <SubpageItemTranslateModal
          isOpen={methodologyTranslateModalOpen}
          onClose={() => setMethodologyTranslateModalOpen(false)}
          baseId="core-methodology"
          itemType="methodology"
          sourceLang={editLang}
          sourceData={{
            title:
              editLang === 'id'
                ? localData.webTexts?.[`methodologyTitle_id`] ||
                  (localData.webTexts?.methodologyTitle && editLang === 'id' ? localData.webTexts.methodologyTitle : '') ||
                  localData.methodologyTitle ||
                  (ID_TRANSLATIONS as any).methodologyTitle ||
                  'Metodologi Utama'
                : localData.webTexts?.[`methodologyTitle_en`] ||
                  (localData.webTexts?.methodologyTitle && editLang === 'en' ? localData.webTexts.methodologyTitle : '') ||
                  localData.methodologyTitle ||
                  'Core Methodology',
            description:
              editLang === 'id'
                ? localData.webTexts?.[`methodologyText_id`] ||
                  (localData.webTexts?.methodologyText && editLang === 'id' ? localData.webTexts.methodologyText : '') ||
                  localData.methodologyText ||
                  (ID_TRANSLATIONS as any).methodologyText ||
                  ''
                : localData.webTexts?.[`methodologyText_en`] ||
                  (localData.webTexts?.methodologyText && editLang === 'en' ? localData.webTexts.methodologyText : '') ||
                  localData.methodologyText ||
                  '',
          }}
          isDark={theme === 'dark'}
          labels={{
            itemTypeName: 'Core Methodology',
            titleLabel: 'Judul Seksi Metodologi',
            descriptionLabel: 'Deskripsi & Filosofi Metodologi',
          }}
          onApply={handleApplyMethodologyTranslation}
        />
      )}
    </AnimatePresence>
  );
};
