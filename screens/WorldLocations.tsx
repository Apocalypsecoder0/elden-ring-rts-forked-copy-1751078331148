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
import { WorldLocation, LocationType } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample discovered locations
const DISCOVERED_LOCATIONS: WorldLocation[] = [
  {
    id: 'limgrave',
    name: 'Limgrave',
    description: 'The first region encountered by Tarnished. Features rolling hills and the Stormhill area.',
    type: 'region',
    discovered: true,
    coordinates: { x: 100, y: 200 },
    subLocations: [
      { id: 'stormhill', name: 'Stormhill', type: 'area', discovered: true },
      { id: 'mistwood', name: 'Mistwood', type: 'area', discovered: true },
      { id: 'church_of_elleh', name: 'Church of Elleh', type: 'church', discovered: true },
      { id: 'gatefront_ruins', name: 'Gatefront Ruins', type: 'ruins', discovered: true },
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
      { id: 'academy_crystal_cave', name: 'Academy Crystal Cave', type: 'cave', discovered: true },
      { id: 'rose_church', name: 'Rose Church', type: 'church', discovered: true },
      { id: 'liurnia_highway', name: 'Liurnia Highway', type: 'area', discovered: true },
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
    subLocations: [],
    bosses: ['Starscourge Radahn'],
    pointsOfInterest: ['Redmane Castle', 'Sellia, Town of Sorcery'],
  },
];

const LOCATION_TYPES: LocationType[] = ['region', 'area', 'dungeon', 'cave', 'church', 'ruins', 'town', 'castle'];

export default function WorldLocationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<LocationType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'region'>('name');
  const [showFilters, setShowFilters] = useState(false);

  const filteredLocations = DISCOVERED_LOCATIONS.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || location.type === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'region':
        return a.name.localeCompare(b.name); // For now, sort by name
      default:
        return 0;
    }
  });

  const selectLocation = (location: WorldLocation) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);
  };

  const getLocationIcon = (type: LocationType) => {
    switch (type) {
      case 'region': return 'map-marked-alt';
      case 'area': return 'map-marker-alt';
      case 'dungeon': return 'dungeon';
      case 'cave': return 'mountain';
      case 'church': return 'church';
      case 'ruins': return 'building';
      case 'town': return 'home';
      case 'castle': return 'fort-awesome';
      default: return 'map-marker-alt';
    }
  };

  const getLocationColor = (type: LocationType) => {
    switch (type) {
      case 'region': return '#D4AF37';
      case 'area': return '#A89968';
      case 'dungeon': return '#8B4513';
      case 'cave': return '#696969';
      case 'church': return '#FFD700';
      case 'ruins': return '#CD853F';
      case 'town': return '#32CD32';
      case 'castle': return '#DC143C';
      default: return '#D4AF37';
    }
  };

  const renderLocationItem = ({ item }: { item: WorldLocation }) => {
    const iconName = getLocationIcon(item.type);
    const iconColor = getLocationColor(item.type);

    return (
      <TouchableOpacity
        style={[styles.locationItem, !item.discovered && styles.undiscoveredLocation]}
        onPress={() => item.discovered && selectLocation(item)}
        disabled={!item.discovered}
      >
        <View style={styles.locationHeader}>
          <View style={[styles.locationIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <FontAwesome5 name={iconName} size={20} color={item.discovered ? iconColor : "#666"} />
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
          {item.discovered ? item.description : 'Undiscovered location'}
        </Text>

        {item.discovered && (
          <View style={styles.locationStats}>
            <Text style={styles.statsText}>
              {item.subLocations?.length || 0} sub-locations • {item.bosses?.length || 0} bosses • {item.pointsOfInterest?.length || 0} POIs
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderLocationDetailsModal = () => {
    if (!selectedLocation) return null;

    const iconName = getLocationIcon(selectedLocation.type);
    const iconColor = getLocationColor(selectedLocation.type);

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
                <View style={[styles.detailLocationIconContainer, { backgroundColor: `${iconColor}20` }]}>
                  <FontAwesome5 name={iconName} size={48} color={iconColor} />
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
                  {selectedLocation.subLocations.map((subLoc) => {
                    const subIconName = getLocationIcon(subLoc.type);
                    const subIconColor = getLocationColor(subLoc.type);

                    return (
                      <View key={subLoc.id} style={styles.subLocationItem}>
                        <View style={[styles.subLocationIconContainer, { backgroundColor: `${subIconColor}20` }]}>
                          <FontAwesome5 name={subIconName} size={16} color={subLoc.discovered ? subIconColor : "#666"} />
                        </View>
                        <View style={styles.subLocationInfo}>
                          <Text style={[styles.subLocationName, !subLoc.discovered && styles.undiscoveredText]}>
                            {subLoc.name}
                          </Text>
                          <Text style={[styles.subLocationType, !subLoc.discovered && styles.undiscoveredText]}>
                            {subLoc.type}
                          </Text>
                        </View>
                        {!subLoc.discovered && (
                          <Ionicons name="eye-off" size={16} color="#666" />
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              {selectedLocation.bosses && selectedLocation.bosses.length > 0 && (
                <View style={styles.bossesSection}>
                  <Text style={styles.sectionTitle}>Bosses</Text>
                  {selectedLocation.bosses.map((boss, index) => (
                    <View key={index} style={styles.bossItem}>
                      <FontAwesome5 name="crown" size={16} color="#FFD700" />
                      <Text style={styles.bossName}>{boss}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedLocation.pointsOfInterest && selectedLocation.pointsOfInterest.length > 0 && (
                <View style={styles.poiSection}>
                  <Text style={styles.sectionTitle}>Points of Interest</Text>
                  {selectedLocation.pointsOfInterest.map((poi, index) => (
                    <View key={index} style={styles.poiItem}>
                      <Ionicons name="location" size={16} color="#A89968" />
                      <Text style={styles.poiName}>{poi}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={styles.travelButton}
                  onPress={() => {
                    toast.success(`Traveling to ${selectedLocation.name}!`);
                    setShowLocationDetails(false);
                  }}
                >
                  <Text style={styles.travelButtonText}>Travel Here</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.markButton}
                  onPress={() => {
                    toast.success(`Marked ${selectedLocation.name} on map!`);
                  }}
                >
                  <Text style={styles.markButtonText}>Mark on Map</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
                <Text style={styles.filterSectionTitle}>Location Type</Text>
                <View style={styles.typeFilterContainer}>
                  <TouchableOpacity
                    style={[styles.typeFilterButton, selectedType === 'all' && styles.activeTypeFilter]}
                    onPress={() => setSelectedType('all')}
                  >
                    <Text style={[styles.typeFilterText, selectedType === 'all' && styles.activeTypeFilterText]}>All</Text>
                  </TouchableOpacity>
                  {LOCATION_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeFilterButton, selectedType === type && styles.activeTypeFilter]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text style={[styles.typeFilterText, selectedType === type && styles.activeTypeFilterText]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.sortContainer}>
                  {(['name', 'type', 'region'] as const).map((sortOption) => (
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
      source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20world%20atlas%20with%20ancient%20maps%20and%20mysterious%20locations&aspect=9:16&seed=atlas' }}
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
          <Text style={styles.headerTitle}>WORLD LOCATIONS</Text>
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
              placeholder="Search locations..."
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
            <Text style={styles.statNumber}>{DISCOVERED_LOCATIONS.filter(l => l.discovered).length}</Text>
            <Text style={styles.statLabel}>Discovered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{DISCOVERED_LOCATIONS.filter(l => !l.discovered).length}</Text>
            <Text style={styles.statLabel}>Undiscovered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {DISCOVERED_LOCATIONS.reduce((sum, loc) => sum + (loc.subLocations?.length || 0), 0)}
            </Text>
            <Text style={styles.statLabel}>Sub-locations</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Locations ({filteredLocations.length})
          </Text>
          <FlatList
            data={filteredLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="map-marked-alt" size={48} color="#666" />
                <Text style={styles.emptyText}>No locations found</Text>
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
            onPress={() => navigation.navigate('WorldFastTravel')}
          >
            <Ionicons name="navigate" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Fast Travel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="bookmark" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Bookmarks</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderLocationDetailsModal()}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
  },
  subLocationIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  subLocationInfo: {
    flex: 1,
  },
  subLocationName: {
    color: '#A89968',
    fontSize: 14,
  },
  subLocationType: {
    color: '#666',
    fontSize: 12,
  },
  bossesSection: {
    marginBottom: 16,
  },
  bossItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bossName: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 8,
  },
  poiSection: {
    marginBottom: 16,
  },
  poiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  poiName: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
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
  typeFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeFilterButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  activeTypeFilter: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  typeFilterText: {
    color: '#A89968',
    fontSize: 12,
  },
  activeTypeFilterText: {
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