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
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample covenant data
const COVENANTS = [
  {
    id: 'golden_order',
    name: 'Golden Order',
    description: 'The Erdtree and its adherents. The most powerful faction in the Lands Between.',
    leader: 'Queen Marika',
    headquarters: 'Leyndell, Royal Capital',
    benefits: ['Access to Leyndell', 'Golden Order Incantations', 'Royal Knight Allies'],
    requirements: ['Complete main questline', 'Defeat Margit'],
    standing: 'Allied',
    reputation: 85
  },
  {
    id: 'volcano_manor',
    name: 'Volcano Manor',
    description: 'A mansion of shadow and flame, home to those who walk the path of assassination.',
    leader: 'Lady Tanith',
    headquarters: 'Mt. Gelmir',
    benefits: ['Assassination Contracts', 'Flame-based Incantations', 'Abductor Virgin Allies'],
    requirements: ['Reach Mt. Gelmir', 'Complete assassination quests'],
    standing: 'Neutral',
    reputation: 45
  },
  {
    id: 'academy_raya_lucaria',
    name: 'Academy of Raya Lucaria',
    description: 'The greatest academy of glintstone sorcery in the Lands Between.',
    leader: 'Lusat',
    headquarters: 'Raya Lucaria',
    benefits: ['Glintstone Sorceries', 'Scholar Allies', 'Magic Research'],
    requirements: ['Reach Liurnia', 'Complete academy quests'],
    standing: 'Allied',
    reputation: 72
  },
  {
    id: 'fingers_of_chaos',
    name: 'Fingers of Chaos',
    description: 'The Three Fingers and their chaotic influence. Embraces madness and frenzy.',
    leader: 'The Three Fingers',
    headquarters: 'Subterranean Shunning-Grounds',
    benefits: ['Frenzy Incantations', 'Chaos Allies', 'Madness Resistance'],
    requirements: ['Find the Three Fingers', 'Embrace the chaos'],
    standing: 'Hostile',
    reputation: -30
  }
];

export default function WorldCovenantsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCovenant, setSelectedCovenant] = useState<typeof COVENANTS[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const selectCovenant = (covenant: typeof COVENANTS[0]) => {
    setSelectedCovenant(covenant);
    setShowDetails(true);
  };

  const getStandingColor = (standing: string) => {
    switch (standing) {
      case 'Allied': return '#4CAF50';
      case 'Friendly': return '#8BC34A';
      case 'Neutral': return '#FF9800';
      case 'Hostile': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderCovenantItem = ({ item }: { item: typeof COVENANTS[0] }) => (
    <TouchableOpacity
      style={styles.covenantItem}
      onPress={() => selectCovenant(item)}
    >
      <View style={styles.covenantHeader}>
        <View style={styles.covenantIcon}>
          <FontAwesome5 name="crown" size={24} color="#D4AF37" />
        </View>
        <View style={styles.covenantInfo}>
          <Text style={styles.covenantName}>{item.name}</Text>
          <Text style={styles.covenantLeader}>Leader: {item.leader}</Text>
        </View>
        <View style={[styles.standingBadge, { backgroundColor: getStandingColor(item.standing) }]}>
          <Text style={styles.standingText}>{item.standing}</Text>
        </View>
      </View>

      <Text style={styles.covenantDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.reputationBar}>
        <Text style={styles.reputationLabel}>Reputation: {item.reputation}</Text>
        <View style={styles.reputationFill}>
          <View
            style={[
              styles.reputationProgress,
              {
                width: `${Math.max(0, Math.min(100, item.reputation + 50))}%`,
                backgroundColor: item.reputation >= 0 ? '#4CAF50' : '#F44336'
              }
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDetailsModal = () => {
    if (!selectedCovenant) return null;

    return (
      <Modal
        visible={showDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Covenant Details</Text>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailsContent}>
              <View style={styles.covenantDetailHeader}>
                <View style={styles.detailIcon}>
                  <FontAwesome5 name="crown" size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailName}>{selectedCovenant.name}</Text>
                  <Text style={styles.detailLeader}>Leader: {selectedCovenant.leader}</Text>
                  <Text style={styles.detailHq}>HQ: {selectedCovenant.headquarters}</Text>
                </View>
              </View>

              <Text style={styles.detailDescription}>{selectedCovenant.description}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Benefits</Text>
                {selectedCovenant.benefits.map((benefit, index) => (
                  <Text key={index} style={styles.benefitText}>• {benefit}</Text>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                {selectedCovenant.requirements.map((req, index) => (
                  <Text key={index} style={styles.requirementText}>• {req}</Text>
                ))}
              </View>

              <View style={styles.standingSection}>
                <Text style={styles.sectionTitle}>Current Standing</Text>
                <View style={styles.standingInfo}>
                  <Text style={[styles.standingValue, { color: getStandingColor(selectedCovenant.standing) }]}>
                    {selectedCovenant.standing}
                  </Text>
                  <Text style={styles.reputationValue}>Reputation: {selectedCovenant.reputation}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    toast.success(`Joined ${selectedCovenant.name}!`);
                    setShowDetails(false);
                  }}
                >
                  <Text style={styles.actionButtonText}>Join Covenant</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    toast.info('Covenant information updated');
                    setShowDetails(false);
                  }}
                >
                  <Text style={styles.actionButtonText}>View Quests</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Ancient%20covenant%20chamber%20with%20glowing%20runes%20and%20faction%20banners&aspect=9:16&seed=covenants' }}
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
          <Text style={styles.headerTitle}>COVENANTS & FACTIONS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Allied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#8BC34A' }]} />
            <Text style={styles.legendText}>Friendly</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Neutral</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Hostile</Text>
          </View>
        </View>

        <FlatList
          data={COVENANTS}
          renderItem={renderCovenantItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.covenantsList}
        />

        {renderDetailsModal()}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  menuButton: {
    padding: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  covenantsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  covenantItem: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  covenantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  covenantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  covenantInfo: {
    flex: 1,
  },
  covenantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 2,
  },
  covenantLeader: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  standingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  standingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  covenantDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 10,
  },
  reputationBar: {
    marginTop: 10,
  },
  reputationLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  reputationFill: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  reputationProgress: {
    height: '100%',
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  detailsContent: {
    padding: 20,
  },
  covenantDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  detailLeader: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  detailHq: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  detailDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 5,
    marginLeft: 10,
  },
  requirementText: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 5,
    marginLeft: 10,
  },
  standingSection: {
    marginBottom: 20,
  },
  standingInfo: {
    alignItems: 'center',
  },
  standingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reputationValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
});