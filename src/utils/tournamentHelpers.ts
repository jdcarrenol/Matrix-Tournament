import { Bombo, BracketMatch, Duelist, Group, GroupMatch, GroupStanding } from '../types/tournament';

// Generate 8 Bombos from 64 duelists
export function createDefaultBombos(selected64Ids: string[], _duelistsMap?: Map<string, Duelist>): Bombo[] {
  const bombosNames = [
    'Bombo A',
    'Bombo B',
    'Bombo C',
    'Bombo D',
    'Bombo E',
    'Bombo F',
    'Bombo G',
    'Bombo H'
  ];

  const bombos: Bombo[] = bombosNames.map((name, idx) => ({
    id: `bombo_${idx + 1}`,
    name,
    duelistIds: []
  }));

  selected64Ids.forEach((id, index) => {
    const bomboIndex = Math.floor(index / 8);
    if (bombos[bomboIndex]) {
      bombos[bomboIndex].duelistIds.push(id);
    }
  });

  return bombos;
}

// Generate empty 8 Bombos
export function createEmptyBombos(): Bombo[] {
  const bombosNames = [
    'Bombo A',
    'Bombo B',
    'Bombo C',
    'Bombo D',
    'Bombo E',
    'Bombo F',
    'Bombo G',
    'Bombo H'
  ];
  return bombosNames.map((name, idx) => ({
    id: `bombo_${idx + 1}`,
    name,
    duelistIds: []
  }));
}

// Generate empty matches for 7 matchdays (4 empty mesas per matchday = 28 matches)
export function createEmptyGroupMatches(groupId: string): GroupMatch[] {
  const matches: GroupMatch[] = [];
  for (let matchday = 1; matchday <= 7; matchday++) {
    for (let mesa = 1; mesa <= 4; mesa++) {
      matches.push({
        id: `match_${groupId}_md${matchday}_${mesa}`,
        groupId,
        matchday,
        duelist1Id: '',
        duelist2Id: '',
        score1: 0,
        score2: 0,
        winnerId: null,
        played: false
      });
    }
  }
  return matches;
}

// Create 8 Groups (A through H) completely empty
export function createEmptyGroups(): Group[] {
  const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return groupIds.map(letter => ({
    id: letter,
    name: `Grupo ${letter}`,
    duelistIds: [],
    matches: createEmptyGroupMatches(letter)
  }));
}

// Generate round robin matches for 8 duelists in a group (7 matchdays, 4 matches each = 28 matches per group)
export function generateGroupMatches(groupId: string, duelistIds: string[]): GroupMatch[] {
  if (duelistIds.length !== 8) return createEmptyGroupMatches(groupId);

  // Berger tables / round-robin algorithm for 8 players
  // Fixed player 0, others rotate
  const players = [...duelistIds];
  const rounds: [number, number][][] = [];

  for (let round = 0; round < 7; round++) {
    const roundMatches: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      const p1 = (round + i) % 7;
      let p2 = (round + 7 - i) % 7;
      if (i === 0) {
        p2 = 7; // Fixed player
      }
      roundMatches.push([p1, p2]);
    }
    rounds.push(roundMatches);
  }

  const matches: GroupMatch[] = [];
  rounds.forEach((roundMatches, roundIdx) => {
    roundMatches.forEach(([p1Idx, p2Idx], matchIdx) => {
      matches.push({
        id: `match_${groupId}_md${roundIdx + 1}_${matchIdx + 1}`,
        groupId,
        matchday: roundIdx + 1,
        duelist1Id: players[p1Idx],
        duelist2Id: players[p2Idx],
        score1: 0,
        score2: 0,
        winnerId: null,
        played: false
      });
    });
  });

  return matches;
}

// Create 8 Groups (A through H) balanced by Bombos (1 duelist from each Bombo per Group)
// Matches start empty for zero-azar manual pairing!
export function createDefaultGroups(bombos: Bombo[], startMatchesEmpty = true): Group[] {
  const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const groups: Group[] = groupIds.map(letter => ({
    id: letter,
    name: `Grupo ${letter}`,
    duelistIds: [],
    matches: createEmptyGroupMatches(letter)
  }));

  // Standard seeding: Take 1 duelist from each Bombo into each Group
  bombos.forEach(bombo => {
    bombo.duelistIds.forEach((duelistId, gIdx) => {
      if (groups[gIdx]) {
        groups[gIdx].duelistIds.push(duelistId);
      }
    });
  });

  // If startMatchesEmpty is false, generate round robin pairings
  if (!startMatchesEmpty) {
    groups.forEach(g => {
      if (g.duelistIds.length === 8) {
        g.matches = generateGroupMatches(g.id, g.duelistIds);
      }
    });
  }

  return groups;
}

// Calculate standings for a group
// Calculate standings for a group according to official hierarchical tiebreakers:
// 1. Puntos (PTS)
// 2. Diferencia de Duelos (DG = duelsWon - duelsLost)
// 3. Duelos Totales Ganados (GF = duelsWon)
// 4. Enfrentamiento Directo (Head-to-Head)
// 5. Criterio del Comisionado / Sorteo
export function calculateGroupStandings(group: Group, customPriority?: string[]): GroupStanding[] {
  const standingsMap: { [id: string]: GroupStanding } = {};

  group.duelistIds.forEach(id => {
    standingsMap[id] = {
      duelistId: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
      duelsWon: 0,
      duelsLost: 0,
      goalDiff: 0
    };
  });

  group.matches.forEach(m => {
    if (!m.played || !m.winnerId) return;

    const s1 = standingsMap[m.duelist1Id];
    const s2 = standingsMap[m.duelist2Id];

    if (s1 && s2) {
      s1.played += 1;
      s2.played += 1;

      s1.duelsWon += m.score1;
      s1.duelsLost += m.score2;
      s2.duelsWon += m.score2;
      s2.duelsLost += m.score1;

      if (m.winnerId === 'DRAW') {
        s1.drawn += 1;
        s2.drawn += 1;
        s1.points += 1;
        s2.points += 1;
      } else if (m.winnerId === m.duelist1Id) {
        s1.won += 1;
        s2.lost += 1;
        s1.points += 3;
      } else if (m.winnerId === m.duelist2Id) {
        s2.won += 1;
        s1.lost += 1;
        s2.points += 3;
      }
    }
  });

  const list = Object.values(standingsMap);
  list.forEach(s => {
    s.goalDiff = s.duelsWon - s.duelsLost;
  });

  const commissionerOrder = customPriority || group.commissionerOverrides;

  // Hierarchical sort
  list.sort((a, b) => {
    // 1. Points DESC
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    // 2. Diferencia de Duelos (DG) DESC
    if (b.goalDiff !== a.goalDiff) {
      return b.goalDiff - a.goalDiff;
    }

    // 3. Duelos Totales Ganados (GF) DESC
    if (b.duelsWon !== a.duelsWon) {
      return b.duelsWon - a.duelsWon;
    }

    // 4. Enfrentamiento Directo (Head-to-Head)
    const directMatch = group.matches.find(m =>
      m.played &&
      ((m.duelist1Id === a.duelistId && m.duelist2Id === b.duelistId) ||
       (m.duelist1Id === b.duelistId && m.duelist2Id === a.duelistId))
    );

    if (directMatch && directMatch.winnerId && directMatch.winnerId !== 'DRAW') {
      if (directMatch.winnerId === a.duelistId) return -1;
      if (directMatch.winnerId === b.duelistId) return 1;
    }

    // 5. Criterio del Comisionado / Sorteo
    if (commissionerOrder && commissionerOrder.length > 0) {
      const idxA = commissionerOrder.indexOf(a.duelistId);
      const idxB = commissionerOrder.indexOf(b.duelistId);
      if (idxA !== -1 && idxB !== -1) {
        return idxA - idxB;
      } else if (idxA !== -1) {
        return -1;
      } else if (idxB !== -1) {
        return 1;
      }
    }

    // Deterministic fallback
    return a.duelistId.localeCompare(b.duelistId);
  });

  return list;
}

// Helper to inspect ties in points and how they resolve
export interface TieCheckResult {
  hasTies: boolean;
  tiedGroups: {
    points: number;
    duelistIds: string[];
    isAbsoluteTie: boolean;
    directMatchPlayed: boolean;
    directWinnerId: string | null;
  }[];
}

export function analyzeGroupTies(group: Group, standings: GroupStanding[]): TieCheckResult {
  const pointsMap = new Map<number, GroupStanding[]>();
  standings.forEach(s => {
    const arr = pointsMap.get(s.points) || [];
    arr.push(s);
    pointsMap.set(s.points, arr);
  });

  const tiedGroups: TieCheckResult['tiedGroups'] = [];

  pointsMap.forEach((members, pts) => {
    if (members.length > 1) {
      const ids = members.map(m => m.duelistId);
      // Check if DG and GF are identical for all
      const firstDG = members[0].goalDiff;
      const firstGF = members[0].duelsWon;
      const sameDG = members.every(m => m.goalDiff === firstDG);
      const sameGF = members.every(m => m.duelsWon === firstGF);

      let directMatchPlayed = false;
      let directWinnerId: string | null = null;

      if (members.length === 2) {
        const m = group.matches.find(match =>
          match.played &&
          ((match.duelist1Id === ids[0] && match.duelist2Id === ids[1]) ||
           (match.duelist1Id === ids[1] && match.duelist2Id === ids[0]))
        );
        if (m) {
          directMatchPlayed = true;
          directWinnerId = m.winnerId !== 'DRAW' ? m.winnerId : null;
        }
      }

      const isAbsoluteTie = sameDG && sameGF && (!directMatchPlayed || directWinnerId === null);

      tiedGroups.push({
        points: pts,
        duelistIds: ids,
        isAbsoluteTie,
        directMatchPlayed,
        directWinnerId
      });
    }
  });

  return {
    hasTies: tiedGroups.length > 0,
    tiedGroups
  };
}

// Get the top 4 duelists from each group (total 32)
export function getTop4FromAllGroups(groups: Group[]): { duelistId: string; groupId: string; rank: number }[] {
  const qualified: { duelistId: string; groupId: string; rank: number }[] = [];

  groups.forEach(g => {
    const standings = calculateGroupStandings(g);
    standings.slice(0, 4).forEach((s, idx) => {
      qualified.push({
        duelistId: s.duelistId,
        groupId: g.id,
        rank: idx + 1
      });
    });
  });

  return qualified;
}

// Generate empty 32-player bracket structure
export function createEmptyBracket(): BracketMatch[] {
  const matches: BracketMatch[] = [];

  // 1. Dieciseisavos (16 matches: r32_1 to r32_16)
  for (let i = 1; i <= 16; i++) {
    const half = i <= 8 ? 'A' : 'B';
    const sub = i <= 8 ? i : i - 8;
    const nextMatchIdx = Math.ceil(i / 2);
    const nextSlotPosition = i % 2 === 1 ? 1 : 2;

    matches.push({
      id: `r32_${i}`,
      stage: 'r32',
      slotName: `Llave ${half}-${sub}`,
      matchIndex: i,
      duelist1Id: null,
      duelist2Id: null,
      score1: 0,
      score2: 0,
      winnerId: null,
      played: false,
      nextMatchId: `r16_${nextMatchIdx}`,
      nextSlotPosition
    });
  }

  // 2. Octavos de Final (8 matches: r16_1 to r16_8)
  for (let i = 1; i <= 8; i++) {
    const nextMatchIdx = Math.ceil(i / 2);
    const nextSlotPosition = i % 2 === 1 ? 1 : 2;

    matches.push({
      id: `r16_${i}`,
      stage: 'r16',
      slotName: `Octavos ${i}`,
      matchIndex: i,
      duelist1Id: null,
      duelist2Id: null,
      score1: 0,
      score2: 0,
      winnerId: null,
      played: false,
      nextMatchId: `qf_${nextMatchIdx}`,
      nextSlotPosition
    });
  }

  // 3. Cuartos de Final (4 matches: qf_1 to qf_4)
  for (let i = 1; i <= 4; i++) {
    const nextMatchIdx = Math.ceil(i / 2);
    const nextSlotPosition = i % 2 === 1 ? 1 : 2;

    matches.push({
      id: `qf_${i}`,
      stage: 'qf',
      slotName: `Cuartos ${i}`,
      matchIndex: i,
      duelist1Id: null,
      duelist2Id: null,
      score1: 0,
      score2: 0,
      winnerId: null,
      played: false,
      nextMatchId: `sf_${nextMatchIdx}`,
      nextSlotPosition
    });
  }

  // 4. Semifinales (2 matches: sf_1, sf_2)
  for (let i = 1; i <= 2; i++) {
    matches.push({
      id: `sf_${i}`,
      stage: 'sf',
      slotName: `Semifinal ${i}`,
      matchIndex: i,
      duelist1Id: null,
      duelist2Id: null,
      score1: 0,
      score2: 0,
      winnerId: null,
      played: false,
      nextMatchId: 'final_1',
      nextSlotPosition: i as 1 | 2,
      loserMatchId: 'third_1'
    });
  }

  // 5. Tercer Lugar (1 match)
  matches.push({
    id: 'third_1',
    stage: 'third',
    slotName: 'Tercer Puesto',
    matchIndex: 1,
    duelist1Id: null,
    duelist2Id: null,
    score1: 0,
    score2: 0,
    winnerId: null,
    played: false
  });

  // 6. Gran Final Multiversal (1 match)
  matches.push({
    id: 'final_1',
    stage: 'final',
    slotName: 'Gran Final Multiversal',
    matchIndex: 1,
    duelist1Id: null,
    duelist2Id: null,
    score1: 0,
    score2: 0,
    winnerId: null,
    played: false
  });

  return matches;
}
