import React, { useState } from 'react';
import { X, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scenario } from '../types';
import { soundManager } from '../utils/audio';

interface MinimalPatchModalProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess: () => void;
}

export const MinimalPatchModal: React.FC<MinimalPatchModalProps> = ({
  scenario,
  isOpen,
  onClose,
  onApplySuccess
}) => {
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);

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
      soundManager.playResolve();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onApplySuccess();
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-3xl bg-[#09090B] border border-white/10 p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white tracking-tight">
              Safe Migration Patch
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Re-routes ingress traffic before decommissioning subnet-07.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Code Snippet */}
        <div className="relative">
          <pre className="p-4 rounded-2xl bg-black border border-white/5 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-56">
            <code>{scenario.safeRemediationTerraform}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-1 bg-zinc-900/90 px-2 py-1 rounded-md border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Dismiss
          </button>
          <button
            onClick={handleApply}
            disabled={applying}
            className="px-5 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {applying ? 'Applying safe routing...' : 'Apply zero-downtime routing'}
          </button>
        </div>
      </div>
    </div>
  );
};
