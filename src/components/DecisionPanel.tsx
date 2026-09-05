import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Wrench, 
  Lock, 
  KeyRound, 
  Download, 
  Copy, 
  Check, 
  Share2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scenario, VerdictType } from '../types';
import { soundManager } from '../utils/audio';

interface DecisionPanelProps {
  scenario: Scenario;
  onResetInvestigation: () => void;
  onOpenRemediationModal: () => void;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  scenario,
  onResetInvestigation,
  onOpenRemediationModal
}) => {
  const [copiedAudit, setCopiedAudit] = useState(false);
  const [overrideRequested, setOverrideRequested] = useState(false);

  const verdict = scenario.verdict;

  const handleCopyAudit = () => {
    soundManager.playClick();
    const auditText = `SENTINEL AI AUDIT PROOF\nTimestamp: ${new Date().toISOString()}\nVerdict: ${verdict}\nTarget: ${scenario.targetResourceId}\nBlast Radius Score: ${scenario.blastRadiusScore}/10\nDirectly Affected: ${scenario.directlyAffectedCount}\nIndirect Components: ${scenario.indirectlyAffectedCount}\nCritical Dependency: ${scenario.criticalDependency}\nPolicy Violations: ${scenario.policyViolations.map(p => p.rule).join(', ')}`;
    navigator.clipboard.writeText(auditText);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
  };

  const handleRequestOverride = () => {
    soundManager.playClick();
    setOverrideRequested(true);
    setTimeout(() => {
      alert('Dual-Key Override Request dispatched to PagerDuty On-Call and SecOps Architect (Lead: @alex.chen). Awaiting second cryptographic key.');
    }, 200);
  };

  return (
    <div className="w-full space-y-6">
      {/* Dramatic Decision Card */}
      <div className={`relative rounded-3xl p-8 border-2 backdrop-blur-2xl transition-all duration-500 overflow-hidden shadow-2xl ${
        verdict === 'BLOCK'
          ? 'bg-gradient-to-br from-rose-950/80 via-slate-950 to-slate-950 border-rose-500 shadow-glow-red'
          : verdict === 'REVIEW'
          ? 'bg-gradient-to-br from-amber-950/70 via-slate-950 to-slate-950 border-amber-500 shadow-glow-amber'
          : 'bg-gradient-to-br from-emerald-950/70 via-slate-950 to-slate-950 border-emerald-500 shadow-glow-green'
      }`}>
        {/* Ambient Top Glow Line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          verdict === 'BLOCK' 
            ? 'bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600' 
            : verdict === 'REVIEW'
            ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600'
            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-2xl ${
              verdict === 'BLOCK'
                ? 'bg-rose-900/60 border-rose-400 text-rose-300 animate-pulse'
                : verdict === 'REVIEW'
                ? 'bg-amber-900/60 border-amber-400 text-amber-300'
                : 'bg-emerald-900/60 border-emerald-400 text-emerald-300'
            }`}>
              {verdict === 'BLOCK' && <ShieldAlert className="w-9 h-9" />}
              {verdict === 'REVIEW' && <AlertTriangle className="w-9 h-9" />}
              {verdict === 'APPROVE' && <ShieldCheck className="w-9 h-9" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded uppercase ${
                  verdict === 'BLOCK'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : verdict === 'REVIEW'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  AUTONOMOUS VERDICT
                </span>
                <span className="text-xs font-mono text-slate-500">
                  DECISION ENGINE HASH: #8f921-prod
                </span>
              </div>

              <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mt-1 ${
                verdict === 'BLOCK'
                  ? 'text-rose-400 glow-text-red'
                  : verdict === 'REVIEW'
                  ? 'text-amber-300 glow-text-amber'
                  : 'text-emerald-400'
              }`}>
                {verdict === 'BLOCK' && 'BLOCK CHANGE'}
                {verdict === 'REVIEW' && 'REVIEW REQUIRED'}
                {verdict === 'APPROVE' && 'APPROVE DEPLOYMENT'}
              </h2>

              <p className="text-sm text-slate-300 font-mono mt-1 max-w-2xl leading-relaxed">
                {scenario.verdictSubtitle}
              </p>
            </div>
          </div>

          {/* Large Risk Badge */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center min-w-[200px]">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              RISK SCORE
            </div>
            <div className={`text-4xl font-extrabold font-mono mt-1 ${
              verdict === 'BLOCK' ? 'text-rose-400' : verdict === 'REVIEW' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {scenario.riskLevel}
            </div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">
              Score: {scenario.blastRadiusScore} / 10.0
            </div>
          </div>
        </div>

        {/* 5 Core Metrics Display specified in prompt */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400">Directly Affected Services</div>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
              {scenario.directlyAffectedCount} Services
            </div>
            <div className="text-[11px] font-mono text-rose-400 mt-0.5">
              Immediate connection drop
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400">Indirect Components</div>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
              {scenario.indirectlyAffectedCount} Components
            </div>
            <div className="text-[11px] font-mono text-amber-400 mt-0.5">
              Degraded queue & retries
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400">Critical Dependency</div>
            <div className="text-base font-bold font-mono text-cyan-300 mt-1 truncate">
              {scenario.criticalDependency}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Tier-0 Gateway Core
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400">Policy Violations</div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {scenario.policyViolations.length} Violations
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Requires senior sign-off
            </div>
          </div>
        </div>

        {/* Policy Violations Callout List */}
        {scenario.policyViolations.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-rose-950/30 border border-rose-900/60">
            <div className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Mandatory Policy Violations Detected:</span>
            </div>
            <div className="space-y-2">
              {scenario.policyViolations.map((v) => (
                <div key={v.id} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                  <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold text-[10px]">
                    {v.framework}
                  </span>
                  <div>
                    <strong className="text-slate-100">{v.rule}:</strong> {v.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dramatic Action Toolbar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Remediation Patch Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenRemediationModal();
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm flex items-center gap-2 hover:shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>Generate Safe Terraform Patch</span>
            </button>

            {/* Dual-Key Override */}
            {verdict === 'BLOCK' && (
              <button
                onClick={handleRequestOverride}
                disabled={overrideRequested}
                className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono flex items-center gap-2 hover:border-slate-500 transition-colors"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>{overrideRequested ? 'Dual-Key Dispatched...' : 'Request Dual-Key Override'}</span>
              </button>
            )}

            {/* Copy Audit Hash */}
            <button
              onClick={handleCopyAudit}
              className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono flex items-center gap-2 hover:border-slate-500 transition-colors"
            >
              {copiedAudit ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAudit ? 'Proof Copied!' : 'Copy Audit Proof'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onResetInvestigation();
            }}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors underline underline-offset-4"
          >
            <span>Simulate Another Change Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
