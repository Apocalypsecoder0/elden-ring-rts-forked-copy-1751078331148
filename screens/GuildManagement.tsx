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
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Import game types
import { Guild, GuildMember, GuildRank, GuildApplication } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample existing guilds
const SAMPLE_GUILDS: Guild[] = [
  {
    id: 'guild_001',
    name: 'Order of the Erdtree',
    leaderId: 'player_2',
    description: 'A noble guild dedicated to protecting the Erdtree and maintaining order in the Lands Between.',
    level: 45,
    memberCount: 28,
    maxMembers: 50,
    reputation: 8500,
    founded: new Date('2023-06-15'),
    banner: 'erdtree',
    requirements: {
      level: 30,
      reputation: 1000,
    },
    ranks: [
      { id: 'rank_1', name: 'Grandmaster', permissions: ['all'], color: '#FFD700' },
      { id: 'rank_2', name: 'Elder', permissions: ['invite', 'kick', 'manage'], color: '#C0C0C0' },
      { id: 'rank_3', name: 'Knight', permissions: ['invite'], color: '#CD7F32' },
      { id: 'rank_4', name: 'Member', permissions: [], color: '#A89968' },
    ],
    members: [
      { id: 'player_2', name: 'Erdtree Guardian', level: 50, rank: 'Grandmaster', joinedAt: new Date('2023-06-15'), contribution: 2500 },
      { id: 'player_3', name: 'Golden Knight', level: 45, rank: 'Elder', joinedAt: new Date('2023-07-01'), contribution: 1800 },
      { id: 'player_4', name: 'Tree Sentinel', level: 42, rank: 'Knight', joinedAt: new Date('2023-08-15'), contribution: 1200 },
    ],
    treasury: 50000,
    activities: ['Boss Raids', 'Exploration', 'Defense'],
  },
  {
    id: 'guild_002',
    name: 'Blood Oath Covenant',
    leaderId: 'player_5',
    description: 'A fierce guild of warriors bound by blood oaths, specializing in combat and conquest.',
    level: 38,
    memberCount: 22,
    maxMembers: 40,
    reputation: 6200,
    founded: new Date('2023-08-20'),
    banner: 'blood',
    requirements: {
      level: 25,
      reputation: 500,
    },
    ranks: [
      { id: 'rank_1', name: 'Blood Lord', permissions: ['all'], color: '#DC143C' },
      { id: 'rank_2', name: 'Captain', permissions: ['invite', 'kick'], color: '#8B0000' },
      { id: 'rank_3', name: 'Warrior', permissions: [], color: '#A89968' },
    ],
    members: [
      { id: 'player_5', name: 'Blood Oath Keeper', level: 48, rank: 'Blood Lord', joinedAt: new Date('2023-08-20'), contribution: 2200 },
      { id: 'player_6', name: 'Crimson Blade', level: 40, rank: 'Captain', joinedAt: new Date('2023-09-01'), contribution: 1500 },
    ],
    treasury: 35000,
    activities: ['PvP', 'Boss Fights', 'Conquest'],
  },
];

// Sample available players for recruitment
const AVAILABLE_RECRUITS = [
  { id: 'player_7', name: 'Mystic Wanderer', level: 32, reputation: 1200, status: 'online' },
  { id: 'player_8', name: 'Storm Caller', level: 35, reputation: 1800, status: 'online' },
  { id: 'player_9', name: 'Shadow Assassin', level: 28, reputation: 800, status: 'away' },
  { id: 'player_10', name: 'Crystal Mage', level: 41, reputation: 2500, status: 'online' },
  { id: 'player_11', name: 'Beast Tamer', level: 29, reputation: 950, status: 'busy' },
];

const GUILD_BANNERS = ['erdtree', 'blood', 'moonlight', 'fire', 'storm', 'crystal', 'shadow', 'golden'];

export default function GuildManagementScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [guilds, setGuilds] = useState<Guild[]>(SAMPLE_GUILDS);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [showGuildDetails, setShowGuildDetails] = useState(false);
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [showRecruitPlayers, setShowRecruitPlayers] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [guildName, setGuildName] = useState('');
  const [guildDescription, setGuildDescription] = useState('');
  const [selectedBanner, setSelectedBanner] = useState('erdtree');
  const [minLevel, setMinLevel] = useState<number>(20);
  const [minReputation, setMinReputation] = useState<number>(500);
  const [applications, setApplications] = useState<GuildApplication[]>([]);

  const createGuild = () => {
    if (!guildName.trim()) {
      toast.error('Please enter a guild name!');
      return;
    }

    if (guilds.some(g => g.name.toLowerCase() === guildName.toLowerCase())) {
      toast.error('A guild with this name already exists!');
      return;
    }

    const newGuild: Guild = {
      id: `guild_${Date.now()}`,
      name: guildName,
      leaderId: 'player_1',
      description: guildDescription,
      level: 1,
      memberCount: 1,
      maxMembers: 30,
      reputation: 0,
      founded: new Date(),
      banner: selectedBanner,
      requirements: {
        level: minLevel,
        reputation: minReputation,
      },
      ranks: [
        { id: 'rank_1', name: 'Guild Master', permissions: ['all'], color: '#FFD700' },
        { id: 'rank_2', name: 'Officer', permissions: ['invite', 'kick', 'manage'], color: '#C0C0C0' },
        { id: 'rank_3', name: 'Veteran', permissions: ['invite'], color: '#CD7F32' },
        { id: 'rank_4', name: 'Member', permissions: [], color: '#A89968' },
      ],
      members: [
        { id: 'player_1', name: 'Tarnished Hero', level: 25, rank: 'Guild Master', joinedAt: new Date(), contribution: 0 },
      ],
      treasury: 1000,
      activities: ['Exploration', 'Quests'],
    };

    setGuilds(prev => [...prev, newGuild]);
    setShowCreateGuild(false);
    setGuildName('');
    setGuildDescription('');
    toast.success('Guild created successfully!');
  };

  const joinGuild = (guild: Guild) => {
    if (guild.memberCount >= guild.maxMembers) {
      toast.error('Guild is full!');
      return;
    }

    // Check requirements
    if (25 < guild.requirements.level) {
      toast.error(`You need to be level ${guild.requirements.level} to join this guild!`);
      return;
    }

    if (0 < guild.requirements.reputation) {
      toast.error(`You need ${guild.requirements.reputation} reputation to join this guild!`);
      return;
    }

    const newMember: GuildMember = {
      id: 'player_1',
      name: 'Tarnished Hero',
      level: 25,
      rank: 'Member',
      joinedAt: new Date(),
      contribution: 0,
    };

    const updatedGuild = {
      ...guild,
      members: [...guild.members, newMember],
      memberCount: guild.memberCount + 1,
    };

    setGuilds(prev => prev.map(g => g.id === guild.id ? updatedGuild : g));
    toast.success(`Joined ${guild.name}!`);
  };

  const leaveGuild = (guild: Guild) => {
    Alert.alert(
      'Leave Guild',
      'Are you sure you want to leave this guild? You will lose all guild benefits.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            const updatedGuild = {
              ...guild,
              members: guild.members.filter(m => m.id !== 'player_1'),
              memberCount: guild.memberCount - 1,
            };

            setGuilds(prev => prev.map(g => g.id === guild.id ? updatedGuild : g));
            toast.info('Left guild');
          }
        }
      ]
    );
  };

  const applyToGuild = (guild: Guild) => {
    const newApplication: GuildApplication = {
      id: `application_${Date.now()}`,
      guildId: guild.id,
      applicantId: 'player_1',
      applicantName: 'Tarnished Hero',
      applicantLevel: 25,
      applicantReputation: 0,
      message: 'I wish to join your esteemed guild.',
      status: 'pending',
      appliedAt: new Date(),
    };

    setApplications(prev => [...prev, newApplication]);
    toast.success(`Application sent to ${guild.name}!`);
  };

  const recruitPlayer = (player: { id: string; name: string; level: number; reputation: number; status: string }) => {
    if (!selectedGuild) return;

    if (player.level < selectedGuild.requirements.level) {
      toast.error(`${player.name} doesn't meet the level requirement!`);
      return;
    }

    if (player.reputation < selectedGuild.requirements.reputation) {
      toast.error(`${player.name} doesn't meet the reputation requirement!`);
      return;
    }

    const newMember: GuildMember = {
      id: player.id,
      name: player.name,
      level: player.level,
      rank: 'Member',
      joinedAt: new Date(),
      contribution: 0,
    };

    const updatedGuild = {
      ...selectedGuild,
      members: [...selectedGuild.members, newMember],
      memberCount: selectedGuild.memberCount + 1,
    };

    setGuilds(prev => prev.map(g => g.id === selectedGuild.id ? updatedGuild : g));
    toast.success(`Recruited ${player.name} to ${selectedGuild.name}!`);
  };

  const filteredGuilds = guilds.filter(guild => {
    const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guild.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderGuildItem = ({ item }: { item: Guild }) => {
    const isMember = item.members.some(m => m.id === 'player_1');
    const isLeader = item.leaderId === 'player_1';
    const hasApplied = applications.some(a => a.guildId === item.id && a.applicantId === 'player_1');
    const canJoin = !isMember && !hasApplied && item.memberCount < item.maxMembers;

    return (
      <TouchableOpacity
        style={styles.guildItem}
        onPress={() => {
          setSelectedGuild(item);
          setShowGuildDetails(true);
        }}
      >
        <View style={styles.guildHeader}>
          <View style={[styles.guildBanner, { backgroundColor: getBannerColor(item.banner) }]}>
            <FontAwesome5 name="fort-awesome" size={20} color="#D4AF37" />
          </View>
          <View style={styles.guildInfo}>
            <Text style={styles.guildName}>{item.name}</Text>
            <Text style={styles.guildLeader}>
              Leader: {item.members.find(m => m.id === item.leaderId)?.name || 'Unknown'}
            </Text>
          </View>
          {isMember && (
            <View style={styles.memberBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#32CD32" />
            </View>
          )}
        </View>

        <Text style={styles.guildDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.guildStats}>
          <Text style={styles.guildMembers}>
            {item.memberCount}/{item.maxMembers} members
          </Text>
          <Text style={styles.guildLevel}>Lv.{item.level}</Text>
          <Text style={styles.guildReputation}>{item.reputation} rep</Text>
        </View>

        {canJoin && (
          <View style={styles.guildActions}>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => joinGuild(item)}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => applyToGuild(item)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasApplied && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Application Pending</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getBannerColor = (banner: string) => {
    const colors: { [key: string]: string } = {
      erdtree: '#228B22',
      blood: '#DC143C',
      moonlight: '#E6E6FA',
      fire: '#FF4500',
      storm: '#4682B4',
      crystal: '#9370DB',
      shadow: '#2F4F4F',
      golden: '#FFD700',
    };
    return colors[banner] || '#666';
  };

  const renderGuildDetailsModal = () => {
    if (!selectedGuild) return null;

    const isMember = selectedGuild.members.some(m => m.id === 'player_1');
    const isLeader = selectedGuild.leaderId === 'player_1';
    const canRecruit = isMember && selectedGuild.memberCount < selectedGuild.maxMembers;

    return (
      <Modal
        visible={showGuildDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuildDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guildDetailsContainer}>
            <View style={styles.guildDetailsHeader}>
              <Text style={styles.guildDetailsTitle}>Guild Details</Text>
              <TouchableOpacity onPress={() => setShowGuildDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.guildDetailsContent}>
              <View style={styles.guildDetailHeader}>
                <View style={[styles.detailGuildBanner, { backgroundColor: getBannerColor(selectedGuild.banner) }]}>
                  <FontAwesome5 name="fort-awesome" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailGuildInfo}>
                  <Text style={styles.detailGuildName}>{selectedGuild.name}</Text>
                  <Text style={styles.detailGuildLeader}>
                    Leader: {selectedGuild.members.find(m => m.id === selectedGuild.leaderId)?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.detailGuildMembers}>
                    {selectedGuild.memberCount}/{selectedGuild.maxMembers} Members
                  </Text>
                </View>
              </View>

              <Text style={styles.guildDetailDescription}>{selectedGuild.description}</Text>

              <View style={styles.guildStatsSection}>
                <View style={styles.guildStatItem}>
                  <Ionicons name="trending-up" size={16} color="#A89968" />
                  <Text style={styles.guildStatText}>Level {selectedGuild.level}</Text>
                </View>
                <View style={styles.guildStatItem}>
                  <Ionicons name="star" size={16} color="#A89968" />
                  <Text style={styles.guildStatText}>{selectedGuild.reputation} Reputation</Text>
                </View>
                <View style={styles.guildStatItem}>
                  <Ionicons name="wallet" size={16} color="#A89968" />
                  <Text style={styles.guildStatText}>{selectedGuild.treasury} Gold</Text>
                </View>
                <View style={styles.guildStatItem}>
                  <Ionicons name="time" size={16} color="#A89968" />
                  <Text style={styles.guildStatText}>
                    Founded {selectedGuild.founded.toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.requirementsSection}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                <View style={styles.requirementItem}>
                  <Ionicons name="trending-up" size={16} color="#A89968" />
                  <Text style={styles.requirementText}>Level {selectedGuild.requirements.level}+</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons name="star" size={16} color="#A89968" />
                  <Text style={styles.requirementText}>{selectedGuild.requirements.reputation} Reputation</Text>
                </View>
              </View>

              <View style={styles.activitiesSection}>
                <Text style={styles.sectionTitle}>Activities</Text>
                <View style={styles.activitiesList}>
                  {selectedGuild.activities.map((activity, index) => (
                    <View key={index} style={styles.activityTag}>
                      <Text style={styles.activityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.membersSection}>
                <Text style={styles.sectionTitle}>Members ({selectedGuild.members.length})</Text>
                {selectedGuild.members.map((member) => (
                  <View key={member.id} style={styles.memberItem}>
                    <View style={styles.memberAvatar}>
                      <FontAwesome5 name="user" size={16} color="#D4AF37" />
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberDetails}>
                        Level {member.level} • {member.contribution} contribution
                      </Text>
                    </View>
                    <View style={[styles.memberRank, { backgroundColor: selectedGuild.ranks.find(r => r.name === member.rank)?.color || '#A89968' }]}>
                      <Text style={styles.memberRankText}>{member.rank}</Text>
                    </View>
                    {member.id === selectedGuild.leaderId && (
                      <View style={styles.leaderBadge}>
                        <Ionicons name="crown" size={14} color="#FFD700" />
                      </View>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.guildActions}>
                {canRecruit && (
                  <TouchableOpacity
                    style={styles.recruitButton}
                    onPress={() => setShowRecruitPlayers(true)}
                  >
                    <Text style={styles.recruitButtonText}>Recruit Players</Text>
                  </TouchableOpacity>
                )}

                {isLeader && (
                  <TouchableOpacity
                    style={styles.manageButton}
                    onPress={() => setShowApplications(true)}
                  >
                    <Text style={styles.manageButtonText}>Manage Applications</Text>
                  </TouchableOpacity>
                )}

                {isMember && !isLeader && (
                  <TouchableOpacity
                    style={styles.leaveButton}
                    onPress={() => leaveGuild(selectedGuild)}
                  >
                    <Text style={styles.leaveButtonText}>Leave Guild</Text>
                  </TouchableOpacity>
                )}

                {isLeader && (
                  <TouchableOpacity
                    style={styles.disbandButton}
                    onPress={() => {
                      Alert.alert(
                        'Disband Guild',
                        'Are you sure you want to disband this guild? This action cannot be undone.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Disband',
                            style: 'destructive',
                            onPress: () => {
                              setGuilds(prev => prev.filter(g => g.id !== selectedGuild.id));
                              setShowGuildDetails(false);
                              toast.info('Guild disbanded');
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.disbandButtonText}>Disband Guild</Text>
                  </TouchableOpacity>
                )}

                {!isMember && selectedGuild.memberCount < selectedGuild.maxMembers && (
                  <TouchableOpacity
                    style={styles.joinGuildButton}
                    onPress={() => joinGuild(selectedGuild)}
                  >
                    <Text style={styles.joinGuildButtonText}>Join Guild</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCreateGuildModal = () => {
    return (
      <Modal
        visible={showCreateGuild}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateGuild(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createGuildContainer}>
            <View style={styles.createGuildHeader}>
              <Text style={styles.createGuildTitle}>Create Guild</Text>
              <TouchableOpacity onPress={() => setShowCreateGuild(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createGuildContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Guild Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter guild name..."
                  placeholderTextColor="#A89968"
                  value={guildName}
                  onChangeText={setGuildName}
                  maxLength={30}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  placeholder="Describe your guild..."
                  placeholderTextColor="#A89968"
                  value={guildDescription}
                  onChangeText={setGuildDescription}
                  multiline
                  maxLength={200}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Guild Banner</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerSelector}>
                  {GUILD_BANNERS.map((banner) => (
                    <TouchableOpacity
                      key={banner}
                      style={[styles.bannerButton, { backgroundColor: getBannerColor(banner) }, selectedBanner === banner && styles.selectedBanner]}
                      onPress={() => setSelectedBanner(banner)}
                    >
                      <FontAwesome5 name="fort-awesome" size={20} color="#D4AF37" />
                      <Text style={styles.bannerText}>{banner}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Minimum Level Requirement</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValue}>{minLevel}</Text>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${(minLevel / 50) * 100}%` }]} />
                  </View>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setMinLevel(Math.max(1, minLevel - 5))}
                  >
                    <Ionicons name="remove" size={16} color="#D4AF37" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setMinLevel(Math.min(50, minLevel + 5))}
                  >
                    <Ionicons name="add" size={16} color="#D4AF37" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Minimum Reputation Requirement</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValue}>{minReputation}</Text>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${(minReputation / 5000) * 100}%` }]} />
                  </View>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setMinReputation(Math.max(0, minReputation - 100))}
                  >
                    <Ionicons name="remove" size={16} color="#D4AF37" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setMinReputation(Math.min(5000, minReputation + 100))}
                  >
                    <Ionicons name="add" size={16} color="#D4AF37" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.createGuildButton}
                onPress={createGuild}
              >
                <Text style={styles.createGuildButtonText}>Create Guild (1000 Gold)</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderRecruitPlayersModal = () => {
    if (!selectedGuild) return null;

    const eligibleRecruits = AVAILABLE_RECRUITS.filter(player =>
      player.level >= selectedGuild.requirements.level &&
      player.reputation >= selectedGuild.requirements.reputation &&
      !selectedGuild.members.some(member => member.id === player.id)
    );

    return (
      <Modal
        visible={showRecruitPlayers}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRecruitPlayers(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recruitPlayersContainer}>
            <View style={styles.recruitPlayersHeader}>
              <Text style={styles.recruitPlayersTitle}>Recruit Players</Text>
              <TouchableOpacity onPress={() => setShowRecruitPlayers(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.recruitPlayersContent}>
              <Text style={styles.sectionTitle}>Eligible Candidates</Text>
              <FlatList
                data={eligibleRecruits}
                renderItem={({ item }) => (
                  <View style={styles.recruitPlayerItem}>
                    <View style={styles.recruitPlayerInfo}>
                      <Text style={styles.recruitPlayerName}>{item.name}</Text>
                      <Text style={styles.recruitPlayerDetails}>
                        Level {item.level} • {item.reputation} reputation
                      </Text>
                    </View>
                    <View style={[styles.recruitPlayerStatus, { backgroundColor: item.status === 'online' ? '#32CD32' : '#FFD700' }]}>
                      <Text style={styles.recruitPlayerStatusText}>{item.status}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.recruitPlayerButton}
                      onPress={() => recruitPlayer(item)}
                    >
                      <Text style={styles.recruitPlayerButtonText}>Recruit</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.noPlayersText}>No eligible players found</Text>
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderApplicationsModal = () => {
    if (!selectedGuild) return null;

    const guildApplications = applications.filter(app => app.guildId === selectedGuild.id);

    return (
      <Modal
        visible={showApplications}
        transparent
        animationType="fade"
        onRequestClose={() => setShowApplications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.applicationsContainer}>
            <View style={styles.applicationsHeader}>
              <Text style={styles.applicationsTitle}>Guild Applications</Text>
              <TouchableOpacity onPress={() => setShowApplications(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.applicationsContent}>
              <FlatList
                data={guildApplications}
                renderItem={({ item }) => (
                  <View style={styles.applicationItem}>
                    <View style={styles.applicationInfo}>
                      <Text style={styles.applicationName}>{item.applicantName}</Text>
                      <Text style={styles.applicationDetails}>
                        Level {item.applicantLevel} • {item.applicantReputation} reputation
                      </Text>
                      <Text style={styles.applicationMessage}>{item.message}</Text>
                    </View>
                    <View style={styles.applicationActions}>
                      <TouchableOpacity
                        style={styles.acceptApplicationButton}
                        onPress={() => {
                          const newMember: GuildMember = {
                            id: item.applicantId,
                            name: item.applicantName,
                            level: item.applicantLevel,
                            rank: 'Member',
                            joinedAt: new Date(),
                            contribution: 0,
                          };

                          const updatedGuild = {
                            ...selectedGuild,
                            members: [...selectedGuild.members, newMember],
                            memberCount: selectedGuild.memberCount + 1,
                          };

                          setGuilds(prev => prev.map(g => g.id === selectedGuild.id ? updatedGuild : g));
                          setApplications(prev => prev.filter(a => a.id !== item.id));
                          toast.success(`Accepted ${item.applicantName} into the guild!`);
                        }}
                      >
                        <Text style={styles.acceptApplicationButtonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectApplicationButton}
                        onPress={() => {
                          setApplications(prev => prev.filter(a => a.id !== item.id));
                          toast.info(`Rejected ${item.applicantName}'s application`);
                        }}
                      >
                        <Text style={styles.rejectApplicationButtonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.noApplicationsText}>No pending applications</Text>
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20guild%20hall%20with%20warriors%20and%20banners&aspect=9:16&seed=guild' }}
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
          <Text style={styles.headerTitle}>GUILD SYSTEM</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateGuild(true)}
          >
            <Ionicons name="add" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#A89968" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search guilds..."
              placeholderTextColor="#A89968"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={20} color="#A89968" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{guilds.length}</Text>
            <Text style={styles.statLabel}>Active Guilds</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {guilds.reduce((sum, guild) => sum + guild.memberCount, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {guilds.filter(guild => guild.members.some(m => m.id === 'player_1')).length}
            </Text>
            <Text style={styles.statLabel}>Your Guilds</Text>
          </View>
        </View>

        <View style={styles.guildsContainer}>
          <Text style={styles.sectionTitle}>Guilds ({filteredGuilds.length})</Text>
          <FlatList
            data={filteredGuilds}
            renderItem={renderGuildItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.guildsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="fort-awesome" size={48} color="#666" />
                <Text style={styles.emptyText}>No guilds found</Text>
                <Text style={styles.emptySubtext}>Create your own guild or join existing ones</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('PartyCreate')}
          >
            <FontAwesome5 name="users" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Parties</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="chatbubbles" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="settings" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderGuildDetailsModal()}
      {renderCreateGuildModal()}
      {renderRecruitPlayersModal()}
      {renderApplicationsModal()}
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
  createButton: {
    padding: 8,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  statLabel: {
    fontSize: 12,
    color: '#A89968',
    marginTop: 4,
  },
  guildsContainer: {
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
  guildsList: {
    paddingBottom: 20,
  },
  guildItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  guildHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guildBanner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guildInfo: {
    flex: 1,
  },
  guildName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  guildLeader: {
    color: '#A89968',
    fontSize: 12,
  },
  memberBadge: {
    marginLeft: 8,
  },
  guildDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  guildStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  guildMembers: {
    color: '#A89968',
    fontSize: 12,
  },
  guildLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  guildReputation: {
    color: '#32CD32',
    fontSize: 12,
  },
  guildActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 8,
    flex: 1,
    marginRight: 4,
  },
  joinButtonText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    flex: 1,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  applyButtonText: {
    color: '#D4AF37',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
  },
  pendingText: {
    color: '#000',
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
  guildDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  guildDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  guildDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  guildDetailsContent: {
    flex: 1,
  },
  guildDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailGuildBanner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailGuildInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailGuildName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailGuildLeader: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  detailGuildMembers: {
    color: '#A89968',
    fontSize: 12,
  },
  guildDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  guildStatsSection: {
    marginBottom: 16,
  },
  guildStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  guildStatText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  activitiesSection: {
    marginBottom: 16,
  },
  activitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  activityText: {
    color: '#D4AF37',
    fontSize: 12,
  },
  membersSection: {
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#D4AF37',
    fontSize: 14,
  },
  memberDetails: {
    color: '#A89968',
    fontSize: 12,
  },
  memberRank: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memberRankText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  leaderBadge: {
    marginLeft: 8,
  },
  guildActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  recruitButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  recruitButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  manageButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  manageButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  leaveButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  leaveButtonText: {
    color: '#FF6347',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  disbandButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  disbandButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  joinGuildButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  joinGuildButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  createGuildContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 16,
  },
  createGuildHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  createGuildTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  createGuildContent: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    padding: 12,
    color: '#D4AF37',
    fontSize: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  bannerSelector: {
    marginBottom: 8,
  },
  bannerButton: {
    alignItems: 'center',
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBanner: {
    borderColor: '#D4AF37',
  },
  bannerText: {
    color: '#D4AF37',
    fontSize: 10,
    marginTop: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValue: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createGuildButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createGuildButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recruitPlayersContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '60%',
    padding: 16,
  },
  recruitPlayersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  recruitPlayersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  recruitPlayersContent: {
    flex: 1,
  },
  recruitPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  recruitPlayerInfo: {
    flex: 1,
  },
  recruitPlayerName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  recruitPlayerDetails: {
    color: '#A89968',
    fontSize: 12,
  },
  recruitPlayerStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  recruitPlayerStatusText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  recruitPlayerButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 8,
  },
  recruitPlayerButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  noPlayersText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  applicationsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '60%',
    padding: 16,
  },
  applicationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  applicationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  applicationsContent: {
    flex: 1,
  },
  applicationItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  applicationInfo: {
    marginBottom: 8,
  },
  applicationName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  applicationDetails: {
    color: '#A89968',
    fontSize: 12,
  },
  applicationMessage: {
    color: '#A89968',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  applicationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptApplicationButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 8,
    flex: 1,
    marginRight: 4,
  },
  acceptApplicationButtonText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  rejectApplicationButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 8,
    flex: 1,
    marginLeft: 4,
  },
  rejectApplicationButtonText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  noApplicationsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});