import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PlayerCharacter, 
  CharacterClass, 
  CharacterRace, 
  PlayerStats, 
  PlayerResources, 
  PlayerProgress, 
  Covenant, 
  WorldRegion,
  DifficultyMode,
  GameSettings,
  Quest,
  Dungeon,
  Raid,
  Trial,
  Tower,
  WorldBoss,
  Party,
  Guild
} from './gameTypes';

interface GameContextType {
  // Player data
  player: PlayerCharacter | null;
  createCharacter: (name: string, race: CharacterRace, characterClass: CharacterClass) => void;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updatePlayerResources: (resources: Partial<PlayerResources>) => void;
  updatePlayerProgress: (progress: Partial<PlayerProgress>) => void;
  
  // Game world
  worldBosses: WorldBoss[];
  activeRegion: WorldRegion | null;
  setActiveRegion: (region: WorldRegion) => void;
  
  // Quests
  availableQuests: Quest[];
  activeQuests: Quest[];
  completeQuest: (questId: string) => void;
  acceptQuest: (questId: string) => void;
  updateQuestObjective: (questId: string, objectiveId: string, progress?: number) => void;
  
  // Dungeons & Raids
  availableDungeons: Dungeon[];
  availableRaids: Raid[];
  availableTrials: Trial[];
  tower: Tower | null;
  enterDungeon: (dungeonId: string) => void;
  enterRaid: (raidId: string) => void;
  enterTrial: (trialId: string) => void;
  enterTowerFloor: (floor: number) => void;
  
  // Multiplayer
  party: Party | null;
  createParty: (name: string) => void;
  joinParty: (partyId: string) => void;
  leaveParty: () => void;
  inviteToParty: (playerId: string) => void;
  
  guild: Guild | null;
  createGuild: (name: string, tag: string, description: string) => void;
  joinGuild: (guildId: string) => void;
  leaveGuild: () => void;
  
  // Game settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  
  // Save & Load
  saveGame: (autoSave?: boolean) => void;
  loadGame: (saveId: string) => void;
  deleteSave: (saveId: string) => void;
  
  // Game state
  isLoading: boolean;
  gameMessage: string | null;
  setGameMessage: (message: string | null) => void;
  
  // Difficulty
  difficulty: DifficultyMode;
  setDifficulty: (mode: DifficultyMode) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  // Player state
  const [player, setPlayer] = useState<PlayerCharacter | null>(null);
  
  // World state
  const [worldBosses, setWorldBosses] = useState<WorldBoss[]>([]);
  const [activeRegion, setActiveRegion] = useState<WorldRegion | null>(null);
  
  // Quest state
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  
  // Dungeon state
  const [availableDungeons, setAvailableDungeons] = useState<Dungeon[]>([]);
  const [availableRaids, setAvailableRaids] = useState<Raid[]>([]);
  const [availableTrials, setAvailableTrials] = useState<Trial[]>([]);
  const [tower, setTower] = useState<Tower | null>(null);
  
  // Multiplayer state
  const [party, setParty] = useState<Party | null>(null);
  const [guild, setGuild] = useState<Guild | null>(null);
  
  // Game settings
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: DifficultyMode.NORMAL,
    graphics: {
      quality: 'medium',
      effects: true,
      shadows: true,
      antialiasing: true,
    },
    audio: {
      master: 100,
      music: 80,
      sfx: 100,
      voice: 100,
      ambient: 90,
    },
    gameplay: {
      autoSave: true,
      autoSaveInterval: 5,
      showTutorials: true,
      showHints: true,
      showDamageNumbers: true,
      showHealthBars: true,
    },
    controls: {
      invertY: false,
      sensitivity: 50,
      vibration: true,
      autoTarget: true,
    },
    accessibility: {
      colorblindMode: 'none',
      textSize: 'medium',
      highContrast: false,
      reducedMotion: false,
    },
  });
  
  // Game state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  
  // Difficulty
  const [difficulty, setDifficulty] = useState<DifficultyMode>(DifficultyMode.NORMAL);
  
  // Initialize game data
  useEffect(() => {
    // This would typically load from an API or local storage
    // For now, we'll just set up some initial state
    setActiveRegion(WorldRegion.LIMGRAVE);
    setDifficulty(DifficultyMode.NORMAL);
    
    // Initialize with some sample data
    initializeGameData();
  }, []);
  
  const initializeGameData = () => {
    // This would be replaced with actual API calls or data loading
    console.log('Initializing game data...');
    
    // Sample world bosses
    const sampleWorldBosses: WorldBoss[] = [
      {
        id: 'boss-1',
        name: 'Godrick the Grafted',
        description: 'A demigod who grafted the limbs of countless heroes onto his body.',
        level: 25,
        region: WorldRegion.LIMGRAVE,
        location: { x: 100, y: 50, z: 0 },
        health: 10000,
        maxHealth: 10000,
        phases: [
          {
            healthThreshold: 0.7,
            name: 'Phase 1',
            description: 'Godrick fights with his many grafted limbs.',
            abilities: ['Whirlwind Slash', 'Ground Pound', 'Fire Breath'],
          },
          {
            healthThreshold: 0.3,
            name: 'Phase 2',
            description: 'Godrick grafts a dragon head to his arm.',
            abilities: ['Dragon Fire', 'Wind Slash', 'Earthquake'],
          },
        ],
        rewards: {
          guaranteed: [
            { itemId: 'remembrance-godrick', quantity: 1 },
          ],
          possible: [
            { itemId: 'godrick-axe', quantity: 1, dropChance: 0.1 },
            { itemId: 'godrick-armor', quantity: 1, dropChance: 0.05 },
          ],
          runes: { min: 20000, max: 25000 },
          experience: 5000,
        },
        respawnTime: 168, // 7 days in hours
      },
      // Add more world bosses here
    ];
    
    setWorldBosses(sampleWorldBosses);
    
    // Sample quests
    const sampleQuests: Quest[] = [
      {
        id: 'quest-main-1',
        name: 'The Call of the Shattered',
        description: 'Investigate the source of the Shattering and find the first Great Rune.',
        type: 'main',
        giver: 'Melina',
        location: WorldRegion.LIMGRAVE,
        objectives: [
          {
            id: 'obj-1',
            description: 'Reach Stormveil Castle',
            completed: false,
          },
          {
            id: 'obj-2',
            description: 'Defeat Margit, the Fell Omen',
            completed: false,
          },
          {
            id: 'obj-3',
            description: 'Defeat Godrick the Grafted',
            completed: false,
          },
          {
            id: 'obj-4',
            description: 'Claim Godrick\'s Great Rune',
            completed: false,
          },
        ],
        rewards: {
          runes: 50000,
          items: [
            { itemId: 'godrick-rune', quantity: 1 },
            { itemId: 'golden-seed', quantity: 3 },
          ],
          experience: 10000,
          reputation: {
            covenant: Covenant.ROUNDTABLE_HOLD,
            amount: 500,
          },
        },
        prerequisites: {
          level: 1,
        },
        status: 'available',
      },
      // Add more quests here
    ];
    
    setAvailableQuests(sampleQuests);
    
    // Sample dungeons
    const sampleDungeons: Dungeon[] = [
      {
        id: 'dungeon-1',
        name: 'Murkwater Catacombs',
        description: 'Ancient burial grounds filled with undead and traps.',
        type: DungeonType.CATACOMBS,
        region: WorldRegion.LIMGRAVE,
        minLevel: 10,
        recommendedLevel: 15,
        playerLimit: {
          min: 1,
          max: 4,
        },
        bosses: ['Cemetery Shade'],
        rewards: {
          guaranteed: [
            { itemId: 'sacred-tear', quantity: 1 },
          ],
          possible: [
            { itemId: 'ghostflame-torch', quantity: 1, dropChance: 0.2 },
            { itemId: 'grave-glovewort', quantity: 3, dropChance: 0.5 },
          ],
          runes: { min: 5000, max: 8000 },
          experience: 2000,
        },
        unlockRequirements: {
          level: 10,
        },
        resetTimer: 24, // 24 hours
      },
      // Add more dungeons here
    ];
    
    setAvailableDungeons(sampleDungeons);
    
    // Sample raids
    const sampleRaids: Raid[] = [
      {
        id: 'raid-1',
        name: 'Leyndell, Royal Capital',
        description: 'The golden capital of the Erdtree, now in ruins.',
        type: DungeonType.LEGACY,
        region: WorldRegion.ALTUS_PLATEAU,
        minLevel: 60,
        recommendedLevel: 70,
        playerLimit: {
          min: 8,
          max: 12,
        },
        bosses: ['Godfrey, First Elden Lord', 'Morgott, the Omen King'],
        rewards: {
          guaranteed: [
            { itemId: 'morgott-remembrance', quantity: 1 },
          ],
          possible: [
            { itemId: 'morgott-sword', quantity: 1, dropChance: 0.1 },
            { itemId: 'blessed-dew-talisman', quantity: 1, dropChance: 0.05 },
          ],
          runes: { min: 100000, max: 150000 },
          experience: 20000,
        },
        unlockRequirements: {
          quests: ['quest-main-3'],
          level: 60,
        },
        resetTimer: 168, // 7 days in hours
        phases: [
          {
            name: 'The Royal Avenue',
            description: 'Fight through the streets of Leyndell.',
            bosses: ['Tree Sentinel Duo'],
            mechanics: ['Coordinated Attacks', 'Lightning Strikes'],
          },
          {
            name: 'The Erdtree Sanctuary',
            description: 'Navigate the inner sanctum of the royal palace.',
            bosses: ['Godfrey, First Elden Lord'],
            mechanics: ['Ground Stomps', 'Phase Transition', 'Arena Hazards'],
          },
          {
            name: 'The Throne Room',
            description: 'Face Morgott in the final confrontation.',
            bosses: ['Morgott, the Omen King'],
            mechanics: ['Holy Weapons', 'Multiple Attack Patterns', 'Arena-wide AoE'],
          },
        ],
        lockoutPeriod: 168, // 7 days in hours
      },
      // Add more raids here
    ];
    
    setAvailableRaids(sampleRaids);
    
    // Sample trials
    const sampleTrials: Trial[] = [
      {
        id: 'trial-1',
        name: 'Evergaol: Crucible Knight',
        description: 'Face the ancient Crucible Knight in magical imprisonment.',
        type: DungeonType.EVERGAOL,
        region: WorldRegion.LIMGRAVE,
        minLevel: 30,
        recommendedLevel: 40,
        playerLimit: {
          min: 1,
          max: 8,
        },
        bosses: ['Crucible Knight'],
        rewards: {
          guaranteed: [
            { itemId: 'aspects-of-the-crucible-tail', quantity: 1 },
          ],
          possible: [
            { itemId: 'crucible-knight-armor', quantity: 1, dropChance: 0.1 },
          ],
          runes: { min: 15000, max: 20000 },
          experience: 5000,
        },
        unlockRequirements: {
          level: 30,
        },
        resetTimer: 72, // 3 days in hours
        timeLimit: 15, // 15 minutes
        challenges: [
          {
            name: 'Flawless Victory',
            description: 'Defeat the Crucible Knight without taking damage.',
            reward: {
              itemId: 'crucible-feather-talisman',
              quantity: 1,
            },
          },
          {
            name: 'Speed Run',
            description: 'Defeat the Crucible Knight in under 3 minutes.',
            reward: {
              itemId: 'crucible-knight-sword',
              quantity: 1,
            },
          },
        ],
      },
      // Add more trials here
    ];
    
    setAvailableTrials(sampleTrials);
    
    // Sample tower
    const sampleTower: Tower = {
      id: 'tower-1',
      name: 'Tower of the Stargazer',
      description: 'A mysterious tower with 100 floors, each more challenging than the last.',
      floors: 100,
      currentFloor: 1,
      floorDetails: [
        {
          number: 1,
          enemies: ['Godrick Soldier', 'Noble Sorcerer'],
          cleared: false,
        },
        {
          number: 2,
          enemies: ['Raya Lucaria Sorcerer', 'Carian Knight'],
          cleared: false,
        },
        // More floors would be defined here
        {
          number: 10,
          enemies: ['Carian Knight Captain'],
          boss: 'Royal Revenant',
          cleared: false,
          rewards: [
            { itemId: 'stargazer-heirloom', quantity: 1 },
          ],
        },
        // ... and so on up to floor 100
      ],
      resetTimer: 30, // 30 days
    };
    
    setTower(sampleTower);
  };
  
  // Character creation
  const createCharacter = (name: string, race: CharacterRace, characterClass: CharacterClass) => {
    setIsLoading(true);
    
    // This would typically involve an API call
    // For now, we'll just create a character object locally
    
    // Default stats based on class
    let baseStats: PlayerStats = {
      vigor: 10,
      mind: 10,
      endurance: 10,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      faith: 10,
      arcane: 10,
    };
    
    // Adjust stats based on class
    switch (characterClass) {
      case CharacterClass.WARRIOR:
        baseStats.strength = 14;
        baseStats.dexterity = 13;
        break;
      case CharacterClass.KNIGHT:
        baseStats.vigor = 12;
        baseStats.strength = 12;
        baseStats.endurance = 12;
        break;
      case CharacterClass.ASTROLOGER:
        baseStats.intelligence = 16;
        baseStats.mind = 15;
        break;
      // Add more class-specific stat adjustments
    }
    
    // Adjust stats based on race
    switch (race) {
      case CharacterRace.HUMAN:
        // Balanced stats
        baseStats.vigor += 1;
        baseStats.endurance += 1;
        break;
      case CharacterRace.ELF:
        baseStats.dexterity += 2;
        baseStats.intelligence += 1;
        break;
      case CharacterRace.DWARF:
        baseStats.strength += 2;
        baseStats.endurance += 1;
        break;
      // Add more race-specific stat adjustments
    }
    
    // Create character
    const newCharacter: PlayerCharacter = {
      id: `player-${Date.now()}`,
      name,
      race,
      class: characterClass,
      stats: baseStats,
      resources: {
        health: 100 + baseStats.vigor * 10,
        maxHealth: 100 + baseStats.vigor * 10,
        mana: 50 + baseStats.mind * 5,
        maxMana: 50 + baseStats.mind * 5,
        stamina: 100 + baseStats.endurance * 5,
        maxStamina: 100 + baseStats.endurance * 5,
        focus: 100,
        maxFocus: 100,
        runes: 0,
      },
      progress: {
        level: 1,
        experience: 0,
        experienceToNextLevel: 1000,
        skillPoints: 0,
        attributePoints: 0,
        reputation: {
          [Covenant.GOLDEN_ORDER]: 0,
          [Covenant.VOLCANO_MANOR]: 0,
          [Covenant.FINGERS_OF_CHAOS]: 0,
          [Covenant.ACADEMY_OF_RAYA_LUCARIA]: 0,
          [Covenant.MOHGWYN_DYNASTY]: 0,
          [Covenant.ERDTREE_SENTINELS]: 0,
          [Covenant.ROUNDTABLE_HOLD]: 0,
          [Covenant.FRENZIED_FLAME]: 0,
        },
        discoveredRegions: [WorldRegion.LIMGRAVE],
        unlockedFastTravelPoints: ['first-step'],
        completedDungeons: [],
        defeatedBosses: [],
        completedQuests: [],
      },
      equipment: {},
      inventory: {
        weapons: [],
        armor: [],
        consumables: [],
        materials: [],
        keyItems: [],
      },
      activeQuests: [],
      completedQuests: [],
      skills: [],
      achievements: [],
      createdAt: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      playTime: 0,
    };
    
    setPlayer(newCharacter);
    setGameMessage(`Character ${name} created successfully!`);
    setIsLoading(false);
  };
  
  // Update player stats
  const updatePlayerStats = (stats: Partial<PlayerStats>) => {
    if (!player) return;
    
    setPlayer({
      ...player,
      stats: {
        ...player.stats,
        ...stats,
      },
    });
  };
  
  // Update player resources
  const updatePlayerResources = (resources: Partial<PlayerResources>) => {
    if (!player) return;
    
    setPlayer({
      ...player,
      resources: {
        ...player.resources,
        ...resources,
      },
    });
  };
  
  // Update player progress
  const updatePlayerProgress = (progress: Partial<PlayerProgress>) => {
    if (!player) return;
    
    setPlayer({
      ...player,
      progress: {
        ...player.progress,
        ...progress,
      },
    });
  };
  
  // Quest management
  const acceptQuest = (questId: string) => {
    const quest = availableQuests.find(q => q.id === questId);
    if (!quest || !player) return;
    
    // Check prerequisites
    if (quest.prerequisites.level && player.progress.level < quest.prerequisites.level) {
      setGameMessage(`You need to be level ${quest.prerequisites.level} to accept this quest.`);
      return;
    }
    
    if (quest.prerequisites.quests && quest.prerequisites.quests.some(q => !player.completedQuests.includes(q))) {
      setGameMessage('You have not completed the required quests to accept this quest.');
      return;
    }
    
    if (quest.prerequisites.covenant && (!player.covenant || player.progress.reputation[quest.prerequisites.covenant.name] < quest.prerequisites.covenant.level)) {
      setGameMessage(`You need higher reputation with ${quest.prerequisites.covenant.name} to accept this quest.`);
      return;
    }
    
    // Accept the quest
    const updatedQuest = { ...quest, status: 'active' as const };
    setActiveQuests([...activeQuests, updatedQuest]);
    setAvailableQuests(availableQuests.filter(q => q.id !== questId));
    
    if (player) {
      setPlayer({
        ...player,
        activeQuests: [...player.activeQuests, updatedQuest],
      });
    }
    
    setGameMessage(`Quest accepted: ${quest.name}`);
  };
  
  const updateQuestObjective = (questId: string, objectiveId: string, progress?: number) => {
    const questIndex = activeQuests.findIndex(q => q.id === questId);
    if (questIndex === -1 || !player) return;
    
    const quest = activeQuests[questIndex];
    const objectiveIndex = quest.objectives.findIndex(o => o.id === objectiveId);
    if (objectiveIndex === -1) return;
    
    const updatedQuest = { ...quest };
    
    if (progress !== undefined && updatedQuest.objectives[objectiveIndex].progress) {
      updatedQuest.objectives[objectiveIndex].progress = {
        ...updatedQuest.objectives[objectiveIndex].progress!,
        current: Math.min(progress, updatedQuest.objectives[objectiveIndex].progress!.required),
      };
      
      // Check if the objective is completed
      if (updatedQuest.objectives[objectiveIndex].progress!.current >= updatedQuest.objectives[objectiveIndex].progress!.required) {
        updatedQuest.objectives[objectiveIndex].completed = true;
      }
    } else {
      updatedQuest.objectives[objectiveIndex].completed = true;
    }
    
    // Check if all objectives are completed
    const allCompleted = updatedQuest.objectives.every(o => o.completed);
    
    if (allCompleted) {
      // Complete the quest
      completeQuest(questId);
    } else {
      // Update the quest
      const updatedActiveQuests = [...activeQuests];
      updatedActiveQuests[questIndex] = updatedQuest;
      setActiveQuests(updatedActiveQuests);
      
      // Update player's active quests
      const playerQuestIndex = player.activeQuests.findIndex(q => q.id === questId);
      if (playerQuestIndex !== -1) {
        const updatedPlayerQuests = [...player.activeQuests];
        updatedPlayerQuests[playerQuestIndex] = updatedQuest;
        
        setPlayer({
          ...player,
          activeQuests: updatedPlayerQuests,
        });
      }
      
      setGameMessage(`Quest objective updated: ${updatedQuest.objectives[objectiveIndex].description}`);
    }
  };
  
  const completeQuest = (questId: string) => {
    const questIndex = activeQuests.findIndex(q => q.id === questId);
    if (questIndex === -1 || !player) return;
    
    const quest = activeQuests[questIndex];
    
    // Remove from active quests
    const updatedActiveQuests = activeQuests.filter(q => q.id !== questId);
    setActiveQuests(updatedActiveQuests);
    
    // Add to completed quests
    const updatedPlayer = {
      ...player,
      activeQuests: player.activeQuests.filter(q => q.id !== questId),
      completedQuests: [...player.completedQuests, questId],
      resources: {
        ...player.resources,
        runes: player.resources.runes + quest.rewards.runes,
      },
      progress: {
        ...player.progress,
        experience: player.progress.experience + quest.rewards.experience,
        completedQuests: [...player.progress.completedQuests, questId],
      },
    };
    
    // Update reputation if applicable
    if (quest.rewards.reputation) {
      updatedPlayer.progress.reputation = {
        ...updatedPlayer.progress.reputation,
        [quest.rewards.reputation.covenant]: (updatedPlayer.progress.reputation[quest.rewards.reputation.covenant] || 0) + quest.rewards.reputation.amount,
      };
    }
    
    // Check if player leveled up
    if (updatedPlayer.progress.experience >= updatedPlayer.progress.experienceToNextLevel) {
      updatedPlayer.progress.level += 1;
      updatedPlayer.progress.experience -= updatedPlayer.progress.experienceToNextLevel;
      updatedPlayer.progress.experienceToNextLevel = Math.floor(updatedPlayer.progress.experienceToNextLevel * 1.2);
      updatedPlayer.progress.attributePoints += 1;
      
      setGameMessage(`Quest completed: ${quest.name}. You leveled up to level ${updatedPlayer.progress.level}!`);
    } else {
      setGameMessage(`Quest completed: ${quest.name}`);
    }
    
    setPlayer(updatedPlayer);
  };
  
  // Dungeon management
  const enterDungeon = (dungeonId: string) => {
    const dungeon = availableDungeons.find(d => d.id === dungeonId);
    if (!dungeon || !player) return;
    
    // Check requirements
    if (player.progress.level < dungeon.minLevel) {
      setGameMessage(`You need to be at least level ${dungeon.minLevel} to enter this dungeon.`);
      return;
    }
    
    if (dungeon.unlockRequirements.quests && dungeon.unlockRequirements.quests.some(q => !player.completedQuests.includes(q))) {
      setGameMessage('You have not completed the required quests to enter this dungeon.');
      return;
    }
    
    if (dungeon.unlockRequirements.items && dungeon.unlockRequirements.items.some(i => !player.inventory.keyItems.some(ki => ki.id === i))) {
      setGameMessage('You do not have the required items to enter this dungeon.');
      return;
    }
    
    // In a real game, this would navigate to the dungeon screen
    setGameMessage(`Entering dungeon: ${dungeon.name}`);
  };
  
  const enterRaid = (raidId: string) => {
    const raid = availableRaids.find(r => r.id === raidId);
    if (!raid || !player) return;
    
    // Check requirements
    if (player.progress.level < raid.minLevel) {
      setGameMessage(`You need to be at least level ${raid.minLevel} to enter this raid.`);
      return;
    }
    
    if (!party) {
      setGameMessage('You need to be in a party to enter a raid.');
      return;
    }
    
    if (party.members.length < raid.playerLimit.min) {
      setGameMessage(`You need at least ${raid.playerLimit.min} players to enter this raid.`);
      return;
    }
    
    // In a real game, this would navigate to the raid screen
    setGameMessage(`Entering raid: ${raid.name}`);
  };
  
  const enterTrial = (trialId: string) => {
    const trial = availableTrials.find(t => t.id === trialId);
    if (!trial || !player) return;
    
    // Check requirements
    if (player.progress.level < trial.minLevel) {
      setGameMessage(`You need to be at least level ${trial.minLevel} to enter this trial.`);
      return;
    }
    
    // In a real game, this would navigate to the trial screen
    setGameMessage(`Entering trial: ${trial.name}`);
  };
  
  const enterTowerFloor = (floor: number) => {
    if (!tower || !player) return;
    
    if (floor > tower.floors) {
      setGameMessage(`The tower only has ${tower.floors} floors.`);
      return;
    }
    
    if (floor > tower.currentFloor) {
      setGameMessage(`You need to clear floor ${tower.currentFloor} first.`);
      return;
    }
    
    // In a real game, this would navigate to the tower floor screen
    setGameMessage(`Entering tower floor ${floor}`);
  };
  
  // Party management
  const createParty = (name: string) => {
    if (!player) return;
    
    const newParty: Party = {
      id: `party-${Date.now()}`,
      name,
      leader: player.id,
      members: [player.id],
      maxSize: 4,
      isPrivate: false,
      invites: [],
    };
    
    setParty(newParty);
    setGameMessage(`Party "${name}" created.`);
  };
  
  const joinParty = (partyId: string) => {
    // In a real game, this would involve API calls
    setGameMessage('Joined party.');
  };
  
  const leaveParty = () => {
    if (!party || !player) return;
    
    if (party.leader === player.id) {
      // Disband party if leader leaves
      setParty(null);
      setGameMessage('Party disbanded.');
    } else {
      // In a real game, this would involve API calls
      setParty(null);
      setGameMessage('Left party.');
    }
  };
  
  const inviteToParty = (playerId: string) => {
    if (!party || !player || party.leader !== player.id) return;
    
    // In a real game, this would involve API calls
    setGameMessage(`Invited player to party.`);
  };
  
  // Guild management
  const createGuild = (name: string, tag: string, description: string) => {
    if (!player) return;
    
    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name,
      tag,
      leader: player.id,
      officers: [],
      members: [player.id],
      level: 1,
      experience: 0,
      experienceToNextLevel: 10000,
      createdAt: new Date().toISOString(),
      description,
      achievements: [],
      treasury: {
        runes: 0,
        items: [],
      },
    };
    
    setGuild(newGuild);
    setGameMessage(`Guild "${name}" created.`);
  };
  
  const joinGuild = (guildId: string) => {
    // In a real game, this would involve API calls
    setGameMessage('Joined guild.');
  };
  
  const leaveGuild = () => {
    if (!guild || !player) return;
    
    if (guild.leader === player.id) {
      // Can't leave if leader
      setGameMessage('You cannot leave the guild as the leader. Transfer leadership first.');
      return;
    }
    
    // In a real game, this would involve API calls
    setGuild(null);
    setGameMessage('Left guild.');
  };
  
  // Game settings
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings({
      ...settings,
      ...newSettings,
    });
    
    // Apply difficulty setting if changed
    if (newSettings.difficulty) {
      setDifficulty(newSettings.difficulty);
    }
    
    setGameMessage('Settings updated.');
  };
  
  // Save & Load
  const saveGame = (autoSave = false) => {
    if (!player) return;
    
    // In a real game, this would involve API calls or local storage
    setGameMessage(autoSave ? 'Game auto-saved.' : 'Game saved.');
  };
  
  const loadGame = (saveId: string) => {
    // In a real game, this would involve API calls or local storage
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setGameMessage('Game loaded.');
    }, 1000);
  };
  
  const deleteSave = (saveId: string) => {
    // In a real game, this would involve API calls or local storage
    setGameMessage('Save deleted.');
  };
  
  const value = {
    // Player data
    player,
    createCharacter,
    updatePlayerStats,
    updatePlayerResources,
    updatePlayerProgress,
    
    // Game world
    worldBosses,
    activeRegion,
    setActiveRegion,
    
    // Quests
    availableQuests,
    activeQuests,
    completeQuest,
    acceptQuest,
    updateQuestObjective,
    
    // Dungeons & Raids
    availableDungeons,
    availableRaids,
    availableTrials,
    tower,
    enterDungeon,
    enterRaid,
    enterTrial,
    enterTowerFloor,
    
    // Multiplayer
    party,
    createParty,
    joinParty,
    leaveParty,
    inviteToParty,
    
    guild,
    createGuild,
    joinGuild,
    leaveGuild,
    
    // Game settings
    settings,
    updateSettings,
    
    // Save & Load
    saveGame,
    loadGame,
    deleteSave,
    
    // Game state
    isLoading,
    gameMessage,
    setGameMessage,
    
    // Difficulty
    difficulty,
    setDifficulty,
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};