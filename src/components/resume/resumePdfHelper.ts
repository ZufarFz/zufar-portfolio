export const getCircularBase64Image = (
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

export const ensureSafeColor = (value: string): string => {
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

// Convert Hex color to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  if (c.length !== 6) {
    return { h: 160, s: 80, l: 50 }; // fallback emerald
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Dynamically generate harmonized luminous gradient & glow based on current background & theme
export function getHarmonizedLineStyles(
  bgColor: string,
  isDark: boolean,
  themeColorSetting?: string,
  accentColorHex?: string
) {
  let targetHue = 160;
  let sat = 82;

  if (accentColorHex && accentColorHex.startsWith('#')) {
    const hsl = hexToHsl(accentColorHex);
    targetHue = hsl.h;
    sat = Math.max(hsl.s, 75);
  } else {
    let hex = bgColor ? bgColor.trim() : '';
    if (!hex.startsWith('#')) {
      hex = isDark ? '#181A1B' : '#F3F0E6';
    }
    const hsl = hexToHsl(hex);
    targetHue = hsl.h;

    // If background is nearly grayscale (saturation < 12%), use theme accent hue
    if (hsl.s < 12) {
      switch (themeColorSetting) {
        case 'rose': targetHue = 350; break;
        case 'amber': targetHue = 38; break;
        case 'emerald': targetHue = 160; break;
        case 'blue': targetHue = 215; break;
        case 'indigo': targetHue = 240; break;
        case 'slate': targetHue = 210; break;
        default: targetHue = isDark ? 160 : 38;
      }
      sat = 85;
    } else {
      sat = Math.max(hsl.s, 78);
    }
  }

  const primaryLightness = isDark ? 54 : 46;
  const highlightLightness = isDark ? 82 : 74;

  return {
    hue: targetHue,
    background: `linear-gradient(90deg, hsl(${targetHue}, ${sat}%, ${primaryLightness}%), hsl(${targetHue}, 95%, ${highlightLightness}%), hsl(${targetHue}, ${sat}%, ${primaryLightness}%))`,
    boxShadow: `0 2px 14px rgba(0, 0, 0, 0.8), 0 0 28px hsl(${targetHue} 90% ${primaryLightness}% / 0.95), 0 0 10px hsl(${targetHue} 95% ${highlightLightness}% / 1)`,
    sparkColor: `hsl(${targetHue}, 95%, 96%)`,
    sparkShadow: `0 0 12px #ffffff, 0 0 20px hsl(${targetHue} 95% ${highlightLightness}% / 1)`,
  };
}

