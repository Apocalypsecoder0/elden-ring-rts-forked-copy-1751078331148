import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dungeon data
const DUNGEONS_DATA = [
  {
    id: 'limgrave_catacombs',
    name: 'Stormfoot Catacombs',
    type: 'dungeon',
    location: 'Limgrave',
    description: 'Ancient burial grounds beneath Limgrave, filled with undead and traps.',
    difficulty: 'Easy',
    recommended_level: '5-15',
    completion: 0,
    bosses: ['Grave Warden Duelist'],
    rewards: ['Golden Seed', 'Grave Glovewort', 'Duelist Greataxe'],
    image: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20catacombs%20with%20tombs&aspect=16:9&seed=catacombs'
  },
  {
    id: 'siofra_river',
    name: 'Siofra River Well',
    type: 'legacy_dungeon',
    location: 'Limgrave Underground',
    description: 'A vast underground river area with ancient ruins and eternal stars.',
    difficulty: 'Medium',
    recommended_level: '30-40',
    completion: 25,
    bosses: ['Ancestor Spirit', 'Dragonkin Soldier'],
    rewards: ['Ancestral Follower Ashes', 'Clarifying Horn Charm', 'Dragonwound Grease'],
    image: 'https://api.a0.dev/assets/image?text=Underground%20river%20with%20stars%20and%20ruins&aspect=16:9&seed=siofra'
  },
  {
    id: 'academy_crystal_cave',
    name: 'Academy Crystal Cave',
    type: 'dungeon',
    location: 'Liurnia of the Lakes',
    description: 'A cave filled with dangerous crystal enemies and valuable resources.',
    difficulty: 'Medium',
    recommended_level: '35-45',
    completion: 50,
    bosses: ['Crystalian Duo'],
    rewards: ['Crystal Tear', 'Smithing Stone [4]', 'Crystal Staff'],
    image: 'https://api.a0.dev/assets/image?text=Blue%20crystal%20cave%20with%20glowing%20crystals&aspect=16:9&seed=crystalcave'
  },
  {
    id: 'leyndell_sewers',
    name: 'Leyndell Royal Sewers',
    type: 'legacy_dungeon',
    location: 'Leyndell, Royal Capital',
    description: 'The labyrinthine sewers beneath the royal capital, home to outcasts and horrors.',
    difficulty: 'Hard',
    recommended_level: '60-70',
    completion: 0,
    bosses: ['Mohg, The Omen', 'Esgar, Priest of Blood'],
    rewards: ['Bloodflame Talons', 'Omen Bairn', 'Seedbed Curse'],
    image: 'https://api.a0.dev/assets/image?text=Dark%20sewers%20with%20water%20and%20pipes&aspect=16:9&seed=sewers'
  },
];

// Raid data
const RAIDS_DATA = [
  {
    id: 'godrick_raid',
    name: 'Assault on Stormveil',
    type: 'raid',
    location: 'Stormveil Castle',
    description: 'A coordinated assault on Stormveil Castle to defeat Godrick the Grafted and claim his Great Rune.',
    difficulty: 'Medium',
    recommended_level: '40+',
    player_count: '5-10',
    status: 'available',
    bosses: [
      { name: 'Margit, the Fell Omen', defeated: true },
      { name: 'Godrick the Grafted', defeated: false }
    ],
    rewards: ['Godrick\'s Great Rune', 'Remembrance of the Grafted', 'Grafted Dragon'],
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20castle%20with%20storm%20clouds&aspect=16:9&seed=stormveil'
  },
  {
    id: 'radahn_raid',
    name: 'Starscourge Conflict',
    type: 'raid',
    location: 'Wailing Dunes, Caelid',
    description: 'Join the festival to challenge General Radahn, the Starscourge, alongside other warriors.',
    difficulty: 'Hard',
    recommended_level: '60+',
    player_count: '8-12',
    status: 'available',
    bosses: [
      { name: 'Starscourge Radahn', defeated: false }
    ],
    rewards: ['Radahn\'s Great Rune', 'Remembrance of the Starscourge', 'Starscourge Greatsword'],
    image: 'https://api.a0.dev/assets/image?text=Red%20desert%20battlefield%20with%20stars&aspect=16:9&seed=radahn'
  },
  {
    id: 'raya_lucaria_raid',
    name: 'Academy Infiltration',
    type: 'raid',
    location: 'Raya Lucaria Academy',
    description: 'Infiltrate the sealed academy to defeat the Red Wolf of Radagon and Rennala, Queen of the Full Moon.',
    difficulty: 'Medium',
    recommended_level: '50+',
    player_count: '4-8',
    status: 'in_progress',
    bosses: [
      { name: 'Red Wolf of Radagon', defeated: true },
      { name: 'Rennala, Queen of the Full Moon', defeated: false }
    ],
    rewards: ['Remembrance of the Full Moon Queen', 'Academy Glintstone Staff', 'Carian Regal Scepter'],
    image: 'https://api.a0.dev/assets/image?text=Magic%20academy%20with%20blue%20glow&aspect=16:9&seed=rayalucaria'
  },
  {
    id: 'mohgwyn_raid',
    name: 'Palace of Blood',
    type: 'raid',
    location: 'Mohgwyn Palace',
    description: 'Descend into the hidden dynasty of blood to challenge Mohg, Lord of Blood.',
    difficulty: 'Very Hard',
    recommended_level: '120+',
    player_count: '10-15',
    status: 'locked',
    bosses: [
      { name: 'Mohg, Lord of Blood', defeated: false }
    ],
    rewards: ['Remembrance of the Blood Lord', 'Mohgwyn\'s Sacred Spear', 'Bloodboon'],
    image: 'https://api.a0.dev/assets/image?text=Blood%20palace%20with%20red%20sky&aspect=16:9&seed=mohgwyn'
  },
];

// Trial data
const TRIALS_DATA = [
  {
    id: 'evergaol_crucible',
    name: 'Crucible Knight Trial',
    type: 'evergaol',
    location: 'Stormhill Evergaol',
    description: 'Face the ancient Crucible Knight in a sealed arena where time stands still.',
    difficulty: 'Medium',
    recommended_level: '30+',
    completion: 0,
    time_limit: '10:00',
    rewards: ['Aspects of the Crucible: Tail', 'Crucible Knight Armor Set'],
    image: 'https://api.a0.dev/assets/image?text=Blue%20magic%20circle%20prison%20arena&aspect=16:9&seed=evergaol'
  },
  {
    id: 'divine_tower_trial',
    name: 'Divine Tower Ascent',
    type: 'trial',
    location: 'Divine Tower of Liurnia',
    description: 'Climb the perilous Divine Tower while facing guardians and traps to restore a Great Rune.',
    difficulty: 'Hard',
    recommended_level: '70+',
    completion: 0,
    time_limit: '20:00',
    rewards: ['Stargazer Heirloom', 'Divine Tower Seal'],
    image: 'https://api.a0.dev/assets/image?text=Tall%20stone%20tower%20with%20spiral%20staircase&aspect=16:9&seed=divinetower'
  },
  {
    id: 'perfumer_trial',
    name: 'Perfumer\'s Challenge',
    type: 'trial',
    location: 'Perfumer\'s Ruins',
    description: 'Navigate through toxic mists and defeat the maddened perfumers to claim their secrets.',
    difficulty: 'Medium',
    recommended_level: '45+',
    completion: 75,
    time_limit: '15:00',
    rewards: ['Perfume Bottle', 'Perfumer\'s Cookbook'],
    image: 'https://api.a0.dev/assets/image?text=Ruins%20with%20colorful%20mist%20and%20flowers&aspect=16:9&seed=perfumer'
  },
];

export default function DungeonsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('dungeons');
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [selectedRaid, setSelectedRaid] = useState(null);
  const [selectedTrial, setSelectedTrial] = useState(null);
  
  const handleDungeonSelect = (dungeon) => {
    setSelectedDungeon(dungeon);
    setSelectedRaid(null);
    setSelectedTrial(null);
  };
  
  const handleRaidSelect = (raid) => {
    setSelectedRaid(raid);
    setSelectedDungeon(null);
    setSelectedTrial(null);
  };
  
  const handleTrialSelect = (trial) => {
    setSelectedTrial(trial);
    setSelectedDungeon(null);
    setSelectedRaid(null);
  };
  
  const renderDungeonItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.dungeonItem, selectedDungeon?.id === item.id && styles.selectedDungeonItem]} 
      onPress={() => handleDungeonSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.dungeonImage} />
      <View style={styles.dungeonOverlay}>
        <View style={styles.dungeonHeader}>
          <Text style={styles.dungeonName}>{item.name}</Text>
          <View style={[
            styles.dungeonTypeBadge, 
            { backgroundColor: item.type === 'legacy_dungeon' ? '#a335ee' : '#3c78c9' }
          ]}>
            <Text style={styles.dungeonTypeText}>
              {item.type === 'legacy_dungeon' ? 'LEGACY' : 'DUNGEON'}
            </Text>
          </View>
        </View>
        <View style={styles.dungeonInfo}>
          <View style={styles.dungeonInfoItem}>
            <Text style={styles.dungeonInfoLabel}>LOCATION</Text>
            <Text style={styles.dungeonInfoValue}>{item.location}</Text>
          </View>
          <View style={styles.dungeonInfoItem}>
            <Text style={styles.dungeonInfoLabel}>DIFFICULTY</Text>
            <Text style={styles.dungeonInfoValue}>{item.difficulty}</Text>
          </View>
          <View style={styles.dungeonInfoItem}>
            <Text style={styles.dungeonInfoLabel}>LEVEL</Text>
            <Text style={styles.dungeonInfoValue}>{item.recommended_level}</Text>
          </View>
        </View>
        
        <View style={styles.completionContainer}>
          <View style={styles.completionBar}>
            <View 
              style={[styles.completionFill, { width: `${item.completion}%` }]} 
            />
          </View>
          <Text style={styles.completionText}>{item.completion}% Complete</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderRaidItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.raidItem, selectedRaid?.id === item.id && styles.selectedRaidItem]} 
      onPress={() => handleRaidSelect(item)}
      disabled={item.status === 'locked'}
    >
      <Image source={{ uri: item.image }} style={styles.raidImage} />
      <View style={styles.raidOverlay}>
        <View style={styles.raidHeader}>
          <Text style={styles.raidName}>{item.name}</Text>
          <View style={[
            styles.raidStatusBadge, 
            { 
              backgroundColor: item.status === 'available' ? '#5ac93c' : 
                              item.status === 'in_progress' ? '#3c78c9' : '#6e6e6e' 
            }
          ]}>
            <Text style={styles.raidStatusText}>
              {item.status === 'available' ? 'AVAILABLE' : 
               item.status === 'in_progress' ? 'IN PROGRESS' : 'LOCKED'}
            </Text>
          </View>
        </View>
        <View style={styles.raidInfo}>
          <View style={styles.raidInfoItem}>
            <Text style={styles.raidInfoLabel}>LOCATION</Text>
            <Text style={styles.raidInfoValue}>{item.location}</Text>
          </View>
          <View style={styles.raidInfoItem}>
            <Text style={styles.raidInfoLabel}>DIFFICULTY</Text>
            <Text style={styles.raidInfoValue}>{item.difficulty}</Text>
          </View>
          <View style={styles.raidInfoItem}>
            <Text style={styles.raidInfoLabel}>PLAYERS</Text>
            <Text style={styles.raidInfoValue}>{item.player_count}</Text>
          </View>
        </View>
        
        {item.status === 'locked' && (
          <View style={styles.lockedOverlay}>
            <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
            <Text style={styles.lockedText}>Complete previous raids to unlock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  const renderTrialItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.trialItem, selectedTrial?.id === item.id && styles.selectedTrialItem]} 
      onPress={() => handleTrialSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.trialImage} />
      <View style={styles.trialOverlay}>
        <View style={styles.trialHeader}>
          <Text style={styles.trialName}>{item.name}</Text>
          <View style={[
            styles.trialTypeBadge, 
            { backgroundColor: item.type === 'evergaol' ? '#a335ee' : '#3c78c9' }
          ]}>
            <Text style={styles.trialTypeText}>
              {item.type.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.trialInfo}>
          <View style={styles.trialInfoItem}>
            <Text style={styles.trialInfoLabel}>LOCATION</Text>
            <Text style={styles.trialInfoValue}>{item.location}</Text>
          </View>
          <View style={styles.trialInfoItem}>
            <Text style={styles.trialInfoLabel}>DIFFICULTY</Text>
            <Text style={styles.trialInfoValue}>{item.difficulty}</Text>
          </View>
          <View style={styles.trialInfoItem}>
            <Text style={styles.trialInfoLabel}>TIME LIMIT</Text>
            <Text style={styles.trialInfoValue}>{item.time_limit}</Text>
          </View>
        </View>
        
        <View style={styles.completionContainer}>
          <View style={styles.completionBar}>
            <View 
              style={[styles.completionFill, { width: `${item.completion}%` }]} 
            />
          </View>
          <Text style={styles.completionText}>{item.completion}% Complete</Text>
        </View>
      </View>
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
          <Text style={styles.headerTitle}>DUNGEONS & RAIDS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'dungeons' && styles.activeTabButton]}
            onPress={() => setActiveTab('dungeons')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'dungeons' && styles.activeTabText]}>DUNGEONS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'raids' && styles.activeTabButton]}
            onPress={() => setActiveTab('raids')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'raids' && styles.activeTabText]}>RAIDS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'trials' && styles.activeTabButton]}
            onPress={() => setActiveTab('trials')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'trials' && styles.activeTabText]}>TRIALS</Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'dungeons' && (
          <View style={styles.contentContainer}>
            <FlatList
              data={DUNGEONS_DATA}
              renderItem={renderDungeonItem}
              keyExtractor={item => item.id}
              style={styles.dungeonsList}
              contentContainerStyle={styles.dungeonsListContent}
            />
            
            {selectedDungeon && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>{selectedDungeon.name}</Text>
                <Text style={styles.detailsDescription}>{selectedDungeon.description}</Text>
                
                <Text style={styles.detailsSectionTitle}>Bosses</Text>
                <View style={styles.bossesList}>
                  {selectedDungeon.bosses.map((boss, index) => (
                    <View key={index} style={styles.bossItem}>
                      <Ionicons name="skull" size={20} color="#c93c3c" />
                      <Text style={styles.bossName}>{boss}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.detailsSectionTitle}>Rewards</Text>
                <View style={styles.rewardsList}>
                  {selectedDungeon.rewards.map((reward, index) => (
                    <View key={index} style={styles.rewardItem}>
                      <Ionicons name="gift" size={20} color="#D4AF37" />
                      <Text style={styles.rewardName}>{reward}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.enterButton}>
                  <Ionicons name="enter" size={20} color="#FFFFFF" />
                  <Text style={styles.enterButtonText}>ENTER DUNGEON</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'raids' && (
          <View style={styles.contentContainer}>
            <FlatList
              data={RAIDS_DATA}
              renderItem={renderRaidItem}
              keyExtractor={item => item.id}
              style={styles.raidsList}
              contentContainerStyle={styles.raidsListContent}
            />
            
            {selectedRaid && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>{selectedRaid.name}</Text>
                <Text style={styles.detailsDescription}>{selectedRaid.description}</Text>
                
                <Text style={styles.detailsSectionTitle}>Bosses</Text>
                <View style={styles.bossesList}>
                  {selectedRaid.bosses.map((boss, index) => (
                    <View key={index} style={styles.bossItem}>
                      <Ionicons 
                        name={boss.defeated ? "checkmark-circle" : "skull"} 
                        size={20} 
                        color={boss.defeated ? "#5ac93c" : "#c93c3c"} 
                      />
                      <Text style={[
                        styles.bossName,
                        boss.defeated && styles.defeatedBossName
                      ]}>
                        {boss.name} {boss.defeated && '(Defeated)'}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.detailsSectionTitle}>Rewards</Text>
                <View style={styles.rewardsList}>
                  {selectedRaid.rewards.map((reward, index) => (
                    <View key={index} style={styles.rewardItem}>
                      <Ionicons name="gift" size={20} color="#D4AF37" />
                      <Text style={styles.rewardName}>{reward}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.raidActions}>
                  <TouchableOpacity 
                    style={[
                      styles.raidActionButton,
                      selectedRaid.status === 'locked' && styles.disabledButton
                    ]}
                    disabled={selectedRaid.status === 'locked'}
                  >
                    <Ionicons name="people" size={20} color="#FFFFFF" />
                    <Text style={styles.raidActionText}>FIND PARTY</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.raidActionButton,
                      selectedRaid.status === 'locked' && styles.disabledButton
                    ]}
                    disabled={selectedRaid.status === 'locked'}
                  >
                    <Ionicons name="enter" size={20} color="#FFFFFF" />
                    <Text style={styles.raidActionText}>
                      {selectedRaid.status === 'in_progress' ? 'CONTINUE RAID' : 'START RAID'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'trials' && (
          <View style={styles.contentContainer}>
            <FlatList
              data={TRIALS_DATA}
              renderItem={renderTrialItem}
              keyExtractor={item => item.id}
              style={styles.trialsList}
              contentContainerStyle={styles.trialsListContent}
            />
            
            {selectedTrial && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>{selectedTrial.name}</Text>
                <Text style={styles.detailsDescription}>{selectedTrial.description}</Text>
                
                <View style={styles.trialDetails}>
                  <View style={styles.trialDetailItem}>
                    <Ionicons name="time" size={24} color="#D4AF37" />
                    <View style={styles.trialDetailContent}>
                      <Text style={styles.trialDetailLabel}>Time Limit</Text>
                      <Text style={styles.trialDetailValue}>{selectedTrial.time_limit}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.trialDetailItem}>
                    <Ionicons name="stats-chart" size={24} color="#D4AF37" />
                    <View style={styles.trialDetailContent}>
                      <Text style={styles.trialDetailLabel}>Recommended Level</Text>
                      <Text style={styles.trialDetailValue}>{selectedTrial.recommended_level}</Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.detailsSectionTitle}>Rewards</Text>
                <View style={styles.rewardsList}>
                  {selectedTrial.rewards.map((reward, index) => (
                    <View key={index} style={styles.rewardItem}>
                      <Ionicons name="gift" size={20} color="#D4AF37" />
                      <Text style={styles.rewardName}>{reward}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.enterButton}>
                  <Ionicons name="enter" size={20} color="#FFFFFF" />
                  <Text style={styles.enterButtonText}>BEGIN TRIAL</Text>
                </TouchableOpacity>
              </View>
            )}
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
  },
  dungeonsList: {
    flex: 1,
  },
  dungeonsListContent: {
    padding: 16,
  },
  dungeonItem: {
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedDungeonItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  dungeonImage: {
    width: '100%',
    height: 120,
  },
  dungeonOverlay: {
    padding: 12,
  },
  dungeonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dungeonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dungeonTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dungeonTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dungeonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dungeonInfoItem: {
    alignItems: 'center',
  },
  dungeonInfoLabel: {
    fontSize: 10,
    color: '#A89968',
    marginBottom: 4,
  },
  dungeonInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completionContainer: {
    marginTop: 4,
  },
  completionBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  completionFill: {
    height: '100%',
    backgroundColor: '#5ac93c',
  },
  completionText: {
    fontSize: 12,
    color: '#A89968',
    textAlign: 'right',
  },
  raidsList: {
    flex: 1,
  },
  raidsListContent: {
    padding: 16,
  },
  raidItem: {
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    position: 'relative',
  },
  selectedRaidItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  raidImage: {
    width: '100%',
    height: 120,
  },
  raidOverlay: {
    padding: 12,
  },
  raidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  raidName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  raidStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  raidStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  raidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  raidInfoItem: {
    alignItems: 'center',
  },
  raidInfoLabel: {
    fontSize: 10,
    color: '#A89968',
    marginBottom: 4,
  },
  raidInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trialsList: {
    flex: 1,
  },
  trialsListContent: {
    padding: 16,
  },
  trialItem: {
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedTrialItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  trialImage: {
    width: '100%',
    height: 120,
  },
  trialOverlay: {
    padding: 12,
  },
  trialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trialTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trialTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trialInfoItem: {
    alignItems: 'center',
  },
  trialInfoLabel: {
    fontSize: 10,
    color: '#A89968',
    marginBottom: 4,
  },
  trialInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailsContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
    padding: 16,
    maxHeight: '60%',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  detailsDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A89968',
    marginBottom: 8,
    marginTop: 8,
  },
  bossesList: {
    marginBottom: 16,
  },
  bossItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bossName: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  defeatedBossName: {
    textDecorationLine: 'line-through',
    color: '#A89968',
  },
  rewardsList: {
    marginBottom: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  raidActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  raidActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
    flex: 1,
    marginHorizontal: 4,
  },
  raidActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderColor: '#3A3A3A',
    opacity: 0.5,
  },
  trialDetails: {
    marginBottom: 16,
  },
  trialDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trialDetailContent: {
    marginLeft: 12,
  },
  trialDetailLabel: {
    fontSize: 12,
    color: '#A89968',
  },
  trialDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});