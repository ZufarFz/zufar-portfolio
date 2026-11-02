import React from 'react';
import {
  BG_PATTERN_GROUPS,
  BgPatternOption,
  BgPatternGroup,
  PATTERN_RENDERERS,
  PatternRenderContext
} from '../data/patterns';

export { BG_PATTERN_GROUPS };
export type { BgPatternOption, BgPatternGroup };

export interface BackgroundTexturesProps {
  type?: string;
  theme: 'light' | 'dark';
  opacity?: number;
  scale?: number;
  color?: string;
  customSvg?: string;
  customBgUrl?: string;
}

export default function BackgroundTextures({
  type = 'none',
  theme,
  opacity,
  scale = 1,
  color,
  customSvg,
  customBgUrl
}: BackgroundTexturesProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDark = theme === 'dark';

  const baseClass = `absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${
    isMobile ? 'transition-opacity duration-200' : 'transition-all duration-500'
  }`;

  const defaultPatternOpacity = isDark ? 0.22 : 0.18;
  const activeOpacity = opacity !== undefined ? opacity : defaultPatternOpacity;
  const defaultStrokeColor = color || (isDark ? '#94a3b8' : '#475569');
  const scaleVal = Math.max(0.2, Math.min(scale || 1, 4));
  const patternId = React.useId().replace(/:/g, '');

  // 1. Handling Custom SVG or Custom URL (Smart Dual-Mode)
  const isRawSvg = Boolean(customSvg && (customSvg.trim().startsWith('<svg') || customSvg.trim().includes('<svg')));
  const isCustomUrl = Boolean(
    customBgUrl ||
      (customSvg &&
        !isRawSvg &&
        (customSvg.trim().startsWith('http') ||
          customSvg.trim().startsWith('/') ||
          customSvg.trim().startsWith('./') ||
          customSvg.trim().startsWith('data:') ||
          customSvg.trim().endsWith('.svg') ||
          customSvg.trim().endsWith('.png') ||
          customSvg.trim().endsWith('.jpg') ||
          customSvg.trim().endsWith('.webp')))
  );
  const effectiveBgUrl = customBgUrl || (!isRawSvg && customSvg ? customSvg.trim() : '');

  if (type === 'custom_svg' || type === 'custom_url' || isRawSvg || isCustomUrl) {
    if (isRawSvg && customSvg) {
      let processedCustomSvg = customSvg.trim();
      if (color) {
        if (processedCustomSvg.includes('currentColor')) {
          processedCustomSvg = processedCustomSvg.replace(/currentColor/g, color);
        } else if (!processedCustomSvg.includes('fill=') && !processedCustomSvg.includes('stroke=')) {
          processedCustomSvg = processedCustomSvg.replace('<svg', `<svg fill="${color}"`);
        } else {
          processedCustomSvg = processedCustomSvg.replace(/fill="(?!none|url)[^"]*"/g, `fill="${color}"`);
          processedCustomSvg = processedCustomSvg.replace(/stroke="(?!none|url)[^"]*"/g, `stroke="${color}"`);
        }
      }
      return (
        <div
          className={baseClass}
          style={{
            opacity: activeOpacity,
            transform: scaleVal !== 1 ? `scale(${scaleVal})` : 'none'
          }}
        >
          <div
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover pointer-events-none"
            dangerouslySetInnerHTML={{ __html: processedCustomSvg }}
          />
        </div>
      );
    }

    if (effectiveBgUrl) {
      return (
        <div
          className={baseClass}
          style={{
            opacity: activeOpacity,
            transform: scaleVal !== 1 ? `scale(${scaleVal})` : 'none'
          }}
        >
          <div
            className="w-full h-full bg-no-repeat bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage: `url("${effectiveBgUrl}")`,
              backgroundSize: scaleVal !== 1 ? `${scaleVal * 100}%` : 'cover'
            }}
          />
        </div>
      );
    }
  }

  // 2. Custom SVG Pattern Code
  if (type === 'custom_svg_pattern' && customSvg) {
    const cleanPatternSvg = customSvg
      .replace(/<\?xml[\s\S]*?\?>/gi, '')
      .replace(/<!--[\s\S]*?-->/gi, '')
      .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
      .trim();
    return (
      <div
        className={`${baseClass} [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover`}
        style={{ opacity: activeOpacity }}
        dangerouslySetInnerHTML={{ __html: cleanPatternSvg }}
      />
    );
  }

  // 3. Modular Pattern Registry Dispatcher (Japanese Wagara, Modern Geometric, Watercolor)
  const renderer = PATTERN_RENDERERS[type];
  if (renderer) {
    const ctx: PatternRenderContext = {
      patternId,
      scaleVal,
      defaultStrokeColor,
      isDark,
      baseClass,
      activeOpacity,
      isMobile,
      color
    };
    return <>{renderer(ctx)}</>;
  }

  // 4. Standard Minimal Textures
  switch (type) {
    case 'dots':
      return (
        <div
          className={baseClass}
          style={{
            opacity: activeOpacity !== undefined ? activeOpacity : 0.25,
            backgroundImage: `radial-gradient(circle, ${color || (isDark ? '#475569' : '#94a3b8')} 1.5px, transparent 1.5px)`,
            backgroundSize: `${Math.round(24 * scaleVal)}px ${Math.round(24 * scaleVal)}px`
          }}
        />
      );

    case 'grid':
      return (
        <div
          className={baseClass}
          style={{
            opacity: activeOpacity !== undefined ? activeOpacity : 0.15,
            backgroundImage: `
              linear-gradient(to right, ${color || (isDark ? '#475569' : '#cbd5e1')} 1px, transparent 1px),
              linear-gradient(to bottom, ${color || (isDark ? '#475569' : '#cbd5e1')} 1px, transparent 1px)
            `,
            backgroundSize: `${Math.round(40 * scaleVal)}px ${Math.round(40 * scaleVal)}px`
          }}
        />
      );

    case 'ambient':
      return (
        <div className={baseClass} style={{ opacity: activeOpacity !== undefined ? activeOpacity : 1 }}>
          <div
            className={`absolute rounded-full transition-colors duration-500 ${
              isMobile
                ? 'w-[280px] h-[280px] blur-[60px] -right-10 -top-20 opacity-[0.22]'
                : 'w-[600px] h-[600px] blur-[140px] -right-20 -top-40 opacity-[0.25]'
            } ${isDark ? 'bg-emerald-500/30' : 'bg-emerald-300/40'}`}
          />
          <div
            className={`absolute rounded-full transition-colors duration-500 ${
              isMobile
                ? 'w-[240px] h-[240px] blur-[50px] -left-10 bottom-[-50px] opacity-[0.15]'
                : 'w-[500px] h-[500px] blur-[120px] -left-20 bottom-[-100px] opacity-[0.18]'
            } ${isDark ? 'bg-blue-600/20' : 'bg-blue-300/30'}`}
          />
        </div>
      );

    case 'abstract':
      return (
        <div className={baseClass} style={{ opacity: activeOpacity !== undefined ? activeOpacity : 1 }}>
          <div
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] transition-opacity duration-300"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 0px, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 1px, transparent 0, transparent 50%),
                repeating-linear-gradient(-45deg, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 0px, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 1px, transparent 0, transparent 50%)
              `,
              backgroundSize: `${Math.round(60 * scaleVal)}px ${Math.round(60 * scaleVal)}px`
            }}
          />
          <div
            className={`absolute w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-transparent via-transparent to-transparent opacity-[0.25] transition-colors duration-500 ${
              isDark ? 'from-emerald-950/20 to-slate-900' : 'from-emerald-100/30 to-white'
            }`}
          />
        </div>
      );

    case 'custom_upload':
      if (!customBgUrl) return null;
      return (
        <div
          className={baseClass}
          style={{
            opacity: activeOpacity !== undefined ? activeOpacity : 0.15,
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        >
          <img
            src={customBgUrl}
            alt="Custom Background Watermark"
            className="w-full h-full object-cover grayscale brightness-110 contrast-125 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>
      );

    case 'none':
    case 'solid':
    default:
      return null;
  }
}
