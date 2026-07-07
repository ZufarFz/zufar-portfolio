import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Lock, 
  Unlock, 
  Check, 
  AlertCircle,
  Database,
  Briefcase,
  GraduationCap,
  Sparkles,
  User,
  Activity,
  Code,
  LayoutGrid,
  FileText,
  TrendingUp,
  Terminal,
  Grid,
  ChevronRight,
  LogOut,
  Sparkle,
  Image,
  Globe,
  Award,
  Layers,
  Sun,
  Moon,
  Palette,
  Layout,
  ArrowUp,
  ArrowDown,
  Info,
  CheckSquare,
  Share2,
  PlusCircle,
  Sliders,
  ChevronLeft,
  Eye,
  Menu,
  Heart,
  Compass,
  Target
} from 'lucide-react';
import { CVData, saveCVData, isSupabaseConfigured, supabase, uploadFileToStorage } from '../lib/supabaseClient';
import PPTSlideEditor from './PPTSlideEditor';
import ResumeModal from './ResumeModal';
import { CaseStudy, SkillItem, SkillCategory } from '../types';
import SocialIcon from './SocialIcon';
import InteractiveIDCard from './InteractiveIDCard';

const AVAILABLE_PLATFORMS = [
  "BeReal", "Bluesky", "Clubhouse", "Discord", "Email", "Facebook", "GitHub", "IMO", 
  "Instagram", "KakaoTalk", "Kuaishou", "Lemon8", "Likee", "LINE", "LinkedIn", "Mastodon", 
  "Nextdoor", "Pinterest", "QQ", "Quora", "Reddit", "Signal", "Sina Weibo", "Skype", "Slack", 
  "Snapchat", "Teams", "Threads", "TikTok", "Triller", "Tumblr", "Twitch", "Viber", "WeChat", 
  "WhatsApp", "X", "YouTube", "YouNow", "Zoom"
].sort();

function migrateLegacySocials(base: CVData): CVData {
  const data = { ...base };
  const customList = [...(data.customSocials || [])];
  
  const standards = [
    { key: 'linkedin' as const, name: 'LinkedIn' },
    { key: 'instagram' as const, name: 'Instagram' },
    { key: 'whatsapp' as const, name: 'WhatsApp' },
    { key: 'github' as const, name: 'GitHub' }
  ];

  let migrated = false;

  standards.forEach(({ key, name }) => {
    const val = data[key];
    if (val && typeof val === 'string' && val.trim() !== '') {
      const exists = customList.some(item => item.name?.toLowerCase().trim() === name.toLowerCase());
      if (!exists) {
        customList.push({
          id: `social-${key}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name,
          value: val,
          showOnWeb: true,
          showOnCvHeader: data.headerContacts?.includes(key) ?? false,
          showOnCvFooter: data.footerSocials?.includes(key) ?? true,
        });
        migrated = true;
      }
    }
  });

  // Normalize headerContacts and footerSocials to use modern customSocials IDs for standard accounts
  if (data.headerContacts) {
    data.headerContacts = data.headerContacts.map(id => {
      if (['linkedin', 'instagram', 'whatsapp', 'github'].includes(id)) {
        const match = customList.find(item => item.name?.toLowerCase().trim() === id.toLowerCase().trim());
        if (match) {
          return match.id;
        }
      }
      return id;
    });
  }

  if (data.footerSocials) {
    data.footerSocials = data.footerSocials.map(id => {
      if (['linkedin', 'instagram', 'whatsapp', 'github'].includes(id)) {
        const match = customList.find(item => item.name?.toLowerCase().trim() === id.toLowerCase().trim());
        if (match) {
          return match.id;
        }
      }
      return id;
    });
  }

  data.customSocials = customList;
  return data;
}

interface AdminPageProps {
  cvData: CVData;
  onUpdate: (updatedData: CVData) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function AdminPage({ cvData, onUpdate, onClose, theme, setTheme }: AdminPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Local state for full database editing
  const [localCV, setLocalCV] = useState<CVData>(() => migrateLegacySocials(cvData));
  const [activeTab, setActiveTab] = useState<'profile' | 'about_story' | 'about_pages' | 'personality' | 'hobbies' | 'career_goals' | 'web_texts' | 'skills' | 'projects' | 'experience' | 'education' | 'technical' | 'methodology' | 'layout' | 'socials' | 'db_setup' | 'preview'>('profile');
  const [selectedAboutPage, setSelectedAboutPage] = useState<'education' | 'personality' | 'hobbies' | 'career-journey' | 'skills' | 'career-goals'>('education');
  const [previewThemeMode, setPreviewThemeMode] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSaving, setIsSaving] = useState(false);

  // State for active editable part of the ID Card in static admin mode
  const [activeIDCardPart, setActiveIDCardPart] = useState<'portrait' | 'name' | 'title' | 'badge' | 'watermark' | 'svg' | 'general' | null>(null);

  const handleIDCardPartClick = (part: 'portrait' | 'name' | 'title' | 'badge' | 'watermark' | 'svg' | 'general') => {
    setActiveIDCardPart(part);
    let targetId = '';
    switch (part) {
      case 'badge':
        targetId = 'admin-idcard-group';
        break;
      case 'portrait':
        targetId = 'admin-portrait-scale-slider';
        break;
      case 'name':
        targetId = 'admin-fullname-input';
        break;
      case 'title':
        targetId = 'admin-title-input';
        break;
      case 'watermark':
        targetId = 'admin-idcard-watermark';
        break;
      case 'svg':
        targetId = 'admin-idcard-svg-scale-slider';
        break;
      case 'general':
      default:
        targetId = 'admin-idcard-config-header';
        break;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetElement.focus?.();
      
      // Temporary glowing ring animation to visually guide the user
      targetElement.classList.add('ring-4', 'ring-emerald-500/50', 'transition-all', 'duration-300');
      setTimeout(() => {
        targetElement.classList.remove('ring-4', 'ring-emerald-500/50');
      }, 1500);
    }
  };

  // State for dragging images to adjust position manually
  const [imgDrag, setImgDrag] = useState<{
    type: 'avatar' | 'homeImage';
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    scale: number;
  } | null>(null);

  const handleImgPointerDown = (e: React.PointerEvent<HTMLDivElement>, type: 'avatar' | 'homeImage') => {
    if (e.button !== 0) return; // Only allow left-click / main touch pointer
    
    e.currentTarget.setPointerCapture(e.pointerId);
    const scale = type === 'avatar' ? (localCV.avatarScale || 1) : (localCV.homeImageScale || 1);
    const initialX = type === 'avatar' ? (localCV.avatarX || 0) : (localCV.homeImageX || 0);
    const initialY = type === 'avatar' ? (localCV.avatarY || 0) : (localCV.homeImageY || 0);

    setImgDrag({
      type,
      startX: e.clientX,
      startY: e.clientY,
      initialX,
      initialY,
      scale
    });
  };

  const handleImgPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imgDrag) return;
    const { type, startX, startY, initialX, initialY, scale } = imgDrag;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // Divide delta by scale since scale operates outside translation
    const newX = Math.round(initialX + deltaX / scale);
    const newY = Math.round(initialY + deltaY / scale);
    
    // Bounds limit matching typical limits (-500 to 500 or slightly larger to allow flexible crop)
    const clampedX = Math.max(-1000, Math.min(1000, newX));
    const clampedY = Math.max(-1000, Math.min(1000, newY));
    
    setLocalCV(prev => {
      if (type === 'avatar') {
        return {
          ...prev,
          avatarX: clampedX,
          avatarY: clampedY
        };
      } else {
        return {
          ...prev,
          homeImageX: clampedX,
          homeImageY: clampedY
        };
      }
    });
  };

  const handleImgPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imgDrag) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
    setImgDrag(null);
  };

  const isDark = theme === 'dark';
  const textTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const textLabelColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputBgBorder = isDark 
    ? 'bg-slate-950 border-slate-800 text-slate-100 hover:border-slate-700' 
    : 'bg-slate-50 border-slate-205 text-slate-900 hover:bg-slate-100 focus:bg-white';
  const selectBgBorder = isDark 
    ? 'bg-slate-900 border-slate-800 text-slate-150' 
    : 'bg-slate-50 border-slate-205 text-slate-800 focus:bg-white';
  const containerBgBorder = isDark 
    ? 'bg-slate-950/60 border-slate-800 text-slate-100' 
    : 'bg-white border-slate-200 text-slate-800 shadow-sm';
  const dividerColor = isDark ? 'border-slate-800' : 'border-slate-200';

  // Check Supabase session
  useEffect(() => {
    async function checkSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error('Error validating active session:', e);
        }
      }
    }
    checkSession();
  }, []);

  // Sync state if base data changes
  useEffect(() => {
    setLocalCV(migrateLegacySocials(cvData));
  }, [cvData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase tidak terkonfigurasi. Silakan isi kredensial VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Secrets.');
      setIsLoggingIn(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data?.user) {
        setIsAuthenticated(true);
        setAuthError('');
        // Alert and close AdminPage, redirecting user to the main live Web page
        alert("✓ Login Berhasil! Anda terautentikasi secara aman. Anda diarahkan langsung ke halaman website...");
        onClose();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Terjadi kegagalan autentikasi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    // Synchronize legacy fields with values inside customSocials
    const currentSocials = localCV.customSocials || [];
    const linkedinItem = currentSocials.find(s => s.name?.toLowerCase().trim() === 'linkedin');
    const instagramItem = currentSocials.find(s => s.name?.toLowerCase().trim() === 'instagram');
    const whatsappItem = currentSocials.find(s => s.name?.toLowerCase().trim() === 'whatsapp');
    const githubItem = currentSocials.find(s => s.name?.toLowerCase().trim() === 'github');

    const syncedCV = {
      ...localCV,
      linkedin: linkedinItem ? linkedinItem.value : '',
      instagram: instagramItem ? instagramItem.value : '',
      whatsapp: whatsappItem ? whatsappItem.value : '',
      github: githubItem ? githubItem.value : ''
    };

    try {
      const response = await saveCVData(syncedCV);
      if (response.success) {
        onUpdate(syncedCV);
        setLocalCV(syncedCV);
        setSaveStatus({
          type: 'success',
          message: isSupabaseConfigured 
            ? 'Sinkronisasi berhasil! Seluruh data portfolio telah disimpan secara permanen di cloud Supabase.'
            : 'Perubahan disimpan di browser lokal (LocalStorage). Atur akun Supabase Anda untuk perlindungan cloud.'
        });
      } else {
        setSaveStatus({
          type: 'error',
          message: response.error || 'Terjadi kesalahan sistem saat sinkronisasi.'
        });
      }
    } catch (err: any) {
      setSaveStatus({
        type: 'error',
        message: err.message || 'Gagal mengirimkan query update.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper field modifiers
  const updateGeneralField = (field: keyof CVData, val: any) => {
    setLocalCV(prev => ({ ...prev, [field]: val }));
  };

  const handleUpdateIDCardCoordinates = (updates: {
    imageX?: number;
    imageY?: number;
    idCardSvgX?: number;
    idCardSvgY?: number;
    idCardTextX?: number;
    idCardTextY?: number;
    idCardBadgeX?: number;
    idCardBadgeY?: number;
  }) => {
    setLocalCV(prev => {
      const next = { ...prev };
      if (updates.imageX !== undefined) next.aboutStoryImageX = updates.imageX;
      if (updates.imageY !== undefined) next.aboutStoryImageY = updates.imageY;
      if (updates.idCardSvgX !== undefined) next.idCardSvgX = updates.idCardSvgX;
      if (updates.idCardSvgY !== undefined) next.idCardSvgY = updates.idCardSvgY;
      if (updates.idCardTextX !== undefined) next.idCardTextX = updates.idCardTextX;
      if (updates.idCardTextY !== undefined) next.idCardTextY = updates.idCardTextY;
      if (updates.idCardBadgeX !== undefined) next.idCardBadgeX = updates.idCardBadgeX;
      if (updates.idCardBadgeY !== undefined) next.idCardBadgeY = updates.idCardBadgeY;
      return next;
    });
  };

  const handleUpdateSvgItemCoordinates = (id: string, x: number, y: number) => {
    setLocalCV(prev => {
      const updatedSvgs = (prev.idCardSvgs || []).map(item => {
        if (item.id === id) {
          return { ...item, x, y };
        }
        return item;
      });
      return { ...prev, idCardSvgs: updatedSvgs };
    });
  };

  const handleAddSvgItem = () => {
    setLocalCV(prev => {
      const current = prev.idCardSvgs || [];
      const nextId = `svg-${Date.now()}`;
      const nextZIndex = current.length > 0 ? Math.max(...current.map(s => s.zIndex || 0)) + 10 : 10;
      const newItem = {
        id: nextId,
        name: `Lapisan SVG ${current.length + 1}`,
        svgContent: `<svg xmlns="http://www.w3.org/2005/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="40" fill="#10b981"/></svg>`,
        scale: 1,
        x: 0,
        y: 0,
        zIndex: nextZIndex
      };
      return {
        ...prev,
        idCardSvgs: [...current, newItem]
      };
    });
  };

  const handleRemoveSvgItem = (id: string) => {
    setLocalCV(prev => {
      const current = prev.idCardSvgs || [];
      return {
        ...prev,
        idCardSvgs: current.filter(s => s.id !== id)
      };
    });
    if (activeIDCardPart === `svg-item-${id}`) {
      setActiveIDCardPart(null);
    }
  };

  const handleUpdateSvgItemProperty = (id: string, property: string, value: any) => {
    setLocalCV(prev => {
      const current = prev.idCardSvgs || [];
      return {
        ...prev,
        idCardSvgs: current.map(s => s.id === id ? { ...s, [property]: value } : s)
      };
    });
  };

  const updateTechnicalField = (subField: keyof CVData['technicalArsenal'], val: string) => {
    setLocalCV(prev => ({
      ...prev,
      technicalArsenal: {
        ...prev.technicalArsenal,
        [subField]: val
      }
    }));
  };

  // 1. SKILLS BADGES MUTATORS
  const handleAddSkillIdx = () => {
    const list = localCV.skills || [];
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: 'Keterampilan Baru',
      icon: 'Database',
      category: 'core',
      description: 'Deskripsi singkat mengenai kegunaan skill ini.'
    };
    updateGeneralField('skills', [...list, newSkill]);
  };

  const handleRemoveSkillIdx = (id: string) => {
    const list = localCV.skills || [];
    updateGeneralField('skills', list.filter(s => s.id !== id));
  };

  const handleUpdateSkillIdx = (id: string, field: keyof SkillItem, val: any) => {
    const list = localCV.skills || [];
    updateGeneralField('skills', list.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  // 1b. SKILL CATEGORIES MUTATORS
  const handleAddCategory = () => {
    const list = localCV.skillCategories || [];
    const newCat = {
      id: `cat-${Date.now()}`,
      label: 'Kategori Skill Baru',
      sortOrder: list.length + 1
    };
    updateGeneralField('skillCategories', [...list, newCat]);
  };

  const handleRemoveCategory = (id: string) => {
    const list = localCV.skillCategories || [];
    updateGeneralField('skillCategories', list.filter(c => c.id !== id));
  };

  const handleUpdateCategory = (id: string, field: 'label' | 'id' | 'sortOrder', val: any) => {
    const list = localCV.skillCategories || [];
    updateGeneralField('skillCategories', list.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  // 2. CASE STUDIES PROJECT MUTATORS
  const handleAddProject = () => {
    const list = localCV.caseStudies || [];
    const newProj: CaseStudy = {
      id: `proj-${Date.now()}`,
      title: 'Judul Studi Kasus Baru',
      category: 'Kategori Analisis',
      description: 'Jelaskan bagaimana Anda membersihkan dataset, menyusun query SQL, dan mengoptimalisasi sistem.',
      tags: ['SQL', 'Python'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4at_MfB3KVhLLsSAvR5O74aQ77QDJm5dapXWTiarjOduQPHE1pBfcrbGjeCW7o9usfS9TX8d-Gin7Kp0dJ0WTbNDL_ZwHe_JHbcmlZw3c_EWFbdd415cMyJy6qotSUSzinHUaJ-eINpz4Gh5Pk4Rz-_Qd3bmOcuA-_hPnMZvnayUVcsWZt7S_6mV71rvlkCXIdcCNenlUaSbFdmLog6E26dnCv-_hqCx5PcV-Klbi-t7cgynNu6p_Hz2Yt_F0IKOaCPVGlRmEI4Y',
      impactMetric: 'Optimalisasi +20%',
      tools: ['SQL', 'Python']
    };
    updateGeneralField('caseStudies', [...list, newProj]);
  };

  const handleRemoveProject = (id: string) => {
    const list = localCV.caseStudies || [];
    updateGeneralField('caseStudies', list.filter(p => p.id !== id));
  };

  const handleUpdateProjectField = (id: string, field: keyof CaseStudy, val: any) => {
    const list = localCV.caseStudies || [];
    updateGeneralField('caseStudies', list.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  // 3. EDUCATION MUTATORS
  const handleAddEdu = () => {
    const list = localCV.education || [];
    const newEdu = { period: '2024 — 2026', degree: 'M.S. Decision Analytics', institution: 'Universitas Indonesia' };
    updateGeneralField('education', [...list, newEdu]);
  };

  const handleRemoveEdu = (index: number) => {
    const list = localCV.education || [];
    updateGeneralField('education', list.filter((_, i) => i !== index));
  };

  const handleUpdateEdu = (index: number, field: 'period' | 'degree' | 'institution' | 'description', val: string) => {
    const list = [...(localCV.education || [])];
    list[index] = { ...list[index], [field]: val };
    updateGeneralField('education', list);
  };

  // 3b. EDUCATION SECTIONS MUTATORS
  const handleAddEduSection = () => {
    const list = localCV.educationSections || [];
    const newSection = {
      id: `edu-sec-${Date.now()}`,
      title: 'Judul Lembar Latar Baru',
      content: 'Keterangan atau narasi untuk lembar ini. Jelaskan secara detail mata kuliah, aktivitas, atau kisah perjuangan Anda di institusi terkait.',
      imageUrl: '',
      layoutType: 'image_left' as const,
      bgColor: 'slate' as const,
      linkedEducationDegree: '',
      sortOrder: list.length,
      textAlign: 'left' as const
    };
    updateGeneralField('educationSections', [...list, newSection]);
  };

  const handleRemoveEduSection = (id: string) => {
    const list = localCV.educationSections || [];
    updateGeneralField('educationSections', list.filter(es => es.id !== id));
  };

  const handleUpdateEduSection = (id: string, field: string, val: any) => {
    const list = localCV.educationSections || [];
    updateGeneralField('educationSections', list.map(es => es.id === id ? { ...es, [field]: val } : es));
  };

  const handleMoveEduSection = (index: number, direction: 'up' | 'down') => {
    const list = [...(localCV.educationSections || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    // Update sortOrder values to match positions
    const updatedList = list.map((es, idx) => ({ ...es, sortOrder: idx }));
    updateGeneralField('educationSections', updatedList);
  };

  // 4b. PERSONALITY MUTATORS
  const handleAddPersonality = () => {
    const list = localCV.personality || [];
    const newItem = {
      id: `pers-${Date.now()}`,
      title: 'New Value',
      description: 'Description of your personality trait or core value.',
      icon: 'Cpu'
    };
    updateGeneralField('personality', [...list, newItem]);
  };

  const handleRemovePersonality = (index: number) => {
    const list = localCV.personality || [];
    updateGeneralField('personality', list.filter((_, i) => i !== index));
  };

  const handleUpdatePersonality = (index: number, field: 'title' | 'description' | 'icon', val: string) => {
    const list = [...(localCV.personality || [])];
    list[index] = { ...list[index], [field]: val };
    updateGeneralField('personality', list);
  };

  // 4c. HOBBIES MUTATORS
  const handleAddHobby = () => {
    const list = localCV.hobbies || [];
    const newItem = {
      id: `hobby-${Date.now()}`,
      title: 'New Hobby',
      description: 'What you enjoy doing in your spare time.',
      icon: 'Heart'
    };
    updateGeneralField('hobbies', [...list, newItem]);
  };

  const handleRemoveHobby = (index: number) => {
    const list = localCV.hobbies || [];
    updateGeneralField('hobbies', list.filter((_, i) => i !== index));
  };

  const handleUpdateHobby = (index: number, field: 'title' | 'description' | 'icon', val: string) => {
    const list = [...(localCV.hobbies || [])];
    list[index] = { ...list[index], [field]: val };
    updateGeneralField('hobbies', list);
  };

  // 4d. CAREER GOALS MUTATORS
  const handleAddCareerGoal = () => {
    const list = localCV.careerGoals || [];
    const newItem = {
      id: `goal-${Date.now()}`,
      title: 'New Milestone',
      description: 'Detail what you want to achieve.',
      target_year: '2027',
      icon: 'Award'
    };
    updateGeneralField('careerGoals', [...list, newItem]);
  };

  const handleRemoveCareerGoal = (index: number) => {
    const list = localCV.careerGoals || [];
    updateGeneralField('careerGoals', list.filter((_, i) => i !== index));
  };

  const handleUpdateCareerGoal = (index: number, field: 'title' | 'description' | 'target_year' | 'icon', val: string) => {
    const list = [...(localCV.careerGoals || [])];
    list[index] = { ...list[index], [field]: val };
    updateGeneralField('careerGoals', list);
  };

  // 4. EXPERIENCES MUTATORS
  const handleAddExp = () => {
    const newId = `exp-${Date.now()}`;
    const list = localCV.experiences || [];
    const newExp = {
      id: newId,
      period: '2024 — PRESENT',
      role: 'Lead Business Analyst',
      company: 'Global Enterprises Inc.',
      bulletPoints: ['Memformulasikan query SQL berkinerja tinggi untuk menghemat biaya warehouse.'],
      tools: ['SQL', 'Snowflake', 'Python']
    };
    updateGeneralField('experiences', [...list, newExp]);
  };

  const handleRemoveExp = (id: string) => {
    const list = localCV.experiences || [];
    updateGeneralField('experiences', list.filter(e => e.id !== id));
  };

  const handleUpdateExpField = (id: string, field: 'period' | 'role' | 'company', val: string) => {
    const list = localCV.experiences || [];
    updateGeneralField('experiences', list.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleUpdateExpTools = (id: string, val: string) => {
    const arr = val.split(',').map(t => t.trim()).filter(Boolean);
    const list = localCV.experiences || [];
    updateGeneralField('experiences', list.map(e => e.id === id ? { ...e, tools: arr } : e));
  };

  const handleAddExpBullet = (id: string) => {
    const list = localCV.experiences || [];
    updateGeneralField('experiences', list.map(e => e.id === id ? { ...e, bulletPoints: [...e.bulletPoints, 'Tulis poin kontribusi analis yang baru di sini.'] } : e));
  };

  const handleUpdateExpBullet = (id: string, bulletIdx: number, val: string) => {
    const list = localCV.experiences || [];
    updateGeneralField('experiences', list.map(e => {
      if (e.id === id) {
        const bullets = [...e.bulletPoints];
        bullets[bulletIdx] = val;
        return { ...e, bulletPoints: bullets };
      }
      return e;
    }));
  };

  const handleRemoveExpBullet = (id: string, bulletIdx: number) => {
    const list = localCV.experiences || [];
    updateGeneralField('experiences', list.map(e => {
      if (e.id === id) {
        return { ...e, bulletPoints: e.bulletPoints.filter((_, i) => i !== bulletIdx) };
      }
      return e;
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-250 ${
      theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f7f9fb] text-slate-800'
    }`}>
      
      {/* PROFESSIONAL DASHBOARD HEADER */}
      <header className={`sticky top-0 z-40 select-none border-b transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-200 ${
              theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'
            }`}>
              <Database className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <span className={`font-sans font-black text-base tracking-tight block transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Control Room Admin
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 block tracking-widest uppercase">
                Enterprise DB Sync Profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic Sync'ed Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
              className={`p-2 rounded-lg transition-all cursor-pointer select-none border border-transparent ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800 hover:border-slate-700' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Collapsible Sidebar Button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Sembunyikan Menu Samping" : "Tampilkan Menu Samping"}
                className={`p-2 rounded-lg transition-all cursor-pointer select-none border border-transparent ${
                  theme === 'dark' 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${!isSidebarOpen ? 'rotate-180 text-emerald-500' : 'text-emerald-500'}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-sans text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-97 select-none border ${
                theme === 'dark' 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-350 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Kembali Ke Website</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors cursor-pointer select-none ${
                  theme === 'dark' ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-500 hover:text-red-650 hover:bg-slate-100'
                }`}
                title="Log Out dari Sistem"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {!isAuthenticated ? (
        /* FULL-SCREEN SECURE LOGIN GATE */
        <div className="flex-grow flex items-center justify-center p-4">
          <div className={`backdrop-blur-md rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-2xl border transition-colors ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <div className="text-center mb-8 select-none">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border transition-all ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-emerald-450' : 'bg-slate-100 border-slate-200 text-emerald-600'
              }`}>
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className={`text-2xl font-black tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Sistem Login Admin</h2>
              <p className={`text-xs mt-2 leading-relaxed transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Autentikasi aman melalui Supabase SDK. Masukkan kredensial administrator Anda untuk memodifikasi total visual portfolio dan file CV.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`text-[10px] font-mono font-bold block uppercase mb-1 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Email Karyawan</label>
                <input
                  type="email"
                  required
                  placeholder="admin@portfolio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs tracking-wide border transition-all ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-550/5 border-slate-250 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[10px] font-mono font-bold block uppercase mb-1 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>Passphrase Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs tracking-wide border transition-all ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-550/5 border-slate-250 text-slate-800'
                  }`}
                />
              </div>

              {authError && (
                <div className="text-xs text-red-400 font-semibold flex items-start gap-2 bg-red-950/20 p-3.5 border border-red-500/10 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-98 cursor-pointer select-none text-center"
              >
                {isLoggingIn ? 'Memverifikasi Node...' : 'Masuk Control Center'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800/60 text-center select-none">
              <span className="text-[10px] text-slate-500 font-mono">
                Encrypted Session via Supabase Database Security Policies.
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* PROFESSIONAL SPLIT-SCREEN WORKSPACE */
        <div className="flex-grow flex flex-col lg:flex-row min-h-0 overflow-hidden w-full h-[calc(100vh-64px)]">
          
          {/* NAVIGATION CONTROL PANEL (SIDEBAR) */}
          {isSidebarOpen && (
            <aside className={`w-full lg:w-64 border-b lg:border-b-0 lg:border-r p-6 shrink-0 flex flex-col justify-between overflow-y-auto h-full transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-inner'
            }`}>
            <div className="space-y-6">
              
              {/* Collapsible Button internally for better visibility */}
              <div className={`flex items-center justify-between border-b pb-4 mb-2 ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <span className={`text-[10px] font-sans font-bold tracking-wider block uppercase ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>Panel Control</span>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-1 py-1 px-2.5 text-[10px] font-sans font-bold rounded-lg border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 border-slate-800 hover:border-slate-755'
                      : 'text-slate-655 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-220 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sembunyikan</span>
                </button>
              </div>
              
              {/* Telemetry panel */}
              <div className="select-none">
                <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase tracking-wider mb-2">
                  KONEKTIVITAS DATABASE
                </span>
                <div className={`p-3 rounded-lg border flex items-center justify-between transition-colors duration-200 ${
                  theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-white border-slate-220 shadow-sm'
                }`}>
                  <span className={`text-[10px] font-mono font-semibold transition-colors ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {isSupabaseConfigured ? 'Supabase Active' : 'Fallback LocalStorage'}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
              </div>

              {/* Sidebar Menu Buttons */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-slate-550 block uppercase tracking-wider mb-2">
                  INFORMASI PORTFOLIO
                </span>
                {[
                  { id: 'profile', label: 'Profil & Deskripsi', icon: User },
                  { id: 'about_story', label: 'Tentang Saya (Story)', icon: Sparkle },
                  { id: 'about_pages', label: 'Tentang Saya (Pages)', icon: Sliders },
                  { id: 'personality', label: 'Personality & Values', icon: Heart },
                  { id: 'hobbies', label: 'Hobbies & Interests', icon: Compass },
                  { id: 'career_goals', label: 'Career Goals Roadmap', icon: Target },
                  { id: 'web_texts', label: 'Tulisan Web', icon: FileText },
                  { id: 'skills', label: 'Skills & Technical Arsenal', icon: Code },
                  { id: 'projects', label: 'Projek & Study Kasus', icon: LayoutGrid },
                  { id: 'experience', label: 'Pengalaman Karir', icon: Briefcase },
                  { id: 'education', label: 'Riwayat Pendidikan', icon: GraduationCap },
                  { id: 'methodology', label: 'Filosofi Kerja', icon: Sparkles },
                  { id: 'layout', label: 'Desain & Tata Letak CV', icon: Palette },
                  { id: 'socials', label: 'Media Sosial Kustom', icon: Share2 },
                  { id: 'db_setup', label: 'Setup Database', icon: Database },
                  { id: 'preview', label: 'Pratinjau CV (Live)', icon: Eye }
                ].map((menu) => {
                  const SelectedIcon = menu.icon;
                  const active = activeTab === menu.id;
                  return (
                    <button
                      key={menu.id}
                      onClick={() => setActiveTab(menu.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-lg border transition-all cursor-pointer text-left select-none ${
                        active 
                          ? theme === 'dark'
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 font-bold'
                            : 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/10 font-bold'
                          : theme === 'dark'
                            ? 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800' 
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SelectedIcon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-white' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}`} />
                        <span className="leading-none">{menu.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 shrink-0 transition-transform ${active ? 'translate-x-0.5 text-white' : ''}`} />
                    </button>
                  );
                })}
              </div>

            </div>

            <div className={`pt-6 border-t mt-6 select-none space-y-4 ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="text-[10px] font-mono text-slate-500 leading-normal">
                Sistem database Anda terhubung langsung dengan landing page serta layout CV formal.
              </div>
              
              <button
                type="button"
                onClick={handleLogout}
                className={`w-full py-2.5 text-[10px] font-bold tracking-wider rounded-lg border cursor-pointer text-center uppercase transition-all select-none ${
                  theme === 'dark'
                    ? 'bg-red-950/20 hover:bg-red-900/30 text-red-400 border-red-500/20'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200/60 shadow-sm'
                }`}
              >
                Logout Sesi
              </button>
            </div>
          </aside>
          )}

          {/* MAIN CONFIGURATION FORMS CONTAINER */}
          <main className={`flex-grow flex flex-col min-h-0 overflow-y-auto transition-colors duration-250 ${
            theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-800'
          }`}>
            
            <div className="p-6 sm:p-8 md:p-10 max-w-4xl w-full mx-auto flex-grow space-y-8">
              
              {/* Header Title Information card */}
              <div className={`p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg select-none border transition-colors duration-200 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
              }`}>
                <div className="flex items-center gap-3.5">
                  {!isSidebarOpen && (
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(true)}
                      className={`p-2.5 rounded-lg cursor-pointer flex items-center gap-2 text-xs font-bold transition-all border shrink-0 ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-755' 
                          : 'bg-white border-slate-220 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-sm'
                      }`}
                      title="Tampilkan Menu Samping"
                    >
                      <Menu className="w-4 h-4 text-emerald-500 animate-pulse" />
                      <span className="hidden sm:inline">Menu</span>
                    </button>
                  )}
                  <div>
                    <h3 className={`text-lg font-black transition-colors duration-200 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {activeTab === 'profile' && 'Profil Utama & Bio Singkat'}
                      {activeTab === 'about_story' && 'Sejarah & Cerita Tentang Saya (About Us Page)'}
                      {activeTab === 'about_pages' && 'Kustomisasi Lembar & Slide Halaman (Tentang Saya)'}
                      {activeTab === 'web_texts' && 'Tulisan & Keterangan Web'}
                      {activeTab === 'skills' && 'Skills & Technical Arsenal'}
                      {activeTab === 'projects' && 'Projek Portfolio Utama'}
                      {activeTab === 'experience' && 'Professional Career Chronology'}
                      {activeTab === 'education' && 'Academic Background & Achievements'}
                      {activeTab === 'methodology' && 'Filosofi & Core Methodology'}
                      {activeTab === 'layout' && 'Desain & Tata Letak CV (A4 standard)'}
                      {activeTab === 'socials' && 'Pengaturan Media Sosial Kustom'}
                      {activeTab === 'db_setup' && 'Setup Database & SQL Copy Panel'}
                      {activeTab === 'preview' && 'Pratinjau CV (Live Standard A4)'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Ubah konfigurasi di bawah ini secara instan. Klik tombol "Simpan" untuk menerapkan langsung di web Anda.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-97 transition-all shrink-0 select-none"
                >
                  {isSaving ? (
                    <Activity className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Simpan Perubahan</span>
                </button>
              </div>

              {/* SAVE NOTIFICATIONS BOX */}
              {saveStatus.type && (
                <div className={`p-4 border text-xs font-sans rounded-xl flex items-center justify-between gap-4 transition-colors duration-200 ${
                  saveStatus.type === 'success' 
                    ? (theme === 'dark' ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800')
                    : (theme === 'dark' ? 'bg-red-950/20 border-red-500/20 text-red-300' : 'bg-rose-50 border-rose-200 text-rose-800')
                }`}>
                  <span className="flex items-center gap-2 font-semibold">
                    <Check className="w-4 h-4 shrink-0" />
                    {saveStatus.message}
                  </span>
                  <button 
                    onClick={() => setSaveStatus({ type: null, message: '' })}
                    className={`text-[10px] font-bold font-mono uppercase underline bg-transparent cursor-pointer ${
                      theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Tutup
                  </button>
                </div>
              )}

              {/* PRIMARY VISUAL FORMS MAP */}
              {activeTab === 'preview' ? (
                <div className={`rounded-2xl p-2 sm:p-4 shadow-xl border overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                }`}>
                  <ResumeModal inlinePreview={true} cvData={localCV} onClose={() => {}} theme={theme} />
                </div>
              ) : (
                <div className={`rounded-2xl p-6 md:p-8 shadow-xl border transition-colors duration-250 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850 shadow-sm'
                }`}>

                {activeTab === 'web_texts' && (
                  <div className="space-y-6">
                    <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${dividerColor}`}>
                      <FileText className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`} />
                      <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Kelola Tulisan &amp; Salinan Web Utama</h4>
                    </div>

                    <p className="text-xs text-slate-400 font-mono">
                      Gunakan bagian ini untuk memodifikasi teks/tulisan di halaman utama portfolio landing page Anda. Perubahan akan langsung disinkronkan ke tabel <code className="text-emerald-400 font-bold font-mono">portfolio_texts</code> di database Supabase Anda.
                    </p>

                    <div className="space-y-6">
                      {/* HERO SECTION */}
                      <div className={`border p-5 rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white/60 shadow-sm'}`}>
                        <h5 className={`text-xs font-mono font-bold border-b pb-2 ${theme === 'dark' ? 'text-emerald-400 border-slate-850' : 'text-emerald-600 border-slate-200'}`}>Bagian Hero Atas (Landing Hero)</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Hero Badge (Plaintext Label atas)</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.hero_badge || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, hero_badge: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Hero Title (Judul Utama)</label>
                            <textarea 
                              rows={2}
                              value={localCV.webTexts?.hero_title || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, hero_title: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Hero Subtitle (Deskripsi Paragraf di Samping Foto)</label>
                            <textarea 
                              rows={4}
                              value={localCV.webTexts?.hero_subtitle || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, hero_subtitle: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* PROJECTS SECTION */}
                      <div className={`border p-5 rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white/60 shadow-sm'}`}>
                        <h5 className={`text-xs font-mono font-bold border-b pb-2 ${theme === 'dark' ? 'text-emerald-400 border-slate-850' : 'text-emerald-600 border-slate-200'}`}>Bagian Projek &amp; Study Kasus (Selected Case Studies)</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Projek Badge Text</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.projects_badge || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, projects_badge: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Projek Judul Utama</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.projects_title || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, projects_title: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Projek Subtitle / Paragraf Deskripsi</label>
                            <textarea 
                              rows={2}
                              value={localCV.webTexts?.projects_subtitle || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, projects_subtitle: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* SKILLS SECTION */}
                      <div className={`border p-5 rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white/60 shadow-sm'}`}>
                        <h5 className={`text-xs font-mono font-bold border-b pb-2 ${theme === 'dark' ? 'text-emerald-400 border-slate-850' : 'text-emerald-600 border-slate-200'}`}>Bagian Skills (Technical Arsenal)</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Skills Badge Text</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.skills_badge || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, skills_badge: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Skills Judul Utama</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.skills_title || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, skills_title: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Skills Subtitle / Paragraf Deskripsi</label>
                            <textarea 
                              rows={2}
                              value={localCV.webTexts?.skills_subtitle || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, skills_subtitle: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* EXPERIENCES SECTION */}
                      <div className={`border p-5 rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white/60 shadow-sm'}`}>
                        <h5 className={`text-xs font-mono font-bold border-b pb-2 ${theme === 'dark' ? 'text-emerald-400 border-slate-850' : 'text-emerald-600 border-slate-200'}`}>Bagian Pengalaman Karir (Professional Journey)</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Pengalaman Badge Text</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.experience_badge || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, experience_badge: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Pengalaman Judul Utama</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.experience_title || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, experience_title: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Pengalaman Subtitle / Paragraf Deskripsi</label>
                            <textarea 
                              rows={2}
                              value={localCV.webTexts?.experience_subtitle || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, experience_subtitle: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* CONTACT US SECTION */}
                      <div className={`border p-5 rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white/60 shadow-sm'}`}>
                        <h5 className={`text-xs font-mono font-bold border-b pb-2 ${theme === 'dark' ? 'text-emerald-400 border-slate-850' : 'text-emerald-600 border-slate-200'}`}>Bagian Hubungi Kami (Contact Us Form)</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Kategori / Badge Kontak (Inquiry Badge)</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.contact_badge || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, contact_badge: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Judul Form Ingestion (Contact Title)</label>
                            <input 
                              type="text" 
                              value={localCV.webTexts?.contact_title || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, contact_title: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Deskripsi Subtitle Kontak (Contact Subtitle)</label>
                            <textarea 
                              rows={3}
                              value={localCV.webTexts?.contact_subtitle || ''} 
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, contact_subtitle: e.target.value }
                                }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {activeTab === 'db_setup' && (
                  <div className="space-y-6">
                    <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${dividerColor}`}>
                      <Database className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`} />
                      <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Setup Database - Supabase SQL Editor</h4>
                    </div>

                    <p className={`text-xs leading-relaxed font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Salin kueri SQL di bawah ini, lalu jalankan di <strong className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>SQL Editor</strong> di dashboard Supabase Anda. Kueri ini akan memperbarui tabel profil Anda, beralih dari <code className="text-red-400 font-bold font-mono">portfolio_cv</code> yang usang, serta membuat tabel baru untuk <code className="text-emerald-400 font-bold font-mono">portfolio_socials</code> dan <code className="text-emerald-400 font-bold font-mono">portfolio_texts</code> sesuai struktur database yang semakin terorganisir rapi.
                    </p>

                    <div className="space-y-4">
                      <div className="relative">
                        <div className={`flex justify-between items-center border border-b-0 px-4 py-2.5 rounded-t-xl ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                          <span className={`text-[10px] font-mono font-bold flex items-center gap-1.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <Terminal className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`} />
                            TABEL_BARU_MIGRATION.SQL
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(SUPABASE_SQL_CODE);
                              alert("Kueri SQL berhasil disalin! Silakan tempel (paste) di SQL Editor Supabase Anda.");
                            }}
                            className={`px-2.5 py-1 text-[10px] font-bold font-mono tracking-wider rounded-lg transition-all cursor-pointer border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 hover:text-emerald-400 border-slate-750 text-slate-300' : 'bg-slate-50 hover:bg-slate-100 hover:text-emerald-700 border-slate-250 text-slate-700'}`}
                          >
                             SALIN KODE SQL
                          </button>
                        </div>
                        <pre className={`border rounded-b-xl p-4 overflow-x-auto text-[10px] sm:text-xs font-mono leading-relaxed max-h-[350px] select-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-850'}`}>
                          {SUPABASE_SQL_CODE}
                        </pre>
                      </div>

                      <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed space-y-2 rounded-xl">
                        <p className="font-bold flex items-center gap-1.5 uppercase tracking-wide">
                          <Check className="w-4 h-4 text-emerald-400" /> LANGKAH SETUP SUPABASE:
                        </p>
                        <ol className="list-decimal list-inside space-y-1.5 mt-1 font-mono text-[11px] pl-1">
                          <li>Buka dashboard proyek <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-bold text-emerald-400 hover:text-emerald-500">Supabase</a> Anda.</li>
                          <li>Pergi ke menu <strong className="font-bold">"SQL Editor"</strong> di tab samping kiri.</li>
                          <li>Klik <strong className="font-bold text-emerald-400 font-mono font-bold font-mono">"+ New Query"</strong> di editor Supabase Anda, lalu masukkan kode SQL di atas dan jalankan (Run).</li>
                          <li><strong>PENTING (Untuk Unggah Gambar/Background):</strong> Pergi ke menu <strong className="font-bold">"Storage"</strong> di tab samping kiri.</li>
                          <li>Buat Bucket baru dengan nama <strong className="font-bold text-emerald-400 font-mono">"portfolio_assets"</strong>.</li>
                          <li>Pastikan pilihan <strong className="font-bold text-emerald-400 font-mono font-bold font-mono">Public</strong> diaktifkan saat membuat bucket agar gambar yang diunggah dapat diakses secara publik.</li>
                          <li>Selesai! Database dan Storage Bucket Supabase Anda kini siap 100% untuk menyimpan data teks, kustomisasi layout, dan berkas gambar.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${dividerColor}`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`} />
                      <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Identitas Diri &amp; Kontak</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Lengkap</label>
                        <input 
                          type="text" 
                          id="admin-fullname-input"
                          value={localCV.name} 
                          onChange={e => updateGeneralField('name', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>

                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Panggilan (Nick Name)</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: Jonathan"
                          value={localCV.nickname || ''} 
                          onChange={e => updateGeneralField('nickname', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>

                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Gelar Profesional / Title</label>
                        <input 
                          type="text" 
                          id="admin-title-input"
                          value={localCV.title} 
                          onChange={e => updateGeneralField('title', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 border-t pt-3 mt-1 border-dashed border-slate-705/30">
                      <label className={`text-[10px] font-mono font-bold block uppercase ${textLabelColor}`}>
                        Pilihan Tampilan Nama Utama di ID Card:
                      </label>
                      <div className="flex flex-wrap gap-6 items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                          <input 
                            type="radio" 
                            name="name_display_type_profile"
                            checked={!localCV.useNicknameOnCard}
                            onChange={() => updateGeneralField('useNicknameOnCard', false)}
                            className="accent-emerald-500 w-3.5 h-3.5"
                          />
                          <span className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Nama Lengkap ({localCV.name || 'Kosong'})</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                          <input 
                            type="radio" 
                            name="name_display_type_profile"
                            checked={!!localCV.useNicknameOnCard}
                            onChange={() => updateGeneralField('useNicknameOnCard', true)}
                            className="accent-emerald-500 w-3.5 h-3.5"
                          />
                          <span className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Nama Panggilan / Pendek ({localCV.nickname || 'Kosong'})</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Lokasi Domisili</label>
                        <input 
                          type="text" 
                          value={localCV.location || ''} 
                          onChange={e => updateGeneralField('location', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>

                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Email Informasi</label>
                        <input 
                          type="email" 
                          value={localCV.email || ''} 
                          onChange={e => updateGeneralField('email', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>
                    </div>



                    {/* PHOTO/AVATAR COMPONENT - RESTORED PER USER REQUEST */}
                    {true && (
                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Foto Profil / Avatar CV</label>
                      <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg ${containerBgBorder}`}>
                        {localCV.avatarUrl ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 group shrink-0 flex items-center justify-center bg-slate-950">
                            <img 
                              src={localCV.avatarUrl} 
                              alt="Profile Preview" 
                              style={{
                                position: 'absolute',
                                width: '100%',
                                height: 'auto',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                transform: `scale(${localCV.avatarScale || 1}) translate(${localCV.avatarX || 0}px, ${localCV.avatarY || 0}px)`,
                                transformOrigin: 'center center',
                              }}
                              className="shrink-0 pointer-events-none select-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                updateGeneralField('avatarUrl', '');
                                setLocalCV(prev => ({
                                  ...prev,
                                  avatarScale: 1,
                                  avatarX: 0,
                                  avatarY: 0
                                }));
                              }}
                              className="absolute inset-0 bg-red-650/90 text-white font-bold text-[9px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                            >
                              HAPUS
                            </button>
                          </div>
                        ) : (
                          <div className={`w-16 h-16 rounded-xl border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[10px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                            NO IMAGE
                          </div>
                        )}
                        <div className="flex-grow w-full text-center sm:text-left space-y-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            id="admin-photo-file-input"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  alert("Ukuran berkas gambar maksimal 2MB.");
                                  return;
                                }
                                try {
                                  const url = await uploadFileToStorage(file);
                                  setLocalCV(prev => ({
                                    ...prev,
                                    avatarUrl: url,
                                    avatarScale: 1,
                                    avatarX: 0,
                                    avatarY: 0
                                  }));
                                  alert("✓ Foto berhasil diunggah ke bucket 'portfolio_assets'!");
                                } catch (err: any) {
                                  console.error("Gagal mengunggah ke bucket:", err);
                                  alert(`❌ Gagal mengunggah foto ke bucket 'portfolio_assets'. Harap pastikan bucket Anda sudah di-create di Supabase, di-set ke PUBLIC, dan memiliki kebijakan/policies RLS yang memperbolehkan upload berkas anonim/terautentikasi.\n\nDetail Error: ${err.message}`);
                                }
                              }
                            }}
                            className="hidden"
                          />
                          <label 
                            htmlFor="admin-photo-file-input"
                            className={`inline-block px-4 py-2 font-bold font-sans text-xs rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                          >
                            Pilih Foto PNG/JPG
                          </label>
                          <p className="text-[10px] text-slate-500 leading-normal font-mono">
                            Wajib terunggah ke Supabase Storage (Bucket: portfolio_assets). Maksimal file 2.0MB.
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Circle Viewport and Drag Slider Adjustment */}
                      {localCV.avatarUrl && (
                        <div className={`mt-4 p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                          <div className={`text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Atur Posisi &amp; Skala (Bebas Memotong Dari Gambar Asli)</span>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Original Image Reference Box */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                              <span className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Gambar Asli:</span>
                              <div className={`relative w-28 h-28 rounded-xl overflow-hidden border flex items-center justify-center p-1.5 ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-250 shadow-sm'}`}>
                                <img
                                  src={localCV.avatarUrl}
                                  alt="Full Raw"
                                  className="max-w-full max-h-full object-contain pointer-events-none select-none"
                                />
                              </div>
                            </div>
                            
                            {/* Circle Viewport Preview */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                              <span className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`}>Pratinjau CV (Geser Langsung):</span>
                              <div 
                                onPointerDown={(e) => handleImgPointerDown(e, 'avatar')}
                                onPointerMove={handleImgPointerMove}
                                onPointerUp={handleImgPointerUp}
                                onPointerCancel={handleImgPointerUp}
                                className={`relative w-28 h-28 rounded-full overflow-hidden border-2 bg-slate-950 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none transition-colors ${theme === 'dark' ? 'border-emerald-500 bg-slate-950 hover:border-emerald-400' : 'border-emerald-600 bg-slate-100 shadow-sm hover:border-emerald-500'}`}
                                title="Klik & tarik/geser langsung dengan mouse Anda"
                              >
                                <img
                                  src={localCV.avatarUrl}
                                  alt="Posisi Avatar Preview"
                                  style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: 'none',
                                    maxHeight: 'none',
                                    transform: `scale(${localCV.avatarScale || 1}) translate(${localCV.avatarX || 0}px, ${localCV.avatarY || 0}px)`,
                                    transformOrigin: 'center center',
                                    transition: imgDrag && imgDrag.type === 'avatar' ? 'none' : 'transform 0.05s ease-out'
                                  }}
                                  className="shrink-0 pointer-events-none select-none"
                                />
                                <div className="absolute inset-0 border border-emerald-500/20 rounded-full pointer-events-none" />
                                <div className="absolute w-1.5 h-1.5 bg-emerald-500/40 rounded-full pointer-events-none" />
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="flex-grow w-full space-y-3">
                              <div className="space-y-3 font-sans">
                                {/* Scale Zoom Slider */}
                                <div className="space-y-1">
                                  <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <span>UKURAN / ZOOM: {Math.round((localCV.avatarScale || 1) * 100)}%</span>
                                    <span className={`font-bold ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-650'}`}>Min 10% — Max 500%</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = localCV.avatarScale || 1;
                                        const next = Math.max(0.1, Math.round((current - 0.05) * 100) / 100);
                                        updateGeneralField('avatarScale', next);
                                      }}
                                      className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                        theme === 'dark' 
                                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-705 hover:text-white text-slate-300' 
                                          : 'bg-white border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                                      }`}
                                      title="Perkecil Zoom (-5%)"
                                    >
                                      −
                                    </button>
                                    <div className="flex-grow">
                                      <input
                                        type="range"
                                        min="0.1"
                                        max="5"
                                        step="0.01"
                                        value={localCV.avatarScale || 1}
                                        onChange={(e) => updateGeneralField('avatarScale', parseFloat(e.target.value))}
                                        className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = localCV.avatarScale || 1;
                                        const next = Math.min(5, Math.round((current + 0.05) * 100) / 100);
                                        updateGeneralField('avatarScale', next);
                                      }}
                                      className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                        theme === 'dark' 
                                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-705 hover:text-white text-slate-300' 
                                          : 'bg-white border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                                      }`}
                                      title="Perbesar Zoom (+5%)"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {/* Horizontal X Slider */}
                                  <div className="space-y-1">
                                    <div className={`flex justify-between items-center text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER X:</span>
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min="-1000"
                                          max="1000"
                                          value={localCV.avatarX || 0}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val)) {
                                              updateGeneralField('avatarX', val);
                                            }
                                          }}
                                          className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                            theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                          }`}
                                        />
                                        <span>px</span>
                                      </div>
                                    </div>
                                    <input
                                      type="range"
                                      min="-500"
                                      max="500"
                                      step="1"
                                      value={localCV.avatarX || 0}
                                      onChange={(e) => updateGeneralField('avatarX', parseInt(e.target.value))}
                                      className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                    />
                                  </div>

                                  {/* Vertical Y Slider */}
                                  <div className="space-y-1">
                                    <div className={`flex justify-between items-center text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER Y:</span>
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min="-1000"
                                          max="1000"
                                          value={localCV.avatarY || 0}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val)) {
                                              updateGeneralField('avatarY', val);
                                            }
                                          }}
                                          className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                            theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                          }`}
                                        />
                                        <span>px</span>
                                      </div>
                                    </div>
                                    <input
                                      type="range"
                                      min="-500"
                                      max="500"
                                      step="1"
                                      value={localCV.avatarY || 0}
                                      onChange={(e) => updateGeneralField('avatarY', parseInt(e.target.value))}
                                      className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                    />
                                  </div>
                                </div>

                                {/* Reset */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLocalCV(prev => ({
                                      ...prev,
                                      avatarScale: 1,
                                      avatarX: 0,
                                      avatarY: 0
                                    }));
                                  }}
                                  className="text-[9px] font-mono px-2 py-1 hover:bg-slate-700 text-slate-300 hover:text-white transition-all uppercase cursor-pointer rounded bg-slate-850"
                                >
                                  ✓ Reset Posisi Default
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    )}

                    {/* KEY HOMEPAGE ILLUSTRATION SETTINGS */}
                    <div className={`pt-6 border-t ${dividerColor}`}>
                      <label className={`text-[10px] font-mono font-bold block uppercase mb-3 ${textLabelColor}`}>Gambar Hero / Ilustrasi Utama Home Web</label>
                      
                      {/* Dual Upload Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Light Mode Photo (Wajib/Default) */}
                        <div className={`flex flex-col gap-3 p-4 border rounded-xl ${containerBgBorder}`}>
                          <div className="flex items-center gap-1.5 select-none mb-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className={`text-[10px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Profil Light Mode (Wajib / Default)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {localCV.homeImageUrl ? (
                              <div className={`relative w-16 h-16 rounded-xl overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-105 border-slate-205'}`}>
                                <img 
                                  src={localCV.homeImageUrl} 
                                  alt="Home Hero Light Preview" 
                                  className={`w-full h-full transition-transform duration-700 ease-out select-none pointer-events-none ${
                                    (localCV.homeImageUrl || "").toLowerCase().includes('.png') || (localCV.homeImageUrl || "").toLowerCase().includes('data:image/png') || (localCV.homeImageUrl || "").toLowerCase().includes('blob:') ? 'object-contain' : 'object-cover grayscale-[15%]'
                                  }`}
                                  style={{
                                    transform: `scale(${localCV.homeImageScale || 1}) translate(${(localCV.homeImageX || 0) * (64 / 112)}px, ${(localCV.homeImageY || 0) * (64 / 112)}px)`,
                                    transformOrigin: 'center center',
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateGeneralField('homeImageUrl', '');
                                  }}
                                  className="absolute inset-0 bg-red-655/90 text-white font-bold text-[9px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                >
                                  HAPUS
                                </button>
                              </div>
                            ) : (
                              <div className={`w-16 h-16 rounded-xl border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[9px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                KOSONG
                              </div>
                            )}
                            <div className="flex-grow w-full space-y-1">
                              <input 
                                type="file" 
                                accept="image/*"
                                id="admin-home-hero-light-input"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      alert("Ukuran berkas gambar maksimal 2MB.");
                                      return;
                                    }
                                    try {
                                      const url = await uploadFileToStorage(file);
                                      updateGeneralField('homeImageUrl', url);
                                      alert("✓ Gambar profil Light Mode berhasil diunggah!");
                                    } catch (err: any) {
                                      console.error("Gagal mengunggah ke bucket:", err);
                                      alert(`❌ Gagal mengunggah foto. Detail Error: ${err.message}`);
                                    }
                                  }
                                }}
                                className="hidden"
                              />
                              <label 
                                htmlFor="admin-home-hero-light-input"
                                className={`inline-block px-3 py-1.5 font-bold font-sans text-xs rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                              >
                                Pilih Gambar (Light)
                              </label>
                              <p className="text-[9px] text-slate-500 leading-normal font-mono">Digunakan default / light mode.</p>
                            </div>
                          </div>
                        </div>

                        {/* Dark Mode Photo (Optional) */}
                        <div className={`flex flex-col gap-3 p-4 border rounded-xl ${containerBgBorder}`}>
                          <div className="flex items-center gap-1.5 select-none mb-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className={`text-[10px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Profil Dark Mode (Opsional)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {localCV.homeImageUrlDark ? (
                              <div className={`relative w-16 h-16 rounded-xl overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-105 border-slate-205' : 'bg-slate-105 border-slate-205'}`}>
                                <img 
                                  src={localCV.homeImageUrlDark} 
                                  alt="Home Hero Dark Preview" 
                                  className={`w-full h-full transition-transform duration-700 ease-out select-none pointer-events-none ${
                                    (localCV.homeImageUrlDark || "").toLowerCase().includes('.png') || (localCV.homeImageUrlDark || "").toLowerCase().includes('data:image/png') || (localCV.homeImageUrlDark || "").toLowerCase().includes('blob:') ? 'object-contain' : 'object-cover grayscale-[15%]'
                                  }`}
                                  style={{
                                    transform: `scale(${localCV.homeImageScale || 1}) translate(${(localCV.homeImageX || 0) * (64 / 112)}px, ${(localCV.homeImageY || 0) * (64 / 112)}px)`,
                                    transformOrigin: 'center center',
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateGeneralField('homeImageUrlDark', '');
                                  }}
                                  className="absolute inset-0 bg-red-655/90 text-white font-bold text-[9px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                >
                                  HAPUS
                                </button>
                              </div>
                            ) : (
                              <div className={`w-16 h-16 rounded-xl border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[9px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                SAMA (DEFAULT)
                              </div>
                            )}
                            <div className="flex-grow w-full space-y-1">
                              <input 
                                type="file" 
                                disabled={!localCV.homeImageUrl}
                                accept="image/*"
                                id="admin-home-hero-dark-input"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      alert("Ukuran berkas gambar maksimal 2MB.");
                                      return;
                                    }
                                    try {
                                      const url = await uploadFileToStorage(file);
                                      updateGeneralField('homeImageUrlDark', url);
                                      alert("✓ Gambar profil Dark Mode berhasil diunggah!");
                                    } catch (err: any) {
                                      console.error("Gagal mengunggah ke bucket:", err);
                                      alert(`❌ Gagal mengunggah foto. Detail Error: ${err.message}`);
                                    }
                                  }
                                }}
                                className="hidden"
                              />
                              <label 
                                htmlFor="admin-home-hero-dark-input"
                                className={`inline-block px-3 py-1.5 font-bold font-sans text-xs rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${!localCV.homeImageUrl ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400' : (theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900')}`}
                              >
                                Pilih Gambar (Dark)
                              </label>
                              <p className="text-[9px] text-slate-500 leading-normal font-mono">Upload Light Mode terlebih dahulu.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Home Hero Slider Controls - RESTORED PER USER REQUEST */}
                      {(localCV.homeImageUrl || localCV.homeImageUrlDark) && (
                        <div className={`mt-4 p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                          
                          {/* Toggle Preview Mode */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-dashed border-slate-205 dark:border-slate-800 gap-3">
                            <div className="space-y-0.5">
                              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>PRATINJAU INTERAKTIF COCOK UNTUK DUA GAMBAR</span>
                              <p className="text-[10px] text-slate-400 font-sans max-w-md lead-relaxed">Posisi dan ukuran sharing. Gunakan tombol di kanan untuk beralih visual light vs dark mode di kotak drag.</p>
                            </div>
                            <div className="flex bg-slate-200 dark:bg-slate-950 p-1 rounded-lg shrink-0 select-none">
                              <button
                                type="button"
                                onClick={() => setPreviewThemeMode('light')}
                                className={`px-2.5 py-1 text-[9px] font-bold font-mono rounded transition-colors ${previewThemeMode === 'light' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                              >
                                ☀️ LIGHT PREVIEW
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewThemeMode('dark')}
                                className={`px-2.5 py-1 text-[9px] font-bold font-mono rounded transition-colors ${previewThemeMode === 'dark' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                              >
                                🌙 DARK PREVIEW
                              </button>
                            </div>
                          </div>

                          <div className={`text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Atur Posisi &amp; Skala Gambar Hero Home Web ({previewThemeMode.toUpperCase()} PROFILE IMAGE)</span>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Raw Image Review */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                              <span className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Gambar Asli:</span>
                              <div className={`relative w-28 h-28 rounded-xl overflow-hidden border flex items-center justify-center p-1.5 ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-250 shadow-sm'}`}>
                                <img
                                  src={previewThemeMode === 'light' ? (localCV.homeImageUrl || '') : (localCV.homeImageUrlDark || localCV.homeImageUrl || '')}
                                  alt="Raw Home Hero"
                                  className="max-w-full max-h-full object-contain pointer-events-none select-none"
                                />
                              </div>
                            </div>
                            
                            {/* Rectangular Viewport Preview */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                              <span className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`}>Pratinjau Home (Geser Langsung):</span>
                              <div 
                                onPointerDown={(e) => handleImgPointerDown(e, 'homeImage')}
                                onPointerMove={handleImgPointerMove}
                                onPointerUp={handleImgPointerUp}
                                onPointerCancel={handleImgPointerUp}
                                className={`relative w-28 h-28 rounded-2xl overflow-hidden border-2 bg-slate-950 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none transition-colors ${theme === 'dark' ? 'border-emerald-500 bg-slate-950 hover:border-emerald-400' : 'border-emerald-600 bg-slate-100 shadow-sm hover:border-emerald-500'}`}
                                title="Klik & tarik/geser langsung dengan mouse Anda"
                              >
                                {previewThemeMode === 'light' ? (
                                  localCV.homeImageUrl ? (
                                    <img
                                      src={localCV.homeImageUrl}
                                      alt="Posisi Hero Preview Light"
                                      className={`w-full h-full select-none pointer-events-none ${
                                        (localCV.homeImageUrl || "").toLowerCase().includes('.png') || (localCV.homeImageUrl || "").toLowerCase().includes('data:image/png') || (localCV.homeImageUrl || "").toLowerCase().includes('blob:') ? 'object-contain' : 'object-cover grayscale-[15%]'
                                      }`}
                                      style={{
                                        transform: `scale(${localCV.homeImageScale || 1}) translate(${localCV.homeImageX || 0}px, ${localCV.homeImageY || 0}px)`,
                                        transformOrigin: 'center center',
                                        transition: imgDrag && imgDrag.type === 'homeImage' ? 'none' : 'transform 0.05s ease-out'
                                      }}
                                    />
                                  ) : null
                                ) : (
                                  (localCV.homeImageUrlDark || localCV.homeImageUrl) ? (
                                    <img
                                      src={localCV.homeImageUrlDark || localCV.homeImageUrl}
                                      alt="Posisi Hero Preview Dark"
                                      className={`w-full h-full select-none pointer-events-none ${
                                        ((localCV.homeImageUrlDark || localCV.homeImageUrl) || "").toLowerCase().includes('.png') || ((localCV.homeImageUrlDark || localCV.homeImageUrl) || "").toLowerCase().includes('data:image/png') || ((localCV.homeImageUrlDark || localCV.homeImageUrl) || "").toLowerCase().includes('blob:') ? 'object-contain' : 'object-cover grayscale-[15%]'
                                      }`}
                                      style={{
                                        transform: `scale(${localCV.homeImageScale || 1}) translate(${localCV.homeImageX || 0}px, ${localCV.homeImageY || 0}px)`,
                                        transformOrigin: 'center center',
                                        transition: imgDrag && imgDrag.type === 'homeImage' ? 'none' : 'transform 0.05s ease-out'
                                      }}
                                    />
                                  ) : null
                                )}
                                <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl pointer-events-none" />
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="flex-grow w-full space-y-3">
                              <div className="space-y-3 font-sans">
                                {/* Scale / Zoom */}
                                <div className="space-y-1">
                                  <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <span>UKURAN / ZOOM: {Math.round((localCV.homeImageScale || 1) * 100)}%</span>
                                    <span className={`font-bold ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-650'}`}>Min 10% — Max 500%</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = localCV.homeImageScale || 1;
                                        const next = Math.max(0.1, Math.round((current - 0.05) * 100) / 100);
                                        updateGeneralField('homeImageScale', next);
                                      }}
                                      className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                        theme === 'dark' 
                                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-705 hover:text-white text-slate-300' 
                                          : 'bg-white border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                                      }`}
                                      title="Perkecil Zoom (-5%)"
                                    >
                                      −
                                    </button>
                                    <div className="flex-grow">
                                      <input
                                        type="range"
                                        min="0.1"
                                        max="5"
                                        step="0.01"
                                        value={localCV.homeImageScale || 1}
                                        onChange={(e) => updateGeneralField('homeImageScale', parseFloat(e.target.value))}
                                        className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = localCV.homeImageScale || 1;
                                        const next = Math.min(5, Math.round((current + 0.05) * 100) / 100);
                                        updateGeneralField('homeImageScale', next);
                                      }}
                                      className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                        theme === 'dark' 
                                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-705 hover:text-white text-slate-300' 
                                          : 'bg-white border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                                      }`}
                                      title="Perbesar Zoom (+5%)"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {/* Horiz X */}
                                  <div className="space-y-1">
                                    <div className={`flex justify-between items-center text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER X:</span>
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min="-1000"
                                          max="1000"
                                          value={localCV.homeImageX || 0}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val)) {
                                              updateGeneralField('homeImageX', val);
                                            }
                                          }}
                                          className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                            theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                          }`}
                                        />
                                        <span>px</span>
                                      </div>
                                    </div>
                                    <input
                                      type="range"
                                      min="-500"
                                      max="500"
                                      step="1"
                                      value={localCV.homeImageX || 0}
                                      onChange={(e) => updateGeneralField('homeImageX', parseInt(e.target.value))}
                                      className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                    />
                                  </div>

                                  {/* Vert Y */}
                                  <div className="space-y-1">
                                    <div className={`flex justify-between items-center text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER Y:</span>
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min="-1000"
                                          max="1000"
                                          value={localCV.homeImageY || 0}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val)) {
                                              updateGeneralField('homeImageY', val);
                                            }
                                          }}
                                          className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                            theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                          }`}
                                        />
                                        <span>px</span>
                                      </div>
                                    </div>
                                    <input
                                      type="range"
                                      min="-500"
                                      max="500"
                                      step="1"
                                      value={localCV.homeImageY || 0}
                                      onChange={(e) => updateGeneralField('homeImageY', parseInt(e.target.value))}
                                      className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                    />
                                  </div>
                                </div>

                                {/* Reset */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLocalCV(prev => ({
                                      ...prev,
                                      homeImageScale: 1,
                                      homeImageX: 0,
                                      homeImageY: 0
                                    }));
                                  }}
                                  className={`text-[9px] font-mono px-2 py-1 transition-all uppercase cursor-pointer rounded border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-700 border-slate-750 text-slate-300 hover:text-white' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-705 hover:text-slate-900'}`}
                                >
                                  ✓ Reset Posisi Default
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* HOME BACKGROUND CUSTOMIZER - BRAND NEW FEATURE REQUEST */}
                    <div className={`pt-6 border-t ${dividerColor}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`} />
                        <label className={`text-[10px] font-mono font-bold block uppercase tracking-wider ${textLabelColor}`}>Kustomisasi Latar Belakang (Home Background Style)</label>
                      </div>

                      <div className={`p-4 border rounded-xl space-y-4 ${containerBgBorder}`}>
                        <div className="space-y-2">
                          <label className={`text-[10px] font-mono font-bold block uppercase ${textLabelColor}`}>
                            Pilih Gaya Background Terpasang:
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { id: 'dots', label: 'Pattern Titik (Default)', desc: 'Clean radial dots overlay' },
                              { id: 'grid', label: 'Engine Grid Layout', desc: 'Engineering grid blueprint' },
                              { id: 'ambient', label: 'Ambient Radial Glow', desc: 'Modern colorful blurred orbs' },
                              { id: 'abstract', label: 'Diagonal Overlapping', desc: 'Elegant stripe intersections' },
                              { id: 'solid', label: 'Minimalist Solid', desc: 'No overlays, pure flat color' },
                              { id: 'custom_upload', label: 'Unggahan Gambar Kustom', desc: 'Transparent watermark overlay' }
                            ].map((styleOpt) => {
                              const isSelected = (localCV.webTexts?.home_bg_style || 'dots') === styleOpt.id;
                              return (
                                <button
                                  key={styleOpt.id}
                                  type="button"
                                  onClick={() => {
                                    const currentTexts = localCV.webTexts || {};
                                    setLocalCV(prev => ({
                                      ...prev,
                                      webTexts: { ...currentTexts, home_bg_style: styleOpt.id }
                                    }));
                                  }}
                                  className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold' 
                                      : `${theme === 'dark' ? 'border-slate-800 bg-slate-950/20 hover:border-slate-700 text-slate-300' : 'border-slate-200 bg-white/50 hover:border-slate-300 text-slate-700'}`
                                  }`}
                                >
                                  <div className="text-xs font-sans font-bold leading-none mb-1 flex items-center gap-1.5">
                                    {isSelected && <Check className="w-3 h-3 text-emerald-500" />}
                                    {styleOpt.label}
                                  </div>
                                  <div className="text-[9px] font-mono opacity-80 font-normal leading-tight">
                                    {styleOpt.desc}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Image Upload Panel - visible only if 'custom_upload' is selected */}
                        {(localCV.webTexts?.home_bg_style === 'custom_upload') && (
                          <div className={`p-4 border rounded-lg border-dashed space-y-4 ${theme === 'dark' ? 'bg-slate-955 border-slate-700' : 'bg-slate-50/50 border-slate-300'}`}>
                            <div className="flex items-center gap-2">
                              <Image className="w-4 h-4 text-emerald-500" />
                              <span className={`text-[10px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                Unggah Gambar Latar Belakang Kustom
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              {localCV.webTexts?.home_bg_custom_url ? (
                                <div className={`relative w-20 h-16 rounded-xl overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-100 border-slate-205'}`}>
                                  <img 
                                    src={localCV.webTexts.home_bg_custom_url} 
                                    alt="Background Watermark Preview" 
                                    className="w-full h-full object-cover select-none pointer-events-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentTexts = localCV.webTexts || {};
                                      setLocalCV(prev => ({
                                        ...prev,
                                        webTexts: { ...currentTexts, home_bg_custom_url: '' }
                                      }));
                                    }}
                                    className="absolute inset-0 bg-red-655/90 text-white font-bold text-[9px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                  >
                                    HAPUS
                                  </button>
                                </div>
                              ) : (
                                <div className={`w-20 h-16 rounded-xl border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[9px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                  NO BG IMAGE
                                </div>
                              )}

                              <div className="flex-grow w-full space-y-1">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  id="admin-home-bg-custom-input"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        alert("Ukuran berkas gambar maksimal 2MB.");
                                        return;
                                      }
                                      try {
                                        const url = await uploadFileToStorage(file);
                                        const currentTexts = localCV.webTexts || {};
                                        setLocalCV(prev => ({
                                          ...prev,
                                          webTexts: { ...currentTexts, home_bg_custom_url: url }
                                        }));
                                        alert("✓ Gambar background kustom berhasil diunggah!");
                                      } catch (err: any) {
                                        console.error("Gagal mengunggah ke bucket:", err);
                                        alert(`❌ Gagal mengunggah background. Detail Error: ${err.message}`);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                />
                                <label 
                                  htmlFor="admin-home-bg-custom-input"
                                  className={`inline-block px-3 py-1.5 font-bold font-sans text-xs rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                                >
                                  Pilih Gambar Background
                                </label>
                                <p className="text-[9px] text-slate-500 leading-normal font-mono">Unggah gambar resolusi tinggi untuk hasil watermark terbaik.</p>
                              </div>
                            </div>

                            {/* Opacity Adjustment */}
                            {localCV.webTexts?.home_bg_custom_url && (
                              <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-705/20">
                                <div className={`flex justify-between items-center text-[10px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  <span className="font-bold uppercase">Transparansi Watermark Latar (Lamar-lamat / Faintness):</span>
                                  <span className="font-bold text-emerald-500 font-mono">
                                    {Math.round(parseFloat(localCV.webTexts?.home_bg_custom_opacity || '0.15') * 100)}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-mono text-slate-500">0%</span>
                                  <input 
                                    type="range"
                                    min="0.01"
                                    max="0.8"
                                    step="0.01"
                                    value={parseFloat(localCV.webTexts?.home_bg_custom_opacity || '0.15')}
                                    onChange={(e) => {
                                      const currentTexts = localCV.webTexts || {};
                                      setLocalCV(prev => ({
                                        ...prev,
                                        webTexts: { ...currentTexts, home_bg_custom_opacity: e.target.value }
                                      }));
                                    }}
                                    className={`flex-grow h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                  />
                                  <span className="text-[9px] font-mono text-slate-500">80%</span>
                                </div>
                                <p className="text-[9px] text-slate-500 leading-normal font-mono italic">
                                  Tip: Pertahankan nilai rendah (5% s.d 20%) agar teks di atasnya tetap terbaca dengan jelas dan kontras tinggi.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BIO DESCRIPTION (ABOUT ME) */}
                    <div className={`pt-4 border-t ${dividerColor}`}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <label className={`text-[10px] font-mono font-bold block uppercase ${textLabelColor}`}>
                          Deskripsi Singkat Tentang Saya (Tentang Saya di CV)
                        </label>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                          1 - 2 PARAGRAF
                        </span>
                      </div>
                      <textarea 
                        value={localCV.aboutMe || ''} 
                        onChange={e => updateGeneralField('aboutMe', e.target.value)}
                        rows={6}
                        placeholder="Tuliskan 1 atau 2 paragraf singkat mengenai spesialisasi Anda, pencapaian karir, dan dedikasi profesional. Ini akan ditampilkan di bagian atas CV Anda."
                        className={`w-full px-4 py-3 rounded-lg text-xs leading-relaxed font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                      />
                      <p className="text-[10px] text-slate-505 mt-1 leading-normal font-mono">
                        Informasi deskripsi ini akan disinkronisasikan langsung ke lembaran CV standar A4 universal di bagian atas.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'about_story' && (
                  <div className="space-y-6">
                    <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${dividerColor}`}>
                      <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`} />
                      <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Konfigurasi Halaman Tentang Saya (About Me Story)</h4>
                    </div>

                    {/* Badge, Title, and Intro */}
                    <div className={`p-4 rounded-xl border space-y-4 ${containerBgBorder}`}>
                      <h5 className="font-bold text-xs uppercase tracking-wider font-mono text-emerald-500">Judul Utama &amp; Pengenalan Singkat</h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Badge Atas / Subtitle</label>
                          <input 
                            type="text" 
                            value={localCV.webTexts?.about_story_badge || ''} 
                            onChange={e => {
                              const currentTexts = localCV.webTexts || {};
                              setLocalCV(prev => ({
                                ...prev,
                                webTexts: { ...currentTexts, about_story_badge: e.target.value }
                              }));
                            }}
                            placeholder="Contoh: ✦ DISCOVER OUR STORY"
                            className={`w-full px-4 py-2.5 rounded-lg text-xs leading-relaxed font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                          />
                        </div>

                        <div>
                          <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Judul Utama Halaman</label>
                          <input 
                            type="text" 
                            value={localCV.webTexts?.about_story_title || ''} 
                            onChange={e => {
                              const currentTexts = localCV.webTexts || {};
                              setLocalCV(prev => ({
                                ...prev,
                                webTexts: { ...currentTexts, about_story_title: e.target.value }
                              }));
                            }}
                            placeholder="Contoh: About Me"
                            className={`w-full px-4 py-2.5 rounded-lg text-xs leading-relaxed font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Paragraf Deskripsi Pengenalan</label>
                        <textarea 
                          value={localCV.webTexts?.about_story_intro || ''} 
                          onChange={e => {
                            const currentTexts = localCV.webTexts || {};
                            setLocalCV(prev => ({
                              ...prev,
                              webTexts: { ...currentTexts, about_story_intro: e.target.value }
                            }));
                          }}
                          rows={4}
                          placeholder="Ceritakan tentang visi, keahlian dan bagaimana Anda menyalurkan dedikasi profesional dalam portofolio Anda..."
                          className={`w-full px-4 py-2.5 rounded-lg text-xs leading-relaxed font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>
                    </div>

                    {/* About Me Story Images Config (Background + Light/Dark Lanyards in JSON Format) */}
                    {(() => {
                      const rawAboutStoryImg = localCV.webTexts?.about_story_image_url || '';
                      let aboutStoryImgObj = {
                        backgroundImageUrl: '',
                        lanyardLightUrl: '',
                        lanyardDarkUrl: ''
                      };
                      if (rawAboutStoryImg.trim().startsWith('{')) {
                        try {
                          const parsed = JSON.parse(rawAboutStoryImg);
                          aboutStoryImgObj = {
                            backgroundImageUrl: parsed.backgroundImageUrl || '',
                            lanyardLightUrl: parsed.lanyardLightUrl || '',
                            lanyardDarkUrl: parsed.lanyardDarkUrl || ''
                          };
                        } catch (e) {
                          console.warn("Error parsing about_story_image_url JSON in AdminPage render", e);
                        }
                      } else {
                        // backward compatibility legacy fallback
                        aboutStoryImgObj = {
                          backgroundImageUrl: '',
                          lanyardLightUrl: rawAboutStoryImg,
                          lanyardDarkUrl: rawAboutStoryImg
                        };
                      }

                      const updateAboutStoryImage = (key: 'backgroundImageUrl' | 'lanyardLightUrl' | 'lanyardDarkUrl', url: string) => {
                        const updatedObj = {
                          ...aboutStoryImgObj,
                          [key]: url
                        };
                        const currentTexts = localCV.webTexts || {};
                        setLocalCV(prev => ({
                          ...prev,
                          webTexts: {
                            ...currentTexts,
                            about_story_image_url: JSON.stringify(updatedObj)
                          }
                        }));
                      };

                      return (
                        <div className={`p-4 rounded-xl border space-y-4 ${containerBgBorder}`}>
                          <div className="border-b pb-2 border-slate-700/30">
                            <h5 className="font-bold text-xs uppercase tracking-wider font-mono text-emerald-500">Konfigurasi Media Halaman About Me</h5>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Unggah gambar latar belakang halaman dan foto profil lanyard.</p>
                          </div>

                          {/* 1. Background Image Upload */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-1.5 select-none">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className={`text-[10px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Gambar Latar Belakang (Bagian Atas &amp; Memudar)
                              </span>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              {aboutStoryImgObj.backgroundImageUrl ? (
                                <div className={`relative w-32 h-20 rounded-lg overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-105 border-slate-205'}`}>
                                  <img 
                                    src={aboutStoryImgObj.backgroundImageUrl} 
                                    alt="About BG Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateAboutStoryImage('backgroundImageUrl', '');
                                    }}
                                    className="absolute inset-0 bg-red-650/95 text-white font-bold text-[9px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                  >
                                    HAPUS
                                  </button>
                                </div>
                              ) : (
                                <div className={`w-32 h-20 rounded-lg border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[9px] font-mono text-center font-bold p-2 ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                  BELUM ADA LATAR
                                </div>
                              )}
                              <div className="flex-grow w-full text-center sm:text-left space-y-1">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  id="admin-about-bg-file-input"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 3 * 1024 * 1024) {
                                        alert("Ukuran berkas gambar latar belakang maksimal 3MB.");
                                        return;
                                      }
                                      try {
                                        const url = await uploadFileToStorage(file);
                                        updateAboutStoryImage('backgroundImageUrl', url);
                                        alert("✓ Gambar latar belakang About Me berhasil diunggah!");
                                      } catch (err: any) {
                                        console.error("Gagal mengunggah gambar latar:", err);
                                        alert(`❌ Gagal mengunggah gambar latar. Error: ${err.message}`);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                />
                                <label 
                                  htmlFor="admin-about-bg-file-input"
                                  className={`inline-block px-3 py-1.5 font-bold font-sans text-xs rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-755 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                                >
                                  Pilih Gambar Latar Belakang
                                </label>
                                <p className="text-[9px] text-slate-500 leading-normal font-mono">
                                  Latar belakang horizontal untuk bagian atas yang memudar (fade) elegan di bagian bawah.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Lanyard Light & Dark Dual Upload Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-dashed border-slate-700/30">
                            {/* Light Mode Lanyard Image */}
                            <div className="space-y-2 p-3 border rounded-lg border-slate-700/20">
                              <div className="flex items-center gap-1.5 select-none mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Profil Lanyard (Light Mode)
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {aboutStoryImgObj.lanyardLightUrl ? (
                                  <div className={`relative w-12 h-18 rounded-lg overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-105 border-slate-205'}`}>
                                    <img 
                                      src={aboutStoryImgObj.lanyardLightUrl} 
                                      alt="Lanyard Light" 
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAboutStoryImage('lanyardLightUrl', '');
                                      }}
                                      className="absolute inset-0 bg-red-650/95 text-white font-bold text-[8px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                    >
                                      HAPUS
                                    </button>
                                  </div>
                                ) : (
                                  <div className={`w-12 h-18 rounded-lg border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[8px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                    KOSONG
                                  </div>
                                )}
                                <div className="flex-grow space-y-1">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    id="admin-lanyard-light-input"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 2 * 1024 * 1024) {
                                          alert("Ukuran berkas gambar lanyard maksimal 2MB.");
                                          return;
                                        }
                                        try {
                                          const url = await uploadFileToStorage(file);
                                          updateAboutStoryImage('lanyardLightUrl', url);
                                          alert("✓ Foto lanyard Light Mode berhasil diunggah!");
                                        } catch (err: any) {
                                          console.error(err);
                                          alert("Gagal mengunggah gambar.");
                                        }
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  <label 
                                    htmlFor="admin-lanyard-light-input"
                                    className={`inline-block px-2.5 py-1.5 font-bold font-sans text-[10px] rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-755 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                                  >
                                    Pilih Foto Light
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Dark Mode Lanyard Image */}
                            <div className="space-y-2 p-3 border rounded-lg border-slate-700/20">
                              <div className="flex items-center gap-1.5 select-none mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                <span className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Profil Lanyard (Dark Mode)
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {aboutStoryImgObj.lanyardDarkUrl ? (
                                  <div className={`relative w-12 h-18 rounded-lg overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-105 border-slate-205'}`}>
                                    <img 
                                      src={aboutStoryImgObj.lanyardDarkUrl} 
                                      alt="Lanyard Dark" 
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAboutStoryImage('lanyardDarkUrl', '');
                                      }}
                                      className="absolute inset-0 bg-red-650/95 text-white font-bold text-[8px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                    >
                                      HAPUS
                                    </button>
                                  </div>
                                ) : (
                                  <div className={`w-12 h-18 rounded-lg border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[8px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                    KOSONG
                                  </div>
                                )}
                                <div className="flex-grow space-y-1">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    id="admin-lanyard-dark-input"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 2 * 1024 * 1024) {
                                          alert("Ukuran berkas gambar lanyard maksimal 2MB.");
                                          return;
                                        }
                                        try {
                                          const url = await uploadFileToStorage(file);
                                          updateAboutStoryImage('lanyardDarkUrl', url);
                                          alert("✓ Foto lanyard Dark Mode berhasil diunggah!");
                                        } catch (err: any) {
                                          console.error(err);
                                          alert("Gagal mengunggah gambar.");
                                        }
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  <label 
                                    htmlFor="admin-lanyard-dark-input"
                                    className={`inline-block px-2.5 py-1.5 font-bold font-sans text-[10px] rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-755 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                                  >
                                    Pilih Foto Dark
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* TWO COLUMN GRID FOR LANYARD SETTINGS + LIVE PREVIEW */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left Side: Inputs and Configuration Forms (col-span-7) */}
                      <div className="lg:col-span-7 space-y-4">
                        
                        {/* DYNAMIC MULTI-SVG LAYERS CONFIGURATION BOX */}
                        <div id="admin-idcard-config-header" className={`p-4 border rounded-xl space-y-4 ${containerBgBorder}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h5 className={`font-mono text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`}>
                                🎨 KUSTOMISASI LAPISAN SVG DYNAMIC (MULTIPLE LAYERS)
                              </h5>
                              <p className="text-[8.5px] text-slate-500 font-mono mt-0.5">
                                Unggah desain SVG Anda (nama, gelar, barcode, hiasan, dll.) lalu atur posisi, ukuran, dan urutan lapisannya!
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddSvgItem}
                              className="text-[10px] font-bold font-mono px-3 py-1.5 cursor-pointer bg-emerald-500 hover:bg-emerald-600 active:scale-97 text-white rounded-lg shadow transition-all flex items-center justify-center gap-1 shrink-0"
                            >
                              ➕ Tambah Lapisan SVG
                            </button>
                          </div>

                          {/* SVG Layers List */}
                          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                            {(!localCV.idCardSvgs || localCV.idCardSvgs.length === 0) ? (
                              <div className={`p-6 rounded-lg border border-dashed text-center ${theme === 'dark' ? 'bg-slate-900/40 border-slate-750 text-slate-400' : 'bg-slate-50/50 border-slate-200 text-slate-500'}`}>
                                <p className="text-xs font-mono">Belum ada lapisan SVG kustom.</p>
                                <p className="text-[9px] text-slate-500 mt-1">Klik tombol di atas untuk mulai menambahkan teks/desain SVG kustom Anda sendiri!</p>
                              </div>
                            ) : (
                              [...localCV.idCardSvgs].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)).map((svgItem, index) => {
                                const isActive = activeIDCardPart === `svg-item-${svgItem.id}`;
                                return (
                                  <div 
                                    key={svgItem.id} 
                                    onClick={() => setActiveIDCardPart(`svg-item-${svgItem.id}`)}
                                    className={`p-3.5 border rounded-xl space-y-3 transition-all ${
                                      isActive 
                                        ? (theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/5' : 'bg-emerald-50/55 border-emerald-400 shadow-md shadow-emerald-500/5')
                                        : (theme === 'dark' ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700' : 'bg-slate-50/30 border-slate-200 hover:border-slate-300')
                                    }`}
                                  >
                                    {/* Layer Header */}
                                    <div className="flex items-center justify-between gap-2 border-b border-slate-700/10 pb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[9px] font-mono font-black border border-emerald-500/20">
                                          {localCV.idCardSvgs.length - index}
                                        </span>
                                        <input 
                                          type="text"
                                          value={svgItem.name || ''}
                                          placeholder="Nama Lapisan (e.g. Nama Saya, Gelar, dsb.)"
                                          onChange={e => handleUpdateSvgItemProperty(svgItem.id, 'name', e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          className={`px-2 py-0.5 font-bold text-[11px] outline-none border border-transparent rounded hover:border-slate-700/20 focus:border-emerald-500/50 font-mono ${theme === 'dark' ? 'bg-transparent text-slate-100' : 'bg-transparent text-slate-800'}`}
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveSvgItem(svgItem.id);
                                        }}
                                        className="text-[9px] font-mono font-bold text-red-500 hover:text-red-400 px-2 py-1 cursor-pointer hover:bg-red-500/10 rounded-lg transition-all"
                                      >
                                        ❌ Hapus
                                      </button>
                                    </div>

                                    {/* SVG Input Field & Parser */}
                                    <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center justify-between">
                                        <label className={`text-[9px] font-mono font-bold block uppercase ${textLabelColor}`}>
                                          Link Gambar / Konten Kode SVG:
                                        </label>
                                        
                                        {/* File Upload Parser helper */}
                                        <div>
                                          <input 
                                            type="file"
                                            accept=".svg,image/svg+xml"
                                            id={`upload-svg-item-${svgItem.id}`}
                                            className="hidden"
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                  alert("Ukuran berkas SVG maksimal 2MB.");
                                                  return;
                                                }
                                                if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
                                                  alert("Mohon unggah file format SVG saja.");
                                                  return;
                                                }
                                                try {
                                                  const url = await uploadFileToStorage(file);
                                                  handleUpdateSvgItemProperty(svgItem.id, 'svgContent', url);
                                                  alert(`✓ Berkas SVG "${file.name}" berhasil diunggah ke storage!`);
                                                } catch (err: any) {
                                                  console.error(err);
                                                  alert(`❌ Gagal mengunggah SVG ke storage: ${err.message}`);
                                                }
                                              }
                                            }}
                                          />
                                          <label 
                                            htmlFor={`upload-svg-item-${svgItem.id}`}
                                            className={`px-2 py-0.5 border text-[9px] font-mono font-bold rounded-md cursor-pointer transition-all active:scale-95 ${
                                              theme === 'dark' ? 'bg-slate-800 border-slate-750 hover:bg-slate-750 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                            }`}
                                          >
                                            📂 Unggah Berkas .SVG
                                          </label>
                                        </div>
                                      </div>

                                      <textarea
                                        value={svgItem.svgContent || ''}
                                        onChange={e => handleUpdateSvgItemProperty(svgItem.id, 'svgContent', e.target.value)}
                                        placeholder="Link URL gambar (.svg) dari storage, atau tempelkan kode <svg>...</svg> di sini."
                                        rows={2}
                                        className={`w-full px-2 py-1.5 rounded-lg text-[10px] font-mono outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                                      />
                                    </div>

                                    {/* Controls for scale & positioning */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1" onClick={e => e.stopPropagation()}>
                                      {/* X offset slider */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                                          <span>GESER HORIZONTAL (X):</span>
                                          <div className="flex items-center gap-1">
                                            <input
                                              type="number"
                                              min="-1000"
                                              max="1000"
                                              value={svgItem.x || 0}
                                              onChange={e => {
                                                const val = parseInt(e.target.value, 10);
                                                if (!isNaN(val)) {
                                                  handleUpdateSvgItemProperty(svgItem.id, 'x', val);
                                                }
                                              }}
                                              className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                                theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                              }`}
                                            />
                                            <span>px</span>
                                          </div>
                                        </div>
                                        <input
                                          type="range"
                                          min="-150"
                                          max="150"
                                          step="1"
                                          value={svgItem.x || 0}
                                          onChange={e => handleUpdateSvgItemProperty(svgItem.id, 'x', parseInt(e.target.value))}
                                          className={`w-full h-1 rounded appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-200'}`}
                                        />
                                      </div>

                                      {/* Y offset slider */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                                          <span>GESER VERTIKAL (Y):</span>
                                          <div className="flex items-center gap-1">
                                            <input
                                              type="number"
                                              min="-1000"
                                              max="1000"
                                              value={svgItem.y || 0}
                                              onChange={e => {
                                                const val = parseInt(e.target.value, 10);
                                                if (!isNaN(val)) {
                                                  handleUpdateSvgItemProperty(svgItem.id, 'y', val);
                                                }
                                              }}
                                              className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                                theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                              }`}
                                            />
                                            <span>px</span>
                                          </div>
                                        </div>
                                        <input
                                          type="range"
                                          min="-200"
                                          max="200"
                                          step="1"
                                          value={svgItem.y || 0}
                                          onChange={e => handleUpdateSvgItemProperty(svgItem.id, 'y', parseInt(e.target.value))}
                                          className={`w-full h-1 rounded appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-200'}`}
                                        />
                                      </div>

                                      {/* Scale Slider */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                          <span>UKURAN / SKALA: {Math.round((svgItem.scale || 1) * 100)}%</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0.1"
                                          max="4.0"
                                          step="0.05"
                                          value={svgItem.scale || 1}
                                          onChange={e => handleUpdateSvgItemProperty(svgItem.id, 'scale', parseFloat(e.target.value))}
                                          className={`w-full h-1 rounded appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-200'}`}
                                        />
                                      </div>

                                      {/* Lapisan / Z-Index */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                          <span>Z-INDEX (LAPISAN): {svgItem.zIndex || 10}</span>
                                          <span className="text-slate-500">Angka tinggi = Di Atas</span>
                                        </div>
                                        <input
                                          type="number"
                                          value={svgItem.zIndex || 10}
                                          onChange={e => handleUpdateSvgItemProperty(svgItem.id, 'zIndex', parseInt(e.target.value) || 0)}
                                          className={`w-full px-2 py-0.5 rounded text-[10px] font-mono outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* PORTRAIT IMAGE SCALING AND TRACEABILITY (SIMILAR TO HOME PROFILE SECTION) */}
                          <div className={`border-t pt-4 ${dividerColor} space-y-3`}>
                            <h6 className="font-bold text-xs uppercase tracking-wider font-mono text-emerald-500">
                              Pengaturan Ukuran &amp; Posisi Foto Lanyard
                            </h6>
                            <div className="space-y-3 font-sans">
                              {/* Scale / Zoom */}
                              <div className="space-y-1">
                                <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  <span>UKURAN / ZOOM FOTO: {Math.round((localCV.aboutStoryImageScale || 1) * 100)}%</span>
                                  <span className={`font-bold ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-650'}`}>Min 10% — Max 500%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = localCV.aboutStoryImageScale || 1;
                                      const next = Math.max(0.1, Math.round((current - 0.05) * 100) / 100);
                                      updateGeneralField('aboutStoryImageScale', next);
                                    }}
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                      theme === 'dark' 
                                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-705 text-slate-305' 
                                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-705'
                                    }`}
                                    title="Perkecil Zoom (-5%)"
                                  >
                                    −
                                  </button>
                                  <div className="flex-grow">
                                    <input
                                      type="range"
                                      id="admin-portrait-scale-slider"
                                      min="0.1"
                                      max="5"
                                      step="0.01"
                                      value={localCV.aboutStoryImageScale || 1}
                                      onChange={(e) => updateGeneralField('aboutStoryImageScale', parseFloat(e.target.value))}
                                      className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = localCV.aboutStoryImageScale || 1;
                                      const next = Math.min(5, Math.round((current + 0.05) * 100) / 100);
                                      updateGeneralField('aboutStoryImageScale', next);
                                    }}
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                      theme === 'dark' 
                                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-705 text-slate-305' 
                                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-705'
                                    }`}
                                    title="Perbesar Zoom (+5%)"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Horiz X */}
                                <div className="space-y-1">
                                  <div className={`flex justify-between items-center text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <span>GESER KANAN-KIRI (X):</span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min="-1000"
                                        max="1000"
                                        value={localCV.aboutStoryImageX || 0}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value, 10);
                                          if (!isNaN(val)) {
                                            updateGeneralField('aboutStoryImageX', val);
                                          }
                                        }}
                                        className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                        }`}
                                      />
                                      <span>px</span>
                                    </div>
                                  </div>
                                  <input
                                    type="range"
                                    min="-300"
                                    max="300"
                                    step="1"
                                    value={localCV.aboutStoryImageX || 0}
                                    onChange={(e) => updateGeneralField('aboutStoryImageX', parseInt(e.target.value))}
                                    className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                  />
                                </div>

                                {/* Vert Y */}
                                <div className="space-y-1">
                                  <div className={`flex justify-between items-center text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <span>GESER ATAS-BAWAH (Y):</span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min="-1000"
                                        max="1000"
                                        value={localCV.aboutStoryImageY || 0}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value, 10);
                                          if (!isNaN(val)) {
                                            updateGeneralField('aboutStoryImageY', val);
                                          }
                                        }}
                                        className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                        }`}
                                      />
                                      <span>px</span>
                                    </div>
                                  </div>
                                  <input
                                    type="range"
                                    min="-300"
                                    max="300"
                                    step="1"
                                    value={localCV.aboutStoryImageY || 0}
                                    onChange={(e) => updateGeneralField('aboutStoryImageY', parseInt(e.target.value))}
                                    className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setLocalCV(prev => ({
                                    ...prev,
                                    aboutStoryImageScale: 1,
                                    aboutStoryImageX: 0,
                                    aboutStoryImageY: 0
                                  }));
                                }}
                                className={`text-[9px] font-mono px-2 py-1 transition-all uppercase cursor-pointer rounded border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-700 border-slate-755 text-slate-300 hover:text-white' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-755 hover:text-slate-900'}`}
                              >
                                ✓ Reset Posisi Foto Lanyard
                              </button>
                            </div>
                          </div>

                          {/* PORTRAIT BOTTOM FADE ADJUSTMENTS */}
                          <div className="space-y-3 p-3 border rounded-lg border-slate-700/20 bg-slate-500/5">
                            <h6 className="font-bold text-xs uppercase tracking-wider font-mono text-emerald-500 flex items-center gap-1.5">
                              <span>✨ Transparansi Bagian Bawah Foto</span>
                            </h6>
                            
                            <div className="space-y-3 font-sans">
                              {/* Enable/Disable Toggle */}
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Aktifkan Transparansi Memudar:
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={localCV.idCardPortraitFadeEnabled !== false} 
                                    onChange={(e) => updateGeneralField('idCardPortraitFadeEnabled', e.target.checked)}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                                </label>
                              </div>

                              {localCV.idCardPortraitFadeEnabled !== false && (
                                <>
                                  {/* Fade Start slider */}
                                  <div className="space-y-1">
                                    <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>Mulai Memudar dari Posisi: {localCV.idCardPortraitFadeStart !== undefined ? localCV.idCardPortraitFadeStart : 50}%</span>
                                      <span className="text-slate-405">0% (Atas) — 100% (Bawah)</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="1"
                                      value={localCV.idCardPortraitFadeStart !== undefined ? localCV.idCardPortraitFadeStart : 50}
                                      onChange={(e) => updateGeneralField('idCardPortraitFadeStart', parseInt(e.target.value))}
                                      className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                    />
                                    <p className="text-[9px] text-slate-550 dark:text-slate-400 italic">Mengatur batasan atas di mana foto mulai memudar transparan (jangan sampai tengah!).</p>
                                  </div>

                                  {/* Fade End slider */}
                                  <div className="space-y-1">
                                    <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>Selesai Memudar (Transparan Penuh) di: {localCV.idCardPortraitFadeEnd !== undefined ? localCV.idCardPortraitFadeEnd : 100}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="1"
                                      value={localCV.idCardPortraitFadeEnd !== undefined ? localCV.idCardPortraitFadeEnd : 100}
                                      onChange={(e) => updateGeneralField('idCardPortraitFadeEnd', parseInt(e.target.value))}
                                      className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                    />
                                    <p className="text-[9px] text-slate-550 dark:text-slate-400 italic">Mengatur batas paling bawah di mana foto menjadi transparan penuh.</p>
                                  </div>
                                </>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setLocalCV(prev => ({
                                    ...prev,
                                    idCardPortraitFadeEnabled: true,
                                    idCardPortraitFadeStart: 50,
                                    idCardPortraitFadeEnd: 100
                                  }));
                                }}
                                className={`text-[9px] font-mono px-2 py-1 transition-all uppercase cursor-pointer rounded border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-700 border-slate-755 text-slate-300 hover:text-white' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-755 hover:text-slate-900'}`}
                              >
                                ✓ Reset Transparansi
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>
                              Sosmed yang Ditampilkan di ID Card (Maksimal 2):
                            </label>
                            <div className="flex flex-wrap gap-2.5 mt-1.5">
                              {(() => {
                                const availableSocials = [
                                  { id: 'linkedin', label: 'LinkedIn', value: localCV.linkedin },
                                  { id: 'github', label: 'GitHub', value: localCV.github },
                                  { id: 'instagram', label: 'Instagram', value: localCV.instagram },
                                  { id: 'whatsapp', label: 'WhatsApp', value: localCV.whatsapp },
                                  ...(localCV.customSocials || []).map(cs => ({ id: cs.id, label: cs.name, value: cs.value }))
                                ].filter(s => s.value && s.value.trim() !== '');

                                if (availableSocials.length === 0) {
                                  return <p className="text-[11px] italic text-slate-500 row-span-1">Isi media sosial Anda di bagian Identitas Diri atau Custom Socials terlebih dahulu untuk memilih.</p>;
                                }

                                const currentSelection = localCV.cardSocials || [];

                                return availableSocials.map(social => {
                                  const isChecked = currentSelection.includes(social.id);
                                  return (
                                    <div 
                                      key={social.id} 
                                      onClick={() => {
                                        if (isChecked) {
                                          updateGeneralField('cardSocials', currentSelection.filter(id => id !== social.id));
                                        } else if (currentSelection.length < 2) {
                                          updateGeneralField('cardSocials', [...currentSelection, social.id]);
                                        } else {
                                          updateGeneralField('cardSocials', [currentSelection[1], social.id]);
                                        }
                                      }}
                                      className={`flex items-center gap-2 p-2 px-3 border rounded-lg text-xs cursor-pointer select-none transition-all ${
                                        isChecked 
                                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                                      }`}
                                    >
                                      <input 
                                        type="checkbox" 
                                        checked={isChecked}
                                        readOnly
                                        className="accent-emerald-500 w-3.5 h-3.5 rounded pointer-events-none"
                                      />
                                      <span>{social.label}</span>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                            <p className="text-[10px] font-mono italic mt-1.5 text-slate-500">
                              Pilihan aktif: { (localCV.cardSocials || []).length } / 2 terpilih.
                            </p>
                          </div>

                          {/* DYNAMIC BACKGROUND SVG SETTINGS */}
                          <div className={`border-t pt-4 ${dividerColor} space-y-4`}>
                            <h6 className="font-bold text-xs uppercase tracking-wider font-mono text-emerald-500 flex items-center gap-1.5">
                              <span>🎨 Background SVG ID Card (Khusus SVG)</span>
                            </h6>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Light Mode Keyplate */}
                              <div className="space-y-2 p-3 border rounded-lg border-slate-700/20">
                                <span className={`text-[10px] font-mono font-bold uppercase block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  SVG Background (Light Mode)
                                </span>
                                <div className="flex items-center gap-3">
                                  {localCV.idCardSvgLight ? (
                                    <div className={`relative w-12 h-18 rounded-lg overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                      <img 
                                        src={localCV.idCardSvgLight} 
                                        alt="Light Backplate" 
                                        className="w-full h-full object-contain"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => updateGeneralField('idCardSvgLight', '')}
                                        className="absolute inset-0 bg-red-650/95 text-white font-bold text-[8px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                      >
                                        HAPUS
                                      </button>
                                    </div>
                                  ) : (
                                    <div className={`w-12 h-18 rounded-lg border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[8px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                      TANPA SVG
                                    </div>
                                  )}
                                  <div className="flex-grow space-y-1">
                                    <input 
                                      type="file" 
                                      accept="image/svg+xml"
                                      id="admin-idcard-svg-light-input"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.size > 2 * 1024 * 1024) {
                                            alert("Ukuran berkas SVG maksimal 2MB.");
                                            return;
                                          }
                                          if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
                                            alert("Mohon unggah file format SVG saja.");
                                            return;
                                          }
                                          try {
                                            const url = await uploadFileToStorage(file);
                                            updateGeneralField('idCardSvgLight', url);
                                            alert("✓ SVG Background Light Mode berhasil diunggah!");
                                          } catch (err: any) {
                                            console.error(err);
                                            alert("Gagal mengunggah file SVG.");
                                          }
                                        }
                                      }}
                                      className="hidden"
                                    />
                                    <label 
                                      htmlFor="admin-idcard-svg-light-input"
                                      className={`inline-block px-2.5 py-1.5 font-bold font-sans text-[10px] rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-755 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                                    >
                                      Pilih SVG Light
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Dark Mode Keyplate */}
                              <div className="space-y-2 p-3 border rounded-lg border-slate-700/20">
                                <span className={`text-[10px] font-mono font-bold uppercase block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  SVG Background (Dark Mode)
                                </span>
                                <div className="flex items-center gap-3">
                                  {localCV.idCardSvgDark ? (
                                    <div className={`relative w-12 h-18 rounded-lg overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                      <img 
                                        src={localCV.idCardSvgDark} 
                                        alt="Dark Backplate" 
                                        className="w-full h-full object-contain"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => updateGeneralField('idCardSvgDark', '')}
                                        className="absolute inset-0 bg-red-650/95 text-white font-bold text-[8px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                      >
                                        HAPUS
                                      </button>
                                    </div>
                                  ) : (
                                    <div className={`w-12 h-18 rounded-lg border border-dashed flex items-center justify-center shrink-0 text-slate-500 text-[8px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                      TANPA SVG
                                    </div>
                                  )}
                                  <div className="flex-grow space-y-1">
                                    <input 
                                      type="file" 
                                      accept="image/svg+xml"
                                      id="admin-idcard-svg-dark-input"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.size > 2 * 1024 * 1024) {
                                            alert("Ukuran berkas SVG maksimal 2MB.");
                                            return;
                                          }
                                          if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
                                            alert("Mohon unggah file format SVG saja.");
                                            return;
                                          }
                                          try {
                                            const url = await uploadFileToStorage(file);
                                            updateGeneralField('idCardSvgDark', url);
                                            alert("✓ SVG Background Dark Mode berhasil diunggah!");
                                          } catch (err: any) {
                                            console.error(err);
                                            alert("Gagal mengunggah file SVG.");
                                          }
                                        }
                                      }}
                                      className="hidden"
                                    />
                                    <label 
                                      htmlFor="admin-idcard-svg-dark-input"
                                      className={`inline-block px-2.5 py-1.5 font-bold font-sans text-[10px] rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-755 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                                    >
                                      Pilih SVG Dark
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Scale, Position X, Position Y Controls */}
                            <div className="space-y-3 pt-2">
                              {/* Scale Slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span>BESAR KECIL BACKGROUND SVG: {Math.round((localCV.idCardSvgScale || 1) * 100)}%</span>
                                  <span className="text-slate-500">Min 10% — Max 500%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = localCV.idCardSvgScale || 1;
                                      const next = Math.max(0.1, Math.round((current - 0.05) * 100) / 100);
                                      updateGeneralField('idCardSvgScale', next);
                                    }}
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-705' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="range"
                                    id="admin-idcard-svg-scale-slider"
                                    min="0.1"
                                    max="5"
                                    step="0.05"
                                    value={localCV.idCardSvgScale !== undefined ? localCV.idCardSvgScale : 1}
                                    onChange={(e) => updateGeneralField('idCardSvgScale', parseFloat(e.target.value))}
                                    className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = localCV.idCardSvgScale || 1;
                                      const next = Math.min(5, Math.round((current + 0.05) * 100) / 100);
                                      updateGeneralField('idCardSvgScale', next);
                                    }}
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-90 select-none cursor-pointer ${
                                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-705' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* X Offset Slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span>POSISI HORIZONTAL BACKGROUND SVG (SAMPAING KANAN/KIRI): {localCV.idCardSvgX || 0}px</span>
                                  <span className="text-slate-500">Kiri −300px — Kanan +300px</span>
                                </div>
                                <input
                                  type="range"
                                  min="-300"
                                  max="300"
                                  step="1"
                                  value={localCV.idCardSvgX || 0}
                                  onChange={(e) => updateGeneralField('idCardSvgX', parseInt(e.target.value))}
                                  className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                />
                              </div>

                              {/* Y Offset Slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span>POSISI VERTIKAL BACKGROUND SVG (ATAS/BAWAH): {localCV.idCardSvgY || 0}px</span>
                                  <span className="text-slate-500">Atas −300px — Bawah +300px</span>
                                </div>
                                <input
                                  type="range"
                                  min="-300"
                                  max="300"
                                  step="1"
                                  value={localCV.idCardSvgY || 0}
                                  onChange={(e) => updateGeneralField('idCardSvgY', parseInt(e.target.value))}
                                  className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${theme === 'dark' ? 'bg-slate-955' : 'bg-slate-205'}`}
                                />
                              </div>

                              {/* Reset Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setLocalCV(prev => ({
                                    ...prev,
                                    idCardSvgScale: 1,
                                    idCardSvgX: 0,
                                    idCardSvgY: 0
                                  }));
                                }}
                                className={`text-[9px] font-mono px-2 py-1 transition-all uppercase cursor-pointer rounded border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-700 border-slate-755 text-slate-300 hover:text-white' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-755 hover:text-slate-900'}`}
                              >
                                ✓ Reset Posisi Background SVG
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Right Side: Live Interactive ID Card Preview (col-span-5) */}
                      <div className="lg:col-span-5 w-full flex flex-col items-center justify-start lg:sticky lg:top-4 space-y-4">
                        <div className={`p-4 border rounded-xl w-full flex flex-col items-center ${containerBgBorder}`}>
                          <h5 className={`font-mono text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'} w-full text-left mb-4`}>
                            👀 PRATINJAU LANGSUNG ID CARD FISIK LANYARD
                          </h5>
                          
                          <div className="w-full max-w-[280px] overflow-visible py-4 flex justify-center">
                            {(() => {
                              const rawAboutStoryImg = localCV.webTexts?.about_story_image_url || '';
                              let previewPortraitUrl = localCV.avatarUrl || '';
                              if (rawAboutStoryImg.trim().startsWith('{')) {
                                try {
                                  const parsed = JSON.parse(rawAboutStoryImg);
                                  previewPortraitUrl = theme === 'dark' 
                                    ? (parsed.lanyardDarkUrl || parsed.lanyardLightUrl || localCV.avatarUrl || '') 
                                    : (parsed.lanyardLightUrl || parsed.lanyardDarkUrl || localCV.avatarUrl || '');
                                } catch (e) {
                                  // fallback
                                }
                              } else {
                                previewPortraitUrl = rawAboutStoryImg || localCV.avatarUrl || '';
                              }
                              
                              return (
                                <InteractiveIDCard 
                                  portraitUrl={previewPortraitUrl}
                                  name={localCV.name || 'Nama Anda'}
                                  title={localCV.title || 'Pekerjaan Anda'}
                                  theme={theme}
                                  nickname={localCV.nickname}
                                  useNicknameOnCard={localCV.useNicknameOnCard}
                                  cardSocials={localCV.cardSocials}
                                  idCardGroup={localCV.idCardGroup}
                                  idCardSubText={localCV.idCardSubText}
                                  customSocials={localCV.customSocials}
                                  imageScale={localCV.aboutStoryImageScale}
                                  imageX={localCV.aboutStoryImageX}
                                  imageY={localCV.aboutStoryImageY}
                                  idCardText3={localCV.idCardText3}
                                  idCardBgTextSize={localCV.idCardBgTextSize}
                                  idCardSvgLight={localCV.idCardSvgLight}
                                  idCardSvgDark={localCV.idCardSvgDark}
                                  idCardSvgScale={localCV.idCardSvgScale}
                                  idCardSvgX={localCV.idCardSvgX}
                                  idCardSvgY={localCV.idCardSvgY}
                                  idCardTextX={localCV.idCardTextX}
                                  idCardTextY={localCV.idCardTextY}
                                  idCardBadgeX={localCV.idCardBadgeX}
                                  idCardBadgeY={localCV.idCardBadgeY}
                                  idCardSvgs={localCV.idCardSvgs}
                                  idCardPortraitFadeEnabled={localCV.idCardPortraitFadeEnabled}
                                  idCardPortraitFadeStart={localCV.idCardPortraitFadeStart}
                                  idCardPortraitFadeEnd={localCV.idCardPortraitFadeEnd}
                                  onUpdateSvgItemCoordinates={handleUpdateSvgItemCoordinates}
                                  isStatic={true}
                                  onPartClick={handleIDCardPartClick}
                                  activePart={activeIDCardPart}
                                  onUpdateCoordinates={handleUpdateIDCardCoordinates}
                                />
                              );
                            })()}
                          </div>

                          <p className="text-[10px] text-slate-500 font-mono text-center leading-relaxed mt-4">
                            💡 <strong>Klik bagian pada ID Card</strong> (Foto, Nama/Gelar, Lencana Pojok Atas, dll.) untuk langsung melompat &amp; menyorot input pengaturannya! ID Card dibuat statis agar pengeditan presisi dan nyaman.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Left Side Features (3 items) */}
                    <div className={`p-4 rounded-xl border space-y-4 ${containerBgBorder}`}>
                      <h5 className="font-bold text-xs uppercase tracking-wider font-mono text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Fitur Kolom KIRI (3 Item)</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Left Item 1 */}
                        <div className={`p-3 rounded-lg border focus-within:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2">ITEM KIRI 1</span>
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={localCV.webTexts?.about_story_left_1_title || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_left_1_title: e.target.value }
                                }));
                              }}
                              placeholder="Title"
                              className={`w-full px-3 py-1.5 rounded text-xs leading-normal font-bold font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                            <textarea
                              value={localCV.webTexts?.about_story_left_1_desc || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_left_1_desc: e.target.value }
                                }));
                              }}
                              rows={3}
                              placeholder="Deskripsi singkat..."
                              className={`w-full px-3 py-1.5 rounded text-xs leading-relaxed font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                          </div>
                        </div>

                        {/* Left Item 2 */}
                        <div className={`p-3 rounded-lg border focus-within:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2">ITEM KIRI 2</span>
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={localCV.webTexts?.about_story_left_2_title || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_left_2_title: e.target.value }
                                }));
                              }}
                              placeholder="Title"
                              className={`w-full px-3 py-1.5 rounded text-xs leading-normal font-bold font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                            <textarea
                              value={localCV.webTexts?.about_story_left_2_desc || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_left_2_desc: e.target.value }
                                }));
                              }}
                              rows={3}
                              placeholder="Deskripsi singkat..."
                              className={`w-full px-3 py-1.5 rounded text-xs leading-relaxed font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                          </div>
                        </div>

                        {/* Left Item 3 */}
                        <div className={`p-3 rounded-lg border focus-within:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2">ITEM KIRI 3</span>
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={localCV.webTexts?.about_story_left_3_title || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_left_3_title: e.target.value }
                                }));
                              }}
                              placeholder="Title"
                              className={`w-full px-3 py-1.5 rounded text-xs leading-normal font-bold font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                            <textarea
                              value={localCV.webTexts?.about_story_left_3_desc || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_left_3_desc: e.target.value }
                                }));
                              }}
                              rows={3}
                              placeholder="Deskripsi singkat..."
                              className={`w-full px-3 py-1.5 rounded text-xs leading-relaxed font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side Features (3 items) */}
                    <div className={`p-4 rounded-xl border space-y-4 ${containerBgBorder}`}>
                      <h5 className="font-bold text-xs uppercase tracking-wider font-mono text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>Fitur Kolom KANAN (3 Item)</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Right Item 1 */}
                        <div className={`p-3 rounded-lg border focus-within:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2">ITEM KANAN 1</span>
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={localCV.webTexts?.about_story_right_1_title || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_right_1_title: e.target.value }
                                }));
                              }}
                              placeholder="Title"
                              className={`w-full px-3 py-1.5 rounded text-xs leading-normal font-bold font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                            <textarea
                              value={localCV.webTexts?.about_story_right_1_desc || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_right_1_desc: e.target.value }
                                }));
                              }}
                              rows={3}
                              placeholder="Deskripsi singkat..."
                              className={`w-full px-3 py-1.5 rounded text-xs leading-relaxed font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                          </div>
                        </div>

                        {/* Right Item 2 */}
                        <div className={`p-3 rounded-lg border focus-within:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2">ITEM KANAN 2</span>
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={localCV.webTexts?.about_story_right_2_title || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_right_2_title: e.target.value }
                                }));
                              }}
                              placeholder="Title"
                              className={`w-full px-3 py-1.5 rounded text-xs leading-normal font-bold font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                            <textarea
                              value={localCV.webTexts?.about_story_right_2_desc || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_right_2_desc: e.target.value }
                                }));
                              }}
                              rows={3}
                              placeholder="Deskripsi singkat..."
                              className={`w-full px-3 py-1.5 rounded text-xs leading-relaxed font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                          </div>
                        </div>

                        {/* Right Item 3 */}
                        <div className={`p-3 rounded-lg border focus-within:border-emerald-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2">ITEM KANAN 3</span>
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={localCV.webTexts?.about_story_right_3_title || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_right_3_title: e.target.value }
                                }));
                              }}
                              placeholder="Title"
                              className={`w-full px-3 py-1.5 rounded text-xs leading-normal font-bold font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                            <textarea
                              value={localCV.webTexts?.about_story_right_3_desc || ''}
                              onChange={e => {
                                const currentTexts = localCV.webTexts || {};
                                setLocalCV(prev => ({
                                  ...prev,
                                  webTexts: { ...currentTexts, about_story_right_3_desc: e.target.value }
                                }));
                              }}
                              rows={3}
                              placeholder="Deskripsi singkat..."
                              className={`w-full px-3 py-1.5 rounded text-xs leading-relaxed font-sans outline-none focus:border-emerald-500 border ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                      <div className="flex items-center gap-2">
                        <Code className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Skills &amp; Technical Arsenal</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSkillIdx}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> TAMBAH SKILL &amp; BADGE
                      </button>
                    </div>

                    {/* MANAGE SKILL CATEGORIES SUBSECTION */}
                    <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50/50 border-slate-200'} space-y-4`}>
                      <div className="flex justify-between items-center border-b pb-2.5 border-slate-200 dark:border-slate-850">
                        <div className="flex items-center gap-2">
                          <Grid className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wide ${textTitleColor}`}>Klasifikasi Kategori Keterampilan (Dynamic Categories)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-2.5 py-1 text-[9px] font-bold tracking-wider cursor-pointer select-none"
                        >
                          <Plus className="w-3 h-3" /> TAMBAH KATEGORI
                        </button>
                      </div>

                      <p className={`text-[11px] leading-normal ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Tentukan kategori atau klasifikasi keterampilan Anda. Perubahan kategori di sini akan terhubung langsung ke dropdown pilihan kategori di lencana skill, filter di website, serta pengelompokan di CV asli.
                      </p>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {(localCV.skillCategories || []).map((cat, catIdx) => (
                          <div key={cat.id} className={`flex flex-col sm:flex-row items-center gap-2 p-2.5 border rounded-lg ${theme === 'dark' ? 'bg-slate-950/40 border-slate-850' : 'bg-white border-slate-200'}`}>
                            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Kode ID (Kecil/Satu Kata)</label>
                                <input 
                                  type="text"
                                  value={cat.id}
                                  onChange={e => handleUpdateCategory(cat.id, 'id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                  className={`w-full px-2 py-1.5 rounded-md text-[11px] outline-none border focus:border-blue-500 ${inputBgBorder}`}
                                  placeholder="e.g. database"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Label Nama Kategori</label>
                                <input 
                                  type="text"
                                  value={cat.label}
                                  onChange={e => handleUpdateCategory(cat.id, 'label', e.target.value)}
                                  className={`w-full px-2 py-1.5 rounded-md text-[11px] outline-none border focus:border-blue-500 ${inputBgBorder}`}
                                  placeholder="e.g. Database & Storage Solutions"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(cat.id)}
                              className="self-end sm:self-center text-slate-500 hover:text-red-400 p-1.5 cursor-pointer disabled:opacity-30"
                              title="Hapus Kategori"
                              disabled={(localCV.skillCategories || []).length <= 1}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Bagian ini mengatur lencana keterampilan (badges) yang terlihat secara visual pada halaman utama website portfolio ("Technical Arsenal").
                    </p>

                    <div className="space-y-4">
                      {(localCV.skills || []).map((skill, index) => (
                        <div key={skill.id} className={`relative p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillIdx(skill.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Hapus Skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className={`text-[10px] font-bold font-mono uppercase w-fit px-2 py-0.5 rounded ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-705 bg-emerald-50/70 border border-emerald-200/50'}`}>
                            Lencana Skill #{index + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Skill</label>
                              <input 
                                type="text" 
                                value={skill.name} 
                                onChange={e => handleUpdateSkillIdx(skill.id, 'name', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Kategori Filter &amp; CV Group</label>
                              <select 
                                value={skill.category} 
                                onChange={e => handleUpdateSkillIdx(skill.id, 'category', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${selectBgBorder}`}
                              >
                                {(localCV.skillCategories || []).map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.label} ({cat.id})</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Lucide Icon Name</label>
                              <select 
                                value={skill.icon} 
                                onChange={e => handleUpdateSkillIdx(skill.id, 'icon', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${selectBgBorder}`}
                              >
                                <option value="Database">Database Icon (SQL)</option>
                                <option value="Terminal">Terminal Icon (Python)</option>
                                <option value="Layers">Layers Icon (Structure)</option>
                                <option value="TrendingUp">TrendingUp Icon (Charts)</option>
                                <option value="Grid">Grid Icon (Excel Sheet)</option>
                                <option value="Cpu">Cpu Icon (Math/Models)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Deskripsi Singkat Penggunaan</label>
                            <input 
                              type="text" 
                              value={skill.description} 
                              onChange={e => handleUpdateSkillIdx(skill.id, 'description', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              placeholder="Gunakan kalimat aksi berkinerja tinggi..."
                            />
                          </div>

                          <div className={`grid grid-cols-2 gap-4 pt-2 border-t ${theme === 'dark' ? 'border-slate-900' : 'border-slate-200'}`}>
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={skill.showOnWeb !== false} 
                                onChange={e => handleUpdateSkillIdx(skill.id, 'showOnWeb', e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-800 focus:ring-emerald-500 cursor-pointer"
                              />
                              <div className="space-y-0.5">
                                <span className={`text-[11px] font-bold block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Tampilkan di Website</span>
                                <span className="text-[9px] text-slate-500 block leading-tight">Terlihat di visual grid web portfolio.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={skill.showOnCV !== false} 
                                onChange={e => handleUpdateSkillIdx(skill.id, 'showOnCV', e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-800 focus:ring-emerald-500 cursor-pointer"
                              />
                              <div className="space-y-0.5">
                                <span className={`text-[11px] font-bold block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Tampilkan di Lembaran CV</span>
                                <span className="text-[9px] text-slate-500 block leading-tight">Tergabung otomatis di PDF CV cetak.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}

                      {(localCV.skills || []).length === 0 && (
                        <div className={`text-center py-8 border border-dashed rounded-xl font-mono text-xs select-none ${theme === 'dark' ? 'text-slate-500 border-slate-800' : 'text-slate-500 border-slate-300'}`}>
                          Belum ada lencana skill kustom. Silakan klik tombol "Tambah Badge Skill" di samping kanan atas.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                      <div className="flex items-center gap-2">
                        <LayoutGrid className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Studi Kasus &amp; Projek Utama</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> TAMBAH PROJEK BARU
                      </button>
                    </div>

                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Bagian ini menampung deretan Projek Case Studies visual utama pada landing page website portfolio Anda.
                    </p>

                    <div className="space-y-6">
                      {(localCV.caseStudies || []).map((proj, idx) => (
                        <div key={proj.id} className={`relative p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(proj.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Hapus Projek"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className={`text-[10px] font-bold font-mono uppercase w-fit px-2 py-0.5 rounded ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-705 bg-emerald-50/70 border border-emerald-200/50'}`}>
                            Portfolio Projek #{idx + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Judul Projek</label>
                              <input 
                                type="text" 
                                value={proj.title} 
                                onChange={e => handleUpdateProjectField(proj.id, 'title', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Kategori Bidang</label>
                              <input 
                                type="text" 
                                value={proj.category} 
                                onChange={e => handleUpdateProjectField(proj.id, 'category', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-1">
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Dampak Bisnis (Impact Metric)</label>
                              <input 
                                type="text" 
                                value={proj.impactMetric} 
                                onChange={e => handleUpdateProjectField(proj.id, 'impactMetric', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 font-mono font-semibold ${inputBgBorder} ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}
                                placeholder="e.g. +24% Sales"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Tools Terpakai (Pisahkan dengan koma)</label>
                              <input 
                                type="text" 
                                value={proj.tools ? proj.tools.join(', ') : ''} 
                                onChange={e => handleUpdateProjectField(proj.id, 'tools', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                                placeholder="SQL, Python, PowerBI"
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-2 ${textLabelColor}`}>Gambar Ilustrasi Projek (Upload File)</label>
                            <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg ${theme === 'dark' ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-white'}`}>
                              {proj.image ? (
                                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-700 group shrink-0">
                                  <img 
                                    src={proj.image} 
                                    alt="Project Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateProjectField(proj.id, 'image', '')}
                                    className="absolute inset-0 bg-red-650/90 text-white font-bold text-[9px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                  >
                                    HAPUS
                                  </button>
                                </div>
                              ) : (
                                <div className={`w-24 h-16 rounded-xl border border-dashed flex items-center justify-center shrink-0 text-[10px] font-mono text-center font-bold ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-350 text-slate-400'}`}>
                                  NO IMAGE
                                </div>
                              )}
                              <div className="flex-grow w-full text-center sm:text-left space-y-1">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  id={`project-file-input-${proj.id}`}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        alert("Ukuran berkas gambar maksimal 2MB.");
                                        return;
                                      }
                                      try {
                                        const url = await uploadFileToStorage(file);
                                        handleUpdateProjectField(proj.id, 'image', url);
                                        alert("✓ Gambar projek berhasil diunggah ke bucket 'portfolio_assets'!");
                                      } catch (err: any) {
                                        console.error("Gagal mengunggah ke bucket:", err);
                                        alert(`❌ Gagal mengunggah gambar ke bucket 'portfolio_assets'. Harap pastikan bucket Anda sudah di-create di Supabase, di-set ke PUBLIC, dan memiliki kebijakan/policies RLS yang memperbolehkan upload berkas anonim/terautentikasi.\n\nDetail Error: ${err.message}`);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                />
                                <label 
                                  htmlFor={`project-file-input-${proj.id}`}
                                  className={`inline-block px-4 py-2 font-bold font-sans text-xs rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-750' : 'bg-slate-100 hover:bg-slate-150 text-slate-705 hover:text-slate-900 border-slate-250'}`}
                                >
                                  Pilih Berkas Gambar
                                </label>
                                <p className="text-[10px] text-slate-500 leading-normal font-mono">
                                  Wajib terunggah ke Supabase Storage (Bucket: portfolio_assets). Maksimal file 2.0MB. PNG/JPG/WEBP.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Deskripsi Penjelasan Solusi Analitik</label>
                            <textarea 
                              value={proj.description} 
                              onChange={e => handleUpdateProjectField(proj.id, 'description', e.target.value)}
                              rows={4}
                              className={`w-full px-3 py-2 rounded-lg text-xs outline-none leading-normal border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>

                          {/* PPT SLIDER DECK BUILDER */}
                          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-200'}`}>
                            <PPTSlideEditor 
                              slides={proj.slides || []}
                              onUpdateSlides={(updatedSlides) => handleUpdateProjectField(proj.id, 'slides', updatedSlides)}
                              theme={theme}
                            />
                          </div>
                        </div>
                      ))}

                      {(localCV.caseStudies || []).length === 0 && (
                        <div className={`text-center py-8 border border-dashed rounded-xl font-mono text-xs select-none ${theme === 'dark' ? 'text-slate-500 border-slate-800' : 'text-slate-550 border-slate-300'}`}>
                          Belum ada projek kustom. Silakan ketuk tombol "Tambah Projek Baru" di samping kanan atas.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                      <div className="flex items-center gap-2">
                        <Briefcase className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Riwayat Karir Professional</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddExp}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> TAMBAH KERJAAN
                      </button>
                    </div>

                    <div className="space-y-6">
                      {localCV.experiences.map((exp, idx) => (
                        <div key={exp.id} className={`relative p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <button
                            type="button"
                            onClick={() => handleRemoveExp(exp.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Hapus Karer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className={`text-[10px] font-bold font-mono uppercase w-fit px-2 py-0.5 rounded ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-705 bg-emerald-50/70 border border-emerald-200/50'}`}>
                            Record Karir #{idx + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Peran / Jabatan</label>
                              <input 
                                type="text" 
                                value={exp.role} 
                                onChange={e => handleUpdateExpField(exp.id, 'role', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Perusahaan / Company</label>
                              <input 
                                type="text" 
                                value={exp.company} 
                                onChange={e => handleUpdateExpField(exp.id, 'company', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Periode Pekerjaan</label>
                              <input 
                                type="text" 
                                value={exp.period} 
                                onChange={e => handleUpdateExpField(exp.id, 'period', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none font-mono border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Teknologi Terpakai (Pisahkan dengan koma)</label>
                              <input 
                                type="text" 
                                value={exp.tools ? exp.tools.join(', ') : ''} 
                                onChange={e => handleUpdateExpTools(exp.id, e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                                placeholder="SQL, Python, Tableau"
                              />
                            </div>
                          </div>

                          {/* Bullets List and edit controls */}
                          <div className={`space-y-3 pt-4 border-t ${dividerColor}`}>
                            <div className="flex justify-between items-center">
                              <label className={`text-[10px] font-mono font-bold block uppercase ${textLabelColor}`}>Poin Pencapaian &amp; Tugas Analis</label>
                              <button
                                type="button"
                                onClick={() => handleAddExpBullet(exp.id)}
                                className={`text-[9.5px] font-black font-sans flex items-center gap-0.5 cursor-pointer px-2 py-0.5 rounded border transition-colors ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10 hover:text-emerald-300' : 'text-emerald-705 bg-emerald-50 border-emerald-200 hover:text-emerald-800 shadow-sm'}`}
                              >
                                <Plus className="w-3.5 h-3.5" /> Tambah Poin Penceritaan
                              </button>
                            </div>

                            <div className="space-y-2">
                              {exp.bulletPoints.map((bullet, bulletIdx) => (
                                <div key={bulletIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={bullet}
                                    onChange={e => handleUpdateExpBullet(exp.id, bulletIdx, e.target.value)}
                                    className={`flex-grow px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExpBullet(exp.id, bulletIdx)}
                                    className={`p-2 rounded transition-colors cursor-pointer ${theme === 'dark' ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' : 'text-slate-455 hover:text-red-600 hover:bg-slate-100'}`}
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-12">
                    {/* SECTION 1: DATA AKADEMIS UNIK */}
                    <div className="space-y-6">
                      <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                        <div className="flex items-center gap-2">
                          <GraduationCap className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                          <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>1. Kredensial Akademik Utama (Unique Records)</h4>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddEdu}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                        >
                          <Plus className="w-3.5 h-3.5" /> TAMBAH RECORD PENDIDIKAN
                        </button>
                      </div>

                      <div className="space-y-4">
                        {localCV.education.map((edu, idx) => (
                          <div key={idx} className={`relative p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                            <button
                              type="button"
                              onClick={() => handleRemoveEdu(idx)}
                              className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className={`text-[10px] font-bold font-mono uppercase w-fit px-2 py-0.5 rounded ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-705 bg-emerald-50/70 border border-emerald-200/50'}`}>
                              Record Pendidikan #{idx + 1}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Periode Akademis</label>
                                <input 
                                  type="text" 
                                  value={edu.period} 
                                  onChange={e => handleUpdateEdu(idx, 'period', e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg text-xs outline-none font-mono border focus:border-emerald-500 ${inputBgBorder}`}
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Jurusan / Gelar Pendidikan</label>
                                <input 
                                  type="text" 
                                  value={edu.degree} 
                                  onChange={e => handleUpdateEdu(idx, 'degree', e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                                />
                              </div>
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Institusi &amp; Lokasi</label>
                              <input 
                                type="text" 
                                value={edu.institution} 
                                onChange={e => handleUpdateEdu(idx, 'institution', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Keterangan / Pencapaian Akademis (Opsional)</label>
                              <textarea 
                                rows={2}
                                value={edu.description || ""} 
                                onChange={e => handleUpdateEdu(idx, 'description', e.target.value)}
                                placeholder="Contoh: Lulus dengan IPK 3.8/4.0. Berfokus pada Database System..."
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'about_pages' && (() => {
                  const prefix = selectedAboutPage.replace('-', '_');
                  const currentTitle = localCV.webTexts?.[`${prefix}_title`] || '';
                  const currentIntro = localCV.webTexts?.[`${prefix}_intro`] || '';
                  const currentHeaderBg = localCV.webTexts?.[`${prefix}_header_bg`] || '';

                  // Filtered sections for the selected subpage
                  const pageSections = (localCV.educationSections || []).filter(es => {
                    if (selectedAboutPage === 'education') {
                      return !es.linkedEducationDegree?.startsWith("page:") && !es.linkedEducationDegree?.startsWith("item:");
                    } else {
                      return es.linkedEducationDegree === `page:${selectedAboutPage}` || es.linkedEducationDegree?.startsWith(`item:${selectedAboutPage}:`);
                    }
                  }).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

                  const handleAddSubPageSection = () => {
                    const currentSections = localCV.educationSections || [];
                    const newSection = {
                      id: `sec-${selectedAboutPage}-${Date.now()}`,
                      title: 'Lembar Cerita Baru',
                      content: 'Tulis narasi detail untuk lembar ini. Mendukung format Markdown jika diperlukan.',
                      imageUrl: '',
                      layoutType: 'image_left' as const,
                      bgColor: 'slate' as const,
                      linkedEducationDegree: selectedAboutPage === 'education' ? '' : `page:${selectedAboutPage}`,
                      sortOrder: pageSections.length,
                      textAlign: 'left' as const
                    };
                    updateGeneralField('educationSections', [...currentSections, newSection]);
                  };

                  const handleRemoveSubPageSection = (id: string) => {
                    const currentSections = localCV.educationSections || [];
                    updateGeneralField('educationSections', currentSections.filter(es => es.id !== id));
                  };

                  const handleUpdateSubPageSection = (id: string, field: string, val: any) => {
                    const currentSections = localCV.educationSections || [];
                    updateGeneralField('educationSections', currentSections.map(es => es.id === id ? { ...es, [field]: val } : es));
                  };

                  const handleMoveSubPageSection = (id: string, direction: 'up' | 'down') => {
                    const currentSections = [...(localCV.educationSections || [])];
                    const filteredIndex = pageSections.findIndex(es => es.id === id);
                    if (filteredIndex === -1) return;
                    
                    let targetFilteredIndex = filteredIndex;
                    if (direction === 'up' && filteredIndex > 0) {
                      targetFilteredIndex = filteredIndex - 1;
                    } else if (direction === 'down' && filteredIndex < pageSections.length - 1) {
                      targetFilteredIndex = filteredIndex + 1;
                    } else {
                      return;
                    }
                    
                    const temp = pageSections[filteredIndex];
                    pageSections[filteredIndex] = pageSections[targetFilteredIndex];
                    pageSections[targetFilteredIndex] = temp;
                    
                    const updatedPageSections = pageSections.map((es, idx) => ({
                      ...es,
                      sortOrder: idx
                    }));
                    
                    const updatedFullList = currentSections.map(es => {
                      const updatedMatch = updatedPageSections.find(ups => ups.id === es.id);
                      return updatedMatch ? updatedMatch : es;
                    });
                    
                    updateGeneralField('educationSections', updatedFullList);
                  };

                  // Meta config for rendering tabs
                  const subpagesMeta = [
                    { id: 'education', label: 'Pendidikan', sub: 'Education & Foundations', icon: GraduationCap },
                    { id: 'personality', label: 'Personality & Values', sub: 'Karakter & Nilai Diri', icon: Heart },
                    { id: 'hobbies', label: 'Hobbies & Interests', sub: 'Hobi & Ketertarikan', icon: Compass },
                    { id: 'career-journey', label: 'Experience', sub: 'Pengalaman & Karir', icon: Briefcase },
                    { id: 'skills', label: 'Skills & Expertise', sub: 'Keahlian & Technical', icon: Code },
                    { id: 'career-goals', label: 'Career Goals', sub: 'Rencana & Tujuan', icon: Target },
                  ];

                  return (
                    <div className="space-y-8 animate-fade-in">
                      <div className={`flex items-center gap-2 border-b pb-3 mb-4 ${dividerColor}`}>
                        <Sliders className={`w-5 h-5 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />
                        <div>
                          <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Kelola Sub-Halaman Tentang Saya (About Me Pages)</h4>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                            Modifikasi desain header, deskripsi pengantar, dan tambahkan slide kustom (story-sheets) di 6 sub-halaman portfolio Anda.
                          </p>
                        </div>
                      </div>

                      {/* 1. HORIZONTAL CARDS NAVIGATION GRID */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {subpagesMeta.map((sub) => {
                          const SubIcon = sub.icon;
                          const active = selectedAboutPage === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setSelectedAboutPage(sub.id as any)}
                              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2.5 transition-all cursor-pointer group ${
                                active
                                  ? theme === 'dark'
                                    ? 'bg-gradient-to-b from-teal-950/65 to-teal-900/40 border-teal-500 text-teal-350 shadow-lg shadow-teal-950/20'
                                    : 'bg-gradient-to-b from-teal-50 to-teal-100/50 border-teal-500 text-teal-700 shadow-md shadow-teal-500/5'
                                  : theme === 'dark'
                                    ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                              }`}
                            >
                              <div className={`p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-105 ${
                                active
                                  ? theme === 'dark' ? 'bg-teal-900/60 text-teal-400' : 'bg-teal-100 text-teal-600'
                                  : theme === 'dark' ? 'bg-slate-800/85 text-slate-400' : 'bg-slate-200/60 text-slate-500'
                              }`}>
                                <SubIcon className="w-5 h-5 shrink-0" />
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[11px] font-bold leading-none block">{sub.label}</span>
                                <span className="text-[9px] text-slate-500 font-medium block leading-tight">{sub.sub}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* 2. COVER HEADER CONFIGURATION CARD */}
                      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                        <div className="flex items-center gap-2">
                          <Image className={`w-5 h-5 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />
                          <div>
                            <h5 className={`font-bold text-xs uppercase tracking-wider ${textTitleColor}`}>1. Desain Header &amp; Judul Sub-Halaman</h5>
                            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                              Konfigurasi judul utama, teks pengantar, dan background banner atas untuk sub-halaman <span className="font-bold text-teal-500">"{selectedAboutPage}"</span>.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                          <div className="space-y-4">
                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Judul Utama Halaman</label>
                              <input 
                                type="text" 
                                value={currentTitle} 
                                onChange={e => {
                                  const currentTexts = localCV.webTexts || {};
                                  setLocalCV({
                                    ...localCV,
                                    webTexts: { ...currentTexts, [`${prefix}_title`]: e.target.value }
                                  });
                                }}
                                placeholder="Contoh: My Academic & Scientific Foundations..."
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-teal-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Teks Pengantar / Intro</label>
                              <textarea
                                rows={4}
                                value={currentIntro}
                                onChange={e => {
                                  const currentTexts = localCV.webTexts || {};
                                  setLocalCV({
                                    ...localCV,
                                    webTexts: { ...currentTexts, [`${prefix}_intro`]: e.target.value }
                                  });
                                }}
                                placeholder="Masukkan pengantar deskriptif yang menceritakan fokus Anda di sub-halaman ini secara umum..."
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-teal-500 font-sans leading-relaxed ${inputBgBorder}`}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Tautan Gambar Background Header (Cover)</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={currentHeaderBg} 
                                  onChange={e => {
                                    const currentTexts = localCV.webTexts || {};
                                    setLocalCV({
                                      ...localCV,
                                      webTexts: { ...currentTexts, [`${prefix}_header_bg`]: e.target.value }
                                    });
                                  }}
                                  placeholder="https://images.unsplash.com/photo-..."
                                  className={`flex-grow px-3 py-2 rounded-lg text-xs outline-none border focus:border-teal-500 ${inputBgBorder}`}
                                />
                                <label className="flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white border border-teal-550 rounded-lg px-3.5 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none shrink-0 transition-colors">
                                  <span>UPLOAD</span>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    id={`header-bg-upload-${selectedAboutPage}`}
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 2 * 1024 * 1024) {
                                          alert("Ukuran berkas gambar maksimal 2MB.");
                                          return;
                                        }
                                        try {
                                          const url = await uploadFileToStorage(file);
                                          const currentTexts = localCV.webTexts || {};
                                          setLocalCV({
                                            ...localCV,
                                            webTexts: { ...currentTexts, [`${prefix}_header_bg`]: url }
                                          });
                                          alert("✓ Gambar background header berhasil diunggah!");
                                        } catch (err: any) {
                                          console.error("Gagal mengunggah gambar header:", err);
                                          alert(`❌ Gagal mengunggah gambar header: ${err.message}`);
                                        }
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {currentHeaderBg ? (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">PENGATUR POSISI BANNER (DRAG / SLIDER)</span>
                                  <span className="text-[9px] text-teal-400 font-mono font-bold">AREA TERANG ADALAH TAMPILAN ASLI DI WEBSITE</span>
                                </div>

                                {/* Outer Container with height 280px (h-70 equivalent) to comfortably show image overflow */}
                                <div className="relative h-72 rounded-xl border border-slate-700/60 bg-slate-950 overflow-hidden flex items-center justify-center shadow-2xl">
                                  {/* Editor grid background */}
                                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

                                  {/* The Frame showing the actual Crop Area/Viewport. Height is exactly h-32 (128px) */}
                                  <div className="relative w-11/12 h-32 border-2 border-dashed border-teal-500/80 bg-transparent z-20 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                                    
                                    {/* Label for the visible area */}
                                    <div className="absolute top-1.5 left-2 bg-teal-500 text-slate-950 text-[8.5px] font-mono font-extrabold px-1.5 py-0.5 rounded tracking-wider shadow z-30">
                                      BANNER VIEWPORT (AKTIF DI WEBSITE)
                                    </div>

                                    {/* Shading/Mask overlay for cropped-out top portion */}
                                    <div className="absolute -top-[120px] left-[-2px] right-[-2px] h-[120px] bg-slate-950/80 border-b border-slate-700/50 flex items-end justify-center pb-2 pointer-events-none z-30">
                                      <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase font-bold">TERPOTONG (AREA ATAS)</span>
                                    </div>

                                    {/* Shading/Mask overlay for cropped-out bottom portion */}
                                    <div className="absolute -bottom-[120px] left-[-2px] right-[-2px] h-[120px] bg-slate-950/80 border-t border-slate-700/50 flex items-start justify-center pt-2 pointer-events-none z-30">
                                      <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase font-bold">TERPOTONG (AREA BAWAH)</span>
                                    </div>

                                    {/* The actual image container matching the viewport exactly, but allowing overflow-visible so the image is fully visible outside! */}
                                    <div className="absolute inset-0 overflow-visible z-10 pointer-events-none">
                                      <img 
                                        src={currentHeaderBg} 
                                        alt="Header Background Preview" 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover opacity-90 select-none pointer-events-none"
                                        style={{
                                          transform: `scale(${parseFloat(localCV.webTexts?.[`${prefix}_header_bg_scale`] || '1')}) translate(${parseInt(localCV.webTexts?.[`${prefix}_header_bg_x`] || '0', 10) / 5}%, ${parseInt(localCV.webTexts?.[`${prefix}_header_bg_y`] || '0', 10) / 5}%)`,
                                          transformOrigin: 'center center',
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentTexts = localCV.webTexts || {};
                                      setLocalCV({
                                        ...localCV,
                                        webTexts: { 
                                          ...currentTexts, 
                                          [`${prefix}_header_bg`]: "",
                                          [`${prefix}_header_bg_scale`]: "1",
                                          [`${prefix}_header_bg_x`]: "0",
                                          [`${prefix}_header_bg_y`]: "0"
                                        }
                                      });
                                    }}
                                    className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-500 text-white p-2 rounded-full shadow-lg transition-colors z-30"
                                    title="Hapus gambar"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Slider controls for the banner */}
                                <div className="space-y-3 p-3 rounded-lg border border-slate-700/10 bg-slate-500/5">
                                  {/* Scale/Zoom */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                                      <span>ZOOM / SKALA BANNER: {Math.round(parseFloat(localCV.webTexts?.[`${prefix}_header_bg_scale`] || '1') * 100)}%</span>
                                      <span className="text-teal-500 font-bold">Min 50% — Max 400%</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="0.5"
                                      max="4.0"
                                      step="0.01"
                                      value={parseFloat(localCV.webTexts?.[`${prefix}_header_bg_scale`] || '1')}
                                      onChange={e => {
                                        const currentTexts = localCV.webTexts || {};
                                        setLocalCV({
                                          ...localCV,
                                          webTexts: { ...currentTexts, [`${prefix}_header_bg_scale`]: e.target.value }
                                        });
                                      }}
                                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-teal-500 bg-slate-205 dark:bg-slate-800"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Translate X */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[9px] font-mono text-slate-500">
                                        <span>GESER HORIZONTAL (X): {Math.round(parseInt(localCV.webTexts?.[`${prefix}_header_bg_x`] || '0', 10) / 5)}%</span>
                                      </div>
                                      <input 
                                        type="range"
                                        min="-500"
                                        max="500"
                                        step="1"
                                        value={parseInt(localCV.webTexts?.[`${prefix}_header_bg_x`] || '0', 10)}
                                        onChange={e => {
                                          const currentTexts = localCV.webTexts || {};
                                          setLocalCV({
                                            ...localCV,
                                            webTexts: { ...currentTexts, [`${prefix}_header_bg_x`]: e.target.value }
                                          });
                                        }}
                                        className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-teal-500 bg-slate-205 dark:bg-slate-800"
                                      />
                                    </div>

                                    {/* Translate Y */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[9px] font-mono text-slate-500">
                                        <span>GESER VERTIKAL (Y): {Math.round(parseInt(localCV.webTexts?.[`${prefix}_header_bg_y`] || '0', 10) / 5)}%</span>
                                      </div>
                                      <input 
                                        type="range"
                                        min="-500"
                                        max="500"
                                        step="1"
                                        value={parseInt(localCV.webTexts?.[`${prefix}_header_bg_y`] || '0', 10)}
                                        onChange={e => {
                                          const currentTexts = localCV.webTexts || {};
                                          setLocalCV({
                                            ...localCV,
                                            webTexts: { ...currentTexts, [`${prefix}_header_bg_y`]: e.target.value }
                                          });
                                        }}
                                        className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-teal-500 bg-slate-205 dark:bg-slate-800"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`h-28 rounded-xl border border-dashed flex flex-col items-center justify-center p-4 text-center ${
                                theme === 'dark' ? 'border-slate-800 bg-slate-950/40' : 'border-slate-300 bg-slate-100/30'
                              }`}>
                                <Image className="w-6 h-6 text-slate-500 mb-1" />
                                <span className="text-[10px] text-slate-400 font-mono">Belum ada gambar background kustom.</span>
                                <span className="text-[9px] text-slate-550 font-sans mt-0.5">Menggunakan banner bawaan system.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 3. CUSTOM SLIDES & STORY SHEETS LIST */}
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-700/10">
                          <div className="flex items-center gap-2">
                            <Layers className={`w-5 h-5 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />
                            <div>
                              <h5 className={`font-bold text-xs uppercase tracking-wider ${textTitleColor}`}>2. Lembar Cerita &amp; Slide Kustom Halaman</h5>
                              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                                Susun cerita visual ber-layout dinamis. Jika dikosongkan, halaman akan menampilkan data terstruktur standard dari database Anda.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleAddSubPageSection}
                            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white border border-teal-550 rounded-lg px-4 py-1.8 text-[11px] font-bold tracking-wider cursor-pointer shadow-md transition-colors select-none"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>TAMBAH SLIDE</span>
                          </button>
                        </div>

                        {pageSections.length === 0 ? (
                          <div className={`p-8 text-center rounded-2xl border border-dashed ${
                            theme === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-pulse" />
                            <h6 className={`font-bold text-xs ${textTitleColor}`}>Belum ada slide kustom kustomisasi</h6>
                            <p className="text-[10px] text-slate-500 font-sans max-w-lg mx-auto mt-1 leading-relaxed">
                              Secara default, sub-halaman ini akan otomatis merender data terstruktur dari tab portfolio terkait (misalnya data {selectedAboutPage}). Menambahkan lembar/slide kustom di sini akan menggantikannya dengan visual interaktif penuh yang didesain secara naratif oleh Anda sendiri!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {pageSections.map((section: any, idx: number) => (
                              <div 
                                key={section.id}
                                className={`p-5 rounded-2xl border transition-all ${
                                  theme === 'dark' 
                                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/60' 
                                    : 'bg-white border-slate-250/80 shadow-xs hover:border-slate-300'
                                }`}
                              >
                                {/* Header of slide item */}
                                <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-700/10">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">
                                      Slide #{idx + 1}
                                    </span>
                                    <span className={`text-xs font-bold font-sans truncate max-w-xs ${textTitleColor}`}>
                                      {section.title || "Lembar Tanpa Judul"}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleMoveSubPageSection(section.id, 'up')}
                                      disabled={idx === 0}
                                      className={`p-1.5 rounded-md border ${
                                        idx === 0 
                                          ? 'opacity-40 cursor-not-allowed border-transparent text-slate-600' 
                                          : theme === 'dark' ? 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                      }`}
                                      title="Pindahkan ke atas"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMoveSubPageSection(section.id, 'down')}
                                      disabled={idx === pageSections.length - 1}
                                      className={`p-1.5 rounded-md border ${
                                        idx === pageSections.length - 1
                                          ? 'opacity-40 cursor-not-allowed border-transparent text-slate-600' 
                                          : theme === 'dark' ? 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                      }`}
                                      title="Pindahkan ke bawah"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm("Apakah Anda yakin ingin menghapus slide cerita ini?")) {
                                          handleRemoveSubPageSection(section.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-md bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/15 transition-colors"
                                      title="Hapus slide"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Form fields of slide */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div>
                                      <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Judul Slide</label>
                                      <input 
                                        type="text" 
                                        value={section.title || ""} 
                                        onChange={e => handleUpdateSubPageSection(section.id, 'title', e.target.value)}
                                        placeholder="Judul utama slide..."
                                        className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 ${inputBgBorder}`}
                                      />
                                    </div>

                                    {selectedAboutPage === 'education' && (
                                      <div>
                                        <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Hubungkan ke Data Pendidikan (Kredensial)</label>
                                        <select
                                          value={section.linkedEducationDegree || ""}
                                          onChange={e => handleUpdateSubPageSection(section.id, 'linkedEducationDegree', e.target.value)}
                                          className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 cursor-pointer ${inputBgBorder}`}
                                        >
                                          <option value="">-- Tanpa Kredensial Terhubung (Tulis Manual) --</option>
                                          {(localCV.education || []).map((edu: any, eIdx: number) => {
                                            const valueKey = `${edu.degree}|||${edu.institution}`;
                                            return (
                                              <option key={eIdx} value={valueKey}>
                                                {edu.institution} — {edu.degree} ({edu.period})
                                              </option>
                                            );
                                          })}
                                        </select>
                                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                          Jika dihubungkan, sistem akan otomatis mengambil nama institusi, gelar, dan deskripsi resmi dari tab Curriculum Vitae (Pendidikan).
                                        </p>
                                      </div>
                                    )}

                                    <div>
                                      <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Isi Narasi / Content (Markdown Didukung)</label>
                                      <textarea
                                        rows={6}
                                        value={section.content || ""}
                                        onChange={e => handleUpdateSubPageSection(section.id, 'content', e.target.value)}
                                        placeholder="Ketik keterangan naratif yang mendalam di sini..."
                                        className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 font-sans leading-relaxed ${inputBgBorder}`}
                                      />
                                    </div>

                                    {/* Live Slide Preview */}
                                    <div className="pt-2">
                                      <span className={`text-[9px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>
                                        👁️ Live Preview Slide
                                      </span>
                                      
                                      <div className={`w-full h-44 rounded-xl relative overflow-hidden border p-3 flex flex-col justify-between transition-all select-none shadow-sm ${
                                        theme === 'dark' 
                                          ? (section.bgColor === 'emerald' ? 'bg-gradient-to-br from-emerald-950/40 via-emerald-900/10 to-slate-900/30 border-emerald-500/10'
                                             : section.bgColor === 'indigo' ? 'bg-gradient-to-br from-indigo-950/40 via-indigo-900/10 to-slate-900/30 border-indigo-500/10'
                                             : section.bgColor === 'amber' ? 'bg-gradient-to-br from-amber-950/30 via-amber-900/10 to-slate-900/30 border-amber-500/10'
                                             : section.bgColor === 'rose' ? 'bg-gradient-to-br from-rose-950/30 via-rose-900/10 to-slate-900/30 border-rose-500/10'
                                             : section.bgColor === 'dark' ? 'bg-slate-950 border-slate-800'
                                             : section.bgColor === 'light' ? 'bg-white/[0.03] border-white/5'
                                             : 'bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-955/30 border-slate-800')
                                          : (section.bgColor === 'emerald' ? 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/20 border-emerald-100 shadow-xs'
                                             : section.bgColor === 'indigo' ? 'bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/20 border-indigo-100 shadow-xs'
                                             : section.bgColor === 'amber' ? 'bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 border-amber-100 shadow-xs'
                                             : section.bgColor === 'rose' ? 'bg-gradient-to-br from-rose-50/60 via-white to-rose-50/20 border-rose-100 shadow-xs'
                                             : section.bgColor === 'dark' ? 'bg-slate-900 border-slate-800 text-white shadow-md'
                                             : section.bgColor === 'light' ? 'bg-white border-slate-200 shadow-xs'
                                             : 'bg-gradient-to-b from-slate-50/70 via-white to-slate-100/40 border-slate-200')
                                      }`}>
                                        
                                        {/* Background Image if Full / Smooth */}
                                        {(() => {
                                          const orient = section.imageOrientation || 'landscape';
                                          const imgModel = section.imageModel || (
                                            (orient === 'background_full' || orient === 'background_edge')
                                              ? (orient === 'background_edge' ? 'bg_smooth' : 'bg_full')
                                              : 'normal'
                                          );
                                          const isBgMode = imgModel === 'bg_full' || imgModel === 'bg_smooth';
                                          
                                          if (!section.imageUrl || !isBgMode) return null;

                                          const bgOpt = section.bgColor || 'slate';
                                          const isDarkTheme = theme === 'dark';
                                          
                                          let overlayBgColor = '';
                                          if (isDarkTheme) {
                                            if (bgOpt === 'emerald') overlayBgColor = '6, 78, 59';
                                            else if (bgOpt === 'indigo') overlayBgColor = '49, 46, 129';
                                            else if (bgOpt === 'amber') overlayBgColor = '120, 53, 4';
                                            else if (bgOpt === 'rose') overlayBgColor = '136, 19, 55';
                                            else if (bgOpt === 'dark') overlayBgColor = '2, 6, 23';
                                            else overlayBgColor = '15, 23, 42';
                                          } else {
                                            if (bgOpt === 'emerald') overlayBgColor = '240, 253, 244';
                                            else if (bgOpt === 'indigo') overlayBgColor = '238, 242, 255';
                                            else if (bgOpt === 'amber') overlayBgColor = '254, 243, 199';
                                            else if (bgOpt === 'rose') overlayBgColor = '255, 241, 242';
                                            else if (bgOpt === 'dark') overlayBgColor = '15, 23, 42';
                                            else if (bgOpt === 'light') overlayBgColor = '255, 255, 255';
                                            else overlayBgColor = '241, 245, 249';
                                          }

                                          const maskWidthVal = section.maskWidth !== undefined ? section.maskWidth : 50;
                                          const finalOpacity = section.imageOpacity !== undefined
                                            ? section.imageOpacity
                                            : (imgModel === 'bg_smooth'
                                              ? (isDarkTheme ? 0.48 : 0.58)
                                              : (isDarkTheme ? 0.38 : 0.46));

                                          let overlayStyle: React.CSSProperties = {};
                                          const pLayout = section.paragraphLayout || 'left';
                                          const iLayout = pLayout === 'left' ? 'right' : 'left';

                                          if (imgModel === 'bg_smooth') {
                                            const fadeDir = section.imageFadeDirection || (iLayout === 'left' ? 'right' : 'left');
                                            
                                            if (fadeDir === 'right') {
                                              overlayStyle = {
                                                background: `linear-gradient(to right, 
                                                  rgba(${overlayBgColor}, 0.0) 0%, 
                                                  rgba(${overlayBgColor}, 0.2) ${Math.max(0, maskWidthVal - 25)}%, 
                                                  rgba(${overlayBgColor}, 0.8) ${Math.max(0, maskWidthVal - 5)}%, 
                                                  rgba(${overlayBgColor}, 1.0) ${maskWidthVal}%, 
                                                  rgba(${overlayBgColor}, 1.0) 100%
                                                )`
                                              };
                                            } else if (fadeDir === 'left') {
                                              overlayStyle = {
                                                background: `linear-gradient(to left, 
                                                  rgba(${overlayBgColor}, 0.0) 0%, 
                                                  rgba(${overlayBgColor}, 0.2) ${Math.max(0, maskWidthVal - 25)}%, 
                                                  rgba(${overlayBgColor}, 0.8) ${Math.max(0, maskWidthVal - 5)}%, 
                                                  rgba(${overlayBgColor}, 1.0) ${maskWidthVal}%, 
                                                  rgba(${overlayBgColor}, 1.0) 100%
                                                )`
                                              };
                                            } else if (fadeDir === 'top') {
                                              overlayStyle = {
                                                background: `linear-gradient(to top, 
                                                  rgba(${overlayBgColor}, 0.0) 0%, 
                                                  rgba(${overlayBgColor}, 0.2) ${Math.max(0, maskWidthVal - 25)}%, 
                                                  rgba(${overlayBgColor}, 0.8) ${Math.max(0, maskWidthVal - 5)}%, 
                                                  rgba(${overlayBgColor}, 1.0) ${maskWidthVal}%, 
                                                  rgba(${overlayBgColor}, 1.0) 100%
                                                )`
                                              };
                                            } else if (fadeDir === 'bottom') {
                                              overlayStyle = {
                                                background: `linear-gradient(to bottom, 
                                                  rgba(${overlayBgColor}, 0.0) 0%, 
                                                  rgba(${overlayBgColor}, 0.2) ${Math.max(0, maskWidthVal - 25)}%, 
                                                  rgba(${overlayBgColor}, 0.8) ${Math.max(0, maskWidthVal - 5)}%, 
                                                  rgba(${overlayBgColor}, 1.0) ${maskWidthVal}%, 
                                                  rgba(${overlayBgColor}, 1.0) 100%
                                                )`
                                              };
                                            } else if (fadeDir === 'oval') {
                                              const ovalCenter = iLayout === 'left' ? '30%' : iLayout === 'right' ? '70%' : '50%';
                                              const ovalW = section.ovalWidth !== undefined ? section.ovalWidth : 75;
                                              const ovalH = section.ovalHeight !== undefined ? section.ovalHeight : 40;
                                              const ovalP = (section.ovalPointiness !== undefined ? section.ovalPointiness : 50) / 100;
                                              const stop1 = Math.round(Math.max(0, maskWidthVal - (5 + (ovalP * 40))));
                                              const stop2 = Math.round(Math.max(stop1 + 2, maskWidthVal - (1 + (ovalP * 8))));
                                              overlayStyle = {
                                                background: `radial-gradient(ellipse ${ovalW}% ${ovalH}% at ${ovalCenter} 50%, 
                                                  rgba(${overlayBgColor}, 0.0) 0%, 
                                                  rgba(${overlayBgColor}, 0.2) ${stop1}%, 
                                                  rgba(${overlayBgColor}, 0.8) ${stop2}%, 
                                                  rgba(${overlayBgColor}, 1.0) ${maskWidthVal}%, 
                                                  rgba(${overlayBgColor}, 1.0) 100%
                                                )`
                                              };
                                            } else {
                                              overlayStyle = {
                                                background: `linear-gradient(to right, 
                                                  rgba(${overlayBgColor}, 0.0) 0%, 
                                                  rgba(${overlayBgColor}, 0.1) ${Math.max(0, maskWidthVal - 25)}%, 
                                                  rgba(${overlayBgColor}, 0.8) ${Math.max(0, maskWidthVal - 5)}%, 
                                                  rgba(${overlayBgColor}, 1.0) ${maskWidthVal}%, 
                                                  rgba(${overlayBgColor}, 0.8) ${Math.min(100, 100 - maskWidthVal + 5)}%, 
                                                  rgba(${overlayBgColor}, 0.1) ${Math.min(100, 100 - maskWidthVal + 25)}%, 
                                                  rgba(${overlayBgColor}, 0.0) 100%
                                                )`
                                              };
                                            }
                                          } else {
                                            if (section.imageFadeDirection === 'oval') {
                                              const ovalW = section.ovalWidth !== undefined ? section.ovalWidth : 75;
                                              const ovalH = section.ovalHeight !== undefined ? section.ovalHeight : 40;
                                              const ovalP = (section.ovalPointiness !== undefined ? section.ovalPointiness : 50) / 100;
                                              const stop1 = Math.round(Math.max(0, maskWidthVal - (5 + (ovalP * 40))));
                                              const stop2 = Math.round(Math.max(stop1 + 2, maskWidthVal - (1 + (ovalP * 8))));
                                              overlayStyle = {
                                                background: `radial-gradient(ellipse ${ovalW}% ${ovalH}% at ${iLayout === 'left' ? '30%' : '70%'} 50%, 
                                                  rgba(${overlayBgColor}, 0.0) 0%, 
                                                  rgba(${overlayBgColor}, 0.15) ${stop1}%, 
                                                  rgba(${overlayBgColor}, 0.6) ${stop2}%, 
                                                  rgba(${overlayBgColor}, 0.85) ${maskWidthVal}%, 
                                                  rgba(${overlayBgColor}, 0.85) 100%
                                                )`
                                              };
                                            } else if (section.imageFadeDirection === 'left') {
                                              overlayStyle = {
                                                background: `linear-gradient(to left, rgba(${overlayBgColor}, 0.1) 0%, rgba(${overlayBgColor}, 0.85) ${maskWidthVal}%)`
                                              };
                                            } else if (section.imageFadeDirection === 'right') {
                                              overlayStyle = {
                                                background: `linear-gradient(to right, rgba(${overlayBgColor}, 0.1) 0%, rgba(${overlayBgColor}, 0.85) ${maskWidthVal}%)`
                                              };
                                            } else if (section.imageFadeDirection === 'top') {
                                              overlayStyle = {
                                                background: `linear-gradient(to top, rgba(${overlayBgColor}, 0.1) 0%, rgba(${overlayBgColor}, 0.85) ${maskWidthVal}%)`
                                              };
                                            } else if (section.imageFadeDirection === 'bottom') {
                                              overlayStyle = {
                                                background: `linear-gradient(to bottom, rgba(${overlayBgColor}, 0.1) 0%, rgba(${overlayBgColor}, 0.85) ${maskWidthVal}%)`
                                              };
                                            } else {
                                              overlayStyle = {
                                                background: `linear-gradient(to bottom, 
                                                  rgba(${overlayBgColor}, 0.2) 0%, 
                                                  rgba(${overlayBgColor}, 0.05) 15%, 
                                                  rgba(${overlayBgColor}, 0.05) 85%, 
                                                  rgba(${overlayBgColor}, 0.2) 100%
                                                )`
                                              };
                                            }
                                          }

                                          return (
                                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                                              <img 
                                                src={section.imageUrl} 
                                                alt="" 
                                                className="w-full h-full object-cover select-none animate-fade-in"
                                                style={{
                                                  opacity: finalOpacity * 0.7,
                                                  transform: `scale(${(section.imageScale || 1) * 0.95}) translate(${(section.imageX || 0) * 0.25}px, ${(section.imageY || 0) * 0.25}px)`, maskImage: overlayStyle.background ? String(overlayStyle.background).replace(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/g, (m, op) => `rgba(0,0,0,${(1 - parseFloat(op)).toFixed(3)})`) : undefined, WebkitMaskImage: overlayStyle.background ? String(overlayStyle.background).replace(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/g, (m, op) => `rgba(0,0,0,${(1 - parseFloat(op)).toFixed(3)})`) : undefined
                                                }}
                                                referrerPolicy="no-referrer"
                                              />
                                              <div 
                                                className="absolute inset-0 transition-all duration-300"
                                                style={{}}
                                              />
                                            </div>
                                          );
                                        })()}

                                        <div className="relative z-10 w-full h-full flex flex-col justify-between">
                                          <div className="flex justify-between items-center">
                                            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                                              theme === 'dark' ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-teal-100 border-teal-200 text-teal-850'
                                            }`}>
                                              SLIDE PREVIEW
                                            </span>
                                            {section.linkedEducationDegree && (
                                              <span className="text-[7px] font-mono opacity-80 bg-slate-500/10 px-1 rounded text-slate-400">
                                                🎓 Kredensial Terhubung
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex-grow flex items-center gap-2 mt-2">
                                            <div className={`flex-1 flex flex-col justify-center min-w-0 ${
                                              section.paragraphLayout === 'right' ? 'order-2' : ''
                                            } ${
                                              section.textAlign === 'center' ? 'text-center' : section.textAlign === 'right' ? 'text-right' : 'text-left'
                                            }`}>
                                              <h4 className={`text-xs font-bold leading-tight truncate ${
                                                theme === 'dark' ? 'text-white' : 'text-slate-900'
                                              }`}>
                                                {section.title || "Untitled Slide"}
                                              </h4>
                                              <p className={`text-[8px] mt-1 leading-snug line-clamp-3 ${
                                                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                              }`}>
                                                {section.content || "Belum ada narasi..."}
                                              </p>
                                            </div>

                                            {section.imageUrl && section.imageModel !== 'bg_full' && section.imageModel !== 'bg_smooth' && (
                                              <div className={`w-20 h-14 rounded-lg border overflow-hidden relative shrink-0 ${
                                                section.paragraphLayout === 'right' ? 'order-1' : ''
                                              } ${
                                                theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                                              }`}>
                                                <img 
                                                  src={section.imageUrl} 
                                                  alt="" 
                                                  className="w-full h-full object-cover"
                                                  style={{
                                                    opacity: section.imageOpacity !== undefined ? section.imageOpacity : 1,
                                                    transform: `scale(${section.imageScale || 1}) translate(${(section.imageX || 0) * 0.15}px, ${(section.imageY || 0) * 0.15}px)`
                                                  }}
                                                  referrerPolicy="no-referrer"
                                                />
                                              </div>
                                            )}
                                          </div>

                                          <div className="mt-1 flex justify-between items-center text-[7px] font-mono text-slate-500">
                                            <span>BG: {section.bgColor || 'slate'}</span>
                                            <span>LAYOUT: {section.paragraphLayout || 'left'} | MODEL: {section.imageModel || 'normal'}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <div>
                                      <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Warna Background</label>
                                      <select
                                        value={section.bgColor || 'slate'}
                                        onChange={e => handleUpdateSubPageSection(section.id, 'bgColor', e.target.value)}
                                        className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 cursor-pointer ${inputBgBorder}`}
                                      >
                                        <option value="slate">Slate (Default Abu-abu)</option>
                                        <option value="emerald">Emerald (Hijau Premium)</option>
                                        <option value="indigo">Indigo (Biru Modern)</option>
                                        <option value="amber">Amber (Emas Hangat)</option>
                                        <option value="rose">Rose (Merah Muda Lembut)</option>
                                        <option value="dark">Sangat Gelap (Deep Obsidian)</option>
                                        <option value="light">Sangat Terang (Soft Ivory)</option>
                                      </select>
                                    </div>

                                    {/* Pengaturan Kustom Layout Sesuai Permintaan User */}
                                    <div className="border border-dashed p-3 rounded-xl space-y-3" style={{ borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0' }}>
                                      <p className="text-[10px] font-bold font-mono tracking-wider text-teal-400 uppercase">Penyelarasan &amp; Tata Letak Dinamis</p>
                                      
                                      <div>
                                        <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Tata Letak Paragraf</label>
                                        <select
                                          value={section.paragraphLayout || 'left'}
                                          onChange={e => handleUpdateSubPageSection(section.id, 'paragraphLayout', e.target.value)}
                                          className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 cursor-pointer ${inputBgBorder}`}
                                        >
                                          <option value="left">Kiri (Left Panel)</option>
                                          <option value="center">Tengah (Center Panel)</option>
                                          <option value="right">Kanan (Right Panel)</option>
                                        </select>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Pengaturan Teks (Align)</label>
                                          <select
                                            value={section.textAlign || 'left'}
                                            onChange={e => handleUpdateSubPageSection(section.id, 'textAlign', e.target.value)}
                                            className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 cursor-pointer ${inputBgBorder}`}
                                          >
                                            <option value="left">Rata Kiri</option>
                                            <option value="center">Rata Tengah</option>
                                            <option value="right">Rata Kanan</option>
                                            <option value="justify">Rata Kanan Kiri (Justify)</option>
                                          </select>
                                        </div>

                                        <div>
                                          <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Rasio / Orientasi Gambar</label>
                                          <select
                                            value={section.imageOrientation === 'portrait' ? 'portrait' : 'landscape'}
                                            onChange={e => handleUpdateSubPageSection(section.id, 'imageOrientation', e.target.value)}
                                            className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 cursor-pointer ${inputBgBorder}`}
                                          >
                                            <option value="landscape">Mendatar (Landscape)</option>
                                            <option value="portrait">Tegak (Portrait)</option>
                                          </select>
                                        </div>
                                      </div>

                                      <div>
                                        <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Model Gambar</label>
                                        <select
                                          value={section.imageModel || (
                                            (section.imageOrientation === 'background_full' || section.imageOrientation === 'background_edge')
                                              ? (section.imageOrientation === 'background_edge' ? 'bg_smooth' : 'bg_full')
                                              : 'normal'
                                          )}
                                          onChange={e => {
                                            const val = e.target.value;
                                            handleUpdateSubPageSection(section.id, 'imageModel', val);
                                            if (val === 'bg_smooth') {
                                              handleUpdateSubPageSection(section.id, 'imageOrientation', 'background_edge');
                                            } else if (val === 'bg_full') {
                                              handleUpdateSubPageSection(section.id, 'imageOrientation', 'background_full');
                                            } else {
                                              handleUpdateSubPageSection(section.id, 'imageOrientation', 'landscape');
                                            }
                                          }}
                                          className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 cursor-pointer ${inputBgBorder}`}
                                        >
                                          <option value="normal">Tampilan Biasa (di dalam kontainer kotak saja)</option>
                                          <option value="bg_smooth">Background Smooth (semakin ke tengah transparan)</option>
                                          <option value="bg_full">Background Full (menjadi background penuh 1 halaman)</option>
                                        </select>
                                      </div>

                                      {/* Manual Image Adjustments (Zoom, Position, Opacity, Fade) */}
                                      {section.imageUrl && (
                                        <div className="border-t border-slate-200/40 dark:border-slate-800/60 pt-3 mt-3 space-y-3">
                                          <p className="text-[10px] font-bold font-mono tracking-wider text-teal-500 uppercase flex items-center gap-1">
                                            <span>🔧 Atur Gambar Manual</span>
                                          </p>

                                          {/* Scale / Zoom Slider */}
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9px] font-mono">
                                              <div className="flex items-center gap-1">
                                                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>ZOOM / UKURAN:</span>
                                                <input
                                                  type="number"
                                                  min="10"
                                                  max="400"
                                                  value={Math.round((section.imageScale || 1) * 100)}
                                                  onChange={e => {
                                                    const val = parseFloat(e.target.value);
                                                    if (!isNaN(val)) {
                                                      handleUpdateSubPageSection(section.id, 'imageScale', Math.max(10, Math.min(400, val)) / 100);
                                                    }
                                                  }}
                                                  className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                                  }`}
                                                />
                                                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>%</span>
                                              </div>
                                              <button 
                                                type="button" 
                                                onClick={() => {
                                                  handleUpdateSubPageSection(section.id, 'imageScale', 1);
                                                  handleUpdateSubPageSection(section.id, 'imageX', 0);
                                                  handleUpdateSubPageSection(section.id, 'imageY', 0);
                                                }}
                                                className="text-teal-600 dark:text-teal-400 hover:underline font-bold"
                                              >
                                                RESET
                                              </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const current = section.imageScale || 1;
                                                  handleUpdateSubPageSection(section.id, 'imageScale', Math.max(0.1, Math.round((current - 0.05) * 100) / 100));
                                                }}
                                                className={`w-6 h-6 flex items-center justify-center rounded border text-xs font-bold ${
                                                  theme === 'dark' ? 'bg-slate-850 border-slate-750 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'
                                                }`}
                                              >
                                                −
                                              </button>
                                              <input
                                                type="range"
                                                min="0.1"
                                                max="4"
                                                step="0.01"
                                                value={section.imageScale || 1}
                                                onChange={e => handleUpdateSubPageSection(section.id, 'imageScale', parseFloat(e.target.value))}
                                                className="flex-grow accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const current = section.imageScale || 1;
                                                  handleUpdateSubPageSection(section.id, 'imageScale', Math.min(4, Math.round((current + 0.05) * 100) / 100));
                                                }}
                                                className={`w-6 h-6 flex items-center justify-center rounded border text-xs font-bold ${
                                                  theme === 'dark' ? 'bg-slate-850 border-slate-750 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'
                                                }`}
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>

                                          {/* X and Y Shift */}
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                              <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                                                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>GESER X (px):</span>
                                                <input
                                                  type="number"
                                                  min="-1000"
                                                  max="1000"
                                                  value={section.imageX || 0}
                                                  onChange={e => {
                                                    const val = parseInt(e.target.value, 10);
                                                    if (!isNaN(val)) {
                                                      handleUpdateSubPageSection(section.id, 'imageX', val);
                                                    }
                                                  }}
                                                  className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                                  }`}
                                                />
                                              </div>
                                              <input
                                                type="range"
                                                min="-400"
                                                max="400"
                                                step="1"
                                                value={section.imageX || 0}
                                                onChange={e => handleUpdateSubPageSection(section.id, 'imageX', parseInt(e.target.value))}
                                                className="w-full accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                                                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>GESER Y (px):</span>
                                                <input
                                                  type="number"
                                                  min="-1000"
                                                  max="1000"
                                                  value={section.imageY || 0}
                                                  onChange={e => {
                                                    const val = parseInt(e.target.value, 10);
                                                    if (!isNaN(val)) {
                                                      handleUpdateSubPageSection(section.id, 'imageY', val);
                                                    }
                                                  }}
                                                  className={`w-12 text-center rounded border px-1 py-0.5 text-[9px] font-bold font-mono ${
                                                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-slate-50 border-slate-200 text-teal-600'
                                                  }`}
                                                />
                                              </div>
                                              <input
                                                type="range"
                                                min="-400"
                                                max="400"
                                                step="1"
                                                value={section.imageY || 0}
                                                onChange={e => handleUpdateSubPageSection(section.id, 'imageY', parseInt(e.target.value))}
                                                className="w-full accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                              />
                                            </div>
                                          </div>

                                          {/* Opacity and Fade Direction / Width */}
                                          <div className="space-y-3">
                                            {(section.imageModel === 'bg_smooth' || section.imageModel === 'bg_full' || section.imageOrientation === 'background_edge' || section.imageOrientation === 'background_full') && (
                                              <div>
                                                <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Tipe & Arah Transparansi (Fade)</label>
                                                <select
                                                  value={section.imageFadeDirection || ''}
                                                  onChange={e => handleUpdateSubPageSection(section.id, 'imageFadeDirection', e.target.value || undefined)}
                                                  className={`w-full px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 cursor-pointer ${inputBgBorder}`}
                                                >
                                                  <option value="">Default (Sesuai Posisi Teks)</option>
                                                  <option value="oval">Oval (Tengah Terang, Pinggir Transparan)</option>
                                                  <option value="right">Kanan (Transparan Kanan / Gambar di Kiri)</option>
                                                  <option value="left">Kiri (Transparan Kiri / Gambar di Kanan)</option>
                                                  <option value="top">Atas (Transparan Atas / Gambar di Bawah)</option>
                                                  <option value="bottom">Bawah (Transparan Bawah / Gambar di Atas)</option>
                                                </select>
                                              </div>
                                            )}

                                             {section.imageFadeDirection === 'oval' && (
                                               <div className={`p-2.5 rounded-lg border space-y-3.5 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                                 <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-500 mb-1">Pengaturan Oval Kustom</div>
                                                 
                                                 {/* Row 1: Width & Height */}
                                                 <div className="grid grid-cols-2 gap-3">
                                                   <div className="space-y-1">
                                                     <div className="flex justify-between items-center">
                                                       <span className={`text-[9px] font-mono block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>LEBAR (KIRI-KANAN)</span>
                                                       <span className="text-[9px] font-mono font-bold text-teal-500">{section.ovalWidth !== undefined ? section.ovalWidth : 75}%</span>
                                                     </div>
                                                     <input
                                                       type="range"
                                                       min="10"
                                                       max="200"
                                                       step="5"
                                                       value={section.ovalWidth !== undefined ? section.ovalWidth : 75}
                                                       onChange={e => handleUpdateSubPageSection(section.id, 'ovalWidth', parseInt(e.target.value))}
                                                       className="w-full accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                                     />
                                                   </div>

                                                   <div className="space-y-1">
                                                     <div className="flex justify-between items-center">
                                                       <span className={`text-[9px] font-mono block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>TINGGI (ATAS-BAWAH)</span>
                                                       <span className="text-[9px] font-mono font-bold text-teal-500">{section.ovalHeight !== undefined ? section.ovalHeight : 40}%</span>
                                                     </div>
                                                     <input
                                                       type="range"
                                                       min="10"
                                                       max="200"
                                                       step="5"
                                                       value={section.ovalHeight !== undefined ? section.ovalHeight : 40}
                                                       onChange={e => handleUpdateSubPageSection(section.id, 'ovalHeight', parseInt(e.target.value))}
                                                       className="w-full accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                                     />
                                                   </div>
                                                 </div>

                                                 {/* Row 2: Pointiness */}
                                                 <div className="space-y-1">
                                                   <div className="flex justify-between items-center">
                                                     <span className={`text-[9px] font-mono block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>KELANCIPAN (SHARPNESS)</span>
                                                     <span className="text-[9px] font-mono font-bold text-teal-500">{section.ovalPointiness !== undefined ? section.ovalPointiness : 50}%</span>
                                                   </div>
                                                   <input
                                                     type="range"
                                                     min="0"
                                                     max="100"
                                                     step="5"
                                                     value={section.ovalPointiness !== undefined ? section.ovalPointiness : 50}
                                                     onChange={e => handleUpdateSubPageSection(section.id, 'ovalPointiness', parseInt(e.target.value))}
                                                     className="w-full accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                                   />
                                                   <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                                     <span>Bulat (0)</span>
                                                     <span>Default (50)</span>
                                                     <span>Lancip (100)</span>
                                                   </div>
                                                 </div>
                                               </div>
                                             )}

                                            <div className="grid grid-cols-2 gap-2">
                                              <div className="space-y-1">
                                                <span className={`text-[9px] font-mono block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>OPACITY (TRANSPARAN): {Math.round((section.imageOpacity !== undefined ? section.imageOpacity : ((section.imageModel === 'bg_smooth' || section.imageOrientation === 'background_edge') ? (theme === 'dark' ? 0.48 : 0.58) : (section.imageModel === 'bg_full' || section.imageOrientation === 'background_full') ? (theme === 'dark' ? 0.38 : 0.46) : 1)) * 100)}%</span>
                                                <input
                                                  type="range"
                                                  min="0"
                                                  max="1"
                                                  step="0.01"
                                                  value={section.imageOpacity !== undefined ? section.imageOpacity : ((section.imageModel === 'bg_smooth' || section.imageOrientation === 'background_edge') ? (theme === 'dark' ? 0.48 : 0.58) : (section.imageModel === 'bg_full' || section.imageOrientation === 'background_full') ? (theme === 'dark' ? 0.38 : 0.46) : 1)}
                                                  onChange={e => handleUpdateSubPageSection(section.id, 'imageOpacity', parseFloat(e.target.value))}
                                                  className="w-full accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                                />
                                              </div>

                                              {(section.imageModel === 'bg_smooth' || section.imageModel === 'bg_full' || section.imageOrientation === 'background_edge' || section.imageOrientation === 'background_full' || section.imageFadeDirection) && (
                                                <div className="space-y-1">
                                                  <span className={`text-[9px] font-mono block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>LEBAR FADE (KEDALAMAN): {section.maskWidth !== undefined ? section.maskWidth : 50}%</span>
                                                  <input
                                                    type="range"
                                                    min="5"
                                                    max="95"
                                                    step="1"
                                                    value={section.maskWidth !== undefined ? section.maskWidth : 50}
                                                    onChange={e => handleUpdateSubPageSection(section.id, 'maskWidth', parseInt(e.target.value))}
                                                    className="w-full accent-teal-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>



                                    <div>
                                      <label className={`text-[9px] font-mono font-bold block uppercase mb-1 ${textLabelColor}`}>Tautan Gambar Visual</label>
                                      <div className="flex gap-2">
                                        <input 
                                          type="text" 
                                          value={section.imageUrl || ""} 
                                          onChange={e => handleUpdateSubPageSection(section.id, 'imageUrl', e.target.value)}
                                          placeholder="Tautan gambar visual pendukung..."
                                          className={`flex-grow px-2.5 py-1.8 rounded-lg text-xs outline-none border focus:border-teal-500 ${inputBgBorder}`}
                                        />
                                        <label className="flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white border border-teal-550 rounded-lg px-3 py-1 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none shrink-0 transition-colors">
                                          <span>UPLOAD</span>
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            id={`slide-image-upload-${section.id}`}
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                  alert("Ukuran berkas gambar maksimal 2MB.");
                                                  return;
                                                }
                                                try {
                                                  const url = await uploadFileToStorage(file);
                                                  handleUpdateSubPageSection(section.id, 'imageUrl', url);
                                                  alert("✓ Gambar berhasil diunggah!");
                                                } catch (err: any) {
                                                  console.error("Gagal mengunggah gambar slide:", err);
                                                  alert(`❌ Gagal mengunggah gambar: ${err.message}`);
                                                }
                                              }
                                            }}
                                            className="hidden"
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    {section.imageUrl ? (
                                      <div className="flex gap-4 items-center pt-2">
                                        <div className="w-20 h-12 rounded-lg overflow-hidden border border-slate-700/20 shrink-0 bg-slate-900">
                                          <img 
                                            src={section.imageUrl} 
                                            alt="preview" 
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                              (e.target as any).style.display = 'none';
                                            }}
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[10px] text-teal-500 font-bold font-mono">Tautan Gambar Valid</span>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateSubPageSection(section.id, 'imageUrl', '')}
                                            className="text-[9px] text-red-500 hover:underline font-bold text-left mt-0.5"
                                          >
                                            Hapus Gambar
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={`p-2.5 rounded-lg border border-dashed text-center text-[10px] text-slate-500 ${
                                        theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-slate-100/20'
                                      }`}>
                                        Slide ini tidak memiliki aset gambar visual.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {activeTab === 'personality' && (
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                      <div className="flex items-center gap-2">
                        <Heart className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Personality &amp; Values</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPersonality}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> TAMBAH ITEM
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(localCV.personality || []).map((pers, idx) => (
                        <div key={pers.id || idx} className={`relative p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <button
                            type="button"
                            onClick={() => handleRemovePersonality(idx)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className={`text-[10px] font-bold font-mono uppercase w-fit px-2 py-0.5 rounded ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-705 bg-emerald-50/70 border border-emerald-200/50'}`}>
                            Value Item #{idx + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Judul / Nilai Utama</label>
                              <input 
                                type="text" 
                                value={pers.title} 
                                onChange={e => handleUpdatePersonality(idx, 'title', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Icon (Lucide)</label>
                              <input 
                                type="text" 
                                value={pers.icon} 
                                onChange={e => handleUpdatePersonality(idx, 'icon', e.target.value)}
                                placeholder="Cpu, Shield, Smile, Sparkles, dll."
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none font-mono border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Deskripsi Lengkap</label>
                            <textarea 
                              rows={3}
                              value={pers.description} 
                              onChange={e => handleUpdatePersonality(idx, 'description', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'hobbies' && (
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                      <div className="flex items-center gap-2">
                        <Compass className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Hobbies &amp; Interests</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddHobby}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> TAMBAH ITEM
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(localCV.hobbies || []).map((hobby, idx) => (
                        <div key={hobby.id || idx} className={`relative p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <button
                            type="button"
                            onClick={() => handleRemoveHobby(idx)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className={`text-[10px] font-bold font-mono uppercase w-fit px-2 py-0.5 rounded ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-705 bg-emerald-50/70 border border-emerald-200/50'}`}>
                            Hobby Item #{idx + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Aktivitas / Minat</label>
                              <input 
                                type="text" 
                                value={hobby.title} 
                                onChange={e => handleUpdateHobby(idx, 'title', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Icon (Lucide)</label>
                              <input 
                                type="text" 
                                value={hobby.icon} 
                                onChange={e => handleUpdateHobby(idx, 'icon', e.target.value)}
                                placeholder="Heart, Compass, PenTool, dll."
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none font-mono border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Deskripsi Aktivitas</label>
                            <textarea 
                              rows={3}
                              value={hobby.description} 
                              onChange={e => handleUpdateHobby(idx, 'description', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'career_goals' && (
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                      <div className="flex items-center gap-2">
                        <Target className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Career Goals Roadmap</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCareerGoal}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> TAMBAH GOAL
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(localCV.careerGoals || []).map((goal, idx) => (
                        <div key={goal.id || idx} className={`relative p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                          <button
                            type="button"
                            onClick={() => handleRemoveCareerGoal(idx)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className={`text-[10px] font-bold font-mono uppercase w-fit px-2 py-0.5 rounded ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-705 bg-emerald-50/70 border border-emerald-200/50'}`}>
                            Milestone Goal #{idx + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Tahun Target (Misal: 2027)</label>
                              <input 
                                type="text" 
                                value={goal.target_year} 
                                onChange={e => handleUpdateCareerGoal(idx, 'target_year', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs outline-none font-mono border focus:border-emerald-500 ${inputBgBorder}`}
                              />
                            </div>

                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="sm:col-span-2">
                                <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Judul Milestone</label>
                                <input 
                                  type="text" 
                                  value={goal.title} 
                                  onChange={e => handleUpdateCareerGoal(idx, 'title', e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                                />
                              </div>

                              <div>
                                <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Icon (Lucide)</label>
                                <input 
                                  type="text" 
                                  value={goal.icon} 
                                  onChange={e => handleUpdateCareerGoal(idx, 'icon', e.target.value)}
                                  placeholder="Award, Target, Sparkles, dll."
                                  className={`w-full px-3 py-2 rounded-lg text-xs outline-none font-mono border focus:border-emerald-500 ${inputBgBorder}`}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Deskripsi Pencapaian / Target</label>
                            <textarea 
                              rows={3}
                              value={goal.description} 
                              onChange={e => handleUpdateCareerGoal(idx, 'description', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}




                {activeTab === 'methodology' && (
                  <div className="space-y-6">
                    <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${dividerColor}`}>
                      <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                      <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Core Methodology &amp; Filosofi Kerja</h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>DOKTRIN / JUDUL FILOSOFI</label>
                        <input 
                          type="text" 
                          value={localCV.methodologyTitle || ''} 
                          onChange={e => updateGeneralField('methodologyTitle', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg text-xs outline-none border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>

                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>PERNYATAAN FILOSOFIS UTAMA</label>
                        <textarea 
                          value={localCV.methodologyText || ''} 
                          onChange={e => updateGeneralField('methodologyText', e.target.value)}
                          rows={5}
                          className={`w-full px-3 py-2 rounded-lg text-xs outline-none leading-relaxed italic border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'layout' && (() => {
                  const DEFAULT_LAYOUT_SETTINGS = {
                    themeColor: 'emerald',
                    fontSize: 'standard',
                    spacing: 'standard',
                    layoutStyle: 'left-sidebar',
                    fontFamily: 'sans',
                    sectionOrder: ['arsenal', 'education', 'experience', 'methodology']
                  };

                  const currentSettings = (localCV.layoutSettings as any) || { ...DEFAULT_LAYOUT_SETTINGS };
                  const sectionOrder = currentSettings.sectionOrder && currentSettings.sectionOrder.length > 0
                    ? currentSettings.sectionOrder
                    : ['arsenal', 'education', 'experience', 'methodology'];

                  const updateLayoutSetting = (key: string, value: any) => {
                    const nextSettings = {
                      ...DEFAULT_LAYOUT_SETTINGS,
                      ...((localCV.layoutSettings as any) || {}),
                      [key]: value
                    };
                    setLocalCV(prev => ({
                      ...prev,
                      layoutSettings: nextSettings as any
                    }));
                  };

                  const moveSectionAdmin = (index: number, direction: 'up' | 'down') => {
                    const list = [...sectionOrder];
                    const targetIdx = direction === 'up' ? index - 1 : index + 1;
                    if (targetIdx >= 0 && targetIdx < list.length) {
                      const [moved] = list.splice(index, 1);
                      list.splice(targetIdx, 0, moved);
                      updateLayoutSetting('sectionOrder', list);
                    }
                  };

                  return (
                    <div className="space-y-8 select-none">
                      <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${
                        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                      }`}>
                        <Palette className="w-5 h-5 text-emerald-400" />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>Desain &amp; Tata Letak Dokumen CV A4</h4>
                      </div>

                      <p className="text-xs text-slate-400 leading-normal mb-4">
                        Modifikasi estetika dokumen CV di bawah ini. Semua konfigurasi tersimpan secara realtime saat Anda menyimpan draft global.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="space-y-6">
                          {/* Accent Color selection */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                              Warna Aksen Highlight
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                              {(['emerald', 'blue', 'slate', 'indigo', 'rose', 'amber'] as const).map((color) => {
                                const bgHexClass = {
                                  emerald: 'bg-emerald-600 ring-emerald-400',
                                  blue: 'bg-blue-600 ring-blue-400',
                                  slate: 'bg-slate-600 ring-slate-400',
                                  indigo: 'bg-indigo-600 ring-indigo-400',
                                  rose: 'bg-rose-600 ring-rose-400',
                                  amber: 'bg-amber-600 ring-amber-400',
                                }[color];

                                return (
                                  <button
                                    type="button"
                                    key={color}
                                    onClick={() => updateLayoutSetting('themeColor', color)}
                                    title={`Warna ${color}`}
                                    className={`w-8 h-8 rounded-full border border-slate-750 cursor-pointer relative hover:scale-105 transition-all ${bgHexClass} ${
                                      currentSettings.themeColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-950' : ''
                                    }`}
                                  >
                                    {currentSettings.themeColor === color && (
                                      <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Font Choice */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                              Tipe Pasangan Font
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'sans', name: 'Inter Sans', desc: 'Modern' },
                                { id: 'serif', name: 'Playfair', desc: 'Klasik' },
                                { id: 'mono', name: 'JetBrains', desc: 'Coders' }
                              ].map((f) => (
                                <button
                                  type="button"
                                  key={f.id}
                                  onClick={() => updateLayoutSetting('fontFamily', f.id)}
                                  className={`py-2.5 px-2 border rounded-lg cursor-pointer transition-all ${
                                    currentSettings.fontFamily === f.id
                                      ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow'
                                      : theme === 'dark'
                                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                                  }`}
                                >
                                  <p className="text-[10px] uppercase truncate">{f.name}</p>
                                  <span className="text-[8px] opacity-65 font-mono block">{f.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Font Sizes */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                              Ukuran Huruf (Font Size)
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {(['compact', 'standard', 'comfortable'] as const).map((sz) => (
                                <button
                                  type="button"
                                  key={sz}
                                  onClick={() => updateLayoutSetting('fontSize', sz)}
                                  className={`py-2 text-center border rounded-lg text-[9px] cursor-pointer tracking-wider font-bold uppercase transition-all ${
                                    currentSettings.fontSize === sz
                                      ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                                      : theme === 'dark'
                                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                                  }`}
                                >
                                  {sz === 'compact' ? 'Kecil' : sz === 'standard' ? 'Sempurna' : 'Besar'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Spacing & density */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                              Kepadatan Margins &amp; Isi
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {(['tight', 'standard', 'spacious'] as const).map((sp) => (
                                <button
                                  type="button"
                                  key={sp}
                                  onClick={() => updateLayoutSetting('spacing', sp)}
                                  className={`py-2 text-center border rounded-lg text-[9px] cursor-pointer tracking-wider font-bold uppercase transition-all ${
                                    currentSettings.spacing === sp
                                      ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                                      : theme === 'dark'
                                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-905'
                                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                                  }`}
                                >
                                  {sp === 'tight' ? 'Padat' : sp === 'standard' ? 'Standard' : 'Renggang'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                          {/* Layout Style Choice */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                              Tata Letak Kolom
                            </label>
                            <div className="space-y-2">
                              {[
                                { id: 'left-sidebar', name: 'Sidebar di Kiri', desc: 'Standard formal' },
                                { id: 'right-sidebar', name: 'Sidebar di Kanan', desc: 'Modern alternatif' },
                                { id: 'single-column', name: 'Satu Kolom Penuh', desc: 'Sangat rapi & linear' }
                              ].map((l) => (
                                <button
                                  type="button"
                                  key={l.id}
                                  onClick={() => updateLayoutSetting('layoutStyle', l.id)}
                                  className={`w-full py-2.5 px-3 border rounded-lg cursor-pointer flex items-center justify-between text-left transition-all ${
                                    currentSettings.layoutStyle === l.id
                                      ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow'
                                      : theme === 'dark'
                                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-955 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Layout className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                                    <span className="text-[10px] font-sans leading-none block">{l.name}</span>
                                  </div>
                                  <span className="text-[8px] opacity-65 font-mono text-right">{l.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Section Sorter list */}
                          <div className={`space-y-2 p-4 rounded-lg border ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                                Urutkan Deretan Bagian
                              </label>
                              <Info className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <p className="text-[9px] text-slate-500 leading-normal mb-2">Gunakan panah untuk memindah bagian ke atas atau bawah.</p>
                            <div className="space-y-1.5 mt-2">
                              {sectionOrder.map((secId, idx) => {
                                const secLabel = {
                                  arsenal: 'Skills & Tech Arsenal',
                                  education: 'Academic Background',
                                  experience: 'Career History',
                                  methodology: 'Core Philosophy'
                                }[secId] || secId;

                                return (
                                  <div 
                                    key={secId}
                                    className={`flex items-center justify-between text-[10px] py-2 px-3 rounded-md border font-mono tracking-tight ${
                                      theme === 'dark'
                                        ? 'bg-slate-900 border-slate-800 text-slate-300'
                                        : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                                    }`}
                                  >
                                    <span className="truncate max-w-[170px]">{idx + 1}. {secLabel}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => moveSectionAdmin(idx, 'up')}
                                        className={`p-1 rounded disabled:opacity-35 cursor-pointer ${
                                          theme === 'dark' ? 'hover:bg-slate-705 bg-slate-800 text-slate-200' : 'hover:bg-slate-200 bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === sectionOrder.length - 1}
                                        onClick={() => moveSectionAdmin(idx, 'down')}
                                        className={`p-1 rounded disabled:opacity-35 cursor-pointer ${
                                          theme === 'dark' ? 'hover:bg-slate-705 bg-slate-800 text-slate-200' : 'hover:bg-slate-200 bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Setelan Header Kustom */}
                          <div className={`space-y-4 p-4 rounded-lg border ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                              Konfigurasi Tata Letak Header CV
                            </label>
                            
                            {/* Posisi Foto */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] text-slate-400 block font-mono">1. POSISI FOTO</span>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: 'left', name: 'Foto di Kiri' },
                                  { id: 'top', name: 'Foto di Atas' }
                                ].map((pos) => (
                                  <button
                                    type="button"
                                    key={pos.id}
                                    onClick={() => updateLayoutSetting('headerPhotoPosition', pos.id)}
                                    className={`py-1.5 text-center border rounded-lg text-[9px] cursor-pointer tracking-wider font-bold uppercase transition-all ${
                                      (currentSettings.headerPhotoPosition || 'left') === pos.id
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                                        : theme === 'dark'
                                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-55'
                                    }`}
                                  >
                                    {pos.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Perataan Teks */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] text-slate-400 block font-mono">2. PERATAAN DOKUMEN</span>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: 'left', name: 'Rata Kiri' },
                                  { id: 'center', name: 'Tengah (Centered)' }
                                ].map((align) => (
                                  <button
                                    type="button"
                                    key={align.id}
                                    onClick={() => updateLayoutSetting('headerAlignment', align.id)}
                                    className={`py-1.5 text-center border rounded-lg text-[9px] cursor-pointer tracking-wider font-bold uppercase transition-all ${
                                      (currentSettings.headerAlignment || 'left') === align.id
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                                        : theme === 'dark'
                                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-55'
                                    }`}
                                  >
                                    {align.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Kontak & Medsos */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] text-slate-400 block font-mono">3. POSISI KONTAK / MEDSOS</span>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: 'bottom', name: 'Di Bawah Gelar' },
                                  { id: 'right', name: 'Di Sebelah Kanan' }
                                ].map((cPos) => (
                                  <button
                                    type="button"
                                    key={cPos.id}
                                    onClick={() => updateLayoutSetting('headerContactPosition', cPos.id)}
                                    className={`py-1.5 text-center border rounded-lg text-[9px] cursor-pointer tracking-wider font-bold uppercase transition-all ${
                                      (currentSettings.headerContactPosition || 'bottom') === cPos.id
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                                        : theme === 'dark'
                                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-955 hover:bg-slate-55'
                                    }`}
                                  >
                                    {cPos.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* NEW: CUSTOM CONTACTS & CUSTOM SOCIAL CONTROLS */}
                      <div className={`border-t pt-8 mt-8 space-y-8 ${
                        theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'
                      }`}>
                        
                        {/* Section 1: Header Contacts Choice (Max 3) */}
                        <div className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className={`flex items-center gap-2 border-b pb-3 ${
                            theme === 'dark' ? 'border-slate-800' : 'border-slate-205'
                          }`}>
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                            <h4 className={`font-bold text-sm uppercase tracking-wider ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              Pilih Kontak di Bagian Atas CV (Header) (Maksimal 3)
                            </h4>
                          </div>
                          
                          <p className="text-xs text-slate-400 leading-normal">
                            Centang hingga maksimal 3 informasi kontak untuk ditampilkan secara horizontal di bawah nama dan title Anda di lembar CV.
                          </p>

                          {(() => {
                            const headerContacts = localCV.headerContacts || ['location', 'email', 'linkedin'];
                            
                            // Compile dynamic list of options
                            const options = [
                              { id: 'location', name: 'Lokasi Domisili', value: localCV.location },
                              { id: 'email', name: 'Email Informasi', value: localCV.email },
                              ...(localCV.customSocials || []).map(s => ({
                                id: s.id,
                                name: s.name || 'Medsos Baru',
                                value: s.value
                              }))
                            ];

                            const handleToggleHeader = (id: string) => {
                              let nextList = [...headerContacts];
                              const isAdding = !nextList.includes(id);
                              if (nextList.includes(id)) {
                                nextList = nextList.filter(item => item !== id);
                              } else {
                                if (nextList.length >= 3) {
                                  alert("Maksimal informasi terpilih untuk kepala (header) CV adalah 3.");
                                  return;
                                }
                                nextList.push(id);
                              }
                              setLocalCV(prev => {
                                const updatedSocials = (prev.customSocials || []).map(s => {
                                  if (s.id === id) {
                                    return { ...s, showOnCvHeader: isAdding };
                                  }
                                  return s;
                                });
                                return {
                                  ...prev,
                                  headerContacts: nextList,
                                  customSocials: updatedSocials
                                };
                              });
                            };

                            return (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  {options.map((opt) => {
                                    const isChecked = headerContacts.includes(opt.id);
                                    const isDisabled = !isChecked && headerContacts.length >= 3;
                                    const hasValue = !!opt.value;

                                    return (
                                      <button
                                        type="button"
                                        key={opt.id}
                                        disabled={!hasValue}
                                        onClick={() => handleToggleHeader(opt.id)}
                                        className={`p-3 border rounded-xl flex items-center justify-between text-left transition-all ${
                                          !hasValue 
                                            ? theme === 'dark'
                                              ? 'bg-slate-900/30 border-slate-900/50 opacity-40 cursor-not-allowed'
                                              : 'bg-slate-100/50 border-slate-200/50 opacity-40 cursor-not-allowed'
                                            : isChecked
                                              ? theme === 'dark'
                                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 cursor-pointer'
                                                : 'bg-emerald-50 border-emerald-500 text-emerald-700 cursor-pointer'
                                              : isDisabled
                                                ? theme === 'dark'
                                                  ? 'bg-slate-950 border-slate-900 text-slate-600 opacity-60'
                                                  : 'bg-slate-150 border-slate-200 text-slate-400 opacity-60'
                                                : theme === 'dark'
                                                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 cursor-pointer'
                                                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                            isChecked 
                                              ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                                              : theme === 'dark' ? 'border-slate-650' : 'border-slate-300'
                                          }`}>
                                            {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                                          </div>
                                          <div className="truncate">
                                            <p className={`text-[11px] font-bold block truncate leading-none mb-1 ${
                                              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                                            }`}>{opt.name}</p>
                                            <span className="text-[9px] text-slate-500 block truncate font-mono">
                                              {hasValue ? opt.value : '(Belum Diisi)'}
                                            </span>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                                {headerContacts.length >= 3 && (
                                  <p className="text-[10px] text-amber-500 font-mono">
                                    ⚠️ Batas maksimal 3 kontak aktif telah tercapai. Hapus pilihan lain terlebih dahulu untuk memilih yang baru.
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Section 2: Footer Socials Choice */}
                        <div className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className={`flex items-center gap-2 border-b pb-3 ${
                            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                          }`}>
                            <Share2 className="w-5 h-5 text-emerald-400" />
                            <h4 className={`font-bold text-sm uppercase tracking-wider ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              Pilih Sosmed di Bagian Bawah CV (Footer)
                            </h4>
                          </div>
                          
                          <p className={`text-xs leading-normal ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            Centang media sosial atau tautan eksternal yang ingin ditampilkan di bagian kaki (footer) lembar CV.
                          </p>

                          {(() => {
                            const footerSocials = localCV.footerSocials || ['linkedin', 'instagram', 'whatsapp'];
                            
                            const options = [
                              ...(localCV.customSocials || []).map(s => ({
                                id: s.id,
                                name: s.name || 'Medsos Baru',
                                value: s.value
                              }))
                            ];

                            const handleToggleFooter = (id: string) => {
                              let nextList = [...footerSocials];
                              const isAdding = !nextList.includes(id);
                              if (nextList.includes(id)) {
                                nextList = nextList.filter(item => item !== id);
                              } else {
                                nextList.push(id);
                              }
                              setLocalCV(prev => {
                                const updatedSocials = (prev.customSocials || []).map(s => {
                                  if (s.id === id) {
                                    return { ...s, showOnCvFooter: isAdding };
                                  }
                                  return s;
                                });
                                return {
                                  ...prev,
                                  footerSocials: nextList,
                                  customSocials: updatedSocials
                                };
                              });
                            };

                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {options.map((opt) => {
                                  const isChecked = footerSocials.includes(opt.id);
                                  const hasValue = !!opt.value;

                                  return (
                                    <button
                                      type="button"
                                      key={opt.id}
                                      disabled={!hasValue}
                                      onClick={() => handleToggleFooter(opt.id)}
                                      className={`p-3 border rounded-xl flex items-center justify-between text-left transition-all ${
                                        !hasValue
                                          ? theme === 'dark'
                                            ? 'bg-slate-900/30 border-slate-900/50 opacity-40 cursor-not-allowed'
                                            : 'bg-slate-100/50 border-slate-200/50 opacity-40 cursor-not-allowed'
                                          : isChecked
                                            ? theme === 'dark'
                                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 cursor-pointer'
                                              : 'bg-emerald-50 border-emerald-500 text-emerald-700 cursor-pointer'
                                            : theme === 'dark'
                                              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-855 cursor-pointer'
                                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                          isChecked 
                                            ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                                            : theme === 'dark' ? 'border-slate-650' : 'border-slate-300'
                                        }`}>
                                          {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                                        </div>
                                        <div className="truncate">
                                          <p className={`text-[11px] font-bold block truncate leading-none mb-1 ${
                                            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                                          }`}>{opt.name}</p>
                                          <span className="text-[9px] text-slate-500 block truncate font-mono">
                                            {hasValue ? opt.value : '(Belum Diisi)'}
                                          </span>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>

                      </div>
                    </div>
                  );
                })()}

              {activeTab === 'socials' && (() => {
                const customSocials = localCV.customSocials || [];

                const updateCustomSocial = (id: string, key: string, val: any) => {
                  const updated = customSocials.map(soc => {
                      if (soc.id === id) {
                          return { ...soc, [key]: val };
                      }
                      return soc;
                  });
                  setLocalCV(prev => ({
                      ...prev,
                      customSocials: updated
                  }));
                };

                const deleteCustomSocial = (id: string) => {
                  const updated = customSocials.filter(soc => soc.id !== id);
                  const headerContacts = (localCV.headerContacts || []).filter(item => item !== id);
                  const footerSocials = (localCV.footerSocials || []).filter(item => item !== id);
                  
                  setLocalCV(prev => ({
                    ...prev,
                    customSocials: updated,
                    headerContacts,
                    footerSocials
                  }));
                };

                return (
                  <div className="space-y-6">
                    <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${dividerColor}`}>
                      <Share2 className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-650'}`} />
                      <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Kelola Media Sosial Kustom (Landing &amp; CV)</h4>
                    </div>

                    <p className="text-xs text-slate-400 font-mono select-none">
                      Konfigurasi dan kelola berbagai platform media sosial eksternal Anda. Anda dapat menentukan username, link, dan di halaman mana saja sosial media ini ditampilkan (Landing Web atau CV formal).
                    </p>

                    <div className={`p-6 rounded-2xl border space-y-6 shadow-sm ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`flex justify-between items-center border-b pb-3 ${
                        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <PlusCircle className="w-5 h-5 text-emerald-400" />
                          <h4 className={`font-bold text-xs uppercase tracking-wider ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            Daftar Media Sosial Anda ({customSocials.length})
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newSocial = {
                              id: 'social-' + Date.now(),
                              name: 'LinkedIn',
                              value: '',
                              usernameOrUrl: '',
                              showOnWeb: true,
                              showOnCvHeader: false,
                              showOnCvFooter: true
                            };
                            setLocalCV(prev => ({
                              ...prev,
                              customSocials: [...(prev.customSocials || []), newSocial]
                            }));
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-103 text-[10px] font-mono tracking-wider font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
                        >
                          <Plus className="w-3 h-3" />
                          <span>TAMBAH MEDSOS</span>
                        </button>
                      </div>

                      <p className={`text-xs leading-normal ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Pilih dari daftar platform media sosial populer yang telah disediakan dengan logo resmi rapi (LinkedIn, Instagram, WhatsApp, GitHub, dsb). Tidak perlu mengunggah gambar logo.
                      </p>

                      {customSocials.length === 0 ? (
                        <div className={`border border-dashed p-8 rounded-xl text-center space-y-2 ${
                          theme === 'dark' ? 'border-slate-800 bg-slate-900/10' : 'border-slate-300 bg-slate-100/50'
                        }`}>
                          <p className={`text-xs font-mono ${
                            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                          }`}>Belum ada media sosial kustom tambahan.</p>
                          <button
                            type="button"
                            onClick={() => {
                              const newSocial = {
                                id: 'social-' + Date.now(),
                                name: 'Facebook',
                                value: '',
                                usernameOrUrl: '',
                                showOnWeb: true,
                                showOnCvHeader: false,
                                showOnCvFooter: true
                              };
                              setLocalCV(prev => ({
                                ...prev,
                                customSocials: [newSocial]
                              }));
                            }}
                            className="px-3.5 py-1.5 text-xs text-emerald-400 border border-emerald-800 hover:border-emerald-600 rounded-lg hover:bg-emerald-950/20 transition-all font-bold cursor-pointer"
                          >
                            + Buat Pertama Kali
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {customSocials.map((social, index) => (
                            <div 
                              key={social.id}
                              className={`p-4 rounded-xl space-y-4 border relative ${
                                theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                              }`}
                            >
                              <div className={`flex justify-between items-center px-3 py-1.5 rounded-lg border ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'
                              }`}>
                                <span className={`text-[9px] font-mono font-bold ${
                                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                                }`}>
                                  # {index + 1} - MEDIA SOSIAL KUSTOM
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => deleteCustomSocial(social.id)}
                                  className="p-1 rounded bg-red-95/40 border border-red-900 hover:bg-red-900 hover:text-white text-red-400 transition-all cursor-pointer"
                                  title="Hapus Media Sosial ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className={`md:col-span-3 space-y-2 flex flex-col items-center justify-center p-3 border rounded-xl text-center ${
                                  theme === 'dark' ? 'border-slate-850 bg-slate-950/40' : 'border-slate-200 bg-slate-50/20'
                                }`}>
                                  <label className={`text-[9px] font-mono font-bold block uppercase ${
                                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                  }`}>
                                    Logo / Ikon Resmi
                                  </label>
                                  
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow transition-transform hover:scale-105 ${
                                    theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200'
                                  }`}>
                                    <SocialIcon platform={social.name || 'Facebook'} size={28} useBrandColor={true} />
                                  </div>
                                  
                                  <div className={`text-[10px] font-mono font-bold mt-1 px-2 py-0.5 rounded border ${
                                    theme === 'dark' ? 'text-emerald-400 bg-slate-950/80 border-slate-800/80' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                  }`}>
                                    {social.name || 'Facebook'}
                                  </div>
                                </div>

                                <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className={`text-[10px] font-mono font-bold block uppercase ${
                                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                      Pilih Platform Medsos
                                    </label>
                                    <select 
                                      value={social.name || 'Facebook'}
                                      onChange={(e) => updateCustomSocial(social.id, 'name', e.target.value)}
                                      className={`w-full px-3 py-2 border rounded-lg text-xs outline-none transition-colors cursor-pointer ${
                                        theme === 'dark' 
                                          ? 'bg-slate-955 border-slate-800 text-slate-100 hover:border-slate-700 focus:border-emerald-500' 
                                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500'
                                      }`}
                                    >
                                      {AVAILABLE_PLATFORMS.map((plat) => (
                                        <option key={plat} value={plat} className={theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}>
                                          {plat}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className={`text-[10px] font-mono font-bold block uppercase ${
                                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                      Teks yang Ditampilkan
                                    </label>
                                    <input 
                                      type="text"
                                      placeholder="contoh: Nama Saya" 
                                      value={social.value}
                                      onChange={(e) => updateCustomSocial(social.id, 'value', e.target.value)}
                                      className={`w-full px-3 py-2 border rounded-lg text-xs outline-none transition-colors ${
                                        theme === 'dark'
                                          ? 'bg-slate-955 border-slate-800 text-slate-100 hover:border-slate-700 focus:border-emerald-500'
                                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500'
                                      }`}
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className={`text-[10px] font-mono font-bold block uppercase ${
                                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                      Username / Link Tujuan
                                    </label>
                                    <input 
                                      type="text"
                                      placeholder="contoh: nama-saya atau link lengkap" 
                                      value={social.usernameOrUrl || ''}
                                      onChange={(e) => updateCustomSocial(social.id, 'usernameOrUrl', e.target.value)}
                                      className={`w-full px-3 py-2 border rounded-lg text-xs outline-none transition-colors ${
                                        theme === 'dark'
                                          ? 'bg-slate-955 border-slate-800 text-slate-100 hover:border-slate-700 focus:border-emerald-500'
                                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500'
                                      }`}
                                    />
                                  </div>

                                  <div className={`sm:col-span-2 pt-2 mt-1 flex flex-wrap gap-4 items-center justify-between border-t ${
                                    theme === 'dark' ? 'border-slate-850/60' : 'border-slate-200'
                                  }`}>
                                    <span className={`text-[9px] font-mono uppercase ${
                                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                                    }`}>
                                      Tampilkan sosial media kustom ini di:
                                    </span>
                                    
                                    <div className="flex flex-wrap items-center gap-3.5">
                                      <label className={`flex items-center gap-1.5 cursor-pointer text-[10px] select-none transition-colors ${
                                        theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                      }`}>
                                        <input 
                                          type="checkbox" 
                                          checked={!!social.showOnWeb}
                                          onChange={(e) => updateCustomSocial(social.id, 'showOnWeb', e.target.checked)}
                                          className={`w-3.5 h-3.5 rounded cursor-pointer accent-emerald-500 ${
                                            theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-300'
                                          }`}
                                        />
                                        <span>Landing Web Portfolio</span>
                                      </label>

                                      <label className={`flex items-center gap-1.5 cursor-pointer text-[10px] select-none transition-colors ${
                                        theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                      }`}>
                                        <input 
                                          type="checkbox" 
                                          checked={!!social.showOnCvHeader}
                                          onChange={(e) => {
                                              const checked = e.target.checked;
                                              const headerContacts = localCV.headerContacts || ['location', 'email', 'linkedin'];
                                              if (checked && !headerContacts.includes(social.id)) {
                                                  if (headerContacts.length >= 3) {
                                                      alert("Maksimal informasi terpilih untuk kepala (header) CV adalah 3.");
                                                      return;
                                                  }
                                                  setLocalCV(prev => ({
                                                      ...prev,
                                                      headerContacts: [...headerContacts, social.id]
                                                  }));
                                              } else if (!checked && headerContacts.includes(social.id)) {
                                                  setLocalCV(prev => ({
                                                      ...prev,
                                                      headerContacts: headerContacts.filter(item => item !== social.id)
                                                  }));
                                              }
                                              updateCustomSocial(social.id, 'showOnCvHeader', checked);
                                          }}
                                          className={`w-3.5 h-3.5 rounded cursor-pointer accent-emerald-500 ${
                                            theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-300'
                                          }`}
                                        />
                                        <span>CV Header (Maks 3)</span>
                                      </label>

                                      <label className={`flex items-center gap-1.5 cursor-pointer text-[10px] select-none transition-colors ${
                                        theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                      }`}>
                                        <input 
                                          type="checkbox" 
                                          checked={!!social.showOnCvFooter}
                                          onChange={(e) => {
                                              const checked = e.target.checked;
                                              const footerSocials = localCV.footerSocials || ['linkedin', 'instagram', 'whatsapp'];
                                              if (checked && !footerSocials.includes(social.id)) {
                                                  setLocalCV(prev => ({
                                                      ...prev,
                                                      footerSocials: [...footerSocials, social.id]
                                                  }));
                                              } else if (!checked && footerSocials.includes(social.id)) {
                                                  setLocalCV(prev => ({
                                                      ...prev,
                                                      footerSocials: footerSocials.filter(item => item !== social.id)
                                                  }));
                                              }
                                              updateCustomSocial(social.id, 'showOnCvFooter', checked);
                                          }}
                                          className={`w-3.5 h-3.5 rounded cursor-pointer accent-emerald-500 ${
                                            theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-300'
                                          }`}
                                        />
                                        <span>CV Footer</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              </div>
              )}

            </div>

          </main>

        </div>
      )}

    </div>
  );
}

const SUPABASE_SQL_CODE = `-- 1. Hapus tabel lama portfolio_cv yang kurang berguna / tidak digunakan lagi
DROP TABLE IF EXISTS portfolio_cv;

-- 2. Rapikan tabel portfolio_profile dengan menghapus sosmed yang double
ALTER TABLE portfolio_profile DROP COLUMN IF EXISTS linkedin;
ALTER TABLE portfolio_profile DROP COLUMN IF EXISTS github;
ALTER TABLE portfolio_profile DROP COLUMN IF EXISTS instagram;
ALTER TABLE portfolio_profile DROP COLUMN IF EXISTS whatsapp;

-- 2b. Tambahkan kolom gambar kustom & offset visual baru ke portfolio_profile agar tersimpan permanen
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_url TEXT;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_url_dark TEXT;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS avatar_scale NUMERIC DEFAULT 1;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS avatar_x NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS avatar_y NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_scale NUMERIC DEFAULT 1;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_x NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_y NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS header_contacts JSONB DEFAULT '["location", "email", "linkedin"]'::jsonb;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS footer_socials JSONB DEFAULT '["linkedin", "instagram", "whatsapp"]'::jsonb;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS card_socials JSONB DEFAULT '[]'::jsonb;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS id_card_group TEXT DEFAULT '354';
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS id_card_sub_text TEXT DEFAULT 'UNIVERSITAS KELAS';
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS use_nickname_on_card BOOLEAN DEFAULT false;

-- 3. Buat tabel baru untuk menyimpan info semua sosmed kustom secara dinamis
CREATE TABLE IF NOT EXISTS portfolio_socials (
  id VARCHAR PRIMARY KEY,
  platform VARCHAR NOT NULL,
  label VARCHAR NOT NULL, -- "Nama Saya" (yang ditampilkan)
  username_or_url VARCHAR NOT NULL, -- "nama-saya" (yang diarahkan)
  show_on_web BOOLEAN DEFAULT TRUE,
  show_on_cv_header BOOLEAN DEFAULT FALSE,
  show_on_cv_footer BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- 4. Buat tabel baru untuk menyimpan teks-teks dinamis di landing web
CREATE TABLE IF NOT EXISTS portfolio_texts (
  key VARCHAR PRIMARY KEY,
  value TEXT NOT NULL
);

-- 4d. Buat tabel baru untuk kustomisasi layout dinamis
CREATE TABLE IF NOT EXISTS portfolio_layout (
  id VARCHAR PRIMARY KEY DEFAULT 'primary',
  theme_color VARCHAR,
  font_size VARCHAR,
  spacing VARCHAR,
  layout_style VARCHAR,
  font_family VARCHAR,
  section_order JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4b. Buat tabel baru untuk menyimpan informasi "About Me Story" secara berkelanjutan
CREATE TABLE IF NOT EXISTS portfolio_about_story (
  id VARCHAR PRIMARY KEY DEFAULT 'primary',
  badge VARCHAR,
  title VARCHAR,
  intro TEXT,
  image_url TEXT,
  image_config TEXT,
  id_card_text_1 VARCHAR,
  id_card_text_2 VARCHAR,
  id_card_text_3 VARCHAR,
  left_1_title VARCHAR,
  left_1_desc TEXT,
  left_2_title VARCHAR,
  left_2_desc TEXT,
  left_3_title VARCHAR,
  left_3_desc TEXT,
  right_1_title VARCHAR,
  right_1_desc TEXT,
  right_2_title VARCHAR,
  right_2_desc TEXT,
  right_3_title VARCHAR,
  right_3_desc TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4c. Tambahkan kolom kustomisasi ID Card dan scale ke tabel portfolio_about_story (jika tabel sudah ada)
ALTER TABLE portfolio_about_story ADD COLUMN IF NOT EXISTS image_config TEXT;
ALTER TABLE portfolio_about_story ADD COLUMN IF NOT EXISTS id_card_text_1 VARCHAR;
ALTER TABLE portfolio_about_story ADD COLUMN IF NOT EXISTS id_card_text_2 VARCHAR;
ALTER TABLE portfolio_about_story ADD COLUMN IF NOT EXISTS id_card_text_3 VARCHAR;

-- Seed data default untuk tabel portfolio_about_story
INSERT INTO portfolio_about_story (
  id, badge, title, intro, image_url,
  left_1_title, left_1_desc, left_2_title, left_2_desc, left_3_title, left_3_desc,
  right_1_title, right_1_desc, right_2_title, right_2_desc, right_3_title, right_3_desc
) VALUES (
  'primary',
  'ABOUT ME',
  'Sejarah Singkat & Kepemimpinan Data',
  'Saya adalah seorang Arsitek Data yang berfokus pada hasil bisnis nyata. Dari mentranslasikan tabel relasional rumit hingga melakukan optimasi query berkecepatan tinggi, dedikasi saya sepenuhnya tertuju untuk menciptakan efisiensi terukur.',
  '',
  'Latar Belakang', 'Lebih dari 4 tahun memimpin audit performa dan manajemen infrastruktur pelaporan terpusat.',
  'Kompetensi Kunci', 'Arsitektur SQL, otomasi skrip Python, pemodelan statistik, dan taktik optimasi gudang data.',
  'Filosofi Kerja', 'Data tanpa konteks hanyalah kebisingan. Saya mengubah bising tersebut menjadi peta jalan pertumbuhan.',
  'Visi Teknis', 'Membangun standardisasi skema data yang kokoh, berintegritas tinggi, dan responsif.',
  'Sektor Keahlian', 'Sangat berpengalaman dalam teknologi finansial, analisis retail, dan operasi supply chain.',
  'Pendidikan', 'Sarjana Ilmu Komputer dengan pemfokusan khusus pada Rekayasa Sistem Database Modern.'
) ON CONFLICT (id) DO NOTHING;

-- 5. Seed default texts ke dalam tabel portfolio_texts
INSERT INTO portfolio_texts (key, value) VALUES
('hero_badge', 'DATA ANALYST & BI STRATEGIST'),
('hero_title', 'Turning Raw Data\\ninto Enterprise Decisions'),
('hero_subtitle', 'Specializing in high-impact insights through custom SQL engines, Python workflows, and advanced Business Intelligence. I transform transactional records into clean, validated, and actionable optimization roadmaps.'),
('projects_badge', 'CASE CHRONICLES'),
('projects_title', 'Selected Case Studies'),
('projects_subtitle', 'A structured demonstration of technical proficiency across the entire data deployment stack, highlighting real performance audits.'),
('skills_badge', 'STACK CLASSIFICATION'),
('skills_title', 'Technical Arsenal'),
('skills_subtitle', 'Expertise and architectural know-how across relational SQL databases, mathematical script engines, and custom telemetry filters.'),
('experience_badge', 'CAREER TRACEABILITY'),
('experience_title', 'Professional Journey'),
('experience_subtitle', 'Proven experience designing databases, reporting frameworks, and pipelines inside rapid consumer spaces. Click to toggle bullet point summaries.')
ON CONFLICT (key) DO NOTHING;

-- 6. Aktifkan kebijakan RLS (Row Level Security) agar aman
ALTER TABLE portfolio_socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_about_story ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_layout ENABLE ROW LEVEL SECURITY;

-- 7. Buat kebijakan akses publik (Dapat Dibaca Oleh Semua Orang)
DROP POLICY IF EXISTS "Allow public reads on socials" ON portfolio_socials;
CREATE POLICY "Allow public reads on socials" ON portfolio_socials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on texts" ON portfolio_texts;
CREATE POLICY "Allow public reads on texts" ON portfolio_texts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on about_story" ON portfolio_about_story;
CREATE POLICY "Allow public reads on about_story" ON portfolio_about_story FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on layout" ON portfolio_layout;
CREATE POLICY "Allow public reads on layout" ON portfolio_layout FOR SELECT USING (true);

-- 8. Buat kebijakan akses admin (Dapat Dimodifikasi Oleh Pengguna yang Terotentikasi)
DROP POLICY IF EXISTS "Allow admin writes on socials" ON portfolio_socials;
CREATE POLICY "Allow admin writes on socials" ON portfolio_socials FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin writes on texts" ON portfolio_texts;
CREATE POLICY "Allow admin writes on texts" ON portfolio_texts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin writes on about_story" ON portfolio_about_story;
CREATE POLICY "Allow admin writes on about_story" ON portfolio_about_story FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin writes on layout" ON portfolio_layout;
CREATE POLICY "Allow admin writes on layout" ON portfolio_layout FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 9. Tambahkan kolom description ke portfolio_education (jika belum ada)
ALTER TABLE portfolio_education ADD COLUMN IF NOT EXISTS description TEXT;

-- 10. Buat tabel baru untuk portfolio_personality, portfolio_hobbies, dan portfolio_career_goals
CREATE TABLE IF NOT EXISTS portfolio_personality (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR DEFAULT 'Cpu',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_hobbies (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR DEFAULT 'Heart',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_career_goals (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  target_year VARCHAR DEFAULT '',
  icon VARCHAR DEFAULT 'Award',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_page_section (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  layout_type VARCHAR DEFAULT 'image_left',
  bg_color VARCHAR DEFAULT 'slate',
  linked_education_degree VARCHAR DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  image_orientation VARCHAR DEFAULT 'landscape',
  image_size VARCHAR DEFAULT 'medium',
  text_align VARCHAR DEFAULT 'left'
);

-- Pastikan kolom baru tersedia jika tabel sudah ada sebelumnya
ALTER TABLE portfolio_page_section ADD COLUMN IF NOT EXISTS image_orientation VARCHAR DEFAULT 'landscape';
ALTER TABLE portfolio_page_section ADD COLUMN IF NOT EXISTS image_size VARCHAR DEFAULT 'medium';
ALTER TABLE portfolio_page_section ADD COLUMN IF NOT EXISTS text_align VARCHAR DEFAULT 'left';

-- Aktifkan RLS untuk tabel-tabel baru ini agar aman
ALTER TABLE portfolio_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_page_section ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan akses publik (Dapat Dibaca Oleh Semua Orang)
DROP POLICY IF EXISTS "Allow public reads on personality" ON portfolio_personality;
CREATE POLICY "Allow public reads on personality" ON portfolio_personality FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on hobbies" ON portfolio_hobbies;
CREATE POLICY "Allow public reads on hobbies" ON portfolio_hobbies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on career_goals" ON portfolio_career_goals;
CREATE POLICY "Allow public reads on career_goals" ON portfolio_career_goals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on page_sections" ON portfolio_page_section;
CREATE POLICY "Allow public reads on page_sections" ON portfolio_page_section FOR SELECT USING (true);

-- Buat kebijakan akses admin (Dapat Dimodifikasi Oleh Pengguna yang Terotentikasi)
DROP POLICY IF EXISTS "Allow admin writes on personality" ON portfolio_personality;
CREATE POLICY "Allow admin writes on personality" ON portfolio_personality FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin writes on hobbies" ON portfolio_hobbies;
CREATE POLICY "Allow admin writes on hobbies" ON portfolio_hobbies FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin writes on career_goals" ON portfolio_career_goals;
CREATE POLICY "Allow admin writes on career_goals" ON portfolio_career_goals FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin writes on page_sections" ON portfolio_page_section;
CREATE POLICY "Allow admin writes on page_sections" ON portfolio_page_section FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
`;
