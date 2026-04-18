import React, { useState, useEffect } from 'react';
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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { DungeonBoss, BossFight, BossPhase, BossAbility } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample boss data
const SAMPLE_BOSSES: DungeonBoss[] = [
  {
    id: 'boss_001',
    name: 'Godrick the Grafted',
    description: 'The lord of Stormveil Castle. A grotesque fusion of limbs and flesh, wielding immense power.',
    level: 35,
    health: 5000,
    maxHealth: 5000,
    difficulty: 'Medium',
    location: 'Stormveil Castle',
    rewards: ['Godrick\'s Great Rune', 'Remembrance of the Grafted', 'Golden Seed'],
    phases: [
      {
        id: 'phase_1',
        name: 'First Phase',
        healthThreshold: 100,
        abilities: [
          { id: 'ability_1', name: 'Axe Slam', damage: 150, cooldown: 3, description: 'Powerful overhead strike' },
          { id: 'ability_2', name: 'Grafting Attack', damage: 200, cooldown: 5, description: 'Summons grafted arms' },
        ],
      },
      {
        id: 'phase_2',
        name: 'Second Phase',
        healthThreshold: 50,
        abilities: [
          { id: 'ability_3', name: 'Storm Assault', damage: 250, cooldown: 4, description: 'Charged lightning attack' },
          { id: 'ability_4', name: 'Nepheli\'s Help', damage: 0, cooldown: 10, description: 'Summons ally for aid' },
        ],
      },
    ],
    weaknesses: ['Fire', 'Lightning'],
    resistances: ['Physical', 'Poison'],
    status: 'available',
  },
  {
    id: 'boss_002',
    name: 'Rennala, Queen of the Full Moon',
    description: 'The queen of the Carian royals. A powerful sorceress who manipulates the very fabric of reality.',
    level: 45,
    health: 8000,
    maxHealth: 8000,
    difficulty: 'Hard',
    location: 'Raya Lucaria Academy',
    rewards: ['Remembrance of the Full Moon Queen', 'Great Rune of the Unborn', 'Glintstone Key'],
    phases: [
      {
        id: 'phase_1',
        name: 'Scholar Phase',
        healthThreshold: 75,
        abilities: [
          { id: 'ability_1', name: 'Glintstone Arc', damage: 180, cooldown: 2, description: 'Magical projectile barrage' },
          { id: 'ability_2', name: 'Full Moon', damage: 300, cooldown: 6, description: 'Massive magical explosion' },
        ],
      },
      {
        id: 'phase_2',
        name: 'Queen Phase',
        healthThreshold: 25,
        abilities: [
          { id: 'ability_3', name: 'Carian Greatsword', damage: 250, cooldown: 3, description: 'Physical sword strikes' },
          { id: 'ability_4', name: 'Rennala\'s Rise', damage: 400, cooldown: 8, description: 'Ultimate magical assault' },
        ],
      },
    ],
    weaknesses: ['Physical', 'Dark'],
    resistances: ['Magic', 'Lightning'],
    status: 'available',
  },
  {
    id: 'boss_003',
    name: 'Godfrey, First Elden Lord',
    description: 'The first Elden Lord, stripped of his grace. A legendary warrior who once ruled alongside Queen Marika.',
    level: 60,
    health: 15000,
    maxHealth: 15000,
    difficulty: 'Very Hard',
    location: 'Leyndell, Royal Capital',
    rewards: ['Remembrance of Hoarah Loux', 'Talisman of Great Strength', 'Sacred Tear'],
    phases: [
      {
        id: 'phase_1',
        name: 'Hoarah Loux',
        healthThreshold: 66,
        abilities: [
          { id: 'ability_1', name: 'War Cry', damage: 200, cooldown: 4, description: 'Increases attack power' },
          { id: 'ability_2', name: 'Stampede', damage: 350, cooldown: 6, description: 'Charging axe attack' },
        ],
      },
      {
        id: 'phase_2',
        name: 'Godfrey',
        healthThreshold: 33,
        abilities: [
          { id: 'ability_3', name: 'Golden Retaliation', damage: 400, cooldown: 5, description: 'Counterattack with golden aura' },
          { id: 'ability_4', name: 'Serpent Hunter', damage: 500, cooldown: 8, description: 'Summons spectral axes' },
        ],
      },
    ],
    weaknesses: ['Slash', 'Pierce'],
    resistances: ['Strike', 'Magic'],
    status: 'locked',
  },
];

export default function DungeonBossScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [bosses, setBosses] = useState<DungeonBoss[]>(SAMPLE_BOSSES);
  const [selectedBoss, setSelectedBoss] = useState<DungeonBoss | null>(null);
  const [currentFight, setCurrentFight] = useState<BossFight | null>(null);
  const [showBossDetails, setShowBossDetails] = useState(false);
  const [showCombat, setShowCombat] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerStamina, setPlayerStamina] = useState(100);
  const [playerLevel] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [fightLog, setFightLog] = useState<string[]>([]);

  const startBossFight = (boss: DungeonBoss) => {
    if (boss.status === 'locked') {
      toast.error('This boss is locked! Complete prerequisites first.');
      return;
    }

    if (boss.level > playerLevel + 10) {
      toast.error('Your level is too low for this boss!');
      return;
    }

    const fight: BossFight = {
      id: `fight_${Date.now()}`,
      bossId: boss.id,
      playerId: 'player_1',
      startTime: new Date(),
      currentPhase: 0,
      playerHealth: 100,
      bossHealth: boss.health,
      status: 'active',
    };

    setCurrentFight(fight);
    setPlayerHealth(100);
    setPlayerStamina(100);
    setFightLog([`Fight started against ${boss.name}!`]);
    setShowCombat(true);
    toast.success(`Boss fight started: ${boss.name}!`);
  };

  const performAttack = (damage: number, staminaCost: number) => {
    if (!currentFight || !selectedBoss) return;

    if (playerStamina < staminaCost) {
      toast.error('Not enough stamina!');
      return;
    }

    // Player attacks boss
    const actualDamage = Math.floor(damage * (0.8 + Math.random() * 0.4)); // 80-120% damage
    const newBossHealth = Math.max(0, currentFight.bossHealth - actualDamage);

    // Update fight
    const updatedFight = {
      ...currentFight,
      bossHealth: newBossHealth,
    };
    setCurrentFight(updatedFight);

    // Update stamina
    setPlayerStamina(prev => Math.max(0, prev - staminaCost));

    // Add to fight log
    setFightLog(prev => [...prev, `You dealt ${actualDamage} damage!`]);

    // Check for phase change
    const currentPhase = selectedBoss.phases[currentFight.currentPhase];
    const healthPercent = (newBossHealth / selectedBoss.maxHealth) * 100;

    if (healthPercent <= currentPhase.healthThreshold && currentFight.currentPhase < selectedBoss.phases.length - 1) {
      const nextPhase = currentFight.currentPhase + 1;
      updatedFight.currentPhase = nextPhase;
      setCurrentFight(updatedFight);
      setFightLog(prev => [...prev, `${selectedBoss.name} enters ${selectedBoss.phases[nextPhase].name}!`]);
    }

    // Boss attacks back
    setTimeout(() => {
      bossAttack();
    }, 1000);

    // Check for victory
    if (newBossHealth <= 0) {
      setTimeout(() => {
        endFight(true);
      }, 1500);
    }
  };

  const bossAttack = () => {
    if (!currentFight || !selectedBoss) return;

    const currentPhase = selectedBoss.phases[currentFight.currentPhase];
    const availableAbilities = currentPhase.abilities.filter(ability =>
      !ability.cooldown || Math.random() > 0.3 // 70% chance to use ability
    );

    if (availableAbilities.length === 0) return;

    const randomAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
    const damage = Math.floor(randomAbility.damage * (0.8 + Math.random() * 0.4));

    const newPlayerHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(newPlayerHealth);

    setFightLog(prev => [...prev, `${selectedBoss.name} uses ${randomAbility.name} for ${damage} damage!`]);

    // Check for defeat
    if (newPlayerHealth <= 0) {
      setTimeout(() => {
        endFight(false);
      }, 1000);
    }
  };

  const useItem = (itemType: string) => {
    switch (itemType) {
      case 'health':
        if (playerHealth >= 100) {
          toast.error('Health already full!');
          return;
        }
        setPlayerHealth(prev => Math.min(100, prev + 30));
        setFightLog(prev => [...prev, 'Used healing item! Restored 30 HP.']);
        break;
      case 'stamina':
        if (playerStamina >= 100) {
          toast.error('Stamina already full!');
          return;
        }
        setPlayerStamina(prev => Math.min(100, prev + 50));
        setFightLog(prev => [...prev, 'Used stamina item! Restored 50 stamina.']);
        break;
    }
  };

  const endFight = (victory: boolean) => {
    if (victory) {
      setShowCombat(false);
      setShowVictory(true);
      setFightLog(prev => [...prev, `Victory! ${selectedBoss?.name} has been defeated!`]);
      toast.success('Boss defeated!');

      // Update boss status
      if (selectedBoss) {
        setBosses(prev => prev.map(boss =>
          boss.id === selectedBoss.id ? { ...boss, status: 'defeated' } : boss
        ));
      }
    } else {
      setShowCombat(false);
      setFightLog(prev => [...prev, 'Defeat! You have fallen in battle.']);
      toast.error('Boss fight failed!');
    }

    setCurrentFight(null);
  };

  const collectRewards = () => {
    if (!selectedBoss) return;

    toast.success(`Collected rewards: ${selectedBoss.rewards.join(', ')}`);
    setShowVictory(false);
    setSelectedBoss(null);
  };

  const filteredBosses = bosses.filter(boss => {
    const matchesSearch = boss.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         boss.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || boss.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const renderBossItem = ({ item }: { item: DungeonBoss }) => {
    const canFight = item.status !== 'locked' && item.level <= playerLevel + 10;

    return (
      <TouchableOpacity
        style={styles.bossItem}
        onPress={() => {
          setSelectedBoss(item);
          setShowBossDetails(true);
        }}
      >
        <View style={styles.bossHeader}>
          <View style={[styles.bossIcon, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <FontAwesome5 name="crown" size={20} color="#D4AF37" />
          </View>
          <View style={styles.bossInfo}>
            <Text style={styles.bossName}>{item.name}</Text>
            <Text style={styles.bossLocation}>{item.location}</Text>
          </View>
          {item.status === 'locked' && (
            <View style={styles.lockedBadge}>
              <Ionicons name="lock-closed" size={16} color="#FF6347" />
            </View>
          )}
          {item.status === 'defeated' && (
            <View style={styles.defeatedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#32CD32" />
            </View>
          )}
        </View>

        <Text style={styles.bossDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bossStats}>
          <Text style={styles.bossLevel}>Lv.{item.level}</Text>
          <Text style={[styles.bossDifficulty, { color: getDifficultyColor(item.difficulty) }]}>
            {item.difficulty}
          </Text>
          <Text style={styles.bossHealth}>HP: {item.health.toLocaleString()}</Text>
        </View>

        <View style={styles.bossPhases}>
          <Text style={styles.phasesTitle}>Phases: {item.phases.length}</Text>
        </View>

        {canFight && item.status !== 'defeated' && (
          <TouchableOpacity
            style={styles.fightButton}
            onPress={() => startBossFight(item)}
          >
            <Text style={styles.fightButtonText}>Fight Boss</Text>
          </TouchableOpacity>
        )}

        {item.status === 'defeated' && (
          <View style={styles.defeatedMessage}>
            <Text style={styles.defeatedText}>✓ Defeated</Text>
          </View>
        )}

        {!canFight && item.status !== 'locked' && (
          <View style={styles.requirementWarning}>
            <Text style={styles.requirementText}>
              Requires Level {item.level}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#32CD32';
      case 'Medium': return '#FFD700';
      case 'Hard': return '#FF6347';
      case 'Very Hard': return '#DC143C';
      default: return '#A89968';
    }
  };

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
          <View style={styles.bossDetailsContainer}>
            <View style={styles.bossDetailsHeader}>
              <Text style={styles.bossDetailsTitle}>Boss Details</Text>
              <TouchableOpacity onPress={() => setShowBossDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.bossDetailsContent}>
              <View style={styles.bossDetailHeader}>
                <View style={[styles.detailBossIcon, { backgroundColor: getDifficultyColor(selectedBoss.difficulty) }]}>
                  <FontAwesome5 name="crown" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailBossInfo}>
                  <Text style={styles.detailBossName}>{selectedBoss.name}</Text>
                  <Text style={styles.detailBossLocation}>{selectedBoss.location}</Text>
                  <Text style={styles.detailBossHealth}>
                    Health: {selectedBoss.health.toLocaleString()}
                  </Text>
                </View>
              </View>

              <Text style={styles.bossDetailDescription}>{selectedBoss.description}</Text>

              <View style={styles.bossStatsSection}>
                <View style={styles.bossStatItem}>
                  <Ionicons name="trending-up" size={16} color="#A89968" />
                  <Text style={styles.bossStatText}>Level {selectedBoss.level}</Text>
                </View>
                <View style={styles.bossStatItem}>
                  <Ionicons name="heart" size={16} color="#A89968" />
                  <Text style={styles.bossStatText}>Health {selectedBoss.health.toLocaleString()}</Text>
                </View>
                <View style={styles.bossStatItem}>
                  <Ionicons name="layers" size={16} color="#A89968" />
                  <Text style={styles.bossStatText}>{selectedBoss.phases.length} Phases</Text>
                </View>
              </View>

              <View style={styles.phasesSection}>
                <Text style={styles.sectionTitle}>Phases</Text>
                {selectedBoss.phases.map((phase, index) => (
                  <View key={phase.id} style={styles.phaseItem}>
                    <Text style={styles.phaseName}>{phase.name}</Text>
                    <Text style={styles.phaseThreshold}>
                      Activates at {phase.healthThreshold}% HP
                    </Text>
                    <View style={styles.phaseAbilities}>
                      {phase.abilities.map((ability) => (
                        <View key={ability.id} style={styles.abilityItem}>
                          <Text style={styles.abilityName}>{ability.name}</Text>
                          <Text style={styles.abilityDamage}>DMG: {ability.damage}</Text>
                          <Text style={styles.abilityDesc}>{ability.description}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.weaknessesSection}>
                <Text style={styles.sectionTitle}>Weaknesses</Text>
                <View style={styles.weaknessList}>
                  {selectedBoss.weaknesses.map((weakness, index) => (
                    <View key={index} style={styles.weaknessTag}>
                      <Text style={styles.weaknessText}>{weakness}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.resistancesSection}>
                <Text style={styles.sectionTitle}>Resistances</Text>
                <View style={styles.resistanceList}>
                  {selectedBoss.resistances.map((resistance, index) => (
                    <View key={index} style={styles.resistanceTag}>
                      <Text style={styles.resistanceText}>{resistance}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.rewardsSection}>
                <Text style={styles.sectionTitle}>Rewards</Text>
                {selectedBoss.rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Ionicons name="gift" size={16} color="#FFD700" />
                    <Text style={styles.rewardText}>{reward}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.bossActions}>
                {selectedBoss.status !== 'locked' && selectedBoss.level <= playerLevel + 10 && selectedBoss.status !== 'defeated' && (
                  <TouchableOpacity
                    style={styles.startFightButton}
                    onPress={() => {
                      setShowBossDetails(false);
                      startBossFight(selectedBoss);
                    }}
                  >
                    <Text style={styles.startFightButtonText}>Start Boss Fight</Text>
                  </TouchableOpacity>
                )}

                {selectedBoss.status === 'defeated' && (
                  <View style={styles.defeatedStatus}>
                    <Ionicons name="checkmark-circle" size={24} color="#32CD32" />
                    <Text style={styles.defeatedStatusText}>Boss Defeated</Text>
                  </View>
                )}

                {selectedBoss.status === 'locked' && (
                  <View style={styles.lockedStatus}>
                    <Ionicons name="lock-closed" size={24} color="#FF6347" />
                    <Text style={styles.lockedStatusText}>Boss Locked</Text>
                    <Text style={styles.lockedStatusSubtext}>Complete prerequisites</Text>
                  </View>
                )}

                {selectedBoss.level > playerLevel + 10 && (
                  <View style={styles.levelWarning}>
                    <Ionicons name="warning" size={24} color="#FFD700" />
                    <Text style={styles.levelWarningText}>Level too low</Text>
                    <Text style={styles.levelWarningSubtext}>Reach level {selectedBoss.level} to challenge</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCombatModal = () => {
    if (!currentFight || !selectedBoss) return null;

    const currentPhase = selectedBoss.phases[currentFight.currentPhase];
    const bossHealthPercent = (currentFight.bossHealth / selectedBoss.maxHealth) * 100;

    return (
      <Modal
        visible={showCombat}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCombat(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.combatContainer}>
            <View style={styles.combatHeader}>
              <Text style={styles.combatTitle}>Boss Fight: {selectedBoss.name}</Text>
              <TouchableOpacity onPress={() => setShowCombat(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.combatContent}>
              <View style={styles.bossStatus}>
                <Text style={styles.bossNameCombat}>{selectedBoss.name}</Text>
                <Text style={styles.bossPhase}>Phase: {currentPhase.name}</Text>
                <Text style={styles.bossHealthCombat}>
                  HP: {currentFight.bossHealth.toLocaleString()} / {selectedBoss.maxHealth.toLocaleString()}
                </Text>
                <View style={styles.bossHealthBar}>
                  <View style={[styles.bossHealthFill, { width: `${bossHealthPercent}%` }]} />
                </View>
              </View>

              <View style={styles.playerStatus}>
                <Text style={styles.playerHealthText}>Your Health: {playerHealth}/100</Text>
                <View style={styles.playerHealthBar}>
                  <View style={[styles.playerHealthFill, { width: `${playerHealth}%` }]} />
                </View>
                <Text style={styles.playerStaminaText}>Stamina: {playerStamina}/100</Text>
                <View style={styles.playerStaminaBar}>
                  <View style={[styles.playerStaminaFill, { width: `${playerStamina}%` }]} />
                </View>
              </View>

              <View style={styles.combatActions}>
                <TouchableOpacity
                  style={styles.attackButton}
                  onPress={() => performAttack(50, 20)}
                >
                  <Text style={styles.attackButtonText}>Light Attack</Text>
                  <Text style={styles.attackCost}>20 Stamina</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.attackButton}
                  onPress={() => performAttack(80, 35)}
                >
                  <Text style={styles.attackButtonText}>Heavy Attack</Text>
                  <Text style={styles.attackCost}>35 Stamina</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.itemButton}
                  onPress={() => useItem('health')}
                >
                  <Text style={styles.itemButtonText}>Heal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.itemButton}
                  onPress={() => useItem('stamina')}
                >
                  <Text style={styles.itemButtonText}>Restore Stamina</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fightLog}>
                <Text style={styles.fightLogTitle}>Combat Log</Text>
                <ScrollView style={styles.fightLogContent}>
                  {fightLog.slice(-5).map((log, index) => (
                    <Text key={index} style={styles.fightLogEntry}>{log}</Text>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderVictoryModal = () => {
    if (!selectedBoss) return null;

    return (
      <Modal
        visible={showVictory}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVictory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.victoryContainer}>
            <View style={styles.victoryContent}>
              <View style={styles.victoryIcon}>
                <FontAwesome5 name="crown" size={64} color="#FFD700" />
              </View>

              <Text style={styles.victoryTitle}>Victory!</Text>
              <Text style={styles.victoryBoss}>{selectedBoss.name} Defeated</Text>

              <View style={styles.rewardsList}>
                <Text style={styles.rewardsTitle}>Rewards Earned:</Text>
                {selectedBoss.rewards.map((reward, index) => (
                  <View key={index} style={styles.victoryReward}>
                    <Ionicons name="gift" size={20} color="#FFD700" />
                    <Text style={styles.victoryRewardText}>{reward}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.collectRewardsButton}
                onPress={collectRewards}
              >
                <Text style={styles.collectRewardsButtonText}>Collect Rewards</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20boss%20arena%20with%20massive%20creature%20and%20golden%20light&aspect=9:16&seed=boss' }}
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
          <Text style={styles.headerTitle}>BOSS FIGHTS</Text>
          <View style={styles.headerStats}>
            <Text style={styles.playerLevel}>Lv.{playerLevel}</Text>
          </View>
        </View>

        <View style={styles.filters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyFilter}>
            {['All', 'Easy', 'Medium', 'Hard', 'Very Hard'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[styles.filterButton, selectedDifficulty === difficulty && styles.selectedFilter]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={[styles.filterText, selectedDifficulty === difficulty && styles.selectedFilterText]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bossesContainer}>
          <Text style={styles.sectionTitle}>Bosses ({filteredBosses.length})</Text>
          <FlatList
            data={filteredBosses}
            renderItem={renderBossItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bossesList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="crown" size={48} color="#666" />
                <Text style={styles.emptyText}>No bosses found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('DungeonCrawler')}
          >
            <FontAwesome5 name="dungeon" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Dungeons</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="map" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>World Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="settings" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderBossDetailsModal()}
      {renderCombatModal()}
      {renderVictoryModal()}
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
  headerStats: {
    alignItems: 'center',
  },
  playerLevel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  filters: {
    marginBottom: 16,
  },
  difficultyFilter: {
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedFilter: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filterText: {
    color: '#A89968',
    fontSize: 12,
  },
  selectedFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  bossesContainer: {
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
  bossesList: {
    paddingBottom: 20,
  },
  bossItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bossIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bossInfo: {
    flex: 1,
  },
  bossName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  bossLocation: {
    color: '#A89968',
    fontSize: 12,
  },
  lockedBadge: {
    marginLeft: 8,
  },
  defeatedBadge: {
    marginLeft: 8,
  },
  bossDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  bossStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bossLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  bossDifficulty: {
    fontSize: 12,
    fontWeight: '600',
  },
  bossHealth: {
    color: '#FF6347',
    fontSize: 12,
  },
  bossPhases: {
    marginBottom: 8,
  },
  phasesTitle: {
    color: '#A89968',
    fontSize: 12,
  },
  fightButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  fightButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  defeatedMessage: {
    backgroundColor: 'rgba(50, 205, 50, 0.2)',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#32CD32',
  },
  defeatedText: {
    color: '#32CD32',
    fontSize: 12,
    fontWeight: '600',
  },
  requirementWarning: {
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  requirementText: {
    color: '#FF6347',
    fontSize: 12,
    fontWeight: '600',
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
  bossDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  bossDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  bossDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  bossDetailsContent: {
    flex: 1,
  },
  bossDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailBossIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailBossInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailBossName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailBossLocation: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  detailBossHealth: {
    color: '#FF6347',
    fontSize: 14,
  },
  bossDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  bossStatsSection: {
    marginBottom: 16,
  },
  bossStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bossStatText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  phasesSection: {
    marginBottom: 16,
  },
  phaseItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  phaseName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phaseThreshold: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 8,
  },
  phaseAbilities: {
    marginTop: 8,
  },
  abilityItem: {
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
  },
  abilityName: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '600',
  },
  abilityDamage: {
    color: '#A89968',
    fontSize: 12,
  },
  abilityDesc: {
    color: '#A89968',
    fontSize: 12,
    fontStyle: 'italic',
  },
  weaknessesSection: {
    marginBottom: 16,
  },
  weaknessList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weaknessTag: {
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  weaknessText: {
    color: '#FF6347',
    fontSize: 12,
  },
  resistancesSection: {
    marginBottom: 16,
  },
  resistanceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resistanceTag: {
    backgroundColor: 'rgba(32, 205, 50, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  resistanceText: {
    color: '#32CD32',
    fontSize: 12,
  },
  rewardsSection: {
    marginBottom: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 8,
  },
  bossActions: {
    marginTop: 20,
  },
  startFightButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  startFightButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  defeatedStatus: {
    alignItems: 'center',
    padding: 20,
  },
  defeatedStatusText: {
    color: '#32CD32',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  lockedStatus: {
    alignItems: 'center',
    padding: 20,
  },
  lockedStatusText: {
    color: '#FF6347',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  lockedStatusSubtext: {
    color: '#A89968',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  levelWarning: {
    alignItems: 'center',
    padding: 20,
  },
  levelWarningText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  levelWarningSubtext: {
    color: '#A89968',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  combatContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 16,
  },
  combatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  combatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  combatContent: {
    alignItems: 'center',
  },
  bossStatus: {
    width: '100%',
    marginBottom: 20,
  },
  bossNameCombat: {
    color: '#FF6347',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  bossPhase: {
    color: '#FFD700',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  bossHealthCombat: {
    color: '#A89968',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  bossHealthBar: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bossHealthFill: {
    height: '100%',
    backgroundColor: '#FF6347',
  },
  playerStatus: {
    width: '100%',
    marginBottom: 20,
  },
  playerHealthText: {
    color: '#32CD32',
    fontSize: 14,
    marginBottom: 4,
  },
  playerHealthBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  playerHealthFill: {
    height: '100%',
    backgroundColor: '#32CD32',
  },
  playerStaminaText: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 4,
  },
  playerStaminaBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  playerStaminaFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  combatActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  attackButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    margin: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  attackButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  attackCost: {
    color: '#000',
    fontSize: 10,
  },
  itemButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    margin: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  itemButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  fightLog: {
    width: '100%',
    maxHeight: 100,
  },
  fightLogTitle: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  fightLogContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    padding: 8,
    maxHeight: 80,
  },
  fightLogEntry: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 2,
  },
  victoryContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  victoryContent: {
    alignItems: 'center',
  },
  victoryIcon: {
    marginBottom: 16,
  },
  victoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  victoryBoss: {
    fontSize: 18,
    color: '#D4AF37',
    marginBottom: 20,
  },
  rewardsList: {
    width: '100%',
    marginBottom: 20,
  },
  rewardsTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  victoryReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  victoryRewardText: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 8,
  },
  collectRewardsButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  collectRewardsButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});