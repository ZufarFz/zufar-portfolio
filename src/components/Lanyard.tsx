/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

const cardGLB = '/card.glb';
const lanyard = '/lanyard.png';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Pre-preload models and textures so opening the tab is instantaneous without lag/hitch
useGLTF.preload(cardGLB);
useTexture.preload(lanyard);
useTexture.preload(BLANK_PIXEL);

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardText?: string | null;
  lanyardWidth?: number;
  cardScale?: number;
  className?: string;
}

export default function Lanyard({
  position = [0, 0, 19],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardText = null,
  lanyardWidth = 0.38,
  cardScale = 1.85,
  className = ''
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`lanyard-wrapper ${className}`}>
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, 2]}
        performance={{ min: 0.8 }}
        gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={2.8} />
        <directionalLight position={[4, 8, 6]} intensity={1.5} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={1 / 60} numSolverIterations={2}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardText={lanyardText}
              lanyardWidth={lanyardWidth}
              cardScale={cardScale}
            />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardText?: string | null;
  lanyardWidth?: number;
  cardScale?: number;
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile: isMobileProp,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardText = null,
  lanyardWidth = 0.38,
  cardScale = 1.85
}: BandProps) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  const isMobile = isMobileProp ?? (typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024)));

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const pointerRef = useRef({ x: 0, y: 0 });
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  const segmentProps = useMemo(() => ({
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2
  }), []);

  const cardProps = useMemo(() => ({
    canSleep: true,
    colliders: false as const,
    angularDamping: 1.0,
    linearDamping: 1.6
  }), []);

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const rawTexture = useTexture(lanyardImage || lanyard);

  // Generate lightweight dynamic repeated text texture for the lanyard strap
  const finalTexture = useMemo(() => {
    if (!lanyardText) {
      if (rawTexture) {
        rawTexture.wrapS = rawTexture.wrapT = THREE.RepeatWrapping;
      }
      return rawTexture;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return rawTexture;

    // Dark sleek lanyard strap background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 128);

    // Subtle edge borders/stitching
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 1024, 8);
    ctx.fillRect(0, 120, 1024, 8);

    // Large Bold Typography with generous spacing between repetitions
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textBaseline = 'middle';

    const textToDraw = `   ✦   ${lanyardText.toUpperCase()}   ✦   `;
    const textWidth = ctx.measureText(textToDraw).width || 600;
    
    // Draw repeating text across canvas width with generous spacing
    const repeats = Math.ceil(1024 / textWidth) + 1;
    for (let i = 0; i < repeats; i++) {
      ctx.fillText(textToDraw, i * textWidth, 64);
    }

    const canvasTex = new THREE.CanvasTexture(canvas);
    canvasTex.wrapS = canvasTex.wrapT = THREE.RepeatWrapping;
    canvasTex.colorSpace = THREE.SRGBColorSpace;
    canvasTex.anisotropy = 8;
    canvasTex.needsUpdate = true;
    return canvasTex;
  }, [lanyardText, rawTexture]);

  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas (1024x1024 crisp HD)
  const cardMap = useMemo(() => {
    const baseMap = materials.base?.map;
    if (!baseMap) return null;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    if (!baseImg) return baseMap;
    const W = 1024;
    const H = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
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
    composite.anisotropy = 8;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base?.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );

  const s = cardScale / 2.25;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.6]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.6]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.6]);
  // Precisely align strap end (j3) to pass directly into the top metal ring (clamp)
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.50 * s, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && card.current && j1.current && j2.current && j3.current && band.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 28));
      ang.copy(card.current.angvel());
      const r = card.current.rotation();
      quat.set(r.x, r.y, r.z, r.w);
      euler.setFromQuaternion(quat, 'YXZ');

      let newAngY = ang.y;
      let newAngX = ang.x * 0.96;
      let newAngZ = ang.z * 0.96;

      if (!dragged) {
        // Multi-directional 3D tilt towards cursor (left, right, top, bottom, and corners)
        let targetEulerY = 0;
        let targetEulerX = 0;
        let targetEulerZ = 0;

        if (hovered && !isMobile) {
          // Keep rigid body active so physics sleep never freezes the tilt effect
          card.current.wakeUp();

          // Cursor Right (x > 0) -> tilts right face inwards
          // Cursor Left (x < 0) -> tilts left face inwards
          // Cursor Top (y > 0) -> tilts top edge inwards/backwards
          // Cursor Bottom (y < 0) -> tilts bottom edge inwards
          // Corners -> seamless diagonal pitch, yaw & roll combination
          const tiltSensitivityX = 0.52;
          const tiltSensitivityY = 0.65;
          targetEulerY = THREE.MathUtils.clamp(pointerRef.current.x * tiltSensitivityY, -0.65, 0.65);
          targetEulerX = THREE.MathUtils.clamp(pointerRef.current.y * tiltSensitivityX, -0.55, 0.55);
          targetEulerZ = THREE.MathUtils.clamp(-pointerRef.current.x * pointerRef.current.y * 0.15, -0.2, 0.2);
        }

        const springTorqueY = -Math.sin(euler.y - targetEulerY) * (hovered ? 8.0 : 4.0);
        const springTorqueX = -Math.sin(euler.x - targetEulerX) * (hovered ? 7.0 : 2.5);
        const springTorqueZ = -Math.sin(euler.z - targetEulerZ) * (hovered ? 5.0 : 3.0);

        newAngY = ang.y * 0.95 + springTorqueY * delta;
        newAngX = ang.x * 0.94 + springTorqueX * delta;
        newAngZ = ang.z * 0.94 + springTorqueZ * delta;
      }

      card.current.setAngvel({ x: newAngX, y: newAngY, z: newAngZ });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 5.8, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.8, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.6, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2.4, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[3.2, 0, 0]} ref={card} {...cardProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider position={[0, -1.25 * s, 0]} args={[0.8 * s, 1.125 * s, 0.01]} />
          <group
            scale={cardScale}
            position={[0, -1.25 * s, -0.05]}
            onPointerOver={() => {
              hover(true);
              card.current?.wakeUp();
            }}
            onPointerOut={() => {
              hover(false);
              pointerRef.current.x = 0;
              pointerRef.current.y = 0;
            }}
            onPointerMove={e => {
              if (!dragged) {
                card.current?.wakeUp();
                const cardTrans = card.current ? card.current.translation() : { x: 0, y: 0 };
                const cardCenterY = cardTrans.y - 1.25 * s;
                const halfW = 0.8 * s;
                const halfH = 1.125 * s;
                // Calculate normalized -1 to +1 coordinate relative to card center
                const localX = (e.point.x - cardTrans.x) / Math.max(0.1, halfW);
                const localY = (e.point.y - cardCenterY) / Math.max(0.1, halfH);
                pointerRef.current.x = THREE.MathUtils.clamp(localX, -1, 1);
                pointerRef.current.y = THREE.MathUtils.clamp(localY, -1, 1);
              }
            }}
            onPointerUp={e => {
              (e.target as any)?.releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerDown={e => {
              (e.target as any)?.setPointerCapture?.(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshStandardMaterial
                map={cardMap}
                map-anisotropy={8}
                roughness={0.8}
                metalness={0.4}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1080, 2160] : [1440, 1440]}
          useMap
          map={finalTexture}
          repeat={[-2.8, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
