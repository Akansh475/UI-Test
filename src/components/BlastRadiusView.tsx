import React, { useState } from 'react';
import { 
  AlertOctagon, 
  TrendingDown, 
  DollarSign, 
  ShieldAlert, 
  FileWarning, 
  Zap, 
  Flame, 
  Info,
  Server,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Scenario, TopologyNode } from '../types';
import { soundManager } from '../utils/audio';

interface BlastRadiusViewProps {
  scenario: Scenario;
  nodes: TopologyNode[];
  onSelectNode: (node: TopologyNode) => void;
}

export const BlastRadiusView: React.FC<BlastRadiusViewProps> = ({
  scenario,
  nodes,
  onSelectNode
}) => {
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  const directNodes = nodes.filter(n => scenario.directImpactNodeIds.includes(n.id));
  const indirectNodes = nodes.filter(n => scenario.indirectImpactNodeIds.includes(n.id));
  const safeNodes = nodes.filter(
    n => !scenario.directImpactNodeIds.includes(n.id) && !scenario.indirectImpactNodeIds.includes(n.id)
  );

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-rose-400 uppercase">
              BLAST RADIUS TELEMETRY
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 tracking-tight mt-0.5">
            Cascade Propagation & Perimeter Risk
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Concentric isolation analysis: Target {scenario.targetResourceId} • Overall Threat Score: {scenario.blastRadiusScore}/10
          </p>
        </div>

        {/* Live Severity Badge */}
        <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-500/50 px-4 py-2 rounded-xl shadow-glow-red">
          <AlertOctagon className="w-5 h-5 text-rose-400 animate-bounce" />
          <div>
            <div className="text-[10px] font-mono text-rose-300 font-semibold uppercase">SEVERITY LEVEL</div>
            <div className="text-sm font-bold text-rose-200 font-mono">{scenario.riskLevel} CATASTROPHIC</div>
          </div>
        </div>
      </div>

      {/* 5 Core Telemetry KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Direct Impact */}
        <div className="bg-slate-900/80 border border-rose-500/40 rounded-xl p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-mono font-semibold">DIRECT IMPACT</span>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {scenario.directlyAffectedCount}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Tier-0 Physical ENIs</div>
        </div>

        {/* Indirect Impact */}
        <div className="bg-slate-900/80 border border-amber-500/40 rounded-xl p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-mono font-semibold">INDIRECT IMPACT</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {scenario.indirectlyAffectedCount}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Cascading Services</div>
        </div>

        {/* Revenue At Risk */}
        <div className="bg-slate-900/80 border border-rose-500/40 rounded-xl p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-mono font-semibold">REVENUE AT RISK</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300">
            ${(scenario.revenueAtRiskPerMin).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Per Minute Offline</div>
        </div>

        {/* Impacted Ingress RPS */}
        <div className="bg-slate-900/80 border border-cyan-500/40 rounded-xl p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <span className="text-[11px] font-mono font-semibold">IMPACTED TPS</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {(scenario.impactedTps).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Active Client Req/s</div>
        </div>

        {/* Policy Violations */}
        <div className="bg-slate-900/80 border border-rose-500/40 rounded-xl p-3.5 backdrop-blur-md col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-mono font-semibold">HARD VIOLATIONS</span>
            <FileWarning className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {scenario.policyViolations.length}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">PCI-DSS & SOC2 Gates</div>
        </div>
      </div>

      {/* Main Visualization Grid: Concentric Blast Wave Rings & Infrastructure Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Concentric Radar Blast Waveform Rings (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl relative flex flex-col items-center justify-center overflow-hidden min-h-[380px]">
          <div className="absolute top-4 left-4 z-10">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase">
              WAVEFRONT PROPAGATION RADAR
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Ground Zero &rarr; Tier-0 Direct &rarr; Indirect Mesh
            </div>
          </div>

          {/* Concentric SVG Rings */}
          <div className="relative w-72 h-72 flex items-center justify-center mt-4">
            {/* Outermost Perimeter Ring (Safe) */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed animate-spin" style={{ animationDuration: '60s' }} />
            
            {/* Cascading Ring (Amber) */}
            <div className="absolute inset-6 rounded-full border-2 border-amber-500/40 border-dashed animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
            
            {/* Direct Blast Ring (Crimson) */}
            <div className="absolute inset-14 rounded-full border-2 border-rose-500/60 bg-rose-950/20 animate-pulse shadow-glow-red" />

            {/* Radar Scanline Sweep */}
            <div className="absolute inset-0 rounded-full radar-gradient animate-radar-sweep pointer-events-none opacity-40" />

            {/* Center: Ground Zero Nucleus */}
            <div 
              className="relative z-10 w-16 h-16 rounded-full bg-rose-600/90 border-2 border-rose-300 flex flex-col items-center justify-center text-center p-1 shadow-glow-red cursor-pointer hover:scale-110 transition-transform"
              title="Target Resource: subnet-07"
              onClick={() => {
                const n = nodes.find(x => x.id === scenario.targetResourceId);
                if (n) onSelectNode(n);
              }}
            >
              <Flame className="w-5 h-5 text-white animate-bounce" />
              <span className="text-[9px] font-mono font-bold text-white uppercase leading-none mt-0.5">
                TARGET
              </span>
            </div>

            {/* Direct Impact Satellite Badges */}
            <div className="absolute top-7 left-12 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500 text-[10px] font-mono text-rose-300 font-bold shadow-sm">
              API-GW
            </div>
            <div className="absolute bottom-10 right-8 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500 text-[10px] font-mono text-rose-300 font-bold shadow-sm">
              CHECKOUT
            </div>
            <div className="absolute top-12 right-12 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500 text-[10px] font-mono text-rose-300 font-bold shadow-sm">
              NAT-GW
            </div>

            {/* Indirect Cascading Badges */}
            <div className="absolute top-1 left-24 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/80 text-[10px] font-mono text-amber-300 font-semibold shadow-sm">
              AURORA-PG
            </div>
            <div className="absolute bottom-3 left-16 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/80 text-[10px] font-mono text-amber-300 font-semibold shadow-sm">
              SQS-QUEUE
            </div>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
            <span className="text-rose-400 font-bold">18 Systems Bound</span> • Failure Propagation Speed: <span className="text-cyan-300">240ms</span>
          </div>
        </div>

        {/* Right: Infrastructure Impact Heatmap & Component Drilldown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase">
                INFRASTRUCTURE COMPONENT HEATMAP
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Hover component to trace failure rationale
              </span>
            </div>

            {/* Heatmap Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {nodes.map((node) => {
                const isTarget = node.id === scenario.targetResourceId;
                const isDirect = scenario.directImpactNodeIds.includes(node.id);
                const isIndirect = scenario.indirectImpactNodeIds.includes(node.id);

                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectNode(node);
                    }}
                    onMouseEnter={() => {
                      soundManager.playBlip(600);
                      setHoveredEntity(node.id);
                    }}
                    onMouseLeave={() => setHoveredEntity(null)}
                    className={`text-left p-2.5 rounded-xl border transition-all ${
                      isTarget
                        ? 'bg-rose-950/70 border-rose-500 shadow-glow-red'
                        : isDirect
                        ? 'bg-rose-950/40 border-rose-600/60 hover:border-rose-400'
                        : isIndirect
                        ? 'bg-amber-950/40 border-amber-600/50 hover:border-amber-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-2 h-2 rounded-full ${
                        isTarget || isDirect ? 'bg-rose-500 animate-ping' : isIndirect ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />
                      <span className="text-[9px] font-mono text-slate-500">{node.tier}</span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-200 mt-1 truncate">
                      {node.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      {node.type}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Hover / Root Cause Banner */}
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Root Cause Diagnosis:</span>
            </div>
            {hoveredEntity ? (
              (() => {
                const hn = nodes.find(n => n.id === hoveredEntity);
                if (!hn) return null;
                const isDir = scenario.directImpactNodeIds.includes(hn.id);
                const isInd = scenario.indirectImpactNodeIds.includes(hn.id);

                return (
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-cyan-300">{hn.name}</strong> ({hn.type}):{' '}
                    {isDir 
                      ? 'DIRECT CASUALTY. Physically attached to subnet-07. Dropping subnet destroys route table bindings and abruptly aborts 14,200 requests/sec.'
                      : isInd
                      ? 'INDIRECT CASUALTY. Upstream caller collapses, creating catastrophic queue backlog and timeout cascades.'
                      : 'ISOLATED & UNAFFECTED. Dedicated private VPC CIDR block in us-east-1b/c.'}
                  </p>
                );
              })()
            ) : (
              <p className="text-slate-500 italic">
                Hover over any component above to inspect why it fails or stays resilient.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
