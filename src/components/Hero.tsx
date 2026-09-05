import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Command,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { Scenario } from '../types';

interface HeroProps {
  currentCommand: string;
  onChangeCommand: (cmd: string) => void;
  onAnalyze: (command: string) => void;
  isInvestigating: boolean;
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCommand,
  onChangeCommand,
  onAnalyze,
  isInvestigating,
  scenarios,
  onSelectScenario
}) => {
  const [inputValue, setInputValue] = useState(currentCommand);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isInvestigating) return;
    soundManager.playSonar();
    onAnalyze(inputValue);
  };

  const handleQuickSelect = (scenario: Scenario) => {
    soundManager.playClick();
    setInputValue(scenario.command);
    onChangeCommand(scenario.command);
    onSelectScenario(scenario);
  };

  return (
    <div className="relative z-10 pt-20 pb-12 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
      {/* Sentinel Autonomous Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-glow-cyan text-xs font-mono text-cyan-300 mb-6 backdrop-blur-md animate-float-slow">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-semibold tracking-wider">SENTINEL AI v4.2 • INFRASTRUCTURE BLAST RADIUS AGENT</span>
      </div>

      {/* Large Bold Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08]">
        Before you change production,{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-rose-400 bg-clip-text text-transparent">
          know what will break.
        </span>
      </h1>

      {/* Subheadline */}
      <p className="mt-5 text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
        AI-powered blast-radius analysis for cloud infrastructure changes. Intercepts Terraform, OpenTofu, and AWS CLI plans to prevent multi-million dollar outages.
      </p>

      {/* Interactive Command Center Input Box */}
      <div className="w-full max-w-3xl mt-8">
        <form 
          onSubmit={handleSubmit}
          className="relative group rounded-2xl bg-slate-950/80 border-2 border-cyan-500/40 p-2 shadow-2xl backdrop-blur-2xl transition-all focus-within:border-cyan-400 focus-within:shadow-glow-cyan"
        >
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              <Terminal className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                onChangeCommand(e.target.value);
              }}
              placeholder="e.g. Delete subnet-07, Modify RDS security group..."
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 font-mono text-base focus:outline-none"
              disabled={isInvestigating}
            />

            {/* Magnetic Analyze CTA Button */}
            <button
              type="submit"
              disabled={isInvestigating || !inputValue.trim()}
              className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold font-mono text-sm tracking-wide shadow-glow-cyan flex items-center gap-2 hover:opacity-95 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{isInvestigating ? 'ANALYZING...' : 'ANALYZE'}</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Scenarios Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <span className="text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Preset Demos:</span>
          </span>

          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleQuickSelect(sc)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                inputValue === sc.command
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {sc.riskLevel === 'CRITICAL' && <Flame className="w-3 h-3 text-rose-400" />}
              {sc.riskLevel === 'HIGH' && <ShieldAlert className="w-3 h-3 text-amber-400" />}
              {sc.riskLevel === 'LOW' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>{sc.command}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Trust Telemetry Strip */}
      <div className="mt-12 w-full pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
        <div>
          <div className="text-xl font-bold text-slate-100">84,219</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cloud Nodes Mapped</div>
        </div>
        <div>
          <div className="text-xl font-bold text-cyan-400">100%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Deterministic Causal DAG</div>
        </div>
        <div>
          <div className="text-xl font-bold text-emerald-400">0 ms</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Unplanned Outages</div>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-100">PCI / SOC2</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hard Policy Guardrails</div>
        </div>
      </div>
    </div>
  );
};
