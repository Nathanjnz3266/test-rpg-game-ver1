export const QUESTS_DATABASE = [
  // --- MAIN QUESTS ---
  {
    id: 'MAIN_01',
    name: 'Awakening of the Aether Core',
    category: 'Main',
    reqLevel: 1,
    giverName: 'Elder Marcus',
    location: 'Greenvale Plaza',
    description: 'Speak with Elder Marcus in Greenvale to learn about the ancient history of Aetheria and your mysterious Aether Core.',
    objectives: [
      { type: 'TALK_NPC', npcId: 'NPC_ELDER_MARCUS', count: 1, current: 0, text: 'Speak to Elder Marcus in Greenvale Plaza' }
    ],
    rewards: { exp: 100, gold: 50, item: 'POTION_HP_SMALL' },
    nextQuestId: 'MAIN_02'
  },
  {
    id: 'MAIN_02',
    name: 'Cleansing the Outskirts',
    category: 'Main',
    reqLevel: 2,
    giverName: 'Captain Bryan',
    location: 'Greenvale Gate',
    description: 'Goblin scouts have been spotted near the village perimeter. Slay 5 Goblins to secure the road.',
    objectives: [
      { type: 'KILL_ENEMY', targetId: 'GOBLIN', count: 5, current: 0, text: 'Defeat Greenvale Goblin Scouts (0/5)' }
    ],
    rewards: { exp: 250, gold: 120, item: 'WEAPON_NOVICE_SWORD' },
    nextQuestId: 'MAIN_03'
  },
  {
    id: 'MAIN_03',
    name: 'Threat in the Whispering Woods',
    category: 'Main',
    reqLevel: 5,
    giverName: 'Captain Bryan',
    location: 'Greenvale Gate',
    description: 'Wild wolves are overrunning the outskirts. Hunt 4 Wild Wolves and report back.',
    objectives: [
      { type: 'KILL_ENEMY', targetId: 'WOLF', count: 4, current: 0, text: 'Defeat Wild Wolves (0/4)' }
    ],
    rewards: { exp: 500, gold: 250, item: 'HELMET_IRON' },
    nextQuestId: 'MAIN_04'
  },
  {
    id: 'MAIN_04',
    name: 'Sanctum of the Guardian',
    category: 'Main',
    reqLevel: 8,
    giverName: 'High Mage Valeria',
    location: 'Greenvale Academy',
    description: 'Enter the Ancient Ruins Dungeon and defeat the corrupted Forest Guardian to retrieve the First Aether Relic.',
    objectives: [
      { type: 'KILL_BOSS', targetId: 'BOSS_FOREST_GUARDIAN', count: 1, current: 0, text: 'Defeat the Forest Guardian Boss' }
    ],
    rewards: { exp: 1500, gold: 1000, item: 'AMULET_VITALITY' },
    nextQuestId: 'MAIN_05'
  },
  {
    id: 'MAIN_05',
    name: 'Journey to the Crimson Canopy',
    category: 'Main',
    reqLevel: 10,
    giverName: 'Elder Marcus',
    location: 'Greenvale Plaza',
    description: 'Travel into Region 2: Crimson Forest to investigate the spreading demonic shadow.',
    objectives: [
      { type: 'REACH_LOCATION', locationName: 'Crimson Forest Outpost', count: 1, current: 0, text: 'Enter the Crimson Forest region' }
    ],
    rewards: { exp: 2000, gold: 1500, item: 'FOOD_SPICY_STEW' }
  },

  // --- SIDE QUESTS ---
  {
    id: 'SIDE_BLACKSMITH_HELP',
    name: "Blacksmith's Secret Ore",
    category: 'Side',
    reqLevel: 3,
    giverName: 'Blacksmith Thorin',
    location: 'Greenvale Forge',
    description: 'Thorin needs 5 Iron Ores to upgrade his anvil.',
    objectives: [
      { type: 'COLLECT_ITEM', itemId: 'MAT_IRON_ORE', count: 5, current: 0, text: 'Collect Iron Ores (0/5)' }
    ],
    rewards: { exp: 300, gold: 200, item: 'MAT_AETHER_CRYSTAL' }
  },
  {
    id: 'SIDE_BOUNTY_WOLVES',
    name: 'Night Hunter Bounty',
    category: 'Bounty',
    reqLevel: 12,
    giverName: 'Bounty Board',
    location: 'Greenvale Tavern',
    description: 'Eliminate 3 Nightmare Wolves that appear under the night moon.',
    objectives: [
      { type: 'KILL_ENEMY', targetId: 'NIGHTMARE_WOLF', count: 3, current: 0, text: 'Defeat Nightmare Wolves at night (0/3)' }
    ],
    rewards: { exp: 1200, gold: 800, item: 'POTION_HP_LARGE' }
  }
];
