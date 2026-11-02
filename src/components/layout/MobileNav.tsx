import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Globe,
  Sun,
  Moon,
  X,
  Home,
  LayoutGrid,
  Award,
  Briefcase,
  MessageCircle,
} from 'lucide-react';
import { CVData } from '../../types';
import { getActiveTabStyle } from './navUtils';

interface MobileNavProps {
  theme: 'light' | 'dark';
  toggleThemeWithAnimation: (newTheme: 'light' | 'dark', e: React.MouseEvent) => void;
  lang: 'id' | 'en';
  onConfirmLanguageChange: () => void;
  activeSection: string;
  scrollToSection: (section: string) => void;
  activeCVData: CVData;
  isPreviewMode?: boolean;
  isSimulatedMobileFrame?: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  theme,
  toggleThemeWithAnimation,
  lang,
  onConfirmLanguageChange,
  activeSection,
  scrollToSection,
  activeCVData,
  isPreviewMode = false,
  isSimulatedMobileFrame = false,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [showLangConfirm, setShowLangConfirm] = useState(false);
  const langContainerRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        langContainerRefMobile.current &&
        !langContainerRefMobile.current.contains(e.target as Node)
      ) {
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

  const getSectionIcon = (sec: string) => {
    switch (sec) {
      case 'home':
        return <Home className="w-3.5 h-3.5" />;
      case 'projects':
        return <LayoutGrid className="w-3.5 h-3.5" />;
      case 'skills':
        return <Award className="w-3.5 h-3.5" />;
      case 'experience':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'contact':
        return <MessageCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`md:hidden fixed left-0 right-0 w-full z-50 ${
        isPreviewMode && !isSimulatedMobileFrame ? 'top-10' : 'top-0'
      }`}
    >
      {/* Header Box Container */}
      <div
        className={`relative z-10 flex items-center justify-between px-3 sm:px-4 h-10 sm:h-11 border-b shadow-xs transition-all duration-250 ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        style={
          theme === 'dark'
            ? activeCVData.webTexts?.navbar_bg_color_dark
              ? { backgroundColor: activeCVData.webTexts.navbar_bg_color_dark }
              : undefined
            : activeCVData.webTexts?.navbar_bg_color
            ? { backgroundColor: activeCVData.webTexts.navbar_bg_color }
            : undefined
        }
      >
        {/* Left Section: Menu icon on the far left, followed by static "Portfolio" text */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1 rounded-md flex items-center justify-center transition-colors cursor-pointer select-none ${
              theme === 'dark'
                ? 'text-slate-200 hover:text-emerald-400'
                : 'text-slate-800 hover:text-emerald-600'
            }`}
            title="Menu"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Static Portfolio Title */}
          <span
            className={`font-sans font-bold tracking-widest text-[11px] sm:text-xs uppercase ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            Portfolio
          </span>
        </div>

        {/* Configurations on Right */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language button */}
          <div ref={langContainerRefMobile} className="relative flex items-center">
            <button
              onClick={() => setShowLangConfirm(!showLangConfirm)}
              className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer select-none flex items-center gap-1 shadow-2xs ${
                theme === 'dark'
                  ? 'border-slate-700 text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white'
                  : 'border-[#E3DDD3] text-[#2D3136] bg-white hover:bg-slate-50'
              }`}
              title={lang === 'id' ? 'Ubah Bahasa' : 'Change Language'}
            >
              <Globe
                className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                style={{ color: theme === 'dark' ? '#F2A1B0' : '#C81D25' }}
              />
              <span>{lang}</span>
            </button>

            <AnimatePresence>
              {showLangConfirm && (
                <motion.div
                  initial={{ y: 5, scale: 0.95, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 5, scale: 0.95, opacity: 0 }}
                  className={`absolute top-full right-0 mt-1.5 p-3 rounded-xl border shadow-xl z-50 w-48 sm:w-52 ${
                    theme === 'dark'
                      ? 'bg-slate-950 text-slate-100 border-slate-800 shadow-black/80'
                      : 'bg-white text-slate-850 border-slate-200 shadow-slate-200/80'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] sm:text-[11px] font-medium leading-relaxed">
                      {lang === 'id'
                        ? 'Ganti ke Bahasa Inggris?'
                        : 'Change to Indonesian?'}
                    </p>
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setShowLangConfirm(false)}
                        className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                          theme === 'dark'
                            ? 'text-slate-400 hover:text-white bg-slate-900'
                            : 'text-slate-500 hover:text-slate-800 bg-slate-50'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowLangConfirm(false);
                          setMobileMenuOpen(false);
                          onConfirmLanguageChange();
                        }}
                        className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-emerald-600 text-white cursor-pointer shadow-xs"
                      >
                        {lang === 'id' ? 'Ya' : 'Yes'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-mobile-btn"
            data-theme-toggle="mobile"
            onClick={(e) => {
              toggleThemeWithAnimation(theme === 'dark' ? 'light' : 'dark', e);
            }}
            className={`p-1 rounded-md flex items-center justify-center transition-colors cursor-pointer select-none ${
              theme === 'dark'
                ? 'text-slate-200 hover:text-yellow-400 hover:bg-slate-800/80'
                : 'text-slate-800 hover:text-emerald-600 hover:bg-slate-100/80'
            }`}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-yellow-500 hover:text-yellow-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600 hover:text-slate-950" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Left Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`fixed top-0 left-0 h-[100dvh] w-[220px] sm:w-[250px] max-w-[75vw] z-50 p-3.5 sm:p-4 shadow-2xl flex flex-col justify-between border-r overflow-hidden ${
                theme === 'dark'
                  ? 'bg-slate-950/98 border-slate-800 text-white'
                  : 'bg-white/98 border-slate-200 text-slate-800'
              }`}
              style={
                theme === 'dark'
                  ? activeCVData.webTexts?.navbar_bg_color_dark
                    ? { backgroundColor: activeCVData.webTexts.navbar_bg_color_dark }
                    : undefined
                  : activeCVData.webTexts?.navbar_bg_color
                  ? { backgroundColor: activeCVData.webTexts.navbar_bg_color }
                  : undefined
              }
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <span
                    className={`font-sans font-bold tracking-widest text-xs uppercase ${
                      theme === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    Portfolio
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'hover:bg-slate-900 text-slate-400 hover:text-white'
                        : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Navigation links */}
                <div className="flex flex-col gap-1">
                  {['home', 'projects', 'skills', 'experience', 'contact'].map(
                    (section) => {
                      const active = activeSection === section;
                      return (
                        <button
                          key={section}
                          onClick={() => {
                            scrollToSection(section);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left font-sans text-xs uppercase tracking-wider font-semibold py-2 px-2.5 rounded-lg transition-all cursor-pointer border flex items-center justify-between ${
                            active
                              ? 'border-transparent shadow-2xs'
                              : theme === 'dark'
                              ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04]'
                              : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-black/[0.03]'
                          }`}
                          style={getActiveTabStyle(active, theme, activeCVData)}
                        >
                          <span className="flex items-center gap-2">
                            {getSectionIcon(section)}
                            {section}
                          </span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Footer inside drawer */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 text-center">
                  © 2026 {activeCVData.name || 'Portfolio'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
