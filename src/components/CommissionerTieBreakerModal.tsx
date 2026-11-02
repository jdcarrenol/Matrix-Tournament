import React, { useState, useEffect } from 'react';
import { Duelist, Group, GroupStanding } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { analyzeGroupTies, calculateGroupStandings } from '../utils/tournamentHelpers';
import { 
  Scale, 
  X, 
  Check, 
  Dices, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  ShieldAlert, 
  Swords, 
  Award,
  HelpCircle,
  Gavel
} from 'lucide-react';

interface CommissionerTieBreakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  duelistsMap: Map<string, Duelist>;
  onSaveOverrides: (groupId: string, overrides: string[] | undefined) => void;
}

export const CommissionerTieBreakerModal: React.FC<CommissionerTieBreakerModalProps> = ({
  isOpen,
  onClose,
  group,
  duelistsMap,
  onSaveOverrides
}) => {
  // Current standings based on current overrides
  const standings = calculateGroupStandings(group);
  const tieAnalysis = analyzeGroupTies(group, standings);

  // Local state for duelist ordering
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOrderedIds(standings.map(s => s.duelistId));
      setNotice(null);
    }
  }, [isOpen, group]);

  if (!isOpen) return null;

  // Move up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    soundEffects.playClick();
    const updated = [...orderedIds];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setOrderedIds(updated);
    setNotice('Orden modificado por Criterio del Comisionado.');
  };

  // Move down
  const handleMoveDown = (index: number) => {
    if (index >= orderedIds.length - 1) return;
    soundEffects.playClick();
    const updated = [...orderedIds];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setOrderedIds(updated);
    setNotice('Orden modificado por Criterio del Comisionado.');
  };

  // Automatic Draw (Sorteo) for tied players
  const handlePerformDraw = () => {
    soundEffects.playVictory();
    // For each tied group of points, randomly shuffle their sub-list
    const standingsByPts = new Map<number, string[]>();
    standings.forEach(s => {
      const arr = standingsByPts.get(s.points) || [];
      arr.push(s.duelistId);
      standingsByPts.set(s.points, arr);
    });

    const newOrder: string[] = [];
    // Sort points DESC
    const sortedPts = Array.from(standingsByPts.keys()).sort((a, b) => b - a);

    sortedPts.forEach(pts => {
      const ids = standingsByPts.get(pts) || [];
      if (ids.length > 1) {
        // Random draw shuffle
        const shuffled = [...ids].sort(() => Math.random() - 0.5);
        newOrder.push(...shuffled);
      } else {
        newOrder.push(...ids);
      }
    });

    setOrderedIds(newOrder);
    setNotice('¡Sorteo oficial completado con éxito! Se ha asignado un orden aleatorio para los contendientes empatados.');
  };

  // Reset to default automatic rules
  const handleResetToAuto = () => {
    soundEffects.playClick();
    onSaveOverrides(group.id, undefined);
    const naturalStandings = calculateGroupStandings({ ...group, commissionerOverrides: undefined });
    setOrderedIds(naturalStandings.map(s => s.duelistId));
    setNotice('Se ha restablecido la clasificación a los criterios automáticos de la jerarquía oficial.');
  };

  // Commit and close
  const handleSave = () => {
    soundEffects.playVictory();
    onSaveOverrides(group.id, orderedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-5 text-slate-200 my-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#222222] gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Gavel size={14} />
              <span>SISTEMA DE DESEMPATES Y CRITERIO DEL COMISIONADO</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Resolución de Desempates · {group.name}</span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Aplica la jerarquía oficial (DG, GF, Enfrentamiento Directo) o ajusta manualmente el orden de clasificación.
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Official Hierarchy Banner */}
        <div className="bg-[#0f1422] border border-cyan-900/40 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-sans uppercase tracking-wider">
            <Award size={14} className="text-cyan-400" />
            <span>Jerarquía Oficial de Desempate (MCT Yu-Gi-Oh!)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] font-sans">
            <div className="bg-black/40 border border-slate-800/80 p-2 rounded-lg">
              <span className="text-cyan-400 font-bold block mb-0.5">1. Diferencia (DG)</span>
              <span className="text-slate-400 text-[10px]">Duelos ganados menos duelos perdidos.</span>
            </div>
            <div className="bg-black/40 border border-slate-800/80 p-2 rounded-lg">
              <span className="text-cyan-400 font-bold block mb-0.5">2. Duelos Ganados (GF)</span>
              <span className="text-slate-400 text-[10px]">Mayor cantidad de duelos individuales.</span>
            </div>
            <div className="bg-black/40 border border-slate-800/80 p-2 rounded-lg">
              <span className="text-cyan-400 font-bold block mb-0.5">3. Head-to-Head</span>
              <span className="text-slate-400 text-[10px]">Resultado directo entre contendientes.</span>
            </div>
            <div className="bg-black/40 border border-slate-800/80 p-2 rounded-lg">
              <span className="text-cyan-400 font-bold block mb-0.5">4. Sorteo / Comisionado</span>
              <span className="text-slate-400 text-[10px]">Sorteo o decisión manual si persiste igualdad.</span>
            </div>
          </div>
        </div>

        {/* Tie Status Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-black/40 border border-slate-800 rounded-xl text-xs">
          <div className="flex items-center gap-2 font-mono">
            {tieAnalysis.hasTies ? (
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <ShieldAlert size={15} />
                <span>Empates en puntos detectados en {group.name}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Check size={15} />
                <span>No hay empates en puntos en este momento.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePerformDraw}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-600/60 text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Realizar sorteo aleatorio para desempatar"
            >
              <Dices size={13} />
              <span>Sorteo Automático</span>
            </button>
            <button
              onClick={handleResetToAuto}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Restablecer a orden por reglas"
            >
              <RotateCcw size={12} />
              <span>Restablecer</span>
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {notice && (
          <div className="p-2.5 bg-cyan-950/40 border border-cyan-700/60 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
            <Check size={14} className="shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Interactive Reordering Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-sans text-neutral-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Posición y Contendientes (Usa las flechas para elegir manualmente la jerarquía)
            </span>
            <span className="text-[11px] font-mono text-[#00d2ff]">
              * Top 4 Clasifica a R32
            </span>
          </div>

          <div className="divide-y divide-[#222222] bg-[#090d18] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {orderedIds.map((duelistId, idx) => {
              const duelist = duelistsMap.get(duelistId);
              const standing = standings.find(s => s.duelistId === duelistId);
              if (!duelist || !standing) return null;
              const isTop4 = idx < 4;

              return (
                <div
                  key={duelistId}
                  className={`p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                    isTop4 ? 'bg-[#0f172a]/50 border-l-2 border-[#00d2ff]' : 'border-l-2 border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-5 h-5 rounded text-center leading-5 text-[11px] font-mono font-bold shrink-0 ${
                      isTop4 ? 'bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/50 shadow-sm shadow-cyan-950' : 'text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>

                    {/* Avatar circular */}
                    <div className="w-7 h-7 rounded-full bg-[#0b1329] border border-blue-900/50 flex items-center justify-center overflow-hidden shrink-0 text-xs">
                      {duelist.avatarUrl ? (
                        <img src={duelist.avatarUrl} alt={duelist.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{duelist.avatarIcon}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate max-w-[150px] sm:max-w-xs flex items-center gap-1.5">
                        <span>{duelist.name}</span>
                        {isTop4 && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950/80 text-[#00d2ff] border border-cyan-700/60">
                            Top R32
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {duelist.era} · {duelist.archetype}
                      </div>
                    </div>
                  </div>

                  {/* Stats & manual order controls */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Stats pills */}
                    <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-400" title="Partidos Jugados">PJ: <strong className="text-white">{standing.played}</strong></span>
                      <span className="text-slate-400" title="Diferencia de Duelos">DG: <strong className={standing.goalDiff > 0 ? 'text-cyan-400' : standing.goalDiff < 0 ? 'text-rose-400/80' : 'text-slate-300'}>{standing.goalDiff > 0 ? `+${standing.goalDiff}` : standing.goalDiff}</strong></span>
                      <span className="text-slate-400" title="Duelos Totales Ganados">GF: <strong className="text-cyan-400">{standing.duelsWon}</strong></span>
                      <span className="text-slate-300 font-bold px-2 py-0.5 rounded bg-black/60 border border-slate-800" title="Puntos">PTS: {standing.points}</span>
                    </div>

                    {/* Manual move buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className={`p-1.5 rounded bg-slate-800 border border-slate-700 transition-colors ${
                          idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cyan-900 hover:text-cyan-300 cursor-pointer text-slate-300'
                        }`}
                        title="Subir posición (Criterio del Comisionado)"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === orderedIds.length - 1}
                        className={`p-1.5 rounded bg-slate-800 border border-slate-700 transition-colors ${
                          idx === orderedIds.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cyan-900 hover:text-cyan-300 cursor-pointer text-slate-300'
                        }`}
                        title="Bajar posición (Criterio del Comisionado)"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3.5 border-t border-[#222222] gap-3">
          <div className="text-xs text-slate-400 font-mono">
            * El orden establecido por el Comisionado prevalece para definir los 4 clasificados del grupo a los Dieciseisavos (R32).
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg shadow-lg shadow-cyan-950 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>Guardar Criterio</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
