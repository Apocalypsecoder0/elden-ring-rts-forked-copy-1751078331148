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
import { Quest, QuestObjective } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample active quests for tracking
const SAMPLE_ACTIVE_QUESTS: Quest[] = [
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
    id: 'quest_004',
    title: 'Lost in the Woods',
    description: 'A merchant has lost his way in the woods near the Church of Elleh. Help him find his way back.',
    type: 'side',
    status: 'active',
    level: 3,
    objectives: [
      {
        id: 'obj_007',
        description: 'Find the lost merchant',
        type: 'location',
        target: 'Limgrave Woods',
        current: 0,
        required: 1,
        completed: true,
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
    status: 'active',
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
        current: 2,
        required: 5,
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

export default function QuestTrackerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeQuests, setActiveQuests] = useState<Quest[]>(SAMPLE_ACTIVE_QUESTS);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestDetails, setShowQuestDetails] = useState(false);
  const [showMapMarkers, setShowMapMarkers] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [sortBy, setSortBy] = useState<'progress' | 'level' | 'type'>('progress');
  const [playerLocation] = useState('Limgrave Woods');

  const sortedQuests = [...activeQuests].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        const aProgress = a.objectives.filter(obj => obj.completed).length / a.objectives.length;
        const bProgress = b.objectives.filter(obj => obj.completed).length / b.objectives.length;
        return bProgress - aProgress;
      case 'level':
        return a.level - b.level;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const updateObjective = (questId: string, objectiveId: string, increment: number = 1) => {
    setActiveQuests(prev => prev.map(quest => {
      if (quest.id !== questId) return quest;

      const updatedObjectives = quest.objectives.map(obj => {
        if (obj.id !== objectiveId) return obj;

        const newCurrent = Math.min(obj.current + increment, obj.required);
        const completed = newCurrent >= obj.required;

        return { ...obj, current: newCurrent, completed };
      });

      return { ...quest, objectives: updatedObjectives };
    }));

    toast.success('Objective updated!');
  };

  const completeQuest = (quest: Quest) => {
    const allObjectivesComplete = quest.objectives.every(obj => obj.completed);
    if (!allObjectivesComplete) {
      toast.error('Complete all objectives first!');
      return;
    }

    setActiveQuests(prev => prev.filter(q => q.id !== quest.id));
    toast.success(`Completed quest: ${quest.title}!`);
  };

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'main': return 'crown';
      case 'side': return 'map-marker-alt';
      case 'dungeon': return 'dungeon';
      case 'world': return 'globe';
      default: return 'question';
    }
  };

  const getQuestColor = (type: string) => {
    switch (type) {
      case 'main': return '#FFD700';
      case 'side': return '#32CD32';
      case 'dungeon': return '#FF6347';
      case 'world': return '#4169E1';
      default: return '#A89968';
    }
  };

  const getObjectiveIcon = (type: string) => {
    switch (type) {
      case 'talk': return 'chatbubble';
      case 'collect': return 'bag';
      case 'defeat': return 'skull';
      case 'location': return 'location';
      case 'escort': return 'people';
      case 'clear': return 'trash';
      default: return 'ellipse';
    }
  };

  const renderQuestItem = ({ item }: { item: Quest }) => {
    const progressPercent = (item.objectives.filter(obj => obj.completed).length / item.objectives.length) * 100;
    const nextObjective = item.objectives.find(obj => !obj.completed);
    const isNearLocation = item.location === playerLocation;

    return (
      <TouchableOpacity
        style={[styles.questItem, isNearLocation && styles.nearbyQuest]}
        onPress={() => {
          setSelectedQuest(item);
          setShowQuestDetails(true);
        }}
      >
        <View style={styles.questHeader}>
          <View style={[styles.questIcon, { backgroundColor: getQuestColor(item.type) }]}>
            <FontAwesome5
              name={getQuestIcon(item.type)}
              size={16}
              color="#000"
            />
          </View>
          <View style={styles.questInfo}>
            <Text style={styles.questTitle}>{item.title}</Text>
            <Text style={styles.questLocation}>{item.location}</Text>
          </View>
          <View style={styles.questProgress}>
            <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
          </View>
        </View>

        {nextObjective && (
          <View style={styles.nextObjective}>
            <Ionicons
              name={getObjectiveIcon(nextObjective.type)}
              size={16}
              color="#FFD700"
            />
            <Text style={styles.nextObjectiveText} numberOfLines={1}>
              {nextObjective.description}
            </Text>
            <Text style={styles.objectiveProgress}>
              {nextObjective.current}/{nextObjective.required}
            </Text>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {item.objectives.filter(obj => obj.completed).length}/{item.objectives.length} objectives
          </Text>
        </View>

        {isNearLocation && (
          <View style={styles.locationIndicator}>
            <Ionicons name="location" size={16} color="#FFD700" />
            <Text style={styles.locationText}>You are here</Text>
          </View>
        )}

        <View style={styles.quickActions}>
          {nextObjective && (
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => updateObjective(item.id, nextObjective.id)}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          )}

          {item.objectives.every(obj => obj.completed) && (
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

  const renderQuestDetailsModal = () => {
    if (!selectedQuest) return null;

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
              <Text style={styles.questDetailsTitle}>Quest Tracker</Text>
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
                  <Text style={styles.detailQuestLocation}>📍 {selectedQuest.location}</Text>
                  <Text style={styles.detailQuestGiver}>Given by: {selectedQuest.giver}</Text>
                </View>
              </View>

              <Text style={styles.questDetailDescription}>{selectedQuest.description}</Text>

              <View style={styles.objectivesSection}>
                <Text style={styles.sectionTitle}>Objectives</Text>
                {selectedQuest.objectives.map((objective, index) => (
                  <View key={objective.id} style={styles.objectiveItem}>
                    <View style={styles.objectiveStatus}>
                      {objective.completed ? (
                        <Ionicons name="checkmark-circle" size={24} color="#32CD32" />
                      ) : (
                        <TouchableOpacity
                          onPress={() => updateObjective(selectedQuest.id, objective.id)}
                        >
                          <Ionicons name="ellipse-outline" size={24} color="#FFD700" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.objectiveInfo}>
                      <Text style={[styles.objectiveText, objective.completed && styles.completedObjective]}>
                        {objective.description}
                      </Text>
                      <Text style={styles.objectiveTarget}>
                        Target: {objective.target}
                      </Text>
                      <Text style={styles.objectiveProgress}>
                        Progress: {objective.current}/{objective.required}
                      </Text>
                    </View>
                    {!objective.completed && (
                      <View style={styles.objectiveActions}>
                        <TouchableOpacity
                          style={styles.incrementButton}
                          onPress={() => updateObjective(selectedQuest.id, objective.id, 1)}
                        >
                          <Ionicons name="add" size={16} color="#D4AF37" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>

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
                {selectedQuest.objectives.every(obj => obj.completed) && (
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

                <TouchableOpacity
                  style={styles.detailViewLogButton}
                  onPress={() => {
                    setShowQuestDetails(false);
                    navigation.navigate('QuestLog');
                  }}
                >
                  <Text style={styles.detailViewLogButtonText}>View in Quest Log</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSettingsModal = () => {
    return (
      <Modal
        visible={showQuestDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuestDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Tracker Settings</Text>
              <TouchableOpacity onPress={() => setShowQuestDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingsContent}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Show Map Markers</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, showMapMarkers && styles.toggleActive]}
                  onPress={() => setShowMapMarkers(!showMapMarkers)}
                >
                  <View style={[styles.toggleKnob, showMapMarkers && styles.toggleKnobActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Quest Notifications</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, showNotifications && styles.toggleActive]}
                  onPress={() => setShowNotifications(!showNotifications)}
                >
                  <View style={[styles.toggleKnob, showNotifications && styles.toggleKnobActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Sort Quests By</Text>
                <View style={styles.sortOptions}>
                  {['progress', 'level', 'type'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.sortButton, sortBy === option && styles.sortActive]}
                      onPress={() => setSortBy(option as any)}
                    >
                      <Text style={[styles.sortText, sortBy === option && styles.sortActiveText]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Mystical%20quest%20tracker%20with%20glowing%20markers%20and%20ancient%20map&aspect=9:16&seed=tracker' }}
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
          <Text style={styles.headerTitle}>QUEST TRACKER</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              setSelectedQuest(null);
              setShowQuestDetails(true);
            }}
          >
            <Ionicons name="settings" size={24} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{activeQuests.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {activeQuests.reduce((sum, quest) =>
                sum + quest.objectives.filter(obj => obj.completed).length, 0
              )}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round(activeQuests.reduce((sum, quest) =>
                sum + (quest.objectives.filter(obj => obj.completed).length / quest.objectives.length), 0
              ) / activeQuests.length * 100) || 0}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['progress', 'level', 'type'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.sortButton, sortBy === option && styles.sortActive]}
                onPress={() => setSortBy(option as any)}
              >
                <Text style={[styles.sortText, sortBy === option && styles.sortActiveText]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.questsContainer}>
          <Text style={styles.sectionTitle}>Active Quests ({activeQuests.length})</Text>
          <FlatList
            data={sortedQuests}
            renderItem={renderQuestItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.questsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="map-marked-alt" size={48} color="#666" />
                <Text style={styles.emptyText}>No active quests</Text>
                <Text style={styles.emptySubtext}>Visit the Quest Log to accept new quests</Text>
                <TouchableOpacity
                  style={styles.visitLogButton}
                  onPress={() => navigation.navigate('QuestLog')}
                >
                  <Text style={styles.visitLogButtonText}>Go to Quest Log</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('QuestLog')}
          >
            <FontAwesome5 name="scroll" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Quest Log</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="map" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>World Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="notifications" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Alerts</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {selectedQuest ? renderQuestDetailsModal() : renderSettingsModal()}
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
  settingsButton: {
    padding: 8,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#A89968',
    fontSize: 12,
    marginTop: 2,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortLabel: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  sortButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  sortActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  sortText: {
    color: '#A89968',
    fontSize: 12,
  },
  sortActiveText: {
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
  nearbyQuest: {
    borderColor: '#FFD700',
    borderWidth: 2,
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
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  questLocation: {
    color: '#A89968',
    fontSize: 12,
  },
  questProgress: {
    alignItems: 'center',
  },
  progressPercent: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextObjective: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  nextObjectiveText: {
    color: '#FFD700',
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  objectiveProgress: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#32CD32',
  },
  progressText: {
    color: '#A89968',
    fontSize: 12,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  locationText: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  updateButton: {
    backgroundColor: '#4169E1',
    borderRadius: 6,
    padding: 6,
  },
  updateButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    padding: 6,
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
    marginBottom: 16,
  },
  visitLogButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
  },
  visitLogButtonText: {
    color: '#000',
    fontSize: 14,
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
  detailQuestLocation: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 2,
  },
  detailQuestGiver: {
    color: '#A89968',
    fontSize: 14,
  },
  questDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
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
    marginBottom: 4,
  },
  completedObjective: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  objectiveTarget: {
    color: '#FFD700',
    fontSize: 12,
    marginBottom: 2,
  },
  objectiveProgress: {
    color: '#32CD32',
    fontSize: 12,
  },
  objectiveActions: {
    marginLeft: 12,
  },
  incrementButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 4,
    padding: 4,
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
  detailViewLogButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  detailViewLogButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 12,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  settingsContent: {
    alignItems: 'stretch',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  settingLabel: {
    color: '#D4AF37',
    fontSize: 16,
  },
  toggleButton: {
    width: 50,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3A3A3A',
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#D4AF37',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#666',
  },
  toggleKnobActive: {
    backgroundColor: '#000',
    transform: [{ translateX: 26 }],
  },
  sortOptions: {
    flexDirection: 'row',
  },
});