import React, { useState, useEffect } from 'react';
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

// Local type definitions for trading
interface InventoryItem {
  itemId: string;
  name: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'tool' | 'key';
}

interface TradeListing {
  id: string;
  sellerId: string;
  sellerName: string;
  item: {
    itemId: string;
    name: string;
    quantity: number;
    type: string;
  };
  price: {
    type: 'rune' | 'item';
    amount: number;
  };
  status: 'active' | 'sold' | 'cancelled';
  postedAt: Date;
  location: string;
}

interface TradeOffer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  offeredItems: InventoryItem[];
  offeredRunes: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample trade listings
const SAMPLE_LISTINGS: TradeListing[] = [
  {
    id: 'listing_001',
    sellerId: 'player_002',
    sellerName: 'EldenTrader',
    item: {
      itemId: 'mithril_sword',
      name: 'Mithril Sword',
      quantity: 1,
      type: 'weapon',
    },
    price: { type: 'rune', amount: 5000 },
    status: 'active',
    postedAt: new Date(Date.now() - 3600000), // 1 hour ago
    location: 'Roundtable Hold',
  },
  {
    id: 'listing_002',
    sellerId: 'player_003',
    sellerName: 'PotionMaster',
    item: {
      itemId: 'health_potion',
      name: 'Health Potion',
      quantity: 5,
      type: 'consumable',
    },
    price: { type: 'rune', amount: 200 },
    status: 'active',
    postedAt: new Date(Date.now() - 7200000), // 2 hours ago
    location: 'Church of Elleh',
  },
  {
    id: 'listing_003',
    sellerId: 'player_004',
    sellerName: 'ArmorSmith',
    item: {
      itemId: 'steel_armor',
      name: 'Steel Armor Set',
      quantity: 1,
      type: 'armor',
    },
    price: { type: 'rune', amount: 8000 },
    status: 'active',
    postedAt: new Date(Date.now() - 1800000), // 30 minutes ago
    location: 'Stormveil Castle',
  },
  {
    id: 'listing_004',
    sellerId: 'player_005',
    sellerName: 'MaterialTrader',
    item: {
      itemId: 'ancient_scroll',
      name: 'Ancient Scroll',
      quantity: 3,
      type: 'material',
    },
    price: { type: 'rune', amount: 1500 },
    status: 'sold',
    postedAt: new Date(Date.now() - 86400000), // 1 day ago
    location: 'Raya Lucaria Academy',
  },
];

// Sample player inventory for selling
const SAMPLE_INVENTORY: InventoryItem[] = [
  { itemId: 'iron_sword', name: 'Iron Sword', quantity: 1, type: 'weapon' },
  { itemId: 'health_potion', name: 'Health Potion', quantity: 3, type: 'consumable' },
  { itemId: 'red_herb', name: 'Red Herb', quantity: 7, type: 'material' },
  { itemId: 'mithril_ore', name: 'Mithril Ore', quantity: 2, type: 'material' },
  { itemId: 'leather_armor', name: 'Leather Armor', quantity: 1, type: 'armor' },
];

export default function ItemTradingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [listings, setListings] = useState<TradeListing[]>(SAMPLE_LISTINGS);
  const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [selectedListing, setSelectedListing] = useState<TradeListing | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showListingDetails, setShowListingDetails] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest' | 'price_low' | 'price_high'>('newest');
  const [playerRunes] = useState(15000);
  const [playerId] = useState('player_001');
  const [playerName] = useState('TarnishedHero');

  // Form state for creating listings
  const [listingItem, setListingItem] = useState<InventoryItem | null>(null);
  const [listingQuantity, setListingQuantity] = useState(1);
  const [listingPrice, setListingPrice] = useState(1000);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || listing.item.type === selectedType;
    const isActive = listing.status === 'active';
    return matchesSearch && matchesType && isActive;
  }).sort((a, b) => {
    switch (selectedSort) {
      case 'newest':
        return b.postedAt.getTime() - a.postedAt.getTime();
      case 'oldest':
        return a.postedAt.getTime() - b.postedAt.getTime();
      case 'price_low':
        return a.price.amount - b.price.amount;
      case 'price_high':
        return b.price.amount - a.price.amount;
      default:
        return 0;
    }
  });

  const myListings = listings.filter(listing => listing.sellerId === playerId);

  const purchaseItem = (listing: TradeListing) => {
    if (listing.price.amount > playerRunes) {
      toast.error('Not enough runes!');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Buy ${listing.item.name} for ${listing.price.amount} runes?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            // Remove runes from player
            // Add item to inventory
            // Mark listing as sold
            setListings(prev => prev.map(l =>
              l.id === listing.id ? { ...l, status: 'sold' } : l
            ));

            // Add item to inventory
            setInventory(prev => {
              const existingItem = prev.find(item => item.itemId === listing.item.itemId);
              if (existingItem) {
                return prev.map(item =>
                  item.itemId === listing.item.itemId
                    ? { ...item, quantity: item.quantity + listing.item.quantity }
                    : item
                );
              } else {
                return [...prev, { ...listing.item }];
              }
            });

            toast.success(`Purchased ${listing.item.name}!`);
            setShowListingDetails(false);
          }
        }
      ]
    );
  };

  const createListing = () => {
    if (!listingItem || listingQuantity <= 0 || listingPrice <= 0) {
      toast.error('Please fill in all fields!');
      return;
    }

    if (listingQuantity > listingItem.quantity) {
      toast.error('Not enough items in inventory!');
      return;
    }

    const newListing: TradeListing = {
      id: `listing_${Date.now()}`,
      sellerId: playerId,
      sellerName: playerName,
      item: {
        itemId: listingItem.itemId,
        name: listingItem.name,
        quantity: listingQuantity,
        type: listingItem.type,
      },
      price: { type: 'rune', amount: listingPrice },
      status: 'active',
      postedAt: new Date(),
      location: 'Roundtable Hold', // Current location
    };

    setListings(prev => [...prev, newListing]);

    // Remove items from inventory
    setInventory(prev => prev.map(item =>
      item.itemId === listingItem.itemId
        ? { ...item, quantity: item.quantity - listingQuantity }
        : item
    ).filter(item => item.quantity > 0));

    // Reset form
    setListingItem(null);
    setListingQuantity(1);
    setListingPrice(1000);
    setShowCreateListing(false);

    toast.success('Listing created successfully!');
  };

  const cancelListing = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    Alert.alert(
      'Cancel Listing',
      'Return item to inventory?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            // Remove listing
            setListings(prev => prev.filter(l => l.id !== listingId));

            // Return item to inventory
            setInventory(prev => {
              const existingItem = prev.find(item => item.itemId === listing.item.itemId);
              if (existingItem) {
                return prev.map(item =>
                  item.itemId === listing.item.itemId
                    ? { ...item, quantity: item.quantity + listing.item.quantity }
                    : item
                );
              } else {
                return [...prev, { ...listing.item }];
              }
            });

            toast.success('Listing cancelled, item returned to inventory');
          }
        }
      ]
    );
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'weapon': return 'sword';
      case 'armor': return 'shield';
      case 'consumable': return 'potion';
      case 'material': return 'cube';
      case 'tool': return 'hammer';
      default: return 'question';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const renderListingItem = ({ item }: { item: TradeListing }) => {
    const isMyListing = item.sellerId === playerId;

    return (
      <TouchableOpacity
        style={[styles.listingItem, isMyListing && styles.myListing]}
        onPress={() => {
          setSelectedListing(item);
          setShowListingDetails(true);
        }}
      >
        <View style={styles.listingHeader}>
          <View style={styles.itemIcon}>
            <FontAwesome5 name={getItemIcon(item.item.type)} size={20} color="#D4AF37" />
          </View>
          <View style={styles.listingInfo}>
            <Text style={styles.itemName}>{item.item.name}</Text>
            <Text style={styles.sellerName}>by {item.sellerName}</Text>
          </View>
          <View style={styles.listingPrice}>
            <Text style={styles.priceAmount}>{item.price.amount.toLocaleString()}</Text>
            <Text style={styles.priceType}>runes</Text>
          </View>
        </View>

        <View style={styles.listingDetails}>
          <Text style={styles.itemQuantity}>Qty: {item.item.quantity}</Text>
          <Text style={styles.itemType}>{item.item.type.toUpperCase()}</Text>
          <Text style={styles.postedTime}>{getTimeAgo(item.postedAt)}</Text>
        </View>

        <View style={styles.listingLocation}>
          <Ionicons name="location" size={14} color="#A89968" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        {isMyListing && (
          <View style={styles.myListingBadge}>
            <Text style={styles.myListingText}>Your Listing</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderListingDetailsModal = () => {
    if (!selectedListing) return null;

    const isMyListing = selectedListing.sellerId === playerId;
    const canAfford = selectedListing.price.amount <= playerRunes;

    return (
      <Modal
        visible={showListingDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowListingDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.listingDetailsContainer}>
            <View style={styles.listingDetailsHeader}>
              <Text style={styles.listingDetailsTitle}>Trade Listing</Text>
              <TouchableOpacity onPress={() => setShowListingDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.listingDetailsContent}>
              <View style={styles.listingDetailHeader}>
                <View style={styles.detailItemIcon}>
                  <FontAwesome5 name={getItemIcon(selectedListing.item.type)} size={48} color="#D4AF37" />
                </View>
                <View style={styles.detailListingInfo}>
                  <Text style={styles.detailItemName}>{selectedListing.item.name}</Text>
                  <Text style={styles.detailSellerName}>Sold by {selectedListing.sellerName}</Text>
                  <Text style={styles.detailItemType}>{selectedListing.item.type.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.listingStats}>
                <View style={styles.statItem}>
                  <Ionicons name="cube" size={16} color="#A89968" />
                  <Text style={styles.statText}>Quantity: {selectedListing.item.quantity}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={16} color="#A89968" />
                  <Text style={styles.statText}>Posted: {getTimeAgo(selectedListing.postedAt)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={16} color="#A89968" />
                  <Text style={styles.statText}>Location: {selectedListing.location}</Text>
                </View>
              </View>

              <View style={styles.priceSection}>
                <Text style={styles.priceSectionTitle}>Price</Text>
                <View style={styles.priceDisplay}>
                  <Text style={styles.priceDisplayAmount}>
                    {selectedListing.price.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.priceDisplayType}>runes</Text>
                </View>
              </View>

              <View style={styles.listingActions}>
                {isMyListing ? (
                  <TouchableOpacity
                    style={styles.cancelListingButton}
                    onPress={() => {
                      cancelListing(selectedListing.id);
                      setShowListingDetails(false);
                    }}
                  >
                    <Text style={styles.cancelListingButtonText}>Cancel Listing</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.purchaseButton, !canAfford && styles.cannotAffordButton]}
                    onPress={() => purchaseItem(selectedListing)}
                    disabled={!canAfford}
                  >
                    <Text style={[styles.purchaseButtonText, !canAfford && styles.cannotAffordText]}>
                      {canAfford ? 'Purchase Item' : 'Cannot Afford'}
                    </Text>
                  </TouchableOpacity>
                )}

                {!isMyListing && (
                  <View style={styles.playerRunes}>
                    <Text style={styles.playerRunesText}>
                      Your Runes: {playerRunes.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCreateListingModal = () => {
    const availableItems = inventory.filter(item => item.quantity > 0);

    return (
      <Modal
        visible={showCreateListing}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateListing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createListingContainer}>
            <View style={styles.createListingHeader}>
              <Text style={styles.createListingTitle}>Create Trade Listing</Text>
              <TouchableOpacity onPress={() => setShowCreateListing(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createListingContent}>
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Select Item</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemSelector}>
                  {availableItems.map((item) => (
                    <TouchableOpacity
                      key={item.itemId}
                      style={[styles.itemOption, listingItem?.itemId === item.itemId && styles.selectedItemOption]}
                      onPress={() => {
                        setListingItem(item);
                        setListingQuantity(1);
                      }}
                    >
                      <View style={styles.itemOptionIcon}>
                        <FontAwesome5 name={getItemIcon(item.type)} size={20} color="#D4AF37" />
                      </View>
                      <Text style={styles.itemOptionName}>{item.name}</Text>
                      <Text style={styles.itemOptionQuantity}>x{item.quantity}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {listingItem && (
                <>
                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Quantity (Max: {listingItem.quantity})</Text>
                    <View style={styles.quantitySelector}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setListingQuantity(Math.max(1, listingQuantity - 1))}
                      >
                        <Ionicons name="remove" size={20} color="#D4AF37" />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.quantityInput}
                        value={listingQuantity.toString()}
                        onChangeText={(text) => {
                          const num = parseInt(text) || 1;
                          setListingQuantity(Math.min(listingItem.quantity, Math.max(1, num)));
                        }}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setListingQuantity(Math.min(listingItem.quantity, listingQuantity + 1))}
                      >
                        <Ionicons name="add" size={20} color="#D4AF37" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Price (Runes)</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={listingPrice.toString()}
                      onChangeText={(text) => setListingPrice(parseInt(text) || 0)}
                      keyboardType="numeric"
                      placeholder="Enter price in runes"
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View style={styles.listingPreview}>
                    <Text style={styles.previewTitle}>Listing Preview</Text>
                    <View style={styles.previewItem}>
                      <View style={styles.previewIcon}>
                        <FontAwesome5 name={getItemIcon(listingItem.type)} size={24} color="#D4AF37" />
                      </View>
                      <View style={styles.previewInfo}>
                        <Text style={styles.previewName}>{listingItem.name}</Text>
                        <Text style={styles.previewDetails}>
                          Quantity: {listingQuantity} | Price: {listingPrice.toLocaleString()} runes
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}

              <View style={styles.createActions}>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={createListing}
                  disabled={!listingItem || listingQuantity <= 0 || listingPrice <= 0}
                >
                  <Text style={styles.createButtonText}>Create Listing</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMyListingsModal = () => {
    return (
      <Modal
        visible={showMyListings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMyListings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.myListingsContainer}>
            <View style={styles.myListingsHeader}>
              <Text style={styles.myListingsTitle}>My Listings ({myListings.length})</Text>
              <TouchableOpacity onPress={() => setShowMyListings(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={myListings}
              renderItem={({ item }) => (
                <View style={styles.myListingItem}>
                  <View style={styles.myListingIcon}>
                    <FontAwesome5 name={getItemIcon(item.item.type)} size={20} color="#D4AF37" />
                  </View>
                  <View style={styles.myListingInfo}>
                    <Text style={styles.myListingName}>{item.item.name}</Text>
                    <Text style={styles.myListingDetails}>
                      Qty: {item.item.quantity} | Price: {item.price.amount.toLocaleString()} runes
                    </Text>
                    <Text style={styles.myListingStatus}>
                      Status: {item.status} | Posted: {getTimeAgo(item.postedAt)}
                    </Text>
                  </View>
                  {item.status === 'active' && (
                    <TouchableOpacity
                      style={styles.cancelMyListingButton}
                      onPress={() => cancelListing(item.id)}
                    >
                      <Text style={styles.cancelMyListingText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <View style={styles.emptyMyListings}>
                  <FontAwesome5 name="store" size={48} color="#666" />
                  <Text style={styles.emptyMyListingsText}>No active listings</Text>
                  <TouchableOpacity
                    style={styles.createFirstListingButton}
                    onPress={() => {
                      setShowMyListings(false);
                      setShowCreateListing(true);
                    }}
                  >
                    <Text style={styles.createFirstListingText}>Create Your First Listing</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=Mystical%20trading%20post%20with%20merchants%20and%20golden%20coins&aspect=9:16&seed=trading' }}
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
          <Text style={styles.headerTitle}>TRADING POST</Text>
          <View style={styles.headerStats}>
            <Text style={styles.playerRunes}>{playerRunes.toLocaleString()}</Text>
            <Text style={styles.runesLabel}>runes</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#A89968" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search listings..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.filters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilter}>
            {['all', 'weapon', 'armor', 'consumable', 'material', 'tool'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.filterButton, selectedType === type && styles.selectedFilter]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.filterText, selectedType === type && styles.selectedFilterText]}>
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortFilter}>
            {[
              { key: 'newest', label: 'Newest' },
              { key: 'oldest', label: 'Oldest' },
              { key: 'price_low', label: 'Price: Low' },
              { key: 'price_high', label: 'Price: High' },
            ].map((sort) => (
              <TouchableOpacity
                key={sort.key}
                style={[styles.filterButton, selectedSort === sort.key && styles.selectedFilter]}
                onPress={() => setSelectedSort(sort.key as any)}
              >
                <Text style={[styles.filterText, selectedSort === sort.key && styles.selectedFilterText]}>
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listingsContainer}>
          <Text style={styles.sectionTitle}>Market Listings ({filteredListings.length})</Text>
          <FlatList
            data={filteredListings}
            renderItem={renderListingItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listingsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="store" size={48} color="#666" />
                <Text style={styles.emptyText}>No listings found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setShowCreateListing(true)}
          >
            <Ionicons name="add-circle" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Sell Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setShowMyListings(true)}
          >
            <Ionicons name="storefront" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>My Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="settings" size={20} color="#A89968" />
            <Text style={styles.footerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderListingDetailsModal()}
      {renderCreateListingModal()}
      {renderMyListingsModal()}
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
  headerStats: {
    alignItems: 'center',
  },
  playerRunes: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  runesLabel: {
    color: '#A89968',
    fontSize: 12,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  searchInput: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 16,
    marginLeft: 8,
  },
  filters: {
    marginBottom: 16,
  },
  typeFilter: {
    marginBottom: 8,
  },
  sortFilter: {
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedFilter: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filterText: {
    color: '#A89968',
    fontSize: 12,
  },
  selectedFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  listingsContainer: {
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
  listingsList: {
    paddingBottom: 20,
  },
  listingItem: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  myListing: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  listingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  listingInfo: {
    flex: 1,
  },
  itemName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  sellerName: {
    color: '#A89968',
    fontSize: 12,
  },
  listingPrice: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceType: {
    color: '#A89968',
    fontSize: 12,
  },
  listingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQuantity: {
    color: '#A89968',
    fontSize: 12,
  },
  itemType: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  postedTime: {
    color: '#666',
    fontSize: 12,
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#A89968',
    fontSize: 12,
    marginLeft: 4,
  },
  myListingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 4,
    padding: 4,
  },
  myListingText: {
    color: '#D4AF37',
    fontSize: 10,
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
  listingDetailsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  listingDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  listingDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  listingDetailsContent: {
    flex: 1,
  },
  listingDetailHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#3A3A3A',
  },
  detailListingInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailSellerName: {
    color: '#A89968',
    fontSize: 14,
    marginBottom: 2,
  },
  detailItemType: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  listingStats: {
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  priceSection: {
    marginBottom: 16,
  },
  priceSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
  },
  priceDisplayAmount: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceDisplayType: {
    color: '#A89968',
    fontSize: 14,
    marginLeft: 8,
  },
  listingActions: {
    marginTop: 20,
  },
  purchaseButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  purchaseButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cannotAffordButton: {
    backgroundColor: '#FF6347',
  },
  cannotAffordText: {
    color: '#000',
  },
  cancelListingButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  cancelListingButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerRunes: {
    alignItems: 'center',
    padding: 8,
  },
  playerRunesText: {
    color: '#FFD700',
    fontSize: 14,
  },
  createListingContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  createListingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  createListingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  createListingContent: {
    flex: 1,
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemSelector: {
    marginBottom: 8,
  },
  itemOption: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  selectedItemOption: {
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  itemOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: '#3A3A3A',
  },
  itemOptionName: {
    color: '#A89968',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  itemOptionQuantity: {
    color: '#FFD700',
    fontSize: 10,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
  },
  quantityInput: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    marginHorizontal: 8,
    padding: 4,
  },
  priceInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    color: '#D4AF37',
    fontSize: 16,
  },
  listingPreview: {
    marginBottom: 16,
  },
  previewTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewDetails: {
    color: '#A89968',
    fontSize: 12,
  },
  createActions: {
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  myListingsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  myListingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 8,
  },
  myListingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  myListingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  myListingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#3A3A3A',
  },
  myListingInfo: {
    flex: 1,
  },
  myListingName: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  myListingDetails: {
    color: '#A89968',
    fontSize: 12,
    marginBottom: 2,
  },
  myListingStatus: {
    color: '#666',
    fontSize: 10,
  },
  cancelMyListingButton: {
    backgroundColor: '#FF6347',
    borderRadius: 4,
    padding: 6,
  },
  cancelMyListingText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyMyListings: {
    alignItems: 'center',
    padding: 40,
  },
  emptyMyListingsText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  createFirstListingButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 12,
  },
  createFirstListingText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});