import React, { useState } from 'react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Command, 
  Activity, 
  Layers, 
  ChevronDown, 
  Radio,
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onTriggerSignatureDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onTriggerSignatureDemo
}) => {
  const [muted, setMuted] = useState(soundManager.isMuted());
  const [selectedRegion, setSelectedRegion] = useState('us-east-1 (N. Virginia)');
  const [selectedOrg, setSelectedOrg] = useState('aws-prod-core-8821 (Enterprise)');

  const handleToggleSound = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundManager.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#05070A]/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo & Product Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-glow-cyan">
            <div className="w-full h-full bg-[#070B12] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-100 tracking-tight text-base font-sans">
                Sentinel AI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                AGENTIC
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:block">
              Infrastructure Blast Radius Engine
            </span>
          </div>
        </div>

        {/* Center: AWS Context Selector (Console vibe) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-200">{selectedOrg}</span>
          </div>
          <div className="h-3.5 w-px bg-slate-800 mx-1" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">{selectedRegion}</span>
          </div>
        </div>

        {/* Right Actions: Demo Trigger, Cmd+K, Sound Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Signature Demo Quick Launcher */}
          <button
            onClick={() => {
              soundManager.playClick();
              onTriggerSignatureDemo();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono font-semibold hover:bg-rose-900/50 hover:border-rose-400 transition-all shadow-glow-red"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Signature Demo ("Delete subnet-07")</span>
          </button>

          {/* Cmd + K Command Palette button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCommandPalette();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs font-mono transition-colors"
            title="Open Command Palette (Cmd + K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cmd+K</span>
          </button>

          {/* Audio Synthesizer Mute Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              muted 
                ? 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300' 
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-glow-cyan'
            }`}
            title={muted ? 'Enable Tactical Audio' : 'Mute Tactical Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
