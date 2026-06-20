import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Linkedin, 
  Github, 
  TrendingUp, 
  FileText, 
  Database,
  Terminal,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Play,
  Award,
  BookOpen,
  PieChart,
  Sun,
  Moon,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CASE_STUDIES } from './data/portfolioData';
import SkillsArsenal from './components/SkillsArsenal';
import ContactForm from './components/ContactForm';
import ResumeModal from './components/ResumeModal';
import AdminPage from './components/AdminPage';
import CaseStudyPresentationPage from './components/CaseStudyPresentationPage';
import { fetchCVData, DEFAULT_CV_DATA, EMPTY_CV_DATA, CVData, isSupabaseConfigured } from './lib/supabaseClient';
import SocialIcon, { getAbsoluteSocialUrl } from './components/SocialIcon';

// Helper to format unstructured phone numbers or domain strings into clean absolute hyperlinks
function formatSocialLink(link: string | undefined, platform: string, defaultValue: string): string {
  if (!link) return defaultValue;
  return getAbsoluteSocialUrl(link, platform);
}

export default function App() {
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const cached = localStorage.getItem('vance-portfolio-cv-data');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) {}
    return isSupabaseConfigured ? DEFAULT_CV_DATA : EMPTY_CV_DATA;
  });
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>('exp-1');
  const [activeSection, setActiveSection] = useState('home');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('vance-portfolio-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleThemeWithAnimation = (targetTheme: 'light' | 'dark', e?: React.MouseEvent | React.TouchEvent | any) => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (e && 'clientX' in e && 'clientY' in e && e.clientX !== undefined && e.clientY !== undefined) {
      x = e.clientX;
      y = e.clientY;
    } else {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && activeEl.tagName === 'BUTTON') {
        const rect = activeEl.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        const buttons = document.querySelectorAll('[title*="Mode"]');
        if (buttons.length > 0) {
          const rect = buttons[0].getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }
    }

    if (!(document as any).startViewTransition) {
      setTheme(targetTheme);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(targetTheme);
      // Force change theme class synchronously so view-transition captures it
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 480,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  useEffect(() => {
    localStorage.setItem('vance-portfolio-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen to device system preference shifts in real-time
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('vance-portfolio-theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Load CV data from Supabase/localStorage on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCVData();
        setCvData(data);
      } catch (err) {
        console.error('Failed to load CV data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const [activeProjectPresentationId, setActiveProjectPresentationId] = useState<string | null>(null);

  // Support hash based routing: admin & presentation slides paths
  useEffect(() => {
    // Clear residual admin hash on first app mount to guarantee landing on the main public web page
    const initialHash = window.location.hash;
    if (initialHash === '#/admin' || initialHash === '#admin') {
      window.location.hash = '';
    }

    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        setIsAdminView(true);
        setActiveProjectPresentationId(null);
      } else if (hash.startsWith('#/project/') || hash.startsWith('#project/')) {
        const id = hash.replace(/^#\/?project\//, '');
        setActiveProjectPresentationId(id);
        setIsAdminView(false);
      } else {
        setIsAdminView(false);
        setActiveProjectPresentationId(null);
      }
    };
    
    // Always check on mount to enable direct loading of slideshow pages in new tabs
    checkHash();

    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const openAdminView = () => {
    window.location.hash = '#/admin';
    setIsAdminView(true);
  };

  const closeAdminView = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  // Track active scroll sections on scroll to highlight header nav link status
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      const sections = ['home', 'projects', 'skills', 'experience', 'contact'];
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isPng = cvData.homeImageUrl ? (
    cvData.homeImageUrl.toLowerCase().includes('.png') || 
    cvData.homeImageUrl.toLowerCase().includes('data:image/png') ||
    cvData.homeImageUrl.toLowerCase().includes('blob:')
  ) : false;

  const matchedProject = activeProjectPresentationId 
    ? (cvData.caseStudies || []).find(p => p.id === activeProjectPresentationId) 
    : null;

  const hasCachedData = (() => {
    try {
      const cached = localStorage.getItem('vance-portfolio-cv-data');
      return !!cached;
    } catch (_) {
      return false;
    }
  })();

  return (
    <>
      {isLoading && !hasCachedData && isSupabaseConfigured ? (
        <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-250 ${
          theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f7f9fb]'
        }`}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative ${
                theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'
              }`}>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <span className={`font-mono text-xs tracking-widest uppercase transition-colors ${
              theme === 'dark' ? 'text-slate-400 font-medium' : 'text-slate-500 font-semibold'
            }`}>
              Connecting to Database...
            </span>
          </div>
        </div>
      ) : matchedProject ? (
        <CaseStudyPresentationPage 
          project={matchedProject}
          onClose={() => {
            window.location.hash = '';
            setActiveProjectPresentationId(null);
          }}
          theme={theme}
          authorName={cvData.name}
          authorTitle={cvData.title}
        />
      ) : isAdminView ? (
        <AdminPage 
          cvData={cvData} 
          onUpdate={(updated) => setCvData(updated)} 
          onClose={closeAdminView} 
          theme={theme}
          setTheme={toggleThemeWithAnimation}
        />
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`min-h-screen flex flex-col justify-between font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-250 ${
            theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f7f9fb] text-slate-800'
          }`}
        >
      
      {/* 1. TOP STICKY NAVIGATION BAR */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-250 ${
          theme === 'dark' ? 'bg-[#0f172a]/80 border-slate-800' : 'bg-[#f7f9fb]/80 border-slate-200/50'
        }`}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'
            }`}>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <span className={`font-display font-extrabold tracking-tight text-base sm:text-lg transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Analyst Portfolio
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex gap-8 items-center">
            {['home', 'projects', 'skills', 'experience', 'contact'].map((section) => {
              const active = activeSection === section;
              return (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`font-sans text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors pb-1 border-b-2 relative ${
                    active 
                      ? (theme === 'dark' ? 'text-emerald-400 border-emerald-400' : 'text-slate-900 border-slate-900') 
                      : (theme === 'dark' ? 'text-slate-400 border-transparent hover:text-white' : 'text-slate-400 border-transparent hover:text-slate-900')
                  }`}
                >
                  {section}
                  {active && (
                    <motion.span 
                      layoutId="activeNavIndicator" 
                      className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                        theme === 'dark' ? 'bg-emerald-400' : 'bg-slate-900'
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic Theme Toggle Icon */}
            <button
              onClick={(e) => toggleThemeWithAnimation(theme === 'dark' ? 'light' : 'dark', e)}
              title={theme === 'dark' ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
              className={`p-2 rounded-lg transition-all cursor-pointer select-none border border-transparent ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800 hover:border-slate-700' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Database Admin Toggle Button */}
            <button
              onClick={openAdminView}
              title="Akses Admin Panel (Edit CV)"
              className={`p-2 rounded-lg transition-all cursor-pointer select-none ${
                theme === 'dark' ? 'text-slate-400 hover:text-emerald-450 hover:bg-slate-800' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100/80'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600 animate-pulse" />
            </button>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCvModalOpen(true)}
              className={`px-4 py-2 rounded-lg font-sans text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm select-none text-white ${
                theme === 'dark' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Download CV
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* 2. MAIN GRID LAYOUT CONTENT */}
      <main className="flex-grow pt-16">
        
        {/* HERO HERO SECTION */}
        <section id="home" className={`relative min-h-[90vh] flex items-center overflow-hidden border-b transition-colors duration-250 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="data-grid-overlay absolute inset-0 opacity-[0.3]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 w-full">
            <div className="md:col-span-7 flex flex-col justify-center">
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`font-mono text-[10px] tracking-widest px-3 py-1 rounded-full w-fit mb-4 border font-bold uppercase transition-colors duration-200 ${
                  theme === 'dark' ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/25' : 'text-emerald-700 bg-emerald-50 border-emerald-500/10'
                }`}
              >
                {cvData.webTexts?.hero_badge || (isSupabaseConfigured ? "PORTFOLIO BI STRATEGIST" : "DATABASE CONNECTION PENDING")}
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className={`font-sans font-black text-4xl sm:text-5.5xl leading-[1.1] tracking-tight mb-4 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {(cvData.webTexts?.hero_title || (isSupabaseConfigured ? "Masukkan Judul Portofolio Anda\ndi Panel Admin" : "Instalasi Database Supabase\npada Google AI Studio")).split('\n').map((line, i) => {
                  if (line.includes("Supabase")) {
                    return (
                      <span key={i} className="block">
                        {line.replace("Supabase", "")}
                        <span className="text-emerald-600">Supabase</span>
                      </span>
                    );
                  }
                  return <span key={i} className="block">{line}</span>;
                })}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className={`font-sans text-base sm:text-lg mb-8 max-w-xl leading-relaxed transition-colors duration-200 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {cvData.webTexts?.hero_subtitle || (isSupabaseConfigured ? "Silakan isi profil singkat, visi karir, dan keahlian di panel admin database untuk mulai menampilkan detail professional Anda." : "Portofolio dinamis berkinerja tinggi dengan visualisasi bagan interaktif, slide PPT kustom, dan panel admin internal. Hubungkan ke database Supabase Anda untuk memuat CV secara dinamis.")}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection('projects')}
                  className={`px-6 py-3 rounded-lg font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md select-none text-white ${
                    theme === 'dark' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/30' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  }`}
                >
                  View My Work
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCvModalOpen(true)}
                  className={`border px-6 py-3 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none ${
                    theme === 'dark' 
                      ? 'border-slate-750 hover:border-slate-600 text-slate-350 bg-slate-800 hover:bg-slate-755' 
                      : 'border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50'
                  }`}
                >
                  Download Formal Resume
                </motion.button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="md:col-span-5 hidden md:flex items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-[420px] group transition-all">
                {/* Image Wrapper */}
                <div className={`w-full h-full rounded-2xl transition-all overflow-hidden relative flex items-center justify-center ${
                  isPng 
                    ? 'bg-transparent border-transparent' 
                    : (theme === 'dark' ? 'border border-slate-800 bg-slate-900/60 shadow-xl' : 'border border-slate-200 bg-slate-100 shadow-xl')
                }`}>
                  {cvData.homeImageUrl ? (
                    <img 
                      className={`w-full h-full transition-transform duration-700 ease-out select-none pointer-events-none ${
                        isPng ? 'object-contain' : 'object-cover grayscale-[15%] group-hover:scale-102'
                      }`}
                      referrerPolicy="no-referrer"
                      alt="Professional Portfolio Visual" 
                      src={cvData.homeImageUrl}
                      style={{
                        transform: `scale(${cvData.homeImageScale || 1}) translate(${(cvData.homeImageX || 0) * 3.75}px, ${(cvData.homeImageY || 0) * 3.75}px)`,
                        transformOrigin: 'center center'
                      }}
                    />
                  ) : (
                    <div className={`text-center p-6 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      <p className="text-xs font-mono">Belum ada gambar</p>
                    </div>
                  )}
                </div>
                
                {/* Ribbon-style Banner displaying the Professional Title */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[108%] z-20 flex flex-col items-center">
                  {/* Ribbons corners / fold joints behind main body for authentic aesthetic depth */}
                  <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-slate-950 rounded-bl-sm -z-10" />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-950 rounded-br-sm -z-10" />
                  
                  {/* Main Ribbon Body */}
                   <div className={`w-full py-3 px-4 sm:px-6 rounded-lg shadow-2xl flex items-center justify-center gap-2.5 select-none relative transition-all duration-250 border ${
                     theme === 'dark' 
                       ? 'bg-slate-900/95 backdrop-blur-md border-slate-700 text-slate-100 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.65)]' 
                       : 'bg-white border-slate-250 text-slate-900 shadow-[0_20px_40px_-5px_rgba(15,23,42,0.18)]'
                   }`}>
                     <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 animate-pulse" />
                     <span className={`font-mono text-[10px] sm:text-[11px] md:text-[12px] font-black tracking-widest text-center uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[85%] drop-shadow-sm ${
                       theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                     }`}>
                       {cvData.title || (isSupabaseConfigured ? "ANALYST PROFESSIONAL" : "MENUNGGU KONEKSI DATABASE")}
                     </span>
                     <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 animate-pulse" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* CASE STUDIES VIEW SECTION */}
        <section id="projects" className={`py-20 border-b transition-colors duration-250 ${
          theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mb-12"
            >
              <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded border transition-colors duration-200 ${
                theme === 'dark' ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/25' : 'text-emerald-700 bg-emerald-100/60 border-emerald-200/50'
              }`}>
                {cvData.webTexts?.projects_badge || "CASE CHRONICLES"}
              </span>
              <h2 className={`font-sans font-extrabold text-3xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {cvData.webTexts?.projects_title || "Selected Case Studies"}
              </h2>
              <p className={`font-sans text-sm sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {cvData.webTexts?.projects_subtitle || "A structured demonstration of technical proficiency across the entire data deployment stack, highlighting real performance audits."}
              </p>
            </motion.div>

            {/* Case Studies Cards Grid */}
            <div className={`grid ${(!isSupabaseConfigured || !cvData.caseStudies || cvData.caseStudies.length === 0) ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
              {!isSupabaseConfigured ? (
                <div className={`p-8 rounded-xl border text-center transition-all ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Database className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-pulse shrink-0" />
                  <h3 className="font-sans font-bold text-lg mb-2">Supabase Belum Terhubung</h3>
                  <p className="text-sm max-w-lg mx-auto leading-relaxed mb-6">
                    Portofolio web ini dirancang penuh untuk mengambil data dan gambar secara dinamis dari database Supabase Anda. Konfigurasikan credentials berikut di Secrets panel Google AI Studio:
                  </p>
                  <div className="inline-flex flex-col sm:flex-row gap-3 font-mono text-xs mb-6 text-emerald-500 bg-emerald-500/10 px-4 py-2.5 rounded-lg border border-emerald-500/20 w-fit mx-auto">
                    <span>VITE_SUPABASE_URL</span>
                    <span className="hidden sm:inline text-slate-400">|</span>
                    <span>VITE_SUPABASE_ANON_KEY</span>
                  </div>
                  <p className="text-xs text-slate-400 block">Setelah secrets dipasang, data asli, deskripsi, dan gambar proyek Anda akan otomatis dirender di sini.</p>
                </div>
              ) : !cvData.caseStudies || cvData.caseStudies.length === 0 ? (
                <div className={`p-8 rounded-xl border text-center transition-all ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Database className="w-10 h-10 text-emerald-500 mx-auto mb-4 shrink-0" />
                  <h3 className="font-sans font-bold text-lg mb-2">Belum ada Proyek</h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed mb-4">
                    Koneksi database berhasil, namun belum ada proyek/case studies yang tersimpan. Klik ikon database hijau (Admin Panel) di pojok kanan atas untuk login dan membuat proyek pertama Anda!
                  </p>
                </div>
              ) : (
                cvData.caseStudies.map((study, idx) => (
                  <motion.div 
                    key={study.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.7, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                    onClick={() => window.open('#/project/' + study.id, '_blank')}
                    className={`bento-card rounded-xl overflow-hidden p-5 flex flex-col justify-between group border transition-all cursor-pointer relative ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-700/60 hover:border-emerald-500/40' : 'bg-white border-slate-200/80 hover:border-emerald-500/30 hover:shadow-lg'
                    }`}
                    title="Click to view full slide deck presentation"
                  >
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600/90 text-white font-mono text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded leading-none">
                      PPT SLIDES
                    </div>

                    <div>
                      <div className={`aspect-[16/10] mb-4 overflow-hidden rounded border transition-colors duration-200 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <img 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out grayscale-[10%]" 
                          referrerPolicy="no-referrer"
                          alt={study.title} 
                          src={study.image}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {study.tags.slice(0, 2).map((tg, i) => (
                          <span key={i} className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border transition-colors duration-200 ${
                            theme === 'dark' ? 'bg-slate-850 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {tg}
                          </span>
                        ))}
                      </div>

                      <h3 className={`font-sans font-extrabold text-base sm:text-lg tracking-tight mb-2 leading-tight transition-colors duration-200 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-950'
                      }`}>
                        {study.title}
                      </h3>
                      
                      <p className={`text-xs sm:text-sm leading-relaxed mb-6 transition-colors duration-200 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {study.description}
                      </p>
                    </div>

                    <div className={`pt-4 border-t flex justify-between items-center transition-colors duration-200 ${
                      theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
                    }`}>
                      <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded border transition-colors duration-200 ${
                        theme === 'dark' ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/25' : 'text-emerald-700 bg-emerald-50 border-emerald-500/10'
                      }`}>
                        {study.impactMetric}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToSection('contact');
                        }}
                        className={`text-xs font-bold inline-flex items-center gap-1 cursor-pointer hover:underline transition-colors select-none ${
                          theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                        }`}
                      >
                        Discuss Project
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

          </div>
        </section>


        {/* TECHNICAL ARSENAL SECTION */}
        <section id="skills" className={`py-20 border-b transition-colors duration-250 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded border transition-colors duration-200 ${
                theme === 'dark' ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/25' : 'text-emerald-700 bg-emerald-100/60 border-emerald-200/50'
              }`}>
                {cvData.webTexts?.skills_badge || "STACK CLASSIFICATION"}
              </span>
              <h2 className={`font-sans font-extrabold text-3xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {cvData.webTexts?.skills_title || "Technical Arsenal"}
              </h2>
              <p className={`font-sans text-sm sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {cvData.webTexts?.skills_subtitle || "Expertise and architectural know-how across relational SQL databases, mathematical script engines, and custom telemetry filters."}
              </p>
            </motion.div>

            <SkillsArsenal skills={cvData.skills} theme={theme} customCategories={cvData.skillCategories} />
          </div>
        </section>

        {/* CHRONOLOGY timeline SECTION */}
        <section id="experience" className={`py-20 border-b transition-colors duration-250 ${
          theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mb-12"
            >
              <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded border transition-colors duration-200 ${
                theme === 'dark' ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/25' : 'text-emerald-700 bg-emerald-100/60 border-emerald-200/50'
              }`}>
                {cvData.webTexts?.experience_badge || "CAREER TRACEABILITY"}
              </span>
              <h2 className={`font-sans font-extrabold text-3xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {cvData.webTexts?.experience_title || "Professional Journey"}
              </h2>
              <p className={`font-sans text-sm sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {cvData.webTexts?.experience_subtitle || "Proven experience designing databases, reporting frameworks, and pipelines inside rapid consumer spaces. Click to toggle bullet point summaries."}
              </p>
            </motion.div>

            {/* Timeline Cards */}
            <div className="space-y-6 max-w-4xl">
              {!isSupabaseConfigured ? (
                <div className={`p-8 rounded-xl border text-center transition-all ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Database className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-pulse shrink-0" />
                  <h3 className="font-sans font-bold text-base mb-2">Supabase Belum Terhubung</h3>
                  <p className="text-sm max-w-lg mx-auto leading-relaxed text-slate-400">
                    Konfigurasikan database Supabase Anda untuk menampilkan riwayat pengalaman kerja professional Anda secara dinamis dari tabel database.
                  </p>
                </div>
              ) : !cvData.experiences || cvData.experiences.length === 0 ? (
                <div className={`p-8 rounded-xl border text-center transition-all ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Database className="w-10 h-10 text-emerald-500 mx-auto mb-4 shrink-0" />
                  <h3 className="font-sans font-bold text-base mb-2">Belum ada Pengalaman Kerja</h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed text-slate-400">
                    Koneksi sukses! Tambahkan riwayat pengalaman kerja baru Anda melalui Admin Panel di pojok kanan atas.
                  </p>
                </div>
              ) : (
                cvData.experiences.map((exp, expIdx) => {
                const isExpanded = expandedExperienceId === exp.id;
                return (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.7, delay: expIdx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.25, ease: "easeOut" } }}
                    onClick={() => setExpandedExperienceId(isExpanded ? null : exp.id)}
                    className={`bento-card p-5 sm:p-6 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      isExpanded 
                        ? 'border-emerald-500/45 shadow-sm bg-emerald-500/5' 
                        : (theme === 'dark' ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300')
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex gap-4 items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isExpanded 
                            ? (theme === 'dark' ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-800') 
                            : (theme === 'dark' ? 'bg-slate-950 text-slate-500' : 'bg-slate-100 text-slate-600')
                        }`}>
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-slate-400 font-bold block">
                            {exp.period}
                          </span>
                          <h4 className={`font-sans font-bold text-base sm:text-lg transition-colors ${
                            theme === 'dark' ? 'text-white' : 'text-slate-950'
                          }`}>
                            {exp.role} <span className="text-emerald-500 font-extrabold">@ {exp.company}</span>
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1 sm:pt-0">
                        {/* Render list of tags on role */}
                        <div className="hidden sm:flex flex-wrap gap-1">
                          {exp.tools?.map((tool, idx) => (
                            <span key={idx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border transition-colors ${
                              theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}>
                              {tool}
                            </span>
                          ))}
                        </div>

                        {/* toggle status indicators */}
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Collapsible bullet list */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className={`overflow-hidden mt-5 pt-4 border-t text-xs sm:text-sm transition-colors ${
                            theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                          }`}
                        >
                          <ul className="space-y-2">
                            {exp.bulletPoints.map((bullet, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="flex items-start gap-2.5"
                              >
                                <span className="w-2 h-2 rounded bg-emerald-500 shrink-0 mt-1.5" />
                                <span className="leading-relaxed">{bullet}</span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* Mobile stack indicators */}
                          <div className={`flex sm:hidden flex-wrap gap-1 mt-4 pt-4 border-t ${
                            theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                          }`}>
                            {exp.tools?.map((tool, idx) => (
                              <span key={idx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border transition-colors ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}>
                                {tool}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }))}
            </div>

          </div>
        </section>


        {/* DYNAMIC CONTACT MATRIX SECTION */}
        <section id="contact" className={`py-20 transition-colors ${
          theme === 'dark' ? 'bg-[#111827] border-t border-slate-850' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm 
              email={cvData.email} 
              location={cvData.location} 
              webTexts={cvData.webTexts} 
            />
          </div>
        </section>

      </main>

      {/* 3. PROFESSIONAL FOOTER */}
      <footer className={`transition-colors duration-250 py-12 border-t ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 text-slate-400' 
          : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 select-none">
            <div className={`w-7 h-7 rounded flex items-center justify-center transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100 border border-slate-200/80'
            }`}>
              <Database className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className={`font-display font-extrabold text-base transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {!isSupabaseConfigured ? 'Name' : (cvData.name || 'Jonathan Vance')}
            </span>
          </div>

          <p className="font-mono text-[10px] text-slate-500 text-center sm:text-left">
            © 2026 Data Decisions Index. Standard Vectorized Layout. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {/* Unified Social Media Icon Controls */}
            {(() => {
              const list = [...(cvData.customSocials || [])];

              return list
                .filter(s => (s.value || s.usernameOrUrl) && s.showOnWeb !== false)
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      const target = s.usernameOrUrl || s.value || '';
                      const url = formatSocialLink(target, s.name || 'custom', '');
                      window.open(url, '_blank', 'noreferrer');
                    }}
                    className={`p-2 rounded-lg transition-all border cursor-pointer flex items-center justify-center gap-1.5 min-w-[34px] min-h-[34px] group ${
                      theme === 'dark' 
                        ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                    }`}
                    title={`Open ${s.name}: ${s.value || s.usernameOrUrl}`}
                  >
                    <SocialIcon platform={s.name} size={16} className="w-4 h-4 transition-transform group-hover:scale-110" useBrandColor={true} />
                    <span className="text-[10px] hidden sm:inline group-hover:text-emerald-500 font-mono transition-colors">{s.value || s.name}</span>
                  </button>
                ));
            })()}
          </div>
        </div>
      </footer>

      {/* 4. MODALS PREVIEW DRAWER */}
      <AnimatePresence>
        {cvModalOpen && (
          <ResumeModal 
            onClose={() => setCvModalOpen(false)} 
            cvData={cvData} 
            onUpdate={(updated) => setCvData(updated)} 
            theme={theme}
          />
        )}
      </AnimatePresence>

        </motion.div>
      )}
    </>
  );
}
