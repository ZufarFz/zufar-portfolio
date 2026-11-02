import React, { useEffect, useRef, useState } from 'react';
import { GooeyCursorProps, Point, SplashParticle } from './types';
import { GooeyHeadElements } from './GooeyHeadElements';
import { BLOB_COUNT, TRAIL_STEP, MAX_HISTORY, pushPathPoints, createSplashParticles } from './gooeyPhysics';

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

  const effectiveHoverScale = Boolean(hoverScale);
  const badgeType: 'question' | 'exclamation' | 'heart' | 'sparkle' | null = (() => {
    if (hoverReaction === 'question') return 'question';
    if (hoverReaction === 'exclamation') return 'exclamation';
    if (hoverReaction === 'heart') return 'heart';
    if (hoverReaction === 'sparkle') return 'sparkle';
    return null;
  })();

  const isWideEyes = hoverReaction === 'wide_eyes' && isHovering;
  const primaryBlobColor = color || (theme === 'dark' ? '#10b981' : '#059669');
  const coreDotColor = secondaryColor || (theme === 'dark' ? '#34d399' : '#047857');

  const mousePos = useRef<Point>({ x: -200, y: -200 });
  const prevMousePos = useRef<Point>({ x: -200, y: -200 });
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);

  const historyRef = useRef<Point[]>([]);
  const blobsRef = useRef<Point[]>(
    Array.from({ length: BLOB_COUNT }, () => ({ x: -200, y: -200 }))
  );
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
      if (existing) existing.remove();
    };
  }, [enabled, hideDefaultCursor]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine || !enabled) {
      setIsVisible(false);
      return;
    }

    const triggerSplash = (cx: number, cy: number) => {
      if (!enableSplash) return;
      const newParticles = createSplashParticles(cx, cy, size, particleIdCounter);
      splashParticlesRef.current.push(...newParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        historyRef.current = Array.from({ length: MAX_HISTORY }, () => ({ x: newX, y: newY }));
        blobsRef.current.forEach((blob) => {
          blob.x = newX;
          blob.y = newY;
        });
      } else {
        pushPathPoints(mousePos.current.x, mousePos.current.y, newX, newY, historyRef.current, targetAngleRef);
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

    const render = () => {
      const currentMouse = mousePos.current;
      historyRef.current.unshift({ x: currentMouse.x, y: currentMouse.y });
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.pop();
      }

      let angleDiff = targetAngleRef.current - currentAngleRef.current;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      currentAngleRef.current += angleDiff * 0.28;

      blobsRef.current.forEach((blob, i) => {
        const historyIndex = Math.min(i * TRAIL_STEP, historyRef.current.length - 1);
        const target = historyRef.current[historyIndex] || currentMouse;
        const lerpFactor = i === 0 ? 0.75 : 0.46;
        blob.x += (target.x - blob.x) * lerpFactor;
        blob.y += (target.y - blob.y) * lerpFactor;
      });

      if (splashParticlesRef.current.length > 0) {
        splashParticlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.88;
          p.vy *= 0.88;
          p.life -= 1;
        });
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

        const coreDot = containerRef.current.querySelector<SVGCircleElement>('.gooey-core-dot');
        if (coreDot) {
          coreDot.setAttribute('cx', currentMouse.x.toFixed(1));
          coreDot.setAttribute('cy', currentMouse.y.toFixed(1));
        }

        const eyesGroup = containerRef.current.querySelector<SVGGElement>('.gooey-eyes-group');
        if (eyesGroup) {
          const headX = currentMouse.x;
          const headY = currentMouse.y;
          const angle = currentAngleRef.current;
          
          const currentHeadR = Math.max(8, size * (effectiveHoverScale && isHovering ? 1.4 : 1.0));
          const eyeDist = currentHeadR * 0.52;
          const eyeSpacingAngle = 0.58;

          const eye1X = headX + Math.cos(angle - eyeSpacingAngle) * eyeDist;
          const eye1Y = headY + Math.sin(angle - eyeSpacingAngle) * eyeDist;
          const eye2X = headX + Math.cos(angle + eyeSpacingAngle) * eyeDist;
          const eye2Y = headY + Math.sin(angle + eyeSpacingAngle) * eyeDist;

          const eyeR = Math.max(2.4, currentHeadR * 0.28);
          const pupilR = Math.max(1.3, isWideEyes ? eyeR * 0.72 : eyeR * 0.54);
          const pupilLookOffset = isWideEyes ? eyeR * 0.15 : eyeR * 0.28;

          const p1X = eye1X + Math.cos(angle) * pupilLookOffset;
          const p1Y = eye1Y + Math.sin(angle) * pupilLookOffset;
          const p2X = eye2X + Math.cos(angle) * pupilLookOffset;
          const p2Y = eye2Y + Math.sin(angle) * pupilLookOffset;

          const spec1X = p1X - pupilR * 0.32;
          const spec1Y = p1Y - pupilR * 0.32;
          const spec2X = p2X - pupilR * 0.32;
          const spec2Y = p2Y - pupilR * 0.32;
          const specR = Math.max(0.6, pupilR * 0.35);

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

          const blink1 = eyesGroup.querySelector<SVGPathElement>('.gooey-blink-1');
          const blink2 = eyesGroup.querySelector<SVGPathElement>('.gooey-blink-2');
          const nx = -Math.sin(angle);
          const ny = Math.cos(angle);
          const fx = Math.cos(angle);
          const fy = Math.sin(angle);
          const arcSpan = eyeR * 0.48;
          const arcDepth = eyeR * 0.22;

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

        const badgeGroup = containerRef.current.querySelector<SVGGElement>('.gooey-badge-content');
        if (badgeGroup) {
          if (isHovering && badgeType) {
            const currentHeadR = Math.max(8, size * (effectiveHoverScale ? 1.4 : 1.0));
            const badgeDist = currentHeadR + 19;
            const badgeAngle = currentAngleRef.current - 1.25;
            const badgeX = currentMouse.x + Math.cos(badgeAngle) * badgeDist;
            const badgeY = currentMouse.y + Math.sin(badgeAngle) * badgeDist;

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

        const splashGroup = containerRef.current.querySelector<SVGGElement>('.gooey-splash-group');
        if (splashGroup) {
          const particles = splashParticlesRef.current;
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
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [enabled, isVisible, size, enableSplash, primaryBlobColor, effectiveHoverScale, isHovering, headStyle, isWideEyes, badgeType]);

  if (!enabled) return null;

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

        <g
          style={{
            filter: 'url(#lightswind-gooey-cursor-filter)',
            opacity: finalOpacity,
            transition: 'opacity 0.2s ease'
          }}
        >
          {blobsRef.current.map((_, i) => {
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
                style={{ transition: 'r 0.18s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            );
          })}
          <g className="gooey-splash-group" />
        </g>

        <GooeyHeadElements
          headStyle={headStyle}
          isClicking={isClicking}
          coreRadius={coreRadius}
          coreDotColor={coreDotColor}
          hideDefaultCursor={hideDefaultCursor}
          isHovering={isHovering}
          badgeType={badgeType}
          theme={theme}
        />
      </svg>
    </div>
  );
}

