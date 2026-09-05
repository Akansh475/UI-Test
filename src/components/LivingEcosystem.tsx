import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Network, 
  Database, 
  Cpu, 
  Radio, 
  Server, 
  Eye, 
  Key, 
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Sparkles,
  Flame,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { TopologyNode, TopologyEdge, NodeType } from '../types';
import { soundManager } from '../utils/audio';

interface LivingEcosystemProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  targetNodeId: string | null;
  directImpactIds: string[];
  indirectImpactIds: string[];
  investigationPhase: 'idle' | 'swarming' | 'propagating' | 'verdict';
  propagationWave: number; // 0 to 100
  selectedNode: TopologyNode | null;
  onSelectNode: (node: TopologyNode | null) => void;
}

const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case 'VPC': return Layers;
    case 'Subnet': return Network;
    case 'API Gateway': return Radio;
    case 'Lambda': return Cpu;
    case 'Database': return Database;
    case 'Queue': return Server;
    case 'Monitoring': return Eye;
    case 'IAM Roles': return Key;
    case 'EKS Pods': return Server;
    case 'Redis ElastiCache': return Database;
    default: return Network;
  }
};

export const LivingEcosystem: React.FC<LivingEcosystemProps> = ({
  nodes,
  edges,
  targetNodeId,
  directImpactIds,
  indirectImpactIds,
  investigationPhase,
  propagationWave,
  selectedNode,
  onSelectNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Camera Pan and Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<TopologyNode | null>(null);

  // Auto-focus camera on target node when investigation starts
  useEffect(() => {
    if (investigationPhase === 'swarming' || investigationPhase === 'propagating') {
      const target = nodes.find(n => n.id === targetNodeId);
      if (target) {
        // Center camera with smooth transition toward target node
        setZoom(1.22);
        setPan({
          x: (500 - target.x) * 1.1,
          y: (375 - target.y) * 1.1
        });
      }
    } else if (investigationPhase === 'idle') {
      // Return to wide cinematic view
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [investigationPhase, targetNodeId, nodes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2.5));
  };

  const nodeMap = useMemo(() => {
    const map = new Map<string, TopologyNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  const isBlasting = investigationPhase === 'propagating' || investigationPhase === 'verdict';

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#05070A]"
    >
      {/* Subtle Ambient Cosmic Grid & Vignette */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(5,7,10,0.85) 90%)'
        }}
      />

      {/* Floating Canvas Camera Controls (Top Right Minimalist Glass Pill) */}
      <div className="absolute top-20 right-6 z-30 flex items-center gap-1 bg-slate-900/40 backdrop-blur-2xl px-2.5 py-1.5 rounded-full border border-white/10 shadow-2xl">
        <button
          onClick={() => {
            soundManager.playClick();
            setZoom(z => Math.min(z + 0.15, 2.5));
          }}
          className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-full"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setZoom(z => Math.max(z - 0.15, 0.5));
          }}
          className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-full"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3 bg-white/10 mx-1" />
        <button
          onClick={() => {
            soundManager.playClick();
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-full"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas for Living Cloud Topology */}
      <svg
        className="w-full h-full transition-transform duration-500 ease-out"
        viewBox="0 0 1000 750"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '500px 375px'
        }}
      >
        <defs>
          {/* Intense volumetric glow filters */}
          <filter id="laser-glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="laser-glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="laser-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Edge gradients */}
          <linearGradient id="edge-safe-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1A8CFF" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="edge-danger-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2E4D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FF6B8B" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="edge-amber-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB300" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFD54F" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Ambient VPC Cloud Constellation Enclosures (Minimalist boundary rings) */}
        <rect
          x="30"
          y="20"
          width="940"
          height="700"
          rx="32"
          fill="none"
          stroke="rgba(0, 240, 255, 0.07)"
          strokeWidth="1"
          strokeDasharray="8 8"
        />

        {/* Zone Boundaries */}
        <g opacity={isBlasting ? 0.35 : 0.6} className="transition-opacity duration-700">
          <circle cx="260" cy="380" r="190" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          <circle cx="500" cy="380" r="190" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          <circle cx="760" cy="380" r="190" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
        </g>

        {/* Wavefront Blast Shockwave Rings (radiating out from Ground Zero) */}
        {targetNodeId && isBlasting && (() => {
          const target = nodeMap.get(targetNodeId);
          if (!target) return null;
          return (
            <g>
              {/* Massive Outer Expanding Blast Wave */}
              <circle
                cx={target.x}
                cy={target.y}
                r={Math.max(propagationWave * 5.2, 40)}
                fill="none"
                stroke="#FF2E4D"
                strokeWidth="2.5"
                strokeOpacity={Math.max(0, 1 - (propagationWave / 110))}
                filter="url(#laser-glow-red)"
              />
              <circle
                cx={target.x}
                cy={target.y}
                r={Math.max(propagationWave * 3.5, 30)}
                fill="rgba(255, 46, 77, 0.06)"
                stroke="#FFB300"
                strokeWidth="1.5"
                strokeOpacity={Math.max(0, 0.8 - (propagationWave / 120))}
              />
              <circle
                cx={target.x}
                cy={target.y}
                r={Math.max(propagationWave * 2.0, 20)}
                fill="none"
                stroke="#FF2E4D"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-spin"
                style={{ transformOrigin: `${target.x}px ${target.y}px` }}
              />
            </g>
          );
        })()}

        {/* Dynamic Topology Edges (Interconnected Neural Fiber Lines) */}
        {edges.map((edge) => {
          const src = nodeMap.get(edge.source);
          const tgt = nodeMap.get(edge.target);
          if (!src || !tgt) return null;

          const isDirectlySevered = isBlasting && (directImpactIds.includes(edge.source) || directImpactIds.includes(edge.target));
          const isIndirect = isBlasting && (indirectImpactIds.includes(edge.source) || indirectImpactIds.includes(edge.target));

          const strokeColor = isDirectlySevered 
            ? 'url(#edge-danger-glow)' 
            : isIndirect 
            ? 'url(#edge-amber-glow)' 
            : 'url(#edge-safe-glow)';

          const strokeWidth = isDirectlySevered ? 3 : isIndirect ? 2 : 1.2;

          return (
            <g key={edge.id}>
              {/* Core light ray */}
              <line
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                filter={isDirectlySevered ? 'url(#laser-glow-red)' : isIndirect ? 'url(#laser-glow-amber)' : 'none'}
                strokeOpacity={isDirectlySevered ? 0.95 : isIndirect ? 0.8 : 0.25}
                className="transition-all duration-500"
              />

              {/* High-speed glowing particle pulses flowing down the wire */}
              <line
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={isDirectlySevered ? '#FF2E4D' : isIndirect ? '#FFB300' : '#00F0FF'}
                strokeWidth={isDirectlySevered ? 3.5 : 1.8}
                strokeDasharray="6 14"
                strokeOpacity={isDirectlySevered ? 1 : 0.7}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="40;0"
                  dur={isDirectlySevered ? '0.7s' : isIndirect ? '1.4s' : '3.0s'}
                  repeatCount="indefinite"
                />
              </line>
            </g>
          );
        })}

        {/* Living Topology Nodes */}
        {nodes.map((node) => {
          const isTarget = node.id === targetNodeId;
          const isDirect = isBlasting && directImpactIds.includes(node.id);
          const isIndirect = isBlasting && indirectImpactIds.includes(node.id);
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode?.id === node.id;

          const IconComponent = getNodeIcon(node.type);

          let nodeColor = '#00F0FF';
          let glowFilter = 'url(#laser-glow-cyan)';
          let bgFill = 'rgba(11, 25, 44, 0.85)';

          if (isTarget || isDirect) {
            nodeColor = '#FF2E4D';
            glowFilter = 'url(#laser-glow-red)';
            bgFill = 'rgba(50, 7, 18, 0.92)';
          } else if (isIndirect) {
            nodeColor = '#FFB300';
            glowFilter = 'url(#laser-glow-amber)';
            bgFill = 'rgba(45, 28, 5, 0.9)';
          }

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer transition-transform duration-300 ease-out group"
              onClick={() => {
                soundManager.playClick();
                onSelectNode(isSelected ? null : node);
              }}
              onMouseEnter={() => {
                soundManager.playClick();
                setHoveredNode(node);
              }}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer Pulsing Aura Ring */}
              {(isTarget || isDirect) && (
                <>
                  <circle
                    r="28"
                    fill="none"
                    stroke="#FF2E4D"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-spin"
                    style={{ animationDuration: '6s', transformOrigin: '0 0' }}
                  />
                  <circle
                    r="34"
                    fill="rgba(255, 46, 77, 0.12)"
                    stroke="#FF2E4D"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    className="animate-pulse"
                  />
                </>
              )}

              {isIndirect && (
                <circle
                  r="24"
                  fill="rgba(255, 179, 0, 0.08)"
                  stroke="#FFB300"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  className="animate-spin"
                  style={{ animationDuration: '10s', transformOrigin: '0 0' }}
                />
              )}

              {/* Main Minimalist Geometric Node Anchor */}
              <circle
                r={isSelected || isHovered ? 18 : 15}
                fill={bgFill}
                stroke={nodeColor}
                strokeWidth={isTarget || isDirect ? 2.5 : 1.5}
                filter={glowFilter}
                className="transition-all duration-200 shadow-2xl"
              />

              {/* Inner Node Icon */}
              <foreignObject 
                x={isSelected || isHovered ? -10 : -8} 
                y={isSelected || isHovered ? -10 : -8} 
                width={isSelected || isHovered ? 20 : 16} 
                height={isSelected || isHovered ? 20 : 16}
              >
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  <IconComponent 
                    className="w-full h-full transition-colors"
                    style={{ color: nodeColor }}
                  />
                </div>
              </foreignObject>

              {/* Minimalist Floating Label Text */}
              <text
                x="0"
                y="26"
                textAnchor="middle"
                fill={isDirect ? '#FFA4B2' : isIndirect ? '#FDE68A' : '#E2E8F0'}
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight={isTarget || isDirect ? '700' : '500'}
                letterSpacing="0.04em"
                className="select-none pointer-events-none transition-all duration-300"
              >
                {node.name}
              </text>

              {/* Sub-label: TPS or Impact State */}
              <text
                x="0"
                y="37"
                textAnchor="middle"
                fill={isDirect ? '#FF2E4D' : isIndirect ? '#FFB300' : '#64748B'}
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
                className="select-none pointer-events-none"
              >
                {isTarget 
                  ? 'GROUND ZERO' 
                  : isDirect 
                  ? 'SEVERED' 
                  : isIndirect 
                  ? 'CASCADING' 
                  : `${(node.tps || 0).toLocaleString()} TPS`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
