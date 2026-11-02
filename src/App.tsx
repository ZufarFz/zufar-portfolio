import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { 
  Database,
  Globe,
  Download,
  Pencil,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CASE_STUDIES } from './data/portfolioData';
import { ResumeModal } from './components/resume';
import { ProjectDetailModal } from './components/modals';
import { AdminLoginPage } from './components/admin';
import { CaseStudyPresentationPage, AboutMeStoryPage, AboutMeSubPages } from './components/subpages';


import { QuickEditorDrawer } from './components/editor';
import { MobilePhoneMockup, GooeyCursor } from './components/effects';

import { fetchCVData, downloadCVDataAsTypeScript, DEFAULT_CV_DATA, EMPTY_CV_DATA, DEFAULT_WEB_TEXTS, STORAGE_KEY } from './lib/storage';
import { CVData, CaseStudy } from './types';
import { getThemeColorPalette } from './lib/themeUtils';
import { Navbar, MobileNav, Footer } from './components/layout';
import { HeroSection, ProjectsSection, SkillsSection, ExperienceSection, ContactSection } from './components/sections';
import { getLocalizedCVData, ID_TRANSLATIONS } from './lib/localization';

export default function App() {
  const checkIsAdminAuthenticated = () => {
    try {
      return sessionStorage.getItem('admin_session_auth') === 'true';
    } catch {
      return false;
    }
  };

  const isCurrentUrlPreview = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'prev') return true;
    if ((parts[0] === 'id' || parts[0] === 'en') && parts[1] === 'admin' && parts[2] === 'prev') return true;
    if (parts[0] === 'admin' && parts[1] === 'prev') return true;
    return false;
  };

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(() => {
    return isCurrentUrlPreview() && checkIsAdminAuthenticated();
  });

  const isSimulatedMobileFrame = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('simulated_mobile') === '1'
  );

  const [lang, setLang] = useState<'id' | 'en'>(() => {
    // 1. Check current URL path prefix first
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'prev') {
      parts.shift();
    }
    if (parts[0] === 'id' || parts[0] === 'en') {
      try {
        localStorage.setItem('bi-portfolio-lang', parts[0]);
      } catch (_) {}
      return parts[0] as 'id' | 'en';
    }

    // 2. Check localStorage
    try {
      const saved = localStorage.getItem('bi-portfolio-lang');
      if (saved === 'id' || saved === 'en') return saved;
    } catch (_) {}

    // 3. Default to English (en) for first-time visitors
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('bi-portfolio-lang', lang);
    } catch (_) {}

    // Ensure URL has the language prefix and respects isPreviewMode / admin structure
    const parts = window.location.pathname.split('/').filter(Boolean);
    let isPrev = false;
    if (parts[0] === 'prev') {
      isPrev = true;
      parts.shift();
    }

    if (parts[0] !== 'id' && parts[0] !== 'en') {
      if (parts[0] === 'admin' && parts[1] === 'prev') {
        parts.splice(0, 2);
        const newPathname = `/${lang}/admin/prev` + (parts.length > 0 ? '/' + parts.join('/') : '');
        window.history.replaceState(null, '', newPathname + window.location.search + window.location.hash);
      } else if (parts[0] === 'admin') {
        parts.shift();
        const newPathname = `/${lang}/admin` + (parts.length > 0 ? '/' + parts.join('/') : '');
        window.history.replaceState(null, '', newPathname + window.location.search + window.location.hash);
      } else {
        const newPathname = (isPrev ? `/${lang}/admin/prev` : `/${lang}`) + (parts.length > 0 ? '/' + parts.join('/') : '');
        window.history.replaceState(null, '', newPathname + window.location.search + window.location.hash);
      }
    }
  }, [lang]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? (isSimulatedMobileFrame || window.innerWidth < 768) : false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isSimulatedMobileFrame || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isSimulatedMobileFrame]);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const handleConfirmLanguageChange = () => {
    const targetLang = lang === 'id' ? 'en' : 'id';
    try {
      localStorage.setItem('bi-portfolio-lang', targetLang);
    } catch (_) {}

    const parsed = parseRoute();
    let prefix = `/${targetLang}`;
    if (parsed.isPreview && checkIsAdminAuthenticated()) {
      prefix = `/${targetLang}/admin/prev`;
    } else if (parsed.isAdmin) {
      prefix = `/${targetLang}/admin`;
    }
    
    let suffix = '';
    if (parsed.projectId) {
      suffix = `/project/${parsed.projectId}`;
    } else if (parsed.aboutSubPage) {
      suffix = `/${parsed.aboutSubPage}`;
    } else if (parsed.isStoryView) {
      suffix = `/about-me`;
    } else if (parsed.activeSection && parsed.activeSection !== 'home') {
      suffix = `/${parsed.activeSection}`;
    }

    const newPathname = prefix + suffix;
    window.location.href = newPathname + window.location.search + window.location.hash;
  };

  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cvModalDirectDownload, setCvModalDirectDownload] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState<CaseStudy | null>(null);
  const [isQuickEditorOpen, setIsQuickEditorOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>(() => {
    return isSimulatedMobileFrame ? 'mobile' : 'desktop';
  });
  const isMobilePreviewActive = previewDevice === 'mobile' && !isSimulatedMobileFrame;
  const isEffectiveMobile = isMobile || isSimulatedMobileFrame || previewDevice === 'mobile';

  // Listen for real-time state sync from parent window when running in simulated mobile iframe
  useEffect(() => {
    if (!isSimulatedMobileFrame) return;

    const handleParentMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_CV_DATA' && event.data.data) {
        setCvData(event.data.data);
        if (event.data.theme) {
          setTheme(event.data.theme);
          if (event.data.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        if (event.data.lang) {
          setLang(event.data.lang);
        }
      }
    };

    window.addEventListener('message', handleParentMessage);

    // Notify parent frame that iframe is ready to receive sync
    try {
      window.parent?.postMessage({ type: 'MOBILE_FRAME_READY' }, '*');
    } catch (_) {}

    return () => window.removeEventListener('message', handleParentMessage);
  }, [isSimulatedMobileFrame]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cvData, setCvData] = useState<CVData>(() => {
    // Only load from localStorage in protected admin preview mode (/admin/prev)
    if (isCurrentUrlPreview() && checkIsAdminAuthenticated()) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bi-portfolio-cv-data');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            return {
              ...DEFAULT_CV_DATA,
              ...parsed,
              webTexts: {
                ...DEFAULT_WEB_TEXTS,
                ...(parsed.webTexts || {})
              }
            };
          }
        }
      } catch (_) {}
    }
    // Public / Non-preview pages strictly use pristine DEFAULT_CV_DATA from portfolioData.ts
    return DEFAULT_CV_DATA;
  });

  const activeCVData = getLocalizedCVData(cvData, lang);
  const [activeSection, setActiveSection] = useState('home');
  const [isStoryView, setIsStoryView] = useState(false);
  const isStoryViewRef = useRef(false);

  useEffect(() => {
    isStoryViewRef.current = isStoryView;
  }, [isStoryView]);

  const [aboutSubPage, setAboutSubPage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [elapsedMinTime, setElapsedMinTime] = useState(false);
  const [canFinishLoading, setCanFinishLoading] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  // Dynamically update document title immediately based on profile nickname/name
  useEffect(() => {
    const displayName = activeCVData.nickname || activeCVData.name;
    document.title = displayName ? `Portfolio ${displayName}` : 'Portfolio';
  }, [activeCVData.nickname, activeCVData.name]);
  const lastScrollY = useRef(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navbarWidth, setNavbarWidth] = useState(0);
  const [navbarRight, setNavbarRight] = useState(0);

  // Monitor the navbar size and position when it is rendered
  useEffect(() => {
    if (isStoryView) return;
    
    const updateNavbarPosition = () => {
      if (!navbarRef.current) return;
      const rect = navbarRef.current.getBoundingClientRect();
      // Only update if it has valid dimensions
      if (rect.width > 0) {
        setNavbarWidth(rect.width);
        setNavbarRight(window.innerWidth - rect.right);
      }
    };

    // Run multiple times on mount/loading finish to ensure layout is perfect
    updateNavbarPosition();
    const t1 = setTimeout(updateNavbarPosition, 100);
    const t2 = setTimeout(updateNavbarPosition, 500);
    const t3 = setTimeout(updateNavbarPosition, 1000);
    const t4 = setTimeout(updateNavbarPosition, 2000);

    window.addEventListener('resize', updateNavbarPosition);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('resize', updateNavbarPosition);
    };
  }, [isStoryView, isLoading]);

  // Auto-hide header navigation on scroll down, show on scroll up/top or button click
  useEffect(() => {
    if (isStoryView) return;

    const handleScrollVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // If at the very top of the page, keep the nav bar visible
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current + 15 && currentScrollY > 80) {
        // Scrolling down past threshold -> hide navbar
        setIsNavVisible(false);
        setMobileMenuOpen(false);
      } else if (currentScrollY < lastScrollY.current - 20) {
        // Scrolling up -> show navbar
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, [isStoryView]);

  // Set timeout for 0.8 seconds to show "LOADING/MEMUAT" first
  useEffect(() => {
    const t = setTimeout(() => {
      setElapsedMinTime(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Set timeout for 2.0 seconds total (giving 1.2 seconds of name visibility) before finishing loading
  useEffect(() => {
    const t = setTimeout(() => {
      setCanFinishLoading(true);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Smooth loading progress animation
  useEffect(() => {
    let timer: any;
    const updateProgress = () => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // If assets are loaded and we can finish loading, we speed up to 100%
        if (isAssetsLoaded && canFinishLoading) {
          const step = Math.ceil((100 - prev) / 3);
          const next = prev + (step > 1 ? step : 1);
          return next >= 100 ? 100 : next;
        }
        
        // Otherwise, animate smoothly up to 99% and wait there
        if (prev < 99) {
          // Calculate step to reach 99% gradually
          // E.g. make it climb relatively fast at first, then slow down as it approaches 99%
          const remaining = 99 - prev;
          let step = 0;
          if (prev < 50) {
            step = Math.floor(Math.random() * 4) + 2; // 2-5% per step
          } else if (prev < 80) {
            step = Math.floor(Math.random() * 3) + 1; // 1-3% per step
          } else if (prev < 95) {
            step = Math.floor(Math.random() * 2) + 0.5; // 0.5-1.5% per step
          } else {
            step = 0.2; // very slow creep close to 99
          }
          const next = prev + step;
          return next >= 99 ? 99 : next;
        }
        
        // Hold at 99%
        return 99;
      });
    };

    timer = setInterval(updateProgress, 30);
    return () => clearInterval(timer);
  }, [isAssetsLoaded, canFinishLoading]);

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
    const saved = localStorage.getItem('bi-portfolio-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleThemeWithAnimation = (targetTheme: 'light' | 'dark', e?: React.MouseEvent | React.TouchEvent | any) => {
    // Keep navigation bar visible and lock scroll-hide ref during theme toggling
    setIsNavVisible(true);
    lastScrollY.current = window.scrollY + 200;

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fallback immediately if View Transition API is not supported or user prefers reduced motion
    if (prefersReducedMotion || !(document as any).startViewTransition) {
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setTheme(targetTheme);
      if (isSimulatedMobileFrame) {
        try {
          window.parent?.postMessage({ type: 'CHILD_THEME_CHANGED', theme: targetTheme }, '*');
        } catch (_) {}
      }
      return;
    }

    // Determine the exact visual center (x, y) of the theme toggle button
    let x = Math.round(window.innerWidth / 2);
    let y = Math.round(window.innerHeight / 2);
    let targetButtonRect: DOMRect | null = null;

    // 1. Primary: Direct lookup of active toggle buttons in DOM
    const desktopBtn = document.getElementById('theme-toggle-desktop-btn');
    const mobileBtn = document.getElementById('theme-toggle-mobile-btn');
    const adminBtn = document.getElementById('theme-toggle-admin-btn');

    for (const btn of [desktopBtn, mobileBtn, adminBtn]) {
      if (btn) {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.top >= -50 && rect.top <= window.innerHeight + 50) {
          targetButtonRect = rect;
          break;
        }
      }
    }

    // 2. Secondary: Check event target or closest button if event was triggered directly
    if (!targetButtonRect && e) {
      const el = (e.currentTarget as HTMLElement) || (e.target as HTMLElement)?.closest?.('button');
      if (el && typeof el.getBoundingClientRect === 'function') {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          targetButtonRect = rect;
        }
      }
    }

    // 3. Fallback: Search any theme toggle button in active DOM
    if (!targetButtonRect) {
      const anyThemeBtn = document.querySelector<HTMLElement>(
        '[data-theme-toggle], [title*="Mode"], [title*="Terang"], [title*="Gelap"]'
      );
      if (anyThemeBtn) {
        const rect = anyThemeBtn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          targetButtonRect = rect;
        }
      }
    }

    // Calculate center coordinates from the button element with integer precision
    if (targetButtonRect) {
      x = Math.round(targetButtonRect.left + targetButtonRect.width / 2);
      y = Math.round(targetButtonRect.top + targetButtonRect.height / 2);
    } else if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number' && e.clientX > 0 && e.clientY > 0) {
      x = Math.round(e.clientX);
      y = Math.round(e.clientY);
    }

    const endRadius = Math.ceil(
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
    );

    // Fast, synchronous state update before taking snapshot so React doesn't drop frames during animation
    const transition = (document as any).startViewTransition(() => {
      flushSync(() => {
        setTheme(targetTheme);
      });
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      if (isSimulatedMobileFrame) {
        try {
          window.parent?.postMessage({ type: 'CHILD_THEME_CHANGED', theme: targetTheme }, '*');
        } catch (_) {}
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
          duration: isMobile ? 260 : 320,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  useEffect(() => {
    localStorage.setItem('bi-portfolio-theme', theme);
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
      const saved = localStorage.getItem('bi-portfolio-theme');
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

  // Load CV data and preload all assets on mount
  useEffect(() => {
    async function loadData() {
      const parsed = parseRoute();
      const isPrev = (parsed.isPreview || isCurrentUrlPreview()) && checkIsAdminAuthenticated();
      let activeData = DEFAULT_CV_DATA;
      
      // 1. Fetch from storage/file based on route mode
      try {
        const data = await fetchCVData(isPrev ? 'preview' : 'live');
        setCvData(data);
        activeData = data;
      } catch (err) {
        console.error('Failed to load CV data:', err);
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

  const parseRoute = () => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean);
    
    let isLegacyPrev = false;
    if (parts[0] === 'prev') {
      isLegacyPrev = true;
      parts.shift();
    }

    let routeLang: 'id' | 'en' = lang;
    if (parts[0] === 'id' || parts[0] === 'en') {
      routeLang = parts[0] as 'id' | 'en';
      parts.shift();
    }
    
    let isPrev = isLegacyPrev;
    let isSubpageAdmin = false;
    let projId: string | null = null;
    let isStory = false;
    let subPage: string | null = null;
    let currentSec = 'home';

    if (parts.length > 0) {
      const first = parts[0];
      if (first === 'admin') {
        parts.shift();
        const next = parts[0];
        if (next === 'prev') {
          isPrev = true;
          parts.shift();
        } else {
          isSubpageAdmin = true;
        }
      }
    }

    if (parts.length > 0 && !isSubpageAdmin) {
      const action = parts[0];
      if (action === 'project' && parts[1]) {
        projId = parts[1];
      } else if (action === 'about-me') {
        isStory = true;
        if (parts[1]) {
          subPage = parts[1];
        }
      } else {
        const customSubIds = (activeCVData.customSubPages || []).map(p => p.id);
        const allowedSubs = [
          'education', 'educational', 'personality', 'hobbies', 
          'career-journey', 'skills', 'projects', 'career-goals',
          ...customSubIds
        ];
        if (allowedSubs.includes(action) || action.startsWith('page-') || action.startsWith('custom-')) {
          isStory = true;
          let mapped = action;
          if (mapped === 'educational') {
            mapped = 'education';
          } else if (mapped === 'career-goals') {
            mapped = 'projects';
          }
          subPage = mapped;
        } else {
          currentSec = action;
        }
      }
    }

    return {
      lang: routeLang,
      isPreview: isPrev,
      isAdmin: isSubpageAdmin,
      projectId: projId,
      isStoryView: isStory,
      aboutSubPage: subPage,
      activeSection: currentSec,
      isLegacyPrev
    };
  };

  const navigateToPath = (sub: string | null, targetPreview?: boolean) => {
    const usePrev = targetPreview !== undefined ? targetPreview : isPreviewMode;
    
    // If targetPreview is requested but user is not logged in as admin, redirect to admin login
    if (usePrev && !checkIsAdminAuthenticated()) {
      const adminPath = `/${lang}/admin`;
      if (window.location.pathname !== adminPath) {
        window.history.pushState(null, '', adminPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }

    let prefix = `/${lang}`;
    if (usePrev) {
      prefix = `/${lang}/admin/prev`;
    }
    
    let suffix = '';
    if (sub) {
      if (sub === 'about-me') {
        suffix = '/about-me';
      } else if (sub.startsWith('about-me/')) {
        const subSub = sub.replace(/^about-me\//, '');
        suffix = '/' + subSub;
      } else if (sub === 'admin') {
        const adminPath = `/${lang}/admin`;
        if (window.location.pathname !== adminPath) {
          window.history.pushState(null, '', adminPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return;
      } else if (sub.startsWith('project/')) {
        suffix = '/' + sub;
      } else {
        // Direct subpage like 'education'
        suffix = '/' + sub;
      }
    }
    const newPath = prefix + suffix;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Support pathname-based routing: admin, about-me & presentation slides paths
  useEffect(() => {
    // Legacy support: convert hashes to clean pathnames on load
    const hash = window.location.hash;
    if (hash) {
      let clean = hash.replace(/^#\/?/, '');
      window.location.hash = ''; // Clear hash
      
      const parts = clean.split('/').filter(Boolean);
      const isPrev = parts[0] === 'prev';
      if (isPrev) parts.shift();
      const newPathname = (isPrev ? `/${lang}/admin/prev` : `/${lang}`) + (parts.length > 0 ? '/' + parts.join('/') : '');
      window.history.replaceState(null, '', newPathname + window.location.search);
    }

    const checkRoute = () => {
      const parsed = parseRoute();

      // Normalize legacy /prev route
      if (parsed.isLegacyPrev) {
        const remaining: string[] = [];
        if (parsed.projectId) remaining.push('project', parsed.projectId);
        else if (parsed.aboutSubPage) remaining.push(parsed.aboutSubPage);
        else if (parsed.isStoryView) remaining.push('about-me');
        else if (parsed.activeSection && parsed.activeSection !== 'home') remaining.push(parsed.activeSection);
        
        const newPath = `/${parsed.lang}/admin/prev` + (remaining.length > 0 ? '/' + remaining.join('/') : '');
        window.history.replaceState(null, '', newPath + window.location.search);
      }

      // Authentication Guard for Preview Mode (/admin/prev)
      if (parsed.isPreview) {
        const isAuthed = checkIsAdminAuthenticated();
        if (!isAuthed) {
          // If not authenticated as admin, redirect to admin login page
          setIsPreviewMode(false);
          setIsAdminView(true);
          const adminPath = `/${parsed.lang}/admin`;
          window.history.replaceState(null, '', adminPath + window.location.search);
          return;
        }
      }

      // If user navigates to /admin but is already authenticated, immediately redirect to /admin/prev
      if (parsed.isAdmin) {
        const isAuthed = checkIsAdminAuthenticated();
        if (isAuthed) {
          setIsAdminView(false);
          setIsPreviewMode(true);
          const prevPath = `/${parsed.lang}/admin/prev`;
          window.history.replaceState(null, '', prevPath + window.location.search);
          return;
        }
      }

      setIsPreviewMode(parsed.isPreview);
      setIsAdminView(parsed.isAdmin);
      setActiveProjectPresentationId(parsed.projectId);
      setIsStoryView(parsed.isStoryView);
      setAboutSubPage(parsed.aboutSubPage);
      
      // Refresh CV Data: preview mode uses localStorage, public/live mode strictly uses pristine TS (DEFAULT_CV_DATA)
      const isPrev = parsed.isPreview && checkIsAdminAuthenticated();
      fetchCVData(isPrev ? 'preview' : 'live').then(data => {
        setCvData(data);
      });

      if (parsed.isStoryView) {
        setActiveSection('profil');
      } else {
        setActiveSection(parsed.activeSection || 'home');
        if (parsed.activeSection && parsed.activeSection !== 'home') {
          setTimeout(() => {
            const el = document.getElementById(parsed.activeSection);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    // Always check on mount
    checkRoute();

    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, [lang]);

  const openAdminView = () => {
    navigateToPath('admin');
  };

  const closeAdminView = () => {
    navigateToPath(null);
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
    if (id === 'profil' || id === 'about-me') {
      navigateToPath('about-me');
    } else {
      navigateToPath(null);
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



  const matchedProject = activeProjectPresentationId 
    ? (activeCVData.caseStudies || []).find(p => p.id === activeProjectPresentationId) 
    : null;

  const hasCachedData = (() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bi-portfolio-cv-data');
      return !!cached;
    } catch (_) {
      return false;
    }
  })();

  return (
    <>
      {/* Lightswind Gooey Liquid Metaball Cursor */}
      <GooeyCursor
        enabled={!isSimulatedMobileFrame && !isMobilePreviewActive && activeCVData.webTexts?.enable_gooey_cursor !== 'false'}
        theme={theme}
        size={activeCVData.webTexts?.gooey_cursor_size ? parseInt(activeCVData.webTexts.gooey_cursor_size, 10) : 18}
        opacity={activeCVData.webTexts?.gooey_cursor_opacity ? parseFloat(activeCVData.webTexts.gooey_cursor_opacity) : 0.8}
        hideDefaultCursor={activeCVData.webTexts?.gooey_hide_default_cursor === 'true'}
        enableSplash={activeCVData.webTexts?.gooey_cursor_splash !== 'false'}
        hoverScale={activeCVData.webTexts?.gooey_cursor_hover_scale === 'true'}
        hoverReaction={(activeCVData.webTexts?.gooey_cursor_hover_reaction as any) || 'question'}
        headStyle={(activeCVData.webTexts?.gooey_head_style as 'eyes' | 'none' | 'dot') || 'eyes'}
        color={
          theme === 'dark'
            ? (activeCVData.webTexts?.gooey_cursor_color_dark || activeCVData.webTexts?.gooey_cursor_color || getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary)
            : (activeCVData.webTexts?.gooey_cursor_color_light || activeCVData.webTexts?.gooey_cursor_color || getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary)
        }
        secondaryColor={
          theme === 'dark'
            ? (activeCVData.webTexts?.gooey_cursor_dot_dark || undefined)
            : (activeCVData.webTexts?.gooey_cursor_dot_light || undefined)
        }
      />

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060913] text-white select-none"
          >
            <div className="flex flex-col items-center gap-3 max-w-md px-6 text-center">
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

              <div className="space-y-1">
                <p className="font-mono text-[10px] tracking-[0.35em] text-slate-400 uppercase">
                  {lang === 'id' ? "PORTOFOLIO" : "PORTFOLIO"}
                </p>
                <div className="h-9 sm:h-10 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {!elapsedMinTime ? (
                      <motion.h1 
                        key="loading-state"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-white uppercase"
                      >
                        {lang === 'id' ? "MEMUAT" : "LOADING"}
                      </motion.h1>
                    ) : (
                      <motion.h1 
                        key="name-state"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-white uppercase"
                      >
                        {activeCVData.nickname || activeCVData.name || (lang === 'id' ? "MEMUAT" : "LOADING")}
                      </motion.h1>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-48 space-y-2 mt-0.5">
                <div className="h-1 w-full bg-slate-800/60 rounded-full overflow-hidden border border-slate-800/20">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    style={{ width: `${loadingProgress}%` }}
                    transition={{ type: "tween", ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-400">
                  <span className="text-emerald-400 tracking-wider">
                    {loadingProgress < 100 ? (lang === 'id' ? "MEMUAT DATA" : "LOADING DATA") : (lang === 'id' ? "SINKRONISASI SELESAI" : "SYNC COMPLETE")}
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
              navigateToPath(null);
              setActiveProjectPresentationId(null);
            }}
            theme={theme}
            authorName={activeCVData.name}
            authorTitle={activeCVData.title}
          />
        ) : isAdminView ? (
          <AdminLoginPage 
            onSuccess={() => {
              setIsAdminView(false);
              setIsPreviewMode(true);
              navigateToPath(null, true);
            }}
            onClose={closeAdminView} 
            lang={lang}
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
            {/* TOP PREVIEW BANNER BAR */}
            {isPreviewMode && !isAdminView && !matchedProject && !isSimulatedMobileFrame && (
              <div className="fixed top-0 inset-x-0 z-[60] bg-slate-950/95 text-white border-b border-emerald-500/40 backdrop-blur-md px-3 sm:px-6 py-2 shadow-xl shadow-black/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[11px] tracking-wider text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
                      /{lang}/admin/prev
                    </span>
                    <span className="hidden sm:inline text-[11px] text-slate-300">
                      {lang === 'id' ? 'Mode Pratinjau Terproteksi Admin (Data Draft Lokal)' : 'Admin Protected Preview Mode (Local Draft Data)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sessionStorage.removeItem('admin_session_auth');
                      } catch (_) {}
                      setIsPreviewMode(false);
                      const currentSub = aboutSubPage 
                        ? (aboutSubPage === 'about-me' ? 'about-me' : `about-me/${aboutSubPage}`) 
                        : (activeSection !== 'home' ? activeSection : null);
                      navigateToPath(currentSub, false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white border border-red-800/60 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-97"
                    title={lang === 'id' ? 'Keluar sesi admin dan kembali ke website publik' : 'Logout admin session and return to public website'}
                  >
                    <span>🔒 Logout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCVDataAsTypeScript(cvData)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm select-none active:scale-97"
                    title="Unduh file portfolioData.ts siap pakai untuk langsung replace file lama di project"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Unduh</span>
                    <span>portfolioData.ts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const currentSub = aboutSubPage 
                        ? (aboutSubPage === 'about-me' ? 'about-me' : `about-me/${aboutSubPage}`) 
                        : (activeSection !== 'home' ? activeSection : null);
                      navigateToPath(currentSub, false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 font-medium text-[11px] flex items-center gap-1 transition-all cursor-pointer select-none active:scale-97"
                    title="Buka versi web asli (data portfolioData.ts)"
                  >
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="hidden xs:inline">Web</span> Asli
                  </button>
                </div>
              </div>
            )}
      
      {/* 1. TOP NAVIGATION BAR - FIXED ON HOME, HIDDEN ELSEWHERE */}
      {!isStoryView && !isMobilePreviewActive && (
        <>
          <Navbar
            isNavVisible={isNavVisible}
            setIsNavVisible={setIsNavVisible}
            navbarRef={navbarRef}
            navbarWidth={navbarWidth}
            navbarRight={navbarRight}
            lastScrollY={lastScrollY}
            theme={theme}
            toggleThemeWithAnimation={toggleThemeWithAnimation}
            lang={lang}
            onConfirmLanguageChange={handleConfirmLanguageChange}
            activeSection={activeSection}
            scrollToSection={scrollToSection}
            activeCVData={activeCVData}
            isPreviewMode={isPreviewMode}
            isSimulatedMobileFrame={isSimulatedMobileFrame}
          />
          <MobileNav
            theme={theme}
            toggleThemeWithAnimation={toggleThemeWithAnimation}
            lang={lang}
            onConfirmLanguageChange={handleConfirmLanguageChange}
            activeSection={activeSection}
            scrollToSection={scrollToSection}
            activeCVData={activeCVData}
            isPreviewMode={isPreviewMode}
            isSimulatedMobileFrame={isSimulatedMobileFrame}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </>
      )}
      {/* 2. MAIN CONTENT AREA: REAL SMARTPHONE SIMULATOR OR STANDARD FULLSCREEN MAIN */}
      {isMobilePreviewActive ? (
        <div className="flex-grow pt-4 pb-12 flex items-center justify-center">
          <MobilePhoneMockup
            cvData={cvData}
            theme={theme}
            lang={lang}
            onClose={() => setPreviewDevice('desktop')}
            onThemeChange={(newTheme) => {
              setTheme(newTheme);
              if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }}
            onLangChange={(newLang) => setLang(newLang)}
          />
        </div>
      ) : (
        <main className={`flex-grow transition-all duration-300 ${isPreviewMode && !isSimulatedMobileFrame ? 'pt-10' : 'pt-0'}`}>
        <AnimatePresence mode="wait">
          {aboutSubPage ? (
            <AboutMeSubPages 
              key={`subpage-${aboutSubPage}`}
              subPage={aboutSubPage}
              cvData={activeCVData}
              theme={theme}
              lang={lang}
              onBackToStory={() => {
                navigateToPath('about-me');
              }}
            />
          ) : isStoryView ? (
            <AboutMeStoryPage 
              key="story-main"
              cvData={activeCVData}
              theme={theme}
              onBackToMain={() => scrollToSection('home')}
              onGoToProjects={() => scrollToSection('projects')}
              onNavigateSubpage={(sub) => {
                navigateToPath(sub);
              }}
            />
          ) : (
            <motion.div
              key="home-main-sections"
              ref={(node) => {
                if (node) {
                  const parsed = parseRoute();
                  // Scroll to top instantly if no deep section anchor is active
                  if (!parsed.activeSection || parsed.activeSection === 'home') {
                    window.scrollTo(0, 0);
                  }
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
            <HeroSection
              activeCVData={activeCVData}
              theme={theme}
              lang={lang}
              isEffectiveMobile={isEffectiveMobile}
              isMobile={isMobile}
              scrollToSection={scrollToSection}
              setCvModalDirectDownload={setCvModalDirectDownload}
              setCvModalOpen={setCvModalOpen}
            />
            <ProjectsSection
              activeCVData={activeCVData}
              theme={theme}
              lang={lang}
              isEffectiveMobile={isEffectiveMobile}
              isMobile={isMobile}
              setSelectedProjectModal={setSelectedProjectModal}
              navigateToPath={navigateToPath}
              scrollToSection={scrollToSection}
            />
            <SkillsSection
              activeCVData={activeCVData}
              theme={theme}
              lang={lang}
              isEffectiveMobile={isEffectiveMobile}
              onNavigateToSkills={() => navigateToPath('skills')}
            />
            <ExperienceSection
              activeCVData={activeCVData}
              theme={theme}
              isEffectiveMobile={isEffectiveMobile}
            />
            <ContactSection
              activeCVData={activeCVData}
              theme={theme}
              lang={lang}
              isEffectiveMobile={isEffectiveMobile}
            />

            </motion.div>
          )}
        </AnimatePresence>
      </main>
      )}

      {/* 3. PROFESSIONAL FOOTER */}
      {!isMobilePreviewActive && (
        <Footer activeCVData={activeCVData} theme={theme} />
      )}

      {/* 4. MODALS PREVIEW DRAWER */}
      <AnimatePresence>
        {cvModalOpen && (
          <ResumeModal 
            onClose={() => setCvModalOpen(false)} 
            cvData={activeCVData} 
            onUpdate={(updated) => setCvData(updated)} 
            theme={theme}
            directDownload={cvModalDirectDownload}
          />
        )}
      </AnimatePresence>

      {/* PROJECT DETAIL POP-UP MODAL */}
      <ProjectDetailModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
        theme={theme}
        onDiscussProject={() => scrollToSection('contact')}
        lang={lang}
        activeCVData={activeCVData}
      />

      {/* 5. FLOATING PENCIL ACTION BUTTON & QUICK EDITOR DRAWER (PREVIEW MODE ONLY) */}
      {isPreviewMode && !isAdminView && !isSimulatedMobileFrame && (
        <>
          {/* Floating Pencil Button at Bottom-Right */}
          <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2">
            {!isQuickEditorOpen && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                type="button"
                onClick={() => setIsQuickEditorOpen(true)}
                className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-950/60 border-2 border-emerald-400/40 backdrop-blur-md cursor-pointer transition-all"
                title="Buka Visual Quick Editor (Edit tulisan halaman aktif langsung di sini)"
              >
                <Pencil className="w-5 h-5 transition-transform group-hover:rotate-12" />
                
                {/* Ping animation indicator */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-900"></span>
                </span>

                {/* Floating tooltip label on hover */}
                <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-slate-800">
                  ✏️ Quick Edit Halaman Aktif
                </span>
              </motion.button>
            )}
          </div>

          {/* Quick Editor Sidebar Drawer */}
          <QuickEditorDrawer
            isOpen={isQuickEditorOpen}
            onClose={() => setIsQuickEditorOpen(false)}
            cvData={cvData}
            onUpdateCV={(updated) => {
              setCvData(updated);
            }}
            currentLang={lang}
            activeSection={activeSection}
            aboutSubPage={aboutSubPage || undefined}
            isStoryView={isStoryView}
            activeProjectPresentationId={activeProjectPresentationId}
            theme={theme}
            previewDevice={previewDevice}
            onTogglePreviewDevice={setPreviewDevice}
          />
        </>
      )}



        </motion.div>
      ))}
    </>
  );
}
