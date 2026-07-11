import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, ShieldAlert, Cpu, Linkedin, Github, Instagram, Phone, Globe, Sparkles } from 'lucide-react';
import { IDCardSvgItem } from '../lib/supabaseClient';

interface InteractiveIDCardProps {
  portraitUrl: string;
  name: string;
  title: string;
  theme: 'light' | 'dark';
  nickname?: string;
  useNicknameOnCard?: boolean;
  cardSocials?: string[];
  idCardGroup?: string;
  idCardSubText?: string;
  customSocials?: any[];
  imageScale?: number;
  imageX?: number;
  imageY?: number;
  idCardText3?: string;
  idCardBgTextSize?: number;
  idCardSvgLight?: string;
  idCardSvgDark?: string;
  idCardSvgScale?: number;
  idCardSvgX?: number;
  idCardSvgY?: number;
  idCardTextX?: number;
  idCardTextY?: number;
  idCardBadgeX?: number;
  idCardBadgeY?: number;
  isStatic?: boolean;
  onPartClick?: (part: 'portrait' | 'name' | 'title' | 'badge' | 'watermark' | 'svg' | 'general' | string) => void;
  activePart?: 'portrait' | 'name' | 'title' | 'badge' | 'watermark' | 'svg' | 'general' | string | null;
  onUpdateCoordinates?: (updates: {
    imageX?: number;
    imageY?: number;
    idCardSvgX?: number;
    idCardSvgY?: number;
    idCardTextX?: number;
    idCardTextY?: number;
    idCardBadgeX?: number;
    idCardBadgeY?: number;
  }) => void;
  idCardSvgs?: IDCardSvgItem[];
  onUpdateSvgItemCoordinates?: (id: string, x: number, y: number) => void;
  idCardPortraitFadeEnabled?: boolean;
  idCardPortraitFadeStart?: number;
  idCardPortraitFadeEnd?: number;
}

export default function InteractiveIDCard({
  portraitUrl,
  name,
  title,
  theme,
  nickname,
  useNicknameOnCard,
  cardSocials,
  idCardGroup,
  idCardSubText,
  customSocials,
  imageScale = 1,
  imageX = 0,
  imageY = 0,
  idCardText3 = 'DATA ANALYST',
  idCardBgTextSize = 38,
  idCardSvgLight = "",
  idCardSvgDark = "",
  idCardSvgScale = 1,
  idCardSvgX = 0,
  idCardSvgY = 0,
  idCardTextX = 0,
  idCardTextY = 0,
  idCardBadgeX = 0,
  idCardBadgeY = 0,
  isStatic = false,
  onPartClick,
  activePart = null,
  onUpdateCoordinates,
  idCardSvgs = [],
  onUpdateSvgItemCoordinates,
  idCardPortraitFadeEnabled = true,
  idCardPortraitFadeStart = 50,
  idCardPortraitFadeEnd = 100,
}: InteractiveIDCardProps) {
  const isDark = theme === 'dark';
  const activeSvg = isDark ? idCardSvgDark : idCardSvgLight;
  const lanyardAnchorY = -1000; // Far off-screen at the upper ceiling of the browser viewport

  // Helper to obtain social handles for the bottom card bar
  const getSocialIcon = (id: string) => {
    const norm = id.toLowerCase();
    if (norm.includes('linkedin')) return <Linkedin className="w-2.5 h-2.5 shrink-0 text-white" />;
    if (norm.includes('github')) return <Github className="w-2.5 h-2.5 shrink-0 text-white" />;
    if (norm.includes('instagram')) return <Instagram className="w-2.5 h-2.5 shrink-0 text-white" />;
    if (norm.includes('whatsapp') || norm.includes('phone')) return <Phone className="w-2.5 h-2.5 shrink-0 text-white" />;
    return <Globe className="w-2.5 h-2.5 shrink-0 text-white" />;
  };

  const getSocialDisplayDetails = (id: string) => {
    const norm = id.toLowerCase();
    if (customSocials && customSocials.length > 0) {
      const match = customSocials.find(cs => cs.id === id);
      if (match) {
        return {
          label: match.label || match.name || id,
          value: match.usernameOrUrl || match.value || ''
        };
      }
    }
    if (norm.includes('linkedin')) return { label: 'LinkedIn', value: name };
    if (norm.includes('github')) return { label: 'GitHub', value: name };
    if (norm.includes('instagram')) return { label: 'Instagram', value: name };
    if (norm.includes('whatsapp')) return { label: 'WhatsApp', value: '' };
    return { label: id, value: '' };
  };

  // Responsive container width tracking via ResizeObserver
  const [containerWidth, setContainerWidth] = useState(280);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for zero-re-render high performance animation loop
  const ribbonStrapRef = useRef<SVGPathElement>(null);
  const ribbonStrapShadowRef = useRef<SVGPathElement>(null);
  const ribbonTextPathRef = useRef<SVGPathElement>(null);
  const gSwivelRef = useRef<SVGGElement>(null);
  const cardShadowRef = useRef<HTMLDivElement>(null);
  const cardSleeveRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const [isCurrentlyDragging, setIsCurrentlyDragging] = useState(false);

  // Drag-and-move coordinate offsets in Admin static mode
  const [activeDragPart, setActiveDragPart] = useState<string | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragInitialRef = useRef({ x: 0, y: 0 });

  const handlePartDragStart = (
    e: React.PointerEvent,
    part: string
  ) => {
    if (!isStatic) return;
    e.stopPropagation();
    e.preventDefault();

    if (onPartClick) {
      onPartClick(part === 'svg' ? 'svg' : part);
    }

    setActiveDragPart(part);
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    let initX = 0;
    let initY = 0;
    if (part === 'portrait') {
      initX = imageX;
      initY = imageY;
    } else if (part === 'svg') {
      initX = idCardSvgX;
      initY = idCardSvgY;
    } else if (part === 'name') {
      initX = idCardTextX;
      initY = idCardTextY;
    } else if (part === 'badge') {
      initX = idCardBadgeX;
      initY = idCardBadgeY;
    } else if (part.startsWith('svg-item-')) {
      const itemId = part.replace('svg-item-', '');
      const matched = idCardSvgs?.find(s => s.id === itemId);
      if (matched) {
        initX = matched.x;
        initY = matched.y;
      }
    }

    dragInitialRef.current = { x: initX, y: initY };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePartDragMove = (e: React.PointerEvent, part: string) => {
    if (!isStatic || activeDragPart !== part) return;
    e.stopPropagation();

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newX = Math.round(dragInitialRef.current.x + dx);
    const newY = Math.round(dragInitialRef.current.y + dy);

    if (part === 'portrait' && onUpdateCoordinates) {
      onUpdateCoordinates({ imageX: newX, imageY: newY });
    } else if (part === 'svg' && onUpdateCoordinates) {
      onUpdateCoordinates({ idCardSvgX: newX, idCardSvgY: newY });
    } else if (part === 'name' && onUpdateCoordinates) {
      onUpdateCoordinates({ idCardTextX: newX, idCardTextY: newY });
    } else if (part === 'badge' && onUpdateCoordinates) {
      onUpdateCoordinates({ idCardBadgeX: newX, idCardBadgeY: newY });
    } else if (part.startsWith('svg-item-')) {
      const itemId = part.replace('svg-item-', '');
      if (onUpdateSvgItemCoordinates) {
        onUpdateSvgItemCoordinates(itemId, newX, newY);
      }
    }
  };

  const handlePartDragEnd = (e: React.PointerEvent, part: string) => {
    if (!isStatic || activeDragPart !== part) return;
    e.stopPropagation();
    setActiveDragPart(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Raw physics parameters inside useRef to maintain lock-free high-frequency running
  const physicsRef = useRef({
    x: isStatic ? 0 : -35,           // horizontal displacement relative to center anchor
    y: isStatic ? 115 : -800,         // vertical lanyard length displacement (start far off-screen above for drop intro animation)
    vx: 0,          // velocity x
    vy: 0,          // velocity y
    px: isStatic ? 0 : -35,          // previous position x (for drag velocity calculation)
    py: isStatic ? 115 : -800,        // previous position y
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    isSleeping: isStatic,
    
    // Card's angular wobble on its lanyard connector
    cardAngle: 0,
    cardAngleV: 0,
  });

  const rawHoverRef = useRef({ x: 0, y: 0 });
  const smoothHoverRef = useRef({ x: 0, y: 0 });

  // Watch for resizing to keep the local canvas/coordinate boundaries updated
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width || 280);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Physics animation loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    const delayMs = 150; // 0.15 seconds delay

    const RestY = 115; // Realistic resting height (shorter lanyard, perfectly centered on page)
    const restLength = RestY - lanyardAnchorY; // Total ribbon strap length at rest
    const gravity = 1.1; // Substantially heavier gravity pulling the card down
    const damping = 0.974; // Increased air resistance damping factor (stabilizes faster)
    const springK = 0.198; // High tension elastic spring snap back
    const stretchDamp = 0.28; // Increased dampener for spring oscillations

    const anchorX = containerWidth / 2;

    const updateVisuals = (
      pX: number,
      pY: number,
      rX: number,
      rY: number,
      rZ: number,
      hX: number,
      hY: number
    ) => {
      // 1. Calculate path
      const curveControlX = anchorX + pX * 0.35;
      const curveControlY = lanyardAnchorY + (pY - lanyardAnchorY) * 0.55;
      const ribbonPath = `M ${anchorX} ${lanyardAnchorY} Q ${curveControlX} ${curveControlY} ${anchorX + pX} ${pY - 12}`;

      if (ribbonStrapRef.current) {
        ribbonStrapRef.current.setAttribute('d', ribbonPath);
      }
      if (ribbonStrapShadowRef.current) {
        ribbonStrapShadowRef.current.setAttribute('d', ribbonPath);
      }
      if (ribbonTextPathRef.current) {
        ribbonTextPathRef.current.setAttribute('d', ribbonPath);
      }

      // 2. Swivel Group
      if (gSwivelRef.current) {
        gSwivelRef.current.setAttribute('transform', `translate(${pX}, ${pY})`);
      }

      // 3. Card Shadow (keep blur static at 8px to avoid costly browser layout repaints)
      if (cardShadowRef.current) {
        cardShadowRef.current.style.transform = `translate3d(${pX}px, ${pY}px, 0) rotateX(${rX * 0.85}deg) rotateY(${rY * 0.85}deg) rotateZ(${rZ}deg) scale(0.96)`;
      }

      // 4. Card Sleeve
      if (cardSleeveRef.current) {
        cardSleeveRef.current.style.transform = `translate3d(${pX}px, ${pY}px, 0) rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
      }

      // 5. Glare Refracting Overlay
      if (glareRef.current) {
        const glossPercentX = 50 + (hX * 40);
        const glossPercentY = 50 + (hY * 40);
        glareRef.current.style.background = `
          radial-gradient(circle at ${glossPercentX}% ${glossPercentY}%, rgba(255, 255, 255, ${isDark ? 0.15 : 0.25}) 0%, rgba(255, 255, 255, 0) 55%),
          radial-gradient(circle at ${100 - glossPercentX}% ${100 - glossPercentY}%, rgba(251, 191, 36, 0.08) 0%, rgba(139, 92, 246, 0.05) 45%, rgba(0, 0, 0, 0) 90%)
        `;
      }
    };

    const tick = () => {
      const p = physicsRef.current;

      // Restrain the physics engine until the initial delay of 0.15 seconds completes
      const elapsed = Date.now() - startTime;
      if (!isStatic && elapsed < delayMs && !p.isDragging) {
        updateVisuals(p.x, p.y, 0, 0, 0, 0, 0);
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // 1. Position & Motion physics
      if (isStatic || p.isSleeping) {
        p.vx = 0;
        p.vy = 0;
        p.x = 0;
        p.y = RestY;
        p.cardAngle = 0;
        p.cardAngleV = 0;
      } else if (p.isDragging) {
        // While dragging, velocity is mapped to displacement rate to provide continuous momentum
        p.vx = (p.x - p.px) * 0.75;
        p.vy = (p.y - p.py) * 0.75;
        p.px = p.x;
        p.py = p.y;
      } else {
        // Natural physical model combining Gravity + Cord elastic Tension
        const dx = p.x;
        const dy = p.y - lanyardAnchorY;
        const currentLength = Math.sqrt(dx * dx + dy * dy);
        
        const distToRest = Math.sqrt(p.x * p.x + (p.y - RestY) * (p.y - RestY));
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const angleSpeed = Math.abs(p.cardAngleV);

        // If we are extremely close to rest and moving slowly, bypass complex physics and guide smoothly to sleep
        if (distToRest < 5 && speed < 0.4 && angleSpeed < 0.4) {
          // Gently guide the coordinates to rest state
          p.x += (0 - p.x) * 0.15;
          p.y += (RestY - p.y) * 0.15;
          p.cardAngle += (0 - p.cardAngle) * 0.15;
          p.vx *= 0.5;
          p.vy *= 0.5;
          p.cardAngleV *= 0.5;

          // Once extremely close, lock to exact resting position and activate sleep state
          if (Math.abs(p.x) < 0.05 && Math.abs(p.y - RestY) < 0.05 && Math.abs(p.cardAngle) < 0.05) {
            p.x = 0;
            p.y = RestY;
            p.vx = 0;
            p.vy = 0;
            p.cardAngle = 0;
            p.cardAngleV = 0;
            p.isSleeping = true;
          }
        } else {
          if (currentLength > 0.1) {
            const stretching = currentLength - restLength;
            
            // Fabric strap is highly elastic when stretched (represented by springK), 
            // and has negligible resistance when compressed (slack / folded).
            const k = stretching > 0 ? springK : 0.005;
            const d = stretching > 0 ? stretchDamp : 0.03;

            // unit action vectors pointing from the card's attachment clip up to the anchor point
            const unitX = dx / currentLength;
            const unitY = dy / currentLength;

            // Project the card's movement velocity vector onto the strap's axis
            const vStringSegment = p.vx * unitX + p.vy * unitY;

            // Total spring-damper force pulling back to the top anchor
            const tensionForce = (stretching * k) + (vStringSegment * d);

            p.vx -= tensionForce * unitX;
            p.vy -= tensionForce * unitY;
          }

          // Apply downward gravity acceleration (always pulls vertically down)
          p.vy += gravity;

          // Apply general air friction damping
          p.vx *= damping;
          p.vy *= damping;

          // Update positions
          p.x += p.vx;
          p.y += p.vy;
        }
      }

      // 2. Card's own angular wobbling (hinged on the swivel carabiner ring)
      // Pendulum swing angle of the main lanyard cord:
      const lanyardAngleRad = Math.atan2(p.x, p.y - lanyardAnchorY);
      const lanyardAngleDeg = lanyardAngleRad * (180 / Math.PI);

      // Card angle lags or springs relative to lanyard cord angle:
      const targetCardAngle = lanyardAngleDeg;
      const restoringTorque = -0.06 * (p.cardAngle - targetCardAngle);
      
      p.cardAngleV += restoringTorque;
      p.cardAngleV *= 0.93; // damp internal card wobble so it recovers peacefully
      p.cardAngle += p.cardAngleV;

      // 3. Smooth mouse hover tilting variables
      let finalRotateX = 0;
      let finalRotateY = 0;
      let finalRotateZ = 0;

      const hRaw = rawHoverRef.current;
      const hSmooth = smoothHoverRef.current;

      if (!isStatic) {
        hSmooth.x += (hRaw.x - hSmooth.x) * 0.12;
        hSmooth.y += (hRaw.y - hSmooth.y) * 0.12;

        // 4. Combine inputs into 3D orientations
        // Horizontal motion spins/twists the card slightly (simulate wind force):
        const speedTwistY = p.vx * -0.22;
        const speedTiltX = -Math.abs(p.vx) * 0.12 + (p.vy * 0.12);

        finalRotateX = speedTiltX + (hSmooth.y * -20);
        finalRotateY = speedTwistY + (hSmooth.x * 20);
        finalRotateZ = p.cardAngle;
      } else {
        hSmooth.x = 0;
        hSmooth.y = 0;
      }

      // Commit styling changes directly to DOM nodes (hardware-accelerated, zero-re-render animation)
      updateVisuals(p.x, p.y, finalRotateX, finalRotateY, finalRotateZ, hSmooth.x, hSmooth.y);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isStatic, containerWidth, isDark]);

  // Pointer event managers (multi-touch & pointer unification)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isStatic) {
      handlePartDragStart(e, 'svg');
      return;
    }
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top;

    const p = physicsRef.current;
    p.isSleeping = false; // Wake up immediately!
    p.isDragging = true;
    setIsCurrentlyDragging(true);

    const mouseXInContainer = e.clientX - anchorX;
    const mouseYInContainer = e.clientY - anchorY;

    // Track offset from cursor center point to prevent annoying starting jump cuts
    p.dragStartX = mouseXInContainer - p.x;
    p.dragStartY = mouseYInContainer - p.y;

    p.px = p.x;
    p.py = p.y;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isStatic) {
      handlePartDragMove(e, 'svg');
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top;

    const p = physicsRef.current;

    if (p.isDragging) {
      const mouseXInContainer = e.clientX - anchorX;
      const mouseYInContainer = e.clientY - anchorY;

      // Position is bound to mouse minus grab offset
      let targetX = mouseXInContainer - p.dragStartX;
      let targetY = mouseYInContainer - p.dragStartY;

      // Restrain lanyard maximum stretch of the physical string
      const dx = targetX;
      const dy = targetY - lanyardAnchorY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const restLength = 115 - lanyardAnchorY;
      const maxStrapLength = restLength + 250; // Elastic limit stretch length
      
      if (distance > maxStrapLength && distance > 0) {
        targetX = (dx / distance) * maxStrapLength;
        targetY = lanyardAnchorY + (dy / distance) * maxStrapLength;
      }

      p.x = targetX;
      p.y = targetY;
    } else {
      // Calculate local coordinates relative to the stable, smooth physical card center
      const rect = container.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2 + p.x;
      const cardCenterY = rect.top + p.y + 175; // 175 is 350/2 (half of card height)

      const relX = e.clientX - cardCenterX;
      const relY = e.clientY - cardCenterY;

      // Normalize between -1 and 1 (with 240 width and 350 height of the card)
      rawHoverRef.current = {
        x: Math.max(-1, Math.min(1, relX / 120)), // 120 is 240/2 (half-width)
        y: Math.max(-1, Math.min(1, relY / 175)), // 175 is 350/2 (half-height)
      };
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isStatic) {
      handlePartDragEnd(e, 'svg');
      return;
    }
    const p = physicsRef.current;
    if (p.isDragging) {
      p.isDragging = false;
      setIsCurrentlyDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerLeave = () => {
    // Reset hover tilt quietly upon mouse leaving, physics handles card swing
    rawHoverRef.current = { x: 0, y: 0 };
  };

  // Coordinates mapping
  const anchorX = containerWidth / 2;
  const cardWidth = 240;

  // Shared highly realistic shadow offsets ensuring ribbon shadow and card shadow are perfectly connected/stitched at all states
  const shadowOffsetX = 10;
  const shadowOffsetY = 15;

  const initialX = isStatic ? 0 : -35;
  const initialY = isStatic ? 115 : -800;

  // Lanyard double ribbon path curve: joins anchor and card attachment slot
  const initialCurveControlX = anchorX + initialX * 0.35;
  const initialCurveControlY = lanyardAnchorY + (initialY - lanyardAnchorY) * 0.55;
  
  // Ribbon Path definition
  const initialRibbonPath = `M ${anchorX} ${lanyardAnchorY} Q ${initialCurveControlX} ${initialCurveControlY} ${anchorX + initialX} ${initialY - 12}`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[510px] flex items-start justify-center select-none overflow-visible pt-0"
      style={{ perspective: '1100px' }}
    >
      {/* 1. LANYARD STRAP CONNECTOR SVG LAYER (Sit behind card shadow) */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-10"
        style={{ filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.18))' }}
      >
        <defs>
          <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="65%" stopColor="#475569" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="lanyardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#022c22" />
            <stop offset="50%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          {/* Path for text to wrap on the lanyard curve */}
          <path ref={ribbonTextPathRef} id="lanyardTextPath" d={initialRibbonPath} fill="none" />
        </defs>

        {/* Shadow of the Ribbon Strap */}
        <path
          ref={ribbonStrapShadowRef}
          d={initialRibbonPath}
          stroke="rgba(0, 0, 0, 0.22)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          style={{
            transform: `translate(${shadowOffsetX}px, ${shadowOffsetY}px)`,
            filter: 'blur(3px)',
          }}
        />

        {/* Solid Woven Fabric Strap Base */}
        <path
          ref={ribbonStrapRef}
          d={initialRibbonPath}
          stroke="#022c22"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />

        {/* Fabric side borders for added stitch/texture depth */}
        <path
          d={initialRibbonPath}
          stroke="#059669"
          strokeWidth="7"
          strokeDasharray="1.5 2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Text running down the dynamic curved fabric ribbon strap */}
        <text
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="3.8"
          fontFamily="monospace"
          fontWeight="900"
          letterSpacing="1"
          dy="1.3"
        >
          <textPath href="#lanyardTextPath" startOffset="10%" method="stretch">
            CREATIVE PORTFOLIO ✦ DATA STRATEGIST ✦ BI DESIGNER ✦ INNOVATOR ✦
          </textPath>
        </text>

        {/* Swivel metal components group translated by pos.x and pos.y */}
        <g ref={gSwivelRef} transform={`translate(${initialX}, ${initialY})`}>
          {/* Swivel metal loop hanger ring */}
          <circle
            cx={anchorX}
            cy={-18}
            r="7"
            fill="none"
            stroke="url(#metalSilver)"
            strokeWidth="3.2"
          />

          {/* Carabiner swivel clip hook joining the ring and card holder slot */}
          <path
            d={`M ${anchorX - 3} ${-14} 
                L ${anchorX + 3} ${-14} 
                L ${anchorX + 2} ${-4} 
                L ${anchorX - 2} ${-4} Z`}
            fill="url(#metalSilver)"
          />
          
          {/* Swivel clasp hook clip pin */}
          <path
            d={`M ${anchorX} ${-12} L ${anchorX} 0`}
            stroke="url(#metalSilver)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* 2. DYNAMIC REALISTIC DEPTH-OFFSET SHADOW */}
      <div
        ref={cardShadowRef}
        className="absolute pointer-events-none rounded-[18px] select-none"
        style={{
          left: `calc(50% - 120px + ${shadowOffsetX}px)`, // applied via translate3d transform
          top: `${shadowOffsetY}px`, // applied via translate3d transform
          width: '240px',
          height: '350px',
          background: isDark
            ? 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 105%)'
            : 'radial-gradient(circle, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.18) 65%, rgba(0,0,0,0) 105%)',
          filter: 'blur(8px)',
          opacity: isDark ? 0.75 : 0.65,
          transform: `translate3d(${initialX}px, ${initialY}px, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.96)`,
          transformOrigin: 'top center',
          zIndex: 5,
        }}
      />

      {/* 3. CORE PHYSICAL 3D TRANSFORMS CARD HOLDER SLEEVE */}
      <div
        ref={cardSleeveRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`absolute rounded-[18px] p-[5px] transition-colors duration-250 select-none ${
          isStatic 
            ? 'cursor-pointer' 
            : isCurrentlyDragging 
              ? 'cursor-grabbing' 
              : 'cursor-grab'
        } ${
          activeSvg
            ? (isDark
                ? 'bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl shadow-black/80 ring-1 ring-white/10'
                : 'bg-gradient-to-b from-slate-100 to-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-950/10')
            : (isDark
                ? 'bg-transparent border border-dashed border-slate-700/60'
                : 'bg-transparent border border-dashed border-slate-300/60')
        }`}
        style={{
          left: 'calc(50% - 120px)',
          top: '0px',
          width: `${cardWidth}px`,
          height: '350px',
          transform: `translate3d(${initialX}px, ${initialY}px, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'top center',
          touchAction: 'none',
          zIndex: 30,
        }}
      >
        {/* Inner Border Lining Plate */}
        <div
          className="w-full h-full rounded-[14px] flex flex-col items-stretch relative overflow-hidden select-none"
          style={{ 
            transform: 'translateZ(1px)',
            background: activeSvg ? (isDark ? '#0d0d0f' : '#ffffff') : 'transparent',
            backgroundImage: activeSvg 
              ? (isDark 
                  ? 'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)' 
                  : 'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)') 
              : 'none',
          }}
        >
          {/* Custom SVG Backplate */}
          {activeSvg && (
            <img 
              src={activeSvg} 
              alt="Custom SVG Backplate" 
              className="absolute inset-0 z-0 pointer-events-none w-full h-full object-cover opacity-60"
              style={{
                transform: `scale(${idCardSvgScale !== undefined ? idCardSvgScale : 1}) translate(${(idCardSvgX || 0)}px, ${(idCardSvgY || 0)}px)`,
                transformOrigin: 'center center'
              }}
              referrerPolicy="no-referrer"
            />
          )}

          {/* Card Top Carabiner Clip Insertion Slot Cutout */}
          <div className="flex justify-center absolute top-2.5 left-0 right-0 z-20 pointer-events-none">
            <div className="w-11 h-2 rounded-full border bg-neutral-950 border-neutral-850" />
          </div>
 
          {/* Portrait Image ("Gambar tanpa kontainer karna png, bagian bawah memudar") */}
          <div 
            onClick={(e) => {
              if (isStatic && onPartClick) {
                e.stopPropagation();
                onPartClick('portrait');
              }
            }}
            onPointerDown={(e) => handlePartDragStart(e, 'portrait')}
            onPointerMove={(e) => handlePartDragMove(e, 'portrait')}
            onPointerUp={(e) => handlePartDragEnd(e, 'portrait')}
            className={`absolute top-[52px] left-2 right-2 bottom-[80px] flex items-center justify-center z-10 transition-all ${
              isStatic 
                ? 'pointer-events-auto cursor-move select-none hover:ring-2 hover:ring-amber-500 hover:bg-amber-500/10 rounded-lg' 
                : 'pointer-events-none'
            } ${activePart === 'portrait' ? 'ring-2 ring-amber-400 bg-amber-500/15' : ''}`}
            style={{
              maskImage: idCardPortraitFadeEnabled 
                ? `linear-gradient(to bottom, rgba(0,0,0,1) ${idCardPortraitFadeStart}%, rgba(0,0,0,0) ${idCardPortraitFadeEnd}%)`
                : 'none',
              WebkitMaskImage: idCardPortraitFadeEnabled 
                ? `linear-gradient(to bottom, rgba(0,0,0,1) ${idCardPortraitFadeStart}%, rgba(0,0,0,0) ${idCardPortraitFadeEnd}%)`
                : 'none',
              transform: 'translateZ(8px)',
              touchAction: 'none'
            }}
          >
            <img
              src={portraitUrl}
              alt={name}
              className="h-full w-auto object-contain brightness-[98%] select-none shrink-0"
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${imageScale}) translate(${imageX}px, ${imageY}px)`,
                transformOrigin: 'center center'
              }}
            />
          </div>

          {/* Dynamic User-Uploaded SVGs */}
          {idCardSvgs && [...idCardSvgs].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map((svgItem) => {
            const isUrl = svgItem.svgContent.startsWith('http') || svgItem.svgContent.startsWith('/') || svgItem.svgContent.startsWith('data:');
            const isActive = activePart === `svg-item-${svgItem.id}`;
            return (
              <div
                key={svgItem.id}
                onClick={(e) => {
                  if (isStatic && onPartClick) {
                    e.stopPropagation();
                    onPartClick(`svg-item-${svgItem.id}`);
                  }
                }}
                onPointerDown={(e) => handlePartDragStart(e, `svg-item-${svgItem.id}`)}
                onPointerMove={(e) => handlePartDragMove(e, `svg-item-${svgItem.id}`)}
                onPointerUp={(e) => handlePartDragEnd(e, `svg-item-${svgItem.id}`)}
                className={`absolute transition-all select-none ${
                  isStatic 
                    ? 'pointer-events-auto cursor-move select-none hover:ring-2 hover:ring-indigo-500 hover:bg-indigo-500/10 rounded-md p-0.5' 
                    : 'pointer-events-none'
                } ${isActive ? 'ring-2 ring-indigo-400 bg-indigo-500/15' : ''}`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${svgItem.x}px), calc(-50% + ${svgItem.y}px)) scale(${svgItem.scale || 1})`,
                  zIndex: svgItem.zIndex || 20,
                  touchAction: 'none'
                }}
              >
                {isUrl ? (
                  <img
                    src={svgItem.svgContent}
                    alt={svgItem.name || "Custom SVG"}
                    className="max-w-none pointer-events-none select-none"
                    style={{ width: '120px', height: 'auto' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ __html: svgItem.svgContent }} 
                    className="dynamic-svg-wrapper [&_svg]:max-w-none [&_svg]:w-[120px] [&_svg]:h-[120px]"
                  />
                )}
              </div>
            );
          })}

          {/* Holographic Refracting Overlay Glare layer */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, ${isDark ? 0.15 : 0.25}) 0%, rgba(255, 255, 255, 0) 55%),
                radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.08) 0%, rgba(139, 92, 246, 0.05) 45%, rgba(0, 0, 0, 0) 90%)
              `,
              mixBlendMode: 'color-dodge',
            }}
          />
        </div>
      </div>
    </div>
  );
}
