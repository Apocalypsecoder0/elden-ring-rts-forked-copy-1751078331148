import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Equipment data
const EQUIPMENT_DATA = {
  equipped: {
    weapon_right: {
      id: 'moonveil',
      name: 'Moonveil Katana',
      type: 'Katana',
      rarity: 'Legendary',
      attack: 248,
      scaling: 'B/C/-/-',
      skill: 'Transient Moonlight',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20katana%20with%20blue%20glow&aspect=1:1&seed=moonveil'
    },
    weapon_left: {
      id: 'carian_shield',
      name: 'Carian Knight\'s Shield',
      type: 'Medium Shield',
      rarity: 'Rare',
      defense: 100,
      stability: 68,
      skill: 'Parry',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20shield%20with%20blue%20runes&aspect=1:1&seed=carianshield'
    },
    head: {
      id: 'royal_helm',
      name: 'Royal Sentinel Helm',
      type: 'Heavy Helmet',
      rarity: 'Epic',
      defense: 42,
      resistance: 'High Fire, Low Lightning',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20helmet%20with%20gold%20trim&aspect=1:1&seed=royalhelm'
    },
    chest: {
      id: 'royal_armor',
      name: 'Royal Sentinel Armor',
      type: 'Heavy Armor',
      rarity: 'Epic',
      defense: 78,
      resistance: 'High Fire, Low Lightning',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20armor%20with%20gold%20trim&aspect=1:1&seed=royalarmor'
    },
    arms: {
      id: 'royal_gauntlets',
      name: 'Royal Sentinel Gauntlets',
      type: 'Heavy Gauntlets',
      rarity: 'Epic',
      defense: 28,
      resistance: 'High Fire, Low Lightning',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20gauntlets%20with%20gold%20trim&aspect=1:1&seed=royalgauntlets'
    },
    legs: {
      id: 'royal_greaves',
      name: 'Royal Sentinel Greaves',
      type: 'Heavy Greaves',
      rarity: 'Epic',
      defense: 36,
      resistance: 'High Fire, Low Lightning',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20greaves%20with%20gold%20trim&aspect=1:1&seed=royalgreaves'
    },
    talisman1: {
      id: 'erdtree_favor',
      name: 'Erdtree\'s Favor',
      type: 'Talisman',
      rarity: 'Legendary',
      effect: 'Raises maximum HP, stamina, and equip load',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20golden%20pendant%20with%20tree%20symbol&aspect=1:1&seed=erdtreefavor'
    },
    talisman2: {
      id: 'dragoncrest_shield',
      name: 'Dragoncrest Shield Talisman',
      type: 'Talisman',
      rarity: 'Epic',
      effect: 'Boosts physical damage negation',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20dragon%20shield%20talisman&aspect=1:1&seed=dragoncrest'
    },
  },
  inventory: [
    {
      id: 'uchigatana',
      name: 'Uchigatana',
      type: 'Katana',
      rarity: 'Rare',
      attack: 115,
      scaling: 'D/D/-/-',
      skill: 'Unsheathe',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20katana&aspect=1:1&seed=uchigatana'
    },
    {
      id: 'claymore',
      name: 'Claymore',
      type: 'Greatsword',
      rarity: 'Rare',
      attack: 138,
      scaling: 'D/D/-/-',
      skill: 'Lion\'s Claw',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20greatsword&aspect=1:1&seed=claymore'
    },
    {
      id: 'brass_shield',
      name: 'Brass Shield',
      type: 'Medium Shield',
      rarity: 'Common',
      defense: 84,
      stability: 56,
      skill: 'Parry',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20brass%20shield&aspect=1:1&seed=brassshield'
    },
    {
      id: 'mage_hat',
      name: 'Astrologer\'s Hat',
      type: 'Light Helmet',
      rarity: 'Uncommon',
      defense: 18,
      resistance: 'High Magic, Low Physical',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20wizard%20hat%20with%20stars&aspect=1:1&seed=magehat'
    },
    {
      id: 'mage_robe',
      name: 'Astrologer\'s Robe',
      type: 'Light Armor',
      rarity: 'Uncommon',
      defense: 32,
      resistance: 'High Magic, Low Physical',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20wizard%20robe%20with%20stars&aspect=1:1&seed=magerobe'
    },
    {
      id: 'crimson_amber',
      name: 'Crimson Amber Medallion',
      type: 'Talisman',
      rarity: 'Epic',
      effect: 'Raises maximum HP',
      image: 'https://api.a0.dev/assets/image?text=Fantasy%20red%20medallion&aspect=1:1&seed=crimsonamber'
    },
  ]
};

// Rarity colors
const RARITY_COLORS = {
  'Common': '#9d9d9d',
  'Uncommon': '#1eff00',
  'Rare': '#0070dd',
  'Epic': '#a335ee',
  'Legendary': '#ff8000',
};

export default function EquipmentScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('equipped');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const handleSlotPress = (slotKey) => {
    setSelectedSlot(slotKey);
    setSelectedItem(EQUIPMENT_DATA.equipped[slotKey]);
  };
  
  const handleInventoryItemPress = (item) => {
    setSelectedItem(item);
  };
  
  const renderEquipmentSlot = (slotKey, label) => {
    const item = EQUIPMENT_DATA.equipped[slotKey];
    return (
      <TouchableOpacity 
        style={[styles.equipmentSlot, selectedSlot === slotKey && styles.selectedSlot]} 
        onPress={() => handleSlotPress(slotKey)}
      >
        {item ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.equipmentImage}
          />
        ) : (
          <View style={styles.emptySlot}>
            <Ionicons name="add-circle-outline" size={24} color="#A89968" />
          </View>
        )}
        <Text style={styles.slotLabel}>{label}</Text>
        {item && (
          <View style={[styles.rarityIndicator, { backgroundColor: RARITY_COLORS[item.rarity] }]} />
        )}
      </TouchableOpacity>
    );
  };
  
  const renderInventoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.inventoryItem, selectedItem?.id === item.id && styles.selectedInventoryItem]} 
      onPress={() => handleInventoryItemPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.inventoryItemImage} />
      <View style={styles.inventoryItemInfo}>
        <Text style={[styles.inventoryItemName, { color: RARITY_COLORS[item.rarity] }]}>{item.name}</Text>
        <Text style={styles.inventoryItemType}>{item.type}</Text>
      </View>
      <View style={[styles.inventoryItemRarity, { backgroundColor: RARITY_COLORS[item.rarity] }]} />
    </TouchableOpacity>
  );
  
  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#1a1a2e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EQUIPMENT</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'equipped' && styles.activeTabButton]}
            onPress={() => setActiveTab('equipped')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'equipped' && styles.activeTabText]}>EQUIPPED</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'inventory' && styles.activeTabButton]}
            onPress={() => setActiveTab('inventory')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'inventory' && styles.activeTabText]}>INVENTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'stats' && styles.activeTabButton]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'stats' && styles.activeTabText]}>STATS</Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'equipped' && (
          <View style={styles.equippedContainer}>
            <View style={styles.characterPreview}>
              <Image 
                source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20character%20with%20ornate%20armor&aspect=1:2&seed=character42' }}
                style={styles.characterImage}
              />
            </View>
            
            <View style={styles.equipmentGrid}>
              <View style={styles.equipmentRow}>
                {renderEquipmentSlot('head', 'Head')}
              </View>
              <View style={styles.equipmentRow}>
                {renderEquipmentSlot('weapon_right', 'R-Hand')}
                {renderEquipmentSlot('chest', 'Chest')}
                {renderEquipmentSlot('weapon_left', 'L-Hand')}
              </View>
              <View style={styles.equipmentRow}>
                {renderEquipmentSlot('arms', 'Arms')}
              </View>
              <View style={styles.equipmentRow}>
                {renderEquipmentSlot('legs', 'Legs')}
              </View>
              <View style={styles.equipmentRow}>
                {renderEquipmentSlot('talisman1', 'Talisman 1')}
                {renderEquipmentSlot('talisman2', 'Talisman 2')}
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'inventory' && (
          <FlatList
            data={EQUIPMENT_DATA.inventory}
            renderItem={renderInventoryItem}
            keyExtractor={item => item.id}
            style={styles.inventoryList}
            contentContainerStyle={styles.inventoryListContent}
          />
        )}
        
        {activeTab === 'stats' && (
          <ScrollView style={styles.statsContainer}>
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Defense Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Physical</Text>
                  <Text style={styles.statValue}>184</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Magic</Text>
                  <Text style={styles.statValue}>142</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Fire</Text>
                  <Text style={styles.statValue}>168</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Lightning</Text>
                  <Text style={styles.statValue}>124</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Holy</Text>
                  <Text style={styles.statValue}>136</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Immunity</Text>
                  <Text style={styles.statValue}>156</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Attack Power</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>R-Weapon</Text>
                  <Text style={styles.statValue}>248</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>L-Weapon</Text>
                  <Text style={styles.statValue}>100</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Critical</Text>
                  <Text style={styles.statValue}>140</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Equipment Load</Text>
              <View style={styles.loadBarContainer}>
                <View style={[styles.loadBar, { width: '65%' }]} />
              </View>
              <Text style={styles.loadText}>42.8 / 65.4</Text>
              <Text style={styles.loadStatus}>Medium Load</Text>
            </View>
          </ScrollView>
        )}
        
        {selectedItem && (
          <View style={styles.itemDetailsContainer}>
            <View style={styles.itemDetailsHeader}>
              <Text style={[styles.itemDetailsName, { color: RARITY_COLORS[selectedItem.rarity] }]}>
                {selectedItem.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedItem(null)}>
                <Ionicons name="close-circle" size={24} color="#A89968" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.itemDetailsContent}>
              <Image source={{ uri: selectedItem.image }} style={styles.itemDetailsImage} />
              
              <View style={styles.itemDetailsInfo}>
                <Text style={styles.itemDetailsType}>{selectedItem.type} • {selectedItem.rarity}</Text>
                
                {selectedItem.attack && (
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Attack:</Text>
                    <Text style={styles.itemDetailValue}>{selectedItem.attack}</Text>
                  </View>
                )}
                
                {selectedItem.scaling && (
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Scaling:</Text>
                    <Text style={styles.itemDetailValue}>{selectedItem.scaling}</Text>
                  </View>
                )}
                
                {selectedItem.defense && (
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Defense:</Text>
                    <Text style={styles.itemDetailValue}>{selectedItem.defense}</Text>
                  </View>
                )}
                
                {selectedItem.stability && (
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Stability:</Text>
                    <Text style={styles.itemDetailValue}>{selectedItem.stability}</Text>
                  </View>
                )}
                
                {selectedItem.resistance && (
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Resistance:</Text>
                    <Text style={styles.itemDetailValue}>{selectedItem.resistance}</Text>
                  </View>
                )}
                
                {selectedItem.skill && (
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Skill:</Text>
                    <Text style={styles.itemDetailValue}>{selectedItem.skill}</Text>
                  </View>
                )}
                
                {selectedItem.effect && (
                  <View style={styles.itemDetailRow}>
                    <Text style={styles.itemDetailLabel}>Effect:</Text>
                    <Text style={styles.itemDetailValue}>{selectedItem.effect}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.itemDetailsActions}>
              <TouchableOpacity style={styles.itemActionButton}>
                <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
                <Text style={styles.itemActionText}>Equip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemActionButton}>
                <Ionicons name="information-circle" size={20} color="#FFFFFF" />
                <Text style={styles.itemActionText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemActionButton}>
                <Ionicons name="trash" size={20} color="#FFFFFF" />
                <Text style={styles.itemActionText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  menuButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A89968',
  },
  activeTabText: {
    color: '#D4AF37',
  },
  equippedContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  characterPreview: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#3A3A3A',
    paddingRight: 16,
  },
  characterImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  equipmentGrid: {
    flex: 1,
    paddingLeft: 16,
  },
  equipmentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  equipmentSlot: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    position: 'relative',
  },
  selectedSlot: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  equipmentImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  emptySlot: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    fontSize: 10,
    color: '#A89968',
    position: 'absolute',
    bottom: 2,
  },
  rarityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inventoryList: {
    flex: 1,
  },
  inventoryListContent: {
    padding: 16,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    marginBottom: 8,
  },
  selectedInventoryItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  inventoryItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  inventoryItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  inventoryItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inventoryItemType: {
    fontSize: 14,
    color: '#A89968',
    marginTop: 4,
  },
  inventoryItemRarity: {
    width: 4,
    height: '80%',
    borderRadius: 2,
  },
  statsContainer: {
    flex: 1,
    padding: 16,
  },
  statsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  statsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  statLabel: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadBarContainer: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  loadBar: {
    height: '100%',
    backgroundColor: '#5ac93c',
  },
  loadText: {
    fontSize: 14,
    color: '#A89968',
    textAlign: 'right',
    marginBottom: 4,
  },
  loadStatus: {
    fontSize: 16,
    color: '#5ac93c',
    textAlign: 'right',
  },
  itemDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
    padding: 16,
    maxHeight: '50%',
  },
  itemDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemDetailsName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemDetailsContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemDetailsImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  itemDetailsInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemDetailsType: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 8,
  },
  itemDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  itemDetailLabel: {
    fontSize: 14,
    color: '#A89968',
    width: 80,
  },
  itemDetailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  itemDetailsActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
    paddingTop: 16,
  },
  itemActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  itemActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});