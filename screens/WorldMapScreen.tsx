import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Map locations data
const MAP_LOCATIONS = [
  {
    id: 'limgrave',
    name: 'Limgrave',
    description: 'The starting area of the Lands Between, featuring lush fields and the ruins of a once-great civilization.',
    discovered: true,
    points: [
      { id: 'church_elleh', name: 'Church of Elleh', type: 'site_of_grace', x: 120, y: 180, discovered: true },
      { id: 'stormveil', name: 'Stormveil Castle', type: 'legacy_dungeon', x: 180, y: 100, discovered: true },
      { id: 'mistwood', name: 'Mistwood Ruins', type: 'ruins', x: 220, y: 220, discovered: true },
      { id: 'waypoint_ruins', name: 'Waypoint Ruins', type: 'dungeon', x: 150, y: 250, discovered: false },
    ]
  },
  {
    id: 'liurnia',
    name: 'Liurnia of the Lakes',
    description: 'A vast lake region dominated by the Academy of Raya Lucaria, home to sorcerers and scholars.',
    discovered: true,
    points: [
      { id: 'academy_gate', name: 'Academy Gate Town', type: 'site_of_grace', x: 280, y: 120, discovered: true },
      { id: 'raya_lucaria', name: 'Raya Lucaria Academy', type: 'legacy_dungeon', x: 320, y: 80, discovered: true },
      { id: 'caria_manor', name: 'Caria Manor', type: 'dungeon', x: 350, y: 40, discovered: false },
      { id: 'village_of_albinaurics', name: 'Village of Albinaurics', type: 'settlement', x: 260, y: 180, discovered: false },
    ]
  },
  {
    id: 'caelid',
    name: 'Caelid',
    description: 'A region corrupted by scarlet rot, featuring a crimson sky and twisted landscapes.',
    discovered: true,
    points: [
      { id: 'sellia', name: 'Sellia, Town of Sorcery', type: 'settlement', x: 420, y: 200, discovered: true },
      { id: 'redmane_castle', name: 'Redmane Castle', type: 'legacy_dungeon', x: 480, y: 240, discovered: false },
      { id: 'swamp_of_aeonia', name: 'Swamp of Aeonia', type: 'landmark', x: 400, y: 260, discovered: true },
      { id: 'dragonbarrow', name: 'Dragonbarrow', type: 'landmark', x: 460, y: 160, discovered: false },
    ]
  },
  {
    id: 'altus',
    name: 'Altus Plateau',
    description: 'A highland region featuring golden fields and the capital city of Leyndell.',
    discovered: false,
    points: [
      { id: 'leyndell', name: 'Leyndell, Royal Capital', type: 'legacy_dungeon', x: 380, y: 320, discovered: false },
      { id: 'mt_gelmir', name: 'Mt. Gelmir', type: 'landmark', x: 320, y: 360, discovered: false },
      { id: 'volcano_manor', name: 'Volcano Manor', type: 'legacy_dungeon', x: 300, y: 380, discovered: false },
      { id: 'shaded_castle', name: 'Shaded Castle', type: 'dungeon', x: 360, y: 400, discovered: false },
    ]
  },
  {
    id: 'mountaintops',
    name: 'Mountaintops of the Giants',
    description: 'A frigid, snow-covered region inhabited by the Fire Giants and other formidable foes.',
    discovered: false,
    points: [
      { id: 'zamor_ruins', name: 'Zamor Ruins', type: 'ruins', x: 500, y: 320, discovered: false },
      { id: 'giants_forge', name: 'Giant\'s Forge', type: 'landmark', x: 540, y: 360, discovered: false },
      { id: 'castle_sol', name: 'Castle Sol', type: 'dungeon', x: 480, y: 380, discovered: false },
      { id: 'freezing_lake', name: 'Freezing Lake', type: 'landmark', x: 520, y: 400, discovered: false },
    ]
  },
];

// Point of interest type icons
const POI_ICONS = {
  site_of_grace: 'flame',
  legacy_dungeon: 'business',
  dungeon: 'key',
  ruins: 'construct',
  settlement: 'home',
  landmark: 'flag',
};

export default function WorldMapScreen() {
  const navigation = useNavigation();
  const [selectedRegion, setSelectedRegion] = useState('limgrave');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [mapMode, setMapMode] = useState('regions'); // 'regions' or 'detailed'
  const mapScale = useRef(new Animated.Value(1)).current;
  const mapTranslateX = useRef(new Animated.Value(0)).current;
  const mapTranslateY = useRef(new Animated.Value(0)).current;
  
  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedPoint(null);
    
    if (mapMode === 'regions') {
      setMapMode('detailed');
      Animated.parallel([
        Animated.timing(mapScale, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(mapTranslateX, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(mapTranslateY, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  const handlePointSelect = (point) => {
    setSelectedPoint(point);
  };
  
  const handleBackToRegions = () => {
    setMapMode('regions');
    setSelectedPoint(null);
    
    Animated.parallel([
      Animated.timing(mapScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(mapTranslateX, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(mapTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handleFastTravel = () => {
    // In a real app, this would navigate to the location
    console.log(`Fast traveling to ${selectedPoint.name}`);
  };
  
  const renderRegionMarker = (region) => {
    const regionData = MAP_LOCATIONS.find(r => r.id === region.id);
    
    return (
      <TouchableOpacity
        key={region.id}
        style={[
          styles.regionMarker,
          { top: region.y, left: region.x },
          selectedRegion === region.id && styles.selectedRegionMarker,
          !regionData.discovered && styles.undiscoveredRegionMarker,
        ]}
        onPress={() => regionData.discovered && handleRegionSelect(region.id)}
        disabled={!regionData.discovered}
      >
        <Text style={[
          styles.regionMarkerText,
          !regionData.discovered && styles.undiscoveredRegionText,
        ]}>
          {regionData.discovered ? region.name : '???'}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderPointOfInterest = (point) => {
    return (
      <TouchableOpacity
        key={point.id}
        style={[
          styles.poiMarker,
          { top: point.y, left: point.x },
          selectedPoint?.id === point.id && styles.selectedPoiMarker,
          !point.discovered && styles.undiscoveredPoiMarker,
        ]}
        onPress={() => point.discovered && handlePointSelect(point)}
        disabled={!point.discovered}
      >
        <View style={styles.poiIconContainer}>
          <Ionicons 
            name={point.discovered ? POI_ICONS[point.type] : 'help'} 
            size={16} 
            color={point.discovered ? '#D4AF37' : '#6e6e6e'} 
          />
        </View>
        {point.discovered && (
          <Text style={styles.poiName}>{point.name}</Text>
        )}
      </TouchableOpacity>
    );
  };
  
  const selectedRegionData = MAP_LOCATIONS.find(r => r.id === selectedRegion);
  
  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#1a1a2e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
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
        
        <View style={styles.mapContainer}>
          <Animated.View 
            style={[
              styles.mapContent,
              { 
                transform: [
                  { scale: mapScale },
                  { translateX: mapTranslateX },
                  { translateY: mapTranslateY },
                ] 
              }
            ]}
          >
            <Image 
              source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20world%20map%20with%20mountains%20and%20forests&aspect=1:1&seed=worldmap' }}
              style={styles.mapImage}
            />
            
            {mapMode === 'regions' && (
              <>
                {MAP_LOCATIONS.map(region => (
                  renderRegionMarker({
                    id: region.id,
                    name: region.name,
                    x: region.points[0].x - 20,
                    y: region.points[0].y - 20,
                  })
                ))}
              </>
            )}
            
            {mapMode === 'detailed' && selectedRegionData && (
              <>
                {selectedRegionData.points.map(point => renderPointOfInterest(point))}
              </>
            )}
          </Animated.View>
          
          {mapMode === 'detailed' && (
            <TouchableOpacity 
              style={styles.backToRegionsButton}
              onPress={handleBackToRegions}
            >
              <Ionicons name="globe-outline" size={20} color="#FFFFFF" />
              <Text style={styles.backToRegionsText}>World View</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.mapLegend}>
            <Text style={styles.mapLegendTitle}>Legend</Text>
            <View style={styles.mapLegendItem}>
              <View style={[styles.legendIcon, { backgroundColor: '#D4AF37' }]}>
                <Ionicons name="flame" size={12} color="#1a1a2e" />
              </View>
              <Text style={styles.legendText}>Site of Grace</Text>
            </View>
            <View style={styles.mapLegendItem}>
              <View style={[styles.legendIcon, { backgroundColor: '#D4AF37' }]}>
                <Ionicons name="business" size={12} color="#1a1a2e" />
              </View>
              <Text style={styles.legendText}>Legacy Dungeon</Text>
            </View>
            <View style={styles.mapLegendItem}>
              <View style={[styles.legendIcon, { backgroundColor: '#D4AF37' }]}>
                <Ionicons name="key" size={12} color="#1a1a2e" />
              </View>
              <Text style={styles.legendText}>Dungeon</Text>
            </View>
            <View style={styles.mapLegendItem}>
              <View style={[styles.legendIcon, { backgroundColor: '#6e6e6e' }]}>
                <Ionicons name="help" size={12} color="#1a1a2e" />
              </View>
              <Text style={styles.legendText}>Undiscovered</Text>
            </View>
          </View>
        </View>
        
        {selectedPoint && (
          <View style={styles.locationInfoContainer}>
            <View style={styles.locationInfoHeader}>
              <View style={styles.locationTitleContainer}>
                <Ionicons name={POI_ICONS[selectedPoint.type]} size={24} color="#D4AF37" />
                <Text style={styles.locationTitle}>{selectedPoint.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedPoint(null)}>
                <Ionicons name="close-circle" size={24} color="#A89968" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.locationInfoContent}>
              <Text style={styles.locationType}>{selectedPoint.type.replace('_', ' ').toUpperCase()}</Text>
              <Text style={styles.locationDescription}>
                {selectedPoint.id === 'church_elleh' && 'A small church where Merchant Kalé resides. A good place to rest and prepare for the journey ahead.'}
                {selectedPoint.id === 'stormveil' && 'A massive castle that serves as the legacy dungeon of Limgrave. Home to Godrick the Grafted, one of the demigod bosses.'}
                {selectedPoint.id === 'mistwood' && 'Ancient ruins within the Mistwood forest. Beware of the bear that roams these parts.'}
                {selectedPoint.id === 'academy_gate' && 'A small settlement outside the gates of Raya Lucaria Academy. Now overrun with enemies.'}
                {selectedPoint.id === 'raya_lucaria' && 'A grand academy where sorcerers study the secrets of glintstone magic. Currently sealed off to outsiders.'}
                {selectedPoint.id === 'sellia' && 'A town dedicated to the study of sorcery, now afflicted by the scarlet rot that plagues Caelid.'}
                {selectedPoint.id === 'swamp_of_aeonia' && 'A vast swamp of scarlet rot, said to be where Malenia and Radahn fought during the Shattering.'}
              </Text>
              
              <View style={styles.locationStats}>
                <View style={styles.locationStatItem}>
                  <Text style={styles.locationStatLabel}>LEVEL RANGE</Text>
                  <Text style={styles.locationStatValue}>
                    {selectedPoint.id === 'church_elleh' && '1-10'}
                    {selectedPoint.id === 'stormveil' && '20-40'}
                    {selectedPoint.id === 'mistwood' && '15-25'}
                    {selectedPoint.id === 'academy_gate' && '30-40'}
                    {selectedPoint.id === 'raya_lucaria' && '40-60'}
                    {selectedPoint.id === 'sellia' && '60-70'}
                    {selectedPoint.id === 'swamp_of_aeonia' && '70-80'}
                  </Text>
                </View>
                <View style={styles.locationStatItem}>
                  <Text style={styles.locationStatLabel}>DANGER</Text>
                  <Text style={styles.locationStatValue}>
                    {selectedPoint.id === 'church_elleh' && 'Low'}
                    {selectedPoint.id === 'stormveil' && 'High'}
                    {selectedPoint.id === 'mistwood' && 'Medium'}
                    {selectedPoint.id === 'academy_gate' && 'Medium'}
                    {selectedPoint.id === 'raya_lucaria' && 'High'}
                    {selectedPoint.id === 'sellia' && 'High'}
                    {selectedPoint.id === 'swamp_of_aeonia' && 'Extreme'}
                  </Text>
                </View>
                <View style={styles.locationStatItem}>
                  <Text style={styles.locationStatLabel}>REWARDS</Text>
                  <Text style={styles.locationStatValue}>
                    {selectedPoint.id === 'church_elleh' && 'Low'}
                    {selectedPoint.id === 'stormveil' && 'High'}
                    {selectedPoint.id === 'mistwood' && 'Medium'}
                    {selectedPoint.id === 'academy_gate' && 'Medium'}
                    {selectedPoint.id === 'raya_lucaria' && 'High'}
                    {selectedPoint.id === 'sellia' && 'High'}
                    {selectedPoint.id === 'swamp_of_aeonia' && 'Very High'}
                  </Text>
                </View>
              </View>
              
              {selectedPoint.type === 'site_of_grace' && (
                <TouchableOpacity 
                  style={styles.fastTravelButton}
                  onPress={handleFastTravel}
                >
                  <Ionicons name="navigate" size={20} color="#FFFFFF" />
                  <Text style={styles.fastTravelText}>Fast Travel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        {!selectedPoint && (
          <View style={styles.regionInfoContainer}>
            <Text style={styles.regionTitle}>{selectedRegionData.name}</Text>
            <Text style={styles.regionDescription}>{selectedRegionData.description}</Text>
            
            <View style={styles.discoveryProgress}>
              <Text style={styles.discoveryText}>Discovery Progress</Text>
              <View style={styles.discoveryBar}>
                <View 
                  style={[
                    styles.discoveryFill, 
                    { 
                      width: `${(selectedRegionData.points.filter(p => p.discovered).length / selectedRegionData.points.length) * 100}%` 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.discoveryPercentage}>
                {Math.round((selectedRegionData.points.filter(p => p.discovered).length / selectedRegionData.points.length) * 100)}%
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  menuButton: {
    padding: 8,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapContent: {
    width: '100%',
    height: '100%',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  regionMarker: {
    position: 'absolute',
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    borderColor: '#D4AF37',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedRegionMarker: {
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
  },
  undiscoveredRegionMarker: {
    backgroundColor: 'rgba(110, 110, 110, 0.3)',
    borderColor: '#6e6e6e',
  },
  regionMarkerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  undiscoveredRegionText: {
    color: '#6e6e6e',
  },
  poiMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  selectedPoiMarker: {
    zIndex: 10,
  },
  undiscoveredPoiMarker: {
    opacity: 0.6,
  },
  poiIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poiName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 100,
  },
  backToRegionsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToRegionsText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 8,
    padding: 12,
  },
  mapLegendTitle: {
    color: '#D4AF37',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  legendText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  locationInfoContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
    padding: 16,
    maxHeight: '40%',
  },
  locationInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginLeft: 12,
  },
  locationInfoContent: {
    paddingBottom: 16,
  },
  locationType: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
  },
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  locationStatLabel: {
    fontSize: 12,
    color: '#A89968',
    marginBottom: 4,
  },
  locationStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fastTravelButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fastTravelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  regionInfoContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
    padding: 16,
  },
  regionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  regionDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
  },
  discoveryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  discoveryText: {
    fontSize: 14,
    color: '#A89968',
    marginRight: 12,
  },
  discoveryBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  discoveryFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
  },
  discoveryPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    width: 40,
    textAlign: 'right',
  },
});