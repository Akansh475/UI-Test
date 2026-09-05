import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeCanvasProps {
  isCritical?: boolean;
}

function FloatingNode({
  position,
  color,
  size = 0.35,
  speed = 1
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.4;
    meshRef.current.rotation.y = t * 0.6;
  });

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function ParticleNetwork({ isCritical }: { isCritical: boolean }) {
  const count = 75;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color(isCritical ? '#FF2E4D' : '#00F0FF');
    const colorB = new THREE.Color('#1A8CFF');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;

      const mixed = colorA.clone().lerp(colorB, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count, isCritical]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GroundGrid({ isCritical }: { isCritical: boolean }) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const t = state.clock.getElapsedTime();
    gridRef.current.position.z = (t * 0.2) % 1;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[24, 24, isCritical ? '#FF2E4D' : '#00F0FF', '#111827']}
      position={[0, -3.5, -2]}
      rotation={[0.3, 0, 0]}
    />
  );
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ isCritical = false }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-65">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <pointLight
          position={[10, 10, 10]}
          intensity={isCritical ? 1.5 : 1}
          color={isCritical ? '#FF2E4D' : '#00F0FF'}
        />
        <pointLight
          position={[-10, -10, -5]}
          intensity={0.8}
          color="#1A8CFF"
        />

        {/* Floating Infrastructure Nodes in 3D Depth */}
        <FloatingNode
          position={[-3.2, 1.8, -1]}
          color={isCritical ? '#FF2E4D' : '#00F0FF'}
          size={0.4}
          speed={0.8}
        />
        <FloatingNode
          position={[3.5, 1.2, -1.5]}
          color={isCritical ? '#FFB300' : '#1A8CFF'}
          size={0.35}
          speed={1.1}
        />
        <FloatingNode
          position={[-2.5, -1.5, -0.5]}
          color={isCritical ? '#FF2E4D' : '#00E676'}
          size={0.3}
          speed={0.9}
        />
        <FloatingNode
          position={[2.8, -2, -2]}
          color={isCritical ? '#FF2E4D' : '#7928CA'}
          size={0.45}
          speed={0.7}
        />
        <FloatingNode
          position={[0.2, 2.6, -3]}
          color="#1A8CFF"
          size={0.5}
          speed={0.6}
        />

        <ParticleNetwork isCritical={isCritical} />
        <GroundGrid isCritical={isCritical} />
      </Canvas>
    </div>
  );
};
