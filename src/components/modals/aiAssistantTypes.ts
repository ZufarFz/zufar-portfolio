export interface AIRecommendation {
  title: string;
  text: string;
  description?: string;
}

export interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldLabel: string;
  currentValue: string;
  targetLang: 'id' | 'en';
  onApply: (enhancedText: string) => void;
  contextHint?: string;
}

export type ToneOption = 'impact' | 'executive' | 'concise' | 'creative';

export const TONES: { id: ToneOption; labelId: string; labelEn: string; icon: string; desc: string }[] = [
  {
    id: 'impact',
    labelId: 'Impact & Data',
    labelEn: 'Impact & Metrics',
    icon: '⚡',
    desc: 'Menonjolkan hasil kerja terukur, efisiensi, dan metrik data'
  },
  {
    id: 'executive',
    labelId: 'Eksekutif & Formal',
    labelEn: 'Executive & Formal',
    icon: '👔',
    desc: 'Bahasa profesional standar industri tingkat senior'
  },
  {
    id: 'concise',
    labelId: 'Singkat & Padat',
    labelEn: 'Concise & Direct',
    icon: '🎯',
    desc: 'To-the-point, hilangkan kata mubazir, mudah dipindai recruiter'
  },
  {
    id: 'creative',
    labelId: 'Naratif & Menarik',
    labelEn: 'Engaging Story',
    icon: '✨',
    desc: 'Alur penjelasan yang mengalir dan berkarakter'
  }
];

