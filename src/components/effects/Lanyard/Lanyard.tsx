/* eslint-disable react/no-unknown-property */
import { useEffect, useState, Suspense } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { LanyardProps, cardGLB, lanyard, BLANK_PIXEL } from './types';
import { Band } from './LanyardBand';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

useGLTF.preload(cardGLB);
useTexture.preload(lanyard);
useTexture.preload(BLANK_PIXEL);

export default function Lanyard({
  position = [0, 0, 19],
  gravity = [0, -25, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardText = null,
  lanyardWidth = 0.46,
  mobileLanyardWidth = 0.28,
  cardScale = 1.55,
  mobileCardScale = 1.10,
  anchorY = 5.0,
  mobileAnchorY = 4.2,
  targetCenterY = -0.25,
  mobileTargetCenterY = -0.15,
  startY = 3.8,
  mobileStartY = 3.2,
  className = ''
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeCardScale = isMobile ? (mobileCardScale ?? 1.15) : cardScale;
  const activeLanyardWidth = isMobile ? (mobileLanyardWidth ?? 0.36) : lanyardWidth;
  const activeAnchorY = isMobile ? (mobileAnchorY ?? 3.8) : anchorY;
  const activeTargetCenterY = isMobile ? (mobileTargetCenterY ?? -0.45) : targetCenterY;
  const activeStartY = isMobile ? (mobileStartY ?? 3.0) : startY;

  return (
    <div className={`lanyard-wrapper ${className}`} style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={isMobile ? 1 : [1, 1.5]}
        performance={{ min: 0.8 }}
        gl={{ 
          alpha: transparent, 
          antialias: !isMobile, 
          powerPreference: 'high-performance',
          depth: true,
          stencil: false,
          preserveDrawingBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          gl.domElement.style.touchAction = 'none';
        }}
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={2.8} />
        <directionalLight position={[4, 8, 6]} intensity={1.5} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={1 / 60} numSolverIterations={3}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardText={lanyardText}
              lanyardWidth={activeLanyardWidth}
              cardScale={activeCardScale}
              anchorY={activeAnchorY}
              targetCenterY={activeTargetCenterY}
              startY={activeStartY}
            />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

