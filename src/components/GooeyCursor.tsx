import React, { useEffect, useRef, useState } from 'react';

export type GooeyHoverReaction = 
  | 'none' 
  | 'question' 
  | 'exclamation' 
  | 'heart' 
  | 'sparkle' 
  | 'wide_eyes';

interface GooeyCursorProps {
  enabled?: boolean;
  color?: string; // Hex color or CSS color
  secondaryColor?: string;
  theme?: 'light' | 'dark';
  size?: number; // Base radius in px (default 18, range 10-45)
  opacity?: number; // Opacity (0.2 to 1.0, default 0.8)
  hideDefaultCursor?: boolean; // Hide standard OS cursor
  enableSplash?: boolean; // Trigger fluid splash on click
  hoverScale?: boolean; // Expand size when hovering interactive elements
  hoverReaction?: GooeyHoverReaction; // Reaction type when hovering clickable elements
  headStyle?: 'eyes' | 'none' | 'dot'; // Head indicator: cute caterpillar eyes, clean none, or center dot
}

interface Point {
  x: number;
  y: number;
}

interface SplashParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number;
  life: number;
  maxLife: number;
}

export default function GooeyCursor({
  enabled = true,
  color,
  secondaryColor,
  theme = 'dark',
  size = 18,
  opacity = 0.8,
  hideDefaultCursor = false,
  enableSplash = true,
  hoverScale = false,
  hoverReaction = 'question',
  headStyle = 'eyes'
}: GooeyCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Independent hover scaling
  const effectiveHoverScale = Boolean(hoverScale);

  // Independent hover reaction badge
  const badgeType: 'question' | 'exclamation' | 'heart' | 'sparkle' | null = (() => {
    if (hoverReaction === 'question') return 'question';
    if (hoverReaction === 'exclamation') return 'exclamation';
    if (hoverReaction === 'heart') return 'heart';
    if (hoverReaction === 'sparkle') return 'sparkle';
    return null;
  })();

  const isWideEyes = hoverReaction === 'wide_eyes' && isHovering;

  // Default color palette based on theme & props
  const primaryBlobColor = color || (theme === 'dark' ? '#10b981' : '#059669'); // emerald accent
  const coreDotColor = secondaryColor || (theme === 'dark' ? '#34d399' : '#047857');

  const mousePos = useRef<Point>({ x: -200, y: -200 });
  const prevMousePos = useRef<Point>({ x: -200, y: -200 });
  
  // Motion angle heading for eyes (in radians)
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);

  // Total circles in the continuous liquid metaball chain
  const BLOB_COUNT = 24;
  // History sample step per circle (higher = longer trail length)
  const TRAIL_STEP = 2; 
  const MAX_HISTORY = BLOB_COUNT * TRAIL_STEP + 45;

  // History buffer of coordinates following the exact user path
  const historyRef = useRef<Point[]>([]);
  
  // Current rendered positions of each blob
  const blobsRef = useRef<Point[]>(
    Array.from({ length: BLOB_COUNT }, () => ({ x: -200, y: -200 }))
  );

  // Splash particles on mouse click
  const splashParticlesRef = useRef<SplashParticle[]>([]);
  const particleIdCounter = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  // Manage hiding the system default cursor if requested
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine || !enabled || !hideDefaultCursor) return;

    const styleTag = document.createElement('style');
    styleTag.id = 'gooey-hide-system-cursor';
    styleTag.innerHTML = `
      *, *::before, *::after, html, body, button, a, input, select, textarea, [role="button"], .cursor-pointer {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      const existing = document.getElementById('gooey-hide-system-cursor');
      if (existing) {
        existing.remove();
      }
    };
  }, [enabled, hideDefaultCursor]);

  useEffect(() => {
    // Only run on devices that support fine pointer (mice/trackpads)
    if (typeof window === 'undefined') return;
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine || !enabled) {
      setIsVisible(false);
      return;
    }

    // Helper to push interpolated points into history so fast mouse movement maintains dense continuity
    const pushPathPoints = (startX: number, startY: number, endX: number, endY: number) => {
      const dx = endX - startX;
      const dy = endY - startY;
      const dist = Math.hypot(dx, dy);

      // Compute heading angle if distance moved is noticeable
      if (dist > 1.5) {
        targetAngleRef.current = Math.atan2(dy, dx);
      }

      // If moved significantly between events, subdivide to prevent trail stretching
      const steps = Math.min(16, Math.max(1, Math.floor(dist / 5)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        historyRef.current.unshift({
          x: startX + dx * t,
          y: startY + dy * t
        });
      }

      // Trim history to limit memory
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.length = MAX_HISTORY;
      }
    };

    const triggerSplash = (cx: number, cy: number) => {
      if (!enableSplash) return;
      const particleCount = 10;
      const newParticles: SplashParticle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = 3.5 + Math.random() * 5.5; // Outward burst velocity
        const maxLife = 22 + Math.floor(Math.random() * 10); // Frames duration

        newParticles.push({
          id: ++particleIdCounter.current,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseR: (size * 0.45) * (0.6 + Math.random() * 0.6),
          life: maxLife,
          maxLife
        });
      }

      splashParticlesRef.current.push(...newParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        // Initialize history with initial position
        historyRef.current = Array.from({ length: MAX_HISTORY }, () => ({ x: newX, y: newY }));
        blobsRef.current.forEach((blob) => {
          blob.x = newX;
          blob.y = newY;
        });
      } else {
        pushPathPoints(mousePos.current.x, mousePos.current.y, newX, newY);
      }

      prevMousePos.current = { ...mousePos.current };
      mousePos.current = { x: newX, y: newY };
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      triggerSplash(e.clientX, e.clientY);
    };

    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = Boolean(
        target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer, .bento-card, [tabindex]:not([tabindex="-1"])')
      );
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Smooth history-following and physics animation loop
    const render = () => {
      const currentMouse = mousePos.current;

      // Continuously feed the current mouse position into history (collapses trail when stopped)
      historyRef.current.unshift({ x: currentMouse.x, y: currentMouse.y });
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.pop();
      }

      // Smoothly interpolate eye heading angle
      let angleDiff = targetAngleRef.current - currentAngleRef.current;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      currentAngleRef.current += angleDiff * 0.28;

      // Update each blob to follow exact historical coordinates
      blobsRef.current.forEach((blob, i) => {
        // Target index in the historical trail array
        const historyIndex = Math.min(i * TRAIL_STEP, historyRef.current.length - 1);
        const target = historyRef.current[historyIndex] || currentMouse;

        // Ultra responsive lerp towards that specific point on the historical path
        const lerpFactor = i === 0 ? 0.75 : 0.46;
        blob.x += (target.x - blob.x) * lerpFactor;
        blob.y += (target.y - blob.y) * lerpFactor;
      });

      // Update splash particles
      if (splashParticlesRef.current.length > 0) {
        splashParticlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.88; // viscous air drag
          p.vy *= 0.88;
          p.life -= 1;
        });

        // Remove dead particles
        splashParticlesRef.current = splashParticlesRef.current.filter((p) => p.life > 0);
      }

      if (containerRef.current) {
        const circles = containerRef.current.querySelectorAll<SVGCircleElement>('.gooey-blob-circle');
        circles.forEach((circle, i) => {
          const blob = blobsRef.current[i];
          if (blob) {
            circle.setAttribute('cx', blob.x.toFixed(1));
            circle.setAttribute('cy', blob.y.toFixed(1));
          }
        });

        // Update core pointer dot (if dot mode)
        const coreDot = containerRef.current.querySelector<SVGCircleElement>('.gooey-core-dot');
        if (coreDot) {
          coreDot.setAttribute('cx', currentMouse.x.toFixed(1));
          coreDot.setAttribute('cy', currentMouse.y.toFixed(1));
        }

        // Update cute caterpillar eyes (if eyes mode)
        const eyesGroup = containerRef.current.querySelector<SVGGElement>('.gooey-eyes-group');
        if (eyesGroup) {
          const headX = currentMouse.x;
          const headY = currentMouse.y;
          const angle = currentAngleRef.current;
          
          // Head radius for eye placement
          const currentHeadR = Math.max(8, size * (effectiveHoverScale && isHovering ? 1.4 : 1.0));
          const eyeDist = currentHeadR * 0.52; // Offset from head center towards front edge
          const eyeSpacingAngle = 0.58; // ~33 deg left and right from heading

          // Eye 1 (Left eye relative to motion)
          const eye1X = headX + Math.cos(angle - eyeSpacingAngle) * eyeDist;
          const eye1Y = headY + Math.sin(angle - eyeSpacingAngle) * eyeDist;

          // Eye 2 (Right eye relative to motion)
          const eye2X = headX + Math.cos(angle + eyeSpacingAngle) * eyeDist;
          const eye2Y = headY + Math.sin(angle + eyeSpacingAngle) * eyeDist;

          const eyeR = Math.max(2.4, currentHeadR * 0.28);
          const pupilR = Math.max(1.3, isWideEyes ? eyeR * 0.72 : eyeR * 0.54);
          const pupilLookOffset = isWideEyes ? eyeR * 0.15 : eyeR * 0.28; // Look ahead in motion direction

          // Pupil positions
          const p1X = eye1X + Math.cos(angle) * pupilLookOffset;
          const p1Y = eye1Y + Math.sin(angle) * pupilLookOffset;
          const p2X = eye2X + Math.cos(angle) * pupilLookOffset;
          const p2Y = eye2Y + Math.sin(angle) * pupilLookOffset;

          // Cute specular catchlight position
          const spec1X = p1X - pupilR * 0.32;
          const spec1Y = p1Y - pupilR * 0.32;
          const spec2X = p2X - pupilR * 0.32;
          const spec2Y = p2Y - pupilR * 0.32;
          const specR = Math.max(0.6, pupilR * 0.35);

          // Update SVG attributes directly for 60fps performance
          const eye1 = eyesGroup.querySelector<SVGCircleElement>('.gooey-eye-1');
          const eye2 = eyesGroup.querySelector<SVGCircleElement>('.gooey-eye-2');
          const pupil1 = eyesGroup.querySelector<SVGCircleElement>('.gooey-pupil-1');
          const pupil2 = eyesGroup.querySelector<SVGCircleElement>('.gooey-pupil-2');
          const spec1 = eyesGroup.querySelector<SVGCircleElement>('.gooey-spec-1');
          const spec2 = eyesGroup.querySelector<SVGCircleElement>('.gooey-spec-2');

          if (eye1) { eye1.setAttribute('cx', eye1X.toFixed(1)); eye1.setAttribute('cy', eye1Y.toFixed(1)); eye1.setAttribute('r', eyeR.toFixed(1)); }
          if (eye2) { eye2.setAttribute('cx', eye2X.toFixed(1)); eye2.setAttribute('cy', eye2Y.toFixed(1)); eye2.setAttribute('r', eyeR.toFixed(1)); }
          if (pupil1) { pupil1.setAttribute('cx', p1X.toFixed(1)); pupil1.setAttribute('cy', p1Y.toFixed(1)); pupil1.setAttribute('r', pupilR.toFixed(1)); }
          if (pupil2) { pupil2.setAttribute('cx', p2X.toFixed(1)); pupil2.setAttribute('cy', p2Y.toFixed(1)); pupil2.setAttribute('r', pupilR.toFixed(1)); }
          if (spec1) { spec1.setAttribute('cx', spec1X.toFixed(1)); spec1.setAttribute('cy', spec1Y.toFixed(1)); spec1.setAttribute('r', specR.toFixed(1)); }
          if (spec2) { spec2.setAttribute('cx', spec2X.toFixed(1)); spec2.setAttribute('cy', spec2Y.toFixed(1)); spec2.setAttribute('r', specR.toFixed(1)); }

          // Cute thin closed-eye blink arcs calculation (clean, thin, separated slit lines on click)
          const blink1 = eyesGroup.querySelector<SVGPathElement>('.gooey-blink-1');
          const blink2 = eyesGroup.querySelector<SVGPathElement>('.gooey-blink-2');

          // Normal and forward unit vectors for eyelid orientation
          const nx = -Math.sin(angle);
          const ny = Math.cos(angle);
          const fx = Math.cos(angle);
          const fy = Math.sin(angle);

          // Small and thin eyelid span - strictly separated so they never touch
          const arcSpan = eyeR * 0.48;
          const arcDepth = eyeR * 0.22;

          // Eye 1 Blink Arc
          const b1_p1X = eye1X - nx * arcSpan;
          const b1_p1Y = eye1Y - ny * arcSpan;
          const b1_p2X = eye1X + nx * arcSpan;
          const b1_p2Y = eye1Y + ny * arcSpan;
          const b1_cpX = eye1X - fx * arcDepth;
          const b1_cpY = eye1Y - fy * arcDepth;
          if (blink1) {
            blink1.setAttribute('d', `M ${b1_p1X.toFixed(1)},${b1_p1Y.toFixed(1)} Q ${b1_cpX.toFixed(1)},${b1_cpY.toFixed(1)} ${b1_p2X.toFixed(1)},${b1_p2Y.toFixed(1)}`);
            blink1.setAttribute('stroke-width', Math.max(0.9, Math.min(1.3, eyeR * 0.28)).toFixed(1));
          }

          // Eye 2 Blink Arc
          const b2_p1X = eye2X - nx * arcSpan;
          const b2_p1Y = eye2Y - ny * arcSpan;
          const b2_p2X = eye2X + nx * arcSpan;
          const b2_p2Y = eye2Y + ny * arcSpan;
          const b2_cpX = eye2X - fx * arcDepth;
          const b2_cpY = eye2Y - fy * arcDepth;
          if (blink2) {
            blink2.setAttribute('d', `M ${b2_p1X.toFixed(1)},${b2_p1Y.toFixed(1)} Q ${b2_cpX.toFixed(1)},${b2_cpY.toFixed(1)} ${b2_p2X.toFixed(1)},${b2_p2Y.toFixed(1)}`);
            blink2.setAttribute('stroke-width', Math.max(0.9, Math.min(1.3, eyeR * 0.28)).toFixed(1));
          }
        }

        // Floating hover reaction badge above caterpillar head
        const badgeGroup = containerRef.current.querySelector<SVGGElement>('.gooey-badge-content');
        if (badgeGroup) {
          if (isHovering && badgeType) {
            const currentHeadR = Math.max(8, size * (effectiveHoverScale ? 1.4 : 1.0));
            const badgeDist = currentHeadR + 19;
            const badgeAngle = currentAngleRef.current - 1.25;
            const badgeX = currentMouse.x + Math.cos(badgeAngle) * badgeDist;
            const badgeY = currentMouse.y + Math.sin(badgeAngle) * badgeDist;

            // Tail direction: always points precisely from badge center towards caterpillar head (currentMouse)
            const tailAngle = Math.atan2(currentMouse.y - badgeY, currentMouse.x - badgeX);
            const tipDist = 15;
            const tipX = Math.cos(tailAngle) * tipDist;
            const tipY = Math.sin(tailAngle) * tipDist;

            const b1X = Math.cos(tailAngle - 0.4) * 10.2;
            const b1Y = Math.sin(tailAngle - 0.4) * 10.2;
            const b2X = Math.cos(tailAngle + 0.4) * 10.2;
            const b2Y = Math.sin(tailAngle + 0.4) * 10.2;

            const tailStroke = badgeGroup.querySelector<SVGPathElement>('.gooey-badge-tail-stroke');
            const tailFill = badgeGroup.querySelector<SVGPathElement>('.gooey-badge-tail-fill');
            if (tailStroke) {
              tailStroke.setAttribute('d', `M ${b1X.toFixed(1)},${b1Y.toFixed(1)} L ${tipX.toFixed(1)},${tipY.toFixed(1)} L ${b2X.toFixed(1)},${b2Y.toFixed(1)}`);
            }
            if (tailFill) {
              tailFill.setAttribute('d', `M ${b1X.toFixed(1)},${b1Y.toFixed(1)} L ${tipX.toFixed(1)},${tipY.toFixed(1)} L ${b2X.toFixed(1)},${b2Y.toFixed(1)} Z`);
            }

            badgeGroup.setAttribute('transform', `translate(${badgeX.toFixed(1)}, ${badgeY.toFixed(1)}) scale(1)`);
            badgeGroup.style.opacity = '1';
          } else {
            badgeGroup.style.opacity = '0';
            badgeGroup.setAttribute('transform', `translate(${currentMouse.x.toFixed(1)}, ${(currentMouse.y - 20).toFixed(1)}) scale(0)`);
          }
        }

        // Render dynamic splash particles
        const splashGroup = containerRef.current.querySelector<SVGGElement>('.gooey-splash-group');
        if (splashGroup) {
          const particles = splashParticlesRef.current;
          // Build SVG circles string
          let svgContent = '';
          for (let k = 0; k < particles.length; k++) {
            const p = particles[k];
            const lifeRatio = p.life / p.maxLife;
            const currentR = Math.max(0.5, p.baseR * Math.sin(lifeRatio * Math.PI));
            svgContent += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${currentR.toFixed(1)}" fill="${primaryBlobColor}" opacity="${lifeRatio.toFixed(2)}" />`;
          }
          splashGroup.innerHTML = svgContent;
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [enabled, isVisible, size, enableSplash, primaryBlobColor, effectiveHoverScale, isHovering, headStyle, isWideEyes, badgeType]);

  if (!enabled) return null;

  // Base radii based on size prop, hover, and click states
  const effectiveBaseRadius = size;
  const baseRadius = isClicking 
    ? effectiveBaseRadius * (effectiveHoverScale ? 1.15 : 1.0) 
    : isHovering && effectiveHoverScale
      ? effectiveBaseRadius * 1.55 
      : effectiveBaseRadius;
      
  const coreRadius = isClicking 
    ? Math.max(3, effectiveBaseRadius * 0.22) 
    : isHovering && effectiveHoverScale
      ? Math.max(4, effectiveBaseRadius * 0.32) 
      : Math.max(2.5, effectiveBaseRadius * 0.18);

  const finalOpacity = Math.max(0.15, Math.min(1, opacity * (isHovering && effectiveHoverScale ? 1.1 : 1)));

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ isolation: 'isolate', zIndex: 2147483647 }}
    >
      <svg className="w-full h-full pointer-events-none">
        <defs>
          {/* Gooey Liquid SVG Filter with dynamic blur & alpha threshold matrix */}
          <filter id="lightswind-gooey-cursor-filter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(5, effectiveBaseRadius * 0.42)} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 24 -9.5
              "
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>

        {/* Liquid Gooey Trailing Metaballs Group + Splash Group */}
        <g
          style={{
            filter: 'url(#lightswind-gooey-cursor-filter)',
            opacity: finalOpacity,
            transition: 'opacity 0.2s ease'
          }}
        >
          {/* Historical Trail Metaball Circles */}
          {blobsRef.current.map((_, i) => {
            // Tightly packed progressive radius for unbroken fluid snake trail
            // Tail slowly narrows down towards the end of the history queue
            const progress = i / (BLOB_COUNT - 1);
            const scaleMultiplier = Math.max(0.24, 1 - Math.pow(progress, 0.85) * 0.74);
            const r = Math.max(3.5, baseRadius * scaleMultiplier);

            return (
              <circle
                key={`gooey-blob-${i}`}
                className="gooey-blob-circle"
                cx="-200"
                cy="-200"
                r={r}
                fill={primaryBlobColor}
                style={{
                  transition: 'r 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            );
          })}

          {/* Dynamic Click Splash Droplets Group */}
          <g className="gooey-splash-group" />
        </g>

        {/* HEAD STYLE 1: CUTE CATERPILLAR GOOGLY EYES */}
        {headStyle === 'eyes' && (
          <g className="gooey-eyes-group" style={{ pointerEvents: 'none' }}>
            {/* OPEN EYES (Visible when NOT clicking) */}
            <g
              className="gooey-eyes-open"
              style={{
                opacity: isClicking ? 0 : 1,
                transition: 'opacity 0.08s ease-out'
              }}
            >
              {/* Eye 1: Left Sclera, Pupil, Catchlight */}
              <circle className="gooey-eye-1" cx="-200" cy="-200" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="0.9" />
              <circle className="gooey-pupil-1" cx="-200" cy="-200" r="1.6" fill="#0f172a" />
              <circle className="gooey-spec-1" cx="-200" cy="-200" r="0.6" fill="#ffffff" />

              {/* Eye 2: Right Sclera, Pupil, Catchlight */}
              <circle className="gooey-eye-2" cx="-200" cy="-200" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="0.9" />
              <circle className="gooey-pupil-2" cx="-200" cy="-200" r="1.6" fill="#0f172a" />
              <circle className="gooey-spec-2" cx="-200" cy="-200" r="0.6" fill="#ffffff" />
            </g>

            {/* BLINKING CLOSED EYES (Cute thin slit eyelid lines on click) */}
            <g
              className="gooey-eyes-blink"
              style={{
                opacity: isClicking ? 1 : 0,
                transition: 'opacity 0.08s ease-out'
              }}
            >
              {/* Curved delicate eyelid arc paths */}
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

        {/* HEAD STYLE 2: CRISP CENTER DOT (If requested) */}
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
            {/* Dynamic Bubble Tail Stroke */}
            <path
              className="gooey-badge-tail-stroke"
              d="M 0 0"
              stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
              strokeWidth="1.4"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Dynamic Bubble Tail Fill */}
            <path
              className="gooey-badge-tail-fill"
              d="M 0 0"
              fill={theme === 'dark' ? '#0f172a' : '#ffffff'}
            />

            {/* Bubble Badge Container Circle */}
            <circle
              cx="0"
              cy="0"
              r="11"
              fill={theme === 'dark' ? '#0f172a' : '#ffffff'}
              stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
              strokeWidth="1.4"
            />

            {/* Question Mark */}
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

            {/* Exclamation Mark */}
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

            {/* Heart Love */}
            {badgeType === 'heart' && (
              <path
                d="M 0,3.2 C -0.8,1.4 -4.8,-1.2 -4.8,-4.2 C -4.8,-6.8 -2.0,-7.6 0,-5.8 C 2.0,-7.6 4.8,-6.8 4.8,-4.2 C 4.8,-1.2 0.8,1.4 0,3.2 Z"
                fill="#f43f5e"
              />
            )}

            {/* Sparkle Star */}
            {badgeType === 'sparkle' && (
              <path
                d="M 0,-5.5 Q 0,0 5.5,0 Q 0,0 0,5.5 Q 0,0 -5.5,0 Q 0,0 0,-5.5 Z"
                fill="#fbbf24"
              />
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
