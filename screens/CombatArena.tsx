import React, { useState, useEffect } from 'react';
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
import { CombatArena, CombatMatch, CombatResult, PlayerCharacter } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample combat arenas
const COMBAT_ARENAS: CombatArena[] = [
  {
    id: 'limgrave_coliseum',
    name: 'Limgrave Coliseum',
    description: 'A grand arena in the heart of Limgrave. Features stone architecture and cheering crowds.',
    location: 'Limgrave',
    difficulty: 'Easy',
    rewards: ['Runes', 'Equipment', 'Arena Points'],
    requirements: { level: 1, runes: 0 },
    available: true,
    completed: false,
    bestTime: undefined,
  },
  {
    id: 'liurnia_amphitheater',
    name: 'Liurnia Amphitheater',
    description: 'An elegant arena surrounded by magical waters. Tests both combat and spellcasting skills.',
    location: 'Liurnia',
    difficulty: 'Medium',
    rewards: ['Runes', 'Sorceries', 'Arena Points'],
    requirements: { level: 20, runes: 10000 },
    available: true,
    completed: false,
    bestTime: undefined,
  },
  {
    id: 'caelid_sandpit',
    name: 'Caelid Sandpit',
    description: 'A brutal arena in the harsh Caelid wastes. Only the strongest survive.',
    location: 'Caelid',
    difficulty: 'Hard',
    rewards: ['Runes', 'Legendary Equipment', 'Arena Points'],
    requirements: { level: 50, runes: 50000 },
    available: false,
    completed: false,
    bestTime: undefined,
  },
  {
    id: 'altus_grand_coliseum',
    name: 'Altus Grand Coliseum',
    description: 'The largest and most prestigious arena in the Lands Between. Reserved for champions.',
    location: 'Altus Plateau',
    difficulty: 'Expert',
    rewards: ['Runes', 'Legendary Equipment', 'Titles', 'Arena Points'],
    requirements: { level: 80, runes: 200000 },
    available: false,
    completed: false,
    bestTime: undefined,
  },
];

// Sample active matches
const SAMPLE_MATCHES: CombatMatch[] = [
  {
    id: 'match_001',
    arenaId: 'limgrave_coliseum',
    playerId: 'player_1',
    opponentId: 'npc_warrior',
    status: 'active',
    startTime: new Date(),
    duration: 0,
    winner: undefined,
    rewards: [],
  },
];

export default function CombatArenaScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedArena, setSelectedArena] = useState<CombatArena | null>(null);
  const [showArenaDetails, setShowArenaDetails] = useState(false);
  const [activeMatches, setActiveMatches] = useState<CombatMatch[]>(SAMPLE_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<CombatMatch | null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [matchTimer, setMatchTimer] = useState<NodeJS.Timeout | null>(null);

  // Update match timers
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMatches(prev => prev.map(match => ({
        ...match,
        duration: match.status === 'active' ? match.duration + 1 : match.duration,
      })));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const selectArena = (arena: CombatArena) => {
    setSelectedArena(arena);
    setShowArenaDetails(true);
  };

  const startMatch = (arena: CombatArena) => {
    if (!arena.available) {
      toast.error('This arena is not available yet!');
      return;
    }

    // Check requirements
    if (arena.requirements.level > 1) { // In a real game, check actual player level
      toast.error(`You need to be level ${arena.requirements.level} to enter this arena!`);
      return;
    }

    const newMatch: CombatMatch = {
      id: `match_${Date.now()}`,
      arenaId: arena.id,
      playerId: 'player_1',
      opponentId: `npc_${arena.difficulty.toLowerCase()}_opponent`,
      status: 'active',
      startTime: new Date(),
      duration: 0,
      winner: undefined,
      rewards: [],
    };

    setActiveMatches(prev => [...prev, newMatch]);
    toast.success(`Entering ${arena.name}!`);
    setShowArenaDetails(false);
  };

  const endMatch = (match: CombatMatch, result: 'victory' | 'defeat') => {
    const updatedMatch: CombatMatch = {
      ...match,
      status: 'completed',
      winner: result === 'victory' ? match.playerId : match.opponentId,
      rewards: result === 'victory' ? ['Runes', 'Arena Points'] : [],
    };

    setActiveMatches(prev => prev.map(m => m.id === match.id ? updatedMatch : m));

    if (result === 'victory') {
      toast.success('Victory! Rewards earned!');
    } else {
      toast.error('Defeat! Better luck next time!');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#32CD32';
      case 'Medium': return '#FFD700';
      case 'Hard': return '#FF6347';
      case 'Expert': return '#DC143C';
      default: return '#D4AF37';
    }
  };

  const renderArenaItem = ({ item }: { item: CombatArena }) => {
    const difficultyColor = getDifficultyColor(item.difficulty);

    return (
      <TouchableOpacity
        style={[styles.arenaItem, !item.available && styles.unavailableArena]}
        onPress={() => selectArena(item)}
        disabled={!item.available}
      >
        <View style={styles.arenaHeader}>
          <View style={[styles.arenaIconContainer, { backgroundColor: `${difficultyColor}20` }]}>
            <FontAwesome5 name="shield-alt" size={20} color={item.available ? difficultyColor : "#666"} />
          </View>
          <View style={styles.arenaInfo}>
            <Text style={[styles.arenaName, !item.available && styles.unavailableText]}>
              {item.name}
            </Text>
            <Text style={[styles.arenaLocation, !item.available && styles.unavailableText]}>
              {item.location}
            </Text>
          </View>
          {!item.available && (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={16} color="#666" />
            </View>
          )}
          {item.completed && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#32CD32" />
            </View>
          )}
        </View>

        <Text style={[styles.arenaDescription, !item.available && styles.unavailableText]} numberOfLines={2}>
          {item.available ? item.description : 'Requirements not met'}
        </Text>

        <View style={styles.arenaStats}>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
          <Text style={[styles.requirementsText, !item.available && styles.unavailableText]}>
            Lv.{item.requirements.level}+
          </Text>
        </View>

        {item.bestTime && (
          <View style={styles.bestTimeContainer}>
            <Ionicons name="time" size={14} color="#A89968" />
            <Text style={styles.bestTimeText}>Best: {formatDuration(item.bestTime)}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderActiveMatchItem = ({ item }: { item: CombatMatch }) => {
    const arena = COMBAT_ARENAS.find(a => a.id === item.arenaId);

    return (
      <TouchableOpacity
        style={styles.matchItem}
        onPress={() => {
          setSelectedMatch(item);
          setShowMatchDetails(true);
        }}
      >
        <View style={styles.matchHeader}>
          <View style={styles.matchIconContainer}>
            <FontAwesome5 name="sword" size={20} color="#D4AF37" />
          </View>
          <View style={styles.matchInfo}>
            <Text style={styles.matchArenaName}>{arena?.name || 'Unknown Arena'}</Text>
            <Text style={styles.matchStatus}>
              {item.status === 'active' ? `Active - ${formatDuration(item.duration)}` : 'Completed'}
            </Text>
          </View>
          <View style={[styles.matchStatusIndicator, { backgroundColor: item.status === 'active' ? '#32CD32' : '#666' }]} />
        </View>

        <View style={styles.matchDetails}>
          <Text style={styles.matchOpponent}>vs {item.opponentId.replace('npc_', '').replace('_', ' ')}</Text>
          {item.winner && (
            <Text style={[styles.matchResult, item.winner === item.playerId ? styles.victoryText : styles.defeatText]}>
              {item.winner === item.playerId ? 'Victory!' : 'Defeated'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderArenaDetailsModal = () => {
    if (!selectedArena) return null;

    const difficultyColor = getDifficultyColor(selectedArena.difficulty);

    return (
      <Modal
        visible={showArenaDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowArenaDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.arenaDetailsContainer}>
            <View style={styles.arenaDetailsHeader}>
              <Text style={styles.arenaDetailsTitle}>Arena Details</Text>
              <TouchableOpacity onPress={() => setShowArenaDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.arenaDetailsContent}>
              <View style={styles.arenaDetailHeader}>
                <View style={[styles.detailArenaIconContainer, { backgroundColor: `${difficultyColor}20` }]}>
                  <FontAwesome5 name="shield-alt" size={48} color={difficultyColor} />
                </View>
                <View style={styles.detailArenaInfo}>
                  <Text style={styles.detailArenaName}>{selectedArena.name}</Text>
                  <Text style={styles.detailArenaLocation}>{selectedArena.location}</Text>
                  <View style={[styles.detailDifficultyBadge, { backgroundColor: difficultyColor }]}>
                    <Text style={styles.detailDifficultyText}>{selectedArena.difficulty}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.arenaDetailDescription}>{selectedArena.description}</Text>

              <View style={styles.requirementsSection}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                <View style={styles.requirementItem}>
                  <Ionicons name="person" size={16} color="#A89968" />
                  <Text style={styles.requirementText}>Level {selectedArena.requirements.level}+</Text>
                </View>
                {selectedArena.requirements.runes > 0 && (
                  <View style={styles.requirementItem}>
                    <FontAwesome5 name="coins" size={16} color="#A89968" />
                    <Text style={styles.requirementText}>{selectedArena.requirements.runes.toLocaleString()} Runes</Text>
                  </View>
                )}
              </View>

              <View style={styles.rewardsSection}>
                <Text style={styles.sectionTitle}>Rewards</Text>
                {selectedArena.rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Ionicons name="gift" size={16} color="#FFD700" />
                    <Text style={styles.rewardText}>{reward}</Text>
                  </View>
                ))}
              </View>

              {selectedArena.bestTime && (
                <View style={styles.bestTimeSection}>
                  <Text style={styles.sectionTitle}>Personal Best</Text>
                  <View style={styles.bestTimeItem}>
                    <Ionicons name="time" size={16} color="#A89968" />
                    <Text style={styles.bestTimeValue}>{formatDuration(selectedArena.bestTime)}</Text>
                  </View>
                </View>
              )}

              <View style={styles.arenaActions}>
                <TouchableOpacity
                  style={[styles.enterArenaButton, !selectedArena.available && styles.disabledButton]}
                  onPress={() => startMatch(selectedArena)}
                  disabled={!selectedArena.available}
                >
                  <Text style={[styles.enterArenaButtonText, !selectedArena.available && styles.disabledButtonText]}>
                    {selectedArena.available ? 'Enter Arena' : 'Locked'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMatchDetailsModal = () => {
    if (!selectedMatch) return null;

    const arena = COMBAT_ARENAS.find(a => a.id === selectedMatch.arenaId);

    return (
      <Modal
        visible={showMatchDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMatchDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.matchDetailsContainer}>
            <View style={styles.matchDetailsHeader}>
              <Text style={styles.matchDetailsTitle}>Match Details</Text>
              <TouchableOpacity onPress={() => setShowMatchDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.matchDetailsContent}>
              <View style={styles.matchDetailHeader}>
                <View style={styles.detailMatchIconContainer}>
                  <FontAwesome5 name="sword" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailMatchInfo}>
                  <Text style={styles.detailMatchArena}>{arena?.name || 'Unknown Arena'}</Text>
                  <Text style={styles.detailMatchOpponent}>vs {selectedMatch.opponentId.replace('npc_', '').replace('_', ' ')}</Text>
                  <Text style={styles.detailMatchDuration}>
                    Duration: {formatDuration(selectedMatch.duration)}
                  </Text>
                </View>
              </View>

              <View style={styles.matchStatusSection}>
                <Text style={styles.matchStatusLabel}>Status:</Text>
                <Text style={[styles.matchStatusValue,
                  selectedMatch.status === 'active' ? styles.activeStatus :
                  selectedMatch.winner === selectedMatch.playerId ? styles.victoryStatus : styles.defeatStatus
                ]}>
                  {selectedMatch.status === 'active' ? 'Active' :
                   selectedMatch.winner === selectedMatch.playerId ? 'Victory!' : 'Defeated'}
                </Text>
              </View>

              {selectedMatch.status === 'active' && (
                <View style={styles.matchActions}>
                  <TouchableOpacity
                    style={styles.forfeitButton}
                    onPress={() => {
                      Alert.alert(
                        'Forfeit Match',
                        'Are you sure you want to forfeit this match?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Forfeit', style: 'destructive', onPress: () => endMatch(selectedMatch, 'defeat') }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.forfeitButtonText}>Forfeit Match</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.victoryButton}
                    onPress={() => endMatch(selectedMatch, 'victory')}
                  >
                    <Text style={styles.victoryButtonText}>Claim Victory</Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedMatch.rewards.length > 0 && (
                <View style={styles.rewardsEarnedSection}>
                  <Text style={styles.sectionTitle}>Rewards Earned</Text>
                  {selectedMatch.rewards.map((reward, index) => (
                    <View key={index} style={styles.rewardEarnedItem}>
                      <Ionicons name="trophy" size={16} color="#FFD700" />
                      <Text style={styles.rewardEarnedText}>{reward}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20fantasy%20combat%20arena%20with%20spectators%20and%20magical%20effects&aspect=9:16&seed=combarena' }}
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
          <Text style={styles.headerTitle}>COMBAT ARENA</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{COMBAT_ARENAS.filter(a => a.available).length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{COMBAT_ARENAS.filter(a => a.completed).length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activeMatches.filter(m => m.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>

        {activeMatches.filter(m => m.status === 'active').length > 0 && (
          <View style={styles.activeMatchesSection}>
            <Text style={styles.sectionTitle}>Active Matches</Text>
            <FlatList
              data={activeMatches.filter(m => m.status === 'active')}
              renderItem={renderActiveMatchItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeMatchesList}
            />
          </View>
        )}

        <View style={styles.arenasContainer}>
          <Text style={styles.sectionTitle}>Arenas</Text>
          <FlatList
            data={COMBAT_ARENAS}
            renderItem={renderArenaItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.arenasList}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="trophy" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Rankings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('CombatMultiplayer')}
          >
            <Ionicons name="people" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Multiplayer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="stats-chart" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Stats</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderArenaDetailsModal()}
      {renderMatchDetailsModal()}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  statLabel: {
    fontSize: 12,
    color: '#A89968',
    marginTop: 4,
  },
  activeMatchesSection: {
    marginBottom: 16,
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
  activeMatchesList: {
    paddingRight: 16,
  },
  matchItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: width * 0.7,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  matchInfo: {
    flex: 1,
  },
  matchArenaName: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  matchStatus: {
    color: '#A89968',
    fontSize: 12,
  },
  matchStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchOpponent: {
    color: '#A89968',
    fontSize: 12,
  },
  matchResult: {
    fontSize: 12,
    fontWeight: '600',
  },
  victoryText: {
    color: '#32CD32',
  },
  defeatText: {
    color: '#FF6347',
  },
  arenasContainer: {
    flex: 1,
  },
  arenasList: {
    paddingBottom: 20,
  },
  arenaItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  unavailableArena: {
    opacity: 0.6,
  },
  arenaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  arenaIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  arenaInfo: {
    flex: 1,
  },
  arenaName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  arenaLocation: {
    color: '#A89968',
    fontSize: 12,
  },
  unavailableText: {
    color: '#666',
  },
  lockBadge: {
    marginLeft: 8,
  },
  completedBadge: {
    marginLeft: 8,
  },
  arenaDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  arenaStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  requirementsText: {
    color: '#A89968',
    fontSize: 12,
  },
  bestTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bestTimeText: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 4,
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
  arenaDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  arenaDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  arenaDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  arenaDetailsContent: {
    flex: 1,
  },
  arenaDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailArenaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailArenaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailArenaName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailArenaLocation: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  detailDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  detailDifficultyText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  arenaDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  requirementsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  rewardsSection: {
    marginBottom: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 8,
  },
  bestTimeSection: {
    marginBottom: 16,
  },
  bestTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestTimeValue: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  arenaActions: {
    marginTop: 20,
  },
  enterArenaButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  enterArenaButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  disabledButtonText: {
    color: '#999',
  },
  matchDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  matchDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  matchDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  matchDetailsContent: {
    alignItems: 'center',
  },
  matchDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailMatchIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailMatchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailMatchArena: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailMatchOpponent: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  detailMatchDuration: {
    color: '#A89968',
    fontSize: 12,
  },
  matchStatusSection: {
    width: '100%',
    marginBottom: 16,
  },
  matchStatusLabel: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  matchStatusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeStatus: {
    color: '#32CD32',
  },
  victoryStatus: {
    color: '#FFD700',
  },
  defeatStatus: {
    color: '#FF6347',
  },
  matchActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  forfeitButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  forfeitButtonText: {
    color: '#FF6347',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  victoryButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  victoryButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  rewardsEarnedSection: {
    width: '100%',
  },
  rewardEarnedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardEarnedText: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 8,
  },
});