import { CaseStudy, CVData } from '../../types';

export interface ProjectDetailModalProps {
  project: CaseStudy | null;
  onClose: () => void;
  theme: 'light' | 'dark';
  onDiscussProject?: () => void;
  lang?: 'id' | 'en';
  activeCVData?: CVData;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  if (c.length !== 6) {
    return { h: 160, s: 80, l: 50 };
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function getHarmonizedLineStyles(
  bgColor: string,
  isDark: boolean,
  themeColorSetting?: string,
  accentColorHex?: string
) {
  let targetHue = 160;
  let sat = 82;

  if (accentColorHex && accentColorHex.startsWith('#')) {
    const hsl = hexToHsl(accentColorHex);
    targetHue = hsl.h;
    sat = Math.max(hsl.s, 75);
  } else {
    let hex = bgColor ? bgColor.trim() : '';
    if (!hex.startsWith('#')) {
      hex = isDark ? '#181A1B' : '#F3F0E6';
    }
    const hsl = hexToHsl(hex);
    targetHue = hsl.h;

    if (hsl.s < 12) {
      switch (themeColorSetting) {
        case 'rose': targetHue = 350; break;
        case 'amber': targetHue = 38; break;
        case 'emerald': targetHue = 160; break;
        case 'blue': targetHue = 215; break;
        case 'indigo': targetHue = 240; break;
        case 'slate': targetHue = 210; break;
        default: targetHue = isDark ? 160 : 38;
      }
      sat = 85;
    } else {
      sat = Math.max(hsl.s, 78);
    }
  }

  const primaryLightness = isDark ? 54 : 46;
  const highlightLightness = isDark ? 82 : 74;

  const accentColor = `hsl(${targetHue}, ${sat}%, ${isDark ? 62 : 42}%)`;
  const accentHoverColor = `hsl(${targetHue}, ${sat}%, ${isDark ? 78 : 32}%)`;
  const skillBadgeColor = `hsl(${targetHue}, ${sat}%, ${isDark ? 68 : 55}%)`;

  return {
    hue: targetHue,
    background: `linear-gradient(90deg, hsl(${targetHue}, ${sat}%, ${primaryLightness}%), hsl(${targetHue}, 95%, ${highlightLightness}%), hsl(${targetHue}, ${sat}%, ${primaryLightness}%))`,
    boxShadow: `0 2px 14px rgba(0, 0, 0, 0.8), 0 0 28px hsl(${targetHue} 90% ${primaryLightness}% / 0.95), 0 0 10px hsl(${targetHue} 95% ${highlightLightness}% / 1)`,
    sparkColor: `hsl(${targetHue}, 95%, 96%)`,
    sparkShadow: `0 0 12px #ffffff, 0 0 20px hsl(${targetHue} 95% ${highlightLightness}% / 1)`,
    accentColor,
    accentHoverColor,
    skillBadgeColor,
    activeThumbnailBorder: `hsl(${targetHue}, ${sat}%, ${isDark ? 65 : 55}%)`,
    activeThumbnailRing: `0 0 0 2px hsl(${targetHue} ${sat}% 60% / 0.85), 0 4px 12px hsl(${targetHue} ${sat}% 50% / 0.45)`,
    activeThumbnailBadgeBg: `hsla(${targetHue}, ${sat}%, 10%, 0.88)`,
    activeThumbnailBadgeText: `hsl(${targetHue}, ${sat}%, 75%)`
  };
}
