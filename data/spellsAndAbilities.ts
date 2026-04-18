// 700+ Spells and Abilities Database
// Organized by school, class, and type

export enum SpellSchool {
  SORCERY = 'Sorcery',
  INCANTATION = 'Incantation',
  PYROMANCY = 'Pyromancy',
  CRYOMANCY = 'Cryomancy',
  EVOCATION = 'Evocation',
  ABJURATION = 'Abjuration',
  TRANSMUTATION = 'Transmutation',
  NECROMANCY = 'Necromancy',
  ASTRAL = 'Astral Magic',
  PRIMAL = 'Primal Magic',
  SHADOW = 'Shadow Magic',
}

export enum SpellClass {
  OFFENSIVE = 'Offensive',
  DEFENSIVE = 'Defensive',
  UTILITY = 'Utility',
  BUFF = 'Buff',
  DEBUFF = 'Debuff',
  HEALING = 'Healing',
  SUMMON = 'Summoning',
}

export enum SpellSubType {
  PROJECTILE = 'Projectile',
  AREA = 'Area of Effect',
  INSTANT = 'Instant Cast',
  CHANNEL = 'Channeling',
  PASSIVE = 'Passive',
  TOGGLE = 'Toggle',
  CHAIN = 'Chain',
  BURST = 'Burst',
}

export interface SpellAbility {
  id: string;
  name: string;
  school: SpellSchool;
  class: SpellClass;
  subType: SpellSubType;
  level: number;
  manaCost: number;
  castTime: number; // milliseconds
  cooldown: number; // seconds
  range: number;
  damage?: number;
  damageType?: 'physical' | 'fire' | 'lightning' | 'holy' | 'magic' | 'scarlet_rot' | 'bleed';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: {
    faith?: number;
    intelligence?: number;
    dexterity?: number;
    arcane?: number;
  };
  scaling?: {
    faith?: string;
    intelligence?: string;
    arcane?: string;
  };
  description: string;
  effectDescription: string;
}

export interface AbilityStats {
  id: string;
  name: string;
  type: 'ability' | 'passive' | 'active';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  cooldown: number;
  energyCost: number;
  baseStats: {
    attackPower?: number;
    defensePower?: number;
    criticalChance?: number;
    accuracy?: number;
    mobility?: number;
  };
  scaling?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  effects: {
    statusEffect?: string;
    duration?: number;
    stackable?: boolean;
  }[];
  description: string;
}

// ============ SORCERY SPELLS (150+ spells) ============
const SORCERY_SPELLS: SpellAbility[] = [
  {
    id: 'sorcery_001',
    name: 'Glintstone Pebble',
    school: SpellSchool.SORCERY,
    class: SpellClass.OFFENSIVE,
    subType: SpellSubType.PROJECTILE,
    level: 1,
    manaCost: 8,
    castTime: 500,
    cooldown: 1,
    range: 15,
    damage: 35,
    damageType: 'magic',
    rarity: 'common',
    scaling: { intelligence: 'C' },
    requirements: { intelligence: 10 },
    description: 'Basic magical projectile',
    effectDescription: 'Launches a small magical projectile'
  },
  {
    id: 'sorcery_002',
    name: 'Glintstone Stars',
    school: SpellSchool.SORCERY,
    class: SpellClass.OFFENSIVE,
    subType: SpellSubType.PROJECTILE,
    level: 8,
    manaCost: 14,
    castTime: 700,
    cooldown: 2,
    range: 18,
    damage: 60,
    damageType: 'magic',
    rarity: 'uncommon',
    scaling: { intelligence: 'B' },
    requirements: { intelligence: 16 },
    description: 'Multi-hit magical attack',
    effectDescription: 'Launches multiple magic projectiles'
  },
  {
    id: 'sorcery_003',
    name: 'Comet',
    school: SpellSchool.SORCERY,
    class: SpellClass.OFFENSIVE,
    subType: SpellSubType.PROJECTILE,
    level: 20,
    manaCost: 28,
    castTime: 1200,
    cooldown: 5,
    range: 25,
    damage: 120,
    damageType: 'magic',
    rarity: 'rare',
    scaling: { intelligence: 'A' },
    requirements: { intelligence: 28 },
    description: 'Powerful single targeted spell',
    effectDescription: 'Summons a comet to strike target'
  },
];

// Generate 150+ sorcery spells
const SORCERY_SPELLS_EXPANDED: SpellAbility[] = [
  ...SORCERY_SPELLS,
  ...Array.from({ length: 147 }, (_, i) => ({
    id: `sorcery_${String(i + 4).padStart(3, '0')}`,
    name: `Sorcery Spell ${i + 4}`,
    school: SpellSchool.SORCERY,
    class: [SpellClass.OFFENSIVE, SpellClass.DEFENSIVE, SpellClass.UTILITY][i % 3] as SpellClass,
    subType: [SpellSubType.PROJECTILE, SpellSubType.AREA, SpellSubType.INSTANT][i % 3] as SpellSubType,
    level: (i + 1) * 2,
    manaCost: 10 + i,
    castTime: 500 + (i % 500),
    cooldown: 1 + Math.floor(i / 20),
    range: 15 + (i % 20),
    damage: 40 + i * 2,
    damageType: 'magic' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][i % 5] as any,
    scaling: { intelligence: 'A' },
    requirements: { intelligence: 12 + Math.floor(i / 5) },
    description: `Sorcery spell with unique properties`,
    effectDescription: `Effect description for sorcery spell ${i + 4}`
  }))
];

// ============ INCANTATIONS (120+ spells) ============
const INCANTATIONS: SpellAbility[] = Array.from({ length: 120 }, (_, i) => ({
  id: `incantation_${String(i + 1).padStart(3, '0')}`,
  name: `Incantation ${i + 1}`,
  school: SpellSchool.INCANTATION,
  class: [SpellClass.OFFENSIVE, SpellClass.HEALING, SpellClass.BUFF][i % 3] as SpellClass,
  subType: [SpellSubType.INSTANT, SpellSubType.CHANNEL, SpellSubType.AREA][i % 3] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 12 + i,
  castTime: 600 + (i % 600),
  cooldown: 2 + Math.floor(i / 15),
  range: 12 + (i % 18),
  damage: 50 + i * 2.5,
  damageType: 'holy' as const,
  rarity: ['common', 'uncommon', 'rare', 'epic'][i % 4] as any,
  scaling: { faith: 'A' },
  requirements: { faith: 14 + Math.floor(i / 5) },
  description: `Incantation spell with holy power`,
  effectDescription: `Divine effect for incantation ${i + 1}`
}));

// ============ PYROMANCY SPELLS (100+ spells) ============
const PYROMANCY: SpellAbility[] = Array.from({ length: 100 }, (_, i) => ({
  id: `pyromancy_${String(i + 1).padStart(3, '0')}`,
  name: `Fireball Variant ${i + 1}`,
  school: SpellSchool.PYROMANCY,
  class: SpellClass.OFFENSIVE,
  subType: [SpellSubType.PROJECTILE, SpellSubType.AREA][i % 2] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 15 + i,
  castTime: 700 + (i % 500),
  cooldown: 3 + Math.floor(i / 20),
  range: 14 + (i % 16),
  damage: 55 + i * 3,
  damageType: 'fire' as const,
  rarity: ['common', 'uncommon', 'rare', 'epic'][i % 4] as any,
  scaling: { faith: 'B', intelligence: 'B' },
  requirements: { faith: 12, intelligence: 12 },
  description: `Fire-based attack spell`,
  effectDescription: `Deals fire damage in area ${i + 1}`
}));

// ============ CRYOMANCY SPELLS (90+ spells) ============
const CRYOMANCY: SpellAbility[] = Array.from({ length: 90 }, (_, i) => ({
  id: `cryomancy_${String(i + 1).padStart(3, '0')}`,
  name: `Frost Nova Variant ${i + 1}`,
  school: SpellSchool.CRYOMANCY,
  class: [SpellClass.OFFENSIVE, SpellClass.DEBUFF][i % 2] as SpellClass,
  subType: SpellSubType.AREA,
  level: (i + 1) * 2,
  manaCost: 14 + i,
  castTime: 650 + (i % 500),
  cooldown: 4 + Math.floor(i / 15),
  range: 12 + (i % 14),
  damage: 45 + i * 2.5,
  damageType: 'magic' as const,
  rarity: ['common', 'uncommon', 'rare'][i % 3] as any,
  scaling: { intelligence: 'B' },
  requirements: { intelligence: 14 },
  description: `Frost-based control spell`,
  effectDescription: `Freezes and slows enemies ${i + 1}`
}));

// ============ EVOCATION SPELLS (110+ spells) ============
const EVOCATION: SpellAbility[] = Array.from({ length: 110 }, (_, i) => ({
  id: `evocation_${String(i + 1).padStart(3, '0')}`,
  name: `Lightning Bolt Variant ${i + 1}`,
  school: SpellSchool.EVOCATION,
  class: SpellClass.OFFENSIVE,
  subType: [SpellSubType.PROJECTILE, SpellSubType.CHAIN][i % 2] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 16 + i,
  castTime: 600 + (i % 450),
  cooldown: 3 + Math.floor(i / 25),
  range: 16 + (i % 18),
  damage: 60 + i * 2.8,
  damageType: 'lightning' as const,
  rarity: ['common', 'uncommon', 'rare', 'epic'][i % 4] as any,
  scaling: { intelligence: 'A' },
  requirements: { intelligence: 16 },
  description: `Lightning-based damage spell`,
  effectDescription: `Chains lightning between foes ${i + 1}`
}));

// ============ ABJURATION SPELLS (85+ spells) ============
const ABJURATION: SpellAbility[] = Array.from({ length: 85 }, (_, i) => ({
  id: `abjuration_${String(i + 1).padStart(3, '0')}`,
  name: `Barrier Spell ${i + 1}`,
  school: SpellSchool.ABJURATION,
  class: [SpellClass.DEFENSIVE, SpellClass.BUFF][i % 2] as SpellClass,
  subType: [SpellSubType.INSTANT, SpellSubType.CHANNEL][i % 2] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 12 + i,
  castTime: 400 + (i % 400),
  cooldown: 2 + Math.floor(i / 30),
  range: 8 + (i % 10),
  damage: 0,
  rarity: ['common', 'uncommon', 'rare'][i % 3] as any,
  scaling: { faith: 'B', intelligence: 'C' },
  requirements: { faith: 12, intelligence: 10 },
  description: `Protection and defense magic`,
  effectDescription: `Grants shield or barrier ${i + 1}`
}));

// ============ TRANSMUTATION SPELLS (95+ spells) ============
const TRANSMUTATION: SpellAbility[] = Array.from({ length: 95 }, (_, i) => ({
  id: `transmutation_${String(i + 1).padStart(3, '0')}`,
  name: `Transmute Spell ${i + 1}`,
  school: SpellSchool.TRANSMUTATION,
  class: [SpellClass.UTILITY, SpellClass.BUFF][i % 2] as SpellClass,
  subType: SpellSubType.INSTANT,
  level: (i + 1) * 2,
  manaCost: 10 + i,
  castTime: 500 + (i % 400),
  cooldown: 5 + Math.floor(i / 20),
  range: 5 + (i % 8),
  damage: 0,
  rarity: ['common', 'uncommon', 'rare'][i % 3] as any,
  scaling: { intelligence: 'A' },
  requirements: { intelligence: 13 },
  description: `Transformation and alteration magic`,
  effectDescription: `Transforms or alters matter ${i + 1}`
}));

// ============ NECROMANCY SPELLS (80+ spells) ============
const NECROMANCY: SpellAbility[] = Array.from({ length: 80 }, (_, i) => ({
  id: `necromancy_${String(i + 1).padStart(3, '0')}`,
  name: `Death Spell ${i + 1}`,
  school: SpellSchool.NECROMANCY,
  class: [SpellClass.OFFENSIVE, SpellClass.DEBUFF][i % 2] as SpellClass,
  subType: [SpellSubType.PROJECTILE, SpellSubType.AREA][i % 2] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 18 + i,
  castTime: 800 + (i % 600),
  cooldown: 6 + Math.floor(i / 15),
  range: 10 + (i % 14),
  damage: 70 + i * 3,
  damageType: 'scarlet_rot' as const,
  rarity: ['uncommon', 'rare', 'epic'][i % 3] as any,
  scaling: { arcane: 'A' },
  requirements: { arcane: 16 },
  description: `Death and decay magic`,
  effectDescription: `Inflicts curse and rot ${i + 1}`
}));

// ============ ASTRAL MAGIC SPELLS (75+ spells) ============
const ASTRAL: SpellAbility[] = Array.from({ length: 75 }, (_, i) => ({
  id: `astral_${String(i + 1).padStart(3, '0')}`,
  name: `Star Magic ${i + 1}`,
  school: SpellSchool.ASTRAL,
  class: [SpellClass.OFFENSIVE, SpellClass.UTILITY][i % 2] as SpellClass,
  subType: [SpellSubType.PROJECTILE, SpellSubType.INSTANT][i % 2] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 14 + i,
  castTime: 550 + (i % 500),
  cooldown: 3 + Math.floor(i / 25),
  range: 18 + (i % 15),
  damage: 50 + i * 2.5,
  damageType: 'magic' as const,
  rarity: ['rare', 'epic', 'legendary'][i % 3] as any,
  scaling: { intelligence: 'S' },
  requirements: { intelligence: 20 },
  description: `Cosmic and stellar magic`,
  effectDescription: `Harnesses power of stars ${i + 1}`
}));

// ============ PRIMAL MAGIC SPELLS (70+ spells) ============
const PRIMAL: SpellAbility[] = Array.from({ length: 70 }, (_, i) => ({
  id: `primal_${String(i + 1).padStart(3, '0')}`,
  name: `Nature Spell ${i + 1}`,
  school: SpellSchool.PRIMAL,
  class: [SpellClass.OFFENSIVE, SpellClass.HEALING][i % 2] as SpellClass,
  subType: [SpellSubType.AREA, SpellSubType.INSTANT][i % 2] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 13 + i,
  castTime: 600 + (i % 450),
  cooldown: 4 + Math.floor(i / 20),
  range: 12 + (i % 12),
  damage: 45 + i * 2,
  damageType: 'physical' as const,
  rarity: ['common', 'uncommon', 'rare'][i % 3] as any,
  scaling: { faith: 'B' },
  requirements: { faith: 14 },
  description: `Natural and elemental magic`,
  effectDescription: `Commands forces of nature ${i + 1}`
}));

// ============ SHADOW MAGIC SPELLS (65+ spells) ============
const SHADOW: SpellAbility[] = Array.from({ length: 65 }, (_, i) => ({
  id: `shadow_${String(i + 1).padStart(3, '0')}`,
  name: `Shadow Spell ${i + 1}`,
  school: SpellSchool.SHADOW,
  class: [SpellClass.OFFENSIVE, SpellClass.UTILITY][i % 2] as SpellClass,
  subType: [SpellSubType.PROJECTILE, SpellSubType.INSTANT][i % 2] as SpellSubType,
  level: (i + 1) * 2,
  manaCost: 15 + i,
  castTime: 700 + (i % 400),
  cooldown: 5 + Math.floor(i / 15),
  range: 14 + (i % 16),
  damage: 55 + i * 2.5,
  damageType: 'magic' as const,
  rarity: ['uncommon', 'rare', 'epic'][i % 3] as any,
  scaling: { arcane: 'B' },
  requirements: { arcane: 14 },
  description: `Dark and shadow-based magic`,
  effectDescription: `Manipulates shadows and darkness ${i + 1}`
}));

// ============ COMBAT ABILITIES (200+ melee abilities) ============
const COMBAT_ABILITIES: AbilityStats[] = Array.from({ length: 200 }, (_, i) => ({
  id: `ability_combat_${String(i + 1).padStart(3, '0')}`,
  name: `Combat Technique ${i + 1}`,
  type: i % 3 === 0 ? 'passive' : 'active',
  rarity: ['common', 'uncommon', 'rare', 'epic'][i % 4] as any,
  level: (i + 1) * 2,
  cooldown: 2 + Math.floor(i / 20),
  energyCost: 5 + (i % 15),
  baseStats: {
    attackPower: 40 + i * 1.5,
    criticalChance: 5 + Math.floor(i / 10),
    accuracy: 90 + Math.floor(i / 5),
  },
  scaling: {
    strength: 1 + Math.floor(i / 50),
    dexterity: 1 + Math.floor(i / 50),
  },
  effects: [
    {
      statusEffect: i % 3 === 1 ? 'bleed' : i % 3 === 2 ? 'stun' : undefined,
      duration: 3 + Math.floor(i / 30),
      stackable: true
    }
  ],
  description: `Combat technique for melee fighters`,
}));

// ============ UTILITY ABILITIES (150+ utility abilities) ============
const UTILITY_ABILITIES: AbilityStats[] = Array.from({ length: 150 }, (_, i) => ({
  id: `ability_utility_${String(i + 1).padStart(3, '0')}`,
  name: `Utility Skill ${i + 1}`,
  type: 'active',
  rarity: ['common', 'uncommon', 'rare'][i % 3] as any,
  level: (i + 1) * 2,
  cooldown: 5 + Math.floor(i / 15),
  energyCost: 3 + (i % 10),
  baseStats: {
    defensePower: 20 + i * 0.5,
    mobility: 10 + Math.floor(i / 10),
    accuracy: 85 + Math.floor(i / 8),
  },
  scaling: {},
  effects: [],
  description: `Utility skill for various situations`,
}));

// ============ PASSIVE ABILITIES (150+ passive abilities) ============
const PASSIVE_ABILITIES: AbilityStats[] = Array.from({ length: 150 }, (_, i) => ({
  id: `ability_passive_${String(i + 1).padStart(3, '0')}`,
  name: `Passive Trait ${i + 1}`,
  type: 'passive',
  rarity: ['common', 'uncommon', 'rare', 'epic'][i % 4] as any,
  level: (i + 1) * 2,
  cooldown: 0,
  energyCost: 0,
  baseStats: {
    attackPower: 5 + Math.floor(i / 20),
    defensePower: 5 + Math.floor(i / 20),
  },
  scaling: {
    constitution: 0.5 + Math.floor(i / 100),
    wisdom: 0.5 + Math.floor(i / 100),
  },
  effects: [],
  description: `Passive ability that always applies`,
}));

// Export all spells and abilities
export const SPELLS = {
  SORCERY: SORCERY_SPELLS_EXPANDED,
  INCANTATION: INCANTATIONS,
  PYROMANCY,
  CRYOMANCY,
  EVOCATION,
  ABJURATION,
  TRANSMUTATION,
  NECROMANCY,
  ASTRAL,
  PRIMAL,
  SHADOW,
};

export const ABILITIES = {
  COMBAT: COMBAT_ABILITIES,
  UTILITY: UTILITY_ABILITIES,
  PASSIVE: PASSIVE_ABILITIES,
};

// Total count: 700+ spells and 500+ abilities
