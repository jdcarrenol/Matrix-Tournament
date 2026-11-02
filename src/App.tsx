import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bombo, 
  BracketMatch, 
  Duelist, 
  Group, 
  GroupMatch, 
  TournamentPhase,
  TournamentSettings
} from './types/tournament';
import { INITIAL_DUELISTS_DATABASE, getInitial64Duelists } from './data/characters';
import { 
  createDefaultBombos, 
  createDefaultGroups, 
  createEmptyBombos,
  createEmptyGroups,
  createEmptyBracket 
} from './utils/tournamentHelpers';
import { soundEffects } from './utils/audio';

import { Header } from './components/Header';
import { TerminalGreeting } from './components/TerminalGreeting';
import { CatalogSelector } from './components/CatalogSelector';
import { BombosManager } from './components/BombosManager';
import { GroupsManager } from './components/GroupsManager';
import { LiveDrawStage } from './components/LiveDrawStage';
import { BracketsView } from './components/BracketsView';
import { SettingsView } from './components/SettingsView';
import { LoadGameModal } from './components/LoadGameModal';

const STORAGE_KEY_PREFIX = 'mct_yugioh_v3_';

const DEFAULT_SETTINGS: TournamentSettings = {
  pointsWin: 3,
  pointsDraw: 1,
  pointsLoss: 0,
  qualifiersPerGroup: 4,
  matchFormat: 'Bo3',
  bracketFormat: 'Red Bull Batalla Modificado',
  audioEnabled: true
};

export default function App() {
  // 1. Settings state
  const [settings, setSettings] = useState<TournamentSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // 2. Catalog of duelists
  const [catalog, setCatalog] = useState<Duelist[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}catalog`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DUELISTS_DATABASE;
  });

  // 3. Selected 64 Duelist IDs (Starts empty by default; user selects 64 in Catalog)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}selected_ids`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Map of duelists for O(1) lookups
  const duelistsMap = useMemo(() => {
    const map = new Map<string, Duelist>();
    catalog.forEach(d => map.set(d.id, d));
    return map;
  }, [catalog]);

  // 4. Bombos (8 bombos, starts empty by default awaiting 64 distribution)
  const [bombos, setBombos] = useState<Bombo[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}bombos`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 8) return parsed;
      }
    } catch {
      // fallback
    }
    return createEmptyBombos();
  });

  // 5. Groups (Grupos A al H, starts empty by default, matches empty for manual pairing)
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}groups`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 8) return parsed;
      }
    } catch {
      // fallback
    }
    return createEmptyGroups();
  });

  // 6. Brackets Matches (32-player single-elimination structure)
  const [bracketMatches, setBracketMatches] = useState<BracketMatch[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}brackets`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return createEmptyBracket();
  });

  // 7. Navigation Phase
  const [currentPhase, setCurrentPhase] = useState<TournamentPhase>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}phase`);
      if (saved) return saved as TournamentPhase;
    } catch {
      // fallback
    }
    return 'MENU_INIT';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.audioEnabled);
  const [isLoadGameOpen, setIsLoadGameOpen] = useState<boolean>(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}catalog`, JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}selected_ids`, JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}bombos`, JSON.stringify(bombos));
  }, [bombos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}groups`, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}brackets`, JSON.stringify(bracketMatches));
  }, [bracketMatches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}phase`, currentPhase);
  }, [currentPhase]);

  // Overall tournament progress calculations
  const totalMatchesCount = useMemo(() => {
    return groups.reduce((acc, g) => acc + g.matches.length, 0);
  }, [groups]);

  const playedMatchesCount = useMemo(() => {
    return groups.reduce((acc, g) => acc + g.matches.filter(m => m.played).length, 0);
  }, [groups]);

  const hasPlayedAny = playedMatchesCount > 0;
  const isGroupsFinished = playedMatchesCount === totalMatchesCount && totalMatchesCount > 0;

  const activePhaseName = useMemo(() => {
    if (currentPhase === 'MENU_INIT') {
      if (bracketMatches.some(m => m.played)) return 'Fase Final (Llaves de Eliminación)';
      if (isGroupsFinished) return 'Sorteo en Vivo (32 Clasificados)';
      if (hasPlayedAny) return `Fase de Grupos (Duelos: ${playedMatchesCount}/${totalMatchesCount})`;
      return 'Configuración Inicial';
    }
    if (currentPhase === 'GROUPS_PLAY') return 'Fase de Grupos (A - H)';
    if (currentPhase === 'LIVE_DRAW') return 'Sorteo en Vivo (Top 32)';
    if (currentPhase === 'BRACKETS_PLAY' || currentPhase === 'CHAMPION_PODIUM') return 'Llaves Eliminatorias';
    if (currentPhase === 'CATALOG_SELECT') return 'Catálogo & Competidores';
    if (currentPhase === 'BOMBOS_SETUP') return 'Organización en Bombos';
    if (currentPhase === 'SETTINGS') return 'Ajustes del Torneo';
    return 'Panel de Control';
  }, [currentPhase, hasPlayedAny, isGroupsFinished, playedMatchesCount, totalMatchesCount, bracketMatches]);

  // Handlers for Phase 1: Selection & Catalog
  const handleToggleSelectDuelist = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectBalanced = () => {
    const balanced64 = getInitial64Duelists();
    setSelectedIds(balanced64);
  };

  const handleClearAllSelected = () => {
    setSelectedIds([]);
  };

  const handleAddCustomDuelist = (newDuelist: Duelist) => {
    setCatalog(prev => [newDuelist, ...prev]);
    setSelectedIds(prev => [newDuelist.id, ...prev]);
  };

  const handleUpdateDuelist = (updatedDuelist: Duelist) => {
    setCatalog(prev => prev.map(d => d.id === updatedDuelist.id ? updatedDuelist : d));
  };

  // Handlers for Phase 2: Bombos
  const handleProceedToBombos = () => {
    if (!bombos || bombos.length !== 8) {
      setBombos(createEmptyBombos());
    }
    setCurrentPhase('BOMBOS_SETUP');
  };

  // Handlers for Phase 3: Groups
  const handleProceedToGroups = () => {
    const newGroups = createDefaultGroups(bombos, true);
    setGroups(newGroups);
    setCurrentPhase('GROUPS_PLAY');
  };

  const handleUpdateGroupMatches = (groupId: string, newMatches: GroupMatch[]) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, matches: newMatches } : g));
  };

  const handleUpdateGroupDuelists = (groupId: string, duelistIds: string[]) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, duelistIds } : g));
  };

  const handleUpdateGroupOverrides = (groupId: string, overrides: string[] | undefined) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, commissionerOverrides: overrides } : g));
  };

  // Handlers for Phase 4: Live Draw
  const handleProceedToLiveDraw = () => {
    setCurrentPhase('LIVE_DRAW');
  };

  // Handlers for Phase 5: Brackets
  const handleProceedToBrackets = () => {
    setCurrentPhase('BRACKETS_PLAY');
  };

  // Menu Options: [1], [2], [3], [4], [5]
  const handleSelectMenuOption = (option: 1 | 2 | 3 | 4 | 5) => {
    if (option === 1) {
      // [1] Nuevo Torneo
      soundEffects.playClick();
      setCurrentPhase('CATALOG_SELECT');
    } else if (option === 2) {
      // [2] Continuar Torneo
      soundEffects.playVictory();
      if (bracketMatches.some(m => m.played)) {
        setCurrentPhase('BRACKETS_PLAY');
      } else if (isGroupsFinished) {
        setCurrentPhase('LIVE_DRAW');
      } else {
        setCurrentPhase('GROUPS_PLAY');
      }
    } else if (option === 3) {
      // [3] Competidores & Catálogo
      soundEffects.playClick();
      setCurrentPhase('CATALOG_SELECT');
    } else if (option === 4) {
      // [4] Ajustes
      soundEffects.playClick();
      setCurrentPhase('SETTINGS');
    } else if (option === 5) {
      // [5] Reiniciar Sistema
      handleResetTournament();
    }
  };

  // Full reset
  const handleResetTournament = () => {
    if (window.confirm('¿Deseas reiniciar todo el sistema del MCT? Se restablecerán la selección de 64, los bombos, grupos y resultados para empezar un torneo completamente desde cero.')) {
      handleDeleteSavedGame();
    }
  };

  // Delete saved game from active slot (File management)
  const handleDeleteSavedGame = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}brackets`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}groups`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}bombos`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}selected_ids`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}phase`);

    setSelectedIds([]);
    setCatalog(INITIAL_DUELISTS_DATABASE);
    setBombos(createEmptyBombos());
    setGroups(createEmptyGroups());
    setBracketMatches(createEmptyBracket());
    setCurrentPhase('MENU_INIT');
    soundEffects.playClick();
  };

  // Export State JSON
  const handleExportState = () => {
    const stateData = {
      version: '5.0',
      exportedAt: new Date().toISOString(),
      settings,
      catalog,
      selectedIds,
      bombos,
      groups,
      bracketMatches,
      currentPhase
    };

    const blob = new Blob([JSON.stringify(stateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mct_yugioh_tournament_v5_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import State JSON
  const handleImportState = (jsonContent: string) => {
    try {
      const data = JSON.parse(jsonContent);
      if (data.catalog) setCatalog(data.catalog);
      if (data.selectedIds) setSelectedIds(data.selectedIds);
      if (data.bombos) setBombos(data.bombos);
      if (data.groups) setGroups(data.groups);
      if (data.bracketMatches) setBracketMatches(data.bracketMatches);
      if (data.settings) setSettings(data.settings);
      if (data.currentPhase) setCurrentPhase(data.currentPhase);
      alert('¡Torneo restaurado con éxito desde la copia de seguridad!');
    } catch {
      alert('Error: El archivo JSON de respaldo no es válido.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Bar Navigation */}
      <Header
        currentPhase={currentPhase}
        onSelectPhase={setCurrentPhase}
        selectedCount={selectedIds.length}
        onResetTournament={handleResetTournament}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = soundEffects.toggle();
          setSoundEnabled(next);
        }}
        onOpenSettings={() => setCurrentPhase('SETTINGS')}
        onContinueTournament={() => handleSelectMenuOption(2)}
        onStartNewTournament={() => handleSelectMenuOption(1)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentPhase === 'MENU_INIT' && (
          <TerminalGreeting
            onContinue={() => handleSelectMenuOption(2)}
            onNewGame={() => handleSelectMenuOption(1)}
            onLoadGame={() => setIsLoadGameOpen(true)}
            onCompetitors={() => handleSelectMenuOption(3)}
            onSettings={() => handleSelectMenuOption(4)}
            onReset={handleResetTournament}
            selectedCount={selectedIds.length}
            totalCatalogCount={catalog.length}
            playedMatchesCount={playedMatchesCount}
            totalMatchesCount={totalMatchesCount}
            hasActiveTournament={hasPlayedAny}
            activePhaseName={activePhaseName}
          />
        )}

        {currentPhase === 'CATALOG_SELECT' && (
          <CatalogSelector
            catalog={catalog}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelectDuelist}
            onSelectBalanced={handleSelectBalanced}
            onClearAll={handleClearAllSelected}
            onAddCustomDuelist={handleAddCustomDuelist}
            onUpdateDuelist={handleUpdateDuelist}
            onProceedToBombos={handleProceedToBombos}
          />
        )}

        {currentPhase === 'BOMBOS_SETUP' && (
          <BombosManager
            bombos={bombos}
            duelistsMap={duelistsMap}
            selected64Ids={selectedIds}
            onUpdateBombos={setBombos}
            onProceedToGroupsWithData={(newGroups) => {
              setGroups(newGroups);
              setCurrentPhase('GROUPS_PLAY');
            }}
            onBackToCatalog={() => setCurrentPhase('CATALOG_SELECT')}
          />
        )}

        {(currentPhase === 'GROUPS_PLAY' || currentPhase === 'GROUPS_SETUP') && (
          <GroupsManager
            groups={groups}
            bombos={bombos}
            duelistsMap={duelistsMap}
            onUpdateGroupMatches={handleUpdateGroupMatches}
            onUpdateGroupDuelists={handleUpdateGroupDuelists}
            onUpdateGroupOverrides={handleUpdateGroupOverrides}
            onProceedToLiveDraw={handleProceedToLiveDraw}
            onBackToBombos={() => setCurrentPhase('BOMBOS_SETUP')}
            onUpdateDuelist={handleUpdateDuelist}
          />
        )}

        {currentPhase === 'LIVE_DRAW' && (
          <LiveDrawStage
            groups={groups}
            bracketMatches={bracketMatches}
            duelistsMap={duelistsMap}
            onUpdateBracketMatches={setBracketMatches}
            onProceedToBrackets={handleProceedToBrackets}
            onBackToGroups={() => setCurrentPhase('GROUPS_PLAY')}
          />
        )}

        {(currentPhase === 'BRACKETS_PLAY' || currentPhase === 'CHAMPION_PODIUM') && (
          <BracketsView
            matches={bracketMatches}
            duelistsMap={duelistsMap}
            onUpdateMatches={setBracketMatches}
            onBackToLiveDraw={() => setCurrentPhase('LIVE_DRAW')}
          />
        )}

        {currentPhase === 'SETTINGS' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            onBackToMenu={() => setCurrentPhase('MENU_INIT')}
            onExportState={handleExportState}
            onImportState={handleImportState}
          />
        )}
      </main>

      {/* Load Game / Save Slots Modal */}
      <LoadGameModal
        isOpen={isLoadGameOpen}
        onClose={() => setIsLoadGameOpen(false)}
        onLoadCurrentSlot={() => handleSelectMenuOption(2)}
        onImportJsonFile={handleImportState}
        onDeleteSlot={handleDeleteSavedGame}
        currentPhaseName={activePhaseName}
        totalMatches={totalMatchesCount}
        playedMatches={playedMatchesCount}
        selectedCount={selectedIds.length}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#04060d] py-5 px-6 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono">MATRIX TOURNAMENT</span>
            <span>·</span>
            <span>Sistema Central de Gestión de Esports & Yu-Gi-Oh! Multiversal</span>
          </div>
          <div className="text-slate-400">
            Control Manual (Cero Azar) · Brackets Estilo Red Bull Batalla Modificado · Árbol Esquemático
          </div>
        </div>
      </footer>
    </div>
  );
}
