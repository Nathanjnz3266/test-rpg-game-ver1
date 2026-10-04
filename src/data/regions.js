export const REGIONS = {
  GREENVALE: {
    id: 'GREENVALE',
    name: 'Greenvale Haven',
    levelRange: '1 - 10',
    minLevel: 1,
    maxLevel: 10,
    bossName: 'Forest Guardian',
    bossId: 'BOSS_FOREST_GUARDIAN',
    description: 'Vibrant emerald plains, idyllic farming villages, whispering oak forests, and ancient sunlit ruins.',
    skyColor: 0x7ec0ee,
    groundColor: 0x4a8505,
    fogColor: 0xa8e0ff,
    fogDensity: 0.005,
    ambientLight: 0xffffff,
    musicTheme: 'TOWN_GREENVALE',
    teleportShrines: [
      { id: 'SHRINE_GREENVALE_TOWN', name: 'Greenvale Central Plaza', position: { x: 0, z: 0 } },
      { id: 'SHRINE_GREENVALE_RUINS', name: 'Whispering Ruins Shrine', position: { x: -80, z: 90 } },
      { id: 'SHRINE_GREENVALE_DUNGEON', name: 'Elder Wood Dungeon Portal', position: { x: 120, z: -140 } }
    ]
  },
  CRIMSON_FOREST: {
    id: 'CRIMSON_FOREST',
    name: 'Crimson Forest',
    levelRange: '10 - 20',
    minLevel: 10,
    maxLevel: 20,
    bossName: 'Bloodfang Alpha',
    bossId: 'BOSS_BLOODFANG',
    description: 'A dense mystical woodland of gigantic red leaves, luminescent mushrooms, swirling thick fog, and blood wolves.',
    skyColor: 0x3d1a24,
    groundColor: 0x6e1b24,
    fogColor: 0x801d2d,
    fogDensity: 0.012,
    ambientLight: 0xffaaaa,
    musicTheme: 'MYSTICAL_FOREST',
    teleportShrines: [
      { id: 'SHRINE_CRIMSON_CAMP', name: 'Hunter Outpost Shrine', position: { x: 250, z: 200 } }
    ]
  },
  ASHEN_MOUNTAINS: {
    id: 'ASHEN_MOUNTAINS',
    name: 'Ashen Volcano Mountains',
    levelRange: '20 - 35',
    minLevel: 20,
    maxLevel: 35,
    bossName: 'Inferno Dragon',
    bossId: 'BOSS_INFERNO_DRAGON',
    description: 'Craggy basalt cliffs, glowing lava rivers, smoking craters, and dwarf mining fortresses.',
    skyColor: 0x221100,
    groundColor: 0x332211,
    fogColor: 0xff4400,
    fogDensity: 0.01,
    ambientLight: 0xff8844,
    musicTheme: 'VOLCANO_BATTLE',
    teleportShrines: [
      { id: 'SHRINE_ASHEN_FORTRESS', name: 'Ironforge Mine Gate', position: { x: -300, z: -350 } }
    ]
  },
  SOLARIS_DESERT: {
    id: 'SOLARIS_DESERT',
    name: 'Solaris Dunes & Lost Oasis',
    levelRange: '35 - 50',
    minLevel: 35,
    maxLevel: 50,
    bossName: 'Sand Wyrm King',
    bossId: 'BOSS_WYRM_KING',
    description: 'Endless golden sand dunes, hidden crystal oases, towering pyramids, and buried underground temples.',
    skyColor: 0xffe699,
    groundColor: 0xd4a359,
    fogColor: 0xffd966,
    fogDensity: 0.004,
    ambientLight: 0xfff0aa,
    musicTheme: 'DESERT_ATMOSPHERE',
    teleportShrines: [
      { id: 'SHRINE_SOLARIS_PYRAMID', name: 'Sun Pyramid Entrance', position: { x: 450, z: -400 } }
    ]
  },
  FROZEN_NORTH: {
    id: 'FROZEN_NORTH',
    name: 'Glacial Frozen North',
    levelRange: '50 - 65',
    minLevel: 50,
    maxLevel: 65,
    bossName: 'Frost Titan',
    bossId: 'BOSS_FROST_TITAN',
    description: 'Perpetual raging blizzards, mirror-like frozen lakes, crystal ice caves, and abandoned frost castles.',
    skyColor: 0xabcbde,
    groundColor: 0xddeeff,
    fogColor: 0xc4e3ed,
    fogDensity: 0.015,
    ambientLight: 0xddffff,
    musicTheme: 'BLIZZARD_THEME',
    teleportShrines: [
      { id: 'SHRINE_FROZEN_CASTLE', name: 'Frost Citadel Gate', position: { x: -500, z: 500 } }
    ]
  },
  THE_ABYSS: {
    id: 'THE_ABYSS',
    name: 'The Abyss — Realm of Darkness',
    levelRange: '65 - 100',
    minLevel: 65,
    maxLevel: 100,
    bossName: 'The Forgotten King',
    bossId: 'BOSS_FORGOTTEN_KING',
    description: 'The shattered endgame void of corrupt dark magic, float obsidian monoliths, and ancient divine ruins.',
    skyColor: 0x0a0515,
    groundColor: 0x150b28,
    fogColor: 0x240e42,
    fogDensity: 0.018,
    ambientLight: 0x8050ff,
    musicTheme: 'ABYSS_FINAL',
    teleportShrines: [
      { id: 'SHRINE_ABYSS_THRONE', name: 'Sanctum of the Forgotten', position: { x: 0, z: 800 } }
    ]
  }
};
