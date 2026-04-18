// Game data types for Yggdrasil Chronicles: The Shattered Realms
// An Elden Ring-inspired RTS/turn-based text MMORPG

// Character Classes
export enum CharacterClass {
  WARRIOR = 'Warrior',
  KNIGHT = 'Knight',
  ASTROLOGER = 'Astrologer',
  BANDIT = 'Bandit',
  PRISONER = 'Prisoner',
  CONFESSOR = 'Confessor',
  WRETCH = 'Wretch',
  VAGABOND = 'Vagabond',
  PROPHET = 'Prophet',
  SAMURAI = 'Samurai',
}

// Character Subclasses
export enum CharacterSubclass {
  // Warrior subclasses
  BERSERKER = 'Berserker',
  CHAMPION = 'Champion',
  MERCENARY = 'Mercenary',
  
  // Knight subclasses
  PALADIN = 'Paladin',
  DARK_KNIGHT = 'Dark Knight',
  ROYAL_GUARD = 'Royal Guard',
  
  // Astrologer subclasses
  SORCERER = 'Sorcerer',
  ELEMENTALIST = 'Elementalist',
  STAR_CALLER = 'Star Caller',
  
  // Bandit subclasses
  ASSASSIN = 'Assassin',
  ROGUE = 'Rogue',
  SHADOW = 'Shadow',
  
  // Prisoner subclasses
  SPELLBLADE = 'Spellblade',
  ESCAPIST = 'Escapist',
  TRICKSTER = 'Trickster',
  
  // Confessor subclasses
  INQUISITOR = 'Inquisitor',
  CLERIC = 'Cleric',
  ZEALOT = 'Zealot',
  
  // Wretch subclasses
  SURVIVOR = 'Survivor',
  BARBARIAN = 'Barbarian',
  OUTCAST = 'Outcast',
  
  // Vagabond subclasses
  WANDERER = 'Wanderer',
  DUELIST = 'Duelist',
  RANGER = 'Ranger',
  
  // Prophet subclasses
  ORACLE = 'Oracle',
  HEALER = 'Healer',
  SAGE = 'Sage',
  
  // Samurai subclasses
  RONIN = 'Ronin',
  KENSEI = 'Kensei',
  SHOGUN = 'Shogun',
}

// Character Races
export enum CharacterRace {
  HUMAN = 'Human',
  ELF = 'Elf',
  DWARF = 'Dwarf',
  BEASTFOLK = 'Beastfolk',
  UNDEAD = 'Undead',
  DRAGON_KIN = 'Dragon Kin',
  CELESTIAL = 'Celestial',
  ABYSSAL = 'Abyssal',
}

// Covenants (Factions)
export enum Covenant {
  GOLDEN_ORDER = 'Golden Order',
  VOLCANO_MANOR = 'Volcano Manor',
  FINGERS_OF_CHAOS = 'Fingers of Chaos',
  ACADEMY_OF_RAYA_LUCARIA = 'Academy of Raya Lucaria',
  MOHGWYN_DYNASTY = 'Mohgwyn Dynasty',
  ERDTREE_SENTINELS = 'Erdtree Sentinels',
  ROUNDTABLE_HOLD = 'Roundtable Hold',
  FRENZIED_FLAME = 'Frenzied Flame',
}

// World Regions
export enum WorldRegion {
  LIMGRAVE = 'Limgrave',
  WEEPING_PENINSULA = 'Weeping Peninsula',
  LIURNIA = 'Liurnia of the Lakes',
  CAELID = 'Caelid',
  ALTUS_PLATEAU = 'Altus Plateau',
  MT_GELMIR = 'Mt. Gelmir',
  MOUNTAINTOPS = 'Mountaintops of the Giants',
  CONSECRATED_SNOWFIELD = 'Consecrated Snowfield',
  MOHGWYN_PALACE = 'Mohgwyn Palace',
  CRUMBLING_FARUM_AZULA = 'Crumbling Farum Azula',
  SIOFRA_RIVER = 'Siofra River',
  NOKRON = 'Nokron, Eternal City',
  DEEPROOT_DEPTHS = 'Deeproot Depths',
  LAKE_OF_ROT = 'Lake of Rot',
}

// Item Rarity
export enum ItemRarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
  ARTIFACT = 'Artifact',
}

// Equipment Slots
export enum EquipmentSlot {
  HEAD = 'Head',
  CHEST = 'Chest',
  ARMS = 'Arms',
  LEGS = 'Legs',
  RIGHT_HAND_1 = 'Right Hand 1',
  RIGHT_HAND_2 = 'Right Hand 2',
  LEFT_HAND_1 = 'Left Hand 1',
  LEFT_HAND_2 = 'Left Hand 2',
  TALISMAN_1 = 'Talisman 1',
  TALISMAN_2 = 'Talisman 2',
  TALISMAN_3 = 'Talisman 3',
  TALISMAN_4 = 'Talisman 4',
  QUICK_ITEM_1 = 'Quick Item 1',
  QUICK_ITEM_2 = 'Quick Item 2',
  QUICK_ITEM_3 = 'Quick Item 3',
  QUICK_ITEM_4 = 'Quick Item 4',
  QUICK_ITEM_5 = 'Quick Item 5',
  QUICK_ITEM_6 = 'Quick Item 6',
  QUICK_ITEM_7 = 'Quick Item 7',
  QUICK_ITEM_8 = 'Quick Item 8',
  QUICK_ITEM_9 = 'Quick Item 9',
  QUICK_ITEM_10 = 'Quick Item 10',
}

// Weapon Types
export enum WeaponType {
  DAGGER = 'Dagger',
  STRAIGHT_SWORD = 'Straight Sword',
  GREATSWORD = 'Greatsword',
  COLOSSAL_SWORD = 'Colossal Sword',
  CURVED_SWORD = 'Curved Sword',
  CURVED_GREATSWORD = 'Curved Greatsword',
  KATANA = 'Katana',
  TWINBLADE = 'Twinblade',
  THRUSTING_SWORD = 'Thrusting Sword',
  HEAVY_THRUSTING_SWORD = 'Heavy Thrusting Sword',
  AXE = 'Axe',
  GREATAXE = 'Greataxe',
  HAMMER = 'Hammer',
  FLAIL = 'Flail',
  GREAT_HAMMER = 'Great Hammer',
  COLOSSAL_WEAPON = 'Colossal Weapon',
  SPEAR = 'Spear',
  GREAT_SPEAR = 'Great Spear',
  HALBERD = 'Halberd',
  REAPER = 'Reaper',
  WHIP = 'Whip',
  FIST = 'Fist',
  CLAW = 'Claw',
  LIGHT_BOW = 'Light Bow',
  BOW = 'Bow',
  GREATBOW = 'Greatbow',
  CROSSBOW = 'Crossbow',
  BALLISTA = 'Ballista',
  STAFF = 'Staff',
  SEAL = 'Seal',
  TORCH = 'Torch',
}

// Armor Types
export enum ArmorType {
  LIGHT = 'Light',
  MEDIUM = 'Medium',
  HEAVY = 'Heavy',
}

// Difficulty Modes
export enum DifficultyMode {
  NORMAL = 'Normal',
  HARD = 'Hard',
  VERY_HARD = 'Very Hard',
  HARDCORE = 'Hardcore',
  NIGHTMARE = 'Nightmare',
}

// Dungeon Types
export enum DungeonType {
  CATACOMBS = 'Catacombs',
  CAVE = 'Cave',
  TUNNEL = 'Tunnel',
  MINE = 'Mine',
  RUINS = 'Ruins',
  CASTLE = 'Castle',
  FORT = 'Fort',
  LEGACY = 'Legacy Dungeon',
  DIVINE_TOWER = 'Divine Tower',
  EVERGAOL = 'Evergaol',
}

// Player Stats
export interface PlayerStats {
  vigor: number;
  mind: number;
  endurance: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  faith: number;
  arcane: number;
}

// Player Resources
export interface PlayerResources {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  focus: number;
  maxFocus: number;
  runes: number;
}

// Player Progress
export interface PlayerProgress {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  skillPoints: number;
  attributePoints: number;
  reputation: Record<Covenant, number>;
  discoveredRegions: WorldRegion[];
  unlockedFastTravelPoints: string[];
  completedDungeons: string[];
  defeatedBosses: string[];
  completedQuests: string[];
}

// Item Base
export interface ItemBase {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  value: number;
  weight: number;
  imageUrl: string;
  requiredLevel: number;
}

// Weapon
export interface Weapon extends ItemBase {
  type: WeaponType;
  damage: number;
  damageType: string;
  scaling: {
    strength: string;
    dexterity: string;
    intelligence: string;
    faith: string;
    arcane: string;
  };
  requirements: Partial<PlayerStats>;
  skills: string[];
  durability: number;
  maxDurability: number;
}

// Armor
export interface Armor extends ItemBase {
  type: ArmorType;
  slot: EquipmentSlot;
  defense: {
    physical: number;
    magic: number;
    fire: number;
    lightning: number;
    holy: number;
  };
  resistance: {
    poison: number;
    bleed: number;
    frost: number;
    sleep: number;
    madness: number;
    deathblight: number;
  };
  poise: number;
  weight: number;
  requirements: Partial<PlayerStats>;
}

// Consumable Item
export interface Consumable extends ItemBase {
  effect: string;
  duration: number;
  cooldown: number;
  maxStack: number;
  currentStack: number;
}

// Material
export interface Material extends ItemBase {
  source: string;
  usedFor: string[];
  maxStack: number;
  currentStack: number;
}

// Quest
export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'main' | 'side' | 'contract' | 'event';
  giver: string;
  location: WorldRegion;
  objectives: {
    id: string;
    description: string;
    completed: boolean;
    progress?: {
      current: number;
      required: number;
    };
  }[];
  rewards: {
    runes: number;
    items: {
      itemId: string;
      quantity: number;
    }[];
    experience: number;
    reputation?: {
      covenant: Covenant;
      amount: number;
    };
  };
  prerequisites: {
    level?: number;
    quests?: string[];
    covenant?: {
      name: Covenant;
      level: number;
    };
  };
  timeLimit?: number; // in seconds, undefined means no time limit
  status: 'available' | 'active' | 'completed' | 'failed';
}

// Dungeon
export interface Dungeon {
  id: string;
  name: string;
  description: string;
  type: DungeonType;
  region: WorldRegion;
  minLevel: number;
  recommendedLevel: number;
  playerLimit: {
    min: number;
    max: number;
  };
  bosses: string[];
  rewards: {
    guaranteed: {
      itemId: string;
      quantity: number;
    }[];
    possible: {
      itemId: string;
      quantity: number;
      dropChance: number;
    }[];
    runes: {
      min: number;
      max: number;
    };
    experience: number;
  };
  unlockRequirements: {
    quests?: string[];
    items?: string[];
    level?: number;
  };
  resetTimer: number; // in hours
}

// Raid
export interface Raid extends Dungeon {
  phases: {
    name: string;
    description: string;
    bosses: string[];
    mechanics: string[];
  }[];
  lockoutPeriod: number; // in hours
}

// Trial
export interface Trial extends Dungeon {
  timeLimit: number; // in minutes
  challenges: {
    name: string;
    description: string;
    reward: {
      itemId: string;
      quantity: number;
    };
  }[];
}

// Tower
export interface Tower {
  id: string;
  name: string;
  description: string;
  floors: number;
  currentFloor: number;
  floorDetails: {
    number: number;
    enemies: string[];
    boss?: string;
    cleared: boolean;
    rewards?: {
      itemId: string;
      quantity: number;
    }[];
  }[];
  resetTimer: number; // in days
}

// Player Character
export interface PlayerCharacter {
  id: string;
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  subclass?: CharacterSubclass;
  covenant?: Covenant;
  stats: PlayerStats;
  resources: PlayerResources;
  progress: PlayerProgress;
  equipment: Partial<Record<EquipmentSlot, string>>; // itemId for each slot
  inventory: {
    weapons: Weapon[];
    armor: Armor[];
    consumables: Consumable[];
    materials: Material[];
    keyItems: ItemBase[];
  };
  activeQuests: Quest[];
  completedQuests: string[];
  skills: {
    id: string;
    name: string;
    level: number;
    maxLevel: number;
  }[];
  achievements: {
    id: string;
    name: string;
    completed: boolean;
    progress?: {
      current: number;
      required: number;
    };
  }[];
  createdAt: string;
  lastPlayed: string;
  playTime: number; // in seconds
}

// Game Save
export interface GameSave {
  id: string;
  characterId: string;
  saveDate: string;
  location: {
    region: WorldRegion;
    coordinates: {
      x: number;
      y: number;
      z: number;
    };
  };
  screenshot?: string;
  autoSave: boolean;
  playTime: number; // in seconds
}

// Party
export interface Party {
  id: string;
  name: string;
  leader: string; // player id
  members: string[]; // player ids
  maxSize: number;
  isPrivate: boolean;
  currentActivity?: {
    type: 'dungeon' | 'raid' | 'trial' | 'world_boss';
    id: string;
    startTime: string;
  };
  invites: string[]; // player ids
}

// Guild
export interface Guild {
  id: string;
  name: string;
  tag: string;
  leader: string; // player id
  officers: string[]; // player ids
  members: string[]; // player ids
  level: number;
  experience: number;
  experienceToNextLevel: number;
  createdAt: string;
  description: string;
  banner?: string;
  covenant?: Covenant;
  achievements: {
    id: string;
    name: string;
    completed: boolean;
    progress?: {
      current: number;
      required: number;
    };
  }[];
  treasury: {
    runes: number;
    items: {
      itemId: string;
      quantity: number;
    }[];
  };
}

// World Boss
export interface WorldBoss {
  id: string;
  name: string;
  description: string;
  level: number;
  region: WorldRegion;
  location: {
    x: number;
    y: number;
    z: number;
  };
  health: number;
  maxHealth: number;
  phases: {
    healthThreshold: number;
    name: string;
    description: string;
    abilities: string[];
  }[];
  rewards: {
    guaranteed: {
      itemId: string;
      quantity: number;
    }[];
    possible: {
      itemId: string;
      quantity: number;
      dropChance: number;
    }[];
    runes: {
      min: number;
      max: number;
    };
    experience: number;
  };
  respawnTime: number; // in hours
  lastDefeated?: string;
  currentHealth?: number;
}

// Dungeon Boss
export interface DungeonBoss {
  id: string;
  name: string;
  type: 'standard' | 'elite' | 'legendary' | 'mythic';
  region: string;
  level: number;
  health: number;
  damage: number;
  defense: number;
  abilities: string[];
  phases?: number;
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

// Boss Fight State
export interface BossFight {
  boss: DungeonBoss;
  currentPhase: number;
  currentHealth: number;
  maxHealth: number;
  playerHealth: number;
  playerMaxHealth: number;
  turn: number;
  status: 'active' | 'victory' | 'defeat' | 'paused';
  battleLog: string[];
  playerBuffs: Buff[];
  bossBuffs: Buff[];
  playerCooldowns: Record<string, number>;
  bossCooldowns: Record<string, number>;
}

// Boss Phase
export interface BossPhase {
  phaseNumber: number;
  name: string;
  healthThreshold: number;
  description: string;
  abilities: BossAbility[];
  resistances: Record<string, number>;
  weaknesses: Record<string, number>;
  specialEffects?: string[];
}

// Boss Ability
export interface BossAbility {
  id: string;
  name: string;
  description: string;
  damage: number;
  damageType: 'physical' | 'fire' | 'lightning' | 'holy' | 'magic' | 'bleed' | 'rot';
  cooldown: number;
  range: 'melee' | 'ranged' | 'area';
  effects?: string[];
  animation?: string;
}

// Buff/Debuff System
export interface Buff {
  id: string;
  name: string;
  description: string;
  type: 'buff' | 'debuff';
  stat: string;
  value: number;
  duration: number;
  remainingTurns: number;
  source: 'player' | 'boss';
}

// Game Settings
export interface GameSettings {
  difficulty: DifficultyMode;
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    effects: boolean;
    shadows: boolean;
    antialiasing: boolean;
  };
  audio: {
    master: number;
    music: number;
    sfx: number;
    voice: number;
    ambient: number;
  };
  gameplay: {
    autoSave: boolean;
    autoSaveInterval: number; // in minutes
    showTutorials: boolean;
    showHints: boolean;
    showDamageNumbers: boolean;
    showHealthBars: boolean;
  };
  controls: {
    invertY: boolean;
    sensitivity: number;
    vibration: boolean;
    autoTarget: boolean;
  };
  accessibility: {
    colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    textSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
}