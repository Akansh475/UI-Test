import React from 'react';
import { 
  X, 
  ExternalLink, 
  Activity, 
  Cpu, 
  Layers, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2,
  Copy,
  Server
} from 'lucide-react';
import { TopologyNode } from '../types';
import { soundManager } from '../utils/audio';

interface NodeDetailModalProps {
  node: TopologyNode | null;
  onClose: () => void;
  isDirectImpact: boolean;
  isIndirectImpact: boolean;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  isDirectImpact,
  isIndirectImpact
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-slate-950 border border-slate-700/80 p-6 shadow-2xl relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDirectImpact 
                ? 'bg-rose-950 border border-rose-500 text-rose-400' 
                : isIndirectImpact 
                ? 'bg-amber-950 border border-amber-500 text-amber-400' 
                : 'bg-cyan-950 border border-cyan-500 text-cyan-400'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100 font-mono">{node.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {node.tier}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Type: {node.type} • Zone: {node.region}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ARN Callout */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 truncate mr-2">{node.arn}</span>
          <button
            onClick={() => {
              soundManager.playClick();
              navigator.clipboard.writeText(node.arn);
            }}
            className="text-cyan-400 hover:text-cyan-300 flex-shrink-0"
            title="Copy ARN"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real-time Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Throughput</span>
            <div className="text-base font-bold text-slate-200 mt-1">
              {node.tps?.toLocaleString()} TPS
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">P99 Latency</span>
            <div className="text-base font-bold text-cyan-300 mt-1">
              {node.latencyMs} ms
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">CPU Utilization</span>
            <div className="text-base font-bold text-slate-200 mt-1">
              {node.cpuPercent}%
            </div>
          </div>
        </div>

        {/* Blast Status Explanation */}
        <div className="p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
          isDirectImpact 
            ? 'bg-rose-950/40 border-rose-700/60 text-rose-300' 
            : isIndirectImpact 
            ? 'bg-amber-950/40 border-amber-700/60 text-amber-300' 
            : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
        }">
          <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
            {isDirectImpact ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Sentinel Impact Status:</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {isDirectImpact
              ? 'DIRECT CASUALTY: The planned deletion severs the network interface bindings of this component. Service will fail with 502 Bad Gateway / TCP Timeout.'
              : isIndirectImpact
              ? 'INDIRECT DEGRADATION: Relies on upstream services located in the blast radius. Queues will fill, triggering retry storms and client timeouts.'
              : 'ISOLATED RESILIENT: Redundant architecture in separate Availability Zones shields this service from degradation.'}
          </p>
        </div>

        {/* Close button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
