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
  ProgressBarAndroid,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample factions data
const FACTIONS = [
  {
    id: 'golden-order',
    name: 'Golden Order',
    leader: 'Queen Marika',
    standing: 'Allied',
    reputation: 85,
    maxReputation: 100,
    description: 'The ruling faction of the Lands Between, maintaining order through divine rule.',
    benefits: [
      'Access to Leyndell',
      'Golden Order incantations',
      'Safe passage through ordered territories',
      'Trade discounts in allied settlements'
    ],
    penalties: [
      'Hostile to Frenzied Flame followers',
      'Restricted access to chaotic regions'
    ],
    currentQuests: ['Restore the Elden Ring', 'Defeat the Shardbearers']
  },
  {
    id: 'carian-royalty',
    name: 'Carian Royalty',
    leader: 'Rennala, Queen of the Full Moon',
    standing: 'Friendly',
    reputation: 65,
    maxReputation: 100,
    description: 'The scholarly mages of Liurnia, masters of glintstone and lunar magic.',
    benefits: [
      'Glintstone magic training',
      'Access to Raya Lucaria Academy',
      'Magical item discounts',
      'Research assistance'
    ],
    penalties: [
      'Hostile to those who harm scholars',
      'Magic restrictions in non-magical areas'
    ],
    currentQuests: ['Restore Rennala\'s power', 'Research the stars']
  },
  {
    id: 'volcano-manor',
    name: 'Volcano Manor',
    leader: 'Tanith',
    standing: 'Neutral',
    reputation: 45,
    maxReputation: 100,
    description: 'A mysterious manor serving dark purposes in the shadow of Mount Gelmir.',
    benefits: [
      'Assassination contracts',
      'Rare weapons and poisons',
      'Information network access'
    ],
    penalties: [
      'High risk of betrayal',
      'Reputation loss with honorable factions',
      'Potential assassination targets'
    ],
    currentQuests: ['Eliminate targets', 'Uncover manor secrets']
  },
  {
    id: 'albinaurics',
    name: 'Albinauric Village',
    leader: 'Albus',
    standing: 'Friendly',
    reputation: 70,
    maxReputation: 100,
    description: 'The oppressed Albinaurics, seeking freedom and recognition.',
    benefits: [
      'Unique crafting materials',
      'Albinauric weapon upgrades',
      'Hidden village access',
      'Loyal companions'
    ],
    penalties: [
      'Hostile to Jarburg inhabitants',
      'Limited influence in major cities'
    ],
    currentQuests: ['Free the Albinaurics', 'Craft legendary weapons']
  },
  {
    id: 'nomadic-merchants',
    name: 'Nomadic Merchants',
    leader: 'Kale the Merchant',
    standing: 'Trusted',
    reputation: 90,
    maxReputation: 100,
    description: 'Wandering traders who facilitate commerce across the Lands Between.',
    benefits: [
      'Exclusive merchant deals',
      'Rare item notifications',
      'Trading caravan protection',
      'Market information'
    ],
    penalties: [
      'Loss of trade routes if betrayed',
      'Merchant caravan attacks'
    ],
    currentQuests: ['Establish new trade routes', 'Recover stolen goods']
  }
];

const WorldFactions: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFaction, setSelectedFaction] = useState<typeof FACTIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFactionPress = (faction: typeof FACTIONS[0]) => {
    setSelectedFaction(faction);
    setModalVisible(true);
  };

  const handleImproveStanding = () => {
    if (selectedFaction) {
      toast.success(`Working to improve standing with ${selectedFaction.name}`);
      setModalVisible(false);
    }
  };

  const getStandingColor = (standing: string) => {
    switch (standing) {
      case 'Allied': return '#4CAF50';
      case 'Friendly': return '#8BC34A';
      case 'Neutral': return '#FF9800';
      case 'Hostile': return '#F44336';
      case 'Trusted': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getStandingIcon = (standing: string) => {
    switch (standing) {
      case 'Allied': return 'shield-checkmark';
      case 'Friendly': return 'heart';
      case 'Neutral': return 'remove';
      case 'Hostile': return 'skull';
      case 'Trusted': return 'star';
      default: return 'help';
    }
  };

  const renderFactionItem = ({ item }: { item: typeof FACTIONS[0] }) => (
    <TouchableOpacity
      style={styles.factionCard}
      onPress={() => handleFactionPress(item)}
    >
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.factionCardGradient}
      >
        <View style={styles.factionHeader}>
          <View style={styles.factionIconContainer}>
            <Ionicons name={getStandingIcon(item.standing)} size={24} color={getStandingColor(item.standing)} />
          </View>
          <View style={styles.factionInfo}>
            <Text style={styles.factionName}>{item.name}</Text>
            <Text style={styles.factionLeader}>Led by {item.leader}</Text>
          </View>
          <View style={[styles.standingBadge, { backgroundColor: getStandingColor(item.standing) }]}>
            <Text style={styles.standingText}>{item.standing}</Text>
          </View>
        </View>

        <Text style={styles.factionDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.reputationSection}>
          <Text style={styles.reputationLabel}>Reputation</Text>
          <View style={styles.reputationBar}>
            {Platform.OS === 'android' ? (
              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={item.reputation / item.maxReputation}
                color="#FFD700"
              />
            ) : (
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(item.reputation / item.maxReputation) * 100}%` }
                  ]}
                />
              </View>
            )}
            <Text style={styles.reputationText}>
              {item.reputation}/{item.maxReputation}
            </Text>
          </View>
        </View>

        <View style={styles.factionFooter}>
          <Text style={styles.questsCount}>
            {item.currentQuests.length} active quest{item.currentQuests.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
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
          <Text style={styles.title}>FACTION STANDINGS</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Factions List */}
        <FlatList
          data={FACTIONS}
          renderItem={renderFactionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.factionsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Faction Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedFaction && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedFaction.name}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#FFD700" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.factionDetailSection}>
                      <Text style={styles.sectionTitle}>Faction Details</Text>
                      <Text style={styles.factionDetailText}>
                        <Text style={styles.detailLabel}>Leader:</Text> {selectedFaction.leader}
                      </Text>
                      <Text style={styles.factionDetailText}>
                        <Text style={styles.detailLabel}>Standing:</Text> {selectedFaction.standing}
                      </Text>
                      <Text style={styles.factionDetailText}>
                        <Text style={styles.detailLabel}>Reputation:</Text> {selectedFaction.reputation}/{selectedFaction.maxReputation}
                      </Text>
                    </View>

                    <View style={styles.factionDetailSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.factionDescriptionText}>
                        {selectedFaction.description}
                      </Text>
                    </View>

                    <View style={styles.factionDetailSection}>
                      <Text style={styles.sectionTitle}>Benefits</Text>
                      {selectedFaction.benefits.map((benefit, index) => (
                        <Text key={index} style={styles.benefitText}>
                          • {benefit}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.factionDetailSection}>
                      <Text style={styles.sectionTitle}>Penalties</Text>
                      {selectedFaction.penalties.map((penalty, index) => (
                        <Text key={index} style={styles.penaltyText}>
                          • {penalty}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.factionDetailSection}>
                      <Text style={styles.sectionTitle}>Active Quests</Text>
                      {selectedFaction.currentQuests.map((quest, index) => (
                        <Text key={index} style={styles.questText}>
                          • {quest}
                        </Text>
                      ))}
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.improveButton}
                      onPress={handleImproveStanding}
                    >
                      <Text style={styles.improveButtonText}>Improve Standing</Text>
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
  headerSpacer: {
    width: 44,
  },
  factionsList: {
    padding: 20,
    paddingBottom: 100,
  },
  factionCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  factionCardGradient: {
    padding: 15,
  },
  factionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  factionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  factionInfo: {
    flex: 1,
  },
  factionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  factionLeader: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  standingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  standingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  factionDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 20,
    marginBottom: 15,
  },
  reputationSection: {
    marginBottom: 15,
  },
  reputationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  reputationBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  reputationText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  factionFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  questsCount: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  factionDetailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  factionDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  factionDescriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  benefitText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 3,
  },
  penaltyText: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 3,
  },
  questText: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 3,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  improveButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  improveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
});

export default WorldFactions;