import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';
import { sendSupportChatMessage, submitSupportTicket, SupportMessage } from '@/lib/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function SupportChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketOption, setShowTicketOption] = useState(false);
  const [ticketFlowActive, setTicketFlowActive] = useState(false);
  const [ticketStep, setTicketStep] = useState(1);
  const [ticketData, setTicketData] = useState({ summary: '', description: '' });

  const suggestions = [
    "My diagnosis failed",
    "How do I treat leaf blight?",
    "App is not working",
    "Talk to support"
  ];

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi 👋 I'm CropWatch AI. How can I help you today?",
        timestamp: Date.now(),
      }
    ]);
  }, []);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    const apiMessages: SupportMessage[] = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await sendSupportChatMessage(apiMessages);

    if (response.error) {
      Alert.alert("Connection Error", "I'm having trouble connecting. Please check your internet or create a ticket.");
      setShowTicketOption(true);
    } else {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // If AI mentions ticket or seems unable to help, show option
      if (response.content.toLowerCase().includes('ticket') || 
          response.content.toLowerCase().includes('sorry') ||
          response.content.length < 20) {
        setShowTicketOption(true);
      }
    }

    setIsLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const startTicketFlow = () => {
    setTicketFlowActive(true);
    setTicketStep(1);
    setShowTicketOption(false);
  };

  const handleTicketNext = async () => {
    if (ticketStep === 1) {
      if (!ticketData.summary.trim()) return;
      setTicketStep(2);
    } else if (ticketStep === 2) {
      if (!ticketData.description.trim()) return;
      setIsLoading(true);
      const res = await submitSupportTicket(ticketData);
      setIsLoading(false);
      
      if (res.success) {
        setTicketFlowActive(false);
        const ticketId = res.ticketId;
        
        // Add success message
        const successMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Great! I've created ticket ${ticketId} for you. Our team will look into it soon.`,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, successMsg]);

        // Trigger AI suggestions based on the ticket description
        setIsLoading(true);
        const aiResponse = await sendSupportChatMessage([
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: `I've just submitted a ticket about: ${ticketData.description}. Can you give me some quick suggestions on what to do while I wait?` }
        ]);
        setIsLoading(false);

        if (!aiResponse.error) {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse.content,
            timestamp: Date.now()
          }]);
        }
      } else {
        Alert.alert("Error", "Failed to submit ticket. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Support" 
        subtitle="Chat with CropWatch AI" 
        onBack={() => router.push('/settings')}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatList}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => (
            <View 
              key={item.id} 
              style={[
                styles.messageBubble, 
                item.role === 'user' ? styles.userBubble : styles.assistantBubble
              ]}
            >
              <Text style={[
                styles.messageText, 
                { color: item.role === 'user' ? '#fff' : tokens.colors.text }
              ]}>
                {item.content}
              </Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={tokens.colors.primary500} />
            </View>
          )}

          {showTicketOption && !ticketFlowActive && (
            <TouchableOpacity 
              style={styles.ticketOptionBtn}
              onPress={startTicketFlow}
            >
              <MaterialIcons name="confirmation-number" size={20} color={tokens.colors.primary500} />
              <Text style={styles.ticketOptionText}>Create Support Ticket</Text>
            </TouchableOpacity>
          )}

          {ticketFlowActive && (
            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>Submit Ticket (Step {ticketStep}/2)</Text>
                <TouchableOpacity onPress={() => setTicketFlowActive(false)}>
                  <MaterialIcons name="close" size={20} color={tokens.colors.neutral500} />
                </TouchableOpacity>
              </View>
              
              {ticketStep === 1 ? (
                <View>
                  <Text style={styles.label}>Issue Summary</Text>
                  <TextInput 
                    style={styles.ticketInput}
                    placeholder="Brief summary of the problem"
                    value={ticketData.summary}
                    onChangeText={(t) => setTicketData(prev => ({ ...prev, summary: t }))}
                  />
                </View>
              ) : (
                <View>
                  <Text style={styles.label}>Detailed Description</Text>
                  <TextInput 
                    style={[styles.ticketInput, styles.textArea]}
                    placeholder="Explain what happened..."
                    multiline
                    numberOfLines={4}
                    value={ticketData.description}
                    onChangeText={(t) => setTicketData(prev => ({ ...prev, description: t }))}
                  />
                </View>
              )}
              
              <TouchableOpacity 
                style={[styles.ticketBtn, { backgroundColor: tokens.colors.primary500 }]}
                onPress={handleTicketNext}
              >
                <Text style={styles.ticketBtnText}>{ticketStep === 1 ? 'Next' : 'Submit Ticket'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputWrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {!ticketFlowActive && messages.length < 5 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.suggestionsScroll}
              contentContainerStyle={styles.suggestionsContent}
            >
              {suggestions.map((s, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={styles.suggestionBadge}
                  onPress={() => handleSend(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachBtn}>
              <MaterialIcons name="add" size={24} color={tokens.colors.neutral500} />
            </TouchableOpacity>
            
            <TextInput 
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={tokens.colors.neutral500}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity 
              style={[
                styles.sendBtn, 
                { backgroundColor: inputText.trim() ? tokens.colors.primary500 : tokens.colors.neutral200 }
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
            >
              <MaterialIcons name="send" size={20} color={inputText.trim() ? '#fff' : tokens.colors.neutral500} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  flex: {
    flex: 1,
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.md,
    ...tokens.elevation.level1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: tokens.colors.primary500,
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.neutral98,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    ...tokens.typography.body,
    fontSize: 15,
  },
  loadingContainer: {
    padding: tokens.spacing.sm,
    alignItems: 'flex-start',
  },
  inputWrapper: {
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    paddingTop: tokens.spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  attachBtn: {
    height: 48,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: tokens.colors.neutral100,
    borderRadius: tokens.radius.xl,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    textAlignVertical: 'center',
    ...tokens.typography.body,
    fontSize: 15,
    color: tokens.colors.text,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsScroll: {
    marginBottom: tokens.spacing.sm,
  },
  suggestionsContent: {
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  suggestionBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.primary50,
    borderRadius: tokens.radius.full,
    borderWidth: 1,
    borderColor: tokens.colors.primary100,
  },
  suggestionText: {
    ...tokens.typography.caption,
    color: tokens.colors.primary500,
    fontWeight: '500',
  },
  ticketOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.primary500,
    marginTop: tokens.spacing.sm,
    gap: tokens.spacing.sm,
  },
  ticketOptionText: {
    color: tokens.colors.primary500,
    fontWeight: '600',
  },
  ticketCard: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginTop: tokens.spacing.sm,
    ...tokens.elevation.level2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  ticketTitle: {
    fontWeight: '700',
    color: tokens.colors.text,
  },
  label: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    marginBottom: 4,
  },
  ticketInput: {
    backgroundColor: tokens.colors.neutral50,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  ticketBtn: {
    paddingVertical: 12,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  ticketBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
