import { FloatingAsset } from '../../types';

export interface FloatingAssetsOverlayProps {
  sectionId: string;
  assets?: FloatingAsset[];
  className?: string;
  theme?: string;
  bgColor?: string;
  isMobilePreview?: boolean;
}

export function processSvgWithBackdropFilter(
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
