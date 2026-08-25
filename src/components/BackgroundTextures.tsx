import React from 'react';

export interface BackgroundTexturesProps {
  type?: string;
  theme: 'light' | 'dark';
  opacity?: number;
  scale?: number;
  color?: string;
  customSvg?: string;
  customBgUrl?: string;
}

export interface BgPatternOption {
  id: string;
  label: string;
  desc: string;
  badge?: string;
}

export interface BgPatternGroup {
  name: string;
  icon: string;
  badge: string;
  options: BgPatternOption[];
}

export const BG_PATTERN_GROUPS: BgPatternGroup[] = [
  {
    name: '⛩️ Motif Tradisional Jepang (Japanese Wagara)',
    icon: '⛩️',
    badge: '13 Motif Jepang',
    options: [
      { id: 'pattern_japanese_clouds', label: 'Kumo to Nami ☁️🌊', desc: 'Awan swirl Ukiyo-e & ombak alir tradisional', badge: 'Pilihan Populer' },
      { id: 'pattern_seigaiha', label: 'Seigaiha Wave 🌊', desc: 'Gelombang ombak konsentris keberuntungan' },
      { id: 'pattern_asanoha', label: 'Asanoha Leaf 🍃', desc: 'Motif geometris bintang daun rami (Hemp leaf)' },
      { id: 'pattern_sakura', label: 'Sakura Blizzard 🌸', desc: 'Bunga sakura & kelopak berterbangan' },
      { id: 'pattern_yagasuri', label: 'Yagasuri Arrow 🏹', desc: 'Bulu anak panah melesat lurus (Keteguhan)' },
      { id: 'pattern_karakusa', label: 'Karakusa Vines 🌿', desc: 'Sulur tanaman abadi & pusaran daun' },
      { id: 'pattern_sayagata', label: 'Sayagata Key ⛩️', desc: 'Kunci kisi manji geometris bersambung' },
      { id: 'pattern_shippo', label: 'Shippou Jewels 🔮', desc: 'Tujuh permata lingkaran harmoni abadi' },
      { id: 'pattern_kikko', label: 'Kikko Tortoise 🐢', desc: 'Tempurung kura-kura heksagonal (Umur panjang)' },
      { id: 'pattern_uroko', label: 'Uroko Scales 🐉', desc: 'Sisik naga segitiga penangkal bala' },
      { id: 'pattern_kanoko', label: 'Kanoko Shibori 🦌', desc: 'Tutul bintik rusa celup ikat tradisional' },
      { id: 'pattern_igeta', label: 'Igeta Kasuri 🎋', desc: 'Kisi sumur tradisional kain indigo' },
      { id: 'pattern_bamboo_weave', label: 'Kagome Bamboo 🎍', desc: 'Anyaman bambu bintang heksagonal' }
    ]
  },
  {
    name: '✨ Pola Geometris Modern (SVG Geometric)',
    icon: '✨',
    badge: '10 Pola Geometris',
    options: [
      { id: 'pattern_honeycomb', label: 'Honeycomb Matrix ⬡', desc: 'Sarang lebah heksagonal ganda' },
      { id: 'pattern_topography', label: 'Topography Map 🗺️', desc: 'Garis kontur elevasi organik' },
      { id: 'pattern_circuit', label: 'PCB Cyber Circuit ⚡', desc: 'Jalur sirkuit digital & node data' },
      { id: 'pattern_moroccan', label: 'Moroccan Quatrefoil 🕌', desc: 'Arsitektur ubin arabesque' },
      { id: 'pattern_isometric_cubes', label: '3D Tumbling Cubes 🧊', desc: 'Kisi kubus 3D isometrik' },
      { id: 'pattern_chevron', label: 'Chevron Herringbone 🪚', desc: 'Anyaman zigzag geometris' },
      { id: 'pattern_constellation', label: 'Constellation Stars ✨', desc: 'Jaringan rasi bintang & neural node' },
      { id: 'pattern_diamonds', label: 'Diamond Rhombus 💎', desc: 'Kisi jaring berlian modern' },
      { id: 'pattern_crosshatch', label: 'Blueprint Crosshatch 📐', desc: 'Kisi drafting teknik arsitektural' },
      { id: 'pattern_waves_sinusoid', label: 'Sine Waveforms 〰️', desc: 'Gelombang sinus kontinu analitik' }
    ]
  },
  {
    name: '🎨 Tekstur Mewah & Watercolor',
    icon: '🎨',
    badge: '4 Tekstur',
    options: [
      { id: 'watercolor_blush', label: 'Watercolor Blush 🌸', desc: 'Soft pink & peach with gold accents' },
      { id: 'watercolor_gold', label: 'Earthy Gold Marble ✨', desc: 'Earthy beige with kintsugi gold veins' },
      { id: 'watercolor_pastel', label: 'Pastel Dream Glow 🎨', desc: 'Lavender, apricot & baby blue' },
      { id: 'watercolor_sunset', label: 'Sunset Crimson 🌅', desc: 'Coral gradient with gold rings' }
    ]
  },
  {
    name: '🔲 Minimalis & Pilihan Standar',
    icon: '🔲',
    badge: '6 Opsi',
    options: [
      { id: 'none', label: 'Polos / None (Default Solid)', desc: 'Tanpa pola overlay tambahan' },
      { id: 'dots', label: 'Pattern Titik (Radial Dots)', desc: 'Overlay titik-titik radial rapi' },
      { id: 'grid', label: 'Engine Grid Layout', desc: 'Kisi blueprint kotak-kotak presisi' },
      { id: 'ambient', label: 'Ambient Glow', desc: 'Pendaran orb warna lembut blurred' },
      { id: 'abstract', label: 'Diagonal Lines', desc: 'Garis silang diagonal berpotongan' },
      { id: 'custom_svg_pattern', label: 'Custom SVG Markup', desc: 'Gunakan kode SVG kustom langsung' },
      { id: 'custom_upload', label: 'Unggah Gambar (Watermark)', desc: 'Gambar watermark kustom' }
    ]
  }
];

export default function BackgroundTextures({ 
  type = 'none', 
  theme, 
  opacity,
  scale = 1,
  color,
  customSvg,
  customBgUrl
}: BackgroundTexturesProps) {
  // Dynamically detect mobile view to disable heavy real-time SVG turbulence/pulse animations
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDark = theme === 'dark';

  // Common container with smooth transition
  const baseClass = `absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${
    isMobile ? 'transition-opacity duration-200' : 'transition-all duration-500'
  }`;

  // Default opacity multipliers based on theme and pattern category
  const defaultPatternOpacity = isDark ? 0.22 : 0.18;
  const activeOpacity = opacity !== undefined ? opacity : defaultPatternOpacity;
  const defaultStrokeColor = color || (isDark ? '#94a3b8' : '#475569');
  const scaleVal = Math.max(0.2, Math.min(scale || 1, 4));

  // Unique ID prefix for SVG pattern defs to prevent collision across elements
  const patternId = React.useId().replace(/:/g, '');

  // 1. SVG PATTERN: SEIGAIHA (Gelombang Ombak Jepang / Japanese Scallop Waves) - Exact match to user uploaded Image 2
  if (type === 'pattern_seigaiha') {
    const pId = `p_seigaiha_${patternId}`;
    // 4 well-spaced concentric rings with generous intervals to prevent overcrowding (tidak terlalu ramai)
    const radii = [40, 29, 18, 7];
    const fanBg = isDark ? '#090d16' : '#ffffff';

    // Helper to render a single Seigaiha fan (half-circle arches only)
    const renderFan = (cx: number, cy: number, key: string) => (
      <g key={key}>
        {/* Opaque Fan Base (Only top half-circle) to cleanly overlap lower layers like in traditional Seigaiha */}
        <path
          d={`M ${cx - 40},${cy} A 40,40 0 0,1 ${cx + 40},${cy} Z`}
          fill={fanBg}
        />
        {/* Concentric Semi-Circle Arches */}
        {radii.map((r, i) => (
          <path
            key={i}
            d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
            fill="none"
            stroke={defaultStrokeColor}
            strokeWidth={i === 0 ? "1.6" : "1.2"}
            strokeLinecap="round"
          />
        ))}
      </g>
    );

    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="80" 
              height="40" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              {/* Ordered top-to-bottom so subsequent rows overlap naturally */}
              {/* Row -1 (y = -20) */}
              {renderFan(0, -20, 'f_0_m20')}
              {renderFan(80, -20, 'f_80_m20')}

              {/* Row 0 (y = 0) */}
              {renderFan(40, 0, 'f_40_0')}
              {renderFan(-40, 0, 'f_m40_0')}
              {renderFan(120, 0, 'f_120_0')}

              {/* Row 1 (y = 20) */}
              {renderFan(0, 20, 'f_0_20')}
              {renderFan(80, 20, 'f_80_20')}
              {renderFan(-80, 20, 'f_m80_20')}
              {renderFan(160, 20, 'f_160_20')}

              {/* Row 2 (y = 40) */}
              {renderFan(40, 40, 'f_40_40')}
              {renderFan(-40, 40, 'f_m40_40')}
              {renderFan(120, 40, 'f_120_40')}

              {/* Row 3 (y = 60 for seamless bottom tile transition) */}
              {renderFan(0, 60, 'f_0_60')}
              {renderFan(80, 60, 'f_80_60')}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.1 JAPANESE PATTERN: KUMO TO NAMI (Awan Swirl Ukiyo-e & Ombak Alir Tradisional) - Exact match to user uploaded Image 1
  if (type === 'pattern_japanese_clouds' || type === 'pattern_kumo') {
    const pId = `p_kumo_${patternId}`;
    const symbolMainId = `c_main_${patternId}`;
    const symbolMiniId = `c_mini_${patternId}`;
    
    // Cloud fill: pure solid white in light mode, high-contrast bright in dark mode
    const cloudFill = isDark ? '#f8fafc' : '#ffffff';
    const cloudStroke = isDark ? '#0f172a' : (color || '#334155');
    const waveStroke = defaultStrokeColor;

    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* VOLUMINOUS MAIN JAPANESE CLOUD WITH SHARP POINTY TAIL TIPS & INNER SWIRLS */}
            <g id={symbolMainId}>
              {/* Outer Cloud Silhouette - High Volume Lobes & Sharp Pointy Tapered Tail Ends */}
              <path 
                d="M -42,16 
                   C -30,12 -18,12 0,12 
                   C 18,12 30,12 42,14 
                   C 48,15 52,14 54,12 
                   C 55,9 50,6 44,5 
                   C 48,-1 45,-9 36,-11 
                   C 32,-12 28,-9 26,-6 
                   C 28,-18 18,-28 4,-28 
                   C -10,-28 -18,-18 -14,-7 
                   C -20,-8 -28,-3 -28,6 
                   C -28,10 -34,13 -42,16 Z" 
                fill={cloudFill} 
                stroke={cloudStroke} 
                strokeWidth="1.8" 
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Central Main Voluminous Swirl Spiral */}
              <path 
                d="M 4,-28 
                   C -4,-28 -10,-20 -8,-10 
                   C -6,-2 2,2 8,0 
                   C 13,-2 15,-8 12,-13 
                   C 10,-16 5,-16 3,-13 
                   C 1,-10 4,-7 7,-8" 
                fill="none" 
                stroke={cloudStroke} 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
              {/* Right Lobe Swirl Spiral */}
              <path 
                d="M 36,-11 
                   C 30,-7 26,0 30,6 
                   C 33,10 38,9 41,6 
                   C 43,3 41,0 38,0 
                   C 36,0 35,2 36,4" 
                fill="none" 
                stroke={cloudStroke} 
                strokeWidth="1.3" 
                strokeLinecap="round"
              />
              {/* Sharp Left Pointy Tail Accent Line */}
              <path 
                d="M -42,16 
                   C -32,13 -22,11 -12,11" 
                fill="none" 
                stroke={cloudStroke} 
                strokeWidth="1.2" 
                strokeLinecap="round"
              />
              {/* Left Body Subtle Swirl Accent */}
              <path 
                d="M -28,6 
                   C -22,5 -18,7 -17,10" 
                fill="none" 
                stroke={cloudStroke} 
                strokeWidth="1.2" 
                strokeLinecap="round"
              />
            </g>

            {/* VOLUMINOUS MINI JAPANESE CLOUD */}
            <g id={symbolMiniId}>
              <path 
                d="M -24,9 
                   C -16,7 -10,7 0,7 
                   C 10,7 16,7 24,8 
                   C 28,9 30,8 31,6 
                   C 31,4 27,2 23,2 
                   C 26,-2 23,-7 17,-8 
                   C 15,-8 13,-6 12,-4 
                   C 13,-12 7,-17 -2,-17 
                   C -9,-17 -14,-11 -11,-4 
                   C -15,-5 -20,-2 -20,3 
                   C -20,6 -23,8 -24,9 Z" 
                fill={cloudFill} 
                stroke={cloudStroke} 
                strokeWidth="1.6" 
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path 
                d="M -2,-17 
                   C -7,-17 -10,-12 -8,-6 
                   C -7,-1 -2,1 2,0 
                   C 5,-1 6,-5 4,-8 
                   C 3,-9 0,-9 -1,-8" 
                fill="none" 
                stroke={cloudStroke} 
                strokeWidth="1.3" 
                strokeLinecap="round"
              />
              <path 
                d="M -24,9 C -17,7 -12,6 -5,6" 
                fill="none" 
                stroke={cloudStroke} 
                strokeWidth="1.1" 
                strokeLinecap="round" 
              />
            </g>

            {/* SEAMLESS PATTERN CANVAS (180 x 220) */}
            <pattern 
              id={pId} 
              width="180" 
              height="220" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              {/* 1. BACKGROUND LAYER: Flowing Layered Japanese Wave Ridges (Nami) - Strictly placed UNDER clouds */}
              <g fill="none" stroke={waveStroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.65">
                {/* Wave Tier 1 */}
                <path d="M-10,25 C35,10 70,40 115,18 C145,8 170,22 190,25" />
                <path d="M-10,38 C40,24 75,52 120,32 C150,20 175,34 190,38" />
                <path d="M-10,52 C45,40 80,65 125,46 C155,34 178,48 190,52" />

                {/* Wave Tier 2 */}
                <path d="M-10,80 C30,65 65,95 110,72 C140,58 165,74 190,80" />
                <path d="M-10,94 C35,80 70,108 115,86 C145,72 170,88 190,94" />
                <path d="M-10,108 C40,96 75,120 120,100 C150,86 175,102 190,108" />

                {/* Wave Tier 3 */}
                <path d="M-10,135 C35,120 70,150 115,128 C145,118 170,132 190,135" />
                <path d="M-10,148 C40,134 75,162 120,142 C150,130 175,144 190,148" />
                <path d="M-10,162 C45,150 80,175 125,156 C155,144 178,158 190,162" />

                {/* Wave Tier 4 */}
                <path d="M-10,190 C30,175 65,205 110,182 C140,168 165,184 190,190" />
                <path d="M-10,204 C35,190 70,218 115,196 C145,182 170,198 190,204" />
                <path d="M-10,218 C40,206 75,230 120,210 C150,196 175,212 190,218" />
              </g>

              {/* 2. TOP LAYER: ALL CLOUDS RENDERED ON TOP - 100% UNBROKEN WITH SEAMLESS 4-WAY BORDER WRAPPING */}
              <g id="clouds_top_layer">
                {/* Main Cloud A: Center-Left at (50, 65) + border wrap duplicates */}
                <use href={`#${symbolMainId}`} x="50" y="65" />
                <use href={`#${symbolMainId}`} x="230" y="65" />
                <use href={`#${symbolMainId}`} x="-130" y="65" />

                {/* Main Cloud B: Center-Right offset at (140, 175) + border wrap duplicates */}
                <use href={`#${symbolMainId}`} x="140" y="175" />
                <use href={`#${symbolMainId}`} x="-40" y="175" />
                <use href={`#${symbolMainId}`} x="320" y="175" />
                {/* Vertical wrap for Main Cloud B (y=175 -> y=-45) */}
                <use href={`#${symbolMainId}`} x="140" y="-45" />
                <use href={`#${symbolMainId}`} x="-40" y="-45" />
                <use href={`#${symbolMainId}`} x="320" y="-45" />
                {/* Bottom wrap for Main Cloud B (y=175 -> y=395) */}
                <use href={`#${symbolMainId}`} x="140" y="395" />

                {/* Mini Cloud 1: at (140, 60) + border wrap duplicates */}
                <use href={`#${symbolMiniId}`} x="140" y="60" />
                <use href={`#${symbolMiniId}`} x="-40" y="60" />
                <use href={`#${symbolMiniId}`} x="320" y="60" />

                {/* Mini Cloud 2: at (45, 170) + border wrap duplicates */}
                <use href={`#${symbolMiniId}`} x="45" y="170" />
                <use href={`#${symbolMiniId}`} x="225" y="170" />
                <use href={`#${symbolMiniId}`} x="-135" y="170" />
                {/* Vertical wrap for Mini Cloud 2 (y=170 -> y=-50) */}
                <use href={`#${symbolMiniId}`} x="45" y="-50" />
                <use href={`#${symbolMiniId}`} x="225" y="-50" />
                <use href={`#${symbolMiniId}`} x="-135" y="-50" />

                {/* Extra Mini Accent Clouds between waves */}
                <use href={`#${symbolMiniId}`} x="90" y="118" />
                <use href={`#${symbolMiniId}`} x="270" y="118" />
                <use href={`#${symbolMiniId}`} x="-90" y="118" />

                <use href={`#${symbolMiniId}`} x="90" y="228" />
                <use href={`#${symbolMiniId}`} x="90" y="8" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.2 JAPANESE PATTERN: ASANOHA (Daun Rami / Hemp Leaf - 麻の葉)
  if (type === 'pattern_asanoha') {
    const pId = `p_asanoha_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="60" 
              height="104" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
                {/* Outer Hexagon Grid & Internal Star of Asanoha (6 triangles per hexagon) */}
                <path d="M30,0 L60,17.3 L60,52 L30,69.3 L0,52 L0,17.3 Z" />
                <path d="M30,34.6 L30,0 M30,34.6 L60,17.3 M30,34.6 L60,52 M30,34.6 L30,69.3 M30,34.6 L0,52 M30,34.6 L0,17.3" />
                <path d="M30,0 L0,52 M30,0 L60,52 M60,17.3 L0,17.3 M60,52 L0,52 M30,69.3 L0,17.3 M30,69.3 L60,17.3" />

                {/* Shifted row for seamless tiling */}
                <path d="M0,52 L30,69.3 L30,104 L0,121.3 L-30,104 L-30,69.3 Z" />
                <path d="M0,86.6 L0,52 M0,86.6 L30,69.3 M0,86.6 L30,104 M0,86.6 L0,121.3 M0,86.6 L-30,104 M0,86.6 L-30,69.3" />
                <path d="M0,52 L-30,104 M0,52 L30,104 M30,69.3 L-30,69.3 M30,104 L-30,104 M0,121.3 L-30,69.3 M0,121.3 L30,69.3" />

                <path d="M60,52 L90,69.3 L90,104 L60,121.3 L30,104 L30,69.3 Z" />
                <path d="M60,86.6 L60,52 M60,86.6 L90,69.3 M60,86.6 L90,104 M60,86.6 L60,121.3 M60,86.6 L30,104 M60,86.6 L30,69.3" />
                <path d="M60,52 L30,104 M60,52 L90,104 M90,69.3 L30,69.3 M90,104 L30,104 M60,121.3 L30,69.3 M60,121.3 L90,69.3" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.3 JAPANESE PATTERN: YAGASURI (Bulu Panah Tradisional / Arrow Feathers - 矢絣)
  if (type === 'pattern_yagasuri') {
    const pId = `p_yagasuri_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="40" 
              height="80" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill={defaultStrokeColor} opacity="0.8">
                {/* Arrow V-shape feathers left column */}
                <polygon points="0,0 20,20 20,40 0,20" />
                <polygon points="20,20 0,40 0,60 20,40" />
                <polygon points="0,40 20,60 20,80 0,60" />
                <polygon points="20,60 0,80 0,100 20,80" />

                {/* Arrow V-shape feathers right column alternating */}
                <polygon points="20,0 40,20 40,40 20,20" opacity="0.45" />
                <polygon points="40,20 20,40 20,60 40,40" opacity="0.45" />
                <polygon points="20,40 40,60 40,80 20,60" opacity="0.45" />
                <polygon points="40,60 20,80 20,100 40,80" opacity="0.45" />
              </g>
              {/* Shaft Center lines */}
              <line x1="20" y1="0" x2="20" y2="80" stroke={defaultStrokeColor} strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="80" stroke={defaultStrokeColor} strokeWidth="1" />
              <line x1="40" y1="0" x2="40" y2="80" stroke={defaultStrokeColor} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.4 JAPANESE PATTERN: KARAKUSA (Sulur Daun & Spiral Arabesque - 唐草)
  if (type === 'pattern_karakusa') {
    const pId = `p_karakusa_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="90" 
              height="90" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4" strokeLinecap="round">
                {/* Central Winding Vines */}
                <path d="M0,45 C20,20 35,70 55,45 C75,20 90,70 90,45" />
                <path d="M45,0 C20,20 70,35 45,55 C20,75 70,90 45,90" />
                {/* Spiral Tendrils */}
                <path d="M25,32 C20,25 22,18 28,18 C33,18 36,22 34,26 C32,29 28,29 27,27" />
                <path d="M65,58 C60,65 62,72 68,72 C73,72 76,68 74,64 C72,61 68,61 67,63" />
                <path d="M32,65 C25,60 18,62 18,68 C18,73 22,76 26,74 C29,72 29,68 27,67" />
                <path d="M58,25 C65,20 72,22 72,28 C72,33 68,36 64,34 C61,32 61,28 63,27" />
                {/* Karakusa Leaf Sprouts */}
                <path d="M12,42 C8,35 15,30 20,36 Z" fill={defaultStrokeColor} />
                <path d="M78,48 C82,55 75,60 70,54 Z" fill={defaultStrokeColor} />
                <path d="M42,12 C35,8 30,15 36,20 Z" fill={defaultStrokeColor} />
                <path d="M48,78 C55,82 60,75 54,70 Z" fill={defaultStrokeColor} />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.5 JAPANESE PATTERN: SAYAGATA (Kunci Swastika Manji Bersambung - 紗綾形)
  if (type === 'pattern_sayagata') {
    const pId = `p_sayagata_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="60" 
              height="60" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
                {/* Interlocking Sayagata Geometry */}
                <path d="M0,15 L15,15 L15,0 L30,0 L30,30 L0,30" />
                <path d="M30,0 L45,0 L45,15 L60,15" />
                <path d="M0,45 L15,45 L15,60 L30,60 L30,30 L60,30 L60,60 L45,60 L45,45" />
                <path d="M30,30 L45,30 L45,45" />
                <path d="M15,15 L15,30 L30,30" />
                <path d="M45,15 L45,30" />
                <path d="M15,45 L0,45" />
                <path d="M60,45 L45,45" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.6 JAPANESE PATTERN: SAKURA (Bunga Sakura & Pusaran Kelopak Musim Semi - 桜吹雪)
  if (type === 'pattern_sakura') {
    const pId = `p_sakura_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="100" 
              height="100" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              {/* Soft Spring Breeze lines */}
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5">
                <path d="M0,20 C30,10 60,40 100,25" />
                <path d="M0,70 C40,55 70,85 100,75" />
              </g>

              {/* Full Sakura 5-Petal Flower 1 (at 40, 45) */}
              <g transform="translate(40, 45) scale(0.95)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinejoin="round">
                {/* 5 notched Sakura Petals */}
                {[0, 72, 144, 216, 288].map((angle, idx) => (
                  <g key={idx} transform={`rotate(${angle})`}>
                    <path d="M0,0 C-5,-10 -8,-16 -3,-20 C-1,-21 0,-18 0,-18 C0,-18 1,-21 3,-20 C8,-16 5,-10 0,0 Z" />
                    <line x1="0" y1="-5" x2="0" y2="-12" strokeWidth="0.8" />
                  </g>
                ))}
                <circle cx="0" cy="0" r="2.5" fill={defaultStrokeColor} />
              </g>

              {/* Small floating individual Sakura Petals */}
              <g transform="translate(15, 15) rotate(25)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
                <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
              </g>

              <g transform="translate(85, 20) rotate(-40)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
                <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
              </g>

              <g transform="translate(85, 80) rotate(70)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
                <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
              </g>

              <g transform="translate(10, 85) rotate(-15)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
                <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.7 JAPANESE PATTERN: SHIPPOU (Tujuh Permata Lingkaran Bersambung - 七宝)
  if (type === 'pattern_shippo' || type === 'pattern_shippou') {
    const pId = `p_shippou_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="60" 
              height="60" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4">
                {/* Overlapping circular arcs creating 4-petal ellipses */}
                <circle cx="30" cy="30" r="30" />
                <circle cx="0" cy="0" r="30" />
                <circle cx="60" cy="0" r="30" />
                <circle cx="0" cy="60" r="30" />
                <circle cx="60" cy="60" r="30" />
                {/* Inner small jewel accents */}
                <circle cx="30" cy="30" r="2.5" fill={defaultStrokeColor} />
                <circle cx="0" cy="0" r="2" fill={defaultStrokeColor} />
                <circle cx="60" cy="0" r="2" fill={defaultStrokeColor} />
                <circle cx="0" cy="60" r="2" fill={defaultStrokeColor} />
                <circle cx="60" cy="60" r="2" fill={defaultStrokeColor} />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.8 JAPANESE PATTERN: KIKKO (Tempurung Kura-kura / Tortoise Shell Hex - 亀甲)
  if (type === 'pattern_kikko') {
    const pId = `p_kikko_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="52" 
              height="90" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinejoin="round">
                {/* Outer Tortoise Shell Hexagons */}
                <polygon points="26,0 52,15 52,45 26,60 0,45 0,15" />
                <polygon points="0,45 26,60 26,90 0,105 -26,90 -26,60" />
                <polygon points="52,45 78,60 78,90 52,105 26,90 26,60" />
                {/* Inner Bishamon Tri-star / Concentric Hex */}
                <polygon points="26,8 45,19 45,41 26,52 7,41 7,19" strokeWidth="0.9" />
                <circle cx="26" cy="30" r="3" fill={defaultStrokeColor} />
                <circle cx="0" cy="75" r="2.5" fill={defaultStrokeColor} />
                <circle cx="52" cy="75" r="2.5" fill={defaultStrokeColor} />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.9 JAPANESE PATTERN: UROKO (Sisik Naga / Dragon Scales - 鱗)
  if (type === 'pattern_uroko') {
    const pId = `p_uroko_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="48" 
              height="41.56" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g stroke={defaultStrokeColor} strokeWidth="1.2" strokeLinejoin="round">
                {/* Alternating Filled & Outlined Equilateral Triangles */}
                <polygon points="24,0 48,41.56 0,41.56" fill={defaultStrokeColor} opacity="0.35" />
                <polygon points="0,0 24,0 12,20.78" fill="none" />
                <polygon points="24,0 48,0 36,20.78" fill="none" />
                <polygon points="12,20.78 36,20.78 24,41.56" fill="none" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.10 JAPANESE PATTERN: KANOKO SHIBORI (Tutul Rusa Tradisional - 鹿の子絞り)
  if (type === 'pattern_kanoko') {
    const pId = `p_kanoko_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="36" 
              height="36" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g stroke={defaultStrokeColor} strokeWidth="1.1" fill="none">
                {/* Diamond Box 1 with center dot */}
                <polygon points="18,4 30,18 18,32 6,18" />
                <circle cx="18" cy="18" r="2.5" fill={defaultStrokeColor} stroke="none" />

                {/* Corner offset diamonds for seamless shift */}
                <polygon points="0,-14 12,0 0,14 -12,0" />
                <circle cx="0" cy="0" r="2" fill={defaultStrokeColor} stroke="none" />
                <polygon points="36,-14 48,0 36,14 24,0" />
                <circle cx="36" cy="0" r="2" fill={defaultStrokeColor} stroke="none" />
                <polygon points="0,22 12,36 0,50 -12,36" />
                <circle cx="0" cy="36" r="2" fill={defaultStrokeColor} stroke="none" />
                <polygon points="36,22 48,36 36,50 24,36" />
                <circle cx="36" cy="36" r="2" fill={defaultStrokeColor} stroke="none" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 1.11 JAPANESE PATTERN: IGETA / KASURI (Kisi Sumur Tradisional - 井桁)
  if (type === 'pattern_igeta') {
    const pId = `p_igeta_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="44" 
              height="44" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.8" strokeLinecap="square">
                {/* Traditional Japanese '#' Well frame symbol */}
                <line x1="8" y1="16" x2="36" y2="16" />
                <line x1="8" y1="28" x2="36" y2="28" />
                <line x1="16" y1="8" x2="16" y2="36" />
                <line x1="28" y1="8" x2="28" y2="36" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 2. SVG PATTERN: HONEYCOMB (Sarang Lebah Heksagonal Ganda) - As in user uploaded image 2
  if (type === 'pattern_honeycomb') {
    const pId = `p_honeycomb_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="56" 
              height="96" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              {/* Outer Hexagon Interlocking Grid Lines */}
              <path 
                d="M28,0 L28,16 L0,32 L0,64 L28,80 L28,96 M0,64 L-28,48 L-28,16 L0,0 M28,16 L56,32 L56,64 L28,80 M56,32 L84,16 M56,64 L84,80" 
                fill="none" 
                stroke={defaultStrokeColor} 
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner Concentric Hexagons (Image 2 style) */}
              <polygon 
                points="28,26 46,36.5 46,59.5 28,70 10,59.5 10,36.5" 
                fill="none" 
                stroke={defaultStrokeColor} 
                strokeWidth="1.1" 
                strokeLinejoin="round"
              />
              <polygon 
                points="0,-22 18,-11.5 18,11.5 0,22 -18,11.5 -18,-11.5" 
                fill="none" 
                stroke={defaultStrokeColor} 
                strokeWidth="1.1" 
                strokeLinejoin="round"
              />
              <polygon 
                points="56,-22 74,-11.5 74,11.5 56,22 38,11.5 38,-11.5" 
                fill="none" 
                stroke={defaultStrokeColor} 
                strokeWidth="1.1" 
                strokeLinejoin="round"
              />
              <polygon 
                points="0,74 18,84.5 18,107.5 0,118 -18,107.5 -18,84.5" 
                fill="none" 
                stroke={defaultStrokeColor} 
                strokeWidth="1.1" 
                strokeLinejoin="round"
              />
              <polygon 
                points="56,74 74,84.5 74,107.5 56,118 38,107.5 38,84.5" 
                fill="none" 
                stroke={defaultStrokeColor} 
                strokeWidth="1.1" 
                strokeLinejoin="round"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 3. SVG PATTERN: TOPOGRAPHY (Garis Kontur Topografi Organik / Elevation Contours)
  if (type === 'pattern_topography') {
    const pId = `p_topography_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="160" 
              height="160" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0,20 C40,10 60,50 100,30 C140,10 150,40 160,20" />
                <path d="M0,45 C35,35 65,75 105,55 C135,35 145,65 160,45" />
                <path d="M0,70 C30,60 70,100 110,80 C130,60 140,90 160,70" />
                <path d="M0,95 C25,85 75,125 115,105 C125,85 135,115 160,95" />
                <path d="M0,120 C20,110 80,150 120,130 C130,110 145,135 160,120" />
                <path d="M0,145 C15,135 85,175 125,155 C135,135 150,155 160,145" />
                {/* Cross Contours */}
                <path d="M40,0 C30,40 70,60 50,100 C30,140 60,150 40,160" />
                <path d="M120,0 C110,40 150,60 130,100 C110,140 140,150 120,160" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 4. SVG PATTERN: CIRCUIT (Digital Circuit Board PCB & Data Nodes)
  if (type === 'pattern_circuit') {
    const pId = `p_circuit_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="100" 
              height="100" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                {/* Circuit Bus lines & 45 degree bends */}
                <path d="M0,20 L30,20 L45,35 L75,35 L85,25 L100,25" />
                <path d="M20,0 L20,30 L35,45 L35,80 L50,95 L50,100" />
                <path d="M0,75 L25,75 L40,60 L70,60 L80,70 L100,70" />
                <path d="M80,0 L80,20 L65,35 L65,70 L80,85 L80,100" />
                <path d="M45,45 L55,45 L55,55 L45,55 Z" strokeWidth="1.5" />
              </g>
              {/* Circuit Micro Nodes */}
              <g fill={defaultStrokeColor}>
                <circle cx="30" cy="20" r="2.5" />
                <circle cx="75" cy="35" r="2.5" />
                <circle cx="20" cy="30" r="2.5" />
                <circle cx="35" cy="80" r="2.5" />
                <circle cx="25" cy="75" r="2.5" />
                <circle cx="70" cy="60" r="2.5" />
                <circle cx="80" cy="20" r="2.5" />
                <circle cx="65" cy="70" r="2.5" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 5. SVG PATTERN: MOROCCAN (Arsitektural Moroccan Quatrefoil Tiles)
  if (type === 'pattern_moroccan') {
    const pId = `p_moroccan_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="60" 
              height="60" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinecap="round">
                <path d="M30,0 C30,12 18,12 18,30 C18,48 30,48 30,60 C30,48 42,48 42,30 C42,12 30,12 30,0 Z" />
                <path d="M0,30 C12,30 12,18 30,18 C48,18 48,30 60,30 C48,30 48,42 30,42 C12,42 12,30 0,30 Z" />
                <circle cx="30" cy="30" r="4" fill={defaultStrokeColor} />
                <circle cx="0" cy="0" r="3" />
                <circle cx="60" cy="0" r="3" />
                <circle cx="0" cy="60" r="3" />
                <circle cx="60" cy="60" r="3" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 6. SVG PATTERN: ISOMETRIC CUBES (Kisi Kubus 3D Isometrik / Tumbling Cubes)
  if (type === 'pattern_isometric_cubes') {
    const pId = `p_isocubes_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="60" 
              height="104" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.2" strokeLinejoin="round">
                {/* Cube 1 */}
                <path d="M30,0 L60,17.3 L60,52 L30,69.3 L0,52 L0,17.3 Z" />
                <path d="M30,34.6 L30,69.3 M30,34.6 L0,17.3 M30,34.6 L60,17.3" />
                {/* Cube 2 shifted */}
                <path d="M0,52 L30,69.3 L30,104 L0,121.3 L-30,104 L-30,69.3 Z" />
                <path d="M0,86.6 L0,121.3 M0,86.6 L-30,69.3 M0,86.6 L30,69.3" />
                {/* Cube 3 shifted right */}
                <path d="M60,52 L90,69.3 L90,104 L60,121.3 L30,104 L30,69.3 Z" />
                <path d="M60,86.6 L60,121.3 M60,86.6 L30,69.3 M60,86.6 L90,69.3" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 7. SVG PATTERN: CHEVRON (Herringbone / Anyaman Zigzag Geometris)
  if (type === 'pattern_chevron') {
    const pId = `p_chevron_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="40" 
              height="40" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M0,10 L20,30 L40,10" />
                <path d="M0,-10 L20,10 L40,-10" />
                <path d="M0,30 L20,50 L40,30" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 8. SVG PATTERN: CONSTELLATION (Jaringan Bintang & Node Data)
  if (type === 'pattern_constellation') {
    const pId = `p_constellation_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="120" 
              height="120" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3">
                <path d="M20,30 L60,15 L95,45 L75,90 L30,85 Z" />
                <path d="M60,15 L75,90 M20,30 L95,45" />
                <path d="M0,60 L20,30 M95,45 L120,60 M30,85 L60,120 M75,90 L60,120" />
              </g>
              <g fill={defaultStrokeColor}>
                <circle cx="20" cy="30" r="3" />
                <circle cx="60" cy="15" r="2.2" />
                <circle cx="95" cy="45" r="3" />
                <circle cx="75" cy="90" r="2.6" />
                <circle cx="30" cy="85" r="2.2" />
                <circle cx="0" cy="60" r="2" />
                <circle cx="120" cy="60" r="2" />
                <circle cx="60" cy="120" r="2" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 9. SVG PATTERN: DIAMONDS (Kisi Berlian Geometris / Diamond Rhombus Mesh)
  if (type === 'pattern_diamonds') {
    const pId = `p_diamonds_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="48" 
              height="72" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
                <polygon points="24,0 48,36 24,72 0,36" />
                <polygon points="24,8 40,36 24,64 8,36" strokeWidth="0.8" />
                <circle cx="24" cy="36" r="2" fill={defaultStrokeColor} />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 10. SVG PATTERN: BAMBOO WEAVE (Anyaman Tradisional Kagome / Star Lattice)
  if (type === 'pattern_bamboo_weave') {
    const pId = `p_kagome_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="60" 
              height="52" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4" strokeLinecap="round">
                {/* Horizontal & Diagonal Tri-axial Weave lines */}
                <line x1="0" y1="0" x2="60" y2="0" />
                <line x1="0" y1="26" x2="60" y2="26" />
                <line x1="0" y1="52" x2="60" y2="52" />
                
                <line x1="0" y1="0" x2="60" y2="52" />
                <line x1="30" y1="0" x2="90" y2="52" />
                <line x1="-30" y1="0" x2="30" y2="52" />

                <line x1="60" y1="0" x2="0" y2="52" />
                <line x1="30" y1="0" x2="-30" y2="52" />
                <line x1="90" y1="0" x2="30" y2="52" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 11. SVG PATTERN: CROSSHATCH (Arsitektural Blueprint Grid)
  if (type === 'pattern_crosshatch') {
    const pId = `p_crosshatch_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="32" 
              height="32" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1">
                <line x1="0" y1="0" x2="32" y2="0" />
                <line x1="0" y1="0" x2="0" y2="32" />
                {/* Subtle corner cross tick marks */}
                <line x1="14" y1="16" x2="18" y2="16" strokeWidth="1.5" />
                <line x1="16" y1="14" x2="16" y2="18" strokeWidth="1.5" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 12. SVG PATTERN: WAVES SINUSOID (Gelombang Sinus Data Kontinu)
  if (type === 'pattern_waves_sinusoid') {
    const pId = `p_sinusoid_${patternId}`;
    return (
      <div className={baseClass} style={{ opacity: activeOpacity }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id={pId} 
              width="80" 
              height="40" 
              patternUnits="userSpaceOnUse"
              patternTransform={`scale(${scaleVal})`}
            >
              <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4" strokeLinecap="round">
                <path d="M0,20 Q20,5 40,20 T80,20" />
                <path d="M0,0 Q20,-15 40,0 T80,0" />
                <path d="M0,40 Q20,25 40,40 T80,40" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pId})`} />
        </svg>
      </div>
    );
  }

  // 13. CUSTOM SVG PATTERN CODE (Pengguna paste raw SVG markup atau pattern)
  if (type === 'custom_svg_pattern' && customSvg) {
    const cleanPatternSvg = customSvg
      .replace(/<\?xml[\s\S]*?\?>/gi, '')
      .replace(/<!--[\s\S]*?-->/gi, '')
      .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
      .trim();
    return (
      <div 
        className={`${baseClass} [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover`} 
        style={{ opacity: activeOpacity }}
        dangerouslySetInnerHTML={{ __html: cleanPatternSvg }}
      />
    );
  }

  // PREVIOUS WATERCOLOR TEXTURES
  const opacityMultiplier = isDark ? 'opacity-[0.6]' : 'opacity-[0.95]';

  switch (type) {
    case 'watercolor_blush':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-repeat" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          )}
          
          <div 
            className={`absolute w-[45%] h-[55%] rounded-full blur-[90px] -left-[10%] -top-[10%] ${isMobile ? '' : 'animate-pulse'}`}
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(136, 19, 55, 0.28) 0%, rgba(136, 19, 55, 0) 70%)' 
                : 'radial-gradient(circle, rgba(254, 219, 219, 0.75) 0%, rgba(254, 219, 219, 0) 70%)',
              animationDuration: '14s'
            }}
          />

          <div 
            className="absolute w-[50%] h-[60%] rounded-full blur-[100px] right-[-5%] top-[10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(112, 26, 117, 0.22) 0%, rgba(112, 26, 117, 0) 75%)' 
                : 'radial-gradient(circle, rgba(251, 207, 232, 0.7) 0%, rgba(251, 207, 232, 0) 75%)',
            }}
          />

          <div 
            className="absolute w-[40%] h-[50%] rounded-full blur-[80px] left-[30%] bottom-[-10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(124, 45, 18, 0.2) 0%, rgba(124, 45, 18, 0) 70%)' 
                : 'radial-gradient(circle, rgba(254, 237, 222, 0.85) 0%, rgba(254, 237, 222, 0) 70%)',
            }}
          />

          <div 
            className="absolute w-[35%] h-[45%] rounded-full blur-[85px] right-[20%] -top-[15%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(120, 113, 108, 0.15) 0%, rgba(120, 113, 108, 0) 70%)' 
                : 'radial-gradient(circle, rgba(255, 237, 213, 0.75) 0%, rgba(255, 237, 213, 0) 70%)',
            }}
          />

          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.45]' : 'opacity-[0.32]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M-50,150 Q150,80 350,220 T750,120 T1050,190" 
              stroke="url(#goldGradient)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              fill="none" 
            />
            <path 
              d="M-50,350 Q200,480 500,320 T1050,450" 
              stroke="url(#goldGradient)" 
              strokeWidth="2" 
              strokeDasharray="6 6"
              strokeLinecap="round"
              fill="none" 
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? "#f59e0b" : "#d97706"} />
                <stop offset="50%" stopColor="#fde047" />
                <stop offset="100%" stopColor={isDark ? "#b45309" : "#78350f"} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'watercolor_gold':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")' }} />
          )}

          <div 
            className="absolute w-[55%] h-[65%] rounded-full blur-[110px] right-[-10%] -top-[10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(127, 29, 29, 0.24) 0%, rgba(127, 29, 29, 0) 75%)' 
                : 'radial-gradient(circle, rgba(239, 185, 185, 0.6) 0%, rgba(239, 185, 185, 0) 75%)',
            }}
          />
          <div 
            className="absolute w-[45%] h-[55%] rounded-full blur-[90px] left-[-5%] bottom-[-5%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(120, 53, 4, 0.2) 0%, rgba(120, 53, 4, 0) 70%)' 
                : 'radial-gradient(circle, rgba(243, 218, 203, 0.7) 0%, rgba(243, 218, 203, 0) 70%)',
            }}
          />
          <div 
            className="absolute w-[35%] h-[45%] rounded-full blur-[70px] left-[25%] top-[15%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(67, 20, 7, 0.26) 0%, rgba(67, 20, 7, 0) 70%)' 
                : 'radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(254, 215, 170, 0) 70%)',
            }}
          />

          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.55]' : 'opacity-[0.42]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 150,-50 C 220,120 180,240 320,310 C 440,370 410,480 520,650" 
              stroke="url(#luxuryGold)" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              d="M 320,310 C 260,380 200,420 120,490" 
              stroke="url(#luxuryGold)" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
            <path 
              d="M 680,-50 C 600,100 710,220 640,340 C 580,440 680,520 720,650" 
              stroke="url(#luxuryGold)" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            <path 
              d="M 640,340 C 740,380 820,330 920,410" 
              stroke="url(#luxuryGold)" 
              strokeWidth="2.2" 
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="luxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor={isDark ? "#a16207" : "#854d0e"} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'watercolor_pastel':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'paper\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23paper)\'/%3E%3C/svg%3E")' }} />
          )}

          <div 
            className="absolute w-[60%] h-[70%] rounded-full blur-[120px] left-[-15%] top-[-10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(88, 28, 135, 0.28) 0%, rgba(88, 28, 135, 0) 75%)' 
                : 'radial-gradient(circle, rgba(243, 232, 255, 0.8) 0%, rgba(243, 232, 255, 0) 75%)',
            }}
          />

          <div 
            className="absolute w-[50%] h-[60%] rounded-full blur-[100px] right-[-10%] bottom-[-10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(30, 58, 138, 0.22) 0%, rgba(30, 58, 138, 0) 70%)' 
                : 'radial-gradient(circle, rgba(224, 242, 254, 0.75) 0%, rgba(224, 242, 254, 0) 70%)',
            }}
          />

          <div 
            className="absolute w-[40%] h-[50%] rounded-full blur-[90px] right-[15%] top-[10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(124, 45, 18, 0.18) 0%, rgba(124, 45, 18, 0) 70%)' 
                : 'radial-gradient(circle, rgba(255, 237, 213, 0.7) 0%, rgba(255, 237, 213, 0) 70%)',
            }}
          />
          
          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.4]' : 'opacity-[0.22]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,100 Q 250,50 500,200 T 1000,100" stroke={isDark ? "#c084fc" : "#a78bfa"} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 0,300 Q 300,450 600,250 T 1000,400" stroke={isDark ? "#f472b6" : "#ec4899"} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case 'watercolor_sunset':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.055] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'rough\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23rough)\'/%3E%3C/svg%3E")' }} />
          )}

          <div 
            className="absolute w-[55%] h-[60%] rounded-full blur-[110px] left-[15%] -top-[15%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(153, 27, 27, 0.28) 0%, rgba(153, 27, 27, 0) 75%)' 
                : 'radial-gradient(circle, rgba(254, 202, 202, 0.8) 0%, rgba(254, 202, 202, 0) 75%)',
            }}
          />

          <div 
            className="absolute w-[45%] h-[55%] rounded-full blur-[90px] right-[-5%] top-[20%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(190, 24, 74, 0.22) 0%, rgba(190, 24, 74, 0) 70%)' 
                : 'radial-gradient(circle, rgba(251, 113, 133, 0.45) 0%, rgba(251, 113, 133, 0) 70%)',
            }}
          />

          <div 
            className="absolute w-[50%] h-[60%] rounded-full blur-[100px] left-[-10%] bottom-[-5%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(146, 64, 14, 0.22) 0%, rgba(146, 64, 14, 0) 75%)' 
                : 'radial-gradient(circle, rgba(254, 215, 170, 0.75) 0%, rgba(254, 215, 170, 0) 75%)',
            }}
          />

          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.45]' : 'opacity-[0.3]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="850" cy="150" r="80" stroke="url(#goldGrad)" strokeWidth="3.5" />
            <circle cx="850" cy="150" r="60" stroke="url(#goldGrad)" strokeWidth="2" strokeDasharray="5 5" />
            <circle cx="150" cy="450" r="100" stroke="url(#goldGrad)" strokeWidth="3" />
            <circle cx="150" cy="450" r="120" stroke="url(#goldGrad)" strokeWidth="1.5" />
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'dots':
      return (
        <div 
          className={baseClass} 
          style={{
            opacity: activeOpacity !== undefined ? activeOpacity : 0.25,
            backgroundImage: `radial-gradient(circle, ${color || (isDark ? '#475569' : '#94a3b8')} 1.5px, transparent 1.5px)`,
            backgroundSize: `${Math.round(24 * scaleVal)}px ${Math.round(24 * scaleVal)}px`
          }}
        />
      );

    case 'grid':
      return (
        <div 
          className={baseClass} 
          style={{
            opacity: activeOpacity !== undefined ? activeOpacity : 0.15,
            backgroundImage: `
              linear-gradient(to right, ${color || (isDark ? '#475569' : '#cbd5e1')} 1px, transparent 1px),
              linear-gradient(to bottom, ${color || (isDark ? '#475569' : '#cbd5e1')} 1px, transparent 1px)
            `,
            backgroundSize: `${Math.round(40 * scaleVal)}px ${Math.round(40 * scaleVal)}px`
          }}
        />
      );

    case 'ambient':
      return (
        <div className={baseClass} style={{ opacity: activeOpacity !== undefined ? activeOpacity : 1 }}>
          <div 
            className={`absolute rounded-full transition-colors duration-500 ${
              isMobile 
                ? 'w-[280px] h-[280px] blur-[60px] -right-10 -top-20 opacity-[0.22]' 
                : 'w-[600px] h-[600px] blur-[140px] -right-20 -top-40 opacity-[0.25]'
            } ${
              isDark ? 'bg-emerald-500/30' : 'bg-emerald-300/40'
            }`}
          />
          <div 
            className={`absolute rounded-full transition-colors duration-500 ${
              isMobile 
                ? 'w-[240px] h-[240px] blur-[50px] -left-10 bottom-[-50px] opacity-[0.15]' 
                : 'w-[500px] h-[500px] blur-[120px] -left-20 bottom-[-100px] opacity-[0.18]'
            } ${
              isDark ? 'bg-blue-600/20' : 'bg-blue-300/30'
            }`}
          />
        </div>
      );

    case 'abstract':
      return (
        <div className={baseClass} style={{ opacity: activeOpacity !== undefined ? activeOpacity : 1 }}>
          <div 
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] transition-opacity duration-300" 
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 0px, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 1px, transparent 0, transparent 50%),
                repeating-linear-gradient(-45deg, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 0px, ${color || (isDark ? '#cbd5e1' : '#1e293b')} 1px, transparent 0, transparent 50%)
              `,
              backgroundSize: `${Math.round(60 * scaleVal)}px ${Math.round(60 * scaleVal)}px`
            }}
          />
          <div 
            className={`absolute w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-transparent via-transparent to-transparent opacity-[0.25] transition-colors duration-500 ${
              isDark ? 'from-emerald-950/20 to-slate-900' : 'from-emerald-100/30 to-white'
            }`}
          />
        </div>
      );

    case 'custom_upload':
      if (!customBgUrl) return null;
      return (
        <div 
          className={baseClass}
          style={{ 
            opacity: activeOpacity !== undefined ? activeOpacity : 0.15,
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        >
          <img 
            src={customBgUrl} 
            alt="Custom Background Watermark" 
            className="w-full h-full object-cover grayscale brightness-110 contrast-125 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>
      );

    case 'none':
    case 'solid':
    default:
      return null;
  }
}
