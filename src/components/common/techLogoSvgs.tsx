import React from 'react';
import { renderDataAndDevOpsLogos } from './techLogoSvgsData';

export function renderBuiltinTechLogo(
  norm: string,
  size: number,
  className: string
): React.ReactNode | null {
  // Check data & devops logos first
  const dataLogo = renderDataAndDevOpsLogos(norm, size, className);
  if (dataLogo) return dataLogo;

  // 1. HTML5
  if (norm === 'html' || norm === 'html5') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 2L5.5 19.5L12 21.5L18.5 19.5L20 2H4Z" fill="#E44D26"/>
        <path d="M12 3.5V19.8L17.2 18.2L18.4 3.5H12Z" fill="#F16529"/>
        <path d="M8.5 6.5H15.5L15.2 9H8.7L8.9 11.5H15L14.6 15.5L12 16.3L9.4 15.5L9.2 13.5H7.2L7.6 17.5L12 18.8L16.4 17.5L17.1 6.5H8.5V6.5Z" fill="white"/>
      </svg>
    );
  }

  // 2. CSS3
  if (norm === 'css' || norm === 'css3') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 2L5.5 19.5L12 21.5L18.5 19.5L20 2H4Z" fill="#1572B6"/>
        <path d="M12 3.5V19.8L17.2 18.2L18.4 3.5H12Z" fill="#33A9DC"/>
        <path d="M8.5 6.5H15.5L15.2 9H8.7L8.9 11.5H15L14.6 15.5L12 16.3L9.4 15.5L9.2 13.5H7.2L7.6 17.5L12 18.8L16.4 17.5L17.1 6.5H8.5Z" fill="white"/>
      </svg>
    );
  }

  // 3. JavaScript
  if (norm === 'javascript' || norm === 'js') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
        <path d="M7 17.5C7.8 18.3 8.8 18.7 9.8 18.7C11.5 18.7 12.3 17.8 12.3 16.2V10.5H10.4V16.1C10.4 16.9 10 17.2 9.4 17.2C8.7 17.2 8.2 16.9 7.7 16.3L7 17.5ZM13.8 17.3C14.7 18.2 15.9 18.7 17.2 18.7C19.3 18.7 20.6 17.6 20.6 15.8C20.6 14.1 19.5 13.3 17.9 12.6L17.2 12.3C16.2 11.9 15.7 11.5 15.7 10.9C15.7 10.3 16.2 9.8 17.1 9.8C17.9 9.8 18.6 10.1 19.1 10.7L19.9 9.4C19.1 8.6 18.2 8.3 17.1 8.3C15.2 8.3 13.9 9.4 13.9 11.1C13.9 12.7 14.9 13.5 16.5 14.2L17.2 14.5C18.3 15 18.8 15.5 18.8 16.2C18.8 17 18.1 17.5 17.1 17.5C16 17.5 15.2 16.9 14.6 16.1L13.8 17.3Z" fill="#000000"/>
      </svg>
    );
  }

  // 4. TypeScript
  if (norm === 'typescript' || norm === 'ts') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M5.5 9.5H12.5V11H9.8V18.5H8.2V11H5.5V9.5ZM13.5 17.3C14.4 18.2 15.6 18.7 16.9 18.7C19 18.7 20.3 17.6 20.3 15.8C20.3 14.1 19.2 13.3 17.6 12.6L16.9 12.3C15.9 11.9 15.4 11.5 15.4 10.9C15.4 10.3 15.9 9.8 16.8 9.8C17.6 9.8 18.3 10.1 18.8 10.7L19.6 9.4C18.8 8.6 17.9 8.3 16.8 8.3C14.9 8.3 13.6 9.4 13.6 11.1C13.6 12.7 14.6 13.5 16.2 14.2L16.9 14.5C18 15 18.5 15.5 18.5 16.2C18.5 17 17.8 17.5 16.8 17.5C15.7 17.5 14.9 16.9 14.3 16.1L13.5 17.3Z" fill="white"/>
      </svg>
    );
  }

  // 5. React / React.js
  if (norm === 'react' || norm === 'reactjs') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(30 12 12)"/>
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(90 12 12)"/>
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(150 12 12)"/>
        <circle cx="12" cy="12" r="2.2" fill="#61DAFB"/>
      </svg>
    );
  }

  // 6. Tailwind
  if (norm === 'tailwind' || norm === 'tailwindcss') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 9C7.2 6.6 9 5.4 11.4 5.4C15 5.4 15.6 8.4 17.4 8.4C18.6 8.4 19.5 7.8 20.4 6.6C19.2 9 17.4 10.2 15 10.2C11.4 10.2 10.8 7.2 9 7.2C7.8 7.2 6.9 7.8 6 9ZM1.2 15C2.4 12.6 4.2 11.4 6.6 11.4C10.2 11.4 10.8 14.4 12.6 14.4C13.8 14.4 14.7 13.8 15.6 12.6C14.4 15 12.6 16.2 10.2 16.2C6.6 16.2 6 13.2 4.2 13.2C3 13.2 2.1 13.8 1.2 15Z" fill="#38BDF8"/>
      </svg>
    );
  }

  // 7. PHP
  if (norm === 'php') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4"/>
        <path d="M6.2 9.5H8.8C9.6 9.5 10.2 9.9 10.2 10.6C10.2 11.5 9.5 12 8.6 12H7.4L6.8 14.5H5.4L6.2 9.5ZM7.7 10.8H8.4C8.8 10.8 9 10.6 9 10.4C9 10.1 8.8 10 8.4 10H7.9L7.7 10.8Z" fill="white"/>
        <path d="M10.8 9.5H12.2L11.7 11.8H13.2L13.7 9.5H15.1L14 14.5H12.6L13.1 12.7H11.6L11.1 14.5H9.7L10.8 9.5Z" fill="white"/>
        <path d="M15.5 9.5H18.1C18.9 9.5 19.5 9.9 19.5 10.6C19.5 11.5 18.8 12 17.9 12H16.7L16.1 14.5H14.7L15.5 9.5ZM17 10.8H17.7C18.1 10.8 18.3 10.6 18.3 10.4C18.3 10.1 18.1 10 17.7 10H17.2L17 10.8Z" fill="white"/>
      </svg>
    );
  }

  // 8. Laravel
  if (norm === 'laravel') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#FF2D20"/>
        <path d="M5.5 8L11.5 4.5L17.5 8V12L11.5 15.5L5.5 12V8Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <path d="M11.5 4.5V15.5M5.5 8L11.5 11.5L17.5 8" stroke="white" strokeWidth="1.5"/>
        <path d="M11.5 15.5L17.5 12L18.5 16.5L11.5 20L5.5 16.5L6.5 12" stroke="white" strokeWidth="1.2" fill="none"/>
      </svg>
    );
  }

  // 9. Vercel
  if (norm === 'vercel') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 3L22 20H2L12 3Z"/>
      </svg>
    );
  }

  // 10. VS Code
  if (norm === 'vscode' || norm === 'visualstudiocode') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17.5 2.5L7.5 10.8L3.2 7.4L1.5 8.4L5.2 12L1.5 15.6L3.2 16.6L7.5 13.2L17.5 21.5L22.5 19V5L17.5 2.5Z" fill="#007ACC"/>
        <path d="M17.5 2.5L7.5 10.8L17.5 18.5V2.5Z" fill="#1F9CF0"/>
        <path d="M17.5 18.5L7.5 10.8L3.2 14.2L17.5 21.5V18.5Z" fill="#0065A9"/>
      </svg>
    );
  }

  // 11. Node.js
  if (norm === 'node' || norm === 'nodejs') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#339933"/>
        <path d="M12 4.5L18.5 8.2V15.8L12 19.5L5.5 15.8V8.2L12 4.5Z" fill="#5FA04E"/>
        <path d="M12 7.5L16 9.8V14.2L12 16.5L8 14.2V9.8L12 7.5Z" fill="white"/>
      </svg>
    );
  }

  // 12. Next.js
  if (norm === 'next' || norm === 'nextjs') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" fill="black"/>
        <path d="M15 8V16M9 8V16L17.5 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // 13. Figma
  if (norm === 'figma') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 12C6.34315 12 5 10.6569 5 9C5 7.34315 6.34315 6 8 6H12V12H8Z" fill="#F24E1E"/>
        <path d="M12 6H16C17.6569 6 19 7.34315 19 9C19 10.6569 17.6569 12 16 12H12V6Z" fill="#FF7262"/>
        <path d="M12 12H16C17.6569 12 19 13.3431 19 15C19 16.6569 17.6569 18 16 18C14.3431 18 13 16.6569 13 15V12H12Z" fill="#1ABCFE"/>
        <path d="M8 18C6.34315 18 5 16.6569 5 15C5 13.3431 6.34315 12 8 12H12V18H8Z" fill="#0ACF83"/>
        <path d="M8 24C6.34315 24 5 22.6569 5 21C5 19.3431 6.34315 18 8 18H12V21C12 22.6569 10.6569 24 9 24H8Z" fill="#A259FF" transform="translate(0, -6)"/>
      </svg>
    );
  }

  return null;
}
