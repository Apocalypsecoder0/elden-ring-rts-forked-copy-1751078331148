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
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { ItemRarity, Weapon, Armor, Consumable, Material } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample inventory data
const INVENTORY_ITEMS = {
  weapons: [
    {
      id: 'weapon-1',
      name: 'Bastard Sword',
      type: 'Straight Sword',
      rarity: ItemRarity.UNCOMMON,
      damage: 115,
      damageType: 'Physical',
      scaling: { strength: 'C', dexterity: 'D', intelligence: 'E', faith: 'E', arcane: 'E' },
      requirements: { strength: 12, dexterity: 10 },
      weight: 4.5,
      durability: 85,
      maxDurability: 100,
      quantity: 1,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20bastard%20sword%20with%20intricate%20hilt&aspect=1:1&seed=bastardsword'
    },
    {
      id: 'weapon-2',
      name: 'Shortbow',
      type: 'Bow',
      rarity: ItemRarity.COMMON,
      damage: 45,
      damageType: 'Physical',
      scaling: { strength: 'E', dexterity: 'C', intelligence: 'E', faith: 'E', arcane: 'E' },
      requirements: { strength: 8, dexterity: 12 },
      weight: 2.5,
      durability: 60,
      maxDurability: 60,
      quantity: 1,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20shortbow%20with%20wooden%20frame&aspect=1:1&seed=shortbow'
    }
  ] as Weapon[],
  armor: [
    {
      id: 'armor-1',
      name: 'Leather Armor',
      type: 'Light',
      rarity: ItemRarity.COMMON,
      defense: { physical: 25, magic: 15, fire: 12, lightning: 10, holy: 8 },
      resistance: { poison: 20, bleed: 15, frost: 18, sleep: 10, madness: 12, deathblight: 8 },
      poise: 8,
      weight: 6.2,
      durability: 75,
      maxDurability: 75,
      quantity: 1,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20leather%20armor%20with%20studded%20design&aspect=1:1&seed=leatherarmor'
    }
  ] as Armor[],
  consumables: [
    {
      id: 'consumable-1',
      name: 'Flask of Crimson Tears',
      description: 'Restores HP over time.',
      rarity: ItemRarity.UNCOMMON,
      effect: 'Restores 200 HP over 20 seconds',
      duration: 20,
      cooldown: 0,
      maxStack: 10,
      currentStack: 8,
      weight: 0.1,
      value: 100,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20red%20potion%20flask%20with%20tears&aspect=1:1&seed=crimsonflask'
    },
    {
      id: 'consumable-2',
      name: 'Flask of Cerulean Tears',
      description: 'Restores FP over time.',
      rarity: ItemRarity.UNCOMMON,
      effect: 'Restores 100 FP over 20 seconds',
      duration: 20,
      cooldown: 0,
      maxStack: 10,
      currentStack: 6,
      weight: 0.1,
      value: 100,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20blue%20potion%20flask%20with%20tears&aspect=1:1&seed=ceruleanflask'
    },
    {
      id: 'consumable-3',
      name: 'Golden Rune [1]',
      description: 'A golden rune that grants 200 runes.',
      rarity: ItemRarity.COMMON,
      effect: 'Grants 200 runes when used',
      duration: 0,
      cooldown: 0,
      maxStack: 99,
      currentStack: 15,
      weight: 0.0,
      value: 200,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20golden%20rune%20with%20glowing%20symbol&aspect=1:1&seed=goldenrune'
    }
  ] as Consumable[],
  materials: [
    {
      id: 'material-1',
      name: 'Smithing Stone [1]',
      description: 'Stone used for weapon smithing.',
      rarity: ItemRarity.COMMON,
      source: 'Dropped by enemies',
      usedFor: ['Weapon Upgrades'],
      maxStack: 99,
      currentStack: 24,
      weight: 0.5,
      value: 200,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20smithing%20stone%20with%20metallic%20shine&aspect=1:1&seed=smithingstone'
    },
    {
      id: 'material-2',
      name: 'Grave Glovewort [1]',
      description: 'Material used for crafting.',
      rarity: ItemRarity.UNCOMMON,
      source: 'Found in catacombs',
      usedFor: ['Crafting', 'Upgrades'],
      maxStack: 99,
      currentStack: 8,
      weight: 0.2,
      value: 500,
      imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20grave%20glovewort%20with%20purple%20glow&aspect=1:1&seed=gravewort'
    }
  ] as Material[]
};

const INVENTORY_CATEGORIES = ['Weapons', 'Armor', 'Consumables', 'Materials', 'All'];

export default function CharacterInventoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sortBy, setSortBy] = useState('name');

  const getRarityColor = (rarity: ItemRarity) => {
    switch (rarity) {
      case ItemRarity.COMMON: return '#A8A8A8';
      case ItemRarity.UNCOMMON: return '#4CAF50';
      case ItemRarity.RARE: return '#2196F3';
      case ItemRarity.EPIC: return '#9C27B0';
      case ItemRarity.LEGENDARY: return '#FF9800';
      case ItemRarity.MYTHIC: return '#E91E63';
      case ItemRarity.ARTIFACT: return '#FFD700';
      default: return '#A8A8A8';
    }
  };

  const getAllItems = () => {
    const allItems: any[] = [];
    Object.values(INVENTORY_ITEMS).forEach(category => {
      allItems.push(...category);
    });
    return allItems;
  };

  const getFilteredItems = () => {
    let items: any[] = [];

    if (activeCategory === 'All') {
      items = getAllItems();
    } else {
      const categoryKey = activeCategory.toLowerCase() as keyof typeof INVENTORY_ITEMS;
      items = INVENTORY_ITEMS[categoryKey] || [];
    }

    // Filter by search query
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort items
    items.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Artifact'];
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        case 'value':
          return (b.value || 0) - (a.value || 0);
        default:
          return 0;
      }
    });

    return items;
  };

  const renderItem = (item: any) => {
    const isWeapon = item.damage !== undefined;
    const isArmor = item.defense !== undefined;
    const isConsumable = item.effect !== undefined;
    const isMaterial = item.source !== undefined;

    return (
      <TouchableOpacity
        style={styles.inventoryItem}
        onPress={() => {
          setSelectedItem(item);
          setShowItemDetails(true);
        }}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.itemIcon}
          imageStyle={styles.itemIconImage}
        >
          <View style={[styles.rarityBorder, { borderColor: getRarityColor(item.rarity) }]} />
          {item.currentStack && item.currentStack > 1 && (
            <View style={styles.stackBadge}>
              <Text style={styles.stackText}>{item.currentStack}</Text>
            </View>
          )}
        </ImageBackground>

        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: getRarityColor(item.rarity) }]}>
            {item.name}
          </Text>
          <Text style={styles.itemType}>
            {item.type || (isConsumable ? 'Consumable' : isMaterial ? 'Material' : 'Item')}
          </Text>
          <Text style={styles.itemWeight}>{item.weight} lbs</Text>
          {item.value && <Text style={styles.itemValue}>{item.value} runes</Text>}
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye" size={16} color="#A89968" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trash" size={16} color="#c02d28" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemDetailsModal = () => {
    if (!selectedItem) return null;

    const isWeapon = selectedItem.damage !== undefined;
    const isArmor = selectedItem.defense !== undefined;
    const isConsumable = selectedItem.effect !== undefined;
    const isMaterial = selectedItem.source !== undefined;

    return (
      <Modal
        visible={showItemDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowItemDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.itemDetailsContainer}>
            <View style={styles.itemDetailsHeader}>
              <Text style={styles.itemDetailsTitle}>Item Details</Text>
              <TouchableOpacity onPress={() => setShowItemDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.itemDetailsContent}>
              <View style={styles.itemHeader}>
                <ImageBackground
                  source={{ uri: selectedItem.imageUrl }}
                  style={styles.detailItemIcon}
                  imageStyle={styles.detailItemIconImage}
                >
                  <View style={[styles.detailRarityBorder, { borderColor: getRarityColor(selectedItem.rarity) }]} />
                  {selectedItem.currentStack && selectedItem.currentStack > 1 && (
                    <View style={styles.detailStackBadge}>
                      <Text style={styles.detailStackText}>{selectedItem.currentStack}</Text>
                    </View>
                  )}
                </ImageBackground>
                <View style={styles.detailItemInfo}>
                  <Text style={[styles.detailItemName, { color: getRarityColor(selectedItem.rarity) }]}>
                    {selectedItem.name}
                  </Text>
                  <Text style={styles.detailItemType}>
                    {selectedItem.type || (isConsumable ? 'Consumable' : isMaterial ? 'Material' : 'Item')}
                  </Text>
                  <Text style={styles.detailItemRarity}>{selectedItem.rarity}</Text>
                  <Text style={styles.detailItemWeight}>{selectedItem.weight} lbs</Text>
                  {selectedItem.value && <Text style={styles.detailItemValue}>{selectedItem.value} runes</Text>}
                </View>
              </View>

              {selectedItem.description && (
                <Text style={styles.itemDescription}>{selectedItem.description}</Text>
              )}

              {isWeapon && (
                <View style={styles.weaponStats}>
                  <Text style={styles.sectionTitle}>Combat Stats</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Attack Power:</Text>
                    <Text style={styles.statValue}>{selectedItem.damage}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Damage Type:</Text>
                    <Text style={styles.statValue}>{selectedItem.damageType}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Durability:</Text>
                    <Text style={styles.statValue}>{selectedItem.durability}/{selectedItem.maxDurability}</Text>
                  </View>

                  <Text style={styles.sectionTitle}>Attribute Scaling</Text>
                  {Object.entries(selectedItem.scalaling).map(([attr, scale]) => (
                    <View key={attr} style={styles.statRow}>
                      <Text style={styles.statLabel}>{attr.charAt(0).toUpperCase() + attr.slice(1)}:</Text>
                      <Text style={styles.statValue}>{scale}</Text>
                    </View>
                  ))}

                  <Text style={styles.sectionTitle}>Requirements</Text>
                  {Object.entries(selectedItem.requirements).map(([attr, req]) => (
                    <View key={attr} style={styles.statRow}>
                      <Text style={styles.statLabel}>{attr.charAt(0).toUpperCase() + attr.slice(1)}:</Text>
                      <Text style={styles.statValue}>{req}</Text>
                    </View>
                  ))}
                </View>
              )}

              {isArmor && (
                <View style={styles.armorStats}>
                  <Text style={styles.sectionTitle}>Defense Stats</Text>
                  {Object.entries(selectedItem.defense).map(([type, value]) => (
                    <View key={type} style={styles.statRow}>
                      <Text style={styles.statLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}:</Text>
                      <Text style={styles.statValue}>{value}</Text>
                    </View>
                  ))}

                  <Text style={styles.sectionTitle}>Resistances</Text>
                  {Object.entries(selectedItem.resistance).map(([type, value]) => (
                    <View key={type} style={styles.statRow}>
                      <Text style={styles.statLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}:</Text>
                      <Text style={styles.statValue}>{value}</Text>
                    </View>
                  ))}

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Poise:</Text>
                    <Text style={styles.statValue}>{selectedItem.poise}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Durability:</Text>
                    <Text style={styles.statValue}>{selectedItem.durability}/{selectedItem.maxDurability}</Text>
                  </View>
                </View>
              )}

              {isConsumable && (
                <View style={styles.consumableStats}>
                  <Text style={styles.sectionTitle}>Effect</Text>
                  <Text style={styles.effectText}>{selectedItem.effect}</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Duration:</Text>
                    <Text style={styles.statValue}>{selectedItem.duration} seconds</Text>
                  </View>
                  {selectedItem.cooldown > 0 && (
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Cooldown:</Text>
                      <Text style={styles.statValue}>{selectedItem.cooldown} seconds</Text>
                    </View>
                  )}
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Max Stack:</Text>
                    <Text style={styles.statValue}>{selectedItem.maxStack}</Text>
                  </View>
                </View>
              )}

              {isMaterial && (
                <View style={styles.materialStats}>
                  <Text style={styles.sectionTitle}>Information</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Source:</Text>
                    <Text style={styles.statValue}>{selectedItem.source}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Used For:</Text>
                    <Text style={styles.statValue}>{selectedItem.usedFor.join(', ')}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Max Stack:</Text>
                    <Text style={styles.statValue}>{selectedItem.maxStack}</Text>
                  </View>
                </View>
              )}

              <View style={styles.itemActions}>
                {isConsumable && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Use</Text>
                  </TouchableOpacity>
                )}
                {(isWeapon || isArmor) && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Equip</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Drop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Sell</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const filteredItems = getFilteredItems();

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20treasure%20room%20with%20chests%20and%20items&aspect=9:16&seed=inventory' }}
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
          <Text style={styles.headerTitle}>INVENTORY</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#A89968" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {INVENTORY_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[styles.categoryButtonText, activeCategory === category && styles.activeCategoryText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
            onPress={() => setSortBy('name')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.activeSortText]}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rarity' && styles.activeSortButton]}
            onPress={() => setSortBy('rarity')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'rarity' && styles.activeSortText]}>Rarity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'value' && styles.activeSortButton]}
            onPress={() => setSortBy('value')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'value' && styles.activeSortText]}>Value</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inventoryStats}>
          <Text style={styles.inventoryStatsText}>
            {filteredItems.length} items • Total weight: {filteredItems.reduce((sum, item) => sum + item.weight * (item.currentStack || 1), 0).toFixed(1)} lbs
          </Text>
        </View>

        <FlatList
          data={filteredItems}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          style={styles.inventoryList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="hammer" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Smithing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="flask" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Alchemy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="storefront" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Merchant</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderItemDetailsModal()}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  menuButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  categoryButtonText: {
    color: '#A89968',
    fontSize: 12,
  },
  activeCategoryText: {
    color: '#D4AF37',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortLabel: {
    color: '#A89968',
    fontSize: 14,
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  sortButtonText: {
    color: '#A89968',
    fontSize: 12,
  },
  activeSortText: {
    color: '#D4AF37',
  },
  inventoryStats: {
    marginBottom: 16,
  },
  inventoryStatsText: {
    color: '#A89968',
    fontSize: 12,
  },
  inventoryList: {
    flex: 1,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  itemIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconImage: {
    borderRadius: 6,
  },
  rarityBorder: {
    borderWidth: 2,
    borderRadius: 6,
    width: '100%',
    height: '100%',
  },
  stackBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  stackText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemType: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 2,
  },
  itemWeight: {
    color: '#666',
    fontSize: 10,
  },
  itemValue: {
    color: '#FFD700',
    fontSize: 10,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
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
  itemDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  itemDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  itemDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  itemDetailsContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItemIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailItemIconImage: {
    borderRadius: 8,
  },
  detailRarityBorder: {
    borderWidth: 3,
    borderRadius: 8,
    width: '100%',
    height: '100%',
  },
  detailStackBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  detailStackText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailItemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  detailItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailItemType: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 2,
  },
  detailItemRarity: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  detailItemWeight: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 2,
  },
  detailItemValue: {
    color: '#FFD700',
    fontSize: 12,
  },
  itemDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  weaponStats: {
    marginBottom: 16,
  },
  armorStats: {
    marginBottom: 16,
  },
  consumableStats: {
    marginBottom: 16,
  },
  materialStats: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statLabel: {
    color: '#A89968',
    fontSize: 14,
  },
  statValue: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  effectText: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});