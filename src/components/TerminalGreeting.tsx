import React from 'react';
import { soundEffects } from '../utils/audio';
import { 
  Play, 
  PlusCircle, 
  FolderOpen, 
  Users, 
  Settings, 
  RotateCcw, 
  ArrowRight,
  Shield, 
  Sparkles,
  Cpu
} from 'lucide-react';

interface TerminalGreetingProps {
  onContinue: () => void;
  onNewGame: () => void;
  onLoadGame: () => void;
  onCompetitors: () => void;
  onSettings: () => void;
  onReset: () => void;
  selectedCount: number;
  totalCatalogCount: number;
  playedMatchesCount: number;
  totalMatchesCount: number;
  hasActiveTournament: boolean;
  activePhaseName: string;
}

export const TerminalGreeting: React.FC<TerminalGreetingProps> = ({
  onContinue,
  onNewGame,
  onLoadGame,
  onCompetitors,
  onSettings,
  onReset,
  selectedCount,
  totalCatalogCount,
  playedMatchesCount,
  totalMatchesCount,
  hasActiveTournament,
  activePhaseName
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Terminal Console Box: The Obligatory Start Menu Format */}
      <div className="rounded-xl border border-cyan-500/40 bg-[#070b16] p-6 shadow-xl relative overflow-hidden font-mono">
        <div className="relative z-10 space-y-5">
          {/* Header Title & Status */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
                <span>MATRIX TOURNAMENT</span>
              </h1>
              <p className="text-xs text-cyan-400 font-mono mt-0.5">
                MCT CEO TERMINAL v5.0 · KAIBA CORP ENTERTAINMENT SYSTEM
              </p>
            </div>
            {hasActiveTournament && (
              <span className="px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono">
                {activePhaseName}
              </span>
            )}
          </div>

          {/* Interactive Clickable Modular Menu Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CONTINUAR (Slot actual) */}
            <button
              onClick={() => {
                soundEffects.playVictory();
                onContinue();
              }}
              className="text-left p-4 rounded-xl bg-slate-900/90 border border-cyan-500/60 hover:border-cyan-400 hover:bg-slate-850 hover:shadow-lg hover:shadow-cyan-950/60 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-cyan-400 mb-1 font-bold">
                <span>RANURA ACTIVA</span>
                <Play size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 flex items-center gap-2">
                <span>CONTINUAR</span>
                <span className="text-xs font-normal text-slate-400">(Slot actual)</span>
              </div>
            </button>

            {/* NUEVA PARTIDA */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onNewGame();
              }}
              className="text-left p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-400 hover:bg-slate-850 hover:shadow-lg hover:shadow-emerald-950/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-emerald-400 mb-1 font-bold">
                <span>NUEVO CAMPEONATO</span>
                <PlusCircle size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
                <span>NUEVA PARTIDA</span>
              </div>
            </button>

            {/* CARGAR PARTIDA */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onLoadGame();
              }}
              className="text-left p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400 hover:bg-slate-850 hover:shadow-lg hover:shadow-amber-950/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-amber-400 mb-1 font-bold">
                <span>GESTIÓN DE ARCHIVOS</span>
                <FolderOpen size={16} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                <span>CARGAR PARTIDA</span>
              </div>
            </button>

            {/* COMPETIDORES */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onCompetitors();
              }}
              className="text-left p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-400 hover:bg-slate-850 hover:shadow-lg hover:shadow-purple-950/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-purple-400 mb-1 font-bold">
                <span>BASE DE DATOS GLOBAL</span>
                <Users size={16} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                <span>COMPETIDORES</span>
              </div>
            </button>
          </div>

          {/* Bottom Settings Strip */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                soundEffects.playClick();
                onSettings();
              }}
              className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-cyan-300 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            >
              <Settings size={14} className="text-cyan-400" />
              <span>Configuración</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-rose-400 py-1.5 px-3 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reiniciar Torneo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
