import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Fallback when WebGL is unsupported or disabled
export const HeroFallback: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated radial ambient gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,rgba(14,16,22,0.6)_60%,transparent_80%)] rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(45,226,199,0.12)_0%,transparent_70%)] rounded-full blur-3xl animate-pulse-slow" />

      {/* Luxury CSS/SVG Constellation Matrix */}
      <svg
        className="w-full h-full opacity-35"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fallbackGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3D98B" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9C7A1E" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <circle cx="500" cy="500" r="320" fill="none" stroke="url(#fallbackGold)" strokeWidth="1" strokeDasharray="6, 12" />
        <circle cx="500" cy="500" r="220" fill="none" stroke="rgba(45,226,199,0.25)" strokeWidth="0.8" />
        <circle cx="500" cy="500" r="120" fill="none" stroke="url(#fallbackGold)" strokeWidth="1.5" />
        {/* Radiating constellation lines */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 500 + Math.cos(rad) * 120;
          const y1 = 500 + Math.sin(rad) * 120;
          const x2 = 500 + Math.cos(rad) * 320;
          const y2 = 500 + Math.sin(rad) * 320;
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(212,175,55,0.3)"
              strokeWidth="0.75"
            />
          );
        })}
      </svg>
    </div>
  );
};

// Check WebGL availability
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface ConstellationSceneProps {
  particleCount: number;
  scrollProgress: number;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

const ConstellationScene: React.FC<ConstellationSceneProps> = ({
  particleCount,
  scrollProgress,
  mousePos,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate particle sphere & dispersed positions
  const { spherePositions, dispersedPositions, colors, linePositions } = useMemo(() => {
    const sphere = new Float32Array(particleCount * 3);
    const dispersed = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    const radius = 2.5;
    const goldColor = new THREE.Color('#D4AF37');
    const goldLightColor = new THREE.Color('#F3D98B');
    const tealColor = new THREE.Color('#2DE2C7');

    const sampleNodes: THREE.Vector3[] = [];
    const sampleLimit = Math.min(particleCount, 180); // nodes used for connecting constellation lines

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;

      // Fibonacci sphere distribution for uniform organic globe
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const r = radius * (0.88 + Math.random() * 0.24);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      sphere[idx] = x;
      sphere[idx + 1] = y;
      sphere[idx + 2] = z;

      // Dispersed explosion target
      const dist = 5.0 + Math.random() * 8.0;
      dispersed[idx] = x * dist * 0.8 + (Math.random() - 0.5) * 6;
      dispersed[idx + 1] = y * dist * 0.8 + (Math.random() - 0.5) * 6;
      dispersed[idx + 2] = z * dist * 0.8 + (Math.random() - 0.5) * 6;

      // Colors: mostly gold, occasional light gold and teal accents
      const rand = Math.random();
      let c = goldColor;
      if (rand > 0.85) c = goldLightColor;
      else if (rand < 0.08) c = tealColor;

      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;

      if (i < sampleLimit) {
        sampleNodes.push(new THREE.Vector3(x, y, z));
      }
    }

    // Connect proximate nodes with thin lines
    const lineCoords: number[] = [];
    const maxDist = 0.82;
    for (let i = 0; i < sampleNodes.length; i++) {
      for (let j = i + 1; j < sampleNodes.length; j++) {
        const d = sampleNodes[i].distanceTo(sampleNodes[j]);
        if (d < maxDist) {
          lineCoords.push(
            sampleNodes[i].x,
            sampleNodes[i].y,
            sampleNodes[i].z,
            sampleNodes[j].x,
            sampleNodes[j].y,
            sampleNodes[j].z
          );
        }
      }
    }

    return {
      spherePositions: sphere,
      dispersedPositions: dispersed,
      colors: cols,
      linePositions: new Float32Array(lineCoords),
    };
  }, [particleCount]);

  // Dynamic particle positions buffer
  const currentPositions = useMemo(() => new Float32Array(spherePositions), [spherePositions]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Gentle constant rotation
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.04;

    // Mouse parallax reaction
    const targetRotX = mousePos.current.y * 0.45;
    const targetRotY = mousePos.current.x * 0.45;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;

    // Interpolate particle positions based on scrollProgress
    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const t = THREE.MathUtils.clamp(scrollProgress * 1.6, 0, 1);
      const easeT = t * t * (3 - 2 * t); // smoothstep

      for (let i = 0; i < particleCount * 3; i++) {
        currentPositions[i] = THREE.MathUtils.lerp(
          spherePositions[i],
          dispersedPositions[i],
          easeT
        );
      }
      positionAttr.copyArray(currentPositions);
      positionAttr.needsUpdate = true;
    }

    // Fade out lines on scroll dispersal
    if (linesRef.current) {
      const lineMaterial = linesRef.current.material as THREE.LineBasicMaterial;
      const lineOpacity = Math.max(0, 0.35 - scrollProgress * 0.7);
      lineMaterial.opacity = lineOpacity;
    }
  });

  // Texture dot for circular soft glowing particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(243,217,139,0.85)');
      grad.addColorStop(0.7, 'rgba(212,175,55,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Network Constellation Lines */}
      {linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Constellation Nodes Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={currentPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.9}
          map={particleTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

export const HeroConstellation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [particleCount, setParticleCount] = useState(3800);
  const [scrollProgress, setScrollProgress] = useState(0);

  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check reduced motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(reducedMotionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    // Check WebGL
    setHasWebGL(isWebGLAvailable());

    // Adaptive particle count based on screen width
    const updateCount = () => {
      const isMobile = window.innerWidth < 768;
      setParticleCount(isMobile ? 1200 : 3800);
    };
    updateCount();
    window.addEventListener('resize', updateCount);

    // Track scroll progress for dispersal
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(1, Math.max(0, scrollY / 650));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track mouse for gentle parallax
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Tab visibility handling
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Intersection observer on container
    const currentContainer = containerRef.current;
    if (currentContainer && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(currentContainer);
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateCount);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        reducedMotionQuery.removeEventListener('change', handleMotionChange);
      };
    }

    return () => {
      window.removeEventListener('resize', updateCount);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return <HeroFallback />;
  }

  const shouldRender = isInView && isTabVisible;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        frameloop={shouldRender ? 'always' : 'never'}
        className="w-full h-full pointer-events-none"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#F3D98B" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#2DE2C7" />

          <ConstellationScene
            particleCount={particleCount}
            scrollProgress={scrollProgress}
            mousePos={mousePos}
          />

          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
