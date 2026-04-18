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

// Sample skills data
const PLAYER_SKILLS = [
  {
    id: 'skill-1',
    name: 'Roar',
    type: 'Ash of War',
    description: 'Let out a bestial roar to build poise, and follow up with a strong attack.',
    level: 3,
    maxLevel: 10,
    fpCost: 12,
    staminaCost: 25,
    cooldown: 30,
    equipped: true,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20roar%20with%20sound%20waves&aspect=1:1&seed=roar'
  },
  {
    id: 'skill-2',
    name: 'Parry',
    type: 'Skill',
    description: 'Deflect an attack at the right time to follow up with a critical hit.',
    level: 1,
    maxLevel: 1,
    fpCost: 0,
    staminaCost: 10,
    cooldown: 0,
    equipped: true,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20parry%20with%20shield&aspect=1:1&seed=parry'
  },
  {
    id: 'skill-3',
    name: 'Bloodhound\'s Step',
    type: 'Skill',
    description: 'Step around enemies with cunning footwork.',
    level: 5,
    maxLevel: 10,
    fpCost: 8,
    staminaCost: 15,
    cooldown: 20,
    equipped: false,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20dash%20with%20footprints&aspect=1:1&seed=bloodhound'
  },
  {
    id: 'skill-4',
    name: 'Glintstone Pebble',
    type: 'Sorcery',
    description: 'Hurl a projectile of glintstone that explodes on impact.',
    level: 2,
    maxLevel: 15,
    fpCost: 15,
    staminaCost: 20,
    cooldown: 0,
    equipped: true,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20magic%20projectile%20with%20sparkles&aspect=1:1&seed=glintstone'
  },
  {
    id: 'skill-5',
    name: 'Urgent Heal',
    type: 'Incantation',
    description: 'Alleviate buildup of blood loss, poison, and scarlet rot.',
    level: 1,
    maxLevel: 10,
    fpCost: 18,
    staminaCost: 0,
    cooldown: 0,
    equipped: true,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20healing%20with%20cross&aspect=1:1&seed=urgentheal'
  }
];

// Available skills to learn
const AVAILABLE_SKILLS = [
  {
    id: 'skill-6',
    name: 'Lion\'s Claw',
    type: 'Ash of War',
    description: 'Leap forward and slash with a large claw.',
    requirements: { strength: 15, dexterity: 15 },
    cost: 1200,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20lion%20claw%20attack&aspect=1:1&seed=lionclaw'
  },
  {
    id: 'skill-7',
    name: 'Flame Grant Me Strength',
    type: 'Incantation',
    description: 'Temporarily boosts attack power with fire.',
    requirements: { faith: 12 },
    cost: 800,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20fire%20buff%20with%20flames&aspect=1:1&seed=flamestrength'
  },
  {
    id: 'skill-8',
    name: 'Crystal Burst',
    type: 'Sorcery',
    description: 'Create a burst of crystal shards around the caster.',
    requirements: { intelligence: 18 },
    cost: 1500,
    icon: 'https://api.a0.dev/assets/image?text=Fantasy%20skill%20icon%20crystal%20explosion&aspect=1:1&seed=crystalburst'
  }
];

const SKILL_TYPES = ['All', 'Ash of War', 'Skill', 'Sorcery', 'Incantation'];

export default function CharacterSkillsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('equipped');
  const [selectedSkillType, setSelectedSkillType] = useState('All');
  const [showSkillDetails, setShowSkillDetails] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [showLearnModal, setShowLearnModal] = useState(false);

  const getSkillTypeColor = (type: string) => {
    switch (type) {
      case 'Ash of War': return '#FF6B35';
      case 'Skill': return '#4CAF50';
      case 'Sorcery': return '#2196F3';
      case 'Incantation': return '#9C27B0';
      default: return '#A89968';
    }
  };

  const filteredSkills = selectedSkillType === 'All'
    ? PLAYER_SKILLS
    : PLAYER_SKILLS.filter(skill => skill.type === selectedSkillType);

  const renderSkillItem = (skill: any, isEquipped: boolean = true) => (
    <TouchableOpacity
      style={[styles.skillItem, isEquipped && skill.equipped && styles.equippedSkill]}
      onPress={() => {
        setSelectedSkill(skill);
        setShowSkillDetails(true);
      }}
    >
      <ImageBackground
        source={{ uri: skill.icon }}
        style={styles.skillIcon}
        imageStyle={styles.skillIconImage}
      >
        <View style={[styles.skillTypeIndicator, { backgroundColor: getSkillTypeColor(skill.type) }]} />
      </ImageBackground>

      <View style={styles.skillInfo}>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={[styles.skillType, { color: getSkillTypeColor(skill.type) }]}>{skill.type}</Text>
        <Text style={styles.skillLevel}>Level {skill.level}/{skill.maxLevel}</Text>
      </View>

      <View style={styles.skillStats}>
        {skill.fpCost > 0 && (
          <View style={styles.statItem}>
            <FontAwesome5 name="magic" size={12} color="#2196F3" />
            <Text style={styles.statText}>{skill.fpCost}</Text>
          </View>
        )}
        {skill.staminaCost > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="battery-charging" size={12} color="#4CAF50" />
            <Text style={styles.statText}>{skill.staminaCost}</Text>
          </View>
        )}
        {skill.cooldown > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="time" size={12} color="#FF9800" />
            <Text style={styles.statText}>{skill.cooldown}s</Text>
          </View>
        )}
      </View>

      {isEquipped && (
        <TouchableOpacity style={styles.equipButton}>
          <Ionicons
            name={skill.equipped ? "checkmark-circle" : "add-circle"}
            size={24}
            color={skill.equipped ? "#4CAF50" : "#A89968"}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderSkillDetailsModal = () => {
    if (!selectedSkill) return null;

    return (
      <Modal
        visible={showSkillDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSkillDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.skillDetailsContainer}>
            <View style={styles.skillDetailsHeader}>
              <Text style={styles.skillDetailsTitle}>Skill Details</Text>
              <TouchableOpacity onPress={() => setShowSkillDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.skillDetailsContent}>
              <View style={styles.skillHeader}>
                <ImageBackground
                  source={{ uri: selectedSkill.icon }}
                  style={styles.detailSkillIcon}
                  imageStyle={styles.detailSkillIconImage}
                >
                  <View style={[styles.detailSkillTypeIndicator, { backgroundColor: getSkillTypeColor(selectedSkill.type) }]} />
                </ImageBackground>
                <View style={styles.detailSkillInfo}>
                  <Text style={styles.detailSkillName}>{selectedSkill.name}</Text>
                  <Text style={[styles.detailSkillType, { color: getSkillTypeColor(selectedSkill.type) }]}>
                    {selectedSkill.type}
                  </Text>
                  <Text style={styles.detailSkillLevel}>
                    Level {selectedSkill.level}/{selectedSkill.maxLevel}
                  </Text>
                </View>
              </View>

              <Text style={styles.skillDescription}>{selectedSkill.description}</Text>

              <View style={styles.skillStatsSection}>
                <Text style={styles.sectionTitle}>Resource Costs</Text>
                {selectedSkill.fpCost > 0 && (
                  <View style={styles.statRow}>
                    <FontAwesome5 name="magic" size={16} color="#2196F3" />
                    <Text style={styles.statLabel}>FP Cost:</Text>
                    <Text style={styles.statValue}>{selectedSkill.fpCost}</Text>
                  </View>
                )}
                {selectedSkill.staminaCost > 0 && (
                  <View style={styles.statRow}>
                    <Ionicons name="battery-charging" size={16} color="#4CAF50" />
                    <Text style={styles.statLabel}>Stamina Cost:</Text>
                    <Text style={styles.statValue}>{selectedSkill.staminaCost}</Text>
                  </View>
                )}
                {selectedSkill.cooldown > 0 && (
                  <View style={styles.statRow}>
                    <Ionicons name="time" size={16} color="#FF9800" />
                    <Text style={styles.statLabel}>Cooldown:</Text>
                    <Text style={styles.statValue}>{selectedSkill.cooldown} seconds</Text>
                  </View>
                )}
              </View>

              <View style={styles.skillActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Level Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>
                    {selectedSkill.equipped ? 'Unequip' : 'Equip'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Forget</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLearnSkillsModal = () => (
    <Modal
      visible={showLearnModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLearnModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.learnSkillsContainer}>
          <View style={styles.learnSkillsHeader}>
            <Text style={styles.learnSkillsTitle}>Learn New Skills</Text>
            <TouchableOpacity onPress={() => setShowLearnModal(false)}>
              <Ionicons name="close" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.learnSkillsContent}>
            {AVAILABLE_SKILLS.map(skill => (
              <TouchableOpacity key={skill.id} style={styles.availableSkillItem}>
                <ImageBackground
                  source={{ uri: skill.icon }}
                  style={styles.availableSkillIcon}
                  imageStyle={styles.availableSkillIconImage}
                >
                  <View style={[styles.availableSkillTypeIndicator, { backgroundColor: getSkillTypeColor(skill.type) }]} />
                </ImageBackground>

                <View style={styles.availableSkillInfo}>
                  <Text style={styles.availableSkillName}>{skill.name}</Text>
                  <Text style={[styles.availableSkillType, { color: getSkillTypeColor(skill.type) }]}>
                    {skill.type}
                  </Text>
                  <Text style={styles.availableSkillCost}>{skill.cost} Runes</Text>
                </View>

                <TouchableOpacity style={styles.learnButton}>
                  <Text style={styles.learnButtonText}>Learn</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Dark%20fantasy%20library%20with%20ancient%20spellbooks%20and%20magical%20artifacts&aspect=9:16&seed=skilllibrary' }}
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
          <Text style={styles.headerTitle}>SKILLS & INCANTATIONS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'equipped' && styles.activeTabButton]}
            onPress={() => setActiveTab('equipped')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'equipped' && styles.activeTabText]}>
              Equipped ({PLAYER_SKILLS.filter(s => s.equipped).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'all' && styles.activeTabText]}>
              All Skills ({PLAYER_SKILLS.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'learn' && styles.activeTabButton]}
            onPress={() => setShowLearnModal(true)}
          >
            <Text style={[styles.tabButtonText, activeTab === 'learn' && styles.activeTabText]}>
              Learn New
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab !== 'learn' && (
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SKILL_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterButton, selectedSkillType === type && styles.activeFilterButton]}
                  onPress={() => setSelectedSkillType(type)}
                >
                  <Text style={[styles.filterButtonText, selectedSkillType === type && styles.activeFilterText]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView style={styles.skillsContainer}>
          {activeTab === 'equipped' && filteredSkills.filter(skill => skill.equipped).map(skill => renderSkillItem(skill, true))}
          {activeTab === 'all' && filteredSkills.map(skill => renderSkillItem(skill, false))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="school" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Skill Tree</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="book" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Spellbook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="stats-chart" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Attributes</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderSkillDetailsModal()}
      {renderLearnSkillsModal()}
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeTabButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  tabButtonText: {
    color: '#A89968',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#D4AF37',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  filterButtonText: {
    color: '#A89968',
    fontSize: 12,
  },
  activeFilterText: {
    color: '#D4AF37',
  },
  skillsContainer: {
    flex: 1,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  equippedSkill: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(30, 40, 30, 0.9)',
  },
  skillIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillIconImage: {
    borderRadius: 6,
  },
  skillTypeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  skillInfo: {
    flex: 1,
    marginLeft: 12,
  },
  skillName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  skillType: {
    fontSize: 12,
    marginBottom: 2,
  },
  skillLevel: {
    color: '#A89968',
    fontSize: 12,
  },
  skillStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  statText: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 2,
  },
  equipButton: {
    padding: 4,
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
  skillDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  skillDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  skillDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  skillDetailsContent: {
    flex: 1,
  },
  skillHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailSkillIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailSkillIconImage: {
    borderRadius: 8,
  },
  detailSkillTypeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  detailSkillInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  detailSkillName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailSkillType: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailSkillLevel: {
    color: '#A89968',
    fontSize: 12,
  },
  skillDescription: {
    color: '#A89968',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  skillStatsSection: {
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
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statLabel: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  skillActions: {
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
  learnSkillsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  learnSkillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  learnSkillsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  learnSkillsContent: {
    flex: 1,
  },
  availableSkillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  availableSkillIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableSkillIconImage: {
    borderRadius: 6,
  },
  availableSkillTypeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  availableSkillInfo: {
    flex: 1,
    marginLeft: 12,
  },
  availableSkillName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  availableSkillType: {
    fontSize: 12,
    marginBottom: 2,
  },
  availableSkillCost: {
    color: '#FFD700',
    fontSize: 12,
  },
  learnButton: {
    backgroundColor: 'rgba(40, 35, 20, 0.9)',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  learnButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
});