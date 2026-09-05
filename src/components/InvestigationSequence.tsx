import React, { useState } from 'react';
import { 
  Network, 
  Compass, 
  ShieldAlert, 
  TrendingDown, 
  FileCheck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Sparkles,
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';
import { AgentInfo, AgentStatus, ReasoningStep } from '../types';
import { soundManager } from '../utils/audio';

interface InvestigationSequenceProps {
  agents: AgentInfo[];
  currentStep: number; // 0: Idle, 1: Change Submitted, 2: Supervisor Active, 3: Agents Running, 4: Complete
  elapsedMs: number;
  reasoningSteps: ReasoningStep[];
  onSelectAgent?: (agentId: string) => void;
}

const getAgentIcon = (iconName: string) => {
  switch (iconName) {
    case 'Network':
      return Network;
    case 'Compass':
      return Compass;
    case 'ShieldAlert':
      return ShieldAlert;
    case 'TrendingDown':
      return TrendingDown;
    case 'FileCheck':
      return FileCheck;
    case 'Cpu':
      return Cpu;
    default:
      return Cpu;
  }
};

const getStatusBadge = (status: AgentStatus) => {
  switch (status) {
    case 'scanning':
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
          <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
          SCANNING
        </span>
      );
    case 'analyzing':
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300">
          <Activity className="w-3 h-3 animate-pulse text-amber-400" />
          ANALYZING
        </span>
      );
    case 'warning':
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold animate-pulse">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          WARNING
        </span>
      );
    case 'complete':
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          COMPLETE
        </span>
      );
    default:
      return (
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          STANDBY
        </span>
      );
  }
};

export const InvestigationSequence: React.FC<InvestigationSequenceProps> = ({
  agents,
  currentStep,
  elapsedMs,
  reasoningSteps,
  onSelectAgent
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const formattedTime = (elapsedMs / 1000).toFixed(2);

  return (
    <div className="w-full space-y-6">
      {/* Supervisor Agent Orchestration Banner */}
      <div className="relative rounded-2xl p-5 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-[#0B1220]/95 border border-cyan-500/30 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Animated ambient glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shadow-glow-cyan">
              <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  SUPERVISOR AGENT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  AUTONOMOUS THREAD #849
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                {currentStep < 2 
                  ? 'Ready to intercept infrastructure changes' 
                  : currentStep < 4 
                  ? 'Orchestrating 6 Specialist Agents across AWS topology DAG...' 
                  : 'Multi-Agent Investigation Complete • Consensus Formed'}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Monitoring 3 Availability Zones • 18 Topology Entities • 14,200 Ingress RPS • Dual-Key Policy
              </p>
            </div>
          </div>

          {/* Real-time telemetry counters */}
          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Investigation Time</div>
              <div className="text-cyan-300 font-bold text-sm">00:{formattedTime.padStart(5, '0')}s</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Active Agents</div>
              <div className="text-slate-200 font-bold text-sm">
                {agents.filter(a => a.status !== 'idle').length} / 6
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Confidence Floor</div>
              <div className="text-emerald-400 font-bold text-sm">98.4%</div>
            </div>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-cyan-300 font-medium' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>1</span>
            <span>Change Submitted</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-cyan-300 font-medium' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>2</span>
            <span>Supervisor Dispatched</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-cyan-300 font-medium' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>3</span>
            <span>Specialist Agents Swarm</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-1.5 ${currentStep >= 4 ? 'text-rose-400 font-bold' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 4 ? 'bg-rose-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>4</span>
            <span>Final Verdict Enforced</span>
          </div>
        </div>
      </div>

      {/* 6 Specialist Live Processing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = getAgentIcon(agent.iconName);
          const isSelected = selectedAgentId === agent.id;
          const relevantReasoning = reasoningSteps.find(r => r.agent.toLowerCase().includes(agent.name.toLowerCase().split(' ')[0]));

          return (
            <div
              key={agent.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedAgentId(isSelected ? null : agent.id);
                onSelectAgent?.(agent.id);
              }}
              className={`relative rounded-xl p-4 transition-all duration-300 cursor-pointer border ${
                agent.status === 'warning'
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-glow-red hover:border-rose-400'
                  : agent.status === 'analyzing' || agent.status === 'scanning'
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-glow-cyan hover:border-cyan-400'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              } backdrop-blur-lg group`}
            >
              {/* Header: Icon, Name, Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    agent.status === 'warning'
                      ? 'bg-rose-900/40 text-rose-300 border border-rose-600/40'
                      : agent.status === 'complete'
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-600/40'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {agent.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">{agent.role}</span>
                  </div>
                </div>
                {getStatusBadge(agent.status)}
              </div>

              {/* Description */}
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
                {agent.description}
              </p>

              {/* Streaming Finding Ticker */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-500 mb-1">
                  <span>LIVE FINDINGS:</span>
                  <span className="text-cyan-300 font-semibold">{agent.confidence}% CONFIDENCE</span>
                </div>
                {agent.status !== 'idle' ? (
                  <div className={`p-2 rounded font-mono text-[11px] leading-tight flex items-start gap-1.5 ${
                    agent.status === 'warning'
                      ? 'bg-rose-950/50 text-rose-300 border border-rose-800/50'
                      : 'bg-slate-950/60 text-cyan-200 border border-slate-800'
                  }`}>
                    <Terminal className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-cyan-400" />
                    <span className="line-clamp-2">
                      {agent.currentFinding || relevantReasoning?.finding || 'Executing topology graph traversal...'}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded bg-slate-950/40 text-slate-600 italic">
                    Waiting for change manifest submission...
                  </div>
                )}
              </div>

              {/* Expanded details if card is clicked */}
              {isSelected && relevantReasoning && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs font-mono space-y-1.5 animate-in fade-in">
                  <div className="text-slate-400 text-[10px] uppercase">Evidence Log:</div>
                  <div className="text-slate-300 text-[11px]">{relevantReasoning.evidence}</div>
                  <div className="flex gap-1 flex-wrap pt-1">
                    {relevantReasoning.affectedResourceIds.map(rid => (
                      <span key={rid} className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded text-[10px]">
                        {rid}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
