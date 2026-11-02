import { PatternRenderer } from './types';
import { JAPANESE_WAGARA_PATTERNS } from './japaneseWagara';
import { MODERN_GEOMETRIC_PATTERNS } from './modernGeometric';
import { WATERCOLOR_TEXTURES } from './watercolorTextures';

export * from './types';
export * from './groups';
export * from './japaneseWagara';
export * from './modernGeometric';
export * from './watercolorTextures';

export const PATTERN_RENDERERS: Record<string, PatternRenderer> = {
  ...JAPANESE_WAGARA_PATTERNS,
  ...MODERN_GEOMETRIC_PATTERNS,
  ...WATERCOLOR_TEXTURES
};
