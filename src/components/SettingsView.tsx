import React, { useState, useRef } from 'react';
import { TournamentSettings } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { 
  Settings, 
  Check, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  ArrowLeft, 
  Sliders, 
  Trophy, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface SettingsViewProps {
  settings: TournamentSettings;
  onUpdateSettings: (settings: TournamentSettings) => void;
  onBackToMenu: () => void;
  onExportState: () => void;
  onImportState: (jsonData: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onBackToMenu,
  onExportState,
  onImportState
}) => {
  const [pointsWin, setPointsWin] = useState(settings.pointsWin);
  const [pointsDraw, setPointsDraw] = useState(settings.pointsDraw);
  const [pointsLoss, setPointsLoss] = useState(settings.pointsLoss);
  const [qualifiersPerGroup, setQualifiersPerGroup] = useState(settings.qualifiersPerGroup);
  const [matchFormat, setMatchFormat] = useState(settings.matchFormat);
  const [bracketFormat, setBracketFormat] = useState(settings.bracketFormat);
  const [audioEnabled, setAudioEnabled] = useState(settings.audioEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const importFileRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playVictory();

    const updated: TournamentSettings = {
      pointsWin,
      pointsDraw,
      pointsLoss,
      qualifiersPerGroup,
      matchFormat,
      bracketFormat,
      audioEnabled
    };

    onUpdateSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        soundEffects.playVictory();
        onImportState(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreDefaults = () => {
    soundEffects.playClick();
    setPointsWin(3);
    setPointsDraw(1);
    setPointsLoss(0);
    setQualifiersPerGroup(4);
    setMatchFormat('Bo3');
    setBracketFormat('Red Bull Batalla Modificado');
    setAudioEnabled(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#080d1e] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>[ ⚙️ ] MENÚ DE AJUSTES & REGLAS OFICIALES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Configuración del Campeonato MCT v5.0</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Ajusta el sistema de puntuación, formatos de duelo, reglas de clasificación y respalda o restaura tus campeonatos en JSON.
          </p>
        </div>

        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft size={14} />
          <span>Volver al Menú</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>¡Ajustes guardados con éxito! Los parámetros se han actualizado en todo el sistema.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Puntuación de Grupos */}
        <div className="rounded-xl border border-slate-800 bg-[#070b17] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Trophy size={16} className="text-amber-400" />
              <span>1. Sistema de Puntuación de la Fase de Grupos</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Reglas Oficiales</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="block text-emerald-300 font-bold uppercase tracking-wider">
                Victoria (PTS)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={pointsWin}
                onChange={e => setPointsWin(parseInt(e.target.value) || 3)}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white font-mono text-base font-bold text-center focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block text-center">Predeterminado: +3 pts</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="block text-amber-300 font-bold uppercase tracking-wider">
                Empate (PTS)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={pointsDraw}
                onChange={e => setPointsDraw(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white font-mono text-base font-bold text-center focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block text-center">Predeterminado: +1 pt c/u</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="block text-rose-300 font-bold uppercase tracking-wider">
                Derrota (PTS)
              </label>
              <input
                type="number"
                min="0"
                max="3"
                value={pointsLoss}
                onChange={e => setPointsLoss(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white font-mono text-base font-bold text-center focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block text-center">Predeterminado: 0 pts</span>
            </div>
          </div>
        </div>

        {/* Section 2: Formato de Competencia & Clasificación */}
        <div className="rounded-xl border border-slate-800 bg-[#070b17] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Sliders size={16} className="text-cyan-400" />
              <span>2. Formato de Competencia & Eliminatorias</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Modo de Duelo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="block text-slate-200 font-bold">
                Clasificados por Grupo a Llaves
              </label>
              <select
                value={qualifiersPerGroup}
                onChange={e => setQualifiersPerGroup(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white text-xs font-semibold focus:border-cyan-400 focus:outline-none"
              >
                <option value="4">Top 4 (Clasifican 32 duelistas a Dieciseisavos) [Estándar]</option>
                <option value="2">Top 2 (Clasifican 16 duelistas a Octavos)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Determina cuántos duelistas de cada uno de los 8 grupos avanzan a eliminación directa.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="block text-slate-200 font-bold">
                Formato de Duelos en Grupos
              </label>
              <select
                value={matchFormat}
                onChange={e => setMatchFormat(e.target.value as 'Bo3' | 'Bo1')}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white text-xs font-semibold focus:border-cyan-400 focus:outline-none"
              >
                <option value="Bo3">Mejor de 3 Duelos (Best of 3 · Marcador 2-0 / 2-1) [Oficial]</option>
                <option value="Bo1">Duelo Simple (Best of 1 · Victoria Directa)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Formato de partida estándar en el circuito competitivo KaibaCorp.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Audio y Efectos Sintetizados KaibaCorp */}
        <div className="rounded-xl border border-slate-800 bg-[#070b17] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Volume2 size={16} className="text-blue-400" />
              <span>3. Efectos de Audio Sintetizados (Web Audio API)</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Sonido KaibaCorp</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Efectos de Interfaz y Fanfarria de Sorteo</div>
              <div className="text-[11px] text-slate-400">
                Beeps táctiles, arpegios al revelar bolas de sorteo y fanfarrias de victoria.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = soundEffects.toggle();
                setAudioEnabled(next);
              }}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                audioEnabled
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-950'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{audioEnabled ? 'Sonido Activado' : 'Sonido Silenciado'}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Exportar / Importar Campeonato (JSON) */}
        <div className="rounded-xl border border-slate-800 bg-[#070b17] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <ShieldCheck size={16} className="text-purple-400" />
              <span>4. Respaldo y Portabilidad del Torneo (JSON)</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Backup Seguro</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Download size={14} className="text-cyan-400" />
                  <span>Exportar Estado Completo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Descarga un archivo JSON con todos los duelistas, fichas personalizadas, bombos, resultados y llaves del torneo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playVictory();
                  onExportState();
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Descargar Copia de Seguridad (.json)</span>
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Upload size={14} className="text-purple-400" />
                  <span>Restaurar Torneo desde Respaldo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Carga un archivo JSON previamente exportado para reanudar el torneo exactamente como lo dejaste.
                </p>
              </div>

              <div>
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => importFileRef.current?.click()}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Cargar Archivo de Torneo (.json)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Restaurar Valores por Defecto</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToMenu}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} strokeWidth={3} />
              <span>Guardar Configuración Oficial</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
