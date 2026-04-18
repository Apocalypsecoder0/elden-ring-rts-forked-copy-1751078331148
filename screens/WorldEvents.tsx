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

// Sample world events data
const WORLD_EVENTS = [
  {
    id: 'blood-moon',
    name: 'Blood Moon Festival',
    type: 'Festival',
    region: 'All Regions',
    status: 'Active',
    timeRemaining: '2h 15m',
    description: 'A crimson moon rises, summoning powerful enemies and granting rare rewards.',
    rewards: ['Blood Moon Essence', 'Crimson Runes', 'Festival Tokens'],
    requirements: ['Level 20+', 'Complete Moonlight Altar quest'],
    participants: 1247,
    difficulty: 'High'
  },
  {
    id: 'dragon-storm',
    name: 'Ancient Dragon Storm',
    type: 'Invasion',
    region: 'Mountaintops of the Giants',
    status: 'Upcoming',
    timeRemaining: '6h 30m',
    description: 'Ancient dragons descend upon the mountaintops, bringing chaos and opportunity.',
    rewards: ['Dragon Heart', 'Ancient Dragon Smithing Stone', 'Dragon Communion Incantations'],
    requirements: ['Level 50+', 'Access to Mountaintops'],
    participants: 0,
    difficulty: 'Extreme'
  },
  {
    id: 'merchant-caravan',
    name: 'Nomadic Merchant Caravan',
    type: 'Trade',
    region: 'Caelid',
    status: 'Active',
    timeRemaining: '4h 45m',
    description: 'Rare merchants have set up camp, offering unique items and weapons.',
    rewards: ['Unique Weapons', 'Rare Materials', 'Trading Opportunities'],
    requirements: ['Level 15+', 'Access to Caelid'],
    participants: 892,
    difficulty: 'Low'
  },
  {
    id: 'tournament',
    name: 'Elden Lord Tournament',
    type: 'Competition',
    region: 'Leyndell',
    status: 'Registration',
    timeRemaining: '12h 0m',
    description: 'Prove your worth in the grand tournament to claim the title of Elden Lord.',
    rewards: ['Elden Lord Title', 'Legendary Equipment', 'Realm-wide Recognition'],
    requirements: ['Level 60+', 'Complete Main Questline'],
    participants: 156,
    difficulty: 'Extreme'
  },
  {
    id: 'plague-outbreak',
    name: 'Scarlet Rot Outbreak',
    type: 'Disaster',
    region: 'Caelid',
    status: 'Active',
    timeRemaining: '8h 20m',
    description: 'The Scarlet Rot spreads rapidly, corrupting the land and its inhabitants.',
    rewards: ['Rotten Flesh', 'Scarlet Amber Medallion', 'Antirot Potions'],
    requirements: ['Level 30+', 'Access to Caelid'],
    participants: 2156,
    difficulty: 'High'
  }
];

const WorldEvents: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedEvent, setSelectedEvent] = useState<typeof WORLD_EVENTS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEventPress = (event: typeof WORLD_EVENTS[0]) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleJoinEvent = () => {
    if (selectedEvent) {
      toast.success(`Joined ${selectedEvent.name}!`);
      setModalVisible(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Festival': return 'moon';
      case 'Invasion': return 'flame';
      case 'Trade': return 'cart';
      case 'Competition': return 'trophy';
      case 'Disaster': return 'warning';
      default: return 'calendar';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Upcoming': return '#FF9800';
      case 'Registration': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const renderEventItem = ({ item }: { item: typeof WORLD_EVENTS[0] }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleEventPress(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.eventCardGradient}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventIconContainer}>
            <Ionicons name={getEventIcon(item.type)} size={24} color="#FFD700" />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventType}>{item.type} • {item.region}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.eventFooter}>
          <Text style={styles.timeRemaining}>
            <Ionicons name="time-outline" size={14} color="#FFD700" />
            {' '}{item.timeRemaining}
          </Text>
          <Text style={styles.participants}>
            <Ionicons name="people-outline" size={14} color="#FFD700" />
            {' '}{item.participants}
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
          <Text style={styles.title}>WORLD EVENTS</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Events List */}
        <FlatList
          data={WORLD_EVENTS}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Event Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedEvent && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedEvent.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.eventDetailSection}>
                      <Text style={styles.sectionTitle}>Event Details</Text>
                      <Text style={styles.eventDetailText}>
                        <Text style={styles.detailLabel}>Type:</Text> {selectedEvent.type}
                      </Text>
                      <Text style={styles.eventDetailText}>
                        <Text style={styles.detailLabel}>Region:</Text> {selectedEvent.region}
                      </Text>
                      <Text style={styles.eventDetailText}>
                        <Text style={styles.detailLabel}>Status:</Text> {selectedEvent.status}
                      </Text>
                      <Text style={styles.eventDetailText}>
                        <Text style={styles.detailLabel}>Time Remaining:</Text> {selectedEvent.timeRemaining}
                      </Text>
                      <Text style={styles.eventDetailText}>
                        <Text style={styles.detailLabel}>Difficulty:</Text> {selectedEvent.difficulty}
                      </Text>
                      <Text style={styles.eventDetailText}>
                        <Text style={styles.detailLabel}>Participants:</Text> {selectedEvent.participants}
                      </Text>
                    </View>

                    <View style={styles.eventDetailSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.eventDescriptionText}>
                        {selectedEvent.description}
                      </Text>
                    </View>

                    <View style={styles.eventDetailSection}>
                      <Text style={styles.sectionTitle}>Requirements</Text>
                      {selectedEvent.requirements.map((req, index) => (
                        <Text key={index} style={styles.requirementText}>
                          • {req}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.eventDetailSection}>
                      <Text style={styles.sectionTitle}>Rewards</Text>
                      {selectedEvent.rewards.map((reward, index) => (
                        <Text key={index} style={styles.rewardText}>
                          • {reward}
                        </Text>
                      ))}
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={handleJoinEvent}
                    >
                      <Text style={styles.joinButtonText}>Join Event</Text>
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
  eventsList: {
    padding: 20,
    paddingBottom: 100,
  },
  eventCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventCardGradient: {
    padding: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  eventType: {
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
  eventDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 20,
    marginBottom: 10,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRemaining: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  participants: {
    fontSize: 12,
    color: '#FFD700',
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
  eventDetailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  eventDescriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  requirementText: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 3,
  },
  rewardText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 3,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  joinButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
});

export default WorldEvents;