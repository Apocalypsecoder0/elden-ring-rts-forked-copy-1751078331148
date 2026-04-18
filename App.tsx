import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';

// Import all screens
import HomeScreen from "./screens/HomeScreen"
import CharacterScreen from "./screens/CharacterScreen"
import CharacterStatsScreen from "./screens/CharacterStatsScreen"
import CharacterEquipment from "./screens/CharacterEquipment"
import CharacterSkills from "./screens/CharacterSkills"
import CharacterInventory from "./screens/CharacterInventory"
import CharacterStatus from "./screens/CharacterStatus"
import CharacterLeveling from "./screens/CharacterLeveling"
import CharacterClasses from "./screens/CharacterClasses"
import CharacterRaces from "./screens/CharacterRaces"
import CharacterSubclasses from "./screens/CharacterSubclasses"
import CharacterCustomization from "./screens/CharacterCustomization"
import CharacterLoadouts from "./screens/CharacterLoadouts"
import WorldMap from "./screens/WorldMap"
import WorldLocations from "./screens/WorldLocations"
import WorldFastTravel from "./screens/WorldFastTravel"
import CombatArena from "./screens/CombatArena"
import CombatMultiplayer from "./screens/CombatMultiplayer"
import PartyCreate from "./screens/PartyCreate"
import GuildManagement from "./screens/GuildManagement"
import DungeonCrawler from "./screens/DungeonCrawler"
import DungeonBoss from "./screens/DungeonBoss"
import QuestLog from "./screens/QuestLog"
import QuestTracker from "./screens/QuestTracker"
import ItemCrafting from "./screens/ItemCrafting"
import ItemTrading from "./screens/ItemTrading"

// Define the navigation types
export type RootStackParamList = {
  Home: undefined;

  // Character screens
  CharacterScreen: undefined;
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

  // Combat screens
  CombatArena: undefined;
  CombatMultiplayer: undefined;

  // Social screens
  PartyCreate: undefined;
  GuildManagement: undefined;

  // Dungeon screens
  DungeonCrawler: undefined;
  DungeonBoss: undefined;

  // Quest screens
  QuestLog: undefined;
  QuestTracker: undefined;

  // Item screens
  ItemCrafting: undefined;
  ItemTrading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Character screens */}
      <Stack.Screen name="CharacterScreen" component={CharacterScreen} />
      <Stack.Screen name="CharacterStats" component={CharacterStatsScreen} />
      <Stack.Screen name="CharacterEquipment" component={CharacterEquipment} />
      <Stack.Screen name="CharacterSkills" component={CharacterSkills} />
      <Stack.Screen name="CharacterInventory" component={CharacterInventory} />
      <Stack.Screen name="CharacterStatus" component={CharacterStatus} />
      <Stack.Screen name="CharacterLeveling" component={CharacterLeveling} />
      <Stack.Screen name="CharacterClasses" component={CharacterClasses} />
      <Stack.Screen name="CharacterRaces" component={CharacterRaces} />
      <Stack.Screen name="CharacterSubclasses" component={CharacterSubclasses} />
      <Stack.Screen name="CharacterCustomization" component={CharacterCustomization} />
      <Stack.Screen name="CharacterLoadouts" component={CharacterLoadouts} />

      {/* World screens */}
      <Stack.Screen name="WorldMap" component={WorldMap} />
      <Stack.Screen name="WorldLocations" component={WorldLocations} />
      <Stack.Screen name="WorldFastTravel" component={WorldFastTravel} />

      {/* Combat screens */}
      <Stack.Screen name="CombatArena" component={CombatArena} />
      <Stack.Screen name="CombatMultiplayer" component={CombatMultiplayer} />

      {/* Social screens */}
      <Stack.Screen name="PartyCreate" component={PartyCreate} />
      <Stack.Screen name="GuildManagement" component={GuildManagement} />

      {/* Dungeon screens */}
      <Stack.Screen name="DungeonCrawler" component={DungeonCrawler} />
      <Stack.Screen name="DungeonBoss" component={DungeonBoss} />

      {/* Quest screens */}
      <Stack.Screen name="QuestLog" component={QuestLog} />
      <Stack.Screen name="QuestTracker" component={QuestTracker} />

      {/* Item screens */}
      <Stack.Screen name="ItemCrafting" component={ItemCrafting} />
      <Stack.Screen name="ItemTrading" component={ItemTrading} />
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