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

// Sample cooperative sessions data
const COOP_SESSIONS = [
  {
    id: 'session-limgrave-coop',
    name: 'Limgrave Exploration Party',
    host: 'EldenLord123',
    players: [
      { name: 'EldenLord123', level: 25, class: 'Warrior', status: 'Host' },
      { name: 'MoonlightMage', level: 22, class: 'Mage', status: 'Ready' },
      { name: 'ShadowAssassin', level: 28, class: 'Assassin', status: 'Ready' },
      { name: 'HolyKnight99', level: 24, class: 'Paladin', status: 'Ready' }
    ],
    maxPlayers: 4,
    difficulty: 'Normal',
    region: 'Limgrave',
    objectives: [
      'Clear Stormveil Castle',
      'Defeat Margit',
      'Collect Erdtree Seals'
    ],
    timeLimit: '2 hours',
    rewards: 'Shared loot pool',
    status: 'Waiting'
  },
  {
    id: 'session-liurnia-dungeon',
    name: 'Liurnia Dungeon Crawl',
    host: 'CrystalSage',
    players: [
      { name: 'CrystalSage', level: 35, class: 'Sorcerer', status: 'Host' },
      { name: 'FireGiant', level: 38, class: 'Barbarian', status: 'Ready' },
      { name: 'SpiritCaller', level: 32, class: 'Summoner', status: 'In Combat' }
    ],
    maxPlayers: 4,
    difficulty: 'Hard',
    region: 'Liurnia of the Lakes',
    objectives: [
      'Navigate Academy ruins',
      'Solve magical puzzles',
      'Defeat Royal Knight Loretta'
    ],
    timeLimit: '3 hours',
    rewards: 'Unique magical items',
    status: 'In Progress'
  },
  {
    id: 'session-caelid-survival',
    name: 'Caelid Survival Challenge',
    host: 'ScarletHunter',
    players: [
      { name: 'ScarletHunter', level: 45, class: 'Ranger', status: 'Host' },
      { name: 'RotEater', level: 42, class: 'Fighter', status: 'Ready' }
    ],
    maxPlayers: 6,
    difficulty: 'Extreme',
    region: 'Caelid',
    objectives: [
      'Survive Scarlet Rot',
      'Rescue infected villagers',
      'Destroy rot sources'
    ],
    timeLimit: '4 hours',
    rewards: 'Rot resistance items',
    status: 'Recruiting'
  }
];

const AVAILABLE_SESSIONS = [
  {
    id: 'session-altus-exploration',
    name: 'Altus Plateau Discovery',
    host: 'GoldenOrder',
    players: 2,
    maxPlayers: 4,
    level: '30-40',
    difficulty: 'Hard',
    region: 'Altus Plateau'
  },
  {
    id: 'session-mountaintops-climb',
    name: 'Mountaintops Great Journey',
    host: 'SummitSeeker',
    players: 1,
    maxPlayers: 3,
    level: '50-60',
    difficulty: 'Extreme',
    region: 'Mountaintops of the Giants'
  },
  {
    id: 'session-mt-gelmir-volcano',
    name: 'Volcano Manor Infiltration',
    host: 'FlameKeeper',
    players: 3,
    maxPlayers: 4,
    level: '25-35',
    difficulty: 'Normal',
    region: 'Mt. Gelmir'
  }
];

const MultiplayerCoop: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedSession, setSelectedSession] = useState<typeof COOP_SESSIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-sessions' | 'join-sessions'>('my-sessions');

  const handleSessionPress = (session: typeof COOP_SESSIONS[0]) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  const handleJoinSession = (session: typeof AVAILABLE_SESSIONS[0]) => {
    toast.success(`Joining ${session.name}...`);
  };

  const handleCreateSession = () => {
    toast.success('Opening session creation...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting': return '#FF9800';
      case 'In Progress': return '#4CAF50';
      case 'Recruiting': return '#2196F3';
      case 'Ready': return '#4CAF50';
      case 'In Combat': return '#F44336';
      case 'Host': return '#FFD700';
      default: return '#9E9E9E';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Normal': return '#4CAF50';
      case 'Hard': return '#FF9800';
      case 'Extreme': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderMySessionItem = ({ item }: { item: typeof COOP_SESSIONS[0] }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => handleSessionPress(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.sessionCardGradient}
      >
        <View style={styles.sessionHeader}>
          <View style={styles.sessionIconContainer}>
            <Ionicons name="people" size={24} color="#FFD700" />
          </View>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionName}>{item.name}</Text>
            <Text style={styles.sessionHost}>Host: {item.host}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.sessionStats}>
          <Text style={styles.playersText}>
            {item.players.length}/{item.maxPlayers} Players
          </Text>
          <Text style={styles.regionText}>{item.region}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.sessionObjectives} numberOfLines={1}>
          {item.objectives[0]}
        </Text>

        <View style={styles.sessionFooter}>
          <Text style={styles.timeLimit}>
            <Ionicons name="time-outline" size={14} color="#FFD700" />
            {' '}{item.timeLimit}
          </Text>
          <Text style={styles.rewards}>
            {item.rewards}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderAvailableSessionItem = ({ item }: { item: typeof AVAILABLE_SESSIONS[0] }) => (
    <TouchableOpacity
      style={styles.availableSessionCard}
      onPress={() => handleJoinSession(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.availableSessionGradient}
      >
        <View style={styles.availableSessionHeader}>
          <Text style={styles.availableSessionName}>{item.name}</Text>
          <Text style={styles.availableSessionHost}>by {item.host}</Text>
        </View>

        <View style={styles.availableSessionStats}>
          <Text style={styles.availablePlayers}>
            {item.players}/{item.maxPlayers} players
          </Text>
          <Text style={styles.availableLevel}>
            Level {item.level}
          </Text>
          <View style={[styles.availableDifficulty, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.availableDifficultyText}>{item.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.availableRegion}>
          {item.region}
        </Text>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinSession(item)}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
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
          <Text style={styles.title}>COOPERATIVE PLAY</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateSession}
          >
            <Ionicons name="add" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'my-sessions' && styles.activeTab]}
            onPress={() => setActiveTab('my-sessions')}
          >
            <Text style={[styles.tabText, activeTab === 'my-sessions' && styles.activeTabText]}>
              My Sessions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'join-sessions' && styles.activeTab]}
            onPress={() => setActiveTab('join-sessions')}
          >
            <Text style={[styles.tabText, activeTab === 'join-sessions' && styles.activeTabText]}>
              Join Sessions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'my-sessions' ? (
          <FlatList
            data={COOP_SESSIONS}
            renderItem={renderMySessionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.sessionsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={AVAILABLE_SESSIONS}
            renderItem={renderAvailableSessionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.availableSessionsList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Session Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedSession && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedSession.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.sessionDetailSection}>
                      <Text style={styles.sectionTitle}>Session Details</Text>
                      <Text style={styles.sessionDetailText}>
                        <Text style={styles.detailLabel}>Host:</Text> {selectedSession.host}
                      </Text>
                      <Text style={styles.sessionDetailText}>
                        <Text style={styles.detailLabel}>Region:</Text> {selectedSession.region}
                      </Text>
                      <Text style={styles.sessionDetailText}>
                        <Text style={styles.detailLabel}>Difficulty:</Text> {selectedSession.difficulty}
                      </Text>
                      <Text style={styles.sessionDetailText}>
                        <Text style={styles.detailLabel}>Time Limit:</Text> {selectedSession.timeLimit}
                      </Text>
                      <Text style={styles.sessionDetailText}>
                        <Text style={styles.detailLabel}>Rewards:</Text> {selectedSession.rewards}
                      </Text>
                    </View>

                    <View style={styles.sessionDetailSection}>
                      <Text style={styles.sectionTitle}>Players ({selectedSession.players.length}/{selectedSession.maxPlayers})</Text>
                      {selectedSession.players.map((player, index) => (
                        <View key={index} style={styles.playerItem}>
                          <Text style={styles.playerName}>{player.name}</Text>
                          <Text style={styles.playerDetails}>
                            Level {player.level} {player.class}
                          </Text>
                          <View style={[styles.playerStatus, { backgroundColor: getStatusColor(player.status) }]}>
                            <Text style={styles.playerStatusText}>{player.status}</Text>
                          </View>
                        </View>
                      ))}
                    </View>

                    <View style={styles.sessionDetailSection}>
                      <Text style={styles.sectionTitle}>Objectives</Text>
                      {selectedSession.objectives.map((objective, index) => (
                        <Text key={index} style={styles.objectiveText}>
                          • {objective}
                        </Text>
                      ))}
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.inviteButton}
                      onPress={() => toast.success('Opening invite menu...')}
                    >
                      <Text style={styles.inviteButtonText}>Invite Friends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={() => toast.success('Starting session...')}
                    >
                      <Text style={styles.startButtonText}>Start Session</Text>
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
  createButton: {
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCCCCC',
  },
  activeTabText: {
    color: '#1A1A2E',
  },
  sessionsList: {
    padding: 20,
    paddingBottom: 100,
  },
  sessionCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sessionCardGradient: {
    padding: 15,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sessionHost: {
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
  sessionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playersText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginRight: 15,
  },
  regionText: {
    fontSize: 14,
    color: '#AAAAAA',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sessionObjectives: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLimit: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  rewards: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  availableSessionsList: {
    padding: 20,
    paddingBottom: 100,
  },
  availableSessionCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  availableSessionGradient: {
    padding: 15,
  },
  availableSessionHeader: {
    marginBottom: 10,
  },
  availableSessionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  availableSessionHost: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  availableSessionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  availablePlayers: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginRight: 15,
  },
  availableLevel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginRight: 15,
  },
  availableDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableDifficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  availableRegion: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  sessionDetailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  sessionDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  playerDetails: {
    fontSize: 12,
    color: '#CCCCCC',
    marginRight: 10,
  },
  playerStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  playerStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  inviteButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default MultiplayerCoop;