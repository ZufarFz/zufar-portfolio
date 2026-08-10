import React from 'react';

interface BackgroundTexturesProps {
  type: string;
  theme: 'light' | 'dark';
}

export default function BackgroundTextures({ type, theme }: BackgroundTexturesProps) {
  // Dynamically detect mobile view to disable heavy real-time SVG turbulence/pulse animations
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Common container with smooth transition
  const baseClass = `absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${
    isMobile ? 'transition-opacity duration-200' : 'transition-all duration-500'
  }`;

  const isDark = theme === 'dark';

  // We set a slightly more vivid container opacity in dark mode to showcase the thicker lines
  const opacityMultiplier = isDark ? 'opacity-[0.6]' : 'opacity-[0.95]';

  switch (type) {
    case 'watercolor_blush':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {/* Paper texture overlay simulation using SVG turbulence - Completely skipped on mobile */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-repeat" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          )}
          
          {/* Soft watercolor blob 1 */}
          <div 
            className={`absolute w-[45%] h-[55%] rounded-full blur-[90px] -left-[10%] -top-[10%] ${isMobile ? '' : 'animate-pulse'}`}
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(136, 19, 55, 0.28) 0%, rgba(136, 19, 55, 0) 70%)' 
                : 'radial-gradient(circle, rgba(254, 219, 219, 0.75) 0%, rgba(254, 219, 219, 0) 70%)',
              animationDuration: '14s'
            }}
          />

          {/* Soft watercolor blob 2 */}
          <div 
            className="absolute w-[50%] h-[60%] rounded-full blur-[100px] right-[-5%] top-[10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(112, 26, 117, 0.22) 0%, rgba(112, 26, 117, 0) 75%)' 
                : 'radial-gradient(circle, rgba(251, 207, 232, 0.7) 0%, rgba(251, 207, 232, 0) 75%)',
            }}
          />

          {/* Soft watercolor blob 3 (Peach/Beige) */}
          <div 
            className="absolute w-[40%] h-[50%] rounded-full blur-[80px] left-[30%] bottom-[-10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(124, 45, 18, 0.2) 0%, rgba(124, 45, 18, 0) 70%)' 
                : 'radial-gradient(circle, rgba(254, 237, 222, 0.85) 0%, rgba(254, 237, 222, 0) 70%)',
            }}
          />

          {/* Soft watercolor blob 4 (Subtle Apricot) */}
          <div 
            className="absolute w-[35%] h-[45%] rounded-full blur-[85px] right-[20%] -top-[15%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(120, 113, 108, 0.15) 0%, rgba(120, 113, 108, 0) 70%)' 
                : 'radial-gradient(circle, rgba(255, 237, 213, 0.75) 0%, rgba(255, 237, 213, 0) 70%)',
            }}
          />

          {/* Elegant hand-painted golden organic accent lines (luxury watercolor vector) - Thicker & more radiant */}
          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.45]' : 'opacity-[0.32]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <stop offset="0%" stopColor={isDark ? "#f59e0b" : "#d97706"} /> {/* Amber 500 or 600 */}
                <stop offset="50%" stopColor="#fde047" /> {/* Yellow 300 */}
                <stop offset="100%" stopColor={isDark ? "#b45309" : "#78350f"} /> {/* Darker Amber */}
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'watercolor_gold':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {/* Fine paper canvas grain - Completely skipped on mobile */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")' }} />
          )}

          {/* Earthy Red Beige background watercolor layer */}
          <div 
            className="absolute w-[55%] h-[65%] rounded-full blur-[110px] right-[-10%] -top-[10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(127, 29, 29, 0.24) 0%, rgba(127, 29, 29, 0) 75%)' 
                : 'radial-gradient(circle, rgba(239, 185, 185, 0.6) 0%, rgba(239, 185, 185, 0) 75%)',
            }}
          />
          <div 
            className="absolute w-[45%] h-[55%] rounded-full blur-[90px] left-[-5%] bottom-[-5%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(120, 53, 4, 0.2) 0%, rgba(120, 53, 4, 0) 70%)' 
                : 'radial-gradient(circle, rgba(243, 218, 203, 0.7) 0%, rgba(243, 218, 203, 0) 70%)',
            }}
          />
          <div 
            className="absolute w-[35%] h-[45%] rounded-full blur-[70px] left-[25%] top-[15%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(67, 20, 7, 0.26) 0%, rgba(67, 20, 7, 0) 70%)' 
                : 'radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(254, 215, 170, 0) 70%)',
            }}
          />

          {/* Exquisite Gold Veins (Marble/Kintsugi style) - Thicker & brighter */}
          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.55]' : 'opacity-[0.42]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Highly detailed organic gold veins */}
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
                <stop offset="0%" stopColor="#eab308" /> {/* Yellow 500 */}
                <stop offset="30%" stopColor="#fef08a" /> {/* Yellow 200 */}
                <stop offset="70%" stopColor="#ca8a04" /> {/* Yellow 600 */}
                <stop offset="100%" stopColor={isDark ? "#a16207" : "#854d0e"} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'watercolor_pastel':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {/* Subtle Canvas Grain - Completely skipped on mobile */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'paper\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23paper)\'/%3E%3C/svg%3E")' }} />
          )}

          {/* Lavender/Pink pastel orb */}
          <div 
            className="absolute w-[60%] h-[70%] rounded-full blur-[120px] left-[-15%] top-[-10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(88, 28, 135, 0.28) 0%, rgba(88, 28, 135, 0) 75%)' 
                : 'radial-gradient(circle, rgba(243, 232, 255, 0.8) 0%, rgba(243, 232, 255, 0) 75%)',
            }}
          />

          {/* Baby blue pastel wash */}
          <div 
            className="absolute w-[50%] h-[60%] rounded-full blur-[100px] right-[-10%] bottom-[-10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(30, 58, 138, 0.22) 0%, rgba(30, 58, 138, 0) 70%)' 
                : 'radial-gradient(circle, rgba(224, 242, 254, 0.75) 0%, rgba(224, 242, 254, 0) 70%)',
            }}
          />

          {/* Peach glow center-right */}
          <div 
            className="absolute w-[40%] h-[50%] rounded-full blur-[90px] right-[15%] top-[10%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(124, 45, 18, 0.18) 0%, rgba(124, 45, 18, 0) 70%)' 
                : 'radial-gradient(circle, rgba(255, 237, 213, 0.7) 0%, rgba(255, 237, 213, 0) 70%)',
            }}
          />
          
          {/* Dreamy flow lines - Thicker & more contrast */}
          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.4]' : 'opacity-[0.22]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,100 Q 250,50 500,200 T 1000,100" stroke={isDark ? "#c084fc" : "#a78bfa"} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 0,300 Q 300,450 600,250 T 1000,400" stroke={isDark ? "#f472b6" : "#ec4899"} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case 'watercolor_sunset':
      return (
        <div className={`${baseClass} ${opacityMultiplier}`}>
          {/* Heavy watercolor paper texture simulation - Completely skipped on mobile */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.055] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'rough\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23rough)\'/%3E%3C/svg%3E")' }} />
          )}

          {/* Coral red watercolor bleed top */}
          <div 
            className="absolute w-[55%] h-[60%] rounded-full blur-[110px] left-[15%] -top-[15%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(153, 27, 27, 0.28) 0%, rgba(153, 27, 27, 0) 75%)' 
                : 'radial-gradient(circle, rgba(254, 202, 202, 0.8) 0%, rgba(254, 202, 202, 0) 75%)',
            }}
          />

          {/* Deep rose peach bleed right */}
          <div 
            className="absolute w-[45%] h-[55%] rounded-full blur-[90px] right-[-5%] top-[20%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(190, 24, 74, 0.22) 0%, rgba(190, 24, 74, 0) 70%)' 
                : 'radial-gradient(circle, rgba(251, 113, 133, 0.45) 0%, rgba(251, 113, 133, 0) 70%)',
            }}
          />

          {/* Apricot wash bottom-left */}
          <div 
            className="absolute w-[50%] h-[60%] rounded-full blur-[100px] left-[-10%] bottom-[-5%]"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(146, 64, 14, 0.22) 0%, rgba(146, 64, 14, 0) 75%)' 
                : 'radial-gradient(circle, rgba(254, 215, 170, 0.75) 0%, rgba(254, 215, 170, 0) 75%)',
            }}
          />

          {/* Elegant minimalist gold circles (modern Japanese wave-inspired / luxury art circles) - Thicker lines */}
          <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.45]' : 'opacity-[0.3]'}`} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    default:
      return null;
  }
}

