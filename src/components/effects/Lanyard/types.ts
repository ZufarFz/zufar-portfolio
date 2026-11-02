export const cardGLB = '/card.glb';
export const lanyard = '/lanyard.png';

export const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
export const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardText?: string | null;
  lanyardWidth?: number;
  mobileLanyardWidth?: number;
  cardScale?: number;
  mobileCardScale?: number;
  anchorY?: number;
  mobileAnchorY?: number;
  targetCenterY?: number;
  mobileTargetCenterY?: number;
  startY?: number;
  mobileStartY?: number;
  className?: string;
}

export interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardText?: string | null;
  lanyardWidth?: number;
  cardScale?: number;
  anchorY?: number;
  targetCenterY?: number;
  startY?: number;
}

