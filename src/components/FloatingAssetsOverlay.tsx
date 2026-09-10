import React from 'react';
import { motion } from 'motion/react';
import { FloatingAsset } from '../types';

interface FloatingAssetsOverlayProps {
  sectionId: string;
  assets?: FloatingAsset[];
  className?: string;
  theme?: string;
  bgColor?: string;
  isMobilePreview?: boolean;
}

function processSvgWithBackdropFilter(
  rawSvg: string,
  filterId: string,
  bgColor: string,
  opacity: number
): string {
  if (!rawSvg) return rawSvg;

  // Filter definition that creates a solid background silhouette behind the graphic
  const filterDef = `
  <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
    <feFlood flood-color="${bgColor}" flood-opacity="1" result="solidFlood" />
    <feComposite in="solidFlood" in2="SourceGraphic" operator="in" result="solidBase" />
    <feComponentTransfer in="SourceGraphic" result="fadedGraphic">
      <feFuncA type="linear" slope="${opacity}" />
    </feComponentTransfer>
    <feMerge>
      <feMergeNode in="solidBase" />
      <feMergeNode in="fadedGraphic" />
    </feMerge>
  </filter>`;

  const svgOpenMatch = rawSvg.match(/<svg[^>]*>/i);
  const svgCloseIndex = rawSvg.lastIndexOf('</svg>');

  if (svgOpenMatch && svgCloseIndex !== -1) {
    const openTag = svgOpenMatch[0];
    const innerContent = rawSvg.slice(openTag.length, svgCloseIndex);
    return `${openTag}<defs>${filterDef}</defs><g filter="url(#${filterId})">${innerContent}</g></svg>`;
  }

  return rawSvg;
}

export default function FloatingAssetsOverlay({ 
  sectionId, 
  assets = [], 
  className = '', 
  theme, 
  bgColor,
  isMobilePreview
}: FloatingAssetsOverlayProps) {
  if (!assets || assets.length === 0) return null;

  // Window resize listener for live mobile view detection
  const [windowIsMobile, setWindowIsMobile] = React.useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = isMobilePreview === true || windowIsMobile;

  // Detect theme if not explicitly provided
  const isDark = theme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const defaultBgColor = isDark ? '#181A1B' : '#F9F3E8';
  const effectiveBgColor = bgColor || defaultBgColor;

  // Filter assets assigned to this section or 'all'
  const sectionAssets = assets.filter(
    (a) => a && (a.section === sectionId || a.section === 'all' || !a.section)
  );

  if (sectionAssets.length === 0) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {sectionAssets.map((asset) => {
        // Visibility check for device-specific suppression
        if (isMobile && asset.hideOnMobile) return null;
        if (!isMobile && asset.hideOnDesktop) return null;

        const isRawSvg = asset.type === 'svg' || (asset.content && asset.content.trim().startsWith('<svg'));
        
        // Coordinated position and styling overrides (Mobile vs Desktop)
        const posX = (isMobile && asset.mobileX !== undefined) ? asset.mobileX : asset.x;
        const posY = (isMobile && asset.mobileY !== undefined) ? asset.mobileY : asset.y;
        const rawSize = (isMobile && asset.mobileWidth !== undefined) 
          ? asset.mobileWidth 
          : (asset.width || asset.size || 80);
        const opacity = (isMobile && asset.mobileOpacity !== undefined) 
          ? asset.mobileOpacity 
          : (asset.opacity !== undefined ? asset.opacity : 1);
        const rotation = (isMobile && asset.mobileRotation !== undefined) 
          ? asset.mobileRotation 
          : (asset.rotation || 0);
        const isFlipped = (isMobile && asset.mobileFlipX !== undefined) 
          ? asset.mobileFlipX 
          : (asset.flipX || false);
        const flipX = isFlipped ? 'scaleX(-1)' : '';

        const needsBlocker = opacity < 0.99;
        const filterId = `block_pat_${String(asset.id || Math.random()).replace(/[^a-zA-Z0-9_-]/g, '_')}`;

        // Calculate effective zIndex based on layer depth or explicit zIndex
        let zIndex = asset.zIndex;
        if (asset.layer === 'bg') {
          zIndex = 2; // Setara Background (Di atas Pattern, Di bawah Gambar/Tulisan)
        } else if (asset.layer === 'above_image') {
          zIndex = 8; // Di atas Gambar / Lingkaran Avatar, Di bawah Tulisan
        } else if (asset.layer === 'above_all') {
          zIndex = 30; // Di atas Semua (Di atas Gambar & Tulisan)
        } else if (zIndex === undefined) {
          zIndex = 8;
        }

        // Process SVG color if raw SVG
        let svgHtml = asset.content || '';
        if (isRawSvg && asset.color && asset.color !== 'preserve' && asset.color !== 'original') {
          const color = asset.color;
          if (svgHtml.includes('currentColor')) {
            svgHtml = svgHtml.replace(/currentColor/g, color);
          } else if (!svgHtml.includes('fill=') && !svgHtml.includes('stroke=')) {
            svgHtml = svgHtml.replace('<svg', `<svg fill="${color}"`);
          }
        }

        // Automatically inject solid silhouette filter so background patterns never bleed through
        if (isRawSvg && needsBlocker && svgHtml) {
          svgHtml = processSvgWithBackdropFilter(svgHtml, filterId, effectiveBgColor, opacity);
        }

        // 1. Entry Animation Setup (Animasi Masuk & Delay Kemunculan - Dibuat Slow, Smooth & Sinematik)
        const entryAnimType = asset.entryAnimation || 'none';
        const entryDelaySec = Math.max(0, (asset.entryDelay ?? 0) / 1000);
        // Default duration 1.5s (1500ms) agar gerakan masuk terasa lebih lambat, anggun, dan halus
        const entryDurationSec = asset.entryDuration ? Math.max(0.1, asset.entryDuration / 1000) : 1.5;

        let entryInitial: any = { opacity: 1 };
        let entryAnimate: any = { opacity: 1 };

        if (entryAnimType === 'fade') {
          entryInitial = { opacity: 0 };
          entryAnimate = { opacity: 1 };
        } else if (entryAnimType === 'slide_up') {
          entryInitial = { opacity: 0, y: 75 };
          entryAnimate = { opacity: 1, y: 0 };
        } else if (entryAnimType === 'slide_down') {
          entryInitial = { opacity: 0, y: -75 };
          entryAnimate = { opacity: 1, y: 0 };
        } else if (entryAnimType === 'slide_left') {
          entryInitial = { opacity: 0, x: -75 };
          entryAnimate = { opacity: 1, x: 0 };
        } else if (entryAnimType === 'slide_right') {
          entryInitial = { opacity: 0, x: 75 };
          entryAnimate = { opacity: 1, x: 0 };
        } else if (entryAnimType === 'zoom_in') {
          entryInitial = { opacity: 0, scale: 0.05 };
          entryAnimate = { opacity: 1, scale: 1 };
        } else if (entryAnimType === 'zoom_out') {
          entryInitial = { opacity: 0, scale: 1.8 };
          entryAnimate = { opacity: 1, scale: 1 };
        } else if (entryAnimType === 'rotate_in') {
          entryInitial = { opacity: 0, rotate: -55, scale: 0.25 };
          entryAnimate = { opacity: 1, rotate: 0, scale: 1 };
        } else if (entryAnimType === 'bounce_in') {
          entryInitial = { opacity: 0, scale: 0.25, y: 50 };
          entryAnimate = { opacity: 1, scale: 1, y: 0 };
        }

        // 2. Continuous Looping Animation Setup (Animasi yang Dijalankan Terus)
        let loopAnimateProps: any = {};
        let loopTransitionProps: any = {};

        const loopAnimType = asset.animation || 'none';
        if (loopAnimType === 'float') {
          loopAnimateProps = { y: [0, -12, 0, 10, 0], x: [0, 5, 0, -5, 0] };
          loopTransitionProps = { duration: 6, repeat: Infinity, ease: 'easeInOut' };
        } else if (loopAnimType === 'spin') {
          loopAnimateProps = { rotate: [0, 360] };
          loopTransitionProps = { duration: 15, repeat: Infinity, ease: 'linear' };
        } else if (loopAnimType === 'pulse') {
          // If needsBlocker, only animate scale to keep silhouette fully opaque
          loopAnimateProps = needsBlocker ? { scale: [1, 1.08, 1] } : { scale: [1, 1.08, 1], opacity: [opacity, opacity * 0.7, opacity] };
          loopTransitionProps = { duration: 3, repeat: Infinity, ease: 'easeInOut' };
        } else if (loopAnimType === 'bounce') {
          loopAnimateProps = { y: [0, -18, 0] };
          loopTransitionProps = { duration: 2, repeat: Infinity, ease: 'easeInOut' };
        } else if (loopAnimType === 'drift') {
          loopAnimateProps = { x: [0, 14, 0, -14, 0], y: [0, 8, 0, -8, 0] };
          loopTransitionProps = { duration: 9, repeat: Infinity, ease: 'easeInOut' };
        } else if (loopAnimType === 'sway') {
          loopAnimateProps = { rotate: [-6, 6, -6] };
          loopTransitionProps = { duration: 4.5, repeat: Infinity, ease: 'easeInOut' };
        }

        // Responsive fluid width & height: scales with viewport width on desktop, or pixel-perfect on mobile
        const responsiveWidth = isMobile 
          ? `${rawSize}px`
          : `clamp(${Math.max(12, Math.round(rawSize * 0.45))}px, ${(rawSize / 12).toFixed(3)}vw, ${Math.round(rawSize * 2.1)}px)`;
        const responsiveHeight = asset.height
          ? (isMobile ? `${asset.height}px` : `clamp(${Math.max(12, Math.round(asset.height * 0.45))}px, ${(asset.height / 12).toFixed(3)}vw, ${Math.round(asset.height * 2.1)}px)`)
          : 'auto';

        // Composite key to trigger instant live preview of the entry animation whenever settings change in Quick Drawer
        const entryKey = `entry-${asset.id}-${asset.entryAnimation || 'none'}-${asset.entryDelay ?? 0}-${asset.entryDuration ?? 1500}-${asset.animation || 'none'}-${asset.rotation ?? 0}-${asset.mobileRotation ?? 0}-${asset.flipX ? '1' : '0'}-${asset.mobileFlipX ? '1' : '0'}-${asset.color || ''}`;

        return (
          <div
            key={asset.id}
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndex,
            }}
          >
            {/* Outer motion.div: Handles Entry Animation & Delay with instant live-retriggering key */}
            <motion.div
              key={entryKey}
              initial={entryInitial}
              animate={entryAnimate}
              transition={{
                duration: entryDurationSec,
                delay: entryDelaySec,
                ease: entryAnimType === 'bounce_in' ? [0.34, 1.25, 0.64, 1] : [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-none select-none flex items-center justify-center"
            >
              {/* Inner motion.div: Handles Continuous Loop Animation & Static Transforms (Rotation, Flip, Opacity, Dimensions) */}
              <motion.div
                className="pointer-events-none select-none transition-all duration-300"
                style={{
                  width: responsiveWidth,
                  height: responsiveHeight,
                  // When blocker filter is active, container stays at opacity: 1 so the solid base blocks the pattern
                  opacity: needsBlocker ? 1 : opacity,
                  transform: `rotate(${rotation}deg) ${flipX}`,
                }}
                animate={loopAnimateProps}
                transition={loopTransitionProps}
              >
                {isRawSvg ? (
                  <div
                    className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                    dangerouslySetInnerHTML={{ __html: svgHtml }}
                  />
                ) : needsBlocker ? (
                  <svg 
                    className="w-full h-full object-contain pointer-events-none" 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
                        <feFlood flood-color={effectiveBgColor} flood-opacity="1" result="solidFlood" />
                        <feComposite in="solidFlood" in2="SourceGraphic" operator="in" result="solidBase" />
                        <feComponentTransfer in="SourceGraphic" result="fadedGraphic">
                          <feFuncA type="linear" slope={opacity} />
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode in="solidBase" />
                          <feMergeNode in="fadedGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <image 
                      href={asset.content} 
                      width="100%" 
                      height="100%" 
                      preserveAspectRatio="xMidYMid meet" 
                      filter={`url(#${filterId})`} 
                    />
                  </svg>
                ) : (
                  <img
                    src={asset.content}
                    alt={asset.name || 'Floating asset'}
                    className="w-full h-full object-contain pointer-events-none"
                    loading="lazy"
                  />
                )}
              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
