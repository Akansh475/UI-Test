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
  AgentInfo, 
  ReasoningStep,
  VerdictType
} from './types';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopologyGraph } from './components/TopologyGraph';
import { InvestigationSequence } from './components/InvestigationSequence';
import { BlastRadiusView } from './components/BlastRadiusView';
import { ReasoningPanel } from './components/ReasoningPanel';
import { DecisionPanel } from './components/DecisionPanel';
import { NodeDetailModal } from './components/NodeDetailModal';
import { RemediationModal } from './components/RemediationModal';
import { CommandPalette } from './components/CommandPalette';

export function App() {
  // Scenario state
  const [currentScenario, setCurrentScenario] = useState<Scenario>(DEMO_SCENARIOS[0]);
  const [commandInput, setCommandInput] = useState(DEMO_SCENARIOS[0].command);

  // Investigation Simulation State
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Submitted, 2: Supervisor, 3: Agents Running, 4: Complete
  const [simulationElapsedMs, setSimulationElapsedMs] = useState(0);
  const [propagationProgress, setPropagationProgress] = useState(0); // 0 - 100%

  // Topology and Agents state
  const [nodes, setNodes] = useState<TopologyNode[]>(INITIAL_TOPOLOGY_NODES);
  const [edges, setEdges] = useState<TopologyEdge[]>(TOPOLOGY_EDGES);
  const [agents, setAgents] = useState<AgentInfo[]>(SPECIALIST_AGENTS);
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>(
    SIMULATION_REASONING_STEPS['delete-subnet-07'] || []
  );

  // UI Modals
  const [inspectedNode, setInspectedNode] = useState<TopologyNode | null>(null);
  const [isRemediationOpen, setIsRemediationOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const mainInvestigationRef = useRef<HTMLDivElement>(null);
  const simulationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize audio on mount
  useEffect(() => {
    soundManager.init();
  }, []);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Execute Signature 5-8 Second Simulation Sequence
  const runInvestigation = (scenarioToRun: Scenario) => {
    if (isInvestigating) return;

    setIsInvestigating(true);
    setSimulationStep(1); // Step 1: Change Submitted
    setSimulationElapsedMs(0);
    setPropagationProgress(0);
    startTimeRef.current = Date.now();

    // Reset agents to idle
    setAgents(SPECIALIST_AGENTS.map(a => ({ ...a, status: 'idle', currentFinding: undefined })));

    soundManager.playSonar();

    // Smooth scroll down to the investigation zone
    setTimeout(() => {
      mainInvestigationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);

    // Timeline tracker
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setSimulationElapsedMs(elapsed);
    }, 50);
    simulationTimerRef.current = interval;

    // Timeline Event: Step 2 - Supervisor Dispatched (0.8s)
    setTimeout(() => {
      setSimulationStep(2);
      soundManager.playBlip(750);
    }, 800);

    // Timeline Event: Step 3 - Specialist Agents Swarm (1.6s)
    setTimeout(() => {
      setSimulationStep(3);
      soundManager.playBlip(920);

      // Launch all 6 specialist agents into scanning / analyzing
      setAgents(prev => prev.map((a, idx) => ({
        ...a,
        status: idx % 2 === 0 ? 'scanning' : 'analyzing',
        currentFinding: 'Tracing network topology DAG & IAM boundaries...'
      })));
    }, 1600);

    // Wavefront blast propagation progress animation (1.6s to 4.5s)
    const waveStart = 1600;
    const waveDuration = 3000;
    const waveInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= waveStart) {
        const progress = Math.min(((elapsed - waveStart) / waveDuration) * 100, 100);
        setPropagationProgress(progress);
        if (progress >= 100) {
          clearInterval(waveInterval);
        }
      }
    }, 50);

    // Staggered Agent Findings delivery
    const steps = SIMULATION_REASONING_STEPS[scenarioToRun.id] || SIMULATION_REASONING_STEPS['delete-subnet-07'];
    setReasoningSteps(steps);

    steps.forEach((step, idx) => {
      setTimeout(() => {
        soundManager.playBlip(800 + idx * 70);
        setAgents(prev => prev.map(a => {
          if (step.agent.toLowerCase().includes(a.name.toLowerCase().split(' ')[0])) {
            return {
              ...a,
              status: step.severity === 'critical' ? 'warning' : 'analyzing',
              currentFinding: step.finding,
              confidence: step.confidence
            };
          }
          return a;
        }));
      }, 2000 + idx * 500);
    });

    // Step 4: Final Verdict Enforced (5.4s - dramatic climax)
    setTimeout(() => {
      setSimulationStep(4);
      setIsInvestigating(false);
      setPropagationProgress(100);
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);

      // Finalize agents to complete or warning
      setAgents(prev => prev.map(a => ({
        ...a,
        status: scenarioToRun.verdict === 'BLOCK' ? 'warning' : 'complete'
      })));

      // Audio climax
      if (scenarioToRun.verdict === 'BLOCK') {
        soundManager.playWarning();
      } else {
        soundManager.playSuccess();
      }
    }, 5400);
  };

  const handleAnalyzeCommand = (cmd: string) => {
    // Check if matched to existing preset
    const matched = DEMO_SCENARIOS.find(
      s => s.command.toLowerCase().trim() === cmd.toLowerCase().trim()
    );

    if (matched) {
      setCurrentScenario(matched);
      runInvestigation(matched);
    } else {
      // Dynamic scenario generator for ANY custom user input
      const isDangerous = cmd.toLowerCase().includes('delete') || 
        cmd.toLowerCase().includes('destroy') || 
        cmd.toLowerCase().includes('terminate') || 
        cmd.toLowerCase().includes('drop') ||
        cmd.toLowerCase().includes('revoke');

      const customScenario: Scenario = {
        id: `custom-${Date.now()}`,
        command: cmd,
        targetResourceId: 'subnet-07',
        title: `Dynamic Evaluation: "${cmd}"`,
        category: 'Network',
        riskLevel: isDangerous ? 'CRITICAL' : 'LOW',
        verdict: isDangerous ? 'BLOCK' : 'APPROVE',
        verdictSubtitle: isDangerous
          ? `Destructive action "${cmd}" threatens critical production dependencies.`
          : `Change "${cmd}" passed all blast radius perimeter safety checks.`,
        blastRadiusScore: isDangerous ? 9.2 : 1.4,
        directlyAffectedCount: isDangerous ? 6 : 1,
        indirectlyAffectedCount: isDangerous ? 9 : 0,
        criticalDependency: isDangerous ? 'Payment Gateway Core' : 'None',
        revenueAtRiskPerMin: isDangerous ? 42000 : 0,
        impactedTps: isDangerous ? 12400 : 0,
        directImpactNodeIds: isDangerous ? ['subnet-07', 'api-gw-prod-v2', 'checkout-order-processor'] : [],
        indirectImpactNodeIds: isDangerous ? ['aurora-cluster-pg-15', 'sqs-high-priority-transactions'] : [],
        policyViolations: isDangerous ? [
          {
            id: 'POL-DYN-01',
            rule: 'enforce_production_redundancy',
            framework: 'SOC2',
            description: 'Unplanned resource termination without pre-warmed standby route violates zero-downtime policy.',
            severity: 'CRITICAL'
          }
        ] : [],
        terraformDiff: `- # CUSTOM PLAN DESTRUCTION:\n- ${cmd}`,
        safeRemediationTerraform: `# Remediation for: ${cmd}\n# Standby failover created prior to deletion.`
      };

      setCurrentScenario(customScenario);
      runInvestigation(customScenario);
    }
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setCommandInput(scenario.command);
    runInvestigation(scenario);
  };

  const handleResetInvestigation = () => {
    soundManager.playClick();
    setSimulationStep(0);
    setPropagationProgress(0);
    setAgents(SPECIALIST_AGENTS.map(a => ({ ...a, status: 'idle', currentFinding: undefined })));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemediationSuccess = () => {
    // Transform verdict to approved after applying patch
    setCurrentScenario(prev => ({
      ...prev,
      verdict: 'APPROVE',
      riskLevel: 'LOW',
      blastRadiusScore: 0.8,
      verdictSubtitle: 'Remediation patch active: Ingress route successfully drained to multi-AZ failover.'
    }));
  };

  const isCriticalMode = currentScenario.verdict === 'BLOCK' && simulationStep === 4;

  return (
    <div className="relative min-h-screen bg-[#05070A] text-slate-100 selection:bg-cyan-500/25 selection:text-cyan-300 font-sans antialiased overflow-x-hidden">
      {/* 3D React Three Fiber Background with floating nodes & particle network */}
      <ThreeCanvas isCritical={isCriticalMode} />

      {/* Top Mission Control Header */}
      <Header 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onTriggerSignatureDemo={() => {
          const s1 = DEMO_SCENARIOS[0];
          setCurrentScenario(s1);
          setCommandInput(s1.command);
          runInvestigation(s1);
        }}
      />

      <main className="relative z-10">
        {/* Full-Screen Cinematic Hero */}
        <Hero
          currentCommand={commandInput}
          onChangeCommand={setCommandInput}
          onAnalyze={handleAnalyzeCommand}
          isInvestigating={isInvestigating}
          scenarios={DEMO_SCENARIOS}
          onSelectScenario={handleSelectScenario}
        />

        {/* Live Investigation Command Center Area */}
        <div ref={mainInvestigationRef} className="max-w-7xl mx-auto px-4 py-8 space-y-10">
          
          {/* Section 1: Supervisor & 6 Specialist Agents Flow */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  MULTI-AGENT SWARM
                </span>
                <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                  Autonomous Investigation Engine
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                6 Specialist Agents • Deterministic Consensus
              </span>
            </div>

            <InvestigationSequence
              agents={agents}
              currentStep={simulationStep}
              elapsedMs={simulationElapsedMs}
              reasoningSteps={reasoningSteps}
            />
          </section>

          {/* Section 2: Interactive Infrastructure Dependency Graph (The Centerpiece) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  TOPOLOGY CENTERPIECE
                </span>
                <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                  Interactive Infrastructure Dependency Graph
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Drag to pan • Scroll to zoom • Click node to inspect
              </span>
            </div>

            <TopologyGraph
              nodes={nodes}
              edges={edges}
              targetNodeId={currentScenario.targetResourceId}
              directImpactIds={simulationStep >= 3 ? currentScenario.directImpactNodeIds : []}
              indirectImpactIds={simulationStep >= 3 ? currentScenario.indirectImpactNodeIds : []}
              isInvestigating={isInvestigating}
              propagationProgress={propagationProgress}
              onSelectNode={(node) => setInspectedNode(node)}
            />
          </section>

          {/* Section 3: Blast Radius Visualization (Concentric rings & Heatmaps) */}
          <section className="space-y-4">
            <BlastRadiusView
              scenario={currentScenario}
              nodes={nodes}
              onSelectNode={(node) => setInspectedNode(node)}
            />
          </section>

          {/* Section 4: AI Chain-of-Thought Reasoning Panel */}
          <section className="space-y-4">
            <ReasoningPanel
              scenario={currentScenario}
              reasoningSteps={reasoningSteps}
              nodes={nodes}
              onSelectNode={(node) => setInspectedNode(node)}
            />
          </section>

          {/* Section 5: Dramatic Final Decision Screen (BLOCK / REVIEW / APPROVE) */}
          {simulationStep >= 4 && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <DecisionPanel
                scenario={currentScenario}
                onResetInvestigation={handleResetInvestigation}
                onOpenRemediationModal={() => setIsRemediationOpen(true)}
              />
            </section>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-slate-800/80 bg-[#05070A]/90 py-10 px-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">Sentinel AI Daemon v4.2.0-prod</span>
            <span>• Mission Control for Cloud Infrastructure</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>AWS GovCloud Certified</span>
            <span>•</span>
            <span>SOC2 Type II</span>
            <span>•</span>
            <span>PCI-DSS 4.0 Compliant</span>
          </div>
        </div>
      </footer>

      {/* Deep-Dive Node Inspection Modal */}
      <NodeDetailModal
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
        isDirectImpact={Boolean(inspectedNode && currentScenario.directImpactNodeIds.includes(inspectedNode.id))}
        isIndirectImpact={Boolean(inspectedNode && currentScenario.indirectImpactNodeIds.includes(inspectedNode.id))}
      />

      {/* Auto-Remediation Terraform Patch Modal */}
      <RemediationModal
        scenario={currentScenario}
        isOpen={isRemediationOpen}
        onClose={() => setIsRemediationOpen(false)}
        onApplySuccess={handleRemediationSuccess}
      />

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        scenarios={DEMO_SCENARIOS}
        nodes={nodes}
        onSelectScenario={handleSelectScenario}
        onSelectNode={(node) => setInspectedNode(node)}
      />
    </div>
  );
}

export default App;
