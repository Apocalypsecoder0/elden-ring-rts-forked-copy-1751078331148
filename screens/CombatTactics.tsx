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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample combat tactics data
const COMBAT_TACTICS = [
  {
    id: 'phalanx-formation',
    name: 'Phalanx Formation',
    type: 'Defensive',
    description: 'A tight formation of heavily armored infantry creating an impenetrable wall of spears and shields.',
    effectiveness: 85,
    unitRequirements: ['Heavy Infantry', 'Spearmen', 'Shield Bearers'],
    counters: ['Cavalry Charges', 'Flanking Maneuvers'],
    bonuses: [
      '+50% Defense against frontal attacks',
      '+30% Morale when holding position',
      '-20% Movement speed'
    ],
    unlocked: true,
    level: 5
  },
  {
    id: 'wedge-formation',
    name: 'Wedge Formation',
    type: 'Offensive',
    description: 'A triangular formation designed to break through enemy lines with concentrated force.',
    effectiveness: 78,
    unitRequirements: ['Heavy Cavalry', 'Elite Infantry'],
    counters: ['Arrow Volleys', 'Magic Barriers'],
    bonuses: [
      '+40% Breakthrough chance',
      '+25% Charge damage',
      '-15% Flank defense'
    ],
    unlocked: true,
    level: 8
  },
  {
    id: 'skirmish-line',
    name: 'Skirmish Line',
    type: 'Ranged',
    description: 'Loose formation of archers and ranged units maintaining distance while peppering enemies.',
    effectiveness: 72,
    unitRequirements: ['Archers', 'Crossbowmen', 'Light Infantry'],
    counters: ['Cavalry Pursuit', 'Close Combat'],
    bonuses: [
      '+35% Ranged accuracy',
      '+20% Evasion from melee',
      '-30% Defense in melee'
    ],
    unlocked: true,
    level: 3
  },
  {
    id: 'ambush-formation',
    name: 'Ambush Formation',
    type: 'Stealth',
    description: 'Hidden units positioned for surprise attacks, utilizing terrain for maximum effect.',
    effectiveness: 90,
    unitRequirements: ['Assassins', 'Rangers', 'Light Cavalry'],
    counters: ['Scouting', 'Detection magic'],
    bonuses: [
      '+60% First strike damage',
      '+100% Ambush success rate',
      'Stealth until revealed'
    ],
    unlocked: false,
    level: 12
  },
  {
    id: 'siege-formation',
    name: 'Siege Formation',
    type: 'Siege',
    description: 'Specialized formation for assaulting fortifications with ladders, rams, and siege towers.',
    effectiveness: 65,
    unitRequirements: ['Siege Engineers', 'Heavy Infantry', 'Archers'],
    counters: ['Wall Defenses', 'Boiling Oil'],
    bonuses: [
      '+45% Wall breach chance',
      '+25% Siege weapon accuracy',
      'Ignores some fortifications'
    ],
    unlocked: false,
    level: 15
  }
];

const FORMATIONS = [
  { name: 'Line', icon: 'remove', description: 'Standard battle line, balanced offense and defense' },
  { name: 'Column', icon: 'arrow-down', description: 'Marching formation, fast movement but vulnerable flanks' },
  { name: 'Square', icon: 'square', description: 'Defensive square, protects against cavalry' },
  { name: 'Circle', icon: 'ellipse', description: 'Last stand formation, all-around defense' },
  { name: 'Wedge', icon: 'caret-up', description: 'Offensive wedge, breaks through enemy lines' },
  { name: 'Scattered', icon: 'radio-button-off', description: 'Irregular formation, maximizes individual initiative' }
];

const CombatTactics: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTactic, setSelectedTactic] = useState<typeof COMBAT_TACTICS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFormation, setActiveFormation] = useState('Line');

  const handleTacticPress = (tactic: typeof COMBAT_TACTICS[0]) => {
    setSelectedTactic(tactic);
    setModalVisible(true);
  };

  const handleDeployTactic = () => {
    if (selectedTactic) {
      toast.success(`Deploying ${selectedTactic.name} tactic`);
      setModalVisible(false);
    }
  };

  const handleFormationChange = (formation: string) => {
    setActiveFormation(formation);
    toast.success(`Formation changed to ${formation}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Defensive': return '#4CAF50';
      case 'Offensive': return '#F44336';
      case 'Ranged': return '#2196F3';
      case 'Stealth': return '#9C27B0';
      case 'Siege': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return '#4CAF50';
    if (effectiveness >= 70) return '#FF9800';
    return '#F44336';
  };

  const renderTacticItem = ({ item }: { item: typeof COMBAT_TACTICS[0] }) => (
    <TouchableOpacity
      style={[styles.tacticCard, !item.unlocked && styles.lockedTacticCard]}
      onPress={() => item.unlocked && handleTacticPress(item)}
      disabled={!item.unlocked}
    >
      <LinearGradient
        colors={item.unlocked
          ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']
          : ['rgba(69, 69, 69, 0.9)', 'rgba(49, 49, 49, 0.8)']
        }
        style={styles.tacticCardGradient}
      >
        <View style={styles.tacticHeader}>
          <View style={styles.tacticIconContainer}>
            <Ionicons
              name={item.unlocked ? 'shield' : 'lock-closed'}
              size={24}
              color={item.unlocked ? "#FFD700" : "#666666"}
            />
          </View>
          <View style={styles.tacticInfo}>
            <Text style={[styles.tacticName, !item.unlocked && styles.lockedText]}>
              {item.name}
            </Text>
            <Text style={[styles.tacticType, !item.unlocked && styles.lockedText]}>
              {item.type} • Level {item.level}
            </Text>
          </View>
          <View style={[styles.effectivenessBadge, { backgroundColor: getEffectivenessColor(item.effectiveness) }]}>
            <Text style={styles.effectivenessText}>{item.effectiveness}%</Text>
          </View>
        </View>

        <Text style={[styles.tacticDescription, !item.unlocked && styles.lockedText]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.tacticFooter}>
          <Text style={[styles.requirementsText, !item.unlocked && styles.lockedText]}>
            Requires: {item.unitRequirements.slice(0, 2).join(', ')}
            {item.unitRequirements.length > 2 && '...'}
          </Text>
          {!item.unlocked && (
            <Text style={styles.unlockText}>Unlock at Level {item.level}</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFormationItem = ({ item }: { item: typeof FORMATIONS[0] }) => (
    <TouchableOpacity
      style={[styles.formationCard, activeFormation === item.name && styles.activeFormationCard]}
      onPress={() => handleFormationChange(item.name)}
    >
      <LinearGradient
        colors={activeFormation === item.name
          ? ['rgba(255, 215, 0, 0.3)', 'rgba(255, 140, 0, 0.2)']
          : ['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']
        }
        style={styles.formationGradient}
      >
        <View style={styles.formationIcon}>
          <Ionicons name={item.icon} size={24} color={activeFormation === item.name ? "#FFD700" : "#FFFFFF"} />
        </View>
        <Text style={[styles.formationName, activeFormation === item.name && styles.activeFormationText]}>
          {item.name}
        </Text>
        <Text style={[styles.formationDescription, activeFormation === item.name && styles.activeFormationText]} numberOfLines={2}>
          {item.description}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/placeholder.jpg' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.6)']}
        style={styles.overlay}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.title}>COMBAT TACTICS</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Active Formation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Formation: {activeFormation}</Text>
            <FlatList
              data={FORMATIONS}
              renderItem={renderFormationItem}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.formationsList}
            />
          </View>

          {/* Available Tactics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Combat Tactics</Text>
            <FlatList
              data={COMBAT_TACTICS}
              renderItem={renderTacticItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tacticsList}
            />
          </View>
        </ScrollView>

        {/* Tactic Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedTactic && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedTactic.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.tacticDetailSection}>
                      <Text style={styles.sectionTitle}>Tactic Details</Text>
                      <Text style={styles.tacticDetailText}>
                        <Text style={styles.detailLabel}>Type:</Text> {selectedTactic.type}
                      </Text>
                      <Text style={styles.tacticDetailText}>
                        <Text style={styles.detailLabel}>Effectiveness:</Text> {selectedTactic.effectiveness}%
                      </Text>
                      <Text style={styles.tacticDetailText}>
                        <Text style={styles.detailLabel}>Required Level:</Text> {selectedTactic.level}
                      </Text>
                    </View>

                    <View style={styles.tacticDetailSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.tacticDescriptionText}>
                        {selectedTactic.description}
                      </Text>
                    </View>

                    <View style={styles.tacticDetailSection}>
                      <Text style={styles.sectionTitle}>Unit Requirements</Text>
                      {selectedTactic.unitRequirements.map((unit, index) => (
                        <Text key={index} style={styles.requirementText}>
                          • {unit}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.tacticDetailSection}>
                      <Text style={styles.sectionTitle}>Strategic Bonuses</Text>
                      {selectedTactic.bonuses.map((bonus, index) => (
                        <Text key={index} style={styles.bonusText}>
                          • {bonus}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.tacticDetailSection}>
                      <Text style={styles.sectionTitle}>Vulnerabilities</Text>
                      {selectedTactic.counters.map((counter, index) => (
                        <Text key={index} style={styles.counterText}>
                          • {counter}
                        </Text>
                      ))}
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.deployButton}
                      onPress={handleDeployTactic}
                    >
                      <Text style={styles.deployButtonText}>Deploy Tactic</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  formationsList: {
    paddingVertical: 10,
  },
  formationCard: {
    width: 120,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activeFormationCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  formationGradient: {
    padding: 15,
    alignItems: 'center',
  },
  formationIcon: {
    marginBottom: 8,
  },
  formationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  activeFormationText: {
    color: '#FFD700',
  },
  formationDescription: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 16,
  },
  tacticsList: {
    paddingBottom: 50,
  },
  tacticCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockedTacticCard: {
    opacity: 0.6,
  },
  tacticCardGradient: {
    padding: 15,
  },
  tacticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tacticIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tacticInfo: {
    flex: 1,
  },
  tacticName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  lockedText: {
    color: '#666666',
  },
  tacticType: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  effectivenessBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  effectivenessText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tacticDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 20,
    marginBottom: 10,
  },
  tacticFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requirementsText: {
    fontSize: 12,
    color: '#FFD700',
    flex: 1,
  },
  unlockText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1A1A2E',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  tacticDetailSection: {
    marginBottom: 20,
  },
  tacticDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  tacticDescriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  requirementText: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 3,
  },
  bonusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 3,
  },
  counterText: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 3,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  deployButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  deployButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
});

export default CombatTactics;