import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Wrench, 
  KeyRound, 
  Eye, 
  Flame, 
  AlertOctagon, 
  Sparkles,
  ArrowRight,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Scenario } from '../types';
import { soundManager } from '../utils/audio';

interface BlockCinematicScreenProps {
  scenario: Scenario;
  isOpen: boolean;
  onOpenPatch: () => void;
  onInspectGraph: () => void;
  onReset: () => void;
}

export const BlockCinematicScreen: React.FC<BlockCinematicScreenProps> = ({
  scenario,
  isOpen,
  onOpenPatch,
  onInspectGraph,
  onReset
}) => {
  const [overrideSent, setOverrideSent] = useState(false);

  if (!isOpen) return null;

  const isBlock = scenario.verdict === 'BLOCK';

  const handleOverride = () => {
    soundManager.playClick();
    setOverrideSent(true);
    setTimeout(() => {
      alert('Dual-Key Override Request dispatched to On-Call Principal Architect (@alex.chen).');
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between p-6 sm:p-12 pointer-events-auto bg-black/85 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-700 overflow-y-auto">
      {/* Background Volumetric Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: isBlock 
            ? 'radial-gradient(circle at 50% 40%, rgba(255,46,77,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 40%, rgba(0,230,118,0.2) 0%, transparent 70%)'
        }}
      />

      {/* Top Floating Action Bar */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-400">
          <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
          <span>AUTONOMOUS CONSENSUS ENFORCED</span>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onInspectGraph();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs backdrop-blur-xl transition-all hover:scale-105"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Inspect Living Topology</span>
        </button>
      </div>

      {/* Central Monolithic Typographic Statement */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center my-auto py-8">
        <div className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-rose-400 font-bold mb-3">
          THREAT DETECTED BEFORE DEPLOYMENT
        </div>

        {/* Massive Headline */}
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-rose-200 via-rose-500 to-rose-700 drop-shadow-[0_0_50px_rgba(255,46,77,0.7)]">
          BLOCK CHANGE
        </h1>

        <p className="mt-4 text-base sm:text-xl font-mono text-rose-200/90 max-w-2xl mx-auto font-light leading-relaxed">
          {scenario.verdictSubtitle}
        </p>

        {/* Extreme Whitespace Floating Telemetry Triad */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] text-slate-400 uppercase">Impact Score</div>
            <div className="text-3xl font-bold text-rose-400 mt-1">{scenario.blastRadiusScore} / 10</div>
            <div className="text-[10px] text-rose-400/80 mt-0.5">Catastrophic Severance</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] text-slate-400 uppercase">Direct Casualties</div>
            <div className="text-3xl font-bold text-white mt-1">{scenario.directlyAffectedCount} Services</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Zero Failover AZ-a</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] text-slate-400 uppercase">Critical Dep</div>
            <div className="text-lg font-bold text-cyan-300 mt-2 truncate">Payment API</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tier-0 Checkout Lambda</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] text-slate-400 uppercase">Financial Risk</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">${(scenario.revenueAtRiskPerMin).toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Per Minute Outage</div>
          </div>
        </div>

        {/* Policy Breach Pill */}
        {scenario.policyViolations.length > 0 && (
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/60 border border-rose-500/40 text-xs font-mono text-rose-300">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>VIOLATION: PCI-DSS 3.4.1 & SOC2 CC6.1 Multi-AZ Quorum Breached</span>
          </div>
        )}
      </div>

      {/* Floating Action Pill Dock */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto w-full pt-4">
        {/* Auto Remediation Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenPatch();
          }}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-bold font-mono text-sm tracking-wider flex items-center gap-2.5 shadow-[0_0_40px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          <Wrench className="w-4 h-4 text-slate-950" />
          <span>AUTO-GENERATE SAFE TERRAFORM PATCH</span>
        </button>

        {/* Dual-Key Override */}
        <button
          onClick={handleOverride}
          disabled={overrideSent}
          className="px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-mono text-xs flex items-center gap-2 backdrop-blur-2xl transition-all"
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>{overrideSent ? 'Override Dispatched' : 'Request Dual-Key Override'}</span>
        </button>

        {/* Dismiss / Inspect Topology */}
        <button
          onClick={() => {
            soundManager.playClick();
            onInspectGraph();
          }}
          className="px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs transition-all"
        >
          <span>View Topology Mesh</span>
        </button>
      </div>
    </div>
  );
};
