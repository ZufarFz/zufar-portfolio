import * as THREE from 'three';
import { FRONT_UV_RECT, BACK_UV_RECT } from './types';

export function generateLanyardStrapTexture(
  lanyardText: string | null,
  rawTexture: THREE.Texture,
  isMobile: boolean
): THREE.Texture {
  if (!lanyardText) {
    if (rawTexture) {
      rawTexture.wrapS = rawTexture.wrapT = THREE.RepeatWrapping;
    }
    return rawTexture;
  }

  const canvas = document.createElement('canvas');
  canvas.width = isMobile ? 1024 : 2048;
  canvas.height = isMobile ? 80 : 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return rawTexture;

  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#334155';
  const borderH = isMobile ? 6 : 9;
  ctx.fillRect(0, 0, w, borderH);
  ctx.fillRect(0, h - borderH, w, borderH);

  ctx.fillStyle = '#ffffff';
  ctx.font = isMobile 
    ? '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    : '900 78px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = 'middle';

  const textToDraw = `        ✦   ${lanyardText.toUpperCase()}   ✦        `;
  const textWidth = ctx.measureText(textToDraw).width || (isMobile ? 400 : 600);
  
  const repeats = Math.ceil(w / textWidth) + 2;
  for (let i = 0; i < repeats; i++) {
    ctx.fillText(textToDraw, i * textWidth, h / 2);
  }

  const canvasTex = new THREE.CanvasTexture(canvas);
  canvasTex.wrapS = canvasTex.wrapT = THREE.RepeatWrapping;
  canvasTex.colorSpace = THREE.SRGBColorSpace;
  canvasTex.anisotropy = isMobile ? 1 : 4;
  canvasTex.needsUpdate = true;
  return canvasTex;
}

export function compositeCardAtlasTexture(
  baseMap: THREE.Texture | undefined,
  frontImage: string | null,
  backImage: string | null,
  frontTex: THREE.Texture,
  backTex: THREE.Texture,
  imageFit: 'cover' | 'contain',
  isMobile: boolean
): THREE.Texture | null {
  if (!baseMap) return null;
  if (!frontImage && !backImage) return baseMap;

  const baseImg = baseMap.image;
  if (!baseImg) return baseMap;
  const W = isMobile ? 512 : 1024;
  const H = isMobile ? 512 : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return baseMap;

  ctx.drawImage(baseImg, 0, 0, W, H);

  const drawFitted = (img: any, rect: { x: number; y: number; w: number; h: number }) => {
    const rx = rect.x * W;
    const ry = rect.y * H;
    const rw = rect.w * W;
    const rh = rect.h * H;
    const pick = imageFit === 'contain' ? Math.min : Math.max;
    const scale = pick(rw / img.width, rh / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = rx + (rw - dw) / 2;
    const dy = ry + (rh - dh) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  };

  if (frontImage && frontTex?.image) drawFitted(frontTex.image, FRONT_UV_RECT);
  if (backImage && backTex?.image) drawFitted(backTex.image, BACK_UV_RECT);

  const composite = new THREE.CanvasTexture(canvas);
  composite.colorSpace = THREE.SRGBColorSpace;
  composite.flipY = baseMap.flipY;
  composite.anisotropy = isMobile ? 1 : 4;
  composite.generateMipmaps = true;
  composite.needsUpdate = true;
  return composite;
}

