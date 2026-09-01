import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pencil, 
  X, 
  Save, 
  Check, 
  Languages, 
  Sparkles, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  User, 
  Mail, 
  Layers, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  BookOpen,
  Info,
  Plus,
  Trash2,
  Image,
  Target,
  Heart,
  Smile,
  Layout,
  ExternalLink,
  Palette,
  Sliders,
  Upload,
  Sun,
  Moon,
  ZoomIn,
  Move,
  Brush,
  Paintbrush,
  LayoutGrid,
  CheckCircle2,
  RotateCcw,
  Eye,
  CreditCard,
  ImageOff,
  Cpu,
  Copy,
  Edit2,
  FolderPlus,
  ChevronDown,
  ChevronUp,
  Award,
  Search,
  GripHorizontal,
  PictureInPicture2,
  Dock
} from 'lucide-react';
import { 
  CVData, 
  EducationItem, 
  EducationSection, 
  Experience, 
  CaseStudy, 
  PersonalityItem, 
  HobbyItem, 
  CareerGoalItem,
  SkillItem,
  SkillCategory,
  CustomSubPage,
  FloatingAsset
} from '../types';
import { saveCVData, uploadFileToStorage, resetCVDataToDefault } from '../lib/storage';
import { DEFAULT_CV_DATA, DEFAULT_WEB_TEXTS, ID_TRANSLATIONS } from '../data/portfolioData';
import BackgroundPatternSelector from './BackgroundPatternSelector';
import TechLogo from './TechLogo';
import ThemeTemplateStudio from './ThemeTemplateStudio';
import { HERO_THEME_TEMPLATES } from '../data/themeTemplates';
import { HERO_LAYOUT_TEMPLATES, LayoutTemplate } from '../data/layoutTemplates';

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
  theme
}) => {
  const isDark = theme === 'dark';
  const [localData, setLocalData] = useState<CVData>(cvData);
  const [editLang, setEditLang] = useState<'id' | 'en'>(currentLang);
  const [editorMode, setEditorMode] = useState<'id' | 'en' | 'assets'>('id');
  const [assetTab, setAssetTab] = useState<'templates' | 'bg_patterns' | 'floating_assets' | 'bg_shadows' | 'bg_colors' | 'images' | 'idcard' | 'gooey_cursor'>('templates');
  const [activeBgSection, setActiveBgSection] = useState<string>('home');
  const [appliedAllNotice, setAppliedAllNotice] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeTab, setActiveTab] = useState<string>('auto');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Floating Pop-out Window States & Dragging Handler
  const [isFloating, setIsFloating] = useState<boolean>(false);
  const [isMinimizedFloating, setIsMinimizedFloating] = useState<boolean>(false);
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 40, posY: 30 });

  // Handle header drag for floating window
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!isFloating) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: floatingPos.x,
      posY: floatingPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setFloatingPos({
        x: Math.max(10, Math.min(window.innerWidth - 280, dragStartRef.current.posX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 60, dragStartRef.current.posY + dy))
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

  // Synchronize localData when prop cvData changes
  useEffect(() => {
    setLocalData(cvData);
  }, [cvData]);

  // Sync edit language with active view language when drawer is opened
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

  // Map category to corresponding background texture section key
  const getBgSectionForCategory = (cat: string): string => {
    if (cat.startsWith('subpage_')) {
      if (['subpage_education', 'subpage_personality', 'subpage_hobbies', 'subpage_career_goals'].includes(cat)) {
        return cat.replace('subpage_', 'about_subpage_');
      }
      return cat; // custom subpages
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

  // Automatically synchronize activeBgSection with the currently selected or active category
  useEffect(() => {
    const targetCat = activeTab === 'auto' ? detectedCategory : activeTab;
    setActiveBgSection(getBgSectionForCategory(targetCat));
  }, [detectedCategory, activeTab, isOpen]);

  const localDataRef = useRef<CVData>(cvData);
  useEffect(() => {
    localDataRef.current = cvData;
    setLocalData(cvData);
  }, [cvData]);

  // Keep activeBgSection synced with current detected category when drawer opens or category changes
  useEffect(() => {
    if (isOpen) {
      setActiveBgSection(getBgSectionForCategory(currentCategory));
    }
  }, [isOpen, currentCategory]);

  // Root state updater with immediate propagation to App and persistent storage
  const handleUpdate = (updater: (prev: CVData) => CVData) => {
    const updated = updater(localDataRef.current);
    localDataRef.current = updated;
    setLocalData(updated);
    onUpdateCV(updated);
    try {
      saveCVData(updated);
    } catch (_) {}
  };

  // Upload image file to Base64
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: keyof CVData) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await uploadFileToStorage(file);
      handleUpdate(prev => ({ ...prev, [targetField]: base64 }));
    } catch (err) {
      console.error('Failed to upload image:', err);
    }
  };

  const handleWebTextImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await uploadFileToStorage(file);
      handleWebTextChange(targetKey, base64, editLang);
    } catch (err) {
      console.error('Failed to upload image to webTexts:', err);
    }
  };

  // Quick apply active background pattern to all sections
  const handleApplyBgPatternToAll = () => {
    const secKey = activeBgSection;
    const subKey = secKey.replace('about_subpage_', '');
    const texts = localData.webTexts || {};

    const style = texts[`${secKey}_bg_style`] || texts[`${subKey}_bg_style`] || (secKey === 'home' ? 'dots' : 'none');
    const opacity = texts[`${secKey}_bg_pattern_opacity`] || texts[`${subKey}_bg_pattern_opacity`] || '0.20';
    const scale = texts[`${secKey}_bg_pattern_scale`] || texts[`${subKey}_bg_pattern_scale`] || '1';
    const color = texts[`${secKey}_bg_pattern_color`] || texts[`${subKey}_bg_pattern_color`] || '';
    const svg = texts[`${secKey}_bg_custom_svg`] || texts[`${secKey}_custom_svg`] || texts[`${subKey}_bg_custom_svg`] || texts[`${subKey}_custom_svg`] || '';
    const url = texts[`${secKey}_bg_custom_url`] || texts[`${secKey}_custom_url`] || texts[`${subKey}_bg_custom_url`] || texts[`${subKey}_custom_url`] || '';

    const allSections = [
      'home', 'projects', 'skills', 'experience', 'contact', 
      'about_story', 'about_subpage_education', 'about_subpage_personality', 
      'about_subpage_hobbies', 'about_subpage_career_goals',
      'education', 'personality', 'hobbies', 'career_goals'
    ];

    handleUpdate(prev => {
      const nextTexts = { ...(prev.webTexts || {}) };
      allSections.forEach(s => {
        nextTexts[`${s}_bg_style`] = style;
        nextTexts[`${s}_bg_style_id`] = style;
        nextTexts[`${s}_bg_style_en`] = style;

        nextTexts[`${s}_bg_pattern_opacity`] = opacity;
        nextTexts[`${s}_bg_pattern_opacity_id`] = opacity;
        nextTexts[`${s}_bg_pattern_opacity_en`] = opacity;

        nextTexts[`${s}_bg_pattern_scale`] = scale;
        nextTexts[`${s}_bg_pattern_scale_id`] = scale;
        nextTexts[`${s}_bg_pattern_scale_en`] = scale;

        nextTexts[`${s}_bg_pattern_color`] = color;
        nextTexts[`${s}_bg_pattern_color_id`] = color;
        nextTexts[`${s}_bg_pattern_color_en`] = color;

        nextTexts[`${s}_custom_svg`] = svg;
        nextTexts[`${s}_bg_custom_svg`] = svg;
        nextTexts[`${s}_custom_svg_id`] = svg;
        nextTexts[`${s}_bg_custom_svg_id`] = svg;
        nextTexts[`${s}_custom_svg_en`] = svg;
        nextTexts[`${s}_bg_custom_svg_en`] = svg;

        nextTexts[`${s}_custom_url`] = url;
        nextTexts[`${s}_bg_custom_url`] = url;
        nextTexts[`${s}_custom_url_id`] = url;
        nextTexts[`${s}_bg_custom_url_id`] = url;
        nextTexts[`${s}_custom_url_en`] = url;
        nextTexts[`${s}_bg_custom_url_en`] = url;
      });
      return { ...prev, webTexts: nextTexts };
    });

    setAppliedAllNotice(true);
    setTimeout(() => setAppliedAllNotice(false), 2500);
  };

  // ============================================================================
  // TEMPLATE & PRESET STUDIO HANDLERS
  // ============================================================================
  const handleApplyThemeTemplate = (patch: Record<string, string>, themeAccent?: string) => {
    handleUpdate((prev) => {
      const newTexts = { ...(prev.webTexts || {}), ...patch };
      const currentLayout = prev.layoutSettings || {
        themeColor: 'rose',
        fontSize: 'standard',
        spacing: 'standard',
        layoutStyle: 'left-sidebar',
        fontFamily: 'sans',
        sectionOrder: []
      };
      const newLayout = {
        ...currentLayout,
        ...(themeAccent ? { themeColor: themeAccent as any } : {})
      };
      return {
        ...prev,
        webTexts: newTexts,
        layoutSettings: newLayout
      };
    });
  };

  const handleApplyLayoutTemplate = (layout: LayoutTemplate) => {
    handleUpdate((prev) => {
      const targetSec = layout.category || 'home';
      const nonSecAssets = (prev.floatingAssets || []).filter(a => a.section !== targetSec);
      const updatedAssets = [...nonSecAssets, ...layout.floatingAssets];
      const newTexts = {
        ...(prev.webTexts || {}),
        ...(layout.webTextsConfig || {})
      };
      return {
        ...prev,
        floatingAssets: updatedAssets,
        webTexts: newTexts
      };
    });
  };

  const handleApplyFullZenPreset = () => {
    const asahiTheme = HERO_THEME_TEMPLATES.find(t => t.id === 'hero-asahi-tsukimi');
    const zenLayout = HERO_LAYOUT_TEMPLATES.find(l => l.id === 'hero-zen-asahi-composition');
    if (!asahiTheme || !zenLayout) return;

    handleUpdate((prev) => {
      const nonHomeAssets = (prev.floatingAssets || []).filter(a => a.section !== 'home');
      const mergedAssets = [...nonHomeAssets, ...zenLayout.floatingAssets];
      const newTexts = {
        ...(prev.webTexts || {}),
        ...asahiTheme.webTextsPatch,
        ...(zenLayout.webTextsConfig || {})
      };
      const currentLayout = prev.layoutSettings || {
        themeColor: 'rose',
        fontSize: 'standard',
        spacing: 'standard',
        layoutStyle: 'left-sidebar',
        fontFamily: 'sans',
        sectionOrder: []
      };
      const newLayout = {
        ...currentLayout,
        themeColor: (asahiTheme.themeAccent || 'rose') as any
      };
      return {
        ...prev,
        floatingAssets: mergedAssets,
        webTexts: newTexts,
        layoutSettings: newLayout
      };
    });
  };

  const handleAddSingleAsset = (asset: Partial<FloatingAsset>) => {
    const newAsset: FloatingAsset = {
      id: asset.id || `asset_${Date.now()}`,
      name: asset.name || 'Ornamen SVG Baru',
      section: asset.section || activeBgSection || 'home',
      type: asset.type || 'svg',
      content: asset.content || '',
      color: asset.color,
      width: asset.width || 200,
      x: asset.x ?? 50,
      y: asset.y ?? 50,
      rotation: asset.rotation || 0,
      opacity: asset.opacity ?? 0.9,
      zIndex: asset.zIndex || 8,
      layer: asset.layer || 'above_image',
      animation: asset.animation || 'float',
      flipX: asset.flipX || false
    };
    handleUpdate((prev) => ({
      ...prev,
      floatingAssets: [...(prev.floatingAssets || []), newAsset]
    }));
  };

  // ============================================================================
  // BILINGUAL WEBTEXTS ENGINE
  // ============================================================================
  const getWebText = (key: string, targetLang: 'id' | 'en'): string => {
    const texts = localData.webTexts || {};
    if (targetLang === 'id') {
      if (texts[`${key}_id`] !== undefined && texts[`${key}_id`] !== '') {
        return texts[`${key}_id`];
      }
      if (ID_TRANSLATIONS.webTexts && (ID_TRANSLATIONS.webTexts as any)[key] !== undefined) {
        return (ID_TRANSLATIONS.webTexts as any)[key];
      }
      return texts[key] || DEFAULT_WEB_TEXTS[key] || '';
    } else {
      if (texts[`${key}_en`] !== undefined && texts[`${key}_en`] !== '') {
        return texts[`${key}_en`];
      }
      return texts[key] || DEFAULT_WEB_TEXTS[key] || '';
    }
  };

  const handleWebTextChange = (key: string, value: string, targetLang: 'id' | 'en') => {
    // Check if key is a visual design / background property that should persist universally across languages
    const isVisualAsset = 
      key.includes('_bg_style') ||
      key.includes('_bg_pattern_') ||
      key.includes('_custom_svg') ||
      key.includes('_custom_url') ||
      key.includes('_bg_color') ||
      key.includes('_card_bg_color') ||
      key.includes('_navbar_bg_color') ||
      key.includes('_navbar_active_color') ||
      key.includes('_navbar_active_bg_color') ||
      key.includes('_navbar_active_bg_opacity') ||
      key.includes('_header_bg') ||
      key.includes('_image_mask') ||
      key.includes('_image_fade') ||
      key.includes('_radial_') ||
      key.includes('_shadow_') ||
      key.includes('_image_url');

    handleUpdate(prev => {
      const nextTexts = { ...(prev.webTexts || {}) };

      if (isVisualAsset) {
        // Universal write: assign to base key and both language variants so it never gets lost
        nextTexts[key] = value;
        nextTexts[`${key}_id`] = value;
        nextTexts[`${key}_en`] = value;

        // Synchronize dual aliases for custom svg / custom url
        if (key.endsWith('_custom_svg')) {
          const bgKey = key.replace('_custom_svg', '_bg_custom_svg');
          nextTexts[bgKey] = value;
          nextTexts[`${bgKey}_id`] = value;
          nextTexts[`${bgKey}_en`] = value;
        } else if (key.endsWith('_bg_custom_svg')) {
          const baseKey = key.replace('_bg_custom_svg', '_custom_svg');
          nextTexts[baseKey] = value;
          nextTexts[`${baseKey}_id`] = value;
          nextTexts[`${baseKey}_en`] = value;
        }

        if (key.endsWith('_custom_url')) {
          const bgKey = key.replace('_custom_url', '_bg_custom_url');
          nextTexts[bgKey] = value;
          nextTexts[`${bgKey}_id`] = value;
          nextTexts[`${bgKey}_en`] = value;
        } else if (key.endsWith('_bg_custom_url')) {
          const baseKey = key.replace('_bg_custom_url', '_custom_url');
          nextTexts[baseKey] = value;
          nextTexts[`${baseKey}_id`] = value;
          nextTexts[`${baseKey}_en`] = value;
        }

        // Synchronize subpage prefixes if needed (about_subpage_xxx <-> xxx)
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
          nextTexts[key] = value; // Default/legacy fallback
        }
      }
      return {
        ...prev,
        webTexts: nextTexts
      };
    });
  };

  // Helper to render dual-mode (Light/Dark) color picker controls for individual text fields
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

  // ============================================================================
  // BILINGUAL LIST PAIR HELPERS (Education, Sections, Projects, Experiences, etc.)
  // ============================================================================

  // Generic bilingual pair extractor
  const getBilingualPairs = <T extends { id?: string | number }>(
    rawList: T[] | undefined,
    defaultFallbackEn?: (baseId: string) => Partial<T>,
    defaultFallbackId?: (baseId: string) => Partial<T>
  ) => {
    const list = rawList || [];
    const baseIds = Array.from(new Set(list.map(item => {
      const idStr = String(item.id || '');
      if (idStr.endsWith('-en') || idStr.endsWith('-id')) {
        return idStr.slice(0, -3);
      }
      return idStr;
    }))).filter(Boolean);

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

  // Dedicated helper to atomically update SVG configuration for a skill across both ID and EN versions
  const updateBilingualSkillSvg = (baseId: string, customSvg: string, svgUrl: string) => {
    handleUpdate(prev => {
      const currentList = prev.skills || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map(pair => {
        if (pair.baseId === baseId) {
          return {
            ...pair,
            en: { ...pair.en, customSvg, svgUrl },
            id: { ...pair.id, customSvg, svgUrl }
          };
        }
        return pair;
      });

      const flatList: any[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        skills: flatList
      };
    });
  };

  // Generic bilingual item update
  const updateBilingualItem = <T extends { id?: string | number }>(
    listKey: keyof CVData,
    baseId: string,
    targetLang: 'id' | 'en',
    field: string,
    value: any
  ) => {
    handleUpdate(prev => {
      const currentList = (prev[listKey] as any[] || []);
      const pairs = getBilingualPairs(currentList);
      
      const sharedFields = ['customSvg', 'svgUrl', 'category', 'showOnWeb', 'showOnCV', 'level', 'icon', 'year', 'period', 'image', 'projectUrl', 'tags', 'tools'];

      const updatedPairs = pairs.map(pair => {
        if (pair.baseId === baseId) {
          if (sharedFields.includes(field)) {
            return {
              ...pair,
              en: { ...(pair.en as any), [field]: value },
              id: { ...(pair.id as any), [field]: value }
            };
          }
          return {
            ...pair,
            [targetLang]: {
              ...(pair[targetLang] as any),
              [field]: value
            }
          };
        }
        return pair;
      });

      const flatList: any[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        [listKey]: flatList
      };
    });
  };

  // Helper for Education Sections (Subpage Story Slides)
  const getSubpageSections = (pageKey: string) => {
    const flatList = localData.educationSections || [];
    const rawPageSections = flatList.filter(es => {
      if (pageKey === 'education') {
        return !es.linkedEducationDegree?.startsWith("page:") && !es.linkedEducationDegree?.startsWith("item:");
      } else {
        return es.linkedEducationDegree === `page:${pageKey}` || es.linkedEducationDegree?.startsWith(`item:${pageKey}:`);
      }
    });

    return getBilingualPairs<EducationSection>(
      rawPageSections,
      (baseId) => ({
        id: `${baseId}-en`,
        title: 'Story Slide Title',
        content: 'Slide content in English...',
        imageUrl: '',
        layoutType: 'image_left',
        bgColor: 'slate',
        linkedEducationDegree: pageKey === 'education' ? '' : `page:${pageKey}`
      }),
      (baseId) => ({
        id: `${baseId}-id`,
        title: 'Judul Lembar Cerita',
        content: 'Konten narasi dalam Bahasa Indonesia...',
        imageUrl: '',
        layoutType: 'image_left',
        bgColor: 'slate',
        linkedEducationDegree: pageKey === 'education' ? '' : `page:${pageKey}`
      })
    );
  };

  const handleAddSubpageSection = (pageKey: string) => {
    const baseId = `sec-${pageKey}-${Date.now()}`;
    const newEn: EducationSection = {
      id: `${baseId}-en`,
      title: 'New Story Slide',
      content: 'Write detailed story or analysis in English here.',
      imageUrl: '',
      layoutType: 'image_left',
      bgColor: 'slate',
      linkedEducationDegree: pageKey === 'education' ? '' : `page:${pageKey}`,
      sortOrder: (localData.educationSections || []).length
    };
    const newId: EducationSection = {
      id: `${baseId}-id`,
      title: 'Lembar Cerita Baru',
      content: 'Tulis deskripsi narasi mendalam dalam Bahasa Indonesia di sini.',
      imageUrl: '',
      layoutType: 'image_left',
      bgColor: 'slate',
      linkedEducationDegree: pageKey === 'education' ? '' : `page:${pageKey}`,
      sortOrder: (localData.educationSections || []).length
    };

    handleUpdate(prev => ({
      ...prev,
      educationSections: [...(prev.educationSections || []), newEn, newId]
    }));
  };

  const handleRemoveSubpageSection = (baseId: string) => {
    handleUpdate(prev => ({
      ...prev,
      educationSections: (prev.educationSections || []).filter(es => 
        es.id !== `${baseId}-en` && es.id !== `${baseId}-id` && es.id !== baseId
      )
    }));
  };

  // Helper for Education Degrees
  const bilingualEduList = getBilingualPairs<EducationItem>(
    localData.education,
    (baseId) => ({ id: `${baseId}-en`, degree: 'Degree Name', institution: 'University', period: '2020 - 2024' }),
    (baseId) => ({ id: `${baseId}-id`, degree: 'Gelar / Jurusan', institution: 'Institusi', period: '2020 - 2024' })
  );

  const handleAddEdu = () => {
    const baseId = `edu-${Date.now()}`;
    const enItem: EducationItem = {
      id: `${baseId}-en`,
      degree: 'B.S. Applied Statistics & Computer Science',
      institution: 'State University',
      period: '2020 - 2024',
      description: 'Focus on Data Science, Statistical Modeling, and Database Architecture.'
    };
    const idItem: EducationItem = {
      id: `${baseId}-id`,
      degree: 'Sarjana Statistika Terapan & Ilmu Komputer',
      institution: 'Universitas Negeri',
      period: '2020 - 2024',
      description: 'Fokus pada Sains Data, Pemodelan Statistik, dan Arsitektur Basis Data.'
    };
    handleUpdate(prev => ({
      ...prev,
      education: [...(prev.education || []), enItem, idItem]
    }));
  };

  const handleRemoveEdu = (baseId: string) => {
    handleUpdate(prev => ({
      ...prev,
      education: (prev.education || []).filter(e => 
        e.id !== `${baseId}-en` && e.id !== `${baseId}-id` && e.id !== baseId
      )
    }));
  };

  // Helper for Case Studies
  const bilingualProjects = getBilingualPairs<CaseStudy>(
    localData.caseStudies,
    (baseId) => ({ id: `${baseId}-en`, title: 'Project Title', shortDescription: '', description: '', tags: [], image: '', tools: [] }),
    (baseId) => ({ id: `${baseId}-id`, title: 'Judul Proyek', shortDescription: '', description: '', tags: [], image: '', tools: [] })
  );

  // Helper for Experiences
  const bilingualExperiences = getBilingualPairs<Experience>(
    localData.experiences,
    (baseId) => ({ id: `${baseId}-en`, role: 'Job Role', company: 'Company Name', period: '2022 - Present', bulletPoints: [] }),
    (baseId) => ({ id: `${baseId}-id`, role: 'Posisi / Pekerjaan', company: 'Perusahaan', period: '2022 - Sekarang', bulletPoints: [] })
  );

  // Helper for Personality
  const bilingualPersonality = getBilingualPairs<PersonalityItem>(
    localData.personality,
    (baseId) => ({ id: `${baseId}-en`, title: 'Trait Title', description: '' }),
    (baseId) => ({ id: `${baseId}-id`, title: 'Karakter / Aspek', description: '' })
  );

  // Helper for Hobbies
  const bilingualHobbies = getBilingualPairs<HobbyItem>(
    localData.hobbies,
    (baseId) => ({ id: `${baseId}-en`, title: 'Hobby Title', description: '' }),
    (baseId) => ({ id: `${baseId}-id`, title: 'Judul Hobi', description: '' })
  );

  // Helper for Career Goals
  const bilingualCareerGoals = getBilingualPairs<CareerGoalItem>(
    localData.careerGoals,
    (baseId) => ({ id: `${baseId}-en`, title: 'Goal Title', description: '' }),
    (baseId) => ({ id: `${baseId}-id`, title: 'Target Karir', description: '' })
  );

  // Helper for Skills
  const bilingualSkills = getBilingualPairs<SkillItem>(
    localData.skills,
    (baseId) => ({ id: `${baseId}-en`, name: 'Skill Name', category: 'tools', icon: 'Terminal', description: '', showOnWeb: true, showOnCV: true }),
    (baseId) => ({ id: `${baseId}-id`, name: 'Nama Keahlian', category: 'tools', icon: 'Terminal', description: '', showOnWeb: true, showOnCV: true })
  );

  const handleAddSkill = () => {
    const baseId = `skill-${Date.now()}`;
    const enItem: SkillItem = {
      id: `${baseId}-en`,
      name: 'New Skill',
      category: 'tools',
      icon: 'Terminal',
      description: 'Skill description for About Me page...',
      showOnWeb: true,
      showOnCV: true
    };
    const idItem: SkillItem = {
      id: `${baseId}-id`,
      name: 'Keahlian Baru',
      category: 'tools',
      icon: 'Terminal',
      description: 'Deskripsi keahlian untuk halaman About Me...',
      showOnWeb: true,
      showOnCV: true
    };
    handleUpdate(prev => ({
      ...prev,
      skills: [...(prev.skills || []), enItem, idItem]
    }));
  };

  const handleRemoveSkill = (baseId: string) => {
    handleUpdate(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => 
        s.id !== `${baseId}-en` && s.id !== `${baseId}-id` && s.id !== baseId
      )
    }));
  };

  // Helper for Category Management in Skills
  const DEFAULT_SKILL_CATEGORIES = [
    { id: 'frontend', labelId: 'Frontend', labelEn: 'Frontend' },
    { id: 'backend', labelId: 'Backend & Database', labelEn: 'Backend & Database' },
    { id: 'dbms', labelId: 'DBMS & Query', labelEn: 'DBMS & Query' },
    { id: 'scientific', labelId: 'Programming & Script', labelEn: 'Programming & Script' },
    { id: 'visualization', labelId: 'BI & Visualization', labelEn: 'BI & Visualization' },
    { id: 'analytical', labelId: 'Analytics & Stats', labelEn: 'Analytics & Stats' },
    { id: 'tools', labelId: 'Tools & Infra', labelEn: 'Tools & Infra' },
    { id: 'core', labelId: 'Core Technologies', labelEn: 'Core Technologies' },
  ];

  const [isManagingSkillCats, setIsManagingSkillCats] = useState<boolean>(false);
  const [newCatIdInput, setNewCatIdInput] = useState<string>('');
  const [newCatLabelInput, setNewCatLabelInput] = useState<string>('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatLabel, setEditingCatLabel] = useState<string>('');
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>('');

  const allSkillCategories = useMemo(() => {
    const customList = localData.skillCategories || [];
    const list = DEFAULT_SKILL_CATEGORIES.map(def => {
      const customOverride = customList.find(c => c.id.toLowerCase() === def.id.toLowerCase());
      if (customOverride) {
        return {
          id: def.id,
          label: (editLang === 'id' ? customOverride.labelId : customOverride.labelEn) || customOverride.label || (editLang === 'id' ? def.labelId : def.labelEn),
          isDefault: true,
          isCustom: false
        };
      }
      return {
        id: def.id,
        label: editLang === 'id' ? def.labelId : def.labelEn,
        isDefault: true,
        isCustom: false
      };
    });

    customList.forEach(custom => {
      if (!list.some(item => item.id.toLowerCase() === custom.id.toLowerCase())) {
        list.push({
          id: custom.id,
          label: (editLang === 'id' ? custom.labelId : custom.labelEn) || custom.label || custom.id,
          isDefault: false,
          isCustom: true
        });
      }
    });

    return list;
  }, [localData.skillCategories, editLang]);

  const handleAddSkillCategory = () => {
    if (!newCatLabelInput.trim()) return;
    const autoId = (newCatIdInput.trim() || newCatLabelInput.trim()).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const existing = localData.skillCategories || [];
    if (existing.some(c => c.id.toLowerCase() === autoId) || DEFAULT_SKILL_CATEGORIES.some(c => c.id.toLowerCase() === autoId)) {
      alert(editLang === 'id' ? 'ID Kategori sudah ada. Silakan gunakan ID lain.' : 'Category ID already exists. Please choose a different ID.');
      return;
    }

    const newCat: SkillCategory = {
      id: autoId,
      label: newCatLabelInput.trim(),
      labelId: newCatLabelInput.trim(),
      labelEn: newCatLabelInput.trim()
    };

    handleUpdate(prev => ({
      ...prev,
      skillCategories: [...(prev.skillCategories || []), newCat]
    }));

    setNewCatIdInput('');
    setNewCatLabelInput('');
  };

  const handleSaveEditSkillCategory = () => {
    if (!editingCatId || !editingCatLabel.trim()) return;
    const existing = [...(localData.skillCategories || [])];
    const idx = existing.findIndex(c => c.id.toLowerCase() === editingCatId.toLowerCase());
    
    if (idx !== -1) {
      existing[idx] = {
        ...existing[idx],
        label: editingCatLabel.trim(),
        ...(editLang === 'id' ? { labelId: editingCatLabel.trim() } : { labelEn: editingCatLabel.trim() })
      };
      handleUpdate(prev => ({ ...prev, skillCategories: existing }));
    } else {
      // Create override for default category
      const newCat: SkillCategory = {
        id: editingCatId,
        label: editingCatLabel.trim(),
        labelId: editLang === 'id' ? editingCatLabel.trim() : editingCatLabel.trim(),
        labelEn: editLang === 'en' ? editingCatLabel.trim() : editingCatLabel.trim()
      };
      handleUpdate(prev => ({
        ...prev,
        skillCategories: [...(prev.skillCategories || []), newCat]
      }));
    }
    setEditingCatId(null);
    setEditingCatLabel('');
  };

  const handleDeleteSkillCategory = (catId: string) => {
    handleUpdate(prev => ({
      ...prev,
      skillCategories: (prev.skillCategories || []).filter(c => c.id.toLowerCase() !== catId.toLowerCase()),
      skills: (prev.skills || []).map(s => s.category?.toLowerCase() === catId.toLowerCase() ? { ...s, category: 'tools' } : s)
    }));
  };

  const handleDuplicateSkill = (baseId: string) => {
    const pair = bilingualSkills.find(p => p.baseId === baseId);
    if (!pair) return;
    const newBaseId = `skill-${Date.now()}`;
    const enItem: SkillItem = {
      ...(pair.en || { id: `${baseId}-en`, name: 'Skill', category: 'tools', icon: 'Terminal', description: '' }),
      id: `${newBaseId}-en`,
      name: `${pair.en?.name || 'Skill'} (Copy)`
    };
    const idItem: SkillItem = {
      ...(pair.id || { id: `${baseId}-id`, name: 'Keahlian', category: 'tools', icon: 'Terminal', description: '' }),
      id: `${newBaseId}-id`,
      name: `${pair.id?.name || 'Keahlian'} (Salinan)`
    };
    handleUpdate(prev => ({
      ...prev,
      skills: [...(prev.skills || []), enItem, idItem]
    }));
  };

  // Helper for Custom Sub-Pages in About Me
  const handleAddCustomSubPage = () => {
    const slug = `page-${Date.now().toString(36)}`;
    const newPage: CustomSubPage = {
      id: slug,
      title: 'Halaman Baru',
      titleEn: 'New Sub-Page',
      subtitle: 'Deskripsi dan pengantar mengenai sub-halaman ini.',
      subtitleEn: 'Introduction and insights for this sub-page.',
      headerBg: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      iconName: 'Sparkles',
      showOnStoryPage: true
    };

    handleUpdate(prev => ({
      ...prev,
      customSubPages: [...(prev.customSubPages || []), newPage]
    }));
    setActiveTab(`subpage_${slug}`);
  };

  const handleRemoveCustomSubPage = (pageId: string) => {
    const confirmMsg = editLang === 'id' 
      ? 'Apakah Anda yakin ingin menghapus halaman sub-page ini beserta seluruh slide ceritanya?'
      : 'Are you sure you want to delete this sub-page and all of its story slides?';
    if (!window.confirm(confirmMsg)) return;

    handleUpdate(prev => ({
      ...prev,
      customSubPages: (prev.customSubPages || []).filter(p => p.id !== pageId),
      educationSections: (prev.educationSections || []).filter(es => es.linkedEducationDegree !== `page:${pageId}`)
    }));
    if (activeTab === `subpage_${pageId}`) {
      setActiveTab('about_story');
    }
  };

  // Helper for Floating Decorative Assets Manager
  const handleAddFloatingAsset = (preset?: Partial<FloatingAsset>) => {
    const newAsset: FloatingAsset = {
      id: 'asset-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: preset?.name || 'Aset Melayang Baru',
      section: preset?.section || (activeBgSection || 'home'),
      type: preset?.type || 'svg',
      content: preset?.content || '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z" fill="currentColor"/></svg>',
      color: preset?.color || '#3b82f6',
      width: preset?.width || 90,
      x: preset?.x !== undefined ? preset.x : 80,
      y: preset?.y !== undefined ? preset.y : 20,
      rotation: preset?.rotation || 0,
      opacity: preset?.opacity !== undefined ? preset.opacity : 0.85,
      zIndex: preset?.zIndex !== undefined ? preset.zIndex : 15,
      animation: preset?.animation || 'float',
      flipX: preset?.flipX || false,
    };

    handleUpdate(prev => ({
      ...prev,
      floatingAssets: [...(prev.floatingAssets || []), newAsset]
    }));
  };

  const handleUpdateFloatingAsset = (id: string, field: keyof FloatingAsset, value: any) => {
    handleUpdate(prev => ({
      ...prev,
      floatingAssets: (prev.floatingAssets || []).map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleRemoveFloatingAsset = (id: string) => {
    handleUpdate(prev => ({
      ...prev,
      floatingAssets: (prev.floatingAssets || []).filter(a => a.id !== id)
    }));
  };

  // Save to persistent storage
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await saveCVData(localData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2200);
    } catch (e) {
      console.error('Failed to save CV Data:', e);
      setSaveStatus('idle');
    }
  };

  // Helper input classes
  const inputClass = `w-full text-xs font-semibold px-3 py-2 rounded-lg border outline-none transition-all ${
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
          style={isFloating ? {
            position: 'fixed',
            top: `${floatingPos.y}px`,
            left: `${floatingPos.x}px`,
            width: isMinimizedFloating ? '340px' : isExpanded ? '720px' : '520px',
            maxHeight: isMinimizedFloating ? '56px' : '88vh',
            height: isMinimizedFloating ? '56px' : '720px',
            zIndex: 100,
          } : undefined}
          className={`${
            isFloating
              ? 'fixed z-[100] shadow-2xl rounded-2xl border flex flex-col backdrop-blur-2xl transition-all duration-200 overflow-hidden ring-2 ring-emerald-500/40 shadow-emerald-950/60'
              : `fixed top-0 right-0 h-full z-[100] shadow-2xl flex flex-col border-l backdrop-blur-xl transition-all duration-200 ${
                  isExpanded ? 'w-full md:w-[720px]' : 'w-full sm:w-[480px]'
                }`
          } ${
            isDark
              ? 'bg-slate-900/95 border-slate-800 text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          {/* 1. TOP DRAWER / FLOATING HEADER */}
          <div 
            onMouseDown={handleHeaderMouseDown}
            className={`p-3.5 border-b flex items-center justify-between gap-2.5 transition-colors select-none ${
              isFloating ? 'cursor-grab active:cursor-grabbing bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-purple-950/40 border-emerald-500/30' : ''
            } ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
            }`}
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
                      y: 40
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
                  {isMinimizedFloating ? <ChevronUp className="w-4 h-4 text-emerald-400 animate-bounce" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}

              {/* Reset to Default TS Data button */}
              {!isMinimizedFloating && (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className={`px-2 py-1.5 rounded-lg border text-amber-400 hover:text-amber-300 hover:border-amber-500/50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                    isDark ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20' : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800'
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
                        {editLang === 'id' ? 'Reset ke Data Asli (portfolioData.ts)?' : 'Reset to Original Data (portfolioData.ts)?'}
                      </h4>
                      <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed">
                        {editLang === 'id'
                          ? 'Perhatian: Seluruh editan draft lokal (teks, warna, background, pola, gambar, subhalaman) yang tersimpan di browser ini akan dihapus dan dikembalikan persis sesuai data bawaan asli di portfolioData.ts.'
                          : 'Warning: All local drafts (texts, colors, backgrounds, patterns, images, subpages) stored in this browser will be cleared and reset to match the pristine template in portfolioData.ts.'}
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
                        setResetNotice(editLang === 'id' ? 'Data berhasil di-reset ke versi asli portfolioData.ts!' : 'Data successfully reset to original template data!');
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
              <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
                isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70'
              }`}>
            {/* 3-Way Mode Selector: ID | EN | Aset & Desain */}
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setEditLang('id');
                  setEditorMode('id');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
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
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
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
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  editorMode === 'assets'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
                title="Atur Gambar, Background SVG, Warna & Visual Aset"
              >
                <Palette className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Aset &amp; Desain</span>
              </button>
            </div>

            {/* Context / Sub-Tab Selector based on active Mode */}
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
                      {(localData.customSubPages || []).map(page => (
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
          </div>

          {/* 2.5 SUB-ASSET CATEGORY BAR WHEN IN ASSETS MODE */}
          {editorMode === 'assets' && (
            <div className={`px-4 py-2 border-b flex items-center justify-between gap-2 text-xs ${
              isDark ? 'border-purple-500/20 bg-purple-950/20' : 'border-purple-200 bg-purple-50/60'
            }`}>
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

            {/* ==================================================================== */}
            {/* ASSETS & DESIGN MODE STUDIO */}
            {/* ==================================================================== */}
            {editorMode === 'assets' ? (
              <div className="space-y-6">
                {/* 0. TEMPLATES & PRESETS STUDIO */}
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

                {/* 1. POLA SVG & TEKSTUR BACKGROUND */}
                {assetTab === 'bg_patterns' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pola Latar Belakang & Motif SVG</span>
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          Pilih motif Jepang Wagara, Geometris modern, Watercolor, atau SVG kustom
                        </p>
                      </div>
                    </div>

                    {/* Section Switcher Tabs for Background */}
                    <div className={`p-3 rounded-xl border ${cardBg} space-y-3`}>
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-purple-400" />
                          <span>Pilih Seksi / Halaman:</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleApplyBgPatternToAll}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                          title="Terapkan motif & pengaturan seksi ini ke semua seksi dan halaman lainnya"
                        >
                          {appliedAllNotice ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Berhasil Diterapkan ke Semua!</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span>Terapkan ke Semua Halaman</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {[
                          { id: 'home', label: '🏠 Hero / Home' },
                          { id: 'projects', label: '📂 Proyek' },
                          { id: 'skills', label: '⚡ Skills' },
                          { id: 'experience', label: '💼 Pengalaman' },
                          { id: 'contact', label: '✉️ Kontak' },
                          { id: 'about_story', label: '📖 Kisah Saya' },
                          { id: 'about_subpage_education', label: '🎓 Pendidikan' },
                          { id: 'about_subpage_personality', label: '💎 Kepribadian' },
                          { id: 'about_subpage_hobbies', label: '🎨 Hobi' },
                          { id: 'about_subpage_career_goals', label: '🚀 Target Karir' }
                        ].map((sec) => (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => setActiveBgSection(sec.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all border cursor-pointer truncate ${
                              activeBgSection === sec.id
                                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                                : isDark
                                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {sec.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Integrated Background Pattern Selector Component */}
                    <div className={`p-4 rounded-xl border ${cardBg}`}>
                      {(() => {
                        const secKey = activeBgSection;
                        const secLabel = {
                          home: 'Hero / Home (Seksi Utama)',
                          projects: 'Seksi Studi Kasus / Proyek',
                          skills: 'Seksi Keahlian (Skills Arsenal)',
                          experience: 'Seksi Pengalaman Kerja (Career Journey)',
                          contact: 'Seksi Formulir Kontak & Footer',
                          about_story: 'Halaman Kisah Saya (About Story Page)',
                          about_subpage_education: 'Halaman Sub-Page: Pendidikan (Education)',
                          about_subpage_personality: 'Halaman Sub-Page: Kepribadian (Personality)',
                          about_subpage_hobbies: 'Halaman Sub-Page: Hobi & Minat (Hobbies)',
                          about_subpage_career_goals: 'Halaman Sub-Page: Target Karir (Career Goals)',
                        }[secKey] || secKey;

                        const subKey = secKey.replace('about_subpage_', '');
                        const texts = localData.webTexts || {};

                        const val = texts[`${secKey}_bg_style`] || texts[`${secKey}_bg_style_${editLang}`] ||
                                    texts[`${subKey}_bg_style`] || texts[`${subKey}_bg_style_${editLang}`] ||
                                    (secKey === 'home' ? 'dots' : 'none');

                        const opStr = texts[`${secKey}_bg_pattern_opacity`] || texts[`${secKey}_bg_pattern_opacity_${editLang}`] ||
                                      texts[`${subKey}_bg_pattern_opacity`] || texts[`${subKey}_bg_pattern_opacity_${editLang}`] ||
                                      (secKey === 'home' ? texts.home_bg_custom_opacity : undefined);
                        const op = opStr ? parseFloat(opStr) : 0.20;

                        const scStr = texts[`${secKey}_bg_pattern_scale`] || texts[`${secKey}_bg_pattern_scale_${editLang}`] ||
                                      texts[`${subKey}_bg_pattern_scale`] || texts[`${subKey}_bg_pattern_scale_${editLang}`];
                        const sc = scStr ? parseFloat(scStr) : 1;

                        const col = texts[`${secKey}_bg_pattern_color`] || texts[`${secKey}_bg_pattern_color_${editLang}`] ||
                                    texts[`${subKey}_bg_pattern_color`] || texts[`${subKey}_bg_pattern_color_${editLang}`] || '';

                        const svg = texts[`${secKey}_bg_custom_svg`] || texts[`${secKey}_custom_svg`] ||
                                    texts[`${secKey}_bg_custom_svg_${editLang}`] || texts[`${secKey}_custom_svg_${editLang}`] ||
                                    texts[`${subKey}_bg_custom_svg`] || texts[`${subKey}_custom_svg`] || '';

                        const url = texts[`${secKey}_bg_custom_url`] || texts[`${secKey}_custom_url`] ||
                                    texts[`${secKey}_bg_custom_url_${editLang}`] || texts[`${secKey}_custom_url_${editLang}`] ||
                                    texts[`${subKey}_bg_custom_url`] || texts[`${subKey}_custom_url`] ||
                                    (secKey === 'home' ? texts.home_bg_custom_url : '') || '';

                        return (
                          <BackgroundPatternSelector
                            label={`Pola Background: ${secLabel}`}
                            sectionName={secLabel}
                            value={val}
                            opacityValue={op}
                            scaleValue={sc}
                            colorValue={col}
                            customSvgValue={svg}
                            customUrlValue={url}
                            theme={theme}
                            onApplyToAll={handleApplyBgPatternToAll}
                            onChange={(newVal) => {
                              handleWebTextChange(`${secKey}_bg_style`, newVal, editLang);
                            }}
                            onOpacityChange={(newOp) => {
                              handleWebTextChange(`${secKey}_bg_pattern_opacity`, newOp.toString(), editLang);
                            }}
                            onScaleChange={(newSc) => {
                              handleWebTextChange(`${secKey}_bg_pattern_scale`, newSc.toString(), editLang);
                            }}
                            onColorChange={(newCol) => {
                              handleWebTextChange(`${secKey}_bg_pattern_color`, newCol, editLang);
                            }}
                            onCustomSvgChange={(newSvg) => {
                              handleWebTextChange(`${secKey}_custom_svg`, newSvg, editLang);
                            }}
                            onCustomUrlChange={(newUrl) => {
                              handleWebTextChange(`${secKey}_custom_url`, newUrl, editLang);
                            }}
                          />
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* 1.5 ASET MELAYANG (FLOATING DECORATIVE ASSETS & ORNAMENTS) */}
                {assetTab === 'floating_assets' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Kelola Aset Melayang (SVG, Burung, Ornamen, Stiker)</span>
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          Tambahkan ornamen visual melayang (burung SVG, bintang, logo, dll) di seksi tertentu atau seluruh halaman.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddFloatingAsset()}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Aset</span>
                      </button>
                    </div>

                    {/* Fast Presets Box */}
                    <div className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5`}>
                      <span className="text-[11px] font-bold text-slate-300 block">
                        🚀 Templat Cepat Aset Melayang:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddFloatingAsset({
                            name: '🕊️ Burung Terbang',
                            type: 'svg',
                            content: '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z" fill="currentColor"/></svg>',
                            color: '#3b82f6',
                            width: 90,
                            animation: 'float',
                            x: 82,
                            y: 18
                          })}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          🕊️ + Burung Terbang
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddFloatingAsset({
                            name: '⭐ Bintang Sparkle',
                            type: 'svg',
                            content: '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L61 38 L100 50 L61 62 L50 100 L39 62 L0 50 L39 38 Z" fill="currentColor"/></svg>',
                            color: '#eab308',
                            width: 60,
                            animation: 'pulse',
                            x: 12,
                            y: 15
                          })}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          ⭐ + Bintang Sparkle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddFloatingAsset({
                            name: '🚀 Roket Melayang',
                            type: 'svg',
                            content: '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 5 C30 25 25 60 25 80 L50 70 L75 80 C75 60 70 25 50 5 Z" fill="currentColor"/><circle cx="50" cy="40" r="10" fill="#ffffff" opacity="0.8"/></svg>',
                            color: '#ef4444',
                            width: 80,
                            animation: 'bounce',
                            x: 88,
                            y: 70
                          })}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          🚀 + Roket Melayang
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddFloatingAsset({
                            name: '🌸 Bunga Origami',
                            type: 'svg',
                            content: '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="15" fill="currentColor"/><circle cx="50" cy="20" r="18" fill="currentColor" opacity="0.8"/><circle cx="80" cy="50" r="18" fill="currentColor" opacity="0.8"/><circle cx="50" cy="80" r="18" fill="currentColor" opacity="0.8"/><circle cx="20" cy="50" r="18" fill="currentColor" opacity="0.8"/></svg>',
                            color: '#ec4899',
                            width: 70,
                            animation: 'spin',
                            x: 10,
                            y: 80
                          })}
                          className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          🌸 + Bunga Sakura
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddFloatingAsset({
                            name: '⚡ Sirkuit Tech (Link File)',
                            type: 'url',
                            content: '/svg/accessories/circuit-tech.svg',
                            width: 120,
                            animation: 'none',
                            x: 85,
                            y: 85
                          })}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          ⚡ + Sirkuit Tech (URL)
                        </button>
                      </div>
                    </div>

                    {/* Active Floating Assets List */}
                    {(!localData.floatingAssets || localData.floatingAssets.length === 0) ? (
                      <div className={`p-8 rounded-xl border text-center ${cardBg} space-y-2`}>
                        <Smile className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
                        <p className="text-xs text-slate-300 font-bold">Belum Ada Aset Melayang</p>
                        <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                          Klik button <strong>"Tambah Aset"</strong> atau pilih salah satu templat cepat di atas untuk langsung menambahkan ornamen burung SVG / stiker melayang di halaman web Anda.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {localData.floatingAssets.map((asset, index) => {
                          const isRawSvg = asset.type === 'svg' || (asset.content && asset.content.trim().startsWith('<svg'));
                          return (
                            <div key={asset.id} className={`p-4 rounded-xl border ${cardBg} space-y-4 relative group border-emerald-500/30 hover:border-emerald-500/60 transition-all`}>
                              
                              {/* Asset Card Header */}
                              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                    #{index + 1}
                                  </span>
                                  <input
                                    type="text"
                                    value={asset.name}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'name', e.target.value)}
                                    className="bg-transparent font-bold text-xs text-slate-200 border-b border-transparent hover:border-slate-700 focus:border-emerald-500 outline-none px-1 py-0.5 transition-all w-full max-w-[200px]"
                                    placeholder="Nama Aset..."
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                    isRawSvg ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  }`}>
                                    {isRawSvg ? '🎨 Raw SVG (Bisa Edit Warna)' : '🔗 Link URL (Fitur Warna Mati)'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFloatingAsset(asset.id)}
                                    className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-all cursor-pointer"
                                    title="Hapus Aset ini"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Form Input Row 1: Target Halaman & Tipe Input */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                                    Target Halaman / Seksi:
                                  </label>
                                  <select
                                    value={asset.section}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'section', e.target.value)}
                                    className={inputClass}
                                  >
                                    <option value="home">Hero / Home (Seksi Depan)</option>
                                    <option value="projects">Case Studies (Proyek)</option>
                                    <option value="skills">Technical Arsenal (Skills)</option>
                                    <option value="experience">Professional Journey (Pengalaman)</option>
                                    <option value="contact">Contact Matrix (Kontak)</option>
                                    <option value="about_story">Kisah Saya (About Story)</option>
                                    <option value="about_subpage_education">Subpage: Education Degree</option>
                                    <option value="about_subpage_personality">Subpage: Personality</option>
                                    <option value="about_subpage_hobbies">Subpage: Hobbies</option>
                                    <option value="about_subpage_career_goals">Subpage: Career Goals</option>
                                    {(localData.customSubPages || []).map(p => (
                                      <option key={p.id} value={`about_subpage_${p.id}`}>
                                        Subpage: {p.title}
                                      </option>
                                    ))}
                                    <option value="all">🌐 Tampilkan di Semua Halaman</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                                    Tipe Sumber Aset:
                                  </label>
                                  <select
                                    value={isRawSvg ? 'svg' : 'url'}
                                    onChange={(e) => {
                                      const newType = e.target.value as 'svg' | 'url';
                                      handleUpdateFloatingAsset(asset.id, 'type', newType);
                                      if (newType === 'svg' && (!asset.content || !asset.content.trim().startsWith('<svg'))) {
                                        handleUpdateFloatingAsset(asset.id, 'content', '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z" fill="currentColor"/></svg>');
                                      }
                                    }}
                                    className={inputClass}
                                  >
                                    <option value="svg">Raw Kode &lt;svg&gt; (Fitur Edit Warna Aktif)</option>
                                    <option value="url">Link URL Gambar / SVG (Edit Warna Mati Otomatis)</option>
                                  </select>
                                </div>
                              </div>

                              {/* Form Input Row 2: Content (Raw SVG String or URL Link) */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-[10.5px] font-bold text-slate-300">
                                    {isRawSvg ? 'Kode <svg> Aset (Burung, Stiker, Logo):' : 'Link URL File Aset / Gambar:'}
                                  </label>
                                  <label className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-700">
                                    <Upload className="w-3 h-3 text-emerald-400" />
                                    <span>Upload File</span>
                                    <input
                                      type="file"
                                      accept="image/*,.svg"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.name.endsWith('.svg')) {
                                          const text = await file.text();
                                          if (text.includes('<svg')) {
                                            handleUpdateFloatingAsset(asset.id, 'type', 'svg');
                                            handleUpdateFloatingAsset(asset.id, 'content', text);
                                            return;
                                          }
                                        }
                                        const uploadedUrl = await uploadFileToStorage(file);
                                        if (uploadedUrl) {
                                          handleUpdateFloatingAsset(asset.id, 'type', 'url');
                                          handleUpdateFloatingAsset(asset.id, 'content', uploadedUrl);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>

                                {isRawSvg ? (
                                  <textarea
                                    value={asset.content}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'content', e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-emerald-300 focus:outline-none focus:border-emerald-500 transition-all resize-y"
                                    placeholder='<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>'
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={asset.content}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'content', e.target.value)}
                                    className={inputClass}
                                    placeholder="https://... atau /svg/accessories/bird.svg"
                                  />
                                )}
                              </div>

                              {/* Form Input Row 3: WARNA ASET (Smart Status: Disabled for URL) */}
                              <div className={`p-3 rounded-lg border transition-all ${
                                isRawSvg 
                                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                                  : 'bg-slate-900/40 border-slate-800 opacity-60'
                              }`}>
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                                      <Brush className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Warna Aset (SVG Fill Color)</span>
                                    </label>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                      {isRawSvg 
                                        ? 'Pilih warna kustom untuk disuntikkan ke dalam atribut fill kode SVG.'
                                        : '🔒 Fitur edit warna otomatis mati karena aset menggunakan link URL / file eksternal.'}
                                    </p>
                                  </div>

                                  {isRawSvg && (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <input
                                        type="color"
                                        value={asset.color || '#3b82f6'}
                                        onChange={(e) => handleUpdateFloatingAsset(asset.id, 'color', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                                      />
                                      <input
                                        type="text"
                                        value={asset.color || '#3b82f6'}
                                        onChange={(e) => handleUpdateFloatingAsset(asset.id, 'color', e.target.value)}
                                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-[11px] text-slate-200 text-center"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Form Input Row 4: Sliders Posisi X & Y, Ukuran, Opasitas */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {/* Posisi Horizontal X (%) */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                    <span>Posisi X (Horizontal):</span>
                                    <span className="font-mono text-emerald-400">{asset.x}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={asset.x}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'x', parseInt(e.target.value, 10))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                  />
                                  <div className="flex justify-between text-[9px] text-slate-500">
                                    <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, 'x', 10)} className="hover:text-emerald-400">Kiri (10%)</button>
                                    <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, 'x', 50)} className="hover:text-emerald-400">Tengah (50%)</button>
                                    <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, 'x', 85)} className="hover:text-emerald-400">Kanan (85%)</button>
                                  </div>
                                </div>

                                {/* Posisi Vertikal Y (%) */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                    <span>Posisi Y (Vertikal):</span>
                                    <span className="font-mono text-emerald-400">{asset.y}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={asset.y}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'y', parseInt(e.target.value, 10))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                  />
                                  <div className="flex justify-between text-[9px] text-slate-500">
                                    <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, 'y', 15)} className="hover:text-emerald-400">Atas (15%)</button>
                                    <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, 'y', 50)} className="hover:text-emerald-400">Tengah (50%)</button>
                                    <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, 'y', 85)} className="hover:text-emerald-400">Bawah (85%)</button>
                                  </div>
                                </div>

                                {/* Ukuran Lebar (Width in px) dengan Slider Besar & Input Angka & Preset */}
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                    <div className="flex items-center gap-1.5">
                                      <span>Ukuran Besar / Kecil:</span>
                                      <span className="text-[9px] text-emerald-400 font-normal bg-emerald-950/40 px-1 rounded border border-emerald-500/20">⚡ Responsif Layar</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={10}
                                        max={2000}
                                        value={asset.width || 80}
                                        onChange={(e) => handleUpdateFloatingAsset(asset.id, 'width', parseInt(e.target.value, 10) || 80)}
                                        className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-emerald-400 text-right focus:outline-none focus:border-emerald-500"
                                      />
                                      <span className="text-[10px] text-slate-400 font-mono">px</span>
                                    </div>
                                  </div>
                                  <input
                                    type="range"
                                    min={15}
                                    max={1200}
                                    step={5}
                                    value={asset.width || 80}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'width', parseInt(e.target.value, 10))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                  />
                                  {/* Quick Size Presets */}
                                  <div className="flex flex-wrap gap-1 text-[9.5px]">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateFloatingAsset(asset.id, 'width', 60)}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                    >
                                      Kecil (60px)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateFloatingAsset(asset.id, 'width', 150)}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                    >
                                      Sedang (150px)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateFloatingAsset(asset.id, 'width', 350)}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                    >
                                      Besar (350px)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateFloatingAsset(asset.id, 'width', 650)}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                    >
                                      Sangat Besar (650px)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateFloatingAsset(asset.id, 'width', 1000)}
                                      className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 transition-all"
                                    >
                                      Giant (1000px)
                                    </button>
                                  </div>
                                </div>

                                {/* Opasitas (Transparency) */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                    <span>Opasitas Transparansi:</span>
                                    <span className="font-mono text-emerald-400">{Math.round((asset.opacity ?? 0.8) * 100)}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min={0.1}
                                    max={1}
                                    step={0.05}
                                    value={asset.opacity ?? 0.8}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'opacity', parseFloat(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                  />
                                </div>
                              </div>

                              {/* Form Input Row 4.5: POSISI LAPISAN (LAYER DEPTH / STACK ORDER) */}
                              <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 space-y-2">
                                <label className="text-[10.5px] font-bold text-slate-200 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Posisi Lapisan (Layer Stacking Order):</span>
                                  </span>
                                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                    {asset.layer === 'bg' ? 'Layer #1 (Background)' : asset.layer === 'above_all' ? 'Layer #3 (Top Foreground)' : 'Layer #2 (Di Atas Gambar)'}
                                  </span>
                                </label>
                                <select
                                  value={asset.layer || (asset.zIndex === 2 ? 'bg' : asset.zIndex === 30 ? 'above_all' : 'above_image')}
                                  onChange={(e) => {
                                    const newLayer = e.target.value as 'bg' | 'above_image' | 'above_all';
                                    handleUpdateFloatingAsset(asset.id, 'layer', newLayer);
                                    if (newLayer === 'bg') handleUpdateFloatingAsset(asset.id, 'zIndex', 2);
                                    else if (newLayer === 'above_image') handleUpdateFloatingAsset(asset.id, 'zIndex', 8);
                                    else if (newLayer === 'above_all') handleUpdateFloatingAsset(asset.id, 'zIndex', 30);
                                  }}
                                  className={inputClass}
                                >
                                  <option value="bg">🥉 Setara Background (Di atas Pattern, Di bawah Gambar/Avatar & Tulisan)</option>
                                  <option value="above_image">🥈 Di atas Gambar & Lingkaran Avatar (Di bawah Tulisan / Text)</option>
                                  <option value="above_all">🥇 Di atas Semua Konten (Di atas Gambar & Di atas Tulisan / Judul)</option>
                                </select>
                                <p className="text-[10px] text-slate-400">
                                  {asset.layer === 'bg' && '✨ Aset berada pas di atas pattern background, di bawah semua gambar profil dan tulisan.'}
                                  {(asset.layer === 'above_image' || (!asset.layer && asset.zIndex !== 2 && asset.zIndex !== 30)) && '✨ Aset berada di atas lingkaran/foto avatar, namun teks dan judul utama tetap berada di atasnya agar terbaca sempurna.'}
                                  {asset.layer === 'above_all' && '✨ Aset berada di paling depan melayang melintasi tulisan dan gambar.'}
                                </p>
                              </div>

                              {/* Form Input Row 5: Animasi & Rotasi & Mirroring */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                                    Efek Animasi Melayang:
                                  </label>
                                  <select
                                    value={asset.animation || 'float'}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'animation', e.target.value)}
                                    className={inputClass}
                                  >
                                    <option value="float">🕊️ Float (Melayang Ombak)</option>
                                    <option value="pulse">⭐ Pulse (Bersetubuh/Denyut)</option>
                                    <option value="bounce">🚀 Bounce (Membumbung)</option>
                                    <option value="spin">🌸 Spin (Berputar Lambat)</option>
                                    <option value="none">🛑 Diam (Tanpa Animasi)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                                    Rotasi Kemiringan (°):
                                  </label>
                                  <input
                                    type="number"
                                    min={-180}
                                    max={180}
                                    value={asset.rotation || 0}
                                    onChange={(e) => handleUpdateFloatingAsset(asset.id, 'rotation', parseInt(e.target.value, 10) || 0)}
                                    className={inputClass}
                                    placeholder="0°"
                                  />
                                </div>

                                <div className="flex flex-col justify-end">
                                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                                    <input
                                      type="checkbox"
                                      checked={asset.flipX || false}
                                      onChange={(e) => handleUpdateFloatingAsset(asset.id, 'flipX', e.target.checked)}
                                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                                    />
                                    <span className="text-[11px] font-bold text-slate-300">
                                      Flip Horizontal (Cermin X)
                                    </span>
                                  </label>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. WARNA BACKGROUND & TEMA */}
                {assetTab === 'bg_colors' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                          <Paintbrush className="w-3.5 h-3.5" />
                          <span>Palet Warna Background &amp; Tema Web</span>
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          Atur warna background per halaman/bagian, tema aksen, dan navbar
                        </p>
                      </div>
                    </div>

                    {/* Section indicator */}
                    <div className="px-3.5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-purple-300">
                          Halaman Aktif:
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono font-bold text-[11px]">
                          {activeBgSection === 'home' ? '🏠 Beranda / Home' :
                           activeBgSection === 'projects' ? '📂 Projek & Studi Kasus' :
                           activeBgSection === 'skills' ? '⚡ Skills & Arsenal' :
                           activeBgSection === 'experience' ? '💼 Pengalaman / Journey' :
                           activeBgSection === 'contact' ? '✉️ Kontak & Footer' :
                           activeBgSection === 'about_story' ? '📖 Kisah Saya (Story)' :
                           `📄 ${activeBgSection.replace('about_subpage_', '').toUpperCase()}`}
                        </span>
                      </div>

                      {/* Apply to All Sections Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const lightVal = localData.webTexts?.[`${activeBgSection}_bg_color`] || localData.webTexts?.home_bg_color || '#f7f9fb';
                          const darkVal = localData.webTexts?.[`${activeBgSection}_bg_color_dark`] || localData.webTexts?.home_bg_color_dark || '#0f172a';
                          const sections = [
                            'home', 'hero', 'projects', 'skills', 'experience', 'contact', 'about_story',
                            'about_subpage_education', 'about_subpage_personality', 'about_subpage_hobbies',
                            'about_subpage_career_goals'
                          ];
                          handleUpdate(prev => {
                            const newTexts = { ...(prev.webTexts || {}) };
                            sections.forEach(sec => {
                              newTexts[`${sec}_bg_color`] = lightVal;
                              newTexts[`${sec}_bg_color_id`] = lightVal;
                              newTexts[`${sec}_bg_color_en`] = lightVal;
                              newTexts[`${sec}_bg_color_dark`] = darkVal;
                              newTexts[`${sec}_bg_color_dark_id`] = darkVal;
                              newTexts[`${sec}_bg_color_dark_en`] = darkVal;
                            });
                            return { ...prev, webTexts: newTexts };
                          });
                          setAppliedAllNotice(true);
                          setTimeout(() => setAppliedAllNotice(false), 3000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10.5px] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        title="Terapkan warna background bagian ini ke semua halaman web"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Terapkan ke Semua Halaman</span>
                      </button>
                    </div>

                    {appliedAllNotice && (
                      <div className="px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Warna background berhasil diterapkan ke seluruh halaman portofolio!</span>
                      </div>
                    )}

                    {/* Theme Accent Color Picker */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Warna Aksen Utama Portofolio (Theme Accent):</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[
                          { id: 'emerald', label: 'Emerald', hex: '#10b981' },
                          { id: 'blue', label: 'Blue', hex: '#3b82f6' },
                          { id: 'indigo', label: 'Indigo', hex: '#6366f1' },
                          { id: 'rose', label: 'Rose', hex: '#f43f5e' },
                          { id: 'amber', label: 'Amber', hex: '#f59e0b' },
                          { id: 'slate', label: 'Slate', hex: '#64748b' }
                        ].map((c) => {
                          const active = (localData.layoutSettings?.themeColor || 'blue') === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                handleUpdate(prev => ({
                                  ...prev,
                                  layoutSettings: {
                                    ...(prev.layoutSettings || {
                                      fontSize: 'standard',
                                      spacing: 'standard',
                                      layoutStyle: 'left-sidebar',
                                      fontFamily: 'sans',
                                      sectionOrder: []
                                    }),
                                    themeColor: c.id as any
                                  }
                                }));
                              }}
                              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                active
                                  ? 'border-white ring-2 ring-purple-500 bg-purple-500/10'
                                  : isDark
                                    ? 'border-slate-800 bg-slate-900 hover:border-slate-700'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full shadow-inner border border-white/20" style={{ backgroundColor: c.hex }} />
                              <span className="text-[10px] font-bold text-slate-300">{c.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section Selector Pills for Background Colors */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-400" />
                          <span>Pilih Halaman yang Diatur:</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const lightBg = localData.webTexts?.[activeBgSection === 'home' ? 'home_bg_color' : `${activeBgSection}_bg_color`] || '#f7f9fb';
                            const darkBg = localData.webTexts?.[activeBgSection === 'home' ? 'home_bg_color_dark' : `${activeBgSection}_bg_color_dark`] || '#0f172a';
                            const sections = [
                              'home', 'projects', 'skills', 'experience', 'contact', 'about_story',
                              'about_subpage_education', 'about_subpage_personality', 'about_subpage_hobbies',
                              'about_subpage_career_goals'
                            ];
                            handleUpdate(prev => {
                              const newTexts = { ...(prev.webTexts || {}) };
                              sections.forEach(sec => {
                                newTexts[`${sec}_bg_color`] = lightBg;
                                newTexts[`${sec}_bg_color_dark`] = darkBg;
                              });
                              newTexts['hero_bg_color'] = lightBg;
                              newTexts['hero_bg_color_dark'] = darkBg;
                              return { ...prev, webTexts: newTexts };
                            });
                            setAppliedAllNotice(true);
                            setTimeout(() => setAppliedAllNotice(false), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Terapkan BG ke Semua Halaman</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'home', label: '🏠 Beranda' },
                          { id: 'projects', label: '📂 Projek' },
                          { id: 'skills', label: '⚡ Skills' },
                          { id: 'experience', label: '💼 Pengalaman' },
                          { id: 'contact', label: '✉️ Kontak' },
                          { id: 'about_story', label: '📖 Kisah Saya' },
                          { id: 'about_subpage_education', label: '🎓 Pendidikan' },
                          { id: 'about_subpage_personality', label: '🧠 Kepribadian' },
                          { id: 'about_subpage_hobbies', label: '🎨 Hobi' },
                          { id: 'about_subpage_career_goals', label: '🎯 Target Karir' }
                        ].map((sec) => (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => setActiveBgSection(sec.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeBgSection === sec.id
                                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
                                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                            }`}
                          >
                            {sec.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section-Specific Background Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Light Mode BG for Active Section */}
                      {(() => {
                        const lightBgKey = activeBgSection === 'home' ? 'home_bg_color' : `${activeBgSection}_bg_color`;
                        const currentVal = localData.webTexts?.[lightBgKey] || localData.webTexts?.home_bg_color || '#f7f9fb';
                        return (
                          <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                                <Sun className="w-4 h-4" />
                                <span>Warna Background (Mode Terang)</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                {lightBgKey}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={currentVal.startsWith('#') ? currentVal : '#f7f9fb'}
                                onChange={(e) => {
                                  handleWebTextChange(lightBgKey, e.target.value, editLang);
                                  if (activeBgSection === 'home') {
                                    handleWebTextChange('hero_bg_color', e.target.value, editLang);
                                  }
                                }}
                                className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                              />
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => {
                                  handleWebTextChange(lightBgKey, e.target.value, editLang);
                                  if (activeBgSection === 'home') {
                                    handleWebTextChange('hero_bg_color', e.target.value, editLang);
                                  }
                                }}
                                placeholder="#f7f9fb"
                                className={inputClass}
                              />
                            </div>
                            {/* Quick Presets for Light */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {[
                                { hex: '#ccd6e1', name: 'Design Gray' },
                                { hex: '#ffffff', name: 'Putih' },
                                { hex: '#f7f9fb', name: 'Default' },
                                { hex: '#f1f5f9', name: 'Slate Light' },
                                { hex: '#e2e8f0', name: 'Slate Gray' },
                                { hex: '#fdfbf7', name: 'Cream' },
                                { hex: '#f0fdf4', name: 'Mint' },
                                { hex: '#f0f9ff', name: 'Sky' }
                              ].map((p) => (
                                <button
                                  key={p.hex}
                                  type="button"
                                  onClick={() => {
                                    handleWebTextChange(lightBgKey, p.hex, editLang);
                                    if (activeBgSection === 'home') {
                                      handleWebTextChange('hero_bg_color', p.hex, editLang);
                                    }
                                  }}
                                  className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                >
                                  {p.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Dark Mode BG for Active Section */}
                      {(() => {
                        const darkBgKey = activeBgSection === 'home' ? 'home_bg_color_dark' : `${activeBgSection}_bg_color_dark`;
                        const currentVal = localData.webTexts?.[darkBgKey] || localData.webTexts?.home_bg_color_dark || '#0f172a';
                        return (
                          <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                                <Moon className="w-4 h-4" />
                                <span>Warna Background (Mode Gelap)</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                {darkBgKey}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={currentVal.startsWith('#') ? currentVal : '#0f172a'}
                                onChange={(e) => {
                                  handleWebTextChange(darkBgKey, e.target.value, editLang);
                                  if (activeBgSection === 'home') {
                                    handleWebTextChange('hero_bg_color_dark', e.target.value, editLang);
                                  }
                                }}
                                className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                              />
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => {
                                  handleWebTextChange(darkBgKey, e.target.value, editLang);
                                  if (activeBgSection === 'home') {
                                    handleWebTextChange('hero_bg_color_dark', e.target.value, editLang);
                                  }
                                }}
                                placeholder="#0f172a"
                                className={inputClass}
                              />
                            </div>
                            {/* Quick Presets for Dark */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {[
                                { hex: '#0f172a', name: 'Midnight' },
                                { hex: '#0b1120', name: 'Deep Navy' },
                                { hex: '#020617', name: 'Pitch Dark' },
                                { hex: '#1e293b', name: 'Slate Dark' },
                                { hex: '#111827', name: 'Charcoal' }
                              ].map((p) => (
                                <button
                                  key={p.hex}
                                  type="button"
                                  onClick={() => {
                                    handleWebTextChange(darkBgKey, p.hex, editLang);
                                    if (activeBgSection === 'home') {
                                      handleWebTextChange('hero_bg_color_dark', p.hex, editLang);
                                    }
                                  }}
                                  className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                >
                                  {p.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Navbar Colors */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                      <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5" />
                        <span>Warna Navbar Navigasi Atas</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">
                            Navbar (Mode Terang)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={localData.webTexts?.navbar_bg_color?.startsWith('#') ? localData.webTexts.navbar_bg_color : '#ffffff'}
                              onChange={(e) => handleWebTextChange('navbar_bg_color', e.target.value, editLang)}
                              className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                            />
                            <input
                              type="text"
                              value={localData.webTexts?.navbar_bg_color || ''}
                              onChange={(e) => handleWebTextChange('navbar_bg_color', e.target.value, editLang)}
                              placeholder="rgba(255,255,255,0.85)"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">
                            Navbar (Mode Gelap)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={localData.webTexts?.navbar_bg_color_dark?.startsWith('#') ? localData.webTexts.navbar_bg_color_dark : '#1e293b'}
                              onChange={(e) => handleWebTextChange('navbar_bg_color_dark', e.target.value, editLang)}
                              className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                            />
                            <input
                              type="text"
                              value={localData.webTexts?.navbar_bg_color_dark || ''}
                              onChange={(e) => handleWebTextChange('navbar_bg_color_dark', e.target.value, editLang)}
                              placeholder="rgba(30,41,59,0.85)"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Active Tab Highlight Colors */}
                      <div className="pt-3 border-t border-slate-700/50 space-y-3">
                        <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Warna & Kontainer Sorotan Tab Aktif</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">
                              Warna Teks Tab Aktif (Terang)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={localData.webTexts?.navbar_active_color?.startsWith('#') ? localData.webTexts.navbar_active_color : '#047857'}
                                onChange={(e) => handleWebTextChange('navbar_active_color', e.target.value, editLang)}
                                className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                              />
                              <input
                                type="text"
                                value={localData.webTexts?.navbar_active_color || ''}
                                onChange={(e) => handleWebTextChange('navbar_active_color', e.target.value, editLang)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">
                              Warna Teks Tab Aktif (Gelap)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={localData.webTexts?.navbar_active_color_dark?.startsWith('#') ? localData.webTexts.navbar_active_color_dark : '#34d399'}
                                onChange={(e) => handleWebTextChange('navbar_active_color_dark', e.target.value, editLang)}
                                className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                              />
                              <input
                                type="text"
                                value={localData.webTexts?.navbar_active_color_dark || ''}
                                onChange={(e) => handleWebTextChange('navbar_active_color_dark', e.target.value, editLang)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">
                              Warna Kontainer Tab (Terang)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={localData.webTexts?.navbar_active_bg_color?.startsWith('#') ? localData.webTexts.navbar_active_bg_color : '#d1fae5'}
                                onChange={(e) => handleWebTextChange('navbar_active_bg_color', e.target.value, editLang)}
                                className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                              />
                              <input
                                type="text"
                                value={localData.webTexts?.navbar_active_bg_color || ''}
                                onChange={(e) => handleWebTextChange('navbar_active_bg_color', e.target.value, editLang)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">
                              Warna Kontainer Tab (Gelap)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={localData.webTexts?.navbar_active_bg_color_dark?.startsWith('#') ? localData.webTexts.navbar_active_bg_color_dark : '#064e3b'}
                                onChange={(e) => handleWebTextChange('navbar_active_bg_color_dark', e.target.value, editLang)}
                                className="w-8 h-8 rounded border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                              />
                              <input
                                type="text"
                                value={localData.webTexts?.navbar_active_bg_color_dark || ''}
                                onChange={(e) => handleWebTextChange('navbar_active_bg_color_dark', e.target.value, editLang)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                            <span>Transparansi Kontainer Sorotan Tab:</span>
                            <span className="font-mono text-emerald-400">{Math.round(parseFloat(localData.webTexts?.navbar_active_bg_opacity || '0.6') * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.05"
                            max="1.0"
                            step="0.05"
                            value={parseFloat(localData.webTexts?.navbar_active_bg_opacity || '0.6')}
                            onChange={(e) => handleWebTextChange('navbar_active_bg_opacity', e.target.value, editLang)}
                            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2.5 BAYANGAN GRADASI SISI PER HALAMAN */}
                {assetTab === 'bg_shadows' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Pengaturan Bayangan Gradasi Sisi (Edge Shadows)</span>
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          Aktifkan efek gradasi bayangan dari bawah/atas/sisi halaman dengan ketebalan dan intensitas fleksibel
                        </p>
                      </div>
                    </div>

                    {/* Section Selector Pills for Shadow tab */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-purple-400" />
                          <span>Pilih Halaman Target Bayangan:</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const enabled = localData.webTexts?.[`${activeBgSection}_shadow_enabled`] || 'false';
                            const dir = localData.webTexts?.[`${activeBgSection}_shadow_direction`] || 'bottom';
                            const depth = localData.webTexts?.[`${activeBgSection}_shadow_depth`] || '40';
                            const opacity = localData.webTexts?.[`${activeBgSection}_shadow_opacity`] || '0.85';
                            const colorMode = localData.webTexts?.[`${activeBgSection}_shadow_color_mode`] || 'auto';
                            const customColor = localData.webTexts?.[`${activeBgSection}_shadow_custom_color`] || '';

                            const sections = [
                              'home', 'projects', 'skills', 'experience', 'contact', 'about_story',
                              'about_subpage_education', 'about_subpage_personality', 'about_subpage_hobbies',
                              'about_subpage_career_goals'
                            ];
                            handleUpdate(prev => {
                              const newTexts = { ...(prev.webTexts || {}) };
                              sections.forEach(sec => {
                                newTexts[`${sec}_shadow_enabled`] = enabled;
                                newTexts[`${sec}_shadow_direction`] = dir;
                                newTexts[`${sec}_shadow_depth`] = depth;
                                newTexts[`${sec}_shadow_opacity`] = opacity;
                                newTexts[`${sec}_shadow_color_mode`] = colorMode;
                                newTexts[`${sec}_shadow_custom_color`] = customColor;
                              });
                              if (activeBgSection === 'home') {
                                newTexts['hero_shadow_enabled'] = enabled;
                                newTexts['hero_shadow_direction'] = dir;
                                newTexts['hero_shadow_depth'] = depth;
                                newTexts['hero_shadow_opacity'] = opacity;
                                newTexts['hero_shadow_color_mode'] = colorMode;
                                newTexts['hero_shadow_custom_color'] = customColor;
                              }
                              return { ...prev, webTexts: newTexts };
                            });
                            setAppliedAllNotice(true);
                            setTimeout(() => setAppliedAllNotice(false), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Terapkan ke Semua Halaman</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'home', label: '🏠 Beranda' },
                          { id: 'projects', label: '📂 Projek' },
                          { id: 'skills', label: '⚡ Skills' },
                          { id: 'experience', label: '💼 Pengalaman' },
                          { id: 'contact', label: '✉️ Kontak' },
                          { id: 'about_story', label: '📖 Kisah Saya' },
                          { id: 'about_subpage_education', label: '🎓 Pendidikan' },
                          { id: 'about_subpage_personality', label: '🧠 Kepribadian' },
                          { id: 'about_subpage_hobbies', label: '🎨 Hobi' },
                          { id: 'about_subpage_career_goals', label: '🎯 Target Karir' }
                        ].map((sec) => (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => setActiveBgSection(sec.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeBgSection === sec.id
                                ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40'
                                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                            }`}
                          >
                            {sec.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {appliedAllNotice && (
                      <div className="px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pengaturan bayangan gradasi berhasil diterapkan ke semua halaman!</span>
                      </div>
                    )}

                    {/* Master Switch: Enable / Disable */}
                    {(() => {
                      const enabledKey = `${activeBgSection}_shadow_enabled`;
                      const isEnabled = localData.webTexts?.[enabledKey] === 'true' || (activeBgSection === 'home' && localData.webTexts?.hero_shadow_enabled === 'true');

                      return (
                        <div className={`p-4 rounded-xl border ${cardBg} flex items-center justify-between gap-4`}>
                          <div>
                            <span className="font-bold text-xs text-slate-200 block">
                              Aktifkan Bayangan Gradasi Halaman ({activeBgSection.toUpperCase()})
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              Menampilkan gradasi bayangan halus di sisi tepi halaman ini
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const nextVal = isEnabled ? 'false' : 'true';
                              handleWebTextChange(enabledKey, nextVal, editLang);
                              if (activeBgSection === 'home') {
                                handleWebTextChange('hero_shadow_enabled', nextVal, editLang);
                              }
                            }}
                            className={`w-12 h-6 rounded-full transition-colors cursor-pointer p-0.5 flex items-center ${
                              isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
                          </button>
                        </div>
                      );
                    })()}

                    {/* Shadow Detailed Controls */}
                    {(() => {
                      const dirKey = `${activeBgSection}_shadow_direction`;
                      const depthKey = `${activeBgSection}_shadow_depth`;
                      const opacityKey = `${activeBgSection}_shadow_opacity`;
                      const colorModeKey = `${activeBgSection}_shadow_color_mode`;
                      const customColorKey = `${activeBgSection}_shadow_custom_color`;

                      const currentDir = localData.webTexts?.[dirKey] || (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_direction : undefined) || 'bottom';
                      const currentDepth = parseFloat(localData.webTexts?.[depthKey] || (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_depth : undefined) || '40');
                      const currentOpacity = parseFloat(localData.webTexts?.[opacityKey] || (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_opacity : undefined) || '0.85');
                      const currentColorMode = localData.webTexts?.[colorModeKey] || (activeBgSection === 'home' ? localData.webTexts?.hero_shadow_color_mode : undefined) || 'auto';
                      const currentCustomColor = localData.webTexts?.[customColorKey] || '#000000';
                      const enabledKey = `${activeBgSection}_shadow_enabled`;
                      const isEnabled = localData.webTexts?.[enabledKey] === 'true' || (activeBgSection === 'home' && localData.webTexts?.hero_shadow_enabled === 'true');

                      return (
                        <div className="space-y-4">
                          {/* Live Simulation Preview */}
                          <div className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                              <span className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-purple-400" />
                                <span>Simulasi Tampilan Bayangan:</span>
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                                {isEnabled ? '🟢 AKTIF' : '⚪ NON-AKTIF'}
                              </span>
                            </div>
                            <div className="relative w-full h-20 rounded-lg bg-slate-900 border border-slate-700/80 overflow-hidden flex items-center justify-center">
                              <div className="text-[10px] text-slate-500 font-mono select-none z-10">
                                {activeBgSection.toUpperCase()} PREVIEW CANVAS
                              </div>
                              {isEnabled && (
                                <div
                                  className="absolute inset-0 pointer-events-none transition-all duration-200"
                                  style={{
                                    background:
                                      currentDir === 'bottom'
                                        ? `linear-gradient(to top, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                                        : currentDir === 'top'
                                        ? `linear-gradient(to bottom, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                                        : currentDir === 'top_bottom'
                                        ? `linear-gradient(to top, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%), linear-gradient(to bottom, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                                        : currentDir === 'left'
                                        ? `linear-gradient(to right, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                                        : currentDir === 'right'
                                        ? `linear-gradient(to left, rgba(0,0,0,${currentOpacity}) 0%, transparent ${currentDepth}%)`
                                        : `radial-gradient(ellipse at center, transparent ${Math.max(0, 100 - currentDepth)}%, rgba(0,0,0,${currentOpacity}) 100%)`
                                  }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Direction Selector */}
                          <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <Move className="w-3.5 h-3.5 text-purple-400" />
                              <span>Pilih Arah / Posisi Bayangan:</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                { id: 'bottom', label: '⬇️ Bawah (Bottom)', desc: 'Gradasi dari bawah' },
                                { id: 'top', label: '⬆️ Atas (Top)', desc: 'Gradasi dari atas' },
                                { id: 'top_bottom', label: '↕️ Atas & Bawah', desc: 'Dua sisi vertikal' },
                                { id: 'left', label: '⬅️ Kiri (Left)', desc: 'Gradasi dari kiri' },
                                { id: 'right', label: '➡️ Kanan (Right)', desc: 'Gradasi dari kanan' },
                                { id: 'all', label: '🔲 Sekeliling (Vignette)', desc: '4 sudut melingkar' }
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    handleWebTextChange(dirKey, item.id, editLang);
                                    if (activeBgSection === 'home') {
                                      handleWebTextChange('hero_shadow_direction', item.id, editLang);
                                    }
                                  }}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                    currentDir === item.id
                                      ? 'border-purple-500 ring-2 ring-purple-500/40 bg-purple-500/15 text-white'
                                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  <span className="font-bold text-[11px] block">{item.label}</span>
                                  <span className="text-[9.5px] opacity-75 block mt-0.5">{item.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Depth / Thickness Slider */}
                          <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                                <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                                <span>Ketebalan / Jangkauan Bayangan:</span>
                              </label>
                              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                                {currentDepth}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="95"
                              step="5"
                              value={currentDepth}
                              onChange={(e) => {
                                handleWebTextChange(depthKey, e.target.value, editLang);
                                if (activeBgSection === 'home') {
                                  handleWebTextChange('hero_shadow_depth', e.target.value, editLang);
                                }
                              }}
                              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>10% (Tipis di pinggir)</span>
                              <span>50% (Sedang)</span>
                              <span>95% (Hampir Penuh)</span>
                            </div>
                          </div>

                          {/* Opacity / Intensity Slider */}
                          <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                                <span>Kepekatan / Intensitas Bayangan:</span>
                              </label>
                              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                {Math.round(currentOpacity * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="1.0"
                              step="0.05"
                              value={currentOpacity}
                              onChange={(e) => {
                                handleWebTextChange(opacityKey, e.target.value, editLang);
                                if (activeBgSection === 'home') {
                                  handleWebTextChange('hero_shadow_opacity', e.target.value, editLang);
                                }
                              }}
                              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>10% (Sangat Halus)</span>
                              <span>50% (Natural)</span>
                              <span>100% (Sangat Pekat)</span>
                            </div>
                          </div>

                          {/* Shadow Color Mode */}
                          <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <Palette className="w-3.5 h-3.5 text-teal-400" />
                              <span>Warna Bayangan Gradasi:</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {[
                                { id: 'auto', label: '🎨 Otomatis', desc: 'Kontras Alami' },
                                { id: 'black', label: '⚫ Hitam', desc: 'Bayangan Gelap' },
                                { id: 'white', label: '⚪ Putih', desc: 'Gradasi Terang' },
                                { id: 'accent', label: '💎 Aksen', desc: 'Sesuai Aksen' },
                                { id: 'custom', label: '🖌️ Custom', desc: 'Pilih Warna' }
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    handleWebTextChange(colorModeKey, item.id, editLang);
                                    if (activeBgSection === 'home') {
                                      handleWebTextChange('hero_shadow_color_mode', item.id, editLang);
                                    }
                                  }}
                                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                    currentColorMode === item.id
                                      ? 'border-teal-500 ring-2 ring-teal-500/40 bg-teal-500/15 text-white'
                                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  <span className="font-bold text-[11px] block">{item.label}</span>
                                  <span className="text-[9px] opacity-75 block">{item.desc}</span>
                                </button>
                              ))}
                            </div>

                            {/* Custom Color Input if 'custom' is selected */}
                            {currentColorMode === 'custom' && (
                              <div className="flex items-center gap-2 pt-2">
                                <input
                                  type="color"
                                  value={currentCustomColor.startsWith('#') ? currentCustomColor : '#000000'}
                                  onChange={(e) => {
                                    handleWebTextChange(customColorKey, e.target.value, editLang);
                                    if (activeBgSection === 'home') {
                                      handleWebTextChange('hero_shadow_custom_color', e.target.value, editLang);
                                    }
                                  }}
                                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer p-0.5 bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={currentCustomColor}
                                  onChange={(e) => {
                                    handleWebTextChange(customColorKey, e.target.value, editLang);
                                    if (activeBgSection === 'home') {
                                      handleWebTextChange('hero_shadow_custom_color', e.target.value, editLang);
                                    }
                                  }}
                                  placeholder="#000000"
                                  className={inputClass}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 3. FOTO & AVATAR / BANNER IMAGES MANAGER */}
                {assetTab === 'images' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                          <Image className="w-3.5 h-3.5" />
                          <span>
                            {activeBgSection === 'about_subpage_education' ? '🎓 Aset Gambar: Halaman Pendidikan' :
                             activeBgSection === 'about_subpage_personality' ? '💎 Aset Gambar: Halaman Kepribadian' :
                             activeBgSection === 'about_subpage_hobbies' ? '🎨 Aset Gambar: Halaman Hobi & Minat' :
                             activeBgSection === 'about_subpage_career_goals' ? '🚀 Aset Gambar: Halaman Target Karir' :
                             activeBgSection === 'about_story' ? '📖 Aset Gambar: Halaman Kisah Saya' :
                             activeBgSection === 'experience' ? '💼 Aset Gambar: Perjalanan Karir' :
                             activeBgSection === 'projects' ? '📂 Aset Gambar: Studi Kasus' :
                             activeBgSection === 'skills' ? '⚡ Aset Gambar: Keahlian (Skills)' :
                             activeBgSection === 'contact' ? '✉️ Aset Gambar: Kontak & Footer' :
                             '🏠 Aset Foto & Banner Beranda'}
                          </span>
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          Pilih konteks halaman untuk mengelola aset gambar banner atau foto yang sesuai
                        </p>
                      </div>
                    </div>

                    {/* Quick Section Switcher Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-medium scrollbar-thin">
                      {[
                        { id: 'home', label: '🏠 Beranda / Avatar' },
                        { id: 'skills', label: '⚡ Skills' },
                        { id: 'about_story', label: '📖 Kisah Saya' },
                        { id: 'about_subpage_education', label: '🎓 Pendidikan' },
                        { id: 'about_subpage_personality', label: '💎 Kepribadian' },
                        { id: 'about_subpage_hobbies', label: '🎨 Hobi' },
                        { id: 'about_subpage_career_goals', label: '🚀 Target Karir' },
                        ...(localData.customSubPages || []).map(p => ({
                          id: `subpage_${p.id}`,
                          label: `📄 ${editLang === 'id' ? p.titleId : p.titleEn}`
                        })),
                        { id: 'experience', label: '💼 Pengalaman' },
                        { id: 'projects', label: '📂 Proyek' },
                        { id: 'contact', label: '✉️ Kontak' }
                      ].map((sec) => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setActiveBgSection(sec.id)}
                          className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap border cursor-pointer ${
                            activeBgSection === sec.id
                              ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-xs'
                              : isDark
                                ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>

                    {/* CONTEXT 1: EDUCATION PAGE ASSETS */}
                    {activeBgSection === 'about_subpage_education' && (
                      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                        <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Banner Header Halaman Pendidikan</span>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400">
                            URL Gambar Banner Header
                          </label>
                          <input
                            type="text"
                            value={localData.webTexts?.education_header_bg_url || ''}
                            onChange={(e) => handleWebTextChange('education_header_bg_url', e.target.value, editLang)}
                            placeholder="https://... atau unggah gambar banner"
                            className={inputClass}
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Banner Pendidikan</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleWebTextImageUpload(e, 'education_header_bg_url')}
                            />
                          </label>
                        </div>
                        {/* Scale & Position Sliders */}
                        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Zoom Scale:</span>
                              <span className="font-mono text-emerald-400">{(parseFloat(localData.webTexts?.education_header_bg_scale || '1')).toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="2.5"
                              step="0.05"
                              value={parseFloat(localData.webTexts?.education_header_bg_scale || '1')}
                              onChange={(e) => handleWebTextChange('education_header_bg_scale', e.target.value, editLang)}
                              className="w-full accent-emerald-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser X:</span>
                              <span className="font-mono text-emerald-400">{localData.webTexts?.education_header_bg_x || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.education_header_bg_x || '0', 10)}
                              onChange={(e) => handleWebTextChange('education_header_bg_x', e.target.value, editLang)}
                              className="w-full accent-emerald-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser Y:</span>
                              <span className="font-mono text-emerald-400">{localData.webTexts?.education_header_bg_y || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.education_header_bg_y || '0', 10)}
                              onChange={(e) => handleWebTextChange('education_header_bg_y', e.target.value, editLang)}
                              className="w-full accent-emerald-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 2: PERSONALITY PAGE ASSETS */}
                    {activeBgSection === 'about_subpage_personality' && (
                      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                        <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Smile className="w-3.5 h-3.5" />
                          <span>Banner Header Halaman Kepribadian</span>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400">
                            URL Gambar Banner Header
                          </label>
                          <input
                            type="text"
                            value={localData.webTexts?.personality_header_bg_url || ''}
                            onChange={(e) => handleWebTextChange('personality_header_bg_url', e.target.value, editLang)}
                            placeholder="https://... atau unggah gambar banner"
                            className={inputClass}
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Banner Kepribadian</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleWebTextImageUpload(e, 'personality_header_bg_url')}
                            />
                          </label>
                        </div>
                        {/* Scale & Position Sliders */}
                        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Zoom Scale:</span>
                              <span className="font-mono text-purple-400">{(parseFloat(localData.webTexts?.personality_header_bg_scale || '1')).toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="2.5"
                              step="0.05"
                              value={parseFloat(localData.webTexts?.personality_header_bg_scale || '1')}
                              onChange={(e) => handleWebTextChange('personality_header_bg_scale', e.target.value, editLang)}
                              className="w-full accent-purple-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser X:</span>
                              <span className="font-mono text-purple-400">{localData.webTexts?.personality_header_bg_x || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.personality_header_bg_x || '0', 10)}
                              onChange={(e) => handleWebTextChange('personality_header_bg_x', e.target.value, editLang)}
                              className="w-full accent-purple-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser Y:</span>
                              <span className="font-mono text-purple-400">{localData.webTexts?.personality_header_bg_y || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.personality_header_bg_y || '0', 10)}
                              onChange={(e) => handleWebTextChange('personality_header_bg_y', e.target.value, editLang)}
                              className="w-full accent-purple-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 3: HOBBIES PAGE ASSETS */}
                    {activeBgSection === 'about_subpage_hobbies' && (
                      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5" />
                          <span>Banner Header Halaman Hobi & Minat</span>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400">
                            URL Gambar Banner Header
                          </label>
                          <input
                            type="text"
                            value={localData.webTexts?.hobbies_header_bg_url || ''}
                            onChange={(e) => handleWebTextChange('hobbies_header_bg_url', e.target.value, editLang)}
                            placeholder="https://... atau unggah gambar banner"
                            className={inputClass}
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Banner Hobi</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleWebTextImageUpload(e, 'hobbies_header_bg_url')}
                            />
                          </label>
                        </div>
                        {/* Scale & Position Sliders */}
                        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Zoom Scale:</span>
                              <span className="font-mono text-amber-400">{(parseFloat(localData.webTexts?.hobbies_header_bg_scale || '1')).toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="2.5"
                              step="0.05"
                              value={parseFloat(localData.webTexts?.hobbies_header_bg_scale || '1')}
                              onChange={(e) => handleWebTextChange('hobbies_header_bg_scale', e.target.value, editLang)}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser X:</span>
                              <span className="font-mono text-amber-400">{localData.webTexts?.hobbies_header_bg_x || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.hobbies_header_bg_x || '0', 10)}
                              onChange={(e) => handleWebTextChange('hobbies_header_bg_x', e.target.value, editLang)}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser Y:</span>
                              <span className="font-mono text-amber-400">{localData.webTexts?.hobbies_header_bg_y || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.hobbies_header_bg_y || '0', 10)}
                              onChange={(e) => handleWebTextChange('hobbies_header_bg_y', e.target.value, editLang)}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 4: CAREER GOALS PAGE ASSETS */}
                    {activeBgSection === 'about_subpage_career_goals' && (
                      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                        <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          <span>Banner Header Halaman Target Karir</span>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400">
                            URL Gambar Banner Header
                          </label>
                          <input
                            type="text"
                            value={localData.webTexts?.career_goals_header_bg_url || ''}
                            onChange={(e) => handleWebTextChange('career_goals_header_bg_url', e.target.value, editLang)}
                            placeholder="https://... atau unggah gambar banner"
                            className={inputClass}
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Banner Target Karir</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleWebTextImageUpload(e, 'career_goals_header_bg_url')}
                            />
                          </label>
                        </div>
                        {/* Scale & Position Sliders */}
                        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Zoom Scale:</span>
                              <span className="font-mono text-blue-400">{(parseFloat(localData.webTexts?.career_goals_header_bg_scale || '1')).toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="2.5"
                              step="0.05"
                              value={parseFloat(localData.webTexts?.career_goals_header_bg_scale || '1')}
                              onChange={(e) => handleWebTextChange('career_goals_header_bg_scale', e.target.value, editLang)}
                              className="w-full accent-blue-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser X:</span>
                              <span className="font-mono text-blue-400">{localData.webTexts?.career_goals_header_bg_x || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.career_goals_header_bg_x || '0', 10)}
                              onChange={(e) => handleWebTextChange('career_goals_header_bg_x', e.target.value, editLang)}
                              className="w-full accent-blue-500 cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>Geser Y:</span>
                              <span className="font-mono text-blue-400">{localData.webTexts?.career_goals_header_bg_y || '0'}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={parseInt(localData.webTexts?.career_goals_header_bg_y || '0', 10)}
                              onChange={(e) => handleWebTextChange('career_goals_header_bg_y', e.target.value, editLang)}
                              className="w-full accent-blue-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 5: ABOUT STORY PAGE ASSETS */}
                    {activeBgSection === 'about_story' && (
                      <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                        <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Foto &amp; Banner Halaman Kisah Saya (About Story)</span>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400">
                            URL Gambar / Foto Kisah Saya
                          </label>
                          <input
                            type="text"
                            value={localData.webTexts?.about_story_image_url || ''}
                            onChange={(e) => handleWebTextChange('about_story_image_url', e.target.value, editLang)}
                            placeholder="https://... atau unggah foto"
                            className={inputClass}
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah Foto Kisah Saya</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleWebTextImageUpload(e, 'about_story_image_url')}
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 5B: CUSTOM ABOUT ME SUBPAGES ASSETS */}
                    {activeBgSection.startsWith('subpage_') && !['subpage_education', 'subpage_personality', 'subpage_hobbies', 'subpage_career_goals'].includes(activeBgSection) && (() => {
                      const customId = activeBgSection.replace('subpage_', '');
                      const customPage = (localData.customSubPages || []).find(p => p.id === customId);
                      return (
                        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5" />
                            <span>Banner Header: {customPage ? (editLang === 'id' ? customPage.titleId : customPage.titleEn) : 'Halaman Kustom'}</span>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400">
                              URL Gambar Banner Header
                            </label>
                            <input
                              type="text"
                              value={localData.webTexts?.[`${customId}_header_bg_url`] || (customPage as any)?.coverImageUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleWebTextChange(`${customId}_header_bg_url`, val, editLang);
                                if (customPage) {
                                  handleUpdate(prev => ({
                                    ...prev,
                                    customSubPages: (prev.customSubPages || []).map(p => p.id === customPage.id ? { ...p, coverImageUrl: val } : p)
                                  }));
                                }
                              }}
                              placeholder="https://... atau unggah gambar banner"
                              className={inputClass}
                            />
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Unggah Banner Halaman</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const base64 = await uploadFileToStorage(file);
                                    handleWebTextChange(`${customId}_header_bg_url`, base64, editLang);
                                    if (customPage) {
                                      handleUpdate(prev => ({
                                        ...prev,
                                        customSubPages: (prev.customSubPages || []).map(p => p.id === customPage.id ? { ...p, coverImageUrl: base64 } : p)
                                      }));
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CONTEXT 6: SKILLS PAGE (NO RASTER ASSETS - SVG ONLY INFO) */}
                    {activeBgSection === 'skills' && (
                      <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-amber-300">
                            ⚡ Halaman Keahlian (Skills) Menggunakan Vektor SVG
                          </h5>
                          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Halaman Skills tidak menggunakan gambar banner atau foto profil karena dirancang bersih dengan <strong>logo SVG vektor murni</strong> agar tajam dan berbobot ringan.
                          </p>
                        </div>
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditorMode(editLang);
                              setActiveTab('skills');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Buka Pengaturan Skill &amp; SVG (Seksi 9)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAssetTab('bg_patterns')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Brush className="w-3.5 h-3.5 text-purple-400" />
                            <span>Atur Pola SVG Background</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 7: EXPERIENCE PAGE (TIMELINE INFO) */}
                    {activeBgSection === 'experience' && (
                      <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-blue-300">
                            💼 Tidak Ada Banner Gambar di Halaman Pengalaman
                          </h5>
                          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Halaman Pengalaman disajikan dalam format linimasa karir terstruktur. Pengaturan teks dan logo institusi dikelola langsung pada tab Bahasa (Seksi 6 &amp; 7).
                          </p>
                        </div>
                        <div className="pt-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditorMode(editLang);
                              setActiveTab('experiences');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Buka Seksi Linimasa Karir</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 8: PROJECTS PAGE (PORTFOLIO INFO) */}
                    {activeBgSection === 'projects' && (
                      <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                          <FolderGit2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-indigo-300">
                            📂 Gambar Mockup Dikelola Per Item Projek
                          </h5>
                          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Gambar thumbnail dan mockup studi kasus diatur secara spesifik pada masing-masing item projek di tab Bahasa (Seksi 8).
                          </p>
                        </div>
                        <div className="pt-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditorMode(editLang);
                              setActiveTab('projects');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Buka Seksi Projek &amp; Studi Kasus</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 9: CONTACT PAGE */}
                    {activeBgSection === 'contact' && (
                      <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3.5`}>
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-emerald-300">
                            ✉️ Tidak Ada Aset Gambar di Halaman Kontak &amp; Footer
                          </h5>
                          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Seksi Kontak dirancang bersih dan minimalis dengan fokus pada formulir pesan, kartu sosial media, dan informasi narahubung.
                          </p>
                        </div>
                        <div className="pt-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditorMode(editLang);
                              setActiveTab('contact');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Buka Seksi Kontak &amp; Sosial Media</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTEXT 10: HOME / HERO SECTION ASSETS (PROFILE & HERO CARD) */}
                    {(activeBgSection === 'home' || activeBgSection === '' || activeBgSection === 'hero') && (
                      <>
                        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>Foto Profil / Avatar Utama</span>
                            </div>
                            {localData.avatarUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdate(prev => ({ ...prev, avatarScale: 1, avatarX: 0, avatarY: 0 }));
                                }}
                                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reset Posisi</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-start gap-4">
                            {/* Live Avatar Preview */}
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-800 shrink-0 relative flex items-center justify-center">
                              {localData.avatarUrl ? (
                                <img
                                  src={localData.avatarUrl}
                                  alt="Avatar Preview"
                                  className="w-full h-full object-cover transition-transform duration-75"
                                  style={{
                                    transform: `scale(${localData.avatarScale || 1}) translate(${localData.avatarX || 0}px, ${localData.avatarY || 0}px)`
                                  }}
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <User className="w-8 h-8 text-slate-500" />
                              )}
                            </div>

                            {/* Input & Upload Controls */}
                            <div className="flex-1 space-y-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                  URL Gambar Avatar
                                </label>
                                <input
                                  type="text"
                                  value={localData.avatarUrl || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    handleUpdate(prev => ({ ...prev, avatarUrl: val }));
                                  }}
                                  placeholder="https://... atau unggah file"
                                  className={inputClass}
                                />
                              </div>

                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow transition-all active:scale-95">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Unggah Foto dari Perangkat</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'avatarUrl')}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Sliders for Avatar Scale, X, Y */}
                          {localData.avatarUrl && (
                            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Zoom:</span>
                                  <span className="font-mono text-emerald-400">{(localData.avatarScale || 1).toFixed(2)}x</span>
                                </div>
                                <input
                                  type="range"
                                  min="0.5"
                                  max="2.5"
                                  step="0.05"
                                  value={localData.avatarScale || 1}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    handleUpdate(prev => ({ ...prev, avatarScale: val }));
                                  }}
                                  className="w-full accent-emerald-500 cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Geser X:</span>
                                  <span className="font-mono text-emerald-400">{localData.avatarX || 0}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="-100"
                                  max="100"
                                  step="1"
                                  value={localData.avatarX || 0}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    handleUpdate(prev => ({ ...prev, avatarX: val }));
                                  }}
                                  className="w-full accent-emerald-500 cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Geser Y:</span>
                                  <span className="font-mono text-emerald-400">{localData.avatarY || 0}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="-100"
                                  max="100"
                                  step="1"
                                  value={localData.avatarY || 0}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    handleUpdate(prev => ({ ...prev, avatarY: val }));
                                  }}
                                  className="w-full accent-emerald-500 cursor-pointer"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Foto Hero Beranda */}
                        <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5" />
                            <span>Foto Hero / Kartu Beranda (Home Image)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-400">
                                Foto Hero (Mode Terang)
                              </label>
                              <input
                                type="text"
                                value={localData.homeImageUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdate(prev => ({ ...prev, homeImageUrl: val }));
                                }}
                                placeholder="URL foto mode terang"
                                className={inputClass}
                              />
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition-all">
                                <Upload className="w-3 h-3 text-purple-400" />
                                <span>Pilih File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'homeImageUrl')}
                                />
                              </label>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-400">
                                Foto Hero (Mode Gelap)
                              </label>
                              <input
                                type="text"
                                value={localData.homeImageUrlDark || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdate(prev => ({ ...prev, homeImageUrlDark: val }));
                                }}
                                placeholder="URL foto mode gelap"
                                className={inputClass}
                              />
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer transition-all">
                                <Upload className="w-3 h-3 text-purple-400" />
                                <span>Pilih File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'homeImageUrlDark')}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Scale & Position Sliders for Home Image */}
                          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Zoom Scale:</span>
                                <span className="font-mono text-purple-400">{(localData.homeImageScale || 1).toFixed(2)}x</span>
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="2.5"
                                step="0.05"
                                value={localData.homeImageScale || 1}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  handleUpdate(prev => ({ ...prev, homeImageScale: val }));
                                }}
                                className="w-full accent-purple-500 cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Geser X:</span>
                                <span className="font-mono text-purple-400">{localData.homeImageX || 0}px</span>
                              </div>
                              <input
                                type="range"
                                min="-150"
                                max="150"
                                step="1"
                                value={localData.homeImageX || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  handleUpdate(prev => ({ ...prev, homeImageX: val }));
                                }}
                                className="w-full accent-purple-500 cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Geser Y:</span>
                                <span className="font-mono text-purple-400">{localData.homeImageY || 0}px</span>
                              </div>
                              <input
                                type="range"
                                min="-150"
                                max="150"
                                step="1"
                                value={localData.homeImageY || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  handleUpdate(prev => ({ ...prev, homeImageY: val }));
                                }}
                                className="w-full accent-purple-500 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Fade, Circle Size & Position Controls */}
                          <div className="pt-2 border-t border-slate-800 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Fade Gambar:</span>
                                  <span className="font-mono text-purple-400">{((localData as any).homeImageFade ?? 0).toFixed(2)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.05"
                                  value={(localData as any).homeImageFade ?? 0}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    handleUpdate(prev => ({ ...prev, homeImageFade: val } as any));
                                  }}
                                  className="w-full accent-purple-500 cursor-pointer"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Lingkaran SVG Scale:</span>
                                  <span className="font-mono text-purple-400">{((localData as any).homeImageCircleScale ?? 1).toFixed(2)}x</span>
                                </div>
                                <input
                                  type="range"
                                  min="0.5"
                                  max="2.5"
                                  step="0.05"
                                  value={(localData as any).homeImageCircleScale ?? 1}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    handleUpdate(prev => ({ ...prev, homeImageCircleScale: val } as any));
                                  }}
                                  className="w-full accent-purple-500 cursor-pointer"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Lingkaran Geser X:</span>
                                  <span className="font-mono text-purple-400">{((localData as any).homeImageCircleX ?? 0)}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="-150"
                                  max="150"
                                  step="1"
                                  value={(localData as any).homeImageCircleX ?? 0}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    handleUpdate(prev => ({ ...prev, homeImageCircleX: val } as any));
                                  }}
                                  className="w-full accent-purple-500 cursor-pointer"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Lingkaran Geser Y:</span>
                                  <span className="font-mono text-purple-400">{((localData as any).homeImageCircleY ?? 0)}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="-150"
                                  max="150"
                                  step="1"
                                  value={(localData as any).homeImageCircleY ?? 0}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    handleUpdate(prev => ({ ...prev, homeImageCircleY: val } as any));
                                  }}
                                  className="w-full accent-purple-500 cursor-pointer"
                                />
                              </div>
                            </div>
                            
                            {/* Mask Style Controls */}
                            <div className="pt-4 border-t border-slate-800 space-y-3">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Gaya Fade Gambar:</span>
                                <span className="font-mono text-purple-400">
                                  {(localData.webTexts?.home_image_mask_style || 'normal').replace('_', ' ')}
                                </span>
                              </div>
                              <select
                                onChange={(e) => {
                                  handleWebTextChange('home_image_mask_style', e.target.value, editLang);
                                }}
                                className="w-full px-3 py-2 rounded border bg-slate-800/20 text-slate-200 focus:border-emerald-500"
                              >
                                <option value="normal">Normal</option>
                                <option value="fade_bottom">Fade Bawah</option>
                                <option value="fade_circle">Fade Lingkaran</option>
                                <option value="fade_edge">Fade Tepi</option>
                                <option value="fade_glow_aura">Fade Aura Glow</option>
                              </select>
                            </div>
                            
                            {/* Fade Depth Control */}
                            <div className="pt-4 border-t border-slate-800 space-y-3">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Kedalaman Fade:</span>
                                <span className="font-mono text-purple-400">
                                  {localData.webTexts?.home_image_fade_depth || '66'}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={parseInt(localData.webTexts?.home_image_fade_depth || '66')}
                                onChange={(e) => {
                                  handleWebTextChange('home_image_fade_depth', e.target.value, editLang);
                                }}
                                className="w-full accent-purple-500 cursor-pointer"
                              />
                            </div>
                            
                            {/* Fade Width Control */}
                            <div className="pt-4 border-t border-slate-800 space-y-3">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Lebar Fade:</span>
                                <span className="font-mono text-purple-400">
                                  {localData.webTexts?.home_image_fade_width || '84'}%
                                </span>
                              </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={parseInt(localData.webTexts?.home_image_fade_width || '84')}
                                  onChange={(e) => {
                                    handleWebTextChange('home_image_fade_width', e.target.value, editLang);
                                  }}
                                  className="w-full accent-purple-500 cursor-pointer"
                                />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* FALLBACK FOR UNRECOGNIZED SECTIONS */}
                    {![
                      'about_subpage_education',
                      'about_subpage_personality',
                      'about_subpage_hobbies',
                      'about_subpage_career_goals',
                      'about_story',
                      'skills',
                      'experience',
                      'projects',
                      'contact',
                      'home',
                      '',
                      'hero'
                    ].includes(activeBgSection) && (
                      <div className={`p-5 rounded-xl border ${cardBg} text-center space-y-3`}>
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400">
                          <ImageOff className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-slate-300">
                            Tidak Ada Aset Khusus Untuk Halaman Ini
                          </h5>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Halaman ini tidak memerlukan konfigurasi gambar atau banner khusus. Anda dapat mengatur Pola Background SVG atau Warna Tema pada tab di atas.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. ID CARD & VEKTOR GRAFIS */}
                {assetTab === 'idcard' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>ID Card Vektor &amp; Badge Visual</span>
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          Kustomisasi teks timbul, fade portrait, dan ornamen kartu ID
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">
                            Grup Tag Kartu (Mis: [TECH CORP])
                          </label>
                          <input
                            type="text"
                            value={localData.idCardGroup || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdate(prev => ({ ...prev, idCardGroup: val }));
                            }}
                            placeholder="[BUSINESS INTEL]"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">
                            Sub-Teks / ID Card Code
                          </label>
                          <input
                            type="text"
                            value={localData.idCardSubText || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdate(prev => ({ ...prev, idCardSubText: val }));
                            }}
                            placeholder="CORP ID: BI-2024-X"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Portrait Fade Toggle */}
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localData.idCardPortraitFadeEnabled !== false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              handleUpdate(prev => ({ ...prev, idCardPortraitFadeEnabled: checked }));
                            }}
                            className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-300">
                            Aktifkan Efek Halus Gradasi Portrait (Fade Bottom)
                          </span>
                        </label>
                      </div>

                      {/* ID Card Background Text Size Slider */}
                      <div className="pt-2 border-t border-slate-800">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>Ukuran Teks Latar Belakang Kartu:</span>
                          <span className="font-mono text-purple-400">{localData.idCardBgTextSize || 18}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="40"
                          step="1"
                          value={localData.idCardBgTextSize || 18}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            handleUpdate(prev => ({ ...prev, idCardBgTextSize: val }));
                          }}
                          className="w-full accent-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. EFEK GOOEY CURSOR (LIGHTSWIND STYLE) */}
                {assetTab === 'gooey_cursor' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gooey Liquid Metaball Cursor</span>
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          Efek cairan metaballs SVG yang interaktif &amp; reaktif mengikuti gerakan mouse (Lightswind Style)
                        </p>
                      </div>
                    </div>

                    {/* Toggle Aktif / Nonaktif */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-200">Status Efek Kursor</p>
                          <p className="text-[10px] text-slate-400">Aktifkan efek kursor cairan metaball di seluruh website</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const current = localData.webTexts?.enable_gooey_cursor !== 'false';
                            handleWebTextChange('enable_gooey_cursor', current ? 'false' : 'true', editLang);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                            localData.webTexts?.enable_gooey_cursor !== 'false'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${localData.webTexts?.enable_gooey_cursor !== 'false' ? 'bg-emerald-300 animate-pulse' : 'bg-slate-500'}`} />
                          <span>{localData.webTexts?.enable_gooey_cursor !== 'false' ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </div>

                      {/* Tampilan Kepala Kursor (Mata Ulat / Polos / Titik) */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-200">Tampilan Kepala Kursor</p>
                            <p className="text-[10px] text-slate-400">Pilih gaya indikator di ujung kepala cairan</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'eyes', label: '🐛 Mata Ulat', desc: 'Mata adaptif gerak' },
                            { id: 'none', label: '💧 Polos', desc: 'Tanpa titik/mata' },
                            { id: 'dot', label: '🎯 Titik Pusat', desc: 'Titik tengah klasik' }
                          ].map((styleOption) => {
                            const activeStyle = (localData.webTexts?.gooey_head_style || 'eyes') === styleOption.id;
                            return (
                              <button
                                key={styleOption.id}
                                type="button"
                                onClick={() => {
                                  handleWebTextChange('gooey_head_style', styleOption.id, editLang);
                                }}
                                className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                                  activeStyle
                                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500/50'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <p className="text-[11px] font-bold leading-tight">{styleOption.label}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{styleOption.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sembunyikan Kursor Bawaan Sistem */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <div>
                          <p className="text-xs font-bold text-slate-200">Sembunyikan Kursor Bawaan</p>
                          <p className="text-[10px] text-slate-400">Sembunyikan panah kursor bawaan OS dan hanya tampilkan bola cairan</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const current = localData.webTexts?.gooey_hide_default_cursor === 'true';
                            handleWebTextChange('gooey_hide_default_cursor', current ? 'false' : 'true', editLang);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                            localData.webTexts?.gooey_hide_default_cursor === 'true'
                              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span>{localData.webTexts?.gooey_hide_default_cursor === 'true' ? 'Disembunyikan' : 'Tampilkan Asli'}</span>
                        </button>
                      </div>

                      {/* Efek Splash Klik */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <div>
                          <p className="text-xs font-bold text-slate-200">Efek Splash Cairan Saat Klik</p>
                          <p className="text-[10px] text-slate-400">Percikan droplet cairan metaball yang memancar keluar saat mouse ditekan/klik</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const current = localData.webTexts?.gooey_cursor_splash !== 'false';
                            handleWebTextChange('gooey_cursor_splash', current ? 'false' : 'true', editLang);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                            localData.webTexts?.gooey_cursor_splash !== 'false'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{localData.webTexts?.gooey_cursor_splash !== 'false' ? 'Splash Aktif' : 'Splash Nonaktif'}</span>
                        </button>
                      </div>

                      {/* Membesar Saat Hover Objek */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <div>
                          <p className="text-xs font-bold text-slate-200">Membesar Saat Menyorot Objek</p>
                          <p className="text-[10px] text-slate-400">Perbesar ukuran lingkaran saat kursor berada di atas tombol atau tautan yang bisa diklik</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const current = localData.webTexts?.gooey_cursor_hover_scale === 'true';
                            handleWebTextChange('gooey_cursor_hover_scale', current ? 'false' : 'true', editLang);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                            localData.webTexts?.gooey_cursor_hover_scale === 'true'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span>{localData.webTexts?.gooey_cursor_hover_scale === 'true' ? 'Membesar (Aktif)' : 'Ukuran Tetap (Nonaktif)'}</span>
                        </button>
                      </div>

                      {/* Slider Besaran / Tebal Kursor */}
                      <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300">Besaran / Tebal Lingkaran Kursor</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {localData.webTexts?.gooey_cursor_size || '18'}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="45"
                          step="1"
                          value={parseInt(localData.webTexts?.gooey_cursor_size || '18', 10)}
                          onChange={(e) => {
                            handleWebTextChange('gooey_cursor_size', e.target.value, editLang);
                          }}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                          <span>10px (Kecil/Halus)</span>
                          <span>18px (Default)</span>
                          <span>45px (Tebal/Ekstra Besar)</span>
                        </div>
                      </div>

                      {/* Slider Transparansi / Opacity */}
                      <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300">Transparansi / Opacity Kursor</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {Math.round(parseFloat(localData.webTexts?.gooey_cursor_opacity || '0.8') * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="1.0"
                          step="0.05"
                          value={parseFloat(localData.webTexts?.gooey_cursor_opacity || '0.8')}
                          onChange={(e) => {
                            handleWebTextChange('gooey_cursor_opacity', e.target.value, editLang);
                          }}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                          <span>20% (Sangat Transparan)</span>
                          <span>80% (Default)</span>
                          <span>100% (Solid Pekat)</span>
                        </div>
                      </div>

                      {/* Info box */}
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 space-y-1.5">
                        <p className="font-semibold text-emerald-400 flex items-center gap-1">
                          <span>💡 Keunggulan Efek Gooey Cursor:</span>
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[10.5px]">
                          <li>Metaballs dinamis dengan SVG <code className="text-emerald-300">feGaussianBlur</code> &amp; <code className="text-emerald-300">feColorMatrix</code>.</li>
                          <li>Membesar otomatis saat hover di atas tombol, tautan, dan kartu portofolio.</li>
                          <li>Otomatis dinonaktifkan pada perangkat layar sentuh/HP agar navigasi tetap nyaman.</li>
                        </ul>
                      </div>

                      {/* Color controls */}
                      <div className="space-y-3 pt-2 border-t border-slate-800/80">
                        <label className="block text-[11px] font-bold text-slate-300">
                          Warna Kursor (Light &amp; Dark Mode)
                        </label>
                        {renderColorControls('gooey_cursor_color', 'gooey_cursor_color_dark', 'Warna Cairan Kursor', '#059669', '#10b981')}

                        <div className="pt-2">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">
                            Preset Warna Cepat:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'Emerald', light: '#059669', dark: '#10b981' },
                              { label: 'Cyan', light: '#0891b2', dark: '#06b6d4' },
                              { label: 'Rose', light: '#e11d48', dark: '#f43f5e' },
                              { label: 'Amber', light: '#d97706', dark: '#f59e0b' },
                              { label: 'Violet', light: '#7c3aed', dark: '#8b5cf6' },
                              { label: 'Sapphire', light: '#2563eb', dark: '#3b82f6' }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                  handleWebTextChange('gooey_cursor_color', preset.light, editLang);
                                  handleWebTextChange('gooey_cursor_color_dark', preset.dark, editLang);
                                }}
                                className="px-2 py-1 rounded-md text-[10px] font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                              >
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.dark }} />
                                <span>{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* ==================================================================== */}
            {/* TEXT EDITING MODE (INDONESIAN OR ENGLISH) */}
            {/* ==================================================================== */}
            {editorMode !== 'assets' && (
              <>

            {/* ==================================================================== */}
            {/* SUBPAGE 1: EDUCATION (PENDIDIKAN) */}
            {/* ==================================================================== */}
            {currentCategory === 'subpage_education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Halaman Pendidikan ({editLang.toUpperCase()})</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Pages Tab Admin</span>
                </div>

                {/* 1.1 Header & Cover */}
                <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                  <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    <span>Cover Header Halaman</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Judul Halaman ({editLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={getWebText('education_title', editLang)}
                      onChange={(e) => handleWebTextChange('education_title', e.target.value, editLang)}
                      placeholder="My Academic & Scientific Foundations"
                      className={inputClass}
                    />
                    {renderColorControls('education_title_color', 'education_title_color_dark', 'Judul Pendidikan')}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Intro / Pengantar ({editLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={getWebText('education_intro', editLang)}
                      onChange={(e) => handleWebTextChange('education_intro', e.target.value, editLang)}
                      placeholder="Tuliskan pengantar pendidikan..."
                      className={textareaClass}
                    />
                    {renderColorControls('education_intro_color', 'education_intro_color_dark', 'Intro Pendidikan', '#475569', '#94a3b8')}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      URL Background Banner Cover
                    </label>
                    <input
                      type="text"
                      value={localData.webTexts?.education_header_bg || ''}
                      onChange={(e) => handleWebTextChange('education_header_bg', e.target.value, 'en')}
                      placeholder="https://... atau /header.jpg"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* 1.2 Education Degrees List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Riwayat Gelar Pendidikan ({bilingualEduList.length})
                    </h5>
                    <button
                      type="button"
                      onClick={handleAddEdu}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Gelar</span>
                    </button>
                  </div>

                  {bilingualEduList.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-400 font-mono">#{idx + 1} Gelar</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEdu(pair.baseId)}
                            className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer"
                            title="Hapus Gelar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Gelar / Program Studi ({editLang.toUpperCase()})</label>
                          <input
                            type="text"
                            value={item?.degree || ''}
                            onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'degree', e.target.value)}
                            placeholder="Contoh: B.S. Applied Statistics & Computer Science"
                            className={inputClass}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Institusi ({editLang.toUpperCase()})</label>
                            <input
                              type="text"
                              value={item?.institution || ''}
                              onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'institution', e.target.value)}
                              placeholder="Universitas"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Tahun / Periode</label>
                            <input
                              type="text"
                              value={item?.period || ''}
                              onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'period', e.target.value)}
                              placeholder="2020 - 2024"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Deskripsi / Keterangan Gelar ({editLang.toUpperCase()})</label>
                          <textarea
                            rows={2}
                            value={item?.description || ''}
                            onChange={(e) => updateBilingualItem('education', pair.baseId, editLang, 'description', e.target.value)}
                            placeholder="Fokus studi, pencapaian akademik, dll..."
                            className={textareaClass}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 1.3 Education Story Slides (EducationSections) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Lembar Cerita / Slide Sesi ({getSubpageSections('education').length})
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleAddSubpageSection('education')}
                      className="px-2.5 py-1 rounded bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>

                  {getSubpageSections('education').map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-teal-400 font-mono">#{idx + 1} Slide Cerita</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubpageSection(pair.baseId)}
                            className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer"
                            title="Hapus Slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Judul Slide ({editLang.toUpperCase()})</label>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                            placeholder="Judul Slide Cerita"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Konten Narasi ({editLang.toUpperCase()})</label>
                          <textarea
                            rows={3}
                            value={item?.content || ''}
                            onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                            placeholder="Deskripsi cerita mendalam..."
                            className={textareaClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">URL Gambar Ilustrasi Slide</label>
                          <input
                            type="text"
                            value={item?.imageUrl || ''}
                            onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'imageUrl', e.target.value)}
                            placeholder="https://... atau /img.jpg"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SUBPAGE 2: PERSONALITY (KEPRIBADIAN) */}
            {/* ==================================================================== */}
            {currentCategory === 'subpage_personality' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5" />
                    <span>Halaman Kepribadian & Karakter ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                {/* Header & Cover */}
                <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Halaman ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={getWebText('personality_title', editLang)}
                      onChange={(e) => handleWebTextChange('personality_title', e.target.value, editLang)}
                      placeholder="My Core Personality & Work Ethics"
                      className={inputClass}
                    />
                    {renderColorControls('personality_title_color', 'personality_title_color_dark', 'Judul Kepribadian')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Intro / Pengantar ({editLang.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={getWebText('personality_intro', editLang)}
                      onChange={(e) => handleWebTextChange('personality_intro', e.target.value, editLang)}
                      className={textareaClass}
                    />
                    {renderColorControls('personality_intro_color', 'personality_intro_color_dark', 'Intro Kepribadian', '#475569', '#94a3b8')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
                    <input
                      type="text"
                      value={localData.webTexts?.personality_header_bg || ''}
                      onChange={(e) => handleWebTextChange('personality_header_bg', e.target.value, 'en')}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Personality Traits */}
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Pilar Karakter / MBTI ({bilingualPersonality.length})
                  </h5>
                  {bilingualPersonality.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="text-[10px] font-bold text-emerald-400">#{idx + 1} Pilar Karakter</div>
                        <input
                          type="text"
                          value={item?.title || ''}
                          onChange={(e) => updateBilingualItem('personality', pair.baseId, editLang, 'title', e.target.value)}
                          placeholder="Nama Karakter"
                          className={inputClass}
                        />
                        <textarea
                          rows={2}
                          value={item?.description || ''}
                          onChange={(e) => updateBilingualItem('personality', pair.baseId, editLang, 'description', e.target.value)}
                          placeholder="Deskripsi karakter..."
                          className={textareaClass}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Personality Slides */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Lembar Cerita Sesi Kepribadian ({getSubpageSections('personality').length})
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleAddSubpageSection('personality')}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>
                  {getSubpageSections('personality').map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-teal-400">#{idx + 1} Slide Cerita</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubpageSection(pair.baseId)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item?.title || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                          placeholder="Judul Slide"
                          className={inputClass}
                        />
                        <textarea
                          rows={3}
                          value={item?.content || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                          placeholder="Konten narasi..."
                          className={textareaClass}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SUBPAGE 3: HOBBIES (HOBI & MINAT) */}
            {/* ==================================================================== */}
            {currentCategory === 'subpage_hobbies' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Halaman Hobi & Minat ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Halaman ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={getWebText('hobbies_title', editLang)}
                      onChange={(e) => handleWebTextChange('hobbies_title', e.target.value, editLang)}
                      className={inputClass}
                    />
                    {renderColorControls('hobbies_title_color', 'hobbies_title_color_dark', 'Judul Hobi')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Intro ({editLang.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={getWebText('hobbies_intro', editLang)}
                      onChange={(e) => handleWebTextChange('hobbies_intro', e.target.value, editLang)}
                      className={textareaClass}
                    />
                    {renderColorControls('hobbies_intro_color', 'hobbies_intro_color_dark', 'Intro Hobi', '#475569', '#94a3b8')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
                    <input
                      type="text"
                      value={localData.webTexts?.hobbies_header_bg || ''}
                      onChange={(e) => handleWebTextChange('hobbies_header_bg', e.target.value, 'en')}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Hobbies Items */}
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Daftar Hobi ({bilingualHobbies.length})
                  </h5>
                  {bilingualHobbies.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="text-[10px] font-bold text-rose-400">#{idx + 1} Hobi</div>
                        <input
                          type="text"
                          value={item?.title || ''}
                          onChange={(e) => updateBilingualItem('hobbies', pair.baseId, editLang, 'title', e.target.value)}
                          placeholder="Nama Hobi"
                          className={inputClass}
                        />
                        <textarea
                          rows={2}
                          value={item?.description || ''}
                          onChange={(e) => updateBilingualItem('hobbies', pair.baseId, editLang, 'description', e.target.value)}
                          placeholder="Deskripsi hobi..."
                          className={textareaClass}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Hobbies Story Slides */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Lembar Cerita Sesi Hobi ({getSubpageSections('hobbies').length})
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleAddSubpageSection('hobbies')}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>
                  {getSubpageSections('hobbies').map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-teal-400">#{idx + 1} Slide Cerita</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubpageSection(pair.baseId)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item?.title || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                          placeholder="Judul Slide"
                          className={inputClass}
                        />
                        <textarea
                          rows={3}
                          value={item?.content || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                          placeholder="Konten narasi..."
                          className={textareaClass}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SUBPAGE 4: CAREER JOURNEY / EXPERIENCES */}
            {/* ==================================================================== */}
            {currentCategory === 'subpage_career_journey' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Halaman Perjalanan Karir ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Halaman ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={getWebText('career_journey_title', editLang)}
                      onChange={(e) => handleWebTextChange('career_journey_title', e.target.value, editLang)}
                      className={inputClass}
                    />
                    {renderColorControls('career_journey_title_color', 'career_journey_title_color_dark', 'Judul Karir')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Intro ({editLang.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={getWebText('career_journey_intro', editLang)}
                      onChange={(e) => handleWebTextChange('career_journey_intro', e.target.value, editLang)}
                      className={textareaClass}
                    />
                    {renderColorControls('career_journey_intro_color', 'career_journey_intro_color_dark', 'Intro Karir', '#475569', '#94a3b8')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
                    <input
                      type="text"
                      value={localData.webTexts?.career_journey_header_bg || ''}
                      onChange={(e) => handleWebTextChange('career_journey_header_bg', e.target.value, 'en')}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Experiences List */}
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Riwayat Pengalaman ({bilingualExperiences.length})
                  </h5>
                  {bilingualExperiences.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-400 font-mono">#{idx + 1} Pengalaman</span>
                          <span className="font-mono text-[10px] text-slate-400">{item?.period}</span>
                        </div>
                        <input
                          type="text"
                          value={item?.role || ''}
                          onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'role', e.target.value)}
                          placeholder="Posisi Pekerjaan"
                          className={inputClass}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item?.company || ''}
                            onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'company', e.target.value)}
                            placeholder="Nama Perusahaan"
                            className={inputClass}
                          />
                          <input
                            type="text"
                            value={item?.period || ''}
                            onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'period', e.target.value)}
                            placeholder="Periode (2022 - Sekarang)"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Journey Story Slides */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Lembar Cerita Perjalanan Karir ({getSubpageSections('career-journey').length})
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleAddSubpageSection('career-journey')}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>
                  {getSubpageSections('career-journey').map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-teal-400">#{idx + 1} Slide Cerita</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubpageSection(pair.baseId)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item?.title || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                          placeholder="Judul Slide"
                          className={inputClass}
                        />
                        <textarea
                          rows={3}
                          value={item?.content || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                          placeholder="Konten narasi..."
                          className={textareaClass}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SUBPAGE 5: CAREER GOALS */}
            {/* ==================================================================== */}
            {currentCategory === 'subpage_career_goals' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Halaman Target & Sasaran Karir ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Halaman ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={getWebText('career_goals_title', editLang)}
                      onChange={(e) => handleWebTextChange('career_goals_title', e.target.value, editLang)}
                      className={inputClass}
                    />
                    {renderColorControls('career_goals_title_color', 'career_goals_title_color_dark', 'Judul Target Karir')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Intro ({editLang.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={getWebText('career_goals_intro', editLang)}
                      onChange={(e) => handleWebTextChange('career_goals_intro', e.target.value, editLang)}
                      className={textareaClass}
                    />
                    {renderColorControls('career_goals_intro_color', 'career_goals_intro_color_dark', 'Intro Target Karir', '#475569', '#94a3b8')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
                    <input
                      type="text"
                      value={localData.webTexts?.career_goals_header_bg || ''}
                      onChange={(e) => handleWebTextChange('career_goals_header_bg', e.target.value, 'en')}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Career Goals List */}
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Target Karir ({bilingualCareerGoals.length})
                  </h5>
                  {bilingualCareerGoals.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="text-[10px] font-bold text-indigo-400">#{idx + 1} Sasaran Karir</div>
                        <input
                          type="text"
                          value={item?.title || ''}
                          onChange={(e) => updateBilingualItem('careerGoals', pair.baseId, editLang, 'title', e.target.value)}
                          placeholder="Sasaran Karir"
                          className={inputClass}
                        />
                        <textarea
                          rows={2}
                          value={item?.description || ''}
                          onChange={(e) => updateBilingualItem('careerGoals', pair.baseId, editLang, 'description', e.target.value)}
                          placeholder="Uraian sasaran..."
                          className={textareaClass}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Story Slides */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Lembar Cerita Target Karir ({getSubpageSections('career-goals').length})
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleAddSubpageSection('career-goals')}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>
                  {getSubpageSections('career-goals').map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-teal-400">#{idx + 1} Slide Cerita</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubpageSection(pair.baseId)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item?.title || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                          placeholder="Judul Slide"
                          className={inputClass}
                        />
                        <textarea
                          rows={3}
                          value={item?.content || ''}
                          onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                          placeholder="Konten narasi..."
                          className={textareaClass}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* DYNAMIC CUSTOM SUBPAGE EDITOR */}
            {/* ==================================================================== */}
            {currentCategory.startsWith('subpage_') && 
             !['subpage_education', 'subpage_personality', 'subpage_hobbies', 'subpage_career_journey', 'subpage_career_goals', 'subpage_projects'].includes(currentCategory) && (
              (() => {
                const customPageId = currentCategory.replace('subpage_', '');
                const customPage = (localData.customSubPages || []).find(p => p.id === customPageId) || {
                  id: customPageId,
                  title: 'Halaman Kustom',
                  titleEn: 'Custom Page',
                  subtitle: '',
                  subtitleEn: '',
                  headerBg: '',
                  iconName: 'Sparkles',
                  showOnStoryPage: true
                };

                const updateCustomPageField = (field: keyof CustomSubPage, val: any) => {
                  handleUpdate(prev => {
                    const pages = [...(prev.customSubPages || [])];
                    const idx = pages.findIndex(p => p.id === customPageId);
                    if (idx !== -1) {
                      pages[idx] = { ...pages[idx], [field]: val };
                    } else {
                      pages.push({ ...customPage, [field]: val });
                    }
                    return { ...prev, customSubPages: pages };
                  });
                };

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Halaman Sub-Page: {(editLang === 'id' ? customPage.title : customPage.titleEn) || customPage.title || customPage.id}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomSubPage(customPageId)}
                        className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Hapus Halaman Sub-Page Ini"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Halaman</span>
                      </button>
                    </div>

                    {/* Header & Settings */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                      <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        <span>Konfigurasi Header &amp; Identitas Halaman</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">
                            Judul Halaman ({editLang.toUpperCase()})
                          </label>
                          <input
                            type="text"
                            value={editLang === 'id' ? (customPage.title || '') : (customPage.titleEn || customPage.title || '')}
                            onChange={(e) => updateCustomPageField(editLang === 'id' ? 'title' : 'titleEn', e.target.value)}
                            placeholder="Contoh: Sertifikasi & Lisensi"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">
                            Pilih Ikon Halaman
                          </label>
                          <select
                            value={customPage.iconName || 'Sparkles'}
                            onChange={(e) => updateCustomPageField('iconName', e.target.value)}
                            className={inputClass}
                          >
                            <option value="Sparkles">✨ Sparkles</option>
                            <option value="Award">🏆 Award / Penghargaan</option>
                            <option value="BookOpen">📖 BookOpen / Publikasi</option>
                            <option value="GraduationCap">🎓 GraduationCap / Pendidikan</option>
                            <option value="Briefcase">💼 Briefcase / Karir</option>
                            <option value="Heart">❤️ Heart / Minat</option>
                            <option value="Cpu">⚡ Cpu / Teknologi</option>
                            <option value="Target">🎯 Target / Fokus</option>
                            <option value="Smile">😊 Smile / Personal</option>
                            <option value="Compass">🧭 Compass / Filosofi</option>
                            <option value="LayoutGrid">📂 LayoutGrid / Showcase</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Intro / Deskripsi Pengantar ({editLang.toUpperCase()})
                        </label>
                        <textarea
                          rows={2}
                          value={editLang === 'id' ? (customPage.subtitle || '') : (customPage.subtitleEn || customPage.subtitle || '')}
                          onChange={(e) => updateCustomPageField(editLang === 'id' ? 'subtitle' : 'subtitleEn', e.target.value)}
                          placeholder="Ringkasan penjelasan mengenai isi sub-halaman ini..."
                          className={textareaClass}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          URL Background Banner Cover
                        </label>
                        <input
                          type="text"
                          value={customPage.headerBg || ''}
                          onChange={(e) => updateCustomPageField('headerBg', e.target.value)}
                          placeholder="https://images.unsplash.com/... atau /banner.jpg"
                          className={inputClass}
                        />
                      </div>

                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customPage.showOnStoryPage !== false}
                            onChange={(e) => updateCustomPageField('showOnStoryPage', e.target.checked)}
                            className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                          />
                          <span className="text-xs text-slate-300 font-medium">Tampilkan di Menu Navigasi &amp; Hub Kisah (About Me)</span>
                        </label>
                      </div>
                    </div>

                    {/* Story Slides / Lembar Cerita List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                          Lembar Cerita / Slide ({getSubpageSections(customPageId).length})
                        </h5>
                        <button
                          type="button"
                          onClick={() => handleAddSubpageSection(customPageId)}
                          className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Slide Cerita</span>
                        </button>
                      </div>

                      {getSubpageSections(customPageId).map((pair, idx) => {
                        const item = pair[editLang] || pair.en;
                        return (
                          <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-teal-400">#{idx + 1} Slide Cerita</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSubpageSection(pair.baseId)}
                                className="p-1 text-rose-400 hover:text-rose-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item?.title || ''}
                              onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                              placeholder="Judul Slide"
                              className={inputClass}
                            />
                            <textarea
                              rows={3}
                              value={item?.content || ''}
                              onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                              placeholder="Konten narasi cerita..."
                              className={textareaClass}
                            />
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">URL Gambar Slide (Opsional)</label>
                              <input
                                type="text"
                                value={item?.imageUrl || ''}
                                onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'imageUrl', e.target.value)}
                                placeholder="https://..."
                                className={inputClass}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            )}

            {/* ==================================================================== */}
            {/* SUBPAGE 6: PROJECTS (PROJEK & STUDI KASUS) */}
            {/* ==================================================================== */}
            {(currentCategory === 'subpage_projects' || currentCategory === 'projects') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Case Studies &amp; Projects ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Judul Section Projects ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={getWebText('projects_title', editLang)}
                      onChange={(e) => handleWebTextChange('projects_title', e.target.value, editLang)}
                      className={inputClass}
                    />
                    {renderColorControls('projects_title_color', 'projects_title_color_dark', 'Judul Projects')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Subtitle Section Projects ({editLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      value={getWebText('projects_subtitle', editLang)}
                      onChange={(e) => handleWebTextChange('projects_subtitle', e.target.value, editLang)}
                      className={textareaClass}
                    />
                    {renderColorControls('projects_subtitle_color', 'projects_subtitle_color_dark', 'Subtitle Projects', '#475569', '#94a3b8')}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">URL Background Cover Banner</label>
                    <input
                      type="text"
                      value={localData.webTexts?.projects_header_bg || ''}
                      onChange={(e) => handleWebTextChange('projects_header_bg', e.target.value, 'en')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">📐 Template Layout Kontainer Proyek</label>
                    <select
                      value={localData.webTexts?.projects_layout_type || 'card_full'}
                      onChange={(e) => handleWebTextChange('projects_layout_type', e.target.value, 'en')}
                      className={inputClass}
                    >
                      <option value="card_full">Template 1: Classic Card (Gambar, Judul &amp; Deskripsi)</option>
                      <option value="minimal_popup">Template 2: Minimal Card (Gambar &amp; Judul) + Pop-Up Detail</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Template 1 menampilkan deskripsi pada kartu. Template 2 hanya menampilkan Gambar &amp; Judul lalu membuka Pop-Up besar saat diklik.
                    </p>
                  </div>
                </div>

                {/* Case Studies List */}
                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Daftar Proyek / Studi Kasus ({bilingualProjects.length})
                  </h5>
                  {bilingualProjects.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-400 font-mono">
                            #{idx + 1} {item?.title || 'Studi Kasus'}
                          </span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">
                            Link / URL Gambar Proyek
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item?.image || ''}
                              placeholder="https://images.unsplash.com/..."
                              onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'image', e.target.value)}
                              className={`${inputClass} flex-1`}
                            />
                            {item?.image && (
                              <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 shrink-0 bg-slate-950">
                                <img
                                  src={item.image}
                                  alt="Preview"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Judul Proyek ({editLang.toUpperCase()})</label>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'title', e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">
                            Deskripsi Singkat (Tampil di Home Card) ({editLang.toUpperCase()})
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Ringkasan 1-2 baris untuk kartu halaman utama..."
                            value={item?.shortDescription || ''}
                            onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'shortDescription', e.target.value)}
                            className={textareaClass}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">
                            Deskripsi Lengkap (Tampil di Pop-Up & All Projects) ({editLang.toUpperCase()})
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Narasi studi kasus lengkap..."
                            value={item?.description || ''}
                            onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'description', e.target.value)}
                            className={textareaClass}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SECTION 7: HERO / HOME */}
            {/* ==================================================================== */}
            {currentCategory === 'hero' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hero / Home ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Sumber Nama Hero
                  </label>
                  <select
                    value={localData.webTexts?.hero_name_source || 'nickname'}
                    onChange={(e) => handleWebTextChange('hero_name_source', e.target.value, editLang)}
                    className={inputClass}
                  >
                    <option value="nickname">Nama Panggilan (Nickname)</option>
                    <option value="fullname">Nama Lengkap (Full Name)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Hero Badge ({editLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={getWebText('hero_badge', editLang)}
                    onChange={(e) => handleWebTextChange('hero_badge', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('hero_badge_color', 'hero_badge_color_dark', 'Hero Badge', '#059669', '#34d399')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Tahun ({editLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={getWebText('hero_year', editLang)}
                    onChange={(e) => handleWebTextChange('hero_year', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('hero_year_color', 'hero_year_color_dark', 'Tahun', '#64748b', '#94a3b8')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Wilayah ({editLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={getWebText('hero_location', editLang)}
                    onChange={(e) => handleWebTextChange('hero_location', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('hero_location_color', 'hero_location_color_dark', 'Wilayah', '#64748b', '#94a3b8')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Judul Utama Hero ({editLang.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={getWebText('hero_title', editLang)}
                    onChange={(e) => handleWebTextChange('hero_title', e.target.value, editLang)}
                    placeholder="Contoh: Turning Raw Data\ninto Enterprise Decisions"
                    className={textareaClass}
                  />
                  {renderColorControls('hero_title_color', 'hero_title_color_dark', 'Judul Utama Hero', '#0f172a', '#ffffff')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Deskripsi / Subtitle Hero ({editLang.toUpperCase()})
                  </label>
                  <textarea
                    rows={4}
                    value={getWebText('hero_subtitle', editLang)}
                    onChange={(e) => handleWebTextChange('hero_subtitle', e.target.value, editLang)}
                    placeholder="Deskripsi singkat spesialisasi Anda..."
                    className={textareaClass}
                  />
                  {renderColorControls('hero_subtitle_color', 'hero_subtitle_color_dark', 'Deskripsi Hero', '#475569', '#94a3b8')}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SECTION 8: ABOUT STORY */}
            {/* ==================================================================== */}
            {currentCategory === 'about_story' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Story / About Me ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Judul Halaman Kisah ({editLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={getWebText('about_story_title', editLang)}
                    onChange={(e) => handleWebTextChange('about_story_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('about_story_title_color', 'about_story_title_color_dark', 'Judul Kisah')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Paragraf Pengantar Utama ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={4}
                    value={getWebText('about_story_intro', editLang)}
                    onChange={(e) => handleWebTextChange('about_story_intro', e.target.value, editLang)}
                    className={textareaClass}
                  />
                  {renderColorControls('about_story_intro_color', 'about_story_intro_color_dark', 'Pengantar Kisah', '#475569', '#94a3b8')}
                </div>

                <div className="pt-2">
                  <h5 className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                    6 Pilar Nilai (Kiri &amp; Kanan) ({editLang.toUpperCase()})
                  </h5>
                  <div className="space-y-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className={`p-3 rounded-lg border ${cardBg} space-y-2`}>
                        <div className="text-[10px] font-bold text-emerald-500">Pilar Kiri #{num}</div>
                        <input
                          type="text"
                          value={getWebText(`about_story_left_${num}_title`, editLang)}
                          onChange={(e) => handleWebTextChange(`about_story_left_${num}_title`, e.target.value, editLang)}
                          placeholder={`Judul Pilar ${num}`}
                          className={inputClass}
                        />
                        <textarea
                          rows={2}
                          value={getWebText(`about_story_left_${num}_desc`, editLang)}
                          onChange={(e) => handleWebTextChange(`about_story_left_${num}_desc`, e.target.value, editLang)}
                          placeholder={`Deskripsi Pilar ${num}`}
                          className={textareaClass}
                        />
                      </div>
                    ))}
                    {[1, 2, 3].map((num) => (
                      <div key={num} className={`p-3 rounded-lg border ${cardBg} space-y-2`}>
                        <div className="text-[10px] font-bold text-indigo-400">Pilar Kanan #{num}</div>
                        <input
                          type="text"
                          value={getWebText(`about_story_right_${num}_title`, editLang)}
                          onChange={(e) => handleWebTextChange(`about_story_right_${num}_title`, e.target.value, editLang)}
                          placeholder={`Judul Pilar Kanan ${num}`}
                          className={inputClass}
                        />
                        <textarea
                          rows={2}
                          value={getWebText(`about_story_right_${num}_desc`, editLang)}
                          onChange={(e) => handleWebTextChange(`about_story_right_${num}_desc`, e.target.value, editLang)}
                          placeholder={`Deskripsi Pilar Kanan ${num}`}
                          className={textareaClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-Pages & Extra Chapters Management */}
                <div className="pt-4 border-t border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Halaman Sub-Pages Tambahan (Custom)</span>
                      </h5>
                      <p className="text-[10px] text-slate-400">
                        Buat sub-halaman baru dengan slide narasi khusus (contoh: Sertifikasi, Riset, Publikasi, Organisasi)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomSubPage}
                      className="px-2.5 py-1 rounded bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Halaman</span>
                    </button>
                  </div>

                  {(localData.customSubPages || []).length === 0 ? (
                    <div className={`p-4 rounded-xl border ${cardBg} text-center text-xs text-slate-400 space-y-2`}>
                      <p>Belum ada sub-halaman tambahan khusus.</p>
                      <button
                        type="button"
                        onClick={handleAddCustomSubPage}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Buat Sub-Halaman Pertama</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(localData.customSubPages || []).map((page, idx) => (
                        <div key={page.id} className={`p-3 rounded-xl border ${cardBg} flex items-center justify-between gap-3`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 text-xs font-bold font-mono">
                              #{idx + 1}
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-200 truncate">
                                {(editLang === 'id' ? page.title : page.titleEn) || page.title || page.id}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Slug ID: {page.id}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setActiveTab(`subpage_${page.id}`)}
                              className="px-2.5 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Edit Halaman</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomSubPage(page.id)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer transition-colors"
                              title="Hapus Halaman"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SECTION 9: TECHNICAL ARSENAL / SKILLS */}
            {/* ==================================================================== */}
            {currentCategory === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Technical Arsenal ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Judul Section Skills</label>
                  <input
                    type="text"
                    value={getWebText('skills_title', editLang)}
                    onChange={(e) => handleWebTextChange('skills_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('skills_title_color', 'skills_title_color_dark', 'Judul Skills')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtitle Section Skills</label>
                  <textarea
                    rows={2}
                    value={getWebText('skills_subtitle', editLang)}
                    onChange={(e) => handleWebTextChange('skills_subtitle', e.target.value, editLang)}
                    className={textareaClass}
                  />
                  {renderColorControls('skills_subtitle_color', 'skills_subtitle_color_dark', 'Subtitle Skills', '#475569', '#94a3b8')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Deskripsi Ringkasan Kategori (Di bawah Emblem Lingkaran Home)</label>
                  <textarea
                    rows={2}
                    value={getWebText('skills_home_group_desc', editLang)}
                    onChange={(e) => handleWebTextChange('skills_home_group_desc', e.target.value, editLang)}
                    placeholder="Dikelompokkan jadi beberapa kategori: yang mengolah data, menjalankan otomasi, dan visualisasi..."
                    className={textareaClass}
                  />
                  {renderColorControls('skills_home_group_desc_color', 'skills_home_group_desc_color_dark', 'Deskripsi Ringkasan Kategori', '#475569', '#94a3b8')}
                </div>

                {/* ================================================================ */}
                {/* SKILL CATEGORY MANAGER (TAMBAH & EDIT KATEGORI) */}
                {/* ================================================================ */}
                <div className={`p-3.5 rounded-xl border ${cardBg} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FolderPlus className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-200">
                          Kelola Kategori Keahlian ({allSkillCategories.length})
                        </h5>
                        <p className="text-[10px] text-slate-400">
                          Tambah kategori baru atau ubah nama kategori yang ada
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsManagingSkillCats(!isManagingSkillCats)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isManagingSkillCats ? 'Tutup Pengaturan' : 'Atur Kategori'}</span>
                      {isManagingSkillCats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isManagingSkillCats && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-2 border-t border-slate-800"
                    >
                      {/* Add Category Form */}
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                        <span className="text-[10.5px] font-bold text-emerald-400 flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          <span>Tambah Kategori Baru</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newCatLabelInput}
                            onChange={(e) => setNewCatLabelInput(e.target.value)}
                            placeholder="Nama Kategori (mis: Cloud & DevOps)"
                            className={inputClass}
                          />
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={newCatIdInput}
                              onChange={(e) => setNewCatIdInput(e.target.value)}
                              placeholder="ID Kategori (opsional/otomatis)"
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={handleAddSkillCategory}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer shrink-0 transition-colors"
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Edit Existing Categories List */}
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Daftar Kategori Aktif
                        </span>
                        {allSkillCategories.map((cat) => (
                          <div
                            key={cat.id}
                            className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                          >
                            {editingCatId === cat.id ? (
                              <div className="flex-1 flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={editingCatLabel}
                                  onChange={(e) => setEditingCatLabel(e.target.value)}
                                  className={inputClass}
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={handleSaveEditSkillCategory}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                                  title="Simpan Nama Kategori"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCatId(null)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                                  title="Batal"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 truncate">
                                  <span className="font-bold text-slate-200 truncate">{cat.label}</span>
                                  <span className="text-[9.5px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                                    {cat.id}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCatId(cat.id);
                                      setEditingCatLabel(cat.label);
                                    }}
                                    className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded cursor-pointer"
                                    title="Ubah Nama Kategori"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  {cat.isCustom && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSkillCategory(cat.id)}
                                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer"
                                      title="Hapus Kategori Kustom"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Skills Management List */}
                <div className="space-y-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Daftar Keahlian ({bilingualSkills.length})
                    </h5>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Skill Baru</span>
                    </button>
                  </div>

                  {/* Search Filter for Skills */}
                  {bilingualSkills.length > 5 && (
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={skillSearchQuery}
                        onChange={(e) => setSkillSearchQuery(e.target.value)}
                        placeholder="Cari keahlian berdasarkan nama..."
                        className={`${inputClass} pl-8`}
                      />
                    </div>
                  )}

                  {bilingualSkills
                    .filter(pair => {
                      if (!skillSearchQuery.trim()) return true;
                      const q = skillSearchQuery.toLowerCase();
                      return (
                        pair.en?.name?.toLowerCase().includes(q) ||
                        pair.id?.name?.toLowerCase().includes(q) ||
                        pair.en?.category?.toLowerCase().includes(q)
                      );
                    })
                    .map((pair, idx) => {
                      const item = pair[editLang] || pair.en;
                      return (
                        <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2.5 relative`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-emerald-400 font-mono">
                              #{idx + 1} {item?.name || 'Untitled Skill'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDuplicateSkill(pair.baseId)}
                                className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded cursor-pointer transition-colors"
                                title="Duplikat Skill Ini"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(pair.baseId)}
                                className="text-rose-400 hover:text-rose-300 p-1 text-xs cursor-pointer hover:bg-rose-950/30 rounded transition-colors"
                                title="Hapus Skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Nama Keahlian ({editLang.toUpperCase()})</label>
                              <input
                                type="text"
                                value={item?.name || ''}
                                onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'name', e.target.value)}
                                placeholder="e.g. SQL, Python, React..."
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Kategori</label>
                              <select
                                value={item?.category || 'tools'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '__add_new__') {
                                    setIsManagingSkillCats(true);
                                  } else {
                                    updateBilingualItem('skills', pair.baseId, editLang, 'category', val);
                                  }
                                }}
                                className={inputClass}
                              >
                                {allSkillCategories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.label} ({cat.id})
                                  </option>
                                ))}
                                <option value="__add_new__">➕ Tambah Kategori Baru...</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="block text-[10px] font-bold text-slate-400">
                                Custom SVG String / URL Logo (Opsional)
                              </label>
                              {(item?.customSvg || item?.svgUrl) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateBilingualSkillSvg(pair.baseId, '', '');
                                  }}
                                  className="text-[9.5px] text-rose-400 hover:text-rose-300 cursor-pointer"
                                >
                                  Hapus Kustom
                                </button>
                              )}
                            </div>

                            <div className="flex items-start gap-2.5">
                              {/* Live SVG Preview Box */}
                              <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                                <TechLogo
                                  name={item?.name || ''}
                                  iconName={item?.icon}
                                  customSvg={item?.customSvg}
                                  svgUrl={item?.svgUrl}
                                  size={24}
                                />
                              </div>

                              {/* Multi-line Textarea for SVG code or URL - Always atomic and bilingual sync */}
                              <textarea
                                rows={2}
                                value={item?.customSvg || item?.svgUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val.trim().startsWith('<svg') || val.trim().startsWith('<?xml') || val.trim().includes('<svg')) {
                                    updateBilingualSkillSvg(pair.baseId, val, '');
                                  } else {
                                    updateBilingualSkillSvg(pair.baseId, '', val);
                                  }
                                }}
                                placeholder="Paste kode <svg>...</svg> lengkap, atau URL gambar .svg/.png. Kosongkan untuk logo otomatis..."
                                className={`${textareaClass} font-mono text-[10.5px] leading-tight`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Penjelasan / Deskripsi ({editLang.toUpperCase()})</label>
                            <textarea
                              rows={2}
                              value={item?.description || ''}
                              onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'description', e.target.value)}
                              placeholder="Deskripsi keahlian, teknologi terkait, pemakaian..."
                              className={textareaClass}
                            />
                          </div>

                          <div className="flex items-center gap-4 pt-1">
                            <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item?.showOnWeb !== false}
                                onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'showOnWeb', e.target.checked)}
                                className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                              />
                              <span>Tampilkan di Web</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item?.showOnCV !== false}
                                onChange={(e) => updateBilingualItem('skills', pair.baseId, editLang, 'showOnCV', e.target.checked)}
                                className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                              />
                              <span>Tampilkan di CV</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Skill Baru</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SECTION 10: EXPERIENCES (MAIN SECTION) */}
            {/* ==================================================================== */}
            {currentCategory === 'experiences' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Experiences Section ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Judul Section Experience</label>
                  <input
                    type="text"
                    value={getWebText('experience_title', editLang)}
                    onChange={(e) => handleWebTextChange('experience_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('experience_title_color', 'experience_title_color_dark', 'Judul Experience')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtitle Section Experience</label>
                  <textarea
                    rows={2}
                    value={getWebText('experience_subtitle', editLang)}
                    onChange={(e) => handleWebTextChange('experience_subtitle', e.target.value, editLang)}
                    className={textareaClass}
                  />
                  {renderColorControls('experience_subtitle_color', 'experience_subtitle_color_dark', 'Subtitle Experience', '#475569', '#94a3b8')}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SECTION 11: CONTACT */}
            {/* ==================================================================== */}
            {currentCategory === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Section ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Judul Section Contact</label>
                  <input
                    type="text"
                    value={getWebText('contact_title', editLang)}
                    onChange={(e) => handleWebTextChange('contact_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('contact_title_color', 'contact_title_color_dark', 'Judul Contact')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtitle Section Contact</label>
                  <textarea
                    rows={3}
                    value={getWebText('contact_subtitle', editLang)}
                    onChange={(e) => handleWebTextChange('contact_subtitle', e.target.value, editLang)}
                    className={textareaClass}
                  />
                  {renderColorControls('contact_subtitle_color', 'contact_subtitle_color_dark', 'Subtitle Contact', '#475569', '#94a3b8')}
                </div>
              </div>
            )}

            {/* ==================================================================== */}
            {/* SECTION 12: GENERAL IDENTITY */}
            {/* ==================================================================== */}
            {currentCategory === 'general_identity' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Identitas Profil Utama ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={localData.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdate(prev => ({ ...prev, name: val }));
                    }}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Job Title / Posisi ({editLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={getWebText('title', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).title : localData.title)}
                    onChange={(e) => handleWebTextChange('title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('title_color', 'title_color_dark', 'Warna Posisi/Job Title', '#059669', '#34d399')}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Ringkasan Professional / About Me ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={5}
                    value={getWebText('aboutMe', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).aboutMe : localData.aboutMe || '')}
                    onChange={(e) => handleWebTextChange('aboutMe', e.target.value, editLang)}
                    className={textareaClass}
                  />
                  {renderColorControls('aboutMe_color', 'aboutMe_color_dark', 'Warna Ringkasan/About Me', '#475569', '#94a3b8')}
                </div>
              </div>
            )}
            </>
            )}

            {/* Live Context Tip */}
            <div className={`p-3 rounded-lg border flex items-start gap-2.5 text-[11px] ${
              isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {editorMode === 'assets' ? (
                  <span>
                    Perubahan pola background, warna tema, foto avatar, dan aset visual akan langsung ter-render secara real-time di layar. Klik <strong>"Simpan Draft"</strong> untuk menyimpan permanen.
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
          <div className={`p-4 border-t flex items-center justify-between gap-3 ${
            isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-100 bg-slate-50/90'
          }`}>
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
    </AnimatePresence>
  );
};
