import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import HomeScreen from "./screens/HomeScreen"

// Define the navigation types
export type RootStackParamList = {
  Home: undefined;
  
  // Character screens
  CharacterStats: undefined;
  CharacterEquipment: undefined;
  CharacterSkills: undefined;
  CharacterInventory: undefined;
  CharacterStatus: undefined;
  CharacterLeveling: undefined;
  CharacterClasses: undefined;
  CharacterRaces: undefined;
  CharacterSubclasses: undefined;
  CharacterCustomization: undefined;
  CharacterLoadouts: undefined;
  
  // World screens
  WorldMap: undefined;
  WorldLocations: undefined;
  WorldFastTravel: undefined;
  WorldCovenants: undefined;
  WorldExploration: undefined;
  WorldBosses: undefined;
  WorldEvents: undefined;
  WorldWeather: undefined;
  WorldFactions: undefined;
  
  // Combat screens
  CombatBattles: undefined;
  CombatTactics: undefined;
  CombatFormations: undefined;
  CombatCommands: undefined;
  CombatBosses: undefined;
  CombatEncounters: undefined;
  CombatRewards: undefined;
  CombatDifficulty: undefined;
  
  // Multiplayer screens
  MultiplayerCoop: undefined;
  MultiplayerPvP: undefined;
  MultiplayerMessages: undefined;
  MultiplayerSummons: undefined;
  MultiplayerGuilds: undefined;
  MultiplayerParty: undefined;
  MultiplayerGroupFinder: undefined;
  MultiplayerRankings: undefined;
  
  // Dungeon & Raid screens
  DungeonsList: undefined;
  DungeonDetail: { dungeonId: string };
  RaidsList: undefined;
  RaidDetail: { raidId: string };
  TrialsList: undefined;
  TrialDetail: { trialId: string };
  TowerSolo: undefined;
  
  // Quest screens
  QuestsMain: undefined;
  QuestsSide: undefined;
  QuestsContracts: undefined;
  QuestsAchievements: undefined;
  QuestsEvents: undefined;
  QuestRewards: undefined;
  QuestProgress: undefined;
  
  // Item & Equipment screens
  ItemsInventory: undefined;
  ItemsWeapons: undefined;
  ItemsArmor: undefined;
  ItemsConsumables: undefined;
  ItemsMaterials: undefined;
  ItemsRarity: undefined;
  ItemsEquipmentSlots: undefined;
  ItemsSetBonuses: undefined;
  
  // Crafting screens
  CraftingSmithing: undefined;
  CraftingAlchemy: undefined;
  CraftingEnchanting: undefined;
  CraftingCooking: undefined;
  CraftingMaterials: undefined;
  CraftingBlueprints: undefined;
  
  // Game Management screens
  SaveLoad: undefined;
  Settings: undefined;
  DifficultySettings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      
      {/* Character screens */}
      {/* These screens would be implemented in a complete game */}
      {/* 
      <Stack.Screen name="CharacterStats" component={CharacterStatsScreen} />
      <Stack.Screen name="CharacterEquipment" component={CharacterEquipmentScreen} />
      <Stack.Screen name="CharacterSkills" component={CharacterSkillsScreen} />
      <Stack.Screen name="CharacterInventory" component={CharacterInventoryScreen} />
      <Stack.Screen name="CharacterStatus" component={CharacterStatusScreen} />
      <Stack.Screen name="CharacterLeveling" component={CharacterLevelingScreen} />
      <Stack.Screen name="CharacterClasses" component={CharacterClassesScreen} />
      <Stack.Screen name="CharacterRaces" component={CharacterRacesScreen} />
      <Stack.Screen name="CharacterSubclasses" component={CharacterSubclassesScreen} />
      <Stack.Screen name="CharacterCustomization" component={CharacterCustomizationScreen} />
      <Stack.Screen name="CharacterLoadouts" component={CharacterLoadoutsScreen} />
      
      <Stack.Screen name="WorldMap" component={WorldMapScreen} />
      <Stack.Screen name="WorldLocations" component={WorldLocationsScreen} />
      <Stack.Screen name="WorldFastTravel" component={WorldFastTravelScreen} />
      <Stack.Screen name="WorldCovenants" component={WorldCovenantsScreen} />
      <Stack.Screen name="WorldExploration" component={WorldExplorationScreen} />
      <Stack.Screen name="WorldBosses" component={WorldBossesScreen} />
      <Stack.Screen name="WorldEvents" component={WorldEventsScreen} />
      <Stack.Screen name="WorldWeather" component={WorldWeatherScreen} />
      <Stack.Screen name="WorldFactions" component={WorldFactionsScreen} />
      
      <Stack.Screen name="CombatBattles" component={CombatBattlesScreen} />
      <Stack.Screen name="CombatTactics" component={CombatTacticsScreen} />
      <Stack.Screen name="CombatFormations" component={CombatFormationsScreen} />
      <Stack.Screen name="CombatCommands" component={CombatCommandsScreen} />
      <Stack.Screen name="CombatBosses" component={CombatBossesScreen} />
      <Stack.Screen name="CombatEncounters" component={CombatEncountersScreen} />
      <Stack.Screen name="CombatRewards" component={CombatRewardsScreen} />
      <Stack.Screen name="CombatDifficulty" component={CombatDifficultyScreen} />
      
      <Stack.Screen name="MultiplayerCoop" component={MultiplayerCoopScreen} />
      <Stack.Screen name="MultiplayerPvP" component={MultiplayerPvPScreen} />
      <Stack.Screen name="MultiplayerMessages" component={MultiplayerMessagesScreen} />
      <Stack.Screen name="MultiplayerSummons" component={MultiplayerSummonsScreen} />
      <Stack.Screen name="MultiplayerGuilds" component={MultiplayerGuildsScreen} />
      <Stack.Screen name="MultiplayerParty" component={MultiplayerPartyScreen} />
      <Stack.Screen name="MultiplayerGroupFinder" component={MultiplayerGroupFinderScreen} />
      <Stack.Screen name="MultiplayerRankings" component={MultiplayerRankingsScreen} />
      
      <Stack.Screen name="DungeonsList" component={DungeonsListScreen} />
      <Stack.Screen name="DungeonDetail" component={DungeonDetailScreen} />
      <Stack.Screen name="RaidsList" component={RaidsListScreen} />
      <Stack.Screen name="RaidDetail" component={RaidDetailScreen} />
      <Stack.Screen name="TrialsList" component={TrialsListScreen} />
      <Stack.Screen name="TrialDetail" component={TrialDetailScreen} />
      <Stack.Screen name="TowerSolo" component={TowerSoloScreen} />
      
      <Stack.Screen name="QuestsMain" component={QuestsMainScreen} />
      <Stack.Screen name="QuestsSide" component={QuestsSideScreen} />
      <Stack.Screen name="QuestsContracts" component={QuestsContractsScreen} />
      <Stack.Screen name="QuestsAchievements" component={QuestsAchievementsScreen} />
      <Stack.Screen name="QuestsEvents" component={QuestsEventsScreen} />
      <Stack.Screen name="QuestRewards" component={QuestRewardsScreen} />
      <Stack.Screen name="QuestProgress" component={QuestProgressScreen} />
      
      <Stack.Screen name="ItemsInventory" component={ItemsInventoryScreen} />
      <Stack.Screen name="ItemsWeapons" component={ItemsWeaponsScreen} />
      <Stack.Screen name="ItemsArmor" component={ItemsArmorScreen} />
      <Stack.Screen name="ItemsConsumables" component={ItemsConsumablesScreen} />
      <Stack.Screen name="ItemsMaterials" component={ItemsMaterialsScreen} />
      <Stack.Screen name="ItemsRarity" component={ItemsRarityScreen} />
      <Stack.Screen name="ItemsEquipmentSlots" component={ItemsEquipmentSlotsScreen} />
      <Stack.Screen name="ItemsSetBonuses" component={ItemsSetBonusesScreen} />
      
      <Stack.Screen name="CraftingSmithing" component={CraftingSmithingScreen} />
      <Stack.Screen name="CraftingAlchemy" component={CraftingAlchemyScreen} />
      <Stack.Screen name="CraftingEnchanting" component={CraftingEnchantingScreen} />
      <Stack.Screen name="CraftingCooking" component={CraftingCookingScreen} />
      <Stack.Screen name="CraftingMaterials" component={CraftingMaterialsScreen} />
      <Stack.Screen name="CraftingBlueprints" component={CraftingBlueprintsScreen} />
      
      <Stack.Screen name="SaveLoad" component={SaveLoadScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="DifficultySettings" component={DifficultySettingsScreen} />
      */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});