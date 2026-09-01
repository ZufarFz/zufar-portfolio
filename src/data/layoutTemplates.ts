/**
 * LAYOUT TEMPLATES REPOSITORY
 * 
 * Blueprint paten tata letak (grid, ukuran foto/lingkaran avatar, posisi ornamen aset melayang).
 * Ketika pengguna memilih template layout ini di Quick Editor, konfigurasi posisi & layout
 * akan diterapkan ke portfolioData (state aktif) dan tetap dapat disesuaikan lagi secara manual.
 */

import { FloatingAsset } from '../types';

export interface LayoutTemplate {
  id: string;
  name: string;
  category: 'home' | 'projects' | 'skills' | 'experience' | 'contact' | 'about_story';
  description: string;
  previewIcon?: string;
  // Konfigurasi posisi aset melayang
  floatingAssets: FloatingAsset[];
  // Konfigurasi layout webTexts terkait posisi & styling struktural
  webTextsConfig?: Record<string, string>;
}

export const HERO_LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'hero-classic-executive',
    name: 'Classic Executive Showcase',
    category: 'home',
    description: 'Tata letak bawaan standar yang terpasang saat ini. Menonjolkan lingkaran profil utama berukuran proporsional dengan aksen badge elegan di sudut kanan.',
    previewIcon: '📐',
    floatingAssets: [
      {
        id: 'hero_asset_classic_1',
        name: 'Accent Glow Circle',
        section: 'home',
        type: 'svg',
        content: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/></svg>',
        color: '#3b82f6',
        width: 140,
        x: 82,
        y: 18,
        rotation: 0,
        opacity: 0.45,
        zIndex: 8,
        layer: 'above_image',
        animation: 'float',
        flipX: false
      }
    ],
    webTextsConfig: {
      'home_circle_sync_accent': 'true',
      'hero_shadow_enabled': 'true',
      'hero_shadow_direction': 'bottom',
      'hero_shadow_depth': '40',
      'hero_shadow_opacity': '0.85'
    }
  },
  {
    id: 'hero-zen-asahi-composition',
    name: 'Zen Asahi Composition',
    category: 'home',
    description: 'Komposisi artistik Jepang bernuansa Zen. Menempatkan Matahari Merah Hinomaru sebagai latar avatar, Gerbang Torii megah di sisi samping, Bonsai Pinus & Bambu di sudut bawah, serta Awan Kasumi & Burung Bangau di angkasa.',
    previewIcon: '🎴',
    floatingAssets: [
      // 1. Torii Gate (Kanan Belakang)
      {
        id: 'hero_zen_torii',
        name: 'Gerbang Torii Merah Tradisional',
        section: 'home',
        type: 'svg',
        content: `
          <svg viewBox="0 0 500 650" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 120 C 130 90, 370 90, 490 120 L 480 160 C 365 135, 135 135, 20 160 Z" fill="#C81D25" stroke="#181A1B" stroke-width="8" stroke-linejoin="round"/>
            <path d="M 0 105 C 130 75, 370 75, 500 105 L 490 130 C 370 100, 130 100, 10 130 Z" fill="#181A1B"/>
            <path d="M45 155 L 455 155 L 450 185 L 50 185 Z" fill="#181A1B"/>
            <rect x="235" y="160" width="30" height="90" fill="#C81D25" stroke="#181A1B" stroke-width="6"/>
            <rect x="242" y="170" width="16" height="70" fill="#181A1B"/>
            <rect x="35" y="240" width="430" height="36" rx="4" fill="#C81D25" stroke="#181A1B" stroke-width="7"/>
            <path d="M 125 155 L 105 570 L 85 570 L 105 155 Z" fill="#C81D25" stroke="#181A1B" stroke-width="7"/>
            <rect x="80" y="555" width="48" height="60" rx="3" fill="#181A1B"/>
            <path d="M 375 155 L 395 570 L 415 570 L 395 155 Z" fill="#C81D25" stroke="#181A1B" stroke-width="7"/>
            <rect x="372" y="555" width="48" height="60" rx="3" fill="#181A1B"/>
            <polygon points="105,232 145,232 140,248 105,248" fill="#181A1B"/>
            <polygon points="395,232 355,232 360,248 395,248" fill="#181A1B"/>
            <rect x="65" y="605" width="80" height="35" rx="5" fill="#181A1B"/>
            <rect x="355" y="605" width="80" height="35" rx="5" fill="#181A1B"/>
          </svg>
        `.trim(),
        color: '#C81D25',
        width: 320,
        x: 88,
        y: 62,
        rotation: 0,
        opacity: 0.95,
        zIndex: 8,
        layer: 'above_image',
        animation: 'none',
        flipX: false
      },
      // 2. Bonsai Pine & Bamboo (Kiri Bawah)
      {
        id: 'hero_zen_bonsai',
        name: 'Pohon Bonsai Matsu & Rumpun Bambu',
        section: 'home',
        type: 'svg',
        content: `
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
        color: '#2E5A27',
        width: 310,
        x: 6,
        y: 76,
        rotation: 0,
        opacity: 0.95,
        zIndex: 8,
        layer: 'above_image',
        animation: 'none',
        flipX: false
      },
      // 3. Traditional Kasumi Slate Clouds (Kiri Atas)
      {
        id: 'hero_zen_cloud_slate',
        name: 'Awan Kasumi Slate Blue-Gray',
        section: 'home',
        type: 'svg',
        content: `
          <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 40 40 L 260 40 C 275 40, 275 60, 260 60 L 60 60 C 45 60, 45 40, 60 40 Z" fill="#718894" opacity="0.95"/>
            <path d="M 120 70 L 360 70 C 375 70, 375 90, 360 90 L 140 90 C 125 90, 125 70, 140 70 Z" fill="#718894" opacity="0.95"/>
            <path d="M 20 100 L 290 100 C 305 100, 305 120, 290 120 L 40 120 C 25 120, 25 100, 40 100 Z" fill="#718894" opacity="0.95"/>
            <circle cx="50" cy="50" r="14" fill="#718894"/>
            <circle cx="350" cy="80" r="14" fill="#718894"/>
            <circle cx="30" cy="110" r="14" fill="#718894"/>
          </svg>
        `.trim(),
        color: '#718894',
        width: 250,
        x: 18,
        y: 18,
        rotation: 0,
        opacity: 0.85,
        zIndex: 2,
        layer: 'bg',
        animation: 'float',
        flipX: false
      },
      // 4. Traditional Kasumi Sakura Clouds (Kanan Atas)
      {
        id: 'hero_zen_cloud_pink',
        name: 'Awan Kasumi Sakura Pink',
        section: 'home',
        type: 'svg',
        content: `
          <svg viewBox="0 0 350 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 30 30 L 220 30 C 235 30, 235 48, 220 48 L 45 48 C 30 48, 30 30, 45 30 Z" fill="#F2A1B0" opacity="0.9"/>
            <path d="M 90 58 L 300 58 C 315 58, 315 76, 300 76 L 105 76 C 90 76, 90 58, 105 58 Z" fill="#F2A1B0" opacity="0.9"/>
            <path d="M 20 86 L 240 86 C 255 86, 255 104, 240 104 L 35 104 C 20 104, 20 86, 35 86 Z" fill="#F2A1B0" opacity="0.9"/>
            <circle cx="38" cy="39" r="11" fill="#F2A1B0"/>
            <circle cx="292" cy="67" r="11" fill="#F2A1B0"/>
          </svg>
        `.trim(),
        color: '#F2A1B0',
        width: 220,
        x: 78,
        y: 14,
        rotation: 0,
        opacity: 0.85,
        zIndex: 2,
        layer: 'bg',
        animation: 'float',
        flipX: false
      },
      // 5. Flying Cranes / Birds (Langit Tengah)
      {
        id: 'hero_zen_birds',
        name: 'Kawanan Burung Terbang (Chidori / Tsuru)',
        section: 'home',
        type: 'svg',
        content: `
          <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 30 60 Q 55 25 80 50 Q 105 25 130 60 Q 80 45 30 60 Z" fill="#181A1B"/>
            <path d="M 160 30 Q 175 10 190 25 Q 205 10 220 30 Q 190 20 160 30 Z" fill="#181A1B"/>
            <path d="M 110 110 Q 130 80 150 100 Q 170 80 190 110 Q 150 95 110 110 Z" fill="#181A1B"/>
            <path d="M 220 90 Q 238 65 255 82 Q 272 65 290 90 Q 255 77 220 90 Z" fill="#181A1B"/>
          </svg>
        `.trim(),
        color: '#181A1B',
        width: 140,
        x: 48,
        y: 16,
        rotation: -4,
        opacity: 0.8,
        zIndex: 8,
        layer: 'above_image',
        animation: 'float',
        flipX: false
      },
      // 6. Diamond Pattern Hishi Cluster
      {
        id: 'hero_zen_diamond_pattern',
        name: 'Aksen Ornamen Diamond Hishi',
        section: 'home',
        type: 'svg',
        content: `
          <svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#701C24" stroke-width="4" fill="none">
              <rect x="25" y="15" width="22" height="22" transform="rotate(45 25 15)" fill="#701C24" opacity="0.85"/>
              <rect x="65" y="15" width="22" height="22" transform="rotate(45 65 15)" fill="#701C24" opacity="0.85"/>
              <rect x="105" y="15" width="22" height="22" transform="rotate(45 105 15)" fill="#701C24" opacity="0.85"/>
              <rect x="145" y="15" width="22" height="22" transform="rotate(45 145 15)" fill="#701C24" opacity="0.85"/>
              <rect x="185" y="15" width="22" height="22" transform="rotate(45 185 15)" fill="#701C24" opacity="0.85"/>
              <rect x="225" y="15" width="22" height="22" transform="rotate(45 225 15)" fill="#701C24" opacity="0.85"/>
              <rect x="265" y="15" width="22" height="22" transform="rotate(45 265 15)" fill="#701C24" opacity="0.85"/>
            </g>
          </svg>
        `.trim(),
        color: '#701C24',
        width: 170,
        x: 88,
        y: 88,
        rotation: 0,
        opacity: 0.9,
        zIndex: 2,
        layer: 'bg',
        animation: 'none',
        flipX: false
      }
    ]
  }
];

export const PROJECTS_LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'projects-classic-card',
    name: 'Template 1: Classic Detailed Card',
    category: 'projects',
    description: 'Tata letak 3 kontainer proyek bawaan. Menampilkan Gambar, Judul, Deskripsi singkat, Tag, dan Tombol Diskusi langsung pada setiap kartu proyek.',
    previewIcon: '🎴',
    floatingAssets: [],
    webTextsConfig: {
      'projects_layout_type': 'card_full'
    }
  },
  {
    id: 'projects-minimal-modal',
    name: 'Template 2: Minimal Card + Pop-Up Detail',
    category: 'projects',
    description: 'Tata letak modern & visual. Menampilkan Gambar proyek yang lebih besar dan dominan, Judul rata tengah, serta deretan Skill di bawahnya dengan jarak antar kartu yang lebih rapat. Klik kartu untuk membuka Pop-Up Detail lengkap.',
    previewIcon: '🖼️',
    floatingAssets: [],
    webTextsConfig: {
      'projects_layout_type': 'minimal_popup'
    }
  }
];

export const ALL_LAYOUT_TEMPLATES: LayoutTemplate[] = [
  ...HERO_LAYOUT_TEMPLATES,
  ...PROJECTS_LAYOUT_TEMPLATES
];

