import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin } from 'lucide-react';

interface ContactInfoSidebarProps {
  email?: string;
  location?: string;
  webTexts?: Record<string, string>;
  lang: 'id' | 'en';
  theme: 'light' | 'dark';
}

export const ContactInfoSidebar: React.FC<ContactInfoSidebarProps> = ({
  email = '',
  location = '',
  webTexts,
  lang,
  theme
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -35 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-5 flex flex-col justify-between"
    >
      <div>
        <h2 
          className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors"
          style={{
            color: theme === 'dark' 
              ? (webTexts?.contact_title_color_dark || undefined) 
              : (webTexts?.contact_title_color || undefined)
          }}
        >
          {webTexts?.contact_title || (lang === 'id' ? "Mari terhubung" : "Let's connect")}
        </h2>
        <p 
          className="font-sans text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-sm text-justify transition-colors"
          style={{
            color: theme === 'dark' 
              ? (webTexts?.contact_subtitle_color_dark || undefined) 
              : (webTexts?.contact_subtitle_color || undefined)
          }}
        >
          {webTexts?.contact_subtitle || (lang === 'id' ? "Tersedia untuk konsultasi perusahaan, peran analis senior penuh waktu, atau pembicara panel tentang kecerdasan bisnis tingkat lanjut." : "Available for corporate consulting engagements, full-time senior analyst roles, or panel speaking opportunities regarding advanced business intelligence.")}
        </p>

        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
            <span className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </span>
            <div>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">
                {lang === 'id' ? "Saluran Email" : "Email Channel"}
              </span>
              <a 
                href={email && email.trim() ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.trim())}` : '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-sans font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                {email || '-'}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
            <span className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </span>
            <div>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">
                {lang === 'id' ? "Lokasi Basis" : "Location Base"}
              </span>
              <span className="font-sans font-semibold text-sm">
                {location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfoSidebar;
