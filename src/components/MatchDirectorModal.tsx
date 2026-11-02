import React, { useState } from 'react';
import { Duelist, GroupMatch } from '../types/tournament';
import { generateDuelNarrative } from '../utils/narrative';
import { soundEffects } from '../utils/audio';
import { Swords, X, Check, Sparkles, BookOpen, MessageSquare, Wand2, Layers, Shield } from 'lucide-react';

interface MatchDirectorModalProps {
  match: GroupMatch | {
    id: string;
    duelist1Id: string | null;
    duelist2Id: string | null;
    score1: number;
    score2: number;
    winnerId: string | null;
    played: boolean;
    narrativePrompt?: string;
    narrativeSummary?: string;
    slotName?: string;
  };
  duelist1: Duelist;
  duelist2: Duelist;
  onSaveResult: (result: {
    winnerId: string | 'DRAW';
    score1: number;
    score2: number;
    narrativePrompt: string;
    narrativeSummary: string;
    variantDeck1: string;
    variantDeck2: string;
  }) => void;
  onClose: () => void;
  allowDraw?: boolean; // false in elimination brackets
}

export const MatchDirectorModal: React.FC<MatchDirectorModalProps> = ({
  match,
  duelist1,
  duelist2,
  onSaveResult,
  onClose,
  allowDraw = true
}) => {
  const [selectedWinner, setSelectedWinner] = useState<string | 'DRAW'>(
    match.winnerId || duelist1.id
  );
  const [score1, setScore1] = useState<number>(match.score1 || (selectedWinner === duelist1.id ? 2 : 0));
  const [score2, setScore2] = useState<number>(match.score2 || (selectedWinner === duelist2.id ? 2 : 0));
  const [narrativePrompt, setNarrativePrompt] = useState<string>(match.narrativePrompt || '');
  
  // Primary or secondary deck variant
  const [variant1, setVariant1] = useState<string>(
    duelist1.secondaryDeck ? `${duelist1.archetype} + ${duelist1.secondaryDeck}` : duelist1.archetype
  );
  const [variant2, setVariant2] = useState<string>(
    duelist2.secondaryDeck ? `${duelist2.archetype} + ${duelist2.secondaryDeck}` : duelist2.archetype
  );

  const [generatedChronicle, setGeneratedChronicle] = useState<string>(match.narrativeSummary || '');

  // Prompt suggestions with anime cards & user example
  const promptIdeas = [
    `Quiero que el duelo se decida en el turno 5 con la activación del Sello de Orichalcos`,
    `Remontada épica con 100 LP invocando a ${duelist1.aceMonster}`,
    `OTK demoledor en el Turno 2 rompiendo el campo con ${duelist2.aceMonster}`,
    duelist1.specialAnimeCard ? `Activación letal de ${duelist1.specialAnimeCard} por parte de ${duelist1.name}` : null,
    duelist2.specialAnimeCard ? `Activación letal de ${duelist2.specialAnimeCard} por parte de ${duelist2.name}` : null,
    `Guerra de negaciones con motor ${duelist1.secondaryDeck || 'híbrido'} contra ${duelist2.archetype}`,
    `Duelo táctico donde el mazo de ${duelist1.archetype} supera en recursos a ${duelist2.archetype}`
  ].filter(Boolean) as string[];

  const handleWinnerSelect = (winner: string | 'DRAW') => {
    soundEffects.playClick();
    setSelectedWinner(winner);
    if (winner === duelist1.id) {
      setScore1(2);
      setScore2(1);
    } else if (winner === duelist2.id) {
      setScore1(1);
      setScore2(2);
    } else {
      setScore1(1);
      setScore2(1);
    }
  };

  const handleGenerateStory = () => {
    soundEffects.playClick();
    const story = generateDuelNarrative(
      duelist1,
      duelist2,
      selectedWinner,
      score1,
      score2,
      narrativePrompt,
      variant1,
      variant2
    );
    setGeneratedChronicle(story);
  };

  const handleConfirmSave = () => {
    soundEffects.playVictory();
    const finalStory = generatedChronicle || generateDuelNarrative(
      duelist1,
      duelist2,
      selectedWinner,
      score1,
      score2,
      narrativePrompt,
      variant1,
      variant2
    );

    onSaveResult({
      winnerId: selectedWinner,
      score1,
      score2,
      narrativePrompt,
      narrativeSummary: finalStory,
      variantDeck1: variant1,
      variantDeck2: variant2
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#080d1e] border border-cyan-500/50 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-mono text-cyan-400">
              DIRECTOR DE DUELOS :: CONTROL DE RESULTADOS (CERO AZAR v4.0)
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Swords size={18} className="text-amber-400" />
              <span>{duelist1.name} vs {duelist2.name}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Both Contenders Comparison Cards */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          {/* Duelist 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{duelist1.avatarIcon}</span>
              <div className="min-w-0">
                <div className="font-bold text-white truncate">{duelist1.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">[{duelist1.era}] · {duelist1.mechanic}</div>
              </div>
            </div>

            <div className="space-y-1 text-[11px]">
              {duelist1.specialAnimeCard && (
                <div className="text-purple-300 flex items-center gap-1">
                  <span>🔮</span>
                  <span className="truncate">{duelist1.specialAnimeCard}</span>
                </div>
              )}
              {duelist1.secondaryDeck && (
                <div className="text-slate-300 flex items-center gap-1">
                  <Layers size={11} className="text-cyan-400 shrink-0" />
                  <span className="truncate">Secundario: {duelist1.secondaryDeck}</span>
                </div>
              )}
              <div className="text-slate-400 truncate">
                <strong>As:</strong> {duelist1.aceMonster}
              </div>
            </div>
          </div>

          {/* Duelist 2 */}
          <div className="space-y-1.5 border-l border-slate-800 pl-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{duelist2.avatarIcon}</span>
              <div className="min-w-0">
                <div className="font-bold text-white truncate">{duelist2.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">[{duelist2.era}] · {duelist2.mechanic}</div>
              </div>
            </div>

            <div className="space-y-1 text-[11px]">
              {duelist2.specialAnimeCard && (
                <div className="text-purple-300 flex items-center gap-1">
                  <span>🔮</span>
                  <span className="truncate">{duelist2.specialAnimeCard}</span>
                </div>
              )}
              {duelist2.secondaryDeck && (
                <div className="text-slate-300 flex items-center gap-1">
                  <Layers size={11} className="text-cyan-400 shrink-0" />
                  <span className="truncate">Secundario: {duelist2.secondaryDeck}</span>
                </div>
              )}
              <div className="text-slate-400 truncate">
                <strong>As:</strong> {duelist2.aceMonster}
              </div>
            </div>
          </div>
        </div>

        {/* 1. Decision de Resultado (Decisión 100% manual del usuario) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-white uppercase tracking-wider">
            1. ¿Quién gana o empata en este enfrentamiento? (Control 100% Manual)
          </label>

          <div className={`grid ${allowDraw ? 'grid-cols-3' : 'grid-cols-2'} gap-2.5`}>
            {/* Duelist 1 wins */}
            <button
              type="button"
              onClick={() => handleWinnerSelect(duelist1.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedWinner === duelist1.id
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950 ring-1 ring-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white truncate">{duelist1.name}</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">Victoria (+3 PTS)</div>
            </button>

            {/* Draw if allowed */}
            {allowDraw && (
              <button
                type="button"
                onClick={() => handleWinnerSelect('DRAW')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedWinner === 'DRAW'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md shadow-amber-950 ring-1 ring-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white">Empate</div>
                <div className="text-[11px] text-amber-400 mt-1 font-mono">+1 PT cada uno</div>
              </button>
            )}

            {/* Duelist 2 wins */}
            <button
              type="button"
              onClick={() => handleWinnerSelect(duelist2.id)}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                selectedWinner === duelist2.id
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950 ring-1 ring-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white truncate">{duelist2.name}</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">Victoria (+3 PTS)</div>
            </button>
          </div>

          {/* Marcador de Duelos (Best of 3) */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="text-xs text-slate-400">Marcador de Duelo:</span>
            <div className="flex items-center gap-2 font-mono">
              <input
                type="number"
                min="0"
                max="3"
                value={score1}
                onChange={e => setScore1(parseInt(e.target.value) || 0)}
                className="w-12 py-1 text-center bg-slate-900 border border-slate-700 rounded text-sm text-white font-bold"
              />
              <span className="text-slate-500 font-bold">-</span>
              <input
                type="number"
                min="0"
                max="3"
                value={score2}
                onChange={e => setScore2(parseInt(e.target.value) || 0)}
                className="w-12 py-1 text-center bg-slate-900 border border-slate-700 rounded text-sm text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* 2. Directiva Narrativa / Prompt del Usuario */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} className="text-cyan-400" />
              <span>2. Directiva / Prompt Narrativo (Guion Creativo)</span>
            </label>
            <span className="text-[11px] text-slate-400">(Opcional)</span>
          </div>

          <textarea
            rows={2}
            value={narrativePrompt}
            onChange={e => setNarrativePrompt(e.target.value)}
            placeholder="Ej: Quiero que el duelo se decida en el turno 5 con la activación del Sello de Orichalcos..."
            className="w-full px-3 py-2 bg-[#060914] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />

          {/* Quick inspiration chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {promptIdeas.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setNarrativePrompt(idea)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 truncate max-w-xs cursor-pointer"
              >
                + {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Chronicle Preview if generated */}
        {generatedChronicle && (
          <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-900/60 font-mono text-xs text-slate-300 space-y-2 max-h-40 overflow-y-auto">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <BookOpen size={14} />
              <span>Crónica Oficial Simulada</span>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
              {generatedChronicle}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleGenerateStory}
            className="px-3.5 py-2 text-xs font-medium text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-800/40 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Previsualizar Crónica</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-5 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} strokeWidth={3} />
              <span>Confirmar Resultado Oficial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
