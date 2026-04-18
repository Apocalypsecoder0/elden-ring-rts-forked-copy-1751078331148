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
import { Party, PlayerCharacter, PartyInvite } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample existing parties
const SAMPLE_PARTIES: Party[] = [
  {
    id: 'party_001',
    name: 'Elden Lords',
    leaderId: 'player_2',
    members: [
      { id: 'player_2', name: 'Elden Lord', level: 45, role: 'leader', status: 'online' },
      { id: 'player_3', name: 'Dragon Slayer', level: 42, role: 'member', status: 'online' },
      { id: 'player_4', name: 'Spellcaster', level: 38, role: 'member', status: 'away' },
    ],
    maxMembers: 6,
    description: 'A group of powerful warriors seeking to claim the Elden Throne.',
    level: 40,
    createdAt: new Date('2024-01-15'),
    activity: 'Dungeons',
  },
  {
    id: 'party_002',
    name: 'Shadow Warriors',
    leaderId: 'player_5',
    members: [
      { id: 'player_5', name: 'Shadow Master', level: 35, role: 'leader', status: 'online' },
      { id: 'player_6', name: 'Night Blade', level: 33, role: 'member', status: 'online' },
    ],
    maxMembers: 4,
    description: 'Stealth-focused group specializing in assassination and reconnaissance.',
    level: 30,
    createdAt: new Date('2024-01-20'),
    activity: 'Exploration',
  },
];

// Sample available players for inviting
const AVAILABLE_PLAYERS = [
  { id: 'player_7', name: 'Mystic Mage', level: 28, status: 'online' },
  { id: 'player_8', name: 'Beast Hunter', level: 26, status: 'online' },
  { id: 'player_9', name: 'Paladin', level: 38, status: 'away' },
  { id: 'player_10', name: 'Assassin', level: 29, status: 'online' },
  { id: 'player_11', name: 'Healer', level: 31, status: 'online' },
  { id: 'player_12', name: 'Berserker', level: 34, status: 'busy' },
];

const PARTY_ACTIVITIES = ['Dungeons', 'Boss Fights', 'Exploration', 'PvP', 'Quests', 'Trading'];

export default function PartyCreateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [parties, setParties] = useState<Party[]>(SAMPLE_PARTIES);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [showPartyDetails, setShowPartyDetails] = useState(false);
  const [showCreateParty, setShowCreateParty] = useState(false);
  const [showInvitePlayers, setShowInvitePlayers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('Dungeons');
  const [partyName, setPartyName] = useState('');
  const [partyDescription, setPartyDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState<number>(4);
  const [invites, setInvites] = useState<PartyInvite[]>([]);

  const createParty = () => {
    if (!partyName.trim()) {
      toast.error('Please enter a party name!');
      return;
    }

    const newParty: Party = {
      id: `party_${Date.now()}`,
      name: partyName,
      leaderId: 'player_1',
      members: [
        { id: 'player_1', name: 'Tarnished Hero', level: 25, role: 'leader', status: 'online' },
      ],
      maxMembers,
      description: partyDescription,
      level: 25,
      createdAt: new Date(),
      activity: selectedActivity,
    };

    setParties(prev => [...prev, newParty]);
    setShowCreateParty(false);
    setPartyName('');
    setPartyDescription('');
    toast.success('Party created successfully!');
  };

  const joinParty = (party: Party) => {
    if (party.members.length >= party.maxMembers) {
      toast.error('Party is full!');
      return;
    }

    const newMember = { id: 'player_1', name: 'Tarnished Hero', level: 25, role: 'member', status: 'online' };
    const updatedParty = {
      ...party,
      members: [...party.members, newMember],
    };

    setParties(prev => prev.map(p => p.id === party.id ? updatedParty : p));
    toast.success(`Joined ${party.name}!`);
  };

  const leaveParty = (party: Party) => {
    Alert.alert(
      'Leave Party',
      'Are you sure you want to leave this party?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            const updatedParty = {
              ...party,
              members: party.members.filter(m => m.id !== 'player_1'),
            };

            if (updatedParty.members.length === 0) {
              setParties(prev => prev.filter(p => p.id !== party.id));
            } else {
              // If leaving player was leader, assign new leader
              if (party.leaderId === 'player_1') {
                updatedParty.leaderId = updatedParty.members[0].id;
                updatedParty.members[0].role = 'leader';
              }
              setParties(prev => prev.map(p => p.id === party.id ? updatedParty : p));
            }

            toast.info('Left party');
          }
        }
      ]
    );
  };

  const invitePlayer = (player: { id: string; name: string; level: number; status: string }) => {
    if (!selectedParty) return;

    const newInvite: PartyInvite = {
      id: `invite_${Date.now()}`,
      partyId: selectedParty.id,
      inviterId: 'player_1',
      inviteeId: player.id,
      status: 'pending',
      createdAt: new Date(),
    };

    setInvites(prev => [...prev, newInvite]);
    toast.success(`Invited ${player.name} to ${selectedParty.name}!`);
  };

  const acceptInvite = (invite: PartyInvite) => {
    const party = parties.find(p => p.id === invite.partyId);
    if (!party) return;

    joinParty(party);
    setInvites(prev => prev.filter(i => i.id !== invite.id));
  };

  const declineInvite = (invite: PartyInvite) => {
    setInvites(prev => prev.filter(i => i.id !== invite.id));
    toast.info('Invite declined');
  };

  const filteredParties = parties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         party.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderPartyItem = ({ item }: { item: Party }) => {
    const isMember = item.members.some(m => m.id === 'player_1');
    const canJoin = !isMember && item.members.length < item.maxMembers;

    return (
      <TouchableOpacity
        style={styles.partyItem}
        onPress={() => {
          setSelectedParty(item);
          setShowPartyDetails(true);
        }}
      >
        <View style={styles.partyHeader}>
          <View style={styles.partyIconContainer}>
            <FontAwesome5 name="users" size={20} color="#D4AF37" />
          </View>
          <View style={styles.partyInfo}>
            <Text style={styles.partyName}>{item.name}</Text>
            <Text style={styles.partyLeader}>
              Leader: {item.members.find(m => m.id === item.leaderId)?.name || 'Unknown'}
            </Text>
          </View>
          {isMember && (
            <View style={styles.memberBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#32CD32" />
            </View>
          )}
        </View>

        <Text style={styles.partyDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.partyStats}>
          <Text style={styles.partyMembers}>
            {item.members.length}/{item.maxMembers} members
          </Text>
          <Text style={styles.partyLevel}>Lv.{item.level}+</Text>
          <Text style={styles.partyActivity}>{item.activity}</Text>
        </View>

        {canJoin && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => joinParty(item)}
          >
            <Text style={styles.joinButtonText}>Join Party</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderPartyDetailsModal = () => {
    if (!selectedParty) return null;

    const isMember = selectedParty.members.some(m => m.id === 'player_1');
    const isLeader = selectedParty.leaderId === 'player_1';
    const canInvite = isMember && selectedParty.members.length < selectedParty.maxMembers;

    return (
      <Modal
        visible={showPartyDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPartyDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.partyDetailsContainer}>
            <View style={styles.partyDetailsHeader}>
              <Text style={styles.partyDetailsTitle}>Party Details</Text>
              <TouchableOpacity onPress={() => setShowPartyDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.partyDetailsContent}>
              <View style={styles.partyDetailHeader}>
                <View style={styles.detailPartyIconContainer}>
                  <FontAwesome5 name="users" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailPartyInfo}>
                  <Text style={styles.detailPartyName}>{selectedParty.name}</Text>
                  <Text style={styles.detailPartyLeader}>
                    Leader: {selectedParty.members.find(m => m.id === selectedParty.leaderId)?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.detailPartyMembers}>
                    {selectedParty.members.length}/{selectedParty.maxMembers} Members
                  </Text>
                </View>
              </View>

              <Text style={styles.partyDetailDescription}>{selectedParty.description}</Text>

              <View style={styles.partyStatsSection}>
                <View style={styles.partyStatItem}>
                  <Ionicons name="trending-up" size={16} color="#A89968" />
                  <Text style={styles.partyStatText}>Level {selectedParty.level}+</Text>
                </View>
                <View style={styles.partyStatItem}>
                  <Ionicons name="game-controller" size={16} color="#A89968" />
                  <Text style={styles.partyStatText}>{selectedParty.activity}</Text>
                </View>
                <View style={styles.partyStatItem}>
                  <Ionicons name="time" size={16} color="#A89968" />
                  <Text style={styles.partyStatText}>
                    Created {selectedParty.createdAt.toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.membersSection}>
                <Text style={styles.sectionTitle}>Members</Text>
                {selectedParty.members.map((member) => (
                  <View key={member.id} style={styles.memberItem}>
                    <View style={styles.memberAvatar}>
                      <FontAwesome5 name="user" size={16} color="#D4AF37" />
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberLevel}>Level {member.level}</Text>
                    </View>
                    <View style={[styles.memberStatus, { backgroundColor: member.status === 'online' ? '#32CD32' : '#FFD700' }]}>
                      <Text style={styles.memberStatusText}>{member.status}</Text>
                    </View>
                    {member.role === 'leader' && (
                      <View style={styles.leaderBadge}>
                        <Ionicons name="crown" size={14} color="#FFD700" />
                      </View>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.partyActions}>
                {canInvite && (
                  <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={() => setShowInvitePlayers(true)}
                  >
                    <Text style={styles.inviteButtonText}>Invite Players</Text>
                  </TouchableOpacity>
                )}

                {isMember && !isLeader && (
                  <TouchableOpacity
                    style={styles.leaveButton}
                    onPress={() => leaveParty(selectedParty)}
                  >
                    <Text style={styles.leaveButtonText}>Leave Party</Text>
                  </TouchableOpacity>
                )}

                {isLeader && (
                  <TouchableOpacity
                    style={styles.disbandButton}
                    onPress={() => {
                      Alert.alert(
                        'Disband Party',
                        'Are you sure you want to disband this party? This action cannot be undone.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Disband',
                            style: 'destructive',
                            onPress: () => {
                              setParties(prev => prev.filter(p => p.id !== selectedParty.id));
                              setShowPartyDetails(false);
                              toast.info('Party disbanded');
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.disbandButtonText}>Disband Party</Text>
                  </TouchableOpacity>
                )}

                {!isMember && selectedParty.members.length < selectedParty.maxMembers && (
                  <TouchableOpacity
                    style={styles.joinPartyButton}
                    onPress={() => joinParty(selectedParty)}
                  >
                    <Text style={styles.joinPartyButtonText}>Join Party</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCreatePartyModal = () => {
    return (
      <Modal
        visible={showCreateParty}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateParty(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createPartyContainer}>
            <View style={styles.createPartyHeader}>
              <Text style={styles.createPartyTitle}>Create Party</Text>
              <TouchableOpacity onPress={() => setShowCreateParty(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createPartyContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Party Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter party name..."
                  placeholderTextColor="#A89968"
                  value={partyName}
                  onChangeText={setPartyName}
                  maxLength={30}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  placeholder="Describe your party..."
                  placeholderTextColor="#A89968"
                  value={partyDescription}
                  onChangeText={setPartyDescription}
                  multiline
                  maxLength={200}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Activity</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activitySelector}>
                  {PARTY_ACTIVITIES.map((activity) => (
                    <TouchableOpacity
                      key={activity}
                      style={[styles.activityButton, selectedActivity === activity && styles.selectedActivity]}
                      onPress={() => setSelectedActivity(activity)}
                    >
                      <Text style={[styles.activityText, selectedActivity === activity && styles.selectedActivityText]}>
                        {activity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Max Members</Text>
                <View style={styles.memberCountSelector}>
                  {[2, 3, 4, 6, 8].map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[styles.countButton, maxMembers === count && styles.selectedCount]}
                      onPress={() => setMaxMembers(count)}
                    >
                      <Text style={[styles.countText, maxMembers === count && styles.selectedCountText]}>
                        {count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.createPartyButton}
                onPress={createParty}
              >
                <Text style={styles.createPartyButtonText}>Create Party</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderInvitePlayersModal = () => {
    if (!selectedParty) return null;

    const availableForInvite = AVAILABLE_PLAYERS.filter(player =>
      !selectedParty.members.some(member => member.id === player.id)
    );

    return (
      <Modal
        visible={showInvitePlayers}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInvitePlayers(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.invitePlayersContainer}>
            <View style={styles.invitePlayersHeader}>
              <Text style={styles.invitePlayersTitle}>Invite Players</Text>
              <TouchableOpacity onPress={() => setShowInvitePlayers(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.invitePlayersContent}>
              <Text style={styles.sectionTitle}>Available Players</Text>
              <FlatList
                data={availableForInvite}
                renderItem={({ item }) => (
                  <View style={styles.invitePlayerItem}>
                    <View style={styles.invitePlayerInfo}>
                      <Text style={styles.invitePlayerName}>{item.name}</Text>
                      <Text style={styles.invitePlayerLevel}>Level {item.level}</Text>
                    </View>
                    <View style={[styles.invitePlayerStatus, { backgroundColor: item.status === 'online' ? '#32CD32' : '#FFD700' }]}>
                      <Text style={styles.invitePlayerStatusText}>{item.status}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.invitePlayerButton}
                      onPress={() => invitePlayer(item)}
                    >
                      <Text style={styles.invitePlayerButtonText}>Invite</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.noPlayersText}>No available players to invite</Text>
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderInvitesSection = () => {
    const pendingInvites = invites.filter(invite => invite.inviteeId === 'player_1' && invite.status === 'pending');

    if (pendingInvites.length === 0) return null;

    return (
      <View style={styles.invitesSection}>
        <Text style={styles.sectionTitle}>Party Invites ({pendingInvites.length})</Text>
        {pendingInvites.map((invite) => {
          const party = parties.find(p => p.id === invite.partyId);
          return (
            <View key={invite.id} style={styles.inviteItem}>
              <View style={styles.inviteInfo}>
                <Text style={styles.invitePartyName}>{party?.name || 'Unknown Party'}</Text>
                <Text style={styles.inviteMessage}>Invited by {party?.members.find(m => m.id === invite.inviterId)?.name || 'Unknown'}</Text>
              </View>
              <View style={styles.inviteActions}>
                <TouchableOpacity
                  style={styles.acceptInviteButton}
                  onPress={() => acceptInvite(invite)}
                >
                  <Text style={styles.acceptInviteButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineInviteButton}
                  onPress={() => declineInvite(invite)}
                >
                  <Text style={styles.declineInviteButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Epic%20fantasy%20party%20gathering%20with%20warriors%20and%20adventurers&aspect=9:16&seed=party' }}
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
          <Text style={styles.headerTitle}>PARTY SYSTEM</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateParty(true)}
          >
            <Ionicons name="add" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#A89968" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search parties..."
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

        {renderInvitesSection()}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{parties.length}</Text>
            <Text style={styles.statLabel}>Active Parties</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {parties.reduce((sum, party) => sum + party.members.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {parties.filter(party => party.members.some(m => m.id === 'player_1')).length}
            </Text>
            <Text style={styles.statLabel}>Your Parties</Text>
          </View>
        </View>

        <View style={styles.partiesContainer}>
          <Text style={styles.sectionTitle}>Parties ({filteredParties.length})</Text>
          <FlatList
            data={filteredParties}
            renderItem={renderPartyItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.partiesList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="users" size={48} color="#666" />
                <Text style={styles.emptyText}>No parties found</Text>
                <Text style={styles.emptySubtext}>Create your own party or join existing ones</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('GuildManagement')}
          >
            <FontAwesome5 name="fort-awesome" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Guilds</Text>
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

      {renderPartyDetailsModal()}
      {renderCreatePartyModal()}
      {renderInvitePlayersModal()}
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
  invitesSection: {
    marginBottom: 16,
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
  inviteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  inviteInfo: {
    flex: 1,
  },
  invitePartyName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteMessage: {
    color: '#A89968',
    fontSize: 12,
  },
  inviteActions: {
    flexDirection: 'row',
  },
  acceptInviteButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 8,
    marginHorizontal: 4,
  },
  acceptInviteButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  declineInviteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 8,
    marginHorizontal: 4,
  },
  declineInviteButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
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
  partiesContainer: {
    flex: 1,
  },
  partiesList: {
    paddingBottom: 20,
  },
  partyItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  partyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partyInfo: {
    flex: 1,
  },
  partyName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  partyLeader: {
    color: '#A89968',
    fontSize: 12,
  },
  memberBadge: {
    marginLeft: 8,
  },
  partyDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  partyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyMembers: {
    color: '#A89968',
    fontSize: 12,
  },
  partyLevel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  partyActivity: {
    color: '#32CD32',
    fontSize: 12,
  },
  joinButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  joinButtonText: {
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
  partyDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  partyDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  partyDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  partyDetailsContent: {
    flex: 1,
  },
  partyDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailPartyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailPartyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailPartyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailPartyLeader: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
  detailPartyMembers: {
    color: '#A89968',
    fontSize: 12,
  },
  partyDetailDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  partyStatsSection: {
    marginBottom: 16,
  },
  partyStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  partyStatText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
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
  memberLevel: {
    color: '#A89968',
    fontSize: 12,
  },
  memberStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memberStatusText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  leaderBadge: {
    marginLeft: 8,
  },
  partyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  inviteButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  inviteButtonText: {
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
  joinPartyButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    margin: 4,
  },
  joinPartyButtonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  createPartyContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 16,
  },
  createPartyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  createPartyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  createPartyContent: {
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
  activitySelector: {
    marginBottom: 8,
  },
  activityButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedActivity: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  activityText: {
    color: '#A89968',
    fontSize: 14,
  },
  selectedActivityText: {
    color: '#000',
    fontWeight: '600',
  },
  memberCountSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  countButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedCount: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  countText: {
    color: '#A89968',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCountText: {
    color: '#000',
    fontWeight: '600',
  },
  createPartyButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createPartyButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  invitePlayersContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxWidth: 400,
    maxHeight: '60%',
    padding: 16,
  },
  invitePlayersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  invitePlayersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  invitePlayersContent: {
    flex: 1,
  },
  invitePlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  invitePlayerInfo: {
    flex: 1,
  },
  invitePlayerName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  invitePlayerLevel: {
    color: '#A89968',
    fontSize: 12,
  },
  invitePlayerStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  invitePlayerStatusText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  invitePlayerButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 8,
  },
  invitePlayerButtonText: {
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
});