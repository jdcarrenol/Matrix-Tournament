import { Duelist, Era, DeckMechanic } from '../types/tournament';
import { INITIAL_DUELISTS_DATABASE } from '../data/characters';

// Canonical database knowledge map for instant lookup & smart AI completion
const LORE_KNOWLEDGE_BASE: Record<string, Partial<Duelist>> = {
  'marik ishtar': {
    name: 'Marik Ishtar & Yami Marik',
    alias: 'Guardián Tenebroso de Ra / Amo del Reino de las Sombras',
    era: 'DM',
    archetype: 'El Dragón Alado de Ra / Slime God Engine',
    secondaryDeck: 'Horus Engine / Tortura Egipcia',
    specialAnimeCard: 'El Sello de Orichalcos',
    aceMonster: 'El Dragón Alado de Ra - Modo Fénix',
    avatarIcon: '☀️',
    badgeStatus: 'Arquetipo Especial del Anime',
    quote: '¡Conoce el verdadero dolor del Reino de las Sombras!',
    mechanic: 'Ritual'
  },
  'yami marik': {
    name: 'Yami Marik',
    alias: 'Guardián Tenebroso de Ra / El Rostro de la Maldad',
    era: 'DM',
    archetype: 'El Dragón Alado de Ra / Slime God Engine',
    secondaryDeck: 'Horus Engine / Mazo de Tortura',
    specialAnimeCard: 'El Sello de Orichalcos',
    aceMonster: 'El Dragón Alado de Ra - Modo Fénix',
    avatarIcon: '☀️',
    badgeStatus: 'Arquetipo Especial del Anime',
    quote: '¡El Reino de las Sombras devorará tu alma!',
    mechanic: 'Ritual'
  },
  'yugi muto': {
    name: 'Yugi Muto & Yami Yugi',
    alias: 'El Faraón Anónimo / Amo de los Juegos',
    era: 'DM',
    archetype: 'Mago Oscuro / Quimera Ilusión',
    secondaryDeck: 'Branded Fusion / Magia de Dioses Egipcios',
    specialAnimeCard: 'Ojo de Timaeus',
    aceMonster: 'Mago Oscuro / El Mago de la Ilusión Oscura',
    avatarIcon: '🧙‍♂️',
    badgeStatus: 'Cabecera de Serie',
    quote: '¡Confío en el corazón de las cartas!',
    mechanic: 'Fusión'
  },
  'seto kaiba': {
    name: 'Seto Kaiba',
    alias: 'Emperador de KaibaCorp / El Maestro de los Ojos Azules',
    era: 'DM',
    archetype: 'Dragón Blanco de Ojos Azules / Spirit Dragon',
    secondaryDeck: 'Motor Primoredial / Obelisco el Atormentador',
    specialAnimeCard: 'Colmillo de Critias',
    aceMonster: 'Dragón Blanco de Ojos Azules / Dragón Espíritu',
    avatarIcon: '🐉',
    badgeStatus: 'Cabecera de Serie',
    quote: '¡En este mundo solo los fuertes prevalecen!',
    mechanic: 'Sincro'
  },
  'joey wheeler': {
    name: 'Joey Wheeler (Katsuya Jonouchi)',
    alias: 'El Guerrero de la Pasión / El Duelista Callejero',
    era: 'DM',
    archetype: 'Red-Eyes Black Dragon / Flame Swordsman Fusion',
    secondaryDeck: 'Garra de Hermos / Mazo de la Suerte',
    specialAnimeCard: 'Garra de Hermos',
    aceMonster: 'Dragón Negro de Ojos Rojos / Espadachín de la Llama Definitivo',
    avatarIcon: '🔥',
    badgeStatus: 'Soporte Moderno',
    quote: '¡Mi instinto de duelista nunca me falla!',
    mechanic: 'Fusión'
  },
  'valon': {
    name: 'Valon',
    alias: 'El Duelista de las Armaduras de Doma',
    era: 'DM',
    archetype: 'Cartas de Armadura (Armor System)',
    secondaryDeck: 'Psychic Armor / Buster Armor Tech',
    specialAnimeCard: 'El Sello de Orichalcos',
    aceMonster: 'Buster Armor / Active Guard',
    avatarIcon: '🛡️',
    badgeStatus: 'Arquetipo Especial del Anime',
    quote: '¡Mis puños son mis cartas y mi armadura es mi ley!',
    mechanic: 'Híbrido Moderno'
  },
  'rafael': {
    name: 'Rafael',
    alias: 'Caballero Guardián de Doma / El Vínculo Puro',
    era: 'DM',
    archetype: 'Guardian / Eatos / Dreadscythe',
    secondaryDeck: 'Arsenal de Armas Legendarias',
    specialAnimeCard: 'El Sello de Orichalcos',
    aceMonster: 'Guardián Eatos / Guardián Dreadscythe',
    avatarIcon: '🗡️',
    badgeStatus: 'Arquetipo Especial del Anime',
    quote: '¡El vínculo con mis monstruos nunca morirá!',
    mechanic: 'Híbrido Moderno'
  },
  'alister': {
    name: 'Alister (Amelda)',
    alias: 'El Piloto de Combate de Doma',
    era: 'DM',
    archetype: 'Air Fortress Ziggurat / Machine Military',
    secondaryDeck: 'Cyber Soldier Assault',
    specialAnimeCard: 'El Sello de Orichalcos',
    aceMonster: 'Fortaleza Aérea Ziggurat',
    avatarIcon: '✈️',
    badgeStatus: 'Arquetipo Especial del Anime',
    quote: '¡La guerra termina cuando caigas de rodillas!',
    mechanic: 'Híbrido Moderno'
  },
  'dartz': {
    name: 'Dartz',
    alias: 'Rey Supremo de la Atlántida / Líder de Paradius',
    era: 'DM',
    archetype: 'Orichalcos / Kyutora / Shunoros',
    secondaryDeck: 'Orichalcos Gigas / Serpiente Divina Geh',
    specialAnimeCard: 'El Sello de Orichalcos (3 Niveles)',
    aceMonster: 'Serpiente Divina Geh / Orichalcos Shunoros',
    avatarIcon: '🔮',
    badgeStatus: 'Arquetipo Especial del Anime',
    quote: '¡La oscuridad de la Atlántida purificará la tierra!',
    mechanic: 'Híbrido Moderno'
  },
  'jaden yuki': {
    name: 'Jaden Yuki (Judai)',
    alias: 'El Héroe Supremo de la Academia',
    era: 'GX',
    archetype: 'Elemental HERO / Infernal Rage',
    secondaryDeck: 'Neo-Spacian / Contact Fusion Modern',
    specialAnimeCard: 'Super Polimerización del Anime',
    aceMonster: 'Elemental HERO Flame Wingman - Infernal Rage',
    avatarIcon: '🦸‍♂️',
    badgeStatus: 'Cabecera de Serie',
    quote: '¡El duelo acaba de empezar y es hora de divertirse!',
    mechanic: 'Fusión'
  },
  'yusei fudo': {
    name: 'Yusei Fudo',
    alias: 'La Estrella de Nueva Ciudad Domino',
    era: '5D\'s',
    archetype: 'Stardust / Synchron / Junk Speeder',
    secondaryDeck: 'Crimson Dragon Engine / Centur-Ion Tech',
    specialAnimeCard: 'Dragón Cósmico Carmesí Legendario',
    aceMonster: 'Dragón del Polvo de Estrellas / Shooting Majestic Star Dragon',
    avatarIcon: '🏍️',
    badgeStatus: 'Cabecera de Serie',
    quote: '¡El lazo entre duelistas acelera hacia el futuro!',
    mechanic: 'Sincro'
  },
  'jack atlas': {
    name: 'Jack Atlas',
    alias: 'El Rey Absoluto del Turbo Duelo',
    era: '5D\'s',
    archetype: 'Red Dragon Archfiend / Resonator',
    secondaryDeck: 'Centur-Ion / Fiend Calamity',
    specialAnimeCard: 'Fuego del Rey Carmesí del Anime',
    aceMonster: 'Archidemonio Dragón Rojo / Dragón Supernova Rojo',
    avatarIcon: '👑',
    badgeStatus: 'Cabecera de Serie',
    quote: '¡Solo hay un Rey, y ese soy yo!',
    mechanic: 'Sincro'
  }
};

// Intelligent autocomplete function
export function autocompleteDuelistLore(nameInput: string): Partial<Duelist> {
  const normalized = nameInput.trim().toLowerCase();

  // 1. Direct match in local lore knowledge base
  for (const [key, data] of Object.entries(LORE_KNOWLEDGE_BASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data;
    }
  }

  // 2. Search in existing characters database
  const foundInCatalog = INITIAL_DUELISTS_DATABASE.find(d => 
    d.name.toLowerCase().includes(normalized) || normalized.includes(d.name.toLowerCase())
  );

  if (foundInCatalog) {
    return {
      name: foundInCatalog.name,
      alias: foundInCatalog.alias,
      era: foundInCatalog.era,
      archetype: foundInCatalog.archetype,
      secondaryDeck: foundInCatalog.secondaryDeck || 'Motor Híbrido Contemporáneo',
      specialAnimeCard: foundInCatalog.specialAnimeCard || undefined,
      aceMonster: foundInCatalog.aceMonster,
      avatarIcon: foundInCatalog.avatarIcon,
      badgeStatus: foundInCatalog.badgeStatus || 'Activo',
      quote: foundInCatalog.quote,
      mechanic: foundInCatalog.mechanic
    };
  }

  // 3. Smart procedural guess if not directly matched
  const guessEra: Era = normalized.includes('gx') ? 'GX' :
    normalized.includes('5d') ? '5D\'s' :
    normalized.includes('zexal') ? 'ZEXAL' :
    normalized.includes('arc') ? 'ARC-V' :
    normalized.includes('vrains') ? 'VRAINS' :
    normalized.includes('seven') ? 'SEVENS' :
    normalized.includes('rush') ? 'Go RUSH!!' : 'DM';

  return {
    name: nameInput.trim(),
    alias: `Duelista Élite del Multiverso`,
    era: guessEra,
    archetype: `${nameInput.trim()} Arquetipo Personalizado`,
    secondaryDeck: 'Horus Engine / Soporte Tecnológico',
    specialAnimeCard: 'El Sello de Orichalcos',
    aceMonster: `Dragón Soberano de ${nameInput.trim()}`,
    avatarIcon: '🎴',
    badgeStatus: 'Arquetipo Especial del Anime',
    quote: '¡El poder de mi baraja desafiará todas las dimensiones!',
    mechanic: 'Híbrido Moderno'
  };
}

// Generate the EXACT textual card representation requested
export function formatStandardCharacterCard(d: Duelist): string {
  const eraDetail = d.era === 'DM' ? 'Duel Monsters / Temporada 1-5' :
    d.era === 'GX' ? 'Yu-Gi-Oh! GX / Academia de Duelos' :
    d.era === '5D\'s' ? 'Yu-Gi-Oh! 5D\'s / Ciudad Domino & Satélite' :
    d.era === 'ZEXAL' ? 'Yu-Gi-Oh! ZEXAL / Mundo Astral & Barian' :
    d.era === 'ARC-V' ? 'Yu-Gi-Oh! ARC-V / 4 Dimensiones' :
    d.era === 'VRAINS' ? 'Yu-Gi-Oh! VRAINS / Link VRAINS & Red Cyberspace' :
    d.era === 'SEVENS' ? 'Yu-Gi-Oh! SEVENS / Goha City' :
    'Yu-Gi-Oh! Go RUSH!! / Mutsuba Town & Velgear';

  const avatarDisplay = d.avatarUrl 
    ? `[Foto Render Cargada: ${d.avatarUrl.slice(0, 45)}...]`
    : `[Avatar: ${d.avatarIcon} ${d.name}]`;

  const secondaries = [d.secondaryDeck, d.specialAnimeCard].filter(Boolean).join(', ') || 'Estándar';

  return `┌─────────────────────────────────────────────────────────────┐
│ 🛡️ ${d.name.padEnd(56, ' ')}│
│ 🏷️ Apodo / Título: "${(d.alias || 'Duelista Legendario').slice(0, 40).padEnd(41, ' ')}"│
├─────────────────────────────────────────────────────────────┤
│ 🖼️ Foto / Avatar: ${avatarDisplay.slice(0, 42).padEnd(42, ' ')}│
│    *(Foto y render del personaje cargados en el sistema)*  │
├─────────────────────────────────────────────────────────────┤
│ ⏳ Generación / Era: [${d.era} · ${eraDetail.slice(0, 36)}] │
│ ⚔️ Arquetipos (Personalizables):                            │
│    • Principal: [${d.archetype.slice(0, 44)}]               │
│    • Secundarios / Especiales: [${secondaries.slice(0, 31)}] │
│ 🐉 Monstruo As: [${d.aceMonster.slice(0, 45)}]              │
└─────────────────────────────────────────────────────────────┘`;
}
