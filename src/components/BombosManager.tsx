import React, { useState } from 'react';
import { Bombo, Duelist, Group } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { 
  Layers, 
  ArrowRight, 
  Shuffle, 
  Edit2, 
  Check, 
  ArrowLeftRight, 
  Sparkles, 
  RotateCcw, 
  Users, 
  PlusCircle, 
  Dices 
} from 'lucide-react';
import { GroupDrawFromBombosModal } from './GroupDrawFromBombosModal';

interface BombosManagerProps {
  bombos: Bombo[];
  duelistsMap: Map<string, Duelist>;
  selected64Ids: string[];
  onUpdateBombos: (bombos: Bombo[]) => void;
  onProceedToGroupsWithData: (groups: Group[]) => void;
  onBackToCatalog: () => void;
}

export const BombosManager: React.FC<BombosManagerProps> = ({
  bombos,
  duelistsMap,
  selected64Ids,
  onUpdateBombos,
  onProceedToGroupsWithData,
  onBackToCatalog
}) => {
  const [editingBomboId, setEditingBomboId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedDuelistId, setSelectedDuelistId] = useState<string | null>(null);
  const [isGroupDrawModalOpen, setIsGroupDrawModalOpen] = useState(false);

  // Compute assigned and unassigned duelists
  const assignedIds = new Set(bombos.flatMap(b => b.duelistIds));
  const unassignedIds = (selected64Ids || []).filter(id => !assignedIds.has(id));
  const totalAssigned = assignedIds.size;
  const allBombosValid = bombos.every(b => b.duelistIds.length === 8) && totalAssigned === 64;

  const handleStartRename = (bombo: Bombo) => {
    setEditingBomboId(bombo.id);
    setEditName(bombo.name);
  };

  const handleSaveRename = (bomboId: string) => {
    if (!editName.trim()) return;
    const updated = bombos.map(b => b.id === bomboId ? { ...b, name: editName.trim() } : b);
    onUpdateBombos(updated);
    setEditingBomboId(null);
  };

  // Move selected duelist to target bombo
  const handleMoveToBombo = (targetBomboId: string) => {
    if (!selectedDuelistId) return;

    soundEffects.playClick();
    const sourceBombo = bombos.find(b => b.duelistIds.includes(selectedDuelistId));

    // Target bombo check
    const targetBombo = bombos.find(b => b.id === targetBomboId);
    if (!targetBombo || targetBombo.duelistIds.length >= 8) {
      if (sourceBombo?.id !== targetBomboId) {
        alert('Este bombo ya tiene el cupo máximo de 8 duelistas.');
      }
      setSelectedDuelistId(null);
      return;
    }

    const updated = bombos.map(b => {
      if (sourceBombo && b.id === sourceBombo.id) {
        return { ...b, duelistIds: b.duelistIds.filter(id => id !== selectedDuelistId) };
      }
      if (b.id === targetBomboId) {
        return { ...b, duelistIds: [...b.duelistIds, selectedDuelistId] };
      }
      return b;
    });

    onUpdateBombos(updated);
    setSelectedDuelistId(null);
  };

  // Distribute by era: 1 era per bombo
  const handleDistributeByEra = () => {
    soundEffects.playVictory();
    const eras = ['DM', 'GX', '5D\'s', 'ZEXAL', 'ARC-V', 'VRAINS', 'SEVENS', 'Go RUSH!!'];
    const allIds = selected64Ids.length === 64 ? selected64Ids : Array.from(assignedIds);
    
    const updated = bombos.map((b, idx) => {
      const era = eras[idx];
      const eraIds = allIds.filter(id => duelistsMap.get(id)?.era === era);
      return {
        ...b,
        name: `Bombo ${String.fromCharCode(65 + idx)} (${era})`,
        duelistIds: eraIds.slice(0, 8)
      };
    });

    // Catch any leftovers if an era didn't have strictly 8
    const newAssigned = new Set(updated.flatMap(b => b.duelistIds));
    const unassigned = allIds.filter(id => !newAssigned.has(id));

    updated.forEach(b => {
      while (b.duelistIds.length < 8 && unassigned.length > 0) {
        b.duelistIds.push(unassigned.pop()!);
      }
    });

    onUpdateBombos(updated);
    setSelectedDuelistId(null);
  };

  // Shuffle evenly (Sorteo Aleatorio de Bombos)
  const handleAutoShuffle = () => {
    soundEffects.playVictory();
    const allIds = selected64Ids.length === 64 ? [...selected64Ids] : [...bombos.flatMap(b => b.duelistIds)];
    const shuffled = allIds.sort(() => Math.random() - 0.5);

    const updated = bombos.map((b, idx) => ({
      ...b,
      duelistIds: shuffled.slice(idx * 8, idx * 8 + 8)
    }));

    onUpdateBombos(updated);
    setSelectedDuelistId(null);
  };

  // Empty all bombos to unassigned tray
  const handleClearAllBombos = () => {
    soundEffects.playClick();
    const empty = bombos.map(b => ({
      ...b,
      duelistIds: []
    }));
    onUpdateBombos(empty);
    setSelectedDuelistId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#080d1e] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>PASO 2 :: CONFIGURACIÓN Y GESTIÓN DE BOMBOS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Distribución en Bombos (8 por Bombo)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-[#00d2ff] border border-cyan-700/60 font-mono">
              {totalAssigned} / 64 Asignados
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Asigna manualmente o mediante sorteo aleatorio a los 64 duelistas en los 8 Bombos. Una vez completos, procederás al <strong>Armado de Grupos balanceados</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalog}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Modificar 64
          </button>

          <button
            onClick={() => {
              if (allBombosValid) {
                soundEffects.playVictory();
                setIsGroupDrawModalOpen(true);
              }
            }}
            disabled={!allBombosValid}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
              allBombosValid
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-900/40 hover:from-cyan-300 hover:to-blue-400 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Dices size={15} />
            <span>Armar Grupos por Bombos (Paso 3)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Quick Balance Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#0d1526] border border-blue-950/60 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="font-semibold">Métodos de Asignación en Bombos:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAutoShuffle}
            className="px-3 py-1.5 rounded-md bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Distribuye aleatoriamente a los 64 duelistas en partes iguales (8 por bombo)"
          >
            <Shuffle size={13} />
            <span>Sorteo Aleatorio (Automático)</span>
          </button>
          <button
            onClick={handleDistributeByEra}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Distribuye 8 duelistas por generación en cada bombo"
          >
            Separar por Generación (1 por Era)
          </button>
          <button
            onClick={handleClearAllBombos}
            className="px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            title="Vaciar todos los bombos y colocar duelistas en la bandeja para asignación manual"
          >
            <RotateCcw size={12} />
            <span>Vaciar Bombos</span>
          </button>
        </div>
      </div>

      {/* Unassigned Duelists Tray (If any duelists are not yet in bombos) */}
      {unassignedIds.length > 0 && (
        <div className="bg-[#09101d] border border-cyan-500/40 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-cyan-300 font-bold">
              <Users size={14} className="text-cyan-400" />
              <span>BANDEJA DE DUELISTAS CLASIFICADOS PENDIENTES ({unassignedIds.length} sin asignar)</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Haz clic en cualquier duelista para seleccionarlo y luego en "Mover Aquí" en el bombo de tu elección.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-1">
            {unassignedIds.map(duelistId => {
              const d = duelistsMap.get(duelistId);
              if (!d) return null;
              const isSelected = selectedDuelistId === d.id;

              return (
                <div
                  key={d.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedDuelistId(isSelected ? null : d.id);
                  }}
                  className={`p-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400'
                      : 'bg-[#060a15] hover:bg-[#0b1329] border-blue-950/70 text-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded overflow-hidden bg-slate-800 shrink-0 flex items-center justify-center text-xs">
                    {d.avatarUrl ? (
                      <img src={d.avatarUrl} alt={d.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{d.avatarIcon}</span>
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-white text-[10px] truncate">{d.name}</div>
                    <div className="text-[9px] text-cyan-400 font-mono">{d.era}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Duelist Moving Notification */}
      {selectedDuelistId && (
        <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-400/80 flex items-center justify-between text-xs text-cyan-200 animate-pulse">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={14} className="text-[#00d2ff]" />
            <span>
              Moviendo a: <strong>{duelistsMap.get(selectedDuelistId)?.name}</strong> ({duelistsMap.get(selectedDuelistId)?.era}). 
              Haz clic en el botón <strong>"Mover Aquí"</strong> del bombo donde desees asignarlo.
            </span>
          </div>
          <button
            onClick={() => setSelectedDuelistId(null)}
            className="text-slate-400 hover:text-white underline ml-3 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Grid of 8 Bombos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bombos.map((bombo, idx) => {
          const isFull = bombo.duelistIds.length === 8;

          return (
            <div
              key={bombo.id}
              className={`rounded-xl border flex flex-col justify-between transition-all ${
                isFull
                  ? 'bg-[#09101d] border-blue-950/60'
                  : 'bg-[#070b16] border-blue-900/40'
              }`}
            >
              {/* Bombo Header */}
              <div className="p-3.5 border-b border-blue-950/70 bg-[#0d1526] rounded-t-xl flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  {editingBomboId === bombo.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-black border border-cyan-400 rounded text-white font-semibold"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(bombo.id)}
                        className="p-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 group">
                      <span className="text-xs font-bold text-white truncate">{bombo.name}</span>
                      <button
                        onClick={() => handleStartRename(bombo)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-cyan-300 cursor-pointer transition-opacity"
                        title="Renombrar bombo"
                      >
                        <Edit2 size={11} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isFull 
                      ? 'bg-blue-950 text-[#00d2ff] border border-blue-800' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {bombo.duelistIds.length}/8
                  </span>

                  {selectedDuelistId && bombo.duelistIds.length < 8 && (
                    <button
                      onClick={() => handleMoveToBombo(bombo.id)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-cyan-400 hover:bg-cyan-300 text-black rounded cursor-pointer shadow-sm shadow-cyan-950"
                    >
                      Mover Aquí
                    </button>
                  )}
                </div>
              </div>

              {/* List of 8 Duelists */}
              <div className="p-2 space-y-1.5 flex-1 min-h-[220px]">
                {bombo.duelistIds.map((duelistId) => {
                  const d = duelistsMap.get(duelistId);
                  if (!d) return null;
                  const isSelectedForMove = selectedDuelistId === d.id;

                  return (
                    <div
                      key={d.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedDuelistId(isSelectedForMove ? null : d.id);
                      }}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                        isSelectedForMove
                          ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-950'
                          : 'bg-[#0b1329] hover:bg-[#0e172a] border border-blue-900/50 hover:border-cyan-500/50 text-slate-200'
                      }`}
                      title="Haz clic para seleccionar y reasignar a otro bombo"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-lg overflow-hidden border border-blue-900/50 bg-[#09101d] shrink-0 flex items-center justify-center">
                          {d.avatarUrl ? (
                            <img
                              src={d.avatarUrl}
                              alt={d.name}
                              className="w-full h-full object-cover object-top"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-xs select-none">{d.avatarIcon}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-bold text-white truncate text-[11px]">{d.name}</span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 shrink-0">
                              {d.era}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                            <span className="text-slate-500 font-mono text-[9px] uppercase">As:</span>
                            <span className="text-slate-300 font-medium truncate">{d.aceMonster}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {bombo.duelistIds.length === 0 && (
                  <div className="text-center py-10 text-[11px] text-slate-500 italic">
                    Bombo vacío. Asigna duelistas desde la bandeja o usa Sorteo Aleatorio.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Group Draw From Bombos Modal (Paso 3) */}
      <GroupDrawFromBombosModal
        isOpen={isGroupDrawModalOpen}
        onClose={() => setIsGroupDrawModalOpen(false)}
        bombos={bombos}
        duelistsMap={duelistsMap}
        onConfirmGroups={(finalizedGroups) => {
          onProceedToGroupsWithData(finalizedGroups);
        }}
      />
    </div>
  );
};
