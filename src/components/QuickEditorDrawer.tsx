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
  Dock,
  ArrowUp,
  ArrowDown,
  Share2,
  Globe,
  Link,
  MessageSquare,
  Phone,
  AtSign,
  Send,
  CheckSquare,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  UserCheck,
  EyeOff,
  Columns,
  ArrowRightLeft,
  Monitor,
  Smartphone,
  Clock,
  Play
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
  FloatingAsset,
  CustomSocial
} from '../types';
import { saveCVData, uploadFileToStorage, resetCVDataToDefault } from '../lib/storage';
import { DEFAULT_CV_DATA, DEFAULT_WEB_TEXTS, ID_TRANSLATIONS } from '../data/portfolioData';
import BackgroundPatternSelector from './BackgroundPatternSelector';
import TechLogo from './TechLogo';
import ThemeTemplateStudio from './ThemeTemplateStudio';
import { HERO_THEME_TEMPLATES } from '../data/themeTemplates';
import { HERO_LAYOUT_TEMPLATES, LayoutTemplate } from '../data/layoutTemplates';
import { AIAssistantModal } from './AIAssistantModal';
import { JobExperienceAiModal } from './JobExperienceAiModal';
import { ExperienceTranslateModal } from './ExperienceTranslateModal';
import { SubpageItemTranslateModal } from './SubpageItemTranslateModal';
import { ExperiencePeriodEditor } from './ExperiencePeriodEditor';
import { formatExperiencePeriod } from '../lib/experienceDateHelpers';
import SocialIcon, { getAbsoluteSocialUrl } from './SocialIcon';
import MarkdownText from './MarkdownText';

const SOCIAL_PLATFORM_PRESETS = [
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'muhammad-zufar-fauzi', urlPrefix: 'linkedin.com/in/' },
  { id: 'github', name: 'GitHub', placeholder: 'ZufarFz', urlPrefix: 'github.com/' },
  { id: 'whatsapp', name: 'WhatsApp', placeholder: '085123333230 / 6285...', urlPrefix: 'wa.me/' },
  { id: 'instagram', name: 'Instagram', placeholder: 'Zuf.Fz_', urlPrefix: 'instagram.com/' },
  { id: 'email', name: 'Email', placeholder: 'contact@domain.com', urlPrefix: 'mailto:' },
  { id: 'website', name: 'Website / Portfolio', placeholder: 'https://portfolio-zufar.netlify.app', urlPrefix: '' },
  { id: 'x', name: 'X / Twitter', placeholder: '@username', urlPrefix: 'x.com/' },
  { id: 'youtube', name: 'YouTube', placeholder: '@channel', urlPrefix: 'youtube.com/' },
  { id: 'tiktok', name: 'TikTok', placeholder: '@username', urlPrefix: 'tiktok.com/@' },
  { id: 'telegram', name: 'Telegram', placeholder: 'username', urlPrefix: 't.me/' },
  { id: 'discord', name: 'Discord', placeholder: 'discord.gg/invite', urlPrefix: 'discord.gg/' },
  { id: 'medium', name: 'Medium', placeholder: '@username', urlPrefix: 'medium.com/@' },
  { id: 'threads', name: 'Threads', placeholder: 'username', urlPrefix: 'threads.net/@' },
  { id: 'facebook', name: 'Facebook', placeholder: 'profile_name', urlPrefix: 'facebook.com/' },
  { id: 'dribbble', name: 'Dribbble', placeholder: 'username', urlPrefix: 'dribbble.com/' },
  { id: 'behance', name: 'Behance', placeholder: 'username', urlPrefix: 'behance.net/' },
  { id: 'gitlab', name: 'GitLab', placeholder: 'username', urlPrefix: 'gitlab.com/' },
  { id: 'stackoverflow', name: 'Stack Overflow', placeholder: 'users/12345/name', urlPrefix: 'stackoverflow.com/' },
  { id: 'bluesky', name: 'Bluesky', placeholder: 'username.bsky.social', urlPrefix: 'bsky.app/profile/' },
  { id: 'slack', name: 'Slack', placeholder: 'workspace-name', urlPrefix: 'slack.com/' },
  { id: 'custom', name: 'Platform Lainnya', placeholder: 'https://...', urlPrefix: '' }
];

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
  onTogglePreviewDevice
}) => {
  const isDark = theme === 'dark';
  const [localData, setLocalData] = useState<CVData>(cvData);
  const [editLang, setEditLang] = useState<'id' | 'en'>(currentLang);
  const [editorMode, setEditorMode] = useState<'id' | 'en' | 'assets' | 'social'>('id');
  const [assetTab, setAssetTab] = useState<'templates' | 'bg_patterns' | 'floating_assets' | 'bg_shadows' | 'bg_colors' | 'images' | 'idcard' | 'gooey_cursor'>('templates');
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
  const [isAddingSocial, setIsAddingSocial] = useState<boolean>(false);
  const [newSocialData, setNewSocialData] = useState<{
    platform: string;
    name: string;
    value: string;
    usernameOrUrl: string;
    showOnWeb: boolean;
    showOnCvHeader: boolean;
    showOnCvFooter: boolean;
  }>({
    platform: 'LinkedIn',
    name: 'LinkedIn',
    value: '',
    usernameOrUrl: '',
    showOnWeb: true,
    showOnCvHeader: true,
    showOnCvFooter: true,
  });
  const [socialSearchQuery, setSocialSearchQuery] = useState<string>('');

  // AI Assistant Modal State & Helpers
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

  // Subpage Items (Personality, Hobbies, Story Slides, Education, Goals) AI Translation Modal State
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
        methodologyTitle: editLang === targetLang ? translatedData.title : (prev.methodologyTitle || translatedData.title),
        methodologyText: editLang === targetLang ? translatedData.description : (prev.methodologyText || translatedData.description),
        webTexts: nextTexts,
      };
    });
  };

  const openSubpageTranslate = (
    listKey: keyof CVData,
    baseId: string,
    itemType: 'personality' | 'hobby' | 'career_goal' | 'education' | 'story_slide' | 'generic',
    sourceData: { title: string; description: string },
    labels?: { itemTypeName?: string; titleLabel?: string; descriptionLabel?: string }
  ) => {
    setSubpageTranslateModalState({
      isOpen: true,
      baseId,
      listKey,
      sourceLang: editLang,
      itemType,
      sourceData,
      labels,
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
      contextHint
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
    // Check if key is a visual design / background / gooey cursor property that should persist universally across languages
    const isVisualAsset = 
      key.startsWith('gooey_') ||
      key.includes('gooey_') ||
      key.includes('enable_gooey_cursor') ||
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
        // Strip any language suffix if present on universal keys
        let baseKey = key;
        if (baseKey.endsWith('_id') || baseKey.endsWith('_en')) {
          baseKey = baseKey.slice(0, -3);
        }

        // Universal write: assign to base key and both language variants so it never gets lost
        nextTexts[baseKey] = value;
        nextTexts[`${baseKey}_id`] = value;
        nextTexts[`${baseKey}_en`] = value;

        // Synchronize dual aliases for custom svg / custom url
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
      
      const sharedFields = ['customSvg', 'svgUrl', 'category', 'showOnWeb', 'showOnCV', 'showOnHome', 'level', 'icon', 'year', 'startDate', 'endDate', 'startMonth', 'startYear', 'endMonth', 'endYear', 'isCurrent', 'periodMode', 'image', 'projectUrl', 'tags', 'tools'];

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
    (baseId) => ({ id: `${baseId}-en`, title: 'Project Title', shortDescription: '', description: '', tags: [], image: '', image2: '', image3: '', tools: [] }),
    (baseId) => ({ id: `${baseId}-id`, title: 'Judul Proyek', shortDescription: '', description: '', tags: [], image: '', image2: '', image3: '', tools: [] })
  );

  // Helper for Experiences
  const bilingualExperiences = getBilingualPairs<Experience>(
    localData.experiences,
    (baseId) => ({ id: `${baseId}-en`, role: 'Job Role', company: 'Company Name', period: '2022 - Present', bulletPoints: [], tools: [], showOnHome: true, showOnWeb: true, showOnCV: true }),
    (baseId) => ({ id: `${baseId}-id`, role: 'Posisi / Pekerjaan', company: 'Perusahaan', period: '2022 - Sekarang', bulletPoints: [], tools: [], showOnHome: true, showOnWeb: true, showOnCV: true })
  );

  const handleAddExperience = () => {
    const baseId = `exp-${Date.now()}`;
    const thisYear = new Date().getFullYear();
    const enItem: Experience = {
      id: `${baseId}-en`,
      role: 'New Role / Position',
      company: 'Company Name',
      period: `${thisYear} — Present`,
      bulletPoints: [
        'Describe key responsibility or achievement in this role.',
        'Another measurable accomplishment or project contribution.'
      ],
      tools: ['SQL', 'Python'],
      showOnHome: true,
      showOnWeb: true,
      showOnCV: true,
      startYear: String(thisYear),
      startMonth: '01',
      isCurrent: true,
      periodMode: 'date'
    };
    const idItem: Experience = {
      id: `${baseId}-id`,
      role: 'Posisi / Peran Baru',
      company: 'Nama Perusahaan',
      period: `${thisYear} — Sekarang`,
      bulletPoints: [
        'Deskripsikan tanggung jawab utama atau pencapaian pada posisi ini.',
        'Poin pencapaian terukur atau kontribusi proyek lainnya.'
      ],
      tools: ['SQL', 'Python'],
      showOnHome: true,
      showOnWeb: true,
      showOnCV: true,
      startYear: String(thisYear),
      startMonth: '01',
      isCurrent: true,
      periodMode: 'date'
    };
    handleUpdate(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), enItem, idItem]
    }));
  };

  const handleUpdateExperienceDates = (
    baseId: string,
    startMonth: string,
    startYear: string,
    endMonth: string,
    endYear: string,
    isCurrent: boolean
  ) => {
    const periodId = formatExperiencePeriod(startMonth, startYear, endMonth, endYear, isCurrent, 'id');
    const periodEn = formatExperiencePeriod(startMonth, startYear, endMonth, endYear, isCurrent, 'en');
    const startDate = startYear ? (startMonth ? `${startYear}-${startMonth}` : startYear) : '';
    const endDate = isCurrent ? '' : (endYear ? (endMonth ? `${endYear}-${endMonth}` : endYear) : '');

    handleUpdate(prev => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map(pair => {
        if (pair.baseId === baseId) {
          return {
            ...pair,
            en: {
              ...pair.en,
              period: periodEn,
              startDate,
              endDate,
              startMonth,
              startYear,
              endMonth: isCurrent ? '' : endMonth,
              endYear: isCurrent ? '' : endYear,
              isCurrent,
              periodMode: 'date' as const
            },
            id: {
              ...pair.id,
              period: periodId,
              startDate,
              endDate,
              startMonth,
              startYear,
              endMonth: isCurrent ? '' : endMonth,
              endYear: isCurrent ? '' : endYear,
              isCurrent,
              periodMode: 'date' as const
            }
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList
      };
    });
  };

  const handleManualExperiencePeriodChange = (baseId: string, targetLang: 'id' | 'en', text: string) => {
    handleUpdate(prev => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map(pair => {
        if (pair.baseId === baseId) {
          return {
            ...pair,
            [targetLang]: {
              ...(pair[targetLang] as any),
              period: text,
              periodMode: 'custom' as const
            }
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList
      };
    });
  };

  const handleMoveExperience = (baseId: string, direction: 'up' | 'down') => {
    handleUpdate(prev => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const index = pairs.findIndex(p => p.baseId === baseId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= pairs.length) return prev;

      const updatedPairs = [...pairs];
      const [movedPair] = updatedPairs.splice(index, 1);
      updatedPairs.splice(targetIndex, 0, movedPair);

      const flatList: Experience[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList
      };
    });
  };

  const handleRemoveExperience = (baseId: string) => {
    handleUpdate(prev => ({
      ...prev,
      experiences: (prev.experiences || []).filter(e => 
        e.id !== `${baseId}-en` && e.id !== `${baseId}-id` && e.id !== baseId
      )
    }));
  };

  const handleDuplicateExperience = (baseId: string) => {
    const pair = bilingualExperiences.find(p => p.baseId === baseId);
    if (!pair) return;
    const newBaseId = `exp-${Date.now()}`;
    const enItem: Experience = {
      ...pair.en,
      id: `${newBaseId}-en`,
      role: `${pair.en?.role || 'Job Role'} (Copy)`
    };
    const idItem: Experience = {
      ...pair.id,
      id: `${newBaseId}-id`,
      role: `${pair.id?.role || 'Posisi'} (Salinan)`
    };
    handleUpdate(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), enItem, idItem]
    }));
  };

  const handleAddBulletPoint = (baseId: string, targetLang: 'id' | 'en') => {
    handleUpdate(prev => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map(pair => {
        if (pair.baseId === baseId) {
          const currentBullets = pair[targetLang]?.bulletPoints || [];
          return {
            ...pair,
            [targetLang]: {
              ...(pair[targetLang] as Experience),
              bulletPoints: [...currentBullets, 'Poin tanggung jawab / pencapaian baru...']
            }
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList
      };
    });
  };

  const handleUpdateBulletPoint = (baseId: string, targetLang: 'id' | 'en', bulletIndex: number, text: string) => {
    handleUpdate(prev => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map(pair => {
        if (pair.baseId === baseId) {
          const currentBullets = [...(pair[targetLang]?.bulletPoints || [])];
          currentBullets[bulletIndex] = text;
          return {
            ...pair,
            [targetLang]: {
              ...(pair[targetLang] as Experience),
              bulletPoints: currentBullets
            }
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList
      };
    });
  };

  const handleRemoveBulletPoint = (baseId: string, targetLang: 'id' | 'en', bulletIndex: number) => {
    handleUpdate(prev => {
      const currentList = prev.experiences || [];
      const pairs = getBilingualPairs(currentList);
      const updatedPairs = pairs.map(pair => {
        if (pair.baseId === baseId) {
          const currentBullets = (pair[targetLang]?.bulletPoints || []).filter((_, idx) => idx !== bulletIndex);
          return {
            ...pair,
            [targetLang]: {
              ...(pair[targetLang] as Experience),
              bulletPoints: currentBullets
            }
          };
        }
        return pair;
      });

      const flatList: Experience[] = [];
      updatedPairs.forEach(p => {
        flatList.push({ ...p.en, id: `${p.baseId}-en` });
        flatList.push({ ...p.id, id: `${p.baseId}-id` });
      });

      return {
        ...prev,
        experiences: flatList
      };
    });
  };

  // Helper for Personality
  const bilingualPersonality = getBilingualPairs<PersonalityItem>(
    localData.personality,
    (baseId) => ({ id: `${baseId}-en`, title: 'Trait Title', description: '', icon: 'Smile' }),
    (baseId) => ({ id: `${baseId}-id`, title: 'Karakter / Aspek', description: '', icon: 'Smile' })
  );

  const handleAddPersonality = () => {
    const baseId = `pers-${Date.now()}`;
    const enItem: PersonalityItem = {
      id: `${baseId}-en`,
      title: 'New Trait / Operating Principle',
      description: 'Describe professional principle, work ethics, or character aspect in English...',
      icon: 'Smile'
    };
    const idItem: PersonalityItem = {
      id: `${baseId}-id`,
      title: 'Pilar Karakter & Nilai Baru',
      description: 'Deskripsikan prinsip profesional, etika kerja, atau karakter dalam Bahasa Indonesia...',
      icon: 'Smile'
    };
    handleUpdate(prev => ({
      ...prev,
      personality: [...(prev.personality || []), enItem, idItem]
    }));
  };

  const handleRemovePersonality = (baseId: string) => {
    handleUpdate(prev => ({
      ...prev,
      personality: (prev.personality || []).filter(p => 
        p.id !== `${baseId}-en` && p.id !== `${baseId}-id` && p.id !== baseId
      )
    }));
  };

  // Helper for Hobbies
  const bilingualHobbies = getBilingualPairs<HobbyItem>(
    localData.hobbies,
    (baseId) => ({ id: `${baseId}-en`, title: 'Hobby Title', description: '', icon: 'Heart' }),
    (baseId) => ({ id: `${baseId}-id`, title: 'Judul Hobi', description: '', icon: 'Heart' })
  );

  const handleAddHobby = () => {
    const baseId = `hobby-${Date.now()}`;
    const enItem: HobbyItem = {
      id: `${baseId}-en`,
      title: 'New Hobby / Creative Pursuit',
      description: 'Describe creative interest, inspiration, or active pursuit outside work...',
      icon: 'Heart'
    };
    const idItem: HobbyItem = {
      id: `${baseId}-id`,
      title: 'Hobi & Minat Baru',
      description: 'Deskripsikan hobi, minat kreatif, atau aktivitas inspiratif di luar jam kerja...',
      icon: 'Heart'
    };
    handleUpdate(prev => ({
      ...prev,
      hobbies: [...(prev.hobbies || []), enItem, idItem]
    }));
  };

  const handleRemoveHobby = (baseId: string) => {
    handleUpdate(prev => ({
      ...prev,
      hobbies: (prev.hobbies || []).filter(h => 
        h.id !== `${baseId}-en` && h.id !== `${baseId}-id` && h.id !== baseId
      )
    }));
  };

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

  const handleCopyFromDesktop = (id: string) => {
    handleUpdate(prev => ({
      ...prev,
      floatingAssets: (prev.floatingAssets || []).map(a => {
        if (a.id === id) {
          return {
            ...a,
            mobileX: a.x,
            mobileY: a.y,
            mobileWidth: a.width || 80,
            mobileOpacity: a.opacity !== undefined ? a.opacity : 0.8,
            mobileRotation: a.rotation || 0,
            mobileFlipX: a.flipX || false,
          };
        }
        return a;
      })
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
            )}
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

                    {/* DEDICATED PREVIEW VIEWPORT TOGGLE: DESKTOP vs MOBILE */}
                    <div className={`p-3.5 rounded-xl border transition-all ${
                      activeDeviceMode === 'mobile'
                        ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
                        : 'bg-blue-500/10 border-blue-500/40'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {activeDeviceMode === 'mobile' ? (
                              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <Monitor className="w-4 h-4 text-blue-400 shrink-0" />
                            )}
                            <span className="text-xs font-bold text-slate-100">
                              Mode Posisi &amp; Ukuran:{' '}
                              <span className={activeDeviceMode === 'mobile' ? 'text-amber-300 font-extrabold' : 'text-blue-300 font-extrabold'}>
                                {activeDeviceMode === 'mobile' ? '📱 Khusus Mobile (HP)' : '💻 Desktop (Komputer)'}
                              </span>
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 leading-snug">
                            {activeDeviceMode === 'mobile'
                              ? 'Layar dialihkan ke Simulator Smartphone Asli (iPhone 15 Pro, Galaxy S24). Media query CSS, susunan kartu, dan koordinat mobile aktif 100% persis seperti di HP fisik.'
                              : 'Layar preview dalam ukuran penuh desktop. Nilai koordinat & ukuran di bawah ini berlaku untuk pengunjung di layar laptop / komputer.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shrink-0 shadow-inner">
                          <button
                            type="button"
                            onClick={() => handleSetDeviceMode('desktop')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              activeDeviceMode === 'desktop'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <Monitor className="w-3.5 h-3.5" />
                            <span>Desktop</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetDeviceMode('mobile')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              activeDeviceMode === 'mobile'
                                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Mobile (HP)</span>
                          </button>
                        </div>
                      </div>
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

                              {/* Form Input Row 4: Sliders Posisi X & Y, Ukuran, Opasitas (Responsive Desktop vs Mobile) */}
                              {(() => {
                                const isMobileMode = activeDeviceMode === 'mobile';
                                const curX = isMobileMode ? (asset.mobileX !== undefined ? asset.mobileX : asset.x) : asset.x;
                                const curY = isMobileMode ? (asset.mobileY !== undefined ? asset.mobileY : asset.y) : asset.y;
                                const curWidth = isMobileMode ? (asset.mobileWidth !== undefined ? asset.mobileWidth : (asset.width || 80)) : (asset.width || 80);
                                const curOpacity = isMobileMode ? (asset.mobileOpacity !== undefined ? asset.mobileOpacity : (asset.opacity ?? 0.8)) : (asset.opacity ?? 0.8);
                                const curRotation = isMobileMode ? (asset.mobileRotation !== undefined ? asset.mobileRotation : (asset.rotation || 0)) : (asset.rotation || 0);
                                const curFlipX = isMobileMode ? (asset.mobileFlipX !== undefined ? asset.mobileFlipX : (asset.flipX || false)) : (asset.flipX || false);
                                const accentColor = isMobileMode ? 'accent-amber-500' : 'accent-emerald-500';
                                const valColor = isMobileMode ? 'text-amber-400' : 'text-emerald-400';

                                return (
                                  <div className="space-y-3 pt-1">
                                    {/* Mobile/Desktop Contextual Badge & Actions */}
                                    <div className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-2 ${
                                      isMobileMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'
                                    }`}>
                                      <div className="flex items-center gap-2">
                                        {isMobileMode ? (
                                          <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                                        ) : (
                                          <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
                                        )}
                                        <div>
                                          <p className={`text-[11px] font-bold ${isMobileMode ? 'text-amber-300' : 'text-slate-200'}`}>
                                            {isMobileMode ? 'Pengaturan Posisi Khusus Mobile (HP)' : 'Pengaturan Posisi Mode Desktop'}
                                          </p>
                                          <p className="text-[9.5px] text-slate-400">
                                            {isMobileMode 
                                              ? 'Koordinat X, Y, & ukuran ini hanya aktif di layar smartphone.'
                                              : 'Koordinat X, Y, & ukuran ini aktif di layar laptop / komputer.'}
                                          </p>
                                        </div>
                                      </div>

                                      {isMobileMode && (
                                        <button
                                          type="button"
                                          onClick={() => handleCopyFromDesktop(asset.id)}
                                          className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                                          title="Salin koordinat posisi dan ukuran saat ini dari mode desktop"
                                        >
                                          <Copy className="w-3 h-3" />
                                          <span>Salin dari Desktop</span>
                                        </button>
                                      )}
                                    </div>

                                    {/* Hide on Mobile / Desktop Toggles */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[10.5px]">
                                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white">
                                        <input
                                          type="checkbox"
                                          checked={asset.hideOnMobile || false}
                                          onChange={(e) => handleUpdateFloatingAsset(asset.id, 'hideOnMobile', e.target.checked)}
                                          className="accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer"
                                        />
                                        <span>🚫 Sembunyikan di HP (Mobile)</span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white">
                                        <input
                                          type="checkbox"
                                          checked={asset.hideOnDesktop || false}
                                          onChange={(e) => handleUpdateFloatingAsset(asset.id, 'hideOnDesktop', e.target.checked)}
                                          className="accent-blue-500 w-3.5 h-3.5 rounded cursor-pointer"
                                        />
                                        <span>🚫 Sembunyikan di Desktop</span>
                                      </label>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {/* Posisi Horizontal X (%) */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                          <span>Posisi X (Horizontal):</span>
                                          <span className={`font-mono ${valColor}`}>{curX}%</span>
                                        </div>
                                        <input
                                          type="range"
                                          min={0}
                                          max={100}
                                          step={1}
                                          value={curX}
                                          onChange={(e) => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', parseInt(e.target.value, 10))}
                                          className={`w-full ${accentColor} cursor-pointer`}
                                        />
                                        <div className="flex justify-between text-[9px] text-slate-500">
                                          <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', 10)} className="hover:text-amber-400">Kiri (10%)</button>
                                          <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', 50)} className="hover:text-amber-400">Tengah (50%)</button>
                                          <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileX' : 'x', 85)} className="hover:text-amber-400">Kanan (85%)</button>
                                        </div>
                                      </div>

                                      {/* Posisi Vertikal Y (%) */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                          <span>Posisi Y (Vertikal):</span>
                                          <span className={`font-mono ${valColor}`}>{curY}%</span>
                                        </div>
                                        <input
                                          type="range"
                                          min={0}
                                          max={100}
                                          step={1}
                                          value={curY}
                                          onChange={(e) => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', parseInt(e.target.value, 10))}
                                          className={`w-full ${accentColor} cursor-pointer`}
                                        />
                                        <div className="flex justify-between text-[9px] text-slate-500">
                                          <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', 15)} className="hover:text-amber-400">Atas (15%)</button>
                                          <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', 50)} className="hover:text-amber-400">Tengah (50%)</button>
                                          <button type="button" onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileY' : 'y', 85)} className="hover:text-amber-400">Bawah (85%)</button>
                                        </div>
                                      </div>

                                      {/* Ukuran Lebar (Width in px) */}
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                          <div className="flex items-center gap-1.5">
                                            <span>Ukuran Lebar:</span>
                                            {isMobileMode ? (
                                              <span className="text-[9px] text-amber-400 font-normal bg-amber-950/40 px-1 rounded border border-amber-500/20">📱 Mobile Pixel</span>
                                            ) : (
                                              <span className="text-[9px] text-emerald-400 font-normal bg-emerald-950/40 px-1 rounded border border-emerald-500/20">⚡ Responsif Layar</span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <input
                                              type="number"
                                              min={10}
                                              max={2000}
                                              value={curWidth}
                                              onChange={(e) => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileWidth' : 'width', parseInt(e.target.value, 10) || 80)}
                                              className={`w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] ${valColor} text-right focus:outline-none`}
                                            />
                                            <span className="text-[10px] text-slate-400 font-mono">px</span>
                                          </div>
                                        </div>
                                        <input
                                          type="range"
                                          min={15}
                                          max={isMobileMode ? 600 : 1200}
                                          step={5}
                                          value={curWidth}
                                          onChange={(e) => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileWidth' : 'width', parseInt(e.target.value, 10))}
                                          className={`w-full ${accentColor} cursor-pointer`}
                                        />
                                        {/* Quick Size Presets */}
                                        <div className="flex flex-wrap gap-1 text-[9.5px]">
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileWidth' : 'width', isMobileMode ? 40 : 60)}
                                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                          >
                                            Kecil ({isMobileMode ? '40px' : '60px'})
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileWidth' : 'width', isMobileMode ? 80 : 150)}
                                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                          >
                                            Sedang ({isMobileMode ? '80px' : '150px'})
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileWidth' : 'width', isMobileMode ? 140 : 350)}
                                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                          >
                                            Besar ({isMobileMode ? '140px' : '350px'})
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileWidth' : 'width', isMobileMode ? 220 : 650)}
                                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                          >
                                            Ekstra ({isMobileMode ? '220px' : '650px'})
                                          </button>
                                        </div>
                                      </div>

                                      {/* Opasitas (Transparency) */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-300">
                                          <span>Opasitas Transparansi:</span>
                                          <span className={`font-mono ${valColor}`}>{Math.round(curOpacity * 100)}%</span>
                                        </div>
                                        <input
                                          type="range"
                                          min={0.1}
                                          max={1}
                                          step={0.05}
                                          value={curOpacity}
                                          onChange={(e) => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileOpacity' : 'opacity', parseFloat(e.target.value))}
                                          className={`w-full ${accentColor} cursor-pointer`}
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
                                        <option value="bg">🥉 Setara Background (Di atas Pattern, Di bawah Gambar/Avatar &amp; Tulisan)</option>
                                        <option value="above_image">🥈 Di atas Gambar &amp; Lingkaran Avatar (Di bawah Tulisan / Text)</option>
                                        <option value="above_all">🥇 Di atas Semua Konten (Di atas Gambar &amp; Di atas Tulisan / Judul)</option>
                                      </select>
                                      <p className="text-[10px] text-slate-400">
                                        {asset.layer === 'bg' && '✨ Aset berada pas di atas pattern background, di bawah semua gambar profil dan tulisan.'}
                                        {(asset.layer === 'above_image' || (!asset.layer && asset.zIndex !== 2 && asset.zIndex !== 30)) && '✨ Aset berada di atas lingkaran/foto avatar, namun teks dan judul utama tetap berada di atasnya agar terbaca sempurna.'}
                                        {asset.layer === 'above_all' && '✨ Aset berada di paling depan melayang melintasi tulisan dan gambar.'}
                                      </p>
                                    </div>

                                    {/* Form Input Row 5: PENGATURAN ANIMASI LENGKAP (ANIMASI MASUK, DELAY, DURASI, LOOP, ROTASI & FLIP) */}
                                    <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 space-y-3 pt-3">
                                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                        <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                          <span>Pengaturan Animasi &amp; Gerakan (Motion Settings):</span>
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const curDur = asset.entryDuration || 1500;
                                              handleUpdateFloatingAsset(asset.id, 'entryDuration', curDur === 1500 ? 1501 : 1500);
                                            }}
                                            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
                                            title="Klik untuk memutar ulang animasi masuk pada preview langsung"
                                          >
                                            <Play className="w-2.5 h-2.5 fill-current" />
                                            <span>Uji Animasi</span>
                                          </button>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* 1. Animasi Masuk */}
                                        <div>
                                          <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                                            ✨ Animasi Masuk (Entry Animation):
                                          </label>
                                          <select
                                            value={asset.entryAnimation || 'none'}
                                            onChange={(e) => handleUpdateFloatingAsset(asset.id, 'entryAnimation', e.target.value)}
                                            className={inputClass}
                                          >
                                            <option value="none">🛑 Langsung Tampil (Tanpa Animasi Masuk)</option>
                                            <option value="fade">🌫️ Fade In (Muncul Perlahan)</option>
                                            <option value="slide_up">⬆️ Slide Up (Naik dari Bawah)</option>
                                            <option value="slide_down">⬇️ Slide Down (Turun dari Atas)</option>
                                            <option value="slide_left">⬅️ Slide Left (Masuk dari Kiri)</option>
                                            <option value="slide_right">➡️ Slide Right (Masuk dari Kanan)</option>
                                            <option value="zoom_in">🔍 Zoom In (Pop Membesar)</option>
                                            <option value="zoom_out">🔎 Zoom Out (Mengecil dari Luar)</option>
                                            <option value="rotate_in">🔄 Rotate In (Putar &amp; Masuk)</option>
                                            <option value="bounce_in">🤾 Bounce In (Membumbung Kenyal)</option>
                                          </select>
                                        </div>

                                        {/* 2. Animasi Dijalankan Terus (Loop) */}
                                        <div>
                                          <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                                            🔄 Animasi Dijalankan Terus (Looping):
                                          </label>
                                          <select
                                            value={asset.animation || 'float'}
                                            onChange={(e) => handleUpdateFloatingAsset(asset.id, 'animation', e.target.value)}
                                            className={inputClass}
                                          >
                                            <option value="float">🕊️ Float (Melayang Bergelombang)</option>
                                            <option value="pulse">⭐ Pulse (Denyut Skala)</option>
                                            <option value="bounce">🚀 Bounce (Membumbung Atas-Bawah)</option>
                                            <option value="spin">🌸 Spin (Berputar Lambat 360°)</option>
                                            <option value="drift">⛵ Drift (Melayang Diagonal Santai)</option>
                                            <option value="sway">🌿 Sway (Goyang Kiri-Kanan)</option>
                                            <option value="none">🛑 Diam (Tanpa Animasi Loop)</option>
                                          </select>
                                        </div>
                                      </div>

                                      {/* Durasi / Kecepatan Animasi Masuk (ms) */}
                                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3 text-cyan-400" />
                                            <span>Durasi / Kecepatan Animasi Masuk (Milidetik):</span>
                                          </label>
                                          <div className="flex items-center gap-1.5">
                                            <input
                                              type="number"
                                              min={100}
                                              max={8000}
                                              step={100}
                                              value={asset.entryDuration ?? 1500}
                                              onChange={(e) => handleUpdateFloatingAsset(asset.id, 'entryDuration', Math.max(100, parseInt(e.target.value, 10) || 1500))}
                                              className="w-20 px-2 py-0.5 text-[11px] font-mono text-center font-bold bg-slate-900 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-400"
                                              placeholder="1500"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 font-mono">ms</span>
                                          </div>
                                        </div>
                                        
                                        {/* Quick Presets for Duration */}
                                        <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-800/60 text-[9.5px]">
                                          <span className="text-slate-500 font-medium mr-1">Preset Durasi:</span>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 800)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDuration ?? 1500) === 800 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            800 ms (Cepat)
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 1200)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDuration ?? 1500) === 1200 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            1200 ms (Medium)
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 1500)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDuration ?? 1500) === 1500 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            1500 ms (Slow Smooth)
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDuration', 2000)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDuration ?? 1500) === 2000 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            2000 ms (Super Slow)
                                          </button>
                                        </div>
                                      </div>

                                      {/* Delay Animasi Masuk (ms) */}
                                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-amber-400" />
                                            <span>Jeda / Delay Animasi Masuk (Milidetik):</span>
                                          </label>
                                          <div className="flex items-center gap-1.5">
                                            <input
                                              type="number"
                                              min={0}
                                              max={10000}
                                              step={50}
                                              value={asset.entryDelay ?? 0}
                                              onChange={(e) => handleUpdateFloatingAsset(asset.id, 'entryDelay', Math.max(0, parseInt(e.target.value, 10) || 0))}
                                              className="w-20 px-2 py-0.5 text-[11px] font-mono text-center font-bold bg-slate-900 border border-slate-700 rounded text-amber-300 focus:outline-none focus:border-amber-400"
                                              placeholder="0"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 font-mono">ms</span>
                                          </div>
                                        </div>
                                        
                                        {/* Quick Presets for Delay */}
                                        <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-800/60 text-[9.5px]">
                                          <span className="text-slate-500 font-medium mr-1">Preset Cepat:</span>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 0)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDelay ?? 0) === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            0 ms (Instan)
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 200)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDelay ?? 0) === 200 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            200 ms
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 400)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDelay ?? 0) === 400 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            400 ms
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 600)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDelay ?? 0) === 600 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            600 ms
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateFloatingAsset(asset.id, 'entryDelay', 1000)}
                                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${(asset.entryDelay ?? 0) === 1000 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                          >
                                            1000 ms (1s)
                                          </button>
                                        </div>
                                        <p className="text-[9.5px] text-slate-400 italic">
                                          💡 Setiap perubahan opsi di atas otomatis langsung memutar ulang animasi masuk pada preview tanpa perlu refresh halaman!
                                        </p>
                                      </div>

                                      {/* Rotasi & Mirroring */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <div>
                                          <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                                            Rotasi Kemiringan (°):
                                          </label>
                                          <input
                                            type="number"
                                            min={-180}
                                            max={180}
                                            value={curRotation}
                                            onChange={(e) => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileRotation' : 'rotation', parseInt(e.target.value, 10) || 0)}
                                            className={inputClass}
                                            placeholder="0°"
                                          />
                                        </div>

                                        <div className="flex flex-col justify-end">
                                          <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                                            <input
                                              type="checkbox"
                                              checked={curFlipX}
                                              onChange={(e) => handleUpdateFloatingAsset(asset.id, isMobileMode ? 'mobileFlipX' : 'flipX', e.target.checked)}
                                              className={`${accentColor} w-4 h-4 rounded cursor-pointer`}
                                            />
                                            <span className="text-[11px] font-bold text-slate-300">
                                              Flip Horizontal (Cermin X)
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

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
                          <p className="text-[10px] text-slate-400">Perbesar ukuran badan lingkaran ulat saat kursor berada di atas tombol atau tautan</p>
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

                      {/* Emot / Ikon Reaksi Saat Menyorot Elemen (Terpisah Sendiri) */}
                      <div className="space-y-2 pt-3 border-t border-slate-800/80">
                        <div>
                          <p className="text-xs font-bold text-slate-200">Emot / Balon Reaksi Saat Menyorot Objek</p>
                          <p className="text-[10px] text-slate-400">Pilih emot / balon reaksi yang muncul di atas kepala ulat saat menyorot elemen interaktif:</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                          {[
                            { id: 'question', label: '❓ Tanda Tanya', desc: 'Balon pop-up tanda tanya (?)' },
                            { id: 'exclamation', label: '❗ Tanda Seru', desc: 'Balon pop-up tanda seru (!)' },
                            { id: 'heart', label: '❤️ Love / Hati', desc: 'Balon pop-up emot cinta' },
                            { id: 'sparkle', label: '✨ Bintang Kilau', desc: 'Balon pop-up kilau berkilau' },
                            { id: 'wide_eyes', label: '👀 Mata Melotot', desc: 'Pupil mata terbuka lebar' },
                            { id: 'none', label: '🚫 Tanpa Emot', desc: 'Tidak menampilkan balon reaksi' },
                          ].map((rx) => {
                            const currentReaction = localData.webTexts?.gooey_cursor_hover_reaction || 'question';
                            const isSelected = currentReaction === rx.id;
                            return (
                              <button
                                key={rx.id}
                                type="button"
                                onClick={() => {
                                  handleWebTextChange('gooey_cursor_hover_reaction', rx.id, editLang);
                                }}
                                className={`p-2 rounded-lg text-left transition-all border cursor-pointer select-none flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                                }`}
                              >
                                <span className="text-[11px] font-bold block">{rx.label}</span>
                                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">{rx.desc}</span>
                              </button>
                            );
                          })}
                        </div>
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
            {/* MEDSOS & CV STUDIO (MEDSOS + CORE METHODOLOGY) */}
            {/* ==================================================================== */}
            {editorMode === 'social' ? (
              <div className="space-y-6">
                {/* 1. SUB-TAB 1: MEDIA SOSIAL & KONTAK */}
                {socialCvSubTab === 'socials' && (
                  <div className="space-y-6">
                    {/* 1.1 Header Overview & Live Stats Banner */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-3 relative overflow-hidden`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
                            <Share2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-sky-400 flex items-center gap-1.5">
                              <span>Pengaturan Media Sosial &amp; Kontak</span>
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                              Kelola akun sosial media, kontak utama narahubung profil, serta visibilitas di Web dan Header/Footer CV.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingSocial(true)}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto active:scale-95 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah Akun Baru</span>
                        </button>
                      </div>

                      {/* Summary Metric Chips */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                        <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                          <span className="text-[10px] text-slate-400 block">Total Akun</span>
                          <span className="text-sm font-bold text-slate-200">{(localData.customSocials || []).length} Akun</span>
                        </div>
                        <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/30 text-center">
                          <span className="text-[10px] text-sky-300 block">🌐 Tampil di Web</span>
                          <span className="text-sm font-bold text-sky-400">
                            {(localData.customSocials || []).filter(s => s.showOnWeb !== false).length}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center">
                          <span className="text-[10px] text-emerald-300 block">📄 CV Header/Footer</span>
                          <span className="text-sm font-bold text-emerald-400">
                            {(localData.customSocials || []).filter(s => s.showOnCvHeader || s.showOnCvFooter).length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 1.2 FORM TAMBAH AKUN BARU (EXPANDABLE MODAL / CARD) */}
                    {isAddingSocial && (
                      <div className={`p-4 sm:p-5 rounded-xl border-2 border-sky-500/60 bg-slate-900/95 shadow-xl space-y-4`}>
                        <div className="flex items-center justify-between pb-2 border-b border-sky-500/30">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-md bg-sky-500/20 text-sky-400">
                              <Plus className="w-4 h-4" />
                            </div>
                            <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400">
                              Tambah Akun Media Sosial / Tautan Baru
                            </h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsAddingSocial(false)}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quick Preset Selector */}
                        <div className="space-y-1.5">
                          <label className="block text-[10.5px] font-bold text-slate-300">
                            Pilih Platform Populer (Klik untuk Mengisi Otomatis):
                          </label>
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                            {SOCIAL_PLATFORM_PRESETS.map((preset) => {
                              const isSelected = newSocialData.platform.toLowerCase() === preset.id.toLowerCase();
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => {
                                    setNewSocialData(prev => ({
                                      ...prev,
                                      platform: preset.name,
                                      name: preset.name,
                                      usernameOrUrl: prev.usernameOrUrl || '',
                                    }));
                                  }}
                                  className={`px-2 py-1 rounded-md text-[10.5px] font-medium transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                                    isSelected
                                      ? 'bg-sky-600 text-white font-bold shadow-sm'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                  }`}
                                >
                                  <SocialIcon platform={preset.id} className="w-3.5 h-3.5" useBrandColor={!isSelected} />
                                  <span>{preset.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-400 mb-1">
                              Nama Platform / Judul
                            </label>
                            <input
                              type="text"
                              value={newSocialData.name}
                              onChange={(e) => setNewSocialData(prev => ({ ...prev, name: e.target.value, platform: e.target.value }))}
                              placeholder="mis. LinkedIn, Instagram, Discord..."
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-400 mb-1">
                              Nama Akun / Label Tampilan
                            </label>
                            <input
                              type="text"
                              value={newSocialData.value}
                              onChange={(e) => setNewSocialData(prev => ({ ...prev, value: e.target.value }))}
                              placeholder="mis. Muhammad Zufar Fauzi / @username"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-400 mb-1">
                            Username atau URL Lengkap
                          </label>
                          <input
                            type="text"
                            value={newSocialData.usernameOrUrl}
                            onChange={(e) => setNewSocialData(prev => ({ ...prev, usernameOrUrl: e.target.value }))}
                            placeholder="mis. username / https://linkedin.com/in/... / 0851..."
                            className={inputClass}
                          />
                          {newSocialData.usernameOrUrl && (
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-sky-400">
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                Target Link: <code className="text-sky-300">{getAbsoluteSocialUrl(newSocialData.platform || newSocialData.name, newSocialData.usernameOrUrl)}</code>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Visibility Checkboxes in Add Form */}
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <label className="block text-[10.5px] font-bold text-slate-300">
                            Penempatan &amp; Visibilitas:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 cursor-pointer hover:bg-slate-800">
                              <input
                                type="checkbox"
                                checked={newSocialData.showOnWeb}
                                onChange={(e) => setNewSocialData(prev => ({ ...prev, showOnWeb: e.target.checked }))}
                                className="rounded accent-sky-500 cursor-pointer"
                              />
                              <span>🌐 Tampil di Web</span>
                            </label>

                            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 cursor-pointer hover:bg-slate-800">
                              <input
                                type="checkbox"
                                checked={newSocialData.showOnCvHeader}
                                onChange={(e) => setNewSocialData(prev => ({ ...prev, showOnCvHeader: e.target.checked }))}
                                className="rounded accent-emerald-500 cursor-pointer"
                              />
                              <span>📄 CV Header</span>
                            </label>

                            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 cursor-pointer hover:bg-slate-800">
                              <input
                                type="checkbox"
                                checked={newSocialData.showOnCvFooter}
                                onChange={(e) => setNewSocialData(prev => ({ ...prev, showOnCvFooter: e.target.checked }))}
                                className="rounded accent-teal-500 cursor-pointer"
                              />
                              <span>📑 CV Footer</span>
                            </label>
                          </div>
                        </div>

                        {/* Form Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setIsAddingSocial(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const platformName = newSocialData.platform.trim() || newSocialData.name.trim() || 'Custom';
                              const displayVal = newSocialData.value.trim() || newSocialData.usernameOrUrl.trim() || platformName;
                              const urlVal = newSocialData.usernameOrUrl.trim() || newSocialData.value.trim();
                              if (!urlVal && !displayVal) return;

                              const newId = `social-${Date.now()}`;
                              const newSocial: CustomSocial = {
                                id: newId,
                                name: platformName,
                                value: displayVal,
                                usernameOrUrl: urlVal,
                                showOnWeb: newSocialData.showOnWeb,
                                showOnCvHeader: newSocialData.showOnCvHeader,
                                showOnCvFooter: newSocialData.showOnCvFooter,
                              };

                              handleUpdate(prev => {
                                const list = [...(prev.customSocials || []), newSocial];
                                let footerList = prev.footerSocials || [];
                                if (newSocialData.showOnWeb || newSocialData.showOnCvFooter) {
                                  footerList = Array.from(new Set([...footerList, newId]));
                                }
                                let headerList = prev.headerContacts || [];
                                if (newSocialData.showOnCvHeader) {
                                  headerList = Array.from(new Set([...headerList, newId]));
                                }

                                return {
                                  ...prev,
                                  customSocials: list,
                                  footerSocials: footerList,
                                  headerContacts: headerList,
                                };
                              });

                              setNewSocialData({
                                platform: 'LinkedIn',
                                name: 'LinkedIn',
                                value: '',
                                usernameOrUrl: '',
                                showOnWeb: true,
                                showOnCvHeader: true,
                                showOnCvFooter: true,
                              });
                              setIsAddingSocial(false);
                            }}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Simpan Akun Baru</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 1.3 KONTAK UTAMA & PROFIL LANGSUNG */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center justify-between pb-1 border-b border-sky-500/20">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>Kontak Utama &amp; Narahubung Profil</span>
                        </h5>
                        <span className="text-[10px] text-slate-400">Sinkronisasi Instan</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Email */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-sky-400" />
                            <span>Alamat Email Utama</span>
                          </label>
                          <input
                            type="email"
                            value={localData.email || ''}
                            onChange={(e) => handleUpdate(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="contoh@gmail.com"
                            className={inputClass}
                          />
                        </div>

                        {/* Lokasi */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-emerald-400" />
                            <span>Lokasi / Domisili</span>
                          </label>
                          <input
                            type="text"
                            value={localData.location || ''}
                            onChange={(e) => handleUpdate(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Klaten, Jawa Tengah / Indonesia"
                            className={inputClass}
                          />
                        </div>

                        {/* WhatsApp */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                            <SocialIcon platform="whatsapp" className="w-3 h-3" />
                            <span>Nomor WhatsApp / Telepon</span>
                          </label>
                          <input
                            type="text"
                            value={localData.whatsapp || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdate(prev => {
                                const updatedCustoms = (prev.customSocials || []).map(s => {
                                  if (s.id === 'social-whatsapp' || s.name?.toLowerCase() === 'whatsapp') {
                                    return { ...s, value: val, usernameOrUrl: val };
                                  }
                                  return s;
                                });
                                return { ...prev, whatsapp: val, customSocials: updatedCustoms };
                              });
                            }}
                            placeholder="085123333230 atau +6285..."
                            className={inputClass}
                          />
                        </div>

                        {/* LinkedIn */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                            <SocialIcon platform="linkedin" className="w-3 h-3" />
                            <span>LinkedIn Utama</span>
                          </label>
                          <input
                            type="text"
                            value={localData.linkedin || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdate(prev => {
                                const updatedCustoms = (prev.customSocials || []).map(s => {
                                  if (s.id === 'social-linkedin' || s.name?.toLowerCase() === 'linkedin') {
                                    return { ...s, usernameOrUrl: val };
                                  }
                                  return s;
                                });
                                return { ...prev, linkedin: val, customSocials: updatedCustoms };
                              });
                            }}
                            placeholder="muhammad-zufar-fauzi atau link lengkap"
                            className={inputClass}
                          />
                        </div>

                        {/* GitHub */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                            <SocialIcon platform="github" className="w-3 h-3" />
                            <span>GitHub Utama</span>
                          </label>
                          <input
                            type="text"
                            value={localData.github || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdate(prev => {
                                const updatedCustoms = (prev.customSocials || []).map(s => {
                                  if (s.id === 'social-github' || s.name?.toLowerCase() === 'github') {
                                    return { ...s, usernameOrUrl: val };
                                  }
                                  return s;
                                });
                                return { ...prev, github: val, customSocials: updatedCustoms };
                              });
                            }}
                            placeholder="ZufarFz atau link lengkap"
                            className={inputClass}
                          />
                        </div>

                        {/* Instagram */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                            <SocialIcon platform="instagram" className="w-3 h-3" />
                            <span>Instagram Utama</span>
                          </label>
                          <input
                            type="text"
                            value={localData.instagram || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdate(prev => {
                                const updatedCustoms = (prev.customSocials || []).map(s => {
                                  if (s.id === 'social-instagram' || s.name?.toLowerCase() === 'instagram') {
                                    return { ...s, value: val, usernameOrUrl: val };
                                  }
                                  return s;
                                });
                                return { ...prev, instagram: val, customSocials: updatedCustoms };
                              });
                            }}
                            placeholder="Zuf.Fz_ atau link lengkap"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1.4 DAFTAR KARTU MEDIA SOSIAL (CUSTOM SOCIALS LIST) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                            <Link className="w-3.5 h-3.5" />
                            <span>Daftar Akun Media Sosial &amp; Tautan ({ (localData.customSocials || []).length })</span>
                          </h5>
                          <p className="text-[10px] text-slate-400">
                            Atur urutan tampilan, label nama, tautan, dan centang di mana akun ini akan muncul
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingSocial(true)}
                          className="px-2.5 py-1 rounded-md bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah</span>
                        </button>
                      </div>

                      {(localData.customSocials || []).length === 0 ? (
                        <div className={`p-6 rounded-xl border ${cardBg} text-center space-y-2`}>
                          <Share2 className="w-8 h-8 text-slate-500 mx-auto" />
                          <p className="text-xs font-semibold text-slate-300">Belum ada akun media sosial yang terdaftar.</p>
                          <button
                            type="button"
                            onClick={() => setIsAddingSocial(true)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow transition-all inline-flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Akun Pertama</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(localData.customSocials || []).map((social, index) => {
                            const directUrl = getAbsoluteSocialUrl(social.name || social.id, social.usernameOrUrl || social.value);

                            return (
                              <div
                                key={social.id || index}
                                className={`p-3.5 rounded-xl border ${cardBg} space-y-3 hover:border-sky-500/40 transition-all shadow-xs`}
                              >
                                {/* Card Header */}
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                      <SocialIcon platform={social.name || social.id} className="w-4 h-4" useBrandColor />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-bold text-xs text-slate-200 block truncate">
                                        {social.name || 'Platform'}
                                      </span>
                                      <a
                                        href={directUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 truncate"
                                      >
                                        <span className="truncate">{social.usernameOrUrl || social.value || 'Belum ada tautan'}</span>
                                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                      </a>
                                    </div>
                                  </div>

                                  {/* Ordering and Delete controls */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      disabled={index === 0}
                                      onClick={() => {
                                        if (index === 0) return;
                                        handleUpdate(prev => {
                                          const list = [...(prev.customSocials || [])];
                                          const temp = list[index];
                                          list[index] = list[index - 1];
                                          list[index - 1] = temp;
                                          return { ...prev, customSocials: list };
                                        });
                                      }}
                                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                                      title="Pindah ke Atas"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={index === (localData.customSocials || []).length - 1}
                                      onClick={() => {
                                        if (index >= (localData.customSocials || []).length - 1) return;
                                        handleUpdate(prev => {
                                          const list = [...(prev.customSocials || [])];
                                          const temp = list[index];
                                          list[index] = list[index + 1];
                                          list[index + 1] = temp;
                                          return { ...prev, customSocials: list };
                                        });
                                      }}
                                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                                      title="Pindah ke Bawah"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleUpdate(prev => ({
                                          ...prev,
                                          customSocials: (prev.customSocials || []).filter((_, i) => i !== index),
                                          headerContacts: (prev.headerContacts || []).filter(id => id !== social.id),
                                          footerSocials: (prev.footerSocials || []).filter(id => id !== social.id),
                                        }));
                                      }}
                                      className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all cursor-pointer ml-1"
                                      title="Hapus Akun Ini"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Card Inline Edit Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                      Nama Platform
                                    </label>
                                    <input
                                      type="text"
                                      value={social.name || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        handleUpdate(prev => {
                                          const list = [...(prev.customSocials || [])];
                                          list[index] = { ...list[index], name: val };
                                          return { ...prev, customSocials: list };
                                        });
                                      }}
                                      placeholder="Nama Platform"
                                      className={inputClass}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                      Label / Nama Akun Tampilan
                                    </label>
                                    <input
                                      type="text"
                                      value={social.value || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        handleUpdate(prev => {
                                          const list = [...(prev.customSocials || [])];
                                          list[index] = { ...list[index], value: val };
                                          return { ...prev, customSocials: list };
                                        });
                                      }}
                                      placeholder="Nama akun"
                                      className={inputClass}
                                    />
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                      Username / URL Tautan
                                    </label>
                                    <input
                                      type="text"
                                      value={social.usernameOrUrl || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        handleUpdate(prev => {
                                          const list = [...(prev.customSocials || [])];
                                          list[index] = { ...list[index], usernameOrUrl: val };
                                          return { ...prev, customSocials: list };
                                        });
                                      }}
                                      placeholder="https://... atau username"
                                      className={inputClass}
                                    />
                                  </div>
                                </div>

                                {/* Card Visibility Matrix Checkboxes */}
                                <div className="pt-2 border-t border-slate-800/80">
                                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                                    Penempatan &amp; Visibilitas:
                                  </span>
                                  <div className="flex flex-wrap gap-2 text-[10.5px]">
                                    {/* 🌐 Web */}
                                    <label className={`px-2 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-all ${
                                      social.showOnWeb !== false
                                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 font-semibold'
                                        : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                                    }`}>
                                      <input
                                        type="checkbox"
                                        checked={social.showOnWeb !== false}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          handleUpdate(prev => {
                                            const list = [...(prev.customSocials || [])];
                                            list[index] = { ...list[index], showOnWeb: checked };
                                            return { ...prev, customSocials: list };
                                          });
                                        }}
                                        className="rounded accent-sky-500 cursor-pointer"
                                      />
                                      <span>🌐 Web</span>
                                    </label>

                                    {/* 📄 CV Header */}
                                    <label className={`px-2 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-all ${
                                      social.showOnCvHeader
                                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                                        : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                                    }`}>
                                      <input
                                        type="checkbox"
                                        checked={!!social.showOnCvHeader}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          handleUpdate(prev => {
                                            const list = [...(prev.customSocials || [])];
                                            list[index] = { ...list[index], showOnCvHeader: checked };
                                            let hList = prev.headerContacts || [];
                                            if (checked) {
                                              hList = Array.from(new Set([...hList, social.id]));
                                            } else {
                                              hList = hList.filter(id => id !== social.id);
                                            }
                                            return { ...prev, customSocials: list, headerContacts: hList };
                                          });
                                        }}
                                        className="rounded accent-emerald-500 cursor-pointer"
                                      />
                                      <span>📄 CV Header</span>
                                    </label>

                                    {/* 📑 CV Footer */}
                                    <label className={`px-2 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-all ${
                                      social.showOnCvFooter
                                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-300 font-semibold'
                                        : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                                    }`}>
                                      <input
                                        type="checkbox"
                                        checked={!!social.showOnCvFooter}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          handleUpdate(prev => {
                                            const list = [...(prev.customSocials || [])];
                                            list[index] = { ...list[index], showOnCvFooter: checked };
                                            let fList = prev.footerSocials || [];
                                            if (checked) {
                                              fList = Array.from(new Set([...fList, social.id]));
                                            } else {
                                              fList = fList.filter(id => id !== social.id);
                                            }
                                            return { ...prev, customSocials: list, footerSocials: fList };
                                          });
                                        }}
                                        className="rounded accent-teal-500 cursor-pointer"
                                      />
                                      <span>📑 CV Footer</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 1.5 MATRIKS PENEMPATAN KONTAK CEPAT */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center justify-between pb-1 border-b border-sky-500/20">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Matriks Penempatan Kontak Cepat di CV</span>
                        </h5>
                        <span className="text-[10px] text-slate-400">Header &amp; Footer Presets</span>
                      </div>

                      {/* Header Contacts (CV Header) */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-300">
                          1. Kontak di Header CV (<code className="text-emerald-400">headerContacts</code>):
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'location', label: '📍 Lokasi' },
                            { id: 'email', label: '✉️ Email' },
                            { id: 'social-linkedin', label: '💼 LinkedIn' },
                            { id: 'social-github', label: '🐙 GitHub' },
                            { id: 'social-whatsapp', label: '💬 WhatsApp' },
                            { id: 'social-instagram', label: '📷 Instagram' },
                            ...(localData.customSocials || []).map(s => ({ id: s.id, label: `🔗 ${s.name}` }))
                          ].map(item => {
                            const isChecked = (localData.headerContacts || []).includes(item.id);
                            return (
                              <button
                                key={`header-${item.id}`}
                                type="button"
                                onClick={() => {
                                  handleUpdate(prev => {
                                    const current = prev.headerContacts || [];
                                    const next = isChecked ? current.filter(x => x !== item.id) : [...current, item.id];
                                    return { ...prev, headerContacts: next };
                                  });
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isChecked
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                                }`}
                              >
                                {isChecked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-500" />}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Contacts (CV Footer) */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="block text-[11px] font-bold text-slate-300">
                          2. Tautan di Footer CV (<code className="text-teal-400">footerSocials</code>):
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'social-linkedin', label: '💼 LinkedIn' },
                            { id: 'social-github', label: '🐙 GitHub' },
                            { id: 'social-whatsapp', label: '💬 WhatsApp' },
                            { id: 'social-instagram', label: '📷 Instagram' },
                            { id: 'email', label: '✉️ Email' },
                            ...(localData.customSocials || []).map(s => ({ id: s.id, label: `🔗 ${s.name}` }))
                          ].map(item => {
                            const isChecked = (localData.footerSocials || []).includes(item.id);
                            return (
                              <button
                                key={`footer-${item.id}`}
                                type="button"
                                onClick={() => {
                                  handleUpdate(prev => {
                                    const current = prev.footerSocials || [];
                                    const next = isChecked ? current.filter(x => x !== item.id) : [...current, item.id];
                                    return { ...prev, footerSocials: next };
                                  });
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isChecked
                                    ? 'bg-teal-600 text-white border-teal-500 shadow-xs'
                                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                                }`}
                              >
                                {isChecked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-500" />}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 1.6 LIVE PREVIEW BAR */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span>Pratinjau Tombol Media Sosial di Website:</span>
                        </span>
                        <span className="text-[10px] text-slate-500">Live Preview</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-2">
                        {(localData.customSocials || []).filter(s => s.showOnWeb !== false).map((social) => {
                          const link = getAbsoluteSocialUrl(social.name || social.id, social.usernameOrUrl || social.value);
                          return (
                            <a
                              key={`preview-${social.id}`}
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <SocialIcon platform={social.name || social.id} className="w-3.5 h-3.5" useBrandColor />
                              <span>{social.value || social.name}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SUB-TAB 2: CORE METHODOLOGY & CV SETTINGS */}
                {socialCvSubTab === 'methodology_cv' && (
                  <div className="space-y-6">
                    {/* 2.1 Header Banner */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-3 relative overflow-hidden`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>Pengaturan CV &amp; Core Methodology</span>
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                              Atur judul &amp; deskripsi filosofi analitis (&ldquo;Core Methodology&rdquo;) yang tampil di CV interaktif &amp; cetak.
                            </p>
                          </div>
                        </div>

                        {/* Language Indicator & Quick Switch */}
                        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setEditLang('id')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              editLang === 'id'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>🇮🇩</span> ID
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditLang('en')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              editLang === 'en'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>🇬🇧</span> EN
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2.2 CARD 1: PENGATURAN TULISAN "CORE METHODOLOGY" */}
                    <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-500/20">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                              Tulisan &amp; Filosofi &ldquo;Core Methodology&rdquo;
                            </h5>
                            <span className="text-[10px] text-slate-400 block">
                              Bahasa Aktif: <strong className="text-emerald-300">{editLang === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English'}</strong>
                            </span>
                          </div>
                        </div>

                        {/* AI Language Transfer Button */}
                        <button
                          type="button"
                          onClick={() => setMethodologyTranslateModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-400/40"
                          title="Transfer Bahasa Otomatis (ID <-> EN) menggunakan AI Gemini"
                        >
                          <Languages className="w-3.5 h-3.5" />
                          <span>Transfer Bahasa (AI)</span>
                        </button>
                      </div>

                      {/* Quick AI Translate Helper Bar */}
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            Dukungan Dual-Bahasa: Tulis dalam satu bahasa, lalu gunakan <strong>Transfer Bahasa (AI)</strong> untuk menerjemahkan ke versi counterpart secara otomatis.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMethodologyTranslateModalOpen(true)}
                          className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/30 cursor-pointer flex items-center gap-1 shrink-0 transition-all active:scale-95"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-emerald-300" />
                          <span>AI Transfer ({editLang === 'id' ? 'ID ➜ EN' : 'EN ➜ ID'})</span>
                        </button>
                      </div>

                      {/* Judul Core Methodology */}
                      {(() => {
                        const currentMethodologyTitle = editLang === 'id'
                          ? (localData.webTexts?.[`methodologyTitle_id`] || (localData.webTexts?.methodologyTitle && editLang === 'id' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || (ID_TRANSLATIONS as any).methodologyTitle || 'Metodologi Utama')
                          : (localData.webTexts?.[`methodologyTitle_en`] || (localData.webTexts?.methodologyTitle && editLang === 'en' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || 'Core Methodology');

                        const currentMethodologyText = editLang === 'id'
                          ? (localData.webTexts?.[`methodologyText_id`] || (localData.webTexts?.methodologyText && editLang === 'id' ? localData.webTexts.methodologyText : '') || localData.methodologyText || (ID_TRANSLATIONS as any).methodologyText || '')
                          : (localData.webTexts?.[`methodologyText_en`] || (localData.webTexts?.methodologyText && editLang === 'en' ? localData.webTexts.methodologyText : '') || localData.methodologyText || '');

                        return (
                          <div className="space-y-4">
                            {/* Input Judul */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10.5px] font-bold text-slate-300">
                                  1. Judul Seksi Metodologi ({editLang.toUpperCase()}):
                                </label>
                                {renderAiButton(
                                  `Judul Core Methodology (${editLang.toUpperCase()})`,
                                  currentMethodologyTitle,
                                  (val) => {
                                    handleUpdate(prev => {
                                      const nextTexts = { ...(prev.webTexts || {}) };
                                      nextTexts[`methodologyTitle_${editLang}`] = val;
                                      nextTexts.methodologyTitle = val;
                                      return {
                                        ...prev,
                                        methodologyTitle: val,
                                        webTexts: nextTexts
                                      };
                                    });
                                  },
                                  "Judul seksi metodologi kerja analitis pada dokumen resume CV"
                                )}
                              </div>
                              <input
                                type="text"
                                value={currentMethodologyTitle}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdate(prev => {
                                    const nextTexts = { ...(prev.webTexts || {}) };
                                    nextTexts[`methodologyTitle_${editLang}`] = val;
                                    nextTexts.methodologyTitle = val;
                                    return {
                                      ...prev,
                                      methodologyTitle: val,
                                      webTexts: nextTexts
                                    };
                                  });
                                }}
                                placeholder={editLang === 'id' ? 'mis. Metodologi Utama / Filosofi Kerja' : 'e.g. Core Methodology'}
                                className={inputClass}
                              />
                              <p className="text-[10px] text-slate-400 mt-1">
                                Tampil sebagai judul seksi beraksen bintang di dokumen Resume/CV interaktif dan ekspor Word.
                              </p>
                            </div>

                            {/* Textarea Deskripsi Metodologi */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10.5px] font-bold text-slate-300">
                                  2. Deskripsi &amp; Filosofi Analitis ({editLang.toUpperCase()}):
                                </label>
                                {renderAiButton(
                                  `Deskripsi Core Methodology (${editLang.toUpperCase()})`,
                                  currentMethodologyText,
                                  (val) => {
                                    handleUpdate(prev => {
                                      const nextTexts = { ...(prev.webTexts || {}) };
                                      nextTexts[`methodologyText_${editLang}`] = val;
                                      nextTexts.methodologyText = val;
                                      return {
                                        ...prev,
                                        methodologyText: val,
                                        webTexts: nextTexts
                                      };
                                    });
                                  },
                                  "Deskripsi filosofi analitis data pipeline, transparansi metrik, dan validasi statistik untuk resume CV"
                                )}
                              </div>
                              <textarea
                                rows={5}
                                value={currentMethodologyText}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdate(prev => {
                                    const nextTexts = { ...(prev.webTexts || {}) };
                                    nextTexts[`methodologyText_${editLang}`] = val;
                                    nextTexts.methodologyText = val;
                                    return {
                                      ...prev,
                                      methodologyText: val,
                                      webTexts: nextTexts
                                    };
                                  });
                                }}
                                placeholder={
                                  editLang === 'id'
                                    ? 'Tuliskan pendekatan, prinsip analitis, dan metodologi kerja Anda...'
                                    : 'Write your analytical philosophy, data pipeline principles, and methodology...'
                                }
                                className={`${inputClass} font-sans leading-relaxed resize-y`}
                              />
                              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
                                <span>Mendukung format Markdown: <code>**tebal**</code>, <code>*miring*</code>, <code>_garis bawah_</code></span>
                                <span>{(currentMethodologyText || '').length} Karakter</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 2.3 CARD 2: LIVE PRATINJAU KOTAK "CORE METHODOLOGY" DI RESUME */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pratinjau Tampilan &ldquo;Core Methodology&rdquo; di Resume CV</span>
                        </h5>
                        <span className="text-[10px] text-slate-500">Live Preview</span>
                      </div>

                      {(() => {
                        const previewTitle = editLang === 'id'
                          ? (localData.webTexts?.[`methodologyTitle_id`] || (localData.webTexts?.methodologyTitle && editLang === 'id' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || (ID_TRANSLATIONS as any).methodologyTitle || 'Metodologi Utama')
                          : (localData.webTexts?.[`methodologyTitle_en`] || (localData.webTexts?.methodologyTitle && editLang === 'en' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || 'Core Methodology');

                        const previewText = editLang === 'id'
                          ? (localData.webTexts?.[`methodologyText_id`] || (localData.webTexts?.methodologyText && editLang === 'id' ? localData.webTexts.methodologyText : '') || localData.methodologyText || (ID_TRANSLATIONS as any).methodologyText || '')
                          : (localData.webTexts?.[`methodologyText_en`] || (localData.webTexts?.methodologyText && editLang === 'en' ? localData.webTexts.methodologyText : '') || localData.methodologyText || '');

                        return (
                          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 shadow-md">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <h6 className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
                                {previewTitle}
                              </h6>
                            </div>
                            <div className="text-[11px] leading-relaxed text-slate-300 italic">
                              {previewText ? (
                                <MarkdownText content={previewText} theme="dark" />
                              ) : (
                                <span className="text-slate-500 italic">(Belum ada deskripsi metodologi)</span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 2.4 CARD 3: PENATAAN SEKSI RESUME CV (SECTION ORDER) */}
                    <div className={`p-4 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Urutan &amp; Penataan Seksi Dokumen CV</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdate(prev => ({
                              ...prev,
                              layoutSettings: {
                                fontSize: 'standard',
                                spacing: 'standard',
                                layoutStyle: 'left-sidebar',
                                fontFamily: 'sans',
                                themeColor: 'blue',
                                ...(prev.layoutSettings || {}),
                                sectionOrder: ['arsenal', 'education', 'experience', 'methodology']
                              }
                            }));
                          }}
                          className="text-[10.5px] font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Kembalikan ke Urutan Standar"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Urutan</span>
                        </button>
                      </div>

                      {(() => {
                        const currentOrder = (localData.layoutSettings?.sectionOrder && localData.layoutSettings.sectionOrder.length > 0)
                          ? localData.layoutSettings.sectionOrder
                          : ['arsenal', 'education', 'experience', 'methodology'];

                        const sectionLabels: Record<string, { name: string; icon: any; color: string }> = {
                          arsenal: { name: 'Technical Arsenal (Keahlian Teknis)', icon: Cpu, color: 'text-sky-400' },
                          education: { name: 'Pendidikan & Riwayat Akademis', icon: GraduationCap, color: 'text-amber-400' },
                          experience: { name: 'Pengalaman Kerja & Karir', icon: Briefcase, color: 'text-indigo-400' },
                          methodology: { name: 'Core Methodology (Filosofi Kerja)', icon: Sparkles, color: 'text-emerald-400' },
                        };

                        return (
                          <div className="space-y-2">
                            {currentOrder.map((secId, index) => {
                              const secInfo = sectionLabels[secId] || { name: secId, icon: FileText, color: 'text-slate-400' };
                              const SecIcon = secInfo.icon;
                              const isFirst = index === 0;
                              const isLast = index === currentOrder.length - 1;

                              return (
                                <div
                                  key={secId}
                                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                                    secId === 'methodology'
                                      ? 'bg-emerald-950/20 border-emerald-500/40'
                                      : 'bg-slate-900/70 border-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0">
                                      {index + 1}
                                    </span>
                                    <SecIcon className={`w-4 h-4 ${secInfo.color} shrink-0`} />
                                    <span className={`text-xs font-semibold truncate ${secId === 'methodology' ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                                      {secInfo.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      disabled={isFirst}
                                      onClick={() => {
                                        if (isFirst) return;
                                        const newOrder = [...currentOrder];
                                        const temp = newOrder[index];
                                        newOrder[index] = newOrder[index - 1];
                                        newOrder[index - 1] = temp;
                                        handleUpdate(prev => ({
                                          ...prev,
                                          layoutSettings: {
                                            fontSize: 'standard',
                                            spacing: 'standard',
                                            layoutStyle: 'left-sidebar',
                                            fontFamily: 'sans',
                                            themeColor: 'blue',
                                            ...(prev.layoutSettings || {}),
                                            sectionOrder: newOrder
                                          }
                                        }));
                                      }}
                                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                                      title="Pindah ke Atas"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLast}
                                      onClick={() => {
                                        if (isLast) return;
                                        const newOrder = [...currentOrder];
                                        const temp = newOrder[index];
                                        newOrder[index] = newOrder[index + 1];
                                        newOrder[index + 1] = temp;
                                        handleUpdate(prev => ({
                                          ...prev,
                                          layoutSettings: {
                                            fontSize: 'standard',
                                            spacing: 'standard',
                                            layoutStyle: 'left-sidebar',
                                            fontFamily: 'sans',
                                            themeColor: 'blue',
                                            ...(prev.layoutSettings || {}),
                                            sectionOrder: newOrder
                                          }
                                        }));
                                      }}
                                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                                      title="Pindah ke Bawah"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 3. SUB-TAB 3: PENGATURAN LAYOUT & DESAIN CV */}
                {/* ------------------------------------------------------------- */}
                {socialCvSubTab === 'cv_layout' && (
                  <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <Sliders className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                              <span>Studio Layout &amp; Desain Resume CV</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                                Real-time
                              </span>
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Atur posisi kolom keahlian (kiri/kanan), perataan header, posisi foto profil, dan urutan seksi CV.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleUpdate((prev) => ({
                              ...prev,
                              layoutSettings: {
                                layoutStyle: 'left-sidebar',
                                headerAlignment: 'left',
                                headerPhotoPosition: 'left',
                                contactPosition: 'bottom',
                                fontSize: 'standard',
                                spacing: 'standard',
                                fontFamily: 'sans',
                                themeColor: 'blue',
                                sectionOrder: ['arsenal', 'education', 'experience', 'methodology']
                              }
                            }));
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-all"
                          title="Kembalikan semua pengaturan layout ke nilai bawaan pabrik"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Layout Standar</span>
                        </button>
                      </div>
                    </div>

                    {/* MINI LIVE VISUALIZER */}
                    {(() => {
                      const curLayout = localData.layoutSettings?.layoutStyle || 'left-sidebar';
                      const curAlign = localData.layoutSettings?.headerAlignment || 'left';
                      const curPhotoPos = localData.layoutSettings?.headerPhotoPosition || 'left';
                      const curTheme = localData.layoutSettings?.themeColor || 'blue';

                      const themeAccentMap: Record<string, { bar: string; badge: string; text: string }> = {
                        emerald: { bar: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-400', text: 'Emerald Green' },
                        blue: { bar: 'bg-blue-600', badge: 'bg-blue-500/20 text-blue-400', text: 'Royal Blue' },
                        slate: { bar: 'bg-slate-600', badge: 'bg-slate-500/20 text-slate-300', text: 'Slate Classic' },
                        indigo: { bar: 'bg-indigo-600', badge: 'bg-indigo-500/20 text-indigo-400', text: 'Deep Indigo' },
                        rose: { bar: 'bg-rose-600', badge: 'bg-rose-500/20 text-rose-400', text: 'Rose Crimson' },
                        amber: { bar: 'bg-amber-600', badge: 'bg-amber-500/20 text-amber-400', text: 'Warm Amber' },
                      };
                      const activeTheme = themeAccentMap[curTheme] || themeAccentMap.blue;

                      return (
                        <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                          <div className="flex items-center justify-between pb-1 border-b border-indigo-500/20">
                            <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Simulasi Miniatur Tata Letak Resume CV</span>
                            </h5>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {curLayout} &bull; {curAlign} &bull; foto {curPhotoPos}
                            </span>
                          </div>

                          {/* Mini Paper Sheet Visualizer */}
                          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex flex-col items-center">
                            <div className="w-full max-w-sm bg-white rounded-md p-3.5 text-slate-900 shadow-md flex flex-col gap-2.5 transition-all">
                              {/* Accent Top Bar */}
                              <div className={`w-full h-1 rounded-full ${activeTheme.bar}`} />

                              {/* Header Simulation */}
                              <div className={`w-full pb-2 border-b border-slate-300 flex flex-col ${
                                curAlign === 'center' ? 'items-center text-center' :
                                curAlign === 'right' ? 'items-end text-right' :
                                curAlign === 'justify' ? 'items-stretch' : 'items-start text-left'
                              }`}>
                                <div className={`flex w-full items-center gap-2 ${
                                  curPhotoPos === 'top'
                                    ? (curAlign === 'center' ? 'flex-col items-center' : curAlign === 'right' ? 'flex-col items-end' : 'flex-col items-start')
                                    : curPhotoPos === 'right'
                                      ? 'flex-row-reverse justify-between'
                                      : curAlign === 'center'
                                        ? 'flex-col items-center justify-center'
                                        : curAlign === 'justify'
                                          ? 'flex-row items-center justify-between'
                                          : 'flex-row items-center justify-between'
                                }`}>
                                  {/* Photo node in mini */}
                                  {curPhotoPos !== 'none' && (
                                    <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                                      {localData.avatarUrl ? (
                                        <img src={localData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                      ) : (
                                        <User className="w-4 h-4 text-slate-400" />
                                      )}
                                    </div>
                                  )}

                                  {/* Name & Title block */}
                                  <div className={`flex flex-col ${
                                    curAlign === 'center' ? 'items-center text-center' :
                                    curAlign === 'right' ? 'items-end text-right' : 'items-start text-left'
                                  }`}>
                                    <span className="text-[11px] font-black tracking-tight text-slate-900 leading-tight">
                                      {localData.name || 'NAMA LENGKAP'}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                                      {localData.title || 'PROFESSIONAL TITLE'}
                                    </span>
                                  </div>

                                  {/* Contacts simulation */}
                                  {curAlign === 'justify' && (
                                    <div className="text-[7.5px] text-slate-500 font-mono text-right shrink-0">
                                      {localData.email ? localData.email : 'contact@domain.com'}
                                    </div>
                                  )}
                                </div>

                                {curAlign !== 'justify' && (
                                  <div className={`text-[7.5px] text-slate-500 font-mono mt-1 flex flex-wrap gap-1 ${
                                    curAlign === 'center' ? 'justify-center' : curAlign === 'right' ? 'justify-end' : 'justify-start'
                                  }`}>
                                    <span>{localData.location || 'Indonesia'}</span>
                                    <span>&bull;</span>
                                    <span>{localData.email || 'email@example.com'}</span>
                                  </div>
                                )}
                              </div>

                              {/* Columns Simulation */}
                              <div className="w-full pt-1 flex gap-2 text-[8px]">
                                {curLayout === 'left-sidebar' && (
                                  <>
                                    {/* Left Sidebar: Skill & Edu */}
                                    <div className="w-1/3 bg-slate-100 rounded p-1.5 flex flex-col gap-1 border border-slate-200">
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Skills</span>
                                      </div>
                                      <div className="space-y-0.5 text-[7px] text-slate-600">
                                        <div className="h-1 bg-slate-300 rounded w-4/5" />
                                        <div className="h-1 bg-slate-300 rounded w-3/5" />
                                        <div className="h-1 bg-slate-300 rounded w-4/5" />
                                      </div>
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-1 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Pendidikan</span>
                                      </div>
                                      <div className="h-1 bg-slate-300 rounded w-full" />
                                    </div>

                                    {/* Right Content: Experience & Methodology */}
                                    <div className="w-2/3 bg-slate-50 rounded p-1.5 flex flex-col gap-1.5 border border-slate-200">
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Pengalaman</span>
                                      </div>
                                      <div className="space-y-1 text-[7px] text-slate-600">
                                        <div className="h-1.5 bg-slate-300 rounded w-full" />
                                        <div className="h-1 bg-slate-200 rounded w-5/6" />
                                        <div className="h-1 bg-slate-200 rounded w-4/6" />
                                      </div>
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-0.5 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Methodology</span>
                                      </div>
                                      <div className="h-1 bg-slate-200 rounded w-full" />
                                    </div>
                                  </>
                                )}

                                {curLayout === 'right-sidebar' && (
                                  <>
                                    {/* Left Content: Experience & Methodology */}
                                    <div className="w-2/3 bg-slate-50 rounded p-1.5 flex flex-col gap-1.5 border border-slate-200">
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Pengalaman</span>
                                      </div>
                                      <div className="space-y-1 text-[7px] text-slate-600">
                                        <div className="h-1.5 bg-slate-300 rounded w-full" />
                                        <div className="h-1 bg-slate-200 rounded w-5/6" />
                                        <div className="h-1 bg-slate-200 rounded w-4/6" />
                                      </div>
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-0.5 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Methodology</span>
                                      </div>
                                      <div className="h-1 bg-slate-200 rounded w-full" />
                                    </div>

                                    {/* Right Sidebar: Skill & Edu */}
                                    <div className="w-1/3 bg-slate-100 rounded p-1.5 flex flex-col gap-1 border border-slate-200">
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Skills</span>
                                      </div>
                                      <div className="space-y-0.5 text-[7px] text-slate-600">
                                        <div className="h-1 bg-slate-300 rounded w-4/5" />
                                        <div className="h-1 bg-slate-300 rounded w-3/5" />
                                        <div className="h-1 bg-slate-300 rounded w-4/5" />
                                      </div>
                                      <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-1 flex items-center gap-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                        <span>Pendidikan</span>
                                      </div>
                                      <div className="h-1 bg-slate-300 rounded w-full" />
                                    </div>
                                  </>
                                )}

                                {curLayout === 'single-column' && (
                                  <div className="w-full bg-slate-50 rounded p-1.5 flex flex-col gap-1.5 border border-slate-200">
                                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 flex items-center gap-0.5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                      <span>Pengalaman Kerja (Penuh)</span>
                                    </div>
                                    <div className="h-1 bg-slate-300 rounded w-full" />
                                    <div className="font-bold text-slate-800 text-[8px] border-b border-slate-300 pb-0.5 mt-1 flex items-center gap-0.5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.bar}`} />
                                      <span>Technical Arsenal &amp; Skills</span>
                                    </div>
                                    <div className="h-1 bg-slate-300 rounded w-4/5" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CARD 1: POSISI SKILL & TATA LETAK KOLOM */}
                    <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
                        <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                          <Columns className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                            1. Tata Letak Kolom &amp; Posisi Keahlian (Skills)
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            Tentukan letak kolom Technical Arsenal &amp; Pendidikan terhadap riwayat pengalaman kerja
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Option 1: Skill di Kiri */}
                        {(() => {
                          const isSelected = (localData.layoutSettings?.layoutStyle || 'left-sidebar') === 'left-sidebar';
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdate((prev) => ({
                                  ...prev,
                                  layoutSettings: {
                                    fontSize: 'standard',
                                    spacing: 'standard',
                                    fontFamily: 'sans',
                                    themeColor: 'blue',
                                    ...(prev.layoutSettings || {}),
                                    layoutStyle: 'left-sidebar'
                                  }
                                }));
                              }}
                              className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-xs flex items-center gap-1.5">
                                  <span>Skill di Sisi Kiri</span>
                                </span>
                                {isSelected && (
                                  <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>

                              {/* Visual Mini Schematic */}
                              <div className="w-full h-12 bg-slate-950 rounded border border-slate-800 p-1 flex gap-1 items-stretch">
                                <div className="w-1/3 bg-indigo-900/80 rounded border border-indigo-500/60 flex flex-col items-center justify-center p-0.5">
                                  <span className="text-[7px] font-black text-indigo-200">SKILLS</span>
                                  <span className="text-[6px] text-indigo-300">&amp; EDU</span>
                                </div>
                                <div className="w-2/3 bg-slate-800/80 rounded border border-slate-700 flex flex-col justify-center px-1 gap-0.5">
                                  <span className="text-[7px] font-black text-slate-300">PENGALAMAN</span>
                                  <div className="h-1 bg-slate-600 rounded w-4/5" />
                                </div>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-snug">
                                Kolom kiri memuat Technical Arsenal &amp; Pendidikan. Kolom kanan memuat Pengalaman Kerja &amp; Core Methodology.
                              </p>
                            </button>
                          );
                        })()}

                        {/* Option 2: Skill di Kanan */}
                        {(() => {
                          const isSelected = localData.layoutSettings?.layoutStyle === 'right-sidebar';
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdate((prev) => ({
                                  ...prev,
                                  layoutSettings: {
                                    fontSize: 'standard',
                                    spacing: 'standard',
                                    fontFamily: 'sans',
                                    themeColor: 'blue',
                                    ...(prev.layoutSettings || {}),
                                    layoutStyle: 'right-sidebar'
                                  }
                                }));
                              }}
                              className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-xs flex items-center gap-1.5">
                                  <span>Skill di Sisi Kanan</span>
                                </span>
                                {isSelected && (
                                  <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>

                              {/* Visual Mini Schematic */}
                              <div className="w-full h-12 bg-slate-950 rounded border border-slate-800 p-1 flex gap-1 items-stretch">
                                <div className="w-2/3 bg-slate-800/80 rounded border border-slate-700 flex flex-col justify-center px-1 gap-0.5">
                                  <span className="text-[7px] font-black text-slate-300">PENGALAMAN</span>
                                  <div className="h-1 bg-slate-600 rounded w-4/5" />
                                </div>
                                <div className="w-1/3 bg-indigo-900/80 rounded border border-indigo-500/60 flex flex-col items-center justify-center p-0.5">
                                  <span className="text-[7px] font-black text-indigo-200">SKILLS</span>
                                  <span className="text-[6px] text-indigo-300">&amp; EDU</span>
                                </div>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-snug">
                                Kolom kiri memuat Pengalaman Kerja &amp; Core Methodology. Kolom kanan memuat Technical Arsenal &amp; Pendidikan.
                              </p>
                            </button>
                          );
                        })()}

                        {/* Option 3: 1 Kolom Penuh */}
                        {(() => {
                          const isSelected = localData.layoutSettings?.layoutStyle === 'single-column';
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdate((prev) => ({
                                  ...prev,
                                  layoutSettings: {
                                    fontSize: 'standard',
                                    spacing: 'standard',
                                    fontFamily: 'sans',
                                    themeColor: 'blue',
                                    ...(prev.layoutSettings || {}),
                                    layoutStyle: 'single-column'
                                  }
                                }));
                              }}
                              className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-xs flex items-center gap-1.5">
                                  <span>1 Kolom Penuh (Linear)</span>
                                </span>
                                {isSelected && (
                                  <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>

                              {/* Visual Mini Schematic */}
                              <div className="w-full h-12 bg-slate-950 rounded border border-slate-800 p-1 flex flex-col gap-1 items-stretch justify-center">
                                <div className="w-full bg-slate-800/80 rounded border border-slate-700 py-0.5 px-1">
                                  <span className="text-[7px] font-black text-slate-300">PENGALAMAN KERJA</span>
                                </div>
                                <div className="w-full bg-indigo-900/70 rounded border border-indigo-500/50 py-0.5 px-1">
                                  <span className="text-[7px] font-black text-indigo-200">SKILLS &amp; PENDIDIKAN</span>
                                </div>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-snug">
                                Seluruh seksi tersusun vertikal penuh memanjang dari atas ke bawah tanpa pembagian dua kolom.
                              </p>
                            </button>
                          );
                        })()}
                      </div>
                    </div>

                    {/* CARD 2: PERATAAN HEADER & TEKS */}
                    <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
                        <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                          <AlignLeft className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                            2. Perataan Header &amp; Teks Nama (Alignment)
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            Pilih orientasi posisi nama, profesi, dan kontak pada header dokumen CV
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'left', label: 'Rata Kiri', sublabel: 'Formal & Standar ATS', icon: AlignLeft },
                          { id: 'center', label: 'Rata Tengah', sublabel: 'Simetris & Elegan', icon: AlignCenter },
                          { id: 'right', label: 'Rata Kanan', sublabel: 'Modern & Asimetris', icon: AlignRight },
                          { id: 'justify', label: 'Rata Kanan-Kiri', sublabel: 'Nama di Kiri, Kontak di Kanan', icon: AlignJustify },
                        ].map(({ id, label, sublabel, icon: IconComponent }) => {
                          const isSelected = (localData.layoutSettings?.headerAlignment || 'left') === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                handleUpdate((prev) => ({
                                  ...prev,
                                  layoutSettings: {
                                    fontSize: 'standard',
                                    spacing: 'standard',
                                    layoutStyle: 'left-sidebar',
                                    fontFamily: 'sans',
                                    themeColor: 'blue',
                                    ...(prev.layoutSettings || {}),
                                    headerAlignment: id as any
                                  }
                                }));
                              }}
                              className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold">{label}</span>
                              <span className="text-[9.5px] text-slate-400 leading-tight">{sublabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CARD 3: POSISI FOTO PROFIL */}
                    <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
                        <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                            3. Posisi Foto Profil (Profile Picture Position)
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            Pilih penempatan foto profil di dokumen CV atau sembunyikan foto untuk format ATS-friendly
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'left', label: 'Di Sisi Kiri', sublabel: 'Di sebelah kiri nama', icon: User },
                          { id: 'right', label: 'Di Sisi Kanan', sublabel: 'Di sebelah kanan nama', icon: UserCheck },
                          { id: 'top', label: 'Di Atas Teks', sublabel: 'Di atas nama (elegan terpusat)', icon: ArrowUp },
                          { id: 'none', label: 'Tanpa Foto', sublabel: 'Sembunyikan (Format ATS)', icon: EyeOff },
                        ].map(({ id, label, sublabel, icon: IconComponent }) => {
                          const isSelected = (localData.layoutSettings?.headerPhotoPosition || 'left') === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                handleUpdate((prev) => ({
                                  ...prev,
                                  layoutSettings: {
                                    fontSize: 'standard',
                                    spacing: 'standard',
                                    layoutStyle: 'left-sidebar',
                                    fontFamily: 'sans',
                                    themeColor: 'blue',
                                    ...(prev.layoutSettings || {}),
                                    headerPhotoPosition: id as any
                                  }
                                }));
                              }}
                              className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold">{label}</span>
                              <span className="text-[9.5px] text-slate-400 leading-tight">{sublabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CARD 4: POSISI KONTAK HEADER */}
                    <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
                        <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                            4. Posisi Detail Kontak di Header
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            Atur posisi informasi kontak (lokasi, email, medsos) pada header CV
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            id: 'bottom',
                            label: 'Di Bawah Nama & Jabatan',
                            desc: 'Berbaris horizontal dipisahkan garis vertikal ( | ). Terlihat rapi dan terpusat.',
                          },
                          {
                            id: 'right',
                            label: 'Di Sisi Kanan (Stacked Vertikal)',
                            desc: 'Kolom vertikal rapat di sisi kanan header (khusus tata letak rata kiri/justify).',
                          },
                        ].map(({ id, label, desc }) => {
                          const isSelected = (localData.layoutSettings?.contactPosition || 'bottom') === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                handleUpdate((prev) => ({
                                  ...prev,
                                  layoutSettings: {
                                    fontSize: 'standard',
                                    spacing: 'standard',
                                    layoutStyle: 'left-sidebar',
                                    fontFamily: 'sans',
                                    themeColor: 'blue',
                                    ...(prev.layoutSettings || {}),
                                    contactPosition: id as any
                                  }
                                }));
                              }}
                              className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold">{label}</span>
                                {isSelected && (
                                  <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <p className="text-[10.5px] text-slate-400 leading-snug">{desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CARD 5: WARNA AKSEN & TIPOGRAFI CV */}
                    <div className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-4`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
                        <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                          <Palette className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                            5. Tema Warna Aksen &amp; Tipografi Dokumen CV
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            Kustomisasi warna garis aksen, skala font, dan kerapatan spasi halaman CV
                          </span>
                        </div>
                      </div>

                      {/* Warna Aksen */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-2">
                          Warna Garis Aksen &amp; Heading:
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {[
                            { id: 'blue', name: 'Royal Blue', color: 'bg-blue-600' },
                            { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
                            { id: 'slate', name: 'Slate Gray', color: 'bg-slate-600' },
                            { id: 'indigo', name: 'Deep Indigo', color: 'bg-indigo-600' },
                            { id: 'rose', name: 'Rose Red', color: 'bg-rose-600' },
                            { id: 'amber', name: 'Warm Amber', color: 'bg-amber-600' },
                          ].map(({ id, name, color }) => {
                            const isSelected = (localData.layoutSettings?.themeColor || 'blue') === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => {
                                  handleUpdate((prev) => ({
                                    ...prev,
                                    layoutSettings: {
                                      fontSize: 'standard',
                                      spacing: 'standard',
                                      layoutStyle: 'left-sidebar',
                                      fontFamily: 'sans',
                                      ...(prev.layoutSettings || {}),
                                      themeColor: id as any
                                    }
                                  }));
                                }}
                                className={`p-2 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-slate-800 border-indigo-400 ring-1 ring-indigo-400 text-white'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full ${color} shrink-0`} />
                                <span className="text-[11px] font-medium truncate">{name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skala Font & Kerapatan Spasi */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                            Skala Font:
                          </label>
                          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-700">
                            {[
                              { id: 'compact', label: 'Compact' },
                              { id: 'standard', label: 'Standard' },
                              { id: 'comfortable', label: 'Comfortable' },
                            ].map(({ id, label }) => {
                              const isSelected = (localData.layoutSettings?.fontSize || 'standard') === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => {
                                    handleUpdate((prev) => ({
                                      ...prev,
                                      layoutSettings: {
                                        spacing: 'standard',
                                        layoutStyle: 'left-sidebar',
                                        fontFamily: 'sans',
                                        themeColor: 'blue',
                                        ...(prev.layoutSettings || {}),
                                        fontSize: id as any
                                      }
                                    }));
                                  }}
                                  className={`flex-1 py-1 text-center rounded text-[11px] font-bold transition-all cursor-pointer ${
                                    isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                            Kerapatan Spasi Antar Seksi:
                          </label>
                          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-700">
                            {[
                              { id: 'tight', label: 'Padat (1 Hal)' },
                              { id: 'standard', label: 'Standard' },
                              { id: 'spacious', label: 'Renggang' },
                            ].map(({ id, label }) => {
                              const isSelected = (localData.layoutSettings?.spacing || 'standard') === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => {
                                    handleUpdate((prev) => ({
                                      ...prev,
                                      layoutSettings: {
                                        fontSize: 'standard',
                                        layoutStyle: 'left-sidebar',
                                        fontFamily: 'sans',
                                        themeColor: 'blue',
                                        ...(prev.layoutSettings || {}),
                                        spacing: id as any
                                      }
                                    }));
                                  }}
                                  className={`flex-1 py-1 text-center rounded text-[11px] font-bold transition-all cursor-pointer ${
                                    isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
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
            {(editorMode === 'id' || editorMode === 'en') && (
              <>
                {/* Collapsible Markdown Syntax Helper */}
                <div className={`mb-4 rounded-xl border transition-all ${isDark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'}`}>
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
                        {editLang === 'id' ? '📝 Format Markdown Didukung (Bold, Link, Heading, List, dll)' : '📝 Supported Markdown Syntax (Bold, Links, Headings, Lists, etc.)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <span>{showMarkdownGuide ? (editLang === 'id' ? 'Tutup' : 'Hide') : (editLang === 'id' ? 'Lihat Contoh' : 'Show Guide')}</span>
                      {showMarkdownGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {showMarkdownGuide && (
                    <div className={`px-3.5 pb-3.5 pt-1 text-[11px] space-y-2 border-t ${isDark ? 'border-indigo-500/20 text-slate-300' : 'border-indigo-100 text-slate-700'}`}>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {editLang === 'id' 
                          ? 'Anda dapat menulis teks bergaya kaya pada deskripsi Home, Poin Pengalaman Kerja, Detail Proyek, dan CV menggunakan sintaks berikut:' 
                          : 'You can write rich styled text across Home descriptions, Experience bullets, Project details, and CV using these syntax markers:'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10.5px]">
                        <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-emerald-400 font-bold block mb-0.5">**Teks Tebal (Bold)**</span>
                          <span className="text-slate-400">**Kata Kunci** → </span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>Kata Kunci</strong>
                        </div>
                        <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-teal-400 font-bold block mb-0.5">*Teks Miring (Italic)*</span>
                          <span className="text-slate-400">*Catatan Penting* → </span>
                          <em className={isDark ? 'text-white' : 'text-slate-900'}>Catatan Penting</em>
                        </div>
                        <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-blue-400 font-bold block mb-0.5">[Teks Link](https://...)</span>
                          <span className="text-slate-400">[Lihat Demo](https://...) → </span>
                          <span className="text-blue-500 underline font-sans">Lihat Demo ↗</span>
                        </div>
                        <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-amber-400 font-bold block mb-0.5">`Kode Singkat`</span>
                          <span className="text-slate-400">`npm install` → </span>
                          <code className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">npm install</code>
                        </div>
                        <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-purple-400 font-bold block mb-0.5"># Judul &amp; ## Sub-Judul</span>
                          <span className="text-slate-400"># Header Utama atau ## Sub Header</span>
                        </div>
                        <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-rose-400 font-bold block mb-0.5">- Poin Daftar (Lists)</span>
                          <span className="text-slate-400">- Item 1 \n- Item 2</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">
                        Judul Halaman ({editLang.toUpperCase()})
                      </label>
                      {renderAiButton(
                        'Judul Pendidikan',
                        getWebText('education_title', editLang),
                        (val) => handleWebTextChange('education_title', val, editLang),
                        'Judul seksi riwayat akademik/pendidikan'
                      )}
                    </div>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">
                        Intro / Pengantar ({editLang.toUpperCase()})
                      </label>
                      {renderAiButton(
                        'Intro Pendidikan',
                        getWebText('education_intro', editLang),
                        (val) => handleWebTextChange('education_intro', val, editLang),
                        'Paragraf pengantar tentang latar belakang akademik dan pondasi keilmuan'
                      )}
                    </div>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">Judul Halaman ({editLang.toUpperCase()})</label>
                      {renderAiButton(
                        'Judul Kepribadian',
                        getWebText('personality_title', editLang),
                        (val) => handleWebTextChange('personality_title', val, editLang),
                        'Judul header untuk halaman kepribadian, nilai kerja, dan pilar karakter profesional.'
                      )}
                    </div>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">Intro / Pengantar ({editLang.toUpperCase()})</label>
                      {renderAiButton(
                        'Intro Kepribadian',
                        getWebText('personality_intro', editLang),
                        (val) => handleWebTextChange('personality_intro', val, editLang),
                        'Deskripsi pembuka tentang karakter profesional, filosofi kerja, dan prinsip kerja sama tim.'
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={getWebText('personality_intro', editLang)}
                      onChange={(e) => handleWebTextChange('personality_intro', e.target.value, editLang)}
                      placeholder="Tuliskan filosofi personal atau intro karakter (mendukung markdown: **tebal**, *miring*, - list)..."
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
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Pilar Karakter & Nilai ({bilingualPersonality.length})
                    </h5>
                    <button
                      type="button"
                      onClick={handleAddPersonality}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Karakter</span>
                    </button>
                  </div>

                  {bilingualPersonality.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-3`}>
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/40">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-400 font-mono">#{idx + 1} Pilar Karakter</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{item?.title || 'Untitled'}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* AI Language Transfer Button */}
                            <button
                              type="button"
                              onClick={() =>
                                openSubpageTranslate(
                                  'personality',
                                  pair.baseId,
                                  'personality',
                                  {
                                    title: item?.title || '',
                                    description: item?.description || '',
                                  },
                                  {
                                    itemTypeName: 'Pilar Karakter',
                                    titleLabel: 'Nama Pilar Karakter',
                                    descriptionLabel: 'Deskripsi Karakter & Prinsip',
                                  }
                                )
                              }
                              title={`Transfer Bahasa AI: Terjemahkan Pilar Karakter #${idx + 1} (ID ↔ EN)`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-gradient-to-r from-blue-600/25 via-indigo-600/25 to-cyan-600/25 hover:from-blue-600/40 hover:to-indigo-600/40 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/60 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Languages className="w-3 h-3 text-cyan-400" />
                              <span>🌍 Transfer Bahasa ({editLang === 'id' ? 'ID → EN' : 'EN → ID'})</span>
                            </button>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => handleRemovePersonality(pair.baseId)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer transition-colors"
                              title="Hapus Pilar Karakter"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title field with AI Enhance */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">
                              Nama Karakter / Prinsip ({editLang.toUpperCase()})
                            </label>
                            {renderAiButton(
                              'Nama Pilar Karakter',
                              item?.title || '',
                              (val) => updateBilingualItem('personality', pair.baseId, editLang, 'title', val),
                              'Nama pilar karakter, etos kerja, atau sifat kepribadian profesional.'
                            )}
                          </div>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateBilingualItem('personality', pair.baseId, editLang, 'title', e.target.value)}
                            placeholder="Contoh: Analytical Thinker, Adaptable & Agile"
                            className={inputClass}
                          />
                        </div>

                        {/* Description field with AI Enhance */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">
                              Deskripsi Karakter ({editLang.toUpperCase()})
                            </label>
                            {renderAiButton(
                              'Deskripsi Pilar Karakter',
                              item?.description || '',
                              (val) => updateBilingualItem('personality', pair.baseId, editLang, 'description', val),
                              'Penjelasan mendalam tentang bagaimana karakter ini diterapkan dalam kolaborasi tim, kepemimpinan, atau pemecahan masalah.'
                            )}
                          </div>
                          <textarea
                            rows={3}
                            value={item?.description || ''}
                            onChange={(e) => updateBilingualItem('personality', pair.baseId, editLang, 'description', e.target.value)}
                            placeholder="Deskripsi karakter... (Mendukung Markdown: **tebal**, *miring*, ## Subjudul, - poin)"
                            className={textareaClass}
                          />
                        </div>
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
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>
                  {getSubpageSections('personality').map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-3`}>
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/40 text-[11px]">
                          <span className="font-bold text-teal-400 font-mono">#{idx + 1} Slide Cerita Kepribadian</span>
                          
                          <div className="flex items-center gap-1.5">
                            {/* AI Language Transfer Button */}
                            <button
                              type="button"
                              onClick={() =>
                                openSubpageTranslate(
                                  'educationSections',
                                  pair.baseId,
                                  'story_slide',
                                  {
                                    title: item?.title || '',
                                    description: item?.content || '',
                                  },
                                  {
                                    itemTypeName: 'Slide Cerita Kepribadian',
                                    titleLabel: 'Judul Slide',
                                    descriptionLabel: 'Konten Narasi Slide',
                                  }
                                )
                              }
                              title={`Transfer Bahasa AI: Terjemahkan Slide Cerita #${idx + 1} (ID ↔ EN)`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-gradient-to-r from-blue-600/25 via-indigo-600/25 to-cyan-600/25 hover:from-blue-600/40 hover:to-indigo-600/40 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/60 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Languages className="w-3 h-3 text-cyan-400" />
                              <span>🌍 Transfer ({editLang === 'id' ? 'ID → EN' : 'EN → ID'})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveSubpageSection(pair.baseId)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer transition-colors"
                              title="Hapus Slide Cerita"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">Judul Slide ({editLang.toUpperCase()})</label>
                            {renderAiButton(
                              'Judul Slide Cerita',
                              item?.title || '',
                              (val) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', val),
                              'Judul slide cerita kepribadian / refleksi nilai.'
                            )}
                          </div>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                            placeholder="Judul Slide Cerita"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">Konten Narasi ({editLang.toUpperCase()})</label>
                            {renderAiButton(
                              'Konten Slide Cerita',
                              item?.content || '',
                              (val) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', val),
                              'Narasi reflektif atau contoh nyata penerapan nilai dan kepribadian.'
                            )}
                          </div>
                          <textarea
                            rows={3}
                            value={item?.content || ''}
                            onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                            placeholder="Konten narasi... (Mendukung Markdown: **tebal**, *miring*, ## Subjudul, - poin)"
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">Judul Halaman ({editLang.toUpperCase()})</label>
                      {renderAiButton(
                        'Judul Hobi',
                        getWebText('hobbies_title', editLang),
                        (val) => handleWebTextChange('hobbies_title', val, editLang),
                        'Judul header untuk halaman hobi, minat kreatif, dan aktivitas di luar pekerjaan.'
                      )}
                    </div>
                    <input
                      type="text"
                      value={getWebText('hobbies_title', editLang)}
                      onChange={(e) => handleWebTextChange('hobbies_title', e.target.value, editLang)}
                      className={inputClass}
                    />
                    {renderColorControls('hobbies_title_color', 'hobbies_title_color_dark', 'Judul Hobi')}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">Intro ({editLang.toUpperCase()})</label>
                      {renderAiButton(
                        'Intro Hobi',
                        getWebText('hobbies_intro', editLang),
                        (val) => handleWebTextChange('hobbies_intro', val, editLang),
                        'Deskripsi pembuka tentang hobi, minat pribadi, dan bagaimana hal tersebut menginspirasi kreativitas.'
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={getWebText('hobbies_intro', editLang)}
                      onChange={(e) => handleWebTextChange('hobbies_intro', e.target.value, editLang)}
                      placeholder="Tuliskan intro seksi hobi... (mendukung markdown: **tebal**, *miring*, - list)"
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
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Daftar Hobi & Minat ({bilingualHobbies.length})
                    </h5>
                    <button
                      type="button"
                      onClick={handleAddHobby}
                      className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Hobi</span>
                    </button>
                  </div>

                  {bilingualHobbies.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-3`}>
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/40">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-rose-400 font-mono">#{idx + 1} Hobi</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{item?.title || 'Untitled'}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* AI Language Transfer Button */}
                            <button
                              type="button"
                              onClick={() =>
                                openSubpageTranslate(
                                  'hobbies',
                                  pair.baseId,
                                  'hobby',
                                  {
                                    title: item?.title || '',
                                    description: item?.description || '',
                                  },
                                  {
                                    itemTypeName: 'Hobi & Minat',
                                    titleLabel: 'Nama Hobi / Aktivitas',
                                    descriptionLabel: 'Deskripsi Hobi & Dampak Positif',
                                  }
                                )
                              }
                              title={`Transfer Bahasa AI: Terjemahkan Hobi #${idx + 1} (ID ↔ EN)`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-gradient-to-r from-blue-600/25 via-indigo-600/25 to-cyan-600/25 hover:from-blue-600/40 hover:to-indigo-600/40 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/60 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Languages className="w-3 h-3 text-cyan-400" />
                              <span>🌍 Transfer Bahasa ({editLang === 'id' ? 'ID → EN' : 'EN → ID'})</span>
                            </button>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveHobby(pair.baseId)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer transition-colors"
                              title="Hapus Hobi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title field with AI Enhance */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">
                              Nama Hobi ({editLang.toUpperCase()})
                            </label>
                            {renderAiButton(
                              'Nama Hobi',
                              item?.title || '',
                              (val) => updateBilingualItem('hobbies', pair.baseId, editLang, 'title', val),
                              'Nama kegiatan hobi, minat kreatif, atau olahraga.'
                            )}
                          </div>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateBilingualItem('hobbies', pair.baseId, editLang, 'title', e.target.value)}
                            placeholder="Contoh: Street Photography, Open-Source Contributing"
                            className={inputClass}
                          />
                        </div>

                        {/* Description field with AI Enhance */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">
                              Deskripsi Hobi ({editLang.toUpperCase()})
                            </label>
                            {renderAiButton(
                              'Deskripsi Hobi',
                              item?.description || '',
                              (val) => updateBilingualItem('hobbies', pair.baseId, editLang, 'description', val),
                              'Deskripsi mengapa Anda menyukai hobi ini, dampaknya bagi kreativitas, dan wawasan yang didapatkan.'
                            )}
                          </div>
                          <textarea
                            rows={3}
                            value={item?.description || ''}
                            onChange={(e) => updateBilingualItem('hobbies', pair.baseId, editLang, 'description', e.target.value)}
                            placeholder="Deskripsi hobi... (Mendukung Markdown: **tebal**, *miring*, ## Subjudul, - poin)"
                            className={textareaClass}
                          />
                        </div>
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
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>
                  {getSubpageSections('hobbies').map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-3`}>
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/40 text-[11px]">
                          <span className="font-bold text-teal-400 font-mono">#{idx + 1} Slide Cerita Hobi</span>
                          
                          <div className="flex items-center gap-1.5">
                            {/* AI Language Transfer Button */}
                            <button
                              type="button"
                              onClick={() =>
                                openSubpageTranslate(
                                  'educationSections',
                                  pair.baseId,
                                  'story_slide',
                                  {
                                    title: item?.title || '',
                                    description: item?.content || '',
                                  },
                                  {
                                    itemTypeName: 'Slide Cerita Hobi',
                                    titleLabel: 'Judul Slide Cerita',
                                    descriptionLabel: 'Konten Narasi Slide',
                                  }
                                )
                              }
                              title={`Transfer Bahasa AI: Terjemahkan Slide Cerita #${idx + 1} (ID ↔ EN)`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-gradient-to-r from-blue-600/25 via-indigo-600/25 to-cyan-600/25 hover:from-blue-600/40 hover:to-indigo-600/40 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/60 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Languages className="w-3 h-3 text-cyan-400" />
                              <span>🌍 Transfer ({editLang === 'id' ? 'ID → EN' : 'EN → ID'})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveSubpageSection(pair.baseId)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded cursor-pointer transition-colors"
                              title="Hapus Slide Cerita"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">Judul Slide ({editLang.toUpperCase()})</label>
                            {renderAiButton(
                              'Judul Slide Hobi',
                              item?.title || '',
                              (val) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', val),
                              'Judul slide cerita hobi dan karya sampingan.'
                            )}
                          </div>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'title', e.target.value)}
                            placeholder="Judul Slide"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-400">Konten Narasi ({editLang.toUpperCase()})</label>
                            {renderAiButton(
                              'Konten Slide Hobi',
                              item?.content || '',
                              (val) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', val),
                              'Narasi pengalaman, proses kreatif, atau kisah di balik hobi.'
                            )}
                          </div>
                          <textarea
                            rows={3}
                            value={item?.content || ''}
                            onChange={(e) => updateBilingualItem('educationSections', pair.baseId, editLang, 'content', e.target.value)}
                            placeholder="Konten narasi... (Mendukung Markdown: **tebal**, *miring*, ## Subjudul, - poin)"
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
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Riwayat Pengalaman ({bilingualExperiences.length})
                    </h5>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Pengalaman</span>
                    </button>
                  </div>
                  {bilingualExperiences.map((pair, idx) => {
                    const item = pair[editLang] || pair.en;
                    const bullets = item?.bulletPoints || [];
                    return (
                      <div key={pair.baseId} className={`p-3.5 rounded-xl border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-700/30">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-400 font-mono">#{idx + 1} Pengalaman</span>
                            <span className="font-mono text-[10px] text-slate-400">{item?.period}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveExperience(pair.baseId, 'up')}
                              title={idx === 0 ? 'Sudah di posisi teratas' : 'Pindah ke Atas'}
                              className={`p-1 rounded hover:bg-slate-700/50 transition-colors cursor-pointer ${
                                idx === 0 ? 'opacity-25 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-emerald-400'
                              }`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === bilingualExperiences.length - 1}
                              onClick={() => handleMoveExperience(pair.baseId, 'down')}
                              title={idx === bilingualExperiences.length - 1 ? 'Sudah di posisi terbawah' : 'Pindah ke Bawah'}
                              className={`p-1 rounded hover:bg-slate-700/50 transition-colors cursor-pointer ${
                                idx === bilingualExperiences.length - 1 ? 'opacity-25 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-emerald-400'
                              }`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicateExperience(pair.baseId)}
                              className="p-1 text-slate-400 hover:text-slate-200"
                              title="Duplikat Pengalaman"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(pair.baseId)}
                              className="p-1 text-rose-400 hover:text-rose-300"
                              title="Hapus Pengalaman"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Visibilitas Penampilan */}
                        <div className="flex flex-wrap items-center gap-4 py-1 px-2.5 rounded-lg bg-slate-900/40 border border-slate-700/30 text-[10px]">
                          <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Visibilitas:</span>
                          <label className="flex items-center gap-1.5 font-medium text-slate-300 hover:text-white transition-colors cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item?.showOnHome !== false && item?.showOnWeb !== false}
                              onChange={(e) => {
                                updateBilingualItem('experiences', pair.baseId, editLang, 'showOnHome', e.target.checked);
                                updateBilingualItem('experiences', pair.baseId, editLang, 'showOnWeb', e.target.checked);
                              }}
                              className="w-3 h-3 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                            />
                            <span>Tampilkan di Home / Web</span>
                          </label>
                          <label className="flex items-center gap-1.5 font-medium text-slate-300 hover:text-white transition-colors cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item?.showOnCV !== false}
                              onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'showOnCV', e.target.checked)}
                              className="w-3 h-3 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                            />
                            <span>Tampilkan di CV</span>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-slate-400">Posisi Pekerjaan ({editLang.toUpperCase()})</label>
                          {renderAiButton(
                            'Posisi Pekerjaan',
                            item?.role || '',
                            (val) => updateBilingualItem('experiences', pair.baseId, editLang, 'role', val),
                            'Nama posisi pekerjaan formal'
                          )}
                        </div>
                        <input
                          type="text"
                          value={item?.role || ''}
                          onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'role', e.target.value)}
                          placeholder="Posisi Pekerjaan"
                          className={inputClass}
                        />
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">Nama Perusahaan</label>
                          <input
                            type="text"
                            value={item?.company || ''}
                            onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'company', e.target.value)}
                            placeholder="Nama Perusahaan (Contoh: Global Tech Corp)"
                            className={inputClass}
                          />
                        </div>

                        {/* Pengaturan Tanggal & Periode Waktu */}
                        <ExperiencePeriodEditor
                          item={item}
                          pairBaseId={pair.baseId}
                          editLang={editLang}
                          onDateChange={handleUpdateExperienceDates}
                          onManualTextChange={handleManualExperiencePeriodChange}
                          inputClass={inputClass}
                        />

                        {/* Bullet Points in Subpage view */}
                        <div className="pt-2 border-t border-slate-700/20 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400">Poin Pencapaian ({bullets.length})</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openAiAssistant(
                                  `Poin Baru (${item?.role || 'Pengalaman Kerja'})`,
                                  '',
                                  (val) => {
                                    const updated = [...bullets, val];
                                    updateBilingualItem('experiences', pair.baseId, editLang, 'bulletPoints', updated);
                                  },
                                  editLang,
                                  `Buat 1 poin pencapaian profesional untuk posisi ${item?.role || ''} di ${item?.company || ''}. Format Action Verb + Hasil Terukur.`
                                )}
                                className="text-[9px] font-bold text-purple-300 hover:text-purple-200 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 cursor-pointer"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                                <span>AI Poin</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddBulletPoint(pair.baseId, editLang)}
                                className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer px-1 py-0.5"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>Tambah</span>
                              </button>
                            </div>
                          </div>
                          {bullets.map((point, pIdx) => (
                            <div key={pIdx} className="p-2 rounded-lg border border-slate-700/30 bg-slate-900/30 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-400">• Poin #{pIdx + 1}</span>
                                <div className="flex items-center gap-1">
                                  {renderAiButton(
                                    `Poin #${pIdx + 1} (${item?.role || 'Pengalaman'})`,
                                    point,
                                    (val) => handleUpdateBulletPoint(pair.baseId, editLang, pIdx, val),
                                    `Poles poin pencapaian ini untuk posisi ${item?.role || ''} di ${item?.company || ''}.`
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBulletPoint(pair.baseId, editLang, pIdx)}
                                    className="p-1 text-slate-500 hover:text-rose-400 shrink-0 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={point}
                                onChange={(e) => handleUpdateBulletPoint(pair.baseId, editLang, pIdx, e.target.value)}
                                placeholder={`Poin #${pIdx + 1}...`}
                                className={`${inputClass} text-[10px] py-1 w-full`}
                              />
                            </div>
                          ))}
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">Judul Section Projects / Halaman Proyek ({editLang.toUpperCase()})</label>
                      {renderAiButton(
                        'Judul Section Projects',
                        getWebText('projects_title', editLang),
                        (val) => handleWebTextChange('projects_title', val, editLang),
                        'Judul seksi portofolio proyek dan studi kasus pilihan'
                      )}
                    </div>
                    <input
                      type="text"
                      value={getWebText('projects_title', editLang)}
                      onChange={(e) => handleWebTextChange('projects_title', e.target.value, editLang)}
                      className={inputClass}
                    />
                    {renderColorControls('projects_title_color', 'projects_title_color_dark', 'Judul Projects')}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400">Subtitle / Deskripsi Section Projects ({editLang.toUpperCase()})</label>
                      {renderAiButton(
                        'Subtitle Section Projects',
                        getWebText('projects_subtitle', editLang),
                        (val) => handleWebTextChange('projects_subtitle', val, editLang),
                        'Deskripsi pengantar portofolio proyek dan solusi yang telah dibangun'
                      )}
                    </div>
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

                        {/* Project Images (Up to 3 images) */}
                        <div className="space-y-2 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                          <label className="block text-[11px] font-bold text-slate-300">
                            Foto / Gambar Proyek (Hingga 3 Gambar)
                          </label>

                          {/* Image 1: Main Banner */}
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">
                              Gambar 1 — Banner Utama & Kartu Home
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item?.image || ''}
                                placeholder="https://images.unsplash.com/... (Banner Utama)"
                                onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'image', e.target.value)}
                                className={`${inputClass} flex-1`}
                              />
                              {item?.image && (
                                <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 shrink-0 bg-slate-950">
                                  <img
                                    src={item.image}
                                    alt="Preview 1"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Image 2: Pop-Up Thumbnail 2 */}
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">
                              Gambar 2 — Thumbnail Tambahan Mode Pop-Up
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item?.image2 || ''}
                                placeholder="https://images.unsplash.com/... (Gambar 2)"
                                onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'image2', e.target.value)}
                                className={`${inputClass} flex-1`}
                              />
                              {item?.image2 && (
                                <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 shrink-0 bg-slate-950">
                                  <img
                                    src={item.image2}
                                    alt="Preview 2"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Image 3: Pop-Up Thumbnail 3 */}
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">
                              Gambar 3 — Thumbnail Tambahan Mode Pop-Up
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item?.image3 || ''}
                                placeholder="https://images.unsplash.com/... (Gambar 3)"
                                onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'image3', e.target.value)}
                                className={`${inputClass} flex-1`}
                              />
                              {item?.image3 && (
                                <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 shrink-0 bg-slate-950">
                                  <img
                                    src={item.image3}
                                    alt="Preview 3"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10px] font-bold text-slate-400">Judul Proyek ({editLang.toUpperCase()})</label>
                            {renderAiButton(
                              'Judul Proyek',
                              item?.title || '',
                              (val) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'title', val),
                              'Judul studi kasus atau proyek portfolio yang menarik perhatian recruiter'
                            )}
                          </div>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'title', e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10px] font-bold text-slate-400">
                              Deskripsi Singkat (Tampil di Home Card) ({editLang.toUpperCase()})
                            </label>
                            {renderAiButton(
                              'Deskripsi Singkat Proyek',
                              item?.shortDescription || '',
                              (val) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'shortDescription', val),
                              `Ringkasan proyek "${item?.title || ''}" dalam 1-2 kalimat padat untuk kartu preview.`
                            )}
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Ringkasan 1-2 baris untuk kartu halaman utama..."
                            value={item?.shortDescription || ''}
                            onChange={(e) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'shortDescription', e.target.value)}
                            className={textareaClass}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10px] font-bold text-slate-400">
                              Deskripsi Lengkap (Tampil di Pop-Up & All Projects) ({editLang.toUpperCase()})
                            </label>
                            {renderAiButton(
                              'Deskripsi Lengkap Proyek',
                              item?.description || '',
                              (val) => updateBilingualItem('caseStudies', pair.baseId, editLang, 'description', val),
                              `Narasi lengkap studi kasus "${item?.title || ''}". Uraikan problem yang diselesaikan, pendekatan analitik/teknis, dan impact bisnis yang dihasilkan.`
                            )}
                          </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">
                      Hero Badge ({editLang.toUpperCase()})
                    </label>
                    {renderAiButton(
                      'Hero Badge',
                      getWebText('hero_badge', editLang),
                      (val) => handleWebTextChange('hero_badge', val, editLang),
                      'Label kredensial singkat, misalnya: SENIOR DATA ANALYST | DECISION SCIENTIST'
                    )}
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">
                      Wilayah / Lokasi ({editLang.toUpperCase()})
                    </label>
                    {renderAiButton(
                      'Wilayah / Lokasi Hero',
                      getWebText('hero_location', editLang),
                      (val) => handleWebTextChange('hero_location', val, editLang),
                      'Lokasi profesional atau status kerja, contoh: Jakarta, Indonesia atau Remote / Hybrid'
                    )}
                  </div>
                  <input
                    type="text"
                    value={getWebText('hero_location', editLang)}
                    onChange={(e) => handleWebTextChange('hero_location', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('hero_location_color', 'hero_location_color_dark', 'Wilayah', '#64748b', '#94a3b8')}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">
                      Judul Halaman / Judul Utama Home ({editLang.toUpperCase()})
                    </label>
                    {renderAiButton(
                      'Judul Halaman / Hero',
                      getWebText('hero_title', editLang),
                      (val) => handleWebTextChange('hero_title', val, editLang),
                      'Headline hero yang kuat dan memikat recruiter dalam 3-6 kata (bisa multi-baris)'
                    )}
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">
                      Deskripsi Halaman / Subtitle Home ({editLang.toUpperCase()})
                    </label>
                    {renderAiButton(
                      'Deskripsi Halaman / Subtitle Hero',
                      getWebText('hero_subtitle', editLang),
                      (val) => handleWebTextChange('hero_subtitle', val, editLang),
                      'Paragraf hook pengantar yang menjelaskan value proposition, stack utama, dan keunggulan kompetitif'
                    )}
                  </div>
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
                  <button
                    type="button"
                    onClick={() => setShowMarkdownGuide(!showMarkdownGuide)}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showMarkdownGuide ? 'Tutup Format MD' : 'Panduan Format MD'}</span>
                  </button>
                </div>

                {/* Markdown Syntax Guide Box */}
                {showMarkdownGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5 text-xs text-slate-300 shadow-inner"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                        <span>📝 Format Teks Markdown Aktif</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Dukungan penuh di Pengantar &amp; 6 Pilar</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                      <div className="space-y-1">
                        <p><strong className="text-white">Tebal (Bold):</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">**teks tebal**</code></p>
                        <p><strong className="text-white">Miring (Italic):</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">*teks miring*</code></p>
                        <p><strong className="text-white">Tautan / Link:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">[Teks](https://...)</code></p>
                      </div>
                      <div className="space-y-1">
                        <p><strong className="text-white">Sub Judul:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">### Judul Bagian</code></p>
                        <p><strong className="text-white">Poin List:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">- Poin pertama</code></p>
                        <p><strong className="text-white">Kode / Tag:</strong> <code className="text-emerald-300 font-mono bg-slate-950 px-1 py-0.5 rounded">`highlight`</code></p>
                      </div>
                    </div>
                    <p className="text-[9.5px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                      💡 Tautan yang Anda buat akan otomatis membuka tab baru dengan aman dan tidak akan bentrok dengan kartu navigasi.
                    </p>
                  </motion.div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Judul Halaman Kisah ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Judul Halaman Kisah',
                      getWebText('about_story_title', editLang),
                      (val) => handleWebTextChange('about_story_title', val, editLang),
                      'Judul halaman narasi perjalanan pribadi dan profesional'
                    )}
                  </div>
                  <input
                    type="text"
                    value={getWebText('about_story_title', editLang)}
                    onChange={(e) => handleWebTextChange('about_story_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('about_story_title_color', 'about_story_title_color_dark', 'Judul Kisah')}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Paragraf Pengantar Utama ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Pengantar Kisah Story',
                      getWebText('about_story_intro', editLang),
                      (val) => handleWebTextChange('about_story_intro', val, editLang),
                      'Narasi storytelling tentang filosofi kerja, motivasi di dunia data/teknologi, dan prinsip integritas'
                    )}
                  </div>
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
                    {[
                      { num: 1, label: editLang === 'id' ? 'Pilar Kiri #1: Pendidikan' : 'Left Pillar #1: Educational Background', sub: '#/educational' },
                      { num: 2, label: editLang === 'id' ? 'Pilar Kiri #2: Kepribadian & Nilai' : 'Left Pillar #2: Personality & Values', sub: '#/personality' },
                      { num: 3, label: editLang === 'id' ? 'Pilar Kiri #3: Hobi & Minat' : 'Left Pillar #3: Hobbies & Interests', sub: '#/hobbies' },
                    ].map(({ num, label, sub }) => (
                      <div key={num} className={`p-3 rounded-lg border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-bold text-emerald-500">{label}</div>
                          <span className="text-[9px] text-slate-400 font-mono">{sub}</span>
                        </div>
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
                    {[
                      { num: 1, label: editLang === 'id' ? 'Pilar Kanan #1: Perjalanan Karir' : 'Right Pillar #1: Career Journey', sub: '#/career-journey' },
                      { num: 2, label: editLang === 'id' ? 'Pilar Kanan #2: Keahlian & Arsenal' : 'Right Pillar #2: Skills & Technical Arsenal', sub: '#/skills' },
                      { num: 3, label: editLang === 'id' ? 'Pilar Kanan #3: Studi Kasus & Proyek' : 'Right Pillar #3: Projects & Case Studies', sub: '#/projects' },
                    ].map(({ num, label, sub }) => (
                      <div key={num} className={`p-3 rounded-lg border ${cardBg} space-y-2`}>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-bold text-indigo-400">{label}</div>
                          <span className="text-[9px] text-slate-400 font-mono">{sub}</span>
                        </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Judul Section Skills ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Judul Section Skills',
                      getWebText('skills_title', editLang),
                      (val) => handleWebTextChange('skills_title', val, editLang),
                      'Judul seksi keahlian teknis, stack teknologi, dan competencies'
                    )}
                  </div>
                  <input
                    type="text"
                    value={getWebText('skills_title', editLang)}
                    onChange={(e) => handleWebTextChange('skills_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('skills_title_color', 'skills_title_color_dark', 'Judul Skills')}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Subtitle Section Skills ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Subtitle Section Skills',
                      getWebText('skills_subtitle', editLang),
                      (val) => handleWebTextChange('skills_subtitle', val, editLang),
                      'Deskripsi singkat penguasaan tools, bahasa pemrograman, dan metodologi kerja'
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={getWebText('skills_subtitle', editLang)}
                    onChange={(e) => handleWebTextChange('skills_subtitle', e.target.value, editLang)}
                    className={textareaClass}
                  />
                  {renderColorControls('skills_subtitle_color', 'skills_subtitle_color_dark', 'Subtitle Skills', '#475569', '#94a3b8')}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Deskripsi Ringkasan Kategori (Di bawah Emblem Lingkaran Home)</label>
                    {renderAiButton(
                      'Deskripsi Ringkasan Kategori Skills',
                      getWebText('skills_home_group_desc', editLang),
                      (val) => handleWebTextChange('skills_home_group_desc', val, editLang),
                      'Penjelasan singkat pengelompokan skill di halaman beranda'
                    )}
                  </div>
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
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Experiences Section ({editLang.toUpperCase()})</span>
                  </h4>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Judul Section Experience ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Judul Section Experience',
                      getWebText('experience_title', editLang),
                      (val) => handleWebTextChange('experience_title', val, editLang),
                      'Judul seksi pengalaman kerja profesional dan rekam jejak industri'
                    )}
                  </div>
                  <input
                    type="text"
                    value={getWebText('experience_title', editLang)}
                    onChange={(e) => handleWebTextChange('experience_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('experience_title_color', 'experience_title_color_dark', 'Judul Experience')}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Subtitle Section Experience ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Subtitle Section Experience',
                      getWebText('experience_subtitle', editLang),
                      (val) => handleWebTextChange('experience_subtitle', val, editLang),
                      'Deskripsi singkat pengantar rekam jejak karir dan pencapaian profesional'
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={getWebText('experience_subtitle', editLang)}
                    onChange={(e) => handleWebTextChange('experience_subtitle', e.target.value, editLang)}
                    className={textareaClass}
                  />
                  {renderColorControls('experience_subtitle_color', 'experience_subtitle_color_dark', 'Subtitle Experience', '#475569', '#94a3b8')}
                </div>

                {/* Daftar Pengalaman Kerja & Poin-poin */}
                <div className="pt-2 border-t border-slate-700/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Daftar Pengalaman Kerja ({bilingualExperiences.length})</span>
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Kelola posisi, perusahaan, periode, tools, dan rincian poin-poin pencapaian kerja.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Pengalaman</span>
                    </button>
                  </div>

                  {bilingualExperiences.length === 0 ? (
                    <div className={`p-6 rounded-xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Briefcase className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold text-slate-300">Belum Ada Riwayat Pengalaman Kerja</p>
                      <p className="text-[11px] text-slate-500 mt-1 mb-3">Klik tombol di bawah untuk menambahkan pengalaman kerja pertama Anda.</p>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Pengalaman Sekarang</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bilingualExperiences.map((pair, idx) => {
                        const item = pair[editLang] || pair.en;
                        const bullets = item?.bulletPoints || [];
                        const tools = item?.tools || [];

                        return (
                          <div
                            key={pair.baseId}
                            className={`p-4 rounded-xl border ${cardBg} space-y-3.5 transition-all shadow-sm`}
                          >
                            {/* Header Item */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="font-bold text-xs text-slate-200">
                                    {item?.role || 'Posisi Pekerjaan'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block font-mono">
                                    {item?.company || 'Perusahaan'} • {item?.period || 'Periode'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveExperience(pair.baseId, 'up')}
                                  title={idx === 0 ? 'Sudah berada di posisi paling atas' : 'Pindah ke Atas (Urutkan Lebih Awal)'}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    idx === 0
                                      ? 'opacity-25 cursor-not-allowed text-slate-500'
                                      : 'hover:bg-slate-700/50 text-slate-400 hover:text-emerald-400'
                                  }`}
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === bilingualExperiences.length - 1}
                                  onClick={() => handleMoveExperience(pair.baseId, 'down')}
                                  title={idx === bilingualExperiences.length - 1 ? 'Sudah berada di posisi paling bawah' : 'Pindah ke Bawah (Urutkan Lebih Akhir)'}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    idx === bilingualExperiences.length - 1
                                      ? 'opacity-25 cursor-not-allowed text-slate-500'
                                      : 'hover:bg-slate-700/50 text-slate-400 hover:text-emerald-400'
                                  }`}
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpTranslateModalState({
                                      isOpen: true,
                                      experienceBaseId: pair.baseId,
                                      sourceLang: editLang,
                                      sourceData: {
                                        role: item?.role || '',
                                        company: item?.company || '',
                                        period: item?.period || '',
                                        bulletPoints: bullets,
                                      },
                                    });
                                  }}
                                  title={`Transfer & terjemahkan item pekerjaan ini ke bahasa ${editLang === 'id' ? 'Inggris (EN)' : 'Indonesia (ID)'} via AI`}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 hover:text-white border border-purple-500/30 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                >
                                  <Languages className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Transfer ke {editLang === 'id' ? 'EN' : 'ID'} (AI)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateExperience(pair.baseId)}
                                  title="Duplikat Pengalaman"
                                  className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExperience(pair.baseId)}
                                  title="Hapus Pengalaman"
                                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Visibilitas Penampilan */}
                            <div className="flex flex-wrap items-center gap-4 p-2.5 rounded-lg bg-slate-900/40 border border-slate-700/30">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visibilitas:</span>
                              <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={item?.showOnHome !== false && item?.showOnWeb !== false}
                                  onChange={(e) => {
                                    updateBilingualItem('experiences', pair.baseId, editLang, 'showOnHome', e.target.checked);
                                    updateBilingualItem('experiences', pair.baseId, editLang, 'showOnWeb', e.target.checked);
                                  }}
                                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                                />
                                <span>Tampilkan di Home / Web</span>
                              </label>
                              <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={item?.showOnCV !== false}
                                  onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'showOnCV', e.target.checked)}
                                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                                />
                                <span>Tampilkan di CV</span>
                              </label>
                            </div>

                            {/* Form Input Utama */}
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                  Posisi / Job Role ({editLang.toUpperCase()})
                                </label>
                                <input
                                  type="text"
                                  value={item?.role || ''}
                                  onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'role', e.target.value)}
                                  placeholder="Contoh: Senior Data Engineer"
                                  className={inputClass}
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                  Nama Perusahaan
                                </label>
                                <input
                                  type="text"
                                  value={item?.company || ''}
                                  onChange={(e) => updateBilingualItem('experiences', pair.baseId, editLang, 'company', e.target.value)}
                                  placeholder="Contoh: PT Teknologi Bangsa"
                                  className={inputClass}
                                />
                              </div>

                              {/* Pengaturan Tanggal & Periode Waktu */}
                              <ExperiencePeriodEditor
                                item={item}
                                pairBaseId={pair.baseId}
                                editLang={editLang}
                                onDateChange={handleUpdateExperienceDates}
                                onManualTextChange={handleManualExperiencePeriodChange}
                                inputClass={inputClass}
                              />

                              {/* Tools / Tags */}
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                  Tools / Tech Stack (Dipisahkan Koma)
                                </label>
                                <input
                                  type="text"
                                  value={tools.join(', ')}
                                  onChange={(e) => {
                                    const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                    updateBilingualItem('experiences', pair.baseId, editLang, 'tools', parsed);
                                  }}
                                  placeholder="Python, SQL, Apache Kafka, BigQuery"
                                  className={inputClass}
                                />
                              </div>
                            </div>

                            {/* POIN-POIN PENGALAMAN (BULLET POINTS) - MODEL TUNGGAL AI PER PEKERJAAN */}
                            <div className="pt-2 border-t border-slate-700/20 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                                  <span>Poin-Poin Pencapaian & Tanggung Jawab ({bullets.length})</span>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 uppercase">
                                    {editLang.toUpperCase()}
                                  </span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setJobAiModalState({
                                        isOpen: true,
                                        experienceBaseId: pair.baseId,
                                        role: item?.role || '',
                                        company: item?.company || '',
                                        existingBullets: bullets,
                                      })
                                    }
                                    className="text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 flex items-center gap-1.5 py-1 px-2.5 rounded-lg shadow-sm border border-purple-400/30 transition-all cursor-pointer"
                                    title="Jelaskan pekerjaan Anda dan AI akan merumuskan poin-poin pencapaian dengan variasi rekomendasi"
                                  >
                                    <Sparkles className="w-3 h-3 text-amber-300" />
                                    <span>✨ AI Rumuskan Poin Pekerjaan</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAddBulletPoint(pair.baseId, editLang)}
                                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 py-1 px-2 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Tambah Manual</span>
                                  </button>
                                </div>
                              </div>

                              {bullets.length === 0 ? (
                                <p className="text-[11px] text-slate-500 italic py-1">
                                  Belum ada rincian poin. Klik "✨ AI Rumuskan Poin Pekerjaan" untuk menceritakan tugas Anda, atau klik "+ Tambah Manual".
                                </p>
                              ) : (
                                <div className="space-y-3">
                                  {bullets.map((point, pIdx) => (
                                    <div key={pIdx} className="p-2.5 rounded-lg border border-slate-700/40 bg-slate-900/30 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                                          <span className="text-emerald-400">•</span> Poin #{pIdx + 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveBulletPoint(pair.baseId, editLang, pIdx)}
                                          title="Hapus Poin Ini"
                                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <textarea
                                        rows={2}
                                        value={point}
                                        onChange={(e) => handleUpdateBulletPoint(pair.baseId, editLang, pIdx, e.target.value)}
                                        placeholder={`Poin pencapaian #${pIdx + 1}...`}
                                        className={`${textareaClass} text-[11px] leading-relaxed w-full`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Judul Section Contact ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Judul Section Contact',
                      getWebText('contact_title', editLang),
                      (val) => handleWebTextChange('contact_title', val, editLang),
                      'Judul ajakan untuk berkolaborasi atau menghubungi Anda'
                    )}
                  </div>
                  <input
                    type="text"
                    value={getWebText('contact_title', editLang)}
                    onChange={(e) => handleWebTextChange('contact_title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('contact_title_color', 'contact_title_color_dark', 'Judul Contact')}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Subtitle Section Contact ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Subtitle Section Contact',
                      getWebText('contact_subtitle', editLang),
                      (val) => handleWebTextChange('contact_subtitle', val, editLang),
                      'Kalimat undangan ramah dan terbuka untuk diskusi peluang kerja atau proyek'
                    )}
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Job Title / Posisi ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Job Title / Posisi',
                      getWebText('title', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).title : localData.title),
                      (val) => handleWebTextChange('title', val, editLang),
                      'Fokuskan pada spesialisasi data analytics, AI, atau software engineering'
                    )}
                  </div>
                  <input
                    type="text"
                    value={getWebText('title', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).title : localData.title)}
                    onChange={(e) => handleWebTextChange('title', e.target.value, editLang)}
                    className={inputClass}
                  />
                  {renderColorControls('title_color', 'title_color_dark', 'Warna Posisi/Job Title', '#059669', '#34d399')}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Ringkasan Professional / About Me ({editLang.toUpperCase()})</label>
                    {renderAiButton(
                      'Ringkasan Professional / About Me',
                      getWebText('aboutMe', editLang) || (editLang === 'id' ? (ID_TRANSLATIONS as any).aboutMe : localData.aboutMe || ''),
                      (val) => handleWebTextChange('aboutMe', val, editLang),
                      'Ringkasan eksekutif 2-3 kalimat yang menonjolkan keahlian data, pemecahan masalah bisnis, dan nilai tambah'
                    )}
                  </div>
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

      {/* Generic Subpage Item AI Language Transfer Modal (Personality, Hobbies, Story Slides, etc.) */}
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
            title: editLang === 'id'
              ? (localData.webTexts?.[`methodologyTitle_id`] || (localData.webTexts?.methodologyTitle && editLang === 'id' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || (ID_TRANSLATIONS as any).methodologyTitle || 'Metodologi Utama')
              : (localData.webTexts?.[`methodologyTitle_en`] || (localData.webTexts?.methodologyTitle && editLang === 'en' ? localData.webTexts.methodologyTitle : '') || localData.methodologyTitle || 'Core Methodology'),
            description: editLang === 'id'
              ? (localData.webTexts?.[`methodologyText_id`] || (localData.webTexts?.methodologyText && editLang === 'id' ? localData.webTexts.methodologyText : '') || localData.methodologyText || (ID_TRANSLATIONS as any).methodologyText || '')
              : (localData.webTexts?.[`methodologyText_en`] || (localData.webTexts?.methodologyText && editLang === 'en' ? localData.webTexts.methodologyText : '') || localData.methodologyText || '')
          }}
          isDark={theme === 'dark'}
          labels={{
            itemTypeName: 'Core Methodology',
            titleLabel: 'Judul Seksi Metodologi',
            descriptionLabel: 'Deskripsi & Filosofi Metodologi'
          }}
          onApply={handleApplyMethodologyTranslation}
        />
      )}
    </AnimatePresence>
  );
};
