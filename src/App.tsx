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
import AboutMeStoryPage from './components/AboutMeStoryPage';
import AboutMeSubPages from './components/AboutMeSubPages';
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
  const [isStoryView, setIsStoryView] = useState(false);
  const [aboutSubPage, setAboutSubPage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  // Smooth loading progress animation
  useEffect(() => {
    let timer: any;
    const updateProgress = () => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // If assets are loaded, we speed up to 100%
        if (isAssetsLoaded) {
          const step = Math.ceil((100 - prev) / 4);
          const next = prev + (step > 1 ? step : 1);
          return next >= 100 ? 100 : next;
        }
        
        // If not loaded yet, slow down as we approach 88%
        if (prev < 88) {
          const remaining = 88 - prev;
          const randomIncrement = Math.floor(Math.random() * 3) + 1; // 1-3%
          const step = Math.min(randomIncrement, remaining);
          return prev + (step > 0 ? step : 0.2); // creep up
        }
        
        // Creep extremely slowly near 88-95% to keep loading active but not hit 100%
        if (prev < 95) {
          return prev + 0.1;
        }
        
        return prev;
      });
    };

    timer = setInterval(updateProgress, 35);
    return () => clearInterval(timer);
  }, [isAssetsLoaded]);

  // Handle setting isLoading to false when progress hits 100
  useEffect(() => {
    if (loadingProgress >= 100) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 350); // short delay for beautiful transition feel
      return () => clearTimeout(timeout);
    }
  }, [loadingProgress]);

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

  // Helper to preload a single image
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!url) {
        resolve();
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (typeof window !== 'undefined') {
          (window as any).__LOADED_IMAGES_CACHE = (window as any).__LOADED_IMAGES_CACHE || new Set<string>();
          (window as any).__LOADED_IMAGES_CACHE.add(url);
        }
        resolve();
      };
      img.onerror = () => resolve();
    });
  };

  // Load CV data from Supabase/localStorage and preload all assets on mount
  useEffect(() => {
    async function loadData() {
      let activeData = cvData;
      
      // 1. Fetch from database (very fast)
      try {
        const data = await fetchCVData();
        setCvData(data);
        activeData = data;
      } catch (err) {
        console.error('Failed to load CV data from database:', err);
      }

      // 2. Gather and filter all images to preload
      const urlsToPreload: string[] = [];
      
      if (activeData.homeImageUrl) urlsToPreload.push(activeData.homeImageUrl);
      if (activeData.homeImageUrlDark) urlsToPreload.push(activeData.homeImageUrlDark);
      if (activeData.idCardSvgLight) urlsToPreload.push(activeData.idCardSvgLight);
      if (activeData.idCardSvgDark) urlsToPreload.push(activeData.idCardSvgDark);
      if (activeData.avatarUrl) urlsToPreload.push(activeData.avatarUrl);

      // Preload custom SVG items
      if (activeData.idCardSvgs && activeData.idCardSvgs.length > 0) {
        activeData.idCardSvgs.forEach(svg => {
          const isUrl = svg.svgContent && (
            svg.svgContent.startsWith('http') || 
            svg.svgContent.startsWith('/') || 
            svg.svgContent.startsWith('data:')
          );
          if (isUrl) {
            urlsToPreload.push(svg.svgContent);
          }
        });
      }

      // Preload about story lanyard and background images
      if (activeData.webTexts?.about_story_image_url) {
        const rawUrl = activeData.webTexts.about_story_image_url;
        if (rawUrl.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(rawUrl);
            if (parsed.lanyardLightUrl) urlsToPreload.push(parsed.lanyardLightUrl);
            if (parsed.lanyardDarkUrl) urlsToPreload.push(parsed.lanyardDarkUrl);
            if (parsed.backgroundImageUrl) urlsToPreload.push(parsed.backgroundImageUrl);
          } catch (_) {}
        } else {
          urlsToPreload.push(rawUrl);
        }
      }

      // Preload custom sub-pages header backgrounds (and their fallback Unsplash default backgrounds)
      const subPageDefaultBgs: Record<string, string> = {
        education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
        personality: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
        hobbies: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop',
        career_journey: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
        skills: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
        career_goals: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1200&auto=format&fit=crop'
      };

      const subPageKeys = ['education', 'personality', 'hobbies', 'career_journey', 'skills', 'career_goals'];
      subPageKeys.forEach(key => {
        const bgUrl = activeData.webTexts?.[`${key}_header_bg`] || subPageDefaultBgs[key];
        if (bgUrl) {
          urlsToPreload.push(bgUrl);
        }
      });

      // Also preload the default lanyard portrait image
      urlsToPreload.push('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop');

      // Preload all custom sections / slides imagery
      if (activeData.educationSections && activeData.educationSections.length > 0) {
        activeData.educationSections.forEach(section => {
          if (section.imageUrl) {
            urlsToPreload.push(section.imageUrl);
          }
        });
      }

      // Clean duplicate and empty URLs
      const cleanUrls = Array.from(new Set(urlsToPreload.filter(Boolean) as string[]));

      // 3. Preload all assets in parallel
      try {
        await Promise.all(cleanUrls.map(url => preloadImage(url)));
      } catch (preloadErr) {
        console.warn('Some assets failed to preload, continuing load anyway:', preloadErr);
      } finally {
        // Guarantee at least some minimal loading time (e.g. 600ms) for high-quality loading screen transition
        setTimeout(() => {
          setIsAssetsLoaded(true);
        }, 600);
      }
    }
    loadData();
  }, []);

  const [activeProjectPresentationId, setActiveProjectPresentationId] = useState<string | null>(null);

  // Support hash based routing: admin, about-me & presentation slides paths
  useEffect(() => {
    // Clear any residual subpage hash on first app mount unless it's one of the valid routes
    const initialHash = window.location.hash;
    const allowedHashes = [
      'admin', 'project', 'about-me', 'education', 'educational', 
      'personality', 'hobbies', 'career-journey', 'skills', 'career-goals'
    ];
    const isAllowed = allowedHashes.some(allowed => initialHash.includes(allowed));
    if (initialHash && !isAllowed) {
      window.location.hash = '';
    }

    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        setIsAdminView(true);
        setActiveProjectPresentationId(null);
        setIsStoryView(false);
      } else if (hash.startsWith('#/project/') || hash.startsWith('#project/')) {
        const id = hash.replace(/^#\/?project\//, '');
        setActiveProjectPresentationId(id);
        setIsAdminView(false);
        setIsStoryView(false);
      } else if (hash === '#/about-me' || hash === '#about-me') {
        setIsStoryView(true);
        setAboutSubPage(null);
        setIsAdminView(false);
        setActiveProjectPresentationId(null);
        setActiveSection('profil');
      } else if (
        hash.startsWith('#/about-me/') || 
        hash.startsWith('#about-me/') ||
        hash === '#/education' || hash === '#education' ||
        hash === '#/educational' || hash === '#educational' ||
        hash === '#/personality' || hash === '#personality' ||
        hash === '#/hobbies' || hash === '#hobbies' ||
        hash === '#/career-journey' || hash === '#career-journey' ||
        hash === '#/skills' || hash === '#skills' ||
        hash === '#/career-goals' || hash === '#career-goals'
      ) {
        let sub = '';
        if (hash.startsWith('#/about-me/')) {
          sub = hash.replace(/^#\/?about-me\//, '');
        } else if (hash.startsWith('#about-me/')) {
          sub = hash.replace(/^#about-me\//, '');
        } else {
          sub = hash.replace(/^#\/?/, '');
        }
        
        // Map 'educational' to 'education' internally so AboutMeSubPages renders it correctly
        if (sub === 'educational') {
          sub = 'education';
        }
        
        setIsStoryView(true);
        setAboutSubPage(sub);
        setIsAdminView(false);
        setActiveProjectPresentationId(null);
        setActiveSection('profil');
      } else {
        setIsAdminView(false);
        setActiveProjectPresentationId(null);
        setIsStoryView(false);
        setAboutSubPage(null);
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
      if (isStoryView) return;

      // If we are scrolled close to the bottom of the page, immediately highlight 'contact'
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

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
  }, [isStoryView]);

  const scrollToSection = (id: string) => {
    if (id === 'profil') {
      window.location.hash = '#/about-me';
    } else {
      window.location.hash = '';
      setIsStoryView(false);
      setActiveSection(id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const currentProfileImageUrl = theme === 'dark' && cvData.homeImageUrlDark 
    ? cvData.homeImageUrlDark 
    : (cvData.homeImageUrl || "");

  const isPng = currentProfileImageUrl ? (
    currentProfileImageUrl.toLowerCase().includes('.png') || 
    currentProfileImageUrl.toLowerCase().includes('data:image/png') ||
    currentProfileImageUrl.toLowerCase().includes('blob:')
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
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060913] text-white select-none"
          >
            <div className="flex flex-col items-center gap-6 max-w-md px-6 text-center">
              {/* Modern pulsing ring/halo or tech indicator */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-2xl border-2 border-emerald-500/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-2 rounded-xl border border-dashed border-emerald-500/30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Database className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[10px] tracking-[0.35em] text-slate-400 uppercase">
                  PORTFOLIO
                </p>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-white uppercase"
                >
                  {cvData.nickname || cvData.name || "PORTFOLIO"}
                </motion.h1>
              </div>

              {/* Progress track */}
              <div className="w-48 space-y-2.5 mt-2">
                <div className="h-1 w-full bg-slate-800/60 rounded-full overflow-hidden border border-slate-800/20">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    style={{ width: `${loadingProgress}%` }}
                    transition={{ type: "tween", ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-400">
                  <span className="text-emerald-400 tracking-wider">
                    {loadingProgress < 100 ? "MEMUAT DATA..." : "SINKRONISASI SELESAI"}
                  </span>
                  <span className="font-bold text-white tracking-widest">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        matchedProject ? (
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
      
      {/* 1. TOP TRANSPARENT NAVIGATION BAR - FIXED ON HOME, HIDDEN ELSEWHERE */}
      {!isStoryView && (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 w-full z-50 bg-transparent border-none shadow-none transition-colors duration-250"
        >
          <nav className="flex justify-between items-center max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'
              }`}>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Right-aligned Navigation links & Action Controls group */}
            <div className="flex items-center gap-6">
              {/* Nav links (Desktop only) */}
              <div className="hidden md:flex gap-1.5 items-center">
                {['home', 'projects', 'skills', 'experience', 'contact'].map((section) => {
                  const active = activeSection === section;
                  return (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className={`font-sans text-xs uppercase tracking-widest font-bold cursor-pointer transition-all duration-300 px-3.5 py-2 rounded-full border relative ${
                        active 
                          ? (theme === 'dark' 
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-xs' 
                              : 'text-emerald-700 bg-emerald-500/10 border-emerald-500/10 shadow-xs') 
                          : (theme === 'dark' 
                              ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04]' 
                              : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-black/[0.03]')
                      }`}
                    >
                      {section}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2.5">
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

                {/* Download CV (Icon only, as requested) */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCvModalOpen(true)}
                  title="Download CV"
                  className={`p-2 rounded-lg transition-all cursor-pointer select-none border flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent shadow-xs' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </nav>
        </motion.header>
      )}

      {/* 2. MAIN GRID LAYOUT CONTENT */}
      <main className="flex-grow pt-0">
        {isStoryView ? (
          <AnimatePresence mode="wait">
            {aboutSubPage ? (
              <AboutMeSubPages 
                key={`subpage-${aboutSubPage}`}
                subPage={aboutSubPage}
                cvData={cvData}
                theme={theme}
                onBackToStory={() => setAboutSubPage(null)}
              />
            ) : (
              <AboutMeStoryPage 
                key="story-main"
                cvData={cvData}
                theme={theme}
                onBackToMain={() => scrollToSection('home')}
                onGoToProjects={() => scrollToSection('projects')}
              />
            )}
          </AnimatePresence>
        ) : (
          <>
            {/* HERO HERO SECTION */}
        <section id="home" className={`relative min-h-[90vh] flex items-center overflow-hidden border-b transition-colors duration-250 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* BACKGROUND CUSTOMIZER OVERLAYS */}
          {(() => {
            const bgStyle = cvData.webTexts?.home_bg_style || 'dots';
            const customBgUrl = cvData.webTexts?.home_bg_custom_url || '';
            const customBgOpacity = parseFloat(cvData.webTexts?.home_bg_custom_opacity || '0.15');

            if (bgStyle === 'dots') {
              return (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.25] transition-opacity duration-500" 
                  style={{
                    backgroundImage: `radial-gradient(circle, ${theme === 'dark' ? '#475569' : '#94a3b8'} 1.5px, transparent 1.5px)`,
                    backgroundSize: '24px 24px'
                  }}
                />
              );
            }
            if (bgStyle === 'grid') {
              return (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.15] transition-opacity duration-500" 
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, ${theme === 'dark' ? '#475569' : '#cbd5e1'} 1px, transparent 1px),
                      linear-gradient(to bottom, ${theme === 'dark' ? '#475569' : '#cbd5e1'} 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />
              );
            }
            if (bgStyle === 'ambient') {
              return (
                <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-500 select-none">
                  <div 
                    className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] -right-20 -top-40 opacity-[0.25] transition-colors duration-500 ${
                      theme === 'dark' ? 'bg-emerald-500/30' : 'bg-emerald-300/40'
                    }`}
                  />
                  <div 
                    className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] -left-20 bottom-[-100px] opacity-[0.18] transition-colors duration-500 ${
                      theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-300/30'
                    }`}
                  />
                </div>
              );
            }
            if (bgStyle === 'abstract') {
              return (
                <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-500 select-none">
                  <div 
                    className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12]" 
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, ${theme === 'dark' ? '#cbd5e1' : '#1e293b'} 0px, ${theme === 'dark' ? '#cbd5e1' : '#1e293b'} 1px, transparent 0, transparent 50%),
                        repeating-linear-gradient(-45deg, ${theme === 'dark' ? '#cbd5e1' : '#1e293b'} 0px, ${theme === 'dark' ? '#cbd5e1' : '#1e293b'} 1px, transparent 0, transparent 50%)
                      `,
                      backgroundSize: '60px 60px'
                    }}
                  />
                  <div 
                    className={`absolute w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-transparent via-transparent to-transparent opacity-[0.25] transition-colors duration-500 ${
                      theme === 'dark' ? 'from-emerald-950/20 to-slate-900' : 'from-emerald-100/30 to-white'
                    }`}
                  />
                </div>
              );
            }
            if (bgStyle === 'custom_upload' && customBgUrl) {
              return (
                <div 
                  className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-500 select-none"
                  style={{ opacity: customBgOpacity }}
                >
                  <img 
                    src={customBgUrl} 
                    alt="Custom Background Watermark" 
                    className="w-full h-full object-cover grayscale brightness-110 contrast-125 select-none pointer-events-none"
                  />
                </div>
              );
            }
            return null;
          })()}
          
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 xl:gap-16 2xl:gap-24 relative z-10 w-full">
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
                className={`font-sans text-base sm:text-lg mb-8 max-w-xl xl:max-w-2xl leading-relaxed text-justify whitespace-pre-line mr-auto transition-colors duration-200 ${
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
              <div 
                className={`relative w-full aspect-square max-w-[420px] xl:max-w-[500px] 2xl:max-w-[560px] group transition-all duration-300 ease-out hover:scale-105 cursor-pointer ${isPng ? '' : 'hover:shadow-2xl'}`}
                onClick={() => scrollToSection('profil')}
                title="Buka Halaman Tentang Saya (Story)"
              >
                {/* Image Wrapper */}
                <div className={`w-full h-full rounded-2xl transition-all overflow-hidden relative flex items-center justify-center ${
                  isPng 
                    ? 'bg-transparent border-transparent' 
                    : (theme === 'dark' ? 'border border-slate-800 bg-slate-900/60 shadow-xl' : 'border border-slate-200 bg-slate-100 shadow-xl')
                }`}>
                  {currentProfileImageUrl ? (
                    <img 
                      className={`w-full h-full transition-transform duration-700 ease-out select-none pointer-events-none ${
                        isPng ? 'object-contain' : 'object-cover grayscale-[15%] group-hover:scale-102'
                      }`}
                      referrerPolicy="no-referrer"
                      alt="Professional Portfolio Visual" 
                      src={currentProfileImageUrl}
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
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="space-y-6 max-w-4xl xl:max-w-5xl">
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
        <section id="contact" className={`min-h-[85vh] flex items-center pt-32 pb-44 transition-colors relative ${
          theme === 'dark' ? 'bg-[#111827] border-t border-slate-850' : 'bg-white'
        }`}>
          <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm 
              email={cvData.email} 
              location={cvData.location} 
              webTexts={cvData.webTexts} 
            />
          </div>
        </section>

          </>
        )}
      </main>

      {/* 3. PROFESSIONAL FOOTER */}
      <footer className={`transition-colors duration-250 py-12 border-t ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 text-slate-400' 
          : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] text-slate-500 text-center sm:text-left select-none">
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
                    className={`h-9 w-9 hover:w-auto max-w-[36px] hover:max-w-[240px] pl-[9px] hover:pl-3 pr-[9px] hover:pr-3 rounded-lg transition-all duration-300 border cursor-pointer flex items-center justify-start overflow-hidden group ${
                      theme === 'dark' 
                        ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                    }`}
                    title={`Open ${s.name}: ${s.value || s.usernameOrUrl}`}
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <SocialIcon platform={s.name} size={16} className="w-4 h-4 transition-transform group-hover:scale-110" useBrandColor={true} />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold whitespace-nowrap opacity-0 max-w-0 transition-all duration-300 group-hover:opacity-100 group-hover:max-w-[180px] group-hover:ml-2">
                      {s.value || s.name}
                    </span>
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
      ))}
    </>
  );
}
