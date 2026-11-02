import React from 'react';
import { CVData } from '../../types';
import { LayoutSettings } from './types';
import { LayoutStyles } from './resumeStyles';
import SocialIcon, { getAbsoluteSocialUrl } from '../SocialIcon';
import MarkdownText from '../MarkdownText';

interface CvHeaderProps {
  cvData: CVData;
  settings: LayoutSettings;
  activeStyles: LayoutStyles;
}

export const CvHeader: React.FC<CvHeaderProps> = ({
  cvData,
  settings,
  activeStyles,
}) => {
  const photoPos = settings.headerPhotoPosition || 'left';
  const align = settings.headerAlignment || 'left';
  const contactPos = settings.headerContactPosition || settings.contactPosition || 'bottom';

  const renderHeaderContacts = () => {
    const items: React.ReactNode[] = [];
    const visibleIds = (cvData.headerContacts && cvData.headerContacts.length > 0)
      ? cvData.headerContacts 
      : ['location', 'email', 'social-linkedin', 'social-github', 'social-whatsapp'];
    
    // Get unified list of social channels
    const unifiedSocials = [...(cvData.customSocials || [])];
    const standards = [
      { key: 'linkedin', name: 'LinkedIn', val: cvData.linkedin },
      { key: 'github', name: 'GitHub', val: cvData.github },
      { key: 'instagram', name: 'Instagram', val: cvData.instagram },
      { key: 'whatsapp', name: 'WhatsApp', val: cvData.whatsapp }
    ];
    standards.forEach(({ key, name, val }) => {
      const exists = unifiedSocials.some(s => s.id === key || s.id === `social-${key}` || s.name?.toLowerCase().trim() === name.toLowerCase().trim());
      if (val && !exists) {
        unifiedSocials.push({
          id: `social-${key}`,
          name,
          value: val,
          showOnWeb: true,
          showOnCvHeader: cvData.headerContacts?.includes(key) || cvData.headerContacts?.includes(`social-${key}`) || false,
          showOnCvFooter: cvData.footerSocials?.includes(key) || cvData.footerSocials?.includes(`social-${key}`) || true
        });
      }
    });

    visibleIds.forEach((id) => {
      if (id === 'location' && cvData.location) {
        items.push(<span key="loc">{cvData.location}</span>);
      } else if (id === 'email' && cvData.email) {
        items.push(
          <a key="email" href={`mailto:${cvData.email}`} className="hover:text-slate-900 hover:underline transition-colors">
            {cvData.email}
          </a>
        );
      } else {
        const found = unifiedSocials.find(s => 
          s.id === id || 
          s.id === `social-${id}` ||
          (id.replace('social-', '') === s.id.replace('social-', '')) ||
          (id.includes('linkedin') && s.name?.toLowerCase().trim() === 'linkedin') ||
          (id.includes('github') && s.name?.toLowerCase().trim() === 'github') ||
          (id.includes('instagram') && s.name?.toLowerCase().trim() === 'instagram') ||
          (id.includes('whatsapp') && s.name?.toLowerCase().trim() === 'whatsapp') ||
          (id.includes('website') && s.name?.toLowerCase().trim() === 'website')
        );
        if (found && found.value) {
          const cleanVal = found.value.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
          
          let displayLabel = `${found.name}: ${cleanVal}`;
          if (found.name?.toLowerCase().trim() === 'linkedin') {
            const cleanLink = found.value.trim().replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
            displayLabel = cleanLink;
          } else if (found.name?.toLowerCase().trim() === 'instagram') {
            const cleanInsta = found.value.trim().replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').replace(/\/$/, '');
            displayLabel = cleanInsta.startsWith('@') ? cleanInsta : `@${cleanInsta}`;
          } else if (found.name?.toLowerCase().trim() === 'whatsapp') {
            displayLabel = found.value.trim();
          } else if (found.name?.toLowerCase().trim() === 'github') {
            const cleanGit = found.value.trim().replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '');
            displayLabel = cleanGit;
          }

          items.push(
            <a key={found.id} href={getAbsoluteSocialUrl(found.usernameOrUrl || found.value, found.name)} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 hover:underline transition-colors flex items-center gap-1 inline-flex font-mono">
              <SocialIcon platform={found.name} size={11} className="w-2.5 h-2.5 inline shrink-0" useBrandColor={true} />
              <span>{displayLabel}</span>
            </a>
          );
        }
      }
    });

    if (items.length === 0) return null;

    if (contactPos === 'right' && align === 'left') {
      return (
        <div className="text-right font-mono text-[9px] sm:text-xs print:text-xs text-slate-500 space-y-1 mt-2 sm:mt-0 shrink-0 hover:text-slate-800 transition-colors flex flex-col items-end">
          {items.map((elem, idx) => (
            <div key={idx} className="flex items-center">
              {elem}
            </div>
          ))}
        </div>
      );
    }

    const justifyClass = 
      align === 'center' ? 'justify-center' :
      align === 'right' ? 'justify-end' :
      align === 'justify' ? 'justify-between' :
      'justify-start';

    return (
      <div className={`flex flex-wrap items-center ${justifyClass} gap-x-3 gap-y-1 mt-3 font-mono text-[9px] sm:text-xs print:text-xs text-slate-500`}>
        {items.map((elem, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-300 print:text-slate-400 font-bold select-none px-0.5">|</span>}
            {elem}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const isCenter = align === 'center';
  const isRight = align === 'right';
  const isJustify = align === 'justify';
  const isTopPhoto = photoPos === 'top';
  const isRightPhoto = photoPos === 'right';
  const isNonePhoto = photoPos === 'none';

  const avatarNode = (!isNonePhoto && cvData.avatarUrl) ? (
    <div 
      className={`rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm relative flex items-center justify-center bg-slate-50 ${
        isTopPhoto
          ? (isCenter ? 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20 mb-1' : 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20 mb-2')
          : 'w-16 h-16 sm:w-20 sm:h-20 print:w-20 print:h-20'
      }`}
    >
      <img 
        src={cvData.avatarUrl} 
        alt={cvData.name} 
        style={{
          position: 'absolute',
          width: '100%',
          height: 'auto',
          maxWidth: 'none',
          maxHeight: 'none',
          transform: `scale(${cvData.avatarScale || 1}) translate(${(cvData.avatarX || 0) * 0.45}px, ${(cvData.avatarY || 0) * 0.45}px)`,
          transformOrigin: 'center center',
        }}
        className="shrink-0 pointer-events-none select-none"
      />
    </div>
  ) : null;

  const outerAlignment = isCenter
    ? 'items-center text-center'
    : isRight
      ? 'items-end text-right'
      : isJustify
        ? 'items-stretch'
        : 'items-stretch text-left';

  const innerPairClass = isTopPhoto
    ? (isCenter ? 'flex-col items-center text-center gap-3' : isRight ? 'flex-col items-end text-right gap-2' : 'flex-col items-start text-left gap-2')
    : isRightPhoto
      ? (isRight ? 'flex-row-reverse items-center sm:items-start text-right gap-4 sm:gap-5' : 'flex-row-reverse items-center sm:items-start text-left gap-4 sm:gap-5')
      : (isRight ? 'flex-row items-center sm:items-start text-right gap-4 sm:gap-5' : 'flex-row items-center sm:items-start text-left gap-4 sm:gap-5');

  const textColClass = isCenter
    ? 'items-center text-center sm:items-center'
    : isRight
      ? 'items-end text-right sm:items-end'
      : 'items-start text-left';

  return (
    <>
      <div className={`border-b-2 border-slate-950 pb-5 ${activeStyles.spacings.margin} flex flex-col ${outerAlignment}`}>
        <div className={`flex w-full ${
          isTopPhoto
            ? (isCenter ? 'flex-col items-center' : isRight ? 'flex-col items-end gap-3' : 'flex-col items-start gap-4')
            : isCenter
              ? 'flex-col items-center justify-center'
              : isRight
                ? 'flex-col sm:flex-row-reverse items-center sm:items-start justify-between gap-4 sm:gap-6'
                : 'flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6'
        }`}>
          <div className={`flex ${innerPairClass}`}>
            {avatarNode}

            <div className={`flex flex-col ${textColClass}`}>
              <h1 className={`${activeStyles.fontSizes.name} font-black text-slate-900 tracking-tight leading-none uppercase`}>
                {cvData.name}
              </h1>
              <p className={`${activeStyles.colors.text} font-mono font-bold text-xs sm:text-sm uppercase tracking-widest mt-2`}>
                {cvData.title}
              </p>
              
              {(contactPos === 'bottom' || isCenter || isRight || isJustify) && renderHeaderContacts()}
            </div>
          </div>

          {!isCenter && !isRight && !isJustify && contactPos === 'right' && (
            <div className="self-center sm:self-start">
              {renderHeaderContacts()}
            </div>
          )}
        </div>
      </div>

      {cvData.aboutMe && (
        <div className="border-b border-slate-200 pb-4 mb-4 text-xs sm:text-sm print:text-sm text-slate-700 leading-relaxed text-justify tracking-wide">
          <MarkdownText content={cvData.aboutMe} theme="light" />
        </div>
      )}
    </>
  );
};

export default CvHeader;

