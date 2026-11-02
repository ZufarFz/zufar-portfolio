import React from 'react';
import { CVData } from '../../types';
import ContactForm from '../ContactForm';
import BackgroundTextures from '../BackgroundTextures';
import FloatingAssetsOverlay from '../FloatingAssetsOverlay';
import SectionGradientShadow from '../SectionGradientShadow';
import { getThemeColorPalette } from '../../lib/themeUtils';

interface ContactSectionProps {
  activeCVData: CVData;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  isEffectiveMobile?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  activeCVData,
  theme,
  lang,
  isEffectiveMobile = false
}) => {
  return (
    <section
      id="contact"
      className={`min-h-[85vh] flex items-center pt-32 pb-44 transition-colors relative overflow-hidden ${
        theme === 'dark' ? 'bg-[#111827] border-t border-slate-850' : 'bg-white'
      }`}
      style={
        theme === 'dark'
          ? { backgroundColor: activeCVData.webTexts?.contact_bg_color_dark }
          : { backgroundColor: activeCVData.webTexts?.contact_bg_color }
      }
    >
      {/* SECTION GRADIENT SHADOW OVERLAY */}
      <SectionGradientShadow
        sectionKey="contact"
        webTexts={activeCVData.webTexts}
        theme={theme}
        accentHex={getThemeColorPalette(activeCVData.layoutSettings?.themeColor || 'blue').primary}
      />

      {/* SECTION BACKGROUND OVERLAY */}
      {activeCVData.webTexts?.contact_bg_style && activeCVData.webTexts.contact_bg_style !== 'none' && (
        <BackgroundTextures
          type={activeCVData.webTexts.contact_bg_style}
          theme={theme}
          opacity={
            activeCVData.webTexts.contact_bg_pattern_opacity
              ? parseFloat(activeCVData.webTexts.contact_bg_pattern_opacity)
              : undefined
          }
          scale={
            activeCVData.webTexts.contact_bg_pattern_scale
              ? parseFloat(activeCVData.webTexts.contact_bg_pattern_scale)
              : undefined
          }
          color={activeCVData.webTexts.contact_bg_pattern_color || undefined}
          customSvg={activeCVData.webTexts.contact_bg_custom_svg || activeCVData.webTexts.contact_custom_svg || undefined}
          customBgUrl={activeCVData.webTexts.contact_bg_custom_url || activeCVData.webTexts.contact_custom_url || undefined}
        />
      )}

      {/* FLOATING DECORATIVE ASSETS OVERLAY */}
      <FloatingAssetsOverlay
        sectionId="contact"
        assets={activeCVData.floatingAssets}
        theme={theme}
        isMobilePreview={isEffectiveMobile}
        bgColor={
          theme === 'dark'
            ? activeCVData.webTexts?.contact_bg_color_dark || '#111827'
            : activeCVData.webTexts?.contact_bg_color || '#FFFFFF'
        }
      />

      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ContactForm
          email={activeCVData.email}
          location={activeCVData.location}
          webTexts={activeCVData.webTexts}
          lang={lang}
          theme={theme}
        />
      </div>
    </section>
  );
};

export default ContactSection;
