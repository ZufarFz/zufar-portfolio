import React from 'react';
import { PatternRenderContext, PatternRenderer } from './types';

export const renderSeigaiha: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  isDark,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_seigaiha_${patternId}`;
  const radii = [40, 29, 18, 7];
  const fanBg = isDark ? '#090d16' : '#ffffff';

  const renderFan = (cx: number, cy: number, key: string) => (
    <g key={key}>
      <path
        d={`M ${cx - 40},${cy} A 40,40 0 0,1 ${cx + 40},${cy} Z`}
        fill={fanBg}
      />
      {radii.map((r, i) => (
        <path
          key={i}
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
          fill="none"
          stroke={defaultStrokeColor}
          strokeWidth={i === 0 ? '1.6' : '1.2'}
          strokeLinecap="round"
        />
      ))}
    </g>
  );

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
            {renderFan(0, -20, 'f_0_m20')}
            {renderFan(80, -20, 'f_80_m20')}
            {renderFan(40, 0, 'f_40_0')}
            {renderFan(-40, 0, 'f_m40_0')}
            {renderFan(120, 0, 'f_120_0')}
            {renderFan(0, 20, 'f_0_20')}
            {renderFan(80, 20, 'f_80_20')}
            {renderFan(-80, 20, 'f_m80_20')}
            {renderFan(160, 20, 'f_160_20')}
            {renderFan(40, 40, 'f_40_40')}
            {renderFan(-40, 40, 'f_m40_40')}
            {renderFan(120, 40, 'f_120_40')}
            {renderFan(0, 60, 'f_0_60')}
            {renderFan(80, 60, 'f_80_60')}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderJapaneseClouds: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  isDark,
  baseClass,
  activeOpacity,
  color
}) => {
  const pId = `p_kumo_${patternId}`;
  const symbolMainId = `c_main_${patternId}`;
  const symbolMiniId = `c_mini_${patternId}`;

  const cloudFill = isDark ? '#f8fafc' : '#ffffff';
  const cloudStroke = isDark ? '#0f172a' : (color || '#334155');
  const waveStroke = defaultStrokeColor;

  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <g id={symbolMainId}>
            <path
              d="M -42,16 
                 C -30,12 -18,12 0,12 
                 C 18,12 30,12 42,14 
                 C 48,15 52,14 54,12 
                 C 55,9 50,6 44,5 
                 C 48,-1 45,-9 36,-11 
                 C 32,-12 28,-9 26,-6 
                 C 28,-18 18,-28 4,-28 
                 C -10,-28 -18,-18 -14,-7 
                 C -20,-8 -28,-3 -28,6 
                 C -28,10 -34,13 -42,16 Z"
              fill={cloudFill}
              stroke={cloudStroke}
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 4,-28 
                 C -4,-28 -10,-20 -8,-10 
                 C -6,-2 2,2 8,0 
                 C 13,-2 15,-8 12,-13 
                 C 10,-16 5,-16 3,-13 
                 C 1,-10 4,-7 7,-8"
              fill="none"
              stroke={cloudStroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 36,-11 
                 C 30,-7 26,0 30,6 
                 C 33,10 38,9 41,6 
                 C 43,3 41,0 38,0 
                 C 36,0 35,2 36,4"
              fill="none"
              stroke={cloudStroke}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M -42,16 
                 C -32,13 -22,11 -12,11"
              fill="none"
              stroke={cloudStroke}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M -28,6 
                 C -22,5 -18,7 -17,10"
              fill="none"
              stroke={cloudStroke}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          <g id={symbolMiniId}>
            <path
              d="M -24,9 
                 C -16,7 -10,7 0,7 
                 C 10,7 16,7 24,8 
                 C 28,9 30,8 31,6 
                 C 31,4 27,2 23,2 
                 C 26,-2 23,-7 17,-8 
                 C 15,-8 13,-6 12,-4 
                 C 13,-12 7,-17 -2,-17 
                 C -9,-17 -14,-11 -11,-4 
                 C -15,-5 -20,-2 -20,3 
                 C -20,6 -23,8 -24,9 Z"
              fill={cloudFill}
              stroke={cloudStroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M -2,-17 
                 C -7,-17 -10,-12 -8,-6 
                 C -7,-1 -2,1 2,0 
                 C 5,-1 6,-5 4,-8 
                 C 3,-9 0,-9 -1,-8"
              fill="none"
              stroke={cloudStroke}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M -24,9 C -17,7 -12,6 -5,6"
              fill="none"
              stroke={cloudStroke}
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </g>

          <pattern
            id={pId}
            width="180"
            height="220"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={waveStroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.65">
              <path d="M-10,25 C35,10 70,40 115,18 C145,8 170,22 190,25" />
              <path d="M-10,38 C40,24 75,52 120,32 C150,20 175,34 190,38" />
              <path d="M-10,52 C45,40 80,65 125,46 C155,34 178,48 190,52" />

              <path d="M-10,80 C30,65 65,95 110,72 C140,58 165,74 190,80" />
              <path d="M-10,94 C35,80 70,108 115,86 C145,72 170,88 190,94" />
              <path d="M-10,108 C40,96 75,120 120,100 C150,86 175,102 190,108" />

              <path d="M-10,135 C35,120 70,150 115,128 C145,118 170,132 190,135" />
              <path d="M-10,148 C40,134 75,162 120,142 C150,130 175,144 190,148" />
              <path d="M-10,162 C45,150 80,175 125,156 C155,144 178,158 190,162" />

              <path d="M-10,190 C30,175 65,205 110,182 C140,168 165,184 190,190" />
              <path d="M-10,204 C35,190 70,218 115,196 C145,182 170,198 190,204" />
              <path d="M-10,218 C40,206 75,230 120,210 C150,196 175,212 190,218" />
            </g>

            <g id="clouds_top_layer">
              <use href={`#${symbolMainId}`} x="50" y="65" />
              <use href={`#${symbolMainId}`} x="230" y="65" />
              <use href={`#${symbolMainId}`} x="-130" y="65" />

              <use href={`#${symbolMainId}`} x="140" y="175" />
              <use href={`#${symbolMainId}`} x="-40" y="175" />
              <use href={`#${symbolMainId}`} x="320" y="175" />
              <use href={`#${symbolMainId}`} x="140" y="-45" />
              <use href={`#${symbolMainId}`} x="-40" y="-45" />
              <use href={`#${symbolMainId}`} x="320" y="-45" />
              <use href={`#${symbolMainId}`} x="140" y="395" />

              <use href={`#${symbolMiniId}`} x="140" y="60" />
              <use href={`#${symbolMiniId}`} x="-40" y="60" />
              <use href={`#${symbolMiniId}`} x="320" y="60" />

              <use href={`#${symbolMiniId}`} x="45" y="170" />
              <use href={`#${symbolMiniId}`} x="225" y="170" />
              <use href={`#${symbolMiniId}`} x="-135" y="170" />
              <use href={`#${symbolMiniId}`} x="45" y="-50" />
              <use href={`#${symbolMiniId}`} x="225" y="-50" />
              <use href={`#${symbolMiniId}`} x="-135" y="-50" />

              <use href={`#${symbolMiniId}`} x="90" y="118" />
              <use href={`#${symbolMiniId}`} x="270" y="118" />
              <use href={`#${symbolMiniId}`} x="-90" y="118" />

              <use href={`#${symbolMiniId}`} x="90" y="228" />
              <use href={`#${symbolMiniId}`} x="90" y="8" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderAsanoha: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_asanoha_${patternId}`;
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
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
              <path d="M30,0 L60,17.3 L60,52 L30,69.3 L0,52 L0,17.3 Z" />
              <path d="M30,34.6 L30,0 M30,34.6 L60,17.3 M30,34.6 L60,52 M30,34.6 L30,69.3 M30,34.6 L0,52 M30,34.6 L0,17.3" />
              <path d="M30,0 L0,52 M30,0 L60,52 M60,17.3 L0,17.3 M60,52 L0,52 M30,69.3 L0,17.3 M30,69.3 L60,17.3" />

              <path d="M0,52 L30,69.3 L30,104 L0,121.3 L-30,104 L-30,69.3 Z" />
              <path d="M0,86.6 L0,52 M0,86.6 L30,69.3 M0,86.6 L30,104 M0,86.6 L0,121.3 M0,86.6 L-30,104 M0,86.6 L-30,69.3" />
              <path d="M0,52 L-30,104 M0,52 L30,104 M30,69.3 L-30,69.3 M30,104 L-30,104 M0,121.3 L-30,69.3 M0,121.3 L30,69.3" />

              <path d="M60,52 L90,69.3 L90,104 L60,121.3 L30,104 L30,69.3 Z" />
              <path d="M60,86.6 L60,52 M60,86.6 L90,69.3 M60,86.6 L90,104 M60,86.6 L60,121.3 M60,86.6 L30,104 M60,86.6 L30,69.3" />
              <path d="M60,52 L30,104 M60,52 L90,104 M90,69.3 L30,69.3 M90,104 L30,104 M60,121.3 L30,69.3 M60,121.3 L90,69.3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderYagasuri: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_yagasuri_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="40"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill={defaultStrokeColor} opacity="0.8">
              <polygon points="0,0 20,20 20,40 0,20" />
              <polygon points="20,20 0,40 0,60 20,40" />
              <polygon points="0,40 20,60 20,80 0,60" />
              <polygon points="20,60 0,80 0,100 20,80" />

              <polygon points="20,0 40,20 40,40 20,20" opacity="0.45" />
              <polygon points="40,20 20,40 20,60 40,40" opacity="0.45" />
              <polygon points="20,40 40,60 40,80 20,60" opacity="0.45" />
              <polygon points="40,60 20,80 20,100 40,80" opacity="0.45" />
            </g>
            <line x1="20" y1="0" x2="20" y2="80" stroke={defaultStrokeColor} strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="80" stroke={defaultStrokeColor} strokeWidth="1" />
            <line x1="40" y1="0" x2="40" y2="80" stroke={defaultStrokeColor} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderKarakusa: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_karakusa_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4" strokeLinecap="round">
              <path d="M0,45 C20,20 35,70 55,45 C75,20 90,70 90,45" />
              <path d="M45,0 C20,20 70,35 45,55 C20,75 70,90 45,90" />
              <path d="M25,32 C20,25 22,18 28,18 C33,18 36,22 34,26 C32,29 28,29 27,27" />
              <path d="M65,58 C60,65 62,72 68,72 C73,72 76,68 74,64 C72,61 68,61 67,63" />
              <path d="M32,65 C25,60 18,62 18,68 C18,73 22,76 26,74 C29,72 29,68 27,67" />
              <path d="M58,25 C65,20 72,22 72,28 C72,33 68,36 64,34 C61,32 61,28 63,27" />
              <path d="M12,42 C8,35 15,30 20,36 Z" fill={defaultStrokeColor} />
              <path d="M78,48 C82,55 75,60 70,54 Z" fill={defaultStrokeColor} />
              <path d="M42,12 C35,8 30,15 36,20 Z" fill={defaultStrokeColor} />
              <path d="M48,78 C55,82 60,75 54,70 Z" fill={defaultStrokeColor} />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderSayagata: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_sayagata_${patternId}`;
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
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M0,15 L15,15 L15,0 L30,0 L30,30 L0,30" />
              <path d="M30,0 L45,0 L45,15 L60,15" />
              <path d="M0,45 L15,45 L15,60 L30,60 L30,30 L60,30 L60,60 L45,60 L45,45" />
              <path d="M30,30 L45,30 L45,45" />
              <path d="M15,15 L15,30 L30,30" />
              <path d="M45,15 L45,30" />
              <path d="M15,45 L0,45" />
              <path d="M60,45 L45,45" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderSakura: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_sakura_${patternId}`;
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
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5">
              <path d="M0,20 C30,10 60,40 100,25" />
              <path d="M0,70 C40,55 70,85 100,75" />
            </g>

            <g transform="translate(40, 45) scale(0.95)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinejoin="round">
              {[0, 72, 144, 216, 288].map((angle, idx) => (
                <g key={idx} transform={`rotate(${angle})`}>
                  <path d="M0,0 C-5,-10 -8,-16 -3,-20 C-1,-21 0,-18 0,-18 C0,-18 1,-21 3,-20 C8,-16 5,-10 0,0 Z" />
                  <line x1="0" y1="-5" x2="0" y2="-12" strokeWidth="0.8" />
                </g>
              ))}
              <circle cx="0" cy="0" r="2.5" fill={defaultStrokeColor} />
            </g>

            <g transform="translate(15, 15) rotate(25)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
              <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
            </g>

            <g transform="translate(85, 20) rotate(-40)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
              <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
            </g>

            <g transform="translate(85, 80) rotate(70)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
              <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
            </g>

            <g transform="translate(10, 85) rotate(-15)" fill="none" stroke={defaultStrokeColor} strokeWidth="1.2">
              <path d="M0,0 C-3,-6 -5,-10 -2,-13 C-1,-14 0,-12 0,-12 C0,-12 1,-14 2,-13 C5,-10 3,-6 0,0 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderShippo: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_shippou_${patternId}`;
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
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4">
              <circle cx="30" cy="30" r="30" />
              <circle cx="0" cy="0" r="30" />
              <circle cx="60" cy="0" r="30" />
              <circle cx="0" cy="60" r="30" />
              <circle cx="60" cy="60" r="30" />
              <circle cx="30" cy="30" r="2.5" fill={defaultStrokeColor} />
              <circle cx="0" cy="0" r="2" fill={defaultStrokeColor} />
              <circle cx="60" cy="0" r="2" fill={defaultStrokeColor} />
              <circle cx="0" cy="60" r="2" fill={defaultStrokeColor} />
              <circle cx="60" cy="60" r="2" fill={defaultStrokeColor} />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderKikko: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_kikko_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="52"
            height="90"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.3" strokeLinejoin="round">
              <polygon points="26,0 52,15 52,45 26,60 0,45 0,15" />
              <polygon points="0,45 26,60 26,90 0,105 -26,90 -26,60" />
              <polygon points="52,45 78,60 78,90 52,105 26,90 26,60" />
              <polygon points="26,8 45,19 45,41 26,52 7,41 7,19" strokeWidth="0.9" />
              <circle cx="26" cy="30" r="3" fill={defaultStrokeColor} />
              <circle cx="0" cy="75" r="2.5" fill={defaultStrokeColor} />
              <circle cx="52" cy="75" r="2.5" fill={defaultStrokeColor} />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderUroko: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_uroko_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="48"
            height="41.56"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g stroke={defaultStrokeColor} strokeWidth="1.2" strokeLinejoin="round">
              <polygon points="24,0 48,41.56 0,41.56" fill={defaultStrokeColor} opacity="0.35" />
              <polygon points="0,0 24,0 12,20.78" fill="none" />
              <polygon points="24,0 48,0 36,20.78" fill="none" />
              <polygon points="12,20.78 36,20.78 24,41.56" fill="none" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderKanoko: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_kanoko_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g stroke={defaultStrokeColor} strokeWidth="1.1" fill="none">
              <polygon points="18,4 30,18 18,32 6,18" />
              <circle cx="18" cy="18" r="2.5" fill={defaultStrokeColor} stroke="none" />
              <polygon points="0,-14 12,0 0,14 -12,0" />
              <circle cx="0" cy="0" r="2" fill={defaultStrokeColor} stroke="none" />
              <polygon points="36,-14 48,0 36,14 24,0" />
              <circle cx="36" cy="0" r="2" fill={defaultStrokeColor} stroke="none" />
              <polygon points="0,22 12,36 0,50 -12,36" />
              <circle cx="0" cy="36" r="2" fill={defaultStrokeColor} stroke="none" />
              <polygon points="36,22 48,36 36,50 24,36" />
              <circle cx="36" cy="36" r="2" fill={defaultStrokeColor} stroke="none" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderIgeta: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_igeta_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.8" strokeLinecap="square">
              <line x1="8" y1="16" x2="36" y2="16" />
              <line x1="8" y1="28" x2="36" y2="28" />
              <line x1="16" y1="8" x2="16" y2="36" />
              <line x1="28" y1="8" x2="28" y2="36" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const renderBambooWeave: PatternRenderer = ({
  patternId,
  scaleVal,
  defaultStrokeColor,
  baseClass,
  activeOpacity
}) => {
  const pId = `p_kagome_${patternId}`;
  return (
    <div className={baseClass} style={{ opacity: activeOpacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={pId}
            width="60"
            height="52"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scaleVal})`}
          >
            <g fill="none" stroke={defaultStrokeColor} strokeWidth="1.4" strokeLinecap="round">
              <line x1="0" y1="0" x2="60" y2="0" />
              <line x1="0" y1="26" x2="60" y2="26" />
              <line x1="0" y1="52" x2="60" y2="52" />
              <line x1="0" y1="0" x2="60" y2="52" />
              <line x1="30" y1="0" x2="90" y2="52" />
              <line x1="-30" y1="0" x2="30" y2="52" />
              <line x1="60" y1="0" x2="0" y2="52" />
              <line x1="30" y1="0" x2="-30" y2="52" />
              <line x1="90" y1="0" x2="30" y2="52" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pId})`} />
      </svg>
    </div>
  );
};

export const JAPANESE_WAGARA_PATTERNS: Record<string, PatternRenderer> = {
  pattern_seigaiha: renderSeigaiha,
  pattern_japanese_clouds: renderJapaneseClouds,
  pattern_kumo: renderJapaneseClouds,
  pattern_asanoha: renderAsanoha,
  pattern_yagasuri: renderYagasuri,
  pattern_karakusa: renderKarakusa,
  pattern_sayagata: renderSayagata,
  pattern_sakura: renderSakura,
  pattern_shippo: renderShippo,
  pattern_shippou: renderShippo,
  pattern_kikko: renderKikko,
  pattern_uroko: renderUroko,
  pattern_kanoko: renderKanoko,
  pattern_igeta: renderIgeta,
  pattern_bamboo_weave: renderBambooWeave
};
