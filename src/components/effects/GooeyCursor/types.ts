export type GooeyHoverReaction = 
  | 'none' 
  | 'question' 
  | 'exclamation' 
  | 'heart' 
  | 'sparkle' 
  | 'wide_eyes';

export interface GooeyCursorProps {
  enabled?: boolean;
  color?: string;
  secondaryColor?: string;
  theme?: 'light' | 'dark';
  size?: number;
  opacity?: number;
  hideDefaultCursor?: boolean;
  enableSplash?: boolean;
  hoverScale?: boolean;
  hoverReaction?: GooeyHoverReaction;
  headStyle?: 'eyes' | 'none' | 'dot';
}

export interface Point {
  x: number;
  y: number;
}

export interface SplashParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number;
  life: number;
  maxLife: number;
}
