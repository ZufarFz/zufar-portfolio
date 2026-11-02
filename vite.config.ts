import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { DEFAULT_CV_DATA } from './src/data/portfolioData';

/**
 * Otomatis menyuntikkan Open Graph (WhatsApp, LinkedIn, Twitter, Google)
 * langsung dari data `src/data/portfolioData.ts`.
 * Pengguna cukup ubah file TS ini tanpa pernah perlu menyentuh index.html secara manual.
 */
function portfolioMetaPlugin(): Plugin {
  return {
    name: 'vite-plugin-portfolio-meta',
    transformIndexHtml(html) {
      const data = DEFAULT_CV_DATA;
      const webTexts = data.webTexts || {};

      let siteUrl = (webTexts.site_url || process.env.VITE_SITE_URL || process.env.SITE_URL || '').trim();
      if (siteUrl.endsWith('/')) {
        siteUrl = siteUrl.slice(0, -1);
      }

      const name = data.name || 'Muhammad Zufar Fauzi';
      const title = data.title || 'Junior Data Analyst';
      const pageTitle = (webTexts.og_title || `${name} | ${title} Portfolio`).trim();

      const rawDesc = webTexts.og_description || webTexts.hero_subtitle || data.aboutMe || '';
      const pageDesc = rawDesc
        .replace(/\s+/g, ' ')
        .replace(/"/g, '&quot;')
        .trim()
        .slice(0, 180);

      const rawImage = (webTexts.og_image || data.avatarUrl || data.homeImageUrl || '/profile.png').trim();
      let imageUrl = rawImage;
      if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
        imageUrl = rawImage;
      } else if (siteUrl) {
        const cleanPath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`;
        imageUrl = `${siteUrl}${cleanPath}`;
      }

      const currentUrl = siteUrl ? `${siteUrl}/` : '';

      const metaTags = [
        `<!-- Open Graph / WhatsApp / LinkedIn / Facebook (Auto-generated from portfolioData.ts) -->`,
        `<meta name="description" content="${pageDesc}" />`,
        `<meta name="author" content="${name}" />`,
        `<meta property="og:type" content="website" />`,
        currentUrl ? `<meta property="og:url" content="${currentUrl}" />` : '',
        `<meta property="og:title" content="${pageTitle}" />`,
        `<meta property="og:description" content="${pageDesc}" />`,
        `<meta property="og:image" content="${imageUrl}" />`,
        `<meta property="og:image:alt" content="${name} - ${title}" />`,
        `<meta property="og:site_name" content="${name} Portfolio" />`,
        `<!-- Twitter / X Cards -->`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        currentUrl ? `<meta name="twitter:url" content="${currentUrl}" />` : '',
        `<meta name="twitter:title" content="${pageTitle}" />`,
        `<meta name="twitter:description" content="${pageDesc}" />`,
        `<meta name="twitter:image" content="${imageUrl}" />`
      ].filter(Boolean).join('\n    ');

      let modified = html;
      if (modified.includes('<title>')) {
        modified = modified.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
      } else {
        modified = modified.replace('</head>', `  <title>${pageTitle}</title>\n  </head>`);
      }

      modified = modified.replace('</head>', `  ${metaTags}\n  </head>`);
      return modified;
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [portfolioMetaPlugin(), react(), tailwindcss()],
    assetsInclude: ['**/*.glb'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
