/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import * as THREE from 'three';
import { BandProps, cardGLB, lanyard, BLANK_PIXEL } from './types';
import { generateLanyardStrapTexture, compositeCardAtlasTexture } from './lanyardTextureHelpers';

export function Band({
  isMobile: isMobileProp,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardText = null,
  lanyardWidth = 0.80,
  cardScale = 1.85,
  anchorY = 4.5,
  targetCenterY = -1.25,
  startY = 3.2
}: BandProps) {
  const { size } = useThree();
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  const isMobile = isMobileProp ?? (typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024)));

  const pointerRef = useRef({ x: 0, y: 0 });
  const ang = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size.width, size.height]);

  const segmentProps = useMemo(() => ({
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 3.5,
    linearDamping: 3.5
  }), []);

  const cardProps = useMemo(() => ({
    canSleep: true,
    colliders: false as const,
    angularDamping: 2.2,
    linearDamping: 2.2
  }), []);

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const rawTexture = useTexture(lanyardImage || lanyard);
  const finalTexture = useMemo(() => {
    return generateLanyardStrapTexture(lanyardText, rawTexture, isMobile);
  }, [lanyardText, rawTexture, isMobile]);

  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    return compositeCardAtlasTexture(materials.base?.map, frontImage, backImage, frontTex, backTex, imageFit, isMobile);
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base?.map, isMobile]);

  const s = cardScale / 2.25;
  const equilibriumClipY = targetCenterY + 1.51 * s;
  const totalRopeSpan = Math.max(0.8, anchorY - equilibriumClipY);
  const ropeSegmentLen = (totalRopeSpan / 3) * 1.02;

  const startCardCenterY = startY;
  const startClipY = startCardCenterY + 1.51 * s;
  const initRopeSpan = Math.max(0.45, anchorY - startClipY);
  const initRopeSeg = initRopeSpan / 3;

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, anchorY - initRopeSpan, 0),
      new THREE.Vector3(0.03, anchorY - initRopeSpan + 0.11 * s, 0),
      new THREE.Vector3(0.02, anchorY - initRopeSeg * 2, 0),
      new THREE.Vector3(0.01, anchorY - initRopeSeg, 0),
      new THREE.Vector3(0, anchorY, 0)
    ]);
    c.curveType = 'centripetal';
    return c;
  });

  const draggedRef = useRef<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const pointerNDC = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPointerActive = useRef<boolean>(false);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetPoint = useMemo(() => new THREE.Vector3(), []);
  const dragVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastDragPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeSegmentLen]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeSegmentLen]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeSegmentLen]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.516 * s, -0.05]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const canvas = document.querySelector('.lanyard-wrapper canvas') as HTMLCanvasElement;
    if (!canvas) return;

    let touchStartY = 0;
    let isTouchOnCanvas = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        isTouchOnCanvas = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isTouchOnCanvas && !draggedRef.current && e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        touchStartY = currentY;
        if (Math.abs(deltaY) > 0.5) {
          window.scrollBy({ top: deltaY, behavior: 'auto' });
        }
      }
    };

    const onTouchEnd = () => {
      isTouchOnCanvas = false;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (!dragged) return;

    const handlePointerMove = (e: PointerEvent) => {
      const canvas = document.querySelector('.lanyard-wrapper canvas') as HTMLCanvasElement;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointerNDC.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1
      };
      isPointerActive.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const canvas = document.querySelector('.lanyard-wrapper canvas') as HTMLCanvasElement;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        pointerNDC.current = {
          x: ((touch.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((touch.clientY - rect.top) / rect.height) * 2 + 1
        };
        isPointerActive.current = true;
      }
    };

    const handleRelease = () => {
      draggedRef.current = false;
      isPointerActive.current = false;
      dragOffsetRef.current = null;
      drag(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);
    window.addEventListener('touchend', handleRelease);
    window.addEventListener('touchcancel', handleRelease);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerup', handleRelease);
      window.removeEventListener('pointercancel', handleRelease);
      window.removeEventListener('touchend', handleRelease);
      window.removeEventListener('touchcancel', handleRelease);
    };
  }, [dragged]);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.033);
    let targetDragCardX = 0;
    let targetDragCardY = 0;

    if (dragged && card.current) {
      const px = isPointerActive.current ? pointerNDC.current.x : state.pointer.x;
      const py = isPointerActive.current ? pointerNDC.current.y : state.pointer.y;

      raycaster.setFromCamera(new THREE.Vector2(px, py), state.camera);
      raycaster.ray.intersectPlane(plane, targetPoint);

      targetDragCardX = targetPoint.x - (dragOffsetRef.current?.x ?? dragged.x);
      targetDragCardY = targetPoint.y - (dragOffsetRef.current?.y ?? dragged.y);

      const now = performance.now();
      const dt = (now - lastDragPosRef.current.time) / 1000;
      if (dt > 0.005 && dt < 0.2) {
        const vx = (targetDragCardX - lastDragPosRef.current.x) / dt;
        const vy = (targetDragCardY - lastDragPosRef.current.y) / dt;
        dragVelocityRef.current = {
          x: THREE.MathUtils.clamp(vx, -20, 20),
          y: THREE.MathUtils.clamp(vy, -20, 20)
        };
      }
      lastDragPosRef.current = { x: targetDragCardX, y: targetDragCardY, time: now };

      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: targetDragCardX,
        y: targetDragCardY,
        z: 0
      });
    }

    if (fixed.current && card.current && j1.current && j2.current && j3.current && band.current) {
      [j1, j2, j3].forEach(ref => {
        if (!ref.current) return;
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const target = ref.current.translation();
        const dist = Math.min(2.5, ref.current.lerped.distanceTo(target));
        const factor = THREE.MathUtils.clamp(safeDelta * (28 + dist * 35), 0.40, 0.98);
        ref.current.lerped.lerp(target, factor);
      });

      const cardTrans = card.current.translation();
      const r = card.current.rotation();
      quat.set(r.x, r.y, r.z, r.w);
      euler.setFromQuaternion(quat, 'YXZ');

      const curTrans = dragged
        ? new THREE.Vector3(targetDragCardX, targetDragCardY, 0)
        : new THREE.Vector3(cardTrans.x, cardTrans.y, cardTrans.z);

      const localClipTop = new THREE.Vector3(0, 1.516 * s, -0.05);
      const localClipTangent = new THREE.Vector3(0, 1.636 * s, -0.05);

      const worldClipTop = localClipTop.applyQuaternion(quat).add(curTrans);
      const worldClipTangent = localClipTangent.applyQuaternion(quat).add(curTrans);

      if (j3.current?.lerped) {
        j3.current.lerped.set(worldClipTop.x, worldClipTop.y, 0);
      }

      curve.points[0].set(worldClipTop.x, worldClipTop.y, 0);
      curve.points[1].set(worldClipTangent.x, worldClipTangent.y, 0);
      curve.points[2].set(j2.current.lerped.x, j2.current.lerped.y, 0);
      curve.points[3].set(j1.current.lerped.x, j1.current.lerped.y, 0);
      curve.points[4].set(fixed.current.translation().x, fixed.current.translation().y, 0);

      band.current.geometry.setPoints(
        curve.getPoints(isMobile ? 24 : 36),
        (p: number) => (p < 0.06 ? 0.85 + p * 2.5 : 1.0)
      );

      ang.copy(card.current.angvel());
      let newAngY = ang.y;
      let newAngX = ang.x * 0.96;
      let newAngZ = ang.z * 0.96;

      if (!dragged) {
        let targetEulerY = 0;
        let targetEulerX = 0;
        let targetEulerZ = 0;

        if (hovered && !isMobile) {
          card.current.wakeUp();
          targetEulerY = THREE.MathUtils.clamp(pointerRef.current.x * 0.62, -0.60, 0.60);
          targetEulerX = THREE.MathUtils.clamp(pointerRef.current.y * 0.52, -0.50, 0.50);
          targetEulerZ = THREE.MathUtils.clamp(-pointerRef.current.x * pointerRef.current.y * 0.18, -0.22, 0.22);

          const springTorqueY = -Math.sin(euler.y - targetEulerY) * 7.5;
          const springTorqueX = -Math.sin(euler.x - targetEulerX) * 6.5;
          const springTorqueZ = -Math.sin(euler.z - targetEulerZ) * 5.0;

          newAngY = ang.y * 0.94 + springTorqueY * safeDelta;
          newAngX = ang.x * 0.93 + springTorqueX * safeDelta;
          newAngZ = ang.z * 0.93 + springTorqueZ * safeDelta;
          card.current.setAngvel({ x: newAngX, y: newAngY, z: newAngZ });
        } else if (!isMobile) {
          if (!card.current.isSleeping()) {
            const idleTime = state.clock.elapsedTime;
            targetEulerY = Math.sin(idleTime * 1.2) * 0.035;
            targetEulerX = Math.cos(idleTime * 0.9) * 0.025;

            const springTorqueY = -Math.sin(euler.y - targetEulerY) * 3.5;
            const springTorqueX = -Math.sin(euler.x - targetEulerX) * 2.5;
            const springTorqueZ = -Math.sin(euler.z - targetEulerZ) * 2.5;

            newAngY = ang.y * 0.94 + springTorqueY * safeDelta;
            newAngX = ang.x * 0.93 + springTorqueX * safeDelta;
            newAngZ = ang.z * 0.93 + springTorqueZ * safeDelta;
            card.current.setAngvel({ x: newAngX, y: newAngY, z: newAngZ });
          }
        }
      }
    }
  });

  return (
    <>
      <mesh ref={band} renderOrder={0}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={resolution}
          useMap
          map={finalTexture}
          repeat={[-3.5, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>

      <group position={[0, anchorY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" position={[0, 0, 0]} />
        <RigidBody position={[0.04, -initRopeSeg, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.10, -initRopeSeg * 2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.18, -initRopeSpan, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0.22, -initRopeSpan - 1.516 * s, 0]}
          rotation={[0.25, Math.PI * 0.88, Math.PI]}
          ref={card}
          {...cardProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider position={[0, -1.25 * s, 0]} args={[0.8 * s, 1.125 * s, 0.01]} />
          <group
            scale={cardScale}
            position={[0, -1.25 * s, -0.05]}
            renderOrder={1}
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
                const localX = (e.point.x - cardTrans.x) / Math.max(0.1, halfW);
                const localY = (e.point.y - cardCenterY) / Math.max(0.1, halfH);
                pointerRef.current.x = THREE.MathUtils.clamp(localX, -1, 1);
                pointerRef.current.y = THREE.MathUtils.clamp(localY, -1, 1);
              }
            }}
            onPointerUp={e => {
              e.stopPropagation();
              const domTarget = (e.nativeEvent?.target as HTMLElement) || (e.target as any)?.gl?.domElement;
              if (domTarget?.releasePointerCapture) {
                try {
                  domTarget.releasePointerCapture(e.pointerId);
                } catch (_) {}
              }
              if (card.current) {
                card.current.wakeUp();
                const vx = THREE.MathUtils.clamp(dragVelocityRef.current.x * 0.85, -16, 16);
                const vy = THREE.MathUtils.clamp(dragVelocityRef.current.y * 0.85, -16, 16);
                card.current.setLinvel({ x: vx, y: vy, z: 0 }, true);
                card.current.setAngvel({ x: 0, y: 0, z: THREE.MathUtils.clamp(-vx * 0.35, -5, 5) }, true);
              }
              draggedRef.current = false;
              isPointerActive.current = false;
              dragOffsetRef.current = null;
              drag(false);
            }}
            onPointerCancel={e => {
              const domTarget = (e.nativeEvent?.target as HTMLElement) || (e.target as any)?.gl?.domElement;
              if (domTarget?.releasePointerCapture) {
                try {
                  domTarget.releasePointerCapture(e.pointerId);
                } catch (_) {}
              }
              if (card.current) {
                card.current.wakeUp();
                const vx = THREE.MathUtils.clamp(dragVelocityRef.current.x * 0.85, -16, 16);
                const vy = THREE.MathUtils.clamp(dragVelocityRef.current.y * 0.85, -16, 16);
                card.current.setLinvel({ x: vx, y: vy, z: 0 }, true);
                card.current.setAngvel({ x: 0, y: 0, z: THREE.MathUtils.clamp(-vx * 0.35, -5, 5) }, true);
              }
              draggedRef.current = false;
              isPointerActive.current = false;
              dragOffsetRef.current = null;
              drag(false);
            }}
            onPointerDown={e => {
              e.stopPropagation();
              const domTarget = (e.nativeEvent?.target as HTMLElement) || (e.target as any)?.gl?.domElement;
              if (domTarget?.setPointerCapture) {
                try {
                  domTarget.setPointerCapture(e.pointerId);
                } catch (_) {}
              }

              const hitPoint = new THREE.Vector3();
              if (e.ray) {
                e.ray.intersectPlane(plane, hitPoint);
              } else {
                hitPoint.copy(e.point);
              }

              const trans = card.current ? card.current.translation() : { x: 0, y: 0, z: 0 };
              const offsetX = hitPoint.x - trans.x;
              const offsetY = hitPoint.y - trans.y;

              dragOffsetRef.current = { x: offsetX, y: offsetY };
              draggedRef.current = true;

              if (e.nativeEvent && 'clientX' in e.nativeEvent) {
                const canvas = document.querySelector('.lanyard-wrapper canvas') as HTMLCanvasElement;
                if (canvas) {
                  const rect = canvas.getBoundingClientRect();
                  pointerNDC.current = {
                    x: ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1,
                    y: -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1
                  };
                  isPointerActive.current = true;
                }
              }

              [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
              drag(new THREE.Vector3(offsetX, offsetY, 0));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshStandardMaterial
                map={cardMap}
                map-anisotropy={isMobile ? 1 : 4}
                roughness={0.8}
                metalness={0.4}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
    </>
  );
}
