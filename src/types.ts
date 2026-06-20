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
