import { CVData, FloatingAsset } from '../../../types';
import { LayoutTemplate } from '../../../data/layoutTemplates';

export interface ThemeTemplateStudioProps {
  cvData: CVData;
  activeSection: string;
  isDark: boolean;
  onApplyTheme: (patch: Record<string, string>, themeAccent?: string) => void;
  onApplyLayout: (layout: LayoutTemplate) => void;
  onApplyFullZenPreset: () => void;
  onAddSingleAsset: (asset: Partial<FloatingAsset>) => void;
}

