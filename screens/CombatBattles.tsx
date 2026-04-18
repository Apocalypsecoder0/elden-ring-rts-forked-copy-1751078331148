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

// Sample active battles data
const ACTIVE_BATTLES = [
  {
    id: 'battle-limgrave-outskirts',
    name: 'Limgrave Outskirts Assault',
    location: 'Limgrave Outskirts',
    type: 'Offensive',
    status: 'In Progress',
    progress: 65,
    enemyForces: 'Stormveil Soldiers',
    alliedForces: 'Tarnished Vanguard',
    units: {
      infantry: 45,
      archers: 20,
      cavalry: 15,
      mages: 8
    },
    casualties: {
      allied: 12,
      enemy: 28
    },
    objectives: [
      'Capture the watchtower',
      'Secure the crossroads',
      'Eliminate enemy commander'
    ],
    timeElapsed: '2h 15m',
    estimatedCompletion: '45m'
  },
  {
    id: 'battle-caelid-defense',
    name: 'Caelid Wasteland Defense',
    location: 'Caelid Wasteland',
    type: 'Defensive',
    status: 'Critical',
    progress: 30,
    enemyForces: 'Starscourge Radahn Forces',
    alliedForces: 'Caelid Resistance',
    units: {
      infantry: 78,
      archers: 35,
      cavalry: 12,
      mages: 15
    },
    casualties: {
      allied: 45,
      enemy: 67
    },
    objectives: [
      'Hold the fortress walls',
      'Protect the civilians',
      'Await reinforcements'
    ],
    timeElapsed: '4h 30m',
    estimatedCompletion: '2h 15m'
  },
  {
    id: 'battle-liurnia-ambush',
    name: 'Liurnia Lakes Ambush',
    location: 'Liurnia of the Lakes',
    type: 'Ambush',
    status: 'Victory Imminent',
    progress: 85,
    enemyForces: 'Carian Knights',
    alliedForces: 'Shadow Assassins',
    units: {
      infantry: 25,
      archers: 40,
      cavalry: 5,
      mages: 22
    },
    casualties: {
      allied: 8,
      enemy: 52
    },
    objectives: [
      'Eliminate the caravan',
      'Capture magical artifacts',
      'Escape undetected'
    ],
    timeElapsed: '1h 45m',
    estimatedCompletion: '15m'
  }
];

const CombatBattles: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedBattle, setSelectedBattle] = useState<typeof ACTIVE_BATTLES[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBattlePress = (battle: typeof ACTIVE_BATTLES[0]) => {
    setSelectedBattle(battle);
    setModalVisible(true);
  };

  const handleReinforceBattle = () => {
    if (selectedBattle) {
      toast.success(`Dispatching reinforcements to ${selectedBattle.name}`);
      setModalVisible(false);
    }
  };

  const handleRetreatBattle = () => {
    if (selectedBattle) {
      toast.warning(`Initiating retreat from ${selectedBattle.name}`);
      setModalVisible(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return '#FF9800';
      case 'Critical': return '#F44336';
      case 'Victory Imminent': return '#4CAF50';
      case 'Defeated': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Offensive': return 'arrow-forward';
      case 'Defensive': return 'shield';
      case 'Ambush': return 'eye-off';
      default: return 'flag';
    }
  };

  const renderBattleItem = ({ item }: { item: typeof ACTIVE_BATTLES[0] }) => (
    <TouchableOpacity
      style={styles.battleCard}
      onPress={() => handleBattlePress(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.battleCardGradient}
      >
        <View style={styles.battleHeader}>
          <View style={styles.battleIconContainer}>
            <Ionicons name={getTypeIcon(item.type)} size={24} color="#FFD700" />
          </View>
          <View style={styles.battleInfo}>
            <Text style={styles.battleName}>{item.name}</Text>
            <Text style={styles.battleLocation}>{item.location} • {item.type}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.battleStats}>
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${item.progress}%` },
                  { backgroundColor: getStatusColor(item.status) }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>

          <View style={styles.casualtiesSection}>
            <Text style={styles.casualtiesLabel}>Casualties</Text>
            <Text style={styles.casualtiesText}>
              <Text style={styles.alliedCasualties}>{item.casualties.allied}</Text> /{' '}
              <Text style={styles.enemyCasualties}>{item.casualties.enemy}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.battleFooter}>
          <Text style={styles.timeText}>
            <Ionicons name="time-outline" size={14} color="#FFD700" />
            {' '}{item.timeElapsed}
          </Text>
          <Text style={styles.etaText}>
            ETA: {item.estimatedCompletion}
          </Text>
        </View>
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
          <Text style={styles.title}>ACTIVE BATTLES</Text>
          <TouchableOpacity style={styles.newBattleButton}>
            <Ionicons name="add" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Active Battles Count */}
        <View style={styles.battleCount}>
          <Text style={styles.battleCountText}>
            {ACTIVE_BATTLES.length} Active Battle{ACTIVE_BATTLES.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Battles List */}
        <FlatList
          data={ACTIVE_BATTLES}
          renderItem={renderBattleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.battlesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Battle Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedBattle && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedBattle.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.battleDetailSection}>
                      <Text style={styles.sectionTitle}>Battle Details</Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Location:</Text> {selectedBattle.location}
                      </Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Type:</Text> {selectedBattle.type}
                      </Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Status:</Text> {selectedBattle.status}
                      </Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Progress:</Text> {selectedBattle.progress}%
                      </Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Time Elapsed:</Text> {selectedBattle.timeElapsed}
                      </Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Estimated Completion:</Text> {selectedBattle.estimatedCompletion}
                      </Text>
                    </View>

                    <View style={styles.battleDetailSection}>
                      <Text style={styles.sectionTitle}>Forces</Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Allied:</Text> {selectedBattle.alliedForces}
                      </Text>
                      <Text style={styles.battleDetailText}>
                        <Text style={styles.detailLabel}>Enemy:</Text> {selectedBattle.enemyForces}
                      </Text>
                    </View>

                    <View style={styles.battleDetailSection}>
                      <Text style={styles.sectionTitle}>Unit Composition</Text>
                      <Text style={styles.unitText}>
                        <Text style={styles.detailLabel}>Infantry:</Text> {selectedBattle.units.infantry}
                      </Text>
                      <Text style={styles.unitText}>
                        <Text style={styles.detailLabel}>Archers:</Text> {selectedBattle.units.archers}
                      </Text>
                      <Text style={styles.unitText}>
                        <Text style={styles.detailLabel}>Cavalry:</Text> {selectedBattle.units.cavalry}
                      </Text>
                      <Text style={styles.unitText}>
                        <Text style={styles.detailLabel}>Mages:</Text> {selectedBattle.units.mages}
                      </Text>
                    </View>

                    <View style={styles.battleDetailSection}>
                      <Text style={styles.sectionTitle}>Casualties</Text>
                      <Text style={styles.casualtyText}>
                        <Text style={styles.alliedCasualtyNumber}>{selectedBattle.casualties.allied}</Text> Allied •{' '}
                        <Text style={styles.enemyCasualtyNumber}>{selectedBattle.casualties.enemy}</Text> Enemy
                      </Text>
                    </View>

                    <View style={styles.battleDetailSection}>
                      <Text style={styles.sectionTitle}>Objectives</Text>
                      {selectedBattle.objectives.map((objective, index) => (
                        <Text key={index} style={styles.objectiveText}>
                          • {objective}
                        </Text>
                      ))}
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.retreatButton}
                      onPress={handleRetreatBattle}
                    >
                      <Text style={styles.retreatButtonText}>Retreat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reinforceButton}
                      onPress={handleReinforceBattle}
                    >
                      <Text style={styles.reinforceButtonText}>Reinforce</Text>
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
  newBattleButton: {
    padding: 10,
  },
  battleCount: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  battleCountText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: 'bold',
  },
  battlesList: {
    padding: 20,
    paddingBottom: 100,
  },
  battleCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  battleCardGradient: {
    padding: 15,
  },
  battleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  battleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  battleInfo: {
    flex: 1,
  },
  battleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  battleLocation: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  battleStats: {
    marginBottom: 15,
  },
  progressSection: {
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  casualtiesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  casualtiesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  casualtiesText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  alliedCasualties: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  enemyCasualties: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  battleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  etaText: {
    fontSize: 12,
    color: '#AAAAAA',
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
  battleDetailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  battleDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  unitText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  casualtyText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  alliedCasualtyNumber: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  enemyCasualtyNumber: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  objectiveText: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 3,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  retreatButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  retreatButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reinforceButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  reinforceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CombatBattles;