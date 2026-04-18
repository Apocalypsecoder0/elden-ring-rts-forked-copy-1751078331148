import React, { useState, useEffect } from 'react';
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
  TextInput,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Local type definitions for crafting
interface InventoryItem {
  itemId: string;
  name: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'tool' | 'key';
}

interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  station: string;
  levelRequired: number;
  materials: {
    itemId: string;
    name: string;
    quantity: number;
  }[];
  result: {
    itemId: string;
    name: string;
    quantity: number;
    type: string;
  };
  craftingTime: number; // in seconds
  experienceGained: number;
}

interface CraftingStation {
  id: string;
  name: string;
  description: string;
  location: string;
  levelRequired: number;
  recipes: string[]; // recipe IDs
  accessibility: 'unlocked' | 'locked' | 'discovered';
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample crafting stations
const SAMPLE_STATIONS: CraftingStation[] = [
  {
    id: 'smithing_table',
    name: 'Smithing Table',
    description: 'Forge weapons and armor from metal ores',
    location: 'Stormveil Castle',
    recipes: ['iron_sword', 'steel_armor', 'mithril_dagger'],
    requiredLevel: 1,
    icon: 'hammer',
  },
  {
    id: 'alchemy_lab',
    name: 'Alchemy Lab',
    description: 'Brew potions and create magical elixirs',
    location: 'Raya Lucaria Academy',
    recipes: ['health_potion', 'mana_potion', 'strength_elixir'],
    requiredLevel: 5,
    icon: 'flask',
  },
  {
    id: 'enchanting_table',
    name: 'Enchanting Table',
    description: 'Imbue items with magical properties',
    location: 'Leyndell, Royal Capital',
    recipes: ['flame_enchant', 'frost_enchant', 'lightning_enchant'],
    requiredLevel: 15,
    icon: 'magic-wand',
  },
  {
    id: 'cooking_fire',
    name: 'Cooking Fire',
    description: 'Prepare meals and cooking items',
    location: 'Various Locations',
    recipes: ['hearty_meal', 'mana_stew', 'strength_stew'],
    requiredLevel: 1,
    icon: 'fire',
  },
];

// Sample recipes
const SAMPLE_RECIPES: CraftingRecipe[] = [
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A sturdy sword forged from iron',
    type: 'weapon',
    station: 'smithing_table',
    level: 1,
    materials: [
      { itemId: 'iron_ore', name: 'Iron Ore', quantity: 3 },
      { itemId: 'wood', name: 'Wood', quantity: 2 },
    ],
    result: { itemId: 'iron_sword', name: 'Iron Sword', quantity: 1 },
    craftingTime: 30, // seconds
    experience: 50,
  },
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores health when consumed',
    type: 'consumable',
    station: 'alchemy_lab',
    level: 1,
    materials: [
      { itemId: 'red_herb', name: 'Red Herb', quantity: 2 },
      { itemId: 'empty_bottle', name: 'Empty Bottle', quantity: 1 },
    ],
    result: { itemId: 'health_potion', name: 'Health Potion', quantity: 1 },
    craftingTime: 15,
    experience: 25,
  },
  {
    id: 'flame_enchant',
    name: 'Flame Enchant',
    description: 'Adds fire damage to a weapon',
    type: 'enchantment',
    station: 'enchanting_table',
    level: 10,
    materials: [
      { itemId: 'fire_crystal', name: 'Fire Crystal', quantity: 1 },
      { itemId: 'ancient_scroll', name: 'Ancient Scroll', quantity: 1 },
    ],
    result: { itemId: 'flame_enchant', name: 'Flame Enchant', quantity: 1 },
    craftingTime: 60,
    experience: 100,
  },
  {
    id: 'hearty_meal',
    name: 'Hearty Meal',
    description: 'A nourishing meal that restores health and stamina',
    type: 'consumable',
    station: 'cooking_fire',
    level: 1,
    materials: [
      { itemId: 'meat', name: 'Meat', quantity: 1 },
      { itemId: 'vegetable', name: 'Vegetable', quantity: 2 },
      { itemId: 'spice', name: 'Spice', quantity: 1 },
    ],
    result: { itemId: 'hearty_meal', name: 'Hearty Meal', quantity: 1 },
    craftingTime: 20,
    experience: 30,
  },
];

// Sample inventory
const SAMPLE_INVENTORY: InventoryItem[] = [
  { itemId: 'iron_ore', name: 'Iron Ore', quantity: 5, type: 'material' },
  { itemId: 'wood', name: 'Wood', quantity: 3, type: 'material' },
  { itemId: 'red_herb', name: 'Red Herb', quantity: 4, type: 'material' },
  { itemId: 'empty_bottle', name: 'Empty Bottle', quantity: 2, type: 'material' },
  { itemId: 'meat', name: 'Meat', quantity: 2, type: 'material' },
  { itemId: 'vegetable', name: 'Vegetable', quantity: 5, type: 'material' },
];

export default function ItemCraftingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [stations, setStations] = useState<CraftingStation[]>(SAMPLE_STATIONS);
  const [recipes, setRecipes] = useState<CraftingRecipe[]>(SAMPLE_RECIPES);
  const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [selectedStation, setSelectedStation] = useState<CraftingStation | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [showStationDetails, setShowStationDetails] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftingProgress, setCraftingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [playerLevel] = useState(25);
  const [craftingSkill] = useState(15);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || recipe.type === selectedType;
    const matchesStation = !selectedStation || recipe.station === selectedStation.id;
    return matchesSearch && matchesType && matchesStation;
  });

  const canCraftRecipe = (recipe: CraftingRecipe) => {
    // Check level requirement
    if (recipe.level > playerLevel) return false;

    // Check materials
    return recipe.materials.every(material => {
      const inventoryItem = inventory.find(item => item.itemId === material.itemId);
      return inventoryItem && inventoryItem.quantity >= material.quantity;
    });
  };

  const startCrafting = (recipe: CraftingRecipe) => {
    if (!canCraftRecipe(recipe)) {
      toast.error('Missing materials or insufficient level!');
      return;
    }

    setIsCrafting(true);
    setCraftingProgress(0);

    // Simulate crafting progress
    const interval = setInterval(() => {
      setCraftingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeCrafting(recipe);
          return 100;
        }
        return prev + 2;
      });
    }, recipe.craftingTime * 10); // Progress over crafting time
  };

  const completeCrafting = (recipe: CraftingRecipe) => {
    // Remove materials
    setInventory(prev => prev.map(item => {
      const material = recipe.materials.find(m => m.itemId === item.itemId);
      if (material) {
        return { ...item, quantity: item.quantity - material.quantity };
      }
      return item;
    }).filter(item => item.quantity > 0));

    // Add result
    setInventory(prev => {
      const existingItem = prev.find(item => item.itemId === recipe.result.itemId);
      if (existingItem) {
        return prev.map(item =>
          item.itemId === recipe.result.itemId
            ? { ...item, quantity: item.quantity + recipe.result.quantity }
            : item
        );
      } else {
        return [...prev, {
          itemId: recipe.result.itemId,
          name: recipe.result.name,
          quantity: recipe.result.quantity,
          type: recipe.type as any,
        }];
      }
    });

    setIsCrafting(false);
    setCraftingProgress(0);
    toast.success(`Crafted ${recipe.result.name}!`);
  };

  const getRecipeIcon = (type: string) => {
    switch (type) {
      case 'weapon': return 'sword';
      case 'armor': return 'shield';
      case 'consumable': return 'potion';
      case 'enchantment': return 'magic-wand';
      case 'tool': return 'hammer';
      default: return 'cog';
    }
  };

  const getStationIcon = (icon: string) => {
    switch (icon) {
      case 'hammer': return 'hammer';
      case 'flask': return 'flask';
      case 'magic-wand': return 'magic-wand';
      case 'fire': return 'fire';
      default: return 'cog';
    }
  };

  const renderStationItem = ({ item }: { item: CraftingStation }) => {
    const isAccessible = item.requiredLevel <= playerLevel;
    const recipeCount = recipes.filter(r => r.station === item.id).length;

    return (
      <TouchableOpacity
        style={[styles.stationItem, !isAccessible && styles.lockedStation]}
        onPress={() => {
          if (isAccessible) {
            setSelectedStation(item);
            setShowStationDetails(true);
          } else {
            toast.error(`Requires level ${item.requiredLevel} to access!`);
          }
        }}
      >
        <View style={styles.stationHeader}>
          <View style={styles.stationIcon}>
            <FontAwesome5 name={getStationIcon(item.icon)} size={24} color="#D4AF37" />
          </View>
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{item.name}</Text>
            <Text style={styles.stationLocation}>{item.location}</Text>
          </View>
          {!isAccessible && (
            <View style={styles.lockedBadge}>
              <Ionicons name="lock-closed" size={16} color="#FF6347" />
            </View>
          )}
        </View>

        <Text style={styles.stationDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.stationStats}>
          <Text style={styles.stationLevel}>Lv.{item.requiredLevel}</Text>
          <Text style={styles.stationRecipes}>{recipeCount} recipes</Text>
        </View>

        {isAccessible && (
          <TouchableOpacity
            style={styles.selectStationButton}
            onPress={() => setSelectedStation(item)}
          >
            <Text style={styles.selectStationButtonText}>Use Station</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderRecipeItem = ({ item }: { item: CraftingRecipe }) => {
    const canCraft = canCraftRecipe(item);
    const station = stations.find(s => s.id === item.station);

    return (
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() => {
          setSelectedRecipe(item);
          setShowRecipeDetails(true);
        }}
      >
        <View style={styles.recipeHeader}>
          <View style={styles.recipeIcon}>
            <FontAwesome5 name={getRecipeIcon(item.type)} size={20} color="#D4AF37" />
          </View>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeStation}>
              {station?.name || 'Unknown Station'}
            </Text>
          </View>
          <View style={styles.recipeStats}>
            <Text style={styles.recipeLevel}>Lv.{item.level}</Text>
            <Text style={styles.recipeTime}>{item.craftingTime}s</Text>
          </View>
        </View>

        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.recipeMaterials}>
          <Text style={styles.materialsTitle}>Materials:</Text>
          <View style={styles.materialsList}>
            {item.materials.slice(0, 3).map((material, index) => {
              const hasEnough = inventory.find(inv => inv.itemId === material.itemId)?.quantity >= material.quantity;
              return (
                <Text key={index} style={[styles.materialText, !hasEnough && styles.missingMaterial]}>
                  {material.quantity}x {material.name}
                </Text>
              );
            })}
            {item.materials.length > 3 && (
              <Text style={styles.moreMaterials}>+{item.materials.length - 3} more</Text>
            )}
          </View>
        </View>

        <View style={styles.recipeActions}>
          {canCraft ? (
            <TouchableOpacity
              style={styles.craftButton}
              onPress={() => startCrafting(item)}
              disabled={isCrafting}
            >
              <Text style={styles.craftButtonText}>Craft</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cannotCraft}>
              <Text style={styles.cannotCraftText}>
                {item.level > playerLevel ? `Level ${item.level} required` : 'Missing materials'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderStationDetailsModal = () => {
    if (!selectedStation) return null;

    const stationRecipes = recipes.filter(r => r.station === selectedStation.id);

    return (
      <Modal
        visible={showStationDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStationDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.stationDetailsContainer}>
            <View style={styles.stationDetailsHeader}>
              <Text style={styles.stationDetailsTitle}>Crafting Station</Text>
              <TouchableOpacity onPress={() => setShowStationDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.stationDetailsContent}>
              <View style={styles.stationDetailHeader}>
                <View style={styles.detailStationIcon}>
                  <FontAwesome5 name={getStationIcon(selectedStation.icon)} size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailStationInfo}>
                  <Text style={styles.detailStationName}>{selectedStation.name}</Text>
                  <Text style={styles.detailStationLocation}>{selectedStation.location}</Text>
                  <Text style={styles.detailStationLevel}>Required Level: {selectedStation.requiredLevel}</Text>
                </View>
              </View>

              <Text style={styles.stationDetailDescription}>{selectedStation.description}</Text>

              <View style={styles.stationRecipesSection}>
                <Text style={styles.sectionTitle}>Available Recipes ({stationRecipes.length})</Text>
                {stationRecipes.map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.stationRecipeItem}
                    onPress={() => {
                      setSelectedRecipe(recipe);
                      setShowRecipeDetails(true);
                      setShowStationDetails(false);
                    }}
                  >
                    <View style={styles.stationRecipeIcon}>
                      <FontAwesome5 name={getRecipeIcon(recipe.type)} size={20} color="#D4AF37" />
                    </View>
                    <View style={styles.stationRecipeInfo}>
                      <Text style={styles.stationRecipeName}>{recipe.name}</Text>
                      <Text style={styles.stationRecipeType}>{recipe.type}</Text>
                    </View>
                    <View style={styles.stationRecipeStats}>
                      <Text style={styles.stationRecipeLevel}>Lv.{recipe.level}</Text>
                      <Ionicons name="chevron-forward" size={16} color="#A89968" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.stationActions}>
                <TouchableOpacity
                  style={styles.useStationButton}
                  onPress={() => {
                    setShowStationDetails(false);
                    // Station is already selected
                  }}
                >
                  <Text style={styles.useStationButtonText}>Use This Station</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderRecipeDetailsModal = () => {
    if (!selectedRecipe) return null;

    const canCraft = canCraftRecipe(selectedRecipe);
    const station = stations.find(s => s.id === selectedRecipe.station);

    return (
      <Modal
        visible={showRecipeDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRecipeDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recipeDetailsContainer}>
            <View style={styles.recipeDetailsHeader}>
              <Text style={styles.recipeDetailsTitle}>Recipe Details</Text>
              <TouchableOpacity onPress={() => setShowRecipeDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.recipeDetailsContent}>
              <View style={styles.recipeDetailHeader}>
                <View style={styles.detailRecipeIcon}>
                  <FontAwesome5 name={getRecipeIcon(selectedRecipe.type)} size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailRecipeInfo}>
                  <Text style={styles.detailRecipeName}>{selectedRecipe.name}</Text>
                  <Text style={styles.detailRecipeStation}>
                    {station?.name || 'Unknown Station'}
                  </Text>
                  <Text style={styles.detailRecipeType}>{selectedRecipe.type.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.recipeDetailDescription}>{selectedRecipe.description}</Text>

              <View style={styles.recipeStatsSection}>
                <View style={styles.recipeStatItem}>
                  <Ionicons name="trending-up" size={16} color="#A89968" />
                  <Text style={styles.recipeStatText}>Level {selectedRecipe.level}</Text>
                </View>
                <View style={styles.recipeStatItem}>
                  <Ionicons name="time" size={16} color="#A89968" />
                  <Text style={styles.recipeStatText}>{selectedRecipe.craftingTime}s</Text>
                </View>
                <View style={styles.recipeStatItem}>
                  <Ionicons name="star" size={16} color="#A89968" />
                  <Text style={styles.recipeStatText}>{selectedRecipe.experience} XP</Text>
                </View>
              </View>

              <View style={styles.materialsSection}>
                <Text style={styles.sectionTitle}>Required Materials</Text>
                {selectedRecipe.materials.map((material, index) => {
                  const inventoryItem = inventory.find(item => item.itemId === material.itemId);
                  const hasEnough = inventoryItem && inventoryItem.quantity >= material.quantity;
                  const owned = inventoryItem?.quantity || 0;

                  return (
                    <View key={index} style={styles.materialItem}>
                      <View style={styles.materialIcon}>
                        <FontAwesome5 name="cube" size={16} color={hasEnough ? "#32CD32" : "#FF6347"} />
                      </View>
                      <View style={styles.materialInfo}>
                        <Text style={[styles.materialName, !hasEnough && styles.missingMaterialName]}>
                          {material.name}
                        </Text>
                        <Text style={styles.materialQuantity}>
                          {owned}/{material.quantity}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.resultSection}>
                <Text style={styles.sectionTitle}>Result</Text>
                <View style={styles.resultItem}>
                  <View style={styles.resultIcon}>
                    <FontAwesome5 name={getRecipeIcon(selectedRecipe.type)} size={24} color="#FFD700" />
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{selectedRecipe.result.name}</Text>
                    <Text style={styles.resultQuantity}>Quantity: {selectedRecipe.result.quantity}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.recipeDetailActions}>
                {canCraft ? (
                  <TouchableOpacity
                    style={styles.detailCraftButton}
                    onPress={() => {
                      setShowRecipeDetails(false);
                      startCrafting(selectedRecipe);
                    }}
                    disabled={isCrafting}
                  >
                    <Text style={styles.detailCraftButtonText}>Craft Item</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.detailCannotCraft}>
                    <Text style={styles.detailCannotCraftText}>
                      {selectedRecipe.level > playerLevel ? `Level ${selectedRecipe.level} required` : 'Missing materials'}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCraftingModal = () => {
    if (!isCrafting || !selectedRecipe) return null;

    return (
      <Modal
        visible={isCrafting}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.craftingContainer}>
            <View style={styles.craftingContent}>
              <View style={styles.craftingIcon}>
                <FontAwesome5 name={getRecipeIcon(selectedRecipe.type)} size={64} color="#D4AF37" />
              </View>

              <Text style={styles.craftingTitle}>Crafting {selectedRecipe.name}</Text>
              <Text style={styles.craftingDescription}>Please wait while your item is being crafted...</Text>

              <View style={styles.craftingProgress}>
                <View style={styles.craftingProgressBar}>
                  <View style={[styles.craftingProgressFill, { width: `${craftingProgress}%` }]} />
                </View>
                <Text style={styles.craftingProgressText}>{craftingProgress}%</Text>
              </View>

              <Text style={styles.craftingTime}>
                {Math.ceil((100 - craftingProgress) * selectedRecipe.craftingTime / 100)}s remaining
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Ancient%20crafting%20workshop%20with%20magical%20tools%20and%20materials&aspect=9:16&seed=crafting' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CRAFTING</Text>
          <View style={styles.headerStats}>
            <Text style={styles.playerLevel}>Lv.{playerLevel}</Text>
            <Text style={styles.craftingSkill}>Skill: {craftingSkill}</Text>
          </View>
        </View>

        {!selectedStation ? (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#A89968" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search recipes..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.filters}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilter}>
                {['all', 'weapon', 'armor', 'consumable', 'enchantment', 'tool'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterButton, selectedType === type && styles.selectedFilter]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text style={[styles.filterText, selectedType === type && styles.selectedFilterText]}>
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.stationsContainer}>
              <Text style={styles.sectionTitle}>Crafting Stations</Text>
              <FlatList
                data={stations}
                renderItem={renderStationItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.stationsList}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <FontAwesome5 name="hammer" size={48} color="#666" />
                    <Text style={styles.emptyText}>No crafting stations available</Text>
                  </View>
                }
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.stationHeader}>
              <TouchableOpacity
                style={styles.changeStationButton}
                onPress={() => setSelectedStation(null)}
              >
                <Ionicons name="arrow-back" size={20} color="#D4AF37" />
                <Text style={styles.changeStationText}>Change Station</Text>
              </TouchableOpacity>
              <View style={styles.currentStation}>
                <FontAwesome5 name={getStationIcon(selectedStation.icon)} size={20} color="#D4AF37" />
                <Text style={styles.currentStationText}>{selectedStation.name}</Text>
              </View>
            </View>

            <View style={styles.recipesContainer}>
              <Text style={styles.sectionTitle}>Recipes ({filteredRecipes.length})</Text>
              <FlatList
                data={filteredRecipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.recipesList}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <FontAwesome5 name="scroll" size={48} color="#666" />
                    <Text style={styles.emptyText}>No recipes available</Text>
                    <Text style={styles.emptySubtext}>Try changing stations or filters</Text>
                  </View>
                }
              />
            </View>
          </>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('CharacterInventory')}
          >
            <Ionicons name="bag" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="map" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Stations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="settings" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderStationDetailsModal()}
      {renderRecipeDetailsModal()}
      {renderCraftingModal()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  headerStats: {
    alignItems: 'center',
  },
  playerLevel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  craftingSkill: {
    color: '#A89968',
    fontSize: 12,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  searchInput: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 16,
    marginLeft: 8,
  },
  filters: {
    marginBottom: 16,
  },
  typeFilter: {
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedFilter: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filterText: {
    color: '#A89968',
    fontSize: 12,
  },
  selectedFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  stationsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 4,
  },
  stationsList: {
    paddingBottom: 20,
  },
  stationItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  lockedStation: {
    opacity: 0.6,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  stationLocation: {
    color: '#A89968',
    fontSize: 12,
  },
  lockedBadge: {
    marginLeft: 8,
  },
  stationDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  stationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  stationRecipes: {
    color: '#A89968',
    fontSize: 12,
  },
  selectStationButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  selectStationButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  changeStationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
  },
  changeStationText: {
    color: '#D4AF37',
    fontSize: 14,
    marginLeft: 4,
  },
  currentStation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 6,
    padding: 8,
  },
  currentStationText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  recipesContainer: {
    flex: 1,
  },
  recipesList: {
    paddingBottom: 20,
  },
  recipeItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  recipeStation: {
    color: '#A89968',
    fontSize: 12,
  },
  recipeStats: {
    alignItems: 'flex-end',
  },
  recipeLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  recipeTime: {
    color: '#A89968',
    fontSize: 12,
  },
  recipeDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  recipeMaterials: {
    marginBottom: 8,
  },
  materialsTitle: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  materialsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  materialText: {
    color: '#A89968',
    fontSize: 12,
    marginRight: 8,
    marginBottom: 2,
  },
  missingMaterial: {
    color: '#FF6347',
  },
  moreMaterials: {
    color: '#666',
    fontSize: 12,
  },
  recipeActions: {
    alignItems: 'flex-end',
  },
  craftButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  craftButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  cannotCraft: {
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    borderRadius: 6,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cannotCraftText: {
    color: '#FF6347',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 10,
  },
  footerButtonText: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stationDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  stationDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  stationDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  stationDetailsContent: {
    flex: 1,
  },
  stationDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailStationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#3A3A3A',
  },
  detailStationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailStationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailStationLocation: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 2,
  },
  detailStationLevel: {
    color: '#FFD700',
    fontSize: 14,
  },
  stationDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  stationRecipesSection: {
    marginBottom: 16,
  },
  stationRecipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  stationRecipeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  stationRecipeInfo: {
    flex: 1,
  },
  stationRecipeName: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  stationRecipeType: {
    color: '#A89968',
    fontSize: 12,
  },
  stationRecipeStats: {
    alignItems: 'center',
  },
  stationRecipeLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  stationActions: {
    marginTop: 20,
  },
  useStationButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  useStationButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  recipeDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  recipeDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  recipeDetailsContent: {
    flex: 1,
  },
  recipeDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailRecipeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#3A3A3A',
  },
  detailRecipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailRecipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailRecipeStation: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 2,
  },
  detailRecipeType: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  recipeDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  recipeStatsSection: {
    marginBottom: 16,
  },
  recipeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipeStatText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  materialsSection: {
    marginBottom: 16,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  materialIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    color: '#A89968',
    fontSize: 14,
  },
  missingMaterialName: {
    color: '#FF6347',
  },
  materialQuantity: {
    color: '#FFD700',
    fontSize: 12,
  },
  resultSection: {
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  resultQuantity: {
    color: '#A89968',
    fontSize: 12,
  },
  recipeDetailActions: {
    marginTop: 20,
  },
  detailCraftButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  detailCraftButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailCannotCraft: {
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  detailCannotCraftText: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '600',
  },
  craftingContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  craftingContent: {
    alignItems: 'center',
  },
  craftingIcon: {
    marginBottom: 16,
  },
  craftingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
    textAlign: 'center',
  },
  craftingDescription: {
    color: '#A89968',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  craftingProgress: {
    width: '100%',
    marginBottom: 16,
  },
  craftingProgressBar: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  craftingProgressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
  },
  craftingProgressText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  craftingTime: {
    color: '#A89968',
    fontSize: 12,
    textAlign: 'center',
  },
});