import React, { useState, useEffect } from 'react';
import { BracketMatch, Duelist, Group } from '../types/tournament';
import { getTop4FromAllGroups } from '../utils/tournamentHelpers';
import { soundEffects } from '../utils/audio';
import { Sparkles, Play, FastForward, CheckCircle2, ArrowRight, Dices, Shuffle, Check } from 'lucide-react';

interface LiveDrawStageProps {
  groups: Group[];
  bracketMatches: BracketMatch[];
  duelistsMap: Map<string, Duelist>;
  onUpdateBracketMatches: (matches: BracketMatch[]) => void;
  onProceedToBrackets: () => void;
  onBackToGroups: () => void;
}

export const LiveDrawStage: React.FC<LiveDrawStageProps> = ({
  groups,
  bracketMatches,
  duelistsMap,
  onUpdateBracketMatches,
  onProceedToBrackets,
  onBackToGroups
}) => {
  const [drawMode, setDrawMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [currentDrawn, setCurrentDrawn] = useState<{
    duelist: Duelist;
    slotName: string;
    matchIndex: number;
    position: 1 | 2;
    groupOrigin: string;
    groupRank: number;
  } | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  // 32 qualified duelists from top 4 of each group
  const qualifiedList = getTop4FromAllGroups(groups);

  // Identify assigned slots in Round of 32 (16 matches, 2 slots per match = 32 slots)
  const r32Matches = bracketMatches.filter(m => m.stage === 'r32');
  
  // Find which qualified duelists have already been assigned
  const assignedDuelistIds = new Set<string>();
  r32Matches.forEach(m => {
    if (m.duelist1Id) assignedDuelistIds.add(m.duelist1Id);
    if (m.duelist2Id) assignedDuelistIds.add(m.duelist2Id);
  });

  const remainingQualified = qualifiedList.filter(q => !assignedDuelistIds.has(q.duelistId));
  const isComplete = assignedDuelistIds.size === 32;

  // Single step live draw: reveals duelist first, then immediate slot in bracket
  const handleDrawNext = () => {
    if (remainingQualified.length === 0 || isDrawing) return;

    setIsDrawing(true);
    soundEffects.playClick();

    // 1. Pick next duelist at random from remaining qualified
    const randomIndex = Math.floor(Math.random() * remainingQualified.length);
    const chosen = remainingQualified[randomIndex];
    const duelist = duelistsMap.get(chosen.duelistId);

    // 2. Find next available empty slot in Round of 32 matches
    let targetMatch: BracketMatch | null = null;
    let targetPosition: 1 | 2 = 1;

    for (const m of r32Matches) {
      if (!m.duelist1Id) {
        targetMatch = m;
        targetPosition = 1;
        break;
      } else if (!m.duelist2Id) {
        targetMatch = m;
        targetPosition = 2;
        break;
      }
    }

    if (!targetMatch || !duelist) {
      setIsDrawing(false);
      return;
    }

    setTimeout(() => {
      soundEffects.playDrawReveal();

      // Update state
      setCurrentDrawn({
        duelist,
        slotName: targetMatch!.slotName,
        matchIndex: targetMatch!.matchIndex,
        position: targetPosition,
        groupOrigin: chosen.groupId,
        groupRank: chosen.rank
      });

      // Update matches
      const updatedMatches = bracketMatches.map(m => {
        if (m.id === targetMatch!.id) {
          return {
            ...m,
            [targetPosition === 1 ? 'duelist1Id' : 'duelist2Id']: duelist.id
          };
        }
        return m;
      });

      onUpdateBracketMatches(updatedMatches);
      setIsDrawing(false);
    }, 400);
  };

  // Full instant auto draw
  const handleDrawAllInstant = () => {
    soundEffects.playVictory();
    const shuffledQualified = [...qualifiedList].sort(() => Math.random() - 0.5);

    let idx = 0;
    const updated = bracketMatches.map(m => {
      if (m.stage === 'r32') {
        const d1 = shuffledQualified[idx++];
        const d2 = shuffledQualified[idx++];
        return {
          ...m,
          duelist1Id: d1 ? d1.duelistId : null,
          duelist2Id: d2 ? d2.duelistId : null,
          played: false,
          score1: 0,
          score2: 0,
          winnerId: null
        };
      }
      return {
        ...m,
        duelist1Id: null,
        duelist2Id: null,
        played: false,
        score1: 0,
        score2: 0,
        winnerId: null
      };
    });

    onUpdateBracketMatches(updated);
  };

  // Reset bracket draw
  const handleResetDraw = () => {
    soundEffects.playClick();
    setCurrentDrawn(null);
    const resetMatches = bracketMatches.map(m => ({
      ...m,
      duelist1Id: null,
      duelist2Id: null,
      played: false,
      score1: 0,
      score2: 0,
      winnerId: null
    }));
    onUpdateBracketMatches(resetMatches);
  };

  // Manual assignment handler
  const handleManualAssign = (matchId: string, position: 1 | 2, duelistId: string) => {
    soundEffects.playClick();
    const updated = bracketMatches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          [position === 1 ? 'duelist1Id' : 'duelist2Id']: duelistId || null
        };
      }
      return m;
    });
    onUpdateBracketMatches(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#080d1e] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>FASE 4 :: SORTEO EN VIVO ESTILO RED BULL BATALLA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sorteo de Llaves de Dieciseisavos (32 Clasificados)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Mecánica oficial: <strong>Primero sale el nombre del duelista</strong> y se <strong>revela inmediatamente su casillero exacto</strong> en el cuadro.
          </p>
        </div>

        {/* Counter & Action */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="text-slate-400">Asignados: </span>
            <span className="font-bold text-cyan-400">{assignedDuelistIds.size} / 32</span>
          </div>

          <button
            onClick={() => {
              if (isComplete) {
                soundEffects.playVictory();
                onProceedToBrackets();
              }
            }}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              isComplete
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black shadow-lg shadow-amber-950 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>Ir al Cuadro de Llaves</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Mode Selector and Draw Control Center */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Toggle Mode */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Modo de Sorteo:</span>
          <div className="flex p-1 bg-black/40 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                soundEffects.playClick();
                setDrawMode('AUTO');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                drawMode === 'AUTO' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sorteo Auto en Vivo
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setDrawMode('MANUAL');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                drawMode === 'MANUAL' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sorteo Manual
            </button>
          </div>
        </div>

        {/* Draw Buttons */}
        {drawMode === 'AUTO' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDrawNext}
              disabled={isComplete || isDrawing}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                !isComplete && !isDrawing
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-md shadow-cyan-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Dices size={15} />
              <span>{isDrawing ? 'Extrayendo Bola...' : 'Extraer Siguiente Duelista'}</span>
            </button>

            <button
              onClick={handleDrawAllInstant}
              disabled={isComplete}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <FastForward size={14} />
              <span>Sorteo Rápido Completo</span>
            </button>

            <button
              onClick={handleResetDraw}
              className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition-colors"
              title="Reiniciar Sorteo"
            >
              Reiniciar
            </button>
          </div>
        )}
      </div>

      {/* Live Dramatic Reveal Stage (Red Bull Batalla style) */}
      {drawMode === 'AUTO' && currentDrawn && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-[#0a0f24] to-indigo-950/80 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-950/60 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            ¡BOLA EXTRAÍDA DEL BOMBO OFICIAL!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {/* 1. Duelist Revealed */}
            <div className="text-center sm:text-right">
              <span className="text-4xl block mb-1">{currentDrawn.duelist.avatarIcon}</span>
              <div className="text-2xl font-black text-white tracking-tight">
                {currentDrawn.duelist.name}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {currentDrawn.duelist.archetype}
              </div>
              <div className="text-[11px] font-mono text-cyan-400 mt-1">
                Clasificado: Grupo {currentDrawn.groupOrigin} (Puesto {currentDrawn.groupRank}º)
              </div>
            </div>

            <div className="text-2xl text-cyan-400 font-bold hidden sm:block">➔</div>

            {/* 2. Immediate Bracket Slot Revealed */}
            <div className="text-center sm:text-left p-4 rounded-xl bg-black/60 border border-cyan-500/50">
              <div className="text-[11px] font-mono text-amber-400 uppercase font-bold">
                ASIGNADO INMEDIATAMENTE A:
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                {currentDrawn.slotName}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Posición {currentDrawn.position} de la Llave
              </div>
              <div className="text-[10px] text-slate-500 italic mt-1">
                (El duelista no elige su lugar · Destino fijado)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of 16 R32 Bracket Slots (Llaves A-1 a A-8 y B-1 a B-8) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Cuadro de Dieciseisavos (16 Llaves de 2 Duelistas)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Llaves A-1 a A-8 (Lado A) | Llaves B-1 a B-8 (Lado B)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {r32Matches.map((m) => {
            const d1 = m.duelist1Id ? duelistsMap.get(m.duelist1Id) : null;
            const d2 = m.duelist2Id ? duelistsMap.get(m.duelist2Id) : null;

            return (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-[#070b17] border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800/80 pb-1.5">
                  <span className="font-bold text-cyan-400">{m.slotName}</span>
                  <span className="text-[10px]">Duelo {m.matchIndex}</span>
                </div>

                {/* Slot 1 */}
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60 min-h-[46px] flex items-center justify-between gap-2">
                  {d1 ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{d1.avatarIcon}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{d1.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{d1.archetype}</div>
                      </div>
                    </div>
                  ) : drawMode === 'MANUAL' ? (
                    <select
                      onChange={e => handleManualAssign(m.id, 1, e.target.value)}
                      className="w-full bg-black text-xs text-slate-300 p-1 rounded border border-slate-700"
                    >
                      <option value="">-- Asignar Duelista 1 --</option>
                      {qualifiedList.map(q => {
                        const d = duelistsMap.get(q.duelistId);
                        if (!d || (assignedDuelistIds.has(d.id) && m.duelist1Id !== d.id)) return null;
                        return (
                          <option key={d.id} value={d.id}>
                            {d.name} (G.{q.groupId}-{q.rank}º)
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono italic">
                      [Esperando Sorteo...]
                    </span>
                  )}
                  {d1 && <span className="text-[10px] font-mono text-cyan-400 shrink-0">{d1.era}</span>}
                </div>

                <div className="text-center text-[10px] font-mono text-slate-500 font-bold">VS</div>

                {/* Slot 2 */}
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60 min-h-[46px] flex items-center justify-between gap-2">
                  {d2 ? (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{d2.avatarIcon}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{d2.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{d2.archetype}</div>
                      </div>
                    </div>
                  ) : drawMode === 'MANUAL' ? (
                    <select
                      onChange={e => handleManualAssign(m.id, 2, e.target.value)}
                      className="w-full bg-black text-xs text-slate-300 p-1 rounded border border-slate-700"
                    >
                      <option value="">-- Asignar Duelista 2 --</option>
                      {qualifiedList.map(q => {
                        const d = duelistsMap.get(q.duelistId);
                        if (!d || (assignedDuelistIds.has(d.id) && m.duelist2Id !== d.id)) return null;
                        return (
                          <option key={d.id} value={d.id}>
                            {d.name} (G.{q.groupId}-{q.rank}º)
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono italic">
                      [Esperando Sorteo...]
                    </span>
                  )}
                  {d2 && <span className="text-[10px] font-mono text-cyan-400 shrink-0">{d2.era}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
