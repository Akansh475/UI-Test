import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CornerDownLeft, 
  Wrench, 
  RotateCcw,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DEMO_SCENARIOS, 
  INITIAL_TOPOLOGY_NODES, 
  TOPOLOGY_EDGES 
} from './data/scenarios';
import { Scenario } from './types';
import { soundManager } from './utils/audio';
import { Cinematic3DWorld } from './components/Cinematic3DWorld';

export function App() {
  const [currentSection, setCurrentSection] = useState(1); // 1 to 6
  const [currentScenario, setCurrentScenario] = useState<Scenario>(DEMO_SCENARIOS[0]);
  const [commandInput, setCommandInput] = useState(DEMO_SCENARIOS[0].command);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isImpacted, setIsImpacted] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0);

  // Modals & Sound
  const [isPatchOpen, setIsPatchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    soundManager.init();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSimulating) return;
    const target = e.currentTarget;
    const scrollProgress = target.scrollTop / (target.scrollHeight - target.clientHeight);
    const sectionIndex = Math.min(Math.max(Math.floor(scrollProgress * 6) + 1, 1), 6);
    if (sectionIndex !== currentSection) {
      setCurrentSection(sectionIndex);
    }
  };

  const scrollToSection = (sectionIndex: number) => {
    soundManager.playClick();
    setCurrentSection(sectionIndex);
    if (containerRef.current) {
      const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const targetScroll = ((sectionIndex - 1) / 5) * scrollHeight;
      containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Run the 3D Blast Radius Detonation
  const runSimulation = (scenarioToRun: Scenario) => {
    if (isSimulating) return;

    scrollToSection(5);
    setIsSimulating(true);
    setIsImpacted(false);
    setWaveProgress(0);

    soundManager.playCinematicImpact();

    const duration = 4600;
    const start = Date.now();

    if (simTimerRef.current) clearInterval(simTimerRef.current);
    simTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setWaveProgress(progress);

      if (progress > 30 && !isImpacted) {
        setIsImpacted(true);
      }

      if (progress >= 100) {
        clearInterval(simTimerRef.current!);
        setIsSimulating(false);
        setIsImpacted(true);

        setTimeout(() => {
          scrollToSection(6);
          soundManager.playDramaticBlock();
        }, 500);
      }
    }, 40);
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const handleApplyPatch = () => {
    soundManager.playResolve();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setIsPatchOpen(false);
      setIsImpacted(false);
      scrollToSection(1);
    }, 1200);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070709] text-zinc-100 font-sans select-none">
      
      {/* 1. Living 3D World (Surrounding all content) */}
      <Cinematic3DWorld
        currentSection={currentSection}
        isSimulating={isSimulating}
        isImpacted={isImpacted}
        waveProgress={waveProgress}
        nodes={INITIAL_TOPOLOGY_NODES}
        edges={TOPOLOGY_EDGES}
        targetNodeId={currentScenario.targetResourceId}
        directImpactIds={currentScenario.directImpactNodeIds}
        indirectImpactIds={currentScenario.indirectImpactNodeIds}
        mousePos={mousePos}
      />

      {/* 2. Invisible Minimal Header: Tiny Logo & Status */}
      <header className="fixed top-8 left-8 right-8 z-50 flex items-center justify-between pointer-events-none">
        {/* Tiny wordmark with quiet status dot */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            sentinel
          </span>
        </div>

        {/* Minimal sound toggle glyph */}
        <button
          onClick={handleToggleSound}
          className="pointer-events-auto p-2 text-zinc-600 hover:text-white transition-colors"
          title={isMuted ? 'Sound on' : 'Sound off'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </header>

      {/* 3. Minimal Floating Spatial Navigation (Hairline vertical timeline on right) */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center gap-3 pointer-events-auto">
        {[1, 2, 3, 4, 5, 6].map((sec) => (
          <button
            key={sec}
            onClick={() => scrollToSection(sec)}
            className="group py-1 flex items-center gap-2 transition-all"
            title={`Chapter 0${sec}`}
          >
            <span className={`text-[10px] font-mono transition-colors ${
              currentSection === sec ? 'text-white font-medium' : 'text-zinc-600 group-hover:text-zinc-400'
            }`}>
              0{sec}
            </span>
            <span className={`h-px transition-all ${
              currentSection === sec ? 'w-5 bg-white' : 'w-2 bg-zinc-700 group-hover:w-3 group-hover:bg-zinc-500'
            }`} />
          </button>
        ))}
      </div>

      {/* 4. Centered Editorial Spatial Narrative (Scroll-driven) */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-30 w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth pointer-events-auto"
      >
        
        {/* SECTION 1: HERO */}
        <section className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 pointer-events-auto">
            
            {/* Oversized Editorial Typography */}
            <h1 className="text-7xl sm:text-9xl lg:text-[10.5rem] font-black tracking-editorial leading-[0.84] text-white drop-shadow-2xl">
              BEFORE YOU <br />
              <span className="text-zinc-600">DEPLOY.</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 font-light max-w-lg leading-relaxed pt-2">
              Predict the blast radius of infrastructure changes before production.
            </p>

            {/* Single decisive CTA */}
            <div className="pt-6">
              <button
                onClick={() => scrollToSection(5)}
                className="px-7 py-3 rounded-full bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl"
              >
                Simulate "Delete subnet-07"
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVING TOPOLOGY */}
        <section className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 pointer-events-auto">
            
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-editorial leading-[0.88] text-white">
              LIVING <br />
              <span className="text-zinc-600">TOPOLOGY.</span>
            </h2>

            <p className="text-lg sm:text-xl text-zinc-400 font-light max-w-lg leading-relaxed">
              42 microservices floating in depth. Breathing with live traffic and organic light filaments.
            </p>
          </div>
        </section>

        {/* SECTION 3: AUTONOMOUS INTELLIGENCE */}
        <section className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 pointer-events-auto">
            
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-editorial leading-[0.88] text-white">
              SIX ENGINES. <br />
              <span className="text-zinc-600">ZERO ASSUMPTIONS.</span>
            </h2>

            <p className="text-lg sm:text-xl text-zinc-400 font-light max-w-lg leading-relaxed">
              Evaluating routes, IAM boundaries, and failover tolerances simultaneously.
            </p>
          </div>
        </section>

        {/* SECTION 4: CAUSALITY */}
        <section className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 pointer-events-auto">
            
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-editorial leading-[0.88] text-white">
              INVISIBLE <br />
              <span className="text-zinc-600">THREADS.</span>
            </h2>

            <p className="text-lg sm:text-xl text-zinc-400 font-light max-w-lg leading-relaxed">
              A single subnet decommission binds 7 tier-0 services directly and triggers $48,500/min in financial risk.
            </p>
          </div>
        </section>

        {/* SECTION 5: DETONATION SIMULATION */}
        <section className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 pointer-events-auto">
            
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-editorial leading-[0.88] text-white">
              DELETE <br />
              <span className="text-red-500">SUBNET-07.</span>
            </h2>

            <p className="text-base sm:text-lg text-zinc-400 font-light max-w-md">
              Observe the shockwave propagate through 3D space in real time.
            </p>

            {/* Minimal Ethereal Prompt Bar */}
            <div className="pt-2 w-full max-w-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSimulation(currentScenario);
                }}
                className="relative rounded-full bg-white/[0.04] border border-white/10 p-2 backdrop-blur-2xl focus-within:border-white/30 flex items-center gap-3 pl-5 pr-1.5 transition-all"
              >
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Enter change manifest..."
                  className="w-full bg-transparent text-sm font-mono text-white placeholder-zinc-500 focus:outline-none"
                  disabled={isSimulating}
                />
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-5 py-2 rounded-full bg-white text-black font-medium text-xs tracking-wider uppercase flex items-center gap-1.5 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  <span>{isSimulating ? 'DETONATING...' : 'ANALYZE'}</span>
                  <CornerDownLeft className="w-3 h-3 text-zinc-600" />
                </button>
              </form>

              {/* Minimal text-only preset links */}
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-500 pt-3">
                {DEMO_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setCommandInput(sc.command);
                      setCurrentScenario(sc);
                      runSimulation(sc);
                    }}
                    className="hover:text-zinc-300 transition-colors underline underline-offset-4 decoration-zinc-800"
                  >
                    {sc.command}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: THE VERDICT (CLIMAX MONOLITH) */}
        <section className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 pointer-events-auto">
            
            <h2 className="text-7xl sm:text-9xl lg:text-[10rem] font-black tracking-editorial leading-[0.84] text-white">
              BLOCK <br />
              <span className="text-red-500">DEPLOYMENT.</span>
            </h2>

            <p className="text-lg sm:text-xl text-zinc-300 font-light max-w-lg leading-relaxed">
              7 critical services severed. Payment processing in us-east-1a collapses with zero multi-AZ failover.
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPatchOpen(true);
                }}
                className="px-8 py-3.5 rounded-full bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all shadow-2xl active:scale-95"
              >
                Auto-Generate Safe Patch
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  scrollToSection(1);
                  setIsImpacted(false);
                }}
                className="px-6 py-3.5 rounded-full text-zinc-500 hover:text-white font-mono text-xs transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Safe Migration Patch Modal (Spatial Glass) */}
      {isPatchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-3xl animate-in fade-in"
          onClick={() => setIsPatchOpen(false)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl bg-[#0B0B0E] border border-white/10 p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-white tracking-tight">
                  Zero-Downtime Migration Patch
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Drains active connections to Subnet-08 before decommissioning Subnet-07.
                </p>
              </div>
              <button
                onClick={() => setIsPatchOpen(false)}
                className="p-1 rounded-full text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-black border border-white/5 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-56">
              <code>{currentScenario.safeRemediationTerraform}</code>
            </pre>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPatchOpen(false)}
                className="px-4 py-2 text-xs text-zinc-500 hover:text-white font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPatch}
                className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-all active:scale-95"
              >
                Deploy Safe Routing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
