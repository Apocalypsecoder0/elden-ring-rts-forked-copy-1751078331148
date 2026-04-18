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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { PlayerStats } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample player data
const PLAYER_DATA = {
  level: 42,
  experience: 12540,
  experienceToNextLevel: 15000,
  attributePoints: 3,
  skillPoints: 2,
  stats: {
    vigor: 15,
    mind: 22,
    endurance: 12,
    strength: 10,
    dexterity: 14,
    intelligence: 25,
    faith: 7,
    arcane: 9,
  } as PlayerStats,
  runes: 24680,
};

// Stat information
const STAT_INFO: Record<keyof PlayerStats, { name: string; description: string; icon: string; color: string; maxLevel: number }> = {
  vigor: {
    name: 'Vigor',
    description: 'Determines maximum HP. Higher Vigor means more health.',
    icon: 'heart',
    color: '#c02d28',
    maxLevel: 99,
  },
  mind: {
    name: 'Mind',
    description: 'Determines maximum FP. Higher Mind means more mana.',
    icon: 'water',
    color: '#2846c0',
    maxLevel: 99,
  },
  endurance: {
    name: 'Endurance',
    description: 'Determines maximum stamina and equip load.',
    icon: 'battery-full',
    color: '#28c04c',
    maxLevel: 99,
  },
  strength: {
    name: 'Strength',
    description: 'Required for heavy weapons. Increases physical attack power.',
    icon: 'fitness',
    color: '#8B4513',
    maxLevel: 99,
  },
  dexterity: {
    name: 'Dexterity',
    description: 'Required for advanced weapons. Increases attack speed.',
    icon: 'hand-left',
    color: '#DAA520',
    maxLevel: 99,
  },
  intelligence: {
    name: 'Intelligence',
    description: 'Required for sorceries. Increases magic damage.',
    icon: 'school',
    color: '#4169E1',
    maxLevel: 99,
  },
  faith: {
    name: 'Faith',
    description: 'Required for incantations. Increases holy damage.',
    icon: 'star',
    color: '#FFD700',
    maxLevel: 99,
  },
  arcane: {
    name: 'Arcane',
    description: 'Affects discovery rate and certain spells.',
    icon: 'eye',
    color: '#9370DB',
    maxLevel: 99,
  },
};

// Experience requirements for levels
const getExperienceForLevel = (level: number) => {
  return Math.floor(1000 * Math.pow(1.2, level - 1));
};

export default function CharacterLevelingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedStat, setSelectedStat] = useState<keyof PlayerStats | null>(null);
  const [showStatDetails, setShowStatDetails] = useState(false);
  const [pendingPoints, setPendingPoints] = useState<Partial<Record<keyof PlayerStats, number>>>({});

  const experienceProgress = (PLAYER_DATA.experience / PLAYER_DATA.experienceToNextLevel) * 100;

  const canLevelUp = () => {
    return PLAYER_DATA.experience >= PLAYER_DATA.experienceToNextLevel;
  };

  const getPendingValues = () =>
    Object.values(pendingPoints).filter((value): value is number => typeof value === 'number');

  const levelUp = () => {
    if (!canLevelUp()) return;

    // In a real game, this would update the player data
    toast.success('Leveled up! +1 Attribute Point, +1 Skill Point');
  };

  const addStatPoint = (stat: keyof PlayerStats) => {
    if (PLAYER_DATA.attributePoints <= 0) {
      toast.error('No attribute points available');
      return;
    }

    const currentValue = PLAYER_DATA.stats[stat];
    if (currentValue >= STAT_INFO[stat].maxLevel) {
      toast.error(`${STAT_INFO[stat].name} is already at maximum level`);
      return;
    }

    setPendingPoints({
      ...pendingPoints,
      [stat]: (pendingPoints[stat] || 0) + 1,
    });
  };

  const removeStatPoint = (stat: keyof PlayerStats) => {
    if (!pendingPoints[stat] || pendingPoints[stat]! <= 0) return;

    setPendingPoints({
      ...pendingPoints,
      [stat]: pendingPoints[stat]! - 1,
    });
  };

  const confirmStatChanges = () => {
    const totalPending = getPendingValues().reduce((sum, points) => sum + points, 0);

    if (totalPending === 0) {
      toast.error('No changes to confirm');
      return;
    }

    if (totalPending > PLAYER_DATA.attributePoints) {
      toast.error('Not enough attribute points');
      return;
    }

    // In a real game, this would update the player stats
    toast.success('Attribute points applied successfully!');
    setPendingPoints({});
  };

  const resetPendingPoints = () => {
    setPendingPoints({});
  };

  const renderStatItem = (statKey: keyof PlayerStats) => {
    const stat = STAT_INFO[statKey];
    const currentValue = PLAYER_DATA.stats[statKey];
    const pendingValue = pendingPoints[statKey] || 0;
    const totalValue = currentValue + pendingValue;

    return (
      <TouchableOpacity
        key={statKey}
        style={styles.statItem}
        onPress={() => {
          setSelectedStat(statKey);
          setShowStatDetails(true);
        }}
      >
        <View style={styles.statHeader}>
          <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
            <Ionicons name={stat.icon as any} size={20} color={stat.color} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statName}>{stat.name}</Text>
            <Text style={styles.statValue}>
              {currentValue}
              {pendingValue > 0 && (
                <Text style={styles.pendingValue}> +{pendingValue} = {totalValue}</Text>
              )}
            </Text>
          </View>
        </View>

        <View style={styles.statControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => removeStatPoint(statKey)}
            disabled={!pendingValue || pendingValue <= 0}
          >
            <Ionicons name="remove" size={16} color={pendingValue > 0 ? "#c02d28" : "#666"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => addStatPoint(statKey)}
            disabled={PLAYER_DATA.attributePoints <= 0 || totalValue >= stat.maxLevel}
          >
            <Ionicons name="add" size={16} color={PLAYER_DATA.attributePoints > 0 && totalValue < stat.maxLevel ? "#4CAF50" : "#666"} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatDetailsModal = () => {
    if (!selectedStat) return null;

    const stat = STAT_INFO[selectedStat as keyof typeof STAT_INFO];
    const currentValue = PLAYER_DATA.stats[selectedStat as keyof PlayerStats];
    const pendingValue = pendingPoints[selectedStat as keyof PlayerStats] || 0;

    return (
      <Modal
        visible={showStatDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.statDetailsContainer}>
            <View style={styles.statDetailsHeader}>
              <Text style={styles.statDetailsTitle}>Attribute Details</Text>
              <TouchableOpacity onPress={() => setShowStatDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.statDetailsContent}>
              <View style={styles.statDetailHeader}>
                <View style={[styles.detailStatIconContainer, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={48} color={stat.color} />
                </View>
                <View style={styles.detailStatInfo}>
                  <Text style={styles.detailStatName}>{stat.name}</Text>
                  <Text style={styles.detailStatValue}>
                    Current: {currentValue}
                    {pendingValue > 0 && ` (+${pendingValue} = ${currentValue + pendingValue})`}
                  </Text>
                  <Text style={styles.detailStatMax}>Maximum: {stat.maxLevel}</Text>
                </View>
              </View>

              <Text style={styles.statDescription}>{stat.description}</Text>

              <View style={styles.statEffects}>
                <Text style={styles.sectionTitle}>Effects</Text>
                {selectedStat === 'vigor' && (
                  <Text style={styles.effectText}>• HP: {currentValue * 10} → {(currentValue + pendingValue) * 10}</Text>
                )}
                {selectedStat === 'mind' && (
                  <Text style={styles.effectText}>• FP: {currentValue * 5} → {(currentValue + pendingValue) * 5}</Text>
                )}
                {selectedStat === 'endurance' && (
                  <>
                    <Text style={styles.effectText}>• Stamina: {100 + currentValue * 5} → {100 + (currentValue + pendingValue) * 5}</Text>
                    <Text style={styles.effectText}>• Equip Load: {65.4 + currentValue * 2} → {65.4 + (currentValue + pendingValue) * 2}</Text>
                  </>
                )}
                {selectedStat === 'strength' && (
                  <Text style={styles.effectText}>• Physical Attack: +{currentValue * 2}% → +{(currentValue + pendingValue) * 2}%</Text>
                )}
                {selectedStat === 'dexterity' && (
                  <Text style={styles.effectText}>• Attack Speed: +{currentValue}% → +{currentValue + pendingValue}%</Text>
                )}
                {selectedStat === 'intelligence' && (
                  <Text style={styles.effectText}>• Magic Damage: +{currentValue * 1.5}% → +{(currentValue + pendingValue) * 1.5}%</Text>
                )}
                {selectedStat === 'faith' && (
                  <Text style={styles.effectText}>• Holy Damage: +{currentValue * 1.5}% → +{(currentValue + pendingValue) * 1.5}%</Text>
                )}
                {selectedStat === 'arcane' && (
                  <Text style={styles.effectText}>• Item Discovery: +{currentValue}% → +{currentValue + pendingValue}%</Text>
                )}
              </View>

              <View style={styles.statActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => addStatPoint(selectedStat)}
                  disabled={PLAYER_DATA.attributePoints <= 0 || (currentValue + pendingValue) >= stat.maxLevel}
                >
                  <Text style={styles.actionButtonText}>Add Point</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => removeStatPoint(selectedStat)}
                  disabled={!pendingValue || pendingValue <= 0}
                >
                  <Text style={styles.actionButtonText}>Remove Point</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const totalPendingPoints = getPendingValues().reduce((sum, points) => sum + points, 0);

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20character%20leveling%20chamber%20with%20glowing%20runes&aspect=9:16&seed=leveling' }}
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
          <Text style={styles.headerTitle}>LEVELING & PROGRESSION</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.levelInfo}>
          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>LEVEL</Text>
            <Text style={styles.levelValue}>{PLAYER_DATA.level}</Text>
            {canLevelUp() && (
              <View style={styles.levelUpIndicator}>
                <Ionicons name="arrow-up" size={16} color="#4CAF50" />
              </View>
            )}
          </View>

          <View style={styles.experienceContainer}>
            <Text style={styles.experienceText}>
              {PLAYER_DATA.experience} / {PLAYER_DATA.experienceToNextLevel} XP
            </Text>
            <View style={styles.experienceBar}>
              <View style={[styles.experienceFill, { width: `${experienceProgress}%` }]} />
            </View>
          </View>

          {canLevelUp() && (
            <TouchableOpacity style={styles.levelUpButton} onPress={levelUp}>
              <Text style={styles.levelUpButtonText}>LEVEL UP</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.pointsContainer}>
          <View style={styles.pointsItem}>
            <Text style={styles.pointsValue}>{PLAYER_DATA.attributePoints - totalPendingPoints}</Text>
            <Text style={styles.pointsLabel}>Attribute Points</Text>
          </View>
          <View style={styles.pointsItem}>
            <Text style={styles.pointsValue}>{PLAYER_DATA.skillPoints}</Text>
            <Text style={styles.pointsLabel}>Skill Points</Text>
          </View>
          <View style={styles.pointsItem}>
            <FontAwesome5 name="coins" size={16} color="#D4AF37" />
            <Text style={styles.runesText}>{PLAYER_DATA.runes.toLocaleString()}</Text>
            <Text style={styles.pointsLabel}>Runes</Text>
          </View>
        </View>

        <ScrollView style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Core Attributes</Text>
          {(Object.keys(STAT_INFO) as Array<keyof PlayerStats>).map(renderStatItem)}

          {totalPendingPoints > 0 && (
            <View style={styles.pendingChanges}>
              <Text style={styles.pendingTitle}>Pending Changes ({totalPendingPoints} points)</Text>
              <View style={styles.pendingActions}>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmStatChanges}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={resetPendingPoints}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="school" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Stat Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="calculator" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="stats-chart" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Compare</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderStatDetailsModal()}
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
  levelInfo: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  levelLabel: {
    color: '#A89968',
    fontSize: 14,
    marginRight: 8,
  },
  levelValue: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelUpIndicator: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceContainer: {
    marginBottom: 12,
  },
  experienceText: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 4,
  },
  experienceBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  experienceFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  levelUpButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  levelUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  pointsItem: {
    alignItems: 'center',
  },
  pointsValue: {
    color: '#D4AF37',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsLabel: {
    color: '#A89968',
    fontSize: 10,
    marginTop: 2,
  },
  runesText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  statsContainer: {
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
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  statValue: {
    color: '#A89968',
    fontSize: 14,
  },
  pendingValue: {
    color: '#4CAF50',
  },
  statControls: {
    flexDirection: 'row',
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  pendingChanges: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  pendingTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pendingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#c02d28',
    borderRadius: 6,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
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
  statDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  statDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  statDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  statDetailsContent: {
    flex: 1,
  },
  statDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailStatIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailStatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailStatName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailStatValue: {
    color: '#A89968',
    fontSize: 16,
    marginBottom: 2,
  },
  detailStatMax: {
    color: '#666',
    fontSize: 12,
  },
  statDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statEffects: {
    marginBottom: 16,
  },
  effectText: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  statActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});