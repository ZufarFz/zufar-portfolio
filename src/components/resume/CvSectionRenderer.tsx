import React from 'react';
import { Database, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { CVData } from '../../types';
import { LayoutSettings } from './types';
import { LayoutStyles } from './resumeStyles';
import MarkdownText from '../common/MarkdownText';

interface CvSectionRendererProps {
  sectionId: string;
  cvData: CVData;
  settings: LayoutSettings;
  activeStyles: LayoutStyles;
  dynamicDBMS: string;
  dynamicScientific: string;
  dynamicPresentation: string;
  dynamicAnalytical: string;
  isEditorMode?: boolean;
}

export const CvSectionRenderer: React.FC<CvSectionRendererProps> = ({
  sectionId,
  cvData,
  settings,
  activeStyles,
  dynamicDBMS,
  dynamicScientific,
  dynamicPresentation,
  dynamicAnalytical,
  isEditorMode = false,
}) => {
  switch (sectionId) {
    case 'arsenal':
      return (
        <div key="arsenal" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
          {isEditorMode && (
            <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
              ARSENAL
            </span>
          )}
          <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1.5 mb-2.5 flex items-center gap-1.5`}>
            <Database className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> Technical Arsenal
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">DBMS / QUERY</span>
              <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                {dynamicDBMS}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">SCIENTIFIC LANGUAGES</span>
              <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                {dynamicScientific}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">DATA PRESENTATION</span>
              <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                {dynamicPresentation}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">ANALYTICS SPECIALTIES</span>
              <p className={`${activeStyles.fontSizes.text} text-slate-800 font-medium`}>
                {dynamicAnalytical}
              </p>
            </div>
          </div>
        </div>
      );

    case 'education':
      const getEduBaseIdJSX = (idStr: string) => {
        if (!idStr) return '';
        if (idStr.endsWith('-en')) return idStr.slice(0, -3);
        if (idStr.endsWith('-id')) return idStr.slice(0, -3);
        return idStr;
      };
      const visibleEduList = (settings.visibleEducations && settings.visibleEducations.length > 0) 
        ? cvData.education.filter(edu => settings.visibleEducations?.includes(getEduBaseIdJSX(String(edu.id || '')))) 
        : cvData.education;
      if (visibleEduList.length === 0) return null;
      return (
        <div key="education" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
          {isEditorMode && (
            <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
              EDUCATION
            </span>
          )}
          <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1.5 mb-2.5 flex items-center gap-1.5`}>
            <GraduationCap className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> Education
          </h4>
          <div className="space-y-3">
            {visibleEduList.map((edu, idx) => (
              <div key={idx}>
                <span className="text-[9px] font-mono font-bold text-slate-400 block">{edu.period}</span>
                <span className="text-xs font-bold text-slate-900 block leading-tight">{edu.degree}</span>
                <span className="text-xs text-slate-500">{edu.institution}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'experience':
      const getExpBaseIdJSX = (idStr: string) => {
        if (!idStr) return '';
        if (idStr.endsWith('-en')) return idStr.slice(0, -3);
        if (idStr.endsWith('-id')) return idStr.slice(0, -3);
        return idStr;
      };
      const visibleExpList = (cvData.experiences || []).filter(exp => {
        if (exp.showOnCV === false) return false;
        if (settings.visibleExperiences && settings.visibleExperiences.length > 0) {
          return settings.visibleExperiences.includes(getExpBaseIdJSX(String(exp.id || '')));
        }
        return true;
      });
      if (visibleExpList.length === 0) return null;
      return (
        <div key="experience" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
          {isEditorMode && (
            <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
              EXPERIENCE
            </span>
          )}
          <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5`}>
            <Briefcase className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> Professional Experience
          </h4>

          <div className="space-y-4">
            {visibleExpList.map((exp) => (
              <div key={exp.id} className={activeStyles.spacings.block}>
                <div className="flex justify-between items-baseline gap-2">
                  <h5 className={`${activeStyles.fontSizes.text} font-bold text-slate-900 leading-tight`}>{exp.role}</h5>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">{exp.period}</span>
                </div>
                <span className={`text-xs font-bold block ${activeStyles.colors.text}`}>{exp.company}</span>
                <ul className={`list-disc list-outside pl-4 mt-1.5 ${activeStyles.spacings.listSpace} ${activeStyles.fontSizes.text} text-slate-600`}>
                  {exp.bulletPoints.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="pl-0.5">
                      <MarkdownText content={bullet} theme="light" inline />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    case 'methodology':
      return (
        <div key="methodology" className={`relative rounded-lg transition-all ${isEditorMode ? 'hover:ring-2 hover:ring-indigo-500/30 hover:bg-slate-50/50 p-2 -m-2' : ''}`}>
          {isEditorMode && (
            <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] font-bold rounded shadow-sm opacity-50 select-none">
              PHILOSOPHY
            </span>
          )}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-white print:border-none print:p-0">
            <h4 className={`${activeStyles.fonts} ${activeStyles.fontSizes.sectionTitle} font-bold text-slate-900 uppercase tracking-wider pb-1 flex items-center gap-1.5 mb-1`}>
              <Sparkles className={`w-3.5 h-3.5 ${activeStyles.colors.bullet}`} /> {cvData.methodologyTitle}
            </h4>
            <div className={`${activeStyles.fontSizes.text} text-slate-500 leading-relaxed italic`}>
              <MarkdownText content={cvData.methodologyText} theme="light" />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default CvSectionRenderer;

