import React from 'react';
import { brandColors, getAbsoluteSocialUrl } from './socialBrandHelpers';
import { renderSocialSvg } from './socialSvgMap';

export interface SocialIconProps {
  platform: string;
  className?: string;
  size?: number;
  useBrandColor?: boolean;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  className = 'w-4 h-4', 
  size = 16, 
  useBrandColor = false 
}) => {
  const norm = platform.toLowerCase().trim().replace(/\s+/g, '');
  const color = useBrandColor ? (brandColors[norm] || 'currentColor') : 'currentColor';
  const finalStyle = useBrandColor && color !== 'currentColor' ? { color } : undefined;

  return <>{renderSocialSvg(norm, color, finalStyle, className, size)}</>;
};

export { getAbsoluteSocialUrl };
export default SocialIcon;
