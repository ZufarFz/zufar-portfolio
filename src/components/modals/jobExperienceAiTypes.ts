export interface JobBulletOption {
  label: string;
  text: string;
}

export interface JobGeneratedPoint {
  id: string;
  theme: string;
  options: JobBulletOption[];
  selectedOptionIndex: number;
  isSelected: boolean;
  customText?: string;
}

export interface JobExperienceAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  company: string;
  existingBullets: string[];
  onApply: (newBullets: string[]) => void;
  lang: 'id' | 'en';
  isDark?: boolean;
}
