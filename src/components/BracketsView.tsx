import React, { useState } from 'react';
import { BracketMatch, BracketStage, Duelist } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { generateSchematicBracketTree } from '../utils/bracketTreeGenerator';
import { 
  Trophy, 
  Swords, 
  Crown, 
  CheckCircle2, 
  ChevronRight, 
  Eye, 
  Copy, 
  Check, 
  Terminal, 
  LayoutGrid, 
  ArrowLeft 
} from 'lucide-react';
import { MatchDirectorModal } from './MatchDirectorModal';

interface BracketsViewProps {
  matches: BracketMatch[];
  duelistsMap: Map<string, Duelist>;
  onUpdateMatches: (matches: BracketMatch[]) => void;
  onBackToLiveDraw: () => void;
}

export const BracketsView: React.FC<BracketsViewProps> = ({
  matches,
  duelistsMap,
  onUpdateMatches,
  onBackToLiveDraw
}) => {
  const [activeStage, setActiveStage] = useState<BracketStage>('r32');
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null);
  const [viewChronicleMatch, setViewChronicleMatch] = useState<BracketMatch | null>(null);
  const [viewFormat, setViewFormat] = useState<'INTERACTIVE' | 'SCHEMATIC_TREE'>('INTERACTIVE');
  const [copiedTree, setCopiedTree] = useState(false);

  const stages: { key: BracketStage; label: string; count: number }[] = [
    { key: 'r32', label: 'Dieciseisavos (16)', count: 16 },
    { key: 'r16', label: 'Octavos (8)', count: 8 },
    { key: 'qf', label: 'Cuartos (4)', count: 4 },
    { key: 'sf', label: 'Semifinales (2)', count: 2 },
    { key: 'third', label: 'Tercer Puesto', count: 1 },
    { key: 'final', label: 'Gran Final', count: 1 }
  ];

  const currentStageMatches = matches.filter(m => m.stage === activeStage);

  // Check if champion exists
  const finalMatch = matches.find(m => m.id === 'final_1');
  const championDuelist = finalMatch?.winnerId ? duelistsMap.get(finalMatch.winnerId) : null;
  const thirdMatch = matches.find(m => m.id === 'third_1');
  const thirdPlaceDuelist = thirdMatch?.winnerId ? duelistsMap.get(thirdMatch.winnerId) : null;
  const runnerUpDuelist = finalMatch?.winnerId && finalMatch.duelist1Id && finalMatch.duelist2Id
    ? duelistsMap.get(finalMatch.winnerId === finalMatch.duelist1Id ? finalMatch.duelist2Id : finalMatch.duelist1Id)
    : null;

  const schematicTreeText = generateSchematicBracketTree(matches, duelistsMap);

  const handleCopyTree = () => {
    navigator.clipboard.writeText(schematicTreeText).then(() => {
      soundEffects.playClick();
      setCopiedTree(true);
      setTimeout(() => setCopiedTree(false), 2000);
    });
  };

  const handleOpenDirector = (match: BracketMatch) => {
    if (!match.duelist1Id || !match.duelist2Id) return;
    soundEffects.playClick();
    setSelectedMatch(match);
  };

  const handleSaveResult = (result: {
    winnerId: string | 'DRAW';
    score1: number;
    score2: number;
    narrativePrompt: string;
    narrativeSummary: string;
    variantDeck1: string;
    variantDeck2: string;
  }) => {
    if (!selectedMatch || result.winnerId === 'DRAW') return;

    soundEffects.playVictory();
    const winnerId = result.winnerId;
    const loserId = winnerId === selectedMatch.duelist1Id ? selectedMatch.duelist2Id : selectedMatch.duelist1Id;

    const updated = matches.map(m => {
      // 1. Update current match
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          winnerId,
          score1: result.score1,
          score2: result.score2,
          narrativePrompt: result.narrativePrompt,
          narrativeSummary: result.narrativeSummary,
          played: true
        };
      }

      // 2. Advance winner to next match
      if (selectedMatch.nextMatchId && m.id === selectedMatch.nextMatchId) {
        return {
          ...m,
          [selectedMatch.nextSlotPosition === 1 ? 'duelist1Id' : 'duelist2Id']: winnerId
        };
      }

      // 3. For Semifinales losers, place in 3rd place match
      if (selectedMatch.loserMatchId && m.id === selectedMatch.loserMatchId) {
        return {
          ...m,
          [selectedMatch.id === 'sf_1' ? 'duelist1Id' : 'duelist2Id']: loserId
        };
      }

      return m;
    });

    onUpdateMatches(updated);
    setSelectedMatch(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#080d1e] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>MATRIX TOURNAMENT :: FASE DE ELIMINACIÓN DIRECTA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Cuadro de Llaves de Eliminación (Top 32)</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Sistema estricto de eliminación directa estilo Red Bull Batalla. Alterna entre el <strong className="text-cyan-300">Cuadro Interactivo</strong> y el <strong className="text-white">Árbol Esquemático Textual</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format Switcher */}
          <div className="flex p-1 bg-black/60 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                soundEffects.playClick();
                setViewFormat('INTERACTIVE');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                viewFormat === 'INTERACTIVE'
                  ? 'bg-cyan-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={13} />
              <span>Cuadro Interactivo</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setViewFormat('SCHEMATIC_TREE');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                viewFormat === 'SCHEMATIC_TREE'
                  ? 'bg-cyan-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal size={13} />
              <span>Árbol Esquemático</span>
            </button>
          </div>

          <button
            onClick={onBackToLiveDraw}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Volver a Sorteo
          </button>
        </div>
      </div>

      {/* Champion Podium Ceremony if Final is Played */}
      {championDuelist && (
        <div className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-[#141208] via-[#090d1e] to-[#070b16] p-6 sm:p-8 shadow-2xl shadow-amber-950/60 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/20">
              <img
                src="/src/assets/images/mct_championship_trophy_1793583467365.jpg"
                alt="Trofeo Multiversal"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">
              <Crown size={16} />
              <span>GRAN CAMPEÓN DEL MATRIX TOURNAMENT</span>
              <Crown size={16} />
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white">
              {championDuelist.name}
            </h3>

            <div className="text-sm font-semibold text-cyan-300">
              [{championDuelist.era}] · {championDuelist.alias}
            </div>

            <div className="p-3 bg-black/50 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 italic max-w-lg">
              "{championDuelist.quote}"
            </div>

            {/* Podium places */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-mono">SUBCAMPEÓN</div>
                <div className="font-bold text-white mt-0.5 truncate">{runnerUpDuelist?.name || '---'}</div>
                <div className="text-[10px] text-slate-400 truncate">{runnerUpDuelist?.archetype}</div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-400/50">
                <div className="text-amber-400 text-[10px] font-mono font-bold">1º LUGAR · CAMPEÓN</div>
                <div className="font-bold text-amber-300 mt-0.5 truncate">{championDuelist.name}</div>
                <div className="text-[10px] text-amber-200/70 truncate">{championDuelist.archetype}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-mono">3º PUESTO</div>
                <div className="font-bold text-white mt-0.5 truncate">{thirdPlaceDuelist?.name || '---'}</div>
                <div className="text-[10px] text-slate-400 truncate">{thirdPlaceDuelist?.archetype}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEMATIC TEXT-TREE BRACKET VIEW */}
      {viewFormat === 'SCHEMATIC_TREE' ? (
        <div className="rounded-xl border border-cyan-500/40 bg-[#070b16] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                Árbol de Eliminación Directa Esquemático (Red Bull Batalla Modificado)
              </h3>
            </div>

            <button
              onClick={handleCopyTree}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 transition-colors cursor-pointer"
            >
              {copiedTree ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedTree ? '¡Árbol Copiado!' : 'Copiar Árbol de Texto'}</span>
            </button>
          </div>

          <div className="overflow-x-auto bg-black/60 p-4 rounded-xl border border-slate-800/80">
            <pre className="font-mono text-xs sm:text-sm text-cyan-300 leading-tight select-all">
              {schematicTreeText}
            </pre>
          </div>
        </div>
      ) : (
        /* INTERACTIVE CARD BRACKET VIEW */
        <div className="space-y-5">
          {/* Stage Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            {stages.map(stg => {
              const stgMatches = matches.filter(m => m.stage === stg.key);
              const stgPlayed = stgMatches.filter(m => m.played).length;
              const isSelected = activeStage === stg.key;

              return (
                <button
                  key={stg.key}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveStage(stg.key);
                  }}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{stg.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-black/20 text-black font-semibold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stgPlayed}/{stg.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Matches List for Current Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStageMatches.map(match => {
              const d1 = match.duelist1Id ? duelistsMap.get(match.duelist1Id) : null;
              const d2 = match.duelist2Id ? duelistsMap.get(match.duelist2Id) : null;
              const isReady = !!(d1 && d2);

              return (
                <div
                  key={match.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    match.played
                      ? 'bg-slate-900/90 border-slate-800'
                      : isReady
                      ? 'bg-[#080d1f] border-cyan-900/50 hover:border-cyan-600/70'
                      : 'bg-[#060a16] border-slate-900 opacity-60'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2 mb-3">
                      <span className="font-bold text-cyan-400">{match.slotName}</span>
                      {match.played ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                          <CheckCircle2 size={12} />
                          RESUELTO
                        </span>
                      ) : isReady ? (
                        <span className="text-amber-400 text-[10px]">LISTO PARA DUELO</span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">ESPERANDO RIVALES</span>
                      )}
                    </div>

                    {/* Contenders Box */}
                    <div className="space-y-2">
                      {/* Duelist 1 */}
                      <div className={`p-2.5 rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                        match.winnerId === d1?.id
                          ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200'
                          : 'bg-slate-900/80 border-slate-800/60 text-slate-300'
                      }`}>
                        {d1 ? (
                          <div className="flex items-center gap-2 min-w-0">
                            {d1.avatarUrl ? (
                              <img
                                src={d1.avatarUrl}
                                alt={d1.name}
                                className="w-6 h-6 rounded object-cover shrink-0 border border-slate-700"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-base shrink-0">{d1.avatarIcon}</span>
                            )}
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                                <span>{d1.name}</span>
                                {d1.specialAnimeCard && <span className="text-[9px]">🔮</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{d1.archetype}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Por clasificar...</span>
                        )}

                        <div className="flex items-center gap-1.5 shrink-0">
                          {d1 && <span className="text-[10px] font-mono text-cyan-400">{d1.era}</span>}
                          {match.played && (
                            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                              {match.score1}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Duelist 2 */}
                      <div className={`p-2.5 rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                        match.winnerId === d2?.id
                          ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200'
                          : 'bg-slate-900/80 border-slate-800/60 text-slate-300'
                      }`}>
                        {d2 ? (
                          <div className="flex items-center gap-2 min-w-0">
                            {d2.avatarUrl ? (
                              <img
                                src={d2.avatarUrl}
                                alt={d2.name}
                                className="w-6 h-6 rounded object-cover shrink-0 border border-slate-700"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-base shrink-0">{d2.avatarIcon}</span>
                            )}
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                                <span>{d2.name}</span>
                                {d2.specialAnimeCard && <span className="text-[9px]">🔮</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{d2.archetype}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Por clasificar...</span>
                        )}

                        <div className="flex items-center gap-1.5 shrink-0">
                          {d2 && <span className="text-[10px] font-mono text-cyan-400">{d2.era}</span>}
                          {match.played && (
                            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                              {match.score2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Card Footer */}
                  <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    {match.narrativeSummary ? (
                      <button
                        onClick={() => setViewChronicleMatch(match)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Ver Crónica</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        {match.nextMatchId ? `Avanza a ${match.nextMatchId}` : 'Gran Final'}
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenDirector(match)}
                      disabled={!isReady}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${
                        isReady
                          ? 'bg-cyan-400 hover:bg-cyan-300 text-black cursor-pointer shadow-sm shadow-cyan-950'
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <span>{match.played ? 'Modificar' : 'Dirigir Duelo'}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Match Director Modal for Bracket Matches */}
      {selectedMatch && selectedMatch.duelist1Id && selectedMatch.duelist2Id && (
        <MatchDirectorModal
          match={selectedMatch}
          duelist1={duelistsMap.get(selectedMatch.duelist1Id)!}
          duelist2={duelistsMap.get(selectedMatch.duelist2Id)!}
          onSaveResult={handleSaveResult}
          onClose={() => setSelectedMatch(null)}
          allowDraw={false} // In brackets, there must be a winner!
        />
      )}

      {/* View Chronicle Modal */}
      {viewChronicleMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
    </div>
  );
};
