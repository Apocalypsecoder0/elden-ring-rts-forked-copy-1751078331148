import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Combat data
const ACTIVE_BATTLES = [
  {
    id: 'battle_1',
    name: 'Stormveil Siege',
    location: 'Stormveil Castle',
    status: 'in_progress',
    difficulty: 'Hard',
    rewards: 'High',
    enemies: [
      { id: 'godrick', name: 'Godrick the Grafted', type: 'boss', level: 40, health: 100 },
      { id: 'knight_1', name: 'Stormveil Knight', type: 'elite', level: 25, health: 80 },
      { id: 'knight_2', name: 'Stormveil Knight', type: 'elite', level: 25, health: 60 },
      { id: 'soldier_1', name: 'Godrick Soldier', type: 'normal', level: 15, health: 100 },
      { id: 'soldier_2', name: 'Godrick Soldier', type: 'normal', level: 15, health: 100 },
      { id: 'soldier_3', name: 'Godrick Soldier', type: 'normal', level: 15, health: 100 },
    ],
    allies: [
      { id: 'player', name: 'Tarnished One', type: 'player', level: 42, health: 100 },
      { id: 'nepheli', name: 'Nepheli Loux', type: 'npc', level: 35, health: 90 },
      { id: 'rogier', name: 'Sorcerer Rogier', type: 'npc', level: 30, health: 75 },
    ],
    turns_remaining: 3,
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20castle%20siege%20battle&aspect=16:9&seed=stormveil'
  },
  {
    id: 'battle_2',
    name: 'Caelid Skirmish',
    location: 'Swamp of Aeonia',
    status: 'pending',
    difficulty: 'Very Hard',
    rewards: 'Very High',
    enemies: [
      { id: 'commander', name: 'Commander O\'Neil', type: 'boss', level: 60, health: 100 },
      { id: 'knight_3', name: 'Redmane Knight', type: 'elite', level: 45, health: 100 },
      { id: 'knight_4', name: 'Redmane Knight', type: 'elite', level: 45, health: 100 },
      { id: 'soldier_4', name: 'Redmane Soldier', type: 'normal', level: 35, health: 100 },
      { id: 'soldier_5', name: 'Redmane Soldier', type: 'normal', level: 35, health: 100 },
    ],
    allies: [
      { id: 'player', name: 'Tarnished One', type: 'player', level: 42, health: 100 },
      { id: 'blaidd', name: 'Blaidd the Half-Wolf', type: 'npc', level: 50, health: 100 },
    ],
    turns_remaining: 5,
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20battle%20in%20crimson%20swamp&aspect=16:9&seed=caelid'
  },
];

const COMBAT_TACTICS = [
  {
    id: 'aggressive',
    name: 'Aggressive Stance',
    description: 'Focus on dealing maximum damage at the cost of defense.',
    effects: ['+25% Attack Damage', '-15% Defense', '+10% Critical Hit Chance'],
    icon: 'flame',
    color: '#c93c3c',
  },
  {
    id: 'defensive',
    name: 'Defensive Stance',
    description: 'Prioritize survival and damage mitigation.',
    effects: ['+30% Defense', '-10% Attack Damage', '+20% Status Effect Resistance'],
    icon: 'shield',
    color: '#3c78c9',
  },
  {
    id: 'balanced',
    name: 'Balanced Approach',
    description: 'Maintain an even distribution between offense and defense.',
    effects: ['+10% to All Stats', '+5% Experience Gain', '+10% Item Discovery'],
    icon: 'sync',
    color: '#5ac93c',
  },
  {
    id: 'tactical',
    name: 'Tactical Precision',
    description: 'Focus on exploiting enemy weaknesses and critical hits.',
    effects: ['+20% Critical Damage', '+15% Weak Point Damage', '-5% Attack Speed'],
    icon: 'analytics',
    color: '#a335ee',
  },
];

const UNIT_FORMATIONS = [
  {
    id: 'vanguard',
    name: 'Vanguard Formation',
    description: 'Place strongest units at the front to absorb damage and protect weaker allies.',
    effects: ['+20% Front Line Defense', '+15% Back Line Damage', '-5% Movement Speed'],
    icon: 'shield-checkmark',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20shield%20wall%20formation&aspect=16:9&seed=vanguard'
  },
  {
    id: 'flanking',
    name: 'Flanking Maneuver',
    description: 'Position units to attack from multiple angles, focusing on mobility and surprise.',
    effects: ['+25% Chance to Ambush', '+15% Movement Speed', '-10% Defense'],
    icon: 'move',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20flanking%20battle%20formation&aspect=16:9&seed=flanking'
  },
  {
    id: 'phalanx',
    name: 'Phalanx Defense',
    description: 'Tightly packed defensive formation that maximizes protection at the cost of mobility.',
    effects: ['+35% Defense', '+20% Block Chance', '-25% Movement Speed'],
    icon: 'grid',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20phalanx%20shield%20formation&aspect=16:9&seed=phalanx'
  },
  {
    id: 'skirmish',
    name: 'Skirmish Line',
    description: 'Loose, flexible formation that allows for quick adaptation to changing battle conditions.',
    effects: ['+20% Dodge Chance', '+15% Attack Speed', '-10% Max Health'],
    icon: 'flash',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20skirmish%20battle%20line&aspect=16:9&seed=skirmish'
  },
];

export default function CombatScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('battles');
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [selectedTactic, setSelectedTactic] = useState('balanced');
  const [selectedFormation, setSelectedFormation] = useState('vanguard');
  
  const handleBattleSelect = (battle) => {
    setSelectedBattle(battle);
  };
  
  const handleTacticSelect = (tacticId) => {
    setSelectedTactic(tacticId);
  };
  
  const handleFormationSelect = (formationId) => {
    setSelectedFormation(formationId);
  };
  
  const renderBattleItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.battleItem, selectedBattle?.id === item.id && styles.selectedBattleItem]} 
      onPress={() => handleBattleSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.battleImage} />
      <View style={styles.battleOverlay}>
        <View style={styles.battleHeader}>
          <Text style={styles.battleName}>{item.name}</Text>
          <View style={[
            styles.battleStatusBadge, 
            { backgroundColor: item.status === 'in_progress' ? '#5ac93c' : '#3c78c9' }
          ]}>
            <Text style={styles.battleStatusText}>
              {item.status === 'in_progress' ? 'IN PROGRESS' : 'PENDING'}
            </Text>
          </View>
        </View>
        <View style={styles.battleInfo}>
          <View style={styles.battleInfoItem}>
            <Text style={styles.battleInfoLabel}>LOCATION</Text>
            <Text style={styles.battleInfoValue}>{item.location}</Text>
          </View>
          <View style={styles.battleInfoItem}>
            <Text style={styles.battleInfoLabel}>DIFFICULTY</Text>
            <Text style={styles.battleInfoValue}>{item.difficulty}</Text>
          </View>
          <View style={styles.battleInfoItem}>
            <Text style={styles.battleInfoLabel}>REWARDS</Text>
            <Text style={styles.battleInfoValue}>{item.rewards}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderTacticItem = (tactic) => (
    <TouchableOpacity 
      key={tactic.id}
      style={[styles.tacticItem, selectedTactic === tactic.id && styles.selectedTacticItem]} 
      onPress={() => handleTacticSelect(tactic.id)}
    >
      <View style={[styles.tacticIconContainer, { backgroundColor: tactic.color }]}>
        <Ionicons name={tactic.icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.tacticContent}>
        <Text style={styles.tacticName}>{tactic.name}</Text>
        <Text style={styles.tacticDescription}>{tactic.description}</Text>
        <View style={styles.tacticEffects}>
          {tactic.effects.map((effect, index) => (
            <View key={index} style={styles.tacticEffectItem}>
              <Ionicons name="checkmark-circle" size={14} color={tactic.color} />
              <Text style={styles.tacticEffectText}>{effect}</Text>
            </View>
          ))}
        </View>
      </View>
      {selectedTactic === tactic.id && (
        <View style={styles.tacticSelectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color={tactic.color} />
        </View>
      )}
    </TouchableOpacity>
  );
  
  const renderFormationItem = (formation) => (
    <TouchableOpacity 
      key={formation.id}
      style={[styles.formationItem, selectedFormation === formation.id && styles.selectedFormationItem]} 
      onPress={() => handleFormationSelect(formation.id)}
    >
      <Image source={{ uri: formation.image }} style={styles.formationImage} />
      <View style={styles.formationOverlay}>
        <View style={styles.formationHeader}>
          <Ionicons name={formation.icon} size={20} color="#D4AF37" />
          <Text style={styles.formationName}>{formation.name}</Text>
        </View>
        <Text style={styles.formationDescription}>{formation.description}</Text>
        <View style={styles.formationEffects}>
          {formation.effects.map((effect, index) => (
            <View key={index} style={styles.formationEffectItem}>
              <Ionicons name="arrow-forward" size={12} color="#D4AF37" />
              <Text style={styles.formationEffectText}>{effect}</Text>
            </View>
          ))}
        </View>
      </View>
      {selectedFormation === formation.id && (
        <View style={styles.formationSelectedBadge}>
          <Text style={styles.formationSelectedText}>ACTIVE</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
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
          <Text style={styles.headerTitle}>COMBAT</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'battles' && styles.activeTabButton]}
            onPress={() => setActiveTab('battles')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'battles' && styles.activeTabText]}>BATTLES</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'tactics' && styles.activeTabButton]}
            onPress={() => setActiveTab('tactics')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'tactics' && styles.activeTabText]}>TACTICS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'formations' && styles.activeTabButton]}
            onPress={() => setActiveTab('formations')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'formations' && styles.activeTabText]}>FORMATIONS</Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'battles' && (
          <View style={styles.contentContainer}>
            <FlatList
              data={ACTIVE_BATTLES}
              renderItem={renderBattleItem}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.battlesList}
            />
            
            {selectedBattle && (
              <View style={styles.battleDetailsContainer}>
                <Text style={styles.battleDetailsTitle}>Battle Forces</Text>
                
                <View style={styles.forcesContainer}>
                  <View style={styles.forceColumn}>
                    <Text style={styles.forceTitle}>ALLIES</Text>
                    {selectedBattle.allies.map(ally => (
                      <View key={ally.id} style={styles.unitItem}>
                        <View style={[styles.unitTypeIndicator, { 
                          backgroundColor: ally.type === 'player' ? '#D4AF37' : '#5ac93c' 
                        }]} />
                        <View style={styles.unitInfo}>
                          <Text style={styles.unitName}>{ally.name}</Text>
                          <Text style={styles.unitType}>
                            {ally.type === 'player' ? 'Player' : 'NPC Ally'} • Level {ally.level}
                          </Text>
                        </View>
                        <View style={styles.unitHealthContainer}>
                          <View style={styles.unitHealthBar}>
                            <View 
                              style={[styles.unitHealthFill, { width: `${ally.health}%` }]} 
                            />
                          </View>
                          <Text style={styles.unitHealthText}>{ally.health}%</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.forceColumn}>
                    <Text style={styles.forceTitle}>ENEMIES</Text>
                    {selectedBattle.enemies.map(enemy => (
                      <View key={enemy.id} style={styles.unitItem}>
                        <View style={[styles.unitTypeIndicator, { 
                          backgroundColor: enemy.type === 'boss' ? '#c93c3c' : 
                                          enemy.type === 'elite' ? '#a335ee' : '#3c78c9' 
                        }]} />
                        <View style={styles.unitInfo}>
                          <Text style={styles.unitName}>{enemy.name}</Text>
                          <Text style={styles.unitType}>
                            {enemy.type === 'boss' ? 'Boss' : 
                             enemy.type === 'elite' ? 'Elite' : 'Normal'} • Level {enemy.level}
                          </Text>
                        </View>
                        <View style={styles.unitHealthContainer}>
                          <View style={styles.unitHealthBar}>
                            <View 
                              style={[styles.unitHealthFill, { 
                                width: `${enemy.health}%`,
                                backgroundColor: enemy.type === 'boss' ? '#c93c3c' : '#3c78c9'
                              }]} 
                            />
                          </View>
                          <Text style={styles.unitHealthText}>{enemy.health}%</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.battleActions}>
                  <TouchableOpacity style={styles.battleActionButton}>
                    <Ionicons name="play" size={20} color="#FFFFFF" />
                    <Text style={styles.battleActionText}>
                      {selectedBattle.status === 'in_progress' ? 'CONTINUE BATTLE' : 'START BATTLE'}
                    </Text>
                  </TouchableOpacity>
                  
                  <View style={styles.turnsContainer}>
                    <Text style={styles.turnsLabel}>TURNS REMAINING</Text>
                    <Text style={styles.turnsValue}>{selectedBattle.turns_remaining}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'tactics' && (
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Combat Tactics</Text>
            <Text style={styles.sectionDescription}>
              Select a tactical approach that will determine how your forces behave in battle.
              Each tactic provides different bonuses and penalties.
            </Text>
            
            {COMBAT_TACTICS.map(tactic => renderTacticItem(tactic))}
            
            <View style={styles.tacticApplyContainer}>
              <TouchableOpacity style={styles.tacticApplyButton}>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.tacticApplyText}>APPLY SELECTED TACTIC</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        
        {activeTab === 'formations' && (
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Unit Formations</Text>
            <Text style={styles.sectionDescription}>
              Choose how your units are positioned on the battlefield.
              Different formations provide strategic advantages in various combat situations.
            </Text>
            
            {UNIT_FORMATIONS.map(formation => renderFormationItem(formation))}
          </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A89968',
  },
  activeTabText: {
    color: '#D4AF37',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 16,
    lineHeight: 20,
  },
  battlesList: {
    height: 200,
    marginBottom: 16,
  },
  battleItem: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  selectedBattleItem: {
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  battleImage: {
    width: '100%',
    height: '100%',
  },
  battleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    padding: 12,
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  battleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  battleStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  battleStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  battleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  battleInfoItem: {
    alignItems: 'center',
  },
  battleInfoLabel: {
    fontSize: 10,
    color: '#A89968',
    marginBottom: 4,
  },
  battleInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  battleDetailsContainer: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  battleDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 16,
  },
  forcesContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  forceColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  forceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A89968',
    marginBottom: 8,
    textAlign: 'center',
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  unitTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unitType: {
    fontSize: 12,
    color: '#A89968',
  },
  unitHealthContainer: {
    width: 60,
  },
  unitHealthBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  unitHealthFill: {
    height: '100%',
    backgroundColor: '#5ac93c',
  },
  unitHealthText: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  battleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  battleActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  battleActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  turnsContainer: {
    alignItems: 'center',
  },
  turnsLabel: {
    fontSize: 10,
    color: '#A89968',
    marginBottom: 4,
  },
  turnsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  tacticItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedTacticItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  tacticIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tacticContent: {
    flex: 1,
  },
  tacticName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tacticDescription: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 8,
    lineHeight: 20,
  },
  tacticEffects: {
    marginTop: 8,
  },
  tacticEffectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tacticEffectText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tacticSelectedIndicator: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  tacticApplyContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  tacticApplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  tacticApplyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  formationItem: {
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    overflow: 'hidden',
    position: 'relative',
  },
  selectedFormationItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  formationImage: {
    width: '100%',
    height: 120,
  },
  formationOverlay: {
    padding: 16,
  },
  formationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  formationDescription: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 12,
    lineHeight: 20,
  },
  formationEffects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formationEffectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  formationEffectText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  formationSelectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  formationSelectedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});