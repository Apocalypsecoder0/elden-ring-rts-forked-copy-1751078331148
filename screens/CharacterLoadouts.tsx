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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { EquipmentLoadout, EquipmentSlot, PlayerStats } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample loadouts
const SAMPLE_LOADOUTS: EquipmentLoadout[] = [
  {
    id: 'melee_warrior',
    name: 'Melee Warrior',
    description: 'Heavy armor and powerful weapons for close combat',
    equipment: {
      weapon: 'Greatsword',
      shield: 'Large Shield',
      helmet: 'Heavy Helmet',
      chest: 'Heavy Armor',
      gauntlets: 'Heavy Gauntlets',
      leggings: 'Heavy Leggings',
      talisman1: 'Radagon\'s Soreseal',
      talisman2: 'Starscourge Heirloom',
      talisman3: 'Dragoncrest Shield',
      talisman4: 'Erdtree\'s Favor',
    },
    stats: {
      vigor: 40,
      mind: 20,
      endurance: 35,
      strength: 25,
      dexterity: 15,
      intelligence: 10,
      faith: 15,
      arcane: 10,
    },
  },
  {
    id: 'spellcaster',
    name: 'Spellcaster',
    description: 'Light armor focused on magical damage and FP',
    equipment: {
      weapon: 'Staff of Loss',
      shield: 'Carian Knight\'s Shield',
      helmet: 'Hood',
      chest: 'Robe',
      gauntlets: 'Traveler\'s Gloves',
      leggings: 'Traveler\'s Slacks',
      talisman1: 'Magic Scorpion Charm',
      talisman2: 'Graven-Mass Talisman',
      talisman3: 'Carian Filigreed Crest',
      talisman4: 'Primal Glintstone Blade',
    },
    stats: {
      vigor: 25,
      mind: 40,
      endurance: 20,
      strength: 10,
      dexterity: 15,
      intelligence: 35,
      faith: 15,
      arcane: 20,
    },
  },
  {
    id: 'archer',
    name: 'Archer',
    description: 'Light armor build focused on ranged combat',
    equipment: {
      weapon: 'Longbow',
      shield: 'Small Shield',
      helmet: 'Leather Hood',
      chest: 'Leather Armor',
      gauntlets: 'Leather Gloves',
      leggings: 'Leather Boots',
      talisman1: 'Arrow\'s Reach Talisman',
      talisman2: 'Erdtree\'s Favor',
      talisman3: 'Assassin\'s Crimson Dagger',
      talisman4: 'Greatshield Talisman',
    },
    stats: {
      vigor: 30,
      mind: 25,
      endurance: 25,
      strength: 15,
      dexterity: 35,
      intelligence: 10,
      faith: 10,
      arcane: 20,
    },
  },
  {
    id: 'faith_warrior',
    name: 'Faith Warrior',
    description: 'Heavy armor with faith-based incantations',
    equipment: {
      weapon: 'Sacred Sword',
      shield: 'Large Shield',
      helmet: 'Heavy Helmet',
      chest: 'Heavy Armor',
      gauntlets: 'Heavy Gauntlets',
      leggings: 'Heavy Leggings',
      talisman1: 'Radagon\'s Soreseal',
      talisman2: 'Two Fingers Heirloom',
      talisman3: 'Dragoncrest Shield',
      talisman4: 'Erdtree\'s Favor',
    },
    stats: {
      vigor: 35,
      mind: 30,
      endurance: 30,
      strength: 20,
      dexterity: 15,
      intelligence: 10,
      faith: 35,
      arcane: 15,
    },
  },
];

// Equipment slots
const EQUIPMENT_SLOTS: EquipmentSlot[] = [
  'weapon', 'shield', 'helmet', 'chest', 'gauntlets', 'leggings',
  'talisman1', 'talisman2', 'talisman3', 'talisman4'
];

export default function CharacterLoadoutsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loadouts, setLoadouts] = useState<EquipmentLoadout[]>(SAMPLE_LOADOUTS);
  const [selectedLoadout, setSelectedLoadout] = useState<EquipmentLoadout | null>(null);
  const [showLoadoutDetails, setShowLoadoutDetails] = useState(false);
  const [showCreateLoadout, setShowCreateLoadout] = useState(false);
  const [currentLoadout, setCurrentLoadout] = useState<EquipmentLoadout | null>(SAMPLE_LOADOUTS[0]);
  const [newLoadoutName, setNewLoadoutName] = useState('');
  const [newLoadoutDescription, setNewLoadoutDescription] = useState('');

  const selectLoadout = (loadout: EquipmentLoadout) => {
    setSelectedLoadout(loadout);
    setShowLoadoutDetails(true);
  };

  const equipLoadout = () => {
    if (!selectedLoadout) return;

    setCurrentLoadout(selectedLoadout);
    toast.success(`Equipped ${selectedLoadout.name} loadout!`);
    setShowLoadoutDetails(false);
    setSelectedLoadout(null);
  };

  const createNewLoadout = () => {
    if (!newLoadoutName.trim()) {
      toast.error('Please enter a loadout name');
      return;
    }

    const newLoadout: EquipmentLoadout = {
      id: `custom_${Date.now()}`,
      name: newLoadoutName,
      description: newLoadoutDescription || 'Custom loadout',
      equipment: {
        weapon: '',
        shield: '',
        helmet: '',
        chest: '',
        gauntlets: '',
        leggings: '',
        talisman1: '',
        talisman2: '',
        talisman3: '',
        talisman4: '',
      },
      stats: {
        vigor: 10,
        mind: 10,
        endurance: 10,
        strength: 10,
        dexterity: 10,
        intelligence: 10,
        faith: 10,
        arcane: 10,
      },
    };

    setLoadouts([...loadouts, newLoadout]);
    setNewLoadoutName('');
    setNewLoadoutDescription('');
    setShowCreateLoadout(false);
    toast.success('New loadout created!');
  };

  const deleteLoadout = (loadoutId: string) => {
    Alert.alert(
      'Delete Loadout',
      'Are you sure you want to delete this loadout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLoadouts(loadouts.filter(l => l.id !== loadoutId));
            if (currentLoadout?.id === loadoutId) {
              setCurrentLoadout(null);
            }
            toast.success('Loadout deleted');
          }
        }
      ]
    );
  };

  const renderLoadoutItem = ({ item }: { item: EquipmentLoadout }) => {
    const isSelected = currentLoadout?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.loadoutItem, isSelected && styles.selectedLoadoutItem]}
        onPress={() => selectLoadout(item)}
      >
        <View style={styles.loadoutHeader}>
          <View style={styles.loadoutIconContainer}>
            <FontAwesome5 name="shield-alt" size={24} color={isSelected ? "#000" : "#D4AF37"} />
          </View>
          <View style={styles.loadoutInfo}>
            <Text style={[styles.loadoutName, isSelected && styles.selectedLoadoutText]}>
              {item.name}
            </Text>
            <Text style={[styles.loadoutDescription, isSelected && styles.selectedLoadoutText]}>
              {item.description}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.equippedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          )}
        </View>

        <View style={styles.loadoutStats}>
          <Text style={[styles.statsPreview, isSelected && styles.selectedLoadoutText]}>
            VIG {item.stats.vigor} • STR {item.stats.strength} • DEX {item.stats.dexterity}
          </Text>
          <Text style={[styles.statsPreview, isSelected && styles.selectedLoadoutText]}>
            INT {item.stats.intelligence} • FAI {item.stats.faith} • ARC {item.stats.arcane}
          </Text>
        </View>

        <View style={styles.loadoutActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => selectLoadout(item)}
          >
            <Ionicons name="eye" size={16} color="#A89968" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteLoadout(item.id)}
            disabled={isSelected}
          >
            <Ionicons name="trash" size={16} color={isSelected ? "#666" : "#c02d28"} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoadoutDetailsModal = () => {
    if (!selectedLoadout) return null;

    return (
      <Modal
        visible={showLoadoutDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoadoutDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loadoutDetailsContainer}>
            <View style={styles.loadoutDetailsHeader}>
              <Text style={styles.loadoutDetailsTitle}>Loadout Details</Text>
              <TouchableOpacity onPress={() => setShowLoadoutDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.loadoutDetailsContent}>
              <View style={styles.loadoutDetailHeader}>
                <View style={styles.detailLoadoutIconContainer}>
                  <FontAwesome5 name="shield-alt" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailLoadoutInfo}>
                  <Text style={styles.detailLoadoutName}>{selectedLoadout.name}</Text>
                  <Text style={styles.detailLoadoutDescription}>{selectedLoadout.description}</Text>
                </View>
              </View>

              <View style={styles.equipmentSection}>
                <Text style={styles.sectionTitle}>Equipment</Text>
                <View style={styles.equipmentGrid}>
                  {EQUIPMENT_SLOTS.map((slot) => (
                    <View key={slot} style={styles.equipmentSlot}>
                      <Text style={styles.slotName}>{slot.toUpperCase()}</Text>
                      <Text style={styles.equipmentName}>
                        {selectedLoadout.equipment[slot] || 'Empty'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Required Stats</Text>
                <View style={styles.statsGrid}>
                  {Object.entries(selectedLoadout.stats).map(([stat, value]) => (
                    <View key={stat} style={styles.statItem}>
                      <Text style={styles.statName}>{stat.toUpperCase()}</Text>
                      <Text style={styles.statValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.loadoutDetailActions}>
                <TouchableOpacity
                  style={styles.equipButton}
                  onPress={equipLoadout}
                >
                  <Text style={styles.equipButtonText}>
                    {currentLoadout?.id === selectedLoadout.id ? 'Currently Equipped' : 'Equip Loadout'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCreateLoadoutModal = () => {
    return (
      <Modal
        visible={showCreateLoadout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateLoadout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createLoadoutContainer}>
            <View style={styles.createLoadoutHeader}>
              <Text style={styles.createLoadoutTitle}>Create New Loadout</Text>
              <TouchableOpacity onPress={() => setShowCreateLoadout(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.createLoadoutContent}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Loadout Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={newLoadoutName}
                  onChangeText={setNewLoadoutName}
                  placeholder="Enter loadout name"
                  placeholderTextColor="#666"
                  maxLength={30}
                />
              </View>

              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Description (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={newLoadoutDescription}
                  onChangeText={setNewLoadoutDescription}
                  placeholder="Enter loadout description"
                  placeholderTextColor="#666"
                  multiline
                  maxLength={100}
                />
              </View>

              <View style={styles.createActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowCreateLoadout(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={createNewLoadout}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Ancient%20armory%20with%20floating%20equipment%20sets%20and%20glowing%20weapon%20racks&aspect=9:16&seed=loadouts' }}
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
          <Text style={styles.headerTitle}>EQUIPMENT LOADOUTS</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateLoadout(true)}
          >
            <Ionicons name="add" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        {currentLoadout && (
          <View style={styles.currentLoadoutInfo}>
            <Text style={styles.currentLoadoutLabel}>Current Loadout</Text>
            <View style={styles.currentLoadoutCard}>
              <View style={styles.currentLoadoutIcon}>
                <FontAwesome5 name="shield-alt" size={24} color="#D4AF37" />
              </View>
              <View style={styles.currentLoadoutDetails}>
                <Text style={styles.currentLoadoutName}>{currentLoadout.name}</Text>
                <Text style={styles.currentLoadoutStats}>
                  VIG {currentLoadout.stats.vigor} • STR {currentLoadout.stats.strength} • DEX {currentLoadout.stats.dexterity}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.loadoutsList}>
          <Text style={styles.sectionTitle}>Available Loadouts</Text>
          <FlatList
            data={loadouts}
            renderItem={renderLoadoutItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.loadoutsContainer}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="copy" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Duplicate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="share" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="download" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Import</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderLoadoutDetailsModal()}
      {renderCreateLoadoutModal()}
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
  addButton: {
    padding: 8,
  },
  currentLoadoutInfo: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  currentLoadoutLabel: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  currentLoadoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLoadoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentLoadoutDetails: {
    flex: 1,
  },
  currentLoadoutName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentLoadoutStats: {
    color: '#A89968',
    fontSize: 12,
  },
  loadoutsList: {
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
  loadoutsContainer: {
    paddingBottom: 20,
  },
  loadoutItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedLoadoutItem: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  loadoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadoutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  loadoutInfo: {
    flex: 1,
  },
  loadoutName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedLoadoutText: {
    color: '#000',
  },
  loadoutDescription: {
    color: '#A89968',
    fontSize: 12,
  },
  equippedBadge: {
    marginLeft: 8,
  },
  loadoutStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  statsPreview: {
    color: '#A89968',
    fontSize: 11,
    marginBottom: 2,
  },
  loadoutActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
  loadoutDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  loadoutDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  loadoutDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  loadoutDetailsContent: {
    flex: 1,
  },
  loadoutDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailLoadoutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailLoadoutInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLoadoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailLoadoutDescription: {
    color: '#A89968',
    fontSize: 14,
  },
  equipmentSection: {
    marginBottom: 16,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  equipmentSlot: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  slotName: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  equipmentName: {
    color: '#A89968',
    fontSize: 14,
  },
  statsSection: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  statName: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    color: '#A89968',
    fontSize: 16,
    fontWeight: '600',
  },
  loadoutDetailActions: {
    marginTop: 20,
  },
  equipButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  equipButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createLoadoutContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  createLoadoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  createLoadoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  createLoadoutContent: {
    paddingVertical: 16,
  },
  inputField: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    color: '#D4AF37',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 4,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(192, 45, 40, 0.8)',
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});