import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground,
  Modal,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { 
  DungeonType, 
  WorldRegion, 
  ItemRarity 
} from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample dungeons data
const DUNGEONS = [
  {
    id: 'dungeon-1',
    name: 'Murkwater Catacombs',
    description: 'Ancient burial grounds filled with undead and traps.',
    type: DungeonType.CATACOMBS,
    region: WorldRegion.LIMGRAVE,
    minLevel: 10,
    recommendedLevel: 15,
    playerLimit: {
      min: 1,
      max: 4,
    },
    bosses: ['Cemetery Shade'],
    rewards: {
      guaranteed: [
        { id: 'sacred-tear', name: 'Sacred Tear', rarity: ItemRarity.RARE },
      ],
      possible: [
        { id: 'ghostflame-torch', name: 'Ghostflame Torch', rarity: ItemRarity.UNCOMMON, dropChance: 20 },
        { id: 'grave-glovewort', name: 'Grave Glovewort', rarity: ItemRarity.COMMON, dropChance: 50 },
      ],
      runes: { min: 5000, max: 8000 },
      experience: 2000,
    },
    completed: false,
    imageUrl: 'https://api.a0.dev/assets/image?text=Dark%20catacombs%20with%20graves&aspect=16:9&seed=catacombs',
  },
  {
    id: 'dungeon-2',
    name: 'Stormfoot Cavern',
    description: 'A winding cave system inhabited by bandits and wild beasts.',
    type: DungeonType.CAVE,
    region: WorldRegion.LIMGRAVE,
    minLevel: 5,
    recommendedLevel: 8,
    playerLimit: {
      min: 1,
      max: 4,
    },
    bosses: ['Beastman of Farum Azula'],
    rewards: {
      guaranteed: [
        { id: 'beast-claw', name: 'Beast Claw', rarity: ItemRarity.RARE },
      ],
      possible: [
        { id: 'beast-blood', name: 'Beast Blood', rarity: ItemRarity.UNCOMMON, dropChance: 30 },
        { id: 'cave-moss', name: 'Cave Moss', rarity: ItemRarity.COMMON, dropChance: 70 },
      ],
      runes: { min: 3000, max: 5000 },
      experience: 1500,
    },
    completed: true,
    imageUrl: 'https://api.a0.dev/assets/image?text=Dark%20cave%20with%20stalactites&aspect=16:9&seed=cave',
  },
  {
    id: 'dungeon-3',
    name: 'Sellia Crystal Tunnel',
    description: 'A crystalline mine infested with dangerous insects and crystal enemies.',
    type: DungeonType.MINE,
    region: WorldRegion.CAELID,
    minLevel: 40,
    recommendedLevel: 50,
    playerLimit: {
      min: 2,
      max: 4,
    },
    bosses: ['Fallingstar Beast'],
    rewards: {
      guaranteed: [
        { id: 'somber-smithing-stone', name: 'Somber Smithing Stone', rarity: ItemRarity.EPIC },
      ],
      possible: [
        { id: 'gravity-stone', name: 'Gravity Stone', rarity: ItemRarity.RARE, dropChance: 15 },
        { id: 'crystal-bud', name: 'Crystal Bud', rarity: ItemRarity.UNCOMMON, dropChance: 40 },
      ],
      runes: { min: 15000, max: 20000 },
      experience: 5000,
    },
    completed: false,
    imageUrl: 'https://api.a0.dev/assets/image?text=Crystal%20cave%20with%20blue%20glow&aspect=16:9&seed=crystal',
  },
  {
    id: 'dungeon-4',
    name: 'Castle Morne',
    description: 'An abandoned castle at the edge of the Weeping Peninsula, now home to monstrosities.',
    type: DungeonType.CASTLE,
    region: WorldRegion.WEEPING_PENINSULA,
    minLevel: 20,
    recommendedLevel: 25,
    playerLimit: {
      min: 2,
      max: 4,
    },
    bosses: ['Leonine Misbegotten'],
    rewards: {
      guaranteed: [
        { id: 'grafted-blade', name: 'Grafted Blade Greatsword', rarity: ItemRarity.LEGENDARY },
      ],
      possible: [
        { id: 'misbegotten-claw', name: 'Misbegotten Claw', rarity: ItemRarity.RARE, dropChance: 10 },
        { id: 'castle-key', name: 'Castle Key', rarity: ItemRarity.UNCOMMON, dropChance: 25 },
      ],
      runes: { min: 10000, max: 15000 },
      experience: 4000,
    },
    completed: false,
    imageUrl: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20castle%20ruins&aspect=16:9&seed=castle',
  },
  {
    id: 'dungeon-5',
    name: 'Raya Lucaria Crystal Cave',
    description: 'A hidden crystal cave beneath the Academy of Raya Lucaria.',
    type: DungeonType.CAVE,
    region: WorldRegion.LIURNIA,
    minLevel: 30,
    recommendedLevel: 35,
    playerLimit: {
      min: 1,
      max: 4,
    },
    bosses: ['Crystalian Duo'],
    rewards: {
      guaranteed: [
        { id: 'crystal-tear', name: 'Crystal Tear', rarity: ItemRarity.EPIC },
      ],
      possible: [
        { id: 'crystal-staff', name: 'Crystal Staff', rarity: ItemRarity.RARE, dropChance: 15 },
        { id: 'crystal-fragment', name: 'Crystal Fragment', rarity: ItemRarity.UNCOMMON, dropChance: 45 },
      ],
      runes: { min: 12000, max: 18000 },
      experience: 3500,
    },
    completed: false,
    imageUrl: 'https://api.a0.dev/assets/image?text=Blue%20crystal%20cave%20with%20magic&aspect=16:9&seed=crystalcave',
  },
];

// Player level for requirement checks
const PLAYER_LEVEL = 25;

export default function DungeonsListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedDungeon, setSelectedDungeon] = useState<typeof DUNGEONS[0] | null>(null);
  const [showDungeonModal, setShowDungeonModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<DungeonType | 'ALL'>('ALL');
  const [filterRegion, setFilterRegion] = useState<WorldRegion | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'level' | 'name' | 'type'>('level');
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle back navigation
  const handleBack = () => {
    navigation.navigate('Home');
  };
  
  // Open dungeon details modal
  const handleDungeonPress = (dungeon: typeof DUNGEONS[0]) => {
    setSelectedDungeon(dungeon);
    setShowDungeonModal(true);
  };
  
  // Close dungeon details modal
  const handleCloseDungeonModal = () => {
    setShowDungeonModal(false);
    setSelectedDungeon(null);
  };
  
  // Enter dungeon
  const handleEnterDungeon = () => {
    if (!selectedDungeon) return;
    
    // Check level requirement
    if (PLAYER_LEVEL < selectedDungeon.minLevel) {
      toast.error(`You need to be at least level ${selectedDungeon.minLevel} to enter this dungeon.`);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setShowDungeonModal(false);
      
      // Navigate to dungeon detail screen
      navigation.navigate('DungeonDetail', { dungeonId: selectedDungeon.id });
      toast.success(`Entering ${selectedDungeon.name}`);
    }, 1500);
  };
  
  // Toggle filters panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Apply filters and sorting
  const getFilteredDungeons = () => {
    let filtered = [...DUNGEONS];
    
    // Apply type filter
    if (filterType !== 'ALL') {
      filtered = filtered.filter(dungeon => dungeon.type === filterType);
    }
    
    // Apply region filter
    if (filterRegion !== 'ALL') {
      filtered = filtered.filter(dungeon => dungeon.region === filterRegion);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'level':
        filtered.sort((a, b) => a.recommendedLevel - b.recommendedLevel);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
    }
    
    return filtered;
  };
  
  // Render dungeon card
  const renderDungeonCard = ({ item }: { item: typeof DUNGEONS[0] }) => {
    const isLocked = PLAYER_LEVEL < item.minLevel;
    
    return (
      <TouchableOpacity 
        style={[
          styles.dungeonCard,
          isLocked && styles.lockedDungeon,
          item.completed && styles.completedDungeon
        ]}
        onPress={() => handleDungeonPress(item)}
        disabled={isLocked}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.dungeonImage}
          imageStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={styles.dungeonImageOverlay}
          >
            <View style={styles.dungeonTypeContainer}>
              <Text style={styles.dungeonType}>{item.type}</Text>
            </View>
            
            {item.completed && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#28c04c" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
            
            {isLocked && (
              <View style={styles.lockedBadge}>
                <Ionicons name="lock-closed" size={16} color="#c02d28" />
                <Text style={styles.lockedText}>Locked</Text>
              </View>
            )}
          </LinearGradient>
        </ImageBackground>
        
        <View style={styles.dungeonInfo}>
          <Text style={styles.dungeonName}>{item.name}</Text>
          <Text style={styles.dungeonRegion}>{item.region}</Text>
          
          <View style={styles.dungeonStats}>
            <View style={styles.dungeonStat}>
              <Ionicons name="people" size={14} color="#A89968" />
              <Text style={styles.dungeonStatText}>{item.playerLimit.min}-{item.playerLimit.max}</Text>
            </View>
            
            <View style={styles.dungeonStat}>
              <Ionicons name="stats-chart" size={14} color="#A89968" />
              <Text style={styles.dungeonStatText}>Lvl {item.recommendedLevel}</Text>
            </View>
            
            <View style={styles.dungeonStat}>
              <Ionicons name="skull" size={14} color="#A89968" />
              <Text style={styles.dungeonStatText}>{item.bosses.length}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render dungeon details modal
  const renderDungeonModal = () => {
    if (!selectedDungeon) return null;
    
    const isLocked = PLAYER_LEVEL < selectedDungeon.minLevel;
    
    return (
      <Modal
        visible={showDungeonModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDungeonModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dungeonModalContainer}>
            <View style={styles.dungeonModalHeader}>
              <Text style={styles.dungeonModalTitle}>{selectedDungeon.name}</Text>
              <TouchableOpacity onPress={handleCloseDungeonModal}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.dungeonModalContent}>
              <Image
                source={{ uri: selectedDungeon.imageUrl }}
                style={styles.dungeonModalImage}
              />
              
              <View style={styles.dungeonModalInfo}>
                <View style={styles.dungeonModalTypeRegion}>
                  <View style={styles.dungeonModalType}>
                    <Text style={styles.dungeonModalTypeText}>{selectedDungeon.type}</Text>
                  </View>
                  <Text style={styles.dungeonModalRegion}>{selectedDungeon.region}</Text>
                </View>
                
                <Text style={styles.dungeonModalDescription}>{selectedDungeon.description}</Text>
                
                <View style={styles.dungeonModalRequirements}>
                  <Text style={styles.dungeonModalSectionTitle}>Requirements</Text>
                  
                  <View style={styles.dungeonModalRequirement}>
                    <Text style={styles.dungeonModalRequirementLabel}>Minimum Level:</Text>
                    <Text 
                      style={[
                        styles.dungeonModalRequirementValue,
                        PLAYER_LEVEL < selectedDungeon.minLevel && styles.requirementNotMet
                      ]}
                    >
                      {selectedDungeon.minLevel}
                      {PLAYER_LEVEL < selectedDungeon.minLevel ? ' (Not Met)' : ' (Met)'}
                    </Text>
                  </View>
                  
                  <View style={styles.dungeonModalRequirement}>
                    <Text style={styles.dungeonModalRequirementLabel}>Recommended Level:</Text>
                    <Text style={styles.dungeonModalRequirementValue}>{selectedDungeon.recommendedLevel}</Text>
                  </View>
                  
                  <View style={styles.dungeonModalRequirement}>
                    <Text style={styles.dungeonModalRequirementLabel}>Party Size:</Text>
                    <Text style={styles.dungeonModalRequirementValue}>
                      {selectedDungeon.playerLimit.min}-{selectedDungeon.playerLimit.max} Players
                    </Text>
                  </View>
                </View>
                
                <View style={styles.dungeonModalBosses}>
                  <Text style={styles.dungeonModalSectionTitle}>Bosses</Text>
                  
                  {selectedDungeon.bosses.map((boss, index) => (
                    <View key={index} style={styles.dungeonModalBoss}>
                      <Ionicons name="skull" size={18} color="#D4AF37" style={styles.bossIcon} />
                      <Text style={styles.bossName}>{boss}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.dungeonModalRewards}>
                  <Text style={styles.dungeonModalSectionTitle}>Rewards</Text>
                  
                  <Text style={styles.rewardsCategoryTitle}>Guaranteed</Text>
                  {selectedDungeon.rewards.guaranteed.map((reward, index) => (
                    <View key={index} style={styles.rewardItem}>
                      <View 
                        style={[
                          styles.rarityIndicator, 
                          { backgroundColor: getRarityColor(reward.rarity) }
                        ]} 
                      />
                      <Text style={styles.rewardName}>{reward.name}</Text>
                      <Text style={[styles.rewardRarity, { color: getRarityColor(reward.rarity) }]}>
                        {reward.rarity}
                      </Text>
                    </View>
                  ))}
                  
                  <Text style={styles.rewardsCategoryTitle}>Possible Drops</Text>
                  {selectedDungeon.rewards.possible.map((reward, index) => (
                    <View key={index} style={styles.rewardItem}>
                      <View 
                        style={[
                          styles.rarityIndicator, 
                          { backgroundColor: getRarityColor(reward.rarity) }
                        ]} 
                      />
                      <Text style={styles.rewardName}>{reward.name}</Text>
                      <Text style={styles.rewardDropChance}>{reward.dropChance}%</Text>
                      <Text style={[styles.rewardRarity, { color: getRarityColor(reward.rarity) }]}>
                        {reward.rarity}
                      </Text>
                    </View>
                  ))}
                  
                  <View style={styles.runesExpContainer}>
                    <View style={styles.runesContainer}>
                      <FontAwesome5 name="coins" size={14} color="#D4AF37" />
                      <Text style={styles.runesText}>
                        {selectedDungeon.rewards.runes.min.toLocaleString()} - {selectedDungeon.rewards.runes.max.toLocaleString()} Runes
                      </Text>
                    </View>
                    
                    <View style={styles.expContainer}>
                      <Ionicons name="star" size={14} color="#D4AF37" />
                      <Text style={styles.expText}>
                        {selectedDungeon.rewards.experience.toLocaleString()} XP
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={[
                styles.enterDungeonButton,
                isLocked && styles.disabledButton
              ]}
              onPress={handleEnterDungeon}
              disabled={isLocked}
            >
              <Text style={styles.enterDungeonText}>
                {isLocked ? `Requires Level ${selectedDungeon.minLevel}` : 'Enter Dungeon'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  // Render filters panel
  const renderFiltersPanel = () => {
    return (
      <View style={[styles.filtersPanel, !showFilters && styles.hiddenFiltersPanel]}>
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Dungeon Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filterType === 'ALL' && styles.activeFilterOption
              ]}
              onPress={() => setFilterType('ALL')}
            >
              <Text style={[
                styles.filterOptionText,
                filterType === 'ALL' && styles.activeFilterOptionText
              ]}>All</Text>
            </TouchableOpacity>
            
            {Object.values(DungeonType).map((type) => (
              <TouchableOpacity 
                key={type}
                style={[
                  styles.filterOption,
                  filterType === type && styles.activeFilterOption
                ]}
                onPress={() => setFilterType(type)}
              >
                <Text style={[
                  styles.filterOptionText,
                  filterType === type && styles.activeFilterOptionText
                ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Region</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filterRegion === 'ALL' && styles.activeFilterOption
              ]}
              onPress={() => setFilterRegion('ALL')}
            >
              <Text style={[
                styles.filterOptionText,
                filterRegion === 'ALL' && styles.activeFilterOptionText
              ]}>All</Text>
            </TouchableOpacity>
            
            {[WorldRegion.LIMGRAVE, WorldRegion.WEEPING_PENINSULA, WorldRegion.LIURNIA, WorldRegion.CAELID].map((region) => (
              <TouchableOpacity 
                key={region}
                style={[
                  styles.filterOption,
                  filterRegion === region && styles.activeFilterOption
                ]}
                onPress={() => setFilterRegion(region)}
              >
                <Text style={[
                  styles.filterOptionText,
                  filterRegion === region && styles.activeFilterOptionText
                ]}>{region}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Sort By</Text>
          <View style={styles.sortOptions}>
            <TouchableOpacity 
              style={[
                styles.sortOption,
                sortBy === 'level' && styles.activeSortOption
              ]}
              onPress={() => setSortBy('level')}
            >
              <Ionicons 
                name="stats-chart" 
                size={16} 
                color={sortBy === 'level' ? '#D4AF37' : '#A89968'} 
              />
              <Text style={[
                styles.sortOptionText,
                sortBy === 'level' && styles.activeSortOptionText
              ]}>Level</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sortOption,
                sortBy === 'name' && styles.activeSortOption
              ]}
              onPress={() => setSortBy('name')}
            >
              <Ionicons 
                name="text" 
                size={16} 
                color={sortBy === 'name' ? '#D4AF37' : '#A89968'} 
              />
              <Text style={[
                styles.sortOptionText,
                sortBy === 'name' && styles.activeSortOptionText
              ]}>Name</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sortOption,
                sortBy === 'type' && styles.activeSortOption
              ]}
              onPress={() => setSortBy('type')}
            >
              <Ionicons 
                name="apps" 
                size={16} 
                color={sortBy === 'type' ? '#D4AF37' : '#A89968'} 
              />
              <Text style={[
                styles.sortOptionText,
                sortBy === 'type' && styles.activeSortOptionText
              ]}>Type</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  // Get color based on item rarity
  const getRarityColor = (rarity: ItemRarity) => {
    switch (rarity) {
      case ItemRarity.COMMON:
        return '#9e9e9e';
      case ItemRarity.UNCOMMON:
        return '#1eb53a';
      case ItemRarity.RARE:
        return '#3498db';
      case ItemRarity.EPIC:
        return '#9b59b6';
      case ItemRarity.LEGENDARY:
        return '#f39c12';
      case ItemRarity.MYTHIC:
        return '#e74c3c';
      case ItemRarity.ARTIFACT:
        return '#1abc9c';
      default:
        return '#ffffff';
    }
  };
  
  // Loading overlay
  const renderLoadingOverlay = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Entering Dungeon...</Text>
      </View>
    );
  };
  
  return (
    <ImageBackground 
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20dungeon%20entrance%20with%20torches&aspect=9:16&seed=dungeons' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#D4AF37" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Dungeons</Text>
          
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
            <Ionicons name="options" size={24} color="#D4AF37" />
          </TouchableOpacity>
        </View>
        
        {/* Filters panel */}
        {renderFiltersPanel()}
        
        {/* Dungeons list */}
        <FlatList
          data={getFilteredDungeons()}
          renderItem={renderDungeonCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.dungeonsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Ionicons name="search" size={48} color="#A89968" />
              <Text style={styles.emptyListText}>No dungeons match your filters</Text>
            </View>
          }
        />
        
        {/* Modals */}
        {renderDungeonModal()}
        {renderLoadingOverlay()}
      </LinearGradient>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  filterButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  filtersPanel: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    maxHeight: 200,
  },
  hiddenFiltersPanel: {
    height: 0,
    padding: 0,
    marginBottom: 0,
    borderWidth: 0,
    overflow: 'hidden',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterSectionTitle: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  activeFilterOption: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderColor: '#D4AF37',
  },
  filterOptionText: {
    color: '#A89968',
    fontSize: 12,
  },
  activeFilterOptionText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  activeSortOption: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderColor: '#D4AF37',
  },
  sortOptionText: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 4,
  },
  activeSortOptionText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  dungeonsList: {
    paddingBottom: 20,
  },
  dungeonCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    overflow: 'hidden',
  },
  lockedDungeon: {
    opacity: 0.7,
  },
  completedDungeon: {
    borderColor: '#28c04c',
  },
  dungeonImage: {
    height: 120,
    justifyContent: 'flex-end',
  },
  dungeonImageOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dungeonTypeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dungeonType: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 192, 76, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    color: '#28c04c',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(192, 45, 40, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lockedText: {
    color: '#c02d28',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  dungeonInfo: {
    padding: 12,
  },
  dungeonName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dungeonRegion: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 8,
  },
  dungeonStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dungeonStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dungeonStatText: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyListText: {
    color: '#A89968',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dungeonModalContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '90%',
  },
  dungeonModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  dungeonModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  dungeonModalContent: {
    flex: 1,
  },
  dungeonModalImage: {
    width: '100%',
    height: 180,
  },
  dungeonModalInfo: {
    padding: 16,
  },
  dungeonModalTypeRegion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dungeonModalType: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  dungeonModalTypeText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dungeonModalRegion: {
    color: '#A89968',
    fontSize: 14,
  },
  dungeonModalDescription: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  dungeonModalRequirements: {
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dungeonModalSectionTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 4,
  },
  dungeonModalRequirement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dungeonModalRequirementLabel: {
    color: '#A89968',
    fontSize: 14,
  },
  dungeonModalRequirementValue: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
  },
  requirementNotMet: {
    color: '#c02d28',
  },
  dungeonModalBosses: {
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dungeonModalBoss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bossIcon: {
    marginRight: 8,
  },
  bossName: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dungeonModalRewards: {
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  rewardsCategoryTitle: {
    color: '#A89968',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 4,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rarityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rewardName: {
    color: '#A89968',
    fontSize: 14,
    flex: 1,
  },
  rewardDropChance: {
    color: '#A89968',
    fontSize: 12,
    marginRight: 8,
  },
  rewardRarity: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  runesExpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  runesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runesText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  expContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  enterDungeonButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  enterDungeonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
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