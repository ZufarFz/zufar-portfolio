import React from 'react';
import { PatternRenderContext, PatternRenderer } from './types';

export const renderWatercolorBlush: PatternRenderer = ({
  isDark,
  baseClass,
  isMobile
}) => {
  const opacityMultiplier = isDark ? 'opacity-[0.6]' : 'opacity-[0.95]';

  return (
    <div className={`${baseClass} ${opacityMultiplier}`}>
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-repeat"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'
          }}
        />
      )}

      <div
        className={`absolute w-[45%] h-[55%] rounded-full blur-[90px] -left-[10%] -top-[10%] ${
          isMobile ? '' : 'animate-pulse'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(136, 19, 55, 0.28) 0%, rgba(136, 19, 55, 0) 70%)'
            : 'radial-gradient(circle, rgba(254, 219, 219, 0.75) 0%, rgba(254, 219, 219, 0) 70%)',
          animationDuration: '14s'
        }}
      />

      <div
        className="absolute w-[50%] h-[60%] rounded-full blur-[100px] right-[-5%] top-[10%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(112, 26, 117, 0.22) 0%, rgba(112, 26, 117, 0) 75%)'
            : 'radial-gradient(circle, rgba(251, 207, 232, 0.7) 0%, rgba(251, 207, 232, 0) 75%)'
        }}
      />

      <div
        className="absolute w-[40%] h-[50%] rounded-full blur-[80px] left-[30%] bottom-[-10%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(124, 45, 18, 0.2) 0%, rgba(124, 45, 18, 0) 70%)'
            : 'radial-gradient(circle, rgba(254, 237, 222, 0.85) 0%, rgba(254, 237, 222, 0) 70%)'
        }}
      />

      <div
        className="absolute w-[35%] h-[45%] rounded-full blur-[85px] right-[20%] -top-[15%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(120, 113, 108, 0.15) 0%, rgba(120, 113, 108, 0) 70%)'
            : 'radial-gradient(circle, rgba(255, 237, 213, 0.75) 0%, rgba(255, 237, 213, 0) 70%)'
        }}
      />

      <svg
        className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.45]' : 'opacity-[0.32]'}`}
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-50,150 Q150,80 350,220 T750,120 T1050,190"
          stroke="url(#goldGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M-50,350 Q200,480 500,320 T1050,450"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#f59e0b' : '#d97706'} />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor={isDark ? '#b45309' : '#78350f'} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const renderWatercolorGold: PatternRenderer = ({
  isDark,
  baseClass,
  isMobile
}) => {
  const opacityMultiplier = isDark ? 'opacity-[0.6]' : 'opacity-[0.95]';

  return (
    <div className={`${baseClass} ${opacityMultiplier}`}>
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")'
          }}
        />
      )}

      <div
        className="absolute w-[55%] h-[65%] rounded-full blur-[110px] right-[-10%] -top-[10%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(127, 29, 29, 0.24) 0%, rgba(127, 29, 29, 0) 75%)'
            : 'radial-gradient(circle, rgba(239, 185, 185, 0.6) 0%, rgba(239, 185, 185, 0) 75%)'
        }}
      />
      <div
        className="absolute w-[45%] h-[55%] rounded-full blur-[90px] left-[-5%] bottom-[-5%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(120, 53, 4, 0.2) 0%, rgba(120, 53, 4, 0) 70%)'
            : 'radial-gradient(circle, rgba(243, 218, 203, 0.7) 0%, rgba(243, 218, 203, 0) 70%)'
        }}
      />
      <div
        className="absolute w-[35%] h-[45%] rounded-full blur-[70px] left-[25%] top-[15%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(67, 20, 7, 0.26) 0%, rgba(67, 20, 7, 0) 70%)'
            : 'radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(254, 215, 170, 0) 70%)'
        }}
      />

      <svg
        className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.55]' : 'opacity-[0.42]'}`}
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 150,-50 C 220,120 180,240 320,310 C 440,370 410,480 520,650"
          stroke="url(#luxuryGold)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 320,310 C 260,380 200,420 120,490"
          stroke="url(#luxuryGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 680,-50 C 600,100 710,220 640,340 C 580,440 680,520 720,650"
          stroke="url(#luxuryGold)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 640,340 C 740,380 820,330 920,410"
          stroke="url(#luxuryGold)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="luxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor={isDark ? '#a16207' : '#854d0e'} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const renderWatercolorPastel: PatternRenderer = ({
  isDark,
  baseClass,
  isMobile
}) => {
  const opacityMultiplier = isDark ? 'opacity-[0.6]' : 'opacity-[0.95]';

  return (
    <div className={`${baseClass} ${opacityMultiplier}`}>
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'paper\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23paper)\'/%3E%3C/svg%3E")'
          }}
        />
      )}

      <div
        className="absolute w-[60%] h-[70%] rounded-full blur-[120px] left-[-15%] top-[-10%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(88, 28, 135, 0.28) 0%, rgba(88, 28, 135, 0) 75%)'
            : 'radial-gradient(circle, rgba(243, 232, 255, 0.8) 0%, rgba(243, 232, 255, 0) 75%)'
        }}
      />

      <div
        className="absolute w-[50%] h-[60%] rounded-full blur-[100px] right-[-10%] bottom-[-10%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(30, 58, 138, 0.22) 0%, rgba(30, 58, 138, 0) 70%)'
            : 'radial-gradient(circle, rgba(224, 242, 254, 0.75) 0%, rgba(224, 242, 254, 0) 70%)'
        }}
      />

      <div
        className="absolute w-[40%] h-[50%] rounded-full blur-[90px] right-[15%] top-[10%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(124, 45, 18, 0.18) 0%, rgba(124, 45, 18, 0) 70%)'
            : 'radial-gradient(circle, rgba(255, 237, 213, 0.7) 0%, rgba(255, 237, 213, 0) 70%)'
        }}
      />

      <svg
        className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.4]' : 'opacity-[0.22]'}`}
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0,100 Q 250,50 500,200 T 1000,100"
          stroke={isDark ? '#c084fc' : '#a78bfa'}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 0,300 Q 300,450 600,250 T 1000,400"
          stroke={isDark ? '#f472b6' : '#ec4899'}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export const renderWatercolorSunset: PatternRenderer = ({
  isDark,
  baseClass,
  isMobile
}) => {
  const opacityMultiplier = isDark ? 'opacity-[0.6]' : 'opacity-[0.95]';

  return (
    <div className={`${baseClass} ${opacityMultiplier}`}>
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.055] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'rough\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23rough)\'/%3E%3C/svg%3E")'
          }}
        />
      )}

      <div
        className="absolute w-[55%] h-[60%] rounded-full blur-[110px] left-[15%] -top-[15%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(153, 27, 27, 0.28) 0%, rgba(153, 27, 27, 0) 75%)'
            : 'radial-gradient(circle, rgba(254, 202, 202, 0.8) 0%, rgba(254, 202, 202, 0) 75%)'
        }}
      />

      <div
        className="absolute w-[45%] h-[55%] rounded-full blur-[90px] right-[-5%] top-[20%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(190, 24, 74, 0.22) 0%, rgba(190, 24, 74, 0) 70%)'
            : 'radial-gradient(circle, rgba(251, 113, 133, 0.45) 0%, rgba(251, 113, 133, 0) 70%)'
        }}
      />

      <div
        className="absolute w-[50%] h-[60%] rounded-full blur-[100px] left-[-10%] bottom-[-5%]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(146, 64, 14, 0.22) 0%, rgba(146, 64, 14, 0) 75%)'
            : 'radial-gradient(circle, rgba(254, 215, 170, 0.75) 0%, rgba(254, 215, 170, 0) 75%)'
        }}
      />

      <svg
        className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.45]' : 'opacity-[0.3]'}`}
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="850" cy="150" r="80" stroke="url(#goldGrad)" strokeWidth="3.5" />
        <circle cx="850" cy="150" r="60" stroke="url(#goldGrad)" strokeWidth="2" strokeDasharray="5 5" />
        <circle cx="150" cy="450" r="100" stroke="url(#goldGrad)" strokeWidth="3" />
        <circle cx="150" cy="450" r="120" stroke="url(#goldGrad)" strokeWidth="1.5" />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const WATERCOLOR_TEXTURES: Record<string, PatternRenderer> = {
  watercolor_blush: renderWatercolorBlush,
  watercolor_gold: renderWatercolorGold,
  watercolor_pastel: renderWatercolorPastel,
  watercolor_sunset: renderWatercolorSunset
};
