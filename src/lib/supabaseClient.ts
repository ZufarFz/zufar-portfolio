import { createClient } from '@supabase/supabase-js';
import { CaseStudy, SkillItem, SkillCategory, PersonalityItem, HobbyItem, CareerGoalItem, EducationSection } from '../types';

// Lazily read environment variables
const supabaseUrl = ((import.meta as any).env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '').trim();

// Create a client only if configured with valid HTTP/HTTPS URL and non-placeholder value
function checkSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-role-key-from-settings')) return false;
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) return false;
  try {
    const url = new URL(supabaseUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

export const isSupabaseConfigured = checkSupabaseConfigured();

function createSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    return null;
  }
}

export const supabase = createSupabaseClient();

// Helper to upload images directly into Supabase Storage
export async function uploadFileToStorage(file: File, bucketName: string = 'portfolio_assets'): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  // Generate a unique filename under a folder called uploads
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
}

export const DEFAULT_WEB_TEXTS: Record<string, string> = {
  education_intro: "Explore my academic achievements, scientific training foundations, and formal credential roadmaps represented in customized presentation sheets.",
  hero_badge: "DATA ANALYST & BI STRATEGIST",
  hero_title: "Turning Raw Data\ninto Enterprise Decisions",
  hero_subtitle: "Specializing in high-impact insights through custom SQL engines, Python workflows, and advanced Business Intelligence. I transform transactional records into clean, validated, and actionable optimization roadmaps.",
  projects_badge: "CASE CHRONICLES",
  projects_title: "Selected Case Studies",
  projects_subtitle: "A structured demonstration of technical proficiency across the entire data deployment stack, highlighting real performance audits.",
  skills_badge: "STACK CLASSIFICATION",
  skills_title: "Technical Arsenal",
  skills_subtitle: "Expertise and architectural know-how across relational SQL databases, mathematical script engines, and custom telemetry filters.",
  experience_badge: "CAREER TRACEABILITY",
  experience_title: "Professional Journey",
  experience_subtitle: "Proven experience designing databases, reporting frameworks, and pipelines inside rapid consumer spaces. Click to toggle bullet point summaries.",
  contact_badge: "INQUIRY MATRIX",
  contact_title: "Let's connect",
  contact_subtitle: "Available for corporate consulting engagements, full-time senior analyst roles, or panel speaking opportunities regarding advanced business intelligence.",
  about_story_badge: "✦ DISCOVER OUR STORY",
  about_story_title: "About Me",
  about_story_intro: "I am a passionate Business Intelligence Analyst and Developer dedicated to synthesizing raw complexity into high-fidelity, interactive applications. With a dual focus on data pipeline architecture and pixel-perfect design craftsmanship, I transform ambitious visions into reality.",
  about_story_image_url: "",
  about_story_left_1_title: "Interior / Data Architecture",
  about_story_left_1_desc: "Structuring clean, robust pipelines and modeling relational schemas to establish a highly performant data foundation.",
  about_story_left_2_title: "Exterior / Visual Analytics",
  about_story_left_2_desc: "Crafting intuitive dashboards and reports that deliver immediate insights and elevate decision-making speed.",
  about_story_left_3_title: "Design / Product Strategy",
  about_story_left_3_desc: "Blending sleek user interface design with rapid interactions for web portals that are both functional and delightful.",
  about_story_right_1_title: "Decoration / Business Strategy",
  about_story_right_1_desc: "Translating corporate requirements into verifiable KPIs that optimize operational performance and unlock growth.",
  about_story_right_2_title: "Planning / Careful Logic",
  about_story_right_2_desc: "Iterating carefully through requirements, timelines, schema design, and constraints with high professional standards.",
  about_story_right_3_title: "Execution / Sleek Delivery",
  about_story_right_3_desc: "Bringing data projects to life through flawless code integration, thorough validation, and continuous alignment."
};

// Initial default CV data matching the original portfolio CV perfectly with slides integration
export const DEFAULT_CV_DATA = {
  name: "",
  title: "Senior Data Analyst & BI Decision Strategist",
  location: "New York City, NY",
  email: "analyst@portfolio.com",
  linkedin: "",
  github: "",
  instagram: "",
  whatsapp: "",
  aboutMe: "Driven and detail-oriented Senior Data Analyst with over 6 years of experience engineering high-impact SQL pipelines, advanced predictive models, and intuitive executive-level BI dashboards. Adept at turning complex unstructured transactional records into optimized operational decisions and actionable revenue insights.\n\nPassionate about data transparency, pipeline performance alignment, and strategic growth. Committed to driving efficiency through statistical verification frameworks and transparent KPIs.",
  technicalArsenal: {
    dbms: "SQL, PostgreSQL, Snowflake, BigQuery, CTEs, Window Functions",
    scientificLanguages: "Python (Pandas, Numpy, Scikit-learn), R Stats (ggplot2, ANOVA)",
    dataPresentation: "Tableau, PowerBI (DAX Modeling), Excel, PowerPivot",
    analyticsSpecialties: "RFM Customer Clustering, Time-Series Forecasting, Logistic Nodes Optimization"
  },
  education: [
    {
      period: "2014 — 2018",
      degree: "B.S. Applied Statistics & Computer Science",
      institution: "Columbia University, NYC"
    }
  ],
  educationSections: [
    {
      id: "edu-sec-1",
      title: "My Educational Foundations",
      content: "Combining statistical rigor with computational engineering. My academic philosophy revolves around understanding the underlying mathematical mechanics of modern analytical architectures, ensuring every algorithm and query is backed by sound statistical evidence.",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
      layoutType: "centered_hero" as const,
      bgColor: "emerald" as const,
      linkedEducationDegree: "B.S. Applied Statistics & Computer Science",
      sortOrder: 0
    },
    {
      id: "edu-sec-2",
      title: "Theoretical & Applied Statistics",
      content: "At Columbia University, I focused heavily on probability theory, regression analysis, and computational statistics. This structured training taught me to look beyond simple data aggregation and identify true causal signals inside massive, noisy corporate datasets.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
      layoutType: "image_right" as const,
      bgColor: "slate" as const,
      linkedEducationDegree: "B.S. Applied Statistics & Computer Science",
      sortOrder: 1
    }
  ],
  experiences: [
    {
      id: "exp-1",
      period: "2021 — PRESENT",
      role: "Senior Data Analyst / Decision Strategist",
      company: "Global Tech Corp",
      bulletPoints: [
        "Designed and maintained SQL and Python pipelines executing RFM cohorts segmentation across 50k+ daily users, resulting in a 24% email ctr uplift.",
        "Spearheaded churn modeling audits analyzing consumer trends to reclaim $2.2M in annual recurring churn losses.",
        "Built real-time visual KPI Tableau boards tracking high-velocity revenue pipelines for senior VP product meetings."
      ],
      tools: ["SQL", "Python", "PowerBI", "Power Query"]
    },
    {
      id: "exp-2",
      period: "2018 — 2021",
      role: "Data Analyst / Scientist",
      company: "Insight Solutions",
      bulletPoints: [
        "Drafted multiple linear regressions and logistics predictive analytics to forecast warehouse delivery latencies, reducing supply-chain leads by over 15% overall.",
        "Constructed segmentations for automated email schedules, securing an 18% boost in overall conversion indices."
      ],
      tools: ["Python", "Power Query", "Excel", "PowerBI"]
    }
  ],
  skills: [
    {
      id: "sql",
      name: "SQL",
      icon: "Database",
      category: "dbms",
      description: "Database query design, CTEs, window functions, query plan optimization, schema creation, PostgreSQL, and Snowflake setups.",
      showOnWeb: true,
      showOnCV: true
    },
    {
      id: "python",
      name: "Python",
      icon: "Terminal",
      category: "scientific",
      description: "Pandas, NumPy, data cleaning workflows, automated analytics scripts, statistical aggregations, and custom API proxies.",
      showOnWeb: true,
      showOnCV: true
    },
    {
      id: "power-query",
      name: "Power Query",
      icon: "Layers",
      category: "visualization",
      description: "Advanced M-code operations, ETL data connections, enterprise-level data mashups, parameterization, and schema merges.",
      showOnWeb: true,
      showOnCV: true
    },
    {
      id: "powerbi",
      name: "PowerBI",
      icon: "TrendingUp",
      category: "visualization",
      description: "DAX modeling, power query ETL setups, enterprise level tabular reporting layouts, and automated emails notifications.",
      showOnWeb: true,
      showOnCV: true
    },
    {
      id: "excel",
      name: "Excel",
      icon: "Grid",
      category: "analytical",
      description: "PowerPivot datasets, nested lookup formulas, financial sensitivity scenarios, and rapid ad-hoc analytical checks.",
      showOnWeb: true,
      showOnCV: true
    }
  ] as SkillItem[],
  skillCategories: [] as SkillCategory[],
  caseStudies: [
    {
      id: "customer-segmentation",
      title: "Customer Segmentation Analysis",
      category: "Marketing Analytics & Automation",
      description: "Automated RFM (Recency, Frequency, Monetary) analysis using Python data structures to categorize 50,000+ global customers. Provided business users with live, self-serve cohorts to match marketing automation campaigns directly, boosting email campaign performance indices.",
      tags: ["Python", "Power Query", "RFM Analysis", "Customer Cohorts"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuFlL71mrCRfgkuPhdCAF98ij9wxg8CYLIpZ9-eLW7h4uYyJ3RK2vqfoTW-aEPtiwTloMPQUuzIimFyqJ62QDdsTxNT9V9l2dQQp3D8CsXiA5EcPdQFCYSqBrTkET1Lv_-6cLC38OVUm9k2ZDBgSW_nV0u-DVcX7jxS0Od8R6j6p7MF0JG-_eLpOay3rYolqMQEY9ihRsxkZ5XeBeSj7gEVSqO7l7Qm-S_fTzqNKCFqLTRAGH-zuMCMhVa5HVTLyD6jwldzeGj1geA",
      impactMetric: "+24% Email CTR",
      tools: ["Python", "Power Query", "SQL"],
      slides: [
        {
          id: "cs-slide-1",
          title: "Executive Problem & Hypothesis",
          content: "We analyzed 50,000+ global customers to identify severe marketing churn pockets and optimize automated campaigns. Stagnant customer segmentation triggered high marketing decay rate, resulting in over $2.2M of potential lost cohorts annually.",
          visualType: "metric",
          metricLabel: "Identified Annual Risk Exposure",
          metricValue: "$2.20M USD"
        },
        {
          id: "cs-slide-2",
          title: "RFM Cohorts Breakdown Pattern",
          content: "Constructed precise SQL pipelines (using recursive CTEs and windowing functions) to group users dynamically by Recency, Frequency, and Monetary indices, feeding back directly to live mailing cohorts.",
          visualType: "bullet_points",
          bulletsList: [
            "Champions Segment: High frequency, high monetary, recently active target group.",
            "Average/Loyal Consumers: Medium recency, stable recurring orders index.",
            "Severe Churn Risk Cohorts: Haven't checked out in 120+ days. Prime reactivation target."
          ]
        },
        {
          id: "cs-slide-3",
          title: "Performance Uplift & Final Impact",
          content: "Automating this RFM segmentation and connecting it to our campaign triggers unlocked an exceptional CTR upgrade. This minimized manual cohorts querying time from 12 hours a week to zero.",
          visualType: "metric",
          metricLabel: "Campaign Email CTR Growth",
          metricValue: "+24.0%"
        }
      ]
    },
    {
      id: "sales-forecasting",
      title: "Sales Forecasting Model",
      category: "Business Planning & Finance",
      description: "Developed and validated an integrated predictive regression model analyzing multi-year historical order books. Predicts incoming enterprise revenue, seasonal variance modifiers, and marketing channel responses with over 95% validation accuracy.",
      tags: ["SQL", "PowerBI", "Sales Trends", "Business Intelligence"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4at_MfB3KVhLLsSAvR5O74aQ77QDJm5dapXWTiarjOduQPHE1pBfcrbGjeCW7o9usfS9TX8d-Gin7Kp0dJ0WTbNDL_ZwHe_JHbcmlZw3c_EWFbdd415cMyJy6qotSUSzinHUaJ-eINpz4Gh5Pk4Rz-_Qd3bmOcuA-_hPnMZvnayUVcsWZt7S_6mV71rvlkCXIdcCNenlUaSbFdmLog6E26dnCv-_hqCx5PcV-Klbi-t7cgynNu6p_Hz2Yt_F0IKOaCPVGlRmEI4Y",
      impactMetric: "95% Model Accuracy",
      tools: ["SQL", "PowerBI", "Python", "Excel"],
      slides: [
        {
          id: "sf-slide-1",
          title: "The Forecasting Challenge",
          content: "Corporate financial analysts struggled with predicting high-velocity invoice variations due to rapid sea cargo seasonal lag conditions.",
          visualType: "metric",
          metricLabel: "Historic Quarterly Latency",
          metricValue: "18.5 Days"
        },
        {
          id: "sf-slide-2",
          title: "Predictive Analytics Architecture",
          content: "Fitted dynamic linear regression algorithms and trend models over a 5-year transactional dataset using Python scientific libraries.",
          visualType: "bullet_points",
          bulletsList: [
            "Data Extraction: Cleaned outlier raw data sequences via custom SQL scripts.",
            "Smoothing Patterns: Additive seasonality factor modeling.",
            "Deployment: Built an executive dashboard in PowerBI reflecting incoming trends."
          ]
        },
        {
          id: "sf-slide-3",
          title: "Accuracy Verification Statistics",
          content: "Achieved exceptionally robust statistical scores under training cross-validations, meaning senior leaders can budget with maximum confidence.",
          visualType: "metric",
          metricLabel: "Cross-Validated Accuracy",
          metricValue: "95.0%"
        }
      ]
    },
    {
      id: "supply-chain",
      title: "Supply Chain Optimization",
      category: "Operational Logistics",
      description: "Identified supply chain delivery bottlenecks through comprehensive spatial route allocation and lead-time analysis. Built responsive custom dashboard layouts in PowerBI using cleaned Power Query steps to flag high-latency routes, reducing total delivery lead times through warehouse re-allocation and smart routing patterns.",
      tags: ["PowerBI", "Power Query", "Excel", "KPI Dashboard"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDo-a6SXIcAxZjhbhWokPhtATOqTJOhP06ZPDuhdhhIbiZ6m4A8GLXhZNZrbXkcNF19Q85CjV-drdvyruBf0JWduWK9DvUM0lxCwK6jOnZNbbxJA98RlagxFrEdRld5IBNJti-Yacm4AGtAxKMLvi3-1shwH-cCcEdJW8N1dPls9YTrOO8meoT780A_8NMYuoy_soP_Rz82vTIPQ104Ht3AzarfvimQQGILH7zWiPyuZKlRwEnhLCxovkZQuXj7o0qLiWV2pyMgmNY",
      impactMetric: "-15% Lead Time",
      tools: ["PowerBI", "Power Query", "Excel", "SQL"],
      slides: [
        {
          id: "sc-slide-1",
          title: "Identifying Route Bottlenecks",
          content: "Discovered critical lag sources in multi-point spatial route allocations, specifically where transport handoffs were delayed by carrier misalignments.",
          visualType: "metric",
          metricLabel: "Average Total Lead Time",
          metricValue: "12.8 Days"
        },
        {
          id: "sc-slide-2",
          title: "BI Real-Time Dashboard Integration",
          content: "Mapped custom geographic points using Power Query steps and automated APIs. Integrated interactive live warnings inside PowerBI to alert warehouse dispatch officers when an order risks entering high-latency paths.",
          visualType: "bullet_points",
          bulletsList: [
            "Dynamic Dispatch Alerts: Highlights active carriers carrying backlog warnings.",
            "Unified Schema: Converted diverse CSV outputs into centralized SQL schemas.",
            "Interactive Reports: Executives drill down into individual terminal wait logs."
          ]
        },
        {
          id: "sc-slide-3",
          title: "Operational Cost Savings",
          content: "Enabled logistics managers to instantly reroute critical orders, bypassing carrier backlogs and achieving a highly visual reduction in transit delays.",
          visualType: "metric",
          metricLabel: "Lead Time Latency Decrease",
          metricValue: "-15.0%"
        }
      ]
    }
  ] as CaseStudy[],
  methodologyTitle: "Core Methodology",
  methodologyText: "My analyst philosophy centers around absolute transparency of pipeline metrics. Rather than larping with mock structures, I prioritize rigorous statistical validation (ANOVA, significance tests) and intuitive visual UX dashboards that drive executive-level decision making.",
  avatarUrl: "",
  avatarScale: 1,
  avatarX: 0,
  avatarY: 0,
  homeImageUrl: "",
  homeImageUrlDark: "",
  homeImageScale: 1,
  homeImageX: 0,
  homeImageY: 0,
  aboutStoryImageScale: 1,
  aboutStoryImageX: 0,
  aboutStoryImageY: 0,
  idCardBgTextSize: 38,
  idCardPortraitFadeEnabled: true,
  idCardPortraitFadeStart: 50,
  idCardPortraitFadeEnd: 100,
  idCardSvgLight: "",
  idCardSvgDark: "",
  idCardSvgScale: 1,
  idCardSvgX: 0,
  idCardSvgY: 0,
  idCardTextX: 0,
  idCardTextY: 0,
  idCardBadgeX: 0,
  idCardBadgeY: 0,
  customSocials: [] as CustomSocial[],
  webTexts: DEFAULT_WEB_TEXTS,
  headerContacts: ["location", "email", "linkedin"],
  footerSocials: ["linkedin", "instagram", "whatsapp"],
  nickname: "",
  useNicknameOnCard: false,
  cardSocials: ["linkedin", "github"],
  idCardGroup: "354",
  idCardSubText: "UNIVERSITAS KELAS",
  idCardText3: "DATA ANALYST",
  idCardSvgs: [] as IDCardSvgItem[],
  personality: [
    { id: 'pers-1', title: 'Analytical Thinker', description: 'Deep-dive approach into system details and transactional integrity to drive optimization.', icon: 'Cpu' },
    { id: 'pers-2', title: 'Continuous Learner', description: 'Constantly exploring modern architectures, new database technologies, and machine learning models.', icon: 'Flame' },
    { id: 'pers-3', title: 'User-Centric Developer', description: 'Designing visual dashboard interfaces that provide an immediate and satisfying user experience.', icon: 'Smile' }
  ],
  hobbies: [
    { id: 'hobby-1', title: 'Data Visual Art', description: 'Creating interactive data visualizations, generative graphs, and canvas-based layout experiments.', icon: 'PenTool' },
    { id: 'hobby-2', title: 'Technical Writing', description: 'Publishing deep-dives on SQL indexing strategies, database optimizations, and pipeline patterns.', icon: 'Bookmark' },
    { id: 'hobby-3', title: 'Hiking & Exploration', description: 'Unplugging in national parks and trails to recharge creativity and find systemic inspirations.', icon: 'Compass' }
  ],
  careerGoals: [
    { id: 'goal-1', title: 'Lead Data Architect', description: 'Steering high-volume real-time pipeline migrations and implementing enterprise analytics standards.', target_year: '2027', icon: 'Award' },
    { id: 'goal-2', title: 'Open-Source Contributor', description: 'Contributing scalable DB drivers, custom visual components, and open analytical engines.', target_year: '2028', icon: 'GitBranch' },
    { id: 'goal-3', title: 'Keynote Speaker', description: 'Sharing technical discoveries on global analytics conventions regarding data scalability and design.', target_year: '2029', icon: 'Share2' }
  ]
};

export const EMPTY_CV_DATA: CVData = {
  name: "",
  title: "",
  location: "",
  email: "",
  linkedin: "",
  github: "",
  instagram: "",
  whatsapp: "",
  aboutMe: "",
  personality: [],
  hobbies: [],
  careerGoals: [],
  technicalArsenal: {
    dbms: "",
    scientificLanguages: "",
    dataPresentation: "",
    analyticsSpecialties: ""
  },
  education: [],
  experiences: [],
  skills: [],
  skillCategories: [],
  caseStudies: [],
  methodologyTitle: "",
  methodologyText: "",
  avatarUrl: "",
  avatarScale: 1,
  avatarX: 0,
  avatarY: 0,
  homeImageUrl: "",
  homeImageUrlDark: "",
  homeImageScale: 1,
  homeImageX: 0,
  homeImageY: 0,
  aboutStoryImageScale: 1,
  aboutStoryImageX: 0,
  aboutStoryImageY: 0,
  idCardBgTextSize: 38,
  idCardPortraitFadeEnabled: true,
  idCardPortraitFadeStart: 50,
  idCardPortraitFadeEnd: 100,
  idCardSvgLight: "",
  idCardSvgDark: "",
  idCardSvgScale: 1,
  idCardSvgX: 0,
  idCardSvgY: 0,
  idCardTextX: 0,
  idCardTextY: 0,
  idCardBadgeX: 0,
  idCardBadgeY: 0,
  customSocials: [],
  nickname: "",
  useNicknameOnCard: false,
  cardSocials: [],
  idCardGroup: "354",
  idCardSubText: "",
  idCardText3: "DATA ANALYST",
  webTexts: {
    hero_badge: "",
    hero_title: "",
    hero_subtitle: "",
    projects_badge: "",
    projects_title: "",
    projects_subtitle: "",
    skills_badge: "",
    skills_title: "",
    skills_subtitle: "",
    experience_badge: "",
    experience_title: "",
    experience_subtitle: ""
  },
  headerContacts: [],
  footerSocials: [],
  idCardSvgs: [] as IDCardSvgItem[]
};

export interface CustomSocial {
  id: string;
  name: string;
  value: string;
  usernameOrUrl?: string; // New redirection URL or username
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
  webTexts?: Record<string, string>; // New Website Texts configuration dict
  idCardSvgs?: IDCardSvgItem[];
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

const STORAGE_KEY = 'bi-portfolio-cv-data';

export async function fetchCVData(): Promise<CVData> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Returning local storage or default portfolio state.');
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) {}
    return DEFAULT_CV_DATA;
  }

  try {
    // 1. Try to fetch from separate structured tables to fulfill user's core database separation request
    const [profileRes, skillsRes, projectsRes, expRes, eduRes, layoutRes, socialsRes, textsRes, catsRes, aboutStoryRes, personalityRes, hobbiesRes, careerGoalsRes, eduSectionsRes] = await Promise.all([
      supabase.from('portfolio_profile').select('*').eq('id', 'primary').maybeSingle(),
      supabase.from('portfolio_skills').select('*').order('sort_order', { ascending: true }),
      supabase.from('portfolio_projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('portfolio_experiences').select('*').order('sort_order', { ascending: true }),
      supabase.from('portfolio_education').select('*').order('sort_order', { ascending: true }),
      supabase.from('portfolio_layout').select('*').eq('id', 'primary').maybeSingle(),
      supabase.from('portfolio_socials').select('*').order('sort_order', { ascending: true }),
      supabase.from('portfolio_texts').select('*'),
      (async () => {
        try {
          return await supabase.from('portfolio_skill_categories').select('*').order('sort_order', { ascending: true });
        } catch (err) {
          return { data: null, error: err };
        }
      })() as any,
      (async () => {
        try {
          return await supabase.from('portfolio_about_story').select('*').eq('id', 'primary').maybeSingle();
        } catch (err) {
          return { data: null, error: err };
        }
      })() as any,
      (async () => {
        try {
          return await supabase.from('portfolio_personality').select('*').order('sort_order', { ascending: true });
        } catch (err) {
          return { data: null, error: err };
        }
      })() as any,
      (async () => {
        try {
          return await supabase.from('portfolio_hobbies').select('*').order('sort_order', { ascending: true });
        } catch (err) {
          return { data: null, error: err };
        }
      })() as any,
      (async () => {
        try {
          return await supabase.from('portfolio_career_goals').select('*').order('sort_order', { ascending: true });
        } catch (err) {
          return { data: null, error: err };
        }
      })() as any,
      (async () => {
        try {
          return await supabase.from('portfolio_page_section').select('*').order('sort_order', { ascending: true });
        } catch (err) {
          return { data: null, error: err };
        }
      })() as any
    ]);

    // Check if the primary structured tables exist (if not, they return specific DB errors)
    if (!profileRes.error && !skillsRes.error && !projectsRes.error && !expRes.error && !eduRes.error) {
      const dbProfile = profileRes.data || {};
      const dbLayout = layoutRes.data || {};

      // Map socials if available
      let socialsList: CustomSocial[] = [];
      if (socialsRes && !socialsRes.error && socialsRes.data && socialsRes.data.length > 0) {
        socialsList = socialsRes.data.map((s: any) => ({
          id: s.id,
          name: s.platform,
          value: s.label,
          usernameOrUrl: s.username_or_url,
          showOnWeb: s.show_on_web !== false,
          showOnCvHeader: s.show_on_cv_header === true,
          showOnCvFooter: s.show_on_cv_footer !== false
        }));
      }

      // Map texts if available
      const textsDict: Record<string, string> = { ...DEFAULT_WEB_TEXTS };
      if (textsRes && !textsRes.error && textsRes.data) {
        textsRes.data.forEach((r: any) => {
          textsDict[r.key] = r.value;
        });
      }

      // Map about_story custom table if available
      if (aboutStoryRes && !aboutStoryRes.error && aboutStoryRes.data) {
        const d = aboutStoryRes.data;
        if (d.badge) textsDict.about_story_badge = d.badge;
        if (d.title) textsDict.about_story_title = d.title;
        if (d.intro) textsDict.about_story_intro = d.intro;
        if (d.image_url) textsDict.about_story_image_url = d.image_url;
        if (d.left_1_title) textsDict.about_story_left_1_title = d.left_1_title;
        if (d.left_1_desc) textsDict.about_story_left_1_desc = d.left_1_desc;
        if (d.left_2_title) textsDict.about_story_left_2_title = d.left_2_title;
        if (d.left_2_desc) textsDict.about_story_left_2_desc = d.left_2_desc;
        if (d.left_3_title) textsDict.about_story_left_3_title = d.left_3_title;
        if (d.left_3_desc) textsDict.about_story_left_3_desc = d.left_3_desc;
        if (d.right_1_title) textsDict.about_story_right_1_title = d.right_1_title;
        if (d.right_1_desc) textsDict.about_story_right_1_desc = d.right_1_desc;
        if (d.right_2_title) textsDict.about_story_right_2_title = d.right_2_title;
        if (d.right_2_desc) textsDict.about_story_right_2_desc = d.right_2_desc;
        if (d.right_3_title) textsDict.about_story_right_3_title = d.right_3_title;
        if (d.right_3_desc) textsDict.about_story_right_3_desc = d.right_3_desc;
      }

      // Map categories
      let categoriesList: SkillCategory[] = [];
      if (catsRes && !catsRes.error && catsRes.data) {
        categoriesList = catsRes.data.map((c: any) => ({
          id: c.id,
          label: c.label,
          sortOrder: c.sort_order || 0
        }));
      }

      const mappedCVData: CVData = {
        name: dbProfile.name || "",
        title: dbProfile.title || "",
        location: dbProfile.location || "",
        email: dbProfile.email || "",
        linkedin: dbProfile.linkedin || "",
        github: dbProfile.github || "",
        instagram: dbProfile.instagram || "",
        whatsapp: dbProfile.whatsapp || "",
        aboutMe: dbProfile.about_me || "",
        avatarUrl: dbProfile.avatar_url || "",
        methodologyTitle: dbProfile.methodology_title || "",
        methodologyText: dbProfile.methodology_text || "",
        
        technicalArsenal: {
          dbms: "", // Derived dynamically in components or filled from default
          scientificLanguages: "",
          dataPresentation: "",
          analyticsSpecialties: ""
        },
        
        education: (eduRes.data || []).map((e: any) => ({
          id: e.id !== undefined && e.id !== null ? String(e.id) : undefined,
          period: e.period,
          degree: e.degree,
          institution: e.institution,
          description: e.description || ""
        })),
        
        experiences: (expRes.data || []).map((e: any) => ({
          id: e.id,
          period: e.period,
          role: e.role,
          company: e.company,
          bulletPoints: e.bullet_points || [],
          tools: e.tools || []
        })),
        
        skills: (skillsRes.data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          icon: s.icon,
          category: s.category,
          description: s.description,
          showOnWeb: s.show_on_web,
          showOnCV: s.show_on_cv
        })),

        skillCategories: categoriesList,

        caseStudies: (projectsRes.data || []).map((p: any) => {
          const tagsArray = p.tags || [];
          return {
            id: p.id,
            title: p.title,
            category: p.category || "",
            description: p.description,
            tags: tagsArray,
            image: p.image || "",
            impactMetric: p.impact_metric || "",
            tools: tagsArray.length > 0 ? tagsArray : (p.tools || []),
            slides: p.slides || [],
            projectUrl: p.project_url || ""
          };
        }),

        personality: personalityRes && !personalityRes.error && personalityRes.data
          ? personalityRes.data.map((p: any) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              icon: p.icon || "Cpu"
            }))
          : undefined,

        hobbies: hobbiesRes && !hobbiesRes.error && hobbiesRes.data
          ? hobbiesRes.data.map((h: any) => ({
              id: h.id,
              title: h.title,
              description: h.description,
              icon: h.icon || "Heart"
            }))
          : undefined,

        careerGoals: careerGoalsRes && !careerGoalsRes.error && careerGoalsRes.data
          ? careerGoalsRes.data.map((cg: any) => ({
              id: cg.id,
              title: cg.title,
              description: cg.description,
              target_year: cg.target_year || "",
              icon: cg.icon || "Award"
            }))
          : undefined,

         educationSections: eduSectionsRes && !eduSectionsRes.error && eduSectionsRes.data
           ? eduSectionsRes.data.map((es: any) => {
               const rawImageSize = es.image_size || "medium";
               let parsedImageSize = "medium";
               let paragraphLayout: any = undefined;
               let imageLayout: any = undefined;
               let imageModel: any = undefined; let imageScale: number | undefined = undefined; let imageX: number | undefined = undefined; let imageY: number | undefined = undefined; let imageOpacity: number | undefined = undefined; let maskWidth: number | undefined = undefined;
               let imageFadeDirection: any = undefined;
               let ovalWidth: number | undefined = undefined;
               let ovalHeight: number | undefined = undefined;
               let ovalPointiness: number | undefined = undefined;

               if (rawImageSize.includes("|")) {
                 const parts = rawImageSize.split("|");
                 parsedImageSize = parts[0];
                 parts.slice(1).forEach((part: string) => {
                   if (part.startsWith("pLayout:")) {
                     paragraphLayout = part.substring(8);
                   } else if (part.startsWith("iLayout:")) {
                     imageLayout = part.substring(8);
                   } else if (part.startsWith("model:")) {
                     imageModel = part.substring(6); } else if (part.startsWith("imgScale:")) { const val = parseFloat(part.substring(9)); if (!isNaN(val)) imageScale = val; } else if (part.startsWith("imgX:")) { const val = parseInt(part.substring(5), 10); if (!isNaN(val)) imageX = val; } else if (part.startsWith("imgY:")) { const val = parseInt(part.substring(5), 10); if (!isNaN(val)) imageY = val; } else if (part.startsWith("imgOpacity:")) { const val = parseFloat(part.substring(11)); if (!isNaN(val)) imageOpacity = val; } else if (part.startsWith("maskWidth:")) { const val = parseInt(part.substring(10), 10); if (!isNaN(val)) maskWidth = val; } else if (part.startsWith("fadeDir:")) { imageFadeDirection = part.substring(8); } else if (part.startsWith("ovalW:")) { const val = parseInt(part.substring(6), 10); if (!isNaN(val)) ovalWidth = val; } else if (part.startsWith("ovalH:")) { const val = parseInt(part.substring(6), 10); if (!isNaN(val)) ovalHeight = val; } else if (part.startsWith("ovalP:")) { const val = parseInt(part.substring(6), 10); if (!isNaN(val)) ovalPointiness = val;
                   }
                 });
               } else {
                 parsedImageSize = rawImageSize;
               }

               return {
                 id: es.id,
                 title: es.title,
                 content: es.content,
                 imageUrl: es.image_url || "",
                 layoutType: es.layout_type || "image_left",
                 bgColor: es.bg_color || "slate",
                 linkedEducationDegree: es.linked_education_degree || "",
                 sortOrder: es.sort_order || 0,
                 imageOrientation: es.image_orientation || "landscape",
                 imageSize: parsedImageSize,
                 textAlign: es.text_align || "left", imageScale, imageX, imageY, imageOpacity, maskWidth, imageFadeDirection, ovalWidth, ovalHeight, ovalPointiness,
                 paragraphLayout,
                 imageLayout,
                 imageModel
               };
             })
           : undefined,

        customSocials: socialsList,
        webTexts: textsDict,

        layoutSettings: dbLayout.theme_color ? {
          themeColor: dbLayout.theme_color,
          fontSize: dbLayout.font_size,
          spacing: dbLayout.spacing,
          layoutStyle: dbLayout.layout_style,
          fontFamily: dbLayout.font_family,
          sectionOrder: dbLayout.section_order || [],
          showEducation: dbLayout.show_education !== false,
          visibleExperiences: dbLayout.visible_experiences || undefined,
          visibleEducations: dbLayout.visible_educations || undefined,
          marginTopBottom: dbLayout.margin_top_bottom || 'sedang',
          marginLeftRight: dbLayout.margin_left_right || 'sedang',
          headerPhotoPosition: dbLayout.header_photo_position || 'left',
          headerAlignment: dbLayout.header_alignment || 'left',
          headerContactPosition: dbLayout.header_contact_position || 'bottom'
        } : undefined
      };

      // Populate layout settings and image configurations directly from the dbProfile fields
      mappedCVData.avatarScale = dbProfile.avatar_scale !== undefined && dbProfile.avatar_scale !== null ? dbProfile.avatar_scale : 1;
      mappedCVData.avatarX = dbProfile.avatar_x !== undefined && dbProfile.avatar_x !== null ? dbProfile.avatar_x : 0;
      mappedCVData.avatarY = dbProfile.avatar_y !== undefined && dbProfile.avatar_y !== null ? dbProfile.avatar_y : 0;
      mappedCVData.homeImageUrl = dbProfile.home_image_url || undefined;
      mappedCVData.homeImageUrlDark = dbProfile.home_image_url_dark || undefined;

      if (!mappedCVData.homeImageUrl && textsDict['home_image_url']) {
        mappedCVData.homeImageUrl = textsDict['home_image_url'];
      }
      if (!mappedCVData.homeImageUrlDark && textsDict['home_image_url_dark']) {
        mappedCVData.homeImageUrlDark = textsDict['home_image_url_dark'];
      }

      mappedCVData.homeImageScale = dbProfile.home_image_scale !== undefined && dbProfile.home_image_scale !== null ? dbProfile.home_image_scale : 1;
      mappedCVData.homeImageX = dbProfile.home_image_x !== undefined && dbProfile.home_image_x !== null ? dbProfile.home_image_x : 0;
      mappedCVData.homeImageY = dbProfile.home_image_y !== undefined && dbProfile.home_image_y !== null ? dbProfile.home_image_y : 0;
      mappedCVData.headerContacts = dbProfile.header_contacts !== undefined && dbProfile.header_contacts !== null ? dbProfile.header_contacts : undefined;
      mappedCVData.footerSocials = dbProfile.footer_socials !== undefined && dbProfile.footer_socials !== null ? dbProfile.footer_socials : undefined;

      mappedCVData.nickname = dbProfile.nickname !== undefined && dbProfile.nickname !== null ? dbProfile.nickname : DEFAULT_CV_DATA.nickname;
      mappedCVData.useNicknameOnCard = dbProfile.use_nickname_on_card !== undefined && dbProfile.use_nickname_on_card !== null ? dbProfile.use_nickname_on_card : DEFAULT_CV_DATA.useNicknameOnCard;
      mappedCVData.cardSocials = dbProfile.card_socials !== undefined && dbProfile.card_socials !== null ? dbProfile.card_socials : DEFAULT_CV_DATA.cardSocials;
      mappedCVData.idCardGroup = dbProfile.id_card_group !== undefined && dbProfile.id_card_group !== null ? dbProfile.id_card_group : DEFAULT_CV_DATA.idCardGroup;
      mappedCVData.idCardSubText = dbProfile.id_card_sub_text !== undefined && dbProfile.id_card_sub_text !== null ? dbProfile.id_card_sub_text : DEFAULT_CV_DATA.idCardSubText;

      // Map about_story custom settings (image scale/offset, id_card_text_1, id_card_text_2 as group/subtext)
      if (aboutStoryRes && !aboutStoryRes.error && aboutStoryRes.data) {
        const d = aboutStoryRes.data;
        let scale = 1;
        let x = 0;
        let y = 0;
        let textSize = 38;
        let svgLight = "";
        let svgDark = "";
        let svgScale = 1;
        let svgX = 0;
        let svgY = 0;
        if (d.image_config) {
          try {
            const cfg = typeof d.image_config === 'string' ? JSON.parse(d.image_config) : d.image_config;
            if (cfg) {
              scale = cfg.scale !== undefined ? cfg.scale : 1;
              x = cfg.x !== undefined ? cfg.x : 0;
              y = cfg.y !== undefined ? cfg.y : 0;
              textSize = cfg.textSize !== undefined ? cfg.textSize : 38;
              svgLight = cfg.svgLight !== undefined ? cfg.svgLight : "";
              svgDark = cfg.svgDark !== undefined ? cfg.svgDark : "";
              svgScale = cfg.svgScale !== undefined ? cfg.svgScale : 1;
              svgX = cfg.svgX !== undefined ? cfg.svgX : 0;
              svgY = cfg.svgY !== undefined ? cfg.svgY : 0;
              mappedCVData.idCardTextX = cfg.textX !== undefined ? cfg.textX : 0;
              mappedCVData.idCardTextY = cfg.textY !== undefined ? cfg.textY : 0;
              mappedCVData.idCardBadgeX = cfg.badgeX !== undefined ? cfg.badgeX : 0;
              mappedCVData.idCardBadgeY = cfg.badgeY !== undefined ? cfg.badgeY : 0;
              mappedCVData.idCardSvgs = cfg.idCardSvgs !== undefined ? cfg.idCardSvgs : [];
              mappedCVData.idCardPortraitFadeEnabled = cfg.portraitFadeEnabled !== undefined ? cfg.portraitFadeEnabled : true;
              mappedCVData.idCardPortraitFadeStart = cfg.portraitFadeStart !== undefined ? cfg.portraitFadeStart : 50;
              mappedCVData.idCardPortraitFadeEnd = cfg.portraitFadeEnd !== undefined ? cfg.portraitFadeEnd : 100;
            }
          } catch (e) {
            console.warn("Failed parsing image_config:", e);
          }
        }
        mappedCVData.aboutStoryImageScale = scale;
        if (mappedCVData.idCardPortraitFadeEnabled === undefined) mappedCVData.idCardPortraitFadeEnabled = true;
        if (mappedCVData.idCardPortraitFadeStart === undefined) mappedCVData.idCardPortraitFadeStart = 50;
        if (mappedCVData.idCardPortraitFadeEnd === undefined) mappedCVData.idCardPortraitFadeEnd = 100;
        mappedCVData.aboutStoryImageX = x;
        mappedCVData.aboutStoryImageY = y;
        mappedCVData.idCardBgTextSize = textSize;
        mappedCVData.idCardSvgLight = svgLight;
        mappedCVData.idCardSvgDark = svgDark;
        mappedCVData.idCardSvgScale = svgScale;
        mappedCVData.idCardSvgX = svgX;
        mappedCVData.idCardSvgY = svgY;

        if (d.id_card_text_1 !== undefined && d.id_card_text_1 !== null) {
          mappedCVData.idCardGroup = d.id_card_text_1;
        }
        if (d.id_card_text_2 !== undefined && d.id_card_text_2 !== null) {
          mappedCVData.idCardSubText = d.id_card_text_2;
        }
        if (d.id_card_text_3 !== undefined && d.id_card_text_3 !== null) {
          mappedCVData.idCardText3 = d.id_card_text_3;
        }
      }

      mappedCVData.webTexts = textsDict;

      // Check if they are still undefined/null, if so, load from localStorage if possible
      if (!mappedCVData.customSocials || !mappedCVData.headerContacts || !mappedCVData.footerSocials) {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const cachedData = JSON.parse(cached);
            mappedCVData.customSocials = mappedCVData.customSocials || cachedData.customSocials || [];
            mappedCVData.headerContacts = mappedCVData.headerContacts || cachedData.headerContacts || ["location", "email", "linkedin"];
            mappedCVData.footerSocials = mappedCVData.footerSocials || cachedData.footerSocials || ["linkedin", "instagram", "whatsapp"];
          }
        } catch (_) {}
      }

      // Final fallback to DEFAULT_CV_DATA if still missing
      mappedCVData.customSocials = mappedCVData.customSocials || [];
      mappedCVData.headerContacts = mappedCVData.headerContacts || ["location", "email", "linkedin"];
      mappedCVData.footerSocials = mappedCVData.footerSocials || ["linkedin", "instagram", "whatsapp"];
      mappedCVData.nickname = mappedCVData.nickname || DEFAULT_CV_DATA.nickname;
      mappedCVData.useNicknameOnCard = mappedCVData.useNicknameOnCard !== undefined ? mappedCVData.useNicknameOnCard : DEFAULT_CV_DATA.useNicknameOnCard;
      mappedCVData.cardSocials = mappedCVData.cardSocials || DEFAULT_CV_DATA.cardSocials;
      mappedCVData.idCardGroup = mappedCVData.idCardGroup || DEFAULT_CV_DATA.idCardGroup;
      mappedCVData.idCardSubText = mappedCVData.idCardSubText || DEFAULT_CV_DATA.idCardSubText;
      mappedCVData.homeImageUrl = mappedCVData.homeImageUrl || DEFAULT_CV_DATA.homeImageUrl;
      mappedCVData.homeImageUrlDark = mappedCVData.homeImageUrlDark || DEFAULT_CV_DATA.homeImageUrlDark || "";
      mappedCVData.homeImageScale = mappedCVData.homeImageScale !== undefined ? mappedCVData.homeImageScale : 1;
      mappedCVData.homeImageX = mappedCVData.homeImageX !== undefined ? mappedCVData.homeImageX : 0;
      mappedCVData.homeImageY = mappedCVData.homeImageY !== undefined ? mappedCVData.homeImageY : 0;

      // Set empty arrays or fallback to cache / default values to preserve user content
      if (!mappedCVData.skills) mappedCVData.skills = [];
      if (!mappedCVData.caseStudies) mappedCVData.caseStudies = [];
      if (!mappedCVData.experiences) mappedCVData.experiences = [];
      if (!mappedCVData.education) mappedCVData.education = [];

      // Safe fallback retrieval for educationSections
      if (mappedCVData.educationSections === undefined) {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const cachedData = JSON.parse(cached);
            if (cachedData.educationSections !== undefined) {
              mappedCVData.educationSections = cachedData.educationSections;
            }
          }
        } catch (_) {}
        if (mappedCVData.educationSections === undefined) {
          mappedCVData.educationSections = DEFAULT_CV_DATA.educationSections || [];
        }
      }

      // Safe fallback retrieval for personality
      if (mappedCVData.personality === undefined) {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const cachedData = JSON.parse(cached);
            if (cachedData.personality !== undefined) {
              mappedCVData.personality = cachedData.personality;
            }
          }
        } catch (_) {}
        if (mappedCVData.personality === undefined) {
          mappedCVData.personality = DEFAULT_CV_DATA.personality || [];
        }
      }

      // Safe fallback retrieval for hobbies
      if (mappedCVData.hobbies === undefined) {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const cachedData = JSON.parse(cached);
            if (cachedData.hobbies !== undefined) {
              mappedCVData.hobbies = cachedData.hobbies;
            }
          }
        } catch (_) {}
        if (mappedCVData.hobbies === undefined) {
          mappedCVData.hobbies = DEFAULT_CV_DATA.hobbies || [];
        }
      }

      // Safe fallback retrieval for careerGoals
      if (mappedCVData.careerGoals === undefined) {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const cachedData = JSON.parse(cached);
            if (cachedData.careerGoals !== undefined) {
              mappedCVData.careerGoals = cachedData.careerGoals;
            }
          }
        } catch (_) {}
        if (mappedCVData.careerGoals === undefined) {
          mappedCVData.careerGoals = DEFAULT_CV_DATA.careerGoals || [];
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedCVData));
      return mappedCVData;
    }

    // FALLBACK: Cache or native default config
    console.warn('Falling back to local storage cache or default dataset');
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : DEFAULT_CV_DATA;

  } catch (err) {
    console.error('Failed to fully load separate database tables:', err);
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : DEFAULT_CV_DATA;
  }
}

export async function saveCVData(newData: CVData): Promise<{ success: boolean; error?: string }> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

  if (!isSupabaseConfigured || !supabase) {
    return { 
      success: true, 
      error: 'Saved locally in browser storage! To persist permanently, configure your Supabase credentials.' 
    };
  }

  try {
    // 1. Profile splits upsert (with secure fallback for optional columns)
    const profilePromise = (async () => {
      try {
        const { error: firstError } = await supabase.from('portfolio_profile').upsert({
          id: 'primary',
          name: newData.name,
          title: newData.title,
          location: newData.location,
          email: newData.email,
          about_me: newData.aboutMe || "",
          avatar_url: newData.avatarUrl || "",
          methodology_title: newData.methodologyTitle || "",
          methodology_text: newData.methodologyText || "",
          home_image_url: newData.homeImageUrl || "",
          home_image_url_dark: newData.homeImageUrlDark || "",
          avatar_scale: newData.avatarScale !== undefined ? newData.avatarScale : 1,
          avatar_x: newData.avatarX !== undefined ? newData.avatarX : 0,
          avatar_y: newData.avatarY !== undefined ? newData.avatarY : 0,
          home_image_scale: newData.homeImageScale !== undefined ? newData.homeImageScale : 1,
          home_image_x: newData.homeImageX !== undefined ? newData.homeImageX : 0,
          home_image_y: newData.homeImageY !== undefined ? newData.homeImageY : 0,
          header_contacts: newData.headerContacts || ["location", "email", "linkedin"],
          footer_socials: newData.footerSocials || ["linkedin", "instagram", "whatsapp"],
          nickname: newData.nickname || "",
          use_nickname_on_card: newData.useNicknameOnCard !== undefined ? newData.useNicknameOnCard : false,
          card_socials: newData.cardSocials || [],
          id_card_group: newData.idCardGroup || "354",
          id_card_sub_text: newData.idCardSubText || "",
          updated_at: new Date().toISOString()
        });

        if (firstError) {
          console.warn('Profile upsert with modern fields failed, trying fallback upsert...', firstError.message);
          const { error: fallbackError } = await supabase.from('portfolio_profile').upsert({
            id: 'primary',
            name: newData.name,
            title: newData.title,
            location: newData.location,
            email: newData.email,
            about_me: newData.aboutMe || "",
            avatar_url: newData.avatarUrl || "",
            methodology_title: newData.methodologyTitle || "",
            methodology_text: newData.methodologyText || "",
            updated_at: new Date().toISOString()
          });
          if (fallbackError) throw fallbackError;
        }
      } catch (err: any) {
        console.error('Profile upsert failed completely:', err);
        throw err;
      }
    })();

    // 2. Clear & Insert Skills
    const cleanSkills = async () => {
      const { error: delErr } = await supabase.from('portfolio_skills').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_skills gagal: ${delErr.message}`);
      if (newData.skills && newData.skills.length > 0) {
        const skillsToInsert = newData.skills.map((s, idx) => ({
          id: s.id,
          name: s.name,
          icon: s.icon,
          category: s.category,
          description: s.description,
          show_on_web: s.showOnWeb !== false,
          show_on_cv: s.showOnCV !== false,
          sort_order: idx
        }));
        const { error: insErr } = await supabase.from('portfolio_skills').insert(skillsToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_skills gagal: ${insErr.message}`);
      }
    };

    // 2b. Clear & Insert Skill Categories
    const cleanCategories = async () => {
      const { error: delErr } = await supabase.from('portfolio_skill_categories').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_skill_categories gagal: ${delErr.message}`);
      if (newData.skillCategories && newData.skillCategories.length > 0) {
        const catsToInsert = newData.skillCategories.map((c, idx) => ({
          id: c.id,
          label: c.label,
          sort_order: c.sortOrder ?? idx
        }));
        const { error: insErr } = await supabase.from('portfolio_skill_categories').insert(catsToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_skill_categories gagal: ${insErr.message}`);
      }
    };

    // 3. Clear & Insert Projects
    const cleanProjects = async () => {
      const { error: delErr } = await supabase.from('portfolio_projects').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_projects gagal: ${delErr.message}`);
      if (newData.caseStudies && newData.caseStudies.length > 0) {
        const projToInsert = newData.caseStudies.map((p, idx) => {
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            project_url: p.projectUrl || "",
            tags: p.tags || [],
            image: p.image || "",
            sort_order: idx
          };
        });
        const { error: insErr } = await supabase.from('portfolio_projects').insert(projToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_projects gagal: ${insErr.message}`);
      }
    };

    // 4. Experiences
    const cleanExperiences = async () => {
      const { error: delErr } = await supabase.from('portfolio_experiences').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_experiences gagal: ${delErr.message}`);
      if (newData.experiences && newData.experiences.length > 0) {
        const expToInsert = newData.experiences.map((exp, idx) => ({
          id: exp.id,
          period: exp.period,
          role: exp.role,
          company: exp.company,
          bullet_points: exp.bulletPoints || [],
          tools: exp.tools || [],
          sort_order: idx
        }));
        const { error: insErr } = await supabase.from('portfolio_experiences').insert(expToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_experiences gagal: ${insErr.message}`);
      }
    };

    // 5. Education
    const cleanEducation = async () => {
      // Use period filter to safely delete all rows regardless of id column type (integer vs VARCHAR)
      const { error: delErr } = await supabase.from('portfolio_education').delete().neq('period', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_education gagal: ${delErr.message}`);
      if (newData.education && newData.education.length > 0) {
        const eduToInsert = newData.education.map((edu, idx) => {
          const item: any = {
            period: edu.period,
            degree: edu.degree,
            institution: edu.institution,
            description: edu.description || "",
            sort_order: idx
          };
          if (edu.id) {
            const isNumeric = /^\d+$/.test(edu.id);
            item.id = isNumeric ? parseInt(edu.id, 10) : edu.id;
          }
          return item;
        });
        const { error } = await supabase.from('portfolio_education').insert(eduToInsert);
        // Fallback & friendly bilingual ID error detection
        if (error) {
          if (error.message?.includes('integer') || error.code === '22P02') {
            throw new Error(`Gagal menyimpan data pendidikan. Kolom ID tabel 'portfolio_education' di Supabase Anda masih bertipe INTEGER dan perlu diubah menjadi VARCHAR untuk mendukung bilingual.\n\nSolusi: Silakan buka tab 'Setup Database' di halaman Admin, salin kode SQL kustom terbaru, lalu jalankan di SQL Editor dashboard Supabase Anda untuk memperbarui tipe kolom id.`);
          } else if (error.message?.includes('null value') || error.message?.includes('violates')) {
            console.warn('Omit id failed for portfolio_education, retrying with manual integer/string ids...', error.message);
            const eduToInsertWithIds = newData.education.map((edu, idx) => {
              const item: any = {
                period: edu.period,
                degree: edu.degree,
                institution: edu.institution,
                description: edu.description || "",
                sort_order: idx
              };
              if (edu.id) {
                const isNumeric = /^\d+$/.test(edu.id);
                item.id = isNumeric ? parseInt(edu.id, 10) : edu.id;
              } else {
                item.id = String(idx + 1);
              }
              return item;
            });
            const { error: retryErr } = await supabase.from('portfolio_education').insert(eduToInsertWithIds);
            if (retryErr) {
              if (retryErr.message?.includes('integer') || retryErr.code === '22P02') {
                throw new Error(`Gagal menyimpan data pendidikan. Kolom ID tabel 'portfolio_education' di Supabase Anda masih bertipe INTEGER dan perlu diubah menjadi VARCHAR untuk mendukung bilingual.\n\nSolusi: Silakan buka tab 'Setup Database' di halaman Admin, salin kode SQL kustom terbaru, lalu jalankan di SQL Editor dashboard Supabase Anda untuk memperbarui tipe kolom id.`);
              }
              throw new Error(`Simpan data portfolio_education gagal: ${retryErr.message}`);
            }
          } else {
            throw new Error(`Simpan data portfolio_education gagal: ${error.message}`);
          }
        }
      }
    };

    // 5b. Personality & Values
    const cleanPersonality = async () => {
      const { error: delErr } = await supabase.from('portfolio_personality').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_personality gagal: ${delErr.message}`);
      if (newData.personality && newData.personality.length > 0) {
        const personalityToInsert = newData.personality.map((p, idx) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          icon: p.icon || 'Cpu',
          sort_order: idx
        }));
        const { error: insErr } = await supabase.from('portfolio_personality').insert(personalityToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_personality gagal: ${insErr.message}`);
      }
    };

    // 5c. Hobbies & Interests
    const cleanHobbies = async () => {
      const { error: delErr } = await supabase.from('portfolio_hobbies').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_hobbies gagal: ${delErr.message}`);
      if (newData.hobbies && newData.hobbies.length > 0) {
        const hobbiesToInsert = newData.hobbies.map((h, idx) => ({
          id: h.id,
          title: h.title,
          description: h.description,
          icon: h.icon || 'Heart',
          sort_order: idx
        }));
        const { error: insErr } = await supabase.from('portfolio_hobbies').insert(hobbiesToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_hobbies gagal: ${insErr.message}`);
      }
    };

    // 5d. Career Goals
    const cleanCareerGoals = async () => {
      const { error: delErr } = await supabase.from('portfolio_career_goals').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_career_goals gagal: ${delErr.message}`);
      if (newData.careerGoals && newData.careerGoals.length > 0) {
        const goalsToInsert = newData.careerGoals.map((cg, idx) => ({
          id: cg.id,
          title: cg.title,
          description: cg.description,
          target_year: cg.target_year || '',
          icon: cg.icon || 'Award',
          sort_order: idx
        }));
        const { error: insErr } = await supabase.from('portfolio_career_goals').insert(goalsToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_career_goals gagal: ${insErr.message}`);
      }
    };

    // 5e. Education Sections (Subpage Slides)
    const cleanEducationSections = async () => {
      const { error: delErr } = await supabase.from('portfolio_page_section').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_page_section gagal: ${delErr.message}`);
      if (newData.educationSections && newData.educationSections.length > 0) {
        const sectionsToInsert = newData.educationSections.map((es, idx) => {
          const serializedImageSize = [
            es.imageSize || "medium",
            es.paragraphLayout ? `pLayout:${es.paragraphLayout}` : "",
            es.imageLayout ? `iLayout:${es.imageLayout}` : "",
            es.imageModel ? `model:${es.imageModel}` : "", es.imageScale !== undefined ? `imgScale:${es.imageScale}` : "", es.imageX !== undefined ? `imgX:${es.imageX}` : "", es.imageY !== undefined ? `imgY:${es.imageY}` : "", es.imageOpacity !== undefined ? `imgOpacity:${es.imageOpacity}` : "", es.maskWidth !== undefined ? `maskWidth:${es.maskWidth}` : "", es.imageFadeDirection ? `fadeDir:${es.imageFadeDirection}` : "", es.ovalWidth !== undefined ? `ovalW:${es.ovalWidth}` : "", es.ovalHeight !== undefined ? `ovalH:${es.ovalHeight}` : "", es.ovalPointiness !== undefined ? `ovalP:${es.ovalPointiness}` : ""
          ].filter(Boolean).join("|");

          return {
            id: es.id,
            title: es.title,
            content: es.content,
            image_url: es.imageUrl || "",
            layout_type: es.layoutType || "image_left",
            bg_color: es.bgColor || "slate",
            linked_education_degree: es.linkedEducationDegree || "",
            sort_order: es.sortOrder !== undefined ? es.sortOrder : idx,
            image_orientation: es.imageOrientation || "landscape",
            image_size: serializedImageSize,
            text_align: es.textAlign || "left"
          };
        });
        const { error: insErr } = await supabase.from('portfolio_page_section').insert(sectionsToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_page_section gagal: ${insErr.message}`);
      }
    };

    // 6. Clear & Insert customSocials
    const cleanSocials = async () => {
      const { error: delErr } = await supabase.from('portfolio_socials').delete().neq('id', 'dummy_exclusion');
      if (delErr) throw new Error(`Hapus data portfolio_socials gagal: ${delErr.message}`);
      if (newData.customSocials && newData.customSocials.length > 0) {
        const socialsToInsert = newData.customSocials.map((s, idx) => ({
          id: s.id,
          platform: s.name,
          label: s.value,
          username_or_url: s.usernameOrUrl || s.value || '',
          show_on_web: s.showOnWeb !== false,
          show_on_cv_header: s.showOnCvHeader === true,
          show_on_cv_footer: s.showOnCvFooter !== false,
          sort_order: idx
        }));
        const { error: insErr } = await supabase.from('portfolio_socials').insert(socialsToInsert);
        if (insErr) throw new Error(`Simpan data portfolio_socials gagal: ${insErr.message}`);
      }
    };

    // 7. Clear & Upsert webTexts
    const cleanTexts = async () => {
      if (newData.webTexts) {
        const textsMap: Record<string, string> = {};
        
        // Load initial keys
        Object.entries(newData.webTexts).forEach(([k, v]) => {
          if (k) {
            textsMap[k] = v || '';
          }
        });
        
        // Override or add home image urls
        if (newData.homeImageUrl) {
          textsMap['home_image_url'] = newData.homeImageUrl;
        }
        if (newData.homeImageUrlDark) {
          textsMap['home_image_url_dark'] = newData.homeImageUrlDark;
        }

        const textsToUpsert = Object.entries(textsMap).map(([k, v]) => ({
          key: k,
          value: v
        }));

        if (textsToUpsert.length > 0) {
          const { error: upsertErr } = await supabase.from('portfolio_texts').upsert(textsToUpsert);
          if (upsertErr) throw new Error(`Simpan data portfolio_texts gagal: ${upsertErr.message}`);
        }
      }
    };

    // 8. Layout Setting
    const layoutPromise = (async () => {
      try {
        if (newData.layoutSettings) {
          const { error } = await supabase.from('portfolio_layout').upsert({
            id: 'primary',
            theme_color: newData.layoutSettings.themeColor,
            font_size: newData.layoutSettings.fontSize,
            spacing: newData.layoutSettings.spacing,
            layout_style: newData.layoutSettings.layoutStyle,
            font_family: newData.layoutSettings.fontFamily,
            section_order: newData.layoutSettings.sectionOrder || [],
            show_education: newData.layoutSettings.showEducation !== false,
            visible_experiences: newData.layoutSettings.visibleExperiences || null,
            visible_educations: newData.layoutSettings.visibleEducations || null,
            margin_top_bottom: newData.layoutSettings.marginTopBottom || 'sedang',
            margin_left_right: newData.layoutSettings.marginLeftRight || 'sedang',
            header_photo_position: newData.layoutSettings.headerPhotoPosition || 'left',
            header_alignment: newData.layoutSettings.headerAlignment || 'left',
            header_contact_position: newData.layoutSettings.headerContactPosition || 'bottom',
            updated_at: new Date().toISOString()
          });
          if (error) {
            console.warn('Silent fallback: portfolio_layout upsert failed (schema not run yet?):', error.message);
          }
        }
      } catch (err: any) {
        console.warn('Silent fallback: portfolio_layout table save caught:', err.message);
      }
    })();

    // 9. About Story Settings Table Upsert
    const aboutStoryPromise = (async () => {
      try {
        if (newData.webTexts) {
          const w = newData.webTexts;
          const { error } = await supabase.from('portfolio_about_story').upsert({
            id: 'primary',
            badge: w.about_story_badge || "",
            title: w.about_story_title || "",
            intro: w.about_story_intro || "",
            image_url: w.about_story_image_url || "",
            left_1_title: w.about_story_left_1_title || "",
            left_1_desc: w.about_story_left_1_desc || "",
            left_2_title: w.about_story_left_2_title || "",
            left_2_desc: w.about_story_left_2_desc || "",
            left_3_title: w.about_story_left_3_title || "",
            left_3_desc: w.about_story_left_3_desc || "",
            right_1_title: w.about_story_right_1_title || "",
            right_1_desc: w.about_story_right_1_desc || "",
            right_2_title: w.about_story_right_2_title || "",
            right_2_desc: w.about_story_right_2_desc || "",
            right_3_title: w.about_story_right_3_title || "",
            right_3_desc: w.about_story_right_3_desc || "",
            image_config: JSON.stringify({
              scale: newData.aboutStoryImageScale !== undefined ? newData.aboutStoryImageScale : 1,
              x: newData.aboutStoryImageX !== undefined ? newData.aboutStoryImageX : 0,
              y: newData.aboutStoryImageY !== undefined ? newData.aboutStoryImageY : 0,
              textSize: newData.idCardBgTextSize !== undefined ? newData.idCardBgTextSize : 38,
              svgLight: newData.idCardSvgLight !== undefined ? newData.idCardSvgLight : "",
              svgDark: newData.idCardSvgDark !== undefined ? newData.idCardSvgDark : "",
              svgScale: newData.idCardSvgScale !== undefined ? newData.idCardSvgScale : 1,
              svgX: newData.idCardSvgX !== undefined ? newData.idCardSvgX : 0,
              svgY: newData.idCardSvgY !== undefined ? newData.idCardSvgY : 0,
              textX: newData.idCardTextX !== undefined ? newData.idCardTextX : 0,
              textY: newData.idCardTextY !== undefined ? newData.idCardTextY : 0,
              badgeX: newData.idCardBadgeX !== undefined ? newData.idCardBadgeX : 0,
              badgeY: newData.idCardBadgeY !== undefined ? newData.idCardBadgeY : 0,
              idCardSvgs: newData.idCardSvgs || [],
              portraitFadeEnabled: newData.idCardPortraitFadeEnabled !== undefined ? newData.idCardPortraitFadeEnabled : true,
              portraitFadeStart: newData.idCardPortraitFadeStart !== undefined ? newData.idCardPortraitFadeStart : 50,
              portraitFadeEnd: newData.idCardPortraitFadeEnd !== undefined ? newData.idCardPortraitFadeEnd : 100
            }),
            id_card_text_1: newData.idCardGroup || "354",
            id_card_text_2: newData.idCardSubText || "",
            id_card_text_3: newData.idCardText3 || "DATA ANALYST",
            updated_at: new Date().toISOString()
          });
          if (error) {
            console.warn('Silent fallback: portfolio_about_story upsert failed (schema not run yet?):', error.message);
          }
        }
      } catch (err: any) {
        console.warn('Silent fallback: portfolio_about_story table save caught:', err.message);
      }
    })();

    // Fire profile + layout + about_story upserts
    await Promise.all([profilePromise, layoutPromise, aboutStoryPromise]);

    // Handle split tables cleanly (gather any save failures and throw to inform user of exact issues)
    const results = await Promise.all([
      cleanSkills().then(() => null).catch(e => e),
      cleanCategories().then(() => null).catch(e => e),
      cleanProjects().then(() => null).catch(e => e),
      cleanExperiences().then(() => null).catch(e => e),
      cleanEducation().then(() => null).catch(e => e),
      cleanEducationSections().then(() => null).catch(e => e),
      cleanPersonality().then(() => null).catch(e => e),
      cleanHobbies().then(() => null).catch(e => e),
      cleanCareerGoals().then(() => null).catch(e => e),
      cleanSocials().then(() => null).catch(e => e),
      cleanTexts().then(() => null).catch(e => e)
    ]);

    const activeErrors = results.filter((r): r is Error => r !== null);
    if (activeErrors.length > 0) {
      const messages = activeErrors.map(e => e.message || String(e)).join('; ');
      throw new Error(`Gagal menyimpan ke beberapa tabel Supabase: ${messages}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to fully save to separate Supabase tables:', err);
    return { 
      success: false, 
      error: err.message || 'Failed to sync with Supabase tables. Updates saved locally in browser cache.' 
    };
  }
}
