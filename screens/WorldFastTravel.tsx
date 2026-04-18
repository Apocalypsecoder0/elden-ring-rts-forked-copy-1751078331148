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
  FlatList,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { FastTravelPoint, WorldLocation } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample fast travel points
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
    discovered: true,
    coordinates: { x: 320, y: 160 },
    description: 'Town near the entrance to the Academy of Raya Lucaria.',
  },
  {
    id: 'third_church_of_marika',
    name: 'Third Church of Marika',
    location: 'Limgrave',
    discovered: true,
    coordinates: { x: 160, y: 200 },
    description: 'A church dedicated to Queen Marika.',
  },
  {
    id: 'church_of_dragon_communication',
    name: 'Church of Dragon Communication',
    location: 'Limgrave',
    discovered: false,
    coordinates: { x: 180, y: 240 },
    description: 'A church where one can commune with dragons.',
  },
  {
    id: 'waypoint_cellar',
    name: 'Waypoint Cellar',
    location: 'Liurnia',
    discovered: false,
    coordinates: { x: 300, y: 140 },
    description: 'A hidden cellar with ancient secrets.',
  },
  {
    id: 'moonlight_altar',
    name: 'Moonlight Altar',
    location: 'Liurnia',
    discovered: false,
    coordinates: { x: 340, y: 120 },
    description: 'A sacred altar under the moonlight.',
  },
];

// Regions for filtering
const REGIONS = ['Limgrave', 'Liurnia', 'Caelid', 'Altus Plateau', 'Mountaintops'];

export default function WorldFastTravelScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPoint, setSelectedPoint] = useState<FastTravelPoint | null>(null);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'region' | 'distance'>('name');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPoints = FAST_TRAVEL_POINTS.filter(point => {
    const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || point.location === selectedRegion;
    return matchesSearch && matchesRegion && point.discovered;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'region':
        return a.location.localeCompare(b.location);
      case 'distance':
        // For now, sort by coordinates (simulating distance)
        return (a.coordinates.x + a.coordinates.y) - (b.coordinates.x + b.coordinates.y);
      default:
        return 0;
    }
  });

  const selectFastTravelPoint = (point: FastTravelPoint) => {
    setSelectedPoint(point);
    setShowTravelModal(true);
  };

  const confirmTravel = () => {
    if (!selectedPoint) return;

    // In a real game, this would teleport the player
    toast.success(`Traveling to ${selectedPoint.name}!`);
    setShowTravelModal(false);
    setSelectedPoint(null);
  };

  const renderFastTravelItem = ({ item }: { item: FastTravelPoint }) => {
    return (
      <TouchableOpacity
        style={[styles.fastTravelItem, !item.discovered && styles.undiscoveredPoint]}
        onPress={() => item.discovered && selectFastTravelPoint(item)}
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
            <Text style={[styles.fastTravelRegion, !item.discovered && styles.undiscoveredText]}>
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

        {item.discovered && (
          <View style={styles.fastTravelStats}>
            <Text style={styles.statsText}>
              Coordinates: ({item.coordinates.x}, {item.coordinates.y})
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTravelModal = () => {
    if (!selectedPoint) return null;

    return (
      <Modal
        visible={showTravelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTravelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.travelModalContainer}>
            <View style={styles.travelModalHeader}>
              <Text style={styles.travelModalTitle}>Fast Travel</Text>
              <TouchableOpacity onPress={() => setShowTravelModal(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.travelModalContent}>
              <View style={styles.travelDetailHeader}>
                <View style={styles.detailTravelIconContainer}>
                  <Ionicons name="navigate" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailTravelInfo}>
                  <Text style={styles.detailTravelName}>{selectedPoint.name}</Text>
                  <Text style={styles.detailTravelRegion}>{selectedPoint.location}</Text>
                </View>
              </View>

              <Text style={styles.travelDetailDescription}>{selectedPoint.description}</Text>

              <View style={styles.travelInfo}>
                <View style={styles.travelInfoItem}>
                  <Ionicons name="location" size={16} color="#A89968" />
                  <Text style={styles.travelInfoText}>
                    Coordinates: ({selectedPoint.coordinates.x}, {selectedPoint.coordinates.y})
                  </Text>
                </View>
                <View style={styles.travelInfoItem}>
                  <Ionicons name="time" size={16} color="#A89968" />
                  <Text style={styles.travelInfoText}>Travel time: Instant</Text>
                </View>
              </View>

              <View style={styles.travelWarning}>
                <Ionicons name="warning" size={20} color="#FFA500" />
                <Text style={styles.travelWarningText}>
                  Traveling will move you to this location. Make sure you're ready to leave your current position.
                </Text>
              </View>

              <View style={styles.travelActions}>
                <TouchableOpacity
                  style={styles.cancelTravelButton}
                  onPress={() => setShowTravelModal(false)}
                >
                  <Text style={styles.cancelTravelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmTravelButton}
                  onPress={confirmTravel}
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

  const renderFiltersModal = () => {
    return (
      <Modal
        visible={showFilters}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filtersModalContainer}>
            <View style={styles.filtersModalHeader}>
              <Text style={styles.filtersModalTitle}>Filters & Sort</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.filtersContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Region</Text>
                <View style={styles.regionFilterContainer}>
                  <TouchableOpacity
                    style={[styles.regionFilterButton, selectedRegion === 'all' && styles.activeRegionFilter]}
                    onPress={() => setSelectedRegion('all')}
                  >
                    <Text style={[styles.regionFilterText, selectedRegion === 'all' && styles.activeRegionFilterText]}>All Regions</Text>
                  </TouchableOpacity>
                  {REGIONS.map((region) => (
                    <TouchableOpacity
                      key={region}
                      style={[styles.regionFilterButton, selectedRegion === region && styles.activeRegionFilter]}
                      onPress={() => setSelectedRegion(region)}
                    >
                      <Text style={[styles.regionFilterText, selectedRegion === region && styles.activeRegionFilterText]}>
                        {region}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.sortContainer}>
                  {(['name', 'region', 'distance'] as const).map((sortOption) => (
                    <TouchableOpacity
                      key={sortOption}
                      style={[styles.sortButton, sortBy === sortOption && styles.activeSortButton]}
                      onPress={() => setSortBy(sortOption)}
                    >
                      <Text style={[styles.sortButtonText, sortBy === sortOption && styles.activeSortText]}>
                        {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Mystical%20fast%20travel%20network%20with%20glowing%20waypoints%20and%20ancient%20magic&aspect=9:16&seed=fasttravel' }}
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
          <Text style={styles.headerTitle}>FAST TRAVEL</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#A89968" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search waypoints..."
              placeholderTextColor="#A89968"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={20} color="#A89968" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{FAST_TRAVEL_POINTS.filter(p => p.discovered).length}</Text>
            <Text style={styles.statLabel}>Discovered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{FAST_TRAVEL_POINTS.filter(p => !p.discovered).length}</Text>
            <Text style={styles.statLabel}>Undiscovered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{REGIONS.length}</Text>
            <Text style={styles.statLabel}>Regions</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Waypoints ({filteredPoints.length})
          </Text>
          <FlatList
            data={filteredPoints}
            renderItem={renderFastTravelItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="navigate" size={48} color="#666" />
                <Text style={styles.emptyText}>No waypoints found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('WorldMap')}
          >
            <FontAwesome5 name="map-marked-alt" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>World Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('WorldLocations')}
          >
            <Ionicons name="location" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Locations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="bookmark" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Bookmarks</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderTravelModal()}
      {renderFiltersModal()}
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
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 16,
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
  fastTravelItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  undiscoveredPoint: {
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
  undiscoveredIcon: {
    backgroundColor: 'rgba(102, 102, 102, 0.2)',
  },
  fastTravelInfo: {
    flex: 1,
  },
  fastTravelName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  fastTravelRegion: {
    color: '#A89968',
    fontSize: 12,
  },
  undiscoveredText: {
    color: '#666',
  },
  fogBadge: {
    marginLeft: 8,
  },
  fastTravelDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  fastTravelStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
  },
  statsText: {
    color: '#A89968',
    fontSize: 12,
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
  travelModalContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  travelModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  travelModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  travelModalContent: {
    alignItems: 'center',
  },
  travelDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailTravelIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTravelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailTravelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailTravelRegion: {
    color: '#A89968',
    fontSize: 14,
  },
  travelDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  travelInfo: {
    width: '100%',
    marginBottom: 16,
  },
  travelInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  travelInfoText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  travelWarning: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  travelWarningText: {
    color: '#FFA500',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  travelActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelTravelButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  cancelTravelButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  confirmTravelButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  confirmTravelButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  filtersModalContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  filtersModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  filtersModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  filtersContent: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 12,
  },
  regionFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  regionFilterButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  activeRegionFilter: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  regionFilterText: {
    color: '#A89968',
    fontSize: 12,
  },
  activeRegionFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sortButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  activeSortButton: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  sortButtonText: {
    color: '#A89968',
    fontSize: 14,
    textAlign: 'center',
  },
  activeSortText: {
    color: '#000',
    fontWeight: '600',
  },
  applyFiltersButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyFiltersButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});