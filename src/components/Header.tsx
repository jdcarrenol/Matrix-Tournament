import React from 'react';
import { TournamentPhase } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { Volume2, VolumeX, RotateCcw, Settings, Home, Swords, FolderOpen, Users } from 'lucide-react';

interface HeaderProps {
  currentPhase: TournamentPhase;
  onSelectPhase: (phase: TournamentPhase) => void;
  selectedCount: number;
  onResetTournament: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onContinueTournament: () => void;
  onStartNewTournament: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPhase,
  onSelectPhase,
  selectedCount,
  onResetTournament,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onContinueTournament,
  onStartNewTournament
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070b18]/95 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between gap-8 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => {
          soundEffects.playClick();
          onSelectPhase('MENU_INIT');
        }}
        className="text-left font-bold text-lg tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
      >
        <span className="text-amber-400 font-mono">⚔️</span>
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          MATRIX TOURNAMENT
        </span>
      </button>

      {/* Zone 2: Single-line clean text navigation links matching the 5 main modular branches */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => {
            soundEffects.playClick();
            onSelectPhase('MENU_INIT');
          }}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            currentPhase === 'MENU_INIT' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          <Home size={14} />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onStartNewTournament();
          }}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            currentPhase === 'CATALOG_SELECT' || currentPhase === 'BOMBOS_SETUP' || currentPhase === 'GROUPS_SETUP' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          <Swords size={14} />
          <span>Nuevo Torneo</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onContinueTournament();
          }}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            currentPhase === 'GROUPS_PLAY' || currentPhase === 'LIVE_DRAW' || currentPhase === 'BRACKETS_PLAY' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          <FolderOpen size={14} />
          <span>Continuar</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onSelectPhase('CATALOG_SELECT');
          }}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            currentPhase === 'CATALOG_SELECT' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          <Users size={14} />
          <span>Competidores ({selectedCount}/64)</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenSettings();
          }}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            currentPhase === 'SETTINGS' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          <Settings size={14} />
          <span>Ajustes</span>
        </button>
      </nav>

      {/* Zone 3: Actions & utilities */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Silenciar Efectos de Audio' : 'Activar Efectos de Audio'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors cursor-pointer"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-slate-500" />}
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenSettings();
          }}
          title="Ajustes y Reglas del Torneo"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors cursor-pointer lg:hidden"
        >
          <Settings size={16} />
        </button>

        <button
          onClick={onResetTournament}
          title="Reiniciar Sistema (Borrar progreso y empezar de cero)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-rose-500/60 hover:text-rose-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>
    </header>
  );
};
