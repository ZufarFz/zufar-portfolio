import React from 'react';
import { X } from 'lucide-react';
import { CaseStudy } from '../../types';

interface ProjectDetailGalleryProps {
  project: CaseStudy;
  currentBannerImage: string;
  uniqueImages: string[];
  activeImageIndex: number;
  setActiveImageIndex: (idx: number) => void;
  lineStyles: any;
  onClose: () => void;
  lang?: 'id' | 'en';
}

export const ProjectDetailGallery: React.FC<ProjectDetailGalleryProps> = ({
  project,
  currentBannerImage,
  uniqueImages,
  activeImageIndex,
  setActiveImageIndex,
  lineStyles,
  onClose,
  lang = 'id'
}) => {
  const toolsOrTags = ((project.tools && project.tools.length > 0) ? project.tools : (project.tags || []));

  return (
    <div className="relative aspect-[16/10] sm:aspect-[16/9] min-h-[230px] sm:min-h-[270px] md:min-h-[300px] max-h-[360px] w-full shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end">
      <img 
        key={currentBannerImage}
        src={currentBannerImage} 
        alt={project.title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 via-45% to-transparent pointer-events-none" />

      <button
        onClick={onClose}
        title={lang === 'id' ? 'Tutup' : 'Close'}
        className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-950/85 hover:bg-slate-900 text-white border border-white/20 transition-all cursor-pointer shadow-lg active:scale-90"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="relative z-20 p-4 sm:p-6 space-y-2.5">
        <h3 className="text-lg sm:text-2xl md:text-3xl font-sans font-extrabold tracking-tight leading-snug text-white drop-shadow-md">
          {project.title}
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
          {toolsOrTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {toolsOrTags.map((tag, idx) => (
                <span 
                  key={idx}
                  style={{ color: lineStyles.skillBadgeColor }}
                  className="font-mono text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-950/90 border border-white/25 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {uniqueImages.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-slate-950/90 p-1 sm:p-1.5 rounded-lg border border-white/20 shadow-md">
              {uniqueImages.slice(0, 3).map((imgUrl, i) => {
                const isActive = activeImageIndex === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(i);
                    }}
                    title={`${lang === 'id' ? 'Gambar' : 'Image'} ${i + 1}`}
                    style={
                      isActive
                        ? {
                            borderColor: lineStyles.activeThumbnailBorder,
                            boxShadow: lineStyles.activeThumbnailRing
                          }
                        : undefined
                    }
                    className={`relative w-9 h-6 sm:w-11 sm:h-7 md:w-13 md:h-8 rounded overflow-hidden border transition-all cursor-pointer ${
                      isActive
                        ? 'scale-105 opacity-100'
                        : 'border-white/30 opacity-70 hover:opacity-100 hover:border-white'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span 
                      className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-mono font-bold leading-none bg-slate-950/90"
                      style={{
                        backgroundColor: isActive ? lineStyles.activeThumbnailBadgeBg : 'rgba(0,0,0,0.85)',
                        color: isActive ? lineStyles.activeThumbnailBadgeText : 'rgba(255,255,255,0.85)'
                      }}
                    >
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
