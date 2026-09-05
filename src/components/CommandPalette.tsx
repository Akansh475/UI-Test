import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Volume2, 
  RotateCcw,
  X,
  ArrowRight
} from 'lucide-react';
import { Scenario, TopologyNode } from '../types';
import { soundManager } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: Scenario[];
  nodes: TopologyNode[];
  onSelectScenario: (scenario: Scenario) => void;
  onSelectNode: (node: TopologyNode) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  scenarios,
  nodes,
  onSelectScenario,
  onSelectNode
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredScenarios = scenarios.filter(s => 
    s.command.toLowerCase().includes(query.toLowerCase()) ||
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNodes = nodes.filter(n => 
    n.name.toLowerCase().includes(query.toLowerCase()) ||
    n.type.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search commands, scenarios, or cloud resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Demos */}
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase px-2 mb-1.5">
              Available Blast Radius Scenarios
            </div>
            <div className="space-y-1">
              {filteredScenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectScenario(sc);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900 flex items-center justify-between group transition-colors font-mono text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {sc.riskLevel === 'CRITICAL' && <Flame className="w-4 h-4 text-rose-400" />}
                    {sc.riskLevel === 'HIGH' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
                    {sc.riskLevel === 'LOW' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    <div>
                      <div className="text-slate-200 group-hover:text-cyan-300 font-semibold">
                        {sc.command}
                      </div>
                      <div className="text-[10px] text-slate-500">{sc.title}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Cloud Nodes */}
          {filteredNodes.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase px-2 mb-1.5">
                Cloud Resources in Active VPC
              </div>
              <div className="space-y-1">
                {filteredNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectNode(node);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900 flex items-center justify-between group transition-colors font-mono text-xs"
                  >
                    <div>
                      <div className="text-slate-300 group-hover:text-cyan-300">{node.name}</div>
                      <div className="text-[10px] text-slate-500">{node.type} • {node.region}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Inspect
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
