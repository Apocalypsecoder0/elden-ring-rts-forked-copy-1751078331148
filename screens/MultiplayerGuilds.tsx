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
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample guilds data
const GUILDS = [
  {
    id: 'guild-1',
    name: 'Elden Champions',
    leader: 'EldenLord',
    memberCount: 45,
    maxMembers: 50,
    level: 25,
    reputation: 'Legendary',
    description: 'Elite guild of seasoned Tarnished seeking to conquer the Lands Between.',
    requirements: 'Level 50+, Active players only',
    banner: '🏆',
    specialties: ['Boss Raiding', 'PvP Tournaments', 'Co-op Exploration']
  },
  {
    id: 'guild-2',
    name: 'Moonlight Covenant',
    leader: 'MoonlightAssassin',
    memberCount: 32,
    maxMembers: 40,
    level: 22,
    reputation: 'Exalted',
    description: 'Stealth-focused guild specializing in infiltration and assassination.',
    requirements: 'Level 40+, Stealth builds preferred',
    banner: '🌙',
    specialties: ['Invasions', 'Stealth Missions', 'Night Operations']
  },
  {
    id: 'guild-3',
    name: 'Flame Keepers',
    leader: 'FireGiant',
    memberCount: 28,
    maxMembers: 35,
    level: 20,
    reputation: 'Honored',
    description: 'Masters of fire magic and melee combat, guardians of the flame.',
    requirements: 'Level 35+, Fire affinity builds',
    banner: '🔥',
    specialties: ['Fire Magic', 'Melee Combat', 'Volcano Manor']
  },
  {
    id: 'guild-4',
    name: 'Crystal Scholars',
    leader: 'CrystalSage',
    memberCount: 38,
    maxMembers: 45,
    level: 23,
    reputation: 'Exalted',
    description: 'Academic guild dedicated to magical research and arcane knowledge.',
    requirements: 'Level 45+, Intelligence builds',
    banner: '💎',
    specialties: ['Magic Research', 'Academy Quests', 'Spell Development']
  }
];

const GUILD_MEMBERS = [
  { id: 'member-1', name: 'EldenLord', level: 120, role: 'Guild Master', status: 'online', class: 'Warrior' },
  { id: 'member-2', name: 'ShadowBlade', level: 115, role: 'Officer', status: 'online', class: 'Assassin' },
  { id: 'member-3', name: 'FireMage', level: 110, role: 'Member', status: 'away', class: 'Mage' },
  { id: 'member-4', name: 'CrystalKnight', level: 105, role: 'Member', status: 'offline', class: 'Knight' },
  { id: 'member-5', name: 'BloodHunter', level: 108, role: 'Recruit', status: 'online', class: 'Hunter' }
];

const GUILD_EVENTS = [
  {
    id: 'event-1',
    title: 'Weekly Boss Raid',
    description: 'Full guild raid on Maliketh, the Black Blade',
    date: 'Tomorrow 8:00 PM EST',
    participants: 28,
    maxParticipants: 30,
    type: 'raid'
  },
  {
    id: 'event-2',
    title: 'PvP Tournament',
    description: 'Inter-guild tournament for ranking points',
    date: 'Saturday 2:00 PM EST',
    participants: 16,
    maxParticipants: 32,
    type: 'tournament'
  },
  {
    id: 'event-3',
    title: 'Guild Meeting',
    description: 'Monthly guild meeting and strategy discussion',
    date: 'Sunday 7:00 PM EST',
    participants: 15,
    maxParticipants: 45,
    type: 'meeting'
  }
];

const MultiplayerGuilds: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedGuild, setSelectedGuild] = useState<typeof GUILDS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'guilds' | 'members' | 'events'>('guilds');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGuildPress = (guild: typeof GUILDS[0]) => {
    setSelectedGuild(guild);
    setModalVisible(true);
  };

  const handleJoinGuild = () => {
    if (selectedGuild) {
      toast.success(`Application sent to ${selectedGuild.name}!`);
      setModalVisible(false);
    }
  };

  const handleCreateGuild = () => {
    toast.success('Guild creation initiated!');
  };

  const handleInviteMember = () => {
    toast.success('Invitation sent!');
  };

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case 'Legendary': return '#FFD700';
      case 'Exalted': return '#9C27B0';
      case 'Honored': return '#2196F3';
      case 'Respected': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const renderGuildItem = ({ item }: { item: typeof GUILDS[0] }) => (
    <TouchableOpacity
      style={styles.guildCard}
      onPress={() => handleGuildPress(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.guildCardGradient}
      >
        <View style={styles.guildHeader}>
          <View style={styles.guildBanner}>
            <Text style={styles.bannerText}>{item.banner}</Text>
          </View>
          <View style={styles.guildInfo}>
            <Text style={styles.guildName}>{item.name}</Text>
            <Text style={styles.guildLeader}>Led by {item.leader}</Text>
          </View>
          <View style={[styles.reputationBadge, { backgroundColor: getReputationColor(item.reputation) }]}>
            <Text style={styles.reputationText}>{item.reputation}</Text>
          </View>
        </View>

        <View style={styles.guildStats}>
          <Text style={styles.memberCount}>
            <Ionicons name="people" size={14} color="#FFD700" />
            {' '}{item.memberCount}/{item.maxMembers}
          </Text>
          <Text style={styles.guildLevel}>
            <Ionicons name="star" size={14} color="#FFD700" />
            {' '}Level {item.level}
          </Text>
        </View>

        <Text style={styles.guildDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.guildSpecialties}>
          {item.specialties.slice(0, 2).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMemberItem = ({ item }: { item: typeof GUILD_MEMBERS[0] }) => (
    <View style={styles.memberCard}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.memberGradient}
      >
        <View style={styles.memberHeader}>
          <View style={styles.memberAvatar}>
            <Text style={styles.memberInitial}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberClass}>{item.class} • Level {item.level}</Text>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.memberRole}>
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEventItem = ({ item }: { item: typeof GUILD_EVENTS[0] }) => (
    <View style={styles.eventCard}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.eventGradient}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>{item.date}</Text>
        </View>

        <Text style={styles.eventDescription}>
          {item.description}
        </Text>

        <View style={styles.eventFooter}>
          <Text style={styles.participants}>
            <Ionicons name="people" size={14} color="#FFD700" />
            {' '}{item.participants}/{item.maxParticipants}
          </Text>
          <TouchableOpacity
            style={styles.joinEventButton}
            onPress={() => toast.success(`Joined ${item.title}!`)}
          >
            <Text style={styles.joinEventText}>Join</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const filteredGuilds = GUILDS.filter(guild =>
    guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guild.leader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/placeholder.jpg' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.6)']}
        style={styles.overlay}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.title}>GUILDS</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGuild}
          >
            <Ionicons name="add" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {activeTab === 'guilds' && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#CCCCCC" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search guilds..."
              placeholderTextColor="#CCCCCC"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'guilds' && styles.activeTab]}
            onPress={() => setActiveTab('guilds')}
          >
            <Text style={[styles.tabText, activeTab === 'guilds' && styles.activeTabText]}>
              Guilds
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.activeTab]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
              Events
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'guilds' && (
          <FlatList
            data={filteredGuilds}
            renderItem={renderGuildItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.guildsList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'members' && (
          <>
            <View style={styles.membersHeader}>
              <Text style={styles.membersTitle}>Guild Members</Text>
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={handleInviteMember}
              >
                <Ionicons name="person-add" size={16} color="#FFFFFF" />
                <Text style={styles.inviteText}>Invite</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={GUILD_MEMBERS}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.membersList}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {activeTab === 'events' && (
          <FlatList
            data={GUILD_EVENTS}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventsList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Guild Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedGuild && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalGuildInfo}>
                      <Text style={styles.modalBanner}>{selectedGuild.banner}</Text>
                      <View>
                        <Text style={styles.modalGuildName}>{selectedGuild.name}</Text>
                        <Text style={styles.modalGuildLeader}>Leader: {selectedGuild.leader}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.guildDetailSection}>
                      <Text style={styles.sectionTitle}>Guild Overview</Text>
                      <Text style={styles.guildDetailText}>
                        <Text style={styles.detailLabel}>Level:</Text> {selectedGuild.level}
                      </Text>
                      <Text style={styles.guildDetailText}>
                        <Text style={styles.detailLabel}>Members:</Text> {selectedGuild.memberCount}/{selectedGuild.maxMembers}
                      </Text>
                      <Text style={styles.guildDetailText}>
                        <Text style={styles.detailLabel}>Reputation:</Text> {selectedGuild.reputation}
                      </Text>
                      <Text style={styles.guildDetailText}>
                        <Text style={styles.detailLabel}>Requirements:</Text> {selectedGuild.requirements}
                      </Text>
                    </View>

                    <View style={styles.guildDetailSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.guildDescriptionText}>
                        {selectedGuild.description}
                      </Text>
                    </View>

                    <View style={styles.guildDetailSection}>
                      <Text style={styles.sectionTitle}>Specialties</Text>
                      <View style={styles.specialtiesContainer}>
                        {selectedGuild.specialties.map((specialty, index) => (
                          <View key={index} style={styles.specialtyDetailTag}>
                            <Text style={styles.specialtyDetailText}>{specialty}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.guildDetailSection}>
                      <Text style={styles.sectionTitle}>Guild Perks</Text>
                      <Text style={styles.perksText}>
                        • Shared guild bank for equipment{'\n'}
                        • Guild-only quests and events{'\n'}
                        • Priority matchmaking for co-op{'\n'}
                        • Exclusive guild titles and banners{'\n'}
                        • Voice chat channels for coordination
                      </Text>
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.viewMembersButton}
                      onPress={() => {
                        setActiveTab('members');
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.viewMembersText}>View Members</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.joinGuildButton}
                      onPress={handleJoinGuild}
                    >
                      <Text style={styles.joinGuildText}>Apply to Join</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  createButton: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CCCCCC',
  },
  activeTabText: {
    color: '#1A1A2E',
  },
  guildsList: {
    padding: 20,
    paddingBottom: 100,
  },
  guildCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  guildCardGradient: {
    padding: 15,
  },
  guildHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  guildBanner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bannerText: {
    fontSize: 24,
  },
  guildInfo: {
    flex: 1,
  },
  guildName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  guildLeader: {
    fontSize: 14,
    color: '#FFD700',
  },
  reputationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reputationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  guildStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memberCount: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  guildLevel: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  guildDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 15,
  },
  guildSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  specialtyText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  inviteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  membersList: {
    padding: 20,
    paddingBottom: 100,
  },
  memberCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  memberGradient: {
    padding: 15,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  memberClass: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberRole: {
    alignItems: 'flex-end',
  },
  roleText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  eventsList: {
    padding: 20,
    paddingBottom: 100,
  },
  eventCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventGradient: {
    padding: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  eventDate: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 15,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participants: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  joinEventButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  joinEventText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1A1A2E',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  modalGuildInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalBanner: {
    fontSize: 40,
    marginRight: 15,
  },
  modalGuildName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 2,
  },
  modalGuildLeader: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  guildDetailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  guildDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  guildDescriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyDetailTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyDetailText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  perksText: {
    fontSize: 14,
    color: '#2196F3',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  viewMembersButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  viewMembersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  joinGuildButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  joinGuildText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default MultiplayerGuilds;