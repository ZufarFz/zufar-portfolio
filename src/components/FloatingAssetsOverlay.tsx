import React from 'react';
import { motion } from 'motion/react';
import { FloatingAsset } from '../types';

interface FloatingAssetsOverlayProps {
  sectionId: string;
  assets?: FloatingAsset[];
  className?: string;
}

export default function FloatingAssetsOverlay({ sectionId, assets = [], className = '' }: FloatingAssetsOverlayProps) {
  if (!assets || assets.length === 0) return null;

  // Filter assets assigned to this section or 'all'
  const sectionAssets = assets.filter(
    (a) => a && (a.section === sectionId || a.section === 'all' || !a.section)
  );

  if (sectionAssets.length === 0) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {sectionAssets.map((asset) => {
        const isRawSvg = asset.type === 'svg' || (asset.content && asset.content.trim().startsWith('<svg'));
        const size = asset.width || asset.size || 80;
        const opacity = asset.opacity !== undefined ? asset.opacity : 1;
        const rotation = asset.rotation || 0;
        const flipX = asset.flipX ? 'scaleX(-1)' : '';

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
        if (isRawSvg && asset.color) {
          const color = asset.color;
          if (svgHtml.includes('currentColor')) {
            svgHtml = svgHtml.replace(/currentColor/g, color);
          } else if (!svgHtml.includes('fill=') && !svgHtml.includes('stroke=')) {
            svgHtml = svgHtml.replace('<svg', `<svg fill="${color}"`);
          } else {
            svgHtml = svgHtml.replace(/fill="(?!none|url)[^"]*"/g, `fill="${color}"`);
            svgHtml = svgHtml.replace(/stroke="(?!none|url)[^"]*"/g, `stroke="${color}"`);
          }
        }

        // Animation variants
        let animateProps: any = {};
        let transitionProps: any = {};

        if (asset.animation === 'float') {
          animateProps = { y: [0, -12, 0, 10, 0], x: [0, 5, 0, -5, 0] };
          transitionProps = { duration: 6, repeat: Infinity, ease: 'easeInOut' };
        } else if (asset.animation === 'spin') {
          animateProps = { rotate: [rotation, rotation + 360] };
          transitionProps = { duration: 15, repeat: Infinity, ease: 'linear' };
        } else if (asset.animation === 'pulse') {
          animateProps = { scale: [1, 1.08, 1], opacity: [opacity, opacity * 0.7, opacity] };
          transitionProps = { duration: 3, repeat: Infinity, ease: 'easeInOut' };
        } else if (asset.animation === 'bounce') {
          animateProps = { y: [0, -18, 0] };
          transitionProps = { duration: 2, repeat: Infinity, ease: 'easeInOut' };
        }

        return (
          <motion.div
            key={asset.id}
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              left: `${asset.x}%`,
              top: `${asset.y}%`,
              width: `${size}px`,
              height: asset.height ? `${asset.height}px` : 'auto',
              opacity: opacity,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) ${flipX}`,
              zIndex: zIndex,
            }}
            animate={animateProps}
            transition={transitionProps}
          >
            {isRawSvg ? (
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            ) : (
              <img
                src={asset.content}
                alt={asset.name || 'Floating asset'}
                className="w-full h-full object-contain pointer-events-none"
                loading="lazy"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
