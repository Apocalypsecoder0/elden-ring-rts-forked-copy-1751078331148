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

// Import game types
import { CharacterAppearance } from '../types/gameTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample appearance options
const APPEARANCE_OPTIONS = {
  hairStyles: [
    { id: 'short', name: 'Short', description: 'Clean and practical' },
    { id: 'medium', name: 'Medium', description: 'Balanced length' },
    { id: 'long', name: 'Long', description: 'Flowing and dramatic' },
    { id: 'braids', name: 'Braids', description: 'Intricate woven style' },
    { id: 'ponytail', name: 'Ponytail', description: 'Simple and functional' },
    { id: 'bald', name: 'Bald', description: 'Shaved clean' },
  ],
  hairColors: [
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'brown', name: 'Brown', color: '#8B4513' },
    { id: 'blonde', name: 'Blonde', color: '#FFD700' },
    { id: 'red', name: 'Red', color: '#DC143C' },
    { id: 'white', name: 'White', color: '#F5F5F5' },
    { id: 'blue', name: 'Blue', color: '#4169E1' },
    { id: 'green', name: 'Green', color: '#228B22' },
    { id: 'purple', name: 'Purple', color: '#8A2BE2' },
  ],
  eyeColors: [
    { id: 'brown', name: 'Brown', color: '#8B4513' },
    { id: 'blue', name: 'Blue', color: '#4169E1' },
    { id: 'green', name: 'Green', color: '#228B22' },
    { id: 'hazel', name: 'Hazel', color: '#D2691E' },
    { id: 'gray', name: 'Gray', color: '#708090' },
    { id: 'amber', name: 'Amber', color: '#FFBF00' },
    { id: 'red', name: 'Red', color: '#DC143C' },
    { id: 'purple', name: 'Purple', color: '#8A2BE2' },
  ],
  skinTones: [
    { id: 'pale', name: 'Pale', color: '#F5DEB3' },
    { id: 'fair', name: 'Fair', color: '#F4C2A1' },
    { id: 'medium', name: 'Medium', color: '#D2B48C' },
    { id: 'olive', name: 'Olive', color: '#BCB88A' },
    { id: 'tan', name: 'Tan', color: '#CD853F' },
    { id: 'dark', name: 'Dark', color: '#8B4513' },
    { id: 'ebony', name: 'Ebony', color: '#2F1B14' },
  ],
  bodyTypes: [
    { id: 'slender', name: 'Slender', description: 'Light and agile build' },
    { id: 'athletic', name: 'Athletic', description: 'Muscular and fit' },
    { id: 'stocky', name: 'Stocky', description: 'Strong and sturdy' },
    { id: 'large', name: 'Large', description: 'Imposing presence' },
  ],
  facialFeatures: [
    { id: 'clean', name: 'Clean Shaven', description: 'No facial hair' },
    { id: 'beard', name: 'Beard', description: 'Full beard' },
    { id: 'mustache', name: 'Mustache', description: 'Only mustache' },
    { id: 'goatee', name: 'Goatee', description: 'Goatee style' },
    { id: 'stubble', name: 'Stubble', description: 'Short stubble' },
  ],
  scars: [
    { id: 'none', name: 'None', description: 'Unmarked skin' },
    { id: 'cheek', name: 'Cheek Scar', description: 'Scar on cheek' },
    { id: 'forehead', name: 'Forehead Scar', description: 'Scar on forehead' },
    { id: 'eye', name: 'Eye Patch', description: 'Missing eye' },
    { id: 'nose', name: 'Broken Nose', description: 'Crooked nose' },
  ],
  tattoos: [
    { id: 'none', name: 'None', description: 'No tattoos' },
    { id: 'runes', name: 'Rune Tattoos', description: 'Ancient runes' },
    { id: 'tribal', name: 'Tribal', description: 'Tribal patterns' },
    { id: 'dragon', name: 'Dragon', description: 'Dragon motifs' },
    { id: 'symbols', name: 'Symbols', description: 'Mystical symbols' },
  ],
};

// Sample current appearance
const CURRENT_APPEARANCE: CharacterAppearance = {
  hairStyle: 'medium',
  hairColor: 'brown',
  eyeColor: 'brown',
  skinTone: 'medium',
  bodyType: 'athletic',
  facialFeatures: 'stubble',
  scars: 'none',
  tattoos: 'none',
  height: 180,
  age: 25,
};

export default function CharacterCustomizationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentAppearance, setCurrentAppearance] = useState<CharacterAppearance>(CURRENT_APPEARANCE);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [characterName, setCharacterName] = useState('Tarnished Warrior');

  const categories = [
    { id: 'hair', name: 'Hair', icon: 'cut' },
    { id: 'eyes', name: 'Eyes', icon: 'eye' },
    { id: 'skin', name: 'Skin', icon: 'color-palette' },
    { id: 'body', name: 'Body', icon: 'body' },
    { id: 'face', name: 'Face', icon: 'person' },
    { id: 'marks', name: 'Marks', icon: 'brush' },
    { id: 'stats', name: 'Stats', icon: 'stats-chart' },
  ];

  const updateAppearance = (category: keyof CharacterAppearance, value: any) => {
    setCurrentAppearance({
      ...currentAppearance,
      [category]: value,
    });
  };

  const renderCategoryItem = ({ item }: { item: { id: string; name: string; icon: string } }) => {
    const isSelected = selectedCategory === item.id;

    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <View style={[styles.categoryIconContainer, isSelected && styles.selectedCategoryIcon]}>
          <Ionicons name={item.icon as any} size={24} color={isSelected ? "#000" : "#D4AF37"} />
        </View>
        <Text style={[styles.categoryName, isSelected && styles.selectedCategoryName]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCustomizationOptions = () => {
    if (!selectedCategory) return null;

    switch (selectedCategory) {
      case 'hair':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Hair Style</Text>
            <View style={styles.optionsGrid}>
              {APPEARANCE_OPTIONS.hairStyles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[
                    styles.optionItem,
                    currentAppearance.hairStyle === style.id && styles.selectedOptionItem
                  ]}
                  onPress={() => updateAppearance('hairStyle', style.id)}
                >
                  <Text style={[
                    styles.optionName,
                    currentAppearance.hairStyle === style.id && styles.selectedOptionText
                  ]}>
                    {style.name}
                  </Text>
                  <Text style={styles.optionDescription}>{style.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.optionsTitle}>Hair Color</Text>
            <View style={styles.colorGrid}>
              {APPEARANCE_OPTIONS.hairColors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color.color },
                    currentAppearance.hairColor === color.id && styles.selectedColorItem
                  ]}
                  onPress={() => updateAppearance('hairColor', color.id)}
                >
                  {currentAppearance.hairColor === color.id && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'eyes':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Eye Color</Text>
            <View style={styles.colorGrid}>
              {APPEARANCE_OPTIONS.eyeColors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color.color },
                    currentAppearance.eyeColor === color.id && styles.selectedColorItem
                  ]}
                  onPress={() => updateAppearance('eyeColor', color.id)}
                >
                  {currentAppearance.eyeColor === color.id && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'skin':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Skin Tone</Text>
            <View style={styles.colorGrid}>
              {APPEARANCE_OPTIONS.skinTones.map((tone) => (
                <TouchableOpacity
                  key={tone.id}
                  style={[
                    styles.colorItem,
                    { backgroundColor: tone.color },
                    currentAppearance.skinTone === tone.id && styles.selectedColorItem
                  ]}
                  onPress={() => updateAppearance('skinTone', tone.id)}
                >
                  {currentAppearance.skinTone === tone.id && (
                    <Ionicons name="checkmark" size={16} color="#000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'body':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Body Type</Text>
            <View style={styles.optionsGrid}>
              {APPEARANCE_OPTIONS.bodyTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.optionItem,
                    currentAppearance.bodyType === type.id && styles.selectedOptionItem
                  ]}
                  onPress={() => updateAppearance('bodyType', type.id)}
                >
                  <Text style={[
                    styles.optionName,
                    currentAppearance.bodyType === type.id && styles.selectedOptionText
                  ]}>
                    {type.name}
                  </Text>
                  <Text style={styles.optionDescription}>{type.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'face':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Facial Features</Text>
            <View style={styles.optionsGrid}>
              {APPEARANCE_OPTIONS.facialFeatures.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={[
                    styles.optionItem,
                    currentAppearance.facialFeatures === feature.id && styles.selectedOptionItem
                  ]}
                  onPress={() => updateAppearance('facialFeatures', feature.id)}
                >
                  <Text style={[
                    styles.optionName,
                    currentAppearance.facialFeatures === feature.id && styles.selectedOptionText
                  ]}>
                    {feature.name}
                  </Text>
                  <Text style={styles.optionDescription}>{feature.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'marks':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Scars & Tattoos</Text>

            <Text style={styles.subOptionsTitle}>Scars</Text>
            <View style={styles.optionsGrid}>
              {APPEARANCE_OPTIONS.scars.map((scar) => (
                <TouchableOpacity
                  key={scar.id}
                  style={[
                    styles.optionItem,
                    currentAppearance.scars === scar.id && styles.selectedOptionItem
                  ]}
                  onPress={() => updateAppearance('scars', scar.id)}
                >
                  <Text style={[
                    styles.optionName,
                    currentAppearance.scars === scar.id && styles.selectedOptionText
                  ]}>
                    {scar.name}
                  </Text>
                  <Text style={styles.optionDescription}>{scar.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.subOptionsTitle}>Tattoos</Text>
            <View style={styles.optionsGrid}>
              {APPEARANCE_OPTIONS.tattoos.map((tattoo) => (
                <TouchableOpacity
                  key={tattoo.id}
                  style={[
                    styles.optionItem,
                    currentAppearance.tattoos === tattoo.id && styles.selectedOptionItem
                  ]}
                  onPress={() => updateAppearance('tattoos', tattoo.id)}
                >
                  <Text style={[
                    styles.optionName,
                    currentAppearance.tattoos === tattoo.id && styles.selectedOptionText
                  ]}>
                    {tattoo.name}
                  </Text>
                  <Text style={styles.optionDescription}>{tattoo.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'stats':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Physical Stats</Text>

            <View style={styles.statInput}>
              <Text style={styles.statLabel}>Height (cm)</Text>
              <TextInput
                style={styles.statTextInput}
                value={currentAppearance.height?.toString() || ''}
                onChangeText={(text) => updateAppearance('height', parseInt(text) || 180)}
                keyboardType="numeric"
                placeholder="180"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.statInput}>
              <Text style={styles.statLabel}>Age</Text>
              <TextInput
                style={styles.statTextInput}
                value={currentAppearance.age?.toString() || ''}
                onChangeText={(text) => updateAppearance('age', parseInt(text) || 25)}
                keyboardType="numeric"
                placeholder="25"
                placeholderTextColor="#666"
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const saveCustomization = () => {
    // In a real game, this would save the appearance
    toast.success('Character appearance saved!');
  };

  const resetToDefault = () => {
    setCurrentAppearance(CURRENT_APPEARANCE);
    toast.success('Appearance reset to default');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Mystical%20mirror%20chamber%20with%20floating%20appearance%20options%20and%20glowing%20runes&aspect=9:16&seed=customization' }}
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
          <Text style={styles.headerTitle}>CHARACTER CUSTOMIZATION</Text>
          <TouchableOpacity style={styles.previewButton} onPress={() => setShowPreview(true)}>
            <Ionicons name="eye" size={24} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.nameInput}>
          <Text style={styles.nameLabel}>Character Name</Text>
          <TextInput
            style={styles.nameTextInput}
            value={characterName}
            onChangeText={setCharacterName}
            placeholder="Enter character name"
            placeholderTextColor="#666"
            maxLength={20}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <ScrollView style={styles.customizationContainer}>
          {renderCustomizationOptions()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={resetToDefault}>
            <Ionicons name="refresh" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveCustomization}>
            <Ionicons name="save" size={20} color="#000" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="share" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Character Preview</Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.previewContent}>
              <View style={styles.characterPreview}>
                <FontAwesome5 name="user-circle" size={120} color="#D4AF37" />
                <Text style={styles.previewName}>{characterName}</Text>
              </View>

              <View style={styles.previewStats}>
                <Text style={styles.previewStat}>
                  Hair: {APPEARANCE_OPTIONS.hairStyles.find(h => h.id === currentAppearance.hairStyle)?.name} ({APPEARANCE_OPTIONS.hairColors.find(c => c.id === currentAppearance.hairColor)?.name})
                </Text>
                <Text style={styles.previewStat}>
                  Eyes: {APPEARANCE_OPTIONS.eyeColors.find(c => c.id === currentAppearance.eyeColor)?.name}
                </Text>
                <Text style={styles.previewStat}>
                  Skin: {APPEARANCE_OPTIONS.skinTones.find(t => t.id === currentAppearance.skinTone)?.name}
                </Text>
                <Text style={styles.previewStat}>
                  Body: {APPEARANCE_OPTIONS.bodyTypes.find(t => t.id === currentAppearance.bodyType)?.name}
                </Text>
                <Text style={styles.previewStat}>
                  Face: {APPEARANCE_OPTIONS.facialFeatures.find(f => f.id === currentAppearance.facialFeatures)?.name}
                </Text>
                {currentAppearance.scars !== 'none' && (
                  <Text style={styles.previewStat}>
                    Scars: {APPEARANCE_OPTIONS.scars.find(s => s.id === currentAppearance.scars)?.name}
                  </Text>
                )}
                {currentAppearance.tattoos !== 'none' && (
                  <Text style={styles.previewStat}>
                    Tattoos: {APPEARANCE_OPTIONS.tattoos.find(t => t.id === currentAppearance.tattoos)?.name}
                  </Text>
                )}
                <Text style={styles.previewStat}>
                  Height: {currentAppearance.height}cm • Age: {currentAppearance.age}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  previewButton: {
    padding: 8,
  },
  nameInput: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  nameLabel: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  nameTextInput: {
    color: '#D4AF37',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    minWidth: 80,
  },
  selectedCategoryItem: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedCategoryIcon: {
    backgroundColor: '#000',
  },
  categoryName: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: '#000',
  },
  customizationContainer: {
    flex: 1,
  },
  optionsContainer: {
    paddingBottom: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 12,
    marginTop: 16,
  },
  subOptionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
    marginTop: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionItem: {
    width: '48%',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedOptionItem: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  optionName: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#000',
  },
  optionDescription: {
    color: '#A89968',
    fontSize: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorItem: {
    borderColor: '#D4AF37',
    borderWidth: 3,
  },
  statInput: {
    marginBottom: 16,
  },
  statLabel: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 8,
  },
  statTextInput: {
    color: '#D4AF37',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 10,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  previewContent: {
    alignItems: 'center',
  },
  characterPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewName: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  previewStats: {
    width: '100%',
  },
  previewStat: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 4,
  },
});