import React from 'react';
import { 
  X, 
  Activity, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { TopologyNode } from '../types';
import { soundManager } from '../utils/audio';

interface HolographicNodeHUDProps {
  node: TopologyNode | null;
  isDirectImpact: boolean;
  isIndirectImpact: boolean;
  onClose: () => void;
}

export const HolographicNodeHUD: React.FC<HolographicNodeHUDProps> = ({
  node,
  isDirectImpact,
  isIndirectImpact,
  onClose
}) => {
  if (!node) return null;

  return (
    <div className="fixed bottom-10 left-6 z-40 w-full max-w-sm pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`p-5 rounded-3xl backdrop-blur-3xl border shadow-2xl ${
        isDirectImpact 
          ? 'bg-rose-950/70 border-rose-500/50 shadow-[0_0_40px_rgba(255,46,77,0.35)]' 
          : isIndirectImpact 
          ? 'bg-amber-950/70 border-amber-500/50 shadow-[0_0_30px_rgba(255,179,0,0.3)]' 
          : 'bg-slate-950/70 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isDirectImpact 
                ? 'bg-rose-500 animate-ping' 
                : isIndirectImpact 
                ? 'bg-amber-400' 
                : 'bg-cyan-400'
            }`} />
            <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
              {node.type}
            </span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Name */}
        <div className="mt-3">
          <h4 className="text-base font-bold font-mono text-white tracking-tight">
            {node.name}
          </h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Zone: {node.region} • Tier: {node.tier}
          </p>
        </div>

        {/* Telemetry Chips */}
        <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase">Throughput</span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {(node.tps || 0).toLocaleString()} TPS
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase">P99 Latency</span>
            <div className="text-sm font-bold text-cyan-300 mt-0.5">
              {node.latencyMs} ms
            </div>
          </div>
        </div>

        {/* Impact Rationale */}
        <div className="mt-3 pt-3 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {isDirectImpact ? (
              <>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-300">DIRECT CASUALTY</span>
              </>
            ) : isIndirectImpact ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">CASCADING DEGRADATION</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">SHIELDED & RESILIENT</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {isDirectImpact
              ? 'Physically pinned to subnet-07. Dropping subnet collapses ENI routes and severs 14,200 incoming connections instantly.'
              : isIndirectImpact
              ? 'Upstream dependency failure triggers immediate connection pool starvation and timeout queues.'
              : 'Redundant Multi-AZ quorum ensures continuous traffic serving in secondary availability zones.'}
          </p>
        </div>
      </div>
    </div>
  );
};
