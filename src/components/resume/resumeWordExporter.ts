import { CVData } from '../../types';
import { LayoutSettings } from './types';
import { LayoutStyles } from './resumeStyles';
import { getCircularBase64Image } from './resumePdfHelper';

interface SkillsSummary {
  dynamicDBMS: string;
  dynamicScientific: string;
  dynamicPresentation: string;
  dynamicAnalytical: string;
}

export async function downloadWordDoc(
  cvData: CVData,
  settings: LayoutSettings,
  activeStyles: LayoutStyles,
  skillsSummary: SkillsSummary
) {
  // Generate Base64 circular image for avatar
  let base64Avatar = '';
  if (cvData.avatarUrl) {
    try {
      base64Avatar = await getCircularBase64Image(
        cvData.avatarUrl,
        cvData.avatarScale || 1,
        cvData.avatarX || 0,
        cvData.avatarY || 0
      );
    } catch (err) {
      console.error("Gagal memproses gambar avatar melingkar untuk Word DOC:", err);
      base64Avatar = cvData.avatarUrl;
    }
  }

  // Determine Word CSS Font based on layout setting
  const wordFontFamily = settings.fontFamily === 'serif' ? "Georgia, serif" : settings.fontFamily === 'mono' ? "Courier New, monospace" : "Arial, Helvetica, sans-serif";
  const activeColorHex = activeStyles.colors.hex || '#0f766e';

  const getWordSectionHTML = (sectionName: string): string => {
    switch (sectionName) {
      case 'arsenal':
        return `
          <div style="margin-bottom: 15pt;">
            <h4 style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 2px solid ${activeColorHex}; padding-bottom: 3pt; margin-top: 10pt; margin-bottom: 8pt; text-transform: uppercase; letter-spacing: 0.5px;">
              Technical Arsenal
            </h4>
            <table width="100%" cellspacing="0" cellpadding="3" border="0" style="margin-bottom: 6pt;">
              <tr>
                <td width="35%" valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">DBMS / QUERY</td>
                <td width="65%" valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${skillsSummary.dynamicDBMS || '-'}</td>
              </tr>
              <tr>
                <td valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">SCIENTIFIC LANGUAGES</td>
                <td valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${skillsSummary.dynamicScientific || '-'}</td>
              </tr>
              <tr>
                <td valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">DATA PRESENTATION</td>
                <td valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${skillsSummary.dynamicPresentation || '-'}</td>
              </tr>
              <tr>
                <td valign="top" style="font-family: ${wordFontFamily}; font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; padding: 3px 0;">ANALYTICS SPECIALTIES</td>
                <td valign="top" style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #1e293b; padding: 3px 0; font-weight: bold;">${skillsSummary.dynamicAnalytical || '-'}</td>
              </tr>
            </table>
          </div>
        `;
      case 'education':
        const getEduBaseId = (idStr: string) => {
          if (!idStr) return '';
          if (idStr.endsWith('-en')) return idStr.slice(0, -3);
          if (idStr.endsWith('-id')) return idStr.slice(0, -3);
          return idStr;
        };
        const visibleEdu = (settings.visibleEducations && settings.visibleEducations.length > 0)
          ? cvData.education.filter(edu => settings.visibleEducations?.includes(getEduBaseId(String(edu.id || '')))) 
          : cvData.education;
        if (visibleEdu.length === 0) return '';
        return `
          <div style="margin-bottom: 15pt;">
            <h4 style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 2px solid ${activeColorHex}; padding-bottom: 3pt; margin-top: 10pt; margin-bottom: 8pt; text-transform: uppercase; letter-spacing: 0.5px;">
              Education
            </h4>
            ${visibleEdu.map(edu => `
              <div style="margin-bottom: 8pt; font-family: ${wordFontFamily};">
                <span style="font-size: 8pt; font-weight: bold; color: #94a3b8; display: block;">${edu.period}</span>
                <span style="font-size: 9.5pt; font-weight: bold; color: #0f172a; display: block; margin-top: 1pt;">${edu.degree}</span>
                <span style="font-size: 9pt; color: #64748b; display: block;">${edu.institution}</span>
              </div>
            `).join('')}
          </div>
        `;
      case 'experience':
        const getExpBaseId = (idStr: string) => {
          if (!idStr) return '';
          if (idStr.endsWith('-en')) return idStr.slice(0, -3);
          if (idStr.endsWith('-id')) return idStr.slice(0, -3);
          return idStr;
        };
        const visibleExp = (cvData.experiences || []).filter(exp => {
          if (exp.showOnCV === false) return false;
          if (settings.visibleExperiences && settings.visibleExperiences.length > 0) {
            return settings.visibleExperiences.includes(getExpBaseId(String(exp.id || '')));
          }
          return true;
        });
        if (visibleExp.length === 0) return '';
        return `
          <div style="margin-bottom: 15pt;">
            <h4 style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 2px solid ${activeColorHex}; padding-bottom: 3pt; margin-top: 10pt; margin-bottom: 8pt; text-transform: uppercase; letter-spacing: 0.5px;">
              Professional Experience
            </h4>
            ${visibleExp.map(exp => `
              <div style="margin-bottom: 12pt; font-family: ${wordFontFamily};">
                <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 2pt;">
                  <tr>
                    <td align="left" style="font-family: ${wordFontFamily}; font-size: 10pt; font-weight: bold; color: #0f172a;">${exp.role}</td>
                    <td align="right" style="font-family: ${wordFontFamily}; font-size: 8.5pt; color: #94a3b8; font-style: italic;">${exp.period}</td>
                  </tr>
                </table>
                <div style="font-family: ${wordFontFamily}; font-size: 9.5pt; font-weight: bold; color: ${activeColorHex}; margin-bottom: 4pt;">${exp.company}</div>
                <ul style="margin-top: 2pt; margin-bottom: 4pt; padding-left: 14pt;">
                  ${exp.bulletPoints.map(bullet => `<li style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #334155; margin-bottom: 3px;">${bullet}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      case 'methodology':
        return `
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10pt; margin-bottom: 15pt; border-radius: 4px;">
            <h5 style="font-family: ${wordFontFamily}; font-size: 9.5pt; font-weight: bold; color: #0f172a; margin-top: 0; margin-bottom: 4pt; text-transform: uppercase; letter-spacing: 0.5px;">
              ${cvData.methodologyTitle || 'Work Philosophy'}
            </h5>
            <p style="font-family: ${wordFontFamily}; font-size: 9pt; color: #475569; font-style: italic; line-height: 1.4; margin: 0;">
              "${cvData.methodologyText}"
            </p>
          </div>
        `;
      default:
        return '';
    }
  };

  const bodyContentHTML = `
    <div style="margin-top: 10pt;">
      ${settings.sectionOrder.map(secId => getWordSectionHTML(secId)).join('')}
    </div>
  `;

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${cvData.name} - CV</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 1.5cm;
        }
        body {
          font-family: ${wordFontFamily};
          color: #1e293b;
          line-height: 1.4;
          font-size: 10pt;
        }
      </style>
    </head>
    <body>
      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 12pt; border-bottom: 3px solid #0f172a; padding-bottom: 8pt;">
        <tr>
          <td align="left" valign="middle">
            <table cellspacing="0" cellpadding="0" border="0">
              <tr>
                ${base64Avatar && settings.headerPhotoPosition !== 'none' ? `
                  <td valign="middle" style="padding-right: 12pt;">
                    <img src="${base64Avatar}" width="65" height="65" style="border-radius: 50%; border: 1px solid #cbd5e1;" />
                  </td>
                ` : ''}
                <td valign="middle">
                  <h1 style="font-family: ${wordFontFamily}; font-size: 22pt; font-weight: bold; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.5px;">
                    ${cvData.name}
                  </h1>
                  <div style="font-family: ${wordFontFamily}; font-size: 11pt; font-weight: bold; color: ${activeColorHex}; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3pt;">
                    ${cvData.title}
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" valign="middle" style="font-family: ${wordFontFamily}; font-size: 8.5pt; color: #64748b; line-height: 1.3;">
            <div>${cvData.location}</div>
            <div>${cvData.email}</div>
            <div>${cvData.linkedin}</div>
          </td>
        </tr>
      </table>

      ${cvData.aboutMe ? `
        <p style="font-family: ${wordFontFamily}; font-size: 9.5pt; color: #334155; margin-bottom: 14pt; text-align: justify; line-height: 1.45;">
          ${cvData.aboutMe.replace(/\n/g, '<br/>')}
        </p>
      ` : ''}

      ${bodyContentHTML}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `cv_${cvData.name.toLowerCase().replace(/\s+/g, '_')}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
