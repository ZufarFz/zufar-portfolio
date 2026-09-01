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
  category?: string;
  shortDescription?: string;
  description: string;
  tags: string[];
  image: string;
  impactMetric?: string;
  tools: string[];
  detailedMetrics?: {
    label: string;
    value: string;
  }[];
  slides?: CaseStudySlide[];
  showOnHome?: boolean;
  projectUrl?: string;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  bulletPoints: string[];
  tools?: string[];
}

export interface EducationItem {
  id?: string;
  period: string;
  degree: string;
  institution: string;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  icon: string; // Name of Lucide icon
  category: string;
  description: string;
  showOnWeb?: boolean;
  showOnCV?: boolean;
  customSvg?: string;
  svgUrl?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  labelId?: string;
  labelEn?: string;
  sortOrder?: number;
}

export interface CustomSubPage {
  id: string;
  title: string;
  titleId?: string;
  titleEn?: string;
  subtitle: string;
  subtitleId?: string;
  subtitleEn?: string;
  headerBg?: string;
  coverImageUrl?: string;
  iconName?: string;
  showOnStoryPage?: boolean;
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

export interface CustomSocial {
  id: string;
  name: string;
  value: string;
  usernameOrUrl?: string;
  logoUrl?: string;
  showOnWeb: boolean;
  showOnCvHeader: boolean;
  showOnCvFooter: boolean;
}

export interface IDCardSvgItem {
  id: string;
  name: string;
  svgContent: string;
  scale: number;
  x: number;
  y: number;
  zIndex: number;
}

export interface FloatingAsset {
  id: string;
  name: string;
  section: string; // 'home' | 'projects' | 'skills' | 'experience' | 'contact' | 'about_story' | 'all'
  type: 'svg' | 'url'; // 'svg' for raw SVG or 'url' for link/path
  content: string; // raw SVG string OR file URL
  color?: string; // custom color if raw SVG
  width?: number; // size in px (e.g., 100 to 1200+)
  height?: number;
  size?: number;
  scale?: number; // scale multiplier e.g. 1
  x: number; // position X percentage (0-100)
  y: number; // position Y percentage (0-100)
  rotation?: number; // 0 - 360 deg
  opacity?: number; // 0 - 1
  zIndex?: number; // e.g. 10
  layer?: 'bg' | 'above_image' | 'above_all'; // 'bg' (setara pattern/background), 'above_image' (di atas gambar, di bawah teks), 'above_all' (di atas semua)
  animation?: 'none' | 'float' | 'spin' | 'pulse' | 'bounce';
  flipX?: boolean;
}

export interface CVData {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  github?: string;
  instagram?: string;
  whatsapp?: string;
  aboutMe?: string;
  webTexts?: Record<string, string>;
  idCardSvgs?: IDCardSvgItem[];
  floatingAssets?: FloatingAsset[];
  technicalArsenal: {
    dbms: string;
    scientificLanguages: string;
    dataPresentation: string;
    analyticsSpecialties: string;
  };
  education: {
    id?: string;
    period: string;
    degree: string;
    institution: string;
    description?: string;
  }[];
  educationSections?: EducationSection[];
  experiences: {
    id: string;
    period: string;
    role: string;
    company: string;
    bulletPoints: string[];
    tools?: string[];
  }[];
  skills?: SkillItem[];
  skillCategories?: SkillCategory[];
  caseStudies?: CaseStudy[];
  personality?: PersonalityItem[];
  hobbies?: HobbyItem[];
  careerGoals?: CareerGoalItem[];
  customSubPages?: CustomSubPage[];
  methodologyTitle: string;
  methodologyText: string;
  avatarUrl: string;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  homeImageUrl?: string;
  homeImageUrlDark?: string;
  homeImageScale?: number;
  homeImageX?: number;
  homeImageY?: number;
  homeImageFade?: number;
  homeImageCircleScale?: number;
  homeImageCircleX?: number;
  homeImageCircleY?: number;
  aboutStoryImageScale?: number;
  aboutStoryImageX?: number;
  aboutStoryImageY?: number;
  idCardBgTextSize?: number;
  idCardPortraitFadeEnabled?: boolean;
  idCardPortraitFadeStart?: number;
  idCardPortraitFadeEnd?: number;
  idCardSvgLight?: string;
  idCardSvgDark?: string;
  idCardSvgScale?: number;
  idCardSvgX?: number;
  idCardSvgY?: number;
  idCardTextX?: number;
  idCardTextY?: number;
  idCardBadgeX?: number;
  idCardBadgeY?: number;
  customSocials?: CustomSocial[];
  headerContacts?: string[];
  footerSocials?: string[];
  nickname?: string;
  useNicknameOnCard?: boolean;
  cardSocials?: string[];
  idCardGroup?: string;
  idCardSubText?: string;
  idCardText3?: string;
  layoutSettings?: {
    themeColor: 'emerald' | 'blue' | 'slate' | 'indigo' | 'rose' | 'amber';
    fontSize: 'compact' | 'standard' | 'comfortable';
    spacing: 'tight' | 'standard' | 'spacious';
    layoutStyle: 'left-sidebar' | 'right-sidebar' | 'single-column';
    fontFamily: 'sans' | 'serif' | 'mono';
    sectionOrder: string[];
    showEducation?: boolean;
    visibleExperiences?: string[];
    visibleEducations?: string[];
    marginTopBottom?: 'lebar' | 'sedang' | 'sempit';
    marginLeftRight?: 'lebar' | 'sedang' | 'sempit';
    headerPhotoPosition?: 'left' | 'top';
    headerAlignment?: 'left' | 'center';
    headerContactPosition?: 'bottom' | 'right';
  };
}
