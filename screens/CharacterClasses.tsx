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
import { PlayerStats } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type CharacterClassDefinition = {
  id: string;
  name: string;
  description: string;
  startingStats: PlayerStats;
  startingEquipment: string[];
  startingSpells: string[];
  startingItems: string[];
  level: number;
  runes: number;
};

// Sample class data
const CHARACTER_CLASSES: CharacterClassDefinition[] = [
  {
    id: 'wretch',
    name: 'Wretch',
    description: 'A prisoner of the Roundtable Hold. Begins with no equipment.',
    startingStats: {
      vigor: 10,
      mind: 10,
      endurance: 10,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      faith: 10,
      arcane: 10,
    },
    startingEquipment: [],
    startingSpells: [],
    startingItems: [],
    level: 1,
    runes: 0,
  },
  {
    id: 'hero',
    name: 'Hero',
    description: 'A legendary warrior who fought alongside Godfrey. Strong in all physical attributes.',
    startingStats: {
      vigor: 14,
      mind: 9,
      endurance: 12,
      strength: 16,
      dexterity: 9,
      intelligence: 7,
      faith: 8,
      arcane: 11,
    },
    startingEquipment: ['Hero\'s Rune [1]', 'Battle Hammer'],
    startingSpells: [],
    startingItems: ['Hero\'s Rune [1]'],
    level: 7,
    runes: 0,
  },
  {
    id: 'bandit',
    name: 'Bandit',
    description: 'A ruthless highwayman who strikes from the shadows. High dexterity and strength.',
    startingStats: {
      vigor: 10,
      mind: 11,
      endurance: 10,
      strength: 9,
      dexterity: 13,
      intelligence: 9,
      faith: 8,
      arcane: 14,
    },
    startingEquipment: ['Great Knife', 'Leather Armor'],
    startingSpells: [],
    startingItems: ['Throwing Knife x5'],
    level: 5,
    runes: 0,
  },
  {
    id: 'astrologer',
    name: 'Astrologer',
    description: 'A scholar of the cosmos who wields the power of stars. High intelligence and mind.',
    startingStats: {
      vigor: 9,
      mind: 15,
      endurance: 9,
      strength: 8,
      dexterity: 12,
      intelligence: 16,
      faith: 7,
      arcane: 9,
    },
    startingEquipment: ['Astrologer\'s Staff', 'Astrologer\'s Robe'],
    startingSpells: ['Glintstone Pebble', 'Glintstone Arc'],
    startingItems: ['Glintstone Pebble x3'],
    level: 6,
    runes: 0,
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A seasoned fighter who excels in close combat. Balanced physical attributes.',
    startingStats: {
      vigor: 11,
      mind: 12,
      endurance: 11,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      faith: 8,
      arcane: 9,
    },
    startingEquipment: ['Scimitar', 'Leather Shield', 'Warrior Gauntlets'],
    startingSpells: [],
    startingItems: ['Warrior\'s Cookbook [1]'],
    level: 7,
    runes: 0,
  },
  {
    id: 'prisoner',
    name: 'Prisoner',
    description: 'A condemned criminal who fights with chains. High strength and dexterity.',
    startingStats: {
      vigor: 11,
      mind: 12,
      endurance: 11,
      strength: 11,
      dexterity: 14,
      intelligence: 14,
      faith: 6,
      arcane: 9,
    },
    startingEquipment: ['Estoc', 'Parrying Dagger'],
    startingSpells: [],
    startingItems: ['Prisoner\'s Cookbook [1]'],
    level: 9,
    runes: 0,
  },
  {
    id: 'confessor',
    name: 'Confessor',
    description: 'A priest who hunts down heretics. Balanced with some faith.',
    startingStats: {
      vigor: 10,
      mind: 13,
      endurance: 10,
      strength: 12,
      dexterity: 12,
      intelligence: 9,
      faith: 14,
      arcane: 9,
    },
    startingEquipment: ['Broadsword', 'Finger Seal'],
    startingSpells: ['Heal', 'Catch Flame'],
    startingItems: ['Confessor\'s Cookbook [1]'],
    level: 10,
    runes: 0,
  },
  {
    id: 'samurai',
    name: 'Samurai',
    description: 'A wandering warrior from the Land of Reeds. High dexterity and strength.',
    startingStats: {
      vigor: 12,
      mind: 11,
      endurance: 13,
      strength: 12,
      dexterity: 15,
      intelligence: 9,
      faith: 8,
      arcane: 8,
    },
    startingEquipment: ['Uchigatana', 'Longbow'],
    startingSpells: [],
    startingItems: ['Samurai\'s Cookbook [1]'],
    level: 9,
    runes: 0,
  },
  {
    id: 'prophet',
    name: 'Prophet',
    description: 'A seer who communes with outer gods. High faith and mind.',
    startingStats: {
      vigor: 10,
      mind: 14,
      endurance: 8,
      strength: 11,
      dexterity: 10,
      intelligence: 7,
      faith: 16,
      arcane: 10,
    },
    startingEquipment: ['Short Spear', 'Finger Seal'],
    startingSpells: ['Urgent Heal', 'Wrath of Gold'],
    startingItems: ['Prophet\'s Cookbook [1]'],
    level: 7,
    runes: 0,
  },
  {
    id: 'vagabond',
    name: 'Vagabond',
    description: 'A drifter who travels the lands. Balanced and versatile.',
    startingStats: {
      vigor: 15,
      mind: 10,
      endurance: 11,
      strength: 14,
      dexterity: 13,
      intelligence: 9,
      faith: 9,
      arcane: 7,
    },
    startingEquipment: ['Longsword', 'Halberd'],
    startingSpells: [],
    startingItems: ['Vagabond\'s Cookbook [1]'],
    level: 9,
    runes: 0,
  },
];

export default function CharacterClassesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedClass, setSelectedClass] = useState<CharacterClassDefinition | null>(null);
  const [showClassDetails, setShowClassDetails] = useState(false);
  const [currentClass, setCurrentClass] = useState<CharacterClassDefinition>(CHARACTER_CLASSES[0]); // Default to Wretch

  const selectClass = (characterClass: CharacterClassDefinition) => {
    setSelectedClass(characterClass);
    setShowClassDetails(true);
  };

  const confirmClassChange = () => {
    if (!selectedClass) return;

    // In a real game, this would update the player's class
    setCurrentClass(selectedClass);
    toast.success(`Class changed to ${selectedClass.name}!`);
    setShowClassDetails(false);
    setSelectedClass(null);
  };

  const renderClassItem = ({ item }: { item: CharacterClassDefinition }) => {
    const isSelected = currentClass.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.classItem, isSelected && styles.selectedClassItem]}
        onPress={() => selectClass(item)}
      >
        <View style={styles.classHeader}>
          <View style={styles.classIconContainer}>
            <FontAwesome5 name="user-circle" size={32} color="#D4AF37" />
          </View>
          <View style={styles.classInfo}>
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.classLevel}>Level {item.level}</Text>
          </View>
          {isSelected && (
            <View style={styles.currentBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          )}
        </View>

        <Text style={styles.classDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.classStats}>
          <Text style={styles.statsPreview}>
            VIG {item.startingStats.vigor} • MIN {item.startingStats.mind} • END {item.startingStats.endurance}
          </Text>
          <Text style={styles.statsPreview}>
            STR {item.startingStats.strength} • DEX {item.startingStats.dexterity} • INT {item.startingStats.intelligence}
          </Text>
          <Text style={styles.statsPreview}>
            FAI {item.startingStats.faith} • ARC {item.startingStats.arcane}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderClassDetailsModal = () => {
    if (!selectedClass) return null;

    const startingStatsEntries = Object.entries(selectedClass.startingStats) as Array<[keyof PlayerStats, number]>;

    return (
      <Modal
        visible={showClassDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClassDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.classDetailsContainer}>
            <View style={styles.classDetailsHeader}>
              <Text style={styles.classDetailsTitle}>Class Details</Text>
              <TouchableOpacity onPress={() => setShowClassDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.classDetailsContent}>
              <View style={styles.classDetailHeader}>
                <View style={styles.detailClassIconContainer}>
                  <FontAwesome5 name="user-circle" size={64} color="#D4AF37" />
                </View>
                <View style={styles.detailClassInfo}>
                  <Text style={styles.detailClassName}>{selectedClass.name}</Text>
                  <Text style={styles.detailClassLevel}>Starting Level: {selectedClass.level}</Text>
                  <Text style={styles.detailClassRunes}>Starting Runes: {selectedClass.runes}</Text>
                </View>
              </View>

              <Text style={styles.classDetailDescription}>{selectedClass.description}</Text>

              <View style={styles.classStatsSection}>
                <Text style={styles.sectionTitle}>Starting Attributes</Text>
                <View style={styles.statsGrid}>
                  {startingStatsEntries.map(([stat, value]) => (
                    <View key={stat} style={styles.statItem}>
                      <Text style={styles.statName}>{stat.toUpperCase()}</Text>
                      <Text style={styles.statValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {selectedClass.startingEquipment.length > 0 && (
                <View style={styles.classEquipmentSection}>
                  <Text style={styles.sectionTitle}>Starting Equipment</Text>
                  {selectedClass.startingEquipment.map((equipment: string, index: number) => (
                    <Text key={index} style={styles.equipmentItem}>• {equipment}</Text>
                  ))}
                </View>
              )}

              {selectedClass.startingSpells.length > 0 && (
                <View style={styles.classSpellsSection}>
                  <Text style={styles.sectionTitle}>Starting Spells</Text>
                  {selectedClass.startingSpells.map((spell: string, index: number) => (
                    <Text key={index} style={styles.spellItem}>• {spell}</Text>
                  ))}
                </View>
              )}

              {selectedClass.startingItems.length > 0 && (
                <View style={styles.classItemsSection}>
                  <Text style={styles.sectionTitle}>Starting Items</Text>
                  {selectedClass.startingItems.map((item: string, index: number) => (
                    <Text key={index} style={styles.itemText}>• {item}</Text>
                  ))}
                </View>
              )}

              <View style={styles.classActions}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={confirmClassChange}
                >
                  <Text style={styles.selectButtonText}>
                    {currentClass.id === selectedClass.id ? 'Current Class' : 'Select Class'}
                  </Text>
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
      source={{ uri: 'https://api.a0.dev/assets/image?text=Ancient%20chamber%20with%20floating%20class%20orbs%20and%20glowing%20runes&aspect=9:16&seed=classes' }}
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
          <Text style={styles.headerTitle}>CHARACTER CLASSES</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.currentClassInfo}>
          <Text style={styles.currentClassLabel}>Current Class</Text>
          <View style={styles.currentClassCard}>
            <View style={styles.currentClassIcon}>
              <FontAwesome5 name="user-circle" size={32} color="#D4AF37" />
            </View>
            <View style={styles.currentClassDetails}>
              <Text style={styles.currentClassName}>{currentClass.name}</Text>
              <Text style={styles.currentClassStats}>
                Level {currentClass.level} • VIG {currentClass.startingStats.vigor} • STR {currentClass.startingStats.strength}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.classesList}>
          <Text style={styles.sectionTitle}>Available Classes</Text>
          <FlatList<CharacterClassDefinition>
            data={CHARACTER_CLASSES}
            renderItem={renderClassItem}
            keyExtractor={(item: CharacterClassDefinition) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.classesContainer}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="information-circle" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Class Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="stats-chart" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="refresh" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderClassDetailsModal()}
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
  menuButton: {
    padding: 8,
  },
  currentClassInfo: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  currentClassLabel: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  currentClassCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentClassIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentClassDetails: {
    flex: 1,
  },
  currentClassName: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentClassStats: {
    color: '#A89968',
    fontSize: 12,
  },
  classesList: {
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
  classesContainer: {
    paddingBottom: 20,
  },
  classItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedClassItem: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  classLevel: {
    color: '#A89968',
    fontSize: 12,
  },
  currentBadge: {
    marginLeft: 8,
  },
  classDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  classStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
  },
  statsPreview: {
    color: '#A89968',
    fontSize: 11,
    marginBottom: 2,
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
  classDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  classDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  classDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  classDetailsContent: {
    flex: 1,
  },
  classDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailClassIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailClassInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailClassName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailClassLevel: {
    color: '#A89968',
    fontSize: 16,
    marginBottom: 2,
  },
  detailClassRunes: {
    color: '#A89968',
    fontSize: 14,
  },
  classDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  classStatsSection: {
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
  classEquipmentSection: {
    marginBottom: 16,
  },
  equipmentItem: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  classSpellsSection: {
    marginBottom: 16,
  },
  spellItem: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  classItemsSection: {
    marginBottom: 16,
  },
  itemText: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  classActions: {
    marginTop: 20,
  },
  selectButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});