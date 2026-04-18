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

// Sample world bosses data
const WORLD_BOSSES = [
  {
    id: 'margit',
    name: 'Margit, the Fell Omen',
    region: 'Limgrave',
    location: 'Castle Morne Rampart',
    level: 18,
    health: 4600,
    defeated: true,
    lastDefeated: '2024-01-15',
    respawnTime: 24, // hours
    rewards: ['Talisman Pouch', 'Margit\'s Shackle', '5000 Runes'],
    description: 'A grotesque Omen killer who guards the entrance to Stormveil Castle.',
    weaknesses: ['Slash', 'Pierce'],
    resistances: ['Strike', 'Poison']
  },
  {
    id: 'godrick',
    name: 'Godrick the Grafted',
    region: 'Limgrave',
    location: 'Stormveil Castle',
    level: 35,
    health: 8500,
    defeated: false,
    respawnTime: 72,
    rewards: ['Godrick\'s Great Rune', 'Remembrance of the Grafted', '15000 Runes'],
    description: 'The shattered remnant of a demigod, driven by his obsession with grafting.',
    weaknesses: ['Fire', 'Bleed'],
    resistances: ['Physical', 'Holy']
  },
  {
    id: 'red_wolf',
    name: 'Red Wolf of Radagon',
    region: 'Liurnia',
    location: 'Raya Lucaria Academy',
    level: 45,
    health: 7200,
    defeated: false,
    respawnTime: 48,
    rewards: ['Remembrance of the Full Moon Queen', 'Lunar Queen\'s Crown', '12000 Runes'],
    description: 'A loyal servant of Queen Rennala, guardian of the academy.',
    weaknesses: ['Magic', 'Lightning'],
    resistances: ['Physical', 'Fire']
  },
  {
    id: 'magma_wyrm',
    name: 'Magma Wyrm Makar',
    region: 'Liurnia',
    location: 'Ruin-Strewn Precipice',
    level: 52,
    health: 9800,
    defeated: false,
    respawnTime: 96,
    rewards: ['Remembrance of the Naturalborn', 'Dragon Heart', '18000 Runes'],
    description: 'An ancient magma wyrm that guards the path to the Altus Plateau.',
    weaknesses: ['Lightning', 'Frost'],
    resistances: ['Fire', 'Physical']
  },
  {
    id: 'starscourge',
    name: 'Starscourge Radahn',
    region: 'Caelid',
    location: 'Redmane Castle',
    level: 65,
    health: 15200,
    defeated: false,
    respawnTime: 168, // 7 days
    rewards: ['Remembrance of the Starscourge', 'Radahn\'s Great Rune', '70000 Runes'],
    description: 'The mightiest demigod, whose gravitational powers defy the stars themselves.',
    weaknesses: ['Holy', 'Rot'],
    resistances: ['Physical', 'Magic']
  }
];

export default function WorldBossesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedBoss, setSelectedBoss] = useState<typeof WORLD_BOSSES[0] | null>(null);
  const [showBossDetails, setShowBossDetails] = useState(false);

  const selectBoss = (boss: typeof WORLD_BOSSES[0]) => {
    setSelectedBoss(boss);
    setShowBossDetails(true);
  };

  const getBossStatusColor = (defeated: boolean) => {
    return defeated ? '#4CAF50' : '#F44336';
  };

  const getBossStatusText = (boss: typeof WORLD_BOSSES[0]) => {
    if (boss.defeated) {
      return `Defeated (${boss.lastDefeated})`;
    }
    return 'Active';
  };

  const getTimeUntilRespawn = (boss: typeof WORLD_BOSSES[0]) => {
    if (!boss.defeated) return null;
    // In a real app, this would calculate actual time remaining
    return `${boss.respawnTime}h remaining`;
  };

  const renderBossItem = ({ item }: { item: typeof WORLD_BOSSES[0] }) => (
    <TouchableOpacity
      style={styles.bossItem}
      onPress={() => selectBoss(item)}
    >
      <View style={styles.bossHeader}>
        <View style={styles.bossIcon}>
          <FontAwesome5 name="dragon" size={24} color="#D4AF37" />
        </View>
        <View style={styles.bossInfo}>
          <Text style={styles.bossName}>{item.name}</Text>
          <Text style={styles.bossLocation}>{item.location} • {item.region}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getBossStatusColor(item.defeated) }]}>
          <Text style={styles.statusText}>{item.defeated ? 'Defeated' : 'Active'}</Text>
        </View>
      </View>

      <View style={styles.bossStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{item.level}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Health</Text>
          <Text style={styles.statValue}>{item.health.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Respawn</Text>
          <Text style={styles.statValue}>{item.respawnTime}h</Text>
        </View>
      </View>

      {item.defeated && (
        <View style={styles.respawnTimer}>
          <Ionicons name="time-outline" size={16} color="#FF9800" />
          <Text style={styles.respawnText}>{getTimeUntilRespawn(item)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderBossDetailsModal = () => {
    if (!selectedBoss) return null;

    return (
      <Modal
        visible={showBossDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBossDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Boss Details</Text>
              <TouchableOpacity onPress={() => setShowBossDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailsContent}>
              <View style={styles.bossDetailHeader}>
                <View style={styles.detailIcon}>
                  <FontAwesome5 name="dragon" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailName}>{selectedBoss.name}</Text>
                  <Text style={styles.detailLocation}>{selectedBoss.location}</Text>
                  <Text style={styles.detailRegion}>{selectedBoss.region}</Text>
                </View>
              </View>

              <Text style={styles.detailDescription}>{selectedBoss.description}</Text>

              <View style={styles.statsSection}>
                <View style={styles.statGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>Level</Text>
                    <Text style={styles.statBoxValue}>{selectedBoss.level}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>Health</Text>
                    <Text style={styles.statBoxValue}>{selectedBoss.health.toLocaleString()}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>Respawn</Text>
                    <Text style={styles.statBoxValue}>{selectedBoss.respawnTime}h</Text>
                  </View>
                </View>
              </View>

              <View style={styles.combatSection}>
                <Text style={styles.sectionTitle}>Combat Information</Text>

                <View style={styles.combatRow}>
                  <Text style={styles.combatLabel}>Weaknesses:</Text>
                  <View style={styles.weaknessContainer}>
                    {selectedBoss.weaknesses.map((weakness, index) => (
                      <View key={index} style={styles.weaknessBadge}>
                        <Text style={styles.weaknessText}>{weakness}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.combatRow}>
                  <Text style={styles.combatLabel}>Resistances:</Text>
                  <View style={styles.resistanceContainer}>
                    {selectedBoss.resistances.map((resistance, index) => (
                      <View key={index} style={styles.resistanceBadge}>
                        <Text style={styles.resistanceText}>{resistance}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.rewardsSection}>
                <Text style={styles.sectionTitle}>Rewards</Text>
                {selectedBoss.rewards.map((reward, index) => (
                  <Text key={index} style={styles.rewardText}>• {reward}</Text>
                ))}
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.sectionTitle}>Status</Text>
                <View style={styles.statusInfo}>
                  <Text style={[styles.statusValue, { color: getBossStatusColor(selectedBoss.defeated) }]}>
                    {getBossStatusText(selectedBoss)}
                  </Text>
                  {selectedBoss.defeated && (
                    <Text style={styles.respawnInfo}>
                      Respawns in: {getTimeUntilRespawn(selectedBoss)}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    navigation.navigate('WorldMap');
                    setShowBossDetails(false);
                  }}
                >
                  <Text style={styles.actionButtonText}>View Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, selectedBoss.defeated && styles.disabledButton]}
                  onPress={() => {
                    if (!selectedBoss.defeated) {
                      toast.success(`Challenging ${selectedBoss.name}!`);
                      setShowBossDetails(false);
                    }
                  }}
                  disabled={selectedBoss.defeated}
                >
                  <Text style={styles.actionButtonText}>
                    {selectedBoss.defeated ? 'Defeated' : 'Challenge'}
                  </Text>
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
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20fantasy%20boss%20arena%20with%20glowing%20bosses%20and%20combat%20effects&aspect=9:16&seed=worldbosses' }}
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
          <Text style={styles.headerTitle}>WORLD BOSSES</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Defeated</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Active</Text>
          </View>
        </View>

        <FlatList
          data={WORLD_BOSSES}
          renderItem={renderBossItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bossesList}
        />

        {renderBossDetailsModal()}
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  bossesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bossItem: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bossIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  bossInfo: {
    flex: 1,
  },
  bossName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 2,
  },
  bossLocation: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bossStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  respawnTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 5,
    padding: 5,
  },
  respawnText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 5,
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
  bossDetailHeader: {
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
  detailLocation: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  detailRegion: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  detailDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsSection: {
    marginBottom: 20,
  },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 2,
  },
  statBoxLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  statBoxValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  combatSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
  },
  combatRow: {
    marginBottom: 15,
  },
  combatLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  weaknessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weaknessBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 5,
  },
  weaknessText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: 'bold',
  },
  resistanceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resistanceBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 5,
  },
  resistanceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  rewardsSection: {
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 5,
    marginLeft: 10,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusInfo: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  respawnInfo: {
    fontSize: 14,
    color: '#FF9800',
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
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
});