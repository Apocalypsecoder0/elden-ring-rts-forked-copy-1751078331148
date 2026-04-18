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

// Sample exploration data
const EXPLORATION_ZONES = [
  {
    id: 'limgrave',
    name: 'Limgrave',
    region: 'Starting Area',
    discovered: 85,
    totalLocations: 120,
    difficulty: 'Easy',
    recommendedLevel: '1-15',
    pointsOfInterest: [
      'Stormhill Castle',
      'Church of Elleh',
      'Gatefront Ruins',
      'Coastal Cave',
      'Murkwater Cave'
    ],
    status: 'Mostly Explored'
  },
  {
    id: 'liurnia',
    name: 'Liurnia of the Lakes',
    region: 'Midlands',
    discovered: 45,
    totalLocations: 180,
    difficulty: 'Medium',
    recommendedLevel: '20-40',
    pointsOfInterest: [
      'Academy of Raya Lucaria',
      'Caria Manor',
      'Village of the Albinaurics',
      'Moonlight Altar',
      'Black Knife Catacombs'
    ],
    status: 'Partially Explored'
  },
  {
    id: 'caelid',
    name: 'Caelid',
    region: 'Wild Lands',
    discovered: 25,
    totalLocations: 95,
    difficulty: 'Hard',
    recommendedLevel: '35-60',
    pointsOfInterest: [
      'Redmane Castle',
      'Sellia Crystal Tunnel',
      'War-Dead Catacombs',
      'Gaol Cave',
      'Caelid Catacombs'
    ],
    status: 'Dangerous Territory'
  },
  {
    id: 'altus',
    name: 'Altus Plateau',
    region: 'Highlands',
    discovered: 60,
    totalLocations: 140,
    difficulty: 'Medium',
    recommendedLevel: '40-70',
    pointsOfInterest: [
      'Leyndell, Royal Capital',
      'Windmill Village',
      'Dominula, Windmill Village',
      'Sealed Tunnel',
      'Old Altus Tunnel'
    ],
    status: 'Strategic Exploration'
  }
];

const DISCOVERED_LOCATIONS = [
  { id: '1', name: 'Stormhill Castle', type: 'Castle', region: 'Limgrave', discovered: true },
  { id: '2', name: 'Church of Elleh', type: 'Church', region: 'Limgrave', discovered: true },
  { id: '3', name: 'Gatefront Ruins', type: 'Ruins', region: 'Limgrave', discovered: true },
  { id: '4', name: 'Coastal Cave', type: 'Cave', region: 'Limgrave', discovered: true },
  { id: '5', name: 'Academy Gate Town', type: 'Town', region: 'Liurnia', discovered: false },
  { id: '6', name: 'Raya Lucaria Crystal Tunnel', type: 'Tunnel', region: 'Liurnia', discovered: false },
  { id: '7', name: 'Redmane Castle', type: 'Castle', region: 'Caelid', discovered: false },
  { id: '8', name: 'Sellia, Town of Sorcery', type: 'Town', region: 'Caelid', discovered: false },
];

export default function WorldExplorationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedZone, setSelectedZone] = useState<typeof EXPLORATION_ZONES[0] | null>(null);
  const [showZoneDetails, setShowZoneDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'zones' | 'locations'>('zones');

  const selectZone = (zone: typeof EXPLORATION_ZONES[0]) => {
    setSelectedZone(zone);
    setShowZoneDetails(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderZoneItem = ({ item }: { item: typeof EXPLORATION_ZONES[0] }) => (
    <TouchableOpacity
      style={styles.zoneItem}
      onPress={() => selectZone(item)}
    >
      <View style={styles.zoneHeader}>
        <View style={styles.zoneIcon}>
          <FontAwesome5 name="map-marker-alt" size={24} color="#D4AF37" />
        </View>
        <View style={styles.zoneInfo}>
          <Text style={styles.zoneName}>{item.name}</Text>
          <Text style={styles.zoneRegion}>{item.region}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>

      <View style={styles.zoneStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Explored</Text>
          <Text style={styles.statValue}>{item.discovered}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Locations</Text>
          <Text style={styles.statValue}>{item.totalLocations}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{item.recommendedLevel}</Text>
        </View>
      </View>

      <View style={styles.explorationBar}>
        <View style={styles.explorationFill}>
          <View
            style={[
              styles.explorationProgress,
              { width: `${item.discovered}%` }
            ]}
          />
        </View>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLocationItem = ({ item }: { item: typeof DISCOVERED_LOCATIONS[0] }) => (
    <TouchableOpacity
      style={[styles.locationItem, !item.discovered && styles.undiscoveredItem]}
      onPress={() => {
        if (item.discovered) {
          toast.info(`Traveling to ${item.name}`);
        } else {
          toast.error(`${item.name} not yet discovered`);
        }
      }}
    >
      <View style={styles.locationIcon}>
        <Ionicons
          name={item.discovered ? "location" : "location-outline"}
          size={20}
          color={item.discovered ? "#D4AF37" : "#666"}
        />
      </View>
      <View style={styles.locationInfo}>
        <Text style={[styles.locationName, !item.discovered && styles.undiscoveredText]}>
          {item.name}
        </Text>
        <Text style={[styles.locationType, !item.discovered && styles.undiscoveredText]}>
          {item.type} • {item.region}
        </Text>
      </View>
      {!item.discovered && (
        <View style={styles.lockIcon}>
          <Ionicons name="lock-closed" size={16} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderZoneDetailsModal = () => {
    if (!selectedZone) return null;

    return (
      <Modal
        visible={showZoneDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowZoneDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Exploration Details</Text>
              <TouchableOpacity onPress={() => setShowZoneDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailsContent}>
              <View style={styles.zoneDetailHeader}>
                <View style={styles.detailIcon}>
                  <FontAwesome5 name="map-marker-alt" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailName}>{selectedZone.name}</Text>
                  <Text style={styles.detailRegion}>{selectedZone.region}</Text>
                  <Text style={styles.detailStatus}>{selectedZone.status}</Text>
                </View>
              </View>

              <View style={styles.statsSection}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Exploration Progress:</Text>
                  <Text style={styles.statValue}>{selectedZone.discovered}%</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Locations:</Text>
                  <Text style={styles.statValue}>{selectedZone.totalLocations}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Difficulty:</Text>
                  <Text style={[styles.statValue, { color: getDifficultyColor(selectedZone.difficulty) }]}>
                    {selectedZone.difficulty}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Recommended Level:</Text>
                  <Text style={styles.statValue}>{selectedZone.recommendedLevel}</Text>
                </View>
              </View>

              <View style={styles.pointsSection}>
                <Text style={styles.sectionTitle}>Points of Interest</Text>
                {selectedZone.pointsOfInterest.map((poi, index) => (
                  <Text key={index} style={styles.poiText}>• {poi}</Text>
                ))}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    navigation.navigate('WorldMap');
                    setShowZoneDetails(false);
                  }}
                >
                  <Text style={styles.actionButtonText}>View on Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    toast.success(`Fast traveling to ${selectedZone.name}`);
                    setShowZoneDetails(false);
                  }}
                >
                  <Text style={styles.actionButtonText}>Fast Travel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20world%20map%20with%20exploration%20markers%20and%20fog%20of%20war&aspect=9:16&seed=exploration' }}
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
          <Text style={styles.headerTitle}>WORLD EXPLORATION</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'zones' && styles.activeTab]}
            onPress={() => setActiveTab('zones')}
          >
            <Text style={[styles.tabText, activeTab === 'zones' && styles.activeTabText]}>
              Exploration Zones
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'locations' && styles.activeTab]}
            onPress={() => setActiveTab('locations')}
          >
            <Text style={[styles.tabText, activeTab === 'locations' && styles.activeTabText]}>
              Discovered Locations
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'zones' ? (
          <FlatList
            data={EXPLORATION_ZONES}
            renderItem={renderZoneItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.zonesList}
          />
        ) : (
          <FlatList
            data={DISCOVERED_LOCATIONS}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.locationsList}
          />
        )}

        {renderZoneDetailsModal()}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  menuButton: {
    padding: 10,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#D4AF37',
  },
  tabText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  activeTabText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  zonesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  zoneItem: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  zoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 2,
  },
  zoneRegion: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  zoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  explorationBar: {
    marginTop: 10,
  },
  explorationFill: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 5,
  },
  explorationProgress: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  locationsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  undiscoveredItem: {
    opacity: 0.6,
  },
  locationIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 2,
  },
  undiscoveredText: {
    color: '#666',
  },
  locationType: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  lockIcon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  detailsContent: {
    padding: 20,
  },
  zoneDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  detailRegion: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  detailStatus: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  statsSection: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pointsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
  },
  poiText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
    marginLeft: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
});