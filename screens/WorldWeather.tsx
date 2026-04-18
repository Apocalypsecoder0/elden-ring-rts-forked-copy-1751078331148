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

// Sample weather and time data
const WEATHER_CONDITIONS = [
  {
    id: 'clear',
    name: 'Clear Skies',
    icon: 'sunny',
    timeOfDay: 'Day',
    duration: '4 hours',
    effects: [
      'Increased visibility',
      'Normal enemy spawn rates',
      'No movement penalties',
      'Optimal exploration conditions'
    ],
    regions: ['Limgrave', 'Liurnia', 'Altus Plateau'],
    current: true
  },
  {
    id: 'storm',
    name: 'Thunder Storm',
    icon: 'thunderstorm',
    timeOfDay: 'Night',
    duration: '2 hours',
    effects: [
      'Reduced visibility (-20%)',
      'Lightning strikes damage random areas',
      'Increased enemy aggression',
      'Storm spirits appear'
    ],
    regions: ['Mountaintops of the Giants', 'Consecrated Snowfield'],
    current: false
  },
  {
    id: 'fog',
    name: 'Eternal Fog',
    icon: 'cloudy',
    timeOfDay: 'Dawn',
    duration: '6 hours',
    effects: [
      'Severely reduced visibility (-50%)',
      'Hidden paths revealed',
      'Ghost enemies spawn',
      'Muffled sounds'
    ],
    regions: ['Liurnia of the Lakes', 'Caelid'],
    current: false
  },
  {
    id: 'blood-rain',
    name: 'Blood Rain',
    icon: 'rainy',
    timeOfDay: 'Dusk',
    duration: '3 hours',
    effects: [
      'Bleed buildup on all entities',
      'Blood loss over time',
      'Crimson tears spawn',
      'Altered enemy behavior'
    ],
    regions: ['Caelid', 'Dragonbarrow'],
    current: false
  },
  {
    id: 'snow',
    name: 'Blizzard',
    icon: 'snow',
    timeOfDay: 'Night',
    duration: '8 hours',
    effects: [
      'Freezing damage over time',
      'Reduced movement speed (-30%)',
      'Avalanche risks',
      'Frost enemies empowered'
    ],
    regions: ['Mountaintops of the Giants', 'Consecrated Snowfield'],
    current: false
  }
];

const TIME_CYCLES = [
  { name: 'Dawn', icon: 'sunrise', duration: '1 hour', effects: 'Peaceful, low enemy activity' },
  { name: 'Day', icon: 'sunny', duration: '6 hours', effects: 'Normal activity, clear visibility' },
  { name: 'Dusk', icon: 'sunset', duration: '1 hour', effects: 'Increased enemy spawns, golden light' },
  { name: 'Night', icon: 'moon', duration: '6 hours', effects: 'High enemy activity, reduced visibility' }
];

const WorldWeather: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedWeather, setSelectedWeather] = useState<typeof WEATHER_CONDITIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeAccelerated, setTimeAccelerated] = useState(false);

  const handleWeatherPress = (weather: typeof WEATHER_CONDITIONS[0]) => {
    setSelectedWeather(weather);
    setModalVisible(true);
  };

  const handleTimeAcceleration = () => {
    setTimeAccelerated(!timeAccelerated);
    toast.success(timeAccelerated ? 'Time acceleration disabled' : 'Time acceleration enabled');
  };

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sunny': return 'sunny';
      case 'thunderstorm': return 'thunderstorm';
      case 'cloudy': return 'cloudy';
      case 'rainy': return 'rainy';
      case 'snow': return 'snow';
      default: return 'partly-sunny';
    }
  };

  const renderWeatherItem = ({ item }: { item: typeof WEATHER_CONDITIONS[0] }) => (
    <TouchableOpacity
      style={[styles.weatherCard, item.current && styles.currentWeatherCard]}
      onPress={() => handleWeatherPress(item)}
    >
      <LinearGradient
        colors={item.current
          ? ['rgba(255, 215, 0, 0.3)', 'rgba(255, 140, 0, 0.2)']
          : ['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']
        }
        style={styles.weatherCardGradient}
      >
        <View style={styles.weatherHeader}>
          <View style={styles.weatherIconContainer}>
            <Ionicons name={getWeatherIcon(item.icon)} size={32} color={item.current ? "#FFD700" : "#FFFFFF"} />
          </View>
          <View style={styles.weatherInfo}>
            <Text style={[styles.weatherName, item.current && styles.currentWeatherText]}>
              {item.name}
            </Text>
            <Text style={styles.weatherTime}>
              {item.timeOfDay} • {item.duration}
            </Text>
          </View>
          {item.current && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>CURRENT</Text>
            </View>
          )}
        </View>

        <Text style={styles.weatherRegions}>
          Regions: {item.regions.join(', ')}
        </Text>

        <View style={styles.weatherEffects}>
          <Text style={styles.effectsTitle}>Effects:</Text>
          {item.effects.slice(0, 2).map((effect, index) => (
            <Text key={index} style={styles.effectText} numberOfLines={1}>
              • {effect}
            </Text>
          ))}
          {item.effects.length > 2 && (
            <Text style={styles.moreEffects}>+{item.effects.length - 2} more...</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTimeCycle = ({ item }: { item: typeof TIME_CYCLES[0] }) => (
    <View style={styles.timeCycleCard}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.timeCycleGradient}
      >
        <View style={styles.timeCycleIcon}>
          <Ionicons name={item.icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.timeCycleName}>{item.name}</Text>
        <Text style={styles.timeCycleDuration}>{item.duration}</Text>
        <Text style={styles.timeCycleEffects} numberOfLines={2}>
          {item.effects}
        </Text>
      </LinearGradient>
    </View>
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
          <Text style={styles.title}>WEATHER & TIME</Text>
          <TouchableOpacity
            style={[styles.timeButton, timeAccelerated && styles.timeButtonActive]}
            onPress={handleTimeAcceleration}
          >
            <Ionicons name="time" size={20} color={timeAccelerated ? "#1A1A2E" : "#FFD700"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Conditions</Text>
            <FlatList
              data={WEATHER_CONDITIONS.filter(w => w.current)}
              renderItem={renderWeatherItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.weatherList}
            />
          </View>

          {/* Time Cycles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time Cycles</Text>
            <FlatList
              data={TIME_CYCLES}
              renderItem={renderTimeCycle}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeList}
            />
          </View>

          {/* Upcoming Weather */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Weather</Text>
            <FlatList
              data={WEATHER_CONDITIONS.filter(w => !w.current)}
              renderItem={renderWeatherItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.upcomingWeatherList}
            />
          </View>
        </ScrollView>

        {/* Weather Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedWeather && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedWeather.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.weatherDetailSection}>
                      <Text style={styles.sectionTitle}>Weather Details</Text>
                      <Text style={styles.weatherDetailText}>
                        <Text style={styles.detailLabel}>Time of Day:</Text> {selectedWeather.timeOfDay}
                      </Text>
                      <Text style={styles.weatherDetailText}>
                        <Text style={styles.detailLabel}>Duration:</Text> {selectedWeather.duration}
                      </Text>
                      <Text style={styles.weatherDetailText}>
                        <Text style={styles.detailLabel}>Status:</Text> {selectedWeather.current ? 'Active' : 'Upcoming'}
                      </Text>
                    </View>

                    <View style={styles.weatherDetailSection}>
                      <Text style={styles.sectionTitle}>Affected Regions</Text>
                      {selectedWeather.regions.map((region, index) => (
                        <Text key={index} style={styles.regionText}>
                          • {region}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.weatherDetailSection}>
                      <Text style={styles.sectionTitle}>Weather Effects</Text>
                      {selectedWeather.effects.map((effect, index) => (
                        <Text key={index} style={styles.effectDetailText}>
                          • {effect}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.weatherDetailSection}>
                      <Text style={styles.sectionTitle}>Strategic Considerations</Text>
                      <Text style={styles.strategicText}>
                        {selectedWeather.name} significantly impacts gameplay. Plan your activities accordingly to maximize advantages and minimize risks.
                      </Text>
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.closeModalButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeModalButtonText}>Close</Text>
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
  timeButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  timeButtonActive: {
    backgroundColor: '#FFD700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  weatherList: {
    paddingVertical: 10,
  },
  weatherCard: {
    width: 280,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  currentWeatherCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  weatherCardGradient: {
    padding: 15,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  currentWeatherText: {
    color: '#FFD700',
  },
  weatherTime: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  currentBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  weatherRegions: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  weatherEffects: {
    flex: 1,
  },
  effectsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  effectText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  moreEffects: {
    fontSize: 12,
    color: '#AAAAAA',
    fontStyle: 'italic',
  },
  timeList: {
    paddingVertical: 10,
  },
  timeCycleCard: {
    width: 120,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  timeCycleGradient: {
    padding: 15,
    alignItems: 'center',
  },
  timeCycleIcon: {
    marginBottom: 8,
  },
  timeCycleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  timeCycleDuration: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 8,
  },
  timeCycleEffects: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 16,
  },
  upcomingWeatherList: {
    paddingBottom: 50,
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
  weatherDetailSection: {
    marginBottom: 20,
  },
  weatherDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  regionText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 3,
  },
  effectDetailText: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 3,
  },
  strategicText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  closeModalButton: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default WorldWeather;