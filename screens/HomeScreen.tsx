import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  ScrollView, 
  Dimensions,
  Modal,
  ActivityIndicator,
  Pressable,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { 
  CharacterClass, 
  CharacterRace, 
  CharacterSubclass,
  DifficultyMode,
  WorldRegion,
  ItemRarity,
  Covenant
} from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Menu data structure with expanded submenus
const MAIN_MENUS = [
  {
    id: 'character',
    title: 'CHARACTER',
    icon: 'person',
    submenus: [
      { id: 'CharacterStats', title: 'Stats & Attributes', icon: 'stats-chart', level: 1 },
      { id: 'CharacterEquipment', title: 'Equipment & Armaments', icon: 'shield', level: 1 },
      { id: 'CharacterSkills', title: 'Skills & Incantations', icon: 'flash', level: 2 },
      { id: 'CharacterInventory', title: 'Inventory', icon: 'briefcase', level: 1 },
      { id: 'CharacterStatus', title: 'Status Effects', icon: 'medkit', level: 3 },
      { id: 'CharacterLeveling', title: 'Leveling & Progression', icon: 'trending-up', level: 1 },
      { id: 'CharacterClasses', title: 'Classes & Specializations', icon: 'body', level: 5 },
      { id: 'CharacterRaces', title: 'Races & Bloodlines', icon: 'people-circle', level: 5 },
      { id: 'CharacterSubclasses', title: 'Subclasses', icon: 'git-branch', level: 10 },
      { id: 'CharacterCustomization', title: 'Appearance', icon: 'color-palette', level: 1 },
      { id: 'CharacterLoadouts', title: 'Loadouts', icon: 'albums', level: 15 },
    ]
  },
  {
    id: 'world',
    title: 'WORLD',
    icon: 'globe',
    submenus: [
      { id: 'WorldMap', title: 'Lands Between Map', icon: 'map', level: 1 },
      { id: 'WorldLocations', title: 'Discovered Locations', icon: 'location', level: 1 },
      { id: 'WorldFastTravel', title: 'Fast Travel', icon: 'navigate', level: 5 },
      { id: 'WorldCovenants', title: 'Covenants & Factions', icon: 'people', level: 10 },
      { id: 'WorldExploration', title: 'Exploration', icon: 'compass', level: 1 },
      { id: 'WorldBosses', title: 'World Bosses', icon: 'skull', level: 20 },
      { id: 'WorldEvents', title: 'World Events', icon: 'calendar', level: 15 },
      { id: 'WorldWeather', title: 'Weather & Time', icon: 'cloudy-night', level: 1 },
      { id: 'WorldFactions', title: 'Faction Standings', icon: 'flag', level: 10 },
    ]
  },
  {
    id: 'combat',
    title: 'COMBAT',
    icon: 'flame',
    submenus: [
      { id: 'CombatBattles', title: 'Active Battles', icon: 'skull', level: 1 },
      { id: 'CombatTactics', title: 'Battle Tactics', icon: 'options', level: 5 },
      { id: 'CombatFormations', title: 'Unit Formations', icon: 'grid', level: 10 },
      { id: 'CombatCommands', title: 'Command Center', icon: 'flag', level: 15 },
      { id: 'CombatBosses', title: 'Boss Strategies', icon: 'trophy', level: 20 },
      { id: 'CombatEncounters', title: 'Recent Encounters', icon: 'time', level: 1 },
      { id: 'CombatRewards', title: 'Battle Rewards', icon: 'gift', level: 1 },
      { id: 'CombatDifficulty', title: 'Difficulty Settings', icon: 'warning', level: 1 },
    ]
  },
  {
    id: 'multiplayer',
    title: 'MULTIPLAYER',
    icon: 'people',
    submenus: [
      { id: 'MultiplayerCoop', title: 'Cooperative Play', icon: 'hand-left', level: 10 },
      { id: 'MultiplayerPvP', title: 'PvP Invasions', icon: 'skull', level: 20 },
      { id: 'MultiplayerMessages', title: 'Player Messages', icon: 'chatbubbles', level: 5 },
      { id: 'MultiplayerSummons', title: 'Summon Signs', icon: 'hand-right', level: 15 },
      { id: 'MultiplayerGuilds', title: 'Guilds & Clans', icon: 'people-circle', level: 25 },
      { id: 'MultiplayerParty', title: 'Party Management', icon: 'people', level: 10 },
      { id: 'MultiplayerGroupFinder', title: 'Group Finder', icon: 'search', level: 15 },
      { id: 'MultiplayerRankings', title: 'PvP Rankings', icon: 'podium', level: 30 },
    ]
  },
  {
    id: 'dungeons',
    title: 'DUNGEONS & RAIDS',
    icon: 'key',
    submenus: [
      { id: 'DungeonsList', title: 'Dungeons (2-4 Players)', icon: 'lock-closed', level: 10 },
      { id: 'RaidsList', title: 'Raids (12 Players)', icon: 'people', level: 30 },
      { id: 'TrialsList', title: 'Trials (6-8 Players)', icon: 'flame', level: 20 },
      { id: 'TowerSolo', title: 'Tower (Solo 1-100)', icon: 'business', level: 15 },
    ]
  },
  {
    id: 'quests',
    title: 'QUESTS',
    icon: 'book',
    submenus: [
      { id: 'QuestsMain', title: 'Main Questline', icon: 'star', level: 1 },
      { id: 'QuestsSide', title: 'Side Quests', icon: 'bookmark', level: 5 },
      { id: 'QuestsContracts', title: 'Bounties & Contracts', icon: 'cash', level: 10 },
      { id: 'QuestsAchievements', title: 'Achievements', icon: 'trophy', level: 1 },
      { id: 'QuestsEvents', title: 'Limited Events', icon: 'calendar', level: 15 },
      { id: 'QuestRewards', title: 'Quest Rewards', icon: 'gift', level: 1 },
      { id: 'QuestProgress', title: 'Quest Progress', icon: 'analytics', level: 1 },
    ]
  },
  {
    id: 'items',
    title: 'ITEMS & EQUIPMENT',
    icon: 'briefcase',
    submenus: [
      { id: 'ItemsInventory', title: 'Inventory Management', icon: 'grid', level: 1 },
      { id: 'ItemsWeapons', title: 'Weapons', icon: 'sword', level: 1 },
      { id: 'ItemsArmor', title: 'Armor & Apparel', icon: 'shield', level: 1 },
      { id: 'ItemsConsumables', title: 'Consumables', icon: 'flask', level: 1 },
      { id: 'ItemsMaterials', title: 'Materials', icon: 'leaf', level: 1 },
      { id: 'ItemsRarity', title: 'Item Rarity Guide', icon: 'star', level: 1 },
      { id: 'ItemsEquipmentSlots', title: 'Equipment Slots', icon: 'body', level: 1 },
      { id: 'ItemsSetBonuses', title: 'Set Bonuses', icon: 'sparkles', level: 10 },
    ]
  },
  {
    id: 'crafting',
    title: 'CRAFTING',
    icon: 'hammer',
    submenus: [
      { id: 'CraftingSmithing', title: 'Smithing', icon: 'hammer', level: 5 },
      { id: 'CraftingAlchemy', title: 'Alchemy', icon: 'flask', level: 5 },
      { id: 'CraftingEnchanting', title: 'Enchanting', icon: 'sparkles', level: 10 },
      { id: 'CraftingCooking', title: 'Cooking', icon: 'restaurant', level: 3 },
      { id: 'CraftingMaterials', title: 'Materials', icon: 'leaf', level: 1 },
      { id: 'CraftingBlueprints', title: 'Blueprints & Recipes', icon: 'document-text', level: 5 },
    ]
  },
  {
    id: 'settings',
    title: 'GAME SETTINGS',
    icon: 'settings',
    submenus: [
      { id: 'SaveLoad', title: 'Save & Load Game', icon: 'save', level: 1 },
      { id: 'Settings', title: 'Game Settings', icon: 'game-controller', level: 1 },
      { id: 'DifficultySettings', title: 'Difficulty Mode', icon: 'warning', level: 1 },
    ]
  },
];

// Sample player data for demonstration
const SAMPLE_PLAYER = {
  name: 'Tarnished One',
  level: 25,
  class: CharacterClass.ASTROLOGER,
  subclass: CharacterSubclass.ELEMENTALIST,
  race: CharacterRace.HUMAN,
  covenant: Covenant.ACADEMY_OF_RAYA_LUCARIA,
  resources: {
    health: 450,
    maxHealth: 450,
    mana: 320,
    maxMana: 320,
    stamina: 180,
    maxStamina: 180,
    focus: 100,
    maxFocus: 100,
    runes: 24680,
  },
  stats: {
    vigor: 15,
    mind: 22,
    endurance: 12,
    strength: 10,
    dexterity: 14,
    intelligence: 25,
    faith: 7,
    arcane: 9,
  },
  activeQuests: 3,
  notifications: 2,
  region: WorldRegion.LIURNIA,
};

// Difficulty modes with descriptions
const DIFFICULTY_MODES = [
  { 
    mode: DifficultyMode.NORMAL, 
    description: 'Standard gameplay experience. Balanced for new players.',
    icon: 'leaf'
  },
  { 
    mode: DifficultyMode.HARD, 
    description: 'Increased enemy health and damage. Better loot quality.',
    icon: 'flame'
  },
  { 
    mode: DifficultyMode.VERY_HARD, 
    description: 'Significantly stronger enemies with new abilities. Superior rewards.',
    icon: 'skull'
  },
  { 
    mode: DifficultyMode.HARDCORE, 
    description: 'Permadeath. Character is deleted upon death. Exclusive rewards.',
    icon: 'warning'
  },
  { 
    mode: DifficultyMode.NIGHTMARE, 
    description: 'Maximum difficulty. Enemies are relentless. Legendary rewards possible.',
    icon: 'nuclear'
  },
];

// Server status for display
const SERVER_STATUS = {
  name: 'Limgrave-PVE-01',
  status: 'Online',
  population: 'High',
  playersOnline: 1247,
  lastRestart: '2 days ago',
};

export default function HomeScreen() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DifficultyMode.NORMAL);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  const navigation = useNavigation<NavigationProp>();
  
  // Simulate auto-save
  useEffect(() => {
    if (autoSaveEnabled) {
      const interval = setInterval(() => {
        toast.success('Game auto-saved');
      }, 300000); // Auto-save every 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled]);
  
  // Handle menu expansion/collapse
  const handleMenuPress = (menuId: string) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };
  
  // Handle submenu navigation
  const handleSubmenuPress = (menuId: string, submenu: { id: string, title: string, level: number }) => {
    // Check if player meets level requirement
    if (SAMPLE_PLAYER.level < submenu.level) {
      toast.error(`Requires level ${submenu.level} to access ${submenu.title}`);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate to the appropriate screen
      try {
        navigation.navigate(submenu.id as keyof RootStackParamList);
        toast.success(`Navigating to ${submenu.title}`);
      } catch (error) {
        toast.error('This feature is not yet implemented');
      }
    }, 500);
  };
  
  // Handle long press for tooltips
  const handleLongPress = (id: string) => {
    setShowTooltip(id);
    setTimeout(() => setShowTooltip(null), 3000); // Hide tooltip after 3 seconds
  };
  
  // Handle difficulty change
  const changeDifficulty = (difficulty: DifficultyMode) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyModal(false);
    toast.success(`Difficulty changed to ${difficulty}`);
  };
  
  // Handle save game
  const handleSaveGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Game saved successfully');
    }, 1000);
  };
  
  // Render resource bar
  const renderResourceBar = (current: number, max: number, color: string, icon: string) => (
    <View style={styles.resourceBarContainer}>
      <Ionicons name={icon} size={14} color={color} style={styles.resourceIcon} />
      <View style={styles.resourceBarBackground}>
        <View 
          style={[
            styles.resourceBarFill, 
            { width: `${(current / max) * 100}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.resourceText}>{current}/{max}</Text>
    </View>
  );
  
  // Render character sheet modal
  const renderCharacterSheet = () => (
    <Modal
      visible={showCharacterSheet}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCharacterSheet(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.characterSheetContainer}>
          <View style={styles.characterSheetHeader}>
            <Text style={styles.characterSheetTitle}>Character Sheet</Text>
            <TouchableOpacity onPress={() => setShowCharacterSheet(false)}>
              <Ionicons name="close" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.characterSheetContent}>
            {/* Character basic info */}
            <View style={styles.characterBasicInfo}>
              <View style={styles.characterPortrait}>
                <ImageBackground
                  source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20character%20portrait%20mage&aspect=1:1&seed=astrologer' }}
                  style={styles.portraitImage}
                  borderRadius={40}
                >
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{SAMPLE_PLAYER.level}</Text>
                  </View>
                </ImageBackground>
              </View>
              
              <View style={styles.characterInfo}>
                <Text style={styles.characterName}>{SAMPLE_PLAYER.name}</Text>
                <Text style={styles.characterClass}>
                  {SAMPLE_PLAYER.race} {SAMPLE_PLAYER.class}
                  {SAMPLE_PLAYER.subclass ? ` / ${SAMPLE_PLAYER.subclass}` : ''}
                </Text>
                <Text style={styles.characterCovenant}>{SAMPLE_PLAYER.covenant}</Text>
                <Text style={styles.characterRegion}>Region: {SAMPLE_PLAYER.region}</Text>
              </View>
            </View>
            
            {/* Character resources */}
            <View style={styles.resourcesContainer}>
              {renderResourceBar(SAMPLE_PLAYER.resources.health, SAMPLE_PLAYER.resources.maxHealth, '#c02d28', 'heart')}
              {renderResourceBar(SAMPLE_PLAYER.resources.mana, SAMPLE_PLAYER.resources.maxMana, '#2846c0', 'water')}
              {renderResourceBar(SAMPLE_PLAYER.resources.stamina, SAMPLE_PLAYER.resources.maxStamina, '#28c04c', 'battery-full')}
            </View>
            
            {/* Character stats */}
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Attributes</Text>
              <View style={styles.statsGrid}>
                {Object.entries(SAMPLE_PLAYER.stats).map(([stat, value]) => (
                  <View key={stat} style={styles.statItem}>
                    <Text style={styles.statName}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</Text>
                    <Text style={styles.statValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Runes */}
            <View style={styles.runesContainer}>
              <FontAwesome5 name="coins" size={18} color="#D4AF37" />
              <Text style={styles.runesText}>{SAMPLE_PLAYER.resources.runes.toLocaleString()} Runes</Text>
            </View>
            
            {/* Active quests */}
            <View style={styles.questsContainer}>
              <Text style={styles.sectionTitle}>Active Quests: {SAMPLE_PLAYER.activeQuests}</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  
  // Render difficulty selection modal
  const renderDifficultyModal = () => (
    <Modal
      visible={showDifficultyModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDifficultyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.difficultyModalContainer}>
          <View style={styles.difficultyModalHeader}>
            <Text style={styles.difficultyModalTitle}>Select Difficulty</Text>
            <TouchableOpacity onPress={() => setShowDifficultyModal(false)}>
              <Ionicons name="close" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.difficultyModalContent}>
            {DIFFICULTY_MODES.map((difficulty) => (
              <TouchableOpacity
                key={difficulty.mode}
                style={[
                  styles.difficultyOption,
                  selectedDifficulty === difficulty.mode && styles.selectedDifficulty
                ]}
                onPress={() => changeDifficulty(difficulty.mode)}
              >
                <Ionicons name={difficulty.icon} size={24} color="#D4AF37" style={styles.difficultyIcon} />
                <View style={styles.difficultyInfo}>
                  <Text style={styles.difficultyName}>{difficulty.mode}</Text>
                  <Text style={styles.difficultyDescription}>{difficulty.description}</Text>
                </View>
                {selectedDifficulty === difficulty.mode && (
                  <Ionicons name="checkmark-circle" size={24} color="#D4AF37" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  
  // Loading overlay
  const renderLoadingOverlay = () => (
    isLoading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  );
  
  return (
    <ImageBackground 
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20landscape%20with%20ruins%20and%20glowing%20tree&aspect=9:16&seed=eldenring' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        {/* Header with character info */}
        <View style={styles.header}>
          <Text style={styles.title}>YGGDRASIL CHRONICLES</Text>
          <Text style={styles.subtitle}>THE SHATTERED REALMS</Text>
          
          {/* Character summary bar */}
          <TouchableOpacity 
            style={styles.characterBar}
            onPress={() => setShowCharacterSheet(true)}
          >
            <View style={styles.characterIconContainer}>
              <ImageBackground
                source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20character%20portrait%20mage&aspect=1:1&seed=astrologer' }}
                style={styles.characterIcon}
                borderRadius={20}
              >
                <View style={styles.characterLevelBadge}>
                  <Text style={styles.characterLevelText}>{SAMPLE_PLAYER.level}</Text>
                </View>
              </ImageBackground>
            </View>
            
            <View style={styles.characterSummary}>
              <Text style={styles.characterName}>{SAMPLE_PLAYER.name}</Text>
              <Text style={styles.characterDetails}>
                {SAMPLE_PLAYER.race} {SAMPLE_PLAYER.class} • {SAMPLE_PLAYER.region}
              </Text>
            </View>
            
            <View style={styles.characterNotifications}>
              {SAMPLE_PLAYER.notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{SAMPLE_PLAYER.notifications}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#D4AF37" />
            </View>
          </TouchableOpacity>
          
          {/* Resource bars */}
          <View style={styles.resourceBars}>
            {renderResourceBar(SAMPLE_PLAYER.resources.health, SAMPLE_PLAYER.resources.maxHealth, '#c02d28', 'heart')}
            {renderResourceBar(SAMPLE_PLAYER.resources.mana, SAMPLE_PLAYER.resources.maxMana, '#2846c0', 'water')}
            {renderResourceBar(SAMPLE_PLAYER.resources.stamina, SAMPLE_PLAYER.resources.maxStamina, '#28c04c', 'battery-full')}
          </View>
        </View>
        
        {/* Main menu */}
        <ScrollView style={styles.menuContainer}>
          {MAIN_MENUS.map((menu) => (
            <View key={menu.id} style={styles.menuSection}>
              <TouchableOpacity 
                style={[
                  styles.menuItem, 
                  activeMenu === menu.id && styles.activeMenuItem
                ]} 
                onPress={() => handleMenuPress(menu.id)}
              >
                <Ionicons name={menu.icon} size={24} color="#D4AF37" style={styles.menuIcon} />
                <Text style={styles.menuText}>{menu.title}</Text>
                <Ionicons 
                  name={activeMenu === menu.id ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color="#D4AF37" 
                />
              </TouchableOpacity>
              
              {activeMenu === menu.id && (
                <View style={styles.submenuContainer}>
                  {menu.submenus.map((submenu) => (
                    <Pressable 
                      key={submenu.id}
                      style={({ pressed }: { pressed: boolean }) => [
                        styles.submenuItem,
                        pressed && styles.submenuPressed,
                        SAMPLE_PLAYER.level < submenu.level && styles.submenuLocked
                      ]}
                      onPress={() => handleSubmenuPress(menu.id, submenu)}
                      onLongPress={() => handleLongPress(submenu.id)}
                      delayLongPress={500}
                    >
                      <Ionicons 
                        name={submenu.icon} 
                        size={18} 
                        color={SAMPLE_PLAYER.level < submenu.level ? "#666" : "#A89968"} 
                        style={styles.submenuIcon} 
                      />
                      <View style={styles.submenuTextContainer}>
                        <Text 
                          style={[
                            styles.submenuText,
                            SAMPLE_PLAYER.level < submenu.level && styles.submenuTextLocked
                          ]}
                        >
                          {submenu.title}
                        </Text>
                        
                        {SAMPLE_PLAYER.level < submenu.level && (
                          <Text style={styles.levelRequirement}>Requires Level {submenu.level}</Text>
                        )}
                      </View>
                      
                      {showTooltip === submenu.id && (
                        <View style={styles.tooltip}>
                          <Text style={styles.tooltipText}>
                            {submenu.title}: Access {menu.id.toLowerCase()} features and information
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        
        {/* Footer with server info and action buttons */}
        <View style={styles.footer}>
          <View style={styles.serverInfo}>
            <View style={styles.serverStatusIndicator} />
            <Text style={styles.serverText}>
              {SERVER_STATUS.name} • {SERVER_STATUS.playersOnline} Online
            </Text>
          </View>
          
          <View style={styles.footerActions}>
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={handleSaveGame}
            >
              <Ionicons name="save" size={18} color="#A89968" />
              <Text style={styles.footerButtonText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={() => setShowDifficultyModal(true)}
            >
              <Ionicons name="options" size={18} color="#A89968" />
              <Text style={styles.footerButtonText}>Difficulty: {selectedDifficulty}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={() => setAutoSaveEnabled(!autoSaveEnabled)}
            >
              <Ionicons name={autoSaveEnabled ? "checkbox" : "square-outline"} size={18} color="#A89968" />
              <Text style={styles.footerButtonText}>Auto-Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      {/* Modals */}
      {renderCharacterSheet()}
      {renderDifficultyModal()}
      {renderLoadingOverlay()}
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#A89968',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    letterSpacing: 1,
  },
  characterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 10,
    padding: 8,
    marginVertical: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  characterIconContainer: {
    marginRight: 10,
  },
  characterIcon: {
    width: 40,
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  characterLevelBadge: {
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterLevelText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  characterSummary: {
    flex: 1,
  },
  characterName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterDetails: {
    color: '#A89968',
    fontSize: 12,
  },
  characterNotifications: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    backgroundColor: '#c02d28',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resourceBars: {
    width: '100%',
    marginTop: 8,
  },
  resourceBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resourceIcon: {
    marginRight: 5,
  },
  resourceBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  resourceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  resourceText: {
    color: '#A89968',
    fontSize: 10,
    marginLeft: 5,
    width: 60,
    textAlign: 'right',
  },
  menuContainer: {
    flex: 1,
    marginVertical: 10,
  },
  menuSection: {
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  activeMenuItem: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  submenuContainer: {
    marginLeft: 20,
    marginTop: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#3A3A3A',
    paddingLeft: 12,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 6,
    position: 'relative',
  },
  submenuPressed: {
    backgroundColor: 'rgba(50, 45, 30, 0.7)',
  },
  submenuLocked: {
    opacity: 0.6,
  },
  submenuIcon: {
    marginRight: 10,
  },
  submenuTextContainer: {
    flex: 1,
  },
  submenuText: {
    fontSize: 16,
    color: '#A89968',
  },
  submenuTextLocked: {
    color: '#666',
  },
  levelRequirement: {
    fontSize: 12,
    color: '#c02d28',
    marginTop: 2,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
    top: -40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  tooltipText: {
    color: '#D4AF37',
    fontSize: 12,
  },
  footer: {
    marginTop: 10,
  },
  serverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serverStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28c04c',
    marginRight: 5,
  },
  serverText: {
    fontSize: 12,
    color: '#A89968',
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 4,
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  footerButtonText: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 5,
  },
  
  // Character sheet modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  characterSheetContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  characterSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  characterSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  characterSheetContent: {
    flex: 1,
  },
  characterBasicInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  characterPortrait: {
    marginRight: 16,
  },
  portraitImage: {
    width: 80,
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  levelBadge: {
    backgroundColor: '#D4AF37',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  levelText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  characterClass: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  characterCovenant: {
    color: '#D4AF37',
    fontSize: 14,
    marginBottom: 4,
  },
  characterRegion: {
    color: '#A89968',
    fontSize: 12,
  },
  resourcesContainer: {
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingRight: 16,
  },
  statName: {
    color: '#A89968',
    fontSize: 14,
  },
  statValue: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
  },
  runesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  runesText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  questsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  viewAllText: {
    color: '#D4AF37',
    fontSize: 12,
  },
  
  // Difficulty modal styles
  difficultyModalContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '70%',
    padding: 16,
  },
  difficultyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  difficultyModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  difficultyModalContent: {
    flex: 1,
  },
  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 6,
  },
  selectedDifficulty: {
    backgroundColor: 'rgba(50, 45, 30, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  difficultyIcon: {
    marginRight: 12,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 2,
  },
  difficultyDescription: {
    fontSize: 12,
    color: '#A89968',
  },
  
  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#D4AF37',
    fontSize: 16,
    marginTop: 10,
  },
});