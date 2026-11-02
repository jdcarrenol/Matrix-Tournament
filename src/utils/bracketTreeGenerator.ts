import { BracketMatch, Duelist } from '../types/tournament';

export function generateSchematicBracketTree(
  matches: BracketMatch[],
  duelistsMap: Map<string, Duelist>
): string {
  const getName = (id?: string | null): string => {
    if (!id) return '[POR DEFINIR]';
    const d = duelistsMap.get(id);
    return d ? d.name.slice(0, 18) : '[POR DEFINIR]';
  };

  const getScore = (m?: BracketMatch | undefined, pos: 1 | 2 = 1): string => {
    if (!m || !m.played) return '';
    return pos === 1 ? `(${m.score1})` : `(${m.score2})`;
  };

  const r32 = matches.filter(m => m.stage === 'r32').sort((a, b) => a.matchIndex - b.matchIndex);
  const r16 = matches.filter(m => m.stage === 'r16').sort((a, b) => a.matchIndex - b.matchIndex);
  const qf = matches.filter(m => m.stage === 'qf').sort((a, b) => a.matchIndex - b.matchIndex);
  const sf = matches.filter(m => m.stage === 'sf').sort((a, b) => a.matchIndex - b.matchIndex);
  const final = matches.find(m => m.stage === 'final');
  const champion = final?.winnerId ? duelistsMap.get(final.winnerId) : null;

  let out = '';
  out += `┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐\n`;
  out += `│                          MATRIX TOURNAMENT :: CUADRO ESQUEMÁTICO DE LLAVES EN ÁRBOL                    │\n`;
  out += `└────────────────────────────────────────────────────────────────────────────────────────────────────────┘\n\n`;

  out += `ESTRUCTURA DE ELIMINACIÓN DIRECTA (RED BULL BATALLA MODIFICADO - TOP 32):\n`;
  out += `==========================================================================================================\n\n`;

  // Render 4 major quadrants (4 R16 branches)
  for (let qIdx = 0; qIdx < 4; qIdx++) {
    const qfMatch = qf[qIdx];
    const r16_1 = r16[qIdx * 2];
    const r16_2 = r16[qIdx * 2 + 1];

    const r32_1 = r32[qIdx * 4];
    const r32_2 = r32[qIdx * 4 + 1];
    const r32_3 = r32[qIdx * 4 + 2];
    const r32_4 = r32[qIdx * 4 + 3];

    const sideLabel = qIdx < 2 ? 'LADO A' : 'LADO B';
    out += `--- [SECCIÓN ${qIdx + 1} · ${sideLabel}] ------------------------------------------------------------------\n`;

    // Match 1 in pair
    out += `┌─ [${r32_1?.slotName || 'R32-1'}] ${getName(r32_1?.duelist1Id)} ${getScore(r32_1, 1)}\n`;
    out += `│   vs                                ├── [OCTAVOS ${r16_1?.matchIndex}] ${getName(r16_1?.duelist1Id)} ${getScore(r16_1, 1)}\n`;
    out += `└─ [${r32_1?.slotName || 'R32-1'}] ${getName(r32_1?.duelist2Id)} ${getScore(r32_1, 2)} │\n`;
    out += `                                      │   vs                        ├── [CUARTOS ${qfMatch?.matchIndex}] ${getName(qfMatch?.duelist1Id)}\n`;
    out += `┌─ [${r32_2?.slotName || 'R32-2'}] ${getName(r32_2?.duelist1Id)} ${getScore(r32_2, 1)} │   │\n`;
    out += `│   vs                                └── [OCTAVOS ${r16_1?.matchIndex}] ${getName(r16_1?.duelist2Id)} ${getScore(r16_1, 2)} │\n`;
    out += `└─ [${r32_2?.slotName || 'R32-2'}] ${getName(r32_2?.duelist2Id)} ${getScore(r32_2, 2)}                             │\n`;
    out += `                                                                    │   vs\n`;
    out += `┌─ [${r32_3?.slotName || 'R32-3'}] ${getName(r32_3?.duelist1Id)} ${getScore(r32_3, 1)}                             │\n`;
    out += `│   vs                                ┌── [OCTAVOS ${r16_2?.matchIndex}] ${getName(r16_2?.duelist1Id)} ${getScore(r16_2, 1)} │\n`;
    out += `└─ [${r32_3?.slotName || 'R32-3'}] ${getName(r32_3?.duelist2Id)} ${getScore(r32_3, 2)} │   │                         │\n`;
    out += `                                      │   vs                        └── [CUARTOS ${qfMatch?.matchIndex}] ${getName(qfMatch?.duelist2Id)}\n`;
    out += `┌─ [${r32_4?.slotName || 'R32-4'}] ${getName(r32_4?.duelist1Id)} ${getScore(r32_4, 1)} │\n`;
    out += `│   vs                                └── [OCTAVOS ${r16_2?.matchIndex}] ${getName(r16_2?.duelist2Id)} ${getScore(r16_2, 2)}\n`;
    out += `└─ [${r32_4?.slotName || 'R32-4'}] ${getName(r32_4?.duelist2Id)} ${getScore(r32_4, 2)}\n\n`;
  }

  // Semifinales y Gran Final Summary
  out += `==========================================================================================================\n`;
  out += `                                     FASE CULMINANTE DEL MULTIVERSO                                       \n`;
  out += `==========================================================================================================\n`;
  out += `[SEMIFINAL 1]: ${getName(sf[0]?.duelist1Id)} ${getScore(sf[0], 1)}  VS  ${getName(sf[0]?.duelist2Id)} ${getScore(sf[0], 2)}\n`;
  out += `               ➔ Ganador: ${sf[0]?.winnerId ? getName(sf[0].winnerId) : '[POR DEFINIR]'}\n\n`;

  out += `[SEMIFINAL 2]: ${getName(sf[1]?.duelist1Id)} ${getScore(sf[1], 1)}  VS  ${getName(sf[1]?.duelist2Id)} ${getScore(sf[1], 2)}\n`;
  out += `               ➔ Ganador: ${sf[1]?.winnerId ? getName(sf[1].winnerId) : '[POR DEFINIR]'}\n\n`;

  out += `──────────────────────────────────────────────────────────────────────────────────────────────────────────\n`;
  out += `👑 [GRAN FINAL MULTIVERSAL]:\n`;
  out += `   ${getName(final?.duelist1Id)} ${getScore(final, 1)}  VS  ${getName(final?.duelist2Id)} ${getScore(final, 2)}\n\n`;

  if (champion) {
    out += `🏆 ¡¡GRAN CAMPEÓN DEL MATRIX TOURNAMENT!!: ${champion.name.toUpperCase()} [${champion.era}]\n`;
    out += `   "${champion.quote}"\n`;
  } else {
    out += `🏆 CAMPEÓN: [POR CORONAR TRAS LA GRAN FINAL]\n`;
  }

  return out;
}
