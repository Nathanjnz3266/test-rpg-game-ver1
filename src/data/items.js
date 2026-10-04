export const RARITIES = {
  COMMON: { id: 'COMMON', name: 'Common', color: '#9d9d9d', multiplier: 1.0 },
  UNCOMMON: { id: 'UNCOMMON', name: 'Uncommon', color: '#1eff00', multiplier: 1.25 },
  RARE: { id: 'RARE', name: 'Rare', color: '#0070dd', multiplier: 1.6 },
  EPIC: { id: 'EPIC', name: 'Epic', color: '#a335ee', multiplier: 2.1 },
  LEGENDARY: { id: 'LEGENDARY', name: 'Legendary', color: '#ff8000', multiplier: 2.8 },
  MYTHIC: { id: 'MYTHIC', name: 'Mythic', color: '#00ccff', multiplier: 3.6 },
  DIVINE: { id: 'DIVINE', name: 'Divine', color: '#e6cc80', multiplier: 4.8 },
  ANCIENT: { id: 'ANCIENT', name: 'Ancient', color: '#ff3366', multiplier: 6.5 }
};

export const ITEMS_DATABASE = {
  // --- WEAPONS ---
  WEAPON_NOVICE_SWORD: {
    id: 'WEAPON_NOVICE_SWORD',
    name: 'Novice Iron Sword',
    slot: 'Weapon',
    weaponType: 'Sword',
    rarity: 'COMMON',
    levelReq: 1,
    baseStats: { attack: 15, str: 2 },
    price: 50,
    icon: '🗡️',
    description: 'A simple iron sword issued to beginner adventurers in Greenvale.'
  },
  WEAPON_STEEL_GREATSWORD: {
    id: 'WEAPON_STEEL_GREATSWORD',
    name: 'Greenvale Guardian Greatsword',
    slot: 'Weapon',
    weaponType: 'Greatsword',
    rarity: 'RARE',
    levelReq: 8,
    baseStats: { attack: 48, str: 8, vit: 5, critRate: 4 },
    price: 450,
    icon: '⚔️',
    description: 'Forged by the Greenvale blacksmith using hardened steel ore.'
  },
  WEAPON_FLAME_SWORD: {
    id: 'WEAPON_FLAME_SWORD',
    name: 'Infernal Blaze Sword',
    slot: 'Weapon',
    weaponType: 'Sword',
    rarity: 'LEGENDARY',
    levelReq: 25,
    baseStats: { attack: 120, str: 18, critRate: 8, attackSpeed: 0.1 },
    passive: 'Flame Touch: Attacks have a 15% chance to ignite targets for 30 Fire Damage/sec.',
    price: 3200,
    icon: '🔥',
    description: 'Forged in the heart of Ashen Mountain volcanoes.'
  },
  WEAPON_NOVICE_STAFF: {
    id: 'WEAPON_NOVICE_STAFF',
    name: 'Oak Apprentice Staff',
    slot: 'Weapon',
    weaponType: 'Staff',
    rarity: 'COMMON',
    levelReq: 1,
    baseStats: { magicAttack: 18, int: 3, mp: 20 },
    price: 50,
    icon: '🔮',
    description: 'A wooden staff crafted for novice mages.'
  },
  WEAPON_ARCHMAGE_STAFF: {
    id: 'WEAPON_ARCHMAGE_STAFF',
    name: "Aetheria Archmage's Orb Staff",
    slot: 'Weapon',
    weaponType: 'Staff',
    rarity: 'EPIC',
    levelReq: 20,
    baseStats: { magicAttack: 95, int: 16, cdr: 8, mp: 80 },
    passive: 'Arcane Surge: Reduces all spell cooldowns by 10%.',
    price: 2400,
    icon: '✨',
    description: 'Imbued with shimmering arcane energy from the High Mage Guild.'
  },
  WEAPON_NOVICE_BOW: {
    id: 'WEAPON_NOVICE_BOW',
    name: 'Wooden Shortbow',
    slot: 'Weapon',
    weaponType: 'Bow',
    rarity: 'COMMON',
    levelReq: 1,
    baseStats: { attack: 14, dex: 3, attackSpeed: 0.05 },
    price: 50,
    icon: '🏹',
    description: 'A lightweight bow suitable for hunting game.'
  },
  WEAPON_DRAGON_BOW: {
    id: 'WEAPON_DRAGON_BOW',
    name: 'Wyrmscale Greatbow',
    slot: 'Weapon',
    weaponType: 'LEGENDARY',
    levelReq: 35,
    baseStats: { attack: 155, dex: 24, critRate: 14, critDmg: 25 },
    passive: 'Wyrm Pierce: Shots ignore 20% of target defense.',
    price: 5000,
    icon: '🏹',
    description: 'Crafted from the bones and tendons of the Sand Wyrm King.'
  },
  WEAPON_DUAL_DAGGERS: {
    id: 'WEAPON_DUAL_DAGGERS',
    name: 'Shadow Twin Blades',
    slot: 'Weapon',
    weaponType: 'Dual Daggers',
    rarity: 'EPIC',
    levelReq: 15,
    baseStats: { attack: 72, dex: 12, luk: 10, critDmg: 30, attackSpeed: 0.2 },
    passive: 'Vampiric Edge: Grants +5% Life Steal on critical hits.',
    price: 1800,
    icon: '🗡️',
    description: 'Blade pair crafted for silent assassinations in Crimson Forest.'
  },
  WEAPON_DIVINE_PALADIN_SWORD: {
    id: 'WEAPON_DIVINE_PALADIN_SWORD',
    name: 'Sunbringer Sacred Blade',
    slot: 'Weapon',
    weaponType: 'Sword',
    rarity: 'MYTHIC',
    levelReq: 50,
    baseStats: { attack: 210, magicAttack: 140, str: 30, vit: 25, hp: 500 },
    passive: 'Sacred Judgement: Smite undead and dark foes for +50% bonus damage.',
    price: 12000,
    icon: '☀️',
    description: 'An ancient relic wielded by Paladins during the Great Collapse.'
  },

  // --- ARMOR ---
  HELMET_LEATHER: {
    id: 'HELMET_LEATHER',
    name: 'Adventurer Leather Cap',
    slot: 'Helmet',
    rarity: 'COMMON',
    levelReq: 1,
    baseStats: { defense: 4, hp: 20 },
    price: 35,
    icon: '🪖',
    description: 'Sturdy leather cap protecting from minor slashes.'
  },
  HELMET_IRON: {
    id: 'HELMET_IRON',
    name: 'Iron Knight Helm',
    slot: 'Helmet',
    rarity: 'UNCOMMON',
    levelReq: 5,
    baseStats: { defense: 12, hp: 60, vit: 4 },
    price: 120,
    icon: '🪖',
    description: 'Full-face steel visor visor offering reliable defense.'
  },
  CHEST_LEATHER: {
    id: 'CHEST_LEATHER',
    name: 'Novice Padded Tunic',
    slot: 'Chest',
    rarity: 'COMMON',
    levelReq: 1,
    baseStats: { defense: 8, hp: 35 },
    price: 60,
    icon: '👕',
    description: 'Basic traveler tunic reinforced with thick padding.'
  },
  CHEST_PLATE: {
    id: 'CHEST_PLATE',
    name: 'Greenvale Heavy Cuirass',
    slot: 'Chest',
    rarity: 'RARE',
    levelReq: 10,
    baseStats: { defense: 28, hp: 140, vit: 8, str: 4 },
    price: 550,
    icon: '🛡️',
    description: 'Heavy chest plate worn by elite city guards.'
  },
  CHEST_ABYSSAL: {
    id: 'CHEST_ABYSSAL',
    name: 'Forgotten King Abyssal Armor',
    slot: 'Chest',
    rarity: 'ANCIENT',
    levelReq: 70,
    baseStats: { defense: 180, magicDefense: 150, hp: 1200, str: 45, vit: 50 },
    passive: 'Abyssal Ward: Reflects 15% of incoming melee damage back to attackers.',
    price: 35000,
    icon: '👑',
    description: 'Legendary relic armor extracted from the depths of The Abyss.'
  },
  GLOVES_LEATHER: {
    id: 'GLOVES_LEATHER',
    name: 'Rawhide Gloves',
    slot: 'Gloves',
    rarity: 'COMMON',
    levelReq: 1,
    baseStats: { defense: 3, attackSpeed: 0.02 },
    price: 30,
    icon: '🧤',
    description: 'Flexible leather gloves.'
  },
  PANTS_LEATHER: {
    id: 'PANTS_LEATHER',
    name: 'Traveler Leather Trousers',
    slot: 'Pants',
    rarity: 'COMMON',
    levelReq: 1,
    baseStats: { defense: 5, hp: 25 },
    price: 40,
    icon: '👖',
    description: 'Comfortable pants for long journeys.'
  },
  BOOTS_SPEED: {
    id: 'BOOTS_SPEED',
    name: 'Windrunner Swift Boots',
    slot: 'Boots',
    rarity: 'RARE',
    levelReq: 12,
    baseStats: { defense: 10, moveSpeed: 1.2, dex: 6 },
    price: 400,
    icon: '🥾',
    description: 'Enchanted boots lightweight as the mountain gale.'
  },

  // --- ACCESSORIES ---
  RING_CRIT: {
    id: 'RING_CRIT',
    name: 'Ruby Eye Ring',
    slot: 'Ring1',
    rarity: 'UNCOMMON',
    levelReq: 5,
    baseStats: { critRate: 6, attack: 8 },
    price: 250,
    icon: '💍',
    description: 'Glowing ruby ring focusing offensive instincts.'
  },
  AMULET_VITALITY: {
    id: 'AMULET_VITALITY',
    name: 'Aether Core Pendant',
    slot: 'Amulet',
    rarity: 'EPIC',
    levelReq: 15,
    baseStats: { hp: 250, mp: 100, lifeSteal: 3, cdr: 5 },
    price: 1500,
    icon: '📿',
    description: 'Resonates with the ancient energy of Aetheria.'
  },

  // --- CONSUMABLES ---
  POTION_HP_SMALL: {
    id: 'POTION_HP_SMALL',
    name: 'Minor Health Potion',
    type: 'Consumable',
    category: 'Potion',
    restoreHp: 100,
    stackable: true,
    price: 25,
    icon: '🧪',
    description: 'Restores 100 HP immediately.'
  },
  POTION_HP_LARGE: {
    id: 'POTION_HP_LARGE',
    name: 'Great Elixir of Life',
    type: 'Consumable',
    category: 'Potion',
    restoreHp: 400,
    stackable: true,
    price: 100,
    icon: '🏺',
    description: 'Restores 400 HP immediately.'
  },
  POTION_MP_SMALL: {
    id: 'POTION_MP_SMALL',
    name: 'Minor Mana Tonic',
    type: 'Consumable',
    category: 'Potion',
    restoreMp: 80,
    stackable: true,
    price: 25,
    icon: '💧',
    description: 'Restores 80 MP immediately.'
  },

  // --- FOOD BUFFS ---
  FOOD_GRILLED_MEAT: {
    id: 'FOOD_GRILLED_MEAT',
    name: 'Grilled Boar Steak',
    type: 'Consumable',
    category: 'Food',
    buff: { hpMaxPercent: 10, duration: 600 },
    stackable: true,
    price: 50,
    icon: '🍖',
    description: 'Delicious hot steak! Boosts Max HP by +10% for 10 minutes.'
  },
  FOOD_SPICY_STEW: {
    id: 'FOOD_SPICY_STEW',
    name: 'Spicy Crimson Stew',
    type: 'Consumable',
    category: 'Food',
    buff: { attackPercent: 15, duration: 600 },
    stackable: true,
    price: 75,
    icon: '🍲',
    description: 'Hearty spicy stew! Boosts Physical & Magic Attack by +15% for 10 minutes.'
  },
  FOOD_HUNTER_MEAL: {
    id: 'FOOD_HUNTER_MEAL',
    name: "Hunter's Savory Feast",
    type: 'Consumable',
    category: 'Food',
    buff: { critRateBonus: 10, duration: 600 },
    stackable: true,
    price: 90,
    icon: '🥗',
    description: 'Finely seasoned hunter meal! Boosts Crit Rate by +10% for 10 minutes.'
  },

  // --- CRAFTING MATERIALS ---
  MAT_IRON_ORE: {
    id: 'MAT_IRON_ORE',
    name: 'Iron Ore',
    type: 'Material',
    stackable: true,
    price: 10,
    icon: '🪨',
    description: 'Raw iron mined from rocky hills.'
  },
  MAT_WOOD: {
    id: 'MAT_WOOD',
    name: 'Elder Wood Bark',
    type: 'Material',
    stackable: true,
    price: 8,
    icon: '🪵',
    description: 'Sturdy wood from ancient trees.'
  },
  MAT_LEATHER: {
    id: 'MAT_LEATHER',
    name: 'Thick Beast Leather',
    type: 'Material',
    stackable: true,
    price: 12,
    icon: '📜',
    description: 'Processed pelt from wild beasts.'
  },
  MAT_AETHER_CRYSTAL: {
    id: 'MAT_AETHER_CRYSTAL',
    name: 'Glowing Aether Shard',
    type: 'Material',
    stackable: true,
    price: 150,
    icon: '💎',
    description: 'Rare crystal containing compressed magical aura.'
  }
};

// Crafting Recipes
export const CRAFTING_RECIPES = [
  {
    resultId: 'WEAPON_STEEL_GREATSWORD',
    count: 1,
    costGold: 200,
    ingredients: [
      { id: 'MAT_IRON_ORE', count: 10 },
      { id: 'MAT_WOOD', count: 5 },
      { id: 'MAT_LEATHER', count: 3 }
    ]
  },
  {
    resultId: 'WEAPON_FLAME_SWORD',
    count: 1,
    costGold: 1500,
    ingredients: [
      { id: 'MAT_IRON_ORE', count: 25 },
      { id: 'MAT_AETHER_CRYSTAL', count: 8 },
      { id: 'MAT_LEATHER', count: 10 }
    ]
  },
  {
    resultId: 'POTION_HP_LARGE',
    count: 3,
    costGold: 100,
    ingredients: [
      { id: 'POTION_HP_SMALL', count: 3 },
      { id: 'MAT_AETHER_CRYSTAL', count: 1 }
    ]
  },
  {
    resultId: 'FOOD_SPICY_STEW',
    count: 2,
    costGold: 50,
    ingredients: [
      { id: 'FOOD_GRILLED_MEAT', count: 2 },
      { id: 'MAT_WOOD', count: 2 }
    ]
  }
];
