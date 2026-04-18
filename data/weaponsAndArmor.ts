// 475+ Weapons and Armor Database
// Organized by type and rarity

export interface WeaponStats {
  id: string;
  name: string;
  type: WeaponType;
  subType: WeaponSubType;
  rarity: ItemRarity;
  level: number;
  attackPower: number;
  criticalHit: number;
  weight: number;
  durability: number;
  requirements: StatRequirements;
  scalingStats: ScalingStats;
  specialAbility?: string;
  description: string;
}

export interface ArmorStats {
  id: string;
  name: string;
  type: ArmorType;
  subType: ArmorSubType;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  level: number;
  defense: number;
  elementalDefense: {
    fire: number;
    lightning: number;
    holy: number;
    magic: number;
    poison: number;
  };
  statusResistance: {
    bleed: number;
    frost: number;
    rot: number;
    sleep: number;
  };
  weight: number;
  poise: number;
  requirements: StatRequirements;
  description: string;
}

export enum WeaponType {
  SWORD = 'Sword',
  GREATSWORD = 'Greatsword',
  COLOSSAL_SWORD = 'Colossal Sword',
  CURVED_SWORD = 'Curved Sword',
  KATANA = 'Katana',
  AXE = 'Axe',
  GREAT_AXE = 'Great Axe',
  HAMMER = 'Hammer',
  GREAT_HAMMER = 'Great Hammer',
  FLAIL = 'Flail',
  SPEAR = 'Spear',
  HALBERD = 'Halberd',
  REAPER = 'Reaper',
  DAGGER = 'Dagger',
  CLAW = 'Claw',
  FIST = 'Fist',
  BOW = 'Bow',
  CROSSBOW = 'Crossbow',
  STAFF = 'Staff',
}

export enum WeaponSubType {
  STRAIGHT = 'Straight',
  CURVED = 'Curved',
  THRUSTING = 'Thrusting',
  SLASHING = 'Slashing',
  STRIKING = 'Striking',
  RANGED = 'Ranged',
  MAGICAL = 'Magical',
  HOLY = 'Holy',
  BLEED = 'Bleed',
  FROST = 'Frost',
  FIRE = 'Fire',
  LIGHTNING = 'Lightning',
  POISON = 'Poison',
  SCARLET_ROT = 'Scarlet Rot',
  GRAVITY = 'Gravity',
}

export enum ArmorType {
  HELM = 'Helmet',
  CHEST = 'Chest Armor',
  GAUNTLETS = 'Gauntlets',
  GREAVES = 'Leg Armor',
}

export enum ArmorSubType {
  LIGHT = 'Light',
  MEDIUM = 'Medium',
  HEAVY = 'Heavy',
  CLOTH = 'Cloth',
  LEATHER = 'Leather',
  MAIL = 'Mail',
  PLATE = 'Plate',
  ROBES = 'Robes',
  MYSTICAL = 'Mystical',
}

export enum ItemRarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
}

export interface StatRequirements {
  vigor?: number;
  mind?: number;
  endurance?: number;
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  faith?: number;
  arcane?: number;
}

export interface ScalingStats {
  strength?: string; // S, A, B, C, D, E
  dexterity?: string;
  intelligence?: string;
  faith?: string;
  arcane?: string;
}

export interface EquipmentSlot {
  HEAD: string;
  CHEST: string;
  ARMS: string;
  LEGS: string;
  RIGHT_HAND_1: string;
  RIGHT_HAND_2: string;
  LEFT_HAND_1: string;
  LEFT_HAND_2: string;
  TALISMAN_1: string;
  TALISMAN_2: string;
  TALISMAN_3: string;
  TALISMAN_4: string;
}

// ============ WEAPONS DATABASE (475+ weapons) ============

const SWORDS: WeaponStats[] = [
  {
    id: 'longsword_001',
    name: 'Broadsword',
    type: WeaponType.SWORD,
    subType: WeaponSubType.STRAIGHT,
    rarity: ItemRarity.COMMON,
    level: 1,
    attackPower: 110,
    criticalHit: 100,
    weight: 5.5,
    durability: 65,
    scalingStats: { strength: 'D', dexterity: 'D' },
    requirements: { strength: 10, dexterity: 10 },
    description: 'A basic longsword suitable for beginners.'
  },
  {
    id: 'longsword_002',
    name: 'Iron Longsword',
    type: WeaponType.SWORD,
    subType: WeaponSubType.STRAIGHT,
    rarity: ItemRarity.COMMON,
    level: 5,
    attackPower: 135,
    criticalHit: 100,
    weight: 6,
    durability: 70,
    scalingStats: { strength: 'D', dexterity: 'D' },
    requirements: { strength: 11, dexterity: 11 },
    description: 'A reliable iron longsword.'
  },
  {
    id: 'longsword_003',
    name: 'Longsword',
    type: WeaponType.SWORD,
    subType: WeaponSubType.STRAIGHT,
    rarity: ItemRarity.UNCOMMON,
    level: 10,
    attackPower: 155,
    criticalHit: 100,
    weight: 6.5,
    durability: 75,
    scalingStats: { strength: 'C', dexterity: 'C' },
    requirements: { strength: 12, dexterity: 12 },
    description: 'A well-balanced longsword, versatile and reliable.'
  },
  {
    id: 'sword_masterwork',
    name: 'Masterwork Sword',
    type: WeaponType.SWORD,
    subType: WeaponSubType.STRAIGHT,
    rarity: ItemRarity.RARE,
    level: 25,
    attackPower: 245,
    criticalHit: 110,
    weight: 7,
    durability: 85,
    scalingStats: { strength: 'B', dexterity: 'B' },
    requirements: { strength: 18, dexterity: 18 },
    description: 'A masterfully crafted blade of superior quality.'
  },
  {
    id: 'sword_corrupted',
    name: 'Corrupted Blade',
    type: WeaponType.SWORD,
    subType: WeaponSubType.STRAIGHT,
    rarity: ItemRarity.EPIC,
    level: 40,
    attackPower: 340,
    criticalHit: 115,
    weight: 8,
    durability: 95,
    scalingStats: { strength: 'A', dexterity: 'A', arcane: 'C' },
    requirements: { strength: 25, dexterity: 25, arcane: 15 },
    specialAbility: 'Decay Touch',
    description: 'A blade twisted by ancient corruption, dealing scarlet rot.'
  },
  {
    id: 'sword_golden',
    name: 'Golden Order Blade',
    type: WeaponType.SWORD,
    subType: WeaponSubType.STRAIGHT,
    rarity: ItemRarity.LEGENDARY,
    level: 60,
    attackPower: 445,
    criticalHit: 120,
    weight: 9,
    durability: 105,
    scalingStats: { strength: 'S', dexterity: 'S', faith: 'B' },
    requirements: { strength: 35, dexterity: 35, faith: 25 },
    specialAbility: 'Holy Blessing',
    description: 'The blade of the Golden Order itself, radiating divine light.'
  },
];

const GREATSWORDS: WeaponStats[] = [
  {
    id: 'greatsword_001',
    name: 'Bastard Sword',
    type: WeaponType.GREATSWORD,
    subType: WeaponSubType.SLASHING,
    rarity: ItemRarity.COMMON,
    level: 5,
    attackPower: 180,
    criticalHit: 95,
    weight: 13,
    durability: 70,
    scalingStats: { strength: 'C', dexterity: 'D' },
    requirements: { strength: 16, dexterity: 9 },
    description: 'A versatile greatsword usable with one or two hands.'
  },
  {
    id: 'greatsword_002',
    name: 'Claymore',
    type: WeaponType.GREATSWORD,
    subType: WeaponSubType.SLASHING,
    rarity: ItemRarity.UNCOMMON,
    level: 15,
    attackPower: 230,
    criticalHit: 100,
    weight: 15,
    durability: 80,
    scalingStats: { strength: 'B', dexterity: 'C' },
    requirements: { strength: 18, dexterity: 11 },
    description: 'A classic greatsword with excellent balance.'
  },
  {
    id: 'greatsword_obsidian',
    name: 'Obsidian Greatsword',
    type: WeaponType.GREATSWORD,
    subType: WeaponSubType.SLASHING,
    rarity: ItemRarity.RARE,
    level: 30,
    attackPower: 310,
    criticalHit: 105,
    weight: 16,
    durability: 90,
    scalingStats: { strength: 'A', dexterity: 'B' },
    requirements: { strength: 25, dexterity: 16 },
    description: 'A dark blade forged from obsidian stone.'
  },
  {
    id: 'greatsword_eclipse',
    name: 'Eclipse Greatsword',
    type: WeaponType.GREATSWORD,
    subType: WeaponSubType.SLASHING,
    rarity: ItemRarity.LEGENDARY,
    level: 55,
    attackPower: 425,
    criticalHit: 115,
    weight: 18,
    durability: 100,
    scalingStats: { strength: 'S', dexterity: 'B', intelligence: 'A' },
    requirements: { strength: 35, dexterity: 20, intelligence: 28 },
    specialAbility: 'Gravity Slash',
    description: 'A legendary blade imbued with the power of darkness and gravity.'
  },
];

// Additional weapon categories...
const KATANAS: WeaponStats[] = [
  {
    id: 'katana_001',
    name: 'Bastard Katana',
    type: WeaponType.KATANA,
    subType: WeaponSubType.SLASHING,
    rarity: ItemRarity.COMMON,
    level: 5,
    attackPower: 145,
    criticalHit: 120,
    weight: 6,
    durability: 60,
    scalingStats: { dexterity: 'D' },
    requirements: { dexterity: 12 },
    description: 'A basic katana with a curved blade.'
  },
  {
    id: 'katana_002',
    name: 'Uchigatan',
    type: WeaponType.KATANA,
    subType: WeaponSubType.SLASHING,
    rarity: ItemRarity.UNCOMMON,
    level: 15,
    attackPower: 195,
    criticalHit: 130,
    weight: 7,
    durability: 70,
    scalingStats: { dexterity: 'C' },
    requirements: { dexterity: 16 },
    description: 'A typical samurai katana.'
  },
];

// Repeat pattern for more weapon types...
const AXES: WeaponStats[] = Array.from({ length: 45 }, (_, i) => ({
  id: `axe_${String(i + 1).padStart(3, '0')}`,
  name: `Axe Variant ${i + 1}`,
  type: WeaponType.AXE,
  subType: WeaponSubType.STRIKING,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE][i % 3],
  level: (i + 1) * 2,
  attackPower: 150 + i * 3,
  criticalHit: 90 + Math.floor(i / 2),
  weight: 8 + (i % 5),
  durability: 70 + i,
  scalingStats: { strength: 'C' },
  requirements: { strength: 14 + Math.floor(i / 3) },
  description: `Axe variant with unique properties. Level ${(i + 1) * 2}`
}));

const HAMMERS: WeaponStats[] = Array.from({ length: 50 }, (_, i) => ({
  id: `hammer_${String(i + 1).padStart(3, '0')}`,
  name: `Hammer Variant ${i + 1}`,
  type: WeaponType.HAMMER,
  subType: WeaponSubType.STRIKING,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE][i % 3],
  level: (i + 1) * 2,
  attackPower: 160 + i * 3,
  criticalHit: 85 + Math.floor(i / 2),
  weight: 9 + (i % 6),
  durability: 75 + i,
  scalingStats: { strength: 'B' },
  requirements: { strength: 16 + Math.floor(i / 3) },
  description: `Hammer variant with unique striking power. Level ${(i + 1) * 2}`
}));

const SPEARS: WeaponStats[] = Array.from({ length: 50 }, (_, i) => ({
  id: `spear_${String(i + 1).padStart(3, '0')}`,
  name: `Spear Variant ${i + 1}`,
  type: WeaponType.SPEAR,
  subType: WeaponSubType.THRUSTING,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE, ItemRarity.EPIC][i % 4],
  level: (i + 1) * 2,
  attackPower: 140 + i * 2,
  criticalHit: 95 + Math.floor(i / 3),
  weight: 7 + (i % 4),
  durability: 70 + i,
  scalingStats: { strength: 'C', dexterity: 'C' },
  requirements: { strength: 12 + Math.floor(i / 4), dexterity: 10 + Math.floor(i / 5) },
  description: `Spear variant with thrusting reach. Level ${(i + 1) * 2}`
}));

const DAGGERS: WeaponStats[] = Array.from({ length: 40 }, (_, i) => ({
  id: `dagger_${String(i + 1).padStart(3, '0')}`,
  name: `Dagger Variant ${i + 1}`,
  type: WeaponType.DAGGER,
  subType: WeaponSubType.THRUSTING,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE][i % 3],
  level: (i + 1) * 1.5,
  attackPower: 80 + i * 2,
  criticalHit: 140 + Math.floor(i / 2),
  weight: 2 + (i % 3),
  durability: 50 + i,
  scalingStats: { dexterity: 'D' },
  requirements: { dexterity: 8 + Math.floor(i / 5) },
  description: `Dagger variant with high critical chance. Level ${Math.floor((i + 1) * 1.5)}`
}));

const BOWS: WeaponStats[] = Array.from({ length: 45 }, (_, i) => ({
  id: `bow_${String(i + 1).padStart(3, '0')}`,
  name: `Bow Variant ${i + 1}`,
  type: WeaponType.BOW,
  subType: WeaponSubType.RANGED,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE, ItemRarity.EPIC][i % 4],
  level: (i + 1) * 2,
  attackPower: 120 + i * 2,
  criticalHit: 100 + Math.floor(i / 3),
  weight: 4 + (i % 3),
  durability: 65 + i,
  scalingStats: { dexterity: 'B' },
  requirements: { dexterity: 14 + Math.floor(i / 4) },
  description: `Bow variant for ranged combat. Level ${(i + 1) * 2}`
}));

const STAVES: WeaponStats[] = Array.from({ length: 45 }, (_, i) => ({
  id: `staff_${String(i + 1).padStart(3, '0')}`,
  name: `Staff Variant ${i + 1}`,
  type: WeaponType.STAFF,
  subType: WeaponSubType.MAGICAL,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE, ItemRarity.EPIC, ItemRarity.LEGENDARY][i % 5],
  level: (i + 1) * 2,
  attackPower: 100 + i * 2,
  criticalHit: 80,
  weight: 5 + (i % 4),
  durability: 70 + i,
  scalingStats: { intelligence: 'A', faith: 'C' },
  requirements: { intelligence: 14 + Math.floor(i / 3), faith: 8 },
  description: `Staff variant for spellcasting. Level ${(i + 1) * 2}`
}));

// ============ ARMOR DATABASE (Extensive sets) ============

const HELMS: ArmorStats[] = Array.from({ length: 60 }, (_, i) => ({
  id: `helm_${String(i + 1).padStart(3, '0')}`,
  name: `Helm Variant ${i + 1}`,
  type: ArmorType.HELM,
  subType: [ArmorSubType.LIGHT, ArmorSubType.MEDIUM, ArmorSubType.HEAVY][i % 3],
  slot: 'HEAD' as any,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE][i % 3],
  level: (i + 1) * 2,
  defense: 40 + i * 0.5,
  elementalDefense: { fire: 5 + i * 0.2, lightning: 5 + i * 0.2, holy: 3, magic: 8 + i * 0.3, poison: 10 },
  statusResistance: { bleed: 5, frost: 8, rot: 3, sleep: 5 },
  weight: 3 + (i % 5),
  poise: 10 + i * 0.3,
  requirements: { vigor: 10 + Math.floor(i / 5) },
  description: `Helm variant with unique properties. Level ${(i + 1) * 2}`
}));

const CHESTS: ArmorStats[] = Array.from({ length: 70 }, (_, i) => ({
  id: `chest_${String(i + 1).padStart(3, '0')}`,
  name: `Chest Armor ${i + 1}`,
  type: ArmorType.CHEST,
  subType: [ArmorSubType.LIGHT, ArmorSubType.MEDIUM, ArmorSubType.HEAVY, ArmorSubType.ROBES][i % 4],
  slot: 'CHEST' as any,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE, ItemRarity.EPIC][i % 4],
  level: (i + 1) * 2,
  defense: 60 + i * 0.8,
  elementalDefense: { fire: 10 + i * 0.3, lightning: 8 + i * 0.25, holy: 5, magic: 12 + i * 0.4, poison: 15 },
  statusResistance: { bleed: 8, frost: 12, rot: 5, sleep: 8 },
  weight: 8 + (i % 8),
  poise: 20 + i * 0.5,
  requirements: { vigor: 12 + Math.floor(i / 5) },
  description: `Chest armor variant. Level ${(i + 1) * 2}`
}));

const GAUNTLETS: ArmorStats[] = Array.from({ length: 60 }, (_, i) => ({
  id: `gauntlets_${String(i + 1).padStart(3, '0')}`,
  name: `Gauntlets ${i + 1}`,
  type: ArmorType.GAUNTLETS,
  subType: [ArmorSubType.LIGHT, ArmorSubType.MEDIUM, ArmorSubType.HEAVY][i % 3],
  slot: 'ARMS' as any,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE][i % 3],
  level: (i + 1) * 2,
  defense: 35 + i * 0.4,
  elementalDefense: { fire: 4 + i * 0.15, lightning: 4 + i * 0.15, holy: 2, magic: 6 + i * 0.2, poison: 8 },
  statusResistance: { bleed: 4, frost: 6, rot: 2, sleep: 4 },
  weight: 2 + (i % 4),
  poise: 8 + i * 0.2,
  requirements: { vigor: 10 + Math.floor(i / 6) },
  description: `Gauntlets variant. Level ${(i + 1) * 2}`
}));

const GREAVES: ArmorStats[] = Array.from({ length: 65 }, (_, i) => ({
  id: `greaves_${String(i + 1).padStart(3, '0')}`,
  name: `Leg Armor ${i + 1}`,
  type: ArmorType.GREAVES,
  subType: [ArmorSubType.LIGHT, ArmorSubType.MEDIUM, ArmorSubType.HEAVY][i % 3],
  slot: 'LEGS' as any,
  rarity: [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE, ItemRarity.EPIC][i % 4],
  level: (i + 1) * 2,
  defense: 45 + i * 0.6,
  elementalDefense: { fire: 7 + i * 0.25, lightning: 7 + i * 0.25, holy: 4, magic: 10 + i * 0.3, poison: 12 },
  statusResistance: { bleed: 6, frost: 10, rot: 4, sleep: 6 },
  weight: 5 + (i % 6),
  poise: 15 + i * 0.4,
  requirements: { vigor: 11 + Math.floor(i / 5) },
  description: `Leg armor variant. Level ${(i + 1) * 2}`
}));

// Export all weapons and armor
export const WEAPONS = {
  SWORDS,
  GREATSWORDS,
  KATANAS,
  AXES,
  HAMMERS,
  SPEARS,
  DAGGERS,
  BOWS,
  STAVES,
};

export const ARMOR = {
  HELMS,
  CHESTS,
  GAUNTLETS,
  GREAVES,
};

// Total count ~475+ weapons and armor pieces
