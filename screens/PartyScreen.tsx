import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, Modal, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Party data
const PARTY_MEMBERS = [
  {
    id: 'player',
    name: 'Tarnished One',
    type: 'player',
    class: 'Astral Knight',
    level: 42,
    role: 'Tank',
    status: 'online',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20character%20portrait%20with%20ornate%20armor&aspect=1:1&seed=character42'
  },
  {
    id: 'member1',
    name: 'Blaidd',
    type: 'npc',
    class: 'Half-Wolf Warrior',
    level: 50,
    role: 'DPS',
    status: 'online',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20wolf%20warrior%20with%20greatsword&aspect=1:1&seed=blaidd'
  },
  {
    id: 'member2',
    name: 'Ranni',
    type: 'npc',
    class: 'Snow Witch',
    level: 65,
    role: 'Mage',
    status: 'offline',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20blue%20witch%20with%20four%20arms&aspect=1:1&seed=ranni'
  },
];

// Group finder data
const GROUP_LISTINGS = [
  {
    id: 'group1',
    name: 'Stormveil Siege',
    leader: 'Nepheli Loux',
    activity: 'raid',
    location: 'Stormveil Castle',
    level_range: '40-50',
    members: 3,
    max_members: 10,
    roles_needed: ['Tank', 'Healer', 'DPS'],
    description: 'Looking for experienced players to tackle Godrick. Must have completed Margit.',
    image: 'https://api.a0.dev/assets/image?text=Fantasy%20castle%20siege%20battle&aspect=16:9&seed=stormveil'
  },
  {
    id: 'group2',
    name: 'Siofra River Exploration',
    leader: 'Alexander',
    activity: 'dungeon',
    location: 'Siofra River Well',
    level_range: '30-40',
    members: 2,
    max_members: 4,
    roles_needed: ['Healer', 'DPS'],
    description: 'Exploring Siofra River and hunting for the Ancestor Spirit. Bring Spectral Arrows!',
    image: 'https://api.a0.dev/assets/image?text=Underground%20river%20with%20stars%20and%20ruins&aspect=16:9&seed=siofra'
  },
  {
    id: 'group3',
    name: 'Caelid Farming Run',
    leader: 'Millicent',
    activity: 'farming',
    location: 'Caelid',
    level_range: '60+',
    members: 4,
    max_members: 5,
    roles_needed: ['DPS'],
    description: 'Farming runes and materials in Caelid. High level players only due to difficulty.',
    image: 'https://api.a0.dev/assets/image?text=Red%20wasteland%20with%20giant%20monsters&aspect=16:9&seed=caelid'
  },
  {
    id: 'group4',
    name: 'Raya Lucaria Academy',
    leader: 'Thops',
    activity: 'raid',
    location: 'Raya Lucaria Academy',
    level_range: '50-60',
    members: 1,
    max_members: 8,
    roles_needed: ['Tank', 'Healer', 'DPS', 'Mage'],
    description: 'Need help clearing the academy and defeating Rennala. Glintstone sorcerers preferred.',
    image: 'https://api.a0.dev/assets/image?text=Magic%20academy%20with%20blue%20glow&aspect=16:9&seed=rayalucaria'
  },
];

// Activity filter options
const ACTIVITY_FILTERS = [
  { id: 'all', name: 'All Activities' },
  { id: 'raid', name: 'Raids' },
  { id: 'dungeon', name: 'Dungeons' },
  { id: 'farming', name: 'Farming' },
  { id: 'pvp', name: 'PvP' },
];

export default function PartyScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('party');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activityFilter, setActivityFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };
  
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };
  
  const handleFilterSelect = (filterId) => {
    setActivityFilter(filterId);
    setSelectedGroup(null);
  };
  
  const filteredGroups = activityFilter === 'all' 
    ? GROUP_LISTINGS
    : GROUP_LISTINGS.filter(group => group.activity === activityFilter);
  
  const searchFilteredGroups = searchQuery 
    ? filteredGroups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        group.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredGroups;
  
  const renderMemberItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.memberItem, selectedMember?.id === item.id && styles.selectedMemberItem]} 
      onPress={() => handleMemberSelect(item)}
    >
      <View style={styles.memberImageContainer}>
        <Image source={{ uri: item.image }} style={styles.memberImage} />
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: item.status === 'online' ? '#5ac93c' : '#6e6e6e' }
        ]} />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberClass}>{item.class}</Text>
        <View style={styles.memberDetails}>
          <View style={styles.memberDetailItem}>
            <Text style={styles.memberDetailLabel}>LEVEL</Text>
            <Text style={styles.memberDetailValue}>{item.level}</Text>
          </View>
          <View style={styles.memberDetailItem}>
            <Text style={styles.memberDetailLabel}>ROLE</Text>
            <Text style={styles.memberDetailValue}>{item.role}</Text>
          </View>
        </View>
      </View>
      {item.type === 'player' && (
        <View style={styles.playerBadge}>
          <Text style={styles.playerBadgeText}>YOU</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.groupItem, selectedGroup?.id === item.id && styles.selectedGroupItem]} 
      onPress={() => handleGroupSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.groupImage} />
      <View style={styles.groupOverlay}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{item.name}</Text>
          <View style={[
            styles.activityBadge, 
            { 
              backgroundColor: 
                item.activity === 'raid' ? '#c93c3c' : 
                item.activity === 'dungeon' ? '#3c78c9' : 
                item.activity === 'farming' ? '#5ac93c' : '#a335ee' 
            }
          ]}>
            <Text style={styles.activityBadgeText}>
              {item.activity.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.groupInfo}>
          <View style={styles.groupInfoItem}>
            <Text style={styles.groupInfoLabel}>LEADER</Text>
            <Text style={styles.groupInfoValue}>{item.leader}</Text>
          </View>
          <View style={styles.groupInfoItem}>
            <Text style={styles.groupInfoLabel}>LOCATION</Text>
            <Text style={styles.groupInfoValue}>{item.location}</Text>
          </View>
          <View style={styles.groupInfoItem}>
            <Text style={styles.groupInfoLabel}>LEVEL</Text>
            <Text style={styles.groupInfoValue}>{item.level_range}</Text>
          </View>
        </View>
        
        <View style={styles.memberCountContainer}>
          <Ionicons name="people" size={16} color="#A89968" />
          <Text style={styles.memberCountText}>
            {item.members}/{item.max_members} Members
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderFilterItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.filterItem, activityFilter === item.id && styles.activeFilterItem]} 
      onPress={() => handleFilterSelect(item.id)}
    >
      <Text style={[styles.filterText, activityFilter === item.id && styles.activeFilterText]}>
        {item.name}
      </Text>
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
          <Text style={styles.headerTitle}>PARTY & GROUPS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'party' && styles.activeTabButton]}
            onPress={() => setActiveTab('party')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'party' && styles.activeTabText]}>MY PARTY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'finder' && styles.activeTabButton]}
            onPress={() => setActiveTab('finder')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'finder' && styles.activeTabText]}>GROUP FINDER</Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'party' && (
          <View style={styles.contentContainer}>
            <View style={styles.partyHeader}>
              <Text style={styles.partyTitle}>Current Party</Text>
              <View style={styles.partyActions}>
                <TouchableOpacity style={styles.partyActionButton}>
                  <Ionicons name="person-add" size={20} color="#FFFFFF" />
                  <Text style={styles.partyActionText}>INVITE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.partyActionButton}>
                  <Ionicons name="exit" size={20} color="#FFFFFF" />
                  <Text style={styles.partyActionText}>LEAVE</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <FlatList
              data={PARTY_MEMBERS}
              renderItem={renderMemberItem}
              keyExtractor={item => item.id}
              style={styles.membersList}
              contentContainerStyle={styles.membersListContent}
            />
            
            {selectedMember && (
              <View style={styles.memberDetailsContainer}>
                <View style={styles.memberDetailsHeader}>
                  <View style={styles.memberDetailsHeaderContent}>
                    <Image source={{ uri: selectedMember.image }} style={styles.memberDetailsImage} />
                    <View style={styles.memberDetailsHeaderInfo}>
                      <Text style={styles.memberDetailsName}>{selectedMember.name}</Text>
                      <Text style={styles.memberDetailsClass}>{selectedMember.class} • Level {selectedMember.level}</Text>
                      <View style={[
                        styles.memberDetailsStatus, 
                        { backgroundColor: selectedMember.status === 'online' ? '#5ac93c' : '#6e6e6e' }
                      ]}>
                        <Text style={styles.memberDetailsStatusText}>
                          {selectedMember.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedMember(null)}>
                    <Ionicons name="close-circle" size={24} color="#A89968" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.memberDetailsContent}>
                  <View style={styles.memberStatRow}>
                    <View style={styles.memberStat}>
                      <Ionicons name="shield" size={24} color="#D4AF37" />
                      <Text style={styles.memberStatLabel}>ROLE</Text>
                      <Text style={styles.memberStatValue}>{selectedMember.role}</Text>
                    </View>
                    <View style={styles.memberStat}>
                      <Ionicons name="stats-chart" size={24} color="#D4AF37" />
                      <Text style={styles.memberStatLabel}>LEVEL</Text>
                      <Text style={styles.memberStatValue}>{selectedMember.level}</Text>
                    </View>
                    <View style={styles.memberStat}>
                      <Ionicons name="trophy" size={24} color="#D4AF37" />
                      <Text style={styles.memberStatLabel}>RANK</Text>
                      <Text style={styles.memberStatValue}>Veteran</Text>
                    </View>
                  </View>
                  
                  {selectedMember.type !== 'player' && (
                    <View style={styles.memberActions}>
                      <TouchableOpacity style={styles.memberActionButton}>
                        <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
                        <Text style={styles.memberActionText}>MESSAGE</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.memberActionButton, styles.removeButton]}>
                        <Ionicons name="person-remove" size={20} color="#FFFFFF" />
                        <Text style={styles.memberActionText}>REMOVE</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'finder' && (
          <View style={styles.contentContainer}>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#A89968" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search groups..."
                  placeholderTextColor="#A89968"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#A89968" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity 
                style={styles.createGroupButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={ACTIVITY_FILTERS}
              renderItem={renderFilterItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersList}
              contentContainerStyle={styles.filtersListContent}
            />
            
            <FlatList
              data={searchFilteredGroups}
              renderItem={renderGroupItem}
              keyExtractor={item => item.id}
              style={styles.groupsList}
              contentContainerStyle={styles.groupsListContent}
            />
            
            {selectedGroup && (
              <View style={styles.groupDetailsContainer}>
                <View style={styles.groupDetailsHeader}>
                  <Text style={styles.groupDetailsTitle}>{selectedGroup.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedGroup(null)}>
                    <Ionicons name="close-circle" size={24} color="#A89968" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.groupDetailsContent}>
                  <View style={styles.groupDetailRow}>
                    <View style={styles.groupDetailItem}>
                      <Text style={styles.groupDetailLabel}>LEADER</Text>
                      <Text style={styles.groupDetailValue}>{selectedGroup.leader}</Text>
                    </View>
                    <View style={styles.groupDetailItem}>
                      <Text style={styles.groupDetailLabel}>ACTIVITY</Text>
                      <Text style={styles.groupDetailValue}>{selectedGroup.activity.toUpperCase()}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.groupDetailRow}>
                    <View style={styles.groupDetailItem}>
                      <Text style={styles.groupDetailLabel}>LOCATION</Text>
                      <Text style={styles.groupDetailValue}>{selectedGroup.location}</Text>
                    </View>
                    <View style={styles.groupDetailItem}>
                      <Text style={styles.groupDetailLabel}>LEVEL RANGE</Text>
                      <Text style={styles.groupDetailValue}>{selectedGroup.level_range}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.groupDescription}>{selectedGroup.description}</Text>
                  
                  <Text style={styles.rolesNeededTitle}>Roles Needed</Text>
                  <View style={styles.rolesNeededContainer}>
                    {selectedGroup.roles_needed.map((role, index) => (
                      <View key={index} style={styles.roleNeededItem}>
                        <Ionicons 
                          name={
                            role === 'Tank' ? 'shield' : 
                            role === 'Healer' ? 'medkit' : 
                            role === 'DPS' ? 'flame' : 'flash'
                          } 
                          size={16} 
                          color="#FFFFFF" 
                        />
                        <Text style={styles.roleNeededText}>{role}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <TouchableOpacity style={styles.joinGroupButton}>
                    <Ionicons name="log-in" size={20} color="#FFFFFF" />
                    <Text style={styles.joinGroupText}>JOIN GROUP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <Modal
              visible={showCreateModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowCreateModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Create Group</Text>
                    <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                      <Ionicons name="close" size={24} color="#A89968" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Group Name</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter group name..."
                        placeholderTextColor="#A89968"
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Activity Type</Text>
                      <View style={styles.activityTypeContainer}>
                        {ACTIVITY_FILTERS.filter(a => a.id !== 'all').map(activity => (
                          <TouchableOpacity 
                            key={activity.id}
                            style={[styles.activityTypeButton, { backgroundColor: 
                              activity.id === 'raid' ? '#c93c3c' : 
                              activity.id === 'dungeon' ? '#3c78c9' : 
                              activity.id === 'farming' ? '#5ac93c' : '#a335ee' 
                            }]}
                          >
                            <Text style={styles.activityTypeText}>{activity.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Location</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter location..."
                        placeholderTextColor="#A89968"
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Description</Text>
                      <TextInput
                        style={[styles.textInput, styles.textAreaInput]}
                        placeholder="Enter group description..."
                        placeholderTextColor="#A89968"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.createButton}
                      onPress={() => setShowCreateModal(false)}
                    >
                      <Text style={styles.createButtonText}>CREATE GROUP</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
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
  partyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  partyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  partyActions: {
    flexDirection: 'row',
  },
  partyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginLeft: 8,
  },
  partyActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  membersList: {
    flex: 1,
  },
  membersListContent: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    position: 'relative',
  },
  selectedMemberItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  memberImageContainer: {
    position: 'relative',
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3A3A3A',
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  memberClass: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 8,
  },
  memberDetails: {
    flexDirection: 'row',
  },
  memberDetailItem: {
    marginRight: 16,
  },
  memberDetailLabel: {
    fontSize: 10,
    color: '#A89968',
    marginBottom: 2,
  },
  memberDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  playerBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  memberDetailsContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
    padding: 16,
  },
  memberDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberDetailsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberDetailsImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  memberDetailsHeaderInfo: {
    marginLeft: 12,
  },
  memberDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberDetailsClass: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 8,
  },
  memberDetailsStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  memberDetailsStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberDetailsContent: {
    marginTop: 8,
  },
  memberStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  memberStat: {
    alignItems: 'center',
  },
  memberStatLabel: {
    fontSize: 12,
    color: '#A89968',
    marginTop: 4,
    marginBottom: 2,
  },
  memberStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  memberActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
    flex: 1,
    marginHorizontal: 4,
  },
  memberActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  removeButton: {
    backgroundColor: 'rgba(201, 60, 60, 0.2)',
    borderColor: '#c93c3c',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 16,
  },
  createGroupButton: {
    width: 40,
    height: 40,
    backgroundColor: '#D4AF37',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersList: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  filtersListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    marginRight: 8,
  },
  activeFilterItem: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  filterText: {
    fontSize: 14,
    color: '#A89968',
  },
  activeFilterText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  groupsList: {
    flex: 1,
  },
  groupsListContent: {
    padding: 16,
  },
  groupItem: {
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedGroupItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  groupImage: {
    width: '100%',
    height: 100,
  },
  groupOverlay: {
    padding: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  groupInfoItem: {
    alignItems: 'center',
  },
  groupInfoLabel: {
    fontSize: 10,
    color: '#A89968',
    marginBottom: 4,
  },
  groupInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  memberCountText: {
    fontSize: 14,
    color: '#A89968',
    marginLeft: 8,
  },
  groupDetailsContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
    padding: 16,
    maxHeight: '50%',
  },
  groupDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  groupDetailsContent: {
    flex: 1,
  },
  groupDetailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  groupDetailItem: {
    flex: 1,
  },
  groupDetailLabel: {
    fontSize: 12,
    color: '#A89968',
    marginBottom: 4,
  },
  groupDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  groupDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 16,
  },
  rolesNeededTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A89968',
    marginBottom: 8,
  },
  rolesNeededContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  roleNeededItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  roleNeededText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  joinGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  joinGroupText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#A89968',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  activityTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  activityTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});