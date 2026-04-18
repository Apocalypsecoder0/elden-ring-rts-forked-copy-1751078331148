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
  TextInput,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { MultiplayerMatch, PlayerCharacter, CombatResult } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample multiplayer matches
const SAMPLE_MATCHES: MultiplayerMatch[] = [
  {
    id: 'mp_match_001',
    hostId: 'player_1',
    players: [
      { id: 'player_1', name: 'Tarnished Hero', level: 25, status: 'ready' },
      { id: 'player_2', name: 'Elden Lord', level: 30, status: 'ready' },
    ],
    maxPlayers: 4,
    gameMode: 'Team Deathmatch',
    status: 'waiting',
    startTime: undefined,
    duration: 0,
    winner: undefined,
    rewards: [],
  },
  {
    id: 'mp_match_002',
    hostId: 'player_3',
    players: [
      { id: 'player_3', name: 'Dragon Slayer', level: 45, status: 'ready' },
      { id: 'player_4', name: 'Spellcaster', level: 40, status: 'ready' },
      { id: 'player_5', name: 'Berserker', level: 35, status: 'ready' },
    ],
    maxPlayers: 6,
    gameMode: 'Boss Rush',
    status: 'in_progress',
    startTime: new Date(Date.now() - 300000), // 5 minutes ago
    duration: 300,
    winner: undefined,
    rewards: [],
  },
];

// Sample available players for matchmaking
const AVAILABLE_PLAYERS = [
  { id: 'player_6', name: 'Shadow Warrior', level: 28, status: 'online' },
  { id: 'player_7', name: 'Mystic Mage', level: 32, status: 'online' },
  { id: 'player_8', name: 'Beast Hunter', level: 26, status: 'online' },
  { id: 'player_9', name: 'Paladin', level: 38, status: 'away' },
  { id: 'player_10', name: 'Assassin', level: 29, status: 'online' },
];

const GAME_MODES = ['Team Deathmatch', 'Boss Rush', 'Capture the Flag', 'Survival', 'Duel'];

export default function CombatMultiplayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeMatches, setActiveMatches] = useState<MultiplayerMatch[]>(SAMPLE_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<MultiplayerMatch | null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [showJoinMatch, setShowJoinMatch] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<string>('Team Deathmatch');
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [matchmaking, setMatchmaking] = useState(false);
  const [matchTimer, setMatchTimer] = useState<NodeJS.Timeout | null>(null);

  // Update match timers
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMatches(prev => prev.map(match => ({
        ...match,
        duration: match.status === 'in_progress' ? match.duration + 1 : match.duration,
      })));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const createMatch = () => {
    const newMatch: MultiplayerMatch = {
      id: `mp_match_${Date.now()}`,
      hostId: 'player_1',
      players: [
        { id: 'player_1', name: 'Tarnished Hero', level: 25, status: 'ready' },
      ],
      maxPlayers,
      gameMode: selectedGameMode,
      status: 'waiting',
      startTime: undefined,
      duration: 0,
      winner: undefined,
      rewards: [],
    };

    setActiveMatches(prev => [...prev, newMatch]);
    setShowCreateMatch(false);
    toast.success('Match created! Waiting for players...');
  };

  const joinMatch = (match: MultiplayerMatch) => {
    if (match.players.length >= match.maxPlayers) {
      toast.error('Match is full!');
      return;
    }

    const newPlayer = { id: 'player_1', name: 'Tarnished Hero', level: 25, status: 'ready' as const };
    const updatedMatch = {
      ...match,
      players: [...match.players, newPlayer],
    };

    setActiveMatches(prev => prev.map(m => m.id === match.id ? updatedMatch : m));
    setShowJoinMatch(false);
    toast.success('Joined match!');
  };

  const startMatch = (match: MultiplayerMatch) => {
    if (match.players.length < 2) {
      toast.error('Need at least 2 players to start!');
      return;
    }

    const updatedMatch = {
      ...match,
      status: 'in_progress',
      startTime: new Date(),
    };

    setActiveMatches(prev => prev.map(m => m.id === match.id ? updatedMatch : m));
    toast.success('Match started!');
  };

  const endMatch = (match: MultiplayerMatch, winnerId?: string) => {
    const updatedMatch: MultiplayerMatch = {
      ...match,
      status: 'completed',
      winner: winnerId,
      rewards: winnerId ? ['Runes', 'Multiplayer Points', 'Equipment'] : [],
    };

    setActiveMatches(prev => prev.map(m => m.id === match.id ? updatedMatch : m));

    if (winnerId) {
      toast.success('Match completed! Rewards earned!');
    } else {
      toast.info('Match ended');
    }
  };

  const leaveMatch = (match: MultiplayerMatch) => {
    Alert.alert(
      'Leave Match',
      'Are you sure you want to leave this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            const updatedMatch = {
              ...match,
              players: match.players.filter(p => p.id !== 'player_1'),
            };

            if (updatedMatch.players.length === 0) {
              setActiveMatches(prev => prev.filter(m => m.id !== match.id));
            } else {
              setActiveMatches(prev => prev.map(m => m.id === match.id ? updatedMatch : m));
            }

            toast.info('Left match');
          }
        }
      ]
    );
  };

  const startMatchmaking = () => {
    setMatchmaking(true);
    toast.info('Searching for match...');

    // Simulate matchmaking
    setTimeout(() => {
      setMatchmaking(false);
      const randomMatch = SAMPLE_MATCHES[Math.floor(Math.random() * SAMPLE_MATCHES.length)];
      if (randomMatch.players.length < randomMatch.maxPlayers) {
        joinMatch(randomMatch);
      } else {
        toast.error('No available matches found');
      }
    }, 3000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return '#FFD700';
      case 'in_progress': return '#32CD32';
      case 'completed': return '#666';
      default: return '#D4AF37';
    }
  };

  const renderMatchItem = ({ item }: { item: MultiplayerMatch }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={styles.matchItem}
        onPress={() => {
          setSelectedMatch(item);
          setShowMatchDetails(true);
        }}
      >
        <View style={styles.matchHeader}>
          <View style={[styles.matchIconContainer, { backgroundColor: `${statusColor}20` }]}>
            <FontAwesome5 name="users" size={20} color={statusColor} />
          </View>
          <View style={styles.matchInfo}>
            <Text style={styles.matchGameMode}>{item.gameMode}</Text>
            <Text style={styles.matchPlayers}>
              {item.players.length}/{item.maxPlayers} players
            </Text>
          </View>
          <View style={[styles.matchStatusIndicator, { backgroundColor: statusColor }]} />
        </View>

        <View style={styles.matchDetails}>
          <Text style={styles.matchHost}>Host: {item.players.find(p => p.id === item.hostId)?.name || 'Unknown'}</Text>
          <Text style={styles.matchDuration}>
            {item.status === 'in_progress' ? `Playing - ${formatDuration(item.duration)}` :
             item.status === 'waiting' ? 'Waiting for players' : 'Completed'}
          </Text>
        </View>

        {item.winner && (
          <View style={styles.matchResult}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.matchWinner}>
              Winner: {item.players.find(p => p.id === item.winner)?.name || 'Unknown'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPlayerItem = ({ item }: { item: { id: string; name: string; level: number; status: string } }) => {
    return (
      <View style={styles.playerItem}>
        <View style={styles.playerAvatar}>
          <FontAwesome5 name="user" size={16} color="#D4AF37" />
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerLevel}>Level {item.level}</Text>
        </View>
        <View style={[styles.playerStatus, { backgroundColor: item.status === 'online' ? '#32CD32' : '#FFD700' }]}>
          <Text style={styles.playerStatusText}>{item.status}</Text>
        </View>
      </View>
    );
  };

  const renderMatchDetailsModal = () => {
    if (!selectedMatch) return null;

    const statusColor = getStatusColor(selectedMatch.status);
    const isHost = selectedMatch.hostId === 'player_1';
    const isPlayer = selectedMatch.players.some(p => p.id === 'player_1');

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

            <ScrollView style={styles.matchDetailsContent}>
              <View style={styles.matchDetailHeader}>
                <View style={[styles.detailMatchIconContainer, { backgroundColor: `${statusColor}20` }]}>
                  <FontAwesome5 name="users" size={48} color={statusColor} />
                </View>
                <View style={styles.detailMatchInfo}>
                  <Text style={styles.detailMatchGameMode}>{selectedMatch.gameMode}</Text>
                  <Text style={styles.detailMatchPlayers}>
                    {selectedMatch.players.length}/{selectedMatch.maxPlayers} Players
                  </Text>
                  <Text style={styles.detailMatchStatus}>
                    Status: {selectedMatch.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.playersSection}>
                <Text style={styles.sectionTitle}>Players</Text>
                {selectedMatch.players.map((player) => (
                  <View key={player.id} style={styles.matchPlayerItem}>
                    <View style={styles.playerAvatar}>
                      <FontAwesome5 name="user" size={16} color="#D4AF37" />
                    </View>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerLevel}>Level {player.level}</Text>
                    </View>
                    <View style={[styles.playerStatus, { backgroundColor: player.status === 'ready' ? '#32CD32' : '#FFD700' }]}>
                      <Text style={styles.playerStatusText}>{player.status}</Text>
                    </View>
                    {player.id === selectedMatch.hostId && (
                      <View style={styles.hostBadge}>
                        <Ionicons name="crown" size={14} color="#FFD700" />
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {selectedMatch.status === 'in_progress' && (
                <View style={styles.matchTimerSection}>
                  <Text style={styles.sectionTitle}>Match Time</Text>
                  <Text style={styles.matchTimer}>{formatDuration(selectedMatch.duration)}</Text>
                </View>
              )}

              {selectedMatch.winner && (
                <View style={styles.winnerSection}>
                  <Text style={styles.sectionTitle}>Winner</Text>
                  <View style={styles.winnerItem}>
                    <Ionicons name="trophy" size={20} color="#FFD700" />
                    <Text style={styles.winnerName}>
                      {selectedMatch.players.find(p => p.id === selectedMatch.winner)?.name || 'Unknown'}
                    </Text>
                  </View>
                </View>
              )}

              {selectedMatch.rewards.length > 0 && (
                <View style={styles.rewardsSection}>
                  <Text style={styles.sectionTitle}>Rewards</Text>
                  {selectedMatch.rewards.map((reward, index) => (
                    <View key={index} style={styles.rewardItem}>
                      <Ionicons name="gift" size={16} color="#FFD700" />
                      <Text style={styles.rewardText}>{reward}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.matchActions}>
                {isHost && selectedMatch.status === 'waiting' && selectedMatch.players.length >= 2 && (
                  <TouchableOpacity
                    style={styles.startMatchButton}
                    onPress={() => startMatch(selectedMatch)}
                  >
                    <Text style={styles.startMatchButtonText}>Start Match</Text>
                  </TouchableOpacity>
                )}

                {isHost && selectedMatch.status === 'in_progress' && (
                  <TouchableOpacity
                    style={styles.endMatchButton}
                    onPress={() => {
                      Alert.alert(
                        'End Match',
                        'Select winner:',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          ...selectedMatch.players.map(player => ({
                            text: player.name,
                            onPress: () => endMatch(selectedMatch, player.id)
                          }))
                        ]
                      );
                    }}
                  >
                    <Text style={styles.endMatchButtonText}>End Match</Text>
                  </TouchableOpacity>
                )}

                {isPlayer && selectedMatch.status !== 'completed' && (
                  <TouchableOpacity
                    style={styles.leaveMatchButton}
                    onPress={() => leaveMatch(selectedMatch)}
                  >
                    <Text style={styles.leaveMatchButtonText}>Leave Match</Text>
                  </TouchableOpacity>
                )}

                {!isPlayer && selectedMatch.status === 'waiting' && (
                  <TouchableOpacity
                    style={styles.joinMatchButton}
                    onPress={() => joinMatch(selectedMatch)}
                  >
                    <Text style={styles.joinMatchButtonText}>Join Match</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCreateMatchModal = () => {
    return (
      <Modal
        visible={showCreateMatch}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateMatch(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createMatchContainer}>
            <View style={styles.createMatchHeader}>
              <Text style={styles.createMatchTitle}>Create Match</Text>
              <TouchableOpacity onPress={() => setShowCreateMatch(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.createMatchContent}>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Game Mode</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gameModeSelector}>
                  {GAME_MODES.map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.gameModeButton, selectedGameMode === mode && styles.selectedGameMode]}
                      onPress={() => setSelectedGameMode(mode)}
                    >
                      <Text style={[styles.gameModeText, selectedGameMode === mode && styles.selectedGameModeText]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Max Players</Text>
                <View style={styles.playerCountSelector}>
                  {[2, 4, 6, 8].map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[styles.playerCountButton, maxPlayers === count && styles.selectedPlayerCount]}
                      onPress={() => setMaxPlayers(count)}
                    >
                      <Text style={[styles.playerCountText, maxPlayers === count && styles.selectedPlayerCountText]}>
                        {count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.createButton}
                onPress={createMatch}
              >
                <Text style={styles.createButtonText}>Create Match</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderJoinMatchModal = () => {
    return (
      <Modal
        visible={showJoinMatch}
        transparent
        animationType="fade"
        onRequestClose={() => setShowJoinMatch(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.joinMatchContainer}>
            <View style={styles.joinMatchHeader}>
              <Text style={styles.joinMatchTitle}>Join Match</Text>
              <TouchableOpacity onPress={() => setShowJoinMatch(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.joinMatchContent}>
              <Text style={styles.sectionTitle}>Available Matches</Text>
              <FlatList
                data={activeMatches.filter(m => m.status === 'waiting' && m.players.length < m.maxPlayers)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.availableMatchItem}
                    onPress={() => {
                      joinMatch(item);
                      setShowJoinMatch(false);
                    }}
                  >
                    <View style={styles.availableMatchInfo}>
                      <Text style={styles.availableMatchMode}>{item.gameMode}</Text>
                      <Text style={styles.availableMatchPlayers}>
                        {item.players.length}/{item.maxPlayers} players
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#D4AF37" />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.noMatchesText}>No available matches</Text>
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20multiplayer%20combat%20arena%20with%20multiple%20players%20battling&aspect=9:16&seed=multiplayer' }}
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
          <Text style={styles.headerTitle}>MULTIPLAYER</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {activeMatches.filter(m => m.status === 'waiting').length}
            </Text>
            <Text style={styles.statLabel}>Waiting</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {activeMatches.filter(m => m.status === 'in_progress').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {AVAILABLE_PLAYERS.filter(p => p.status === 'online').length}
            </Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setShowCreateMatch(true)}
          >
            <Ionicons name="add" size={20} color="#000" />
            <Text style={styles.quickActionText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, matchmaking && styles.matchmakingButton]}
            onPress={startMatchmaking}
            disabled={matchmaking}
          >
            <Ionicons name="search" size={20} color="#000" />
            <Text style={styles.quickActionText}>
              {matchmaking ? 'Searching...' : 'Quick Match'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setShowJoinMatch(true)}
          >
            <Ionicons name="enter" size={20} color="#000" />
            <Text style={styles.quickActionText}>Join</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.matchesContainer}>
          <Text style={styles.sectionTitle}>Active Matches</Text>
          <FlatList
            data={activeMatches}
            renderItem={renderMatchItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.matchesList}
          />
        </View>

        <View style={styles.onlinePlayersContainer}>
          <Text style={styles.sectionTitle}>Online Players ({AVAILABLE_PLAYERS.filter(p => p.status === 'online').length})</Text>
          <FlatList
            data={AVAILABLE_PLAYERS.filter(p => p.status === 'online').slice(0, 5)}
            renderItem={renderPlayerItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.onlinePlayersList}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('CombatArena')}
          >
            <FontAwesome5 name="shield-alt" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Arena</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="trophy" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Rankings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="chatbubbles" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderMatchDetailsModal()}
      {renderCreateMatchModal()}
      {renderJoinMatchModal()}
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickActionButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  matchmakingButton: {
    backgroundColor: '#FFD700',
  },
  quickActionText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  matchesContainer: {
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
  matchesList: {
    paddingBottom: 20,
  },
  matchItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchGameMode: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  matchPlayers: {
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
  matchHost: {
    color: '#A89968',
    fontSize: 12,
  },
  matchDuration: {
    color: '#A89968',
    fontSize: 12,
  },
  matchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  matchWinner: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 4,
  },
  onlinePlayersContainer: {
    marginBottom: 16,
  },
  onlinePlayersList: {
    paddingRight: 16,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  playerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
  },
  playerLevel: {
    color: '#A89968',
    fontSize: 10,
  },
  playerStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playerStatusText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
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
  matchDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
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
    flex: 1,
  },
  matchDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailMatchIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailMatchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailMatchGameMode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailMatchPlayers: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  detailMatchStatus: {
    color: '#A89968',
    fontSize: 12,
  },
  playersSection: {
    marginBottom: 16,
  },
  matchPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  hostBadge: {
    marginLeft: 8,
  },
  matchTimerSection: {
    marginBottom: 16,
  },
  matchTimer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  winnerSection: {
    marginBottom: 16,
  },
  winnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
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
  matchActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  startMatchButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  startMatchButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  endMatchButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  endMatchButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  leaveMatchButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  leaveMatchButtonText: {
    color: '#FF6347',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  joinMatchButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  joinMatchButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  createMatchContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  createMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  createMatchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  createMatchContent: {
    flex: 1,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  gameModeSelector: {
    marginBottom: 8,
  },
  gameModeButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedGameMode: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  gameModeText: {
    color: '#A89968',
    fontSize: 14,
  },
  selectedGameModeText: {
    color: '#000',
    fontWeight: '600',
  },
  playerCountSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  playerCountButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedPlayerCount: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  playerCountText: {
    color: '#A89968',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedPlayerCountText: {
    color: '#000',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  joinMatchContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '60%',
    padding: 16,
  },
  joinMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  joinMatchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  joinMatchContent: {
    flex: 1,
  },
  availableMatchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  availableMatchInfo: {
    flex: 1,
  },
  availableMatchMode: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  availableMatchPlayers: {
    color: '#A89968',
    fontSize: 12,
  },
  noMatchesText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});