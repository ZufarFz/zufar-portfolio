import { Experience } from '../types';

export interface MonthOption {
  value: string;
  idShort: string;
  enShort: string;
  idFull: string;
  enFull: string;
}

export const MONTHS_DATA: MonthOption[] = [
  { value: '01', idShort: 'Jan', enShort: 'Jan', idFull: 'Januari', enFull: 'January' },
  { value: '02', idShort: 'Feb', enShort: 'Feb', idFull: 'Februari', enFull: 'February' },
  { value: '03', idShort: 'Mar', enShort: 'Mar', idFull: 'Maret', enFull: 'March' },
  { value: '04', idShort: 'Apr', enShort: 'Apr', idFull: 'April', enFull: 'April' },
  { value: '05', idShort: 'Mei', enShort: 'May', idFull: 'Mei', enFull: 'May' },
  { value: '06', idShort: 'Jun', enShort: 'Jun', idFull: 'Juni', enFull: 'June' },
  { value: '07', idShort: 'Jul', enShort: 'Jul', idFull: 'Juli', enFull: 'July' },
  { value: '08', idShort: 'Agu', enShort: 'Aug', idFull: 'Agustus', enFull: 'August' },
  { value: '09', idShort: 'Sep', enShort: 'Sep', idFull: 'September', enFull: 'September' },
  { value: '10', idShort: 'Okt', enShort: 'Oct', idFull: 'Oktober', enFull: 'October' },
  { value: '11', idShort: 'Nov', enShort: 'Nov', idFull: 'November', enFull: 'November' },
  { value: '12', idShort: 'Des', enShort: 'Dec', idFull: 'Desember', enFull: 'December' },
];

const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS: number[] = Array.from({ length: 45 }, (_, i) => currentYear + 2 - i);

export interface ParsedDateState {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  isCustom: boolean;
}

/**
 * Format date values to localized period string for Experience
 */
export function formatExperiencePeriod(
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string,
  isCurrent: boolean,
  lang: 'id' | 'en'
): string {
  const startMObj = MONTHS_DATA.find(m => m.value === startMonth);
  const startMStr = startMObj ? (lang === 'id' ? startMObj.idShort : startMObj.enShort) : '';
  const startPart = [startMStr, startYear].filter(Boolean).join(' ');

  if (isCurrent) {
    const currentStr = lang === 'id' ? 'Sekarang' : 'Present';
    if (!startPart) return currentStr;
    return `${startPart} — ${currentStr}`;
  }

  const endMObj = MONTHS_DATA.find(m => m.value === endMonth);
  const endMStr = endMObj ? (lang === 'id' ? endMObj.idShort : endMObj.enShort) : '';
  const endPart = [endMStr, endYear].filter(Boolean).join(' ');

  if (startPart && endPart) {
    return `${startPart} — ${endPart}`;
  }
  return startPart || endPart || '';
}

/**
 * Parse a period string or extract from structured properties in an Experience item
 */
export function parseExperiencePeriod(periodStr: string = '', exp?: Partial<Experience>): ParsedDateState {
  // If structured fields already exist on the item
  if (exp?.startYear || exp?.startMonth || exp?.endYear || exp?.endMonth || exp?.isCurrent !== undefined) {
    return {
      startMonth: exp.startMonth || (exp.startDate && exp.startDate.includes('-') ? exp.startDate.split('-')[1] : ''),
      startYear: exp.startYear || (exp.startDate ? exp.startDate.split('-')[0] : ''),
      endMonth: exp.endMonth || (exp.endDate && exp.endDate.includes('-') ? exp.endDate.split('-')[1] : ''),
      endYear: exp.endYear || (exp.endDate ? exp.endDate.split('-')[0] : ''),
      isCurrent: exp.isCurrent ?? false,
      isCustom: exp.periodMode === 'custom'
    };
  }

  // Parse raw period string fallback
  const raw = (periodStr || '').trim();
  if (!raw) {
    return {
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      isCurrent: false,
      isCustom: false
    };
  }

  const lower = raw.toLowerCase();
  const isCurrent = /present|sekarang|current|now|saat ini|ongoing|kini/i.test(lower);

  // Split by common separators: "—", "-", "–", "to", "sampai", "s/d", "sd"
  const parts = raw.split(/\s*(?:—|–|-|to|sampai|s\/d|sd|\.\.\.)\s*/i);
  const startPart = parts[0] || '';
  const endPart = parts[1] || '';

  const extractMonthAndYear = (text: string) => {
    let month = '';
    let year = '';

    // Extract 4-digit year
    const yearMatch = text.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }

    // Extract month
    const cleanText = text.toLowerCase();
    for (const m of MONTHS_DATA) {
      const patterns = [
        m.idShort.toLowerCase(),
        m.enShort.toLowerCase(),
        m.idFull.toLowerCase(),
        m.enFull.toLowerCase()
      ];
      if (patterns.some(p => new RegExp(`\\b${p}\\b`, 'i').test(cleanText))) {
        month = m.value;
        break;
      }
    }

    // Also test numerical month like "01/2022" or "2022-01"
    if (!month) {
      const numMonthMatch = text.match(/\b(0[1-9]|1[0-2])[\/\-](?:19\d\d|20\d\d)\b/) ||
                            text.match(/\b(?:19\d\d|20\d\d)[\/\-](0[1-9]|1[0-2])\b/);
      if (numMonthMatch) {
        month = numMonthMatch[1];
      }
    }

    return { month, year };
  };

  const startParsed = extractMonthAndYear(startPart);
  const endParsed = extractMonthAndYear(endPart);

  return {
    startMonth: startParsed.month,
    startYear: startParsed.year,
    endMonth: isCurrent ? '' : endParsed.month,
    endYear: isCurrent ? '' : endParsed.year,
    isCurrent,
    isCustom: !startParsed.year && !isCurrent
  };
}
