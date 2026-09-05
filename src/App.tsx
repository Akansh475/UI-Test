import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Zap, 
  Sparkles, 
  Terminal, 
  ShieldAlert, 
  Flame, 
  Wrench, 
  CornerDownLeft, 
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DEMO_SCENARIOS, 
  INITIAL_TOPOLOGY_NODES, 
  TOPOLOGY_EDGES, 
  SPECIALIST_AGENTS 
} from './data/scenarios';
import { Scenario, TopologyNode } from './types';
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

  // Modals & Details
  const [isPatchOpen, setIsPatchOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize sound and mouse parallax tracking
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

  // Track natural scroll to advance sections (1 through 6)
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

  // Run the Signature 3D Blast Radius Simulation
  const runSimulation = (scenarioToRun: Scenario) => {
    if (isSimulating) return;

    // Navigate camera to Simulation section (5)
    scrollToSection(5);
    setIsSimulating(true);
    setIsImpacted(false);
    setWaveProgress(0);

    soundManager.playCinematicImpact();

    const duration = 4800;
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

        // Climax: Transition smoothly to Section 6 (Verdict)
        setTimeout(() => {
          scrollToSection(6);
          soundManager.playDramaticBlock();
        }, 400);
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
      particleCount: 80,
      spread: 70,
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
      
      {/* 1. Cinematic 3D WebGL World (The Living Environment) */}
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
        onSelectNode={setSelectedNode}
        mousePos={mousePos}
      />

      {/* 2. Floating Minimalist Spatial Navigation Bar (Apple Vision Pro Glass) */}
      <header className="fixed top-8 left-8 right-8 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-white/[0.04] backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-widest uppercase text-white">
            SENTINEL 3D
          </span>
        </div>

        {/* Spatial Chapter Indicator Pills */}
        <div className="hidden md:flex items-center gap-1.5 pointer-events-auto bg-white/[0.04] backdrop-blur-2xl p-1 rounded-full border border-white/10 text-[11px] font-mono">
          {[
            { id: 1, label: 'Hero' },
            { id: 2, label: 'Ecosystem' },
            { id: 3, label: 'Agents' },
            { id: 4, label: 'Causality' },
            { id: 5, label: 'Simulation' },
            { id: 6, label: 'Verdict' }
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => scrollToSection(ch.id)}
              className={`px-3 py-1 rounded-full transition-all ${
                currentSection === ch.id
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleToggleSound}
          className="pointer-events-auto bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl p-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-white transition-colors"
          title={isMuted ? 'Unmute Spatial Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
        </button>
      </header>

      {/* 3. Interactive Scrollable Storytelling Chapters Overlay */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-30 w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth pointer-events-auto"
      >
        
        {/* SECTION 1: HERO */}
        <section className="h-screen w-full snap-start flex flex-col justify-center px-8 sm:px-20 max-w-5xl pointer-events-none">
          <div className="space-y-6 pointer-events-auto animate-in fade-in duration-700">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>CHAPTER 01 / SPATIAL FRONTIER</span>
            </div>

            <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tighter text-white leading-[0.98] drop-shadow-2xl">
              Before you touch production, <br />
              <span className="text-zinc-500">know what breaks.</span>
            </h1>

            <p className="text-lg sm:text-2xl text-zinc-400 font-light max-w-2xl leading-relaxed">
              An interactive 3D ecosystem that simulates cascading cloud outages before code reaches deployment.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => scrollToSection(5)}
                className="px-8 py-3.5 rounded-full bg-white text-black font-medium text-xs font-mono tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-2xl active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Simulate "Delete subnet-07"</span>
              </button>

              <button
                onClick={() => scrollToSection(2)}
                className="px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 font-mono text-xs backdrop-blur-xl transition-all flex items-center gap-1.5"
              >
                <span>Explore 3D Ecosystem</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: INFRASTRUCTURE ECOSYSTEM */}
        <section className="h-screen w-full snap-start flex flex-col justify-center px-8 sm:px-20 max-w-5xl pointer-events-none">
          <div className="space-y-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400 backdrop-blur-xl">
              <span>CHAPTER 02 / TOPOLOGY MESH</span>
            </div>

            <h2 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              A living, breathing <br />
              <span className="text-zinc-400">cloud constellation.</span>
            </h2>

            <p className="text-lg text-zinc-400 font-light max-w-xl leading-relaxed">
              42 microservices, 3 availability zones, and 18 causal boundaries floating in depth. Nodes pulse with live activity and organic light filaments.
            </p>
          </div>
        </section>

        {/* SECTION 3: AI AGENTS */}
        <section className="h-screen w-full snap-start flex flex-col justify-center px-8 sm:px-20 max-w-5xl pointer-events-none">
          <div className="space-y-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400 backdrop-blur-xl">
              <span>CHAPTER 03 / AUTONOMOUS OVERSEER</span>
            </div>

            <h2 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Six specialist engines <br />
              <span className="text-zinc-400">observing the network.</span>
            </h2>

            <p className="text-lg text-zinc-400 font-light max-w-xl leading-relaxed">
              Evaluating DAG dependency chains, route tables, IAM trust escalation, TPS volatility, and PCI-DSS compliance barriers in real time.
            </p>
          </div>
        </section>

        {/* SECTION 4: DEPENDENCY DISCOVERY */}
        <section className="h-screen w-full snap-start flex flex-col justify-center px-8 sm:px-20 max-w-5xl pointer-events-none">
          <div className="space-y-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400 backdrop-blur-xl">
              <span>CHAPTER 04 / CAUSALITY STRANDS</span>
            </div>

            <h2 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Invisible connections <br />
              <span className="text-zinc-400">carry catastrophic weight.</span>
            </h2>

            <p className="text-lg text-zinc-400 font-light max-w-xl leading-relaxed">
              A single subnet decommission binds 7 tier-0 services directly and triggers $48,500/min in financial exposure across us-east-1a.
            </p>
          </div>
        </section>

        {/* SECTION 5: BLAST-RADIUS SIMULATION */}
        <section className="h-screen w-full snap-start flex flex-col justify-center px-8 sm:px-20 max-w-5xl pointer-events-none">
          <div className="space-y-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400 backdrop-blur-xl">
              <span>CHAPTER 05 / DETONATION SIMULATION</span>
            </div>

            <h2 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              What happens if you <br />
              <span className="text-red-400">delete subnet-07?</span>
            </h2>

            <div className="pt-2 max-w-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSimulation(currentScenario);
                }}
                className="relative rounded-full bg-white/[0.05] border border-white/15 p-2 backdrop-blur-3xl focus-within:border-white/40 shadow-2xl flex items-center gap-3 pl-4 pr-1 transition-all"
              >
                <Terminal className="w-4 h-4 text-zinc-400" />
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
                  className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs font-mono tracking-wider flex items-center gap-1.5 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  <span>{isSimulating ? 'SIMULATING...' : 'ANALYZE'}</span>
                  <CornerDownLeft className="w-3 h-3 text-zinc-600" />
                </button>
              </form>

              {/* Preset buttons */}
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-3">
                <span>Presets:</span>
                {DEMO_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setCommandInput(sc.command);
                      setCurrentScenario(sc);
                      runSimulation(sc);
                    }}
                    className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700"
                  >
                    {sc.command}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: THE VERDICT (CLIMAX MONOLITH) */}
        <section className="h-screen w-full snap-start flex flex-col justify-center px-8 sm:px-20 max-w-5xl pointer-events-none">
          <div className="space-y-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-400 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>CHAPTER 06 / AUTONOMOUS VERDICT</span>
            </div>

            <h2 className="text-6xl sm:text-8xl font-extrabold tracking-tighter text-white leading-[0.98]">
              BLOCK <br />
              <span className="text-red-400">DEPLOYMENT.</span>
            </h2>

            <p className="text-lg text-zinc-300 font-light max-w-xl leading-relaxed">
              7 critical services severed. Payment processing in us-east-1a collapses with zero multi-AZ failover.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPatchOpen(true);
                }}
                className="px-7 py-3.5 rounded-full bg-white text-black font-medium text-xs font-mono tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-2xl active:scale-95"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Auto-Generate Safe Patch</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  scrollToSection(1);
                  setIsImpacted(false);
                }}
                className="px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white font-mono text-xs backdrop-blur-xl transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Journey</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Safe Migration Patch Modal (Frosted Spatial Glass) */}
      {isPatchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in"
          onClick={() => setIsPatchOpen(false)}
        >
          <div 
            className="w-full max-w-xl rounded-3xl bg-[#0B0B0E] border border-white/10 p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white tracking-tight">
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
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPatch}
                className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs font-mono hover:bg-zinc-200 transition-all active:scale-95"
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
