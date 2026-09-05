import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Copy, 
  Check, 
  ShieldCheck, 
  Code2, 
  ArrowRight, 
  Sparkles,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scenario } from '../types';
import { soundManager } from '../utils/audio';

interface RemediationModalProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess: () => void;
}

export const RemediationModal: React.FC<RemediationModalProps> = ({
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
      soundManager.playSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onApplySuccess();
        onClose();
      }, 1600);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-slate-950 border border-cyan-500/40 p-6 shadow-2xl relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100 font-sans">
                  Autonomous Remediation Patch
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  SAFE MIGRATION
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Target: {scenario.targetResourceId} • Eliminates single-point-of-failure before teardown
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

        {/* Patch Strategy Explanation */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sentinel Strategy:</span>
          </div>
          <p>
            1. Associates Ingress Route Table with Subnet-08 (us-east-1b) to preserve 14,200 RPS.
          </p>
          <p>
            2. Enables ElastiCache Multi-AZ Automatic Failover before decommissioning Subnet-07.
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
          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-60">
            <code>{scenario.safeRemediationTerraform}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Downtime Verified</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={applying || applied}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-mono font-bold text-xs shadow-glow-green flex items-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {applying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Applying Pre-Drain Route...</span>
                </>
              ) : applied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Patch Applied & Verified!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Apply Safe Patch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
