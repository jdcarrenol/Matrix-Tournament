import React, { useState, useEffect } from 'react';
import { Duelist, Group, GroupMatch } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { generateGroupMatches } from '../utils/tournamentHelpers';
import { 
  Swords, 
  X, 
  Check, 
  ArrowLeftRight, 
  Trash2, 
  Wand2, 
  RotateCcw, 
  AlertTriangle, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

interface ManualPairingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  duelistsMap: Map<string, Duelist>;
  initialMatchday?: number;
  onSaveGroupMatches: (newMatches: GroupMatch[]) => void;
}

export const ManualPairingsModal: React.FC<ManualPairingsModalProps> = ({
  isOpen,
  onClose,
  group,
  duelistsMap,
  initialMatchday = 1,
  onSaveGroupMatches
}) => {
  const [activeDay, setActiveDay] = useState<number>(initialMatchday);
  const [matches, setMatches] = useState<GroupMatch[]>([]);
  const [activeSlotTarget, setActiveSlotTarget] = useState<{ matchId: string; slot: 1 | 2 } | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Sync internal state when modal opens or group changes
  useEffect(() => {
    if (isOpen) {
      if (!group.matches || group.matches.length === 0) {
        setMatches(generateGroupMatches(group.id, group.duelistIds));
      } else {
        setMatches([...group.matches]);
      }
      setActiveDay(initialMatchday);
      setActiveSlotTarget(null);
      setValidationMessage(null);
    }
  }, [isOpen, group, initialMatchday]);

  if (!isOpen) return null;

  // Filter 4 matches for active matchday
  const currentMatches = matches.filter(m => m.matchday === activeDay);

  // Group duelists
  const groupDuelists = group.duelistIds
    .map(id => duelistsMap.get(id))
    .filter((d): d is Duelist => Boolean(d));

  // Determine which duelists are currently assigned in this matchday
  const assignedDuelistMap = new Map<string, { matchId: string; mesaIndex: number; slot: 1 | 2 }>();
  currentMatches.forEach((m, idx) => {
    if (m.duelist1Id) {
      assignedDuelistMap.set(m.duelist1Id, { matchId: m.id, mesaIndex: idx + 1, slot: 1 });
    }
    if (m.duelist2Id) {
      assignedDuelistMap.set(m.duelist2Id, { matchId: m.id, mesaIndex: idx + 1, slot: 2 });
    }
  });

  // Assign a duelist to a specific slot
  const handleAssignDuelistToSlot = (matchId: string, slot: 1 | 2, duelistId: string) => {
    soundEffects.playClick();
    setMatches(prevMatches => {
      return prevMatches.map(m => {
        if (m.id !== matchId) {
          // If this duelist was already assigned in another match of the SAME matchday, remove them from there to avoid duplication
          if (m.matchday === activeDay) {
            const updated = { ...m };
            if (updated.duelist1Id === duelistId) {
              updated.duelist1Id = '';
              if (updated.played) {
                updated.played = false;
                updated.winnerId = null;
                updated.score1 = 0;
                updated.score2 = 0;
              }
            }
            if (updated.duelist2Id === duelistId) {
              updated.duelist2Id = '';
              if (updated.played) {
                updated.played = false;
                updated.winnerId = null;
                updated.score1 = 0;
                updated.score2 = 0;
              }
            }
            return updated;
          }
          return m;
        }

        // Target match update
        const updated = { ...m };
        if (slot === 1) {
          if (updated.duelist2Id === duelistId) {
            updated.duelist2Id = '';
          }
          updated.duelist1Id = duelistId;
        } else {
          if (updated.duelist1Id === duelistId) {
            updated.duelist1Id = '';
          }
          updated.duelist2Id = duelistId;
        }

        // If changed a played match, reset its played status
        if (updated.played && (updated.duelist1Id !== m.duelist1Id || updated.duelist2Id !== m.duelist2Id)) {
          updated.played = false;
          updated.winnerId = null;
          updated.score1 = 0;
          updated.score2 = 0;
        }

        return updated;
      });
    });

    setActiveSlotTarget(null);
  };

  // Swap Duelist 1 and Duelist 2 in a match
  const handleSwapMatchDuelists = (matchId: string) => {
    soundEffects.playClick();
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          duelist1Id: m.duelist2Id,
          duelist2Id: m.duelist1Id,
          score1: m.score2,
          score2: m.score1,
          winnerId: m.winnerId === m.duelist1Id ? m.duelist2Id : m.winnerId === m.duelist2Id ? m.duelist1Id : m.winnerId
        };
      }
      return m;
    }));
  };

  // Clear single match
  const handleClearMatch = (matchId: string) => {
    soundEffects.playClick();
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          duelist1Id: '',
          duelist2Id: '',
          played: false,
          winnerId: null,
          score1: 0,
          score2: 0,
          narrativeSummary: undefined,
          narrativePrompt: undefined
        };
      }
      return m;
    }));
  };

  // Clear all 4 matches of current matchday
  const handleClearCurrentDay = () => {
    soundEffects.playClick();
    setMatches(prev => prev.map(m => {
      if (m.matchday === activeDay) {
        return {
          ...m,
          duelist1Id: '',
          duelist2Id: '',
          played: false,
          winnerId: null,
          score1: 0,
          score2: 0,
          narrativeSummary: undefined,
          narrativePrompt: undefined
        };
      }
      return m;
    }));
  };

  // Auto-complete unassigned slots in current matchday
  const handleAutoCompleteRemaining = () => {
    soundEffects.playVictory();
    const unassignedIds = group.duelistIds.filter(id => !assignedDuelistMap.has(id));
    if (unassignedIds.length === 0) return;

    // Shuffle unassigned
    const pool = [...unassignedIds].sort(() => Math.random() - 0.5);

    setMatches(prev => {
      return prev.map(m => {
        if (m.matchday !== activeDay) return m;
        let d1 = m.duelist1Id;
        let d2 = m.duelist2Id;

        if (!d1 && pool.length > 0) {
          d1 = pool.pop()!;
        }
        if (!d2 && pool.length > 0 && pool[pool.length - 1] !== d1) {
          d2 = pool.pop()!;
        } else if (!d2 && pool.length > 1) {
          const idx = pool.findIndex(id => id !== d1);
          if (idx !== -1) {
            d2 = pool.splice(idx, 1)[0];
          }
        }

        return {
          ...m,
          duelist1Id: d1,
          duelist2Id: d2
        };
      });
    });
  };

  // Restore default round-robin for current matchday
  const handleRestoreRoundRobin = () => {
    soundEffects.playClick();
    const defaultAll = generateGroupMatches(group.id, group.duelistIds);
    const defaultDay = defaultAll.filter(m => m.matchday === activeDay);

    setMatches(prev => {
      const nonDayMatches = prev.filter(m => m.matchday !== activeDay);
      return [...nonDayMatches, ...defaultDay].sort((a, b) => {
        if (a.matchday !== b.matchday) return a.matchday - b.matchday;
        return a.id.localeCompare(b.id);
      });
    });
  };

  // Save changes
  const handleSaveAndApply = () => {
    const incomplete = currentMatches.some(m => !m.duelist1Id || !m.duelist2Id);
    if (incomplete) {
      setValidationMessage('Advertencia: Hay mesas incompletas en esta jornada. Asigna duelistas a ambos lados o completa las vacantes.');
    }

    soundEffects.playVictory();
    onSaveGroupMatches(matches);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#080d1e] border border-cyan-500/40 rounded-2xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl space-y-5 text-slate-200 my-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Swords size={14} />
              <span>GESTOR DE ENFRENTAMIENTOS MANUALES (CERO AZAR)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Cruces de la Fase de Grupos · {group.name}</span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Elige y personaliza manualmente los competidores de cada mesa para la jornada seleccionada.
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Matchday Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-900/90 p-2 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 uppercase mr-1 pl-1">
            Jornada:
          </span>
          {[1, 2, 3, 4, 5, 6, 7].map(day => {
            const dayMatches = matches.filter(m => m.matchday === day);
            const isFull = dayMatches.length === 4 && dayMatches.every(m => m.duelist1Id && m.duelist2Id);
            const isSelected = activeDay === day;

            return (
              <button
                key={day}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveDay(day);
                  setActiveSlotTarget(null);
                  setValidationMessage(null);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>Jornada {day}</span>
                <span className={`text-[10px] px-1 rounded ${
                  isSelected ? 'bg-black/20 text-black font-bold' : isFull ? 'text-cyan-400' : 'text-slate-400'
                }`}>
                  {isFull ? '✓' : '...'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Competitors Pool of 8 Duelists */}
        <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-300">
              <Users size={14} className="text-cyan-400" />
              <span className="font-bold uppercase tracking-wider text-[11px]">
                Competidores del {group.name} (8 Duelistas)
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {assignedDuelistMap.size} de 8 asignados en Jornada {activeDay}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {groupDuelists.map(duelist => {
              const assignedInfo = assignedDuelistMap.get(duelist.id);
              const isAssigned = Boolean(assignedInfo);
              const isTargetedForSwap = activeSlotTarget !== null;

              return (
                <div
                  key={duelist.id}
                  onClick={() => {
                    if (activeSlotTarget) {
                      handleAssignDuelistToSlot(activeSlotTarget.matchId, activeSlotTarget.slot, duelist.id);
                    }
                  }}
                  className={`p-2 rounded-lg border text-xs transition-all relative select-none ${
                    isAssigned
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                      : 'bg-cyan-950/20 border-cyan-800/40 text-slate-200 hover:border-cyan-400 hover:bg-cyan-900/30'
                  } ${isTargetedForSwap ? 'cursor-pointer hover:ring-2 hover:ring-cyan-400' : ''}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm shrink-0">{duelist.avatarIcon}</span>
                    <span className={`font-semibold truncate text-[11px] ${
                      isAssigned ? 'text-slate-400' : 'text-white'
                    }`}>
                      {duelist.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="truncate max-w-[80px]">{duelist.era} · {duelist.archetype}</span>
                    {isAssigned ? (
                      <span className="text-cyan-400 font-bold shrink-0">
                        Mesa {assignedInfo?.mesaIndex}
                      </span>
                    ) : (
                      <span className="text-cyan-300 font-bold shrink-0">
                        Libre
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {activeSlotTarget && (
            <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-700/50 p-2 rounded flex items-center justify-between animate-pulse">
              <span>Haz clic en cualquier duelista de arriba para colocarlo en el espacio seleccionado.</span>
              <button 
                onClick={() => setActiveSlotTarget(null)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* 4 Matchups for the Active Matchday */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Swords size={14} className="text-cyan-400" />
              <span>Enfrentamientos de la Jornada {activeDay} (4 Mesas)</span>
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleAutoCompleteRemaining}
                className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Completar los puestos vacantes con los duelistas libres del grupo"
              >
                <Wand2 size={12} />
                <span>Auto-completar Vacantes</span>
              </button>
              <button
                onClick={handleClearCurrentDay}
                className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Limpiar todas las mesas de esta jornada"
              >
                <Trash2 size={12} />
                <span>Limpiar Jornada</span>
              </button>
              <button
                onClick={handleRestoreRoundRobin}
                className="px-2 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Restablecer cruces por defecto (Round Robin)"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentMatches.map((match, mIdx) => {
              const d1 = duelistsMap.get(match.duelist1Id);
              const d2 = duelistsMap.get(match.duelist2Id);
              const isD1Target = activeSlotTarget?.matchId === match.id && activeSlotTarget.slot === 1;
              const isD2Target = activeSlotTarget?.matchId === match.id && activeSlotTarget.slot === 2;

              return (
                <div
                  key={match.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    match.played
                      ? 'bg-slate-900/90 border-slate-700'
                      : d1 && d2
                      ? 'bg-[#0a0f24] border-cyan-900/50'
                      : 'bg-[#0a0d1a] border-dashed border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-400">
                      MESA {mIdx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {match.played ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                          Jugado ({match.score1} - {match.score2})
                        </span>
                      ) : d1 && d2 ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <Check size={11} /> Cruce Configurado
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400">
                          Incompleto
                        </span>
                      )}

                      <button
                        onClick={() => handleSwapMatchDuelists(match.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="Invertir posiciones (Jugador 1 ⇄ Jugador 2)"
                      >
                        <ArrowLeftRight size={12} />
                      </button>

                      <button
                        onClick={() => handleClearMatch(match.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Vaciar esta mesa"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Dual Selectors Row */}
                  <div className="grid grid-cols-11 items-center gap-2">
                    {/* Slot Duelist 1 */}
                    <div className="col-span-5">
                      <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                        <span>Lado 1</span>
                        <button
                          onClick={() => setActiveSlotTarget(isD1Target ? null : { matchId: match.id, slot: 1 })}
                          className="text-cyan-400 hover:underline cursor-pointer"
                        >
                          {isD1Target ? 'Cancel' : 'Elegir'}
                        </button>
                      </div>
                      
                      <select
                        value={match.duelist1Id || ''}
                        onChange={(e) => handleAssignDuelistToSlot(match.id, 1, e.target.value)}
                        className={`w-full bg-[#050814] text-xs font-mono rounded-lg px-2.5 py-2 border transition-colors outline-none cursor-pointer ${
                          isD1Target
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : d1
                            ? 'border-slate-700 text-white'
                            : 'border-dashed border-slate-600 text-slate-400'
                        }`}
                      >
                        <option value="">-- Seleccionar --</option>
                        {groupDuelists.map(duelist => {
                          const assignedToAnother = assignedDuelistMap.get(duelist.id);
                          const isAssignedElsewhere = assignedToAnother && assignedToAnother.matchId !== match.id;

                          return (
                            <option key={duelist.id} value={duelist.id}>
                              {duelist.name} ({duelist.era}) {isAssignedElsewhere ? `[Mesa ${assignedToAnother.mesaIndex}]` : ''}
                            </option>
                          );
                        })}
                      </select>

                      {d1 && (
                        <div className="mt-1 text-[10px] text-slate-400 truncate pl-1 flex items-center gap-1">
                          <span className="text-cyan-400 font-semibold">{d1.archetype}</span>
                        </div>
                      )}
                    </div>

                    {/* VS Badge */}
                    <div className="col-span-1 text-center font-mono text-xs font-bold text-slate-500">
                      VS
                    </div>

                    {/* Slot Duelist 2 */}
                    <div className="col-span-5">
                      <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                        <span>Lado 2</span>
                        <button
                          onClick={() => setActiveSlotTarget(isD2Target ? null : { matchId: match.id, slot: 2 })}
                          className="text-cyan-400 hover:underline cursor-pointer"
                        >
                          {isD2Target ? 'Cancel' : 'Elegir'}
                        </button>
                      </div>

                      <select
                        value={match.duelist2Id || ''}
                        onChange={(e) => handleAssignDuelistToSlot(match.id, 2, e.target.value)}
                        className={`w-full bg-[#050814] text-xs font-mono rounded-lg px-2.5 py-2 border transition-colors outline-none cursor-pointer ${
                          isD2Target
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : d2
                            ? 'border-slate-700 text-white'
                            : 'border-dashed border-slate-600 text-slate-400'
                        }`}
                      >
                        <option value="">-- Seleccionar --</option>
                        {groupDuelists.map(duelist => {
                          const assignedToAnother = assignedDuelistMap.get(duelist.id);
                          const isAssignedElsewhere = assignedToAnother && assignedToAnother.matchId !== match.id;

                          return (
                            <option key={duelist.id} value={duelist.id}>
                              {duelist.name} ({duelist.era}) {isAssignedElsewhere ? `[Mesa ${assignedToAnother.mesaIndex}]` : ''}
                            </option>
                          );
                        })}
                      </select>

                      {d2 && (
                        <div className="mt-1 text-[10px] text-slate-400 truncate pl-1 flex items-center gap-1">
                          <span className="text-cyan-400 font-semibold">{d2.archetype}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Warning */}
        {validationMessage && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{validationMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 gap-3">
          <div className="text-xs text-slate-400 font-mono">
            * Los cambios se aplican de inmediato en la tabla de posiciones y en las mesas del grupo.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAndApply}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg shadow-lg shadow-cyan-950 transition-all cursor-pointer"
            >
              <ShieldCheck size={14} />
              <span>Guardar y Aplicar Cruces</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
