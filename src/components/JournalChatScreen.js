import React, {useState, useRef, useEffect} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {journalService} from '../services/api/journalService';
import {useAuth} from '../context/AuthContext';
import AppContainer from './AppContainer';
import LeftArrow from '../../utils/icons/leftArrow.svg';
import Aarya from '../../utils/icons/Aarya.svg';
import Send from '../../utils/icons/send.svg';

const JournalChatScreen = ({
  onComplete,
  navigation, // Navigation prop for going back
  journalContext = null,
  route, // Add route prop to get navigation params
}) => {
  const {user} = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [conversationCompleted, setConversationCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [conversationId, setConversationId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingJournalData, setExistingJournalData] = useState(null);
  const scrollViewRef = useRef();
  const inputRef = useRef(null);

  // Check if we're in edit mode (coming from summary screen)
  useEffect(() => {
    const editJournalData = route?.params?.editJournalData;
    const journalDate = route?.params?.journalDate;
    
    console.log('🔍 Route params:', route?.params);
    console.log('🔍 editJournalData:', editJournalData);
    console.log('🔍 journalDate:', journalDate);
    
    if (editJournalData && journalDate) {
      console.log('✅ Edit mode detected');
      setIsEditMode(true);
      setExistingJournalData(editJournalData);
      loadExistingConversation(journalDate);
    } else {
      console.log('✅ Normal mode - initializing new conversation');
      initializeConversation();
    }
  }, [route?.params]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const loadExistingConversation = async (journalDate) => {
    try {
      setIsLoading(true);
      
      // Debug logging
      console.log('🔍 Loading existing conversation for date:', journalDate);
      console.log('🔍 Edit journal data:', existingJournalData);

      // Add welcome message from Aarya for edit mode
      const welcomeMessage = {
        id: 1,
        text: `Hey Hi ${
          user?.username || 'there'
        }! 👋\n\nLet's review and edit your journal entry from ${formatDate(journalDate)}.`,
        sender: 'ai',
        timestamp: generateTimestamp(),
      };

      setMessages([welcomeMessage]);

      // Try to load existing conversation from backend
      try {
        console.log('🔍 Calling getJournalByDate...');
        const response = await journalService.getJournalByDate(journalDate);
        console.log('🔍 getJournalByDate response:', response);

        if (response && response.messages) {
          console.log('🔍 Found messages:', response.messages.length);
          
          // Add existing messages to the conversation
          const existingMessages = response.messages.map((msg, index) => ({
            id: index + 2, // Start from 2 since welcome message is id 1
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp || generateTimestamp(),
            step: msg.step,
            questionId: msg.questionId,
          }));

          setMessages(prev => [...prev, ...existingMessages]);
          setConversationId(response.conversationId || null);
          setCurrentStep(response.currentStep || 0);
          // Don't set conversationCompleted to true in edit mode - we want to continue chatting
          setConversationCompleted(false);

          // Add edit instruction message and start new conversation
          const editInstructionMessage = {
            id: existingMessages.length + 2,
            text: "Great! I can see your previous responses above. Let's start a fresh conversation to update your journal.",
            sender: 'ai',
            timestamp: generateTimestamp(),
            isEditInstruction: true,
          };

          setMessages(prev => [...prev, editInstructionMessage]);
          
          // Start a new conversation session for editing
          console.log('✅ Starting new conversation for editing...');
          try {
            const newConversationResponse = await journalService.startConversation();
            
            if (newConversationResponse.question) {
              const newQuestionMessage = {
                id: existingMessages.length + 3,
                text: newConversationResponse.question,
                sender: 'ai',
                timestamp: generateTimestamp(),
                step: newConversationResponse.step || 0,
                questionId: newConversationResponse.questionId || null,
              };
              
              setMessages(prev => [...prev, newQuestionMessage]);
              setCurrentStep(newConversationResponse.step || 0);
              // Don't override the existing conversationId, we'll use it for updates
            }
          } catch (newConversationError) {
            console.log('Failed to start new conversation for editing:', newConversationError);
            
            // Fallback question
            const fallbackQuestionMessage = {
              id: existingMessages.length + 3,
              text: "Let's start fresh! How are you feeling today? 😄 😊 😐 😢 😡 🥱",
              sender: 'ai',
              timestamp: generateTimestamp(),
              step: 0,
              isFallback: true,
            };
            
            setMessages(prev => [...prev, fallbackQuestionMessage]);
            setCurrentStep(0);
          }
          
          console.log('✅ Successfully loaded existing conversation and started edit mode');
        } else {
          console.log('❌ No messages found in response');
        }
      } catch (editLoadError) {
        console.log('❌ Edit load error:', editLoadError);
        console.log('❌ Falling back to new conversation');
        
        // Don't fall back to new conversation, show error instead
        const errorMessage = {
          id: 2,
          text: "I couldn't load your previous conversation, but you can still continue chatting here!",
          sender: 'ai',
          timestamp: generateTimestamp(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      }

      setConversationStarted(true);
    } catch (error) {
      console.error('❌ Failed to load existing conversation:', error);
      
      // Fallback to error message
      const errorMessage = {
        id: 2,
        text: "I couldn't load your previous conversation. Let's start fresh! How are you feeling today?",
        sender: 'ai',
        timestamp: generateTimestamp(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      setConversationStarted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeConversation = async () => {
    try {
      setIsLoading(true);

      // Add welcome message from Aarya
      const welcomeMessage = {
        id: 1,
        text: `Hey Hi ${
          user?.username || 'there'
        }! 👋\n\nI'm Aarya, your AI companion. I'll help you journal about your day through a friendly conversation.`,
        sender: 'ai',
        timestamp: generateTimestamp(),
      };

      setMessages([welcomeMessage]);

      // Start the conversation with your backend
      const response = await journalService.startConversation();

      // Add the first question from backend
      if (response.question) {
        const questionMessage = {
          id: 2,
          text: response.question,
          sender: 'ai',
          timestamp: generateTimestamp(),
          step: response.step || 0,
          questionId: response.questionId || null, // Make optional
        };

        setMessages(prev => [...prev, questionMessage]);
        setCurrentStep(response.step || 0);
        setConversationId(response.conversationId || null); // Make optional
      }

      setConversationStarted(true);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);

      // Fallback if backend is unavailable
      const fallbackMessage = {
        id: 2,
        text: "Let's start with a simple question: How are you feeling today? 😄 😊 😐 😢 😡 🥱",
        sender: 'ai',
        timestamp: generateTimestamp(),
        isFallback: true,
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setConversationStarted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generateTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBackPress = () => {
    // Navigate back to previous screen
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || conversationCompleted) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: generateTimestamp(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');

    setIsLoading(true);
    setIsTyping(true);

    try {
      let response;
      
      if (isEditMode && conversationId) {
        // In edit mode, we treat it as a new conversation but will update the existing journal
        console.log('🔄 Edit mode: Sending message to continue new conversation');
        response = await journalService.sendMessage(messageToSend);
      } else {
        // Regular conversation flow
        response = await journalService.sendMessage(messageToSend);
      }

      // Simulate typing delay for better UX
      setTimeout(() => {
        if (response.message) {
          // Conversation completed
          const completionMessage = {
            id: messages.length + 2,
            text: response.message,
            sender: 'ai',
            timestamp: generateTimestamp(),
            isCompletion: true,
          };

          setMessages(prev => [...prev, completionMessage]);
          setConversationCompleted(true);
          setTimeout(() => {
            handleComplete();
          }, 3000);
        } else if (response.question) {
          // Next question in the conversation
          const questionMessage = {
            id: messages.length + 2,
            text: response.question,
            sender: 'ai',
            timestamp: generateTimestamp(),
            step: response.step || currentStep + 1,
            questionId: response.questionId,
          };

          setMessages(prev => [...prev, questionMessage]);
          setCurrentStep(response.step || currentStep + 1);
        }

        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble right now. Let me try a different approach. Could you tell me about your day?",
        sender: 'ai',
        timestamp: generateTimestamp(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      if (isEditMode && conversationId) {
        // In edit mode, update the existing journal entry
        console.log('🔄 Edit mode: Updating existing journal entry');
        
        // Extract new user responses (after the edit instruction message)
        const allMessages = messages;
        const editInstructionIndex = allMessages.findIndex(m => m.isEditInstruction);
        const newMessages = editInstructionIndex >= 0 ? allMessages.slice(editInstructionIndex + 1) : [];
        const newUserResponses = newMessages.filter(m => m.sender === 'user').map(m => m.text);
        
        console.log('🔄 New user responses:', newUserResponses);
        
        // Prepare update data based on new responses
        const updateData = {
          journal_id: conversationId,
        };
        
        // Map responses to fields (this matches your backend structure)
        if (newUserResponses.length > 0) updateData.mood = newUserResponses[0]; // mood
        if (newUserResponses.length > 1) updateData.food_intake = newUserResponses[1];
        if (newUserResponses.length > 2) updateData.personal = newUserResponses[2];
        if (newUserResponses.length > 3) updateData.work_or_study = newUserResponses[3];
        if (newUserResponses.length > 4) updateData.sleep = newUserResponses[4];
        if (newUserResponses.length > 5) updateData.extra_note = newUserResponses.slice(5).join(' | ');
        
        try {
          await journalService.updateConversationJournal(updateData);
          console.log('✅ Journal entry updated successfully');
        } catch (updateError) {
          console.error('❌ Failed to update journal entry:', updateError);
        }
        
        // Prepare conversation data for navigation
        const conversationData = {
          conversationId,
          messages: messages,
          messageCount: messages.length,
          userResponses: allMessages.filter(m => m.sender === 'user').map(m => m.text),
          conversationSummary: allMessages.filter(m => m.sender === 'user').map(m => m.text).join(' | '),
          journalContext: journalContext,
          completedAt: new Date().toISOString(),
          step: currentStep,
          isEditMode: true,
          existingJournalData,
        };

        // Navigate back with edit mode flag
        navigation.navigate('MainTabs', {
          screen: 'Journal',
          params: {
            chatResults: conversationData,
            isEditMode: true,
          },
        });
      } else {
        // Regular completion flow
        const conversationData = {
          conversationId,
          messages: messages,
          messageCount: messages.length,
          userResponses: messages
            .filter(m => m.sender === 'user')
            .map(m => m.text),
          conversationSummary: messages
            .filter(m => m.sender === 'user')
            .map(m => m.text)
            .join(' | '),
          journalContext: journalContext,
          completedAt: new Date().toISOString(),
          step: currentStep,
          isEditMode: false,
          existingJournalData,
        };

        // Navigate back to JournalReflection with chat results
        navigation.navigate('MainTabs', {
          screen: 'Journal',
          params: {
            chatResults: conversationData,
            isEditMode: false,
          },
        });
      }
    } catch (error) {
      console.error('Error completing conversation:', error);
      Alert.alert(
        'Error',
        'Failed to complete conversation. Please try again.',
      );
    }
  };

  const renderMoodOptions = () => {
    const moods = ['😄', '😊', '😐', '😢', '😡', '🥱'];

    return (
      <View style={styles.moodOptionsContainer}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moodButton}
            onPress={() => {
              setInputMessage(mood);
              // Auto send after selection
              setTimeout(() => {
                handleSendMessage();
              }, 100);
            }}
            activeOpacity={0.7}>
            <Text style={styles.moodEmoji}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMessage = message => {
    const isUser = message.sender === 'user';
    const showMoodOptions =
      message.text.includes('😄 😊 😐 😢 😡 🥱') && !isUser;

    return (
      <View key={message.id} style={styles.messageContainer}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessage : styles.aiMessage,
            message.isError && styles.errorMessage,
            message.isFallback && styles.fallbackMessage,
            message.isCompletion && styles.completionMessage,
            message.isEditInstruction && styles.editInstructionMessage,
          ]}>
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.aiMessageText,
            ]}>
            {message.text}
          </Text>

          {message.isFallback && (
            <Text style={styles.fallbackIndicator}>Offline mode</Text>
          )}

          {message.isCompletion && (
            <Text style={styles.completionIndicator}>
              ✅ Journal {isEditMode ? 'updated' : 'saved'}.
            </Text>
          )}

          {message.isEditInstruction && (
            <Text style={styles.editIndicator}>📝 Edit mode</Text>
          )}
        </View>

        <Text
          style={[
            styles.messageTime,
            isUser ? styles.userMessageTime : styles.aiMessageTime,
          ]}>
          {message.timestamp}
        </Text>

        {/* Show mood options for mood question */}
        {showMoodOptions && !conversationCompleted && renderMoodOptions()}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.messageContainer}>
        <View
          style={[styles.messageBubble, styles.aiMessage, styles.typingBubble]}>
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, {animationDelay: '0.2s'}]} />
            <View style={[styles.typingDot, {animationDelay: '0.4s'}]} />
          </View>
          <Text style={styles.typingText}>Aarya is thinking...</Text>
        </View>
      </View>
    );
  };

  const getProgressText = () => {
    if (isEditMode) return 'Editing journal';
    if (currentStep === 0) return 'Getting to know you';
    if (currentStep > 4) return 'Wrapping up';
    return '';
  };

  const getHeaderTitle = () => {
    return isEditMode ? 'Edit Journal' : 'Aarya AI';
  };

  return (
    <AppContainer>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 35}>
          {/* Chat Header - Only header in the screen */}
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}>
              <LeftArrow />
            </TouchableOpacity>

            <View style={styles.chatHeaderContent}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.chatHeaderTitle}>{getHeaderTitle()}</Text>
                <Text style={styles.chatHeaderSubtitle}>
                  {isTyping
                    ? 'Typing...'
                    : conversationCompleted
                    ? 'Complete'
                    : getProgressText()}
                </Text>
              </View>
            </View>
          </View>

          {/* Chat Messages */}
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            style={styles.chatMessagesContainer}
            contentContainerStyle={[styles.chatMessagesContent]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {messages.map(renderMessage)}
            {renderTypingIndicator()}
          </KeyboardAwareScrollView>

          {/* Chat Input */}
          <View style={styles.chatInputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.textInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.chatInput}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder={
                    conversationCompleted
                      ? `Journal ${isEditMode ? 'updated' : 'completed'}, redirecting to Summary...`
                      : isEditMode
                      ? 'Type your response here...'
                      : 'Type your message here'
                  }
                  placeholderTextColor="rgba(228, 198, 127, 0.40)"
                  multiline
                  maxLength={500}
                  editable={!isLoading && !conversationCompleted}
                  returnKeyType="default"
                  blurOnSubmit={false}
                />
              </View>

              {!conversationCompleted && (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  activeOpacity={0.7}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#E4C67F" />
                  ) : (
                    <Send />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  // Header Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 1,
    height: 0,
  },
  headerTextContainer: {
    flex: 1,
  },
  chatHeaderTitle: {
    color: '#E4C67F',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  chatHeaderSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Urbanist',
  },
  stepIndicator: {
    backgroundColor: 'rgba(228, 198, 127, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepText: {
    color: '#E4C67F',
    fontSize: 10,
    fontWeight: '600',
  },

  // Messages Styles
  chatMessagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatMessagesContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(94, 94, 94, 0.3)',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E4C67F',
  },
  errorMessage: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  fallbackMessage: {
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  completionMessage: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  editInstructionMessage: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    lineHeight: 20,
  },
  aiMessageText: {
    color: 'white',
  },
  userMessageText: {
    color: '#000000',
  },
  fallbackIndicator: {
    fontSize: 10,
    color: 'rgba(255, 193, 7, 0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  completionIndicator: {
    fontSize: 10,
    color: 'rgba(76, 175, 80, 0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  editIndicator: {
    fontSize: 10,
    color: 'rgba(138, 43, 226, 0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Urbanist',
    opacity: 0.7,
  },
  aiMessageTime: {
    color: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'flex-start',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },

  // Mood Options
  moodOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.3)',
  },
  moodEmoji: {
    fontSize: 24,
  },

  // Typing Indicator
  typingBubble: {
    paddingVertical: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  typingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontStyle: 'italic',
  },

  // Input Styles
  chatInputContainer: {
    padding: 16,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 0,
  },
  textInputContainer: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
  },
  chatInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 24,
    paddingVertical: 0,
  },
  sendButton: {
    width: 48,
    height: 50,
    backgroundColor: '#765A19',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
  },

  // Complete Button
  completeButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  completeButton: {
    backgroundColor: '#E4C67F',
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default JournalChatScreen;