import React, { useState } from 'react';
import { Bombo, Duelist, Group, GroupMatch, GroupStanding } from '../types/tournament';
import { calculateGroupStandings, createEmptyGroupMatches } from '../utils/tournamentHelpers';
import { soundEffects } from '../utils/audio';
import { Swords, Trophy, ArrowRight, CheckCircle2, ChevronRight, Eye, RotateCcw, Crown, Zap, Wand2, Layers, FileText, SlidersHorizontal, UserCheck, Scale, Gavel, Dices } from 'lucide-react';
import { MatchDirectorModal } from './MatchDirectorModal';
import { CharacterCardModal } from './CharacterCardModal';
import { ManualPairingsModal } from './ManualPairingsModal';
import { CommissionerTieBreakerModal } from './CommissionerTieBreakerModal';
import { GroupDrawFromBombosModal } from './GroupDrawFromBombosModal';

interface GroupsManagerProps {
  groups: Group[];
  bombos?: Bombo[];
  duelistsMap: Map<string, Duelist>;
  onUpdateGroupMatches: (groupId: string, matches: GroupMatch[]) => void;
  onUpdateGroupDuelists: (groupId: string, duelistIds: string[]) => void;
  onUpdateGroupOverrides?: (groupId: string, overrides: string[] | undefined) => void;
  onProceedToLiveDraw: () => void;
  onBackToBombos: () => void;
  onUpdateDuelist?: (duelist: Duelist) => void;
}

export const GroupsManager: React.FC<GroupsManagerProps> = ({
  groups,
  bombos = [],
  duelistsMap,
  onUpdateGroupMatches,
  onUpdateGroupDuelists,
  onUpdateGroupOverrides,
  onProceedToLiveDraw,
  onBackToBombos,
  onUpdateDuelist
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string>('A');
  const [activeMatchday, setActiveMatchday] = useState<number>(1);
  const [selectedMatch, setSelectedMatch] = useState<GroupMatch | null>(null);
  const [viewChronicleMatch, setViewChronicleMatch] = useState<GroupMatch | null>(null);
  const [inspectFichaDuelist, setInspectFichaDuelist] = useState<Duelist | null>(null);
  const [isFichaOpen, setIsFichaOpen] = useState(false);
  const [isManualPairingsOpen, setIsManualPairingsOpen] = useState(false);
  const [isTieBreakerOpen, setIsTieBreakerOpen] = useState(false);
  const [isGroupDrawModalOpen, setIsGroupDrawModalOpen] = useState(false);

  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];
  const standings = calculateGroupStandings(activeGroup);

  // Filter matches for active matchday
  const matchdayMatches = activeGroup.matches.filter(m => m.matchday === activeMatchday);

  // Check overall tournament completion in group phase
  const totalMatches = groups.reduce((acc, g) => acc + g.matches.length, 0);
  const playedMatches = groups.reduce((acc, g) => acc + g.matches.filter(m => m.played).length, 0);

  const handleOpenDirector = (match: GroupMatch) => {
    soundEffects.playClick();
    setSelectedMatch(match);
  };

  const handleSaveMatchResult = (result: {
    winnerId: string | 'DRAW';
    score1: number;
    score2: number;
    narrativePrompt: string;
    narrativeSummary: string;
    variantDeck1: string;
    variantDeck2: string;
  }) => {
    if (!selectedMatch) return;

    const updated = activeGroup.matches.map(m => {
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          winnerId: result.winnerId,
          score1: result.score1,
          score2: result.score2,
          narrativePrompt: result.narrativePrompt,
          narrativeSummary: result.narrativeSummary,
          variantDeck1: result.variantDeck1,
          variantDeck2: result.variantDeck2,
          played: true
        };
      }
      return m;
    });

    onUpdateGroupMatches(activeGroup.id, updated);
    setSelectedMatch(null);
  };

  // Auto-resolve pending matches for active group with strategic plausibility
  const handleAutoResolveGroup = () => {
    soundEffects.playVictory();
    const updated = activeGroup.matches.map(m => {
      if (m.played) return m;
      const d1 = duelistsMap.get(m.duelist1Id);
      const d2 = duelistsMap.get(m.duelist2Id);
      if (!d1 || !d2) return m;

      const rand = Math.random();
      let winnerId: string | 'DRAW';
      let s1 = 0;
      let s2 = 0;

      if (rand < 0.45) {
        winnerId = d1.id;
        s1 = 2;
        s2 = Math.random() > 0.5 ? 1 : 0;
      } else if (rand < 0.9) {
        winnerId = d2.id;
        s2 = 2;
        s1 = Math.random() > 0.5 ? 1 : 0;
      } else {
        winnerId = 'DRAW';
        s1 = 1;
        s2 = 1;
      }

      return {
        ...m,
        winnerId,
        score1: s1,
        score2: s2,
        played: true,
        narrativeSummary: `Duelo oficial resuelto en la Jornada ${m.matchday}. ${
          winnerId === 'DRAW' ? 'Empate tras intensa batalla.' : `Victoria de ${winnerId === d1.id ? d1.name : d2.name}.`
        }`
      };
    });

    onUpdateGroupMatches(activeGroup.id, updated);
  };

  // Reset matches in active group
  const handleResetGroupMatches = () => {
    soundEffects.playClick();
    const resetMatches = activeGroup.matches.map(m => ({
      ...m,
      played: false,
      winnerId: null,
      score1: 0,
      score2: 0,
      narrativePrompt: undefined,
      narrativeSummary: undefined
    }));
    onUpdateGroupMatches(activeGroup.id, resetMatches);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#080d1e] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>MÓDULO 3 :: MOTOR DE RESULTADOS & CONTROL CREATIVO (CERO AZAR)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Fase de Grupos Multiversal</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-[#00d2ff] font-mono">
              Top 4 Clasifica (32 Duelistas)
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Control manual de cada duelo por jornada. Puntuación: <strong className="text-cyan-400">+3 Victoria</strong> | <strong className="text-slate-300">+1 Empate</strong> | <strong className="text-rose-400/80">0 Derrota</strong>. Desempate oficial: <span className="text-neutral-300 font-medium">1° DG → 2° GF → 3° Head-to-Head → 4° Sorteo / Comisionado</span>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right text-xs font-mono hidden sm:block">
            <div className="text-slate-400">Progreso Total</div>
            <div className="text-cyan-400 font-bold">{playedMatches} / {totalMatches} Duelos</div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToBombos();
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Volver a la gestión y configuración de bombos"
          >
            <RotateCcw size={13} />
            <span className="hidden md:inline">Fase de Bombos</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsGroupDrawModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-[#09152b] hover:bg-blue-900/80 border border-cyan-500/60 text-cyan-300 rounded-lg shadow-sm transition-all cursor-pointer"
            title="Configurar y sortear integrantes de grupos desde los bombos (Sorteo asistido o manual con 1 por bombo)"
          >
            <Dices size={14} className="text-cyan-400" />
            <span>Sorteo de Grupos</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsManualPairingsOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 rounded-lg shadow-md transition-all cursor-pointer"
            title="Elegir y personalizar manualmente los cruces de este grupo seleccionando competidores"
          >
            <Swords size={14} />
            <span>Elegir Cruces Manuales</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playVictory();
              onProceedToLiveDraw();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg shadow-lg shadow-cyan-950/60 transition-all cursor-pointer"
          >
            <span>Ir a Sorteo R32</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Group Navigation Tabs (Grupos A al H) */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
        {groups.map(group => {
          const groupPlayed = group.matches.filter(m => m.played).length;
          const groupTotal = group.matches.length;
          const isSelected = group.id === activeGroupId;

          return (
            <button
              key={group.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveGroupId(group.id);
              }}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{group.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isSelected ? 'bg-black/20 text-black font-semibold' : 'bg-slate-800 text-slate-400'
              }`}>
                {groupPlayed}/{groupTotal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Group Content: 2-Column Split (Table of Standings & Matchdays) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Table of Standings (7 cols) - Clean Sports Dashboard Style */}
        <div className="lg:col-span-7 bg-[#09101d] border border-blue-950/50 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-3.5 bg-[#0d1526] border-b border-blue-950/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy size={15} className="text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-sans">
                Tabla de Posiciones · {activeGroup.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-sans">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsTieBreakerOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-[11px] font-sans font-medium cursor-pointer transition-colors"
                title="Ver criterios de desempate o ajustar manualmente con criterio del comisionado"
              >
                <Scale size={12} />
                <span>Desempates</span>
              </button>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-[#00d2ff] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]"></span>
                Top 4 Clasifica a R32
              </span>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0d1526] text-neutral-400 text-[10px] sm:text-[11px] font-semibold border-b border-blue-950/50 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 text-center w-14">#</th>
                  <th className="py-2.5 px-3 text-left">DUELISTA</th>
                  <th className="py-2.5 px-2 text-center w-12" title="Partidos Jugados">PJ</th>
                  <th className="py-2.5 px-2 text-center w-12 text-cyan-400" title="Ganados (+3 pts)">G</th>
                  <th className="py-2.5 px-2 text-center w-12 text-slate-400" title="Empatados (+1 pt)">E</th>
                  <th className="py-2.5 px-2 text-center w-12 text-rose-400/80" title="Derrotados (0 pts)">D</th>
                  <th className="py-2.5 px-2 text-center w-12 text-neutral-300" title="Diferencia de Duelos (DG = Ganados - Perdidos)">DG</th>
                  <th className="py-2.5 px-3 text-center w-16 font-bold text-white" title="Puntos">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950/50 font-mono">
                {activeGroup.duelistIds.length === 0 ? (
                  Array.from({ length: 8 }).map((_, idx) => {
                    const isQualifying = idx < 4;
                    return (
                      <tr
                        key={`empty-slot-${idx}`}
                        className={`transition-colors ${
                          isQualifying 
                            ? 'border-l-2 border-[#00d2ff]/40 bg-blue-950/20' 
                            : 'border-l-2 border-transparent opacity-50'
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-bold">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs ${
                              isQualifying 
                                ? 'bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/30' 
                                : 'text-neutral-600'
                            }`}>
                              {idx + 1}
                            </span>
                            {isQualifying && (
                              <span className="hidden xl:inline-block text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950/60 text-cyan-400/70 border border-cyan-800/40 uppercase">
                                Top R32
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#0b1329] border border-blue-900/30 flex items-center justify-center shrink-0 text-xs text-neutral-600 font-mono">
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <span className="text-neutral-500 text-xs italic block">
                                Sin integrante asignado
                              </span>
                              <span className="text-[10px] text-neutral-600">
                                Asignación requerida desde Bombo {idx + 1}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-neutral-600 font-mono text-xs">-</td>
                        <td className="py-3 px-2 text-center text-neutral-600 font-mono text-xs">-</td>
                        <td className="py-3 px-2 text-center text-neutral-600 font-mono text-xs">-</td>
                        <td className="py-3 px-2 text-center text-neutral-600 font-mono text-xs">-</td>
                        <td className="py-3 px-2 text-center text-neutral-600 font-mono text-xs">-</td>
                        <td className="py-3 px-3 text-center font-bold text-neutral-600 font-mono text-sm">-</td>
                      </tr>
                    );
                  })
                ) : (
                  standings.map((s, idx) => {
                    const duelist = duelistsMap.get(s.duelistId);
                    if (!duelist) return null;
                    const isQualifying = idx < 4;

                    return (
                      <tr
                        key={s.duelistId}
                        className={`transition-colors group/row ${
                          isQualifying 
                            ? 'border-l-2 border-[#00d2ff] bg-blue-950/40 hover:bg-blue-900/50' 
                            : 'border-l-2 border-transparent opacity-75 hover:opacity-100 hover:bg-[#0e172a]'
                        }`}
                      >
                      {/* 1. # (Posición con indicador de zona 1 al 4 en azul eléctrico) */}
                      <td className="py-3 px-3 text-center font-bold">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs ${
                            isQualifying 
                              ? 'bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/50 font-bold shadow-sm shadow-cyan-950/50' 
                              : 'text-neutral-500 font-medium'
                          }`}>
                            {idx + 1}
                          </span>
                          {isQualifying && (
                            <span className="hidden xl:inline-block text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950/90 text-[#00d2ff] border border-cyan-700/60 uppercase">
                              Top R32
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. DUELISTA (Avatar circular + Nombre + Era sutil) */}
                      <td 
                        onClick={() => {
                          soundEffects.playClick();
                          setInspectFichaDuelist(duelist);
                          setIsFichaOpen(true);
                        }}
                        className="py-3 px-3 font-sans cursor-pointer group/name hover:bg-blue-900/20 transition-colors"
                        title="Haz clic para ver o editar la Ficha Técnica Pro de este duelista"
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Avatar miniatura circular */}
                          <div className="w-7 h-7 rounded-full bg-[#0b1329] border border-blue-900/50 flex items-center justify-center overflow-hidden shrink-0 text-sm">
                            {duelist.avatarUrl ? (
                              <img src={duelist.avatarUrl} alt={duelist.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="select-none text-xs">{duelist.avatarIcon}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-xs text-xs group-hover/name:text-cyan-300 transition-colors flex items-center gap-1">
                                <span>{duelist.name}</span>
                                <FileText size={10} className="text-neutral-500 group-hover/name:text-cyan-400 opacity-60 shrink-0" />
                              </span>
                              {duelist.specialAnimeCard && (
                                <span title={duelist.specialAnimeCard} className="text-[11px] shrink-0">
                                  🔮
                                </span>
                              )}
                              {duelist.badgeStatus === 'Cabecera de Serie' && (
                                <span title="Cabecera de Serie" className="text-[11px] shrink-0">
                                  👑
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                              <span className="text-neutral-300 font-medium">{duelist.era}</span>
                              <span className="text-neutral-600">·</span>
                              <span className="truncate max-w-[130px] sm:max-w-[200px] text-neutral-400">{duelist.archetype}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. PJ (Partidos Jugados) */}
                      <td className="py-3 px-2 text-center text-neutral-300 font-mono text-xs">
                        {s.played}
                      </td>

                      {/* 4. G (Ganados - 3 pts) : Azul brillante o cian */}
                      <td className="py-3 px-2 text-center text-cyan-400 font-semibold font-mono text-xs">
                        {s.won}
                      </td>

                      {/* 5. E (Empatados - 1 pt) : Azul neutro / gris azulado */}
                      <td className="py-3 px-2 text-center text-slate-400 font-mono text-xs">
                        {s.drawn}
                      </td>

                      {/* 6. D (Derrotados - 0 pts) : Rojo atenuado */}
                      <td className="py-3 px-2 text-center text-rose-400/80 font-mono text-xs">
                        {s.lost}
                      </td>

                      {/* Diferencia de Duelos (DG = Ganados - Perdidos) */}
                      <td className={`py-3 px-2 text-center font-mono text-xs ${
                        s.goalDiff > 0 ? 'text-cyan-400' : s.goalDiff < 0 ? 'text-rose-400/80' : 'text-neutral-400'
                      }`}>
                        {s.goalDiff > 0 ? `+${s.goalDiff}` : s.goalDiff}
                      </td>

                      {/* 7. PTS (Puntos totales en blanco puro con sutil brillo azulado al hover) */}
                      <td className="py-3 px-3 text-center font-extrabold text-sm sm:text-base text-white font-mono group-hover/row:text-cyan-200 group-hover/row:drop-shadow-[0_0_8px_rgba(0,210,255,0.4)] transition-all">
                        {s.points}
                      </td>
                    </tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#0d1526] border-t border-blue-950/50 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
            <div className="flex items-center gap-3 font-sans text-[11px]">
              <span className="flex items-center gap-1.5 text-[#00e5ff] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] inline-block" />
                Zona de Clasificación (Top 4 a Llaves R32)
              </span>
              {activeGroup.duelistIds.length === 0 && (
                <span className="text-amber-400/80 font-mono text-[10px] bg-amber-950/40 border border-amber-900/60 px-1.5 py-0.5 rounded">
                  Grupo en blanco · Requiere Sorteo
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 font-sans">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsTieBreakerOpen(true);
                }}
                className="px-2.5 py-1 text-[11px] rounded bg-[#09101d] hover:bg-[#131d33] border border-blue-950/70 text-cyan-300 transition-colors cursor-pointer flex items-center gap-1 font-sans"
                title="Criterios de desempate y elección manual del Comisionado"
              >
                <Scale size={11} />
                <span>Desempates / Comisionado</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsManualPairingsOpen(true);
                }}
                className="px-2.5 py-1 text-[11px] rounded bg-[#09101d] hover:bg-[#131d33] border border-blue-950/70 text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
                title="Elegir y personalizar todos los cruces del grupo seleccionando los competidores"
              >
                <Swords size={11} />
                <span>Elegir Cruces Manuales</span>
              </button>
              <button
                onClick={handleAutoResolveGroup}
                className="px-2.5 py-1 text-[11px] rounded bg-[#09101d] hover:bg-[#131d33] text-neutral-300 border border-blue-950/70 transition-colors cursor-pointer"
                title="Completar duelos pendientes automáticamente"
              >
                Auto-completar Grupo
              </button>
              <button
                onClick={handleResetGroupMatches}
                className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Reiniciar partidos del grupo"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Matchdays (Jornadas 1 a 7) (5 cols) */}
        <div className="lg:col-span-5 bg-[#070b17] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          {/* Matchday Header & Selector */}
          <div className="p-4 bg-slate-900/70 border-b border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords size={16} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Enfrentamientos
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setIsManualPairingsOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-600/70 text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Elegir y personalizar manualmente los cruces de esta jornada"
                >
                  <SlidersHorizontal size={12} />
                  <span>Elegir Cruces (J{activeMatchday})</span>
                </button>
                <span className="text-xs font-mono text-slate-400">
                  J{activeMatchday}/7
                </span>
              </div>
            </div>

            {/* Matchday selector buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {[1, 2, 3, 4, 5, 6, 7].map(jornada => {
                const dayMatches = activeGroup.matches.filter(m => m.matchday === jornada);
                const dayPlayed = dayMatches.filter(m => m.played).length;
                const isSelected = activeMatchday === jornada;

                return (
                  <button
                    key={jornada}
                    onClick={() => {
                      soundEffects.playClick();
                      setActiveMatchday(jornada);
                    }}
                    className={`flex-1 py-1.5 px-2 text-xs font-mono rounded transition-colors whitespace-nowrap text-center cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    J{jornada} {dayPlayed === 4 ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of 4 Matches for this Matchday or Empty State */}
          {activeGroup.duelistIds.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-center text-cyan-400 shadow-inner">
                <Swords size={28} />
              </div>
              <div className="max-w-xs">
                <h4 className="text-sm font-bold text-white mb-1">Enfrentamientos en Espera</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Las 7 jornadas y cruces del Grupo {activeGroup.id} se habilitarán en cuanto se asignen los 8 duelistas desde la fase de bombos.
                </p>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsGroupDrawModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Dices size={14} />
                <span>Sortear / Armar Grupos</span>
              </button>
            </div>
          ) : (
            <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
              {matchdayMatches.map((match, idx) => {
              const d1 = duelistsMap.get(match.duelist1Id);
              const d2 = duelistsMap.get(match.duelist2Id);

              // Incomplete or unassigned match slot
              if (!d1 || !d2) {
                return (
                  <div
                    key={match.id}
                    className="p-3 rounded-xl border border-dashed border-cyan-900/40 bg-[#090d1f]/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 block mb-0.5">
                        MESA {idx + 1} · CRUCE PENDIENTE
                      </span>
                      <span className="text-slate-400 text-xs">
                        {d1 ? `${d1.name} esperando rival...` : d2 ? `${d2.name} esperando rival...` : 'Sin competidores asignados'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setIsManualPairingsOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <UserCheck size={13} />
                      <span>Elegir Rivales</span>
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={match.id}
                  className={`p-3 rounded-xl border transition-all ${
                    match.played
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-[#090d1f] border-cyan-900/40 hover:border-cyan-600/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      MESA {match.id.slice(-1)}
                    </span>
                    {match.played ? (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        FINALIZADO
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-sky-300/80">
                        PENDIENTE
                      </span>
                    )}
                  </div>

                  {/* Duelists Row */}
                  <div className="flex items-center justify-between gap-3 text-xs mb-3">
                    {/* Duelist 1 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm shrink-0">{d1.avatarIcon}</span>
                        <div className={`font-semibold truncate ${
                          match.winnerId === d1.id ? 'text-cyan-300 font-bold' : 'text-slate-200'
                        }`}>
                          {d1.name}
                        </div>
                        {d1.specialAnimeCard && <span className="text-[10px]">🔮</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate pl-5">
                        {d1.archetype}
                      </div>
                    </div>

                    {/* Score / VS */}
                    <div className="px-2.5 py-1 rounded bg-black/60 border border-slate-800 font-mono text-sm font-bold text-center shrink-0">
                      {match.played ? (
                        <span className="text-white">
                          {match.score1} - {match.score2}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">VS</span>
                      )}
                    </div>

                    {/* Duelist 2 */}
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {d2.specialAnimeCard && <span className="text-[10px]">🔮</span>}
                        <div className={`font-semibold truncate ${
                          match.winnerId === d2.id ? 'text-cyan-300 font-bold' : 'text-slate-200'
                        }`}>
                          {d2.name}
                        </div>
                        <span className="text-sm shrink-0">{d2.avatarIcon}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate pr-5">
                        {d2.archetype}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Chronicle button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs gap-2">
                    {match.narrativeSummary ? (
                      <button
                        onClick={() => setViewChronicleMatch(match)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Eye size={12} />
                        <span>Ver Crónica</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic truncate">Sin crónica</span>
                    )}

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!match.played && (
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setIsManualPairingsOpen(true);
                          }}
                          className="px-2 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Cambiar competidores para este cruce"
                        >
                          <SlidersHorizontal size={11} />
                          <span>Elegir Rivales</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDirector(match)}
                        className="px-3 py-1 text-xs font-semibold rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{match.played ? 'Modificar' : 'Dirigir Duelo'}</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Match Director Modal for Controlling results with Zero Azar */}
      {selectedMatch && (
        <MatchDirectorModal
          match={selectedMatch}
          duelist1={duelistsMap.get(selectedMatch.duelist1Id)!}
          duelist2={duelistsMap.get(selectedMatch.duelist2Id)!}
          onSaveResult={handleSaveMatchResult}
          onClose={() => setSelectedMatch(null)}
          allowDraw={true}
        />
      )}

      {/* View Chronicle Modal */}
      {viewChronicleMatch && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#080d1e] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Crónica del Duelo Registrada</span>
              </h3>
              <button
                onClick={() => setViewChronicleMatch(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 bg-black/60 p-4 rounded-xl border border-slate-800 max-h-96 overflow-y-auto leading-relaxed">
              {viewChronicleMatch.narrativeSummary}
            </pre>
            <div className="text-right">
              <button
                onClick={() => setViewChronicleMatch(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Pairings Matchup Modal (Cruces Manuales - Cero Azar) */}
      <ManualPairingsModal
        isOpen={isManualPairingsOpen}
        onClose={() => setIsManualPairingsOpen(false)}
        group={activeGroup}
        duelistsMap={duelistsMap}
        initialMatchday={activeMatchday}
        onSaveGroupMatches={(newMatches) => {
          onUpdateGroupMatches(activeGroup.id, newMatches);
        }}
      />

      {/* Commissioner Tiebreaker Modal (Desempate & Criterio Manual / Sorteo) */}
      <CommissionerTieBreakerModal
        isOpen={isTieBreakerOpen}
        onClose={() => setIsTieBreakerOpen(false)}
        group={activeGroup}
        duelistsMap={duelistsMap}
        onSaveOverrides={(groupId, overrides) => {
          if (onUpdateGroupOverrides) {
            onUpdateGroupOverrides(groupId, overrides);
          }
        }}
      />

      {/* Standard Character Technical Card Modal (UI/UX Tarjeta Pro) */}
      <CharacterCardModal
        duelist={inspectFichaDuelist}
        isOpen={isFichaOpen}
        onClose={() => setIsFichaOpen(false)}
        onSave={(saved) => {
          if (onUpdateDuelist) onUpdateDuelist(saved);
        }}
        initialMode="VIEW"
      />

      {/* Sorteo y Armado de Grupos desde Bombos (Equilibrio Competitivo: 1 por Bombo) */}
      <GroupDrawFromBombosModal
        isOpen={isGroupDrawModalOpen}
        onClose={() => setIsGroupDrawModalOpen(false)}
        bombos={bombos}
        duelistsMap={duelistsMap}
        onConfirmGroups={(newGroups) => {
          newGroups.forEach(ng => {
            onUpdateGroupDuelists(ng.id, ng.duelistIds);
            onUpdateGroupMatches(ng.id, ng.matches);
          });
        }}
      />
    </div>
  );
};
