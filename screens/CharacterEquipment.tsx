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
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { EquipmentSlot, Weapon, Armor, ItemRarity } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample equipment data
const CURRENT_EQUIPMENT = {
  [EquipmentSlot.HEAD]: {
    id: 'helm-of-the-tarnished',
    name: 'Helm of the Tarnished',
    type: 'Heavy',
    rarity: ItemRarity.RARE,
    defense: { physical: 25, magic: 15, fire: 20, lightning: 18, holy: 12 },
    weight: 4.2,
    imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20helmet%20with%20ornate%20design&aspect=1:1&seed=helm1'
  },
  [EquipmentSlot.CHEST]: {
    id: 'armor-of-the-tarnished',
    name: 'Armor of the Tarnished',
    type: 'Heavy',
    rarity: ItemRarity.RARE,
    defense: { physical: 45, magic: 28, fire: 35, lightning: 32, holy: 22 },
    weight: 12.8,
    imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20chest%20armor%20with%20intricate%20engravings&aspect=1:1&seed=armor1'
  },
  [EquipmentSlot.ARMS]: {
    id: 'gauntlets-of-the-tarnished',
    name: 'Gauntlets of the Tarnished',
    type: 'Heavy',
    rarity: ItemRarity.UNCOMMON,
    defense: { physical: 18, magic: 12, fire: 15, lightning: 14, holy: 10 },
    weight: 3.5,
    imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20gauntlets%20with%20metal%20plates&aspect=1:1&seed=gauntlets1'
  },
  [EquipmentSlot.LEGS]: {
    id: 'greaves-of-the-tarnished',
    name: 'Greaves of the Tarnished',
    type: 'Heavy',
    rarity: ItemRarity.UNCOMMON,
    defense: { physical: 22, magic: 14, fire: 18, lightning: 16, holy: 11 },
    weight: 5.1,
    imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20greaves%20with%20reinforced%20knees&aspect=1:1&seed=greaves1'
  },
  [EquipmentSlot.RIGHT_HAND_1]: {
    id: 'straight-sword',
    name: 'Straight Sword',
    type: 'Straight Sword',
    rarity: ItemRarity.COMMON,
    damage: 95,
    damageType: 'Physical',
    scaling: { strength: 'D', dexterity: 'D', intelligence: 'E', faith: 'E', arcane: 'E' },
    requirements: { strength: 10, dexterity: 10 },
    weight: 3.0,
    imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20straight%20sword%20with%20simple%20design&aspect=1:1&seed=straightsword1'
  },
  [EquipmentSlot.LEFT_HAND_1]: {
    id: 'small-shield',
    name: 'Small Shield',
    type: 'Small Shield',
    rarity: ItemRarity.COMMON,
    defense: { physical: 35, magic: 25, fire: 20, lightning: 18, holy: 15 },
    weight: 2.5,
    imageUrl: 'https://api.a0.dev/assets/image?text=Fantasy%20small%20round%20shield%20with%20emblem&aspect=1:1&seed=smallshield1'
  }
};

// Equipment slots configuration
const EQUIPMENT_SLOTS = [
  { slot: EquipmentSlot.HEAD, label: 'Head', icon: 'head' },
  { slot: EquipmentSlot.CHEST, label: 'Chest', icon: 'body' },
  { slot: EquipmentSlot.ARMS, label: 'Arms', icon: 'hand-left' },
  { slot: EquipmentSlot.LEGS, label: 'Legs', icon: 'foot' },
  { slot: EquipmentSlot.RIGHT_HAND_1, label: 'Right Hand 1', icon: 'hand-right' },
  { slot: EquipmentSlot.RIGHT_HAND_2, label: 'Right Hand 2', icon: 'hand-right' },
  { slot: EquipmentSlot.LEFT_HAND_1, label: 'Left Hand 1', icon: 'hand-left' },
  { slot: EquipmentSlot.LEFT_HAND_2, label: 'Left Hand 2', icon: 'hand-left' },
  { slot: EquipmentSlot.TALISMAN_1, label: 'Talisman 1', icon: 'star' },
  { slot: EquipmentSlot.TALISMAN_2, label: 'Talisman 2', icon: 'star' },
  { slot: EquipmentSlot.TALISMAN_3, label: 'Talisman 3', icon: 'star' },
  { slot: EquipmentSlot.TALISMAN_4, label: 'Talisman 4', icon: 'star' },
  { slot: EquipmentSlot.QUICK_ITEM_1, label: 'Quick Item 1', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_2, label: 'Quick Item 2', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_3, label: 'Quick Item 3', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_4, label: 'Quick Item 4', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_5, label: 'Quick Item 5', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_6, label: 'Quick Item 6', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_7, label: 'Quick Item 7', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_8, label: 'Quick Item 8', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_9, label: 'Quick Item 9', icon: 'flask' },
  { slot: EquipmentSlot.QUICK_ITEM_10, label: 'Quick Item 10', icon: 'flask' },
];

export default function CharacterEquipmentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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

  const renderEquipmentSlot = (slotConfig: typeof EQUIPMENT_SLOTS[0]) => {
    const equippedItem = CURRENT_EQUIPMENT[slotConfig.slot as keyof typeof CURRENT_EQUIPMENT];

    return (
      <TouchableOpacity
        key={slotConfig.slot}
        style={styles.equipmentSlot}
        onPress={() => {
          setSelectedSlot(slotConfig.slot);
          setSelectedItem(equippedItem);
          setShowItemDetails(true);
        }}
      >
        <View style={styles.slotHeader}>
          <Ionicons name={slotConfig.icon as any} size={20} color="#A89968" />
          <Text style={styles.slotLabel}>{slotConfig.label}</Text>
        </View>

        {equippedItem ? (
          <View style={styles.equippedItem}>
            <ImageBackground
              source={{ uri: equippedItem.imageUrl }}
              style={styles.itemIcon}
              imageStyle={styles.itemIconImage}
            >
              <View style={[styles.rarityBorder, { borderColor: getRarityColor(equippedItem.rarity) }]} />
            </ImageBackground>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: getRarityColor(equippedItem.rarity) }]}>
                {equippedItem.name}
              </Text>
              <Text style={styles.itemType}>{equippedItem.type}</Text>
              <Text style={styles.itemWeight}>{equippedItem.weight} lbs</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptySlot}>
            <Ionicons name="add-circle-outline" size={32} color="#666" />
            <Text style={styles.emptySlotText}>Empty</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItemDetailsModal = () => {
    if (!selectedItem) return null;

    const isWeapon = selectedItem.damage !== undefined;

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
              <Text style={styles.itemDetailsTitle}>Equipment Details</Text>
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
                </ImageBackground>
                <View style={styles.detailItemInfo}>
                  <Text style={[styles.detailItemName, { color: getRarityColor(selectedItem.rarity) }]}>
                    {selectedItem.name}
                  </Text>
                  <Text style={styles.detailItemType}>{selectedItem.type}</Text>
                  <Text style={styles.detailItemRarity}>{selectedItem.rarity}</Text>
                </View>
              </View>

              {isWeapon ? (
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
              ) : (
                <View style={styles.armorStats}>
                  <Text style={styles.sectionTitle}>Defense Stats</Text>
                  {Object.entries(selectedItem.defense).map(([type, value]) => (
                    <View key={type} style={styles.statRow}>
                      <Text style={styles.statLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}:</Text>
                      <Text style={styles.statValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Unequip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Replace</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Compare</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20armory%20with%20weapons%20and%20armor%20racks&aspect=9:16&seed=armory' }}
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
          <Text style={styles.headerTitle}>EQUIPMENT</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.equipmentLoadContainer}>
          <Text style={styles.equipmentLoadText}>Equipment Load: 42.8 / 65.4 lbs</Text>
          <View style={styles.loadBar}>
            <View style={[styles.loadBarFill, { width: '65%' }]} />
          </View>
          <Text style={styles.loadStatus}>Medium Load</Text>
        </View>

        <ScrollView style={styles.equipmentContainer}>
          {EQUIPMENT_SLOTS.map(renderEquipmentSlot)}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="briefcase" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="hammer" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Smithing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="stats-chart" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Stats</Text>
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
  equipmentLoadContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  equipmentLoadText: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  loadBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  loadBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  loadStatus: {
    color: '#4CAF50',
    fontSize: 12,
  },
  equipmentContainer: {
    flex: 1,
  },
  equipmentSlot: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotLabel: {
    color: '#A89968',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  equippedItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptySlot: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptySlotText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
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
  },
  weaponStats: {
    marginBottom: 16,
  },
  armorStats: {
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