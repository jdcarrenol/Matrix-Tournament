export type Era = 
  | 'DM' 
  | 'GX' 
  | '5D\'s' 
  | 'ZEXAL' 
  | 'ARC-V' 
  | 'VRAINS' 
  | 'SEVENS' 
  | 'Go RUSH!!';

export type DeckMechanic = 
  | 'Fusión' 
  | 'Sincro' 
  | 'Xyz' 
  | 'Péndulo' 
  | 'Enlace' 
  | 'Ritual' 
  | 'Maximum / Rush'
  | 'Híbrido Moderno';

export interface Duelist {
  id: string;
  name: string;
  alias: string;
  era: Era;
  archetype: string;
  secondaryDeck?: string;
  specialAnimeCard?: string; // e.g. "El Sello de Orichalcos", "Cartas de Armadura", "Dragones Legendarios", "Modo Dios Inmortal"
  badgeStatus?: 'Activo' | 'Soporte Moderno' | 'Cabecera de Serie' | 'Arquetipo Especial del Anime';
  mechanic: DeckMechanic;
  aceMonster: string;
  avatarIcon: string; // emoji or identifier
  avatarUrl?: string; // photo/render URL or base64 data URI
  quote: string;
  description: string;
  isCustom?: boolean;
  isEdited?: boolean;
}

export interface Bombo {
  id: string;
  name: string;
  duelistIds: string[];
}

export interface GroupMatch {
  id: string;
  groupId: string;
  matchday: number; // 1 to 7
  duelist1Id: string;
  duelist2Id: string;
  score1: number;
  score2: number;
  winnerId: string | 'DRAW' | null;
  played: boolean;
  narrativePrompt?: string;
  narrativeSummary?: string;
  variantDeck1?: string;
  variantDeck2?: string;
}

export interface GroupStanding {
  duelistId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  duelsWon: number;
  duelsLost: number;
  goalDiff: number; // DG = duelsWon - duelsLost
}

export interface Group {
  id: string; // 'A' | 'B' | ... | 'H'
  name: string; // "Grupo A"
  duelistIds: string[]; // exactly 8
  matches: GroupMatch[];
  commissionerOverrides?: string[]; // Manual priority order to resolve ties or custom commissioner ranking
}

export type BracketStage = 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';

export interface BracketMatch {
  id: string;
  stage: BracketStage;
  slotName: string; // e.g. "Llave A-1", "Octavos 1", etc.
  matchIndex: number;
  duelist1Id: string | null;
  duelist2Id: string | null;
  score1: number;
  score2: number;
  winnerId: string | null;
  played: boolean;
  narrativePrompt?: string;
  narrativeSummary?: string;
  nextMatchId?: string;
  nextSlotPosition?: 1 | 2;
  loserMatchId?: string; // For SF losers going to 3rd place
}

export interface TournamentSettings {
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  qualifiersPerGroup: number;
  matchFormat: 'Bo3' | 'Bo1';
  bracketFormat: 'Red Bull Batalla Modificado' | 'Sorteo Manual';
  audioEnabled: boolean;
}

export type TournamentPhase = 
  | 'MENU_INIT'
  | 'CATALOG_SELECT'
  | 'BOMBOS_SETUP'
  | 'GROUPS_SETUP'
  | 'GROUPS_PLAY'
  | 'LIVE_DRAW'
  | 'BRACKETS_PLAY'
  | 'CHAMPION_PODIUM'
  | 'SETTINGS';
