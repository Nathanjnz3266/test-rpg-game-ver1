export const ACHIEVEMENTS_DATABASE = [
  {
    id: 'ACH_FIRST_BLOOD',
    name: 'First Blood',
    description: 'Defeat your first enemy in Aetheria.',
    titleReward: 'Novice Adventurer',
    statBonus: { attack: 2 },
    goldReward: 100
  },
  {
    id: 'ACH_SLAYER_10',
    name: 'Monster Hunter',
    description: 'Slay 10 monsters.',
    titleReward: 'Monster Hunter',
    statBonus: { critRate: 2 },
    goldReward: 300
  },
  {
    id: 'ACH_BOSS_GUARDIAN',
    name: 'Forest Deliverer',
    description: 'Defeat the Forest Guardian Boss.',
    titleReward: 'Guardian Slayer',
    statBonus: { hp: 100, str: 5 },
    goldReward: 1000
  },
  {
    id: 'ACH_LEVEL_10',
    name: 'Rising Champion',
    description: 'Reach Character Level 10.',
    titleReward: 'The Unbreakable',
    statBonus: { vit: 5, defense: 5 },
    goldReward: 500
  },
  {
    id: 'ACH_BLACKSMITH',
    name: 'Master Craftsman',
    description: 'Upgrade any weapon to +5 or higher.',
    titleReward: 'Weapon Artisan',
    statBonus: { attackSpeed: 0.05 },
    goldReward: 800
  }
];
