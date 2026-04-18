// Integration Guide: Using the Game Database in Your Screens

/**
 * This file demonstrates how to integrate the comprehensive game database
 * with your existing React Native screens.
 */

// ============ BASIC IMPORTS ============

// Import the entire database
import { GameDatabase, GameStatistics } from '../data';

// Import specific functions
import {
  getWeaponsByType,
  getArmorBySlot,
  getSpellsBySchool,
  getBossesByTier,
  getDungeonsByType,
  getLocationsByRegion,
  getWeaponById,
  getArmorById,
  getSpellById,
  getBossById,
  getDungeonById,
  getLocationById,
  getRandomItem,
  getItemsByRarity,
  getFastTravelLocations,
} from '../data';

// ============ SCREEN 1: ItemCrafting.tsx Integration ============

/**
 * Expand ItemCrafting to use actual weapon/armor database
 */
export function useItemCraftingDatabase() {
  const craftingMaterials = {
    common: GameDatabase.armor.HELMS.filter(h => h.rarity === 'common'),
    uncommon: GameDatabase.weapons.SWORDS.filter(s => s.rarity === 'uncommon'),
  };

  const allRecipes = [
    ...GameDatabase.weapons.SWORDS,
    ...GameDatabase.weapons.GREATSWORDS,
    ...GameDatabase.armor.CHESTS,
  ];

  return {
    materials: craftingMaterials,
    recipes: allRecipes,
    getRecipesByLevel: (minLevel: number) =>
      allRecipes.filter(r => r.level >= minLevel),
  };
}

// ============ SCREEN 2: CharacterEquipment.tsx Integration ============

/**
 * Populate equipment screen with full armor database
 */
export function useCharacterEquipment() {
  return {
    helmets: GameDatabase.armor.HELMS,
    chestArmor: GameDatabase.armor.CHESTS,
    gauntlets: GameDatabase.armor.GAUNTLETS,
    legArmor: GameDatabase.armor.GREAVES,
    weapons: GameDatabase.weapons,
    
    getEquipmentBySlot: (slot: string) => getArmorBySlot(slot),
    getWeaponsByType: (type: string) => getWeaponsByType(type),
  };
}

// ============ SCREEN 3: CharacterSkills.tsx Integration ============

/**
 * Populate skills screen with spell and ability database
 */
export function useCharacterSkills() {
  return {
    sorcery: GameDatabase.spells.SORCERY,
    incantations: GameDatabase.spells.INCANTATION,
    pyromancy: GameDatabase.spells.PYROMANCY,
    allAbilities: [
      ...GameDatabase.abilities.COMBAT,
      ...GameDatabase.abilities.UTILITY,
      ...GameDatabase.abilities.PASSIVE,
    ],
    
    getSpellsBySchool: (school: string) => getSpellsBySchool(school),
    getAbilitiesByType: (type: string) =>
      GameDatabase.abilities[type as keyof typeof GameDatabase.abilities],
  };
}

// ============ SCREEN 4: DungeonCrawler.tsx Integration ============

/**
 * Populate dungeon selection from complete dungeon database
 */
export function useDungeonCrawler() {
  return {
    dungeons: GameDatabase.instances.dungeons,
    raids: GameDatabase.instances.raids,
    trials: GameDatabase.instances.trials,
    towers: GameDatabase.instances.towers,
    
    getDungeonsByType: (type: 'dungeon' | 'raid' | 'trial' | 'tower') =>
      getDungeonsByType(type),
    
    getDungeonsByLevel: (minLevel: number) => ({
      dungeons: GameDatabase.instances.dungeons.filter(
        d => d.recommendedLevel >= minLevel
      ),
      raids: GameDatabase.instances.raids.filter(
        r => r.recommendedLevel >= minLevel
      ),
    }),
  };
}

// ============ SCREEN 5: DungeonBoss.tsx Integration ============

/**
 * Retrieve boss data for dungeon encounters
 */
export function useBossEncounter(bossId: string) {
  const boss = getBossById(bossId);
  
  return {
    boss,
    // Get other bosses of same tier for scaling reference
    sameTierBosses: boss ? getBossesByTier(boss.type as any) : [],
    
    // Get drops for loot table
    rewards: boss?.rewards,
    
    // Scale difficulty based on player level
    scaledStats: boss ? {
      ...boss,
      health: Math.floor(boss.health * (1 + 0.1 * 0)), // Placeholder scaling
      damage: Math.floor(boss.damage * (1 + 0.1 * 0)),
    } : null,
  };
}

// ============ SCREEN 6: WorldMap.tsx Integration ============

/**
 * Display all world locations on map
 */
export function useWorldMapDatabase() {
  const allLocations = [
    ...GameDatabase.locations.kingdoms,
    ...GameDatabase.locations.majorCities,
    ...GameDatabase.locations.towns,
    ...GameDatabase.locations.villages,
    ...GameDatabase.locations.landmarks,
  ];

  return {
    allLocations,
    
    getLocationsByRegion: (region: string) => getLocationsByRegion(region),
    
    getFastTravelPoints: () => getFastTravelLocations(),
    
    getLocationDetails: (locationId: string) => getLocationById(locationId),
    
    mapRegions: [
      'Limgrave',
      'Weeping Peninsula',
      'Liurnia of the Lakes',
      'Caelid',
      'Altus Plateau',
      'Mt. Gelmir',
      'Leyndell',
      'Mountaintops of the Giants',
      'Consecrated Snowfield',
      'Mohgwyn Palace',
      'Crumbling Farum Azula',
      'Siofra River',
      'Nokron, Eternal City',
      'Deeproot Depths',
      'Lake of Rot',
    ],
  };
}

// ============ SCREEN 7: ItemTrading.tsx Integration ============

/**
 * Populate trading market with weapon and armor database
 */
export function useItemTradingDatabase() {
  const allTradeableItems = [
    ...Object.values(GameDatabase.weapons).flat(),
    ...Object.values(GameDatabase.armor).flat(),
  ];

  return {
    allItems: allTradeableItems,
    
    getItemsByRarity: (rarity: string) => getItemsByRarity(rarity),
    
    getItemById: (id: string) => getWeaponById(id) || getArmorById(id),
    
    getPremiumItems: () =>
      allTradeableItems.filter(
        item => item.rarity === 'legendary' || item.rarity === 'epic'
      ),
    
    getNewItems: () =>
      allTradeableItems
        .sort((a, b) => b.level - a.level)
        .slice(0, 20),
  };
}

// ============ SCREEN 8: QuestLog.tsx Integration ============

/**
 * Get NPCs and locations for quest system
 */
export function useQuestDatabase() {
  const allNPCs = GameDatabase.locations.kingdoms
    .flatMap(k => k.npcs);

  const allQuests = GameDatabase.locations.kingdoms
    .flatMap(k => k.quests);

  return {
    npcs: allNPCs,
    quests: allQuests,
    locations: GameDatabase.locations.kingdoms,
  };
}

// ============ ADVANCED: Game Statistics Dashboard ============

/**
 * Display game statistics and analytics
 */
export function useGameStatisticsDashboard() {
  return {
    statistics: GameStatistics,
    
    summary: {
      totalItems: GameStatistics.grandTotal,
      totalWeapons: GameStatistics.weapons.total,
      totalArmor: GameStatistics.armor.total,
      totalSpells: GameStatistics.spells.total,
      totalAbilities: GameStatistics.abilities.total,
      totalDungeons: GameStatistics.dungeons.total,
      totalBosses: GameStatistics.bosses.total,
      totalLocations: GameStatistics.locations.total,
    },
    
    contentByRarity: {
      common: getItemsByRarity('common'),
      uncommon: getItemsByRarity('uncommon'),
      rare: getItemsByRarity('rare'),
      epic: getItemsByRarity('epic'),
      legendary: getItemsByRarity('legendary'),
    },
  };
}

// ============ SAMPLE REACT COMPONENT ============

/**
 * Example of using database in a React component
 */
export function ItemShowcaseScreen() {
  const allWeapons = Object.values(GameDatabase.weapons).flat();
  const randomWeapon = getRandomItem(allWeapons);
  const allSpells = Object.values(GameDatabase.spells).flat();
  const sorceryOnly = getSpellsBySchool('Sorcery');

  // Use in your component
  return {
    randomWeapon,
    allSpells,
    sorceryOnly,
    
    // Access statistics
    weaponStats: GameStatistics.weapons,
    spellStats: GameStatistics.spells,
    locationStats: GameStatistics.locations,
  };
}

// ============ SEARCH FUNCTIONALITY ============

/**
 * Search across entire game database
 */
export function useGameSearch(query: string) {
  const lowercase = query.toLowerCase();
  
  const weapons = Object.values(GameDatabase.weapons)
    .flat()
    .filter(w => w.name.toLowerCase().includes(lowercase));
    
  const armor = Object.values(GameDatabase.armor)
    .flat()
    .filter(a => a.name.toLowerCase().includes(lowercase));
    
  const spells = Object.values(GameDatabase.spells)
    .flat()
    .filter(s => s.name.toLowerCase().includes(lowercase));
    
  const bosses = Object.values(GameDatabase.bosses)
    .flat()
    .filter(b => b.name.toLowerCase().includes(lowercase));
    
  const locations = [
    ...GameDatabase.locations.kingdoms,
    ...GameDatabase.locations.majorCities,
    ...GameDatabase.locations.towns,
    ...GameDatabase.locations.villages,
    ...GameDatabase.locations.landmarks,
  ].filter(l => l.name.toLowerCase().includes(lowercase));

  return {
    weapons,
    armor,
    spells,
    bosses,
    locations,
    total: weapons.length + armor.length + spells.length + bosses.length + locations.length,
  };
}

// ============ EXPORT ALL HOOKS ============

export const GameDatabaseHooks = {
  useItemCraftingDatabase,
  useCharacterEquipment,
  useCharacterSkills,
  useDungeonCrawler,
  useBossEncounter,
  useWorldMapDatabase,
  useItemTradingDatabase,
  useQuestDatabase,
  useGameStatisticsDashboard,
  ItemShowcaseScreen,
  useGameSearch,
};

export default GameDatabaseHooks;
