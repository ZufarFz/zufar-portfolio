import { LayoutSettings } from './types';

export const themeBgMap: Record<string, string> = {
  emerald: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 shadow-emerald-500/10',
  blue: 'bg-blue-600 hover:bg-blue-500 border-blue-500 shadow-blue-500/10',
  slate: 'bg-slate-700 hover:bg-slate-600 border-slate-600 shadow-slate-500/10',
  indigo: 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 shadow-indigo-500/10',
  rose: 'bg-rose-600 hover:bg-rose-500 border-rose-500 shadow-rose-500/10',
  amber: 'bg-amber-600 hover:bg-amber-500 border-amber-500 shadow-amber-500/10',
};

export const textAccentMap: Record<string, string> = {
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
  slate: 'text-slate-400',
  indigo: 'text-indigo-400',
  rose: 'text-rose-500',
  amber: 'text-amber-500',
};

export const getLayoutStyles = (currentSettings: LayoutSettings) => {
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

  const mtb = currentSettings.marginTopBottom || 'sedang';
  const mlr = currentSettings.marginLeftRight || 'sedang';

  const paddingYClass = {
    sempit: 'py-5 sm:py-7',
    sedang: 'py-10 sm:py-14',
    lebar: 'py-14 sm:py-20'
  }[mtb];

  const paddingXClass = {
    sempit: 'px-5 sm:px-7',
    sedang: 'px-8 sm:px-12',
    lebar: 'px-12 sm:px-16'
  }[mlr];

  const printPaddingY = {
    sempit: '6mm',
    sedang: '12mm',
    lebar: '18mm'
  }[mtb];

  const printPaddingX = {
    sempit: '6mm',
    sedang: '10mm',
    lebar: '16mm'
  }[mlr];

  return { colors, fonts, fontSizes, spacings, paddingYClass, paddingXClass, printPaddingY, printPaddingX };
};

export type LayoutStyles = ReturnType<typeof getLayoutStyles>;

