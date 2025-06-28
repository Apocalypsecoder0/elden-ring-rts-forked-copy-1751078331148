import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Character stats data
const CHARACTER_STATS = {
  level: 42,
  experience: 12540,
  nextLevel: 15000,
  class: 'Astral Knight',
  covenant: 'Order of the Eternal Flame',
  attributes: {
    vigor: 24,
    mind: 18,
    endurance: 22,
    strength: 30,
    dexterity: 16,
    intelligence: 12,
    faith: 8,
    arcane: 10
  },
  derived: {
    health: 820,
    focus: 240,
    stamina: 118,
    equip_load: 65.4,
    current_load: 42.8
  },
  resistances: {
    physical: 142,
    magic: 86,
    fire: 110,
    lightning: 95,
    holy: 75,
    poison: 120,
    bleed: 105,
    frostbite: 90
  }
};

export default function CharacterScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('stats');
  
  const renderAttributeBar = (name, value, max = 99) => {
    const percentage = (value / max) * 100;
    return (
      <View style={styles.attributeRow}>
        <Text style={styles.attributeName}>{name}</Text>
        <View style={styles.attributeBarContainer}>
          <View style={[styles.attributeBar, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.attributeValue}>{value}</Text>
      </View>
    );
  };
  
  const renderResistanceItem = (name, value) => {
    return (
      <View style={styles.resistanceItem}>
        <Text style={styles.resistanceName}>{name}</Text>
        <Text style={styles.resistanceValue}>{value}</Text>
      </View>
    );
  };
  
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
          <Text style={styles.headerTitle}>CHARACTER</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.characterInfoContainer}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20knight%20character%20portrait%20with%20ornate%20armor&aspect=1:1&seed=character42' }}
            style={styles.characterPortrait}
          />
          <View style={styles.characterInfo}>
            <Text style={styles.characterName}>Tarnished One</Text>
            <Text style={styles.characterClass}>{CHARACTER_STATS.class}</Text>
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>LEVEL</Text>
              <Text style={styles.levelValue}>{CHARACTER_STATS.level}</Text>
            </View>
            
            <View style={styles.experienceBar}>
              <View 
                style={[
                  styles.experienceFill, 
                  { width: `${(CHARACTER_STATS.experience / CHARACTER_STATS.nextLevel) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.experienceText}>
              {CHARACTER_STATS.experience} / {CHARACTER_STATS.nextLevel} XP
            </Text>
          </View>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'stats' && styles.activeTabButton]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'stats' && styles.activeTabText]}>ATTRIBUTES</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'derived' && styles.activeTabButton]}
            onPress={() => setActiveTab('derived')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'derived' && styles.activeTabText]}>STATUS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'resistances' && styles.activeTabButton]}
            onPress={() => setActiveTab('resistances')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'resistances' && styles.activeTabText]}>RESISTANCES</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.contentContainer}>
          {activeTab === 'stats' && (
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Core Attributes</Text>
              {Object.entries(CHARACTER_STATS.attributes).map(([key, value]) => (
                <TouchableOpacity key={key} style={styles.statItemContainer}>
                  {renderAttributeBar(key.charAt(0).toUpperCase() + key.slice(1), value)}
                  <View style={styles.statActions}>
                    <TouchableOpacity style={styles.statActionButton}>
                      <Ionicons name="add-circle" size={24} color="#D4AF37" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.statActionButton}>
                      <Ionicons name="information-circle" size={24} color="#A89968" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>Available Points: 3</Text>
              </View>
            </View>
          )}
          
          {activeTab === 'derived' && (
            <View style={styles.derivedContainer}>
              <Text style={styles.sectionTitle}>Vital Statistics</Text>
              <View style={styles.vitalStats}>
                <View style={styles.vitalStatItem}>
                  <Ionicons name="heart" size={24} color="#c93c3c" />
                  <Text style={styles.vitalStatLabel}>Health</Text>
                  <Text style={styles.vitalStatValue}>{CHARACTER_STATS.derived.health}</Text>
                </View>
                <View style={styles.vitalStatItem}>
                  <Ionicons name="flash" size={24} color="#3c78c9" />
                  <Text style={styles.vitalStatLabel}>Focus</Text>
                  <Text style={styles.vitalStatValue}>{CHARACTER_STATS.derived.focus}</Text>
                </View>
                <View style={styles.vitalStatItem}>
                  <Ionicons name="battery-charging" size={24} color="#5ac93c" />
                  <Text style={styles.vitalStatLabel}>Stamina</Text>
                  <Text style={styles.vitalStatValue}>{CHARACTER_STATS.derived.stamina}</Text>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Equipment Load</Text>
              <View style={styles.loadContainer}>
                <View style={styles.loadBarContainer}>
                  <View 
                    style={[
                      styles.loadBar, 
                      { width: `${(CHARACTER_STATS.derived.current_load / CHARACTER_STATS.derived.equip_load) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.loadText}>
                  {CHARACTER_STATS.derived.current_load} / {CHARACTER_STATS.derived.equip_load}
                </Text>
              </View>
              <Text style={styles.loadStatus}>Current Status: Medium Load</Text>
              
              <Text style={styles.sectionTitle}>Covenant</Text>
              <View style={styles.covenantContainer}>
                <Image 
                  source={{ uri: 'https://api.a0.dev/assets/image?text=Fantasy%20covenant%20emblem%20with%20flame&aspect=1:1&seed=covenant42' }}
                  style={styles.covenantEmblem}
                />
                <View style={styles.covenantInfo}>
                  <Text style={styles.covenantName}>{CHARACTER_STATS.covenant}</Text>
                  <Text style={styles.covenantRank}>Rank: Adherent</Text>
                  <Text style={styles.covenantProgress}>Devotion: 1,240 / 2,000</Text>
                </View>
              </View>
            </View>
          )}
          
          {activeTab === 'resistances' && (
            <View style={styles.resistancesContainer}>
              <Text style={styles.sectionTitle}>Combat Resistances</Text>
              <View style={styles.resistanceGrid}>
                {Object.entries(CHARACTER_STATS.resistances).map(([key, value]) => (
                  renderResistanceItem(key.charAt(0).toUpperCase() + key.slice(1), value)
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>Status Effects</Text>
              <View style={styles.statusEffectsContainer}>
                <View style={styles.statusEffect}>
                  <Ionicons name="flame" size={24} color="#c93c3c" />
                  <Text style={styles.statusEffectName}>Emberbrand</Text>
                  <Text style={styles.statusEffectDesc}>+15% Fire Damage for 30 minutes</Text>
                  <Text style={styles.statusEffectTime}>24:15 remaining</Text>
                </View>
                <View style={styles.statusEffect}>
                  <Ionicons name="shield-half" size={24} color="#3c78c9" />
                  <Text style={styles.statusEffectName}>Warding</Text>
                  <Text style={styles.statusEffectDesc}>+10% Physical Defense for 15 minutes</Text>
                  <Text style={styles.statusEffectTime}>08:42 remaining</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
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
  characterInfoContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  characterPortrait: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  characterInfo: {
    flex: 1,
    marginLeft: 16,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  characterClass: {
    fontSize: 16,
    color: '#A89968',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelLabel: {
    fontSize: 14,
    color: '#A89968',
    marginRight: 8,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  experienceBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  experienceFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
  },
  experienceText: {
    fontSize: 12,
    color: '#A89968',
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
    padding: 16,
  },
  statsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 16,
    marginTop: 8,
  },
  statItemContainer: {
    marginBottom: 12,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeName: {
    width: 90,
    fontSize: 16,
    color: '#FFFFFF',
  },
  attributeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  attributeBar: {
    height: '100%',
    backgroundColor: '#D4AF37',
  },
  attributeValue: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'right',
  },
  statActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  statActionButton: {
    padding: 4,
    marginLeft: 8,
  },
  pointsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  derivedContainer: {
    flex: 1,
  },
  vitalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  vitalStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  vitalStatLabel: {
    fontSize: 14,
    color: '#A89968',
    marginTop: 8,
  },
  vitalStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  loadContainer: {
    marginBottom: 8,
  },
  loadBarContainer: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  loadBar: {
    height: '100%',
    backgroundColor: '#5ac93c',
  },
  loadText: {
    fontSize: 14,
    color: '#A89968',
    textAlign: 'right',
  },
  loadStatus: {
    fontSize: 16,
    color: '#5ac93c',
    marginBottom: 24,
  },
  covenantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  covenantEmblem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  covenantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  covenantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  covenantRank: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },
  covenantProgress: {
    fontSize: 12,
    color: '#A89968',
    marginTop: 4,
  },
  resistancesContainer: {
    flex: 1,
  },
  resistanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  resistanceItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  resistanceName: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  resistanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  statusEffectsContainer: {
    marginBottom: 16,
  },
  statusEffect: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(58, 58, 58, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  statusEffectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
    width: 100,
  },
  statusEffectDesc: {
    flex: 1,
    fontSize: 14,
    color: '#A89968',
    marginLeft: 8,
  },
  statusEffectTime: {
    fontSize: 14,
    color: '#D4AF37',
    marginLeft: 8,
  },
});