import React from 'react';
import { CVData } from '../../types';
import SocialIcon, { getAbsoluteSocialUrl } from '../SocialIcon';

interface CvFooterProps {
  cvData: CVData;
}

export const CvFooter: React.FC<CvFooterProps> = ({ cvData }) => {
  const visibleIds = cvData.footerSocials || ['linkedin', 'instagram', 'whatsapp'];
  const footerItems: React.ReactNode[] = [];

  // Get unified list of social channels
  const unifiedSocials = [...(cvData.customSocials || [])];
  const standards = [
    { key: 'linkedin', name: 'LinkedIn', val: cvData.linkedin },
    { key: 'github', name: 'GitHub', val: cvData.github },
    { key: 'instagram', name: 'Instagram', val: cvData.instagram },
    { key: 'whatsapp', name: 'WhatsApp', val: cvData.whatsapp }
  ];
  standards.forEach(({ key, name, val }) => {
    const exists = unifiedSocials.some(s => s.id === key || s.name?.toLowerCase().trim() === name.toLowerCase().trim());
    if (val && !exists) {
      unifiedSocials.push({
        id: key,
        name,
        value: val,
        showOnWeb: true,
        showOnCvHeader: cvData.headerContacts?.includes(key) ?? false,
        showOnCvFooter: cvData.footerSocials?.includes(key) ?? true
      });
    }
  });

  unifiedSocials.forEach((social) => {
    if (visibleIds.includes(social.id) && social.value) {
      const cleanVal = social.value.trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
      
      let displayLabel = cleanVal;
      if (social.name?.toLowerCase().trim() === 'instagram') {
        const cleanInsta = social.value.trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
        const parts = cleanInsta.split('/');
        const handle = parts[parts.length - 1];
        displayLabel = handle.startsWith('@') ? handle : `@${handle}`;
      } else if (social.name?.toLowerCase().trim() === 'whatsapp') {
        displayLabel = social.value.trim();
      }

      footerItems.push(
        <a 
          key={social.id}
          href={getAbsoluteSocialUrl(social.usernameOrUrl || social.value, social.name)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 text-slate-755 hover:text-emerald-500 transition-colors cursor-pointer group"
          title={`Buka ${social.name}`}
        >
          <SocialIcon platform={social.name} size={14} className="w-3.5 h-3.5 shrink-0" useBrandColor={true} />
          <span className="text-[10px] tracking-tight hover:underline underline-offset-2 text-slate-600 group-hover:text-slate-900 transition-colors">
            {displayLabel}
          </span>
        </a>
      );
    }
  });

  if (footerItems.length === 0) return null;

  return (
    <div className="border-t border-slate-200 mt-6 pt-4">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] sm:text-xs font-mono text-slate-500">
        {footerItems}
      </div>
    </div>
  );
};

