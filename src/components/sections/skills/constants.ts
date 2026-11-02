import { SkillItem, SkillCategory } from '../../../types';

export interface SkillsArsenalProps {
  skills?: SkillItem[];
  theme?: 'light' | 'dark';
  customCategories?: SkillCategory[];
  lang?: 'id' | 'en';
  badgeText?: string;
  groupDesc?: string;
  viewMode?: 'home' | 'detailed';
  onNavigateToAboutMe?: () => void;
}

export interface SkillCategoryGroup {
  id: string;
  label: string;
  jpTag: string;
  items: SkillItem[];
}

// Map known category IDs or slugs to standard display labels and Japanese sub-tags
export const CATEGORY_MAP: Record<string, { labelId: string; labelEn: string; jp: string }> = {
  frontend: {
    labelId: 'FRONTEND',
    labelEn: 'FRONTEND',
    jp: 'フロントエンド'
  },
  backend: {
    labelId: 'BACKEND & DATABASE',
    labelEn: 'BACKEND & DATABASE',
    jp: 'バックエンド'
  },
  dbms: {
    labelId: 'DBMS & QUERY',
    labelEn: 'DBMS & QUERY',
    jp: 'データベース'
  },
  scientific: {
    labelId: 'PROGRAMMING & SCRIPT',
    labelEn: 'PROGRAMMING & SCRIPT',
    jp: 'プログラミング'
  },
  visualization: {
    labelId: 'BUSINESS INTELLIGENCE & VISUALIZATION',
    labelEn: 'BUSINESS INTELLIGENCE & VISUALIZATION',
    jp: '視覚化 & BI'
  },
  analytical: {
    labelId: 'ANALYTICS & STATS',
    labelEn: 'ANALYTICS & STATS',
    jp: '分析ツール'
  },
  tools: {
    labelId: 'DEV TOOLS & INFRA',
    labelEn: 'DEV TOOLS & INFRA',
    jp: 'ツール'
  },
  core: {
    labelId: 'CORE TECHNOLOGIES',
    labelEn: 'CORE TECHNOLOGIES',
    jp: '基幹技術'
  }
};

