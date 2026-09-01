/**
 * THEME ASSETS LIBRARY
 * 
 * Wadah terpusat untuk menyimpan kode SVG dekoratif, lingkaran hero background, dan ornamen visual.
 * Diperbarui secara otomatis pada: 31/8/2026, 14.00.24
 */

export interface ThemeSvgAsset {
  id: string;
  name: string;
  category: 'japanese' | 'geometric' | 'minimal' | 'custom' | 'circle';
  description: string;
  svg: string;
  defaultColor?: string;
  defaultWidth?: number;
  defaultLayer?: 'bg' | 'above_image';
}

export const JAPANESE_THEME_ASSETS = {
  // Lingkaran 3D Sphere Radial
  radial_sphere_circle: `
<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heroSphereGrad" cx="42%" cy="38%" r="55%" fx="42%" fy="38%">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="50%" stop-color="#1D4ED8" />
          <stop offset="100%" stop-color="#0F172A" />
        </radialGradient>
      </defs>
      <circle cx="250" cy="250" r="230" fill="url(#heroSphereGrad)" />
    </svg>
  `.trim(),

  // Matahari Merah Hinomaru
  hinomaru_sun: `
<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="190" fill="#C81D25"/>
    </svg>
  `.trim(),

  // Lingkaran Glowing Neon Ring
  accent_glow_circle: `
<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="180" stroke="#3B82F6" stroke-width="8" stroke-dasharray="12 12" fill="none" opacity="0.8"/>
      <circle cx="200" cy="200" r="150" stroke="#818CF8" stroke-width="4" stroke-dasharray="6 6" fill="none" opacity="0.6"/>
      <circle cx="200" cy="200" r="120" fill="#3B82F6" opacity="0.1"/>
    </svg>
  `.trim(),

  // Lingkaran Linear Gradient
  linear_gradient_circle: `
<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroLinearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#818CF8" />
          <stop offset="100%" stop-color="#312E81" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="230" fill="url(#heroLinearGrad)" />
    </svg>
  `.trim(),

  // Gerbang Torii Tradisional
  torii_gate: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 650" width="100%" height="100%">
  <defs>
    <!-- Shadow Filter -->
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g id="torii-gate-detailed" stroke="#120A0A" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
    
    <!-- Dudukan Batu (Kamebara) -->
    <g id="stone-bases" fill="#737982">
      <!-- Left Stone -->
      <path d="M 205,580 Q 200,600 180,610 Q 250,625 320,610 Q 300,600 295,580 Z" />
      <ellipse cx="250" cy="582" rx="42" ry="9" fill="#9096A0" />
      <!-- Right Stone -->
      <path d="M 505,580 Q 500,600 480,610 Q 550,625 620,610 Q 600,600 595,580 Z" />
      <ellipse cx="550" cy="582" rx="42" ry="9" fill="#9096A0" />
    </g>

    <!-- Ornamen Besi Hitam Kaki Tiang (Kanagu/Nemaki Detail) -->
    <g id="iron-bases" fill="#1C1D21">
      <!-- Left Base -->
      <path d="M 218,500 L 212,582 Q 250,590 288,582 L 282,500 Z" />
      <!-- Ornamental Cutouts / Details -->
      <path d="M 230,580 C 230,550 240,540 250,540 C 260,540 270,550 270,580 Z" fill="#2A2C33" stroke-width="2"/>
      <circle cx="250" cy="525" r="4" fill="#A5A8B0" stroke="none"/>
      
      <!-- Right Base -->
      <path d="M 518,500 L 512,582 Q 550,590 588,582 L 582,500 Z" />
      <!-- Ornamental Cutouts / Details -->
      <path d="M 530,580 C 530,550 540,540 550,540 C 560,540 570,550 570,580 Z" fill="#2A2C33" stroke-width="2"/>
      <circle cx="550" cy="525" r="4" fill="#A5A8B0" stroke="none"/>
    </g>

    <!-- Tiang Utama (Hashira) dengan Shading Multi-Tone -->
    <g id="pillars">
      <!-- Left Pillar Base Red -->
      <path d="M 232,165 L 222,500 Q 250,506 278,500 L 268,165 Z" fill="#BA2626" />
      <!-- Left Pillar Inner Shadow Layer -->
      <path d="M 222,500 Q 250,506 278,500 L 268,165 L 255,165 L 245,503 Z" fill="#931A1A" stroke="none"/>
      
      <!-- Right Pillar Base Red -->
      <path d="M 532,165 L 522,500 Q 550,506 578,500 L 568,165 Z" fill="#BA2626" />
      <!-- Right Pillar Inner Shadow Layer -->
      <path d="M 522,500 Q 550,506 578,500 L 568,165 L 555,165 L 545,503 Z" fill="#931A1A" stroke="none"/>
    </g>

    <!-- Balok Horizontal Bawah (Nuki) -->
    <g id="nuki" filter="url(#shadow)">
      <path d="M 130,240 L 670,240 L 670,280 L 130,280 Z" fill="#C82D2D" />
      <!-- Shading bawah nuki -->
      <path d="M 130,268 L 670,268 L 670,280 L 130,280 Z" fill="#8C1C1C" stroke="none" />
      
      <!-- Pasak Kayu (Kusabi) -->
      <rect x="212" y="232" width="9" height="54" fill="#1C1D21" rx="1" />
      <rect x="279" y="232" width="9" height="54" fill="#1C1D21" rx="1" />
      <rect x="512" y="232" width="9" height="54" fill="#1C1D21" rx="1" />
      <rect x="579" y="232" width="9" height="54" fill="#1C1D21" rx="1" />
    </g>

    <!-- Penyangga Tengah (Gakuzuka) -->
    <g id="gakuzuka">
      <polygon points="385,135 415,135 411,240 389,240" fill="#931A1A" />
      <rect x="380" y="132" width="40" height="8" fill="#1C1D21" />
      <rect x="385" y="234" width="30" height="8" fill="#1C1D21" />
    </g>

    <!-- Cincin Tiang Atas (Daiwa) -->
    <g id="daiwa" fill="#1C1D21">
      <path d="M 224,155 L 276,155 L 272,175 L 228,175 Z" />
      <path d="M 524,155 L 576,155 L 572,175 L 528,175 Z" />
    </g>

    <!-- Balok Sekunder Atas (Shimaki) -->
    <g id="shimaki" filter="url(#shadow)">
      <path d="M 105,125 L 695,125 L 685,165 L 115,165 Z" fill="#C82D2D" />
      <path d="M 115,153 L 685,153 L 685,165 L 115,165 Z" fill="#8C1C1C" stroke="none" />
    </g>

    <!-- Atap Utama Lengkung (Kasagi) + Genteng Hitam -->
    <g id="kasagi" filter="url(#shadow)">
      <!-- Lapisan Merah Lengkung -->
      <path d="M 75,125 C 240,121 560,121 725,125 L 740,80 C 550,92 250,92 60,80 Z" fill="#BA2626" />
      
      <!-- Atap Hitam Melengkung Atas -->
      <path d="M 55,81 C 250,94 550,94 745,81 L 758,58 C 550,72 250,72 42,58 Z" fill="#1C1D21" />
      <!-- Shadow Lip Atap -->
      <path d="M 42,58 Q 32,58 35,70 Q 45,82 60,80 Z" fill="#111215" />
      <path d="M 758,58 Q 768,58 765,70 Q 755,82 740,80 Z" fill="#111215" />
    </g>
    
  </g>
</svg>
  `.trim(),

  // Bonsai Matsu & Rumpun Bambu
  bonsai_matsu: `
<svg viewBox="0 0 450 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#181A1B" stroke-width="5" stroke-linecap="round">
        <rect x="30" y="380" width="22" height="70" rx="4" fill="#6B8E23" />
        <rect x="30" y="460" width="22" height="70" rx="4" fill="#556B2F" />
        <rect x="30" y="540" width="22" height="75" rx="4" fill="#6B8E23" />
        <rect x="30" y="625" width="22" height="65" rx="4" fill="#556B2F" />
        <line x1="26" y1="455" x2="56" y2="455" stroke="#181A1B" stroke-width="6"/>
        <line x1="26" y1="535" x2="56" y2="535" stroke="#181A1B" stroke-width="6"/>
        <line x1="26" y1="620" x2="56" y2="620" stroke="#181A1B" stroke-width="6"/>
      </g>
      <g stroke="#181A1B" stroke-width="5" stroke-linecap="round">
        <rect x="65" y="420" width="18" height="65" rx="3" fill="#7C9D32" />
        <rect x="65" y="495" width="18" height="65" rx="3" fill="#6B8E23" />
        <rect x="65" y="570" width="18" height="70" rx="3" fill="#7C9D32" />
        <rect x="65" y="650" width="18" height="50" rx="3" fill="#6B8E23" />
        <line x1="62" y1="490" x2="86" y2="490" stroke="#181A1B" stroke-width="5"/>
        <line x1="62" y1="565" x2="86" y2="565" stroke="#181A1B" stroke-width="5"/>
        <line x1="62" y1="645" x2="86" y2="645" stroke="#181A1B" stroke-width="5"/>
      </g>
      <path d="M 28 450 C 5 430, -5 390, -10 370 C 10 395, 30 420, 30 450 Z" fill="#6B8E23" stroke="#181A1B" stroke-width="4"/>
      <path d="M 30 450 C 10 415, 15 375, 18 350 C 35 385, 40 420, 32 450 Z" fill="#7C9D32" stroke="#181A1B" stroke-width="4"/>
      <path d="M 85 490 C 115 470, 135 440, 145 410 C 120 445, 95 470, 85 490 Z" fill="#6B8E23" stroke="#181A1B" stroke-width="4"/>
      
      <path d="M 110 680 C 120 560, 80 440, 110 360 C 130 300, 150 260, 135 200 C 120 150, 140 110, 160 80" stroke="#5E3A18" stroke-width="32" stroke-linecap="round" fill="none"/>
      <path d="M 110 680 C 120 560, 80 440, 110 360 C 130 300, 150 260, 135 200 C 120 150, 140 110, 160 80" stroke="#181A1B" stroke-width="40" stroke-linecap="round" fill="none"/>

      <g stroke="#181A1B" stroke-width="5">
        <ellipse cx="90" cy="140" rx="65" ry="32" fill="#2E5A27" />
        <ellipse cx="65" cy="130" rx="40" ry="24" fill="#3D7333" />
        <ellipse cx="110" cy="135" rx="42" ry="22" fill="#4B8B3F" />
        <path d="M 35 145 Q 90 120 145 145" stroke="#181A1B" stroke-width="4" fill="none"/>
      </g>
      <g stroke="#181A1B" stroke-width="5">
        <ellipse cx="170" cy="70" rx="75" ry="36" fill="#2E5A27" />
        <ellipse cx="145" cy="60" rx="45" ry="25" fill="#3D7333" />
        <ellipse cx="195" cy="65" rx="48" ry="24" fill="#4B8B3F" />
      </g>
      <g stroke="#181A1B" stroke-width="5">
        <ellipse cx="140" cy="240" rx="65" ry="30" fill="#2E5A27" />
        <ellipse cx="120" cy="230" rx="40" ry="22" fill="#3D7333" />
        <ellipse cx="160" cy="235" rx="38" ry="20" fill="#4B8B3F" />
      </g>
      <g stroke="#181A1B" stroke-width="5">
        <ellipse cx="75" cy="330" rx="55" ry="28" fill="#2E5A27" />
        <ellipse cx="60" cy="320" rx="35" ry="20" fill="#3D7333" />
        <ellipse cx="95" cy="325" rx="35" ry="18" fill="#4B8B3F" />
      </g>
    </svg>
  `.trim(),

  // Ranting Bunga Sakura
  sakura_branch: `
<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 500 0 C 420 50, 360 80, 300 60 C 240 40, 180 80, 140 120 C 100 160, 60 170, 0 160" stroke="#3D1D1D" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M 330 65 C 320 120, 280 150, 250 180" stroke="#3D1D1D" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 190 75 C 180 30, 150 20, 120 10" stroke="#3D1D1D" stroke-width="6" stroke-linecap="round" fill="none"/>

      <g transform="translate(140, 120)">
        <circle cx="0" cy="0" r="10" fill="#C81D25" />
        <path d="M 0 -10 C -18 -40, 18 -40, 0 -10 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M 10 0 C 40 -18, 40 18, 10 0 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M 0 10 C 18 40, -18 40, 0 10 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M -10 0 C -40 18, -40 -18, -10 0 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M 7 -7 C 32 -32, 42 -12, 7 -7 Z" fill="#FAD1D8" stroke="#701C24" stroke-width="2"/>
        <circle cx="0" cy="0" r="6" fill="#C81D25" />
      </g>

      <g transform="translate(300, 60) scale(0.85)">
        <circle cx="0" cy="0" r="8" fill="#C81D25" />
        <path d="M 0 -10 C -16 -35, 16 -35, 0 -10 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M 10 0 C 35 -16, 35 16, 10 0 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M 0 10 C 16 35, -16 35, 0 10 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M -10 0 C -35 16, -35 -16, -10 0 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <circle cx="0" cy="0" r="5" fill="#701C24" />
      </g>

      <g transform="translate(250, 180) scale(0.9)">
        <circle cx="0" cy="0" r="9" fill="#C81D25" />
        <path d="M 0 -10 C -18 -38, 18 -38, 0 -10 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M 10 0 C 38 -18, 38 18, 10 0 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M 0 10 C 18 38, -18 38, 0 10 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <path d="M -10 0 C -38 18, -38 -18, -10 0 Z" fill="#F2A1B0" stroke="#701C24" stroke-width="3"/>
        <circle cx="0" cy="0" r="6" fill="#701C24" />
      </g>

      <ellipse cx="80" cy="240" rx="14" ry="7" transform="rotate(25 80 240)" fill="#F2A1B0" stroke="#701C24" stroke-width="2"/>
      <ellipse cx="180" cy="220" rx="12" ry="6" transform="rotate(-35 180 220)" fill="#FAD1D8" stroke="#701C24" stroke-width="2"/>
      <ellipse cx="360" cy="130" rx="15" ry="8" transform="rotate(45 360 130)" fill="#F2A1B0" stroke="#701C24" stroke-width="2"/>
    </svg>
  `.trim(),

  // Awan Kasumi Slate Blue
  cloud_slate: `
<svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 40 40 L 260 40 C 275 40, 275 60, 260 60 L 60 60 C 45 60, 45 40, 60 40 Z" fill="#718894" opacity="0.95"/>
      <path d="M 120 70 L 360 70 C 375 70, 375 90, 360 90 L 140 90 C 125 90, 125 70, 140 70 Z" fill="#718894" opacity="0.95"/>
      <path d="M 20 100 L 290 100 C 305 100, 305 120, 290 120 L 40 120 C 25 120, 25 100, 40 100 Z" fill="#718894" opacity="0.95"/>
      <path d="M 180 130 L 320 130 C 335 130, 335 145, 320 145 L 195 145 C 180 145, 180 130, 195 130 Z" fill="#718894" opacity="0.85"/>
      <circle cx="50" cy="50" r="14" fill="#718894"/>
      <circle cx="350" cy="80" r="14" fill="#718894"/>
      <circle cx="30" cy="110" r="14" fill="#718894"/>
    </svg>
  `.trim(),

  // Awan Kasumi Sakura Pink
  cloud_pink: `
<svg viewBox="0 0 350 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30 30 L 220 30 C 235 30, 235 48, 220 48 L 45 48 C 30 48, 30 30, 45 30 Z" fill="#F2A1B0" opacity="0.9"/>
      <path d="M 90 58 L 300 58 C 315 58, 315 76, 300 76 L 105 76 C 90 76, 90 58, 105 58 Z" fill="#F2A1B0" opacity="0.9"/>
      <path d="M 20 86 L 240 86 C 255 86, 255 104, 240 104 L 35 104 C 20 104, 20 86, 35 86 Z" fill="#F2A1B0" opacity="0.9"/>
      <circle cx="38" cy="39" r="11" fill="#F2A1B0"/>
      <circle cx="292" cy="67" r="11" fill="#F2A1B0"/>
    </svg>
  `.trim(),

  // Kawanan Burung Terbang (Chidori)
  flying_birds: `
<svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30 60 Q 55 25 80 50 Q 105 25 130 60 Q 80 45 30 60 Z" fill="#181A1B"/>
      <path d="M 160 30 Q 175 10 190 25 Q 205 10 220 30 Q 190 20 160 30 Z" fill="#181A1B"/>
      <path d="M 110 110 Q 130 80 150 100 Q 170 80 190 110 Q 150 95 110 110 Z" fill="#181A1B"/>
      <path d="M 220 90 Q 238 65 255 82 Q 272 65 290 90 Q 255 77 220 90 Z" fill="#181A1B"/>
    </svg>
  `.trim(),

  // Pola Diamond Hishi
  diamond_hishi: `
<svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#701C24" stroke-width="4" fill="none">
        <rect x="25" y="15" width="22" height="22" transform="rotate(45 25 15)" fill="#701C24" opacity="0.85"/>
        <rect x="65" y="15" width="22" height="22" transform="rotate(45 65 15)" fill="#701C24" opacity="0.85"/>
        <rect x="105" y="15" width="22" height="22" transform="rotate(45 105 15)" fill="#701C24" opacity="0.85"/>
        <rect x="145" y="15" width="22" height="22" transform="rotate(45 145 15)" fill="#701C24" opacity="0.85"/>
        <rect x="185" y="15" width="22" height="22" transform="rotate(45 185 15)" fill="#701C24" opacity="0.85"/>
        <rect x="225" y="15" width="22" height="22" transform="rotate(45 225 15)" fill="#701C24" opacity="0.85"/>
        <rect x="265" y="15" width="22" height="22" transform="rotate(45 265 15)" fill="#701C24" opacity="0.85"/>
        <rect x="45" y="45" width="18" height="18" transform="rotate(45 45 45)" stroke="#701C24" stroke-width="3" fill="none"/>
        <rect x="85" y="45" width="18" height="18" transform="rotate(45 85 45)" stroke="#701C24" stroke-width="3" fill="none"/>
        <rect x="125" y="45" width="18" height="18" transform="rotate(45 125 45)" stroke="#701C24" stroke-width="3" fill="none"/>
        <rect x="165" y="45" width="18" height="18" transform="rotate(45 165 45)" stroke="#701C24" stroke-width="3" fill="none"/>
        <rect x="205" y="45" width="18" height="18" transform="rotate(45 205 45)" stroke="#701C24" stroke-width="3" fill="none"/>
        <rect x="245" y="45" width="18" height="18" transform="rotate(45 245 45)" stroke="#701C24" stroke-width="3" fill="none"/>
      </g>
    </svg>
  `.trim()
};

export const INITIAL_THEME_SVG_ASSETS: ThemeSvgAsset[] = [
  {
    id: "radial_sphere_circle",
    name: "Lingkaran 3D Sphere Radial",
    category: "circle",
    description: "Lingkaran gradasi 3D radial sphere khas hero background",
    svg: JAPANESE_THEME_ASSETS.radial_sphere_circle,
    defaultWidth: 480,
    defaultLayer: "bg"
  },
  {
    id: "hinomaru_sun",
    name: "Matahari Merah Hinomaru",
    category: "circle",
    description: "Lingkaran matahari merah Asahi khas Jepang",
    svg: JAPANESE_THEME_ASSETS.hinomaru_sun,
    defaultWidth: 420,
    defaultLayer: "bg"
  },
  {
    id: "accent_glow_circle",
    name: "Lingkaran Glowing Neon Ring",
    category: "circle",
    description: "Ring lingkaran neon dengan garis putus-putus transparan",
    svg: JAPANESE_THEME_ASSETS.accent_glow_circle,
    defaultWidth: 320,
    defaultLayer: "bg"
  },
  {
    id: "linear_gradient_circle",
    name: "Lingkaran Linear Gradient",
    category: "circle",
    description: "Lingkaran gradasi linear 45° elegan untuk background hero",
    svg: JAPANESE_THEME_ASSETS.linear_gradient_circle,
    defaultWidth: 480,
    defaultLayer: "bg"
  },
  {
    id: "torii_gate",
    name: "Gerbang Torii Tradisional",
    category: "japanese",
    description: "Gerbang kuil merah dengan aksen hitam megah",
    svg: JAPANESE_THEME_ASSETS.torii_gate,
    defaultWidth: 320,
    defaultLayer: "above_image"
  },
  {
    id: "bonsai_matsu",
    name: "Bonsai Matsu & Rumpun Bambu",
    category: "japanese",
    description: "Pohon pinus abadi dan batang bambu hijau",
    svg: JAPANESE_THEME_ASSETS.bonsai_matsu,
    defaultWidth: 310,
    defaultLayer: "above_image"
  },
  {
    id: "sakura_branch",
    name: "Ranting Bunga Sakura",
    category: "japanese",
    description: "Ranting kayu dengan kelopak sakura mekar merah muda",
    svg: JAPANESE_THEME_ASSETS.sakura_branch,
    defaultWidth: 260,
    defaultLayer: "above_image"
  },
  {
    id: "cloud_slate",
    name: "Awan Kasumi Slate Blue",
    category: "japanese",
    description: "Awan bertingkat horizontal gaya Ukiyo-e",
    svg: JAPANESE_THEME_ASSETS.cloud_slate,
    defaultWidth: 250,
    defaultLayer: "bg"
  },
  {
    id: "cloud_pink",
    name: "Awan Kasumi Sakura Pink",
    category: "japanese",
    description: "Awan horizontal bernuansa merah muda lembut",
    svg: JAPANESE_THEME_ASSETS.cloud_pink,
    defaultWidth: 220,
    defaultLayer: "bg"
  },
  {
    id: "flying_birds",
    name: "Kawanan Burung Terbang (Chidori)",
    category: "japanese",
    description: "Siluet burung bangau terbang di angkasa",
    svg: JAPANESE_THEME_ASSETS.flying_birds,
    defaultWidth: 140,
    defaultLayer: "above_image"
  },
  {
    id: "diamond_hishi",
    name: "Pola Diamond Hishi",
    category: "japanese",
    description: "Ornamen belah ketupat tradisional maroon",
    svg: JAPANESE_THEME_ASSETS.diamond_hishi,
    defaultWidth: 170,
    defaultLayer: "bg"
  }
];

/**
 * Memicu ekspor file themeAssets.ts terbaru yang berisi seluruh daftar aset SVG pengguna
 */
export function generateThemeAssetsTsCode(assets: ThemeSvgAsset[]): string {
  const assetKeys = assets.map(a => {
    const safeKey = a.id.replace(/[^a-zA-Z0-9_]/g, '_');
    return `  // ${a.name}\n  ${safeKey}: \`\n${a.svg.trim()}\n  \`.trim()`;
  }).join(',\n\n');

  const listItems = assets.map(a => {
    const safeKey = a.id.replace(/[^a-zA-Z0-9_]/g, '_');
    return `  {\n    id: ${JSON.stringify(a.id)},\n    name: ${JSON.stringify(a.name)},\n    category: ${JSON.stringify(a.category)},\n    description: ${JSON.stringify(a.description)},\n    svg: JAPANESE_THEME_ASSETS.${safeKey},\n    defaultWidth: ${a.defaultWidth || 300},\n    defaultLayer: ${JSON.stringify(a.defaultLayer || 'bg')}\n  }`;
  }).join(',\n');

  const funcBody = generateThemeAssetsTsCode.toString();

  return `/**
 * THEME ASSETS LIBRARY
 * 
 * Wadah terpusat untuk menyimpan kode SVG dekoratif, lingkaran hero background, dan ornamen visual.
 * Diperbarui secara otomatis pada: ${new Date().toLocaleString('id-ID')}
 */

export interface ThemeSvgAsset {
  id: string;
  name: string;
  category: 'japanese' | 'geometric' | 'minimal' | 'custom' | 'circle';
  description: string;
  svg: string;
  defaultColor?: string;
  defaultWidth?: number;
  defaultLayer?: 'bg' | 'above_image';
}

export const JAPANESE_THEME_ASSETS = {
${assetKeys}
};

export const INITIAL_THEME_SVG_ASSETS: ThemeSvgAsset[] = [
${listItems}
];

${funcBody}
`;
}


