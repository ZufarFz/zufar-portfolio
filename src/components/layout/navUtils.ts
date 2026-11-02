import { CVData } from '../../types';

// Helper to render active nav tab background
export function getActiveTabStyle(active: boolean, theme: 'light' | 'dark', activeCVData: CVData) {
  if (!active) return undefined;
  
  const opacity = parseFloat(activeCVData.webTexts?.navbar_active_bg_opacity || '1');
  let hexColor = theme === 'dark' 
    ? (activeCVData.webTexts?.navbar_active_bg_color_dark || '#3F4A52')
    : (activeCVData.webTexts?.navbar_active_bg_color || '#2F3C43');
  
  if (hexColor && !hexColor.startsWith('#') && !hexColor.startsWith('rgb')) {
    hexColor = '#' + hexColor;
  }

  const textColor = theme === 'dark'
    ? (activeCVData.webTexts?.navbar_active_color_dark || '#FFFFFF')
    : (activeCVData.webTexts?.navbar_active_color || '#FFFFFF');

  if (hexColor && hexColor.startsWith('#')) {
    let cleanHex = hexColor.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return {
          color: textColor,
          backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
          borderColor: 'transparent',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
        };
      }
    }
  }
  
  return {
    color: textColor,
    backgroundColor: hexColor,
    borderColor: 'transparent',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
  };
}
