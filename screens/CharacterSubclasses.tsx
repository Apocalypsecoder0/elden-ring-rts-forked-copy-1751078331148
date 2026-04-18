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
import { CharacterSubclass, PlayerStats } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample subclass data
const CHARACTER_SUBCLASSES: CharacterSubclass[] = [
  {
    id: 'none',
    name: 'No Subclass',
    description: 'No specialized training. Maintains base class abilities.',
    requirements: {
      level: 1,
    },
    bonuses: {},
    specialAbilities: ['Base Class Abilities'],
    unlockedSkills: [],
    lore: 'Some warriors prefer to remain true to their roots without specialized training.',
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Elite warriors who have proven themselves in battle. Masters of combat.',
    requirements: {
      level: 15,
      strength: 15,
      dexterity: 15,
    },
    bonuses: {
      strength: 2,
      dexterity: 2,
      vigor: 1,
    },
    specialAbilities: ['Battle Mastery', 'Combat Reflexes', 'Weapon Specialization'],
    unlockedSkills: ['Champion\'s Charge', 'Parry Master', 'Battle Cry'],
    lore: 'Champions are those who have risen above their peers through sheer skill and determination.',
  },
  {
    id: 'spellblade',
    name: 'Spellblade',
    description: 'Warriors who blend martial prowess with magical abilities.',
    requirements: {
      level: 12,
      strength: 12,
      intelligence: 12,
    },
    bonuses: {
      strength: 1,
      intelligence: 2,
      mind: 1,
    },
    specialAbilities: ['Spell Parry', 'Mana Blade', 'Arcane Infusion'],
    unlockedSkills: ['Arcane Strike', 'Spell Shield', 'Mana Surge'],
    lore: 'Spellblades bridge the gap between physical and magical combat, wielding both sword and sorcery.',
  },
  {
    id: 'shadow_assassin',
    name: 'Shadow Assassin',
    description: 'Masters of stealth and precision strikes. Strike from the shadows.',
    requirements: {
      level: 10,
      dexterity: 18,
      arcane: 12,
    },
    bonuses: {
      dexterity: 3,
      arcane: 1,
    },
    specialAbilities: ['Shadow Step', 'Critical Strike', 'Poison Mastery'],
    unlockedSkills: ['Shadow Bind', 'Assassin\'s Mark', 'Toxin Cloud'],
    lore: 'Shadow Assassins move unseen through the darkness, striking with deadly precision.',
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'Holy warriors blessed by divine power. Protectors of the faith.',
    requirements: {
      level: 13,
      faith: 15,
      vigor: 14,
    },
    bonuses: {
      faith: 2,
      vigor: 2,
      endurance: 1,
    },
    specialAbilities: ['Divine Protection', 'Holy Aura', 'Smite Undead'],
    unlockedSkills: ['Divine Shield', 'Holy Light', 'Exorcism'],
    lore: 'Paladins are the divine warriors who protect the faithful and smite the forces of darkness.',
  },
  {
    id: 'blood_mage',
    name: 'Blood Mage',
    description: 'Forbidden sorcerers who use their own life force as power.',
    requirements: {
      level: 14,
      intelligence: 16,
      arcane: 14,
    },
    bonuses: {
      intelligence: 2,
      arcane: 2,
    },
    specialAbilities: ['Blood Magic', 'Life Tap', 'Blood Shield'],
    unlockedSkills: ['Blood Bolt', 'Life Drain', 'Blood Ritual'],
    lore: 'Blood Mages tap into the forbidden power of blood magic, sacrificing their life for immense power.',
  },
  {
    id: 'beast_master',
    name: 'Beast Master',
    description: 'Warriors who form bonds with powerful beasts and spirits.',
    requirements: {
      level: 11,
      endurance: 15,
      faith: 12,
    },
    bonuses: {
      endurance: 2,
      faith: 1,
      arcane: 1,
    },
    specialAbilities: ['Beast Bond', 'Spirit Call', 'Animal Empathy'],
    unlockedSkills: ['Beast Summon', 'Spirit Link', 'Feral Rage'],
    lore: 'Beast Masters commune with the wild spirits, calling upon beasts to aid them in battle.',
  },
  {
    id: 'runesmith',
    name: 'Runesmith',
    description: 'Artisans who forge and enhance equipment with ancient runes.',
    requirements: {
      level: 16,
      intelligence: 14,
      strength: 12,
    },
    bonuses: {
      intelligence: 2,
      strength: 1,
      arcane: 1,
    },
    specialAbilities: ['Rune Crafting', 'Equipment Enhancement', 'Ancient Knowledge'],
    unlockedSkills: ['Rune of Power', 'Armor Ward', 'Weapon Enchant'],
    lore: 'Runesmiths preserve the ancient art of rune crafting, enhancing equipment with mystical power.',
  },
  {
    id: 'night_blade',
    name: 'Night Blade',
    description: 'Cursed warriors who draw power from the night and darkness.',
    requirements: {
      level: 12,
      dexterity: 16,
      arcane: 13,
    },
    bonuses: {
      dexterity: 2,
      arcane: 2,
    },
    specialAbilities: ['Night Vision', 'Shadow Meld', 'Curse Resistance'],
    unlockedSkills: ['Night Strike', 'Darkness Veil', 'Curse Transfer'],
    lore: 'Night Blades are cursed warriors who have embraced the darkness, gaining power from the night.',
  },
  {
    id: 'storm_caller',
    name: 'Storm Caller',
    description: 'Elementalists who command the power of thunder and lightning.',
    requirements: {
      level: 15,
      faith: 16,
      mind: 14,
    },
    bonuses: {
      faith: 3,
      mind: 1,
    },
    specialAbilities: ['Storm Mastery', 'Lightning Rod', 'Thunder Clap'],
    unlockedSkills: ['Chain Lightning', 'Storm Shield', 'Thunder Strike'],
    lore: 'Storm Callers harness the raw power of thunder and lightning, wielding nature\'s fury.',
  },
  {
    id: 'dragon_kin',
    name: 'Dragon Kin',
    description: 'Warriors who have inherited the ancient blood of dragons.',
    requirements: {
      level: 18,
      vigor: 16,
      strength: 14,
    },
    bonuses: {
      vigor: 3,
      strength: 2,
      endurance: 1,
    },
    specialAbilities: ['Dragon Blood', 'Fire Breath', 'Scale Skin'],
    unlockedSkills: ['Dragon Roar', 'Flame Burst', 'Ancient Rage'],
    lore: 'Dragon Kin carry the ancient blood of dragons, granting them incredible power and resilience.',
  },
  {
    id: 'void_walker',
    name: 'Void Walker',
    description: 'Mystics who traverse the boundaries between worlds.',
    requirements: {
      level: 17,
      arcane: 18,
      mind: 16,
    },
    bonuses: {
      arcane: 3,
      mind: 2,
    },
    specialAbilities: ['Void Step', 'Reality Bend', 'Madness Immunity'],
    unlockedSkills: ['Void Rift', 'Reality Fracture', 'Chaos Bolt'],
    lore: 'Void Walkers have peered into the abyss and returned, bringing back forbidden knowledge.',
  },
];

export default function CharacterSubclassesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedSubclass, setSelectedSubclass] = useState<CharacterSubclass | null>(null);
  const [showSubclassDetails, setShowSubclassDetails] = useState(false);
  const [currentSubclass, setCurrentSubclass] = useState<CharacterSubclass>(CHARACTER_SUBCLASSES[0]); // Default to No Subclass

  // Sample player stats for requirement checking
  const playerStats = {
    level: 20,
    vigor: 15,
    mind: 18,
    endurance: 14,
    strength: 16,
    dexterity: 17,
    intelligence: 19,
    faith: 12,
    arcane: 15,
  };

  const meetsRequirements = (subclass: CharacterSubclass) => {
    if (playerStats.level < subclass.requirements.level) return false;
    if (subclass.requirements.strength && playerStats.strength < subclass.requirements.strength) return false;
    if (subclass.requirements.dexterity && playerStats.dexterity < subclass.requirements.dexterity) return false;
    if (subclass.requirements.intelligence && playerStats.intelligence < subclass.requirements.intelligence) return false;
    if (subclass.requirements.faith && playerStats.faith < subclass.requirements.faith) return false;
    if (subclass.requirements.arcane && playerStats.arcane < subclass.requirements.arcane) return false;
    if (subclass.requirements.vigor && playerStats.vigor < subclass.requirements.vigor) return false;
    if (subclass.requirements.mind && playerStats.mind < subclass.requirements.mind) return false;
    if (subclass.requirements.endurance && playerStats.endurance < subclass.requirements.endurance) return false;
    return true;
  };

  const selectSubclass = (subclass: CharacterSubclass) => {
    if (!meetsRequirements(subclass)) {
      toast.error('Requirements not met for this subclass');
      return;
    }

    setSelectedSubclass(subclass);
    setShowSubclassDetails(true);
  };

  const confirmSubclassChange = () => {
    if (!selectedSubclass) return;

    // In a real game, this would update the player's subclass
    setCurrentSubclass(selectedSubclass);
    toast.success(`Subclass changed to ${selectedSubclass.name}!`);
    setShowSubclassDetails(false);
    setSelectedSubclass(null);
  };

  const renderSubclassItem = ({ item }: { item: CharacterSubclass }) => {
    const isSelected = currentSubclass.id === item.id;
    const canSelect = meetsRequirements(item);

    return (
      <TouchableOpacity
        style={[
          styles.subclassItem,
          isSelected && styles.selectedSubclassItem,
          !canSelect && styles.lockedSubclassItem
        ]}
        onPress={() => selectSubclass(item)}
        disabled={!canSelect}
      >
        <View style={styles.subclassHeader}>
          <View style={styles.subclassIconContainer}>
            <FontAwesome5 name="user-ninja" size={32} color={canSelect ? "#D4AF37" : "#666"} />
          </View>
          <View style={styles.subclassInfo}>
            <Text style={[styles.subclassName, !canSelect && styles.lockedText]}>{item.name}</Text>
            <Text style={[styles.subclassLevel, !canSelect && styles.lockedText]}>
              Level {item.requirements.level}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.currentBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          )}
          {!canSelect && (
            <View style={styles.lockedBadge}>
              <Ionicons name="lock-closed" size={20} color="#666" />
            </View>
          )}
        </View>

        <Text style={[styles.subclassDescription, !canSelect && styles.lockedText]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.subclassBonuses}>
          {Object.keys(item.bonuses).length > 0 && (
            <View style={styles.bonusesContainer}>
              {Object.entries(item.bonuses).map(([stat, bonus]) => (
                <Text key={stat} style={[styles.bonusText, !canSelect && styles.lockedText]}>
                  +{bonus} {stat.toUpperCase()}
                </Text>
              ))}
            </View>
          )}
        </View>

        {!canSelect && (
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Requirements:</Text>
            {Object.entries(item.requirements).map(([req, value]) => (
              <Text key={req} style={styles.requirementText}>
                {req.toUpperCase()}: {value}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSubclassDetailsModal = () => {
    if (!selectedSubclass) return null;

    return (
      <Modal
        visible={showSubclassDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubclassDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.subclassDetailsContainer}>
            <View style={styles.subclassDetailsHeader}>
              <Text style={styles.subclassDetailsTitle}>Subclass Details</Text>
              <TouchableOpacity onPress={() => setShowSubclassDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.subclassDetailsContent}>
              <View style={styles.subclassDetailHeader}>
                <View style={styles.detailSubclassIconContainer}>
                  <FontAwesome5 name="user-ninja" size={64} color="#D4AF37" />
                </View>
                <View style={styles.detailSubclassInfo}>
                  <Text style={styles.detailSubclassName}>{selectedSubclass.name}</Text>
                  <Text style={styles.detailSubclassLore}>{selectedSubclass.lore}</Text>
                </View>
              </View>

              <Text style={styles.subclassDetailDescription}>{selectedSubclass.description}</Text>

              <View style={styles.subclassRequirementsSection}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                <View style={styles.requirementsGrid}>
                  {Object.entries(selectedSubclass.requirements).map(([req, value]) => (
                    <View key={req} style={styles.requirementItem}>
                      <Text style={styles.requirementName}>{req.toUpperCase()}</Text>
                      <Text style={styles.requirementValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {Object.keys(selectedSubclass.bonuses).length > 0 && (
                <View style={styles.subclassBonusesSection}>
                  <Text style={styles.sectionTitle}>Stat Bonuses</Text>
                  <View style={styles.bonusesGrid}>
                    {Object.entries(selectedSubclass.bonuses).map(([stat, bonus]) => (
                      <View key={stat} style={styles.bonusItem}>
                        <Text style={styles.bonusStatName}>{stat.toUpperCase()}</Text>
                        <Text style={styles.bonusStatValue}>+{bonus}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.subclassAbilitiesSection}>
                <Text style={styles.sectionTitle}>Special Abilities</Text>
                {selectedSubclass.specialAbilities.map((ability, index) => (
                  <Text key={index} style={styles.abilityItem}>• {ability}</Text>
                ))}
              </View>

              {selectedSubclass.unlockedSkills.length > 0 && (
                <View style={styles.subclassSkillsSection}>
                  <Text style={styles.sectionTitle}>Unlocked Skills</Text>
                  {selectedSubclass.unlockedSkills.map((skill, index) => (
                    <Text key={index} style={styles.skillItem}>• {skill}</Text>
                  ))}
                </View>
              )}

              <View style={styles.subclassActions}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={confirmSubclassChange}
                >
                  <Text style={styles.selectButtonText}>
                    {currentSubclass.id === selectedSubclass.id ? 'Current Subclass' : 'Select Subclass'}
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
      source={{ uri: 'https://api.a0.dev/assets/image?text=Ancient%20chamber%20with%20floating%20subclass%20totems%20and%20mystical%20auras&aspect=9:16&seed=subclasses' }}
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
          <Text style={styles.headerTitle}>CHARACTER SUBCLASSES</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.currentSubclassInfo}>
          <Text style={styles.currentSubclassLabel}>Current Subclass</Text>
          <View style={styles.currentSubclassCard}>
            <View style={styles.currentSubclassIcon}>
              <FontAwesome5 name="user-ninja" size={32} color="#D4AF37" />
            </View>
            <View style={styles.currentSubclassDetails}>
              <Text style={styles.currentSubclassName}>{currentSubclass.name}</Text>
              <Text style={styles.currentSubclassBonuses}>
                {Object.keys(currentSubclass.bonuses).length > 0
                  ? Object.entries(currentSubclass.bonuses).map(([stat, bonus]) => `+${bonus} ${stat.toUpperCase()}`).join(' • ')
                  : 'No bonuses'
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.subclassesList}>
          <Text style={styles.sectionTitle}>Available Subclasses</Text>
          <FlatList
            data={CHARACTER_SUBCLASSES}
            renderItem={renderSubclassItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.subclassesContainer}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="information-circle" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Subclass Guide</Text>
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

      {renderSubclassDetailsModal()}
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
  currentSubclassInfo: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  currentSubclassLabel: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  currentSubclassCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSubclassIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentSubclassDetails: {
    flex: 1,
  },
  currentSubclassName: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentSubclassBonuses: {
    color: '#A89968',
    fontSize: 12,
  },
  subclassesList: {
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
  subclassesContainer: {
    paddingBottom: 20,
  },
  subclassItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedSubclassItem: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  lockedSubclassItem: {
    opacity: 0.6,
  },
  subclassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subclassIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subclassInfo: {
    flex: 1,
  },
  subclassName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  subclassLevel: {
    color: '#A89968',
    fontSize: 12,
  },
  lockedText: {
    color: '#666',
  },
  currentBadge: {
    marginLeft: 8,
  },
  lockedBadge: {
    marginLeft: 8,
  },
  subclassDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  subclassBonuses: {
    marginBottom: 8,
  },
  bonusesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bonusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    marginBottom: 2,
  },
  requirementsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
  },
  requirementsTitle: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requirementText: {
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
  subclassDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  subclassDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  subclassDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  subclassDetailsContent: {
    flex: 1,
  },
  subclassDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailSubclassIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailSubclassInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailSubclassName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailSubclassLore: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
  },
  subclassDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  subclassRequirementsSection: {
    marginBottom: 16,
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  requirementItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  requirementName: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requirementValue: {
    color: '#A89968',
    fontSize: 16,
    fontWeight: '600',
  },
  subclassBonusesSection: {
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
  subclassAbilitiesSection: {
    marginBottom: 16,
  },
  abilityItem: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  subclassSkillsSection: {
    marginBottom: 16,
  },
  skillItem: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  subclassActions: {
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