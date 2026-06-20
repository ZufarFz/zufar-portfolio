import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  Database,
  Palette,
  Eye,
  Settings,
  ArrowUp,
  ArrowDown,
  Layout,
  Type,
  Maximize2,
  Trash2,
  CloudLightning,
  Save,
  Check,
  Languages,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CVData, saveCVData, isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import SocialIcon, { getAbsoluteSocialUrl } from './SocialIcon';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ResumeModalProps {
  onKeepOpen?: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdate?: (updatedData: CVData) => void;
  theme?: 'light' | 'dark';
  inlinePreview?: boolean;
}

interface LayoutSettings {
  themeColor: 'emerald' | 'blue' | 'slate' | 'indigo' | 'rose' | 'amber';
  fontSize: 'compact' | 'standard' | 'comfortable';
  spacing: 'tight' | 'standard' | 'spacious';
  layoutStyle: 'left-sidebar' | 'right-sidebar' | 'single-column';
  fontFamily: 'sans' | 'serif' | 'mono';
  sectionOrder: string[]; // 'arsenal', 'education', 'experience', 'methodology'
  headerPhotoPosition?: 'left' | 'top';
  headerAlignment?: 'left' | 'center';
  headerContactPosition?: 'bottom' | 'right';
}

const getCircularBase64Image = (
  imgUrl: string, 
  scale: number = 1, 
  avatarX: number = 0, 
  avatarY: number = 0
): Promise<string> => {
  return new Promise((resolve) => {
    if (!imgUrl) {
      resolve('');
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 500; // Output standard high-res size
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.clip();
          
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);
          
          // Layout scaling: average preview box is ~80px-112px
          const scaleFactor = size / 112;
          
          const imgAspect = img.width / img.height;
          let drawW = size;
          let drawH = size;
          if (imgAspect > 1) {
            drawW = size * imgAspect;
          } else {
            drawH = size / imgAspect;
          }
          
          ctx.save();
          ctx.translate(size / 2, size / 2);
          ctx.translate(avatarX * scaleFactor, avatarY * scaleFactor);
          ctx.scale(scale, scale);
          
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
          
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          resolve(imgUrl);
        }
      } catch (err) {
        console.error("Gagal memotong gambar melingkar:", err);
        resolve(imgUrl);
      }
    };
    img.onerror = () => {
      resolve(imgUrl);
    };
  });
};

const ensureSafeColor = (value: string): string => {
  if (!value) return value;
  if (typeof value !== 'string') return value;
  if (value.includes('oklch') || value.includes('oklab') || value.includes('color(')) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = value;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      }
    } catch (e) {
      return '#000000';
    }
  }
  return value;
};

const DEFAULT_SETTINGS: LayoutSettings = {
  themeColor: 'emerald',
  fontSize: 'standard',
  spacing: 'standard',
  layoutStyle: 'left-sidebar',
  fontFamily: 'sans',
  sectionOrder: ['arsenal', 'education', 'experience', 'methodology'],
  headerPhotoPosition: 'left',
  headerAlignment: 'left',
  headerContactPosition: 'bottom'
};

export default function ResumeModal({ onClose, cvData, onUpdate, theme = 'light', inlinePreview = false }: ResumeModalProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  
  // Custom states
  // Forcing isEditorMode to always be false to respect user directive: "atur desain & tata letak pindah di halaman admin saja"
  const isEditorMode = false;
  const setIsEditorMode = (val: boolean) => {};
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  
  // Settings initialized with fallback to defaults
  const [settings, setSettings] = useState<LayoutSettings>(() => {
    const s = (cvData as any).layoutSettings;
    if (s && s.themeColor) {
      return {
        ...DEFAULT_SETTINGS,
        ...s,
        sectionOrder: s.sectionOrder || DEFAULT_SETTINGS.sectionOrder
      };
    }
    return { ...DEFAULT_SETTINGS };
  });

  // Keep settings automatically synchronized with parent data
  useEffect(() => {
    const s = (cvData as any).layoutSettings;
    if (s && s.themeColor) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...s,
        sectionOrder: s.sectionOrder || DEFAULT_SETTINGS.sectionOrder
      });
    } else {
      setSettings({ ...DEFAULT_SETTINGS });
    }
  }, [cvData]);

  const getAbsoluteUrl = (link: string, type: string) => {
    if (!link) return '';
    return getAbsoluteSocialUrl(link, type);
  };

  // Check if admin session is active on mount
  useEffect(() => {
    async function checkAdminSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setIsAdmin(true);
          }
        } catch (e) {
          console.error('Error checking active admin session in CV Modal:', e);
        }
      }
    }
    checkAdminSession();
  }, []);

  // Offline Direct Download of PDF format (High quality, real selectable text copyable vector)
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsDownloadingPdf(true);
    
    const element = resumeRef.current;
    
    try {
      // Create print container
      const printContainer = document.createElement('div');
      printContainer.className = 'print-only-container';
      
      // Clone the resume node to guarantee it preserves exact active themes and custom content
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Ensure the printable clone layout is responsive and scales perfectly to standard A4 page widths
      clonedElement.style.width = '100%';
      clonedElement.style.maxWidth = '100%';
      clonedElement.style.minWidth = '0';
      clonedElement.style.margin = '0';
      clonedElement.style.padding = '0';
      clonedElement.style.border = 'none';
      clonedElement.style.boxShadow = 'none';
      clonedElement.style.borderRadius = '0';
      
      // Append clone to printable container
      printContainer.appendChild(clonedElement);
      
      // Add container to standard body root
      document.body.appendChild(printContainer);
      
      // Add printing marker to body to hide the rest of the application interface
      document.body.classList.add('is-printing');
      
      // Brief timeout to ensure DOM registration and image renders are bound correctly prior to printing
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      window.print();
      
      // Cleanup elements
      document.body.classList.remove('is-printing');
      if (document.body.contains(printContainer)) {
        document.body.removeChild(printContainer);
      }
    } catch (err) {
      console.error("Gagal melakukan penyiapan cetak PDF vektor:", err);
      // Clean fallback directly to browser print function
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    handleDownloadPDF();
  };

  // Helper styles resolver
  const getLayoutStyles = (currentSettings: LayoutSettings) => {
    const colors = {
      emerald: { 
        text: 'text-emerald-700', 
        border: 'border-emerald-600', 
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-100', 
        bullet: 'text-emerald-600',
        hex: '#0f766e'
      },
      blue: { 
        text: 'text-blue-700', 
        border: 'border-blue-600', 
        bg: 'bg-blue-50 text-blue-800 border-blue-100', 
        bullet: 'text-blue-600',
        hex: '#1d4ed8'
      },
      slate: { 
        text: 'text-slate-800', 
        border: 'border-slate-800', 
        bg: 'bg-slate-100 text-slate-800 border-slate-200', 
        bullet: 'text-slate-700',
        hex: '#1e293b'
      },
      indigo: { 
        text: 'text-indigo-700', 
        border: 'border-indigo-600', 
        bg: 'bg-indigo-50 text-indigo-800 border-indigo-100', 
        bullet: 'text-indigo-600',
        hex: '#4338ca'
      },
      rose: { 
        text: 'text-rose-700', 
        border: 'border-rose-600', 
        bg: 'bg-rose-50 text-rose-800 border-rose-100', 
        bullet: 'text-rose-600',
        hex: '#be123c'
      },
      amber: { 
        text: 'text-amber-800', 
        border: 'border-amber-700', 
        bg: 'bg-amber-50 text-amber-900 border-amber-100', 
        bullet: 'text-amber-700',
        hex: '#b45309'
      },
    }[currentSettings.themeColor || 'emerald'];

    const fonts = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono'
    }[currentSettings.fontFamily || 'sans'];

    const fontSizes = {
      compact: { 
        name: 'text-xl sm:text-2xl', 
        sub: 'text-[9px] uppercase tracking-wider', 
        text: 'text-[10px] leading-relaxed', 
        sectionTitle: 'text-xs' 
      },
      standard: { 
        name: 'text-2xl sm:text-3.5xl', 
        sub: 'text-[10px] uppercase tracking-widest', 
        text: 'text-xs leading-relaxed', 
        sectionTitle: 'text-sm' 
      },
      comfortable: { 
        name: 'text-3xl sm:text-4.5xl', 
        sub: 'text-xs uppercase tracking-widest', 
        text: 'text-sm leading-relaxed', 
        sectionTitle: 'text-base' 
      }
    }[currentSettings.fontSize || 'standard'];

    const spacings = {
      tight: { 
        margin: 'pb-2 mb-3', 
        gap: 'gap-4', 
        block: 'mb-2', 
        listSpace: 'space-y-0.5' 
      },
      standard: { 
        margin: 'pb-5 mb-5', 
        gap: 'gap-8', 
        block: 'mb-4', 
        listSpace: 'space-y-1' 
      },
      spacious: { 
        margin: 'pb-8 mb-8', 
        gap: 'gap-12', 
        block: 'mb-6', 
        listSpace: 'space-y-2' 
      }
    }[currentSettings.spacing || 'standard'];

    return { colors, fonts, fontSizes, spacings };
  };

  const activeStyles = getLayoutStyles(settings);

  // Dynamic Theme Colors for Buttons and UI Indicators
  const themeBgMap: Record<string, string> = {
    emerald: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 shadow-emerald-500/10',
    blue: 'bg-blue-600 hover:bg-blue-500 border-blue-500 shadow-blue-500/10',
    slate: 'bg-slate-700 hover:bg-slate-600 border-slate-600 shadow-slate-500/10',
    indigo: 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 shadow-indigo-500/10',
    rose: 'bg-rose-600 hover:bg-rose-500 border-rose-500 shadow-rose-500/10',
    amber: 'bg-amber-600 hover:bg-amber-500 border-amber-500 shadow-amber-500/10',
  };

  const textAccentMap: Record<string, string> = {
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    slate: 'text-slate-400',
    indigo: 'text-indigo-400',
    rose: 'text-rose-500',
    amber: 'text-amber-500',
  };

  const activeAccentBgClass = themeBgMap[settings.themeColor || 'emerald'];
  const activeTextAccent = textAccentMap[settings.themeColor || 'emerald'];

  const skills = cvData.skills || [];
  const getSkillsByCategory = (cat: string, fallback: string) => {
    let filterFn = (s: any) => s.showOnCV !== false && s.category === cat;
    if (cat === 'dbms') {
      filterFn = (s: any) => s.showOnCV !== false && (s.category === 'dbms' || (s.category === 'core' && (s.icon === 'Database' || s.name.toLowerCase().includes('sql'))));
    } else if (cat === 'scientific') {
      filterFn = (s: any) => s.showOnCV !== false && (s.category === 'scientific' || (s.category === 'core' && !(s.icon === 'Database' || s.name.toLowerCase().includes('sql'))));
    }
    const names = skills.filter(filterFn).map(s => s.name).join(', ');
    return names || fallback || '';
  };

  const dynamicDBMS = getSkillsByCategory('dbms', cvData.technicalArsenal?.dbms);
  const dynamicScientific = getSkillsByCategory('scientific', cvData.technicalArsenal?.scientificLanguages);
  const dynamicPresentation = getSkillsByCategory('visualization', cvData.technicalArsenal?.dataPresentation);
  const dynamicAnalytical = getSkillsByCategory('analytical', cvData.technicalArsenal?.analyticsSpecialties);

  // Reorder structural block handler
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...settings.sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIdx >= 0 && targetIdx < list.length) {
      const [moved] = list.splice(index, 1);
      list.splice(targetIdx, 0, moved);
      const newSettings = { ...settings, sectionOrder: list };
      setSettings(newSettings);
      
      // Auto save locally during editing
      if (onUpdate) {
        onUpdate({
          ...cvData,
          layoutSettings: newSettings as any
        });
      }
    }
  };

  // Modify exact layout state field
  const updateSetting = <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Auto save locally during editing
    if (onUpdate) {
      onUpdate({
        ...cvData,
        layoutSettings: newSettings as any
      });
    }
  };

  // Permanently save settings to Supabase DB or LocalStorage
  const handleSaveLayout = async () => {
    setIsSyncing(true);
    setSaveStatus({ type: null, message: '' });

    const updatedCVData: CVData = {
      ...cvData,
      layoutSettings: settings as any
    };

    try {
      const response = await saveCVData(updatedCVData);
      if (response.success) {
        if (onUpdate) {
          onUpdate(updatedCVData);
        }
        setSaveStatus({
          type: 'success',
          message: isAdmin 
            ? 'Sukses! Layout kustom tersinkronisasi ke cloud database Supabase.'
            : 'Sukses disimpan di browser lokal offline! Log in ke Admin untuk sinkronisasi cloud.'
        });
      } else {
        setSaveStatus({
          type: 'error',
          message: response.error || 'Terjadi kesalahan saat memproses.'
        });
      }
    } catch (e: any) {
      setSaveStatus({
        type: 'error',
        message: e.message || 'Gagal menyimpan perubahan.'
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 4500);
    }
  };

  // Download High-Fidelity MS Word (.doc) File
  const handleDownloadWord = async () => {
    // Generate Base64 circular image for avatar
    let base64Avatar = '';
    if (cvData.avatarUrl) {
      try {
        base64Avatar = await getCircularBase64Image(
          cvData.avatarUrl,
          cvData.avatarScale || 1,
          cvData.avatarX || 0,
          cvData.avatarY || 0
        );
      } catch (err) {
        console.error("Gagal memproses gambar avatar melingkar untuk Word DOC:", err);
        base64Avatar = cvData.avatarUrl;
      }
    }

    // Determine Word CSS Font based on layout setting
    const wordFontFamily = settings.fontFamily === 'serif' ? "Georgia, serif" : settings.fontFamily === 'mono' ? "Courier New, monospace" : "Arial, Helvetica, sans-serif";
    const activeColorHex = activeStyles.colors.hex || '#0f766e';

    const getWordSectionHTML = (sectionName: string): string => {
      switch (sectionName) {
        case 'arsenal':
          return `
            <div style="margin-bottom: 15pt;">
              <h4 style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 2px solid ${activeColorHex}; padding-bottom: 3pt; margin-top: 10pt; margin-bottom: 8pt; text-transform: uppercase; letter-spacing: 0.5px;">
                Technical Arsenal
              </h4>
              <table width="100%" cellspacing="0" cellpadding="3" border="0" style="margin-bottom: 6pt;">
                <tr>
                  <td width="35%" valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">DBMS / QUERY</td>
                  <td width="65%" valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${dynamicDBMS || '-'}</td>
                </tr>
                <tr>
                  <td valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">SCIENTIFIC LANGUAGES</td>
                  <td valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${dynamicScientific || '-'}</td>
                </tr>
                <tr>
                  <td valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">DATA PRESENTATION</td>
                  <td valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${dynamicPresentation || '-'}</td>
                </tr>
                <tr>
                  <td valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">ANALYTICS SPECIALTIES</td>
                  <td valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${dynamicAnalytical || '-'}</td>
                </tr>
              </table>
            </div>
          `;
        case 'education':
          return `
            <div style="margin-bottom: 15pt;">
              <h4 style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 2px solid ${activeColorHex}; padding-bottom: 3pt; margin-top: 10pt; margin-bottom: 8pt; text-transform: uppercase; letter-spacing: 0.5px;">
                Education
              </h4>
              ${cvData.education.map(edu => `
                <div style="margin-bottom: 8pt; font-family: ${wordFontFamily};">
                  <span style="font-size: 8pt; font-weight: bold; color: #94a3b8; display: block;">${edu.period}</span>
                  <span style="font-size: 9.5pt; font-weight: bold; color: #0f172a; display: block; margin-top: 1pt;">${edu.degree}</span>
                  <span style="font-size: 9pt; color: #64748b; display: block;">${edu.institution}</span>
                </div>
              `).join('')}
            </div>
          `;
        case 'experience':
          return `
            <div style="margin-bottom: 15pt;">
              <h4 style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 2px solid ${activeColorHex}; padding-bottom: 3pt; margin-top: 10pt; margin-bottom: 8pt; text-transform: uppercase; letter-spacing: 0.5px;">
                Professional Experience
              </h4>
              ${cvData.experiences.map(exp => `
                <div style="margin-bottom: 12pt; font-family: ${wordFontFamily};">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 2pt;">
                    <tr>
                      <td align="left" style="font-family: ${wordFontFamily}; font-size: 10pt; font-weight: bold; color: #0f172a;">${exp.role}</td>
                      <td align="right" style="font-family: ${wordFontFamily}; font-size: 8.5pt; color: #94a3b8; font-style: italic;">${exp.period}</td>
                    </tr>
                  </table>
                  <div style="font-family: ${wordFontFamily}; font-size: 9.5pt; font-weight: bold; color: ${activeColorHex}; margin-bottom: 4pt;">${exp.company}</div>
                  <ul style="margin-top: 2pt; margin-bottom: 4pt; padding-left: 14pt;">
                    ${exp.bulletPoints.map(bullet => `<li style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #334155; margin-bottom: 3px;">${bullet}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          `;
        case 'methodology':
          return `
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10pt; margin-bottom: 15pt; border-radius: 4px;">
              <h5 style="font-family: ${wordFontFamily}; font-size: 9.5pt; font-weight: bold; color: #0f172a; margin-top: 0; margin-bottom: 4pt; text-transform: uppercase; letter-spacing: 0.5px;">
                ${cvData.methodologyTitle || 'Work Philosophy'}
              </h5>
              <p style="font-family: ${wordFontFamily}; font-size: 9pt; color: #475569; font-style: italic; line-height: 1.4; margin: 0;">
                "${cvData.methodologyText}"
              </p>
            </div>
          `;
        default:
          return '';
      }
    };

    // Always render sections top-to-bottom sequentially for clean editing and flow inside MS Word (.doc) format
    const bodyContentHTML = `
      <div style="margin-top: 10pt;">
        ${settings.sectionOrder.map(secId => getWordSectionHTML(secId)).join('')}
      </div>
    `;

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${cvData.name} - CV</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          body {
            font-family: ${wordFontFamily};
            color: #1e293b;
            line-height: 1.4;
            font-size: 10pt;
          }
        </style>
      </head>
      <body>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 12pt; border-bottom: 3px solid #0f172a; padding-bottom: 8pt;">
          <tr>
            <td align="left" valign="middle">
              <table cellspacing="0" cellpadding="0" border="0">
                <tr>
                  ${base64Avatar ? `
                    <td valign="middle" style="padding-right: 12pt;">
                      <img src="${base64Avatar}" width="65" height="65" style="border-radius: 50%; border: 1px solid #cbd5e1;" />
                    </td>
                  ` : ''}
                  <td valign="middle">
                    <h1 style="font-family: ${wordFontFamily}; font-size: 22pt; font-weight: bold; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.5px;">
                      ${cvData.name}
                    </h1>
                    <div style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: ${activeColorHex}; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3pt;">
                      ${cvData.title}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
            <td align="right" valign="middle" style="font-family: ${wordFontFamily}; font-size: 8.5pt; color: #64748b; line-height: 1.3;">
              <div>${cvData.location}</div>
              <div>${cvData.email}</div>
              <div>${cvData.linkedin}</div>
            </td>
          </tr>
        </table>

        ${cvData.aboutMe ? `
          <p style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #334155; margin-bottom: 14pt; text-align: justify; line-height: 1.45;">
            ${cvData.aboutMe.replace(/\n/g, '<br/>')}
          </p>
        ` : ''}

        ${bodyContentHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cv_${cvData.name.toLowerCase().replace(/\s+/g, '_')}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sections builder renderer for React UI
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'arsenal':
        return (
          <div key="arsenal" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
            {isEditorMode && (
              <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
                ARSENAL
              </span>
            )}
            <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1.5 mb-2.5 flex items-center gap-1.5`}>
              <Database className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> Technical Arsenal
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">DBMS / QUERY</span>
                <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                  {dynamicDBMS}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">SCIENTIFIC LANGUAGES</span>
                <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                  {dynamicScientific}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">DATA PRESENTATION</span>
                <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                  {dynamicPresentation}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">ANALYTICS SPECIALTIES</span>
                <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                  {dynamicAnalytical}
                </p>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div key="education" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
            {isEditorMode && (
              <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
                EDUCATION
              </span>
            )}
            <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1.5 mb-2.5 flex items-center gap-1.5`}>
              <GraduationCap className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> Education
            </h4>
            <div className="space-y-3">
              {cvData.education.map((edu, idx) => (
                <div key={idx}>
                  <span className="text-[9px] font-mono font-bold text-slate-400 block">{edu.period}</span>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{edu.degree}</span>
                  <span className="text-xs text-slate-500">{edu.institution}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div key="experience" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
            {isEditorMode && (
              <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
                EXPERIENCE
              </span>
            )}
            <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5`}>
              <Briefcase className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> Professional Experience
            </h4>

            <div className="space-y-4">
              {cvData.experiences.map((exp) => (
                <div key={exp.id} className={activeStyles.spacings.block}>
                  <div className="flex justify-between items-baseline gap-2">
                    <h5 className={`${activeStyles.fontSizes.text} font-bold text-slate-900 leading-tight`}>{exp.role}</h5>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{exp.period}</span>
                  </div>
                  <span className={`text-xs font-bold block ${activeStyles.colors.text}`}>{exp.company}</span>
                  <ul className={`list-disc list-outside pl-4 mt-1.5 ${activeStyles.spacings.listSpace} ${activeStyles.fontSizes.text} text-slate-600`}>
                    {exp.bulletPoints.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="pl-0.5">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'methodology':
        return (
          <div key="methodology" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
            {isEditorMode && (
              <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
                PHILOSOPHY
              </span>
            )}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-white print:border-none print:p-0">
              <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider pb-1 flex items-center gap-1.5 mb-1`}>
                <Sparkles className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> {cvData.methodologyTitle}
              </h4>
              <p className={`${activeStyles.fontSizes.text} text-slate-500 leading-relaxed italic`}>
                "{cvData.methodologyText}"
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Rendering main document layout columns
  const renderColumnContent = (colType: 'sidebar' | 'main') => {
    if (settings.layoutStyle === 'single-column') {
      return null; // Not using sidebars in single column format
    }

    const sidebarSections = ['arsenal', 'education'];
    const mainSections = ['experience', 'methodology'];

    const activeSections = colType === 'sidebar' ? sidebarSections : mainSections;
    
    // Return ordered according to user structural settings preference
    return settings.sectionOrder
      .filter(secId => activeSections.includes(secId))
      .map(secId => renderSection(secId));
  };

  if (inlinePreview) {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Force exact A4 styles inside custom inline container */}
        <span dangerouslySetInnerHTML={{ __html: `
          <style>
            .a4-inline-sheet {
              width: 100% !important;
              max-width: 210mm !important;
              box-sizing: border-box !important;
            }
          </style>
        `}} />
        
        <div className="w-full flex justify-end gap-2 no-print p-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-slate-700 active:scale-97 disabled:opacity-50 select-none"
          >
            {isDownloadingPdf ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Unduh PDF CV (Format A4)</span>
              </>
            )}
          </button>
        </div>

        <div className="w-full overflow-x-auto p-1 sm:p-4 flex justify-center bg-slate-950/25 rounded-xl border border-slate-800/40">
          <div 
            ref={resumeRef}
            className={`a4-inline-sheet bg-white px-8 py-10 sm:px-12 sm:py-14 rounded-xl border border-slate-200/80 shadow-md mx-auto text-slate-800 print:border-none print:shadow-none print:p-0 print:m-0 transition-all ${
              activeStyles.fonts
            }`}
            style={{
              fontFamily: settings.fontFamily === 'mono' ? '"JetBrains Mono", Courier, monospace' : settings.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' : 'var(--font-sans)',
            }}
          >
            {/* Header: Extremely customizable based on Admin settings */}
            {(() => {
              const photoPos = settings.headerPhotoPosition || 'left';
              const align = settings.headerAlignment || 'left';
              const contactPos = settings.headerContactPosition || 'bottom';

              // Determine contacts element
              const renderHeaderContacts = () => {
                const items: React.ReactNode[] = [];
                const visibleIds = cvData.headerContacts || ['location', 'email', 'linkedin'];
                
                // Get unified list of social channels
                const unifiedSocials = [...(cvData.customSocials || [])];
                const standards = [
                  { key: 'linkedin', name: 'LinkedIn', val: cvData.linkedin },
                  { key: 'github', name: 'GitHub', val: cvData.github },
                  { key: 'instagram', name: 'Instagram', val: cvData.instagram },
                  { key: 'whatsapp', name: 'WhatsApp', val: cvData.whatsapp }
                ];
                standards.forEach(({ key, name, val }) => {
                  const exists = unifiedSocials.some(s => s.id === key || s.name?.toLowerCase().trim() === name.toLowerCase().trim());
                  if (val && !exists) {
                    unifiedSocials.push({
                      id: key,
                      name,
                      value: val,
                      showOnWeb: true,
                      showOnCvHeader: cvData.headerContacts?.includes(key) ?? false,
                      showOnCvFooter: cvData.footerSocials?.includes(key) ?? true
                    });
                  }
                });

                visibleIds.forEach((id) => {
                  if (id === 'location' && cvData.location) {
                    items.push(<span key="loc">{cvData.location}</span>);
                  } else if (id === 'email' && cvData.email) {
                    items.push(
                      <a key="email" href={`mailto:${cvData.email}`} className="hover:text-slate-900 hover:underline transition-colors">
                        {cvData.email}
                      </a>
                    );
                  } else {
                    // Look in unified socials for matching ID
                    const found = unifiedSocials.find(s => 
                      s.id === id || 
                      (id === 'linkedin' && s.name?.toLowerCase().trim() === 'linkedin') ||
                      (id === 'github' && s.name?.toLowerCase().trim() === 'github') ||
                      (id === 'instagram' && s.name?.toLowerCase().trim() === 'instagram') ||
                      (id === 'whatsapp' && s.name?.toLowerCase().trim() === 'whatsapp')
                    );
                    if (found && found.value) {
                      const cleanVal = found.value.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                      
                      let displayLabel = `${found.name}: ${cleanVal}`;
                      if (found.name?.toLowerCase().trim() === 'linkedin') {
                        const cleanLink = found.value.trim().replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
                        displayLabel = cleanLink;
                      } else if (found.name?.toLowerCase().trim() === 'instagram') {
                        const cleanInsta = found.value.trim().replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').replace(/\/$/, '');
                        displayLabel = cleanInsta.startsWith('@') ? cleanInsta : `@${cleanInsta}`;
                      } else if (found.name?.toLowerCase().trim() === 'whatsapp') {
                        displayLabel = found.value.trim();
                      } else if (found.name?.toLowerCase().trim() === 'github') {
                        const cleanGit = found.value.trim().replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '');
                        displayLabel = cleanGit;
                      }

                      items.push(
                        <a key={found.id} href={getAbsoluteUrl(found.usernameOrUrl || found.value, found.name)} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 hover:underline transition-colors flex items-center gap-1 inline-flex font-mono">
                          <SocialIcon platform={found.name} size={11} className="w-2.5 h-2.5 inline shrink-0" useBrandColor={true} />
                          <span>{displayLabel}</span>
                        </a>
                      );
                    }
                  }
                });

                if (items.length === 0) return null;

                if (contactPos === 'right' && align === 'left') {
                  // Stacked list on the right side of header
                  return (
                    <div className="text-right font-mono text-[9px] sm:text-xs print:text-xs text-slate-500 space-y-1 mt-2 sm:mt-0 shrink-0 hover:text-slate-800 transition-colors flex flex-col items-end">
                      {items.map((elem, idx) => (
                        <div key={idx} className="flex items-center">
                          {elem}
                        </div>
                      ))}
                    </div>
                  );
                }

                // Standard linear row list with dividers
                return (
                  <div className={`flex flex-wrap items-center ${align === 'center' ? 'justify-center' : 'justify-start'} gap-x-3 gap-y-1 mt-3 font-mono text-[9px] sm:text-xs print:text-xs text-slate-500`}>
                    {items.map((elem, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span className="text-slate-300 print:text-slate-400 font-bold select-none px-0.5">|</span>}
                        {elem}
                      </React.Fragment>
                    ))}
                  </div>
                );
              };

              const isCenter = align === 'center';
              const isTopPhoto = photoPos === 'top';

              return (
                <div className={`border-b-2 border-slate-950 pb-5 ${activeStyles.spacings.margin} flex flex-col ${
                  isTopPhoto && isCenter ? 'items-center text-center' : 'items-stretch text-left'
                }`}>
                  <div className={`flex w-full ${
                    isTopPhoto
                      ? (isCenter ? 'flex-col items-center' : 'flex-col items-start gap-4')
                      : 'flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6'
                  }`}>
                    
                    <div className={`flex ${
                      isTopPhoto
                        ? (isCenter ? 'flex-col items-center text-center gap-3' : 'flex-col items-start text-left gap-2')
                        : 'flex-row items-center sm:items-start text-left gap-4 sm:gap-5'
                    }`}>
                      {cvData.avatarUrl ? (
                        <div 
                          className={`rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm relative flex items-center justify-center bg-slate-50 ${
                            isTopPhoto
                              ? (isCenter ? 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20 mb-1' : 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20 mb-2')
                              : 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20'
                          }`}
                        >
                          <img 
                            src={cvData.avatarUrl} 
                            alt={cvData.name} 
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: 'auto',
                              maxWidth: 'none',
                              maxHeight: 'none',
                              transform: `scale(${cvData.avatarScale || 1}) translate(${cvData.avatarX || 0}px, ${cvData.avatarY || 0}px)`,
                              transformOrigin: 'center center',
                            }}
                            className="shrink-0 pointer-events-none select-none"
                          />
                        </div>
                      ) : null}

                      <div className={`flex flex-col ${isCenter ? 'items-center text-center sm:items-center' : 'items-start text-left'}`}>
                        <h1 className={`${activeStyles.fontSizes.name} font-black text-slate-900 tracking-tight leading-none uppercase`}>
                          {cvData.name}
                        </h1>
                        <p className={`${activeStyles.colors.text} font-mono font-bold text-xs sm:text-sm uppercase tracking-widest mt-2`}>
                          {cvData.title}
                        </p>
                        
                        {/* Render choices at bottom if layout sets contactPosition to bottom OR align is center */}
                        {(contactPos === 'bottom' || isCenter) && renderHeaderContacts()}
                      </div>
                    </div>

                    {/* Render choices at right if layout sets contactPosition to right AND align is left */}
                    {!isCenter && contactPos === 'right' && (
                      <div className="self-center sm:self-start">
                        {renderHeaderContacts()}
                      </div>
                    )}

                  </div>
                </div>
              );
            })()}

            {/* CV About Me / Brief Bio Section */}
            {cvData.aboutMe && (
              <div className="border-b border-slate-200 pb-4 mb-4 text-xs sm:text-sm print:text-sm text-slate-700 leading-relaxed whitespace-pre-line text-justify tracking-wide">
                {cvData.aboutMe}
              </div>
            )}

            {/* Grid content: Dynamic column arrangements */}
            {settings.layoutStyle === 'left-sidebar' ? (
              <div className={`grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 ${activeStyles.spacings.gap}`}>
                {/* Left Technical Profile Column */}
                <div className="md:col-span-4 print:col-span-4 space-y-5 md:border-r md:border-slate-100 md:pr-4 print:border-r print:border-slate-100 print:pr-4">
                  {renderColumnContent('sidebar')}
                </div>
                
                {/* Right Narrative Work History Column */}
                <div className="md:col-span-8 print:col-span-8 space-y-5">
                  {renderColumnContent('main')}
                </div>
              </div>
            ) : settings.layoutStyle === 'right-sidebar' ? (
              <div className={`grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 ${activeStyles.spacings.gap}`}>
                {/* Left Narrative Column */}
                <div className="md:col-span-8 print:col-span-8 space-y-5">
                  {renderColumnContent('main')}
                </div>

                {/* Right Profile Column */}
                <div className="md:col-span-4 print:col-span-4 space-y-5 md:border-l md:border-slate-100 md:pl-4 print:border-l print:border-slate-100 print:pl-4">
                  {renderColumnContent('sidebar')}
                </div>
              </div>
            ) : (
              /* Single column linear layout styled strictly top to bottom */
              <div className="space-y-6">
                {settings.sectionOrder.map(secId => renderSection(secId))}
              </div>
            )}

            {/* CV Print Footer with checklist checked social icons/links */}
            <div className="border-t border-slate-200 mt-6 pt-4">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] sm:text-xs font-mono text-slate-500">
                {(() => {
                  const visibleIds = cvData.footerSocials || ['linkedin', 'instagram', 'whatsapp'];
                  const footerItems: React.ReactNode[] = [];

                  // Get unified list of social channels
                  const unifiedSocials = [...(cvData.customSocials || [])];
                  const standards = [
                    { key: 'linkedin', name: 'LinkedIn', val: cvData.linkedin },
                    { key: 'github', name: 'GitHub', val: cvData.github },
                    { key: 'instagram', name: 'Instagram', val: cvData.instagram },
                    { key: 'whatsapp', name: 'WhatsApp', val: cvData.whatsapp }
                  ];
                  standards.forEach(({ key, name, val }) => {
                    const exists = unifiedSocials.some(s => s.id === key || s.name?.toLowerCase().trim() === name.toLowerCase().trim());
                    if (val && !exists) {
                      unifiedSocials.push({
                        id: key,
                        name,
                        value: val,
                        showOnWeb: true,
                        showOnCvHeader: cvData.headerContacts?.includes(key) ?? false,
                        showOnCvFooter: cvData.footerSocials?.includes(key) ?? true
                      });
                    }
                  });

                  unifiedSocials.forEach((social) => {
                    if (visibleIds.includes(social.id) && social.value) {
                      const cleanVal = social.value.trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                      
                      let displayLabel = cleanVal;
                      if (social.name?.toLowerCase().trim() === 'instagram') {
                        const cleanInsta = social.value.trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                        const parts = cleanInsta.split('/');
                        let handle = parts[parts.length - 1];
                        displayLabel = handle.startsWith('@') ? handle : `@${handle}`;
                      } else if (social.name?.toLowerCase().trim() === 'whatsapp') {
                        displayLabel = social.value.trim();
                      }

                      footerItems.push(
                        <a 
                          key={social.id}
                          href={getAbsoluteUrl(social.usernameOrUrl || social.value, social.name)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 text-slate-755 hover:text-emerald-500 transition-colors cursor-pointer group"
                          title={`Buka ${social.name}`}
                        >
                          <SocialIcon platform={social.name} size={14} className="w-3.5 h-3.5 shrink-0" useBrandColor={true} />
                          <span className="text-[10px] tracking-tight hover:underline underline-offset-2 text-slate-600 group-hover:text-slate-900 transition-colors">
                            {displayLabel}
                          </span>
                        </a>
                      );
                    }
                  });

                  return footerItems;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className={`relative rounded-xl shadow-2xl border w-full overflow-hidden transition-all flex flex-col max-h-[95vh] ${
          theme === 'dark' 
            ? 'bg-slate-900 border-slate-800 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        } max-w-4xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Force exact A4 sizes on print automatically and strip default browser watermarks */}
        <span dangerouslySetInnerHTML={{ __html: `
          <style>
            @media screen {
              .a4-sheet {
                width: 210mm !important;
                min-height: 297mm !important;
                box-sizing: border-box;
              }
            }
            @media print {
              @page {
                size: A4 portrait;
                margin: 0mm !important; /* Strips browser-generated date, title, link, page numbers */
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: white !important;
                color: #1e293b !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print {
                display: none !important;
              }
              .a4-sheet {
                width: 210mm !important;
                /* Tighter margins on paper to maximize printable width and keep layout on a single-page */
                padding: 12mm 10mm !important; 
                margin: 0 auto !important;
                border: none !important;
                box-shadow: none !important;
                box-sizing: border-box !important;
              }
            }
          </style>
        `}} />

        {/* Modal Topbar Actions */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 select-none no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                Dokumen CV Resume Standard A4 
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  ATS Ready
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Format formal versi cetak teroptimalisasi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Outer Split screen layout: Editor Dashboard vs A4 Canvas */}
        <div className={`flex-grow flex flex-col md:flex-row overflow-hidden ${
          theme === 'dark' ? 'bg-[#0b101c]' : 'bg-slate-100'
        }`}>
          
          {/* LEFT COLUMN: THE DESIGN EDITING PANEL */}
          <AnimatePresence>
            {isEditorMode && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '310px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "tween", duration: 0.25 }}
                className="no-print bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col h-full shrink-0 overflow-y-auto"
              >
                {/* Header title */}
                <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                  <div className="flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
                      Panel Setelan Desain
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-mono">
                    REALTIME
                  </span>
                </div>

                <div className="p-4 space-y-6 flex-grow">
                  
                  {/* Preset color theme accent selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      Warna Aksen Highlight
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {(['emerald', 'blue', 'slate', 'indigo', 'rose', 'amber'] as const).map((color) => {
                        const bgHexClass = {
                          emerald: 'bg-emerald-600 ring-emerald-400',
                          blue: 'bg-blue-600 ring-blue-400',
                          slate: 'bg-slate-600 ring-slate-400',
                          indigo: 'bg-indigo-600 ring-indigo-400',
                          rose: 'bg-rose-600 ring-rose-400',
                          amber: 'bg-amber-600 ring-amber-400',
                        }[color];

                        return (
                          <button
                            key={color}
                            onClick={() => updateSetting('themeColor', color)}
                            title={`Warna ${color}`}
                            className={`w-8 h-8 rounded-full border border-slate-700 cursor-pointer relative hover:scale-105 transition-all ${bgHexClass} ${
                              settings.themeColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''
                            }`}
                          >
                            {settings.themeColor === color && (
                              <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font layout Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      Tipe Pasangan Font
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        { id: 'sans', name: 'Inter Sans', desc: 'Modern' },
                        { id: 'serif', name: 'Playfair', desc: 'Klasik' },
                        { id: 'mono', name: 'JetBrains', desc: 'Coders' }
                      ] as const).map((f) => (
                        <button
                          key={f.id}
                          onClick={() => updateSetting('fontFamily', f.id)}
                          className={`py-2 px-1 text-center border rounded-lg cursor-pointer transition-all ${
                            settings.fontFamily === f.id
                              ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                              : 'bg-slate-800 border-slate-750 text-slate-300 hover:text-white hover:bg-slate-750'
                          }`}
                        >
                          <p className="text-[10px] uppercase truncate">{f.name}</p>
                          <span className="text-[8px] opacity-60 font-mono block">{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section Orientation Styles */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      Tata Letak Kolom
                    </label>
                    <div className="space-y-1.5">
                      {([
                        { id: 'left-sidebar', name: 'Sidebar di Kiri', desc: 'Standard formal' },
                        { id: 'right-sidebar', name: 'Sidebar di Kanan', desc: 'Modern alternatif' },
                        { id: 'single-column', name: 'Satu Kolom Penuh', desc: 'Sangat rapi & linear' }
                      ] as const).map((l) => (
                        <button
                          key={l.id}
                          onClick={() => updateSetting('layoutStyle', l.id)}
                          className={`w-full py-2.5 px-3 border rounded-lg cursor-pointer flex items-center justify-between text-left transition-all ${
                            settings.layoutStyle === l.id
                              ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                              : 'bg-slate-800 border-slate-750 text-slate-300 hover:text-white hover:bg-slate-750'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Layout className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-sans leading-none block">{l.name}</span>
                          </div>
                          <span className="text-[8px] opacity-65 font-mono text-right">{l.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Sizes Multiplier Slider */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      Ukuran Huruf (Font Size)
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['compact', 'standard', 'comfortable'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => updateSetting('fontSize', sz)}
                          className={`py-1.5 text-center border rounded-lg text-[9px] cursor-pointer tracking-wider font-bold uppercase transition-all ${
                            settings.fontSize === sz
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-800 border-slate-750 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sz === 'compact' ? 'Kecil' : sz === 'standard' ? 'Sempurna' : 'Besar'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line Spacing / Margin Density */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      Kepadatan Margins &amp; Isi
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['tight', 'standard', 'spacious'] as const).map((sp) => (
                        <button
                          key={sp}
                          onClick={() => updateSetting('spacing', sp)}
                          className={`py-1.5 text-center border rounded-lg text-[9px] cursor-pointer tracking-wider font-bold uppercase transition-all ${
                            settings.spacing === sp
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-800 border-slate-750 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sp === 'tight' ? 'Padat' : sp === 'standard' ? 'Standard' : 'Renggang'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Dynamic Position Sorter */}
                  <div className="space-y-2 bg-slate-950/30 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                        Urutkan Deretan Bagian
                      </label>
                      <Info className="w-3 h-3 text-indigo-400" title="Klik tombol panah untuk memindah posisi section atas bawah" />
                    </div>
                    <div className="space-y-1 mt-2">
                      {settings.sectionOrder.map((secId, index) => {
                        const secLabel = {
                          arsenal: 'Skills & Tech Arsenal',
                          education: 'Academic Background',
                          experience: 'Career History',
                          methodology: 'Core Philosophy'
                        }[secId] || secId;

                        return (
                          <div 
                            key={secId}
                            className="flex items-center justify-between text-[10px] bg-slate-800 py-1.5 px-2 rounded-md border border-slate-750 font-mono tracking-tight text-slate-300"
                          >
                            <span className="truncate max-w-[150px]">{index + 1}. {secLabel}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveSection(index, 'up')}
                                className="p-1 rounded hover:bg-slate-700 bg-slate-750 disabled:opacity-30 cursor-pointer text-slate-200"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={index === settings.sectionOrder.length - 1}
                                onClick={() => moveSection(index, 'down')}
                                className="p-1 rounded hover:bg-slate-700 bg-slate-750 disabled:opacity-30 cursor-pointer text-slate-200"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Clear local action container */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/60 shrink-0 space-y-2.5">
                  {saveStatus.message && (
                    <div className={`p-2.5 rounded text-[10px] flex items-start gap-1.5 font-sans leading-tight ${
                      saveStatus.type === 'success' ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/10' : 'bg-red-950/50 text-red-300 border border-red-500/10'
                    }`}>
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{saveStatus.message}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSaveLayout}
                    disabled={isSyncing}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none uppercase tracking-wider"
                  >
                    {isSyncing ? (
                      'Menyinkronkan...'
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Simpan Layout Permanen
                      </>
                    )}
                  </button>
                  
                  <div className="text-[9px] text-slate-500 font-mono text-center flex items-center justify-center gap-1.5 leading-normal">
                    {isAdmin ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Sesi Admin Cloud Aktif (Supabase)</span>
                      </>
                    ) : (
                      <>
                        <CloudLightning className="w-3 h-3 text-amber-400" />
                        <span>Offline/Lokal. Memperbarui cache browser.</span>
                      </>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT COLUMN: THE MAIN PRINTABLE A4 STAGE SHEET */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-8 flex items-start justify-center">
            
            {/* Standard A4 Paper Wrapper */}
            <div 
              ref={resumeRef}
              className={`a4-sheet bg-white px-8 py-10 sm:px-12 sm:py-14 rounded-xl border border-slate-200/80 shadow-md mx-auto text-slate-800 print:border-none print:shadow-none print:p-0 print:m-0 transition-all ${
                activeStyles.fonts
              } ${
                isEditorMode ? 'hover:shadow-2xl' : ''
              }`}
              style={{
                fontFamily: settings.fontFamily === 'mono' ? '"JetBrains Mono", Courier, monospace' : settings.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' : 'var(--font-sans)'
              }}
            >
              {/* CV Header: Extremely customizable based on Admin settings */}
              {(() => {
                const photoPos = settings.headerPhotoPosition || 'left';
                const align = settings.headerAlignment || 'left';
                const contactPos = settings.headerContactPosition || 'bottom';

                // Determine contacts element
                const renderHeaderContacts = () => {
                  const items: React.ReactNode[] = [];
                  const visibleIds = cvData.headerContacts || ['location', 'email', 'linkedin'];
                  
                  // Get unified list of social channels
                  const unifiedSocials = [...(cvData.customSocials || [])];
                  const standards = [
                    { key: 'linkedin', name: 'LinkedIn', val: cvData.linkedin },
                    { key: 'github', name: 'GitHub', val: cvData.github },
                    { key: 'instagram', name: 'Instagram', val: cvData.instagram },
                    { key: 'whatsapp', name: 'WhatsApp', val: cvData.whatsapp }
                  ];
                  standards.forEach(({ key, name, val }) => {
                    const exists = unifiedSocials.some(s => s.id === key || s.name?.toLowerCase().trim() === name.toLowerCase().trim());
                    if (val && !exists) {
                      unifiedSocials.push({
                        id: key,
                        name,
                        value: val,
                        showOnWeb: true,
                        showOnCvHeader: cvData.headerContacts?.includes(key) ?? false,
                        showOnCvFooter: cvData.footerSocials?.includes(key) ?? true
                      });
                    }
                  });

                  visibleIds.forEach((id) => {
                    if (id === 'location' && cvData.location) {
                      items.push(<span key="loc">{cvData.location}</span>);
                    } else if (id === 'email' && cvData.email) {
                      items.push(
                        <a key="email" href={`mailto:${cvData.email}`} className="hover:text-slate-900 hover:underline transition-colors">
                          {cvData.email}
                        </a>
                      );
                    } else {
                      // Look in unified socials for matching ID
                      const found = unifiedSocials.find(s => 
                        s.id === id || 
                        (id === 'linkedin' && s.name?.toLowerCase().trim() === 'linkedin') ||
                        (id === 'github' && s.name?.toLowerCase().trim() === 'github') ||
                        (id === 'instagram' && s.name?.toLowerCase().trim() === 'instagram') ||
                        (id === 'whatsapp' && s.name?.toLowerCase().trim() === 'whatsapp')
                      );
                      if (found && found.value) {
                        const cleanVal = found.value.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                        
                        let displayLabel = `${found.name}: ${cleanVal}`;
                        if (found.name?.toLowerCase().trim() === 'linkedin') {
                          const cleanLink = found.value.trim().replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
                          displayLabel = cleanLink;
                        } else if (found.name?.toLowerCase().trim() === 'instagram') {
                          const cleanInsta = found.value.trim().replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').replace(/\/$/, '');
                          displayLabel = cleanInsta.startsWith('@') ? cleanInsta : `@${cleanInsta}`;
                        } else if (found.name?.toLowerCase().trim() === 'whatsapp') {
                          displayLabel = found.value.trim();
                        } else if (found.name?.toLowerCase().trim() === 'github') {
                          const cleanGit = found.value.trim().replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '');
                          displayLabel = cleanGit;
                        }

                        items.push(
                          <a key={found.id} href={getAbsoluteUrl(found.usernameOrUrl || found.value, found.name)} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 hover:underline transition-colors flex items-center gap-1 inline-flex font-mono">
                            <SocialIcon platform={found.name} size={11} className="w-2.5 h-2.5 inline shrink-0" useBrandColor={true} />
                            <span>{displayLabel}</span>
                          </a>
                        );
                      }
                    }
                  });

                  if (items.length === 0) return null;

                  if (contactPos === 'right' && align === 'left') {
                    // Stacked list on the right side of header
                    return (
                      <div className="text-right font-mono text-[9px] sm:text-xs print:text-xs text-slate-500 space-y-1 mt-2 sm:mt-0 shrink-0 hover:text-slate-800 transition-colors flex flex-col items-end">
                        {items.map((elem, idx) => (
                          <div key={idx} className="flex items-center">
                            {elem}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // Standard linear row list with dividers
                  return (
                    <div className={`flex flex-wrap items-center ${align === 'center' ? 'justify-center' : 'justify-start'} gap-x-3 gap-y-1 mt-3 font-mono text-[9px] sm:text-xs print:text-xs text-slate-500`}>
                      {items.map((elem, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span className="text-slate-300 print:text-slate-400 font-bold select-none px-0.5">|</span>}
                          {elem}
                        </React.Fragment>
                      ))}
                    </div>
                  );
                };

                const isCenter = align === 'center';
                const isTopPhoto = photoPos === 'top';

                return (
                  <div className={`border-b-2 border-slate-950 pb-5 ${activeStyles.spacings.margin} flex flex-col ${
                    isTopPhoto && isCenter ? 'items-center text-center' : 'items-stretch text-left'
                  }`}>
                    <div className={`flex w-full ${
                      isTopPhoto
                        ? (isCenter ? 'flex-col items-center' : 'flex-col items-start gap-4')
                        : 'flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6'
                    }`}>
                      
                      <div className={`flex ${
                        isTopPhoto
                          ? (isCenter ? 'flex-col items-center text-center gap-3' : 'flex-col items-start text-left gap-2')
                          : 'flex-row items-center sm:items-start text-left gap-4 sm:gap-5'
                      }`}>
                        {cvData.avatarUrl ? (
                          <div 
                            className={`rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm relative flex items-center justify-center bg-slate-50 ${
                              isTopPhoto
                                ? (isCenter ? 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20 mb-1' : 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20 mb-2')
                                : 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20'
                            }`}
                          >
                            <img 
                              src={cvData.avatarUrl} 
                              alt={cvData.name} 
                              style={{
                                position: 'absolute',
                                width: '100%',
                                height: 'auto',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                transform: `scale(${cvData.avatarScale || 1}) translate(${cvData.avatarX || 0}px, ${cvData.avatarY || 0}px)`,
                                transformOrigin: 'center center',
                              }}
                              className="shrink-0 pointer-events-none select-none"
                            />
                          </div>
                        ) : null}

                        <div className={`flex flex-col ${isCenter ? 'items-center text-center sm:items-center' : 'items-start text-left'}`}>
                          <h1 className={`${activeStyles.fontSizes.name} font-black text-slate-900 tracking-tight leading-none uppercase`}>
                            {cvData.name}
                          </h1>
                          <p className={`${activeStyles.colors.text} font-mono font-bold text-xs sm:text-sm uppercase tracking-widest mt-2`}>
                            {cvData.title}
                          </p>
                          
                          {/* Render choices at bottom if layout sets contactPosition to bottom OR align is center */}
                          {(contactPos === 'bottom' || isCenter) && renderHeaderContacts()}
                        </div>
                      </div>

                      {/* Render choices at right if layout sets contactPosition to right AND align is left */}
                      {!isCenter && contactPos === 'right' && (
                        <div className="self-center sm:self-start">
                          {renderHeaderContacts()}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}

              {/* CV About Me / Brief Bio Section */}
              {cvData.aboutMe && (
                <div className="border-b border-slate-200 pb-4 mb-4 text-xs sm:text-sm print:text-sm text-slate-700 leading-relaxed whitespace-pre-line text-justify tracking-wide">
                  {cvData.aboutMe}
                </div>
              )}

              {/* Grid content: Dynamic column arrangements */}
              {settings.layoutStyle === 'left-sidebar' ? (
                <div className={`grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 ${activeStyles.spacings.gap}`}>
                  {/* Left Technical Profile Column */}
                  <div className="md:col-span-4 print:col-span-4 space-y-5 md:border-r md:border-slate-100 md:pr-4 print:border-r print:border-slate-100 print:pr-4">
                    {renderColumnContent('sidebar')}
                  </div>
                  
                  {/* Right Narrative Work History Column */}
                  <div className="md:col-span-8 print:col-span-8 space-y-5">
                    {renderColumnContent('main')}
                  </div>
                </div>
              ) : settings.layoutStyle === 'right-sidebar' ? (
                <div className={`grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 ${activeStyles.spacings.gap}`}>
                  {/* Left Narrative Column */}
                  <div className="md:col-span-8 print:col-span-8 space-y-5">
                    {renderColumnContent('main')}
                  </div>

                  {/* Right Profile Column */}
                  <div className="md:col-span-4 print:col-span-4 space-y-5 md:border-l md:border-slate-100 md:pl-4 print:border-l print:border-slate-100 print:pl-4">
                    {renderColumnContent('sidebar')}
                  </div>
                </div>
              ) : (
                /* Single column linear layout styled strictly top to bottom */
                <div className="space-y-6">
                  {settings.sectionOrder.map(secId => renderSection(secId))}
                </div>
              )}

              {/* CV Print Footer with checklist checked social icons/links */}
              <div className="border-t border-slate-200 mt-6 pt-4">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] sm:text-xs font-mono text-slate-500">
                  {(() => {
                    const visibleIds = cvData.footerSocials || ['linkedin', 'instagram', 'whatsapp'];
                    const footerItems: React.ReactNode[] = [];

                    // Get unified list of social channels
                    const unifiedSocials = [...(cvData.customSocials || [])];
                    const standards = [
                      { key: 'linkedin', name: 'LinkedIn', val: cvData.linkedin },
                      { key: 'github', name: 'GitHub', val: cvData.github },
                      { key: 'instagram', name: 'Instagram', val: cvData.instagram },
                      { key: 'whatsapp', name: 'WhatsApp', val: cvData.whatsapp }
                    ];
                    standards.forEach(({ key, name, val }) => {
                      const exists = unifiedSocials.some(s => s.id === key || s.name?.toLowerCase().trim() === name.toLowerCase().trim());
                      if (val && !exists) {
                        unifiedSocials.push({
                          id: key,
                          name,
                          value: val,
                          showOnWeb: true,
                          showOnCvHeader: cvData.headerContacts?.includes(key) ?? false,
                          showOnCvFooter: cvData.footerSocials?.includes(key) ?? true
                        });
                      }
                    });

                    unifiedSocials.forEach((social) => {
                      if (visibleIds.includes(social.id) && social.value) {
                        const cleanVal = social.value.trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                        
                        let displayLabel = cleanVal;
                        if (social.name?.toLowerCase().trim() === 'instagram') {
                          const cleanInsta = social.value.trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                          const parts = cleanInsta.split('/');
                          let handle = parts[parts.length - 1];
                          displayLabel = handle.startsWith('@') ? handle : `@${handle}`;
                        } else if (social.name?.toLowerCase().trim() === 'whatsapp') {
                          displayLabel = social.value.trim();
                        }

                        footerItems.push(
                          <a 
                            key={social.id}
                            href={getAbsoluteUrl(social.usernameOrUrl || social.value, social.name)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 text-slate-755 hover:text-emerald-500 transition-colors cursor-pointer group"
                            title={`Buka ${social.name}`}
                          >
                            <SocialIcon platform={social.name} size={14} className="w-3.5 h-3.5 shrink-0" useBrandColor={true} />
                            <span className="text-[10px] tracking-tight hover:underline underline-offset-2 text-slate-600 group-hover:text-slate-900 transition-colors">
                              {displayLabel}
                            </span>
                          </a>
                        );
                      }
                    });

                    return footerItems;
                  })()}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Bottom Tip Info Bar */}
        <div className={`border-t px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shrink-0 text-xs no-print transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-slate-900 border-slate-800 text-slate-400' 
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-1.5 text-slate-500 font-sans">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Format dokumen dioptimalkan secara standar sistem A4 untuk menjamin kompatibilitas dan kelulusan integrasi sistem seleksi ATS.</span>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* PDF Format Download directly */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className={`text-white font-bold flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 cursor-pointer shadow-sm active:scale-97 transition-all text-xs w-full md:w-auto border border-transparent ${activeAccentBgClass} ${
                isDownloadingPdf ? 'opacity-65 cursor-not-allowed font-medium' : ''
              }`}
              title="Download dan simpan berkas asli PDF langsung berformat A4"
            >
              {isDownloadingPdf ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses PDF...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-white" />
                  <span>Unduh PDF (Format A4)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
