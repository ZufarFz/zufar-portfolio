import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Linkedin, 
  Github, 
  TrendingUp, 
  FileText, 
  Database,
  Terminal,
  Activity,
  Layers,
  ChevronDown,
  ChevronsDown,
  ChevronUp,
  Briefcase,
  Play,
  Award,
  BookOpen,
  PieChart,
  Sun,
  Moon,
  Instagram,
  MessageCircle,
  Home,
  Globe,
  LayoutGrid,
  ExternalLink,
  Menu,
  X,
  Eye,
  Download,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CASE_STUDIES } from './data/portfolioData';
import SkillsArsenal from './components/SkillsArsenal';
import ContactForm from './components/ContactForm';
import ResumeModal from './components/ResumeModal';
import AdminLoginPage from './components/AdminLoginPage';
import CaseStudyPresentationPage from './components/CaseStudyPresentationPage';
import AboutMeStoryPage from './components/AboutMeStoryPage';
import AboutMeSubPages from './components/AboutMeSubPages';
import { QuickEditorDrawer } from './components/QuickEditorDrawer';
import { fetchCVData, downloadCVDataAsTypeScript, DEFAULT_CV_DATA, EMPTY_CV_DATA, DEFAULT_WEB_TEXTS, STORAGE_KEY } from './lib/storage';
import { CVData } from './types';
import SocialIcon, { getAbsoluteSocialUrl } from './components/SocialIcon';
import BackgroundTextures from './components/BackgroundTextures';
import FloatingAssetsOverlay from './components/FloatingAssetsOverlay';
import SectionGradientShadow from './components/SectionGradientShadow';
import { getThemeColorPalette, getHeroCircleColors } from './lib/themeUtils';

// TypewriterText Component - Animasi Typing Looping
function TypewriterText({ name, lang }: { name: string; lang: 'id' | 'en' }) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const fullText = lang === 'id' 
    ? `HAI, SAYA ${name.toUpperCase()}` 
    : `HELLO, I'M ${name.toUpperCase()}`;

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % 1;
      const currentText = fullText;

      if (!isDeleting) {
        // Typing
        setDisplayText(currentText.substring(0, displayText.length + 1));
        setTypingSpeed(100);

        if (displayText === currentText) {
          // Stay for 2 seconds before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        setDisplayText(currentText.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, fullText, typingSpeed]);

  return (
    <span className="inline-flex items-center">
      {displayText}
      <span className="animate-blink ml-1">|</span>
    </span>
  );
}

// Helper to format unstructured phone numbers or domain strings into clean absolute hyperlinks
function formatSocialLink(link: string | undefined, platform: string, defaultValue: string): string {
  if (!link) return defaultValue;
  return getAbsoluteSocialUrl(link, platform);
}

interface SocialFooterButtonProps {
  key?: string | number;
  s: any;
  theme: 'light' | 'dark';
}

function SocialFooterButton({ s, theme }: SocialFooterButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ y: 25, scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
            exit={{
              scaleX: 0,
              y: [0, 0, 25],
              scaleY: [1, 1, 0],
              opacity: [1, 1, 0],
              transition: {
                scaleX: { duration: 0.15, ease: "easeIn" },
                y: { duration: 0.2, times: [0, 0.4, 1], delay: 0.1 },
                scaleY: { duration: 0.2, times: [0, 0.4, 1], delay: 0.1 },
                opacity: { duration: 0.2, times: [0, 0.4, 1], delay: 0.1 }
              }
            }}
            transition={{
              y: { duration: 0.2, ease: "easeOut" },
              scaleY: { duration: 0.2, ease: "easeOut" },
              opacity: { duration: 0.2, ease: "easeOut" },
              scaleX: { duration: 0.25, delay: 0.1, ease: "easeOut" }
            }}
            style={{ originX: 0.5, originY: 1 }}
            className={`absolute bottom-full mb-3 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold whitespace-nowrap shadow-lg z-50 ${
              theme === 'dark'
                ? 'bg-slate-950 text-emerald-400 border-slate-800 shadow-black/50'
                : 'bg-white text-emerald-600 border-slate-200 shadow-slate-200/50'
            }`}
          >
            {s.value || s.name}
            {/* Elegant tiny bottom anchor triangle / arrow pointing down */}
            <div className={`absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rotate-45 border-r border-b -mt-1 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          const target = s.usernameOrUrl || s.value || '';
          const url = formatSocialLink(target, s.name || 'custom', '');
          window.open(url, '_blank', 'noreferrer');
        }}
        className={`h-8 w-8 sm:h-9 sm:w-9 rounded-md sm:rounded-lg transition-all duration-300 border cursor-pointer flex items-center justify-center group ${
          theme === 'dark' 
            ? 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-white hover:border-slate-600' 
            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
        }`}
        title={`Open ${s.name}: ${s.value || s.usernameOrUrl}`}
      >
        <SocialIcon platform={s.name} size={16} className="w-4 h-4 transition-transform group-hover:scale-110" useBrandColor={true} />
      </button>
    </div>
  );
}

export const ID_TRANSLATIONS = {
  webTexts: {
    education_intro: "Jelajahi pencapaian akademis saya, fondasi pelatihan ilmiah, dan peta jalan kredensial formal yang disajikan dalam lembar presentasi kustom.",
    hero_badge: "ANALIS DATA & STRATEGIST BI",
    hero_title: "Mengubah Data Mentah\nmenjadi Keputusan Bisnis",
    hero_subtitle: "Spesialisasi dalam wawasan berdampak tinggi melalui mesin SQL kustom, alur kerja Python, dan Business Intelligence tingkat lanjut. Saya mengubah catatan transaksi menjadi peta jalan optimasi yang bersih, tervalidasi, dan dapat ditindaklanjuti.",
    projects_badge: "KRONIK KASUS",
    projects_title: "Studi Kasus Terpilih",
    projects_subtitle: "Demonstrasi terstruktur kemahiran teknis di seluruh tumpukan penerapan data, menyoroti audit kinerja nyata.",
    skills_badge: "KLASIFIKASI STACK",
    skills_title: "Gudang Senjata Teknis",
    skills_subtitle: "Keahlian dan pengetahuan arsitektural di seluruh database SQL relasional, mesin skrip matematika, dan filter telemetri kustom.",
    experience_badge: "KETELUSURAN KARIR",
    experience_title: "Perjalanan Profesional",
    experience_subtitle: "Pengalaman terbukti dalam merancang database, kerangka pelaporan, dan pipeline di ruang konsumen yang cepat. Klik untuk beralih ringkasan poin-poin.",
    contact_badge: "MATRIKS PERTANYAAN",
    contact_title: "Mari terhubung",
    contact_subtitle: "Tersedia untuk keterlibatan konsultasi perusahaan, peran analis senior purnawaktu, atau peluang berbicara di panel mengenai intelijen bisnis tingkat lanjut.",
    about_story_badge: "✦ JELAJAHI KISAH SAYA",
    about_story_title: "Tentang Saya",
    about_story_intro: "Saya adalah seorang Analis Business Intelligence dan Developer yang berdedikasi untuk menyatukan kompleksitas mentah menjadi aplikasi interaktif berkualitas tinggi. Dengan fokus ganda pada arsitektur pipeline data dan keahlian desain pixel-perfect, saya mengubah visi ambisius menjadi kenyataan.",
    about_story_left_1_title: "Interior / Arsitektur Data",
    about_story_left_1_desc: "Menyusun pipeline yang bersih dan kokoh serta memodelkan skema relasional untuk membangun fondasi data berkinerja tinggi.",
    about_story_left_2_title: "Eksterior / Analisis Visual",
    about_story_left_2_desc: "Membuat dashboard dan laporan intuitif yang memberikan wawasan instan dan meningkatkan kecepatan pengambilan keputusan.",
    about_story_left_3_title: "Desain / Strategi Produk",
    about_story_left_3_desc: "Memadukan desain antarmuka pengguna yang ramping dengan interaksi cepat untuk portal web yang fungsional dan menyenangkan.",
    about_story_right_1_title: "Dekorasi / Strategi Bisnis",
    about_story_right_1_desc: "Menerjemahkan persyaratan perusahaan menjadi KPI yang dapat diverifikasi untuk mengoptimalkan kinerja operasional dan membuka pertumbuhan.",
    about_story_right_2_title: "Perencanaan / Logika Cermat",
    about_story_right_2_desc: "Melakukan iterasi secara cermat melalui persyaratan, garis waktu, desain skema, dan batasan dengan standar profesional yang tinggi.",
    about_story_right_3_title: "Eksekusi / Pengiriman Ramping",
    about_story_right_3_desc: "Menghidupkan proyek data melalui integrasi kode yang sempurna, validasi menyeluruh, dan penyelarasan berkelanjutan."
  },
  title: "Analis Data Senior & Strategist Keputusan BI",
  aboutMe: "Analis Data Senior yang berorientasi pada detail dan terdorong oleh hasil dengan pengalaman lebih dari 6 tahun dalam merekayasa pipeline SQL berkinerja tinggi, model prediktif canggih, dan dasbor BI tingkat eksekutif yang intuitif. Mahir dalam mengubah catatan transaksi terstruktur yang kompleks menjadi keputusan operasional yang optimal dan wawasan pendapatan yang dapat ditindaklanjuti.\n\nSangat menyukai transparansi data, penyelarasan kinerja pipeline, dan pertumbuhan strategis. Berkomitmen untuk mendorong efisiensi melalui kerangka verifikasi statistik dan KPI yang transparan.",
  
  skills: {
    'sql': {
      name: 'SQL',
      description: 'Desain kueri database, CTE, fungsi jendela, optimasi rencana kueri, pembuatan skema, PostgreSQL, dan konfigurasi Snowflake.'
    },
    'python': {
      name: 'Python',
      description: 'Pandas, NumPy, alur kerja pembersihan data, skrip analitik otomatis, agregasi statistik, dan proxy API kustom.'
    },
    'power-query': {
      name: 'Power Query',
      description: 'Operasi kode-M tingkat lanjut, koneksi data ETL, penggabungan data tingkat perusahaan, parameterisasi, dan penggabungan skema.'
    },
    'powerbi': {
      name: 'PowerBI',
      description: 'Pemodelan DAX, konfigurasi ETL power query, tata letak pelaporan tabular tingkat perusahaan, dan notifikasi email otomatis.'
    },
    'excel': {
      name: 'Excel',
      description: 'Dataset PowerPivot, rumus pencarian bertingkat, skenario sensitivitas keuangan, dan pemeriksaan analitik ad-hoc yang cepat.'
    }
  },

  caseStudies: {
    'customer-segmentation': {
      title: "Analisis Segmentasi Pelanggan",
      category: "Analitik Pemasaran & Otomatisasi",
      description: "Mengotomatiskan analisis RFM (Recency, Frequency, Monetary) menggunakan struktur data Python untuk mengkategorikan 50.000+ pelanggan global. Menyediakan kohort langsung mandiri untuk pengguna bisnis agar sesuai dengan kampanye otomatisasi pemasaran secara langsung, meningkatkan indeks kinerja kampanye email."
    },
    'sales-forecasting': {
      title: "Model Peramalan Penjualan",
      category: "Perencanaan Bisnis & Keuangan",
      description: "Mengembangkan dan memvalidasi model regresi prediktif terintegrasi yang menganalisis buku pesanan historis multi-tahun. Memprediksi pendapatan perusahaan yang masuk, pengubah varians musiman, dan respons saluran pemasaran dengan akurasi validasi lebih dari 95%."
    },
    'supply-chain': {
      title: "Optimasi Rantai Pasok",
      category: "Logistik Operasional",
      description: "Mengidentifikasi hambatan pengiriman rantai pasok melalui alokasi rute spasial yang komprehensif dan analisis waktu tunggu. Membangun tata letak dasbor kustom yang responsif di PowerBI menggunakan langkah Power Query yang dibersihkan untuk menandai rute latensi tinggi, mengurangi total waktu tunggu pengiriman melalui realokasi gudang dan pola perutean cerdas."
    }
  },

  experiences: {
    'exp-1': {
      role: "Analis Data Senior / Strategist Keputusan",
      company: "Global Tech Corp",
      bulletPoints: [
        "Merancang dan memelihara pipeline SQL dan Python yang mengeksekusi segmentasi kohort RFM di 50rb+ pengguna harian, menghasilkan peningkatan CTR email sebesar 24%.",
        "Memimpin audit pemodelan churn yang menganalisis tren konsumen untuk memulihkan kerugian churn berulang tahunan sebesar $2,2 juta.",
        "Membangun papan Tableau visual KPI waktu nyata untuk melacak pipeline pendapatan berkecepatan tinggi untuk rapat VP produk senior."
      ]
    },
    'exp-2': {
      role: "Analis Data / Ilmuwan Data",
      company: "Insight Solutions",
      bulletPoints: [
        "Mengotomatiskan ETL mingguan menggunakan Power Query dan skrip Python, menghemat 15 jam kerja manual per minggu untuk tim keuangan.",
        "Merancang model regresi prediktif untuk meramalkan permintaan musiman dengan akurasi validasi historis sebesar 96%.",
        "Berkolaborasi dalam migrasi database lokal ke Snowflake, menormalisasi skema, dan merancang indeks query untuk mempercepat waktu respons."
      ]
    }
  },

  educationSections: {
    'edu-sec-1': {
      title: "Fondasi Pendidikan Saya",
      content: "Menggabungkan keketatan statistik dengan rekayasa komputasi. Filosofi akademis saya berkisar pada pemahaman mekanika matematika yang mendasari arsitektur analitik modern, memastikan setiap algoritma dan kueri didukung oleh bukti statistik yang kuat."
    },
    'edu-sec-2': {
      title: "Statistika Teoretis & Terapan",
      content: "Di Columbia University, saya sangat fokus pada teori probabilitas, analisis regresi, dan statistika komputasi. Pelatihan terstruktur ini mengajarkan saya untuk melihat melampaui agregasi data sederhana dan mengidentifikasi sinyal kausal yang sebenarnya di dalam dataset korporat yang besar dan bising."
    }
  },

  education: [
    {
      degree: "B.S. Statistik Terapan & Ilmu Komputer",
      institution: "Columbia University, NYC"
    }
  ]
};

function getLocalizedCVData(cvData: CVData, lang: 'id' | 'en'): CVData {
  const filterList = <T extends { id: string }>(items: T[] | undefined): T[] | undefined => {
    if (!items) return undefined;
    const hasLangSuffix = items.some(item => item.id && (item.id.endsWith('-id') || item.id.endsWith('-en')));
    if (!hasLangSuffix) {
      if (lang === 'id') {
        return items.map(item => {
          // Translate default items to ID if applicable
          if (item.id === 'sql' && ID_TRANSLATIONS.skills['sql']) {
            return { ...item, ...ID_TRANSLATIONS.skills['sql'] };
          }
          if (item.id === 'python' && ID_TRANSLATIONS.skills['python']) {
            return { ...item, ...ID_TRANSLATIONS.skills['python'] };
          }
          if (item.id === 'power-query' && ID_TRANSLATIONS.skills['power-query']) {
            return { ...item, ...ID_TRANSLATIONS.skills['power-query'] };
          }
          if (item.id === 'powerbi' && ID_TRANSLATIONS.skills['powerbi']) {
            return { ...item, ...ID_TRANSLATIONS.skills['powerbi'] };
          }
          if (item.id === 'excel' && ID_TRANSLATIONS.skills['excel']) {
            return { ...item, ...ID_TRANSLATIONS.skills['excel'] };
          }
          if (item.id === 'customer-segmentation' && ID_TRANSLATIONS.caseStudies['customer-segmentation']) {
            return { ...item, ...ID_TRANSLATIONS.caseStudies['customer-segmentation'] };
          }
          if (item.id === 'sales-forecasting' && ID_TRANSLATIONS.caseStudies['sales-forecasting']) {
            return { ...item, ...ID_TRANSLATIONS.caseStudies['sales-forecasting'] };
          }
          if (item.id === 'supply-chain' && ID_TRANSLATIONS.caseStudies['supply-chain']) {
            return { ...item, ...ID_TRANSLATIONS.caseStudies['supply-chain'] };
          }
          if (item.id === 'exp-1' && ID_TRANSLATIONS.experiences['exp-1']) {
            return { ...item, ...ID_TRANSLATIONS.experiences['exp-1'] };
          }
          if (item.id === 'exp-2' && ID_TRANSLATIONS.experiences['exp-2']) {
            return { ...item, ...ID_TRANSLATIONS.experiences['exp-2'] };
          }
          if (item.id === 'edu-sec-1' && ID_TRANSLATIONS.educationSections['edu-sec-1']) {
            return { ...item, ...ID_TRANSLATIONS.educationSections['edu-sec-1'] };
          }
          if (item.id === 'edu-sec-2' && ID_TRANSLATIONS.educationSections['edu-sec-2']) {
            return { ...item, ...ID_TRANSLATIONS.educationSections['edu-sec-2'] };
          }
          return item;
        });
      }
      return items;
    }

    const result: T[] = [];
    const mappedBases = new Set<string>();

    items.forEach(item => {
      if (item.id && item.id.endsWith(`-${lang}`)) {
        const baseId = item.id.slice(0, -(lang.length + 1));
        result.push({
          ...item,
          id: baseId
        });
        mappedBases.add(baseId);
      }
    });

    items.forEach(item => {
      if (item.id && !item.id.endsWith('-id') && !item.id.endsWith('-en')) {
        if (!mappedBases.has(item.id)) {
          result.push(item);
        }
      }
    });

    return result;
  };

  const filterEduList = (items: any[] | undefined) => {
    if (!items) return [];
    const hasLangSuffix = items.some(item => item.id && (item.id.endsWith('-id') || item.id.endsWith('-en')));
    if (!hasLangSuffix) {
      if (lang === 'id') {
        return items.map(item => {
          if (item.degree === "B.S. Applied Statistics & Computer Science") {
            return {
              ...item,
              degree: ID_TRANSLATIONS.education[0].degree,
              institution: ID_TRANSLATIONS.education[0].institution
            };
          }
          return item;
        });
      }
      return items;
    }

    const result: any[] = [];
    const mappedBases = new Set<string>();

    items.forEach(item => {
      if (item.id && item.id.endsWith(`-${lang}`)) {
        const baseId = item.id.slice(0, -(lang.length + 1));
        result.push({
          ...item,
          id: baseId
        });
        mappedBases.add(baseId);
      }
    });

    items.forEach(item => {
      if (!item.id || (!item.id.endsWith('-id') && !item.id.endsWith('-en'))) {
        if (!item.id || !mappedBases.has(item.id)) {
          result.push(item);
        }
      }
    });

    return result;
  };

  const localizedWebTexts: Record<string, string> = {};
  if (cvData.webTexts) {
    Object.entries(cvData.webTexts).forEach(([key, val]) => {
      if (!key.endsWith('_id') && !key.endsWith('_en') && !key.endsWith('-id') && !key.endsWith('-en')) {
        // Fallback to default Indonesian if language is ID and value is default English or not overridden
        const isDefaultVal = val === undefined || val === null || val === "" || val === DEFAULT_WEB_TEXTS[key];
        if (lang === 'id' && ID_TRANSLATIONS.webTexts[key] !== undefined && isDefaultVal) {
          localizedWebTexts[key] = ID_TRANSLATIONS.webTexts[key];
        } else {
          localizedWebTexts[key] = val;
        }
      }
    });

    Object.entries(cvData.webTexts).forEach(([key, val]) => {
      if (key.endsWith(`_${lang}`) || key.endsWith(`-${lang}`)) {
        const baseKey = key.slice(0, -(lang.length + 1));
        localizedWebTexts[baseKey] = val;
      }
    });
  }

  const getField = (fieldName: keyof CVData, defaultValue: any) => {
    if (localizedWebTexts[fieldName as string] !== undefined) {
      return localizedWebTexts[fieldName as string];
    }
    const val = cvData[fieldName] !== undefined ? cvData[fieldName] : defaultValue;
    if (lang === 'id' && ID_TRANSLATIONS[fieldName as string] !== undefined) {
      // Apply default translations for standard profile fields
      if (val === defaultValue || val === cvData[fieldName]) {
        return ID_TRANSLATIONS[fieldName as string];
      }
    }
    return val;
  };

  return {
    ...cvData,
    name: getField('name', cvData.name),
    title: getField('title', cvData.title),
    location: getField('location', cvData.location),
    aboutMe: getField('aboutMe', cvData.aboutMe),
    nickname: getField('nickname', cvData.nickname),
    idCardSubText: getField('idCardSubText', cvData.idCardSubText),
    methodologyTitle: getField('methodologyTitle', cvData.methodologyTitle),
    methodologyText: getField('methodologyText', cvData.methodologyText),
    
    skills: filterList(cvData.skills),
    skillCategories: filterList(cvData.skillCategories),
    caseStudies: filterList(cvData.caseStudies),
    experiences: filterList(cvData.experiences),
    education: filterEduList(cvData.education),
    personality: filterList(cvData.personality),
    hobbies: filterList(cvData.hobbies),
    careerGoals: filterList(cvData.careerGoals),
    educationSections: filterList(cvData.educationSections),
    webTexts: localizedWebTexts
  };
}

export default function App() {
  const checkIsAdminAuthenticated = () => {
    try {
      return sessionStorage.getItem('admin_session_auth') === 'true';
    } catch {
      return false;
    }
  };

  const isCurrentUrlPreview = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'prev') return true;
    if ((parts[0] === 'id' || parts[0] === 'en') && parts[1] === 'admin' && parts[2] === 'prev') return true;
    if (parts[0] === 'admin' && parts[1] === 'prev') return true;
    return false;
  };

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(() => {
    return isCurrentUrlPreview() && checkIsAdminAuthenticated();
  });

  const [lang, setLang] = useState<'id' | 'en'>(() => {
    // 1. Check current URL path prefix first
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'prev') {
      parts.shift();
    }
    if (parts[0] === 'id' || parts[0] === 'en') {
      try {
        localStorage.setItem('bi-portfolio-lang', parts[0]);
      } catch (_) {}
      return parts[0] as 'id' | 'en';
    }

    // 2. Check localStorage
    try {
      const saved = localStorage.getItem('bi-portfolio-lang');
      if (saved === 'id' || saved === 'en') return saved;
    } catch (_) {}

    // 3. Default to English (en) for first-time visitors
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('bi-portfolio-lang', lang);
    } catch (_) {}

    // Ensure URL has the language prefix and respects isPreviewMode / admin structure
    const parts = window.location.pathname.split('/').filter(Boolean);
    let isPrev = false;
    if (parts[0] === 'prev') {
      isPrev = true;
      parts.shift();
    }

    if (parts[0] !== 'id' && parts[0] !== 'en') {
      if (parts[0] === 'admin' && parts[1] === 'prev') {
        parts.splice(0, 2);
        const newPathname = `/${lang}/admin/prev` + (parts.length > 0 ? '/' + parts.join('/') : '');
        window.history.replaceState(null, '', newPathname + window.location.search + window.location.hash);
      } else if (parts[0] === 'admin') {
        parts.shift();
        const newPathname = `/${lang}/admin` + (parts.length > 0 ? '/' + parts.join('/') : '');
        window.history.replaceState(null, '', newPathname + window.location.search + window.location.hash);
      } else {
        const newPathname = (isPrev ? `/${lang}/admin/prev` : `/${lang}`) + (parts.length > 0 ? '/' + parts.join('/') : '');
        window.history.replaceState(null, '', newPathname + window.location.search + window.location.hash);
      }
    }
  }, [lang]);

  const [showLangConfirm, setShowLangConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const langContainerRef = useRef<HTMLDivElement>(null);
  const langContainerRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    function handleClickOutside(event: MouseEvent) {
      const clickedInsideDesktop = langContainerRef.current && langContainerRef.current.contains(event.target as Node);
      const clickedInsideMobile = langContainerRefMobile.current && langContainerRefMobile.current.contains(event.target as Node);
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setShowLangConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConfirmLanguageChange = () => {
    const targetLang = lang === 'id' ? 'en' : 'id';
    try {
      localStorage.setItem('bi-portfolio-lang', targetLang);
    } catch (_) {}

    const parsed = parseRoute();
    let prefix = `/${targetLang}`;
    if (parsed.isPreview && checkIsAdminAuthenticated()) {
      prefix = `/${targetLang}/admin/prev`;
    } else if (parsed.isAdmin) {
      prefix = `/${targetLang}/admin`;
    }
    
    let suffix = '';
    if (parsed.projectId) {
      suffix = `/project/${parsed.projectId}`;
    } else if (parsed.aboutSubPage) {
      suffix = `/${parsed.aboutSubPage}`;
    } else if (parsed.isStoryView) {
      suffix = `/about-me`;
    } else if (parsed.activeSection && parsed.activeSection !== 'home') {
      suffix = `/${parsed.activeSection}`;
    }

    const newPathname = prefix + suffix;
    window.location.href = newPathname + window.location.search + window.location.hash;
  };

  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cvModalDirectDownload, setCvModalDirectDownload] = useState(false);
  const [isQuickEditorOpen, setIsQuickEditorOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cvData, setCvData] = useState<CVData>(() => {
    // Only load from localStorage in protected admin preview mode (/admin/prev)
    if (isCurrentUrlPreview() && checkIsAdminAuthenticated()) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bi-portfolio-cv-data');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            return {
              ...DEFAULT_CV_DATA,
              ...parsed,
              webTexts: {
                ...DEFAULT_WEB_TEXTS,
                ...(parsed.webTexts || {})
              }
            };
          }
        }
      } catch (_) {}
    }
    // Public / Non-preview pages strictly use pristine DEFAULT_CV_DATA from portfolioData.ts
    return DEFAULT_CV_DATA;
  });

  const activeCVData = getLocalizedCVData(cvData, lang);
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>('exp-1');
  const [activeSection, setActiveSection] = useState('home');
  const [isStoryView, setIsStoryView] = useState(false);
  const isStoryViewRef = useRef(false);
  const [isAllProjectsHovered, setIsAllProjectsHovered] = useState(false);

  useEffect(() => {
    isStoryViewRef.current = isStoryView;
  }, [isStoryView]);

  const [aboutSubPage, setAboutSubPage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [elapsedMinTime, setElapsedMinTime] = useState(false);
  const [canFinishLoading, setCanFinishLoading] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  // Dynamically update document title immediately based on profile nickname/name
  useEffect(() => {
    const displayName = activeCVData.nickname || activeCVData.name;
    document.title = displayName ? `Portfolio ${displayName}` : 'Portfolio';
  }, [activeCVData.nickname, activeCVData.name]);
  const lastScrollY = useRef(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navbarWidth, setNavbarWidth] = useState(0);
  const [navbarRight, setNavbarRight] = useState(0);

  // Monitor the navbar size and position when it is rendered
  useEffect(() => {
    if (isStoryView) return;
    
    const updateNavbarPosition = () => {
      if (!navbarRef.current) return;
      const rect = navbarRef.current.getBoundingClientRect();
      // Only update if it has valid dimensions
      if (rect.width > 0) {
        setNavbarWidth(rect.width);
        setNavbarRight(window.innerWidth - rect.right);
      }
    };

    // Run multiple times on mount/loading finish to ensure layout is perfect
    updateNavbarPosition();
    const t1 = setTimeout(updateNavbarPosition, 100);
    const t2 = setTimeout(updateNavbarPosition, 500);
    const t3 = setTimeout(updateNavbarPosition, 1000);
    const t4 = setTimeout(updateNavbarPosition, 2000);

    window.addEventListener('resize', updateNavbarPosition);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('resize', updateNavbarPosition);
    };
  }, [isStoryView, isLoading]);

  // Auto-hide header navigation on scroll down, show on scroll up/top or button click
  useEffect(() => {
    if (isStoryView) return;

    const handleScrollVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // If at the very top of the page, keep the nav bar visible
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current + 15 && currentScrollY > 80) {
        // Scrolling down past threshold -> hide navbar
        setIsNavVisible(false);
        setMobileMenuOpen(false);
      } else if (currentScrollY < lastScrollY.current - 20) {
        // Scrolling up -> show navbar
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, [isStoryView]);

  // Set timeout for 0.8 seconds to show "LOADING/MEMUAT" first
  useEffect(() => {
    const t = setTimeout(() => {
      setElapsedMinTime(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Set timeout for 2.0 seconds total (giving 1.2 seconds of name visibility) before finishing loading
  useEffect(() => {
    const t = setTimeout(() => {
      setCanFinishLoading(true);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Smooth loading progress animation
  useEffect(() => {
    let timer: any;
    const updateProgress = () => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // If assets are loaded and we can finish loading, we speed up to 100%
        if (isAssetsLoaded && canFinishLoading) {
          const step = Math.ceil((100 - prev) / 3);
          const next = prev + (step > 1 ? step : 1);
          return next >= 100 ? 100 : next;
        }
        
        // Otherwise, animate smoothly up to 99% and wait there
        if (prev < 99) {
          // Calculate step to reach 99% gradually
          // E.g. make it climb relatively fast at first, then slow down as it approaches 99%
          const remaining = 99 - prev;
          let step = 0;
          if (prev < 50) {
            step = Math.floor(Math.random() * 4) + 2; // 2-5% per step
          } else if (prev < 80) {
            step = Math.floor(Math.random() * 3) + 1; // 1-3% per step
          } else if (prev < 95) {
            step = Math.floor(Math.random() * 2) + 0.5; // 0.5-1.5% per step
          } else {
            step = 0.2; // very slow creep close to 99
          }
          const next = prev + step;
          return next >= 99 ? 99 : next;
        }
        
        // Hold at 99%
        return 99;
      });
    };

    timer = setInterval(updateProgress, 30);
    return () => clearInterval(timer);
  }, [isAssetsLoaded, canFinishLoading]);

  // Handle setting isLoading to false when progress hits 100
  useEffect(() => {
    if (loadingProgress >= 100) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 350); // short delay for beautiful transition feel
      return () => clearTimeout(timeout);
    }
  }, [loadingProgress]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('bi-portfolio-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleThemeWithAnimation = (targetTheme: 'light' | 'dark', e?: React.MouseEvent | React.TouchEvent | any) => {
    // Keep navigation bar visible and lock scroll-hide ref during theme toggling
    setIsNavVisible(true);
    lastScrollY.current = window.scrollY + 200;

    const isMobileViewport = isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);

    // On mobile view, switch theme instantly without heavy ViewTransitions or clip-path animations for lightweight, smooth performance
    if (isMobileViewport || !(document as any).startViewTransition) {
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setTheme(targetTheme);
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (e && 'clientX' in e && 'clientY' in e && e.clientX !== undefined && e.clientY !== undefined) {
      x = e.clientX;
      y = e.clientY;
    } else {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && activeEl.tagName === 'BUTTON') {
        const rect = activeEl.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        const buttons = document.querySelectorAll('[title*="Mode"]');
        if (buttons.length > 0) {
          const rect = buttons[0].getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }
    }

    if (!(document as any).startViewTransition) {
      setTheme(targetTheme);
      return;
    }

    // Add high-performance transition optimizer class
    document.documentElement.classList.add('in-transition');

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(targetTheme);
      // Force change theme class synchronously so view-transition captures it
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: isMobile ? 320 : 480,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });

    // Clean up optimization class after view transition ends
    transition.finished.then(() => {
      document.documentElement.classList.remove('in-transition');
    });
  };

  useEffect(() => {
    localStorage.setItem('bi-portfolio-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen to device system preference shifts in real-time
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('bi-portfolio-theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Helper to preload a single image
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!url) {
        resolve();
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (typeof window !== 'undefined') {
          (window as any).__LOADED_IMAGES_CACHE = (window as any).__LOADED_IMAGES_CACHE || new Set<string>();
          (window as any).__LOADED_IMAGES_CACHE.add(url);
        }
        resolve();
      };
      img.onerror = () => resolve();
    });
  };

  // Load CV data and preload all assets on mount
  useEffect(() => {
    async function loadData() {
      const parsed = parseRoute();
      const isPrev = (parsed.isPreview || isCurrentUrlPreview()) && checkIsAdminAuthenticated();
      let activeData = DEFAULT_CV_DATA;
      
      // 1. Fetch from storage/file based on route mode
      try {
        const data = await fetchCVData(isPrev ? 'preview' : 'live');
        setCvData(data);
        activeData = data;
      } catch (err) {
        console.error('Failed to load CV data:', err);
      }

      // 2. Gather and filter all images to preload
      const urlsToPreload: string[] = [];
      
      if (activeData.homeImageUrl) urlsToPreload.push(activeData.homeImageUrl);
      if (activeData.homeImageUrlDark) urlsToPreload.push(activeData.homeImageUrlDark);
      if (activeData.idCardSvgLight) urlsToPreload.push(activeData.idCardSvgLight);
      if (activeData.idCardSvgDark) urlsToPreload.push(activeData.idCardSvgDark);
      if (activeData.avatarUrl) urlsToPreload.push(activeData.avatarUrl);

      // Preload custom SVG items
      if (activeData.idCardSvgs && activeData.idCardSvgs.length > 0) {
        activeData.idCardSvgs.forEach(svg => {
          const isUrl = svg.svgContent && (
            svg.svgContent.startsWith('http') || 
            svg.svgContent.startsWith('/') || 
            svg.svgContent.startsWith('data:')
          );
          if (isUrl) {
            urlsToPreload.push(svg.svgContent);
          }
        });
      }

      // Preload about story lanyard and background images
      if (activeData.webTexts?.about_story_image_url) {
        const rawUrl = activeData.webTexts.about_story_image_url;
        if (rawUrl.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(rawUrl);
            if (parsed.lanyardLightUrl) urlsToPreload.push(parsed.lanyardLightUrl);
            if (parsed.lanyardDarkUrl) urlsToPreload.push(parsed.lanyardDarkUrl);
            if (parsed.backgroundImageUrl) urlsToPreload.push(parsed.backgroundImageUrl);
          } catch (_) {}
        } else {
          urlsToPreload.push(rawUrl);
        }
      }

      // Preload custom sub-pages header backgrounds (and their fallback Unsplash default backgrounds)
      const subPageDefaultBgs: Record<string, string> = {
        education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
        personality: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
        hobbies: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop',
        career_journey: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
        skills: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
        career_goals: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1200&auto=format&fit=crop'
      };

      const subPageKeys = ['education', 'personality', 'hobbies', 'career_journey', 'skills', 'career_goals'];
      subPageKeys.forEach(key => {
        const bgUrl = activeData.webTexts?.[`${key}_header_bg`] || subPageDefaultBgs[key];
        if (bgUrl) {
          urlsToPreload.push(bgUrl);
        }
      });

      // Also preload the default lanyard portrait image
      urlsToPreload.push('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop');

      // Preload all custom sections / slides imagery
      if (activeData.educationSections && activeData.educationSections.length > 0) {
        activeData.educationSections.forEach(section => {
          if (section.imageUrl) {
            urlsToPreload.push(section.imageUrl);
          }
        });
      }

      // Clean duplicate and empty URLs
      const cleanUrls = Array.from(new Set(urlsToPreload.filter(Boolean) as string[]));

      // 3. Preload all assets in parallel
      try {
        await Promise.all(cleanUrls.map(url => preloadImage(url)));
      } catch (preloadErr) {
        console.warn('Some assets failed to preload, continuing load anyway:', preloadErr);
      } finally {
        // Guarantee at least some minimal loading time (e.g. 600ms) for high-quality loading screen transition
        setTimeout(() => {
          setIsAssetsLoaded(true);
        }, 600);
      }
    }
    loadData();
  }, []);

  const [activeProjectPresentationId, setActiveProjectPresentationId] = useState<string | null>(null);

  const parseRoute = () => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean);
    
    let isLegacyPrev = false;
    if (parts[0] === 'prev') {
      isLegacyPrev = true;
      parts.shift();
    }

    let routeLang: 'id' | 'en' = lang;
    if (parts[0] === 'id' || parts[0] === 'en') {
      routeLang = parts[0] as 'id' | 'en';
      parts.shift();
    }
    
    let isPrev = isLegacyPrev;
    let isSubpageAdmin = false;
    let projId: string | null = null;
    let isStory = false;
    let subPage: string | null = null;
    let currentSec = 'home';

    if (parts.length > 0) {
      const first = parts[0];
      if (first === 'admin') {
        parts.shift();
        const next = parts[0];
        if (next === 'prev') {
          isPrev = true;
          parts.shift();
        } else {
          isSubpageAdmin = true;
        }
      }
    }

    if (parts.length > 0 && !isSubpageAdmin) {
      const action = parts[0];
      if (action === 'project' && parts[1]) {
        projId = parts[1];
      } else if (action === 'about-me') {
        isStory = true;
        if (parts[1]) {
          subPage = parts[1];
        }
      } else {
        const customSubIds = (activeCVData.customSubPages || []).map(p => p.id);
        const allowedSubs = [
          'education', 'educational', 'personality', 'hobbies', 
          'career-journey', 'skills', 'projects', 'career-goals',
          ...customSubIds
        ];
        if (allowedSubs.includes(action) || action.startsWith('page-') || action.startsWith('custom-')) {
          isStory = true;
          let mapped = action;
          if (mapped === 'educational') {
            mapped = 'education';
          } else if (mapped === 'career-goals') {
            mapped = 'projects';
          }
          subPage = mapped;
        } else {
          currentSec = action;
        }
      }
    }

    return {
      lang: routeLang,
      isPreview: isPrev,
      isAdmin: isSubpageAdmin,
      projectId: projId,
      isStoryView: isStory,
      aboutSubPage: subPage,
      activeSection: currentSec,
      isLegacyPrev
    };
  };

  const navigateToPath = (sub: string | null, targetPreview?: boolean) => {
    const usePrev = targetPreview !== undefined ? targetPreview : isPreviewMode;
    
    // If targetPreview is requested but user is not logged in as admin, redirect to admin login
    if (usePrev && !checkIsAdminAuthenticated()) {
      const adminPath = `/${lang}/admin`;
      if (window.location.pathname !== adminPath) {
        window.history.pushState(null, '', adminPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }

    let prefix = `/${lang}`;
    if (usePrev) {
      prefix = `/${lang}/admin/prev`;
    }
    
    let suffix = '';
    if (sub) {
      if (sub === 'about-me') {
        suffix = '/about-me';
      } else if (sub.startsWith('about-me/')) {
        const subSub = sub.replace(/^about-me\//, '');
        suffix = '/' + subSub;
      } else if (sub === 'admin') {
        const adminPath = `/${lang}/admin`;
        if (window.location.pathname !== adminPath) {
          window.history.pushState(null, '', adminPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return;
      } else if (sub.startsWith('project/')) {
        suffix = '/' + sub;
      } else {
        // Direct subpage like 'education'
        suffix = '/' + sub;
      }
    }
    const newPath = prefix + suffix;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Support pathname-based routing: admin, about-me & presentation slides paths
  useEffect(() => {
    // Legacy support: convert hashes to clean pathnames on load
    const hash = window.location.hash;
    if (hash) {
      let clean = hash.replace(/^#\/?/, '');
      window.location.hash = ''; // Clear hash
      
      const parts = clean.split('/').filter(Boolean);
      const isPrev = parts[0] === 'prev';
      if (isPrev) parts.shift();
      const newPathname = (isPrev ? `/${lang}/admin/prev` : `/${lang}`) + (parts.length > 0 ? '/' + parts.join('/') : '');
      window.history.replaceState(null, '', newPathname + window.location.search);
    }

    const checkRoute = () => {
      const parsed = parseRoute();

      // Normalize legacy /prev route
      if (parsed.isLegacyPrev) {
        const remaining: string[] = [];
        if (parsed.projectId) remaining.push('project', parsed.projectId);
        else if (parsed.aboutSubPage) remaining.push(parsed.aboutSubPage);
        else if (parsed.isStoryView) remaining.push('about-me');
        else if (parsed.activeSection && parsed.activeSection !== 'home') remaining.push(parsed.activeSection);
        
        const newPath = `/${parsed.lang}/admin/prev` + (remaining.length > 0 ? '/' + remaining.join('/') : '');
        window.history.replaceState(null, '', newPath + window.location.search);
      }

      // Authentication Guard for Preview Mode (/admin/prev)
      if (parsed.isPreview) {
        const isAuthed = checkIsAdminAuthenticated();
        if (!isAuthed) {
          // If not authenticated as admin, redirect to admin login page
          setIsPreviewMode(false);
          setIsAdminView(true);
          const adminPath = `/${parsed.lang}/admin`;
          window.history.replaceState(null, '', adminPath + window.location.search);
          return;
        }
      }

      // If user navigates to /admin but is already authenticated, immediately redirect to /admin/prev
      if (parsed.isAdmin) {
        const isAuthed = checkIsAdminAuthenticated();
        if (isAuthed) {
          setIsAdminView(false);
          setIsPreviewMode(true);
          const prevPath = `/${parsed.lang}/admin/prev`;
          window.history.replaceState(null, '', prevPath + window.location.search);
          return;
        }
      }

      setIsPreviewMode(parsed.isPreview);
      setIsAdminView(parsed.isAdmin);
      setActiveProjectPresentationId(parsed.projectId);
      setIsStoryView(parsed.isStoryView);
      setAboutSubPage(parsed.aboutSubPage);
      
      // Refresh CV Data: preview mode uses localStorage, public/live mode strictly uses pristine TS (DEFAULT_CV_DATA)
      const isPrev = parsed.isPreview && checkIsAdminAuthenticated();
      fetchCVData(isPrev ? 'preview' : 'live').then(data => {
        setCvData(data);
      });

      if (parsed.isStoryView) {
        setActiveSection('profil');
      } else {
        setActiveSection(parsed.activeSection || 'home');
        if (parsed.activeSection && parsed.activeSection !== 'home') {
          setTimeout(() => {
            const el = document.getElementById(parsed.activeSection);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    // Always check on mount
    checkRoute();

    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, [lang]);

  const openAdminView = () => {
    navigateToPath('admin');
  };

  const closeAdminView = () => {
    navigateToPath(null);
  };

  // Track active scroll sections on scroll to highlight header nav link status
  useEffect(() => {
    const handleScroll = () => {
      if (isStoryView) return;

      // If we are scrolled close to the bottom of the page, immediately highlight 'contact'
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      const scrollPosition = window.scrollY + 160;
      const sections = ['home', 'projects', 'skills', 'experience', 'contact'];
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isStoryView]);

  const scrollToSection = (id: string) => {
    if (id === 'profil' || id === 'about-me') {
      navigateToPath('about-me');
    } else {
      navigateToPath(null);
      setIsStoryView(false);
      setActiveSection(id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const currentProfileImageUrl = theme === 'dark' && activeCVData.homeImageUrlDark 
    ? activeCVData.homeImageUrlDark 
    : (activeCVData.homeImageUrl || "");

  const isPng = currentProfileImageUrl ? (
    currentProfileImageUrl.toLowerCase().includes('.png') || 
    currentProfileImageUrl.toLowerCase().includes('data:image/png') ||
    currentProfileImageUrl.toLowerCase().includes('blob:')
  ) : false;

  const matchedProject = activeProjectPresentationId 
    ? (activeCVData.caseStudies || []).find(p => p.id === activeProjectPresentationId) 
    : null;

  const hasCachedData = (() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bi-portfolio-cv-data');
      return !!cached;
    } catch (_) {
      return false;
    }
  })();

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060913] text-white select-none"
          >
            <div className="flex flex-col items-center gap-3 max-w-md px-6 text-center">
              {/* Modern pulsing ring/halo or tech indicator */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-2xl border-2 border-emerald-500/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-2 rounded-xl border border-dashed border-emerald-500/30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Database className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-[10px] tracking-[0.35em] text-slate-400 uppercase">
                  {lang === 'id' ? "PORTOFOLIO" : "PORTFOLIO"}
                </p>
                <div className="h-9 sm:h-10 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {!elapsedMinTime ? (
                      <motion.h1 
                        key="loading-state"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-white uppercase"
                      >
                        {lang === 'id' ? "MEMUAT" : "LOADING"}
                      </motion.h1>
                    ) : (
                      <motion.h1 
                        key="name-state"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-white uppercase"
                      >
                        {activeCVData.nickname || activeCVData.name || (lang === 'id' ? "MEMUAT" : "LOADING")}
                      </motion.h1>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-48 space-y-2 mt-0.5">
                <div className="h-1 w-full bg-slate-800/60 rounded-full overflow-hidden border border-slate-800/20">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    style={{ width: `${loadingProgress}%` }}
                    transition={{ type: "tween", ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-400">
                  <span className="text-emerald-400 tracking-wider">
                    {loadingProgress < 100 ? (lang === 'id' ? "MEMUAT DATA" : "LOADING DATA") : (lang === 'id' ? "SINKRONISASI SELESAI" : "SYNC COMPLETE")}
                  </span>
                  <span className="font-bold text-white tracking-widest">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        matchedProject ? (
          <CaseStudyPresentationPage 
            project={matchedProject}
            onClose={() => {
              navigateToPath(null);
              setActiveProjectPresentationId(null);
            }}
            theme={theme}
            authorName={activeCVData.name}
            authorTitle={activeCVData.title}
          />
        ) : isAdminView ? (
          <AdminLoginPage 
            onSuccess={() => {
              setIsAdminView(false);
              setIsPreviewMode(true);
              navigateToPath(null, true);
            }}
            onClose={closeAdminView} 
            lang={lang}
            theme={theme}
            setTheme={toggleThemeWithAnimation}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`min-h-screen flex flex-col justify-between font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-250 ${
              theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f7f9fb] text-slate-800'
            }`}
          >
            {/* TOP PREVIEW BANNER BAR */}
            {isPreviewMode && !isAdminView && !matchedProject && (
              <div className="fixed top-0 inset-x-0 z-[60] bg-slate-950/95 text-white border-b border-emerald-500/40 backdrop-blur-md px-3 sm:px-6 py-2 shadow-xl shadow-black/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[11px] tracking-wider text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
                      /{lang}/admin/prev
                    </span>
                    <span className="hidden sm:inline text-[11px] text-slate-300">
                      {lang === 'id' ? 'Mode Pratinjau Terproteksi Admin (Data Draft Lokal)' : 'Admin Protected Preview Mode (Local Draft Data)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sessionStorage.removeItem('admin_session_auth');
                      } catch (_) {}
                      setIsPreviewMode(false);
                      const currentSub = aboutSubPage 
                        ? (aboutSubPage === 'about-me' ? 'about-me' : `about-me/${aboutSubPage}`) 
                        : (activeSection !== 'home' ? activeSection : null);
                      navigateToPath(currentSub, false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white border border-red-800/60 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-97"
                    title={lang === 'id' ? 'Keluar sesi admin dan kembali ke website publik' : 'Logout admin session and return to public website'}
                  >
                    <span>🔒 Logout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCVDataAsTypeScript(cvData)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm select-none active:scale-97"
                    title="Unduh file portfolioData.ts siap pakai untuk langsung replace file lama di project"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Unduh</span>
                    <span>portfolioData.ts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const currentSub = aboutSubPage 
                        ? (aboutSubPage === 'about-me' ? 'about-me' : `about-me/${aboutSubPage}`) 
                        : (activeSection !== 'home' ? activeSection : null);
                      navigateToPath(currentSub, false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 font-medium text-[11px] flex items-center gap-1 transition-all cursor-pointer select-none active:scale-97"
                    title="Buka versi web asli (data portfolioData.ts)"
                  >
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="hidden xs:inline">Web</span> Asli
                  </button>
                </div>
              </div>
            )}
      
      {/* 1. TOP TRANSPARENT NAVIGATION BAR - FIXED ON HOME, HIDDEN ELSEWHERE */}
      {!isStoryView && (
        <>
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: isNavVisible ? 1 : 0, 
              y: isNavVisible ? 0 : -70,
              pointerEvents: isNavVisible ? 'auto' : 'none'
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`hidden md:block fixed left-0 right-0 w-full z-50 bg-transparent border-none shadow-none ${
              isPreviewMode ? 'top-10' : 'top-0'
            }`}
          >
            <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
              <nav ref={navbarRef} className={`w-full md:w-fit ml-0 md:ml-auto flex items-center h-auto md:h-11 mt-2 md:mt-3 px-3 md:px-4 py-0 rounded-xl md:rounded-2xl backdrop-blur-md transition-all duration-250 ${
                theme === 'dark' 
                  ? 'bg-slate-800/85 border-none shadow-lg shadow-black/30 text-white' 
                  : 'bg-white/85 border border-slate-200/85 shadow-md shadow-slate-100 text-slate-800'
              }`}
              style={
                theme === 'dark' 
                  ? (activeCVData.webTexts?.navbar_bg_color_dark ? { backgroundColor: activeCVData.webTexts.navbar_bg_color_dark } : undefined)
                  : (activeCVData.webTexts?.navbar_bg_color ? { backgroundColor: activeCVData.webTexts.navbar_bg_color } : undefined)
              }
              >
                {/* Responsive Navigation container */}
                <div className="w-full">
                  {/* DESKTOP VIEW */}
                  <div className="hidden md:flex items-center gap-4">
                    {/* Nav links (Desktop only) */}
                    <div className="flex gap-1 items-center">
                      {['home', 'projects', 'skills', 'experience', 'contact'].map((section) => {
                        const active = activeSection === section;
                        return (
                          <button
                            key={section}
                            onClick={() => scrollToSection(section)}
                            className={`font-sans text-[11px] uppercase tracking-widest font-bold cursor-pointer transition-all duration-300 px-3 py-1.5 rounded-full border relative ${
                              active 
                                ? (theme === 'dark' 
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-xs' 
                                    : 'text-emerald-700 bg-emerald-500/10 border-emerald-500/10 shadow-xs') 
                                : (theme === 'dark' 
                                    ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04]' 
                                    : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-black/[0.03]')
                            }`}
                          >
                            {section}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Language Switcher Toggle with Confirmation Overlay */}
                      <div className="relative" ref={langContainerRef}>
                        <button
                          onClick={() => setShowLangConfirm(!showLangConfirm)}
                          title={lang === 'id' ? "Switch to English" : "Ubah ke Bahasa Indonesia"}
                          className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer select-none flex items-center gap-1 ${
                            theme === 'dark' 
                              ? 'border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
                          } ${showLangConfirm ? (theme === 'dark' ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-900 border-slate-300') : ''}`}
                        >
                          <Globe className="w-3 h-3 text-emerald-500" />
                          <span className="tracking-wide uppercase">{lang}</span>
                        </button>

                        <AnimatePresence>
                          {showLangConfirm && (
                            <motion.div
                              initial={{ y: -10, scaleX: 0.95, scaleY: 0.95, opacity: 0 }}
                              animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
                              exit={{ y: -10, scaleX: 0.95, scaleY: 0.95, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className={`absolute top-full right-0 mt-2 p-4 rounded-xl border shadow-xl z-50 min-w-[260px] max-w-[300px] ${
                                theme === 'dark'
                                  ? 'bg-slate-950 text-slate-100 border-slate-800 shadow-black/60'
                                  : 'bg-white text-slate-800 border-slate-200 shadow-slate-200/60'
                              }`}
                            >
                              {/* Upward tiny triangle anchor */}
                              <div className={`absolute right-6 bottom-full w-2.5 h-2.5 rotate-45 border-t border-l -mb-1.5 ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                              }`} />

                              <div className="flex flex-col gap-3">
                                <p className="text-xs font-medium leading-relaxed">
                                  {lang === 'id' 
                                    ? "Yakin ingin mengubah bahasa ke Bahasa Inggris?" 
                                    : "Are you sure you want to change the language to Indonesian?"
                                  }
                                </p>
                                <div className="flex justify-end gap-2 mt-1">
                                  <button
                                    onClick={() => setShowLangConfirm(false)}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                      theme === 'dark'
                                        ? 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800'
                                        : 'text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                  >
                                    {lang === 'id' ? "Batal" : "Cancel"}
                                  </button>
                                  <button
                                    onClick={handleConfirmLanguageChange}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer"
                                  >
                                    {lang === 'id' ? "Ya, Ganti" : "Yes, Change"}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Dynamic Theme Toggle Icon */}
                      <button
                        onClick={(e) => toggleThemeWithAnimation(theme === 'dark' ? 'light' : 'dark', e)}
                        title={theme === 'dark' ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer select-none border border-transparent ${
                          theme === 'dark' 
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800 hover:border-slate-700' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* MOBILE VIEW */}
                  <div className="flex md:hidden items-center justify-between w-full h-11">
                    {/* Active menu category tag */}
                    <span className="text-xs font-mono font-bold tracking-wider text-emerald-500 uppercase flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {activeSection}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Language Switcher Toggle for Mobile */}
                      <div className="relative" ref={langContainerRefMobile}>
                        <button
                          onClick={() => setShowLangConfirm(!showLangConfirm)}
                          title={lang === 'id' ? "Switch to English" : "Ubah ke Bahasa Indonesia"}
                          className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer select-none flex items-center gap-1 ${
                            theme === 'dark' 
                              ? 'border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
                          } ${showLangConfirm ? (theme === 'dark' ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-900 border-slate-300') : ''}`}
                        >
                          <Globe className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="tracking-wide uppercase text-[10px]">{lang}</span>
                        </button>

                        <AnimatePresence>
                          {showLangConfirm && (
                            <motion.div
                              initial={{ y: -10, scaleX: 0.95, scaleY: 0.95, opacity: 0 }}
                              animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
                              exit={{ y: -10, scaleX: 0.95, scaleY: 0.95, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className={`absolute top-full right-0 mt-2 p-4 rounded-xl border shadow-xl z-50 min-w-[260px] max-w-[300px] ${
                                theme === 'dark'
                                  ? 'bg-slate-950 text-slate-100 border-slate-800 shadow-black/60'
                                  : 'bg-white text-slate-800 border-slate-200 shadow-slate-200/60'
                              }`}
                            >
                              {/* Upward tiny triangle anchor */}
                              <div className={`absolute right-6 bottom-full w-2.5 h-2.5 rotate-45 border-t border-l -mb-1.5 ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                              }`} />

                              <div className="flex flex-col gap-3">
                                <p className="text-xs font-medium leading-relaxed">
                                  {lang === 'id' 
                                    ? "Yakin ingin mengubah bahasa ke Bahasa Inggris?" 
                                    : "Are you sure you want to change the language to Indonesian?"
                                  }
                                </p>
                                <div className="flex justify-end gap-2 mt-1">
                                  <button
                                    onClick={() => setShowLangConfirm(false)}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                      theme === 'dark'
                                        ? 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800'
                                        : 'text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                  >
                                    {lang === 'id' ? "Batal" : "Cancel"}
                                  </button>
                                  <button
                                    onClick={handleConfirmLanguageChange}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer"
                                  >
                                    {lang === 'id' ? "Ya, Ganti" : "Yes, Change"}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Theme Toggle Icon for Mobile */}
                      <button
                        onClick={(e) => toggleThemeWithAnimation(theme === 'dark' ? 'light' : 'dark', e)}
                        title={theme === 'dark' ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer select-none border border-transparent ${
                          theme === 'dark' 
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      </button>

                      {/* Hamburger Button */}
                      <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer select-none border ${
                          theme === 'dark' 
                            ? 'border-slate-800 text-emerald-400 hover:bg-slate-850 hover:text-white' 
                            : 'border-slate-200 text-emerald-600 hover:bg-slate-50 hover:text-emerald-700'
                        }`}
                        title="Menu"
                      >
                        {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Mobile menu dropdown */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`md:hidden w-full mt-2 rounded-2xl overflow-hidden border backdrop-blur-lg ${
                      theme === 'dark'
                        ? 'bg-slate-900/95 border-slate-800 text-white shadow-xl shadow-black/40'
                        : 'bg-white/95 border-slate-200 text-slate-800 shadow-lg shadow-slate-100/60'
                    }`}
                  >
                    <div className="flex flex-col p-3 gap-1.5">
                      {['home', 'projects', 'skills', 'experience', 'contact'].map((section) => {
                        const active = activeSection === section;
                        return (
                          <button
                            key={section}
                            onClick={() => {
                              scrollToSection(section);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left font-sans text-xs uppercase tracking-widest font-bold py-3 px-4 rounded-xl transition-all cursor-pointer border flex items-center justify-between ${
                              active
                                ? (theme === 'dark'
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                    : 'text-emerald-700 bg-emerald-500/10 border-emerald-500/10')
                                : (theme === 'dark'
                                    ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04]'
                                    : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-black/[0.03]')
                            }`}
                          >
                            <span>{section}</span>
                            {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>

          {/* Floating Down-Arrow button to show Nav when hidden */}
          <div
            className="hidden md:block fixed top-0 z-50 pointer-events-none"
            style={{
              right: `${navbarRight + navbarWidth / 2}px`,
              transform: 'translateX(50%)'
            }}
          >
            <AnimatePresence>
              {!isNavVisible && (
                <motion.button
                  key="reveal-nav-arrow"
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsNavVisible(true);
                    lastScrollY.current = window.scrollY + 150; // Delay next scroll hide
                  }}
                  className={`pointer-events-auto w-12 h-6 md:w-16 md:h-8 flex items-center justify-center rounded-b-full rounded-t-none border-t-0 border-x border-b shadow-md backdrop-blur-md cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#0f172a]/95 border-slate-800 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/80 shadow-black/40'
                      : 'bg-white/95 border-slate-200 text-emerald-600 hover:text-emerald-700 hover:bg-slate-50/80 shadow-slate-100/60'
                  }`}
                  title="Tampilkan Navigasi"
                >
                  <ChevronsDown className="w-3 h-3 md:w-4 md:h-4 translate-y-[-1px] md:translate-y-[-2px]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE VIEW NAVIGATION - FULL-WIDTH HEADER BAR */}
          <div className={`md:hidden fixed left-0 right-0 w-full z-50 ${
            isPreviewMode ? 'top-10' : 'top-0'
          }`}>
            {/* Header Box Container - White Container with shadow */}
            <div className={`relative z-10 flex items-center justify-between px-4 h-14 border-b shadow-sm transition-colors duration-250 ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
            style={
              theme === 'dark' 
                ? (activeCVData.webTexts?.navbar_bg_color_dark ? { backgroundColor: activeCVData.webTexts.navbar_bg_color_dark } : undefined)
                : (activeCVData.webTexts?.navbar_bg_color ? { backgroundColor: activeCVData.webTexts.navbar_bg_color } : undefined)
            }
            >
              {/* Left Section: Menu icon on the far left, followed by the static "Portfolio" text */}
              <div className="flex items-center gap-2">
                {/* Hamburger Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`p-1 flex items-center justify-center transition-colors cursor-pointer select-none ${
                    theme === 'dark' ? 'text-slate-200 hover:text-emerald-400' : 'text-slate-800 hover:text-emerald-600'
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </button>

                {/* Static Portfolio Title */}
                <span className={`font-sans font-black tracking-widest text-xs uppercase ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  Portfolio
                </span>
              </div>

              {/* Configurations on Right */}
              <div className="flex items-center gap-2">
                {/* Language button */}
                <div ref={langContainerRefMobile} className="relative flex items-center">
                  <button
                    onClick={() => setShowLangConfirm(!showLangConfirm)}
                    className={`p-1 flex items-center justify-center text-[9px] font-mono font-black uppercase transition-colors cursor-pointer select-none ${
                      theme === 'dark' ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-800 hover:text-emerald-600'
                    }`}
                    title={lang === 'id' ? 'Ubah Bahasa' : 'Change Language'}
                  >
                    <span>{lang}</span>
                  </button>

                  <AnimatePresence>
                    {showLangConfirm && (
                      <motion.div
                        initial={{ y: 5, scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 5, scale: 0.95, opacity: 0 }}
                        className={`absolute top-full right-0 mt-2 p-3 rounded-xl border shadow-xl z-50 w-48 ${
                          theme === 'dark'
                            ? 'bg-slate-950 text-slate-100 border-slate-800 shadow-black/80'
                            : 'bg-white text-slate-850 border-slate-200 shadow-slate-200/80'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-medium leading-relaxed">
                            {lang === 'id'
                              ? "Ganti ke Bahasa Inggris?"
                              : "Change to Indonesian?"}
                          </p>
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setShowLangConfirm(false)}
                              className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                                theme === 'dark'
                                  ? 'text-slate-400 hover:text-white bg-slate-900'
                                  : 'text-slate-500 hover:text-slate-800 bg-slate-50'
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                handleConfirmLanguageChange();
                                setMobileMenuOpen(false);
                              }}
                              className="px-2 py-1 rounded-md text-[9px] font-bold bg-emerald-600 text-white cursor-pointer"
                            >
                              {lang === 'id' ? "Ya" : "Yes"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Theme Toggle Button */}
                <button
                  onClick={(e) => {
                    toggleThemeWithAnimation(theme === 'dark' ? 'light' : 'dark', e);
                  }}
                  className={`p-1 flex items-center justify-center transition-colors cursor-pointer select-none ${
                    theme === 'dark' ? 'text-slate-200 hover:text-yellow-400' : 'text-slate-800 hover:text-emerald-600'
                  }`}
                  title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-yellow-500 hover:text-yellow-600" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-600 hover:text-slate-950" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu Left Drawer */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  {/* Backdrop Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
                  />

                  {/* Sidebar Drawer */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`fixed top-0 left-0 h-[100dvh] w-[60%] min-w-[220px] max-w-[280px] z-50 p-5 shadow-2xl flex flex-col justify-between border-r overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-slate-950/98 border-slate-800 text-white'
                        : 'bg-white/98 border-slate-200 text-slate-800'
                    }`}
                    style={
                      theme === 'dark'
                        ? (activeCVData.webTexts?.navbar_bg_color_dark ? { backgroundColor: activeCVData.webTexts.navbar_bg_color_dark } : undefined)
                        : (activeCVData.webTexts?.navbar_bg_color ? { backgroundColor: activeCVData.webTexts.navbar_bg_color } : undefined)
                    }
                  >
                    <div>
                      {/* Drawer Header */}
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                        <span className={`font-sans font-black tracking-widest text-xs uppercase ${
                          theme === 'dark' ? 'text-white' : 'text-slate-950'
                        }`}>
                          Portfolio
                        </span>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            theme === 'dark' ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Navigation links */}
                      <div className="flex flex-col gap-1.5">
                        {['home', 'projects', 'skills', 'experience', 'contact'].map((section) => {
                          const active = activeSection === section;
                          const getIcon = (sec: string) => {
                            switch(sec) {
                              case 'home': return <Home className="w-4 h-4" />;
                              case 'projects': return <LayoutGrid className="w-4 h-4" />;
                              case 'skills': return <Award className="w-4 h-4" />;
                              case 'experience': return <Briefcase className="w-4 h-4" />;
                              case 'contact': return <MessageCircle className="w-4 h-4" />;
                              default: return null;
                            }
                          };
                          return (
                            <button
                              key={section}
                              onClick={() => {
                                scrollToSection(section);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer border flex items-center justify-between ${
                                active
                                  ? (theme === 'dark'
                                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                      : 'text-emerald-700 bg-emerald-500/10 border-emerald-500/10')
                                  : (theme === 'dark'
                                      ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04]'
                                      : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-black/[0.03]')
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                {getIcon(section)}
                                {section}
                              </span>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer inside drawer */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 text-center">
                        © 2026 {activeCVData.name || 'Portfolio'}
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* 2. MAIN GRID LAYOUT CONTENT */}
      <main className={`flex-grow ${isPreviewMode ? 'pt-10' : 'pt-0'}`}>
        <AnimatePresence mode="wait">
          {aboutSubPage ? (
            <AboutMeSubPages 
              key={`subpage-${aboutSubPage}`}
              subPage={aboutSubPage}
              cvData={activeCVData}
              theme={theme}
              lang={lang}
              onBackToStory={() => {
                navigateToPath('about-me');
              }}
            />
          ) : isStoryView ? (
            <AboutMeStoryPage 
              key="story-main"
              cvData={activeCVData}
              theme={theme}
              onBackToMain={() => scrollToSection('home')}
              onGoToProjects={() => scrollToSection('projects')}
              onNavigateSubpage={(sub) => {
                navigateToPath(sub);
              }}
            />
          ) : (
            <motion.div
              key="home-main-sections"
              ref={(node) => {
                if (node) {
                  const parsed = parseRoute();
                  // Scroll to top instantly if no deep section anchor is active
                  if (!parsed.activeSection || parsed.activeSection === 'home') {
                    window.scrollTo(0, 0);
                  }
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
            {/* HERO HERO SECTION */}
        <section id="home" className={`relative min-h-[90vh] flex items-center overflow-hidden border-b transition-colors duration-250 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
        style={
          theme === 'dark'
            ? { backgroundColor: activeCVData.webTexts?.home_bg_color_dark || activeCVData.webTexts?.hero_bg_color_dark || activeCVData.webTexts?.theme_bg_color_dark }
            : { backgroundColor: activeCVData.webTexts?.home_bg_color || activeCVData.webTexts?.hero_bg_color || activeCVData.webTexts?.theme_bg_color_light }
        }
        >
          {/* SECTION GRADIENT SHADOW OVERLAY */}
          <SectionGradientShadow 
            sectionKey="home" 
            webTexts={activeCVData.webTexts} 
            theme={theme} 
            accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
          />
          {/* BACKGROUND CUSTOMIZER OVERLAYS */}
          <BackgroundTextures 
            type={activeCVData.webTexts?.home_bg_style || 'dots'} 
            theme={theme} 
            opacity={activeCVData.webTexts?.home_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.home_bg_pattern_opacity) : (activeCVData.webTexts?.home_bg_custom_opacity ? parseFloat(activeCVData.webTexts.home_bg_custom_opacity) : undefined)}
            scale={activeCVData.webTexts?.home_bg_pattern_scale ? parseFloat(activeCVData.webTexts.home_bg_pattern_scale) : undefined}
            color={activeCVData.webTexts?.home_bg_pattern_color || undefined}
            customSvg={activeCVData.webTexts?.home_bg_custom_svg || activeCVData.webTexts?.home_custom_svg || activeCVData.webTexts?.hero_bg_custom_svg || undefined}
            customBgUrl={activeCVData.webTexts?.home_bg_custom_url || activeCVData.webTexts?.home_custom_url || undefined}
          />
          {/* FLOATING DECORATIVE ASSETS OVERLAY */}
          <FloatingAssetsOverlay sectionId="home" assets={activeCVData.floatingAssets} />
          
          <div 
            className="max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:py-8 lg:py-10 grid grid-cols-1 md:grid-cols-12 gap-x-4 lg:gap-x-6 xl:gap-x-8 gap-y-8 md:gap-y-0 items-center text-center md:text-left relative w-full min-h-[calc(100vh-4rem)] flex-1"
            style={{
              gridTemplateAreas: isMobile 
                ? `"title" "image"` 
                : `"title title title title title image image image image badge badge badge"`,
              gridTemplateRows: isMobile 
                ? "auto auto" 
                : "1fr",
            }}
          >
            {/* 1. Greeting, Title/Judul, Description & CTA Buttons (Fluid Responsive Sizing) */}
            <div style={{ gridArea: 'title' }} className="text-center md:text-left flex flex-col justify-center max-w-3xl md:max-w-none relative z-20">
              {/* HELLO, I'M [NAMA KAMU] Text - Animasi Typing dengan Font VT323 - Fluid Dynamic Scaling */}
              <motion.div 
                initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.4 : 0.5, delay: isMobile ? 0.05 : 0.15, ease: "easeOut" }}
                className={`font-bold text-[clamp(1.25rem,2.5vw,3rem)] tracking-widest uppercase mb-1 sm:mb-2 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}
                style={{ fontFamily: "'VT323', monospace" }}
              >
                <TypewriterText name={activeCVData.nickname || activeCVData.name || "ZUFA"} lang={lang} />
              </motion.div>
              
              {/* Main Title (misal Junior Data Analyst) - Mepet ke bawah dengan deskripsi - Fluid Responsive */}
              <motion.h1 
                initial={{ opacity: 0, y: isMobile ? 12 : 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.45 : 0.6, delay: isMobile ? 0.1 : 0.25, ease: "easeOut" }}
                className={`font-sans font-black text-[clamp(1.75rem,4.2vw,4.75rem)] leading-[1.08] tracking-tight mb-2 sm:mb-3 md:mb-4 transition-colors duration-200 max-w-3xl md:max-w-none ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {(activeCVData.webTexts?.hero_title || "Transforming Raw Data\ninto Business Decisions").split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </motion.h1>

              {/* Description/Deskripsi - Fluid Responsive */}
              <motion.p 
                initial={{ opacity: 0, y: isMobile ? 12 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.45 : 0.6, delay: isMobile ? 0.15 : 0.35, ease: "easeOut" }}
                className={`font-sans text-[clamp(0.875rem,1.15vw,1.2rem)] mb-5 md:mb-7 leading-relaxed text-justify md:text-left whitespace-pre-line transition-colors duration-200 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <span>
                  {activeCVData.webTexts?.hero_subtitle || "Specialized in high-impact insights through custom SQL engines, Python workflows, and advanced Business Intelligence."}
                </span>
              </motion.p>

              {/* Tombol Action CTA - Dua Tombol Modern */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: isMobile ? 0.2 : 0.4, ease: "easeOut" }}
                className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center md:justify-start"
              >
                {/* Tombol Utama - Biru Solid "Hubungi Saya" */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`font-sans font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg flex items-center gap-2 transition-all duration-250 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 select-none ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Hubungi Saya</span>
                </button>
                
                {/* Tombol Sekunder - Biru Solid "Download Resume" - Warna Putih */}
                <button
                  onClick={() => {
                    const isMobileViewport = isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);
                    setCvModalDirectDownload(isMobileViewport);
                    setCvModalOpen(true);
                  }}
                  className={`font-sans font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg flex items-center gap-2 transition-all duration-250 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 select-none ${
                    theme === 'dark' 
                      ? 'bg-white hover:bg-slate-100 text-slate-900 shadow-slate-100/20' 
                      : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-slate-200/40'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Download Resume</span>
                </button>
              </motion.div>
            </div>

            {/* 2. Image/Gambar - RESPONSIVE CONTAINER & DYNAMIC SCALING */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              style={{ gridArea: 'image' }}
              className="relative z-5 pointer-events-none flex items-center justify-center w-full min-h-[290px] sm:min-h-[350px] md:min-h-[390px] lg:min-h-[470px] xl:min-h-[570px] 2xl:min-h-[670px] my-4 md:my-0"
            >
              {/* SVG Lingkaran dengan Gradasi Radial - Dynamic Theme-Customizable Sphere Effect Responsif */}
              {(() => {
                const circleConfig = getHeroCircleColors(activeCVData, theme);
                return (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-1/2 top-1/2 pointer-events-none z-0 w-[270px] h-[270px] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] lg:w-[440px] lg:h-[440px] xl:w-[540px] xl:h-[540px] 2xl:w-[650px] 2xl:h-[650px] max-w-none transition-all duration-300 ease-out" 
                    viewBox="0 0 500 500"
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      opacity: circleConfig.opacity,
                      transform: `translate(-50%, -50%) scale(${(activeCVData as any).homeImageCircleScale ?? 1}) translate(${((activeCVData as any).homeImageCircleX ?? 0) * 2}px, ${((activeCVData as any).homeImageCircleY ?? 0) * 2}px)`
                    }}
                  >
                    <defs>
                      <radialGradient id="heroCircleSphere" cx="42%" cy="38%" r="55%" fx="42%" fy="38%">
                        <stop offset="0%" stopColor={circleConfig.start} />
                        <stop offset="50%" stopColor={circleConfig.mid} />
                        <stop offset="100%" stopColor={circleConfig.end} />
                      </radialGradient>
                      <linearGradient id="heroCircleLinear" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={circleConfig.start} />
                        <stop offset="100%" stopColor={circleConfig.end} />
                      </linearGradient>
                    </defs>
                    <circle 
                      cx="250" 
                      cy="250" 
                      r="220" 
                      fill={circleConfig.style === 'linear' ? "url(#heroCircleLinear)" : circleConfig.style === 'flat' ? circleConfig.start : "url(#heroCircleSphere)"}
                      stroke={circleConfig.style === 'outline' ? circleConfig.start : 'none'}
                      strokeWidth={circleConfig.style === 'outline' ? 8 : 0}
                    />
                  </svg>
                );
              })()}
              
              {/* Image - Dynamic responsive scaling across mobile, laptop, desktop, and large displays */}
              {currentProfileImageUrl && (
                <img 
                  className={`absolute left-1/2 top-1/2 pointer-events-auto cursor-pointer transition-all duration-700 ease-out select-none w-[270px] h-[270px] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] lg:w-[440px] lg:h-[440px] xl:w-[540px] xl:h-[540px] 2xl:w-[650px] 2xl:h-[650px] max-w-none ${
                    isPng ? 'object-contain' : 'object-cover'
                  }`}
                  onClick={() => scrollToSection('profil')}
                  title="Buka Halaman Tentang Saya (Story)"
                  referrerPolicy="no-referrer"
                  alt="Professional Portfolio Visual" 
                  src={currentProfileImageUrl}
                  style={{
                    transform: `translate(-50%, -50%) scale(${activeCVData.homeImageScale || 1}) translate(${(activeCVData.homeImageX || 0) * 3.75}px, ${(activeCVData.homeImageY || 0) * 3.75}px)`,
                    transformOrigin: 'center center',
                    opacity: 1 - ((activeCVData as any).homeImageFade ?? 0),
                    maskImage: (() => {
                      const maskStyle = activeCVData.webTexts?.home_image_mask_style || 'normal';
                      const fadeDepth = activeCVData.webTexts?.home_image_fade_depth || '66';
                      const fadeWidth = activeCVData.webTexts?.home_image_fade_width || '84';
                      if (maskStyle === 'fade_bottom') {
                        return `linear-gradient(to bottom, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
                      } else if (maskStyle === 'fade_circle') {
                        return `radial-gradient(circle, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
                      } else if (maskStyle === 'fade_edge') {
                        return `radial-gradient(ellipse, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
                      }
                      return 'none';
                    })(),
                    WebkitMaskImage: (() => {
                      const maskStyle = activeCVData.webTexts?.home_image_mask_style || 'normal';
                      const fadeDepth = activeCVData.webTexts?.home_image_fade_depth || '66';
                      const fadeWidth = activeCVData.webTexts?.home_image_fade_width || '84';
                      if (maskStyle === 'fade_bottom') {
                        return `linear-gradient(to bottom, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
                      } else if (maskStyle === 'fade_circle') {
                        return `radial-gradient(circle, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
                      } else if (maskStyle === 'fade_edge') {
                        return `radial-gradient(ellipse, black ${fadeDepth}%, transparent ${fadeWidth}%)`;
                      }
                      return 'none';
                    })()
                  }}
                />
              )}
            </motion.div>

            {/* 3. Badge Informasi di Sebelah Kanan - Open to Work, Tahun, Lokasi (Posisi agak ke bawah) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              style={{ gridArea: 'badge' }}
              className="hidden md:flex flex-col gap-1.5 items-start text-left justify-start self-start pt-8 md:pt-10 lg:pt-14 xl:pt-20"
            >
              {/* OPEN TO WORK - Bold warna hitam/putih dengan fluid scaling */}
              <div className="flex items-center gap-1.5">
                <span className={`font-sans text-[clamp(0.75rem,1.1vw,1.15rem)] font-black uppercase tracking-[0.15em] italic transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  OPEN TO WORK
                </span>
              </div>
              
              {/* Tahun 2026 - Font Black Ops One, lebih besar dan bold fluid */}
              <span 
                className={`font-black text-[clamp(2.75rem,4.75vw,5.25rem)] leading-none transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
                style={{ fontFamily: "'Black Ops One', cursive" }}
              >
                2026
              </span>
              
              {/* Lokasi - Bold dan hitam/putih fluid */}
              <span className={`font-sans font-black text-[clamp(0.875rem,1.2vw,1.35rem)] italic uppercase tracking-wider transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {activeCVData.location || "Indonesia"}
              </span>
            </motion.div>
          </div>
        </section>


        {/* CASE STUDIES VIEW SECTION */}
        <section id="projects" className={`py-20 border-b transition-colors duration-250 relative overflow-hidden ${
          theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
        style={
          theme === 'dark'
            ? { backgroundColor: activeCVData.webTexts?.projects_bg_color_dark }
            : { backgroundColor: activeCVData.webTexts?.projects_bg_color }
        }
        >
          {/* SECTION GRADIENT SHADOW OVERLAY */}
          <SectionGradientShadow 
            sectionKey="projects" 
            webTexts={activeCVData.webTexts} 
            theme={theme} 
            accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
          />
          {/* SECTION BACKGROUND OVERLAY */}
          {activeCVData.webTexts?.projects_bg_style && activeCVData.webTexts.projects_bg_style !== 'none' && (
            <BackgroundTextures 
              type={activeCVData.webTexts.projects_bg_style} 
              theme={theme} 
              opacity={activeCVData.webTexts.projects_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.projects_bg_pattern_opacity) : undefined}
              scale={activeCVData.webTexts.projects_bg_pattern_scale ? parseFloat(activeCVData.webTexts.projects_bg_pattern_scale) : undefined}
              color={activeCVData.webTexts.projects_bg_pattern_color || undefined}
              customSvg={activeCVData.webTexts.projects_bg_custom_svg || undefined}
              customBgUrl={activeCVData.webTexts.projects_bg_custom_url || undefined}
            />
          )}
          {/* FLOATING DECORATIVE ASSETS OVERLAY */}
          <FloatingAssetsOverlay sectionId="projects" assets={activeCVData.floatingAssets} />
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <h2 className={`font-sans font-extrabold text-xl md:text-4xl tracking-tight transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {activeCVData.webTexts?.projects_title || "Selected Case Studies"}
                </h2>
                <p className={`font-sans text-xs sm:text-base mt-2 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {activeCVData.webTexts?.projects_subtitle || "A structured demonstration of technical proficiency across the entire data deployment stack, highlighting real performance audits."}
                </p>
              </motion.div>
            </div>

            {/* Case Studies Container and Side Button */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
              <div className="flex-1 min-w-0">
                {/* Case Studies Cards Grid */}
                <div className={`${(!activeCVData.caseStudies || activeCVData.caseStudies.length === 0) ? 'grid grid-cols-1' : 'flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 snap-x snap-proximity no-scrollbar pb-4 md:pb-0'} gap-6 sm:gap-8`}>
              {!activeCVData.caseStudies || activeCVData.caseStudies.length === 0 ? (
                <div className={`p-8 rounded-xl text-center transition-all ${
                  theme === 'dark' ? 'bg-slate-800 border-none text-slate-300' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
                }`}
                style={
                  theme === 'dark'
                    ? (activeCVData.webTexts?.projects_card_bg_color_dark ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color_dark } : undefined)
                    : (activeCVData.webTexts?.projects_card_bg_color ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color } : undefined)
                }
                >
                  <Database className="w-10 h-10 text-emerald-500 mx-auto mb-4 shrink-0" />
                  <h3 className="font-sans font-bold text-lg mb-2">Belum ada Proyek</h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed mb-4">
                    Belum ada proyek/case studies yang tersimpan. Klik ikon database hijau (Admin Panel) di pojok kanan atas untuk login dan membuat proyek pertama Anda!
                  </p>
                </div>
              ) : (
                (() => {
                  const allProjs = activeCVData.caseStudies || [];
                  const homeFeaturedProjects = (() => {
                    try {
                      const val = activeCVData.webTexts?.featured_project_ids;
                      if (val) {
                        const ids = JSON.parse(val);
                        if (Array.isArray(ids) && ids.length > 0) {
                          return ids.map(id => allProjs.find(p => p.id === id)).filter(Boolean) as typeof allProjs;
                        }
                      }
                    } catch (e) {}
                    return allProjs.slice(0, 3);
                  })();

                  const mappedCards = homeFeaturedProjects.map((study, idx) => (
                  <motion.div 
                    key={study.id} 
                    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.05 }}
                    transition={isMobile ? { duration: 0 } : { duration: 0.7, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={isMobile ? undefined : { y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                    onClick={() => {
                      const url = study.projectUrl || 'https://github.com';
                      window.open(url, '_blank');
                    }}
                    className={`bento-card rounded-xl overflow-hidden p-5 flex flex-col justify-between group transition-all cursor-pointer relative shrink-0 w-[82vw] sm:w-[380px] md:w-auto snap-center md:snap-align-none ${
                      theme === 'dark' ? 'bg-slate-800 border-none hover:border-emerald-500/40' : 'bg-white border border-slate-200/80 hover:border-emerald-500/30 hover:shadow-lg'
                    }`}
                    style={
                      theme === 'dark'
                        ? (activeCVData.webTexts?.projects_card_bg_color_dark ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color_dark } : undefined)
                        : (activeCVData.webTexts?.projects_card_bg_color ? { backgroundColor: activeCVData.webTexts.projects_card_bg_color } : undefined)
                    }
                    title="Click to open project link"
                  >
                    <div className={`absolute top-2.5 right-2.5 z-40 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-lg leading-none flex items-center gap-1 border shadow-xs backdrop-blur-xs transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-slate-800/90 text-slate-200 border-slate-700/50 hover:bg-slate-700'
                        : 'bg-slate-50/90 text-slate-700 border-slate-200/50 hover:bg-slate-100'
                    }`}>
                      <ExternalLink className="w-3 h-3" />
                      <span>OPEN</span>
                    </div>

                    <div>
                      <div className={`aspect-[16/10] mb-4 overflow-hidden rounded border transition-colors duration-200 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <img 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out grayscale-[10%]" 
                          referrerPolicy="no-referrer"
                          alt={study.title} 
                          src={study.image}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {study.tags.slice(0, 2).map((tg, i) => (
                          <span key={i} className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border transition-colors duration-200 ${
                            theme === 'dark' ? 'bg-slate-850 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {tg}
                          </span>
                        ))}
                      </div>

                      <h3 className={`font-sans font-extrabold text-sm sm:text-lg tracking-tight mb-2 leading-tight transition-colors duration-200 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-950'
                      }`}>
                        {study.title}
                      </h3>
                      
                      <p className={`text-[11px] sm:text-sm leading-relaxed mb-6 transition-colors duration-200 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {study.description}
                      </p>
                    </div>

                    <div className={`pt-4 border-t flex justify-end items-center transition-colors duration-200 ${
                      theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
                    }`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToSection('contact');
                        }}
                        className={`text-xs font-bold inline-flex items-center gap-1 cursor-pointer hover:underline transition-colors select-none ${
                          theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                        }`}
                      >
                        Discuss Project
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                  ));

                  return (
                    <>
                      {mappedCards}
                      {activeCVData.caseStudies && activeCVData.caseStudies.length > 0 && (
                        <div className="md:hidden flex items-center justify-center shrink-0 pr-4 snap-center pl-2">
                          <button
                            onClick={() => {
                              navigateToPath('projects');
                            }}
                            title={lang === 'id' ? 'Lihat Semua Projek' : 'View All Projects'}
                            className={`flex flex-col items-center justify-center gap-2 w-[54px] h-[180px] rounded-xl border cursor-pointer select-none shrink-0 ${
                              theme === 'dark'
                                ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700 shadow-md'
                                : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
                            }`}
                          >
                            <ArrowRight className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                            <span 
                              className="font-mono text-[9px] font-bold tracking-widest uppercase text-center leading-none"
                              style={{ writingMode: 'vertical-lr' }}
                            >
                              {lang === 'id' ? 'SEMUA PROYEK' : 'ALL PROJECTS'}
                            </span>
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
                </div>
              </div>

              {/* The elegant view all projects button beside the project cards container */}
              {activeCVData.caseStudies && activeCVData.caseStudies.length > 0 && (
                <div className="hidden md:flex justify-center items-center shrink-0 w-full lg:w-auto">
                  <motion.button
                    onMouseEnter={() => setIsAllProjectsHovered(true)}
                    onMouseLeave={() => setIsAllProjectsHovered(false)}
                    onClick={() => {
                      navigateToPath('projects');
                    }}
                    title={lang === 'id' ? 'Lihat Semua Projek' : 'View All Projects'}
                    animate={{
                      height: isAllProjectsHovered ? 256 : 64,
                      width: isAllProjectsHovered ? (window.innerWidth >= 1024 ? 64 : 180) : 64,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`flex flex-col items-center justify-center gap-3 rounded-xl border cursor-pointer select-none shrink-0 overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
                    }`}
                  >
                    <ArrowRight className={`w-5 h-5 transition-transform duration-300 shrink-0 ${isAllProjectsHovered ? 'rotate-90' : ''}`} />
                    
                    <AnimatePresence>
                      {isAllProjectsHovered && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="font-mono text-[9px] font-bold tracking-widest uppercase text-center select-none shrink-0 leading-none block whitespace-nowrap"
                          style={{ writingMode: window.innerWidth >= 1024 ? 'vertical-lr' : 'horizontal-tb' }}
                        >
                          {lang === 'id' ? 'SEMUA PROYEK' : 'ALL PROJECTS'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              )}
            </div>

          </div>
        </section>


        {/* TECHNICAL ARSENAL SECTION */}
        <section id="skills" className={`py-20 border-b transition-colors duration-250 relative overflow-hidden ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
        style={
          theme === 'dark'
            ? { backgroundColor: activeCVData.webTexts?.skills_bg_color_dark }
            : { backgroundColor: activeCVData.webTexts?.skills_bg_color }
        }
        >
          {/* SECTION GRADIENT SHADOW OVERLAY */}
          <SectionGradientShadow 
            sectionKey="skills" 
            webTexts={activeCVData.webTexts} 
            theme={theme} 
            accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
          />
          {/* SECTION BACKGROUND OVERLAY */}
          {activeCVData.webTexts?.skills_bg_style && activeCVData.webTexts.skills_bg_style !== 'none' && (
            <BackgroundTextures 
              type={activeCVData.webTexts.skills_bg_style} 
              theme={theme} 
              opacity={activeCVData.webTexts.skills_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.skills_bg_pattern_opacity) : undefined}
              scale={activeCVData.webTexts.skills_bg_pattern_scale ? parseFloat(activeCVData.webTexts.skills_bg_pattern_scale) : undefined}
              color={activeCVData.webTexts.skills_bg_pattern_color || undefined}
              customSvg={activeCVData.webTexts.skills_bg_custom_svg || activeCVData.webTexts.skills_custom_svg || undefined}
              customBgUrl={activeCVData.webTexts.skills_bg_custom_url || activeCVData.webTexts.skills_custom_url || undefined}
            />
          )}
          {/* FLOATING DECORATIVE ASSETS OVERLAY */}
          <FloatingAssetsOverlay sectionId="skills" assets={activeCVData.floatingAssets} />
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <h2 className={`font-sans font-extrabold text-xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {activeCVData.webTexts?.skills_title || "Technical Arsenal"}
              </h2>
              <p className={`font-sans text-xs sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {activeCVData.webTexts?.skills_subtitle || "Expertise and architectural know-how across relational SQL databases, mathematical script engines, and custom telemetry filters."}
              </p>
            </motion.div>

            <SkillsArsenal 
              skills={activeCVData.skills} 
              theme={theme} 
              customCategories={activeCVData.skillCategories}
              lang={lang}
              badgeText={activeCVData.webTexts?.skills_badge}
              groupDesc={activeCVData.webTexts?.skills_home_group_desc}
              onNavigateToAboutMe={() => navigateToPath('skills')}
            />
          </div>
        </section>

        {/* CHRONOLOGY timeline SECTION */}
        <section id="experience" className={`py-12 sm:py-20 border-b transition-colors duration-250 relative overflow-hidden ${
          theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
        style={
          theme === 'dark'
            ? { backgroundColor: activeCVData.webTexts?.experience_bg_color_dark }
            : { backgroundColor: activeCVData.webTexts?.experience_bg_color }
        }
        >
          {/* SECTION GRADIENT SHADOW OVERLAY */}
          <SectionGradientShadow 
            sectionKey="experience" 
            webTexts={activeCVData.webTexts} 
            theme={theme} 
            accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
          />
          {/* SECTION BACKGROUND OVERLAY */}
          {activeCVData.webTexts?.experience_bg_style && activeCVData.webTexts.experience_bg_style !== 'none' && (
            <BackgroundTextures 
              type={activeCVData.webTexts.experience_bg_style} 
              theme={theme} 
              opacity={activeCVData.webTexts.experience_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.experience_bg_pattern_opacity) : undefined}
              scale={activeCVData.webTexts.experience_bg_pattern_scale ? parseFloat(activeCVData.webTexts.experience_bg_pattern_scale) : undefined}
              color={activeCVData.webTexts.experience_bg_pattern_color || undefined}
              customSvg={activeCVData.webTexts.experience_bg_custom_svg || activeCVData.webTexts.experience_custom_svg || undefined}
              customBgUrl={activeCVData.webTexts.experience_bg_custom_url || activeCVData.webTexts.experience_custom_url || undefined}
            />
          )}
          {/* FLOATING DECORATIVE ASSETS OVERLAY */}
          <FloatingAssetsOverlay sectionId="experience" assets={activeCVData.floatingAssets} />
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mb-6 sm:mb-12"
            >
              <h2 className={`font-sans font-extrabold text-xl md:text-4xl tracking-tight mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {activeCVData.webTexts?.experience_title || "Professional Journey"}
              </h2>
              <p className={`font-sans text-xs sm:text-base mt-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {activeCVData.webTexts?.experience_subtitle || "Proven experience designing databases, reporting frameworks, and pipelines inside rapid consumer spaces. Click to toggle bullet point summaries."}
              </p>
            </motion.div>

            {/* Timeline Cards */}
            <div className="space-y-3 sm:space-y-6 max-w-4xl xl:max-w-5xl">
              {!activeCVData.experiences || activeCVData.experiences.length === 0 ? (
                <div className={`p-8 rounded-xl border text-center transition-all ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}
                style={
                  theme === 'dark'
                    ? (activeCVData.webTexts?.experience_card_bg_color_dark ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color_dark } : undefined)
                    : (activeCVData.webTexts?.experience_card_bg_color ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color } : undefined)
                }
                >
                  <Database className="w-10 h-10 text-emerald-500 mx-auto mb-4 shrink-0" />
                  <h3 className="font-sans font-bold text-base mb-2">Belum ada Pengalaman Kerja</h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed text-slate-400">
                    Tambahkan riwayat pengalaman kerja baru Anda melalui Admin Panel di pojok kanan atas.
                  </p>
                </div>
              ) : (
                activeCVData.experiences.map((exp, expIdx) => {
                const isExpanded = expandedExperienceId === exp.id;
                return (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.7, delay: expIdx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.25, ease: "easeOut" } }}
                    onClick={() => setExpandedExperienceId(isExpanded ? null : exp.id)}
                    className={`bento-card p-3.5 sm:p-6 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      isExpanded 
                        ? 'border-emerald-500/45 shadow-sm bg-emerald-500/5' 
                        : (theme === 'dark' ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300')
                    }`}
                    style={
                      theme === 'dark'
                        ? (activeCVData.webTexts?.experience_card_bg_color_dark && !isExpanded ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color_dark } : undefined)
                        : (activeCVData.webTexts?.experience_card_bg_color && !isExpanded ? { backgroundColor: activeCVData.webTexts.experience_card_bg_color } : undefined)
                    }
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                      <div className="flex gap-3 sm:gap-4 items-center">
                        <div>
                          <span className="font-mono text-[10px] text-slate-400 font-bold block">
                            {exp.period}
                          </span>
                          <h4 className={`font-sans font-bold text-sm sm:text-lg transition-colors leading-tight ${
                            theme === 'dark' ? 'text-white' : 'text-slate-950'
                          }`}>
                            {exp.role} <span className="text-emerald-500 font-extrabold">@ {exp.company}</span>
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1 sm:pt-0">
                        {/* Render list of tags on role */}
                        <div className="hidden sm:flex flex-wrap gap-1">
                          {exp.tools?.map((tool, idx) => (
                            <span key={idx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border transition-colors ${
                              theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}>
                              {tool}
                            </span>
                          ))}
                        </div>

                        {/* toggle status indicators */}
                        {isExpanded ? (
                          <ChevronUp className="hidden sm:block w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="hidden sm:block w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Collapsible bullet list */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className={`overflow-hidden mt-3 sm:mt-5 pt-3 sm:pt-4 border-t text-xs sm:text-sm transition-colors ${
                            theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                          }`}
                        >
                          <ul className="space-y-1 sm:space-y-2">
                            {exp.bulletPoints.map((bullet, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="flex items-start gap-2.5"
                              >
                                <span className="w-2 h-2 rounded bg-emerald-500 shrink-0 mt-1.5" />
                                <span className="leading-relaxed text-justify w-full">{bullet}</span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* Mobile stack indicators */}
                          <div className={`flex sm:hidden flex-wrap gap-1 mt-3 pt-3 sm:mt-4 sm:pt-4 border-t ${
                            theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                          }`}>
                            {exp.tools?.map((tool, idx) => (
                              <span key={idx} className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border transition-colors ${
                                theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}>
                                {tool}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }))}
            </div>

          </div>
        </section>


        {/* DYNAMIC CONTACT MATRIX SECTION */}
        <section id="contact" className={`min-h-[85vh] flex items-center pt-32 pb-44 transition-colors relative overflow-hidden ${
          theme === 'dark' ? 'bg-[#111827] border-t border-slate-850' : 'bg-white'
        }`}
        style={
          theme === 'dark'
            ? { backgroundColor: activeCVData.webTexts?.contact_bg_color_dark }
            : { backgroundColor: activeCVData.webTexts?.contact_bg_color }
        }
        >
          {/* SECTION GRADIENT SHADOW OVERLAY */}
          <SectionGradientShadow 
            sectionKey="contact" 
            webTexts={activeCVData.webTexts} 
            theme={theme} 
            accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
          />
          {/* SECTION BACKGROUND OVERLAY */}
          {activeCVData.webTexts?.contact_bg_style && activeCVData.webTexts.contact_bg_style !== 'none' && (
            <BackgroundTextures 
              type={activeCVData.webTexts.contact_bg_style} 
              theme={theme} 
              opacity={activeCVData.webTexts.contact_bg_pattern_opacity ? parseFloat(activeCVData.webTexts.contact_bg_pattern_opacity) : undefined}
              scale={activeCVData.webTexts.contact_bg_pattern_scale ? parseFloat(activeCVData.webTexts.contact_bg_pattern_scale) : undefined}
              color={activeCVData.webTexts.contact_bg_pattern_color || undefined}
              customSvg={activeCVData.webTexts.contact_bg_custom_svg || activeCVData.webTexts.contact_custom_svg || undefined}
              customBgUrl={activeCVData.webTexts.contact_bg_custom_url || activeCVData.webTexts.contact_custom_url || undefined}
            />
          )}
          {/* FLOATING DECORATIVE ASSETS OVERLAY */}
          <FloatingAssetsOverlay sectionId="contact" assets={activeCVData.floatingAssets} />
          <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ContactForm 
              email={activeCVData.email} 
              location={activeCVData.location} 
              webTexts={activeCVData.webTexts} 
              lang={lang}
              theme={theme}
            />
          </div>
        </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. PROFESSIONAL FOOTER */}
      <footer className={`transition-colors duration-250 py-6 sm:py-10 border-t ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 text-slate-400' 
          : 'bg-white border-slate-200 text-slate-500'
      }`}
      style={
        theme === 'dark'
          ? (activeCVData.webTexts?.footer_bg_color_dark ? { backgroundColor: activeCVData.webTexts.footer_bg_color_dark } : undefined)
          : (activeCVData.webTexts?.footer_bg_color ? { backgroundColor: activeCVData.webTexts.footer_bg_color } : undefined)
      }
      >
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center sm:justify-start">
            <p className="font-mono text-[9px] sm:text-[10px] text-slate-500 text-center sm:text-left select-none">
              © 2026 {activeCVData.name || 'Portfolio'}. Released under MIT License.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Unified Social Media Icon Controls */}
            {(() => {
               const list = [...(activeCVData.customSocials || [])];

              return list
                .filter(s => (s.value || s.usernameOrUrl) && s.showOnWeb !== false)
                .map((s) => (
                  <SocialFooterButton key={s.id} s={s} theme={theme} />
                ));
            })()}
          </div>
        </div>
      </footer>

      {/* 4. MODALS PREVIEW DRAWER */}
      <AnimatePresence>
        {cvModalOpen && (
          <ResumeModal 
            onClose={() => setCvModalOpen(false)} 
            cvData={activeCVData} 
            onUpdate={(updated) => setCvData(updated)} 
            theme={theme}
            directDownload={cvModalDirectDownload}
          />
        )}
      </AnimatePresence>

      {/* 5. FLOATING PENCIL ACTION BUTTON & QUICK EDITOR DRAWER (PREVIEW MODE ONLY) */}
      {isPreviewMode && !isAdminView && (
        <>
          {/* Floating Pencil Button at Bottom-Right */}
          <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2">
            {!isQuickEditorOpen && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                type="button"
                onClick={() => setIsQuickEditorOpen(true)}
                className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-950/60 border-2 border-emerald-400/40 backdrop-blur-md cursor-pointer transition-all"
                title="Buka Visual Quick Editor (Edit tulisan halaman aktif langsung di sini)"
              >
                <Pencil className="w-5 h-5 transition-transform group-hover:rotate-12" />
                
                {/* Ping animation indicator */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-900"></span>
                </span>

                {/* Floating tooltip label on hover */}
                <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-slate-800">
                  ✏️ Quick Edit Halaman Aktif
                </span>
              </motion.button>
            )}
          </div>

          {/* Quick Editor Sidebar Drawer */}
          <QuickEditorDrawer
            isOpen={isQuickEditorOpen}
            onClose={() => setIsQuickEditorOpen(false)}
            cvData={cvData}
            onUpdateCV={(updated) => {
              setCvData(updated);
            }}
            currentLang={lang}
            activeSection={activeSection}
            aboutSubPage={aboutSubPage || undefined}
            isStoryView={isStoryView}
            activeProjectPresentationId={activeProjectPresentationId}
            theme={theme}
          />
        </>
      )}



        </motion.div>
      ))}
    </>
  );
}
