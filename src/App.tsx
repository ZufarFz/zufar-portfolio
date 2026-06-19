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
import { fetchCVData, DEFAULT_CV_DATA, CVData } from './lib/supabaseClient';

// Helper to format unstructured phone numbers or domain strings into clean absolute hyperlinks
function formatSocialLink(link: string | undefined, platform: 'linkedin' | 'github' | 'instagram' | 'whatsapp' | 'custom' | string, defaultValue: string): string {
  if (!link) return defaultValue;
  const cleaned = link.trim();
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }
  if (platform === 'whatsapp') {
    let numeric = cleaned.replace(/[^0-9]/g, '');
    if (numeric.startsWith('0')) {
      numeric = '62' + numeric.slice(1);
    }
    return `https://wa.me/${numeric}`;
  }
  return `https://${cleaned}`;
}

export default function App() {
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
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
      const data = await fetchCVData();
      setCvData(data);
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

  return (
    <>
      {matchedProject ? (
        <CaseStudyPresentationPage 
          project={matchedProject}
          onClose={() => {
            window.location.hash = '';
            setActiveProjectPresentationId(null);
          }}
          theme={theme}
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
        <div className={`min-h-screen flex flex-col justify-between font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-250 ${
      theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f7f9fb] text-slate-800'
    }`}>
      
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
                DATA ANALYST &amp; BI STRATEGIST
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className={`font-sans font-black text-4xl sm:text-5.5xl leading-[1.1] tracking-tight mb-4 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                Turning Raw Data <br/>
                into Enterprise <span className="text-emerald-600">Decisions</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className={`font-sans text-base sm:text-lg mb-8 max-w-xl leading-relaxed transition-colors duration-200 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Specializing in high-impact insights through custom SQL engines, Python workflows, and advanced Business Intelligence. I transform transactional records into clean, validated, and actionable optimization roadmaps.
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
                  <img 
                    className={`w-full h-full transition-transform duration-700 ease-out select-none pointer-events-none ${
                      isPng ? 'object-contain' : 'object-cover grayscale-[15%] group-hover:scale-102'
                    }`}
                    referrerPolicy="no-referrer"
                    alt="Professional Portfolio Visual" 
                    src={cvData.homeImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCx5HToTCRRNc-WdOu-V5TBxXn5nv6D4tUTHNYPFTqireXzy3qytpxRbIjxuK3sOdu0A8jQwuEwReAlKpUCIWEz3dv2iyfNx-LiA5WJo1_K-AEsEo3lxWzFFex7uvz2dXUQPNrFSvrfeK8dt5k-xfgNyPCha7Ks3FWVNNaVdA-Lsln37OKxdZWRGRmgJXyjrZLdon3a85_0mNN-abPutS_nR4mJXGtwcL5OYlXEHTeG8__SZUp2o6PbflTLwruIQX15u_e9R_kNpF4"}
                    style={cvData.homeImageUrl ? {
                      transform: `scale(${cvData.homeImageScale || 1}) translate(${(cvData.homeImageX || 0) * 3.75}px, ${(cvData.homeImageY || 0) * 3.75}px)`,
                      transformOrigin: 'center center'
                    } : undefined}
                  />
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
                       {cvData.title || "ANALYST PROFESSIONAL"}
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
                CASE CHRONICLES
              </span>
              <h2 className={`font-sans font-extrabold text-3xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Selected Case Studies
              </h2>
              <p className={`font-sans text-sm sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                A structured demonstration of technical proficiency across the entire data deployment stack, highlighting real performance audits.
              </p>
            </motion.div>

            {/* Case Studies Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(cvData.caseStudies && cvData.caseStudies.length > 0 ? cvData.caseStudies : CASE_STUDIES).map((study, idx) => (
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
              ))}
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
                STACK CLASSIFICATION
              </span>
              <h2 className={`font-sans font-extrabold text-3xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Technical Arsenal
              </h2>
              <p className={`font-sans text-sm sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Expertise and architectural know-how across relational SQL databases, mathematical script engines, and custom telemetry filters.
              </p>
            </motion.div>

            <SkillsArsenal skills={cvData.skills} theme={theme} />
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
                CAREER TRACEABILITY
              </span>
              <h2 className={`font-sans font-extrabold text-3xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Professional Journey
              </h2>
              <p className={`font-sans text-sm sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Proven experience designing databases, reporting frameworks, and pipelines inside rapid consumer spaces. Click to toggle bullet point summaries.
              </p>
            </motion.div>

            {/* Timeline Cards */}
            <div className="space-y-6 max-w-4xl">
              {cvData.experiences.map((exp, expIdx) => {
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
              })}
            </div>

          </div>
        </section>


        {/* DYNAMIC CONTACT MATRIX SECTION */}
        <section id="contact" className={`py-20 transition-colors ${
          theme === 'dark' ? 'bg-[#111827] border-t border-slate-850' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm />
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
              {cvData.name || 'Jonathan Vance'}
            </span>
          </div>

          <p className="font-mono text-[10px] text-slate-500 text-center sm:text-left">
            © 2026 Data Decisions Index. Standard Vectorized Layout. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            {cvData.linkedin && (
              <button
                onClick={() => {
                  const url = formatSocialLink(cvData.linkedin, 'linkedin', 'https://linkedin.com');
                  window.open(url, '_blank', 'noreferrer');
                }}
                className={`p-2 rounded-lg transition-all border cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-sky-600 hover:border-slate-300 shadow-sm'
                }`}
                title="Connect on LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
            )}
            
            {/* GitHub */}
            {cvData.github && (
              <button
                onClick={() => {
                  const url = formatSocialLink(cvData.github, 'github', 'https://github.com');
                  window.open(url, '_blank', 'noreferrer');
                }}
                className={`p-2 rounded-lg transition-all border cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300 shadow-sm'
                }`}
                title="Browse on GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
            )}

            {/* Instagram */}
            {cvData.instagram && (
              <button
                onClick={() => {
                  const url = formatSocialLink(cvData.instagram, 'instagram', 'https://instagram.com');
                  window.open(url, '_blank', 'noreferrer');
                }}
                className={`p-2 rounded-lg transition-all border cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-rose-600 hover:border-slate-300 shadow-sm'
                }`}
                title="Follow on Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </button>
            )}

            {/* WhatsApp */}
            {cvData.whatsapp && (
              <button
                onClick={() => {
                  const url = formatSocialLink(cvData.whatsapp, 'whatsapp', 'https://wa.me/');
                  window.open(url, '_blank', 'noreferrer');
                }}
                className={`p-2 rounded-lg transition-all border cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-emerald-600 hover:border-slate-300 shadow-sm'
                }`}
                title="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 2.766 1.464 4.8 1.465 5.485 0 9.94-4.5 9.943-10.02a9.715 9.715 0 0 0-2.888-6.953l-.117-.111c-1.884-1.883-4.394-2.92-7.073-2.922C5.786 1.613 1.332 6.113 1.33 11.636c0 2.054.536 3.037 1.42 4.678l-.947 3.456 3.541-.929s.258.14.703.353zm11.393-7.531c-.345-.172-2.036-1.002-2.348-1.116-.312-.114-.539-.172-.767.172-.227.343-.88 1.115-1.079 1.343-.198.228-.397.256-.742.085-.345-.172-1.456-.537-2.774-1.711-1.025-.914-1.717-2.043-1.918-2.386-.201-.343-.021-.528.151-.7a12.63 12.63 0 0 0 .504-.686c.119-.2.06-.372-.03-.543-.09-.172-.767-1.85-.1.171-1.05-2.528-.344-.61-.312-.767-.343-.114-.54-.112-1.353-.112-.482-.001-.794.111-1.22.112-.426.001-1.107.159-1.687.799-.58.641-2.213 2.164-2.148 5.275.064 3.111 2.3 6.112 2.613 6.541.312.428 4.542 6.936 10.1 7.234l.87.01c1.55-.069 2.53-.15 3.32-.23.854-.08 2.016-.82 2.3-1.58.28-.76.28-1.41.2-1.55-.08-.14-.3-.22-.646-.393z"/>
                </svg>
              </button>
            )}

            {/* Custom Social Channels */}
            {(cvData.customSocials || [])
              .filter(s => s.value && s.showOnWeb !== false)
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    const url = formatSocialLink(s.value, 'custom', '');
                    window.open(url, '_blank', 'noreferrer');
                  }}
                  className={`p-2 rounded-lg transition-all border cursor-pointer flex items-center justify-center gap-1 min-w-[34px] min-h-[34px] ${
                    theme === 'dark' 
                      ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-emerald-600 hover:border-slate-300 shadow-sm'
                  }`}
                  title={`Open ${s.name}`}
                >
                  {s.logoUrl ? (
                    <img src={s.logoUrl} className="w-4 h-4 object-contain shrink-0" alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="font-mono text-[9px] uppercase font-bold">{s.name ? s.name.substring(0, 2) : 'S'}</span>
                  )}
                </button>
              ))}
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

        </div>
      )}
    </>
  );
}
