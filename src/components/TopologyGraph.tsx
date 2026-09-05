import React, { useState, useRef, useMemo } from 'react';
import { 
  Network, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Server, 
  Eye, 
  Key, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Activity,
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { TopologyNode, TopologyEdge, NodeType, NodeTier } from '../types';
import { soundManager } from '../utils/audio';

interface TopologyGraphProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  targetNodeId: string | null;
  directImpactIds: string[];
  indirectImpactIds: string[];
  isInvestigating: boolean;
  propagationProgress: number; // 0 to 100
  onSelectNode: (node: TopologyNode) => void;
}

const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case 'VPC':
      return Layers;
    case 'Subnet':
      return Network;
    case 'API Gateway':
      return Radio;
    case 'Lambda':
      return Cpu;
    case 'Database':
      return Database;
    case 'Queue':
      return Server;
    case 'Monitoring':
      return Eye;
    case 'IAM Roles':
      return Key;
    case 'EKS Pods':
      return Server;
    case 'Redis ElastiCache':
      return Database;
    default:
      return Network;
  }
};

export const TopologyGraph: React.FC<TopologyGraphProps> = ({
  nodes,
  edges,
  targetNodeId,
  directImpactIds,
  indirectImpactIds,
  isInvestigating,
  propagationProgress,
  onSelectNode
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<TopologyNode | null>(null);
  const [selectedTier, setSelectedTier] = useState<'ALL' | NodeTier>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchesTier = selectedTier === 'ALL' || n.tier === selectedTier;
      const matchesSearch = searchQuery === '' || 
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [nodes, selectedTier, searchQuery]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
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

  const handleZoom = (delta: number) => {
    soundManager.playClick();
    setZoom(prev => Math.min(Math.max(prev + delta, 0.6), 2.2));
  };

  const handleResetView = () => {
    soundManager.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node position map for fast edge lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, TopologyNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-[#070B12]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
      {/* Top HUD Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-hud">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-medium text-cyan-300">LIVE TOPOLOGY MESH</span>
          </div>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <span className="text-xs font-mono text-slate-400">18 NODES • 19 EDGES</span>
          {isInvestigating && (
            <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-mono animate-pulse">
              <Flame className="w-3 h-3 text-rose-400" />
              <span>PROPAGATING WAVEFRONT ({Math.round(propagationProgress)}%)</span>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Tier Filter Tabs */}
          <div className="hidden sm:flex bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {(['ALL', 'Tier-0', 'Tier-1', 'Tier-2'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedTier(tier);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedTier === tier
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search resource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-28 sm:w-36 font-mono"
            />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleZoom(0.15)}
              title="Zoom In"
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              title="Zoom Out"
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              title="Reset View"
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend at bottom left */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 shadow-hud">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Blast Radius State</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ff2e4d]" />
            <span className="text-rose-300">Ground Zero / Direct Impact</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#ffb300]" />
            <span className="text-amber-300">Indirect Dependency Cascade</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            <span className="text-cyan-300">Safe Perimeter Node</span>
          </div>
        </div>
      </div>

      {/* Interactive Canvas / SVG Graph */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full cursor-grab active:cursor-grabbing select-none relative overflow-hidden cyber-grid`}
      >
        <svg
          className="w-full h-full min-w-[1000px] min-h-[700px] transition-transform duration-75 ease-out"
          viewBox="0 0 1000 750"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '500px 375px'
          }}
        >
          <defs>
            {/* Glow filters */}
            <filter id="glow-red-node" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-amber-node" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyan-node" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Line Gradients */}
            <linearGradient id="grad-edge-normal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1A8CFF" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="grad-edge-danger" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2E4D" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFB300" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* VPC Region Boundary Containers */}
          <rect
            x="40"
            y="20"
            width="920"
            height="700"
            rx="24"
            fill="none"
            stroke="rgba(0, 240, 255, 0.12)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text x="60" y="45" fill="rgba(0, 240, 255, 0.4)" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
            AWS PROD-US-EAST-1 (VPC: 10.0.0.0/16)
          </text>

          {/* Subnet Cluster Enclosures */}
          <rect
            x="80"
            y="140"
            width="280"
            height="550"
            rx="16"
            fill={targetNodeId === 'subnet-07' ? 'rgba(255, 46, 77, 0.05)' : 'rgba(15, 23, 42, 0.4)'}
            stroke={targetNodeId === 'subnet-07' ? 'rgba(255, 46, 77, 0.3)' : 'rgba(255, 255, 255, 0.06)'}
            strokeWidth="1"
          />
          <text x="96" y="165" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
            AZ: us-east-1a (Public DMZ)
          </text>

          <rect
            x="380"
            y="140"
            width="280"
            height="550"
            rx="16"
            fill="rgba(15, 23, 42, 0.3)"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
          />
          <text x="396" y="165" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
            AZ: us-east-1b (Private App Mesh)
          </text>

          <rect
            x="680"
            y="140"
            width="260"
            height="550"
            rx="16"
            fill="rgba(15, 23, 42, 0.3)"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
          />
          <text x="696" y="165" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
            AZ: us-east-1c (Data & Messaging)
          </text>

          {/* Wavefront Blast Wave Animation (expanding ring from target node) */}
          {targetNodeId && (
            (() => {
              const target = nodeMap.get(targetNodeId);
              if (!target) return null;
              return (
                <g>
                  <circle
                    cx={target.x}
                    cy={target.y}
                    r={isInvestigating ? (propagationProgress * 4.5) : 35}
                    fill="none"
                    stroke="#FF2E4D"
                    strokeWidth="2"
                    strokeOpacity={0.6}
                    strokeDasharray="4 4"
                    className="animate-spin"
                    style={{ transformOrigin: `${target.x}px ${target.y}px` }}
                  />
                  <circle
                    cx={target.x}
                    cy={target.y}
                    r={isInvestigating ? (propagationProgress * 2.8) : 25}
                    fill="rgba(255, 46, 77, 0.08)"
                    stroke="#FFB300"
                    strokeWidth="1.5"
                    strokeOpacity={0.4}
                  />
                </g>
              );
            })()
          )}

          {/* Render Connections / Edges */}
          {edges.map((edge) => {
            const src = nodeMap.get(edge.source);
            const tgt = nodeMap.get(edge.target);
            if (!src || !tgt) return null;

            const isDirectlySevered = directImpactIds.includes(edge.source) || directImpactIds.includes(edge.target);
            const isIndirect = indirectImpactIds.includes(edge.source) || indirectImpactIds.includes(edge.target);

            const strokeColor = isDirectlySevered 
              ? '#FF2E4D' 
              : isIndirect 
              ? '#FFB300' 
              : '#1E40AF';

            const strokeWidth = isDirectlySevered ? 2.5 : isIndirect ? 2 : 1.5;

            return (
              <g key={edge.id} className="transition-all duration-300">
                {/* Background Shadow line */}
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={isDirectlySevered ? 0.9 : isIndirect ? 0.6 : 0.25}
                />

                {/* Flowing animated dash pulses */}
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isDirectlySevered ? '#FF2E4D' : isIndirect ? '#FFB300' : '#00F0FF'}
                  strokeWidth={isDirectlySevered ? 3 : 2}
                  strokeDasharray="4 8"
                  className={isDirectlySevered ? 'animate-pulse' : ''}
                  strokeDashoffset={isInvestigating ? '0' : '20'}
                  strokeOpacity={isDirectlySevered ? 0.9 : 0.7}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="40;0"
                    dur={isDirectlySevered ? '1s' : '2.5s'}
                    repeatCount="indefinite"
                  />
                </line>

                {/* Edge Protocol Tag */}
                {edge.label && (
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 4}
                    fill={isDirectlySevered ? '#fca5a5' : '#64748b'}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Topology Nodes */}
          {filteredNodes.map((node) => {
            const isTarget = node.id === targetNodeId;
            const isDirect = directImpactIds.includes(node.id);
            const isIndirect = indirectImpactIds.includes(node.id);
            const isSafe = !isTarget && !isDirect && !isIndirect;

            let filterStyle = 'url(#glow-cyan-node)';
            let borderColor = '#00F0FF';
            let bgColor = '#0B132B';
            let textColor = '#E2E8F0';

            if (isTarget) {
              filterStyle = 'url(#glow-red-node)';
              borderColor = '#FF2E4D';
              bgColor = '#3B0A12';
              textColor = '#FFA4B2';
            } else if (isDirect) {
              filterStyle = 'url(#glow-red-node)';
              borderColor = '#FF2E4D';
              bgColor = '#2D0A10';
              textColor = '#FFA4B2';
            } else if (isIndirect) {
              filterStyle = 'url(#glow-amber-node)';
              borderColor = '#FFB300';
              bgColor = '#291C05';
              textColor = '#FDE68A';
            }

            const IconComponent = getNodeIcon(node.type);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => {
                  soundManager.playClick();
                  onSelectNode(node);
                }}
                onMouseEnter={() => {
                  soundManager.playBlip(720);
                  setHoveredNode(node);
                }}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer Glow Halo for impacted nodes */}
                {(isTarget || isDirect) && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#FF2E4D"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ transformOrigin: '0 0' }}
                  />
                )}

                {isIndirect && (
                  <circle
                    r="30"
                    fill="none"
                    stroke="#FFB300"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  />
                )}

                {/* Main Node Card Pill */}
                <rect
                  x="-75"
                  y="-22"
                  width="150"
                  height="44"
                  rx="10"
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={isTarget || isDirect ? '2' : '1.2'}
                  filter={filterStyle}
                  className="transition-all duration-300"
                />

                {/* Node Type Indicator Icon Circle */}
                <circle
                  cx="-52"
                  cy="0"
                  r="13"
                  fill={isTarget || isDirect ? '#FF2E4D' : isIndirect ? '#FFB300' : '#1A8CFF'}
                  fillOpacity={0.25}
                />

                {/* Render Icon via foreignObject for clean React Lucide icon embedding */}
                <foreignObject x="-61" y="-9" width="18" height="18">
                  <div className="flex items-center justify-center w-full h-full text-white">
                    <IconComponent className={`w-3.5 h-3.5 ${
                      isTarget || isDirect ? 'text-rose-400' : isIndirect ? 'text-amber-300' : 'text-cyan-300'
                    }`} />
                  </div>
                </foreignObject>

                {/* Node Label Text */}
                <text
                  x="-32"
                  y="-3"
                  fill={textColor}
                  fontSize="10.5"
                  fontFamily="Geist, sans-serif"
                  fontWeight="600"
                  className="select-none"
                >
                  {node.name.length > 17 ? node.name.slice(0, 16) + '…' : node.name}
                </text>

                {/* Secondary Meta (Type & Tier / TPS) */}
                <text
                  x="-32"
                  y="12"
                  fill={isDirect ? '#f87171' : isIndirect ? '#fbbf24' : '#94a3b8'}
                  fontSize="8.5"
                  fontFamily="JetBrains Mono"
                  className="select-none"
                >
                  {node.type} • {isDirect ? 'FAILING' : isIndirect ? 'DEGRADED' : `${node.tps} TPS`}
                </text>

                {/* Status Indicator Dot at right corner */}
                <circle
                  cx="62"
                  cy="0"
                  r="4"
                  fill={isTarget || isDirect ? '#FF2E4D' : isIndirect ? '#FFB300' : '#00E676'}
                  className={isTarget || isDirect ? 'animate-ping' : ''}
                />
                <circle
                  cx="62"
                  cy="0"
                  r="3.5"
                  fill={isTarget || isDirect ? '#FF2E4D' : isIndirect ? '#FFB300' : '#00E676'}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Inspector Tooltip Floating Panel */}
        {hoveredNode && (
          <div 
            className="absolute top-16 right-4 z-30 w-80 bg-slate-950/95 backdrop-blur-xl p-4 rounded-xl border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in-95 pointer-events-none"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  directImpactIds.includes(hoveredNode.id)
                    ? 'bg-rose-500 shadow-[0_0_8px_#ff2e4d]'
                    : indirectImpactIds.includes(hoveredNode.id)
                    ? 'bg-amber-400 shadow-[0_0_8px_#ffb300]'
                    : 'bg-emerald-400'
                }`} />
                <span className="text-xs font-mono font-bold text-slate-100">{hoveredNode.name}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {hoveredNode.tier}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Resource Type:</span>
                <span className="text-slate-200">{hoveredNode.type}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Region / Zone:</span>
                <span className="text-cyan-300">{hoveredNode.region}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Throughput:</span>
                <span className="text-slate-200">{hoveredNode.tps?.toLocaleString()} TPS</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>P99 Latency:</span>
                <span className="text-slate-200">{hoveredNode.latencyMs} ms</span>
              </div>

              {/* Impact explanation */}
              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>Sentinel Blast Analysis:</span>
                </div>
                {directImpactIds.includes(hoveredNode.id) ? (
                  <p className="text-[11px] leading-tight text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-800/50">
                    CRITICAL: Direct dependency on target resource. Physical network route severance causes immediate TCP connection drop.
                  </p>
                ) : indirectImpactIds.includes(hoveredNode.id) ? (
                  <p className="text-[11px] leading-tight text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/50">
                    DEGRADED: Cascading downstream dependency. Queue backpressure and retries will degrade P99 latency above 4,000ms.
                  </p>
                ) : (
                  <p className="text-[11px] leading-tight text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-800/50">
                    ISOLATED & STABLE: Independent VPC path. Redundant Multi-AZ quorum remains active.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
