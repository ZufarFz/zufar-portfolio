import { CVData, CustomSocial, IDCardSvgItem } from '../types';
import { DEFAULT_CV_DATA, DEFAULT_WEB_TEXTS, ID_TRANSLATIONS, EMPTY_CV_DATA } from '../data/portfolioData';

export { DEFAULT_CV_DATA, DEFAULT_WEB_TEXTS, ID_TRANSLATIONS, EMPTY_CV_DATA };
export type { CVData, CustomSocial, IDCardSvgItem };

// Local Storage Key
export const STORAGE_KEY = 'bi-portfolio-local-data-v2';

/**
 * Reads a local file (e.g. uploaded via Admin) into an instant Base64 data URL
 * so it can be previewed without needing any external cloud storage or backend.
 */
export async function uploadFileToStorage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image as Data URL'));
      }
    };
    reader.onerror = () => {
      reject(new Error('FileReader error while reading image'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Fetches CV Data:
 * In 'preview' mode, checks localStorage for live customizations made in Admin, falling back to DEFAULT_CV_DATA.
 * In 'live' (default / public) mode, always returns pristine DEFAULT_CV_DATA from portfolioData.ts.
 */
export async function fetchCVData(mode: 'live' | 'preview' = 'live'): Promise<CVData> {
  if (mode === 'preview') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bi-portfolio-cv-data');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          // Merge with DEFAULT_CV_DATA to ensure any new keys/fields are safely populated
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
    } catch (err) {
      console.warn('Could not read cached portfolio data from localStorage:', err);
    }
  }

  return DEFAULT_CV_DATA;
}

/**
 * Direct file download helper for portfolioData.ts
 */
export function downloadCVDataAsTypeScript(data: CVData) {
  const tsContent = exportCVDataAsTypeScript(data);
  const blob = new Blob([tsContent], { type: 'text/typescript;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'portfolioData.ts');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Saves CV Data to localStorage so all live edits in Admin view update immediately in the browser.
 */
export async function saveCVData(newData: CVData): Promise<{ success: boolean; error?: string }> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    localStorage.setItem('bi-portfolio-cv-data', JSON.stringify(newData));
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save portfolio data to localStorage:', err);
    return { 
      success: false, 
      error: err.message || 'Gagal menyimpan ke penyimpanan lokal browser.' 
    };
  }
}

/**
 * Exports current CVData as a complete, drop-in replacement TypeScript file (portfolioData.ts).
 */
export function exportCVDataAsTypeScript(data: CVData): string {
  const formattedData = JSON.stringify(data, null, 2);
  const formattedWebTexts = JSON.stringify(DEFAULT_WEB_TEXTS, null, 2);
  const formattedIdTranslations = JSON.stringify(ID_TRANSLATIONS, null, 2);

  return `import { CaseStudy, Experience, SkillItem, SkillCategory, PersonalityItem, HobbyItem, CareerGoalItem, EducationSection, EducationItem, CustomSocial, IDCardSvgItem, CVData } from '../types';

// ============================================================================
// 1. TEKS DEFAULT WEBSITE (BILINGUAL: ENGLISH & INDONESIAN)
// ============================================================================

export const DEFAULT_WEB_TEXTS: Record<string, string> = ${formattedWebTexts};

export const ID_TRANSLATIONS = ${formattedIdTranslations};

// ============================================================================
// 2. DATA UTAMA PORTFOLIO & CV (LOKAL - BEBAS BATASAN CLOUD DATABASE)
// ============================================================================

export const DEFAULT_CV_DATA: CVData = ${formattedData};

// Backwards compatibility exports
export const CASE_STUDIES = DEFAULT_CV_DATA.caseStudies || [];
export const SKILLS = DEFAULT_CV_DATA.skills || [];
export const EXPERIENCES = DEFAULT_CV_DATA.experiences || [];
export const EMPTY_CV_DATA = DEFAULT_CV_DATA;
`;
}

export async function resetCVData(): Promise<CVData> {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('bi-portfolio-cv-data');
  } catch (_) {}
  return DEFAULT_CV_DATA;
}

/**
 * Exports CVData as a cleanly formatted JSON string for easy copying/downloading.
 */
export function exportCVDataAsJSON(data: CVData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Imports and parses a JSON string into valid CVData.
 */
export function importCVDataFromJSON(jsonString: string): CVData {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Format JSON tidak valid atau bukan objek data yang benar.');
  }
  return {
    ...DEFAULT_CV_DATA,
    ...parsed,
    webTexts: {
      ...DEFAULT_WEB_TEXTS,
      ...(parsed.webTexts || {})
    }
  };
}
