import React from 'react';
import { CVData } from '../../../types';
import { LayoutSettings } from '../types';
import { LayoutStyles } from '../resumeStyles';
import { CvHeader } from '../CvHeader';
import { CvFooter } from '../CvFooter';
import { CvSectionRenderer } from '../CvSectionRenderer';
import MarkdownText from '../../MarkdownText';

interface CvDocumentProps {
  cvData: CVData;
  settings: LayoutSettings;
  activeStyles: LayoutStyles;
  dynamicDBMS: string;
  dynamicScientific: string;
  dynamicPresentation: string;
  dynamicAnalytical: string;
  isEditorMode?: boolean;
  inlinePreview?: boolean;
  zoomLevel?: 'compact' | 'normal' | 'large';
  resumeRef?: React.RefObject<HTMLDivElement | null>;
}

export const CvDocument: React.FC<CvDocumentProps> = ({
  cvData,
  settings,
  activeStyles,
  dynamicDBMS,
  dynamicScientific,
  dynamicPresentation,
  dynamicAnalytical,
  isEditorMode = false,
  inlinePreview = false,
  zoomLevel = 'normal',
  resumeRef,
}) => {
  const renderSection = (secId: string) => (
    <CvSectionRenderer
      key={secId}
      sectionId={secId}
      cvData={cvData}
      settings={settings}
      activeStyles={activeStyles}
      dynamicDBMS={dynamicDBMS}
      dynamicScientific={dynamicScientific}
      dynamicPresentation={dynamicPresentation}
      dynamicAnalytical={dynamicAnalytical}
      isEditorMode={isEditorMode}
    />
  );

  const renderColumnContent = (colType: 'sidebar' | 'main') => {
    if (settings.layoutStyle === 'single-column') {
      return null;
    }
    const sidebarSections = ['arsenal', 'education'];
    const mainSections = ['experience', 'methodology'];
    const activeSections = colType === 'sidebar' ? sidebarSections : mainSections;

    return settings.sectionOrder
      .filter(secId => activeSections.includes(secId))
      .map(secId => renderSection(secId));
  };

  const sheetClassName = inlinePreview
    ? `a4-inline-sheet bg-white ${activeStyles.paddingXClass} ${activeStyles.paddingYClass} rounded-xl border border-slate-200/80 shadow-md mx-auto text-slate-800 print:border-none print:shadow-none print:p-0 print:m-0 transition-all ${activeStyles.fonts}`
    : `a4-sheet bg-white ${activeStyles.paddingXClass} ${activeStyles.paddingYClass} rounded-xl border border-slate-200/80 shadow-md mx-auto text-slate-800 print:border-none print:shadow-none print:p-0 print:m-0 transition-all ${
        activeStyles.fonts
      } ${
        zoomLevel === 'compact' ? 'scale-90 origin-top' :
        zoomLevel === 'large' ? 'scale-110 origin-top' : ''
      }`;

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: `
        <style>
          ${inlinePreview ? `
            .a4-inline-sheet {
              width: 100% !important;
              max-width: 210mm !important;
              box-sizing: border-box !important;
            }
          ` : `
            @media screen {
              .a4-sheet {
                width: 210mm !important;
                min-height: 297mm !important;
                box-sizing: border-box;
              }
            }
          `}
          @media print {
            @page {
              size: A4 portrait;
              margin: 0mm !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background-color: white !important;
              color: #1e293b !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            ${inlinePreview ? '.a4-inline-sheet' : '.a4-sheet'} {
              width: 210mm !important;
              padding: ${activeStyles.printPaddingY} ${activeStyles.printPaddingX} !important;
              margin: 0 auto !important;
              border: none !important;
              box-shadow: none !important;
              box-sizing: border-box !important;
            }
          }
        </style>
      `}} />

      <div 
        ref={resumeRef}
        className={sheetClassName}
        style={{
          fontFamily: settings.fontFamily === 'mono' ? '"JetBrains Mono", Courier, monospace' : settings.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' : 'var(--font-sans)',
        }}
      >
        {/* Header */}
        <CvHeader
          cvData={cvData}
          settings={settings}
          activeStyles={activeStyles}
        />

        {/* Bio / About Me */}
        {cvData.aboutMe && (
          <div className="border-b border-slate-200 pb-4 mb-4 text-xs sm:text-sm print:text-sm text-slate-700 leading-relaxed text-justify tracking-wide">
            <MarkdownText content={cvData.aboutMe} theme="light" />
          </div>
        )}

        {/* Content Columns / Grid */}
        {settings.layoutStyle === 'left-sidebar' ? (
          <div className={`grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 ${activeStyles.spacings.gap}`}>
            <div className="md:col-span-4 print:col-span-4 space-y-5 md:border-r md:border-slate-100 md:pr-4 print:border-r print:border-slate-100 print:pr-4">
              {renderColumnContent('sidebar')}
            </div>
            <div className="md:col-span-8 print:col-span-8 space-y-5">
              {renderColumnContent('main')}
            </div>
          </div>
        ) : settings.layoutStyle === 'right-sidebar' ? (
          <div className={`grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 ${activeStyles.spacings.gap}`}>
            <div className="md:col-span-8 print:col-span-8 space-y-5">
              {renderColumnContent('main')}
            </div>
            <div className="md:col-span-4 print:col-span-4 space-y-5 md:border-l md:border-slate-100 md:pl-4 print:border-l print:border-slate-100 print:pl-4">
              {renderColumnContent('sidebar')}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {settings.sectionOrder.map(secId => renderSection(secId))}
          </div>
        )}

        {/* Footer */}
        <CvFooter cvData={cvData} />
      </div>
    </>
  );
};
