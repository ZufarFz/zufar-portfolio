import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Sun, Moon, ChevronsDown } from 'lucide-react';
import { CVData } from '../../types';
import { getActiveTabStyle } from './navUtils';

interface NavbarProps {
  isNavVisible: boolean;
  setIsNavVisible: (visible: boolean) => void;
  navbarRef: React.RefObject<HTMLDivElement | null>;
  navbarWidth: number;
  navbarRight: number;
  lastScrollY: React.MutableRefObject<number>;
  theme: 'light' | 'dark';
  toggleThemeWithAnimation: (newTheme: 'light' | 'dark', e: React.MouseEvent) => void;
  lang: 'id' | 'en';
  onConfirmLanguageChange: () => void;
  activeSection: string;
  scrollToSection: (section: string) => void;
  activeCVData: CVData;
  isPreviewMode?: boolean;
  isSimulatedMobileFrame?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isNavVisible,
  setIsNavVisible,
  navbarRef,
  navbarWidth,
  navbarRight,
  lastScrollY,
  theme,
  toggleThemeWithAnimation,
  lang,
  onConfirmLanguageChange,
  activeSection,
  scrollToSection,
  activeCVData,
  isPreviewMode = false,
  isSimulatedMobileFrame = false,
}) => {
  const [showLangConfirm, setShowLangConfirm] = useState(false);
  const langContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langContainerRef.current && !langContainerRef.current.contains(e.target as Node)) {
        setShowLangConfirm(false);
      }
    };
    if (showLangConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangConfirm]);

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isNavVisible ? 1 : 0, 
          y: isNavVisible ? 0 : -70,
          pointerEvents: isNavVisible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`hidden md:block fixed left-0 right-0 w-full z-50 bg-transparent border-none shadow-none ${
          isPreviewMode && !isSimulatedMobileFrame ? 'top-10' : 'top-0'
        }`}
      >
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav 
            ref={navbarRef} 
            className={`w-fit ml-auto flex items-center h-9 md:h-9.5 mt-2 md:mt-2.5 px-3 md:px-3.5 py-0 rounded-full backdrop-blur-md transition-all duration-250 border ${
              theme === 'dark' 
                ? 'shadow-md shadow-black/30' 
                : 'shadow-sm shadow-slate-200/50'
            }`}
            style={{
              backgroundColor: theme === 'dark' 
                ? (activeCVData.webTexts?.navbar_bg_color_dark || 'rgba(24, 26, 27, 0.88)')
                : (activeCVData.webTexts?.navbar_bg_color || 'rgba(243, 240, 230, 0.88)'),
              borderColor: theme === 'dark'
                ? (activeCVData.webTexts?.navbar_border_color_dark || 'rgba(255, 255, 255, 0.12)')
                : (activeCVData.webTexts?.navbar_border_color || 'rgba(113, 136, 148, 0.3)'),
              color: theme === 'dark'
                ? (activeCVData.webTexts?.navbar_text_color_dark || '#E2E8F0')
                : (activeCVData.webTexts?.navbar_text_color || '#2D3136')
            }}
          >
            {/* DESKTOP VIEW */}
            <div className="flex items-center gap-2 md:gap-2.5">
              {/* Nav links (Desktop only) */}
              <div className="flex items-center gap-0.5 md:gap-1">
                {['home', 'projects', 'skills', 'experience', 'contact'].map((section) => {
                  const active = activeSection === section;
                  return (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className={`font-sans text-[10px] md:text-[10.5px] uppercase tracking-wider font-semibold cursor-pointer transition-all duration-300 px-2.5 py-1 md:px-3 md:py-1 rounded-full border relative whitespace-nowrap ${
                        active 
                          ? 'border-transparent shadow-2xs' 
                          : 'border-transparent hover:opacity-80 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                      style={active 
                        ? getActiveTabStyle(active, theme, activeCVData) 
                        : {
                            color: theme === 'dark' 
                              ? (activeCVData.webTexts?.navbar_text_color_dark || '#E2E8F0') 
                              : (activeCVData.webTexts?.navbar_text_color || '#2D3136')
                          }
                      }
                    >
                      {section}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 md:gap-2 pl-1 border-l border-slate-300/30 dark:border-slate-700/50">
                {/* Language Switcher Toggle with Confirmation Overlay */}
                <div className="relative" ref={langContainerRef}>
                  <button
                    onClick={() => setShowLangConfirm(!showLangConfirm)}
                    title={lang === 'id' ? "Switch to English" : "Ubah ke Bahasa Indonesia"}
                    className={`px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full border text-[9px] md:text-[10px] font-mono font-bold transition-all cursor-pointer select-none flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                      theme === 'dark' 
                        ? 'border-slate-700 text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white' 
                        : 'border-[#E3DDD3] text-[#2D3136] bg-white hover:bg-slate-50'
                    } ${showLangConfirm ? (theme === 'dark' ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-900 border-slate-300') : ''}`}
                  >
                    <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" style={{ color: theme === 'dark' ? '#F2A1B0' : '#C81D25' }} />
                    <span className="tracking-wide uppercase">{lang}</span>
                  </button>

                  <AnimatePresence>
                    {showLangConfirm && (
                      <motion.div
                        initial={{ y: -8, scaleX: 0.95, scaleY: 0.95, opacity: 0 }}
                        animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
                        exit={{ y: -8, scaleX: 0.95, scaleY: 0.95, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={`absolute top-full right-0 mt-1.5 p-3 rounded-xl border shadow-xl z-50 min-w-[240px] max-w-[280px] ${
                          theme === 'dark'
                            ? 'bg-slate-950 text-slate-100 border-slate-800 shadow-black/60'
                            : 'bg-white text-slate-800 border-slate-200 shadow-slate-200/60'
                        }`}
                      >
                        {/* Upward tiny triangle anchor */}
                        <div className={`absolute right-5 bottom-full w-2.5 h-2.5 rotate-45 border-t border-l -mb-1.5 ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                        }`} />

                        <div className="flex flex-col gap-2.5">
                          <p className="text-xs font-medium leading-relaxed">
                            {lang === 'id' 
                              ? "Yakin ingin mengubah bahasa ke Bahasa Inggris?" 
                              : "Are you sure you want to change the language to Indonesian?"
                            }
                          </p>
                          <div className="flex justify-end gap-1.5 mt-0.5">
                            <button
                              onClick={() => setShowLangConfirm(false)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                theme === 'dark'
                                  ? 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800'
                                  : 'text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              {lang === 'id' ? "Batal" : "Cancel"}
                            </button>
                            <button
                              onClick={() => {
                                setShowLangConfirm(false);
                                onConfirmLanguageChange();
                              }}
                              className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white shadow-2xs transition-all cursor-pointer"
                              style={{
                                backgroundColor: theme === 'dark'
                                  ? (activeCVData.webTexts?.hero_cta_primary_bg_dark || '#5E171E')
                                  : (activeCVData.webTexts?.hero_cta_primary_bg || '#701C24')
                              }}
                            >
                              {lang === 'id' ? "Ya, Ganti" : "Yes, Change"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dynamic Theme Toggle Icon */}
                <button
                  id="theme-toggle-desktop-btn"
                  data-theme-toggle="desktop"
                  onClick={(e) => toggleThemeWithAnimation(theme === 'dark' ? 'light' : 'dark', e)}
                  title={theme === 'dark' ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
                  className={`p-1 md:p-1.5 rounded-full transition-all cursor-pointer select-none border border-transparent ${
                    theme === 'dark' 
                      ? 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <Moon className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Floating Down-Arrow button to show Nav when hidden */}
      <div
        className="hidden md:block fixed top-0 z-50 pointer-events-none"
        style={{
          right: `${navbarRight + navbarWidth / 2}px`,
          transform: 'translateX(50%)'
        }}
      >
        <AnimatePresence>
          {!isNavVisible && (
            <motion.button
              key="reveal-nav-arrow"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsNavVisible(true);
                lastScrollY.current = window.scrollY + 150; // Delay next scroll hide
              }}
              className={`pointer-events-auto w-10 h-5 md:w-12 md:h-5.5 flex items-center justify-center rounded-b-full rounded-t-none border-t-0 border-x border-b shadow-sm backdrop-blur-md cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-[#0f172a]/95 border-slate-800 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/80 shadow-black/40'
                  : 'bg-white/95 border-slate-200 text-emerald-600 hover:text-emerald-700 hover:bg-slate-50/80 shadow-slate-100/60'
              }`}
              title="Tampilkan Navigasi"
            >
              <ChevronsDown className="w-3 h-3 md:w-3.5 md:h-3.5 translate-y-[-1px]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
