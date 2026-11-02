import React, { useState, useEffect } from 'react';
import { Bombo, Duelist, Group } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { createEmptyGroupMatches } from '../utils/tournamentHelpers';
import { 
  Dices, 
  X, 
  Check, 
  Shuffle, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  ArrowRight,
  Flame
} from 'lucide-react';

interface GroupDrawFromBombosModalProps {
  isOpen: boolean;
  onClose: () => void;
  bombos: Bombo[];
  duelistsMap: Map<string, Duelist>;
  onConfirmGroups: (newGroups: Group[]) => void;
}

export const GroupDrawFromBombosModal: React.FC<GroupDrawFromBombosModalProps> = ({
  isOpen,
  onClose,
  bombos,
  duelistsMap,
  onConfirmGroups
}) => {
  const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // State: mapping for each group (A..H) -> 8 duelist IDs (one from each of the 8 bombos in order)
  // groupAssignments: { [groupLetter: string]: (string | null)[] } (array of 8 slots, slot i corresponds to bombo i)
  const [groupAssignments, setGroupAssignments] = useState<{ [key: string]: (string | null)[] }>({});
  const [activeTab, setActiveTab] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawn, setLastDrawn] = useState<{
    duelist: Duelist;
    bomboName: string;
    groupLetter: string;
  } | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      const initial: { [key: string]: (string | null)[] } = {};
      groupIds.forEach(letter => {
        initial[letter] = Array(8).fill(null);
      });
      setGroupAssignments(initial);
      setLastDrawn(null);
      setIsDrawing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate assigned count
  const totalAssigned = Object.values(groupAssignments).reduce((acc, slots) => {
    return acc + slots.filter(Boolean).length;
  }, 0);
  const isComplete = totalAssigned === 64;

  // 1. Step-by-step assisted draw
  const handleDrawNext = () => {
    if (isComplete || isDrawing) return;

    // Find the first unfilled slot: bomboIndex (0..7), groupIndex (0..7)
    let targetBomboIdx = -1;
    let targetGroupLetter = '';

    for (let bIdx = 0; bIdx < 8; bIdx++) {
      for (const letter of groupIds) {
        if (!groupAssignments[letter]?.[bIdx]) {
          targetBomboIdx = bIdx;
          targetGroupLetter = letter;
          break;
        }
      }
      if (targetBomboIdx !== -1) break;
    }

    if (targetBomboIdx === -1 || !targetGroupLetter) return;

    const currentBombo = bombos[targetBomboIdx];
    if (!currentBombo) return;

    // Available duelists in this bombo that have not yet been assigned to any group
    const assignedFromThisBombo = new Set(
      groupIds.map(letter => groupAssignments[letter]?.[targetBomboIdx]).filter(Boolean)
    );
    const availableIds = currentBombo.duelistIds.filter(id => !assignedFromThisBombo.has(id));

    if (availableIds.length === 0) return;

    setIsDrawing(true);
    soundEffects.playClick();

    setTimeout(() => {
      // Pick random duelist from available
      const randomIdx = Math.floor(Math.random() * availableIds.length);
      const chosenId = availableIds[randomIdx];
      const duelist = duelistsMap.get(chosenId);

      if (duelist) {
        soundEffects.playDrawReveal();
        setLastDrawn({
          duelist,
          bomboName: currentBombo.name,
          groupLetter: targetGroupLetter
        });

        setGroupAssignments(prev => {
          const updated = { ...prev };
          const slots = [...(updated[targetGroupLetter] || Array(8).fill(null))];
          slots[targetBomboIdx] = chosenId;
          updated[targetGroupLetter] = slots;
          return updated;
        });
      }

      setIsDrawing(false);
    }, 280);
  };

  // 2. Instant full draw (Balanced: each group gets 1 from each bombo)
  const handleDrawAllInstant = () => {
    soundEffects.playVictory();
    const newAssignments: { [key: string]: string[] } = {};
    groupIds.forEach(letter => {
      newAssignments[letter] = [];
    });

    // For each bombo (0..7), shuffle its 8 duelists and distribute 1 to each group (A..H)
    bombos.forEach((bombo) => {
      const shuffledIds = [...bombo.duelistIds].sort(() => Math.random() - 0.5);
      groupIds.forEach((letter, gIdx) => {
        newAssignments[letter].push(shuffledIds[gIdx] || '');
      });
    });

    setGroupAssignments(newAssignments);
    setLastDrawn(null);
  };

  // 3. Reset assignments
  const handleResetDraw = () => {
    soundEffects.playClick();
    const empty: { [key: string]: (string | null)[] } = {};
    groupIds.forEach(letter => {
      empty[letter] = Array(8).fill(null);
    });
    setGroupAssignments(empty);
    setLastDrawn(null);
  };

  // 4. Manual Assignment for a slot
  const handleManualSlotChange = (groupLetter: string, bomboIdx: number, selectedDuelistId: string) => {
    soundEffects.playClick();
    setGroupAssignments(prev => {
      const updated = { ...prev };

      // If this duelist was already assigned in this bombo to another group, remove them from that group
      if (selectedDuelistId) {
        groupIds.forEach(letter => {
          if (letter !== groupLetter && updated[letter]?.[bomboIdx] === selectedDuelistId) {
            const copySlots = [...updated[letter]];
            copySlots[bomboIdx] = null;
            updated[letter] = copySlots;
          }
        });
      }

      const slots = [...(updated[groupLetter] || Array(8).fill(null))];
      slots[bomboIdx] = selectedDuelistId || null;
      updated[groupLetter] = slots;
      return updated;
    });
  };

  // 5. Confirm and proceed to Groups phase
  const handleConfirm = () => {
    if (!isComplete) return;
    soundEffects.playVictory();

    const finalizedGroups: Group[] = groupIds.map(letter => {
      const rawIds = (groupAssignments[letter] || []).filter((id): id is string => Boolean(id));
      return {
        id: letter,
        name: `Grupo ${letter}`,
        duelistIds: rawIds,
        matches: createEmptyGroupMatches(letter) // Matches start empty for manual zero-azar pairing!
      };
    });

    onConfirmGroups(finalizedGroups);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#09101d] border border-cyan-500/50 rounded-2xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl space-y-5 text-slate-200 my-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-blue-950/70 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Layers size={14} />
              <span>PASO 3 :: ARMADO DE GRUPOS POR BOMBOS (EQUILIBRIO COMPETITIVO)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Sorteo de Grupos Oficial (Grupos A al H)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-[#00d2ff] border border-cyan-700/60 font-mono">
                {totalAssigned} / 64 Asignados
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 max-w-3xl">
              Cada grupo (A al H) recibe obligatoriamente <strong>exactamente 1 duelista de cada uno de los 8 bombos</strong>, garantizando equidad deportiva absoluta. Los enfrentamientos posteriores arrancarán vacíos para asignación manual.
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector & Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0d1526] border border-blue-950/60 rounded-xl text-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('AUTO');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'AUTO'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                  : 'bg-[#09101d] text-slate-300 hover:text-white border border-blue-950'
              }`}
            >
              <Dices size={14} />
              <span>Sorteo Automático / Asistido</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('MANUAL');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'MANUAL'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                  : 'bg-[#09101d] text-slate-300 hover:text-white border border-blue-950'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Asignación Manual por Bombos</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'AUTO' && (
              <>
                <button
                  onClick={handleDrawNext}
                  disabled={isComplete || isDrawing}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    !isComplete && !isDrawing
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-md shadow-cyan-950 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>{isDrawing ? 'Extrayendo...' : 'Extraer Siguiente'}</span>
                </button>

                <button
                  onClick={handleDrawAllInstant}
                  disabled={isComplete}
                  className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800/60 text-cyan-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Shuffle size={13} />
                  <span>Sorteo Completo Equitativo</span>
                </button>
              </>
            )}

            <button
              onClick={handleResetDraw}
              className="px-2.5 py-1.5 rounded-lg bg-[#09101d] hover:bg-[#121c33] text-slate-400 hover:text-rose-400 border border-blue-950 transition-colors cursor-pointer flex items-center gap-1"
              title="Restablecer grupos a estado vacío"
            >
              <RotateCcw size={12} />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        {/* Live dramatic reveal banner for assisted auto draw */}
        {activeTab === 'AUTO' && lastDrawn && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 via-[#0b1428] to-cyan-950/40 border border-[#00d2ff]/60 flex items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0b1329] border border-blue-900/60 flex items-center justify-center shrink-0">
                {lastDrawn.duelist.avatarUrl ? (
                  <img src={lastDrawn.duelist.avatarUrl} alt={lastDrawn.duelist.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-lg">{lastDrawn.duelist.avatarIcon}</span>
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                  {lastDrawn.bomboName} ➔ ¡BOLA EXTRAÍDA!
                </span>
                <span className="font-bold text-white text-sm">
                  {lastDrawn.duelist.name}
                </span>
                <span className="text-xs text-slate-400 ml-2 font-mono">
                  ({lastDrawn.duelist.era} · {lastDrawn.duelist.archetype})
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block">ASIGNADO A:</span>
              <span className="text-sm font-extrabold text-[#00d2ff] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800">
                GRUPO {lastDrawn.groupLetter}
              </span>
            </div>
          </div>
        )}

        {/* 8 Groups Grid (A al H) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 max-h-[52vh] overflow-y-auto pr-1">
          {groupIds.map(letter => {
            const slots = groupAssignments[letter] || Array(8).fill(null);
            const assignedInGroup = slots.filter(Boolean).length;
            const isGroupFull = assignedInGroup === 8;

            return (
              <div
                key={letter}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  isGroupFull 
                    ? 'bg-[#09101d] border-blue-900/80' 
                    : 'bg-[#070b16] border-blue-950/50'
                }`}
              >
                {/* Group Header */}
                <div className="flex items-center justify-between pb-2 border-b border-blue-950/60 mb-2">
                  <span className="font-bold text-white font-sans text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff] inline-block shadow-[0_0_6px_#00e5ff]" />
                    <span>Grupo {letter}</span>
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isGroupFull 
                      ? 'bg-blue-950 text-[#00d2ff] border border-blue-800 font-bold' 
                      : 'bg-black/40 text-slate-400'
                  }`}>
                    {assignedInGroup}/8 Duelistas
                  </span>
                </div>

                {/* 8 Bombo Slots */}
                <div className="space-y-1.5 flex-1">
                  {bombos.map((bombo, bIdx) => {
                    const assignedDuelistId = slots[bIdx];
                    const duelist = assignedDuelistId ? duelistsMap.get(assignedDuelistId) : null;

                    // For manual tab, find which duelists from this bombo are available
                    const assignedFromThisBombo = new Set(
                      groupIds.map(l => groupAssignments[l]?.[bIdx]).filter(Boolean)
                    );

                    return (
                      <div
                        key={bombo.id}
                        className={`p-1.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                          duelist 
                            ? 'bg-blue-950/30 border-blue-900/40 text-slate-200' 
                            : 'bg-black/30 border-dashed border-blue-950 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-[9px] font-mono font-bold text-cyan-400/90 shrink-0 w-8">
                            B{bIdx + 1}:
                          </span>

                          {activeTab === 'MANUAL' ? (
                            <select
                              value={assignedDuelistId || ''}
                              onChange={e => handleManualSlotChange(letter, bIdx, e.target.value)}
                              className="w-full bg-[#0b1329] text-xs text-slate-200 border border-blue-900/60 rounded px-1.5 py-0.5 focus:border-cyan-400 outline-none"
                            >
                              <option value="">-- Asignar de {bombo.name} --</option>
                              {bombo.duelistIds.map(dId => {
                                const d = duelistsMap.get(dId);
                                if (!d) return null;
                                const isUsedElsewhere = assignedFromThisBombo.has(dId) && assignedDuelistId !== dId;
                                return (
                                  <option key={dId} value={dId} disabled={isUsedElsewhere}>
                                    {d.name} ({d.era}) {isUsedElsewhere ? '[Asignado]' : ''}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <div className="truncate flex-1 min-w-0">
                              {duelist ? (
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-semibold text-white truncate text-[11px]">
                                    {duelist.name}
                                  </span>
                                  <span className="text-[9px] font-mono text-cyan-300 shrink-0">
                                    {duelist.era}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] italic text-slate-500 font-mono">
                                  Vacante (Esperando sorteo)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-blue-950/70 gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {isComplete ? (
              <span className="text-[#00d2ff] font-semibold flex items-center gap-1.5">
                <Check size={14} />
                <span>¡Los 64 duelistas han sido balanceados con éxito (1 de cada bombo por grupo)!</span>
              </span>
            ) : (
              <span>Faltan {64 - totalAssigned} duelistas por asignar para completar los 8 grupos.</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirm}
              disabled={!isComplete}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                isComplete
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-lg shadow-cyan-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Confirmar Grupos y Habilitar Jornadas</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
