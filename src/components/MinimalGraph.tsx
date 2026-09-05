import React, { useState, useMemo } from 'react';
import { TopologyNode, TopologyEdge } from '../types';

interface MinimalGraphProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  targetNodeId: string | null;
  directImpactIds: string[];
  indirectImpactIds: string[];
  isInvestigating: boolean;
  isImpacted: boolean;
  waveProgress: number; // 0 to 100
  onSelectNode?: (node: TopologyNode) => void;
}

export const MinimalGraph: React.FC<MinimalGraphProps> = ({
  nodes,
  edges,
  targetNodeId,
  directImpactIds,
  indirectImpactIds,
  isInvestigating,
  isImpacted,
  waveProgress,
  onSelectNode
}) => {
  const [hoveredNode, setHoveredNode] = useState<TopologyNode | null>(null);

  const nodeMap = useMemo(() => {
    const map = new Map<string, TopologyNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  const targetNode = targetNodeId ? nodeMap.get(targetNodeId) : null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden bg-[#000000]">
      {/* Subtle Monochromatic Dot Grid */}
      <div className="absolute inset-0 minimal-dots opacity-40 pointer-events-none" />

      {/* SVG Living Topology */}
      <svg
        className="w-full h-full select-none"
        viewBox="0 0 1000 750"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Red Danger Glow */}
          <filter id="subtle-red-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Expanding Shockwave Ring from Target Node */}
        {targetNode && (isInvestigating || isImpacted) && (
          <g>
            <circle
              cx={targetNode.x}
              cy={targetNode.y}
              r={isInvestigating ? (waveProgress * 5) : 32}
              fill="none"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeOpacity={isInvestigating ? Math.max(0, 1 - waveProgress / 100) : 0.4}
              filter="url(#subtle-red-glow)"
            />
          </g>
        )}

        {/* Minimal Hairline Edges */}
        {edges.map((edge) => {
          const src = nodeMap.get(edge.source);
          const tgt = nodeMap.get(edge.target);
          if (!src || !tgt) return null;

          const isDirectlySevered = isImpacted && (directImpactIds.includes(edge.source) || directImpactIds.includes(edge.target));
          const isDimmed = isImpacted && !isDirectlySevered;

          return (
            <g key={edge.id}>
              {/* Base Hairline */}
              <line
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={isDirectlySevered ? '#EF4444' : '#FFFFFF'}
                strokeWidth={isDirectlySevered ? 1.5 : 1}
                strokeOpacity={isDirectlySevered ? 0.9 : isDimmed ? 0.06 : 0.16}
                className="transition-all duration-700 ease-out"
              />

              {/* Gentle flow pulse along severed lines when impacted */}
              {isDirectlySevered && (
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="4 12"
                  strokeOpacity={0.8}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="32;0"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </line>
              )}
            </g>
          );
        })}

        {/* Beautiful Monochromatic & Selective Red Nodes */}
        {nodes.map((node) => {
          const isTarget = node.id === targetNodeId && isImpacted;
          const isDirect = directImpactIds.includes(node.id) && isImpacted;
          const isIndirect = indirectImpactIds.includes(node.id) && isImpacted;
          const isAffected = isTarget || isDirect || isIndirect;
          const isDimmed = isImpacted && !isAffected;

          // Color choices: Clean White/Gray in normal state; Red only on danger
          const strokeColor = isAffected ? '#EF4444' : '#FFFFFF';
          const fillColor = isAffected ? '#1C0609' : '#09090B';

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer transition-opacity duration-700 ease-out"
              style={{ opacity: isDimmed ? 0.12 : 1 }}
              onClick={() => onSelectNode?.(node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Target Red Warning Ring */}
              {isTarget && (
                <circle
                  r="22"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  className="animate-spin"
                  style={{ animationDuration: '12s', transformOrigin: '0 0' }}
                />
              )}

              {/* Node Outer Ring */}
              <circle
                r="11"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isAffected ? 1.5 : 1}
                strokeOpacity={isAffected ? 1 : 0.4}
                filter={isAffected ? 'url(#subtle-red-glow)' : 'none'}
                className="transition-all duration-500"
              />

              {/* Tiny Center Dot */}
              <circle
                r="3"
                fill={strokeColor}
                fillOpacity={isAffected ? 1 : 0.8}
              />

              {/* Minimalist Node Label */}
              <text
                x="0"
                y="22"
                textAnchor="middle"
                fill={isAffected ? '#FCA5A5' : '#A1A1AA'}
                fontSize="9"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                fontWeight={isAffected ? '600' : '400'}
                letterSpacing="-0.01em"
                className="select-none pointer-events-none transition-colors duration-500"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Ultra-minimal hover pill */}
      {hoveredNode && (
        <div 
          className="absolute bottom-8 left-8 z-30 pointer-events-none px-3.5 py-2 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-mono text-zinc-300 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <span className="text-white font-medium">{hoveredNode.name}</span>
          <span className="text-zinc-500 mx-2">/</span>
          <span className="text-zinc-400">{hoveredNode.type}</span>
          <span className="text-zinc-500 mx-2">/</span>
          <span className={directImpactIds.includes(hoveredNode.id) && isImpacted ? 'text-red-400 font-semibold' : 'text-zinc-400'}>
            {directImpactIds.includes(hoveredNode.id) && isImpacted ? 'Will Fail' : 'Operational'}
          </span>
        </div>
      )}
    </div>
  );
};
