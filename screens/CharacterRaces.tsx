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
import { CharacterRace, PlayerStats } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample race data
const CHARACTER_RACES: CharacterRace[] = [
  {
    id: 'human',
    name: 'Human',
    description: 'The most common race in the Lands Between. Balanced and adaptable.',
    bonuses: {
      allStats: 1,
    },
    penalties: {},
    specialAbilities: ['Versatile Learning'],
    lore: 'Humans are the dominant race of the Lands Between, known for their adaptability and resilience.',
  },
  {
    id: 'demigod',
    name: 'Demigod',
    description: 'Children of the Greater Will. Possess incredible potential but face great challenges.',
    bonuses: {
      vigor: 3,
      mind: 2,
      arcane: 2,
    },
    penalties: {},
    specialAbilities: ['Greater Will\'s Favor', 'Rune Absorption'],
    lore: 'Demigods are the direct descendants of the gods, blessed with immense power but cursed with eternal conflict.',
  },
  {
    id: 'tarnished',
    name: 'Tarnished',
    description: 'Exiled warriors stripped of the grace of gold. Seek to become Elden Lord.',
    bonuses: {
      endurance: 2,
      strength: 1,
      dexterity: 1,
    },
    penalties: {},
    specialAbilities: ['Guidance of Grace', 'Undead Resilience'],
    lore: 'The Tarnished were once champions of the Erdtree, but were stripped of their grace and exiled.',
  },
  {
    id: 'crucible_knight',
    name: 'Crucible Knight',
    description: 'Guardians of the Crucible. Masters of ancient combat techniques.',
    bonuses: {
      strength: 2,
      dexterity: 2,
      endurance: 1,
    },
    penalties: {
      intelligence: -1,
    },
    specialAbilities: ['Crucible Arts', 'Horn Calling'],
    lore: 'Crucible Knights protect the ancient secrets of the Crucible, wielding power from the primordial form of the Erdtree.',
  },
  {
    id: 'confessor',
    name: 'Confessor',
    description: 'Devout followers of the Golden Order. Excel in faith and divine magic.',
    bonuses: {
      faith: 3,
      mind: 1,
    },
    penalties: {
      arcane: -1,
    },
    specialAbilities: ['Golden Order Devotion', 'Divine Detection'],
    lore: 'Confessors are the inquisitors of the Golden Order, hunting down those who stray from the path of gold.',
  },
  {
    id: 'prophet',
    name: 'Prophet',
    description: 'Seers who commune with outer gods. Masters of forbidden knowledge.',
    bonuses: {
      arcane: 3,
      mind: 1,
    },
    penalties: {
      faith: -1,
    },
    specialAbilities: ['Outer God Communion', 'Madness Resistance'],
    lore: 'Prophets are those who have glimpsed the truths beyond the stars, gaining power at great personal cost.',
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Battle-hardened fighters from the badlands. Masters of physical combat.',
    bonuses: {
      strength: 2,
      endurance: 2,
    },
    penalties: {
      intelligence: -1,
      faith: -1,
    },
    specialAbilities: ['Battle-Hardened', 'Weapon Mastery'],
    lore: 'Warriors from the harsh badlands have learned to survive through strength and endurance alone.',
  },
  {
    id: 'samurai',
    name: 'Samurai',
    description: 'Honorable warriors from the Land of Reeds. Masters of precise combat.',
    bonuses: {
      dexterity: 3,
      endurance: 1,
    },
    penalties: {
      arcane: -1,
    },
    specialAbilities: ['Way of the Sword', 'Honor Bound'],
    lore: 'Samurai follow the ancient code of honor, wielding their katanas with unmatched precision and grace.',
  },
  {
    id: 'astrologer',
    name: 'Astrologer',
    description: 'Scholars of the cosmos who harness the power of the stars.',
    bonuses: {
      intelligence: 3,
      mind: 1,
    },
    penalties: {
      strength: -1,
    },
    specialAbilities: ['Stargazing', 'Glintstone Affinity'],
    lore: 'Astrologers study the movements of the stars, drawing power from the cosmos itself.',
  },
  {
    id: 'prisoner',
    name: 'Prisoner',
    description: 'Condemned criminals who fight with whatever they can find.',
    bonuses: {
      dexterity: 2,
      arcane: 1,
    },
    penalties: {
      faith: -1,
    },
    specialAbilities: ['Improvised Combat', 'Lockpicking'],
    lore: 'Prisoners learn to survive using whatever tools and weapons they can scavenge or steal.',
  },
  {
    id: 'bandit',
    name: 'Bandit',
    description: 'Ruthless highwaymen who strike from the shadows.',
    bonuses: {
      dexterity: 2,
      arcane: 2,
    },
    penalties: {
      faith: -1,
    },
    specialAbilities: ['Ambush Tactics', 'Item Discovery'],
    lore: 'Bandits survive by their wits and stealth, striking when their victims least expect it.',
  },
  {
    id: 'vagabond',
    name: 'Vagabond',
    description: 'Wandering drifters who travel the lands in search of fortune.',
    bonuses: {
      endurance: 2,
      strength: 1,
      dexterity: 1,
    },
    penalties: {},
    specialAbilities: ['Survivalist', 'Fast Travel Affinity'],
    lore: 'Vagabonds have learned to survive in the harsh wilderness, adapting to any situation.',
  },
];

export default function CharacterRacesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRace, setSelectedRace] = useState<CharacterRace | null>(null);
  const [showRaceDetails, setShowRaceDetails] = useState(false);
  const [currentRace, setCurrentRace] = useState<CharacterRace>(CHARACTER_RACES[0]); // Default to Human

  const selectRace = (race: CharacterRace) => {
    setSelectedRace(race);
    setShowRaceDetails(true);
  };

  const confirmRaceChange = () => {
    if (!selectedRace) return;

    // In a real game, this would update the player's race
    setCurrentRace(selectedRace);
    toast.success(`Race changed to ${selectedRace.name}!`);
    setShowRaceDetails(false);
    setSelectedRace(null);
  };

  const renderRaceItem = ({ item }: { item: CharacterRace }) => {
    const isSelected = currentRace.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.raceItem, isSelected && styles.selectedRaceItem]}
        onPress={() => selectRace(item)}
      >
        <View style={styles.raceHeader}>
          <View style={styles.raceIconContainer}>
            <FontAwesome5 name="user-circle" size={32} color="#D4AF37" />
          </View>
          <View style={styles.raceInfo}>
            <Text style={styles.raceName}>{item.name}</Text>
            <Text style={styles.raceAbilities}>
              {item.specialAbilities.slice(0, 2).join(', ')}
              {item.specialAbilities.length > 2 && '...'}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.currentBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          )}
        </View>

        <Text style={styles.raceDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.raceBonuses}>
          <View style={styles.bonusesContainer}>
            {Object.entries(item.bonuses).map(([stat, bonus]) => (
              <Text key={stat} style={styles.bonusText}>
                +{bonus} {stat.toUpperCase()}
              </Text>
            ))}
          </View>
          {Object.keys(item.penalties).length > 0 && (
            <View style={styles.penaltiesContainer}>
              {Object.entries(item.penalties).map(([stat, penalty]) => (
                <Text key={stat} style={styles.penaltyText}>
                  {penalty} {stat.toUpperCase()}
                </Text>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRaceDetailsModal = () => {
    if (!selectedRace) return null;

    return (
      <Modal
        visible={showRaceDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRaceDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.raceDetailsContainer}>
            <View style={styles.raceDetailsHeader}>
              <Text style={styles.raceDetailsTitle}>Race Details</Text>
              <TouchableOpacity onPress={() => setShowRaceDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.raceDetailsContent}>
              <View style={styles.raceDetailHeader}>
                <View style={styles.detailRaceIconContainer}>
                  <FontAwesome5 name="user-circle" size={64} color="#D4AF37" />
                </View>
                <View style={styles.detailRaceInfo}>
                  <Text style={styles.detailRaceName}>{selectedRace.name}</Text>
                  <Text style={styles.detailRaceLore}>{selectedRace.lore}</Text>
                </View>
              </View>

              <Text style={styles.raceDetailDescription}>{selectedRace.description}</Text>

              <View style={styles.raceBonusesSection}>
                <Text style={styles.sectionTitle}>Racial Bonuses</Text>
                <View style={styles.bonusesGrid}>
                  {Object.entries(selectedRace.bonuses).map(([stat, bonus]) => (
                    <View key={stat} style={styles.bonusItem}>
                      <Text style={styles.bonusStatName}>{stat.toUpperCase()}</Text>
                      <Text style={styles.bonusStatValue}>+{bonus}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {Object.keys(selectedRace.penalties).length > 0 && (
                <View style={styles.racePenaltiesSection}>
                  <Text style={styles.sectionTitle}>Racial Penalties</Text>
                  <View style={styles.penaltiesGrid}>
                    {Object.entries(selectedRace.penalties).map(([stat, penalty]) => (
                      <View key={stat} style={styles.penaltyItem}>
                        <Text style={styles.penaltyStatName}>{stat.toUpperCase()}</Text>
                        <Text style={styles.penaltyStatValue}>{penalty}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.raceAbilitiesSection}>
                <Text style={styles.sectionTitle}>Special Abilities</Text>
                {selectedRace.specialAbilities.map((ability, index) => (
                  <Text key={index} style={styles.abilityItem}>• {ability}</Text>
                ))}
              </View>

              <View style={styles.raceActions}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={confirmRaceChange}
                >
                  <Text style={styles.selectButtonText}>
                    {currentRace.id === selectedRace.id ? 'Current Race' : 'Select Race'}
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
      source={{ uri: 'https://api.a0.dev/assets/image?text=Ancient%20chamber%20with%20floating%20racial%20totems%20and%20glowing%20auras&aspect=9:16&seed=races' }}
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
          <Text style={styles.headerTitle}>CHARACTER RACES</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.currentRaceInfo}>
          <Text style={styles.currentRaceLabel}>Current Race</Text>
          <View style={styles.currentRaceCard}>
            <View style={styles.currentRaceIcon}>
              <FontAwesome5 name="user-circle" size={32} color="#D4AF37" />
            </View>
            <View style={styles.currentRaceDetails}>
              <Text style={styles.currentRaceName}>{currentRace.name}</Text>
              <Text style={styles.currentRaceBonuses}>
                {Object.entries(currentRace.bonuses).map(([stat, bonus]) => `+${bonus} ${stat.toUpperCase()}`).join(' • ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.racesList}>
          <Text style={styles.sectionTitle}>Available Races</Text>
          <FlatList
            data={CHARACTER_RACES}
            renderItem={renderRaceItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.racesContainer}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="information-circle" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Race Guide</Text>
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

      {renderRaceDetailsModal()}
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
  currentRaceInfo: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  currentRaceLabel: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  currentRaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentRaceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentRaceDetails: {
    flex: 1,
  },
  currentRaceName: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentRaceBonuses: {
    color: '#A89968',
    fontSize: 12,
  },
  racesList: {
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
  racesContainer: {
    paddingBottom: 20,
  },
  raceItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedRaceItem: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  raceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  raceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  raceInfo: {
    flex: 1,
  },
  raceName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  raceAbilities: {
    color: '#A89968',
    fontSize: 12,
  },
  currentBadge: {
    marginLeft: 8,
  },
  raceDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  raceBonuses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bonusesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  bonusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    marginBottom: 2,
  },
  penaltiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  penaltyText: {
    color: '#c02d28',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
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
  raceDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  raceDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  raceDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  raceDetailsContent: {
    flex: 1,
  },
  raceDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailRaceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailRaceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailRaceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailRaceLore: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
  },
  raceDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  raceBonusesSection: {
    marginBottom: 16,
  },
  bonusesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bonusItem: {
    width: '48%',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  bonusStatName: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bonusStatValue: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  racePenaltiesSection: {
    marginBottom: 16,
  },
  penaltiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  penaltyItem: {
    width: '48%',
    backgroundColor: 'rgba(192, 45, 40, 0.1)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c02d28',
  },
  penaltyStatName: {
    color: '#c02d28',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  penaltyStatValue: {
    color: '#c02d28',
    fontSize: 16,
    fontWeight: '600',
  },
  raceAbilitiesSection: {
    marginBottom: 16,
  },
  abilityItem: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  raceActions: {
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