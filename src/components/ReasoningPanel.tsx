import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Code2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  GitCommit,
  Layers
} from 'lucide-react';
import { ReasoningStep, Scenario, TopologyNode } from '../types';
import { soundManager } from '../utils/audio';

interface ReasoningPanelProps {
  scenario: Scenario;
  reasoningSteps: ReasoningStep[];
  nodes: TopologyNode[];
  onSelectNode: (node: TopologyNode) => void;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({
  scenario,
  reasoningSteps,
  nodes,
  onSelectNode
}) => {
  const [activeTab, setActiveTab] = useState<'reasoning' | 'terraform' | 'rego'>('reasoning');

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl shadow-2xl">
      {/* Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              AI CHAIN-OF-THOUGHT SYNTHESIS
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 tracking-tight mt-0.5">
            Architectural Evidence & Multi-Agent Deduction
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Deterministic causal graph evaluation across 18 dependencies • 0 hallucinations
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('reasoning');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'reasoning'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evidence Cards</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('terraform');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'terraform'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Terraform Plan Diff</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('rego');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'rego'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPA Rego Rules</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Connected Evidence Chain-of-Thought Cards */}
      {activeTab === 'reasoning' && (
        <div className="mt-6 space-y-4">
          <div className="relative pl-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-amber-500 before:to-rose-500">
            {reasoningSteps.map((step, idx) => {
              const isLast = idx === reasoningSteps.length - 1;

              return (
                <div 
                  key={step.id} 
                  className="relative mb-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all group"
                >
                  {/* Step Connector Marker */}
                  <span className={`absolute -left-[29px] top-4 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center ${
                    step.severity === 'critical' 
                      ? 'bg-rose-500 shadow-glow-red' 
                      : step.severity === 'warning' 
                      ? 'bg-amber-400 shadow-glow-amber' 
                      : 'bg-cyan-400 shadow-glow-cyan'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  </span>

                  {/* Header: Agent + Timestamp + Confidence */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {step.agent}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {step.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                      <span>{step.confidence}%</span>
                      <span className="text-[10px] text-slate-500 font-normal">Confidence</span>
                    </div>
                  </div>

                  {/* Finding statement */}
                  <h4 className="mt-2 text-sm font-semibold text-slate-100 flex items-center gap-2">
                    {step.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    )}
                    <span>{step.finding}</span>
                  </h4>

                  {/* Evidence text */}
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {step.evidence}
                  </p>

                  {/* Affected Resource Chips (clickable to highlight in topology) */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap text-xs font-mono">
                    <span className="text-[11px] text-slate-500 uppercase">Affected Entities:</span>
                    {step.affectedResourceIds.map(resId => {
                      const matchedNode = nodes.find(n => n.id === resId);
                      return (
                        <button
                          key={resId}
                          onClick={() => {
                            soundManager.playClick();
                            if (matchedNode) onSelectNode(matchedNode);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 transition-colors flex items-center gap-1"
                        >
                          <span>{resId}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-cyan-500" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Terraform Plan Diff */}
      {activeTab === 'terraform' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              <span>TERRAFORM EXECUTION PLAN: <code className="text-cyan-300">terraform plan -out=tfplan</code></span>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">1 TO DESTROY • 0 TO ADD</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed selection:bg-rose-500/30">
            <code>{scenario.terraformDiff}</code>
          </pre>
        </div>
      )}

      {/* Tab 3: Open Policy Agent (OPA) Rego Rules */}
      {activeTab === 'rego' && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
            <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>policy/blast_radius_governance.rego</span>
            </div>
            <pre className="text-slate-400">
{`package cloud.infrastructure.sentinel

default allow = false

# Rule: PCI-DSS 3.4.1 Production Multi-AZ Ingress Quorum
deny[msg] {
    input.resource_type == "aws_subnet"
    input.action == "delete"
    active_connections := input.metrics.active_connections
    active_connections > 0
    not input.has_multi_az_failover
    msg := sprintf("CRITICAL BLAST VIOLATION: Subnet %v has %v in-flight connections without secondary AZ failover route", [input.id, active_connections])
}

# Rule: Zero-Downtime Payment Gateway Constraint
deny[msg] {
    input.target_tier == "Tier-0"
    input.blast_radius_score > 5.0
    not input.approvals.has_dual_key_signoff
    msg := "BLAST EXCEEDED: Changes impacting Tier-0 checkout services must provide automated circuit breaker"
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
