// 135+ Dungeons, Raids, Trials, and Towers Database

export interface Dungeon {
  id: string;
  name: string;
  type: 'dungeon' | 'raid' | 'trial' | 'tower';
  region: string;
  difficultyLevel: number;
  recommendedLevel: number;
  minPlayers: number;
  maxPlayers: number;
  estimatedDuration: number; // minutes
  bosses: string[]; // boss IDs
  rewards: {
    experience: number;
    runes: { min: number; max: number };
    loot: string[];
  };
  description: string;
  floor?: number;
}

// ============ DUNGEONS (50 dungeons) ============
const DUNGEONS: Dungeon[] = Array.from({ length: 50 }, (_, i) => ({
  id: `dungeon_${String(i + 1).padStart(3, '0')}`,
  name: `Dungeon of Shadows ${i + 1}`,
  type: 'dungeon',
  region: ['Limgrave', 'Liurnia', 'Caelid', 'Leyndell'][i % 4],
  difficultyLevel: 1 + Math.floor(i / 5),
  recommendedLevel: 10 + i * 2,
  minPlayers: 1,
  maxPlayers: 3,
  estimatedDuration: 20 + i,
  bosses: [`boss_dungeon_${String(i + 1).padStart(3, '0')}`],
  rewards: {
    experience: 500 + i * 50,
    runes: { min: 200 + i * 20, max: 500 + i * 50 },
    loot: [`loot_dungeon_${String(i + 1).padStart(3, '0')}_1`, `loot_dungeon_${String(i + 1).padStart(3, '0')}_2`]
  },
  description: `A mysterious dungeon filled with dangers and treasures. Level ${10 + i * 2} recommended.`
}));

// ============ RAIDS (35 raids) ============
const RAIDS: Dungeon[] = Array.from({ length: 35 }, (_, i) => ({
  id: `raid_${String(i + 1).padStart(3, '0')}`,
  name: `Raid on ${['The Fallen Temple', 'Ancient Fortress', 'Corrupted Cathedral', 'Dark Citadel', 'Shattered Sanctum'][i % 5]} ${i + 1}`,
  type: 'raid',
  region: ['Mountaintops', 'Crumbling Azula', 'Leyndell', 'Mohgwyn'][i % 4],
  difficultyLevel: 3 + Math.floor(i / 7),
  recommendedLevel: 50 + i * 3,
  minPlayers: 4,
  maxPlayers: 8,
  estimatedDuration: 45 + i * 2,
  bosses: [
    `boss_raid_${String(i + 1).padStart(3, '0')}_1`,
    `boss_raid_${String(i + 1).padStart(3, '0')}_2`,
    `boss_raid_${String(i + 1).padStart(3, '0')}_3`
  ],
  rewards: {
    experience: 2000 + i * 200,
    runes: { min: 2000 + i * 200, max: 5000 + i * 500 },
    loot: [
      `loot_raid_${String(i + 1).padStart(3, '0')}_1`,
      `loot_raid_${String(i + 1).padStart(3, '0')}_2`,
      `loot_raid_${String(i + 1).padStart(3, '0')}_3`
    ]
  },
  description: `A challenging raid encounter requiring group coordination. Level ${50 + i * 3} recommended.`
}));

// ============ TRIALS (30 trials) ============
const TRIALS: Dungeon[] = Array.from({ length: 30 }, (_, i) => ({
  id: `trial_${String(i + 1).padStart(3, '0')}`,
  name: `Trial of ${['Strength', 'Cunning', 'Magic', 'Faith', 'Endurance'][i % 5]} ${i + 1}`,
  type: 'trial',
  region: ['Leyndell', 'Raya Lucaria', 'Farum Azula', 'Elphael'][i % 4],
  difficultyLevel: 2 + Math.floor(i / 10),
  recommendedLevel: 35 + i * 2,
  minPlayers: 1,
  maxPlayers: 4,
  estimatedDuration: 30 + i,
  bosses: [`boss_trial_${String(i + 1).padStart(3, '0')}`],
  rewards: {
    experience: 1000 + i * 100,
    runes: { min: 1000 + i * 100, max: 3000 + i * 300 },
    loot: [`loot_trial_${String(i + 1).padStart(3, '0')}_reward`]
  },
  description: `A trial testing your ${['strength', 'cunning', 'magic', 'faith', 'endurance'][i % 5]}. Level ${35 + i * 2} recommended.`
}));

// ============ TOWERS (20 towers with multiple floors) ============
const TOWERS: Dungeon[] = Array.from({ length: 20 }, (_, i) => ({
  id: `tower_${String(i + 1).padStart(2, '0')}`,
  name: `Tower of ${['Ascension', 'Trials', 'Shadows', 'Storms', 'Stars'][i % 5]} ${i + 1}`,
  type: 'tower',
  region: ['Limgrave', 'Liurnia', 'Caelid', 'Mountaintops'][i % 4],
  difficultyLevel: 1 + Math.floor(i / 4),
  recommendedLevel: 20 + i * 3,
  minPlayers: 1,
  maxPlayers: 2,
  estimatedDuration: 60 + i * 5,
  bosses: Array.from({ length: 5 }, (_, f) => `boss_tower_${String(i + 1).padStart(2, '0')}_floor_${f + 1}`),
  rewards: {
    experience: 3000 + i * 500,
    runes: { min: 3000 + i * 300, max: 8000 + i * 1000 },
    loot: Array.from({ length: 5 }, (_, f) => `loot_tower_${String(i + 1).padStart(2, '0')}_floor_${f + 1}`)
  },
  description: `A towering structure with ${5} floors of increasingly difficult challenges. Level ${20 + i * 3} recommended.`,
  floor: 5
}));

// ============ SPECIAL DUNGEONS ============
const SPECIAL_DUNGEONS: Dungeon[] = [
  {
    id: 'dungeon_special_001',
    name: 'The Eternal Abyss',
    type: 'dungeon',
    region: 'Deeproot Depths',
    difficultyLevel: 10,
    recommendedLevel: 100,
    minPlayers: 1,
    maxPlayers: 4,
    estimatedDuration: 120,
    bosses: ['boss_abyss_final'],
    rewards: {
      experience: 10000,
      runes: { min: 10000, max: 25000 },
      loot: ['legendary_weapon_abyss', 'mythic_armor_abyss']
    },
    description: 'The final ultimate dungeon, a test of all your skills.'
  },
];

// Export all dungeons and instances
export const DUNGEONS_AND_INSTANCES = {
  dungeons: DUNGEONS,
  raids: RAIDS,
  trials: TRIALS,
  towers: TOWERS,
  special: SPECIAL_DUNGEONS,
};

// ============ BOSS DATABASE (438+ bosses) ============

export interface Boss {
  id: string;
  name: string;
  type: 'standard' | 'elite' | 'legendary' | 'mythic';
  region: string;
  level: number;
  health: number;
  damage: number;
  defense: number;
  abilities: string[];
  phases?: number; // multi-phase bosses
  resistances: {
    physical?: number;
    fire?: number;
    lightning?: number;
    holy?: number;
    magic?: number;
    bleed?: number;
    rot?: number;
  };
  weaknesses: {
    physical?: number;
    fire?: number;
    lightning?: number;
    holy?: number;
    magic?: number;
    bleed?: number;
  };
  rewards: {
    experience: number;
    runes: number;
    drops: string[];
  };
  description: string;
}

// ============ STANDARD BOSSES (150 standard bosses) ============
const STANDARD_BOSSES: Boss[] = Array.from({ length: 150 }, (_, i) => ({
  id: `boss_standard_${String(i + 1).padStart(3, '0')}`,
  name: `Standard Boss ${i + 1}`,
  type: 'standard',
  region: ['Limgrave', 'Liurnia', 'Caelid', 'Leyndell', 'Mountaintops'][i % 5],
  level: 10 + i,
  health: 200 + i * 30,
  damage: 20 + i,
  defense: 15 + Math.floor(i / 3),
  abilities: [
    `ability_${String(Math.floor(i / 10) + 1).padStart(2, '0')}`,
    `ability_${String(Math.floor(i / 5) + 1).padStart(2, '0')}`
  ],
  phases: 1,
  resistances: {
    physical: 5 + Math.floor(i / 10),
    fire: Math.floor(i / 15),
  },
  weaknesses: {
    lightning: 10 + Math.floor(i / 8),
  },
  rewards: {
    experience: 500 + i * 50,
    runes: 300 + i * 30,
    drops: [`drop_${String(i + 1).padStart(3, '0')}_1`, `drop_${String(i + 1).padStart(3, '0')}_2`]
  },
  description: `A standard boss encounter. Level ${10 + i} challenge.`
}));

// ============ ELITE BOSSES (150 elite bosses) ============
const ELITE_BOSSES: Boss[] = Array.from({ length: 150 }, (_, i) => ({
  id: `boss_elite_${String(i + 1).padStart(3, '0')}`,
  name: `Elite Champion ${i + 1}`,
  type: 'elite',
  region: ['Liurnia', 'Caelid', 'Leyndell', 'Mountaintops', 'Crumbling Azula'][i % 5],
  level: 40 + i * 1.5,
  health: 500 + i * 100,
  damage: 50 + i * 1.5,
  defense: 40 + Math.floor(i / 2),
  abilities: Array.from({ length: 3 }, (_, j) => `elite_ability_${i}_${j}`),
  phases: 2,
  resistances: {
    physical: 15 + Math.floor(i / 5),
    fire: 10 + Math.floor(i / 8),
    magic: 8 + Math.floor(i / 10),
  },
  weaknesses: {
    holy: 15 + Math.floor(i / 5),
    bleed: 10 + Math.floor(i / 8),
  },
  rewards: {
    experience: 2000 + i * 200,
    runes: 1500 + i * 150,
    drops: [
      `elite_drop_${String(i + 1).padStart(3, '0')}_1`,
      `elite_drop_${String(i + 1).padStart(3, '0')}_2`,
      `elite_drop_${String(i + 1).padStart(3, '0')}_3`
    ]
  },
  description: `An elite boss with powerful abilities. Level ${Math.floor(40 + i * 1.5)} challenge.`
}));

// ============ LEGENDARY BOSSES (88 legendary bosses) ============
const LEGENDARY_BOSSES: Boss[] = Array.from({ length: 88 }, (_, i) => ({
  id: `boss_legendary_${String(i + 1).padStart(2, '0')}`,
  name: `Legendary ${['Archon', 'Titan', 'Destroyer', 'Sovereign', 'Eternal'][i % 5]} ${i + 1}`,
  type: 'legendary',
  region: ['Leyndell', 'Mountaintops', 'Crumbling Azula', 'Lake of Rot', 'Elphael'][i % 5],
  level: 80 + i,
  health: 1500 + i * 300,
  damage: 100 + i * 3,
  defense: 80 + Math.floor(i / 2),
  abilities: Array.from({ length: 5 }, (_, j) => `legendary_ability_${i}_${j}`),
  phases: 3,
  resistances: {
    physical: 30 + Math.floor(i / 3),
    fire: 25 + Math.floor(i / 4),
    lightning: 25 + Math.floor(i / 4),
    holy: 20 + Math.floor(i / 5),
    magic: 20 + Math.floor(i / 5),
  },
  weaknesses: {
    scarlet_rot: 30,
    bleed: 25,
  },
  rewards: {
    experience: 5000 + i * 500,
    runes: 5000 + i * 500,
    drops: Array.from({ length: 4 }, (_, j) => `legendary_drop_${String(i + 1).padStart(2, '0')}_${j + 1}`)
  },
  description: `A legendary boss of immense power. Level ${80 + i} endgame content.`
}));

// ============ MYTHIC BOSSES (50 mythic bosses) ============
const MYTHIC_BOSSES: Boss[] = Array.from({ length: 50 }, (_, i) => ({
  id: `boss_mythic_${String(i + 1).padStart(2, '0')}`,
  name: `Mythic ${['Elden Beast', 'Ancient God', 'Void Entity', 'Cosmic Horror', 'Ultimate Evil'][i % 5]} ${i + 1}`,
  type: 'mythic',
  region: ['Deeproot Depths', 'The Erdtree', 'Farum Azula', 'The Frenzied Flame', 'Outer Realms'][i % 5],
  level: 120 + i,
  health: 5000 + i * 1000,
  damage: 150 + i * 5,
  defense: 120 + i,
  abilities: Array.from({ length: 7 }, (_, j) => `mythic_ability_${i}_${j}`),
  phases: 5,
  resistances: {
    physical: 50 + Math.floor(i / 2),
    fire: 40 + Math.floor(i / 3),
    lightning: 40 + Math.floor(i / 3),
    holy: 50 + Math.floor(i / 2),
    magic: 50 + Math.floor(i / 2),
    bleed: 30 + Math.floor(i / 4),
    rot: 30 + Math.floor(i / 4),
  },
  weaknesses: {},
  rewards: {
    experience: 10000 + i * 1000,
    runes: 10000 + i * 1000,
    drops: Array.from({ length: 5 }, (_, j) => `mythic_drop_${String(i + 1).padStart(2, '0')}_${j + 1}`)
  },
  description: `A mythic tier boss, ultimate endgame challenge. Level ${120 + i}+.`
}));

// Export all bosses
export const BOSSES = {
  standard: STANDARD_BOSSES,
  elite: ELITE_BOSSES,
  legendary: LEGENDARY_BOSSES,
  mythic: MYTHIC_BOSSES,
};

// Total bosses: 438
// Total dungeons/raids/trials/towers: 135
