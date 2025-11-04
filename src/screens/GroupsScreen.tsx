import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Alert,
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ChatService, ChatMessage } from '../services/chat';

interface GroupMember {
  id: string;
  name: string;
  icon: string;
}

const GROUP_MEMBERS: GroupMember[] = [
  { id: 'mina', name: 'Mina', icon: '🐱' },
  { id: 'anne', name: 'Anne', icon: '🐶' },
  { id: 'jonas', name: 'Jonas', icon: '🦊' },
  { id: 'markus', name: 'Markus', icon: '🐻' },
];

const GruppeprosjektScreen: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const { user, userProfile } = useAuth();
  const styles = useMemo(() => makeStyles(themeColors), [themeColors]);
  
  // Chat state
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([]); // For multiple selection
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Task state
  const [checked, setChecked] = useState([true, false, false, false]);
  
  // Refs for scrolling
  const flatListRef = useRef<FlatList>(null);

  // Handle member selection (toggle for multiple selection)
  const handleMemberToggle = (member: GroupMember) => {
    setSelectedMembers(prev => {
      const isAlreadySelected = prev.some(m => m.id === member.id);
      if (isAlreadySelected) {
        // Remove from selection
        return prev.filter(m => m.id !== member.id);
      } else {
        // Add to selection
        return [...prev, member];
      }
    });
    
    // Clear single member selection when using multiple
    setSelectedMember(null);
  };

  // Generate chat ID based on selected members
  const generateChatId = (userUid: string): string => {
    if (selectedMembers.length === 0) {
      return 'group_main'; // Main group chat
    } else if (selectedMembers.length === 1) {
      return `private_${[userUid, selectedMembers[0].id].sort().join('_')}`;
    } else {
      // Multiple members - create group chat ID
      const allIds = [userUid, ...selectedMembers.map(m => m.id)].sort();
      return `group_${allIds.join('_')}`;
    }
  };

  // Get chat title based on selection
  const getChatTitle = (): string => {
    if (selectedMembers.length === 0) {
      return 'Gruppe-chat (alle)';
    } else if (selectedMembers.length === 1) {
      return `Chat med ${selectedMembers[0].name}`;
    } else {
      return `Gruppesamtale med ${selectedMembers.map(m => m.name).join(', ')}`;
    }
  };

  // Load messages when chat changes
  useEffect(() => {
    if (!user) return;
    
    const groupId = generateChatId(user.uid);
    
    console.log('🎯 Setting up chat for groupId:', groupId);
    console.log('👥 Selected members:', selectedMembers.map(m => m.name));
    setLoading(true);
    
    // Set up real-time listener for automatic updates
    const unsubscribe = ChatService.subscribeToChat(groupId, (chatMessages: ChatMessage[]) => {
      console.log('📱 Received messages in UI:', chatMessages.length);
      setMessages(chatMessages);
      setLoading(false);
      
      // Force re-render and scroll to bottom
      setTimeout(() => {
        if (flatListRef.current && chatMessages.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 200); // Longer timeout for mobile
    });

    // Cleanup listener when component unmounts or chat changes
    return () => {
      console.log('🧹 Cleaning up chat listener for:', groupId);
      unsubscribe();
    };
  }, [selectedMembers, user?.uid]); // Watch selectedMembers instead of selectedMember

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !userProfile) return;

    const groupId = generateChatId(user.uid);
    const trimmedMessage = messageText.trim();
    
    console.log('💬 Sending message to groupId:', groupId, 'text:', trimmedMessage);
    console.log('👥 Chat participants:', selectedMembers.map(m => m.name));
    
    // Clear input immediately for better UX
    setMessageText('');
    // Don't reset isTyping here - let onBlur handle when keyboard closes

    try {
      const messageId = await ChatService.sendMessage(groupId, {
        text: trimmedMessage,
        senderId: user.uid,
        senderName: userProfile.fullName || userProfile.username || 'Ukjent bruker',
        timestamp: new Date(),
      });
      
      console.log('✅ Message sent successfully with ID:', messageId);

      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Restore message text on error
      setMessageText(trimmedMessage);
      Alert.alert('Feil', 'Kunne ikke sende melding. Prøv igjen.');
    }
  };

  const handleCheck = (idx: number) => {
    setChecked((prev: boolean[]) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = item.senderId === user?.uid;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble
        ]}>
          {!isOwnMessage && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={styles.messageTime}>
            {item.timestamp.toLocaleTimeString('no-NO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  const chatTitle = getChatTitle();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20} // Adjusted offsets
        enabled={true}
      >
        <Text style={styles.title}>Gruppeprosjekt</Text>
        
        {/* Chat title */}
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>{chatTitle}</Text>
        </View>

        {/* Group members - always visible with multiple selection */}
        <View style={styles.avatarsRow}>
          {GROUP_MEMBERS.map((member) => {
            const isSelected = selectedMembers.some(m => m.id === member.id);
            return (
              <TouchableOpacity 
                key={member.id}
                style={[
                  styles.avatarCol,
                  isSelected && styles.avatarSelected
                ]}
                onPress={() => handleMemberToggle(member)}
              >
                <View style={[
                  styles.avatarCircle,
                  isSelected && styles.avatarCircleSelected
                ]}>
                  <Text style={styles.avatarIcon}>{member.icon}</Text>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.avatarName,
                  isSelected && styles.avatarNameSelected
                ]}>
                  {member.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clear selection button when members are selected */}
        {selectedMembers.length > 0 && (
          <View style={styles.selectionControls}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSelectedMembers([])}
            >
              <Text style={styles.clearButtonText}>
                Tilbake til hovedgruppe ({selectedMembers.length} valgt)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Chat messages */}
        <View style={styles.chatContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Laster meldinger...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Ingen meldinger ennå. Skriv den første!</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item: ChatMessage) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => {
                if (flatListRef.current && messages.length > 0) {
                  flatListRef.current.scrollToEnd({ animated: true });
                }
              }}
            />
          )}
        </View>

        {/* Message input - moved before task list */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Skriv melding..."
            placeholderTextColor="#999999" // Grå placeholder som er synlig
            value={messageText}
            onChangeText={(text) => {
              setMessageText(text);
              // Don't change isTyping based on text length - only on focus/blur
            }}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)} // Only reset when input loses focus (keyboard closes)
            multiline
            maxLength={500}
            selectionColor="#FFD700" // Gul cursor som er synlig
            autoCorrect={true}
            autoCapitalize="sentences"
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={messageText.trim() ? '#fff' : themeColors.muted} 
            />
          </TouchableOpacity>
        </View>

        {/* Task checklist - only show in main chat and when not typing */}
        {!selectedMember && !isTyping && (
          <View style={styles.checklistWrap}>
            <Text style={styles.checklistTitle}>Oppgaver:</Text>
            <TouchableOpacity style={styles.checkRow} onPress={() => handleCheck(0)}>
              <View style={[styles.checkbox, checked[0] && styles.checkboxChecked]} />
              <Text style={styles.checkText}>Lage ER-diagram</Text>
              <Text style={styles.checkOwner}>Mina</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkRow} onPress={() => handleCheck(1)}>
              <View style={[styles.checkbox, checked[1] && styles.checkboxChecked]} />
              <Text style={styles.checkText}>Implementere innlogging</Text>
              <Text style={styles.checkOwner}>Jonas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkRow} onPress={() => handleCheck(2)}>
              <View style={[styles.checkbox, checked[2] && styles.checkboxChecked]} />
              <Text style={styles.checkText}>Dokumentasjon</Text>
              <Text style={styles.checkOwner}>Markus</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};  export default GruppeprosjektScreen;

const makeStyles = (theme: any) =>
  StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: theme.background 
    },
    container: { 
      flex: 1, 
      backgroundColor: theme.background,
      // Remove paddingBottom - use normal layout
    },
    title: { 
      fontSize: 28, 
      fontWeight: '700', 
      marginBottom: 16, 
      color: theme.text,
      paddingHorizontal: 20,
      paddingTop: 10
    },
    
    // Chat header
    chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      marginRight: 12,
      padding: 4,
    },
    chatTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      flex: 1,
    },
    groupButton: {
      backgroundColor: theme.accent,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    groupButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    
    // Avatars
    avatarsRow: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginBottom: 16,
      paddingHorizontal: 20
    },
    avatarCol: { 
      alignItems: 'center', 
      flex: 1 
    },
    avatarSelected: {
      transform: [{ scale: 1.1 }],
    },
    avatarCircle: { 
      width: 56, 
      height: 56, 
      borderRadius: 28, 
      backgroundColor: theme.card, 
      marginBottom: 6, 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: theme.border,
      position: 'relative',
    },
    avatarCircleSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent + '20',
    },
    selectedIndicator: {
      position: 'absolute',
      top: -5,
      right: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkmark: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    avatarIcon: { 
      fontSize: 32 
    },
    avatarName: { 
      fontSize: 14, 
      color: theme.text 
    },
    avatarNameSelected: {
      color: theme.accent,
      fontWeight: 'bold',
    },
    
    // Selection controls
    selectionControls: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: 'center',
    },
    clearButton: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    clearButtonText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '500',
    },
    
    // Loading and empty states
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      color: theme.muted,
      fontSize: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      color: theme.muted,
      fontSize: 16,
      textAlign: 'center',
    },
    
    // Chat container
    chatContainer: {
      flex: 1, // Back to full flex since input is now at bottom
      paddingHorizontal: 20,
      paddingBottom: 10,
      backgroundColor: theme.background,
      zIndex: 10, // Higher z-index for messages to appear above checklist
    },
    messagesList: {
      flex: 1,
      minHeight: 150, // Minimum height for messages
    },
    messagesContent: {
      paddingVertical: 10,
      paddingBottom: 40, // Extra bottom padding so last message is visible
      flexGrow: 1, // Allow content to grow
    },
    
    // Messages
    messageContainer: {
      marginBottom: 12,
    },
    ownMessage: {
      alignItems: 'flex-end',
    },
    otherMessage: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      borderRadius: 18,
      padding: 12,
    },
    ownBubble: {
      backgroundColor: theme.accent,
    },
    otherBubble: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    senderName: {
      fontSize: 12,
      color: theme.muted,
      marginBottom: 2,
      fontWeight: '600',
    },
    messageText: {
      fontSize: 16,
      lineHeight: 20,
    },
    ownMessageText: {
      color: '#fff',
    },
    otherMessageText: {
      color: theme.text,
    },
    messageTime: {
      fontSize: 11,
      marginTop: 4,
      opacity: 0.7,
    },
    
    // Input
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingBottom: 30, // More bottom padding for mobile keyboards
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
      minHeight: 80, // Increased minimum height
      maxHeight: 140, // Add maximum height
      // Remove absolute positioning - use normal flex layout
    },
    messageInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 24, // More rounded
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFFFFF', // White background for better contrast
      color: '#000000', // Black text for visibility
      maxHeight: 120, // Increased max height
      marginRight: 12,
      fontSize: 16, // Larger text
      lineHeight: 20,
    },
    sendButton: {
      width: 48, // Slightly bigger
      height: 48, // Slightly bigger
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end', // Align to bottom of container
    },
    sendButtonActive: {
      backgroundColor: theme.accent,
    },
    sendButtonInactive: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    
    // Checklist
    checklistWrap: { 
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20, // Back to normal padding
      borderTopWidth: 1,
      borderTopColor: theme.border,
      zIndex: 1, // Lower z-index so checklist appears behind messages
      backgroundColor: theme.background,
    },
    checklistTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    checkRow: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 12 
    },
    checkbox: { 
      width: 24, 
      height: 24, 
      borderRadius: 6, 
      borderWidth: 2, 
      borderColor: theme.border, 
      backgroundColor: theme.card, 
      marginRight: 12 
    },
    checkboxChecked: { 
      borderColor: theme.accent, 
      backgroundColor: theme.accent 
    },
    checkText: { 
      fontSize: 16, 
      color: theme.text, 
      flex: 1 
    },
    checkOwner: { 
      fontSize: 14, 
      color: theme.accent, 
      fontWeight: '700', 
      marginLeft: 8 
    },
  });