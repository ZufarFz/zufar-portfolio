import React, { useState } from 'react';
import { 
  Cpu, Flame, Smile, GraduationCap, Briefcase, Award, Heart, 
  BookOpen, Compass, ArrowLeft, Search, Calendar, MapPin, Mail, 
  ExternalLink, ChevronRight, Sparkles, Target, PenTool, Bookmark, Share2,
  Database, Shield, Terminal, ArrowRight, BookMarked, Check, LayoutGrid
} from 'lucide-react';

// Helper to create seamless dynamic fade gradient overlay matching any background color
export function createFadeGradientStyle(bgColor: string): React.CSSProperties {
  if (!bgColor) return {};
  const trimmed = bgColor.trim();
  if (trimmed.startsWith('#')) {
    let hex = trimmed;
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    if (hex.length === 7) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return {
        background: `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 0.5) 45%, rgba(${r}, ${g}, ${b}, 0.88) 75%, ${hex} 100%)`
      };
    }
  }
  return {
    background: `linear-gradient(to bottom, transparent 0%, color-mix(in srgb, ${bgColor} 50%, transparent) 45%, color-mix(in srgb, ${bgColor} 88%, transparent) 75%, ${bgColor} 100%)`
  };
}

export const IconMap: Record<string, any> = {
  Cpu, Flame, Smile, GraduationCap, Briefcase, Award, Heart, 
  BookOpen, Compass, ArrowLeft, Search, Calendar, MapPin, Mail, 
  ExternalLink, ChevronRight, Sparkles, Target, PenTool, Bookmark, Share2,
  Database, Shield, Terminal, ArrowRight, BookMarked, Check, LayoutGrid
};

export const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
  const IconComponent = IconMap[iconName] || Award;
  return <IconComponent className={className} />;
};

export interface SmoothImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  targetOpacity?: number;
  showSkeleton?: boolean;
}

export function SmoothImage({
  src,
  alt,
  className = "",
  style = {},
  targetOpacity = 1,
  showSkeleton = true,
  ...props
}: SmoothImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const isPreloaded = () => {
    if (typeof window !== 'undefined') {
      const cache = (window as any).__LOADED_IMAGES_CACHE;
      return !!(cache && cache.has(src));
    }
    return false;
  };

  const [loaded, setLoaded] = useState(isPreloaded);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (isPreloaded()) {
      setLoaded(true);
    } else {
      setLoaded(false);
      if (imgRef.current && imgRef.current.complete) {
        if (typeof window !== 'undefined') {
          (window as any).__LOADED_IMAGES_CACHE = (window as any).__LOADED_IMAGES_CACHE || new Set<string>();
          (window as any).__LOADED_IMAGES_CACHE.add(src);
        }
        setLoaded(true);
      }
    }
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 bg-slate-500/10 dark:bg-slate-400/5 animate-pulse rounded-2xl" />
      )}
      <img
        ref={imgRef as any}
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-1000 ease-out`}
        style={{
          ...style,
          opacity: loaded ? targetOpacity : 0
        }}
        onLoad={() => {
          if (typeof window !== 'undefined') {
            (window as any).__LOADED_IMAGES_CACHE = (window as any).__LOADED_IMAGES_CACHE || new Set<string>();
            (window as any).__LOADED_IMAGES_CACHE.add(src);
          }
          setLoaded(true);
        }}
        {...props}
      />
    </div>
  );
}

