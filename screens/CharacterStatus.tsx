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

// Sample status effects data
const ACTIVE_STATUS_EFFECTS = [
  {
    id: 'status-1',
    name: 'Emberbrand',
    type: 'buff',
    description: '+15% Fire Damage, +10% Fire Resistance',
    icon: 'flame',
    iconColor: '#FF6B35',
    duration: 1800, // 30 minutes in seconds
    remaining: 1425, // 23:45 remaining
    source: 'Flame Grant Me Strength incantation',
    stackable: false,
    removable: true,
    beneficial: true,
  },
  {
    id: 'status-2',
    name: 'Poison',
    type: 'debuff',
    description: 'Deals 25 damage per second, reduces healing by 50%',
    icon: 'skull',
    iconColor: '#4CAF50',
    duration: 0, // Permanent until cured
    remaining: 0,
    source: 'Poisoned by enemy attack',
    stackable: true,
    removable: true,
    beneficial: false,
  },
  {
    id: 'status-3',
    name: 'Blessing of the Erdtree',
    type: 'buff',
    description: '+20% Holy Damage, immunity to most status effects',
    icon: 'star',
    iconColor: '#FFD700',
    duration: 3600, // 1 hour
    remaining: 3240, // 54 minutes remaining
    source: 'Erdtree Blessing',
    stackable: false,
    removable: false,
    beneficial: true,
  },
  {
    id: 'status-4',
    name: 'Blood Loss',
    type: 'debuff',
    description: 'Deals 15 damage per second, cannot heal',
    icon: 'water',
    iconColor: '#c02d28',
    duration: 0, // Permanent until cured
    remaining: 0,
    source: 'Bleeding wound',
    stackable: true,
    removable: true,
    beneficial: false,
  },
  {
    id: 'status-5',
    name: 'Golden Vow',
    type: 'buff',
    description: '+15% Attack Power, +15% Defense, +10% Stamina Recovery',
    icon: 'shield',
    iconColor: '#D4AF37',
    duration: 900, // 15 minutes
    remaining: 675, // 11:15 remaining
    source: 'Golden Vow incantation',
    stackable: false,
    removable: true,
    beneficial: true,
  }
];

// Status effect categories
const STATUS_CATEGORIES = ['All', 'Buffs', 'Debuffs', 'Neutral'];

export default function CharacterStatusScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showStatusDetails, setShowStatusDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);

  const getFilteredStatusEffects = () => {
    if (activeCategory === 'All') return ACTIVE_STATUS_EFFECTS;

    switch (activeCategory) {
      case 'Buffs':
        return ACTIVE_STATUS_EFFECTS.filter(effect => effect.beneficial);
      case 'Debuffs':
        return ACTIVE_STATUS_EFFECTS.filter(effect => !effect.beneficial);
      case 'Neutral':
        return ACTIVE_STATUS_EFFECTS.filter(effect => effect.type === 'neutral');
      default:
        return ACTIVE_STATUS_EFFECTS;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return 'Permanent';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getStatusTypeColor = (type: string, beneficial: boolean) => {
    if (beneficial) return '#4CAF50';
    if (type === 'debuff') return '#c02d28';
    return '#FF9800';
  };

  const renderStatusEffect = (status: any) => (
    <TouchableOpacity
      key={status.id}
      style={[
        styles.statusEffect,
        status.beneficial && styles.beneficialEffect,
        !status.beneficial && styles.debuffEffect
      ]}
      onPress={() => {
        setSelectedStatus(status);
        setShowStatusDetails(true);
      }}
    >
      <View style={styles.statusIconContainer}>
        <Ionicons
          name={status.icon as any}
          size={24}
          color={status.iconColor}
        />
      </View>

      <View style={styles.statusInfo}>
        <Text style={styles.statusName}>{status.name}</Text>
        <Text style={styles.statusDescription} numberOfLines={2}>
          {status.description}
        </Text>
        <Text style={styles.statusSource}>{status.source}</Text>
      </View>

      <View style={styles.statusDuration}>
        {status.duration > 0 && (
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>
              {formatTime(status.remaining)}
            </Text>
            <View style={styles.durationBar}>
              <View
                style={[
                  styles.durationFill,
                  {
                    width: `${(status.remaining / status.duration) * 100}%`,
                    backgroundColor: status.beneficial ? '#4CAF50' : '#c02d28'
                  }
                ]}
              />
            </View>
          </View>
        )}
        {status.duration === 0 && (
          <Text style={styles.permanentText}>∞</Text>
        )}
      </View>

      {status.removable && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            toast.success(`${status.name} removed`);
          }}
        >
          <Ionicons name="close" size={16} color="#A89968" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderStatusDetailsModal = () => {
    if (!selectedStatus) return null;

    return (
      <Modal
        visible={showStatusDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.statusDetailsContainer}>
            <View style={styles.statusDetailsHeader}>
              <Text style={styles.statusDetailsTitle}>Status Effect Details</Text>
              <TouchableOpacity onPress={() => setShowStatusDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.statusDetailsContent}>
              <View style={styles.statusHeader}>
                <View style={styles.detailStatusIconContainer}>
                  <Ionicons
                    name={selectedStatus.icon as any}
                    size={48}
                    color={selectedStatus.iconColor}
                  />
                </View>
                <View style={styles.detailStatusInfo}>
                  <Text style={styles.detailStatusName}>{selectedStatus.name}</Text>
                  <Text style={[
                    styles.detailStatusType,
                    { color: getStatusTypeColor(selectedStatus.type, selectedStatus.beneficial) }
                  ]}>
                    {selectedStatus.beneficial ? 'Beneficial' : 'Debuff'} Effect
                  </Text>
                  <Text style={styles.detailStatusSource}>Source: {selectedStatus.source}</Text>
                </View>
              </View>

              <Text style={styles.statusFullDescription}>{selectedStatus.description}</Text>

              <View style={styles.statusProperties}>
                <Text style={styles.sectionTitle}>Properties</Text>
                <View style={styles.propertyRow}>
                  <Text style={styles.propertyLabel}>Type:</Text>
                  <Text style={styles.propertyValue}>{selectedStatus.type}</Text>
                </View>
                <View style={styles.propertyRow}>
                  <Text style={styles.propertyLabel}>Stackable:</Text>
                  <Text style={styles.propertyValue}>{selectedStatus.stackable ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.propertyRow}>
                  <Text style={styles.propertyLabel}>Removable:</Text>
                  <Text style={styles.propertyValue}>{selectedStatus.removable ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.propertyRow}>
                  <Text style={styles.propertyLabel}>Duration:</Text>
                  <Text style={styles.propertyValue}>
                    {selectedStatus.duration > 0 ? `${selectedStatus.duration / 60} minutes` : 'Permanent'}
                  </Text>
                </View>
              </View>

              {selectedStatus.duration > 0 && (
                <View style={styles.durationSection}>
                  <Text style={styles.sectionTitle}>Time Remaining</Text>
                  <Text style={styles.remainingTimeText}>
                    {formatTime(selectedStatus.remaining)}
                  </Text>
                  <View style={styles.detailDurationBar}>
                    <View
                      style={[
                        styles.detailDurationFill,
                        {
                          width: `${(selectedStatus.remaining / selectedStatus.duration) * 100}%`,
                          backgroundColor: selectedStatus.beneficial ? '#4CAF50' : '#c02d28'
                        }
                      ]}
                    />
                  </View>
                </View>
              )}

              <View style={styles.statusActions}>
                {selectedStatus.removable && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Remove Effect</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Source</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Similar Effects</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const filteredEffects = getFilteredStatusEffects();

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20mystical%20aura%20with%20glowing%20effects&aspect=9:16&seed=status' }}
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
          <Text style={styles.headerTitle}>STATUS EFFECTS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {ACTIVE_STATUS_EFFECTS.filter(e => e.beneficial).length}
            </Text>
            <Text style={styles.summaryLabel}>Buffs</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {ACTIVE_STATUS_EFFECTS.filter(e => !e.beneficial).length}
            </Text>
            <Text style={styles.summaryLabel}>Debuffs</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {ACTIVE_STATUS_EFFECTS.filter(e => e.duration === 0).length}
            </Text>
            <Text style={styles.summaryLabel}>Permanent</Text>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          {STATUS_CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.categoryButtonText, activeCategory === category && styles.activeCategoryText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.statusList}>
          {filteredEffects.length > 0 ? (
            filteredEffects.map(renderStatusEffect)
          ) : (
            <View style={styles.noEffectsContainer}>
              <Ionicons name="shield-checkmark" size={48} color="#666" />
              <Text style={styles.noEffectsText}>No active status effects</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="medical" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Cure All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="flask" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Potions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="book" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Status Guide</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderStatusDetailsModal()}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  menuButton: {
    padding: 8,
  },
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#A89968',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeCategoryButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  categoryButtonText: {
    color: '#A89968',
    fontSize: 12,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#D4AF37',
  },
  statusList: {
    flex: 1,
  },
  statusEffect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  beneficialEffect: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(30, 40, 30, 0.9)',
  },
  debuffEffect: {
    borderColor: '#c02d28',
    backgroundColor: 'rgba(40, 30, 30, 0.9)',
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusDescription: {
    color: '#A89968',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  statusSource: {
    color: '#666',
    fontSize: 10,
  },
  statusDuration: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationText: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 4,
  },
  durationBar: {
    width: 50,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  durationFill: {
    height: '100%',
    borderRadius: 2,
  },
  permanentText: {
    color: '#FF9800',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  noEffectsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noEffectsText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
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
  statusDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  statusDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  statusDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  statusDetailsContent: {
    flex: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailStatusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailStatusInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailStatusName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailStatusType: {
    fontSize: 16,
    marginBottom: 2,
  },
  detailStatusSource: {
    color: '#A89968',
    fontSize: 12,
  },
  statusFullDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statusProperties: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 4,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  propertyLabel: {
    color: '#A89968',
    fontSize: 14,
  },
  propertyValue: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  durationSection: {
    marginBottom: 16,
  },
  remainingTimeText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  detailDurationBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  detailDurationFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});