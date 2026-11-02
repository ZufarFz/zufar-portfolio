import React from 'react';
import { PatternRenderContext, PatternRenderer } from './types';

export const renderHoneycomb: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_honeycomb_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="56"
            height="96"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <path
              d="M28,0 L28,16 L0,32 L0,64 L28,80 L28,96 M0,64 L-28,48 L-28,16 L0,0 M28,16 L56,32 L56,64 L28,80 M56,32 L84,16 M56,64 L84,80"
              fill="none"
              stroke={defaultStrokeColor}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon
              points="28,26 46,36.5 46,59.5 28,70 10,59.5 10,36.5"
              fill="none"
              stroke={defaultStrokeColor}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <polygon
              points="0,-22 18,-11.5 18,11.5 0,22 -18,11.5 -18,-11.5"
              fill="none"
              stroke={defaultStrokeColor}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <polygon
              points="56,-22 74,-11.5 74,11.5 56,22 38,11.5 38,-11.5"
              fill="none"
              stroke={defaultStrokeColor}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <polygon
              points="0,74 18,84.5 18,107.5 0,118 -18,107.5 -18,84.5"
              fill="none"
              stroke={defaultStrokeColor}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <polygon
              points="56,74 74,84.5 74,107.5 56,118 38,107.5 38,84.5"
              fill="none"
              stroke={defaultStrokeColor}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderTopography: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_topography_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0,20 C40,10 60,50 100,30 C140,10 150,40 160,20" />
              <path d="M0,45 C35,35 65,75 105,55 C135,35 145,65 160,45" />
              <path d="M0,70 C30,60 70,100 110,80 C130,60 140,90 160,70" />
              <path d="M0,95 C25,85 75,125 115,105 C125,85 135,115 160,95" />
              <path d="M0,120 C20,110 80,150 120,130 C130,110 145,135 160,120" />
              <path d="M0,145 C15,135 85,175 125,155 C135,135 150,155 160,145" />
              <path d="M40,0 C30,40 70,60 50,100 C30,140 60,150 40,160" />
              <path d="M120,0 C110,40 150,60 130,100 C110,140 140,150 120,160" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderCircuit: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_circuit_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0,20 L30,20 L45,35 L75,35 L85,25 L100,25" />
              <path d="M20,0 L20,30 L35,45 L35,80 L50,95 L50,100" />
              <path d="M0,75 L25,75 L40,60 L70,60 L80,70 L100,70" />
              <path d="M80,0 L80,20 L65,35 L65,70 L80,85 L80,100" />
              <path d="M45,45 L55,45 L55,55 L45,55 Z" strokeWidth="1.5" />
            </g>
            <g fill={defaultStrokeColor}>
              <circle cx="30" cy="20" r="2.5" />
              <circle cx="75" cy="35" r="2.5" />
              <circle cx="20" cy="30" r="2.5" />
              <circle cx="35" cy="80" r="2.5" />
              <circle cx="25" cy="75" r="2.5" />
              <circle cx="70" cy="60" r="2.5" />
              <circle cx="80" cy="20" r="2.5" />
              <circle cx="65" cy="70" r="2.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderMoroccan: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_moroccan_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinecap="round">
              <path d="M30,0 C30,12 18,12 18,30 C18,48 30,48 30,60 C30,48 42,48 42,30 C42,12 30,12 30,0 Z" />
              <path d="M0,30 C12,30 12,18 30,18 C48,18 48,30 60,30 C48,30 48,42 30,42 C12,42 12,30 0,30 Z" />
              <circle cx="30" cy="30" r="4" fill={defaultStrokeColor} />
              <circle cx="0" cy="0" r="3" />
              <circle cx="60" cy="0" r="3" />
              <circle cx="0" cy="60" r="3" />
              <circle cx="60" cy="60" r="3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderIsometricCubes: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_isocubes_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="60"
            height="104"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.2" strokeLinejoin="round">
              <path d="M30,0 L60,17.3 L60,52 L30,69.3 L0,52 L0,17.3 Z" />
              <path d="M30,34.6 L30,69.3 M30,34.6 L0,17.3 M30,34.6 L60,17.3" />
              <path d="M0,52 L30,69.3 L30,104 L0,121.3 L-30,104 L-30,69.3 Z" />
              <path d="M0,86.6 L0,121.3 M0,86.6 L-30,69.3 M0,86.6 L30,69.3" />
              <path d="M60,52 L90,69.3 L90,104 L60,121.3 L30,104 L30,69.3 Z" />
              <path d="M60,86.6 L60,121.3 M60,86.6 L30,69.3 M60,86.6 L90,69.3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderChevron: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_chevron_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M0,10 L20,30 L40,10" />
              <path d="M0,-10 L20,10 L40,-10" />
              <path d="M0,30 L20,50 L40,30" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderConstellation: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_constellation_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3">
              <path d="M20,30 L60,15 L95,45 L75,90 L30,85 Z" />
              <path d="M60,15 L75,90 M20,30 L95,45" />
              <path d="M0,60 L20,30 M95,45 L120,60 M30,85 L60,120 M75,90 L60,120" />
            </g>
            <g fill={defaultStrokeColor}>
              <circle cx="20" cy="30" r="3" />
              <circle cx="60" cy="15" r="2.2" />
              <circle cx="95" cy="45" r="3" />
              <circle cx="75" cy="90" r="2.6" />
              <circle cx="30" cy="85" r="2.2" />
              <circle cx="0" cy="60" r="2" />
              <circle cx="120" cy="60" r="2" />
              <circle cx="60" cy="120" r="2" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderDiamonds: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_diamonds_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="48"
            height="72"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
              <polygon points="24,0 48,36 24,72 0,36" />
              <polygon points="24,8 40,36 24,64 8,36" strokeWidth="0.8" />
              <circle cx="24" cy="36" r="2" fill={defaultStrokeColor} />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderCrosshatch: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_crosshatch_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1">
              <line x1="0" y1="0" x2="32" y2="0" />
              <line x1="0" y1="0" x2="0" y2="32" />
              <line x1="14" y1="16" x2="18" y2="16" strokeWidth="1.5" />
              <line x1="16" y1="14" x2="16" y2="18" strokeWidth="1.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderWavesSinusoid: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_sinusoid_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="80"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4" strokeLinecap="round">
              <path d="M0,20 Q20,5 40,20 T80,20" />
              <path d="M0,0 Q20,-15 40,0 T80,0" />
              <path d="M0,40 Q20,25 40,40 T80,40" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const MODERN_GEOMETRIC_PATTERNS: Record<string, PatternRenderer> = {
  pattern_honeycomb: renderHoneycomb,
  pattern_topography: renderTopography,
  pattern_circuit: renderCircuit,
  pattern_moroccan: renderMoroccan,
  pattern_isometric_cubes: renderIsometricCubes,
  pattern_chevron: renderChevron,
  pattern_constellation: renderConstellation,
  pattern_diamonds: renderDiamonds,
  pattern_crosshatch: renderCrosshatch,
  pattern_waves_sinusoid: renderWavesSinusoid
};
