import { CVData } from '../../types';

export interface LayoutSettings {
  themeColor: 'emerald' | 'blue' | 'slate' | 'indigo' | 'rose' | 'amber';
  fontSize: 'compact' | 'standard' | 'comfortable';
  spacing: 'tight' | 'standard' | 'spacious';
  layoutStyle: 'left-sidebar' | 'right-sidebar' | 'single-column';
  fontFamily: 'sans' | 'serif' | 'mono';
  sectionOrder: string[]; // 'arsenal', 'education', 'experience', 'methodology'
  headerPhotoPosition?: 'left' | 'top' | 'right' | 'none';
  headerAlignment?: 'left' | 'center' | 'right' | 'justify';
  headerContactPosition?: 'bottom' | 'right';
  contactPosition?: 'bottom' | 'right';
  showEducation?: boolean;
  visibleExperiences?: string[];
  visibleEducations?: string[];
  marginTopBottom?: 'lebar' | 'sedang' | 'sempit';
  marginLeftRight?: 'lebar' | 'sedang' | 'sempit';
}

export const DEFAULT_SETTINGS: LayoutSettings = {
  themeColor: 'emerald',
  fontSize: 'standard',
  spacing: 'standard',
  layoutStyle: 'left-sidebar',
  fontFamily: 'sans',
  sectionOrder: ['arsenal', 'education', 'experience', 'methodology'],
  headerPhotoPosition: 'left',
  headerAlignment: 'left',
  headerContactPosition: 'bottom',
  marginTopBottom: 'sedang',
  marginLeftRight: 'sedang'
};

export interface ResumeModalProps {
  onKeepOpen?: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdate?: (updatedData: CVData) => void;
  theme?: 'light' | 'dark';
  inlinePreview?: boolean;
  directDownload?: boolean;
}

