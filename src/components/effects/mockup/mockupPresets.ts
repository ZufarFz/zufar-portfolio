import { CVData } from '../../../types';

export interface MobileDevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  os: 'ios' | 'android';
  notchType: 'island' | 'punchhole' | 'classic';
}

export const DEVICE_PRESETS: MobileDevicePreset[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    os: 'ios',
    notchType: 'island'
  },
  {
    id: 'samsung-s24',
    name: 'Galaxy S24',
    width: 412,
    height: 915,
    os: 'android',
    notchType: 'punchhole'
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE (Kecil)',
    width: 375,
    height: 667,
    os: 'ios',
    notchType: 'classic'
  }
];

export interface MobilePhoneMockupProps {
  cvData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  onClose: () => void;
  onThemeChange?: (newTheme: 'light' | 'dark') => void;
  onLangChange?: (newLang: 'id' | 'en') => void;
}
