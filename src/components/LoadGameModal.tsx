import React, { useRef } from 'react';
import { soundEffects } from '../utils/audio';
import { FolderOpen, Upload, X, Check, Clock, HardDrive, FileJson } from 'lucide-react';

interface LoadGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCurrentSlot: () => void;
  onImportJsonFile: (jsonContent: string) => void;
  onDeleteSlot: () => void;
  currentPhaseName: string;
  totalMatches: number;
  playedMatches: number;
  selectedCount: number;
}

export const LoadGameModal: React.FC<LoadGameModalProps> = ({
  isOpen,
  onClose,
  onLoadCurrentSlot,
  onImportJsonFile,
  onDeleteSlot,
  currentPhaseName,
  totalMatches,
  playedMatches,
  selectedCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState<boolean>(false);
  const [deletedNotice, setDeletedNotice] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        soundEffects.playVictory();
        onImportJsonFile(content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmDelete = () => {
    soundEffects.playClick();
    onDeleteSlot();
    setShowConfirmDelete(false);
    setDeletedNotice(true);
    setTimeout(() => {
      setDeletedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#080d1e] border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-cyan-400" size={18} />
            <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
              GESTIÓN DE ARCHIVOS :: MATRIX TOURNAMENT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {deletedNotice && (
          <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
            <Check size={16} className="text-rose-400 shrink-0" />
            <span>Partida guardada eliminada con éxito del almacenamiento local.</span>
          </div>
        )}

        {/* Slot 1: Active Tournament in Local Storage */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Ranura Principal (Almacenamiento Local)
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-emerald-400" />
                <span className="font-bold text-white text-xs">SLOT ACTUAL (Activo)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Auto-Guardado
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>
                <span className="text-slate-400">Estado: </span>
                <span className="text-cyan-300 font-semibold">{currentPhaseName}</span>
              </div>
              <div>
                <span className="text-slate-400">Progreso de Duelos: </span>
                <span className="font-mono text-white">{playedMatches} / {totalMatches} disputados</span>
              </div>
              <div>
                <span className="text-slate-400">Duelistas Oficiales: </span>
                <span className="font-mono text-white">{selectedCount} / 64 participantes</span>
              </div>
            </div>

            {/* Confirmation Box for Delete */}
            {showConfirmDelete ? (
              <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <X size={14} className="text-rose-400" />
                  <span>¿Confirmas que deseas eliminar esta partida guardada?</span>
                </div>
                <p className="text-[11px] text-rose-300/80 leading-snug">
                  Se borrará todo el progreso actual (duelos jugados, puntuaciones, bombos y llaves) del navegador.
                </p>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Sí, Borrar Partida
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    soundEffects.playVictory();
                    onLoadCurrentSlot();
                    onClose();
                  }}
                  className="flex-1 w-full py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check size={14} strokeWidth={3} />
                  <span>Cargar Slot y Continuar</span>
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full sm:w-auto py-2 px-3 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Eliminar partida guardada"
                >
                  <X size={14} />
                  <span>Borrar Partida</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Option 2: Upload external JSON backup */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Cargar Respaldo Externo (.JSON)
          </div>
          <p className="text-[11px] text-slate-400">
            Importa un campeonato guardado previamente en formato JSON para restaurar duelistas, bombos y llaves.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/60 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileJson size={15} />
            <span>Seleccionar Archivo JSON de Partida</span>
          </button>
        </div>

        <div className="text-right pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
