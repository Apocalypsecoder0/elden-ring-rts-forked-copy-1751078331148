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

// Sample messages data
const MESSAGES = [
  {
    id: 'msg-1',
    sender: 'EldenLord',
    senderLevel: 120,
    message: 'Great duel yesterday! Your swordsmanship is impressive.',
    timestamp: '2 hours ago',
    type: 'direct',
    unread: true,
    avatar: '👑'
  },
  {
    id: 'msg-2',
    sender: 'MoonlightAssassin',
    senderLevel: 115,
    message: 'Thanks for the cooperative session. The boss was tough!',
    timestamp: '5 hours ago',
    type: 'party',
    unread: false,
    avatar: '🌙'
  },
  {
    id: 'msg-3',
    sender: 'FireGiant',
    senderLevel: 118,
    message: 'Looking for players to siege Redmane Castle. Join my party!',
    timestamp: '1 day ago',
    type: 'guild',
    unread: true,
    avatar: '🔥'
  },
  {
    id: 'msg-4',
    sender: 'CrystalSage',
    senderLevel: 110,
    message: 'Your invasion strategy was brilliant. Well played!',
    timestamp: '2 days ago',
    type: 'direct',
    unread: false,
    avatar: '💎'
  },
  {
    id: 'msg-5',
    sender: 'ScarletHunter',
    senderLevel: 108,
    message: 'Party up for Liurnia exploration? Need help with the Academy.',
    timestamp: '3 days ago',
    type: 'party',
    unread: false,
    avatar: '🩸'
  }
];

const GUILD_MESSAGES = [
  {
    id: 'guild-1',
    sender: 'GuildMaster',
    message: 'Weekly guild meeting tonight at 8 PM EST. All members welcome!',
    timestamp: '1 hour ago',
    type: 'announcement',
    pinned: true
  },
  {
    id: 'guild-2',
    sender: 'RaidLeader',
    message: 'Organizing a full raid on Volcano Manor. Need tanks and DPS.',
    timestamp: '3 hours ago',
    type: 'recruitment'
  },
  {
    id: 'guild-3',
    sender: 'Treasurer',
    message: 'Guild bank has been updated with new equipment. Check it out!',
    timestamp: '6 hours ago',
    type: 'general'
  }
];

const SYSTEM_MESSAGES = [
  {
    id: 'sys-1',
    title: 'Achievement Unlocked!',
    message: 'Congratulations! You have unlocked the "Elden Champion" title.',
    timestamp: '30 minutes ago',
    type: 'achievement',
    unread: true
  },
  {
    id: 'sys-2',
    title: 'Event Started',
    message: 'The "Blood Moon" event has begun. Increased invasion activity detected.',
    timestamp: '2 hours ago',
    type: 'event',
    unread: false
  },
  {
    id: 'sys-3',
    title: 'Friend Request',
    message: 'MoonlightAssassin has sent you a friend request.',
    timestamp: '4 hours ago',
    type: 'friend_request',
    unread: true
  }
];

const MultiplayerMessages: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMessage, setSelectedMessage] = useState<typeof MESSAGES[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'guild' | 'system'>('direct');
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  const handleMessagePress = (message: typeof MESSAGES[0]) => {
    setSelectedMessage(message);
    setModalVisible(true);
    // Mark as read
    message.unread = false;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.success('Message sent!');
      setNewMessage('');
    }
  };

  const handleReply = () => {
    if (replyText.trim() && selectedMessage) {
      toast.success(`Reply sent to ${selectedMessage.sender}!`);
      setReplyText('');
      setModalVisible(false);
    }
  };

  const handleFriendRequest = (action: 'accept' | 'decline') => {
    if (action === 'accept') {
      toast.success('Friend request accepted!');
    } else {
      toast.warning('Friend request declined');
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'direct': return '#2196F3';
      case 'party': return '#4CAF50';
      case 'guild': return '#FF9800';
      case 'achievement': return '#FFD700';
      case 'event': return '#F44336';
      case 'friend_request': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'direct': return 'person';
      case 'party': return 'people';
      case 'guild': return 'shield';
      case 'achievement': return 'trophy';
      case 'event': return 'calendar';
      case 'friend_request': return 'person-add';
      default: return 'mail';
    }
  };

  const renderMessageItem = ({ item }: { item: typeof MESSAGES[0] }) => (
    <TouchableOpacity
      style={[styles.messageCard, item.unread && styles.unreadMessage]}
      onPress={() => handleMessagePress(item)}
    >
      <LinearGradient
        colors={item.unread ? ['rgba(255, 215, 0, 0.1)', 'rgba(26, 26, 46, 0.9)'] : ['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.messageGradient}
      >
        <View style={styles.messageHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
          <View style={styles.messageInfo}>
            <View style={styles.senderRow}>
              <Text style={styles.senderName}>{item.sender}</Text>
              <Text style={styles.senderLevel}>Lv.{item.senderLevel}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: getMessageTypeColor(item.type) }]}>
            <Ionicons name={getMessageTypeIcon(item.type)} size={12} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.messageText} numberOfLines={2}>
          {item.message}
        </Text>

        {item.unread && (
          <View style={styles.unreadIndicator}>
            <Ionicons name="ellipse" size={8} color="#FFD700" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderGuildMessageItem = ({ item }: { item: typeof GUILD_MESSAGES[0] }) => (
    <View style={[styles.guildMessageCard, item.pinned && styles.pinnedMessage]}>
      <LinearGradient
        colors={item.pinned ? ['rgba(255, 215, 0, 0.2)', 'rgba(26, 26, 46, 0.9)'] : ['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.guildMessageGradient}
      >
        {item.pinned && (
          <View style={styles.pinnedIndicator}>
            <Ionicons name="pin" size={14} color="#FFD700" />
            <Text style={styles.pinnedText}>PINNED</Text>
          </View>
        )}

        <View style={styles.guildMessageHeader}>
          <Text style={styles.guildSenderName}>{item.sender}</Text>
          <Text style={styles.guildTimestamp}>{item.timestamp}</Text>
        </View>

        <Text style={styles.guildMessageText}>
          {item.message}
        </Text>

        <View style={styles.guildMessageType}>
          <Text style={[styles.typeText, { color: getMessageTypeColor(item.type) }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderSystemMessageItem = ({ item }: { item: typeof SYSTEM_MESSAGES[0] }) => (
    <TouchableOpacity
      style={[styles.systemMessageCard, item.unread && styles.unreadSystemMessage]}
      onPress={() => {
        if (item.type === 'friend_request') {
          // Handle friend request actions
        }
      }}
    >
      <LinearGradient
        colors={item.unread ? ['rgba(156, 39, 176, 0.1)', 'rgba(26, 26, 46, 0.9)'] : ['rgba(26, 26, 46, 0.9)', 'rgba(22, 22, 38, 0.8)']}
        style={styles.systemMessageGradient}
      >
        <View style={styles.systemMessageHeader}>
          <View style={styles.systemIconContainer}>
            <Ionicons name={getMessageTypeIcon(item.type)} size={20} color={getMessageTypeColor(item.type)} />
          </View>
          <View style={styles.systemMessageInfo}>
            <Text style={styles.systemTitle}>{item.title}</Text>
            <Text style={styles.systemTimestamp}>{item.timestamp}</Text>
          </View>
          {item.unread && (
            <View style={styles.unreadIndicator}>
              <Ionicons name="ellipse" size={8} color="#9C27B0" />
            </View>
          )}
        </View>

        <Text style={styles.systemMessageText}>
          {item.message}
        </Text>

        {item.type === 'friend_request' && (
          <View style={styles.friendRequestActions}>
            <TouchableOpacity
              style={styles.acceptFriendButton}
              onPress={() => handleFriendRequest('accept')}
            >
              <Text style={styles.acceptFriendText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineFriendButton}
              onPress={() => handleFriendRequest('decline')}
            >
              <Text style={styles.declineFriendText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
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
          <Text style={styles.title}>MESSAGES</Text>
          <TouchableOpacity style={styles.composeButton}>
            <Ionicons name="create" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'direct' && styles.activeTab]}
            onPress={() => setActiveTab('direct')}
          >
            <Text style={[styles.tabText, activeTab === 'direct' && styles.activeTabText]}>
              Direct
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'guild' && styles.activeTab]}
            onPress={() => setActiveTab('guild')}
          >
            <Text style={[styles.tabText, activeTab === 'guild' && styles.activeTabText]}>
              Guild
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'system' && styles.activeTab]}
            onPress={() => setActiveTab('system')}
          >
            <Text style={[styles.tabText, activeTab === 'system' && styles.activeTabText]}>
              System
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'direct' && (
          <>
            <FlatList
              data={MESSAGES}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
            />

            {/* Compose Message */}
            <View style={styles.composeContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                placeholderTextColor="#CCCCCC"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === 'guild' && (
          <FlatList
            data={GUILD_MESSAGES}
            renderItem={renderGuildMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.guildMessagesList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === 'system' && (
          <FlatList
            data={SYSTEM_MESSAGES}
            renderItem={renderSystemMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.systemMessagesList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Message Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedMessage && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalSenderInfo}>
                      <Text style={styles.modalAvatar}>{selectedMessage.avatar}</Text>
                      <View>
                        <Text style={styles.modalSenderName}>{selectedMessage.sender}</Text>
                        <Text style={styles.modalSenderLevel}>Level {selectedMessage.senderLevel}</Text>
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
                    <View style={styles.messageDetailSection}>
                      <Text style={styles.messageTimestamp}>{selectedMessage.timestamp}</Text>
                      <Text style={styles.fullMessageText}>
                        {selectedMessage.message}
                      </Text>
                    </View>

                    <View style={styles.messageActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="heart" size={20} color="#F44336" />
                        <Text style={styles.actionText}>Like</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="flag" size={20} color="#FF9800" />
                        <Text style={styles.actionText}>Report</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="person-add" size={20} color="#4CAF50" />
                        <Text style={styles.actionText}>Add Friend</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>

                  <View style={styles.replyContainer}>
                    <TextInput
                      style={styles.replyInput}
                      placeholder="Type your reply..."
                      placeholderTextColor="#CCCCCC"
                      value={replyText}
                      onChangeText={setReplyText}
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.replyButton}
                      onPress={handleReply}
                    >
                      <Text style={styles.replyButtonText}>Reply</Text>
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
  composeButton: {
    padding: 10,
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
  messagesList: {
    padding: 20,
    paddingBottom: 120,
  },
  messageCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  unreadMessage: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  messageGradient: {
    padding: 15,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
  },
  messageInfo: {
    flex: 1,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  senderLevel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  composeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 10,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guildMessagesList: {
    padding: 20,
    paddingBottom: 100,
  },
  guildMessageCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  pinnedMessage: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  guildMessageGradient: {
    padding: 15,
  },
  pinnedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pinnedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 5,
  },
  guildMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  guildSenderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  guildTimestamp: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  guildMessageText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 10,
  },
  guildMessageType: {
    alignItems: 'flex-end',
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  systemMessagesList: {
    padding: 20,
    paddingBottom: 100,
  },
  systemMessageCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  unreadSystemMessage: {
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  systemMessageGradient: {
    padding: 15,
  },
  systemMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  systemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  systemMessageInfo: {
    flex: 1,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  systemTimestamp: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  systemMessageText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 15,
  },
  friendRequestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptFriendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  acceptFriendText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  declineFriendButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  declineFriendText: {
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
  modalSenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalAvatar: {
    fontSize: 30,
    marginRight: 15,
  },
  modalSenderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 2,
  },
  modalSenderLevel: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  messageDetailSection: {
    marginBottom: 20,
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  fullMessageText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 12,
    color: '#CCCCCC',
    marginLeft: 5,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 10,
    maxHeight: 80,
  },
  replyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default MultiplayerMessages;