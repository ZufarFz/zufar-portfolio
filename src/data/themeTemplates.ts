/**
 * THEME COLOR PALETTE TEMPLATES REPOSITORY
 * 
 * Blueprint palet warna, motif latar belakang SVG, dan tema visual per-halaman/per-muka.
 * Ketika pengguna memilih tema warna ini di Quick Editor, nilai warna akan disuntikkan
 * ke dalam portfolioData (state aktif) sehingga tetap dapat diubah atau disesuaikan lagi.
 */

export interface ThemeColorPalette {
  light: {
    background: string;
    textPrimary: string;
    accent: string;
    secondaryAccent: string;
    uiSecondary: string;
    softAccent?: string;
    border?: string;
  };
  dark: {
    background: string;
    textPrimary: string;
    accent: string;
    secondaryAccent: string;
    uiSecondary: string;
    softAccent?: string;
    border?: string;
  };
}

export interface ThemeTemplate {
  id: string;
  name: string;
  category: 'home' | 'projects' | 'skills' | 'experience' | 'contact' | 'about_story';
  description: string;
  previewIcon?: string;
  previewSwatches: {
    light: string[];
    dark: string[];
  };
  palette: ThemeColorPalette;
  // Patch key-value yang akan disuntikkan ke webTexts
  webTextsPatch: Record<string, string>;
  // Opsi themeColor global (layoutSettings.themeColor)
  themeAccent?: 'rose' | 'amber' | 'emerald' | 'blue' | 'indigo' | 'slate';
}

export const HERO_THEME_TEMPLATES: ThemeTemplate[] = [
  // 1. Asahi & Tsukimi (Japanese Minimalist & Midnight)
  {
    id: 'hero-asahi-tsukimi',
    name: 'Asahi & Tsukimi (旭 & 月見)',
    category: 'home',
    description: 'Palet bertema Jepang Tradisional & Modern. Menghadirkan kombinasi Cream Seigaiha, Crimson Sun, Deep Maroon, Slate Blue-Gray, dan sentuhan Sakura Pink di mode terang, serta Charcoal Midnight & Deep Wine di mode gelap.',
    previewIcon: '⛩️',
    previewSwatches: {
      light: ['#F3F0E6', '#2D3136', '#C81D25', '#701C24', '#718894', '#F2A1B0'],
      dark: ['#181A1B', '#E2E8F0', '#9B1B1B', '#5E171E', '#3F4A52', '#2C3237']
    },
    palette: {
      light: {
        background: '#F3F0E6',
        textPrimary: '#2D3136',
        accent: '#C81D25',
        secondaryAccent: '#701C24',
        uiSecondary: '#718894',
        softAccent: '#F2A1B0',
        border: '#D9D2C5'
      },
      dark: {
        background: '#181A1B',
        textPrimary: '#E2E8F0',
        accent: '#9B1B1B',
        secondaryAccent: '#5E171E',
        uiSecondary: '#3F4A52',
        softAccent: '#F2A1B0',
        border: '#2C3237'
      }
    },
    themeAccent: 'rose',
    webTextsPatch: {
      // Background Colors
      'home_bg_color': '#F3F0E6',
      'home_bg_color_id': '#F3F0E6',
      'home_bg_color_en': '#F3F0E6',
      'hero_bg_color': '#F3F0E6',
      'home_bg_color_dark': '#181A1B',
      'home_bg_color_dark_id': '#181A1B',
      'home_bg_color_dark_en': '#181A1B',
      'hero_bg_color_dark': '#181A1B',

      // Background Pattern: Japanese Seigaiha Waves (35% Opacity, Scale 1)
      'home_bg_style': 'pattern_seigaiha',
      'home_bg_pattern': 'pattern_seigaiha',
      'home_bg_pattern_color': '#718894',
      'home_bg_pattern_color_dark': '#3F4A52',
      'home_bg_pattern_opacity': '0.35',
      'home_bg_pattern_scale': '1',

      // Hero Circle / Hinomaru Rising Sun Gradient
      'home_circle_sync_accent': 'false',
      'home_circle_color_light': '#C81D25',
      'home_circle_color_light_end': '#701C24',
      'home_circle_color_dark': '#9B1B1B',
      'home_circle_color_dark_end': '#5E171E',

      // Typography & Font (GangOfThree Custom Font)
      'hero_title_font': 'GangOfThree',
      'hero_greeting_color': '#2D3136',
      'hero_title_color': '#2D3136',
      'hero_subtitle_color': '#2D3136',
      'hero_badge_color': '#701C24',
      'hero_year_color': '#2D3136',
      'hero_location_color': '#718894',

      'hero_greeting_color_dark': '#E2E8F0',
      'hero_title_color_dark': '#E2E8F0',
      'hero_subtitle_color_dark': '#E2E8F0',
      'hero_badge_color_dark': '#F2A1B0',
      'hero_year_color_dark': '#E2E8F0',
      'hero_location_color_dark': '#718894',

      // Bottom Gradient Shadow (Matches Background Color)
      'home_shadow_enabled': 'true',
      'home_shadow_direction': 'bottom',
      'home_shadow_color_mode': 'bg_color',
      'home_shadow_depth': '35',
      'home_shadow_opacity': '0.95',

      // Navbar Color Integration (Matches Image 2 exactly)
      'navbar_bg_color': '#FAF7F2',
      'navbar_bg_color_id': '#FAF7F2',
      'navbar_bg_color_en': '#FAF7F2',
      'navbar_border_color': '#E3DDD3',
      'navbar_border_color_id': '#E3DDD3',
      'navbar_border_color_en': '#E3DDD3',

      'navbar_active_bg_color': '#2F3C43',
      'navbar_active_bg_color_id': '#2F3C43',
      'navbar_active_bg_color_en': '#2F3C43',
      'navbar_active_bg_opacity': '1',
      'navbar_active_bg_opacity_id': '1',
      'navbar_active_bg_opacity_en': '1',
      'navbar_active_color': '#FFFFFF',
      'navbar_active_color_id': '#FFFFFF',
      'navbar_active_color_en': '#FFFFFF',

      'navbar_text_color': '#2D3136',
      'navbar_text_color_id': '#2D3136',
      'navbar_text_color_en': '#2D3136',

      'navbar_bg_color_dark': '#181A1B',
      'navbar_bg_color_dark_id': '#181A1B',
      'navbar_bg_color_dark_en': '#181A1B',
      'navbar_border_color_dark': '#2D3748',
      'navbar_border_color_dark_id': '#2D3748',
      'navbar_border_color_dark_en': '#2D3748',

      'navbar_active_bg_color_dark': '#3F4A52',
      'navbar_active_bg_color_dark_id': '#3F4A52',
      'navbar_active_bg_color_dark_en': '#3F4A52',
      'navbar_active_bg_opacity_dark': '1',
      'navbar_active_bg_opacity_dark_id': '1',
      'navbar_active_bg_opacity_dark_en': '1',
      'navbar_active_color_dark': '#FFFFFF',
      'navbar_active_color_dark_id': '#FFFFFF',
      'navbar_active_color_dark_en': '#FFFFFF',

      'navbar_text_color_dark': '#E2E8F0',
      'navbar_text_color_dark_id': '#E2E8F0',
      'navbar_text_color_dark_en': '#E2E8F0',

      // CTA Buttons Colors ("Hubungi Saya" & "Download Resume")
      'hero_cta_primary_bg': '#701C24',
      'hero_cta_primary_text': '#FFFFFF',
      'hero_cta_primary_bg_dark': '#5E171E',
      'hero_cta_primary_text_dark': '#FFFFFF',
      'hero_cta_secondary_bg': '#718894',
      'hero_cta_secondary_text': '#FFFFFF',
      'hero_cta_secondary_bg_dark': '#3F4A52',
      'hero_cta_secondary_text_dark': '#FFFFFF'
    }
  },

  // 2. Executive Sapphire (Modern Corporate Blue)
  {
    id: 'hero-executive-sapphire',
    name: 'Executive Sapphire',
    category: 'home',
    description: 'Palet bawaan korporat modern dengan latar Slate cerah, teks Charcoal pekat, lingkaran gradasi Blue Sapphire, dan latar gelap Midnight Slate yang presisi.',
    previewIcon: '💎',
    previewSwatches: {
      light: ['#F7F9FB', '#0F172A', '#3B82F6', '#1D4ED8', '#64748B', '#93C5FD'],
      dark: ['#0F172A', '#FFFFFF', '#3B82F6', '#1E40AF', '#475569', '#1E293B']
    },
    palette: {
      light: {
        background: '#F7F9FB',
        textPrimary: '#0F172A',
        accent: '#3B82F6',
        secondaryAccent: '#1D4ED8',
        uiSecondary: '#64748B',
        border: '#E2E8F0'
      },
      dark: {
        background: '#0F172A',
        textPrimary: '#FFFFFF',
        accent: '#3B82F6',
        secondaryAccent: '#1E40AF',
        uiSecondary: '#475569',
        border: '#1E293B'
      }
    },
    themeAccent: 'blue',
    webTextsPatch: {
      'home_bg_color': '#F7F9FB',
      'home_bg_color_id': '#F7F9FB',
      'home_bg_color_en': '#F7F9FB',
      'hero_bg_color': '#F7F9FB',
      'home_bg_color_dark': '#0F172A',
      'home_bg_color_dark_id': '#0F172A',
      'home_bg_color_dark_en': '#0F172A',
      'hero_bg_color_dark': '#0F172A',

      'home_bg_pattern': 'japanese_dots',
      'home_bg_pattern_color': '#3B82F6',
      'home_bg_pattern_color_dark': '#60A5FA',
      'home_bg_pattern_opacity': '0.12',
      'home_bg_pattern_scale': '40',

      'home_circle_sync_accent': 'true',
      'home_circle_color_light': '#6BA0E6',
      'home_circle_color_light_end': '#3661A3',
      'home_circle_color_dark': '#3B82F6',
      'home_circle_color_dark_end': '#1E3A8A',

      'hero_title_color': '#0F172A',
      'hero_subtitle_color': '#475569',
      'hero_badge_color': '#1D4ED8',
      'hero_year_color': '#0F172A',
      'hero_location_color': '#64748B',

      'hero_title_color_dark': '#FFFFFF',
      'hero_subtitle_color_dark': '#94A3B8',
      'hero_badge_color_dark': '#60A5FA',
      'hero_year_color_dark': '#FFFFFF',
      'hero_location_color_dark': '#94A3B8'
    }
  }
];
