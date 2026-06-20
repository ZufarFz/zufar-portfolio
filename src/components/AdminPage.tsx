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
  Menu
} from 'lucide-react';
import { CVData, saveCVData, isSupabaseConfigured, supabase, uploadFileToStorage } from '../lib/supabaseClient';
import PPTSlideEditor from './PPTSlideEditor';
import ResumeModal from './ResumeModal';
import { CaseStudy, SkillItem, SkillCategory } from '../types';
import SocialIcon from './SocialIcon';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'web_texts' | 'skills' | 'projects' | 'experience' | 'education' | 'technical' | 'methodology' | 'layout' | 'socials' | 'db_setup' | 'preview'>('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSaving, setIsSaving] = useState(false);

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

  const handleUpdateEdu = (index: number, field: 'period' | 'degree' | 'institution', val: string) => {
    const list = [...(localCV.education || [])];
    list[index] = { ...list[index], [field]: val };
    updateGeneralField('education', list);
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
                          <li>Klik <strong className="font-bold font-mono">"+ New Query"</strong> untuk membuat editor kueri scratchpad baru.</li>
                          <li>Tempel (Ctrl+V / Cmd+V) kode SQL yang disalin di atas.</li>
                          <li>Klik tombol hijau <strong className="font-bold text-emerald-400 font-mono">"Run"</strong> untuk mengeksekusi migrasi tabel.</li>
                          <li>Selesai! Database Supabase Anda telah sukses termigrasi rapi tanpa redundansi data lagi.</li>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Nama Lengkap</label>
                        <input 
                          type="text" 
                          value={localCV.name} 
                          onChange={e => updateGeneralField('name', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
                      </div>

                      <div>
                        <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Gelar Profesional / Title</label>
                        <input 
                          type="text" 
                          value={localCV.title} 
                          onChange={e => updateGeneralField('title', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-colors border focus:border-emerald-500 ${inputBgBorder}`}
                        />
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

                    {/* PHOTO/AVATAR COMPONENT */}
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
                                    <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER X (KIRI - KANAN): {localCV.avatarX || 0}px</span>
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
                                    <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER Y (ATAS - BAWAH): {localCV.avatarY || 0}px</span>
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

                    {/* KEY HOMEPAGE ILLUSTRATION SETTINGS */}
                    <div className={`pt-6 border-t ${dividerColor}`}>
                      <label className={`text-[10px] font-mono font-bold block uppercase mb-1.5 ${textLabelColor}`}>Gambar Hero / Ilustrasi Utama Home Web</label>
                      <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg ${containerBgBorder}`}>
                        {localCV.homeImageUrl ? (
                          <div className={`relative w-16 h-16 rounded-xl overflow-hidden border group shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-105 border-slate-205'}`}>
                            <img 
                              src={localCV.homeImageUrl} 
                              alt="Home Hero Preview" 
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
                                setLocalCV(prev => ({
                                  ...prev,
                                  homeImageScale: 1,
                                  homeImageX: 0,
                                  homeImageY: 0
                                }));
                              }}
                              className="absolute inset-0 bg-red-655/90 text-white font-bold text-[9px] tracking-widest opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
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
                            id="admin-home-hero-file-input"
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
                                    homeImageUrl: url,
                                    homeImageScale: 1,
                                    homeImageX: 0,
                                    homeImageY: 0
                                  }));
                                  alert("✓ Gambar hero berhasil diunggah ke bucket 'portfolio_assets'!");
                                } catch (err: any) {
                                  console.error("Gagal mengunggah ke bucket:", err);
                                  alert(`❌ Gagal mengunggah foto ke bucket 'portfolio_assets'. Detail Error: ${err.message}`);
                                }
                              }
                            }}
                            className="hidden"
                          />
                          <label 
                            htmlFor="admin-home-hero-file-input"
                            className={`inline-block px-4 py-2 font-bold font-sans text-xs rounded-lg cursor-pointer shadow-sm active:scale-97 transition-all select-none border ${theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750 hover:text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'}`}
                          >
                            Pilih Gambar Hero PNG/JPG
                          </label>
                          <p className="text-[10px] text-slate-500 leading-normal font-mono">
                            Contoh: Foto meja kerja, analitik, atau workspace Anda. Terpisah dengan Foto Profil CV.
                          </p>
                        </div>
                      </div>

                      {/* Home Hero Slider Controls */}
                      {localCV.homeImageUrl && (
                        <div className={`mt-4 p-5 border rounded-xl space-y-4 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                          <div className={`text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Atur Posisi &amp; Skala Gambar Hero Home Web</span>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Raw Image Review */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                              <span className={`text-[9px] font-mono font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Gambar Asli:</span>
                              <div className={`relative w-28 h-28 rounded-xl overflow-hidden border flex items-center justify-center p-1.5 ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-250 shadow-sm'}`}>
                                <img
                                  src={localCV.homeImageUrl}
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
                                <img
                                  src={localCV.homeImageUrl}
                                  alt="Posisi Hero Preview"
                                  className={`w-full h-full select-none pointer-events-none ${
                                    (localCV.homeImageUrl || "").toLowerCase().includes('.png') || (localCV.homeImageUrl || "").toLowerCase().includes('data:image/png') || (localCV.homeImageUrl || "").toLowerCase().includes('blob:') ? 'object-contain' : 'object-cover grayscale-[15%]'
                                  }`}
                                  style={{
                                    transform: `scale(${localCV.homeImageScale || 1}) translate(${localCV.homeImageX || 0}px, ${localCV.homeImageY || 0}px)`,
                                    transformOrigin: 'center center',
                                    transition: imgDrag && imgDrag.type === 'homeImage' ? 'none' : 'transform 0.05s ease-out'
                                  }}
                                />
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
                                    <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER X: {localCV.homeImageX || 0}px</span>
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
                                    <div className={`flex justify-between text-[9px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                      <span>GESER Y: {localCV.homeImageY || 0}px</span>
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
                  <div className="space-y-6">
                    <div className={`flex justify-between items-center border-b pb-3 mb-2 ${dividerColor}`}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-655'}`} />
                        <h4 className={`font-bold text-sm uppercase tracking-wider ${textTitleColor}`}>Latar Belakang Akademis</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddEdu}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider cursor-pointer shadow-md select-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> TAMBAH PENDIDIKAN
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

              {/* STAGE SAVE ACTIONS FOOTER RAIL */}
              <div className={`p-6 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg sticky bottom-6 select-none shadow-[#000]/40 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-205'}`}>
                <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isSupabaseConfigured 
                    ? '⚡ Terkoneksi secara aman dengan Cloud Supabase Database. Seluruh data disinkronkan langsung.' 
                    : '📂 Mode draft offline: Menulis ke Storage Browser lokal secara aman.'}
                </span>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-grow sm:flex-grow-0 px-6 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-97 cursor-pointer text-center border select-none ${
                      theme === 'dark'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
                        : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border-slate-200 shadow-sm'
                    }`}
                  >
                    Tutup Panel Admin
                  </button>
                </div>
              </div>

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
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS avatar_scale NUMERIC DEFAULT 1;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS avatar_x NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS avatar_y NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_scale NUMERIC DEFAULT 1;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_x NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS home_image_y NUMERIC DEFAULT 0;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS header_contacts JSONB DEFAULT '["location", "email", "linkedin"]'::jsonb;
ALTER TABLE portfolio_profile ADD COLUMN IF NOT EXISTS footer_socials JSONB DEFAULT '["linkedin", "instagram", "whatsapp"]'::jsonb;

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

-- 7. Buat kebijakan akses publik (Dapat Dibaca Oleh Semua Orang)
CREATE POLICY "Allow public reads on socials" ON portfolio_socials FOR SELECT USING (true);
CREATE POLICY "Allow public reads on texts" ON portfolio_texts FOR SELECT USING (true);

-- 8. Buat kebijakan akses admin (Dapat Dimodifikasi Oleh Pengguna yang Terotentikasi)
CREATE POLICY "Allow admin writes on socials" ON portfolio_socials FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin writes on texts" ON portfolio_texts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
`;
