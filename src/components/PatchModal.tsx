import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Copy, 
  Check, 
  ShieldCheck, 
  Code2, 
  Sparkles,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scenario } from '../types';
import { soundManager } from '../utils/audio';

interface PatchModalProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess: () => void;
}

export const PatchModal: React.FC<PatchModalProps> = ({
  scenario,
  isOpen,
  onClose,
  onApplySuccess
}) => {
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(scenario.safeRemediationTerraform);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    soundManager.playClick();
    setApplying(true);

    setTimeout(() => {
      setApplying(false);
      setApplied(true);
      soundManager.playResolve();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onApplySuccess();
        onClose();
      }, 1600);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-3xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl rounded-3xl bg-slate-950 border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                Autonomous Zero-Downtime Migration Patch
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Target: {scenario.targetResourceId} • Eliminates Single Point of Failure
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Strategy Explanation */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Migration Sequence:</span>
          </div>
          <p>
            1. Pre-warms standby Ingress routes in Subnet-08 (us-east-1b) before physical decommission.
          </p>
          <p>
            2. Enables ElastiCache Multi-AZ Automatic Failover with active session replication.
          </p>
        </div>

        {/* Code View */}
        <div className="relative">
          <div className="flex items-center justify-between pb-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>remediation_safe_migration.tf</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-200 overflow-x-auto max-h-56 leading-relaxed">
            <code>{scenario.safeRemediationTerraform}</code>
          </pre>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Downtime Guarantee</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-full text-slate-400 hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={applying || applied}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] disabled:opacity-50"
            >
              {applying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Draining Traffic to Multi-AZ...</span>
                </>
              ) : applied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Patch Applied!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deploy Safe Failover</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
