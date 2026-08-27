import { CVData } from '../types';

export type ThemeAccentKey = 'emerald' | 'blue' | 'indigo' | 'rose' | 'amber' | 'slate';

export interface ThemeAccentConfig {
  id: ThemeAccentKey;
  label: string;
  hex: string;
  primaryBg: string;
  primaryHoverBg: string;
  primaryText: string;
  primaryTextDark: string;
  primaryBorder: string;
  primaryRing: string;
  badgeBgLight: string;
  badgeBgDark: string;
  badgeTextLight: string;
  badgeTextDark: string;
  gradientFrom: string;
}

export const THEME_ACCENTS: Record<ThemeAccentKey, ThemeAccentConfig> = {
  blue: {
    id: 'blue',
    label: 'Blue',
    hex: '#3b82f6',
    primaryBg: 'bg-blue-600',
    primaryHoverBg: 'hover:bg-blue-500',
    primaryText: 'text-blue-600',
    primaryTextDark: 'text-blue-400',
    primaryBorder: 'border-blue-500',
    primaryRing: 'ring-blue-500',
    badgeBgLight: 'bg-blue-500/10',
    badgeBgDark: 'bg-blue-500/15',
    badgeTextLight: 'text-blue-700',
    badgeTextDark: 'text-blue-400',
    gradientFrom: 'from-blue-600 to-indigo-600'
  },
  emerald: {
    id: 'emerald',
    label: 'Emerald',
    hex: '#10b981',
    primaryBg: 'bg-emerald-600',
    primaryHoverBg: 'hover:bg-emerald-500',
    primaryText: 'text-emerald-600',
    primaryTextDark: 'text-emerald-400',
    primaryBorder: 'border-emerald-500',
    primaryRing: 'ring-emerald-500',
    badgeBgLight: 'bg-emerald-500/10',
    badgeBgDark: 'bg-emerald-500/15',
    badgeTextLight: 'text-emerald-700',
    badgeTextDark: 'text-emerald-400',
    gradientFrom: 'from-emerald-600 to-teal-600'
  },
  indigo: {
    id: 'indigo',
    label: 'Indigo',
    hex: '#6366f1',
    primaryBg: 'bg-indigo-600',
    primaryHoverBg: 'hover:bg-indigo-500',
    primaryText: 'text-indigo-600',
    primaryTextDark: 'text-indigo-400',
    primaryBorder: 'border-indigo-500',
    primaryRing: 'ring-indigo-500',
    badgeBgLight: 'bg-indigo-500/10',
    badgeBgDark: 'bg-indigo-500/15',
    badgeTextLight: 'text-indigo-700',
    badgeTextDark: 'text-indigo-400',
    gradientFrom: 'from-indigo-600 to-purple-600'
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    hex: '#f43f5e',
    primaryBg: 'bg-rose-600',
    primaryHoverBg: 'hover:bg-rose-500',
    primaryText: 'text-rose-600',
    primaryTextDark: 'text-rose-400',
    primaryBorder: 'border-rose-500',
    primaryRing: 'ring-rose-500',
    badgeBgLight: 'bg-rose-500/10',
    badgeBgDark: 'bg-rose-500/15',
    badgeTextLight: 'text-rose-700',
    badgeTextDark: 'text-rose-400',
    gradientFrom: 'from-rose-600 to-pink-600'
  },
  amber: {
    id: 'amber',
    label: 'Amber',
    hex: '#f59e0b',
    primaryBg: 'bg-amber-600',
    primaryHoverBg: 'hover:bg-amber-500',
    primaryText: 'text-amber-600',
    primaryTextDark: 'text-amber-400',
    primaryBorder: 'border-amber-500',
    primaryRing: 'ring-amber-500',
    badgeBgLight: 'bg-amber-500/10',
    badgeBgDark: 'bg-amber-500/15',
    badgeTextLight: 'text-amber-800',
    badgeTextDark: 'text-amber-400',
    gradientFrom: 'from-amber-600 to-orange-600'
  },
  slate: {
    id: 'slate',
    label: 'Slate',
    hex: '#64748b',
    primaryBg: 'bg-slate-700',
    primaryHoverBg: 'hover:bg-slate-600',
    primaryText: 'text-slate-700',
    primaryTextDark: 'text-slate-300',
    primaryBorder: 'border-slate-500',
    primaryRing: 'ring-slate-500',
    badgeBgLight: 'bg-slate-500/10',
    badgeBgDark: 'bg-slate-500/20',
    badgeTextLight: 'text-slate-800',
    badgeTextDark: 'text-slate-300',
    gradientFrom: 'from-slate-700 to-slate-900'
  }
};

export function getThemeAccent(cvData?: CVData): ThemeAccentConfig {
  const accentKey = cvData?.layoutSettings?.themeColor || 'blue';
  return THEME_ACCENTS[accentKey as ThemeAccentKey] || THEME_ACCENTS.blue;
}

export function getThemeColorPalette(themeColor?: string) {
  const key = (themeColor || 'blue') as ThemeAccentKey;
  const config = THEME_ACCENTS[key] || THEME_ACCENTS.blue;
  return {
    primary: config.hex,
    accent: config.hex,
    ...config
  };
}

export function getHeroCircleColors(cvData?: CVData, theme: 'light' | 'dark' = 'light') {
  const texts = cvData?.webTexts || {};
  const isDark = theme === 'dark';
  const themeColor = cvData?.layoutSettings?.themeColor || 'blue';
  const accentHex = (THEME_ACCENTS[themeColor as ThemeAccentKey] || THEME_ACCENTS.blue).hex;
  const isSyncAccent = texts.home_circle_sync_accent === 'true';

  let start = '';
  let mid = '';
  let end = '';
  const style = texts.home_circle_style || 'sphere';
  const opacity = parseFloat(texts.home_circle_opacity || '1');

  if (isSyncAccent) {
    if (isDark) {
      start = accentHex;
      mid = accentHex;
      end = '#0f172a';
    } else {
      start = accentHex;
      mid = accentHex;
      end = '#1e3a8a';
    }
  } else if (isDark) {
    start = texts.home_circle_color_dark || (cvData as any)?.homeImageCircleColorDark || '#3b82f6';
    end = texts.home_circle_color_dark_end || (cvData as any)?.homeImageCircleColorDarkEnd || '#0f172a';
    mid = texts.home_circle_color_dark_mid || '#1d4ed8';
  } else {
    start = texts.home_circle_color_light || texts.home_circle_color || (cvData as any)?.homeImageCircleColorLight || '#6ba0e6';
    end = texts.home_circle_color_light_end || (cvData as any)?.homeImageCircleColorLightEnd || '#3661a3';
    mid = texts.home_circle_color_light_mid || '#4a7bc7';
  }

  return {
    start,
    mid,
    end,
    style,
    opacity: isNaN(opacity) ? 1 : Math.max(0.05, Math.min(1, opacity))
  };
}

