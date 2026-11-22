import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const IcosahedronMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ pointer }, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4 + pointer.y * 0.05;
      meshRef.current.rotation.y += delta * 0.5 + pointer.x * 0.05;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group>
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial
          color="#D4AF37"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner Glowing Core Node */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#F3D98B"
          emissive="#D4AF37"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
};

export const IcosahedronNode: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-40 h-40 sm:w-56 sm:h-56 relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#F3D98B" />
          <pointLight position={[-5, -5, -5]} intensity={1} color="#2DE2C7" />
          <IcosahedronMesh />
        </Suspense>
      </Canvas>
    </div>
  );
};
