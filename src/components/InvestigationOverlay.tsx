import React from 'react';
import { 
  Network, 
  Compass, 
  ShieldAlert, 
  TrendingDown, 
  FileCheck, 
  Cpu, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Activity,
  Zap
} from 'lucide-react';
import { AgentInfo } from '../types';

interface InvestigationOverlayProps {
  investigationPhase: 'idle' | 'swarming' | 'propagating' | 'verdict';
  currentCommand: string;
  elapsedMs: number;
  propagationWave: number;
  agents: AgentInfo[];
  onCancel?: () => void;
}

const getAgentIcon = (iconName: string) => {
  switch (iconName) {
    case 'Network': return Network;
    case 'Compass': return Compass;
    case 'ShieldAlert': return ShieldAlert;
    case 'TrendingDown': return TrendingDown;
    case 'FileCheck': return FileCheck;
    case 'Cpu': return Cpu;
    default: return Cpu;
  }
};

export const InvestigationOverlay: React.FC<InvestigationOverlayProps> = ({
  investigationPhase,
  currentCommand,
  elapsedMs,
  propagationWave,
  agents,
  onCancel
}) => {
  if (investigationPhase === 'idle') return null;

  const seconds = (elapsedMs / 1000).toFixed(2);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 select-none">
      {/* Top Floating Sleek Mission Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto bg-slate-950/60 backdrop-blur-3xl px-5 py-3 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-4 duration-500 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
          </span>
          <div className="font-mono text-xs">
            <span className="text-slate-400">ANALYZING INTENT: </span>
            <span className="text-white font-bold tracking-wide">{currentCommand}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300">WAVEFRONT: {Math.round(propagationWave)}%</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="text-slate-300">
            T+{seconds}s
          </div>
        </div>
      </div>

      {/* Floating 6 Specialist Agent Satellites (Subtle HUD along bottom/sides) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-6xl mx-auto w-full pointer-events-auto pb-4">
        {agents.map((agent) => {
          const Icon = getAgentIcon(agent.iconName);
          const isWarning = agent.status === 'warning';
          const isWorking = agent.status === 'scanning' || agent.status === 'analyzing';

          return (
            <div
              key={agent.id}
              className={`p-3 rounded-2xl backdrop-blur-2xl border transition-all duration-500 shadow-xl ${
                isWarning
                  ? 'bg-rose-950/50 border-rose-500/60 shadow-[0_0_25px_rgba(255,46,77,0.3)]'
                  : isWorking
                  ? 'bg-slate-900/60 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-950/40 border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1 rounded-lg ${
                  isWarning ? 'text-rose-400 bg-rose-950' : 'text-cyan-400 bg-cyan-950'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {isWarning ? (
                  <span className="text-[9px] font-mono font-bold text-rose-400 flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    BREACH
                  </span>
                ) : isWorking ? (
                  <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                )}
              </div>

              <div className="text-[11px] font-mono font-bold text-white truncate">
                {agent.name}
              </div>
              <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                {agent.currentFinding || agent.role}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
