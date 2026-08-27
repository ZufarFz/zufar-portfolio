import React from 'react';
import { ThemeAccentConfig } from '../lib/themeUtils';

export interface SectionGradientShadowProps {
  sectionKey: string;
  webTexts?: Record<string, string>;
  theme: 'light' | 'dark';
  themeAccent?: ThemeAccentConfig;
  accentHex?: string;
  currentBgColor?: string;
  className?: string;
}

/**
 * Helper to convert HEX or RGB to RGBA string with custom opacity
 */
function toRgba(colorStr: string, opacity: number): string {
  if (!colorStr) return `rgba(0,0,0,${opacity})`;
  
  // If already rgba/rgb
  if (colorStr.startsWith('rgb')) {
    const parts = colorStr.match(/\d+(\.\d+)?/g);
    if (parts && parts.length >= 3) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${Math.max(0, Math.min(1, opacity))})`;
    }
  }

  // Hex conversion
  let hex = colorStr.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 6) {
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
  }

  return `rgba(0, 0, 0, ${Math.max(0, Math.min(1, opacity))})`;
}

export const SectionGradientShadow: React.FC<SectionGradientShadowProps> = ({
  sectionKey,
  webTexts,
  theme,
  themeAccent,
  accentHex,
  currentBgColor,
  className = ''
}) => {
  // 1. Read shadow configurations from webTexts with robust key fallbacks
  const enabledKey = `${sectionKey}_shadow_enabled`;
  const isEnabled = 
    webTexts?.[enabledKey] === 'true' ||
    webTexts?.[`${enabledKey}_id`] === 'true' ||
    webTexts?.[`${enabledKey}_en`] === 'true' ||
    (sectionKey === 'home' && (webTexts?.hero_shadow_enabled === 'true' || webTexts?.home_shadow_enabled === 'true'));

  if (!isEnabled) return null;

  const directionKey = `${sectionKey}_shadow_direction`;
  const depthKey = `${sectionKey}_shadow_depth`;
  const opacityKey = `${sectionKey}_shadow_opacity`;
  const colorModeKey = `${sectionKey}_shadow_color_mode`;
  const customColorKey = `${sectionKey}_shadow_custom_color`;

  const direction = 
    webTexts?.[directionKey] || 
    (sectionKey === 'home' ? webTexts?.hero_shadow_direction : undefined) || 
    'bottom';

  const depth = Math.max(5, Math.min(100, parseFloat(
    webTexts?.[depthKey] || 
    (sectionKey === 'home' ? webTexts?.hero_shadow_depth : undefined) || 
    '40'
  )));

  const opacity = Math.max(0.05, Math.min(1, parseFloat(
    webTexts?.[opacityKey] || 
    (sectionKey === 'home' ? webTexts?.hero_shadow_opacity : undefined) || 
    '0.85'
  )));

  const colorMode = 
    webTexts?.[colorModeKey] || 
    (sectionKey === 'home' ? webTexts?.hero_shadow_color_mode : undefined) || 
    'auto';

  const customColor = 
    webTexts?.[customColorKey] || 
    (sectionKey === 'home' ? webTexts?.hero_shadow_custom_color : undefined) || 
    '';

  // 2. Determine base shadow color
  let baseColor = '#000000';
  if (colorMode === 'custom' && customColor) {
    baseColor = customColor;
  } else if (colorMode === 'accent') {
    baseColor = accentHex || themeAccent?.hex || '#3b82f6';
  } else if (colorMode === 'black') {
    baseColor = '#000000';
  } else if (colorMode === 'white') {
    baseColor = '#ffffff';
  } else {
    // 'auto' mode: Authentic dark contrast edge shadow
    // In dark mode: Pitch black shadow #000000 creates deep edge vignette
    // In light mode: Slate dark shadow #0f172a creates visible natural depth shadow
    baseColor = theme === 'dark' ? '#000000' : '#0f172a';
  }

  // Construct multi-stop smooth linear gradient for soft natural feathering
  const effectiveOpacity = theme === 'light' && colorMode === 'auto' ? Math.min(opacity, 0.65) : opacity;
  const c100 = toRgba(baseColor, effectiveOpacity);
  const c75 = toRgba(baseColor, effectiveOpacity * 0.75);
  const c45 = toRgba(baseColor, effectiveOpacity * 0.45);
  const c20 = toRgba(baseColor, effectiveOpacity * 0.20);
  const c0 = toRgba(baseColor, 0);

  return (
    <div className={`absolute inset-0 pointer-events-none z-[4] overflow-hidden ${className}`}>
      {/* Bottom Gradient */}
      {(direction === 'bottom' || direction === 'top_bottom') && (
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none transition-all duration-300"
          style={{
            height: `${depth}%`,
            minHeight: '80px',
            background: `linear-gradient(to top, ${c100} 0%, ${c75} 30%, ${c45} 60%, ${c20} 85%, ${c0} 100%)`
          }}
        />
      )}

      {/* Top Gradient */}
      {(direction === 'top' || direction === 'top_bottom') && (
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none transition-all duration-300"
          style={{
            height: `${depth}%`,
            minHeight: '80px',
            background: `linear-gradient(to bottom, ${c100} 0%, ${c75} 30%, ${c45} 60%, ${c20} 85%, ${c0} 100%)`
          }}
        />
      )}

      {/* Left Gradient */}
      {(direction === 'left' || direction === 'left_right') && (
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-300"
          style={{
            width: `${depth}%`,
            minWidth: '80px',
            background: `linear-gradient(to right, ${c100} 0%, ${c75} 30%, ${c45} 60%, ${c20} 85%, ${c0} 100%)`
          }}
        />
      )}

      {/* Right Gradient */}
      {(direction === 'right' || direction === 'left_right') && (
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none transition-all duration-300"
          style={{
            width: `${depth}%`,
            minWidth: '80px',
            background: `linear-gradient(to left, ${c100} 0%, ${c75} 30%, ${c45} 60%, ${c20} 85%, ${c0} 100%)`
          }}
        />
      )}

      {/* All Sides / 4-Corner Radial Vignette */}
      {direction === 'all' && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(ellipse at center, ${c0} ${Math.max(0, 100 - depth)}%, ${c20} ${Math.max(20, 100 - depth * 0.7)}%, ${c75} ${Math.max(40, 100 - depth * 0.3)}%, ${c100} 100%)`
          }}
        />
      )}
    </div>
  );
};

export default SectionGradientShadow;
