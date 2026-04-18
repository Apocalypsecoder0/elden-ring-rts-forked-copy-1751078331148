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
import { Quest, QuestObjective, QuestReward, QuestType } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample quest data
const SAMPLE_QUESTS: Quest[] = [
  {
    id: 'quest_001',
    title: 'The Journey Begins',
    description: 'Your adventure starts in the Lands Between. Speak to the old merchant in the Church of Elleh.',
    type: 'main',
    status: 'active',
    level: 1,
    objectives: [
      {
        id: 'obj_001',
        description: 'Speak to the old merchant',
        type: 'talk',
        target: 'Old Merchant',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'obj_002',
        description: 'Obtain the Whetstone Knife',
        type: 'collect',
        target: 'Whetstone Knife',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      { type: 'experience', amount: 500 },
      { type: 'item', itemId: 'whetstone_knife', name: 'Whetstone Knife' },
      { type: 'rune', amount: 1000 },
    ],
    giver: 'Old Merchant',
    location: 'Church of Elleh',
    prerequisites: [],
    followUp: 'quest_002',
  },
  {
    id: 'quest_002',
    title: 'Castle on the Hill',
    description: 'Stormveil Castle looms in the distance. Make your way there and confront the lord of the castle.',
    type: 'main',
    status: 'locked',
    level: 15,
    objectives: [
      {
        id: 'obj_003',
        description: 'Reach Stormveil Castle',
        type: 'location',
        target: 'Stormveil Castle',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'obj_004',
        description: 'Defeat Margit, the Fell Omen',
        type: 'defeat',
        target: 'Margit, the Fell Omen',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      { type: 'experience', amount: 2000 },
      { type: 'rune', amount: 5000 },
      { type: 'item', itemId: 'margits_shard', name: 'Margit\'s Shard' },
    ],
    giver: 'Gideon Ofnir',
    location: 'Roundtable Hold',
    prerequisites: ['quest_001'],
    followUp: 'quest_003',
  },
  {
    id: 'quest_003',
    title: 'The Erdtree',
    description: 'The Erdtree stands tall, its branches reaching for the heavens. Ascend to the top and claim your destiny.',
    type: 'main',
    status: 'locked',
    level: 50,
    objectives: [
      {
        id: 'obj_005',
        description: 'Reach the Erdtree',
        type: 'location',
        target: 'Erdtree',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'obj_006',
        description: 'Defeat Maliketh, the Black Blade',
        type: 'defeat',
        target: 'Maliketh, the Black Blade',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      { type: 'experience', amount: 10000 },
      { type: 'rune', amount: 20000 },
      { type: 'item', itemId: 'elden_lord', name: 'Elden Lord' },
    ],
    giver: 'Queen Marika',
    location: 'Erdtree',
    prerequisites: ['quest_002'],
    followUp: null,
  },
  {
    id: 'quest_004',
    title: 'Lost in the Woods',
    description: 'A merchant has lost his way in the woods near the Church of Elleh. Help him find his way back.',
    type: 'side',
    status: 'available',
    level: 3,
    objectives: [
      {
        id: 'obj_007',
        description: 'Find the lost merchant',
        type: 'location',
        target: 'Limgrave Woods',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'obj_008',
        description: 'Escort merchant back to safety',
        type: 'escort',
        target: 'Lost Merchant',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      { type: 'experience', amount: 300 },
      { type: 'rune', amount: 800 },
      { type: 'item', itemId: 'merchants_map', name: 'Merchant\'s Map' },
    ],
    giver: 'Church Priest',
    location: 'Church of Elleh',
    prerequisites: [],
    followUp: null,
  },
  {
    id: 'quest_005',
    title: 'Bandit Problems',
    description: 'Bandits have been terrorizing the roads near the village. Clear them out and bring peace to the area.',
    type: 'side',
    status: 'available',
    level: 8,
    objectives: [
      {
        id: 'obj_009',
        description: 'Defeat bandit leader',
        type: 'defeat',
        target: 'Bandit Leader',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'obj_010',
        description: 'Clear bandit camp',
        type: 'clear',
        target: 'Bandit Camp',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      { type: 'experience', amount: 800 },
      { type: 'rune', amount: 1500 },
      { type: 'item', itemId: 'bandit_treasure', name: 'Bandit Treasure' },
    ],
    giver: 'Village Elder',
    location: 'Village Outskirts',
    prerequisites: [],
    followUp: null,
  },
];

export default function QuestLogScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [quests, setQuests] = useState<Quest[]>(SAMPLE_QUESTS);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestDetails, setShowQuestDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<QuestType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [playerLevel] = useState(25);

  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.giver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || quest.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || quest.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const acceptQuest = (quest: Quest) => {
    if (quest.level > playerLevel + 5) {
      toast.error('Your level is too low for this quest!');
      return;
    }

    if (quest.prerequisites.length > 0) {
      const hasPrerequisites = quest.prerequisites.every(prereqId =>
        quests.find(q => q.id === prereqId)?.status === 'completed'
      );
      if (!hasPrerequisites) {
        toast.error('You must complete prerequisite quests first!');
        return;
      }
    }

    setQuests(prev => prev.map(q =>
      q.id === quest.id ? { ...q, status: 'active' } : q
    ));
    toast.success(`Accepted quest: ${quest.title}`);
  };

  const abandonQuest = (quest: Quest) => {
    Alert.alert(
      'Abandon Quest',
      `Are you sure you want to abandon "${quest.title}"? You will lose all progress.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: () => {
            setQuests(prev => prev.map(q =>
              q.id === quest.id ? { ...q, status: 'available' } : q
            ));
            toast.success(`Abandoned quest: ${quest.title}`);
          }
        }
      ]
    );
  };

  const completeQuest = (quest: Quest) => {
    const allObjectivesComplete = quest.objectives.every(obj => obj.completed);
    if (!allObjectivesComplete) {
      toast.error('Complete all objectives first!');
      return;
    }

    setQuests(prev => prev.map(q =>
      q.id === quest.id ? { ...q, status: 'completed' } : q
    ));

    // Unlock follow-up quest if exists
    if (quest.followUp) {
      setQuests(prev => prev.map(q =>
        q.id === quest.followUp ? { ...q, status: 'available' } : q
      ));
    }

    toast.success(`Completed quest: ${quest.title}!`);
  };

  const renderQuestItem = ({ item }: { item: Quest }) => {
    const canAccept = item.status === 'available' && item.level <= playerLevel + 5;
    const canComplete = item.status === 'active' && item.objectives.every(obj => obj.completed);
    const progressPercent = item.objectives.length > 0 ?
      (item.objectives.filter(obj => obj.completed).length / item.objectives.length) * 100 : 0;

    return (
      <TouchableOpacity
        style={styles.questItem}
        onPress={() => {
          setSelectedQuest(item);
          setShowQuestDetails(true);
        }}
      >
        <View style={styles.questHeader}>
          <View style={styles.questIcon}>
            <FontAwesome5
              name={getQuestIcon(item.type)}
              size={20}
              color={getQuestColor(item.type)}
            />
          </View>
          <View style={styles.questInfo}>
            <Text style={styles.questTitle}>{item.title}</Text>
            <Text style={styles.questGiver}>From: {item.giver}</Text>
          </View>
          <View style={styles.questStatus}>
            {item.status === 'locked' && (
              <View style={styles.lockedBadge}>
                <Ionicons name="lock-closed" size={16} color="#FF6347" />
              </View>
            )}
            {item.status === 'completed' && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#32CD32" />
              </View>
            )}
            {item.status === 'active' && (
              <View style={styles.activeBadge}>
                <Ionicons name="play" size={16} color="#FFD700" />
              </View>
            )}
          </View>
        </View>

        <Text style={styles.questDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.questMeta}>
          <Text style={styles.questLevel}>Lv.{item.level}</Text>
          <Text style={[styles.questType, { color: getQuestColor(item.type) }]}>
            {item.type.toUpperCase()}
          </Text>
          <Text style={styles.questLocation}>{item.location}</Text>
        </View>

        {item.status === 'active' && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {item.objectives.filter(obj => obj.completed).length}/{item.objectives.length} objectives
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        )}

        <View style={styles.questActions}>
          {canAccept && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptQuest(item)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}

          {item.status === 'active' && (
            <TouchableOpacity
              style={styles.abandonButton}
              onPress={() => abandonQuest(item)}
            >
              <Text style={styles.abandonButtonText}>Abandon</Text>
            </TouchableOpacity>
          )}

          {canComplete && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => completeQuest(item)}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getQuestIcon = (type: QuestType) => {
    switch (type) {
      case 'main': return 'crown';
      case 'side': return 'map-marker-alt';
      case 'dungeon': return 'dungeon';
      case 'world': return 'globe';
      default: return 'question';
    }
  };

  const getQuestColor = (type: QuestType) => {
    switch (type) {
      case 'main': return '#FFD700';
      case 'side': return '#32CD32';
      case 'dungeon': return '#FF6347';
      case 'world': return '#4169E1';
      default: return '#A89968';
    }
  };

  const renderQuestDetailsModal = () => {
    if (!selectedQuest) return null;

    const canAccept = selectedQuest.status === 'available' && selectedQuest.level <= playerLevel + 5;
    const canComplete = selectedQuest.status === 'active' && selectedQuest.objectives.every(obj => obj.completed);

    return (
      <Modal
        visible={showQuestDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuestDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.questDetailsContainer}>
            <View style={styles.questDetailsHeader}>
              <Text style={styles.questDetailsTitle}>Quest Details</Text>
              <TouchableOpacity onPress={() => setShowQuestDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.questDetailsContent}>
              <View style={styles.questDetailHeader}>
                <View style={[styles.detailQuestIcon, { backgroundColor: getQuestColor(selectedQuest.type) }]}>
                  <FontAwesome5
                    name={getQuestIcon(selectedQuest.type)}
                    size={32}
                    color="#000"
                  />
                </View>
                <View style={styles.detailQuestInfo}>
                  <Text style={styles.detailQuestTitle}>{selectedQuest.title}</Text>
                  <Text style={styles.detailQuestGiver}>Given by: {selectedQuest.giver}</Text>
                  <Text style={styles.detailQuestLocation}>Location: {selectedQuest.location}</Text>
                </View>
              </View>

              <Text style={styles.questDetailDescription}>{selectedQuest.description}</Text>

              <View style={styles.questStatsSection}>
                <View style={styles.questStatItem}>
                  <Ionicons name="trending-up" size={16} color="#A89968" />
                  <Text style={styles.questStatText}>Level {selectedQuest.level}</Text>
                </View>
                <View style={styles.questStatItem}>
                  <FontAwesome5 name="tag" size={16} color="#A89968" />
                  <Text style={styles.questStatText}>{selectedQuest.type.toUpperCase()}</Text>
                </View>
                <View style={styles.questStatItem}>
                  <Ionicons name="flag" size={16} color="#A89968" />
                  <Text style={styles.questStatText}>
                    {selectedQuest.status.charAt(0).toUpperCase() + selectedQuest.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.objectivesSection}>
                <Text style={styles.sectionTitle}>Objectives</Text>
                {selectedQuest.objectives.map((objective, index) => (
                  <View key={objective.id} style={styles.objectiveItem}>
                    <View style={styles.objectiveStatus}>
                      {objective.completed ? (
                        <Ionicons name="checkmark-circle" size={20} color="#32CD32" />
                      ) : (
                        <Ionicons name="ellipse-outline" size={20} color="#A89968" />
                      )}
                    </View>
                    <View style={styles.objectiveInfo}>
                      <Text style={[styles.objectiveText, objective.completed && styles.completedObjective]}>
                        {objective.description}
                      </Text>
                      <Text style={styles.objectiveProgress}>
                        {objective.current}/{objective.required} {objective.target}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {selectedQuest.prerequisites.length > 0 && (
                <View style={styles.prerequisitesSection}>
                  <Text style={styles.sectionTitle}>Prerequisites</Text>
                  {selectedQuest.prerequisites.map((prereqId, index) => {
                    const prereqQuest = quests.find(q => q.id === prereqId);
                    return (
                      <View key={index} style={styles.prerequisiteItem}>
                        <Ionicons name="arrow-forward" size={16} color="#A89968" />
                        <Text style={styles.prerequisiteText}>
                          {prereqQuest?.title || 'Unknown Quest'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              <View style={styles.rewardsSection}>
                <Text style={styles.sectionTitle}>Rewards</Text>
                {selectedQuest.rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Ionicons name="gift" size={16} color="#FFD700" />
                    <Text style={styles.rewardText}>
                      {reward.type === 'experience' && `${reward.amount} XP`}
                      {reward.type === 'rune' && `${reward.amount} Runes`}
                      {reward.type === 'item' && reward.name}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.detailActions}>
                {canAccept && (
                  <TouchableOpacity
                    style={styles.detailAcceptButton}
                    onPress={() => {
                      acceptQuest(selectedQuest);
                      setShowQuestDetails(false);
                    }}
                  >
                    <Text style={styles.detailAcceptButtonText}>Accept Quest</Text>
                  </TouchableOpacity>
                )}

                {selectedQuest.status === 'active' && (
                  <TouchableOpacity
                    style={styles.detailAbandonButton}
                    onPress={() => {
                      abandonQuest(selectedQuest);
                      setShowQuestDetails(false);
                    }}
                  >
                    <Text style={styles.detailAbandonButtonText}>Abandon Quest</Text>
                  </TouchableOpacity>
                )}

                {canComplete && (
                  <TouchableOpacity
                    style={styles.detailCompleteButton}
                    onPress={() => {
                      completeQuest(selectedQuest);
                      setShowQuestDetails(false);
                    }}
                  >
                    <Text style={styles.detailCompleteButtonText}>Complete Quest</Text>
                  </TouchableOpacity>
                )}

                {selectedQuest.status === 'locked' && (
                  <View style={styles.lockedMessage}>
                    <Ionicons name="lock-closed" size={24} color="#FF6347" />
                    <Text style={styles.lockedMessageText}>Quest Locked</Text>
                    <Text style={styles.lockedMessageSubtext}>
                      Complete prerequisites to unlock
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Ancient%20quest%20log%20with%20golden%20pages%20and%20mystical%20runes&aspect=9:16&seed=quest' }}
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
          <Text style={styles.headerTitle}>QUEST LOG</Text>
          <View style={styles.headerStats}>
            <Text style={styles.playerLevel}>Lv.{playerLevel}</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#A89968" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search quests..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.filters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilter}>
            {['all', 'main', 'side', 'dungeon', 'world'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.filterButton, selectedType === type && styles.selectedFilter]}
                onPress={() => setSelectedType(type as QuestType | 'all')}
              >
                <Text style={[styles.filterText, selectedType === type && styles.selectedFilterText]}>
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilter}>
            {['all', 'available', 'active', 'completed', 'locked'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.filterButton, selectedStatus === status && styles.selectedFilter]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[styles.filterText, selectedStatus === status && styles.selectedFilterText]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.questsContainer}>
          <Text style={styles.sectionTitle}>Quests ({filteredQuests.length})</Text>
          <FlatList
            data={filteredQuests}
            renderItem={renderQuestItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.questsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="scroll" size={48} color="#666" />
                <Text style={styles.emptyText}>No quests found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('QuestTracker')}
          >
            <Ionicons name="location" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="map" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>World Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="settings" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderQuestDetailsModal()}
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
  headerStats: {
    alignItems: 'center',
  },
  playerLevel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  searchInput: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 16,
    marginLeft: 8,
  },
  filters: {
    marginBottom: 16,
  },
  typeFilter: {
    marginBottom: 8,
  },
  statusFilter: {
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedFilter: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filterText: {
    color: '#A89968',
    fontSize: 12,
  },
  selectedFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  questsContainer: {
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
  questsList: {
    paddingBottom: 20,
  },
  questItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  questGiver: {
    color: '#A89968',
    fontSize: 12,
  },
  questStatus: {
    marginLeft: 8,
  },
  lockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(50, 205, 50, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  questMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  questType: {
    fontSize: 12,
    fontWeight: '600',
  },
  questLocation: {
    color: '#A89968',
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#32CD32',
  },
  questActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 8,
    marginLeft: 8,
  },
  acceptButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  abandonButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 8,
    marginLeft: 8,
  },
  abandonButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    padding: 8,
    marginLeft: 8,
  },
  completeButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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
  questDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  questDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  questDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  questDetailsContent: {
    flex: 1,
  },
  questDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailQuestIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailQuestInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailQuestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailQuestGiver: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 2,
  },
  detailQuestLocation: {
    color: '#A89968',
    fontSize: 14,
  },
  questDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  questStatsSection: {
    marginBottom: 16,
  },
  questStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  questStatText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  objectivesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 12,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  objectiveStatus: {
    marginRight: 12,
    marginTop: 2,
  },
  objectiveInfo: {
    flex: 1,
  },
  objectiveText: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
  },
  completedObjective: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  objectiveProgress: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 2,
  },
  prerequisitesSection: {
    marginBottom: 16,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  prerequisiteText: {
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
  detailActions: {
    marginTop: 20,
  },
  detailAcceptButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  detailAcceptButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailAbandonButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  detailAbandonButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailCompleteButton: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  detailCompleteButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lockedMessage: {
    alignItems: 'center',
    padding: 20,
  },
  lockedMessageText: {
    color: '#FF6347',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  lockedMessageSubtext: {
    color: '#A89968',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});