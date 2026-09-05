import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { TopologyNode, TopologyEdge } from '../types';

interface Cinematic3DWorldProps {
  currentSection: number; // 1 to 6
  isSimulating: boolean;
  isImpacted: boolean;
  waveProgress: number; // 0 to 100
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  targetNodeId: string;
  directImpactIds: string[];
  indirectImpactIds: string[];
  onSelectNode?: (node: TopologyNode) => void;
  mousePos: { x: number; y: number };
}

// Camera choreography coordinates per section
const SECTION_CAMERAS: Record<number, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  1: { pos: [0, 1.5, 14], lookAt: [0, 0, 0] },         // Hero: Wide atmospheric establishing view
  2: { pos: [3.2, 0.5, 9], lookAt: [0.5, -0.5, 0] },    // Ecosystem: Moving into the living cloud architecture
  3: { pos: [-4.2, 2.5, 7.5], lookAt: [-1, 0, 0] },    // AI Agents: High-angle analytical vantage
  4: { pos: [-2.0, -1.2, 5.5], lookAt: [-2.5, -0.8, 1] }, // Dependencies: Macro causality strands
  5: { pos: [-3.4, 0.4, 5.2], lookAt: [-3.8, 0.8, 0.4] }, // Simulation: Focused directly on Ground Zero (subnet-07)
  6: { pos: [0, 0, 8.5], lookAt: [0, 0, 0] }           // Verdict: Symmetrical, authoritative spatial climax
};

// Smooth Camera Controller
function CameraController({
  currentSection,
  isSimulating,
  isImpacted,
  targetPos,
  mousePos
}: {
  currentSection: number;
  isSimulating: boolean;
  isImpacted: boolean;
  targetPos?: [number, number, number];
  mousePos: { x: number; y: number };
}) {
  const currentPos = useRef(new THREE.Vector3(0, 1.5, 14));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    let dest = SECTION_CAMERAS[currentSection] || SECTION_CAMERAS[1];

    // If simulation is actively propagating or in climax, swoop close to the target failure
    if ((isSimulating || isImpacted) && targetPos) {
      dest = {
        pos: [targetPos[0] + 0.5, targetPos[1] + 0.2, targetPos[2] + 4.2],
        lookAt: [targetPos[0], targetPos[1], targetPos[2]]
      };
    }

    // Add subtle spatial mouse parallax
    const parallaxX = mousePos.x * 0.4;
    const parallaxY = -mousePos.y * 0.3;

    const targetCameraPos = new THREE.Vector3(
      dest.pos[0] + parallaxX,
      dest.pos[1] + parallaxY,
      dest.pos[2]
    );
    const targetLookAtPos = new THREE.Vector3(dest.lookAt[0], dest.lookAt[1], dest.lookAt[2]);

    // Smooth cinematic lerp
    const lerpSpeed = 2.4 * delta;
    currentPos.current.lerp(targetCameraPos, lerpSpeed);
    currentLookAt.current.lerp(targetLookAtPos, lerpSpeed);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

// 3D Organic Spline Edge between nodes using THREE.Line primitive
function CausalFilament({
  src,
  tgt,
  isDirect,
  isIndirect,
  isImpacted
}: {
  src: [number, number, number];
  tgt: [number, number, number];
  isDirect: boolean;
  isIndirect: boolean;
  isImpacted: boolean;
}) {
  const lineObject = useMemo(() => {
    const p1 = new THREE.Vector3(...src);
    const p2 = new THREE.Vector3(...tgt);
    const mid = new THREE.Vector3()
      .addVectors(p1, p2)
      .multiplyScalar(0.5)
      .add(new THREE.Vector3(0, 0.4, 0));

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const points = curve.getPoints(24);
    const geom = new THREE.BufferGeometry().setFromPoints(points);

    let c = '#D4D4D8';
    let op = 0.15;

    if (isImpacted) {
      if (isDirect) {
        c = '#EF4444';
        op = 0.95;
      } else if (isIndirect) {
        c = '#F59E0B';
        op = 0.7;
      } else {
        op = 0.03;
      }
    }

    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(c),
      transparent: true,
      opacity: op
    });

    return new THREE.Line(geom, mat);
  }, [src, tgt, isDirect, isIndirect, isImpacted]);

  return <primitive object={lineObject} />;
}

// 3D Glass & Silver Node
function Living3DNode({
  node,
  isTarget,
  isDirect,
  isIndirect,
  isImpacted,
  onSelect
}: {
  node: TopologyNode;
  isTarget: boolean;
  isDirect: boolean;
  isIndirect: boolean;
  isImpacted: boolean;
  onSelect?: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const pos: [number, number, number] = node.pos3D || [0, 0, 0];

  const isDanger = (isTarget || isDirect) && isImpacted;
  const isWarning = isIndirect && isImpacted;
  const isDimmed = isImpacted && !isDanger && !isWarning;

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += (isDanger ? 1.5 : 0.4) * delta;
    }
  });

  const nodeColor = isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#E4E4E7';

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group
        ref={meshRef}
        position={pos}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        scale={isDanger ? 1.25 : 1}
      >
        {/* Outer Hairline Orbital Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[0.38, 0.40, 32]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={isDimmed ? 0.05 : isDanger ? 0.9 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Refractive Frosted Glass Shell (Apple Vision Pro spatial styling) */}
        <mesh>
          <icosahedronGeometry args={[0.26, 1]} />
          <meshPhysicalMaterial
            color={nodeColor}
            emissive={isDanger ? '#7F1D1D' : isWarning ? '#78350F' : '#18181B'}
            emissiveIntensity={isDanger ? 0.8 : isWarning ? 0.4 : 0.1}
            roughness={0.2}
            metalness={0.1}
            transmission={0.8}
            thickness={0.6}
            transparent
            opacity={isDimmed ? 0.08 : 0.85}
          />
        </mesh>

        {/* Inner Luminous Core */}
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={isDimmed ? 0.1 : 1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Expanding Physical Shockwave Ring from Ground Zero
function ShockwaveRing({
  origin,
  progress,
  active
}: {
  origin: [number, number, number];
  progress: number;
  active: boolean;
}) {
  if (!active) return null;

  const radius = Math.max(progress * 0.14, 0.4);
  const opacity = Math.max(0, 1 - progress / 95);

  return (
    <mesh position={origin} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.04, 16, 64]} />
      <meshBasicMaterial
        color="#EF4444"
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

// Atmospheric Volumetric Dust Particles (Smoke & Cosmos)
function SmokeParticles() {
  const count = 280;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.015 * delta;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#D4D4D8"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export const Cinematic3DWorld: React.FC<Cinematic3DWorldProps> = ({
  currentSection,
  isSimulating,
  isImpacted,
  waveProgress,
  nodes,
  edges,
  targetNodeId,
  directImpactIds,
  indirectImpactIds,
  onSelectNode,
  mousePos
}) => {
  const nodeMap = useMemo(() => {
    const map = new Map<string, TopologyNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  const targetNode = nodeMap.get(targetNodeId);
  const targetPos = targetNode?.pos3D;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto bg-[#070709]">
      <Canvas
        camera={{ position: [0, 1.5, 14], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* Soft Black Smoke Fog */}
        <color attach="background" args={['#070709']} />
        <fogExp2 attach="fog" args={['#070709', 0.045]} />

        {/* Cinematic Spatial Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 12, 10]} intensity={0.8} color="#FAFAF9" />
        <directionalLight position={[-10, -8, -5]} intensity={0.3} color="#D4D4D8" />

        {/* Dynamic Danger Point Light centered on Ground Zero */}
        {targetPos && (isSimulating || isImpacted) && (
          <pointLight
            position={targetPos}
            color="#EF4444"
            intensity={2.8}
            distance={8}
            decay={2}
          />
        )}

        {/* Camera Director Controller */}
        <CameraController
          currentSection={currentSection}
          isSimulating={isSimulating}
          isImpacted={isImpacted}
          targetPos={targetPos}
          mousePos={mousePos}
        />

        {/* Floating Atmospheric Smoke Dust */}
        <SmokeParticles />

        {/* 3D Causal Filaments (Edges) */}
        {edges.map((edge) => {
          const src = nodeMap.get(edge.source);
          const tgt = nodeMap.get(edge.target);
          if (!src || !tgt || !src.pos3D || !tgt.pos3D) return null;

          const isDirect = (directImpactIds.includes(edge.source) || directImpactIds.includes(edge.target));
          const isIndirect = (indirectImpactIds.includes(edge.source) || indirectImpactIds.includes(edge.target));

          return (
            <CausalFilament
              key={edge.id}
              src={src.pos3D}
              tgt={tgt.pos3D}
              isDirect={isDirect}
              isIndirect={isIndirect}
              isImpacted={isImpacted}
            />
          );
        })}

        {/* 3D Living Infrastructure Nodes */}
        {nodes.map((node) => {
          const isTarget = node.id === targetNodeId;
          const isDirect = directImpactIds.includes(node.id);
          const isIndirect = indirectImpactIds.includes(node.id);

          return (
            <Living3DNode
              key={node.id}
              node={node}
              isTarget={isTarget}
              isDirect={isDirect}
              isIndirect={isIndirect}
              isImpacted={isImpacted}
              onSelect={() => onSelectNode?.(node)}
            />
          );
        })}

        {/* 3D Detonating Shockwave Ring */}
        {targetPos && (
          <ShockwaveRing
            origin={targetPos}
            progress={waveProgress}
            active={isSimulating}
          />
        )}
      </Canvas>
    </div>
  );
};
