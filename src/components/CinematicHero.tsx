import React, { useState } from 'react';
import { 
  Zap, 
  Terminal, 
  Sparkles, 
  Shield, 
  Volume2, 
  VolumeX, 
  Command,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Scenario } from '../types';
import { soundManager } from '../utils/audio';

interface CinematicHeroProps {
  currentCommand: string;
  onChangeCommand: (cmd: string) => void;
  onAnalyze: (cmd: string) => void;
  scenarios: Scenario[];
  onSelectScenario: (sc: Scenario) => void;
  investigationPhase: 'idle' | 'swarming' | 'propagating' | 'verdict';
  onOpenCommandPalette: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  currentCommand,
  onChangeCommand,
  onAnalyze,
  scenarios,
  onSelectScenario,
  investigationPhase,
  onOpenCommandPalette
}) => {
  const [inputValue, setInputValue] = useState(currentCommand);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || investigationPhase !== 'idle') return;
    soundManager.playCinematicImpact();
    onAnalyze(inputValue);
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const isVisible = investigationPhase === 'idle';

  return (
    <>
      {/* Top Floating Minimalist Status & Branding Pill */}
      <header className="fixed top-6 left-6 right-6 z-40 flex items-center justify-between pointer-events-none">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 pointer-events-auto bg-slate-950/40 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10 shadow-2xl">
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-widest text-xs font-mono text-white">SENTINEL</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              AGENTIC
            </span>
          </div>
        </div>

        {/* Right Floating Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Demo Trigger Button */}
          {investigationPhase === 'idle' && (
            <button
              onClick={() => {
                soundManager.playCinematicImpact();
                onSelectScenario(scenarios[0]);
              }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-mono backdrop-blur-2xl transition-all shadow-[0_0_20px_rgba(255,46,77,0.25)] hover:scale-105 active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Simulate "Delete subnet-07"</span>
            </button>
          )}

          {/* Cmd + K Command Palette */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCommandPalette();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-950/40 hover:bg-slate-900/60 backdrop-blur-2xl border border-white/10 text-slate-300 text-xs font-mono transition-colors"
          >
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Cmd+K</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-full bg-slate-950/40 hover:bg-slate-900/60 backdrop-blur-2xl border border-white/10 text-slate-300 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Hero Content Overlay (Extreme Whitespace & Apple Event Typography) */}
      <div 
        className={`fixed inset-0 z-20 flex flex-col items-center justify-center px-4 pointer-events-none transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl text-center space-y-6 pointer-events-auto">
          {/* Subtle Aura pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 backdrop-blur-xl shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="tracking-widest uppercase">LIVING INFRASTRUCTURE BLAST RADIUS AGENT</span>
          </div>

          {/* Massive Apple-Keynote Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[0.95] drop-shadow-2xl">
            BEFORE YOU TOUCH PRODUCTION,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-rose-400 bg-clip-text text-transparent">
              SEE WHAT BREAKS.
            </span>
          </h1>

          {/* Subheadline with extreme breathing room */}
          <p className="text-lg sm:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Autonomous multi-agent intelligence that models cascading cloud outages before code reaches deployment.
          </p>

          {/* Raycast-style Floating Command Bar */}
          <div className="w-full max-w-2xl mx-auto pt-4">
            <form 
              onSubmit={handleSubmit}
              className="relative group rounded-full bg-slate-950/70 border border-white/20 p-2 shadow-[0_20px_60px_-15px_rgba(0,240,255,0.25)] backdrop-blur-3xl transition-all focus-within:border-cyan-400 focus-within:shadow-[0_0_40px_rgba(0,240,255,0.4)]"
            >
              <div className="flex items-center gap-3 pl-4 pr-1">
                <Terminal className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    onChangeCommand(e.target.value);
                  }}
                  placeholder="e.g. Delete subnet-07, Revoke RDS ingress..."
                  className="w-full bg-transparent text-white placeholder-slate-500 font-mono text-base focus:outline-none tracking-wide"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold font-mono text-xs tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>ANALYZE</span>
                </button>
              </div>
            </form>

            {/* Minimalist Preset Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <span className="text-slate-500 text-[11px] uppercase tracking-wider">Presets:</span>
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    soundManager.playClick();
                    setInputValue(sc.command);
                    onChangeCommand(sc.command);
                    onSelectScenario(sc);
                  }}
                  className={`px-3 py-1 rounded-full border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                    inputValue === sc.command
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/30 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {sc.riskLevel === 'CRITICAL' && <Flame className="w-3 h-3 text-rose-400" />}
                  {sc.riskLevel === 'HIGH' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  {sc.riskLevel === 'LOW' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  <span>{sc.command}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
