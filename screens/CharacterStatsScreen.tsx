import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground,
  Modal,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { CharacterClass, CharacterRace, CharacterSubclass } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample player data
const PLAYER_STATS = {
  vigor: 15,
  mind: 22,
  endurance: 12,
  strength: 10,
  dexterity: 14,
  intelligence: 25,
  faith: 7,
  arcane: 9,
};

// Stat descriptions
const STAT_DESCRIPTIONS = {
  vigor: 'Affects maximum health and physical defense.',
  mind: 'Affects maximum mana (FP) and magic defense.',
  endurance: 'Affects maximum stamina, equip load, and robustness.',
  strength: 'Required for heavy weapons and increases physical attack power.',
  dexterity: 'Required for advanced weapons and increases attack speed.',
  intelligence: 'Required for sorceries and increases magic damage.',
  faith: 'Required for incantations and increases holy damage.',
  arcane: 'Affects discovery rate, certain spells, and status effects.',
};

// Derived stats
const DERIVED_STATS = {
  health: 450,
  mana: 320,
  stamina: 180,
  equipLoad: 45.6,
  maxEquipLoad: 60.0,
  physicalDefense: 120,
  magicDefense: 85,
  fireDefense: 75,
  lightningDefense: 60,
  holyDefense: 40,
  poise: 35,
  discovery: 110,
};

// Level up costs
const calculateRuneCost = (level: number): number => {
  return Math.floor(level * level * 100 + level * 50);
};

export default function CharacterStatsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showStatInfo, setShowStatInfo] = useState<string | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [statToLevel, setStatToLevel] = useState<string | null>(null);
  const [playerLevel, setPlayerLevel] = useState(25);
  const [availablePoints, setAvailablePoints] = useState(3);
  const [tempStats, setTempStats] = useState({...PLAYER_STATS});
  
  // Handle back navigation
  const handleBack = () => {
    navigation.navigate('Home');
  };
  
  // Show stat information
  const handleStatPress = (stat: string) => {
    setShowStatInfo(stat);
  };
  
  // Close stat information modal
  const handleCloseStatInfo = () => {
    setShowStatInfo(null);
  };
  
  // Open level up modal
  const handleOpenLevelUp = () => {
    setTempStats({...PLAYER_STATS});
    setShowLevelUpModal(true);
  };
  
  // Close level up modal
  const handleCloseLevelUp = () => {
    setShowLevelUpModal(false);
    setStatToLevel(null);
  };
  
  // Increase stat in level up modal
  const handleIncreaseStat = (stat: string) => {
    if (availablePoints <= 0) {
      toast.error('No attribute points available');
      return;
    }
    
    setTempStats(prev => ({
      ...prev,
      [stat]: prev[stat as keyof typeof prev] + 1
    }));
    
    setAvailablePoints(prev => prev - 1);
  };
  
  // Decrease stat in level up modal
  const handleDecreaseStat = (stat: string) => {
    const originalValue = PLAYER_STATS[stat as keyof typeof PLAYER_STATS];
    const currentValue = tempStats[stat as keyof typeof tempStats];
    
    if (currentValue <= originalValue) {
      toast.error('Cannot decrease below original value');
      return;
    }
    
    setTempStats(prev => ({
      ...prev,
      [stat]: prev[stat as keyof typeof prev] - 1
    }));
    
    setAvailablePoints(prev => prev + 1);
  };
  
  // Confirm level up
  const handleConfirmLevelUp = () => {
    // In a real app, this would update the player's stats in the game state
    toast.success('Attributes updated successfully');
    setShowLevelUpModal(false);
    
    // Simulate updating the player's stats
    // In a real app, this would be handled by the game state
    if (availablePoints < 3) {
      setPlayerLevel(prev => prev + (3 - availablePoints));
    }
  };
  
  // Render stat bar
  const renderStatBar = (stat: string, value: number, max: number = 99) => {
    const percentage = (value / max) * 100;
    
    return (
      <View style={styles.statBarContainer}>
        <View style={styles.statBarBackground}>
          <View 
            style={[
              styles.statBarFill, 
              { width: `${percentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.statBarText}>{value}</Text>
      </View>
    );
  };
  
  // Render stat information modal
  const renderStatInfoModal = () => {
    if (!showStatInfo) return null;
    
    const statName = showStatInfo.charAt(0).toUpperCase() + showStatInfo.slice(1);
    const statValue = PLAYER_STATS[showStatInfo as keyof typeof PLAYER_STATS];
    const statDescription = STAT_DESCRIPTIONS[showStatInfo as keyof typeof STAT_DESCRIPTIONS];
    
    return (
      <Modal
        visible={!!showStatInfo}
        transparent
        animationType="fade"
        onRequestClose={handleCloseStatInfo}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.statInfoContainer}>
            <View style={styles.statInfoHeader}>
              <Text style={styles.statInfoTitle}>{statName}</Text>
              <TouchableOpacity onPress={handleCloseStatInfo}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statInfoContent}>
              <Text style={styles.statInfoValue}>Current Value: {statValue}</Text>
              <Text style={styles.statInfoDescription}>{statDescription}</Text>
              
              <View style={styles.statEffectsContainer}>
                <Text style={styles.statEffectsTitle}>Effects:</Text>
                {showStatInfo === 'vigor' && (
                  <>
                    <Text style={styles.statEffectText}>• +10 Health per point</Text>
                    <Text style={styles.statEffectText}>• +1.5 Physical Defense per point</Text>
                  </>
                )}
                {showStatInfo === 'mind' && (
                  <>
                    <Text style={styles.statEffectText}>• +5 Mana (FP) per point</Text>
                    <Text style={styles.statEffectText}>• +1.2 Magic Defense per point</Text>
                  </>
                )}
                {showStatInfo === 'endurance' && (
                  <>
                    <Text style={styles.statEffectText}>• +5 Stamina per point</Text>
                    <Text style={styles.statEffectText}>• +1.0 Equip Load per point</Text>
                    <Text style={styles.statEffectText}>• +1.5 Robustness per point</Text>
                  </>
                )}
                {showStatInfo === 'strength' && (
                  <>
                    <Text style={styles.statEffectText}>• Increases damage with Strength-scaling weapons</Text>
                    <Text style={styles.statEffectText}>• Required for heavy weapons and shields</Text>
                  </>
                )}
                {showStatInfo === 'dexterity' && (
                  <>
                    <Text style={styles.statEffectText}>• Increases damage with Dexterity-scaling weapons</Text>
                    <Text style={styles.statEffectText}>• Reduces spell casting time</Text>
                    <Text style={styles.statEffectText}>• Prevents falling damage at high levels</Text>
                  </>
                )}
                {showStatInfo === 'intelligence' && (
                  <>
                    <Text style={styles.statEffectText}>• Required for sorceries</Text>
                    <Text style={styles.statEffectText}>• Increases magic damage</Text>
                    <Text style={styles.statEffectText}>• Increases magic defense</Text>
                  </>
                )}
                {showStatInfo === 'faith' && (
                  <>
                    <Text style={styles.statEffectText}>• Required for incantations</Text>
                    <Text style={styles.statEffectText}>• Increases holy damage</Text>
                    <Text style={styles.statEffectText}>• Increases fire damage with certain weapons</Text>
                  </>
                )}
                {showStatInfo === 'arcane' && (
                  <>
                    <Text style={styles.statEffectText}>• Increases item discovery</Text>
                    <Text style={styles.statEffectText}>• Increases status effect buildup</Text>
                    <Text style={styles.statEffectText}>• Required for certain spells and weapons</Text>
                  </>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.levelUpButton}
                onPress={() => {
                  setStatToLevel(showStatInfo);
                  handleCloseStatInfo();
                  handleOpenLevelUp();
                }}
              >
                <Text style={styles.levelUpButtonText}>Level Up This Attribute</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  // Render level up modal
  const renderLevelUpModal = () => {
    return (
      <Modal
        visible={showLevelUpModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseLevelUp}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.levelUpContainer}>
            <View style={styles.levelUpHeader}>
              <Text style={styles.levelUpTitle}>Level Up Attributes</Text>
              <TouchableOpacity onPress={handleCloseLevelUp}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.levelUpContent}>
              <View style={styles.levelInfoContainer}>
                <View style={styles.levelInfoItem}>
                  <Text style={styles.levelInfoLabel}>Current Level</Text>
                  <Text style={styles.levelInfoValue}>{playerLevel}</Text>
                </View>
                <View style={styles.levelInfoItem}>
                  <Text style={styles.levelInfoLabel}>Available Points</Text>
                  <Text style={styles.levelInfoValue}>{availablePoints}</Text>
                </View>
                <View style={styles.levelInfoItem}>
                  <Text style={styles.levelInfoLabel}>Next Level Cost</Text>
                  <View style={styles.runesCostContainer}>
                    <FontAwesome5 name="coins" size={14} color="#D4AF37" />
                    <Text style={styles.runesCost}>{calculateRuneCost(playerLevel).toLocaleString()}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.attributesContainer}>
                {Object.entries(tempStats).map(([stat, value]) => (
                  <View key={stat} style={styles.attributeRow}>
                    <Text style={styles.attributeName}>
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </Text>
                    
                    <View style={styles.attributeControls}>
                      <TouchableOpacity 
                        style={[
                          styles.attributeButton,
                          value <= PLAYER_STATS[stat as keyof typeof PLAYER_STATS] && styles.disabledButton
                        ]}
                        onPress={() => handleDecreaseStat(stat)}
                        disabled={value <= PLAYER_STATS[stat as keyof typeof PLAYER_STATS]}
                      >
                        <Ionicons name="remove" size={18} color="#D4AF37" />
                      </TouchableOpacity>
                      
                      <Text style={styles.attributeValue}>{value}</Text>
                      
                      <TouchableOpacity 
                        style={[
                          styles.attributeButton,
                          availablePoints <= 0 && styles.disabledButton
                        ]}
                        onPress={() => handleIncreaseStat(stat)}
                        disabled={availablePoints <= 0}
                      >
                        <Ionicons name="add" size={18} color="#D4AF37" />
                      </TouchableOpacity>
                      
                      {value > PLAYER_STATS[stat as keyof typeof PLAYER_STATS] && (
                        <Text style={styles.attributeIncrease}>
                          +{value - PLAYER_STATS[stat as keyof typeof PLAYER_STATS]}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  availablePoints === 3 && styles.disabledButton
                ]}
                onPress={handleConfirmLevelUp}
                disabled={availablePoints === 3}
              >
                <Text style={styles.confirmButtonText}>Confirm Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <ImageBackground 
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20castle%20interior%20with%20candles&aspect=9:16&seed=stats' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#D4AF37" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Character Stats</Text>
          
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle" size={24} color="#D4AF37" />
          </TouchableOpacity>
        </View>
        
        {/* Character level info */}
        <View style={styles.levelContainer}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>Level</Text>
            <Text style={styles.levelValue}>{playerLevel}</Text>
          </View>
          
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>Available Points</Text>
            <Text style={styles.pointsValue}>{availablePoints}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.levelUpActionButton}
            onPress={handleOpenLevelUp}
          >
            <Text style={styles.levelUpActionText}>Level Up</Text>
          </TouchableOpacity>
        </View>
        
        {/* Main stats */}
        <ScrollView style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Attributes</Text>
          
          {Object.entries(PLAYER_STATS).map(([stat, value]) => (
            <TouchableOpacity 
              key={stat} 
              style={styles.statRow}
              onPress={() => handleStatPress(stat)}
            >
              <View style={styles.statInfo}>
                <Text style={styles.statName}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</Text>
                <Ionicons name="information-circle-outline" size={16} color="#A89968" />
              </View>
              
              {renderStatBar(stat, value)}
            </TouchableOpacity>
          ))}
          
          <Text style={styles.sectionTitle}>Derived Stats</Text>
          
          <View style={styles.derivedStatsGrid}>
            {Object.entries(DERIVED_STATS).map(([stat, value]) => (
              <View key={stat} style={styles.derivedStatItem}>
                <Text style={styles.derivedStatName}>
                  {stat.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + stat.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                </Text>
                <Text style={styles.derivedStatValue}>
                  {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.equipLoadContainer}>
            <Text style={styles.equipLoadTitle}>Equipment Load</Text>
            <View style={styles.equipLoadBarContainer}>
              <View style={styles.equipLoadBarBackground}>
                <View 
                  style={[
                    styles.equipLoadBarFill, 
                    { width: `${(DERIVED_STATS.equipLoad / DERIVED_STATS.maxEquipLoad) * 100}%` },
                    DERIVED_STATS.equipLoad / DERIVED_STATS.maxEquipLoad > 0.7 && styles.heavyLoad
                  ]} 
                />
              </View>
              <Text style={styles.equipLoadText}>
                {DERIVED_STATS.equipLoad.toFixed(1)} / {DERIVED_STATS.maxEquipLoad.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.equipLoadStatus}>
              {DERIVED_STATS.equipLoad / DERIVED_STATS.maxEquipLoad <= 0.3 ? 'Light Load' : 
               DERIVED_STATS.equipLoad / DERIVED_STATS.maxEquipLoad <= 0.7 ? 'Medium Load' : 'Heavy Load'}
            </Text>
          </View>
        </ScrollView>
        
        {/* Modals */}
        {renderStatInfoModal()}
        {renderLevelUpModal()}
      </LinearGradient>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  infoButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  levelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  levelLabel: {
    color: '#A89968',
    fontSize: 14,
  },
  levelValue: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsInfo: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#3A3A3A',
  },
  pointsLabel: {
    color: '#A89968',
    fontSize: 14,
  },
  pointsValue: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelUpActionButton: {
    flex: 1,
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  levelUpActionText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
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
  statRow: {
    marginBottom: 12,
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statName: {
    color: '#A89968',
    fontSize: 16,
    marginRight: 6,
  },
  statBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 5,
  },
  statBarText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    width: 30,
    textAlign: 'right',
  },
  derivedStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  derivedStatItem: {
    width: '50%',
    paddingVertical: 8,
    paddingRight: 16,
  },
  derivedStatName: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 2,
  },
  derivedStatValue: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  equipLoadContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  equipLoadTitle: {
    color: '#A89968',
    fontSize: 16,
    marginBottom: 8,
  },
  equipLoadBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  equipLoadBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  equipLoadBarFill: {
    height: '100%',
    backgroundColor: '#28c04c',
    borderRadius: 5,
  },
  heavyLoad: {
    backgroundColor: '#c02d28',
  },
  equipLoadText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    width: 80,
    textAlign: 'right',
  },
  equipLoadStatus: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'right',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statInfoContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    padding: 16,
  },
  statInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  statInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  statInfoContent: {
    flex: 1,
  },
  statInfoValue: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statInfoDescription: {
    color: '#A89968',
    fontSize: 16,
    marginBottom: 16,
  },
  statEffectsContainer: {
    marginBottom: 16,
  },
  statEffectsTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statEffectText: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  levelUpButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  levelUpButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Level up modal styles
  levelUpContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  levelUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  levelUpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  levelUpContent: {
    flex: 1,
  },
  levelInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 8,
    padding: 12,
  },
  levelInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  levelInfoLabel: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 4,
  },
  levelInfoValue: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
  },
  runesCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runesCost: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  attributesContainer: {
    marginBottom: 16,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  attributeName: {
    color: '#A89968',
    fontSize: 16,
  },
  attributeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attributeButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: '#3A3A3A',
  },
  attributeValue: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  attributeIncrease: {
    color: '#28c04c',
    fontSize: 14,
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
});