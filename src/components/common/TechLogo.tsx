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
import { renderBuiltinTechLogo } from './techLogoSvgs';

export interface TechLogoProps {
  name: string;
  iconName?: string;
  customSvg?: string;
  svgUrl?: string;
  className?: string;
  size?: number;
  shapeRendering?: 'auto' | 'crispEdges' | 'optimizeSpeed' | 'geometricPrecision';
}

function sanitizeAndFormatSvg(raw: string, shapeRendering: string = 'crispEdges'): string {
  if (!raw) return '';
  let cleaned = raw
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .trim();

  const svgStartIndex = cleaned.indexOf('<svg');
  if (svgStartIndex === -1) return '';
  cleaned = cleaned.substring(svgStartIndex);

  cleaned = cleaned.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
    let newAttrs = attrs
      .replace(/\bwidth\s*=\s*"[^"]*"/gi, '')
      .replace(/\bheight\s*=\s*"[^"]*"/gi, '')
      .replace(/\bstyle\s*="[^"]*width:[^;"]*;?[^"]*"/gi, '')
      .replace(/\bstyle\s*="[^"]*height:[^;"]*;?[^"]*"/gi, '')
      .trim();
    return `<svg width="100%" height="100%" ${newAttrs} shape-rendering="${shapeRendering}">`;
  });

  return cleaned;
}

export const TechLogo: React.FC<TechLogoProps> = ({
  name = '',
  iconName,
  customSvg,
  svgUrl,
  className = 'w-8 h-8',
  size = 32,
  shapeRendering = 'crispEdges'
}) => {
  const rawSvgCandidate = customSvg || (svgUrl && svgUrl.includes('<svg') ? svgUrl : undefined);
  if (rawSvgCandidate && rawSvgCandidate.includes('<svg')) {
    const cleanSvg = sanitizeAndFormatSvg(rawSvgCandidate, shapeRendering);
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
  const builtinNode = renderBuiltinTechLogo(norm, size, className);
  if (builtinNode) {
    return <>{builtinNode}</>;
  }

  const renderFallbackIcon = () => {
    switch (iconName) {
      case 'Database': return <Database className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'LayoutGrid': return <LayoutGrid className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      case 'Grid': return <Grid className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Server': return <Server className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Globe': return <Globe className={className} />;
      default: return <Code className={className} />;
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {renderFallbackIcon()}
    </div>
  );
};

export default TechLogo;
