import React, { useState, useEffect, useRef } from 'react';
import { 
  DEMO_SCENARIOS, 
  INITIAL_TOPOLOGY_NODES, 
  TOPOLOGY_EDGES, 
  SPECIALIST_AGENTS, 
  SIMULATION_REASONING_STEPS 
} from './data/scenarios';
import { 
  Scenario, 
  TopologyNode, 
  TopologyEdge, 
  AgentInfo 
} from './types';
import { soundManager } from './utils/audio';

import { ThreeCanvas } from './components/ThreeCanvas';
import { LivingEcosystem } from './components/LivingEcosystem';
import { CinematicHero } from './components/CinematicHero';
import { InvestigationOverlay } from './components/InvestigationOverlay';
import { BlockCinematicScreen } from './components/BlockCinematicScreen';
import { HolographicNodeHUD } from './components/HolographicNodeHUD';
import { PatchModal } from './components/PatchModal';
import { CommandPalette } from './components/CommandPalette';

export function App() {
  // Scenario state
  const [currentScenario, setCurrentScenario] = useState<Scenario>(DEMO_SCENARIOS[0]);
  const [commandInput, setCommandInput] = useState(DEMO_SCENARIOS[0].command);

  // Investigation Phases: 'idle' -> 'swarming' -> 'propagating' -> 'verdict'
  const [investigationPhase, setInvestigationPhase] = useState<'idle' | 'swarming' | 'propagating' | 'verdict'>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [propagationWave, setPropagationWave] = useState(0); // 0 to 100%

  // Topology Nodes and Edges
  const [nodes, setNodes] = useState<TopologyNode[]>(INITIAL_TOPOLOGY_NODES);
  const [edges, setEdges] = useState<TopologyEdge[]>(TOPOLOGY_EDGES);
  const [agents, setAgents] = useState<AgentInfo[]>(SPECIALIST_AGENTS);

  // Focus and Modals
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [isBlockScreenOpen, setIsBlockScreenOpen] = useState(false);
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize audio on mount
  useEffect(() => {
    soundManager.init();
  }, []);

  // Keyboard shortcut for Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        if (isBlockScreenOpen) setIsBlockScreenOpen(false);
        if (selectedNode) setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBlockScreenOpen, selectedNode]);

  // Execute the 6-Second Cinematic Investigation Sequence
  const runCinematicSequence = (scenarioToRun: Scenario) => {
    // Phase 1: Swarming (T+0.0s)
    setInvestigationPhase('swarming');
    setElapsedMs(0);
    setPropagationWave(0);
    setIsBlockScreenOpen(false);
    setSelectedNode(null);
    startTimeRef.current = Date.now();

    soundManager.playCinematicImpact();

    // Reset agents to initial state
    setAgents(SPECIALIST_AGENTS.map(a => ({
      ...a,
      status: 'scanning',
      currentFinding: 'Locking onto topology coordinate...'
    })));

    // Real-time elapsed clock
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 40);

    // Phase 2: Risk Wavefront Propagation (T+1.4s)
    setTimeout(() => {
      setInvestigationPhase('propagating');
      soundManager.playAgentLock(880);

      // Transition agents into deep analysis
      setAgents(prev => prev.map((a, idx) => ({
        ...a,
        status: idx % 2 === 0 ? 'warning' : 'analyzing',
        currentFinding: idx === 0 
          ? '7 Active ENIs bound to subnet-07' 
          : idx === 1 
          ? 'SPOF detected in AZ-a NAT gateway'
          : 'Evaluating cascade risk...'
      })));
    }, 1400);

    // Expanding shockwave progress (T+1.4s to T+5.0s)
    const waveStart = 1400;
    const waveDuration = 3600;
    const waveInterval = setInterval(() => {
      const current = Date.now() - startTimeRef.current;
      if (current >= waveStart) {
        const wave = Math.min(((current - waveStart) / waveDuration) * 100, 100);
        setPropagationWave(wave);
        if (wave >= 100) clearInterval(waveInterval);
      }
    }, 40);

    // Staggered satellite audio pings
    [2200, 2900, 3600, 4300].forEach((delay, i) => {
      setTimeout(() => {
        soundManager.playAgentLock(700 + i * 110);
      }, delay);
    });

    // Phase 3: Dramatic Climax & Full-Screen BLOCK Moment (T+5.6s)
    setTimeout(() => {
      setInvestigationPhase('verdict');
      setPropagationWave(100);
      if (timerRef.current) clearInterval(timerRef.current);

      setAgents(prev => prev.map(a => ({
        ...a,
        status: scenarioToRun.verdict === 'BLOCK' ? 'warning' : 'complete'
      })));

      // Audio climax: Deep alert brass and ominous sub-bass
      if (scenarioToRun.verdict === 'BLOCK') {
        soundManager.playDramaticBlock();
      } else {
        soundManager.playResolve();
      }

      // Trigger the dramatic full-screen moment!
      setIsBlockScreenOpen(true);
    }, 5600);
  };

  const handleAnalyze = (cmd: string) => {
    const matched = DEMO_SCENARIOS.find(
      s => s.command.toLowerCase().trim() === cmd.toLowerCase().trim()
    );

    if (matched) {
      setCurrentScenario(matched);
      runCinematicSequence(matched);
    } else {
      // Dynamic scenario creation for custom commands
      const isDangerous = cmd.toLowerCase().includes('delete') || 
        cmd.toLowerCase().includes('destroy') || 
        cmd.toLowerCase().includes('terminate') || 
        cmd.toLowerCase().includes('revoke');

      const customScenario: Scenario = {
        id: `custom-${Date.now()}`,
        command: cmd,
        targetResourceId: 'subnet-07',
        title: `Dynamic Blast Evaluation: "${cmd}"`,
        category: 'Network',
        riskLevel: isDangerous ? 'CRITICAL' : 'LOW',
        verdict: isDangerous ? 'BLOCK' : 'APPROVE',
        verdictSubtitle: isDangerous
          ? `Destructive action "${cmd}" threatens critical production dependencies without standby routes.`
          : `Change "${cmd}" verified safe with zero production blast radius.`,
        blastRadiusScore: isDangerous ? 9.4 : 1.2,
        directlyAffectedCount: isDangerous ? 7 : 1,
        indirectlyAffectedCount: isDangerous ? 11 : 0,
        criticalDependency: isDangerous ? 'Payment Gateway Core' : 'None',
        revenueAtRiskPerMin: isDangerous ? 48500 : 0,
        impactedTps: isDangerous ? 14200 : 0,
        directImpactNodeIds: isDangerous ? ['subnet-07', 'api-gw-prod-v2', 'checkout-order-processor', 'nat-gw-prod-01', 'cache-cluster-session-m6g'] : [],
        indirectImpactNodeIds: isDangerous ? ['aurora-cluster-pg-15', 'sqs-high-priority-transactions', 'fraud-detection-engine'] : [],
        policyViolations: isDangerous ? [
          {
            id: 'POL-DYN-01',
            rule: 'soc2_tier0_redundancy_quorum',
            framework: 'SOC2',
            description: 'Physical network route teardown without pre-warmed failover violates zero-downtime policy.',
            severity: 'CRITICAL'
          }
        ] : [],
        terraformDiff: `- ${cmd}`,
        safeRemediationTerraform: `# Autonomous pre-drain failover patch for: ${cmd}\n# Multi-AZ route tables associated.`
      };

      setCurrentScenario(customScenario);
      runCinematicSequence(customScenario);
    }
  };

  const handleSelectScenario = (sc: Scenario) => {
    setCurrentScenario(sc);
    setCommandInput(sc.command);
    runCinematicSequence(sc);
  };

  const handleReset = () => {
    soundManager.playClick();
    setInvestigationPhase('idle');
    setIsBlockScreenOpen(false);
    setSelectedNode(null);
    setPropagationWave(0);
    setAgents(SPECIALIST_AGENTS);
  };

  const handleApplyPatchSuccess = () => {
    setCurrentScenario(prev => ({
      ...prev,
      verdict: 'APPROVE',
      riskLevel: 'LOW',
      blastRadiusScore: 0.8,
      verdictSubtitle: 'Autonomous failover patch active: Traffic successfully drained to multi-AZ redundant routes.'
    }));
  };

  const isBlasting = investigationPhase === 'propagating' || investigationPhase === 'verdict';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05070A] text-slate-100 font-sans antialiased select-none">
      {/* 3D React Three Fiber Depth Particles */}
      <ThreeCanvas isCritical={isBlasting && currentScenario.verdict === 'BLOCK'} />

      {/* Centerpiece: The Living Cloud Ecosystem (Full Viewport Graph) */}
      <LivingEcosystem
        nodes={nodes}
        edges={edges}
        targetNodeId={currentScenario.targetResourceId}
        directImpactIds={isBlasting ? currentScenario.directImpactNodeIds : []}
        indirectImpactIds={isBlasting ? currentScenario.indirectImpactNodeIds : []}
        investigationPhase={investigationPhase}
        propagationWave={propagationWave}
        selectedNode={selectedNode}
        onSelectNode={setSelectedNode}
      />

      {/* Floating Cinematic Hero (Visible in 'idle' phase) */}
      <CinematicHero
        currentCommand={commandInput}
        onChangeCommand={setCommandInput}
        onAnalyze={handleAnalyze}
        scenarios={DEMO_SCENARIOS}
        onSelectScenario={handleSelectScenario}
        investigationPhase={investigationPhase}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Floating Minimalist Investigation Overlay (Telemetry bar & Agent Satellites) */}
      <InvestigationOverlay
        investigationPhase={investigationPhase}
        currentCommand={commandInput}
        elapsedMs={elapsedMs}
        propagationWave={propagationWave}
        agents={agents}
      />

      {/* Dramatic Full-Screen BLOCK Moment (Sci-Fi Climax) */}
      <BlockCinematicScreen
        scenario={currentScenario}
        isOpen={isBlockScreenOpen}
        onOpenPatch={() => setIsPatchModalOpen(true)}
        onInspectGraph={() => setIsBlockScreenOpen(false)}
        onReset={handleReset}
      />

      {/* Floating Holographic Node Inspector HUD (when clicking any node on canvas) */}
      <HolographicNodeHUD
        node={selectedNode}
        isDirectImpact={Boolean(selectedNode && currentScenario.directImpactNodeIds.includes(selectedNode.id))}
        isIndirectImpact={Boolean(selectedNode && currentScenario.indirectImpactNodeIds.includes(selectedNode.id))}
        onClose={() => setSelectedNode(null)}
      />

      {/* Auto-Remediation Terraform Patch Modal */}
      <PatchModal
        scenario={currentScenario}
        isOpen={isPatchModalOpen}
        onClose={() => setIsPatchModalOpen(false)}
        onApplySuccess={handleApplyPatchSuccess}
      />

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        scenarios={DEMO_SCENARIOS}
        nodes={nodes}
        onSelectScenario={handleSelectScenario}
        onSelectNode={(node) => setSelectedNode(node)}
      />

      {/* Bottom Floating Minimalist Reset / Re-run Bar when exploring post-investigation */}
      {investigationPhase !== 'idle' && !isBlockScreenOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsBlockScreenOpen(true);
            }}
            className="px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 font-mono text-xs backdrop-blur-2xl transition-all shadow-[0_0_20px_rgba(255,46,77,0.3)] hover:scale-105"
          >
            <span>View BLOCK Verdict</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs backdrop-blur-2xl transition-colors"
          >
            <span>New Simulation</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
