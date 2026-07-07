export interface CaseStudySlide {
  id: string;
  title: string;
  content: string;
  visualType: 'metric' | 'chart' | 'bullet_points' | 'image' | 'text';
  metricLabel?: string;
  metricValue?: string;
  bulletsList?: string[];
  image?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  impactMetric: string;
  tools: string[];
  detailedMetrics?: {
    label: string;
    value: string;
  }[];
  slides?: CaseStudySlide[];
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  bulletPoints: string[];
  tools?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  icon: string; // Name of Lucide icon
  category: string;
  description: string;
  showOnWeb?: boolean;
  showOnCV?: boolean;
}

export interface SkillCategory {
  id: string;
  label: string;
  sortOrder?: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}

export interface PersonalityItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Name of Lucide icon
}

export interface HobbyItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Name of Lucide icon
}

export interface CareerGoalItem {
  id: string;
  title: string;
  description: string;
  target_year: string;
  icon: string; // Name of Lucide icon
}

export interface EducationSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  layoutType: 'image_left' | 'image_right' | 'centered_hero' | 'minimal_text' | 'split_grid';
  bgColor: 'slate' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'dark' | 'light';
  linkedEducationDegree?: string; // Holds reference to the degree of portfolio_education
  sortOrder?: number;
  imageOrientation?: 'landscape' | 'portrait' | 'background_full' | 'background_edge';
  imageSize?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  paragraphLayout?: 'left' | 'center' | 'right';
  imageLayout?: 'left' | 'center' | 'right';
  imageModel?: 'normal' | 'bg_full' | 'bg_smooth';
  imageScale?: number;
  imageX?: number;
  imageY?: number;
  imageOpacity?: number;
  maskWidth?: number;
  imageFadeDirection?: 'oval' | 'right' | 'left' | 'top' | 'bottom';
  ovalWidth?: number;
  ovalHeight?: number;
  ovalPointiness?: number;
}

