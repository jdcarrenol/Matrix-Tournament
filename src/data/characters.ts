import { Duelist, Era } from '../types/tournament';

export const INITIAL_DUELISTS_DATABASE: Duelist[] = [
  // ==========================================
  // ERA 1: DUEL MONSTERS (DM)
  // ==========================================
  {
    id: 'dm_yugi',
    name: 'Yugi Muto & Yami Yugi',
    alias: 'Rey de los Juegos / Faraón Atem',
    era: 'DM',
    archetype: 'Dark Magician / Illusionist / Branded Fusion',
    secondaryDeck: 'Ilusionistas Quimera / Magia Egipcia',
    badgeStatus: 'Cabecera de Serie',
    mechanic: 'Fusión',
    aceMonster: 'Mago Oscuro / El Mago de la Ilusión Oscura',
    avatarIcon: '🧙‍♂️',
    quote: '¡Confío en el corazón de las cartas!',
    description: 'El legendario Rey de los Juegos con soporte moderno de Ilusiones, Fusiones Rápidas y Magias de Dios Egipcio.'
  },
  {
    id: 'dm_kaiba',
    name: 'Seto Kaiba',
    alias: 'Emperador de KaibaCorp',
    era: 'DM',
    archetype: 'Blue-Eyes White Dragon / Primoredial / Spirit Dragon',
    secondaryDeck: 'Motor Primoredial / Obelisco el Atormentador',
    badgeStatus: 'Cabecera de Serie',
    mechanic: 'Sincro',
    aceMonster: 'Dragón Blanco de Ojos Azules / Dragón Espíritu de Ojos Azules',
    avatarIcon: '🐉',
    quote: '¡En este mundo solo los fuertes prevalecen!',
    description: 'Magnate de la tecnología con su implacable motor Ojos Azules modernizado con Sincronía y Fusiones definitivas.'
  },
  {
    id: 'dm_joey',
    name: 'Joey Wheeler (Katsuya Jonouchi)',
    alias: 'El Guerrero de la Pasión',
    era: 'DM',
    archetype: 'Red-Eyes Black Dragon / Flame Swordsman Fusion',
    secondaryDeck: 'Garra de Hermos / Mazo de la Suerte',
    badgeStatus: 'Soporte Moderno',
    mechanic: 'Fusión',
    aceMonster: 'Dragón Negro de Ojos Rojos / Espadachín de la Llama Definitivo',
    avatarIcon: '🔥',
    quote: '¡Mi instinto de duelista nunca me falla!',
    description: 'Corazón puro e instinto de juego con su arquetipo de Ojos Rojos y el nuevo soporte de Espadachín de la Llama.'
  },
  {
    id: 'dm_marik',
    name: 'Yami Marik',
    alias: 'Guardián Tenebroso de Ra',
    era: 'DM',
    archetype: 'Winged Dragon of Ra / Slime God Engine',
    secondaryDeck: 'Horus Engine / Mazo Tortura Egipcia',
    specialAnimeCard: 'El Sello de Orichalcos',
    badgeStatus: 'Arquetipo Especial del Anime',
    mechanic: 'Ritual',
    aceMonster: 'El Dragón Alado de Ra - Modo Fénix',
    avatarIcon: '☀️',
    quote: '¡Conoce el verdadero dolor del Reino de las Sombras!',
    description: 'Control de tributos divinos, Inmortal Fénix y monstruos Slime para invocaciones imparables.'
  },
  {
    id: 'dm_bakura',
    name: 'Yami Bakura',
    alias: 'Ladrón Milenario / Señor Oculto',
    era: 'DM',
    archetype: 'Destiny Board / Zombie Necrofear / Fiend Control',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'Necrofear Oscuro / Maldición de la Tabla del Destino',
    avatarIcon: '💀',
    quote: '¡El tablero del destino ya ha dictado tu caída!',
    description: 'Estrategia de desgaste, control de Demonios de Oscuridad y el Tablero del Destino acelerado.'
  },
  {
    id: 'dm_pegasus',
    name: 'Maximillion Pegasus',
    alias: 'Creador del Duelo de Monstruos',
    era: 'DM',
    archetype: 'Toon World / Relinquished Illusion',
    mechanic: 'Ritual',
    aceMonster: 'Toon Black Luster Soldier / Relinquished Anima',
    avatarIcon: '👁️',
    quote: '¡Bienvenido a mi mundo fantástico de caricaturas!',
    description: 'Habilidades de absorción y evasión con Toon Kingdom moderno y fusiones de Ojos Milenarios.'
  },
  {
    id: 'dm_mai',
    name: 'Mai Valentine (Mai Kujaku)',
    alias: 'Dama del Viento Tempestuoso',
    era: 'DM',
    archetype: 'Harpie Lady / Cyber Slash Harpie Synchro',
    mechanic: 'Sincro',
    aceMonster: 'Dama Arpía Cuchillada Cibernética',
    avatarIcon: '🪶',
    quote: '¡El viento corta más profundo de lo que imaginas!',
    description: 'Velocidad aérea implacable capaz de rebotar cartas enemigas con Sincronía Arpía.'
  },
  {
    id: 'dm_keith',
    name: 'Bandit Keith',
    alias: 'El As de las Máquinas de EE.UU.',
    era: 'DM',
    archetype: 'Barrel Dragon / Desperado Barrel / Dark Machine',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'Dragón Barril Desperado',
    avatarIcon: '🎰',
    quote: '¡Tengo un truco bajo la manga para cada situación!',
    description: 'Máquinas de fuego cruzado con efectos de lanzamiento de moneda garantizados y destrucción en cadena.'
  },
  {
    id: 'dm_ishizu',
    name: 'Ishizu Ishtar',
    alias: 'Sacerdotisa de los Secretos del Tiempo',
    era: 'DM',
    archetype: 'Ishizu Tearlaments / Fairy Gravekeepers',
    mechanic: 'Fusión',
    aceMonster: 'Kelbek the Ancient Vanguard / Agido',
    avatarIcon: '⏳',
    quote: '¡El destino ya está escrito en las arenas del tiempo!',
    description: 'El temido motor de control de cementerio y aceleración de milagro histórico.'
  },
  {
    id: 'dm_rafael',
    name: 'Rafael',
    alias: 'Caballero Guardián de Doma',
    era: 'DM',
    archetype: 'Guardian / Eatos / Arsenal Dreadscythe',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'Guardián Eatos / Guardián Dreadscythe',
    avatarIcon: '🗡️',
    quote: '¡El vínculo con mis monstruos nunca morirá en vano!',
    description: 'Dominio de armas mágicas de equipo y poder absoluto sin manchar su propio cementerio.'
  },

  // ==========================================
  // ERA 2: GX
  // ==========================================
  {
    id: 'gx_jaden',
    name: 'Jaden Yuki (Judai)',
    alias: 'El Rey de la Academia de Duelos',
    era: 'GX',
    archetype: 'Elemental HERO / Neo-Spacian / Infernal Rage',
    mechanic: 'Fusión',
    aceMonster: 'Elemental HERO Flame Wingman - Infernal Rage / Shining Neos Wingman',
    avatarIcon: '🦸‍♂️',
    quote: '¡El duelo acaba de empezar y es hora de divertirse!',
    description: 'Cadena infinita de Contact Fusion y soporte moderno con Flame Wingman Infernal Rage y Neos.'
  },
  {
    id: 'gx_zane',
    name: 'Zane Truesdale (Kaiser Ryo)',
    alias: 'El Káiser Invicto',
    era: 'GX',
    archetype: 'Cyber Dragon / Cyberdark End Dragon',
    mechanic: 'Fusión',
    aceMonster: 'Dragón Cibernético Final / Dragón Ciberoscuro del Fin',
    avatarIcon: '⚡',
    quote: '¡El respeto hacia mi oponente es destruirlo sin piedad!',
    description: 'Poder OTK demoledor combinando la precisión del Ciber Dragón con la oscuridad del Ciberoscuro.'
  },
  {
    id: 'gx_chazz',
    name: 'Chazz Princeton (Jun Manjoume)',
    alias: '¡1, 10, 100, 1000! ¡El Chazz!',
    era: 'GX',
    archetype: 'Ojama / Armed Dragon Thunder / ABC Dragon Buster',
    mechanic: 'Fusión',
    aceMonster: 'Dragón Armado Trueno LV10 / ABC-Dragón Buster',
    avatarIcon: '👑',
    quote: '¡Chazz it up! ¡Nadie está a la altura de mi grandeza!',
    description: 'Hibridación maestra entre el disparate de los Ojama, la potencia de los Dragones Armados y máquinas ABC.'
  },
  {
    id: 'gx_aster',
    name: 'Aster Phoenix (Edo Phoenix)',
    alias: 'El Genio Profesional del Destino',
    era: 'GX',
    archetype: 'Destiny HERO / D-Hero Destroyer Phoenix Enforcer',
    mechanic: 'Fusión',
    aceMonster: 'Destiny HERO - Destroyer Phoenix Enforcer (DPE)',
    avatarIcon: '🕰️',
    quote: '¡Mi destino es la victoria absoluta!',
    description: 'El invencible DPE con resurrección continua, interrupciones rápidas y control de recursos.'
  },
  {
    id: 'gx_jesse',
    name: 'Jesse Anderson (Johan Andersen)',
    alias: 'El Maestro de las Bestias de Cristal',
    era: 'GX',
    archetype: 'Crystal Beast / Rainbow Dragon Overdrive',
    mechanic: 'Fusión',
    aceMonster: 'Ultimate Crystal Rainbow Dragon Overdrive',
    avatarIcon: '💎',
    quote: '¡La luz de las 7 gemas brillará hasta la eternidad!',
    description: 'Soporte del Puente del Cristal que acelera invocaciones masivas y el cataclismo de Overdrive.'
  },
  {
    id: 'gx_supreme_king',
    name: 'Rey Supremo Jaden (Haou Judai)',
    alias: 'Soberano de la Dimensión Oscura',
    era: 'GX',
    archetype: 'Evil HERO / Dark Fusion / Malicious Bane',
    mechanic: 'Fusión',
    aceMonster: 'Evil HERO Malicious Bane',
    avatarIcon: '🖤',
    quote: '¡El poder supremo solo responde a la fuerza despiadada!',
    description: 'Fusión Oscura destructiva con Malicious Bane que aniquila campos y gana ataque masivo.'
  },
  {
    id: 'gx_yubel',
    name: 'Yubel',
    alias: 'El Espíritu del Vínculo Eterno',
    era: 'GX',
    archetype: 'Yubel / Phantom of Yubel / Unchained Fiends',
    mechanic: 'Fusión',
    aceMonster: 'Phantom of Yubel / Loving Defender Forever',
    avatarIcon: '👁️‍🗨️',
    quote: '¡Nuestro dolor es el lazo que nos hace invencibles!',
    description: 'El moderno motor meta de Yubel y Fantasma de Yubel, castigando el ataque del rival con daño reflejado.'
  },
  {
    id: 'gx_alexis',
    name: 'Alexis Rhodes (Asuka Tenjoin)',
    alias: 'La Reina del Obelisco Azul',
    era: 'GX',
    archetype: 'Cyber Angel / Drytron Ritual Engine',
    mechanic: 'Ritual',
    aceMonster: 'Ciber Ángel Vrash / Ciber Ángel Benten',
    avatarIcon: '🩰',
    quote: '¡La gracia y la fuerza danzan en perfecta armonía!',
    description: 'Cadena infinita de rituales de Luz que vacían los recursos y destruyen campos del contrincante.'
  },
  {
    id: 'gx_axel',
    name: 'Axel Brodie (Austin O\'Brien)',
    alias: 'Comandante Volcánico',
    era: 'GX',
    archetype: 'Volcanic / Volcanic Emperor / Blaze Accelerator',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'Emperador Volcánico',
    avatarIcon: '🌋',
    quote: '¡El fuego de la artillería nunca perdona!',
    description: 'Daño de efecto demoledor con el nuevo Emperador Volcánico y el Acelerador de Fuego.'
  },
  {
    id: 'gx_crowler',
    name: 'Dr. Vellian Crowler',
    alias: 'Jefe del Departamento de Duelos',
    era: 'GX',
    archetype: 'Ancient Gear / Ancient Gear Dark Golem',
    mechanic: 'Fusión',
    aceMonster: 'Golem de Mecanismo Antiguo Oscuro / Mega Golem de Fusión',
    avatarIcon: '⚙️',
    quote: '¡Es hora de una lección magistral que jamás olvidarás, Na-no-ne!',
    description: 'Máquinas gigantes que impiden activar magias o trampas en batalla con penetración de defensa brutal.'
  },

  // ==========================================
  // ERA 3: 5D\'s
  // ==========================================
  {
    id: '5ds_yusei',
    name: 'Yusei Fudo',
    alias: 'La Leyenda de Nueva Ciudad Domino',
    era: '5D\'s',
    archetype: 'Stardust / Synchron / Junk Speeder / Crimson Dragon',
    mechanic: 'Sincro',
    aceMonster: 'Dragón del Polvo de Estrellas / Dragón Cósmico Carmesí / Cosmic Blazar Dragon',
    avatarIcon: '🏍️',
    quote: '¡El lazo entre duelistas acelera hacia el futuro!',
    description: 'La cumbre de la aceleración Sincro moderna con Junk Speeder invocando Dragones de nivel 12 imparables.'
  },
  {
    id: '5ds_jack',
    name: 'Jack Atlas',
    alias: 'El Rey Absoluto del Turbo Duelo',
    era: '5D\'s',
    archetype: 'Red Dragon Archfiend / Resonator / Centur-Ion',
    mechanic: 'Sincro',
    aceMonster: 'Archidemonio Dragón Rojo / Dragón Supernova Rojo',
    avatarIcon: '👑',
    quote: '¡Solo hay un Rey, y ese soy yo!',
    description: 'Fuerza aplastante con el nuevo soporte Rey de Reyes, limpiando el campo entero con Supernova Rojo.'
  },
  {
    id: '5ds_crow',
    name: 'Crow Hogan',
    alias: 'El Viento Negro de la Justicia',
    era: '5D\'s',
    archetype: 'Blackwing / Assault Blackwing / Black-Winged Assault Dragon',
    mechanic: 'Sincro',
    aceMonster: 'Dragón de Alas Negras del Asalto',
    avatarIcon: '🦅',
    quote: '¡La bandada de Alas Negras cubre el cielo de victoria!',
    description: 'Invocaciones de enjambre a gran velocidad que castigan con 700 de daño cada efecto del oponente.'
  },
  {
    id: '5ds_akiza',
    name: 'Akiza Izinski (Aki Izayoi)',
    alias: 'La Rosa Negra Carmesí',
    era: '5D\'s',
    archetype: 'Rose Dragon / Plant Link / Ruddy Rose Dragon',
    mechanic: 'Sincro',
    aceMonster: 'Dragón Rosa Rojiza / Dragón de la Rosa Negra',
    avatarIcon: '🌹',
    quote: '¡Florece en medio de las cenizas de la destrucción!',
    description: 'Destrucción masiva de tableros y exilio de cementerios completos con la Rosa Rojiza.'
  },
  {
    id: '5ds_kalin',
    name: 'Kalin Kessler (Kyosuke Kiryu)',
    alias: 'El Fantasma Sin Mano',
    era: '5D\'s',
    archetype: 'Infernity / Void Trap Engine',
    mechanic: 'Sincro',
    aceMonster: 'Archidemonio de la Infernalidad / Dragón del Fin de la Infernalidad',
    avatarIcon: '⛓️',
    quote: '¡Cuando mi mano está vacía, mi fuerza no tiene límites!',
    description: 'Bucle infinito de resurrección y negaciones implacables con 0 cartas en mano.'
  },
  {
    id: '5ds_antinomy',
    name: 'Antinomy (Bruno)',
    alias: 'El Pionero de la Aceleración Delta',
    era: '5D\'s',
    archetype: 'T.G. (Tech Genus) / Over Dragonar',
    mechanic: 'Sincro',
    aceMonster: 'T.G. Glaive Blaster / T.G. Over Dragonar',
    avatarIcon: '🤖',
    quote: '¡Desata la Invocación Sincro Delta Más Allá de los Límites!',
    description: 'Sincronías durante el turno del adversario que destierran monstruos invocados al instante.'
  },
  {
    id: '5ds_zone',
    name: 'Z-ONE',
    alias: 'El Salvador del Futuro Destruido',
    era: '5D\'s',
    archetype: 'Timelord / Celestial Spheres',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'Sephylon, el Señor del Tiempo Definitivo',
    avatarIcon: '🕰️',
    quote: '¡La humanidad no puede escapar del destino que ha forjado!',
    description: 'Monstruos indestructibles inmunes a batalla y efectos que reducen los LP rivales a la mitad o devuelven todo al deck.'
  },
  {
    id: '5ds_paradox',
    name: 'Paradox',
    alias: 'El Duelista que Dobla el Tiempo',
    era: '5D\'s',
    archetype: 'Malefic / Malefic Territory / Paradox Gear',
    mechanic: 'Sincro',
    aceMonster: 'Dragón Paradoja Maléfico / Dragón de la Verdad Maléfico',
    avatarIcon: '🎭',
    quote: '¡Borro la existencia de las cartas para salvar el universo!',
    description: 'Invocaciones gratuitas de titanes de 4000 ATK desterrando monstruos del Extra Deck directamente.'
  },
  {
    id: '5ds_leo',
    name: 'Leo (Rua)',
    alias: 'El Sexto Signer del Corazón de Hierro',
    era: '5D\'s',
    archetype: 'Morphtronic / Life Stream Dragon / Power Tool Braver',
    mechanic: 'Sincro',
    aceMonster: 'Dragón de la Corriente de la Vida / Power Tool Braver Dragon',
    avatarIcon: '🧰',
    quote: '¡Protegeré a todos con el poder de mis herramientas!',
    description: 'Equipos mágicos en cadena que niegan monstruos y cambian posiciones de batalla a placer.'
  },
  {
    id: '5ds_sherry',
    name: 'Sherry LeBlanc',
    alias: 'La Dama Noble de la Venganza',
    era: '5D\'s',
    archetype: 'Noble Knight / Fleur / Baronne de Fleur',
    mechanic: 'Sincro',
    aceMonster: 'Baronesa de la Flor (Baronne de Fleur)',
    avatarIcon: '⚔️',
    quote: '¡El honor y la justicia cabalgan en cada estocada!',
    description: 'El arquetipo de Baronne de Fleur: omni-negación, destrucción y rotación estratégica de monstruos.'
  },

  // ==========================================
  // ERA 4: ZEXAL
  // ==========================================
  {
    id: 'zexal_yuma',
    name: 'Yuma Tsukumo & Astral',
    alias: 'Los Guerreros de la Luz ZEXAL',
    era: 'ZEXAL',
    archetype: 'Utopia / Gagaga / Onomat / Dragonic Halberd',
    mechanic: 'Xyz',
    aceMonster: 'Número 39: Utopía / Número F0: Futuro Utrópico Dracónico',
    avatarIcon: '✨',
    quote: '¡Kattobingu da, ore! ¡El vuelo del desafío no tiene fronteras!',
    description: 'Evoluciones de Número 39 capaces de frenar cualquier ataque y alcanzar más de 10,000 de ataque con Double.'
  },
  {
    id: 'zexal_kite',
    name: 'Kite Tenjo (Kaito)',
    alias: 'El Cazador de Números Galáctico',
    era: 'ZEXAL',
    archetype: 'Galaxy-Eyes / Photon / Tachyon Primal',
    mechanic: 'Xyz',
    aceMonster: 'Dragón Fotónico de Ojos Galácticos / Número 62: Dragón de la Galaxia Prime',
    avatarIcon: '🌌',
    quote: '¡Prepárate para sentir el terror del cazador de almas!',
    description: 'Ataques cósmicos con más de 11,200 ATK que anulan efectos y baten récords de daño OTK.'
  },
  {
    id: 'zexal_shark',
    name: 'Reginald Kastle (Shark / Nasch)',
    alias: 'Líder de los 7 Emperadores de Barian',
    era: 'ZEXAL',
    archetype: 'Shark / Water Xyz / Abyss Shark / Stealth Kragen',
    mechanic: 'Xyz',
    aceMonster: 'Número C101: Caballero de Honor Silencioso Oscuro / Valiant Shark Lancer',
    avatarIcon: '🦈',
    quote: '¡Las profundidades del océano engullirán tu orgullo!',
    description: 'Invocaciones Xyz de rango 4 y 5 de Agua con control de campo y robo de monstruos enemigos como materiales.'
  },
  {
    id: 'zexal_vector',
    name: 'Vector',
    alias: 'El Emperador del Engaño Barian',
    era: 'ZEXAL',
    archetype: 'Umbral Horror / Masquerade / Chaos Barian',
    mechanic: 'Xyz',
    aceMonster: 'Número C104: Mascarada del Terror de las Sombras',
    avatarIcon: '🃏',
    quote: '¡Tu desesperación es el condimento más exquisito!',
    description: 'Destrucción de la mano del oponente, anulación de efectos de monstruo y daño directo sádico.'
  },
  {
    id: 'zexal_quattro',
    name: 'Quattro (IV / Thomas Arland)',
    alias: 'El Maestro del Servicio Fanático',
    era: 'ZEXAL',
    archetype: 'Gimmick Puppet / Fantasix Machinix',
    mechanic: 'Xyz',
    aceMonster: 'Número C40: Hilo de la Cuerda Mecánica Maldito / Gigantes Doll',
    avatarIcon: '🎎',
    quote: '¡Es hora de mi servicio fanático especial!',
    description: 'El renovado mazo Gimmick Puppet con FTK y destrucción en masa de monstruos especiales.'
  },
  {
    id: 'zexal_mizar',
    name: 'Mizar (Mizael)',
    alias: 'El Verdadero Maestro de los Dragones Ojos Galácticos',
    era: 'ZEXAL',
    archetype: 'Galaxy-Eyes Tachyon Dragon / Dragon Ruler',
    mechanic: 'Xyz',
    aceMonster: 'Número 107: Dragón Taquiónico de Ojos Galácticos',
    avatarIcon: '🌠',
    quote: '¡Rebobinaré el tiempo del universo para aplastarte!',
    description: 'La Transmigración Taquiónica que niega cadenas completas desde la mano y reinicia el estado del turno.'
  },
  {
    id: 'zexal_trey',
    name: 'Trey (III / Michael Arland)',
    alias: 'El Protector de las Reliquias de Chronomaly',
    era: 'ZEXAL',
    archetype: 'Chronomaly / Vimana / Atlandis',
    mechanic: 'Xyz',
    aceMonster: 'Número 33: Machu Mech / Chronomaly Vimana',
    avatarIcon: '🏛️',
    quote: '¡El misterio de las civilizaciones perdidas se abre ante ti!',
    description: 'Manipulación de ataque para generar OTK sorpresa con Machu Mech y negación continua de monstruos con Vimana.'
  },
  {
    id: 'zexal_don_thousand',
    name: 'Don Thousand',
    alias: 'Dios del Mundo Barian',
    era: 'ZEXAL',
    archetype: 'Numeron / Numeron Network / Numeronius',
    mechanic: 'Xyz',
    aceMonster: 'Número C1000: Numeronius / Red Numeron',
    avatarIcon: '👁️',
    quote: '¡El Númeron reescribe la realidad a mi antojo!',
    description: '4 puertas de Número invocadas en un solo turno con ataques duplicados progresivos.'
  },
  {
    id: 'zexal_alito',
    name: 'Alito',
    alias: 'El Puño Ardiente de Barian',
    era: 'ZEXAL',
    archetype: 'Battlin\' Boxer / King Dempsey / Lead Yoke',
    mechanic: 'Xyz',
    aceMonster: 'Boxeador Indómito Yugo de Plomo / Rey Dempsey',
    avatarIcon: '🥊',
    quote: '¡Nuestros puños hablarán en el ring de la batalla!',
    description: 'Monstruos guerreros que ganan poder cada vez que resisten la destrucción y contragolpean con trampas de contraataque.'
  },
  {
    id: 'zexal_quinton',
    name: 'Quinton (V / Christopher Arland)',
    alias: 'El Astrónomo Espacial',
    era: 'ZEXAL',
    archetype: 'Space Dyson Sphere / Machine Fortress',
    mechanic: 'Xyz',
    aceMonster: 'Número 9: Esfera Dyson del Dosel Estelar',
    avatarIcon: '🪐',
    quote: '¡La inmensidad del cosmos aplastará tus insignificantes cartas!',
    description: 'Gigantescos monstruos de Rango 9 que absorben monstruos rivales como combustible de plasma cósmico.'
  },

  // ==========================================
  // ERA 5: ARC-V
  // ==========================================
  {
    id: 'arcv_yuya',
    name: 'Yuya Sakaki',
    alias: 'El Duelista del Espectáculo',
    era: 'ARC-V',
    archetype: 'Performapal / Odd-Eyes / Pendulum Magician',
    mechanic: 'Péndulo',
    aceMonster: 'Dragón Pendular de Ojos Anómalos / Mago de la Mirada del Tiempo',
    avatarIcon: '🎪',
    quote: '¡Damas y caballeros, el espectáculo debe comenzar!',
    description: 'La gran escala de Péndulo que convoca simultáneamente huestes de dragones y magos desde el Extra Deck.'
  },
  {
    id: 'arcv_reiji',
    name: 'Declan Akaba (Reiji Akaba)',
    alias: 'CEO de la Corporación Leo',
    era: 'ARC-V',
    archetype: 'D/D/D / Dark Contract / Machinex',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'D/D/D/D Rey del Fin del Multiverso Deus Machinex',
    avatarIcon: '👓',
    quote: '¡Domino todas las dimensiones de invocación en un solo turno!',
    description: 'El arquetipo que domina Fusión, Sincro, Xyz y Enlace en combos sin fin con Deus Machinex absorbiendo cartas.'
  },
  {
    id: 'arcv_yuto',
    name: 'Yuto',
    alias: 'El Halcón Sombrío de la Dimensión Xyz',
    era: 'ARC-V',
    archetype: 'The Phantom Knights / Break Sword / Arc Rebellion',
    mechanic: 'Xyz',
    aceMonster: 'Dragón Xyz Rebelión Oscura / Arc Rebellion Xyz Dragon',
    avatarIcon: '⚔️',
    quote: '¡Monstruos caídos, despierten como espectros de la venganza!',
    description: 'Reciclaje infinito desde el cementerio y ataques definitivos que roban todo el ataque del campo enemigo.'
  },
  {
    id: 'arcv_yugo',
    name: 'Yugo',
    alias: 'El Bólido Alado de la Sincronía',
    era: 'ARC-V',
    archetype: 'Speedroid / Clear Wing Synchro Dragon',
    mechanic: 'Sincro',
    aceMonster: 'Dragón Sincro de Alas Transparentes / Crystal Wing Synchro Dragon',
    avatarIcon: '🍌',
    quote: '¡No soy Yugo de fusión, soy YUGO de Sincronía!',
    description: 'Aceleración aerodinámica de dados y velocidad capaz de negar y destruir monstruos de nivel alto de inmediato.'
  },
  {
    id: 'arcv_yuri',
    name: 'Yuri',
    alias: 'El Depredador Venenoso de la Fusión',
    era: 'ARC-V',
    archetype: 'Predaplant / Starving Venom / Verte Anaconda',
    mechanic: 'Fusión',
    aceMonster: 'Dragón Fusión Hambriento Venenoso / Predaplanta Dragostapelia',
    avatarIcon: '🥀',
    quote: '¡Serás consumido por mis hermosas plantas venenosas!',
    description: 'Uso de contadores de depredador para transformar monstruos rivales en materiales oscuros de fusión.'
  },
  {
    id: 'arcv_shay',
    name: 'Shay Obsidian (Shun Kurosaki)',
    alias: 'El Halcón Rebelde de la Resistencia',
    era: 'ARC-V',
    archetype: 'Raidraptor / Rising Rebellion Falcon',
    mechanic: 'Xyz',
    aceMonster: 'Raidraptor - Rising Rebellion Falcon / Ultimate Falcon',
    avatarIcon: '🦅',
    quote: '¡El vuelo del halcón no se detiene ante ningún tirano!',
    description: 'Monstruos de rango 13 totalmente inafectados por efectos de cartas que limpian todo el campo adversario.'
  },
  {
    id: 'arcv_sora',
    name: 'Sora Perse (Sora Shiunin)',
    alias: 'El Muñeco Dulce de la Academia',
    era: 'ARC-V',
    archetype: 'Fluffal / Frightfur / Patchwork Engine',
    mechanic: 'Fusión',
    aceMonster: 'Frightfur Whale / Frightfur Sabre-Tooth',
    avatarIcon: '🍭',
    quote: '¡Detrás de este adorable osito de peluche vive una pesadilla!',
    description: 'Fusiones en cascada con daño continuo masivo y destrucción de cartas durante la fase de batalla.'
  },
  {
    id: 'arcv_zarc',
    name: 'Supreme King Z-ARC',
    alias: 'El Dragón Supremo de las 4 Dimensiones',
    era: 'ARC-V',
    archetype: 'Supreme King Dragon / Gate Zero / Gate Infinity',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'Dragón Supremo Z-ARC (Modo Péndulo Sincro Fusión)',
    avatarIcon: '🐲',
    quote: '¡Yo soy el principio y el final de todas las dimensiones!',
    description: 'Poder cósmico que destruye todo el campo enemigo al ser invocado e impide activar efectos de monstruos de fusión/sincro/xyz.'
  },
  {
    id: 'arcv_gong',
    name: 'Gong Strong (Noboru Gongenzaka)',
    alias: 'El Muro Inamovible de los Samurai Pesados',
    era: 'ARC-V',
    archetype: 'Superheavy Samurai / Prodigy Wakaushi',
    mechanic: 'Sincro',
    aceMonster: 'Samurai Superpesado Señor de la Guerra Susanowo',
    avatarIcon: '🛡️',
    quote: '¡Un verdadero hombre jamás utiliza una carta mágica ni trampa!',
    description: 'Ataques desde posición de defensa utilizando su descomunal defensa como valor de ataque devastador.'
  },
  {
    id: 'arcv_dennis',
    name: 'Dennis Macfield',
    alias: 'El Ilusionista del Circo del Terror',
    era: 'ARC-V',
    archetype: 'Performage / Trapeze Magician',
    mechanic: 'Xyz',
    aceMonster: 'Performage Trapeze Magician / Damage Juggler',
    avatarIcon: '🤹',
    quote: '¡El truco maestro es que salgas sin vida de mi escenario!',
    description: 'Prevención de cualquier daño letal y ataques dobles concedidos por el Mago del Trapecio.'
  },

  // ==========================================
  // ERA 6: VRAINS
  // ==========================================
  {
    id: 'vrains_yusaku',
    name: 'Yusaku Fujiki (Playmaker)',
    alias: 'El Salvador de la Red LINK VRAINS',
    era: 'VRAINS',
    archetype: 'Cyberse / Code Talker / Mathmech / Terahertz',
    mechanic: 'Enlace',
    aceMonster: 'Decodificador Hablador / Dragón de Sobrecarga de Cortafuegos Terahertz',
    avatarIcon: '🌐',
    quote: '¡Hay tres razones por las cuales vas a perder este duelo!',
    description: 'Co-enlaces impenetrables y Terahertz enviando monstruos ciberso al cementerio para ganar ataques mortales.'
  },
  {
    id: 'vrains_revolver',
    name: 'Revolver (Ryoken Kogami)',
    alias: 'El Comandante de los Caballeros de Hanoi',
    era: 'VRAINS',
    archetype: 'Rokket / Borrel / Dragon Link / Borrelend',
    mechanic: 'Enlace',
    aceMonster: 'Dragón Borrecarga / Dragón Finborre (Borrelend Dragon)',
    avatarIcon: '🔫',
    quote: '¡El abismo cibernético tragará toda ilusión de libertad!',
    description: 'Balas Rokket que destruyen recursos sin apuntar y Borrelend Dragon invulnerable que ataca a todos los monstruos.'
  },
  {
    id: 'vrains_soulburner',
    name: 'Soulburner (Takeru Homura)',
    alias: 'El Alma Ardiente de la Reencarnación',
    era: 'VRAINS',
    archetype: 'Salamangreat / Raging Phoenix / Pyro Link',
    mechanic: 'Enlace',
    aceMonster: 'Salamangrande Fénix Furioso / Lobo del Sol',
    avatarIcon: '🔥',
    quote: '¡El fuego de mi espíritu renace una y otra vez!',
    description: 'La Invocación por Reencarnación que busca trampas letales y Fénix Furioso con más de 5000 de ataque.'
  },
  {
    id: 'vrains_ai',
    name: 'Ai (@Ignister)',
    alias: 'La Última Inteligencia Artificial Libre',
    era: 'VRAINS',
    archetype: '@Ignister / The Arrival Cyberse / Dark Infant',
    mechanic: 'Enlace',
    aceMonster: 'La Llegada Ciberso @Ignister (The Arrival)',
    avatarIcon: '🤖',
    quote: '¡Los amigos y los monstruos de 6000 ATK nunca fallan!',
    description: 'The Arrival con 4000 a 6000 ATK completamente inafectado por cualquier efecto y destrucción por turno.'
  },
  {
    id: 'vrains_blue_angel',
    name: 'Aoi Zaizen (Blue Maiden)',
    alias: 'La Idolo de las Olas Marinas',
    era: 'VRAINS',
    archetype: 'Marincess / Aqua Link / Great Bubble Reef',
    mechanic: 'Enlace',
    aceMonster: 'Princesa Marina Gran Arrecife de Burbujas / Coral Anemone',
    avatarIcon: '🌊',
    quote: '¡El flujo de las corrientes marinas es eterno e inquebrantable!',
    description: 'Protección absoluta con Campo Marino y trampas activadas directamente desde la mano.'
  },
  {
    id: 'vrains_specter',
    name: 'Specter',
    alias: 'La Semilla del Árbol Solar',
    era: 'VRAINS',
    archetype: 'Sunavalon / Sunvine / Plant Link Loop',
    mechanic: 'Enlace',
    aceMonster: 'Sunavalon Dryas / Sunvine Thrasher',
    avatarIcon: '🌳',
    quote: '¡El Árbol Madre teje sus raíces sobre tus huesos!',
    description: 'Recuperación de daño inmediata y crecimiento exponencial de monstruos planta a partir de una sola semilla.'
  },
  {
    id: 'vrains_bohman',
    name: 'Bohman',
    alias: 'El Portador de la Conciencia Neuronal',
    era: 'VRAINS',
    archetype: 'Hydradrive / Attribute Link Control',
    mechanic: 'Enlace',
    aceMonster: 'Quimera Hydradrive Definitiva',
    avatarIcon: '🧬',
    quote: '¡Soy la evolución definitiva de la vida biológica y digital!',
    description: 'Manipulación de atributos del oponente para anular todos sus efectos e infligir daño penetrante.'
  },
  {
    id: 'vrains_ghost_gal',
    name: 'Ghost Gal (Emma Bessho)',
    alias: 'La Cazarrecompensas Sigilosa',
    era: 'VRAINS',
    archetype: 'Altergeist / Multifaker / Hexstia',
    mechanic: 'Enlace',
    aceMonster: 'Altergeist Hexstia / Memorygant',
    avatarIcon: '👻',
    quote: '¡La información correcta vale más que mil monstruos!',
    description: 'Control implacable de trampas con Multifaker y negación omnipotente con Hexstia.'
  },
  {
    id: 'vrains_lightning',
    name: 'Lightning',
    alias: 'El Líder de los Ignis de Luz',
    era: 'VRAINS',
    archetype: 'Armatos Legio / Judgment Arrows',
    mechanic: 'Enlace',
    aceMonster: 'Armatos Legio Magnus / Flechas del Juicio',
    avatarIcon: '⚡',
    quote: '¡Los humanos son una especie obsoleta en este tablero!',
    description: 'Flechas del Juicio que duplican el ataque de los monstruos que apuntan y bloquean respuestas rivales.'
  },

  // ==========================================
  // ERA 7: SEVENS
  // ==========================================
  {
    id: 'sevens_yuga',
    name: 'Yuga Ohdo',
    alias: 'El Creador del Rush Duel',
    era: 'SEVENS',
    archetype: 'Sevens Road / Maximum / Fusion Rush Modern',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Mago del Camino Sevens (Sevens Road Magician)',
    avatarIcon: '⚙️',
    quote: '¡Si las reglas son aburridas, inventaré las mías propias!',
    description: 'Robar hasta 5 cartas cada turno y ganar ataque masivo según la variedad de atributos en el cementerio.'
  },
  {
    id: 'sevens_luke',
    name: 'Luke (Tatsuhisa Kamijo)',
    alias: 'El Dragón Invencible de Goha',
    era: 'SEVENS',
    archetype: 'Dragias / Multistrike Dragon / Strike Dragon',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Dragón Multigolpe Dragias',
    avatarIcon: '🐉',
    quote: '¡Dragias ruge dos veces y aniquila dos veces!',
    description: 'El aterrador dragón que ataca dos veces consecutivas en el mismo turno limpiando las defensas.'
  },
  {
    id: 'sevens_romin',
    name: 'Romin Kassidy',
    alias: 'La Guitarrista Punk del Hambre',
    era: 'SEVENS',
    archetype: 'Psychic / Prima Guitarna / Esperade',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Prima Guitarna de la Estrella Reluciente',
    avatarIcon: '🎸',
    quote: '¡Cuando mi estómago ruge, mi solo de guitarra te destruirá!',
    description: 'Pago agresivo de puntos de vida para infligir daño masivo y buffear a todos sus monstruos psíquicos.'
  },
  {
    id: 'sevens_gakuto',
    name: 'Gakuto Sogetsu',
    alias: 'El Presidente del Consejo Sogetsu',
    era: 'SEVENS',
    archetype: 'Warrior / Yameruler the Dark Striker',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Yameruler el Golpeador Oscuro',
    avatarIcon: '📜',
    quote: '¡La etiqueta y la disciplina marcan la diferencia!',
    description: 'Bloqueo total a las invocaciones por sacrificio del rival mientras controla la posición de batalla.'
  },
  {
    id: 'sevens_neil',
    name: 'Neil Saionji',
    alias: 'El Maestro de la Providencia Máxima',
    era: 'SEVENS',
    archetype: 'Yggdrago of the Sky Emperor / Cyberse Maximum',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Yggdrago del Cielo Emperador (Modo Máximo 4000 ATK)',
    avatarIcon: '💠',
    quote: '¡Todo en este universo está regido por la Providencia!',
    description: 'Invocación Máxima de tres piezas unidas formando un titán que destruye monstruos en defensa y es inmune a trampas.'
  },
  {
    id: 'sevens_roa',
    name: 'Roa Kirishima',
    alias: 'La Estrella de Rock de RoaRomin',
    era: 'SEVENS',
    archetype: 'Royal Rebel\'s / Heavy Metal / Doom Metal',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Rebelde Real Heavy Metal',
    avatarIcon: '🎤',
    quote: '¡Soy el rey del escenario y tú solo un espectador!',
    description: 'Destruye los monstruos de nivel bajo del oponente y roba su ataque para un remate de concierto mortal.'
  },
  {
    id: 'sevens_asana',
    name: 'Asana Mutsuba',
    alias: 'La Heredera de la Excavadora de Duelos',
    era: 'SEVENS',
    archetype: 'Wyrm / Build Dragon / Demolition Maximum',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Constructor Dragón Constructor Wyrm',
    avatarIcon: '🚜',
    quote: '¡Cavaremos hasta los cimientos de tu estrategia!',
    description: 'Monstruos Wyrm que destruyen campos y recuperan cartas del cementerio con fuerza de construcción pesada.'
  },
  {
    id: 'sevens_otes',
    name: 'Otes',
    alias: 'El Guía Enigmático de las Ruinas',
    era: 'SEVENS',
    archetype: 'Dark Magician / Sevens Road Origin',
    mechanic: 'Híbrido Moderno',
    aceMonster: 'Mago de las Sombras Milenarias',
    avatarIcon: '🎭',
    quote: '¡El futuro del duelo depende de las decisiones que tomes hoy!',
    description: 'Estrategias que replican el juego clásico de Yugi adaptadas a la máxima velocidad del nuevo formato.'
  },

  // ==========================================
  // ERA 8: GO RUSH!!
  // ==========================================
  {
    id: 'gorush_yudias',
    name: 'Yudias Velgear',
    alias: 'El Guerrero Cósmico de Velgear',
    era: 'Go RUSH!!',
    archetype: 'Galaxy / Galactica Oblivion / Transam Linac',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Galactica Oblivion / Transam Linac',
    avatarIcon: '👽',
    quote: '¡Ut-To-Go! ¡Por la paz de los 8.8 millones de compatriotas!',
    description: 'El primer usuario del tipo Galaxia con monstruos normales apoyados por magias estelares de aumento de poder masivo.'
  },
  {
    id: 'gorush_yuhi',
    name: 'Yuhi Ohdo',
    alias: 'El As de la UTS (Soporte Técnico)',
    era: 'Go RUSH!!',
    archetype: 'Jointech / Jointech Rex / Earth Machine',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Jointech Rex / Jointech Hero',
    avatarIcon: '🔧',
    quote: '¡No hay máquina que la UTS no pueda mejorar!',
    description: 'Monstruos máquina terrestres que destruyen cartas mágicas y trampas enemigas al cambiar su posición de batalla.'
  },
  {
    id: 'gorush_yuamu',
    name: 'Yuamu Ohdo',
    alias: 'La Jefa Estratega de la UTS',
    era: 'Go RUSH!!',
    archetype: 'High Tech Dragon / Blue Tooth Burst Dragon',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Dragón Explosivo Diente Azul (Blue Tooth Burst Dragon)',
    avatarIcon: '📱',
    quote: '¡Calculo cada variable antes de que pienses tu jugada!',
    description: 'Destruye todos los monstruos con menos de 1500 ATK e incrementa el poder de sus dragones cibernéticos.'
  },
  {
    id: 'gorush_zwijo',
    name: 'Zwijo zir Velgear',
    alias: 'El General Oscuro del Espacio',
    era: 'Go RUSH!!',
    archetype: 'Voidvelgr / Voidvelgr Requiem / Dark Galaxy',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Voidvelgr Réquiem / Voidvelgr Chrysaor',
    avatarIcon: '🌌',
    quote: '¡El vacío del universo consumirá toda débil esperanza!',
    description: 'Galaxia oscura con incrementos devastadores de 3000 ATK si el rival controla monstruos de Luz.'
  },
  {
    id: 'gorush_rovian',
    name: 'Rovian Kirishima',
    alias: 'La Barda Espacial del Viento Errante',
    era: 'Go RUSH!!',
    archetype: 'Wind Psychic / Bandijo of the Battle Guitar',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Bandijo de la Guitarra de Batalla',
    avatarIcon: '🪕',
    quote: '¡Escucha el verso que vaticina tu caída!',
    description: 'Poemas de combate psíquico que reducen el ataque rival a 0 y devuelven cartas a la mano.'
  },
  {
    id: 'gorush_phaser',
    name: 'Phaser Ryugu',
    alias: 'Comandante en Jefe de la MIK',
    era: 'Go RUSH!!',
    archetype: 'Abysslayer / Deep Sea Dragon',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Abysslayer Leviathastar',
    avatarIcon: '🐉',
    quote: '¡Los invasores extraterrestres serán eliminados del mapa!',
    description: 'Dominio de las profundidades marinas que castiga al cementerio enemigo y otorga ataques múltiples.'
  },
  {
    id: 'gorush_tremolo',
    name: 'Tremolo Ryugu',
    alias: 'El Subcomandante Dragón de la MIK',
    era: 'Go RUSH!!',
    archetype: 'Metarion / Fusion Cyborg',
    mechanic: 'Fusión',
    aceMonster: 'Metarion King Cobrastar',
    avatarIcon: '🐍',
    quote: '¡Nuestras fusiones cibernéticas no tienen punto débil!',
    description: 'Fusiones de contacto instantáneas con efectos duales que cambian las cartas del adversario al revés.'
  },
  {
    id: 'gorush_creator',
    name: 'The Creator (Kuaidul Velgear)',
    alias: 'El Demiurgo del Universo Velgear',
    era: 'Go RUSH!!',
    archetype: 'Praelator / Transam Buster / Cosmic Origin',
    mechanic: 'Maximum / Rush',
    aceMonster: 'Transam Buster Prime',
    avatarIcon: '👑',
    quote: '¡El lienzo del multiverso se pinta según mi voluntad!',
    description: 'Control de cartas desde el mazo principal con invocaciones de rango omnipotente.'
  }
];

// Helper to get 64 balanced characters (8 per era)
export function getInitial64Duelists(): string[] {
  const eras: Era[] = ['DM', 'GX', '5D\'s', 'ZEXAL', 'ARC-V', 'VRAINS', 'SEVENS', 'Go RUSH!!'];
  const selected: string[] = [];
  
  eras.forEach(era => {
    const eraDuelists = INITIAL_DUELISTS_DATABASE.filter(d => d.era === era);
    // Take first 8
    eraDuelists.slice(0, 8).forEach(d => {
      selected.push(d.id);
    });
  });

  return selected;
}
