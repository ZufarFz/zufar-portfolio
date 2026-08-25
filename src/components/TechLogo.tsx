import React from 'react';
import { 
  Database, 
  Terminal, 
  LayoutGrid, 
  TrendingUp, 
  Calculator, 
  Grid, 
  Cpu, 
  Layers, 
  Code, 
  Server, 
  Wrench, 
  Globe 
} from 'lucide-react';

interface TechLogoProps {
  name: string;
  iconName?: string;
  customSvg?: string;
  svgUrl?: string;
  className?: string;
  size?: number;
}

function sanitizeAndFormatSvg(raw: string): string {
  if (!raw) return '';
  let cleaned = raw
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .trim();

  const svgStartIndex = cleaned.indexOf('<svg');
  if (svgStartIndex === -1) return '';
  cleaned = cleaned.substring(svgStartIndex);

  // Normalize width and height so it scales to the parent container smoothly
  cleaned = cleaned.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
    let newAttrs = attrs
      .replace(/\bwidth\s*=\s*"[^"]*"/gi, '')
      .replace(/\bheight\s*=\s*"[^"]*"/gi, '')
      .replace(/\bstyle\s*=\s*"[^"]*width:[^;"]*;?[^"]*"/gi, '')
      .replace(/\bstyle\s*=\s*"[^"]*height:[^;"]*;?[^"]*"/gi, '')
      .trim();
    return `<svg width="100%" height="100%" ${newAttrs}>`;
  });

  return cleaned;
}

export default function TechLogo({
  name = '',
  iconName,
  customSvg,
  svgUrl,
  className = "w-8 h-8",
  size = 32
}: TechLogoProps) {
  // If custom raw SVG string is provided (or passed in svgUrl)
  const rawSvgCandidate = customSvg || (svgUrl && svgUrl.includes('<svg') ? svgUrl : undefined);
  if (rawSvgCandidate && rawSvgCandidate.includes('<svg')) {
    const cleanSvg = sanitizeAndFormatSvg(rawSvgCandidate);
    if (cleanSvg) {
      return (
        <div 
          className={`inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain ${className}`}
          style={{ width: size, height: size }}
          dangerouslySetInnerHTML={{ __html: cleanSvg }}
        />
      );
    }
  }

  // If custom image/svg URL is provided
  if (svgUrl && svgUrl.trim().length > 0) {
    return (
      <img
        src={svgUrl}
        alt={name}
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  const norm = name.toLowerCase().trim().replace(/[\s\-_.]+/g, '');

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

  // 6. Tailwind / Tailwind CSS
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

  // 9. MySQL
  if (norm === 'mysql') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M19 14.5C18.2 12.8 16.5 11.5 14.8 10.2C13.2 8.8 11.5 7.5 10.8 5.5C10.5 4.5 10.5 3.5 11 2.5C9.5 3.2 8.2 4.5 7.5 6C6.5 8 6.5 10.2 7.2 12.2C8 14.2 9.5 15.8 11.5 16.8C13.5 17.8 15.8 18 18 17.2C19.2 16.8 20.2 16 21 15C20.2 15 19.5 14.8 19 14.5Z" fill="#00758F"/>
        <path d="M13.5 17.5C11.5 18 9.5 17.5 7.8 16.2C6 14.8 4.8 12.8 4.2 10.5C3.8 8.8 3.8 7 4.5 5.5C3.5 7 3 8.8 3 10.5C3 13.5 4.8 16.2 7.5 17.8C9.5 19 12 19.5 14.5 19C16.5 18.5 18.2 17.2 19.5 15.5C17.5 16.8 15.5 17.2 13.5 17.5Z" fill="#F29111"/>
      </svg>
    );
  }

  // 10. Git
  if (norm === 'git') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21.6 10.8L13.2 2.4C12.4 1.6 11.2 1.6 10.4 2.4L8.8 4L11 6.2C11.6 6 12.4 6.2 13 6.8C13.6 7.4 13.8 8.2 13.6 8.8L15.8 11C16.4 10.8 17.2 11 17.8 11.6C18.6 12.4 18.6 13.6 17.8 14.4C17 15.2 15.8 15.2 15 14.4C14.4 13.8 14.2 13 14.4 12.4L12.4 10.4V15.2C12.6 15.4 12.8 15.8 12.8 16.2C12.8 17.4 11.8 18.4 10.6 18.4C9.4 18.4 8.4 17.4 8.4 16.2C8.4 15.2 9 14.4 10 14.2V9.4C9 9.2 8.4 8.4 8.4 7.4C8.4 7 8.6 6.6 8.8 6.2L2.4 12.6C1.6 13.4 1.6 14.6 2.4 15.4L10.8 23.8C11.6 24.6 12.8 24.6 13.6 23.8L21.6 15.8C22.4 15 22.4 13.8 21.6 13V10.8Z" fill="#F05032"/>
      </svg>
    );
  }

  // 11. GitHub
  if (norm === 'github') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  // 12. Vercel
  if (norm === 'vercel') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 3L22 20H2L12 3Z"/>
      </svg>
    );
  }

  // 13. VS Code
  if (norm === 'vscode' || norm === 'visualstudiocode') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17.5 2.5L7.5 10.8L3.2 7.4L1.5 8.4L5.2 12L1.5 15.6L3.2 16.6L7.5 13.2L17.5 21.5L22.5 19V5L17.5 2.5Z" fill="#007ACC"/>
        <path d="M17.5 2.5L7.5 10.8L17.5 18.5V2.5Z" fill="#1F9CF0"/>
        <path d="M17.5 18.5L7.5 10.8L3.2 14.2L17.5 21.5V18.5Z" fill="#0065A9"/>
      </svg>
    );
  }

  // 14. Laragon
  if (norm === 'laragon') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#0E83CD"/>
        <path d="M12 5C7.5 5 4 8 4 12C4 16 7.5 19 12 19C13 19 14 18.8 14.8 18.4C14.5 17.5 14.5 16.5 15 15.5C15.5 14.5 16.5 14 17.5 14C18.2 14 19 14.3 19.5 14.8C19.8 13.9 20 13 20 12C20 8 16.5 5 12 5Z" fill="white"/>
        <circle cx="9" cy="10" r="1.5" fill="#0E83CD"/>
        <path d="M12 11C12 13 10.5 14.5 8.5 14.5" stroke="#0E83CD" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // 15. SQL / PostgreSQL / SQLite
  if (norm === 'sql' || norm === 'postgresql' || norm === 'postgres' || norm === 'sqlite' || norm === 'database') {
    if (norm === 'postgresql' || norm === 'postgres') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#336791"/>
          <path d="M8 8C9 7 11 6.5 13 7C15 7.5 16.5 9 17 11C17.5 13 17 15 16 16.5C15 18 13 19 11 18.5C9 18 7.5 16.5 7 14.5C6.5 12.5 7 10 8 8Z" fill="white"/>
          <circle cx="10" cy="11" r="1" fill="#336791"/>
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <ellipse cx="12" cy="6" rx="8" ry="3" fill="#336791"/>
        <path d="M4 6V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V6" stroke="#336791" strokeWidth="2" fill="none"/>
        <path d="M4 12V18C4 19.66 7.58 21 12 21C16.42 21 20 19.66 20 18V12" stroke="#336791" strokeWidth="2" fill="none"/>
        <path d="M7 6H17M7 12H17M7 18H17" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
  }

  // 16. Python
  if (norm === 'python') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M11.9 2C8.6 2 8.8 3.4 8.8 3.4L8.8 4.9H12.1V5.4H5.3C3.6 5.4 2.2 7.1 2.2 9.4C2.2 11.7 3.2 12.7 4.7 12.7H6V11.2C6 9.5 7.5 8 9.2 8H12.6C13.9 8 15 6.9 15 5.6V3.4C15 3.4 14.8 2 11.9 2ZM10.3 3.1C10.8 3.1 11.2 3.5 11.2 4C11.2 4.5 10.8 4.9 10.3 4.9C9.8 4.9 9.4 4.5 9.4 4C9.4 3.5 9.8 3.1 10.3 3.1Z" fill="#3776AB"/>
        <path d="M12.1 22C15.4 22 15.2 20.6 15.2 20.6L15.2 19.1H11.9V18.6H18.7C20.4 18.6 21.8 16.9 21.8 14.6C21.8 12.3 20.8 11.3 19.3 11.3H18V12.8C18 14.5 16.5 16 14.8 16H11.4C10.1 16 9 17.1 9 18.4V20.6C9 20.6 9.2 22 12.1 22ZM13.7 20.9C13.2 20.9 12.8 20.5 12.8 20C12.8 19.5 13.2 19.1 13.7 19.1C14.2 19.1 14.6 19.5 14.6 20C14.6 20.5 14.2 20.9 13.7 20.9Z" fill="#FFD43B"/>
      </svg>
    );
  }

  // 17. PowerBI
  if (norm === 'powerbi' || norm === 'powerbi' || norm === 'pbi') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="12" width="4.5" height="9" rx="1" fill="#E6AD10"/>
        <rect x="7.5" y="8" width="4.5" height="13" rx="1" fill="#F2C811"/>
        <rect x="13" y="4" width="4.5" height="17" rx="1" fill="#F9DE59"/>
        <rect x="18.5" y="10" width="3.5" height="11" rx="1" fill="#E6AD10"/>
      </svg>
    );
  }

  // 18. Power Query
  if (norm === 'powerquery' || norm === 'powerquerym' || norm === 'mcode') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="5" fill="#008272"/>
        <path d="M6 7H18V10H6V7Z" fill="white" fillOpacity="0.9"/>
        <path d="M6 11H14V14H6V11Z" fill="white" fillOpacity="0.9"/>
        <path d="M6 15H11V18H6V15Z" fill="white" fillOpacity="0.9"/>
        <circle cx="16" cy="15" r="2.5" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M18 17L20 19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // 19. Excel
  if (norm === 'excel' || norm === 'ms-excel' || norm === 'microsoftexcel') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4.5" fill="#107C41"/>
        <path d="M14 6H20V18H14V6Z" fill="#21A366"/>
        <path d="M14 6H8V18H14V6Z" fill="#107C41"/>
        <path d="M4 8H12V16H4V8Z" fill="#185C37" rx="1"/>
        <path d="M6.2 10.2L7.6 12L6.2 13.8H7.5L8.3 12.6L9.1 13.8H10.4L9 12L10.4 10.2H9.1L8.3 11.4L7.5 10.2H6.2Z" fill="white"/>
      </svg>
    );
  }

  // 20. Tableau
  if (norm === 'tableau') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M11.5 2V6M11.5 18V22M2 11.5H6M18 11.5H22" stroke="#E9762B" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M11.5 7V17M7 11.5H17" stroke="#E9762B" strokeWidth="2.8" strokeLinecap="round"/>
        <path d="M5.5 5.5L7.5 7.5M16.5 16.5L18.5 18.5M18.5 5.5L16.5 7.5M7.5 16.5L5.5 18.5" stroke="#2B6B9C" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  }

  // 21. Docker
  if (norm === 'docker') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M22.5 11.5C21.8 11.5 21.2 11.8 20.8 12.3C19.8 10.5 17.8 9.5 15.5 9.8V8H18.5V5H15.5V2H12.5V5H9.5V8H3.5V11H0.5V14C0.5 18 4 21 9.5 21C16.5 21 21.5 17 22.8 12.2C22.7 12 22.6 11.7 22.5 11.5Z" fill="#2496ED"/>
        <rect x="4.5" y="8.5" width="2" height="2" fill="white"/>
        <rect x="7.5" y="8.5" width="2" height="2" fill="white"/>
        <rect x="10.5" y="8.5" width="2" height="2" fill="white"/>
        <rect x="7.5" y="5.5" width="2" height="2" fill="white"/>
        <rect x="10.5" y="5.5" width="2" height="2" fill="white"/>
        <rect x="13.5" y="5.5" width="2" height="2" fill="white"/>
      </svg>
    );
  }

  // 22. Node.js
  if (norm === 'node' || norm === 'nodejs') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#339933"/>
        <path d="M12 4.5L18.5 8.2V15.8L12 19.5L5.5 15.8V8.2L12 4.5Z" fill="#5FA04E"/>
        <path d="M12 7.5L16 9.8V14.2L12 16.5L8 14.2V9.8L12 7.5Z" fill="white"/>
      </svg>
    );
  }

  // 23. Next.js
  if (norm === 'next' || norm === 'nextjs') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" fill="black"/>
        <path d="M15 8V16M9 8V16L17.5 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // 24. Figma
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

  // 25. R / R-Language
  if (norm === 'r' || norm === 'rlang' || norm === 'rstats') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <ellipse cx="12" cy="12" rx="10" ry="7.5" fill="#276DC3"/>
        <path d="M9 7H14C15.5 7 16.5 7.8 16.5 9.2C16.5 10.5 15.6 11.2 14.2 11.5L17 17H14.5L12 12.2H11V17H9V7ZM11 10.5H13.5C14.2 10.5 14.6 10.1 14.6 9.6C14.6 9.1 14.2 8.7 13.5 8.7H11V10.5Z" fill="white"/>
      </svg>
    );
  }

  // 26. Pandas
  if (norm === 'pandas') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="7" height="7" rx="2" fill="#150458"/>
        <rect x="14" y="3" width="7" height="7" rx="2" fill="#E70488"/>
        <rect x="3" y="14" width="7" height="7" rx="2" fill="#FFD43B"/>
        <rect x="14" y="14" width="7" height="7" rx="2" fill="#150458"/>
      </svg>
    );
  }

  // Fallback to Lucide icon or generic code icon
  const renderFallbackIcon = () => {
    switch (iconName) {
      case 'Database':
        return <Database className={className} />;
      case 'Terminal':
        return <Terminal className={className} />;
      case 'LayoutGrid':
        return <LayoutGrid className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Calculator':
        return <Calculator className={className} />;
      case 'Grid':
        return <Grid className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Server':
        return <Server className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      default:
        return <Code className={className} />;
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {renderFallbackIcon()}
    </div>
  );
}
