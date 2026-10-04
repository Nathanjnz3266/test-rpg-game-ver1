export const ENEMIES_DATABASE = {
  // --- NORMAL MOBS ---
  GOBLIN: {
    id: 'GOBLIN',
    name: 'Greenvale Goblin Scout',
    level: 3,
    hp: 120,
    maxHp: 120,
    attack: 16,
    defense: 5,
    moveSpeed: 5.5,
    attackRange: 2.2,
    attackRate: 1.5,
    expYield: 45,
    goldYield: 15,
    scale: 0.8,
    color: 0x33aa33,
    type: 'Beast',
    drops: [
      { itemId: 'MAT_WOOD', chance: 0.6, count: 2 },
      { itemId: 'POTION_HP_SMALL', chance: 0.4, count: 1 },
      { itemId: 'WEAPON_NOVICE_SWORD', chance: 0.1, count: 1 }
    ]
  },
  WOLF: {
    id: 'WOLF',
    name: 'Wild Greenvale Wolf',
    level: 5,
    hp: 180,
    maxHp: 180,
    attack: 24,
    defense: 8,
    moveSpeed: 7.0,
    attackRange: 2.5,
    attackRate: 1.2,
    expYield: 75,
    goldYield: 25,
    scale: 0.9,
    color: 0x777777,
    type: 'Beast',
    drops: [
      { itemId: 'MAT_LEATHER', chance: 0.7, count: 2 },
      { itemId: 'FOOD_GRILLED_MEAT', chance: 0.3, count: 1 }
    ]
  },
  SKELETON: {
    id: 'SKELETON',
    name: 'Ruins Skeleton Warrior',
    level: 8,
    hp: 260,
    maxHp: 260,
    attack: 34,
    defense: 14,
    moveSpeed: 4.8,
    attackRange: 2.5,
    attackRate: 1.6,
    expYield: 120,
    goldYield: 45,
    scale: 1.0,
    color: 0xdddddd,
    type: 'Undead',
    drops: [
      { itemId: 'MAT_IRON_ORE', chance: 0.5, count: 2 },
      { itemId: 'HELMET_IRON', chance: 0.15, count: 1 }
    ]
  },
  ORC: {
    id: 'ORC',
    name: 'Crimson Orc Berserker',
    level: 14,
    hp: 450,
    maxHp: 450,
    attack: 52,
    defense: 22,
    moveSpeed: 5.8,
    attackRange: 3.0,
    attackRate: 2.0,
    expYield: 220,
    goldYield: 90,
    scale: 1.2,
    color: 0x994411,
    type: 'Humanoid',
    drops: [
      { itemId: 'WEAPON_STEEL_GREATSWORD', chance: 0.08, count: 1 },
      { itemId: 'CHEST_PLATE', chance: 0.08, count: 1 },
      { itemId: 'MAT_IRON_ORE', chance: 0.8, count: 3 }
    ]
  },
  NIGHTMARE_WOLF: {
    id: 'NIGHTMARE_WOLF',
    name: 'Nightmare Crimson Wolf',
    level: 18,
    hp: 650,
    maxHp: 650,
    attack: 75,
    defense: 28,
    moveSpeed: 8.0,
    attackRange: 2.8,
    attackRate: 1.1,
    expYield: 380,
    goldYield: 140,
    scale: 1.1,
    color: 0xbb0022,
    isNightOnly: true,
    drops: [
      { itemId: 'WEAPON_DUAL_DAGGERS', chance: 0.1, count: 1 },
      { itemId: 'AMULET_VITALITY', chance: 0.05, count: 1 }
    ]
  },
  VOLCANO_GOLEM: {
    id: 'VOLCANO_GOLEM',
    name: 'Ashen Lava Golem',
    level: 28,
    hp: 1400,
    maxHp: 1400,
    attack: 110,
    defense: 65,
    moveSpeed: 3.8,
    attackRange: 3.5,
    attackRate: 2.4,
    expYield: 750,
    goldYield: 300,
    scale: 1.5,
    color: 0xff4400,
    drops: [
      { itemId: 'MAT_AETHER_CRYSTAL', chance: 0.4, count: 2 },
      { itemId: 'WEAPON_FLAME_SWORD', chance: 0.04, count: 1 }
    ]
  },

  // --- BOSSES ---
  BOSS_FOREST_GUARDIAN: {
    id: 'BOSS_FOREST_GUARDIAN',
    name: 'Forest Guardian — Ancient Treant',
    isBoss: true,
    level: 10,
    hp: 2500,
    maxHp: 2500,
    attack: 65,
    defense: 30,
    moveSpeed: 4.5,
    scale: 2.5,
    color: 0x2e7d32,
    expYield: 1200,
    goldYield: 800,
    phases: [
      {
        phase: 1,
        hpThreshold: 1.0,
        name: 'Root Slam & Vine Whip',
        attacks: ['VINE_WHIP', 'ROOT_STOMP']
      },
      {
        phase: 2,
        hpThreshold: 0.5,
        name: 'Enraged Emerald Hurricane',
        attackBuff: 1.3,
        attacks: ['VINE_WHIP', 'ROOT_STOMP', 'THORN_CYCLONE']
      }
    ],
    drops: [
      { itemId: 'WEAPON_STEEL_GREATSWORD', chance: 1.0, count: 1 },
      { itemId: 'CHEST_PLATE', chance: 1.0, count: 1 },
      { itemId: 'MAT_AETHER_CRYSTAL', chance: 1.0, count: 5 }
    ]
  },
  BOSS_BLOODFANG: {
    id: 'BOSS_BLOODFANG',
    name: 'Bloodfang Alpha — Shadow Werewolf',
    isBoss: true,
    level: 20,
    hp: 5500,
    maxHp: 5500,
    attack: 120,
    defense: 45,
    moveSpeed: 7.5,
    scale: 2.2,
    color: 0x900c3f,
    expYield: 3500,
    goldYield: 2000,
    phases: [
      {
        phase: 1,
        hpThreshold: 1.0,
        name: 'Blood Frenzy Claws',
        attacks: ['SHADOW_LUNGE', 'BLOOD_CLAWS']
      },
      {
        phase: 2,
        hpThreshold: 0.4,
        name: 'Blood Moon Howl',
        attackBuff: 1.4,
        attacks: ['SHADOW_LUNGE', 'BLOOD_CLAWS', 'HOWL_SUMMON']
      }
    ],
    drops: [
      { itemId: 'WEAPON_DUAL_DAGGERS', chance: 1.0, count: 1 },
      { itemId: 'BOOTS_SPEED', chance: 1.0, count: 1 }
    ]
  },
  BOSS_INFERNO_DRAGON: {
    id: 'BOSS_INFERNO_DRAGON',
    name: 'Inferno Dragon — Flame Monarch',
    isBoss: true,
    level: 35,
    hp: 15000,
    maxHp: 15000,
    attack: 240,
    defense: 80,
    moveSpeed: 6.0,
    scale: 3.5,
    color: 0xff1100,
    expYield: 10000,
    goldYield: 6000,
    phases: [
      {
        phase: 1,
        hpThreshold: 1.0,
        name: 'Ground Flame Breath & Tail Swipe',
        attacks: ['FIRE_BREATH', 'TAIL_SWIPE']
      },
      {
        phase: 2,
        hpThreshold: 0.6,
        name: 'Aerial Meteor Bombardment',
        isFlying: true,
        attacks: ['METEOR_BOMBARD', 'WING_GALE']
      },
      {
        phase: 3,
        hpThreshold: 0.25,
        name: 'Cataclysmic Lava Overload',
        attackBuff: 1.6,
        attacks: ['LAVA_SUPERNOVA', 'FIRE_BREATH']
      }
    ],
    drops: [
      { itemId: 'WEAPON_FLAME_SWORD', chance: 1.0, count: 1 },
      { itemId: 'AMULET_VITALITY', chance: 1.0, count: 1 },
      { itemId: 'MAT_AETHER_CRYSTAL', chance: 1.0, count: 12 }
    ]
  },
  BOSS_FORGOTTEN_KING: {
    id: 'BOSS_FORGOTTEN_KING',
    name: 'The Forgotten King — Sovereign of Decay',
    isBoss: true,
    level: 70,
    hp: 50000,
    maxHp: 50000,
    attack: 550,
    defense: 220,
    moveSpeed: 7.0,
    scale: 3.0,
    color: 0x4a148c,
    expYield: 50000,
    goldYield: 30000,
    phases: [
      {
        phase: 1,
        hpThreshold: 1.0,
        name: 'Abyssal Cleave & Soul Rend',
        attacks: ['VOID_CLEAVE', 'SOUL_DRAIN']
      },
      {
        phase: 2,
        hpThreshold: 0.5,
        name: 'Shadow Realm Apocalypse',
        attacks: ['VOID_NOVA', 'PHANTOM_SUMMON', 'VOID_CLEAVE']
      }
    ],
    drops: [
      { itemId: 'CHEST_ABYSSAL', chance: 1.0, count: 1 },
      { itemId: 'WEAPON_DIVINE_PALADIN_SWORD', chance: 1.0, count: 1 }
    ]
  }
};
