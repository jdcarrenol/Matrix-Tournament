import React, { useState } from 'react';
import { Duelist, Era } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { CharacterCardModal } from './CharacterCardModal';
import { 
  Search, 
  Check, 
  X, 
  Sparkles, 
  UserPlus, 
  ArrowRight, 
  Edit3, 
  Shield, 
  Zap, 
  Crown, 
  Layers,
  FileText
} from 'lucide-react';

interface CatalogSelectorProps {
  catalog: Duelist[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectBalanced: () => void;
  onClearAll: () => void;
  onAddCustomDuelist: (duelist: Duelist) => void;
  onUpdateDuelist: (duelist: Duelist) => void;
  onProceedToBombos: () => void;
}

export const CatalogSelector: React.FC<CatalogSelectorProps> = ({
  catalog,
  selectedIds,
  onToggleSelect,
  onSelectBalanced,
  onClearAll,
  onAddCustomDuelist,
  onUpdateDuelist,
  onProceedToBombos
}) => {
  const [selectedEra, setSelectedEra] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Technical Card Modal state
  const [modalDuelist, setModalDuelist] = useState<Duelist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('VIEW');

  const eras: (Era | 'ALL')[] = ['ALL', 'DM', 'GX', '5D\'s', 'ZEXAL', 'ARC-V', 'VRAINS', 'SEVENS', 'Go RUSH!!'];

  const filteredDuelists = catalog.filter(d => {
    const matchesEra = selectedEra === 'ALL' || d.era === selectedEra;
    const matchesSearch =
      searchQuery.trim() === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.archetype.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.secondaryDeck && d.secondaryDeck.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.specialAnimeCard && d.specialAnimeCard.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.aceMonster.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEra && matchesSearch;
  });

  const count = selectedIds.length;
  const isComplete = count === 64;

  const handleOpenFicha = (duelist: Duelist, mode: 'VIEW' | 'EDIT', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.playClick();
    setModalDuelist(duelist);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    soundEffects.playClick();
    setModalDuelist(null);
    setModalMode('CREATE');
    setIsModalOpen(true);
  };

  const handleSaveModal = (savedDuelist: Duelist) => {
    if (modalMode === 'CREATE') {
      onAddCustomDuelist(savedDuelist);
    } else {
      onUpdateDuelist(savedDuelist);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-[#080d1e] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>MÓDULO DE FICHA TÉCNICA PRO & EDITOR EN VIVO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Catálogo Oficial & Fichas de Personajes</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
              v4.0
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Haz clic en <strong className="text-cyan-300">"Ficha Pro"</strong> de cualquier duelista para ver su ficha técnica obligatoria, subir fotos o renders, y equipar cartas del anime (Orichalcos, Armaduras, Horus).
          </p>
        </div>

        {/* Counter and Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`px-4 py-2 rounded-lg border font-mono text-xs flex items-center gap-2 ${
            isComplete 
              ? 'bg-cyan-950/80 border-cyan-500/60 text-[#00d2ff] shadow-sm shadow-cyan-950' 
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}>
            <span className="text-sm font-bold">{count} / 64</span>
            <span>{isComplete ? '¡64 Oficiales Listos!' : `(Faltan ${64 - count > 0 ? 64 - count : 0})`}</span>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/50 border border-cyan-800 hover:bg-cyan-900/60 rounded-lg transition-colors cursor-pointer"
          >
            <UserPlus size={14} />
            <span>+ Crear Personaje (Ficha Pro)</span>
          </button>

          <button
            onClick={() => {
              if (isComplete) {
                soundEffects.playVictory();
                onProceedToBombos();
              } else {
                soundEffects.playClick();
              }
            }}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              isComplete
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-900/40 hover:from-cyan-300 hover:to-blue-400 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>Organizar en Bombos</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Preset Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles size={14} className="text-amber-400" />
          <span className="font-medium">Acciones Rápidas:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              onSelectBalanced();
            }}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Cargar 64 Equilibrados (8 por Era)
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClearAll();
            }}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            Desmarcar Todos
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Era Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-slate-900/70 border border-slate-800 rounded-lg">
          {eras.map(era => {
            const eraCount = era === 'ALL' 
              ? catalog.length 
              : catalog.filter(d => d.era === era).length;
            const eraSelectedCount = era === 'ALL'
              ? selectedIds.length
              : catalog.filter(d => d.era === era && selectedIds.includes(d.id)).length;

            return (
              <button
                key={era}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedEra(era);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedEra === era
                    ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{era === 'ALL' ? 'Todas las Eras' : era}</span>
                <span className={`text-[10px] font-mono ${selectedEra === era ? 'text-black/70' : 'text-slate-500'}`}>
                  {eraSelectedCount}/{eraCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por duelista, arquetipo, deck secundario (Horus), carta anime (Orichalcos), monstruo as..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#080d1d] border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Minimalist Duelist Cards (Estilo Grid Pro) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
        {filteredDuelists.map(duelist => {
          const isSelected = selectedIds.includes(duelist.id);

          return (
            <div
              key={duelist.id}
              onClick={() => {
                soundEffects.playClick();
                onToggleSelect(duelist.id);
              }}
              className={`group relative p-2.5 rounded-xl border select-none cursor-pointer transition-all duration-200 flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-[#0e1628] border-cyan-400/80 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/30'
                  : 'bg-[#0b0f19] border-slate-800/80 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-950/30 hover:bg-[#0d1322]'
              }`}
            >
              {/* Avatar / Foto: Imagen en miniatura cuadrada con bordes redondeados sutiles a la izquierda */}
              <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-700/70 bg-[#121829] shrink-0 flex items-center justify-center relative">
                {duelist.avatarUrl ? (
                  <img
                    src={duelist.avatarUrl}
                    alt={duelist.name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xl select-none">{duelist.avatarIcon}</span>
                )}
              </div>

              {/* Contenido Central: Nombre Principal, Generación y Carta As */}
              <div className="min-w-0 flex-1">
                {/* Nombre Principal + Generación (Badge/Era) */}
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="font-bold text-white text-xs truncate group-hover:text-cyan-300 transition-colors">
                    {duelist.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 shrink-0 font-medium">
                    {duelist.era}
                  </span>
                </div>

                {/* Carta As: Ubicada de forma limpia reemplazando métricas secundarias */}
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <span className="text-slate-500 font-mono text-[9px] uppercase shrink-0">As:</span>
                  <span className="text-slate-300 truncate font-medium group-hover:text-slate-200">
                    {duelist.aceMonster}
                  </span>
                </div>
              </div>

              {/* Botón discreto Ficha Pro (visible al hover) + Indicador de Selección */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={e => handleOpenFicha(duelist, 'VIEW', e)}
                  title="Ver Ficha Técnica Pro"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-800 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <FileText size={11} />
                </button>

                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0 shadow-sm shadow-cyan-950">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDuelists.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No se encontraron duelistas que coincidan con la búsqueda.
        </div>
      )}

      {/* Floating Bottom Action Sticky Bar if 64 are selected */}
      {isComplete && (
        <div className="sticky bottom-4 z-30 p-4 rounded-xl bg-[#090e21]/95 border border-cyan-500/50 shadow-2xl backdrop-blur flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div className="text-xs sm:text-sm text-slate-200">
              <strong className="text-white">64 Duelistas Oficiales Seleccionados</strong> para la edición.
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playVictory();
              onProceedToBombos();
            }}
            className="px-5 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
          >
            <span>Organizar en Bombos</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Standard Character Technical Card Modal (UI/UX Tarjeta Pro) */}
      <CharacterCardModal
        duelist={modalDuelist}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialMode={modalMode}
      />
    </div>
  );
};
