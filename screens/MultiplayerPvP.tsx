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

// Sample PvP invasions data
const PVP_INVASIONS = [
  {
    id: 'invasion-stormveil',
    name: 'Stormveil Castle Invasion',
    invader: 'BloodyWolf',
    level: 35,
    region: 'Limgrave',
    location: 'Stormveil Castle',
    reward: '5000 Runes',
    timeLimit: '10 minutes',
    status: 'Active',
    description: 'A ruthless invader has entered Stormveil Castle seeking to claim your Great Rune.',
    strategy: 'Defensive position recommended. Use the castle walls and towers to your advantage.'
  },
  {
    id: 'invasion-liurnia',
    name: 'Liurnia Lakes Ambush',
    invader: 'CrystalWitch',
    level: 42,
    region: 'Liurnia of the Lakes',
    location: 'Academy Gate Town',
    reward: 'Glintstone Key',
    timeLimit: '15 minutes',
    status: 'Imminent',
    description: 'A magical practitioner lurks in the ruins, waiting to strike at unsuspecting Tarnished.',
    strategy: 'Beware of magical traps and illusions. Keep distance from spellcasters.'
  },
  {
    id: 'invasion-caelid',
    name: 'Caelid Wasteland Duel',
    invader: 'RotKnight',
    level: 55,
    region: 'Caelid',
    location: 'Redmane Castle',
    reward: 'Rotten Duelist Set',
    timeLimit: '20 minutes',
    status: 'Active',
    description: 'A champion of the rot seeks to test their strength against worthy opponents.',
    strategy: 'Rot buildup is dangerous. Use fire or bleed weapons to counter.'
  }
];

const PVP_RANKINGS = [
  { rank: 1, name: 'EldenLord', level: 120, wins: 1250, winRate: 87.5, title: 'Elden Champion' },
  { rank: 2, name: 'MoonlightAssassin', level: 115, wins: 1180, winRate: 84.2, title: 'Shadow Master' },
  { rank: 3, name: 'FireGiant', level: 118, wins: 1120, winRate: 82.1, title: 'Flame Lord' },
  { rank: 4, name: 'CrystalSage', level: 110, wins: 1050, winRate: 79.8, title: 'Arcane Master' },
  { rank: 5, name: 'ScarletHunter', level: 108, wins: 980, winRate: 76.5, title: 'Blood Champion' }
];

const PVP_MODES = [
  { id: 'duel', name: 'Duel', description: '1v1 combat in designated arenas', players: '2', reward: 'Runes & Fame' },
  { id: 'invasion', name: 'Invasion', description: 'Invade other players\' worlds', players: '1 Invader', reward: 'Runes & Items' },
  { id: 'siege', name: 'Siege', description: 'Team-based castle sieges', players: '4v4', reward: 'Territory & Titles' },
  { id: 'tournament', name: 'Tournament', description: 'Competitive bracket matches', players: '16-64', reward: 'Championship & Glory' }
];

const MultiplayerPvP: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedInvasion, setSelectedInvasion] = useState<typeof PVP_INVASIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'invasions' | 'rankings' | 'modes'>('invasions');

  const handleInvasionPress = (invasion: typeof PVP_INVASIONS[0]) => {
    setSelectedInvasion(invasion);
    setModalVisible(true);
  };

  const handleAcceptInvasion = () => {
    if (selectedInvasion) {
      toast.success(`Accepting invasion from ${selectedInvasion.invader}!`);
      setModalVisible(false);
    }
  };

  const handleDeclineInvasion = () => {
    if (selectedInvasion) {
      toast.warning(`Declined invasion from ${selectedInvasion.invader}`);
      setModalVisible(false);
    }
  };

  const handleJoinMode = (mode: typeof PVP_MODES[0]) => {
    toast.success(`Joining ${mode.name}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#F44336';
      case 'Imminent': return '#FF9800';
      case 'Defeated': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const renderInvasionItem = ({ item }: { item: typeof PVP_INVASIONS[0] }) => (
    <TouchableOpacity
      style={styles.invasionCard}
      onPress={() => handleInvasionPress(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.invasionCardGradient}
      >
        <View style={styles.invasionHeader}>
          <View style={styles.invasionIconContainer}>
            <Ionicons name="skull" size={24} color="#F44336" />
          </View>
          <View style={styles.invasionInfo}>
            <Text style={styles.invasionName}>{item.name}</Text>
            <Text style={styles.invaderName}>Invader: {item.invader} (Lv.{item.level})</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.invasionDetails}>
          <Text style={styles.locationText}>
            <Ionicons name="location" size={14} color="#FFD700" />
            {' '}{item.location}, {item.region}
          </Text>
          <Text style={styles.rewardText}>
            <Ionicons name="trophy" size={14} color="#FFD700" />
            {' '}{item.reward}
          </Text>
        </View>

        <Text style={styles.invasionDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.invasionFooter}>
          <Text style={styles.timeLimit}>
            <Ionicons name="time-outline" size={14} color="#FFD700" />
            {' '}{item.timeLimit}
          </Text>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptInvasion()}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRankingItem = ({ item }: { item: typeof PVP_RANKINGS[0] }) => (
    <View style={styles.rankingCard}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.rankingGradient}
      >
        <View style={styles.rankContainer}>
          <Text style={styles.rankNumber}>#{item.rank}</Text>
        </View>
        <View style={styles.rankingInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerTitle}>{item.title}</Text>
          <Text style={styles.playerStats}>
            Level {item.level} • {item.wins} wins • {item.winRate}% win rate
          </Text>
        </View>
        <View style={styles.rankBadge}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
        </View>
      </LinearGradient>
    </View>
  );

  const renderModeItem = ({ item }: { item: typeof PVP_MODES[0] }) => (
    <TouchableOpacity
      style={styles.modeCard}
      onPress={() => handleJoinMode(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.modeGradient}
      >
        <View style={styles.modeHeader}>
          <Text style={styles.modeName}>{item.name}</Text>
          <Text style={styles.modePlayers}>{item.players}</Text>
        </View>
        <Text style={styles.modeDescription}>{item.description}</Text>
        <View style={styles.modeFooter}>
          <Text style={styles.modeReward}>{item.reward}</Text>
          <TouchableOpacity
            style={styles.joinModeButton}
            onPress={() => handleJoinMode(item)}
          >
            <Text style={styles.joinModeButtonText}>Join</Text>
          </TouchableOpacity>
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
          <Text style={styles.title}>PVP INVASIONS</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'invasions' && styles.activeTab]}
            onPress={() => setActiveTab('invasions')}
          >
            <Text style={[styles.tabText, activeTab === 'invasions' && styles.activeTabText]}>
              Invasions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rankings' && styles.activeTab]}
            onPress={() => setActiveTab('rankings')}
          >
            <Text style={[styles.tabText, activeTab === 'rankings' && styles.activeTabText]}>
              Rankings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'modes' && styles.activeTab]}
            onPress={() => setActiveTab('modes')}
          >
            <Text style={[styles.tabText, activeTab === 'modes' && styles.activeTabText]}>
              Modes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'invasions' && (
          <FlatList
            data={PVP_INVASIONS}
            renderItem={renderInvasionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.invasionsList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'rankings' && (
          <FlatList
            data={PVP_RANKINGS}
            renderItem={renderRankingItem}
            keyExtractor={(item) => item.rank.toString()}
            contentContainerStyle={styles.rankingsList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'modes' && (
          <FlatList
            data={PVP_MODES}
            renderItem={renderModeItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modesList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Invasion Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedInvasion && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedInvasion.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.invasionDetailSection}>
                      <Text style={styles.sectionTitle}>Invader Details</Text>
                      <Text style={styles.invasionDetailText}>
                        <Text style={styles.detailLabel}>Name:</Text> {selectedInvasion.invader}
                      </Text>
                      <Text style={styles.invasionDetailText}>
                        <Text style={styles.detailLabel}>Level:</Text> {selectedInvasion.level}
                      </Text>
                      <Text style={styles.invasionDetailText}>
                        <Text style={styles.detailLabel}>Location:</Text> {selectedInvasion.location}, {selectedInvasion.region}
                      </Text>
                      <Text style={styles.invasionDetailText}>
                        <Text style={styles.detailLabel}>Time Limit:</Text> {selectedInvasion.timeLimit}
                      </Text>
                      <Text style={styles.invasionDetailText}>
                        <Text style={styles.detailLabel}>Reward:</Text> {selectedInvasion.reward}
                      </Text>
                    </View>

                    <View style={styles.invasionDetailSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.invasionDescriptionText}>
                        {selectedInvasion.description}
                      </Text>
                    </View>

                    <View style={styles.invasionDetailSection}>
                      <Text style={styles.sectionTitle}>Strategic Advice</Text>
                      <Text style={styles.strategyText}>
                        {selectedInvasion.strategy}
                      </Text>
                    </View>

                    <View style={styles.invasionDetailSection}>
                      <Text style={styles.sectionTitle}>Combat Tips</Text>
                      <Text style={styles.tipsText}>
                        • Prepare your strongest equipment{'\n'}
                        • Use the environment to your advantage{'\n'}
                        • Coordinate with summoned spirits{'\n'}
                        • Manage stamina and healing items wisely
                      </Text>
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={handleDeclineInvasion}
                    >
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptModalButton}
                      onPress={handleAcceptInvasion}
                    >
                      <Text style={styles.acceptModalButtonText}>Accept Challenge</Text>
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
  settingsButton: {
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CCCCCC',
  },
  activeTabText: {
    color: '#1A1A2E',
  },
  invasionsList: {
    padding: 20,
    paddingBottom: 100,
  },
  invasionCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  invasionCardGradient: {
    padding: 15,
  },
  invasionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  invasionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  invasionInfo: {
    flex: 1,
  },
  invasionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  invaderName: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: 'bold',
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
  invasionDetails: {
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 5,
  },
  rewardText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  invasionDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 15,
  },
  invasionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLimit: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rankingsList: {
    padding: 20,
    paddingBottom: 100,
  },
  rankingCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  rankingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  rankingInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  playerTitle: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 2,
  },
  playerStats: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  rankBadge: {
    padding: 8,
  },
  modesList: {
    padding: 20,
    paddingBottom: 100,
  },
  modeCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modeGradient: {
    padding: 15,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modePlayers: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  modeDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 15,
  },
  modeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeReward: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    flex: 1,
  },
  joinModeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  joinModeButtonText: {
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
  invasionDetailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  invasionDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  invasionDescriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  strategyText: {
    fontSize: 14,
    color: '#FF9800',
    lineHeight: 20,
  },
  tipsText: {
    fontSize: 14,
    color: '#2196F3',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  declineButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  acceptModalButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  acceptModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default MultiplayerPvP;