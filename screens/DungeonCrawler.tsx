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
import { Dungeon, DungeonRoom, DungeonEnemy, DungeonLoot, PlayerCharacter } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample dungeon data
const SAMPLE_DUNGEONS: Dungeon[] = [
  {
    id: 'dungeon_001',
    name: 'Stormveil Castle',
    description: 'The formidable castle of Godrick the Grafted. Ancient stone walls hide countless secrets and dangers.',
    level: 25,
    difficulty: 'Medium',
    type: 'Castle',
    rooms: 15,
    enemies: 45,
    boss: 'Godrick the Grafted',
    rewards: ['Godrick\'s Great Rune', 'Golden Seed', 'Ancient Dragon Smithing Stone'],
    estimatedTime: 45,
    maxPlayers: 4,
    currentPlayers: 1,
    status: 'available',
    discoveredRooms: 0,
    clearedRooms: 0,
  },
  {
    id: 'dungeon_002',
    name: 'Raya Lucaria Academy',
    description: 'The academy of glintstone sorcery. Crystal towers reach for the heavens, guarded by magical constructs.',
    level: 35,
    difficulty: 'Hard',
    type: 'Academy',
    rooms: 20,
    enemies: 60,
    boss: 'Rennala, Queen of the Full Moon',
    rewards: ['Great Rune of the Unborn', 'Glintstone Key', 'Memory Stone'],
    estimatedTime: 60,
    maxPlayers: 4,
    currentPlayers: 0,
    status: 'available',
    discoveredRooms: 0,
    clearedRooms: 0,
  },
  {
    id: 'dungeon_003',
    name: 'Leyndell, Royal Capital',
    description: 'The magnificent capital of the Erdtree. Golden spires and marble halls conceal the greatest threats.',
    level: 50,
    difficulty: 'Very Hard',
    type: 'Capital',
    rooms: 25,
    enemies: 80,
    boss: 'Godfrey, First Elden Lord',
    rewards: ['Elden Remembrance', 'Golden Seed', 'Sacred Tear'],
    estimatedTime: 90,
    maxPlayers: 6,
    currentPlayers: 0,
    status: 'locked',
    discoveredRooms: 0,
    clearedRooms: 0,
  },
];

// Sample dungeon rooms
const SAMPLE_ROOMS: DungeonRoom[] = [
  {
    id: 'room_001',
    name: 'Entrance Hall',
    description: 'The grand entrance hall of Stormveil Castle. Ancient banners hang from the walls.',
    type: 'entrance',
    enemies: [
      { id: 'enemy_001', name: 'Castle Guard', level: 20, health: 100, damage: 25, type: 'humanoid' },
      { id: 'enemy_002', name: 'Castle Guard', level: 20, health: 100, damage: 25, type: 'humanoid' },
    ],
    loot: [
      { id: 'loot_001', name: 'Golden Rune [1]', type: 'rune', value: 100, rarity: 'common' },
      { id: 'loot_002', name: 'Smithing Stone [1]', type: 'material', value: 200, rarity: 'uncommon' },
    ],
    cleared: false,
    discovered: true,
  },
  {
    id: 'room_002',
    name: 'Armory',
    description: 'A chamber filled with rusted weapons and armor. Some equipment might still be usable.',
    type: 'treasure',
    enemies: [],
    loot: [
      { id: 'loot_003', name: 'Bastard Sword', type: 'weapon', value: 1500, rarity: 'rare' },
      { id: 'loot_004', name: 'Leather Armor', type: 'armor', value: 800, rarity: 'uncommon' },
      { id: 'loot_005', name: 'Golden Rune [2]', type: 'rune', value: 200, rarity: 'common' },
    ],
    cleared: false,
    discovered: false,
  },
  {
    id: 'room_003',
    name: 'Grafted Scion Chamber',
    description: 'A large chamber where Godrick experiments with grafting. The air is thick with the stench of blood.',
    type: 'combat',
    enemies: [
      { id: 'enemy_003', name: 'Grafted Scion', level: 25, health: 150, damage: 35, type: 'grafted' },
      { id: 'enemy_004', name: 'Grafted Scion', level: 25, health: 150, damage: 35, type: 'grafted' },
      { id: 'enemy_005', name: 'Soldier of Godrick', level: 22, health: 120, damage: 30, type: 'humanoid' },
    ],
    loot: [
      { id: 'loot_006', name: 'Golden Rune [3]', type: 'rune', value: 300, rarity: 'common' },
      { id: 'loot_007', name: 'Smithing Stone [2]', type: 'material', value: 400, rarity: 'uncommon' },
    ],
    cleared: false,
    discovered: false,
  },
];

export default function DungeonCrawlerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [dungeons, setDungeons] = useState<Dungeon[]>(SAMPLE_DUNGEONS);
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [currentDungeon, setCurrentDungeon] = useState<Dungeon | null>(null);
  const [currentRoom, setCurrentRoom] = useState<DungeonRoom | null>(null);
  const [rooms, setRooms] = useState<DungeonRoom[]>([]);
  const [showDungeonDetails, setShowDungeonDetails] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showCombat, setShowCombat] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerLevel] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const startDungeon = (dungeon: Dungeon) => {
    if (dungeon.status === 'locked') {
      toast.error('This dungeon is locked! Complete prerequisites first.');
      return;
    }

    if (dungeon.level > playerLevel + 5) {
      toast.error('Your level is too low for this dungeon!');
      return;
    }

    setCurrentDungeon(dungeon);
    setRooms(SAMPLE_ROOMS);
    setCurrentRoom(SAMPLE_ROOMS[0]);
    setPlayerHealth(100);
    toast.success(`Entered ${dungeon.name}!`);
  };

  const enterRoom = (room: DungeonRoom) => {
    setCurrentRoom(room);

    if (!room.discovered) {
      // Mark room as discovered
      setRooms(prev => prev.map(r =>
        r.id === room.id ? { ...r, discovered: true } : r
      ));
    }

    if (room.enemies.length > 0) {
      setShowCombat(true);
    } else if (room.loot.length > 0) {
      setShowLoot(true);
    } else {
      // Empty room or safe room
      toast.info('This room appears to be empty...');
    }
  };

  const fightEnemies = () => {
    if (!currentRoom) return;

    // Simple combat simulation
    let playerDamage = 0;
    let enemyDamage = 0;

    currentRoom.enemies.forEach(enemy => {
      // Player attacks enemy
      const playerAttack = Math.floor(Math.random() * 30) + 20; // 20-50 damage
      enemy.health -= playerAttack;

      // Enemy attacks player if still alive
      if (enemy.health > 0) {
        const enemyAttack = Math.floor(Math.random() * enemy.damage) + 10;
        enemyDamage += enemyAttack;
      }
    });

    const newHealth = Math.max(0, playerHealth - enemyDamage);
    setPlayerHealth(newHealth);

    if (newHealth <= 0) {
      // Player died
      toast.error('You have fallen in battle!');
      exitDungeon();
      return;
    }

    // Check if all enemies are defeated
    const allDefeated = currentRoom.enemies.every(enemy => enemy.health <= 0);

    if (allDefeated) {
      // Mark room as cleared and show loot
      setRooms(prev => prev.map(r =>
        r.id === currentRoom.id ? { ...r, cleared: true } : r
      ));

      if (currentRoom.loot.length > 0) {
        setShowCombat(false);
        setShowLoot(true);
      } else {
        setShowCombat(false);
        toast.success('Room cleared! No loot found.');
      }
    } else {
      toast.info('Enemies still remain! Continue fighting.');
    }
  };

  const collectLoot = (loot: DungeonLoot) => {
    toast.success(`Collected ${loot.name}!`);

    // Remove loot from room
    if (currentRoom) {
      const updatedRoom = {
        ...currentRoom,
        loot: currentRoom.loot.filter(l => l.id !== loot.id)
      };
      setCurrentRoom(updatedRoom);
      setRooms(prev => prev.map(r => r.id === currentRoom.id ? updatedRoom : r));
    }
  };

  const exitDungeon = () => {
    setCurrentDungeon(null);
    setCurrentRoom(null);
    setRooms([]);
    setShowCombat(false);
    setShowLoot(false);
    setPlayerHealth(100);
    toast.info('Exited dungeon');
  };

  const filteredDungeons = dungeons.filter(dungeon => {
    const matchesSearch = dungeon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dungeon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || dungeon.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const renderDungeonItem = ({ item }: { item: Dungeon }) => {
    const canEnter = item.status !== 'locked' && item.level <= playerLevel + 5;

    return (
      <TouchableOpacity
        style={styles.dungeonItem}
        onPress={() => {
          setSelectedDungeon(item);
          setShowDungeonDetails(true);
        }}
      >
        <View style={styles.dungeonHeader}>
          <View style={[styles.dungeonIcon, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <FontAwesome5 name="dungeon" size={20} color="#D4AF37" />
          </View>
          <View style={styles.dungeonInfo}>
            <Text style={styles.dungeonName}>{item.name}</Text>
            <Text style={styles.dungeonType}>{item.type}</Text>
          </View>
          {item.status === 'locked' && (
            <View style={styles.lockedBadge}>
              <Ionicons name="lock-closed" size={16} color="#FF6347" />
            </View>
          )}
        </View>

        <Text style={styles.dungeonDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.dungeonStats}>
          <Text style={styles.dungeonLevel}>Lv.{item.level}+</Text>
          <Text style={[styles.dungeonDifficulty, { color: getDifficultyColor(item.difficulty) }]}>
            {item.difficulty}
          </Text>
          <Text style={styles.dungeonRooms}>{item.rooms} rooms</Text>
          <Text style={styles.dungeonTime}>{item.estimatedTime}min</Text>
        </View>

        <View style={styles.dungeonRewards}>
          <Text style={styles.rewardsTitle}>Rewards:</Text>
          <Text style={styles.rewardsList} numberOfLines={1}>
            {item.rewards.join(', ')}
          </Text>
        </View>

        {canEnter && (
          <TouchableOpacity
            style={styles.enterButton}
            onPress={() => startDungeon(item)}
          >
            <Text style={styles.enterButtonText}>Enter Dungeon</Text>
          </TouchableOpacity>
        )}

        {!canEnter && item.status !== 'locked' && (
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

  const renderDungeonDetailsModal = () => {
    if (!selectedDungeon) return null;

    return (
      <Modal
        visible={showDungeonDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDungeonDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dungeonDetailsContainer}>
            <View style={styles.dungeonDetailsHeader}>
              <Text style={styles.dungeonDetailsTitle}>Dungeon Details</Text>
              <TouchableOpacity onPress={() => setShowDungeonDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.dungeonDetailsContent}>
              <View style={styles.dungeonDetailHeader}>
                <View style={[styles.detailDungeonIcon, { backgroundColor: getDifficultyColor(selectedDungeon.difficulty) }]}>
                  <FontAwesome5 name="dungeon" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailDungeonInfo}>
                  <Text style={styles.detailDungeonName}>{selectedDungeon.name}</Text>
                  <Text style={styles.detailDungeonType}>{selectedDungeon.type}</Text>
                  <Text style={styles.detailDungeonBoss}>Boss: {selectedDungeon.boss}</Text>
                </View>
              </View>

              <Text style={styles.dungeonDetailDescription}>{selectedDungeon.description}</Text>

              <View style={styles.dungeonStatsSection}>
                <View style={styles.dungeonStatItem}>
                  <Ionicons name="trending-up" size={16} color="#A89968" />
                  <Text style={styles.dungeonStatText}>Level {selectedDungeon.level}+</Text>
                </View>
                <View style={styles.dungeonStatItem}>
                  <Ionicons name="time" size={16} color="#A89968" />
                  <Text style={styles.dungeonStatText}>{selectedDungeon.estimatedTime} minutes</Text>
                </View>
                <View style={styles.dungeonStatItem}>
                  <Ionicons name="people" size={16} color="#A89968" />
                  <Text style={styles.dungeonStatText}>
                    {selectedDungeon.currentPlayers}/{selectedDungeon.maxPlayers} players
                  </Text>
                </View>
                <View style={styles.dungeonStatItem}>
                  <Ionicons name="home" size={16} color="#A89968" />
                  <Text style={styles.dungeonStatText}>{selectedDungeon.rooms} rooms</Text>
                </View>
                <View style={styles.dungeonStatItem}>
                  <Ionicons name="skull" size={16} color="#A89968" />
                  <Text style={styles.dungeonStatText}>{selectedDungeon.enemies} enemies</Text>
                </View>
              </View>

              <View style={styles.rewardsSection}>
                <Text style={styles.sectionTitle}>Rewards</Text>
                {selectedDungeon.rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Ionicons name="gift" size={16} color="#FFD700" />
                    <Text style={styles.rewardText}>{reward}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.dungeonActions}>
                {selectedDungeon.status !== 'locked' && selectedDungeon.level <= playerLevel + 5 && (
                  <TouchableOpacity
                    style={styles.startDungeonButton}
                    onPress={() => {
                      setShowDungeonDetails(false);
                      startDungeon(selectedDungeon);
                    }}
                  >
                    <Text style={styles.startDungeonButtonText}>Start Dungeon</Text>
                  </TouchableOpacity>
                )}

                {selectedDungeon.status === 'locked' && (
                  <View style={styles.lockedMessage}>
                    <Ionicons name="lock-closed" size={24} color="#FF6347" />
                    <Text style={styles.lockedText}>Dungeon Locked</Text>
                    <Text style={styles.lockedSubtext}>Complete prerequisites to unlock</Text>
                  </View>
                )}

                {selectedDungeon.level > playerLevel + 5 && (
                  <View style={styles.levelWarning}>
                    <Ionicons name="warning" size={24} color="#FFD700" />
                    <Text style={styles.levelWarningText}>Level too low</Text>
                    <Text style={styles.levelWarningSubtext}>Reach level {selectedDungeon.level} to enter</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderRoomModal = () => {
    if (!currentRoom) return null;

    return (
      <Modal
        visible={showRoomDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRoomDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.roomContainer}>
            <View style={styles.roomHeader}>
              <Text style={styles.roomTitle}>{currentRoom.name}</Text>
              <TouchableOpacity onPress={() => setShowRoomDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.roomContent}>
              <Text style={styles.roomDescription}>{currentRoom.description}</Text>

              {currentRoom.enemies.length > 0 && (
                <View style={styles.enemiesSection}>
                  <Text style={styles.sectionTitle}>Enemies ({currentRoom.enemies.length})</Text>
                  {currentRoom.enemies.map((enemy) => (
                    <View key={enemy.id} style={styles.enemyItem}>
                      <View style={styles.enemyIcon}>
                        <FontAwesome5 name="skull" size={16} color="#FF6347" />
                      </View>
                      <View style={styles.enemyInfo}>
                        <Text style={styles.enemyName}>{enemy.name}</Text>
                        <Text style={styles.enemyStats}>
                          Lv.{enemy.level} • HP: {enemy.health} • DMG: {enemy.damage}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {currentRoom.loot.length > 0 && (
                <View style={styles.lootSection}>
                  <Text style={styles.sectionTitle}>Potential Loot</Text>
                  {currentRoom.loot.map((loot) => (
                    <View key={loot.id} style={styles.lootItem}>
                      <View style={styles.lootIcon}>
                        <Ionicons name="gift" size={16} color="#FFD700" />
                      </View>
                      <View style={styles.lootInfo}>
                        <Text style={styles.lootName}>{loot.name}</Text>
                        <Text style={styles.lootValue}>{loot.value} value</Text>
                      </View>
                      <View style={[styles.lootRarity, { backgroundColor: getRarityColor(loot.rarity) }]}>
                        <Text style={styles.lootRarityText}>{loot.rarity}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.enterRoomButton}
                onPress={() => {
                  setShowRoomDetails(false);
                  enterRoom(currentRoom);
                }}
              >
                <Text style={styles.enterRoomButtonText}>Enter Room</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCombatModal = () => {
    if (!currentRoom) return null;

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
              <Text style={styles.combatTitle}>Combat!</Text>
              <TouchableOpacity onPress={() => setShowCombat(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.combatContent}>
              <View style={styles.playerStatus}>
                <Text style={styles.playerHealthText}>Your Health: {playerHealth}/100</Text>
                <View style={styles.healthBar}>
                  <View style={[styles.healthFill, { width: `${playerHealth}%` }]} />
                </View>
              </View>

              <View style={styles.enemiesList}>
                <Text style={styles.sectionTitle}>Enemies</Text>
                {currentRoom.enemies.map((enemy) => (
                  <View key={enemy.id} style={styles.combatEnemy}>
                    <Text style={styles.enemyCombatName}>{enemy.name}</Text>
                    <Text style={styles.enemyCombatHealth}>
                      HP: {Math.max(0, enemy.health)}/{enemy.health}
                    </Text>
                    <View style={styles.enemyHealthBar}>
                      <View style={[styles.enemyHealthFill, { width: `${Math.max(0, (enemy.health / enemy.health) * 100)}%` }]} />
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.combatActions}>
                <TouchableOpacity
                  style={styles.attackButton}
                  onPress={fightEnemies}
                >
                  <Text style={styles.attackButtonText}>Attack</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fleeButton}
                  onPress={() => {
                    setShowCombat(false);
                    toast.info('Fled from combat!');
                  }}
                >
                  <Text style={styles.fleeButtonText}>Flee</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLootModal = () => {
    if (!currentRoom) return null;

    return (
      <Modal
        visible={showLoot}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoot(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.lootModalContainer}>
            <View style={styles.lootModalHeader}>
              <Text style={styles.lootModalTitle}>Loot Found!</Text>
              <TouchableOpacity onPress={() => setShowLoot(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.lootModalContent}>
              <Text style={styles.lootMessage}>You found the following items:</Text>

              {currentRoom.loot.map((loot) => (
                <View key={loot.id} style={styles.lootModalItem}>
                  <View style={styles.lootModalIcon}>
                    <Ionicons name="gift" size={24} color="#FFD700" />
                  </View>
                  <View style={styles.lootModalInfo}>
                    <Text style={styles.lootModalName}>{loot.name}</Text>
                    <Text style={styles.lootModalValue}>{loot.value} value</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.collectButton}
                    onPress={() => collectLoot(loot)}
                  >
                    <Text style={styles.collectButtonText}>Collect</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => setShowLoot(false)}
              >
                <Text style={styles.continueButtonText}>Continue Exploring</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#A89968';
      case 'uncommon': return '#32CD32';
      case 'rare': return '#4169E1';
      case 'epic': return '#9932CC';
      case 'legendary': return '#FFD700';
      default: return '#A89968';
    }
  };

  if (currentDungeon) {
    return (
      <ImageBackground
        source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20dungeon%20interior%20with%20stone%20walls%20and%20torches&aspect=9:16&seed=dungeon' }}
        style={styles.container}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <View style={styles.dungeonHeader}>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={exitDungeon}
            >
              <Ionicons name="exit" size={24} color="#FF6347" />
            </TouchableOpacity>
            <Text style={styles.dungeonTitle}>{currentDungeon.name}</Text>
            <View style={styles.dungeonStatsBar}>
              <Text style={styles.dungeonHealth}>HP: {playerHealth}/100</Text>
              <Text style={styles.dungeonProgress}>
                {rooms.filter(r => r.cleared).length}/{rooms.length} rooms
              </Text>
            </View>
          </View>

          <View style={styles.dungeonMap}>
            <Text style={styles.mapTitle}>Dungeon Map</Text>
            <View style={styles.roomsGrid}>
              {rooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  style={[
                    styles.roomNode,
                    room.discovered && styles.discoveredRoom,
                    room.cleared && styles.clearedRoom,
                    currentRoom?.id === room.id && styles.currentRoom
                  ]}
                  onPress={() => {
                    if (room.discovered) {
                      setCurrentRoom(room);
                      setShowRoomDetails(true);
                    }
                  }}
                >
                  <Text style={styles.roomNodeText}>
                    {room.cleared ? '✓' : room.discovered ? '?' : '???'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {currentRoom && (
            <View style={styles.currentRoomInfo}>
              <Text style={styles.currentRoomName}>{currentRoom.name}</Text>
              <Text style={styles.currentRoomDesc} numberOfLines={2}>
                {currentRoom.description}
              </Text>
              <View style={styles.roomActions}>
                {currentRoom.enemies.length > 0 && !currentRoom.cleared && (
                  <TouchableOpacity
                    style={styles.fightButton}
                    onPress={() => setShowCombat(true)}
                  >
                    <Text style={styles.fightButtonText}>Fight!</Text>
                  </TouchableOpacity>
                )}
                {currentRoom.loot.length > 0 && currentRoom.cleared && (
                  <TouchableOpacity
                    style={styles.lootButton}
                    onPress={() => setShowLoot(true)}
                  >
                    <Text style={styles.lootButtonText}>Check Loot</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </LinearGradient>

        {renderRoomModal()}
        {renderCombatModal()}
        {renderLootModal()}
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20dungeon%20entrance%20with%20ancient%20stones%20and%20mysterious%20glow&aspect=9:16&seed=dungeon' }}
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
          <Text style={styles.headerTitle}>DUNGEON CRAWLER</Text>
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

        <View style={styles.dungeonsContainer}>
          <Text style={styles.sectionTitle}>Available Dungeons ({filteredDungeons.length})</Text>
          <FlatList
            data={filteredDungeons}
            renderItem={renderDungeonItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.dungeonsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="dungeon" size={48} color="#666" />
                <Text style={styles.emptyText}>No dungeons found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('DungeonBoss')}
          >
            <FontAwesome5 name="crown" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Boss Fights</Text>
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

      {renderDungeonDetailsModal()}
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
  dungeonsContainer: {
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
  dungeonsList: {
    paddingBottom: 20,
  },
  dungeonItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  dungeonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dungeonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dungeonInfo: {
    flex: 1,
  },
  dungeonName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  dungeonType: {
    color: '#A89968',
    fontSize: 12,
  },
  lockedBadge: {
    marginLeft: 8,
  },
  dungeonDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  dungeonStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dungeonLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  dungeonDifficulty: {
    fontSize: 12,
    fontWeight: '600',
  },
  dungeonRooms: {
    color: '#A89968',
    fontSize: 12,
  },
  dungeonTime: {
    color: '#32CD32',
    fontSize: 12,
  },
  dungeonRewards: {
    marginBottom: 8,
  },
  rewardsTitle: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardsList: {
    color: '#A89968',
    fontSize: 12,
  },
  enterButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#000',
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
  dungeonDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  dungeonDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  dungeonDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  dungeonDetailsContent: {
    flex: 1,
  },
  dungeonDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailDungeonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailDungeonInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailDungeonName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailDungeonType: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  detailDungeonBoss: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '600',
  },
  dungeonDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  dungeonStatsSection: {
    marginBottom: 16,
  },
  dungeonStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dungeonStatText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
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
  dungeonActions: {
    marginTop: 20,
  },
  startDungeonButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  startDungeonButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lockedMessage: {
    alignItems: 'center',
    padding: 20,
  },
  lockedText: {
    color: '#FF6347',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  lockedSubtext: {
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
  dungeonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  exitButton: {
    padding: 8,
  },
  dungeonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  dungeonStatsBar: {
    alignItems: 'flex-end',
  },
  dungeonHealth: {
    color: '#32CD32',
    fontSize: 12,
    fontWeight: '600',
  },
  dungeonProgress: {
    color: '#A89968',
    fontSize: 12,
  },
  dungeonMap: {
    flex: 1,
    padding: 16,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 16,
    textAlign: 'center',
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  roomNode: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  discoveredRoom: {
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    borderColor: '#D4AF37',
  },
  clearedRoom: {
    backgroundColor: 'rgba(50, 205, 50, 0.3)',
    borderColor: '#32CD32',
  },
  currentRoom: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  roomNodeText: {
    color: '#A89968',
    fontSize: 12,
    fontWeight: 'bold',
  },
  currentRoomInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  currentRoomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  currentRoomDesc: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 12,
  },
  roomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fightButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  fightButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  lootButton: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  lootButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  roomContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '60%',
    padding: 16,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  roomContent: {
    flex: 1,
  },
  roomDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  enemiesSection: {
    marginBottom: 16,
  },
  enemyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  enemyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  enemyInfo: {
    flex: 1,
  },
  enemyName: {
    color: '#FF6347',
    fontSize: 14,
  },
  enemyStats: {
    color: '#A89968',
    fontSize: 12,
  },
  lootSection: {
    marginBottom: 16,
  },
  lootItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  lootIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  lootInfo: {
    flex: 1,
  },
  lootName: {
    color: '#FFD700',
    fontSize: 14,
  },
  lootValue: {
    color: '#A89968',
    fontSize: 12,
  },
  lootRarity: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lootRarityText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  enterRoomButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  enterRoomButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  combatContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
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
  playerStatus: {
    width: '100%',
    marginBottom: 20,
  },
  playerHealthText: {
    color: '#32CD32',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  healthBar: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#32CD32',
  },
  enemiesList: {
    width: '100%',
    marginBottom: 20,
  },
  combatEnemy: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  enemyCombatName: {
    color: '#FF6347',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  enemyCombatHealth: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 4,
  },
  enemyHealthBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  enemyHealthFill: {
    height: '100%',
    backgroundColor: '#FF6347',
  },
  combatActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  attackButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  attackButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  fleeButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#A89968',
  },
  fleeButtonText: {
    color: '#A89968',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  lootModalContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  lootModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  lootModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  lootModalContent: {
    alignItems: 'center',
  },
  lootMessage: {
    color: '#A89968',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  lootModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  lootModalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lootModalInfo: {
    flex: 1,
  },
  lootModalName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  lootModalValue: {
    color: '#A89968',
    fontSize: 12,
  },
  collectButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 8,
  },
  collectButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});