import { Point, SplashParticle } from './types';

export const BLOB_COUNT = 24;
export const TRAIL_STEP = 2;
export const MAX_HISTORY = BLOB_COUNT * TRAIL_STEP + 45;

export function pushPathPoints(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  history: Point[],
  targetAngleRef: { current: number }
) {
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.hypot(dx, dy);

  if (dist > 1.5) {
    targetAngleRef.current = Math.atan2(dy, dx);
  }

  const steps = Math.min(16, Math.max(1, Math.floor(dist / 5)));
  for (let s = 1; s <= steps; s++) {
    const t = s / steps;
    history.unshift({
      x: startX + dx * t,
      y: startY + dy * t
    });
  }

  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }
}

export function createSplashParticles(
  cx: number,
  cy: number,
  size: number,
  particleIdCounter: { current: number }
): SplashParticle[] {
  const particleCount = 10;
  const particles: SplashParticle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const speed = 3.5 + Math.random() * 5.5;
    const maxLife = 22 + Math.floor(Math.random() * 10);

    particles.push({
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

  return particles;
}
