import React from 'react';

export interface BgPatternOption {
  id: string;
  label: string;
  desc: string;
  badge?: string;
}

export interface BgPatternGroup {
  name: string;
  icon: string;
  badge: string;
  options: BgPatternOption[];
}

export interface PatternRenderContext {
  patternId: string;
  scaleVal: number;
  defaultStrokeColor: string;
  isDark: boolean;
  baseClass: string;
  activeOpacity: number;
  isMobile: boolean;
  color?: string;
}

export type PatternRenderer = (ctx: PatternRenderContext) => React.ReactNode;
