export interface TranslatedExperienceData {
  role: string;
  company: string;
  period: string;
  bulletPoints: string[];
}

export interface ExperienceTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceBaseId: string;
  sourceLang: 'id' | 'en';
  sourceData: {
    role: string;
    company: string;
    period: string;
    bulletPoints: string[];
  };
  isDark?: boolean;
  onApply: (translatedData: TranslatedExperienceData, targetLang: 'id' | 'en') => void;
}

