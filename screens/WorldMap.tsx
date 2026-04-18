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

// Import game types
import { WorldLocation, FastTravelPoint } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample world locations
const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'limgrave',
    name: 'Limgrave',
    description: 'The first region encountered by Tarnished. Features rolling hills and the Stormhill area.',
    type: 'region',
    discovered: true,
    coordinates: { x: 100, y: 200 },
    subLocations: [
      { id: 'stormhill', name: 'Stormhill', type: 'area', discovered: true },
      { id: 'weeping_peninsula', name: 'Weeping Peninsula', type: 'area', discovered: false },
      { id: 'mistwood', name: 'Mistwood', type: 'area', discovered: true },
    ],
    bosses: ['Tree Sentinel', 'Margit, the Fell Omen'],
    pointsOfInterest: ['Stormveil Castle', 'Church of Elleh', 'Gatefront Ruins'],
  },
  {
    id: 'liurnia',
    name: 'Liurnia of the Lakes',
    description: 'A vast region filled with lakes and magical academies. Home to the Carian royal family.',
    type: 'region',
    discovered: true,
    coordinates: { x: 300, y: 150 },
    subLocations: [
      { id: 'carian_study_hall', name: 'Carian Study Hall', type: 'dungeon', discovered: false },
      { id: 'academy_crystal_cave', name: 'Academy Crystal Cave', type: 'cave', discovered: true },
      { id: 'rose_church', name: 'Rose Church', type: 'church', discovered: true },
    ],
    bosses: ['Royal Knight Loretta', 'Rennala, Queen of the Full Moon'],
    pointsOfInterest: ['Academy of Raya Lucaria', 'Village of the Albinaurics', 'Moonlight Altar'],
  },
  {
    id: 'caelid',
    name: 'Caelid',
    description: 'A barren wasteland scarred by the Scarlet Rot. Dangerous but rich in resources.',
    type: 'region',
    discovered: false,
    coordinates: { x: 400, y: 300 },
    subLocations: [
      { id: 'dragonbarrow', name: 'Dragonbarrow', type: 'area', discovered: false },
      { id: 'greyoll_dragonbarrow', name: 'Greyoll\'s Dragonbarrow', type: 'area', discovered: false },
      { id: 'sellia_hideaway', name: 'Sellia Hideaway', type: 'dungeon', discovered: false },
    ],
    bosses: ['Starscourge Radahn', 'Magma Wyrm Makar'],
    pointsOfInterest: ['Redmane Castle', 'Sellia, Town of Sorcery', 'Aeonia Swamp'],
  },
  {
    id: 'altus_plateau',
    name: 'Altus Plateau',
    description: 'The elevated plateau region. Features grand architecture and ancient ruins.',
    type: 'region',
    discovered: false,
    coordinates: { x: 250, y: 100 },
    subLocations: [
      { id: 'capital_outskirts', name: 'Capital Outskirts', type: 'area', discovered: false },
      { id: 'old_altus_tunnel', name: 'Old Altus Tunnel', type: 'dungeon', discovered: false },
      { id: 'sainted_hero_grave', name: 'Sainted Hero\'s Grave', type: 'dungeon', discovered: false },
    ],
    bosses: ['Crucible Knight Ordovis', 'Ancient Dragon Lansseax'],
    pointsOfInterest: ['Leyndell, Royal Capital', 'Windmill Village', 'Dectus Medallion'],
  },
  {
    id: 'mountaintops',
    name: 'Mountaintops of the Giants',
    description: 'The highest peaks of the Lands Between. Snow-covered and treacherous.',
    type: 'region',
    discovered: false,
    coordinates: { x: 350, y: 50 },
    subLocations: [
      { id: 'flame_peak', name: 'Flame Peak', type: 'area', discovered: false },
      { id: 'forge_of_the_giants', name: 'Forge of the Giants', type: 'area', discovered: false },
      { id: 'spiritcaller_cave', name: 'Spiritcaller Cave', type: 'cave', discovered: false },
    ],
    bosses: ['Fire Giant', 'Ulcerated Tree Spirit'],
    pointsOfInterest: ['Castle Sol', 'Church of the Eclipse', 'Zamor Ruins'],
  },
];

// Fast travel points
const FAST_TRAVEL_POINTS: FastTravelPoint[] = [
  {
    id: 'church_of_elleh',
    name: 'Church of Elleh',
    location: 'Limgrave',
    discovered: true,
    coordinates: { x: 120, y: 180 },
    description: 'A small church in western Limgrave. Site of Grace.',
  },
  {
    id: 'gatefront_ruins',
    name: 'Gatefront Ruins',
    location: 'Limgrave',
    discovered: true,
    coordinates: { x: 140, y: 220 },
    description: 'Ancient ruins near the entrance to Stormveil Castle.',
  },
  {
    id: 'liurnia_highway_north',
    name: 'Liurnia Highway North',
    location: 'Liurnia',
    discovered: true,
    coordinates: { x: 280, y: 130 },
    description: 'Northern road through Liurnia of the Lakes.',
  },
  {
    id: 'academy_gate_town',
    name: 'Academy Gate Town',
    location: 'Liurnia',
    discovered: false,
    coordinates: { x: 320, y: 160 },
    description: 'Town near the entrance to the Academy of Raya Lucaria.',
  },
];

export default function WorldMapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [selectedFastTravel, setSelectedFastTravel] = useState<FastTravelPoint | null>(null);
  const [showFastTravel, setShowFastTravel] = useState(false);
  const [mapMode, setMapMode] = useState<'regions' | 'fastTravel'>('regions');

  const selectLocation = (location: WorldLocation) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);
  };

  const selectFastTravel = (point: FastTravelPoint) => {
    setSelectedFastTravel(point);
    setShowFastTravel(true);
  };

  const travelToLocation = () => {
    if (!selectedFastTravel) return;

    // In a real game, this would teleport the player
    toast.success(`Traveling to ${selectedFastTravel.name}!`);
    setShowFastTravel(false);
    setSelectedFastTravel(null);
  };

  const renderLocationItem = ({ item }: { item: WorldLocation }) => {
    return (
      <TouchableOpacity
        style={[styles.locationItem, !item.discovered && styles.undiscoveredLocation]}
        onPress={() => item.discovered && selectLocation(item)}
        disabled={!item.discovered}
      >
        <View style={styles.locationHeader}>
          <View style={[styles.locationIconContainer, !item.discovered && styles.undiscoveredIcon]}>
            <FontAwesome5
              name={item.type === 'region' ? 'map-marked-alt' : 'map-marker-alt'}
              size={20}
              color={item.discovered ? "#D4AF37" : "#666"}
            />
          </View>
          <View style={styles.locationInfo}>
            <Text style={[styles.locationName, !item.discovered && styles.undiscoveredText]}>
              {item.name}
            </Text>
            <Text style={[styles.locationType, !item.discovered && styles.undiscoveredText]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
          {!item.discovered && (
            <View style={styles.fogBadge}>
              <Ionicons name="eye-off" size={16} color="#666" />
            </View>
          )}
        </View>

        <Text style={[styles.locationDescription, !item.discovered && styles.undiscoveredText]} numberOfLines={2}>
          {item.discovered ? item.description : 'Undiscovered region'}
        </Text>

        {item.discovered && (
          <View style={styles.locationStats}>
            <Text style={styles.statsText}>
              {item.subLocations?.length || 0} sub-locations • {item.bosses?.length || 0} bosses
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFastTravelItem = ({ item }: { item: FastTravelPoint }) => {
    return (
      <TouchableOpacity
        style={[styles.fastTravelItem, !item.discovered && styles.undiscoveredFastTravel]}
        onPress={() => item.discovered && selectFastTravel(item)}
        disabled={!item.discovered}
      >
        <View style={styles.fastTravelHeader}>
          <View style={[styles.fastTravelIconContainer, !item.discovered && styles.undiscoveredIcon]}>
            <Ionicons name="navigate" size={20} color={item.discovered ? "#D4AF37" : "#666"} />
          </View>
          <View style={styles.fastTravelInfo}>
            <Text style={[styles.fastTravelName, !item.discovered && styles.undiscoveredText]}>
              {item.name}
            </Text>
            <Text style={[styles.fastTravelLocation, !item.discovered && styles.undiscoveredText]}>
              {item.location}
            </Text>
          </View>
          {!item.discovered && (
            <View style={styles.fogBadge}>
              <Ionicons name="eye-off" size={16} color="#666" />
            </View>
          )}
        </View>

        <Text style={[styles.fastTravelDescription, !item.discovered && styles.undiscoveredText]} numberOfLines={2}>
          {item.discovered ? item.description : 'Undiscovered site'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLocationDetailsModal = () => {
    if (!selectedLocation) return null;

    return (
      <Modal
        visible={showLocationDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationDetailsContainer}>
            <View style={styles.locationDetailsHeader}>
              <Text style={styles.locationDetailsTitle}>Location Details</Text>
              <TouchableOpacity onPress={() => setShowLocationDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.locationDetailsContent}>
              <View style={styles.locationDetailHeader}>
                <View style={styles.detailLocationIconContainer}>
                  <FontAwesome5 name="map-marked-alt" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailLocationInfo}>
                  <Text style={styles.detailLocationName}>{selectedLocation.name}</Text>
                  <Text style={styles.detailLocationType}>{selectedLocation.type.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.locationDetailDescription}>{selectedLocation.description}</Text>

              {selectedLocation.subLocations && selectedLocation.subLocations.length > 0 && (
                <View style={styles.subLocationsSection}>
                  <Text style={styles.sectionTitle}>Sub-Locations</Text>
                  {selectedLocation.subLocations.map((subLoc) => (
                    <View key={subLoc.id} style={styles.subLocationItem}>
                      <Text style={[styles.subLocationName, !subLoc.discovered && styles.undiscoveredText]}>
                        {subLoc.name}
                      </Text>
                      <Text style={[styles.subLocationType, !subLoc.discovered && styles.undiscoveredText]}>
                        {subLoc.type}
                      </Text>
                      {!subLoc.discovered && (
                        <Ionicons name="eye-off" size={16} color="#666" />
                      )}
                    </View>
                  ))}
                </View>
              )}

              {selectedLocation.bosses && selectedLocation.bosses.length > 0 && (
                <View style={styles.bossesSection}>
                  <Text style={styles.sectionTitle}>Bosses</Text>
                  {selectedLocation.bosses.map((boss, index) => (
                    <Text key={index} style={styles.bossItem}>• {boss}</Text>
                  ))}
                </View>
              )}

              {selectedLocation.pointsOfInterest && selectedLocation.pointsOfInterest.length > 0 && (
                <View style={styles.poiSection}>
                  <Text style={styles.sectionTitle}>Points of Interest</Text>
                  {selectedLocation.pointsOfInterest.map((poi, index) => (
                    <Text key={index} style={styles.poiItem}>• {poi}</Text>
                  ))}
                </View>
              )}

              <View style={styles.locationActions}>
                <TouchableOpacity style={styles.travelButton}>
                  <Text style={styles.travelButtonText}>Travel Here</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.markButton}>
                  <Text style={styles.markButtonText}>Mark on Map</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderFastTravelModal = () => {
    if (!selectedFastTravel) return null;

    return (
      <Modal
        visible={showFastTravel}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFastTravel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fastTravelModalContainer}>
            <View style={styles.fastTravelModalHeader}>
              <Text style={styles.fastTravelModalTitle}>Fast Travel</Text>
              <TouchableOpacity onPress={() => setShowFastTravel(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.fastTravelModalContent}>
              <View style={styles.fastTravelDetailHeader}>
                <View style={styles.detailFastTravelIconContainer}>
                  <Ionicons name="navigate" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailFastTravelInfo}>
                  <Text style={styles.detailFastTravelName}>{selectedFastTravel.name}</Text>
                  <Text style={styles.detailFastTravelLocation}>{selectedFastTravel.location}</Text>
                </View>
              </View>

              <Text style={styles.fastTravelDetailDescription}>{selectedFastTravel.description}</Text>

              <View style={styles.fastTravelActions}>
                <TouchableOpacity
                  style={styles.confirmTravelButton}
                  onPress={travelToLocation}
                >
                  <Text style={styles.confirmTravelButtonText}>Travel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20fantasy%20world%20map%20with%20floating%20islands%20and%20glowing%20locations&aspect=9:16&seed=worldmap' }}
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
          <Text style={styles.headerTitle}>WORLD MAP</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.mapModeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mapMode === 'regions' && styles.activeModeButton]}
            onPress={() => setMapMode('regions')}
          >
            <FontAwesome5 name="map-marked-alt" size={16} color={mapMode === 'regions' ? "#000" : "#D4AF37"} />
            <Text style={[styles.modeButtonText, mapMode === 'regions' && styles.activeModeText]}>Regions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mapMode === 'fastTravel' && styles.activeModeButton]}
            onPress={() => setMapMode('fastTravel')}
          >
            <Ionicons name="navigate" size={16} color={mapMode === 'fastTravel' ? "#000" : "#D4AF37"} />
            <Text style={[styles.modeButtonText, mapMode === 'fastTravel' && styles.activeModeText]}>Fast Travel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <ImageBackground
            source={{ uri: 'https://api.a0.dev/assets/image?text=Stylized%20Elden%20Ring%20world%20map%20with%20regions%20and%20landmarks&aspect=16:9&seed=eldenmap' }}
            style={styles.mapImage}
            resizeMode="cover"
          >
            {/* Map markers would go here */}
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayText}>
                {mapMode === 'regions' ? 'Tap regions to explore' : 'Tap sites to fast travel'}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            {mapMode === 'regions' ? 'Regions' : 'Fast Travel Points'}
          </Text>
          <FlatList
            data={mapMode === 'regions' ? WORLD_LOCATIONS : FAST_TRAVEL_POINTS}
            renderItem={mapMode === 'regions' ? renderLocationItem : renderFastTravelItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="search" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="filter" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="bookmark" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Bookmarks</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderLocationDetailsModal()}
      {renderFastTravelModal()}
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
  mapModeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
  },
  activeModeButton: {
    backgroundColor: '#D4AF37',
  },
  modeButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeModeText: {
    color: '#000',
  },
  mapContainer: {
    height: height * 0.25,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  mapImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  mapOverlayText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
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
  listContent: {
    paddingBottom: 20,
  },
  locationItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  undiscoveredLocation: {
    opacity: 0.6,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  undiscoveredIcon: {
    backgroundColor: 'rgba(102, 102, 102, 0.2)',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  locationType: {
    color: '#A89968',
    fontSize: 12,
  },
  undiscoveredText: {
    color: '#666',
  },
  fogBadge: {
    marginLeft: 8,
  },
  locationDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  locationStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
  },
  statsText: {
    color: '#A89968',
    fontSize: 12,
  },
  fastTravelItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  undiscoveredFastTravel: {
    opacity: 0.6,
  },
  fastTravelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fastTravelIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fastTravelInfo: {
    flex: 1,
  },
  fastTravelName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  fastTravelLocation: {
    color: '#A89968',
    fontSize: 12,
  },
  fastTravelDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
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
  locationDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  locationDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  locationDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  locationDetailsContent: {
    flex: 1,
  },
  locationDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailLocationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailLocationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLocationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailLocationType: {
    color: '#A89968',
    fontSize: 14,
  },
  locationDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  subLocationsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  subLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
  },
  subLocationName: {
    color: '#A89968',
    fontSize: 14,
    flex: 1,
  },
  subLocationType: {
    color: '#666',
    fontSize: 12,
    marginRight: 8,
  },
  bossesSection: {
    marginBottom: 16,
  },
  bossItem: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  poiSection: {
    marginBottom: 16,
  },
  poiItem: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  travelButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  travelButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  markButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  markButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  fastTravelModalContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  fastTravelModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  fastTravelModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  fastTravelModalContent: {
    alignItems: 'center',
  },
  fastTravelDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailFastTravelIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailFastTravelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailFastTravelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailFastTravelLocation: {
    color: '#A89968',
    fontSize: 14,
  },
  fastTravelDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  fastTravelActions: {
    width: '100%',
  },
  confirmTravelButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  confirmTravelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});