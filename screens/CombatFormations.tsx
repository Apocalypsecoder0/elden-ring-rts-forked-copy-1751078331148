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

// Sample formations data
const FORMATIONS = [
  {
    id: 'line-formation',
    name: 'Battle Line',
    type: 'Standard',
    description: 'Classic formation with units arranged in straight lines, providing balanced offense and defense.',
    unitCapacity: 50,
    effectiveness: {
      frontal: 85,
      flanking: 60,
      ranged: 75,
      melee: 80
    },
    bonuses: [
      '+20% Morale when holding position',
      '+15% Defense against charges',
      'Standard movement speed'
    ],
    penalties: [
      '-10% Flank defense',
      'Vulnerable to encirclement'
    ],
    unlocked: true
  },
  {
    id: 'wedge-formation',
    name: 'Wedge Assault',
    type: 'Offensive',
    description: 'Triangular formation designed to break through enemy lines with concentrated force at the point.',
    unitCapacity: 30,
    effectiveness: {
      frontal: 95,
      flanking: 40,
      ranged: 50,
      melee: 90
    },
    bonuses: [
      '+40% Breakthrough chance',
      '+25% Charge damage',
      '+30% Frontal attack power'
    ],
    penalties: [
      '-30% Flank defense',
      '-20% Ranged defense',
      'Slow movement speed'
    ],
    unlocked: true
  },
  {
    id: 'square-formation',
    name: 'Defensive Square',
    type: 'Defensive',
    description: 'Compact square formation protecting against cavalry and providing all-around defense.',
    unitCapacity: 40,
    effectiveness: {
      frontal: 90,
      flanking: 90,
      ranged: 70,
      melee: 85
    },
    bonuses: [
      '+35% Defense against cavalry',
      '+25% All-around defense',
      '+20% Morale in defensive positions'
    ],
    penalties: [
      '-15% Movement speed',
      '-25% Offensive capability',
      'Limited unit capacity'
    ],
    unlocked: true
  },
  {
    id: 'circle-formation',
    name: 'Last Stand Circle',
    type: 'Defensive',
    description: 'Circular formation for desperate situations, maximizing defense in all directions.',
    unitCapacity: 25,
    effectiveness: {
      frontal: 80,
      flanking: 95,
      ranged: 60,
      melee: 75
    },
    bonuses: [
      '+50% Defense when surrounded',
      '+30% Morale in dire situations',
      'No weak flanks'
    ],
    penalties: [
      '-40% Movement speed',
      '-50% Offensive capability',
      'Very limited unit capacity'
    ],
    unlocked: false
  },
  {
    id: 'skirmish-formation',
    name: 'Skirmish Line',
    type: 'Ranged',
    description: 'Loose formation for ranged units, maintaining distance while harassing enemies.',
    unitCapacity: 35,
    effectiveness: {
      frontal: 50,
      flanking: 70,
      ranged: 95,
      melee: 40
    },
    bonuses: [
      '+40% Ranged accuracy',
      '+30% Evasion from melee',
      '+20% Harassment effectiveness'
    ],
    penalties: [
      '-50% Melee defense',
      '-30% Frontal defense',
      'Vulnerable to charges'
    ],
    unlocked: true
  },
  {
    id: 'column-formation',
    name: 'Marching Column',
    type: 'Movement',
    description: 'Narrow column formation optimized for rapid movement and road travel.',
    unitCapacity: 60,
    effectiveness: {
      frontal: 70,
      flanking: 30,
      ranged: 60,
      melee: 65
    },
    bonuses: [
      '+50% Movement speed on roads',
      '+25% Travel efficiency',
      '+15% Surprise attack chance'
    ],
    penalties: [
      '-40% Flank defense',
      '-30% Combat effectiveness',
      'Vulnerable when deploying'
    ],
    unlocked: true
  }
];

const UNIT_TYPES = [
  { name: 'Infantry', icon: 'shield', color: '#4CAF50' },
  { name: 'Archers', icon: 'bow', color: '#2196F3' },
  { name: 'Cavalry', icon: 'horse', color: '#FF9800' },
  { name: 'Mages', icon: 'flash', color: '#9C27B0' },
  { name: 'Siege', icon: 'hammer', color: '#F44336' }
];

const CombatFormations: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFormation, setSelectedFormation] = useState<typeof FORMATIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFormation, setActiveFormation] = useState('line-formation');

  const handleFormationPress = (formation: typeof FORMATIONS[0]) => {
    if (formation.unlocked) {
      setSelectedFormation(formation);
      setModalVisible(true);
    } else {
      toast.error('Formation not unlocked yet');
    }
  };

  const handleDeployFormation = () => {
    if (selectedFormation) {
      setActiveFormation(selectedFormation.id);
      toast.success(`Formation changed to ${selectedFormation.name}`);
      setModalVisible(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return '#9E9E9E';
      case 'Offensive': return '#F44336';
      case 'Defensive': return '#4CAF50';
      case 'Ranged': return '#2196F3';
      case 'Movement': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const renderFormationItem = ({ item }: { item: typeof FORMATIONS[0] }) => (
    <TouchableOpacity
      style={[
        styles.formationCard,
        !item.unlocked && styles.lockedFormationCard,
        activeFormation === item.id && styles.activeFormationCard
      ]}
      onPress={() => handleFormationPress(item)}
      disabled={!item.unlocked}
    >
      <LinearGradient
        colors={
          activeFormation === item.id
            ? ['rgba(255, 215, 0, 0.3)', 'rgba(255, 140, 0, 0.2)']
            : item.unlocked
            ? ['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']
            : ['rgba(69, 69, 69, 0.9)', 'rgba(49, 49, 49, 0.8)']
        }
        style={styles.formationCardGradient}
      >
        <View style={styles.formationHeader}>
          <View style={styles.formationIconContainer}>
            <Ionicons
              name={item.unlocked ? 'grid' : 'lock-closed'}
              size={24}
              color={item.unlocked ? "#FFD700" : "#666666"}
            />
          </View>
          <View style={styles.formationInfo}>
            <Text style={[styles.formationName, !item.unlocked && styles.lockedText]}>
              {item.name}
            </Text>
            <Text style={[styles.formationType, !item.unlocked && styles.lockedText]}>
              {item.type} • {item.unitCapacity} units
            </Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>

        <Text style={[styles.formationDescription, !item.unlocked && styles.lockedText]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.effectivenessSection}>
          <Text style={[styles.effectivenessLabel, !item.unlocked && styles.lockedText]}>
            Effectiveness:
          </Text>
          <View style={styles.effectivenessBars}>
            <View style={styles.effectivenessItem}>
              <Text style={[styles.effectivenessValue, !item.unlocked && styles.lockedText]}>
                F:{item.effectiveness.frontal}
              </Text>
            </View>
            <View style={styles.effectivenessItem}>
              <Text style={[styles.effectivenessValue, !item.unlocked && styles.lockedText]}>
                S:{item.effectiveness.flanking}
              </Text>
            </View>
            <View style={styles.effectivenessItem}>
              <Text style={[styles.effectivenessValue, !item.unlocked && styles.lockedText]}>
                R:{item.effectiveness.ranged}
              </Text>
            </View>
            <View style={styles.effectivenessItem}>
              <Text style={[styles.effectivenessValue, !item.unlocked && styles.lockedText]}>
                M:{item.effectiveness.melee}
              </Text>
            </View>
          </View>
        </View>

        {activeFormation === item.id && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderUnitType = ({ item }: { item: typeof UNIT_TYPES[0] }) => (
    <View style={[styles.unitTypeCard, { borderColor: item.color }]}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.unitTypeGradient}
      >
        <View style={[styles.unitIcon, { backgroundColor: item.color + '40' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.unitTypeName}>{item.name}</Text>
      </LinearGradient>
    </View>
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
          <Text style={styles.title}>UNIT FORMATIONS</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Formation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Current Formation: {FORMATIONS.find(f => f.id === activeFormation)?.name || 'None'}
            </Text>
          </View>

          {/* Unit Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Unit Types</Text>
            <FlatList
              data={UNIT_TYPES}
              renderItem={renderUnitType}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.unitTypesList}
            />
          </View>

          {/* Formations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Combat Formations</Text>
            <FlatList
              data={FORMATIONS}
              renderItem={renderFormationItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formationsList}
            />
          </View>
        </ScrollView>

        {/* Formation Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedFormation && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedFormation.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.formationDetailSection}>
                      <Text style={styles.sectionTitle}>Formation Details</Text>
                      <Text style={styles.formationDetailText}>
                        <Text style={styles.detailLabel}>Type:</Text> {selectedFormation.type}
                      </Text>
                      <Text style={styles.formationDetailText}>
                        <Text style={styles.detailLabel}>Unit Capacity:</Text> {selectedFormation.unitCapacity}
                      </Text>
                    </View>

                    <View style={styles.formationDetailSection}>
                      <Text style={styles.sectionTitle}>Effectiveness Ratings</Text>
                      <Text style={styles.effectivenessDetailText}>
                        <Text style={styles.detailLabel}>Frontal Attack:</Text> {selectedFormation.effectiveness.frontal}%
                      </Text>
                      <Text style={styles.effectivenessDetailText}>
                        <Text style={styles.detailLabel}>Flank Defense:</Text> {selectedFormation.effectiveness.flanking}%
                      </Text>
                      <Text style={styles.effectivenessDetailText}>
                        <Text style={styles.detailLabel}>Ranged Combat:</Text> {selectedFormation.effectiveness.ranged}%
                      </Text>
                      <Text style={styles.effectivenessDetailText}>
                        <Text style={styles.detailLabel}>Melee Combat:</Text> {selectedFormation.effectiveness.melee}%
                      </Text>
                    </View>

                    <View style={styles.formationDetailSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.formationDescriptionText}>
                        {selectedFormation.description}
                      </Text>
                    </View>

                    <View style={styles.formationDetailSection}>
                      <Text style={styles.sectionTitle}>Strategic Bonuses</Text>
                      {selectedFormation.bonuses.map((bonus, index) => (
                        <Text key={index} style={styles.bonusText}>
                          • {bonus}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.formationDetailSection}>
                      <Text style={styles.sectionTitle}>Strategic Penalties</Text>
                      {selectedFormation.penalties.map((penalty, index) => (
                        <Text key={index} style={styles.penaltyText}>
                          • {penalty}
                        </Text>
                      ))}
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.deployButton}
                      onPress={handleDeployFormation}
                    >
                      <Text style={styles.deployButtonText}>
                        {activeFormation === selectedFormation.id ? 'Already Active' : 'Deploy Formation'}
                      </Text>
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
  unitTypesList: {
    paddingVertical: 10,
  },
  unitTypeCard: {
    width: 80,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
  },
  unitTypeGradient: {
    padding: 10,
    alignItems: 'center',
  },
  unitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitTypeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formationsList: {
    paddingBottom: 50,
  },
  formationCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockedFormationCard: {
    opacity: 0.6,
  },
  activeFormationCard: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  formationCardGradient: {
    padding: 15,
  },
  formationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  formationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  formationInfo: {
    flex: 1,
  },
  formationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  lockedText: {
    color: '#666666',
  },
  formationType: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  formationDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 20,
    marginBottom: 15,
  },
  effectivenessSection: {
    marginBottom: 10,
  },
  effectivenessLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  effectivenessBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  effectivenessItem: {
    alignItems: 'center',
  },
  effectivenessValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A1A2E',
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
  formationDetailSection: {
    marginBottom: 20,
  },
  formationDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  effectivenessDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  formationDescriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  bonusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 3,
  },
  penaltyText: {
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

export default CombatFormations;