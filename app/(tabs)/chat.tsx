import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Lock, Camera, Smile, Paperclip, Search } from 'lucide-react-native';

// Mock data for chat groups
interface ChatGroup {
  id: string;
  name: string;
  unread: number;
  isOfficial: boolean;
}

const CHAT_GROUPS: ChatGroup[] = [
  { id: '1', name: 'Sector Amanecer', unread: 3, isOfficial: true },
  { id: '2', name: 'Calle Manuel Montt', unread: 0, isOfficial: false },
  { id: '3', name: 'Coordinación Seguridad', unread: 1, isOfficial: true },
];

// Mock messages for the active chat
type MessageRole = 'vecino' | 'seguridad' | 'carabinero';
interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  role: MessageRole;
}

const MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Juan Pérez',
    text:
      'Hola vecinos, quería consultar si alguien más vio un auto sospechoso por la calle principal hacia las 14:00 hrs.',
    timestamp: '14:35',
    isUser: false,
    role: 'vecino',
  },
  {
    id: '2',
    sender: 'María Silva',
    text: 'Sí, yo también lo vi. Era un sedán gris con vidrios polarizados.',
    timestamp: '14:38',
    isUser: false,
    role: 'vecino',
  },
  {
    id: '3',
    sender: 'Carlos Seguridad',
    text: 'Gracias por reportar. Ya enviamos una patrulla a revisar el sector.',
    timestamp: '14:42',
    isUser: false,
    role: 'seguridad',
  },
  {
    id: '4',
    sender: 'Tú',
    text: 'El vehículo también pasó por mi casa hace unos 10 minutos.',
    timestamp: '14:45',
    isUser: true,
    role: 'vecino',
  },
  {
    id: '5',
    sender: 'Ana Morales',
    text:
      'Confirmo que la patrulla ya está en el sector realizando un recorrido preventivo.',
    timestamp: '14:48',
    isUser: false,
    role: 'carabinero',
  },
];

export default function ChatScreen() {
  const [activeChat, setActiveChat] = useState<ChatGroup>(CHAT_GROUPS[0]);
  const [message, setMessage] = useState('');
  const [showGroups, setShowGroups] = useState(true);

  const getRoleColor = (role: MessageRole) => {
    switch (role) {
      case 'seguridad':
        return '#0A3161';
      case 'carabinero':
        return '#006400';
      default:
        return '#1E293B';
    }
  };

  const renderChatGroup = ({ item }: { item: ChatGroup }) => (
    <TouchableOpacity
      style={[
        styles.chatGroupItem,
        activeChat.id === item.id && styles.activeChatGroupItem,
      ]}
      onPress={() => {
        setActiveChat(item);
        setShowGroups(false);
      }}
    >
      <View style={styles.chatGroupContent}>
        <View style={styles.chatGroupHeader}>
          <Text style={styles.chatGroupName}>{item.name}</Text>
          {item.isOfficial && (
            <View style={styles.officialBadge}>
              <Lock size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.otherMessageContainer,
    ]}>
      {!item.isUser && (
        <Text style={[
          styles.messageSender,
          { color: getRoleColor(item.role) },
        ]}>
          {item.sender} {item.role !== 'vecino' && `(${item.role.charAt(0).toUpperCase() + item.role.slice(1)})`}
        </Text>
      )}
      <View style={[
        styles.messageContent,
        item.isUser ? styles.userMessageContent : styles.otherMessageContent,
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      // Here we would send the message to the server
      // For now, just clear the input
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {!showGroups && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowGroups(true)}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {showGroups ? 'Chats Vecinales' : activeChat.name}
          </Text>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#0A3161" />
          </TouchableOpacity>
        </View>

        {showGroups ? (
          <FlatList
            data={CHAT_GROUPS}
            renderItem={renderChatGroup}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatGroupsList}
          />
        ) : (
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <FlatList
              data={MESSAGES}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              inverted={false}
            />

            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="#64748B" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity style={styles.emojiButton}>
                <Smile size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  message.trim().length === 0 && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={message.trim().length === 0}
              >
                <Send size={20} color={message.trim().length === 0 ? '#94A3B8' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#0A3161',
  },
  searchButton: {
    padding: 8,
  },
  chatGroupsList: {
    padding: 16,
  },
  chatGroupItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeChatGroupItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#0A3161',
  },
  chatGroupContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatGroupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  officialBadge: {
    backgroundColor: '#0A3161',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  unreadBadge: {
    backgroundColor: '#E63946',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
  },
  userMessageContent: {
    backgroundColor: '#0A3161',
    borderBottomRightRadius: 4,
  },
  otherMessageContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#94A3B8',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  attachButton: {
    marginRight: 8,
  },
  cameraButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  emojiButton: {
    marginLeft: 8,
  },
  sendButton: {
    backgroundColor: '#0A3161',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
});