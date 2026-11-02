import React from 'react';

interface GooeyHeadElementsProps {
  headStyle: 'eyes' | 'none' | 'dot';
  isClicking: boolean;
  coreRadius: number;
  coreDotColor: string;
  hideDefaultCursor: boolean;
  isHovering: boolean;
  badgeType: 'question' | 'exclamation' | 'heart' | 'sparkle' | null;
  theme: 'light' | 'dark';
}

export const GooeyHeadElements: React.FC<GooeyHeadElementsProps> = ({
  headStyle,
  isClicking,
  coreRadius,
  coreDotColor,
  hideDefaultCursor,
  isHovering,
  badgeType,
  theme
}) => {
  return (
    <>
      {/* HEAD STYLE 1: CUTE CATERPILLAR GOOGLY EYES */}
      {headStyle === 'eyes' && (
        <g className="gooey-eyes-group" style={{ pointerEvents: 'none' }}>
          {/* OPEN EYES */}
          <g
            className="gooey-eyes-open"
            style={{
              opacity: isClicking ? 0 : 1,
              transition: 'opacity 0.08s ease-out'
            }}
          >
            <circle className="gooey-eye-1" cx="-200" cy="-200" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="0.9" />
            <circle className="gooey-pupil-1" cx="-200" cy="-200" r="1.6" fill="#0f172a" />
            <circle className="gooey-spec-1" cx="-200" cy="-200" r="0.6" fill="#ffffff" />

            <circle className="gooey-eye-2" cx="-200" cy="-200" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="0.9" />
            <circle className="gooey-pupil-2" cx="-200" cy="-200" r="1.6" fill="#0f172a" />
            <circle className="gooey-spec-2" cx="-200" cy="-200" r="0.6" fill="#ffffff" />
          </g>

          {/* BLINKING CLOSED EYES */}
          <g
            className="gooey-eyes-blink"
            style={{
              opacity: isClicking ? 1 : 0,
              transition: 'opacity 0.08s ease-out'
            }}
          >
            <path
              className="gooey-blink-1"
              d="M -200 -200 Q -200 -200 -200 -200"
              stroke="#0f172a"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
            <path
              className="gooey-blink-2"
              d="M -200 -200 Q -200 -200 -200 -200"
              stroke="#0f172a"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      )}

      {/* HEAD STYLE 2: CRISP CENTER DOT */}
      {headStyle === 'dot' && (
        <circle
          className="gooey-core-dot"
          cx="-200"
          cy="-200"
          r={coreRadius}
          fill={coreDotColor}
          opacity={hideDefaultCursor ? 1 : (isHovering ? 0.95 : 0.85)}
          style={{
            transition: 'r 0.15s ease-out'
          }}
        />
      )}

      {/* HOVER REACTION FLOATING BADGE ABOVE HEAD */}
      <g className="gooey-hover-badge-group" style={{ pointerEvents: 'none' }}>
        <g
          className="gooey-badge-content"
          transform="translate(-200, -200) scale(0)"
          style={{
            opacity: 0,
            transition: 'opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <path
            className="gooey-badge-tail-stroke"
            d="M 0 0"
            stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
            strokeWidth="1.4"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            className="gooey-badge-tail-fill"
            d="M 0 0"
            fill={theme === 'dark' ? '#0f172a' : '#ffffff'}
          />

          <circle
            cx="0"
            cy="0"
            r="11"
            fill={theme === 'dark' ? '#0f172a' : '#ffffff'}
            stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
            strokeWidth="1.4"
          />

          {badgeType === 'question' && (
            <text
              x="0"
              y="4.2"
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="900"
              fill="#38bdf8"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              ?
            </text>
          )}

          {badgeType === 'exclamation' && (
            <text
              x="0"
              y="4.2"
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="900"
              fill="#f59e0b"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              !
            </text>
          )}

          {badgeType === 'heart' && (
            <path
              d="M 0,3.2 C -0.8,1.4 -4.8,-1.2 -4.8,-4.2 C -4.8,-6.8 -2.0,-7.6 0,-5.8 C 2.0,-7.6 4.8,-6.8 4.8,-4.2 C 4.8,-1.2 0.8,1.4 0,3.2 Z"
              fill="#f43f5e"
            />
          )}

          {badgeType === 'sparkle' && (
            <path
              d="M 0,-5.5 Q 0,0 5.5,0 Q 0,0 0,5.5 Q 0,0 -5.5,0 Q 0,0 0,-5.5 Z"
              fill="#fbbf24"
            />
          )}
        </g>
      </g>
    </>
  );
};

