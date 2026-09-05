import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ArrowRight, CornerDownLeft, Sparkles, Check } from 'lucide-react';
import { 
  DEMO_SCENARIOS, 
  INITIAL_TOPOLOGY_NODES, 
  TOPOLOGY_EDGES 
} from './data/scenarios';
import { Scenario, TopologyNode, TopologyEdge } from './types';
import { soundManager } from './utils/audio';

import { MinimalGraph } from './components/MinimalGraph';
import { MinimalPatchModal } from './components/MinimalPatchModal';

type AppState = 'idle' | 'analyzing' | 'decision';

export function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentScenario, setCurrentScenario] = useState<Scenario>(DEMO_SCENARIOS[0]);
  const [commandInput, setCommandInput] = useState(DEMO_SCENARIOS[0].command);
  const [waveProgress, setWaveProgress] = useState(0); // 0 to 100
  const [isPatchOpen, setIsPatchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    soundManager.init();
  }, []);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const handleStartAnalysis = (scenarioToRun: Scenario) => {
    if (appState === 'analyzing') return;

    setAppState('analyzing');
    setWaveProgress(0);
    soundManager.playCinematicImpact();

    // Smooth wave progress over 4.2 seconds
    const start = Date.now();
    const duration = 4200;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setWaveProgress(progress);

      if (progress >= 100) {
        clearInterval(timerRef.current!);
        setAppState('decision');
        if (scenarioToRun.verdict === 'BLOCK') {
          soundManager.playDramaticBlock();
        } else {
          soundManager.playResolve();
        }
      }
    }, 40);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const matched = DEMO_SCENARIOS.find(
      s => s.command.toLowerCase().trim() === commandInput.toLowerCase().trim()
    );

    const scenario = matched || {
      ...DEMO_SCENARIOS[0],
      command: commandInput,
      title: commandInput
    };

    setCurrentScenario(scenario);
    handleStartAnalysis(scenario);
  };

  const handleSelectPreset = (scenario: Scenario) => {
    soundManager.playClick();
    setCommandInput(scenario.command);
    setCurrentScenario(scenario);
    handleStartAnalysis(scenario);
  };

  const handleReset = () => {
    soundManager.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setAppState('idle');
    setWaveProgress(0);
  };

  const isImpacted = appState === 'decision' || (appState === 'analyzing' && waveProgress > 50);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-zinc-100 font-sans antialiased select-none">
      {/* 1. Monochromatic Living Infrastructure Graph (Primary Visual Centerpiece) */}
      <MinimalGraph
        nodes={INITIAL_TOPOLOGY_NODES}
        edges={TOPOLOGY_EDGES}
        targetNodeId={currentScenario.targetResourceId}
        directImpactIds={currentScenario.directImpactNodeIds}
        indirectImpactIds={currentScenario.indirectImpactNodeIds}
        isInvestigating={appState === 'analyzing'}
        isImpacted={isImpacted}
        waveProgress={waveProgress}
      />

      {/* 2. Quiet Minimalist Navigation Header */}
      <header className="fixed top-8 left-8 right-8 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-sm font-semibold tracking-tight text-white">Sentinel</span>
        </div>

        <button
          onClick={handleToggleSound}
          className="pointer-events-auto text-zinc-500 hover:text-white transition-colors p-2 rounded-full"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </header>

      {/* 3. Typography-First Interaction Layer (Maximum Whitespace & Editorial Clarity) */}
      <main className="relative z-30 w-full h-full flex flex-col justify-between px-8 sm:px-16 py-20 pointer-events-none">
        
        {/* Center Content Box */}
        <div className="my-auto max-w-2xl pointer-events-auto">
          
          {/* STATE 1: IDLE */}
          {appState === 'idle' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Massive Headline */}
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
                Before you deploy,{' '}
                <span className="text-zinc-500">know what breaks.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-zinc-400 font-normal leading-relaxed max-w-xl">
                Predict the blast radius of infrastructure changes before production.
              </p>

              {/* Minimal Linear/Raycast-Style Command Input */}
              <form onSubmit={handleSubmit} className="pt-2">
                <div className="flex items-center gap-3 p-2 pl-4 rounded-2xl bg-zinc-900/60 border border-white/10 max-w-lg backdrop-blur-2xl focus-glow-cyan transition-all">
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Enter change, e.g. Delete subnet-07"
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 px-4 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Analyze</span>
                    <CornerDownLeft className="w-3 h-3 text-zinc-600" />
                  </button>
                </div>
              </form>

              {/* Subtle Preset Links */}
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono pt-1">
                <span>Presets:</span>
                {DEMO_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectPreset(sc)}
                    className="hover:text-zinc-300 transition-colors underline underline-offset-4 decoration-zinc-700"
                  >
                    {sc.command}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STATE 2: ANALYZING */}
          {appState === 'analyzing' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Simulating Dependency Propagation</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Analyzing impact of <br />
                <span className="text-cyan-300 font-mono text-3xl sm:text-5xl">{currentScenario.command}</span>
              </h1>

              <p className="text-sm text-zinc-400 font-mono">
                Tracing VPC routes, ENIs, and downstream caller pools in us-east-1...
              </p>

              <button
                onClick={handleReset}
                className="text-xs text-zinc-500 hover:text-white transition-colors underline underline-offset-4 font-mono pt-2 block"
              >
                Cancel simulation
              </button>
            </div>
          )}

          {/* STATE 3: DECISION (Maximum Clarity, Zero Clutter) */}
          {appState === 'decision' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Devastatingly Clear Decision Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Block Deployment</span>
              </div>

              {/* Big Bold Headline Answering The One Question */}
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                {currentScenario.directlyAffectedCount} services <br />
                <span className="text-red-400">will fail.</span>
              </h1>

              {/* Calm, Intelligent Explanation */}
              <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-lg">
                Deleting <code className="text-white font-mono text-sm bg-zinc-900 px-1.5 py-0.5 rounded">subnet-07</code> severs physical ingress in us-east-1a, dropping 14,200 active payment requests with zero automated failover.
              </p>

              {/* Minimal Primary and Secondary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsPatchOpen(true);
                  }}
                  className="px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Generate safe migration patch</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-3 rounded-full text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Simulate another change
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Quiet Footer Note */}
        <div className="text-xs text-zinc-600 font-mono flex items-center justify-between">
          <span>Sentinel Blast Radius Intelligence</span>
          <span>Deterministic DAG Evaluation</span>
        </div>
      </main>

      {/* Safe Migration Patch Modal */}
      <MinimalPatchModal
        scenario={currentScenario}
        isOpen={isPatchOpen}
        onClose={() => setIsPatchOpen(false)}
        onApplySuccess={() => {
          handleReset();
        }}
      />
    </div>
  );
}

export default App;
