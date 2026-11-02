import { Duelist } from '../types/tournament';

export function generateDuelNarrative(
  d1: Duelist,
  d2: Duelist,
  winnerId: string | 'DRAW',
  score1: number,
  score2: number,
  userPrompt?: string,
  variant1?: string,
  variant2?: string
): string {
  const winner = winnerId === d1.id ? d1 : winnerId === d2.id ? d2 : null;
  const loser = winnerId === d1.id ? d2 : winnerId === d2.id ? d1 : null;

  let story = '';

  story += `⚔️ CRÓNICA OFICIAL DEL DUELO - MCT v3.0\n`;
  story += `──────────────────────────────────────────────────────────\n`;
  story += `MESA: [${d1.era}] ${d1.name} (${variant1 || d1.archetype}) VS [${d2.era}] ${d2.name} (${variant2 || d2.archetype})\n`;
  story += `RESULTADO: ${d1.name} [${score1} - ${score2}] ${d2.name}\n`;
  story += `VEREDICTO: ${winner ? `VICTORIA PARA ${winner.name.toUpperCase()}` : 'EMPATE TÁCTICO DECLARADO'}\n\n`;

  if (userPrompt && userPrompt.trim().length > 0) {
    story += `DIRECTIVA NARRATIVA DEL DIRECTOR:\n`;
    story += `"${userPrompt.trim()}"\n\n`;
  }

  story += `DESARROLLO DE LA PARTIDA:\n`;

  if (winner && loser) {
    story += `1. Apertura: ${d1.name} inicia estableciendo presencia de campo con ${variant1 || d1.archetype}. Rápidamente ${d2.name} responde desplegando la artillería pesada de ${variant2 || d2.archetype}, intercambiando interrupciones en la fase principal.\n`;
    story += `2. Choque de Ases: Los monstruos insignia hacen su aparición en la arena holográfica. ${d1.aceMonster} colisiona contra ${d2.aceMonster} desatando un oleaje de energía dimensional.\n`;

    if (userPrompt && userPrompt.trim().length > 0) {
      story += `3. Clímax según la directiva: Siguiendo el libreto del duelo, ${winner.name} ejecuta la jugada maestra ("${userPrompt.trim()}"). ${loser.name} no encuentra respuesta en su cementerio ni en su mazo extra ante la inesperada cadena de efectos.\n`;
    } else {
      story += `3. El Momento Decisivo: ${winner.name} aprovecha la apertura creada en el tercer turno. Tras activar una carta mágica de remate y coordinar su motor de ${winner.archetype}, los Puntos de Vida de ${loser.name} caen a 0 en una ovación del estadio.\n`;
    }

    story += `4. Cierre: ${winner.name} exclama: "${winner.quote}" sellando la victoria oficial (+3 PTS).\n`;
  } else {
    story += `1. Duelo de desgaste brutal donde ni ${d1.name} ni ${d2.name} cedieron un ápice de terreno.\n`;
    story += `2. Tras consumirse los turnos reglamentarios con defensas impenetrables y negaciones cruzadas entre ${d1.aceMonster} y ${d2.aceMonster}, ambos duelistas sellan las tablas (+1 PT c/u).\n`;
    if (userPrompt) {
      story += `3. Detalle narrativo: "${userPrompt.trim()}".\n`;
    }
  }

  return story;
}
