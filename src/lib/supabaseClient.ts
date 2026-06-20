import { createClient } from '@supabase/supabase-js';
import { CaseStudy, SkillItem, SkillCategory } from '../types';

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
  contact_subtitle: "Available for corporate consulting engagements, full-time senior analyst roles, or panel speaking opportunities regarding advanced business intelligence."
};

// Initial default CV data matching the original portfolio CV perfectly with slides integration
export const DEFAULT_CV_DATA = {
  name: "Jonathan Vance",
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
  homeImageScale: 1,
  homeImageX: 0,
  homeImageY: 0,
  customSocials: [] as CustomSocial[],
  webTexts: DEFAULT_WEB_TEXTS,
  headerContacts: ["location", "email", "linkedin"],
  footerSocials: ["linkedin", "instagram", "whatsapp"]
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
  homeImageScale: 1,
  homeImageX: 0,
  homeImageY: 0,
  customSocials: [],
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
  footerSocials: []
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
  technicalArsenal: {
    dbms: string;
    scientificLanguages: string;
    dataPresentation: string;
    analyticsSpecialties: string;
  };
  education: {
    period: string;
    degree: string;
    institution: string;
  }[];
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
  methodologyTitle: string;
  methodologyText: string;
  avatarUrl: string;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  homeImageUrl?: string;
  homeImageScale?: number;
  homeImageX?: number;
  homeImageY?: number;
  customSocials?: CustomSocial[];
  headerContacts?: string[];
  footerSocials?: string[];
  layoutSettings?: {
    themeColor: 'emerald' | 'blue' | 'slate' | 'indigo' | 'rose' | 'amber';
    fontSize: 'compact' | 'standard' | 'comfortable';
    spacing: 'tight' | 'standard' | 'spacious';
    layoutStyle: 'left-sidebar' | 'right-sidebar' | 'single-column';
    fontFamily: 'sans' | 'serif' | 'mono';
    sectionOrder: string[];
  };
}

const STORAGE_KEY = 'vance-portfolio-cv-data';

export async function fetchCVData(): Promise<CVData> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Returning empty portfolio state.');
    return EMPTY_CV_DATA;
  }

  try {
    // 1. Try to fetch from separate structured tables to fulfill user's core database separation request
    const [profileRes, skillsRes, projectsRes, expRes, eduRes, layoutRes, socialsRes, textsRes, catsRes] = await Promise.all([
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
          period: e.period,
          degree: e.degree,
          institution: e.institution
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

        caseStudies: (projectsRes.data || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          tags: p.tags || [],
          image: p.image || "",
          impactMetric: p.impact_metric || "",
          tools: p.tools || [],
          slides: p.slides || []
        })),

        customSocials: socialsList,
        webTexts: textsDict,

        layoutSettings: dbLayout.theme_color ? {
          themeColor: dbLayout.theme_color,
          fontSize: dbLayout.font_size,
          spacing: dbLayout.spacing,
          layoutStyle: dbLayout.layout_style,
          fontFamily: dbLayout.font_family,
          sectionOrder: dbLayout.section_order || []
        } : undefined
      };

      // Populate layout settings and image configurations directly from the dbProfile fields
      mappedCVData.avatarScale = dbProfile.avatar_scale !== undefined && dbProfile.avatar_scale !== null ? dbProfile.avatar_scale : 1;
      mappedCVData.avatarX = dbProfile.avatar_x !== undefined && dbProfile.avatar_x !== null ? dbProfile.avatar_x : 0;
      mappedCVData.avatarY = dbProfile.avatar_y !== undefined && dbProfile.avatar_y !== null ? dbProfile.avatar_y : 0;
      mappedCVData.homeImageUrl = dbProfile.home_image_url || undefined;
      mappedCVData.homeImageScale = dbProfile.home_image_scale !== undefined && dbProfile.home_image_scale !== null ? dbProfile.home_image_scale : 1;
      mappedCVData.homeImageX = dbProfile.home_image_x !== undefined && dbProfile.home_image_x !== null ? dbProfile.home_image_x : 0;
      mappedCVData.homeImageY = dbProfile.home_image_y !== undefined && dbProfile.home_image_y !== null ? dbProfile.home_image_y : 0;
      mappedCVData.headerContacts = dbProfile.header_contacts !== undefined && dbProfile.header_contacts !== null ? dbProfile.header_contacts : undefined;
      mappedCVData.footerSocials = dbProfile.footer_socials !== undefined && dbProfile.footer_socials !== null ? dbProfile.footer_socials : undefined;

      // Overlay optional dynamic settings also stored in portfolio_cv legacy content column for backward compatibility
      try {
        const { data: legacyData } = await supabase
          .from('portfolio_cv')
          .select('content')
          .eq('id', 'primary')
          .maybeSingle();
        if (legacyData?.content) {
          const lObj = legacyData.content;
          mappedCVData.customSocials = mappedCVData.customSocials && mappedCVData.customSocials.length > 0
            ? mappedCVData.customSocials
            : (lObj.customSocials || []);
          mappedCVData.webTexts = { ...DEFAULT_WEB_TEXTS, ...lObj.webTexts, ...textsDict };
          if (mappedCVData.avatarScale === 1 && lObj.avatarScale !== undefined) mappedCVData.avatarScale = lObj.avatarScale;
          if (mappedCVData.avatarX === 0 && lObj.avatarX !== undefined) mappedCVData.avatarX = lObj.avatarX;
          if (mappedCVData.avatarY === 0 && lObj.avatarY !== undefined) mappedCVData.avatarY = lObj.avatarY;
          if (!mappedCVData.homeImageUrl && lObj.homeImageUrl !== undefined) mappedCVData.homeImageUrl = lObj.homeImageUrl;
          if (mappedCVData.homeImageScale === 1 && lObj.homeImageScale !== undefined) mappedCVData.homeImageScale = lObj.homeImageScale;
          if (mappedCVData.homeImageX === 0 && lObj.homeImageX !== undefined) mappedCVData.homeImageX = lObj.homeImageX;
          if (mappedCVData.homeImageY === 0 && lObj.homeImageY !== undefined) mappedCVData.homeImageY = lObj.homeImageY;
          if (!mappedCVData.headerContacts && lObj.headerContacts) mappedCVData.headerContacts = lObj.headerContacts;
          if (!mappedCVData.footerSocials && lObj.footerSocials) mappedCVData.footerSocials = lObj.footerSocials;
        }
      } catch (err) {
        console.warn('Could not overlay custom social data from portfolio_cv table:', err);
      }

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
      mappedCVData.homeImageUrl = mappedCVData.homeImageUrl || DEFAULT_CV_DATA.homeImageUrl;
      mappedCVData.homeImageScale = mappedCVData.homeImageScale !== undefined ? mappedCVData.homeImageScale : 1;
      mappedCVData.homeImageX = mappedCVData.homeImageX !== undefined ? mappedCVData.homeImageX : 0;
      mappedCVData.homeImageY = mappedCVData.homeImageY !== undefined ? mappedCVData.homeImageY : 0;

      // Set empty arrays instead of falling back to default dummy values when connected to Supabase
      if (!mappedCVData.skills) mappedCVData.skills = [];
      if (!mappedCVData.caseStudies) mappedCVData.caseStudies = [];
      if (!mappedCVData.experiences) mappedCVData.experiences = [];
      if (!mappedCVData.education) mappedCVData.education = [];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedCVData));
      return mappedCVData;
    }
    
    // FALLBACK 1: Try reading from legacy table 'portfolio_cv' in JSON format
    const { data: legacyData, error: legacyError } = await supabase
      .from('portfolio_cv')
      .select('content')
      .eq('id', 'primary')
      .maybeSingle();

    if (!legacyError && legacyData?.content) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyData.content));
      return legacyData.content as CVData;
    }

    // FALLBACK 2: Cache or native default config
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
          avatar_scale: newData.avatarScale !== undefined ? newData.avatarScale : 1,
          avatar_x: newData.avatarX !== undefined ? newData.avatarX : 0,
          avatar_y: newData.avatarY !== undefined ? newData.avatarY : 0,
          home_image_scale: newData.homeImageScale !== undefined ? newData.homeImageScale : 1,
          home_image_x: newData.homeImageX !== undefined ? newData.homeImageX : 0,
          home_image_y: newData.homeImageY !== undefined ? newData.homeImageY : 0,
          header_contacts: newData.headerContacts || ["location", "email", "linkedin"],
          footer_socials: newData.footerSocials || ["linkedin", "instagram", "whatsapp"],
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
      await supabase.from('portfolio_skills').delete().neq('id', 'dummy_exclusion');
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
        await supabase.from('portfolio_skills').insert(skillsToInsert);
      }
    };

    // 2b. Clear & Insert Skill Categories
    const cleanCategories = async () => {
      await supabase.from('portfolio_skill_categories').delete().neq('id', 'dummy_exclusion');
      if (newData.skillCategories && newData.skillCategories.length > 0) {
        const catsToInsert = newData.skillCategories.map((c, idx) => ({
          id: c.id,
          label: c.label,
          sort_order: c.sortOrder ?? idx
        }));
        await supabase.from('portfolio_skill_categories').insert(catsToInsert);
      }
    };

    // 3. Clear & Insert Projects
    const cleanProjects = async () => {
      await supabase.from('portfolio_projects').delete().neq('id', 'dummy_exclusion');
      if (newData.caseStudies && newData.caseStudies.length > 0) {
        const projToInsert = newData.caseStudies.map((p, idx) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          tags: p.tags || [],
          image: p.image || "",
          impact_metric: p.impactMetric || "",
          tools: p.tools || [],
          slides: p.slides || [],
          sort_order: idx
        }));
        await supabase.from('portfolio_projects').insert(projToInsert);
      }
    };

    // 4. Experiences
    const cleanExperiences = async () => {
      await supabase.from('portfolio_experiences').delete().neq('id', 'dummy_exclusion');
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
        await supabase.from('portfolio_experiences').insert(expToInsert);
      }
    };

    // 5. Education
    const cleanEducation = async () => {
      // id is int4 (integer) in portfolio_education, so we use -1 as comparison to avoid type cast errors
      await supabase.from('portfolio_education').delete().neq('id', -1);
      if (newData.education && newData.education.length > 0) {
        const eduToInsert = newData.education.map((edu, idx) => ({
          period: edu.period,
          degree: edu.degree,
          institution: edu.institution,
          sort_order: idx
        }));
        const { error } = await supabase.from('portfolio_education').insert(eduToInsert);
        // Fallback: If the user didn't make the id column an auto-increment column (identity/serial),
        // omitting id might cause an error. We handle that by trying to insert with manual integer ids.
        if (error && (error.message?.includes('null value') || error.message?.includes('violates'))) {
          console.warn('Omit id failed for portfolio_education, retrying with manual integer ids...', error.message);
          const eduToInsertWithIds = newData.education.map((edu, idx) => ({
            id: idx + 1,
            period: edu.period,
            degree: edu.degree,
            institution: edu.institution,
            sort_order: idx
          }));
          await supabase.from('portfolio_education').insert(eduToInsertWithIds);
        }
      }
    };

    // 6. Clear & Insert customSocials
    const cleanSocials = async () => {
      // Clean previous records
      await supabase.from('portfolio_socials').delete().neq('id', 'dummy_exclusion');
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
        await supabase.from('portfolio_socials').insert(socialsToInsert);
      }
    };

    // 7. Clear & Upsert webTexts
    const cleanTexts = async () => {
      if (newData.webTexts) {
        const textsToUpsert = Object.entries(newData.webTexts).map(([k, v]) => ({
          key: k,
          value: v
        }));
        if (textsToUpsert.length > 0) {
          await supabase.from('portfolio_texts').upsert(textsToUpsert);
        }
      }
    };

    // 8. Layout Setting
    const layoutPromise = newData.layoutSettings ? supabase.from('portfolio_layout').upsert({
      id: 'primary',
      theme_color: newData.layoutSettings.themeColor,
      font_size: newData.layoutSettings.fontSize,
      spacing: newData.layoutSettings.spacing,
      layout_style: newData.layoutSettings.layoutStyle,
      font_family: newData.layoutSettings.fontFamily,
      section_order: newData.layoutSettings.sectionOrder || [],
      updated_at: new Date().toISOString()
    }) : Promise.resolve();

    // Fire profile + layout upserts
    await Promise.all([profilePromise, layoutPromise]);

    // Handle split tables cleanly (catch locally if any particular sub-table save fails)
    await Promise.all([
      cleanSkills().catch(e => console.warn('portfolio_skills save failed structure logic:', e.message)),
      cleanCategories().catch(e => console.warn('portfolio_skill_categories save failed structure logic:', e.message)),
      cleanProjects().catch(e => console.warn('portfolio_projects save failed structure logic:', e.message)),
      cleanExperiences().catch(e => console.warn('portfolio_experiences save failed structure logic:', e.message)),
      cleanEducation().catch(e => console.warn('portfolio_education save failed structure logic:', e.message)),
      cleanSocials().catch(e => console.warn('portfolio_socials save failed structure logic:', e.message)),
      cleanTexts().catch(e => console.warn('portfolio_texts save failed structure logic:', e.message))
    ]);

    return { success: true };
  } catch (err: any) {
    console.error('Failed to fully save to separate Supabase tables:', err);
    return { 
      success: false, 
      error: err.message || 'Failed to sync with Supabase tables. Updates saved locally in browser cache.' 
    };
  }
}
